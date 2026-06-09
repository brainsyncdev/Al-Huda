"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Volume2, Share2, Bookmark, ChevronRight, Calendar, TrendingUp } from "lucide-react";

interface Word {
  arabic: string;
  transliteration: string;
  urdu: string;
  english: string;
  partOfSpeech: string;
  root: string;
  frequency: number;
  examples: Array<{ arabic: string; translation: string }>;
  synonyms: string[];
}

const wordOfDay: Word = {
  arabic: "الْقُرْآنُ",
  transliteration: "Al-Quran",
  urdu: "قرآن",
  english: "The Quran (The Recitation)",
  partOfSpeech: "Noun",
  root: "قرأ (Qara'a)",
  frequency: 70,
  examples: [
    { arabic: "إِنَّ هَذَا الْقُرْآنَ يَهْدِي لِلَّتِي هِيَ أَقْوَمُ", translation: "Indeed, this Quran guides to that which is most upright" },
    { arabic: "وَنَزَّلْنَا عَلَيْكَ الْكِتَابَ بِالْحَقِّ", translation: "And We have sent down to you the Book in truth" }
  ],
  synonyms: ["Kitab (Book)", "Huda (Guidance)", "Furqan (Criterion)"]
};

const recentWords: Word[] = [
  { arabic: "الصَّلَاةُ", transliteration: "As-Salah", urdu: "نماز", english: "Prayer", partOfSpeech: "Noun", root: "صلو (Salawa)", frequency: 99, examples: [], synonyms: [] },
  { arabic: "السَّلَامُ", transliteration: "As-Salam", urdu: "سلامتی", english: "Peace", partOfSpeech: "Noun", root: "سلم (Salama)", frequency: 45, examples: [], synonyms: [] },
  { arabic: "الرَّحْمَٰنُ", transliteration: "Ar-Rahman", urdu: "بڑا مہربان", english: "The Most Merciful", partOfSpeech: "Noun", root: "رحم (Rahm)", frequency: 57, examples: [], synonyms: [] },
];

export default function WordOfDayPage() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      <header className="bg-white/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-amber-100">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Word of the Day</h1>
              <p className="text-xs text-muted-foreground">آج کا لفظ — Daily Vocabulary</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {/* Featured Word */}
        <div className="bg-card rounded-2xl border overflow-hidden mb-6">
          <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                📅 March 15, 2025
              </span>
              <span className="px-3 py-1 rounded-full bg-white/20 text-sm">
                {wordOfDay.partOfSpeech}
              </span>
            </div>
            <p className="arabic-text text-5xl mb-2" dir="rtl">{wordOfDay.arabic}</p>
            <p className="text-xl font-medium">{wordOfDay.transliteration}</p>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-2xl font-bold text-amber-700">{wordOfDay.english}</p>
                <p className="urdu-text text-lg text-amber-600" dir="rtl">{wordOfDay.urdu}</p>
              </div>
              <button
                onClick={() => setSaved(!saved)}
                className={`p-3 rounded-xl ${saved ? "bg-amber-100 text-amber-600" : "bg-secondary"}`}
              >
                <Bookmark className={`h-5 w-5 ${saved ? "fill-amber-500" : ""}`} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Root</p>
                <p className="font-medium">{wordOfDay.root}</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Frequency</p>
                <p className="font-medium">{wordOfDay.frequency} times</p>
              </div>
            </div>

            {/* Audio */}
            <div className="flex justify-center mb-6">
              <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold flex items-center gap-3 hover:opacity-90 transition-opacity">
                <Volume2 className="h-6 w-6" />
                Listen Pronunciation
              </button>
            </div>

            {/* Examples */}
            {wordOfDay.examples.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">📖 Examples from Quran</h3>
                {wordOfDay.examples.map((ex, idx) => (
                  <div key={idx} className="bg-gray-50 rounded-xl p-4 mb-3">
                    <p className="arabic-text text-lg text-right mb-2" dir="rtl">{ex.arabic}</p>
                    <p className="text-sm text-muted-foreground">{ex.translation}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Synonyms */}
            {wordOfDay.synonyms.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">🔗 Related Words</h3>
                <div className="flex flex-wrap gap-2">
                  {wordOfDay.synonyms.map((syn, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Share */}
            <div className="flex gap-3">
              <button className="flex-1 py-3 rounded-xl bg-amber-100 text-amber-700 font-medium flex items-center justify-center gap-2 hover:bg-amber-200 transition-colors">
                <Share2 className="h-5 w-5" />
                Share
              </button>
              <button className="flex-1 py-3 rounded-xl bg-amber-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors">
                Practice Now
              </button>
            </div>
          </div>
        </div>

        {/* Recent Words */}
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-500" />
            Recently Learned
          </h3>
          <div className="space-y-3">
            {recentWords.map((word, idx) => (
              <div key={idx} className="bg-card rounded-xl border p-4 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                  <span className="arabic-text text-lg text-amber-700" dir="rtl">
                    {word.arabic.slice(0, 2)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{word.transliteration}</p>
                  <p className="text-sm text-muted-foreground">{word.english}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 bg-card rounded-xl border p-4">
          <h3 className="font-semibold mb-4">Your Vocabulary Stats</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-amber-600">45</p>
              <p className="text-xs text-muted-foreground">Words Learned</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">8</p>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">+12</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}