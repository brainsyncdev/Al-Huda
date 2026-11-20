// MFD-11 Wave 9: Surah 62 (Al-Jumu'ah) genuine re-extraction.
// Covers 62:1-11 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "062-0001-0011.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 62:${n} not found`);
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

console.log("Generating Surah 62 (Al-Jumu'ah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T18:25:00.000Z";

const PASSAGES = [
  { id: "ext-062-p1", from: 1, to: 4,
    label: "Whatever heavens earth exalting Allah Sovereign Pure Exalted Might Wise; He sent among unlettered Messenger from themselves reciting verses purifying teaching Book wisdom although before clear error; and others not yet joined them Exalted Might Wise; that bounty Allah gives whom wills possessor great bounty",
    mainLabel: "Universal tasbih affirming the Sovereign, Pure, Mighty and Wise; the sending among the unlettered of a Messenger from themselves who recites His verses, purifies them and teaches the Book and wisdom despite their prior clear error; this mission extending to others not yet joined, under might and wisdom; all named as Allah's bounty given by will to the possessor of great bounty" },
  { id: "ext-062-p2", from: 5, to: 8,
    label: "example those entrusted Torah then did not take it on like donkey carries volumes books; wretched example people deny signs Allah; Allah does not guide wrongdoing; say O Jews if claim allies Allah excluding other people wish death if truthful; but not wish ever because what hands put forth; Allah Knowing wrongdoers; say indeed death flee from indeed meet you; returned Knower unseen witnessed inform about what used do",
    mainLabel: "Those entrusted with the Torah who failed to carry it likened to a donkey bearing volumes of books — a wretched example for deniers of Allah's signs, whom He does not guide; the challenge to those claiming exclusive alliance with Allah to wish for death if truthful, knowing they never will because of what their hands have earned under His knowledge of wrongdoers; the declaration that the death they flee will inevitably meet them, after which they return to the Knower of unseen and witnessed who discloses their deeds" },
  { id: "ext-062-p3", from: 9, to: 11,
    label: "O believed when adhan called prayer day Jumuah proceed remembrance Allah leave trade better only knew; when prayer concluded disperse within land seek bounty Allah remember often succeed; but saw transaction diversion rushed left standing; say what with Allah better than diversion transaction Allah best providers",
    mainLabel: "Believers commanded to proceed to Allah's remembrance and leave trade when the Friday call is made, since that is better if they knew; dispersal through the land to seek Allah's bounty permitted after prayer concludes, with frequent remembrance urged for success; rebuke for rushing toward trade or diversion while leaving the Prophet standing, answered by declaring what is with Allah better than either, since He is the best of providers" }
];

const SUB_LABELS = {
  "ext-062-p1": [
    "All in heavens and earth exalting Allah, the Sovereign, the Pure, the Exalted in Might, the Wise",
    "He sent among the unlettered a Messenger from themselves reciting verses, purifying them and teaching the Book and wisdom despite prior clear error",
    "This mission extending to others not yet joined them, under His might and wisdom",
    "All of it named Allah's bounty given by will to the possessor of great bounty"
  ],
  "ext-062-p2": [
    "Those entrusted with the Torah who failed to carry it likened to a donkey bearing volumes of books — a wretched example for deniers of Allah's signs whom He does not guide",
    "The challenge to those claiming exclusive alliance with Allah to wish for death if truthful",
    "They will never wish for it because of what their hands have earned, under His knowledge of wrongdoers",
    "The death they flee will inevitably meet them, returning them to the Knower of unseen and witnessed who discloses their deeds"
  ],
  "ext-062-p3": [
    "Believers commanded to proceed to remembrance and leave trade when the Friday call is made, since that is better",
    "Dispersal through the land to seek Allah's bounty permitted after prayer, with frequent remembrance urged for success",
    "Rebuke for rushing toward trade or diversion while leaving the Prophet standing, answered by declaring what is with Allah better since He is the best of providers"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`62:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`62:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 62, surahName: "Al-Jumu'ah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the bounty declaration (4) before the Torah-donkey parable opens (5); P2 ends with the inevitable-death disclosure (8) before the Friday command begins (9); P3 covers the Jumu'ah obligation, post-prayer dispersal and the trade-diversion rebuke (9-11).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (62:1-4) ===
{
  const e = extractions[0];
  const malik = findWord(1, ["\u0645","\u0644","\u0643"]);
  const quddus = findWord(1, ["\u0642","\u062f","\u0648","\u0633"]);
  const aziz = findWord(1, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(1, ["\u062d","\u0643","\u064a","\u0645"]);
  if (malik) e.divineNamesAndAttributes.push({ term: malik, transliteration: "Malik", gloss: "Sovereign (editorial gloss)", keys: ["62:1"] });
  if (quddus) e.divineNamesAndAttributes.push({ term: quddus, transliteration: "Quddus", gloss: "Pure (editorial gloss)", keys: ["62:1"] });
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["62:1"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["62:1"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Prior state of clear error before the Messenger's arrival", keys: ["62:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Messenger sent among the unlettered from themselves to recite, purify and teach", keys: ["62:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Universal tasbih opening the surah with four divine names", keys: ["62:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Mission extending to others not yet joined, framed entirely as divine bounty", keys: ["62:3","62:4"], evidenceClass: "EXPLICIT_TEXT" });

  const ummiyyin = findWord(2, ["\u0623","\u0645","\u064a"]);
  if (ummiyyin) e.terminology.push({ term: ummiyyin, transliteration: "ummiyyin", gloss: "the unlettered (editorial gloss)", keys: ["62:2"] });
}

// === POPULATE P2 (62:5-8) ===
{
  const e = extractions[1];
  const aleem = findWord(8, ["\u0639","\u0644","\u064a","\u0645"]);
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["62:8"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["62:6"], excerpt: fv(6), description: "Say: O you who are Jews, if you claim that you are allies of Allah excluding other people, then wish for death if you should be truthful." });

  e.humanConditionsAndSpiritualStates.push({ label: "Entrusted with the Torah yet failing to carry it, likened to a burden-bearing donkey", keys: ["62:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Claiming exclusive alliance with Allah yet unable to wish for death due to earned deeds", keys: ["62:6","62:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Fleeing from a death that will inevitably meet them", keys: ["62:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Denial of Allah's signs earning the wretched-example verdict and withheld guidance", keys: ["62:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Return to the Knower of unseen and witnessed who discloses all past deeds", keys: ["62:8"], evidenceClass: "EXPLICIT_TEXT" });

  const himar = findWord(5, ["\u062d","\u0645","\u0627","\u0631"]);
  if (himar) e.terminology.push({ term: himar, transliteration: "himar", gloss: "donkey (editorial gloss)", keys: ["62:5"] });
  const asfar = findWord(5, ["\u0623","\u0633","\u0641","\u0627","\u0631"]);
  if (asfar) e.terminology.push({ term: asfar, transliteration: "asfar", gloss: "volumes/books (editorial gloss)", keys: ["62:5"] });
}

// === POPULATE P3 (62:9-11) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["62:9"], excerpt: fv(9), description: "When the call is made for prayer on the day of Jumu'ah, proceed to the remembrance of Allah and leave trade." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["62:10"], excerpt: fv(10), description: "When the prayer has been concluded, disperse within the land and seek from the bounty of Allah, and remember Allah often." });

  e.humanConditionsAndSpiritualStates.push({ label: "Rushing toward trade or diversion while leaving the Prophet standing", keys: ["62:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Friday congregational prayer requiring cessation of trade until its conclusion", keys: ["62:9","62:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Post-prayer dispersal for seeking livelihood balanced by frequent remembrance", keys: ["62:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "What is with Allah declared better than diversion or trade, with Him as the best of providers", keys: ["62:11"], evidenceClass: "EXPLICIT_TEXT" });

  const jumuah = findWord(9, ["\u062c","\u0645","\u0639"]);
  if (jumuah) e.terminology.push({ term: jumuah, transliteration: "jumu'ah", gloss: "Friday/congregation (editorial gloss)", keys: ["62:9"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `062-al-jumuah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 062-al-jumuah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-062-p1,ext-062-p2,ext-062-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1748", label: "Four-name tasbih opening grounding the unlettered Messenger's commission", def: "In 62:1-2: Whatever is in the heavens and earth is exalting Allah, the Sovereign, the Pure, the Exalted in Might, the Wise; it is He who has sent among the unlettered a Messenger from themselves reciting to them His verses and purifying them and teaching them the Book and wisdom although they were before in clear error.", key: "62:1", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Malik Quddus Aziz Hakeem quartet."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Ummi messenger profile."}] },
  { id: "cand-1749", label: "Mission extending beyond contemporaries framed entirely as divine bounty", def: "In 62:3-4: And to others of them who have not yet joined them; and He is the Exalted in Might, the Wise; that is the bounty of Allah which He gives to whom He wills and Allah is the possessor of great bounty.", key: "62:3", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Fadl Allah universal scope."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"related-not-identical",note:"Later generations included."}] },

  { id: "cand-1750", label: "Torah-bearers who failed to carry it likened to a book-laden donkey", def: "In 62:5: The example of those who were entrusted with the Torah and then did not take it on is like that of a donkey who carries volumes of books; wretched is the example of the people who deny the signs of Allah.", key: "62:5", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Carrying without comprehension."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Mathal al-himar."}] },
  { id: "cand-1751", label: "Exclusive-alliance claim tested by the death-wish challenge", def: "In 62:6-7: Say O you who are Jews if you claim that you are allies of Allah excluding other people then wish for death if you should be truthful; but they will not wish for it ever because of what their hands have put forth.", key: "62:6", overlap: [{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Tamanni al-mawt test."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Bima qaddamat aydihim."}] },
  { id: "cand-1752", label: "Death fleeing futile with return to the Knower of unseen and witnessed", def: "In 62:8: Say indeed the death from which you flee, indeed it will meet you; then you will be returned to the Knower of the unseen and the witnessed and He will inform you about what you used to do.", key: "62:8", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ila 'alim al-ghayb return."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ghayb and shahadah encompassed."}] },

  { id: "cand-1753", label: "Jumu'ah obligation: leave trade for remembrance, disperse after prayer", def: "In 62:9-10: O you who have believed when the call is made for prayer on the day of Jumu'ah then proceed to the remembrance of Allah and leave trade, that is better for you if you only knew; and when the prayer has been concluded disperse within the land and seek from the bounty of Allah and remember Allah often that you may succeed.", key: "62:9", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Salat al-jumu'ah legislation."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr kathir for falah."}] },
  { id: "cand-1754", label: "Trade and diversion subordinated to what is with Allah as best provider", def: "In 62:11: But when they saw a transaction or a diversion they rushed to it and left you standing; say what is with Allah is better than diversion and than a transaction, and Allah is the best of providers.", key: "62:11", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Adab with the Prophet during khutbah."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Khayr al-razikin priority."}] }
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
    notes: "Wave 9 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 7).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `062-al-jumuah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-086.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-086.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");