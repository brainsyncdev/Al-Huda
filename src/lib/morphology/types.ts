// Morphology record model — typed schema for Quranic Arabic morphology data.
//
// This module defines the shape of morphology records that will be populated
// once a validated dataset (QUL morphology or Quranic Arabic Corpus) is
// integrated. It does NOT contain any actual morphology data.
//
// DESIGN PRINCIPLES:
//
//   1. Every record references an existing ayah via AyahRef (surah, ayah).
//   2. Word/segment references are optional — some sources provide them,
//      others only provide ayah-level root/lemma assignments.
//   3. Arabic tokens are compared without altering canonical Quran text.
//      The `token` field is the surface form as it appears in the source;
//      the `canonicalArabic` field is the verbatim text from the pinned
//      dataset (quran-json or word-data). They may differ due to
//      tokenization or diacritics, and the discrepancy is reported, not
//      silently repaired.
//   4. Root and lemma are distinct fields — never treated as interchangeable.
//   5. Every record carries source provenance (which dataset, which version).
//   6. Part of speech is optional — some sources provide it, others don't.
//
// STATUS: schema only, no data populated yet. Sprint 37 Phase 2 blocked on
// morphology data access (see SPRINT-37-REPORT.md).

import type { AyahRef } from "@/lib/quran/types";

/**
 * One morphology record: a word/segment with its root, lemma, and optional
 * part-of-speech tag. References an ayah and optionally a word position.
 */
export interface MorphologyRecord {
  /** Ayah reference (surah, ayah). Must resolve to an existing ayah. */
  ref: AyahRef;
  /**
   * Word/segment position within the ayah (1-based). Optional because some
   * sources provide ayah-level root/lemma assignments without word positions.
   */
  wordPosition?: number;
  /**
   * Surface form (token) as it appears in the source dataset. May differ
   * from canonicalArabic due to tokenization or diacritics.
   */
  token: string;
  /**
   * Canonical Arabic text from the pinned dataset (quran-json or word-data).
   * Never altered. Used for alignment validation.
   */
  canonicalArabic: string;
  /**
   * Root (e.g., "ص-ب-ر"). Optional because some records may not have a root
   * (e.g., particles, pronouns).
   */
  root?: string;
  /**
   * Lemma (dictionary form, e.g., "صَبَرَ"). Optional because some sources
   * provide only roots.
   */
  lemma?: string;
  /**
   * Part of speech (e.g., "verb", "noun", "particle"). Optional because
   * some sources don't provide POS tags.
   */
  partOfSpeech?: string;
  /**
   * Source identifier — which dataset this record came from (e.g.,
   * "qul-morphology-v1", "corpus-quran-v0.4").
   */
  sourceId: string;
}

/**
 * Source provenance for a morphology dataset. Records which dataset was used,
 * its version, retrieval date, and license.
 */
export interface MorphologySource {
  /** Stable identifier for this source (e.g., "qul-morphology-v1"). */
  id: string;
  /** Human-readable name (e.g., "Quranic Universal Library Morphology"). */
  name: string;
  /** Version or retrieval date (e.g., "v1.0, retrieved 2026-10-25"). */
  version: string;
  /** License (e.g., "MIT", "GPL", "CC-BY-4.0"). */
  license: string;
  /** Upstream source attribution (e.g., "Tarteel AI", "Corpus.quran.com"). */
  attribution: string;
  /** Homepage or download URL. */
  homepage: string;
  /**
   * Notes about the source — any caveats, known issues, or licensing
   * concerns. For example, "GPL license requires attribution; commercial
   * use not yet cleared for Al-Huda Pro tier."
   */
  notes?: string;
}

/**
 * Validation result for a morphology record. Reports whether the record
 * is valid, and if not, what the issue is.
 */
export interface MorphologyValidationResult {
  /** Whether the record passed all validation checks. */
  valid: boolean;
  /** List of issues found. Empty if valid. */
  issues: MorphologyValidationIssue[];
}

/**
 * A single validation issue.
 */
export interface MorphologyValidationIssue {
  /** Issue code (e.g., "invalid-ayah-ref", "token-mismatch"). */
  code: string;
  /** Human-readable message. */
  message: string;
  /**
   * Severity: "error" means the record cannot be used; "warning" means
   * the record can be used but there's a discrepancy worth noting.
   */
  severity: "error" | "warning";
}

/**
 * Discrepancy report for a morphology import. Counts records by status
 * and lists specific mismatches.
 */
export interface MorphologyDiscrepancyReport {
  /** Total records in the import. */
  totalRecords: number;
  /** Records that passed all validation checks. */
  validRecords: number;
  /** Records with at least one error-level issue. */
  invalidRecords: number;
  /** Records with warnings but no errors. */
  warningRecords: number;
  /** Count of records with missing ayah references. */
  missingAyahRefs: number;
  /** Count of records with token/canonical mismatches. */
  tokenMismatches: number;
  /** Count of duplicate records (same ref + wordPosition + token). */
  duplicates: number;
  /** Count of records with no root field. */
  noRoot: number;
  /** Count of records with no lemma field. */
  noLemma: number;
  /**
   * Sample issues (up to 50) for debugging. Each entry is a record index
   * and the first issue found.
   */
  sampleIssues: Array<{
    recordIndex: number;
    issue: MorphologyValidationIssue;
  }>;
}
