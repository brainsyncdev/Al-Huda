// Learning path types — structured curriculum for guided Quran study.
//
// Mirrors the topic system's provenance model: every path and step carries
// editorial metadata (curator, review status, date) so nothing is presented
// as authoritative without transparent sourcing.
//
// LOCAL-FIRST: progress is stored in localStorage. No accounts, no sync.

import type { AyahRef } from "../quran/types";

/** Who this path is designed for. Maps to onboarding goal selection. */
export type TargetAudience =
  | "new-muslim"
  | "regular-reader"
  | "student"
  | "explorer";

/**
 * One step in a learning path. Each step anchors to a specific ayah and
 * provides an objective (what the learner should understand) plus an optional
 * reflection prompt (a question to consider).
 *
 * The objective is neutral and descriptive — never interpretive or preachy.
 * Same rule as TopicRelation.rationale.
 */
export interface PathStep {
  /** Ordinal position in the path (1-indexed for display). */
  order: number;
  /** The ayah this step focuses on. */
  ref: AyahRef;
  /** Optional anchor to a curated topic for additional context. */
  topicSlug?: string;
  /** What the learner should understand after this step. Neutral, descriptive. */
  objective: string;
  /** Optional question for personal reflection. Not prescriptive. */
  reflectionPrompt?: string;
  /** Per-step provenance override (inherits from path if absent). */
  provenance?: ProvenanceRecord;
}

/**
 * A curated learning path: a sequenced collection of steps designed for a
 * specific audience and learning goal.
 */
export interface LearningPath {
  /** Stable URL slug, e.g. "first-steps". */
  slug: string;
  /** BCP 47 language tag. Stamped centrally to avoid drift. */
  language: "en";
  /** Display title. */
  title: string;
  /** Arabic title for display alongside English. */
  arabicTitle: string;
  /** One-paragraph summary of what this path covers. */
  summary: string;
  /** Who this path is designed for. */
  targetAudience: TargetAudience;
  /** Sibling path slugs for "related paths" links. */
  related: string[];
  /** Ordered steps. Always at least one. */
  steps: PathStep[];
  /** Editorial provenance for the path as a whole. */
  provenance: ProvenanceRecord;
}

/**
 * Learner's progress through a single path. Tracks which steps are complete
 * and when they started/last engaged.
 */
export interface PathProgress {
  pathSlug: string;
  /** Ordinal numbers of completed steps (matches PathStep.order). */
  completedSteps: number[];
  /** ISO timestamp when the learner first opened this path. */
  startedAt: string;
  /** ISO timestamp of most recent activity (step completion, revisit). */
  lastActivityAt: string;
}

/**
 * All learning-path-related state. Stored in localStorage under
 * "alhuda.paths.v1". Also included in the shared backup envelope.
 */
export interface PathsState {
  /** Progress per path, keyed by pathSlug. */
  progress: Record<string, PathProgress>;
  /** Learner's selected goal from onboarding (null if not yet chosen). */
  selectedGoal: TargetAudience | null;
  /** Whether the learner has completed the onboarding flow. */
  onboardingCompleted: boolean;
}

// Import provenance types from topics for consistency.
// The path system uses the same editorial metadata shape.
import type { ProvenanceRecord, ReviewStatus } from "../topics/data";
export type { ProvenanceRecord, ReviewStatus };
