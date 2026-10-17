// Filesystem-backed Quran data loader.
//
// Source: quran-json@3.1.2 (CC-BY-4.0) — see docs/DATA-PROVENANCE.md and
// src/lib/quran/sources.ts. The Uthmani Arabic text and the Saheeh
// International translation are consumed verbatim; this module never mutates
// verse content. Text-level transformation is limited to slug generation for
// URLs (from the Latin transliteration only).
//
// Server-only: reads from node_modules/quran-json/dist/chapters/en via fs.

import fs from "node:fs";
import path from "node:path";
import type { Ayah, RevelationType, Surah, SurahMeta } from "./types";
import { isValidSurah } from "./types";

const CHAPTER_DIR = path.join(
  process.cwd(),
  "node_modules",
  "quran-json",
  "dist",
  "chapters",
  "en"
);

interface RawVerse {
  id: number;
  text: string;
  translation: string;
  transliteration: string;
}

interface RawChapter {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
  verses: RawVerse[];
}

interface RawIndexEntry {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: string;
  total_verses: number;
}

/** URL slug from the dataset's Latin transliteration. Strips apostrophes,
 * lowercases, and hyphenates. e.g. "Al-Ma'idah" -> "al-maidah", "'Abasa" -> "abasa". */
export function slugifyTransliteration(transliteration: string): string {
  return transliteration
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Cache across HMR reloads by stashing on globalThis.
const cache = (
  globalThis as unknown as {
    __alhudaQuranCache?: {
      index: SurahMeta[] | null;
      slugToId: Map<string, number>;
      surahs: Map<number, Surah>;
    };
  }
).__alhudaQuranCache ?? {
  index: null,
  slugToId: new Map<string, number>(),
  surahs: new Map<number, Surah>(),
};
(globalThis as unknown as { __alhudaQuranCache?: typeof cache }).__alhudaQuranCache =
  cache;

function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
}

function toRevelationType(type: string): RevelationType {
  return type === "medinan" ? "medinan" : "meccan";
}

function toSurahMeta(entry: RawIndexEntry | RawChapter): SurahMeta {
  return {
    id: entry.id,
    slug: slugifyTransliteration(entry.transliteration),
    arabicName: entry.name,
    transliteration: entry.transliteration,
    meaning: entry.translation,
    revelation: toRevelationType(entry.type),
    ayahCount: entry.total_verses,
  };
}

/** All 114 surahs' metadata, in canonical order. */
export function getSurahIndex(): SurahMeta[] {
  if (cache.index) return cache.index;

  const raw = readJson<RawIndexEntry[]>(path.join(CHAPTER_DIR, "index.json"));
  if (!Array.isArray(raw) || raw.length !== 114) {
    throw new Error(
      `Quran dataset validation failed: expected 114 surahs in index.json, received ${
        Array.isArray(raw) ? raw.length : "non-array"
      }`
    );
  }

  cache.index = raw.map(toSurahMeta);

  cache.slugToId.clear();
  for (const meta of cache.index) {
    cache.slugToId.set(meta.slug, meta.id);
  }

  return cache.index;
}

/** Resolve a URL slug (or numeric string) to a surah id, or null. */
export function getSurahIdBySlug(slug: string): number | null {
  getSurahIndex();
  if (/^\d{1,3}$/.test(slug)) {
    const n = Number(slug);
    return isValidSurah(n) ? n : null;
  }
  return cache.slugToId.get(slug.toLowerCase()) ?? null;
}

/** Canonical slug for a surah id. */
export function getSurahSlug(id: number): string {
  const meta = getSurahIndex().find((s) => s.id === id);
  return meta ? meta.slug : "";
}

/** Full surah (metadata + ayat) by 1-based id, or null when out of range.
 *  Verse content is returned exactly as provided by the dataset. */
export function getSurah(id: number): Surah | null {
  if (!isValidSurah(id)) return null;
  const cached = cache.surahs.get(id);
  if (cached) return cached;

  const meta = getSurahIndex().find((s) => s.id === id);
  if (!meta) return null;

  const raw = readJson<RawChapter>(path.join(CHAPTER_DIR, `${id}.json`));
  if (raw.verses.length !== meta.ayahCount) {
    throw new Error(
      `Quran dataset validation failed: surah ${id} declares ${meta.ayahCount} ayat but file contains ${raw.verses.length}`
    );
  }

  const surah: Surah = {
    ...meta,
    ayat: raw.verses.map((v) => ({
      surah: id,
      ayah: v.id,
      arabic: v.text,
      translation: v.translation,
      transliteration: v.transliteration,
    })),
  };

  cache.surahs.set(id, surah);
  return surah;
}

/** One ayah by reference, or null when the reference is out of range. */
export function getAyah(surah: number, ayah: number): Ayah | null {
  const s = getSurah(surah);
  if (!s || !Number.isInteger(ayah) || ayah < 1 || ayah > s.ayahCount) return null;
  return s.ayat[ayah - 1] ?? null;
}

/** Surahs immediately surrounding an ayah for context display (default ±2). */
export function getAyahContext(
  surah: number,
  ayah: number,
  radius = 2
): { ayat: Ayah[]; targetIndex: number } | null {
  const s = getSurah(surah);
  if (!s || !Number.isInteger(ayah) || ayah < 1 || ayah > s.ayahCount) return null;
  const start = Math.max(1, ayah - radius);
  const end = Math.min(s.ayahCount, ayah + radius);
  const ayat = s.ayat.slice(start - 1, end);
  return { ayat, targetIndex: ayah - start };
}

export interface DatasetValidationReport {
  surahCount: number;
  totalAyat: number;
  issues: string[];
}

/** Validate structural integrity of the ingested dataset (PRD data-validation
 *  gates: counts, sequential ids, declared-vs-actual verse counts). Does not
 *  alter any content. */
export function validateDataset(): DatasetValidationReport {
  const issues: string[] = [];
  const index = getSurahIndex();

  if (index.length !== 114) {
    issues.push(`Expected 114 surahs, found ${index.length}`);
  }

  let totalAyat = 0;
  const seenIds = new Set<number>();
  const seenSlugs = new Set<string>();

  for (const meta of index) {
    if (seenIds.has(meta.id)) issues.push(`Duplicate surah id ${meta.id}`);
    seenIds.add(meta.id);
    if (seenSlugs.has(meta.slug)) issues.push(`Duplicate surah slug "${meta.slug}"`);
    seenSlugs.add(meta.slug);

    const surah = getSurah(meta.id);
    if (!surah) {
      issues.push(`Surah ${meta.id} failed to load`);
      continue;
    }
    if (surah.ayat.length !== meta.ayahCount) {
      issues.push(
        `Surah ${meta.id} (${meta.transliteration}): declared ${meta.ayahCount} ayat, file contains ${surah.ayat.length}`
      );
    }
    surah.ayat.forEach((a, i) => {
      if (a.ayah !== i + 1) {
        issues.push(`Surah ${meta.id}: ayah sequence break at position ${i + 1}`);
      }
      if (!a.arabic || !a.translation) {
        issues.push(`Surah ${meta.id}:${a.ayah} has empty text or translation`);
      }
    });
    totalAyat += surah.ayat.length;
  }

  // Canonical total for the Tanzil-sourced Uthmani text.
  if (totalAyat !== 6236) {
    issues.push(`Expected 6236 total ayat, found ${totalAyat}`);
  }

  return { surahCount: index.length, totalAyat, issues };
}
