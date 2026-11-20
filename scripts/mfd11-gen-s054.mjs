// MFD-11 Wave 8: Surah 54 (Al-Qamar) genuine re-extraction.
// Covers 54:1-55 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "054-0001-0055.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 54:${n} not found`);
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

console.log("Generating Surah 54 (Al-Qamar) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T17:05:00.000Z";

const PASSAGES = [
  { id: "ext-054-p1", from: 1, to: 17,
    label: "Hour come near moon split; see miracle turn away say passing magic; denied followed inclinations every matter settlement; already come information deterrence; extensive wisdom warning not avail; leave them Day Caller calls something forbidding; eyes humbled emerge graves locusts spreading; racing ahead toward Caller disbelievers say difficult Day; people Noah denied before denied servant said madman repelled; invoked Lord overpowered help; opened gates heaven rain pouring; earth burst springs waters met predestined; carried him planks nails; sailing under observation reward denied; left sign will remember; how severe punishment warning; made Quran easy remembrance will remember",
    mainLabel: "The Hour's nearness declared alongside the moon-splitting sign; miracles dismissed as passing magic while denial follows inclination, yet every matter has its appointed settlement; deterrent information and extensive wisdom having arrived but warning proving unavailing; the Prophet told to leave them until the Day the Caller summons to something forbidding, when humbled eyes emerge from graves like spreading locusts racing toward the Caller and disbelievers name it a difficult Day; Noah's people denying and repelling the servant called madman; his invocation answered by heaven's rain-gates and earth's bursting springs meeting for a predestined matter; carried on plank-and-nail construction sailing under divine observation as reward for the denied one; left as a sign with the repeated challenge to remember, noting the severity of punishment and warning and the Quran's ease for remembrance" },
  { id: "ext-054-p2", from: 18, to: 32,
    label: "Aad denied how severe punishment warning; sent screaming wind day continuous misfortune; extracting people trunks palm trees uprooted; how severe punishment warning; made Quran easy remembrance will remember; Thamud denied warning; said one human among us follow error madness; message sent down upon him among us rather insolent liar; know tomorrow who insolent liar; sending she-camel trial watch patient; inform water shared between each day drink attended turn; called companion dared hamstrung; how severe punishment warning; sent one blast sky became dry twig fragments animal pen; made Quran easy remembrance will remember",
    mainLabel: "Aad's denial answered by a screaming wind on a day of continuous misfortune extracting people like uprooted palm-tree trunks, with the severity refrain and Quran-ease reminder repeated; Thamud denying the warning and rejecting a single human messenger as error and madness, calling him an insolent liar told they would know tomorrow who the true liar is; the she-camel sent as trial with instructions to watch patiently and share water by turns; their companion daring to hamstring her; one blast from the sky reducing them to dry twig fragments of an animal pen, again with the severity refrain and Quran-ease reminder" },
  { id: "ext-054-p3", from: 33, to: 45,
    label: "People Lot denied warning; sent storm stones except family Lot saved before dawn; favor from us thus reward grateful; already warned assault disputed warning; demanded guests obliterated eyes taste punishment warning; came morning abiding punishment; taste punishment warning; made Quran easy remembrance will remember; certainly came people Pharaoh warning; denied signs all seized seizure Exalted Might Perfect Ability; disbelievers better former ones immunity scripture; say assembly supporting; assembly defeated turn backs retreat",
    mainLabel: "Lot's people denying the warning struck by a stone-storm save his family rescued before dawn as favour rewarding gratitude; prior warnings disputed and guest-demands answered by eye-obliteration with the taste-punishment command; morning bringing abiding punishment, again with the severity refrain and Quran-ease reminder; Pharaoh's people receiving warnings and denying all signs, seized by the Exalted Mighty Perfect-in-Ability; current disbelievers challenged whether they are superior or possess scriptural immunity; their claimed mutual-support assembly declared destined for defeat and retreat" },
  { id: "ext-054-p4", from: 46, to: 55,
    label: "Hour appointment more disastrous bitter; indeed criminals error madness; Day dragged Fire faces taste touch Saqar; indeed all things created predestination; command one glance eye; already destroyed kinds will remember; everything did written records; every small great inscribed; indeed righteous among gardens rivers; seat honor near Sovereign Perfect Ability",
    mainLabel: "The Hour named as their appointed punishment, more disastrous and bitter than any worldly defeat; criminals identified as being in error and madness; dragged into the Fire on their faces and told to taste Saqar's touch; all things created with predestination and divine command executed in a single glance; prior kinds destroyed as reminder; every deed recorded in writing, small and great inscribed; the righteous placed among gardens and rivers in a seat of honour near the Sovereign Perfect in Ability" }
];

const SUB_LABELS = {
  "ext-054-p1": [
    "The Hour has come near and the moon has split",
    "Miracles seen yet dismissed as passing magic",
    "Denial following inclination despite every matter having its settlement",
    "Deterrent information and extensive wisdom already arrived",
    "Warning proving unavailing despite wisdom",
    "Leave them until the Day the Caller summons to something forbidding",
    "Humbled eyes emerging from graves like spreading locusts",
    "Racing toward the Caller while disbelievers name it a difficult Day",
    "Noah's people denying the servant called madman and repelling him",
    "His invocation answered: I am overpowered so help",
    "Heaven's gates opened with pouring rain",
    "Earth bursting with springs, waters meeting for a predestined matter",
    "Carried on plank-and-nail construction",
    "Sailing under divine observation as reward for the denied one",
    "Left as a sign with the challenge to remember",
    "Severity of punishment and warning declared",
    "Quran made easy for remembrance with the challenge to remember"
  ],
  "ext-054-p2": [
    "Aad denied the warning",
    "Screaming wind sent on a day of continuous misfortune",
    "People extracted like uprooted palm-tree trunks",
    "How severe were My punishment and warning after Aad's destruction",
    "And We have certainly made the Quran easy for remembrance — so is there any who will remember after Aad",
    "Thamud denied the warning",
    "Rejecting a single human messenger as error and madness",
    "Calling him an insolent liar and questioning the message's origin",
    "Told they will know tomorrow who the insolent liar is",
    "She-camel sent as trial with commands to watch and be patient",
    "Water shared between them by daily turns",
    "Their companion daring to hamstring the she-camel",
    "How severe were My punishment and warning after Thamud's destruction",
    "One blast from the sky reducing them to dry twig fragments",
    "And We have certainly made the Quran easy for remembrance — so is there any who will remember after Thamud"
  ],
  "ext-054-p3": [
    "Lot's people denied the warning",
    "Storm of stones sent upon them",
    "Family of Lot saved before dawn as divine favour rewarding gratitude",
    "Prior warnings disputed despite having been delivered",
    "Guest-demands answered by eye-obliteration with taste-punishment command",
    "Morning bringing an abiding punishment",
    "Taste My punishment and warning reiterated to Lot's people",
    "And We have certainly made the Quran easy for remembrance — so is there any who will remember after Lot",
    "Pharaoh's people received warnings",
    "All signs denied, seized by the Exalted Mighty Perfect in Ability",
    "Current disbelievers challenged: are you superior or immune by scripture",
    "Their claim of mutual-support assembly noted",
    "Assembly destined for defeat and retreat"
  ],
  "ext-054-p4": [
    "The Hour named as their appointment, more disastrous and bitter",
    "Criminals identified as being in error and madness",
    "Dragged into the Fire on their faces and told to taste Saqar's touch",
    "All things created with predestination",
    "Divine command executed in a single glance",
    "Prior kinds destroyed as reminder with the challenge to remember",
    "Every deed recorded in written registers",
    "Every small and great thing inscribed",
    "The righteous placed among gardens and rivers",
    "In a seat of honour near the Sovereign Perfect in Ability"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`54:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`54:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 54, surahName: "Al-Qamar",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 8 genuine re-extraction. Boundaries follow the text: P1 closes with the Quran-ease reminder (17) before the Aad narrative opens (18); P2 ends with the second Quran-ease reminder after Thamud (32) before Lot's people begin (33); P3 runs through Lot, Pharaoh and the assembly-defeat declaration (33-45); P4 covers the Hour appointment, Saqar, predestination, records and the righteous reward (46-55).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (54:1-17) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["54:6"], excerpt: fv(6), description: "So leave them until the Day the Caller calls to something forbidding." });

  e.humanConditionsAndSpiritualStates.push({ label: "Miracles dismissed as passing magic while denial follows inclination", keys: ["54:2","54:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Humbled eyes emerging from graves like spreading locusts racing toward the Caller", keys: ["54:7","54:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.propheticNarratives.push({ label: "Noah's people denying and repelling the servant called madman; his invocation answered by heaven's rain-gates and earth's springs; carried on planks and nails sailing under divine observation", keys: ["54:9","54:10","54:11","54:12","54:13","54:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Moon-splitting as sign of the Hour's nearness", keys: ["54:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Noah's ark left as a sign with the repeated challenge to remember", keys: ["54:15"], evidenceClass: "EXPLICIT_TEXT" });

  const qamar = findWord(1, ["\u0642","\u0645","\u0631"]);
  if (qamar) e.terminology.push({ term: qamar, transliteration: "qamar", gloss: "moon (editorial gloss)", keys: ["54:1"] });
}

// === POPULATE P2 (54:18-32) ===
{
  const e = extractions[1];

  e.propheticNarratives.push({ label: "Aad denied; screaming wind on continuous-misfortune day extracting people like uprooted palm trunks", keys: ["54:18","54:19","54:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Thamud denied warning; rejected single human messenger; she-camel sent as trial; companion hamstrung her; one blast reduced them to dry twig fragments", keys: ["54:23","54:24","54:25","54:26","54:27","54:28","54:29","54:30","54:31"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["54:27"], excerpt: fv(27), description: "Indeed We are sending the she-camel as trial for them, so watch them and be patient." });

  e.humanConditionsAndSpiritualStates.push({ label: "Rejecting a single human messenger as error and madness", keys: ["54:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Companion daring to hamstring the divinely-sent she-camel", keys: ["54:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Water-sharing protocol by daily turns as test condition for Thamud", keys: ["54:28"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P3 (54:33-45) ===
{
  const e = extractions[2];

  e.propheticNarratives.push({ label: "Lot's people denied warning; storm of stones; family saved before dawn as favour; guest-demands answered by eye-obliteration; morning brought abiding punishment", keys: ["54:33","54:34","54:35","54:36","54:37","54:38","54:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Pharaoh's people denied all signs; seized by the Exalted Mighty Perfect in Ability", keys: ["54:41","54:42"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Disputing warnings despite prior delivery and demanding the prophet's guests", keys: ["54:36","54:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Claiming mutual-support assembly destined for defeat and retreat", keys: ["54:44","54:45"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Family of Lot saved before dawn as divine favour rewarding gratitude", keys: ["54:34","54:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Current disbelievers challenged on superiority or scriptural immunity", keys: ["54:43"], evidenceClass: "EXPLICIT_TEXT" });

  const aziz = findWord(42, ["\u0639","\u0632","\u064a","\u0632"]);
  const muqtadir = findWord(42, ["\u0645","\u0642","\u062a","\u062f","\u0631"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["54:42"] });
  if (muqtadir) e.divineNamesAndAttributes.push({ term: muqtadir, transliteration: "Muqtadir", gloss: "Perfect in Ability (editorial gloss)", keys: ["54:42"] });
}

// === POPULATE P4 (54:46-55) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Criminals identified as being in error and madness", keys: ["54:47"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Dragged into the Fire on their faces and told to taste Saqar's touch", keys: ["54:48"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "All things created with predestination and divine command in a single glance", keys: ["54:49","54:50"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Every deed recorded in writing, small and great inscribed", keys: ["54:52","54:53"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Righteous among gardens and rivers in a seat of honour near the Sovereign Perfect in Ability", keys: ["54:54","54:55"], evidenceClass: "EXPLICIT_TEXT" });

  const saqar = findWord(48, ["\u0633","\u0642","\u0631"]);
  if (saqar) e.terminology.push({ term: saqar, transliteration: "Saqar", gloss: "Hellfire name (editorial gloss)", keys: ["54:48"] });
  const qadar = findWord(49, ["\u0642","\u062f","\u0631"]);
  if (qadar) e.terminology.push({ term: qadar, transliteration: "qadar", gloss: "predestination/measure (editorial gloss)", keys: ["54:49"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `054-al-qamar-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 054-al-qamar-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-054-p1,ext-054-p2,ext-054-p3,ext-054-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1654", label: "Moon-splitting as sign of the Hour's nearness", def: "In 54:1: The Hour has come near and the moon has split.", key: "54:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ishaqq al-qamar as eschatological sign."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Cosmic miracle grounding the surah."}] },
  { id: "cand-1655", label: "Miracles dismissed as magic while denial follows inclination", def: "In 54:2-3: And if they see a miracle they turn away and say passing magic; and they denied and followed their inclinations but for every matter is a time of settlement.", key: "54:2", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Sihr dismissal pattern."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Mustaqarr appointment."}] },
  { id: "cand-1656", label: "Resurrection emergence like spreading locusts racing to the Caller", def: "In 54:7-8: Their eyes humbled they will emerge from the graves as if they were locusts spreading racing ahead toward the Caller; the disbelievers will say this is a difficult Day.", key: "54:7", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Jarad imagery."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Yawm 'asir named."}] },
  { id: "cand-1657", label: "Noah's flood as predestined sign with ark sailing under observation", def: "In 54:9-15: People of Noah denied Our servant called madman repelled; he invoked I am overpowered so help; We opened heaven's gates with rain and earth burst with springs; carried on planks and nails sailing under Our observation as reward for the denied; left as a sign.", key: "54:9", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Nuh narrative condensed."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Flood as ayah baqiyah."}] },

  { id: "cand-1658", label: "Aad destroyed by screaming wind extracting like uprooted palms", def: "In 54:18-21: Aad denied; We sent upon them a screaming wind on a day of continuous misfortune extracting the people as if they were trunks of palm trees uprooted.", key: "54:18", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Rih sarsar punishment."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Nakhl khawiyah imagery."}] },
  { id: "cand-1659", label: "Thamud's she-camel trial and hamstringing answered by one blast", def: "In 54:23-31: Thamud denied the warning saying is it one human among us; We sent the she-camel as trial; they hamstrung her; We sent one blast from the sky and they became like dry twig fragments.", key: "54:23", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Salih narrative."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Naqah as fitnah."}] },
  { id: "cand-1660", label: "Lot's people struck by stone-storm with family saved before dawn", def: "In 54:33-39: People of Lot denied warning; We sent storm of stones except family saved before dawn as favour; they disputed warning and demanded guests; We obliterated their eyes; morning brought abiding punishment.", key: "54:33", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Lut narrative."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Family rescue as ni'mah."}] },

  { id: "cand-1661", label: "Pharaoh's people seized by the Exalted Mighty Perfect in Ability", def: "In 54:41-42: There certainly came to Pharaoh's people warning; they denied Our signs all of them so We seized them with a seizure of One Exalted in Might Perfect in Ability.", key: "54:41", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Aziz Muqtadir pairing."},{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Fir'aun destruction."}] },
  { id: "cand-1662", label: "All things created with predestination; command in a single glance", def: "In 54:49-50: Indeed all things We created with predestination; and Our command is but one like a glance of the eye.", key: "54:49", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Qadar foundational ayah."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Amr wahid instantaneous."}] },
  { id: "cand-1663", label: "Every deed inscribed in written records, small and great", def: "In 54:52-53: And everything they did is in written records; and every small and great thing is inscribed.", key: "54:52", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Zubur recording."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Complete inscription."}] },
  { id: "cand-1664", label: "Righteous in gardens and rivers at seat of honour near the Sovereign", def: "In 54:54-55: Indeed the righteous will be among gardens and rivers in a seat of honour near a Sovereign Perfect in Ability.", key: "54:54", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Maq'ad sidq reward."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Malik Muqtadir closure."}] }
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
    notes: "Wave 8 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 6).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(6, 8).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(8, 11).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `054-al-qamar-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-078.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-078.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");