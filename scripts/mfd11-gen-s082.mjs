// MFD-11 Wave 12: Surah 82 (Al-Infitar) genuine re-extraction.
// Covers 82:1-19 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "082-0001-0019.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 82:${n} not found`);
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

console.log("Generating Surah 82 (Al-Infitar) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T21:45:00.000Z";

const PASSAGES = [
  { id: "ext-082-p1", from: 1, to: 5,
    label: "sky breaks apart; stars fall scattering; seas erupted; contents graves scattered; soul then know what put forth kept back",
    mainLabel: "The four-fold dissolution sequence — sky breaking apart, stars falling and scattering, seas erupting and grave-contents scattered — after which every soul knows what it has put forth and kept back" },
  { id: "ext-082-p2", from: 6, to: 12,
    label: "O mankind what deceived you concerning Lord Generous; created proportioned balanced you; whatever form willed assembled you; No deny Recompense; indeed appointed over keepers; noble recording; know whatever do",
    mainLabel: "Mankind questioned about what deceived them concerning their Generous Lord who created, proportioned and balanced them, assembling them in whatever form He willed; their denial of the Recompense answered by the appointment of noble recording keepers who know whatever they do" },
  { id: "ext-082-p3", from: 13, to: 19,
    label: "Indeed righteous pleasure; wicked Hellfire; enter burn Day Recompense; never therefrom absent; what make know Day Recompense; then what make know Day Recompense; Day soul not possess another soul power thing; command Day entirely Allah",
    mainLabel: "The righteous placed in pleasure while the wicked are in Hellfire, entering to burn on the Day of Recompense from which they will never be absent; the gravity of that Day emphasised by doubled questioning; it is the Day when no soul possesses any power for another and the command rests entirely with Allah" }
];

const SUB_LABELS = {
  "ext-082-p1": [
    "The sky breaking apart",
    "Stars falling and scattering",
    "Seas erupted and bursting forth",
    "The contents of graves scattered",
    "Every soul then knowing what it put forth and kept back"
  ],
  "ext-082-p2": [
    "Mankind questioned about what deceived them concerning their Generous Lord",
    "He created, proportioned and balanced them",
    "Assembled them in whatever form He willed",
    "Their denial of the Recompense rebuked",
    "Noble keepers appointed over them",
    "Those keepers described as noble and recording",
    "They know whatever people do"
  ],
  "ext-082-p3": [
    "The righteous placed in pleasure",
    "The wicked placed in Hellfire",
    "Entering to burn therein on the Day of Recompense",
    "Never absent from it thereafter",
    "The gravity of the Day of Recompense questioned",
    "The question repeated for emphasis",
    "No soul possessing any power for another; the command entirely with Allah"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`82:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`82:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 82, surahName: "Al-Infitar",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the soul-knowing verdict (5) before the deception-question opens (6); P2 ends with the recording-keepers' knowledge (12) before the two-outcome block begins (13); P3 runs through pleasure-versus-Hellfire, the doubled Day-of-Recompense question and the closing absolute-sovereignty statement (13-19).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (82:1-5) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Four cosmic upheavals culminating in each soul's knowledge of its forwarded and withheld deeds", keys: ["82:1","82:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Sky breaking, stars scattering, seas erupting and graves emptied as the dissolution sequence", keys: ["82:1","82:2","82:3","82:4"], evidenceClass: "EXPLICIT_TEXT" });

  const infitar = findWord(1, ["\u0627","\u0646","\u0641","\u0637","\u0631"]);
  if (infitar) e.terminology.push({ term: infitar, transliteration: "infatarat", gloss: "broke apart (editorial gloss)", keys: ["82:1"] });
  const qubur = findWord(4, ["\u0642","\u0628","\u0648","\u0631"]);
  if (qubur) e.terminology.push({ term: qubur, transliteration: "al-qubur", gloss: "the graves (editorial gloss)", keys: ["82:4"] });
}

// === POPULATE P2 (82:6-12) ===
{
  const e = extractions[1];
  const kareem = findWord(6, ["\u0643","\u0631","\u064a","\u0645"]);
  if (kareem) e.divineNamesAndAttributes.push({ term: kareem, transliteration: "Kareem", gloss: "Generous (editorial gloss)", keys: ["82:6"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Deception concerning the Generous Lord despite creation, proportioning and balancing", keys: ["82:6","82:7","82:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Denial of the Recompense despite appointed recording keepers", keys: ["82:9","82:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Form assembled according to divine will rather than human choice", keys: ["82:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Noble recording keepers knowing every deed", keys: ["82:10","82:11","82:12"], evidenceClass: "EXPLICIT_TEXT" });

  const hafazah = findWord(10, ["\u062d","\u0641","\u0638"]);
  if (hafazah) e.terminology.push({ term: hafazah, transliteration: "hafazah", gloss: "keepers/guardians (editorial gloss)", keys: ["82:10"] });
  const katibeen = findWord(11, ["\u0643","\u0627","\u062a","\u0628"]);
  if (katibeen) e.terminology.push({ term: katibeen, transliteration: "katibin", gloss: "recording scribes (editorial gloss)", keys: ["82:11"] });
}

// === POPULATE P3 (82:13-19) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Righteous in pleasure versus wicked burning in Hellfire without absence", keys: ["82:13","82:14","82:15","82:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Absolute inability of any soul to act for another on that Day", keys: ["82:19"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Doubled rhetorical question emphasising the Day of Recompense's gravity", keys: ["82:17","82:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The command on that Day resting entirely with Allah", keys: ["82:19"], evidenceClass: "EXPLICIT_TEXT" });

  const naeem = findWord(13, ["\u0646","\u0639","\u064a","\u0645"]);
  if (naeem) e.terminology.push({ term: naeem, transliteration: "na'im", gloss: "pleasure/bliss (editorial gloss)", keys: ["82:13"] });
  const jaheem = findWord(14, ["\u062c","\u062d","\u064a","\u0645"]);
  if (jaheem) e.terminology.push({ term: jaheem, transliteration: "jahim", gloss: "Hellfire/blaze (editorial gloss)", keys: ["82:14"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `082-al-infitar-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 082-al-infitar-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-082-p1,ext-082-p2,ext-082-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1910", label: "Four-fold dissolution ending in soul-knowledge of forwarded and withheld deeds", def: "In 82:1-5: When the sky breaks apart and when the stars fall scattering and when the seas are erupted and when the contents of graves are scattered; a soul will then know what it has put forth and kept back.", key: "82:1", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Infatarat intatharat buhhirat bu'thirat."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Qaddamat wa-akhkharat disclosed."}] },
  { id: "cand-1911", label: "Deception concerning the Generous Lord who created, proportioned and balanced", def: "In 82:6-8: O mankind what has deceived you concerning your Lord the Generous who created you proportioned you and balanced you; in whatever form He willed has He assembled you.", key: "82:6", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Rabb al-Karim named."},{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Khalaqa sawwa 'adala tarkib."}] },
  { id: "cand-1912", label: "Noble recording keepers appointed despite denial of Recompense", def: "In 82:9-12: No but you deny the Recompense; and indeed appointed over you are keepers noble and recording; they know whatever you do.", key: "82:9", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Hafazah kiraman katibin."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ya'lamuna ma taf'alun."}] },
  { id: "cand-1913", label: "Righteous in pleasure versus wicked burning without absence", def: "In 82:13-16: Indeed the righteous will be in pleasure and indeed the wicked will be in Hellfire; they will enter to burn therein on the Day of Recompense and never therefrom will they be absent.", key: "82:13", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Abrar fi na'im fujjar fi jahim."},{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Ma hum 'anha bi-gha'ibin permanence."}] },
  { id: "cand-1914", label: "No soul possessing power for another; command entirely with Allah", def: "In 82:17-19: And what can make you know what is the Day of Recompense; then what can make you know what is the Day of Recompense; it is the Day when a soul will not possess for another soul power to do a thing and the command that Day is entirely with Allah.", key: "82:17", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"La tamliku nafs li-nafs shay'an."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Al-amr yawma'idhin lillah."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `082-al-infitar-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-106.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-106.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");