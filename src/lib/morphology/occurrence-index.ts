// Ayah-level occurrence index for root-based topic discovery.
//
// Maps allowlisted roots to the ayat in which the morphology source
// identifies those roots. This module provides the types and builder
// function; the actual data depends on a morphology dataset being
// integrated (blocked — see SPRINT-37-REPORT.md).
//
// DESIGN PRINCIPLES:
//
//   1. Preserve canonical Arabic Quran text unchanged.
//   2. Show the matched Arabic word or form on each result.
//   3. Label results as "verses in which the word/root occurs" — never
//      "verses about X".
//   4. No word-level highlighting (requires alignment validator first).
//   5. No new scholarly classifications.
//   6. Existing 11 curated topics remain unchanged and separate.

import type { AyahRef } from "@/lib/quran/types";
import type { MorphologyRecord } from "./types";
import type { RootTopicEntry } from "./root-allowlist";

/**
 * One occurrence of a root in an ayah. Records the matched word form
 * and the ayah reference.
 */
export interface RootOccurrence {
  /** Ayah reference. */
  ref: AyahRef;
  /**
   * The matched surface form (token) as it appears in the ayah. This is
   * the word the reader will see highlighted or listed.
   */
  matchedToken: string;
  /**
   * The lemma that matched (from includedLemmas). Useful for showing
   * which specific form was found.
   */
  matchedLemma: string;
  /**
   * The root that matched. For root-set topics, this identifies which
   * root in the set was found.
   */
  matchedRoot: string;
  /**
   * Word position within the ayah (1-based). Optional — some sources
   * don't provide word positions.
   */
  wordPosition?: number;
}

/**
 * The occurrence index for one root-topic entry. Maps the topic to all
 * ayat in which its roots/lemmas occur.
 */
export interface RootTopicIndex {
  /** The root-topic entry this index was built from. */
  entry: RootTopicEntry;
  /**
   * Occurrences for the current page (after pagination). If no pagination
   * parameters were provided, this contains all occurrences.
   */
  occurrences: RootOccurrence[];
  /**
   * Unique ayah references (deduplicated) for the current page. An ayah may
   * have multiple occurrences of the same root; this list has each ayah once.
   */
  uniqueAyahs: AyahRef[];
  /**
   * Total occurrence count for the current page (after pagination). May be
   * less than totalMatches if pagination is applied.
   */
  totalOccurrences: number;
  /**
   * Total matches across all pages BEFORE pagination. This is the true count
   * of all occurrences that match the root/lemma criteria, regardless of
   * pagination. Use this to show "Showing 50 of 237 matches" in the UI.
   */
  totalMatches: number;
  /**
   * Pagination metadata. Null if no pagination was applied (all results shown).
   */
  pagination: {
    offset: number;
    limit: number;
    hasMore: boolean;
  } | null;
}

/**
 * Build an occurrence index for one root-topic entry from a set of
 * morphology records. Filters records by the entry's roots and
 * includedLemmas.
 *
 * This function is pure — it doesn't read from any global state or
 * filesystem. The caller provides the morphology records.
 *
 * Pagination:
 *   - If `offset` and `limit` are provided, returns a paginated subset.
 *   - `totalMatches` always reflects the true count before pagination.
 *   - `entry.maxResults` is deprecated — use pagination parameters instead.
 *     If maxResults is set and no pagination params are provided, it acts
 *     as a limit for backward compatibility, but totalMatches still shows
 *     the true count.
 */
export function buildRootTopicIndex(
  entry: RootTopicEntry,
  records: MorphologyRecord[],
  pagination?: { offset?: number; limit?: number }
): RootTopicIndex {
  const allOccurrences: RootOccurrence[] = [];
  const allAyahSet = new Map<string, AyahRef>();

  const rootSet = new Set(entry.roots);
  const lemmaSet = new Set(entry.includedLemmas);

  for (const record of records) {
    // Skip records without a root
    if (!record.root) continue;

    // Check if this record's root is in the entry's root set
    if (!rootSet.has(record.root)) continue;

    // Check if this record's lemma is in the entry's included lemmas
    // If includedLemmas is empty, skip all records (nothing approved yet)
    if (lemmaSet.size === 0) continue;
    if (!record.lemma || !lemmaSet.has(record.lemma)) continue;

    allOccurrences.push({
      ref: record.ref,
      matchedToken: record.token,
      matchedLemma: record.lemma,
      matchedRoot: record.root,
      wordPosition: record.wordPosition,
    });

    const key = `${record.ref.surah}:${record.ref.ayah}`;
    if (!allAyahSet.has(key)) {
      allAyahSet.set(key, record.ref);
    }
  }

  const totalMatches = allOccurrences.length;

  // Apply pagination if provided
  let paginatedOccurrences = allOccurrences;
  let paginatedAyahSet = allAyahSet;
  let paginationMeta: { offset: number; limit: number; hasMore: boolean } | null = null;

  if (pagination && (pagination.offset !== undefined || pagination.limit !== undefined)) {
    const offset = pagination.offset ?? 0;
    const limit = pagination.limit ?? totalMatches;
    paginatedOccurrences = allOccurrences.slice(offset, offset + limit);
    
    // Rebuild ayah set for paginated results
    paginatedAyahSet = new Map<string, AyahRef>();
    for (const occ of paginatedOccurrences) {
      const key = `${occ.ref.surah}:${occ.ref.ayah}`;
      if (!paginatedAyahSet.has(key)) {
        paginatedAyahSet.set(key, occ.ref);
      }
    }

    paginationMeta = {
      offset,
      limit,
      hasMore: offset + limit < totalMatches,
    };
  } else if (entry.maxResults !== undefined) {
    // Backward compatibility: maxResults acts as a limit
    paginatedOccurrences = allOccurrences.slice(0, entry.maxResults);
    paginatedAyahSet = new Map<string, AyahRef>();
    for (const occ of paginatedOccurrences) {
      const key = `${occ.ref.surah}:${occ.ref.ayah}`;
      if (!paginatedAyahSet.has(key)) {
        paginatedAyahSet.set(key, occ.ref);
      }
    }
    paginationMeta = {
      offset: 0,
      limit: entry.maxResults,
      hasMore: entry.maxResults < totalMatches,
    };
  }

  return {
    entry,
    occurrences: paginatedOccurrences,
    uniqueAyahs: Array.from(paginatedAyahSet.values()),
    totalOccurrences: paginatedOccurrences.length,
    totalMatches,
    pagination: paginationMeta,
  };
}

/**
 * Build occurrence indices for all enabled root-topic entries.
 */
export function buildAllRootTopicIndices(
  entries: RootTopicEntry[],
  records: MorphologyRecord[]
): RootTopicIndex[] {
  return entries.map((entry) => buildRootTopicIndex(entry, records));
}
