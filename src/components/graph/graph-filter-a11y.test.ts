import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Sprint 25 — Graph filter pills must be native <button> elements with
 * aria-pressed state, ensuring full keyboard operability without custom
 * key handlers. Verified in browser: 11 pills, all tabIndex 0, focus
 * preserved after activation, filtering dims non-connected nodes.
 *
 * Source-level regression pin; runtime behavior verified via IAB browser QA.
 */
describe("Graph filter pill keyboard accessibility", () => {
  const src = readFileSync(
    resolve(process.cwd(), "src/components/graph/knowledge-graph-explorer.tsx"),
    "utf8"
  );

  it("filter pills are native button elements", () => {
    // The "All" pill and dimension pills use <button type="button">
    expect(src).toMatch(/<button\s[^>]*type="button"[^>]*aria-pressed=\{filter === "all"\}/);
    expect(src).toMatch(/<button\s[^>]*type="button"[^>]*aria-pressed=\{isActive\}/);
  });

  it("All pill has aria-pressed bound to filter state", () => {
    expect(src).toMatch(/aria-pressed=\{filter === "all"\}/);
  });

  it("dimension pills have aria-pressed bound to isActive", () => {
    expect(src).toMatch(/aria-pressed=\{isActive\}/);
  });

  it("filter pills use onClick for activation (native button keyboard support)", () => {
    expect(src).toMatch(/onClick=\{\(\) => setFilter\("all"\)\}/);
    expect(src).toMatch(/onClick=\{\(\) => setFilter\(dimFilterId\)\}/);
  });
});