"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AyahRef } from "@/lib/quran/types";
import type { ReadingTarget, ReadingPlansState } from "./types";
import {
  normalizeReadingPlansState,
  readReadingPlansState,
  writeReadingPlansState,
} from "./storage";

interface ReadingPlansContextValue {
  hydrated: boolean;
  state: ReadingPlansState;
  addTarget: (target: Omit<ReadingTarget, "id" | "createdAt" | "lastActivityAt">) => void;
  updatePosition: (targetId: string, newPosition: AyahRef) => void;
  pauseTarget: (targetId: string) => void;
  resumeTarget: (targetId: string) => void;
  removeTarget: (targetId: string) => void;
  exportState: () => ReadingPlansState;
  restoreState: (next: unknown) => void;
  clearAll: () => void;
}

const ReadingPlansContext = createContext<ReadingPlansContextValue | null>(null);

export function ReadingPlansProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ReadingPlansState>({ targets: [] });
  const [hydrated, setHydrated] = useState(false);

  const commit = useCallback((next: ReadingPlansState) => {
    setState(next);
    writeReadingPlansState(next);
  }, []);

  useEffect(() => {
    const stored = readReadingPlansState();
    setState(stored);
    setHydrated(true);
  }, []);

  const addTarget = useCallback(
    (target: Omit<ReadingTarget, "id" | "createdAt" | "lastActivityAt">) => {
      const id = `plan-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const now = new Date().toISOString();
      const newTarget: ReadingTarget = {
        ...target,
        id,
        createdAt: now,
        lastActivityAt: null,
      };
      commit({ targets: [...state.targets, newTarget] });
    },
    [state, commit]
  );

  const updatePosition = useCallback(
    (targetId: string, newPosition: AyahRef) => {
      const now = new Date().toISOString();
      commit({
        targets: state.targets.map((t) =>
          t.id === targetId
            ? { ...t, currentPosition: newPosition, lastActivityAt: now }
            : t
        ),
      });
    },
    [state, commit]
  );

  const pauseTarget = useCallback(
    (targetId: string) => {
      commit({
        targets: state.targets.map((t) =>
          t.id === targetId ? { ...t, paused: true } : t
        ),
      });
    },
    [state, commit]
  );

  const resumeTarget = useCallback(
    (targetId: string) => {
      commit({
        targets: state.targets.map((t) =>
          t.id === targetId ? { ...t, paused: false } : t
        ),
      });
    },
    [state, commit]
  );

  const removeTarget = useCallback(
    (targetId: string) => {
      commit({ targets: state.targets.filter((t) => t.id !== targetId) });
    },
    [state, commit]
  );

  const exportState = useCallback(() => state, [state]);

  const restoreState = useCallback(
    (next: unknown) => {
      commit(normalizeReadingPlansState(next));
    },
    [commit]
  );

  const clearAll = useCallback(() => {
    commit({ targets: [] });
  }, [commit]);

  const value = useMemo<ReadingPlansContextValue>(
    () => ({
      hydrated,
      state,
      addTarget,
      updatePosition,
      pauseTarget,
      resumeTarget,
      removeTarget,
      exportState,
      restoreState,
      clearAll,
    }),
    [
      hydrated,
      state,
      addTarget,
      updatePosition,
      pauseTarget,
      resumeTarget,
      removeTarget,
      exportState,
      restoreState,
      clearAll,
    ]
  );

  return (
    <ReadingPlansContext.Provider value={value}>
      {children}
    </ReadingPlansContext.Provider>
  );
}

export function useReadingPlans(): ReadingPlansContextValue {
  const ctx = useContext(ReadingPlansContext);
  if (!ctx) {
    throw new Error("useReadingPlans must be used within a ReadingPlansProvider");
  }
  return ctx;
}
