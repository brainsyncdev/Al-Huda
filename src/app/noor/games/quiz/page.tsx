"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, Trophy, Star, ChevronRight, VolumeX, RefreshCw } from "lucide-react";

interface QuizQuestion {
  id: number;
  question: string;
  questionUrdu: string;
  emoji: string;
  options: string[];
  correct: number;
  funFact?: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "How many Surahs are in the Quran?",
    questionUrdu: "قرآن میں کتنی سورتیں ہیں؟",
    emoji: "📖",
    options: ["99", "114", "120", "100"],
    correct: 1,
    funFact: "The Quran has 114 Surahs! Surah Al-Fatiha is the first and Surah An-Nas is the last."
  },
  {
    id: 2,
    question: "Who built the Kaaba?",
    questionUrdu: "کعبہ کس نے بنایا؟",
    emoji: "🏠",
    options: ["Prophet Muhammad ﷺ", "Prophet Ibrahim (AS)", "Prophet Musa (AS)", "Prophet Isa (AS)"],
    correct: 1,
    funFact: "Prophet Ibrahim (AS) and his son Ismail (AS) built the Kaaba together!"
  },
  {
    id: 3,
    question: "What is the first Surah in the Quran?",
    questionUrdu: "قرآن میں پہلی سورت کون سی ہے؟",
    emoji: "🌟",
    options: ["Surah Yasin", "Surah Al-Baqarah", "Surah Al-Fatiha", "Surah Al-Ikhlas"],
    correct: 2,
    funFact: "Surah Al-Fatiha is also called 'Ummul Kitab' - the Mother of the Book!"
  },
  {
    id: 4,
    question: "How many pillars of Islam are there?",
    questionUrdu: "اسلام کے کتنے ستون ہیں؟",
    emoji: "🏛️",
    options: ["3", "4", "5", "6"],
    correct: 2,
    funFact: "The 5 pillars are: Shahada, Salah, Zakat, Sawm, and Hajj!"
  },
  {
    id: 5,
    question: "Which Surah is equal to one-third of the Quran?",
    questionUrdu: "کون سی سورت قرآن کا ایک تہائی ہے؟",
    emoji: "💎",
    options: ["Surah Al-Falaq", "Surah Al-Ikhlas", "Surah Al-Fatiha", "Surah Al-Baqarah"],
    correct: 1,
    funFact: "Reciting Surah Al-Ikhlas is equal to reciting one-third of the Quran!"
  },
];

export default function KidsQuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showFunFact, setShowFunFact] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [answered, setAnswered] = useState(false);

  const question = questions[currentQ];
  const progress = ((currentQ + 1) / questions.length) * 100;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.correct) {
      setScore(score + 1);
    }
    setShowFunFact(true);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
      setAnswered(false);
      setShowFunFact(false);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setScore(0);
    setSelected(null);
    setAnswered(false);
    setShowResult(false);
    setShowFunFact(false);
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    const emoji = percentage >= 80 ? "🏆" : percentage >= 60 ? "⭐" : "💪";
    const message = percentage >= 80 ? "Amazing!" : percentage >= 60 ? "Good Job!" : "Keep Practicing!";

    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="max-w-md mx-auto px-6 text-center">
          <div className="text-8xl mb-6">{emoji}</div>
          <h2 className="text-3xl font-bold mb-2">{message}</h2>
          <p className="text-muted-foreground mb-8">{message}</p>
          
          <div className="bg-card rounded-2xl border p-6 mb-6">
            <p className="text-6xl font-bold text-purple-600">{percentage}%</p>
            <p className="text-muted-foreground">
              {score} out of {questions.length} correct
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleRestart}
              className="w-full py-4 rounded-xl bg-purple-600 text-white font-semibold flex items-center justify-center gap-2"
            >
              <RefreshCw className="h-5 w-5" />
              Play Again
            </button>
            <Link
              href="/noor"
              className="block w-full py-4 rounded-xl border font-semibold text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/noor/games" className="p-2 -ml-2 rounded-lg hover:bg-purple-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="text-center">
              <p className="font-semibold">Quiz Time!</p>
              <p className="text-xs text-muted-foreground">Question {currentQ + 1}/{questions.length}</p>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-lg hover:bg-purple-100"
            >
              {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>
          </div>

          {/* Progress */}
          <div className="mt-4 h-3 bg-purple-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Score */}
          <div className="flex justify-between mt-2 text-sm">
            <span className="text-purple-600">Score: {score}</span>
            <span className="text-purple-600">🔥 Streak: {score}</span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        {/* Question Card */}
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <div className="text-center mb-6">
            <span className="text-6xl">{question.emoji}</span>
          </div>

          <h2 className="text-xl font-bold text-center mb-2">{question.question}</h2>
          <p className="urdu-text text-lg text-purple-600 text-center mb-4" dir="rtl">
            {question.questionUrdu}
          </p>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered}
                className={`w-full p-4 rounded-xl border-2 text-left font-medium transition-all ${
                  answered
                    ? idx === question.correct
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : idx === selected
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 opacity-50"
                    : "border-gray-200 hover:border-purple-500 hover:bg-purple-50"
                }`}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 mr-3">
                  {String.fromCharCode(65 + idx)}
                </span>
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Fun Fact */}
        {showFunFact && question.funFact && (
          <div className="bg-amber-50 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Did You Know?
            </h3>
            <p className="text-amber-800">{question.funFact}</p>
          </div>
        )}

        {/* Next Button */}
        {answered && (
          <button
            onClick={handleNext}
            className="w-full py-4 rounded-xl bg-purple-600 text-white font-semibold flex items-center justify-center gap-2"
          >
            {currentQ < questions.length - 1 ? (
              <>
                Next Question
                <ChevronRight className="h-5 w-5" />
              </>
            ) : (
              <>
                See Results
                <Trophy className="h-5 w-5" />
              </>
            )}
          </button>
        )}
      </main>
    </div>
  );
}