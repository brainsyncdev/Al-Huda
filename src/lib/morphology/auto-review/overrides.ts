// Sprint 47 — Reviewer Override Support
//
// Allows human reviewers to override automated outcomes in exceptional cases.
// An override may:
//   - Accept a mapping flagged for review.
//   - Reject a mapping with documented evidence.
//   - Restore a previously overridden decision.
//
// Every override preserves:
//   - Previous automated outcome.
//   - New decision.
//   - Reviewer identity (real name or role, never "AI").
//   - Reason.
//   - Timestamp.
//
// Overrides do NOT alter source morphology. They only change the effective
// outcome used by the activation engine.

import type {
  AutoReviewOutcome,
  ReviewerOverride,
} from "./types";

/**
 * Validate that an override is well-formed.
 */
export function validateOverride(override: ReviewerOverride): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  const validOutcomes: AutoReviewOutcome[] = ["auto-accepted", "needs-review", "rejected"];
  if (!validOutcomes.includes(override.previousOutcome)) {
    errors.push(`Invalid previousOutcome: "${override.previousOutcome}"`);
  }
  if (!validOutcomes.includes(override.newOutcome)) {
    errors.push(`Invalid newOutcome: "${override.newOutcome}"`);
  }
  if (!override.reviewerIdentity || override.reviewerIdentity.trim().length === 0) {
    errors.push("Reviewer identity is required.");
  }
  if (override.reviewerIdentity.trim().toLowerCase() === "ai") {
    errors.push('Reviewer identity cannot be "AI". Overrides must be made by a human.');
  }
  if (!override.reason || override.reason.trim().length === 0) {
    errors.push("A reason for the override is required.");
  }
  if (!override.overriddenAt || override.overriddenAt.trim().length === 0) {
    errors.push("Override timestamp is required.");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Create a reviewer override record.
 */
export function createOverride(
  previousOutcome: AutoReviewOutcome,
  newOutcome: AutoReviewOutcome,
  reviewerIdentity: string,
  reason: string
): ReviewerOverride {
  return {
    previousOutcome,
    newOutcome,
    reviewerIdentity: reviewerIdentity.trim(),
    reason: reason.trim(),
    overriddenAt: new Date().toISOString(),
  };
}

/**
 * Determine the effective outcome for a lemma, considering overrides.
 *
 * If a reviewer override exists, the override's newOutcome takes precedence.
 * Otherwise, the automated outcome is used.
 */
export function getEffectiveOutcome(
  automatedOutcome: AutoReviewOutcome,
  override: ReviewerOverride | null
): AutoReviewOutcome {
  if (override) {
    return override.newOutcome;
  }
  return automatedOutcome;
}

/**
 * Check whether a lemma is eligible for activation based on its effective outcome.
 *
 * Only "auto-accepted" mappings (or those overridden to "auto-accepted" by a
 * reviewer) can be activated automatically.
 */
export function isEligibleForActivation(
  automatedOutcome: AutoReviewOutcome,
  override: ReviewerOverride | null
): boolean {
  const effective = getEffectiveOutcome(automatedOutcome, override);
  return effective === "auto-accepted";
}
