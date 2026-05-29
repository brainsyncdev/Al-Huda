"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Play, Check, Share2, Bookmark, Volume2 } from "lucide-react";

const dailyLessons = [
  {
    id: 1,
    day: "Day 1",
    title: "Introduction to Tajweed",
    titleUr: "تجوید کا تعارف",
    duration: "10 min",
    completed: true,
    content: {
      arabic: "تَجْوِيدُ الْقُرْآنِ عِبَادَةٌ",
      translation: "Beautifying the Quran recitation is worship",
      explanation: "Tajweed means to recite the Quran in the way it was revealed to Prophet Muhammad ﷺ. It is not just about correct pronunciation, but also about understanding the rules of recitation.",
    },
  },
  {
    id: 2,
    day: "Day 2",
    title: "Rules of Noon Sakinah",
    titleUr: "نون ساکنہ کے قواعد",
    duration: "15 min",
    completed: true,
    content: {
      arabic: "النُّون السَّاكِنَةُ وَالتَّنْوِينُ",
      translation: "The Silent Noon and the Tanween",
      explanation: "When you see the letters noon (ن) with sukoon or tanween, there are 4 rules: Izhar, Ikhfa, Iqlaab, and Idghaam.",
    },
  },
  {
    id: 3,
    day: "Day 3",
    title: "Izhar (Clear Pronunciation)",
    titleUr: "اظہار",
    duration: "12 min",
    completed: false,
    content: {
      arabic: "اظْهَارُ الْحُرُوفِ",
      translation: "Clear pronunciation of letters",
      explanation: "Izhar means to pronounce every letter clearly without any nasal sound. It occurs when noon sakinah or tanween is followed by one of the six throat letters: ء، هـ، ع، ح، غ، خ",
    },
  },
];

export default function DailyLessonPage() {
  const [currentLesson, setCurrentLesson] = useState(2);
  const [completed, setCompleted] = useState<number[]>([1]);

  const lesson = dailyLessons.find((l) => l.id === currentLesson) || dailyLessons[0];
  const isCompleted = completed.includes(lesson.id);

  const markComplete = () => {
    if (!isCompleted) {
      setCompleted([...completed, lesson.id]);
    }
  };

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
              <h1 className="font-semibold">Daily Lesson</h1>
              <p className="text-xs text-muted-foreground">روزانہ سبق — Learning Path</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-sm text-teal-100">Your Progress</p>
              <p className="text-2xl font-bold">{completed.length}/30 Days</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-teal-100">Current Streak</p>
              <p className="text-2xl font-bold">🔥 {completed.length}</p>
            </div>
          </div>
          <div className="w-full bg-teal-400 rounded-full h-2">
            <div
              className="bg-white h-2 rounded-full transition-all"
              style={{ width: `${(completed.length / 30) * 100}%` }}
            />
          </div>
          <p className="text-sm text-teal-100 mt-2 text-center">
            Complete 30 days to earn certificate
          </p>
        </div>

        {/* Current Lesson */}
        <div className="bg-card rounded-2xl border overflow-hidden mb-6">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-700 text-xs font-medium">
                {lesson.day}
              </span>
              <h2 className="font-semibold mt-2">{lesson.title}</h2>
              <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                {lesson.titleUr}
              </p>
            </div>
            <span className="text-sm text-muted-foreground">{lesson.duration}</span>
          </div>

          <div className="p-6">
            {/* Arabic */}
            <div className="bg-teal-50 rounded-xl p-4 mb-4 text-center">
              <p className="arabic-text text-2xl mb-2" dir="rtl">
                {lesson.content.arabic}
              </p>
              <p className="text-teal-700">{lesson.content.translation}</p>
            </div>

            {/* Explanation */}
            <div className="mb-6">
              <h3 className="font-medium mb-2">Explanation</h3>
              <p className="text-muted-foreground">{lesson.content.explanation}</p>
            </div>

            {/* Audio */}
            <button className="w-full py-3 rounded-xl bg-teal-100 text-teal-700 font-medium flex items-center justify-center gap-2 mb-4">
              <Volume2 className="h-5 w-5" />
              Listen to Recitation
            </button>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={markComplete}
                disabled={isCompleted}
                className={`flex-1 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                  isCompleted
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-teal-600 text-white hover:bg-teal-700"
                }`}
              >
                <Check className="h-5 w-5" />
                {isCompleted ? "Completed!" : "Mark Complete"}
              </button>
              <button className="p-3 rounded-xl border">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-3 rounded-xl border">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lesson List */}
        <div>
          <h3 className="font-semibold mb-4">All Lessons</h3>
          <div className="space-y-3">
            {dailyLessons.map((l) => (
              <button
                key={l.id}
                onClick={() => setCurrentLesson(l.id)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-colors ${
                  currentLesson === l.id ? "bg-teal-50 border-teal-200" : "bg-card"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    completed.includes(l.id)
                      ? "bg-emerald-500 text-white"
                      : currentLesson === l.id
                      ? "bg-teal-600 text-white"
                      : "bg-secondary"
                  }`}
                >
                  {completed.includes(l.id) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{l.title}</p>
                  <p className="text-sm text-muted-foreground">{l.duration}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}