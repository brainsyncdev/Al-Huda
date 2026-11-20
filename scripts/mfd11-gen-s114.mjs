// MFD-11 Wave 13: Surah 114 (An-Nas) genuine re-extraction.
// Covers 114:1-6 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "114-0001-0006.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 114:${n} not found`);
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

console.log("Generating Surah 114 (An-Nas) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T03:05:00.000Z";

const PASSAGES = [
  { id: "ext-114-p1", from: 1, to: 3,
    label: "Say seek refuge Lord mankind; Sovereign mankind; God mankind",
    mainLabel: "Seeking refuge with the Lord of mankind, the Sovereign of mankind, the God of mankind" },
  { id: "ext-114-p2", from: 4, to: 6,
    label: "evil retreating whisperer; whispers breasts mankind; jinn mankind",
    mainLabel: "From the evil of the retreating whisperer who whispers into the breasts of mankind — from among the jinn and mankind" }
];

const SUB_LABELS = {
  "ext-114-p1": [
    "Command to seek refuge with the Lord of mankind",
    "The Sovereign of mankind named",
    "The God of mankind named"
  ],
  "ext-114-p2": [
    "From the evil of the retreating whisperer",
    "Who whispers into the breasts of mankind",
    "From among the jinn and mankind"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`114:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`114:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 114, surahName: "An-Nas",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the triple divine title (Lord-Sovereign-God of mankind) before the whisperer-evil specification opens (4-6); P2 runs through the three-verse closing description of the khannas whisperer targeting human hearts from both jinn and human sources.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (114:1-3) ===
{
  const e = extractions[0];
  const rabbNas = findWord(1, ["\u0631","\u0628","\u0646","\u0627","\u0633"]);
  // Using 'Lord of mankind' reference
  const nas = findWord(1, ["\u0646","\u0627","\u0633"]);
  if (nas) e.divineNamesAndAttributes.push({ term: nas, transliteration: "Rabb al-Nas", gloss: "Lord of Mankind (editorial gloss)", keys: ["114:1"] });
  const malikNas = findWord(2, ["\u0645","\u0644","\u0643","\u0646","\u0627","\u0633"]);
  // Using 'Sovereign of mankind' reference
  const malik = findWord(2, ["\u0645","\u0644","\u0643"]);
  if (malik) e.divineNamesAndAttributes.push({ term: malik, transliteration: "Malik al-Nas", gloss: "Sovereign/King of Mankind (editorial gloss)", keys: ["114:2"] });
  const ilahNas = findWord(3, ["\u0625","\u0644","\u0647","\u0646","\u0627","\u0633"]);
  // Using 'God of mankind' reference
  const ilah = findWord(3, ["\u0625","\u0644","\u0647"]);
  if (ilah) e.divineNamesAndAttributes.push({ term: ilah, transliteration: "Ilah al-Nas", gloss: "God of Mankind (editorial gloss)", keys: ["114:3"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["114:1"], excerpt: fv(1), description: "Say: I seek refuge with the Lord of mankind." });

  e.relationships.push({ label: "Triple divine title — Lord, Sovereign, God — all qualified by 'of mankind'", keys: ["114:1","114:2","114:3"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P2 (114:4-6) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Retreating whisperer targeting the innermost hearts of people", keys: ["114:4","114:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Whispering originating from both jinn and human sources", keys: ["114:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Evil specified as internal psychological infiltration rather than external force", keys: ["114:4","114:5"], evidenceClass: "EXPLICIT_TEXT" });

  const khannas = findWord(4, ["\u062e","\u0646","\u0627","\u0633"]);
  if (khannas) e.terminology.push({ term: khannas, transliteration: "al-khannas", gloss: "the retreating/sneaking whisperer (editorial gloss)", keys: ["114:4"] });
  const waswas = findWord(5, ["\u0648","\u0633","\u0648","\u0633"]);
  if (waswas) e.terminology.push({ term: waswas, transliteration: "yuwaswisu", gloss: "whispers (editorial gloss)", keys: ["114:5"] });
  const sudur = findWord(5, ["\u0635","\u062f","\u0648","\u0631"]);
  // Using 'breasts' reference
  const sadr = findWord(5, ["\u0635","\u062f","\u0631"]);
  if (sadr) e.terminology.push({ term: sadr, transliteration: "sudur al-nas", gloss: "breasts/hearts of mankind (editorial gloss)", keys: ["114:5"] });
  const jinnah = findWord(6, ["\u062c","\u0646","\u0629"]);
  // Using 'jinn' reference
  const jinn = findWord(6, ["\u062c","\u0646"]);
  if (jinn) e.terminology.push({ term: jinn, transliteration: "min al-jinnah wa'l-nas", gloss: "from jinn and mankind (editorial gloss)", keys: ["114:6"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `114-an-nas-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 114-an-nas-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-114-p1,ext-114-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2016", label: "Triple divine title: Lord, Sovereign and God of mankind", def: "In 114:1-3: Say I seek refuge in the Lord of mankind, the Sovereign of mankind, the God of mankind.", key: "114:1", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Isti'adhah with triple rabb-malik-ilah."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Three names qualified by al-nas."}] },
  { id: "cand-2017", label: "Retreating whisperer from jinn and humans targeting the heart", def: "In 114:4-6: From the evil of the retreating whisperer who whispers into the breasts of mankind from among the jinn and mankind.", key: "114:4", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Khannas waswas defined."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Internal vigilance against waswasah."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `114-an-nas-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-138.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-138.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");