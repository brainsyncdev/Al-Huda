// Batch eligibility engine — evaluates all discovered roots through Policy B
// while preserving existing manual decisions.
//
// DESIGN PRINCIPLES:
//   1. Deterministic: same input → byte-identical output (stable ordering, no timestamps)
//   2. Manual-preserving: existing ROOT_ALLOWLIST entries are never overwritten
//   3. Policy B compliant: missing lemmas disclosed but don't block when alignment valid
//   4. Separation-preserving: occurrence validity (dimension 1) separate from lemma
//      selection (dimension 2) and thematic classification (dimension 3)
//   5. Per-root isolation: one failed root doesn't corrupt others
//
// OUTPUT:
//   - BatchEligibilityResult: per-root eligibility with reasons
//   - PublicationDecision[]: publish/needs-review/blocked per root

import type { MorphologyRecord } from "./types";
import type { RootCandidate } from "./root-discovery";
import type { RootTopicEntry } from "./root-allowlist";
import {
  extractRootRecords,
  validateRootRecords,
  computeLemmaDistribution,
  type ValidationIssue,
} from "./review-pipeline";
import {
  reviewLemmasDeterministic,
  type AiLemmaReviewResult,
} from "./ai-lemma-reviewer";
import {
  decidePublication,
  type PublicationDecision,
  PUBLICATION_POLICY_VERSION,
} from "./publication-policy";

/**
 * Result of batch eligibility evaluation for one root.
 */
export interface RootEligibilityResult {
  /** Root slug (Arabic root string). */
  slug: string;
  /** Arabic root. */
  root: string;
  /** Whether this root is eligible for publication. */
  eligible: boolean;
  /** Publication decision. */
  decision: PublicationDecision;
  /** Validation issues found. */
  validationIssues: ValidationIssue[];
  /** AI lemma review result. */
  aiReview: AiLemmaReviewResult;
  /** Whether this root matched an existing manual entry. */
  matchedManualEntry: boolean;
  /** Manual entry slug if matched. */
  manualEntrySlug?: string;
  /** Reason for blocking if not eligible. */
  blockReason?: string;
}

/**
 * Result of batch eligibility evaluation for all roots.
 */
export interface BatchEligibilityResult {
  /** Total roots evaluated. */
  totalEvaluated: number;
  /** Roots eligible for publication. */
  eligibleCount: number;
  /** Roots blocked from publication. */
  blockedCount: number;
  /** Roots that matched existing manual entries. */
  manualMatchCount: number;
  /** Per-root eligibility results. */
  results: RootEligibilityResult[];
  /** Publication decisions for all roots. */
  decisions: PublicationDecision[];
}

/**
 * Create a synthetic RootTopicEntry for a discovered root candidate.
 * Used when no existing manual entry matches.
 */
function createSyntheticEntry(candidate: RootCandidate): RootTopicEntry {
  return {
    slug: candidate.slug,
    title: `Root: ${candidate.root}`,
    arabicTitle: candidate.root,
    roots: [candidate.root],
    includedLemmas: [], // Empty — never auto-approve lemmas
    reviewState: "pending-review",
    assertedBy: "automated-discovery (no scholarly review)",
    assertedAt: "2026-11-02", // Sprint 44 date
  };
}

/**
 * Find an existing manual entry that matches a discovered root candidate.
 * Matches by slug (if candidate.slug matches entry.slug) OR by root
 * (if candidate.root matches entry.roots[0]).
 */
function findMatchingManualEntry(
  candidate: RootCandidate,
  existingEntries: RootTopicEntry[]
): RootTopicEntry | undefined {
  // Match by slug first
  const bySlug = existingEntries.find((e) => e.slug === candidate.slug);
  if (bySlug) return bySlug;

  // Match by root
  return existingEntries.find((e) => e.roots[0] === candidate.root);
}

/**
 * Evaluate batch eligibility for all discovered roots.
 *
 * For each candidate:
 * 1. Extract word-level records
 * 2. Run validation
 * 3. Check Policy B eligibility
 * 4. If matches existing manual entry, preserve manual fields
 * 5. Generate PublicationDecision
 *
 * @param candidates - Discovered root candidates from discoverAllRoots()
 * @param index - Morphology records
 * @param existingEntries - Existing ROOT_ALLOWLIST entries to preserve
 * @returns Batch eligibility result with per-root decisions
 */
export function evaluateBatchEligibility(
  candidates: RootCandidate[],
  index: MorphologyRecord[],
  existingEntries: RootTopicEntry[]
): BatchEligibilityResult {
  const results: RootEligibilityResult[] = [];
  const decisions: PublicationDecision[] = [];

  let eligibleCount = 0;
  let blockedCount = 0;
  let manualMatchCount = 0;

  for (const candidate of candidates) {
    try {
      // Find matching manual entry
      const manualEntry = findMatchingManualEntry(candidate, existingEntries);
      const matchedManualEntry = manualEntry !== undefined;

      if (matchedManualEntry) {
        manualMatchCount++;
      }

      // Use manual entry if exists, else create synthetic
      const entry = manualEntry ?? createSyntheticEntry(candidate);

      // Extract word-level records for this root
      const records = extractRootRecords(index, candidate.root);

      // Validate records
      const validationIssues = validateRootRecords(records, candidate.root);

      // Compute lemma distribution
      const lemmaDistribution = computeLemmaDistribution(records);

      // AI lemma review (deterministic fallback)
      const aiReview = reviewLemmasDeterministic(
        entry,
        records,
        lemmaDistribution
      );

      // Check publication eligibility (Policy B)
      const decision = decidePublication(
        entry,
        records,
        validationIssues,
        aiReview
      );

      const eligible = decision.decision === "publish";

      if (eligible) {
        eligibleCount++;
      } else {
        blockedCount++;
      }

      results.push({
        slug: candidate.slug,
        root: candidate.root,
        eligible,
        decision,
        validationIssues,
        aiReview,
        matchedManualEntry,
        manualEntrySlug: manualEntry?.slug,
        blockReason: eligible
          ? undefined
          : decision.reasons[0] ?? "Unknown reason",
      });

      decisions.push(decision);
    } catch (error) {
      // Per-root isolation: one failed root doesn't corrupt others
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      results.push({
        slug: candidate.slug,
        root: candidate.root,
        eligible: false,
        decision: {
          slug: candidate.slug,
          root: candidate.root,
          decision: "needs-review",
          reasons: [`Eligibility evaluation failed: ${errorMessage}`],
          includedLemmas: [],
          ambiguityFlags: [],
          incompatibleLemmas: [],
          missingLemmaCount: 0,
          totalWordRecords: 0,
          recordsWithLemma: 0,
          lemmaCoverageRatio: 0,
          occurrenceAlignmentStatus: "unknown",
          coverageDisclosure: "",
          decidedBy: "automated-policy",
          policyVersion: PUBLICATION_POLICY_VERSION,
        },
        validationIssues: [],
        aiReview: {
          recommendedLemmas: [],
          selectionMode: "full-set",
          rationale: "Evaluation failed",
          evidence: [],
          reviewer: "deterministic-fallback",
          warnings: [errorMessage],
          selectionRequired: true,
        },
        matchedManualEntry: false,
        blockReason: `Evaluation error: ${errorMessage}`,
      });

      blockedCount++;
    }
  }

  return {
    totalEvaluated: candidates.length,
    eligibleCount,
    blockedCount,
    manualMatchCount,
    results,
    decisions,
  };
}
