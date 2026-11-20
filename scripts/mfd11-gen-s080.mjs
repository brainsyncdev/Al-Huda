// MFD-11 Wave 12: Surah 80 ('Abasa) genuine re-extraction.
// Covers 80:1-42 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "080-0001-0042.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 80:${n} not found`);
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

console.log("Generating Surah 80 ('Abasa) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T21:25:00.000Z";

const PASSAGES = [
  { id: "ext-080-p1", from: 1, to: 16,
    label: "Prophet frowned turned away; came blind man interrupting; what make you perceive perhaps purified; reminded remembrance benefit him; thinks himself without need; give attention; not upon you blame if not purified; came striving knowledge; fears Allah; from him distracted; No Indeed verses reminder; whoever wills remember it; recorded honored sheets; exalted purified; carried hands messenger-angels; noble dutiful",
    mainLabel: "The Prophet rebuked for frowning and turning away when the blind man interrupted, since he might have been purified or benefited by remembrance; the self-sufficient one receiving attention while the striving God-fearer is distracted from — yet no blame attaches if the former refuses purification; these verses are a reminder for whoever wills, recorded in honoured, exalted and purified sheets carried by noble and dutiful messenger-angels" },
  { id: "ext-080-p2", from: 17, to: 32,
    label: "Cursed man how disbelieving; what substance create him; sperm-drop created destined; eased way; causes death provides grave; when wills resurrect him; No Man not yet accomplished commanded; let mankind look food; poured water torrents; broke open earth splitting sprouts; caused grow grain; grapes herbage; olive palm trees; gardens dense shrubbery; fruit grass; enjoyment you grazing livestock",
    mainLabel: "Man cursed for his disbelief despite being created from a sperm-drop and destined, his way eased through life before death and burial await, with resurrection following divine will; he has not yet accomplished what was commanded; mankind directed to observe their food — water poured in torrents, earth broken open with sprouts producing grain, grapes, herbage, olives, palms, dense gardens, fruit and grass as enjoyment for humanity and livestock" },
  { id: "ext-080-p3", from: 33, to: 37,
    label: "When comes Deafening Blast; Day man flee brother; mother father; wife children; every man Day matter adequate him",
    mainLabel: "When the Deafening Blast arrives, man will flee from brother, mother, father, wife and children; every person on that Day will have a matter sufficient to occupy him entirely" },
  { id: "ext-080-p4", from: 38, to: 42,
    label: "faces Day bright; laughing rejoicing good news; faces Day upon dust; blackness cover them; disbelievers wicked ones",
    mainLabel: "Faces that Day either bright, laughing and rejoicing at good news, or covered with dust and darkness — the latter identified as the disbelievers and the wicked" }
];

const SUB_LABELS = {
  "ext-080-p1": [
    "The Prophet frowned and turned away",
    "Because the blind man came to him interrupting",
    "What would make you perceive that he might be purified",
    "Or be reminded and the remembrance would benefit him",
    "As for the one who thinks himself without need",
    "To him you give your attention",
    "Yet no blame rests upon you if he refuses purification",
    "But as for the one who came striving for knowledge",
    "While he fears Allah",
    "From him you are distracted",
    "No — indeed these verses are a reminder",
    "So whoever wills may remember it",
    "Recorded in honoured sheets",
    "Exalted and purified",
    "Carried by the hands of messenger-angels",
    "Noble and dutiful"
  ],
  "ext-080-p2": [
    "Cursed is man — how disbelieving he is",
    "From what substance did Allah create him",
    "From a sperm-drop He created and destined him",
    "Then He eased the way for him through life",
    "Then He causes his death and provides a grave",
    "Then when He wills He will resurrect him",
    "No — man has not yet accomplished what Allah commanded",
    "Let mankind look at his food as a sign",
    "Water poured down in torrents",
    "Earth broken open and split with sprouts",
    "Grain caused to grow within it",
    "Grapes and herbage produced",
    "Olive trees and palm trees established",
    "Gardens of dense shrubbery cultivated",
    "Fruit and grass brought forth",
    "All as enjoyment for humanity and grazing livestock"
  ],
  "ext-080-p3": [
    "The Deafening Blast arriving",
    "On that Day a man will flee from his brother",
    "And from his mother and his father",
    "And from his wife and his children",
    "Every person that Day having a matter adequate to occupy him"
  ],
  "ext-080-p4": [
    "Faces that Day will be bright",
    "Laughing and rejoicing at good news",
    "Other faces that Day will have dust upon them",
    "Blackness covering them",
    "Those identified as the disbelievers and the wicked"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`80:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`80:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 80, surahName: "Abasa",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the angelic-carrier description (16) before the human-ingratitude and creation argument opens (17); P2 ends with the agricultural-provision catalogue (32) before the Deafening Blast scene begins (33); P3 covers the five-verse familial-flight sequence (33-37); P4 runs through the bright-versus-darkened faces dichotomy (38-42).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (80:1-16) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["80:1"], excerpt: fv(1), description: "The Prophet frowned and turned away — a prophetic correction." });

  e.humanConditionsAndSpiritualStates.push({ label: "Blind seeker potentially purifiable or benefiting from remembrance, overlooked for the self-sufficient", keys: ["80:2","80:3","80:4","80:5","80:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Striving God-fearer deserving attention yet distracted from", keys: ["80:8","80:9","80:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Verses named a reminder for whoever wills, recorded in honoured purified sheets", keys: ["80:11","80:12","80:13","80:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Messenger-angels described as noble and dutiful carriers of revelation", keys: ["80:15","80:16"], evidenceClass: "EXPLICIT_TEXT" });

  const abasa = findWord(1, ["\u0639","\u0628","\u0633"]);
  if (abasa) e.terminology.push({ term: abasa, transliteration: "'abasa", gloss: "he frowned (editorial gloss)", keys: ["80:1"] });
  const suhuf = findWord(13, ["\u0635","\u062d","\u0641"]);
  if (suhuf) e.terminology.push({ term: suhuf, transliteration: "suhuf mukarramah", gloss: "honoured sheets (editorial gloss)", keys: ["80:13"] });
  const safarah = findWord(15, ["\u0633","\u0641","\u0631"]);
  if (safarah) e.terminology.push({ term: safarah, transliteration: "safarah", gloss: "messenger-angels (editorial gloss)", keys: ["80:15"] });
}

// === POPULATE P2 (80:17-32) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["80:24"], excerpt: fv(24), description: "Let mankind look at his food as a sign of divine provision." });

  e.humanConditionsAndSpiritualStates.push({ label: "Human ingratitude cursed despite creation from sperm-drop and destined path", keys: ["80:17","80:18","80:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Life's ease followed by death, grave and eventual resurrection", keys: ["80:20","80:21","80:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Failure to accomplish what was commanded despite divine facilitation", keys: ["80:23"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Agricultural provision chain: torrential rain, earth-splitting, grain, grapes, herbage, olives, palms, gardens, fruit and grass", keys: ["80:25","80:26","80:27","80:28","80:29","80:30","80:31","80:32"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creation-to-resurrection arc demonstrating divine power over human life cycle", keys: ["80:18","80:19","80:20","80:21","80:22"], evidenceClass: "EXPLICIT_TEXT" });

  const nutfah = findWord(19, ["\u0646","\u0637","\u0641"]);
  if (nutfah) e.terminology.push({ term: nutfah, transliteration: "nutfah", gloss: "sperm-drop (editorial gloss)", keys: ["80:19"] });
  const qaddara = findWord(19, ["\u0642","\u062f","\u0631"]);
  if (qaddara) e.terminology.push({ term: qaddara, transliteration: "fa-qaddarahu", gloss: "destined/proportioned him (editorial gloss)", keys: ["80:19"] });
}

// === POPULATE P3 (80:33-37) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Deafening Blast triggering total preoccupation overriding all familial bonds", keys: ["80:33","80:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Flight from brother, parents, spouse and children on the Day of reckoning", keys: ["80:34","80:35","80:36"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Each person's own matter becoming adequate to fully occupy him on that Day", keys: ["80:37"], evidenceClass: "EXPLICIT_TEXT" });

  const sakhkhah = findWord(33, ["\u0635","\u0627","\u062e"]);
  if (sakhkhah) e.terminology.push({ term: sakhkhah, transliteration: "al-sakhkhah", gloss: "the Deafening Blast (editorial gloss)", keys: ["80:33"] });
}

// === POPULATE P4 (80:38-42) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Bright faces laughing and rejoicing at good news versus dust-covered darkened faces", keys: ["80:38","80:39","80:40","80:41"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Disbelievers and wicked ones identified by their darkened countenances", keys: ["80:42"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Facial appearance as the visible marker of salvific status on the Day", keys: ["80:38","80:40","80:42"], evidenceClass: "EXPLICIT_TEXT" });

  const kafarah = findWord(42, ["\u0643","\u0641","\u0631"]);
  if (kafarah) e.terminology.push({ term: kafarah, transliteration: "kafarah fajarah", gloss: "disbelievers and wicked ones (editorial gloss)", keys: ["80:42"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `080-abasa-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 080-abasa-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-080-p1,ext-080-p2,ext-080-p3,ext-080-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1899", label: "Prophetic correction: blind seeker prioritised over self-sufficient elite", def: "In 80:1-10: The Prophet frowned and turned away because there came to him the blind man interrupting; but what would make you perceive O Muhammad that perhaps he might be purified or be reminded and the remembrance would benefit him; as for he who thinks himself without need to him you give attention and not upon you is any blame if he will not be purified; but as for he who came to you striving for knowledge while he fears Allah from him you are distracted.", key: "80:1", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Adab with seekers corrected."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Prophetic fallibility acknowledged."}] },
  { id: "cand-1900", label: "Revelation as reminder in honoured sheets carried by noble angels", def: "In 80:11-16: No indeed these verses are a reminder so whoever wills may remember it; recorded in honoured sheets exalted and purified carried by the hands of messenger-angels noble and dutiful.", key: "80:11", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"Suhuf mukarramah marfu'ah mutahharah."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Safarah kiraman bararah."}] },

  { id: "cand-1901", label: "Human ingratitude cursed despite creation-ease-death-resurrection arc", def: "In 80:17-23: Cursed is man how disbelieving is he; from what substance did He create him; from a sperm-drop He created him and destined for him; then He eased the way for him; then He causes his death and provides a grave for him; then when He wills He will resurrect him; no man has not yet accomplished what He commanded him.", key: "80:17", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Nutfah-qadar-taysir-mawt-ba'th sequence."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Kufr despite ni'mah diagnosed."}] },
  { id: "cand-1902", label: "Agricultural provision chain as observable sign of divine sustenance", def: "In 80:24-32: Then let mankind look at his food; how We poured down water in torrents then We broke open the earth splitting it with sprouts and caused to grow within it grain and grapes and herbage and olive and palm trees and gardens of dense shrubbery and fruit and grass as enjoyment for you and your grazing livestock.", key: "80:24", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ta'am as daily observable ayah."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Provision preceding command to reflect."}] },

  { id: "cand-1903", label: "Deafening Blast producing flight from all kin and total self-preoccupation", def: "In 80:33-37: But when there comes the Deafening Blast on the Day a man will flee from his brother and his mother and his father and his wife and his children; for every man that Day will be a matter adequate for him.", key: "80:33", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Sakhkhah triggering firar."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Kulla imri'in sha'n yughnihi."}] },

  { id: "cand-1904", label: "Bright rejoicing faces versus dust-covered darkened faces marking belief status", def: "In 80:38-42: Some faces that Day will be bright laughing rejoicing at good news; and other faces that Day will have upon them dust blackness will cover them; those are the disbelievers the wicked ones.", key: "80:38", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Wujuh musfirah vs muswaddah."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Facial markers of salvation."}] }
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
extractions[2].topicCandidateIds = candidates.candidates.slice(4, 5).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(5, 6).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `080-abasa-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-104.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-104.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");