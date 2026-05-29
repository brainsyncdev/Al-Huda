"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Headphones,
  Calendar,
  Star,
  ChevronRight,
  Moon,
  Sun,
  Heart,
  Clock,
  Award,
  Landmark,
} from "lucide-react";

// Sample data for daily verse
const dailyVerse = {
  arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
  translation:
    "In the name of Allah, the Most Gracious, the Most Merciful",
  surah: "Al-Fatiha",
  ayah: 1,
};

// Sample featured Surahs
const featuredSurahs = [
  {
    number: 1,
    name: "Al-Fatiha",
    englishName: "The Opening",
    verses: 7,
    type: "Meccan",
    color: "from-emerald-500 to-teal-600",
  },
  {
    number: 36,
    name: "Ya-Sin",
    englishName: "Ya Sin",
    verses: 83,
    type: "Meccan",
    color: "from-blue-500 to-indigo-600",
  },
  {
    number: 67,
    name: "Al-Mulk",
    englishName: "The Sovereignty",
    verses: 30,
    type: "Meccan",
    color: "from-purple-500 to-pink-600",
  },
  {
    number: 55,
    name: "Ar-Rahman",
    englishName: "The Most Gracious",
    verses: 78,
    type: "Medinan",
    color: "from-amber-500 to-orange-600",
  },
];

// Progress data
const progressData = {
  totalRead: 12,
  totalSurahs: 114,
  streak: 7,
  lastRead: "Al-Baqarah",
};

export default function HomePage() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950">
      {/* Decorative Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIiBmaWxsPSIjZmZmIi8+Cjwvc3ZnPg==')]"></div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Al-Huda</h1>
              <p className="text-emerald-300 text-sm">Islamic Quran Learning</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-emerald-800/50 backdrop-blur-sm flex items-center justify-center text-emerald-300 hover:bg-emerald-700/50 transition-colors">
              <Moon className="w-5 h-5" />
            </button>
            <div className="bg-emerald-800/50 backdrop-blur-sm rounded-full px-4 py-2 text-emerald-300 text-sm">
              <Calendar className="w-4 h-4 inline mr-2" />
              <span id="hijri-date">15 Ramadan 1446</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Daily Verse */}
      <section className="relative z-10 px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-800/40 to-teal-800/40 backdrop-blur-md rounded-3xl p-8 border border-emerald-700/30 shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-emerald-600/30 rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 text-amber-400" />
                <span className="text-emerald-200 text-sm">Verse of the Day</span>
              </div>
              <h2 className="text-4xl font-bold text-white mb-4 arabic-text leading-loose">
                {dailyVerse.arabic}
              </h2>
              <p className="text-emerald-200 text-lg italic">
                "{dailyVerse.translation}"
              </p>
              <p className="text-emerald-400 mt-2">
                — {dailyVerse.surah}, Ayah {dailyVerse.ayah}
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 py-3 rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                <Headphones className="w-5 h-5" />
                {isPlaying ? "Pause Recitation" : "Listen to Recitation"}
              </button>
              <Link
                href="/surah/1"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-all backdrop-blur-sm"
              >
                <BookOpen className="w-5 h-5" />
                Read Full Surah
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Section */}
      <section className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-xl font-semibold text-white mb-4">Your Progress</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-700/40 to-emerald-800/40 backdrop-blur-sm rounded-2xl p-5 border border-emerald-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/30 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-emerald-300" />
                </div>
                <span className="text-emerald-300 text-sm">Surahs Read</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {progressData.totalRead}
                <span className="text-lg text-emerald-400 ml-1">
                  /{progressData.totalSurahs}
                </span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-700/40 to-orange-800/40 backdrop-blur-sm rounded-2xl p-5 border border-amber-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/30 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-amber-300 text-sm">Day Streak</span>
              </div>
              <p className="text-3xl font-bold text-white">
                {progressData.streak}
                <span className="text-lg text-amber-400 ml-1">days</span>
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-700/40 to-indigo-800/40 backdrop-blur-sm rounded-2xl p-5 border border-blue-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/30 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-300" />
                </div>
                <span className="text-blue-300 text-sm">Last Read</span>
              </div>
              <p className="text-xl font-bold text-white truncate">
                {progressData.lastRead}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-700/40 to-pink-800/40 backdrop-blur-sm rounded-2xl p-5 border border-purple-600/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <Heart className="w-5 h-5 text-purple-300" />
                </div>
                <span className="text-purple-300 text-sm">Favorite</span>
              </div>
              <p className="text-xl font-bold text-white">Ya-Sin</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Surahs */}
      <section className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-white">Featured Surahs</h3>
            <Link
              href="/surahs"
              className="flex items-center gap-2 text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              View All
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredSurahs.map((surah) => (
              <Link
                key={surah.number}
                href={`/surah/${surah.number}`}
                className="group relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                <div className="absolute top-0 right-0 w-24 h-24 opacity-10 transform translate-x-8 -translate-y-8">
                  <div className="w-full h-full rounded-full bg-white"></div>
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-white/90 text-sm">
                      {surah.number}
                    </span>
                    <Star className="w-5 h-5 text-white/60 group-hover:text-amber-400 transition-colors" />
                  </div>
                  <h4 className="text-2xl font-bold text-white mb-1">
                    {surah.name}
                  </h4>
                  <p className="text-white/80 text-sm mb-3">{surah.englishName}</p>
                  <div className="flex items-center gap-4 text-white/70 text-xs">
                    <span>{surah.verses} verses</span>
                    <span>•</span>
                    <span>{surah.type}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/surahs"
              className="bg-emerald-800/40 backdrop-blur-sm rounded-2xl p-6 border border-emerald-700/30 hover:bg-emerald-700/40 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center mb-4 group-hover:bg-emerald-500/30 transition-colors">
                <BookOpen className="w-7 h-7 text-emerald-300" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">
                All Surahs
              </h4>
              <p className="text-emerald-300 text-sm">Browse 114 Surahs</p>
            </Link>

            <Link
              href="/juz"
              className="bg-blue-800/40 backdrop-blur-sm rounded-2xl p-6 border border-blue-700/30 hover:bg-blue-700/40 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/30 transition-colors">
                <Sun className="w-7 h-7 text-blue-300" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">Juz Amma</h4>
              <p className="text-blue-300 text-sm">Last 30 Parahs</p>
            </Link>

            <Link
              href="/bookmarks"
              className="bg-amber-800/40 backdrop-blur-sm rounded-2xl p-6 border border-amber-700/30 hover:bg-amber-700/40 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4 group-hover:bg-amber-500/30 transition-colors">
                <Star className="w-7 h-7 text-amber-300" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">Bookmarks</h4>
              <p className="text-amber-300 text-sm">Saved verses</p>
            </Link>

            <Link
              href="/settings"
              className="bg-purple-800/40 backdrop-blur-sm rounded-2xl p-6 border border-purple-700/30 hover:bg-purple-700/40 transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/20 flex items-center justify-center mb-4 group-hover:bg-purple-500/30 transition-colors">
                <Moon className="w-7 h-7 text-purple-300" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-1">Settings</h4>
              <p className="text-purple-300 text-sm">Customize app</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-emerald-950/95 backdrop-blur-lg border-t border-emerald-800/50">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 text-emerald-400">
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/surahs" className="flex flex-col items-center gap-1 text-emerald-300/60 hover:text-emerald-300 transition-colors">
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Surahs</span>
            </Link>
            <Link href="/juz" className="flex flex-col items-center gap-1 text-emerald-300/60 hover:text-emerald-300 transition-colors">
              <Sun className="w-6 h-6" />
              <span className="text-xs">Juz</span>
            </Link>
            <Link href="/bookmarks" className="flex flex-col items-center gap-1 text-emerald-300/60 hover:text-emerald-300 transition-colors">
              <Star className="w-6 h-6" />
              <span className="text-xs">Saved</span>
            </Link>
            <Link href="/profile" className="flex flex-col items-center gap-1 text-emerald-300/60 hover:text-emerald-300 transition-colors">
              <UserIcon className="w-6 h-6" />
              <span className="text-xs">Profile</span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

// Simple icon components
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}