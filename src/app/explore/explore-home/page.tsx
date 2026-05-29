"use client";

import Link from "next/link";
import { ArrowLeft, Search, TrendingUp, Sparkles, Star, Clock, ChevronRight, Grid3X3, BookOpen } from "lucide-react";

export default function ExploreHomePage() {
  const trendingTopics = [
    { title: "How to Start Reading Quran", emoji: "🌟", views: "12K" },
    { title: "Understanding Surah Al-Fatiha", emoji: "📖", views: "8.5K" },
    { title: "Basics of Arabic Grammar", emoji: "📝", views: "6.2K" },
    { title: "Daily Duas Everyone Needs", emoji: "🤲", views: "15K" },
  ];

  const categories = [
    { name: "Reading", emoji: "📖", color: "bg-emerald-500", count: 45 },
    { name: "Memorization", emoji: "🧠", color: "bg-amber-500", count: 32 },
    { name: "Arabic", emoji: "📝", color: "bg-blue-500", count: 28 },
    { name: "Stories", emoji: "📚", color: "bg-purple-500", count: 20 },
    { name: "Duas", emoji: "🤲", color: "bg-pink-500", count: 50 },
    { name: "Prayer", emoji: "🕌", color: "bg-teal-500", count: 35 },
  ];

  const featuredContent = [
    {
      id: 1,
      title: "Complete Tajweed Guide",
      titleUr: "تجوید کا مکمل سبق",
      description: "Learn proper Quran recitation rules",
      emoji: "🎯",
      color: "from-teal-500 to-emerald-500",
      level: "All Levels",
    },
    {
      id: 2,
      title: "Quran for Kids",
      titleUr: "بچوں کے لیے قرآن",
      description: "Fun and interactive learning",
      emoji: "👶",
      color: "from-orange-500 to-amber-500",
      level: "Beginners",
    },
    {
      id: 3,
      title: "Deep Meanings",
      titleUr: "گہرے معانی",
      description: "Tafsir and interpretations",
      emoji: "💡",
      color: "from-purple-500 to-pink-500",
      level: "Advanced",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Explore</h1>
              <p className="text-xs text-muted-foreground">دریافت — Discover</p>
            </div>
            <Link href="/explore/collections" className="p-2 rounded-lg hover:bg-secondary">
              <Grid3X3 className="h-5 w-5" />
            </Link>
          </div>

          {/* Search */}
          <Link href="/explore/search" className="block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                readOnly
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border-0 cursor-pointer"
              />
            </div>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Categories
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/explore/category/${category.name.toLowerCase()}`}
                className="bg-card rounded-xl border p-4 flex items-center gap-3"
              >
                <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                  <span className="text-lg">{category.emoji}</span>
                </div>
                <div>
                  <p className="font-medium">{category.name}</p>
                  <p className="text-xs text-muted-foreground">{category.count} items</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Content */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              Featured
            </h2>
            <button className="text-sm text-blue-600 font-medium">See All</button>
          </div>
          <div className="space-y-4">
            {featuredContent.map((item) => (
              <Link
                key={item.id}
                href={`/explore/featured/${item.id}`}
                className="block bg-card rounded-2xl border overflow-hidden"
              >
                <div className={`h-24 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <span className="text-4xl">{item.emoji}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{item.title}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs">
                      {item.level}
                    </span>
                  </div>
                  <p className="urdu-text text-sm text-muted-foreground mb-1" dir="rtl">
                    {item.titleUr}
                  </p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Trending */}
        <div>
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-pink-500" />
            Trending Topics
          </h2>
          <div className="space-y-3">
            {trendingTopics.map((topic, idx) => (
              <Link
                key={idx}
                href={`/explore/topic/${idx}`}
                className="bg-card rounded-xl border p-4 flex items-center gap-4"
              >
                <span className="text-2xl">{topic.emoji}</span>
                <div className="flex-1">
                  <p className="font-medium">{topic.title}</p>
                  <p className="text-xs text-muted-foreground">{topic.views} views</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}