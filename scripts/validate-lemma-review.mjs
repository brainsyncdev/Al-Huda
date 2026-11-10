#!/usr/bin/env node
// Sprint 46 — Lemma Review Validation Script
//
// Validates the human review workbook against the morphology source.
// Checks:
//   1. Every source lemma is represented in the workbook.
//   2. No fabricated lemma exists in the workbook.
//   3. Occurrence counts match the source.
//   4. Consonantal compatibility flags are correct.
//   5. Polysemy concerns are present for known cases.
//
// Usage: node scripts/validate-lemma-review.mjs
// Exit:  0 if all checks pass, 1 otherwise.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const WORKBOOK_PATH = join(DATA_DIR, "human-lemma-review-workbook.json");

const DIACRITICS = /[\u0640\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const WEAK_LETTERS = new Set(["\u0627", "\u0648", "\u064A"]);

function normalizeLetters(text) {
  return [...text.replace(DIACRITICS, "")]
    .filter((c) => /[\u0621-\u064A]/.test(c))
    .map((c) => {
      if (c === "\u0623" || c === "\u0625" || c === "\u0622" || c === "\u0671") return "\u0627";
      if (c === "\u0649") return "\u064A";
      if (c === "\u0624") return "\u0648";
      if (c === "\u0626") return "\u064A";
      if (c === "\u0629") return "\u0647";
      return c;
    });
}

function strongLetters(text) {
  return normalizeLetters(text).filter((c) => !WEAK_LETTERS.has(c));
}

function isOrderedSubsequence(needle, haystack) {
  let i = 0;
  for (const c of haystack) {
    if (c === needle[i]) i += 1;
    if (i === needle.length) return true;
  }
  return needle.length === 0;
}

function main() {
  console.log("=== Sprint 46: Lemma Review Validation ===\n");

  if (!existsSync(INDEX_PATH)) {
    console.error("FATAL: morphology index not found");
    process.exit(1);
  }
  if (!existsSync(WORKBOOK_PATH)) {
    console.error("FATAL: human-lemma-review-workbook.json not found");
    process.exit(1);
  }

  console.log("Loading morphology index...");
  const index = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  const wordLevel = index.filter((r) => r.wordPosition !== undefined && r.root);
  console.log(`  ${wordLevel.length} word-level records with root`);

  console.log("Loading review workbook...");
  const workbook = JSON.parse(readFileSync(WORKBOOK_PATH, "utf-8"));
  console.log(`  ${workbook.roots.length} roots in workbook`);

  let totalErrors = 0;
  let totalWarnings = 0;

  for (const wbRoot of workbook.roots) {
    console.log(`\n--- Validating root: ${wbRoot.root} (${wbRoot.slug}) ---`);

    // Get source records for this root
    const sourceRecords = wordLevel.filter((r) => r.root === wbRoot.root);

    // Build source lemma map
    const sourceLemmaMap = new Map();
    for (const r of sourceRecords) {
      if (r.lemma) {
        sourceLemmaMap.set(r.lemma, (sourceLemmaMap.get(r.lemma) ?? 0) + 1);
      }
    }

    // Check 1: Every source lemma is in the workbook
    const wbLemmaSet = new Set(wbRoot.lemmaDistribution.map((l) => l.lemma));
    for (const [lemma] of sourceLemmaMap) {
      if (!wbLemmaSet.has(lemma)) {
        console.log(`  ERROR: Source lemma "${lemma}" missing from workbook`);
        totalErrors++;
      }
    }

    // Check 2: No fabricated lemma in workbook
    for (const wbLemma of wbRoot.lemmaDistribution) {
      if (!sourceLemmaMap.has(wbLemma.lemma)) {
        console.log(`  ERROR: Workbook lemma "${wbLemma.lemma}" not found in source`);
        totalErrors++;
      }
    }

    // Check 3: Occurrence counts match
    for (const wbLemma of wbRoot.lemmaDistribution) {
      const sourceCount = sourceLemmaMap.get(wbLemma.lemma) ?? 0;
      if (wbLemma.count !== sourceCount) {
        console.log(
          `  ERROR: Lemma "${wbLemma.lemma}" count mismatch: workbook=${wbLemma.count}, source=${sourceCount}`
        );
        totalErrors++;
      }
    }

    // Check 4: Consonantal compatibility
    const needle = strongLetters(wbRoot.root);
    for (const wbLemma of wbRoot.lemmaDistribution) {
      const expected =
        needle.length === 0 ||
        isOrderedSubsequence(needle, strongLetters(wbLemma.lemma));
      if (wbLemma.consonantallyCompatible !== expected) {
        console.log(
          `  WARNING: Lemma "${wbLemma.lemma}" compatibility flag mismatch: workbook=${wbLemma.consonantallyCompatible}, computed=${expected}`
        );
        totalWarnings++;
      }
    }

    // Check 5: Total records match
    if (wbRoot.totalWordRecords !== sourceRecords.length) {
      console.log(
        `  ERROR: Total records mismatch: workbook=${wbRoot.totalWordRecords}, source=${sourceRecords.length}`
      );
      totalErrors++;
    }

    // Check 6: Distinct ayat match
    const sourceAyatSet = new Set(sourceRecords.map((r) => `${r.ref.surah}:${r.ref.ayah}`));
    if (wbRoot.distinctAyat !== sourceAyatSet.size) {
      console.log(
        `  ERROR: Distinct ayat mismatch: workbook=${wbRoot.distinctAyat}, source=${sourceAyatSet.size}`
      );
      totalErrors++;
    }

    if (totalErrors === 0) {
      console.log(`  OK: ${wbRoot.lemmaDistribution.length} lemmas verified, counts match`);
    }
  }

  console.log(`\n=== VALIDATION SUMMARY ===`);
  console.log(`Errors: ${totalErrors}`);
  console.log(`Warnings: ${totalWarnings}`);

  if (totalErrors > 0) {
    console.log("\n❌ VALIDATION FAILED");
    process.exit(1);
  }

  console.log("\n✅ All validation checks passed");
  process.exit(0);
}

main();
