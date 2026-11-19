// MFD-11 Pass B: Build consolidated candidate index for synthesis.
// Reads all 138 candidate batch files, normalizes labels, and outputs
// a single index file for deduplication and hierarchy analysis.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CAND_DIR = path.join(ROOT, "research", "mfd-11", "candidates");
const OUT_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "candidate-index.json");

console.log("Building Pass B candidate index...");

const allCandidates = [];
const labelCounts = new Map(); // normalized label -> count
const evidenceKeyCounts = new Map(); // ayah key -> candidate count

for (const f of readdirSync(CAND_DIR).filter(f => f.endsWith(".json")).sort()) {
  const j = JSON.parse(readFileSync(path.join(CAND_DIR, f), "utf8"));
  for (const c of (j.candidates || [])) {
    // Normalize label for dedup comparison
    const normLabel = (c.label || "")
      .toLowerCase()
      .replace(/^cand-\d+:\s*/, "")
      .replace(/\s+/g, " ")
      .trim();
    
    labelCounts.set(normLabel, (labelCounts.get(normLabel) || 0) + 1);
    
    for (const ev of (c.evidence || [])) {
      evidenceKeyCounts.set(ev.key, (evidenceKeyCounts.get(ev.key) || 0) + 1);
    }
    
    allCandidates.push({
      id: c.candidateId,
      label: c.label,
      normLabel,
      definition: c.definition,
      evidenceKeys: (c.evidence || []).map(e => e.key),
      existingOverlap: (c.existingTopicOverlap || []).map(o => o.topicId),
      sourceFile: f
    });
  }
}

// Find exact duplicate labels
const exactDupes = [...labelCounts.entries()]
  .filter(([, count]) => count > 1)
  .sort((a, b) => b[1] - a[1]);

// Find high-frequency ayah keys (verses cited by many candidates)
const hotVerses = [...evidenceKeyCounts.entries()]
  .filter(([, count]) => count >= 5)
  .sort((a, b) => b[1] - a[1]);

// Existing topic overlap frequency
const overlapCounts = new Map();
for (const c of allCandidates) {
  for (const tid of c.existingOverlap) {
    overlapCounts.set(tid, (overlapCounts.get(tid) || 0) + 1);
  }
}
const topOverlaps = [...overlapCounts.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 30);

const index = {
  workstream: "MFD-11",
  pass: "B",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  summary: {
    totalCandidates: allCandidates.length,
    uniqueNormalizedLabels: labelCounts.size,
    exactDuplicateLabels: exactDupes.length,
    hotVersesThreshold: 5,
    hotVerseCount: hotVerses.length,
    existingTaxonomyOverlaps: overlapCounts.size
  },
  exactDuplicateLabels: exactDupes.slice(0, 50).map(([label, count]) => ({ label, count })),
  hotVerses: hotVerses.slice(0, 30).map(([key, count]) => ({ key, count })),
  topExistingOverlaps: topOverlaps.map(([topicId, count]) => ({ topicId, count })),
  candidates: allCandidates
};

writeFileSync(OUT_PATH, JSON.stringify(index, null, 2) + "\n");

console.log(`Total candidates: ${allCandidates.length}`);
console.log(`Unique normalized labels: ${labelCounts.size}`);
console.log(`Exact duplicate labels: ${exactDupes.length}`);
console.log(`Hot verses (>=5 citations): ${hotVerses.length}`);
console.log(`Existing taxonomy overlaps: ${overlapCounts.size}`);
console.log(`\nTop 10 duplicate labels:`);
for (const [label, count] of exactDupes.slice(0, 10)) {
  console.log(`  ${count}x: ${label}`);
}
console.log(`\nTop 10 hot verses:`);
for (const [key, count] of hotVerses.slice(0, 10)) {
  console.log(`  ${count} candidates cite ${key}`);
}
console.log(`\nTop 10 existing taxonomy overlaps:`);
for (const [tid, count] of topOverlaps.slice(0, 10)) {
  console.log(`  ${count} candidates overlap ${tid}`);
}
console.log(`\nWrote ${OUT_PATH}`);
