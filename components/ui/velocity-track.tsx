"use client";

import {
  m,
  useAnimationFrame,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { useRef, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * A seamless, scroll-velocity-reactive marquee track.
 *
 * The track renders its children twice and translates between 0% and -50%,
 * so the seam is always off-screen. Position is advanced in
 * `useAnimationFrame` and written straight to a motion value, which means:
 *
 *   - zero React renders while it scrolls
 *   - one composited transform per track, regardless of child count
 *   - scroll velocity can steer speed and direction for free
 *
 * This replaces react-fast-marquee, which carried a ResizeObserver and
 * component state per instance — eight instances were mounted at once in the
 * previous build.
 */
export function VelocityTrack({
  children,
  baseVelocity = 2,
  className,
  trackClassName,
}: {
  children: ReactNode;
  /** Pixels-per-second-ish drift at rest. Negative runs right-to-left. */
  baseVelocity?: number;
  className?: string;
  trackClassName?: string;
}) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const reduced = useReducedMotion();

  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400,
  });

  // Clamped so a hard flick cannot launch the track into hyperspace.
  const velocityFactor = useTransform(
    smoothVelocity,
    [-2400, 0, 2400],
    [-4, 1, 4],
    { clamp: true },
  );

  const direction = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;

    const factor = velocityFactor.get();
    // Scrolling backwards reverses the track. This is the detail that makes
    // the marquee feel physically coupled to the page, not merely decorative.
    direction.current = factor < 0 ? -1 : 1;

    // delta-scaled, so a 120Hz display and a 60Hz display drift identically.
    const step =
      direction.current * baseVelocity * (delta / 1000) * Math.abs(factor);

    baseX.set(baseX.get() + step);
  });

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <m.div style={{ x }} className={cn("flex w-max gpu", trackClassName)}>
        {children}
        {/* Duplicate closes the loop. aria-hidden so assistive tech reads the
            content once rather than twice. */}
        <span aria-hidden className="flex shrink-0">
          {children}
        </span>
      </m.div>
    </div>
  );
}
