// MFD-11 Phase C: Missing-mapping report.
// Compares existing 789 production ayah mappings against Pass A candidate coverage.
// Identifies mappings that have no corresponding candidate evidence.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "candidate-index.json");
const MAPPINGS_PATH = path.join(ROOT, "data", "taxonomy", "topic-ayah-mappings.json");
const OUT_PATH = path.join(ROOT, "research", "mfd-11", "reports", "missing-mappings.json");

console.log("Loading candidate index...");
const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
console.log(`Loaded ${index.candidates.length} candidates`);

console.log("Loading production ayah mappings...");
const mappingsData = JSON.parse(readFileSync(MAPPINGS_PATH, "utf8"));
const mappings = Array.isArray(mappingsData) ? mappingsData : (mappingsData.mappings || []);
console.log(`Loaded ${mappings.length} production mappings`);

// Build set of all ayah keys covered by candidates
const candidateKeys = new Set();
for (const c of index.candidates) {
  for (const k of c.evidenceKeys) candidateKeys.add(k);
}
console.log(`Candidate-covered ayah keys: ${candidateKeys.size}`);

// Check each production mapping
const coveredMappings = [];
const uncoveredMappings = [];

for (const m of mappings) {
  // Construct ayahKey from surahNumber:ayahStart (or ayahKey if present)
  const ayahKey = m.ayahKey || (m.surahNumber && m.ayahStart ? `${m.surahNumber}:${m.ayahStart}` : null);
  if (!ayahKey) continue;
  
  if (candidateKeys.has(ayahKey)) {
    coveredMappings.push({
      mappingId: m.id || m.mappingId,
      topicId: m.topicId,
      ayahKey,
      status: "covered-by-candidate"
    });
  } else {
    uncoveredMappings.push({
      mappingId: m.id || m.mappingId,
      topicId: m.topicId,
      ayahKey,
      status: "no-candidate-coverage",
      proposedBy: "ai-assisted",
      reviewStatus: "pending-scholarly-review"
    });
  }
}

// Group uncovered mappings by topic
const uncoveredByTopic = new Map();
for (const um of uncoveredMappings) {
  if (!uncoveredByTopic.has(um.topicId)) uncoveredByTopic.set(um.topicId, []);
  uncoveredByTopic.get(um.topicId).push(um);
}

const report = {
  workstream: "MFD-11",
  phase: "C",
  reportType: "missing-mappings",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  summary: {
    totalProductionMappings: mappings.length,
    coveredByCandidates: coveredMappings.length,
    uncoveredByCandidates: uncoveredMappings.length,
    coveragePercent: ((coveredMappings.length / mappings.length) * 100).toFixed(1),
    topicsWithUncoveredMappings: uncoveredByTopic.size
  },
  uncoveredMappingsByTopic: [...uncoveredByTopic.entries()]
    .map(([topicId, mappings]) => ({
      topicId,
      uncoveredCount: mappings.length,
      ayahKeys: mappings.map(m => m.ayahKey)
    }))
    .sort((a, b) => b.uncoveredCount - a.uncoveredCount),
  uncoveredMappings
};

writeFileSync(OUT_PATH, JSON.stringify(report, null, 2) + "\n");

console.log(`\n=== MISSING MAPPINGS REPORT ===`);
console.log(`Total production mappings: ${mappings.length}`);
console.log(`Covered by candidates: ${coveredMappings.length} (${report.summary.coveragePercent}%)`);
console.log(`Uncovered: ${uncoveredMappings.length}`);
console.log(`Topics with uncovered mappings: ${uncoveredByTopic.size}`);
console.log(`\nTop 10 topics with most uncovered mappings:`);
for (const t of report.uncoveredMappingsByTopic.slice(0, 10)) {
  console.log(`  ${t.uncoveredCount} uncovered -> ${t.topicId}`);
}
console.log(`\nWrote ${OUT_PATH}`);
