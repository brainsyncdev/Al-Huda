"use client";

// Local-first personal library: bookmarks, notes, and reading progress.
// Everything is stored in this browser only (localStorage). Nothing is sent
// to a server — the MVP has no accounts and no analytics (PRD §10, §23).
// Export/import go through the shared v2 envelope in @/lib/backup, which
// carries this store together with the revision plan and reader preferences;
// Delete erases the device copy.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

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

export interface LibraryState {
  bookmarks: Bookmark[];
  notes: Note[];
  progress: ProgressEntry[];
}

export const EMPTY_LIBRARY_STATE: LibraryState = {
  bookmarks: [],
  notes: [],
  progress: [],
};

const STORAGE_KEY = "alhuda.library.v1";

/** Normalized tags follow the same rules `saveNote` applies to typed input. */
function normalizeTags(raw: unknown): string[] {
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

  return { bookmarks, notes, progress };
}

function readLibraryState(): LibraryState {
  if (typeof window === "undefined") return EMPTY_LIBRARY_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_LIBRARY_STATE;
    return normalizeLibraryState(JSON.parse(raw));
  } catch {
    return EMPTY_LIBRARY_STATE;
  }
}

function persist(state: LibraryState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable — fail silently; the UI still works in-memory.
  }
}

export interface LibraryRestoreResult {
  bookmarks: number;
  notes: number;
  progress: number;
}

interface LibraryContextValue extends LibraryState {
  isBookmarked: (surah: number, ayah: number) => boolean;
  toggleBookmark: (surah: number, ayah: number) => void;
  noteFor: (surah: number, ayah: number) => Note | undefined;
  saveNote: (
    surah: number,
    ayah: number,
    text: string,
    tags?: string[]
  ) => void;
  deleteNote: (id: string) => void;
  recordVisit: (surah: number, ayah: number) => void;
  /**
   * Replace the stored library with a parsed backup section (FR-043). The
   * payload is re-normalized here as well as in the backup parser, so no
   * caller can bypass validation.
   */
  restoreLibrary: (raw: unknown) => LibraryRestoreResult;
  /** Erase everything on this device. */
  clearAll: () => void;
  /** True once localStorage has been read (avoids hydration mismatch). */
  hydrated: boolean;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LibraryState>(EMPTY_LIBRARY_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readLibraryState());
    setHydrated(true);
  }, []);

  const update = useCallback((next: LibraryState) => {
    setState(next);
    persist(next);
  }, []);

  const value = useMemo<LibraryContextValue>(() => {
    const isBookmarked = (surah: number, ayah: number) =>
      state.bookmarks.some((b) => b.surah === surah && b.ayah === ayah);

    return {
      ...state,
      hydrated,
      isBookmarked,
      toggleBookmark: (surah, ayah) => {
        const exists = isBookmarked(surah, ayah);
        const bookmarks = exists
          ? state.bookmarks.filter((b) => !(b.surah === surah && b.ayah === ayah))
          : [...state.bookmarks, { surah, ayah, savedAt: new Date().toISOString() }];
        update({ ...state, bookmarks });
      },
      noteFor: (surah, ayah) =>
        state.notes.find((n) => n.surah === surah && n.ayah === ayah),
      saveNote: (surah, ayah, text, tags) => {
        const trimmed = text.trim();
        const existing = state.notes.find(
          (n) => n.surah === surah && n.ayah === ayah
        );
        const now = new Date().toISOString();
        // Single source of truth for tag normalization: trim, lowercase,
        // drop empties, dedupe, cap at 10. Callers may pass raw fragments.
        const normalizedTags = normalizeTags(tags);
        let notes: Note[];
        if (!trimmed) {
          notes = existing
            ? state.notes.filter((n) => n.id !== existing.id)
            : state.notes;
        } else if (existing) {
          notes = state.notes.map((n) =>
            n.id === existing.id
              ? { ...n, text: trimmed, tags: normalizedTags, updatedAt: now }
              : n
          );
        } else {
          notes = [
            ...state.notes,
            {
              id: `${surah}:${ayah}:${Date.now()}`,
              surah,
              ayah,
              text: trimmed,
              tags: normalizedTags,
              createdAt: now,
              updatedAt: now,
            },
          ];
        }
        update({ ...state, notes });
      },
      deleteNote: (id) => {
        update({ ...state, notes: state.notes.filter((n) => n.id !== id) });
      },
      recordVisit: (surah, ayah) => {
        // Keep a short recent list (most recent first, deduped).
        const entry: ProgressEntry = {
          surah,
          ayah,
          at: new Date().toISOString(),
        };
        const progress = [
          entry,
          ...state.progress.filter((p) => !(p.surah === surah && p.ayah === ayah)),
        ].slice(0, 50);
        update({ ...state, progress });
      },
      restoreLibrary: (raw) => {
        const next = normalizeLibraryState(raw);
        update(next);
        return {
          bookmarks: next.bookmarks.length,
          notes: next.notes.length,
          progress: next.progress.length,
        };
      },
      clearAll: () => update(EMPTY_LIBRARY_STATE),
    };
  }, [state, hydrated, update]);

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
}

export function useLibrary(): LibraryContextValue {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
}
