// Local persistence for personal reflections (Sprint 53).
//
// Everything stored in localStorage is treated as untrusted: the data may be
// from an older version, hand-edited, or corrupted. `normalizeReflectionsState`
// rebuilds the state field by field rather than casting, dropping only entries
// that cannot be validated. The same function backs backup import, so a
// restored file and a stored one take exactly the same validation path.
//
// FREE MODULE: no React, no network. Safe to import from client contexts and
// from the shared backup helper.

import type { Reflection, ReflectionsState, ReflectionTargetType } from "./types";

export const REFLECTIONS_STORAGE_KEY = "alhuda.reflections.v1";

export const EMPTY_REFLECTIONS_STATE: ReflectionsState = {
  version: 1,
  reflections: [],
};

const VALID_TARGET_TYPES: readonly ReflectionTargetType[] = [
  "ayah",
  "topic",
  "journey-stage",
];

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isValidIsoDate(value: string): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

function isValidTargetType(value: unknown): value is ReflectionTargetType {
  return typeof value === "string" && VALID_TARGET_TYPES.includes(value as ReflectionTargetType);
}

function normalizeReflection(value: unknown): Reflection | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const id = asString(raw.id);
  const targetType = raw.targetType;
  const targetRef = asString(raw.targetRef);
  const content = asString(raw.content);
  const createdAt = asString(raw.createdAt);
  const updatedAt = asString(raw.updatedAt);

  // Identity and content are mandatory: a reflection without them cannot be
  // displayed or edited, so it is dropped rather than guessed at.
  if (!id || !targetRef || !content) return null;
  if (!isValidTargetType(targetType)) return null;
  if (!createdAt || !updatedAt) return null;
  if (!isValidIsoDate(createdAt) || !isValidIsoDate(updatedAt)) return null;

  return {
    id,
    targetType,
    targetRef,
    content,
    createdAt,
    updatedAt,
  };
}

/**
 * Rebuild a reflections state from arbitrary parsed JSON.
 *
 * Per-reflection failures are isolated: one malformed entry never discards the
 * rest of the collection. The result is always a structurally complete state,
 * so callers can assign it directly with no fallback branch.
 */
export function normalizeReflectionsState(raw: unknown): ReflectionsState {
  if (typeof raw !== "object" || raw === null) {
    return { ...EMPTY_REFLECTIONS_STATE };
  }

  const source = raw as Record<string, unknown>;

  // Version field is currently always 1; future migrations will handle upgrades.
  const version = typeof source.version === "number" && source.version === 1 ? 1 : 1;

  const reflections: Reflection[] = [];
  if (Array.isArray(source.reflections)) {
    for (const value of source.reflections) {
      const reflection = normalizeReflection(value);
      if (reflection) reflections.push(reflection);
    }
  }

  return {
    version,
    reflections,
  };
}

/** Read the stored reflections. Returns the empty state on any failure. */
export function readReflectionsState(): ReflectionsState {
  if (typeof window === "undefined") {
    return { ...EMPTY_REFLECTIONS_STATE };
  }
  try {
    const raw = window.localStorage.getItem(REFLECTIONS_STORAGE_KEY);
    if (!raw) return { ...EMPTY_REFLECTIONS_STATE };
    return normalizeReflectionsState(JSON.parse(raw));
  } catch {
    return { ...EMPTY_REFLECTIONS_STATE };
  }
}

/** Write the reflections to localStorage. Storage failures are silent. */
export function writeReflectionsState(state: ReflectionsState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(REFLECTIONS_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Full or unavailable storage: the UI keeps working in memory, which is the
    // same degradation other providers already accept.
  }
}
