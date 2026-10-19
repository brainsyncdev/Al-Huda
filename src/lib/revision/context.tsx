"use client";

// Local-first revision plan (FR-050–FR-053).
//
// Same contract as LibraryProvider: everything lives in this browser's
// localStorage, there is no account and no server copy (PRD §10, §23). The
// storage module owns parsing and validation; this file owns actions and
// hydration.
//
// API surface is dictated by the components in src/components/revision/:
//   hydrated, state, items, events, settings, isInPlan, addRange, rate,
//   setDefaultLadder, changeLadder, resetSchedule, removeItem,
//   exportState, restoreState, clearAll.

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
  applyRating,
  createItem,
  editItem,
  resetItem,
  type Rating,
  type RevisionItem,
  type RevisionState,
  type ReviewEvent,
} from "./scheduling";
import { normalizeRevisionState, readRevisionState, writeRevisionState } from "./storage";

export interface AddRangeResult {
  added: number;
  skipped: number;
}

interface RevisionContextValue {
  /** True once localStorage has been read (avoids hydration mismatch). */
  hydrated: boolean;
  state: RevisionState;
  items: Record<string, RevisionItem>;
  events: ReviewEvent[];
  settings: { ladderId: string };
  isInPlan: (reference: string) => boolean;
  addRange: (refs: Array<{ surah: number; ayah: number }>) => AddRangeResult;
  rate: (reference: string, rating: Rating) => void;
  setDefaultLadder: (ladderId: string) => void;
  changeLadder: (reference: string, ladderId: string) => void;
  resetSchedule: (reference: string) => void;
  removeItem: (reference: string) => void;
  /** JSON-serializable snapshot for the shared backup export (FR-043). */
  exportState: () => RevisionState;
  /**
   * Replace the plan from a parsed backup. The incoming state is re-normalized
   * here as well as in the backup parser, so no caller can bypass validation.
   */
  restoreState: (next: unknown) => { items: number; events: number };
  /** Erase the plan on this device (bookmarks/notes are cleared separately). */
  clearAll: () => void;
}

const RevisionContext = createContext<RevisionContextValue | null>(null);

export function RevisionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<RevisionState>(() => normalizeRevisionState(null));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readRevisionState());
    setHydrated(true);
  }, []);

  const commit = useCallback((next: RevisionState) => {
    setState(next);
    writeRevisionState(next);
  }, []);

  const value = useMemo<RevisionContextValue>(() => {
    const isInPlan = (reference: string) => state.items[reference] !== undefined;

    return {
      hydrated,
      state,
      items: state.items,
      events: state.events,
      settings: state.settings,
      isInPlan,
      addRange: (refs) => {
        const nowMs = Date.now();
        const nowIso = new Date(nowMs).toISOString();
        const items = { ...state.items };
        let added = 0;
        let skipped = 0;
        for (const ref of refs) {
          const reference = `${ref.surah}:${ref.ayah}`;
          if (items[reference]) {
            skipped += 1;
            continue;
          }
          items[reference] = createItem(
            ref.surah,
            ref.ayah,
            state.settings.ladderId,
            nowIso,
            nowMs
          );
          added += 1;
        }
        if (added > 0) commit({ ...state, items });
        return { added, skipped };
      },
      rate: (reference, rating) => {
        const item = state.items[reference];
        if (!item) return;
        const nowMs = Date.now();
        const { item: updated, event } = applyRating(
          item,
          rating,
          new Date(nowMs).toISOString(),
          nowMs
        );
        commit({
          ...state,
          items: { ...state.items, [reference]: updated },
          events: [event, ...state.events],
        });
      },
      setDefaultLadder: (ladderId) => {
        if (ladderId === state.settings.ladderId) return;
        commit({ ...state, settings: { ladderId } });
      },
      changeLadder: (reference, ladderId) => {
        const item = state.items[reference];
        if (!item || item.ladderId === ladderId) return;
        const nowMs = Date.now();
        const { item: updated, event } = editItem(
          item,
          ladderId,
          new Date(nowMs).toISOString(),
          nowMs
        );
        commit({
          ...state,
          items: { ...state.items, [reference]: updated },
          events: [event, ...state.events],
        });
      },
      resetSchedule: (reference) => {
        const item = state.items[reference];
        if (!item) return;
        const nowMs = Date.now();
        const { item: updated, event } = resetItem(
          item,
          new Date(nowMs).toISOString(),
          nowMs
        );
        commit({
          ...state,
          items: { ...state.items, [reference]: updated },
          events: [event, ...state.events],
        });
      },
      removeItem: (reference) => {
        if (!state.items[reference]) return;
        const items = { ...state.items };
        delete items[reference];
        // Review history deliberately survives removal: the events record study
        // that happened (see plan-overview copy).
        commit({ ...state, items });
      },
      exportState: () => state,
      restoreState: (next) => {
        const restored = normalizeRevisionState(next);
        commit(restored);
        return {
          items: Object.keys(restored.items).length,
          events: restored.events.length,
        };
      },
      clearAll: () => commit(normalizeRevisionState(null)),
    };
  }, [state, hydrated, commit]);

  return (
    <RevisionContext.Provider value={value}>{children}</RevisionContext.Provider>
  );
}

export function useRevision(): RevisionContextValue {
  const ctx = useContext(RevisionContext);
  if (!ctx) throw new Error("useRevision must be used within RevisionProvider");
  return ctx;
}
