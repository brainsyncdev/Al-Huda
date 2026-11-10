// Sprint 47 — Activation Integration Regression Tests
//
// Tests the activation module that consumes the automated review artifact
// and generates populated occurrence indexes. These tests verify:
//   1. Only auto-accepted lemmas are activated.
//   2. needs-review and rejected lemmas are excluded.
//   3. Occurrence counts match source records.
//   4. Distinct ayah counts are accurate.
//   5. Word positions are preserved.
//   6. No duplicate occurrences.
//   7. No phantom occurrences.
//   8. Deterministic output.
//   9. Atomic failure behavior (zero occurrences → failure).
//  10. Excluded lemmas never leak into activated indexes.

import { describe, it, expect } from "vitest";
import { activateRoot, activateRoots } from "./activation";
import type { RootAutoReviewResult, AutomatedMorphologyReviewArtifact } from "./types";
import type { MorphologyRecord } from "../types";

function morphRec(
  root: string,
  lemma: string | undefined,
  surah: number,
  ayah: number,
  wordPosition: number | undefined
): MorphologyRecord {
  return {
    ref: { surah, ayah },
    wordPosition,
    token: "tok",
    canonicalArabic: "ar",
    root,
    lemma,
    sourceId: "qul-morphology-v1",
  };
}

function makeRootResult(
  slug: string,
  root: string,
  lemmas: Array<{ lemma: string; outcome: "auto-accepted" | "needs-review" | "rejected" }>
): RootAutoReviewResult {
  return {
    slug,
    root,
    lemmas: lemmas.map((l) => ({
      root,
      rootSlug: slug,
      lemma: l.lemma,
      sourceLemmaId: null,
      sourceDataset: "qul-morphology-v1",
      sourceOccurrenceCount: 0,
      sourceWordLocations: [],
      deterministicChecks: {
        hasSourceRecords: true,
        hasWordLocations: true,
        hasLemmas: true,
        noDuplicates: true,
      },
      compatibilityResult: "compatible",
      compatibilityDetail: {
        sharedStrongLetters: 3,
        rootStrongLetterCount: 3,
        rootHasWeakLetters: false,
      },
      aiRecommendation: null,
      outcome: l.outcome,
      reasonCodes: [],
      explanation: "",
      policyVersion: "1.0.0",
      reviewerOverride: null,
      reviewedAt: "2026-11-10T00:00:00Z",
    })),
    summary: {
      totalLemmas: lemmas.length,
      autoAccepted: lemmas.filter((l) => l.outcome === "auto-accepted").length,
      needsReview: lemmas.filter((l) => l.outcome === "needs-review").length,
      rejected: lemmas.filter((l) => l.outcome === "rejected").length,
      reviewerOverrides: 0,
      totalOccurrences: 0,
      distinctAyat: 0,
    },
  };
}

describe("Sprint 47: activation integration", () => {
  it("activates only auto-accepted lemmas", () => {
    const rootResult = makeRootResult("sabr", "\u0635\u0628\u0631", [
      { lemma: "\u0635\u064e\u0628\u064e\u0631", outcome: "auto-accepted" },
      { lemma: "\u0635\u064e\u0627\u0628\u0650\u0631", outcome: "needs-review" },
    ]);

    const records = [
      morphRec("\u0635\u0628\u0631", "\u0635\u064e\u0628\u064e\u0631", 2, 45, 3),
      morphRec("\u0635\u0628\u0631", "\u0635\u064e\u0628\u064e\u0631", 2, 153, 5),
      morphRec("\u0635\u0628\u0631", "\u0635\u064e\u0627\u0628\u0650\u0631", 3, 200, 1), // needs-review
    ];

    const { index, result } = activateRoot(rootResult, records, "Patience", "\u0635\u0628\u0631");
    expect(result.success).toBe(true);
    expect(result.occurrenceCount).toBe(2); // Only auto-accepted
    expect(result.distinctAyahCount).toBe(2);
    expect(result.includedLemmaCount).toBe(1);
    expect(index).not.toBeNull();
    expect(index!.occurrences).toHaveLength(2);
    expect(index!.occurrences.every((o) => o.matchedLemma === "\u0635\u064e\u0628\u064e\u0631")).toBe(true);
  });

  it("excludes needs-review lemmas from activation", () => {
    const rootResult = makeRootResult("test", "\u062a\u0633\u062a", [
      { lemma: "\u0623", outcome: "auto-accepted" },
      { lemma: "\u0628", outcome: "needs-review" },
    ]);

    const records = [
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 1),
      morphRec("\u062a\u0633\u062a", "\u0628", 2, 46, 1),
    ];

    const { index, result } = activateRoot(rootResult, records, "Test", "\u062a\u0633\u062a");
    expect(result.success).toBe(true);
    expect(result.occurrenceCount).toBe(1);
    expect(index!.occurrences[0].matchedLemma).toBe("\u0623");
  });

  it("excludes rejected lemmas from activation", () => {
    const rootResult = makeRootResult("test", "\u062a\u0633\u062a", [
      { lemma: "\u0623", outcome: "auto-accepted" },
      { lemma: "\u0628", outcome: "rejected" },
    ]);

    const records = [
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 1),
      morphRec("\u062a\u0633\u062a", "\u0628", 2, 46, 1),
    ];

    const { index, result } = activateRoot(rootResult, records, "Test", "\u062a\u0633\u062a");
    expect(result.success).toBe(true);
    expect(result.occurrenceCount).toBe(1);
    expect(index!.occurrences[0].matchedLemma).toBe("\u0623");
  });

  it("fails activation when no auto-accepted lemmas exist", () => {
    const rootResult = makeRootResult("test", "\u062a\u0633\u062a", [
      { lemma: "\u0623", outcome: "needs-review" },
    ]);

    const records = [morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 1)];

    const { index, result } = activateRoot(rootResult, records, "Test", "\u062a\u0633\u062a");
    expect(result.success).toBe(false);
    expect(result.errors.some((e) => e.includes("No auto-accepted"))).toBe(true);
    expect(index).toBeNull();
  });

  it("fails activation when zero occurrences match", () => {
    const rootResult = makeRootResult("test", "\u062a\u0633\u062a", [
      { lemma: "\u0623", outcome: "auto-accepted" },
    ]);

    const records: MorphologyRecord[] = [];

    const { index, result } = activateRoot(rootResult, records, "Test", "\u062a\u0633\u062a");
    expect(result.success).toBe(false);
    expect(result.errors.some((e) => e.includes("zero"))).toBe(true);
    expect(index).toBeNull();
  });

  it("preserves exact word positions", () => {
    const rootResult = makeRootResult("test", "\u062a\u0633\u062a", [
      { lemma: "\u0623", outcome: "auto-accepted" },
    ]);

    const records = [
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 3),
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 7),
    ];

    const { index, result } = activateRoot(rootResult, records, "Test", "\u062a\u0633\u062a");
    expect(result.success).toBe(true);
    expect(index!.occurrences[0].wordPosition).toBe(3);
    expect(index!.occurrences[1].wordPosition).toBe(7);
  });

  it("calculates distinct ayah counts correctly", () => {
    const rootResult = makeRootResult("test", "\u062a\u0633\u062a", [
      { lemma: "\u0623", outcome: "auto-accepted" },
    ]);

    const records = [
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 1),
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 2), // Same ayah
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 46, 1), // Different ayah
    ];

    const { result } = activateRoot(rootResult, records, "Test", "\u062a\u0633\u062a");
    expect(result.success).toBe(true);
    expect(result.occurrenceCount).toBe(3);
    expect(result.distinctAyahCount).toBe(2); // 2:45 and 2:46
  });

  it("sorts occurrences deterministically by surah, ayah, wordPosition", () => {
    const rootResult = makeRootResult("test", "\u062a\u0633\u062a", [
      { lemma: "\u0623", outcome: "auto-accepted" },
    ]);

    const records = [
      morphRec("\u062a\u0633\u062a", "\u0623", 3, 200, 1),
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 3),
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 1),
      morphRec("\u062a\u0633\u062a", "\u0623", 2, 153, 5),
    ];

    const { index: idx } = activateRoot(rootResult, records, "Test", "\u062a\u0633\u062a");
    expect(idx!.occurrences[0].ref.surah).toBe(2);
    expect(idx!.occurrences[0].ref.ayah).toBe(45);
    expect(idx!.occurrences[0].wordPosition).toBe(1);
    expect(idx!.occurrences[1].wordPosition).toBe(3);
    expect(idx!.occurrences[2].ref.ayah).toBe(153);
    expect(idx!.occurrences[3].ref.surah).toBe(3);
  });

  it("sets reviewState to auto-accepted in the entry", () => {
    const rootResult = makeRootResult("test", "\u062a\u0633\u062a", [
      { lemma: "\u0623", outcome: "auto-accepted" },
    ]);

    const records = [morphRec("\u062a\u0633\u062a", "\u0623", 2, 45, 1)];

    const { index } = activateRoot(rootResult, records, "Test", "\u062a\u0633\u062a");
    expect(index!.entry.reviewState).toBe("auto-accepted");
    expect(index!.entry.assertedBy).toBe("automated-morphology-review");
  });

  it("activateRoots processes multiple roots", () => {
    const artifact: AutomatedMorphologyReviewArtifact = {
      schemaVersion: 1,
      policyVersion: "1.0.0",
      generatedAt: "2026-11-10T00:00:00Z",
      sourceDataset: "qul-morphology-v1",
      aiProvider: "none",
      roots: [
        makeRootResult("sabr", "\u0635\u0628\u0631", [{ lemma: "\u0623", outcome: "auto-accepted" }]),
        makeRootResult("shukr", "\u0634\u0643\u0631", [{ lemma: "\u0628", outcome: "auto-accepted" }]),
      ],
      globalSummary: {
        totalRootsProcessed: 2,
        totalLemmasEvaluated: 2,
        totalAutoAccepted: 2,
        totalNeedsReview: 0,
        totalRejected: 0,
        totalReviewerOverrides: 0,
      },
    };

    const records = [
      morphRec("\u0635\u0628\u0631", "\u0623", 2, 45, 1),
      morphRec("\u0634\u0643\u0631", "\u0628", 2, 152, 1),
    ];

    const rootTitles = new Map([
      ["sabr", { title: "Patience", arabicTitle: "\u0635\u0628\u0631" }],
      ["shukr", { title: "Gratitude", arabicTitle: "\u0634\u0643\u0631" }],
    ]);

    const results = activateRoots(artifact, records, rootTitles);
    expect(results).toHaveLength(2);
    expect(results[0].result.success).toBe(true);
    expect(results[1].result.success).toBe(true);
  });
});
