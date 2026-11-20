// MFD-11 Wave 11: Surah 73 (Al-Muzzammil) genuine re-extraction.
// Covers 73:1-20 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "073-0001-0020.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 73:${n} not found`);
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

console.log("Generating Surah 73 (Al-Muzzammil) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T20:15:00.000Z";

const PASSAGES = [
  { id: "ext-073-p1", from: 1, to: 9,
    label: "O wraps himself clothing; arise pray night except little; half subtract little; add recite Quran measured recitation; indeed cast upon you heavy word; indeed hours night more effective concurrence heart tongue more suitable words; indeed day prolonged occupation; remember name Lord devote yourself complete devotion; Lord East West no deity except Him take Him Disposer affairs",
    mainLabel: "The wrapped one commanded to arise for night prayer except a little — half the night or slightly less or more — reciting the Quran with measured recitation since a heavy word is about to be cast upon him; night hours identified as more effective for heart-tongue concurrence and more suitable for speech while daytime holds prolonged occupation; remembrance of the Lord's name and complete devotion urged toward the Lord of east and west who alone is deity and should be taken as disposer of affairs" },
  { id: "ext-073-p2", from: 10, to: 19,
    label: "patient over what say avoid gracious avoidance; leave Me deniers those ease life allow respite little; indeed Us shackles burning fire; food chokes painful punishment; Day earth mountains convulse mountains heap sand pouring down; indeed sent Messenger witness upon you just sent Pharaoh messenger; Pharaoh disobeyed messenger seized ruinous seizure; how fear disbelieve Day make children white-haired; heaven break apart ever promise fulfilled; indeed reminder whoever wills take Lord way",
    mainLabel: "Patience commanded over their speech with gracious avoidance of them; the matter of ease-living deniers left to Allah with brief respite granted before shackles, burning fire, choking food and painful punishment await; the Day the earth and mountains convulse and mountains become pouring sand heaps recalled; the Messenger sent as witness paralleled to the messenger sent to Pharaoh who disobeyed and was seized ruinously; the question posed how they can fear that hair-whitening Day if they disbelieve, when the heaven itself breaks apart under His ever-fulfilled promise; all named a reminder so whoever wills may take a way to his Lord" },
  { id: "ext-073-p3", from: 20, to: 20,
    label: "Lord knows stand prayer almost two thirds night half third group those with you; Allah determines night day; known not able do it turned forgiveness recite easy Quran; known among ill others traveling land seeking bounty Allah others fighting cause Allah; recite easy establish prayer give zakah loan Allah goodly loan; whatever good put forward yourselves find Allah better greater reward; seek forgiveness Allah indeed Forgiving Merciful",
    mainLabel: "The Lord knowing that the Prophet and a group with him stand nearly two-thirds, half or a third of the night while Allah determines night and day; He knew they would not sustain it and turned to them in forgiveness, easing the command to recite what is manageable of the Quran since some are ill, others travel seeking bounty and others fight in Allah's cause; the standing obligations reaffirmed — establish prayer, give zakah and lend Allah a goodly loan — with every good forwarded found with Him as better and greater in reward; closing with the command to seek forgiveness since Allah is Forgiving and Merciful" }
];

const SUB_LABELS = {
  "ext-073-p1": [
    "The wrapped one addressed by his state",
    "Commanded to arise for night prayer except a little",
    "Half the night specified, or slightly less",
    "Or slightly more, with measured Quranic recitation",
    "A heavy word about to be cast upon him announced",
    "Night hours identified as more effective for heart-tongue concurrence and more suitable for speech",
    "Daytime acknowledged as holding prolonged occupation",
    "Remembrance of the Lord's name and complete devotion commanded",
    "The Lord of east and west affirmed as sole deity and disposer of affairs"
  ],
  "ext-073-p2": [
    "Patience over their speech commanded with gracious avoidance",
    "The matter of ease-living deniers left to Allah with brief respite",
    "Shackles and burning fire awaiting them with Us",
    "Choking food and painful punishment added to their sentence",
    "The Day the earth and mountains convulse and mountains become pouring sand heaps",
    "The Messenger sent as witness paralleled to the messenger sent to Pharaoh",
    "Pharaoh disobeyed and was seized with a ruinous seizure",
    "How can they fear that hair-whitening Day if they disbelieve",
    "The heaven breaking apart under His ever-fulfilled promise",
    "All named a reminder so whoever wills may take a way to his Lord"
  ],
  "ext-073-p3": [
    "Divine knowledge of actual night-prayer duration leading to eased recitation for the ill, travelling and fighting, with prayer, zakah and goodly loan reaffirmed, every good found better with Allah, and closing istighfar under forgiveness and mercy"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`73:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`73:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 73, surahName: "Al-Muzzammil",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 11 genuine re-extraction. Boundaries follow the text: P1 closes with the Lord-of-east-and-west tawheed and disposal command (9) before the patience-and-denier-punishment block opens (10); P2 ends with the reminder-and-way declaration (19) before the single-verse concession and reaffirmation (20); P3 is the comprehensive v20 covering night-prayer observation, divine easing, illness-travel-fighting exemptions, standing obligations and closing istighfar.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (73:1-9) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["73:2"], excerpt: fv(2), description: "Arise to pray the night, except for a little." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["73:4"], excerpt: fv(4), description: "Recite the Quran with measured recitation." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["73:8"], excerpt: fv(8), description: "Remember the name of your Lord and devote yourself to Him with complete devotion." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["73:9"], excerpt: fv(9), description: "Take Him as Disposer of your affairs." });

  e.humanConditionsAndSpiritualStates.push({ label: "Heavy word about to be cast requiring preparatory night vigil", keys: ["73:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Night hours more effective for heart-tongue concurrence than daytime occupation", keys: ["73:6","73:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Lord of east and west declared sole deity and disposer of affairs", keys: ["73:9"], evidenceClass: "EXPLICIT_TEXT" });

  const muzzammil = findWord(1, ["\u0645","\u0632","\u0645","\u0644"]);
  if (muzzammil) e.terminology.push({ term: muzzammil, transliteration: "al-muzzammil", gloss: "the wrapped one (editorial gloss)", keys: ["73:1"] });
  const tartil = findWord(4, ["\u0631","\u062a","\u0644"]);
  if (tartil) e.terminology.push({ term: tartil, transliteration: "tartil", gloss: "measured recitation (editorial gloss)", keys: ["73:4"] });
  const qawl = findWord(5, ["\u0642","\u0648","\u0644"]);
  if (qawl) e.terminology.push({ term: qawl, transliteration: "qawl thaqil", gloss: "heavy word (editorial gloss)", keys: ["73:5"] });
}

// === POPULATE P2 (73:10-19) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["73:10"], excerpt: fv(10), description: "Be patient over what they say and avoid them with gracious avoidance." });

  e.propheticNarratives.push({ label: "Messenger sent as witness paralleled to the messenger sent to Pharaoh who disobeyed and was seized ruinously", keys: ["73:15","73:16"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Ease-living deniers granted brief respite before shackles, fire, choking food and painful punishment", keys: ["73:11","73:12","73:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hair-whitening Day questioned against disbelief despite heaven breaking under fulfilled promise", keys: ["73:17","73:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Earth and mountains convulsing with mountains becoming pouring sand heaps on that Day", keys: ["73:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Gracious avoidance prescribed alongside patience over hostile speech", keys: ["73:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The whole named a reminder enabling whoever wills to take a way to his Lord", keys: ["73:19"], evidenceClass: "EXPLICIT_TEXT" });

  const hajr = findWord(10, ["\u0647","\u062c","\u0631"]);
  if (hajr) e.terminology.push({ term: hajr, transliteration: "hajr jamil", gloss: "gracious avoidance (editorial gloss)", keys: ["73:10"] });
  const ankad = findWord(13, ["\u063a","\u0635","\u0635"]);
  // Using 'food that chokes' reference
  const ghasis = findWord(13, ["\u063a","\u0635","\u0635"]);
  if (ghasis) e.terminology.push({ term: ghasis, transliteration: "ghassaq / dhi ghussah", gloss: "choking food (editorial gloss)", keys: ["73:13"] });
}

// === POPULATE P3 (73:20) ===
{
  const e = extractions[2];
  const ghafoor = findWord(20, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(20, ["\u0631","\u062d","\u064a","\u0645"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["73:20"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["73:20"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["73:20"], excerpt: fv(20), description: "Recite what is easy for you of the Quran." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["73:20"], excerpt: fv(20), description: "Establish prayer and give zakah and loan Allah a goodly loan." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["73:20"], excerpt: fv(20), description: "Seek forgiveness of Allah. Indeed, Allah is Forgiving and Merciful." });

  e.humanConditionsAndSpiritualStates.push({ label: "Divine knowledge of actual night-prayer duration leading to eased obligation", keys: ["73:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Illness, travel for bounty and fighting cited as legitimate grounds for easing", keys: ["73:20"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Prayer, zakah and goodly loan reaffirmed as standing obligations after concession", keys: ["73:20"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Every good forwarded found with Allah as better and greater in reward", keys: ["73:20"], evidenceClass: "EXPLICIT_TEXT" });

  const qard = findWord(20, ["\u0642","\u0631","\u0636"]);
  if (qard) e.terminology.push({ term: qard, transliteration: "qard hasan", gloss: "goodly loan (editorial gloss)", keys: ["73:20"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `073-al-muzzammil-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 073-al-muzzammil-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-073-p1,ext-073-p2,ext-073-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1844", label: "Night prayer with measured recitation preparing for the heavy word", def: "In 73:2-5: Arise to pray the night except for a little; half of it or subtract from it a little or add to it and recite the Quran with measured recitation; indeed We will cast upon you a heavy word.", key: "73:2", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Qiyam al-layl legislated."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Tartil preparing for qawl thaqil."}] },
  { id: "cand-1845", label: "Night hours more effective for heart-tongue concurrence than daytime occupation", def: "In 73:6-7: Indeed the hours of the night are more effective for concurrence of heart and tongue and more suitable for words; indeed for you by day is prolonged occupation.", key: "73:6", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Ashadd wat'an wa-aqwam qil."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"related-not-identical",note:"Night cognition privileged."}] },
  { id: "cand-1846", label: "Complete devotion to the Lord of east and west as sole disposer", def: "In 73:8-9: And remember the name of your Lord and devote yourself to Him with complete devotion; He is the Lord of the East and the West there is no deity except Him so take Him as Disposer of your affairs.", key: "73:8", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Tabattul as total devotion."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Rabb al-mashriq wa'l-maghrib."}] },

  { id: "cand-1847", label: "Gracious avoidance of deniers while leaving their matter to Allah", def: "In 73:10-11: And be patient over what they say and avoid them with gracious avoidance; and leave Me with the matter of the deniers those of ease in life and allow them respite a little.", key: "73:10", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr plus hajr jamil."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Non-violent disengagement modeled."}] },
  { id: "cand-1848", label: "Pharaoh parallel: messenger-witness met with disobedience and ruinous seizure", def: "In 73:15-16: Indeed We have sent to you a Messenger as a witness upon you just as We sent to Pharaoh a messenger; but Pharaoh disobeyed the messenger so We seized him with a ruinous seizure.", key: "73:15", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Musa-Firawn precedent invoked."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Akhdh shadid as warning."}] },

  { id: "cand-1849", label: "Divine easing of night prayer due to illness, travel and fighting", def: "In 73:20: Indeed your Lord knows O Muhammad that you stand in prayer almost two thirds of the night or half of it or a third of it and so do a group of those with you; and Allah determines the night and the day; He has known that you Muslims will not be able to do it and has turned to you in forgiveness so recite what is easy for you of the Quran; He has known that there will be among you those who are ill and others traveling throughout the land seeking something of the bounty of Allah and others fighting for the cause of Allah; so recite what is easy from it.", key: "73:20", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Takhfif based on capacity."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Taba alaykum as legislative mercy."}] },
  { id: "cand-1850", label: "Standing obligations reaffirmed after concession: prayer, zakah, goodly loan", def: "In 73:20: And establish prayer and give zakah and loan Allah a goodly loan; and whatever good you put forward for yourselves you will find it with Allah; it is better and greater in reward; and seek forgiveness of Allah indeed Allah is Forgiving and Merciful.", key: "73:20", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Qard hasan alongside zakah."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Istighfar closing the surah."}] }
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
    notes: "Wave 11 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 3).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(3, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 7).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `073-al-muzzammil-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-097.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-097.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");