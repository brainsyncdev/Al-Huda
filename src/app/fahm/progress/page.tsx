"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Flame, Target, Calendar, TrendingUp, BookOpen, Award } from "lucide-react";

export default function ProgressPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month" | "year">("week");

  const stats = {
    totalRead: 45,
    totalMemorized: 12,
    currentStreak: 7,
    longestStreak: 21,
    ayaatLearned: 156,
    surahsCompleted: 3,
  };

  const weeklyProgress = [
    { day: "Mon", read: true, practiced: true, quiz: false },
    { day: "Tue", read: true, practiced: true, quiz: true },
    { day: "Wed", read: true, practiced: false, quiz: true },
    { day: "Thu", read: true, practiced: true, quiz: true },
    { day: "Fri", read: true, practiced: true, quiz: false },
    { day: "Sat", read: false, practiced: false, quiz: false },
    { day: "Sun", read: true, practiced: true, quiz: true },
  ];

  const achievements = [
    { id: 1, title: "First Steps", description: "Complete 1 page of Quran", emoji: "🌟", unlocked: true },
    { id: 2, title: "Consistent Reader", description: "7 day streak", emoji: "📖", unlocked: true },
    { id: 3, title: "Hifz Beginner", description: "Memorize 10 ayaat", emoji: "🧠", unlocked: true },
    { id: 4, title: "Halfway There", description: "Complete Surah Al-Fatiha", emoji: "🎯", unlocked: false },
    { id: 5, title: "Master Memorizer", description: "Memorize 100 ayaat", emoji: "🏆", unlocked: false },
    { id: 6, title: "One Juz Complete", description: "Complete 1 para", emoji: "📚", unlocked: false },
  ];

  const recentActivity = [
    { type: "read", title: "Read Surah Al-Baqarah", time: "2 hours ago", icon: "📖" },
    { type: "hifz", title: "Memorized 3 new ayaat", time: "Yesterday", icon: "🧠" },
    { type: "quiz", title: "Scored 85% in quiz", time: "2 days ago", icon: "✅" },
    { type: "read", title: "Completed tafsir of Al-Falaq", time: "3 days ago", icon: "📚" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">My Progress</h1>
              <p className="text-xs text-muted-foreground">پیش رفت — Tracking</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Main Stats */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6">
          <div className="text-center mb-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-3">
              <Trophy className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold">Great Progress!</h2>
            <p className="opacity-90">Keep up the momentum</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.totalRead}</p>
              <p className="text-sm opacity-90">Pages Read</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold flex items-center justify-center gap-1">
                <Flame className="h-6 w-6" />
                {stats.currentStreak}
              </p>
              <p className="text-sm opacity-90">Day Streak</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.ayaatLearned}</p>
              <p className="text-sm opacity-90">Ayaat Memorized</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-3xl font-bold">{stats.surahsCompleted}</p>
              <p className="text-sm opacity-90">Surahs Done</p>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-card rounded-xl border p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-teal-600" />
              This Week
            </h3>
            <span className="text-sm text-muted-foreground">
              {weeklyProgress.filter(d => d.read).length}/7 days
            </span>
          </div>

          <div className="flex justify-between">
            {weeklyProgress.map((day, idx) => (
              <div key={idx} className="text-center">
                <div className="w-10 h-10 mx-auto rounded-full bg-secondary flex items-center justify-center mb-2">
                  {day.read ? (
                    <span className="text-lg">✅</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">{day.day[0]}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{day.day}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl border p-4 text-center">
            <Target className="h-6 w-6 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-600">85%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <TrendingUp className="h-6 w-6 text-teal-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-teal-600">+12</p>
            <p className="text-xs text-muted-foreground">This Week</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <Award className="h-6 w-6 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-amber-500">3</p>
            <p className="text-xs text-muted-foreground">Badges</p>
          </div>
        </div>

        {/* Achievements */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Achievements
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-card rounded-xl border p-4 text-center ${
                  !achievement.unlocked ? "opacity-50" : ""
                }`}
              >
                <span className="text-3xl mb-2 block">{achievement.emoji}</span>
                <p className="font-medium text-sm">{achievement.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                {achievement.unlocked && (
                  <span className="inline-block mt-2 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs">
                    Unlocked
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="bg-card rounded-xl border p-4 flex items-center gap-3">
                <span className="text-2xl">{activity.icon}</span>
                <div className="flex-1">
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}