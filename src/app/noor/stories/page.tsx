"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Star, ChevronRight, Clock, BookOpen } from "lucide-react";
import { stories } from "@/data/quran-data";

export default function StoriesPage() {
  const [selectedProphet, setSelectedProphet] = useState<number | null>(null);

  const filteredStories = selectedProphet
    ? stories.filter(s => s.id === selectedProphet)
    : stories;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/noor" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Stories</h1>
              <p className="text-xs text-muted-foreground">قصص — Quran Stories</p>
            </div>
          </div>

          {/* Prophet Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
            <button
              onClick={() => setSelectedProphet(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                !selectedProphet
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              All Stories
            </button>
            {stories.map((story) => (
              <button
                key={story.id}
                onClick={() => setSelectedProphet(story.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedProphet === story.id
                    ? "bg-purple-600 text-white"
                    : "bg-purple-100 text-purple-700"
                }`}
              >
                {story.prophetNameUr}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Featured Story */}
        <Link
          href={`/noor/story/${stories[0].id}`}
          className="block bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white mb-6"
        >
          <span className="px-3 py-1 rounded-full bg-white/20 text-sm mb-3 inline-block">
            ⭐ Featured Story
          </span>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">⭐</span>
            <div>
              <h2 className="text-xl font-bold">{stories[0].titleUr}</h2>
              <p className="opacity-90">{stories[0].prophetNameUr}</p>
            </div>
          </div>
          <p className="text-sm opacity-90 mb-4">{stories[0].mainLessonUr}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {stories[0].totalEpisodes} Episodes
              </span>
              <span className="px-2 py-0.5 rounded bg-white/20 text-xs">
                Age: {stories[0].ageRange}
              </span>
            </div>
            <button className="flex items-center gap-2 bg-white text-purple-600 px-4 py-2 rounded-xl font-medium">
              <Play className="h-4 w-4" />
              Start
            </button>
          </div>
        </Link>

        {/* Stories List */}
        <div className="space-y-4">
          {filteredStories.map((story) => (
            <Link
              key={story.id}
              href={`/noor/story/${story.id}`}
              className="block bg-card rounded-2xl border overflow-hidden"
            >
              <div className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <span className="text-3xl">📖</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{story.titleUr}</h3>
                  <p className="text-sm text-muted-foreground urdu-text" dir="rtl">
                    {story.prophetNameUr} علیہ السلام
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      {story.totalEpisodes} Episodes
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      ~{story.totalEpisodes * 5} min
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700">
                      Difficulty: {story.difficulty}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </Link>
          ))}
        </div>

        {filteredStories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No stories found</p>
          </div>
        )}
      </main>
    </div>
  );
}