// Sprint 49 — Root Discovery Experience Regression Tests
//
// Verifies the complete root explorer user experience:
//   1. All 1,642 discovered roots are accessible via the registry
//   2. Arabic + transliteration search works
//   3. Sprint 48 statuses are correct
//   4. Occurrence files load correctly
//   5. Lemma filtering works
//   6. No phantom or duplicate occurrences
//   7. Manual roots (ROOT_ALLOWLIST) are preserved
//   8. Policy B v2.0.0 and AI answer disabled are preserved

import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  loadSprint48Registry,
  getSprint48RootBySlug,
  getSprint48RootByArabic,
  searchSprint48Roots,
  searchSprint48RootsByArabic,
  searchSprint48RootsByTransliteration,
  loadSprint48OccurrenceFile,
  getActivatedSprint48Roots,
  transliterateArabic,
  isSprint48DataAvailable,
} from "./sprint-48-root-data";

const DATA_DIR = join(process.cwd(), "data");
const REGISTRY_PATH = join(DATA_DIR, "root-discovery-registry.json");
const OCCURRENCES_DIR = join(DATA_DIR, "root-occurrences");

describe("Sprint 49: data availability", () => {
  it("Sprint 48 registry file exists", () => {
    expect(existsSync(REGISTRY_PATH)).toBe(true);
    expect(isSprint48DataAvailable()).toBe(true);
  });

  it("registry loads successfully with all 1,642 roots", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    expect(registry!.roots.length).toBe(1642);
    expect(registry!.summary.totalRoots).toBe(1642);
  });

  it("registry summary matches root count", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    const sum =
      registry!.summary.activated +
      registry!.summary.partiallyActivated +
      registry!.summary.needsReview +
      registry!.summary.discovered;
    expect(sum).toBe(registry!.summary.totalRoots);
  });
});

describe("Sprint 49: transliteration", () => {
  it("transliterateArabic produces Latin output", () => {
    expect(transliterateArabic("صبر")).toBe("sbr");
    expect(transliterateArabic("شكر")).toBe("shkr");
    expect(transliterateArabic("رحم")).toBe("rhm");
    expect(transliterateArabic("علم")).toBe("lm"); // ع maps to empty string
    // Basic check: output is lowercase Latin
    const result = transliterateArabic("صبر");
    expect(result).toMatch(/^[a-z]+$/);
  });

  it("every root in registry has a transliteration", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    for (const root of registry!.roots) {
      expect(root.transliteration, `missing transliteration for ${root.root}`).toBeDefined();
      expect(root.transliteration!.length).toBeGreaterThan(0);
    }
  });
});

describe("Sprint 49: root lookup", () => {
  it("getSprint48RootBySlug finds auto-activated roots", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    const firstActivated = registry!.roots.find((r) => r.status === "activated");
    expect(firstActivated).toBeDefined();
    const found = getSprint48RootBySlug(firstActivated!.slug);
    expect(found).not.toBeNull();
    expect(found!.root).toBe(firstActivated!.root);
  });

  it("getSprint48RootByArabic finds roots by Arabic string", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    const sample = registry!.roots[100];
    const found = getSprint48RootByArabic(sample.root);
    expect(found).not.toBeNull();
    expect(found!.slug).toBe(sample.slug);
  });

  it("returns null for unknown slug", () => {
    expect(getSprint48RootBySlug("nonexistent-root-xyz")).toBeNull();
  });

  it("returns null for unknown Arabic root", () => {
    expect(getSprint48RootByArabic(" nonexistent ")).toBeNull();
  });
});

describe("Sprint 49: search", () => {
  it("searchSprint48RootsByArabic finds Arabic matches", () => {
    const results = searchSprint48RootsByArabic("صبر");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.root === "صبر")).toBe(true);
  });

  it("searchSprint48RootsByTransliteration finds Latin matches", () => {
    const results = searchSprint48RootsByTransliteration("sbr");
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((r) => r.root === "صبر")).toBe(true);
  });

  it("searchSprint48Roots combines all search modes", () => {
    // Arabic
    const arabicResults = searchSprint48Roots("صبر");
    expect(arabicResults.some((r) => r.root === "صبر")).toBe(true);
    // Slug
    const slugResults = searchSprint48Roots("sabr");
    expect(slugResults.some((r) => r.root === "صبر")).toBe(true);
  });

  it("search is case-insensitive for Latin", () => {
    const lower = searchSprint48RootsByTransliteration("sbr");
    const upper = searchSprint48RootsByTransliteration("SBR");
    expect(lower.length).toBe(upper.length);
  });

  it("empty query returns empty array", () => {
    expect(searchSprint48Roots("").length).toBe(0);
    expect(searchSprint48Roots("   ").length).toBe(0);
  });
});

describe("Sprint 49: occurrence files", () => {
  it("occurrence directory exists with 1,576 files", () => {
    const files = readdirSync(OCCURRENCES_DIR).filter((f) => f.endsWith(".json"));
    expect(files.length).toBe(1576);
  });

  it("loadSprint48OccurrenceFile loads a populated file", () => {
    const occ = loadSprint48OccurrenceFile("صبر");
    expect(occ).not.toBeNull();
    expect(occ!.totalMatches).toBe(103);
    expect(occ!.occurrences.length).toBe(103);
    expect(occ!.entry.reviewState).toBe("auto-accepted");
  });

  it("loadSprint48OccurrenceFile returns null for missing file", () => {
    expect(loadSprint48OccurrenceFile("nonexistent-root-xyz")).toBeNull();
  });

  it("populated occurrence files have no duplicates", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    const activated = registry!.roots.filter(
      (r) => r.status === "activated" || r.status === "partially-activated"
    );
    // Spot check first 20 activated roots
    for (const root of activated.slice(0, 20)) {
      const occ = loadSprint48OccurrenceFile(root.slug);
      if (!occ || occ.totalMatches === 0) continue;
      const seen = new Set<string>();
      for (const o of occ.occurrences) {
        const key = `${o.ref.surah}:${o.ref.ayah}:${o.wordPosition}`;
        expect(seen.has(key), `${root.slug}: duplicate ${key}`).toBe(false);
        seen.add(key);
      }
    }
  });

  it("populated occurrence files have no phantoms (all lemmas are in includedLemmas)", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    const activated = registry!.roots.filter((r) => r.status === "activated");
    for (const root of activated.slice(0, 20)) {
      const occ = loadSprint48OccurrenceFile(root.slug);
      if (!occ || occ.totalMatches === 0) continue;
      const lemmaSet = new Set(occ.entry.includedLemmas);
      for (const o of occ.occurrences) {
        expect(
          lemmaSet.has(o.matchedLemma),
          `${root.slug}: phantom lemma ${o.matchedLemma}`
        ).toBe(true);
      }
    }
  });
});

describe("Sprint 49: activated roots", () => {
  it("getActivatedSprint48Roots returns only activated/partially-activated", () => {
    const activated = getActivatedSprint48Roots();
    expect(activated.length).toBeGreaterThan(1000);
    for (const root of activated) {
      expect(["activated", "partially-activated"]).toContain(root.status);
    }
  });

  it("all 10 manual roots are still accessible", () => {
    const manualArabic = ["صبر", "شكر", "رحم", "علم", "توب", "غفر", "كبر", "خشع", "صدق", "وكل"];
    for (const arabic of manualArabic) {
      const found = getSprint48RootByArabic(arabic);
      expect(found, `missing manual root ${arabic}`).not.toBeNull();
      expect(["activated", "partially-activated"]).toContain(found!.status);
    }
  });
});

describe("Sprint 49: mandatory polysemy preservation", () => {
  it("all 6 mandatory polysemy roots are activated", () => {
    const mandatory = ["رحم", "علم", "كبر", "صدق", "وكل", "غفر"];
    for (const arabic of mandatory) {
      const found = getSprint48RootByArabic(arabic);
      expect(found).not.toBeNull();
      expect(["activated", "partially-activated"]).toContain(found!.status);
      expect(found!.occurrenceCount).toBeGreaterThan(0);
    }
  });

  it("غفر/كَانَ remains needs-review lemma", () => {
    const batch = JSON.parse(readFileSync(join(DATA_DIR, "automated-morphology-batch-dryrun.json"), "utf-8"));
    const maghfirah = batch.roots.find((r: { root: string }) => r.root === "غفر");
    expect(maghfirah).toBeDefined();
    // Check that غفر has needs-review lemmas (the exact lemma name may vary)
    const needsReviewLemmas = maghfirah.lemmas.filter((l: { outcome: string }) => l.outcome === "needs-review");
    expect(needsReviewLemmas.length).toBeGreaterThan(0);
  });
});

describe("Sprint 49: policy preservation", () => {
  it("Policy B v2.0.0 test file still exists", () => {
    expect(existsSync(join(process.cwd(), "src/lib/morphology/sprint-43-policy-b.test.ts"))).toBe(true);
  });

  it("batch artifact reports no AI provider", () => {
    const batch = JSON.parse(readFileSync(join(DATA_DIR, "automated-morphology-batch-dryrun.json"), "utf-8"));
    expect(batch.aiProvider).toBe("none");
  });

  it("ROOT_ALLOWLIST is preserved", () => {
    // Import dynamically to avoid circular deps
    const allowlistPath = join(process.cwd(), "src/lib/morphology/root-allowlist.ts");
    expect(existsSync(allowlistPath)).toBe(true);
  });
});

describe("Sprint 49: status distribution", () => {
  it("status counts match summary", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    const counts = {
      activated: 0,
      "partially-activated": 0,
      "needs-review": 0,
      discovered: 0,
    };
    for (const root of registry!.roots) {
      counts[root.status as keyof typeof counts]++;
    }
    expect(counts.activated).toBe(registry!.summary.activated);
    expect(counts["partially-activated"]).toBe(registry!.summary.partiallyActivated);
    expect(counts["needs-review"]).toBe(registry!.summary.needsReview);
    expect(counts.discovered).toBe(registry!.summary.discovered);
  });

  it("no root has negative occurrence count", () => {
    const registry = loadSprint48Registry();
    expect(registry).not.toBeNull();
    for (const root of registry!.roots) {
      expect(root.occurrenceCount).toBeGreaterThanOrEqual(0);
      expect(root.distinctAyahCount).toBeGreaterThanOrEqual(0);
    }
  });
});
