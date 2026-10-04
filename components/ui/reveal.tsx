"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { EASE_OUT, maskLine, stagger, VIEWPORT } from "@/lib/motion";

/**
 * Reveals text line by line from behind a clip.
 *
 * Splitting by line rather than by character is intentional: the old build
 * mounted one `<p>` per character with a per-character delay, which meant
 * ~50 animating elements for a three-word label. A line is one element and
 * reads better.
 */
export function RevealLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as = "div",
}: {
  lines: ReactNode[];
  className?: string;
  lineClassName?: string;
  delay?: number;
  as?: "div" | "h1" | "h2" | "p";
}) {
  const Wrapper = m[as];

  return (
    <Wrapper
      variants={stagger(0.09, delay)}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      className={className}
    >
      {lines.map((line, i) => (
        // The clip lives on a wrapper so the child can translate freely
        // without `overflow: hidden` fighting its descenders.
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <m.span
            variants={maskLine}
            className={cn("block will-change-transform", lineClassName)}
          >
            {line}
          </m.span>
        </span>
      ))}
    </Wrapper>
  );
}

/**
 * Word-level stagger with a blur lift. Reserved for the hero, where the
 * extra fidelity is worth ~12 animating spans.
 */
export function RevealWords({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");

  return (
    <m.span
      aria-label={text}
      variants={stagger(0.045, delay)}
      initial="hidden"
      animate="show"
      className={cn("inline-flex flex-wrap", className)}
    >
      {words.map((word, i) => (
        <m.span
          key={`${word}-${i}`}
          aria-hidden
          variants={{
            hidden: { opacity: 0, y: "0.4em", filter: "blur(6px)" },
            show: {
              opacity: 1,
              y: "0em",
              filter: "blur(0px)",
              transition: { duration: 0.7, ease: EASE_OUT },
            },
          }}
          className="mr-[0.25em] inline-block"
        >
          {word}
        </m.span>
      ))}
    </m.span>
  );
}
