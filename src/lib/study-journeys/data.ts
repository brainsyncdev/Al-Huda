// Curated study journeys — dimension-targeted learning experiences.
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// Every journey and stage carries provenance metadata following the same pattern
// as topics and paths. All content is marked pending-scholarly-review.

import type { StudyJourney, JourneysState } from "./types";
import type { ProvenanceRecord } from "../topics/data";

export type {
  StudyJourney,
  JourneysState,
  JourneyProgress,
  JourneyStage,
  JourneyDifficulty,
} from "./types";

/** Language stamp for all journeys. */
export const JOURNEY_LANGUAGE = "en" as const;

/** Canonical provenance for all shipped journeys. */
const JOURNEY_PROVENANCE: ProvenanceRecord = {
  method: "editorial-curation",
  curator: "Al-Huda editorial team",
  reviewedAt: "2026-11-11",
  status: "pending-scholarly-review",
};

/**
 * Initial set of curated study journeys. Each journey is organized around a
 * dimension and provides a structured learning experience through stages that
 * reference topics and ayat.
 */
export const JOURNEYS: StudyJourney[] = [
  {
    slug: "understanding-tawheed",
    language: JOURNEY_LANGUAGE,
    title: "Understanding Tawheed",
    arabicTitle: "فهم التوحيد",
    summary:
      "Explore the foundational concept of divine oneness through ayat that declare God's unique attributes, reject partners, and establish the core of Islamic belief.",
    dimensionId: "spiritual",
    difficulty: "beginner",
    estimatedMinutes: 30,
    prerequisites: [],
    version: 1,
    provenance: JOURNEY_PROVENANCE,
    stages: [
      {
        order: 1,
        title: "The Declaration of Oneness",
        ref: { surah: 112, ayah: 1 },
        objective:
          "Understand that 'Say: He is God, One' is the foundational declaration of Islamic belief.",
      },
      {
        order: 2,
        title: "The Eternal Refuge",
        ref: { surah: 112, ayah: 2 },
        objective:
          "Recognize that 'the Eternal Refuge' means God is the ultimate source of reliance.",
      },
      {
        order: 3,
        title: "No Partners or Components",
        ref: { surah: 112, ayah: 3 },
        objective:
          "See that 'He neither begets nor is born' rejects any notion of divine family or origin.",
      },
      {
        order: 4,
        title: "No Equivalent",
        ref: { surah: 112, ayah: 4 },
        objective:
          "Understand that there is nothing comparable to God — a absolute statement of uniqueness.",
        reflectionPrompt:
          "What does absolute oneness mean for how you understand existence?",
      },
      {
        order: 5,
        title: "The Throne Verse",
        topicSlug: "tawheed",
        ref: { surah: 2, ayah: 255 },
        objective:
          "See that Ayat al-Kursi declares God's unique sovereignty over all creation.",
      },
    ],
  },
  {
    slug: "patience-through-difficulties",
    language: JOURNEY_LANGUAGE,
    title: "Patience Through Difficulties",
    arabicTitle: "الصبر على المصائب",
    summary:
      "Explore how the Quran frames difficulty as expected, patience as the response, and the reward promised to those who persevere.",
    dimensionId: "personal",
    difficulty: "beginner",
    estimatedMinutes: 25,
    prerequisites: [],
    version: 1,
    provenance: JOURNEY_PROVENANCE,
    stages: [
      {
        order: 1,
        title: "Patience and Prayer",
        topicSlug: "patience",
        ref: { surah: 2, ayah: 153 },
        objective:
          "See that patience is paired with prayer as a source of divine support.",
      },
      {
        order: 2,
        title: "Tests Are Inevitable",
        topicSlug: "patience",
        ref: { surah: 2, ayah: 155 },
        objective:
          "Understand that trials — loss, fear, scarcity — are described as inevitable.",
        reflectionPrompt:
          "How does framing difficulty as expected change your response to it?",
      },
      {
        order: 3,
        title: "The Response of the Patient",
        topicSlug: "patience",
        ref: { surah: 2, ayah: 156 },
        objective:
          "Recognize 'We belong to God and to Him we return' as an anchor in loss.",
      },
      {
        order: 4,
        title: "Blessings Upon the Patient",
        topicSlug: "patience",
        ref: { surah: 2, ayah: 157 },
        objective:
          "See that blessings and mercy are promised upon those who are patient.",
      },
      {
        order: 5,
        title: "Hardship Paired with Ease",
        topicSlug: "hardship-and-ease",
        ref: { surah: 94, ayah: 5 },
        objective:
          "Understand the principle: with hardship comes ease — a pairing, not a promise of avoidance.",
      },
    ],
  },
  {
    slug: "gratitude-and-contentment",
    language: JOURNEY_LANGUAGE,
    title: "Gratitude and Contentment",
    arabicTitle: "الشكر والقناعة",
    summary:
      "Explore the Quran's treatment of gratitude — not as passive thankfulness but as active acknowledgment that shapes conduct and invites increase.",
    dimensionId: "spiritual",
    difficulty: "beginner",
    estimatedMinutes: 25,
    prerequisites: [],
    version: 1,
    provenance: JOURNEY_PROVENANCE,
    stages: [
      {
        order: 1,
        title: "Gratitude Brings Increase",
        topicSlug: "gratitude",
        ref: { surah: 14, ayah: 7 },
        objective:
          "Understand the principle: gratitude increases blessings, ingratitude invites their loss.",
        reflectionPrompt:
          "What does 'increase' mean beyond material abundance?",
      },
      {
        order: 2,
        title: "Remembering God",
        topicSlug: "gratitude",
        ref: { surah: 2, ayah: 152 },
        objective:
          "See that remembrance of God is linked to gratitude — acknowledgment precedes thankfulness.",
      },
      {
        order: 3,
        title: "Gratitude Benefits the Grateful",
        topicSlug: "gratitude",
        ref: { surah: 31, ayah: 12 },
        objective:
          "Recognize that gratitude is described as benefiting the one who gives thanks.",
      },
      {
        order: 4,
        title: "Gratitude and Knowledge",
        topicSlug: "gratitude",
        ref: { surah: 39, ayah: 7 },
        objective:
          "See that gratitude is paired with knowledge — thankfulness follows understanding.",
      },
      {
        order: 5,
        title: "Acknowledging Blessings",
        topicSlug: "gratitude",
        ref: { surah: 55, ayah: 13 },
        objective:
          "See the recurring refrain challenging acknowledgment of blessings, large and small.",
        reflectionPrompt:
          "What everyday blessings do you take for granted?",
      },
    ],
  },
  {
    slug: "building-relationship-with-allah",
    language: JOURNEY_LANGUAGE,
    title: "Building a Relationship with Allah",
    arabicTitle: "بناء العلاقة مع الله",
    summary:
      "Explore the foundational relationship between human and divine — through tawheed, remembrance, trust, and supplication.",
    dimensionId: "spiritual",
    difficulty: "intermediate",
    estimatedMinutes: 40,
    prerequisites: ["understanding-tawheed"],
    version: 1,
    provenance: JOURNEY_PROVENANCE,
    stages: [
      {
        order: 1,
        title: "Divine Oneness",
        topicSlug: "tawheed",
        ref: { surah: 112, ayah: 1 },
        objective:
          "Establish the foundation: God is absolutely one, with no partners.",
      },
      {
        order: 2,
        title: "Hearts Find Assurance",
        topicSlug: "remembrance",
        ref: { surah: 13, ayah: 28 },
        objective:
          "See that hearts find assurance in the remembrance of God.",
      },
      {
        order: 3,
        title: "Relying on God",
        topicSlug: "trust-in-god",
        ref: { surah: 65, ayah: 3 },
        objective:
          "Understand that whoever relies upon God, He is sufficient for him.",
      },
      {
        order: 4,
        title: "Calling Upon God",
        topicSlug: "supplication",
        ref: { surah: 2, ayah: 186 },
        objective:
          "Recognize the invitation: 'When My servants ask you concerning Me, indeed I am near.'",
      },
      {
        order: 5,
        title: "God-Consciousness",
        topicSlug: "god-consciousness",
        ref: { surah: 49, ayah: 13 },
        objective:
          "See that the most noble in God's sight is the most conscious of Him.",
      },
    ],
  },
];

/** Look up a journey by slug. Returns null if not found. */
export function getJourney(slug: string): StudyJourney | null {
  return JOURNEYS.find((j) => j.slug === slug) ?? null;
}

/** Get all journeys, optionally filtered by dimension. */
export function getAllJourneys(dimensionId?: string): StudyJourney[] {
  return dimensionId
    ? JOURNEYS.filter((j) => j.dimensionId === dimensionId)
    : JOURNEYS;
}

/** Get journeys for a specific difficulty level. */
export function journeysByDifficulty(
  difficulty: "beginner" | "intermediate" | "advanced"
): StudyJourney[] {
  return JOURNEYS.filter((j) => j.difficulty === difficulty);
}

/** Empty state for journey progress. */
export const EMPTY_JOURNEYS_STATE: JourneysState = {
  progress: {},
};
