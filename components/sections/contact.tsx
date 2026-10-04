"use client";

import { m, useReducedMotion } from "motion/react";
import { ArrowUpRight, Loader2, ShieldCheck } from "lucide-react";
import { useCallback, useId, useState } from "react";

import { useToast } from "@/components/providers/toast-provider";
import { Section } from "@/components/ui/section";
import { LIMITS, validateContact, type FieldErrors } from "@/lib/contact-schema";
import { BUDGETS, SERVICES } from "@/lib/contact-options";
import { SPRING, VIEWPORT, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

const ASSURANCES = [
  "A reply within about 12 hours",
  "Happy to sign an NDA first",
  "Fixed scope or ongoing retainer",
];

type Status = "idle" | "sending" | "sent";

const EMPTY = {
  name: "",
  email: "",
  message: "",
  service: SERVICES[0] as string,
  budget: BUDGETS[0] as string,
};

/**
 * Contact form.
 *
 * Every field is React-controlled. The previous version read its values out
 * of the DOM with `document.getElementById("name").value` at submit time,
 * which meant React had no idea what the form contained, validation could not
 * run per-field, and the inputs could not be reset or disabled coherently.
 */
export function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const { toast } = useToast();
  const reduced = useReducedMotion();
  const formId = useId();

  const set = useCallback(
    (key: keyof typeof EMPTY, value: string) => {
      setValues((prev) => ({ ...prev, [key]: value }));
      // Clear a field's error as soon as the visitor edits it, rather than
      // leaving stale red text under a field they have already fixed.
      setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
    },
    [],
  );

  const submit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "sending") return;

      // Same validator the route runs. Instant feedback, no round trip.
      const check = validateContact(values);
      if (!check.ok) {
        setErrors(check.errors);
        toast("Some fields need attention.", "error");
        return;
      }

      setStatus("sending");
      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(check.value),
        });

        const data = await response.json();

        if (!response.ok) {
          if (data?.fields) setErrors(data.fields);
          toast(data?.error ?? "Could not send that message.", "error");
          setStatus("idle");
          return;
        }

        setStatus("sent");
        setValues(EMPTY);
        toast(
          data?.demo
            ? "Validated. The form is in demo mode until mail credentials are set."
            : "Message sent. Talk soon.",
          data?.demo ? "info" : "success",
        );
      } catch {
        toast("Network trouble — try email instead.", "error");
        setStatus("idle");
      }
    },
    [status, values, toast],
  );

  return (
    <Section
      id="contact"
      index="11"
      kicker="Get in touch"
      title={
        <>
          Tell me about the thing you&apos;re{" "}
          <span className="font-serif text-mint">building</span>
        </>
      }
      note="Validated with one shared module on both sides, rate-limited per address, and credentials read only from server-side environment variables."
      className="border-t border-line"
    >
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* ── Left column ─────────────────────────────────────────────── */}
        <m.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="flex flex-col justify-between gap-10"
        >
          <ul className="flex flex-col gap-4">
            {ASSURANCES.map((item) => (
              <m.li
                key={item}
                variants={{
                  hidden: { opacity: 0, x: -16 },
                  show: { opacity: 1, x: 0 },
                }}
                className="flex items-center gap-3 text-base text-fg-muted sm:text-lg"
              >
                <ShieldCheck className="size-4 shrink-0 text-mint" aria-hidden />
                {item}
              </m.li>
            ))}
          </ul>

          <m.div
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            className="rounded-2xl border border-line bg-surface/50 p-6 sm:p-8"
          >
            <p className="label mb-3">Or skip the form</p>
            <a
              href="mailto:tanviranjum010@gmail.com?subject=Motion%20Lab%20enquiry"
              className="group inline-flex items-baseline gap-2 text-xl tracking-tight transition-colors hover:text-mint sm:text-2xl"
            >
              tanviranjum010@gmail.com
              <ArrowUpRight
                className="size-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden
              />
            </a>
            <p className="mt-4 text-sm leading-relaxed text-fg-muted">
              Chattogram, Bangladesh · UTC+6. Available for new work.
            </p>
          </m.div>
        </m.div>

        {/* ── Form ────────────────────────────────────────────────────── */}
        <form onSubmit={submit} noValidate className="flex flex-col gap-6">
          <ChoiceRow
            legend="Service"
            name={`${formId}-service`}
            options={SERVICES}
            value={values.service}
            onChange={(v) => set("service", v)}
          />

          <ChoiceRow
            legend="Budget"
            name={`${formId}-budget`}
            options={BUDGETS}
            value={values.budget}
            onChange={(v) => set("budget", v)}
            accent="violet"
          />

          <Field
            id={`${formId}-name`}
            label="Name"
            value={values.name}
            onChange={(v) => set("name", v)}
            error={errors.name}
            autoComplete="name"
            maxLength={LIMITS.name.max}
            disabled={status === "sending"}
          />

          <Field
            id={`${formId}-email`}
            label="Email"
            type="email"
            value={values.email}
            onChange={(v) => set("email", v)}
            error={errors.email}
            autoComplete="email"
            maxLength={LIMITS.email.max}
            disabled={status === "sending"}
          />

          <Field
            id={`${formId}-message`}
            label="Project"
            value={values.message}
            onChange={(v) => set("message", v)}
            error={errors.message}
            multiline
            maxLength={LIMITS.message.max}
            hint={`${values.message.length} / ${LIMITS.message.max}`}
            disabled={status === "sending"}
          />

          <m.button
            type="submit"
            disabled={status === "sending"}
            whileHover={reduced ? undefined : { scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            transition={SPRING.snappy}
            className={cn(
              "group relative mt-2 flex h-14 items-center justify-center gap-3 overflow-hidden rounded-xl",
              "bg-mint font-medium text-ink transition-colors",
              "disabled:cursor-wait disabled:opacity-80",
            )}
          >
            {status === "sending" ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Sending
              </>
            ) : status === "sent" ? (
              "Sent — thank you"
            ) : (
              <>
                Send message
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </>
            )}
          </m.button>
        </form>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

function ChoiceRow({
  legend,
  name,
  options,
  value,
  onChange,
  accent = "mint",
}: {
  legend: string;
  name: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  accent?: "mint" | "violet";
}) {
  return (
    <fieldset>
      <legend className="label mb-3">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = option === value;
          return (
            // A real radio group, so arrow keys work and the choice is
            // announced. The previous version used <span onClick>.
            <label
              key={option}
              className={cn(
                "relative cursor-pointer rounded-full border px-4 py-2 text-sm transition-colors",
                "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2",
                selected
                  ? accent === "mint"
                    ? "border-mint/50 text-mint has-[:focus-visible]:outline-mint"
                    : "border-violet/50 text-violet has-[:focus-visible]:outline-violet"
                  : "border-line text-fg-muted hover:border-line-hi hover:text-fg",
              )}
            >
              <input
                type="radio"
                name={name}
                value={option}
                checked={selected}
                onChange={() => onChange(option)}
                className="absolute inset-0 appearance-none opacity-0"
              />
              {selected ? (
                <m.span
                  layoutId={`${name}-pill`}
                  transition={SPRING.snappy}
                  className={cn(
                    "absolute inset-0 rounded-full",
                    accent === "mint" ? "bg-mint/10" : "bg-violet/10",
                  )}
                />
              ) : null}
              <span className="relative z-10">{option}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  multiline = false,
  autoComplete,
  maxLength,
  hint,
  disabled,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
  maxLength?: number;
  hint?: string;
  disabled?: boolean;
}) {
  const errorId = `${id}-error`;

  const shared = cn(
    "w-full rounded-xl border bg-surface/50 px-4 py-3.5 text-base text-fg",
    "placeholder:text-fg-faint transition-colors",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    error
      ? "border-rose/60 focus:ring-rose/40"
      : "border-line focus:border-mint/50 focus:ring-mint/30",
    disabled && "opacity-60",
  );

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="label">
          {label}
        </label>
        {hint ? (
          <span className="font-mono text-[0.6875rem] tabular-nums text-fg-faint">
            {hint}
          </span>
        ) : null}
      </div>

      {multiline ? (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={5}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder="What are you making, and what does it need to do?"
          className={cn(shared, "resize-y")}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          maxLength={maxLength}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className={shared}
        />
      )}

      {error ? (
        <m.p
          id={errorId}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 font-mono text-xs text-rose"
        >
          {error}
        </m.p>
      ) : null}
    </div>
  );
}
