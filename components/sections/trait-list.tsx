"use client";

import { m } from "motion/react";
import { Check } from "lucide-react";
import { useState } from "react";

import { Section } from "@/components/ui/section";
import { EASE_OUT, SPRING, VIEWPORT, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * The checklist content.
 *
 * The previous version of this section hand-wrote eleven near-identical
 * `motion.li` blocks — 217 lines, each with its own `onHoverStart` closure
 * calling `animate("#text7", ...)` against a hard-coded element id. Two of
 * them pointed at the wrong id, so those rows never reset after hover. As
 * data it is eleven lines and cannot drift.
 */
const TRAITS = [
  "Animates transform, opacity, filter and clip-path — nothing else",
  "Reads scroll through one timeline per section, never a scroll handler",
  "Keeps every panel mounted; crossfades instead of remounting",
  "Smooths scroll input at the source with a single spring",
  "Derives continuous values with useTransform, never with setState",
  "Detects coarse pointers and ships touch-native interactions instead",
  "Caps interactive grids at a few hundred plain nodes, not 1,410 hooks",
  "Loads its animation feature bundle lazily, behind the intro curtain",
  "Serves every image at its real display size, in AVIF where supported",
  "Stands down to instant transitions on prefers-reduced-motion",
  "Skips offscreen layout and paint with content-visibility",
];

export function TraitList() {
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  return (
    <Section
      id="principles"
      index="06"
      kicker="Operating rules"
      title="The constraints that keep it at sixty"
      note="Hover or tap a row. The lean is a variant on the list item, not an imperative animate() call against an element id — so it cannot target the wrong row, and it resets itself."
    >
      <m.ul
        variants={stagger(0.045)}
        initial="hidden"
        whileInView="show"
        viewport={VIEWPORT}
        className="mx-auto flex max-w-4xl flex-col gap-2.5"
      >
        {TRAITS.map((trait, i) => {
          const isChecked = checked.has(i);
          // Alternating lean direction, derived rather than hand-assigned.
          const lean = i % 2 === 0 ? 1 : -1;

          return (
            <m.li
              key={trait}
              variants={{
                hidden: { opacity: 0, y: 18, rotate: lean * -1.5 },
                show: {
                  opacity: 1,
                  y: 0,
                  rotate: 0,
                  transition: { duration: 0.55, ease: EASE_OUT },
                },
              }}
            >
              <m.button
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={isChecked}
                // whileHover and whileTap are declarative, so Motion owns
                // entering and leaving the state. The old imperative version
                // had to hand-write the reset on hover end.
                whileHover={{ rotate: lean * 1.1, scale: 1.015, x: lean * 4 }}
                whileTap={{ scale: 0.985 }}
                transition={SPRING.snappy}
                className={cn(
                  "group flex w-full items-start gap-4 rounded-xl border px-4 py-3.5 text-left sm:px-6 sm:py-4",
                  "transition-colors duration-300",
                  isChecked
                    ? "border-mint/40 bg-mint/[0.06]"
                    : "border-line bg-surface/50 hover:border-line-hi",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-md border transition-colors duration-300",
                    isChecked
                      ? "border-mint bg-mint text-ink"
                      : "border-line-hi text-transparent",
                  )}
                >
                  <m.span
                    initial={false}
                    animate={{ scale: isChecked ? 1 : 0.4, opacity: isChecked ? 1 : 0 }}
                    transition={SPRING.snappy}
                  >
                    <Check className="size-3.5" strokeWidth={3} aria-hidden />
                  </m.span>
                </span>

                <span className="font-mono text-[0.8125rem] leading-relaxed text-fg-muted transition-colors duration-300 group-hover:text-fg sm:text-sm">
                  {trait}
                </span>

                <span className="label ml-auto hidden shrink-0 pt-1 sm:block">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </m.button>
            </m.li>
          );
        })}
      </m.ul>

      <p className="mt-8 text-center font-mono text-xs text-fg-muted">
        {checked.size} / {TRAITS.length} acknowledged
      </p>
    </Section>
  );
}
