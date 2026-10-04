"use client";

import Image from "next/image";

import { VelocityTrack } from "@/components/ui/velocity-track";
import { PLATES } from "@/lib/showcase";

const WORDS = [
  "scroll-linked",
  "drag physics",
  "spring tuning",
  "layout projection",
  "pointer fields",
  "clip reveals",
];

export function VelocityMarquee() {
  return (
    <section
      aria-label="Scroll-velocity marquee"
      className="deferred relative overflow-hidden border-y border-line py-16 sm:py-24"
    >
      <div className="shell mb-10 flex flex-wrap items-baseline justify-between gap-4">
        <span className="label text-mint">01 / Velocity marquee</span>
        <p className="max-w-md font-mono text-xs leading-relaxed text-fg-muted">
          Track speed and direction derive from scroll velocity. Scroll
          upward and the whole field reverses.
        </p>
      </div>

      {/* Edges fade with a mask so the loop never shows a hard cut. */}
      <div className="[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <VelocityTrack baseVelocity={2.2} className="mb-4">
          {PLATES.map((src, i) => (
            <div
              key={`plate-${i}`}
              className="relative mx-2 h-32 w-52 shrink-0 overflow-hidden rounded-xl border border-line sm:h-44 sm:w-72"
            >
              <Image
                src={src}
                alt=""
                fill
                // Explicit sizes stop Next from serving a 2560px candidate
                // into a 208px box.
                sizes="(max-width: 640px) 208px, 288px"
                placeholder="blur"
                className="object-cover opacity-75 transition-opacity duration-500 hover:opacity-100"
              />
            </div>
          ))}
        </VelocityTrack>

        <VelocityTrack baseVelocity={-1.4}>
          {WORDS.map((word, i) => (
            <span
              key={`word-${i}`}
              className="mx-5 shrink-0 font-mono text-sm uppercase tracking-[0.2em] text-fg-faint sm:mx-8 sm:text-base"
            >
              {word}
              <span className="ml-5 text-mint sm:ml-8">+</span>
            </span>
          ))}
        </VelocityTrack>
      </div>
    </section>
  );
}
