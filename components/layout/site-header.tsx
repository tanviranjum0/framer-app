"use client";

import { AnimatePresence, m, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";
import { EASE_OUT, SPRING, stagger } from "@/lib/motion";
import { LocalClock } from "./local-clock";

const NAV = [
  { href: "#sequence", label: "Scroll" },
  { href: "#deck", label: "Drag" },
  { href: "#spring", label: "Spring" },
  { href: "#pointer", label: "Pointer" },
  { href: "#contact", label: "Contact" },
];

export function SiteHeader() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  /**
   * Hide on scroll down, reveal on scroll up.
   *
   * This is the one place a scroll listener is allowed to call setState: the
   * value is a boolean that flips a handful of times per session, not a
   * continuous value. Everything continuous in this app goes through
   * `useTransform` and never re-renders React.
   */
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    const delta = latest - previous;

    setAtTop(latest < 24);

    if (menuOpen) return;
    if (latest < 180) {
      setHidden(false);
    } else if (Math.abs(delta) > 6) {
      setHidden(delta > 0);
    }
  });

  const close = useCallback(() => setMenuOpen(false), []);

  return (
    <m.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: hidden ? -96 : 0, opacity: 1 }}
      transition={{ ...SPRING.smooth, opacity: { duration: 0.6, delay: 1.1 } }}
      className="fixed inset-x-0 top-0 z-[80]"
    >
      <div
        className={cn(
          "border-b transition-colors duration-500",
          atTop && !menuOpen
            ? "border-transparent"
            : "border-line bg-ink/70 backdrop-blur-xl",
        )}
      >
        <div className="shell flex h-16 items-center justify-between gap-6 sm:h-18">
          <a
            href="#main"
            className="group flex items-center gap-3"
            aria-label="Motion Lab, back to top"
          >
            <m.span
              aria-hidden
              className="block size-2.5 rounded-full bg-mint"
              animate={{ scale: [1, 0.55, 1], opacity: [1, 0.45, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="text-sm font-medium tracking-tight">
              Motion<span className="text-fg-faint">/</span>Lab
            </span>
          </a>

          <nav aria-label="Sections" className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="relative rounded-full px-3.5 py-2 text-sm text-fg-muted transition-colors hover:text-fg"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="label hidden lg:inline">CTG</span>
              <LocalClock />
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="-mr-2 rounded-lg p-2 text-fg-muted transition-colors hover:text-fg md:hidden"
            >
              {menuOpen ? (
                <X className="size-5" aria-hidden />
              ) : (
                <Menu className="size-5" aria-hidden />
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <m.nav
            id="mobile-nav"
            aria-label="Sections"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            className="overflow-hidden border-b border-line bg-ink/95 backdrop-blur-xl md:hidden"
          >
            <m.ul
              variants={stagger(0.05, 0.08)}
              initial="hidden"
              animate="show"
              className="shell flex flex-col py-4"
            >
              {NAV.map((item) => (
                <m.li
                  key={item.href}
                  variants={{
                    hidden: { opacity: 0, x: -12 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <a
                    href={item.href}
                    onClick={close}
                    className="block py-3 text-2xl tracking-tight text-fg-muted transition-colors hover:text-fg"
                  >
                    {item.label}
                  </a>
                </m.li>
              ))}
            </m.ul>
          </m.nav>
        ) : null}
      </AnimatePresence>
    </m.header>
  );
}
