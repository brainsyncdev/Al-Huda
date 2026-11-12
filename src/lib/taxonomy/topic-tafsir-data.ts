// Tafsir enrichment layer for topic-ayah mappings.
//
// Connects the 792 mapping records (1,889 expanded ayat) in data/taxonomy/topic-ayah-mappings.json
// to tafsir content sources. Does NOT display tafsir text — only provides
// links to in-app tafsir pages (al-Jalalayn, al-Muyassar via translation proxy)
// and external tafsir sites (Ibn Kathir, Ma'ariful Quran).
//
// POLICY (FR-030/031/032):
// - Tafsir is interpretation, not translation. This module never fabricates
//   or generates tafsir content.
// - In-app tafsirs are served through the existing translation proxy at
//   /api/translations/[id] and displayed via the TafsirViewer component.
// - External tafsirs are link-out only; no text is bundled or cached.
// - All attribution, language, and licensing metadata is preserved from the
//   source catalog (src/lib/quran/sources.ts).

import { getSource, sourceLanguageLabel } from "../quran/sources";
import {
  getAllMappings,
  type TopicMapping,
} from "./topic-translation-data";

// ─── Internal Index ──────────────────────────────────────────────────────────

/**
 * Build an index of mappings by topicId. Cached across calls within the same
 * process. We build our own index rather than importing the private helper
 * from topic-translation-data.ts so this module stays self-contained.
 */
const mappingsByTopicCache = (
  globalThis as unknown as {
    __alhudaTopicTafsirIndex?: Map<string, TopicMapping[]> | null;
  }
).__alhudaTopicTafsirIndex ?? null;

function getMappingsByTopic(): Map<string, TopicMapping[]> {
  if (mappingsByTopicCache) return mappingsByTopicCache;
  const mappings = getAllMappings();
  const byTopic = new Map<string, TopicMapping[]>();
  for (const m of mappings) {
    const existing = byTopic.get(m.topicId) ?? [];
    existing.push(m);
    byTopic.set(m.topicId, existing);
  }
  (
    globalThis as unknown as {
      __alhudaTopicTafsirIndex?: Map<string, TopicMapping[]>;
    }
  ).__alhudaTopicTafsirIndex = byTopic;
  return byTopic;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface TafsirLink {
  tafsirId: string;
  tafsirName: string;
  tafsirAttribution: string;
  language: string;
  url: string; // in-app route or external URL
  isExternal: boolean;
  available: boolean;
}

export interface AyahTafsirResult {
  surahNumber: number;
  ayahNumber: number;
  mappingId: string;
  tafsirLinks: TafsirLink[];
}

export interface TopicTafsirResult {
  topicId: string;
  topicTitle: string;
  ayahs: AyahTafsirResult[];
  totalAyahs: number;
  availableTafsirs: TafsirLink[];
}

export interface TafsirSummary {
  topicId: string;
  totalAyahs: number;
  inAppTafsirs: number;
  externalTafsirs: number;
  languages: string[];
}

// ─── Tafsir Source Registry ──────────────────────────────────────────────────

/**
 * The four tafsir sources available to the app.
 *
 * In-app tafsirs (al-Jalalayn, al-Muyassar) are Arabic texts served through
 * the /api/translations/[id] proxy and displayed via the TafsirViewer component
 * on the ayah page. The in-app URL points to the ayah page with a tafsir query
 * parameter so the viewer can auto-expand the correct edition.
 *
 * External tafsirs (Ibn Kathir, Ma'ariful Quran) are link-out only. The URL
 * points to the publisher's homepage because specific ayah-level deep links
 * are not guaranteed to be stable across publisher site updates.
 */
interface TafsirSource {
  sourceId: string;
  translationId?: string; // set only for in-app tafsirs
  name: string;
  isExternal: boolean;
  /** Build the URL for a specific ayah reference. */
  buildUrl: (surah: number, ayah: number) => string;
}

const TAFSIR_SOURCES: TafsirSource[] = [
  {
    sourceId: "tafsir-jalalayn",
    translationId: "ar.jalalayn",
    name: "Tafsir al-Jalalayn",
    isExternal: false,
    buildUrl: (surah, ayah) =>
      `/ayah/${surah}/${ayah}?tafsir=ar.jalalayn`,
  },
  {
    sourceId: "tafsir-muyassar",
    translationId: "ar.muyassar",
    name: "Tafsir al-Muyassar",
    isExternal: false,
    buildUrl: (surah, ayah) =>
      `/ayah/${surah}/${ayah}?tafsir=ar.muyassar`,
  },
  {
    sourceId: "tafsir-ibn-kathir",
    name: "Tafsir Ibn Kathir (Abridged)",
    isExternal: true,
    buildUrl: (_surah, _ayah) => "https://www.qtafsir.com/",
  },
  {
    sourceId: "tafsir-ma(arif)",
    name: "Ma'ariful Quran",
    isExternal: true,
    buildUrl: (_surah, _ayah) => "https://www.maarifulquran.org/",
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Build a TafsirLink for a specific ayah and tafsir source.
 * Reads attribution, language, and licensing from the source catalog so the
 * UI can display full provenance without hard-coding it here.
 */
function buildTafsirLink(
  source: TafsirSource,
  surah: number,
  ayah: number
): TafsirLink {
  const record = getSource(source.sourceId);
  return {
    tafsirId: source.sourceId,
    tafsirName: source.name,
    tafsirAttribution: record?.attribution ?? source.name,
    language: record?.language
      ? sourceLanguageLabel(record.language)
      : "unspecified",
    url: source.buildUrl(surah, ayah),
    isExternal: source.isExternal,
    available: record != null && record.available !== false,
  };
}

/**
 * Build all tafsir links for a single ayah reference.
 * Returns one TafsirLink per registered tafsir source (4 total).
 */
function buildAyahTafsirLinks(
  surah: number,
  ayah: number,
  mappingId: string
): AyahTafsirResult {
  return {
    surahNumber: surah,
    ayahNumber: ayah,
    mappingId,
    tafsirLinks: TAFSIR_SOURCES.map((s) => buildTafsirLink(s, surah, ayah)),
  };
}

/**
 * Derive a human-readable title from a topicId slug.
 * Mirrors the convention in topic-translation-data.ts so the two enrichment
 * layers stay consistent.
 */
function topicTitleFromId(topicId: string): string {
  return topicId
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get all mapped ayat for a topic with tafsir links for each.
 *
 * Returns null when the topicId has no mappings in the catalog.
 * Each ayah in the result carries 4 tafsir links (2 in-app, 2 external).
 */
export function getTopicTafsirLinks(
  topicId: string
): TopicTafsirResult | null {
  const mappings = getMappingsByTopic().get(topicId);
  if (!mappings || mappings.length === 0) return null;

  const ayahs: AyahTafsirResult[] = [];

  for (const mapping of mappings) {
    for (
      let ayahNum = mapping.ayahStart;
      ayahNum <= mapping.ayahEnd;
      ayahNum++
    ) {
      ayahs.push(buildAyahTafsirLinks(mapping.surahNumber, ayahNum, mapping.id));
    }
  }

  // Deduplicate the available tafsirs list (same for every ayah in the topic).
  const availableTafsirs = TAFSIR_SOURCES.filter((s) => getSource(s.sourceId))
    .map((s) => {
      // Use surah 1 ayah 1 as a representative reference for the summary list;
      // the per-ayah links in `ayahs` carry the correct per-reference URLs.
      return buildTafsirLink(s, 1, 1);
    });

  return {
    topicId,
    topicTitle: topicTitleFromId(topicId),
    ayahs,
    totalAyahs: ayahs.length,
    availableTafsirs,
  };
}

/**
 * Get a single tafsir link for a specific ayah and tafsir.
 * Returns null when the tafsirId is not in the registry or the source record
 * is missing from the catalog.
 */
export function getTafsirLinkForAyah(
  surahNumber: number,
  ayahNumber: number,
  tafsirId: string
): TafsirLink | null {
  const source = TAFSIR_SOURCES.find((s) => s.sourceId === tafsirId);
  if (!source) return null;
  const record = getSource(tafsirId);
  if (!record) return null;
  return buildTafsirLink(source, surahNumber, ayahNumber);
}

/**
 * Get a summary of tafsir availability for a topic.
 * Useful for the statistics header in the UI component.
 */
export function getTopicTafsirSummary(
  topicId: string
): TafsirSummary | null {
  const result = getTopicTafsirLinks(topicId);
  if (!result) return null;

  const inApp = result.availableTafsirs.filter((t) => !t.isExternal).length;
  const external = result.availableTafsirs.filter((t) => t.isExternal).length;
  const languages = Array.from(
    new Set(result.availableTafsirs.map((t) => t.language))
  ).sort();

  return {
    topicId,
    totalAyahs: result.totalAyahs,
    inAppTafsirs: inApp,
    externalTafsirs: external,
    languages,
  };
}

/**
 * Get the list of all registered tafsir sources with their metadata.
 * Useful for rendering the "about tafsir" info section in the UI.
 */
export function getAllTafsirSources(): {
  sourceId: string;
  name: string;
  attribution: string;
  language: string;
  license: string;
  publisher: string;
  homepage: string;
  isExternal: boolean;
  notes?: string;
}[] {
  return TAFSIR_SOURCES.map((s) => {
    const record = getSource(s.sourceId);
    return {
      sourceId: s.sourceId,
      name: s.name,
      attribution: record?.attribution ?? s.name,
      language: record?.language
        ? sourceLanguageLabel(record.language)
        : "unspecified",
      license: record?.license ?? "See publisher",
      publisher: record?.publisher ?? "Unknown",
      homepage: record?.homepage ?? "",
      isExternal: s.isExternal,
      notes: record?.notes,
    };
  });
}
