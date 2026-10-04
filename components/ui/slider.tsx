"use client";

import { useId } from "react";

/**
 * A labelled value slider.
 *
 * Built on a native `<input type="range">` rather than a slider component
 * library. Native gives correct `role="slider"` ARIA with min, max and
 * current value, full keyboard support (arrows, Home/End, PageUp/PageDown)
 * and platform touch behaviour — none of which the original hand-rolled
 * control had, and all of which the component library it briefly replaced
 * charged ~15KB gzipped to provide.
 *
 * Only the fill percentage is passed to CSS; the track and thumb are styled
 * entirely in `globals.css`.
 */
export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = (v) => String(v),
  accent = "mint",
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (value: number) => string;
  accent?: "mint" | "violet";
}) {
  const id = useId();
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="grid grid-cols-[4.75rem_1fr_2.75rem] items-center gap-3 sm:grid-cols-[6rem_1fr_3.25rem] sm:gap-4">
      <label htmlFor={id} className="label truncate">
        {label}
      </label>

      <input
        id={id}
        type="range"
        className="rng"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
        // The readout is a sibling, so point the accessible value at it to
        // announce "0.80s" rather than the raw "0.8".
        aria-valuetext={format(value)}
        style={
          {
            "--rng-pct": `${percent}%`,
            "--rng-accent":
              accent === "mint" ? "var(--color-mint)" : "var(--color-violet)",
          } as React.CSSProperties
        }
      />

      <output htmlFor={id} className="font-mono text-xs tabular-nums text-fg-muted">
        {format(value)}
      </output>
    </div>
  );
}
