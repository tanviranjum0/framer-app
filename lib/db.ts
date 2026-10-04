import "server-only";

import mongoose from "mongoose";

/**
 * Cached Mongoose connection.
 *
 * Next.js route handlers run in a long-lived process that is reused across
 * invocations and hot reloads. The previous helper called `connect()` and
 * `disconnect()` around every request, which both paid the full TLS
 * handshake per submission and raced itself under any concurrency.
 *
 * The promise is cached on `globalThis` so module re-evaluation during dev
 * hot reload reuses the same connection rather than opening a new pool each
 * time.
 */
type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

declare global {
  var _mongooseCache: Cache | undefined;
}

const cache: Cache = globalThis._mongooseCache ?? {
  conn: null,
  promise: null,
};
globalThis._mongooseCache = cache;

export const isDatabaseConfigured = () => Boolean(process.env.MONGODB_URI);

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not set");

  if (cache.conn) return cache.conn;

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        // Fail fast rather than letting a submission hang for 30 seconds.
        serverSelectionTimeoutMS: 8000,
      })
      .catch((error) => {
        // Clear the cached promise so the next request can retry instead of
        // awaiting a permanently rejected promise forever.
        cache.promise = null;
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
}
