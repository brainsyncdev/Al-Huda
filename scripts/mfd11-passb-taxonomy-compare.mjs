// MFD-11 Pass B: Compare 2,918 candidates against existing 184-topic taxonomy.
// Produces: coverage map, gap report, and candidate-to-topic assignments.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "candidate-index.json");
const TOPICS_PATH = path.join(ROOT, "data", "taxonomy", "topics.json");
const OUT_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "taxonomy-comparison.json");

console.log("Loading candidate index...");
const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
console.log(`Loaded ${index.candidates.length} candidates`);

console.log("Loading existing taxonomy...");
const topics = JSON.parse(readFileSync(TOPICS_PATH, "utf8"));
console.log(`Loaded ${topics.length} existing topics`);

// Build topic lookup by id and slug
const topicById = new Map();
const topicBySlug = new Map();
for (const t of topics) {
  topicById.set(t.id, t);
  if (t.slug) topicBySlug.set(t.slug, t);
}

// Count how many candidates map to each existing topic
const topicCoverage = new Map(); // topicId -> { count, candidateIds[] }
for (const c of index.candidates) {
  for (const tid of (c.existingOverlap || [])) {
    if (!topicCoverage.has(tid)) topicCoverage.set(tid, { count: 0, candidateIds: [] });
    const entry = topicCoverage.get(tid);
    entry.count++;
    entry.candidateIds.push(c.id);
  }
}

// Identify covered vs uncovered topics
const coveredTopics = [];
const uncoveredTopics = [];
for (const t of topics) {
  const cov = topicCoverage.get(t.id);
  if (cov && cov.count > 0) {
    coveredTopics.push({
      topicId: t.id,
      title: t.title,
      parentDomainId: t.parentDomainId,
      parentDimensionId: t.parentDimensionId,
      candidateCount: cov.count,
      sampleCandidateIds: cov.candidateIds.slice(0, 5)
    });
  } else {
    uncoveredTopics.push({
      topicId: t.id,
      title: t.title,
      parentDomainId: t.parentDomainId,
      parentDimensionId: t.parentDimensionId
    });
  }
}

// Candidates with NO existing topic overlap (pure gaps / new topics)
const noOverlapCandidates = index.candidates.filter(c => !c.existingOverlap || c.existingOverlap.length === 0);

// Domain-level coverage summary
const domainStats = new Map();
for (const t of topics) {
  const dom = t.parentDomainId || "unknown";
  if (!domainStats.has(dom)) domainStats.set(dom, { total: 0, covered: 0, uncovered: 0 });
  const s = domainStats.get(dom);
  s.total++;
  if (topicCoverage.has(t.id) && topicCoverage.get(t.id).count > 0) s.covered++;
  else s.uncovered++;
}

const comparison = {
  workstream: "MFD-11",
  pass: "B",
  phase: "taxonomy-comparison",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  summary: {
    totalExistingTopics: topics.length,
    coveredTopics: coveredTopics.length,
    uncoveredTopics: uncoveredTopics.length,
    coveragePercent: ((coveredTopics.length / topics.length) * 100).toFixed(1),
    candidatesWithNoOverlap: noOverlapCandidates.length,
    candidatesWithOverlap: index.candidates.length - noOverlapCandidates.length
  },
  domainCoverage: [...domainStats.entries()].map(([domain, stats]) => ({
    domain,
    totalTopics: stats.total,
    covered: stats.covered,
    uncovered: stats.uncovered,
    coveragePercent: ((stats.covered / stats.total) * 100).toFixed(1)
  })).sort((a, b) => b.uncovered - a.uncovered),
  coveredTopics: coveredTopics.sort((a, b) => b.candidateCount - a.candidateCount),
  uncoveredTopics,
  noOverlapCandidateSample: noOverlapCandidates.slice(0, 50).map(c => ({
    id: c.id,
    label: c.label,
    evidenceKeys: c.evidenceKeys,
    sourceFile: c.sourceFile
  }))
};

writeFileSync(OUT_PATH, JSON.stringify(comparison, null, 2) + "\n");

console.log(`\n=== TAXONOMY COMPARISON RESULTS ===`);
console.log(`Existing topics: ${topics.length}`);
console.log(`Covered by candidates: ${coveredTopics.length} (${comparison.summary.coveragePercent}%)`);
console.log(`Uncovered (gaps): ${uncoveredTopics.length}`);
console.log(`Candidates with NO existing overlap: ${noOverlapCandidates.length}`);
console.log(`Candidates WITH existing overlap: ${comparison.summary.candidatesWithOverlap}`);
console.log(`\nDomain coverage (sorted by uncovered count):`);
for (const d of comparison.domainCoverage) {
  console.log(`  ${d.domain}: ${d.covered}/${d.total} covered (${d.coveragePercent}%), ${d.uncovered} gaps`);
}
console.log(`\nTop 10 most-covered topics:`);
for (const t of coveredTopics.slice(0, 10)) {
  console.log(`  ${t.candidateCount} candidates -> ${t.topicId} (${t.title})`);
}
console.log(`\nWrote ${OUT_PATH}`);
