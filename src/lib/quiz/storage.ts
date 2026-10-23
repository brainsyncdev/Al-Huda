// Local persistence for quiz attempts.
//
// Everything a learner writes to localStorage is treated as untrusted: the
// file may be a leftover from an older version, hand-edited, or truncated by a
// full disk. `normalizeQuizState` therefore rebuilds the state field by field
// rather than casting, and drops only the entries it cannot identify.
//
// FREE MODULE: no React, no network. Safe to import from client contexts and
// from the shared backup helper.

import type { QuizAttempt, QuizState } from "./types";

export const QUIZ_STORAGE_KEY = "alhuda.quiz.v1";

/**
 * Cap on stored attempts. A learner is unlikely to keep more than a few dozen;
 * this prevents unbounded growth.
 */
export const MAX_ATTEMPTS = 200;

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function isValidISO(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

function normalizeAttempt(value: unknown): QuizAttempt | null {
  if (typeof value !== "object" || value === null) return null;
  const raw = value as Record<string, unknown>;

  const id = asString(raw.id);
  if (id === null) return null;

  const startedAt = isValidISO(raw.startedAt) ? String(raw.startedAt) : null;
  if (startedAt === null) return null;

  const completedAt =
    raw.completedAt === null || raw.completedAt === undefined
      ? null
      : isValidISO(raw.completedAt)
      ? String(raw.completedAt)
      : null;

  // Questions and responses are opaque to the normalizer — we trust the
  // structure the generator wrote, since the generator is the only writer.
  // A malformed attempt is dropped entirely rather than partially restored.
  const questions = Array.isArray(raw.questions) ? raw.questions : null;
  const responses =
    typeof raw.responses === "object" && raw.responses !== null
      ? (raw.responses as Record<string, unknown>)
      : null;

  if (questions === null || responses === null) return null;

  return {
    id,
    startedAt,
    completedAt,
    questions: questions as QuizAttempt["questions"],
    responses: responses as QuizAttempt["responses"],
  };
}

/**
 * Rebuild QuizState from arbitrary JSON, dropping malformed entries
 * individually. Used for both localStorage reads and backup imports.
 */
export function normalizeQuizState(raw: unknown): QuizState {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return { attempts: [], currentAttemptId: null };
  }

  const obj = raw as Record<string, unknown>;
  const attempts: QuizAttempt[] = [];

  if (Array.isArray(obj.attempts)) {
    for (const item of obj.attempts) {
      if (attempts.length >= MAX_ATTEMPTS) break;
      const normalized = normalizeAttempt(item);
      if (normalized !== null) {
        attempts.push(normalized);
      }
    }
  }

  const currentAttemptId =
    typeof obj.currentAttemptId === "string" ? obj.currentAttemptId : null;

  return { attempts, currentAttemptId };
}

/** Read quiz state from localStorage. Returns normalized state on any failure. */
export function readQuizState(): QuizState {
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (raw === null) return { attempts: [], currentAttemptId: null };
    return normalizeQuizState(JSON.parse(raw));
  } catch {
    return { attempts: [], currentAttemptId: null };
  }
}

/** Write quiz state to localStorage. Silently ignores storage failures. */
export function writeQuizState(state: QuizState): void {
  try {
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — state remains in memory only.
  }
}
