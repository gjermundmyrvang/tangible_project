"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

type Item = { src: string; alt: string };

export function StickyStack({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  return (
    <section
      ref={ref}
      className="relative bg-white"
      style={{ height: `${items.length * 120}vh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="relative h-full w-full">
          {items.map((item, i) => (
            <StackImage
              key={item.alt}
              item={item}
              index={i}
              total={items.length}
              progress={scrollYProgress}
            />
          ))}
        </div>

        <button
          onClick={() => {
            const el = ref.current;
            if (!el) return;
            window.scrollTo({
              top: el.offsetTop + el.offsetHeight,
              behavior: "smooth",
            });
          }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 rounded-full border border-white/20 bg-slate-950 px-6 py-3 text-sm font-medium text-white backdrop-blur transition hover:bg-slate-950/20 cursor-hover"
        >
          Skip gallery
        </button>
      </div>
    </section>
  );
}

function StackImage({
  item,
  index,
  total,
  progress,
}: {
  item: Item;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  const start = index / total;
  const end = (index + 1) / total;

  const y = useTransform(progress, [start, end], [120, -index * 30]);
  const scale = useTransform(progress, [start, end], [1.08, 1 - index * 0.05]);
  const opacity = useTransform(progress, [start, start + 0.15], [0, 1]);

  return (
    <motion.div
      style={{ y, scale, opacity, zIndex: 100 + index }}
      className="absolute left-1/2 top-1/2 w-[min(1200px,92vw)] -translate-x-1/2 -translate-y-1/2"
    >
      <div className="overflow-hidden border-white/10 bg-white/5 shadow-2xl shadow-black/40">
        <div className="relative aspect-16/10 w-full">
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 92vw, 1200px"
            priority={index === 0}
          />
        </div>
      </div>
    </motion.div>
  );
}
