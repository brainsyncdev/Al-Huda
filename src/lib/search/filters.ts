// Search filter parsing, validation, and URL building.
//
// Extracted from the search page and filters component to enable focused
// testing of parameter validation, query preservation, and filter application.
// The page and client component use these helpers to ensure consistent behavior.

import { getTopic } from "@/lib/topics/data";
import { getJuzForAyah } from "@/lib/quran/juz";

/**
 * Raw search parameters as received from the URL query string.
 * All values are optional strings; validation determines which are meaningful.
 */
export interface RawSearchParams {
  q?: string;
  surah?: string;
  type?: string;
  juz?: string;
  topic?: string;
  edition?: string;
  mode?: string;
  language?: string;
}

/**
 * Validated search filters after parsing and range checking.
 * Null values indicate invalid or absent parameters.
 */
export interface ValidatedSearchFilters {
  query: string;
  surahId: number | null;
  juzNum: number | null;
  revelationType: "meccan" | "medinan" | null;
  topicSlug: string | null;
  language: "ar" | "en" | null;
  editionId: string | null;
  tafsirMode: boolean;
  /** Set of "surah:ayah" strings for the selected topic, or null if no topic. */
  topicRefs: Set<string> | null;
  /** True if any filter parameter was present but invalid. */
  invalidFilters: boolean;
  /** True if at least one filter is active. */
  hasFilters: boolean;
}

/**
 * Parse and validate search parameters from the URL query string.
 *
 * @param params - Raw search parameters from Next.js searchParams
 * @param surahIndex - Array of surah metadata for revelation type lookup
 * @returns Validated filters with null for invalid/absent values
 */
export function parseSearchFilters(
  params: RawSearchParams
): ValidatedSearchFilters {
  const query = (params.q ?? "").trim();

  // Validate surah: must be integer 1-114
  const parsedSurah = params.surah ? Number(params.surah) : NaN;
  const surahId =
    Number.isInteger(parsedSurah) && parsedSurah >= 1 && parsedSurah <= 114
      ? parsedSurah
      : null;

  // Validate juz: must be integer 1-30
  const parsedJuz = params.juz ? Number(params.juz) : NaN;
  const juzNum =
    Number.isInteger(parsedJuz) && parsedJuz >= 1 && parsedJuz <= 30
      ? parsedJuz
      : null;

  // Validate revelation type: must be "meccan" or "medinan"
  const revelationType =
    params.type === "meccan" || params.type === "medinan" ? params.type : null;

  // Validate topic: must exist in canonical topic list
  const topicSlug =
    params.topic && getTopic(params.topic) ? params.topic : null;

  // Validate language: must be "ar" or "en"
  const language =
    params.language === "ar" || params.language === "en"
      ? params.language
      : null;

  // Edition and mode are mutually exclusive; mode takes precedence
  const tafsirMode = params.mode === "tafsir";
  const editionId = !tafsirMode && params.edition ? params.edition : null;

  // Build topic reference set for filtering
  const topicRefs = topicSlug
    ? new Set(
        (getTopic(topicSlug)?.relations ?? []).map(
          (r) => `${r.ref.surah}:${r.ref.ayah}`
        )
      )
    : null;

  // Check if any filter was present but invalid
  const invalidFilters =
    (Boolean(params.surah) && surahId === null) ||
    (Boolean(params.juz) && juzNum === null) ||
    (Boolean(params.type) && revelationType === null) ||
    (Boolean(params.topic) && topicSlug === null) ||
    (Boolean(params.language) && language === null);

  const hasFilters = Boolean(
    surahId || revelationType || juzNum || topicSlug || language || editionId || tafsirMode
  );

  return {
    query,
    surahId,
    juzNum,
    revelationType,
    topicSlug,
    language,
    editionId,
    tafsirMode,
    topicRefs,
    invalidFilters,
    hasFilters,
  };
}

/**
 * Build a revelation-type lookup map from a surah index.
 * Used by passesStructuralFilters to check revelation type.
 */
export function buildRevelationMap(
  surahIndex: Array<{ id: number; revelation: "meccan" | "medinan" }>
): Map<number, "meccan" | "medinan"> {
  return new Map(surahIndex.map((s) => [s.id, s.revelation]));
}

/**
 * Check whether a verse passes all structural filters.
 *
 * @param surah - Surah number (1-114)
 * @param ayah - Ayah number within the surah
 * @param filters - Validated search filters
 * @param revelationMap - Map from surah ID to revelation type
 * @returns True if the verse passes all active filters
 */
export function passesStructuralFilters(
  surah: number,
  ayah: number,
  filters: ValidatedSearchFilters,
  revelationMap: Map<number, "meccan" | "medinan">
): boolean {
  if (filters.surahId !== null && surah !== filters.surahId) return false;
  if (
    filters.revelationType !== null &&
    revelationMap.get(surah) !== filters.revelationType
  ) {
    return false;
  }
  if (filters.juzNum !== null && getJuzForAyah(surah, ayah) !== filters.juzNum) {
    return false;
  }
  if (filters.topicRefs !== null && !filters.topicRefs.has(`${surah}:${ayah}`)) {
    return false;
  }
  return true;
}

/**
 * Build a search URL with updated filter parameters.
 * Preserves the query and other filters when updating one filter.
 *
 * @param currentParams - Current URL search parameters
 * @param key - Filter key to update
 * @param value - New value for the filter (empty string clears it)
 * @returns Updated URL path with query string
 */
export function buildFilterUrl(
  currentParams: URLSearchParams,
  key: "surah" | "type" | "juz" | "topic" | "language" | "edition" | "mode",
  value: string
): string {
  const next = new URLSearchParams();
  const q = currentParams.get("q");
  if (q) next.set("q", q);

  // Read current validated values
  const surah = currentParams.get("surah") ?? "";
  const type = currentParams.get("type") ?? "";
  const juz = currentParams.get("juz") ?? "";
  const topic = currentParams.get("topic") ?? "";
  const language = currentParams.get("language") ?? "";
  const edition = currentParams.get("edition") ?? "";
  const mode = currentParams.get("mode") ?? "";

  // Preserve existing filters unless this update clears them
  if (key !== "surah" && surah) next.set("surah", surah);
  if (key !== "type" && type) next.set("type", type);
  if (key !== "juz" && juz) next.set("juz", juz);
  if (key !== "topic" && topic) next.set("topic", topic);
  if (key !== "language" && language) next.set("language", language);

  // Edition and mode are mutually exclusive
  if (key === "edition") {
    if (value) next.set("edition", value);
    // Setting edition clears mode
  } else if (key === "mode") {
    if (value) next.set("mode", value);
    // Setting mode clears edition
  } else {
    // Preserve existing edition/mode
    if (edition) next.set("edition", edition);
    if (mode) next.set("mode", mode);
  }

  if (value) next.set(key, value);
  const qs = next.toString();
  return qs ? `/search?${qs}` : "/search";
}

/**
 * Build a search URL for the "Search in" dropdown, which affects both
 * edition and mode parameters (mutually exclusive).
 *
 * @param currentParams - Current URL search parameters
 * @param value - "default", "tafsir", or an edition ID
 * @returns Updated URL path with query string
 */
export function buildSearchInUrl(
  currentParams: URLSearchParams,
  value: string
): string {
  const next = new URLSearchParams();
  const q = currentParams.get("q");
  if (q) next.set("q", q);

  if (value === "default") {
    // Clear both edition and mode
  } else if (value === "tafsir") {
    next.set("mode", "tafsir");
  } else {
    // Specific edition ID
    next.set("edition", value);
  }

  // Preserve other filters
  const surah = currentParams.get("surah");
  const type = currentParams.get("type");
  const juz = currentParams.get("juz");
  const topic = currentParams.get("topic");
  const language = currentParams.get("language");

  if (surah) next.set("surah", surah);
  if (type) next.set("type", type);
  if (juz) next.set("juz", juz);
  if (topic) next.set("topic", topic);
  if (language) next.set("language", language);

  const qs = next.toString();
  return qs ? `/search?${qs}` : "/search";
}
