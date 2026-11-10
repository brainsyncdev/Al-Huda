"use client";

// Study journeys context — manages progress tracking.
//
// Follows the same local-first, localStorage-backed pattern as the library,
// prefs, revision, and paths providers. Hydration gate prevents SSR/client
// mismatch. Single `commit` function is the only write path.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EMPTY_JOURNEYS_STATE, getJourney } from "./data";
import {
  normalizeJourneysState,
  readJourneysState,
  writeJourneysState,
} from "./storage";
import type { JourneyProgress, JourneysState } from "./types";

interface JourneysContextValue {
  hydrated: boolean;
  state: JourneysState;
  /** Start a journey (creates progress entry if not exists). */
  startJourney: (journeySlug: string) => void;
  /** Mark a stage as complete. Updates lastActivityAt. */
  completeStage: (journeySlug: string, order: number) => void;
  /** Get progress for a specific journey. */
  getProgress: (journeySlug: string) => JourneyProgress | null;
  /** Check if a stage is complete. */
  isStageComplete: (journeySlug: string, order: number) => boolean;
  /** Export raw state for backup. */
  exportState: () => JourneysState;
  /** Restore state from backup (re-normalized). */
  restoreState: (next: unknown) => void;
  /** Clear all journeys state. */
  clearAll: () => void;
}

const JourneysContext = createContext<JourneysContextValue | null>(null);

export function JourneysProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JourneysState>(EMPTY_JOURNEYS_STATE);
  const [hydrated, setHydrated] = useState(false);

  // Single write path: update state and persist.
  const commit = useCallback((next: JourneysState) => {
    setState(next);
    writeJourneysState(next);
  }, []);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const stored = readJourneysState();
    setState(stored);
    setHydrated(true);
  }, []);

  const startJourney = useCallback(
    (journeySlug: string) => {
      const journey = getJourney(journeySlug);
      if (!journey) return;

      const now = new Date().toISOString();
      const existing = state.progress[journeySlug];
      if (existing) {
        // Already started — update lastActivityAt only.
        commit({
          ...state,
          progress: {
            ...state.progress,
            [journeySlug]: { ...existing, lastActivityAt: now },
          },
        });
        return;
      }

      // New journey.
      const progress: JourneyProgress = {
        journeySlug,
        completedStages: [],
        startedAt: now,
        lastActivityAt: now,
        journeyVersion: journey.version,
      };
      commit({
        ...state,
        progress: { ...state.progress, [journeySlug]: progress },
      });
    },
    [state, commit]
  );

  const completeStage = useCallback(
    (journeySlug: string, order: number) => {
      const journey = getJourney(journeySlug);
      if (!journey) return;
      if (order < 1 || order > journey.stages.length) return;

      const now = new Date().toISOString();
      const existing = state.progress[journeySlug];
      if (!existing) {
        // Auto-start if not yet started.
        const progress: JourneyProgress = {
          journeySlug,
          completedStages: [order],
          startedAt: now,
          lastActivityAt: now,
          journeyVersion: journey.version,
        };
        commit({
          ...state,
          progress: { ...state.progress, [journeySlug]: progress },
        });
        return;
      }

      if (existing.completedStages.includes(order)) {
        // Already complete — update lastActivityAt only.
        commit({
          ...state,
          progress: {
            ...state.progress,
            [journeySlug]: { ...existing, lastActivityAt: now },
          },
        });
        return;
      }

      // Add stage.
      const completedStages = [...existing.completedStages, order].sort(
        (a, b) => a - b
      );
      commit({
        ...state,
        progress: {
          ...state.progress,
          [journeySlug]: {
            ...existing,
            completedStages,
            lastActivityAt: now,
            journeyVersion: journey.version,
          },
        },
      });
    },
    [state, commit]
  );

  const getProgress = useCallback(
    (journeySlug: string): JourneyProgress | null => {
      return state.progress[journeySlug] ?? null;
    },
    [state]
  );

  const isStageComplete = useCallback(
    (journeySlug: string, order: number): boolean => {
      const progress = state.progress[journeySlug];
      if (!progress) return false;
      return progress.completedStages.includes(order);
    },
    [state]
  );

  const exportState = useCallback(() => state, [state]);

  const restoreState = useCallback(
    (next: unknown) => {
      commit(normalizeJourneysState(next));
    },
    [commit]
  );

  const clearAll = useCallback(() => {
    commit({ ...EMPTY_JOURNEYS_STATE });
  }, [commit]);

  const value = useMemo<JourneysContextValue>(
    () => ({
      hydrated,
      state,
      startJourney,
      completeStage,
      getProgress,
      isStageComplete,
      exportState,
      restoreState,
      clearAll,
    }),
    [
      hydrated,
      state,
      startJourney,
      completeStage,
      getProgress,
      isStageComplete,
      exportState,
      restoreState,
      clearAll,
    ]
  );

  return (
    <JourneysContext.Provider value={value}>{children}</JourneysContext.Provider>
  );
}

export function useJourneys(): JourneysContextValue {
  const ctx = useContext(JourneysContext);
  if (!ctx) {
    throw new Error("useJourneys must be used within a JourneysProvider");
  }
  return ctx;
}
