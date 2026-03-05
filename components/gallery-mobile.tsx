"use client";

import clsx from "clsx";
import Image from "next/image";

type Item = {
  src: string;
  alt: string;
};

export default function GalleryMobile({ items }: { items: Item[] }) {
  return (
    <div className="mt-6">
      <div
        className={clsx(
          "flex gap-4",
          "overflow-x-auto overscroll-x-contain",
          "snap-x snap-mandatory",
          "pb-2 pl-4",
          "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        )}
      >
        {items.map((img, i) => (
          <div
            key={`${img.alt}-${i}`}
            className={clsx("snap-start shrink-0", "w-[calc(100vw-2rem)]")}
          >
            <div className="relative overflow-hidden h-[70vh] ml-3">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="100vw"
                className="object-cover"
                priority={i < 2}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
