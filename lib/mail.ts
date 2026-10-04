import "server-only";

import type { ContactInput } from "@/lib/contact-schema";

/**
 * Transactional mail.
 *
 * Every credential below is read from a non-`NEXT_PUBLIC_` variable. The
 * previous route used `process.env.NEXT_PUBLIC_NODEMAILER_GMAIL` and
 * `process.env.NEXT_PUBLIC_GMAIL_PASS`, and Next inlines anything with that
 * prefix into the client bundle — which published the Gmail app password to
 * every visitor who opened devtools.
 *
 * The `server-only` import makes importing this file from a client component
 * a build error, so that class of mistake cannot recur silently.
 */

export const isMailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.CONTACT_TO,
  );

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

async function getTransport() {
  // Imported lazily so nodemailer is never pulled in on a cold start that
  // does not send mail.
  const nodemailer = await import("nodemailer");

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendContactMail(input: ContactInput) {
  const transport = await getTransport();
  const from = process.env.CONTACT_FROM ?? process.env.SMTP_USER!;
  const to = process.env.CONTACT_TO!;

  // Notification to the site owner. `replyTo` carries the visitor's address
  // so a reply goes to the right place without the From: header claiming to
  // be them — which is what gets mail marked as spoofed.
  const notify = transport.sendMail({
    from: `"Motion Lab" <${from}>`,
    to,
    replyTo: input.email,
    subject: `New enquiry — ${input.service} — ${input.name}`,
    text: [
      `Name:    ${input.name}`,
      `Email:   ${input.email}`,
      `Service: ${input.service}`,
      `Budget:  ${input.budget}`,
      "",
      input.message,
    ].join("\n"),
    html: `
      <div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6">
        <h2 style="margin:0 0 16px">New enquiry</h2>
        <table cellpadding="0" cellspacing="0" style="font-size:14px">
          <tr><td style="padding-right:16px;color:#667"><b>Name</b></td><td>${escapeHtml(input.name)}</td></tr>
          <tr><td style="padding-right:16px;color:#667"><b>Email</b></td><td>${escapeHtml(input.email)}</td></tr>
          <tr><td style="padding-right:16px;color:#667"><b>Service</b></td><td>${escapeHtml(input.service)}</td></tr>
          <tr><td style="padding-right:16px;color:#667"><b>Budget</b></td><td>${escapeHtml(input.budget)}</td></tr>
        </table>
        <p style="margin:20px 0 0;white-space:pre-wrap">${escapeHtml(input.message)}</p>
      </div>
    `,
  });

  // Acknowledgement to the visitor.
  const acknowledge = transport.sendMail({
    from: `"Tanvir Anjum" <${from}>`,
    to: input.email,
    subject: "Thanks — your message landed",
    text: `Hi ${input.name},\n\nThanks for getting in touch about ${input.service.toLowerCase()}. I read everything that comes through here and I'll reply within about 12 hours.\n\n— Tanvir`,
  });

  // Settled, not all: the owner notification succeeding matters more than the
  // courtesy copy, and one failing should not fail the submission.
  const results = await Promise.allSettled([notify, acknowledge]);

  const notifyResult = results[0];
  if (notifyResult.status === "rejected") {
    throw notifyResult.reason instanceof Error
      ? notifyResult.reason
      : new Error("Failed to deliver notification mail");
  }
}
