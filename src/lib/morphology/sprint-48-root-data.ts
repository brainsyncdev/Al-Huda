// Sprint 49 — Data loader for all 1,574 Sprint 48 auto-activated roots.
//
// This module provides a unified interface for accessing root data from the
// Sprint 48 activation pipeline. It complements the existing ROOT_ALLOWLIST
// (10 manual roots) by supporting all auto-activated roots.
//
// DESIGN:
//   - Loads registry once and caches it
//   - Loads occurrence files on demand (not all 1,574 at once)
//   - Provides search by Arabic root and transliteration
//   - Generates transliterations for Arabic roots
//   - Does NOT modify ROOT_ALLOWLIST or manual root history

import path from "node:path";
import fs from "node:fs";

const DATA_DIR = path.join(process.cwd(), "data");
const REGISTRY_PATH = path.join(DATA_DIR, "root-discovery-registry.json");
const OCCURRENCES_DIR = path.join(DATA_DIR, "root-occurrences");

// Cache
const cache = (
  globalThis as unknown as {
    __alhudaSprint48Registry?: {
      registry: Sprint48Registry | null;
      bySlug: Map<string, Sprint48RegistryRoot> | null;
      byArabic: Map<string, Sprint48RegistryRoot> | null;
      transliterationIndex: Map<string, Sprint48RegistryRoot> | null;
    };
  }
).__alhudaSprint48Registry ?? {
  registry: null,
  bySlug: null,
  byArabic: null,
  transliterationIndex: null,
};
(globalThis as unknown as { __alhudaSprint48Registry?: typeof cache }).__alhudaSprint48Registry =
  cache;

/**
 * Sprint 48 registry root entry.
 */
export interface Sprint48RegistryRoot {
  slug: string;
  root: string;
  status: "activated" | "partially-activated" | "needs-review" | "discovered";
  totalLemmas: number;
  autoAcceptedLemmas: number;
  needsReviewLemmas: number;
  rejectedLemmas: number;
  occurrenceCount: number;
  distinctAyahCount: number;
  includedLemmas: string[];
  missingLemmaRecords: number;
  policyVersion: string;
  sourceDataset: string;
  activatedAt: string | null;
  transliteration?: string;
}

/**
 * Sprint 48 registry structure.
 */
export interface Sprint48Registry {
  generatedAt: string;
  policyVersion: string;
  sourceDataset: string;
  aiProvider: string;
  summary: {
    totalRoots: number;
    activated: number;
    partiallyActivated: number;
    needsReview: number;
    discovered: number;
    totalOccurrences: number;
    totalDistinctAyat: number;
    totalLemmasActivated: number;
  };
  roots: Sprint48RegistryRoot[];
}

/**
 * Occurrence index entry (from occurrence file).
 */
export interface Sprint48OccurrenceIndex {
  entry: {
    slug: string;
    title: string;
    arabicTitle: string;
    roots: string[];
    includedLemmas: string[];
    maxResults: number | undefined;
    reviewState: "approved" | "auto-accepted";
    assertedBy: string;
    assertedAt: string;
    notes: string;
  };
  occurrences: Array<{
    ref: { surah: number; ayah: number };
    matchedToken: string;
    matchedLemma: string;
    matchedRoot: string;
    wordPosition?: number;
  }>;
  uniqueAyahs: Array<{ surah: number; ayah: number }>;
  totalOccurrences: number;
  totalMatches: number;
  pagination: null;
}

/**
 * Simple Arabic-to-Latin transliteration map.
 * This is a basic phonetic transliteration for search purposes.
 */
const ARABIC_TO_LATIN: Record<string, string> = {
  "ا": "a",
  "ب": "b",
  "ت": "t",
  "ث": "th",
  "ج": "j",
  "ح": "h",
  "خ": "kh",
  "د": "d",
  "ذ": "dh",
  "ر": "r",
  "ز": "z",
  "س": "s",
  "ش": "sh",
  "ص": "s",
  "ض": "d",
  "ط": "t",
  "ظ": "z",
  "ع": "",
  "غ": "gh",
  "ف": "f",
  "ق": "q",
  "ك": "k",
  "ل": "l",
  "م": "m",
  "ن": "n",
  "ه": "h",
  "و": "w",
  "ي": "y",
  "ة": "h",
  "ى": "a",
  "ء": "",
  "ئ": "",
  "ؤ": "",
  "َ": "a",
  "ُ": "u",
  "ِ": "i",
  "ّ": "",
  "ْ": "",
  "ً": "an",
  "ٌ": "un",
  "ٍ": "in",
  "ٰ": "a",
  "ٱ": "a",
};

/**
 * Generate a simple transliteration from an Arabic root.
 */
export function transliterateArabic(arabic: string): string {
  let result = "";
  for (const char of arabic) {
    result += ARABIC_TO_LATIN[char] ?? char;
  }
  return result.toLowerCase();
}

/**
 * Load the Sprint 48 registry.
 */
export function loadSprint48Registry(): Sprint48Registry | null {
  if (cache.registry) return cache.registry;

  if (!fs.existsSync(REGISTRY_PATH)) {
    console.warn(`Sprint 48 registry not found at ${REGISTRY_PATH}`);
    return null;
  }

  try {
    const raw = fs.readFileSync(REGISTRY_PATH, "utf-8");
    const data = JSON.parse(raw) as Sprint48Registry;

    // Add transliterations
    for (const root of data.roots) {
      root.transliteration = transliterateArabic(root.root);
    }

    cache.registry = data;
    return data;
  } catch (error) {
    console.error("Failed to load Sprint 48 registry:", error);
    return null;
  }
}

/**
 * Build indexes for fast lookup.
 */
function buildIndexes(): void {
  if (cache.bySlug && cache.byArabic && cache.transliterationIndex) return;

  const registry = loadSprint48Registry();
  if (!registry) {
    cache.bySlug = new Map();
    cache.byArabic = new Map();
    cache.transliterationIndex = new Map();
    return;
  }

  const bySlug = new Map<string, Sprint48RegistryRoot>();
  const byArabic = new Map<string, Sprint48RegistryRoot>();
  const transliterationIndex = new Map<string, Sprint48RegistryRoot>();

  for (const root of registry.roots) {
    bySlug.set(root.slug, root);
    byArabic.set(root.root, root);
    if (root.transliteration) {
      transliterationIndex.set(root.transliteration, root);
    }
  }

  cache.bySlug = bySlug;
  cache.byArabic = byArabic;
  cache.transliterationIndex = transliterationIndex;
}

/**
 * Get a root by its slug (Arabic root name for auto-activated roots).
 */
export function getSprint48RootBySlug(slug: string): Sprint48RegistryRoot | null {
  buildIndexes();
  return cache.bySlug?.get(slug) ?? null;
}

/**
 * Get a root by its Arabic root string.
 */
export function getSprint48RootByArabic(arabic: string): Sprint48RegistryRoot | null {
  buildIndexes();
  return cache.byArabic?.get(arabic) ?? null;
}

/**
 * Search roots by Arabic root (partial match).
 */
export function searchSprint48RootsByArabic(query: string): Sprint48RegistryRoot[] {
  const registry = loadSprint48Registry();
  if (!registry) return [];

  const normalizedQuery = query.trim();
  if (!normalizedQuery) return [];

  return registry.roots.filter((root) => root.root.includes(normalizedQuery));
}

/**
 * Search roots by transliteration (partial match, case-insensitive).
 */
export function searchSprint48RootsByTransliteration(query: string): Sprint48RegistryRoot[] {
  const registry = loadSprint48Registry();
  if (!registry) return [];

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return registry.roots.filter((root) => {
    if (!root.transliteration) return false;
    return root.transliteration.includes(normalizedQuery);
  });
}

/**
 * Search roots by slug, Arabic, or transliteration.
 */
export function searchSprint48Roots(query: string): Sprint48RegistryRoot[] {
  const registry = loadSprint48Registry();
  if (!registry) return [];

  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const results = new Set<Sprint48RegistryRoot>();

  // Search by slug
  for (const root of registry.roots) {
    if (root.slug.toLowerCase().includes(normalizedQuery)) {
      results.add(root);
    }
  }

  // Search by Arabic
  for (const root of registry.roots) {
    if (root.root.includes(query.trim())) {
      results.add(root);
    }
  }

  // Search by transliteration
  for (const root of registry.roots) {
    if (root.transliteration && root.transliteration.includes(normalizedQuery)) {
      results.add(root);
    }
  }

  return Array.from(results);
}

/**
 * Load occurrence file for a root.
 */
export function loadSprint48OccurrenceFile(rootSlug: string): Sprint48OccurrenceIndex | null {
  const filePath = path.join(OCCURRENCES_DIR, `${rootSlug}.json`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as Sprint48OccurrenceIndex;
  } catch (error) {
    console.error(`Failed to load occurrence file for ${rootSlug}:`, error);
    return null;
  }
}

/**
 * Get all activated roots (status === "activated" or "partially-activated").
 */
export function getActivatedSprint48Roots(): Sprint48RegistryRoot[] {
  const registry = loadSprint48Registry();
  if (!registry) return [];

  return registry.roots.filter(
    (root) => root.status === "activated" || root.status === "partially-activated"
  );
}

/**
 * Get summary statistics.
 */
export function getSprint48Summary(): Sprint48Registry["summary"] | null {
  const registry = loadSprint48Registry();
  return registry?.summary ?? null;
}

/**
 * Check if Sprint 48 data is available.
 */
export function isSprint48DataAvailable(): boolean {
  return fs.existsSync(REGISTRY_PATH);
}
