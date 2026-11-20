// MFD-11 Pass A parallel fan-out registry.
// Allocates disjoint candidate-ID blocks and passage-number ranges per surah
// so concurrent subagents cannot collide on IDs or filenames.
// READ ONLY except for writing research/mfd-11/data/pass-a-registry.json.

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS = path.join(ROOT, "node_modules", "quran-json", "dist", "chapters", "en");
const EXT = path.join(ROOT, "research", "mfd-11", "extractions");
const CAND = path.join(ROOT, "research", "mfd-11", "candidates");

// Measure what is already extracted, per surah.
const done = new Map(); // surah -> Set of ayah numbers
let maxCand = 0;
for (const f of readdirSync(EXT).filter(f => f.endsWith(".json"))) {
  const j = JSON.parse(readFileSync(path.join(EXT, f), "utf8"));
  if (!done.has(j.surah)) done.set(j.surah, new Set());
  for (const k of j.verseKeys || []) done.get(j.surah).add(Number(k.split(":")[1]));
}
for (const f of readdirSync(CAND).filter(f => f.endsWith(".json"))) {
  const j = JSON.parse(readFileSync(path.join(CAND, f), "utf8"));
  for (const c of j.candidates || []) {
    const n = Number(String(c.candidateId).replace("cand-", ""));
    if (n > maxCand) maxCand = n;
  }
}

// Existing candidate batch numbers, to allocate fresh ones.
const usedBatches = new Set(
  readdirSync(CAND)
    .filter(f => /^candidates-\d+\.json$/.test(f))
    .map(f => Number(f.match(/candidates-(\d+)\.json/)[1]))
);

const registry = [];
let nextCand = maxCand + 1;
let nextBatch = Math.max(...usedBatches) + 1;

for (let s = 1; s <= 114; s++) {
  const corpus = JSON.parse(readFileSync(path.join(CORPUS, `${s}.json`), "utf8"));
  const total = corpus.total_verses ?? corpus.verses.length;
  if (!Number.isInteger(total) || total <= 0) throw new Error(`Surah ${s}: cannot determine verse count`);
  const covered = done.get(s) || new Set();
  const missing = [];
  for (let a = 1; a <= total; a++) if (!covered.has(a)) missing.push(a);
  if (missing.length === 0) continue;

  // Contiguous remaining range (all current work is prefix-complete).
  const from = missing[0];
  const to = missing[missing.length - 1];
  const contiguous = missing.length === to - from + 1;

  const pad = String(s).padStart(3, "0");
  const slug = corpus.transliteration
    .toLowerCase()
    .replace(/['\u2019`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  // Passage budget: ~35 verses per passage, minimum 1.
  const passages = Math.max(1, Math.ceil(missing.length / 35));
  // Candidate block: 10 per passage, generous fixed reservation.
  const candCount = passages * 10;

  registry.push({
    surah: s,
    name: corpus.transliteration,
    totalVerses: total,
    alreadyCovered: covered.size,
    remainingVerses: missing.length,
    fromAyah: from,
    toAyah: to,
    contiguous,
    filePrefix: `${pad}-${slug}`,
    passageStart: 1,
    passageBudget: passages,
    candidateStart: `cand-${String(nextCand).padStart(4, "0")}`,
    candidateEnd: `cand-${String(nextCand + candCount - 1).padStart(4, "0")}`,
    candidateBudget: candCount,
    candidateBatchFile: `candidates-${String(nextBatch).padStart(3, "0")}.json`,
    generatorScript: `scripts/mfd11-gen-s${pad}.mjs`,
    corpusView: `research/mfd-11/corpus-view/${pad}-${String(from).padStart(4, "0")}-${String(to).padStart(4, "0")}.json`
  });
  nextCand += candCount;
  nextBatch += 1;
}

const out = {
  workstream: "MFD-11",
  pass: "A",
  generatedAt: new Date().toISOString(),
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  note: "Disjoint allocation for parallel per-surah extraction. Each agent owns exactly its filePrefix, candidate block, batch file, and generator script. Never write outside your allocation.",
  highestCandidateBeforeAllocation: maxCand,
  surahsComplete: [...done.entries()].filter(([s]) => !registry.some(r => r.surah === s)).map(([s]) => s).sort((a, b) => a - b),
  allocations: registry
};

writeFileSync(
  path.join(ROOT, "research", "mfd-11", "data", "pass-a-registry.json"),
  JSON.stringify(out, null, 2) + "\n"
);

console.log(`Surahs already complete: ${out.surahsComplete.join(", ")}`);
console.log(`Surahs needing work: ${registry.length}`);
console.log(`Total remaining verses: ${registry.reduce((n, r) => n + r.remainingVerses, 0)}`);
console.log(`Candidate IDs reserved: cand-${String(maxCand + 1).padStart(4, "0")} .. cand-${String(nextCand - 1).padStart(4, "0")}`);
console.log("");
for (const r of registry.slice(0, 12)) {
  console.log(`  s${r.surah} ${r.name}: ${r.fromAyah}-${r.toAyah} (${r.remainingVerses}v) ${r.candidateStart}..${r.candidateEnd} -> ${r.candidateBatchFile}`);
}
if (registry.length > 12) console.log(`  ... ${registry.length - 12} more in registry file`);
