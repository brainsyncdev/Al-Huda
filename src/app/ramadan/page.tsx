"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Moon, Check, Flame, Calendar } from "lucide-react";

export default function RamadanPage() {
  const [completedDays, setCompletedDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  
  const totalDays = 30;
  const currentDay = 11;
  const completedCount = completedDays.length;

  const toggleDay = (day: number) => {
    setCompletedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const getDayStatus = (day: number) => {
    if (completedDays.includes(day)) return "completed";
    if (day === currentDay) return "today";
    if (day < currentDay) return "missed";
    return "upcoming";
  };

  return (
    <div className="min-h-h-screen bg-gradient-to-b from-indigo-900 to-indigo-800 text-white">
      <header className="px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-semibold">Ramadan Tracker</h1>
            <p className="text-xs text-indigo-200">رمضان کی پیگیری</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Moon className="h-8 w-8 text-amber-400" />
              <div>
                <h2 className="text-xl font-bold">Ramadan 1446</h2>
                <p className="text-indigo-200">رمضان المبارک</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{completedCount}/{totalDays}</p>
              <p className="text-indigo-200 text-sm">Days Fasted</p>
            </div>
          </div>

          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div
              className="bg-amber-400 h-3 rounded-full transition-all"
              style={{ width: `${(completedCount / totalDays) * 100}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-indigo-200">
            <span>{Math.round((completedCount / totalDays) * 100)}% Complete</span>
            <span>{totalDays - completedCount} days remaining</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Flame className="h-6 w-6 text-amber-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{completedCount}</p>
            <p className="text-xs text-indigo-200">Fasted</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Check className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{completedCount * 27}</p>
            <p className="text-xs text-indigo-200">Good Deeds</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <Calendar className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">23</p>
            <p className="text-xs text-indigo-200">Sunnah Followed</p>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendar
          </h3>
          <div className="grid grid-cols-6 gap-2">
            {Array.from({ length: totalDays }).map((_, idx) => {
              const day = idx + 1;
              const status = getDayStatus(day);
              return (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                    status === "completed"
                      ? "bg-emerald-500 text-white"
                      : status === "today"
                      ? "bg-amber-500 text-white ring-2 ring-white"
                      : status === "missed"
                      ? "bg-red-500/30 text-red-200"
                      : "bg-white/10 hover:bg-white/20"
                  }`}
                >
                  {day}
                  {status === "completed" && <Check className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-500" /> Fasted
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-amber-500" /> Today
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-red-500/30" /> Missed
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4 mt-6">
          <h3 className="font-semibold mb-4">Today's Checklist</h3>
          <div className="space-y-3">
            {[
              { task: "Fajr Prayer", done: true },
              { task: "Read Quran (1 page)", done: true },
              { task: "Taraweeh", done: false },
              { task: "Night Prayer", done: false },
              { task: "Charity", done: false },
            ].map((item, idx) => (
              <button key={idx} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  item.done ? "bg-emerald-500 border-emerald-500" : "border-white/50"
                }`}>
                  {item.done && <Check className="h-4 w-4" />}
                </div>
                <span className={item.done ? "line-through opacity-50" : ""}>
                  {item.task}
                </span>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}