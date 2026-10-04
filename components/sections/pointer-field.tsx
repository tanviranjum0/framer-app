"use client";

import {
  m,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { Section } from "@/components/ui/section";
import { useFinePointer } from "@/hooks/use-media-query";
import { useMeasure } from "@/hooks/use-measure";
import { SPRING } from "@/lib/motion";
import { clamp } from "@/lib/utils";

/** Cell edge in px. Larger on touch, where fingers are imprecise. */
const CELL_FINE = 46;
const CELL_COARSE = 56;
/** Hard ceiling on interactive cells, whatever the viewport. */
const MAX_CELLS = 420;

type Ripple = { col: number; row: number; token: number };

/**
 * An interactive grid field.
 *
 * This replaces a component that rendered 47 × 30 = 1,410 `<div>`s, each
 * wrapping a `motion.div`, and called `useAnimation()` plus `useEffect()`
 * from inside the nested `.map()` callbacks. That is a Rules of Hooks
 * violation (hook count varied with grid size) and it allocated 2,820 hooks
 * on every render of the section.
 *
 * Three things carry the effect here instead:
 *
 *   1. Gridlines are a single element painted with `repeating-linear-gradient`.
 *      One node draws every line in the field.
 *   2. The cursor spotlight is a mask position composed from two motion
 *      values via `useMotionTemplate`. Moving the pointer writes to those
 *      values directly and never re-renders React.
 *   3. The ripple is a CSS animation with a per-cell delay. A tap triggers
 *      exactly one render of plain `<div>`s — no hooks, no motion values,
 *      no per-cell state.
 */
export function PointerField() {
  const finePointer = useFinePointer();
  const [ref, { width, height }] = useMeasure<HTMLDivElement>();
  const [ripple, setRipple] = useState<Ripple | null>(null);
  const token = useRef(0);

  const cell = finePointer ? CELL_FINE : CELL_COARSE;

  const { cols, rows } = useMemo(() => {
    if (!width || !height) return { cols: 0, rows: 0 };

    let c = Math.ceil(width / cell);
    let r = Math.ceil(height / cell);

    // Scale both axes down together if the viewport would exceed the ceiling,
    // so the field stays square-ish instead of collapsing one dimension.
    if (c * r > MAX_CELLS) {
      const factor = Math.sqrt(MAX_CELLS / (c * r));
      c = Math.max(4, Math.floor(c * factor));
      r = Math.max(4, Math.floor(r * factor));
    }
    return { cols: c, rows: r };
  }, [width, height, cell]);

  // Raw pointer position, smoothed by a spring so the spotlight trails the
  // cursor with a little weight rather than snapping to it.
  const px = useMotionValue(-9999);
  const py = useMotionValue(-9999);
  const sx = useSpring(px, SPRING.snappy);
  const sy = useSpring(py, SPRING.snappy);

  // Composed on the GPU side: this string updates without React involvement.
  const spotlight = useMotionTemplate`radial-gradient(180px circle at ${sx}px ${sy}px, white 0%, rgba(255,255,255,0.35) 45%, transparent 72%)`;

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect();
      px.set(event.clientX - rect.left);
      py.set(event.clientY - rect.top);
    },
    [px, py],
  );

  const handleLeave = useCallback(() => {
    px.set(-9999);
    py.set(-9999);
  }, [px, py]);

  const handleTap = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!cols || !rows) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const col = clamp(
        Math.floor(((event.clientX - rect.left) / rect.width) * cols),
        0,
        cols - 1,
      );
      const row = clamp(
        Math.floor(((event.clientY - rect.top) / rect.height) * rows),
        0,
        rows - 1,
      );
      token.current += 1;
      setRipple({ col, row, token: token.current });
    },
    [cols, rows],
  );

  const cellCount = cols * rows;

  return (
    <Section
      id="pointer"
      index="07"
      kicker="Pointer field"
      title={
        <>
          A field that answers the{" "}
          <span className="font-serif text-mint">cursor</span>
        </>
      }
      note="Gridlines are one element. The spotlight is a mask position built from two motion values, so pointer movement never re-renders React. The ripple is a CSS animation with a per-cell delay, so a tap costs one render of plain divs."
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-14">
        <div
          ref={ref}
          onPointerMove={finePointer ? handleMove : undefined}
          onPointerLeave={finePointer ? handleLeave : undefined}
          onPointerDown={handleTap}
          role="presentation"
          className="relative aspect-[4/3] w-full touch-manipulation select-none overflow-hidden rounded-2xl border border-line bg-ink-raised sm:aspect-[16/10] lg:aspect-[16/9]"
          style={{ cursor: finePointer ? "crosshair" : "pointer" }}
        >
          {/* 1 — base gridlines, one node for the entire field */}
          <div
            aria-hidden
            className="grid-paper absolute inset-0 opacity-70"
            style={{ ["--cell" as string]: `${cell}px` }}
          />

          {/* 2 — the lit grid, revealed only inside the spotlight mask */}
          {finePointer ? (
            <m.div
              aria-hidden
              style={{
                maskImage: spotlight,
                WebkitMaskImage: spotlight,
              }}
              className="absolute inset-0"
            >
              <div
                className="grid-paper absolute inset-0"
                style={{
                  ["--cell" as string]: `${cell}px`,
                  ["--color-line" as string]: "rgba(95,242,192,0.55)",
                }}
              />
              <div className="absolute inset-0 bg-mint/[0.07]" />
            </m.div>
          ) : null}

          {/* 3 — ripple cells. Plain divs; no hooks, no motion values. */}
          {cellCount > 0 ? (
            <div
              aria-hidden
              className="absolute inset-0 grid"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`,
              }}
            >
              {Array.from({ length: cellCount }, (_, i) => {
                const col = i % cols;
                const row = Math.floor(i / cols);

                let style: React.CSSProperties | undefined;
                if (ripple) {
                  const distance = Math.hypot(
                    col - ripple.col,
                    row - ripple.row,
                  );
                  style = {
                    animationName:
                      // Alternating identical keyframes restarts the
                      // animation without remounting the cell.
                      ripple.token % 2 === 0 ? "cell-pulse-a" : "cell-pulse-b",
                    animationDelay: `${distance * 26}ms`,
                  };
                }

                return (
                  <div
                    key={i}
                    className="ripple-cell bg-mint/55"
                    style={style}
                  />
                );
              })}
            </div>
          ) : null}

          {/* Vignette, so the field reads as a panel rather than a texture. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,var(--color-ink)_115%)]"
          />

          <p className="pointer-events-none absolute inset-x-0 bottom-0 p-5 font-mono text-xs text-fg-faint">
            {finePointer
              ? "Move to light the field · click to ripple"
              : "Tap anywhere to ripple"}
          </p>
        </div>

        <dl className="space-y-5 self-center font-mono text-xs">
          <Row term="Input" value={finePointer ? "fine pointer" : "coarse / touch"} />
          <Row term="Grid" value={cols && rows ? `${cols} × ${rows}` : "measuring"} />
          <Row term="Cells" value={cellCount ? `${cellCount} divs` : "—"} />
          <Row term="Hooks per cell" value="0" />
          <Row term="Renders per move" value={finePointer ? "0" : "n/a"} />

          <p className="pt-3 font-sans text-sm leading-relaxed text-fg-muted">
            The previous build of this effect rendered{" "}
            <span className="text-rose">1,410</span> cells and called two hooks
            inside each one. Same idea, {cellCount ? cellCount : "a few hundred"}{" "}
            plain nodes, and nothing allocated on pointer move.
          </p>
        </dl>
      </div>
    </Section>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <dt className="label">{term}</dt>
      <dd className="tabular-nums text-fg">{value}</dd>
    </div>
  );
}
