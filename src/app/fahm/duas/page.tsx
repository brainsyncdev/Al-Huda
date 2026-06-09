"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Search, Heart, Share2, Volume2, Copy, Bookmark } from "lucide-react";

interface Dua {
  id: number;
  title: string;
  titleUrdu: string;
  arabic: string;
  transliteration: string;
  translation: string;
  occasion: string;
  audio: boolean;
}

const duas: Dua[] = [
  {
    id: 1,
    title: "Before Eating",
    titleUrdu: "کھانے سے پہلے",
    arabic: "بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ",
    transliteration: "Bismillahi wa 'ala barakatillah",
    translation: "In the name of Allah and with the blessing of Allah",
    occasion: "Eating",
    audio: true,
  },
  {
    id: 2,
    title: "After Eating",
    titleUrdu: "کھانے کے بعد",
    arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا",
    transliteration: "Alhamdulillahilladhi at'amana wa saqana",
    translation: "All praise is due to Allah who fed us and gave us drink",
    occasion: "Eating",
    audio: true,
  },
  {
    id: 3,
    title: "Entering Mosque",
    titleUrdu: "مسجد میں داخل ہونے کی دعا",
    arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
    transliteration: "Allahumma aftah li abwaba rahmatik",
    translation: "O Allah, open the doors of Your mercy for me",
    occasion: "Mosque",
    audio: true,
  },
  {
    id: 4,
    title: "Leaving Home",
    titleUrdu: "گھر سے نکلنے کی دعا",
    arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ",
    transliteration: "Bismillahi tawakkaltu 'ala Allah",
    translation: "In the name of Allah, I put my trust in Allah",
    occasion: "Travel",
    audio: true,
  },
  {
    id: 5,
    title: "Forgiveness",
    titleUrdu: "استغفار",
    arabic: "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ",
    transliteration: "Astaghfirullahal 'azeem",
    translation: "I seek forgiveness from Allah, the Most Great",
    occasion: "Daily",
    audio: true,
  },
  {
    id: 6,
    title: "Morning Dua",
    titleUrdu: "صبح کی دعا",
    arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ",
    transliteration: "Asbahna wa asbahil mulku lillah",
    translation: "We have entered the morning and the kingdom belongs to Allah",
    occasion: "Morning",
    audio: true,
  },
  {
    id: 7,
    title: "Evening Dua",
    titleUrdu: "شام کی دعا",
    arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ",
    transliteration: "Amsayna wa amsal mulku lillah",
    translation: "We have entered the evening and the kingdom belongs to Allah",
    occasion: "Evening",
    audio: true,
  },
  {
    id: 8,
    title: "Travel Dua",
    titleUrdu: "سفر کی دعا",
    arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا",
    transliteration: "Subhanalladhi sakhkhara lana hadha",
    translation: "Glory to Him who has subjected this to us",
    occasion: "Travel",
    audio: true,
  },
];

export default function DuasPage() {
  const [savedDuas, setSavedDuas] = useState<number[]>([1]);

  const toggleSave = (id: number) => {
    setSavedDuas((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/fahm" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">Duas Collection</h1>
              <p className="text-xs text-muted-foreground">دعائیں — Supplications</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search duas..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-secondary/50 border-0"
            />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="space-y-4">
          {duas.map((dua) => (
            <div key={dua.id} className="bg-card rounded-2xl border overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm">
                    {dua.occasion}
                  </span>
                  <div className="flex gap-2">
                    {dua.audio && (
                      <button className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-600">
                        <Volume2 className="h-4 w-4" />
                      </button>
                    )}
                    <button className="p-2 rounded-lg hover:bg-emerald-100 text-emerald-600">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-semibold mb-1">{dua.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 urdu-text" dir="rtl">
                  {dua.titleUrdu}
                </p>

                <p className="arabic-text text-2xl text-right mb-4" dir="rtl">
                  {dua.arabic}
                </p>

                <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                  <p className="text-emerald-800 italic mb-2">{dua.transliteration}</p>
                  <p className="text-sm text-emerald-700">{dua.translation}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-2 rounded-lg bg-emerald-100 text-emerald-700 font-medium flex items-center justify-center gap-2 hover:bg-emerald-200 transition-colors">
                    <Bookmark className="h-4 w-4" />
                    Save
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-emerald-600 text-white font-medium flex items-center justify-center gap-2 hover:bg-emerald-700 transition-colors">
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}