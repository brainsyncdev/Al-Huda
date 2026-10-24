/**
 * Autocomplete suggestion engine for Quran search.
 *
 * Provides deterministic, local-only suggestions from canonical data:
 * - Surah names (transliteration matches)
 * - Topic titles (English and Arabic)
 * - Quran references (parsed via reference.ts)
 *
 * No network requests, no analytics, no AI-generated content.
 */

import { getSurahIndex } from "@/lib/quran/data";
import { parseReference } from "@/lib/quran/reference";
import { TOPICS } from "@/lib/topics/data";

export type SuggestionType = "surah" | "topic" | "reference";

export interface Suggestion {
  type: SuggestionType;
  label: string;
  sublabel?: string;
  href: string;
  /** For sorting: references first, then surahs, then topics. */
  priority: number;
}

/**
 * Generate autocomplete suggestions for a query.
 *
 * Matching rules:
 * - References: parsed successfully via parseReference()
 * - Surahs: transliteration starts with or contains query (case-insensitive)
 * - Topics: title or arabicTitle starts with or contains query (case-insensitive)
 *
 * Returns max 10 suggestions, sorted by priority (reference > surah > topic),
 * then alphabetically within each type.
 */
export function getSuggestions(query: string): Suggestion[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const suggestions: Suggestion[] = [];

  // 1. Reference suggestions (highest priority)
  const refMatch = tryParseReference(trimmed);
  if (refMatch) {
    suggestions.push(refMatch);
  }

  // 2. Surah suggestions
  const surahMatches = matchSurahs(trimmed);
  suggestions.push(...surahMatches);

  // 3. Topic suggestions
  const topicMatches = matchTopics(trimmed);
  suggestions.push(...topicMatches);

  // Sort by priority, then alphabetically by label
  suggestions.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.label.localeCompare(b.label);
  });

  // Limit to 10 suggestions
  return suggestions.slice(0, 10);
}

/**
 * Try to parse the query as a Quran reference.
 * Returns a suggestion if valid, null otherwise.
 */
function tryParseReference(query: string): Suggestion | null {
  const parsed = parseReference(query);
  if (!parsed) return null;

  const surahIndex = getSurahIndex();
  const surah = surahIndex.find((s) => s.id === parsed.surah);
  if (!surah) return null;

  // If it's a surah-only reference (no ayah), suggest the surah page
  if (!parsed.ayah) {
    return {
      type: "reference",
      label: `${surah.transliteration}`,
      sublabel: `Surah ${parsed.surah}`,
      href: `/quran/${surah.slug}`,
      priority: 0,
    };
  }

  // If it includes an ayah, suggest the ayah page
  return {
    type: "reference",
    label: `${surah.transliteration} ${parsed.ayah}`,
    sublabel: `${parsed.surah}:${parsed.ayah}`,
    href: `/ayah/${parsed.surah}/${parsed.ayah}`,
    priority: 0,
  };
}

/**
 * Match surahs by transliteration.
 * Prioritizes prefix matches, then substring matches.
 */
function matchSurahs(query: string): Suggestion[] {
  const lowerQuery = query.toLowerCase();
  const surahIndex = getSurahIndex();

  const prefixMatches: Suggestion[] = [];
  const substringMatches: Suggestion[] = [];

  for (const surah of surahIndex) {
    const lowerTranslit = surah.transliteration.toLowerCase();

    if (lowerTranslit.startsWith(lowerQuery)) {
      prefixMatches.push({
        type: "surah",
        label: surah.transliteration,
        sublabel: `${surah.meaning} · ${surah.ayahCount} ayat`,
        href: `/quran/${surah.slug}`,
        priority: 1,
      });
    } else if (lowerTranslit.includes(lowerQuery)) {
      substringMatches.push({
        type: "surah",
        label: surah.transliteration,
        sublabel: `${surah.meaning} · ${surah.ayahCount} ayat`,
        href: `/quran/${surah.slug}`,
        priority: 1,
      });
    }
  }

  // Sort each group alphabetically, then concatenate
  prefixMatches.sort((a, b) => a.label.localeCompare(b.label));
  substringMatches.sort((a, b) => a.label.localeCompare(b.label));

  return [...prefixMatches, ...substringMatches];
}

/**
 * Match topics by title or arabicTitle.
 * Prioritizes prefix matches, then substring matches.
 */
function matchTopics(query: string): Suggestion[] {
  const lowerQuery = query.toLowerCase();

  const prefixMatches: Suggestion[] = [];
  const substringMatches: Suggestion[] = [];

  for (const topic of TOPICS) {
    const lowerTitle = topic.title.toLowerCase();
    const lowerArabic = topic.arabicTitle.toLowerCase();

    const titleMatches =
      lowerTitle.startsWith(lowerQuery) || lowerArabic.startsWith(lowerQuery);
    const titleContains =
      lowerTitle.includes(lowerQuery) || lowerArabic.includes(lowerQuery);

    if (titleMatches) {
      prefixMatches.push({
        type: "topic",
        label: topic.title,
        sublabel: topic.arabicTitle,
        href: `/topics/${topic.slug}`,
        priority: 2,
      });
    } else if (titleContains) {
      substringMatches.push({
        type: "topic",
        label: topic.title,
        sublabel: topic.arabicTitle,
        href: `/topics/${topic.slug}`,
        priority: 2,
      });
    }
  }

  // Sort each group alphabetically, then concatenate
  prefixMatches.sort((a, b) => a.label.localeCompare(b.label));
  substringMatches.sort((a, b) => a.label.localeCompare(b.label));

  return [...prefixMatches, ...substringMatches];
}

/**
 * Get the destination URL for a suggestion.
 * Used by the UI to navigate on selection.
 */
export function getSuggestionHref(suggestion: Suggestion): string {
  return suggestion.href;
}