/**
 * Fixed-window, in-memory rate limiter.
 *
 * Deliberately simple: one process, one Map, no dependency. That is the right
 * trade for a contact form — it stops a single client hammering the mail
 * transport, and the worst case if an instance recycles is that someone gets
 * a fresh window. A distributed limiter (Upstash, Vercel KV) is the upgrade
 * path if this ever needs to hold across instances.
 */
type Entry = { count: number; resetAt: number };

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
/** Stop the Map growing without bound on a long-lived instance. */
const MAX_KEYS = 5000;

declare global {
  var _rateLimitStore: Map<string, Entry> | undefined;
}

const store: Map<string, Entry> = globalThis._rateLimitStore ?? new Map();
globalThis._rateLimitStore = store;

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function rateLimit(key: string): RateLimitResult {
  const now = Date.now();

  if (store.size > MAX_KEYS) {
    for (const [k, v] of store) {
      if (v.resetAt <= now) store.delete(k);
    }
    // Still oversized means sustained unique traffic; drop the whole window
    // rather than leak memory.
    if (store.size > MAX_KEYS) store.clear();
  }

  const entry = store.get(key);

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_REQUESTS - 1, retryAfterSeconds: 0 };
  }

  entry.count += 1;

  if (entry.count > MAX_REQUESTS) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000),
    };
  }

  return {
    ok: true,
    remaining: MAX_REQUESTS - entry.count,
    retryAfterSeconds: 0,
  };
}

/**
 * Best-effort client identity.
 *
 * On Vercel `x-forwarded-for` is set by the platform edge and is the left-most
 * entry. It is spoofable in principle, so this is abuse damping, not auth.
 */
export function clientKey(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? "unknown";
}
