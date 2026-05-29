"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Grid, List, Filter, Plus, Heart, BookOpen, Star } from "lucide-react";

export default function CollectionsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const collections = [
    {
      id: 1,
      title: "Salah Series",
      titleUr: "نماز کی تعلیم",
      description: "Learn everything about prayer",
      emoji: "🕌",
      count: 12,
      color: "from-emerald-500 to-teal-500",
    },
    {
      id: 2,
      title: "99 Names of Allah",
      titleUr: "اسماء الحسنیٰ",
      description: "Beautiful names and meanings",
      emoji: "✨",
      count: 99,
      color: "from-amber-500 to-orange-500",
    },
    {
      id: 3,
      title: "Juz Amma Basics",
      titleUr: "جزء عمّ",
      description: "Perfect for beginners",
      emoji: "📖",
      count: 37,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 4,
      title: "Duas Collection",
      titleUr: "دعائیں",
      description: "Daily supplications",
      emoji: "🤲",
      count: 50,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 5,
      title: "Stories of Prophets",
      titleUr: "قصص انبیاء",
      description: "Lessons from the prophets",
      emoji: "📚",
      count: 25,
      color: "from-rose-500 to-red-500",
    },
    {
      id: 6,
      title: "Quranic Arabic",
      titleUr: "قرآنی عربی",
      description: "Build your vocabulary",
      emoji: "📝",
      count: 200,
      color: "from-indigo-500 to-blue-500",
    },
  ];

  const filteredCollections = collections.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titleUr.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/explore" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Collections</h1>
              <p className="text-xs text-muted-foreground">مجموعے — Curated Sets</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-secondary">
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border-0"
            />
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Featured Collection */}
        <Link
          href="/explore/collections/1"
          className="block bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white mb-6"
        >
          <span className="px-3 py-1 rounded-full bg-white/20 text-sm mb-3 inline-block">
            ⭐ Editor&apos;s Pick
          </span>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl">🕌</span>
            <div>
              <h2 className="text-xl font-bold">Complete Salah Guide</h2>
              <p className="opacity-90">نماز کا مکمل علم</p>
            </div>
          </div>
          <p className="text-sm opacity-90">
            From wudu to prayer - everything you need to know about Salah
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm">12 lessons</span>
            <span className="px-4 py-2 rounded-xl bg-white text-emerald-600 font-medium">
              Start Learning →
            </span>
          </div>
        </Link>

        {/* Collections Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 gap-4">
            {filteredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/explore/collections/${collection.id}`}
                className="bg-card rounded-2xl border overflow-hidden"
              >
                <div className={`h-24 bg-gradient-to-br ${collection.color} flex items-center justify-center`}>
                  <span className="text-4xl">{collection.emoji}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">{collection.title}</h3>
                  <p className="urdu-text text-sm text-muted-foreground mb-2" dir="rtl">
                    {collection.titleUr}
                  </p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{collection.count} items</span>
                    <Heart className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/explore/collections/${collection.id}`}
                className="bg-card rounded-xl border p-4 flex items-center gap-4"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${collection.color} flex items-center justify-center`}>
                  <span className="text-2xl">{collection.emoji}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{collection.title}</h3>
                  <p className="text-sm text-muted-foreground">{collection.description}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary text-sm">
                  {collection.count}
                </span>
              </Link>
            ))}
          </div>
        )}

        {filteredCollections.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No collections found</p>
          </div>
        )}
      </main>
    </div>
  );
}