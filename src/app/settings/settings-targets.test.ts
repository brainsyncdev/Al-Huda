import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Sprint 24 — Settings page text-size and line-spacing buttons must expose
 * at least a 44×44 CSS px interactive target. The visual label remains the
 * compact value token (sm/md/lg/xl, Compact/Normal/Loose), but each button
 * box itself carries minimum width/height constraints and an explicit
 * aria-label that names what the control adjusts.
 *
 * Source-level regression pin only; rendered dimensions are verified
 * separately in the Sprint 24 browser QA matrix.
 */

describe("Settings text-size and spacing targets", () => {
  const src = readFileSync(
    resolve(process.cwd(), "src/app/settings/page.tsx"),
    "utf8"
  );

  it("size buttons use 44px minimum height and width", () => {
    expect(src).toMatch(/Arabic text size[\s\S]{0,800}min-h-\[44px\][\s\S]{0,200}min-w-\[44px\]/);
  });

  it("spacing buttons use 44px minimum height and width", () => {
    expect(src).toMatch(/Line spacing[\s\S]{0,800}min-h-\[44px\][\s\S]{0,200}min-w-\[44px\]/);
  });

  it("every size button has a group-contextualized aria-label", () => {
    expect(src).toMatch(/aria-label=\{`Text size: \$\{s === "sm" \? "small"/);
  });

  it("every spacing button has an aria-label naming what it controls (Sprint 24 gap)", () => {
    // Sprint 20/23 gap: spacing buttons had no aria-label, only visible text.
    expect(src).toMatch(/aria-label=\{`Line spacing: \$\{lh\}`\}/);
  });

  it("size buttons preserve aria-pressed state", () => {
    expect(src).toMatch(/aria-pressed=\{arabicSize === s\}/);
  });

  it("spacing buttons preserve aria-pressed state", () => {
    expect(src).toMatch(/aria-pressed=\{lineHeight === lh\}/);
  });
});
