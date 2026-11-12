// Translation enrichment layer for topic-ayah mappings.
// Connects the 767 mapping records to actual Quran translation content.
//
// This module loads mappings from data/taxonomy/topic-ayah-mappings.json,
// resolves each to actual ayat using the Quran dataset, and provides
// cached accessors for topic-based translation queries.

import fs from "node:fs";
import path from "node:path";
import { getAyah, getSurahIndex } from "../quran/data";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TopicMapping {
  id: string;
  topicId: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  mappingType: string;
  rationale: string;
  sourceIds: string[];
  provenance: string;
  status: string;
}

export interface AyahText {
  surahNumber: number;
  ayahNumber: number;
  arabicText: string;
  englishTranslation: string;
  transliteration: string;
  mappingId: string;
  mappingType: string;
  rationale: string;
}

export interface TopicTranslationResult {
  topicId: string;
  topicTitle: string;
  ayahs: AyahText[];
  totalAyahs: number;
  mappingTypeDistribution: Record<string, number>;
}

export interface TranslationSummary {
  topicId: string;
  totalAyahs: number;
  uniqueSurahs: number[];
  mappingTypes: Record<string, number>;
  hasDirectReferences: boolean;
  hasExplicitInstructions: boolean;
  hasPropheticNarratives: boolean;
  hasThematicReferences: boolean;
}

// ─── Data Loading ────────────────────────────────────────────────────────────

const MAPPINGS_PATH = path.join(
  process.cwd(),
  "data",
  "taxonomy",
  "topic-ayah-mappings.json"
);

// Cache across HMR reloads
const cache = (
  globalThis as unknown as {
    __alhudaTopicTranslationCache?: {
      mappings: TopicMapping[] | null;
      mappingsByTopic: Map<string, TopicMapping[]> | null;
    };
  }
).__alhudaTopicTranslationCache ?? {
  mappings: null,
  mappingsByTopic: null,
};
(globalThis as unknown as {
  __alhudaTopicTranslationCache?: typeof cache;
}).__alhudaTopicTranslationCache = cache;

function loadMappings(): TopicMapping[] {
  if (cache.mappings) return cache.mappings;

  // Strip UTF-8 BOM if present
  const fileContent = fs.readFileSync(MAPPINGS_PATH, "utf-8");
  const cleanedContent = fileContent.charCodeAt(0) === 0xFEFF
    ? fileContent.slice(1)
    : fileContent;
  const raw = JSON.parse(cleanedContent);
  if (!Array.isArray(raw)) {
    throw new Error(
      `Topic mappings validation failed: expected array, received ${typeof raw}`
    );
  }

  cache.mappings = raw as TopicMapping[];
  return cache.mappings;
}

function getMappingsByTopic(): Map<string, TopicMapping[]> {
  if (cache.mappingsByTopic) return cache.mappingsByTopic;

  const mappings = loadMappings();
  const byTopic = new Map<string, TopicMapping[]>();

  for (const mapping of mappings) {
    const existing = byTopic.get(mapping.topicId) ?? [];
    existing.push(mapping);
    byTopic.set(mapping.topicId, existing);
  }

  cache.mappingsByTopic = byTopic;
  return cache.mappingsByTopic;
}

// ─── Core Functions ──────────────────────────────────────────────────────────

/**
 * Get all mapped ayat for a topic with their Arabic text, English translation,
 * and transliteration. Handles ayah ranges (ayahStart to ayahEnd).
 */
export function getTopicTranslations(
  topicId: string
): TopicTranslationResult | null {
  const byTopic = getMappingsByTopic();
  const mappings = byTopic.get(topicId);
  if (!mappings || mappings.length === 0) return null;

  const ayahs: AyahText[] = [];
  const mappingTypeDistribution: Record<string, number> = {};

  for (const mapping of mappings) {
    // Track mapping type distribution
    mappingTypeDistribution[mapping.mappingType] =
      (mappingTypeDistribution[mapping.mappingType] ?? 0) + 1;

    // Handle ayah range
    for (
      let ayahNum = mapping.ayahStart;
      ayahNum <= mapping.ayahEnd;
      ayahNum++
    ) {
      const ayah = getAyah(mapping.surahNumber, ayahNum);
      if (!ayah) {
        console.warn(
          `Warning: Could not resolve ayah ${mapping.surahNumber}:${ayahNum} for mapping ${mapping.id}`
        );
        continue;
      }

      ayahs.push({
        surahNumber: mapping.surahNumber,
        ayahNumber: ayahNum,
        arabicText: ayah.arabic,
        englishTranslation: ayah.translation,
        transliteration: ayah.transliteration,
        mappingId: mapping.id,
        mappingType: mapping.mappingType,
        rationale: mapping.rationale,
      });
    }
  }

  // Derive topic title from topicId (simple transformation)
  const topicTitle = topicId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    topicId,
    topicTitle,
    ayahs,
    totalAyahs: ayahs.length,
    mappingTypeDistribution,
  };
}

/**
 * Get just the ayah texts for a topic (convenience wrapper).
 */
export function getTopicAyahTexts(topicId: string): AyahText[] {
  const result = getTopicTranslations(topicId);
  return result?.ayahs ?? [];
}

/**
 * Get a summary of translation coverage for a topic.
 */
export function getTopicTranslationSummary(
  topicId: string
): TranslationSummary | null {
  const result = getTopicTranslations(topicId);
  if (!result) return null;

  const uniqueSurahs = Array.from(
    new Set(result.ayahs.map((a) => a.surahNumber))
  ).sort((a, b) => a - b);

  return {
    topicId: result.topicId,
    totalAyahs: result.totalAyahs,
    uniqueSurahs,
    mappingTypes: result.mappingTypeDistribution,
    hasDirectReferences: (result.mappingTypeDistribution["DIRECT_REFERENCE"] ?? 0) > 0,
    hasExplicitInstructions:
      (result.mappingTypeDistribution["EXPLICIT_INSTRUCTION"] ?? 0) > 0,
    hasPropheticNarratives:
      (result.mappingTypeDistribution["PROPHETIC_NARRATIVE"] ?? 0) > 0,
    hasThematicReferences:
      (result.mappingTypeDistribution["THEMATIC_REFERENCE"] ?? 0) > 0,
  };
}

/**
 * Get all available topic IDs.
 */
export function getAllTopicIds(): string[] {
  const byTopic = getMappingsByTopic();
  return Array.from(byTopic.keys()).sort();
}

/**
 * Get all mappings (for validation/debugging).
 */
export function getAllMappings(): TopicMapping[] {
  return loadMappings();
}

/**
 * Validate that all mappings can be resolved to actual ayat.
 * Returns a report of any issues found.
 */
export function validateMappings(): {
  totalMappings: number;
  totalAyat: number;
  issues: string[];
} {
  const mappings = loadMappings();
  const issues: string[] = [];
  let totalAyat = 0;

  for (const mapping of mappings) {
    // Validate surah number
    if (mapping.surahNumber < 1 || mapping.surahNumber > 114) {
      issues.push(
        `Mapping ${mapping.id}: invalid surah number ${mapping.surahNumber}`
      );
      continue;
    }

    // Validate ayah range
    if (mapping.ayahStart < 1) {
      issues.push(
        `Mapping ${mapping.id}: ayahStart must be >= 1, got ${mapping.ayahStart}`
      );
    }

    if (mapping.ayahEnd < mapping.ayahStart) {
      issues.push(
        `Mapping ${mapping.id}: ayahEnd (${mapping.ayahEnd}) must be >= ayahStart (${mapping.ayahStart})`
      );
    }

    // Try to resolve each ayah in the range
    for (let ayahNum = mapping.ayahStart; ayahNum <= mapping.ayahEnd; ayahNum++) {
      const ayah = getAyah(mapping.surahNumber, ayahNum);
      if (!ayah) {
        issues.push(
          `Mapping ${mapping.id}: could not resolve ${mapping.surahNumber}:${ayahNum}`
        );
      } else {
        totalAyat++;
      }
    }
  }

  return {
    totalMappings: mappings.length,
    totalAyat,
    issues,
  };
}

/**
 * Get surah metadata for a surah number (convenience wrapper).
 */
export function getSurahMeta(surahNumber: number) {
  const index = getSurahIndex();
  return index.find((s) => s.id === surahNumber) ?? null;
}
