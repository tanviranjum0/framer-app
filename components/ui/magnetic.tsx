"use client";

import { m, useMotionValue, useSpring, useTransform } from "motion/react";
import { useCallback, useRef, type PointerEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { SPRING } from "@/lib/motion";
import { useFinePointer } from "@/hooks/use-media-query";

/**
 * A button that leans toward the cursor.
 *
 * The pointer position is written into motion values, never into React state,
 * so moving the mouse across it costs zero renders — the transform is applied
 * directly to the node. On touch devices the listeners are not attached at
 * all, since the effect is unreachable there.
 */
export function Magnetic({
  children,
  className,
  strength = 0.35,
  onClick,
  href,
  ariaLabel,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
}) {
  const finePointer = useFinePointer();
  const ref = useRef<HTMLElement | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, SPRING.snappy);
  const springY = useSpring(y, SPRING.snappy);

  // The inner label travels further than the shell, which sells depth.
  const labelX = useTransform(springX, (v) => v * 0.45);
  const labelY = useTransform(springY, (v) => v * 0.45);

  const handleMove = useCallback(
    (event: PointerEvent<HTMLElement>) => {
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      x.set((event.clientX - (rect.left + rect.width / 2)) * strength);
      y.set((event.clientY - (rect.top + rect.height / 2)) * strength);
    },
    [strength, x, y],
  );

  const reset = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  const pointerProps = finePointer
    ? { onPointerMove: handleMove, onPointerLeave: reset }
    : {};

  const shell = cn(
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full",
    "border border-line-hi bg-surface px-7 py-3.5 text-sm font-medium tracking-tight",
    "transition-colors hover:border-mint/50",
    className,
  );

  const inner = (
    <>
      {/* Fill wipes in from the bottom. scaleY on a GPU layer, not a
          background-color transition on the button itself. */}
      <span
        aria-hidden
        className="absolute inset-0 origin-bottom scale-y-0 bg-mint transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100"
      />
      <m.span
        style={{ x: labelX, y: labelY }}
        className="relative z-10 inline-flex items-center gap-2 transition-colors duration-300 group-hover:text-ink"
      >
        {children}
      </m.span>
    </>
  );

  if (href) {
    return (
      <m.a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        aria-label={ariaLabel}
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.96 }}
        className={shell}
        {...pointerProps}
      >
        {inner}
      </m.a>
    );
  }

  return (
    <m.button
      ref={ref as React.Ref<HTMLButtonElement>}
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={shell}
      {...pointerProps}
    >
      {inner}
    </m.button>
  );
}
