// MFD-11 Wave 12: Surah 86 (At-Tariq) genuine re-extraction.
// Covers 86:1-17 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "086-0001-0017.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 86:${n} not found`);
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

console.log("Generating Surah 86 (At-Tariq) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T22:25:00.000Z";

const PASSAGES = [
  { id: "ext-086-p1", from: 1, to: 4,
    label: "By sky night comer; what make know night comer; piercing star; no soul but over it protector",
    mainLabel: "Oath by the sky and the night comer whose identity is questioned and then specified as the piercing star; the declaration that no soul exists without a protector appointed over it" },
  { id: "ext-086-p2", from: 5, to: 10,
    label: "let man observe what created; created fluid ejected; emerging between backbone ribs; Indeed Allah return him life Able; Day secrets put trial; then man no power any helper",
    mainLabel: "Man directed to observe his own origin — created from an ejected fluid emerging from between the backbone and the ribs — establishing that Allah is able to return him to life; on the Day when secrets are put on trial he will possess neither power nor any helper" },
  { id: "ext-086-p3", from: 11, to: 17,
    label: "By sky returns rain; earth cracks open; Indeed Quran decisive statement; not amusement; they planning plan; I planning plan; allow time disbelievers leave awhile",
    mainLabel: "Oaths by the rain-returning sky and the cracking earth establishing the Quran as a decisive statement rather than amusement; their plotting answered by divine plotting, closing with the instruction to grant the disbelievers respite and leave them awhile" }
];

const SUB_LABELS = {
  "ext-086-p1": [
    "Oath sworn by the sky and the night comer",
    "The identity of the night comer questioned rhetorically",
    "It is specified as the piercing star",
    "No soul exists without a protector appointed over it"
  ],
  "ext-086-p2": [
    "Man directed to observe the substance of his creation",
    "He was created from an ejected fluid",
    "Emerging from between the backbone and the ribs",
    "Allah affirmed able to return him to life",
    "The Day when secrets will be put on trial",
    "On that Day man possessing neither power nor any helper"
  ],
  "ext-086-p3": [
    "Oath sworn by the sky which returns rain",
    "And by the earth which cracks open",
    "The Quran established as a decisive statement",
    "Explicitly declared not to be amusement",
    "Their plotting against the message acknowledged",
    "Answered by divine plotting of His own",
    "Respite granted to the disbelievers — leave them awhile"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`86:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`86:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 86, surahName: "At-Tariq",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the universal-protector declaration (4) before the creation-observation command opens (5); P2 ends with the no-power-no-helper verdict (10) before the second oath pair begins (11); P3 runs through the decisive-statement affirmation, the mutual plotting and the closing respite instruction (11-17).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (86:1-4) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Every soul under an appointed protector", keys: ["86:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Sky-and-night-comer oath resolving into the piercing star", keys: ["86:1","86:2","86:3"], evidenceClass: "EXPLICIT_TEXT" });

  const tariq = findWord(1, ["\u0637","\u0627","\u0631","\u0642"]);
  if (tariq) e.terminology.push({ term: tariq, transliteration: "al-tariq", gloss: "the night comer (editorial gloss)", keys: ["86:1"] });
  const thaqib = findWord(3, ["\u062b","\u0627","\u0642","\u0628"]);
  if (thaqib) e.terminology.push({ term: thaqib, transliteration: "al-najm al-thaqib", gloss: "the piercing star (editorial gloss)", keys: ["86:3"] });
  const hafiz = findWord(4, ["\u062d","\u0627","\u0641","\u0638"]);
  if (hafiz) e.terminology.push({ term: hafiz, transliteration: "hafiz", gloss: "protector/guardian (editorial gloss)", keys: ["86:4"] });
}

// === POPULATE P2 (86:5-10) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["86:5"], excerpt: fv(5), description: "So let man observe from what he was created." });

  e.humanConditionsAndSpiritualStates.push({ label: "Human origin traced to an ejected fluid between backbone and ribs", keys: ["86:6","86:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Secrets put on trial leaving man without power or helper", keys: ["86:9","86:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Origination from fluid offered as proof of ability to restore life", keys: ["86:6","86:8"], evidenceClass: "EXPLICIT_TEXT" });

  const dafiq = findWord(6, ["\u062f","\u0627","\u0641","\u0642"]);
  if (dafiq) e.terminology.push({ term: dafiq, transliteration: "ma' dafiq", gloss: "ejected fluid (editorial gloss)", keys: ["86:6"] });
  const sulb = findWord(7, ["\u0635","\u0644","\u0628"]);
  if (sulb) e.terminology.push({ term: sulb, transliteration: "al-sulb", gloss: "the backbone (editorial gloss)", keys: ["86:7"] });
  const taraib = findWord(7, ["\u062a","\u0631","\u0627","\u0626","\u0628"]);
  if (taraib) e.terminology.push({ term: taraib, transliteration: "al-tara'ib", gloss: "the ribs (editorial gloss)", keys: ["86:7"] });
}

// === POPULATE P3 (86:11-17) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["86:17"], excerpt: fv(17), description: "So allow time for the disbelievers. Leave them awhile." });

  e.humanConditionsAndSpiritualStates.push({ label: "Human plotting met by divine plotting", keys: ["86:15","86:16"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Rain-returning sky and cracking earth sworn by to establish the Quran's decisiveness", keys: ["86:11","86:12","86:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The Quran explicitly excluded from being amusement", keys: ["86:14"], evidenceClass: "EXPLICIT_TEXT" });

  const raj = findWord(11, ["\u0631","\u062c","\u0639"]);
  if (raj) e.terminology.push({ term: raj, transliteration: "dhat al-raj'", gloss: "that which returns rain (editorial gloss)", keys: ["86:11"] });
  const sad = findWord(12, ["\u0635","\u062f","\u0639"]);
  if (sad) e.terminology.push({ term: sad, transliteration: "dhat al-sad'", gloss: "that which cracks open (editorial gloss)", keys: ["86:12"] });
  const fasl = findWord(13, ["\u0641","\u0635","\u0644"]);
  if (fasl) e.terminology.push({ term: fasl, transliteration: "qawl fasl", gloss: "decisive statement (editorial gloss)", keys: ["86:13"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `086-at-tariq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 086-at-tariq-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-086-p1,ext-086-p2,ext-086-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1932", label: "Night-comer oath resolving into the piercing star with universal soul-guardianship", def: "In 86:1-4: By the sky and the night comer; and what can make you know what is the night comer; it is the piercing star; there is no soul but that it has over it a protector.", key: "86:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Tariq identified as najm thaqib."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Hafiz over every nafs."}] },

  { id: "cand-1933", label: "Creation from ejected fluid between backbone and ribs proving resurrection ability", def: "In 86:5-8: So let man observe from what he was created; he was created from a fluid ejected emerging from between the backbone and the ribs; indeed Allah to return him to life is Able.", key: "86:5", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Ma' dafiq bayn al-sulb wa'l-tara'ib."},{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Raj' argued from origination."}] },
  { id: "cand-1934", label: "Secrets put on trial leaving man without power or helper", def: "In 86:9-10: The Day when secrets will be put on trial; then man will have no power or any helper.", key: "86:9", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Tubla al-sara'ir."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La quwwah wa-la nasir."}] },

  { id: "cand-1935", label: "Rain-returning sky and cracking earth establishing the Quran as decisive not amusement", def: "In 86:11-14: By the sky which returns rain and by the earth which cracks open; indeed the Quran is a decisive statement and it is not amusement.", key: "86:11", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Qawl fasl not hazl."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Raj' and sad' as cyclical signs."}] },
  { id: "cand-1936", label: "Human plotting answered by divine plotting with respite granted", def: "In 86:15-17: Indeed they are planning a plan but I am planning a plan; so allow time for the disbelievers, leave them awhile.", key: "86:15", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Kayd hum versus kayd Allah."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Mahhil ruwayda instructed."}] }
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
extractions[2].topicCandidateIds = candidates.candidates.slice(3, 5).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `086-at-tariq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-110.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-110.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");