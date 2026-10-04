"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Size = { width: number; height: number };

/**
 * Observes an element's box so animations can target real pixel distances
 * instead of guessing with `vw` math.
 *
 * Needed because translating by a measured pixel value stays on the
 * compositor, whereas animating `left: calc(100% - 4rem)` — what the old
 * spring demo did — forces a layout pass on every frame.
 */
export function useMeasure<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  const measure = useCallback((entry: ResizeObserverEntry) => {
    const box = entry.contentRect;
    setSize((prev) =>
      prev.width === box.width && prev.height === box.height
        ? prev
        : { width: box.width, height: box.height },
    );
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) measure(entry);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [measure]);

  return [ref, size] as const;
}
