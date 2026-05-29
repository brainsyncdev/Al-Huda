"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw, Heart, Share2, Volume2, Bookmark, ExternalLink } from "lucide-react";
import { realSurahs } from "@/data/real-quran-data";

export default function RandomVersePage() {
  const [currentVerse, setCurrentVerse] = useState<{
    surah: typeof realSurahs[0];
    ayahNumber: number;
    arabic: string;
    translation: string;
  } | null>(null);

  const getRandomVerse = () => {
    const randomSurah = realSurahs[Math.floor(Math.random() * realSurahs.length)];
    const randomAyah = Math.floor(Math.random() * Math.min(randomSurah.totalVerses, 10)) + 1;
    
    const sampleVerses: Record<number, string[]> = {
      1: [
        "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        "الرَّحْمَٰنِ الرَّحِيمِ",
        "مَالِكِ يَوْمِ الدِّينِ",
        "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      ],
      55: [
        "الرَّحْمَٰنُ",
        "عَلَّمَ الْقُرْآنَ",
        "خَلَقَ الْإِنسَانَ",
        "عَلَّمَهُ الْبَيَانَ",
      ],
      67: [
        "تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ",
        "وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
      ],
    };

    const translations: Record<number, string[]> = {
      1: [
        "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
        "All praise is due to Allah, Lord of the worlds -",
        "The Entirely Merciful, the Especially Merciful,",
        "Sovereign of the Day of Recompense.",
        "It is You we worship and You we ask for help.",
        "Guide us to the straight path -",
      ],
      55: [
        "The Most Merciful.",
        "He has taught the Quran.",
        "He created man.",
        "He taught him speech.",
      ],
      67: [
        "Blessed is He in whose hand is the dominion, and He is over all things competent.",
        "And He is over all things competent.",
      ],
    };

    setCurrentVerse({
      surah: randomSurah,
      ayahNumber: randomAyah,
      arabic: sampleVerses[randomSurah.id]?.[0] || "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ",
      translation: translations[randomSurah.id]?.[0] || "There is no deity except Him.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/quran" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Random Verse</h1>
              <p className="text-xs text-muted-foreground">بے ترتیب آیت — Surprise Me</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {!currentVerse ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-6">
              <RefreshCw className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Discover a Random Verse</h2>
            <p className="text-muted-foreground mb-8">
              Let the Quran surprise you with divine guidance
            </p>
            <button
              onClick={getRandomVerse}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Get Random Verse
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card rounded-2xl border overflow-hidden">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 p-6 text-white text-center">
                <p className="text-sm opacity-90 mb-1">Discover</p>
                <h2 className="text-xl font-bold">{currentVerse.surah.nameEnglish}</h2>
                <p className="text-emerald-200">Verse {currentVerse.ayahNumber}</p>
              </div>
              
              <div className="p-6">
                <p className="arabic-text text-3xl text-center leading-relaxed mb-6" dir="rtl">
                  {currentVerse.arabic}
                </p>
                
                <div className="bg-emerald-50 rounded-xl p-4 mb-6">
                  <p className="text-emerald-800 text-center">{currentVerse.translation}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 rounded-xl bg-emerald-100 text-emerald-700 font-medium flex items-center justify-center gap-2 hover:bg-emerald-200 transition-colors">
                    <Volume2 className="h-5 w-5" />
                    Listen
                  </button>
                  <button className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
                    <Bookmark className="h-5 w-5" />
                    Save
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={getRandomVerse}
                className="flex-1 py-4 rounded-xl border-2 border-emerald-500 text-emerald-600 font-semibold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
              >
                <RefreshCw className="h-5 w-5" />
                Another Verse
              </button>
              <button className="px-6 py-4 rounded-xl border font-medium flex items-center justify-center gap-2">
                <Share2 className="h-5 w-5" />
                Share
              </button>
            </div>

            <a
              href={`https://quran.com/${currentVerse.surah.id}:${currentVerse.ayahNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 text-emerald-600 font-medium hover:underline"
            >
              View on Quran.com
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        )}
      </main>
    </div>
  );
}