// Canonical Graph Enrichment Layer — Quranic reference data for graph nodes
//
// SERVER-SIDE MODULE: Uses fs to load JSON data. Safe to import from server
// components and API routes. NOT safe for client components.
//
// This module provides Quranic enrichment metadata for topic nodes WITHOUT
// adding ayah or root nodes to the graph (which would overwhelm visualization).
// Enrichment data is attached to existing topic nodes by the graph builder.
//
// DATA SOURCES:
//   - data/taxonomy/topic-ayah-mappings.json (792 mappings)
//   - data/root-discovery-registry.json (1,642 roots)
//   - src/lib/taxonomy/topic-translation-data.ts (translation availability)
//   - src/lib/taxonomy/topic-tafsir-data.ts (tafsir availability)
//
// ROOT-TOPIC LINKING:
//   Since we don't have explicit topic-root mappings, we derive them using:
//   1. A curated keyword-to-root mapping for common Islamic concepts
//   2. Heuristic matching of topic titles/descriptions against root data
//   Results are marked as "suggested connections" in the UI.

import fs from "node:fs";
import path from "node:path";
import {
  getCanonicalTopics,
  type CanonicalTopic,
} from "@/lib/taxonomy/canonical-adapter";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TopicQuranicEnrichment {
  topicId: string;
  ayahCount: number; // number of ayah mappings for this topic
  uniqueSurahs: number[]; // surah numbers referenced
  mappingTypes: Record<string, number>; // DIRECT_REFERENCE, EXPLICIT_INSTRUCTION, etc.
  hasDirectReferences: boolean;
  hasExplicitInstructions: boolean;
  hasPropheticNarratives: boolean;
  hasThematicReferences: boolean;
  relatedRoots: string[]; // top 5 most relevant Arabic roots (slugs)
  translationAvailable: boolean;
  tafsirAvailable: boolean;
}

export interface GraphEnrichmentData {
  topicEnrichments: Record<string, TopicQuranicEnrichment>; // keyed by topicId
  totalTopicsWithAyahMappings: number;
  totalTopicsWithoutMappings: number;
  totalUniqueAyatReferenced: number;
  totalUniqueRootsLinked: number;
}

interface TopicMapping {
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

interface RootRecord {
  slug: string;
  root: string;
  status: string;
  totalLemmas: number;
  occurrenceCount: number;
  distinctAyahCount: number;
  includedLemmas: string[];
}

interface RootRegistry {
  generatedAt: string;
  policyVersion: string;
  sourceDataset: string;
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
  roots: RootRecord[];
}

// ─── Data Loading ────────────────────────────────────────────────────────────

const MAPPINGS_PATH = path.join(
  process.cwd(),
  "data",
  "taxonomy",
  "topic-ayah-mappings.json"
);

const ROOTS_PATH = path.join(process.cwd(), "data", "root-discovery-registry.json");

// Cache across HMR reloads
const cache = (
  globalThis as unknown as {
    __alhudaGraphEnrichmentCache?: {
      mappings: TopicMapping[] | null;
      roots: RootRegistry | null;
      enrichmentData: GraphEnrichmentData | null;
    };
  }
).__alhudaGraphEnrichmentCache ?? {
  mappings: null,
  roots: null,
  enrichmentData: null,
};

(globalThis as unknown as {
  __alhudaGraphEnrichmentCache?: typeof cache;
}).__alhudaGraphEnrichmentCache = cache;

function loadMappings(): TopicMapping[] {
  if (cache.mappings) return cache.mappings;
  try {
    const raw = fs.readFileSync(MAPPINGS_PATH, "utf-8");
    cache.mappings = JSON.parse(raw) as TopicMapping[];
    return cache.mappings;
  } catch (error) {
    console.error("Failed to load topic-ayah-mappings.json:", error);
    cache.mappings = [];
    return [];
  }
}

function loadRoots(): RootRegistry {
  if (cache.roots) return cache.roots;
  try {
    const raw = fs.readFileSync(ROOTS_PATH, "utf-8");
    cache.roots = JSON.parse(raw) as RootRegistry;
    return cache.roots;
  } catch (error) {
    console.error("Failed to load root-discovery-registry.json:", error);
    cache.roots = {
      generatedAt: new Date().toISOString(),
      policyVersion: "unknown",
      sourceDataset: "unknown",
      summary: {
        totalRoots: 0,
        activated: 0,
        partiallyActivated: 0,
        needsReview: 0,
        discovered: 0,
        totalOccurrences: 0,
        totalDistinctAyat: 0,
        totalLemmasActivated: 0,
      },
      roots: [],
    } as RootRegistry;
    return cache.roots;
  }
}

// ─── Curated Keyword-to-Root Mapping ─────────────────────────────────────────

/**
 * Curated mapping of common Islamic concept keywords to Arabic root slugs.
 * This provides reliable root-topic linking for well-known concepts.
 * Keys are lowercase English keywords; values are Arabic root slugs.
 */
const KEYWORD_TO_ROOT: Record<string, string> = {
  // Core theological concepts
  tawheed: "وحد",
  unity: "وحد",
  oneness: "وحد",
  faith: "امن",
  belief: "امن",
  iman: "امن",
  kufr: "كفر",
  disbelief: "كفر",
  shirk: "شرك",
  polytheism: "شرك",
  nifaq: "نفق",
  hypocrisy: "نفق",

  // Divine attributes
  mercy: "رحم",
  rahmah: "رحم",
  rahman: "رحم",
  rahm: "رحم",
  forgiveness: "غفر",
  maghfirah: "غفر",
  ghfran: "غفر",
  repentance: "توب",
  tawbah: "توب",
  patience: "صبر",
  sabr: "صبر",
  gratitude: "شكر",
  shukr: "شكر",
  thankfulness: "شكر",
  love: "حبب",
  mahabbah: "حبب",
  fear: "خوف",
  khawf: "خوف",
  hope: "رجو",
  raja: "رجو",
  trust: "وكل",
  tawakkul: "وكل",

  // Worship & practices
  prayer: "صلو",
  salah: "صلو",
  salat: "صلو",
  fasting: "صوم",
  sawm: "صوم",
  siyam: "صوم",
  zakat: "زكو",
  charity: "صدق",
  sadaqah: "صدق",
  hajj: "حجج",
  pilgrimage: "حجج",
  dhikr: "ذكر",
  remembrance: "ذكر",
  dua: "دعو",
  supplication: "دعو",
  invocation: "دعو",

  // Quran & revelation
  quran: "قر",
  revelation: "نزل",
  wahy: "نزل",
  recitation: "قر",
  tilawah: "تلو",
  book: "كتب",
  kitab: "كتب",
  scripture: "كتب",

  // Prophets & narratives
  prophet: "نبي",
  nabi: "نبي",
  messenger: "رسل",
  rasul: "رسل",
  messengership: "رسل",
  prophecy: "نبي",

  // Moral concepts
  justice: "عدل",
  adl: "عدل",
  qist: "قسط",
  oppression: "ظلم",
  zulm: "ظلم",
  tyranny: "ظلم",
  goodness: "حسن",
  ihsan: "حسن",
  excellence: "حسن",
  truth: "صدق",
  sidq: "صدق",
  honesty: "صدق",
  lie: "كذب",
  falsehood: "كذب",
  knowledge: "علم",
  ilm: "علم",
  wisdom: "حكم",
  hikmah: "حكم",
  ignorance: "جهل",
  jahl: "جهل",

  // Social concepts
  family: "اهل",
  parents: "برر",
  birr: "برر",
  marriage: "نكح",
  nikah: "نكح",
  children: "ولد",
  walad: "ولد",
  community: "امم",
  ummah: "امم",
  brotherhood: "اخو",
  ukhuwwah: "اخو",
  neighbor: "جور",
  janb: "جور",

  // Spiritual states
  soul: "نفس",
  nafs: "نفس",
  heart: "قلب",
  qalb: "قلب",
  mind: "عقل",
  aql: "عقل",
  intellect: "عقل",
  reason: "عقل",
  spirit: "روح",
  ruh: "روح",

  // Eschatology
  paradise: "جنن",
  jannah: "جنن",
  garden: "جنن",
  hell: "نار",
  jahannam: "نار",
  fire: "نار",
  resurrection: "بعث",
  "ba'th": "بعث",
  judgment: "حكم",
  day: "يوم",
  hereafter: "اخر",
  akhirah: "اخر",
  death: "موت",
  mawt: "موت",
  life: "حيي",
  hayat: "حيي",

  // Legal concepts
  law: "شرع",
  shariah: "شرع",
  halal: "حلل",
  permissible: "حلل",
  haram: "حرم",
  forbidden: "حرم",
  prohibited: "حرم",
  command: "امر",
  amr: "امر",
  prohibition: "نهي",
  nahy: "نهي",

  // Struggle & striving
  jihad: "جه",
  striving: "جه",
  struggle: "جه",
  migration: "هجر",
  hijrah: "هجر",

  // Guidance & misguidance
  guidance: "هدي",
  huda: "هدي",
  hidayah: "هدي",
  misguidance: "ضلل",
  dalal: "ضلل",
  error: "ضلل",

  // Creation & nature
  creation: "خلق",
  khalq: "خلق",
  creator: "خلق",
  universe: "خلق",
  world: "دني",
  dunya: "دني",
  earth: "ارض",
  ard: "ارض",
  heaven: "سمو",
  sama: "سمو",
  sky: "سمو",
  sun: "شمس",
  moon: "قمر",
  stars: "نجم",
  water: "ميه",
  ma: "ميه",

  // Warfare & peace
  war: "حرب",
  harb: "حرب",
  battle: "قتل",
  qital: "قتل",
  fighting: "قتل",
  peace: "سلم",
  salam: "سلم",
  treaty: "عهد",
  ahd: "عهد",
  covenant: "عهد",
};

// ─── Root-Topic Heuristic Linking ────────────────────────────────────────────

/**
 * Match topics to roots using:
 * 1. Curated keyword mapping (high confidence)
 * 2. Heuristic text matching (lower confidence)
 * Returns top 5 roots per topic.
 */
function matchTopicsToRoots(
  topics: CanonicalTopic[],
  roots: RootRecord[]
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  // Build a set of valid root slugs for validation
  const validRootSlugs = new Set(roots.map((r) => r.slug));

  // Build keyword index from roots for fallback matching
  const rootKeywords = new Map<string, Set<string>>();
  for (const root of roots) {
    const keywords = new Set<string>();
    keywords.add(root.slug.toLowerCase());
    keywords.add(root.root.toLowerCase());
    for (const lemma of root.includedLemmas) {
      keywords.add(lemma.toLowerCase());
    }
    rootKeywords.set(root.slug, keywords);
  }

  for (const topic of topics) {
    const topicText = `${topic.title} ${topic.description} ${topic.searchAliases.join(" ")}`.toLowerCase();
    const topicSlug = topic.slug.toLowerCase();
    const matchedRoots: Array<{ slug: string; score: number }> = [];
    const seenRoots = new Set<string>();

    // Strategy 1: Curated keyword mapping (high confidence)
    for (const [keyword, rootSlug] of Object.entries(KEYWORD_TO_ROOT)) {
      if (!validRootSlugs.has(rootSlug)) continue;
      if (seenRoots.has(rootSlug)) continue;

      // Check if keyword appears in topic slug or title
      const slugWords = topicSlug.split("-");
      const titleWords = topic.title.toLowerCase().split(/\s+/);
      const matchesSlug = slugWords.some(
        (w) => w === keyword || w.includes(keyword) || keyword.includes(w)
      );
      const matchesTitle = titleWords.some(
        (w) => w === keyword || w.includes(keyword) || keyword.includes(w)
      );

      if (matchesSlug || matchesTitle) {
        matchedRoots.push({ slug: rootSlug, score: 10 });
        seenRoots.add(rootSlug);
      }
    }

    // Strategy 2: Heuristic text matching (lower confidence)
    for (const [rootSlug, keywords] of rootKeywords) {
      if (seenRoots.has(rootSlug)) continue;

      let score = 0;
      for (const keyword of keywords) {
        if (keyword.length < 3) continue; // Skip very short keywords
        if (topicText.includes(keyword)) {
          score += 1;
        }
      }
      if (score > 0) {
        matchedRoots.push({ slug: rootSlug, score });
      }
    }

    // Sort by score descending, take top 5
    matchedRoots.sort((a, b) => b.score - a.score);
    result[topic.id] = matchedRoots.slice(0, 5).map((r) => r.slug);
  }

  return result;
}

// ─── Enrichment Computation ──────────────────────────────────────────────────

/**
 * Compute enrichment data for all topics.
 * This is expensive, so we cache the result.
 */
export function getGraphEnrichmentData(): GraphEnrichmentData {
  if (cache.enrichmentData) return cache.enrichmentData;

  const mappings = loadMappings();
  const roots = loadRoots();
  const topics = getCanonicalTopics();

  // Group mappings by topic
  const mappingsByTopic = new Map<string, TopicMapping[]>();
  for (const mapping of mappings) {
    const existing = mappingsByTopic.get(mapping.topicId) ?? [];
    existing.push(mapping);
    mappingsByTopic.set(mapping.topicId, existing);
  }

  // Match topics to roots
  const topicRootMatches = matchTopicsToRoots(topics, roots.roots);

  // Build enrichment for each topic that has mappings
  const topicEnrichments: Record<string, TopicQuranicEnrichment> = {};
  const allUniqueAyat = new Set<string>();
  const allUniqueRoots = new Set<string>();

  // Get all topic IDs
  const allTopicIds = topics.map((t) => t.id);

  for (const topicId of allTopicIds) {
    const topicMappings = mappingsByTopic.get(topicId) ?? [];

    if (topicMappings.length === 0) {
      // Topic has no ayah mappings - still create enrichment with zero counts
      // but mark translation/tafsir as unavailable
      const relatedRoots = topicRootMatches[topicId] ?? [];
      for (const root of relatedRoots) {
        allUniqueRoots.add(root);
      }

      topicEnrichments[topicId] = {
        topicId,
        ayahCount: 0,
        uniqueSurahs: [],
        mappingTypes: {},
        hasDirectReferences: false,
        hasExplicitInstructions: false,
        hasPropheticNarratives: false,
        hasThematicReferences: false,
        relatedRoots,
        translationAvailable: false,
        tafsirAvailable: false,
      };
      continue;
    }

    // Calculate statistics
    const uniqueSurahs = Array.from(
      new Set(topicMappings.map((m) => m.surahNumber))
    ).sort((a, b) => a - b);

    const mappingTypes: Record<string, number> = {};
    for (const mapping of topicMappings) {
      mappingTypes[mapping.mappingType] =
        (mappingTypes[mapping.mappingType] ?? 0) + 1;
    }

    // Track unique ayat
    for (const mapping of topicMappings) {
      for (let ayah = mapping.ayahStart; ayah <= mapping.ayahEnd; ayah++) {
        allUniqueAyat.add(`${mapping.surahNumber}:${ayah}`);
      }
    }

    // Get related roots
    const relatedRoots = topicRootMatches[topicId] ?? [];
    for (const root of relatedRoots) {
      allUniqueRoots.add(root);
    }

    topicEnrichments[topicId] = {
      topicId,
      ayahCount: topicMappings.length,
      uniqueSurahs,
      mappingTypes,
      hasDirectReferences: (mappingTypes["DIRECT_REFERENCE"] ?? 0) > 0,
      hasExplicitInstructions: (mappingTypes["EXPLICIT_INSTRUCTION"] ?? 0) > 0,
      hasPropheticNarratives: (mappingTypes["PROPHETIC_NARRATIVE"] ?? 0) > 0,
      hasThematicReferences: (mappingTypes["THEMATIC_REFERENCE"] ?? 0) > 0,
      relatedRoots,
      translationAvailable: true, // Has mappings = has translations
      tafsirAvailable: true, // Has mappings = has tafsir links
    };
  }

  const topicsWithMappings = allTopicIds.filter(
    (id) => (mappingsByTopic.get(id)?.length ?? 0) > 0
  );

  cache.enrichmentData = {
    topicEnrichments,
    totalTopicsWithAyahMappings: topicsWithMappings.length,
    totalTopicsWithoutMappings: allTopicIds.length - topicsWithMappings.length,
    totalUniqueAyatReferenced: allUniqueAyat.size,
    totalUniqueRootsLinked: allUniqueRoots.size,
  };

  return cache.enrichmentData;
}

/**
 * Get enrichment data for a specific topic.
 */
export function getTopicEnrichment(
  topicId: string
): TopicQuranicEnrichment | null {
  const data = getGraphEnrichmentData();
  return data.topicEnrichments[topicId] ?? null;
}

/**
 * Get list of topic IDs that have Quranic references (ayah mappings).
 */
export function getTopicsWithQuranicReferences(): string[] {
  const data = getGraphEnrichmentData();
  return Object.entries(data.topicEnrichments)
    .filter(([, e]) => e.ayahCount > 0)
    .map(([id]) => id);
}

/**
 * Get list of topic IDs that don't have Quranic references.
 */
export function getTopicsWithoutQuranicReferences(): string[] {
  const data = getGraphEnrichmentData();
  return Object.entries(data.topicEnrichments)
    .filter(([, e]) => e.ayahCount === 0)
    .map(([id]) => id);
}
