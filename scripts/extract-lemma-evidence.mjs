#!/usr/bin/env node
// Sprint 45 — Lemma Evidence Extractor for Human Review
//
// For each of the 10 manual ROOT_ALLOWLIST entries, extracts from the
// morphology index:
//   - All observed lemmas with frequency counts
//   - Lemma distribution (sorted by frequency)
//   - Incompatible lemma flags (from strong-letter heuristic)
//   - Existing CANDIDATE_ROOTS polysemy concerns
//   - Existing allowlist notes
//
// Output: data/human-lemma-review-workbook.json — structured evidence for
// a human reviewer to make inclusion decisions.
//
// This script does NOT make inclusion decisions. It only presents evidence.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const OUTPUT_PATH = join(DATA_DIR, "human-lemma-review-workbook.json");

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

// The 10 manual allowlist entries (mirrored from src/lib/morphology/root-allowlist.ts)
const MANUAL_ROOTS = [
  {
    slug: "sabr",
    title: "Patience",
    arabicTitle: "\u0627\u0644\u0635\u0628\u0631",
    root: "\u0635\u0628\u0631",
    existingNotes: "103 occurrences across 93 ayat, 8 lemmas. Top: \u0635\u064e\u0628\u064e\u0631\u064e (58), \u0635\u064e\u0627\u0628\u0650\u0631\u064f (20), \u0635\u064e\u0628\u0652\u0631\u064c (15). Polysemy: relatively unambiguous \u2014 primary meaning is patience/perseverance.",
    polysemyConcerns: ["Relatively unambiguous \u2014 primary meaning is patience/perseverance"],
  },
  {
    slug: "shukr",
    title: "Gratitude",
    arabicTitle: "\u0627\u0644\u0634\u0643\u0631",
    root: "\u0634\u0643\u0631",
    existingNotes: "75 occurrences across 69 ayat, 6 lemmas. Top: \u0634\u064e\u0643\u064e\u0631\u064e (46), \u0634\u064e\u0627\u0643\u0650\u0631\u064f (14), \u0634\u064e\u0643\u064f\u0648\u0631\u064c (10). Polysemy: relatively unambiguous \u2014 primary meaning is gratitude/thankfulness.",
    polysemyConcerns: ["Relatively unambiguous \u2014 primary meaning is gratitude/thankfulness"],
  },
  {
    slug: "rahmah",
    title: "Mercy",
    arabicTitle: "\u0627\u0644\u0631\u062d\u0645\u0629",
    root: "\u0631\u062d\u0645",
    existingNotes: "339 occurrences across 313 ayat, 9 lemmas. Top: \u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064c (116), \u0631\u064e\u062d\u0652\u0645\u064e\u0629\u064c (114), \u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u064c (57). Polysemy: includes \u0627\u0644\u0623\u0631\u062d\u0627\u0645 (kinship/womb) \u2014 reviewer must decide which lemmas belong to mercy topic.",
    polysemyConcerns: ["Includes \u0627\u0644\u0623\u0631\u062d\u0627\u0645 (kinship/womb) \u2014 would pollute mercy topic", "Reviewer must decide which lemmas belong"],
  },
  {
    slug: "ilm",
    title: "Knowledge",
    arabicTitle: "\u0627\u0644\u0639\u0644\u0645",
    root: "\u0639\u0644\u0645",
    existingNotes: "854 occurrences across 728 ayat, 14 lemmas. Top: \u0639\u064e\u0644\u0650\u0645\u064e (382), \u0639\u064e\u0644\u0650\u064a\u0645\u064c (163), \u0639\u0650\u0644\u0652\u0645\u064c (105). Polysemy: includes \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0646 (the worlds) \u2014 would put 'Rabb al-alamin' ayahs in knowledge topic. Very high frequency root.",
    polysemyConcerns: ["Includes \u0627\u0644\u0639\u0627\u0644\u0645\u064a\u0646 (the worlds) \u2014 would put 'Rabb al-alamin' ayahs in knowledge topic", "Very high frequency root"],
  },
  {
    slug: "tawbah",
    title: "Repentance",
    arabicTitle: "\u0627\u0644\u062a\u0648\u0628\u0629",
    root: "\u062a\u0648\u0628",
    existingNotes: "87 occurrences across 69 ayat, 7 lemmas. Top: \u062a\u064e\u0627\u0628\u064e (63), \u062a\u064e\u0648\u0651\u064e\u0627\u0628\u064c (12), \u062a\u064e\u0648\u0652\u0628\u064e\u0629\u064c (7). Polysemy: relatively unambiguous \u2014 primary meaning is repentance/return.",
    polysemyConcerns: ["Relatively unambiguous \u2014 primary meaning is repentance/return"],
  },
  {
    slug: "maghfirah",
    title: "Forgiveness",
    arabicTitle: "\u0627\u0644\u0645\u063a\u0641\u0631\u0629",
    root: "\u063a\u0641\u0631",
    existingNotes: "234 occurrences across 202 ayat, 10 lemmas. Top: \u063a\u064e\u0641\u064e\u0631\u064e (65), \u063a\u064e\u0641\u064f\u0648\u0631\u064c (58), \u0627\u0633\u0652\u062a\u064e\u063a\u0652\u0641\u064e\u0631\u064e (40). Polysemy: relatively unambiguous \u2014 primary meaning is forgiveness/covering.",
    polysemyConcerns: ["Relatively unambiguous \u2014 primary meaning is forgiveness/covering"],
  },
  {
    slug: "kibr",
    title: "Greatness/Arrogance",
    arabicTitle: "\u0627\u0644\u0643\u0628\u0631",
    root: "\u0643\u0628\u0631",
    existingNotes: "161 occurrences across 153 ayat, 19 lemmas. Top: \u0627\u0633\u0652\u062a\u064e\u0643\u0652\u0628\u064e\u0631\u064e (40), \u0643\u064e\u0628\u0650\u064a\u0631\u064c (40), \u0623\u064e\u0643\u0652\u0628\u064e\u0631\u064c (24). Polysemy: includes \u0623\u0643\u0628\u0631/\u0643\u0628\u064a\u0631 (big/great) AND \u0627\u0633\u062a\u0643\u0628\u0631 (arrogance) \u2014 same root spans neutral size and negative arrogance, reviewer must split lemmas.",
    polysemyConcerns: ["Includes \u0623\u0643\u0628\u0631/\u0643\u0628\u064a\u0631 (big/great) AND \u0627\u0633\u062a\u0643\u0628\u0631 (arrogance)", "Same root spans neutral size and negative arrogance \u2014 reviewer must split lemmas"],
  },
  {
    slug: "khushu",
    title: "Humility",
    arabicTitle: "\u0627\u0644\u062e\u0636\u0648\u0639",
    root: "\u062e\u0634\u0639",
    existingNotes: "17 occurrences across 16 ayat, 3 lemmas. Top: \u062e\u064e\u0627\u0634\u0650\u0639\u064c (14), \u062e\u064e\u0634\u064e\u0639\u064e\u062a\u0650 (2), \u062e\u064f\u0634\u064f\u0648\u0639\u064c (1). Polysemy: relatively unambiguous \u2014 primary meaning is humility/submission.",
    polysemyConcerns: ["Relatively unambiguous \u2014 primary meaning is humility/submission"],
  },
  {
    slug: "sidq",
    title: "Truthfulness",
    arabicTitle: "\u0627\u0644\u0635\u062f\u0642",
    root: "\u0635\u062f\u0642",
    existingNotes: "155 occurrences across 144 ayat, 19 lemmas. Top: \u0635\u064e\u0627\u062f\u0650\u0642\u064c (59), \u0645\u064f\u0635\u064e\u062f\u0651\u0650\u0642\u064c (19), \u0635\u064e\u062f\u064e\u0642\u064e (15). Polysemy: includes \u0635\u062f\u0642\u0629 (charity) \u2014 would pollute truthfulness topic, reviewer must exclude charity-related lemmas.",
    polysemyConcerns: ["Includes \u0635\u062f\u0642\u0629 (charity) \u2014 would pollute truthfulness topic", "Reviewer must exclude charity-related lemmas"],
  },
  {
    slug: "tawakkul",
    title: "Trust/Delegation",
    arabicTitle: "\u0627\u0644\u062a\u0648\u0643\u0644",
    root: "\u0648\u0643\u0644",
    existingNotes: "70 occurrences across 61 ayat, 4 lemmas. Top: \u062a\u064e\u0648\u064e\u0643\u0651\u064e\u0644\u0652 (40), \u0648\u064e\u0643\u0650\u064a\u0644\u064c (24), \u0645\u064f\u062a\u064e\u0648\u064e\u0643\u0651\u0650\u0644\u064f\u0648\u0646\u064e (4). Polysemy: includes \u0648\u0643\u064a\u0644 (guardian/agent) and \u062a\u0648\u0643\u0644 (trust in God) \u2014 may need lemma-level split between legal agency and spiritual trust.",
    polysemyConcerns: ["Includes \u0648\u0643\u064a\u0644 (guardian/agent) and \u062a\u0648\u0643\u0644 (trust in God)", "May need lemma-level split between legal agency and spiritual trust"],
  },
];

function main() {
  console.log("=== Lemma Evidence Extractor for Human Review ===\n");

  if (!existsSync(INDEX_PATH)) {
    console.error(`FATAL: morphology index not found at ${INDEX_PATH}`);
    process.exit(1);
  }

  console.log("Loading morphology index...");
  const index = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  console.log(`  ${index.length} records loaded`);

  const wordLevel = index.filter((r) => r.wordPosition !== undefined);
  console.log(`  ${wordLevel.length} word-level records`);

  const workbook = {
    generatedAt: new Date().toISOString(),
    generator: "scripts/extract-lemma-evidence.mjs",
    sourceDataset: "qul-morphology-v1",
    purpose:
      "Evidence workbook for human lemma review of the 10 manual ROOT_ALLOWLIST entries. The reviewer fills in `inclusionDecision` and `reviewerStatus` for each root. This script makes NO inclusion decisions.",
    instructions:
      "For each root: (1) examine the lemma distribution, (2) consider the polysemy concerns, (3) mark each lemma as 'include' or 'exclude' in the reviewerDecision field, (4) set reviewerStatus to 'approved' when complete. The includedLemmas array in root-allowlist.ts should then be populated with the approved lemmas.",
    roots: [],
  };

  for (const manual of MANUAL_ROOTS) {
    console.log(`\nProcessing root: ${manual.root} (${manual.slug})...`);

    // Extract records for this root
    const records = wordLevel.filter((r) => r.root === manual.root);
    const totalRecords = records.length;

    // Distinct ayat
    const ayahSet = new Set();
    for (const r of records) {
      ayahSet.add(`${r.ref.surah}:${r.ref.ayah}`);
    }
    const distinctAyat = ayahSet.size;

    // Lemma distribution
    const lemmaCounts = new Map();
    let recordsWithLemma = 0;
    let recordsWithoutLemma = 0;
    for (const r of records) {
      if (r.lemma) {
        lemmaCounts.set(r.lemma, (lemmaCounts.get(r.lemma) ?? 0) + 1);
        recordsWithLemma++;
      } else {
        recordsWithoutLemma++;
      }
    }

    const lemmaDistribution = Array.from(lemmaCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([lemma, count]) => {
        const needle = strongLetters(manual.root);
        const compatible =
          needle.length === 0 ||
          isOrderedSubsequence(needle, strongLetters(lemma));
        return {
          lemma,
          count,
          percentage: totalRecords > 0 ? (count / totalRecords) * 100 : 0,
          consonantallyCompatible: compatible,
          reviewerDecision: null, // Human fills: "include" | "exclude" | "undecided"
          reviewerRationale: null, // Human fills
        };
      });

    const incompatibleLemmas = lemmaDistribution.filter(
      (l) => !l.consonantallyCompatible
    );

    // Sample ayat (first 10 by canonical order)
    const sortedRecords = [...records].sort((a, b) => {
      if (a.ref.surah !== b.ref.surah) return a.ref.surah - b.ref.surah;
      if (a.ref.ayah !== b.ref.ayah) return a.ref.ayah - b.ref.ayah;
      return (a.wordPosition ?? 0) - (b.wordPosition ?? 0);
    });
    const sampleAyat = sortedRecords.slice(0, 10).map((r) => ({
      surah: r.ref.surah,
      ayah: r.ref.ayah,
      token: r.token,
      lemma: r.lemma ?? null,
      wordPosition: r.wordPosition,
    }));

    const lemmaCoverage =
      totalRecords > 0 ? recordsWithLemma / totalRecords : 0;

    workbook.roots.push({
      slug: manual.slug,
      title: manual.title,
      arabicTitle: manual.arabicTitle,
      root: manual.root,
      existingAllowlistNotes: manual.existingNotes,
      polysemyConcerns: manual.polysemyConcerns,
      totalWordRecords: totalRecords,
      distinctAyat,
      recordsWithLemma,
      recordsWithoutLemma,
      lemmaCoverage,
      lemmaDistribution,
      incompatibleLemmaCount: incompatibleLemmas.length,
      incompatibleLemmas: incompatibleLemmas.map((l) => ({
        lemma: l.lemma,
        count: l.count,
      })),
      sampleAyat,
      // === HUMAN REVIEW FIELDS (to be filled) ===
      reviewerStatus: "pending-review", // "pending-review" | "approved" | "rejected"
      reviewerIdentity: null,
      reviewDate: null,
      finalIncludedLemmas: null, // Array of lemma strings the reviewer approves
      finalExcludedLemmas: null, // Array of lemma strings the reviewer excludes
      reviewerNotes: null,
    });

    console.log(
      `  ${totalRecords} records, ${distinctAyat} ayat, ${lemmaDistribution.length} lemmas, ${incompatibleLemmas.length} incompatible`
    );
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(workbook, null, 2), "utf-8");
  console.log(`\nWorkbook written to ${OUTPUT_PATH}`);
  console.log(`  ${workbook.roots.length} roots prepared for review`);

  // Summary table
  console.log("\n=== REVIEW SUMMARY ===");
  console.log(
    "slug         root   records  ayat  lemmas  incompat  polysemy-concern"
  );
  for (const r of workbook.roots) {
    const concern =
      r.polysemyConcerns.length > 1 ? "HIGH" : r.polysemyConcerns[0].startsWith("Relatively") ? "LOW" : "MEDIUM";
    console.log(
      `${r.slug.padEnd(12)} ${r.root.padEnd(5)}  ${String(r.totalWordRecords).padStart(7)}  ${String(r.distinctAyat).padStart(4)}  ${String(r.lemmaDistribution.length).padStart(6)}  ${String(r.incompatibleLemmaCount).padStart(8)}  ${concern}`
    );
  }

  process.exit(0);
}

main();
