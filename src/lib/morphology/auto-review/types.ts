// Sprint 47 — Automated Morphological Review Data Model
//
// Versioned schema for the automated, evidence-backed morphological review
// engine. This is a MORPHOLOGICAL DATA-PROCESSING feature, not an AI
// religious-answer feature. `AI_ANSWER_FEATURE_ENABLED` remains false and
// nothing here emits religious interpretation.
//
// DESIGN PRINCIPLES:
//   1. Source evidence (QUL morphology) is immutable — never overwritten.
//   2. Outcomes are evidence-backed with explicit reason codes.
//   3. Missing evidence means "needs-review", never "rejected".
//   4. Rejection requires a verified source contradiction.
//   5. AI recommendations are advisory signals; deterministic validation
//      and source evidence govern the final outcome.
//   6. No scholarly-approval wording anywhere. Wording is limited to:
//      "automated morphological acceptance", "requires further
//      morphological review", "rejected due to verified source
//      contradiction".

/** Policy version for the automated morphology review engine. */
export const AUTOMATED_MORPHOLOGY_REVIEW_POLICY = "1.0.0";

/** The three possible outcomes of an automated morphological review. */
export type AutoReviewOutcome = "auto-accepted" | "needs-review" | "rejected";

/** Result of the deterministic consonantal compatibility analysis. */
export type CompatibilityResult =
  | "compatible"
  | "inconclusive"
  | "contradicted";

/** AI confidence levels — a recommendation signal, never a sole criterion. */
export type AiConfidence = "high" | "medium" | "low";

/**
 * Structured AI recommendation (Layer B output). Only ever populated when a
 * real provider is configured and returns schema-valid output. Never
 * fabricated: when no provider exists this is null.
 */
export interface AiRecommendation {
  /** Recommended outcome. Advisory only. */
  recommendation: AutoReviewOutcome;
  /** Explanation of the morphological reasoning. */
  explanation: string;
  /** Confidence signal. */
  confidence: AiConfidence | null;
  /** Model/provider identifier. */
  modelId: string;
  /** Model version where available. */
  modelVersion: string;
  /** Prompt/policy version used. */
  promptVersion: string;
  /** ISO timestamp of the analysis. */
  analyzedAt: string;
  /** Evidence references cited by the model (surah:ayah:word keys). */
  evidenceRefs: string[];
}

/** Deterministic structural check results for one lemma. */
export interface DeterministicChecks {
  /** At least one word-level source record exists for this lemma. */
  hasSourceRecords: boolean;
  /** Every record has a valid word position. */
  hasWordLocations: boolean;
  /** Every record carries a non-empty lemma. */
  hasLemmas: boolean;
  /** No duplicate surah:ayah:wordPosition within this lemma's records. */
  noDuplicates: boolean;
}

/** Compatibility analysis detail (for explainability). */
export interface CompatibilityDetail {
  /** Count of the root's strong letters found in the lemma's strong letters. */
  sharedStrongLetters: number;
  /** Number of strong letters in the root skeleton. */
  rootStrongLetterCount: number;
  /** Whether the root contains weak letters (ا و ي). */
  rootHasWeakLetters: boolean;
}

/**
 * The machine-readable review record for one root-lemma mapping.
 * Source-derived fields are immutable after generation.
 */
export interface LemmaAutoReviewRecord {
  /** Arabic root string. */
  root: string;
  /** Root slug (URL-safe identifier). */
  rootSlug: string;
  /** Exact Arabic lemma form from the QUL source. Immutable. */
  lemma: string;
  /** Source lemma identifier if available. Immutable. */
  sourceLemmaId: string | null;
  /** Source dataset identifier. Immutable. */
  sourceDataset: string;
  /** Total word-level occurrences in the source. Immutable. */
  sourceOccurrenceCount: number;
  /** Sample word locations as "surah:ayah:wordPos" strings. Immutable. */
  sourceWordLocations: string[];

  // === DETERMINISTIC VALIDATION (Layer A) ===

  /** Structural check results. */
  deterministicChecks: DeterministicChecks;
  /** Consonantal compatibility result. */
  compatibilityResult: CompatibilityResult;
  /** Compatibility analysis details. */
  compatibilityDetail: CompatibilityDetail;

  // === AI ANALYSIS (Layer B) ===

  /** AI recommendation, or null if no provider is configured. */
  aiRecommendation: AiRecommendation | null;

  // === FINAL OUTCOME (Layer C) ===

  /** The final decision produced by the decision engine. */
  outcome: AutoReviewOutcome;
  /** Machine-readable reason codes explaining the outcome. */
  reasonCodes: string[];
  /** Human-readable explanation of the outcome. */
  explanation: string;
  /** Policy version that produced this outcome. */
  policyVersion: string;

  // === REVIEWER OVERRIDE ===

  /** If a human reviewer overrode the automated outcome. */
  reviewerOverride: ReviewerOverride | null;

  /** ISO timestamp of the review. */
  reviewedAt: string;
}

/** A human reviewer's override of an automated outcome. */
export interface ReviewerOverride {
  /** Previous automated outcome before override. */
  previousOutcome: AutoReviewOutcome;
  /** New outcome set by the reviewer. */
  newOutcome: AutoReviewOutcome;
  /** Reviewer identity (real name or role, never "AI"). */
  reviewerIdentity: string;
  /** Reason for the override. */
  reason: string;
  /** ISO timestamp of the override. */
  overriddenAt: string;
}

/** Aggregated review results for one root. */
export interface RootAutoReviewResult {
  /** Root slug. */
  slug: string;
  /** Arabic root string. */
  root: string;
  /** Per-lemma review records. */
  lemmas: LemmaAutoReviewRecord[];
  /** Summary counts. */
  summary: {
    totalLemmas: number;
    autoAccepted: number;
    needsReview: number;
    rejected: number;
    reviewerOverrides: number;
    totalOccurrences: number;
    distinctAyat: number;
  };
}

/** Top-level review artifact written to data/automated-morphology-review.json. */
export interface AutomatedMorphologyReviewArtifact {
  /** Schema version. */
  schemaVersion: number;
  /** Policy version. */
  policyVersion: string;
  /** ISO timestamp of generation. */
  generatedAt: string;
  /** Source dataset identifier. */
  sourceDataset: string;
  /** AI provider used, or "none" if unconfigured. */
  aiProvider: string;
  /** Per-root review results. */
  roots: RootAutoReviewResult[];
  /** Global summary. */
  globalSummary: {
    totalRootsProcessed: number;
    totalLemmasEvaluated: number;
    totalAutoAccepted: number;
    totalNeedsReview: number;
    totalRejected: number;
    totalReviewerOverrides: number;
  };
}

/** Current schema version. Increment when the shape changes. */
export const AUTO_REVIEW_SCHEMA_VERSION = 1;
