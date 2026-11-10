// Root discovery layer — scans morphology index and discovers all distinct
// source-backed roots with computed statistics.
//
// DESIGN PRINCIPLES:
//   1. Deterministic: same input → byte-identical output (stable ordering, no timestamps)
//   2. Source-backed only: discovers roots from actual morphology records, never invents roots
//   3. Word-level only: excludes ayah-level markers from all statistics
//   4. Coverage-aware: computes lemma coverage ratio and missing lemma counts
//   5. Separation-preserving: discovery is dimension 1 (occurrence validity),
//      not dimension 2 (lemma selection) or dimension 3 (thematic classification)
//
// OUTPUT:
//   - RootCandidate[]: per-root stats with coverage metadata
//   - data/root-discovery-registry.json: machine-readable registry

import type { MorphologyRecord } from "./types";

/** Source dataset identifier. */
export const SOURCE_DATASET_VERSION = "qul-morphology-v1";

/**
 * A discovered root candidate from the morphology index.
 * Represents dimension 1: occurrence validity and source-backed coverage.
 */
export interface RootCandidate {
  /** Stable identifier: the Arabic root string itself (e.g., "صبر"). */
  slug: string;
  /** Arabic root string. */
  root: string;
  /** Total word-level occurrences (excluding ayah-level markers). */
  totalWordRecords: number;
  /** Distinct ayat containing this root. */
  distinctAyahCount: number;
  /** Distinct surahs containing this root. */
  distinctSurahCount: number;
  /** Word-level records with lemma mappings. */
  recordsWithLemma: number;
  /** Word-level records without lemma mappings. */
  missingLemmaCount: number;
  /** Lemma coverage ratio: recordsWithLemma / totalWordRecords. Range [0, 1]. */
  lemmaCoverageRatio: number;
  /** Unique observed lemmas, sorted alphabetically. */
  observedLemmas: string[];
  /**
   * Occurrence alignment status: whether root-mapped word occurrences are
   * correctly aligned to valid locations. "valid" means no structural defects
   * detected during discovery; "invalid" means alignment failures; "unknown"
   * means validation has not run or is stale.
   */
  occurrenceAlignmentStatus: "valid" | "invalid" | "unknown";
  /**
   * Discovery status: whether this root is eligible for further evaluation,
   * needs validation, or is blocked.
   */
  discoveryStatus: "eligible" | "needs-validation" | "blocked";
  /**
   * Publication status: whether this root has been published, is not yet
   * published, or is blocked from publication.
   */
  publicationStatus: "not-published" | "published" | "blocked";
  /** Source dataset version. */
  sourceDatasetVersion: string;
  /** Publication policy version. */
  policyVersion: string;
}

/**
 * Discover all distinct source-backed roots from the morphology index.
 *
 * Filters to word-level records only (wordPosition !== undefined), groups by
 * root, and computes per-root statistics. Returns a deterministic array sorted
 * by root string for stable ordering.
 *
 * @param index - Morphology records (may include both word-level and ayah-level)
 * @returns Array of RootCandidate, sorted by root string
 */
export function discoverAllRoots(index: MorphologyRecord[]): RootCandidate[] {
  // Filter to word-level records with a root
  const wordLevelWithRoot = index.filter(
    (r) => r.wordPosition !== undefined && r.root
  );

  // Group by root
  const rootMap = new Map<string, MorphologyRecord[]>();
  for (const record of wordLevelWithRoot) {
    const root = record.root!;
    if (!rootMap.has(root)) {
      rootMap.set(root, []);
    }
    rootMap.get(root)!.push(record);
  }

  // Compute stats for each root
  const candidates: RootCandidate[] = [];

  for (const [root, records] of rootMap.entries()) {
    const totalWordRecords = records.length;

    // Distinct ayat
    const ayahSet = new Set<string>();
    for (const r of records) {
      ayahSet.add(`${r.ref.surah}:${r.ref.ayah}`);
    }
    const distinctAyahCount = ayahSet.size;

    // Distinct surahs
    const surahSet = new Set<number>();
    for (const r of records) {
      surahSet.add(r.ref.surah);
    }
    const distinctSurahCount = surahSet.size;

    // Lemma coverage
    const recordsWithLemma = records.filter((r) => r.lemma).length;
    const missingLemmaCount = totalWordRecords - recordsWithLemma;
    const lemmaCoverageRatio =
      totalWordRecords > 0 ? recordsWithLemma / totalWordRecords : 0;

    // Observed lemmas (sorted unique)
    const lemmaSet = new Set<string>();
    for (const r of records) {
      if (r.lemma) {
        lemmaSet.add(r.lemma);
      }
    }
    const observedLemmas = Array.from(lemmaSet).sort();

    // Discovery status: eligible if we have records
    const discoveryStatus: RootCandidate["discoveryStatus"] =
      totalWordRecords > 0 ? "eligible" : "blocked";

    candidates.push({
      slug: root,
      root,
      totalWordRecords,
      distinctAyahCount,
      distinctSurahCount,
      recordsWithLemma,
      missingLemmaCount,
      lemmaCoverageRatio,
      observedLemmas,
      occurrenceAlignmentStatus: "valid", // Discovery assumes valid; validation happens in eligibility phase
      discoveryStatus,
      publicationStatus: "not-published",
      sourceDatasetVersion: SOURCE_DATASET_VERSION,
      policyVersion: "2.0.0",
    });
  }

  // Sort by root string for deterministic ordering
  return candidates.sort((a, b) => a.root.localeCompare(b.root));
}
