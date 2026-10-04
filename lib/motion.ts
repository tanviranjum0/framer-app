import type { Transition, Variants } from "motion/react";

/* ===========================================================================
   Easing
   Three curves for the whole site. Reusing them is what makes unrelated
   sections feel like one piece of software.
   =========================================================================== */

/** Expo-out. Fast departure, long settle — the default for entrances. */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
/** Quint in-out. Symmetric and decisive — for state swaps and wipes. */
export const EASE_IN_OUT = [0.83, 0, 0.17, 1] as const;
/** Slight overshoot. Playful accents only; never on large surfaces. */
export const EASE_BACK = [0.34, 1.4, 0.64, 1] as const;

/* ===========================================================================
   Springs
   Physical motion for anything a pointer touches, because a spring can be
   interrupted mid-flight and still resolve naturally. Durations cannot.
   =========================================================================== */
export const SPRING = {
  /** Buttons, toggles, cursor following. */
  snappy: { type: "spring", stiffness: 420, damping: 32, mass: 0.8 },
  /** Panels and cards entering. */
  smooth: { type: "spring", stiffness: 160, damping: 24, mass: 0.9 },
  /** Large, slow parallax bodies. */
  gentle: { type: "spring", stiffness: 70, damping: 20, mass: 1 },
  /** Release-from-drag. Heavier damping prevents the rubber-band wobble. */
  drag: { type: "spring", stiffness: 300, damping: 38, mass: 0.9 },
} satisfies Record<string, Transition>;

/**
 * Config for `useSpring` wrapped around `scrollYProgress`.
 * Raw scroll progress is a step function on trackpads and mouse wheels;
 * smoothing it is the single biggest perceived-quality win for parallax.
 */
export const SCROLL_SPRING = {
  stiffness: 90,
  damping: 28,
  mass: 0.45,
  restDelta: 0.0005,
} as const;

export const DURATION = {
  fast: 0.25,
  base: 0.5,
  slow: 0.9,
} as const;

/* ===========================================================================
   Viewport defaults
   `once` matters: without it every scroll pass re-runs every entrance, which
   both looks cheap and burns frames for the whole session.
   =========================================================================== */
export const VIEWPORT = { once: true, amount: 0.25 } as const;
export const VIEWPORT_EAGER = { once: true, amount: 0.05 } as const;

/* ===========================================================================
   Shared variants
   Every value below animates `transform`, `opacity`, `filter` or `clip-path`
   only — the four properties the compositor can handle without a layout or
   paint pass on the main thread.
   =========================================================================== */

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE_OUT } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

/** Lines slide out from behind a clipping parent. Requires overflow-hidden. */
export const maskLine: Variants = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.8, ease: EASE_OUT } },
};

/** Full-panel wipe used by the view switcher. */
export const wipe: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0 },
  show: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: { duration: 0.7, ease: EASE_IN_OUT },
  },
  exit: {
    clipPath: "inset(100% 0 0 0)",
    opacity: 0,
    transition: { duration: 0.5, ease: EASE_IN_OUT },
  },
};

/**
 * Parent variant that cascades children.
 * `delayChildren` buys a beat so the container's own motion reads first.
 */
export const stagger = (step = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: step, delayChildren: delay },
  },
});
