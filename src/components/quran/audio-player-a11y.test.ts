import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Sprint 21 — The audio play/pause button must meet the 44px minimum touch
 * target. The component uses `min-h-[44px]` plus enlarged padding so the
 * hit area reaches the WCAG target without distorting the visual glyph.
 */

describe("Audio player touch target", () => {
  const src = readFileSync(
    resolve(process.cwd(), "src/components/quran/audio-player.tsx"),
    "utf8"
  );

  it("the play/pause button has a 44px minimum height", () => {
    expect(src).toMatch(/min-h-\[44px\]/);
  });

  it("the button exposes aria-pressed (never colour alone)", () => {
    expect(src).toMatch(/aria-pressed=\{playing\}/);
  });

  it("the button has a descriptive aria-label including the reciter", () => {
    expect(src).toMatch(/aria-label=\{`\$\{label\} — \$\{reciter/);
  });

  it("failure state is announced via role=\"status\"", () => {
    expect(src).toMatch(/role="status"/);
  });
});
