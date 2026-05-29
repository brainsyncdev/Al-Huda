"use client";

import Link from "next/link";
import { Settings, Trophy, Star, TrendingUp } from "lucide-react";

export default function ProfilePage() {
  const stats = [
    { label: "Quran Read", value: "15", unit: "Juz", icon: "📖", color: "teal" },
    { label: "Day Streak", value: "47", unit: "days", icon: "🔥", color: "amber" },
    { label: "Words Learned", value: "230", unit: "words", icon: "📝", color: "purple" },
    { label: "Time Spent", value: "42", unit: "hours", icon: "⏱️", color: "blue" },
  ];

  const achievements = [
    { title: "First Steps", desc: "Read 1 complete Surah", earned: true, icon: "🎯" },
    { title: "Consistent Reader", desc: "7 day streak", earned: true, icon: "⭐" },
    { title: "Word Master", desc: "Learn 100 root words", earned: true, icon: "🏆" },
    { title: "Hafiz Beginner", desc: "Memorize 50 ayaat", earned: false, icon: "📿" },
    { title: "Scholar", desc: "Complete all categories", earned: false, icon: "🎓" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-semibold">Profile</h1>
          <Link href="/settings" className="p-2 rounded-lg hover:bg-secondary">
            <Settings className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* User Info */}
        <div className="bg-card rounded-2xl border p-6 mb-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-2xl font-bold mb-4">
            ع
          </div>
          <h2 className="text-xl font-bold">Ahmed Khan</h2>
          <p className="urdu-text text-muted-foreground mb-4" dir="rtl">
            احمد خان
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-medium">
              Level 5 Learner
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-card rounded-xl border p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-amber-500 text-xs">+12% this week</span>
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.unit}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly Progress */}
        <div className="bg-card rounded-2xl border p-4 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">This Week</h3>
            <TrendingUp className="h-5 w-5 text-teal-600" />
          </div>
          <div className="flex justify-between">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
              <div key={idx} className="text-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    idx < 5 ? "bg-teal-600 text-white" : "bg-teal-100 text-teal-600"
                  }`}
                >
                  {idx < 5 ? "✓" : ""}
                </div>
                <p className="text-xs text-muted-foreground mt-1">{day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-amber-500" />
            <h3 className="font-semibold">Achievements</h3>
          </div>
          <div className="space-y-3">
            {achievements.map((ach, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-4 p-4 rounded-xl border ${
                  ach.earned ? "bg-amber-50 border-amber-200" : "bg-card"
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <h4 className={`font-medium ${!ach.earned && "text-muted-foreground"}`}>
                    {ach.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">{ach.desc}</p>
                </div>
                {ach.earned ? (
                  <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
                ) : (
                  <span className="text-sm text-muted-foreground">🔒</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Learning Path */}
        <div className="bg-card rounded-2xl border overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="font-semibold">Learning Path</h3>
          </div>
          <div className="p-4 space-y-4">
            {[
              { step: 1, title: "Quran Basics", done: true },
              { step: 2, title: "Reading Practice", done: true },
              { step: 3, title: "Root Words", done: true },
              { step: 4, title: "Translation", done: false },
              { step: 5, title: "Memorization", done: false },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    item.done
                      ? "bg-teal-600 text-white"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {item.done ? "✓" : item.step}
                </div>
                <span className={item.done ? "" : "text-muted-foreground"}>
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}