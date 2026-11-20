// MFD-11 Wave 12: Surah 84 (Al-Inshiqaq) genuine re-extraction.
// Covers 84:1-25 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "084-0001-0025.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 84:${n} not found`);
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

console.log("Generating Surah 84 (Al-Inshiqaq) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T22:05:00.000Z";

const PASSAGES = [
  { id: "ext-084-p1", from: 1, to: 6,
    label: "sky split open responded Lord obligated; earth extended cast out within relinquished responded Lord obligated; O mankind laboring toward Lord great exertion will meet it",
    mainLabel: "The sky splitting open and responding to its Lord as obligated, the earth extended casting out what is within it and relinquishing it while likewise responding to its Lord; mankind addressed as labouring toward their Lord with great exertion and destined to meet that labour" },
  { id: "ext-084-p2", from: 7, to: 15,
    label: "given record right hand judged easy account return people happiness; given record behind back cry destruction enter burn Blaze; once among people happiness thought never return Allah; But yes Lord ever of him Seeing",
    mainLabel: "The right-hand record-holder judged with an easy account returning to his people in happiness, contrasted with the one given his record behind his back who cries out for destruction and enters to burn in a Blaze; his prior happiness among his people and assumption that he would never return exposed by the affirmation that his Lord was ever Seeing of him" },
  { id: "ext-084-p3", from: 16, to: 25,
    label: "swear twilight glow night what envelops moon becomes full; surely experience state after state; what matter not believe; Quran recited not prostrate; disbelieved deny; Allah most knowing what keep within; give tidings painful punishment; except believe righteous deeds reward uninterrupted",
    mainLabel: "Oaths by the twilight glow, the night and what it envelops, and the moon when full, establishing that they will surely experience state after state; their failure to believe questioned along with their refusal to prostrate when the Quran is recited; disbelievers denying while Allah knows best what they conceal within, told to receive tidings of painful punishment — except those who believe and do righteous deeds, for whom the reward is uninterrupted" }
];

const SUB_LABELS = {
  "ext-084-p1": [
    "The sky splitting open",
    "Responding to its Lord as obligated to do so",
    "The earth being extended",
    "Casting out what is within it and relinquishing it",
    "The earth likewise responding to its Lord as obligated",
    "Mankind labouring toward their Lord with great exertion and destined to meet it"
  ],
  "ext-084-p2": [
    "The one given his record in his right hand",
    "Judged with an easy account",
    "Returning to his people in happiness",
    "The one given his record behind his back",
    "Crying out for destruction",
    "Entering to burn in a Blaze",
    "His prior happiness among his people recalled",
    "His assumption that he would never return to Allah",
    "The correction: his Lord was ever Seeing of him"
  ],
  "ext-084-p3": [
    "Oath sworn by the twilight glow",
    "And by the night and what it envelops",
    "And by the moon when it becomes full",
    "They will surely experience state after state",
    "Their failure to believe questioned",
    "Refusal to prostrate when the Quran is recited to them",
    "Disbelievers persisting in denial",
    "Allah most knowing of what they keep within themselves",
    "Tidings of painful punishment commanded for them",
    "Exception for believers doing righteous deeds whose reward is uninterrupted"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`84:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`84:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 84, surahName: "Al-Inshiqaq",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the labour-toward-the-Lord address (6) before the two-record contrast opens (7); P2 ends with the Lord-was-Seeing correction (15) before the twilight-night-moon oaths begin (16); P3 runs through the state-after-state declaration, prostration refusal, concealed-knowledge affirmation, punishment tidings and the believing exception (16-25).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (84:1-6) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Human life framed as exerted labour toward the Lord that will be met", keys: ["84:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Sky and earth both responding to their Lord as obligated at the dissolution", keys: ["84:1","84:2","84:3","84:4","84:5"], evidenceClass: "EXPLICIT_TEXT" });

  const inshiqaq = findWord(1, ["\u0627","\u0646","\u0634","\u0642"]);
  if (inshiqaq) e.terminology.push({ term: inshiqaq, transliteration: "inshaqqat", gloss: "split open (editorial gloss)", keys: ["84:1"] });
  const kadh = findWord(6, ["\u0643","\u0627","\u062f","\u062d"]);
  if (kadh) e.terminology.push({ term: kadh, transliteration: "kadih", gloss: "labouring with exertion (editorial gloss)", keys: ["84:6"] });
}

// === POPULATE P2 (84:7-15) ===
{
  const e = extractions[1];
  const baseer = findWord(15, ["\u0628","\u0635","\u064a","\u0631"]);
  if (baseer) e.divineNamesAndAttributes.push({ term: baseer, transliteration: "Baseer", gloss: "Seeing (editorial gloss)", keys: ["84:15"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Easy account and happy return for the right-hand record-holder", keys: ["84:7","84:8","84:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Cry for destruction and burning for the one given his record behind his back", keys: ["84:10","84:11","84:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Worldly happiness paired with the assumption of no return exposed by divine sight", keys: ["84:13","84:14","84:15"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Record position determining the mode of reckoning and its emotional outcome", keys: ["84:7","84:10"], evidenceClass: "EXPLICIT_TEXT" });

  const yameen = findWord(7, ["\u064a","\u0645","\u064a","\u0646"]);
  if (yameen) e.terminology.push({ term: yameen, transliteration: "bi-yaminihi", gloss: "in his right hand (editorial gloss)", keys: ["84:7"] });
  const saeer = findWord(12, ["\u0633","\u0639","\u064a","\u0631"]);
  if (saeer) e.terminology.push({ term: saeer, transliteration: "sa'ir", gloss: "a Blaze (editorial gloss)", keys: ["84:12"] });
}

// === POPULATE P3 (84:16-25) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["84:24"], excerpt: fv(24), description: "So give them tidings of a painful punishment." });

  e.humanConditionsAndSpiritualStates.push({ label: "State after state guaranteed as the human trajectory", keys: ["84:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Refusal to prostrate when the Quran is recited identified as disbelief in practice", keys: ["84:20","84:21","84:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Uninterrupted reward reserved for believers doing righteous deeds", keys: ["84:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Twilight, enveloping night and full moon sworn by to establish successive states", keys: ["84:16","84:17","84:18","84:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Allah most knowing of what deniers keep within themselves", keys: ["84:23"], evidenceClass: "EXPLICIT_TEXT" });

  const shafaq = findWord(16, ["\u0634","\u0641","\u0642"]);
  if (shafaq) e.terminology.push({ term: shafaq, transliteration: "al-shafaq", gloss: "the twilight glow (editorial gloss)", keys: ["84:16"] });
  const tabaq = findWord(19, ["\u0637","\u0628","\u0642"]);
  if (tabaq) e.terminology.push({ term: tabaq, transliteration: "tabaqan 'an tabaq", gloss: "state after state (editorial gloss)", keys: ["84:19"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `084-al-inshiqaq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 084-al-inshiqaq-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-084-p1,ext-084-p2,ext-084-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1920", label: "Sky and earth responding to their Lord as obligated at dissolution", def: "In 84:1-5: When the sky has split open and has responded to its Lord and was obligated to do so; and when the earth has been extended and has cast out that within it and relinquished it and has responded to its Lord and was obligated to do so.", key: "84:1", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Inshiqaq and madd sequence."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Adhinat li-rabbiha wa-huqqat."}] },
  { id: "cand-1921", label: "Human life as exerted labour toward the Lord that will be met", def: "In 84:6: O mankind indeed you are laboring toward your Lord with great exertion and will meet it.", key: "84:6", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Kadh ila rabbika fa-mulaqih."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Meeting the labour itself."}] },

  { id: "cand-1922", label: "Record position determining easy account or cry for destruction", def: "In 84:7-12: Then as for he who is given his record in his right hand he will be judged with an easy account and return to his people in happiness; but as for he who is given his record behind his back he will cry out for destruction and enter to burn in a Blaze.", key: "84:7", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Hisab yasir versus thubur."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Two emotional outcomes."}] },
  { id: "cand-1923", label: "Assumption of no return corrected by the Lord's constant sight", def: "In 84:13-15: Indeed he had once been among his people in happiness; indeed he had thought he would never return to Allah; but yes indeed his Lord was ever of him Seeing.", key: "84:13", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Kana bihi basira."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Zanna an lan yahur refuted."}] },

  { id: "cand-1924", label: "Twilight-night-moon oaths establishing successive states", def: "In 84:16-19: So I swear by the twilight glow and by the night and what it envelops and by the moon when it becomes full; that you will surely experience state after state.", key: "84:16", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Shafaq layl qamar triad."},{topicId:"human-creation",layer:"scholarly",relationship:"related-not-identical",note:"Tabaqan 'an tabaq as staged existence."}] },
  { id: "cand-1925", label: "Prostration refusal at recitation with uninterrupted reward for believers", def: "In 84:20-25: So what is the matter with them that they do not believe and when the Quran is recited to them they do not prostrate; but those who have disbelieved deny and Allah is most knowing of what they keep within themselves; so give them tidings of a painful punishment except for those who believe and do righteous deeds for them is a reward uninterrupted.", key: "84:20", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Sujud al-tilawah implied."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ajr ghayr mamnun exception."}] }
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
extractions[2].topicCandidateIds = candidates.candidates.slice(4, 6).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `084-al-inshiqaq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-108.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-108.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");