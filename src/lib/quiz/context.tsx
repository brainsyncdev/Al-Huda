"use client";

// Quiz context — manages quiz attempts, scoring, and history.
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
import { scoreQuiz } from "./scoring";
import { normalizeQuizState, readQuizState, writeQuizState } from "./storage";
import type { QuizAttempt, QuizQuestion, QuizResponse, QuizState } from "./types";

interface QuizContextValue {
  hydrated: boolean;
  state: QuizState;
  /** Start a new quiz attempt. Returns the attempt id. */
  startQuiz: (questions: QuizQuestion[]) => string;
  /** Record a response to a question in the current attempt. */
  recordResponse: (questionId: string, response: QuizResponse) => void;
  /** Complete the current attempt (marks it finished, scores it). */
  completeQuiz: () => { correct: number; total: number } | null;
  /** Get the current in-progress attempt (null if none). */
  getCurrentAttempt: () => QuizAttempt | null;
  /** Get a past attempt by id. */
  getAttempt: (id: string) => QuizAttempt | null;
  /** Score an attempt without completing it. */
  scoreAttempt: (attemptId: string) => { correct: number; total: number } | null;
  /** Export raw state for backup. */
  exportState: () => QuizState;
  /** Restore state from backup (re-normalized). */
  restoreState: (next: unknown) => void;
  /** Clear all quiz state. */
  clearAll: () => void;
}

const QuizContext = createContext<QuizContextValue | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<QuizState>({
    attempts: [],
    currentAttemptId: null,
  });
  const [hydrated, setHydrated] = useState(false);

  // Single write path: update state and persist.
  const commit = useCallback((next: QuizState) => {
    setState(next);
    writeQuizState(next);
  }, []);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const stored = readQuizState();
    setState(stored);
    setHydrated(true);
  }, []);

  const startQuiz = useCallback(
    (questions: QuizQuestion[]): string => {
      const id = `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const attempt: QuizAttempt = {
        id,
        startedAt: new Date().toISOString(),
        completedAt: null,
        questions,
        responses: {},
      };

      commit({
        attempts: [attempt, ...state.attempts],
        currentAttemptId: id,
      });

      return id;
    },
    [state, commit]
  );

  const recordResponse = useCallback(
    (questionId: string, response: QuizResponse) => {
      if (!state.currentAttemptId) return;
      const attempt = state.attempts.find((a) => a.id === state.currentAttemptId);
      if (!attempt || attempt.completedAt !== null) return;

      const updated: QuizAttempt = {
        ...attempt,
        responses: { ...attempt.responses, [questionId]: response },
      };

      commit({
        ...state,
        attempts: state.attempts.map((a) => (a.id === updated.id ? updated : a)),
      });
    },
    [state, commit]
  );

  const completeQuiz = useCallback((): { correct: number; total: number } | null => {
    if (!state.currentAttemptId) return null;
    const attempt = state.attempts.find((a) => a.id === state.currentAttemptId);
    if (!attempt || attempt.completedAt !== null) return null;

    const result = scoreQuiz(attempt.questions, attempt.responses);
    const updated: QuizAttempt = {
      ...attempt,
      completedAt: new Date().toISOString(),
    };

    commit({
      attempts: state.attempts.map((a) => (a.id === updated.id ? updated : a)),
      currentAttemptId: null,
    });

    return result;
  }, [state, commit]);

  const getCurrentAttempt = useCallback((): QuizAttempt | null => {
    if (!state.currentAttemptId) return null;
    return state.attempts.find((a) => a.id === state.currentAttemptId) ?? null;
  }, [state]);

  const getAttempt = useCallback(
    (id: string): QuizAttempt | null => {
      return state.attempts.find((a) => a.id === id) ?? null;
    },
    [state]
  );

  const scoreAttempt = useCallback(
    (attemptId: string): { correct: number; total: number } | null => {
      const attempt = state.attempts.find((a) => a.id === attemptId);
      if (!attempt) return null;
      return scoreQuiz(attempt.questions, attempt.responses);
    },
    [state]
  );

  const exportState = useCallback(() => state, [state]);

  const restoreState = useCallback(
    (next: unknown) => {
      commit(normalizeQuizState(next));
    },
    [commit]
  );

  const clearAll = useCallback(() => {
    commit({ attempts: [], currentAttemptId: null });
  }, [commit]);

  const value = useMemo<QuizContextValue>(
    () => ({
      hydrated,
      state,
      startQuiz,
      recordResponse,
      completeQuiz,
      getCurrentAttempt,
      getAttempt,
      scoreAttempt,
      exportState,
      restoreState,
      clearAll,
    }),
    [
      hydrated,
      state,
      startQuiz,
      recordResponse,
      completeQuiz,
      getCurrentAttempt,
      getAttempt,
      scoreAttempt,
      exportState,
      restoreState,
      clearAll,
    ]
  );

  return (
    <QuizContext.Provider value={value}>{children}</QuizContext.Provider>
  );
}

export function useQuiz(): QuizContextValue {
  const ctx = useContext(QuizContext);
  if (!ctx) {
    throw new Error("useQuiz must be used within a QuizProvider");
  }
  return ctx;
}