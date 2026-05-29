"use client";

import Link from "next/link";
import { Search, TrendingUp, Sparkles, Clock, BookOpen, Star } from "lucide-react";

const trendingTopics = [
  {
    id: 1,
    title: "Jannah (Paradise)",
    titleUr: "جنت",
    arabic: "جَنَّتٍ",
    ayahCount: 66,
    icon: "🌴",
    color: "emerald",
  },
  {
    id: 2,
    title: "Sabr (Patience)",
    titleUr: "صبر",
    arabic: "صَبْرًا",
    ayahCount: 103,
    icon: "⏳",
    color: "blue",
  },
  {
    id: 3,
    title: "Shukr (Gratitude)",
    titleUr: "شکر",
    arabic: "شَاكِرًا",
    ayahCount: 73,
    icon: "🤲",
    color: "amber",
  },
  {
    id: 4,
    title: "Rahma (Mercy)",
    titleUr: "رحمت",
    arabic: "رَحْمَةٍ",
    ayahCount: 56,
    icon: "💧",
    color: "purple",
  },
];

const categories = [
  { id: 1, name: "Aqeedah", nameUr: "عقیدہ", count: 45 },
  { id: 2, name: "Acts of Worship", nameUr: "عبادات", count: 38 },
  { id: 3, name: "Morality", nameUr: "اخلاق", count: 29 },
  { id: 4, name: "Social Life", nameUr: "معاشرت", count: 34 },
  { id: 5, name: "Stories", nameUr: "قصص", count: 52 },
  { id: 6, name: "Duas", nameUr: "دعائیں", count: 41 },
];

const recentExplorations = [
  {
    id: 1,
    surah: "Al-Baqarah",
    ayah: "255",
    topic: "Ayatul Kursi",
    icon: "👑",
  },
  {
    id: 2,
    surah: "Al-Ikhlas",
    ayah: "1-4",
    topic: "Tawheed",
    icon: "☀️",
  },
  {
    id: 3,
    surah: "Al-Falaq",
    ayah: "1-5",
    topic: "Protection",
    icon: "🛡️",
  },
];

export default function ExplorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              ←
            </Link>
            <div>
              <h1 className="font-semibold">Explore</h1>
              <p className="text-xs text-muted-foreground">تحقیق — Discovery</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Search */}
        <Link
          href="/explore/search"
          className="flex items-center gap-3 p-4 bg-card rounded-xl border mb-6 hover:shadow-md transition-shadow"
        >
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-muted-foreground">Search topics, concepts, themes...</span>
        </Link>

        {/* Trending Topics */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold">Trending Topics</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {trendingTopics.map((topic) => (
              <Link
                key={topic.id}
                href={`/explore/topic/${topic.id}`}
                className="bg-card rounded-xl border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{topic.icon}</span>
                  <span className="text-xs text-muted-foreground">
                    {topic.ayahCount} ayaat
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{topic.title}</h3>
                <p className="arabic-text text-sm text-muted-foreground" dir="rtl">
                  {topic.arabic}
                </p>
                <p className="urdu-text text-xs text-muted-foreground" dir="rtl">
                  {topic.titleUr}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold">Categories</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/explore/category/${cat.id}`}
                className="bg-card rounded-xl border p-4 text-center hover:shadow-md transition-shadow"
              >
                <p className="font-medium text-sm mb-1">{cat.name}</p>
                <p className="urdu-text text-xs text-muted-foreground" dir="rtl">
                  {cat.nameUr}
                </p>
                <p className="text-xs text-amber-600 mt-2">{cat.count} topics</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Explorations */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-amber-600" />
            <h2 className="font-semibold">Recent Explorations</h2>
          </div>
          <div className="space-y-3">
            {recentExplorations.map((item) => (
              <Link
                key={item.id}
                href={`/explore/${item.id}`}
                className="flex items-center gap-4 bg-card rounded-xl border p-4 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-xl">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.topic}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.surah} : {item.ayah}
                  </p>
                </div>
                <Star className="h-5 w-5 text-amber-500" />
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}