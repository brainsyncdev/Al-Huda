// MFD-11 Wave 13: Surah 94 (Ash-Sharh) genuine re-extraction.
// Covers 94:1-8 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "094-0001-0008.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 94:${n} not found`);
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

console.log("Generating Surah 94 (Ash-Sharh) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T23:45:00.000Z";

const PASSAGES = [
  { id: "ext-094-p1", from: 1, to: 6,
    label: "Did We not expand breast; removed burden weighed back; raised high repute; Indeed with hardship ease; Indeed with hardship ease",
    mainLabel: "The Prophet's breast expanded, his burden removed from his back and his repute raised high; the doubled declaration that with hardship comes ease" },
  { id: "ext-094-p2", from: 7, to: 8,
    label: "when finished duties stand up worship; Lord direct longing",
    mainLabel: "When duties are completed, standing up for worship is commanded and directing one's longing toward the Lord alone" }
];

const SUB_LABELS = {
  "ext-094-p1": [
    "The Prophet's breast expanded by divine grace",
    "His burden removed from him",
    "Which had weighed heavily upon his back",
    "His repute raised high",
    "First declaration: with hardship comes ease",
    "Second declaration reinforcing: with hardship comes ease"
  ],
  "ext-094-p2": [
    "When duties are finished, standing up for worship commanded",
    "Longing directed exclusively toward the Lord"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`94:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`94:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 94, surahName: "Ash-Sharh",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the doubled hardship-ease declaration (5-6) before the post-duty worship command opens (7); P2 covers the two-verse closing instruction on worship completion and divine orientation (7-8).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (94:1-6) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Breast expansion, burden removal and repute elevation as divine gifts to the Prophet", keys: ["94:1","94:2","94:3","94:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hardship accompanied by ease declared twice for emphasis", keys: ["94:5","94:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Three past favours — chest expansion, burden removal, repute raising — preceding the hardship-ease principle", keys: ["94:1","94:2","94:3","94:4"], evidenceClass: "EXPLICIT_TEXT" });

  const sharh = findWord(1, ["\u0634","\u0631","\u062d"]);
  if (sharh) e.terminology.push({ term: sharh, transliteration: "sharh al-sadr", gloss: "expansion of the breast (editorial gloss)", keys: ["94:1"] });
  const wizr = findWord(2, ["\u0648","\u0632","\u0631"]);
  if (wizr) e.terminology.push({ term: wizr, transliteration: "wizr", gloss: "burden (editorial gloss)", keys: ["94:2"] });
  const usra = findWord(5, ["\u0639","\u0633","\u0631"]);
  if (usra) e.terminology.push({ term: usra, transliteration: "al-'usr", gloss: "hardship (editorial gloss)", keys: ["94:5"] });
  const yusra = findWord(5, ["\u064a","\u0633","\u0631"]);
  if (yusra) e.terminology.push({ term: yusra, transliteration: "al-yusr", gloss: "ease (editorial gloss)", keys: ["94:5"] });
}

// === POPULATE P2 (94:7-8) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["94:7"], excerpt: fv(7), description: "So when you have finished your duties, then stand up for worship." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["94:8"], excerpt: fv(8), description: "And to your Lord direct your longing." });

  e.humanConditionsAndSpiritualStates.push({ label: "Transition from worldly duties to devoted worship as a continuous cycle", keys: ["94:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Exclusive divine orientation as the culmination of all striving", keys: ["94:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Worship completion followed by longing redirection forming the closing spiritual instruction", keys: ["94:7","94:8"], evidenceClass: "EXPLICIT_TEXT" });

  const nasab = findWord(7, ["\u0646","\u0635","\u0628"]);
  if (nasab) e.terminology.push({ term: nasab, transliteration: "fa-idha faraghta fa-nsab", gloss: "stand up for worship after finishing duties (editorial gloss)", keys: ["94:7"] });
  const raghbah = findWord(8, ["\u0631","\u063a","\u0628"]);
  if (raghbah) e.terminology.push({ term: raghbah, transliteration: "fa-irghab", gloss: "direct longing (editorial gloss)", keys: ["94:8"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `094-ash-sharh-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 094-ash-sharh-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-094-p1,ext-094-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1967", label: "Breast expansion, burden removal and repute elevation as prophetic gifts", def: "In 94:1-4: Did We not expand for you O Muhammad your breast and We removed from you your burden which had weighed upon your back and raised high for you your repute.", key: "94:1", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Sharh sadr and waz' wizr."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Divine favour enumerated."}] },
  { id: "cand-1968", label: "Doubled hardship-ease declaration as universal comfort", def: "In 94:5-6: For indeed with hardship will be ease; indeed with hardship will be ease.", key: "94:5", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Inna ma'a al-'usri yusra repeated."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Certainty of relief affirmed."}] },

  { id: "cand-1969", label: "Post-duty worship and exclusive divine longing", def: "In 94:7-8: So when you have finished your duties then stand up for worship and to your Lord direct your longing.", key: "94:7", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Nasab after faragh."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Iraghb ila rabbik as dhikr."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `094-ash-sharh-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-118.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-118.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");