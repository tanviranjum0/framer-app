import { NextResponse, type NextRequest } from "next/server";

import { validateContact } from "@/lib/contact-schema";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { connectToDatabase, isDatabaseConfigured } from "@/lib/db";
import { isMailConfigured, sendContactMail } from "@/lib/mail";
import Message from "@/models/message";

/** mongoose and nodemailer both need Node APIs, so no edge runtime here. */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 16 * 1024;

type Ok = { ok: true; stored: boolean; mailed: boolean; demo: boolean };
type Err = {
  ok: false;
  error: string;
  reason?: "rate_limited" | "invalid" | "not_configured" | "server_error";
  fields?: Record<string, string>;
};

export async function POST(request: NextRequest): Promise<NextResponse<Ok | Err>> {
  // ── Abuse damping ──────────────────────────────────────────────────────
  const limit = rateLimit(clientKey(request.headers));
  if (!limit.ok) {
    return NextResponse.json<Err>(
      {
        ok: false,
        reason: "rate_limited",
        error: "Too many messages from this address. Try again shortly.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  // ── Parse ──────────────────────────────────────────────────────────────
  // JSON, not multipart. The old form built a FormData with a base64 image
  // field that was read before the FileReader had resolved, so it always sent
  // an empty string — and it could post a multi-megabyte data URI into Mongo.
  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json<Err>(
        { ok: false, reason: "invalid", error: "Message is too large." },
        { status: 413 },
      );
    }
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json<Err>(
      { ok: false, reason: "invalid", error: "Malformed request body." },
      { status: 400 },
    );
  }

  // ── Validate ───────────────────────────────────────────────────────────
  const { ok, errors, value } = validateContact(
    (payload ?? {}) as Record<string, string>,
  );

  if (!ok) {
    return NextResponse.json<Err>(
      {
        ok: false,
        reason: "invalid",
        error: "Some fields need attention.",
        fields: errors as Record<string, string>,
      },
      { status: 422 },
    );
  }

  // ── Demo mode ──────────────────────────────────────────────────────────
  // With no secrets configured the form still validates and still answers
  // honestly, rather than throwing a 500 that looks like a broken site.
  const canStore = isDatabaseConfigured();
  const canMail = isMailConfigured();

  if (!canStore && !canMail) {
    return NextResponse.json<Ok>(
      { ok: true, stored: false, mailed: false, demo: true },
      { status: 200 },
    );
  }

  // ── Persist and deliver ────────────────────────────────────────────────
  let stored = false;
  let mailed = false;

  try {
    if (canStore) {
      await connectToDatabase();
      await Message.create({
        ...value,
        userAgent: request.headers.get("user-agent")?.slice(0, 400),
      });
      stored = true;
    }

    if (canMail) {
      await sendContactMail(value);
      mailed = true;
    }
  } catch (error) {
    // Log the detail server-side; return nothing that describes the
    // infrastructure to the caller.
    console.error("[contact] delivery failed:", error);

    // A stored message is still a delivered message as far as the visitor is
    // concerned — it will be seen. Only report failure if nothing landed.
    if (!stored) {
      return NextResponse.json<Err>(
        {
          ok: false,
          reason: "server_error",
          error: "Could not send that right now. Email works too.",
        },
        { status: 502 },
      );
    }
  }

  return NextResponse.json<Ok>(
    { ok: true, stored, mailed, demo: false },
    { status: 201 },
  );
}
