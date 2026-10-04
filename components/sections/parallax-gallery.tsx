"use client";

import { m, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";

import { TALL } from "@/lib/showcase";
import { SCROLL_SPRING, VIEWPORT, maskLine, stagger } from "@/lib/motion";

/** Per-column travel, in percent of the column's own height. */
const DEPTHS = [-14, -26, -8];

/**
 * Three-column parallax gallery.
 *
 * The previous version animated the `top` property of each column through a
 * spring, so every frame of every scroll triggered a layout pass on three
 * absolutely-positioned image wrappers. These columns translate instead,
 * which the compositor handles without involving layout or paint at all.
 *
 * Travel is expressed in percentages of the element's own height, so the
 * effect scales with the viewport rather than needing breakpoint-specific
 * pixel values.
 */
export function ParallaxGallery() {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  // The whole plate breathes slightly, which gives the columns something to
  // move against and hides the top and bottom of their travel.
  const plateScale = useTransform(progress, [0, 0.5, 1], [1.06, 1, 1.06]);

  return (
    <section
      id="gallery"
      aria-labelledby="gallery-title"
      ref={ref}
      className="deferred relative scroll-mt-24 overflow-hidden border-y border-line py-20 sm:py-28 lg:py-36"
    >
      {/* Backdrop. A translated gradient plate rather than
          `background-attachment: fixed`, which the old build used three times
          and which jitters badly on iOS Safari. */}
      <m.div
        aria-hidden
        style={{ scale: plateScale }}
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_120%,rgba(95,242,192,0.12),transparent_70%)]" />
        <div className="grid-paper absolute inset-0 [--cell:clamp(48px,7vw,96px)] opacity-60 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]" />
      </m.div>

      <div className="shell relative">
        <m.div
          variants={stagger(0.08)}
          initial="hidden"
          whileInView="show"
          viewport={VIEWPORT}
          className="mx-auto max-w-3xl text-center"
        >
          <m.div
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            className="label mb-6"
          >
            05 / Layered parallax
          </m.div>

          <h2 id="gallery-title" className="text-(length:--text-h1)">
            <span className="block overflow-hidden pb-[0.1em]">
              <m.span variants={maskLine} className="block">
                Depth is just
              </m.span>
            </span>
            <span className="block overflow-hidden pb-[0.1em]">
              <m.span variants={maskLine} className="block">
                <span className="font-serif text-mint">differing</span> speeds
              </m.span>
            </span>
          </h2>

          <m.p
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: { opacity: 1, y: 0 },
            }}
            className="mx-auto mt-7 max-w-xl text-(length:--text-lead) leading-relaxed text-fg-muted"
          >
            Three columns, three travel rates, one shared scroll timeline.
            Everything moves on <span className="text-fg">translate</span>.
          </m.p>
        </m.div>

        <div className="mt-16 grid grid-cols-2 items-start gap-3 sm:gap-5 lg:mt-24 lg:grid-cols-3">
          {TALL.map((src, i) => (
            <Column key={i} src={src} depth={DEPTHS[i]} progress={progress} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Column({
  src,
  depth,
  progress,
  index,
}: {
  src: (typeof TALL)[number];
  depth: number;
  progress: ReturnType<typeof useSpring>;
  index: number;
}) {
  const y = useTransform(progress, [0, 1], ["0%", `${depth}%`]);

  return (
    <m.figure
      style={{ y }}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className={[
        "gpu relative overflow-hidden rounded-xl border border-line bg-surface",
        // The third column only appears at lg, so the mobile grid stays a
        // clean two-up instead of an orphaned row.
        index === 2 ? "col-span-2 lg:col-span-1" : "",
        // Staggered vertical offsets give the row an editorial rhythm.
        index === 1 ? "lg:mt-16" : "",
        index === 2 ? "lg:mt-8" : "",
      ].join(" ")}
    >
      <div className="relative aspect-[2/3]">
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 30vw"
          placeholder="blur"
          className="object-cover"
        />
      </div>
      <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-4 pt-10">
        <span className="label">
          {String(depth).replace("-", "−")}% travel
        </span>
      </figcaption>
    </m.figure>
  );
}
