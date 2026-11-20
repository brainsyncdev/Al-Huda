// MFD-11 Wave 13: Surah 113 (Al-Falaq) genuine re-extraction.
// Covers 113:1-5 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "113-0001-0005.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 113:${n} not found`);
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

console.log("Generating Surah 113 (Al-Falaq) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T02:55:00.000Z";

const PASSAGES = [
  { id: "ext-113-p1", from: 1, to: 3,
    label: "Say seek refuge Lord daybreak; evil created; evil darkness settles",
    mainLabel: "Seeking refuge with the Lord of daybreak from the evil of what He created and from the evil of darkness when it settles" },
  { id: "ext-113-p2", from: 4, to: 5,
    label: "evil blowers knots; evil envier envies",
    mainLabel: "And from the evil of those who blow on knots and from the evil of an envier when he envies" }
];

const SUB_LABELS = {
  "ext-113-p1": [
    "Command to seek refuge with the Lord of daybreak",
    "From the evil of what He created",
    "And from the evil of darkness when it settles"
  ],
  "ext-113-p2": [
    "And from the evil of those who blow on knots",
    "And from the evil of an envier when he envies"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`113:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`113:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 113, surahName: "Al-Falaq",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the darkness-settling evil (3) before the knot-blowers and envier evils open (4-5); P2 covers the two-verse closing pair specifying occult and social harms as distinct refuge-seeking targets.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (113:1-3) ===
{
  const e = extractions[0];
  const rabbFalaq = findWord(1, ["\u0631","\u0628","\u0641","\u0644","\u0642"]);
  // Using 'Lord of daybreak' reference
  const falaq = findWord(1, ["\u0641","\u0644","\u0642"]);
  if (falaq) e.divineNamesAndAttributes.push({ term: falaq, transliteration: "Rabb al-Falaq", gloss: "Lord of Daybreak (editorial gloss)", keys: ["113:1"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["113:1"], excerpt: fv(1), description: "Say: I seek refuge with the Lord of daybreak." });

  e.humanConditionsAndSpiritualStates.push({ label: "Created things and settling darkness named as sources of evil requiring divine refuge", keys: ["113:2","113:3"], evidenceClass: "EXPLICIT_TEXT" });

  const ghasiq = findWord(3, ["\u063a","\u0627","\u0633","\u0642"]);
  if (ghasiq) e.terminology.push({ term: ghasiq, transliteration: "ghasiqin idha waqab", gloss: "darkness when it settles (editorial gloss)", keys: ["113:3"] });
}

// === POPULATE P2 (113:4-5) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Knot-blowing sorcery and envy identified as specific human-originated evils", keys: ["113:4","113:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Occult practice and social envy condemned as harms requiring spiritual protection", keys: ["113:4","113:5"], evidenceClass: "EXPLICIT_TEXT" });

  const naffathat = findWord(4, ["\u0646","\u0641","\u062b"]);
  if (naffathat) e.terminology.push({ term: naffathat, transliteration: "al-naffathat fi al-'uqad", gloss: "those who blow on knots (editorial gloss)", keys: ["113:4"] });
  const hasid = findWord(5, ["\u062d","\u0627","\u0633","\u062f"]);
  if (hasid) e.terminology.push({ term: hasid, transliteration: "hasidin idha hasad", gloss: "envier when he envies (editorial gloss)", keys: ["113:5"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `113-al-falaq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 113-al-falaq-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-113-p1,ext-113-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2014", label: "Refuge sought from created evil and settling darkness", def: "In 113:1-3: Say I seek refuge in the Lord of daybreak from the evil of that which He created and from the evil of darkness when it settles.", key: "113:1", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Isti'adhah formula."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Rabb al-falaq as protector."}] },
  { id: "cand-2015", label: "Protection from knot-blowing sorcery and envious harm", def: "In 113:4-5: And from the evil of the blowers in knots and from the evil of an envier when he envies.", key: "113:4", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Specific harms named for refuge."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Hasad as social-spiritual danger."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `113-al-falaq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-137.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-137.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");