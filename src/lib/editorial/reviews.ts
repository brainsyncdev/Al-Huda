// Editorial review log (FR-072, FR-073, FR-075).
//
// Reads the review log from content/editorial/reviews.json and exports typed
// helpers for the /editorial page. The log tracks review status for topics,
// sources, and features. Each entry records who reviewed it, when, and how.
//
// The log is maintained by editors through a git-based workflow (see
// docs/EDITORIAL.md). Decap CMS scaffolding is provided in public/admin/ for
// editors who prefer a web UI, but the JSON file is the source of truth.

import reviewsData from "../../../content/editorial/reviews.json";

export type ReviewSubjectType = "topic" | "source" | "feature";
export type ReviewStatus = "pending-scholarly-review" | "editorial-approved";

export interface EditorialReview {
  id: string;
  subjectType: ReviewSubjectType;
  subjectId: string;
  status: ReviewStatus;
  curator: string;
  method: string;
  reviewedAt: string;
  notes: string;
}

interface ReviewsFile {
  $schema?: string;
  version: string;
  lastUpdated: string;
  reviews: EditorialReview[];
}

const data = reviewsData as ReviewsFile;

/** All review entries. */
export const REVIEWS: EditorialReview[] = data.reviews;

/** Last time the review log was updated (ISO date). */
export const REVIEWS_LAST_UPDATED: string = data.lastUpdated;

/** Review log version. */
export const REVIEWS_VERSION: string = data.version;

/** Get a review by ID. */
export function getReview(id: string): EditorialReview | undefined {
  return REVIEWS.find((r) => r.id === id);
}

/** Get all reviews for a given subject type. */
export function getReviewsByType(type: ReviewSubjectType): EditorialReview[] {
  return REVIEWS.filter((r) => r.subjectType === type);
}

/** Get the review for a specific subject (e.g. topic slug, source ID). */
export function getReviewForSubject(
  type: ReviewSubjectType,
  subjectId: string
): EditorialReview | undefined {
  return REVIEWS.find(
    (r) => r.subjectType === type && r.subjectId === subjectId
  );
}

/** Count reviews by status. */
export function countByStatus(): Record<ReviewStatus, number> {
  const counts: Record<ReviewStatus, number> = {
    "pending-scholarly-review": 0,
    "editorial-approved": 0,
  };
  for (const r of REVIEWS) {
    counts[r.status]++;
  }
  return counts;
}
