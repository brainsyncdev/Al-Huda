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
  | "topic-match"
  | "ayah-recall"
  | "missing-word"
  | "reference-recognition";

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
    })
  | (BaseQuestion & {
      kind: "ayah-recall";
      data: AyahRecallData;
    })
  | (BaseQuestion & {
      kind: "missing-word";
      data: MissingWordData;
    })
  | (BaseQuestion & {
      kind: "reference-recognition";
      data: ReferenceRecognitionData;
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

/**
 * Ayah recall: show a reference or prompt, learner tries to recall the passage,
 * then sees the canonical text and self-rates their recall.
 *
 * IMPORTANT: This is NOT automatic scoring of free-text Arabic. Minor
 * presentation differences (diacritics, spacing, orthographic variants) are
 * not evidence of religious or textual equivalence. The learner self-assesses
 * against the canonical text shown to them.
 */
export interface AyahRecallData {
  /** The canonical Arabic text (Uthmani) revealed after the attempt. */
  canonicalArabic: string;
  /** The canonical translation revealed after the attempt. */
  canonicalTranslation: string;
  /** Optional prompt or context hint shown before recall. */
  recallPrompt?: string;
}

/**
 * Missing-word exercise: hide one word from verified text, learner selects
 * the missing word from options. Uses exact canonical data — the missing word
 * is drawn from the actual ayah text, never reconstructed or invented.
 */
export interface MissingWordData {
  /** Full Arabic text of the ayah (canonical). */
  fullArabic: string;
  /** Arabic text with the missing word replaced by a blank indicator. */
  displayArabic: string;
  /** The actual missing word (canonical). */
  missingWord: string;
  /** Options to choose from (includes the correct word and distractors). */
  options: string[];
  /** Index of the correct option. */
  correctIndex: number;
}

/**
 * Reference recognition: show ayah text, learner identifies which surah and
 * ayah number it is. Tests knowledge of the canonical structure.
 */
export interface ReferenceRecognitionData {
  /** Arabic text of the ayah. */
  arabic: string;
  /** Translation of the ayah. */
  translation: string;
  /** The correct reference. */
  correctRef: AyahRef;
  /** Options to choose from (references with display names). */
  options: Array<{
    ref: AyahRef;
    label: string;
  }>;
  /** Index of the correct option. */
  correctIndex: number;
}

/**
 * Session configuration: what the learner chose when starting the quiz.
 * Stored on the attempt so the review screen can explain where questions came
 * from and the history list can show meaningful context.
 */
export interface QuizSessionConfig {
  /** Source of the questions. */
  source:
    | { kind: "default" }
    | { kind: "surah"; surahId: number }
    | { kind: "path"; pathSlug: string }
    | { kind: "topic"; topicSlug: string }
    | { kind: "revision" };
  /** Which question kinds were enabled. Empty means all available. */
  enabledKinds: QuizKind[];
  /** How many questions were requested. */
  requestedCount: number;
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
  /** Session configuration (absent on legacy attempts from before this field). */
  config?: QuizSessionConfig;
}

/** Learner's response to one question. */
export type QuizResponse =
  | { kind: "surah-identification"; selectedIndex: number }
  | { kind: "translation-match"; selectedIndex: number }
  | { kind: "ayah-ordering"; orderedIndices: number[] }
  | { kind: "topic-match"; selectedIndices: number[] }
  | { kind: "ayah-recall"; selfRating: "accurate" | "partial" | "unable" }
  | { kind: "missing-word"; selectedIndex: number }
  | { kind: "reference-recognition"; selectedIndex: number };

/** Quiz state stored in localStorage. */
export interface QuizState {
  /** All attempts, most recent first. */
  attempts: QuizAttempt[];
  /** Current in-progress attempt (null if none). */
  currentAttemptId: string | null;
}