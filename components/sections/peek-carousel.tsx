"use client";

import {
  AnimatePresence,
  m,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Section } from "@/components/ui/section";
import { WIDE } from "@/lib/showcase";
import { EASE_IN_OUT, SPRING } from "@/lib/motion";
import { cn, wrapIndex } from "@/lib/utils";

const AUTOPLAY_MS = 5200;
const SWIPE_THRESHOLD = 60;

/**
 * Directional slide variants.
 *
 * `custom` carries the travel direction into both the enter and exit states,
 * which is what keeps a leftward swipe looking leftward on the way out. The
 * previous carousel mounted three independent AnimatePresence stacks all
 * keyed on the same counter, so the blurred side panels animated as full
 * 400–700px background-image layers in lockstep with the main one.
 */
const slide = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
    scale: 1.06,
  }),
  center: { x: "0%", opacity: 1, scale: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? "-55%" : "55%",
    opacity: 0,
    scale: 0.96,
  }),
};

export function PeekCarousel() {
  const [[index, direction], setState] = useState<[number, number]>([0, 0]);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();
  const regionRef = useRef<HTMLDivElement>(null);

  const active = wrapIndex(WIDE.length, index);

  const go = useCallback((delta: number) => {
    setState(([current]) => [current + delta, delta]);
  }, []);

  const jumpTo = useCallback(
    (target: number) => {
      setState(([current]) => {
        const from = wrapIndex(WIDE.length, current);
        if (from === target) return [current, 0];
        return [current + (target - from), target > from ? 1 : -1];
      });
    },
    [],
  );

  // Autoplay pauses on reduced-motion, on hover, on focus within, and
  // whenever the tab is hidden — a timer that keeps firing in a background
  // tab is a battery cost for nothing.
  useEffect(() => {
    if (!playing || reduced) return;

    const id = setInterval(() => {
      if (document.visibilityState === "visible") go(1);
    }, AUTOPLAY_MS);

    return () => clearInterval(id);
  }, [playing, reduced, go]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD) go(1);
    else if (info.offset.x > SWIPE_THRESHOLD) go(-1);
  };

  return (
    <Section
      id="carousel"
      index="04"
      kicker="Directional transitions"
      title="A swipe that remembers which way it went"
      note="One AnimatePresence, one keyed child. Direction is passed through `custom` so the exiting frame leaves on the same axis the incoming one arrives on. Neighbours are rendered as cheap static peeks rather than three synchronised stacks."
    >
      <div
        ref={regionRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Interface frames"
        onMouseEnter={() => setPlaying(false)}
        onMouseLeave={() => setPlaying(true)}
        onFocusCapture={() => setPlaying(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            go(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            go(-1);
          }
        }}
        tabIndex={0}
        className="relative rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mint"
      >
        <div className="relative flex items-center justify-center gap-3 sm:gap-5">
          {/* Static peeks. Hidden from a11y and from small screens; they exist
              purely to imply a reel continuing past the frame. */}
          <Peek src={WIDE[wrapIndex(WIDE.length, index - 1)]} side="left" />

          <div className="relative aspect-[16/10] w-full max-w-3xl overflow-hidden rounded-2xl border border-line-hi bg-ink-raised shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <m.div
                key={index}
                custom={direction}
                variants={slide}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: SPRING.smooth,
                  opacity: { duration: 0.35, ease: EASE_IN_OUT },
                  scale: { duration: 0.55, ease: EASE_IN_OUT },
                }}
                drag="x"
                dragSnapToOrigin
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
                className="gpu absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <Image
                  src={WIDE[active]}
                  alt={`Interface frame ${active + 1} of ${WIDE.length}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  placeholder="blur"
                  priority={active === 0}
                  draggable={false}
                  className="select-none object-cover"
                />
              </m.div>
            </AnimatePresence>

            <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10" />
          </div>

          <Peek src={WIDE[wrapIndex(WIDE.length, index + 1)]} side="right" />
        </div>

        {/* Controls */}
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <IconButton onClick={() => go(-1)} label="Previous frame">
              <ArrowLeft className="size-4" aria-hidden />
            </IconButton>
            <IconButton onClick={() => go(1)} label="Next frame">
              <ArrowRight className="size-4" aria-hidden />
            </IconButton>
            <IconButton
              onClick={() => setPlaying((p) => !p)}
              label={playing ? "Pause autoplay" : "Resume autoplay"}
            >
              {playing ? (
                <Pause className="size-3.5" aria-hidden />
              ) : (
                <Play className="size-3.5" aria-hidden />
              )}
            </IconButton>
          </div>

          <div className="flex items-center gap-2" role="tablist" aria-label="Choose frame">
            {WIDE.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === active}
                aria-label={`Frame ${i + 1}`}
                onClick={() => jumpTo(i)}
                className="group relative h-8 px-0.5"
              >
                <span
                  className={cn(
                    "block h-1 rounded-full transition-all duration-500",
                    i === active
                      ? "w-8 bg-mint"
                      : "w-4 bg-line-hi group-hover:bg-fg-faint",
                  )}
                />
              </button>
            ))}
          </div>

          <span className="hidden font-mono text-xs tabular-nums text-fg-muted sm:block">
            {String(active + 1).padStart(2, "0")} / {String(WIDE.length).padStart(2, "0")}
          </span>
        </div>

        <p aria-live="polite" className="sr-only">
          Frame {active + 1} of {WIDE.length}
        </p>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

function Peek({
  src,
  side,
}: {
  src: (typeof WIDE)[number];
  side: "left" | "right";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "relative hidden aspect-[16/10] w-40 shrink-0 overflow-hidden rounded-xl border border-line opacity-35 blur-[2px] lg:block xl:w-56",
        side === "left" ? "origin-right" : "origin-left",
      )}
    >
      <Image src={src} alt="" fill sizes="224px" placeholder="blur" className="object-cover" />
    </div>
  );
}

function IconButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      className="grid size-10 place-items-center rounded-full border border-line-hi text-fg-muted transition-colors hover:border-mint/60 hover:text-mint"
    >
      {children}
    </m.button>
  );
}
