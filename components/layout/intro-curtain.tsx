/**
 * First-paint curtain.
 *
 * Animated entirely in CSS (see `.intro-curtain` in globals.css) so it plays
 * during hydration, before any JavaScript has parsed. That matters for two
 * reasons: the page never shows a bare, un-animated hero, and the curtain
 * covers the async fetch of the Motion feature bundle that MotionProvider
 * loads — so by the time it lifts, every `m.*` component can animate.
 *
 * It is a server component with no interactivity and `pointer-events: none`,
 * so it costs nothing beyond its own markup.
 */
export function IntroCurtain() {
  return (
    <div className="intro-curtain" aria-hidden>
      <div className="intro-curtain__mark flex items-center gap-3">
        <span className="size-2.5 rounded-full bg-mint" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted">
          Motion Lab
        </span>
      </div>
    </div>
  );
}
