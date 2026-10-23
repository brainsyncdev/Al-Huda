// Quiz types — active learning through self-assessment.
//
// Four question kinds:
// - surah-identification: given an ayah, identify which surah it belongs to
// - translation-match: match an Arabic ayah to its English translation
// - ayah-ordering: order a sequence of ayat from the same surah
// - topic-match: given a topic, identify which ayat belong to it
//
// LOCAL-FIRST: quiz attempts are stored in localStorage. No accounts, no sync.
// No scoring leaderboard — this is self-assessment, not comparison.
//
// QuizQuestion is a discriminated union on `kind` so the scorer and the UI can
// narrow `data` without casts: a surah question can never be read as an
// ordering question.

import type { AyahRef } from "@/lib/quran/types";

export type QuizKind =
  | "surah-identification"
  | "translation-match"
  | "ayah-ordering"
  | "topic-match";

interface BaseQuestion {
  /** Stable id for this question instance. */
  id: string;
  /** Display prompt (what the learner sees). */
  prompt: string;
  /** Optional hint or context. */
  hint?: string;
  /** Ayah reference(s) this question is about. */
  refs: AyahRef[];
}

export type QuizQuestion =
  | (BaseQuestion & {
      kind: "surah-identification";
      data: SurahIdentificationData;
    })
  | (BaseQuestion & {
      kind: "translation-match";
      data: TranslationMatchData;
    })
  | (BaseQuestion & {
      kind: "ayah-ordering";
      data: AyahOrderingData;
    })
  | (BaseQuestion & {
      kind: "topic-match";
      data: TopicMatchData;
    });

export interface SurahIdentificationData {
  /** Arabic text of the ayah. */
  arabic: string;
  /** Options to choose from. */
  options: Array<{ surahId: number; surahName: string }>;
  /** Index of the correct option in the options array. */
  correctIndex: number;
}

export interface TranslationMatchData {
  /** Arabic text of the ayah. */
  arabic: string;
  /** Translation options to choose from. */
  options: string[];
  /** Index of the correct translation in the options array. */
  correctIndex: number;
}

export interface AyahOrderingData {
  /** Items to order (shuffled). */
  items: Array<{
    ref: AyahRef;
    arabic: string;
    translation: string;
  }>;
  /** Correct order (indices into items array). */
  correctOrder: number[];
}

export interface TopicMatchData {
  /** Topic title. */
  topicTitle: string;
  /** Ayah options to choose from. */
  options: Array<{
    ref: AyahRef;
    arabic: string;
    translation: string;
  }>;
  /** Indices of correct options in the options array. */
  correctIndices: number[];
}

/** A quiz attempt: a sequence of questions with learner responses. */
export interface QuizAttempt {
  /** Unique id for this attempt. */
  id: string;
  /** When the attempt started. */
  startedAt: string;
  /** When the attempt was completed (null if in progress). */
  completedAt: string | null;
  /** Questions in this attempt. */
  questions: QuizQuestion[];
  /** Learner's responses, keyed by question id. */
  responses: Record<string, QuizResponse>;
}

/** Learner's response to one question. */
export type QuizResponse =
  | { kind: "surah-identification"; selectedIndex: number }
  | { kind: "translation-match"; selectedIndex: number }
  | { kind: "ayah-ordering"; orderedIndices: number[] }
  | { kind: "topic-match"; selectedIndices: number[] };

/** Quiz state stored in localStorage. */
export interface QuizState {
  /** All attempts, most recent first. */
  attempts: QuizAttempt[];
  /** Current in-progress attempt (null if none). */
  currentAttemptId: string | null;
}