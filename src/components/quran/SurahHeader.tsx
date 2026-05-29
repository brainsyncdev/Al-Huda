"use client";

import { Surah } from "@/types/quran";

interface SurahHeaderProps {
  surah: Surah;
  ayahCount: number;
}

export function SurahHeader({ surah, ayahCount }: SurahHeaderProps) {
  return (
    <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground overflow-x-auto">
      <span className="flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        {surah.revelationType === "meccan" ? "Makki" : "Madani"}
      </span>
      <span>•</span>
      <span>{ayahCount} Verses</span>
      <span>•</span>
      <span>Juz {surah.juzStart}</span>
      <span>•</span>
      <span>{surah.orderRevealed}th Revealed</span>
    </div>
  );
}

export default SurahHeader;