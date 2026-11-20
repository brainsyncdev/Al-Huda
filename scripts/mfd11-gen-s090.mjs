// MFD-11 Wave 13: Surah 90 (Al-Balad) genuine re-extraction.
// Covers 90:1-20 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "090-0001-0020.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 90:${n} not found`);
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

console.log("Generating Surah 90 (Al-Balad) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T23:05:00.000Z";

const PASSAGES = [
  { id: "ext-090-p1", from: 1, to: 7,
    label: "swear city Makkah; Muhammad free restriction city; father what born him; created man hardship; thinks never anyone overcome him; says spent wealth abundance; thinks no one seen him",
    mainLabel: "Oath by the sacred city of Makkah where the Prophet is free of restriction, and by the father and what he begot; man created into hardship yet thinking none will overcome him, boasting of abundant spending while assuming no one has seen him" },
  { id: "ext-090-p2", from: 8, to: 17,
    label: "made two eyes; tongue two lips; shown two ways; not broken through difficult pass; what make know difficult pass; freeing slave; feeding day severe hunger; orphan near relationship; needy person misery; among believed advised patience advised compassion",
    mainLabel: "The gifts of two eyes, a tongue and two lips, and the guidance to the two ways recalled as proof that man was equipped but failed to break through the steep pass — whose meaning is questioned and answered as freeing a slave, feeding on a day of severe hunger an orphan of near relationship or a needy person in misery, then being among those who believe and advise one another to patience and compassion" },
  { id: "ext-090-p3", from: 18, to: 20,
    label: "companions right; disbelieved signs companions left; over them fire closed in",
    mainLabel: "Those who broke through identified as companions of the right, while those who disbelieved in the signs are companions of the left over whom fire will be closed in" }
];

const SUB_LABELS = {
  "ext-090-p1": [
    "Oath sworn by this city, Makkah",
    "The Prophet free of restriction within it",
    "And by the father and what was born of him",
    "Man certainly created into hardship",
    "Thinking that no one will ever overcome him",
    "Boasting that he has spent wealth in abundance",
    "Assuming that no one has seen his expenditure"
  ],
  "ext-090-p2": [
    "Two eyes made for him",
    "A tongue and two lips provided",
    "The two ways shown to him clearly",
    "Yet he has not broken through the steep pass",
    "The nature of the steep pass questioned rhetorically",
    "It is the freeing of a slave",
    "Or feeding on a day of severe hunger",
    "An orphan of near relationship",
    "Or a needy person in misery",
    "Then being among believers who advise patience and compassion"
  ],
  "ext-090-p3": [
    "Those who broke through named companions of the right",
    "Those who disbelieved in the signs named companions of the left",
    "Over them fire will be closed in"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`90:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`90:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 90, surahName: "Al-Balad",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the unseen-spending assumption (7) before the sensory-gifts enumeration opens (8); P2 ends with the faith-patience-compassion cluster (17) before the two-companionship verdict begins (18); P3 covers the three-verse closing binary of right-versus-left with sealed fire (18-20).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (90:1-7) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Man created into hardship yet arrogantly assuming invincibility", keys: ["90:4","90:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wealth spent boastfully under the illusion that no one observes", keys: ["90:6","90:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Makkah's sanctity invoked alongside the Prophet's unrestricted standing there", keys: ["90:1","90:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Father-and-offspring oath grounding human existence in generational continuity", keys: ["90:3"], evidenceClass: "EXPLICIT_TEXT" });

  const balad = findWord(1, ["\u0628","\u0644","\u062f"]);
  if (balad) e.terminology.push({ term: balad, transliteration: "al-balad", gloss: "the city, Makkah (editorial gloss)", keys: ["90:1"] });
  const hill = findWord(2, ["\u062d","\u0644"]);
  if (hill) e.terminology.push({ term: hill, transliteration: "hillun", gloss: "free of restriction (editorial gloss)", keys: ["90:2"] });
  const kabad = findWord(4, ["\u0643","\u0628","\u062f"]);
  if (kabad) e.terminology.push({ term: kabad, transliteration: "kabad", gloss: "hardship/toil (editorial gloss)", keys: ["90:4"] });
}

// === POPULATE P2 (90:8-17) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["90:13"], excerpt: fv(13), description: "Freeing a slave identified as breaking through the steep pass." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["90:14"], excerpt: fv(14), description: "Feeding on a day of severe hunger identified as breaking through the steep pass." });

  e.humanConditionsAndSpiritualStates.push({ label: "Sensory gifts of eyes, tongue and lips paired with moral guidance to two ways", keys: ["90:8","90:9","90:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Failure to attempt the steep pass despite being fully equipped", keys: ["90:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Steep pass defined as emancipation, feeding the hungry orphan and relieving the destitute", keys: ["90:13","90:14","90:15","90:16"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Belief joined to mutual counsel toward patience and compassion as the completing act", keys: ["90:17"], evidenceClass: "EXPLICIT_TEXT" });

  const aqabah = findWord(11, ["\u0639","\u0642","\u0628"]);
  if (aqabah) e.terminology.push({ term: aqabah, transliteration: "al-'aqabah", gloss: "the steep/difficult pass (editorial gloss)", keys: ["90:11"] });
  const raqabah = findWord(13, ["\u0631","\u0642","\u0628"]);
  if (raqabah) e.terminology.push({ term: raqabah, transliteration: "raqabah", gloss: "a slave/neck to be freed (editorial gloss)", keys: ["90:13"] });
  const matarrah = findWord(14, ["\u0645","\u0637","\u0631","\u062d"]);
  // Using 'severe hunger' reference
  const makhmasah = findWord(14, ["\u0645","\u062e","\u0645","\u0635"]);
  if (makhmasah) e.terminology.push({ term: makhmasah, transliteration: "makhmasah", gloss: "severe hunger/famine (editorial gloss)", keys: ["90:14"] });
}

// === POPULATE P3 (90:18-20) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Companions of the right distinguished from companions of the left by sign-belief", keys: ["90:18","90:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Fire closed in over the left companions as their sealed fate", keys: ["90:20"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Binary outcome mapping directly onto the steep-pass choice", keys: ["90:18","90:19"], evidenceClass: "EXPLICIT_TEXT" });

  const mashamah = findWord(19, ["\u0645","\u0634","\u0623","\u0645"]);
  if (mashamah) e.terminology.push({ term: mashamah, transliteration: "ashab al-mash'amah", gloss: "companions of the left (editorial gloss)", keys: ["90:19"] });
  const musadah = findWord(20, ["\u0645","\u0624","\u0635","\u062f"]);
  if (musadah) e.terminology.push({ term: musadah, transliteration: "mu'sadah", gloss: "closed in/sealed over (editorial gloss)", keys: ["90:20"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `090-al-balad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 090-al-balad-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-090-p1,ext-090-p2,ext-090-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1952", label: "Makkah-father oaths framing man's creation into hardship and arrogance", def: "In 90:1-7: I swear by this city Makkah and you O Muhammad are free of restriction in this city and by the father and that which was born of him; We have certainly created man into hardship; does he think that never will anyone overcome him; he says I have spent wealth in abundance; does he think that no one has seen him.", key: "90:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Balad-walad qasam pairing."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Kabad as inherent condition."}] },

  { id: "cand-1953", label: "Sensory gifts and two-way guidance contrasted with failure at the steep pass", def: "In 90:8-11: Have We not made for him two eyes and a tongue and two lips and have shown him the two ways; but he has not broken through the difficult pass.", key: "90:8", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Aynayn lisan shafatah najdayn."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Equipment without action diagnosed."}] },
  { id: "cand-1954", label: "Steep pass defined as emancipation, famine-feeding and faith-patience-compassion", def: "In 90:12-17: And what can make you know what is the difficult pass; it is the freeing of a slave or feeding on a day of severe hunger an orphan of near relationship or a needy person in misery; and then being among those who believed and advised one another to patience and advised one another to compassion.", key: "90:12", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Fakk raqabah and it'am defined."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Tawasaw bisabr wa-tawasaw bilmarhamah."}] },

  { id: "cand-1955", label: "Right and left companionship determined by response to divine signs", def: "In 90:18-20: Those are the companions of the right; but they who disbelieved in Our signs those are the companions of the left; over them will be fire closed in.", key: "90:18", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ashab maymanah vs mash'amah."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Mu'sadah as sealed consequence."}] }
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
extractions[1].topicCandidateIds = candidates.candidates.slice(1, 3).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(3, 4).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `090-al-balad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-114.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-114.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");