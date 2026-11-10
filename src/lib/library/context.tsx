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
import {
  EMPTY_LIBRARY_STATE,
  LIBRARY_STORAGE_KEY,
  normalizeLibraryState,
  normalizeTags,
  type Bookmark,
  type Collection,
  type CollectionAyah,
  type LibraryState,
  type Note,
  type ProgressEntry,
} from "./storage";

export type {
  Bookmark,
  Collection,
  CollectionAyah,
  LibraryState,
  Note,
  ProgressEntry,
};
export { EMPTY_LIBRARY_STATE, normalizeLibraryState };

const STORAGE_KEY = LIBRARY_STORAGE_KEY;

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
  /** Sprint 51: Create a new collection. Returns the new collection id. */
  createCollection: (name: string) => string;
  /** Sprint 51: Rename a collection. */
  renameCollection: (id: string, name: string) => void;
  /** Sprint 51: Delete a collection and all its memberships. */
  deleteCollection: (id: string) => void;
  /** Sprint 51: Add an ayah to a collection (prevents duplicates). */
  addToCollection: (collectionId: string, surah: number, ayah: number) => void;
  /** Sprint 51: Remove an ayah from a collection. */
  removeFromCollection: (collectionId: string, surah: number, ayah: number) => void;
  /** Sprint 51: Check if an ayah is in a collection. */
  isInCollection: (collectionId: string, surah: number, ayah: number) => boolean;
  /** Sprint 51: Get all ayat in a collection. */
  getCollectionAyat: (collectionId: string) => CollectionAyah[];
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
      createCollection: (name) => {
        const trimmed = name.trim();
        if (!trimmed) return "";
        const now = new Date().toISOString();
        const id = `col:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
        const collection: Collection = {
          id,
          name: trimmed,
          createdAt: now,
          updatedAt: now,
        };
        update({ ...state, collections: [...state.collections, collection] });
        return id;
      },
      renameCollection: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const now = new Date().toISOString();
        const collections = state.collections.map((c) =>
          c.id === id ? { ...c, name: trimmed, updatedAt: now } : c
        );
        update({ ...state, collections });
      },
      deleteCollection: (id) => {
        const collections = state.collections.filter((c) => c.id !== id);
        const collectionAyat = state.collectionAyat.filter(
          (ca) => ca.collectionId !== id
        );
        update({ ...state, collections, collectionAyat });
      },
      addToCollection: (collectionId, surah, ayah) => {
        const exists = state.collectionAyat.some(
          (ca) =>
            ca.collectionId === collectionId &&
            ca.surah === surah &&
            ca.ayah === ayah
        );
        if (exists) return;
        const membership: CollectionAyah = {
          id: `ca:${collectionId}:${surah}:${ayah}:${Date.now()}`,
          collectionId,
          surah,
          ayah,
          createdAt: new Date().toISOString(),
        };
        update({ ...state, collectionAyat: [...state.collectionAyat, membership] });
      },
      removeFromCollection: (collectionId, surah, ayah) => {
        const collectionAyat = state.collectionAyat.filter(
          (ca) =>
            !(
              ca.collectionId === collectionId &&
              ca.surah === surah &&
              ca.ayah === ayah
            )
        );
        update({ ...state, collectionAyat });
      },
      isInCollection: (collectionId, surah, ayah) =>
        state.collectionAyat.some(
          (ca) =>
            ca.collectionId === collectionId &&
            ca.surah === surah &&
            ca.ayah === ayah
        ),
      getCollectionAyat: (collectionId) =>
        state.collectionAyat.filter((ca) => ca.collectionId === collectionId),
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
