import { GallerySection } from "@/components/gallery";
import Landing from "@/components/landing";
import { Narrative } from "@/components/narrative";
import { MindMapResponsive } from "@/components/render-mind-map";
import { Sticky } from "@/components/sticky-content";
import { links, nodes } from "@/const/mind-map";
import { narrative } from "@/const/narrative";
import fs from "node:fs";
import path from "node:path";

function shuffleArray<T>(array: T[]) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function getGalleryItems() {
  const dir = path.join(process.cwd(), "public", "gallery");

  // if folder might not exist yet:
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(avif|webp|jpe?g|png)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const shuffled = shuffleArray(files);

  return shuffled.map((file) => ({
    src: `/gallery/${file}`,
    alt: file.replace(/\.(avif|webp|jpe?g|png)$/i, "").replace(/[-_]/g, " "),
    caption: "", // optional
  }));
}

export default function Home() {
  const items = getGalleryItems();
  return (
    <main className="min-h-screen justify-center items-center mx-auto font-sora">
      <Landing />
      <Sticky
        margin={250}
        bg="bg-gradient-to-b from-black via-purple-900 to-black"
      >
        <Narrative
          title="Narrative"
          description="The exhibition bla bla bla"
          steps={narrative}
        />
      </Sticky>
      <section className="relative h-screen w-full overflow-hidden">
        <video
          className="absolute inset-0 z-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          <source src="/videos/pulse.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 z-10 bg-black/75 backdrop-blur-xl" />

        <div className="relative z-20 h-full w-full">
          <MindMapResponsive nodes={nodes} links={links} />
        </div>
      </section>
      <Sticky
        margin={250}
        bg="bg-gradient-to-b from-black via-pink-900 to-black"
      >
        <GallerySection items={items} className="pt-4" />;
      </Sticky>
    </main>
  );
}
