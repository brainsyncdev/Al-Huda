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
import type { QuizKind, QuizQuestion } from "./types";

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

/**
 * Real, canonical ayah references usable as distractors. Prefers the supplied
 * pool, then the target's own surah, then first ayat of other surahs. Never
 * invents a reference or text, and never includes the target itself.
 */
function candidateRefs(target: AyahRef, pool: AyahRef[]): AyahRef[] {
  const seen = new Set<string>([refKey(target)]);
  const out: AyahRef[] = [];
  const add = (ref: AyahRef) => {
    const k = refKey(ref);
    if (seen.has(k)) return;
    seen.add(k);
    out.push(ref);
  };

  for (const r of pool) add(r);

  const surah = getSurah(target.surah);
  if (surah) {
    for (const a of surah.ayat) add({ surah: surah.id, ayah: a.ayah });
  }

  if (out.length < 3) {
    for (const s of getSurahIndex()) {
      if (s.id === target.surah) continue;
      add({ surah: s.id, ayah: 1 });
      if (out.length >= 6) break;
    }
  }

  return out;
}

/** Split canonical Arabic into word tokens. No normalisation, no invention. */
function usableWords(text: string): string[] {
  return text.split(/\s+/).filter((w) => w.length > 0);
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
  if (opts.refs && opts.refs.length > 0) {
    pool = opts.refs;
  } else if (opts.pathSlug) {
    const path = getPath(opts.pathSlug);
    if (!path) return [];
    pool = path.steps.map((s) => s.ref);
  } else if (opts.topicSlug) {
    const topic = TOPICS.find((t) => t.slug === opts.topicSlug);
    if (!topic) return [];
    pool = topic.relations.map((r) => r.ref);
  } else if (opts.surahId) {
    const surah = getSurah(opts.surahId);
    if (!surah) return [];
    pool = surah.ayat.map((a) => ({ surah: surah.id, ayah: a.ayah }));
  } else {
    pool = QUESTION_POOL;
  }

  if (pool.length < 1) return [];

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
  if (uniquePool.length < 1) return [];

  const enabledKinds =
    opts.kinds && opts.kinds.length > 0 ? opts.kinds : ALL_KINDS;

  let attempts = 0;
  const maxAttempts = opts.count * 4;
  while (questions.length < opts.count && attempts < maxAttempts) {
    attempts++;
    const kind = pick(rand, enabledKinds);
    const q = makeQuestion(rand, kind, uniquePool, `${opts.seed}-${attempts}`);
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
    case "ayah-recall":
      return makeAyahRecall(rand, pool, idSuffix);
    case "missing-word":
      return makeMissingWord(rand, pool, idSuffix);
    case "reference-recognition":
      return makeReferenceRecognition(rand, pool, idSuffix);
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

  // Pick 3 distractor translations. Pool ayat come first; if the pool is
  // sparse, real ayat from the target's own surah fill the gap. Never invent
  // a translation.
  const others = candidateRefs(target, pool);
  const distractorRefs = shuffle(rand, others).slice(0, 3);
  const distractorAyat = distractorRefs
    .map((r) => getAyah(r.surah, r.ayah))
    .filter((a): a is NonNullable<typeof a> => a !== null);
  if (distractorAyat.length < 3) return null;

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

/**
 * Ayah recall: show a reference (and a theme hint when one exists), let the
 * learner recall the passage, then reveal the canonical text and ask for a
 * self-rating. Free-text Arabic is never auto-scored: minor diacritic or
 * orthographic differences are not evidence of textual equivalence.
 */
function makeAyahRecall(
  rand: () => number,
  pool: AyahRef[],
  idSuffix: string
): QuizQuestion | null {
  const target = pick(rand, pool);
  const ayah = getAyah(target.surah, target.ayah);
  if (!ayah) return null;
  const surah = getSurah(target.surah);
  if (!surah) return null;

  const topic = TOPICS.find((t) =>
    t.relations.some(
      (r) => r.ref.surah === target.surah && r.ref.ayah === target.ayah
    )
  );
  const context = topic
    ? `Theme: ${topic.title}.`
    : `From ${surah.transliteration} (${surah.meaning}).`;

  return {
    id: `ar-${idSuffix}`,
    kind: "ayah-recall",
    prompt: `Recall ${surah.transliteration} ${target.surah}:${target.ayah}.`,
    hint: context,
    data: {
      canonicalArabic: ayah.arabic,
      canonicalTranslation: ayah.translation,
      recallPrompt: `Try to recall the verse before revealing it. ${context}`,
    },
    refs: [target],
  };
}

/**
 * Missing-word exercise: one word is replaced with a blank. The correct answer
 * is the actual canonical word; distractors are other real words from the same
 * ayah (or nearby canonical ayat). Nothing is reconstructed.
 */
function makeMissingWord(
  rand: () => number,
  pool: AyahRef[],
  idSuffix: string
): QuizQuestion | null {
  const target = pick(rand, pool);
  const ayah = getAyah(target.surah, target.ayah);
  if (!ayah) return null;

  const words = usableWords(ayah.arabic);
  if (words.length < 3) return null;

  const candidates = words.filter((w) => w.length >= 3);
  const wordPool = candidates.length > 0 ? candidates : words;
  const missingWord = pick(rand, wordPool);

  // Replace the exact token, not a substring inside another word.
  const tokens = ayah.arabic.split(/(\s+)/);
  let replaced = false;
  const displayArabic = tokens
    .map((token) => {
      if (!replaced && token === missingWord) {
        replaced = true;
        return "▭";
      }
      return token;
    })
    .join("");
  if (!replaced) return null;

  const distractorPool = new Set<string>();
  for (const w of words) {
    if (w !== missingWord && w.length >= 2) distractorPool.add(w);
  }
  if (distractorPool.size < 3) {
    for (const ref of candidateRefs(target, pool)) {
      const other = getAyah(ref.surah, ref.ayah);
      if (!other) continue;
      for (const w of usableWords(other.arabic)) {
        if (w !== missingWord && w.length >= 2) distractorPool.add(w);
        if (distractorPool.size >= 6) break;
      }
      if (distractorPool.size >= 3) break;
    }
  }

  const distractors = shuffle(rand, Array.from(distractorPool)).slice(0, 3);
  if (distractors.length < 3) return null;

  const options = shuffle(rand, [missingWord, ...distractors]);
  const correctIndex = options.indexOf(missingWord);
  const surah = getSurah(target.surah);
  const surahName = surah?.transliteration ?? `Surah ${target.surah}`;

  return {
    id: `mw-${idSuffix}`,
    kind: "missing-word",
    prompt: `Which word is missing from ${surahName} ${target.surah}:${target.ayah}?`,
    data: {
      fullArabic: ayah.arabic,
      displayArabic,
      missingWord,
      options,
      correctIndex,
    },
    refs: [target],
  };
}

/**
 * Reference recognition: show the ayah and ask which surah/ayah it is. Wrong
 * options are real references drawn from the pool or the target's own surah.
 */
function makeReferenceRecognition(
  rand: () => number,
  pool: AyahRef[],
  idSuffix: string
): QuizQuestion | null {
  const target = pick(rand, pool);
  const ayah = getAyah(target.surah, target.ayah);
  if (!ayah) return null;
  const targetSurah = getSurah(target.surah);
  if (!targetSurah) return null;

  const others = shuffle(rand, candidateRefs(target, pool)).slice(0, 3);
  if (others.length < 3) return null;

  const label = (r: AyahRef) => {
    const s = getSurah(r.surah);
    return s
      ? `${s.transliteration} ${r.surah}:${r.ayah}`
      : `${r.surah}:${r.ayah}`;
  };

  const correctOption = { ref: target, label: label(target) };
  const options = shuffle(rand, [
    correctOption,
    ...others.map((r) => ({ ref: r, label: label(r) })),
  ]);
  const correctIndex = options.findIndex(
    (o) => o.ref.surah === target.surah && o.ref.ayah === target.ayah
  );

  return {
    id: `rr-${idSuffix}`,
    kind: "reference-recognition",
    prompt: "Which surah and ayah is this?",
    data: {
      arabic: ayah.arabic,
      translation: ayah.translation,
      correctRef: target,
      options,
      correctIndex,
    },
    refs: [target],
  };
}

