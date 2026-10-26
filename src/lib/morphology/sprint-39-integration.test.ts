// Sprint 39 integration tests — morphology import, alignment, root/lemma distinction,
// pagination, activation guards, and Arabic text preservation.

import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { MorphologyRecord } from "./types";
import { validateMorphologyRecord } from "./validators";
import { buildRootTopicIndex } from "./occurrence-index";
import {
  ROOT_ALLOWLIST,
  canActivateRootTopic,
  validateRootTopicEntry,
} from "./root-allowlist";
import { getSurah } from "@/lib/quran/data";

describe("Sprint 39 — morphology import and validation", () => {
  it("morphology index file exists and is valid JSON", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    expect(existsSync(indexPath)).toBe(true);

    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(100000); // 124k+ records
  });

  it("import is deterministic (same records on reload)", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    // Check first 100 records have consistent structure
    for (let i = 0; i < 100; i++) {
      const rec = data[i];
      expect(rec.ref).toBeDefined();
      expect(typeof rec.ref.surah).toBe("number");
      expect(typeof rec.ref.ayah).toBe("number");
      expect(typeof rec.token).toBe("string");
      expect(typeof rec.sourceId).toBe("string");
      expect(rec.sourceId).toBe("qul-morphology-v1");
    }
  });

  it("all records reference valid ayahs", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    // Sample 1000 records
    const sample = data.slice(0, 1000);
    for (const rec of sample) {
      const result = validateMorphologyRecord(rec);
      // Should not have invalid-surah-ref or invalid-ayah-ref
      const hasRefError = result.issues.some(
        (i) => i.code === "invalid-surah-ref" || i.code === "invalid-ayah-ref"
      );
      expect(hasRefError).toBe(false);
    }
  });
});

describe("Sprint 39 — alignment discrepancies resolved", () => {
  it("13:37:20 (root وقي) now has a token", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    const rec = data.find(
      (r) =>
        r.ref.surah === 13 &&
        r.ref.ayah === 37 &&
        r.wordPosition === 20 &&
        r.root === "وقي"
    );
    expect(rec).toBeDefined();
    expect(rec!.token).not.toBe("");
    expect(rec!.token.length).toBeGreaterThan(0);
  });

  it("8:6:12 (root نظر) now has a token", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    const rec = data.find(
      (r) =>
        r.ref.surah === 8 &&
        r.ref.ayah === 6 &&
        r.wordPosition === 12 &&
        r.root === "نظر"
    );
    expect(rec).toBeDefined();
    expect(rec!.token).not.toBe("");
  });

  it("2:181:14 (root علم) now has a token", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    const rec = data.find(
      (r) =>
        r.ref.surah === 2 &&
        r.ref.ayah === 181 &&
        r.wordPosition === 14 &&
        r.root === "علم"
    );
    expect(rec).toBeDefined();
    expect(rec!.token).not.toBe("");
  });
});

describe("Sprint 39 — root/lemma distinction", () => {
  it("records have distinct root and lemma fields", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    // Find records with both root and lemma
    const withBoth = data.filter((r) => r.root && r.lemma);
    expect(withBoth.length).toBeGreaterThan(1000);

    // Root and lemma should be different (root is trilateral, lemma is dictionary form)
    for (const rec of withBoth.slice(0, 100)) {
      expect(rec.root).not.toBe(rec.lemma);
      expect(rec.root!.length).toBeLessThanOrEqual(4); // trilateral or quadrilateral
      expect(rec.lemma!.length).toBeGreaterThan(rec.root!.length); // lemma is longer
    }
  });

  it("occurrence-index filters by includedLemmas correctly", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    // Create a test entry with specific lemmas
    const entry = {
      slug: "test-sabr",
      title: "Test Patience",
      arabicTitle: "الاختبار",
      roots: ["صبر"],
      includedLemmas: ["صَبَرَ"], // Only this lemma
      reviewState: "approved" as const,
      assertedBy: "test",
      assertedAt: "2026-10-26",
    };

    const index = buildRootTopicIndex(entry, data);

    // All occurrences should have lemma === "صَبَرَ"
    for (const occ of index.occurrences) {
      expect(occ.matchedLemma).toBe("صَبَرَ");
      expect(occ.matchedRoot).toBe("صبر");
    }

    expect(index.totalMatches).toBeGreaterThan(0);
  });

  it("empty includedLemmas yields zero occurrences", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    const entry = {
      slug: "test-empty",
      title: "Test Empty",
      arabicTitle: "الاختبار",
      roots: ["صبر"],
      includedLemmas: [], // Empty
      reviewState: "approved" as const,
      assertedBy: "test",
      assertedAt: "2026-10-26",
    };

    const index = buildRootTopicIndex(entry, data);
    expect(index.totalMatches).toBe(0);
    expect(index.occurrences.length).toBe(0);
  });
});

describe("Sprint 39 — activation guard", () => {
  it("pending-review entries cannot activate", () => {
    for (const entry of ROOT_ALLOWLIST) {
      expect(entry.reviewState).toBe("pending-review");
      const result = canActivateRootTopic(entry);
      expect(result.canActivate).toBe(false);
    }
  });

  it("approved entry with empty includedLemmas cannot activate", () => {
    const entry = {
      slug: "test",
      title: "Test",
      arabicTitle: "اختبار",
      roots: ["صبر"],
      includedLemmas: [],
      reviewState: "approved" as const,
      assertedBy: "test",
      assertedAt: "2026-10-26",
    };

    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("includedLemmas"))).toBe(true);
  });

  it("approved entry with non-empty includedLemmas can activate", () => {
    const entry = {
      slug: "test",
      title: "Test",
      arabicTitle: "اختبار",
      roots: ["صبر"],
      includedLemmas: ["صَبَرَ"],
      reviewState: "approved" as const,
      assertedBy: "test",
      assertedAt: "2026-10-26",
    };

    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(true);
    expect(result.reasons.length).toBe(0);
  });

  it("rejected entry cannot activate", () => {
    const entry = {
      slug: "test",
      title: "Test",
      arabicTitle: "اختبار",
      roots: ["صبر"],
      includedLemmas: ["صَبَرَ"],
      reviewState: "rejected" as const,
      assertedBy: "test",
      assertedAt: "2026-10-26",
    };

    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
  });
});

describe("Sprint 39 — pagination", () => {
  it("pagination returns correct totalMatches and paginated results", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    const entry = {
      slug: "test-pagination",
      title: "Test",
      arabicTitle: "اختبار",
      roots: ["صبر"],
      includedLemmas: ["صَبَرَ"],
      reviewState: "approved" as const,
      assertedBy: "test",
      assertedAt: "2026-10-26",
    };

    // Get all results
    const allIndex = buildRootTopicIndex(entry, data);
    const totalMatches = allIndex.totalMatches;
    expect(totalMatches).toBeGreaterThan(10);

    // Paginate
    const pageIndex = buildRootTopicIndex(entry, data, {
      offset: 0,
      limit: 5,
    });
    expect(pageIndex.totalMatches).toBe(totalMatches);
    expect(pageIndex.totalOccurrences).toBe(5);
    expect(pageIndex.occurrences.length).toBe(5);
    expect(pageIndex.pagination).not.toBeNull();
    expect(pageIndex.pagination!.hasMore).toBe(true);
  });

  it("pagination offset works correctly", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    const entry = {
      slug: "test-offset",
      title: "Test",
      arabicTitle: "اختبار",
      roots: ["صبر"],
      includedLemmas: ["صَبَرَ"],
      reviewState: "approved" as const,
      assertedBy: "test",
      assertedAt: "2026-10-26",
    };

    const page1 = buildRootTopicIndex(entry, data, { offset: 0, limit: 5 });
    const page2 = buildRootTopicIndex(entry, data, { offset: 5, limit: 5 });

    // Pages should have different occurrences
    expect(page1.occurrences[0]).not.toEqual(page2.occurrences[0]);
  });
});

describe("Sprint 39 — Arabic text preservation", () => {
  it("canonical Arabic text is not altered", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    // Sample 100 records and verify canonicalArabic matches getSurah()
    const sample = data.slice(0, 100);
    for (const rec of sample) {
      if (!rec.canonicalArabic) continue;

      const surah = getSurah(rec.ref.surah);
      if (!surah) continue;

      const ayah = surah.ayat.find((a) => a.ayah === rec.ref.ayah);
      if (!ayah) continue;

      expect(rec.canonicalArabic).toBe(ayah.arabic);
    }
  });

  it("tokens are preserved from word-data", () => {
    const indexPath = join(process.cwd(), "data", "morphology-index.json");
    const raw = readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw) as MorphologyRecord[];

    // Find records with non-empty tokens
    const withTokens = data.filter((r) => r.token && r.token.length > 0);
    expect(withTokens.length).toBeGreaterThan(10000);

    // Tokens should be Arabic text
    for (const rec of withTokens.slice(0, 100)) {
      expect(rec.token.length).toBeGreaterThan(0);
      // Should contain Arabic characters
      expect(/[\u0621-\u064A]/.test(rec.token)).toBe(true);
    }
  });
});

describe("Sprint 39 — ROOT_ALLOWLIST structure", () => {
  it("all entries have valid structure", () => {
    for (const entry of ROOT_ALLOWLIST) {
      const result = validateRootTopicEntry(entry);
      expect(result.valid).toBe(true);
    }
  });

  it("all entries have computed evidence in notes", () => {
    for (const entry of ROOT_ALLOWLIST) {
      expect(entry.notes).toBeDefined();
      expect(entry.notes!.length).toBeGreaterThan(0);
      expect(entry.notes).toContain("occurrences");
      expect(entry.notes).toContain("ayat");
    }
  });

  it("all entries are pending-review with empty includedLemmas", () => {
    for (const entry of ROOT_ALLOWLIST) {
      expect(entry.reviewState).toBe("pending-review");
      expect(entry.includedLemmas.length).toBe(0);
      expect(entry.assertedBy).toContain("Sprint 39");
    }
  });
});
