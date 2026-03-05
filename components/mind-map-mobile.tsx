"use client";

import { buildAdjacency, buildSpanningTree } from "@/utils/utils";
import clsx from "clsx";
import * as React from "react";

type Node = {
  id: string;
  label: string;
  sub?: string;
  x: number;
  y: number;
  size?: "sm" | "md" | "lg";
};

type Link = { from: string; to: string };

type TreeNode = {
  id: string;
  children: TreeNode[];
};

export function MindMapTreeMobile({
  title,
  nodes,
  links,
}: {
  title: string;
  nodes: Node[];
  links: Link[];
}) {
  const byId = React.useMemo(
    () => new Map(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  const { rootId, tree } = React.useMemo(() => {
    const adj = buildAdjacency(nodes, links);
    let rootId = nodes.find((n) => n.id === "pulse")?.id;
    if (!rootId) {
      rootId =
        [...adj.entries()].sort(
          (a, b) => (b[1]?.size ?? 0) - (a[1]?.size ?? 0),
        )[0]?.[0] ??
        nodes[0]?.id ??
        "";
    }

    const tree = rootId ? buildSpanningTree(rootId, adj) : null;
    return { rootId, tree };
  }, [nodes, links]);

  const [open, setOpen] = React.useState<Set<string>>(
    () => new Set(rootId ? [rootId] : []),
  );

  React.useEffect(() => {
    setOpen(new Set(rootId ? [rootId] : []));
  }, [rootId]);

  if (!tree || !rootId) {
    return (
      <section className="min-h-svh w-full px-4 py-8 text-white">
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-white/70">No nodes to display.</p>
      </section>
    );
  }

  return (
    <section className="min-h-svh w-full">
      <div className="mx-auto max-w-xl px-4 py-8">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          {title}
        </h2>
        <p className="mt-2 text-sm text-white/70">
          Tap to expand/collapse. This is the same map, just mobile-friendly.
        </p>
        <div className="mt-4">
          <TreeItem
            node={tree}
            level={0}
            open={open}
            setOpen={setOpen}
            byId={byId}
          />
        </div>
      </div>
    </section>
  );
}

function TreeItem({
  node,
  level,
  open,
  setOpen,
  byId,
}: {
  node: TreeNode;
  level: number;
  open: Set<string>;
  setOpen: React.Dispatch<React.SetStateAction<Set<string>>>;
  byId: Map<string, Node>;
}) {
  const n = byId.get(node.id);
  const isOpen = open.has(node.id);
  const hasKids = node.children.length > 0;

  const toggle = () => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(node.id)) next.delete(node.id);
      else next.add(node.id);
      return next;
    });
  };

  return (
    <div>
      <button
        type="button"
        onClick={hasKids ? toggle : undefined}
        className={clsx(
          "w-full text-left rounded-2xl border border-white/10 bg-white/6 px-4 py-3",
          "active:scale-[0.99] transition",
          hasKids ? "cursor-pointer" : "cursor-default",
        )}
        style={{ marginLeft: Math.min(level * 12, 36) }}
      >
        <div className="flex items-start gap-3">
          <div className="mt-1 h-2.5 w-2.5 flex-none rounded-full bg-white/70 shadow-[0_0_0_6px_rgba(255,255,255,0.06)]" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-semibold text-white">
                {n?.label ?? node.id}
              </div>
              {hasKids ? (
                <span className="text-xs text-white/50">
                  {isOpen ? "Hide" : "Show"}
                </span>
              ) : null}
            </div>
            {n?.sub ? (
              <div className="mt-1 text-xs text-white/70">{n.sub}</div>
            ) : null}
          </div>
        </div>
      </button>

      {hasKids && isOpen ? (
        <div className="mt-2 space-y-2">
          {node.children.map((c) => (
            <TreeItem
              key={c.id}
              node={c}
              level={level + 1}
              open={open}
              setOpen={setOpen}
              byId={byId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
