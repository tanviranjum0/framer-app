"use client";

import { m, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { useRef } from "react";

import { Magnetic } from "@/components/ui/magnetic";
import { RevealWords } from "@/components/ui/reveal";
import { EASE_OUT, stagger } from "@/lib/motion";

const STATS = [
  { value: "12", label: "Patterns" },
  { value: "4", label: "Animated props" },
  { value: "60", label: "Target fps" },
];

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  // Hero parallax is driven by the window timeline, not a resize listener.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // The whole hero drifts up and dims as it leaves — transform + opacity only.
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);
  const glowY = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section
      ref={ref}
      id="main"
      className="relative flex min-h-[100svh] items-end overflow-hidden pb-14 pt-28 sm:pb-20"
    >
      {/* Ambient field. Two blurred radial washes and one gridded plane — all
          static paint, no per-frame work. */}
      <m.div
        aria-hidden
        style={{ y: glowY }}
        className="pointer-events-none absolute inset-x-0 -top-1/4 h-[150%]"
      >
        <div className="absolute left-1/2 top-0 size-[min(90vw,52rem)] -translate-x-1/2 rounded-full bg-mint/[0.07] blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 size-[min(70vw,36rem)] translate-x-1/3 rounded-full bg-violet/[0.06] blur-[100px]" />
      </m.div>

      <div
        aria-hidden
        className="grid-paper pointer-events-none absolute inset-0 [--cell:clamp(40px,6vw,72px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]"
      />

      <m.div style={{ y, opacity, scale }} className="shell relative">
        <m.div
          variants={stagger(0.1)}
          initial="hidden"
          animate="show"
          className="flex items-center gap-4"
        >
          <m.span
            variants={{
              hidden: { opacity: 0, scaleX: 0 },
              show: { opacity: 1, scaleX: 1 },
            }}
            style={{ transformOrigin: "left" }}
            className="h-px w-12 bg-mint sm:w-20"
          />
          <m.span
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            className="label"
          >
            Motion for React · Next.js 16
          </m.span>
        </m.div>

        <h1 className="mt-7 max-w-[20ch] text-(length:--text-display) font-medium leading-[0.92] tracking-[-0.045em]">
          <RevealWords text="Motion," delay={0.75} />
          <span className="block">
            <RevealWords text="engineered." className="text-gradient" delay={0.95} />
          </span>
        </h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <m.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.25, ease: EASE_OUT }}
            className="max-w-xl text-(length:--text-lead) leading-relaxed text-fg-muted"
          >
            A working reference of twelve interaction patterns — scroll
            timelines, drag physics, spring tuning, pointer fields. Each one
            animates{" "}
            <span className="text-fg">
              transform, opacity, filter and clip-path
            </span>{" "}
            only, adapts itself to touch input, and stands down when you ask
            for reduced motion.
          </m.p>

          <m.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4, ease: EASE_OUT }}
            className="flex flex-wrap items-center gap-3"
          >
            <Magnetic href="#sequence">
              Explore the lab
              <ArrowDown className="size-4" aria-hidden />
            </Magnetic>
            <Magnetic
              href="#contact"
              className="border-line bg-transparent hover:border-violet/50"
            >
              Start a project
              <ArrowUpRight className="size-4" aria-hidden />
            </Magnetic>
          </m.div>
        </div>

        <m.dl
          variants={stagger(0.08, 1.55)}
          initial="hidden"
          animate="show"
          className="mt-14 flex flex-wrap gap-x-10 gap-y-6 border-t border-line pt-7 sm:mt-20 sm:gap-x-16"
        >
          {STATS.map((stat) => (
            <m.div
              key={stat.label}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <dt className="label mb-1.5">{stat.label}</dt>
              <dd className="font-mono text-2xl tabular-nums text-fg sm:text-3xl">
                {stat.value}
              </dd>
            </m.div>
          ))}
        </m.dl>
      </m.div>
    </section>
  );
}
