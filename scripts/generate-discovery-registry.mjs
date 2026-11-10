#!/usr/bin/env node
// Sprint 48 — Root Discovery Registry Generator
//
// Regenerates data/root-discovery-registry.json to reflect the actual
// activation state of all 1,642 roots after Sprint 48 full activation.
//
// The registry must not report a root as activated when its occurrence
// index is empty.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const BATCH_PATH = join(DATA_DIR, "automated-morphology-batch-dryrun.json");
const SUMMARY_PATH = join(DATA_DIR, "full-activation-summary.json");
const OCCURRENCES_DIR = join(DATA_DIR, "root-occurrences");
const REGISTRY_PATH = join(DATA_DIR, "root-discovery-registry.json");

function loadOccurrenceFile(root) {
  const path = join(OCCURRENCES_DIR, `${root}.json`);
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, "utf-8"));
}

function main() {
  console.log("=== Sprint 48: Root Discovery Registry ===\n");

  const batch = JSON.parse(readFileSync(BATCH_PATH, "utf-8"));
  const summary = JSON.parse(readFileSync(SUMMARY_PATH, "utf-8"));

  const roots = [];
  let activatedCount = 0;
  let needsReviewCount = 0;
  let partialCount = 0;
  let discovered = 0;

  for (const rootResult of batch.roots) {
    const occ = loadOccurrenceFile(rootResult.root);
    const hasOccurrences = occ && occ.totalMatches > 0;
    const hasNeedsReview = rootResult.lemmas.some((l) => l.outcome === "needs-review");
    const hasRejected = rootResult.lemmas.some((l) => l.outcome === "rejected");
    const autoAcceptedCount = rootResult.lemmas.filter((l) => l.outcome === "auto-accepted").length;
    const needsReviewLemmaCount = rootResult.lemmas.filter((l) => l.outcome === "needs-review").length;
    const rejectedLemmaCount = rootResult.lemmas.filter((l) => l.outcome === "rejected").length;

    let status;
    if (hasOccurrences && !hasNeedsReview && !hasRejected) {
      status = "activated";
      activatedCount++;
    } else if (hasOccurrences && (hasNeedsReview || hasRejected)) {
      status = "partially-activated";
      partialCount++;
    } else if (hasNeedsReview && !hasOccurrences) {
      status = "needs-review";
      needsReviewCount++;
    } else if (!hasOccurrences && !hasNeedsReview && !hasRejected) {
      status = "discovered";
      discoveredCount++;
    } else {
      // Fallback: should not happen, but handle gracefully
      status = "discovered";
      discoveredCount++;
    }

    roots.push({
      slug: rootResult.slug,
      root: rootResult.root,
      status,
      totalLemmas: rootResult.lemmas.length,
      autoAcceptedLemmas: autoAcceptedCount,
      needsReviewLemmas: needsReviewLemmaCount,
      rejectedLemmas: rejectedLemmaCount,
      occurrenceCount: hasOccurrences ? occ.totalMatches : 0,
      distinctAyahCount: hasOccurrences ? occ.uniqueAyahs.length : 0,
      includedLemmas: hasOccurrences ? occ.entry.includedLemmas : [],
      missingLemmaRecords: rootResult.lemmas.filter((l) => !l.lemma).length,
      policyVersion: rootResult.lemmas[0]?.policyVersion ?? batch.policyVersion,
      sourceDataset: batch.sourceDataset,
      activatedAt: hasOccurrences ? occ.entry.assertedAt : null,
    });
  }

  const registry = {
    generatedAt: new Date().toISOString(),
    policyVersion: batch.policyVersion,
    sourceDataset: batch.sourceDataset,
    aiProvider: batch.aiProvider,
    summary: {
      totalRoots: roots.length,
      activated: activatedCount,
      partiallyActivated: partialCount,
      needsReview: needsReviewCount,
      discovered,
      totalOccurrences: summary.totals.totalOccurrencesActivated,
      totalDistinctAyat: summary.totals.totalDistinctAyatActivated,
      totalLemmasActivated: summary.totals.totalLemmasActivated,
    },
    roots,
  };

  writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2), "utf-8");

  console.log(`Registry written to ${REGISTRY_PATH}`);
  console.log(`\nSummary:`);
  console.log(`  Total roots: ${roots.length}`);
  console.log(`  Activated: ${activatedCount}`);
  console.log(`  Partially activated: ${partialCount}`);
  console.log(`  Needs review: ${needsReviewCount}`);
  console.log(`  Discovered (no auto-accepted): ${discovered}`);
  console.log(`  Total occurrences: ${summary.totals.totalOccurrencesActivated}`);
  console.log(`  Total distinct ayat: ${summary.totals.totalDistinctAyatActivated}`);
}

main();
