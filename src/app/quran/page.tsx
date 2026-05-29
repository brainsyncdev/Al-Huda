"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Filter, BookOpen, ChevronRight, Moon, Sun } from "lucide-react";
import { surahs } from "@/data/quran-data";

export default function QuranPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "meccan" | "medinan">("all");

  const filteredSurahs = surahs.filter((surah) => {
    const matchesSearch =
      surah.nameArabic.includes(searchQuery) ||
      surah.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.nameUrdu.includes(searchQuery);
    
    const matchesFilter = filter === "all" || surah.revelationType === filter;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-lg" dir="rtl">ھ</span>
              </div>
              <div>
                <h1 className="font-semibold">Al-Huda</h1>
                <p className="text-xs text-muted-foreground">القرآن</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary">
              <Moon className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search surahs... تلاش کریں"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border-0 focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {[
              { id: "all", label: "All (114)" },
              { id: "meccan", label: "Makki (86)" },
              { id: "medinan", label: "Madani (28)" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as typeof filter)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === f.id
                    ? "bg-primary text-white"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Surah List */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-3">
          {filteredSurahs.map((surah) => (
            <Link
              key={surah.id}
              href={`/quran/${surah.id}`}
              className="flex items-center gap-4 p-4 bg-card rounded-xl border hover:shadow-md transition-shadow"
            >
              {/* Surah Number */}
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center font-bold text-lg">
                {surah.id}
              </div>

              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{surah.transliteration}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      surah.revelationType === "meccan"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-emerald-100 text-emerald-700"
                    }`}
                  >
                    {surah.revelationType === "meccan" ? "Makki" : "Madani"}
                  </span>
                </div>
                <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                  {surah.nameArabic} • {surah.totalVerses} آیات
                </p>
              </div>

              {/* Arabic Name */}
              <div className="text-right">
                <p className="arabic-text text-2xl text-primary" dir="rtl">
                  {surah.nameArabic}
                </p>
              </div>

              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No surahs found</p>
            <p className="text-sm text-muted-foreground">تلاش کا نتیجہ نہیں</p>
          </div>
        )}
      </main>

      {/* Bottom Nav Placeholder */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t">
        <div className="max-w-4xl mx-auto flex justify-around py-3">
          {[
            { icon: BookOpen, label: "Quran", active: true },
            { icon: Search, label: "Search", active: false },
            { icon: Moon, label: "Stories", active: false },
            { icon: Sun, label: "Learn", active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`flex flex-col items-center gap-1 ${
                item.active ? "text-primary" : "text-muted-foreground"
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