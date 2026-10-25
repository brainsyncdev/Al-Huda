import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, join } from "node:path";

/**
 * Sprint 25 — The Calendar component (ui/calendar.tsx) wraps react-day-picker
 * but is confirmed dead code: no page or component imports it. This test pins
 * that fact so a future import is flagged for review.
 *
 * The 28px day buttons documented in Sprint 20/24 are unreachable by users
 * because the component is never rendered. If it is ever imported, the
 * touch-target concern must be re-evaluated at that time.
 */
describe("Calendar component usage audit", () => {
  function collectTsxFiles(dir: string): string[] {
    const results: string[] = [];
    try {
      const entries = readdirSync(dir);
      for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        if (stat.isDirectory() && entry !== "node_modules" && entry !== ".next") {
          results.push(...collectTsxFiles(fullPath));
        } else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) {
          results.push(fullPath);
        }
      }
    } catch {
      // directory may not exist in all environments
    }
    return results;
  }

  it("ui/calendar.tsx exists as a component file", () => {
    const calendarPath = resolve(process.cwd(), "src/components/ui/calendar.tsx");
    const src = readFileSync(calendarPath, "utf8");
    expect(src).toContain("react-day-picker");
    expect(src).toContain("DayPicker");
  });

  it("no other source file imports the Calendar component", () => {
    const srcDir = resolve(process.cwd(), "src");
    const files = collectTsxFiles(srcDir);
    const importers = files.filter((f) => {
      if (f.endsWith("calendar.tsx")) return false; // skip itself
      if (f.endsWith(".test.ts") || f.endsWith(".test.tsx")) return false; // skip tests
      const content = readFileSync(f, "utf8");
      return (
        content.includes('from "@/components/ui/calendar"') ||
        content.includes("from '../ui/calendar'") ||
        content.includes('from "./calendar"')
      );
    });
    expect(importers).toEqual([]);
  });
});