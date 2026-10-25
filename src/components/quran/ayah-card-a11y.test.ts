import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Sprint 25 — Ayah article elements must carry an accessible name so screen
 * readers can identify individual verses without adding per-ayah headings
 * (286 headings on al-Baqarah would degrade the heading outline).
 *
 * The `aria-label` on each `<article>` provides the accessible name while
 * preserving the existing heading hierarchy (1 h1 + 4 h2/h3 on a surah page).
 *
 * Source-level regression pin; rendered accessible names verified separately
 * via browser `getAttribute("aria-label")` evidence.
 */
describe("Ayah article accessible names", () => {
  const src = readFileSync(
    resolve(process.cwd(), "src/components/quran/ayah-card.tsx"),
    "utf8"
  );

  it("each article carries an aria-label with the surah:ayah reference", () => {
    expect(src).toMatch(/aria-label=\{`Ayah \$\{ayah\.surah\}:\$\{ayah\.ayah\}`\}/);
  });

  it("article id anchor is preserved for direct linking", () => {
    expect(src).toMatch(/id=\{`ayah-\$\{ayah\.surah\}-\$\{ayah\.ayah\}`\}/);
  });

  it("no per-ayah heading elements are introduced", () => {
    // The article body must not contain h2/h3 for the ayah reference itself.
    // (The h3 for "Context" in the comprehension panel is fine.)
    const articleBody = src.slice(
      src.indexOf("<article"),
      src.indexOf("</article>")
    );
    const headingMatches = articleBody.match(/<h[23][^>]*>/g) || [];
    // Only the comprehension "Context" h3 is allowed inside the article
    expect(headingMatches.length).toBeLessThanOrEqual(1);
  });

  it("ayah-number span retains its aria-label", () => {
    expect(src).toMatch(/aria-label=\{`Ayah \$\{ayah\.ayah\}`\}/);
  });
});