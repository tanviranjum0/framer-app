"use client";

import {
  animate,
  m,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "motion/react";
import Image from "next/image";
import { RotateCcw, Undo2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Section } from "@/components/ui/section";
import { CARDS } from "@/lib/showcase";
import { EASE_OUT, SPRING } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Distance × release velocity needed to commit a throw. */
const FLING_THRESHOLD = 9000;

type Direction = 1 | -1;

/**
 * Drag-to-dismiss card deck.
 *
 * Rebuilt from a version that placed cards at `top: calc(50% - 40vh)` and
 * `left: calc(50vw - 10vw)` with a fixed `40vh × 80vh` size, which put them
 * off-centre inside their own container and overflowed on any short or
 * narrow viewport. Sizing here is one aspect-ratio box with a clamped width,
 * so the deck behaves identically from 360px to 2560px.
 *
 * Every card stays mounted for the life of the section. Dismissing animates
 * a card out rather than unmounting it, which means undo animates back in
 * for free and there is no AnimatePresence bookkeeping to get wrong.
 */
export function CardDeck() {
  // Index → direction it was thrown. Insertion order is the undo stack.
  const [thrown, setThrown] = useState<Map<number, Direction>>(new Map());
  const reduced = useReducedMotion();

  const order = CARDS.map((_, i) => i).filter((i) => !thrown.has(i));
  const topIndex = order[0];

  const dismiss = useCallback((index: number, direction: Direction) => {
    setThrown((prev) => {
      if (prev.has(index)) return prev;
      const next = new Map(prev);
      next.set(index, direction);
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    setThrown((prev) => {
      if (prev.size === 0) return prev;
      const next = new Map(prev);
      const last = Array.from(next.keys()).pop();
      if (last !== undefined) next.delete(last);
      return next;
    });
  }, []);

  const reset = useCallback(() => setThrown(new Map()), []);

  return (
    <Section
      id="deck"
      index="03"
      kicker="Drag physics"
      title="Throw it and let the spring decide"
      note="Pointer offset multiplied by release velocity decides whether a card commits or snaps home. Rotation and the two stamps all read from the same x motion value, so the card reacts continuously to the gesture without a single React re-render."
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_minmax(0,22rem)] lg:items-center lg:gap-16">
        <div className="relative mx-auto w-full max-w-sm">
          <div className="relative aspect-[3/4] w-full">
            {/* Empty plate behind the stack. */}
            <div className="absolute inset-0 grid place-items-center rounded-2xl border border-dashed border-line">
              <div className="text-center">
                <p className="label mb-3">Deck empty</p>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex items-center gap-2 rounded-full border border-line-hi px-4 py-2 text-sm transition-colors hover:border-mint/60 hover:text-mint"
                >
                  <RotateCcw className="size-3.5" aria-hidden />
                  Deal again
                </button>
              </div>
            </div>

            {CARDS.map((src, index) => (
              <Card
                key={index}
                src={src}
                depth={order.indexOf(index)}
                isTop={index === topIndex}
                thrownTo={thrown.get(index)}
                reduced={Boolean(reduced)}
                onDismiss={(direction) => dismiss(index, direction)}
              />
            ))}
          </div>

          {/* Touch and keyboard parity. The old deck was drag-only, so it was
              unreachable by keyboard and fiddly on a phone. */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <DeckButton
              onClick={() => topIndex !== undefined && dismiss(topIndex, -1)}
              disabled={topIndex === undefined}
              label="Pass on this card"
            >
              <span aria-hidden>←</span>
            </DeckButton>
            <DeckButton
              onClick={undo}
              disabled={thrown.size === 0}
              label="Undo last card"
            >
              <Undo2 className="size-4" aria-hidden />
            </DeckButton>
            <DeckButton
              onClick={() => topIndex !== undefined && dismiss(topIndex, 1)}
              disabled={topIndex === undefined}
              label="Keep this card"
            >
              <span aria-hidden>→</span>
            </DeckButton>
          </div>
        </div>

        <div className="lg:pl-4">
          <dl className="space-y-5 font-mono text-xs">
            <Row term="In deck" value={`${order.length} / ${CARDS.length}`} />
            <Row term="Threshold" value={`${FLING_THRESHOLD} px·px/s`} />
            <Row term="Release" value="spring 300 / 38" />
            <Row term="Rotation" value="x → ±14°" />
          </dl>

          <p className="mt-8 max-w-sm text-sm leading-relaxed text-fg-muted">
            Drag the top card in any direction. A short, slow drag returns it
            to centre; a decisive flick sends it out along the vector you let
            go on. The arrow buttons drive the same code path, so pointer,
            touch and keyboard all get identical physics.
          </p>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------------ */

function Card({
  src,
  depth,
  isTop,
  thrownTo,
  reduced,
  onDismiss,
}: {
  src: (typeof CARDS)[number];
  /** Position in the live stack, or -1 once thrown. */
  depth: number;
  isTop: boolean;
  thrownTo: Direction | undefined;
  reduced: boolean;
  onDismiss: (direction: Direction) => void;
}) {
  // Drag offset lives in motion values this component owns, so the gesture
  // never touches React state.
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-220, 0, 220], [-14, 0, 14], { clamp: true });
  const keepOpacity = useTransform(x, [40, 150], [0, 1], { clamp: true });
  const passOpacity = useTransform(x, [-150, -40], [1, 0], { clamp: true });

  // Throwing and undoing are driven imperatively on the same motion values
  // the drag writes to. Animating them through the `animate` prop instead
  // would fight the gesture for ownership of x and y.
  useEffect(() => {
    if (thrownTo) {
      animate(x, thrownTo * 620, SPRING.drag);
      animate(y, -80, SPRING.drag);
    } else {
      animate(x, 0, SPRING.drag);
      animate(y, 0, SPRING.drag);
    }
  }, [thrownTo, x, y]);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const powerX = Math.abs(info.offset.x) * info.velocity.x;
    const powerY = Math.abs(info.offset.y) * info.velocity.y;

    if (
      Math.abs(powerX) > FLING_THRESHOLD ||
      Math.abs(powerY) > FLING_THRESHOLD
    ) {
      onDismiss(info.offset.x < 0 ? -1 : 1);
    }
    // Otherwise dragSnapToOrigin walks it home on the drag spring, with no
    // imperative call and no state to unwind.
  };

  const isGone = thrownTo !== undefined;
  const inStack = depth >= 0 && depth < 3;

  return (
    // Outer layer owns the card's place in the stack. Separating it from the
    // inner drag layer is what lets both animate without contending for the
    // same transform.
    <m.div
      animate={{
        scale: isGone ? 0.92 : 1 - Math.max(depth, 0) * 0.05,
        y: isGone ? 0 : Math.max(depth, 0) * 14,
        rotate: isGone ? 0 : depth <= 0 ? 0 : depth % 2 === 0 ? 2.5 : -2.5,
        opacity: isGone ? 0 : inStack ? 1 : 0,
      }}
      transition={SPRING.smooth}
      style={{ zIndex: isGone ? 40 : 30 - Math.max(depth, 0) }}
      className="absolute inset-0"
    >
      <m.div
        drag={isTop && !reduced}
        dragSnapToOrigin
        dragElastic={0.5}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 38 }}
        onDragEnd={handleDragEnd}
        style={{ x, y, rotate }}
        whileDrag={{ scale: 1.03 }}
        className={cn(
          "size-full overflow-hidden rounded-2xl border border-line-hi bg-surface",
          "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)]",
          isTop && !reduced
            ? "cursor-grab active:cursor-grabbing"
            : "pointer-events-none",
        )}
      >
        <Image
          src={src}
          alt=""
          fill
          sizes="(max-width: 640px) 90vw, 384px"
          placeholder="blur"
          draggable={false}
          className="select-none object-cover"
        />

        <m.span
          aria-hidden
          style={{ opacity: keepOpacity }}
          className="absolute left-5 top-5 rounded-md border-2 border-mint px-3 py-1 font-mono text-xs uppercase tracking-widest text-mint"
        >
          Keep
        </m.span>
        <m.span
          aria-hidden
          style={{ opacity: passOpacity }}
          className="absolute right-5 top-5 rounded-md border-2 border-rose px-3 py-1 font-mono text-xs uppercase tracking-widest text-rose"
        >
          Pass
        </m.span>

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
      </m.div>
    </m.div>
  );
}

function DeckButton({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      transition={{ duration: 0.15, ease: EASE_OUT }}
      className="grid size-11 place-items-center rounded-full border border-line-hi text-sm text-fg-muted transition-colors enabled:hover:border-mint/60 enabled:hover:text-mint disabled:opacity-30"
    >
      {children}
    </m.button>
  );
}

function Row({ term, value }: { term: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
      <dt className="label">{term}</dt>
      <dd className="tabular-nums text-fg">{value}</dd>
    </div>
  );
}
