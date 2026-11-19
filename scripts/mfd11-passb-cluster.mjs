// MFD-11 Pass B: Semantic clustering of 2,918 candidates.
// Groups candidates by evidence-key co-occurrence and label similarity,
// proposes consolidated topic clusters with parent-child relationships.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INDEX_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "candidate-index.json");
const TAXONOMY_PATH = path.join(ROOT, "data", "taxonomy", "topics.json");
const OUT_PATH = path.join(ROOT, "research", "mfd-11", "synthesis", "topic-clusters.json");

console.log("Loading candidate index...");
const index = JSON.parse(readFileSync(INDEX_PATH, "utf8"));
console.log(`Loaded ${index.candidates.length} candidates`);

console.log("Loading existing taxonomy...");
const topics = JSON.parse(readFileSync(TAXONOMY_PATH, "utf8"));
const topicById = new Map(topics.map(t => [t.id, t]));

// Step 1: Build evidence-key -> candidate mapping
const keyToCandidates = new Map();
for (const c of index.candidates) {
  for (const k of c.evidenceKeys) {
    if (!keyToCandidates.has(k)) keyToCandidates.set(k, []);
    keyToCandidates.get(k).push(c.id);
  }
}

// Step 2: Build candidate similarity graph based on shared evidence keys
// Two candidates are similar if they share >= 2 evidence keys OR have very similar labels
function labelSimilarity(a, b) {
  const la = a.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  const lb = b.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
  if (la === lb) return 1.0;
  // Jaccard on word tokens
  const wa = new Set(la.split(/\s+/));
  const wb = new Set(lb.split(/\s+/));
  const intersection = [...wa].filter(w => wb.has(w)).length;
  const union = new Set([...wa, ...wb]).size;
  return union > 0 ? intersection / union : 0;
}

// Step 3: Cluster candidates using greedy connected-components on similarity threshold
const SIMILARITY_THRESHOLD = 0.4;
const EVIDENCE_OVERLAP_THRESHOLD = 2;

const visited = new Set();
const clusters = [];

for (const c of index.candidates) {
  if (visited.has(c.id)) continue;
  
  // BFS to find connected component
  const cluster = [];
  const queue = [c.id];
  visited.add(c.id);
  
  while (queue.length > 0) {
    const currentId = queue.shift();
    const current = index.candidates.find(x => x.id === currentId);
    cluster.push(current);
    
    // Find neighbors: candidates sharing evidence keys or similar labels
    const neighborIds = new Set();
    for (const k of current.evidenceKeys) {
      for (const nid of (keyToCandidates.get(k) || [])) {
        if (nid !== currentId && !visited.has(nid)) neighborIds.add(nid);
      }
    }
    
    for (const nid of neighborIds) {
      const neighbor = index.candidates.find(x => x.id === nid);
      if (!neighbor) continue;
      
      // Check evidence overlap
      const sharedKeys = current.evidenceKeys.filter(k => neighbor.evidenceKeys.includes(k));
      const sim = labelSimilarity(current.label, neighbor.label);
      
      if (sharedKeys.length >= EVIDENCE_OVERLAP_THRESHOLD || sim >= SIMILARITY_THRESHOLD) {
        if (!visited.has(nid)) {
          visited.add(nid);
          queue.push(nid);
        }
      }
    }
  }
  
  if (cluster.length > 0) {
    clusters.push(cluster);
  }
}

// Step 4: For each cluster, propose a consolidated topic
const proposedTopics = [];
const existingTopicIds = new Set(topics.map(t => t.id));

for (let i = 0; i < clusters.length; i++) {
  const cluster = clusters[i];
  
  // Check if this cluster maps to an existing topic
  const overlapCounts = new Map();
  for (const c of cluster) {
    for (const tid of (c.existingOverlap || [])) {
      overlapCounts.set(tid, (overlapCounts.get(tid) || 0) + 1);
    }
  }
  
  let mappedExistingTopic = null;
  if (overlapCounts.size > 0) {
    const sorted = [...overlapCounts.entries()].sort((a, b) => b[1] - a[1]);
    mappedExistingTopic = sorted[0][0];
  }
  
  // Generate a representative label from the most common words in cluster labels
  const wordFreq = new Map();
  for (const c of cluster) {
    const words = c.label.toLowerCase()
      .replace(/^cand-\d+:\s*/, '')
      .replace(/topic from \d+:\d+/g, '')
      .split(/[\s,;:()]+/)
      .filter(w => w.length > 3);
    for (const w of words) {
      wordFreq.set(w, (wordFreq.get(w) || 0) + 1);
    }
  }
  const topWords = [...wordFreq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([w]) => w);
  
  const proposedLabel = topWords.length > 0 
    ? topWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    : `Cluster ${i + 1}`;
  
  // Collect all unique evidence keys
  const allKeys = new Set();
  for (const c of cluster) {
    for (const k of c.evidenceKeys) allKeys.add(k);
  }
  
  proposedTopics.push({
    clusterId: `cluster-${String(i + 1).padStart(4, '0')}`,
    proposedLabel,
    mappedExistingTopic,
    mappedExistingTitle: mappedExistingTopic ? (topicById.get(mappedExistingTopic)?.title || null) : null,
    candidateCount: cluster.length,
    candidateIds: cluster.map(c => c.id),
    evidenceKeyCount: allKeys.size,
    sampleEvidenceKeys: [...allKeys].slice(0, 10),
    isNewTopic: !mappedExistingTopic,
    status: "proposed-cluster",
    proposedBy: "ai-assisted",
    reviewStatus: "pending-scholarly-review"
  });
}

// Sort: largest clusters first, then by whether they map to existing topics
proposedTopics.sort((a, b) => {
  if (a.mappedExistingTopic && !b.mappedExistingTopic) return -1;
  if (!a.mappedExistingTopic && b.mappedExistingTopic) return 1;
  return b.candidateCount - a.candidateCount;
});

const output = {
  workstream: "MFD-11",
  pass: "B",
  phase: "semantic-clustering",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  parameters: {
    similarityThreshold: SIMILARITY_THRESHOLD,
    evidenceOverlapThreshold: EVIDENCE_OVERLAP_THRESHOLD
  },
  summary: {
    totalCandidates: index.candidates.length,
    totalClusters: clusters.length,
    clustersMappedToExisting: proposedTopics.filter(t => t.mappedExistingTopic).length,
    newTopicClusters: proposedTopics.filter(t => t.isNewTopic).length,
    singletonClusters: clusters.filter(c => c.length === 1).length,
    multiCandidateClusters: clusters.filter(c => c.length > 1).length,
    avgClusterSize: (index.candidates.length / clusters.length).toFixed(1)
  },
  clusters: proposedTopics
};

writeFileSync(OUT_PATH, JSON.stringify(output, null, 2) + "\n");

console.log(`\n=== CLUSTERING RESULTS ===`);
console.log(`Total clusters: ${clusters.length}`);
console.log(`Mapped to existing topics: ${output.summary.clustersMappedToExisting}`);
console.log(`New topic clusters: ${output.summary.newTopicClusters}`);
console.log(`Singleton clusters: ${output.summary.singletonClusters}`);
console.log(`Multi-candidate clusters: ${output.summary.multiCandidateClusters}`);
console.log(`Avg cluster size: ${output.summary.avgClusterSize}`);
console.log(`\nTop 15 largest clusters:`);
for (const t of proposedTopics.slice(0, 15)) {
  const tag = t.mappedExistingTopic ? `[-> ${t.mappedExistingTopic}]` : '[NEW]';
  console.log(`  ${t.candidateCount} candidates: ${t.proposedLabel} ${tag}`);
}
console.log(`\nWrote ${OUT_PATH}`);
