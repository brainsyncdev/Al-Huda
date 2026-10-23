// Reading plan types — user-defined targets for systematic Quran reading.
//
// Separate from revision (spaced repetition) and learning paths (curated
// sequences). Reading plans track which surahs/ayat the learner wants to read
// and their progress through those targets.

import type { AyahRef } from "@/lib/quran/types";

/** A single reading target within a plan. */
export interface ReadingTarget {
  /** Unique id for this target. */
  id: string;
  /** Human-readable label (e.g., "Surah Al-Baqarah", "Juz 1-5"). */
  label: string;
  /** Start reference. */
  start: AyahRef;
  /** End reference (inclusive). */
  end: AyahRef;
  /** Daily or weekly goal (number of ayat to read per session). */
  goalPerSession: number;
  /** When the plan was created. */
  createdAt: string;
  /** Last activity timestamp. */
  lastActivityAt: string | null;
  /** Current position (next ayah to read). */
  currentPosition: AyahRef;
  /** Whether the plan is paused. */
  paused: boolean;
}

/** All reading plans stored in localStorage. */
export interface ReadingPlansState {
  targets: ReadingTarget[];
}
