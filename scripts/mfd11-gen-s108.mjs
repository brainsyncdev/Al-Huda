// MFD-11 Wave 13: Surah 108 (Al-Kawthar) genuine re-extraction.
// Covers 108:1-3 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "108-0001-0003.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 108:${n} not found`);
  return verses[n];
}

function findWord(vid, chars) {
  const t = fv(vid);
  for (const w of t.split(/\s+/)) {
    let match = true;
    for (const ch of chars) { if (!w.includes(ch)) { match = false; break; } }
    if (match) return w;
  }
  return null;
}

console.log("Generating Surah 108 (Al-Kawthar) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T02:05:00.000Z";

const PASSAGES = [
  { id: "ext-108-p1", from: 1, to: 2,
    label: "Indeed given Kawthar; pray Lord sacrifice",
    mainLabel: "The Prophet given Al-Kawthar and commanded to pray to his Lord and offer sacrifice" },
  { id: "ext-108-p2", from: 3, to: 3,
    label: "Indeed hater cut off",
    mainLabel: "The one who hates him declared cut off from all good" }
];

const SUB_LABELS = {
  "ext-108-p1": [
    "The Prophet given Al-Kawthar as divine abundance",
    "Commanded to pray to his Lord and offer sacrifice"
  ],
  "ext-108-p2": [
    "The one who hates him declared cut off from all good"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`108:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`108:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 108, surahName: "Al-Kawthar",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the prayer-and-sacrifice command (2) before the hater-cutting declaration opens (3); P2 is the single-verse closing verdict on the enemy's abtar status.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (108:1-2) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["108:2"], excerpt: fv(2), description: "Pray to your Lord and offer sacrifice." });

  e.humanConditionsAndSpiritualStates.push({ label: "Divine abundance granted as consolation paired with worship obligation", keys: ["108:1","108:2"], evidenceClass: "EXPLICIT_TEXT" });

  const kawthar = findWord(1, ["\u0643","\u0648","\u062b","\u0631"]);
  if (kawthar) e.terminology.push({ term: kawthar, transliteration: "al-kawthar", gloss: "abundance/the river in Paradise (editorial gloss)", keys: ["108:1"] });
  const nahr = findWord(2, ["\u0646","\u062d","\u0631"]);
  if (nahr) e.terminology.push({ term: nahr, transliteration: "wanhar", gloss: "offer sacrifice (editorial gloss)", keys: ["108:2"] });
}

// === POPULATE P2 (108:3) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Enemy of the Prophet declared cut off from posterity and all lasting good", keys: ["108:3"], evidenceClass: "EXPLICIT_TEXT" });

  const shaniaka = findWord(3, ["\u0634","\u0627","\u0646","\u0626"]);
  // Using 'hater' reference
  const shania = findWord(3, ["\u0634","\u0646","\u0623"]);
  if (shania) e.terminology.push({ term: shania, transliteration: "shani'aka", gloss: "the one who hates you (editorial gloss)", keys: ["108:3"] });
  const abtar = findWord(3, ["\u0623","\u0628","\u062a","\u0631"]);
  if (abtar) e.terminology.push({ term: abtar, transliteration: "al-abtar", gloss: "cut off/without posterity (editorial gloss)", keys: ["108:3"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `108-al-kawthar-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 108-al-kawthar-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-108-p1,ext-108-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2004", label: "Kawthar granted with prayer and sacrifice commanded", def: "In 108:1-2: Indeed We have granted you Al-Kawthar; so pray to your Lord and offer sacrifice.", key: "108:1", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Kawthar as divine gift."},{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Salah and nahr as gratitude response."}] },
  { id: "cand-2005", label: "Hater of the Prophet declared cut off from all good", def: "In 108:3: Indeed your enemy is the one cut off.", key: "108:3", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Shani'aka huwa al-abtar reversal."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Prophetic vindication against mockery."}] }
];

function citedKeys(def) {
  const m = def.match(/\bIn\s+(\d+):(\d+)(?:\s*[-\u2013]\s*(\d+))?/i);
  if (!m) return null;
  const s = Number(m[1]);
  const from = Number(m[2]);
  const to = m[3] ? Number(m[3]) : from;
  const out = [];
  for (let a = from; a <= to; a++) out.push(`${s}:${a}`);
  return out;
}

for (const cd of CAND_DEFS) {
  const keys = citedKeys(cd.def) || [cd.key];
  if (!keys.includes(cd.key)) keys.push(cd.key);
  const evidence = keys.map(k => ({
    key: k,
    excerpt: fv(Number(k.split(":")[1])),
    evidenceClass: "EXPLICIT_TEXT",
    rationale: "Full verse text as evidence for the cited span."
  }));
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence,
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 13 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 1).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(1, 2).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `108-al-kawthar-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-132.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-132.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");