// Sprint 46 — Phase D: Root Activation Engine
//
// Deterministic engine that converts approved human review decisions into
// populated occurrence indexes. This is the bridge between reviewer decisions
// and the existing occurrence-index system.
//
// DESIGN PRINCIPLES:
//   1. Only explicitly included lemmas generate occurrence results.
//   2. Excluded lemmas never appear in the activated index.
//   3. Undecided lemmas prevent approval (enforced upstream).
//   4. Empty included-lemma sets never create populated indexes.
//   5. An approved root with zero actual occurrences fails activation.
//   6. No silent result caps.
//   7. Existing pagination is preserved.
//   8. The original morphology index is never modified.
//   9. Activation is repeatable and deterministic.

import type { MorphologyRecord } from "../types";
import type { RootReviewDecision, ActivationResult } from "./types";
import { deriveIncludedLemmas, isReviewComplete, canApproveReview } from "./storage";

/**
 * Validate a root review decision for activation readiness.
 * This is the deterministic gate that must pass before activation.
 */
export function validateForActivation(
  review: RootReviewDecision
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // 1. Review must be complete (all lemmas decided)
  if (!isReviewComplete(review)) {
    errors.push("Review is incomplete — some lemmas are still undecided.");
  }

  // 2. Review must be approvable
  const approval = canApproveReview(review);
  if (!approval.canApprove) {
    errors.push(...approval.reasons);
  }

  // 3. Review state must be approved
  if (review.reviewState !== "approved") {
    errors.push(
      `Review state is "${review.reviewState}", must be "approved" for activation.`
    );
  }

  // 4. Final included lemmas must be non-empty
  const includedLemmas = deriveIncludedLemmas(review);
  if (includedLemmas.length === 0) {
    errors.push("No lemmas marked for inclusion — cannot activate an empty set.");
  }

  // 5. Final included lemmas must match derived set
  const derived = deriveIncludedLemmas(review);
  const stored = [...review.finalIncludedLemmas].sort();
  if (JSON.stringify(derived) !== JSON.stringify(stored)) {
    errors.push(
      "finalIncludedLemmas does not match the set of explicitly included lemmas. " +
        `Derived: [${derived.join(", ")}], Stored: [${stored.join(", ")}]`
    );
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Activate a root: filter morphology records by the approved included lemmas
 * and produce occurrence data.
 *
 * This function is PURE — it does not read from or write to the filesystem.
 * The caller provides the morphology records and receives the filtered results.
 *
 * @param review - The approved root review decision.
 * @param allRecords - All word-level morphology records (already filtered to wordPosition !== undefined).
 * @returns ActivationResult with occurrence data.
 */
export function activateRoot(
  review: RootReviewDecision,
  allRecords: MorphologyRecord[]
): ActivationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate first
  const validation = validateForActivation(review);
  if (!validation.valid) {
    return {
      slug: review.slug,
      root: review.root,
      success: false,
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: 0,
      errors: validation.errors,
      warnings: [],
    };
  }

  const includedLemmas = deriveIncludedLemmas(review);
  const lemmaSet = new Set(includedLemmas);
  const rootString = review.root;

  // Filter records: must match root AND have an included lemma
  const matchingRecords = allRecords.filter((record) => {
    if (record.root !== rootString) return false;
    if (!record.lemma) return false;
    if (!lemmaSet.has(record.lemma)) return false;
    return true;
  });

  // Check for zero occurrences
  if (matchingRecords.length === 0) {
    errors.push(
      `Approved root "${review.slug}" has zero matching occurrences. ` +
        "An approved root with zero actual occurrences must fail activation. " +
        "Check that the included lemmas exist in the source data."
    );
    return {
      slug: review.slug,
      root: review.root,
      success: false,
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: includedLemmas.length,
      errors,
      warnings,
    };
  }

  // Compute distinct ayat
  const ayahSet = new Set<string>();
  for (const record of matchingRecords) {
    ayahSet.add(`${record.ref.surah}:${record.ref.ayah}`);
  }

  // Check for duplicates (same surah:ayah:wordPosition)
  const positionMap = new Map<string, number>();
  for (const record of matchingRecords) {
    const key = `${record.ref.surah}:${record.ref.ayah}:${record.wordPosition}`;
    positionMap.set(key, (positionMap.get(key) ?? 0) + 1);
  }
  const duplicates = [...positionMap.entries()].filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    warnings.push(
      `${duplicates.length} duplicate word positions detected in activated records.`
    );
  }

  // Verify no excluded lemmas leaked in
  const excludedLemmas = review.lemmaRecords
    .filter((lr) => lr.reviewerDecision === "exclude")
    .map((lr) => lr.lemma);
  const excludedSet = new Set(excludedLemmas);
  let leakedExcluded = 0;
  for (const record of matchingRecords) {
    if (record.lemma && excludedSet.has(record.lemma)) {
      leakedExcluded++;
    }
  }
  if (leakedExcluded > 0) {
    errors.push(
      `${leakedExcluded} occurrences match excluded lemmas — activation integrity failure.`
    );
    return {
      slug: review.slug,
      root: review.root,
      success: false,
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: includedLemmas.length,
      errors,
      warnings,
    };
  }

  // Verify root association
  let wrongRoot = 0;
  for (const record of matchingRecords) {
    if (record.root !== rootString) wrongRoot++;
  }
  if (wrongRoot > 0) {
    errors.push(
      `${wrongRoot} occurrences have incorrect root association.`
    );
    return {
      slug: review.slug,
      root: review.root,
      success: false,
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: includedLemmas.length,
      errors,
      warnings,
    };
  }

  return {
    slug: review.slug,
    root: review.root,
    success: true,
    occurrenceCount: matchingRecords.length,
    distinctAyahCount: ayahSet.size,
    includedLemmaCount: includedLemmas.length,
    errors: [],
    warnings,
  };
}

/**
 * Build the occurrence index entries for an activated root.
 * Returns the data needed to write a populated occurrence file.
 *
 * @param review - The approved root review decision.
 * @param allRecords - All word-level morphology records.
 * @returns Array of occurrence entries matching the RootOccurrence shape.
 */
export function buildActivatedOccurrences(
  review: RootReviewDecision,
  allRecords: MorphologyRecord[]
): Array<{
  ref: { surah: number; ayah: number };
  matchedToken: string;
  matchedLemma: string;
  matchedRoot: string;
  wordPosition?: number;
}> {
  const includedLemmas = deriveIncludedLemmas(review);
  const lemmaSet = new Set(includedLemmas);
  const rootString = review.root;

  const matchingRecords = allRecords.filter((record) => {
    if (record.root !== rootString) return false;
    if (!record.lemma) return false;
    if (!lemmaSet.has(record.lemma)) return false;
    return true;
  });

  // Sort deterministically by surah, ayah, wordPosition
  return matchingRecords
    .sort((a, b) => {
      if (a.ref.surah !== b.ref.surah) return a.ref.surah - b.ref.surah;
      if (a.ref.ayah !== b.ref.ayah) return a.ref.ayah - b.ref.ayah;
      return (a.wordPosition ?? 0) - (b.wordPosition ?? 0);
    })
    .map((record) => ({
      ref: record.ref,
      matchedToken: record.token,
      matchedLemma: record.lemma!,
      matchedRoot: record.root!,
      wordPosition: record.wordPosition,
    }));
}
