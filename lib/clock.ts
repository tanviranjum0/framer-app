/**
 * A single shared wall-clock store.
 *
 * Two components display local time (the header and the footer). Giving each
 * its own `setInterval` means two timers doing identical work; this keeps one
 * timer for the whole app and tears it down when the last subscriber leaves.
 *
 * Exposed as an external store so `useSyncExternalStore` can read it. That
 * is the primitive React 19 wants for this: it gives a distinct server
 * snapshot (no hydration mismatch from `new Date()` during render) without
 * calling setState from an effect body.
 */
type Listener = () => void;

const listeners = new Set<Listener>();
let timer: ReturnType<typeof setInterval> | null = null;

/** Epoch seconds, or null before the first client tick. */
let current: number | null = null;

function tick() {
  current = Math.floor(Date.now() / 1000);
}

export function subscribeToClock(onChange: Listener): () => void {
  listeners.add(onChange);

  if (!timer) {
    // Seed immediately so the first paint after subscribing has a real value.
    // React re-reads the snapshot after subscribing, so this is picked up
    // without the store having to call `onChange` itself.
    tick();
    timer = setInterval(() => {
      tick();
      for (const listener of listeners) listener();
    }, 1000);
  }

  return () => {
    listeners.delete(onChange);
    if (listeners.size === 0 && timer) {
      clearInterval(timer);
      timer = null;
      current = null;
    }
  };
}

/**
 * Must be referentially stable between renders within the same second, or
 * React will loop warning that the snapshot is uncached. Returning the
 * module-level number satisfies that.
 */
export const getClockSnapshot = (): number | null => current;

export const getClockServerSnapshot = (): number | null => null;
