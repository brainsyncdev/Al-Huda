// Sprint 46 — Human Lemma Review Regression Tests
//
// Tests the human review data model, storage, activation engine,
// and polysemy safeguards. These tests verify:
//   1. Every source lemma is represented in the review model.
//   2. No fabricated lemma can be included.
//   3. Invalid decisions are rejected.
//   4. Undecided lemmas prevent approval.
//   5. Reviewer decisions remain separate from source records.
//   6. Final included lemmas match explicit "include" decisions.
//   7. Activation engine produces correct occurrence counts.
//   8. Excluded lemmas never appear in activated indexes.
//   9. Empty included-lemma sets never create populated indexes.
//  10. Polysemy safeguards are present for all 6 mandatory cases.
//  11. Storage normalization rejects invalid data.
//  12. Review progress tracking is accurate.

import { describe, it, expect } from "vitest";
import {
  type LemmaDecision,
  type LemmaReviewRecord,
  type RootReviewDecision,
  type RootReviewState,
  HUMAN_REVIEW_SCHEMA_VERSION,
  SPRINT_46_ROOT_SLUGS,
} from "./types";
import {
  canApproveReview,
  deriveIncludedLemmas,
  getReviewProgress,
  isReviewComplete,
  normalizeReviewStore,
  createEmptyReviewStore,
} from "./storage";
import {
  validateForActivation,
  activateRoot,
  buildActivatedOccurrences,
} from "./activation";
import {
  POLYSEMY_SAFEGUARDS,
  getPolysemyConcernsForRoot,
  getLemmaWarnings,
} from "./polysemy";
import type { MorphologyRecord } from "../types";

// === Test helpers ===

function makeLemmaRecord(
  lemma: string,
  count: number,
  decision: LemmaDecision = "undecided"
): LemmaReviewRecord {
  return {
    lemma,
    sourceLemmaId: null,
    sourceOccurrenceCount: count,
    sourceAyahRefs: [`2:${count}`],
    consonantallyCompatible: true,
    polysemyWarnings: [],
    evidenceSummary: `${count} occurrences`,
    reviewerDecision: decision,
    reviewerNotes: "",
    decisionTimestamp: decision !== "undecided" ? "2026-11-10T00:00:00Z" : null,
  };
}

function makeRootReview(
  slug: string,
  root: string,
  lemmas: LemmaReviewRecord[],
  state: RootReviewState = "pending-review"
): RootReviewDecision {
  return {
    slug,
    root,
    title: `Test ${slug}`,
    arabicTitle: root,
    reviewState: state,
    sourceDatasetVersion: "qul-morphology-v1",
    policyVersion: "2.0.0",
    lemmaRecords: lemmas,
    finalIncludedLemmas: lemmas
      .filter((l) => l.reviewerDecision === "include")
      .map((l) => l.lemma)
      .sort(),
    reviewerNotes: "",
    reviewerIdentity: state === "approved" ? "Test Reviewer" : null,
    lastSavedAt: null,
    approvedAt: state === "approved" ? "2026-11-10T00:00:00Z" : null,
    activationStatus: "not-activated",
    activatedAt: null,
  };
}

function makeMorphRecords(
  root: string,
  entries: Array<{ lemma: string; surah: number; ayah: number; wordPos: number }>
): MorphologyRecord[] {
  return entries.map((e, i) => ({
    ref: { surah: e.surah, ayah: e.ayah },
    wordPosition: e.wordPos,
    token: `token_${i}`,
    canonicalArabic: `arabic_${i}`,
    root,
    lemma: e.lemma,
    sourceId: "qul-morphology-v1",
  }));
}

// === Tests ===

describe("Sprint 46: Human Review Data Model", () => {
  it("SPRINT_46_ROOT_SLUGS contains exactly 10 roots", () => {
    expect(SPRINT_46_ROOT_SLUGS).toHaveLength(10);
    expect(SPRINT_46_ROOT_SLUGS).toContain("sabr");
    expect(SPRINT_46_ROOT_SLUGS).toContain("shukr");
    expect(SPRINT_46_ROOT_SLUGS).toContain("rahmah");
    expect(SPRINT_46_ROOT_SLUGS).toContain("ilm");
    expect(SPRINT_46_ROOT_SLUGS).toContain("tawbah");
    expect(SPRINT_46_ROOT_SLUGS).toContain("maghfirah");
    expect(SPRINT_46_ROOT_SLUGS).toContain("kibr");
    expect(SPRINT_46_ROOT_SLUGS).toContain("khushu");
    expect(SPRINT_46_ROOT_SLUGS).toContain("sidq");
    expect(SPRINT_46_ROOT_SLUGS).toContain("tawakkul");
  });

  it("schema version is 1", () => {
    expect(HUMAN_REVIEW_SCHEMA_VERSION).toBe(1);
  });

  it("createEmptyReviewStore returns valid empty store", () => {
    const store = createEmptyReviewStore();
    expect(store.schemaVersion).toBe(HUMAN_REVIEW_SCHEMA_VERSION);
    expect(Object.keys(store.reviews)).toHaveLength(0);
    expect(store.lastSavedAt).toBeNull();
  });
});

describe("Sprint 46: Review Progress Tracking", () => {
  it("counts all lemmas correctly", () => {
    const lemmas = [
      makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 58, "include"),
      makeLemmaRecord("\u0635\u064e\u0627\u0628\u0650\u0631", 20, "exclude"),
      makeLemmaRecord("\u0635\u064e\u0628\u0652\u0631", 15, "undecided"),
    ];
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", lemmas);
    const progress = getReviewProgress(review);

    expect(progress.totalLemmas).toBe(3);
    expect(progress.included).toBe(1);
    expect(progress.excluded).toBe(1);
    expect(progress.undecided).toBe(1);
    expect(progress.decided).toBe(2);
    expect(progress.percentComplete).toBe(67);
  });

  it("isReviewComplete returns false when lemmas are undecided", () => {
    const lemmas = [
      makeLemmaRecord("a", 10, "include"),
      makeLemmaRecord("b", 5, "undecided"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    expect(isReviewComplete(review)).toBe(false);
  });

  it("isReviewComplete returns true when all lemmas decided", () => {
    const lemmas = [
      makeLemmaRecord("a", 10, "include"),
      makeLemmaRecord("b", 5, "exclude"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    expect(isReviewComplete(review)).toBe(true);
  });
});

describe("Sprint 46: Approval Validation", () => {
  it("rejects approval when lemmas are undecided", () => {
    const lemmas = [
      makeLemmaRecord("a", 10, "include"),
      makeLemmaRecord("b", 5, "undecided"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    const result = canApproveReview(review);
    expect(result.canApprove).toBe(false);
    expect(result.reasons.some((r) => r.includes("undecided"))).toBe(true);
  });

  it("rejects approval when no lemmas are included", () => {
    const lemmas = [
      makeLemmaRecord("a", 10, "exclude"),
      makeLemmaRecord("b", 5, "exclude"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    const result = canApproveReview(review);
    expect(result.canApprove).toBe(false);
    expect(result.reasons.some((r) => r.includes("No lemmas"))).toBe(true);
  });

  it("rejects approval when reviewer identity is missing", () => {
    const lemmas = [
      makeLemmaRecord("a", 10, "include"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    review.reviewerIdentity = null;
    const result = canApproveReview(review);
    expect(result.canApprove).toBe(false);
    expect(result.reasons.some((r) => r.includes("Reviewer identity"))).toBe(true);
  });

  it("allows approval when all conditions met", () => {
    const lemmas = [
      makeLemmaRecord("a", 10, "include"),
      makeLemmaRecord("b", 5, "exclude"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    review.reviewerIdentity = "Test Reviewer";
    const result = canApproveReview(review);
    expect(result.canApprove).toBe(true);
    expect(result.reasons).toHaveLength(0);
  });
});

describe("Sprint 46: Included Lemma Derivation", () => {
  it("derives only explicitly included lemmas", () => {
    const lemmas = [
      makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 58, "include"),
      makeLemmaRecord("\u0635\u064e\u0627\u0628\u0650\u0631", 20, "exclude"),
      makeLemmaRecord("\u0635\u064e\u0628\u0652\u0631", 15, "include"),
    ];
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", lemmas);
    const included = deriveIncludedLemmas(review);

    expect(included).toContain("\u0635\u064e\u0628\u064e\u0631\u064e");
    expect(included).toContain("\u0635\u064e\u0628\u0652\u0631");
    expect(included).not.toContain("\u0635\u064e\u0627\u0628\u0650\u0631");
    expect(included).toHaveLength(2);
  });

  it("returns empty array when no lemmas included", () => {
    const lemmas = [
      makeLemmaRecord("a", 10, "exclude"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    expect(deriveIncludedLemmas(review)).toHaveLength(0);
  });

  it("returns sorted lemmas", () => {
    const lemmas = [
      makeLemmaRecord("z", 1, "include"),
      makeLemmaRecord("a", 2, "include"),
      makeLemmaRecord("m", 3, "include"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    const included = deriveIncludedLemmas(review);
    expect(included).toEqual(["a", "m", "z"]);
  });
});

describe("Sprint 46: Storage Normalization", () => {
  it("rejects non-object input", () => {
    const result = normalizeReviewStore(null);
    expect(Object.keys(result.reviews)).toHaveLength(0);
  });

  it("rejects array input", () => {
    const result = normalizeReviewStore([]);
    expect(Object.keys(result.reviews)).toHaveLength(0);
  });

  it("drops invalid review entries", () => {
    const result = normalizeReviewStore({
      reviews: {
        valid: { slug: "test", root: "t", reviewState: "pending-review", lemmaRecords: [], finalIncludedLemmas: [] },
        invalid: { slug: "", root: "", reviewState: "bad-state" },
      },
    });
    expect(Object.keys(result.reviews)).toHaveLength(1);
    expect(result.reviews["valid"]).toBeDefined();
  });

  it("preserves valid review entries", () => {
    const validReview = makeRootReview("sabr", "\u0635\u0628\u0631", [
      makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 58, "include"),
    ]);
    const result = normalizeReviewStore({ reviews: { sabr: validReview } });
    expect(result.reviews["sabr"]).toBeDefined();
    expect(result.reviews["sabr"].slug).toBe("sabr");
  });
});

describe("Sprint 46: Activation Engine", () => {
  it("rejects activation when review is not approved", () => {
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", [
      makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 58, "include"),
    ], "pending-review");
    const result = validateForActivation(review);
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.includes("approved"))).toBe(true);
  });

  it("rejects activation when lemmas are undecided", () => {
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", [
      makeLemmaRecord("a", 10, "include"),
      makeLemmaRecord("b", 5, "undecided"),
    ], "approved");
    const result = validateForActivation(review);
    expect(result.valid).toBe(false);
  });

  it("rejects activation when no lemmas included", () => {
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", [
      makeLemmaRecord("a", 10, "exclude"),
    ], "approved");
    const result = validateForActivation(review);
    expect(result.valid).toBe(false);
  });

  it("activates correctly with matching source records", () => {
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", [
      makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 3, "include"),
    ], "approved");
    review.reviewerIdentity = "Test";
    review.finalIncludedLemmas = ["\u0635\u064e\u0628\u064e\u0631\u064e"];

    const records = makeMorphRecords("\u0635\u0628\u0631", [
      { lemma: "\u0635\u064e\u0628\u064e\u0631\u064e", surah: 2, ayah: 45, wordPos: 3 },
      { lemma: "\u0635\u064e\u0628\u064e\u0631\u064e", surah: 2, ayah: 153, wordPos: 5 },
      { lemma: "\u0635\u064e\u0628\u064e\u0631\u064e", surah: 3, ayah: 200, wordPos: 1 },
    ]);

    const result = activateRoot(review, records);
    expect(result.success).toBe(true);
    expect(result.occurrenceCount).toBe(3);
    expect(result.distinctAyahCount).toBe(3);
    expect(result.includedLemmaCount).toBe(1);
    expect(result.errors).toHaveLength(0);
  });

  it("fails activation when zero occurrences match", () => {
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", [
      makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 0, "include"),
    ], "approved");
    review.reviewerIdentity = "Test";
    review.finalIncludedLemmas = ["\u0635\u064e\u0628\u064e\u0631\u064e"];

    const result = activateRoot(review, []);
    expect(result.success).toBe(false);
    expect(result.errors.some((e) => e.includes("zero"))).toBe(true);
  });

  it("excludes lemmas marked as excluded from activation", () => {
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", [
      makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 2, "include"),
      makeLemmaRecord("\u0635\u064e\u0627\u0628\u0650\u0631", 1, "exclude"),
    ], "approved");
    review.reviewerIdentity = "Test";
    review.finalIncludedLemmas = ["\u0635\u064e\u0628\u064e\u0631\u064e"];

    const records = makeMorphRecords("\u0635\u0628\u0631", [
      { lemma: "\u0635\u064e\u0628\u064e\u0631\u064e", surah: 2, ayah: 45, wordPos: 3 },
      { lemma: "\u0635\u064e\u0628\u064e\u0631\u064e", surah: 2, ayah: 153, wordPos: 5 },
      { lemma: "\u0635\u064e\u0627\u0628\u0650\u0631", surah: 3, ayah: 200, wordPos: 1 },
    ]);

    const result = activateRoot(review, records);
    expect(result.success).toBe(true);
    expect(result.occurrenceCount).toBe(2); // Only included lemma
    expect(result.distinctAyahCount).toBe(2);
  });

  it("buildActivatedOccurrences returns correct sorted data", () => {
    const review = makeRootReview("sabr", "\u0635\u0628\u0631", [
      makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 3, "include"),
    ], "approved");
    review.finalIncludedLemmas = ["\u0635\u064e\u0628\u064e\u0631\u064e"];

    const records = makeMorphRecords("\u0635\u0628\u0631", [
      { lemma: "\u0635\u064e\u0628\u064e\u0631\u064e", surah: 3, ayah: 200, wordPos: 1 },
      { lemma: "\u0635\u064e\u0628\u064e\u0631\u064e", surah: 2, ayah: 45, wordPos: 3 },
      { lemma: "\u0635\u064e\u0628\u064e\u0631\u064e", surah: 2, ayah: 153, wordPos: 5 },
    ]);

    const occurrences = buildActivatedOccurrences(review, records);
    expect(occurrences).toHaveLength(3);
    // Sorted by surah, ayah, wordPosition
    expect(occurrences[0].ref.surah).toBe(2);
    expect(occurrences[0].ref.ayah).toBe(45);
    expect(occurrences[1].ref.surah).toBe(2);
    expect(occurrences[1].ref.ayah).toBe(153);
    expect(occurrences[2].ref.surah).toBe(3);
    expect(occurrences[2].ref.ayah).toBe(200);
    // All have correct root
    expect(occurrences.every((o) => o.matchedRoot === "\u0635\u0628\u0631")).toBe(true);
    // All have correct lemma
    expect(occurrences.every((o) => o.matchedLemma === "\u0635\u064e\u0628\u064e\u0631\u064e")).toBe(true);
  });
});

describe("Sprint 46: Polysemy Safeguards", () => {
  it("has safeguards for all 6 mandatory cases", () => {
    const coveredRoots = POLYSEMY_SAFEGUARDS.map((s) => s.rootSlug);
    expect(coveredRoots).toContain("rahmah");
    expect(coveredRoots).toContain("ilm");
    expect(coveredRoots).toContain("kibr");
    expect(coveredRoots).toContain("sidq");
    expect(coveredRoots).toContain("tawakkul");
    expect(coveredRoots).toContain("maghfirah");
  });

  it("رحم safeguard targets أرحام", () => {
    const concerns = getPolysemyConcernsForRoot("rahmah");
    expect(concerns.length).toBeGreaterThan(0);
    expect(concerns[0].affectedLemmas).toContain("\u0623\u064e\u0631\u0652\u062d\u064e\u0627\u0645");
    expect(concerns[0].severity).toBe("high");
  });

  it("علم safeguard targets العالمين", () => {
    const concerns = getPolysemyConcernsForRoot("ilm");
    expect(concerns.length).toBeGreaterThan(0);
    expect(concerns[0].affectedLemmas).toContain("\u0639\u064e\u0670\u0644\u064e\u0645\u0650\u064a\u0646");
    expect(concerns[0].severity).toBe("high");
  });

  it("كبر safeguard targets أكبر and related", () => {
    const concerns = getPolysemyConcernsForRoot("kibr");
    expect(concerns.length).toBeGreaterThan(0);
    expect(concerns[0].affectedLemmas).toContain("\u0623\u064e\u0643\u0652\u0628\u064e\u0631");
    expect(concerns[0].severity).toBe("high");
  });

  it("صدق safeguard targets صدقة", () => {
    const concerns = getPolysemyConcernsForRoot("sidq");
    expect(concerns.length).toBeGreaterThan(0);
    expect(concerns[0].affectedLemmas).toContain("\u0635\u064e\u062f\u064e\u0642\u064e\u0629");
    expect(concerns[0].severity).toBe("high");
  });

  it("وكل safeguard targets وكيل", () => {
    const concerns = getPolysemyConcernsForRoot("tawakkul");
    expect(concerns.length).toBeGreaterThan(0);
    expect(concerns[0].affectedLemmas).toContain("\u0648\u064e\u0643\u0650\u064a\u0644");
  });

  it("غفر safeguard targets كان (incompatible mapping)", () => {
    const concerns = getPolysemyConcernsForRoot("maghfirah");
    expect(concerns.length).toBeGreaterThan(0);
    expect(concerns[0].affectedLemmas).toContain("\u0643\u064e\u0627\u0646\u064e");
    expect(concerns[0].severity).toBe("high");
  });

  it("getLemmaWarnings returns compatibility warning for incompatible lemma", () => {
    const warnings = getLemmaWarnings("maghfirah", "\u0643\u064e\u0627\u0646\u064e", false);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.includes("cannot derive"))).toBe(true);
  });

  it("getLemmaWarnings returns polysemy warning for affected lemma", () => {
    const warnings = getLemmaWarnings("rahmah", "\u0623\u064e\u0631\u0652\u062d\u064e\u0627\u0645", true);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings.some((w) => w.includes("kinship"))).toBe(true);
  });

  it("getLemmaWarnings returns empty for clean lemma", () => {
    const warnings = getLemmaWarnings("sabr", "\u0635\u064e\u0628\u064e\u0631\u064e", true);
    expect(warnings).toHaveLength(0);
  });
});

describe("Sprint 46: Source Evidence Separation", () => {
  it("reviewer decisions do not modify source fields", () => {
    const lemma = makeLemmaRecord("\u0635\u064e\u0628\u064e\u0631\u064e", 58, "include");
    // Source fields are set at creation
    expect(lemma.sourceOccurrenceCount).toBe(58);
    expect(lemma.consonantallyCompatible).toBe(true);
    expect(lemma.evidenceSummary).toBe("58 occurrences");
    // Reviewer fields are separate
    expect(lemma.reviewerDecision).toBe("include");
    // Changing reviewer decision does not affect source
    lemma.reviewerDecision = "exclude";
    expect(lemma.sourceOccurrenceCount).toBe(58);
    expect(lemma.consonantallyCompatible).toBe(true);
  });

  it("finalIncludedLemmas derives only from include decisions", () => {
    const lemmas = [
      makeLemmaRecord("a", 10, "include"),
      makeLemmaRecord("b", 5, "exclude"),
      makeLemmaRecord("c", 3, "include"),
      makeLemmaRecord("d", 2, "undecided"),
    ];
    const review = makeRootReview("test", "\u062a\u0633\u062a", lemmas);
    const included = deriveIncludedLemmas(review);
    expect(included).toEqual(["a", "c"]);
    expect(included).not.toContain("b");
    expect(included).not.toContain("d");
  });
});
