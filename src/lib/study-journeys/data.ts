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
    learningObjective:
      "Understand the foundational concept of divine oneness (Tawheed) as presented in the Quran.",
    intendedAudience: "Beginners exploring Islamic theology",
    completionCriteria: [
      "Completed all 5 stages",
      "Reflected on each ayah's meaning",
      "Can articulate the core principles of Tawheed",
    ],
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
        reflectionPrompt:
          "What does the concept of absolute oneness mean to you personally?",
        completionCriteria:
          "Can explain the significance of Surah Al-Ikhlas verse 1 as the foundation of Tawheed.",
        nextStep:
          "Proceed to the next stage to explore God's role as the Eternal Refuge.",
      },
      {
        order: 2,
        title: "The Eternal Refuge",
        ref: { surah: 112, ayah: 2 },
        objective:
          "Recognize that 'the Eternal Refuge' means God is the ultimate source of reliance.",
        reflectionPrompt:
          "How does understanding God as the Eternal Refuge affect your sense of reliance?",
        completionCriteria:
          "Can describe what it means for God to be As-Samad (the Eternal Refuge).",
        nextStep:
          "Continue to understand what divine oneness rejects — partners and components.",
      },
      {
        order: 3,
        title: "No Partners or Components",
        ref: { surah: 112, ayah: 3 },
        objective:
          "See that 'He neither begets nor is born' rejects any notion of divine family or origin.",
        reflectionPrompt:
          "What does it mean to you that the divine has no origin or offspring?",
        completionCriteria:
          "Can explain how this verse rejects concepts of divine lineage or partnership.",
        nextStep:
          "Move to the final ayah of Surah Al-Ikhlas to understand divine uniqueness.",
      },
      {
        order: 4,
        title: "No Equivalent",
        ref: { surah: 112, ayah: 4 },
        objective:
          "Understand that there is nothing comparable to God — a absolute statement of uniqueness.",
        reflectionPrompt:
          "What does absolute oneness mean for how you understand existence?",
        completionCriteria:
          "Can articulate why nothing in creation can be compared to the Creator.",
        nextStep:
          "Proceed to Ayat al-Kursi to see Tawheed expanded in a longer passage.",
      },
      {
        order: 5,
        title: "The Throne Verse",
        topicSlug: "tawheed",
        ref: { surah: 2, ayah: 255 },
        objective:
          "See that Ayat al-Kursi declares God's unique sovereignty over all creation.",
        reflectionPrompt:
          "How does Ayat al-Kursi deepen your understanding of divine sovereignty?",
        completionCriteria:
          "Can identify key attributes of God declared in Ayat al-Kursi.",
        nextStep:
          "You have completed this journey. Consider reflecting on how Tawheed shapes daily life.",
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
    learningObjective:
      "Understand the Quranic perspective on patience (Sabr) as a response to life's inevitable trials.",
    intendedAudience: "Anyone facing challenges or seeking resilience",
    completionCriteria: [
      "Completed all 5 stages",
      "Reflected on personal experiences of difficulty",
      "Can describe the Quranic framework for patience and ease",
    ],
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
        reflectionPrompt:
          "How do patience and prayer connect in your understanding of seeking support?",
        completionCriteria:
          "Can explain the relationship between patience and prayer as described in this verse.",
        nextStep:
          "Proceed to understand that trials are described as inevitable.",
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
        completionCriteria:
          "Can identify the types of trials mentioned and their purpose.",
        nextStep:
          "Continue to see how the patient respond to these inevitable trials.",
      },
      {
        order: 3,
        title: "The Response of the Patient",
        topicSlug: "patience",
        ref: { surah: 2, ayah: 156 },
        objective:
          "Recognize 'We belong to God and to Him we return' as an anchor in loss.",
        reflectionPrompt:
          "What does this statement of return mean to you in times of loss?",
        completionCriteria:
          "Can explain the significance of 'Inna lillahi wa inna ilayhi raji'un'.",
        nextStep:
          "Move to see the blessings promised to those who demonstrate patience.",
      },
      {
        order: 4,
        title: "Blessings Upon the Patient",
        topicSlug: "patience",
        ref: { surah: 2, ayah: 157 },
        objective:
          "See that blessings and mercy are promised upon those who are patient.",
        reflectionPrompt:
          "How does knowing there are blessings change your view of enduring difficulty?",
        completionCriteria:
          "Can describe the blessings and mercy promised to the patient.",
        nextStep:
          "Proceed to the principle that hardship is paired with ease.",
      },
      {
        order: 5,
        title: "Hardship Paired with Ease",
        topicSlug: "hardship-and-ease",
        ref: { surah: 94, ayah: 5 },
        objective:
          "Understand the principle: with hardship comes ease — a pairing, not a promise of avoidance.",
        reflectionPrompt:
          "How do you understand the pairing of hardship and ease in your own life?",
        completionCriteria:
          "Can explain the principle that ease accompanies hardship.",
        nextStep:
          "You have completed this journey. Consider how patience has shaped your past experiences.",
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
    learningObjective:
      "Understand gratitude (Shukr) as an active practice that shapes conduct and invites divine increase.",
    intendedAudience: "Those seeking to cultivate thankfulness and contentment",
    completionCriteria: [
      "Completed all 5 stages",
      "Reflected on personal blessings and gratitude practices",
      "Can articulate the Quranic principles of gratitude and its effects",
    ],
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
        completionCriteria:
          "Can explain the principle that gratitude leads to increase in blessings.",
        nextStep:
          "Proceed to see how remembrance of God is linked to gratitude.",
      },
      {
        order: 2,
        title: "Remembering God",
        topicSlug: "gratitude",
        ref: { surah: 2, ayah: 152 },
        objective:
          "See that remembrance of God is linked to gratitude — acknowledgment precedes thankfulness.",
        reflectionPrompt:
          "How does remembrance connect to your sense of gratitude?",
        completionCriteria:
          "Can describe the relationship between remembrance (dhikr) and gratitude.",
        nextStep:
          "Continue to understand that gratitude benefits the one who practices it.",
      },
      {
        order: 3,
        title: "Gratitude Benefits the Grateful",
        topicSlug: "gratitude",
        ref: { surah: 31, ayah: 12 },
        objective:
          "Recognize that gratitude is described as benefiting the one who gives thanks.",
        reflectionPrompt:
          "In what ways has gratitude benefited you personally?",
        completionCriteria:
          "Can explain how gratitude is framed as benefiting the grateful person.",
        nextStep:
          "Move to see how gratitude is paired with knowledge.",
      },
      {
        order: 4,
        title: "Gratitude and Knowledge",
        topicSlug: "gratitude",
        ref: { surah: 39, ayah: 7 },
        objective:
          "See that gratitude is paired with knowledge — thankfulness follows understanding.",
        reflectionPrompt:
          "How does understanding lead to deeper gratitude in your experience?",
        completionCriteria:
          "Can explain the connection between knowledge and gratitude.",
        nextStep:
          "Proceed to the final stage on acknowledging everyday blessings.",
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
        completionCriteria:
          "Can identify blessings in daily life and articulate their significance.",
        nextStep:
          "You have completed this journey. Consider keeping a gratitude journal going forward.",
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
    learningObjective:
      "Develop an understanding of how to cultivate a meaningful relationship with the Divine through Quranic guidance.",
    intendedAudience:
      "Intermediate learners who have completed Understanding Tawheed",
    completionCriteria: [
      "Completed all 5 stages",
      "Reflected on each aspect of the divine relationship",
      "Can describe the key practices that build a relationship with God",
    ],
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
        reflectionPrompt:
          "How does understanding divine oneness shape your relationship with God?",
        completionCriteria:
          "Can articulate how Tawheed forms the foundation of the divine relationship.",
        nextStep:
          "Proceed to see how remembrance brings assurance to the heart.",
      },
      {
        order: 2,
        title: "Hearts Find Assurance",
        topicSlug: "remembrance",
        ref: { surah: 13, ayah: 28 },
        objective:
          "See that hearts find assurance in the remembrance of God.",
        reflectionPrompt:
          "What practices of remembrance bring you a sense of assurance?",
        completionCriteria:
          "Can explain how remembrance (dhikr) brings tranquility to the heart.",
        nextStep:
          "Continue to understand the concept of relying upon God.",
      },
      {
        order: 3,
        title: "Relying on God",
        topicSlug: "trust-in-god",
        ref: { surah: 65, ayah: 3 },
        objective:
          "Understand that whoever relies upon God, He is sufficient for him.",
        reflectionPrompt:
          "What does it mean to you to rely upon God as sufficient?",
        completionCriteria:
          "Can describe what tawakkul (trust in God) means in practice.",
        nextStep:
          "Move to see the invitation to call upon God directly.",
      },
      {
        order: 4,
        title: "Calling Upon God",
        topicSlug: "supplication",
        ref: { surah: 2, ayah: 186 },
        objective:
          "Recognize the invitation: 'When My servants ask you concerning Me, indeed I am near.'",
        reflectionPrompt:
          "How does knowing God is near affect your sense of supplication?",
        completionCriteria:
          "Can explain the Quranic invitation to direct supplication (dua).",
        nextStep:
          "Proceed to the final stage on god-consciousness (taqwa).",
      },
      {
        order: 5,
        title: "God-Consciousness",
        topicSlug: "god-consciousness",
        ref: { surah: 49, ayah: 13 },
        objective:
          "See that the most noble in God's sight is the most conscious of Him.",
        reflectionPrompt:
          "How does god-consciousness (taqwa) influence your daily decisions?",
        completionCriteria:
          "Can describe how taqwa (god-consciousness) is the measure of nobility.",
        nextStep:
          "You have completed this journey. Consider how these practices can be integrated into daily life.",
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
