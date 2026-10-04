"use client";

import { AnimatePresence, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

import { VelocityTrack } from "@/components/ui/velocity-track";
import { TRAIL } from "@/lib/showcase";
import { SPRING } from "@/lib/motion";

const WORDS = ["motion", "react", "next", "spring", "scroll", "drag"];

/** Trail images live for this long after being placed, on fine pointers. */
const TRAIL_LIFETIME = 1100;
/** Fraction of viewport width the pointer must travel to place the next image. */
const SPACING = 0.055;

type Burst = { id: number; x: number; y: number; src: number; tilt: number };

/**
 * Pointer trail over a scrolling word wall.
 *
 * Two fixes over the previous version, beyond the asset work:
 *
 *   - `globalIndex` and `last` were declared in the component body, so they
 *     reset to 0 on every render and the trail restarted from the first image
 *     and re-measured distance from the origin.
 *   - All twelve images rendered with `data-status="active"`, so the whole set
 *     was visible before the pointer ever moved, at 1000×1000 each.
 *
 * On touch, where a hover trail is unreachable, a tap scatters a single image
 * at the contact point instead — the same material, a gesture that exists.
 */
export function ImageTrail() {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs, not state: the trail must not re-render the section on pointer move.
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursor = useRef(0);
  const last = useRef({ x: 0, y: 0 });
  const zIndex = useRef(1);
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  // Touch path keeps its own small list so taps can animate in and out.
  const [bursts, setBursts] = useState<Burst[]>([]);
  const burstId = useRef(0);

  const place = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const slot = slotRefs.current[cursor.current % TRAIL.length];
    if (!slot) return;

    slot.style.left = `${clientX - rect.left}px`;
    slot.style.top = `${clientY - rect.top}px`;
    slot.style.setProperty("--tilt", `${-12 + Math.random() * 24}deg`);

    // Recycle the stacking context rather than letting z-index climb forever.
    zIndex.current = zIndex.current > 40 ? 1 : zIndex.current + 1;
    slot.style.zIndex = String(zIndex.current);
    slot.dataset.active = "true";

    const index = cursor.current % TRAIL.length;
    const existing = timers.current.get(index);
    if (existing) clearTimeout(existing);
    timers.current.set(
      index,
      setTimeout(() => {
        slot.dataset.active = "false";
      }, TRAIL_LIFETIME),
    );

    cursor.current += 1;
  }, []);

  const handleMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      // Only fine pointers drive the trail; a finger dragging across the
      // panel would fire this on every scroll attempt.
      if (event.pointerType !== "mouse" || reduced) return;

      const travelled = Math.hypot(
        event.clientX - last.current.x,
        event.clientY - last.current.y,
      );

      if (travelled < window.innerWidth * SPACING) return;

      last.current = { x: event.clientX, y: event.clientY };
      place(event.clientX, event.clientY);
    },
    [place, reduced],
  );

  const handleTap = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse") return;

      const rect = event.currentTarget.getBoundingClientRect();
      const id = burstId.current++;
      const burst: Burst = {
        id,
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        src: id % TRAIL.length,
        tilt: -14 + Math.random() * 28,
      };

      // Cap the set so rapid tapping cannot stack dozens of layers.
      setBursts((prev) => [...prev.slice(-4), burst]);
      setTimeout(
        () => setBursts((prev) => prev.filter((b) => b.id !== id)),
        1400,
      );
    },
    [],
  );

  return (
    <section
      id="trail"
      aria-labelledby="trail-title"
      className="deferred relative scroll-mt-24 py-20 sm:py-28 lg:py-36"
    >
      <div className="shell">
        <div className="mb-5 flex items-baseline gap-4 border-b border-line pb-4">
          <span className="label text-mint">08</span>
          <span className="label">Pointer trail</span>
        </div>
        <h2 id="trail-title" className="max-w-4xl text-(length:--text-h2)">
          Leave something behind
        </h2>
        <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-fg-muted sm:text-[0.8125rem]">
          Position and lifetime are written straight to element style from the
          pointer handler. A mouse draws a trail; a finger drops a single
          frame where it lands.
        </p>
      </div>

      <div className="shell mt-12">
        <div
          ref={containerRef}
          onPointerMove={handleMove}
          onPointerDown={handleTap}
          className="relative aspect-[4/5] touch-manipulation select-none overflow-hidden rounded-2xl border border-line bg-surface sm:aspect-[16/10] lg:aspect-[21/9]"
        >
          {/* Word wall. Four tracks at different rates, each one composited
              transform regardless of how many words it holds. */}
          <div className="absolute inset-0 flex flex-col justify-center gap-1 opacity-[0.14] sm:gap-2">
            {[2.4, -1.8, 3.1, -2.2].map((velocity, row) => (
              <VelocityTrack key={row} baseVelocity={velocity}>
                {WORDS.map((word, i) => (
                  <span
                    key={`${row}-${i}`}
                    className="mx-4 shrink-0 text-[12vw] font-medium uppercase leading-none tracking-tighter text-fg sm:mx-6 sm:text-[8vw]"
                  >
                    {word}
                  </span>
                ))}
              </VelocityTrack>
            ))}
          </div>

          {/* Fine-pointer trail slots. One element per image, reused in a
              ring; nothing mounts or unmounts while the pointer moves. */}
          {TRAIL.map((src, i) => (
            <div
              key={i}
              ref={(node) => {
                slotRefs.current[i] = node;
              }}
              data-active="false"
              aria-hidden
              className="trail-img pointer-events-none absolute w-24 overflow-hidden rounded-xl border border-line-hi sm:w-32 lg:w-36"
            >
              <Image
                src={src}
                alt=""
                sizes="144px"
                placeholder="blur"
                className="h-auto w-full object-cover"
              />
            </div>
          ))}

          {/* Touch bursts */}
          <AnimatePresence>
            {bursts.map((burst) => (
              <m.div
                key={burst.id}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1, rotate: burst.tilt }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={SPRING.smooth}
                style={{
                  left: burst.x,
                  top: burst.y,
                  x: "-50%",
                  y: "-50%",
                }}
                aria-hidden
                className="pointer-events-none absolute z-30 w-28 overflow-hidden rounded-xl border border-line-hi sm:w-32"
              >
                <Image
                  src={TRAIL[burst.src]}
                  alt=""
                  sizes="128px"
                  placeholder="blur"
                  className="h-auto w-full object-cover"
                />
              </m.div>
            ))}
          </AnimatePresence>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-ink/90 to-transparent p-5 pt-16 sm:p-8 sm:pt-24">
            <div>
              <p className="text-(length:--text-h3) leading-tight">
                The heart&apos;s memory
                <br />
                <span className="font-serif text-mint">magnifies the good</span>
              </p>
            </div>
            <span className="label hidden shrink-0 sm:block">
              {TRAIL.length} frames · ring buffer
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
