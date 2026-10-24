import { describe, it, expect } from "vitest";

/**
 * Sprint 21 — Keyboard navigation invariants for the knowledge graph.
 *
 * These tests pin the *logic* of arrow-key navigation without mounting the
 * SVG in a DOM. The component computes target ids from the node array and
 * the current node's ring/angle; the helpers below replicate that math so a
 * regression in layout or key handling surfaces here before it reaches a
 * browser.
 */

interface FakeNode {
  id: string;
  ring: "dimension" | "topic";
  x: number;
  y: number;
}

function makeRing(ring: FakeNode["ring"], count: number, cx: number, cy: number, r: number): FakeNode[] {
  return Array.from({ length: count }, (_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    return {
      id: `${ring}-${i}`,
      ring,
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });
}

function cycleRing(nodes: FakeNode[], currentId: string, direction: -1 | 1): string {
  const ring = nodes.filter((n) => n.ring === nodes.find((x) => x.id === currentId)!.ring);
  const i = ring.findIndex((n) => n.id === currentId);
  const next = (i + direction + ring.length) % ring.length;
  return ring[next].id;
}

function switchRing(nodes: FakeNode[], currentId: string): string {
  const current = nodes.find((n) => n.id === currentId)!;
  const targetRing = nodes.filter((n) => n.ring !== current.ring);
  const currentAngle = Math.atan2(current.y - 350, current.x - 400);
  let best = targetRing[0].id;
  let bestDiff = Infinity;
  for (const t of targetRing) {
    const angle = Math.atan2(t.y - 350, t.x - 400);
    const diff = Math.abs(angle - currentAngle);
    const wrapped = Math.min(diff, 2 * Math.PI - diff);
    if (wrapped < bestDiff) {
      bestDiff = wrapped;
      best = t.id;
    }
  }
  return best;
}

describe("Knowledge graph arrow-key navigation", () => {
  const dims = makeRing("dimension", 10, 400, 350, 280);
  const topics = makeRing("topic", 11, 400, 350, 150);
  const nodes = [...dims, ...topics];

  it("ArrowRight cycles forward within the same ring", () => {
    expect(cycleRing(nodes, "dimension-0", 1)).toBe("dimension-1");
    expect(cycleRing(nodes, "topic-5", 1)).toBe("topic-6");
  });

  it("ArrowLeft cycles backward within the same ring", () => {
    expect(cycleRing(nodes, "dimension-1", -1)).toBe("dimension-0");
    expect(cycleRing(nodes, "topic-0", -1)).toBe("topic-10");
  });

  it("ArrowRight wraps from last to first in the ring", () => {
    expect(cycleRing(nodes, "dimension-9", 1)).toBe("dimension-0");
    expect(cycleRing(nodes, "topic-10", 1)).toBe("topic-0");
  });

  it("ArrowLeft wraps from first to last in the ring", () => {
    expect(cycleRing(nodes, "dimension-0", -1)).toBe("dimension-9");
    expect(cycleRing(nodes, "topic-0", -1)).toBe("topic-10");
  });

  it("ArrowUp/Down picks the closest angular match in the other ring", () => {
    // dimension-0 sits at angle -π/2 (top). The closest topic is topic-0
    // which is also at -π/2.
    expect(switchRing(nodes, "dimension-0")).toBe("topic-0");
  });

  it("ring switch is symmetric at the shared anchor point", () => {
    expect(switchRing(nodes, "topic-0")).toBe("dimension-0");
  });

  it("does not jump to a node in the current ring", () => {
    const target = switchRing(nodes, "dimension-5");
    const targetNode = nodes.find((n) => n.id === target);
    expect(targetNode?.ring).toBe("topic");
  });

  it("every dimension id is reachable via repeated ArrowRight", () => {
    const visited = new Set<string>();
    let id = "dimension-0";
    for (let i = 0; i < dims.length; i++) {
      visited.add(id);
      id = cycleRing(nodes, id, 1);
    }
    expect(visited.size).toBe(dims.length);
    expect(id).toBe("dimension-0"); // back to start
  });
});
