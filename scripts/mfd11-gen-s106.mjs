// MFD-11 Wave 13: Surah 106 (Quraysh) genuine re-extraction.
// Covers 106:1-4 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "106-0001-0004.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 106:${n} not found`);
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

console.log("Generating Surah 106 (Quraysh) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T01:45:00.000Z";

const PASSAGES = [
  { id: "ext-106-p1", from: 1, to: 2,
    label: "Quraysh accustomed; accustomed winter summer journey",
    mainLabel: "The familiarisation of Quraysh named — their accustomed winter and summer journeys" },
  { id: "ext-106-p2", from: 3, to: 4,
    label: "let them worship Lord House; fed them hunger secured them fear",
    mainLabel: "They are commanded to worship the Lord of this House who fed them against hunger and secured them against fear" }
];

const SUB_LABELS = {
  "ext-106-p1": [
    "The familiarisation of Quraysh named",
    "Their accustomed winter and summer journeys specified"
  ],
  "ext-106-p2": [
    "Let them worship the Lord of this House",
    "Who fed them against hunger and secured them against fear"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`106:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`106:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 106, surahName: "Quraysh",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the seasonal-journey specification (2) before the worship command opens (3); P2 covers the two-verse closing pair linking provision and security to the obligation of worshipping the House's Lord.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (106:1-2) ===
{
  const e = extractions[0];

  e.socialEconomicCivilisational.push({ label: "Seasonal trade journeys as the economic foundation of Quraysh life", keys: ["106:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Familiarisation named as the divine favour enabling secure commerce", keys: ["106:1","106:2"], evidenceClass: "EXPLICIT_TEXT" });

  const quraysh = findWord(1, ["\u0642","\u0631","\u064a","\u0634"]);
  if (quraysh) e.terminology.push({ term: quraysh, transliteration: "Quraysh", gloss: "the tribe of Quraysh (editorial gloss)", keys: ["106:1"] });
  const ilaf = findWord(1, ["\u0625","\u064a","\u0644","\u0627","\u0641"]);
  // Using 'familiarisation' reference
  const alafa = findWord(1, ["\u0623","\u0644","\u0641"]);
  if (alafa) e.terminology.push({ term: alafa, transliteration: "ilaf", gloss: "familiarisation/customary practice (editorial gloss)", keys: ["106:1"] });
  const rihlatShitaSaif = findWord(2, ["\u0631","\u062d","\u0644","\u0629","\u0634","\u062a","\u0627","\u0621","\u0635","\u064a","\u0641"]);
  // Using 'winter summer journey' reference
  const shita = findWord(2, ["\u0634","\u062a","\u0627","\u0621"]);
  if (shita) e.terminology.push({ term: shita, transliteration: "rihlat al-shita' wa'l-sayf", gloss: "winter and summer journeys (editorial gloss)", keys: ["106:2"] });
}

// === POPULATE P2 (106:3-4) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["106:3"], excerpt: fv(3), description: "Let them worship the Lord of this House." });

  e.humanConditionsAndSpiritualStates.push({ label: "Provision against hunger and security against fear as the basis for worship obligation", keys: ["106:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Lord of the House identified as the source of both sustenance and safety", keys: ["106:3","106:4"], evidenceClass: "EXPLICIT_TEXT" });

  const rabbHadhaBayt = findWord(3, ["\u0631","\u0628","\u0647","\u0630","\u0627","\u0628","\u064a","\u062a"]);
  // Using 'Lord of this House' reference
  const bayt = findWord(3, ["\u0628","\u064a","\u062a"]);
  if (bayt) e.terminology.push({ term: bayt, transliteration: "rabb hadha al-bayt", gloss: "Lord of this House (editorial gloss)", keys: ["106:3"] });
  const amanaKhawf = findWord(4, ["\u0623","\u0645","\u0646","\u062e","\u0648","\u0641"]);
  // Using 'secured fear' reference
  const khawf = findWord(4, ["\u062e","\u0648","\u0641"]);
  if (khawf) e.terminology.push({ term: khawf, transliteration: "khawf", gloss: "fear (editorial gloss)", keys: ["106:4"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `106-quraysh-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 106-quraysh-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-106-p1,ext-106-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2000", label: "Quraysh familiarisation through seasonal trade journeys", def: "In 106:1-2: For the familiarisation of Quraysh, their accustomed winter and summer journeys.", key: "106:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship":"same-concept",note:"Ilaf as divine favour enabling commerce."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Security and provision as ni'mah."}] },
  { id: "cand-2001", label: "Worship of the House's Lord grounded in provision and security", def: "In 106:3-4: So let them worship the Lord of this House who fed them against hunger and secured them against fear.", key: "106:3", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Rabb hadha al-bayt as object of ibadah."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"It'am min ju' and aman min khawf as grounds for worship."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `106-quraysh-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-130.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-130.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");