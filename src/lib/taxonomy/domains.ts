// Domain catalog v1 — 14 broad areas of Quran exploration.
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// STATUS OF THIS CATALOG:
//
// This is an ORGANIZATIONAL PROPOSAL, not an approved taxonomy. Each
// domain record is stamped `proposed` on the editorial track and
// `pending-scholarly-review` overall. The catalog defines slots for
// future content to live in — it does not assert that the Quran has been
// classified, that these 14 domains are exhaustive, or that any specific
// topic or passage belongs to any domain.
//
// What this module does NOT contain:
//   - No topic assignments (`topicSlugs: []` for every domain)
//   - No passage assignments (`passageIds: []` for every domain)
//   - No Arabic titles except for the 8 domains where a universally
//     recognized Islamic/Arabic term exists. The other 6 leave `arabic`
//     undefined rather than fabricated.
//   - No reviewer identities, no approved decisions, no fabricated
//     citations.
//
// RELATIONSHIP TO THE EXISTING 10 DIMENSIONS:
//
// The 10 dimensions in `src/lib/explore/dimensions.ts` are preserved
// verbatim as `exploration-lens` entities with `lensKind: "dimension"`.
// They are topic-level navigation aids. Domains are a different
// entity kind: broad organizational areas that may in the future contain
// topics, themes, and stories. The two systems are complementary, not
// competing. No dimension was renamed, merged, or deleted.
//
// FUTURE WORK:
//
// A future sprint may add topic and passage assignments to domains,
// but only after a real editorial pass produces review metadata and a
// real reviewer registry has been established. See SPRINT-31-REPORT.md
// §10 for the recommended next steps.

import type { ProvenanceRecord } from "@/lib/topics/data";

/** Stable domain identifier. URL-safe. Independent of display title. */
export type DomainId =
  | "belief-theology"
  | "worship-practice"
  | "ethics-character"
  | "family-relationships"
  | "society-justice"
  | "economic-conduct"
  | "prophets-narratives"
  | "creation-signs"
  | "revelation-guidance"
  | "human-experiences"
  | "interfaith-communities"
  | "language-vocabulary"
  | "law-obligations"
  | "eschatology-afterlife";

export interface Domain {
  /** Stable identifier. URL-safe, independent of display title. */
  id: DomainId;
  /** English title. */
  title: string;
  /**
   * Arabic label. Defined only where a universally recognized
   * Islamic/Arabic term exists. Undefined — not empty-string, not a
   * guess — for domains without one. This prevents fabricated Arabic
   * labels from appearing on domain pages.
   */
  arabicTitle?: string;
  /** One-paragraph scope description. */
  scope: string;
  /** Non-exhaustive list of subjects this domain may cover. */
  subjects: string[];
  /** Other domain ids whose scope overlaps this one. */
  overlaps: DomainId[];
}

/**
 * Canonical provenance for the entire domain catalog. Every domain
 * record in this release inherits this value. `status` is explicitly
 * `pending-scholarly-review`: the catalog is an organizational proposal,
 * not a classification the project is authorized to approve.
 */
export const DOMAIN_PROVENANCE: ProvenanceRecord = {
  method:
    "organizational-proposal-v1 (domain catalog skeleton, no topic or passage assignments)",
  curator: "Al-Huda editorial team",
  reviewedAt: "2026-10-26",
  status: "pending-scholarly-review",
};

/**
 * The 14 proposed domains.
 *
 * Ordering is editorial; it groups related domains together but has no
 * canonical weight. Stable identifiers (the `id` field) are the only
 * reference-safe handle — the array order may change.
 *
 * Arabic titles are included only for the 8 domains where a universally
 * recognized Islamic/Arabic term exists. The other 6 leave `arabicTitle`
 * undefined rather than invent a translation.
 */
export const DOMAINS: Domain[] = [
  {
    id: "belief-theology",
    title: "Belief and Theology",
    arabicTitle: "العقيدة",
    scope:
      "Core articles of faith: the oneness of God, prophethood, divine decree, angels, revealed scripture, and the unseen. This domain organizes the Quran's doctrinal foundation.",
    subjects: [
      "tawhid (divine oneness)",
      "nubuwwah (prophethood)",
      "qadar (divine decree)",
      "angels",
      "revealed books",
      "akhirah (the hereafter)",
      "the unseen",
    ],
    overlaps: ["worship-practice", "eschatology-afterlife", "revelation-guidance"],
  },
  {
    id: "worship-practice",
    title: "Worship and Spiritual Practice",
    arabicTitle: "العبادات",
    scope:
      "Acts of worship and devotional practice: prayer, fasting, charity, pilgrimage, supplication, remembrance. The Quran's calls to worship and descriptions of devotional life.",
    subjects: [
      "salah (prayer)",
      "sawm (fasting)",
      "zakat (obligatory charity)",
      "hajj (pilgrimage)",
      "dua (supplication)",
      "dhikr (remembrance)",
      "recitation",
    ],
    overlaps: ["belief-theology", "ethics-character", "human-experiences"],
  },
  {
    id: "ethics-character",
    title: "Ethics and Character",
    arabicTitle: "الأخلاق",
    scope:
      "Personal conduct and moral formation: the virtues the Quran enjoins and the vices it warns against. Covers both inward dispositions and outward behavior.",
    subjects: [
      "patience (sabr)",
      "gratitude (shukr)",
      "trust in God (tawakkul)",
      "mercy and forgiveness",
      "honesty",
      "humility",
      "modesty",
      "anger",
      "envy",
      "repentance",
    ],
    overlaps: [
      "human-experiences",
      "family-relationships",
      "society-justice",
      "worship-practice",
    ],
  },
  {
    id: "family-relationships",
    title: "Family and Relationships",
    scope:
      "Kinship, marriage, parenting, and interpersonal bonds. The Quran's guidance on the rights and duties that structure intimate and familial life.",
    subjects: [
      "parents and children",
      "marriage",
      "divorce",
      "inheritance",
      "kinship ties",
      "orphan care",
      "guardianship",
    ],
    overlaps: ["society-justice", "law-obligations", "ethics-character"],
  },
  {
    id: "society-justice",
    title: "Society and Justice",
    arabicTitle: "العدل",
    scope:
      "Community life and social obligations: justice, fairness, testimony, care for the vulnerable, and the duties believers owe one another.",
    subjects: [
      "justice and fairness",
      "testimony",
      "community obligations",
      "neighbor rights",
      "care for the poor",
      "care for orphans and widows",
      "reconciliation",
    ],
    overlaps: [
      "economic-conduct",
      "law-obligations",
      "family-relationships",
      "ethics-character",
    ],
  },
  {
    id: "economic-conduct",
    title: "Economic Conduct",
    scope:
      "Wealth, trade, and economic fairness: the ethics of earning, spending, giving, lending, and contracting. The Quran's economic vision and warnings.",
    subjects: [
      "trade and commerce",
      "riba (usury/interest)",
      "debt and contracts",
      "charity and spending",
      "wealth distribution",
      "orphan property",
      "hoarding",
    ],
    overlaps: ["society-justice", "law-obligations", "ethics-character"],
  },
  {
    id: "prophets-narratives",
    title: "Prophets and Narratives",
    arabicTitle: "الأنبياء والقصص",
    scope:
      "Quranic narratives about prophets, historical communities, and formative events. The stories the Quran tells and the lessons it draws from them.",
    subjects: [
      "Adam",
      "Nuh (Noah)",
      "Ibrahim (Abraham)",
      "Musa (Moses)",
      "Isa (Jesus)",
      "Yusuf (Joseph)",
      "Maryam (Mary)",
      "peoples of 'Ad and Thamud",
      "Bani Isra'il",
      "the companions of the cave",
    ],
    overlaps: [
      "belief-theology",
      "interfaith-communities",
      "human-experiences",
      "revelation-guidance",
    ],
  },
  {
    id: "creation-signs",
    title: "Creation and Signs",
    arabicTitle: "الآيات",
    scope:
      "Nature as divine sign: the Quran's invitations to reflect on creation, the alternation of night and day, the natural world, and the signs in the heavens and the earth.",
    subjects: [
      "creation of heavens and earth",
      "alternation of night and day",
      "animals and plants",
      "water, rain, and growth",
      "the sun, moon, and stars",
      "human creation",
      "reflection on nature",
    ],
    overlaps: [
      "belief-theology",
      "revelation-guidance",
      "language-vocabulary",
    ],
  },
  {
    id: "revelation-guidance",
    title: "Revelation and Guidance",
    scope:
      "The Quran's own discourse about itself: revelation, guidance, preservation, recitation, abrogation, the clear and the ambiguous, and how believers are called to engage with scripture.",
    subjects: [
      "the Quran as guidance",
      "revelation",
      "preservation of scripture",
      "recitation",
      "the clear and the ambiguous",
      "reflecting on the Quran",
      "the command to read",
    ],
    overlaps: [
      "belief-theology",
      "language-vocabulary",
      "creation-signs",
    ],
  },
  {
    id: "human-experiences",
    title: "Human Experiences and Responsibility",
    scope:
      "The inner life and the human condition: choice, responsibility, guidance and misguidance, hardship and ease, hope and despair, and the self before God.",
    subjects: [
      "hardship and ease",
      "guidance and misguidance",
      "repentance",
      "hope and despair",
      "fear and trust",
      "the self (nafs)",
      "moral choice",
      "consequences",
    ],
    overlaps: [
      "ethics-character",
      "belief-theology",
      "prophets-narratives",
      "worship-practice",
    ],
  },
  {
    id: "interfaith-communities",
    title: "Interfaith and Other Communities",
    scope:
      "Relations with other faith communities and religious diversity: People of the Book, dialogue, common ground, disagreement, and coexistence.",
    subjects: [
      "People of the Book",
      "Jews and Christians",
      "dialogue and common ground",
      "religious diversity",
      "disputation",
      "covenant",
    ],
    overlaps: [
      "prophets-narratives",
      "belief-theology",
      "society-justice",
    ],
  },
  {
    id: "language-vocabulary",
    title: "Language and Vocabulary",
    scope:
      "Quranic Arabic: vocabulary, roots, expressions, and textual relationships. This domain can only be populated once a vetted morphological source is pinned; the existing word-by-word dataset carries no validated morphology.",
    subjects: [
      "roots",
      "lemmas",
      "key expressions (e.g. ulū al-albāb)",
      "grammatical features",
      "textual patterns",
    ],
    overlaps: [
      "revelation-guidance",
      "creation-signs",
    ],
  },
  {
    id: "law-obligations",
    title: "Law and Obligations",
    arabicTitle: "الأحكام",
    scope:
      "Commands, prohibitions, and obligations: what the Quran enjoins and forbids, in personal, familial, economic, and communal life.",
    subjects: [
      "halal and haram",
      "family law",
      "commercial law",
      "testimony and evidence",
      "contracts and covenants",
      "prohibitions",
      "obligations",
    ],
    overlaps: [
      "family-relationships",
      "economic-conduct",
      "society-justice",
      "ethics-character",
    ],
  },
  {
    id: "eschatology-afterlife",
    title: "Eschatology and the Afterlife",
    arabicTitle: "الآخرة",
    scope:
      "The life to come: death, resurrection, judgment, the scales, paradise, hellfire, and the signs of the hour. The Quran's eschatological discourse.",
    subjects: [
      "death and the soul",
      "the Day of Judgment",
      "resurrection",
      "the scales",
      "paradise",
      "hellfire",
      "signs of the hour",
      "every soul tasting death",
    ],
    overlaps: [
      "belief-theology",
      "human-experiences",
      "worship-practice",
    ],
  },
];

/** Look up a domain by id. Returns null if not found. */
export function getDomain(id: string): Domain | null {
  return DOMAINS.find((d) => d.id === id) ?? null;
}

/** All 14 domains in catalog order. */
export function getAllDomains(): Domain[] {
  return DOMAINS;
}

/** Root-relative URL for a domain's detail page. */
export function domainUrl(id: DomainId): string {
  return `/explore/domains/${id}`;
}

/**
 * Domains whose `overlaps` array names the given domain. Symmetric to
 * the `overlaps` field — used on domain detail pages to show related
 * domains in both directions without fabricating new relationships.
 */
export function getDomainsOverlappingWith(id: DomainId): Domain[] {
  return DOMAINS.filter((d) => d.overlaps.includes(id));
}
