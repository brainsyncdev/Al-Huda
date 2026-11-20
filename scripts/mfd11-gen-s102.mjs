// MFD-11 Wave 13: Surah 102 (At-Takathur) genuine re-extraction.
// Covers 102:1-8 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "102-0001-0008.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 102:${n} not found`);
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

console.log("Generating Surah 102 (At-Takathur) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T01:05:00.000Z";

const PASSAGES = [
  { id: "ext-102-p1", from: 1, to: 4,
    label: "Competition worldly increase diverts you; until visit graveyards; No going know; Then no going know",
    mainLabel: "Competition in worldly increase diverting humanity until they visit the graveyards; doubled declaration that they are going to know" },
  { id: "ext-102-p2", from: 5, to: 8,
    label: "No if only knew knowledge certainty; surely see Hellfire; then surely see it eye certainty; then surely asked Day about pleasure",
    mainLabel: "If they only knew with knowledge of certainty they would surely see the Hellfire and then see it with the eye of certainty; on that Day they will surely be asked about pleasure" }
];

const SUB_LABELS = {
  "ext-102-p1": [
    "Competition in worldly increase diverting you",
    "Until you visit the graveyards",
    "First declaration: you are going to know",
    "Reinforced: then no, you are going to know"
  ],
  "ext-102-p2": [
    "If you only knew with knowledge of certainty",
    "You would surely see the Hellfire",
    "Then you would surely see it with the eye of certainty",
    "Then you will surely be asked that Day about pleasure"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`102:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`102:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 102, surahName: "At-Takathur",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the doubled knowing-declaration (3-4) before the certainty-knowledge conditional opens (5); P2 runs through the four-verse escalation from ilm al-yaqin to ayn al-yaqin to the closing pleasure-accountability question (5-8).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (102:1-4) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Worldly-increase competition as distraction ending at the graveyard visit", keys: ["102:1","102:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Takathur named as the driving social force diverting from ultimate reality", keys: ["102:1"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Doubled declaration establishing inevitable future knowledge", keys: ["102:3","102:4"], evidenceClass: "EXPLICIT_TEXT" });

  const takathur = findWord(1, ["\u062a","\u0643","\u0627","\u062b","\u0631"]);
  if (takathur) e.terminology.push({ term: takathur, transliteration: "al-takathur", gloss: "competition in increase (editorial gloss)", keys: ["102:1"] });
  const maqabir = findWord(2, ["\u0645","\u0642","\u0627","\u0628","\u0631"]);
  // Using 'graveyards' reference
  const qubur = findWord(2, ["\u0642","\u0628","\u0648","\u0631"]);
  if (qubur) e.terminology.push({ term: qubur, transliteration: "al-maqabir", gloss: "the graveyards (editorial gloss)", keys: ["102:2"] });
}

// === POPULATE P2 (102:5-8) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Knowledge of certainty producing direct vision of Hellfire", keys: ["102:5","102:6","102:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Accountability for pleasure on that Day as the closing interrogation", keys: ["102:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Three-stage epistemic escalation: ilm al-yaqin, ru'yat al-jahim, ayn al-yaqin", keys: ["102:5","102:6","102:7"], evidenceClass: "EXPLICIT_TEXT" });

  const ilmYaqin = findWord(5, ["\u0639","\u0644","\u0645","\u064a","\u0642","\u064a","\u0646"]);
  // Using 'knowledge of certainty' reference
  const yaqin = findWord(5, ["\u064a","\u0642","\u064a","\u0646"]);
  if (yaqin) e.terminology.push({ term: yaqin, transliteration: "ilm al-yaqin", gloss: "knowledge of certainty (editorial gloss)", keys: ["102:5"] });
  const jahim = findWord(6, ["\u062c","\u062d","\u064a","\u0645"]);
  if (jahim) e.terminology.push({ term: jahim, transliteration: "al-jahim", gloss: "the Hellfire (editorial gloss)", keys: ["102:6"] });
  const aynYaqin = findWord(7, ["\u0639","\u064a","\u0646","\u064a","\u0642","\u064a","\u0646"]);
  // Using 'eye of certainty' reference
  const ayn = findWord(7, ["\u0639","\u064a","\u0646"]);
  if (ayn) e.terminology.push({ term: ayn, transliteration: "ayn al-yaqin", gloss: "eye of certainty (editorial gloss)", keys: ["102:7"] });
  const naim = findWord(8, ["\u0646","\u0639","\u064a","\u0645"]);
  if (naim) e.terminology.push({ term: naim, transliteration: "al-na'im", gloss: "pleasure/blessing (editorial gloss)", keys: ["102:8"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `102-at-takathur-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 102-at-takathur-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-102-p1,ext-102-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1991", label: "Takathur diverting until graveyard visit with doubled knowing-warning", def: "In 102:1-4: Competition in worldly increase diverts you until you visit the graveyards; no you are going to know; then no you are going to know.", key: "102:1", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Takathur as spiritual distraction."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La-ta'lamunna doubled warning."}] },
  { id: "cand-1992", label: "Certainty-knowledge escalating to Hellfire vision and pleasure accountability", def: "In 102:5-8: No if you only knew with knowledge of certainty you would surely see the Hellfire then you would surely see it with the eye of certainty then you will surely be asked that Day about pleasure.", key: "102:5", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ilm yaqin to ayn yaqin progression."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Na'im questioned as accountability."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `102-at-takathur-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-126.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-126.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");