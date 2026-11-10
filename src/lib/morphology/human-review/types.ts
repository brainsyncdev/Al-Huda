// Sprint 46 — Human Lemma Review Data Model
//
// Versioned schema for human lemma review decisions. This module defines the
// shape of reviewer decisions, completely separate from immutable source
// evidence (morphology-index.json, human-lemma-review-workbook.json).
//
// DESIGN PRINCIPLES:
//   1. Source evidence is immutable — never overwritten by reviewer decisions.
//   2. Reviewer decisions are explicit — no automatic inclusion or exclusion.
//   3. Every lemma must have a decision before a root can be approved.
//   4. Undecided lemmas prevent approval.
//   5. AI recommendations never become reviewer decisions.
//   6. No fabricated reviewer identities or credentials.
//   7. Final included lemmas derive only from explicit "include" decisions.
//   8. An approved root must pass deterministic validation before activation.
//
// RELATIONSHIP TO EXISTING SYSTEMS:
//   - ROOT_ALLOWLIST (root-allowlist.ts): tracks human review lifecycle
//     (pending-review → approved). This module adds lemma-level granularity.
//   - publication-status.ts: bridges automated publication decisions to UI.
//   - occurrence-index.ts: builds occurrence indexes from includedLemmas.
//   - This module sits between the reviewer and the activation engine:
//     reviewer decisions → activation engine → occurrence index.

/** Allowed decisions for each lemma. */
export type LemmaDecision = "include" | "exclude" | "undecided";

/** Allowed states for a root review. */
export type RootReviewState =
  | "pending-review"
  | "in-review"
  | "approved"
  | "needs-review";

/**
 * One lemma review record. Captures the reviewer's decision for a single
 * lemma, along with the source evidence that informed the decision.
 *
 * Source evidence fields (lemma, count, ayahRefs, compatibility) are copied
 * from the immutable source at review-creation time and must never be
 * modified by the reviewer. Reviewer fields (decision, notes, timestamp)
 * are the only mutable parts.
 */
export interface LemmaReviewRecord {
  /** Exact Arabic lemma form from the source. Immutable. */
  lemma: string;
  /**
   * Source lemma identifier, if available (e.g., QUL lemma ID).
   * May be null if the source does not provide one. Immutable.
   */
  sourceLemmaId: string | null;
  /** Source-backed occurrence count. Immutable. */
  sourceOccurrenceCount: number;
  /**
   * Source ayah references (up to 10 sample refs). Immutable.
   * Each is a "surah:ayah" string.
   */
  sourceAyahRefs: string[];
  /** Consonantal compatibility with the root. Immutable. */
  consonantallyCompatible: boolean;
  /** Polysemy warnings from existing allowlist notes. Immutable. */
  polysemyWarnings: string[];
  /** Human-readable evidence summary. Immutable. */
  evidenceSummary: string;

  // === MUTABLE REVIEWER FIELDS ===

  /** Reviewer's decision for this lemma. */
  reviewerDecision: LemmaDecision;
  /** Reviewer's notes explaining the decision. */
  reviewerNotes: string;
  /** ISO timestamp of the last decision update. */
  decisionTimestamp: string | null;
}

/**
 * Complete review decision for one root. Contains all lemma records,
 * the overall review state, and metadata.
 */
export interface RootReviewDecision {
  /** Root slug (e.g., "sabr"). Matches ROOT_ALLOWLIST slug. */
  slug: string;
  /** Arabic root string (e.g., "صبر"). */
  root: string;
  /** English title from ROOT_ALLOWLIST. */
  title: string;
  /** Arabic title from ROOT_ALLOWLIST. */
  arabicTitle: string;

  /** Current review state. */
  reviewState: RootReviewState;

  /** Source dataset version used for evidence. */
  sourceDatasetVersion: string;
  /** Publication policy version. */
  policyVersion: string;

  /** Per-lemma review records. One per observed lemma. */
  lemmaRecords: LemmaReviewRecord[];

  /**
   * Final included lemmas, derived from explicit "include" decisions.
   * Computed field — must match the set of lemmas with decision === "include".
   * Empty until the root is approved.
   */
  finalIncludedLemmas: string[];

  /** Reviewer notes for the overall root review. */
  reviewerNotes: string;

  /**
   * Reviewer identity. Must be a real person's name or role.
   * Never "AI", "automated", or a fabricated scholarly credential.
   */
  reviewerIdentity: string | null;

  /** ISO timestamp when the review was last saved. */
  lastSavedAt: string | null;
  /** ISO timestamp when the root was approved (if approved). */
  approvedAt: string | null;

  /** Whether this root has been activated (occurrence index generated). */
  activationStatus: "not-activated" | "activated" | "activation-failed";
  /** ISO timestamp of activation, if activated. */
  activatedAt: string | null;
}

/**
 * The complete human review store, persisted to localStorage.
 * Contains review decisions for all roots under review.
 */
export interface HumanReviewStore {
  /** Schema version for forward compatibility. */
  schemaVersion: number;
  /** All root review decisions, keyed by slug. */
  reviews: Record<string, RootReviewDecision>;
  /** ISO timestamp of the last store save. */
  lastSavedAt: string | null;
}

/** Current schema version. Increment when the shape changes. */
export const HUMAN_REVIEW_SCHEMA_VERSION = 1;

/** localStorage key for the human review store. */
export const HUMAN_REVIEW_STORAGE_KEY = "alhuda.human-review.v1";

/** The 10 manual roots under review in Sprint 46. */
export const SPRINT_46_ROOT_SLUGS = [
  "sabr",
  "shukr",
  "rahmah",
  "ilm",
  "tawbah",
  "maghfirah",
  "kibr",
  "khushu",
  "sidq",
  "tawakkul",
] as const;

export type Sprint46RootSlug = (typeof SPRINT_46_ROOT_SLUGS)[number];

/**
 * Validation result for a root review decision.
 */
export interface ReviewValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Activation result for a root.
 */
export interface ActivationResult {
  slug: string;
  root: string;
  success: boolean;
  occurrenceCount: number;
  distinctAyahCount: number;
  includedLemmaCount: number;
  errors: string[];
  warnings: string[];
}
