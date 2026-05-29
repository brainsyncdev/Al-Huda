"use client";

import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Play, Heart, Share2, Settings, ChevronDown, ChevronUp } from "lucide-react";
import { getSurah, getAyahs, getTranslation, getTafsir } from "@/data/quran-data";
import { AyahCard } from "@/components/quran/AyahCard";
import { SurahHeader } from "@/components/quran/SurahHeader";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SurahPage({ params }: PageProps) {
  const { id } = use(params);
  const surahId = parseInt(id);
  const surah = getSurah(surahId);
  const ayahs = getAyahs(surahId);
  const [depthLevel, setDepthLevel] = useState<"simple" | "intermediate" | "deep" | "scholar">("intermediate");

  if (!surah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Surah not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Link href="/quran" className="p-2 -ml-2 rounded-lg hover:bg-secondary">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-semibold">{surah.transliteration}</h1>
              <p className="text-xs text-muted-foreground">{surah.meaningEnglish}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-secondary">
                <Heart className="h-5 w-5" />
              </button>
              <button className="p-2 rounded-lg hover:bg-secondary">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Surah Info Bar */}
          <SurahHeader surah={surah} ayahCount={ayahs.length} />
        </div>
      </header>

      {/* Depth Selector */}
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Depth:</span>
          {[
            { id: "simple", label: "Simple" },
            { id: "intermediate", label: "With Context" },
            { id: "deep", label: "Deep" },
            { id: "scholar", label: "Scholar" },
          ].map((level) => (
            <button
              key={level.id}
              onClick={() => setDepthLevel(level.id as typeof depthLevel)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${
                depthLevel === level.id
                  ? "bg-primary text-white"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {level.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bismillah */}
      {surahId !== 9 && (
        <div className="max-w-3xl mx-auto px-4 py-6 text-center">
          <p className="arabic-text text-3xl text-primary" dir="rtl">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* Ayahs */}
      <main className="max-w-3xl mx-auto px-4 pb-24">
        <div className="space-y-6">
          {ayahs.map((ayah) => {
            const translation = getTranslation(ayah.id);
            const tafsir = getTafsir(ayah.id);

            if (!translation) return null;

            return (
              <AyahCard
                key={ayah.id}
                ayah={ayah}
                translation={translation}
                tafsir={tafsir}
                depthLevel={depthLevel}
                showTafsir={depthLevel !== "simple"}
              />
            );
          })}
        </div>

        {/* End of Surah */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-secondary">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-sm font-medium">End of Surah {surah.transliteration}</span>
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
          
          <p className="arabic-text text-2xl text-primary mt-4" dir="rtl">
            سبحان ربک رب العزة عما يصفون
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            "Glory to your Lord, the Lord of Honor, above what they describe"
          </p>
        </div>
      </main>
    </div>
  );
}