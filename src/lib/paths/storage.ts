// Local persistence for learning paths (progress, onboarding state).
//
// Everything a learner writes to localStorage is treated as untrusted: the
// file may be a leftover from an older version, hand-edited, or truncated by a
// full disk. `normalizePathsState` therefore rebuilds the state field by field
// rather than casting, and drops only the entries it cannot identify. The same
// function backs backup import, so a restored file and a stored one take
// exactly the same path — there is no second, stricter validator hiding behind
// the first.
//
// FREE MODULE: no React, no network. Safe to import from client contexts and
// from the shared backup helper.

import {
  EMPTY_PATHS_STATE,
  PATHS,
  type TargetAudience,
} from "./data";
import type { PathProgress, PathsState } from "./types";

export const PATHS_STORAGE_KEY = "alhuda.paths.v1";

/**
 * Cap on stored progress entries. A learner is unlikely to engage with more
 * than a handful of paths; this prevents unbounded growth if the catalog
 * expands or data is corrupted.
 */
export const MAX_PROGRESS_ENTRIES = 100;

const AUDIENCE_IDS: readonly string[] = [
  "new-muslim",
  "regular-reader",
  "student",
  "explorer",
];

const PATH_SLUGS: readonly string[] = PATHS.map((p) => p.slug);

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asBoolean(value: unknown): boolean {
  return value === true;
}

function asInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function isValidISO(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function normalizeAudience(value: unknown): TargetAudience | null {
  const s = asString(value);
  return s !== null && AUDIENCE_IDS.includes(s)
    ? (s as TargetAudience)
    : null;
}

function normalizeProgress(value: unknown): PathProgress | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const pathSlug = asString(raw.pathSlug);
  if (pathSlug === null || !PATH_SLUGS.includes(pathSlug)) return null;

  const completedStepsRaw = raw.completedSteps;
  if (!Array.isArray(completedStepsRaw)) return null;

  const completedSteps: number[] = [];
  for (const item of completedStepsRaw) {
    const n = asInteger(item);
    if (n !== null && n >= 1) completedSteps.push(n);
  }

  const startedAt = isValidISO(raw.startedAt) ? String(raw.startedAt) : null;
  const lastActivityAt = isValidISO(raw.lastActivityAt)
    ? String(raw.lastActivityAt)
    : null;

  if (startedAt === null || lastActivityAt === null) return null;

  return {
    pathSlug,
    completedSteps: [...new Set(completedSteps)].sort((a, b) => a - b),
    startedAt,
    lastActivityAt,
  };
}

/**
 * Rebuild PathsState from arbitrary JSON, dropping malformed entries
 * individually. Used for both localStorage reads and backup imports.
 */
export function normalizePathsState(raw: unknown): PathsState {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ...EMPTY_PATHS_STATE };
  }

  const obj = raw as Record<string, unknown>;

  const progress: Record<string, PathProgress> = {};
  const progressRaw = obj.progress;
  if (typeof progressRaw === "object" && progressRaw !== null && !Array.isArray(progressRaw)) {
    const entries = Object.entries(progressRaw as Record<string, unknown>);
    for (const [, value] of entries) {
      if (Object.keys(progress).length >= MAX_PROGRESS_ENTRIES) break;
      const normalized = normalizeProgress(value);
      if (normalized !== null) {
        progress[normalized.pathSlug] = normalized;
      }
    }
  }

  const selectedGoal = normalizeAudience(obj.selectedGoal);
  const onboardingCompleted = asBoolean(obj.onboardingCompleted);

  return {
    progress,
    selectedGoal,
    onboardingCompleted,
  };
}

/** Read paths state from localStorage. Returns normalized state on any failure. */
export function readPathsState(): PathsState {
  try {
    const raw = localStorage.getItem(PATHS_STORAGE_KEY);
    if (raw === null) return { ...EMPTY_PATHS_STATE };
    return normalizePathsState(JSON.parse(raw));
  } catch {
    return { ...EMPTY_PATHS_STATE };
  }
}

/** Write paths state to localStorage. Silently ignores storage failures. */
export function writePathsState(state: PathsState): void {
  try {
    localStorage.setItem(PATHS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — state remains in memory only.
  }
}
