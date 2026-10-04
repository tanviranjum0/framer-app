"use client";

import { useMemo, useSyncExternalStore } from "react";

import {
  getClockServerSnapshot,
  getClockSnapshot,
  subscribeToClock,
} from "@/lib/clock";

/**
 * Ticking local time.
 *
 * The original ran `setInterval` with no cleanup and wrote through
 * `document.querySelector(".display-time").innerText`, which leaked one
 * interval per mount and mutated a node React owned.
 *
 * This reads a single shared clock store through `useSyncExternalStore`, so
 * both instances on the page share one timer, the server renders a stable
 * placeholder (no hydration mismatch from calling `new Date()` during
 * render), and no state is set from an effect body.
 */
export function LocalClock({ timeZone = "Asia/Dhaka" }: { timeZone?: string }) {
  const seconds = useSyncExternalStore(
    subscribeToClock,
    getClockSnapshot,
    getClockServerSnapshot,
  );

  // Intl.DateTimeFormat construction is comparatively expensive, so build it
  // once per time zone rather than once per tick.
  const formatter = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone,
      }),
    [timeZone],
  );

  return (
    <span className="font-mono text-xs tabular-nums text-fg-muted">
      {/* Same character count as a real time, so the row never reflows when
          the first tick arrives. */}
      {seconds === null ? "--:--:--" : formatter.format(seconds * 1000)}
    </span>
  );
}
