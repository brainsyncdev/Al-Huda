// Batch review pipeline — processes candidate roots deterministically.
//
// DESIGN PRINCIPLES:
//   1. Deterministic: same input → byte-identical output (stable ordering, no timestamps)
//   2. Idempotent: safe to rerun without duplicate or inconsistent output
//   3. Provider-independent: AI reviewer interface with deterministic fallback
//   4. Evidence-backed: every recommendation carries supporting record references
//   5. Transparent: publication decisions are logged with reasons
//   6. Safe: dry-run mode shows proposed changes without modifying configuration
//
// PIPELINE STAGES:
//   1. Extract source records for each candidate root
//   2. Compute statistics (occurrences, ayat, lemma distribution)
//   3. Validate source data (alignment, duplicates, missing tokens)
//   4. AI-assisted lemma analysis (or deterministic fallback)
//   5. Publication eligibility check
//   6. Generate structured review result with evidence
//
// OUTPUT:
//   - RootReviewResult[]: per-root review with validation, AI recommendation, evidence
//   - PublicationDecision[]: publish/withhold/needs-review per root
//   - PipelineReport: summary with source fingerprint, pipeline version, counts

import { createHash } from "node:crypto";
import { readFileSync, existsSync } from "node:fs";
import type { MorphologyRecord } from "./types";
import type { RootTopicEntry } from "./root-allowlist";
import {
  reviewLemmasDeterministic,
  type AiLemmaReviewResult,
} from "./ai-lemma-reviewer";
import {
  checkPublicationEligibility,
  findIncompatibleLemmas,
  type PublicationDecision,
} from "./publication-policy";

/** Pipeline version — increment when logic changes. */
export const PIPELINE_VERSION = "1.0.0";

/** Source dataset identifier. */
export const SOURCE_DATASET_ID = "qul-morphology-v1";

export interface RootReviewResult {
  /** Root slug from ROOT_ALLOWLIST. */
  slug: string;
  /** Arabic root string (e.g., "صبر"). */
  root: string;
  /** English title. */
  title: string;
  /** Arabic title. */
  arabicTitle: string;
  /** Total word-level occurrences (excluding ayah-level markers). */
  totalOccurrences: number;
  /** Distinct ayat containing this root. */
  distinctAyat: number;
  /** Distinct lemmas observed. */
  lemmaCount: number;
  /** Lemma breakdown sorted by frequency (descending). */
  lemmaDistribution: Array<{ lemma: string; count: number }>;
  /** Representative ayat references (up to 10). */
  sampleAyat: Array<{ surah: number; ayah: number }>;
  /** Validation issues found (empty if all records valid). */
  validationIssues: ValidationIssue[];
  /** AI lemma review result (recommendation + evidence). */
  aiReview: AiLemmaReviewResult;
  /** Publication decision. */
  publication: PublicationDecision;
  /** SHA-256 fingerprint of source data (morphology-index.json). */
  sourceFingerprint: string;
  /** Pipeline version that produced this result. */
  pipelineVersion: string;
}

export interface ValidationIssue {
  /** Issue code (e.g., "missing-token", "duplicate-position"). */
  code: string;
  /** Human-readable message. */
  message: string;
  /** Severity: "error" blocks publication, "warning" is informational. */
  severity: "error" | "warning";
  /** Affected record references (up to 5). */
  affectedRecords: Array<{ surah: number; ayah: number; wordPosition?: number }>;
}

export interface PipelineReport {
  /** Pipeline version. */
  pipelineVersion: string;
  /** Source dataset identifier. */
  sourceDatasetId: string;
  /** SHA-256 fingerprint of source data. */
  sourceFingerprint: string;
  /** Total roots processed. */
  totalRoots: number;
  /** Roots published (decision = "publish"). */
  publishedCount: number;
  /** Roots withheld (decision = "withhold"). */
  withheldCount: number;
  /** Roots needing review (decision = "needs-review"). */
  needsReviewCount: number;
  /** Per-root review results. */
  results: RootReviewResult[];
  /** Publication decisions. */
  decisions: PublicationDecision[];
}

/**
 * Compute SHA-256 fingerprint of the morphology index file.
 * Used to detect source data changes and ensure reproducibility.
 */
export function computeSourceFingerprint(indexPath: string): string {
  if (!existsSync(indexPath)) {
    return "missing";
  }
  const data = readFileSync(indexPath, "utf-8");
  return createHash("sha256").update(data, "utf-8").digest("hex");
}

/**
 * Extract word-level records for a root from the morphology index.
 * Excludes ayah-level markers (records without wordPosition).
 */
export function extractRootRecords(
  records: MorphologyRecord[],
  root: string
): MorphologyRecord[] {
  return records
    .filter(
      (r) =>
        r.root === root &&
        r.wordPosition !== undefined &&
        r.wordPosition !== null
    )
    .sort((a, b) => {
      if (a.ref.surah !== b.ref.surah) return a.ref.surah - b.ref.surah;
      if (a.ref.ayah !== b.ref.ayah) return a.ref.ayah - b.ref.ayah;
      return (a.wordPosition ?? 0) - (b.wordPosition ?? 0);
    });
}

/**
 * Validate root records for alignment issues, duplicates, and missing data.
 */
export function validateRootRecords(
  records: MorphologyRecord[],
  root: string
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Check for missing tokens
  const missingTokenRecords = records.filter((r) => !r.token || r.token === "");
  if (missingTokenRecords.length > 0) {
    issues.push({
      code: "missing-token",
      message: `${missingTokenRecords.length} records have empty tokens`,
      severity: "warning",
      affectedRecords: missingTokenRecords.slice(0, 5).map((r) => ({
        surah: r.ref.surah,
        ayah: r.ref.ayah,
        wordPosition: r.wordPosition,
      })),
    });
  }

  // Check for missing lemmas
  const missingLemmaRecords = records.filter((r) => !r.lemma || r.lemma === "");
  if (missingLemmaRecords.length > 0) {
    issues.push({
      code: "missing-lemma",
      message: `${missingLemmaRecords.length} records have empty lemmas`,
      severity: "error",
      affectedRecords: missingLemmaRecords.slice(0, 5).map((r) => ({
        surah: r.ref.surah,
        ayah: r.ref.ayah,
        wordPosition: r.wordPosition,
      })),
    });
  }

  // Check for duplicate positions
  const positionMap = new Map<string, number>();
  for (const r of records) {
    const key = `${r.ref.surah}:${r.ref.ayah}:${r.wordPosition}`;
    positionMap.set(key, (positionMap.get(key) ?? 0) + 1);
  }
  const duplicates = [...positionMap.entries()].filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    issues.push({
      code: "duplicate-position",
      message: `${duplicates.length} duplicate word positions detected`,
      severity: "error",
      affectedRecords: duplicates.slice(0, 5).map(([key]) => {
        const [s, a, w] = key.split(":").map(Number);
        return { surah: s, ayah: a, wordPosition: w };
      }),
    });
  }

  // Check for incompatible lemma mappings (lemma cannot derive from root)
  const incompatible = findIncompatibleLemmas(records, root);
  if (incompatible.length > 0) {
    const incompatibleSet = new Set(incompatible.map((i) => i.lemma));
    const affected = records.filter(
      (r) => r.lemma !== undefined && incompatibleSet.has(r.lemma)
    );
    issues.push({
      code: "incompatible-lemma",
      message: `${incompatible.length} lemmas cannot derive from root ${root} — source mapping concern`,
      severity: "error",
      affectedRecords: affected.slice(0, 5).map((r) => ({
        surah: r.ref.surah,
        ayah: r.ref.ayah,
        wordPosition: r.wordPosition,
      })),
    });
  }

  return issues;
}

/**
 * Compute lemma distribution for a set of records.
 */
export function computeLemmaDistribution(
  records: MorphologyRecord[]
): Array<{ lemma: string; count: number }> {
  const counts = new Map<string, number>();
  for (const r of records) {
    if (r.lemma) {
      counts.set(r.lemma, (counts.get(r.lemma) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([lemma, count]) => ({ lemma, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.lemma.localeCompare(b.lemma);
    });
}

/**
 * Extract representative ayat references (up to 10).
 */
export function extractSampleAyat(
  records: MorphologyRecord[]
): Array<{ surah: number; ayah: number }> {
  const seen = new Set<string>();
  const samples: Array<{ surah: number; ayah: number }> = [];
  for (const r of records) {
    const key = `${r.ref.surah}:${r.ref.ayah}`;
    if (!seen.has(key)) {
      seen.add(key);
      samples.push({ surah: r.ref.surah, ayah: r.ref.ayah });
      if (samples.length >= 10) break;
    }
  }
  return samples;
}

/**
 * Review a single root: extract records, validate, analyze lemmas, check eligibility.
 */
export function reviewRoot(
  entry: RootTopicEntry,
  allRecords: MorphologyRecord[],
  sourceFingerprint: string
): RootReviewResult {
  const records = extractRootRecords(allRecords, entry.roots[0]);
  const validationIssues = validateRootRecords(records, entry.roots[0]);
  const lemmaDistribution = computeLemmaDistribution(records);
  const sampleAyat = extractSampleAyat(records);

  // AI lemma review (deterministic fallback)
  const aiReview = reviewLemmasDeterministic(entry, records, lemmaDistribution);

  // Publication eligibility
  const publication = checkPublicationEligibility(
    entry,
    records,
    validationIssues,
    aiReview
  );

  const distinctAyat = new Set(
    records.map((r) => `${r.ref.surah}:${r.ref.ayah}`)
  ).size;

  return {
    slug: entry.slug,
    root: entry.roots[0],
    title: entry.title,
    arabicTitle: entry.arabicTitle,
    totalOccurrences: records.length,
    distinctAyat,
    lemmaCount: lemmaDistribution.length,
    lemmaDistribution,
    sampleAyat,
    validationIssues,
    aiReview,
    publication,
    sourceFingerprint,
    pipelineVersion: PIPELINE_VERSION,
  };
}

/**
 * Run the batch review pipeline on all candidate roots.
 */
export function runBatchReview(
  candidates: RootTopicEntry[],
  indexPath: string
): PipelineReport {
  const allRecords: MorphologyRecord[] = existsSync(indexPath)
    ? JSON.parse(readFileSync(indexPath, "utf-8"))
    : [];
  const sourceFingerprint = computeSourceFingerprint(indexPath);

  const results: RootReviewResult[] = [];
  const decisions: PublicationDecision[] = [];

  for (const entry of candidates) {
    const result = reviewRoot(entry, allRecords, sourceFingerprint);
    results.push(result);
    decisions.push(result.publication);
  }

  const publishedCount = decisions.filter((d) => d.decision === "publish").length;
  const withheldCount = decisions.filter((d) => d.decision === "withhold").length;
  const needsReviewCount = decisions.filter(
    (d) => d.decision === "needs-review"
  ).length;

  return {
    pipelineVersion: PIPELINE_VERSION,
    sourceDatasetId: SOURCE_DATASET_ID,
    sourceFingerprint,
    totalRoots: candidates.length,
    publishedCount,
    withheldCount,
    needsReviewCount,
    results,
    decisions,
  };
}
