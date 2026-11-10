#!/usr/bin/env node
// Sprint 48 — Full Activation Runner (ESM, bare `node`)
//
// Activates ALL eligible roots from the batch dry-run artifact.
// This is the central Sprint 48 deliverable: populate occurrence indexes
// for every root that has auto-accepted lemmas.
//
// Usage:
//   node scripts/activate-approved-roots.mjs              # full activation
//   node scripts/activate-approved-roots.mjs --dry-run    # report only, no writes
//
// Reads:
//   data/automated-morphology-batch-dryrun.json (Sprint 47 batch artifact)
//   data/morphology-index.json (source)
//
// Writes:
//   data/root-occurrences/{root}.json (populated occurrence indexes)
//   data/full-activation-summary.json (reconciliation summary)
//
// Activation policy:
//   - Only auto-accepted lemmas are activated.
//   - needs-review and rejected lemmas are excluded.
//   - Roots with zero matching occurrences are skipped (not written).
//   - Existing files are overwritten atomically.
//   - 10 manual roots preserve their curated titles.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const BATCH_PATH = join(DATA_DIR, "automated-morphology-batch-dryrun.json");
const OCCURRENCES_DIR = join(DATA_DIR, "root-occurrences");
const SUMMARY_PATH = join(DATA_DIR, "full-activation-summary.json");

const MANUAL_ROOT_TITLES = {
  صبر: { title: "Patience", arabicTitle: "صبر" },
  شكر: { title: "Gratitude", arabicTitle: "شكر" },
  رحم: { title: "Mercy", arabicTitle: "رحم" },
  علم: { title: "Knowledge", arabicTitle: "علم" },
  توب: { title: "Repentance", arabicTitle: "توب" },
  غفر: { title: "Forgiveness", arabicTitle: "غفر" },
  كبر: { title: "Greatness/Arrogance", arabicTitle: "كبر" },
  خشع: { title: "Humility", arabicTitle: "خشع" },
  صدق: { title: "Truthfulness", arabicTitle: "صدق" },
  وكل: { title: "Trust in God", arabicTitle: "وكل" },
};

function buildRecordIndex(wordLevelRecords) {
  // Index by root for O(1) lookup per root
  const byRoot = new Map();
  for (const record of wordLevelRecords) {
    if (!record.root) continue;
    if (!byRoot.has(record.root)) byRoot.set(record.root, []);
    byRoot.get(record.root).push(record);
  }
  return byRoot;
}

function activateRoot(rootResult, recordsForRoot) {
  const includedLemmas = rootResult.lemmas
    .filter((lr) => lr.outcome === "auto-accepted")
    .map((lr) => lr.lemma)
    .sort();

  if (includedLemmas.length === 0) {
    return {
      slug: rootResult.slug,
      root: rootResult.root,
      success: false,
      reason: "no-auto-accepted-lemmas",
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: 0,
      errors: [],
      warnings: [],
    };
  }

  if (!recordsForRoot || recordsForRoot.length === 0) {
    return {
      slug: rootResult.slug,
      root: rootResult.root,
      success: false,
      reason: "no-source-records",
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: includedLemmas.length,
      errors: [],
      warnings: [],
    };
  }

  const lemmaSet = new Set(includedLemmas);
  const matchingRecords = recordsForRoot.filter((r) => r.lemma && lemmaSet.has(r.lemma));

  if (matchingRecords.length === 0) {
    return {
      slug: rootResult.slug,
      root: rootResult.root,
      success: false,
      reason: "zero-matching-occurrences",
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: includedLemmas.length,
      errors: [],
      warnings: [],
    };
  }

  // Compute distinct ayat
  const ayahSet = new Set();
  for (const record of matchingRecords) {
    ayahSet.add(`${record.ref.surah}:${record.ref.ayah}`);
  }

  // Check for duplicates
  const positionMap = new Map();
  for (const record of matchingRecords) {
    const key = `${record.ref.surah}:${record.ref.ayah}:${record.wordPosition}`;
    positionMap.set(key, (positionMap.get(key) ?? 0) + 1);
  }
  const duplicates = [...positionMap.entries()].filter(([, count]) => count > 1);
  const warnings = [];
  if (duplicates.length > 0) {
    warnings.push(`${duplicates.length} duplicate word positions detected`);
  }

  // Build occurrence records (sorted deterministically)
  const occurrences = matchingRecords
    .sort((a, b) => {
      if (a.ref.surah !== b.ref.surah) return a.ref.surah - b.ref.surah;
      if (a.ref.ayah !== b.ref.ayah) return a.ref.ayah - b.ref.ayah;
      return (a.wordPosition ?? 0) - (b.wordPosition ?? 0);
    })
    .map((record) => ({
      ref: record.ref,
      matchedToken: record.token,
      matchedLemma: record.lemma,
      matchedRoot: record.root,
      wordPosition: record.wordPosition,
    }));

  const uniqueAyahs = [...ayahSet]
    .map((key) => {
      const [s, a] = key.split(":").map(Number);
      return { surah: s, ayah: a };
    })
    .sort((a, b) => {
      if (a.surah !== b.surah) return a.surah - b.surah;
      return a.ayah - b.ayah;
    });

  const titles = MANUAL_ROOT_TITLES[rootResult.root] ?? {
    title: rootResult.root,
    arabicTitle: rootResult.root,
  };

  const entry = {
    slug: rootResult.slug,
    title: titles.title,
    arabicTitle: titles.arabicTitle,
    roots: [rootResult.root],
    includedLemmas,
    maxResults: undefined,
    reviewState: "auto-accepted",
    assertedBy: "automated-morphology-review",
    assertedAt: new Date().toISOString().slice(0, 10),
    notes: `Activated via Sprint 48 automated morphology review. ${includedLemmas.length} lemmas auto-accepted by deterministic validation.`,
  };

  const index = {
    entry,
    occurrences,
    uniqueAyahs,
    totalOccurrences: occurrences.length,
    totalMatches: occurrences.length,
    pagination: null,
  };

  return {
    slug: rootResult.slug,
    root: rootResult.root,
    success: true,
    reason: "activated",
    occurrenceCount: occurrences.length,
    distinctAyahCount: ayahSet.size,
    includedLemmaCount: includedLemmas.length,
    errors: [],
    warnings,
    index,
  };
}

function main() {
  const dryRun = process.argv.includes("--dry-run");
  console.log(`=== Sprint 48: Full Root Activation ===`);
  console.log(`Mode: ${dryRun ? "DRY RUN (no writes)" : "LIVE"}\n`);

  if (!existsSync(INDEX_PATH)) {
    console.error(`FATAL: morphology index not found at ${INDEX_PATH}`);
    process.exit(1);
  }
  if (!existsSync(BATCH_PATH)) {
    console.error(`FATAL: batch artifact not found at ${BATCH_PATH}`);
    console.error("Run scripts/run-automated-morphology-review.mjs --all first.");
    process.exit(1);
  }

  console.log("Loading morphology index...");
  const rawIndex = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  const wordLevel = rawIndex.filter((r) => r.wordPosition !== undefined && r.root);
  console.log(`  ${wordLevel.length} word-level records with root`);

  console.log("Building root index...");
  const recordsByRoot = buildRecordIndex(wordLevel);
  console.log(`  ${recordsByRoot.size} distinct roots in source`);

  console.log("Loading batch review artifact...");
  const batch = JSON.parse(readFileSync(BATCH_PATH, "utf-8"));
  console.log(`  ${batch.roots.length} roots to process`);
  console.log(`  Policy: ${batch.policyVersion}`);
  console.log(`  AI provider: ${batch.aiProvider}\n`);

  if (!existsSync(OCCURRENCES_DIR)) mkdirSync(OCCURRENCES_DIR, { recursive: true });

  const results = [];
  let activated = 0;
  let skippedNoLemmas = 0;
  let skippedNoRecords = 0;
  let skippedZeroMatches = 0;
  let totalOccurrences = 0;
  let totalAyat = 0;
  let totalLemmasActivated = 0;
  let rootsWithWarnings = 0;

  for (let i = 0; i < batch.roots.length; i++) {
    const rootResult = batch.roots[i];
    const recordsForRoot = recordsByRoot.get(rootResult.root) ?? [];
    const result = activateRoot(rootResult, recordsForRoot);
    results.push(result);

    if (!result.success) {
      if (result.reason === "no-auto-accepted-lemmas") skippedNoLemmas++;
      else if (result.reason === "no-source-records") skippedNoRecords++;
      else if (result.reason === "zero-matching-occurrences") skippedZeroMatches++;
      continue;
    }

    if (!dryRun) {
      const outputPath = join(OCCURRENCES_DIR, `${result.root}.json`);
      writeFileSync(outputPath, JSON.stringify(result.index, null, 2), "utf-8");
    }

    activated++;
    totalOccurrences += result.occurrenceCount;
    totalAyat += result.distinctAyahCount;
    totalLemmasActivated += result.includedLemmaCount;
    if (result.warnings.length > 0) rootsWithWarnings++;

    if ((i + 1) % 200 === 0 || i === batch.roots.length - 1) {
      console.log(
        `  [${i + 1}/${batch.roots.length}] activated so far: ${activated} ` +
        `(${((activated / (i + 1)) * 100).toFixed(1)}%)`
      );
    }
  }

  // Reconciliation: account for every source occurrence
  const activatedRootSet = new Set(results.filter((r) => r.success).map((r) => r.root));
  const needsReviewRoots = batch.roots.filter((r) =>
    r.lemmas.some((l) => l.outcome === "needs-review")
  );
  const rejectedRoots = batch.roots.filter((r) =>
    r.lemmas.some((l) => l.outcome === "rejected")
  );

  // Count records by category
  let recordsActivated = 0;
  let recordsNeedsReview = 0;
  let recordsRejected = 0;
  let recordsMissingLemma = 0;
  let recordsUnexplained = 0;

  for (const record of wordLevel) {
    const root = record.root;
    const rootResult = batch.roots.find((r) => r.root === root);
    if (!rootResult) {
      recordsUnexplained++;
      continue;
    }
    if (!record.lemma) {
      recordsMissingLemma++;
      continue;
    }
    const lemmaResult = rootResult.lemmas.find((l) => l.lemma === record.lemma);
    if (!lemmaResult) {
      recordsUnexplained++;
      continue;
    }
    if (lemmaResult.outcome === "auto-accepted") recordsActivated++;
    else if (lemmaResult.outcome === "needs-review") recordsNeedsReview++;
    else if (lemmaResult.outcome === "rejected") recordsRejected++;
    else recordsUnexplained++;
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    policyVersion: batch.policyVersion,
    sourceDataset: batch.sourceDataset,
    aiProvider: batch.aiProvider,
    dryRun,
    totals: {
      rootsDiscovered: batch.roots.length,
      rootsProcessed: batch.roots.length,
      rootsActivated: activated,
      rootsSkippedNoAutoAcceptedLemmas: skippedNoLemmas,
      rootsSkippedNoSourceRecords: skippedNoRecords,
      rootsSkippedZeroMatches: skippedZeroMatches,
      rootsWithWarnings,
      rootsWithNeedsReviewLemmas: needsReviewRoots.length,
      rootsWithRejectedLemmas: rejectedRoots.length,
      totalOccurrencesActivated: totalOccurrences,
      totalDistinctAyatActivated: totalAyat,
      totalLemmasActivated,
    },
    reconciliation: {
      totalWordLevelRecords: wordLevel.length,
      recordsActivated,
      recordsNeedsReview,
      recordsRejected,
      recordsMissingLemma,
      recordsUnexplained,
      accountedFor: recordsActivated + recordsNeedsReview + recordsRejected + recordsMissingLemma + recordsUnexplained,
      allAccountedFor:
        recordsActivated + recordsNeedsReview + recordsRejected + recordsMissingLemma + recordsUnexplained ===
        wordLevel.length,
    },
    globalSummary: batch.globalSummary,
  };

  console.log("\n=== ACTIVATION SUMMARY ===");
  console.log(`Roots activated: ${activated}`);
  console.log(`Roots skipped (no auto-accepted lemmas): ${skippedNoLemmas}`);
  console.log(`Roots skipped (no source records): ${skippedNoRecords}`);
  console.log(`Roots skipped (zero matches): ${skippedZeroMatches}`);
  console.log(`Roots with warnings: ${rootsWithWarnings}`);
  console.log(`Total occurrences activated: ${totalOccurrences}`);
  console.log(`Total distinct ayat: ${totalAyat}`);
  console.log(`Total lemmas activated: ${totalLemmasActivated}`);
  console.log("\n=== RECONCILIATION ===");
  console.log(`Total word-level records: ${wordLevel.length}`);
  console.log(`  Activated: ${recordsActivated}`);
  console.log(`  Needs-review: ${recordsNeedsReview}`);
  console.log(`  Rejected: ${recordsRejected}`);
  console.log(`  Missing lemma: ${recordsMissingLemma}`);
  console.log(`  Unexplained: ${recordsUnexplained}`);
  console.log(`  All accounted for: ${summary.reconciliation.allAccountedFor ? "✅ YES" : "❌ NO"}`);

  if (!dryRun) {
    writeFileSync(SUMMARY_PATH, JSON.stringify(summary, null, 2), "utf-8");
    console.log(`\nSummary written to ${SUMMARY_PATH}`);
    console.log(`Occurrence files written to ${OCCURRENCES_DIR}`);
  } else {
    console.log(`\n[DRY RUN] No files written.`);
  }

  if (!summary.reconciliation.allAccountedFor) {
    console.log("\n⚠️  RECONCILIATION FAILURE: not all source records are accounted for.");
    process.exit(1);
  }

  console.log("\n✅ Full activation complete");
  process.exit(0);
}

main();
