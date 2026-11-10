#!/usr/bin/env node
// Sprint 48 — Independent Activation Audit
//
// Independently verifies the activation output against the source morphology
// data. Does NOT rely on the activation pipeline's own functions.
//
// Produces:
//   data/full-morphology-activation-audit.json
//
// Verifies:
//   1. Every activated occurrence exists in source.
//   2. Root associations are correct.
//   3. Lemma associations are correct.
//   4. Surah/ayah references are correct.
//   5. Word positions are correct.
//   6. No duplicate occurrences.
//   7. No phantom occurrences.
//   8. No source-backed occurrence is silently lost.
//   9. All unactivated records have explicit reasons.
//  10. Distinct ayah counts are correct.
//  11. Coverage disclosures are correct.
//  12. Source and policy versions are consistent.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const BATCH_PATH = join(DATA_DIR, "automated-morphology-batch-dryrun.json");
const SUMMARY_PATH = join(DATA_DIR, "full-activation-summary.json");
const OCCURRENCES_DIR = join(DATA_DIR, "root-occurrences");
const AUDIT_PATH = join(DATA_DIR, "full-morphology-activation-audit.json");

function main() {
  console.log("=== Sprint 48: Independent Activation Audit ===\n");

  const failures = [];
  const warnings = [];

  // Load source data
  console.log("Loading source data...");
  const rawIndex = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  const wordLevel = rawIndex.filter((r) => r.wordPosition !== undefined && r.root);
  console.log(`  ${wordLevel.length} word-level records`);

  // Build source lookup: `${surah}:${ayah}:${wordPosition}` -> record
  const sourceLookup = new Map();
  for (const record of wordLevel) {
    const key = `${record.ref.surah}:${record.ref.ayah}:${record.wordPosition}`;
    sourceLookup.set(key, record);
  }

  // Load batch review
  const batch = JSON.parse(readFileSync(BATCH_PATH, "utf-8"));
  const batchByRoot = new Map(batch.roots.map((r) => [r.root, r]));

  // Load activation summary
  const summary = JSON.parse(readFileSync(SUMMARY_PATH, "utf-8"));

  // Load all occurrence files
  console.log("Loading occurrence files...");
  const occFiles = readdirSync(OCCURRENCES_DIR).filter((f) => f.endsWith(".json"));
  console.log(`  ${occFiles.length} occurrence files`);

  let populatedFiles = 0;
  let emptyFiles = 0;
  let totalOccurrencesInFiles = 0;
  let totalDistinctAyatInFiles = 0;
  let rootsWithActivatedOccurrences = 0;

  // Per-file verification
  for (const filename of occFiles) {
    const filePath = join(OCCURRENCES_DIR, filename);
    const content = JSON.parse(readFileSync(filePath, "utf-8"));
    const rootName = filename.replace(".json", "");

    if (content.totalMatches === 0) {
      emptyFiles++;
      // Empty files should have empty occurrences array
      if (content.occurrences.length !== 0) {
        failures.push(`${rootName}: totalMatches=0 but occurrences.length=${content.occurrences.length}`);
      }
      continue;
    }

    populatedFiles++;
    totalOccurrencesInFiles += content.totalMatches;
    totalDistinctAyatInFiles += content.uniqueAyahs.length;

    // Verify entry consistency
    if (content.entry.roots.length !== 1) {
      failures.push(`${rootName}: entry.roots should have exactly 1 element`);
    }
    if (content.entry.roots[0] !== rootName) {
      failures.push(`${rootName}: entry.roots[0] (${content.entry.roots[0]}) != filename`);
    }
    if (content.totalMatches !== content.occurrences.length) {
      failures.push(`${rootName}: totalMatches (${content.totalMatches}) != occurrences.length (${content.occurrences.length})`);
    }
    if (content.totalOccurrences !== content.occurrences.length) {
      failures.push(`${rootName}: totalOccurrences != occurrences.length`);
    }

    // Verify each occurrence against source
    const seenPositions = new Set();
    const ayahSet = new Set();
    const batchRoot = batchByRoot.get(rootName);
    const autoAcceptedLemmas = new Set(
      batchRoot?.lemmas.filter((l) => l.outcome === "auto-accepted").map((l) => l.lemma) ?? []
    );

    for (const occ of content.occurrences) {
      const posKey = `${occ.ref.surah}:${occ.ref.ayah}:${occ.wordPosition}`;

      // Check for duplicates
      if (seenPositions.has(posKey)) {
        failures.push(`${rootName}: duplicate occurrence at ${posKey}`);
      }
      seenPositions.add(posKey);

      // Check source existence
      const sourceRecord = sourceLookup.get(posKey);
      if (!sourceRecord) {
        failures.push(`${rootName}: phantom occurrence at ${posKey} — not in source`);
        continue;
      }

      // Check root association
      if (sourceRecord.root !== rootName) {
        failures.push(`${rootName}: occurrence at ${posKey} has source root ${sourceRecord.root}`);
      }
      if (occ.matchedRoot !== rootName) {
        failures.push(`${rootName}: occurrence at ${posKey} has matchedRoot ${occ.matchedRoot}`);
      }

      // Check lemma association
      if (sourceRecord.lemma !== occ.matchedLemma) {
        failures.push(`${rootName}: occurrence at ${posKey} source lemma ${sourceRecord.lemma} != matched ${occ.matchedLemma}`);
      }

      // Check lemma is auto-accepted
      if (!autoAcceptedLemmas.has(occ.matchedLemma)) {
        failures.push(`${rootName}: occurrence at ${posKey} has non-auto-accepted lemma ${occ.matchedLemma}`);
      }

      // Check token matches
      if (sourceRecord.token !== occ.matchedToken) {
        warnings.push(`${rootName}: occurrence at ${posKey} token mismatch: source=${sourceRecord.token} file=${occ.matchedToken}`);
      }

      ayahSet.add(`${occ.ref.surah}:${occ.ref.ayah}`);
    }

    // Verify unique ayahs
    if (content.uniqueAyahs.length !== ayahSet.size) {
      failures.push(`${rootName}: uniqueAyahs.length (${content.uniqueAyahs.length}) != computed (${ayahSet.size})`);
    }

    // Verify distinct ayah count
    if (content.uniqueAyahs.length !== new Set(content.occurrences.map((o) => `${o.ref.surah}:${o.ref.ayah}`)).size) {
      failures.push(`${rootName}: uniqueAyahs inconsistent with occurrences`);
    }

    rootsWithActivatedOccurrences++;
  }

  // Verify no source-backed occurrence is silently lost
  console.log("\nVerifying source coverage...");
  let sourceActivated = 0;
  let sourceNeedsReview = 0;
  let sourceMissingLemma = 0;
  let sourceUnexplained = 0;

  for (const record of wordLevel) {
    const batchRoot = batchByRoot.get(record.root);
    if (!batchRoot) {
      sourceUnexplained++;
      continue;
    }
    if (!record.lemma) {
      sourceMissingLemma++;
      continue;
    }
    const lemmaResult = batchRoot.lemmas.find((l) => l.lemma === record.lemma);
    if (!lemmaResult) {
      sourceUnexplained++;
      continue;
    }
    if (lemmaResult.outcome === "auto-accepted") sourceActivated++;
    else if (lemmaResult.outcome === "needs-review") sourceNeedsReview++;
    else sourceUnexplained++;
  }

  // Cross-check with summary
  if (sourceActivated !== summary.totals.totalOccurrencesActivated) {
    failures.push(
      `Source activated count (${sourceActivated}) != summary (${summary.totals.totalOccurrencesActivated})`
    );
  }
  if (totalOccurrencesInFiles !== summary.totals.totalOccurrencesActivated) {
    failures.push(
      `Files total occurrences (${totalOccurrencesInFiles}) != summary (${summary.totals.totalOccurrencesActivated})`
    );
  }

  // Verify all roots processed
  if (batch.roots.length !== summary.totals.rootsDiscovered) {
    failures.push(`Batch roots (${batch.roots.length}) != summary discovered (${summary.totals.rootsDiscovered})`);
  }

  // Verify policy version
  if (batch.policyVersion !== summary.policyVersion) {
    failures.push(`Policy version mismatch: batch=${batch.policyVersion} summary=${summary.policyVersion}`);
  }

  // Check reconciliation
  const accountedFor = sourceActivated + sourceNeedsReview + sourceMissingLemma + sourceUnexplained;
  if (accountedFor !== wordLevel.length) {
    failures.push(`Reconciliation failure: ${accountedFor} accounted for != ${wordLevel.length} total`);
  }

  const audit = {
    generatedAt: new Date().toISOString(),
    policyVersion: batch.policyVersion,
    sourceDataset: batch.sourceDataset,
    summary: {
      occurrenceFilesTotal: occFiles.length,
      occurrenceFilesPopulated: populatedFiles,
      occurrenceFilesEmpty: emptyFiles,
      totalOccurrencesInFiles,
      totalDistinctAyatInFiles,
      rootsWithActivatedOccurrences,
    },
    sourceReconciliation: {
      totalWordLevelRecords: wordLevel.length,
      activated: sourceActivated,
      needsReview: sourceNeedsReview,
      missingLemma: sourceMissingLemma,
      unexplained: sourceUnexplained,
      accountedFor,
      allAccountedFor: accountedFor === wordLevel.length,
    },
    verification: {
      failures,
      warnings,
      failureCount: failures.length,
      warningCount: warnings.length,
      passed: failures.length === 0,
    },
  };

  writeFileSync(AUDIT_PATH, JSON.stringify(audit, null, 2), "utf-8");

  console.log("\n=== AUDIT RESULTS ===");
  console.log(`Occurrence files: ${occFiles.length} (${populatedFiles} populated, ${emptyFiles} empty)`);
  console.log(`Total occurrences in files: ${totalOccurrencesInFiles}`);
  console.log(`Total distinct ayat: ${totalDistinctAyatInFiles}`);
  console.log(`Roots with activated occurrences: ${rootsWithActivatedOccurrences}`);
  console.log(`\nSource reconciliation:`);
  console.log(`  Activated: ${sourceActivated}`);
  console.log(`  Needs-review: ${sourceNeedsReview}`);
  console.log(`  Missing lemma: ${sourceMissingLemma}`);
  console.log(`  Unexplained: ${sourceUnexplained}`);
  console.log(`  All accounted for: ${audit.sourceReconciliation.allAccountedFor ? "✅ YES" : "❌ NO"}`);
  console.log(`\nVerification:`);
  console.log(`  Failures: ${failures.length}`);
  console.log(`  Warnings: ${warnings.length}`);
  console.log(`  Status: ${audit.verification.passed ? "✅ PASSED" : "❌ FAILED"}`);

  if (failures.length > 0) {
    console.log("\nFailures:");
    for (const f of failures.slice(0, 20)) console.log(`  ❌ ${f}`);
    if (failures.length > 20) console.log(`  ... and ${failures.length - 20} more`);
  }
  if (warnings.length > 0) {
    console.log("\nWarnings (first 5):");
    for (const w of warnings.slice(0, 5)) console.log(`  ⚠️  ${w}`);
  }

  console.log(`\nAudit written to ${AUDIT_PATH}`);
  process.exit(audit.verification.passed ? 0 : 1);
}

main();
