// MFD-11 Wave 12: Surah 87 (Al-A'la) genuine re-extraction.
// Covers 87:1-19 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "087-0001-0019.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 87:${n} not found`);
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

console.log("Generating Surah 87 (Al-A'la) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T22:35:00.000Z";

const PASSAGES = [
  { id: "ext-087-p1", from: 1, to: 5,
    label: "Exalt name Lord Most High; created proportioned; destined then guided; brings out pasture; then makes black stubble",
    mainLabel: "The command to exalt the name of the Lord, the Most High, who created and proportioned, destined and then guided, bringing out the pasture before reducing it to black stubble — the full cycle of creation, guidance and decay attributed to Him" },
  { id: "ext-087-p2", from: 6, to: 13,
    label: "make you recite Muhammad not forget; except Allah will Indeed knows declared hidden; ease you toward ease; remind if reminder benefit; fears Allah reminded; wretched avoid it; enter burn greatest Fire; neither dying therein nor living",
    mainLabel: "The Prophet assured he will be made to recite without forgetting except what Allah wills, since He knows both the declared and the hidden; easing promised toward ease; the reminder commanded where it benefits, received by the God-fearing but avoided by the wretched one who will burn in the greatest Fire, neither dying therein nor living" },
  { id: "ext-087-p3", from: 14, to: 19,
    label: "certainly succeeded purifies himself; mentions name Lord prays; prefer worldly life; Hereafter better more enduring; Indeed former scriptures; scriptures Abraham Moses",
    mainLabel: "Success declared for whoever purifies himself, mentions his Lord's name and prays; their preference for worldly life rebuked since the Hereafter is better and more enduring; this teaching affirmed as already present in the former scriptures — those of Abraham and Moses" }
];

const SUB_LABELS = {
  "ext-087-p1": [
    "Command to exalt the name of the Lord, the Most High",
    "He created and proportioned",
    "He destined and then guided",
    "He brings out the pasture",
    "Then reduces it to black stubble"
  ],
  "ext-087-p2": [
    "The Prophet assured he will be made to recite without forgetting",
    "Except what Allah wills, since He knows the declared and the hidden",
    "Easing promised toward ease",
    "The reminder commanded wherever it benefits",
    "The God-fearing one receiving the reminder",
    "The wretched one avoiding it",
    "Destined to burn in the greatest Fire",
    "Neither dying therein nor living"
  ],
  "ext-087-p3": [
    "Success declared for whoever purifies himself",
    "Mentioning his Lord's name and praying",
    "Their preference for worldly life rebuked",
    "The Hereafter affirmed better and more enduring",
    "This teaching located in the former scriptures",
    "Specifically the scriptures of Abraham and Moses"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`87:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`87:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 87, surahName: "Al-Ala",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the pasture-to-stubble cycle (5) before the recitation-and-forgetting assurance opens (6); P2 ends with the neither-dying-nor-living verdict (13) before the purification-success block begins (14); P3 runs through dhikr-prayer success, the worldly-preference rebuke and the Abrahamic-Mosaic scriptural continuity (14-19).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (87:1-5) ===
{
  const e = extractions[0];
  const ala = findWord(1, ["\u0623","\u0639","\u0644","\u0649"]);
  if (ala) e.divineNamesAndAttributes.push({ term: ala, transliteration: "al-A'la", gloss: "the Most High (editorial gloss)", keys: ["87:1"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["87:1"], excerpt: fv(1), description: "Exalt the name of your Lord, the Most High." });

  e.relationships.push({ label: "Creation, proportioning, destining and guiding attributed to the Most High", keys: ["87:2","87:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Pasture brought forth then reduced to black stubble as a natural sign of transience", keys: ["87:4","87:5"], evidenceClass: "EXPLICIT_TEXT" });

  const qaddara = findWord(3, ["\u0642","\u062f","\u0631"]);
  if (qaddara) e.terminology.push({ term: qaddara, transliteration: "qaddara fa-hada", gloss: "destined then guided (editorial gloss)", keys: ["87:3"] });
  const ghutha = findWord(5, ["\u063a","\u062b","\u0627","\u0621"]);
  if (ghutha) e.terminology.push({ term: ghutha, transliteration: "ghutha' ahwa", gloss: "black stubble (editorial gloss)", keys: ["87:5"] });
}

// === POPULATE P2 (87:6-13) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["87:9"], excerpt: fv(9), description: "So remind, if the reminder should benefit." });

  e.humanConditionsAndSpiritualStates.push({ label: "Recitation preserved against forgetting except by divine will", keys: ["87:6","87:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Easing toward ease promised to the Prophet", keys: ["87:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "God-fearer receptive to reminder while the wretched avoids it", keys: ["87:10","87:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Burning in the greatest Fire without death or life as relief", keys: ["87:12","87:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine knowledge covering both the declared and the hidden", keys: ["87:7"], evidenceClass: "EXPLICIT_TEXT" });

  const yusra = findWord(8, ["\u064a","\u0633","\u0631","\u0649"]);
  if (yusra) e.terminology.push({ term: yusra, transliteration: "al-yusra", gloss: "ease (editorial gloss)", keys: ["87:8"] });
  const ashqa = findWord(11, ["\u0623","\u0634","\u0642","\u0649"]);
  if (ashqa) e.terminology.push({ term: ashqa, transliteration: "al-ashqa", gloss: "the wretched one (editorial gloss)", keys: ["87:11"] });
}

// === POPULATE P3 (87:14-19) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Success tied to self-purification, dhikr and prayer", keys: ["87:14","87:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Worldly preference rebuked against the better and more enduring Hereafter", keys: ["87:16","87:17"], evidenceClass: "EXPLICIT_TEXT" });

  e.propheticNarratives.push({ label: "The teaching traced to the former scriptures of Abraham and Moses", keys: ["87:18","87:19"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Continuity of revelation asserted across Abrahamic and Mosaic scripture", keys: ["87:18","87:19"], evidenceClass: "EXPLICIT_TEXT" });

  const tazakka = findWord(14, ["\u062a","\u0632","\u0643","\u0649"]);
  if (tazakka) e.terminology.push({ term: tazakka, transliteration: "tazakka", gloss: "purifies himself (editorial gloss)", keys: ["87:14"] });
  const suhufIbrahim = findWord(19, ["\u0625","\u0628","\u0631","\u0627","\u0647","\u064a","\u0645"]);
  if (suhufIbrahim) e.terminology.push({ term: suhufIbrahim, transliteration: "suhuf Ibrahim wa-Musa", gloss: "scriptures of Abraham and Moses (editorial gloss)", keys: ["87:19"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `087-al-ala-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 087-al-ala-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-087-p1,ext-087-p2,ext-087-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1937", label: "Most High exalted as creator, proportioner, destiner and guide", def: "In 87:1-3: Exalt the name of your Lord the Most High who created and proportioned and who destined and then guided.", key: "87:1", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Al-A'la named in the tasbih command."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Qaddara fa-hada pairing."}] },
  { id: "cand-1938", label: "Pasture reduced to black stubble as a sign of transience", def: "In 87:4-5: And who brings out the pasture and then makes it black stubble.", key: "87:4", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Mar'a to ghutha' ahwa cycle."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Vegetative decay mirroring human finitude."}] },

  { id: "cand-1939", label: "Recitation preserved against forgetting with easing toward ease", def: "In 87:6-8: We will make you recite O Muhammad and you will not forget except what Allah should will; indeed He knows what is declared and what is hidden; and We will ease you toward ease.", key: "87:6", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"La tansa guarantee."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Taysir li'l-yusra promised."}] },
  { id: "cand-1940", label: "Reminder benefiting the God-fearing while the wretched burns without death or life", def: "In 87:9-13: So remind if the reminder should benefit; he who fears Allah will be reminded but the wretched one will avoid it, he who will enter and burn in the greatest Fire neither dying therein nor living.", key: "87:9", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikra conditional on benefit."},{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Al-nar al-kubra with la yamut wa-la yahya."}] },

  { id: "cand-1941", label: "Success through purification, dhikr and prayer against worldly preference", def: "In 87:14-17: He has certainly succeeded who purifies himself and mentions the name of his Lord and prays; but you prefer the worldly life while the Hereafter is better and more enduring.", key: "87:14", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Dhikr plus salah as falah path."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Khayr wa-abqa comparison."}] },
  { id: "cand-1942", label: "Teaching traced to the scriptures of Abraham and Moses", def: "In 87:18-19: Indeed this is in the former scriptures, the scriptures of Abraham and Moses.", key: "87:18", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Ibrahim and Musa scripture continuity."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Suhuf ula referenced."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `087-al-ala-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-111.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-111.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");