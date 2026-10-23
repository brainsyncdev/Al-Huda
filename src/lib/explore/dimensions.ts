// Ten-dimension taxonomy for Explore mode (PRD §04.3, §05.3, §12.3).
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// IMPORTANT — SCOPE OF THIS MAPPING:
//
// The PRD envisions every ayah tagged across 10 life dimensions. That is a
// large scholarly undertaking that this build does not attempt. What this
// module provides instead is a TOPIC-LEVEL NAVIGATION AID: each dimension
// lists existing curated topic slugs whose themes overlap the dimension's
// description. The mapping is editorial, not ayat-level, and carries the
// same `pending-scholarly-review` status as the topics it references.
//
// Nothing in this module asserts that a specific ayah belongs to a dimension.
// Dimension pages surface the mapped topics as starting points and link to
// search for further exploration.
//
// The dimension titles, Arabic labels, and coverage descriptions are taken
// verbatim from PRD §04.3.

import type { ProvenanceRecord } from "../topics/data";

/** The ten dimension identifiers, matching PRD §04.3 numbering. */
export type DimensionId =
  | "spiritual"
  | "personal"
  | "family"
  | "social"
  | "economic"
  | "intellectual"
  | "governance"
  | "jihad"
  | "interfaith"
  | "ilm";

export interface Dimension {
  /** PRD §04.3 ordinal (1–10). */
  number: number;
  /** URL slug and stable identifier. */
  id: DimensionId;
  /** English title from PRD §04.3. */
  title: string;
  /** Arabic label from PRD §04.3. */
  arabicTitle: string;
  /** What the dimension covers, from PRD §04.3. */
  covers: string;
  /** One-paragraph description for the dimension page. */
  description: string;
  /**
   * Curated topic slugs whose themes overlap this dimension. These are
   * navigation aids, not ayat-level tags. Empty when no existing topic
   * maps clearly to the dimension.
   */
  topicSlugs: string[];
  /**
   * Suggested search terms for "explore further" links. Derived from the
   * dimension's coverage description; not a controlled vocabulary.
   */
  searchTerms: string[];
}

/**
 * Canonical provenance for the dimension → topic mapping. The mapping is
 * editorial navigation, not scholarly classification of ayat.
 */
export const DIMENSION_PROVENANCE: ProvenanceRecord = {
  method:
    "editorial-navigation-mapping-v1 (topic-level navigation aid, not ayat-level tagging)",
  curator: "Al-Huda editorial team",
  reviewedAt: "2026-10-23",
  status: "pending-scholarly-review",
};

/**
 * The ten dimensions from PRD §04.3, with topic-level navigation mappings.
 *
 * Mapping rationale (all pending scholarly review):
 *
 * - Spiritual: topics that address the believer's relationship with God —
 *   patience, gratitude, trust, mercy, remembrance, the hereafter.
 * - Personal: topics about inner life and self-development — patience through
 *   hardship, ease after difficulty, trust, knowledge and reflection.
 * - Family: the dedicated parents-and-family topic.
 * - Social: topics about obligations to others — justice, giving, family ties.
 * - Economic: topics about wealth and fairness — giving and justice.
 * - Intellectual: the dedicated knowledge-and-reflection topic.
 * - Governance: justice as the foundational governance theme.
 * - Jihad: patience and hardship-and-ease, reflecting the nafs (self-struggle)
 *   level, which is the universally accepted primary meaning.
 * - Interfaith: no existing curated topic maps clearly; left empty with an
 *   honest notice rather than a fabricated mapping.
 * - Ilm: knowledge-and-reflection and remembrance as signs of divine knowledge.
 */
export const DIMENSIONS: Dimension[] = [
  {
    number: 1,
    id: "spiritual",
    title: "Spiritual",
    arabicTitle: "روحاني",
    covers: "Allah, Ibadah, Tawakkul, Akhirah",
    description:
      "Verses about the believer's relationship with God — worship, reliance, and the life to come. This dimension gathers topics that center on faith, devotion, and the unseen.",
    topicSlugs: [
      "patience",
      "gratitude",
      "trust-in-god",
      "mercy-and-forgiveness",
      "remembrance",
      "the-hereafter",
    ],
    searchTerms: ["worship", "prayer", "faith", "reliance", "hereafter"],
  },
  {
    number: 2,
    id: "personal",
    title: "Personal",
    arabicTitle: "شخصي",
    covers: "Mental health, self-development, emotions",
    description:
      "Verses that speak to the inner life — patience through difficulty, the promise of ease, and the call to reflect on one's own state. These topics address emotional resilience and personal growth.",
    topicSlugs: [
      "patience",
      "hardship-and-ease",
      "trust-in-god",
      "knowledge-and-reflection",
    ],
    searchTerms: ["patience", "hardship", "ease", "self", "emotions"],
  },
  {
    number: 3,
    id: "family",
    title: "Family",
    arabicTitle: "أسري",
    covers: "Marriage, parenting, divorce, rights",
    description:
      "Verses about family life — the rights of parents, the duties of care, and the bonds of kinship. This dimension draws on the dedicated parents-and-family topic.",
    topicSlugs: ["parents-and-family"],
    searchTerms: ["parents", "family", "marriage", "children", "kinship"],
  },
  {
    number: 4,
    id: "social",
    title: "Social",
    arabicTitle: "اجتماعي",
    covers: "Justice, community, rights of others",
    description:
      "Verses about obligations to others — justice, fairness, and the duties of community life. These topics address how believers are called to treat one another and society at large.",
    topicSlugs: ["justice", "giving", "parents-and-family"],
    searchTerms: ["justice", "community", "rights", "fairness", "others"],
  },
  {
    number: 5,
    id: "economic",
    title: "Economic",
    arabicTitle: "اقتصادي",
    covers: "Trade, contracts, riba, wealth",
    description:
      "Verses about wealth, trade, and economic fairness — the ethics of giving, the command to justice in dealings, and the warning against hoarding. These topics touch on the Quran's economic vision.",
    topicSlugs: ["giving", "justice"],
    searchTerms: ["trade", "wealth", "charity", "spending", "contracts"],
  },
  {
    number: 6,
    id: "intellectual",
    title: "Intellectual",
    arabicTitle: "عقلي",
    covers: "Science, critical thinking, knowledge",
    description:
      "Verses that call to knowledge, reflection, and critical thinking — the command to read, the prayer for increase in knowledge, and the signs in creation for people of understanding.",
    topicSlugs: ["knowledge-and-reflection"],
    searchTerms: ["knowledge", "science", "thinking", "reason", "signs"],
  },
  {
    number: 7,
    id: "governance",
    title: "Governance",
    arabicTitle: "سياسي",
    covers: "Leadership, shura, accountability",
    description:
      "Verses about leadership, consultation, and accountability — justice as the foundation of governance, the duty to render trusts, and the call to stand firmly for fairness.",
    topicSlugs: ["justice"],
    searchTerms: ["leadership", "consultation", "accountability", "justice", "trust"],
  },
  {
    number: 8,
    id: "jihad",
    title: "Jihad",
    arabicTitle: "جهاد",
    covers: "Nafs, qalam, maal, sayf — all 4 levels",
    description:
      "Verses about striving — the primary meaning of jihad as self-struggle (nafs), patience through difficulty, and the effort required to remain steadfast. This dimension maps to topics about patience and hardship.",
    topicSlugs: ["patience", "hardship-and-ease"],
    searchTerms: ["striving", "patience", "steadfast", "effort", "self-struggle"],
  },
  {
    number: 9,
    id: "interfaith",
    title: "Interfaith",
    arabicTitle: "تعددي",
    covers: "Other religions, dialogue, common ground",
    description:
      "Verses about other faith communities, dialogue, and common ground. No curated topic currently maps to this dimension; the Quran's interfaith themes are best explored through search.",
    topicSlugs: [],
    searchTerms: [
      "people of the book",
      "christians",
      "jews",
      "dialogue",
      "common ground",
      "religious diversity",
    ],
  },
  {
    number: 10,
    id: "ilm",
    title: "Ilm (Knowledge)",
    arabicTitle: "علم",
    covers: "All knowledge as Allah's signs",
    description:
      "Verses about knowledge as divine signs — the command to read, the prayer for increase in knowledge, and the remembrance of God as the greater matter. This dimension gathers topics that center on learning and awareness.",
    topicSlugs: ["knowledge-and-reflection", "remembrance"],
    searchTerms: ["knowledge", "signs", "learning", "wisdom", "remembrance"],
  },
];

/** Look up a dimension by id. Returns null if not found. */
export function getDimension(id: string): Dimension | null {
  return DIMENSIONS.find((d) => d.id === id) ?? null;
}

/** Get all dimensions in PRD order. */
export function getAllDimensions(): Dimension[] {
  return DIMENSIONS;
}

/** Get dimensions that have at least one curated topic mapping. */
export function getDimensionsWithTopics(): Dimension[] {
  return DIMENSIONS.filter((d) => d.topicSlugs.length > 0);
}

/** Get dimensions that have no curated topic mapping yet. */
export function getDimensionsWithoutTopics(): Dimension[] {
  return DIMENSIONS.filter((d) => d.topicSlugs.length === 0);
}

/**
 * Reverse lookup over the same canonical mapping: which dimensions list this
 * topic slug in `topicSlugs`. Used on topic pages so a reader who arrives at a
 * topic can move back up into the dimension view. Returns dimensions in PRD
 * order. An unknown or unmapped slug yields an empty array — never a guess.
 */
export function getDimensionsForTopic(topicSlug: string): Dimension[] {
  return DIMENSIONS.filter((d) => d.topicSlugs.includes(topicSlug));
}
