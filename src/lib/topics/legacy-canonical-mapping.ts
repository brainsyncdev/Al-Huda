// Legacy-to-Canonical Topic Mapping
// MFD-07 Phase 6: Maps legacy editorial topic slugs to canonical topic IDs
//
// This mapping enables cross-referencing between the 18 curated editorial
// topics (legacy system) and the 176 canonical topics (expanded taxonomy).
// It allows users to discover related canonical topics from legacy topic pages.
//
// All canonical IDs below are verified against data/taxonomy/topics.json.

/**
 * Maps legacy topic slugs to arrays of canonical topic IDs.
 * Each legacy topic may relate to multiple canonical topics.
 */
const LEGACY_TO_CANONICAL: Record<string, string[]> = {
  'patience': ['sabr-patience', 'trial-and-test'],
  'gratitude': ['shukr-gratitude', 'gratitude-ingratitude'],
  'trust-in-god': ['tawakkul-trust', 'certainty-yaqeen'],
  'mercy-and-forgiveness': ['divine-mercy', 'divine-wrath'],
  'remembrance': ['remembrance-forgetfulness'],
  'giving': ['sadaqah-jariyah', 'wealth-distribution', 'zakat-calculation'],
  'justice': ['justice-oppression', 'mizan-balance'],
  'parents-and-family': ['mother-rights', 'father-rights', 'elderly-care', 'silat-al-rahim'],
  'hardship-and-ease': ['trial-and-test', 'sabr-patience', 'anxiety-relief'],
  'knowledge-and-reflection': ['knowledge-seeking', 'reflection-tafakkur', 'intellect-importance', 'critical-thinking'],
  'the-hereafter': ['resurrection-process', 'jannah-description', 'jahannam-description', 'minor-signs', 'major-signs'],
  'tawheed': ['tawheed-fundamentals', 'tawheed-rububiyyah', 'tawheed-uluhiyyah', 'tawheed-asma-wa-sifat'],
  'prayer': ['five-daily-prayers', 'prayer-conditions', 'prayer-acceptance', 'congregational-prayer'],
  'supplication': ['dua-etiquette', 'dua-answers'],
  'god-consciousness': ['taqwa-god-consciousness', 'ikhlas-sincerity', 'qalb-purification'],
  'repentance': ['divine-mercy', 'self-accountability', 'nafs-lawwama'],
  'prophets': ['prophet-definition', 'prophet-vs-messenger', 'seal-of-prophethood', 'adam-story', 'ibrahim-story', 'musa-story', 'isa-story', 'muhammad-story'],
  'good-character': ['prophetic-character', 'anger-management', 'husn-concept'],
};

/**
 * Get canonical topic IDs related to a legacy topic slug.
 * @param legacySlug - The slug of a legacy editorial topic
 * @returns Array of canonical topic IDs, or empty array if no mapping exists
 */
export function getCanonicalTopicsForLegacyTopic(legacySlug: string): string[] {
  return LEGACY_TO_CANONICAL[legacySlug] ?? [];
}

/**
 * Get all legacy topic slugs that have canonical mappings.
 * @returns Array of legacy topic slugs
 */
export function getLegacyTopicsWithCanonicalMappings(): string[] {
  return Object.keys(LEGACY_TO_CANONICAL);
}

/**
 * Check if a legacy topic has canonical topic mappings.
 * @param legacySlug - The slug of a legacy editorial topic
 * @returns true if the legacy topic has at least one canonical mapping
 */
export function hasCanonicalMappings(legacySlug: string): boolean {
  return legacySlug in LEGACY_TO_CANONICAL && LEGACY_TO_CANONICAL[legacySlug].length > 0;
}
