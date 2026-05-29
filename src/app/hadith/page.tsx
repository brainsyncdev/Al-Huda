"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Share2, Volume2, ChevronRight, BookOpen } from "lucide-react";

const hadiths = [
  {
    id: 1,
    book: "Sahih Bukhari",
    bookUr: "صحیح بخاری",
    number: "Hadith #1",
    arabic: "عَنْ أَمِيرِ الْمُؤْمِنِينَ قَالَ سَمِعْت رَسُولَ اللَّهِ يَقُولُ: إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    transliteration: "Innamal a'maalu binniyyaat",
    translation: "Actions are but by intentions and every person will be rewarded according to their intention.",
    category: "Foundations",
    benefit: "This hadith is the foundation of Islam. All deeds are judged by their intentions.",
  },
  {
    id: 2,
    book: "Sahih Muslim",
    bookUr: "صحیح مسلم",
    number: "Hadith #2",
    arabic: "مَنْ حَسُنَ إِسْلَامُهُ لَمْ يُلَمْ عَلَى زَلَّةٍ",
    transliteration: "Man hasunal islaamahu lam yulam 'alaa zallatin",
    translation: "Whoever sincerely embraces Islam, their past mistakes are forgiven.",
    category: "Mercy",
    benefit: "Islam offers a fresh start. A sincere conversion washes away all previous sins.",
  },
  {
    id: 3,
    book: "Riyad as-Salihin",
    bookUr: "ریاض الصالحین",
    number: "Hadith #3",
    arabic: "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
    transliteration: "La yu'minu ahadukum hatta yuhibba li akheehi ma yuhibbu li nafsehi",
    translation: "None of you truly believes until he loves for his brother what he loves for himself.",
    category: "Love",
    benefit: "True faith requires us to want for others what we want for ourselves.",
  },
  {
    id: 4,
    book: "Al-Adab Al-Mufrad",
    bookUr: "ادب المفرد",
    number: "Hadith #4",
    arabic: "الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ",
    transliteration: "Al-muslim man salima al-muslimuna min lisaanihi wa yadehi",
    translation: "A Muslim is one from whose tongue and hand other Muslims are safe.",
    category: "Behavior",
    benefit: "True Muslims protect others from their speech and actions.",
  },
];

const categories = ["All", "Foundations", "Mercy", "Love", "Behavior", "Patience", "Knowledge"];

export default function HadithPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentHadith, setCurrentHadith] = useState(0);

  const filteredHadiths = hadiths.filter(
    (h) => selectedCategory === "All" || h.category === selectedCategory
  );

  const hadith = filteredHadiths[currentHadith] || filteredHadiths[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="font-semibold">Hadith of the Day</h1>
              <p className="text-xs text-muted-foreground">احادیث — Sayings of Prophet ﷺ</p>
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentHadith(0);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedCategory === cat
                    ? "bg-amber-600 text-white"
                    : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Featured Hadith */}
        <div className="bg-gradient-to-br from-amber-100 to-amber-50 rounded-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <span className="px-3 py-1 rounded-full bg-amber-600 text-white text-sm">
              Hadith of the Day
            </span>
            <span className="text-amber-700 text-sm">
              {hadith.book} #{hadith.id}
            </span>
          </div>

          <p className="arabic-text text-2xl text-right leading-relaxed mb-4" dir="rtl">
            {hadith.arabic}
          </p>

          <p className="italic text-amber-800 mb-2">
            {hadith.transliteration}
          </p>

          <p className="text-amber-900">
            "{hadith.translation}"
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => setCurrentHadith(Math.max(0, currentHadith - 1))}
            disabled={currentHadith === 0}
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
          >
            ← Previous
          </button>
          <span className="text-muted-foreground">
            {currentHadith + 1} / {filteredHadiths.length}
          </span>
          <button
            onClick={() => setCurrentHadith(Math.min(filteredHadiths.length - 1, currentHadith + 1))}
            disabled={currentHadith === filteredHadiths.length - 1}
            className="px-4 py-2 rounded-xl border disabled:opacity-50"
          >
            Next →
          </button>
        </div>

        {/* Book Info */}
        <div className="bg-card rounded-2xl border p-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold">{hadith.book}</h3>
              <p className="urdu-text text-sm text-muted-foreground" dir="rtl">
                {hadith.bookUr}
              </p>
            </div>
          </div>
        </div>

        {/* Benefit */}
        <div className="bg-emerald-50 rounded-2xl p-4 mb-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-emerald-600">✨</span>
            Key Benefit
          </h3>
          <p className="text-emerald-800">{hadith.benefit}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="flex-1 py-3 rounded-xl border font-medium flex items-center justify-center gap-2">
            <Volume2 className="h-5 w-5" />
            Listen
          </button>
          <button className="flex-1 py-3 rounded-xl border font-medium flex items-center justify-center gap-2">
            <Bookmark className="h-5 w-5" />
            Save
          </button>
          <button className="flex-1 py-3 rounded-xl border font-medium flex items-center justify-center gap-2">
            <Share2 className="h-5 w-5" />
            Share
          </button>
        </div>

        {/* More from Book */}
        <div className="mt-8">
          <h3 className="font-semibold mb-4">More from {hadith.book}</h3>
          <div className="space-y-3">
            {[1, 2, 3].map((num) => (
              <Link
                key={num}
                href="#"
                className="flex items-center gap-4 bg-card rounded-xl border p-4"
              >
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                  {num}
                </div>
                <div className="flex-1">
                  <p className="font-medium">Hadith #{num + hadith.id}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    Another beautiful hadith from {hadith.book}...
                  </p>
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