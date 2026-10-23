// Local persistence for reading plans.

import type { AyahRef } from "@/lib/quran/types";
import type { ReadingPlansState, ReadingTarget } from "./types";

export const READING_PLANS_STORAGE_KEY = "alhuda.reading-plans.v1";

function isValidAyahRef(value: unknown): value is AyahRef {
  return (
    typeof value === "object" &&
    value !== null &&
    "surah" in value &&
    "ayah" in value &&
    typeof (value as { surah: unknown }).surah === "number" &&
    typeof (value as { ayah: unknown }).ayah === "number"
  );
}

function normalizeTarget(value: unknown): ReadingTarget | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const id = typeof raw.id === "string" ? raw.id : null;
  const label = typeof raw.label === "string" ? raw.label : null;
  const start = isValidAyahRef(raw.start) ? raw.start : null;
  const end = isValidAyahRef(raw.end) ? raw.end : null;
  const goalPerSession = typeof raw.goalPerSession === "number" ? raw.goalPerSession : null;
  const createdAt = typeof raw.createdAt === "string" ? raw.createdAt : null;
  const lastActivityAt = raw.lastActivityAt === null || typeof raw.lastActivityAt === "string" ? raw.lastActivityAt : null;
  const currentPosition = isValidAyahRef(raw.currentPosition) ? raw.currentPosition : null;
  const paused = typeof raw.paused === "boolean" ? raw.paused : false;

  if (!id || !label || !start || !end || !goalPerSession || !createdAt || !currentPosition) {
    return null;
  }

  return {
    id,
    label,
    start,
    end,
    goalPerSession,
    createdAt,
    lastActivityAt,
    currentPosition,
    paused,
  };
}

export function normalizeReadingPlansState(raw: unknown): ReadingPlansState {
  if (typeof raw !== "object" || raw === null) {
    return { targets: [] };
  }

  const obj = raw as Record<string, unknown>;
  const targets: ReadingTarget[] = [];

  if (Array.isArray(obj.targets)) {
    for (const item of obj.targets) {
      const normalized = normalizeTarget(item);
      if (normalized) targets.push(normalized);
    }
  }

  return { targets };
}

export function readReadingPlansState(): ReadingPlansState {
  try {
    const raw = localStorage.getItem(READING_PLANS_STORAGE_KEY);
    if (raw === null) return { targets: [] };
    return normalizeReadingPlansState(JSON.parse(raw));
  } catch {
    return { targets: [] };
  }
}

export function writeReadingPlansState(state: ReadingPlansState): void {
  try {
    localStorage.setItem(READING_PLANS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable.
  }
}
