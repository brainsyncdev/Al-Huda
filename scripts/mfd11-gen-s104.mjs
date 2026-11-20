// MFD-11 Wave 13: Surah 104 (Al-Humazah) genuine re-extraction.
// Covers 104:1-9 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "104-0001-0009.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 104:${n} not found`);
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

console.log("Generating Surah 104 (Al-Humazah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T01:25:00.000Z";

const PASSAGES = [
  { id: "ext-104-p1", from: 1, to: 3,
    label: "Woe every scorner mocker; collects wealth continuously counts it; thinks wealth make immortal",
    mainLabel: "Woe pronounced on every scorner and mocker who collects wealth and continuously counts it, thinking his wealth will make him immortal" },
  { id: "ext-104-p2", from: 4, to: 7,
    label: "No surely thrown Crusher; what make know Crusher; fire Allah eternally fueled; mounts directed hearts",
    mainLabel: "He will surely be thrown into the Crusher — whose nature is questioned and answered as the fire of Allah, eternally fueled, mounting directed at the hearts" },
  { id: "ext-104-p3", from: 8, to: 9,
    label: "Indeed Hellfire closed down upon them; extended columns",
    mainLabel: "Hellfire closed down upon them in extended columns" }
];

const SUB_LABELS = {
  "ext-104-p1": [
    "Woe pronounced on every scorner and mocker",
    "Who collects wealth and continuously counts it",
    "Thinking that his wealth will make him immortal"
  ],
  "ext-104-p2": [
    "He will surely be thrown into the Crusher",
    "The identity of the Crusher questioned rhetorically",
    "It is the fire of Allah, eternally fueled",
    "Which mounts directed at the hearts"
  ],
  "ext-104-p3": [
    "Hellfire closed down upon them",
    "In extended columns"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`104:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`104:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 104, surahName: "Al-Humazah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the immortality-delusion diagnosis (3) before the Crusher-threat opens (4); P2 ends with the heart-directed fire description (7) before the closing sealed-columns image (8-9); P3 covers the two-verse final enclosure depiction.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (104:1-3) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Scorning and mocking paired with obsessive wealth-counting and immortality delusion", keys: ["104:1","104:2","104:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Wealth accumulation and enumeration condemned as moral failure", keys: ["104:2"], evidenceClass: "EXPLICIT_TEXT" });

  const humazah = findWord(1, ["\u0647","\u0645","\u0632"]);
  if (humazah) e.terminology.push({ term: humazah, transliteration: "al-humazah", gloss: "the scorner/slanderer (editorial gloss)", keys: ["104:1"] });
  const lumazah = findWord(1, ["\u0644","\u0645","\u0632"]);
  if (lumazah) e.terminology.push({ term: lumazah, transliteration: "al-lumazah", gloss: "the mocker/backbiter (editorial gloss)", keys: ["104:1"] });
  const akhlada = findWord(3, ["\u0623","\u062e","\u0644","\u062f"]);
  if (akhlada) e.terminology.push({ term: akhlada, transliteration: "yukhalliduhu", gloss: "make him immortal (editorial gloss)", keys: ["104:3"] });
}

// === POPULATE P2 (104:4-7) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Crusher identified as Allah's eternally fueled fire targeting the hearts", keys: ["104:4","104:5","104:6","104:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Fire specified as belonging to Allah and directed inwardly at the seat of intention", keys: ["104:6","104:7"], evidenceClass: "EXPLICIT_TEXT" });

  const hutamah = findWord(4, ["\u062d","\u0637","\u0645"]);
  if (hutamah) e.terminology.push({ term: hutamah, transliteration: "al-hutamah", gloss: "the Crusher (editorial gloss)", keys: ["104:4"] });
  const narAllah = findWord(6, ["\u0646","\u0627","\u0631","\u0627","\u0644","\u0644","\u0647"]);
  // Using 'fire of Allah' reference
  const muqadah = findWord(6, ["\u0645","\u0648","\u0642","\u062f"]);
  if (muqadah) e.terminology.push({ term: muqadah, transliteration: "nar Allah al-muqadah", gloss: "fire of Allah, fueled (editorial gloss)", keys: ["104:6"] });
  const afidah = findWord(7, ["\u0623","\u0641","\u0626","\u062f"]);
  if (afidah) e.terminology.push({ term: afidah, transliteration: "al-af'idah", gloss: "the hearts (editorial gloss)", keys: ["104:7"] });
}

// === POPULATE P3 (104:8-9) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Hellfire sealed over the offenders in extended columns as total enclosure", keys: ["104:8","104:9"], evidenceClass: "EXPLICIT_TEXT" });

  const musadah = findWord(8, ["\u0645","\u0624","\u0635","\u062f"]);
  if (musadah) e.terminology.push({ term: musadah, transliteration: "mu'sadah", gloss: "closed down/sealed over (editorial gloss)", keys: ["104:8"] });
  const amad = findWord(9, ["\u0639","\u0645","\u062f"]);
  if (amad) e.terminology.push({ term: amad, transliteration: "'amad mumaddadah", gloss: "extended columns (editorial gloss)", keys: ["104:9"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `104-al-humazah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 104-al-humazah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-104-p1,ext-104-p2,ext-104-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1995", label: "Scorner-mocker collecting wealth under immortality delusion", def: "In 104:1-3: Woe to every scorner and mocker who collects wealth and continuously counts it; he thinks that his wealth will make him immortal.", key: "104:1", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Humazah lumazah as character defects."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Wealth as false security."}] },
  { id: "cand-1996", label: "Crusher revealed as Allah's fueled fire mounting at the hearts", def: "In 104:4-7: No he will surely be thrown into the Crusher; and what can make you know what is the Crusher; it is the fire of Allah eternally fueled which mounts directed at the hearts.", key: "104:4", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Hutamah and nar Allah muqadah."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Heart-targeted punishment."}] },

  { id: "cand-1997", label: "Hellfire sealed in extended columns as total enclosure", def: "In 104:8-9: Indeed Hellfire will be closed down upon them in extended columns.", key: "104:8", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Mu'sadah and amad mumaddadah."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Complete containment as proportional response."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `104-al-humazah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-128.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-128.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");