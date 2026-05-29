"use client";

import Link from "next/link";
import { ArrowLeft, TrendingUp, Calendar, BookOpen, Award, Target } from "lucide-react";

export default function ProgressPage() {
  const weeklyData = [
    { day: "Mon", minutes: 25, goal: 30 },
    { day: "Tue", minutes: 45, goal: 30 },
    { day: "Wed", minutes: 20, goal: 30 },
    { day: "Thu", minutes: 35, goal: 30 },
    { day: "Fri", minutes: 50, goal: 30 },
    { day: "Sat", minutes: 40, goal: 30 },
    { day: "Sun", minutes: 15, goal: 30 },
  ];

  const monthlyStats = [
    { label: "Total Time", value: "12h 30m", change: "+23%", icon: "⏱️" },
    { label: "Pages Read", value: "85", change: "+15%", icon: "📖" },
    { label: "Ayaat Memorized", value: "45", change: "+8%", icon: "🧠" },
    { label: "Words Learned", value: "52", change: "+30%", icon: "📝" },
  ];

  const milestones = [
    { title: "Juz 1 Complete", progress: 100, icon: "🎯" },
    { title: "Juz 2 Complete", progress: 65, icon: "📚" },
    { title: "Learn 100 Words", progress: 52, icon: "📝" },
    { title: "Read 30 Minutes Daily", progress: 5, icon: "🔥" },
  ];

  const maxMinutes = Math.max(...weeklyData.map((d) => d.minutes));

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/profile" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">My Progress</h1>
              <p className="text-xs text-muted-foreground">ترقی — Progress</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Weekly Overview */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">This Week</h2>
              <p className="text-teal-100">ہفتہ وار خلاصہ</p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="font-medium">+18%</span>
            </div>
          </div>

          <div className="flex justify-between items-end h-32">
            {weeklyData.map((data, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div className="w-full flex items-end justify-center" style={{ height: "100px" }}>
                  <div
                    className={`w-8 rounded-t-lg transition-all ${
                      data.minutes >= data.goal
                        ? "bg-white"
                        : "bg-teal-300"
                    }`}
                    style={{ height: `${(data.minutes / maxMinutes) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-teal-100">{data.day}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-white" />
              Goal Met
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-teal-300" />
              Below Goal
            </span>
          </div>
        </div>

        {/* Monthly Stats */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600" />
            Monthly Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {monthlyStats.map((stat) => (
              <div key={stat.label} className="bg-card rounded-xl border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{stat.icon}</span>
                  <span className="text-xs text-emerald-600 font-medium">
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones */}
        <div className="mb-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600" />
            Current Goals
          </h3>
          <div className="space-y-4">
            {milestones.map((milestone, idx) => (
              <div key={idx} className="bg-card rounded-xl border p-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-2xl">
                    {milestone.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{milestone.title}</h4>
                      <span className="text-sm text-muted-foreground">
                        {milestone.progress}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          milestone.progress === 100
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${milestone.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-card rounded-2xl border p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5 text-amber-500" />
            Recent Achievements
          </h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {[
              { icon: "🏆", title: "Week Warrior", desc: "7 days streak" },
              { icon: "📖", title: "First Juz", desc: "Completed" },
              { icon: "⭐", title: "Rising Star", desc: "50 words" },
              { icon: "🌙", title: "Early Bird", desc: "Morning read" },
            ].map((ach, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-28 bg-amber-50 rounded-xl p-3 text-center"
              >
                <span className="text-3xl">{ach.icon}</span>
                <p className="font-medium text-sm mt-2">{ach.title}</p>
                <p className="text-xs text-muted-foreground">{ach.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}