"use client";

import { useMediaQuery } from "@/utils/useMediaQuery";
import clsx from "clsx";
import Image from "next/image";
import { useEffect, useState } from "react";
import GalleryMobile from "./gallery-mobile";
import { GallerySlider } from "./gallery-slider";

type Item = {
  src: string;
  alt: string;
  caption?: string;
};

export function GallerySection({
  items,
  className = "",
}: {
  items: Item[];
  className?: string;
}) {
  const [display, setDisplay] = useState<"grid" | "carousel">("grid");

  const isMobile = useMediaQuery("(max-width: 767px)");

  const handleChangeDisplay = () =>
    display === "grid" ? setDisplay("carousel") : setDisplay("grid");

  return (
    <section className={`min-h-screen flex ${className}`}>
      <div className="mx-auto w-full max-w-7xl">
        <h2 className="px-5 text-4xl font-bold text-white">Gallery</h2>
        {isMobile ? (
          <GalleryMobile items={items} />
        ) : (
          <RenderGalleryLaptop
            items={items}
            display={display}
            onPress={handleChangeDisplay}
          />
        )}
      </div>
    </section>
  );
}

const RenderGalleryLaptop = ({
  items,
  display,
  onPress,
}: {
  items: Item[];
  display: "grid" | "carousel";
  onPress: () => void;
}) => {
  if (display === "grid")
    return <GalleryGrid items={items} display={display} onPress={onPress} />;

  return <GallerySlider items={items} />;
};

const DisplayButtons = ({
  display = "grid",
  onPress,
}: {
  display: string;
  onPress: () => void;
}) => {
  return (
    <div className="flex items-center gap-4 text-white">
      <button
        className={clsx(
          "px-4 py-2",
          display === "grid"
            ? "border-2 border-pink-500"
            : "border border-gray-200",
        )}
        onClick={onPress}
        style={{
          cursor: "pointer",
        }}
      >
        Grid
      </button>
      <button
        className={clsx(
          "px-4 py-2",
          display === "carousel"
            ? "border-2 border-pink-500"
            : "border border-gray-200",
        )}
        onClick={onPress}
        style={{
          cursor: "pointer",
        }}
      >
        Carousel
      </button>
    </div>
  );
};

function tileClass(i: number) {
  const p = i % 15;

  let colSpan = "col-span-1";
  let rowSpan = "row-span-1";

  if (p === 0) {
    colSpan = "md:col-span-2";
    rowSpan = "md:row-span-2";
  } else if (p === 3 || p === 8 || p === 12) {
    colSpan = "md:col-span-2";
  } else if (p === 6) {
    rowSpan = "md:row-span-2";
  }

  return clsx(colSpan, rowSpan);
}

export function GalleryGrid({
  items,
  display,
  onPress,
}: {
  items: Item[];
  display: "grid" | "carousel";
  onPress: () => void;
}) {
  const PAGE_SIZE = 10;
  const [visible, setVisible] = useState(PAGE_SIZE);

  const shown = items.slice(0, visible);
  const canLoadMore = visible < items.length;

  // lightbox state (index is relative to "shown")
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = () => setOpenIndex(null);
  const prev = () =>
    setOpenIndex((i) => (i === null ? null : Math.max(0, i - 1)));
  const next = () =>
    setOpenIndex((i) =>
      i === null ? null : Math.min(shown.length - 1, i + 1),
    );

  // keyboard
  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex, shown.length]);

  // lock scroll while open
  useEffect(() => {
    if (openIndex === null) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [openIndex]);

  return (
    <div className="mt-4 px-4">
      <DisplayButtons display={display} onPress={onPress} />

      <div
        className={clsx(
          "grid gap-4 mt-4",
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
          "md:auto-rows-[180px]",
        )}
      >
        {shown.map((img, i) => (
          <button
            key={`${img.alt}-${i}`}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={clsx(
              "group relative overflow-hidden shadow-sm text-left",
              "transition-transform duration-200 hover:-translate-y-0.5",
              "focus:outline-none focus:ring-2 focus:ring-white/40",
              tileClass(i),
            )}
            aria-label={`Open image: ${img.alt}`}
            style={{ cursor: "pointer" }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              placeholder="empty"
              priority={i < 4}
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/35 via-black/0 to-black/0 opacity-60" />
          </button>
        ))}
      </div>

      {canLoadMore ? (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() =>
              setVisible((v) => Math.min(v + PAGE_SIZE, items.length))
            }
            className="rounded-full border border-white/15 bg-white/50 px-5 py-2.5 text-sm text-black backdrop-blur transition hover:bg-white/80"
            style={{ cursor: "pointer" }}
          >
            Load more
          </button>
        </div>
      ) : null}

      {openIndex !== null ? (
        <Lightbox
          items={shown}
          index={openIndex}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      ) : null}
    </div>
  );
}

function Lightbox({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  items: Item[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = items[index];

  return (
    <div className="fixed inset-0 z-50">
      {/* backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
        aria-label="Close"
      />

      {/* top bar */}
      <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between px-4 py-4">
        <div className="text-xs text-white/70">
          {index + 1} / {items.length}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white/90 backdrop-blur hover:bg-white/15"
        >
          Close
        </button>
      </div>

      {/* image */}
      <div className="absolute inset-0 flex items-center justify-center px-4">
        <div className="relative h-[78vh] w-full max-w-[96vw] overflow-hidden">
          <Image
            src={img.src}
            alt={img.alt}
            fill
            sizes="100vw"
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* nav */}
      <div className="absolute left-0 right-0 bottom-6 z-10 flex items-center justify-center gap-3 px-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className={clsx(
            "rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-white/90 backdrop-blur transition",
            index === 0 ? "opacity-40" : "hover:bg-white/15",
          )}
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={index === items.length - 1}
          className={clsx(
            "rounded-full border border-white/15 bg-white/10 px-5 py-2 text-sm text-white/90 backdrop-blur transition",
            index === items.length - 1 ? "opacity-40" : "hover:bg-white/15",
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}
