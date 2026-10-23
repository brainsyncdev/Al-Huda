// Server-only: search a selected translation edition fetched from Tanzil.
//
// This module fetches translation text directly from Tanzil.net (no CORS
// issue server-side), parses the "surah|ayah|text" format, and caches the
// result in memory for the process lifetime. The Next.js data cache also
// caches the HTTP response for 24 hours.
//
// Used by the search page when the user picks a specific edition (FR-012)
// and by the /api/v1/search endpoint's edition parameter.

import { normalizeArabic, normalizeLatin } from "./search";
import { getTranslation, type TranslationMeta } from "./translations";
import { getSurahIndex } from "./data";

const cache = new Map<string, Map<string, string>>();
const inflight = new Map<string, Promise<Map<string, string> | null>>();

function parseTanzil(text: string): Map<string, string> {
  const map = new Map<string, string>();
  for (const line of text.split("\n")) {
    if (!line) continue;
    const first = line.indexOf("|");
    if (first < 0) continue;
    const second = line.indexOf("|", first + 1);
    if (second < 0) continue;
    const surah = line.slice(0, first);
    const ayah = line.slice(first + 1, second);
    const verse = line.slice(second + 1);
    map.set(`${surah}:${ayah}`, verse);
  }
  return map;
}

async function loadEdition(id: string): Promise<Map<string, string> | null> {
  const meta = getTranslation(id);
  if (!meta) return null;
  const existing = cache.get(id);
  if (existing) return existing;
  const pending = inflight.get(id);
  if (pending) return pending;
  const promise = (async (): Promise<Map<string, string> | null> => {
    try {
      const res = await fetch(
        `https://tanzil.net/trans/${encodeURIComponent(id)}`,
        {
          headers: {
            "User-Agent": "Al-Huda Quran App (https://al-huda.app)",
            Accept: "text/plain",
          },
          next: { revalidate: 86400 },
        }
      );
      if (!res.ok) return null;
      const text = await res.text();
      const map = parseTanzil(text);
      cache.set(id, map);
      return map;
    } catch {
      return null;
    } finally {
      inflight.delete(id);
    }
  })();
  inflight.set(id, promise);
  return promise;
}

export interface TranslationSearchHit {
  surah: number;
  ayah: number;
  surahTransliteration: string;
  text: string;
  snippet: { text: string; matchStart: number; matchEnd: number } | null;
}

export interface TranslationSearchResults {
  edition: TranslationMeta;
  query: string;
  hits: TranslationSearchHit[];
  totalScanned: number;
  loadError: boolean;
}

/**
 * Search a specific translation edition for the query. Returns null when the
 * edition id is not in the catalog. Returns a result with `loadError: true`
 * when the edition is known but the upstream fetch failed.
 */
export async function searchTranslationEdition(
  editionId: string,
  query: string,
  limit = 100
): Promise<TranslationSearchResults | null> {
  const meta = getTranslation(editionId);
  if (!meta) return null;

  const map = await loadEdition(editionId);
  if (!map) {
    return { edition: meta, query, hits: [], totalScanned: 0, loadError: true };
  }

  const isArabic = meta.direction === "rtl";
  const normalize = isArabic ? normalizeArabic : normalizeLatin;
  const needle = normalize(query.trim());
  if (needle.length < 2) {
    return { edition: meta, query, hits: [], totalScanned: 0, loadError: false };
  }

  const index = getSurahIndex();
  const hits: TranslationSearchHit[] = [];
  let scanned = 0;

  for (const s of index) {
    for (let a = 1; a <= s.ayahCount; a++) {
      scanned++;
      const text = map.get(`${s.id}:${a}`) ?? "";
      if (!text) continue;
      const hay = normalize(text);
      if (!hay.includes(needle)) continue;
      const snippet = findSnippet(text, query.trim(), isArabic);
      hits.push({
        surah: s.id,
        ayah: a,
        surahTransliteration: s.transliteration,
        text,
        snippet,
      });
      if (hits.length >= limit) break;
    }
    if (hits.length >= limit) break;
  }

  return { edition: meta, query, hits, totalScanned: scanned, loadError: false };
}

function findSnippet(
  text: string,
  query: string,
  isArabic: boolean
): { text: string; matchStart: number; matchEnd: number } | null {
  const pad = 60;
  const hay = isArabic ? text : text.toLowerCase();
  const needle = isArabic ? query.trim() : query.trim().toLowerCase();
  const start = hay.indexOf(needle);
  if (start < 0) return null;
  const end = start + needle.length;
  const from = Math.max(0, start - pad);
  const to = Math.min(text.length, end + pad);
  const prefix = from > 0 ? "\u2026" : "";
  const suffix = to < text.length ? "\u2026" : "";
  return {
    text: `${prefix}${text.slice(from, to)}${suffix}`,
    matchStart: start - from + prefix.length,
    matchEnd: end - from + prefix.length,
  };
}

/** Pre-warm the cache for an edition (best-effort, never throws). */
export function preloadEdition(id: string): void {
  const meta = getTranslation(id);
  if (!meta || cache.has(id) || inflight.has(id)) return;
  loadEdition(id).catch(() => {});
}
