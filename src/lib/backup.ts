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

export const BACKUP_FORMAT = "al-huda-backup";
export const BACKUP_VERSION = 2;
export const BACKUP_APP = "Al-Huda";

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
}

export interface RestorableBackup {
  library: LibraryState;
  revision: RevisionState;
  preferences: Prefs;
  /**
   * Envelope version the file actually came from. 1 is a legacy library-only
   * export; the revision plan and preferences for such a file are left at
   * their defaults rather than invented.
   */
  sourceVersion: 1 | 2;
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
    if (version !== BACKUP_VERSION) {
      return {
        ok: false,
        error: `This backup was written as version ${
          typeof version === "number" ? String(version) : "unknown"
        }, and this build reads version ${BACKUP_VERSION}. Nothing was imported.`,
      };
    }
    return {
      ok: true,
      data: {
        library: normalizeLibraryState(file.library),
        // A missing section normalises to the empty store rather than failing
        // the whole file: losing a plan because one key is absent would be a
        // worse outcome than restoring the rest.
        revision:
          file.revision === undefined
            ? EMPTY_REVISION_STATE
            : normalizeRevisionState(file.revision),
        preferences: normalizePrefs(file.preferences),
        sourceVersion: 2,
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
        // Honest absence: this file never contained a revision plan, so the
        // restore leaves one empty rather than fabricating schedule entries.
        revision: EMPTY_REVISION_STATE,
        preferences: DEFAULT_PREFS,
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
