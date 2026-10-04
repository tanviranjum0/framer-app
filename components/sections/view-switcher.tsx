"use client";

import { AnimatePresence, m } from "motion/react";
import { useState } from "react";

import { Section } from "@/components/ui/section";
import { EASE_IN_OUT, stagger } from "@/lib/motion";
import { cn } from "@/lib/utils";

const VIEWS = [
  {
    id: "wipe",
    label: "Clip wipe",
    heading: "Reveal by clipping",
    body: "The outgoing panel closes from the bottom while the incoming one opens from the top. clip-path is composited, so a full-bleed wipe costs the same as a small one.",
    snippet: `exit:  { clipPath: "inset(100% 0 0 0)" }
enter: { clipPath: "inset(0 0 100% 0)" }`,
    accent: "mint" as const,
  },
  {
    id: "slide",
    label: "Axis slide",
    heading: "Carry the direction",
    body: "Both panels translate along the same axis, so the pair reads as one object moving rather than two unrelated fades. mode=\"wait\" holds the incoming panel until the outgoing one has left.",
    snippet: `exit:  { x: "-12%", opacity: 0 }
enter: { x: "12%",  opacity: 0 }`,
    accent: "violet" as const,
  },
  {
    id: "scale",
    label: "Depth push",
    heading: "Push through depth",
    body: "Scale plus opacity suggests the panels are stacked rather than side by side. Useful when the two views are the same content at different levels of detail.",
    snippet: `exit:  { scale: 1.06, opacity: 0 }
enter: { scale: 0.94, opacity: 0 }`,
    accent: "amber" as const,
  },
];

const VARIANTS = {
  wipe: {
    initial: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
    animate: { clipPath: "inset(0 0 0% 0)", opacity: 1 },
    exit: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
  },
  slide: {
    initial: { x: "12%", opacity: 0 },
    animate: { x: "0%", opacity: 1 },
    exit: { x: "-12%", opacity: 0 },
  },
  scale: {
    initial: { scale: 0.94, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.06, opacity: 0 },
  },
} as const;

const ACCENT_BG = {
  mint: "from-mint/20 via-surface to-surface",
  violet: "from-violet/20 via-surface to-surface",
  amber: "from-amber/20 via-surface to-surface",
} as const;

/**
 * Transition styles between two full panels.
 *
 * The previous version duplicated the entire panel markup for each of its two
 * states, with the same inline variants object written twice — and both
 * copies set the same clip-path for `initialState` and `animateState`, so the
 * reveal never actually played. Here the panel is one component and the
 * transition is data.
 */
export function ViewSwitcher() {
  const [active, setActive] = useState(0);
  const view = VIEWS[active];

  return (
    <Section
      id="views"
      index="10"
      kicker="View transitions"
      title="Swapping a whole panel without a flash"
      note='AnimatePresence with mode="wait" holds the incoming panel until the outgoing one has finished leaving, which is what stops the two overlapping mid-swap.'
    >
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Transition style"
        className="mb-6 flex flex-wrap gap-2"
      >
        {VIEWS.map((item, i) => (
          <button
            key={item.id}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`view-${item.id}`}
            onClick={() => setActive(i)}
            className={cn(
              "relative rounded-full px-5 py-2.5 font-mono text-xs transition-colors",
              i === active ? "text-ink" : "text-fg-muted hover:text-fg",
            )}
          >
            {i === active ? (
              // layoutId makes the pill travel between tabs instead of
              // appearing in place — one shared element, no cross-fade.
              <m.span
                layoutId="view-pill"
                className="absolute inset-0 rounded-full bg-mint"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            ) : null}
            <span className="relative z-10">{item.label}</span>
          </button>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-raised">
        {/* A fixed aspect box, so the swap never changes the page's height
            and nothing below it jumps. */}
        <div className="relative aspect-[4/5] sm:aspect-[16/10] lg:aspect-[21/9]">
          <AnimatePresence mode="wait" initial={false}>
            <m.div
              key={view.id}
              id={`view-${view.id}`}
              role="tabpanel"
              variants={VARIANTS[view.id as keyof typeof VARIANTS]}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.65, ease: EASE_IN_OUT }}
              className={cn(
                "absolute inset-0 bg-gradient-to-br",
                ACCENT_BG[view.accent],
              )}
            >
              <m.div
                variants={stagger(0.07, 0.15)}
                initial="hidden"
                animate="show"
                className="flex size-full flex-col justify-end gap-5 p-6 sm:p-10 lg:p-14"
              >
                <m.span
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="label"
                >
                  {String(active + 1).padStart(2, "0")} / {VIEWS.length}
                </m.span>

                <m.h3
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="max-w-2xl text-(length:--text-h2)"
                >
                  {view.heading}
                </m.h3>

                <m.p
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base"
                >
                  {view.body}
                </m.p>

                <m.pre
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                  className="w-fit max-w-full overflow-x-auto rounded-lg border border-line bg-ink/60 p-4 font-mono text-[0.6875rem] leading-relaxed text-fg-muted backdrop-blur-sm sm:text-xs"
                >
                  <code>{view.snippet}</code>
                </m.pre>
              </m.div>
            </m.div>
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
