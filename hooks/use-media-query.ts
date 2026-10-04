"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Media query subscription built on `useSyncExternalStore`.
 *
 * `matchMedia` is an external store, so this is the primitive React 19 wants
 * for reading it: the server snapshot is explicit (no hydration mismatch),
 * updates arrive through the subscription callback, and nothing calls
 * setState from an effect body — which the earlier `useState` + `useEffect`
 * version did, triggering a cascading render on every mount.
 *
 * The server and first-client snapshot is always `false`, so markup matches
 * and the pointer-driven effects below stay off until the real value lands.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

/**
 * True for mouse, trackpad and stylus input.
 *
 * This is the gate for every pointer-driven effect on the site. Touch devices
 * get a purpose-built interaction instead of a hover effect they could never
 * trigger — and, more to the point, never pay to render one.
 */
export const useFinePointer = () =>
  useMediaQuery("(hover: hover) and (pointer: fine)");

export const useIsDesktop = () => useMediaQuery("(min-width: 1024px)");
