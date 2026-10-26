import { describe, it, expect } from "vitest";
import { validateMorphologyRecord, validateMorphologyBatch } from "./validators";
import type { MorphologyRecord } from "./types";
import {
  validateRootTopicEntry,
  validateRootAllowlist,
  getEnabledRootTopics,
  CANDIDATE_ROOTS,
  ROOT_ALLOWLIST,
} from "./root-allowlist";
import type { RootTopicEntry } from "./root-allowlist";
import { buildRootTopicIndex } from "./occurrence-index";

// ---------------------------------------------------------------------------
// Morphology record validators
// ---------------------------------------------------------------------------

describe("Sprint 37 — Morphology record validators", () => {
  const validRecord: MorphologyRecord = {
    ref: { surah: 1, ayah: 1 },
    wordPosition: 1,
    token: "بِسْمِ",
    canonicalArabic: "بِسْمِ",
    root: "س-م-و",
    lemma: "اسْم",
    partOfSpeech: "noun",
    sourceId: "test-source-v1",
  };

  it("accepts a valid record with all fields", () => {
    const result = validateMorphologyRecord(validRecord);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("rejects a record with an invalid surah reference", () => {
    const record: MorphologyRecord = {
      ...validRecord,
      ref: { surah: 999, ayah: 1 },
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "invalid-surah-ref")).toBe(
      true
    );
  });

  it("rejects a record with an invalid ayah reference", () => {
    const record: MorphologyRecord = {
      ...validRecord,
      ref: { surah: 1, ayah: 999 },
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "invalid-ayah-ref")).toBe(
      true
    );
  });

  it("rejects a record with an empty token", () => {
    const record: MorphologyRecord = {
      ...validRecord,
      token: "",
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "empty-token")).toBe(true);
  });

  it("rejects a record with an empty canonicalArabic", () => {
    const record: MorphologyRecord = {
      ...validRecord,
      canonicalArabic: "",
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.code === "empty-canonical-arabic")).toBe(
      true
    );
  });

  it("warns on empty root field (present but empty)", () => {
    const record: MorphologyRecord = {
      ...validRecord,
      root: "",
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(true); // warnings don't invalidate
    expect(result.issues.some((i) => i.code === "empty-root")).toBe(true);
    expect(
      result.issues.find((i) => i.code === "empty-root")?.severity
    ).toBe("warning");
  });

  it("warns on empty lemma field (present but empty)", () => {
    const record: MorphologyRecord = {
      ...validRecord,
      lemma: "",
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(true);
    expect(result.issues.some((i) => i.code === "empty-lemma")).toBe(true);
  });

  it("accepts a record with no root or lemma (both optional)", () => {
    const record: MorphologyRecord = {
      ref: { surah: 1, ayah: 1 },
      token: "بِسْمِ",
      canonicalArabic: "بِسْمِ",
      sourceId: "test-source-v1",
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(true);
  });

  it("rejects a record with non-positive wordPosition", () => {
    const record: MorphologyRecord = {
      ...validRecord,
      wordPosition: 0,
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(false);
    expect(
      result.issues.some((i) => i.code === "invalid-word-position")
    ).toBe(true);
  });

  it("validates surah 114 ayah 6 (last ayah) as valid", () => {
    const record: MorphologyRecord = {
      ...validRecord,
      ref: { surah: 114, ayah: 6 },
    };
    const result = validateMorphologyRecord(record);
    expect(result.valid).toBe(true);
  });
});

describe("Sprint 37 — Batch validation and discrepancy report", () => {
  const makeRecord = (surah: number, ayah: number, token: string): MorphologyRecord => ({
    ref: { surah, ayah },
    token,
    canonicalArabic: token,
    sourceId: "test-source-v1",
  });

  it("reports correct counts for a mixed batch", () => {
    const records: MorphologyRecord[] = [
      makeRecord(1, 1, "بِسْمِ"),
      makeRecord(1, 2, "ٱلۡحَمۡدُ"),
      makeRecord(999, 1, "bad-ref"), // invalid surah
      makeRecord(1, 1, "بِسْمِ"), // duplicate of first
    ];
    const report = validateMorphologyBatch(records);
    expect(report.totalRecords).toBe(4);
    expect(report.invalidRecords).toBe(1); // the bad ref
    expect(report.duplicates).toBe(1);
    expect(report.missingAyahRefs).toBe(1);
  });

  it("counts missing root and lemma", () => {
    const records: MorphologyRecord[] = [
      { ref: { surah: 1, ayah: 1 }, token: "x", canonicalArabic: "x", sourceId: "t" },
      { ref: { surah: 1, ayah: 2 }, token: "y", canonicalArabic: "y", root: "", sourceId: "t" },
    ];
    const report = validateMorphologyBatch(records);
    expect(report.noRoot).toBe(2); // both have no root (first undefined, second empty)
    expect(report.noLemma).toBe(2);
  });

  it("collects sample issues up to 50", () => {
    const records: MorphologyRecord[] = Array.from({ length: 60 }, (_, i) => ({
      ref: { surah: 999, ayah: i + 1 },
      token: "x",
      canonicalArabic: "x",
      sourceId: "t",
    }));
    const report = validateMorphologyBatch(records);
    expect(report.sampleIssues.length).toBeLessThanOrEqual(50);
  });

  it("returns a clean report for an empty batch", () => {
    const report = validateMorphologyBatch([]);
    expect(report.totalRecords).toBe(0);
    expect(report.validRecords).toBe(0);
    expect(report.invalidRecords).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// Root allowlist config
// ---------------------------------------------------------------------------

describe("Sprint 37 — Root allowlist validators", () => {
  const validEntry: RootTopicEntry = {
    slug: "patience",
    title: "Patience",
    arabicTitle: "الصبر",
    roots: ["ص-ب-ر"],
    includedLemmas: ["صَبَرَ", "يَصْبِرُ", "صَبْر"],
    reviewState: "approved",
    assertedBy: "Al-Huda editorial team",
    assertedAt: "2026-10-26",
  };

  it("accepts a valid entry", () => {
    const result = validateRootTopicEntry(validEntry);
    expect(result.valid).toBe(true);
    expect(result.issues).toHaveLength(0);
  });

  it("rejects an entry with an invalid slug", () => {
    const entry: RootTopicEntry = { ...validEntry, slug: "Invalid Slug!" };
    const result = validateRootTopicEntry(entry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("kebab-case"))).toBe(true);
  });

  it("rejects an entry with empty roots array", () => {
    const entry: RootTopicEntry = { ...validEntry, roots: [] };
    const result = validateRootTopicEntry(entry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("roots array is empty"))).toBe(
      true
    );
  });

  it("rejects an entry with invalid maxResults", () => {
    const entry: RootTopicEntry = { ...validEntry, maxResults: 0 };
    const result = validateRootTopicEntry(entry);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("maxResults"))).toBe(true);
  });

  it("rejects an entry with invalid reviewState", () => {
    const entry = {
      ...validEntry,
      reviewState: "invalid" as unknown as RootTopicEntry["reviewState"],
    };
    const result = validateRootTopicEntry(entry);
    expect(result.valid).toBe(false);
  });

  it("validates the entire allowlist for duplicate slugs and roots", () => {
    const entries: RootTopicEntry[] = [
      validEntry,
      { ...validEntry, slug: "patience-2" }, // duplicate root ص-ب-ر
    ];
    const result = validateRootAllowlist(entries);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("one root = one topic"))).toBe(
      true
    );
  });

  it("detects duplicate slugs", () => {
    const entries: RootTopicEntry[] = [
      validEntry,
      { ...validEntry, roots: ["ش-ك-ر"] }, // duplicate slug "patience"
    ];
    const result = validateRootAllowlist(entries);
    expect(result.valid).toBe(false);
    expect(result.issues.some((i) => i.includes("duplicate slug"))).toBe(true);
  });

  it("the current ROOT_ALLOWLIST is empty (no roots enabled yet)", () => {
    expect(ROOT_ALLOWLIST).toHaveLength(0);
    const result = validateRootAllowlist(ROOT_ALLOWLIST);
    expect(result.valid).toBe(true);
  });

  it("CANDIDATE_ROOTS has the expected starter roots", () => {
    expect(CANDIDATE_ROOTS.length).toBeGreaterThanOrEqual(10);
    const roots = CANDIDATE_ROOTS.map((c) => c.root);
    expect(roots).toContain("ص-ب-ر");
    expect(roots).toContain("ش-ك-ر");
    expect(roots).toContain("ر-ح-م");
    expect(roots).toContain("ع-ل-م");
    expect(roots).toContain("ت-و-ب");
    expect(roots).toContain("غ-ف-ر");
    expect(roots).toContain("ك-ب-ر");
    expect(roots).toContain("خ-ش-ع");
    expect(roots).toContain("ص-د-ق");
    expect(roots).toContain("و-ك-ل");
  });

  it("every candidate root has polysemy concerns documented", () => {
    for (const candidate of CANDIDATE_ROOTS) {
      expect(candidate.polysemyConcerns.length).toBeGreaterThan(0);
    }
  });

  it("getEnabledRootTopics returns empty for the current allowlist", () => {
    expect(getEnabledRootTopics(ROOT_ALLOWLIST)).toHaveLength(0);
  });

  it("getEnabledRootTopics filters out candidates and rejected entries", () => {
    const entries: RootTopicEntry[] = [
      { ...validEntry, reviewState: "candidate", includedLemmas: ["x"] },
      { ...validEntry, slug: "x", reviewState: "rejected", includedLemmas: ["x"], roots: ["x"] },
      { ...validEntry, slug: "y", reviewState: "approved", includedLemmas: [], roots: ["y"] },
      { ...validEntry, slug: "z", reviewState: "approved", includedLemmas: ["z"], roots: ["z-"] },
    ];
    const enabled = getEnabledRootTopics(entries);
    expect(enabled).toHaveLength(1);
    expect(enabled[0].slug).toBe("z");
  });
});

// ---------------------------------------------------------------------------
// Occurrence index
// ---------------------------------------------------------------------------

describe("Sprint 37 — Occurrence index builder", () => {
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

  const records: MorphologyRecord[] = [
    {
      ref: { surah: 2, ayah: 153 },
      wordPosition: 5,
      token: "يَصْبِرُونَ",
      canonicalArabic: "يَصْبِرُونَ",
      root: "ص-ب-ر",
      lemma: "يَصْبِرُ",
      sourceId: "test",
    },
    {
      ref: { surah: 2, ayah: 155 },
      wordPosition: 8,
      token: "الصَّابِرِينَ",
      canonicalArabic: "الصَّابِرِينَ",
      root: "ص-ب-ر",
      lemma: "صَبَرَ",
      sourceId: "test",
    },
    {
      ref: { surah: 3, ayah: 10 },
      wordPosition: 2,
      token: "يَكْفِرُونَ",
      canonicalArabic: "يَكْفِرُونَ",
      root: "ك-ف-ر",
      lemma: "كَفَرَ",
      sourceId: "test",
    },
    {
      ref: { surah: 1, ayah: 1 },
      wordPosition: 1,
      token: "بِسْمِ",
      canonicalArabic: "بِسْمِ",
      root: "س-م-و",
      lemma: "اسْم",
      sourceId: "test",
    },
  ];

  it("builds an index with only matching occurrences", () => {
    const index = buildRootTopicIndex(entry, records);
    expect(index.occurrences).toHaveLength(2);
    expect(index.uniqueAyahs).toHaveLength(2);
    expect(index.totalOccurrences).toBe(2);
  });

  it("filters by root — excludes non-matching roots", () => {
    const index = buildRootTopicIndex(entry, records);
    const roots = index.occurrences.map((o) => o.matchedRoot);
    expect(roots.every((r) => r === "ص-ب-ر")).toBe(true);
  });

  it("filters by includedLemmas — excludes non-matching lemmas", () => {
    const entryWithOneLemma: RootTopicEntry = {
      ...entry,
      includedLemmas: ["صَبَرَ"],
    };
    const index = buildRootTopicIndex(entryWithOneLemma, records);
    expect(index.occurrences).toHaveLength(1);
    expect(index.occurrences[0].matchedLemma).toBe("صَبَرَ");
  });

  it("returns empty index when includedLemmas is empty", () => {
    const entryNoLemmas: RootTopicEntry = {
      ...entry,
      includedLemmas: [],
    };
    const index = buildRootTopicIndex(entryNoLemmas, records);
    expect(index.occurrences).toHaveLength(0);
    expect(index.uniqueAyahs).toHaveLength(0);
  });

  it("deduplicates ayahs in uniqueAyahs", () => {
    const duplicateRecords: MorphologyRecord[] = [
      ...records,
      {
        ref: { surah: 2, ayah: 153 }, // same ayah as first record
        wordPosition: 10,
        token: "صَبْرٌ",
        canonicalArabic: "صَبْرٌ",
        root: "ص-ب-ر",
        lemma: "صَبَرَ",
        sourceId: "test",
      },
    ];
    const index = buildRootTopicIndex(entry, duplicateRecords);
    expect(index.occurrences).toHaveLength(3);
    expect(index.uniqueAyahs).toHaveLength(2); // 2:153 and 2:155
  });

  it("applies maxResults cap", () => {
    const entryWithCap: RootTopicEntry = {
      ...entry,
      maxResults: 1,
    };
    const index = buildRootTopicIndex(entryWithCap, records);
    expect(index.occurrences).toHaveLength(1);
  });

  it("preserves matched token and lemma on each occurrence", () => {
    const index = buildRootTopicIndex(entry, records);
    expect(index.occurrences[0].matchedToken).toBe("يَصْبِرُونَ");
    expect(index.occurrences[0].matchedLemma).toBe("يَصْبِرُ");
    expect(index.occurrences[0].matchedRoot).toBe("ص-ب-ر");
  });

  it("supports root-set topics (multiple roots)", () => {
    const multiRootEntry: RootTopicEntry = {
      ...entry,
      slug: "commerce",
      roots: ["ب-ي-ع", "ت-ج-ر"],
      includedLemmas: ["بَاعَ", "تَاجِر"],
    };
    const multiRecords: MorphologyRecord[] = [
      {
        ref: { surah: 2, ayah: 275 },
        token: "بَيْعٌ",
        canonicalArabic: "بَيْعٌ",
        root: "ب-ي-ع",
        lemma: "بَاعَ",
        sourceId: "test",
      },
      {
        ref: { surah: 2, ayah: 282 },
        token: "تِجَارَةٌ",
        canonicalArabic: "تِجَارَةٌ",
        root: "ت-ج-ر",
        lemma: "تَاجِر",
        sourceId: "test",
      },
    ];
    const index = buildRootTopicIndex(multiRootEntry, multiRecords);
    expect(index.occurrences).toHaveLength(2);
    expect(index.occurrences[0].matchedRoot).toBe("ب-ي-ع");
    expect(index.occurrences[1].matchedRoot).toBe("ت-ج-ر");
  });
});

// ---------------------------------------------------------------------------
// Schema invariants
// ---------------------------------------------------------------------------

describe("Sprint 37 — Morphology types schema", () => {
  it("MorphologyRecord requires ref, token, canonicalArabic, sourceId", () => {
    // TypeScript compile-time check — if this compiles, the types are correct.
    const record: MorphologyRecord = {
      ref: { surah: 1, ayah: 1 },
      token: "بِسْمِ",
      canonicalArabic: "بِسْمِ",
      sourceId: "test",
    };
    expect(record.ref.surah).toBe(1);
    expect(record.token).toBe("بِسْمِ");
  });

  it("root and lemma are optional on MorphologyRecord", () => {
    const record: MorphologyRecord = {
      ref: { surah: 1, ayah: 1 },
      token: "x",
      canonicalArabic: "x",
      sourceId: "test",
    };
    expect(record.root).toBeUndefined();
    expect(record.lemma).toBeUndefined();
  });

  it("RootTopicEntry requires roots array and includedLemmas array", () => {
    const entry: RootTopicEntry = {
      slug: "test",
      title: "Test",
      arabicTitle: "اختبار",
      roots: ["ت-س-ت"],
      includedLemmas: [],
      reviewState: "candidate",
      assertedBy: "test",
      assertedAt: "2026-10-26",
    };
    expect(entry.roots).toHaveLength(1);
    expect(entry.includedLemmas).toHaveLength(0);
  });
});
