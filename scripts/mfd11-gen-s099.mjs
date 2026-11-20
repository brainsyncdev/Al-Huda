// MFD-11 Wave 13: Surah 99 (Az-Zalzalah) genuine re-extraction.
// Covers 99:1-8 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "099-0001-0008.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 99:${n} not found`);
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

console.log("Generating Surah 99 (Az-Zalzalah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T00:35:00.000Z";

const PASSAGES = [
  { id: "ext-099-p1", from: 1, to: 5,
    label: "earth shaken final earthquake; earth discharges burdens; man says what wrong it; Day report news; Lord commanded it",
    mainLabel: "The earth shaken with its final earthquake and discharging its burdens while man asks what is wrong with it; that Day it will report its news because the Lord has commanded it" },
  { id: "ext-099-p2", from: 6, to: 8,
    label: "Day people depart separated categories shown result deeds; whoever does atom weight good see it; whoever does atom weight evil see it",
    mainLabel: "That Day people will depart separated into categories to be shown the results of their deeds; whoever does an atom's weight of good will see it and whoever does an atom's weight of evil will see it" }
];

const SUB_LABELS = {
  "ext-099-p1": [
    "The earth shaken with its final earthquake",
    "The earth discharging its burdens",
    "Man asking what is wrong with it",
    "That Day the earth reporting its news",
    "Because the Lord has commanded it"
  ],
  "ext-099-p2": [
    "People departing separated into categories to be shown their deeds' results",
    "Whoever does an atom's weight of good seeing it",
    "Whoever does an atom's weight of evil seeing it"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`99:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`99:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 99, surahName: "Az-Zalzalah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the earth's news-reporting by divine command (5) before the human-departure scene opens (6); P2 covers the three-verse closing triad on separated departure and atom-weight precision of both good and evil (6-8).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (99:1-5) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Earthquake and burden-discharge producing human bewilderment", keys: ["99:1","99:2","99:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Earth personified as reporting its news by divine command", keys: ["99:4","99:5"], evidenceClass: "EXPLICIT_TEXT" });

  const zalzalah = findWord(1, ["\u0632","\u0644","\u0632","\u0644"]);
  if (zalzalah) e.terminology.push({ term: zalzalah, transliteration: "zilzalaha", gloss: "its earthquake (editorial gloss)", keys: ["99:1"] });
  const athqal = findWord(2, ["\u0623","\u062b","\u0642","\u0627","\u0644"]);
  if (athqal) e.terminology.push({ term: athqal, transliteration: "athqalaha", gloss: "its burdens (editorial gloss)", keys: ["99:2"] });
  const akhbar = findWord(4, ["\u0623","\u062e","\u0628","\u0627","\u0631"]);
  if (akhbar) e.terminology.push({ term: akhbar, transliteration: "akhbaraha", gloss: "its news (editorial gloss)", keys: ["99:4"] });
}

// === POPULATE P2 (99:6-8) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Separated departure to witness one's own deeds' results", keys: ["99:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Atom-weight precision applied equally to good and evil", keys: ["99:7","99:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Absolute accountability at sub-atomic scale leaving no deed unshown", keys: ["99:7","99:8"], evidenceClass: "EXPLICIT_TEXT" });

  const ashtat = findWord(6, ["\u0623","\u0634","\u062a","\u0627","\u062a"]);
  if (ashtat) e.terminology.push({ term: ashtat, transliteration: "ashtatan", gloss: "separated/dispersed (editorial gloss)", keys: ["99:6"] });
  const dharrah = findWord(7, ["\u0630","\u0631","\u0629"]);
  if (dharrah) e.terminology.push({ term: dharrah, transliteration: "mithqala dharrah", gloss: "atom's weight (editorial gloss)", keys: ["99:7"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `099-az-zalzalah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 099-az-zalzalah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-099-p1,ext-099-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1983", label: "Earth's final earthquake discharging burdens and reporting news by divine command", def: "In 99:1-5: When the earth is shaken with its final earthquake and the earth discharges its burdens and man says what is wrong with it; that Day it will report its news because your Lord has commanded it.", key: "99:1", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Zilzal and barzah sequence."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Rabbuka ammaraha as causation."}] },
  { id: "cand-1984", label: "Separated departure to witness deeds with atom-weight precision", def: "In 99:6-8: That Day the people will depart separated into categories to be shown the result of their deeds; so whoever does an atom's weight of good will see it and whoever does an atom's weight of evil will see it.", key: "99:6", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Yashudhu 'amalahum wa-yara."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Dharrah-scale equity."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `099-az-zalzalah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-123.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-123.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");