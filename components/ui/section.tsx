"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { fadeUp, maskLine, stagger, VIEWPORT } from "@/lib/motion";

type SectionProps = {
  id: string;
  index: string;
  title: ReactNode;
  kicker: string;
  /** The engineering note. This is what makes it a lab and not a demo reel. */
  note?: string;
  children: ReactNode;
  className?: string;
  /** Skip `content-visibility` where a section owns a scroll timeline. */
  eager?: boolean;
};

/**
 * The frame every showcase section sits in.
 *
 * Headings animate from a clipping parent (`maskLine`) rather than fading,
 * which reads as deliberate typesetting instead of a generic fade-in — and
 * costs exactly one transform per line.
 */
export function Section({
  id,
  index,
  title,
  kicker,
  note,
  children,
  className,
  eager = false,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn(
        "relative scroll-mt-24 py-20 sm:py-28 lg:py-36",
        !eager && "deferred",
        className,
      )}
    >
      <div className="shell">
        <m.header
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mb-12 sm:mb-16 lg:mb-20"
        >
          <m.div
            variants={fadeUp}
            className="mb-5 flex items-baseline gap-4 border-b border-line pb-4"
          >
            <span className="label text-mint">{index}</span>
            <span className="label">{kicker}</span>
          </m.div>

          <div className="overflow-hidden pb-[0.12em]">
            <m.h2
              id={`${id}-title`}
              variants={maskLine}
              className="text-(length:--text-h2) max-w-4xl"
            >
              {title}
            </m.h2>
          </div>

          {note ? (
            <m.p
              variants={fadeUp}
              className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-fg-muted sm:text-[0.8125rem]"
            >
              {note}
            </m.p>
          ) : null}
        </m.header>

        {children}
      </div>
    </section>
  );
}
