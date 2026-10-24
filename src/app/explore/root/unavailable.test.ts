// Unit tests for the /explore/root/[root] route's data-integrity stance.
//
// The root route is a truthful unavailable state — its correctness claim
// is that it NEVER fabricates a root index. These tests pin that
// invariant down by asserting the underlying data the route WOULD need
// does not exist, so a future developer adding root support sees a
// failing test and knows the placeholder body must be replaced.

import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { join } from "node:path";

describe("/explore/root/[root] — data availability invariant", () => {
  it("no morphology module exists (the unavailable page is honest)", () => {
    const libDir = join(process.cwd(), "src", "lib");
    expect(existsSync(join(libDir, "morphology.ts"))).toBe(false);
    expect(existsSync(join(libDir, "roots.ts"))).toBe(false);
    expect(existsSync(join(libDir, "root-data.ts"))).toBe(false);
    expect(existsSync(join(libDir, "morphology"))).toBe(false);
    expect(existsSync(join(libDir, "roots"))).toBe(false);
  });

  it("quran-json vendor has no root or morphology dataset", () => {
    const vendor = join(process.cwd(), "node_modules", "quran-json", "dist");
    expect(existsSync(join(vendor, "roots"))).toBe(false);
    expect(existsSync(join(vendor, "morphology"))).toBe(false);
    expect(existsSync(join(vendor, "roots.json"))).toBe(false);
  });

  it("word-by-word data files do not carry a root field (sample check)", async () => {
    // If a root field is added to the word data in a future integration,
    // this test will fail and signal the unavailable page is obsolete.
    const wordFile = join(
      process.cwd(),
      "public",
      "word-data",
      "1.json"
    );
    if (!existsSync(wordFile)) {
      // Word data missing entirely — unavailable state still correct.
      return;
    }
    const raw = await import(/* @vite-ignore */ wordFile, {
      with: { type: "json" },
    }).catch(() => null);
    if (!raw) return;
    const verses = (raw as { default?: unknown }).default ?? raw;
    const firstAyah = Array.isArray(verses) ? verses[0] : null;
    const words = firstAyah?.words ?? [];
    if (words.length === 0) return;
    for (const word of words) {
      expect(word).not.toHaveProperty("root");
      expect(word).not.toHaveProperty("lemma");
      expect(word).not.toHaveProperty("partOfSpeech");
    }
  });
});
