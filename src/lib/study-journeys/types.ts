// Study journey types — structured, dimension-targeted learning experiences.
//
// Unlike learning paths (which are audience-targeted), study journeys are
// organized around dimensions of Quranic guidance. They have stages that can
// reference topics (not just individual ayahs), version tracking, and
// prerequisites.
//
// LOCAL-FIRST: progress is stored in localStorage. No accounts, no sync.

import type { AyahRef } from "../quran/types";
import type { ProvenanceRecord, ReviewStatus } from "../topics/data";

export type { ProvenanceRecord, ReviewStatus };

/** Difficulty level for a journey. */
export type JourneyDifficulty = "beginner" | "intermediate" | "advanced";

/**
 * One stage in a study journey. A stage can reference either a specific ayah
 * or a curated topic (which itself contains multiple ayat).
 */
export interface JourneyStage {
  /** Ordinal position in the journey (1-indexed for display). */
  order: number;
  /** Display title for this stage. */
  title: string;
  /** If present, this stage focuses on a specific ayah. */
  ref?: AyahRef;
  /** If present, this stage focuses on a curated topic. */
  topicSlug?: string;
  /** What the learner should understand after this stage. Neutral, descriptive. */
  objective: string;
  /** Optional question for personal reflection. Not prescriptive. */
  reflectionPrompt?: string;
  /** Per-stage provenance override (inherits from journey if absent). */
  provenance?: ProvenanceRecord;
}

/**
 * A curated study journey: a sequenced collection of stages organized around
 * a dimension of Quranic guidance.
 */
export interface StudyJourney {
  /** Stable URL slug, e.g. "understanding-tawheed". */
  slug: string;
  /** BCP 47 language tag. */
  language: "en";
  /** Display title. */
  title: string;
  /** Arabic title for display alongside English. */
  arabicTitle: string;
  /** One-paragraph summary of what this journey covers. */
  summary: string;
  /** Which dimension this journey belongs to. */
  dimensionId: string;
  /** Difficulty level. */
  difficulty: JourneyDifficulty;
  /** Estimated duration in minutes (if evidence-backed). */
  estimatedMinutes?: number;
  /** Ordered stages. Always at least one. */
  stages: JourneyStage[];
  /** Journey slugs that should be completed before this one (optional). */
  prerequisites: string[];
  /** Editorial provenance for the journey as a whole. */
  provenance: ProvenanceRecord;
  /** Version number for editorial changes. Increment when stages change. */
  version: number;
}

/**
 * Learner's progress through a single journey. Tracks which stages are complete
 * and when they started/last engaged.
 */
export interface JourneyProgress {
  journeySlug: string;
  /** Ordinal numbers of completed stages (matches JourneyStage.order). */
  completedStages: number[];
  /** ISO timestamp when the learner first opened this journey. */
  startedAt: string;
  /** ISO timestamp of most recent activity. */
  lastActivityAt: string;
  /** Version of the journey when progress was last updated. */
  journeyVersion: number;
}

/**
 * All study-journey-related state. Stored in localStorage under
 * "alhuda.journeys.v1". Also included in the shared backup envelope.
 */
export interface JourneysState {
  /** Progress per journey, keyed by journeySlug. */
  progress: Record<string, JourneyProgress>;
}
