// Sprint 47 — Activation Integration
//
// Consumes the automated morphology review artifact and generates populated
// occurrence indexes for auto-accepted lemmas. This module bridges the
// automated review engine (Sprint 47) with the existing occurrence-index
// system (Sprint 44-46).
//
// ACTIVATION RULES (from Sprint 47 spec §10):
//   1. Only auto-accepted mappings can be activated automatically.
//   2. Explicit reviewer overrides to auto-accepted may also be activated.
//   3. needs-review mappings remain excluded until resolved.
//   4. rejected mappings remain excluded.
//   5. Every included lemma must have source-backed records.
//   6. Preserve exact surah, ayah, and word positions.
//   7. Calculate actual occurrence counts.
//   8. Calculate distinct ayah counts.
//   9. Preserve missing-lemma coverage disclosures.
//  10. Preserve Policy B v2.0.0.
//  11. Verify no duplicate or phantom occurrences.
//  12. Generate occurrence indexes deterministically.
//  13. Preserve pagination.
//  14. Write outputs atomically.
//
// This module is PURE — it does not read from or write to the filesystem.
// The caller provides the artifact and morphology records, and receives
// the occurrence data to write.

import type { MorphologyRecord } from "../types";
import type {
  AutomatedMorphologyReviewArtifact,
  RootAutoReviewResult,
} from "./types";

/**
 * The shape of an occurrence index entry, matching the existing format
 * used by data/root-occurrences/*.json.
 */
export interface OccurrenceIndexEntry {
  slug: string;
  title: string;
  arabicTitle: string;
  roots: string[];
  includedLemmas: string[];
  maxResults: number | undefined;
  reviewState: "approved" | "auto-accepted";
  assertedBy: string;
  assertedAt: string;
  notes: string;
}

/**
 * One occurrence record in the index.
 */
export interface OccurrenceRecord {
  ref: { surah: number; ayah: number };
  matchedToken: string;
  matchedLemma: string;
  matchedRoot: string;
  wordPosition?: number;
}

/**
 * The complete occurrence index for one root.
 */
export interface OccurrenceIndex {
  entry: OccurrenceIndexEntry;
  occurrences: OccurrenceRecord[];
  uniqueAyahs: Array<{ surah: number; ayah: number }>;
  totalOccurrences: number;
  totalMatches: number;
  pagination: null;
}

/**
 * Activation result for one root.
 */
export interface ActivationResult {
  slug: string;
  root: string;
  success: boolean;
  occurrenceCount: number;
  distinctAyahCount: number;
  includedLemmaCount: number;
  errors: string[];
  warnings: string[];
}

/**
 * Activate one root: filter morphology records by auto-accepted lemmas
 * and produce the occurrence index data.
 *
 * @param rootResult - The review result for one root.
 * @param allRecords - All word-level morphology records.
 * @param title - English title for the root.
 * @param arabicTitle - Arabic title for the root.
 * @returns OccurrenceIndex data, or null if activation failed.
 */
export function activateRoot(
  rootResult: RootAutoReviewResult,
  allRecords: MorphologyRecord[],
  title: string,
  arabicTitle: string
): { index: OccurrenceIndex | null; result: ActivationResult } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Extract auto-accepted lemmas
  const includedLemmas = rootResult.lemmas
    .filter((lr) => lr.outcome === "auto-accepted")
    .map((lr) => lr.lemma)
    .sort();

  if (includedLemmas.length === 0) {
    errors.push("No auto-accepted lemmas — cannot activate an empty set.");
    return {
      index: null,
      result: {
        slug: rootResult.slug,
        root: rootResult.root,
        success: false,
        occurrenceCount: 0,
        distinctAyahCount: 0,
        includedLemmaCount: 0,
        errors,
        warnings,
      },
    };
  }

  const lemmaSet = new Set(includedLemmas);
  const rootString = rootResult.root;

  // Filter records: must match root AND have an auto-accepted lemma
  const matchingRecords = allRecords.filter((record) => {
    if (record.root !== rootString) return false;
    if (!record.lemma) return false;
    if (!lemmaSet.has(record.lemma)) return false;
    return true;
  });

  // Check for zero occurrences
  if (matchingRecords.length === 0) {
    errors.push(
      `Root "${rootResult.slug}" has zero matching occurrences for auto-accepted lemmas. ` +
        "Check that the included lemmas exist in the source data."
    );
    return {
      index: null,
      result: {
        slug: rootResult.slug,
        root: rootResult.root,
        success: false,
        occurrenceCount: 0,
        distinctAyahCount: 0,
        includedLemmaCount: includedLemmas.length,
        errors,
        warnings,
      },
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

  // Verify no needs-review or rejected lemmas leaked in
  const excludedLemmas = rootResult.lemmas
    .filter((lr) => lr.outcome !== "auto-accepted")
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
      index: null,
      result: {
        slug: rootResult.slug,
        root: rootResult.root,
        success: false,
        occurrenceCount: 0,
        distinctAyahCount: 0,
        includedLemmaCount: includedLemmas.length,
        errors,
        warnings,
      },
    };
  }

  // Build occurrence records
  const occurrences: OccurrenceRecord[] = matchingRecords
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

  // Build unique ayahs
  const uniqueAyahs = [...ayahSet]
    .map((key) => {
      const [s, a] = key.split(":").map(Number);
      return { surah: s, ayah: a };
    })
    .sort((a, b) => {
      if (a.surah !== b.surah) return a.surah - b.surah;
      return a.ayah - b.ayah;
    });

  // Build the index entry
  const entry: OccurrenceIndexEntry = {
    slug: rootResult.slug,
    title,
    arabicTitle,
    roots: [rootResult.root],
    includedLemmas,
    maxResults: undefined,
    reviewState: "auto-accepted",
    assertedBy: "automated-morphology-review",
    assertedAt: new Date().toISOString().slice(0, 10),
    notes: `Activated via Sprint 47 automated morphology review. ${includedLemmas.length} lemmas auto-accepted by deterministic validation.`,
  };

  const index: OccurrenceIndex = {
    entry,
    occurrences,
    uniqueAyahs,
    totalOccurrences: occurrences.length,
    totalMatches: occurrences.length,
    pagination: null,
  };

  return {
    index,
    result: {
      slug: rootResult.slug,
      root: rootResult.root,
      success: true,
      occurrenceCount: occurrences.length,
      distinctAyahCount: ayahSet.size,
      includedLemmaCount: includedLemmas.length,
      errors: [],
      warnings,
    },
  };
}

/**
 * Activate multiple roots from a review artifact.
 *
 * @param artifact - The automated morphology review artifact.
 * @param allRecords - All word-level morphology records.
 * @param rootTitles - Map of slug → { title, arabicTitle }.
 * @returns Array of activation results and occurrence indexes.
 */
export function activateRoots(
  artifact: AutomatedMorphologyReviewArtifact,
  allRecords: MorphologyRecord[],
  rootTitles: Map<string, { title: string; arabicTitle: string }>
): Array<{ result: ActivationResult; index: OccurrenceIndex | null }> {
  const results: Array<{ result: ActivationResult; index: OccurrenceIndex | null }> = [];

  for (const rootResult of artifact.roots) {
    const titles = rootTitles.get(rootResult.slug);
    if (!titles) {
      results.push({
        result: {
          slug: rootResult.slug,
          root: rootResult.root,
          success: false,
          occurrenceCount: 0,
          distinctAyahCount: 0,
          includedLemmaCount: 0,
          errors: [`No title mapping found for slug "${rootResult.slug}"`],
          warnings: [],
        },
        index: null,
      });
      continue;
    }

    const { index, result } = activateRoot(rootResult, allRecords, titles.title, titles.arabicTitle);
    results.push({ result, index });
  }

  return results;
}
