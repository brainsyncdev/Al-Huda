"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Check, Flame, Target } from "lucide-react";

const goodDeeds = [
  {
    id: 1,
    name: "Quran Reading",
    nameUr: "قرآن پڑھنا",
    target: 30,
    current: 25,
    unit: "minutes",
    icon: "📖",
    color: "teal",
  },
  {
    id: 2,
    name: "Salah (Prayer)",
    nameUr: "نماز",
    target: 5,
    current: 5,
    unit: "prayers",
    icon: "🕌",
    color: "emerald",
  },
  {
    id: 3,
    name: "Charity",
    nameUr: "صدقہ",
    target: 1000,
    current: 500,
    unit: "Rupees",
    icon: "💚",
    color: "green",
  },
  {
    id: 4,
    name: "Dhikr",
    nameUr: "ذکر",
    target: 100,
    current: 45,
    unit: "times",
    icon: "📿",
    color: "purple",
  },
  {
    id: 5,
    name: "Fast Reading",
    nameUr: "روزہ",
    target: 30,
    current: 0,
    unit: "pages",
    icon: "🌅",
    color: "amber",
  },
];

export default function AmalPage() {
  const [deeds, setDeeds] = useState(goodDeeds);
  const [showAdd, setShowAdd] = useState(false);

  const totalProgress = Math.round(
    (deeds.reduce((acc, d) => acc + (d.current / d.target) * 100, 0) / deeds.length)
  );

  const incrementDeed = (id: number) => {
    setDeeds(deeds.map(d => 
      d.id === id ? { ...d, current: Math.min(d.current + 1, d.target) } : d
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">Good Deeds Tracker</h1>
                <p className="text-xs text-muted-foreground">نیک اعمال — Amal</p>
              </div>
            </div>
            <button
              onClick={() => setShowAdd(!showAdd)}
              className="p-2 rounded-lg bg-emerald-600 text-white"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress Overview */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold">Today's Progress</h2>
              <p className="text-emerald-100">آج کی پیش رفت</p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6" />
              <span className="text-2xl font-bold">7 day streak</span>
            </div>
          </div>
          
          <div className="flex items-end gap-4">
            <p className="text-5xl font-bold">{totalProgress}%</p>
            <p className="text-emerald-100 mb-1">complete</p>
          </div>
          
          <div className="w-full bg-emerald-400 rounded-full h-3 mt-4">
            <div
              className="bg-white h-3 rounded-full transition-all"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>

        {/* Deeds List */}
        <div className="space-y-4">
          {deeds.map((deed) => {
            const progress = Math.round((deed.current / deed.target) * 100);
            const isComplete = progress >= 100;

            return (
              <div
                key={deed.id}
                className="bg-card rounded-2xl border overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-2xl">
                      {deed.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{deed.name}</h3>
                      <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                        {deed.nameUr}
                      </p>
                    </div>
                    {isComplete && (
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">
                        {deed.current} / {deed.target} {deed.unit}
                      </span>
                      <span className={`font-medium ${isComplete ? "text-emerald-600" : ""}`}>
                        {progress}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isComplete ? "bg-emerald-500" : "bg-emerald-400"
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={() => incrementDeed(deed.id)}
                    disabled={isComplete}
                    className={`w-full py-2 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors ${
                      isComplete
                        ? "bg-emerald-100 text-emerald-600"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    {isComplete ? (
                      <>
                        <Check className="h-4 w-4" />
                        Complete! مکمل
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        Add {deed.unit.replace(/s$/, "")}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-amber-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Target className="h-5 w-5 text-amber-600" />
            Daily Tip
          </h3>
          <p className="text-sm text-amber-800">
            "The best among you are those who learn the Quran and teach it." 
            <span className="urdu-text block mt-1" dir="rtl">— حدیث</span>
          </p>
        </div>
      </main>
    </div>
  );
}