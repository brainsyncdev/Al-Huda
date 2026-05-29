"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Bookmark, Share2, Volume2, Check, ChevronRight, Flame } from "lucide-react";
import { realSurahs } from "@/data/real-quran-data";

export default function DailyDosePage() {
  const [completed, setCompleted] = useState<string[]>([]);
  const [currentTab, setCurrentTab] = useState<"ayah" | "word" | "story">("ayah");

  const dailyAyah = {
    surah: "Al-Baqarah",
    ayahNumber: 152,
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ",
    translation: "So remember Me; I will remember you. And be grateful to Me and do not deny Me.",
    urdu: "پس تم مجھے یاد کرو میں بھی تمہیں یاد کروں گا اور میرے شکرگزار رہو اور میرانکر نہ کرو",
    lesson: "This verse teaches us that Allah promises to remember those who remember Him. Our connection with Allah depends on our remembrance of Him.",
    benefits: [
      "Increases barakah in life",
      "Strengthens relationship with Allah",
      "Removes stress and anxiety"
    ]
  };

  const words = [
    { arabic: "الصلاة", transliteration: "As-Salah", meaning: "Prayer", occurrence: "99 times" },
    { arabic: "القرآن", transliteration: "Al-Quran", meaning: "The Recitation", occurrence: "70 times" },
    { arabic: "الجنة", transliteration: "Al-Jannah", meaning: "Paradise", occurrence: "66 times" },
  ];

  const stories = [
    { title: "Prophet Yunus (AS)", excerpt: "The story of patience in the belly of the whale...", emoji: "🐋" },
    { title: "Prophet Ibrahim (AS)", excerpt: "The ultimate test of faith and sacrifice...", emoji: "🔥" },
  ];

  const toggleComplete = (id: string) => {
    setCompleted(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Daily Dose</h1>
              <p className="text-xs text-muted-foreground">روزانہ کی تعلیم — Daily Learning</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm">
              <Flame className="h-4 w-4" />
              7 Day Streak
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Streak Banner */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Today&apos;s Goal</p>
              <p className="text-2xl font-bold">Learn 3 Things</p>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Progress</p>
              <p className="text-2xl font-bold">2/3</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { id: "ayah", label: "Ayah", icon: "📖" },
            { id: "word", label: "Word", icon: "📝" },
            { id: "story", label: "Story", icon: "📚" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as typeof currentTab)}
              className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                currentTab === tab.id
                  ? "bg-teal-600 text-white"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {currentTab === "ayah" && (
          <div className="space-y-6">
            {/* Featured Ayah */}
            <div className="bg-card rounded-2xl border overflow-hidden">
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 p-4 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-sm opacity-90">📖 Today&apos;s Ayah</span>
                  <span className="text-sm opacity-90">Day 15</span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-4">
                  <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm">
                    {dailyAyah.surah} {dailyAyah.ayahNumber}
                  </span>
                </div>

                <p className="arabic-text text-2xl text-center mb-4" dir="rtl">
                  {dailyAyah.arabic}
                </p>

                <div className="flex justify-center gap-3 mb-4">
                  <button className="p-3 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors">
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button className="p-3 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors">
                    <Bookmark className="h-5 w-5" />
                  </button>
                  <button className="p-3 rounded-full bg-teal-100 text-teal-600 hover:bg-teal-200 transition-colors">
                    <Share2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="bg-teal-50 rounded-xl p-4 mb-4">
                  <p className="text-teal-800 text-center mb-2">{dailyAyah.translation}</p>
                  <p className="text-sm text-teal-600 text-center urdu-text" dir="rtl">
                    {dailyAyah.urdu}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2">💡 Today&apos;s Lesson</h4>
                  <p className="text-sm text-muted-foreground">{dailyAyah.lesson}</p>
                </div>

                <div className="bg-amber-50 rounded-xl p-4 mb-4">
                  <h4 className="font-medium mb-2">✨ Benefits of This Ayah</h4>
                  <ul className="space-y-1">
                    {dailyAyah.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
                        <span className="text-amber-500">•</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  onClick={() => toggleComplete("ayah-1")}
                  className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                    completed.includes("ayah-1")
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-teal-600 text-white"
                  }`}
                >
                  <Check className="h-5 w-5" />
                  {completed.includes("ayah-1") ? "Completed!" : "Mark as Learned"}
                </button>
              </div>
            </div>

            {/* More Ayaat */}
            <div className="space-y-3">
              <h3 className="font-semibold">More Ayaat to Explore</h3>
              {[
                { surah: "Al-Hashr", ayah: 24, text: "هُوَ اللَّهُ الْخَالِقُ الْبَارِئُ الْمُصَوِّرُ" },
                { surah: "Ar-Ra'd", ayah: 28, text: "أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ" },
              ].map((item, idx) => (
                <div key={idx} className="bg-card rounded-xl border p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{item.surah} {item.ayah}</p>
                    <p className="arabic-text text-lg text-right mt-1" dir="rtl">{item.text}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === "word" && (
          <div className="space-y-4">
            <div className="bg-card rounded-xl border p-4 mb-4">
              <p className="text-sm text-muted-foreground mb-2">Today&apos;s Root Word</p>
              <p className="arabic-text text-3xl text-teal-600" dir="rtl">ذَكَرْ</p>
              <p className="text-lg font-medium mt-2">Dhikr / Remembrance</p>
            </div>

            {words.map((word, idx) => (
              <div key={idx} className="bg-card rounded-xl border p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                      <span className="arabic-text text-lg text-teal-700" dir="rtl">
                        {word.arabic}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{word.transliteration}</p>
                      <p className="text-sm text-muted-foreground">{word.meaning}</p>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded bg-secondary text-sm text-muted-foreground">
                    {word.occurrence}
                  </span>
                </div>
                <button
                  onClick={() => toggleComplete(`word-${idx}`)}
                  className={`w-full py-2 rounded-lg font-medium ${
                    completed.includes(`word-${idx}`)
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-teal-600 text-white"
                  }`}
                >
                  {completed.includes(`word-${idx}`) ? "✓ Learned" : "Mark as Learned"}
                </button>
              </div>
            ))}
          </div>
        )}

        {currentTab === "story" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white text-center mb-6">
              <p className="text-4xl mb-3">📚</p>
              <h2 className="text-xl font-bold">Prophet Stories</h2>
              <p className="opacity-90">Learn from the best examples</p>
            </div>

            {stories.map((story, idx) => (
              <div key={idx} className="bg-card rounded-xl border p-4 flex items-center gap-4">
                <span className="text-4xl">{story.emoji}</span>
                <div className="flex-1">
                  <p className="font-semibold">{story.title}</p>
                  <p className="text-sm text-muted-foreground">{story.excerpt}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}