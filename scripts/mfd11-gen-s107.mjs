// MFD-11 Wave 13: Surah 107 (Al-Ma'un) genuine re-extraction.
// Covers 107:1-7 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "107-0001-0007.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 107:${n} not found`);
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

console.log("Generating Surah 107 (Al-Ma'un) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T01:55:00.000Z";

const PASSAGES = [
  { id: "ext-107-p1", from: 1, to: 3,
    label: "seen one denies Recompense; repels orphan; not encourage feed poor",
    mainLabel: "The one who denies the Recompense identified as the one who repels the orphan and does not encourage feeding the poor" },
  { id: "ext-107-p2", from: 4, to: 7,
    label: "woe worshippers; heedless prayer; make show; withhold small kindness",
    mainLabel: "Woe pronounced on those worshippers who are heedless of their prayer, make a show of it and withhold even small acts of kindness" }
];

const SUB_LABELS = {
  "ext-107-p1": [
    "Have you seen the one who denies the Recompense",
    "He is the one who repels the orphan",
    "And does not encourage feeding the poor"
  ],
  "ext-107-p2": [
    "Woe pronounced on those who pray",
    "Yet are heedless of their prayer",
    "Making a show of it before people",
    "Withholding even small acts of kindness"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`107:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`107:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 107, surahName: "Al-Ma'un",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the failure-to-encourage-feeding diagnosis (3) before the woe-to-worshippers block opens (4); P2 runs through the four-verse indictment of performative prayer and withheld kindness (4-7).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (107:1-3) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Denial of the Recompense manifested socially through orphan-repulsion and neglect of the poor", keys: ["107:1","107:2","107:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Orphan repelled and mutual encouragement to feed the poor absent as social failures", keys: ["107:2","107:3"], evidenceClass: "EXPLICIT_TEXT" });

  const din = findWord(1, ["\u062f","\u064a","\u0646"]);
  if (din) e.terminology.push({ term: din, transliteration: "al-din", gloss: "the Recompense/Judgement (editorial gloss)", keys: ["107:1"] });
  const yatim = findWord(2, ["\u064a","\u062a","\u064a","\u0645"]);
  if (yatim) e.terminology.push({ term: yatim, transliteration: "al-yatim", gloss: "the orphan (editorial gloss)", keys: ["107:2"] });
  const miskin = findWord(3, ["\u0645","\u0633","\u0643","\u064a","\u0646"]);
  if (miskin) e.terminology.push({ term: miskin, transliteration: "al-miskin", gloss: "the poor/needy (editorial gloss)", keys: ["107:3"] });
}

// === POPULATE P2 (107:4-7) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Prayer performed heedlessly and for show rather than sincere devotion", keys: ["107:4","107:5","107:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Small kindnesses withheld as the final marker of spiritual bankruptcy", keys: ["107:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["107:7"], excerpt: fv(7), description: "Withholding small acts of kindness condemned." });

  const musallun = findWord(4, ["\u0645","\u0635","\u0644","\u0648","\u0646"]);
  if (musallun) e.terminology.push({ term: musallun, transliteration: "al-musallun", gloss: "those who pray (editorial gloss)", keys: ["107:4"] });
  const sahun = findWord(5, ["\u0633","\u0627","\u0647","\u0648","\u0646"]);
  if (sahun) e.terminology.push({ term: sahun, transliteration: "sahun", gloss: "heedless/negligent (editorial gloss)", keys: ["107:5"] });
  const riya = findWord(6, ["\u0631","\u0626","\u0627","\u0621"]);
  // Using 'show' reference
  const yuraun = findWord(6, ["\u064a","\u0631","\u0627","\u0624","\u0646"]);
  if (yuraun) e.terminology.push({ term: yuraun, transliteration: "yura'un", gloss: "make a show/riya' (editorial gloss)", keys: ["107:6"] });
  const maun = findWord(7, ["\u0645","\u0627","\u0639","\u0648","\u0646"]);
  if (maun) e.terminology.push({ term: maun, transliteration: "al-ma'un", gloss: "small kindnesses/household goods (editorial gloss)", keys: ["107:7"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `107-al-maun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 107-al-maun-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-107-p1,ext-107-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2002", label: "Recompense-denier identified by orphan-repulsion and poor-neglect", def: "In 107:1-3: Have you seen the one who denies the Recompense; that is the one who repels the orphan and does not encourage feeding the poor.", key: "107:1", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Takdhib bil-din defined socially."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Yatim daff and it'am miskin abandoned."}] },
  { id: "cand-2003", label: "Heedless show-prayer and withheld kindness earning woe", def: "In 107:4-7: So woe to those who pray yet are heedless of their prayer, making a show of it and withholding small acts of kindness.", key: "107:4", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Sahun and riya' corrupting salah."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ma'un withheld as character failure."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `107-al-maun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-131.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-131.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");