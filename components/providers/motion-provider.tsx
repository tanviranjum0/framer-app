"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

import { EASE_OUT } from "@/lib/motion";

const loadFeatures = () =>
  import("@/lib/motion-features").then((mod) => mod.default);

/**
 * Wraps the app in Motion's lazy feature loader and global defaults.
 *
 * Three things are happening:
 *
 * 1. `LazyMotion` splits ~25kB of animation features out of the first load.
 *    The CSS intro curtain covers the fetch, so the hero still animates.
 * 2. `strict` makes any stray `motion.*` component throw at render, which
 *    guarantees the whole codebase uses `m.*` and actually gets the saving —
 *    a single `motion.div` import would silently undo it.
 * 3. `reducedMotion="user"` makes every transform/layout animation in the app
 *    resolve instantly for visitors who ask for reduced motion, without each
 *    component having to handle it. Opacity still crossfades, so nothing
 *    disappears.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig
        reducedMotion="user"
        transition={{ duration: 0.5, ease: EASE_OUT }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
