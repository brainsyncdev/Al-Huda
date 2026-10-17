// Quran search: references, Arabic text (normalized), English translation, and
// transliteration. Runs server-side against the full 6,236-ayah corpus.
//
// Arabic normalization is for MATCHING ONLY and never mutates stored text:
// we build a parallel normalized copy used solely for lookup. Per PRD, the
// displayed Arabic remains exactly as provided by the dataset.

import type { Ayah, ParsedReference } from "./types";
import { getSurah, getSurahIndex } from "./data";
import { parseReference } from "./reference";

/** Strip Quranic diacritics/marks and unify common letter variants for lookup. */
export function normalizeArabic(input: string): string {
  return input
    .normalize("NFC")
    // Remove harakat, superscript alef, Quranic annotation marks, tatweel.
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED\u0640]/g, "")
    // Unify alef forms.
    .replace(/[\u0622\u0623\u0625\u0671]/g, "\u0627")
    // Alef maqsura -> ya.
    .replace(/\u0649/g, "\u064A")
    // Ta marbuta -> ha (helps matching transliteration-style queries).
    .replace(/\u0629/g, "\u0647")
    .toLowerCase();
}

/** Lowercase, collapse whitespace, strip light punctuation for English lookups. */
export function normalizeLatin(input: string): string {
  return input
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type MatchReason =
  | "reference"
  | "arabic"
  | "translation"
  | "transliteration"
  | "surah-name";

export interface SearchHit {
  surah: number;
  ayah: number;
  surahTransliteration: string;
  surahSlug: string;
  arabic: string;
  translation: string;
  transliteration: string;
  reason: MatchReason;
}

export interface SearchResults {
  query: string;
  reference: ParsedReference | null;
  hits: SearchHit[];
  /** True when the reference resolved to a surah/ayah but was out of range. */
  referenceOutOfRange: boolean;
  totalScanned: number;
}

let corpusCache: { arabic: Map<number, string>; latin: Map<number, string> } | null =
  null;

function key(surah: number, ayah: number): number {
  return surah * 1000 + ayah;
}

function ensureCorpus(): { arabic: Map<number, string>; latin: Map<number, string> } {
  if (corpusCache) return corpusCache;
  const arabic = new Map<number, string>();
  const latin = new Map<number, string>();
  for (const meta of getSurahIndex()) {
    const surah = getSurah(meta.id);
    if (!surah) continue;
    for (const a of surah.ayat) {
      const k = key(a.surah, a.ayah);
      arabic.set(k, normalizeArabic(a.arabic));
      latin.set(
        k,
        `${normalizeLatin(a.translation)} ${normalizeLatin(a.transliteration)}`
      );
    }
  }
  corpusCache = { arabic, latin };
  return corpusCache;
}

export interface SearchOptions {
  limit?: number;
}

/** Full search entry point. Deterministic ordering: reference first (when the
 *  query is a valid reference), then exact word-boundary matches ordered by
 *  canonical mushaf order. */
export function searchQuran(query: string, options: SearchOptions = {}): SearchResults {
  const limit = options.limit ?? 50;
  const trimmed = query.trim();
  const empty: SearchResults = {
    query: trimmed,
    reference: null,
    hits: [],
    referenceOutOfRange: false,
    totalScanned: 0,
  };
  if (trimmed.length < 2) return empty;

  const index = getSurahIndex();
  const hits: SearchHit[] = [];

  // 1) Reference parsing ("2:255", "baqarah 255", "36").
  const reference = parseReference(trimmed);
  if (reference) {
    const surah = getSurah(reference.surah);
    if (surah) {
      if (reference.ayah !== undefined) {
        const ayah = surah.ayat[reference.ayah - 1];
        if (ayah) {
          hits.push(toHit(surah.transliteration, surah.slug, ayah, "reference"));
          return { query: trimmed, reference, hits, referenceOutOfRange: false, totalScanned: 0 };
        }
        return {
          query: trimmed,
          reference,
          hits,
          referenceOutOfRange: true,
          totalScanned: 0,
        };
      }
      // Surah-only reference: surface its first few ayat as entry points.
      for (const ayah of surah.ayat.slice(0, 3)) {
        hits.push(toHit(surah.transliteration, surah.slug, ayah, "surah-name"));
      }
      return { query: trimmed, reference, hits, referenceOutOfRange: false, totalScanned: 0 };
    }
  }

  // 2) Surah-name matching for non-reference text ("baqarah the cow").
  const latinQuery = normalizeLatin(trimmed);
  if (latinQuery) {
    for (const meta of index) {
      const nameHay = normalizeLatin(
        `${meta.transliteration} ${meta.meaning} ${meta.slug}`
      );
      if (nameHay.includes(latinQuery) && latinQuery.length >= 3) {
        const surah = getSurah(meta.id);
        if (surah) {
          for (const ayah of surah.ayat.slice(0, 2)) {
            hits.push(toHit(meta.transliteration, meta.slug, ayah, "surah-name"));
          }
        }
      }
    }
  }

  // 3) Arabic text search (normalized), then 4) translation/transliteration.
  const arabicQuery = normalizeArabic(trimmed);
  const isArabicQuery = /[\u0600-\u06FF]/.test(trimmed);
  const corpus = ensureCorpus();
  let scanned = 0;

  for (const meta of index) {
    const surah = getSurah(meta.id);
    if (!surah) continue;
    for (const ayah of surah.ayat) {
      scanned++;
      const k = key(ayah.surah, ayah.ayah);

      if (isArabicQuery && arabicQuery.length >= 2) {
        if (corpus.arabic.get(k)?.includes(arabicQuery)) {
          hits.push(toHit(meta.transliteration, meta.slug, ayah, "arabic"));
          continue;
        }
      }

      if (latinQuery.length >= 2) {
        const hay = corpus.latin.get(k) ?? "";
        if (hay.includes(latinQuery)) {
          const reason: MatchReason = normalizeLatin(ayah.translation).includes(
            latinQuery
          )
            ? "translation"
            : "transliteration";
          hits.push(toHit(meta.transliteration, meta.slug, ayah, reason));
        }
      }

      if (hits.length >= limit) break;
    }
    if (hits.length >= limit) break;
  }

  return {
    query: trimmed,
    reference,
    hits: hits.slice(0, limit),
    referenceOutOfRange: false,
    totalScanned: scanned,
  };
}

function toHit(
  surahTransliteration: string,
  surahSlug: string,
  ayah: Ayah,
  reason: MatchReason
): SearchHit {
  return {
    surah: ayah.surah,
    ayah: ayah.ayah,
    surahTransliteration,
    surahSlug,
    arabic: ayah.arabic,
    translation: ayah.translation,
    transliteration: ayah.transliteration,
    reason,
  };
}

/** Highlight boundaries for an English quote snippet. Searches the raw
 *  translation text (case-insensitive); returns null when the literal query
 *  does not appear (e.g. only a normalized form matched). */
export function findSnippetRange(
  translation: string,
  query: string,
  pad = 60
): { text: string; matchStart: number; matchEnd: number } | null {
  const needle = query.trim().toLowerCase();
  if (!needle) return null;
  const start = translation.toLowerCase().indexOf(needle);
  if (start < 0) return null;

  const end = start + needle.length;
  const from = Math.max(0, start - pad);
  const to = Math.min(translation.length, end + pad);
  const prefix = from > 0 ? "…" : "";
  const text = `${prefix}${translation.slice(from, to)}${
    to < translation.length ? "…" : ""
  }`;
  return {
    text,
    matchStart: start - from + prefix.length,
    matchEnd: end - from + prefix.length,
  };
}
