"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Check, ChevronRight, Volume2, Bookmark, Share2, BookOpen, Clock, Star } from "lucide-react";

export default function WeeklyTafsirPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);
  const [currentLesson, setCurrentLesson] = useState(0);

  const weeklyLesson = {
    title: "Understanding Surah Al-Fatiha",
    titleUrdu: "سورۃ الفاتحہ کی تفسیر",
    weekNumber: 15,
    duration: "45 min",
    difficulty: "Intermediate",
    surah: "Al-Fatiha",
    totalAyah: 7,
  };

  const lessons = [
    {
      id: 1,
      title: "Introduction to Surah Al-Fatiha",
      titleUrdu: "سورۃ الفاتحہ کا تعارف",
      duration: "8 min",
      completed: true,
      type: "video",
    },
    {
      id: 2,
      title: "Bismillah - The Foundation",
      titleUrdu: "بسم اللہ - بنیاد",
      duration: "10 min",
      completed: true,
      type: "reading",
    },
    {
      id: 3,
      title: "Al-Hamd - Praise of Allah",
      titleUrdu: "الحمد - اللہ کی تعریف",
      duration: "12 min",
      completed: false,
      type: "video",
    },
    {
      id: 4,
      title: "Rububiyyah - Lordship",
      titleUrdu: "ربوبیت",
      duration: "10 min",
      completed: false,
      type: "reading",
    },
    {
      id: 5,
      title: "Ibadah - Worship",
      titleUrdu: "عبادت",
      duration: "15 min",
      completed: false,
      type: "video",
    },
    {
      id: 6,
      title: "Hidayah - Guidance",
      titleUrdu: "ہدایت",
      duration: "12 min",
      completed: false,
      type: "quiz",
    },
  ];

  const toggleComplete = (id: number) => {
    setCompletedLessons(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const currentLessonData = lessons[currentLesson];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-teal-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Weekly Tafsir</h1>
              <p className="text-xs text-muted-foreground">تفسیر — Weekly Lesson</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Week Header */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <BookOpen className="h-7 w-7" />
            </div>
            <div>
              <p className="text-sm opacity-90">Week {weeklyLesson.weekNumber}</p>
              <h2 className="text-xl font-bold">{weeklyLesson.title}</h2>
              <p className="text-teal-200">{weeklyLesson.titleUrdu}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {weeklyLesson.duration}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                {weeklyLesson.difficulty}
              </span>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
              {completedLessons.length}/{lessons.length} Complete
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-card rounded-xl border p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Weekly Progress</span>
            <span className="text-sm text-muted-foreground">
              {Math.round((completedLessons.length / lessons.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className="bg-teal-500 h-3 rounded-full transition-all"
              style={{ width: `${(completedLessons.length / lessons.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-3 mb-6">
          {lessons.map((lesson, idx) => (
            <div
              key={lesson.id}
              className={`bg-card rounded-xl border overflow-hidden ${
                idx === currentLesson ? "border-teal-500" : ""
              }`}
            >
              <button
                onClick={() => setCurrentLesson(idx)}
                className="w-full p-4 flex items-center gap-4"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  completedLessons.includes(lesson.id)
                    ? "bg-emerald-100 text-emerald-600"
                    : idx === currentLesson
                    ? "bg-teal-100 text-teal-600"
                    : "bg-gray-100"
                }`}>
                  {completedLessons.includes(lesson.id) ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{lesson.title}</p>
                  <p className="text-sm text-muted-foreground urdu-text" dir="rtl">
                    {lesson.titleUrdu}
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {lesson.duration}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-700 text-xs">
                      {lesson.type === "video" ? "🎬 Video" : lesson.type === "reading" ? "📖 Reading" : "✅ Quiz"}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          ))}
        </div>

        {/* Current Lesson Content */}
        <div className="bg-card rounded-2xl border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{currentLessonData.title}</h3>
            <button
              onClick={() => toggleComplete(currentLessonData.id)}
              className={`px-4 py-2 rounded-xl font-medium flex items-center gap-2 ${
                completedLessons.includes(currentLessonData.id)
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-teal-600 text-white"
              }`}
            >
              <Check className="h-4 w-4" />
              {completedLessons.includes(currentLessonData.id) ? "Completed" : "Mark Complete"}
            </button>
          </div>

          {currentLessonData.type === "video" ? (
            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-4">
              <button className="w-16 h-16 rounded-full bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 transition-colors">
                <Play className="h-8 w-8 ml-1" />
              </button>
            </div>
          ) : (
            <div className="bg-teal-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-teal-800">
                This lesson covers the essential concepts of {currentLessonData.title.toLowerCase()}.
                Take your time to understand the material before moving on.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-teal-100 text-teal-700 font-medium flex items-center justify-center gap-2">
              <Volume2 className="h-5 w-5" />
              Audio
            </button>
            <button className="flex-1 py-3 rounded-xl bg-teal-100 text-teal-700 font-medium flex items-center justify-center gap-2">
              <Bookmark className="h-5 w-5" />
              Save
            </button>
            <button className="flex-1 py-3 rounded-xl bg-teal-100 text-teal-700 font-medium flex items-center justify-center gap-2">
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
            disabled={currentLesson === 0}
            className="px-6 py-3 rounded-xl border disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
            disabled={currentLesson === lessons.length - 1}
            className="px-6 py-3 rounded-xl bg-teal-600 text-white font-medium disabled:opacity-50"
          >
            Next Lesson
          </button>
        </div>
      </main>
    </div>
  );
}