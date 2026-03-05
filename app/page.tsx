import { GallerySection } from "@/components/gallery";
import Landing from "@/components/landing";
import { Narrative } from "@/components/narrative";
import { Sticky } from "@/components/sticky-content";
import { narrative } from "@/const/narrative";
import path from "node:path";
import fs from "node:fs";
import { MindMapSection } from "@/components/mind-map";
import { links, nodes } from "@/const/mind-map";
import { MindMapResponsive } from "@/components/render-mind-map";

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
      <Sticky margin={250} bg="bg-linear-to-b from-black  to-purple-900">
        <MindMapResponsive nodes={nodes} links={links} />
      </Sticky>
      <Sticky
        margin={250}
        bg="bg-gradient-to-b from-purple-900 via-black to-blue-400"
      >
        <Narrative
          title="Narrative"
          description="The exhibition bla bla bla"
          steps={narrative}
        />
      </Sticky>
      <Sticky margin={250} bg="bg-gradient-to-b from-blue-400 to-white">
        <GallerySection items={items} preloadAhead={6} />;
      </Sticky>
    </main>
  );
}
