// Server-only root data module — loads morphology index and provides root-level queries.
//
// SERVER-ONLY: reads from data/morphology-index.json. Never import from client components.
//
// This module provides:
//   - loadMorphologyIndex(): loads and caches the morphology index
//   - getRootOccurrences(root): returns all occurrences for a root (no lemma filtering)
//   - getRootStats(root): returns occurrence count and distinct ayat count
//   - getAllRoots(): returns all roots present in the morphology index
//
// The occurrence-index.ts module filters by includedLemmas for approved roots.
// This module provides unfiltered root-level data for review and pending states.

import path from "node:path";
import fs from "node:fs";
import type { MorphologyRecord } from "./types";
import { getSurah } from "@/lib/quran/data";
import { ROOT_ALLOWLIST, type RootTopicEntry } from "./root-allowlist";

const DATA_DIR = path.join(process.cwd(), "data");
const MORPHOLOGY_INDEX_PATH = path.join(DATA_DIR, "morphology-index.json");

// Cache across HMR reloads
const cache = (
  globalThis as unknown as {
    __alhudaMorphologyIndex?: {
      records: MorphologyRecord[] | null;
      rootIndex: Map<string, MorphologyRecord[]> | null;
    };
  }
).__alhudaMorphologyIndex ?? {
  records: null,
  rootIndex: null,
};
(globalThis as unknown as { __alhudaMorphologyIndex?: typeof cache }).__alhudaMorphologyIndex =
  cache;

/**
 * Load the morphology index from disk. Returns cached data if available.
 * Fills canonicalArabic from getSurah() if not present in the index (the index
 * omits it to save space).
 */
export function loadMorphologyIndex(): MorphologyRecord[] {
  if (cache.records) return cache.records;

  if (!fs.existsSync(MORPHOLOGY_INDEX_PATH)) {
    console.warn(
      `Morphology index not found at ${MORPHOLOGY_INDEX_PATH}. Run scripts/import-morphology.py first.`
    );
    cache.records = [];
    return cache.records;
  }

  try {
    const raw = fs.readFileSync(MORPHOLOGY_INDEX_PATH, "utf-8");
    const data = JSON.parse(raw);

    if (!Array.isArray(data)) {
      console.error("Morphology index is not an array");
      cache.records = [];
      return cache.records;
    }

    // Validate and fill canonicalArabic
    const records: MorphologyRecord[] = [];
    for (const item of data) {
      if (
        item &&
        typeof item === "object" &&
        item.ref &&
        typeof item.ref.surah === "number" &&
        typeof item.ref.ayah === "number" &&
        typeof item.token === "string" &&
        typeof item.sourceId === "string"
      ) {
        const record = item as MorphologyRecord;

        // Fill canonicalArabic from getSurah() if not present
        if (!record.canonicalArabic) {
          const surah = getSurah(record.ref.surah);
          if (surah) {
            const ayah = surah.ayat.find((a) => a.ayah === record.ref.ayah);
            if (ayah) {
              record.canonicalArabic = ayah.arabic;
            }
          }
        }

        records.push(record);
      }
    }

    cache.records = records;
    return cache.records;
  } catch (error) {
    console.error("Failed to load morphology index:", error);
    cache.records = [];
    return cache.records;
  }
}

/**
 * Build a root-level index: maps each root to all records with that root.
 * This is unfiltered — no lemma filtering. Used for review and pending states.
 */
export function buildRootIndex(): Map<string, MorphologyRecord[]> {
  if (cache.rootIndex) return cache.rootIndex;

  const records = loadMorphologyIndex();
  const index = new Map<string, MorphologyRecord[]>();

  for (const record of records) {
    if (!record.root) continue;
    const existing = index.get(record.root);
    if (existing) {
      existing.push(record);
    } else {
      index.set(record.root, [record]);
    }
  }

  cache.rootIndex = index;
  return cache.rootIndex;
}

/**
 * Get all occurrences for a root (no lemma filtering).
 * Returns records sorted by surah, ayah, wordPosition.
 */
export function getRootOccurrences(root: string): MorphologyRecord[] {
  const index = buildRootIndex();
  const records = index.get(root) ?? [];

  // Sort by surah, ayah, wordPosition
  return records.sort((a, b) => {
    if (a.ref.surah !== b.ref.surah) return a.ref.surah - b.ref.surah;
    if (a.ref.ayah !== b.ref.ayah) return a.ref.ayah - b.ref.ayah;
    return (a.wordPosition ?? 0) - (b.wordPosition ?? 0);
  });
}

/**
 * Get statistics for a root: occurrence count and distinct ayat count.
 */
export function getRootStats(root: string): {
  totalOccurrences: number;
  distinctAyat: number;
} {
  const records = getRootOccurrences(root);
  const ayatSet = new Set<string>();

  for (const record of records) {
    ayatSet.add(`${record.ref.surah}:${record.ref.ayah}`);
  }

  return {
    totalOccurrences: records.length,
    distinctAyat: ayatSet.size,
  };
}

/**
 * Get all roots present in the morphology index.
 */
export function getAllRoots(): string[] {
  const index = buildRootIndex();
  return Array.from(index.keys()).sort();
}

/**
 * Get all root-topic entries from the allowlist.
 * Includes pending-review, approved, and rejected entries.
 */
export function getAllRootTopicEntries(): RootTopicEntry[] {
  return ROOT_ALLOWLIST;
}

/**
 * Get a root-topic entry by slug.
 */
export function getRootTopicEntryBySlug(slug: string): RootTopicEntry | null {
  return ROOT_ALLOWLIST.find((e) => e.slug === slug) ?? null;
}

/**
 * Check if morphology data is available (index file exists).
 */
export function isMorphologyDataAvailable(): boolean {
  return fs.existsSync(MORPHOLOGY_INDEX_PATH);
}
