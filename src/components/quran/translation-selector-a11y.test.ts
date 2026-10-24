import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Sprint 21 — The translation selector must trap focus while open and
 * return it to the trigger on close. These invariants pin the source-level
 * contract; the project's node-only test environment cannot mount React
 * components, so the assertions read the file as text.
 */

describe("Translation selector focus management", () => {
  const src = readFileSync(
    resolve(process.cwd(), "src/components/quran/translation-selector.tsx"),
    "utf8"
  );

  it("declares the dropdown as an aria-modal dialog", () => {
    expect(src).toMatch(/role="dialog"/);
    expect(src).toMatch(/aria-modal="true"/);
    expect(src).toMatch(/aria-label="Translation selector"/);
  });

  it("auto-focuses the search input on open", () => {
    expect(src).toMatch(/searchInputRef\.current\?\.focus\(\)/);
  });

  it("returns focus to the trigger on close", () => {
    expect(src).toMatch(/triggerRef\.current\?\.focus\(\)/);
  });

  it("handles Escape to close the dialog", () => {
    expect(src).toMatch(/e\.key === "Escape"/);
  });

  it("implements a Tab/Shift+Tab focus trap within the dialog", () => {
    expect(src).toMatch(/e\.key !== "Tab"/);
    expect(src).toMatch(/e\.shiftKey/);
    // Both wrap directions are handled.
    expect(src).toMatch(/first\.focus\(\)/);
    expect(src).toMatch(/last\.focus\(\)/);
  });

  it("the backdrop is aria-hidden so it does not appear in the a11y tree", () => {
    expect(src).toMatch(/aria-hidden="true"/);
  });

  it("the search input has an explicit aria-label", () => {
    expect(src).toMatch(/aria-label="Search translations"/);
  });

  it("the listbox has an explicit aria-label", () => {
    expect(src).toMatch(/aria-label="Available translations"/);
  });

  it("preserves the trigger's aria-haspopup=\"listbox\" binding", () => {
    expect(src).toMatch(/aria-haspopup="listbox"/);
    expect(src).toMatch(/aria-expanded=\{isOpen\}/);
  });
});
