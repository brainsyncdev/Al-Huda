// Core Quran domain types. All content types carry provenance via SourceRecord
// (see sources.ts) per PRD content-integrity rules.

export type RevelationType = "meccan" | "medinan";

/** Metadata for one surah, without verses. */
export interface SurahMeta {
  /** 1–114 */
  id: number;
  /** Canonical URL slug derived from transliteration, e.g. "al-baqarah" */
  slug: string;
  /** Arabic name as provided by the dataset, e.g. "البقرة" */
  arabicName: string;
  /** Latin transliteration as provided by the dataset, e.g. "Al-Baqarah" */
  transliteration: string;
  /** English meaning as provided by the dataset, e.g. "The Cow" */
  meaning: string;
  revelation: RevelationType;
  /** Total ayah count declared by the dataset (validated against verses.length). */
  ayahCount: number;
}

/** One ayah with all three fields provided by the dataset. */
export interface Ayah {
  surah: number;
  ayah: number;
  /** Uthmani Arabic text. Never alter, normalize, or reconstruct. */
  arabic: string;
  /** Saheeh International English translation. */
  translation: string;
  /** Transliteration. */
  transliteration: string;
}

/** Full surah: metadata + all ayat in canonical order. */
export interface Surah extends SurahMeta {
  ayat: Ayah[];
}

/** Stable ayah reference, 1-based. Canonical string form: "surah:ayah" (e.g. "2:255"). */
export interface AyahRef {
  surah: number;
  ayah: number;
}

/** Result of parsing a user-supplied reference string. */
export interface ParsedReference {
  surah: number;
  ayah?: number;
  /** How the input was interpreted, for search-result labeling. */
  kind: "numeric" | "name";
}

export function isValidSurah(n: number): n is number {
  return Number.isInteger(n) && n >= 1 && n <= 114;
}
