"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Play, RotateCcw, Check, X, Trophy, Flame, Target, Zap } from "lucide-react";

type QuizMode = "idle" | "playing" | "result";

interface QuizQuestion {
  surah: string;
  ayahNumber: number;
  arabic: string;
  options: string[];
  correct: number;
}

export default function HifzPage() {
  const [mode, setMode] = useState<QuizMode>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const questions: QuizQuestion[] = [
    {
      surah: "Al-Fatiha",
      ayahNumber: 1,
      arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      options: ["بسم اللہ", "الحمدللہ", "اللہ اکبر", "سب سے پہلے"],
      correct: 0,
    },
    {
      surah: "Al-Fatiha",
      ayahNumber: 2,
      arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      options: ["رب العالمین", "مالک یوم الدین", "پالنے والا", "بادشاہ"],
      correct: 0,
    },
    {
      surah: "Al-Fatiha",
      ayahNumber: 5,
      arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      options: ["تجھے پوجتے ہیں", "راستہ دکھا", "قیامت کا دن", "سب تعریف"],
      correct: 0,
    },
  ];

  const handleStart = () => {
    setMode("playing");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
  };

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    if (idx === questions[currentQ].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setMode("result");
    }
  };

  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                ←
              </Link>
              <div>
                <h1 className="font-semibold">Hifz Engine</h1>
                <p className="text-xs text-muted-foreground">حفظ — Memorization</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
              <Flame className="h-4 w-4" />
              <span>5 Day Streak</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {mode === "idle" && (
          <div className="text-center">
            {/* Hero */}
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
              <Trophy className="h-12 w-12 text-white" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Test Your Hifz</h2>
            <p className="urdu-text text-lg text-muted-foreground mb-8" dir="rtl">
              اپنی حفظ کی پرکھ کریں
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-card rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">15</p>
                <p className="text-xs text-muted-foreground">Pages Done</p>
              </div>
              <div className="bg-card rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">87%</p>
                <p className="text-xs text-muted-foreground">Accuracy</p>
              </div>
              <div className="bg-card rounded-xl border p-4 text-center">
                <p className="text-2xl font-bold text-amber-600">500+</p>
                <p className="text-xs text-muted-foreground">Ayaat</p>
              </div>
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              <Play className="h-5 w-5" />
              Start Quiz
            </button>

            {/* Methods */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="bg-card rounded-xl border p-4">
                <Target className="h-6 w-6 text-amber-600 mb-2" />
                <h3 className="font-medium text-sm">Fill in the Blank</h3>
                <p className="text-xs text-muted-foreground">Fill missing words</p>
              </div>
              <div className="bg-card rounded-xl border p-4">
                <Zap className="h-6 w-6 text-amber-600 mb-2" />
                <h3 className="font-medium text-sm">Quick Review</h3>
                <p className="text-xs text-muted-foreground">Fast flashcards</p>
              </div>
            </div>
          </div>
        )}

        {mode === "playing" && (
          <div>
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-amber-600">
                Score: {score}
              </span>
            </div>
            <div className="w-full bg-amber-100 rounded-full h-2 mb-6">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="bg-card rounded-2xl border p-6 mb-4">
              <div className="text-center mb-4">
                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                  📖 {questions[currentQ].surah} {questions[currentQ].ayahNumber}
                </span>
              </div>
              
              <p className="arabic-text text-2xl text-center mb-6" dir="rtl">
                {questions[currentQ].arabic}
              </p>

              <p className="text-center text-muted-foreground mb-4">
                What does this mean?
              </p>

              <div className="space-y-3">
                {questions[currentQ].options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    disabled={showAnswer}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      showAnswer
                        ? idx === questions[currentQ].correct
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : idx === selected
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-border opacity-50"
                        : "border-border hover:border-amber-500 hover:bg-amber-50"
                    }`}
                  >
                    <span className="font-medium mr-3">{idx + 1}.</span>
                    {option}
                    {showAnswer && idx === questions[currentQ].correct && (
                      <Check className="h-5 w-5 text-emerald-500 float-right" />
                    )}
                    {showAnswer && idx === selected && idx !== questions[currentQ].correct && (
                      <X className="h-5 w-5 text-red-500 float-right" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {showAnswer && (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-amber-600 text-white font-semibold"
              >
                {currentQ < questions.length - 1 ? "Next Question" : "See Results"}
              </button>
            )}
          </div>
        )}

        {mode === "result" && (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center">
              <Trophy className="h-12 w-12 text-white" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-6">آپ کا نتیجہ</p>

            <div className="bg-card rounded-2xl border p-6 mb-6">
              <p className="text-5xl font-bold text-amber-600 mb-2">{accuracy}%</p>
              <p className="text-muted-foreground">
                {score} out of {questions.length} correct
              </p>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-around">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-emerald-600">
                      {score}
                    </p>
                    <p className="text-xs text-muted-foreground">Correct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">
                      {questions.length - score}
                    </p>
                    <p className="text-xs text-muted-foreground">Wrong</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleStart}
                className="w-full py-4 rounded-xl bg-amber-600 text-white font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Try Again
              </button>
              <button className="w-full py-4 rounded-xl border font-semibold">
                Review Mistakes
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}