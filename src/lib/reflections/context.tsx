"use client";

// Local-first reflections provider (Sprint 53).
//
// Same contract as LibraryProvider and RevisionProvider: everything lives in
// this browser's localStorage, there is no account and no server copy. The
// storage module owns parsing and validation; this file owns actions and
// hydration.
//
// Reflections are distinct from Quranic text and from library notes: they are
// personal study reflections attached to specific ayahs, topics, or journey
// stages. The system does not generate religious advice automatically.

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
  normalizeReflectionsState,
  readReflectionsState,
  writeReflectionsState,
  EMPTY_REFLECTIONS_STATE,
} from "./storage";
import type { Reflection, ReflectionsState, ReflectionTargetType } from "./types";

interface ReflectionsContextValue {
  /** True once localStorage has been read (avoids hydration mismatch). */
  hydrated: boolean;
  state: ReflectionsState;
  /** Add a new reflection and return it. */
  addReflection: (
    targetType: ReflectionTargetType,
    targetRef: string,
    content: string
  ) => Reflection;
  /** Update an existing reflection's content. */
  updateReflection: (id: string, content: string) => void;
  /** Delete a reflection by id. */
  deleteReflection: (id: string) => void;
  /** Get all reflections for a specific target. */
  getReflectionsByTarget: (
    targetType: ReflectionTargetType,
    targetRef: string
  ) => Reflection[];
  /** Search reflections by content (case-insensitive). */
  searchReflections: (query: string) => Reflection[];
  /** JSON-serializable snapshot for the shared backup export. */
  exportState: () => ReflectionsState;
  /**
   * Replace all reflections from a parsed backup. The incoming state is
   * re-normalized here as well as in the backup parser, so no caller can
   * bypass validation.
   */
  restoreState: (state: ReflectionsState) => void;
  /** Erase all reflections on this device. */
  clearAll: () => void;
}

const ReflectionsContext = createContext<ReflectionsContextValue | null>(null);

export function ReflectionsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReflectionsState>(() => ({
    ...EMPTY_REFLECTIONS_STATE,
  }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(readReflectionsState());
    setHydrated(true);
  }, []);

  const commit = useCallback((next: ReflectionsState) => {
    setState(next);
    writeReflectionsState(next);
  }, []);

  const value = useMemo<ReflectionsContextValue>(() => {
    return {
      hydrated,
      state,
      addReflection: (targetType, targetRef, content) => {
        const now = new Date().toISOString();
        const id = `ref:${Date.now()}:${Math.random().toString(36).slice(2, 9)}`;
        const reflection: Reflection = {
          id,
          targetType,
          targetRef,
          content,
          createdAt: now,
          updatedAt: now,
        };
        const next: ReflectionsState = {
          ...state,
          reflections: [...state.reflections, reflection],
        };
        commit(next);
        return reflection;
      },
      updateReflection: (id, content) => {
        const index = state.reflections.findIndex((r) => r.id === id);
        if (index === -1) return;
        const updated: Reflection = {
          ...state.reflections[index],
          content,
          updatedAt: new Date().toISOString(),
        };
        const reflections = [...state.reflections];
        reflections[index] = updated;
        commit({ ...state, reflections });
      },
      deleteReflection: (id) => {
        const reflections = state.reflections.filter((r) => r.id !== id);
        commit({ ...state, reflections });
      },
      getReflectionsByTarget: (targetType, targetRef) => {
        return state.reflections.filter(
          (r) => r.targetType === targetType && r.targetRef === targetRef
        );
      },
      searchReflections: (query) => {
        if (!query.trim()) return [];
        const lowerQuery = query.toLowerCase();
        return state.reflections.filter((r) =>
          r.content.toLowerCase().includes(lowerQuery)
        );
      },
      exportState: () => state,
      restoreState: (next) => {
        const restored = normalizeReflectionsState(next);
        commit(restored);
      },
      clearAll: () => commit({ ...EMPTY_REFLECTIONS_STATE }),
    };
  }, [state, hydrated, commit]);

  return (
    <ReflectionsContext.Provider value={value}>
      {children}
    </ReflectionsContext.Provider>
  );
}

export function useReflections(): ReflectionsContextValue {
  const ctx = useContext(ReflectionsContext);
  if (!ctx) {
    throw new Error("useReflections must be used within ReflectionsProvider");
  }
  return ctx;
}
