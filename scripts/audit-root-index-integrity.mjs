#!/usr/bin/env node
// Sprint 45 — Independent Root Index Integrity Audit (ESM/JavaScript)
//
// Reconstructs expected root statistics from morphology-index.json independently
// of the discovery/batch-publication pipeline, then compares against the
// generated occurrence files and batch-publication-report.json.
//
// Usage:  node scripts/audit-root-index-integrity.mjs
// Output: data/root-index-integrity-report.json
//         data/blocked-root-analysis.json
// Exit:   0 when critical invariants hold, 1 otherwise.

import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.cwd(), "data");
const INDEX_PATH = join(DATA_DIR, "morphology-index.json");
const OCCURRENCES_DIR = join(DATA_DIR, "root-occurrences");
const REPORT_PATH = join(DATA_DIR, "batch-publication-report.json");
const INTEGRITY_REPORT_PATH = join(DATA_DIR, "root-index-integrity-report.json");
const BLOCKED_ANALYSIS_PATH = join(DATA_DIR, "blocked-root-analysis.json");

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
  console.log("=== Sprint 45: Root Index Integrity Audit ===\n");

  if (!existsSync(INDEX_PATH)) {
    console.error(`FATAL: morphology index not found at ${INDEX_PATH}`);
    process.exit(1);
  }
  console.log("Loading morphology index...");
  const index = JSON.parse(readFileSync(INDEX_PATH, "utf-8"));
  console.log(`  ${index.length} records loaded`);

  const wordLevelWithRoot = index.filter(
    (r) => r.wordPosition !== undefined && r.root
  );
  console.log(`  ${wordLevelWithRoot.length} word-level records with root`);

  // Build independent root statistics
  console.log("\nBuilding independent root statistics...");
  const rootStats = new Map();
  for (const record of wordLevelWithRoot) {
    const root = record.root;
    if (!rootStats.has(root)) {
      rootStats.set(root, {
        records: [],
        distinctAyat: new Set(),
        lemmas: new Map(),
        recordsWithLemma: 0,
        recordsWithoutLemma: 0,
      });
    }
    const stats = rootStats.get(root);
    stats.records.push(record);
    stats.distinctAyat.add(`${record.ref.surah}:${record.ref.ayah}`);
    if (record.lemma) {
      stats.lemmas.set(record.lemma, (stats.lemmas.get(record.lemma) ?? 0) + 1);
      stats.recordsWithLemma++;
    } else {
      stats.recordsWithoutLemma++;
    }
  }
  console.log(`  ${rootStats.size} distinct roots found`);

  // Load batch publication report
  let batchDecisions = [];
  let batchReportRaw = null;
  if (existsSync(REPORT_PATH)) {
    console.log("\nLoading batch publication report...");
    batchReportRaw = JSON.parse(readFileSync(REPORT_PATH, "utf-8"));
    batchDecisions = batchReportRaw.decisions ?? [];
    console.log(`  ${batchDecisions.length} decisions loaded`);
  }

  // Load occurrence files
  console.log("\nLoading occurrence files...");
  const occurrenceFiles = new Map();
  if (existsSync(OCCURRENCES_DIR)) {
    const files = readdirSync(OCCURRENCES_DIR).filter((f) => f.endsWith(".json"));
    for (const file of files) {
      const slug = file.replace(".json", "");
      try {
        const content = JSON.parse(
          readFileSync(join(OCCURRENCES_DIR, file), "utf-8")
        );
        occurrenceFiles.set(slug, content);
      } catch (e) {
        console.error(`  Failed to parse ${file}: ${e.message}`);
      }
    }
  }
  console.log(`  ${occurrenceFiles.size} occurrence files loaded`);

  // Audit each root from the independent reconstruction
  console.log("\nAuditing root indexes...");
  const integrityResults = [];
  let passCount = 0;
  let failCount = 0;
  let warningCount = 0;

  for (const [root, stats] of rootStats.entries()) {
    const slug = root;
    const occurrence = occurrenceFiles.get(slug);
    const batchDecision = batchDecisions.find(
      (d) => d.slug === slug || d.root === root
    );

    const expectedWordRecords = stats.records.length;
    const expectedDistinctAyat = stats.distinctAyat.size;
    const includedLemmas = occurrence?.entry?.includedLemmas ?? [];
    const includedLemmasCount = includedLemmas.length;

    let expectedMatchesGivenLemmas = 0;
    if (includedLemmasCount > 0) {
      const lemmaSet = new Set(includedLemmas);
      for (const record of stats.records) {
        if (record.lemma && lemmaSet.has(record.lemma)) {
          expectedMatchesGivenLemmas++;
        }
      }
    }

    const actualTotalMatches = occurrence?.totalMatches ?? -1;
    const actualUniqueAyahs = occurrence?.uniqueAyahs?.length ?? -1;
    const actualOccurrences = occurrence?.occurrences?.length ?? -1;

    const failureReasons = [];
    const warnings = [];
    let integrityStatus = "pass";

    if (!occurrence) {
      if (batchDecision && batchDecision.decision === "publish") {
        failureReasons.push("Occurrence file missing for published root");
        integrityStatus = "fail";
      } else {
        integrityStatus = "pass";
      }
    } else {
      if (!occurrence.entry || !occurrence.entry.roots || occurrence.entry.roots.length === 0) {
        failureReasons.push("Entry has empty or missing roots array");
        integrityStatus = "fail";
      }
      if (occurrence.totalMatches !== occurrence.occurrences.length) {
        failureReasons.push(
          `totalMatches (${occurrence.totalMatches}) != occurrences.length (${occurrence.occurrences.length})`
        );
        integrityStatus = "fail";
      }
      if (occurrence.totalOccurrences !== occurrence.occurrences.length) {
        failureReasons.push(
          `totalOccurrences (${occurrence.totalOccurrences}) != occurrences.length (${occurrence.occurrences.length})`
        );
        integrityStatus = "fail";
      }
      if (includedLemmasCount === 0 && occurrence.totalMatches !== 0) {
        failureReasons.push(
          `includedLemmas is empty but totalMatches is ${occurrence.totalMatches} — should be 0`
        );
        integrityStatus = "fail";
      }
      if (includedLemmasCount > 0 && occurrence.totalMatches !== expectedMatchesGivenLemmas) {
        failureReasons.push(
          `totalMatches (${occurrence.totalMatches}) != expected from lemmas (${expectedMatchesGivenLemmas})`
        );
        integrityStatus = "fail";
      }
      if (occurrence.occurrences.length > 0) {
        const expectedUniqueFromOccurrences = new Set(
          occurrence.occurrences.map((o) => `${o.ref.surah}:${o.ref.ayah}`)
        ).size;
        if (occurrence.uniqueAyahs.length !== expectedUniqueFromOccurrences) {
          failureReasons.push(
            `uniqueAyahs (${occurrence.uniqueAyahs.length}) != expected (${expectedUniqueFromOccurrences})`
          );
          integrityStatus = "fail";
        }
      }
      if (occurrence.occurrences.length > 0) {
        const seen = new Set();
        let duplicates = 0;
        for (const occ of occurrence.occurrences) {
          const key = `${occ.ref.surah}:${occ.ref.ayah}:${occ.wordPosition ?? ""}:${occ.matchedToken}`;
          if (seen.has(key)) duplicates++;
          seen.add(key);
        }
        if (duplicates > 0) {
          failureReasons.push(`${duplicates} duplicate occurrences found`);
          integrityStatus = "fail";
        }
      }
      if (occurrence.occurrences.length > 0) {
        const rootSet = new Set(occurrence.entry.roots);
        let wrongRoot = 0;
        for (const occ of occurrence.occurrences) {
          if (!rootSet.has(occ.matchedRoot)) wrongRoot++;
        }
        if (wrongRoot > 0) {
          failureReasons.push(`${wrongRoot} occurrences with wrong root association`);
          integrityStatus = "fail";
        }
      }
      if (occurrence.occurrences.length > 0 && includedLemmasCount > 0) {
        const lemmaSet = new Set(includedLemmas);
        let unbacked = 0;
        for (const occ of occurrence.occurrences) {
          if (!lemmaSet.has(occ.matchedLemma)) unbacked++;
        }
        if (unbacked > 0) {
          failureReasons.push(`${unbacked} occurrences with lemma not in includedLemmas`);
          integrityStatus = "fail";
        }
      }
      if (occurrence.occurrences.length > 0) {
        let noWordPos = 0;
        for (const occ of occurrence.occurrences) {
          if (occ.wordPosition === undefined || occ.wordPosition < 1) noWordPos++;
        }
        if (noWordPos > 0) {
          warnings.push(`${noWordPos} occurrences missing valid wordPosition`);
          if (integrityStatus === "pass") integrityStatus = "warning";
        }
      }
    }

    if (integrityStatus === "pass") passCount++;
    else if (integrityStatus === "fail") failCount++;
    else warningCount++;

    integrityResults.push({
      root,
      slug,
      expectedWordRecords,
      expectedDistinctAyat,
      actualTotalMatches,
      actualUniqueAyahs,
      actualOccurrences,
      includedLemmasCount,
      expectedMatchesGivenLemmas,
      reviewState: occurrence?.entry?.reviewState ?? "no-file",
      assertedBy: occurrence?.entry?.assertedBy ?? "n/a",
      sourceDatasetVersion: "qul-morphology-v1",
      policyVersion: "2.0.0",
      integrityStatus,
      failureReasons,
      warnings,
    });
  }

  integrityResults.sort((a, b) => a.root.localeCompare(b.root));

  console.log(`\n  Pass: ${passCount}`);
  console.log(`  Fail: ${failCount}`);
  console.log(`  Warning: ${warningCount}`);

  // === BLOCKED ROOT ANALYSIS ===
  console.log("\n\nAnalyzing blocked/needs-review roots...");
  const blockedAnalysis = [];

  const needsReviewDecisions = batchDecisions.filter(
    (d) => d.decision === "needs-review" || d.decision === "blocked"
  );

  for (const decision of needsReviewDecisions) {
    const root = decision.root;
    const stats = rootStats.get(root);

    if (!stats) {
      blockedAnalysis.push({
        root,
        slug: decision.slug,
        wordLevelOccurrences: 0,
        distinctAyat: 0,
        lemmaCoverage: 0,
        recordsWithLemma: 0,
        recordsWithoutLemma: 0,
        observedLemmas: [],
        incompatibleLemmas: [],
        failureCategory: "missing-source-provenance",
        validationErrors: ["Root not found in morphology index"],
        validationWarnings: [],
        decisionReasons: decision.reasons,
        deterministicRemediationPossible: false,
        humanReviewRequired: true,
        shouldRemainBlocked: true,
        remediationNotes: "Root not found in source data — cannot remediate.",
      });
      continue;
    }

    const recordsWithLemma = stats.recordsWithLemma;
    const recordsWithoutLemma = stats.recordsWithoutLemma;
    const lemmaCoverage =
      stats.records.length > 0 ? recordsWithLemma / stats.records.length : 0;

    const observedLemmas = Array.from(stats.lemmas.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([lemma]) => lemma);

    const needle = strongLetters(root);
    const incompatibleCounts = new Map();
    if (needle.length > 0) {
      for (const record of stats.records) {
        if (!record.lemma) continue;
        if (!isOrderedSubsequence(needle, strongLetters(record.lemma))) {
          incompatibleCounts.set(
            record.lemma,
            (incompatibleCounts.get(record.lemma) ?? 0) + 1
          );
        }
      }
    }

    const incompatibleLemmas = Array.from(incompatibleCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([lemma, count]) => ({ lemma, count }));

    let failureCategory;
    let deterministicRemediationPossible = false;
    let humanReviewRequired = true;
    let shouldRemainBlocked = true;
    let remediationNotes = "";

    const reasonText = decision.reasons.join(" ").toLowerCase();

    if (incompatibleLemmas.length > 0 && reasonText.includes("cannot derive")) {
      failureCategory = "incompatible-lemma-mappings";
      remediationNotes = `${incompatibleLemmas.length} lemmas cannot derive from root "${root}" by consonantal skeleton analysis. These are source-mapping concerns from the QUL morphology dataset. Human review needed to determine if these are legitimate weak-root derivations, orthographic variants, or genuine source errors.`;
      const rootHasWeakLetters = needle.length < normalizeLetters(root).length;
      if (rootHasWeakLetters) {
        remediationNotes += ` Root has weak letters — some incompatible classifications may be false positives from the strong-letter heuristic.`;
      }
    } else if (reasonText.includes("ambiguity")) {
      failureCategory = "ambiguous-lemma-selection";
      remediationNotes = "Documented polysemy: the root has lemmas with different senses that require human disambiguation.";
    } else if (reasonText.includes("duplicate") || reasonText.includes("conflicting")) {
      failureCategory = "duplicate-or-conflicting-positions";
      remediationNotes = "Structural defect in source data — may be deterministically fixable if the duplicates can be identified.";
      deterministicRemediationPossible = true;
    } else if (reasonText.includes("alignment") || reasonText.includes("invalid")) {
      failureCategory = "invalid-occurrence-alignment";
      remediationNotes = "Occurrence alignment failure — requires investigation of specific records.";
    } else if (reasonText.includes("source") || reasonText.includes("provenance")) {
      failureCategory = "missing-source-provenance";
      remediationNotes = "Source data does not provide sufficient evidence for this root.";
    } else if (reasonText.includes("policy") || reasonText.includes("version")) {
      failureCategory = "unsupported-policy-version";
      remediationNotes = "Policy version mismatch — may be fixable by re-running the pipeline.";
      deterministicRemediationPossible = true;
    } else if (reasonText.includes("lemma")) {
      failureCategory = "ambiguous-lemma-selection";
      remediationNotes = "Lemma selection requires human review.";
    } else {
      failureCategory = "other-validation-failure";
      remediationNotes = `Unclassified failure: ${decision.reasons.join("; ")}`;
    }

    if (failureCategory === "incompatible-lemma-mappings") {
      if (incompatibleLemmas.length === observedLemmas.length) {
        remediationNotes += " ALL observed lemmas are flagged as incompatible — this is likely a root identification issue in the source data, not a lemma selection issue.";
      }
    }

    blockedAnalysis.push({
      root,
      slug: decision.slug,
      wordLevelOccurrences: stats.records.length,
      distinctAyat: stats.distinctAyat.size,
      lemmaCoverage,
      recordsWithLemma,
      recordsWithoutLemma,
      observedLemmas,
      incompatibleLemmas,
      failureCategory,
      validationErrors: decision.reasons.filter((r) =>
        r.toLowerCase().includes("error") || r.toLowerCase().includes("cannot")
      ),
      validationWarnings: decision.reasons.filter((r) =>
        r.toLowerCase().includes("warning") || r.toLowerCase().includes("disclosed")
      ),
      decisionReasons: decision.reasons,
      deterministicRemediationPossible,
      humanReviewRequired,
      shouldRemainBlocked,
      remediationNotes,
    });
  }

  blockedAnalysis.sort((a, b) => a.root.localeCompare(b.root));

  console.log(`  ${blockedAnalysis.length} blocked/needs-review roots analyzed`);

  const categoryBreakdown = new Map();
  for (const b of blockedAnalysis) {
    categoryBreakdown.set(b.failureCategory, (categoryBreakdown.get(b.failureCategory) ?? 0) + 1);
  }

  // === WRITE REPORTS ===
  console.log("\nWriting integrity report...");

  const integrityReport = {
    auditTimestamp: new Date().toISOString(),
    auditTool: "scripts/audit-root-index-integrity.mjs",
    sourceDataset: "qul-morphology-v1",
    policyVersion: "2.0.0",
    morphologyIndexRecords: index.length,
    wordLevelRecordsWithRoot: wordLevelWithRoot.length,
    distinctRootsInSource: rootStats.size,
    occurrenceFilesOnDisk: occurrenceFiles.size,
    batchDecisionsLoaded: batchDecisions.length,
    summary: {
      totalAudited: integrityResults.length,
      pass: passCount,
      fail: failCount,
      warning: warningCount,
    },
    criticalInvariants: {
      allPublishedFilesExist:
        failCount === 0 ||
        !integrityResults.some(
          (r) => r.integrityStatus === "fail" && r.failureReasons.includes("Occurrence file missing for published root")
        ),
      noPhantomOccurrences: !integrityResults.some((r) =>
        r.failureReasons.some((f) => f.includes("includedLemmas is empty but totalMatches"))
      ),
      noDuplicateOccurrences: !integrityResults.some((r) =>
        r.failureReasons.some((f) => f.includes("duplicate occurrences"))
      ),
      totalMatchesConsistent: !integrityResults.some((r) =>
        r.failureReasons.some((f) => f.includes("totalMatches") && f.includes("!="))
      ),
      rootAssociationCorrect: !integrityResults.some((r) =>
        r.failureReasons.some((f) => f.includes("wrong root association"))
      ),
    },
    blockedRootCategoryBreakdown: Object.fromEntries(categoryBreakdown),
    blockedRootCount: blockedAnalysis.length,
    deterministicRemediationPossibleCount: blockedAnalysis.filter(
      (b) => b.deterministicRemediationPossible
    ).length,
    humanReviewRequiredCount: blockedAnalysis.filter((b) => b.humanReviewRequired).length,
    results: integrityResults,
  };

  writeFileSync(
    INTEGRITY_REPORT_PATH,
    JSON.stringify(integrityReport, null, 2),
    "utf-8"
  );
  console.log(`  Written to ${INTEGRITY_REPORT_PATH}`);

  console.log("\nWriting blocked root analysis...");
  const blockedReport = {
    auditTimestamp: new Date().toISOString(),
    totalBlockedOrNeedsReview: blockedAnalysis.length,
    categoryBreakdown: Object.fromEntries(categoryBreakdown),
    roots: blockedAnalysis,
  };

  writeFileSync(
    BLOCKED_ANALYSIS_PATH,
    JSON.stringify(blockedReport, null, 2),
    "utf-8"
  );
  console.log(`  Written to ${BLOCKED_ANALYSIS_PATH}`);

  // === SUMMARY ===
  console.log("\n=== AUDIT SUMMARY ===");
  console.log(`Roots audited: ${integrityResults.length}`);
  console.log(`  Pass: ${passCount}`);
  console.log(`  Fail: ${failCount}`);
  console.log(`  Warning: ${warningCount}`);
  console.log(`\nBlocked/needs-review roots: ${blockedAnalysis.length}`);
  console.log(`  Category breakdown:`);
  for (const [cat, count] of categoryBreakdown) {
    console.log(`    ${cat}: ${count}`);
  }
  console.log(`\nDeterministic remediation possible: ${blockedAnalysis.filter((b) => b.deterministicRemediationPossible).length}`);
  console.log(`Human review required: ${blockedAnalysis.filter((b) => b.humanReviewRequired).length}`);

  const criticalFailures = Object.entries(integrityReport.criticalInvariants)
    .filter(([, v]) => !v)
    .map(([k]) => k);

  if (criticalFailures.length > 0) {
    console.log(`\n❌ CRITICAL INVARIANT FAILURES:`);
    for (const f of criticalFailures) {
      console.log(`  - ${f}`);
    }
    console.log("\nFailed roots:");
    for (const r of integrityResults.filter((r) => r.integrityStatus === "fail")) {
      console.log(`  ${r.root}: ${r.failureReasons.join("; ")}`);
    }
    process.exit(1);
  }

  const emptyIndexRoots = integrityResults.filter(
    (r) => r.includedLemmasCount === 0 && r.actualTotalMatches === 0
  );
  const populatedIndexRoots = integrityResults.filter(
    (r) => r.includedLemmasCount > 0 && r.actualTotalMatches > 0
  );

  console.log(`\n=== KEY FINDING ===`);
  console.log(`Roots with empty indexes (no lemmas approved): ${emptyIndexRoots.length}`);
  console.log(`Roots with populated indexes (lemmas approved): ${populatedIndexRoots.length}`);
  console.log(`Roots with no occurrence file (blocked/no-file): ${integrityResults.filter((r) => r.actualTotalMatches === -1).length}`);

  if (populatedIndexRoots.length > 0) {
    console.log(`\nPopulated roots:`);
    for (const r of populatedIndexRoots) {
      console.log(`  ${r.root}: ${r.actualTotalMatches} matches, ${r.includedLemmasCount} lemmas`);
    }
  }

  console.log(`\n✅ All critical invariants hold.`);
  process.exit(0);
}

main();
