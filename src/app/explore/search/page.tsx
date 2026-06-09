"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, X, Clock, TrendingUp, BookOpen, Mic } from "lucide-react";

interface SearchResult {
  type: "surah" | "hadith" | "dua" | "story" | "word";
  title: string;
  subtitle: string;
  link: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [recentSearches] = useState([
    "Surah Al-Fatiha",
    "Prophet Ibrahim",
    "Morning duas",
    "Ayat al-Kursi",
  ]);

  const trendingSearches = [
    "How to read Quran",
    "99 Names of Allah",
    "Daily duas",
    "Prophet stories",
    "Prayer times",
  ];

  const searchResults: SearchResult[] = [
    { type: "surah", title: "Al-Fatiha", subtitle: "7 Verses • The Opening", link: "/quran/1" },
    { type: "surah", title: "Al-Baqarah", subtitle: "286 Verses • The Cow", link: "/quran/2" },
    { type: "hadith", title: "Intention", subtitle: "Sahih Bukhari #1", link: "/hadith/1" },
    { type: "dua", title: "Before Sleeping", subtitle: "Daily duas", link: "/fahm/duas" },
    { type: "story", title: "Prophet Ibrahim (AS)", subtitle: "Stories • 12 Episodes", link: "/noor/story/2" },
  ].filter(r => r.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search Quran, Hadith, Duas..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-gray-100 border-0 focus:ring-2 focus:ring-blue-500"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              )}
            </div>
            <button className="p-3 rounded-xl bg-gray-100">
              <Mic className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Results */}
        {query ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {searchResults.length} results for &quot;{query}&quot;
            </p>
            <div className="space-y-3">
              {searchResults.map((result, idx) => (
                <Link
                  key={idx}
                  href={result.link}
                  className="block bg-card rounded-xl border p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    result.type === "surah" ? "bg-emerald-100 text-emerald-600" :
                    result.type === "hadith" ? "bg-indigo-100 text-indigo-600" :
                    result.type === "dua" ? "bg-amber-100 text-amber-600" :
                    result.type === "story" ? "bg-purple-100 text-purple-600" :
                    "bg-blue-100 text-blue-600"
                  }`}>
                    {result.type === "surah" ? "📖" :
                     result.type === "hadith" ? "📚" :
                     result.type === "dua" ? "🤲" :
                     result.type === "story" ? "📜" : "📝"}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{result.title}</p>
                    <p className="text-sm text-muted-foreground">{result.subtitle}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-xs capitalize">
                    {result.type}
                  </span>
                </Link>
              ))}
            </div>

            {searchResults.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No results found</p>
                <p className="text-sm text-muted-foreground">Try different keywords</p>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* Recent Searches */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  Recent Searches
                </h3>
                <button className="text-sm text-blue-600">Clear All</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(search)}
                    className="px-4 py-2 rounded-full bg-gray-100 text-sm hover:bg-gray-200 transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-pink-500" />
                Trending Searches
              </h3>
              <div className="space-y-3">
                {trendingSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(search)}
                    className="w-full bg-card rounded-xl border p-4 flex items-center gap-4 hover:shadow-md transition-shadow text-left"
                  >
                    <span className="text-lg">🔍</span>
                    <span className="font-medium">{search}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            <div className="mt-8">
              <h3 className="font-semibold mb-4">Quick Access</h3>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: "Quran", emoji: "📖", link: "/quran" },
                  { label: "Hadith", emoji: "📚", link: "/hadith" },
                  { label: "Duas", emoji: "🤲", link: "/fahm/duas" },
                  { label: "Stories", emoji: "📜", link: "/noor/stories" },
                ].map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.link}
                    className="bg-card rounded-xl border p-4 text-center hover:shadow-md transition-shadow"
                  >
                    <span className="text-2xl mb-1 block">{item.emoji}</span>
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}