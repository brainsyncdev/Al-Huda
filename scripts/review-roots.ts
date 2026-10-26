#!/usr/bin/env node
// Batch review CLI — processes candidate roots and generates publication decisions.
//
// Usage:
//   npx tsx scripts/review-roots.ts [--dry-run] [--json]
//
// Options:
//   --dry-run   Show proposed changes without writing any file
//   --json      Print the full pipeline report as JSON instead of the summary
//
// Output (skipped entirely in dry-run):
//   - data/root-review-results.json  per-root review with evidence
//   - data/root-publications.json    publication decisions consumed by the UI
//
// The logic lives in runCli() so it can be exercised without spawning a
// process or writing to the real data directory.

import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT_ALLOWLIST, type RootTopicEntry } from "../src/lib/morphology/root-allowlist";
import {
  runBatchReview,
  type PipelineReport,
} from "../src/lib/morphology/review-pipeline";

const DATA_DIR = join(process.cwd(), "data");

export interface RunCliOptions {
  /** Arguments as they would appear in process.argv.slice(2). */
  argv?: string[];
  /** Candidate roots. Defaults to the full allowlist. */
  candidates?: RootTopicEntry[];
  /** Morphology index to read. Defaults to data/morphology-index.json. */
  indexPath?: string;
  /** Per-root results output. Defaults to data/root-review-results.json. */
  resultsPath?: string;
  /** Publication decisions output. Defaults to data/root-publications.json. */
  publicationsPath?: string;
  /** Sink for human-readable output. */
  log?: (line: string) => void;
}

export interface RunCliResult {
  dryRun: boolean;
  report: PipelineReport;
  /** Paths actually written. Empty in dry-run. */
  wrote: string[];
}

export function runCli(options: RunCliOptions = {}): RunCliResult {
  const argv = options.argv ?? process.argv.slice(2);
  const candidates = options.candidates ?? ROOT_ALLOWLIST;
  const indexPath = options.indexPath ?? join(DATA_DIR, "morphology-index.json");
  const resultsPath = options.resultsPath ?? join(DATA_DIR, "root-review-results.json");
  const publicationsPath =
    options.publicationsPath ?? join(DATA_DIR, "root-publications.json");
  const log = options.log ?? ((line: string) => console.log(line));

  const dryRun = argv.includes("--dry-run");
  const jsonOutput = argv.includes("--json");

  log("Running batch root review pipeline...");
  log(`Source: ${indexPath}`);
  log(`Candidates: ${candidates.length} roots`);
  log(`Mode: ${dryRun ? "DRY RUN (no files written)" : "LIVE"}`);
  log("");

  const report = runBatchReview(candidates, indexPath);

  if (jsonOutput) {
    log(JSON.stringify(report, null, 2));
    return { dryRun, report, wrote: [] };
  }

  log("=== PIPELINE REPORT ===");
  log(`Pipeline version: ${report.pipelineVersion}`);
  log(`Source dataset: ${report.sourceDatasetId}`);
  log(`Source fingerprint: ${report.sourceFingerprint.slice(0, 16)}...`);
  log(`Total roots: ${report.totalRoots}`);
  log(`  Published: ${report.publishedCount}`);
  log(`  Withheld: ${report.withheldCount}`);
  log(`  Needs review: ${report.needsReviewCount}`);
  log("");

  for (const result of report.results) {
    const icon =
      result.publication.decision === "publish"
        ? "[publish]"
        : result.publication.decision === "withhold"
          ? "[withhold]"
          : "[review]";
    log(
      `${icon.padEnd(11)} ${result.slug.padEnd(12)} ${result.root.padEnd(6)} ${String(result.totalOccurrences).padStart(4)} occ  ${String(result.distinctAyat).padStart(4)} ayat  ${String(result.lemmaCount).padStart(2)} lemmas  -> ${result.publication.decision}`
    );
    if (result.publication.decision !== "publish") {
      for (const reason of result.publication.reasons.slice(0, 2)) {
        log(`     ${reason}`);
      }
    }
  }

  if (dryRun) {
    log("");
    log("DRY RUN complete — no files written.");
    return { dryRun, report, wrote: [] };
  }

  log("");
  log("Writing outputs...");

  writeFileSync(resultsPath, JSON.stringify(report.results, null, 2), "utf-8");
  log(`  written ${resultsPath}`);

  writeFileSync(
    publicationsPath,
    JSON.stringify(report.decisions, null, 2),
    "utf-8"
  );
  log(`  written ${publicationsPath}`);

  log("");
  log("Pipeline complete.");

  return { dryRun, report, wrote: [resultsPath, publicationsPath] };
}

// Only run when executed directly, so importing this module in a test does not
// kick off a pipeline run.
const invokedDirectly =
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  runCli();
}