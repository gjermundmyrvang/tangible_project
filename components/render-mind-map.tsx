"use client";

import { useMediaQuery } from "@/utils/useMediaQuery";
import { MindMapTreeMobile } from "./mind-map-mobile";
import { MindMapSection } from "./mind-map";

type Node = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  size?: "sm" | "md" | "lg";
};

type Link = { from: string; to: string };

export function MindMapResponsive({
  title = "Pulse",
  nodes,
  links,
}: {
  title?: string;
  nodes: Node[];
  links: Link[];
}) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  return isMobile ? (
    <MindMapTreeMobile title={title} nodes={nodes} links={links} />
  ) : (
    <MindMapSection title={title} nodes={nodes} links={links} />
  );
}
