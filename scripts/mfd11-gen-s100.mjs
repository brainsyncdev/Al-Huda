// MFD-11 Wave 13: Surah 100 (Al-Adiyat) genuine re-extraction.
// Covers 100:1-11 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "100-0001-0011.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 100:${n} not found`);
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

console.log("Generating Surah 100 (Al-Adiyat) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T00:45:00.000Z";

const PASSAGES = [
  { id: "ext-100-p1", from: 1, to: 5,
    label: "racers panting; producers sparks striking; chargers dawn; stirring up dust; arriving center collectively",
    mainLabel: "Oaths by the panting racers, the spark-producing strikers and the dawn-charging steeds that stir up dust and arrive at the centre collectively" },
  { id: "ext-100-p2", from: 6, to: 8,
    label: "Indeed mankind Lord ungrateful; indeed he that witness; indeed he love wealth intense",
    mainLabel: "Mankind declared ungrateful to his Lord — a fact to which he himself bears witness — and intense in his love of wealth" },
  { id: "ext-100-p3", from: 9, to: 11,
    label: "not know contents graves scattered; within breasts obtained; Indeed Lord them Day fully Acquainted",
    mainLabel: "Does he not know that when the contents of the graves are scattered and what is within the breasts is obtained, their Lord will be fully Acquainted with them on that Day" }
];

const SUB_LABELS = {
  "ext-100-p1": [
    "The racers sworn by, panting",
    "The producers of sparks when striking",
    "The chargers at dawn",
    "Stirring up clouds of dust thereby",
    "Arriving at the centre collectively"
  ],
  "ext-100-p2": [
    "Mankind declared ungrateful to his Lord",
    "He himself bearing witness to that ingratitude",
    "Intense in his love of wealth"
  ],
  "ext-100-p3": [
    "Does he not know when the contents of the graves are scattered",
    "And what is within the breasts is obtained",
    "Their Lord being fully Acquainted with them on that Day"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`100:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`100:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 100, surahName: "Al-Adiyat",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the collective-centre arrival (5) before the ingratitude diagnosis opens (6); P2 ends with the intense-wealth-love statement (8) before the grave-scattering question begins (9); P3 runs through the three-verse closing eschatological disclosure ending with divine acquaintance (9-11).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (100:1-5) ===
{
  const e = extractions[0];

  e.relationships.push({ label: "Five-fold oath by war-horse attributes establishing intensity and purpose", keys: ["100:1","100:2","100:3","100:4","100:5"], evidenceClass: "EXPLICIT_TEXT" });

  const adiyat = findWord(1, ["\u0639","\u062f","\u064a","\u0627","\u062a"]);
  if (adiyat) e.terminology.push({ term: adiyat, transliteration: "al-'adiyat", gloss: "the racers/chargers (editorial gloss)", keys: ["100:1"] });
  const dabhan = findWord(1, ["\u0636","\u0628","\u062d"]);
  if (dabhan) e.terminology.push({ term: dabhan, transliteration: "dabhan", gloss: "panting (editorial gloss)", keys: ["100:1"] });
  const qadhat = findWord(2, ["\u0642","\u062f","\u062d"]);
  // Using 'sparks' reference
  const mayuri = findWord(2, ["\u0645","\u0648","\u0631"]);
  if (mayuri) e.terminology.push({ term: mayuri, transliteration: "al-muriyat", gloss: "spark-producers/strikers (editorial gloss)", keys: ["100:2"] });
  const mughirat = findWord(3, ["\u0645","\u063a","\u064a","\u0631"]);
  if (mughirat) e.terminology.push({ term: mughirat, transliteration: "al-mughirat", gloss: "the chargers (editorial gloss)", keys: ["100:3"] });
}

// === POPULATE P2 (100:6-8) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Ingratitude toward the Lord self-witnessed by man himself", keys: ["100:6","100:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Intense love of wealth as a defining human trait", keys: ["100:8"], evidenceClass: "EXPLICIT_TEXT" });

  const kanud = findWord(6, ["\u0643","\u0646","\u0648","\u062f"]);
  if (kanud) e.terminology.push({ term: kanud, transliteration: "kanud", gloss: "ungrateful (editorial gloss)", keys: ["100:6"] });
  const shahid = findWord(7, ["\u0634","\u0647","\u062f"]);
  if (shahid) e.terminology.push({ term: shahid, transliteration: "shahid", gloss: "witness (editorial gloss)", keys: ["100:7"] });
  const hubbKhayr = findWord(8, ["\u062d","\u0628","\u062e","\u064a","\u0631"]);
  // Using 'love of wealth' reference
  const shadid = findWord(8, ["\u0634","\u062f","\u064a","\u062f"]);
  if (shadid) e.terminology.push({ term: shadid, transliteration: "shadid", gloss: "intense (editorial gloss)", keys: ["100:8"] });
}

// === POPULATE P3 (100:9-11) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Grave-contents scattered and breast-secrets obtained exposing all hidden reality", keys: ["100:9","100:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine acquaintance with every person on that Day as the ultimate accountability", keys: ["100:11"], evidenceClass: "EXPLICIT_TEXT" });

  const buthirat = findWord(9, ["\u0628","\u0639","\u062b","\u0631"]);
  if (buthirat) e.terminology.push({ term: buthirat, transliteration: "bu'thirat", gloss: "scattered/exhumed (editorial gloss)", keys: ["100:9"] });
  const hussilat = findWord(10, ["\u062d","\u0635","\u0644"]);
  if (hussilat) e.terminology.push({ term: hussilat, transliteration: "hussilat", gloss: "obtained/extracted (editorial gloss)", keys: ["100:10"] });
  const khabir = findWord(11, ["\u062e","\u0628","\u064a","\u0631"]);
  if (khabir) e.terminology.push({ term: khabir, transliteration: "khabir", gloss: "fully Acquainted (editorial gloss)", keys: ["100:11"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `100-al-adiyat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 100-al-adiyat-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-100-p1,ext-100-p2,ext-100-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1985", label: "War-horse oaths by panting racers, spark-strikers and dawn-chargers", def: "In 100:1-5: By the racers panting and the producers of sparks when striking and the chargers at dawn stirring up thereby clouds of dust arriving thereby in the center collectively.", key: "100:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Five-fold qasam by horse attributes."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Intensity of effort as created capacity."}] },
  { id: "cand-1986", label: "Self-witnessed ingratitude and intense wealth-love as human diagnosis", def: "In 100:6-8: Indeed mankind to his Lord is ungrateful and indeed he is to that a witness and indeed he is in love of wealth intense.", key: "100:6", overlap: [{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Kanud self-attested."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Shahid ala dhalika internalised."}] },

  { id: "cand-1987", label: "Graves scattered and breasts extracted with Lord fully Acquainted on that Day", def: "In 100:9-11: But does he not know that when the contents of the graves are scattered and that within the breasts is obtained; indeed their Lord with them that Day is fully Acquainted.", key: "100:9", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Bu'thirat qubur and tahsil sudur."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Rabbuhum bihim yawma'idhin khabir."}] }
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
extractions[2].topicCandidateIds = candidates.candidates.slice(2, 3).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `100-al-adiyat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-124.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-124.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");