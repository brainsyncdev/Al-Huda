// Quiz scoring — PURE MODULE, client-safe.
//
// Kept separate from generator.ts because the generator reads the Quran
// dataset through node:fs and must never enter a client bundle. Scoring only
// compares already-generated question data with recorded responses, so it is
// safe to import from the quiz context and the quiz UI.

import type { QuizQuestion, QuizResponse } from "./types";

/**
 * Score a quiz attempt. Unanswered questions count as incorrect, which is the
 * honest reading of an unfinished attempt.
 */
export function scoreQuiz(
  questions: QuizQuestion[],
  responses: Record<string, QuizResponse>
): { correct: number; total: number } {
  let correct = 0;
  for (const q of questions) {
    const resp = responses[q.id];
    if (!resp) continue;
    if (isCorrect(q, resp)) correct++;
  }
  return { correct, total: questions.length };
}

/** Whether one recorded response is correct for its question. */
export function isCorrect(q: QuizQuestion, resp: QuizResponse): boolean {
  switch (q.kind) {
    case "surah-identification": {
      if (resp.kind !== "surah-identification") return false;
      return resp.selectedIndex === q.data.correctIndex;
    }
    case "translation-match": {
      if (resp.kind !== "translation-match") return false;
      return resp.selectedIndex === q.data.correctIndex;
    }
    case "ayah-ordering": {
      if (resp.kind !== "ayah-ordering") return false;
      const correctOrder = q.data.correctOrder;
      if (resp.orderedIndices.length !== correctOrder.length) return false;
      return correctOrder.every((idx, i) => resp.orderedIndices[i] === idx);
    }
    case "topic-match": {
      if (resp.kind !== "topic-match") return false;
      const correctSet = new Set(q.data.correctIndices);
      const userSet = new Set(resp.selectedIndices);
      if (correctSet.size !== userSet.size) return false;
      for (const idx of correctSet) {
        if (!userSet.has(idx)) return false;
      }
      return true;
    }
  }
}