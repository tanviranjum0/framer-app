"use client";

import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";
import { EASE_OUT, SPRING } from "@/lib/motion";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: string;
  message: string;
  tone: ToastTone;
};

type ToastApi = {
  toast: (message: string, tone?: ToastTone) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

/**
 * Replaces the previous module-level `let addNewNotification` export, which
 * was assigned during render and therefore broke under StrictMode double
 * rendering and could be called before the component existed.
 */
export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

const TONE_STYLES: Record<ToastTone, string> = {
  success: "border-mint/40 text-mint",
  error: "border-rose/40 text-rose",
  info: "border-violet/40 text-violet",
};

const DISMISS_AFTER = 4200;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>());

  const dismiss = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "info") => {
      const id =
        globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

      // Cap the stack so a jammed submit button cannot paper over the page.
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }]);
      timers.current.set(
        id,
        setTimeout(() => dismiss(id), DISMISS_AFTER),
      );
    },
    [dismiss],
  );

  const api = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={api}>
      {children}

      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end sm:p-6"
      >
        {/* popLayout lets survivors slide up while the removed toast is still
            animating out, instead of snapping into the gap. */}
        <AnimatePresence initial={false} mode="popLayout">
          {toasts.map((item) => (
            <m.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                transition: { duration: 0.2, ease: EASE_OUT },
              }}
              transition={SPRING.snappy}
              role="status"
              className={cn(
                "pointer-events-auto flex w-[min(24rem,calc(100vw-2rem))] items-start gap-3",
                "rounded-xl border bg-surface/95 p-4 pr-3 backdrop-blur-xl",
                "shadow-[0_18px_50px_-12px_rgba(0,0,0,0.8)]",
                TONE_STYLES[item.tone],
              )}
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current" />
              <p className="flex-1 text-sm leading-relaxed text-fg">
                {item.message}
              </p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="-m-1 rounded-md p-1 text-fg-faint transition-colors hover:text-fg"
              >
                <X className="size-4" aria-hidden />
              </button>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
