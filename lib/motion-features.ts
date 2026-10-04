/**
 * Lazily-loaded Motion feature bundle.
 *
 * `domMax` adds drag and layout animation on top of `domAnimation`. Both are
 * needed here (the card deck and carousel drag; the toast stack uses layout),
 * so this module is imported dynamically by MotionProvider and lands in its
 * own chunk instead of the critical path.
 */
export { domMax as default } from "motion/react";
