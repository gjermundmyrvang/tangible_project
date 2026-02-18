"use client";

import clsx from "clsx";
import * as React from "react";

type Node = {
  id: string;
  label: string;
  sub?: string;
  x: number; // 0..100 (percent)
  y: number; // 0..100 (percent)
  size?: "sm" | "md" | "lg";
};

type Link = { from: string; to: string };

const SIZE = {
  sm: "w-[180px] md:w-[220px]",
  md: "w-[220px] md:w-[260px]",
  lg: "w-[260px] md:w-[340px]",
};

export function MindMapSection({
  title = "Pulse",
  nodes,
  links,
}: {
  title?: string;
  nodes: Node[];
  links: Link[];
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [active, setActive] = React.useState<string | null>(null);

  // map node id -> pixel position for line drawing
  const [rect, setRect] = React.useState({ w: 0, h: 0 });

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setRect({ w: r.width, h: r.height });
    });
    ro.observe(el);
    const r = el.getBoundingClientRect();
    setRect({ w: r.width, h: r.height });

    return () => ro.disconnect();
  }, []);

  const pos = React.useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    for (const n of nodes) {
      m.set(n.id, { x: (n.x / 100) * rect.w, y: (n.y / 100) * rect.h });
    }
    return m;
  }, [nodes, rect.w, rect.h]);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Ambient pulsing background */}
      <div className="absolute inset-0 bg-linear-to-b from-black  to-purple-900">
        {/* pulsing blobs (purple palette instead of white) */}
        <div className="absolute inset-0">
          {/* central “pulse” */}
          <div
            className="absolute left-1/2 top-1/2 h-[75vmax] w-[75vmax] -translate-x-1/2 -translate-y-1/2 rounded-full
      bg-[radial-gradient(circle,rgba(168,85,247,0.22),rgba(236,72,153,0.10),transparent_60%)]
      blur-3xl animate-pulse"
          />
        </div>
      </div>

      {/* Foreground content */}
      <div className="relative h-full w-full">
        {/* Header */}
        <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 mx-auto max-w-6xl px-6 pt-10">
          <h2 className="mt-4 text-4xl sm:text-6xl font-semibold tracking-tight text-white md:text-6xl">
            {title}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            A snapshot of our associations and directions while exploring the
            theme.
          </p>
          {/* tiny hint */}
          <div className="mt-2 text-xs text-white/50">
            Hover to trace connections
          </div>
        </div>

        {/* Mindmap canvas */}
        <div
          ref={containerRef}
          className="absolute inset-0"
          onMouseLeave={() => setActive(null)}
        >
          {/* Lines */}
          <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.18)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.06)" />
              </linearGradient>
            </defs>

            {links.map((l, i) => {
              const a = pos.get(l.from);
              const b = pos.get(l.to);
              if (!a || !b) return null;

              const isHot = active === l.from || active === l.to;
              const opacity = isHot ? 0.55 : 0.18;
              const strokeWidth = isHot ? 2.2 : 1.3;

              // simple curved path
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              const cx = mx + (a.y - b.y) * 0.08;
              const cy = my + (b.x - a.x) * 0.08;

              const d = `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
              return (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeOpacity={opacity}
                  strokeWidth={strokeWidth}
                />
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((n) => {
            const size = SIZE[n.size ?? "md"];
            const isActive = active === n.id;

            return (
              <button
                key={n.id}
                className={clsx(
                  "group absolute -translate-x-1/2 -translate-y-1/2 text-left",
                  size,
                )}
                style={{ left: `${n.x}%`, top: `${n.y}%` }}
                onMouseEnter={() => setActive(n.id)}
                onFocus={() => setActive(n.id)}
              >
                <div
                  className={clsx(
                    "relative overflow-hidden rounded-3xl border p-5 backdrop-blur",
                    "bg-white/6 border-white/10",
                    "transition will-change-transform",
                    "hover:bg-white/8 hover:border-white/20 hover:-translate-y-1",
                    isActive && "bg-white/9 border-white/25",
                  )}
                >
                  {/* pulse ring */}
                  <div className="pointer-events-none absolute -inset-8 opacity-0 transition group-hover:opacity-100">
                    <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.18),transparent_55%)] blur-xl animate-pulse" />
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="mt-1 h-3 w-3 flex-none rounded-full bg-white/70 shadow-[0_0_0_6px_rgba(255,255,255,0.06)] group-hover:shadow-[0_0_0_10px_rgba(255,255,255,0.08)]" />
                    <div>
                      <div className="text-base font-semibold tracking-tight text-white md:text-lg">
                        {n.label}
                      </div>
                      {n.sub ? (
                        <div className="mt-1 text-sm text-white/70">
                          {n.sub}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
