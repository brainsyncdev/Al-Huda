"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight, BookOpen, Users, Heart, Share2 } from "lucide-react";
import { quranStories, prophets } from "@/data/quran-stories";

export default function StoriesPage() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);

  const story = selectedStory ? quranStories.find((s) => s.id === selectedStory) : null;

  if (story) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedStory(null)}
                className="p-2 -ml-2 rounded-lg hover:bg-secondary"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="font-semibold">{story.title}</h1>
                <p className="text-xs text-muted-foreground urdu-text" dir="rtl">
                  {story.titleUrdu}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-6">
          {/* Story Header */}
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6">
            <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
              {story.prophet}
            </span>
            <h2 className="text-2xl font-bold mt-4 mb-2">{story.title}</h2>
            <p className="arabic-text text-xl text-teal-100" dir="rtl">
              {story.titleArabic}
            </p>
          </div>

          {/* Key Verse */}
          <div className="bg-amber-50 rounded-2xl p-6 mb-6">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-amber-600" />
              Key Verse
            </h3>
            <p className="arabic-text text-2xl text-right leading-relaxed mb-3" dir="rtl">
              {story.keyAyah}
            </p>
          </div>

          {/* Summary */}
          <div className="bg-card rounded-2xl border p-6 mb-6">
            <h3 className="font-semibold mb-4">The Story</h3>
            <p className="text-muted-foreground leading-relaxed">{story.summary}</p>
            <p className="urdu-text text-muted-foreground mt-4 leading-relaxed" dir="rtl">
              {story.summaryUrdu}
            </p>
          </div>

          {/* Lessons */}
          <div className="bg-emerald-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5 text-emerald-600" />
              Key Lessons
            </h3>
            <ul className="space-y-3">
              {story.lessons.map((lesson, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-500 text-white text-sm flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-emerald-800">{lesson}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Moral Lessons */}
          <div className="bg-purple-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Heart className="h-5 w-5 text-purple-600" />
              Moral Lessons for Life
            </h3>
            <ul className="space-y-3">
              {story.moralLessons.map((moral, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="text-purple-600">✨</span>
                  <span className="text-purple-800">{moral}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button className="flex-1 py-3 rounded-xl bg-teal-600 text-white font-medium flex items-center justify-center gap-2">
              <Heart className="h-5 w-5" />
              Save Story
            </button>
            <button className="flex-1 py-3 rounded-xl border font-medium flex items-center justify-center gap-2">
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/explore" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Stories from the Quran</h1>
              <p className="text-xs text-muted-foreground">قصص قرآنی — Tales of the Quran</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Featured Story */}
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-6 text-white mb-6">
          <span className="px-3 py-1 rounded-full bg-white/20 text-sm">Featured</span>
          <h2 className="text-2xl font-bold mt-4 mb-2">The Stories of the Prophets</h2>
          <p className="text-teal-100">
            Learn from the lives of the messengers sent by Allah throughout history
          </p>
        </div>

        {/* Stories List */}
        <div className="space-y-4">
          {quranStories.map((story) => (
            <button
              key={story.id}
              onClick={() => setSelectedStory(story.id)}
              className="w-full bg-card rounded-2xl border p-4 text-left hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center text-2xl flex-shrink-0">
                  📖
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 text-xs">
                      {story.prophet}
                    </span>
                  </div>
                  <h3 className="font-semibold">{story.title}</h3>
                  <p className="arabic-text text-sm text-muted-foreground" dir="rtl">
                    {story.titleArabic}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                    {story.summary}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
            </button>
          ))}
        </div>

        {/* Prophets Section */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">All 25 Prophets Mentioned in Quran</h3>
          <div className="grid grid-cols-3 gap-3">
            {prophets.map((prophet) => (
              <Link
                key={prophet.id}
                href={`/explore/prophets/${prophet.id}`}
                className="bg-card rounded-xl border p-3 text-center hover:shadow-md transition-shadow"
              >
                <p className="arabic-text text-xl mb-1" dir="rtl">
                  {prophet.nameArabic}
                </p>
                <p className="font-medium text-sm">{prophet.name}</p>
                <p className="text-xs text-muted-foreground">{prophet.title}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}