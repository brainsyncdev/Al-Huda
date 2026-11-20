// MFD-11 Wave 13: Surah 95 (At-Tin) genuine re-extraction.
// Covers 95:1-8 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "095-0001-0008.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 95:${n} not found`);
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

console.log("Generating Surah 95 (At-Tin) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T23:55:00.000Z";

const PASSAGES = [
  { id: "ext-095-p1", from: 1, to: 6,
    label: "By fig olive; Mount Sinai; secure city Makkah; created man best stature; return him lowest low; Except believe righteous deeds reward uninterrupted",
    mainLabel: "Oaths by the fig, the olive, Mount Sinai and this secure city establishing that man was created in the best of stature then returned to the lowest of the low — except those who believe and do righteous deeds, for whom there is an uninterrupted reward" },
  { id: "ext-095-p2", from: 7, to: 8,
    label: "what yet causes deny Recompense; Is not Allah most just judges",
    mainLabel: "The denial of the Recompense questioned rhetorically, closed by affirming Allah as the most just of judges" }
];

const SUB_LABELS = {
  "ext-095-p1": [
    "Oath sworn by the fig and the olive",
    "And by Mount Sinai",
    "And by this secure city, Makkah",
    "Man certainly created in the best of stature",
    "Then returned to the lowest of the low",
    "Except those who believe and do righteous deeds, receiving an uninterrupted reward"
  ],
  "ext-095-p2": [
    "What yet causes you to deny the Recompense questioned",
    "Allah affirmed as the most just of judges"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`95:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`95:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 95, surahName: "At-Tin",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the believing exception and its uninterrupted reward (6) before the rhetorical challenge opens (7); P2 covers the two-verse closing pair questioning denial and affirming divine justice (7-8).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (95:1-6) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Man created in the best stature yet capable of descent to the lowest of the low", keys: ["95:4","95:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Belief joined to righteous deeds securing an uninterrupted reward as the exception", keys: ["95:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Four-fold oath by fig, olive, Sinai and secure city grounding the creation-descent narrative", keys: ["95:1","95:2","95:3"], evidenceClass: "EXPLICIT_TEXT" });

  const tin = findWord(1, ["\u062a","\u064a","\u0646"]);
  if (tin) e.terminology.push({ term: tin, transliteration: "al-tin", gloss: "the fig (editorial gloss)", keys: ["95:1"] });
  const zaytun = findWord(1, ["\u0632","\u064a","\u062a","\u0648","\u0646"]);
  if (zaytun) e.terminology.push({ term: zaytun, transliteration: "al-zaytun", gloss: "the olive (editorial gloss)", keys: ["95:1"] });
  const turSinin = findWord(2, ["\u0637","\u0648","\u0631","\u0633","\u064a","\u0646"]);
  if (turSinin) e.terminology.push({ term: turSinin, transliteration: "Tur Sinin", gloss: "Mount Sinai (editorial gloss)", keys: ["95:2"] });
  const baladAmin = findWord(3, ["\u0628","\u0644","\u062f","\u0623","\u0645","\u064a","\u0646"]);
  if (baladAmin) e.terminology.push({ term: baladAmin, transliteration: "hadha al-balad al-amin", gloss: "this secure city (editorial gloss)", keys: ["95:3"] });
  const ahsanTaqwim = findWord(4, ["\u0623","\u062d","\u0633","\u0646","\u062a","\u0642","\u0648","\u064a","\u0645"]);
  if (ahsanTaqwim) e.terminology.push({ term: ahsanTaqwim, transliteration: "ahsan taqwim", gloss: "best of stature (editorial gloss)", keys: ["95:4"] });
  const asfalSafilin = findWord(5, ["\u0623","\u0633","\u0641","\u0644","\u0633","\u0627","\u0641","\u0644","\u064a","\u0646"]);
  if (asfalSafilin) e.terminology.push({ term: asfalSafilin, transliteration: "asfal safilin", gloss: "lowest of the low (editorial gloss)", keys: ["95:5"] });
}

// === POPULATE P2 (95:7-8) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Denial of the Recompense challenged rhetorically after the creation-descent framework", keys: ["95:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Allah named the most just of judges as the closing theological anchor", keys: ["95:8"], evidenceClass: "EXPLICIT_TEXT" });

  const takdhib = findWord(7, ["\u062a","\u0643","\u0630","\u064a","\u0628"]);
  if (takdhib) e.terminology.push({ term: takdhib, transliteration: "tukadhdhib", gloss: "deny the Recompense (editorial gloss)", keys: ["95:7"] });
  const ahkamHakimin = findWord(8, ["\u0623","\u062d","\u0643","\u0645","\u062d","\u0627","\u0643","\u0645","\u064a","\u0646"]);
  if (ahkamHakimin) e.terminology.push({ term: ahkamHakimin, transliteration: "ahkam al-hakimin", gloss: "most just of judges (editorial gloss)", keys: ["95:8"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `095-at-tin-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 095-at-tin-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-095-p1,ext-095-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1970", label: "Fig-olive-Sinai-Makkah oaths framing creation in best stature and descent", def: "In 95:1-5: By the fig and the olive and Mount Sinai and this secure city; We have certainly created man in the best of stature; then We return him to the lowest of the low.", key: "95:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Four sacred loci sworn by."},{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Ahsan taqwim to asfal safilin arc."}] },
  { id: "cand-1971", label: "Belief and righteous deeds as the exception securing uninterrupted reward", def: "In 95:6: Except for those who believe and do righteous deeds, for they will have a reward uninterrupted.", key: "95:6", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ajr ghayr mamnun exception."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman plus amal salih as rescue."}] },

  { id: "cand-1972", label: "Recompense denial challenged with Allah as most just of judges", def: "In 95:7-8: So what yet causes you to deny the Recompense; is not Allah the most just of judges.", key: "95:7", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Takdhib bi'l-din questioned."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Ahkam al-hakimin as closing proof."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 3).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `095-at-tin-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-119.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-119.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");