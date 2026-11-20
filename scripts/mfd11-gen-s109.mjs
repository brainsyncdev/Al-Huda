// MFD-11 Wave 13: Surah 109 (Al-Kafirun) genuine re-extraction.
// Covers 109:1-6 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "109-0001-0006.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 109:${n} not found`);
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

console.log("Generating Surah 109 (Al-Kafirun) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T02:15:00.000Z";

const PASSAGES = [
  { id: "ext-109-p1", from: 1, to: 4,
    label: "Say O disbelievers; not worship what worship; nor you worshippers what I worship; nor I worshipper what worshipped",
    mainLabel: "The Prophet commanded to address the disbelievers declaring that he does not worship what they worship, nor are they worshippers of what he worships, nor is he a worshipper of what they have worshipped" },
  { id: "ext-109-p2", from: 5, to: 6,
    label: "nor you worshippers what I worship; For you your religion for me my religion",
    mainLabel: "Nor will they be worshippers of what he worships; the declaration that for them is their religion and for him is his religion" }
];

const SUB_LABELS = {
  "ext-109-p1": [
    "Command to address the disbelievers directly",
    "I do not worship what you worship",
    "Nor are you worshippers of what I worship",
    "Nor am I a worshipper of what you have worshipped"
  ],
  "ext-109-p2": [
    "Nor will you be worshippers of what I worship",
    "For you your religion and for me my religion"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`109:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`109:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 109, surahName: "Al-Kafirun",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the past-tense non-worship declaration (4) before the future-tense non-worship and closing separation statement opens (5-6); P2 covers the two-verse closing pair completing the mutual disavowal and religious separation.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (109:1-4) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["109:1"], excerpt: fv(1), description: "Say: O disbelievers." });

  e.humanConditionsAndSpiritualStates.push({ label: "Absolute theological disavowal expressed through four-fold negation", keys: ["109:2","109:3","109:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Mutual worship-incompatibility declared between the Prophet and the disbelievers", keys: ["109:2","109:3","109:4"], evidenceClass: "EXPLICIT_TEXT" });

  const kafirun = findWord(1, ["\u0643","\u0627","\u0641","\u0631","\u0648","\u0646"]);
  if (kafirun) e.terminology.push({ term: kafirun, transliteration: "al-kafirun", gloss: "the disbelievers (editorial gloss)", keys: ["109:1"] });
}

// === POPULATE P2 (109:5-6) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Religious separation finalised with mutual non-worship and separate paths", keys: ["109:5","109:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Lakum dinukum wa-liya din as the definitive coexistence boundary", keys: ["109:6"], evidenceClass: "EXPLICIT_TEXT" });

  const din = findWord(6, ["\u062f","\u064a","\u0646"]);
  if (din) e.terminology.push({ term: din, transliteration: "din", gloss: "religion/way (editorial gloss)", keys: ["109:6"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `109-al-kafirun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 109-al-kafirun-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-109-p1,ext-109-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2006", label: "Four-fold worship negation establishing absolute theological disavowal", def: "In 109:1-4: Say O disbelievers; I do not worship what you worship; nor are you worshippers of what I worship; nor am I a worshipper of what you have worshipped.", key: "109:1", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"La a'budu quadruple negation."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Clear boundaries without hostility."}] },
  { id: "cand-2007", label: "Religious separation declared: for you your religion, for me mine", def: "In 109:5-6: Nor will you be worshippers of what I worship; for you your religion and for me my religion.", key: "109:6", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Lakum dinukum wa-liya din."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Non-coercion principle embodied."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `109-al-kafirun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-133.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-133.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");