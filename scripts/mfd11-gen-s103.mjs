// MFD-11 Wave 13: Surah 103 (Al-Asr) genuine re-extraction.
// Covers 103:1-3 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "103-0001-0003.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 103:${n} not found`);
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

console.log("Generating Surah 103 (Al-Asr) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T01:15:00.000Z";

const PASSAGES = [
  { id: "ext-103-p1", from: 1, to: 2,
    label: "By time; Indeed mankind loss",
    mainLabel: "Oath by time establishing that mankind is in a state of loss" },
  { id: "ext-103-p2", from: 3, to: 3,
    label: "Except believed righteous deeds advised each other truth advised each other patience",
    mainLabel: "The exception: those who have believed, done righteous deeds, advised one another to truth and advised one another to patience" }
];

const SUB_LABELS = {
  "ext-103-p1": [
    "Oath sworn by time",
    "Mankind declared to be in loss"
  ],
  "ext-103-p2": [
    "Except those who believed, did righteous deeds, advised each other to truth and advised each other to patience"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`103:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`103:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 103, surahName: "Al-Asr",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the universal-loss declaration (2) before the four-fold exception opens (3); P2 is the single-verse exception comprising belief, righteous deeds, mutual truth-counsel and mutual patience-counsel.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (103:1-2) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Universal human loss declared under the oath of time", keys: ["103:1","103:2"], evidenceClass: "EXPLICIT_TEXT" });

  const asr = findWord(1, ["\u0639","\u0635","\u0631"]);
  if (asr) e.terminology.push({ term: asr, transliteration: "al-'asr", gloss: "time/epoch (editorial gloss)", keys: ["103:1"] });
  const khusr = findWord(2, ["\u062e","\u0633","\u0631"]);
  if (khusr) e.terminology.push({ term: khusr, transliteration: "khusr", gloss: "loss (editorial gloss)", keys: ["103:2"] });
}

// === POPULATE P2 (103:3) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Four-fold rescue condition: belief, righteous deeds, mutual truth-counsel, mutual patience-counsel", keys: ["103:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Mutual counsel toward truth and patience as communal obligations completing individual faith and deeds", keys: ["103:3"], evidenceClass: "EXPLICIT_TEXT" });

  const tawasawHaqq = findWord(3, ["\u062a","\u0648","\u0627","\u0635","\u0648","\u062d","\u0642"]);
  // Using 'advised truth' reference
  const haqq = findWord(3, ["\u062d","\u0642"]);
  if (haqq) e.terminology.push({ term: haqq, transliteration: "al-haqq", gloss: "truth (editorial gloss)", keys: ["103:3"] });
  const sabr = findWord(3, ["\u0635","\u0628","\u0631"]);
  if (sabr) e.terminology.push({ term: sabr, transliteration: "al-sabr", gloss: "patience (editorial gloss)", keys: ["103:3"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `103-al-asr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 103-al-asr-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-103-p1,ext-103-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1993", label: "Time-oath declaring universal human loss", def: "In 103:1-2: By time; indeed mankind is in loss.", key: "103:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Qasam bi'l-asr."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Insan fi khusr as default state."}] },
  { id: "cand-1994", label: "Four-fold exception: belief, righteous deeds, mutual truth and patience counsel", def: "In 103:3: Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.", key: "103:3", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman plus amal salih plus tawasi."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Tawasi bisabr as communal obligation."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `103-al-asr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-127.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-127.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");