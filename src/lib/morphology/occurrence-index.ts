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
  /** All occurrences, grouped by ayah. */
  occurrences: RootOccurrence[];
  /**
   * Unique ayah references (deduplicated). An ayah may have multiple
   * occurrences of the same root; this list has each ayah once.
   */
  uniqueAyahs: AyahRef[];
  /** Total occurrence count (may be > uniqueAyahs.length). */
  totalOccurrences: number;
}

/**
 * Build an occurrence index for one root-topic entry from a set of
 * morphology records. Filters records by the entry's roots and
 * includedLemmas.
 *
 * This function is pure — it doesn't read from any global state or
 * filesystem. The caller provides the morphology records.
 */
export function buildRootTopicIndex(
  entry: RootTopicEntry,
  records: MorphologyRecord[]
): RootTopicIndex {
  const occurrences: RootOccurrence[] = [];
  const ayahSet = new Map<string, AyahRef>();

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

    occurrences.push({
      ref: record.ref,
      matchedToken: record.token,
      matchedLemma: record.lemma,
      matchedRoot: record.root,
      wordPosition: record.wordPosition,
    });

    const key = `${record.ref.surah}:${record.ref.ayah}`;
    if (!ayahSet.has(key)) {
      ayahSet.set(key, record.ref);
    }
  }

  // Apply maxResults cap if set
  const capped =
    entry.maxResults !== undefined
      ? occurrences.slice(0, entry.maxResults)
      : occurrences;

  return {
    entry,
    occurrences: capped,
    uniqueAyahs: Array.from(ayahSet.values()),
    totalOccurrences: capped.length,
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
