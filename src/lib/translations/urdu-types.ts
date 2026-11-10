// Urdu translation data model for topic titles.
//
// This module defines the structured record for tracking Urdu translations
// of topic titles. Each record maintains review state, provenance, and
// known limitations to ensure translations are not published without
// proper editorial review.
//
// IMPORTANT: This system does NOT auto-generate translations. All Urdu
// titles must be manually reviewed and verified by qualified translators.

/**
 * Review state for Urdu translations.
 * - missing: No translation attempted yet
 * - draft: Translation exists but needs review
 * - needs_review: Translation is ready for editorial review
 * - reviewed: Translation has been reviewed and approved
 * - published: Translation is live in the application
 */
export type UrduTranslationReviewState =
  | "missing"
  | "draft"
  | "needs_review"
  | "reviewed"
  | "published";

/**
 * Structured record for a single topic's Urdu translation.
 */
export interface UrduTranslationRecord {
  /** Topic slug (must match a topic in src/lib/topics/data.ts). */
  topicSlug: string;

  /** English title from the topic (for reference). */
  englishTitle: string;

  /** Arabic title from the topic (for reference). */
  arabicTitle: string;

  /** Proposed Urdu translation (optional until reviewed). */
  proposedUrduTitle?: string;

  /** Source of the translation (e.g., "manual translation", "scholarly reference"). */
  translationSource?: string;

  /**
   * Translator attribution (only when verified).
   * Must not be invented — only include when a real translator has been credited.
   */
  translatorAttribution?: string;

  /** Current review state of this translation. */
  reviewState: UrduTranslationReviewState;

  /** Editorial notes about the translation (optional). */
  reviewNotes?: string;

  /**
   * ISO date of last review (only when a real review occurred).
   * Must not be invented — only include when an actual review took place.
   */
  lastReviewedDate?: string;

  /** Known limitations, caveats, or scope disclosures for this translation. */
  knownLimitations: string[];
}

/**
 * Valid review states for validation purposes.
 */
export const VALID_REVIEW_STATES: UrduTranslationReviewState[] = [
  "missing",
  "draft",
  "needs_review",
  "reviewed",
  "published",
];

/**
 * Check if a string is a valid review state.
 */
export function isValidReviewState(
  state: string
): state is UrduTranslationReviewState {
  return VALID_REVIEW_STATES.includes(state as UrduTranslationReviewState);
}

/**
 * Validate a translation record.
 * Returns an array of validation errors (empty if valid).
 */
export function validateTranslationRecord(
  record: UrduTranslationRecord
): string[] {
  const errors: string[] = [];

  if (!record.topicSlug || typeof record.topicSlug !== "string") {
    errors.push("topicSlug is required and must be a string");
  }

  if (!record.englishTitle || typeof record.englishTitle !== "string") {
    errors.push("englishTitle is required and must be a string");
  }

  if (!record.arabicTitle || typeof record.arabicTitle !== "string") {
    errors.push("arabicTitle is required and must be a string");
  }

  if (!isValidReviewState(record.reviewState)) {
    errors.push(
      `reviewState must be one of: ${VALID_REVIEW_STATES.join(", ")}`
    );
  }

  if (!Array.isArray(record.knownLimitations)) {
    errors.push("knownLimitations must be an array");
  }

  // Policy: cannot be published without being reviewed first
  if (record.reviewState === "published" && !record.proposedUrduTitle) {
    errors.push("Cannot publish a translation without a proposedUrduTitle");
  }

  // Policy: translator attribution should only be present when reviewed or published
  if (
    record.translatorAttribution &&
    record.reviewState !== "reviewed" &&
    record.reviewState !== "published"
  ) {
    errors.push(
      "translatorAttribution should only be set when reviewState is 'reviewed' or 'published'"
    );
  }

  // Policy: lastReviewedDate should only be present when reviewed or published
  if (
    record.lastReviewedDate &&
    record.reviewState !== "reviewed" &&
    record.reviewState !== "published"
  ) {
    errors.push(
      "lastReviewedDate should only be set when reviewState is 'reviewed' or 'published'"
    );
  }

  return errors;
}
