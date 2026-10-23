// Audio recitation catalog (FR-054).
//
// Streams per-ayah MP3s from the Islamic Network CDN, which serves the
// everyayah.com recording set over a public, key-free endpoint:
//
//   https://cdn.islamic.network/quran/audio/{bitrate}/{edition}/{globalAyah}.mp3
//
// `globalAyah` is the corpus ordinal (1..6236), not the ayah-in-surah number —
// `toGlobalOrdinal()` from mushaf-data.ts produces it.
//
// Licensing note (recorded honestly rather than assumed): the CDN describes
// itself as free for open-source applications but publishes no explicit
// copyright licence for the recordings. This app streams at runtime and does
// not redistribute the files. See docs/DATA-PROVENANCE.md.

import { toGlobalOrdinal } from "./mushaf-data";

export interface Reciter {
  /** Edition id used by the CDN, e.g. "ar.alafasy". */
  id: string;
  name: string;
  /** Arabic name, shown alongside the Latin one. */
  nameArabic?: string;
}

/** Well-known verse-by-verse reciters available on the CDN. */
export const RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy", nameArabic: "مشاري راشد العفاسي" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", nameArabic: "محمود خليل الحصري" },
  { id: "ar.minshawi", name: "Mohamed Siddiq al-Minshawi", nameArabic: "محمد صديق المنشاوي" },
  { id: "ar.sudais", name: "Abdurrahman As-Sudais", nameArabic: "عبدالرحمن السديس" },
  { id: "ar.shuraim", name: "Saud Al-Shuraim", nameArabic: "سعود الشريم" },
  { id: "ar.abdulbasit", name: "Abdul Basit (Murattal)", nameArabic: "عبد الباسط" },
  { id: "ar.hudhaify", name: "Ali Al-Hudhaify", nameArabic: "علي الحذيفي" },
  { id: "ar.mahermuaiqly", name: "Maher Al Muaiqly", nameArabic: "ماهر المعيقلي" },
  { id: "ar.muhammadayyoub", name: "Muhammad Ayyoub", nameArabic: "محمد أيوب" },
  { id: "ar.muhammadjibreel", name: "Muhammad Jibreel", nameArabic: "محمد جبريل" },
  { id: "ar.abdullahbasfar", name: "Abdullah Basfar", nameArabic: "عبدالله بصفر" },
  { id: "ar.aymanswoaid", name: "Ayman Sowaid", nameArabic: "أيمن سويد" },
];

export const DEFAULT_RECITER_ID = "ar.alafasy";

/** Bitrates the CDN serves. 64 kbps is the sensible default for reading. */
export const AUDIO_BITRATES = [192, 128, 64, 48, 40, 32] as const;
export type AudioBitrate = (typeof AUDIO_BITRATES)[number];

export const DEFAULT_BITRATE: AudioBitrate = 64;

export function getReciter(id: string): Reciter | undefined {
  return RECITERS.find((r) => r.id === id);
}

/**
 * Per-ayah audio URL, or null when the reference or reciter is invalid.
 * Returning null rather than a best-effort URL means a bad reference can never
 * request a different verse's audio.
 */
export function ayahAudioUrl(
  reciterId: string,
  surah: number,
  ayah: number,
  bitrate: AudioBitrate = DEFAULT_BITRATE
): string | null {
  if (!getReciter(reciterId)) return null;
  const global = toGlobalOrdinal(surah, ayah);
  if (global === null) return null;
  return `https://cdn.islamic.network/quran/audio/${bitrate}/${reciterId}/${global}.mp3`;
}

/** Attribution line rendered next to the player. */
export const AUDIO_CREDIT = "Audio: Islamic Network CDN (everyayah.com recordings)";