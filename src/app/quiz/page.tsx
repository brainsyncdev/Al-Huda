"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Clock, Zap, ChevronRight, Check, X, RotateCcw } from "lucide-react";

type QuizState = "home" | "playing" | "result";

interface Question {
  id: number;
  question: string;
  questionUr: string;
  options: string[];
  correct: number;
  explanation: string;
}

const quizCategories = [
  { id: 1, name: "Quran Basics", icon: "📖", questions: 10, difficulty: "Easy" },
  { id: 2, name: "Prophets", icon: "⭐", questions: 15, difficulty: "Medium" },
  { id: 3, name: "Islamic History", icon: "🏛️", questions: 12, difficulty: "Hard" },
  { id: 4, name: "Hadith", icon: "💬", questions: 10, difficulty: "Medium" },
  { id: 5, name: "Daily Duas", icon: "🤲", questions: 8, difficulty: "Easy" },
  { id: 6, name: "99 Names", icon: "✨", questions: 15, difficulty: "Hard" },
];

const questions: Question[] = [
  {
    id: 1,
    question: "How many Surahs are in the Quran?",
    questionUr: "قرآن میں کتنی سورتیں ہیں؟",
    options: ["114", "112", "118", "110"],
    correct: 0,
    explanation: "The Holy Quran contains 114 Surahs (chapters).",
  },
  {
    id: 2,
    question: "Which Surah is known as the 'Heart of the Quran'?",
    questionUr: "کون سی سورت 'قرآن کا دل' کہلاتی ہے؟",
    options: ["Al-Baqarah", "Al-Fatiha", "Yasin", "Al-Ikhlas"],
    correct: 2,
    explanation: "Surah Yasin is often called 'The Heart of the Quran' due to its significance.",
  },
  {
    id: 3,
    question: "Which Prophet is known for dream interpretation?",
    questionUr: "کون سے نبی کو خوابوں کی تعبیر کا علم تھا؟",
    options: ["Prophet Musa (AS)", "Prophet Yusuf (AS)", "Prophet Ibrahim (AS)", "Prophet Muhammad ﷺ"],
    correct: 1,
    explanation: "Prophet Yusuf (AS) was given the ability to interpret dreams.",
  },
  {
    id: 4,
    question: "What is the first Surah revealed to Prophet Muhammad ﷺ?",
    questionUr: "پہلی وحی کون سی تھی؟",
    options: ["Al-Fatiha", "Al-Ikhlas", "Al-Alaq", "Al-Muddaththir"],
    correct: 2,
    explanation: "Surah Al-Alaq (The Clot), particularly verses 1-5, was the first revelation.",
  },
  {
    id: 5,
    question: "How many Makki Surahs are there?",
    questionUr: "کتنی مکی سورتیں ہیں؟",
    options: ["86", "28", "114", "60"],
    correct: 0,
    explanation: "86 Surahs were revealed in Makkah (Makki), while 28 were revealed in Madinah.",
  },
];

export default function QuizPage() {
  const [state, setState] = useState<QuizState>("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const handleStart = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setState("playing");
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setShowAnswer(false);
    setTimeLeft(30);
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
      setTimeLeft(30);
    } else {
      setState("result");
    }
  };

  const accuracy = Math.round((score / questions.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Islamic Quiz</h1>
              <p className="text-xs text-muted-foreground">سوال و جواب — Test Your Knowledge</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {state === "home" && (
          <>
            {/* Stats */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
              <div className="flex items-center gap-4">
                <Trophy className="h-12 w-12" />
                <div>
                  <p className="text-3xl font-bold">Level 5</p>
                  <p className="text-teal-100">Quiz Master</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4 text-center">
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-xs text-teal-100">Quizzes Taken</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">87%</p>
                  <p className="text-xs text-teal-100">Avg Score</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-xs text-teal-100">Day Streak</p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <h3 className="font-semibold mb-4">Choose Category</h3>
            <div className="grid grid-cols-2 gap-4">
              {quizCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleStart(cat.name)}
                  className="bg-card rounded-xl border p-4 text-left hover:shadow-md transition-shadow"
                >
                  <span className="text-3xl mb-3 block">{cat.icon}</span>
                  <h4 className="font-semibold">{cat.name}</h4>
                  <p className="text-sm text-muted-foreground">{cat.questions} Questions</p>
                  <span className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${
                    cat.difficulty === "Easy" ? "bg-emerald-100 text-emerald-700" :
                    cat.difficulty === "Medium" ? "bg-amber-100 text-amber-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {cat.difficulty}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {state === "playing" && (
          <>
            {/* Progress */}
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
                {selectedCategory}
              </span>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{timeLeft}s</span>
              </div>
            </div>

            <div className="w-full bg-teal-100 rounded-full h-2 mb-6">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all"
                style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question */}
            <div className="bg-card rounded-2xl border p-6 mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Question {currentQ + 1} of {questions.length}
              </p>
              <h2 className="text-xl font-semibold mb-2">
                {questions[currentQ].question}
              </h2>
              <p className="urdu-text text-muted-foreground" dir="rtl">
                {questions[currentQ].questionUr}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
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
                      : "border-border hover:border-teal-500 hover:bg-teal-50"
                  }`}
                >
                  <span className="font-medium mr-3">{String.fromCharCode(65 + idx)}.</span>
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

            {/* Explanation */}
            {showAnswer && (
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <h4 className="font-medium mb-1">Explanation</h4>
                <p className="text-amber-800">{questions[currentQ].explanation}</p>
              </div>
            )}

            {showAnswer && (
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-teal-600 text-white font-semibold flex items-center justify-center gap-2"
              >
                {currentQ < questions.length - 1 ? (
                  <>Next Question <ChevronRight className="h-5 w-5" /></>
                ) : (
                  <>See Results</>
                )}
              </button>
            )}
          </>
        )}

        {state === "result" && (
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center">
              <Trophy className="h-16 w-16 text-white" />
            </div>

            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <p className="text-muted-foreground mb-6">{selectedCategory}</p>

            <div className="bg-card rounded-2xl border p-6 mb-6">
              <p className="text-5xl font-bold text-teal-600 mb-2">{accuracy}%</p>
              <p className="text-muted-foreground">
                {score} out of {questions.length} correct
              </p>

              <div className="flex justify-center gap-8 mt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">{score}</p>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-red-600">{questions.length - score}</p>
                  <p className="text-sm text-muted-foreground">Wrong</p>
                </div>
              </div>
            </div>

            {accuracy >= 80 ? (
              <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                <p className="text-emerald-800 font-semibold">🎉 Excellent! Keep it up!</p>
              </div>
            ) : accuracy >= 50 ? (
              <div className="bg-amber-50 rounded-xl p-4 mb-6">
                <p className="text-amber-800 font-semibold">👍 Good effort! Practice more!</p>
              </div>
            ) : (
              <div className="bg-red-50 rounded-xl p-4 mb-6">
                <p className="text-red-800 font-semibold">📚 Keep learning and try again!</p>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={() => handleStart(selectedCategory || "")}
                className="w-full py-4 rounded-xl bg-teal-600 text-white font-semibold flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-5 w-5" />
                Try Again
              </button>
              <button
                onClick={() => setState("home")}
                className="w-full py-4 rounded-xl border font-semibold"
              >
                Choose Different Category
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}