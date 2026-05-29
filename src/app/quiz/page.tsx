"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, RotateCcw, ChevronRight, Check, X } from "lucide-react";
import { quizQuestions, quizCategories } from "@/data/quiz-data";

type QuizState = "home" | "playing" | "result";

export default function QuizPage() {
  const [state, setState] = useState<QuizState>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);

  const filteredQuestions = selectedCategory === "all"
    ? quizQuestions
    : quizQuestions.filter((q) => q.category === selectedCategory);

  const question = filteredQuestions[currentQ];

  const handleStart = () => {
    setState("playing");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    setAnsweredQuestions([]);
  };

  const handleSelect = (idx: number) => {
    if (showAnswer) return;
    setSelected(idx);
    setShowAnswer(true);
    setAnsweredQuestions([...answeredQuestions, question.id]);
    if (idx === question.correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < filteredQuestions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setShowAnswer(false);
    } else {
      setState("result");
    }
  };

  const accuracy = filteredQuestions.length > 0
    ? Math.round((score / filteredQuestions.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Islamic Quiz</h1>
              <p className="text-xs text-muted-foreground">سوال و جواب — Test Knowledge</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {state === "home" && (
          <>
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white mb-6 text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Test Your Islamic Knowledge</h2>
              <p className="text-indigo-200">
                {quizQuestions.length} Questions from Quran, Hadith & History
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {quizCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`bg-card rounded-xl border p-4 text-left ${
                    selectedCategory === cat.id ? "border-indigo-500 bg-indigo-50" : ""
                  }`}
                >
                  <span className="text-2xl mb-2 block">{cat.icon}</span>
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cat.id === "all"
                      ? `${quizQuestions.length} questions`
                      : `${quizQuestions.filter((q) => q.category === cat.id).length} questions`}
                  </p>
                </button>
              ))}
            </div>

            <button
              onClick={handleStart}
              className="w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold"
            >
              Start Quiz ({filteredQuestions.length} Questions)
            </button>
          </>
        )}

        {state === "playing" && question && (
          <>
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium">
                {question.category}
              </span>
              <span className="text-sm text-muted-foreground">
                {currentQ + 1}/{filteredQuestions.length}
              </span>
            </div>

            <div className="w-full bg-indigo-100 rounded-full h-2 mb-6">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>

            <div className="bg-card rounded-2xl border p-6 mb-4">
              <p className="text-lg font-medium mb-4">{question.question}</p>
              <p className="urdu-text text-muted-foreground text-sm" dir="rtl">
                {question.questionUrdu}
              </p>
            </div>

            <div className="space-y-3">
              {question.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  disabled={showAnswer}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    showAnswer
                      ? idx === question.correct
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : idx === selected
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "opacity-50"
                      : "hover:border-indigo-500 hover:bg-indigo-50"
                  }`}
                >
                  <span className="font-medium mr-3">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  {option}
                  {showAnswer && idx === question.correct && (
                    <Check className="h-5 w-5 text-emerald-500 float-right" />
                  )}
                  {showAnswer && idx === selected && idx !== question.correct && (
                    <X className="h-5 w-5 text-red-500 float-right" />
                  )}
                </button>
              ))}
            </div>

            {showAnswer && (
              <div className="mt-6 space-y-4">
                <div className="bg-indigo-50 rounded-xl p-4">
                  <p className="font-medium mb-2">Explanation</p>
                  <p className="text-sm text-gray-700">{question.explanation}</p>
                  <p className="urdu-text text-sm text-gray-600 mt-2" dir="rtl">
                    {question.explanationUrdu}
                  </p>
                </div>

                <button
                  onClick={handleNext}
                  className="w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold"
                >
                  {currentQ < filteredQuestions.length - 1 ? "Next Question" : "See Results"}
                </button>
              </div>
            )}
          </>
        )}

        {state === "result" && (
          <div className="text-center">
            <Trophy className="h-20 w-20 mx-auto mb-4 text-amber-500" />

            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>

            <div className="bg-card rounded-2xl border p-6 mb-6">
              <p className="text-5xl font-bold text-indigo-600 mb-2">{accuracy}%</p>
              <p className="text-muted-foreground">
                {score} out of {filteredQuestions.length} correct
              </p>
            </div>

            {accuracy >= 80 && (
              <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                <p className="text-emerald-700 font-medium">
                  🎉 Excellent! Keep learning!
                </p>
              </div>
            )}

            {accuracy >= 50 && accuracy < 80 && (
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-amber-700 font-medium">
                  👍 Good effort! Continue studying.
                </p>
              </div>
            )}

            {accuracy < 50 && (
              <div className="bg-red-50 rounded-xl p-4 mb-6">
                <p className="text-red-700 font-medium">
                  📚 Keep striving! Practice makes perfect.
                </p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={handleStart}
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Try Again
              </button>
              <button
                onClick={() => setState("home")}
                className="w-full py-4 rounded-xl border font-medium"
              >
                Change Category
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}