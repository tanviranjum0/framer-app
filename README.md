# Motion Lab

A working reference of twelve interaction patterns built with
[Motion for React](https://motion.dev) and Next.js 16 — scroll timelines,
drag physics, spring tuning and pointer fields.

Every effect animates `transform`, `opacity`, `filter` or `clip-path` only,
adapts itself to coarse-pointer input, and stands down on
`prefers-reduced-motion`.

```bash
npm install
npm run dev     # http://localhost:3000
```

| Script              | Purpose                                         |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Dev server (Turbopack)                          |
| `npm run build`     | Production build                                |
| `npm start`         | Serve the production build                      |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | `tsc --noEmit`                                  |

---

## Structure

```
app/
  layout.tsx            fonts, metadata, providers
  page.tsx              section composition (server component)
  globals.css           design tokens, utilities, CSS-only effects
  opengraph-image.tsx   social card, generated at build time
  api/contact/route.ts  validated, rate-limited contact endpoint
components/
  providers/            LazyMotion + MotionConfig, toast context
  layout/               header, footer, scroll progress, intro curtain
  sections/             the twelve showcase sections
  ui/                   Section frame, reveals, magnetic button, slider,
                        velocity track
hooks/                  media query, element measurement
lib/
  motion.ts             easings, springs, shared variants  ← start here
  showcase.ts           image manifest (static imports)
  contact-*.ts          shared validation + option sets
  db.ts / mail.ts       server-only persistence and delivery
scripts/
  optimize-assets.mjs   regenerates public/showcase from source art
```

`lib/motion.ts` is the single source of truth for easing curves, spring
configs and shared variants. Reusing those three easings across unrelated
sections is most of what makes the site feel like one piece of software
rather than a pile of demos.

---

## The rules this codebase follows

**Animate four properties.** `transform`, `opacity`, `filter`, `clip-path`.
Nothing else. Anything touching `width`, `top`, `left`, `margin` or `gap`
forces a layout pass on a scroll frame.

**Scroll drives motion values, not state.** Continuous values go through
`useScroll` → `useTransform`, which writes to the DOM outside React's render
cycle. `setState` in a scroll handler is reserved for genuinely discrete
changes — the header's hide/reveal boolean, for instance.

**Smooth the input, once, at the source.** Wheel and trackpad scroll arrives
as a step function. `useSpring(scrollYProgress, SCROLL_SPRING)` smooths every
derived value downstream for the price of one spring.

**Nothing mounts or unmounts on scroll.** Panels crossfade on opacity while
staying in the tree, so nothing re-decodes and scroll position never jumps.

**Hooks never go in loops.** Grid cells are plain `<div>`s; their ripple is a
CSS animation with a per-cell delay.

**Touch gets its own interaction.** `useFinePointer()` gates pointer-driven
effects. Touch devices get a purpose-built gesture instead of a hover effect
they could never trigger — and never pay to render one.

**Reduced motion is handled centrally.** `MotionConfig reducedMotion="user"`
resolves transform animations instantly app-wide; components only opt out
further when an effect is purely decorative.

---

## Contact form

The endpoint degrades gracefully. With no environment variables set it still
validates input and answers `{ ok: true, demo: true }`, so the site deploys
and works before any secret exists. Add credentials later and it starts
persisting and mailing with no code change.

Copy `.env.example` to `.env.local`:

| Variable       | Effect when set                        |
| -------------- | -------------------------------------- |
| `MONGODB_URI`  | Submissions persist to MongoDB         |
| `SMTP_*`       | Notification + acknowledgement mail     |
| `CONTACT_TO`   | Where enquiries are delivered           |
| `CONTACT_FROM` | `From:` identity (defaults to SMTP_USER)|

> **None of these may be prefixed `NEXT_PUBLIC_`.** Next inlines anything with
> that prefix into the browser bundle. `lib/mail.ts`, `lib/db.ts` and
> `models/message.ts` all import `server-only`, so importing them from a
> client component is a build error rather than a silent credential leak.

---

## Assets

`public/showcase/` is generated, not authored. The source art was 37MB,
including a 7MB PNG and a screenshot 11,708px tall; `scripts/optimize-assets.mjs`
crops and resizes it to the dimensions actually rendered — 1.9MB in total.

```bash
node scripts/optimize-assets.mjs   # needs the original art in public/
```

Images are imported statically (`lib/showcase.ts`) so Next supplies intrinsic
dimensions and a blur placeholder automatically, and every `<Image>` carries an
explicit `sizes` so the browser never downloads a 2560px candidate for a 208px
box.
