// MFD-11 Phase C: Arabic terminology index.
// Extracts all unique Arabic terms/phrases from candidate evidence excerpts
// and builds a searchable reference index.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CAND_DIR = path.join(ROOT, "research", "mfd-11", "candidates");
const OUT_PATH = path.join(ROOT, "research", "mfd-11", "reports", "arabic-terminology-index.json");

console.log("Building Arabic terminology index...");

// Read all candidates and extract Arabic excerpts
const termMap = new Map(); // arabicTerm -> { occurrences: [{candidateId, ayahKey}], count }
let totalExcerpts = 0;

for (const f of readdirSync(CAND_DIR).filter(f => f.endsWith(".json")).sort()) {
  const j = JSON.parse(readFileSync(path.join(CAND_DIR, f), "utf8"));
  for (const c of (j.candidates || [])) {
    for (const ev of (c.evidence || [])) {
      if (!ev.excerpt) continue;
      totalExcerpts++;
      
      // Extract individual Arabic words/phrases (split on whitespace, keep diacritics)
      const words = ev.excerpt.split(/\s+/).filter(w => /[\u0600-\u06FF]/.test(w));
      for (const word of words) {
        const normalized = word.trim();
        if (normalized.length < 2) continue;
        
        if (!termMap.has(normalized)) {
          termMap.set(normalized, { occurrences: [], count: 0 });
        }
        const entry = termMap.get(normalized);
        entry.occurrences.push({ candidateId: c.candidateId, ayahKey: ev.key });
        entry.count++;
      }
    }
  }
}

// Sort by frequency
const sortedTerms = [...termMap.entries()]
  .map(([term, data]) => ({
    term,
    count: data.count,
    uniqueAyahs: [...new Set(data.occurrences.map(o => o.ayahKey))].length,
    sampleOccurrences: data.occurrences.slice(0, 5)
  }))
  .sort((a, b) => b.count - a.count);

const index = {
  workstream: "MFD-11",
  phase: "C",
  reportType: "arabic-terminology-index",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  methodology: "Whitespace-split extraction from candidate evidence excerpts. Terms are verbatim Arabic substrings from pinned corpus. No normalization applied.",
  summary: {
    totalUniqueTerms: sortedTerms.length,
    totalExcerptsProcessed: totalExcerpts,
    termsWithMultipleOccurrences: sortedTerms.filter(t => t.count > 1).length,
    termsInMultipleAyahs: sortedTerms.filter(t => t.uniqueAyahs > 1).length
  },
  terms: sortedTerms
};

writeFileSync(OUT_PATH, JSON.stringify(index, null, 2) + "\n");

console.log(`\n=== ARABIC TERMINOLOGY INDEX ===`);
console.log(`Total unique terms: ${sortedTerms.length}`);
console.log(`Total excerpts processed: ${totalExcerpts}`);
console.log(`Terms with multiple occurrences: ${index.summary.termsWithMultipleOccurrences}`);
console.log(`Terms in multiple ayahs: ${index.summary.termsInMultipleAyahs}`);
console.log(`\nTop 20 most frequent terms:`);
for (const t of sortedTerms.slice(0, 20)) {
  console.log(`  ${t.count}x (${t.uniqueAyahs} ayahs): ${t.term}`);
}
console.log(`\nWrote ${OUT_PATH}`);
