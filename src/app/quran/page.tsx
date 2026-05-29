"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Filter, Volume2, Bookmark, Clock } from "lucide-react";
import { realSurahs, type RealSurah } from "@/data/real-quran-data";

type FilterType = "all" | "makki" | "madani";
type SortType = "number" | "name" | "verses";

export default function QuranPage() {
  const [surahs, setSurahs] = useState<RealSurah[]>(realSurahs);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [sort, setSort] = useState<SortType>("number");

  // Filter and search
  const filteredSurahs = surahs
    .filter((surah) => {
      const matchesSearch =
        surah.nameEnglish.toLowerCase().includes(search.toLowerCase()) ||
        surah.nameArabic.includes(search) ||
        surah.transliteration.toLowerCase().includes(search.toLowerCase());
      const matchesFilter =
        filter === "all" || surah.revelationType.toLowerCase() === filter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sort === "number") return a.id - b.id;
      if (sort === "verses") return b.totalVerses - a.totalVerses;
      return a.nameEnglish.localeCompare(b.nameEnglish);
    });

  const makkiCount = surahs.filter((s) => s.revelationType === "Makki").length;
  const madaniCount = surahs.filter((s) => s.revelationType === "Madani").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-semibold">The Holy Quran</h1>
              <p className="text-xs text-muted-foreground">القرآن الکریم — 114 Surahs</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-secondary">
                <Bookmark className="h-5 w-5" />
              </button>
              <Link href="/quran/reading" className="p-2 rounded-lg hover:bg-secondary">
                <Volume2 className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search Surah name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-secondary/50 border-0"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2">
            <div className="flex bg-secondary/50 rounded-xl p-1">
              {(["all", "makki", "madani"] as FilterType[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f ? "bg-white shadow" : "hover:bg-white/50"
                  }`}
                >
                  {f === "all" ? "All" : f === "makki" ? "Makki" : "Madani"}
                </button>
              ))}
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortType)}
              className="px-3 py-1.5 rounded-xl bg-secondary/50 border-0 text-sm"
            >
              <option value="number">By Number</option>
              <option value="name">By Name</option>
              <option value="verses">By Verses</option>
            </select>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-4 mb-6 text-white">
          <div className="flex justify-around text-center">
            <div>
              <p className="text-2xl font-bold">{surahs.length}</p>
              <p className="text-sm text-teal-100">Total Surahs</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{makkiCount}</p>
              <p className="text-sm text-teal-100">Makki</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{madaniCount}</p>
              <p className="text-sm text-teal-100">Madani</p>
            </div>
          </div>
        </div>

        {/* Surah List */}
        <div className="space-y-3">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.id}
              href={`/quran/${surah.id}`}
              className="block bg-card rounded-2xl border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex items-center gap-4">
                {/* Surah Number */}
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
                  <span className="text-lg font-bold text-teal-700">{surah.id}</span>
                </div>

                {/* Surah Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{surah.nameEnglish}</h3>
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${
                        surah.revelationType === "Makki"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {surah.revelationType}
                    </span>
                  </div>
                  <p className="arabic-text text-lg text-teal-600" dir="rtl">
                    {surah.nameArabic}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {surah.transliteration} • {surah.totalVerses} verses
                  </p>
                </div>

                {/* Arabic Name */}
                <div className="text-right">
                  <p className="arabic-text text-2xl text-teal-700" dir="rtl">
                    {surah.nameArabic}
                  </p>
                </div>
              </div>

              {/* Bismillah indicator */}
              {surah.bismillah && (
                <div className="px-4 pb-3">
                  <p className="arabic-text text-sm text-muted-foreground text-center" dir="rtl">
                    بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                  </p>
                </div>
              )}
            </Link>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No surahs found</p>
          </div>
        )}
      </main>
    </div>
  );
}