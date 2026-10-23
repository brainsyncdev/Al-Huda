// Curated learning paths — structured curriculum for guided Quran study.
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// Every path and step carries provenance metadata following the same pattern
// as src/lib/topics/data.ts. All content is marked pending-scholarly-review
// until a qualified reviewer validates it. The UI displays this status
// transparently — nothing is presented as authoritative without disclosure.
//
// CONTENT RULES (same as topics):
// - Objectives are neutral and descriptive, never interpretive or preachy.
// - Reflection prompts are questions, not answers.
// - No AI-generated religious interpretation is presented as fact.
// - Every ayah reference must resolve in the pinned dataset.

import type { LearningPath, PathsState, TargetAudience } from "./types";
import type { ProvenanceRecord } from "../topics/data";

export type { TargetAudience };

/** Language stamp for all paths — centralized to avoid drift. */
export const PATH_LANGUAGE = "en" as const;

/** Canonical provenance for all shipped paths. */
const PATH_PROVENANCE: ProvenanceRecord = {
  method: "editorial-curation",
  curator: "Al-Huda editorial team",
  reviewedAt: "2026-10-23",
  status: "pending-scholarly-review",
};

/**
 * Initial set of curated learning paths. Each path is designed for a specific
 * audience and learning goal, with sequenced steps that build understanding
 * progressively.
 *
 * All paths are marked pending-scholarly-review. The UI displays this status
 * so learners know the content has not been validated by a qualified scholar.
 */
export const PATHS: LearningPath[] = [
  {
    slug: "first-steps",
    language: PATH_LANGUAGE,
    title: "First Steps",
    arabicTitle: "الخطوات الأولى",
    summary:
      "Begin your Quran journey with the most essential surahs: Al-Fatihah (the opening prayer), and the three short surahs that capture core Islamic beliefs — sincerity, seeking refuge, and divine protection.",
    targetAudience: "new-muslim",
    related: ["short-surahs", "key-themes"],
    provenance: PATH_PROVENANCE,
    steps: [
      {
        order: 1,
        ref: { surah: 1, ayah: 1 },
        objective:
          "Understand that Al-Fatihah is the opening prayer of the Quran, recited in every unit of the formal prayer.",
        reflectionPrompt:
          "What does it mean to begin with praise and acknowledgment?",
      },
      {
        order: 2,
        ref: { surah: 1, ayah: 2 },
        objective:
          "Recognize that 'Lord of the worlds' establishes God's sovereignty over all creation, not just one group or place.",
      },
      {
        order: 3,
        ref: { surah: 1, ayah: 5 },
        objective:
          "See that the prayer 'You alone we worship, You alone we ask for help' frames the relationship between human and divine as direct, without intermediaries.",
        reflectionPrompt:
          "How does direct address shape your sense of responsibility?",
      },
      {
        order: 4,
        ref: { surah: 112, ayah: 1 },
        // No canonical topic covers tawhid (divine oneness) yet. The slug
        // reference was removed rather than pointed at an unrelated topic.
        // Owner decision: create a tawhid topic, or accept this step has no
        // topic anchor. See SPRINT-2-REPORT.md.
        objective:
          "Grasp that Al-Ikhlas declares absolute divine oneness — no partners, no components, no equals.",
        reflectionPrompt:
          "What does absolute oneness mean for how you understand existence?",
      },
      {
        order: 5,
        ref: { surah: 112, ayah: 2 },
        objective:
          "Understand 'the Eternal Refuge' means God is the ultimate source of reliance, not a temporary aid.",
      },
      {
        order: 6,
        ref: { surah: 113, ayah: 1 },
        objective:
          "See that seeking refuge acknowledges vulnerability and the need for protection from harm.",
      },
      {
        order: 7,
        ref: { surah: 114, ayah: 1 },
        objective:
          "Recognize that divine protection extends to both external and internal sources of misguidance.",
        reflectionPrompt:
          "What inner or outer influences do you seek protection from?",
      },
    ],
  },
  {
    slug: "key-themes",
    language: PATH_LANGUAGE,
    title: "Key Themes: Patience & Gratitude",
    arabicTitle: "المواضيع الرئيسية: الصبر والشكر",
    summary:
      "Explore two foundational Quranic virtues — patience through difficulty and gratitude for blessings — through carefully selected ayat that show how these qualities shape a resilient, reflective life.",
    targetAudience: "regular-reader",
    related: ["first-steps", "the-merciful"],
    provenance: PATH_PROVENANCE,
    steps: [
      {
        order: 1,
        ref: { surah: 2, ayah: 153 },
        topicSlug: "patience",
        objective:
          "See that patience is paired with prayer as a source of divine support, not passive endurance.",
      },
      {
        order: 2,
        ref: { surah: 2, ayah: 155 },
        topicSlug: "patience",
        objective:
          "Understand that trials are described as inevitable — loss, fear, scarcity — and patience is the response, not the avoidance.",
        reflectionPrompt:
          "How does framing difficulty as expected change your response to it?",
      },
      {
        order: 3,
        ref: { surah: 2, ayah: 156 },
        topicSlug: "patience",
        objective:
          "Recognize the phrase 'We belong to God and to Him we return' as an anchor in loss — not denial, but acceptance of transience.",
      },
      {
        order: 4,
        ref: { surah: 2, ayah: 152 },
        topicSlug: "gratitude",
        objective:
          "See that remembrance of God is linked to gratitude — acknowledgment precedes thankfulness.",
      },
      {
        order: 5,
        ref: { surah: 14, ayah: 7 },
        topicSlug: "gratitude",
        objective:
          "Understand the principle: gratitude increases blessings, ingratitude invites their loss — a cause-and-effect framework, not a promise of material reward.",
        reflectionPrompt:
          "What does 'increase' mean beyond material abundance?",
      },
      {
        order: 6,
        ref: { surah: 31, ayah: 12 },
        topicSlug: "gratitude",
        objective:
          "See that gratitude is described as benefiting the one who gives thanks — God needs no thanks, the act serves the human.",
      },
      {
        order: 7,
        ref: { surah: 39, ayah: 7 },
        topicSlug: "gratitude",
        objective:
          "Recognize that gratitude is paired with knowledge — thankfulness follows understanding, not precedes it.",
      },
      {
        order: 8,
        ref: { surah: 55, ayah: 13 },
        topicSlug: "gratitude",
        objective:
          "See the recurring refrain 'Which, then, of your Lord's powers can you disavow?' as a challenge to acknowledge blessings, large and small.",
        reflectionPrompt:
          "What everyday blessings do you take for granted?",
      },
    ],
  },
  {
    slug: "short-surahs",
    language: PATH_LANGUAGE,
    title: "Short Surahs with Meaning",
    arabicTitle: "السور القصيرة بمعانيها",
    summary:
      "Three brief surahs that pack profound moral lessons — the value of time, the danger of slander, and the reminder that even small acts have consequences. Each surah is unpacked verse by verse.",
    targetAudience: "explorer",
    related: ["first-steps", "justice"],
    provenance: PATH_PROVENANCE,
    steps: [
      {
        order: 1,
        ref: { surah: 103, ayah: 1 },
        objective:
          "Understand that 'By time' is an oath — the surah opens with a solemn declaration, not a casual observation.",
      },
      {
        order: 2,
        ref: { surah: 103, ayah: 2 },
        objective:
          "See that humanity is described as 'in loss' — a strong claim that demands examination.",
        reflectionPrompt:
          "What does it mean to be 'in loss' in a broader sense?",
      },
      {
        order: 3,
        ref: { surah: 103, ayah: 3 },
        objective:
          "Recognize the four exceptions to loss: faith, good deeds, mutual encouragement to truth, and mutual encouragement to patience — a community framework, not individual effort.",
      },
      {
        order: 4,
        ref: { surah: 104, ayah: 1 },
        objective:
          "See that 'every slanderer, backbiter' is addressed directly — the surah names specific harmful behaviors, not vague wrongdoing.",
      },
      {
        order: 5,
        ref: { surah: 104, ayah: 2 },
        objective:
          "Understand that wealth is described as something people 'count' — an obsession with accumulation, not wealth itself.",
        reflectionPrompt:
          "How does counting (measuring, comparing) shape your relationship to possessions?",
      },
      {
        order: 6,
        ref: { surah: 104, ayah: 6 },
        objective:
          "Recognize that the 'fire of God' is described as 'kindled' — it rises over hearts, suggesting internal consequences, not only external punishment.",
      },
      {
        order: 7,
        ref: { surah: 99, ayah: 1 },
        objective:
          "See that the earth 'shakes with its [final] quaking' — the surah describes a cosmic event, not a local disaster.",
      },
      {
        order: 8,
        ref: { surah: 99, ayah: 7 },
        objective:
          "Understand that 'an atom's weight of good' and 'an atom's weight of evil' establish that no act is too small to matter.",
        reflectionPrompt:
          "What small acts do you dismiss as insignificant?",
      },
      {
        order: 9,
        ref: { surah: 99, ayah: 8 },
        objective:
          "See that every person 'will see' their deeds — the accounting is personal and unavoidable, not abstract.",
      },
    ],
  },
  {
    slug: "the-merciful",
    language: PATH_LANGUAGE,
    title: "The Merciful",
    arabicTitle: "الرحمن",
    summary:
      "Explore the Quran's central attribute of divine mercy through ayat that show mercy as active, not passive — bestowed, not earned; universal, not exclusive. This path traces how mercy operates in creation, guidance, and human response.",
    targetAudience: "student",
    related: ["key-themes", "justice"],
    provenance: PATH_PROVENANCE,
    steps: [
      {
        order: 1,
        ref: { surah: 6, ayah: 12 },
        topicSlug: "mercy-and-forgiveness",
        objective:
          "See that God has 'prescribed mercy upon Himself' — mercy is self-imposed, not optional or conditional.",
      },
      {
        order: 2,
        ref: { surah: 6, ayah: 54 },
        topicSlug: "mercy-and-forgiveness",
        objective:
          "Understand that mercy 'covers' — the metaphor suggests protection and concealment of faults, not exposure.",
      },
      {
        order: 3,
        ref: { surah: 7, ayah: 156 },
        topicSlug: "mercy-and-forgiveness",
        objective:
          "Recognize that mercy is 'written' — a permanent decree, not a temporary reprieve.",
        reflectionPrompt:
          "How does permanence change your sense of security?",
      },
      {
        order: 4,
        ref: { surah: 21, ayah: 107 },
        topicSlug: "mercy-and-forgiveness",
        objective:
          "See that the Prophet is sent 'as a mercy to the worlds' — mercy is the mission, not a side effect.",
      },
      {
        order: 5,
        ref: { surah: 27, ayah: 30 },
        topicSlug: "mercy-and-forgiveness",
        objective:
          "Understand that mercy is linked to guidance — the letter begins 'In the name of God, the Merciful, the Compassionate' before any message is delivered.",
      },
      {
        order: 6,
        ref: { surah: 39, ayah: 53 },
        topicSlug: "mercy-and-forgiveness",
        objective:
          "Recognize the invitation: 'Do not despair of God's mercy' — despair is framed as the problem, not the sin.",
        reflectionPrompt:
          "What makes despair feel more rational than hope?",
      },
    ],
  },
  {
    slug: "justice",
    language: PATH_LANGUAGE,
    title: "Justice in the Quran",
    arabicTitle: "العدل في القرآن",
    summary:
      "Trace the Quran's treatment of justice — not as abstract principle but as concrete obligation. These ayat show justice as a duty to God, to others, and to oneself, requiring both action and restraint.",
    targetAudience: "student",
    related: ["the-merciful", "short-surahs"],
    provenance: PATH_PROVENANCE,
    steps: [
      {
        order: 1,
        ref: { surah: 4, ayah: 135 },
        topicSlug: "justice",
        objective:
          "See that justice must be upheld 'even against yourselves or against parents and relatives' — it overrides personal loyalty.",
      },
      {
        order: 2,
        ref: { surah: 4, ayah: 58 },
        topicSlug: "justice",
        objective:
          "Understand that 'trusts' must be rendered to their owners, and judgment must be 'just' — two linked obligations, not separate.",
      },
      {
        order: 3,
        ref: { surah: 5, ayah: 8 },
        topicSlug: "justice",
        objective:
          "Recognize that hatred of a people must not prevent justice — enmity is not a license for unfairness.",
        reflectionPrompt:
          "Where do you find it hardest to be fair?",
      },
      {
        order: 4,
        ref: { surah: 6, ayah: 152 },
        topicSlug: "justice",
        objective:
          "See that justice in speech — 'even if a relative is involved' — extends fairness to words, not only actions.",
      },
      {
        order: 5,
        ref: { surah: 16, ayah: 90 },
        topicSlug: "justice",
        objective:
          "Understand the three-part command: justice, good conduct, and giving to relatives — a progression from obligation to generosity.",
      },
      {
        order: 6,
        ref: { surah: 57, ayah: 25 },
        topicSlug: "justice",
        objective:
          "Recognize that scripture and balance were sent down 'so that people may uphold justice' — justice is the purpose, not a byproduct.",
      },
    ],
  },
];

/** Look up a path by slug. Returns null if not found. */
export function getPath(slug: string): LearningPath | null {
  return PATHS.find((p) => p.slug === slug) ?? null;
}

/** Get all paths for a specific audience. */
export function pathsForAudience(audience: TargetAudience): LearningPath[] {
  return PATHS.filter((p) => p.targetAudience === audience);
}

/** Get all paths, optionally filtered by audience. */
export function getAllPaths(audience?: TargetAudience): LearningPath[] {
  return audience ? pathsForAudience(audience) : PATHS;
}

/** Recommended paths for each audience, in priority order. */
export const RECOMMENDED_PATHS: Record<TargetAudience, string[]> = {
  "new-muslim": ["first-steps", "short-surahs"],
  "regular-reader": ["key-themes", "the-merciful"],
  student: ["the-merciful", "justice", "key-themes"],
  explorer: ["short-surahs", "first-steps"],
};

/** Empty state for a new learner. */
export const EMPTY_PATHS_STATE: PathsState = {
  progress: {},
  selectedGoal: null,
  onboardingCompleted: false,
};

/** Audience display labels. */
export const AUDIENCE_LABELS: Record<TargetAudience, string> = {
  "new-muslim": "New to the Quran",
  "regular-reader": "Regular Reader",
  student: "Student of the Quran",
  explorer: "Curious Explorer",
};

/** Audience descriptions for onboarding. */
export const AUDIENCE_DESCRIPTIONS: Record<TargetAudience, string> = {
  "new-muslim":
    "You're new to Islam or the Quran and want to start with the essentials.",
  "regular-reader":
    "You read the Quran regularly and want to deepen your understanding of key themes.",
  student:
    "You're studying the Quran seriously and want to explore specific topics in depth.",
  explorer:
    "You're curious about the Quran's message and want to explore at your own pace.",
};
