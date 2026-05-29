"use client";

import Link from "next/link";
import { Star, BookOpen, Play } from "lucide-react";
import { stories } from "@/data/quran-data";

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/noor" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              ←
            </Link>
            <div>
              <h1 className="font-semibold">Prophet Stories</h1>
              <p className="text-xs text-muted-foreground">قصص انبیاء — Stories of Prophets</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Featured Story */}
        <Link
          href={`/noor/story/${stories[0].id}`}
          className="block mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-700 p-6 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          <div className="relative">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white/20 text-sm mb-3">
              <Star className="h-4 w-4 fill-white" />
              Featured
            </span>
            <h2 className="text-2xl font-bold mb-1">{stories[0].prophetNameUr}</h2>
            <p className="text-purple-200 mb-2">{stories[0].prophetNameUr} علیہ السلام</p>
            <p className="text-sm text-purple-200 mb-4">{stories[0].titleUr}</p>
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {stories[0].totalEpisodes} Episodes
              </span>
              <span className="flex items-center gap-1">
                <Play className="h-4 w-4" />
                25 min total
              </span>
            </div>
          </div>
        </Link>

        {/* All Stories */}
        <h3 className="font-semibold mb-4">All Stories ({stories.length})</h3>
        <div className="space-y-4">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/noor/story/${story.id}`}
              className="block bg-card rounded-xl border overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-4 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-purple-100 flex items-center justify-center text-3xl">
                  {storyIdEmoji(story.id)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{story.prophetNameUr}</h4>
                  <p className="urdu-text text-sm text-purple-600" dir="rtl">
                    {story.prophetNameUr} علیہ السلام
                  </p>
                  <p className="text-sm text-muted-foreground">{story.titleUr}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-purple-600">
                    {story.totalEpisodes} Episodes
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < story.difficulty
                            ? "text-amber-500 fill-amber-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}

function storyIdEmoji(id: number): string {
  const emojis: Record<number, string> = {
    1: "⭐",
    2: "⛵",
    3: "🔥",
    4: "🌊",
    5: "🌙",
    6: "👑",
    7: "🐑",
    8: "🕊️",
  };
  return emojis[id] || "📖";
}