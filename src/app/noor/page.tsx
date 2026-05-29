"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronRight, Star, BookOpen, Sparkles, Trophy, Heart, Play } from "lucide-react";
import { stories } from "@/data/quran-data";

export default function NoorPage() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">🌙</span>
            </div>
            <div>
              <h1 className="font-semibold">NOOR</h1>
              <p className="text-xs text-muted-foreground">نور — Kids Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
            <Trophy className="h-4 w-4" />
            <span>5 Day Streak! 🔥</span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <p className="arabic-text text-2xl text-purple-600 mb-2" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <h2 className="text-xl font-bold mb-1">Welcome, little learner! 🌟</h2>
          <p className="text-muted-foreground">آج کیا سیکھیں گے؟</p>
        </motion.div>

        {/* Today's Story Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">آج کی کہانی</h3>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-xl bg-white/20 flex items-center justify-center text-4xl">
                  ⭐
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold mb-1">حضرت یوسف علیہ السلام</h4>
                  <p className="text-white/80 text-sm mb-3">Prophet Yusuf's Story</p>
                  <p className="text-sm mb-4">Episode 3 — The Well</p>
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-purple-600 font-semibold">
                      <Play className="h-4 w-4" />
                      سنیں
                    </button>
                    <span className="text-sm text-white/80">5 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Word of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">آج کا لفظ ✨</h3>
          <div className="bg-card rounded-xl p-4 border">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center">
                <span className="arabic-text text-2xl text-purple-600" dir="rtl">صَبَرَ</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-1">Sabara — صَبَرَ</p>
                <p className="text-sm text-muted-foreground">To be patient</p>
                <p className="text-xs text-purple-600 mt-1">Quran mein 90+ baar aaya hai</p>
              </div>
              <Sparkles className="h-5 w-5 text-purple-500" />
            </div>
          </div>
        </motion.div>

        {/* Stories Library */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">کہانیاں</h3>
            <button className="text-sm text-purple-600 font-medium">View All</button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {stories.slice(0, 4).map((story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-card rounded-xl border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-purple-100 to-purple-50 flex items-center justify-center text-4xl">
                  {index === 0 && "⭐"}
                  {index === 1 && "⛵"}
                  {index === 2 && "🔥"}
                  {index === 3 && "🐟"}
                </div>
                <div className="p-3">
                  <h4 className="font-semibold text-sm mb-1" dir="rtl">
                    {story.prophetNameUr} علیہ السلام
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {story.totalEpisodes} Episodes
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Parent Dashboard Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Link
            href="/noor/parent"
            className="flex items-center justify-between p-4 bg-secondary/50 rounded-xl hover:bg-secondary transition-colors"
          >
            <div>
              <p className="font-medium">Parent Dashboard</p>
              <p className="text-sm text-muted-foreground">Progress & Settings</p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
        </motion.div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          {[
            { icon: Star, label: "Home", active: true },
            { icon: BookOpen, label: "Stories", active: false },
            { icon: Sparkles, label: "Words", active: false },
            { icon: Trophy, label: "Progress", active: false },
            { icon: Heart, label: "Saved", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-purple-600" : "text-muted-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}