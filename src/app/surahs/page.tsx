"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ChevronRight,
  BookOpen,
  Headphones,
  Star,
  Clock,
} from "lucide-react";

// Sample Surah data
const surahs = [
  {
    number: 1,
    name: "Al-Fatiha",
    englishName: "The Opening",
    arabicName: "الفاتحة",
    verses: 7,
    revelationType: "Meccan",
    audioDuration: "1:30",
  },
  {
    number: 2,
    name: "Al-Baqarah",
    englishName: "The Cow",
    arabicName: "البقرة",
    verses: 286,
    revelationType: "Medinan",
    audioDuration: "58:00",
  },
  {
    number: 3,
    name: "Aal-E-Imran",
    englishName: "The Family of Imran",
    arabicName: "آل عمران",
    verses: 200,
    revelationType: "Medinan",
    audioDuration: "42:00",
  },
  {
    number: 4,
    name: "An-Nisa",
    englishName: "The Women",
    arabicName: "النساء",
    verses: 176,
    revelationType: "Medinan",
    audioDuration: "36:00",
  },
  {
    number: 5,
    name: "Al-Ma'idah",
    englishName: "The Table Spread",
    arabicName: "المائدة",
    verses: 120,
    revelationType: "Medinan",
    audioDuration: "25:00",
  },
  {
    number: 6,
    name: "Al-An'am",
    englishName: "The Cattle",
    arabicName: "الأنعام",
    verses: 165,
    revelationType: "Meccan",
    audioDuration: "34:00",
  },
  {
    number: 7,
    name: "Al-A'raf",
    englishName: "The Heights",
    arabicName: "الأعراف",
    verses: 206,
    revelationType: "Meccan",
    audioDuration: "42:00",
  },
  {
    number: 36,
    name: "Ya-Sin",
    englishName: "Ya Sin",
    arabicName: "يس",
    verses: 83,
    revelationType: "Meccan",
    audioDuration: "18:00",
  },
  {
    number: 55,
    name: "Ar-Rahman",
    englishName: "The Most Gracious",
    arabicName: "الرحمٰن",
    verses: 78,
    revelationType: "Medinan",
    audioDuration: "16:00",
  },
  {
    number: 67,
    name: "Al-Mulk",
    englishName: "The Sovereignty",
    arabicName: "المُلک",
    verses: 30,
    revelationType: "Meccan",
    audioDuration: "6:00",
  },
  {
    number: 112,
    name: "Al-Ikhlas",
    englishName: "Sincerity",
    arabicName: "الإخلاص",
    verses: 4,
    revelationType: "Meccan",
    audioDuration: "0:45",
  },
  {
    number: 114,
    name: "An-Nas",
    englishName: "Mankind",
    arabicName: "الناس",
    verses: 6,
    revelationType: "Meccan",
    audioDuration: "1:00",
  },
];

type FilterType = "all" | "meccan" | "medinan";

export default function SurahsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<"number" | "name">("number");

  const filteredSurahs = surahs
    .filter((surah) => {
      const matchesSearch =
        surah.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.arabicName.includes(searchQuery) ||
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        surah.revelationType.toLowerCase() === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortBy === "number") return a.number - b.number;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="min-h-screen bg-emerald-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-emerald-950/95 backdrop-blur-lg border-b border-emerald-800/50">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              ← Back
            </Link>
            <h1 className="text-xl font-bold text-white">All Surahs</h1>
            <div className="w-12"></div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
            <input
              type="text"
              placeholder="Search Surahs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-emerald-900/50 border border-emerald-800/50 text-white placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === "all"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50"
              }`}
            >
              All (114)
            </button>
            <button
              onClick={() => setFilter("meccan")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === "meccan"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50"
              }`}
            >
              Meccan (86)
            </button>
            <button
              onClick={() => setFilter("medinan")}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                filter === "medinan"
                  ? "bg-emerald-500 text-white"
                  : "bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50"
              }`}
            >
              Medinan (28)
            </button>
            <div className="flex-1"></div>
            <button
              onClick={() => setSortBy(sortBy === "number" ? "name" : "number")}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-emerald-900/50 text-emerald-300 hover:bg-emerald-800/50 transition-all"
            >
              <Filter className="w-4 h-4" />
              {sortBy === "number" ? "By Number" : "By Name"}
            </button>
          </div>
        </div>
      </header>

      {/* Surahs List */}
      <main className="px-4 py-6 pb-24">
        <div className="space-y-3">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.number}
              href={`/surah/${surah.number}`}
              className="group block bg-gradient-to-r from-emerald-900/40 to-teal-900/40 rounded-2xl p-4 border border-emerald-800/30 hover:border-emerald-600/50 hover:from-emerald-800/50 hover:to-teal-800/50 transition-all"
            >
              <div className="flex items-center gap-4">
                {/* Surah Number */}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg group-hover:shadow-emerald-500/20 transition-shadow">
                  <span className="text-white font-bold text-lg">
                    {surah.number}
                  </span>
                </div>

                {/* Surah Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      {surah.name}
                    </h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        surah.revelationType === "Meccan"
                          ? "bg-amber-500/20 text-amber-300"
                          : "bg-blue-500/20 text-blue-300"
                      }`}
                    >
                      {surah.revelationType}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400/70 text-sm">
                    <span className="arabic-text text-xl">{surah.arabicName}</span>
                    <span>•</span>
                    <span>{surah.verses} verses</span>
                  </div>
                </div>

                {/* Audio Duration */}
                <div className="text-right">
                  <div className="flex items-center gap-2 text-emerald-400/60 text-sm mb-2">
                    <Clock className="w-4 h-4" />
                    <span>{surah.audioDuration}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Play audio
                    }}
                    className="w-10 h-10 rounded-full bg-emerald-800/50 flex items-center justify-center text-emerald-400 hover:bg-emerald-700/50 hover:text-emerald-300 transition-all"
                  >
                    <Headphones className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              No Surahs Found
            </h3>
            <p className="text-emerald-400">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-emerald-950/95 backdrop-blur-lg border-t border-emerald-800/50">
        <div className="max-w-lg mx-auto px-6 py-4">
          <div className="flex items-center justify-around">
            <Link href="/" className="flex flex-col items-center gap-1 text-emerald-300/60 hover:text-emerald-300 transition-colors">
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs">Home</span>
            </Link>
            <Link href="/surahs" className="flex flex-col items-center gap-1 text-emerald-400">
              <BookOpen className="w-6 h-6" />
              <span className="text-xs">Surahs</span>
            </Link>
            <Link href="/juz" className="flex flex-col items-center gap-1 text-emerald-300/60 hover:text-emerald-300 transition-colors">
              <SunIcon className="w-6 h-6" />
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
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}