import { describe, it, expect } from "vitest";
import { buildRootTopicIndex } from "./occurrence-index";
import { canActivateRootTopic } from "./root-allowlist";
import type { MorphologyRecord } from "./types";
import type { RootTopicEntry } from "./root-allowlist";

// ---------------------------------------------------------------------------
// Pagination tests — no silent truncation
// ---------------------------------------------------------------------------

describe("Sprint 38 — Pagination and totalMatches", () => {
  const entry: RootTopicEntry = {
    slug: "patience",
    title: "Patience",
    arabicTitle: "الصبر",
    roots: ["ص-ب-ر"],
    includedLemmas: ["صَبَرَ", "يَصْبِرُ"],
    reviewState: "approved",
    assertedBy: "test",
    assertedAt: "2026-10-26",
  };

  const makeRecords = (count: number): MorphologyRecord[] =>
    Array.from({ length: count }, (_, i) => ({
      ref: { surah: 2, ayah: i + 1 },
      wordPosition: 1,
      token: `WORD${i}`,
      canonicalArabic: `WORD${i}`,
      root: "ص-ب-ر",
      lemma: i % 2 === 0 ? "صَبَرَ" : "يَصْبِرُ",
      sourceId: "test",
    }));

  it("reports totalMatches as the true count before pagination", () => {
    const records = makeRecords(100);
    const index = buildRootTopicIndex(entry, records, {
      offset: 0,
      limit: 10,
    });
    expect(index.totalMatches).toBe(100);
    expect(index.totalOccurrences).toBe(10);
    expect(index.occurrences).toHaveLength(10);
  });

  it("pagination metadata shows hasMore when more results exist", () => {
    const records = makeRecords(100);
    const index = buildRootTopicIndex(entry, records, {
      offset: 0,
      limit: 50,
    });
    expect(index.pagination).not.toBeNull();
    expect(index.pagination!.hasMore).toBe(true);
    expect(index.pagination!.offset).toBe(0);
    expect(index.pagination!.limit).toBe(50);
  });

  it("pagination metadata shows hasMore=false on last page", () => {
    const records = makeRecords(100);
    const index = buildRootTopicIndex(entry, records, {
      offset: 90,
      limit: 10,
    });
    expect(index.pagination).not.toBeNull();
    expect(index.pagination!.hasMore).toBe(false);
    expect(index.totalOccurrences).toBe(10);
  });

  it("offset skips the first N records", () => {
    const records = makeRecords(20);
    const index = buildRootTopicIndex(entry, records, {
      offset: 10,
      limit: 5,
    });
    expect(index.totalMatches).toBe(20);
    expect(index.totalOccurrences).toBe(5);
    expect(index.occurrences[0].matchedToken).toBe("WORD10");
    expect(index.occurrences[4].matchedToken).toBe("WORD14");
  });

  it("without pagination params, returns all results", () => {
    const records = makeRecords(50);
    const index = buildRootTopicIndex(entry, records);
    expect(index.totalMatches).toBe(50);
    expect(index.totalOccurrences).toBe(50);
    expect(index.pagination).toBeNull();
  });

  it("maxResults (deprecated) still works for backward compatibility", () => {
    const entryWithMax: RootTopicEntry = { ...entry, maxResults: 10 };
    const records = makeRecords(100);
    const index = buildRootTopicIndex(entryWithMax, records);
    expect(index.totalMatches).toBe(100);
    expect(index.totalOccurrences).toBe(10);
    expect(index.pagination).not.toBeNull();
    expect(index.pagination!.hasMore).toBe(true);
  });

  it("uniqueAyahs reflects paginated results, not total", () => {
    const records = makeRecords(100);
    const index = buildRootTopicIndex(entry, records, {
      offset: 0,
      limit: 10,
    });
    expect(index.uniqueAyahs).toHaveLength(10);
    expect(index.totalMatches).toBe(100);
  });

  it("pagination with offset=0 and limit=totalMatches returns all", () => {
    const records = makeRecords(25);
    const index = buildRootTopicIndex(entry, records, {
      offset: 0,
      limit: 25,
    });
    expect(index.totalMatches).toBe(25);
    expect(index.totalOccurrences).toBe(25);
    expect(index.pagination!.hasMore).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// Activation guard tests
// ---------------------------------------------------------------------------

describe("Sprint 38 — Root topic activation guard", () => {
  const validEntry: RootTopicEntry = {
    slug: "patience",
    title: "Patience",
    arabicTitle: "الصبر",
    roots: ["ص-ب-ر"],
    includedLemmas: ["صَبَرَ"],
    reviewState: "approved",
    assertedBy: "Reviewer",
    assertedAt: "2026-10-26",
  };

  it("allows activation when all criteria are met", () => {
    const result = canActivateRootTopic(validEntry);
    expect(result.canActivate).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });

  it("rejects activation when reviewState is candidate", () => {
    const entry = { ...validEntry, reviewState: "candidate" as const };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("candidate"))).toBe(true);
  });

  it("rejects activation when reviewState is pending-review", () => {
    const entry = { ...validEntry, reviewState: "pending-review" as const };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("pending-review"))).toBe(true);
  });

  it("rejects activation when reviewState is rejected", () => {
    const entry = { ...validEntry, reviewState: "rejected" as const };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("rejected"))).toBe(true);
  });

  it("rejects activation when includedLemmas is empty", () => {
    const entry = { ...validEntry, includedLemmas: [] };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("includedLemmas"))).toBe(true);
  });

  it("rejects activation when roots array is empty", () => {
    const entry = { ...validEntry, roots: [] };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("roots"))).toBe(true);
  });

  it("rejects activation when slug is empty", () => {
    const entry = { ...validEntry, slug: "" };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("slug"))).toBe(true);
  });

  it("rejects activation when assertedBy is empty", () => {
    const entry = { ...validEntry, assertedBy: "" };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("assertedBy"))).toBe(true);
  });

  it("rejects activation when assertedAt is empty", () => {
    const entry = { ...validEntry, assertedAt: "" };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.some((r) => r.includes("assertedAt"))).toBe(true);
  });

  it("reports multiple reasons when multiple criteria fail", () => {
    const entry = {
      ...validEntry,
      reviewState: "candidate" as const,
      includedLemmas: [],
      assertedBy: "",
    };
    const result = canActivateRootTopic(entry);
    expect(result.canActivate).toBe(false);
    expect(result.reasons.length).toBeGreaterThanOrEqual(3);
  });
});
