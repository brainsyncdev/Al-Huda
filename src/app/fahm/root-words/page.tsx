"use client";

import { useState } from "react";
import { Search, BookOpen, ChevronRight, TrendingUp, Star } from "lucide-react";
import { rootWords } from "@/data/quran-data";
import Link from "next/link";

export default function RootWordsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const filteredWords = rootWords.filter((word) => {
    const matchesSearch =
      word.rootArabic.includes(searchQuery) ||
      word.rootMeaningUrdu.includes(searchQuery) ||
      word.rootMeaningEnglish.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLevel = selectedLevel === null || word.difficultyLevel === selectedLevel;
    
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              ←
            </Link>
            <div>
              <h1 className="font-semibold">Root Words</h1>
              <p className="text-xs text-muted-foreground">جڑ الفاظ — Arabic Roots</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search roots... جڑ تلاش کریں"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border-0 focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Level Filter */}
          <div className="flex gap-2 mt-4">
            {[
              { id: null, label: "All" },
              { id: 1, label: "Easy" },
              { id: 2, label: "Medium" },
              { id: 3, label: "Hard" },
            ].map((level) => (
              <button
                key={level.id ?? "all"}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedLevel === level.id
                    ? "bg-teal-600 text-white"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">500+</p>
            <p className="text-xs text-muted-foreground">Total Roots</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">70%</p>
            <p className="text-xs text-muted-foreground">Quran Coverage</p>
          </div>
          <div className="bg-card rounded-xl border p-4 text-center">
            <p className="text-2xl font-bold text-teal-600">15</p>
            <p className="text-xs text-muted-foreground">Learned</p>
          </div>
        </div>

        {/* Root Words List */}
        <div className="space-y-4">
          {filteredWords.map((word, index) => (
            <div
              key={word.id}
              className="bg-card rounded-xl border overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center">
                      <span className="arabic-text text-lg text-teal-700" dir="rtl">
                        {word.rootArabic}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold">{word.rootMeaningEnglish}</h3>
                      <p className="text-sm text-muted-foreground urdu-text" dir="rtl">
                        {word.rootMeaningUrdu}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < word.difficultyLevel
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      {word.quranFrequency} times
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Level {word.difficultyLevel}
                    </span>
                  </div>
                  <Link
                    href={`/fahm/root-words/${word.id}`}
                    className="flex items-center gap-1 text-teal-600 font-medium text-sm"
                  >
                    Learn More
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No roots found</p>
            <p className="text-sm text-muted-foreground">تلاش کا نتیجہ نہیں</p>
          </div>
        )}
      </main>
    </div>
  );
}