"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Item = {
  src: string;
  alt: string;
};

export function GallerySlider({ items }: { items: Item[] }) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  // drag-to-scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      isDown = true;
      el.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      el.scrollLeft = startScrollLeft - dx;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDown = false;
      try {
        el.releasePointerCapture(e.pointerId);
      } catch {}
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      className="w-full overflow-x-auto overscroll-x-contain"
      style={{
        cursor: "grab",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <div className="flex gap-4 py-4">
        {items.map((img, i) => (
          <div
            key={`${img.alt}-${i}`}
            className="relative shrink-0 w-250 h-200"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="1000px"
              className="object-cover"
              draggable={false}
              priority={i < 2}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
