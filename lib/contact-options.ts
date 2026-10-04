/**
 * Contact form option sets.
 *
 * These live in their own dependency-free module because both the client form
 * and the Mongoose schema need them. Exporting them from `models/message.ts`
 * instead — which is what an earlier revision did — pulled mongoose and bson
 * into the browser bundle, roughly 300KB gzipped of server-only code shipped
 * to every visitor.
 */
export const SERVICES = [
  "Consulting",
  "Website",
  "Animation",
  "Backend",
] as const;

export const BUDGETS = ["<5k", "5–15k", "15–50k", "50k+"] as const;

export type Service = (typeof SERVICES)[number];
export type Budget = (typeof BUDGETS)[number];
