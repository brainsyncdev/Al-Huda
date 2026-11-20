// MFD-11 Wave 13: Surah 112 (Al-Ikhlas) genuine re-extraction.
// Covers 112:1-4 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "112-0001-0004.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 112:${n} not found`);
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

console.log("Generating Surah 112 (Al-Ikhlas) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T02:45:00.000Z";

const PASSAGES = [
  { id: "ext-112-p1", from: 1, to: 2,
    label: "Say He Allah One; Allah Eternal Refuge",
    mainLabel: "Allah declared One and the Eternal Refuge upon whom all depend" },
  { id: "ext-112-p2", from: 3, to: 4,
    label: "not beget nor begotten; none equivalent Him",
    mainLabel: "He neither begets nor is begotten, and there is none equivalent to Him" }
];

const SUB_LABELS = {
  "ext-112-p1": [
    "Allah declared absolutely One",
    "Allah named as the Eternal Refuge upon whom all creation depends"
  ],
  "ext-112-p2": [
    "He neither begets nor is begotten",
    "There is none equivalent or comparable to Him"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`112:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`112:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 112, surahName: "Al-Ikhlas",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the Samad affirmation (2) before the two negations open (3-4); P2 covers the closing pair denying progeny and equivalence — completing the four-fold definition of divine oneness.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (112:1-2) ===
{
  const e = extractions[0];
  const ahad = findWord(1, ["\u0623","\u062d","\u062f"]);
  if (ahad) e.divineNamesAndAttributes.push({ term: ahad, transliteration: "Ahad", gloss: "the One/Absolute Unity (editorial gloss)", keys: ["112:1"] });
  const samad = findWord(2, ["\u0635","\u0645","\u062f"]);
  if (samad) e.divineNamesAndAttributes.push({ term: samad, transliteration: "al-Samad", gloss: "the Eternal Refuge/Self-Sufficient (editorial gloss)", keys: ["112:2"] });

  e.relationships.push({ label: "Oneness and self-sufficiency paired as the foundational divine attributes", keys: ["112:1","112:2"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P2 (112:3-4) ===
{
  const e = extractions[1];

  e.relationships.push({ label: "Negation of progeny and equivalence completing the absolute uniqueness declaration", keys: ["112:3","112:4"], evidenceClass: "EXPLICIT_TEXT" });

  const lamYalid = findWord(3, ["\u0644","\u0645","\u064a","\u0644","\u062f"]);
  // Using 'not beget' reference
  const yalid = findWord(3, ["\u064a","\u0644","\u062f"]);
  if (yalid) e.terminology.push({ term: yalid, transliteration: "lam yalid wa-lam yulad", gloss: "neither begets nor is begotten (editorial gloss)", keys: ["112:3"] });
  const kufu = findWord(4, ["\u0643","\u0641","\u0648"]);
  if (kufu) e.terminology.push({ term: kufu, transliteration: "kufuwan", gloss: "equivalent/comparable (editorial gloss)", keys: ["112:4"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `112-al-ikhlas-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 112-al-ikhlas-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-112-p1,ext-112-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2012", label: "Allah as Ahad and Samad: absolute oneness and self-sufficiency", def: "In 112:1-2: Say He is Allah One; Allah the Eternal Refuge.", key: "112:1", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Ahad as pure monotheism."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Samad as self-sufficient master."}] },
  { id: "cand-2013", label: "Negation of progeny and equivalence completing divine uniqueness", def: "In 112:3-4: He neither begets nor is begotten; and there is none equivalent to Him.", key: "112:3", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"La yalid wa-la yulad rejecting trinitarian and pagan models."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Wa-lam yakun lahu kufuwan ahad."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `112-al-ikhlas-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-136.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-136.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");