// MFD-11 Wave 13: Surah 98 (Al-Bayyinah) genuine re-extraction.
// Covers 98:1-8 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "098-0001-0008.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 98:${n} not found`);
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

console.log("Generating Surah 98 (Al-Bayyinah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T00:25:00.000Z";

const PASSAGES = [
  { id: "ext-098-p1", from: 1, to: 4,
    label: "disbelieved People Scripture polytheists not parted misbelief until clear evidence came; Messenger Allah reciting purified scriptures; within correct writings; nor given Scripture divided until after clear evidence came",
    mainLabel: "Those who disbelieved among the People of the Scripture and the polytheists were not to be parted from misbelief until clear evidence came to them — a Messenger from Allah reciting purified scriptures containing correct writings; nor did those given the Scripture become divided until after that clear evidence had come" },
  { id: "ext-098-p2", from: 5, to: 5,
    label: "not commanded except worship Allah sincere religion inclining truth establish prayer give zakah correct religion",
    mainLabel: "They were commanded only to worship Allah sincerely in religion, inclining to truth, establishing prayer and giving zakah — that being the correct religion" },
  { id: "ext-098-p3", from: 6, to: 8,
    label: "disbelieved People Scripture polytheists fire Hell abiding eternally worst creatures; believed righteous deeds best creatures; reward Allah gardens perpetual residence rivers flow abide forever Allah pleased them they Him whoever feared Lord",
    mainLabel: "Those who disbelieved among the People of the Scripture and the polytheists will be in Hell's fire abiding eternally as the worst of creatures, while those who believed and did righteous deeds are the best of creatures whose reward with Allah is gardens of perpetual residence beneath which rivers flow where they abide forever, Allah pleased with them and they with Him — that is for whoever feared his Lord" }
];

const SUB_LABELS = {
  "ext-098-p1": [
    "Disbelievers among the People of the Scripture and polytheists not parted from misbelief until clear evidence came",
    "A Messenger from Allah reciting purified scriptures identified as that evidence",
    "Within those scriptures are correct writings",
    "Those given the Scripture did not become divided until after the clear evidence came"
  ],
  "ext-098-p2": [
    "Commanded only to worship Allah sincerely, inclining to truth, establishing prayer and giving zakah — the correct religion"
  ],
  "ext-098-p3": [
    "Disbelievers among the People of the Scripture and polytheists in Hell's fire abiding eternally as the worst of creatures",
    "Believers doing righteous deeds named the best of creatures",
    "Their reward: gardens of perpetual residence with rivers flowing beneath, abiding forever, mutual pleasure between Allah and them — for whoever feared his Lord"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`98:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`98:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 98, surahName: "Al-Bayyinah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the division-after-evidence statement (4) before the pure-worship command opens (5); P2 is the single-verse definition of correct religion (5); P3 runs through the worst-versus-best binary and the closing mutual-pleasure reward (6-8).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (98:1-4) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "People of the Scripture and polytheists remaining in misbelief until clear evidence arrived", keys: ["98:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Division among Scripture-recipients occurring only after the clear evidence came", keys: ["98:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Messenger reciting purified scriptures with correct writings constituting the bayyinah", keys: ["98:2","98:3"], evidenceClass: "EXPLICIT_TEXT" });

  const bayyinah = findWord(1, ["\u0628","\u064a","\u0646"]);
  if (bayyinah) e.terminology.push({ term: bayyinah, transliteration: "al-bayyinah", gloss: "clear evidence (editorial gloss)", keys: ["98:1"] });
  const suhufMutahharah = findWord(2, ["\u0635","\u062d","\u0641","\u0645","\u0637","\u0647","\u0631"]);
  // Using 'purified scriptures' reference
  const mutahharah = findWord(2, ["\u0645","\u0637","\u0647","\u0631"]);
  if (mutahharah) e.terminology.push({ term: mutahharah, transliteration: "suhuf mutahharah", gloss: "purified scriptures (editorial gloss)", keys: ["98:2"] });
  const qayyimah = findWord(3, ["\u0642","\u064a","\u0645"]);
  if (qayyimah) e.terminology.push({ term: qayyimah, transliteration: "kutub qayyimah", gloss: "correct/valuable writings (editorial gloss)", keys: ["98:3"] });
}

// === POPULATE P2 (98:5) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["98:5"], excerpt: fv(5), description: "Worship Allah sincerely, inclining to truth, establish prayer and give zakah." });

  e.humanConditionsAndSpiritualStates.push({ label: "Pure religion defined as sincere worship, truth-inclination, prayer and zakah", keys: ["98:5"], evidenceClass: "EXPLICIT_TEXT" });

  const dinQayyim = findWord(5, ["\u062f","\u064a","\u0646","\u0642","\u064a","\u0645"]);
  // Using 'correct religion' reference
  const qayyim = findWord(5, ["\u0642","\u064a","\u0645"]);
  if (qayyim) e.terminology.push({ term: qayyim, transliteration: "din al-qayyim", gloss: "the correct religion (editorial gloss)", keys: ["98:5"] });
}

// === POPULATE P3 (98:6-8) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Worst of creatures: disbelievers among People of Scripture and polytheists in eternal Hellfire", keys: ["98:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Best of creatures: believers doing righteous deeds rewarded with perpetual gardens", keys: ["98:7","98:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Mutual pleasure between Allah and the righteous as the ultimate reward dimension", keys: ["98:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Fear of the Lord identified as the qualifying condition for the mutual-pleasure reward", keys: ["98:8"], evidenceClass: "EXPLICIT_TEXT" });

  const sharrBarriyah = findWord(6, ["\u0634","\u0631","\u0628","\u0631"]);
  // Using 'worst of creatures' reference
  const sharr = findWord(6, ["\u0634","\u0631"]);
  if (sharr) e.terminology.push({ term: sharr, transliteration: "sharr al-bariyyah", gloss: "worst of creatures (editorial gloss)", keys: ["98:6"] });
  const khayrBarriyah = findWord(7, ["\u062e","\u064a","\u0631","\u0628","\u0631"]);
  // Using 'best of creatures' reference
  const khayr = findWord(7, ["\u062e","\u064a","\u0631"]);
  if (khayr) e.terminology.push({ term: khayr, transliteration: "khayr al-bariyyah", gloss: "best of creatures (editorial gloss)", keys: ["98:7"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `098-al-bayyinah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 098-al-bayyinah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-098-p1,ext-098-p2,ext-098-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1980", label: "Clear evidence as Messenger reciting purified scriptures ending division", def: "In 98:1-4: Those who disbelieved among the People of the Scripture and the polytheists were not to be parted from misbelief until there came to them clear evidence; a Messenger from Allah reciting purified scriptures within which are correct writings; nor did those who were given the Scripture become divided until after there had come to them clear evidence.", key: "98:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Bayyinah as rasul plus suhuf mutahharah."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Messenger as the decisive proof."}] },
  { id: "cand-1981", label: "Correct religion defined as sincere worship, prayer and zakah", def: "In 98:5: And they were not commanded except to worship Allah being sincere to Him in religion inclining to truth and to establish prayer and to give zakah and that is the correct religion.", key: "98:5", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Iqamat salah paired with ita' zakah."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Mukhlisin lahu al-din hanafa'."}] },

  { id: "cand-1982", label: "Worst versus best of creatures with mutual pleasure as reward apex", def: "In 98:6-8: Indeed they who disbelieved among the People of the Scripture and the polytheists will be in the fire of Hell abiding eternally therein those are the worst of creatures; indeed they who have believed and done righteous deeds those are the best of creatures; their reward with Allah will be gardens of perpetual residence beneath which rivers flow wherein they will abide forever Allah being pleased with them and they with Him that is for whoever has feared his Lord.", key: "98:6", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Sharr vs khayr bariyyah binary."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Radiya Allahu anhum wa-radu anhu."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `098-al-bayyinah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-122.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-122.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");