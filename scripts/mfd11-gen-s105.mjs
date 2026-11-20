// MFD-11 Wave 13: Surah 105 (Al-Fil) genuine re-extraction.
// Covers 105:1-5 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "105-0001-0005.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 105:${n} not found`);
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

console.log("Generating Surah 105 (Al-Fil) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T01:35:00.000Z";

const PASSAGES = [
  { id: "ext-105-p1", from: 1, to: 2,
    label: "considered Lord dealt companions elephant; make plan misguidance",
    mainLabel: "The Prophet asked to consider how his Lord dealt with the companions of the elephant, making their plan into misguidance" },
  { id: "ext-105-p2", from: 3, to: 5,
    label: "sent against them birds flocks; striking stones hard clay; made like eaten straw",
    mainLabel: "Birds sent against them in flocks, striking them with stones of hard clay until they were rendered like eaten straw" }
];

const SUB_LABELS = {
  "ext-105-p1": [
    "The Prophet asked to consider how the Lord dealt with the companions of the elephant",
    "Their plan turned into misguidance by divine intervention"
  ],
  "ext-105-p2": [
    "Birds sent against them in flocks",
    "Striking them with stones of hard clay",
    "They were made like eaten straw"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`105:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`105:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 105, surahName: "Al-Fil",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the plan-misguidance reversal (2) before the bird-strike mechanism opens (3); P2 runs through the three-verse destruction sequence ending with the eaten-straw simile (3-5).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (105:1-2) ===
{
  const e = extractions[0];

  e.propheticNarratives.push({ label: "Companions of the elephant defeated through divine plan-reversal", keys: ["105:1","105:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine dealing invoked rhetorically as a sign for the Prophet", keys: ["105:1"], evidenceClass: "EXPLICIT_TEXT" });

  const fil = findWord(1, ["\u0641","\u064a","\u0644"]);
  if (fil) e.terminology.push({ term: fil, transliteration: "al-fil", gloss: "the elephant (editorial gloss)", keys: ["105:1"] });
  const tadlil = findWord(2, ["\u062a","\u0636","\u0644","\u064a","\u0644"]);
  if (tadlil) e.terminology.push({ term: tadlil, transliteration: "tadlil", gloss: "misguidance/frustration (editorial gloss)", keys: ["105:2"] });
}

// === POPULATE P2 (105:3-5) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Total annihilation reducing an army to the state of devoured stubble", keys: ["105:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Flock-birds armed with baked-clay stones as the instrument of divine punishment", keys: ["105:3","105:4"], evidenceClass: "EXPLICIT_TEXT" });

  const ababil = findWord(3, ["\u0623","\u0628","\u0627","\u0628","\u064a","\u0644"]);
  if (ababil) e.terminology.push({ term: ababil, transliteration: "ababil", gloss: "flocks/successive groups (editorial gloss)", keys: ["105:3"] });
  const sijjil = findWord(4, ["\u0633","\u062c","\u064a","\u0644"]);
  if (sijjil) e.terminology.push({ term: sijjil, transliteration: "hijarah min sijjil", gloss: "stones of hard/baked clay (editorial gloss)", keys: ["105:4"] });
  const ma'kul = findWord(5, ["\u0645","\u0623","\u0643","\u0648","\u0644"]);
  // Using 'eaten' reference
  const asf = findWord(5, ["\u0639","\u0635","\u0641"]);
  if (asf) e.terminology.push({ term: asf, transliteration: "ka-'asf ma'kul", gloss: "like eaten straw/stubble (editorial gloss)", keys: ["105:5"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `105-al-fil-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 105-al-fil-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-105-p1,ext-105-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1998", label: "Elephant companions' plan frustrated by divine intervention", def: "In 105:1-2: Have you not considered O Muhammad how your Lord dealt with the companions of the elephant; did He not make their plan into misguidance.", key: "105:1", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Kayd rendered tadlil."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Pre-hijrah miracle protecting the Ka'bah."}] },
  { id: "cand-1999", label: "Ababil birds with sijjil stones reducing army to eaten straw", def: "In 105:3-5: And He sent against them birds in flocks striking them with stones of hard clay and He made them like eaten straw.", key: "105:3", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Tayr ababil and hijarah min sijjil."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ka-asf ma'kul total destruction simile."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `105-al-fil-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-129.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-129.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");