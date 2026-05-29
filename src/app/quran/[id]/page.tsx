"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Pause, Bookmark, Share2, Volume2, ChevronLeft, ChevronRight } from "lucide-react";
import { realSurahs, authenticVerses, type RealSurah, type RealVerse } from "@/data/real-quran-data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SurahPage({ params }: PageProps) {
  const { id } = use(params);
  const surahId = parseInt(id);
  const surah = realSurahs.find((s) => s.id === surahId);
  const verses = authenticVerses[surahId] || [];
  
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranslation, setShowTranslation] = useState(true);

  if (!surah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Surah not found</p>
      </div>
    );
  }

  // Generate sample verses if not available
  const displayVerses = verses.length > 0 ? verses : generateSampleVerses(surah);

  const nextSurah = realSurahs.find((s) => s.id === surahId + 1);
  const prevSurah = realSurahs.find((s) => s.id === surahId - 1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/quran" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="font-semibold">{surah.nameEnglish}</h1>
                <p className="text-xs text-muted-foreground">
                  {surah.transliteration} • {surah.totalVerses} Verses
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg hover:bg-secondary">
                <Bookmark className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary">
                <Share2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Surah Header */}
        <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white mb-6 text-center">
          <p className="arabic-text text-4xl mb-2" dir="rtl">
            {surah.nameArabic}
          </p>
          <h2 className="text-2xl font-bold mb-1">{surah.nameEnglish}</h2>
          <p className="text-teal-100 mb-2">{surah.transliteration}</p>
          <div className="flex justify-center gap-4 text-sm text-teal-200">
            <span>{surah.totalVerses} Verses</span>
            <span>•</span>
            <span>{surah.revelationType}</span>
            {surah.pages.length > 1 && (
              <>
                <span>•</span>
                <span>Pages {surah.pages[0]}-{surah.pages[surah.pages.length - 1]}</span>
              </>
            )}
          </div>
          {surah.description && (
            <p className="text-sm text-teal-100 mt-3">{surah.description}</p>
          )}
        </div>

        {/* Bismillah */}
        {surah.bismillah && (
          <div className="bg-card rounded-2xl border p-6 mb-6 text-center">
            <p className="arabic-text text-3xl text-teal-700" dir="rtl">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              In the name of Allah, the Entirely Merciful, the Especially Merciful
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`px-4 py-2 rounded-xl font-medium ${
              showTranslation ? "bg-teal-100 text-teal-700" : "bg-secondary"
            }`}
          >
            {showTranslation ? "Hide Translation" : "Show Translation"}
          </button>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border">
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Verses */}
        <div className="space-y-6">
          {displayVerses.map((verse, idx) => (
            <div
              key={verse.id || idx}
              className={`bg-card rounded-2xl border p-6 transition-colors ${
                currentVerse === idx ? "border-teal-500 bg-teal-50/50" : ""
              }`}
            >
              {/* Verse Header */}
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-700">
                  {verse.verseNumber}
                </span>
                <span className="text-sm text-muted-foreground">
                  Page {verse.pageNumber}
                </span>
              </div>

              {/* Arabic Text */}
              <p className="arabic-text text-2xl leading-loose text-right mb-4" dir="rtl">
                {verse.arabicText}
              </p>

              {/* Translations */}
              {showTranslation && (
                <div className="space-y-3 border-t pt-4">
                  <div>
                    <p className="text-sm font-medium text-teal-700 mb-1">English</p>
                    <p className="text-gray-700">{verse.translations.english}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-700 mb-1">اردو</p>
                    <p className="urdu-text text-gray-700" dir="rtl">
                      {verse.translations.urdu}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {prevSurah ? (
            <Link
              href={`/quran/${surahId - 1}`}
              className="flex items-center gap-2 p-4 rounded-xl border hover:bg-secondary"
            >
              <ChevronLeft className="h-5 w-5" />
              <div className="text-left">
                <p className="text-sm text-muted-foreground">Previous</p>
                <p className="font-medium">{prevSurah.nameEnglish}</p>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextSurah && (
            <Link
              href={`/quran/${surahId + 1}`}
              className="flex items-center gap-2 p-4 rounded-xl border hover:bg-secondary"
            >
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Next</p>
                <p className="font-medium">{nextSurah.nameEnglish}</p>
              </div>
              <ChevronRight className="h-5 w-5" />
            </Link>
          )}
        </div>

        {/* Tafsir Link */}
        <div className="mt-6">
          <Link
            href={`/quran-tafsir/${surahId}`}
            className="block w-full py-4 rounded-xl bg-amber-100 text-amber-800 font-medium text-center hover:bg-amber-200 transition-colors"
          >
            View Tafsir (تفسیر) →
          </Link>
        </div>
      </main>
    </div>
  );
}

// Helper function to generate sample verses for surahs not in our data
function generateSampleVerses(surah: RealSurah): RealVerse[] {
  const sampleTexts: Record<number, string[]> = {
    1: ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", "الرَّحْمَٰنِ الرَّحِيمِ", "مَالِكِ يَوْمِ الدِّينِ", "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ"],
    112: ["قُلْ هُوَ اللَّهُ أَحَدٌ", "اللَّهُ الصَّمَدُ", "لَمْ يَلِدْ وَلَمْ يُولَدْ", "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ"],
    55: ["الرَّحْمَٰنُ", "عَلَّمَ الْقُرْآنَ", "خَلَقَ الْإِنسَانَ", "عَلَّمَهُ الْبَيَانَ", "الشَّمْسُ وَالْقَمَرُ بِحُسْبَانٍ", "وَالنَّجْمُ وَالشَّجَرُ يَسْجُدَانِ"],
    36: ["يَا يَقَنُ", "وَالْقُرْآنِ الْحَكِيمِ", "إِنَّكَ لَمِنَ الْمُرْسَلِينَ", "عَلَى صِرَاطٍ مُّسْتَقِيمٍ"],
    67: ["تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ", "وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ", "الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ", "لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا"],
  };

  const texts = sampleTexts[surah.id] || ["اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ"];
  
  return texts.map((text, idx) => ({
    id: surah.id * 1000 + idx,
    verseNumber: idx + 1,
    verseKey: `${surah.id}:${idx + 1}`,
    arabicText: text,
    pageNumber: surah.pages[0] || 1,
    translations: {
      english: "Verse translation coming soon...",
      urdu: "آیت کا ترجمہ جلد آئے گا...",
    },
  }));
}