"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ArrowLeft, TrendingUp, Clock, BookOpen } from "lucide-react";

const suggestions = [
  "Patience in Quran",
  "Forgiveness",
  "Paradise descriptions",
  "Prophet Ibrahim story",
  "Morning duas",
  "Protection from evil",
];

const recentSearches = [
  "Jannah",
  "Sabr",
  "Prophet Musa",
  "Namaz",
];

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/explore" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search topics, ayaat, concepts..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border-0"
                autoFocus
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Recent Searches */}
        {query === "" && (
          <>
            <section className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold">Recent Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="px-4 py-2 rounded-full bg-card border text-sm hover:bg-secondary transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </section>

            {/* Suggestions */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-amber-600" />
                <h3 className="font-semibold">Popular Searches</h3>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setQuery(suggestion)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-card transition-colors text-left"
                  >
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            </section>
          </>
        )}

        {/* Search Results */}
        {query !== "" && (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              Results for "{query}"
            </p>
            
            {/* Topics */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Topics ({3})
              </h4>
              <div className="space-y-3">
                {[
                  { title: "Jannah - The Paradise", ayahCount: 66 },
                  { title: "Paradise Descriptions", ayahCount: 45 },
                  { title: "Entering Jannah", ayahCount: 23 },
                ].map((topic) => (
                  <Link
                    key={topic.title}
                    href="/explore/topic/1"
                    className="block bg-card rounded-xl border p-4"
                  >
                    <h5 className="font-medium">{topic.title}</h5>
                    <p className="text-sm text-muted-foreground">
                      {topic.ayahCount} related ayaat
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            {/* Ayaat */}
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Ayaat ({5})
              </h4>
              <div className="space-y-3">
                {[
                  { surah: "Aal-e-Imran", ayah: "133", arabic: "وَسَارِعُوا إِلَىٰ مَغْفِرَةٍ" },
                  { surah: "Al-Baqarah", ayah: "212", arabic: "زُيِّنَ لِلَّذِينَ كَفَرُوا" },
                  { surah: "Aal-e-Imran", ayah: "185", arabic: "كُلُّ نَفْسٍ ذَائِقَةُ الْمَوْتِ" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href="/quran"
                    className="block bg-card rounded-xl border p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs">
                        {item.surah} {item.ayah}
                      </span>
                      <p className="arabic-text text-right flex-1" dir="rtl">
                        {item.arabic}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}