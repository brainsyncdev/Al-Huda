// Labels for WHY a search result matched (FR-015).
//
// This module deliberately has no filesystem dependency, so client components
// can import it without pulling the server-only Quran loader into the bundle
// (src/lib/quran/data.ts reads node_modules/quran-json via node:fs and must
// never reach the client). src/lib/quran/search.ts re-exports MatchReason
// from here, so there is exactly one declaration of the union.

export type MatchReason =
  | "reference"
  | "arabic"
  | "translation"
  | "transliteration"
  | "surah-name";

/** Short label rendered on a search result. Text, never colour alone (PRD §11). */
export const REASON_LABELS: Record<MatchReason, string> = {
  reference: "Exact reference",
  arabic: "Arabic text match",
  translation: "Translation match",
  transliteration: "Transliteration match",
  "surah-name": "Surah name or meaning",
};

/**
 * What the label actually means. Surfaced as a tooltip so a reader can tell a
 * verse-text match from a surah-metadata match — the PRD forbids implying that
 * a verse says more than its source supports (§2, principle 3).
 */
export const REASON_DESCRIPTIONS: Record<MatchReason, string> = {
  reference:
    "The query parsed as a surah:ayah reference and resolved to this verse.",
  arabic:
    "The normalized Arabic of this verse contains the query. Diacritics are stripped for matching only; the displayed Arabic is verbatim from the pinned dataset.",
  translation:
    "The normalized English translation (Saheeh International) contains the query.",
  transliteration:
    "The normalized Latin transliteration contains the query.",
  "surah-name":
    "The query matched this surah's transliteration, English meaning, or URL slug — not the verse text itself. These ayat are entry points into the surah.",
};