// Sprint 47 — Layer A: Deterministic Morphology Validation Engine
//
// Mechanical, source-backed checks for root-lemma mappings. These checks are
// deterministic, pure, and never modify the original Arabic text.
// Normalization is used for comparison only.
//
// This layer intentionally does NOT make semantic judgements. A lemma that is
// morphologically valid but semantically distinct (polysemy) is still accepted
// morphologically here; semantic categorization is a separate operation handled
// by the human review interface and curated topics.

import type {
  CompatibilityDetail,
  CompatibilityResult,
  DeterministicChecks,
} from "./types";

/** Diacritics and Quranic annotation marks stripped for comparison only. */
const DIACRITICS = /[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g;

/** Weak letters that commonly alternate in Arabic root derivation. */
const WEAK_LETTERS = new Set(["\u0627", "\u0648", "\u064A"]);

/**
 * Normalize Arabic text to bare consonantal letters for comparison only.
 * The input string is never mutated; a new array is returned.
 *
 * This mirrors the normalization used by the publication policy so that
 * Sprint 47 classifications stay consistent with earlier compatibility flags.
 */
export function normalizeLetters(text: string): string[] {
  return [...text.replace(DIACRITICS, "")]
    .filter((c) => /[\u0621-\u064A]/.test(c))
    .map((c) => {
      if (c === "\u0623" || c === "\u0625" || c === "\u0622" || c === "\u0671")
        return "\u0627";
      if (c === "\u0649") return "\u064A";
      if (c === "\u0624") return "\u0648";
      if (c === "\u0626") return "\u064A";
      if (c === "\u0629") return "\u0647";
      return c;
    });
}

/** Return only the strong (non-weak) consonantal letters. */
export function strongLetters(text: string): string[] {
  return normalizeLetters(text).filter((c) => !WEAK_LETTERS.has(c));
}

/** True when the text contains at least one weak letter. */
export function hasWeakLetters(text: string): boolean {
  return normalizeLetters(text).some((c) => WEAK_LETTERS.has(c));
}

/**
 * Count how many letters of `needle` appear, in order, within `haystack`.
 * Returns the matched prefix length. This is a generalization of the
 * ordered-subsequence check used by the publication policy.
 */
export function orderedMatchLength(needle: string[], haystack: string[]): number {
  let i = 0;
  for (const c of haystack) {
    if (i < needle.length && c === needle[i]) i += 1;
  }
  return i;
}

/**
 * A single word-level morphology record shape required by the engine.
 * Kept minimal so the engine does not depend on the full MorphologyRecord.
 */
export interface EngineRecord {
  ref: { surah: number; ayah: number };
  wordPosition?: number;
  token: string;
  root?: string;
  lemma?: string;
}

/**
 * Run the deterministic structural checks for one lemma's records.
 *
 * @param records word-level records already filtered to this root+lemma
 */
export function runStructuralChecks(records: EngineRecord[]): DeterministicChecks {
  const hasSourceRecords = records.length > 0;
  const hasWordLocations =
    hasSourceRecords &&
    records.every(
      (r) => r.wordPosition !== undefined && Number.isInteger(r.wordPosition) && r.wordPosition >= 1
    );
  const hasLemmas =
    hasSourceRecords && records.every((r) => typeof r.lemma === "string" && r.lemma.length > 0);

  // Duplicate detection on surah:ayah:wordPosition
  const seen = new Set<string>();
  let duplicates = 0;
  for (const r of records) {
    const key = `${r.ref.surah}:${r.ref.ayah}:${r.wordPosition ?? ""}`;
    if (seen.has(key)) duplicates += 1;
    else seen.add(key);
  }

  return {
    hasSourceRecords,
    hasWordLocations,
    hasLemmas,
    noDuplicates: duplicates === 0,
  };
}

/**
 * Classify the morphological compatibility of a lemma with its assigned root.
 *
 * This is deliberately conservative. A simplistic consonantal heuristic that
 * fails is NOT sufficient to reject a source-backed mapping; it only downgrades
 * the result to "inconclusive" (which routes to needs-review). Only a mapping
 * with zero shared consonantal structure and no weak-letter explanation is
 * marked "contradicted", and even that requires source evidence before any
 * rejection is finalized by the decision engine.
 */
export function classifyCompatibility(
  root: string,
  lemma: string
): { result: CompatibilityResult; detail: CompatibilityDetail } {
  const rootStrong = strongLetters(root);
  const lemmaStrong = strongLetters(lemma);
  const rootHasWeakLetters = hasWeakLetters(root);
  const lemmaHasWeakLetters = hasWeakLetters(lemma);

  const matched = orderedMatchLength(rootStrong, lemmaStrong);
  const rootStrongLetterCount = rootStrong.length;
  const sharedStrongLetters = matched;

  const detail: CompatibilityDetail = {
    sharedStrongLetters,
    rootStrongLetterCount,
    rootHasWeakLetters,
  };

  // Full ordered match -> compatible.
  if (rootStrongLetterCount > 0 && matched === rootStrongLetterCount) {
    return { result: "compatible", detail };
  }

  // Degenerate root with no strong letters cannot be evaluated deterministically.
  if (rootStrongLetterCount === 0) {
    return { result: "inconclusive", detail };
  }

  // Weak letters on either side may account for the gap -> inconclusive, never
  // an automatic rejection.
  if (rootHasWeakLetters || lemmaHasWeakLetters) {
    return { result: "inconclusive", detail };
  }

  // No shared structure at all and no weak-letter explanation. This is the
  // strongest deterministic signal of a source contradiction (e.g. a lemma with
  // a completely unrelated consonantal skeleton filed under the root). The
  // decision engine still requires source evidence before rejecting.
  if (matched === 0) {
    return { result: "contradicted", detail };
  }

  // Partial match without a weak-letter explanation -> inconclusive.
  return { result: "inconclusive", detail };
}
