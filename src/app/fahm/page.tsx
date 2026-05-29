"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Sparkles, Heart, Search, Lightbulb, ChevronRight, Play, Target, Users } from "lucide-react";
import { themes } from "@/data/quran-data";

export default function FahmPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-600 to-teal-700 flex items-center justify-center">
              <span className="text-white font-bold text-lg">📖</span>
            </div>
            <div>
              <h1 className="font-semibold">FAHM</h1>
              <p className="text-xs text-muted-foreground">فہم — Understanding Mode</p>
            </div>
          </div>
          <Link
            href="/quran"
            className="px-4 py-2 rounded-lg bg-teal-100 text-teal-700 text-sm font-medium"
          >
            Read Quran
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-24">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-8"
        >
          <p className="arabic-text text-2xl text-teal-600 mb-2" dir="rtl">
            السَّلاَمُ عَلَيْكُمْ
          </p>
          <h2 className="text-xl font-bold mb-1">Your Quran Journey Continues</h2>
          <p className="text-muted-foreground">آج قرآن سے کیا سیکھیں گے؟</p>
        </motion.div>

        {/* Continue Reading Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-card rounded-2xl border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">جاری ہے</h3>
              <span className="text-sm text-muted-foreground">48% complete</span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold">Surah Al-Baqarah</p>
                <p className="text-sm text-muted-foreground">Verse 153 — آیت ۱۵۳</p>
              </div>
            </div>

            <div className="w-full bg-secondary rounded-full h-2 mb-4">
              <div className="bg-teal-600 h-2 rounded-full w-[48%]" />
            </div>

            <Link
              href="/quran/2"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
            >
              <Play className="h-4 w-4" />
              Continue Reading
            </Link>
          </div>
        </motion.div>

        {/* Guidance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">آج کی رہنمائی ✨</h3>
          <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Search className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="font-semibold mb-2">Ask the Quran</p>
                <p className="text-white/80 text-sm mb-4">
                  "Aap ki zindagi mein kya chal raha hai? Quran se poochhein."
                </p>
                <Link
                  href="/fahm/guidance"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-teal-600 font-medium text-sm"
                >
                  <Lightbulb className="h-4 w-4" />
                  قرآن سے پوچھیں
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Root Word of the Day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold mb-4">آج کی جڑ 🌱</h3>
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-teal-100 flex items-center justify-center">
                <span className="arabic-text text-lg text-teal-600" dir="rtl">ر-ح-م</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold">Rahima — رحمت</p>
                <p className="text-sm text-muted-foreground">Mercy / Compassion</p>
                <p className="text-xs text-teal-600 mt-1">Quran mein 338 baar aaya hai</p>
              </div>
              <Target className="h-5 w-5 text-teal-500" />
            </div>
          </div>
        </motion.div>

        {/* Explore Themes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Explore Themes</h3>
            <Link href="/fahm/themes" className="text-sm text-teal-600 font-medium">
              View All
            </Link>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2">
            {themes.slice(0, 5).map((theme) => (
              <Link
                key={theme.id}
                href={`/explore/theme/${theme.nameEnglish.toLowerCase()}`}
                className="flex-shrink-0 px-4 py-3 rounded-xl bg-card border hover:shadow-md transition-shadow"
              >
                <span className="text-2xl block mb-1">{theme.icon}</span>
                <p className="text-sm font-medium urdu-text" dir="rtl">{theme.nameUrdu}</p>
                <p className="text-xs text-muted-foreground">{theme.totalAyaat} ayaat</p>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <Link
            href="/fahm/hifz"
            className="flex items-center gap-3 p-4 bg-card rounded-xl border"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium">Hifz Engine</p>
              <p className="text-xs text-muted-foreground">Smart memorization</p>
            </div>
          </Link>

          <Link
            href="/fahm/journal"
            className="flex items-center gap-3 p-4 bg-card rounded-xl border"
          >
            <div className="w-10 h-10 rounded-lg bg-pink-100 flex items-center justify-center">
              <Heart className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <p className="font-medium">Journal</p>
              <p className="text-xs text-muted-foreground">Your Quran notes</p>
            </div>
          </Link>
        </motion.div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          {[
            { icon: BookOpen, label: "Quran", active: true },
            { icon: Lightbulb, label: "Guidance", active: false },
            { icon: Sparkles, label: "Learn", active: false },
            { icon: Users, label: "Graph", active: false },
            { icon: Heart, label: "Journal", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-teal-600" : "text-muted-foreground"
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