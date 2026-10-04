"use client";

import { m, useScroll, useTransform } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useRef } from "react";

import { VelocityTrack } from "@/components/ui/velocity-track";
import { LocalClock } from "./local-clock";

const LINKS = [
  { label: "GitHub", href: "https://github.com/tanviranjum0" },
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "Fiverr", href: "https://www.fiverr.com/" },
  { label: "Email", href: "mailto:tanviranjum010@gmail.com" },
];

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });

  // The wordmark rises into place as the footer is revealed. Translate and
  // opacity, so it costs nothing.
  const y = useTransform(scrollYProgress, [0, 1], ["22%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);

  return (
    <footer
      ref={ref}
      className="relative overflow-hidden border-t border-line pt-16 sm:pt-20"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_70%_100%_at_50%_120%,rgba(95,242,192,0.14),transparent_70%)]"
      />

      <div className="shell relative">
        <div className="flex flex-col gap-10 border-b border-line pb-12 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="label mb-4">Elsewhere</p>
            <ul className="flex flex-col gap-2.5">
              {LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group inline-flex items-center gap-2 text-lg tracking-tight text-fg-muted transition-colors hover:text-fg"
                  >
                    <span className="h-px w-0 bg-mint transition-all duration-500 group-hover:w-5" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-6 sm:items-end">
            <div className="sm:text-right">
              <p className="label mb-2">Local time</p>
              <LocalClock />
              <p className="mt-1 text-sm text-fg-muted">
                Chattogram, Bangladesh
              </p>
            </div>

            <a
              href="#main"
              className="group inline-flex items-center gap-2 rounded-full border border-line-hi px-4 py-2 font-mono text-xs text-fg-muted transition-colors hover:border-mint/60 hover:text-mint"
            >
              <ArrowUp
                className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden
              />
              Back to top
            </a>
          </div>
        </div>
      </div>

      {/* Oversized wordmark, clipped by the viewport edge. */}
      <div className="relative mt-12 overflow-hidden">
        <m.div style={{ y, opacity }} className="gpu">
          <VelocityTrack baseVelocity={1.1}>
            <span className="mx-6 shrink-0 text-[18vw] font-medium leading-[0.85] tracking-[-0.05em] text-fg-faint/30 sm:text-[14vw]">
              Motion Lab
            </span>
            <span className="mx-6 shrink-0 text-[18vw] font-medium leading-[0.85] tracking-[-0.05em] text-mint/20 sm:text-[14vw]">
              Motion Lab
            </span>
          </VelocityTrack>
        </m.div>
      </div>

      <div className="shell relative flex flex-col gap-2 border-t border-line py-6 font-mono text-xs text-fg-faint sm:flex-row sm:items-center sm:justify-between">
        <p>Built with Next.js 16 and Motion for React.</p>
        <p>© {new Date().getFullYear()} Tanvir Anjum</p>
      </div>
    </footer>
  );
}
