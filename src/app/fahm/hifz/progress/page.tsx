"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Target, Clock, TrendingUp, ChevronRight, Check, BookOpen, Star } from "lucide-react";

export default function HifzProgressPage() {
  const [selectedPara, setSelectedPara] = useState(1);

  const progress = {
    totalMemorized: 156,
    totalVerses: 6236,
    percentage: 2.5,
    currentStreak: 7,
    longestStreak: 21,
    accuracy: 87,
    weakAreas: 5,
  };

  const paras = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    name: `Para ${i + 1}`,
    nameArabic: ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس", "السابع"][i % 7] || `Para ${i + 1}`,
    memorized: Math.floor(Math.random() * 50) + 10,
    total: 40,
    status: i < 2 ? "completed" : i < 5 ? "in-progress" : "not-started",
  }));

  const weakAreas = [
    { surah: "Al-Baqarah", ayah: "255-256", topic: "Ayat al-Kursi", accuracy: 45 },
    { surah: "Al-Imran", ayah: "1-5", topic: "Beginning of Surah", accuracy: 52 },
    { surah: "Yasin", ayah: "Full Surah", topic: "Entire Surah", accuracy: 38 },
  ];

  const recentMemorizations = [
    { date: "Today", surah: "Al-Falaq", ayah: "1-5", accuracy: 95 },
    { date: "Yesterday", surah: "Al-Falaq", ayah: "1-5", accuracy: 88 },
    { date: "Mar 13", surah: "Al-Ikhlas", ayah: "Full", accuracy: 100 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/fahm/hifz" className="p-2 -ml-2 rounded-lg hover:bg-emerald-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Hifz Progress</h1>
              <p className="text-xs text-muted-foreground">حفظ کی پیش رفت — Memorization</p>
            </div>
            <Link href="/fahm/hifz" className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 text-sm font-medium">
              Start Quiz
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Overall Progress */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <p className="text-sm opacity-90">Total Memorized</p>
              <p className="text-4xl font-bold">{progress.totalMemorized} verses</p>
              <p className="text-sm opacity-80">{progress.percentage}% of the Quran</p>
            </div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-4 mb-4">
            <div
              className="bg-white h-4 rounded-full transition-all"
              style={{ width: `${progress.percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xl font-bold">{progress.currentStreak}</p>
              <p className="text-xs opacity-80">Day Streak</p>
            </div>
            <div>
              <p className="text-xl font-bold">{progress.longestStreak}</p>
              <p className="text-xs opacity-80">Best Streak</p>
            </div>
            <div>
              <p className="text-xl font-bold">{progress.accuracy}%</p>
              <p className="text-xs opacity-80">Accuracy</p>
            </div>
            <div>
              <p className="text-xl font-bold">{progress.weakAreas}</p>
              <p className="text-xs opacity-80">Weak Areas</p>
            </div>
          </div>
        </div>

        {/* Recent Memorizations */}
        <div className="bg-card rounded-xl border p-4 mb-6">
          <h3 className="font-semibold mb-4">Recent Memorizations</h3>
          <div className="space-y-3">
            {recentMemorizations.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  item.accuracy >= 90 ? "bg-emerald-100 text-emerald-600" :
                  item.accuracy >= 70 ? "bg-amber-100 text-amber-600" :
                  "bg-red-100 text-red-600"
                }`}>
                  {item.accuracy >= 90 ? <Check className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.surah} {item.ayah}</p>
                  <p className="text-sm text-muted-foreground">{item.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.accuracy >= 90 ? "bg-emerald-100 text-emerald-700" :
                  item.accuracy >= 70 ? "bg-amber-100 text-amber-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {item.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Para Progress */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-emerald-600" />
            Para Progress
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {paras.slice(0, 18).map((para) => (
              <button
                key={para.id}
                onClick={() => setSelectedPara(para.id)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-colors ${
                  para.status === "completed"
                    ? "bg-emerald-500 text-white"
                    : para.status === "in-progress"
                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-500"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                <span className="text-xs font-medium">{para.id}</span>
                {para.status === "completed" && <Check className="h-3 w-3 mt-0.5" />}
              </button>
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            2 completed • 3 in progress • 25 remaining
          </p>
        </div>

        {/* Weak Areas */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-red-500" />
            Areas Needing Practice
          </h3>
          <div className="space-y-3">
            {weakAreas.map((area, idx) => (
              <div key={idx} className="bg-card rounded-xl border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded bg-red-100 text-red-700 text-sm">
                    {area.surah} {area.ayah}
                  </span>
                  <span className="text-red-600 font-medium">{area.accuracy}%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{area.topic}</p>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
                    style={{ width: `${area.accuracy}%` }}
                  />
                </div>
                <button className="mt-3 text-sm text-emerald-600 font-medium">
                  Practice This →
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-amber-50 rounded-xl p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Hifz Tips
          </h3>
          <ul className="text-sm text-amber-800 space-y-1">
            <li>• Review yesterday&apos;s memorization before learning new verses</li>
            <li>• Listen to audio while sleeping to reinforce memorization</li>
            <li>• Practice weak areas for 10 minutes daily</li>
          </ul>
        </div>
      </main>
    </div>
  );
}