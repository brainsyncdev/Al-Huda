"use client";

import { useState } from "react";
import { Heart, BookOpen, Share2, ChevronDown, ChevronUp } from "lucide-react";
import { Ayah, Translation, TafsirEntry } from "@/types/quran";
import { ReferenceBar } from "./ReferenceBar";
import { getSurah } from "@/data/quran-data";

interface AyahCardProps {
  ayah: Ayah;
  translation: Translation;
  tafsir?: TafsirEntry;
  showTafsir?: boolean;
  depthLevel?: "simple" | "intermediate" | "deep" | "scholar";
  onSave?: (ayah: Ayah) => void;
  onShare?: (ayah: Ayah) => void;
  isSaved?: boolean;
}

export function AyahCard({
  ayah,
  translation,
  tafsir,
  showTafsir = false,
  depthLevel = "intermediate",
  onSave,
  onShare,
  isSaved = false,
}: AyahCardProps) {
  const [expanded, setExpanded] = useState(showTafsir);
  const [isSavedState, setIsSavedState] = useState(isSaved);
  
  const surah = getSurah(ayah.surahId);

  const handleSave = () => {
    setIsSavedState(!isSavedState);
    onSave?.(ayah);
  };

  const tafsirLinks = [
    { scholar: "Ibn Kathir", url: `https://quran.com/${ayah.surahId}:${ayah.ayahNumber}?ref=ibnkathir` },
    { scholar: "Al-Sa'di", url: `https://quran.com/${ayah.surahId}:${ayah.ayahNumber}?ref=alsaadi` },
    { scholar: "Muyassar", url: `https://quran.com/${ayah.surahId}:${ayah.ayahNumber}?ref=muyassar` },
  ];

  return (
    <div className="group relative bg-card rounded-xl border shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Arabic Text */}
      <div 
        className="arabic-text p-6 pb-4 text-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <p className="text-3xl leading-[2.8] text-foreground" dir="rtl">
          {ayah.arabicText}
        </p>
        
        <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Translation & Context */}
      <div className="px-6 pb-4 space-y-3">
        <div className="flex items-start gap-2">
          <span className="text-primary mt-1">📖</span>
          <p className="urdu-text text-base leading-relaxed text-foreground/90">
            {translation.translation}
          </p>
        </div>

        {expanded && (
          <div className="space-y-3 pt-2 border-t animate-in slide-in-from-top-2 duration-200">
            {depthLevel !== "simple" && tafsir && (
              <div className="flex items-start gap-2">
                <span className="text-primary mt-1">🕌</span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">یہ آیت کیوں آئی:</p>
                  <p className="text-sm text-foreground/80 urdu-text">
                    {tafsir.contentUrdu || tafsir.content}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reference Bar */}
      <div className="px-6 pb-4">
        <ReferenceBar
          type="ayah"
          surahNumber={ayah.surahId}
          ayahNumber={ayah.ayahNumber}
          surahName={surah?.transliteration}
          revelationType={surah?.revelationType}
          juz={ayah.juz}
          page={ayah.page}
          externalUrl={`https://quran.com/${ayah.surahId}:${ayah.ayahNumber}`}
          tafsirLinks={tafsirLinks}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-4 flex items-center gap-2">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            isSavedState
              ? "bg-primary/10 text-primary"
              : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
          }`}
        >
          <Heart className={`h-4 w-4 ${isSavedState ? "fill-current" : ""}`} />
          <span>{isSavedState ? "محفوظ" : "Save"}</span>
        </button>
        
        <button
          onClick={() => onShare?.(ayah)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </button>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-secondary/50 text-muted-foreground hover:bg-secondary transition-colors mr-auto"
        >
          <BookOpen className="h-4 w-4" />
          <span>{expanded ? "کم" : "مزید"}</span>
        </button>
      </div>
    </div>
  );
}

export default AyahCard;