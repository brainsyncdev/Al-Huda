import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Sprint 21 — SVG graph nodes must carry an enlarged invisible hit area so
 * touch and pointer targets reach ~44px diameter without bloating the
 * visible node. A `data-node-id` attribute is used for deterministic focus
 * targeting by the arrow-key handler.
 */

describe("Knowledge graph hit area and node addressing", () => {
  const src = readFileSync(
    resolve(process.cwd(), "src/components/graph/knowledge-graph-explorer.tsx"),
    "utf8"
  );

  it("each node <g> carries a data-node-id attribute", () => {
    expect(src).toMatch(/data-node-id=\{node\.id\}/);
  });

  it("the arrow-key handler looks up targets by data-node-id, not aria-label", () => {
    expect(src).toMatch(/g\[data-node-id=/);
    // The fragile aria-label*= substring match is gone.
    expect(src).not.toMatch(/aria-label\*=\"/);
  });

  it("an invisible r=22 hit-area circle is rendered for each node", () => {
    // 22px radius → 44px diameter touch target.
    expect(src).toMatch(/r=\{22\}[\s\S]*?fill="transparent"/);
  });

  it("arrow-key handler supports all four directions", () => {
    expect(src).toMatch(/"ArrowLeft"/);
    expect(src).toMatch(/"ArrowRight"/);
    expect(src).toMatch(/"ArrowUp"/);
    expect(src).toMatch(/"ArrowDown"/);
  });

  it("Enter and Space still activate a node", () => {
    expect(src).toMatch(/e\.key === "Enter" \|\| e\.key === " "/);
  });

  it("the non-visual <details> fallback list is preserved", () => {
    expect(src).toMatch(/<details[\s\S]*?<summary/);
    expect(src).toMatch(/List view of all nodes/);
  });
});
