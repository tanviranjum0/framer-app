"use client";

import {
  m,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { PANELS, WIDE } from "@/lib/showcase";
import { SCROLL_SPRING } from "@/lib/motion";

const CHAPTERS = [
  {
    index: "01",
    title: "Bind the timeline, not the handler",
    body: "A single useScroll gives one progress value for the whole section. Every element below reads from it through useTransform, so adding the tenth animated layer costs about the same as the first.",
  },
  {
    index: "02",
    title: "Keep every panel mounted",
    body: "Panels crossfade on opacity instead of mounting and unmounting. Nothing re-decodes, nothing re-measures, and scroll position never jumps as content leaves the tree.",
  },
  {
    index: "03",
    title: "Smooth the input, not the output",
    body: "Wheel and trackpad scroll arrives as a step function. Wrapping progress in useSpring once, at the source, smooths every derived value downstream for the price of a single spring.",
  },
  {
    index: "04",
    title: "Stay on the compositor",
    body: "Opacity, scale, translate and clip-path are the only properties touched here. No width, no top, no margin, nothing that would force layout on a scroll frame.",
  },
];

/**
 * A scroll-driven chapter sequence.
 *
 * The previous version of this section conditionally rendered one of three
 * blocks from a scroll-progress state update. That meant a React re-render of
 * the whole section at every threshold crossing, remounted `<Image>` elements
 * that re-fetched multi-megabyte GIFs, and layout thrash as content left and
 * re-entered the tree.
 *
 * Here all four chapters and all five frames stay mounted for the life of the
 * page, and progress drives opacity and transform directly — no React state
 * is involved in the animation at all.
 */
export function ScrollSequence() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // One spring at the source; everything downstream inherits the smoothing.
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <section
      id="sequence"
      aria-labelledby="sequence-title"
      className="relative scroll-mt-24 border-b border-line"
    >
      <div className="shell py-20 sm:py-28">
        <div className="mb-5 flex items-baseline gap-4 border-b border-line pb-4">
          <span className="label text-mint">02</span>
          <span className="label">Scroll-driven sequence</span>
        </div>
        <h2 id="sequence-title" className="max-w-4xl text-(length:--text-h2)">
          One timeline, many readers
        </h2>
        <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-fg-muted sm:text-[0.8125rem]">
          Four chapters and five frames, all mounted at once, all driven by a
          single spring-smoothed progress value.
        </p>
      </div>

      {/*
        The scroll track. 400vh gives each chapter a full viewport of travel;
        mobile drops to 280vh so the section does not overstay on a phone.
      */}
      <div ref={ref} className="relative h-[280vh] lg:h-[400vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden lg:flex-row">
          {/* Text column */}
          <div className="relative flex shrink-0 items-center px-[clamp(1rem,4vw,4rem)] pb-16 pt-20 lg:basis-[42%] lg:py-0">
            {/*
              All chapters share one grid cell, so the column is exactly as
              tall as its tallest chapter and none of them is positioned
              against a sibling it might outgrow.
            */}
            <div className="grid w-full">
              {CHAPTERS.map((chapter, i) => (
                <Chapter
                  key={chapter.index}
                  chapter={chapter}
                  index={i}
                  total={CHAPTERS.length}
                  progress={progress}
                />
              ))}
            </div>

            <div
              aria-hidden
              className="absolute inset-x-[clamp(1rem,4vw,4rem)] bottom-6 h-px bg-line lg:bottom-12"
            >
              <m.div
                style={{ scaleX: progress }}
                className="h-full origin-left bg-mint"
              />
            </div>
          </div>

          {/* Frame stack */}
          <div className="relative min-h-0 flex-1 p-[clamp(1rem,3vw,2.5rem)] pt-0 lg:pt-[clamp(1rem,3vw,2.5rem)]">
            <div className="relative size-full overflow-hidden rounded-2xl border border-line bg-ink-raised">
              {WIDE.map((src, i) => (
                <Frame
                  key={i}
                  src={src}
                  index={i}
                  total={WIDE.length}
                  progress={progress}
                  priority={i === 0}
                />
              ))}

              <PhoneLayer progress={progress} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------------ */

function Chapter({
  chapter,
  index,
  total,
  progress,
}: {
  chapter: (typeof CHAPTERS)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const slot = 1 / total;
  const start = index * slot;

  // Ramp in, hold, ramp out. The first chapter begins fully visible and the
  // last never fully leaves, so the column is never blank at either end.
  const keyframes = [
    start - slot * 0.35,
    start + slot * 0.12,
    start + slot * 0.78,
    start + slot * 1.15,
  ];

  const opacity = useTransform(progress, keyframes, [0, 1, 1, 0], {
    clamp: true,
  });
  const y = useTransform(progress, keyframes, [32, 0, 0, -32], { clamp: true });
  const filter = useTransform(opacity, (v) => `blur(${(6 - v * 6).toFixed(2)}px)`);

  return (
    <m.article
      style={{ opacity, y, filter }}
      className="col-start-1 row-start-1 max-w-lg self-center"
    >
      <span className="label mb-4 block text-mint">{chapter.index}</span>
      <h3 className="text-(length:--text-h3) leading-tight">{chapter.title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-fg-muted sm:text-base">
        {chapter.body}
      </p>
    </m.article>
  );
}

function Frame({
  src,
  index,
  total,
  progress,
  priority,
}: {
  src: (typeof WIDE)[number];
  index: number;
  total: number;
  progress: MotionValue<number>;
  priority: boolean;
}) {
  const slot = 1 / total;
  const start = index * slot;

  const opacity = useTransform(
    progress,
    [start - slot * 0.6, start, start + slot, start + slot * 1.6],
    [0, 1, 1, 0],
    { clamp: true },
  );

  // A slow settle across the whole visit, so the stack never reads as a
  // hard-cut slideshow.
  const scale = useTransform(
    progress,
    [start - slot, start + slot * 1.6],
    [1.12, 1],
    { clamp: true },
  );
  const y = useTransform(
    progress,
    [start - slot, start + slot * 1.6],
    ["4%", "-4%"],
    { clamp: true },
  );

  return (
    <m.div
      style={{ opacity, scale, y, zIndex: index }}
      className="gpu absolute inset-0"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 58vw"
        placeholder="blur"
        priority={priority}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
    </m.div>
  );
}

/** A phone mockup riding the same timeline one beat out of phase. */
function PhoneLayer({ progress }: { progress: MotionValue<number> }) {
  const y = useTransform(progress, [0, 1], ["14%", "-14%"]);
  const rotate = useTransform(progress, [0, 1], [6, -4]);

  return (
    <m.div
      aria-hidden
      style={{ y, rotate }}
      className="gpu absolute -bottom-10 right-4 z-20 hidden w-28 sm:block sm:w-36 lg:right-8 lg:w-40"
    >
      <div className="relative aspect-[1/2] overflow-hidden rounded-[1.25rem] border border-line-hi bg-surface shadow-[0_30px_60px_-20px_rgba(0,0,0,0.9)]">
        {PANELS.map((src, i) => (
          <PhonePanel
            key={i}
            src={src}
            progress={progress}
            index={i}
            total={PANELS.length}
          />
        ))}
      </div>
    </m.div>
  );
}

function PhonePanel({
  src,
  progress,
  index,
  total,
}: {
  src: (typeof PANELS)[number];
  progress: MotionValue<number>;
  index: number;
  total: number;
}) {
  const slot = 1 / total;
  const start = index * slot;

  const opacity = useTransform(
    progress,
    [
      start - slot * 0.4,
      start + slot * 0.1,
      start + slot * 0.9,
      start + slot * 1.4,
    ],
    [0, 1, 1, 0],
    { clamp: true },
  );

  return (
    <m.div style={{ opacity }} className="absolute inset-0">
      <Image
        src={src}
        alt=""
        fill
        sizes="160px"
        placeholder="blur"
        className="object-cover"
      />
    </m.div>
  );
}
