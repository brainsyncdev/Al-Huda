"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Trash2, Share2, Filter } from "lucide-react";

interface BookmarkItem {
  id: number;
  type: "surah" | "ayah" | "dua" | "story";
  title: string;
  subtitle: string;
  arabic?: string;
  date: string;
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    {
      id: 1,
      type: "surah",
      title: "Al-Fatiha",
      subtitle: "Surah 1 • 7 Verses",
      arabic: "الفاتحة",
      date: "Mar 15, 2025",
    },
    {
      id: 2,
      type: "ayah",
      title: "Ayatul Kursi",
      subtitle: "Al-Baqarah 255",
      arabic: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ",
      date: "Mar 14, 2025",
    },
    {
      id: 3,
      type: "story",
      title: "Prophet Yusuf",
      subtitle: "NOOR • Episode 3",
      date: "Mar 13, 2025",
    },
    {
      id: 4,
      type: "dua",
      title: "Morning Dua",
      subtitle: "Daily Duas",
      arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ",
      date: "Mar 12, 2025",
    },
  ]);

  const [filter, setFilter] = useState<string>("all");

  const filteredBookmarks = bookmarks.filter((b) =>
    filter === "all" ? true : b.type === filter
  );

  const deleteBookmark = (id: number) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "surah": return "📖";
      case "ayah": return "✨";
      case "story": return "⭐";
      case "dua": return "🤲";
      default: return "📌";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">My Bookmarks</h1>
                <p className="text-xs text-muted-foreground">محفوظ شدہ — Saved</p>
              </div>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary">
              <Filter className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">{bookmarks.length}</p>
              <p className="text-teal-100">Total Saved</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">
                {bookmarks.filter((b) => b.type === "surah").length} Surahs
              </p>
              <p className="text-teal-100 text-sm">
                {bookmarks.filter((b) => b.type === "ayah").length} Verses
              </p>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["all", "surah", "ayah", "dua", "story"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
                filter === type
                  ? "bg-teal-600 text-white"
                  : "bg-card border text-muted-foreground"
              }`}
            >
              {type === "all" ? "All" : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
            </button>
          ))}
        </div>

        {/* Bookmarks List */}
        <div className="space-y-4">
          {filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="bg-card rounded-2xl border overflow-hidden"
            >
              <div className="p-4 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-2xl">
                  {getIcon(bookmark.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{bookmark.title}</h3>
                  <p className="text-sm text-muted-foreground">{bookmark.subtitle}</p>
                  {bookmark.arabic && (
                    <p className="arabic-text text-lg mt-2 text-teal-700" dir="rtl">
                      {bookmark.arabic}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Saved on {bookmark.date}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg hover:bg-secondary">
                    <Share2 className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => deleteBookmark(bookmark.id)}
                    className="p-2 rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredBookmarks.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No bookmarks yet</p>
            <p className="text-sm text-muted-foreground">
              Save your favorite surahs, verses, and duas
            </p>
          </div>
        )}
      </main>
    </div>
  );
}