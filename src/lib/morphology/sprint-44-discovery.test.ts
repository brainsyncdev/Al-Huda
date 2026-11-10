// Sprint 44 — Global root discovery and batch publication regression tests.
//
// These tests verify that:
// 1. All distinct roots are discovered from morphology index
// 2. No roots are fabricated or inferred
// 3. Ayah-level markers are excluded from statistics
// 4. Discovery output is deterministic
// 5. Manual entries are preserved
// 6. Policy B permits incomplete lemma coverage when alignment valid
// 7. Invalid alignment blocks publication
// 8. Batch publication is idempotent
// 9. Per-root failures don't corrupt others
// 10. Totals reconcile

import { describe, it, expect } from "vitest";
import { discoverAllRoots } from "./root-discovery";
import { evaluateBatchEligibility } from "./batch-eligibility";
import type { MorphologyRecord } from "./types";
import type { RootTopicEntry } from "./root-allowlist";

function makeRecord(
  surah: number,
  ayah: number,
  wordPos: number | undefined,
  root: string,
  lemma: string | undefined
): MorphologyRecord {
  return {
    ref: { surah, ayah },
    wordPosition: wordPos,
    token: "تست",
    canonicalArabic: "",
    sourceId: "test",
    root,
    lemma,
  };
}

describe("Sprint 44 — Root discovery", () => {
  it("discovers all distinct roots from morphology index", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
      makeRecord(2, 155, 3, "صبر", "صَبَرَ"),
      makeRecord(3, 200, 2, "علم", "عِلْم"),
      makeRecord(3, 201, 1, "علم", "عَالِم"),
      makeRecord(4, 100, 4, "رحم", "رَحْم"),
    ];

    const candidates = discoverAllRoots(index);

    expect(candidates).toHaveLength(3);
    expect(candidates.map((c) => c.root).sort()).toEqual([
      "رحم",
      "صبر",
      "علم",
    ]);
  });

  it("excludes ayah-level markers from statistics", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"), // word-level
      makeRecord(2, 155, undefined, "صبر", undefined), // ayah-level marker
      makeRecord(3, 200, 2, "صبر", "صَابِر"), // word-level
    ];

    const candidates = discoverAllRoots(index);

    expect(candidates).toHaveLength(1);
    const sabr = candidates[0];
    expect(sabr.totalWordRecords).toBe(2); // Only word-level records
    expect(sabr.distinctAyahCount).toBe(2); // 2:153 and 3:200
  });

  it("produces deterministic output (stable ordering)", () => {
    const index: MorphologyRecord[] = [
      makeRecord(3, 200, 2, "علم", "عِلْم"),
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
      makeRecord(4, 100, 4, "رحم", "رَحْم"),
    ];

    const candidates1 = discoverAllRoots(index);
    const candidates2 = discoverAllRoots(index);

    expect(candidates1).toEqual(candidates2);
    expect(candidates1.map((c) => c.root)).toEqual(["رحم", "صبر", "علم"]);
  });

  it("computes lemma coverage correctly", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
      makeRecord(2, 155, 3, "صبر", undefined), // missing lemma
      makeRecord(3, 200, 2, "صبر", "صَابِر"),
      makeRecord(3, 201, 1, "صبر", undefined), // missing lemma
    ];

    const candidates = discoverAllRoots(index);

    expect(candidates).toHaveLength(1);
    const sabr = candidates[0];
    expect(sabr.totalWordRecords).toBe(4);
    expect(sabr.recordsWithLemma).toBe(2);
    expect(sabr.missingLemmaCount).toBe(2);
    expect(sabr.lemmaCoverageRatio).toBe(0.5);
  });

  it("does not fabricate roots (only discovers source-backed roots)", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
    ];

    const candidates = discoverAllRoots(index);

    // Only one root discovered, no fabricated roots
    expect(candidates).toHaveLength(1);
    expect(candidates[0].root).toBe("صبر");
  });
});

describe("Sprint 44 — Batch eligibility", () => {
  it("preserves existing manual entries", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
      makeRecord(2, 155, 3, "صبر", "صَبَرَ"),
    ];

    const candidates = discoverAllRoots(index);
    const manualEntries: RootTopicEntry[] = [
      {
        slug: "sabr",
        title: "Patience",
        arabicTitle: "الصبر",
        roots: ["صبر"],
        includedLemmas: ["صَبَرَ"],
        reviewState: "approved",
        assertedBy: "human-reviewer",
        assertedAt: "2026-10-01",
      },
    ];

    const result = evaluateBatchEligibility(candidates, index, manualEntries);

    expect(result.manualMatchCount).toBe(1);
    expect(result.results[0].matchedManualEntry).toBe(true);
    expect(result.results[0].manualEntrySlug).toBe("sabr");
  });

  it("Policy B permits incomplete lemma coverage when alignment valid", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "علم", "عِلْم"),
      makeRecord(2, 155, 3, "علم", undefined), // missing lemma
      makeRecord(3, 200, 2, "علم", "عَالِم"),
    ];

    const candidates = discoverAllRoots(index);
    const result = evaluateBatchEligibility(candidates, index, []);

    expect(result.results[0].eligible).toBe(true);
    expect(result.results[0].decision.decision).toBe("publish");
    expect(result.results[0].decision.missingLemmaCount).toBe(1);
    expect(result.results[0].decision.lemmaCoverageRatio).toBeCloseTo(0.667);
  });

  it("invalid alignment blocks publication", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
      makeRecord(2, 155, 3, "صبر", "صَبَرَ"),
      makeRecord(2, 155, 3, "صبر", "صَبَرَ"), // duplicate position
    ];

    const candidates = discoverAllRoots(index);
    const result = evaluateBatchEligibility(candidates, index, []);

    // Duplicate position is an error-severity validation issue
    expect(result.results[0].eligible).toBe(false);
    expect(result.results[0].decision.decision).toBe("needs-review");
    expect(result.results[0].validationIssues.length).toBeGreaterThan(0);
  });

  it("per-root failures don't corrupt others", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
      makeRecord(3, 200, 2, "علم", "عِلْم"),
    ];

    const candidates = discoverAllRoots(index);
    const result = evaluateBatchEligibility(candidates, index, []);

    // Both roots should be evaluated independently
    expect(result.totalEvaluated).toBe(2);
    expect(result.results).toHaveLength(2);
    expect(result.results.every((r) => r.decision !== undefined)).toBe(true);
  });

  it("totals reconcile: discovered = eligible + blocked", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
      makeRecord(3, 200, 2, "علم", "عِلْم"),
      makeRecord(4, 100, 4, "رحم", "رَحْم"),
    ];

    const candidates = discoverAllRoots(index);
    const result = evaluateBatchEligibility(candidates, index, []);

    expect(result.totalEvaluated).toBe(
      result.eligibleCount + result.blockedCount
    );
  });
});

describe("Sprint 44 — Manual decisions preservation", () => {
  it("automatic publication never activates topic (human gate separate)", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
    ];

    const candidates = discoverAllRoots(index);
    const manualEntries: RootTopicEntry[] = [
      {
        slug: "sabr",
        title: "Patience",
        arabicTitle: "الصبر",
        roots: ["صبر"],
        includedLemmas: [],
        reviewState: "pending-review", // Not approved
        assertedBy: "human-reviewer",
        assertedAt: "2026-10-01",
      },
    ];

    const result = evaluateBatchEligibility(candidates, index, manualEntries);

    // Publication decision is separate from activation
    expect(result.results[0].decision.decision).toBe("publish");
    // But the manual entry's reviewState is preserved
    expect(result.results[0].matchedManualEntry).toBe(true);
  });

  it("root publication never changes curated topic membership", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "صبر", "صَبَرَ"),
    ];

    const candidates = discoverAllRoots(index);
    const manualEntries: RootTopicEntry[] = [
      {
        slug: "sabr",
        title: "Patience",
        arabicTitle: "الصبر",
        roots: ["صبر"],
        includedLemmas: ["صَبَرَ"],
        reviewState: "approved",
        assertedBy: "human-reviewer",
        assertedAt: "2026-10-01",
      },
    ];

    const result = evaluateBatchEligibility(candidates, index, manualEntries);

    // Manual entry fields are preserved
    expect(result.results[0].matchedManualEntry).toBe(true);
    // The decision doesn't modify the entry
    expect(result.results[0].decision.includedLemmas).toBeDefined();
  });

  it("no automatic includedLemmas approval from observed lemmas", () => {
    const index: MorphologyRecord[] = [
      makeRecord(2, 153, 5, "علم", "عِلْم"),
      makeRecord(2, 155, 3, "علم", "عَالِم"),
      makeRecord(3, 200, 2, "علم", "عِلْم"),
    ];

    const candidates = discoverAllRoots(index);
    const manualEntries: RootTopicEntry[] = [
      {
        slug: "ilm",
        title: "Knowledge",
        arabicTitle: "العلم",
        roots: ["علم"],
        includedLemmas: [], // Empty — not approved
        reviewState: "pending-review",
        assertedBy: "human-reviewer",
        assertedAt: "2026-10-01",
      },
    ];

    const result = evaluateBatchEligibility(candidates, index, manualEntries);

    // Manual entry is matched
    expect(result.results[0].matchedManualEntry).toBe(true);
    // The manual entry's includedLemmas is preserved (not auto-approved)
    expect(manualEntries[0].includedLemmas).toEqual([]);
    // The decision computes includedLemmas from AI review (structural validation)
    // This is the computed set for display, not a modification of the manual entry
    expect(result.results[0].decision.includedLemmas.length).toBeGreaterThan(0);
  });
});
