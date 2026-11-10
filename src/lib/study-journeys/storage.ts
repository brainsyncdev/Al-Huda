// Local persistence for study journeys (progress tracking).
//
// Everything a learner writes to localStorage is treated as untrusted: the
// file may be a leftover from an older version, hand-edited, or truncated by a
// full disk. `normalizeJourneysState` therefore rebuilds the state field by
// field rather than casting, and drops only the entries it cannot identify.
// The same function backs backup import, so a restored file and a stored one
// take exactly the same path — there is no second, stricter validator hiding
// behind the first.
//
// FREE MODULE: no React, no network. Safe to import from client contexts and
// from the shared backup helper.

import { EMPTY_JOURNEYS_STATE, JOURNEYS } from "./data";
import type { JourneyProgress, JourneysState } from "./types";

export const JOURNEYS_STORAGE_KEY = "alhuda.journeys.v1";

/**
 * Cap on stored progress entries. A learner is unlikely to engage with more
 * than a handful of journeys; this prevents unbounded growth if the catalog
 * expands or data is corrupted.
 */
export const MAX_PROGRESS_ENTRIES = 100;

const JOURNEY_SLUGS: readonly string[] = JOURNEYS.map((j) => j.slug);

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function asInteger(value: unknown): number | null {
  return typeof value === "number" && Number.isInteger(value) ? value : null;
}

function isValidISO(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function normalizeProgress(value: unknown): JourneyProgress | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const journeySlug = asString(raw.journeySlug);
  if (journeySlug === null || !JOURNEY_SLUGS.includes(journeySlug)) return null;

  const completedStagesRaw = raw.completedStages;
  if (!Array.isArray(completedStagesRaw)) return null;

  const completedStages: number[] = [];
  for (const item of completedStagesRaw) {
    const n = asInteger(item);
    if (n !== null && n >= 1) completedStages.push(n);
  }

  const startedAt = isValidISO(raw.startedAt) ? String(raw.startedAt) : null;
  const lastActivityAt = isValidISO(raw.lastActivityAt)
    ? String(raw.lastActivityAt)
    : null;
  const journeyVersion = asInteger(raw.journeyVersion);

  if (startedAt === null || lastActivityAt === null || journeyVersion === null) {
    return null;
  }

  return {
    journeySlug,
    completedStages: [...new Set(completedStages)].sort((a, b) => a - b),
    startedAt,
    lastActivityAt,
    journeyVersion,
  };
}

/**
 * Rebuild JourneysState from arbitrary JSON, dropping malformed entries
 * individually. Used for both localStorage reads and backup imports.
 */
export function normalizeJourneysState(raw: unknown): JourneysState {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { ...EMPTY_JOURNEYS_STATE };
  }

  const obj = raw as Record<string, unknown>;

  const progress: Record<string, JourneyProgress> = {};
  const progressRaw = obj.progress;
  if (
    typeof progressRaw === "object" &&
    progressRaw !== null &&
    !Array.isArray(progressRaw)
  ) {
    const entries = Object.entries(progressRaw as Record<string, unknown>);
    for (const [, value] of entries) {
      if (Object.keys(progress).length >= MAX_PROGRESS_ENTRIES) break;
      const normalized = normalizeProgress(value);
      if (normalized !== null) {
        progress[normalized.journeySlug] = normalized;
      }
    }
  }

  return {
    progress,
  };
}

/** Read journeys state from localStorage. Returns normalized state on any failure. */
export function readJourneysState(): JourneysState {
  try {
    const raw = localStorage.getItem(JOURNEYS_STORAGE_KEY);
    if (raw === null) return { ...EMPTY_JOURNEYS_STATE };
    return normalizeJourneysState(JSON.parse(raw));
  } catch {
    return { ...EMPTY_JOURNEYS_STATE };
  }
}

/** Write journeys state to localStorage. Silently ignores storage failures. */
export function writeJourneysState(state: JourneysState): void {
  try {
    localStorage.setItem(JOURNEYS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — state remains in memory only.
  }
}
