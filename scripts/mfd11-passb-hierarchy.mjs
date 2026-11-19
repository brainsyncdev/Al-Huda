// MFD-11 Pass B: Proposed topic hierarchy.
// Consolidates all Pass B outputs into a single hierarchy proposal:
// 1. Existing topics with candidate coverage (70 topics)
// 2. Extraction gaps flagged for re-extraction (45 topics)
// 3. New topic proposals from thematic hubs
// 4. Domain/dimension structure preservation

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SYNTHESIS_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "passb-synthesis-report.json");
const GAP_PATH = path.join(ROOT, "research", "mfd-11", "reports", "gap-analysis.json");
const TOPICS_PATH = path.join(ROOT, "data", "taxonomy", "topics.json");
const OUT_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "proposed-hierarchy.json");

console.log("Loading Pass B outputs...");
const synthesis = JSON.parse(readFileSync(SYNTHESIS_PATH, "utf8"));
const gapReport = JSON.parse(readFileSync(GAP_PATH, "utf8"));
const existingTopics = JSON.parse(readFileSync(TOPICS_PATH, "utf8"));

// Build domain -> dimension -> topics tree
const domainMap = new Map();
for (const t of existingTopics) {
  const dom = t.parentDomainId || "uncategorized";
  const dim = t.parentDimensionId || "uncategorized";
  if (!domainMap.has(dom)) domainMap.set(dom, new Map());
  const dims = domainMap.get(dom);
  if (!dims.has(dim)) dims.set(dim, []);
  dims.get(dim).push(t);
}

// Classify each existing topic
const topicClassification = new Map();
for (const tc of synthesis.existingTopicCoverage) {
  topicClassification.set(tc.topicId, {
    status: tc.status,
    candidateCount: tc.candidateCount,
    evidenceKeys: tc.evidenceKeys
  });
}
for (const g of gapReport.extractionGaps) {
  topicClassification.set(g.topicId, {
    ...topicClassification.get(g.topicId),
    gapClass: "extraction-gap",
    matchingVerseCount: g.matchingVerseCount
  });
}
for (const p of gapReport.partialEvidence) {
  topicClassification.set(p.topicId, {
    ...topicClassification.get(p.topicId),
    gapClass: "partial-evidence",
    matchingVerseCount: p.matchingVerseCount
  });
}
for (const e of gapReport.editorialOrNoEvidence) {
  topicClassification.set(e.topicId, {
    ...topicClassification.get(e.topicId),
    gapClass: "editorial-or-no-evidence",
    matchingVerseCount: e.matchingVerseCount
  });
}

// Build proposed hierarchy
const proposedHierarchy = [];
for (const [domain, dims] of domainMap.entries()) {
  const domainEntry = {
    domainId: domain,
    dimensions: []
  };
  
  for (const [dim, topicsInDim] of dims.entries()) {
    const dimEntry = {
      dimensionId: dim,
      topics: []
    };
    
    for (const t of topicsInDim) {
      const cls = topicClassification.get(t.id) || {};
      let disposition;
      if (cls.status === "covered") {
        disposition = "validated-by-extraction";
      } else if (cls.gapClass === "extraction-gap") {
        disposition = "needs-re-extraction";
      } else if (cls.gapClass === "partial-evidence") {
        disposition = "partial-coverage-review";
      } else if (cls.gapClass === "editorial-or-no-evidence") {
        disposition = "scholarly-review-required";
      } else {
        disposition = "unclassified";
      }
      
      dimEntry.topics.push({
        topicId: t.id,
        title: t.title,
        disposition,
        candidateCount: cls.candidateCount || 0,
        evidenceKeyCount: (cls.evidenceKeys || []).length,
        matchingVerseCount: cls.matchingVerseCount || 0,
        proposedBy: "ai-assisted",
        reviewStatus: "pending-scholarly-review"
      });
    }
    
    // Sort topics: validated first, then needs-re-extraction, then others
    dimEntry.topics.sort((a, b) => {
      const order = { "validated-by-extraction": 0, "needs-re-extraction": 1, "partial-coverage-review": 2, "scholarly-review-required": 3, "unclassified": 4 };
      return (order[a.disposition] || 5) - (order[b.disposition] || 5);
    });
    
    domainEntry.dimensions.push(dimEntry);
  }
  
  proposedHierarchy.push(domainEntry);
}

// Summary statistics
const allTopics = proposedHierarchy.flatMap(d => d.dimensions.flatMap(dim => dim.topics));
const dispositionCounts = {};
for (const t of allTopics) {
  dispositionCounts[t.disposition] = (dispositionCounts[t.disposition] || 0) + 1;
}

const output = {
  workstream: "MFD-11",
  pass: "B",
  phase: "proposed-hierarchy",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  summary: {
    totalDomains: proposedHierarchy.length,
    totalDimensions: proposedHierarchy.reduce((n, d) => n + d.dimensions.length, 0),
    totalTopics: allTopics.length,
    dispositionBreakdown: dispositionCounts,
    totalCandidatesReferenced: synthesis.summary.totalCandidates,
    existingTopicsCovered: dispositionCounts["validated-by-extraction"] || 0,
    extractionGapsFlagged: dispositionCounts["needs-re-extraction"] || 0,
    partialCoverage: dispositionCounts["partial-coverage-review"] || 0,
    scholarlyReviewRequired: dispositionCounts["scholarly-review-required"] || 0
  },
  hierarchy: proposedHierarchy
};

writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + "\n");

console.log(`\n=== PROPOSED HIERARCHY ===`);
console.log(`Domains: ${output.summary.totalDomains}`);
console.log(`Dimensions: ${output.summary.totalDimensions}`);
console.log(`Topics: ${output.summary.totalTopics}`);
console.log(`\nDisposition breakdown:`);
for (const [disp, count] of Object.entries(dispositionCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${count}: ${disp}`);
}
console.log(`\nWrote ${OUT_PATH}`);
