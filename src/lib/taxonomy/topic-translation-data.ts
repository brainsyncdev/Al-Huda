// Translation enrichment layer for topic-ayah mappings.
// Connects the 789 mapping records to actual Quran translation content.
//
// The mapping catalog is statically imported from
// data/taxonomy/topic-ayah-mappings.json (resolveJsonModule) so this module
// is safe to reach from both server and client code paths. The enrichment
// helpers that resolve Arabic/translation text still depend on
// src/lib/quran/data.ts, which is server-only (node:fs); callers from client
// components must therefore receive pre-resolved text via props.

import mappingsData from "../../../data/taxonomy/topic-ayah-mappings.json";

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

  // Static JSON import (resolveJsonModule) — no node:fs needed.
  const raw = mappingsData;
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
