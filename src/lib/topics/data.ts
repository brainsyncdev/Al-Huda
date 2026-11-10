// Curated topics with typed, provenance-tracked ayah relations.
//
// IMPORTANT (PRD §10, §24): these are EDITORIAL selections of well-known ayat —
// entry points for reflection, not tafsir and not rulings. Every relation
// records its type, a neutral rationale, provenance, and review status. Topic
// pages must display the review-status notice. Rationales must stay purely
// descriptive (what the verse addresses) and never assert interpretation.

import type { AyahRef } from "@/lib/quran/types";

/** Typed relation kinds required by the PRD (no generic "related" links). */
export type RelationType =
  | "TOPIC_ASSOCIATION"
  | "LEXICAL_MATCH"
  | "CROSS_REFERENCE"
  | "SEQUENTIAL_CONTEXT";

export type ReviewStatus = "pending-scholarly-review" | "editorial-approved";

/**
 * FR-073: publication-state record shared by topics and, optionally, by
 * individual relations. The shape is identical at both levels so a
 * per-relation override is a drop-in replacement for the inherited value.
 */
export interface ProvenanceRecord {
  /** How the selection or review was produced. */
  method: string;
  /** Who produced it. */
  curator: string;
  /** ISO date of the last editorial pass. */
  reviewedAt: string;
  status: ReviewStatus;
}

export interface TopicRelation {
  ref: AyahRef;
  type: RelationType;
  /** One-line, neutral description of why this ayah is included. */
  rationale: string;
  /**
   * FR-073: optional per-relation review record. When present it overrides the
   * topic-level provenance for this relation only (read via
   * `relationProvenance`). Absent by default: no relation in this release has
   * been individually reviewed, and inventing one would fabricate review
   * history that does not exist.
   */
  provenance?: ProvenanceRecord;
}

export interface Topic {
  slug: string;
  /**
   * FR-020: BCP 47 tag for the editorial content of this topic (title,
   * summary, relation rationales). Quran text itself is always Arabic and is
   * not covered by this field.
   */
  language: string;
  /** English title used in navigation. */
  title: string;
  /** Arabic label for display next to the title. */
  arabicTitle: string;
  /** One-paragraph editorial summary shown above the verse list. */
  summary: string;
  /** Related topic slugs for lateral navigation. */
  related: string[];
  relations: TopicRelation[];
  provenance: ProvenanceRecord;
}

const REVIEW: ProvenanceRecord = {
  method: "editorial-selection-v1 (well-known ayat, non-exhaustive)",
  curator: "Al-Huda editorial seed",
  reviewedAt: "2026-10-17",
  status: "pending-scholarly-review",
};

function rel(ayah: number, surah: number) {
  return { surah, ayah };
}

const RAW_TOPICS: Omit<Topic, "language">[] = [
  {
    slug: "patience",
    title: "Patience",
    arabicTitle: "الصبر",
    summary:
      "Verses that speak about patience (sabr) — seeking help through patience and prayer, responding to loss, and the reward promised to those who persevere. This selection is a starting point, not a complete treatment of the theme.",
    related: ["hardship-and-ease", "trust-in-god"],
    relations: [
      {
        ref: rel(153, 2),
        type: "LEXICAL_MATCH",
        rationale:
          "The verse instructs believers to seek help through patience and prayer and states that God is with the patient.",
      },
      {
        ref: rel(155, 2),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Announces that believers will be tested and gives good tidings to the patient.",
      },
      {
        ref: rel(156, 2),
        type: "SEQUENTIAL_CONTEXT",
        rationale:
          "Describes the response of those who are patient when disaster strikes.",
      },
      {
        ref: rel(157, 2),
        type: "SEQUENTIAL_CONTEXT",
        rationale:
          "Continues the passage with blessings and mercy upon the patient.",
      },
      {
        ref: rel(200, 3),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Calls believers to persevere and endure and to remain mindful of God.",
      },
      {
        ref: rel(10, 39),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "States that the patient will be given their reward without measure.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "gratitude",
    title: "Gratitude",
    arabicTitle: "الشكر",
    summary:
      "Verses about gratitude (shukr) — remembering God's favors, the promise that gratitude brings increase, and invitations to be thankful for provision.",
    related: ["remembrance", "mercy-and-forgiveness"],
    relations: [
      {
        ref: rel(7, 14),
        type: "LEXICAL_MATCH",
        rationale:
          "Contains the promise that gratitude is met with increase.",
      },
      {
        ref: rel(152, 2),
        type: "LEXICAL_MATCH",
        rationale:
          "Links remembering God with gratitude and warns against denying Him.",
      },
      {
        ref: rel(13, 55),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Repeatedly asks which of the Lord's favors one would deny.",
      },
      {
        ref: rel(114, 16),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Invites eating from lawful, good provision and being grateful.",
      },
      {
        ref: rel(13, 34),
        type: "LEXICAL_MATCH",
        rationale: "Notes that few of God's servants are grateful.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "trust-in-god",
    title: "Trust in God",
    arabicTitle: "التوكل",
    summary:
      "Verses about tawakkul — relying upon God after taking action, and the statement that He is sufficient for those who trust Him.",
    related: ["patience", "hardship-and-ease"],
    relations: [
      {
        ref: rel(3, 65),
        type: "LEXICAL_MATCH",
        rationale:
          "States that whoever relies upon God, He is sufficient for him.",
      },
      {
        ref: rel(159, 3),
        type: "LEXICAL_MATCH",
        rationale:
          "After consultation and decision, instructs reliance upon God.",
      },
      {
        ref: rel(51, 9),
        type: "LEXICAL_MATCH",
        rationale:
          "Declares that nothing befalls except by God's decree and that upon Him the believers rely.",
      },
      {
        ref: rel(2, 8),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Describes believers as those whose hearts are moved when God is mentioned and who rely upon their Lord.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "mercy-and-forgiveness",
    title: "Mercy and Forgiveness",
    arabicTitle: "الرحمة والمغفرة",
    summary:
      "Verses about God's mercy and forgiveness — the breadth of His mercy, the invitation to seek forgiveness, and the caution against despairing of it.",
    related: ["gratitude", "hardship-and-ease"],
    relations: [
      {
        ref: rel(53, 39),
        type: "LEXICAL_MATCH",
        rationale:
          "Addresses those who have transgressed and tells them not to despair of God's mercy.",
      },
      {
        ref: rel(156, 7),
        type: "LEXICAL_MATCH",
        rationale: "Declares that God's mercy encompasses all things.",
      },
      {
        ref: rel(56, 15),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Asks who despairs of the mercy of his Lord except those astray.",
      },
      {
        ref: rel(110, 4),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Promises that whoever wrongs himself and then seeks forgiveness will find God forgiving and merciful.",
      },
      {
        ref: rel(3, 110),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Closes the surah of victory with a command to seek forgiveness.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "remembrance",
    title: "Remembrance",
    arabicTitle: "الذكر",
    summary:
      "Verses about dhikr — the remembrance of God, the tranquility it brings to hearts, and calls to remember Him frequently.",
    related: ["gratitude", "patience"],
    relations: [
      {
        ref: rel(28, 13),
        type: "LEXICAL_MATCH",
        rationale:
          "States that hearts find assurance in the remembrance of God.",
      },
      {
        ref: rel(41, 33),
        type: "LEXICAL_MATCH",
        rationale:
          "Calls believers to remember God with much remembrance.",
      },
      {
        ref: rel(42, 33),
        type: "SEQUENTIAL_CONTEXT",
        rationale: "Continues the call with morning and afternoon exaltation.",
      },
      {
        ref: rel(45, 29),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Notes that the remembrance of God is the greater matter in prayer.",
      },
      {
        ref: rel(24, 18),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Reminds the reader to remember their Lord when they forget.",
      },
      {
        ref: rel(152, 2),
        type: "CROSS_REFERENCE",
        rationale:
          "Also appears under gratitude; pairs remembrance with reciprocated remembrance.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "giving",
    title: "Giving in the Way of God",
    arabicTitle: "الإنفاق",
    summary:
      "Verses about charity and spending in God's cause — the parable of the seed, quiet giving, and giving from what one values.",
    related: ["justice", "gratitude"],
    relations: [
      {
        ref: rel(261, 2),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Uses the parable of a seed that grows seven ears to describe the multiplication of charity.",
      },
      {
        ref: rel(274, 2),
        type: "TOPIC_ASSOCIATION",
        rationale: "Describes those who spend by night and day, secretly and openly.",
      },
      {
        ref: rel(92, 3),
        type: "LEXICAL_MATCH",
        rationale:
          "States that one does not attain righteousness until giving from what one loves.",
      },
      {
        ref: rel(16, 64),
        type: "LEXICAL_MATCH",
        rationale:
          "Describes success for those protected from the greed of their own souls.",
      },
      {
        ref: rel(7, 57),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Calls believers to spend from what they have been made trustees of.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "justice",
    title: "Justice",
    arabicTitle: "العدل",
    summary:
      "Verses about justice — standing firmly for fairness, testifying truthfully even against oneself, and the command to act justly without letting hatred distort judgment.",
    related: ["giving", "patience"],
    relations: [
      {
        ref: rel(135, 4),
        type: "LEXICAL_MATCH",
        rationale:
          "Commands standing firmly in justice as witnesses for God, even against oneself or family.",
      },
      {
        ref: rel(8, 5),
        type: "LEXICAL_MATCH",
        rationale:
          "Calls believers to be witnesses in justice and warns against letting hatred prevent fairness.",
      },
      {
        ref: rel(90, 16),
        type: "LEXICAL_MATCH",
        rationale: "States that God orders justice and good conduct.",
      },
      {
        ref: rel(9, 49),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Instructs acting justly when reconciling between groups.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "parents-and-family",
    title: "Parents and Family",
    arabicTitle: "الوالدان والأسرة",
    summary:
      "Verses about parents and family — the command to treat parents with kindness, the effort of a mother, and the duty of care toward relatives.",
    related: ["giving", "gratitude"],
    relations: [
      {
        ref: rel(23, 17),
        type: "LEXICAL_MATCH",
        rationale:
          "Directs worship to God alone and good treatment of parents.",
      },
      {
        ref: rel(24, 17),
        type: "SEQUENTIAL_CONTEXT",
        rationale:
          "Continues with humility toward parents and a supplication for them.",
      },
      {
        ref: rel(14, 31),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Mentions a mother's hardship and weaning, and enjoins gratitude to God and to parents.",
      },
      {
        ref: rel(15, 46),
        type: "LEXICAL_MATCH",
        rationale: "Enjoins good treatment of parents.",
      },
      {
        ref: rel(83, 2),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Includes parents among those owed good treatment in the covenant.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "hardship-and-ease",
    title: "Hardship and Ease",
    arabicTitle: "العسر واليسر",
    summary:
      "Verses about difficulty and relief — the pairing of hardship with ease, the principle that no soul is burdened beyond capacity, and the change that follows inner change.",
    related: ["patience", "trust-in-god"],
    relations: [
      {
        ref: rel(5, 94),
        type: "LEXICAL_MATCH",
        rationale: "Pairs hardship with ease.",
      },
      {
        ref: rel(6, 94),
        type: "CROSS_REFERENCE",
        rationale:
          "Repeats the pairing with emphasis; also listed under patience contexts.",
      },
      {
        ref: rel(286, 2),
        type: "LEXICAL_MATCH",
        rationale:
          "States that God does not charge a soul beyond its capacity.",
      },
      {
        ref: rel(139, 3),
        type: "TOPIC_ASSOCIATION",
        rationale: "Tells believers not to weaken or grieve.",
      },
      {
        ref: rel(11, 13),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "States that God does not change a people's condition until they change what is in themselves.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "knowledge-and-reflection",
    title: "Knowledge and Reflection",
    arabicTitle: "العلم والتدبر",
    summary:
      "Verses about seeking knowledge and reflecting — the first revelation's command to read, prayers for increase in knowledge, and calls to ponder the Quran and creation.",
    related: ["remembrance", "gratitude"],
    relations: [
      {
        ref: rel(1, 96),
        type: "LEXICAL_MATCH",
        rationale: "Opens the first revealed passage with the command to read.",
      },
      {
        ref: rel(3, 96),
        type: "SEQUENTIAL_CONTEXT",
        rationale: "Repeats the command to read and describes the Lord's generosity.",
      },
      {
        ref: rel(11, 58),
        type: "LEXICAL_MATCH",
        rationale:
          "States that God raises those given knowledge by degrees.",
      },
      {
        ref: rel(114, 20),
        type: "TOPIC_ASSOCIATION",
        rationale: "Contains the supplication for increase in knowledge.",
      },
      {
        ref: rel(24, 47),
        type: "TOPIC_ASSOCIATION",
        rationale: "Asks whether reflection upon the Quran is taking place.",
      },
      {
        ref: rel(190, 3),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Points to creation and the alternation of night and day as signs for people of understanding.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "the-hereafter",
    title: "The Hereafter",
    arabicTitle: "الآخرة",
    summary:
      "Verses about the life to come — every soul tasting death, deeds weighed, and the scales of justice set for the Day of Judgment.",
    related: ["justice", "hardship-and-ease"],
    relations: [
      {
        ref: rel(185, 3),
        type: "LEXICAL_MATCH",
        rationale: "States that every soul will taste death.",
      },
      {
        ref: rel(7, 99),
        type: "LEXICAL_MATCH",
        rationale:
          "States that whoever does an atom's weight of good will see it.",
      },
      {
        ref: rel(8, 99),
        type: "SEQUENTIAL_CONTEXT",
        rationale: "Completes the pairing with evil recompensed likewise.",
      },
      {
        ref: rel(6, 101),
        type: "TOPIC_ASSOCIATION",
        rationale: "Describes the heavy scales on the Day of Judgment.",
      },
      {
        ref: rel(47, 21),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Announces the setting of the scales of justice for the Resurrection.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "tawheed",
    title: "Divine Oneness",
    arabicTitle: "التوحيد",
    summary:
      "Verses about tawheed — the absolute oneness of God, His unique attributes, and the rejection of any partners or intermediaries. This is the foundational theme of the Quran.",
    related: ["remembrance", "trust-in-god"],
    relations: [
      {
        ref: rel(1, 112),
        type: "LEXICAL_MATCH",
        rationale:
          "The declaration: 'Say: He is God, One' — the purest statement of divine oneness.",
      },
      {
        ref: rel(2, 112),
        type: "SEQUENTIAL_CONTEXT",
        rationale:
          "'God, the Eternal Refuge' — establishes God as the ultimate source of reliance.",
      },
      {
        ref: rel(3, 112),
        type: "SEQUENTIAL_CONTEXT",
        rationale:
          "'He neither begets nor is born' — rejects any notion of divine family or origin.",
      },
      {
        ref: rel(4, 112),
        type: "SEQUENTIAL_CONTEXT",
        rationale:
          "'Nor is there to Him any equivalent' — absolute statement of uniqueness.",
      },
      {
        ref: rel(255, 2),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Ayat al-Kursi declares God's unique sovereignty — 'There is no deity except Him, the Ever-Living, the Sustainer'.",
      },
      {
        ref: rel(22, 59),
        type: "LEXICAL_MATCH",
        rationale:
          "'He is God, besides whom there is no deity, the Knower of the unseen and the witnessed' — comprehensive declaration.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "prayer",
    title: "Prayer",
    arabicTitle: "الصلاة",
    summary:
      "Verses about salah — the prescribed prayer, its establishment, its timing, and its significance as the pillar of worship.",
    related: ["supplication", "remembrance", "tawheed"],
    relations: [
      {
        ref: rel(43, 2),
        type: "LEXICAL_MATCH",
        rationale:
          "'And establish prayer and give zakah' — pairs prayer with charity as fundamental obligations.",
      },
      {
        ref: rel(110, 2),
        type: "LEXICAL_MATCH",
        rationale:
          "'And establish prayer and give zakah and borrow from Allah a goodly loan' — connects prayer, charity, and spending.",
      },
      {
        ref: rel(238, 2),
        type: "LEXICAL_MATCH",
        rationale:
          "'Maintain with care the [middle] prayers' — emphasizes consistency and devotion in prayer.",
      },
      {
        ref: rel(114, 11),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'Establish prayer at the decline of the sun' — specifies prayer timing.",
      },
      {
        ref: rel(45, 29),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'Recite, [O Muhammad], what has been revealed to you of the Book and establish prayer' — links revelation to prayer.",
      },
      {
        ref: rel(14, 20),
        type: "LEXICAL_MATCH",
        rationale:
          "'Indeed, I am Allah. There is no deity except Me, so worship Me and establish prayer' — connects worship to prayer.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "supplication",
    title: "Supplication",
    arabicTitle: "الدعاء",
    summary:
      "Verses about dua — calling upon God, the invitation to ask, and the assurance that God responds to those who call upon Him.",
    related: ["prayer", "trust-in-god", "mercy-and-forgiveness"],
    relations: [
      {
        ref: rel(186, 2),
        type: "LEXICAL_MATCH",
        rationale:
          "'And when My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant' — direct assurance of divine response.",
      },
      {
        ref: rel(60, 40),
        type: "LEXICAL_MATCH",
        rationale:
          "'And your Lord says, Call upon Me; I will respond to you' — explicit invitation to supplicate.",
      },
      {
        ref: rel(55, 7),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'Call upon your Lord in humility and in private' — describes the manner of supplication.",
      },
      {
        ref: rel(201, 2),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Supplication: 'Our Lord, give us in this world [that which is] good and in the Hereafter [that which is] good' — comprehensive prayer for good.",
      },
      {
        ref: rel(38, 3),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Zakariya's supplication: 'My Lord, indeed my bones have weakened' — example of personal supplication.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "god-consciousness",
    title: "God-Consciousness",
    arabicTitle: "التقوى",
    summary:
      "Verses about taqwa — consciousness of God, mindfulness that shapes conduct, and the promise that taqwa is the true measure of nobility.",
    related: ["tawheed", "patience", "gratitude"],
    relations: [
      {
        ref: rel(13, 49),
        type: "LEXICAL_MATCH",
        rationale:
          "'Indeed, the most noble of you in the sight of Allah is the most righteous (muttaqi)' — taqwa as the measure of nobility.",
      },
      {
        ref: rel(197, 2),
        type: "LEXICAL_MATCH",
        rationale:
          "'And take provisions for the journey, but indeed, the best provision is taqwa' — taqwa as spiritual provision.",
      },
      {
        ref: rel(2, 65),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'And whoever fears Allah - He will make for him a way out' — promise for those with taqwa.",
      },
      {
        ref: rel(3, 65),
        type: "LEXICAL_MATCH",
        rationale:
          "'O you who have believed, fear Allah as He should be feared' — command to attain taqwa.",
      },
      {
        ref: rel(2, 2),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'This is the Book about which there is no doubt, a guidance for those conscious of Allah' — Quran as guidance for the muttaqeen.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "repentance",
    title: "Repentance",
    arabicTitle: "التوبة",
    summary:
      "Verses about tawbah — turning back to God, the invitation to repent, and the assurance that God accepts repentance from those who sincerely return to Him.",
    related: ["mercy-and-forgiveness", "god-consciousness", "gratitude"],
    relations: [
      {
        ref: rel(53, 39),
        type: "LEXICAL_MATCH",
        rationale:
          "'Do not despair of the mercy of Allah. Indeed, Allah forgives all sins' — assurance of divine forgiveness.",
      },
      {
        ref: rel(70, 25),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'Except those who repent, believe and do righteous work' — condition for transformation.",
      },
      {
        ref: rel(8, 66),
        type: "LEXICAL_MATCH",
        rationale:
          "'O you who have believed, repent to Allah with sincere repentance' — command for sincere repentance.",
      },
      {
        ref: rel(104, 9),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'Do they not know that it is Allah who accepts repentance from His servants' — God as the acceptor of repentance.",
      },
      {
        ref: rel(89, 3),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'Except those who repent after their wrongdoing and correct themselves' — repentance paired with correction.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "prophets",
    title: "Prophets and Their Stories",
    arabicTitle: "الأنبياء",
    summary:
      "Verses about the prophets — their mission, their trials, their patience, and the lessons drawn from their experiences. The Quran presents their stories as guidance for all humanity.",
    related: ["patience", "trust-in-god", "hardship-and-ease"],
    relations: [
      {
        ref: rel(107, 21),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'And We have not sent you, [O Muhammad], except as a mercy to the worlds' — prophetic mission as mercy.",
      },
      {
        ref: rel(34, 6),
        type: "LEXICAL_MATCH",
        rationale:
          "'And there came to you news of the messengers before you' — reference to prophetic narratives.",
      },
      {
        ref: rel(111, 12),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'There was certainly in their stories a lesson for those of understanding' — prophetic stories as guidance.",
      },
      {
        ref: rel(7, 33),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'And [mention] when We took from the prophets their covenant' — the covenant with prophets.",
      },
      {
        ref: rel(13, 42),
        type: "LEXICAL_MATCH",
        rationale:
          "'He has ordained for you of religion what He enjoined upon Noah' — continuity of prophetic message.",
      },
    ],
    provenance: REVIEW,
  },
  {
    slug: "good-character",
    title: "Good Character",
    arabicTitle: "الأخلاق",
    summary:
      "Verses about akhlaq — good character, kindness, honesty, humility, and the moral qualities that shape a believer's conduct with others.",
    related: ["justice", "parents-and-family", "giving"],
    relations: [
      {
        ref: rel(4, 68),
        type: "LEXICAL_MATCH",
        rationale:
          "'And indeed, you are of a great moral character' — affirmation of the Prophet's character.",
      },
      {
        ref: rel(159, 3),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'So by mercy from Allah, you were gentle with them' — gentleness as a moral quality.",
      },
      {
        ref: rel(63, 25),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "'The servants of the Most Merciful are those who walk upon the earth easily' — humility in conduct.",
      },
      {
        ref: rel(11, 49),
        type: "TOPIC_ASSOCIATION",
        rationale:
          "Prohibition of mockery and backbiting — moral boundaries in social conduct.",
      },
      {
        ref: rel(37, 17),
        type: "LEXICAL_MATCH",
        rationale:
          "'And do not walk upon the earth exultantly' — prohibition of arrogance.",
      },
    ],
    provenance: REVIEW,
  },
];

/**
 * FR-020. Language is stamped centrally rather than repeated in every literal,
 * so the declared content language cannot drift out of sync with the editorial
 * record. Every curated selection in this release is written in English.
 */
const TOPIC_LANGUAGE = "en";

export const TOPICS: Topic[] = RAW_TOPICS.map((t) => ({
  ...t,
  language: TOPIC_LANGUAGE,
}));

export function getTopic(slug: string): Topic | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

export function topicTitle(slug: string): string {
  return TOPICS.find((t) => t.slug === slug)?.title ?? slug;
}

/**
 * FR-073: effective provenance for one relation. A relation carrying its own
 * review record overrides the topic-level value; otherwise the relation
 * inherits the topic's provenance (the default for every relation shipped in
 * this release).
 */
export function relationProvenance(
  relation: TopicRelation,
  topic: Topic
): ProvenanceRecord {
  return relation.provenance ?? topic.provenance;
}

/** Count of relations carrying an individual review record (FR-073). */
export function individuallyReviewedCount(topic: Topic): number {
  return topic.relations.filter((r) => r.provenance !== undefined).length;
}

/** Reverse index: which topics include a given ayah. */
export function topicsForAyah(ref: AyahRef): Topic[] {
  return TOPICS.filter((t) =>
    t.relations.some((r) => r.ref.surah === ref.surah && r.ref.ayah === ref.ayah)
  );
}

export const RELATION_TYPE_LABELS: Record<RelationType, string> = {
  TOPIC_ASSOCIATION: "Thematic association",
  LEXICAL_MATCH: "Lexical match",
  CROSS_REFERENCE: "Cross-reference",
  SEQUENTIAL_CONTEXT: "Sequential context",
};

/**
 * FR-020 display gloss for a declared content language. Keys are BCP 47 tags as
 * stored on `Topic.language`. Unknown tags fall back to the raw tag rather than
 * to a guessed name, so a future non-English topic can never be mislabelled.
 */
export const LANGUAGE_LABELS: Record<string, string> = {
  en: "English",
  ar: "Arabic",
};
