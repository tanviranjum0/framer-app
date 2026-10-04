"use client";

import { animate, m, useInView, useMotionValue } from "motion/react";
import { Check, Copy, Play } from "lucide-react";
import { useCallback, useEffect, useReducer, useRef, useState } from "react";

import { Section } from "@/components/ui/section";
import { Slider } from "@/components/ui/slider";
import { useMeasure } from "@/hooks/use-measure";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

/* ===========================================================================
   State
   Two mutually exclusive ways to describe the same spring. Modelling the
   active mode explicitly removes the previous version's three interlocking
   booleans (`leftSection`, `alreadyAnimated`, `isFirstRender`) whose effects
   wrote to each other's state and fired animations on mount.
   =========================================================================== */

type Mode = "duration" | "physics";

type State = {
  mode: Mode;
  duration: number;
  bounce: number;
  stiffness: number;
  damping: number;
  mass: number;
};

type Action =
  | { type: "mode"; mode: Mode }
  | { type: "set"; key: keyof Omit<State, "mode">; value: number };

const INITIAL: State = {
  mode: "duration",
  duration: 0.8,
  bounce: 0.25,
  stiffness: 180,
  damping: 18,
  mass: 1,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "mode":
      return state.mode === action.mode ? state : { ...state, mode: action.mode };
    case "set":
      // Editing a control implies the mode it belongs to, so there is no way
      // to leave the panel showing values that are not driving the preview.
      return {
        ...state,
        mode:
          action.key === "duration" || action.key === "bounce"
            ? "duration"
            : "physics",
        [action.key]: action.value,
      };
  }
}

const transitionFor = (state: State) =>
  state.mode === "duration"
    ? { type: "spring" as const, duration: state.duration, bounce: state.bounce }
    : {
        type: "spring" as const,
        stiffness: state.stiffness,
        damping: state.damping,
        mass: state.mass,
      };

const snippetFor = (state: State) =>
  state.mode === "duration"
    ? `const transition = {
  type: "spring",
  duration: ${state.duration.toFixed(2)},
  bounce: ${state.bounce.toFixed(2)},
}`
    : `const transition = {
  type: "spring",
  stiffness: ${state.stiffness},
  damping: ${state.damping},
  mass: ${state.mass.toFixed(1)},
}`;

/**
 * Interactive spring tuner.
 *
 * The previous implementation animated `left: "calc(100% - 4rem)"`, which
 * forces a layout pass on every frame of every preview. This measures the
 * track once with a ResizeObserver and animates `x` to a pixel target, so the
 * same motion runs entirely on the compositor.
 */
export function SpringPlayground() {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const [trackRef, track] = useMeasure<HTMLDivElement>();
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // A demo that sits still until you find the Replay button is not a demo.
  // This fires the preview once, the first time it is properly on screen.
  const previewRef = useRef<HTMLDivElement>(null);
  const inView = useInView(previewRef, { once: true, amount: 0.4 });
  const hasAutoRun = useRef(false);

  // The preview owns three motion values so replays can interrupt mid-flight
  // and resolve from wherever they are, which is the whole point of a spring.
  const x = useMotionValue(0);
  const scale = useMotionValue(0.35);
  const rotate = useMotionValue(0);
  const flipped = useRef(false);

  const travel = Math.max(0, track.width - 64);

  const run = useCallback(() => {
    const transition = transitionFor(state);
    const next = !flipped.current;
    flipped.current = next;

    animate(x, next ? travel : 0, transition);
    animate(scale, next ? 1 : 0.35, transition);
    animate(rotate, next ? 180 : 0, transition);
  }, [state, travel, x, scale, rotate]);

  // Replay whenever the tuning changes, so dragging a slider shows its effect
  // immediately. Deliberately keyed on the values, not on a mount flag.
  useEffect(() => {
    const transition = transitionFor(state);
    const target = flipped.current ? travel : 0;

    animate(x, target, transition);
    animate(scale, flipped.current ? 1 : 0.35, transition);
    animate(rotate, flipped.current ? 180 : 0, transition);
  }, [state, travel, x, scale, rotate]);

  // `travel` guards against firing before the track has been measured, which
  // would animate to 0 and look like nothing happened.
  useEffect(() => {
    if (!inView || hasAutoRun.current || travel <= 0) return;
    hasAutoRun.current = true;
    run();
  }, [inView, travel, run]);

  const copy = useCallback(async () => {
    const text = snippetFor(state);
    try {
      // Async Clipboard API. The old version appended a textarea to the body
      // and called the deprecated document.execCommand("copy").
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Transition copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast("Clipboard unavailable — select the code to copy", "error");
    }
  }, [state, toast]);

  const isDuration = state.mode === "duration";

  return (
    <Section
      id="spring"
      index="09"
      kicker="Spring tuning"
      title="Two vocabularies, one spring"
      note="Duration and bounce, or stiffness, damping and mass. Changing any control replays the preview immediately — springs can be interrupted mid-flight and still resolve, which is why every gesture on this site uses one."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:gap-12">
        {/* ── Preview ─────────────────────────────────────────────────── */}
        <div ref={previewRef} className="order-1 flex flex-col gap-6">
          <div
            ref={trackRef}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-8"
          >
            <div className="mb-8 flex items-center justify-between gap-4">
              <span className="label">Preview</span>
              <button
                type="button"
                onClick={run}
                className="inline-flex items-center gap-2 rounded-full border border-line-hi px-4 py-2 font-mono text-xs transition-colors hover:border-mint/60 hover:text-mint"
              >
                <Play className="size-3" aria-hidden />
                Replay
              </button>
            </div>

            {/* Translate */}
            <div className="relative mb-8 h-16">
              <m.div
                style={{ x }}
                className="gpu absolute left-0 top-0 size-16 rounded-xl bg-gradient-to-br from-mint to-mint-dim"
              />
              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 top-1/2 -z-10 border-t border-dashed border-line"
              />
            </div>

            {/* Scale and rotate */}
            <div className="flex items-center justify-between gap-6">
              <div className="grid size-20 place-items-center">
                <m.div
                  style={{ scale }}
                  className="gpu size-20 rounded-xl bg-gradient-to-br from-violet to-violet/50"
                />
              </div>
              <div className="grid size-20 place-items-center">
                <m.div
                  style={{ rotate }}
                  className="gpu size-16 rounded-xl bg-gradient-to-br from-amber to-rose"
                />
              </div>
            </div>
          </div>

          {/* Snippet */}
          <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-raised">
            <div className="flex items-center justify-between border-b border-line px-5 py-3">
              <span className="label">Output</span>
              <button
                type="button"
                onClick={copy}
                className="inline-flex items-center gap-2 rounded-md px-2 py-1 font-mono text-xs text-fg-muted transition-colors hover:text-mint"
              >
                {copied ? (
                  <Check className="size-3.5" aria-hidden />
                ) : (
                  <Copy className="size-3.5" aria-hidden />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-fg">
              <code>{snippetFor(state)}</code>
            </pre>
          </div>
        </div>

        {/* ── Controls ────────────────────────────────────────────────── */}
        <div className="order-2 flex flex-col gap-4">
          <Panel
            title="Duration and bounce"
            hint="Describe the result"
            active={isDuration}
            onActivate={() => dispatch({ type: "mode", mode: "duration" })}
          >
            <Slider
              label="Duration"
              value={state.duration}
              onChange={(value) => dispatch({ type: "set", key: "duration", value })}
              min={0.1}
              max={3}
              step={0.02}
              format={(v) => `${v.toFixed(2)}s`}
            />
            <Slider
              label="Bounce"
              value={state.bounce}
              onChange={(value) => dispatch({ type: "set", key: "bounce", value })}
              min={0}
              max={1}
              step={0.01}
              format={(v) => v.toFixed(2)}
            />
          </Panel>

          <Panel
            title="Stiffness, damping, mass"
            hint="Describe the physics"
            active={!isDuration}
            accent="violet"
            onActivate={() => dispatch({ type: "mode", mode: "physics" })}
          >
            <Slider
              label="Stiffness"
              value={state.stiffness}
              onChange={(value) => dispatch({ type: "set", key: "stiffness", value })}
              min={10}
              max={600}
              step={5}
              accent="violet"
            />
            <Slider
              label="Damping"
              value={state.damping}
              onChange={(value) => dispatch({ type: "set", key: "damping", value })}
              min={1}
              max={60}
              step={1}
              accent="violet"
            />
            <Slider
              label="Mass"
              value={state.mass}
              onChange={(value) => dispatch({ type: "set", key: "mass", value })}
              min={0.1}
              max={6}
              step={0.1}
              format={(v) => v.toFixed(1)}
              accent="violet"
            />
          </Panel>

          <p className="px-1 font-mono text-xs leading-relaxed text-fg-faint">
            Editing a control switches to the mode it belongs to, so the panel
            can never show values that are not driving the preview.
          </p>
        </div>
      </div>
    </Section>
  );
}

function Panel({
  title,
  hint,
  active,
  accent = "mint",
  onActivate,
  children,
}: {
  title: string;
  hint: string;
  active: boolean;
  accent?: "mint" | "violet";
  onActivate: () => void;
  children: React.ReactNode;
}) {
  return (
    <m.fieldset
      onPointerDown={onActivate}
      animate={{ opacity: active ? 1 : 0.5 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "rounded-2xl border p-5 transition-colors duration-300",
        active
          ? accent === "mint"
            ? "border-mint/40 bg-mint/[0.04]"
            : "border-violet/40 bg-violet/[0.04]"
          : "border-line bg-surface/40",
      )}
    >
      <legend className="sr-only">{title}</legend>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium tracking-tight">{title}</span>
        <span className="label hidden sm:block">{hint}</span>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </m.fieldset>
  );
}
