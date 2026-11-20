// MFD-11 Wave 13: Surah 89 (Al-Fajr) genuine re-extraction.
// Covers 89:1-30 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "089-0001-0030.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 89:${n} not found`);
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

console.log("Generating Surah 89 (Al-Fajr) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T22:55:00.000Z";

const PASSAGES = [
  { id: "ext-089-p1", from: 1, to: 14,
    label: "By dawn; ten nights; even number odd; night passes; oath sufficient one perception; considered Lord dealt Aad; Iram lofty pillars; likes never created land; Thamud carved rocks valley; Pharaoh owner stakes; oppressed within lands; increased therein corruption; Lord poured scourge punishment; Indeed Lord observation",
    mainLabel: "Oaths by the dawn, ten nights, the even and the odd, and the passing night — sufficient for one of perception; the Lord's dealing with Aad of Iram whose lofty pillars had no equal in the land, Thamud who carved rocks in the valley, and Pharaoh owner of the stakes, all of whom oppressed and spread corruption until a scourge of punishment was poured upon them — indeed the Lord is ever in observation" },
  { id: "ext-089-p2", from: 15, to: 20,
    label: "as for man when Lord tries him generous favors says Lord honored me; tries restricts provision says Lord humiliated me; No do not honor orphan; not encourage one another feed poor; consume inheritance devouring altogether; love wealth immense love",
    mainLabel: "Man's flawed response to divine trial: claiming honour when given generously but humiliation when provision is restricted; the correction that they neither honour the orphan nor encourage feeding the poor, consuming inheritance by devouring it altogether and loving wealth with immense love" },
  { id: "ext-089-p3", from: 21, to: 26,
    label: "No When earth leveled pounded crushed; Lord come angels rank upon rank; brought within view Day Hell; Day man remember what good remembrance; say Oh wish sent ahead good life; Day none punish severely His punishment; none bind severely His binding evildoers",
    mainLabel: "When the earth is levelled, pounded and crushed, and the Lord comes with angels rank upon rank while Hell is brought into view, man will remember but his remembrance will avail him nothing; he will wish he had sent good ahead for his life; on that Day none punishes as severely as His punishment and none binds as severely as His binding" },
  { id: "ext-089-p4", from: 27, to: 30,
    label: "To righteous said O reassured soul; Return Lord well-pleased pleasing Him; enter among My righteous servants; enter My Paradise",
    mainLabel: "The reassured soul addressed directly: return to your Lord well-pleased and pleasing to Him, enter among His righteous servants and enter His Paradise" }
];

const SUB_LABELS = {
  "ext-089-p1": [
    "Oath sworn by the dawn",
    "And by ten nights",
    "And by the even number and the odd",
    "And by the night when it passes away",
    "All this constituting a sufficient oath for one of perception",
    "The Lord's dealing with Aad recalled",
    "Iram described as having lofty pillars",
    "Whose like had never been created in the land",
    "Thamud who carved out rocks in the valley",
    "Pharaoh identified as owner of the stakes",
    "All of whom committed oppression within the lands",
    "And multiplied corruption therein",
    "Their Lord pouring upon them a scourge of punishment",
    "Indeed the Lord is ever in observation"
  ],
  "ext-089-p2": [
    "Man claiming honour when his Lord tests him with generosity and favour",
    "But declaring humiliation when tested with restricted provision",
    "The rebuke: you do not honour the orphan",
    "Nor encourage one another to feed the poor",
    "Devouring inheritance altogether greedily",
    "Loving wealth with immense love"
  ],
  "ext-089-p3": [
    "The earth levelled, pounded and crushed",
    "The Lord coming with angels standing rank upon rank",
    "Hell brought into view on that Day",
    "Man remembering but his remembrance availing him nothing",
    "Wishing he had sent good ahead for his life",
    "None punishing or binding as severely as He does on that Day"
  ],
  "ext-089-p4": [
    "The reassured soul addressed directly",
    "Commanded to return to its Lord well-pleased and pleasing to Him",
    "Invited to enter among His righteous servants",
    "And to enter His Paradise"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`89:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`89:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 89, surahName: "Al-Fajr",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the Lord-is-in-observation declaration (14) before the human-trial-response block opens (15); P2 ends with the immense-love-of-wealth diagnosis (20) before the eschatological earth-levelling begins (21); P3 covers the six-verse Day scene ending with the unmatched-punishment verdict (21-26); P4 runs through the four-verse address to the reassured soul (27-30).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (89:1-14) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Oaths by dawn, ten nights, even-and-odd and passing night sufficient for one of perception", keys: ["89:1","89:2","89:3","89:4","89:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.propheticNarratives.push({ label: "Aad of Iram with lofty pillars, unique in creation across the land", keys: ["89:6","89:7","89:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Thamud carving rocks in the valley and Pharaoh owner of the stakes", keys: ["89:9","89:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Three civilisations oppressing within their lands and multiplying corruption", keys: ["89:11","89:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Scourge of punishment poured upon them because the Lord is ever observing", keys: ["89:13","89:14"], evidenceClass: "EXPLICIT_TEXT" });

  const fajr = findWord(1, ["\u0641","\u062c","\u0631"]);
  if (fajr) e.terminology.push({ term: fajr, transliteration: "al-fajr", gloss: "the dawn (editorial gloss)", keys: ["89:1"] });
  const iram = findWord(7, ["\u0625","\u0631","\u0645"]);
  if (iram) e.terminology.push({ term: iram, transliteration: "Iram", gloss: "Iram of the pillars (editorial gloss)", keys: ["89:7"] });
  const awtad = findWord(10, ["\u0623","\u0648","\u062a","\u0627","\u062f"]);
  if (awtad) e.terminology.push({ term: awtad, transliteration: "awtad", gloss: "stakes (editorial gloss)", keys: ["89:10"] });
  const mirsad = findWord(14, ["\u0645","\u0631","\u0635","\u062f"]);
  if (mirsad) e.terminology.push({ term: mirsad, transliteration: "bil-mirsad", gloss: "in observation/ambush (editorial gloss)", keys: ["89:14"] });
}

// === POPULATE P2 (89:15-20) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Misreading divine generosity as honour and restriction as humiliation", keys: ["89:15","89:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wealth loved with immense attachment overriding social obligations", keys: ["89:20"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Orphan dishonoured and mutual encouragement to feed the poor absent", keys: ["89:17","89:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Inheritance consumed by devouring it altogether without rightful distribution", keys: ["89:19"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["89:17"], excerpt: fv(17), description: "You do not honour the orphan — a social failure condemned." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["89:19"], excerpt: fv(19), description: "You consume inheritance devouring it altogether." });

  const hubban = findWord(20, ["\u062d","\u0628","\u0627"]);
  if (hubban) e.terminology.push({ term: hubban, transliteration: "hubban jamma", gloss: "immense love (editorial gloss)", keys: ["89:20"] });
}

// === POPULATE P3 (89:21-26) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Earth levelled, pounded and crushed at the onset of the Day", keys: ["89:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Late remembrance producing regret and wishing for sent-ahead good", keys: ["89:23","89:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Lord arriving with angels rank upon rank and Hell brought into view", keys: ["89:22","89:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Unmatched severity of divine punishment and binding on that Day", keys: ["89:25","89:26"], evidenceClass: "EXPLICIT_TEXT" });

  const dakka = findWord(21, ["\u062f","\u0643","\u0627"]);
  if (dakka) e.terminology.push({ term: dakka, transliteration: "dakkatan dakka", gloss: "pounded and crushed (editorial gloss)", keys: ["89:21"] });
}

// === POPULATE P4 (89:27-30) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["89:28"], excerpt: fv(28), description: "Return to your Lord, well-pleased and pleasing to Him." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["89:29"], excerpt: fv(29), description: "Enter among My righteous servants." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["89:30"], excerpt: fv(30), description: "Enter My Paradise." });

  e.humanConditionsAndSpiritualStates.push({ label: "The reassured soul invited back to its Lord in mutual satisfaction", keys: ["89:27","89:28"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Entry among righteous servants preceding entry into Paradise", keys: ["89:29","89:30"], evidenceClass: "EXPLICIT_TEXT" });

  const mutmainnah = findWord(27, ["\u0645","\u0637","\u0645","\u0626","\u0646"]);
  if (mutmainnah) e.terminology.push({ term: mutmainnah, transliteration: "al-nafs al-mutma'innah", gloss: "the reassured soul (editorial gloss)", keys: ["89:27"] });
  const radiyah = findWord(28, ["\u0631","\u0627","\u0636","\u064a"]);
  if (radiyah) e.terminology.push({ term: radiyah, transliteration: "radiyah mardiyyah", gloss: "well-pleased and pleasing (editorial gloss)", keys: ["89:28"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `089-al-fajr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 089-al-fajr-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-089-p1,ext-089-p2,ext-089-p3,ext-089-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1947", label: "Dawn-night oaths sufficient for perception followed by destroyed civilisations", def: "In 89:1-14: By the dawn and by ten nights and by the even number and the odd and by the night when it passes; is there not in all that an oath sufficient for one of perception; have you not considered how your Lord dealt with Aad, Iram who had lofty pillars the likes of whom had never been created in the land, and Thamud who carved out the rocks in the valley, and Pharaoh owner of the stakes; all of whom oppressed within the lands and increased therein the corruption; so your Lord poured upon them a scourge of punishment; indeed your Lord is in observation.", key: "89:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Qasam quadruple for uli al-hijr."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Aad Thamud Firawn precedent triad."}] },
  { id: "cand-1948", label: "Human misreading of trial: generosity as honour, restriction as humiliation", def: "In 89:15-16: And as for man when his Lord tries him and thus is generous to him and favors him he says my Lord has honored me; but when He tries him and restricts his provision he says my Lord has humiliated me.", key: "89:15", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Ikram and ihana both misunderstood."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Trial wisdom unrecognised."}] },
  { id: "cand-1949", label: "Social failures: orphan neglected, poor unfed, inheritance devoured, wealth over-loved", def: "In 89:17-20: No but you do not honor the orphan and you do not encourage one another to feed the poor and you consume inheritance devouring it altogether and you love wealth with immense love.", key: "89:17", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Four-fold social indictment."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"It'am al-miskin abandoned."}] },

  { id: "cand-1950", label: "Earth levelled, Lord arriving with ranks, Hell exposed, futile remembrance", def: "In 89:21-26: No when the earth has been leveled pounded and crushed and your Lord has come and the angels rank upon rank and brought within view that Day is Hell; that Day man will remember but what good to him will be the remembrance; he will say oh I wish I had sent ahead some good for my life; so on that Day none will punish as severely as His punishment and none will bind as severely as His binding of the evildoers.", key: "89:21", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Dakk and ja'a rabbuka sequence."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Late dhikr useless."}] },

  { id: "cand-1951", label: "Reassured soul commanded to return pleased and enter Paradise", def: "In 89:27-30: To the righteous it will be said O reassured soul return to your Lord well-pleased and pleasing to Him and enter among My righteous servants and enter My Paradise.", key: "89:27", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Nafs mutma'innah final destination."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Radiya mardiyya dual satisfaction."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 1).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(1, 3).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(3, 4).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(4, 5).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `089-al-fajr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-113.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-113.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");