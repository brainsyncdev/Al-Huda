import { describe, it, expect } from "vitest";
import { scoreQuiz, isCorrect } from "./scoring";
import type { QuizQuestion, QuizResponse } from "./types";

describe("scoreQuiz", () => {
  it("returns 0 correct for empty questions", () => {
    const result = scoreQuiz([], {});
    expect(result.correct).toBe(0);
    expect(result.total).toBe(0);
  });

  it("counts unanswered questions as incorrect", () => {
    const questions: QuizQuestion[] = [
      {
        id: "q1",
        kind: "surah-identification",
        prompt: "Which surah?",
        refs: [{ surah: 1, ayah: 1 }],
        data: {
          arabic: "بِسْمِ اللَّهِ",
          options: [
            { surahId: 1, surahName: "Al-Fatihah" },
            { surahId: 2, surahName: "Al-Baqarah" },
          ],
          correctIndex: 0,
        },
      },
    ];

    const result = scoreQuiz(questions, {});
    expect(result.correct).toBe(0);
    expect(result.total).toBe(1);
  });

  it("scores surah-identification correctly", () => {
    const questions: QuizQuestion[] = [
      {
        id: "q1",
        kind: "surah-identification",
        prompt: "Which surah?",
        refs: [{ surah: 1, ayah: 1 }],
        data: {
          arabic: "بِسْمِ اللَّهِ",
          options: [
            { surahId: 1, surahName: "Al-Fatihah" },
            { surahId: 2, surahName: "Al-Baqarah" },
          ],
          correctIndex: 0,
        },
      },
    ];

    const responses: Record<string, QuizResponse> = {
      q1: { kind: "surah-identification", selectedIndex: 0 },
    };

    const result = scoreQuiz(questions, responses);
    expect(result.correct).toBe(1);
    expect(result.total).toBe(1);
  });

  it("scores translation-match correctly", () => {
    const questions: QuizQuestion[] = [
      {
        id: "q1",
        kind: "translation-match",
        prompt: "Which translation?",
        refs: [{ surah: 1, ayah: 1 }],
        data: {
          arabic: "بِسْمِ اللَّهِ",
          options: ["In the name of God", "Praise be to God"],
          correctIndex: 0,
        },
      },
    ];

    const responses: Record<string, QuizResponse> = {
      q1: { kind: "translation-match", selectedIndex: 0 },
    };

    const result = scoreQuiz(questions, responses);
    expect(result.correct).toBe(1);
  });

  it("scores ayah-ordering correctly", () => {
    const questions: QuizQuestion[] = [
      {
        id: "q1",
        kind: "ayah-ordering",
        prompt: "Order these ayat",
        refs: [
          { surah: 1, ayah: 1 },
          { surah: 1, ayah: 2 },
        ],
        data: {
          items: [
            {
              ref: { surah: 1, ayah: 2 },
              arabic: "",
              translation: "",
            },
            {
              ref: { surah: 1, ayah: 1 },
              arabic: "",
              translation: "",
            },
          ],
          correctOrder: [1, 0], // item at index 1 (ayah 1) comes first
        },
      },
    ];

    const responses: Record<string, QuizResponse> = {
      q1: { kind: "ayah-ordering", orderedIndices: [1, 0] },
    };

    const result = scoreQuiz(questions, responses);
    expect(result.correct).toBe(1);
  });

  it("scores topic-match correctly", () => {
    const questions: QuizQuestion[] = [
      {
        id: "q1",
        kind: "topic-match",
        prompt: "Which ayat belong to patience?",
        refs: [
          { surah: 2, ayah: 153 },
          { surah: 2, ayah: 155 },
        ],
        data: {
          topicTitle: "Patience",
          options: [
            {
              ref: { surah: 2, ayah: 153 },
              arabic: "",
              translation: "",
            },
            {
              ref: { surah: 1, ayah: 1 },
              arabic: "",
              translation: "",
            },
            {
              ref: { surah: 2, ayah: 155 },
              arabic: "",
              translation: "",
            },
          ],
          correctIndices: [0, 2],
        },
      },
    ];

    const responses: Record<string, QuizResponse> = {
      q1: { kind: "topic-match", selectedIndices: [0, 2] },
    };

    const result = scoreQuiz(questions, responses);
    expect(result.correct).toBe(1);
  });

  it("marks incorrect answers as wrong", () => {
    const questions: QuizQuestion[] = [
      {
        id: "q1",
        kind: "surah-identification",
        prompt: "Which surah?",
        refs: [{ surah: 1, ayah: 1 }],
        data: {
          arabic: "بِسْمِ اللَّهِ",
          options: [
            { surahId: 1, surahName: "Al-Fatihah" },
            { surahId: 2, surahName: "Al-Baqarah" },
          ],
          correctIndex: 0,
        },
      },
    ];

    const responses: Record<string, QuizResponse> = {
      q1: { kind: "surah-identification", selectedIndex: 1 }, // wrong
    };

    const result = scoreQuiz(questions, responses);
    expect(result.correct).toBe(0);
  });
});

describe("isCorrect", () => {
  it("returns false for mismatched response kind", () => {
    const q: QuizQuestion = {
      id: "q1",
      kind: "surah-identification",
      prompt: "Which surah?",
      refs: [{ surah: 1, ayah: 1 }],
      data: {
        arabic: "بِسْمِ اللَّهِ",
        options: [{ surahId: 1, surahName: "Al-Fatihah" }],
        correctIndex: 0,
      },
    };

    const resp: QuizResponse = {
      kind: "translation-match", // wrong kind
      selectedIndex: 0,
    };

    expect(isCorrect(q, resp)).toBe(false);
  });
});
