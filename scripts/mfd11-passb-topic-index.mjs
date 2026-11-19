// MFD-11 Pass B: Build topic-to-candidate index for synthesis.
// Instead of clustering by label similarity (which fails on placeholders),
// this aggregates candidates by existing topic overlap and evidence-key
// co-occurrence to produce a structured synthesis report.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "candidate-index.json");
const TOPICS_PATH = path.join(ROOT, "data", "taxonomy", "topics.json");
const OUT_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "passb-synthesis-report.json");

console.log("Loading candidate index...");
const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
console.log(`Loaded ${index.candidates.length} candidates`);

console.log("Loading existing taxonomy...");
const topics = JSON.parse(readFileSync(TOPICS_PATH, "utf8"));
const topicById = new Map(topics.map(t => [t.id, t]));

// === SECTION 1: Existing Topic Coverage ===
// For each existing topic, list all candidates that reference it
const topicCandidateMap = new Map(); // topicId -> candidate[]
for (const c of index.candidates) {
  for (const tid of (c.existingOverlap || [])) {
    if (!topicCandidateMap.has(tid)) topicCandidateMap.set(tid, []);
    topicCandidateMap.get(tid).push(c);
  }
}

const existingTopicCoverage = topics.map(t => {
  const cands = topicCandidateMap.get(t.id) || [];
  return {
    topicId: t.id,
    title: t.title,
    parentDomainId: t.parentDomainId,
    parentDimensionId: t.parentDimensionId,
    candidateCount: cands.length,
    candidateIds: cands.map(c => c.id),
    evidenceKeys: [...new Set(cands.flatMap(c => c.evidenceKeys))].sort(),
    status: cands.length > 0 ? "covered" : "uncovered"
  };
}).sort((a, b) => b.candidateCount - a.candidateCount);

// === SECTION 2: Evidence-Key Co-occurrence Matrix ===
// Find ayah keys cited by multiple candidates — these are thematic hubs
const keyToCandidates = new Map();
for (const c of index.candidates) {
  for (const k of c.evidenceKeys) {
    if (!keyToCandidates.has(k)) keyToCandidates.set(k, []);
    keyToCandidates.get(k).push(c.id);
  }
}

const thematicHubs = [...keyToCandidates.entries()]
  .filter(([, ids]) => ids.length >= 3)
  .map(([key, candidateIds]) => ({
    ayahKey: key,
    candidateCount: candidateIds.length,
    candidateIds,
    sampleLabels: candidateIds.slice(0, 5).map(id => {
      const c = index.candidates.find(x => x.id === id);
      return c ? c.label : id;
    })
  }))
  .sort((a, b) => b.candidateCount - a.candidateCount)
  .slice(0, 50);

// === SECTION 3: Candidate Groups by Surah-Thematic Blocks ===
// Group candidates by surah to identify surah-level thematic concentrations
const surahGroups = new Map();
for (const c of index.candidates) {
  const firstKey = c.evidenceKeys[0];
  if (!firstKey) continue;
  const surah = parseInt(firstKey.split(":")[0]);
  if (!surahGroups.has(surah)) surahGroups.set(surah, []);
  surahGroups.get(surah).push(c);
}

const surahThematics = [...surahGroups.entries()]
  .map(([surah, cands]) => ({
    surah,
    candidateCount: cands.length,
    evidenceKeyCount: new Set(cands.flatMap(c => c.evidenceKeys)).size,
    existingTopicOverlaps: [...new Set(cands.flatMap(c => c.existingOverlap || []))],
    hasRealLabels: cands.some(c => !c.label.match(/^cand-\d+: topic from/i))
  }))
  .sort((a, b) => a.surah - b.surah);

// === SECTION 4: New Topic Proposals ===
// Candidates with no existing overlap that share evidence keys suggest new topics
const noOverlapCandidates = index.candidates.filter(c => !c.existingOverlap || c.existingOverlap.length === 0);

// Group no-overlap candidates by shared evidence keys
const newTopicSignals = new Map(); // evidenceKey -> candidate[]
for (const c of noOverlapCandidates) {
  for (const k of c.evidenceKeys) {
    if (!newTopicSignals.has(k)) newTopicSignals.set(k, []);
    newTopicSignals.get(k).push(c);
  }
}

// Keys with 3+ no-overlap candidates suggest a new topic
const newTopicProposals = [...newTopicSignals.entries()]
  .filter(([, cands]) => cands.length >= 3)
  .map(([key, cands]) => ({
    hubAyah: key,
    candidateCount: cands.length,
    candidateIds: cands.map(c => c.id),
    sampleLabels: cands.slice(0, 5).map(c => c.label),
    proposedBy: "ai-assisted",
    reviewStatus: "pending-scholarly-review"
  }))
  .sort((a, b) => b.candidateCount - a.candidateCount)
  .slice(0, 50);

// === OUTPUT ===
const report = {
  workstream: "MFD-11",
  pass: "B",
  phase: "synthesis-report",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  summary: {
    totalCandidates: index.candidates.length,
    existingTopicsTotal: topics.length,
    existingTopicsCovered: existingTopicCoverage.filter(t => t.status === "covered").length,
    existingTopicsUncovered: existingTopicCoverage.filter(t => t.status === "uncovered").length,
    coveragePercent: ((existingTopicCoverage.filter(t => t.status === "covered").length / topics.length) * 100).toFixed(1),
    thematicHubsCount: thematicHubs.length,
    newTopicProposalsCount: newTopicProposals.length,
    candidatesWithNoExistingOverlap: noOverlapCandidates.length
  },
  existingTopicCoverage,
  thematicHubs,
  surahThematics,
  newTopicProposals
};

writeFileSync(OUT_PATH, JSON.stringify(report, null, 2) + "\n");

console.log(`\n=== PASS B SYNTHESIS REPORT ===`);
console.log(`Total candidates: ${report.summary.totalCandidates}`);
console.log(`Existing topics covered: ${report.summary.existingTopicsCovered}/${report.summary.existingTopicsTotal} (${report.summary.coveragePercent}%)`);
console.log(`Existing topics uncovered: ${report.summary.existingTopicsUncovered}`);
console.log(`Thematic hubs (>=3 candidates): ${report.summary.thematicHubsCount}`);
console.log(`New topic proposals (>=3 no-overlap candidates sharing key): ${report.summary.newTopicProposalsCount}`);
console.log(`Candidates with no existing overlap: ${report.summary.candidatesWithNoExistingOverlap}`);
console.log(`\nTop 15 covered existing topics:`);
for (const t of existingTopicCoverage.filter(t => t.status === "covered").slice(0, 15)) {
  console.log(`  ${t.candidateCount} candidates -> ${t.topicId} (${t.title})`);
}
console.log(`\nTop 10 thematic hubs:`);
for (const h of thematicHubs.slice(0, 10)) {
  console.log(`  ${h.candidateCount} candidates cite ${h.ayahKey}`);
}
console.log(`\nTop 10 new topic proposals:`);
for (const p of newTopicProposals.slice(0, 10)) {
  console.log(`  ${p.candidateCount} candidates at ${p.hubAyah}: ${p.sampleLabels[0]}`);
}
console.log(`\nWrote ${OUT_PATH}`);
