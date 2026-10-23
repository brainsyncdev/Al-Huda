// Quiz question generator — server-only module (imports fs-backed data).
//
// Generates self-assessment questions from the pinned Quran dataset, curated
// topics, and learning paths. All questions are deterministic given a seed:
// the same seed produces the same questions, so a learner can retry a quiz
// and see consistent content.
//
// CONTENT RULES:
// - No AI-generated interpretation. Questions are factual (which surah, which
//   translation, which order, which topic) or structural (ordering).
// - Wrong answers are drawn from the same dataset, so they are plausible but
//   verifiably incorrect — no fabricated ayat or translations.
// - Every question carries the ayah refs it is about, so the UI can link back.

import { getAyah, getSurah, getSurahIndex } from "@/lib/quran/data";
import type { AyahRef } from "@/lib/quran/types";
import { TOPICS } from "@/lib/topics/data";
import { getPath } from "@/lib/paths/data";
import type { QuizQuestion } from "./types";

/** Simple seeded PRNG (mulberry32). Deterministic, no external deps. */
function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function shuffle<T>(rand: () => number, arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function refKey(r: AyahRef): string {
  return `${r.surah}:${r.ayah}`;
}

/** Pool of well-known ayat used as the basis for quiz questions. */
const QUESTION_POOL: AyahRef[] = [
  { surah: 1, ayah: 1 },
  { surah: 1, ayah: 2 },
  { surah: 1, ayah: 5 },
  { surah: 2, ayah: 153 },
  { surah: 2, ayah: 155 },
  { surah: 2, ayah: 156 },
  { surah: 2, ayah: 255 },
  { surah: 2, ayah: 286 },
  { surah: 3, ayah: 8 },
  { surah: 4, ayah: 135 },
  { surah: 5, ayah: 8 },
  { surah: 6, ayah: 12 },
  { surah: 6, ayah: 54 },
  { surah: 7, ayah: 156 },
  { surah: 11, ayah: 118 },
  { surah: 12, ayah: 87 },
  { surah: 13, ayah: 28 },
  { surah: 14, ayah: 7 },
  { surah: 16, ayah: 90 },
  { surah: 17, ayah: 23 },
  { surah: 18, ayah: 10 },
  { surah: 21, ayah: 107 },
  { surah: 25, ayah: 74 },
  { surah: 27, ayah: 30 },
  { surah: 31, ayah: 12 },
  { surah: 36, ayah: 1 },
  { surah: 39, ayah: 53 },
  { surah: 49, ayah: 13 },
  { surah: 55, ayah: 13 },
  { surah: 57, ayah: 4 },
  { surah: 57, ayah: 25 },
  { surah: 99, ayah: 7 },
  { surah: 99, ayah: 8 },
  { surah: 103, ayah: 1 },
  { surah: 103, ayah: 2 },
  { surah: 103, ayah: 3 },
  { surah: 104, ayah: 1 },
  { surah: 104, ayah: 2 },
  { surah: 112, ayah: 1 },
  { surah: 112, ayah: 2 },
  { surah: 113, ayah: 1 },
  { surah: 114, ayah: 1 },
];

interface GenerateOptions {
  /** Seed for deterministic generation. */
  seed: number;
  /** How many questions to generate. */
  count: number;
  /** Optional path slug to scope questions to that path's ayat. */
  pathSlug?: string;
  /** Optional topic slug to scope questions to that topic's ayat. */
  topicSlug?: string;
  /** Optional surah id to scope questions to that surah's ayat. */
  surahId?: number;
  /**
   * Explicit ayah pool. Used for the revision source, where the refs live in
   * the learner's browser and must be passed in by the client.
   */
  refs?: AyahRef[];
  /** Question kinds to include. Empty/absent means every supported kind. */
  kinds?: QuizKind[];
}

const ALL_KINDS: QuizKind[] = [
  "surah-identification",
  "translation-match",
  "ayah-ordering",
  "topic-match",
  "ayah-recall",
  "missing-word",
  "reference-recognition",
];

/**
 * Generate a set of quiz questions. Returns an empty array when the scope
 * contains too few ayat to form meaningful questions.
 */
export function generateQuestions(opts: GenerateOptions): QuizQuestion[] {
  const rand = mulberry32(opts.seed);
  const questions: QuizQuestion[] = [];

  // Determine the pool of ayat to draw from.
  let pool: AyahRef[];
  if (opts.pathSlug) {
    const path = getPath(opts.pathSlug);
    if (!path) return [];
    pool = path.steps.map((s) => s.ref);
  } else if (opts.topicSlug) {
    const topic = TOPICS.find((t) => t.slug === opts.topicSlug);
    if (!topic) return [];
    pool = topic.relations.map((r) => r.ref);
  } else {
    pool = QUESTION_POOL;
  }

  if (pool.length < 2) return [];

  // Deduplicate pool by ref key.
  const seen = new Set<string>();
  const uniquePool: AyahRef[] = [];
  for (const ref of pool) {
    const k = refKey(ref);
    if (!seen.has(k)) {
      seen.add(k);
      uniquePool.push(ref);
    }
  }
  if (uniquePool.length < 2) return [];

  const kinds: Array<QuizQuestion["kind"]> = [
    "surah-identification",
    "translation-match",
    "ayah-ordering",
    "topic-match",
  ];

  for (let i = 0; i < opts.count; i++) {
    const kind = pick(rand, kinds);
    const q = makeQuestion(rand, kind, uniquePool, `${opts.seed}-${i}`);
    if (q) questions.push(q);
  }

  return questions;
}

function makeQuestion(
  rand: () => number,
  kind: QuizQuestion["kind"],
  pool: AyahRef[],
  idSuffix: string
): QuizQuestion | null {
  switch (kind) {
    case "surah-identification":
      return makeSurahIdentification(rand, pool, idSuffix);
    case "translation-match":
      return makeTranslationMatch(rand, pool, idSuffix);
    case "ayah-ordering":
      return makeAyahOrdering(rand, pool, idSuffix);
    case "topic-match":
      return makeTopicMatch(rand, pool, idSuffix);
  }
}

function makeSurahIdentification(
  rand: () => number,
  pool: AyahRef[],
  idSuffix: string
): QuizQuestion | null {
  const target = pick(rand, pool);
  const targetAyah = getAyah(target.surah, target.ayah);
  if (!targetAyah) return null;
  const targetSurah = getSurah(target.surah);
  if (!targetSurah) return null;

  // Pick 3 distractor surahs (different from target).
  const index = getSurahIndex();
  const distractors = shuffle(rand, index.filter((s) => s.id !== target.surah))
    .slice(0, 3)
    .map((s) => ({ surahId: s.id, surahName: s.transliteration }));

  const correctOption = {
    surahId: target.surah,
    surahName: targetSurah.transliteration,
  };
  const options = shuffle(rand, [correctOption, ...distractors]);
  const correctIndex = options.findIndex(
    (o) => o.surahId === correctOption.surahId
  );

  const data = {
    arabic: targetAyah.arabic,
    options,
    correctIndex,
  };

  return {
    id: `sq-${idSuffix}`,
    kind: "surah-identification",
    prompt: "Which surah does this ayah belong to?",
    data,
    refs: [target],
  };
}

function makeTranslationMatch(
  rand: () => number,
  pool: AyahRef[],
  idSuffix: string
): QuizQuestion | null {
  const target = pick(rand, pool);
  const targetAyah = getAyah(target.surah, target.ayah);
  if (!targetAyah) return null;

  // Pick 3 distractor translations from other ayat in the pool.
  const others = pool.filter(
    (r) => !(r.surah === target.surah && r.ayah === target.ayah)
  );
  const distractorRefs = shuffle(rand, others).slice(0, 3);
  const distractorAyat = distractorRefs
    .map((r) => getAyah(r.surah, r.ayah))
    .filter((a): a is NonNullable<typeof a> => a !== null);

  const correctTranslation = targetAyah.translation;
  const options = shuffle(rand, [
    correctTranslation,
    ...distractorAyat.map((a) => a.translation),
  ]);
  const correctIndex = options.indexOf(correctTranslation);

  const data = {
    arabic: targetAyah.arabic,
    options,
    correctIndex,
  };

  return {
    id: `tm-${idSuffix}`,
    kind: "translation-match",
    prompt: "Which translation matches this ayah?",
    data,
    refs: [target],
  };
}

function makeAyahOrdering(
  rand: () => number,
  pool: AyahRef[],
  idSuffix: string
): QuizQuestion | null {
  // Find a surah with at least 3 ayat in the pool.
  const bySurah = new Map<number, AyahRef[]>();
  for (const ref of pool) {
    const arr = bySurah.get(ref.surah) ?? [];
    arr.push(ref);
    bySurah.set(ref.surah, arr);
  }

  let candidates: AyahRef[] | null = null;
  for (const refs of bySurah.values()) {
    if (refs.length >= 3) {
      candidates = refs;
      break;
    }
  }
  if (!candidates) return null;

  const sorted = [...candidates].sort(
    (a, b) => a.surah - b.surah || a.ayah - b.ayah
  );
  const count = Math.min(4, sorted.length);
  const chosen = sorted.slice(0, count);

  // Build items with display data.
  const items = chosen.map((ref) => {
    const ayah = getAyah(ref.surah, ref.ayah);
    return {
      ref,
      arabic: ayah?.arabic ?? "",
      translation: ayah?.translation ?? "",
    };
  });

  // Shuffle items for display.
  const shuffled = shuffle(rand, items);
  const correctOrder = chosen.map(
    (ref) => shuffled.findIndex((item) => refKey(item.ref) === refKey(ref))
  );

  const surah = getSurah(chosen[0].surah);
  const surahName = surah?.transliteration ?? `Surah ${chosen[0].surah}`;

  const data = {
    items: shuffled,
    correctOrder,
  };

  return {
    id: `ao-${idSuffix}`,
    kind: "ayah-ordering",
    prompt: `Put these ayat from ${surahName} in the correct order:`,
    data,
    refs: chosen,
  };
}

function makeTopicMatch(
  rand: () => number,
  pool: AyahRef[],
  idSuffix: string
): QuizQuestion | null {
  // Find a topic that has at least 2 ayat in the pool.
  let targetTopic: (typeof TOPICS)[number] | null = null;
  let topicRefs: AyahRef[] = [];

  for (const topic of TOPICS) {
    const overlap = topic.relations
      .map((r) => r.ref)
      .filter((r) => pool.some((p) => p.surah === r.surah && p.ayah === r.ayah));
    if (overlap.length >= 2 && overlap.length > topicRefs.length) {
      targetTopic = topic;
      topicRefs = overlap;
    }
  }

  if (!targetTopic || topicRefs.length < 2) return null;

  // Pick 2 correct + 2 distractors from pool but not in topic.
  const correctRefs = shuffle(rand, topicRefs).slice(0, 2);
  const poolKeys = new Set(correctRefs.map(refKey));
  const topicKeys = new Set(topicRefs.map(refKey));
  const distractors = pool.filter(
    (r) => !poolKeys.has(refKey(r)) && !topicKeys.has(refKey(r))
  );
  const wrongRefs = shuffle(rand, distractors).slice(0, 2);

  const allRefs = shuffle(rand, [...correctRefs, ...wrongRefs]);

  // Build options with display data.
  const options = allRefs.map((ref) => {
    const ayah = getAyah(ref.surah, ref.ayah);
    return {
      ref,
      arabic: ayah?.arabic ?? "",
      translation: ayah?.translation ?? "",
    };
  });

  const correctIndices = correctRefs.map(
    (ref) => allRefs.findIndex((r) => refKey(r) === refKey(ref))
  );

  const data = {
    topicTitle: targetTopic.title,
    options,
    correctIndices,
  };

  return {
    id: `tpm-${idSuffix}`,
    kind: "topic-match",
    prompt: `Which of these ayat belong to the topic "${targetTopic.title}"?`,
    data,
    refs: correctRefs,
  };
}

