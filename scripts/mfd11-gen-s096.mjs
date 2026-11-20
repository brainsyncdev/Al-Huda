// MFD-11 Wave 13: Surah 96 (Al-Alaq) genuine re-extraction.
// Covers 96:1-19 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "096-0001-0019.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 96:${n} not found`);
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

console.log("Generating Surah 96 (Al-Alaq) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-21T00:05:00.000Z";

const PASSAGES = [
  { id: "ext-096-p1", from: 1, to: 5,
    label: "Recite name Lord created; created man clinging substance; Recite Lord most Generous; taught pen; taught man knew not",
    mainLabel: "The first revelation commanding recitation in the name of the Lord who created man from a clinging substance; He is the Most Generous who taught by the pen and taught man what he did not know" },
  { id: "ext-096-p2", from: 6, to: 14,
    label: "No indeed man transgresses; sees himself self-sufficient; Indeed Lord return; seen one forbids; servant prays; seen if upon guidance; enjoins righteousness; seen if denies turns away; not know Allah sees",
    mainLabel: "Man's transgression rooted in seeing himself self-sufficient despite his return being to his Lord; the one who forbids a praying servant questioned whether he is upon guidance or enjoins righteousness, or rather denies and turns away — does he not know that Allah sees" },
  { id: "ext-096-p3", from: 15, to: 19,
    label: "No if not desist drag forelock; lying sinning forelock; let call associates; call angels Hell; No do not obey him prostrate draw near",
    mainLabel: "If the transgressor does not desist he will be dragged by his lying sinful forelock; let him call his associates while the angels of Hell are summoned; the believer instructed not to obey him but to prostrate and draw near to Allah" }
];

const SUB_LABELS = {
  "ext-096-p1": [
    "Command to recite in the name of the Lord who created",
    "Man created from a clinging substance",
    "Recite affirmed with the Lord named Most Generous",
    "He taught by the pen",
    "Taught man what he did not know"
  ],
  "ext-096-p2": [
    "Man declared to transgress",
    "Because he sees himself self-sufficient",
    "His return affirmed to be to his Lord",
    "The one who forbids questioned rhetorically",
    "A servant specifically when he prays identified as the forbidden act",
    "Whether he is upon guidance asked",
    "Or enjoins righteousness asked",
    "Whether he denies and turns away asked",
    "Does he not know that Allah sees"
  ],
  "ext-096-p3": [
    "If he does not desist he will be dragged by the forelock",
    "A lying, sinning forelock specified",
    "Let him call his associates challenged",
    "The angels of Hell summoned in response",
    "Do not obey him commanded; prostrate and draw near instead"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`96:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`96:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 96, surahName: "Al-Alaq",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the teaching-by-the-pen declaration (5) before the transgression diagnosis opens (6); P2 ends with the divine-sight question (14) before the forelock-dragging threat begins (15); P3 runs through the lying forelock, the associate-challenge, the Hell-angels summons and the closing prostration command (15-19).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (96:1-5) ===
{
  const e = extractions[0];
  const kareem = findWord(3, ["\u0643","\u0631","\u064a","\u0645"]);
  if (kareem) e.divineNamesAndAttributes.push({ term: kareem, transliteration: "al-Akram", gloss: "the Most Generous (editorial gloss)", keys: ["96:3"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["96:1"], excerpt: fv(1), description: "Recite in the name of your Lord who created." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["96:3"], excerpt: fv(3), description: "Recite, and your Lord is the Most Generous." });

  e.humanConditionsAndSpiritualStates.push({ label: "Man created from a clinging substance as the origin point", keys: ["96:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Knowledge imparted through the pen beyond prior human capacity", keys: ["96:4","96:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creation from alaq paired with teaching by qalam as dual divine gifts", keys: ["96:2","96:4","96:5"], evidenceClass: "EXPLICIT_TEXT" });

  const iqra = findWord(1, ["\u0627","\u0642","\u0631","\u0623"]);
  if (iqra) e.terminology.push({ term: iqra, transliteration: "iqra'", gloss: "recite/read (editorial gloss)", keys: ["96:1"] });
  const alaq = findWord(2, ["\u0639","\u0644","\u0642"]);
  if (alaq) e.terminology.push({ term: alaq, transliteration: "alaq", gloss: "clinging substance (editorial gloss)", keys: ["96:2"] });
  const qalam = findWord(4, ["\u0642","\u0644","\u0645"]);
  if (qalam) e.terminology.push({ term: qalam, transliteration: "al-qalam", gloss: "the pen (editorial gloss)", keys: ["96:4"] });
}

// === POPULATE P2 (96:6-14) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Transgression arising from perceived self-sufficiency", keys: ["96:6","96:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prayer-forbidding opponent questioned about guidance versus denial", keys: ["96:9","96:10","96:11","96:12","96:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Return to the Lord stated as corrective to self-sufficiency illusion", keys: ["96:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine sight invoked as the ultimate accountability check", keys: ["96:14"], evidenceClass: "EXPLICIT_TEXT" });

  const tagha = findWord(6, ["\u0637","\u063a","\u0649"]);
  if (tagha) e.terminology.push({ term: tagha, transliteration: "tagha", gloss: "transgresses (editorial gloss)", keys: ["96:6"] });
  const istaghna = findWord(7, ["\u0627","\u0633","\u062a","\u063a","\u0646","\u0649"]);
  if (istaghna) e.terminology.push({ term: istaghna, transliteration: "istaghna", gloss: "sees himself self-sufficient (editorial gloss)", keys: ["96:7"] });
}

// === POPULATE P3 (96:15-19) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["96:19"], excerpt: fv(19), description: "Do not obey him." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["96:19"], excerpt: fv(19), description: "Prostrate and draw near to Allah." });

  e.humanConditionsAndSpiritualStates.push({ label: "Lying sinful forelock identified as the locus of transgression", keys: ["96:15","96:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Associate-summoning met by Hell-angel summoning as divine counter", keys: ["96:17","96:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Prostration and drawing near prescribed as the believer's response to opposition", keys: ["96:19"], evidenceClass: "EXPLICIT_TEXT" });

  const nasiyah = findWord(15, ["\u0646","\u0627","\u0635","\u064a"]);
  if (nasiyah) e.terminology.push({ term: nasiyah, transliteration: "al-nasiyah", gloss: "the forelock (editorial gloss)", keys: ["96:15"] });
  const zabaniyah = findWord(18, ["\u0632","\u0628","\u0627","\u0646","\u064a"]);
  if (zabaniyah) e.terminology.push({ term: zabaniyah, transliteration: "zabaniyah", gloss: "angels of Hell/guards (editorial gloss)", keys: ["96:18"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `096-al-alaq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 096-al-alaq-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-096-p1,ext-096-p2,ext-096-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1973", label: "First revelation: recitation commanded in the Creator-Most Generous's name", def: "In 96:1-5: Recite in the name of your Lord who created; created man from a clinging substance; recite and your Lord is the most Generous; who taught by the pen; taught man that which he knew not.", key: "96:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"First wahy iqra' bi-smi rabbika."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Qalam and ta'lim as divine gift."}] },
  { id: "cand-1974", label: "Human creation from alaq paired with pen-teaching as foundational gifts", def: "In 96:2-5: Created man from a clinging substance; recite and your Lord is the most Generous who taught by the pen taught man that which he knew not.", key: "96:2", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Alaq as origin stage."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Khalq plus ta'lim pairing."}] },

  { id: "cand-1975", label: "Transgression from self-sufficiency corrected by return-to-Lord reminder", def: "In 96:6-8: No indeed man transgresses because he sees himself self-sufficient; indeed to your Lord is the return.", key: "96:6", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Istighna as spiritual danger."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Ruj'a ila rabbika corrective."}] },
  { id: "cand-1976", label: "Prayer-forbidding opponent exposed: guidance denied, Allah sees", def: "In 96:9-14: Have you seen the one who forbids a servant when he prays; have you seen if he is upon guidance or enjoins righteousness; have you seen if he denies and turns away; does he not know that Allah sees.", key: "96:9", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Salah prohibition as kufr marker."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Allah yara as surveillance."}] },

  { id: "cand-1977", label: "Lying forelock dragged, associates outmatched by Hell angels, prostration commanded", def: "In 96:15-19: No if he does not desist We will surely drag him by the forelock a lying sinning forelock; then let him call his associates; We will call the angels of Hell; no do not obey him but prostrate and draw near to Allah.", key: "96:15", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Nasiyah kadhibah khata'ah seized."},{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Sujud wa-iqtirab as defiance response."}] }
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
    notes: "Wave 13 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 4).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(4, 5).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `096-al-alaq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-120.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-120.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");