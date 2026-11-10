// Three-dimension quality model for Al-Huda content.
//
// Sprint 54 establishes three independent quality dimensions:
// 1. Technical Integrity — structural and technical validity
// 2. Editorial Completeness — presence of required editorial information
// 3. Scholarly Review — actual scholarly review status
//
// These dimensions are independent. Passing technical validation does not
// automatically change editorial status. Editorial completeness does not
// automatically change scholarly status.

/**
 * Dimension 1: Technical Integrity
 * Determines whether data is structurally and technically valid.
 */
export type TechnicalIntegrityStatus = "passed" | "failed" | "not_checked";

export interface TechnicalIntegrityResult {
  status: TechnicalIntegrityStatus;
  /** Specific technical issues found (empty if passed). */
  issues: TechnicalIssue[];
  /** ISO timestamp when validation was performed. */
  validatedAt?: string;
}

export interface TechnicalIssue {
  type: "invalid_reference" | "duplicate_reference" | "missing_required_field" | "invalid_relationship";
  severity: "error" | "warning";
  message: string;
  field?: string;
}

/**
 * Dimension 2: Editorial Completeness
 * Determines whether necessary editorial information exists.
 */
export type EditorialCompletenessStatus = "complete" | "incomplete" | "needs_review" | "not_applicable";

export interface EditorialCompletenessResult {
  status: EditorialCompletenessStatus;
  /** Missing or incomplete editorial elements. */
  missingElements: EditorialElement[];
  /** Percentage of required elements present (0-100). */
  completenessScore: number;
}

export interface EditorialElement {
  element: string;
  status: "present" | "missing" | "incomplete";
  description?: string;
}

/**
 * Dimension 3: Scholarly Review
 * Determines whether appropriate scholarly review has occurred.
 */
export type ScholarlyReviewStatus = "pending" | "in_review" | "reviewed" | "revision_requested";

export interface ScholarlyReviewResult {
  status: ScholarlyReviewStatus;
  /** Evidence of review (only when status is "reviewed"). */
  reviewEvidence?: ReviewEvidence;
  /** Notes about review status. */
  notes?: string;
}

export interface ReviewEvidence {
  reviewer?: string; // only when verified
  reviewDate?: string; // ISO date, only when real
  reviewMethod?: string;
  findings?: string;
}

/**
 * Combined quality state for a content entity (topic, journey, etc.).
 */
export interface QualityState {
  entityId: string;
  entityType: "topic" | "journey" | "stage" | "dimension" | "domain";
  technicalIntegrity: TechnicalIntegrityResult;
  editorialCompleteness: EditorialCompletenessResult;
  scholarlyReview: ScholarlyReviewResult;
  /** ISO timestamp when quality state was last updated. */
  lastUpdated: string;
}

/**
 * Quality summary for dashboard display.
 */
export interface QualitySummary {
  totalEntities: number;
  technicalIntegrity: {
    passed: number;
    failed: number;
    notChecked: number;
  };
  editorialCompleteness: {
    complete: number;
    incomplete: number;
    needsReview: number;
    notApplicable: number;
  };
  scholarlyReview: {
    pending: number;
    inReview: number;
    reviewed: number;
    revisionRequested: number;
  };
}
