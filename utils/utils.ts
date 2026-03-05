type Link = { from: string; to: string };
type CustomNode = { id: string };

type TreeNode = { id: string; children: TreeNode[] };

export function buildAdjacency(nodes: CustomNode[], links: Link[]) {
  const adj = new Map<string, Set<string>>();
  for (const n of nodes) adj.set(n.id, new Set());

  for (const l of links) {
    if (!adj.has(l.from)) adj.set(l.from, new Set());
    if (!adj.has(l.to)) adj.set(l.to, new Set());
    adj.get(l.from)!.add(l.to);
    adj.get(l.to)!.add(l.from);
  }
  return adj;
}

// BFS spanning tree (avoids cycles)
export function buildSpanningTree(
  rootId: string,
  adj: Map<string, Set<string>>,
): TreeNode {
  const visited = new Set<string>([rootId]);
  const parent = new Map<string, string | null>();
  parent.set(rootId, null);

  const order: string[] = [rootId];
  const q: string[] = [rootId];

  while (q.length) {
    const u = q.shift()!;
    const neighbors = adj.get(u) ?? new Set();
    for (const v of neighbors) {
      if (visited.has(v)) continue;
      visited.add(v);
      parent.set(v, u);
      q.push(v);
      order.push(v);
    }
  }

  // Build children lists
  const children = new Map<string, string[]>();
  for (const id of visited) children.set(id, []);
  for (const id of order) {
    const p = parent.get(id);
    if (p) children.get(p)!.push(id);
  }

  const build = (id: string): TreeNode => ({
    id,
    children: (children.get(id) ?? []).map(build),
  });

  return build(rootId);
}
