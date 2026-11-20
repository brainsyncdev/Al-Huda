// MFD-11 Wave 13: Surah 110 (An-Nasr) genuine re-extraction.
// Covers 110:1-3 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "110-0001-0003.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 110:${n} not found`);
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

console.log("Generating Surah 110 (An-Nasr) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T02:25:00.000Z";

const PASSAGES = [
  { id: "ext-110-p1", from: 1, to: 2,
    label: "When comes help Allah victory; see people entering religion Allah multitudes",
    mainLabel: "When the help of Allah and victory arrive and people are seen entering the religion of Allah in multitudes" },
  { id: "ext-110-p2", from: 3, to: 3,
    label: "exalt praise Lord seek forgiveness Indeed ever Accepting repentance",
    mainLabel: "The Prophet commanded to exalt his Lord with praise and seek His forgiveness, for He is ever Accepting of repentance" }
];

const SUB_LABELS = {
  "ext-110-p1": [
    "The help of Allah and victory arriving",
    "People seen entering the religion of Allah in multitudes"
  ],
  "ext-110-p2": [
    "Exalt your Lord with praise and seek His forgiveness, for He is ever Accepting of repentance"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`110:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`110:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 110, surahName: "An-Nasr",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the mass-conversion observation (2) before the tasbih-istighfar command opens (3); P2 is the single-verse closing instruction linking divine victory to praise, forgiveness-seeking and the affirmation that Allah accepts repentance.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (110:1-2) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Mass entry into Allah's religion as the sign of divine help and victory", keys: ["110:1","110:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine nasr and fath paired with communal conversion as their visible fruit", keys: ["110:1","110:2"], evidenceClass: "EXPLICIT_TEXT" });

  const nasr = findWord(1, ["\u0646","\u0635","\u0631"]);
  if (nasr) e.terminology.push({ term: nasr, transliteration: "nasr Allah", gloss: "help/victory of Allah (editorial gloss)", keys: ["110:1"] });
  const fath = findWord(1, ["\u0641","\u062a","\u062d"]);
  if (fath) e.terminology.push({ term: fath, transliteration: "al-fath", gloss: "the victory/opening (editorial gloss)", keys: ["110:1"] });
  const afwaj = findWord(2, ["\u0623","\u0641","\u0648","\u0627","\u062c"]);
  if (afwaj) e.terminology.push({ term: afwaj, transliteration: "afwajan", gloss: "in multitudes/groups (editorial gloss)", keys: ["110:2"] });
}

// === POPULATE P2 (110:3) ===
{
  const e = extractions[1];
  const tawwab = findWord(3, ["\u062a","\u0648","\u0627","\u0628"]);
  if (tawwab) e.divineNamesAndAttributes.push({ term: tawwab, transliteration: "al-Tawwab", gloss: "Accepting of repentance (editorial gloss)", keys: ["110:3"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["110:3"], excerpt: fv(3), description: "Exalt your Lord with praise and seek His forgiveness." });

  e.humanConditionsAndSpiritualStates.push({ label: "Victory met not with triumphalism but with praise and forgiveness-seeking", keys: ["110:3"], evidenceClass: "EXPLICIT_TEXT" });

  const sabbihHamd = findWord(3, ["\u0633","\u0628","\u062d","\u062d","\u0645","\u062f"]);
  // Using 'exalt praise' reference
  const tasbih = findWord(3, ["\u0633","\u0628","\u062d"]);
  if (tasbih) e.terminology.push({ term: tasbih, transliteration: "fasabbih bi-hamdi rabbika", gloss: "exalt with praise (editorial gloss)", keys: ["110:3"] });
  const istighfar = findWord(3, ["\u0627","\u0633","\u062a","\u063a","\u0641","\u0631"]);
  if (istighfar) e.terminology.push({ term: istighfar, transliteration: "wa-staghfirhu", gloss: "seek His forgiveness (editorial gloss)", keys: ["110:3"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `110-an-nasr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 110-an-nasr-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-110-p1,ext-110-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2008", label: "Divine help and victory producing mass conversion to Allah's religion", def: "In 110:1-2: When the help of Allah and victory come and you see the people entering into the religion of Allah in multitudes.", key: "110:1", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Nasr and fath as divine gifts."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Afwaj conversion as collective iman."}] },
  { id: "cand-2009", label: "Victory answered with praise, forgiveness-seeking and Tawwab affirmation", def: "In 110:3: Then exalt [Him] with praise of your Lord and ask forgiveness of Him. Indeed, He is ever Accepting of repentance.", key: "110:3", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Istighfar at the moment of triumph."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Tawwab as closing divine name."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `110-an-nasr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-134.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-134.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");