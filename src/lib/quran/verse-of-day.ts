// Deterministic verse-of-the-day: a fixed, curated list of well-known ayat,
// picked by day-of-year so every visitor sees the same verse on a given day
// (no randomness, no server state, no personalization claims). The verse text
// itself always comes from the dataset — this module only picks a reference.

import type { Ayah } from "./types";
import { getAyah, getSurahIndex } from "./data";

/** Curated refs of widely known ayat (surah:ayah). Editorial pick, not tafsir. */
const VERSE_OF_DAY_REFS: ReadonlyArray<readonly [number, number]> = [
  [2, 255], // Ayat al-Kursi
  [13, 28], // hearts find rest in remembrance
  [94, 5], // with hardship comes ease
  [2, 152], // remember Me, I will remember you
  [39, 53], // do not despair of the mercy of Allah
  [110, 3], // ask forgiveness of your Lord
  [14, 7], // if you are grateful, I will increase you
  [65, 3], // sufficient is Allah as Disposer of affairs
  [3, 185], // every soul will taste death
  [2, 286], // Allah does not burden a soul beyond its capacity
  [103, 3], // patience and truthfulness
  [112, 2], // Allah, the Eternal Refuge
  [2, 2], // guidance for the conscious of Allah
  [14, 31], // curated reference
  [7, 57], // spend from what We have provided
  [51, 22], // provision in heaven and earth
  [55, 13], // which favor would you deny
  [67, 1], // blessed is He in whose hand is dominion
  [18, 10], // our Lord, grant us mercy
  [25, 63], // servants of the Most Merciful
  [29, 45], // greater indeed is the remembrance of Allah
  [33, 41], // remember Allah much
  [40, 60], // call upon Me, I will respond
  [42, 22], // curated reference
];

export interface VerseOfDay {
  surah: number;
  ayah: number;
  surahTransliteration: string;
  surahArabicName: string;
  verse: Ayah;
}

/** Day-of-year in UTC, stable across the visitor's timezone boundaries. */
function dayOfYearUTC(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const now = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
  return Math.floor((now - start) / 86_400_000);
}

export function getVerseOfDay(now: Date = new Date()): VerseOfDay | null {
  const index = dayOfYearUTC(now) % VERSE_OF_DAY_REFS.length;
  const [surah, ayah] = VERSE_OF_DAY_REFS[index];
  const verse = getAyah(surah, ayah);
  if (!verse) return null;
  const meta = getSurahIndex().find((s) => s.id === surah);
  return {
    surah,
    ayah,
    surahTransliteration: meta?.transliteration ?? `Surah ${surah}`,
    surahArabicName: meta?.arabicName ?? "",
    verse,
  };
}
