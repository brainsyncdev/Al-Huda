// MFD-11 Wave 13: Surah 97 (Al-Qadr) genuine re-extraction.
// Covers 97:1-5 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "097-0001-0005.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 97:${n} not found`);
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

console.log("Generating Surah 97 (Al-Qadr) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T00:15:00.000Z";

const PASSAGES = [
  { id: "ext-097-p1", from: 1, to: 3,
    label: "Indeed sent Quran down Night Decree; what make know Night Decree; Night Decree better thousand months",
    mainLabel: "The Quran sent down during the Night of Decree whose greatness is questioned rhetorically and then declared better than a thousand months" },
  { id: "ext-097-p2", from: 4, to: 5,
    label: "angels Spirit descend therein permission Lord every matter; Peace it until emergence dawn",
    mainLabel: "The angels and the Spirit descending therein by their Lord's permission for every matter; peace prevailing until the emergence of dawn" }
];

const SUB_LABELS = {
  "ext-097-p1": [
    "The Quran sent down during the Night of Decree",
    "The greatness of the Night of Decree questioned rhetorically",
    "Declared better than a thousand months"
  ],
  "ext-097-p2": [
    "The angels and the Spirit descending therein by their Lord's permission for every matter",
    "Peace prevailing until the emergence of dawn"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`97:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`97:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 97, surahName: "Al-Qadr",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the thousand-months comparison (3) before the angelic-descent description opens (4); P2 covers the two-verse closing pair on descent-by-permission and peace-until-dawn (4-5).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (97:1-3) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Night of Decree named superior to a thousand months as temporal magnification", keys: ["97:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Quran's descent anchored to the Night of Decree as its temporal locus", keys: ["97:1"], evidenceClass: "EXPLICIT_TEXT" });

  const qadr = findWord(1, ["\u0642","\u062f","\u0631"]);
  if (qadr) e.terminology.push({ term: qadr, transliteration: "laylat al-qadr", gloss: "the Night of Decree (editorial gloss)", keys: ["97:1"] });
}

// === POPULATE P2 (97:4-5) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Peace characterising the entire night until dawn breaks", keys: ["97:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Angels and the Spirit descending by divine permission for every decreed matter", keys: ["97:4"], evidenceClass: "EXPLICIT_TEXT" });

  const ruh = findWord(4, ["\u0631","\u0648","\u062d"]);
  if (ruh) e.terminology.push({ term: ruh, transliteration: "al-ruh", gloss: "the Spirit (editorial gloss)", keys: ["97:4"] });
  const salam = findWord(5, ["\u0633","\u0644","\u0627","\u0645"]);
  if (salam) e.terminology.push({ term: salam, transliteration: "salam", gloss: "peace (editorial gloss)", keys: ["97:5"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `097-al-qadr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 097-al-qadr-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-097-p1,ext-097-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1978", label: "Quran descended on the Night of Decree better than a thousand months", def: "In 97:1-3: Indeed We sent the Quran down during the Night of Decree; and what can make you know what is the Night of Decree; the Night of Decree is better than a thousand months.", key: "97:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Inzal tied to laylat al-qadr."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Temporal magnification of worship."}] },
  { id: "cand-1979", label: "Angels and Spirit descending by permission for every matter in peace until dawn", def: "In 97:4-5: The angels and the Spirit descend therein by permission of their Lord for every matter; peace it is until the emergence of dawn.", key: "97:4", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Mala'ikah wa-ruh tanazzalu bi-idhn."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Salam hatta matla' al-fajr."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `097-al-qadr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-121.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-121.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");