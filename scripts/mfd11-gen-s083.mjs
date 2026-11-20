// MFD-11 Wave 12: Surah 83 (Al-Mutaffifin) genuine re-extraction.
// Covers 83:1-36 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "083-0001-0036.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 83:${n} not found`);
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

console.log("Generating Surah 83 (Al-Mutaffifin) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T21:55:00.000Z";

const PASSAGES = [
  { id: "ext-083-p1", from: 1, to: 6,
    label: "Woe those give less than due; when take measure people take full; if give measure weight cause loss; do they not think resurrected; tremendous Day; Day mankind stand before Lord worlds",
    mainLabel: "Woe pronounced on those who give less than due — taking full measure from people yet causing loss when measuring or weighing for them; their failure to consider resurrection for a tremendous Day when all mankind will stand before the Lord of the worlds" },
  { id: "ext-083-p2", from: 7, to: 17,
    label: "No Indeed record wicked sijjeen; what make know sijjeen; register inscribed; Woe Day deniers; deny Day Recompense; none deny except sinful transgressor; verses recited says legends former peoples; No Rather stain covered hearts what earning; No Indeed from Lord Day partitioned; then enter burn Hellfire; then said this what used deny",
    mainLabel: "The record of the wicked placed in Sijjeen, an inscribed register whose gravity is questioned; woe that Day to the deniers of the Day of Recompense, denied only by every sinful transgressor who dismisses recited verses as former legends; the stain of their earnings covering their hearts, resulting in partition from their Lord that Day followed by burning in Hellfire and the declaration that this is what they used to deny" },
  { id: "ext-083-p3", from: 18, to: 28,
    label: "No Indeed record righteous illiyyun; what make know illiyyun; register inscribed; witnessed those brought near; Indeed righteous pleasure; adorned couches observing; recognize faces radiance pleasure; given drink pure wine sealed; last musk for this let competitors compete; mixture Tasneem; spring those near drink",
    mainLabel: "The record of the righteous placed in Illiyyun, an inscribed register witnessed by those brought near; the righteous in pleasure on adorned couches observing, their faces bearing recognisable radiance; served sealed pure wine whose finish is musk — for which competitors should compete — mixed from Tasneem, a spring from which those brought near drink" },
  { id: "ext-083-p4", from: 29, to: 36,
    label: "Indeed criminals used laugh believers; passed exchange derisive glances; returned people jesting; saw them say indeed truly lost; not sent guardians over them; Today believers laughing disbelievers; adorned couches observing; disbelievers rewarded Day what used do",
    mainLabel: "Criminals who used to laugh at believers, exchange derisive glances when passing, return jesting to their people and declare the believers truly lost despite never being appointed guardians over them; today the reversal occurs as believers laugh at the disbelievers from adorned couches while observing, with the disbelievers recompensed for what they used to do" }
];

const SUB_LABELS = {
  "ext-083-p1": [
    "Woe pronounced on those who give less than due",
    "Taking full measure when receiving from people",
    "Yet causing loss when measuring or weighing for them",
    "Their failure to consider that they will be resurrected",
    "For a tremendous Day",
    "The Day mankind stands before the Lord of the worlds"
  ],
  "ext-083-p2": [
    "The record of the wicked placed in Sijjeen",
    "The gravity of Sijjeen questioned rhetorically",
    "Identified as an inscribed register",
    "Al-Mutaffifin pronounces woe on those denying the Day after Sijjeen is named",
    "Those who deny the Day of Recompense",
    "None denying it except every sinful transgressor",
    "The transgressor dismissing recited verses as ancient legends when confronted",
    "The stain of their earnings covering their hearts",
    "Partition from their Lord on that Day",
    "Then entering and burning in Hellfire",
    "Told this is what they used to deny"
  ],
  "ext-083-p3": [
    "The record of the righteous placed in Illiyyun",
    "The gravity of Illiyyun questioned rhetorically",
    "Illiyyun identified as a kitab marqum",
    "Witnessed by those brought near to Allah",
    "The abrar granted na'im after their Illiyyun record is witnessed",
    "On adorned couches, observing",
    "Radiance of pleasure recognisable in their faces",
    "Given sealed pure wine to drink",
    "Its finish is musk — for this let competitors compete",
    "Its mixture drawn from Tasneem",
    "A spring from which those brought near drink"
  ],
  "ext-083-p4": [
    "Criminals who used to laugh at the believers",
    "Exchanging derisive glances when passing them",
    "Returning to their own people jesting",
    "Declaring the believers truly lost when seeing them",
    "Yet they had never been sent as guardians over them",
    "Today the believers laugh at the disbelievers",
    "From adorned couches, observing",
    "The disbelievers recompensed for what they used to do"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`83:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`83:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 83, surahName: "Al-Mutaffifin",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the standing-before-the-Lord statement (6) before the Sijjeen record block opens (7); P2 ends with the this-is-what-you-denied declaration (17) before the Illiyyun record block begins (18); P3 runs through the inscribed register, couch-radiance, sealed wine and Tasneem spring (18-28); P4 covers the criminal-mockery catalogue and its eschatological reversal (29-36).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (83:1-6) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["83:1","83:3"], excerpt: fv(1), description: "Woe to those who give less than due — taking full measure from people while causing loss when giving." });

  e.humanConditionsAndSpiritualStates.push({ label: "Commercial double standard rooted in failure to consider resurrection", keys: ["83:2","83:3","83:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Fraudulent measuring and weighing condemned as economic injustice", keys: ["83:1","83:2","83:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "All mankind standing before the Lord of the worlds on a tremendous Day", keys: ["83:5","83:6"], evidenceClass: "EXPLICIT_TEXT" });

  const mutaffifin = findWord(1, ["\u0645","\u0637","\u0641","\u0641"]);
  if (mutaffifin) e.terminology.push({ term: mutaffifin, transliteration: "al-mutaffifin", gloss: "those who give less than due (editorial gloss)", keys: ["83:1"] });
  const kayl = findWord(2, ["\u0643","\u064a","\u0644"]);
  if (kayl) e.terminology.push({ term: kayl, transliteration: "iktalu", gloss: "taking measure (editorial gloss)", keys: ["83:2"] });
}

// === POPULATE P2 (83:7-17) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Sinful transgression producing denial of the Day of Recompense", keys: ["83:11","83:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "The stain of accumulated earnings covering the heart", keys: ["83:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Partition from the Lord named as the primary punishment before the Fire", keys: ["83:15"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Wicked record confined to Sijjeen as an inscribed register", keys: ["83:7","83:8","83:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Burning in Hellfire followed by the declaration that this is what they denied", keys: ["83:16","83:17"], evidenceClass: "EXPLICIT_TEXT" });

  const sijjeen = findWord(7, ["\u0633","\u062c","\u064a","\u0646"]);
  if (sijjeen) e.terminology.push({ term: sijjeen, transliteration: "sijjin", gloss: "Sijjeen, the wicked's register (editorial gloss)", keys: ["83:7"] });
  const ran = findWord(14, ["\u0631","\u0627","\u0646"]);
  if (ran) e.terminology.push({ term: ran, transliteration: "rana", gloss: "stain covering the heart (editorial gloss)", keys: ["83:14"] });
  const mahjubun = findWord(15, ["\u0645","\u062d","\u062c","\u0648","\u0628"]);
  if (mahjubun) e.terminology.push({ term: mahjubun, transliteration: "mahjubun", gloss: "partitioned/veiled (editorial gloss)", keys: ["83:15"] });
}

// === POPULATE P3 (83:18-28) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["83:26"], excerpt: fv(26), description: "So for this let the competitors compete." });

  e.humanConditionsAndSpiritualStates.push({ label: "Radiance of pleasure recognisable in the faces of the righteous", keys: ["83:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Competitive striving redirected toward the sealed musk-finished drink", keys: ["83:25","83:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Adorned couches, sealed wine and Tasneem mixture comprising the reward setting", keys: ["83:23","83:25","83:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Righteous record in Illiyyun witnessed by those brought near", keys: ["83:18","83:20","83:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Tasneem named as the spring from which the near ones drink", keys: ["83:27","83:28"], evidenceClass: "EXPLICIT_TEXT" });

  const illiyyun = findWord(18, ["\u0639","\u0644","\u064a","\u0646"]);
  if (illiyyun) e.terminology.push({ term: illiyyun, transliteration: "illiyyun", gloss: "Illiyyun, the righteous' register (editorial gloss)", keys: ["83:18"] });
  const tasneem = findWord(27, ["\u062a","\u0633","\u0646","\u064a","\u0645"]);
  if (tasneem) e.terminology.push({ term: tasneem, transliteration: "Tasnim", gloss: "a named spring in Paradise (editorial gloss)", keys: ["83:27"] });
  const misk = findWord(26, ["\u0645","\u0633","\u0643"]);
  if (misk) e.terminology.push({ term: misk, transliteration: "misk", gloss: "musk (editorial gloss)", keys: ["83:26"] });
}

// === POPULATE P4 (83:29-36) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Criminal mockery expressed through laughter, derisive glances, jesting and declarations of loss", keys: ["83:29","83:30","83:31","83:32"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Eschatological reversal: believers laughing at disbelievers from adorned couches", keys: ["83:34","83:35"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Social ridicule of believers condemned despite no guardianship authority over them", keys: ["83:32","83:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Disbelievers recompensed for their prior conduct as the closing verdict", keys: ["83:36"], evidenceClass: "EXPLICIT_TEXT" });

  const araik = findWord(35, ["\u0623","\u0631","\u0627","\u0626","\u0643"]);
  if (araik) e.terminology.push({ term: araik, transliteration: "ara'ik", gloss: "adorned couches (editorial gloss)", keys: ["83:35"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `083-al-mutaffifin-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 083-al-mutaffifin-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-083-p1,ext-083-p2,ext-083-p3,ext-083-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1915", label: "Commercial fraud condemned: full measure taken, loss given", def: "In 83:1-6: Woe to those who give less than due; who when they take a measure from people take in full but if they give by measure or by weight to them they cause loss; do they not think that they will be resurrected for a tremendous Day, the Day when mankind will stand before the Lord of the worlds.", key: "83:1", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Tatfif as measurable zulm."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Qiyam bayna yaday rabb al-alamin."}] },

  { id: "cand-1916", label: "Sijjeen as the inscribed register of the wicked", def: "In 83:7-9: No indeed the record of the wicked is in sijjeen; and what can make you know what is sijjeen; it is a register inscribed.", key: "83:7", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Kitab marqum for fujjar."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Deeds permanently registered."}] },
  { id: "cand-1917", label: "Heart-stain from earnings producing partition from the Lord", def: "In 83:14-17: No rather the stain has covered their hearts of that which they were earning; no indeed from their Lord that Day they will be partitioned; then indeed they will enter and burn in Hellfire; then it will be said this is what you used to deny.", key: "83:14", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Ran ala al-qulub from kasb."},{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Hijab preceding salli al-jahim."}] },

  { id: "cand-1918", label: "Illiyyun witnessed by the near ones with sealed musk-finished wine", def: "In 83:18-28: No indeed the record of the righteous is in illiyyun; and what can make you know what is illiyyun; it is a register inscribed which is witnessed by those brought near; indeed the righteous will be in pleasure on adorned couches observing; you will recognize in their faces the radiance of pleasure; they will be given to drink pure wine which was sealed, the last of it is musk so for this let the competitors compete; and its mixture is of Tasneem, a spring from which those near drink.", key: "83:18", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Illiyyun and named drinks detailed."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Tanafus redirected to the hereafter."}] },

  { id: "cand-1919", label: "Criminal mockery of believers reversed on the Day", def: "In 83:29-36: Indeed those who committed crimes used to laugh at those who believed and when they passed by them they would exchange derisive glances and when they returned to their people they would return jesting and when they saw them they would say indeed those are truly lost; but they had not been sent as guardians over them; so Today those who believed are laughing at the disbelievers on adorned couches observing; have the disbelievers not been rewarded this Day for what they used to do.", key: "83:29", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Mockery requited proportionally."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Believers' endurance vindicated."}] }
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
    notes: "Wave 12 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 1).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(1, 3).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(3, 4).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(4, 5).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `083-al-mutaffifin-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-107.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-107.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");