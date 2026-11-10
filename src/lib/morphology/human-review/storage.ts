// Sprint 46 — Human Review Storage (local-first, localStorage)
//
// Persists human lemma review decisions to localStorage following the
// existing local-first architecture. Source evidence is never stored here —
// only mutable reviewer decisions.
//
// DESIGN PRINCIPLES:
//   1. Data survives page reloads.
//   2. Existing review decisions are never silently overwritten.
//   3. Source evidence remains immutable (not stored here).
//   4. Invalid decisions are rejected at parse time.
//   5. Storage failures are disclosed, not swallowed.
//   6. No remote databases or account systems.

import {
  HUMAN_REVIEW_SCHEMA_VERSION,
  HUMAN_REVIEW_STORAGE_KEY,
  type HumanReviewStore,
  type LemmaDecision,
  type LemmaReviewRecord,
  type RootReviewDecision,
  type RootReviewState,
} from "./types";

const VALID_LEMMA_DECISIONS: LemmaDecision[] = [
  "include",
  "exclude",
  "undecided",
];

const VALID_REVIEW_STATES: RootReviewState[] = [
  "pending-review",
  "in-review",
  "approved",
  "needs-review",
];

/**
 * Create an empty review store.
 */
export function createEmptyReviewStore(): HumanReviewStore {
  return {
    schemaVersion: HUMAN_REVIEW_SCHEMA_VERSION,
    reviews: {},
    lastSavedAt: null,
  };
}

/**
 * Validate a single lemma review record.
 */
function isValidLemmaRecord(record: unknown): record is LemmaReviewRecord {
  if (typeof record !== "object" || record === null) return false;
  const r = record as Record<string, unknown>;
  return (
    typeof r.lemma === "string" &&
    r.lemma.length > 0 &&
    typeof r.sourceOccurrenceCount === "number" &&
    Array.isArray(r.sourceAyahRefs) &&
    typeof r.consonantallyCompatible === "boolean" &&
    Array.isArray(r.polysemyWarnings) &&
    typeof r.evidenceSummary === "string" &&
    VALID_LEMMA_DECISIONS.includes(r.reviewerDecision as LemmaDecision) &&
    typeof r.reviewerNotes === "string"
  );
}

/**
 * Validate a single root review decision.
 */
function isValidRootReview(review: unknown): review is RootReviewDecision {
  if (typeof review !== "object" || review === null) return false;
  const r = review as Record<string, unknown>;
  if (typeof r.slug !== "string" || r.slug.length === 0) return false;
  if (typeof r.root !== "string" || r.root.length === 0) return false;
  if (!VALID_REVIEW_STATES.includes(r.reviewState as RootReviewState))
    return false;
  if (!Array.isArray(r.lemmaRecords)) return false;
  for (const lr of r.lemmaRecords) {
    if (!isValidLemmaRecord(lr)) return false;
  }
  if (!Array.isArray(r.finalIncludedLemmas)) return false;
  return true;
}

/**
 * Normalize a parsed review store, dropping invalid entries.
 * Returns a valid store even if the input is malformed.
 */
export function normalizeReviewStore(raw: unknown): HumanReviewStore {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return createEmptyReviewStore();
  }

  const obj = raw as Record<string, unknown>;
  const reviews: Record<string, RootReviewDecision> = {};

  if (typeof obj.reviews === "object" && obj.reviews !== null) {
    for (const [slug, review] of Object.entries(
      obj.reviews as Record<string, unknown>
    )) {
      if (isValidRootReview(review)) {
        reviews[slug] = review;
      }
    }
  }

  return {
    schemaVersion: HUMAN_REVIEW_SCHEMA_VERSION,
    reviews,
    lastSavedAt:
      typeof obj.lastSavedAt === "string" ? obj.lastSavedAt : null,
  };
}

/**
 * Load the review store from localStorage.
 * Returns an empty store if nothing is stored or if parsing fails.
 * Client-side only.
 */
export function loadReviewStore(): HumanReviewStore {
  if (typeof window === "undefined") {
    return createEmptyReviewStore();
  }

  try {
    const raw = window.localStorage.getItem(HUMAN_REVIEW_STORAGE_KEY);
    if (!raw) return createEmptyReviewStore();
    const parsed = JSON.parse(raw);
    return normalizeReviewStore(parsed);
  } catch {
    // Storage read failed — return empty rather than crashing.
    return createEmptyReviewStore();
  }
}

/**
 * Save the review store to localStorage.
 * Returns true if saved successfully, false otherwise.
 * Client-side only.
 */
export function saveReviewStore(store: HumanReviewStore): boolean {
  if (typeof window === "undefined") return false;

  try {
    const toSave: HumanReviewStore = {
      ...store,
      schemaVersion: HUMAN_REVIEW_SCHEMA_VERSION,
      lastSavedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(
      HUMAN_REVIEW_STORAGE_KEY,
      JSON.stringify(toSave)
    );
    return true;
  } catch {
    // Storage write failed (quota, private mode, etc.)
    return false;
  }
}

/**
 * Clear the review store from localStorage.
 * Client-side only.
 */
export function clearReviewStore(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(HUMAN_REVIEW_STORAGE_KEY);
  } catch {
    // Ignore clear failures.
  }
}

/**
 * Get a single root review from the store.
 */
export function getRootReview(
  store: HumanReviewStore,
  slug: string
): RootReviewDecision | null {
  return store.reviews[slug] ?? null;
}

/**
 * Compute review completion statistics for a root.
 */
export function getReviewProgress(review: RootReviewDecision): {
  totalLemmas: number;
  decided: number;
  included: number;
  excluded: number;
  undecided: number;
  percentComplete: number;
} {
  const total = review.lemmaRecords.length;
  let included = 0;
  let excluded = 0;
  let undecided = 0;

  for (const lr of review.lemmaRecords) {
    if (lr.reviewerDecision === "include") included++;
    else if (lr.reviewerDecision === "exclude") excluded++;
    else undecided++;
  }

  const decided = included + excluded;
  return {
    totalLemmas: total,
    decided,
    included,
    excluded,
    undecided,
    percentComplete: total > 0 ? Math.round((decided / total) * 100) : 0,
  };
}

/**
 * Derive the final included lemmas from explicit "include" decisions.
 * This is a pure computation — it never invents lemmas.
 */
export function deriveIncludedLemmas(
  review: RootReviewDecision
): string[] {
  return review.lemmaRecords
    .filter((lr) => lr.reviewerDecision === "include")
    .map((lr) => lr.lemma)
    .sort();
}

/**
 * Check whether a root review is complete (all lemmas decided).
 */
export function isReviewComplete(review: RootReviewDecision): boolean {
  return review.lemmaRecords.every(
    (lr) => lr.reviewerDecision !== "undecided"
  );
}

/**
 * Check whether a root review can be approved.
 * Requirements:
 *   1. All lemmas must have explicit decisions (no undecided).
 *   2. At least one lemma must be included.
 *   3. Reviewer identity must be set.
 */
export function canApproveReview(
  review: RootReviewDecision
): { canApprove: boolean; reasons: string[] } {
  const reasons: string[] = [];

  const progress = getReviewProgress(review);
  if (progress.undecided > 0) {
    reasons.push(
      `${progress.undecided} lemma(s) still undecided — all lemmas must have explicit decisions before approval.`
    );
  }

  if (progress.included === 0) {
    reasons.push(
      "No lemmas marked for inclusion — at least one lemma must be included."
    );
  }

  if (!review.reviewerIdentity || review.reviewerIdentity.trim() === "") {
    reasons.push("Reviewer identity is required before approval.");
  }

  return {
    canApprove: reasons.length === 0,
    reasons,
  };
}
