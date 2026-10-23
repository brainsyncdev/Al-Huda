// Shared backup envelope for every local store (FR-043).
//
// One file, both stores. The library page used to export its own
// `{ version: 1, library }` shape, and the revision plan was written after
// that copy shipped promising survival in "your backup" — a promise that stays
// false as long as the two stores have separate exporters. This module is the
// single writer and the single reader, so a new store cannot quietly be left
// out of one of them again.
//
// PARSE IS TOTAL: every rejection returns an error string, never a throw, so
// the caller can show a calm inline message and leave the device untouched.
// Nothing on disk is modified until the caller has confirmed the restore.
//
// CLIENT-SIDE ONLY. The store modules it imports are "use client" contexts and
// plain storage helpers, all reachable from client components.

import {
  normalizeLibraryState,
  type LibraryState,
} from "@/lib/library/context";
import { DEFAULT_PREFS, normalizePrefs, type Prefs } from "@/lib/prefs/context";
import { normalizeRevisionState } from "@/lib/revision/storage";
import { EMPTY_REVISION_STATE, type RevisionState } from "@/lib/revision/scheduling";
import { normalizePathsState } from "@/lib/paths/storage";
import type { PathsState } from "@/lib/paths/types";
import { EMPTY_PATHS_STATE } from "@/lib/paths/data";
import { normalizeQuizState } from "@/lib/quiz/storage";
import type { QuizState } from "@/lib/quiz/types";
import { normalizeReadingPlansState } from "@/lib/reading-plans/storage";
import type { ReadingPlansState } from "@/lib/reading-plans/types";

export const BACKUP_FORMAT = "al-huda-backup";
export const BACKUP_VERSION = 6;
export const BACKUP_APP = "Al-Huda";

/** Empty quiz state, used when restoring a legacy backup that had no quiz. */
const EMPTY_QUIZ_STATE: QuizState = { attempts: [], currentAttemptId: null };

/** Empty reading plans state. */
const EMPTY_READING_PLANS_STATE: ReadingPlansState = { targets: [] };

/**
 * Read cap checked before JSON.parse. A real backup is a few kilobytes;
 * anything approaching this is not an Al-Huda export, and parsing it would be
 * a way to make the browser allocate far beyond what a legitimate file needs.
 */
export const MAX_BACKUP_CHARS = 5 * 1024 * 1024;

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  /** Envelope version, independent of any store's own schema version. */
  version: typeof BACKUP_VERSION;
  app: typeof BACKUP_APP;
  exportedAt: string;
  library: LibraryState;
  revision: RevisionState;
  preferences: Prefs;
  paths: PathsState;
  quiz: QuizState;
  readingPlans: ReadingPlansState;
}

export interface RestorableBackup {
  library: LibraryState;
  revision: RevisionState;
  preferences: Prefs;
  paths: PathsState;
  quiz: QuizState;
  readingPlans: ReadingPlansState;
  /**
   * Envelope version the file actually came from. 1 is a legacy library-only
   * export; 2 added revision and preferences; 3 added paths; 4 added
   * translationId in preferences; 5 added quiz; 6 added reading plans.
   * Older versions get defaults for missing sections.
   */
  sourceVersion: 1 | 2 | 3 | 4 | 5 | 6;
  /** ISO timestamp recorded inside the file, or "" when absent. */
  exportedAt: string;
}

export type ParseBackupResult =
  | { ok: true; data: RestorableBackup }
  | { ok: false; error: string };

export interface BackupInput {
  library: LibraryState;
  revision: RevisionState;
  preferences: Prefs;
  paths: PathsState;
  quiz: QuizState;
  readingPlans: ReadingPlansState;
}

/** Build the envelope. Always contains every store, even when empty. */
export function buildBackup(
  input: BackupInput,
  now: Date = new Date()
): BackupFile {
  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    app: BACKUP_APP,
    exportedAt: now.toISOString(),
    library: input.library,
    revision: input.revision,
    preferences: input.preferences,
    paths: input.paths,
    quiz: input.quiz,
    readingPlans: input.readingPlans,
  };
}

/**
 * Parse and validate a backup file's text.
 *
 * The normalizers used here are the same ones the stores apply to
 * localStorage, so a restored file and a freshly stored value are validated
 * identically — there is no second, stricter validator hiding behind the first.
 */
export function parseBackup(text: string): ParseBackupResult {
  if (text.length > MAX_BACKUP_CHARS) {
    return {
      ok: false,
      error: `This file is larger than ${Math.round(
        MAX_BACKUP_CHARS / (1024 * 1024)
      )} MB, which no Al-Huda backup reaches. Nothing was imported.`,
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "This file is not valid JSON. Nothing was imported." };
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {
      ok: false,
      error: "This file is not an Al-Huda backup. Nothing was imported.",
    };
  }

  const file = parsed as Record<string, unknown>;
  const version = file.version;
  const exportedAt = typeof file.exportedAt === "string" ? file.exportedAt : "";

  if (file.format === BACKUP_FORMAT) {
    // v3–v6 share the same envelope shape. v4 added translationId inside
    // preferences; v5 added quiz; v6 added reading plans.
    if (version !== 3 && version !== 4 && version !== 5 && version !== 6) {
      return {
        ok: false,
        error: `This backup was written as version ${
          typeof version === "number" ? String(version) : "unknown"
        }, and this build reads versions 3–6. Nothing was imported.`,
      };
    }
    return {
      ok: true,
      data: {
        library: normalizeLibraryState(file.library),
        revision:
          file.revision === undefined
            ? EMPTY_REVISION_STATE
            : normalizeRevisionState(file.revision),
        preferences: normalizePrefs(file.preferences),
        paths: normalizePathsState(file.paths),
        quiz:
          file.quiz === undefined
            ? EMPTY_QUIZ_STATE
            : normalizeQuizState(file.quiz),
        readingPlans:
          file.readingPlans === undefined
            ? EMPTY_READING_PLANS_STATE
            : normalizeReadingPlansState(file.readingPlans),
        sourceVersion: typeof version === "number" ? (version as 3 | 4 | 5 | 6) : 6,
        exportedAt,
      },
    };
  }

  // Legacy library-only export from the pre-envelope build.
  if (version === 1 && file.library !== undefined) {
    return {
      ok: true,
      data: {
        library: normalizeLibraryState(file.library),
        revision: EMPTY_REVISION_STATE,
        preferences: DEFAULT_PREFS,
        paths: { ...EMPTY_PATHS_STATE },
        quiz: { ...EMPTY_QUIZ_STATE },
        readingPlans: { ...EMPTY_READING_PLANS_STATE },
        sourceVersion: 1,
        exportedAt,
      },
    };
  }

  return {
    ok: false,
    error:
      "This file is not an Al-Huda backup (no recognised format or version). Nothing was imported.",
  };
}

/** `al-huda-backup-YYYY-MM-DD.json`, dated in local time for the file picker. */
export function backupFileName(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `al-huda-backup-${y}-${m}-${d}.json`;
}

/** Trigger a browser download of `data` as pretty-printed JSON. */
export function downloadJson(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
