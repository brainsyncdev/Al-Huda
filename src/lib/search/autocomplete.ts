/**
 * Autocomplete suggestion engine for Quran search.
 *
 * Provides deterministic, local-only suggestions from canonical data:
 * - Quran references (parsed via the existing reference parser)
 * - Surah names (transliteration matches)
 * - Topic titles (English and Arabic)
 *
 * Every suggestion is validated against canonical data before it is returned.
 * References are range-checked against the surah's actual verse count, so a
 * suggestion can never point at a verse that does not exist. No network
 * requests, no analytics, no AI-generated content, and nothing is invented:
 * a query that matches nothing returns an empty list.
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
  /** For sorting: references first (0), then surahs (1), then topics (2). */
  priority: number;
}

/**
 * Generate autocomplete suggestions for a query.
 *
 * Matching rules:
 * - References: parsed via parseReference() AND range-checked against the
 *   canonical verse count. Out-of-range references produce no suggestion.
 * - Surahs: transliteration starts with or contains the query.
 * - Topics: title or arabicTitle starts with or contains the query.
 *
 * Results are sorted by priority (reference > surah > topic), then
 * alphabetically within each type, de-duplicated by destination href, and
 * capped at 10 suggestions.
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
  suggestions.push(...matchSurahs(trimmed));

  // 3. Topic suggestions
  suggestions.push(...matchTopics(trimmed));

  // Sort by priority, then alphabetically by label (stable within groups).
  suggestions.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.label.localeCompare(b.label);
  });

  // De-duplicate by destination href, keeping the highest-priority (earliest)
  // entry. A name query such as "al-baqarah" otherwise yields both a
  // reference and a surah suggestion pointing at the same /quran/... route.
  const seen = new Set<string>();
  const unique = suggestions.filter((s) => {
    if (seen.has(s.href)) return false;
    seen.add(s.href);
    return true;
  });

  return unique.slice(0, 10);
}

/**
 * Try to parse the query as a Quran reference and turn it into a suggestion.
 * Returns null when the query is not a reference, the surah is unknown, or
 * the ayah number falls outside the surah's canonical verse range.
 */
function tryParseReference(query: string): Suggestion | null {
  const parsed = parseReference(query);
  if (!parsed) return null;

  const surah = getSurahIndex().find((s) => s.id === parsed.surah);
  if (!surah) return null;

  // Surah-only reference: navigate to the surah reading page.
  if (parsed.ayah === undefined) {
    return {
      type: "reference",
      label: surah.transliteration,
      sublabel: `Surah ${surah.id} · ${surah.meaning}`,
      href: `/quran/${surah.slug}`,
      priority: 0,
    };
  }

  // Validate the ayah against the canonical verse count so we never suggest a
  // verse that does not exist (parseReference does not range-check ayat).
  if (parsed.ayah < 1 || parsed.ayah > surah.ayahCount) return null;

  return {
    type: "reference",
    label: `${surah.transliteration} ${parsed.ayah}`,
    sublabel: `${parsed.surah}:${parsed.ayah}`,
    href: `/ayah/${parsed.surah}/${parsed.ayah}`,
    priority: 0,
  };
}

/**
 * Match surahs by transliteration. Prefix matches rank before substring
 * matches; each group is sorted alphabetically.
 */
function matchSurahs(query: string): Suggestion[] {
  const lowerQuery = query.toLowerCase();

  const prefixMatches: Suggestion[] = [];
  const substringMatches: Suggestion[] = [];

  for (const surah of getSurahIndex()) {
    const lowerTranslit = surah.transliteration.toLowerCase();
    const suggestion: Suggestion = {
      type: "surah",
      label: surah.transliteration,
      sublabel: `${surah.meaning} · ${surah.ayahCount} ayat`,
      href: `/quran/${surah.slug}`,
      priority: 1,
    };

    if (lowerTranslit.startsWith(lowerQuery)) {
      prefixMatches.push(suggestion);
    } else if (lowerTranslit.includes(lowerQuery)) {
      substringMatches.push(suggestion);
    }
  }

  prefixMatches.sort((a, b) => a.label.localeCompare(b.label));
  substringMatches.sort((a, b) => a.label.localeCompare(b.label));

  return [...prefixMatches, ...substringMatches];
}

/**
 * Match topics by English title or Arabic title. Prefix matches rank before
 * substring matches; each group is sorted alphabetically.
 */
function matchTopics(query: string): Suggestion[] {
  const lowerQuery = query.toLowerCase();

  const prefixMatches: Suggestion[] = [];
  const substringMatches: Suggestion[] = [];

  for (const topic of TOPICS) {
    const lowerTitle = topic.title.toLowerCase();
    const lowerArabic = topic.arabicTitle;
    const suggestion: Suggestion = {
      type: "topic",
      label: topic.title,
      sublabel: topic.arabicTitle,
      href: `/topics/${topic.slug}`,
      priority: 2,
    };

    const isPrefix =
      lowerTitle.startsWith(lowerQuery) || lowerArabic.startsWith(query);
    const isSubstring =
      lowerTitle.includes(lowerQuery) || lowerArabic.includes(query);

    if (isPrefix) {
      prefixMatches.push(suggestion);
    } else if (isSubstring) {
      substringMatches.push(suggestion);
    }
  }

  prefixMatches.sort((a, b) => a.label.localeCompare(b.label));
  substringMatches.sort((a, b) => a.label.localeCompare(b.label));

  return [...prefixMatches, ...substringMatches];
}
