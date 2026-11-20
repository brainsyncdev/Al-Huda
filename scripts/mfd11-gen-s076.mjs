// MFD-11 Wave 11: Surah 76 (Al-Insan) genuine re-extraction.
// Covers 76:1-31 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "076-0001-0031.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 76:${n} not found`);
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

console.log("Generating Surah 76 (Al-Insan) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T20:45:00.000Z";

const PASSAGES = [
  { id: "ext-076-p1", from: 1, to: 4,
    label: "Has there come upon man period time when not thing mentioned; Indeed created man sperm-drop mixture may try him made hearing seeing; Indeed guided him way be grateful or ungrateful; Indeed prepared disbelievers chains shackles blaze",
    mainLabel: "Man's prior non-existence recalled before his creation from a sperm-drop mixture for the purpose of trial, endowed with hearing and sight; guidance shown to him leaving him either grateful or ungrateful; chains, shackles and a blaze prepared for the disbelievers" },
  { id: "ext-076-p2", from: 5, to: 22,
    label: "Indeed righteous drink cup wine mixture Kafur; spring servants Allah drink make gush forth force abundance; fulfill vows fear Day evil widespread; give food spite love needy orphan captive; saying feed only countenance Allah wish not reward gratitude; Indeed fear Lord Day austere distressful; Allah protect evil Day give radiance happiness; reward patiently endured garden silk; reclining adorned couches not see sun cold; near above shades fruit picked lowered compliance; circulated vessels silver cups clear glass; clear glasses silver determined measure; given drink cup wine mixture ginger; fountain Paradise named Salsabeel; circulate young boys eternal see think scattered pearls; look see pleasure great dominion; inhabitants green garments fine silk brocade adorned bracelets silver Lord purifying drink; said indeed reward effort appreciated",
    mainLabel: "The righteous drinking from a Kafur-mixed cup at a spring they cause to gush forth abundantly; those who fulfill vows and fear a widely-spreading evil Day, feeding the needy, orphan and captive despite loving it themselves, seeking only Allah's countenance without expecting reward or gratitude because they fear an austere and distressful Day from their Lord; Allah protecting them from that Day's evil and granting radiance and happiness, rewarding their patience with a garden and silk garments; reclining on adorned couches free from sun and cold, shaded by near canopies with compliantly lowered fruit; silver vessels and clear-glass cups of determined measure circulated, alongside ginger-mixed drink from the Salsabeel fountain; eternal youths like scattered pearls serving amid pleasure and great dominion; green silk and brocade garments with silver bracelets and a purifying drink from their Lord; all declared their earned reward with effort appreciated" },
  { id: "ext-076-p3", from: 23, to: 26,
    label: "Indeed We sent down you Muhammad Quran progressively; patient decision Lord do not obey among sinner ungrateful disbeliever; mention name Lord morning evening; during night prostrate exalt long part night",
    mainLabel: "The progressive sending-down of the Quran to the Prophet affirmed; patience commanded for the Lord's decision with prohibition of obeying any sinner or ungrateful disbeliever; remembrance of the Lord's name morning and evening joined to night prostration and prolonged exaltation" },
  { id: "ext-076-p4", from: 27, to: 31,
    label: "Indeed these disbelievers love immediate leave behind grave Day; created them strengthened forms when will change likenesses complete alteration; Indeed reminder whoever wills take Lord way; not will except Allah wills Indeed Allah ever Knowing Wise; admits wills mercy wrongdoers prepared painful punishment",
    mainLabel: "Disbelievers' love of the immediate and abandonment of the grave Day exposed; their creation and strengthened forms noted alongside divine power to alter their likenesses completely; the whole named a reminder enabling whoever wills to take a way to his Lord, yet willing occurs only by Allah's will since He is Knowing and Wise; He admits whom He wills into mercy while preparing painful punishment for the wrongdoers" }
];

const SUB_LABELS = {
  "ext-076-p1": [
    "Man's prior non-existence before any mention of him",
    "Creation from a sperm-drop mixture for the purpose of trial, endowed with hearing and sight",
    "Guidance shown to him leaving him either grateful or ungrateful",
    "Chains, shackles and a blaze prepared for the disbelievers"
  ],
  "ext-076-p2": [
    "The righteous drinking from a Kafur-mixed cup",
    "At a spring the servants of Allah cause to gush forth abundantly",
    "Those who fulfill their vows and fear a Day whose evil will be widespread",
    "Feeding the needy, orphan and captive despite loving the food themselves",
    "Seeking only Allah's countenance without expecting reward or gratitude",
    "Their fear of an austere and distressful Day from their Lord",
    "Allah protecting them from that Day's evil and granting radiance and happiness",
    "Patience rewarded with a garden and silk garments",
    "Reclining on adorned couches free from burning sun and freezing cold",
    "Near shades above with compliantly lowered fruit",
    "Silver vessels and clear-glass cups circulated among them",
    "Clear glasses of silver whose measure they have determined",
    "Ginger-mixed drink served to them",
    "From a fountain in Paradise named Salsabeel",
    "Eternal youths circulating among them like scattered pearls",
    "Looking there reveals pleasure and great dominion",
    "Green silk and brocade garments with silver bracelets and a purifying drink from their Lord",
    "All declared their earned reward with effort appreciated"
  ],
  "ext-076-p3": [
    "The Quran sent down progressively to the Prophet",
    "Patience for the Lord's decision commanded with prohibition of obeying sinners or ungrateful disbelievers",
    "Remembrance of the Lord's name morning and evening",
    "Night prostration and prolonged exaltation enjoined"
  ],
  "ext-076-p4": [
    "Disbelievers loving the immediate and leaving behind the grave Day",
    "Their creation and strengthened forms noted alongside divine power to alter likenesses completely",
    "This named a reminder enabling whoever wills to take a way to his Lord",
    "Willing occurs only by Allah's will since He is Knowing and Wise",
    "He admits whom He wills into mercy while preparing painful punishment for wrongdoers"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`76:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`76:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 76, surahName: "Al-Insan",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 11 genuine re-extraction. Boundaries follow the text: P1 closes with the disbelievers' chains-shackles-blaze preparation (4) before the righteous-reward block opens (5); P2 ends with the earned-reward declaration (22) before the progressive-Quran and prophetic-instruction block begins (23); P3 covers the tanzil, patience command, dhikr and night worship (23-26); P4 runs through the immediate-love diagnosis, creation-alteration power, reminder function, divine-will nesting and closing mercy-punishment distinction (27-31).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (76:1-4) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Prior non-existence before creation from a sperm-drop mixture for trial", keys: ["76:1","76:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Guidance offered leaving humanity divided between gratitude and ingratitude", keys: ["76:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Hearing and sight granted as faculties enabling the trial", keys: ["76:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Chains, shackles and blaze prepared specifically for disbelievers", keys: ["76:4"], evidenceClass: "EXPLICIT_TEXT" });

  const insan = findWord(1, ["\u0625","\u0646","\u0633","\u0627","\u0646"]);
  if (insan) e.terminology.push({ term: insan, transliteration: "al-insan", gloss: "man/humanity (editorial gloss)", keys: ["76:1"] });
  const nutfah = findWord(2, ["\u0646","\u0637","\u0641"]);
  if (nutfah) e.terminology.push({ term: nutfah, transliteration: "nutfah amshaj", gloss: "sperm-drop mixture (editorial gloss)", keys: ["76:2"] });
}

// === POPULATE P2 (76:5-22) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["76:9"], excerpt: fv(9), description: "We feed you only for the countenance of Allah. We wish not from you reward or gratitude." });

  e.humanConditionsAndSpiritualStates.push({ label: "Vow fulfillment and fear of a widely-spreading evil Day motivating selfless feeding", keys: ["76:7","76:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Fear of an austere and distressful Day producing divine protection, radiance and happiness", keys: ["76:10","76:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Effort appreciated and rewarded with garden, silk, adorned couches and purifying drink", keys: ["76:12","76:21","76:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Feeding the needy, orphan and captive despite personal attachment to the food", keys: ["76:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Paradise furnishings: silver vessels, clear-glass cups, ginger drink from Salsabeel, eternal youths", keys: ["76:15","76:16","76:17","76:18","76:19"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Kafur spring gushing forth by the servants' own agency as their drink source", keys: ["76:5","76:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Shades, lowered fruit, pleasure and great dominion comprising the reward environment", keys: ["76:13","76:14","76:20"], evidenceClass: "EXPLICIT_TEXT" });

  const kafur = findWord(5, ["\u0643","\u0627","\u0641","\u0648","\u0631"]);
  if (kafur) e.terminology.push({ term: kafur, transliteration: "kafur", gloss: "camphor/Kafur (editorial gloss)", keys: ["76:5"] });
  const salsabil = findWord(18, ["\u0633","\u0644","\u0633","\u0628","\u064a","\u0644"]);
  if (salsabil) e.terminology.push({ term: salsabil, transliteration: "Salsabil", gloss: "a named fountain in Paradise (editorial gloss)", keys: ["76:18"] });
  const zanjabir = findWord(17, ["\u0632","\u0646","\u062c","\u0628","\u064a","\u0644"]);
  if (zanjabir) e.terminology.push({ term: zanjabir, transliteration: "zanjabil", gloss: "ginger (editorial gloss)", keys: ["76:17"] });
}

// === POPULATE P3 (76:23-26) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["76:24"], excerpt: fv(24), description: "Be patient for the decision of your Lord." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["76:24"], excerpt: fv(24), description: "Do not obey from among them a sinner or ungrateful disbeliever." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["76:25"], excerpt: fv(25), description: "Mention the name of your Lord morning and evening." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["76:26"], excerpt: fv(26), description: "During the night prostrate to Him and exalt Him a long part of the night." });

  e.humanConditionsAndSpiritualStates.push({ label: "Progressive Quran revelation grounding the prophetic mission", keys: ["76:23"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Morning-evening dhikr paired with night prostration and prolonged exaltation", keys: ["76:25","76:26"], evidenceClass: "EXPLICIT_TEXT" });

  const tanzil = findWord(23, ["\u062a","\u0646","\u0632","\u064a","\u0644"]);
  if (tanzil) e.terminology.push({ term: tanzil, transliteration: "tanzil", gloss: "progressive sending-down (editorial gloss)", keys: ["76:23"] });
}

// === POPULATE P4 (76:27-31) ===
{
  const e = extractions[3];
  const aleem = findWord(30, ["\u0639","\u0644","\u064a","\u0645"]);
  const hakeem = findWord(30, ["\u062d","\u0643","\u064a","\u0645"]);
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["76:30"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["76:30"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Love of the immediate and abandonment of the grave Day diagnosed", keys: ["76:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Divine power to alter human likenesses completely after initial creation", keys: ["76:28"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Reminder enabling whoever wills to take a way, nested under divine will", keys: ["76:29","76:30"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Mercy admitted by will against painful punishment prepared for wrongdoers", keys: ["76:31"], evidenceClass: "EXPLICIT_TEXT" });

  const yawm = findWord(27, ["\u064a","\u0648","\u0645"]);
  // Using 'grave Day' reference
  const thaqeel = findWord(27, ["\u062b","\u0642","\u064a","\u0644"]);
  if (thaqeel) e.terminology.push({ term: thaqeel, transliteration: "yawm thaqil", gloss: "grave/heavy Day (editorial gloss)", keys: ["76:27"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `076-al-insan-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 076-al-insan-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-076-p1,ext-076-p2,ext-076-p3,ext-076-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1867", label: "Creation from sperm-drop mixture for trial with hearing and sight", def: "In 76:1-2: Has there not come upon man a period of time when he was not a thing even mentioned; indeed We created man from a sperm-drop mixture that We may try him and We made him hearing and seeing.", key: "76:1", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Nutfah amshaj li-nabluwah."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Trial purpose stated explicitly."}] },
  { id: "cand-1868", label: "Guidance offered leaving humanity divided between gratitude and ingratitude", def: "In 76:3: Indeed We guided him to the way be he grateful or be he ungrateful.", key: "76:3", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Hidayah as revealed guidance followed by ikhtiyar."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Shakir versus kafur binary."}] },

  { id: "cand-1869", label: "Selfless feeding for Allah's countenance alone without expecting return", def: "In 76:8-10: And they give food in spite of love for it to the needy the orphan and the captive; saying we feed you only for the countenance of Allah we wish not from you reward or gratitude; indeed We fear from our Lord a Day austere and distressful.", key: "76:8", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"It'am ala hubb with la nuridu jaza'."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ikhlas in charity articulated."}] },
  { id: "cand-1870", label: "Kafur spring, Salsabeel fountain and eternal youths as Paradise provisions", def: "In 76:5-6,17-19: Indeed the righteous will drink from a cup of wine whose mixture is of Kafur; a spring of which the servants of Allah will drink they will make it gush forth in force and abundance; and they will be given to drink a cup of wine whose mixture is of ginger from a fountain within Paradise named Salsabeel; there will circulate among them young boys made eternal when you see them you would think them as beautiful as scattered pearls.", key: "76:5", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Named drinks and springs detailed."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Sensory reward imagery."}] },
  { id: "cand-1871", label: "Earned reward declared after patient endurance", def: "In 76:22: And it will be said indeed this is for you a reward and your effort has been appreciated.", key: "76:22", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Jaza' linked to sa'y mashkur."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr as the earning condition."}] },

  { id: "cand-1872", label: "Progressive Quran revelation with patience and worship commands", def: "In 76:23-26: Indeed it is We who have sent down to you O Muhammad the Quran progressively; so be patient for the decision of your Lord and do not obey from among them a sinner or ungrateful disbeliever; and mention the name of your Lord morning and evening; and during the night prostrate to Him and exalt Him a long part of the night.", key: "76:23", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Tanzil progressive mode."},{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Dhikr plus sujud layli."}] },

  { id: "cand-1873", label: "Human willing nested under divine will with knowledge and wisdom", def: "In 76:29-31: Indeed this is a reminder so he who wills may take to his Lord a way; and you do not will except that Allah wills indeed Allah is ever Knowing and Wise; He admits whom He wills into His mercy but the wrongdoers He has prepared for them a painful punishment.", key: "76:29", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Mashi'ah insaniyyah tahta mashi'ah ilahiyyah."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Aleem Hakeem framing selection."}] }
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
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 6).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(6, 7).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `076-al-insan-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-100.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-100.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");