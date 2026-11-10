// Local persistence for the personal library (bookmarks, notes, progress,
// collections), with validation.
//
// Everything a learner writes to localStorage is treated as untrusted: the
// file may be a leftover from an older version, hand-edited, or truncated by a
// full disk. `normalizeLibraryState` therefore rebuilds the state field by
// field rather than casting, and drops only the entries it cannot identify.
// The same function backs backup import, so a restored file and a stored one
// take exactly the same path — there is no second, stricter validator hiding
// behind the first.
//
// FREE MODULE: no React, no network. Safe to import from client contexts and
// from the shared backup helper.

export interface Bookmark {
  surah: number;
  ayah: number;
  /** ISO timestamp */
  savedAt: string;
}

export interface Note {
  id: string;
  surah: number;
  ayah: number;
  text: string;
  /** User-defined labels for organizing private notes. Local-only, never uploaded. */
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProgressEntry {
  surah: number;
  ayah: number;
  at: string;
}

/** Sprint 51: A user-created collection of saved ayat. */
export interface Collection {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/** Sprint 51: Membership of an ayah in a collection. */
export interface CollectionAyah {
  id: string;
  collectionId: string;
  surah: number;
  ayah: number;
  createdAt: string;
}

export interface LibraryState {
  bookmarks: Bookmark[];
  notes: Note[];
  progress: ProgressEntry[];
  collections: Collection[];
  collectionAyat: CollectionAyah[];
}

export const EMPTY_LIBRARY_STATE: LibraryState = {
  bookmarks: [],
  notes: [],
  progress: [],
  collections: [],
  collectionAyat: [],
};

export const LIBRARY_STORAGE_KEY = "alhuda.library.v1";

/** Normalized tags follow the same rules `saveNote` applies to typed input. */
export function normalizeTags(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return Array.from(
    new Set(
      raw
        .filter((t): t is string => typeof t === "string")
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean)
    )
  ).slice(0, 10);
}

/**
 * Rebuild a library state from arbitrary parsed JSON — the stored value or a
 * restored backup file, both untrusted. Every list is checked for being an
 * array, and each entry keeps only the fields this build understands, so a
 * partial or hand-edited payload can never surface as a half-formed note or
 * bookmark. Malformed entries are dropped individually, never wholesale.
 */
export function normalizeLibraryState(raw: unknown): LibraryState {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) {
    return EMPTY_LIBRARY_STATE;
  }
  const parsed = raw as Record<string, unknown>;

  const bookmarks: Bookmark[] = [];
  if (Array.isArray(parsed.bookmarks)) {
    for (const item of parsed.bookmarks) {
      if (typeof item !== "object" || item === null) continue;
      const b = item as Record<string, unknown>;
      if (!Number.isInteger(b.surah) || !Number.isInteger(b.ayah)) continue;
      bookmarks.push({
        surah: b.surah as number,
        ayah: b.ayah as number,
        savedAt: typeof b.savedAt === "string" ? b.savedAt : "",
      });
    }
  }

  const notes: Note[] = [];
  if (Array.isArray(parsed.notes)) {
    for (const item of parsed.notes) {
      if (typeof item !== "object" || item === null) continue;
      const n = item as Record<string, unknown>;
      if (!Number.isInteger(n.surah) || !Number.isInteger(n.ayah)) continue;
      if (typeof n.text !== "string") continue;
      const surah = n.surah as number;
      const ayah = n.ayah as number;
      const updatedAt = typeof n.updatedAt === "string" ? n.updatedAt : "";
      notes.push({
        // An absent id is rebuilt from the verse identity rather than invented.
        id:
          typeof n.id === "string" && n.id ? n.id : `${surah}:${ayah}:${updatedAt}`,
        surah,
        ayah,
        text: n.text,
        tags: normalizeTags(n.tags),
        createdAt: typeof n.createdAt === "string" ? n.createdAt : "",
        updatedAt,
      });
    }
  }

  const progress: ProgressEntry[] = [];
  if (Array.isArray(parsed.progress)) {
    for (const item of parsed.progress) {
      if (typeof item !== "object" || item === null) continue;
      const p = item as Record<string, unknown>;
      if (!Number.isInteger(p.surah) || !Number.isInteger(p.ayah)) continue;
      progress.push({
        surah: p.surah as number,
        ayah: p.ayah as number,
        at: typeof p.at === "string" ? p.at : "",
      });
    }
  }

  const collections: Collection[] = [];
  if (Array.isArray(parsed.collections)) {
    for (const item of parsed.collections) {
      if (typeof item !== "object" || item === null) continue;
      const c = item as Record<string, unknown>;
      if (typeof c.id !== "string" || !c.id) continue;
      if (typeof c.name !== "string" || !c.name.trim()) continue;
      collections.push({
        id: c.id,
        name: c.name.trim(),
        createdAt: typeof c.createdAt === "string" ? c.createdAt : "",
        updatedAt: typeof c.updatedAt === "string" ? c.updatedAt : "",
      });
    }
  }

  const collectionAyat: CollectionAyah[] = [];
  if (Array.isArray(parsed.collectionAyat)) {
    for (const item of parsed.collectionAyat) {
      if (typeof item !== "object" || item === null) continue;
      const ca = item as Record<string, unknown>;
      if (typeof ca.id !== "string" || !ca.id) continue;
      if (typeof ca.collectionId !== "string" || !ca.collectionId) continue;
      if (!Number.isInteger(ca.surah) || !Number.isInteger(ca.ayah)) continue;
      collectionAyat.push({
        id: ca.id,
        collectionId: ca.collectionId,
        surah: ca.surah as number,
        ayah: ca.ayah as number,
        createdAt: typeof ca.createdAt === "string" ? ca.createdAt : "",
      });
    }
  }

  return { bookmarks, notes, progress, collections, collectionAyat };
}
