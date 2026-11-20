// MFD-11 Wave 12: Surah 81 (At-Takwir) genuine re-extraction.
// Covers 81:1-29 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "081-0001-0029.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 81:${n} not found`);
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

console.log("Generating Surah 81 (At-Takwir) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T21:35:00.000Z";

const PASSAGES = [
  { id: "ext-081-p1", from: 1, to: 14,
    label: "sun wrapped darkness; stars fall dispersing; mountains removed; full-term she-camels neglected; wild beasts gathered; seas filled flame; souls paired; girl buried alive asked; what sin killed; pages made public; sky stripped away; Hellfire set ablaze; Paradise brought near; soul know what brought",
    mainLabel: "The twelve-fold dissolution sequence: sun wrapped in darkness, stars falling and dispersing, mountains removed, full-term she-camels neglected, wild beasts gathered, seas filled with flame, souls paired, the buried-alive girl questioned about the sin for which she was killed, pages made public, sky stripped away, Hellfire set ablaze and Paradise brought near — after which every soul knows what it has brought" },
  { id: "ext-081-p2", from: 15, to: 25,
    label: "swear retreating stars; run courses disappear; night closes in; dawn breathes; indeed Quran word conveyed noble messenger; possessed power Owner Throne secure position; obeyed heavens trustworthy; companion not mad; seen Gabriel clear horizon; Muhammad not withholder knowledge unseen; Quran not word devil expelled heavens",
    mainLabel: "Oaths by retreating stars that run their courses and disappear, by the closing night and the breathing dawn, establishing the Quran as a word conveyed by a noble messenger possessed of power and secure in position with the Owner of the Throne, obeyed in the heavens and trustworthy; the Prophet affirmed not mad, having seen Gabriel on the clear horizon and not withholding knowledge of the unseen; the Quran declared not the word of an expelled devil" },
  { id: "ext-081-p3", from: 26, to: 29,
    label: "where going; not except reminder worlds; whoever wills among take right course; not will except Allah wills Lord worlds",
    mainLabel: "The direction question posed — where are you going — answered by naming the Quran nothing but a reminder to the worlds for whoever wills to take a right course, with human willing nested under the will of Allah, Lord of the worlds" }
];

const SUB_LABELS = {
  "ext-081-p1": [
    "The sun wrapped up in darkness",
    "Stars falling and dispersing",
    "Mountains removed from their places",
    "Full-term she-camels neglected despite their value",
    "Wild beasts gathered together",
    "Seas filled with flame",
    "Souls paired with their kinds",
    "The girl buried alive questioned",
    "About the sin for which she was killed",
    "Pages of deeds made public",
    "The sky stripped away",
    "Hellfire set ablaze",
    "Paradise brought near",
    "Every soul then knowing what it has brought"
  ],
  "ext-081-p2": [
    "Oath sworn by the retreating stars",
    "Those that run their courses and disappear",
    "And by the night as it closes in",
    "And by the dawn when it breathes",
    "The Quran established as a word conveyed by a noble messenger",
    "That messenger possessed of power and secure in position with the Owner of the Throne",
    "Obeyed in the heavens and trustworthy",
    "The Prophet's companion affirmed not mad",
    "He has already seen Gabriel on the clear horizon",
    "Muhammad declared not a withholder of knowledge of the unseen",
    "The Quran declared not the word of an expelled devil"
  ],
  "ext-081-p3": [
    "The direction question: so where are you going",
    "At-Takwir names it a reminder addressed to all the worlds",
    "For whoever among you wills to take a right course",
    "Yet you do not will except that Allah wills, Lord of the worlds"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`81:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`81:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 81, surahName: "At-Takwir",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the soul-knowing-what-it-brought verdict (14) before the star-night-dawn oaths open (15); P2 ends with the expelled-devil denial (25) before the direction question begins (26); P3 covers the where-going challenge, the reminder-to-the-worlds function and the divine-will nesting (26-29).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (81:1-14) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Twelve cosmic and social upheavals culminating in each soul's self-knowledge", keys: ["81:1","81:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "The buried-alive girl questioned about the sin for which she was killed", keys: ["81:8","81:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Valuable full-term she-camels neglected and wild beasts gathered as social order collapses", keys: ["81:4","81:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Female infanticide subjected to divine interrogation on the Day", keys: ["81:8","81:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Sun darkened, stars scattered, mountains removed and seas flaming as cosmic dissolution", keys: ["81:1","81:2","81:3","81:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Souls paired, pages published, sky stripped, Hellfire ablaze and Paradise brought near", keys: ["81:7","81:10","81:11","81:12","81:13"], evidenceClass: "EXPLICIT_TEXT" });

  const takwir = findWord(1, ["\u0643","\u0648","\u0631"]);
  if (takwir) e.terminology.push({ term: takwir, transliteration: "kuwwirat", gloss: "wrapped up in darkness (editorial gloss)", keys: ["81:1"] });
  const mawudah = findWord(8, ["\u0645","\u0648","\u0621","\u0648","\u062f"]);
  if (mawudah) e.terminology.push({ term: mawudah, transliteration: "al-maw'udah", gloss: "the girl buried alive (editorial gloss)", keys: ["81:8"] });
}

// === POPULATE P2 (81:15-25) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Prophetic sanity affirmed against madness charges", keys: ["81:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Direct vision of Gabriel on the clear horizon as revelatory credential", keys: ["81:23"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Four-fold oath by retreating stars, running courses, closing night and breathing dawn", keys: ["81:15","81:16","81:17","81:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Noble messenger possessing power, secure position with the Throne's Owner, obeyed and trustworthy", keys: ["81:19","81:20","81:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No withholding of unseen knowledge and no satanic authorship", keys: ["81:24","81:25"], evidenceClass: "EXPLICIT_TEXT" });

  const khunnas = findWord(15, ["\u062e","\u0646","\u0633"]);
  if (khunnas) e.terminology.push({ term: khunnas, transliteration: "al-khunnas", gloss: "the retreating stars (editorial gloss)", keys: ["81:15"] });
  const arsh = findWord(20, ["\u0639","\u0631","\u0634"]);
  if (arsh) e.terminology.push({ term: arsh, transliteration: "dhi al-arsh", gloss: "Owner of the Throne (editorial gloss)", keys: ["81:20"] });
  const makeen = findWord(20, ["\u0645","\u0643","\u064a","\u0646"]);
  if (makeen) e.terminology.push({ term: makeen, transliteration: "makin", gloss: "secure in position (editorial gloss)", keys: ["81:20"] });
}

// === POPULATE P3 (81:26-29) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Direction questioned: where are you going after rejecting the reminder", keys: ["81:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Reminder to the worlds available to whoever wills a right course", keys: ["81:27","81:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Human willing nested under the will of Allah, Lord of the worlds", keys: ["81:29"], evidenceClass: "EXPLICIT_TEXT" });

  const istaqama = findWord(28, ["\u064a","\u0633","\u062a","\u0642","\u064a","\u0645"]);
  if (istaqama) e.terminology.push({ term: istaqama, transliteration: "an yastaqim", gloss: "to take a right course (editorial gloss)", keys: ["81:28"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `081-at-takwir-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 081-at-takwir-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-081-p1,ext-081-p2,ext-081-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1905", label: "Twelve-fold cosmic dissolution culminating in soul self-knowledge", def: "In 81:1-14: When the sun is wrapped up in darkness and when the stars fall dispersing and when the mountains are removed and when full-term she-camels are neglected and when the wild beasts are gathered and when the seas are filled with flame and when the souls are paired and when the girl who was buried alive is asked for what sin she was killed and when the pages are made public and when the sky is stripped away and when Hellfire is set ablaze and when Paradise is brought near; a soul will then know what it has brought with it.", key: "81:1", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Twelve idha clauses."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Alimat nafs ma ahdarat."}] },
  { id: "cand-1906", label: "Female infanticide subjected to divine interrogation", def: "In 81:8-9: And when the girl who was buried alive is asked for what sin she was killed.", key: "81:8", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Wa'd al-banat judged."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Victim questioned not perpetrator."}] },

  { id: "cand-1907", label: "Star-night-dawn oaths establishing the noble messenger's conveyance", def: "In 81:15-21: So I swear by the retreating stars, those that run their courses and disappear, and by the night as it closes in and by the dawn when it breathes; indeed the Quran is a word conveyed by a noble messenger possessed of power and with the Owner of the Throne secure in position, obeyed there in the heavens and trustworthy.", key: "81:15", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Jibreel dhi quwwah makin amin."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Qawl rasul karim chain."}] },
  { id: "cand-1908", label: "Prophetic sanity, direct Gabriel-vision and no withholding of unseen", def: "In 81:22-25: And your companion is not at all mad and he has already seen Gabriel in the clear horizon and Muhammad is not a withholder of knowledge of the unseen and the Quran is not the word of a devil expelled from the heavens.", key: "81:22", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Majnun charge refuted with credentials."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Shaytan rajim authorship denied."}] },

  { id: "cand-1909", label: "Reminder to the worlds with human will nested under divine will", def: "In 81:26-29: So where are you going; it is not except a reminder to the worlds for whoever wills among you to take a right course; and you do not will except that Allah wills, Lord of the worlds.", key: "81:26", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Istiqamah willed under mashi'ah."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr li'l-alamin function."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 4).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(4, 5).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `081-at-takwir-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-105.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-105.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");