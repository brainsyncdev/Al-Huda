// MFD-11 Wave 13: Surah 101 (Al-Qari'ah) genuine re-extraction.
// Covers 101:1-11 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "101-0001-0011.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 101:${n} not found`);
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

console.log("Generating Surah 101 (Al-Qari'ah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T00:55:00.000Z";

const PASSAGES = [
  { id: "ext-101-p1", from: 1, to: 5,
    label: "Striking Calamity; What Striking Calamity; what make know Striking Calamity; Day people like moths dispersed; mountains like wool fluffed up",
    mainLabel: "The Striking Calamity named and its gravity questioned twice; it is the Day when people will be like dispersed moths and mountains like fluffed-up wool" },
  { id: "ext-101-p2", from: 6, to: 9,
    label: "one whose scales heavy good deeds; pleasant life; one whose scales light; refuge abyss",
    mainLabel: "The one whose scales are heavy with good deeds will be in a pleasant life while the one whose scales are light will have an abyss as his refuge" },
  { id: "ext-101-p3", from: 10, to: 11,
    label: "what make you know what that is; Fire intensely hot",
    mainLabel: "The abyss's nature questioned rhetorically and answered as an intensely hot Fire" }
];

const SUB_LABELS = {
  "ext-101-p1": [
    "The Striking Calamity announced",
    "Its identity questioned rhetorically",
    "And what can make you know what the Striking Calamity is",
    "It is the Day when people will be like moths, dispersed",
    "And the mountains will be like wool, fluffed up"
  ],
  "ext-101-p2": [
    "The one whose scales are heavy with good deeds",
    "He will be in a pleasant life",
    "But the one whose scales are light",
    "His refuge will be an abyss"
  ],
  "ext-101-p3": [
    "And what can make you know what that abyss is",
    "It is a Fire, intensely hot"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`101:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`101:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 101, surahName: "Al-Qari'ah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the mountain-as-wool simile (5) before the scales-weight binary opens (6); P2 ends with the abyss-naming (9) before the rhetorical question about the abyss begins (10); P3 covers the two-verse closing identification of the abyss as intensely hot Fire (10-11).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (101:1-5) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "People scattered like moths and mountains reduced to fluffed wool on the Day", keys: ["101:4","101:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Triple naming-and-questioning establishing the Calamity's overwhelming gravity", keys: ["101:1","101:2","101:3"], evidenceClass: "EXPLICIT_TEXT" });

  const qariah = findWord(1, ["\u0642","\u0627","\u0631","\u0639"]);
  if (qariah) e.terminology.push({ term: qariah, transliteration: "al-qari'ah", gloss: "the Striking Calamity (editorial gloss)", keys: ["101:1"] });
  const farashat = findWord(4, ["\u0641","\u0631","\u0627","\u0634"]);
  // Using 'moths' reference
  const mabthuth = findWord(4, ["\u0645","\u0628","\u062b","\u0648","\u062b"]);
  // Using 'dispersed' reference
  const ibil = findWord(4, ["\u0641","\u0631","\u0627","\u0634"]);
  if (ibil) e.terminology.push({ term: ibil, transliteration: "farashat mabthuth", gloss: "moths dispersed (editorial gloss)", keys: ["101:4"] });
  const suf = findWord(5, ["\u0635","\u0648","\u0641"]);
  // Using 'wool' reference
  const manfush = findWord(5, ["\u0645","\u0646","\u0641","\u0648","\u0634"]);
  if (manfush) e.terminology.push({ term: manfush, transliteration: "'ihn manfush", gloss: "wool fluffed up (editorial gloss)", keys: ["101:5"] });
}

// === POPULATE P2 (101:6-9) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Heavy scales producing pleasant life versus light scales producing abyss-refuge", keys: ["101:6","101:7","101:8","101:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Scale-weight as the sole determinant of eschatological outcome", keys: ["101:6","101:8"], evidenceClass: "EXPLICIT_TEXT" });

  const mawazin = findWord(6, ["\u0645","\u0648","\u0627","\u0632","\u064a","\u0646"]);
  if (mawazin) e.terminology.push({ term: mawazin, transliteration: "mawazin", gloss: "scales (editorial gloss)", keys: ["101:6"] });
  const ishah = findWord(7, ["\u0639","\u064a","\u0634"]);
  // Using 'pleasant life' reference
  const radhiyah = findWord(7, ["\u0631","\u0627","\u0636","\u064a"]);
  // Using alternative check
  const hayahRadiya = findWord(7, ["\u0639","\u064a","\u0634"]);
  if (hayahRadiya) e.terminology.push({ term: hayahRadiya, transliteration: "'ishah radiyah", gloss: "pleasant life (editorial gloss)", keys: ["101:7"] });
  const hawiyah = findWord(9, ["\u0647","\u0627","\u0648","\u064a"]);
  if (hawiyah) e.terminology.push({ term: hawiyah, transliteration: "umm hawiyah", gloss: "abyss/mother of the pit (editorial gloss)", keys: ["101:9"] });
}

// === POPULATE P3 (101:10-11) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Abyss identified as an intensely hot Fire through rhetorical questioning", keys: ["101:10","101:11"], evidenceClass: "EXPLICIT_TEXT" });

  const narHamiyah = findWord(11, ["\u0646","\u0627","\u0631","\u062d","\u0627","\u0645"]);
  // Using 'intensely hot Fire' reference
  const hamiyah = findWord(11, ["\u062d","\u0627","\u0645"]);
  if (hamiyah) e.terminology.push({ term: hamiyah, transliteration: "nar hamiyah", gloss: "intensely hot Fire (editorial gloss)", keys: ["101:11"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `101-al-qariah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 101-al-qariah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-101-p1,ext-101-p2,ext-101-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1988", label: "Striking Calamity triple-named with moth-people and wool-mountains similes", def: "In 101:1-5: The Striking Calamity; what is the Striking Calamity; and what can make you know what is the Striking Calamity; it is the Day when people will be like moths dispersed and the mountains will be like wool fluffed up.", key: "101:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Qari'ah triple repetition."},{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Farashat mabthuth and ihn manfush imagery."}] },
  { id: "cand-1989", label: "Scale-weight determining pleasant life or abyss refuge", def: "In 101:6-9: Then as for one whose scales are heavy with good deeds he will be in a pleasant life; but as for one whose scales are light his refuge will be an abyss.", key: "101:6", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Thaqulat vs khaffat mawazin."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ishah radiyah vs umm hawiyah."}] },

  { id: "cand-1990", label: "Abyss revealed as intensely hot Fire through rhetorical disclosure", def: "In 101:10-11: And what can make you know what that is; it is a Fire intensely hot.", key: "101:10", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Nar hamiyah as hawiyah definition."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Intensity specified by hamiyah."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `101-al-qariah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-125.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-125.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");