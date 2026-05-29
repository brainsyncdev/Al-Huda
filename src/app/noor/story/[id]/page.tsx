"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, ChevronRight, ChevronLeft, Star } from "lucide-react";
import { stories } from "@/data/quran-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function StoryPage({ params }: PageProps) {
  const { id } = use(params);
  const storyId = parseInt(id);
  const story = stories.find((s) => s.id === storyId);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Story not found</p>
      </div>
    );
  }

  // Mock episodes
  const episodes = [
    {
      number: 1,
      title: "The Beginning",
      titleUr: "شروع",
      duration: "5 min",
      content: "In a land far away, there lived a wise man named Yusuf...",
    },
    {
      number: 2,
      title: "The Dreams",
      titleUr: "خواب",
      duration: "6 min",
      content: "Young Yusuf had beautiful dreams that would come true...",
    },
  ];

  const currentEpData = episodes[currentEpisode - 1] || episodes[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-md mx-auto flex items-center gap-4">
          <Link href="/noor" className="p-2 -ml-2 rounded-lg hover:bg-purple-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold">{story.prophetNameUr} علیہ السلام</h1>
            <p className="text-xs text-muted-foreground">{story.titleUr}</p>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4">
        {/* Story Illustration */}
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-purple-200 to-purple-100 flex items-center justify-center mb-6 relative overflow-hidden">
          <div className="text-center">
            <div className="text-8xl mb-4">
              {storyId === 1 ? "⭐" : storyId === 2 ? "⛵" : "🔥"}
            </div>
            <p className="text-purple-700 font-medium">Episode {currentEpisode}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Star key={i} className="h-5 w-5 text-purple-300 fill-purple-300" />
            ))}
          </div>
        </div>

        {/* Episode Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">{currentEpData.title}</h2>
          <p className="urdu-text text-lg text-purple-600" dir="rtl">
            {currentEpData.titleUr}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {currentEpData.duration}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-purple-100 rounded-full h-2">
            <div
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Play Controls */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <button
            onClick={() => setCurrentEpisode(Math.max(1, currentEpisode - 1))}
            disabled={currentEpisode === 1}
            className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6 text-purple-600" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-20 h-20 rounded-full bg-purple-600 text-white flex items-center justify-center hover:bg-purple-700 transition-colors shadow-lg"
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </button>

          <button
            onClick={() => setCurrentEpisode(Math.min(story.totalEpisodes, currentEpisode + 1))}
            disabled={currentEpisode === story.totalEpisodes}
            className="p-3 rounded-full bg-purple-100 hover:bg-purple-200 transition-colors disabled:opacity-50"
          >
            <ChevronRight className="h-6 w-6 text-purple-600" />
          </button>
        </div>

        {/* Episode List */}
        <div className="bg-card rounded-2xl border p-4">
          <h3 className="font-semibold mb-4">Episodes ({story.totalEpisodes})</h3>
          <div className="space-y-2">
            {episodes.map((ep) => (
              <button
                key={ep.number}
                onClick={() => setCurrentEpisode(ep.number)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  currentEpisode === ep.number
                    ? "bg-purple-100 text-purple-700"
                    : "hover:bg-secondary"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentEpisode === ep.number
                      ? "bg-purple-600 text-white"
                      : "bg-secondary"
                  }`}
                >
                  {ep.number}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{ep.title}</p>
                  <p className="text-xs text-muted-foreground">{ep.duration}</p>
                </div>
                {currentEpisode === ep.number && (
                  <Play className="h-4 w-4 text-purple-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Learning Points */}
        <div className="mt-6 bg-amber-50 rounded-2xl p-4">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            Today's Lesson
          </h3>
          <p className="urdu-text text-amber-800" dir="rtl">
            {story.mainLessonUr}
          </p>
          <p className="text-sm text-amber-700 mt-2">
            {story.mainLessonUr}
          </p>
        </div>
      </main>
    </div>
  );
}