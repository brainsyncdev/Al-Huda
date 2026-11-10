#!/usr/bin/env node
// Sprint 47 — Automated Morphology Review runner (ESM, bare `node`).
//
// Mirrors the TypeScript engine in src/lib/morphology/auto-review/ so it can
// run without a TypeScript loader (the sandbox blocks `tsx`/`npx`). The logic
// here MUST stay identical to deterministic.ts + decision.ts; the regression
// suite asserts the same classifications on the TS side.
//
// Usage:
//   node scripts/run-automated-morphology-review.mjs            # 10 manual roots
//   node scripts/run-automated-morphology-review.mjs --all      # all discovered roots
//   node scripts/run-automated-morphology-review.mjs --roots=sabr,ilm
//
// Outputs:
//   data/automated-morphology-review.json          (pilot / selected roots)
//   data/automated-morphology-batch-dryrun.json    (--all)
//
// This script never modifies morphology-index.json and never activates roots.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const PILOT_OUT = join(DATA_DIR, "automated-morphology-review.json");
const BATCH_OUT = join(DATA_DIR, "automated-morphology-batch-dryrun.json");

const POLICY_VERSION = "1.0.0";
const SCHEMA_VERSION = 1;
const SOURCE_DATASET = "qul-morphology-v1";

const MANUAL_ROOTS = [
  { slug: "sabr", root: "\u0635\u0628\u0631" },
  { slug: "shukr", root: "\u0634\u0643\u0631" },
  { slug: "rahmah", root: "\u0631\u062d\u0645" },
  { slug: "ilm", root: "\u0639\u0644\u0645" },
  { slug: "tawbah", root: "\u062a\u0648\u0628" },
  { slug: "maghfirah", root: "\u063a\u0641\u0631" },
  { slug: "kibr", root: "\u0643\u0628\u0631" },
  { slug: "khushu", root: "\u062e\u0634\u0639" },
  { slug: "sidq", root: "\u0635\u062f\u0642" },
  { slug: "tawakkul", root: "\u0648\u0643\u0644" },
];

// === Layer A: deterministic (mirrors deterministic.ts) ===

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

function hasWeakLetters(text) {
  return normalizeLetters(text).some((c) => WEAK_LETTERS.has(c));
}

function orderedMatchLength(needle, haystack) {
  let i = 0;
  for (const c of haystack) {
    if (i < needle.length && c === needle[i]) i += 1;
  }
  return i;
}

function runStructuralChecks(records) {
  const hasSourceRecords = records.length > 0;
  const hasWordLocations =
    hasSourceRecords &&
    records.every(
      (r) => r.wordPosition !== undefined && Number.isInteger(r.wordPosition) && r.wordPosition >= 1
    );
  const hasLemmas =
    hasSourceRecords && records.every((r) => typeof r.lemma === "string" && r.lemma.length > 0);

  const seen = new Set();
  let duplicates = 0;
  for (const r of records) {
    const key = `${r.ref.surah}:${r.ref.ayah}:${r.wordPosition ?? ""}`;
    if (seen.has(key)) duplicates += 1;
    else seen.add(key);
  }

  return { hasSourceRecords, hasWordLocations, hasLemmas, noDuplicates: duplicates === 0 };
}

function classifyCompatibility(root, lemma) {
  const rootStrong = strongLetters(root);
  const lemmaStrong = strongLetters(lemma);
  const rootHasWeakLetters = hasWeakLetters(root);
  const lemmaHasWeakLetters = hasWeakLetters(lemma);
  const matched = orderedMatchLength(rootStrong, lemmaStrong);

  const detail = {
    sharedStrongLetters: matched,
    rootStrongLetterCount: rootStrong.length,
    rootHasWeakLetters,
  };

  if (rootStrong.length > 0 && matched === rootStrong.length) {
    return { result: "compatible", detail };
  }
  if (rootStrong.length === 0) return { result: "inconclusive", detail };
  if (rootHasWeakLetters || lemmaHasWeakLetters) return { result: "inconclusive", detail };
  if (matched === 0) return { result: "contradicted", detail };
  return { result: "inconclusive", detail };
}

// === Layer C: decision (mirrors decision.ts) ===

function decideOutcome(input) {
  const reasonCodes = [];

  if (!input.hasSourceRecords) {
    return {
      outcome: "needs-review",
      reasonCodes: ["MISSING_SOURCE_RECORDS"],
      explanation:
        "No word-level source records found for this lemma in the QUL morphology dataset. " +
        "Missing evidence requires further morphological review; it is never grounds for rejection.",
    };
  }
  if (!input.structuralChecks.hasLemmas) {
    return {
      outcome: "needs-review",
      reasonCodes: ["MISSING_LEMMA_FIELD"],
      explanation: "One or more source records have an empty lemma field.",
    };
  }
  if (!input.structuralChecks.hasWordLocations) {
    return {
      outcome: "needs-review",
      reasonCodes: ["MISSING_WORD_LOCATIONS"],
      explanation: "One or more source records lack a valid word position.",
    };
  }
  if (!input.structuralChecks.noDuplicates) {
    return {
      outcome: "needs-review",
      reasonCodes: ["DUPLICATE_POSITIONS"],
      explanation: "Duplicate surah:ayah:wordPosition entries detected.",
    };
  }

  if (input.compatibilityResult === "contradicted") {
    // Policy 47: a heuristic failure is NOT authoritative evidence. Never reject.
    return {
      outcome: "needs-review",
      reasonCodes: ["CONSONANTAL_CONTRADICTION_HEURISTIC"],
      explanation:
        "Requires further morphological review: the lemma's consonantal skeleton shares zero " +
        "structure with the assigned root and no weak-letter derivation explains the gap. " +
        "This heuristic signal is not sufficient for rejection.",
    };
  }

  if (input.compatibilityResult === "inconclusive") {
    reasonCodes.push("COMPATIBILITY_INCONCLUSIVE");
    if (input.rootHasWeakLetters) reasonCodes.push("WEAK_LETTER_DERIVATION");
    return {
      outcome: "needs-review",
      reasonCodes,
      explanation:
        "The mapping is source-backed but morphological compatibility is inconclusive. " +
        "Requires further morphological analysis or human review.",
    };
  }

  return {
    outcome: "auto-accepted",
    reasonCodes: ["ALL_CHECKS_PASS", "COMPATIBILITY_CONFIRMED"],
    explanation:
      "Automated morphological acceptance: source-backed, all structural checks pass, " +
      "consonantal skeleton fully compatible. Not a scholarly or thematic classification.",
  };
}

// === Orchestration ===

function reviewRoot(slug, root, wordLevel, reviewedAt) {
  const rootRecords = wordLevel.filter((r) => r.root === root);

  const groups = new Map();
  let recordsWithoutLemma = 0;
  for (const r of rootRecords) {
    if (!r.lemma) { recordsWithoutLemma += 1; continue; }
    if (!groups.has(r.lemma)) groups.set(r.lemma, []);
    groups.get(r.lemma).push(r);
  }

  const lemmas = [];
  let autoAccepted = 0, needsReview = 0, rejected = 0, totalOccurrences = 0;
  const ayahSet = new Set();
  const activatableAyahSet = new Set();
  let activatableOccurrences = 0;

  const sortedLemmas = [...groups.keys()].sort();
  for (const lemma of sortedLemmas) {
    const records = groups.get(lemma);
    const structuralChecks = runStructuralChecks(records);
    const { result, detail } = classifyCompatibility(root, lemma);
    const decision = decideOutcome({
      hasSourceRecords: records.length > 0,
      structuralChecks,
      compatibilityResult: result,
      aiRecommendation: null,
      rootHasWeakLetters: detail.rootHasWeakLetters,
    });

    if (decision.outcome === "auto-accepted") {
      autoAccepted += 1;
      activatableOccurrences += records.length;
      for (const r of records) activatableAyahSet.add(`${r.ref.surah}:${r.ref.ayah}`);
    } else if (decision.outcome === "needs-review") needsReview += 1;
    else rejected += 1;

    totalOccurrences += records.length;
    for (const r of records) ayahSet.add(`${r.ref.surah}:${r.ref.ayah}`);

    lemmas.push({
      root,
      rootSlug: slug,
      lemma,
      sourceLemmaId: null,
      sourceDataset: SOURCE_DATASET,
      sourceOccurrenceCount: records.length,
      sourceWordLocations: records
        .slice(0, 10)
        .map((r) => `${r.ref.surah}:${r.ref.ayah}:${r.wordPosition ?? "?"}`),
      deterministicChecks: structuralChecks,
      compatibilityResult: result,
      compatibilityDetail: detail,
      aiRecommendation: null,
      outcome: decision.outcome,
      reasonCodes: decision.reasonCodes,
      explanation: decision.explanation,
      policyVersion: POLICY_VERSION,
      reviewerOverride: null,
      reviewedAt,
    });
  }

  return {
    slug,
    root,
    lemmas,
    summary: {
      totalLemmas: lemmas.length,
      autoAccepted,
      needsReview,
      rejected,
      reviewerOverrides: 0,
      totalOccurrences,
      distinctAyat: ayahSet.size,
      recordsWithoutLemma,
      activatableOccurrences,
      activatableDistinctAyat: activatableAyahSet.size,
    },
  };
}

function main() {
  const argv = process.argv.slice(2);
  const all = argv.includes("--all");
  const rootsArg = argv.find((a) => a.startsWith("--roots="));

  if (!existsSync(INDEX_PATH)) {
    console.error(`FATAL: morphology index not found at ${INDEX_PATH}`);
    process.exit(1);
  }

  console.log("=== Sprint 47: Automated Morphology Review ===");
  console.log(`Policy: ${POLICY_VERSION}`);
  console.log("AI provider: none (no provider configured; Layer B returns null)\n");

  const index = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  const wordLevel = index.filter((r) => r.wordPosition !== undefined && r.root);
  console.log(`Morphology records: ${index.length}`);
  console.log(`Word-level records with root: ${wordLevel.length}`);

  let targets;
  if (all) {
    const distinct = [...new Set(wordLevel.map((r) => r.root))].sort((a, b) => a.localeCompare(b));
    const manualByRoot = new Map(MANUAL_ROOTS.map((m) => [m.root, m.slug]));
    targets = distinct.map((root) => ({ slug: manualByRoot.get(root) ?? root, root }));
  } else if (rootsArg) {
    const wanted = rootsArg.slice("--roots=".length).split(",").map((s) => s.trim());
    targets = MANUAL_ROOTS.filter((m) => wanted.includes(m.slug));
  } else {
    targets = MANUAL_ROOTS;
  }

  console.log(`Roots to process: ${targets.length}\n`);

  const reviewedAt = new Date().toISOString();
  const roots = [];
  let tL = 0, tA = 0, tN = 0, tR = 0, tOcc = 0, tActOcc = 0, tMissingLemma = 0;

  for (const { slug, root } of targets) {
    const res = reviewRoot(slug, root, wordLevel, reviewedAt);
    roots.push(res);
    tL += res.summary.totalLemmas;
    tA += res.summary.autoAccepted;
    tN += res.summary.needsReview;
    tR += res.summary.rejected;
    tOcc += res.summary.totalOccurrences;
    tActOcc += res.summary.activatableOccurrences;
    tMissingLemma += res.summary.recordsWithoutLemma;
  }

  const artifact = {
    schemaVersion: SCHEMA_VERSION,
    policyVersion: POLICY_VERSION,
    generatedAt: reviewedAt,
    sourceDataset: SOURCE_DATASET,
    aiProvider: "none",
    scope: all ? "all-discovered-roots" : "manual-pilot",
    activationPerformed: false,
    roots,
    globalSummary: {
      totalRootsProcessed: roots.length,
      totalLemmasEvaluated: tL,
      totalAutoAccepted: tA,
      totalNeedsReview: tN,
      totalRejected: tR,
      totalReviewerOverrides: 0,
      totalSourceOccurrences: tOcc,
      totalActivatableOccurrences: tActOcc,
      totalRecordsWithoutLemma: tMissingLemma,
    },
  };

  const outPath = all ? BATCH_OUT : PILOT_OUT;
  writeFileSync(outPath, JSON.stringify(artifact, null, 2), "utf-8");

  if (!all) {
    console.log("slug          lemmas  auto  review  reject  occ   activatableOcc  noLemma");
    for (const r of roots) {
      const s = r.summary;
      console.log(
        `${r.slug.padEnd(12)} ${String(s.totalLemmas).padStart(6)} ${String(s.autoAccepted).padStart(5)} ` +
        `${String(s.needsReview).padStart(7)} ${String(s.rejected).padStart(7)} ` +
        `${String(s.totalOccurrences).padStart(5)} ${String(s.activatableOccurrences).padStart(15)} ` +
        `${String(s.recordsWithoutLemma).padStart(8)}`
      );
    }
    console.log("\n--- needs-review lemmas (pilot) ---");
    for (const r of roots) {
      for (const l of r.lemmas) {
        if (l.outcome !== "auto-accepted") {
          console.log(`  ${r.slug} / ${l.lemma} : ${l.compatibilityResult} [${l.reasonCodes.join(", ")}]`);
        }
      }
    }
  }

  console.log("\n=== GLOBAL SUMMARY ===");
  console.log(`Roots processed:        ${artifact.globalSummary.totalRootsProcessed}`);
  console.log(`Lemmas evaluated:       ${tL}`);
  console.log(`Auto-accepted:          ${tA}`);
  console.log(`Needs-review:           ${tN}`);
  console.log(`Rejected:               ${tR}`);
  console.log(`Source occurrences:     ${tOcc}`);
  console.log(`Activatable occurrences:${tActOcc}`);
  console.log(`Records without lemma:  ${tMissingLemma}`);
  console.log(`\nArtifact written to ${outPath}`);
  console.log("No roots were activated by this script.");
  process.exit(0);
}

main();
