// MFD-11 Wave 12: Surah 79 (An-Nazi'at) genuine re-extraction.
// Covers 79:1-46 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "079-0001-0046.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 79:${n} not found`);
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

console.log("Generating Surah 79 (An-Nazi'at) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T21:15:00.000Z";

const PASSAGES = [
  { id: "ext-079-p1", from: 1, to: 14,
    label: "By angels extract violence; remove ease; glide swimming; race each other race; arrange matter; Day blast convulse creation; follow subsequent one; Hearts Day tremble; eyes humbled; presently saying indeed returned former state life; even decayed bones; say that then losing return; Indeed one shout; suddenly alert upon earth surface",
    mainLabel: "Oaths by angels who extract violently, remove gently, glide as if swimming, race ahead and arrange affairs; on the Day the first blast convulses creation followed by a second, hearts trembling and eyes humbled; their present claim that they will not be returned even as decayed bones — calling it a losing return — answered by the declaration that it will be but one shout after which they are suddenly alert upon the earth's surface" },
  { id: "ext-079-p2", from: 15, to: 26,
    label: "Has reached you story Moses; Lord called sacred valley Tuwa; Go Pharaoh Indeed transgressed; say Would you purify yourself; let me guide you Lord so fear Him; showed him greatest sign; Pharaoh denied disobeyed; turned back striving; gathered people called out; said I am your most exalted lord; Allah seized exemplary punishment last first transgression; Indeed warning whoever would fear Allah",
    mainLabel: "The story of Moses recalled: his Lord calling him in the sacred valley of Tuwa and sending him to the transgressing Pharaoh with an invitation to purification and guidance toward fearing his Lord; Moses showing the greatest sign yet Pharaoh denying, disobeying, turning back in opposition, gathering his people and declaring himself their most exalted lord; Allah seizing him with exemplary punishment covering both his last and first transgressions as a warning for whoever fears Allah" },
  { id: "ext-079-p3", from: 27, to: 33,
    label: "Are you more difficult creation or heaven Allah constructed it; raised ceiling proportioned it; darkened night extracted brightness; after spread earth; extracted water pasture; mountains set firmly; provision you grazing livestock",
    mainLabel: "Man questioned whether he is a more difficult creation than the heaven that Allah constructed, raising its ceiling and proportioning it, darkening its night and extracting its brightness, then spreading the earth and extracting its water and pasture, setting mountains firmly as provision for humanity and grazing livestock" },
  { id: "ext-079-p4", from: 34, to: 46,
    label: "When comes greatest Overwhelming Calamity; Day man remember strove; Hellfire exposed those see; transgressed preferred life world; Indeed Hellfire refuge; feared position Lord prevented soul unlawful inclination; Indeed Paradise refuge; ask Muhammad Hour when arrival; what position should mention it; Lord finality; only warner those fear it; Day see it though not remained except afternoon morning thereof",
    mainLabel: "When the greatest Overwhelming Calamity arrives, man will remember what he strove for and Hellfire will be exposed for all who see; the transgressor who preferred worldly life finds Hellfire as his refuge while the one who feared his Lord's position and restrained his soul from unlawful inclination finds Paradise as his refuge; the Hour's timing asked of the Prophet who has no standing to declare it since its finality rests with his Lord, his role limited to warning those who fear it; on the Day they see it they will feel as though they had remained in the world only an afternoon or a morning" }
];

const SUB_LABELS = {
  "ext-079-p1": [
    "Angels who extract with violence sworn by",
    "Angels who remove with ease sworn by",
    "Angels who glide as if swimming sworn by",
    "Angels who race each other in a race sworn by",
    "Angels who arrange each matter sworn by",
    "The Day the first blast convulses creation",
    "Followed by the subsequent blast",
    "Hearts trembling on that Day",
    "Eyes humbled in dread",
    "Their present claim questioning return to former life",
    "Even if reduced to decayed bones",
    "Dismissing resurrection as a losing return",
    "The answer: it will be but one shout",
    "Suddenly they will be alert upon the earth's surface"
  ],
  "ext-079-p2": [
    "The story of Moses introduced rhetorically",
    "His Lord calling him in the sacred valley of Tuwa",
    "Commissioned to go to Pharaoh who has transgressed",
    "Invitation to purification offered",
    "Guidance toward fearing the Lord proposed",
    "The greatest sign shown to Pharaoh",
    "Pharaoh denied and disobeyed",
    "He turned his back striving in opposition",
    "Gathered his people and called out to them",
    "Declared himself their most exalted lord",
    "Allah seized him with exemplary punishment for last and first transgression",
    "A warning therein for whoever fears Allah"
  ],
  "ext-079-p3": [
    "Man questioned: are you more difficult to create than the heaven",
    "Allah constructed it and raised its ceiling and proportioned it",
    "Darkened its night and extracted its brightness",
    "After that He spread the earth",
    "Extracted from it its water and its pasture",
    "Mountains set firmly",
    "As provision for you and your grazing livestock"
  ],
  "ext-079-p4": [
    "The greatest Overwhelming Calamity arriving",
    "Man remembering what he strove for on that Day",
    "Hellfire exposed for all who see",
    "The transgressor identified by his preference for worldly life",
    "Hellfire named as his refuge",
    "The one who feared his Lord's position and restrained his soul from inclination",
    "Paradise named as his refuge",
    "They ask you about the Hour: when is its arrival",
    "In what position are you that you should mention it",
    "To your Lord is its finality",
    "You are only a warner for those who fear it",
    "On the Day they see it, the reckoning becomes real",
    "As though they had remained in the world only an afternoon or a morning thereof"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`79:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`79:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 79, surahName: "An-Nazi'at",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the sudden-alertness-after-one-shout statement (14) before the Musa narrative opens (15); P2 ends with the warning-for-the-God-fearing conclusion (26) before the creation-comparison argument begins (27); P3 runs through the heaven-earth-mountain provision catalogue (27-33); P4 covers the Overwhelming Calamity, the two-refuge outcomes, the Hour-timing question and the closing time-compression simile (34-46).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (79:1-14) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Hearts trembling and eyes humbled at the twin blasts", keys: ["79:8","79:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Present denial of resurrection even from decayed bones dismissed as a losing-return claim", keys: ["79:10","79:11","79:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Five-fold oath by angelic functions grounding eschatological certainty", keys: ["79:1","79:2","79:3","79:4","79:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "One shout producing sudden alertness on the earth's surface", keys: ["79:13","79:14"], evidenceClass: "EXPLICIT_TEXT" });

  const naziat = findWord(1, ["\u0646","\u0632","\u0639"]);
  if (naziat) e.terminology.push({ term: naziat, transliteration: "al-nazi'at", gloss: "those who extract violently (editorial gloss)", keys: ["79:1"] });
  const nashitat = findWord(2, ["\u0646","\u0634","\u0637"]);
  if (nashitat) e.terminology.push({ term: nashitat, transliteration: "al-nashitat", gloss: "those who remove gently (editorial gloss)", keys: ["79:2"] });
  const sabihat = findWord(3, ["\u0633","\u0628","\u062d"]);
  if (sabihat) e.terminology.push({ term: sabihat, transliteration: "al-sabihat", gloss: "those who glide/swim (editorial gloss)", keys: ["79:3"] });
  const rajifah = findWord(6, ["\u0631","\u062c","\u0641"]);
  if (rajifah) e.terminology.push({ term: rajifah, transliteration: "al-rajifah", gloss: "the convulsing blast (editorial gloss)", keys: ["79:6"] });
}

// === POPULATE P2 (79:15-26) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["79:18"], excerpt: fv(18), description: "Say: Would you purify yourself?" });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["79:19"], excerpt: fv(19), description: "Let me guide you to your Lord so you would fear Him." });

  e.propheticNarratives.push({ label: "Moses called in Tuwa, sent to transgressing Pharaoh with purification invitation and the greatest sign", keys: ["79:15","79:16","79:17","79:18","79:19","79:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Pharaoh denying, disobeying, turning back, gathering people and claiming lordship, seized with exemplary punishment", keys: ["79:21","79:22","79:23","79:24","79:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Transgression met with divine seizure serving as warning for the God-fearing", keys: ["79:25","79:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "False claim of supreme lordship answered by comprehensive punishment", keys: ["79:24","79:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Sacred valley of Tuwa named as the site of Moses's commissioning", keys: ["79:16"], evidenceClass: "EXPLICIT_TEXT" });

  const tuwa = findWord(16, ["\u0637","\u0648","\u0649"]);
  if (tuwa) e.terminology.push({ term: tuwa, transliteration: "Tuwa", gloss: "sacred valley (editorial gloss)", keys: ["79:16"] });
  const ayatKubra = findWord(20, ["\u0643","\u0628","\u0631","\u0649"]);
  if (ayatKubra) e.terminology.push({ term: ayatKubra, transliteration: "al-ayah al-kubra", gloss: "the greatest sign (editorial gloss)", keys: ["79:20"] });
}

// === POPULATE P3 (79:27-33) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Human creation compared to heaven-construction as proof of resurrection power", keys: ["79:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Water, pasture and firmly-set mountains provided for humanity and livestock", keys: ["79:31","79:32","79:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Heaven constructed, ceiling raised, proportioned, night darkened and brightness extracted", keys: ["79:27","79:28","79:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Earth spread after heaven with water and pasture extracted from it", keys: ["79:30","79:31"], evidenceClass: "EXPLICIT_TEXT" });

  const samaa = findWord(27, ["\u0633","\u0645","\u0627","\u0621"]);
  // Using 'heaven' reference
  const bina = findWord(27, ["\u0628","\u0646","\u0649"]);
  if (bina) e.terminology.push({ term: bina, transliteration: "bana'a", gloss: "constructed (editorial gloss)", keys: ["79:27"] });
}

// === POPULATE P4 (79:34-46) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Man remembering his striving when the Overwhelming Calamity arrives", keys: ["79:34","79:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Transgressor preferring worldly life versus God-fearer restraining his soul producing opposite refuges", keys: ["79:37","79:38","79:39","79:40","79:41"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Time compression on the Day: feeling as though only an afternoon or morning had passed", keys: ["79:46"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["79:40"], excerpt: fv(40), description: "Prevented the soul from unlawful inclination — the restraint defining the righteous." });

  e.relationships.push({ label: "Hellfire exposed for all who see on the Day of the Overwhelming Calamity", keys: ["79:36"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Hour's finality with the Lord alone; the Prophet is only a warner for those who fear it", keys: ["79:42","79:43","79:44","79:45"], evidenceClass: "EXPLICIT_TEXT" });

  const ghashiyah = findWord(34, ["\u063a","\u0627","\u0634","\u064a"]);
  if (ghashiyah) e.terminology.push({ term: ghashiyah, transliteration: "al-ghashiyah al-kubra", gloss: "the greatest Overwhelming Calamity (editorial gloss)", keys: ["79:34"] });
  const sahirah = findWord(14, ["\u0633","\u0627","\u0647","\u0631"]);
  // Already used in P1 but noting here for cross-reference
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `079-an-naziat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 079-an-naziat-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-079-p1,ext-079-p2,ext-079-p3,ext-079-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1891", label: "Five-fold angelic oath grounding resurrection certainty", def: "In 79:1-5: By those angels who extract with violence and those who remove with ease and those who glide as if swimming and those who race each other in a race and those who arrange each matter.", key: "79:1", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Naziat nashitat sabihat sabiqat mudabbirat."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Qasam quintuple for yaum al-qiyamah."}] },
  { id: "cand-1892", label: "Twin blasts producing trembling hearts and humbled eyes", def: "In 79:6-9: On the Day the blast of the Horn will convulse creation there will follow it the subsequent one; hearts that Day will tremble; their eyes humbled.", key: "79:6", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Rajifah and radifah sequence."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Wa'ifah and khashi'ah states."}] },
  { id: "cand-1893", label: "Denial of resurrection from decayed bones answered by one-shout emergence", def: "In 79:10-14: They are presently saying will we indeed be returned to our former state of life even if we should be decayed bones; they say that then would be a losing return; indeed it will be but one shout and suddenly they will be alert upon the earth's surface.", key: "79:10", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Ajuz imatah dismissed."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Khusran claim refuted."}] },

  { id: "cand-1894", label: "Moses commissioned in Tuwa with purification invitation and greatest sign", def: "In 79:15-20: Has there reached you the story of Moses when his Lord called to him in the sacred valley of Tuwa; go to Pharaoh indeed he has transgressed; and say to him would you purify yourself and let me guide you to your Lord so you would fear Him; and he showed him the greatest sign.", key: "79:15", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Wadi Muqaddas Tuwa commissioning."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Tazakki and khushyah invitation."}] },
  { id: "cand-1895", label: "Pharaoh's false lordship claim answered by exemplary punishment", def: "In 79:21-26: But Pharaoh denied and disobeyed then he turned his back striving and he gathered his people and called out and said I am your most exalted lord; so Allah seized him in exemplary punishment for the last and the first transgression; indeed in that is a warning for whoever would fear Allah.", key: "79:21", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Nakal akhiri wa-ula."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Ana rabbukum al-a'la exposed."}] },

  { id: "cand-1896", label: "Creation comparison: heaven-construction proving resurrection ability", def: "In 79:27-33: Are you a more difficult creation or is the heaven? Allah constructed it; He raised its ceiling and proportioned it and He darkened its night and extracted its brightness; and after that He spread the earth; He extracted from it its water and its pasture and the mountains He set firmly as provision for you and your grazing livestock.", key: "79:27", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sama' bina' as a fortiori argument."},{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Ashadd khalq challenge."}] },

  { id: "cand-1897", label: "Two refuges: Hellfire for transgressor, Paradise for self-restrainer", def: "In 79:37-41: So as for he who transgressed and preferred the life of the world then indeed Hellfire will be his refuge; but as for he who feared the position of his Lord and prevented the soul from unlawful inclination then indeed Paradise will be his refuge.", key: "79:37", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jahannam vs Jannah binary."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Khafa maqam rabbihi plus naha al-nafs."}] },

  { id: "cand-1898", label: "Hour's timing with Allah alone; Prophet only a warner; time compression on arrival", def: "In 79:42-46: They ask you O Muhammad about the Hour when is its arrival; in what position are you that you should mention it; to your Lord is its finality; you are only a warner for those who fear it; it will be on the Day they see it as though they had not remained except for an afternoon or a morning thereof.", key: "79:42", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ilm al-sa'ah exclusive."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Nadhir-only role reiterated."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 3).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(3, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 6).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(6, 8).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `079-an-naziat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-103.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-103.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");