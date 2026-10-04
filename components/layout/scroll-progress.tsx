"use client";

import { m, useScroll, useSpring } from "motion/react";

import { SCROLL_SPRING } from "@/lib/motion";

/**
 * Page-level reading indicator.
 *
 * `scaleX` on a GPU layer rather than animating `width`, which would relayout
 * the bar 60 times a second. The spring removes wheel-step jitter.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <m.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-px origin-left bg-gradient-to-r from-mint via-mint to-violet"
    />
  );
}
