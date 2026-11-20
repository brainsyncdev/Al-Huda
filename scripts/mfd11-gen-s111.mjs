// MFD-11 Wave 13: Surah 111 (Al-Masad) genuine re-extraction.
// Covers 111:1-5 in 2 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "111-0001-0005.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 111:${n} not found`);
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

console.log("Generating Surah 111 (Al-Masad) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T02:35:00.000Z";

const PASSAGES = [
  { id: "ext-111-p1", from: 1, to: 3,
    label: "May hands Abu Lahab perish may he perish; not avail wealth gained; enter Fire flaming",
    mainLabel: "Abu Lahab's hands condemned to perish along with himself; his wealth and gains will not avail him as he enters a flaming Fire" },
  { id: "ext-111-p2", from: 4, to: 5,
    label: "wife carrier firewood; neck rope palm fibre",
    mainLabel: "His wife described as the carrier of firewood with a rope of palm fibre around her neck" }
];

const SUB_LABELS = {
  "ext-111-p1": [
    "The hands of Abu Lahab condemned to perish, and may he himself perish",
    "His wealth and what he gained will not avail him",
    "He will enter a Fire that flames"
  ],
  "ext-111-p2": [
    "His wife identified as the carrier of firewood",
    "A rope of palm fibre around her neck"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`111:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`111:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 111, surahName: "Al-Masad",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the flaming-Fire entry verdict (3) before the wife-description opens (4); P2 covers the two-verse closing portrait of the firewood-carrier with her palm-fibre rope.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (111:1-3) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Named individual cursed with total ruin despite wealth and gains", keys: ["111:1","111:2","111:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Wealth and worldly acquisition declared futile against divine condemnation", keys: ["111:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Flaming Fire specified as the destination matching the named transgression", keys: ["111:3"], evidenceClass: "EXPLICIT_TEXT" });

  const abuLahab = findWord(1, ["\u0623","\u0628","\u0648","\u0644","\u0647","\u0628"]);
  if (abuLahab) e.terminology.push({ term: abuLahab, transliteration: "Abu Lahab", gloss: "Father of Flame — uncle of the Prophet (editorial gloss)", keys: ["111:1"] });
  const masad = findWord(1, ["\u062a","\u0628"]);
  // Using 'perish' reference
  const tabb = findWord(1, ["\u062a","\u0628"]);
  if (tabb) e.terminology.push({ term: tabb, transliteration: "tabbat yada", gloss: "may his hands perish (editorial gloss)", keys: ["111:1"] });
  const narDhatLahab = findWord(3, ["\u0646","\u0627","\u0631","\u0630","\u0627","\u062a","\u0644","\u0647","\u0628"]);
  // Using 'flaming Fire' reference
  const lahab = findWord(3, ["\u0644","\u0647","\u0628"]);
  if (lahab) e.terminology.push({ term: lahab, transliteration: "nar dhat lahab", gloss: "Fire of flame (editorial gloss)", keys: ["111:3"] });
}

// === POPULATE P2 (111:4-5) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Wife characterised by active participation in persecution through firewood-carrying", keys: ["111:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Palm-fibre rope around the neck as symbolic punishment matching her earthly role", keys: ["111:5"], evidenceClass: "EXPLICIT_TEXT" });

  const hammalatHatab = findWord(4, ["\u062d","\u0645","\u0627","\u0644","\u0629","\u062d","\u0637","\u0628"]);
  // Using 'carrier firewood' reference
  const hatab = findWord(4, ["\u062d","\u0637","\u0628"]);
  if (hatab) e.terminology.push({ term: hatab, transliteration: "hammalat al-hatab", gloss: "carrier of firewood (editorial gloss)", keys: ["111:4"] });
  const hablMasad = findWord(5, ["\u062d","\u0628","\u0644","\u0645","\u0633","\u062f"]);
  // Using 'rope palm fibre' reference
  const masadRope = findWord(5, ["\u0645","\u0633","\u062f"]);
  if (masadRope) e.terminology.push({ term: masadRope, transliteration: "habl min masad", gloss: "rope of palm fibre (editorial gloss)", keys: ["111:5"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `111-al-masad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 111-al-masad-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-111-p1,ext-111-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-2010", label: "Abu Lahab condemned: hands perishing, wealth futile, flaming Fire", def: "In 111:1-3: May the hands of Abu Lahab perish and may he perish; his wealth and what he gained will not avail him; he will enter a Fire that flames.", key: "111:1", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Named curse on Prophet's uncle."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Mal and kasb rendered useless."}] },
  { id: "cand-2011", label: "Wife as firewood-carrier with palm-fibre rope around her neck", def: "In 111:4-5: And his wife the carrier of firewood; around her neck is a rope of palm fibre.", key: "111:4", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Punishment mirroring earthly persecution."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Active complicity named alongside principal."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `111-al-masad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-135.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-135.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");