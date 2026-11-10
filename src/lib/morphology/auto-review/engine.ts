// Sprint 47 — Automated Morphology Review Engine
//
// Orchestrates the three-layer review pipeline:
//   Layer A: Deterministic validation (structural checks + compatibility)
//   Layer B: AI-assisted analysis (provider-independent, currently unconfigured)
//   Layer C: Decision engine (deterministic policy rules)
//
// This module is PURE — it does not read from or write to the filesystem.
// The caller provides morphology records and receives review results.
//
// The engine processes roots in batches. For Sprint 47, the initial scope is
// the 10 manual roots, but the engine is designed to handle all 1,642
// discovered roots in a batch dry-run.

import type { MorphologyRecord } from "../types";
import {
  AUTOMATED_MORPHOLOGY_REVIEW_POLICY,
  type LemmaAutoReviewRecord,
  type RootAutoReviewResult,
  type AutomatedMorphologyReviewArtifact,
  type ReviewerOverride,
  AUTO_REVIEW_SCHEMA_VERSION,
} from "./types";
import {
  classifyCompatibility,
  runStructuralChecks,
  type EngineRecord,
} from "./deterministic";
import { detectAiProvider } from "./ai-interface";
import { decideOutcome, type DecisionInput } from "./decision";
import { getEffectiveOutcome } from "./overrides";

/**
 * Process a single root: evaluate all its lemmas through the three-layer pipeline.
 *
 * @param rootSlug - The root's slug identifier.
 * @param root - The Arabic root string.
 * @param allRecords - All word-level morphology records (already filtered to wordPosition !== undefined).
 * @param overrides - Optional reviewer overrides keyed by lemma string.
 * @param sourceDataset - Source dataset identifier.
 * @returns RootAutoReviewResult with per-lemma review records and summary.
 */
export function reviewRoot(
  rootSlug: string,
  root: string,
  allRecords: MorphologyRecord[],
  overrides: Map<string, ReviewerOverride> = new Map(),
  sourceDataset: string = "qul-morphology-v1"
): RootAutoReviewResult {
  // Filter records for this root
  const rootRecords = allRecords.filter((r) => r.root === root);

  // Group by lemma
  const lemmaGroups = new Map<string, EngineRecord[]>();
  for (const record of rootRecords) {
    if (!record.lemma) continue;
    if (!lemmaGroups.has(record.lemma)) {
      lemmaGroups.set(record.lemma, []);
    }
    lemmaGroups.get(record.lemma)!.push(record);
  }

  const lemmaRecords: LemmaAutoReviewRecord[] = [];
  let autoAccepted = 0;
  let needsReview = 0;
  let rejected = 0;
  let reviewerOverrides = 0;
  let totalOccurrences = 0;

  const ayahSet = new Set<string>();

  for (const [lemma, records] of lemmaGroups.entries()) {
    // Layer A: Deterministic checks
    const structuralChecks = runStructuralChecks(records);
    const { result: compatibilityResult, detail: compatibilityDetail } =
      classifyCompatibility(root, lemma);

    // Layer B: AI analysis (currently returns null — no provider configured)
    // We call it synchronously here for the interface; in production this
    // would be awaited. Since no provider exists, it returns null immediately.
    const aiRecommendation = null; // analyzeWithAi() is async; placeholder for sync context

    // Layer C: Decision
    const decisionInput: DecisionInput = {
      hasSourceRecords: records.length > 0,
      structuralChecks,
      compatibilityResult,
      aiRecommendation,
      rootHasWeakLetters: compatibilityDetail.rootHasWeakLetters,
    };

    const decision = decideOutcome(decisionInput);

    // Apply reviewer override if present
    const override = overrides.get(lemma) ?? null;
    const effectiveOutcome = getEffectiveOutcome(decision.outcome, override);
    if (override) reviewerOverrides++;

    // Count outcomes
    if (effectiveOutcome === "auto-accepted") autoAccepted++;
    else if (effectiveOutcome === "needs-review") needsReview++;
    else rejected++;

    totalOccurrences += records.length;
    for (const r of records) {
      ayahSet.add(`${r.ref.surah}:${r.ref.ayah}`);
    }

    // Build sample word locations (up to 10)
    const sampleLocations = records.slice(0, 10).map(
      (r) => `${r.ref.surah}:${r.ref.ayah}:${r.wordPosition ?? "?"}`
    );

    lemmaRecords.push({
      root,
      rootSlug,
      lemma,
      sourceLemmaId: null, // QUL v1 does not provide lemma IDs
      sourceDataset,
      sourceOccurrenceCount: records.length,
      sourceWordLocations: sampleLocations,
      deterministicChecks: structuralChecks,
      compatibilityResult,
      compatibilityDetail,
      aiRecommendation,
      outcome: effectiveOutcome,
      reasonCodes: decision.reasonCodes,
      explanation: decision.explanation,
      policyVersion: AUTOMATED_MORPHOLOGY_REVIEW_POLICY,
      reviewerOverride: override,
      reviewedAt: new Date().toISOString(),
    });
  }

  return {
    slug: rootSlug,
    root,
    lemmas: lemmaRecords,
    summary: {
      totalLemmas: lemmaRecords.length,
      autoAccepted,
      needsReview,
      rejected,
      reviewerOverrides,
      totalOccurrences,
      distinctAyat: ayahSet.size,
    },
  };
}

/**
 * Process multiple roots and produce the complete review artifact.
 *
 * @param roots - Array of { slug, root } to process.
 * @param allRecords - All word-level morphology records.
 * @param overrides - Optional per-root override maps.
 * @param sourceDataset - Source dataset identifier.
 * @returns The complete AutomatedMorphologyReviewArtifact.
 */
export function reviewRoots(
  roots: Array<{ slug: string; root: string }>,
  allRecords: MorphologyRecord[],
  overrides: Map<string, Map<string, ReviewerOverride>> = new Map(),
  sourceDataset: string = "qul-morphology-v1"
): AutomatedMorphologyReviewArtifact {
  const rootResults: RootAutoReviewResult[] = [];

  let totalLemmas = 0;
  let totalAutoAccepted = 0;
  let totalNeedsReview = 0;
  let totalRejected = 0;
  let totalReviewerOverrides = 0;

  for (const { slug, root } of roots) {
    const rootOverrides = overrides.get(slug) ?? new Map();
    const result = reviewRoot(slug, root, allRecords, rootOverrides, sourceDataset);
    rootResults.push(result);

    totalLemmas += result.summary.totalLemmas;
    totalAutoAccepted += result.summary.autoAccepted;
    totalNeedsReview += result.summary.needsReview;
    totalRejected += result.summary.rejected;
    totalReviewerOverrides += result.summary.reviewerOverrides;
  }

  return {
    schemaVersion: AUTO_REVIEW_SCHEMA_VERSION,
    policyVersion: AUTOMATED_MORPHOLOGY_REVIEW_POLICY,
    generatedAt: new Date().toISOString(),
    sourceDataset,
    aiProvider: detectAiProvider(),
    roots: rootResults,
    globalSummary: {
      totalRootsProcessed: rootResults.length,
      totalLemmasEvaluated: totalLemmas,
      totalAutoAccepted,
      totalNeedsReview,
      totalRejected,
      totalReviewerOverrides,
    },
  };
}

/**
 * Extract the lemmas eligible for activation (auto-accepted or overridden to auto-accepted).
 *
 * @param rootResult - The review result for one root.
 * @returns Array of lemma strings eligible for activation.
 */
export function getActivatableLemmas(rootResult: RootAutoReviewResult): string[] {
  return rootResult.lemmas
    .filter((lr) => lr.outcome === "auto-accepted")
    .map((lr) => lr.lemma)
    .sort();
}
