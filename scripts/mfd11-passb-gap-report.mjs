// MFD-11 Pass B: Gap report — classify uncovered existing topics.
// For each of the 114 uncovered topics, determine whether:
//   (a) Qur'anic evidence exists but wasn't surfaced (extraction gap)
//   (b) The topic is editorial/taxonomic and may not have direct Quranic grounding
//   (c) The topic genuinely has no Quranic evidence
// This uses keyword matching against the full corpus to distinguish (a) from (c).

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SYNTHESIS_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "passb-synthesis-report.json");
const TOPICS_PATH = path.join(ROOT, "data", "taxonomy", "topics.json");
const CORPUS_BASE = path.join(ROOT, "node_modules", "quran-json", "dist", "chapters", "en");
const OUT_PATH = path.join(ROOT, "research", "mfd-11", "reports", "gap-analysis.json");

console.log("Loading synthesis report...");
const synthesis = JSON.parse(readFileSync(SYNTHESIS_PATH, "utf8"));
console.log("Loading existing taxonomy...");
const topics = JSON.parse(readFileSync(TOPICS_PATH, "utf8"));

// Load full corpus translations for keyword search
console.log("Loading full corpus translations...");
const allVerses = [];
for (let s = 1; s <= 114; s++) {
  const corpus = JSON.parse(readFileSync(path.join(CORPUS_BASE, `${s}.json`), "utf8"));
  for (const v of corpus.verses) {
    allVerses.push({
      key: `${s}:${v.id}`,
      translation: (v.translation || "").toLowerCase(),
      text: v.text
    });
  }
}
console.log(`Loaded ${allVerses.length} verses`);

// Build keyword sets from topic titles, descriptions, and search aliases
function buildKeywords(topic) {
  const keywords = new Set();
  const sources = [
    topic.title,
    topic.description,
    topic.scope,
    ...(topic.searchAliases || [])
  ];
  for (const src of sources) {
    if (!src) continue;
    const words = src.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
    for (const w of words) keywords.add(w);
  }
  // Remove stop words
  const stopWords = new Set(['the', 'and', 'for', 'with', 'from', 'that', 'this', 'are', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'but', 'not', 'all', 'can', 'will', 'may', 'shall', 'should', 'would', 'could', 'must', 'into', 'upon', 'about', 'between', 'through', 'during', 'before', 'after', 'above', 'below', 'each', 'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such', 'than', 'only', 'very', 'just', 'also', 'now', 'here', 'there', 'when', 'where', 'which', 'their', 'them', 'then', 'these', 'those']);
  for (const sw of stopWords) keywords.delete(sw);
  return [...keywords];
}

// Search corpus for verses matching topic keywords
function findMatchingVerses(keywords, threshold = 2) {
  const matches = [];
  for (const v of allVerses) {
    let hitCount = 0;
    for (const kw of keywords) {
      if (v.translation.includes(kw)) hitCount++;
    }
    if (hitCount >= threshold) {
      matches.push({ key: v.key, hitCount });
    }
  }
  return matches.sort((a, b) => b.hitCount - a.hitCount);
}

// Classify uncovered topics
const uncoveredTopics = synthesis.existingTopicCoverage.filter(t => t.status === "uncovered");
console.log(`Classifying ${uncoveredTopics.length} uncovered topics...`);

const classified = [];
for (const ut of uncoveredTopics) {
  const topic = topics.find(t => t.id === ut.topicId);
  if (!topic) continue;
  
  const keywords = buildKeywords(topic);
  const matches = findMatchingVerses(keywords, 2);
  
  let classification;
  if (matches.length >= 5) {
    classification = "extraction-gap"; // Evidence likely exists but wasn't surfaced
  } else if (matches.length >= 1) {
    classification = "partial-evidence"; // Some evidence exists
  } else {
    classification = "editorial-or-no-evidence"; // May be editorial construct or genuinely absent
  }
  
  classified.push({
    topicId: ut.topicId,
    title: ut.title,
    parentDomainId: ut.parentDomainId,
    parentDimensionId: ut.parentDimensionId,
    classification,
    keywordCount: keywords.length,
    matchingVerseCount: matches.length,
    topMatchingVerses: matches.slice(0, 5).map(m => m.key),
    proposedBy: "ai-assisted",
    reviewStatus: "pending-scholarly-review"
  });
}

// Summary stats
const extractionGaps = classified.filter(c => c.classification === "extraction-gap");
const partialEvidence = classified.filter(c => c.classification === "partial-evidence");
const editorialOrNone = classified.filter(c => c.classification === "editorial-or-no-evidence");

const gapReport = {
  workstream: "MFD-11",
  pass: "B",
  phase: "gap-analysis",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  methodology: "Keyword matching against full corpus translations (Saheeh International). Threshold: >=2 keyword hits per verse. Classification: extraction-gap (>=5 matching verses), partial-evidence (1-4 matches), editorial-or-no-evidence (0 matches).",
  summary: {
    totalUncoveredTopics: uncoveredTopics.length,
    extractionGaps: extractionGaps.length,
    partialEvidence: partialEvidence.length,
    editorialOrNoEvidence: editorialOrNone.length
  },
  extractionGaps: extractionGaps.sort((a, b) => b.matchingVerseCount - a.matchingVerseCount),
  partialEvidence: partialEvidence.sort((a, b) => b.matchingVerseCount - a.matchingVerseCount),
  editorialOrNoEvidence: editorialOrNone
};

writeFileSync(OUT_PATH, JSON.stringify(gapReport, null, 2) + "\n");

console.log(`\n=== GAP ANALYSIS RESULTS ===`);
console.log(`Total uncovered topics: ${uncoveredTopics.length}`);
console.log(`Extraction gaps (evidence likely exists): ${extractionGaps.length}`);
console.log(`Partial evidence: ${partialEvidence.length}`);
console.log(`Editorial or no evidence: ${editorialOrNone.length}`);
console.log(`\nTop 10 extraction gaps:`);
for (const g of extractionGaps.slice(0, 10)) {
  console.log(`  ${g.matchingVerseCount} matching verses -> ${g.topicId} (${g.title})`);
}
console.log(`\nWrote ${OUT_PATH}`);
