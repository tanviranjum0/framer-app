import { BUDGETS, SERVICES } from "@/lib/contact-options";

export type ContactInput = {
  name: string;
  email: string;
  message: string;
  service: string;
  budget: string;
};

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

/**
 * Shared validation, run on both sides.
 *
 * The client calls it to give instant feedback; the route calls it again
 * because a client-side check is a convenience, never a control. Keeping one
 * implementation means the two can't disagree about what is valid.
 *
 * Hand-written rather than pulling in a schema library: five fields does not
 * justify the dependency, and this stays tree-shakeable into the client.
 */

// Deliberately permissive. Strict RFC 5322 patterns reject valid addresses,
// and the only authoritative test is whether mail arrives.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const LIMITS = {
  name: { min: 2, max: 120 },
  email: { max: 200 },
  message: { min: 10, max: 5000 },
} as const;

export function validateContact(input: Partial<ContactInput>): {
  ok: boolean;
  errors: FieldErrors;
  value: ContactInput;
} {
  const value: ContactInput = {
    name: (input.name ?? "").trim(),
    email: (input.email ?? "").trim().toLowerCase(),
    message: (input.message ?? "").trim(),
    service: SERVICES.includes(input.service as (typeof SERVICES)[number])
      ? (input.service as string)
      : SERVICES[0],
    budget: BUDGETS.includes(input.budget as (typeof BUDGETS)[number])
      ? (input.budget as string)
      : BUDGETS[0],
  };

  const errors: FieldErrors = {};

  if (value.name.length < LIMITS.name.min) {
    errors.name = "Tell me what to call you.";
  } else if (value.name.length > LIMITS.name.max) {
    errors.name = `Keep this under ${LIMITS.name.max} characters.`;
  }

  if (!EMAIL.test(value.email)) {
    errors.email = "That does not look like an email address.";
  } else if (value.email.length > LIMITS.email.max) {
    errors.email = "That address is implausibly long.";
  }

  if (value.message.length < LIMITS.message.min) {
    errors.message = `A little more detail — at least ${LIMITS.message.min} characters.`;
  } else if (value.message.length > LIMITS.message.max) {
    errors.message = `Keep this under ${LIMITS.message.max} characters.`;
  }

  return { ok: Object.keys(errors).length === 0, errors, value };
}
