// MFD-11 Wave 13: Surah 91 (Ash-Shams) genuine re-extraction.
// Covers 91:1-15 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "091-0001-0015.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 91:${n} not found`);
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

console.log("Generating Surah 91 (Ash-Shams) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T23:15:00.000Z";

const PASSAGES = [
  { id: "ext-091-p1", from: 1, to: 10,
    label: "By sun brightness; moon follows it; day displays it; night covers it; sky He constructed it; earth He spread it; soul He proportioned it; inspired wickedness righteousness; succeeded purifies it; failed instills corruption",
    mainLabel: "Eleven oaths by the sun and its brightness, the moon following it, the day displaying it, the night covering it, the sky and its Constructor, the earth and its Spreader, and the soul and its Proportioner who inspired it with discernment of wickedness and righteousness — establishing that whoever purifies the soul succeeds while whoever corrupts it fails" },
  { id: "ext-091-p2", from: 11, to: 15,
    label: "Thamud denied prophet transgression; most wretched sent forth; messenger Allah Salih said do not harm she-camel Allah prevent drink; denied hamstrung her; Lord brought destruction sin made equal upon all; does not fear consequence",
    mainLabel: "Thamud's denial through transgression illustrated: their most wretched one sent forth despite the messenger of Allah warning them not to harm the she-camel of Allah or prevent her drink; they denied him and hamstrung her, so their Lord brought down destruction for their sin making it equal upon all of them, and He does not fear the consequence thereof" }
];

const SUB_LABELS = {
  "ext-091-p1": [
    "Oath sworn by the sun and its brightness",
    "And by the moon when it follows the sun",
    "And by the day when it displays the sun's light",
    "And by the night when it covers the sun",
    "And by the sky and He who constructed it",
    "And by the earth and He who spread it",
    "And by the soul and He who proportioned it",
    "Inspiring it with discernment of its wickedness and righteousness",
    "Success belongs to whoever purifies the soul",
    "Failure belongs to whoever instils it with corruption"
  ],
  "ext-091-p2": [
    "Thamud denied their prophet by reason of their transgression",
    "When the most wretched among them was sent forth",
    "The messenger of Allah warned them about the she-camel of Allah and her drink",
    "They denied him and hamstrung the she-camel",
    "Their Lord brought down destruction for their sin, levelling it upon all, fearing no consequence"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`91:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`91:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 91, surahName: "Ash-Shams",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the purification-success/corruption-failure binary (10) before the Thamud precedent opens (11); P2 runs through the five-verse narrative of transgression, the she-camel warning, hamstringing, levelled destruction and divine fearlessness (11-15).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (91:1-10) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Soul proportioned and inspired with moral discernment between wickedness and righteousness", keys: ["91:7","91:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Success tied to self-purification and failure to self-corruption", keys: ["91:9","91:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Sun-moon-day-night quadruple oath establishing cosmic rhythm", keys: ["91:1","91:2","91:3","91:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Sky construction and earth spreading sworn by alongside the soul's proportioning", keys: ["91:5","91:6","91:7"], evidenceClass: "EXPLICIT_TEXT" });

  const shams = findWord(1, ["\u0634","\u0645","\u0633"]);
  if (shams) e.terminology.push({ term: shams, transliteration: "al-shams", gloss: "the sun (editorial gloss)", keys: ["91:1"] });
  const ilham = findWord(8, ["\u0623","\u0644","\u0647","\u0645"]);
  if (ilham) e.terminology.push({ term: ilham, transliteration: "fa-alhamaha", gloss: "inspired it with discernment (editorial gloss)", keys: ["91:8"] });
  const tazkiyah = findWord(9, ["\u0632","\u0643","\u0649"]);
  if (tazkiyah) e.terminology.push({ term: tazkiyah, transliteration: "zakkaha", gloss: "purifies it (editorial gloss)", keys: ["91:9"] });
}

// === POPULATE P2 (91:11-15) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["91:13"], excerpt: fv(13), description: "Do not harm the she-camel of Allah or prevent her from her drink." });

  e.propheticNarratives.push({ label: "Thamud denying their prophet through transgression, hamstringing the she-camel after warning", keys: ["91:11","91:12","91:13","91:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Most wretched individual acting on behalf of the entire transgressing people", keys: ["91:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Destruction levelled equally upon all without divine fear of consequence", keys: ["91:14","91:15"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Collective punishment for a collective sin demonstrated through Thamud's annihilation", keys: ["91:14"], evidenceClass: "EXPLICIT_TEXT" });

  const thamud = findWord(11, ["\u062b","\u0645","\u0648","\u062f"]);
  if (thamud) e.terminology.push({ term: thamud, transliteration: "Thamud", gloss: "the people of Thamud (editorial gloss)", keys: ["91:11"] });
  const ashqaha = findWord(12, ["\u0623","\u0634","\u0642"]);
  if (ashqaha) e.terminology.push({ term: ashqaha, transliteration: "ashqaha", gloss: "the most wretched of them (editorial gloss)", keys: ["91:12"] });
  const naqat = findWord(13, ["\u0646","\u0627","\u0642"]);
  if (naqat) e.terminology.push({ term: naqat, transliteration: "naqat Allah", gloss: "she-camel of Allah (editorial gloss)", keys: ["91:13"] });
  const damdama = findWord(14, ["\u062f","\u0645","\u062f","\u0645"]);
  if (damdama) e.terminology.push({ term: damdama, transliteration: "damdama", gloss: "destruction levelled upon them (editorial gloss)", keys: ["91:14"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `091-ash-shams-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 091-ash-shams-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-091-p1,ext-091-p2",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1956", label: "Cosmic and anthropological oaths culminating in soul-purification success", def: "In 91:1-10: By the sun and its brightness and by the moon when it follows it and by the day when it displays it and by the night when it covers it and by the sky and He who constructed it and by the earth and He who spread it and by the soul and He who proportioned it and inspired it with discernment of its wickedness and its righteousness; he has succeeded who purifies it and he has failed who instills it with corruption.", key: "91:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Seven-fold qasam sequence."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Tazkiyah as falah condition."}] },
  { id: "cand-1957", label: "Moral inspiration embedded in the soul at creation", def: "In 91:7-8: And by the soul and He who proportioned it and inspired it with discernment of its wickedness and its righteousness.", key: "91:7", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Ilham al-fujur wa'l-taqwa innate."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Fitrah moral compass."}] },

  { id: "cand-1958", label: "Thamud's transgression: most wretched hamstringing the she-camel despite warning", def: "In 91:11-14: Thamud denied their prophet by reason of their transgression when the most wretched of them was sent forth and the messenger of Allah Salih said to them do not harm the she-camel of Allah or prevent her from her drink; but they denied him and hamstrung her so their Lord brought down upon them destruction for their sin and made it equal upon all of them.", key: "91:11", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Salih and naqat Allah."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Damdama bi-dhanbihim collective."}] },
  { id: "cand-1959", label: "Divine fearlessness regarding the consequence of destruction", def: "In 91:15: And He does not fear the consequence thereof.", key: "91:15", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"La yakhafu uqbaha absolute sovereignty."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"No accountability above Allah."}] }
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
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 4).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `091-ash-shams-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-115.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-115.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");