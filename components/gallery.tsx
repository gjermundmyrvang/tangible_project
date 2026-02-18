"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

type Item = {
  src: string;
  alt: string;
  caption?: string;
};

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

function usePrefersReducedMotionSafe() {
  const rm = useReducedMotion();
  return !!rm;
}

export function GallerySection({
  items,
  autoPlayMs = 4500,
  preloadAhead = 2,
  className = "",
}: {
  items: Item[];
  autoPlayMs?: number;
  preloadAhead?: number;
  className?: string;
}) {
  const reducedMotion = usePrefersReducedMotionSafe();
  const [index, setIndex] = React.useState(0);
  const [dir, setDir] = React.useState<1 | -1>(1);
  const [isPaused, setPaused] = React.useState(false);

  const total = items.length;

  const go = React.useCallback(
    (next: number, direction: 1 | -1) => {
      if (!total) return;
      setDir(direction);
      setIndex(mod(next, total));
    },
    [total],
  );

  const next = React.useCallback(() => go(index + 1, 1), [go, index]);
  const prev = React.useCallback(() => go(index - 1, -1), [go, index]);

  // Autoplay (pauses on hover/focus + when user interacts)
  React.useEffect(() => {
    if (isPaused || total <= 1) return;
    const t = window.setInterval(() => next(), autoPlayMs);
    return () => window.clearInterval(t);
  }, [isPaused, total, next, autoPlayMs]);

  // Keyboard support
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        setPaused(true);
        next();
      }
      if (e.key === "ArrowLeft") {
        setPaused(true);
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Preload next images (don’t spam network)
  React.useEffect(() => {
    if (total <= 1) return;
    const head = preloadAhead;
    for (let k = 1; k <= head; k++) {
      const it = items[mod(index + k, total)];
      if (!it?.src) continue;
      const img = new window.Image();
      img.decoding = "async";
      img.loading = "eager";
      img.src = it.src;
    }
  }, [index, items, total, preloadAhead]);

  // Swipe on mobile
  const startX = React.useRef<number | null>(null);

  const active = items[index];

  return (
    <section className={`min-h-screen flex items-center ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-5xl font-semibold tracking-tight">Process</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit.
              Voluptatibus incidunt.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPaused((p) => !p)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border bg-white/6 border-white/10"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            >
              {isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </button>
            <div className="text-sm text-neutral-500">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(total).padStart(2, "0")}
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-4xl bg-white/10 shadow-sm"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onPointerDown={(e) => {
            startX.current = e.clientX;
          }}
          onPointerUp={(e) => {
            const sx = startX.current;
            startX.current = null;
            if (sx == null) return;
            const dx = e.clientX - sx;
            if (Math.abs(dx) < 40) return;
            setPaused(true);
            if (dx < 0) next();
            else prev();
          }}
          role="region"
          aria-label="Image gallery"
        >
          {/* big frame height */}
          <div className="relative aspect-video w-full md:aspect-16/8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active?.src ?? index}
                initial={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: dir === 1 ? 24 : -24, scale: 0.995 }
                }
                animate={
                  reducedMotion
                    ? { opacity: 1 }
                    : { opacity: 1, x: 0, scale: 1 }
                }
                exit={
                  reducedMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: dir === 1 ? -24 : 24, scale: 0.995 }
                }
                transition={{ duration: 0.28, ease: "easeOut" }}
                className="absolute inset-0"
              >
                {active ? (
                  <Image
                    src={active.src}
                    alt={active.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 1100px"
                    priority={index === 0}
                  />
                ) : null}

                <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/55 via-black/15 to-transparent" />
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6">
                  <div className="max-w-3xl text-base font-medium text-white drop-shadow">
                    {active?.caption ?? " "}
                  </div>
                  <div className="mt-3 text-sm text-white/80">
                    Swipe, click arrows, or press ← →
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-y-0 left-4 flex items-center">
              <button
                onClick={() => {
                  setPaused(true);
                  prev();
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/15"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-4 flex items-center">
              <button
                onClick={() => {
                  setPaused(true);
                  next();
                }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/15"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur py-2">
            <div className="flex gap-2 overflow-x-auto p-3">
              {items.map((it, i) => (
                <button
                  key={it.src + i}
                  onClick={() => {
                    setPaused(true);
                    setDir(i > index ? 1 : -1);
                    setIndex(i);
                  }}
                  className={[
                    "relative h-16 w-28 flex-none overflow-hidden rounded-xl border",
                    i === index
                      ? "border-neutral-900"
                      : "border-neutral-200 hover:border-neutral-400",
                  ].join(" ")}
                  aria-label={`Go to image ${i + 1}`}
                >
                  <Image
                    src={it.src}
                    alt={it.alt}
                    fill
                    className="object-cover"
                    sizes="112px"
                    // thumbnails are tiny; let them lazy load
                  />
                  {i === index ? (
                    <div className="absolute inset-0 ring-2 ring-neutral-900" />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
