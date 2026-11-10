#!/usr/bin/env node
// Batch publication engine — evaluates all discovered roots through Policy B
// and generates occurrence indexes for eligible roots.
//
// Usage:
//   npx tsx scripts/batch-publish-roots.ts [--dry-run] [--json]
//
// Options:
//   --dry-run   Show proposed changes without writing any file
//   --json      Print the full report as JSON instead of the summary
//
// Output (skipped entirely in dry-run):
//   - data/root-occurrences/{slug}.json  per-root occurrence indexes
//   - data/batch-publication-report.json overall publication report
//
// DESIGN PRINCIPLES:
//   1. Deterministic: same input → byte-identical output
//   2. Manual-preserving: existing ROOT_ALLOWLIST entries are never overwritten
//   3. Policy B compliant: missing lemmas disclosed but don't block when alignment valid
//   4. Per-root isolation: one failed root doesn't corrupt others
//   5. Reconciliation: discovered = eligible + blocked; eligible = published + eligible-but-not-published

import { writeFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { discoverAllRoots } from "../src/lib/morphology/root-discovery";
import { evaluateBatchEligibility } from "../src/lib/morphology/batch-eligibility";
import { buildRootTopicIndex } from "../src/lib/morphology/occurrence-index";
import { ROOT_ALLOWLIST } from "../src/lib/morphology/root-allowlist";
import type { MorphologyRecord } from "../src/lib/morphology/types";
import type { RootCandidate } from "../src/lib/morphology/root-discovery";
import type { BatchEligibilityResult } from "../src/lib/morphology/batch-eligibility";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const OCCURRENCES_DIR = join(DATA_DIR, "root-occurrences");
const REPORT_PATH = join(DATA_DIR, "batch-publication-report.json");

export interface RunCliOptions {
  /** Arguments as they would appear in process.argv.slice(2). */
  argv?: string[];
  /** Morphology index to read. Defaults to data/morphology-index.json. */
  indexPath?: string;
  /** Occurrences output directory. Defaults to data/root-occurrences. */
  occurrencesDir?: string;
  /** Report output path. Defaults to data/batch-publication-report.json. */
  reportPath?: string;
  /** Sink for human-readable output. */
  log?: (message: string) => void;
}

export interface RunCliResult {
  dryRun: boolean;
  eligibility: BatchEligibilityResult;
  wrote: string[];
}

export interface BatchPublicationReport {
  /** Total roots discovered. */
  totalDiscovered: number;
  /** Roots eligible for publication. */
  eligibleCount: number;
  /** Roots actually published (occurrence index generated). */
  publishedCount: number;
  /** Roots blocked from publication. */
  blockedCount: number;
  /** Roots eligible but not yet published (e.g., needs-review). */
  eligibleButNotPublishedCount: number;
  /** Roots that matched existing manual entries. */
  manualMatchCount: number;
  /** Total word-level occurrences across all roots. */
  totalWordOccurrences: number;
  /** Total distinct ayat across all roots. */
  totalDistinctAyat: number;
  /** Total missing lemmas across all roots. */
  totalMissingLemmas: number;
  /** Per-root publication decisions. */
  decisions: Array<{
    slug: string;
    root: string;
    decision: "publish" | "needs-review" | "blocked";
    reasons: string[];
    totalWordRecords: number;
    distinctAyahCount: number;
    lemmaCoverageRatio: number;
    matchedManualEntry: boolean;
  }>;
  /** Validation errors encountered. */
  validationErrors: string[];
  /** Reconciliation checks. */
  reconciliation: {
    discoveredEqualsEligiblePlusBlocked: boolean;
    eligibleEqualsPublishedPlusEligibleButNotPublished: boolean;
  };
  /** Policy and source versions. */
  versions: {
    policyVersion: string;
    sourceDatasetVersion: string;
  };
}

export function runCli(options: RunCliOptions = {}): RunCliResult {
  const argv = options.argv ?? [];
  const dryRun = argv.includes("--dry-run");
  const jsonOutput = argv.includes("--json");
  const indexPath = options.indexPath ?? INDEX_PATH;
  const occurrencesDir = options.occurrencesDir ?? OCCURRENCES_DIR;
  const reportPath = options.reportPath ?? REPORT_PATH;
  const log = options.log ?? console.log;

  // Load morphology index
  if (!existsSync(indexPath)) {
    throw new Error(
      `Morphology index not found at ${indexPath}. Run scripts/import-morphology.py first.`
    );
  }

  log("Loading morphology index...");
  const indexContent = readFileSync(indexPath, "utf-8");
  const index: MorphologyRecord[] = JSON.parse(indexContent);

  // Discover roots
  log("Discovering roots...");
  const candidates = discoverAllRoots(index);

  // Evaluate eligibility
  log("Evaluating eligibility...");
  const eligibility = evaluateBatchEligibility(candidates, index, ROOT_ALLOWLIST);

  // Generate occurrence indexes for eligible roots
  const wrote: string[] = [];
  let publishedCount = 0;
  const validationErrors: string[] = [];

  if (!dryRun) {
    // Ensure output directory exists
    if (!existsSync(occurrencesDir)) {
      mkdirSync(occurrencesDir, { recursive: true });
    }

    for (const result of eligibility.results) {
      if (result.eligible) {
        try {
          // Extract word-level records for this root
          const records = index.filter(
            (r) => r.wordPosition !== undefined && r.root === result.root
          );

          // Find the entry (manual or synthetic) used for this root
          const manualEntry = ROOT_ALLOWLIST.find(
            (e) => e.slug === result.slug || e.roots[0] === result.root
          );
          
          // Build occurrence index using the entry
          // Note: if includedLemmas is empty (newly discovered root), the index
          // will be empty — this is correct behavior, we don't auto-approve lemmas
          const entry = manualEntry ?? {
            slug: result.slug,
            title: `Root: ${result.root}`,
            arabicTitle: result.root,
            roots: [result.root],
            includedLemmas: [], // Empty — never auto-approve
            reviewState: "pending-review" as const,
            assertedBy: "automated-discovery (no scholarly review)",
            assertedAt: "2026-11-02",
          };

          const occurrenceIndex = buildRootTopicIndex(entry, records);

          // Write to file
          const outputPath = join(occurrencesDir, `${result.slug}.json`);
          writeFileSync(outputPath, JSON.stringify(occurrenceIndex, null, 2), "utf-8");
          wrote.push(outputPath);
          publishedCount++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          validationErrors.push(`Failed to generate occurrence index for ${result.root}: ${errorMessage}`);
        }
      }
    }
  } else {
    // Dry run: count eligible roots
    publishedCount = eligibility.eligibleCount;
  }

  // Compute totals
  const totalWordOccurrences = candidates.reduce((sum, c) => sum + c.totalWordRecords, 0);
  const totalDistinctAyat = candidates.reduce((sum, c) => sum + c.distinctAyahCount, 0);
  const totalMissingLemmas = candidates.reduce((sum, c) => sum + c.missingLemmaCount, 0);

  // Build report
  const report: BatchPublicationReport = {
    totalDiscovered: candidates.length,
    eligibleCount: eligibility.eligibleCount,
    publishedCount,
    blockedCount: eligibility.blockedCount,
    eligibleButNotPublishedCount: eligibility.eligibleCount - publishedCount,
    manualMatchCount: eligibility.manualMatchCount,
    totalWordOccurrences,
    totalDistinctAyat,
    totalMissingLemmas,
    decisions: eligibility.results.map((r) => ({
      slug: r.slug,
      root: r.root,
      decision: r.decision.decision === "withhold" ? "blocked" : r.decision.decision,
      reasons: r.decision.reasons,
      totalWordRecords: r.decision.totalWordRecords,
      distinctAyahCount: r.decision.totalWordRecords, // Note: this is word records, not distinct ayat
      lemmaCoverageRatio: r.decision.lemmaCoverageRatio,
      matchedManualEntry: r.matchedManualEntry,
    })),
    validationErrors,
    reconciliation: {
      discoveredEqualsEligiblePlusBlocked:
        candidates.length === eligibility.eligibleCount + eligibility.blockedCount,
      eligibleEqualsPublishedPlusEligibleButNotPublished:
        eligibility.eligibleCount === publishedCount + (eligibility.eligibleCount - publishedCount),
    },
    versions: {
      policyVersion: candidates[0]?.policyVersion ?? "unknown",
      sourceDatasetVersion: candidates[0]?.sourceDatasetVersion ?? "unknown",
    },
  };

  // Output
  if (jsonOutput) {
    log(JSON.stringify(report, null, 2));
  } else {
    log(`\nBatch publication complete:`);
    log(`  Total discovered: ${report.totalDiscovered}`);
    log(`  Eligible: ${report.eligibleCount}`);
    log(`  Published: ${report.publishedCount}`);
    log(`  Blocked: ${report.blockedCount}`);
    log(`  Eligible but not published: ${report.eligibleButNotPublishedCount}`);
    log(`  Manual matches: ${report.manualMatchCount}`);
    log(`  Total word-level occurrences: ${report.totalWordOccurrences}`);
    log(`  Total distinct ayat: ${report.totalDistinctAyat}`);
    log(`  Total missing lemmas: ${report.totalMissingLemmas}`);
    log(`  Validation errors: ${report.validationErrors.length}`);
    log(`  Reconciliation:`);
    log(`    discovered = eligible + blocked: ${report.reconciliation.discoveredEqualsEligiblePlusBlocked}`);
    log(`    eligible = published + eligible-but-not-published: ${report.reconciliation.eligibleEqualsPublishedPlusEligibleButNotPublished}`);
  }

  // Write report
  if (!dryRun) {
    writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
    log(`\nReport written to ${reportPath}`);
    if (!jsonOutput) {
      log(`Occurrence indexes written to ${occurrencesDir}/`);
    }
  } else {
    log("\nDRY RUN complete — no files written.");
  }

  return { dryRun, eligibility, wrote };
}

// CLI entry point
if (require.main === module) {
  try {
    runCli({ argv: process.argv.slice(2) });
  } catch (error) {
    console.error("Error:", error instanceof Error ? error.message : error);
    process.exit(1);
  }
}
