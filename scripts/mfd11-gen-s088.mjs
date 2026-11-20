// MFD-11 Wave 12: Surah 88 (Al-Ghashiyah) genuine re-extraction.
// Covers 88:1-26 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "088-0001-0026.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 88:${n} not found`);
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

console.log("Generating Surah 88 (Al-Ghashiyah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T22:45:00.000Z";

const PASSAGES = [
  { id: "ext-088-p1", from: 1, to: 7,
    label: "Has reached you report Overwhelming event; faces Day humbled; working hard exhausted; enter burn intensely hot Fire; given drink boiling spring; no food except poisonous thorny plant; neither nourishes nor avails against hunger",
    mainLabel: "The report of the Overwhelming event introduced; humbled faces on that Day described as working hard and exhausted, entering an intensely hot Fire, given drink from a boiling spring with no food except a poisonous thorny plant that neither nourishes nor avails against hunger" },
  { id: "ext-088-p2", from: 8, to: 16,
    label: "Other faces Day show pleasure; effort satisfied; elevated garden; wherein hear no unsuitable speech; within flowing spring; couches raised high; cups put place; cushions lined up; carpets spread around",
    mainLabel: "Other faces on that Day showing pleasure, satisfied with their effort, placed in an elevated garden where no unsuitable speech is heard; within it a flowing spring, couches raised high, cups set in place, cushions lined up and carpets spread around" },
  { id: "ext-088-p3", from: 17, to: 20,
    label: "Then do they not look camels how created; sky how raised; mountains how erected; earth how spread out",
    mainLabel: "Four observational challenges directed at humanity: looking at the camels and how they are created, the sky and how it is raised, the mountains and how they are erected, and the earth and how it is spread out" },
  { id: "ext-088-p4", from: 21, to: 26,
    label: "So remind Muhammad only reminder; not over them controller; However turns away disbelieves; Then Allah punish greatest punishment; Indeed Us return; Then indeed upon Us account",
    mainLabel: "The Prophet instructed to remind since he is only a reminder and not a controller over them; whoever turns away and disbelieves will be punished by Allah with the greatest punishment; their return is to Him and upon Him rests their account" }
];

const SUB_LABELS = {
  "ext-088-p1": [
    "The report of the Overwhelming event introduced",
    "Faces on that Day will be humbled",
    "Working hard and exhausted in their toil",
    "Entering to burn in an intensely hot Fire",
    "Given drink from a boiling spring",
    "No food for them except a poisonous thorny plant",
    "Which neither nourishes nor avails against hunger"
  ],
  "ext-088-p2": [
    "Other faces on that Day showing pleasure",
    "Satisfied with their prior effort",
    "Placed in an elevated garden",
    "Wherein they will hear no unsuitable speech",
    "Within it a flowing spring",
    "Couches raised high therein",
    "Cups set in place",
    "Cushions lined up",
    "And carpets spread around"
  ],
  "ext-088-p3": [
    "Do they not look at the camels and how they are created",
    "And at the sky and how it is raised",
    "And at the mountains and how they are erected",
    "And at the earth and how it is spread out"
  ],
  "ext-088-p4": [
    "So remind O Muhammad — you are only a reminder",
    "You are not over them a controller",
    "However whoever turns away and disbelieves",
    "Allah will punish him with the greatest punishment",
    "Indeed to Us is their return",
    "Then indeed upon Us is their account"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`88:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`88:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 88, surahName: "Al-Ghashiyah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the non-nourishing thorny plant verdict (7) before the pleased-faces block opens (8); P2 ends with the carpet-spreading furnishing detail (16) before the four-fold observational challenge begins (17); P3 covers the camel-sky-mountain-earth signs (17-20); P4 runs through the reminder-only role, the turning-away warning and the closing return-and-account declaration (21-26).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (88:1-7) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Humbled faces working hard and exhausted on the Day of the Overwhelming event", keys: ["88:1","88:2","88:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Intensely hot Fire with boiling spring drink and non-nourishing thorny food", keys: ["88:4","88:5","88:6","88:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "The Overwhelming event's report framing the entire surah", keys: ["88:1"], evidenceClass: "EXPLICIT_TEXT" });

  const ghashiyah = findWord(1, ["\u063a","\u0627","\u0634","\u064a"]);
  if (ghashiyah) e.terminology.push({ term: ghashiyah, transliteration: "al-ghashiyah", gloss: "the Overwhelming event (editorial gloss)", keys: ["88:1"] });
  const dari = findWord(6, ["\u0636","\u0631","\u064a","\u0639"]);
  if (dari) e.terminology.push({ term: dari, transliteration: "dari'", gloss: "poisonous thorny plant (editorial gloss)", keys: ["88:6"] });
}

// === POPULATE P2 (88:8-16) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Pleased faces satisfied with their effort in an elevated garden", keys: ["88:8","88:9","88:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "No unsuitable speech heard within the reward environment", keys: ["88:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Garden furnishings: flowing spring, raised couches, placed cups, lined cushions and spread carpets", keys: ["88:12","88:13","88:14","88:15","88:16"], evidenceClass: "EXPLICIT_TEXT" });

  const saay = findWord(9, ["\u0633","\u0639","\u064a"]);
  if (saay) e.terminology.push({ term: saay, transliteration: "sa'y", gloss: "effort/striving (editorial gloss)", keys: ["88:9"] });
}

// === POPULATE P3 (88:17-20) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["88:17"], excerpt: fv(17), description: "Do they not look at the camels — how they are created?" });

  e.relationships.push({ label: "Four observational signs: camels created, sky raised, mountains erected, earth spread out", keys: ["88:17","88:18","88:19","88:20"], evidenceClass: "EXPLICIT_TEXT" });

  const ibil = findWord(17, ["\u0625","\u0628","\u0644"]);
  if (ibil) e.terminology.push({ term: ibil, transliteration: "ibil", gloss: "camels (editorial gloss)", keys: ["88:17"] });
}

// === POPULATE P4 (88:21-26) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["88:21"], excerpt: fv(21), description: "So remind — you are only a reminder." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["88:22"], excerpt: fv(22), description: "You are not over them a controller." });

  e.humanConditionsAndSpiritualStates.push({ label: "Turning away and disbelief answered by the greatest punishment", keys: ["88:23","88:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Return to Allah and accounting by Him as the closing framework", keys: ["88:25","88:26"], evidenceClass: "EXPLICIT_TEXT" });

  const musaytir = findWord(22, ["\u0645","\u0635","\u064a","\u0637"]);
  if (musaytir) e.terminology.push({ term: musaytir, transliteration: "musaytir", gloss: "controller/dominator (editorial gloss)", keys: ["88:22"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `088-al-ghashiyah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 088-al-ghashiyah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-088-p1,ext-088-p2,ext-088-p3,ext-088-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1943", label: "Overwhelming event producing humbled exhausted faces in intense Fire", def: "In 88:1-7: Has there reached you the report of the Overwhelming event; some faces that Day will be humbled working hard and exhausted; they will enter to burn in an intensely hot Fire; they will be given drink from a boiling spring; for them there will be no food except from a poisonous thorny plant which neither nourishes nor avails against hunger.", key: "88:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ghashiyah as comprehensive event."},{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Nar hamiya and hamim and dari'."}] },
  { id: "cand-1944", label: "Pleased faces satisfied with effort in furnished elevated garden", def: "In 88:8-16: Other faces that Day will show pleasure with their effort they are satisfied in an elevated garden wherein they will hear no unsuitable speech; within it is a flowing spring within it are couches raised high and cups put in place and cushions lined up and carpets spread around.", key: "88:8", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jannah 'aliyah detailed."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Laghw absent from reward."}] },

  { id: "cand-1945", label: "Four observational signs: camels, sky, mountains, earth", def: "In 88:17-20: Then do they not look at the camels how they are created and at the sky how it is raised and at the mountains how they are erected and at the earth how it is spread out.", key: "88:17", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ibil sama jibal ard tetrad."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Afala yanzurun command."}] },

  { id: "cand-1946", label: "Reminder-only role with turning-away answered by greatest punishment", def: "In 88:21-26: So remind O Muhammad you are only a reminder; you are not over them a controller; however he who turns away and disbelieves then Allah will punish him with the greatest punishment; indeed to Us is their return then indeed upon Us is their account.", key: "88:21", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Dhakkir only la musaytir."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Inna ilayna iyabahum wa-inna alayna hisabahum."}] }
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
extractions[1].topicCandidateIds = candidates.candidates.slice(1, 2).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(2, 3).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(3, 4).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `088-al-ghashiyah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-112.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-112.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");