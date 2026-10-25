import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Sprint 23 — Reader text-size buttons must expose at least a 44x44 CSS px
 * interactive target. The visual label remains compact (S/M/L/XL), but the
 * button box itself carries minimum width/height constraints.
 *
 * This is a source-level regression pin only; rendered dimensions are
 * verified separately with browser `getBoundingClientRect()` evidence.
 */
describe("Reader text-size targets", () => {
  const src = readFileSync(
    resolve(process.cwd(), "src/components/quran/reader-controls.tsx"),
    "utf8"
  );

  it("uses 44px minimum height and width on size buttons", () => {
    expect(src).toMatch(/min-h-\[44px\]/);
    expect(src).toMatch(/min-w-\[44px\]/);
  });

  it("keeps accessible names for each size button", () => {
    expect(src).toMatch(/accessibleLabel: "Small text size"/);
    expect(src).toMatch(/accessibleLabel: "Medium text size"/);
    expect(src).toMatch(/accessibleLabel: "Large text size"/);
    expect(src).toMatch(/accessibleLabel: "Extra large text size"/);
    expect(src).toMatch(/aria-label=\{accessibleLabel\}/);
  });

  it("preserves aria-pressed state on size buttons", () => {
    expect(src).toMatch(/aria-pressed=\{arabicSize === value\}/);
  });

  it("does not rely on larger icons as the target substitute", () => {
    // The size buttons remain text buttons; no icon size increase was introduced.
    expect(src).not.toMatch(/SIZES\.map\(\(\{ value, label, accessibleLabel \}\) => \(\s*<button[^>]*>\s*<CaseSensitive/);
  });
});
