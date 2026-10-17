"use client";

// Local-first personal library: bookmarks, notes, and reading progress.
// Everything is stored in this browser only (localStorage). Nothing is sent
// to a server — the MVP has no accounts and no analytics (PRD §10, §23).
// Export produces a portable JSON file; Delete erases the device copy.

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

const EMPTY: LibraryState = { bookmarks: [], notes: [], progress: [] };

const STORAGE_KEY = "alhuda.library.v1";

function load(): LibraryState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<LibraryState>;
    return {
      bookmarks: Array.isArray(parsed.bookmarks) ? parsed.bookmarks : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
      progress: Array.isArray(parsed.progress) ? parsed.progress : [],
    };
  } catch {
    return EMPTY;
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

interface LibraryContextValue extends LibraryState {
  isBookmarked: (surah: number, ayah: number) => boolean;
  toggleBookmark: (surah: number, ayah: number) => void;
  noteFor: (surah: number, ayah: number) => Note | undefined;
  saveNote: (surah: number, ayah: number, text: string) => void;
  deleteNote: (id: string) => void;
  recordVisit: (surah: number, ayah: number) => void;
  /** JSON-serializable snapshot for the export action. */
  exportData: () => { version: 1; exportedAt: string; library: LibraryState };
  /** Erase everything on this device. */
  clearAll: () => void;
  /** True once localStorage has been read (avoids hydration mismatch). */
  hydrated: boolean;
}

const LibraryContext = createContext<LibraryContextValue | null>(null);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LibraryState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(load());
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
      saveNote: (surah, ayah, text) => {
        const trimmed = text.trim();
        const existing = state.notes.find(
          (n) => n.surah === surah && n.ayah === ayah
        );
        const now = new Date().toISOString();
        let notes: Note[];
        if (!trimmed) {
          notes = existing
            ? state.notes.filter((n) => n.id !== existing.id)
            : state.notes;
        } else if (existing) {
          notes = state.notes.map((n) =>
            n.id === existing.id
              ? { ...n, text: trimmed, updatedAt: now }
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
      exportData: () => ({
        version: 1,
        exportedAt: new Date().toISOString(),
        library: state,
      }),
      clearAll: () => update(EMPTY),
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
