"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, Check, Volume2, RotateCcw, Eye, EyeOff } from "lucide-react";

const practiceLessons = [
  {
    id: 1,
    title: "Harakat (Diacritics)",
    titleUr: "حرکات",
    description: "Learn the short vowel marks",
    progress: 80,
    total: 10,
    icon: "🎯",
    color: "teal",
  },
  {
    id: 2,
    title: "Tanween",
    titleUr: "تنوین",
    description: "The doubled diacritical marks",
    progress: 60,
    total: 8,
    icon: "✨",
    color: "blue",
  },
  {
    id: 3,
    title: "Sukoon (Jazzm)",
    titleUr: "سکون",
    description: "The silent marker",
    progress: 40,
    total: 6,
    icon: "🤫",
    color: "purple",
  },
  {
    id: 4,
    title: "Shaddah",
    titleUr: "شدد",
    description: "The doubled letter mark",
    progress: 20,
    total: 5,
    icon: "💫",
    color: "amber",
  },
  {
    id: 5,
    title: "Tashkeel Review",
    titleUr: "تجویز",
    description: "Complete reading practice",
    progress: 0,
    total: 12,
    icon: "📖",
    color: "emerald",
  },
];

export default function ReadingPage() {
  const [showArabic, setShowArabic] = useState(true);
  const [currentLetter, setCurrentLetter] = useState(0);

  const letters = [
    { arabic: "بَ", transliteration: "ba", urdu: "بے" },
    { arabic: "تَ", transliteration: "ta", urdu: "تے" },
    { arabic: "ثَ", transliteration: "tha", urdu: "ثے" },
    { arabic: "جَ", transliteration: "jeem", urdu: "جیم" },
    { arabic: "حَ", transliteration: "ha", urdu: "حے" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                ←
              </Link>
              <div>
                <h1 className="font-semibold">Reading Practice</h1>
                <p className="text-xs text-muted-foreground">تلاوت — Recitation</p>
              </div>
            </div>
            <button
              onClick={() => setShowArabic(!showArabic)}
              className="p-2 rounded-lg bg-secondary"
            >
              {showArabic ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Reading Card */}
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <div className="text-center mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Tap to see pronunciation
            </p>
            <div className="w-32 h-32 mx-auto rounded-2xl bg-teal-100 flex items-center justify-center mb-4">
              <span className="arabic-text text-5xl text-teal-700">
                {letters[currentLetter].arabic}
              </span>
            </div>
            <p className="text-2xl font-semibold text-teal-600">
              {letters[currentLetter].transliteration}
            </p>
            <p className="urdu-text text-lg text-muted-foreground" dir="rtl">
              {letters[currentLetter].urdu}
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl border font-medium flex items-center justify-center gap-2">
              <Volume2 className="h-5 w-5" />
              Listen
            </button>
            <button
              onClick={() => setCurrentLetter((c) => (c + 1) % letters.length)}
              className="flex-1 py-3 rounded-xl border font-medium flex items-center justify-center gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              Next
            </button>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {letters.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentLetter(idx)}
              className={`w-3 h-3 rounded-full transition-colors ${
                idx === currentLetter ? "bg-teal-600" : "bg-teal-200"
              }`}
            />
          ))}
        </div>

        {/* Lessons */}
        <h3 className="font-semibold mb-4">Lessons</h3>
        <div className="space-y-4">
          {practiceLessons.map((lesson) => (
            <Link
              key={lesson.id}
              href={`/fahm/reading/${lesson.id}`}
              className="block bg-card rounded-xl border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl bg-${lesson.color}-100 flex items-center justify-center text-2xl`}>
                    {lesson.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{lesson.title}</h4>
                    <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                      {lesson.titleUr}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {lesson.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="font-medium">
                      {lesson.progress}% ({lesson.total} exercises)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`bg-${lesson.color}-500 h-2 rounded-full transition-all`}
                      style={{ width: `${lesson.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}