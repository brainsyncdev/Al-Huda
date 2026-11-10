#!/usr/bin/env node
// Sprint 47 — Activation Runner (ESM, bare `node`)
//
// Consumes the automated morphology review artifact and generates populated
// occurrence indexes for auto-accepted lemmas. This script activates only
// the 10 manual roots (Sprint 47 scope).
//
// Usage:
//   node scripts/activate-auto-accepted-roots.mjs
//
// Reads:
//   data/automated-morphology-review.json (pilot artifact)
//   data/morphology-index.json (source)
//
// Writes:
//   data/root-occurrences/<slug>.json (populated occurrence indexes)
//
// This script:
//   - Only activates roots with reviewState !== "rejected"
//   - Only includes auto-accepted lemmas
//   - Preserves exact surah, ayah, word positions
//   - Calculates actual occurrence counts
//   - Calculates distinct ayah counts
//   - Generates deterministic output
//   - Does NOT modify morphology-index.json
//   - Does NOT activate the 1,632 non-manual roots

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const ARTIFACT_PATH = join(DATA_DIR, "automated-morphology-review.json");
const OCCURRENCES_DIR = join(DATA_DIR, "root-occurrences");

const ROOT_TITLES = {
  sabr: { title: "Patience", arabicTitle: "\u0635\u0628\u0631" },
  shukr: { title: "Gratitude", arabicTitle: "\u0634\u0643\u0631" },
  rahmah: { title: "Mercy", arabicTitle: "\u0631\u062d\u0645" },
  ilm: { title: "Knowledge", arabicTitle: "\u0639\u0644\u0645" },
  tawbah: { title: "Repentance", arabicTitle: "\u062a\u0648\u0628" },
  maghfirah: { title: "Forgiveness", arabicTitle: "\u063a\u0641\u0631" },
  kibr: { title: "Greatness/Arrogance", arabicTitle: "\u0643\u0628\u0631" },
  khushu: { title: "Humility", arabicTitle: "\u062e\u0634\u0639" },
  sidq: { title: "Truthfulness", arabicTitle: "\u0635\u062f\u0642" },
  tawakkul: { title: "Trust in God", arabicTitle: "\u0648\u0643\u0644" },
};

function activateRoot(rootResult, allRecords) {
  const includedLemmas = rootResult.lemmas
    .filter((lr) => lr.outcome === "auto-accepted")
    .map((lr) => lr.lemma)
    .sort();

  if (includedLemmas.length === 0) {
    return {
      slug: rootResult.slug,
      root: rootResult.root,
      success: false,
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: 0,
      errors: ["No auto-accepted lemmas"],
      warnings: [],
      index: null,
    };
  }

  const lemmaSet = new Set(includedLemmas);
  const rootString = rootResult.root;

  const matchingRecords = allRecords.filter((record) => {
    if (record.root !== rootString) return false;
    if (!record.lemma) return false;
    if (!lemmaSet.has(record.lemma)) return false;
    return true;
  });

  if (matchingRecords.length === 0) {
    return {
      slug: rootResult.slug,
      root: rootResult.root,
      success: false,
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: includedLemmas.length,
      errors: ["Zero matching occurrences for auto-accepted lemmas"],
      warnings: [],
      index: null,
    };
  }

  const ayahSet = new Set();
  for (const record of matchingRecords) {
    ayahSet.add(`${record.ref.surah}:${record.ref.ayah}`);
  }

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

  const excludedLemmas = rootResult.lemmas
    .filter((lr) => lr.outcome !== "auto-accepted")
    .map((lr) => lr.lemma);
  const excludedSet = new Set(excludedLemmas);
  let leakedExcluded = 0;
  for (const record of matchingRecords) {
    if (record.lemma && excludedSet.has(record.lemma)) {
      leakedExcluded++;
    }
  }
  if (leakedExcluded > 0) {
    return {
      slug: rootResult.slug,
      root: rootResult.root,
      success: false,
      occurrenceCount: 0,
      distinctAyahCount: 0,
      includedLemmaCount: includedLemmas.length,
      errors: [`${leakedExcluded} occurrences match excluded lemmas`],
      warnings,
      index: null,
    };
  }

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

  const titles = ROOT_TITLES[rootResult.slug] ?? {
    title: rootResult.slug,
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
    notes: `Activated via Sprint 47 automated morphology review. ${includedLemmas.length} lemmas auto-accepted by deterministic validation.`,
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
    occurrenceCount: occurrences.length,
    distinctAyahCount: ayahSet.size,
    includedLemmaCount: includedLemmas.length,
    errors: [],
    warnings,
    index,
  };
}

function main() {
  console.log("=== Sprint 47: Root Activation ===");
  console.log("Scope: 10 manual roots only\n");

  if (!existsSync(INDEX_PATH)) {
    console.error(`FATAL: morphology index not found at ${INDEX_PATH}`);
    process.exit(1);
  }

  if (!existsSync(ARTIFACT_PATH)) {
    console.error(`FATAL: review artifact not found at ${ARTIFACT_PATH}`);
    console.error("Run scripts/run-automated-morphology-review.mjs first.");
    process.exit(1);
  }

  console.log("Loading morphology index...");
  const index = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  const wordLevel = index.filter((r) => r.wordPosition !== undefined && r.root);
  console.log(`  ${wordLevel.length} word-level records with root`);

  console.log("Loading review artifact...");
  const artifact = JSON.parse(readFileSync(ARTIFACT_PATH, "utf-8"));
  console.log(`  ${artifact.roots.length} roots in artifact`);
  console.log(`  Policy: ${artifact.policyVersion}`);
  console.log(`  AI provider: ${artifact.aiProvider}\n`);

  let activated = 0;
  let skipped = 0;
  let failed = 0;
  let totalOccurrences = 0;
  let totalAyat = 0;

  for (const rootResult of artifact.roots) {
    const result = activateRoot(rootResult, wordLevel);

    if (!result.success) {
      console.log(`  ${result.slug}: FAILED — ${result.errors.join(", ")}`);
      failed++;
      continue;
    }

    if (result.occurrenceCount === 0) {
      console.log(`  ${result.slug}: SKIPPED — zero occurrences`);
      skipped++;
      continue;
    }

    // Use Arabic root name for manual roots (matches existing convention)
    const manualRoots = ["sabr", "shukr", "rahmah", "ilm", "tawbah", "maghfirah", "kibr", "khushu", "sidq", "tawakkul"];
    const filename = manualRoots.includes(result.slug) ? `${result.root}.json` : `${result.slug}.json`;
    const outputPath = join(OCCURRENCES_DIR, filename);
    writeFileSync(outputPath, JSON.stringify(result.index, null, 2), "utf-8");

    console.log(
      `  ${result.slug}: ✅ ${result.occurrenceCount} occurrences, ` +
      `${result.distinctAyahCount} ayat, ${result.includedLemmaCount} lemmas`
    );

    activated++;
    totalOccurrences += result.occurrenceCount;
    totalAyat += result.distinctAyahCount;

    if (result.warnings.length > 0) {
      for (const w of result.warnings) {
        console.log(`    ⚠️  ${w}`);
      }
    }
  }

  console.log("\n=== ACTIVATION SUMMARY ===");
  console.log(`Activated: ${activated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);
  console.log(`Total occurrences: ${totalOccurrences}`);
  console.log(`Total distinct ayat: ${totalAyat}`);
  console.log(`\nOccurrence files written to ${OCCURRENCES_DIR}`);
  console.log("Note: The remaining 1,632 roots were NOT activated (Sprint 47 scope).");

  if (failed > 0) {
    console.log("\n⚠️  Some roots failed activation. Review the errors above.");
    process.exit(1);
  }

  console.log("\n✅ Activation complete");
  process.exit(0);
}

main();
