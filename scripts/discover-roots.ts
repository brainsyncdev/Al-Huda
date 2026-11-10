#!/usr/bin/env node
// Root discovery CLI — scans morphology index and discovers all distinct
// source-backed roots with computed statistics.
//
// Usage:
//   npx tsx scripts/discover-roots.ts [--dry-run] [--json]
//
// Options:
//   --dry-run   Show proposed changes without writing any file
//   --json      Print the full registry as JSON instead of the summary
//
// Output (skipped entirely in dry-run):
//   - data/root-discovery-registry.json  per-root discovery stats
//
// The logic lives in runCli() so it can be exercised without spawning a
// process or writing to the real data directory.

import { writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { readFileSync } from "node:fs";
import { discoverAllRoots, type RootCandidate } from "../src/lib/morphology/root-discovery";
import type { MorphologyRecord } from "../src/lib/morphology/types";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const REGISTRY_PATH = join(DATA_DIR, "root-discovery-registry.json");

export interface RunCliOptions {
  /** Arguments as they would appear in process.argv.slice(2). */
  argv?: string[];
  /** Morphology index to read. Defaults to data/morphology-index.json. */
  indexPath?: string;
  /** Registry output path. Defaults to data/root-discovery-registry.json. */
  registryPath?: string;
  /** Sink for human-readable output. */
  log?: (message: string) => void;
}

export interface RunCliResult {
  dryRun: boolean;
  registry: RootCandidate[];
  wrote: string[];
}

export function runCli(options: RunCliOptions = {}): RunCliResult {
  const argv = options.argv ?? [];
  const dryRun = argv.includes("--dry-run");
  const jsonOutput = argv.includes("--json");
  const indexPath = options.indexPath ?? INDEX_PATH;
  const registryPath = options.registryPath ?? REGISTRY_PATH;
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
  const registry = discoverAllRoots(index);

  // Summary stats
  const totalRoots = registry.length;
  const eligible = registry.filter((r) => r.discoveryStatus === "eligible").length;
  const needsValidation = registry.filter((r) => r.discoveryStatus === "needs-validation").length;
  const blocked = registry.filter((r) => r.discoveryStatus === "blocked").length;
  const totalOccurrences = registry.reduce((sum, r) => sum + r.totalWordRecords, 0);
  const totalAyat = registry.reduce((sum, r) => sum + r.distinctAyahCount, 0);
  const totalMissingLemmas = registry.reduce((sum, r) => sum + r.missingLemmaCount, 0);

  if (jsonOutput) {
    log(JSON.stringify(registry, null, 2));
  } else {
    log(`\nDiscovery complete:`);
    log(`  Total roots discovered: ${totalRoots}`);
    log(`  Eligible: ${eligible}`);
    log(`  Needs validation: ${needsValidation}`);
    log(`  Blocked: ${blocked}`);
    log(`  Total word-level occurrences: ${totalOccurrences}`);
    log(`  Total distinct ayat: ${totalAyat}`);
    log(`  Total missing lemmas: ${totalMissingLemmas}`);
  }

  // Write output
  if (dryRun) {
    log("\nDRY RUN complete — no files written.");
    return { dryRun, registry, wrote: [] };
  }

  const dir = dirname(registryPath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }

  writeFileSync(registryPath, JSON.stringify(registry, null, 2), "utf-8");
  log(`\nRegistry written to ${registryPath}`);

  return { dryRun, registry, wrote: [registryPath] };
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
