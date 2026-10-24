import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Sprint 21 — The word-by-word grid must render with `dir="rtl"` so CSS grid
 * fills columns right-to-left, matching Arabic reading order. The DOM order
 * stays source-order (correct for screen readers); only the visual flow
 * changes.
 *
 * This test reads the component source as text rather than mounting it —
 * the project's test environment is node-only (no jsdom) and a string
 * assertion is sufficient to pin the attribute against accidental removal.
 */

describe("Word-by-word RTL reading order", () => {
  const src = readFileSync(
    resolve(process.cwd(), "src/components/quran/word-by-word.tsx"),
    "utf8"
  );

  it("the <ol> grid carries dir=\"rtl\"", () => {
    // Match the grid container opening tag, tolerant of attribute order.
    expect(src).toMatch(/<ol\s[^>]*dir="rtl"/);
  });

  it("the grid container is still a CSS grid with responsive columns", () => {
    expect(src).toMatch(/<ol\s[^>]*className="grid[^"]*sm:grid-cols-2[^"]*lg:grid-cols-3/);
  });

  it("each word cell still declares lang=\"ar\" and dir=\"rtl\" on the Arabic line", () => {
    expect(src).toMatch(/lang="ar"[\s\S]*?dir="rtl"/);
  });

  it("transliteration cells carry lang=\"ar-Latn\"", () => {
    expect(src).toMatch(/lang="ar-Latn"/);
  });

  it("gloss cells carry lang=\"en\"", () => {
    expect(src).toMatch(/lang="en"/);
  });
});
