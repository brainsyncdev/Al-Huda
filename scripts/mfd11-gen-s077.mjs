// MFD-11 Wave 11: Surah 77 (Al-Mursalat) genuine re-extraction.
// Covers 77:1-50 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "077-0001-0050.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 77:${n} not found`);
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

console.log("Generating Surah 77 (Al-Mursalat) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T20:55:00.000Z";

const PASSAGES = [
  { id: "ext-077-p1", from: 1, to: 15,
    label: "By winds sent forth gusts; winds blow violently; winds spread clouds; angels bring criterion; angels deliver message justification warning; Indeed what promised occur; stars obliterated; heaven opened; mountains blown away; messengers time come; what Day postponed; Day Judgement; what make know Day Judgement; Woe Day deniers",
    mainLabel: "Oaths by winds sent forth in gusts, violent winds, cloud-spreading winds, criterion-bringing angels and message-delivering angels carrying justification or warning; what is promised will certainly occur when stars are obliterated, heaven opened, mountains blown away and the messengers' appointed time arrives; for what Day was it postponed — the Day of Judgement whose gravity is questioned; woe that Day to the deniers" },
  { id: "ext-077-p2", from: 16, to: 28,
    label: "Did We not destroy former peoples; then follow later ones; thus deal criminals; Woe Day deniers; Did We not create you liquid disdained; placed firm lodging; known extent; determined excellent determine; Woe Day deniers; Have We not made earth container living dead; placed lofty firmly set mountains given drink sweet water; Woe Day deniers",
    mainLabel: "Former peoples destroyed and later ones following as the pattern for dealing with criminals — woe that Day to the deniers; creation from a disdained liquid placed in a firm lodging for a known extent, determined by One excellent at determining — woe that Day to the deniers; the earth made a container for living and dead with lofty firmly-set mountains and sweet water provided — woe that Day to the deniers" },
  { id: "ext-077-p3", from: 29, to: 40,
    label: "Proceed that used deny; proceed shadow smoke three columns; no cool shade availing not against flame; throws sparks huge fortress; yellowish black camels; Woe Day deniers; Day not speak; nor permitted make excuse; Woe Day deniers; Day Judgement assembled you former peoples; if have plan plan against Me; Woe Day deniers",
    mainLabel: "The command to proceed toward what they denied — a three-columned smoke-shadow offering no cool shade and no protection against flames that throw fortress-sized sparks like yellowish-black camels; woe that Day to the deniers on a Day when they cannot speak nor are permitted to offer excuses; this is the Day of Judgement assembling them with former peoples — if they have a plan let them plan against Allah; woe that Day to the deniers" },
  { id: "ext-077-p4", from: 41, to: 50,
    label: "Indeed righteous among shades springs; fruits whatever desire; eat drink satisfaction used do; Indeed thus reward doers good; Woe Day deniers; O disbelievers eat enjoy little indeed criminals; Woe Day deniers; said Bow prayer not bow; Woe Day deniers; what statement after Quran believe",
    mainLabel: "The righteous among shades and springs with whatever fruits they desire, told to eat and drink in satisfaction for their deeds since this is how doers of good are rewarded — woe that Day to the deniers; disbelievers told to eat and enjoy briefly since they are criminals — woe that Day to the deniers; those who refuse to bow when commanded to pray — woe that Day to the deniers; closing challenge asking in what statement after the Quran they will believe" }
];

const SUB_LABELS = {
  "ext-077-p1": [
    "Winds sent forth in gusts sworn by",
    "Violent winds sworn by",
    "Cloud-spreading winds sworn by",
    "Criterion-bringing angels sworn by",
    "Message-delivering angels sworn by",
    "Carrying justification or warning as their function",
    "What is promised declared certain to occur",
    "Stars obliterated at its onset",
    "Heaven opened",
    "Mountains blown away",
    "The messengers' appointed time arriving",
    "For what Day was all this postponed",
    "For the Day of Judgement itself",
    "Its gravity questioned rhetorically",
    "Woe that Day to the deniers — first refrain after the Day-of-Judgement question"
  ],
  "ext-077-p2": [
    "Former peoples destroyed as precedent",
    "Later ones following in the same pattern",
    "This is how We deal with criminals",
    "Woe that Day to the deniers — second refrain after the destruction pattern",
    "Creation from a disdained liquid recalled",
    "Placed in a firm lodging",
    "For a known extent",
    "Determined by One excellent at determining",
    "Woe that Day to the deniers — third refrain after embryological determination",
    "Earth made a container",
    "For both the living and the dead",
    "Lofty firmly-set mountains placed and sweet water provided",
    "Woe that Day to the deniers — fourth refrain after earth-container provision"
  ],
  "ext-077-p3": [
    "Command to proceed toward what they used to deny",
    "A shadow of smoke having three columns",
    "No cool shade and no protection against the flame",
    "Sparks thrown as huge as a fortress",
    "Like yellowish-black camels",
    "Woe that Day to the deniers — fifth refrain after the smoke-shadow description",
    "A Day on which they will not speak",
    "Nor be permitted to offer any excuse",
    "Woe that Day to the deniers — sixth refrain after speechlessness and excuse-prohibition",
    "The Day of Judgement assembling them with former peoples",
    "Challenge: if you have a plan then plan against Me",
    "Woe that Day to the deniers — seventh refrain after the planning challenge"
  ],
  "ext-077-p4": [
    "The righteous among shades and springs",
    "Fruits from whatever they desire",
    "Eat and drink in satisfaction for what you used to do",
    "This is how We reward the doers of good",
    "Woe that Day to the deniers — eighth refrain after the righteous reward",
    "Disbelievers told to eat and enjoy briefly since they are criminals",
    "Woe that Day to the deniers — ninth refrain after brief criminal enjoyment",
    "Refusal to bow when commanded to pray",
    "Woe that Day to the deniers — tenth refrain after prayer refusal",
    "Closing challenge: in what statement after the Quran will they believe"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`77:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`77:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 77, surahName: "Al-Mursalat",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 11 genuine re-extraction. Boundaries follow the text: P1 closes with the first 'woe to the deniers' refrain after the Day-of-Judgement question (15) before the destruction-and-creation proofs block opens (16); P2 ends with the third 'woe' refrain after the earth-container argument (28) before the punishment-scene command begins (29); P3 runs through the smoke-shadow description, speech prohibition, assembly and planning challenge ending with the sixth 'woe' (40); P4 covers the righteous reward, criminal brief-enjoyment, prayer-refusal and closing Quran-challenge with remaining 'woe' refrains (41-50).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (77:1-15) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Cosmic dissolution — obliterated stars, opened heaven, blown-away mountains — heralding the promised Day", keys: ["77:8","77:9","77:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Five-fold oath by winds and angels grounding the certainty of what is promised", keys: ["77:1","77:2","77:3","77:4","77:5","77:6","77:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Messengers' appointed time arriving as the trigger for the Day of Judgement", keys: ["77:11","77:12","77:13"], evidenceClass: "EXPLICIT_TEXT" });

  const mursalat = findWord(1, ["\u0645","\u0631","\u0633","\u0644"]);
  if (mursalat) e.terminology.push({ term: mursalat, transliteration: "al-mursalat", gloss: "those sent forth (editorial gloss)", keys: ["77:1"] });
  const furqan = findWord(4, ["\u0641","\u0631","\u0642"]);
  if (furqan) e.terminology.push({ term: furqan, transliteration: "farqan", gloss: "criterion/distinction (editorial gloss)", keys: ["77:4"] });
}

// === POPULATE P2 (77:16-28) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Former peoples destroyed with later ones following as the criminal-dealing pattern", keys: ["77:16","77:17","77:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Creation from disdained liquid in a firm lodging for a known extent demonstrating divine determination", keys: ["77:20","77:21","77:22","77:23"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Earth as container for living and dead with mountains and sweet water as provisions", keys: ["77:25","77:26","77:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Repeated 'woe to the deniers' refrain punctuating each proof-block", keys: ["77:19","77:24","77:28"], evidenceClass: "EXPLICIT_TEXT" });

  const nutfah = findWord(20, ["\u0645","\u0627","\u0621"]);
  // Using 'liquid disdained' reference
  const mahin = findWord(20, ["\u0645","\u0647","\u064a","\u0646"]);
  if (mahin) e.terminology.push({ term: mahin, transliteration: "ma' mahin", gloss: "disdained liquid (editorial gloss)", keys: ["77:20"] });
  const qarar = findWord(21, ["\u0642","\u0631","\u0627","\u0631"]);
  if (qarar) e.terminology.push({ term: qarar, transliteration: "qarar makin", gloss: "firm lodging (editorial gloss)", keys: ["77:21"] });
}

// === POPULATE P3 (77:29-40) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["77:29"], excerpt: fv(29), description: "Proceed to that which you used to deny." });

  e.humanConditionsAndSpiritualStates.push({ label: "Three-columned smoke-shadow offering no shade and no protection against fortress-sized sparks", keys: ["77:30","77:31","77:32","77:33"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Speechlessness and excuse-prohibition on the Day of assembly with former peoples", keys: ["77:35","77:36","77:38"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Challenge to plan against Allah issued to those assembled for judgement", keys: ["77:39"], evidenceClass: "EXPLICIT_TEXT" });

  const zillal = findWord(30, ["\u0638","\u0644","\u0644"]);
  if (zillal) e.terminology.push({ term: zillal, transliteration: "zill min yahmum", gloss: "shadow of smoke (editorial gloss)", keys: ["77:30"] });
  const sharar = findWord(32, ["\u0634","\u0631","\u0631"]);
  if (sharar) e.terminology.push({ term: sharar, transliteration: "sharar ka'l-qasr", gloss: "sparks like a fortress (editorial gloss)", keys: ["77:32"] });
}

// === POPULATE P4 (77:41-50) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["77:48"], excerpt: fv(48), description: "Bow in prayer — a command they refused." });

  e.humanConditionsAndSpiritualStates.push({ label: "Righteous rewarded with shades, springs, desired fruits and satisfied eating for their deeds", keys: ["77:41","77:42","77:43","77:44"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Brief enjoyment granted to criminals before their reckoning", keys: ["77:46"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prayer refusal identified as grounds for woe alongside denial", keys: ["77:48"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Doers of good rewarded as a stated divine principle", keys: ["77:44"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Closing challenge: no statement after the Quran can serve as belief-ground", keys: ["77:50"], evidenceClass: "EXPLICIT_TEXT" });

  const muhsinin = findWord(44, ["\u0645","\u062d","\u0633","\u0646"]);
  if (muhsinin) e.terminology.push({ term: muhsinin, transliteration: "muhsinin", gloss: "doers of good (editorial gloss)", keys: ["77:44"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `077-al-mursalat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 077-al-mursalat-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-077-p1,ext-077-p2,ext-077-p3,ext-077-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1874", label: "Five-fold oath by winds and angels guaranteeing the promised Day", def: "In 77:1-7: By those winds sent forth in gusts and the winds that blow violently and the winds that spread clouds and those angels who bring criterion and those angels who deliver a message as justification or warning; indeed what you are promised is to occur.", key: "77:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Qasam quintuple structure."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Farq and ilqa' functions."}] },
  { id: "cand-1875", label: "Cosmic dissolution sequence preceding the Day of Judgement", def: "In 77:8-14: So when the stars are obliterated and when the heaven is opened and when the mountains are blown away and when the messengers' time has come; for what Day was it postponed; for the Day of Judgement; and what can make you know what is the Day of Judgement.", key: "77:8", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Tams al-nujum wa-tafattuh al-sama'."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Yawm al-fasl defined."}] },

  { id: "cand-1876", label: "Destruction of former and later peoples as the criminal-dealing pattern", def: "In 77:16-19: Did We not destroy the former peoples; then We will follow them with the later ones; thus do We deal with the criminals; woe that Day to the deniers.", key: "77:16", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Ihlak al-awwalin wa'l-akhirin."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Pattern applied universally."}] },
  { id: "cand-1877", label: "Embryological creation from disdained liquid in firm lodging for known extent", def: "In 77:20-24: Did We not create you from a liquid disdained; and We placed it in a firm lodging; for a known extent; and We determined it and excellent are We to determine.", key: "77:20", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Ma' mahin fi qarar makin."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Ni'm al-qadirun affirmed."}] },
  { id: "cand-1878", label: "Earth as container for living and dead with mountains and sweet water", def: "In 77:25-28: Have We not made the earth a container of the living and the dead; and We placed therein lofty firmly set mountains and have given you to drink sweet water; woe that Day to the deniers.", key: "77:25", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ardu kifatan and rawasiya."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Ma' furat as provision."}] },

  { id: "cand-1879", label: "Three-columned smoke-shadow with fortress-sized sparks as punishment environment", def: "In 77:29-34: Proceed to that which you used to deny; proceed to a shadow of smoke having three columns; no cool shade and availing not against the flame; indeed it throws sparks as huge as a fortress as if they were yellowish black camels.", key: "77:29", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Zill thalath shu'ab imagery."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Sharar ka'l-qasr scale."}] },
  { id: "cand-1880", label: "Speechlessness and excuse-prohibition on the assembly Day", def: "In 77:35-37: This is a Day they will not speak; nor will it be permitted for them to make an excuse; woe that Day to the deniers.", key: "77:35", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"La yantiqun wa-la yu'dhan lahum."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Silence as verdict."}] },

  { id: "cand-1881", label: "Righteous rewarded with shades, springs and desired fruits for their deeds", def: "In 77:41-44: Indeed the righteous will be among shades and springs and fruits from whatever they desire; being told eat and drink in satisfaction for what you used to do; indeed We thus reward the doers of good.", key: "77:41", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Zilal wa-'uyun wa-fakihah."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Jaza' linked to amal."}] },

  { id: "cand-1882", label: "Closing challenge: no statement after the Quran warrants belief", def: "In 77:50: Then in what statement after the Quran will they believe.", key: "77:50", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Finality of Quran as hujjah."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Rejection exhausts alternatives."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 7).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(7, 9).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `077-al-mursalat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-101.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-101.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");