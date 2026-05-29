"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2, BookOpen } from "lucide-react";
import { surahs } from "@/data/quran-data";

export default function QuranReadingPage() {
  const [currentSurah, setCurrentSurah] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const surah = surahs.find((s) => s.id === currentSurah);
  const nextSurah = surahs.find((s) => s.id === currentSurah + 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-4">
          <Link href="/quran" className="p-2 -ml-2 rounded-lg hover:bg-white/10">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="font-semibold">Reading Mode</h1>
            <p className="text-xs text-gray-400">نظر سے پڑھنا</p>
          </div>
          <Link href="/quran-tafsir/1" className="p-2 rounded-lg hover:bg-white/10">
            <BookOpen className="h-5 w-5" />
          </Link>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-6">
        {/* Surah Info */}
        <div className="text-center mb-8">
          <p className="arabic-text text-4xl mb-2" dir="rtl">
            {surah?.nameArabic}
          </p>
          <h2 className="text-2xl font-bold mb-1">{surah?.meaningEnglish}</h2>
          <p className="text-gray-400">{surah?.meaningUrdu}</p>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-400">
            <span>{surah?.totalVerses} Verses</span>
            <span>•</span>
            <span>{surah?.revelationType}</span>
          </div>
        </div>

        {/* Arabic Text Display */}
        <div className="bg-white/5 rounded-2xl p-8 mb-8 min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <p className="arabic-text text-4xl leading-relaxed" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="arabic-text text-4xl leading-relaxed mt-8" dir="rtl">
              الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ
            </p>
            <p className="arabic-text text-4xl leading-relaxed mt-8" dir="rtl">
              الرَّحْمَٰنِ الرَّحِيمِ
            </p>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Ayat 1</span>
            <span>Page 1</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-teal-500 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Audio Controls */}
        <div className="bg-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-center gap-6 mb-6">
            <button
              onClick={() => setCurrentSurah(Math.max(1, currentSurah - 1))}
              disabled={currentSurah === 1}
              className="p-3 rounded-full hover:bg-white/10 disabled:opacity-50"
            >
              <SkipBack className="h-6 w-6" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center hover:bg-teal-600 transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </button>

            <button
              onClick={() => setCurrentSurah(Math.min(114, currentSurah + 1))}
              disabled={currentSurah === 114}
              className="p-3 rounded-full hover:bg-white/10 disabled:opacity-50"
            >
              <SkipForward className="h-6 w-6" />
            </button>
          </div>

          <button className="w-full py-3 rounded-xl border border-white/20 flex items-center justify-center gap-2 hover:bg-white/10 transition-colors">
            <Volume2 className="h-5 w-5" />
            Change Reciter
          </button>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          {currentSurah > 1 ? (
            <button
              onClick={() => setCurrentSurah(currentSurah - 1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <div className="text-left">
                <p className="text-xs">Previous</p>
                <p className="text-sm">{surahs[currentSurah - 2]?.meaningEnglish}</p>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextSurah && (
            <button
              onClick={() => setCurrentSurah(currentSurah + 1)}
              className="flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <div className="text-right">
                <p className="text-xs">Next</p>
                <p className="text-sm">{nextSurah.meaningEnglish}</p>
              </div>
              <span>→</span>
            </button>
          )}
        </div>
      </main>
    </div>
  );
}