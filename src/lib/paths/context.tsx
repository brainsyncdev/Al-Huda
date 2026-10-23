"use client";

// Learning paths context — manages progress, onboarding, and goal selection.
//
// Follows the same local-first, localStorage-backed pattern as the library,
// prefs, and revision providers. Hydration gate prevents SSR/client mismatch.
// Single `commit` function is the only write path.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EMPTY_PATHS_STATE, getPath } from "./data";
import {
  normalizePathsState,
  readPathsState,
  writePathsState,
} from "./storage";
import type { PathProgress, PathsState, TargetAudience } from "./types";

interface PathsContextValue {
  hydrated: boolean;
  state: PathsState;
  /** Start a path (creates progress entry if not exists). */
  startPath: (pathSlug: string) => void;
  /** Mark a step as complete. Updates lastActivityAt. */
  completeStep: (pathSlug: string, order: number) => void;
  /** Set the learner's goal from onboarding. */
  setGoal: (goal: TargetAudience) => void;
  /** Mark onboarding as completed. */
  completeOnboarding: () => void;
  /** Reset onboarding (for testing or re-choice). */
  resetOnboarding: () => void;
  /** Get progress for a specific path. */
  getProgress: (pathSlug: string) => PathProgress | null;
  /** Check if a step is complete. */
  isStepComplete: (pathSlug: string, order: number) => boolean;
  /** Export raw state for backup. */
  exportState: () => PathsState;
  /** Restore state from backup (re-normalized). */
  restoreState: (next: unknown) => void;
  /** Clear all paths state. */
  clearAll: () => void;
}

const PathsContext = createContext<PathsContextValue | null>(null);

export function PathsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PathsState>(EMPTY_PATHS_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Single write path: update state and persist.
  const commit = useCallback((next: PathsState) => {
    setState(next);
    writePathsState(next);
  }, []);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const stored = readPathsState();
    setState(stored);
    setHydrated(true);
  }, []);

  const startPath = useCallback(
    (pathSlug: string) => {
      const path = getPath(pathSlug);
      if (!path) return;

      const now = new Date().toISOString();
      const existing = state.progress[pathSlug];
      if (existing) {
        // Already started — update lastActivityAt only.
        commit({
          ...state,
          progress: {
            ...state.progress,
            [pathSlug]: { ...existing, lastActivityAt: now },
          },
        });
        return;
      }

      // New path.
      const progress: PathProgress = {
        pathSlug,
        completedSteps: [],
        startedAt: now,
        lastActivityAt: now,
      };
      commit({
        ...state,
        progress: { ...state.progress, [pathSlug]: progress },
      });
    },
    [state, commit]
  );

  const completeStep = useCallback(
    (pathSlug: string, order: number) => {
      const path = getPath(pathSlug);
      if (!path) return;
      if (order < 1 || order > path.steps.length) return;

      const now = new Date().toISOString();
      const existing = state.progress[pathSlug];
      if (!existing) {
        // Auto-start if not yet started.
        const progress: PathProgress = {
          pathSlug,
          completedSteps: [order],
          startedAt: now,
          lastActivityAt: now,
        };
        commit({
          ...state,
          progress: { ...state.progress, [pathSlug]: progress },
        });
        return;
      }

      if (existing.completedSteps.includes(order)) {
        // Already complete — update lastActivityAt only.
        commit({
          ...state,
          progress: {
            ...state.progress,
            [pathSlug]: { ...existing, lastActivityAt: now },
          },
        });
        return;
      }

      // Add step.
      const completedSteps = [...existing.completedSteps, order].sort(
        (a, b) => a - b
      );
      commit({
        ...state,
        progress: {
          ...state.progress,
          [pathSlug]: { ...existing, completedSteps, lastActivityAt: now },
        },
      });
    },
    [state, commit]
  );

  const setGoal = useCallback(
    (goal: TargetAudience) => {
      commit({ ...state, selectedGoal: goal });
    },
    [state, commit]
  );

  const completeOnboarding = useCallback(() => {
    commit({ ...state, onboardingCompleted: true });
  }, [state, commit]);

  const resetOnboarding = useCallback(() => {
    commit({ ...state, onboardingCompleted: false, selectedGoal: null });
  }, [state, commit]);

  const getProgress = useCallback(
    (pathSlug: string): PathProgress | null => {
      return state.progress[pathSlug] ?? null;
    },
    [state]
  );

  const isStepComplete = useCallback(
    (pathSlug: string, order: number): boolean => {
      const progress = state.progress[pathSlug];
      if (!progress) return false;
      return progress.completedSteps.includes(order);
    },
    [state]
  );

  const exportState = useCallback(() => state, [state]);

  const restoreState = useCallback(
    (next: unknown) => {
      commit(normalizePathsState(next));
    },
    [commit]
  );

  const clearAll = useCallback(() => {
    commit({ ...EMPTY_PATHS_STATE });
  }, [commit]);

  const value = useMemo<PathsContextValue>(
    () => ({
      hydrated,
      state,
      startPath,
      completeStep,
      setGoal,
      completeOnboarding,
      resetOnboarding,
      getProgress,
      isStepComplete,
      exportState,
      restoreState,
      clearAll,
    }),
    [
      hydrated,
      state,
      startPath,
      completeStep,
      setGoal,
      completeOnboarding,
      resetOnboarding,
      getProgress,
      isStepComplete,
      exportState,
      restoreState,
      clearAll,
    ]
  );

  return (
    <PathsContext.Provider value={value}>{children}</PathsContext.Provider>
  );
}

export function usePaths(): PathsContextValue {
  const ctx = useContext(PathsContext);
  if (!ctx) {
    throw new Error("usePaths must be used within a PathsProvider");
  }
  return ctx;
}
