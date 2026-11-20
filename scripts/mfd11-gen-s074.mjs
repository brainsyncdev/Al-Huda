// MFD-11 Wave 11: Surah 74 (Al-Muddaththir) genuine re-extraction.
// Covers 74:1-56 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "074-0001-0056.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 74:${n} not found`);
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

console.log("Generating Surah 74 (Al-Muddaththir) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T20:25:00.000Z";

const PASSAGES = [
  { id: "ext-074-p1", from: 1, to: 10,
    label: "O covers himself garment; arise warn; Lord glorify; clothing purify; uncleanliness avoid; do not confer favor acquire more; Lord patient; trumpet blown; Day difficult day; disbelievers not easy",
    mainLabel: "The covered one commanded to arise and warn, glorify his Lord, purify his clothing and avoid uncleanliness; prohibited from conferring favours to acquire more, urged instead toward patience for his Lord; when the trumpet is blown that Day will be difficult — not easy for the disbelievers" },
  { id: "ext-074-p2", from: 11, to: 31,
    label: "leave Me one created alone; granted extensive wealth; children present; spread everything before easing life; desires add more; No indeed obstinate toward Our verses; cover him arduous torment; thought deliberated; destroyed how deliberated; destroyed how deliberated; considered again; frowned scowled; turned back arrogant; said not but magic imitated others; not but word human being; drive him Saqar; what make know Saqar; lets nothing remain leaves nothing unburned; blackening skins; over nineteen angels; not made keepers Fire except angels not made number except trial disbelieve given Scripture convinced believed increase faith given Scripture believers not doubt hearts hypocrisy disbelievers say what Allah intend example; thus Allah leave astray wills guides wills none knows soldiers Lord except Him mention Fire reminder humanity",
    mainLabel: "Leave to Allah the one He created alone granting extensive wealth, present children and eased life, yet who desires more while remaining obstinate toward divine verses — he will be covered with arduous torment; his thinking and deliberation cursed twice, followed by frowning, scowling, turning back arrogantly and dismissing revelation as imitated magic or mere human speech; the verdict: Saqar that leaves nothing unburned and blackens skins, overseen by nineteen angels whose number serves as a trial so Scripture-recipients are convinced, believers increase in faith, neither group doubts, while hypocrites and disbelievers question the example — thus Allah misguides and guides by will, none knowing His soldiers except Him, with the Fire's mention serving as humanity's reminder" },
  { id: "ext-074-p3", from: 32, to: 48,
    label: "No moon; night departs; morning brightens; indeed Fire greatest afflictions warning humanity whoever wills proceed stay behind; every soul earned retained except companions right gardens questioning each other criminals asking what put Saqar; say not those prayed; nor feed poor; enter vain discourse engaged; deny Day Recompense; came certainty; not benefit intercession intercessors",
    mainLabel: "Oaths by the moon, departing night and brightening morning establishing the Fire as one of the greatest afflictions and a warning to humanity for whoever chooses to proceed or stay behind; every soul retained for its earnings except the companions of the right in gardens questioning the criminals about what put them into Saqar; their confession: we did not pray, did not feed the poor, entered vain discourse and denied the Day of Recompense until certainty arrived; no intercession will benefit them" },
  { id: "ext-074-p4", from: 49, to: 56,
    label: "what matter turning away reminder; alarmed donkeys fleeing lion; rather every person desires scriptures spread about; No not fear Hereafter; No indeed Quran reminder; whoever wills remember; not remember except Allah wills worthy fear adequate forgiveness",
    mainLabel: "Their turning from the reminder questioned through the simile of alarmed donkeys fleeing a lion; each desiring individually distributed scriptures exposed as refusal rooted in not fearing the Hereafter; the Quran affirmed as a reminder remembered only by whoever wills under divine will, since He alone is worthy of fear and adequate for granting forgiveness" }
];

const SUB_LABELS = {
  "ext-074-p1": [
    "The covered one addressed by his state",
    "Commanded to arise and warn",
    "His Lord to be glorified",
    "His clothing to be purified",
    "Uncleanliness to be avoided",
    "Prohibited from conferring favours to acquire more",
    "Patience for his Lord commanded instead",
    "When the trumpet is blown",
    "That Day declared a difficult day",
    "Not easy for the disbelievers"
  ],
  "ext-074-p2": [
    "Leave to Allah the one He created alone",
    "Granted extensive wealth",
    "Children present with him",
    "Everything spread before him easing his life",
    "Yet he desires that Allah add more",
    "Refusal: he has been obstinate toward divine verses",
    "He will be covered with arduous torment",
    "Indeed he thought and deliberated",
    "May he be destroyed for how he deliberated",
    "Repeated: may he be destroyed for how he deliberated",
    "Then he considered again",
    "Then he frowned and scowled",
    "Then he turned back and was arrogant",
    "Dismissing revelation as imitated magic",
    "And as mere human speech",
    "The verdict: I will drive him into Saqar",
    "What can make you know what Saqar is",
    "It lets nothing remain and leaves nothing unburned",
    "Blackening the skins",
    "Over it are nineteen angels",
    "Keepers of the Fire made only angels with their number as trial for disbelievers so Scripture-recipients are convinced, believers increase in faith, neither group doubts, while hypocrites and disbelievers question the example — Allah misguides and guides by will, none knowing His soldiers except Him, the Fire's mention being humanity's reminder"
  ],
  "ext-074-p3": [
    "Oath sworn by the moon",
    "And by the night when it departs",
    "And by the morning when it brightens",
    "The Fire named among the greatest afflictions",
    "As a warning to humanity",
    "To whoever wills among you to proceed or stay behind",
    "Every soul retained for what it earned except the companions of the right",
    "The companions of the right in gardens",
    "Questioning each other in the gardens",
    "About the criminals specifically",
    "Asking what put them into Saqar",
    "They confess: we were not of those who prayed",
    "Nor did we feed the poor",
    "We entered vain discourse with those engaged in it",
    "We denied the Day of Recompense",
    "Until certainty arrived",
    "No intercession of any intercessors will benefit them"
  ],
  "ext-074-p4": [
    "Their turning from the reminder questioned",
    "Simile of alarmed donkeys",
    "Fleeing from a lion specifically",
    "Each desiring individually distributed scriptures",
    "Refusal grounded in not fearing the Hereafter",
    "The Quran affirmed as a reminder",
    "Remembered by whoever wills",
    "But none remembers except by Allah's will — He is worthy of fear and adequate for forgiveness"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`74:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`74:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 74, surahName: "Al-Muddaththir",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 11 genuine re-extraction. Boundaries follow the text: P1 closes with the difficult-Day declaration for disbelievers (10) before the Walid-profile and Saqar block opens (11); P2 ends with the Fire-as-humanity-reminder statement (31) before the moon-night-morning oaths begin (32); P3 runs through the oath triad, the criminal-confession dialogue and the intercession-nullification (32-48); P4 covers the donkey simile, scripture-demand exposure, Quran-as-reminder and closing divine-will affirmation (49-56).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (74:1-10) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["74:2"], excerpt: fv(2), description: "Arise and warn." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["74:3"], excerpt: fv(3), description: "Glorify your Lord." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["74:4"], excerpt: fv(4), description: "Purify your clothing." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["74:5"], excerpt: fv(5), description: "Avoid uncleanliness." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["74:6"], excerpt: fv(6), description: "Do not confer favour to acquire more." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["74:7"], excerpt: fv(7), description: "For your Lord be patient." });

  e.humanConditionsAndSpiritualStates.push({ label: "Trumpet blast heralding a difficult Day that is not easy for disbelievers", keys: ["74:8","74:9","74:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Five-fold prophetic commission: arise, warn, glorify, purify, avoid impurity", keys: ["74:2","74:3","74:4","74:5"], evidenceClass: "EXPLICIT_TEXT" });

  const muddaththir = findWord(1, ["\u0645","\u062f","\u062b","\u0631"]);
  if (muddaththir) e.terminology.push({ term: muddaththir, transliteration: "al-muddaththir", gloss: "the covered one (editorial gloss)", keys: ["74:1"] });
  const rujz = findWord(5, ["\u0631","\u062c","\u0632"]);
  if (rujz) e.terminology.push({ term: rujz, transliteration: "rujz", gloss: "uncleanliness (editorial gloss)", keys: ["74:5"] });
}

// === POPULATE P2 (74:11-31) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Extensive wealth, present children and eased life producing desire for more alongside obstinacy", keys: ["74:12","74:13","74:14","74:15","74:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Deliberation leading to dismissal as magic or human speech, answered by destruction-curse", keys: ["74:18","74:19","74:20","74:21","74:22","74:23","74:24","74:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Nineteen angels over Saqar with their number as trial producing conviction, increased faith or doubt", keys: ["74:30","74:31"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Saqar described as leaving nothing unburned and blackening skins", keys: ["74:28","74:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Arduous torment covering the obstinate denier despite divine bounty", keys: ["74:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine misguidance and guidance by will with soldiers known only to Him", keys: ["74:31"], evidenceClass: "EXPLICIT_TEXT" });

  const saqar = findWord(26, ["\u0633","\u0642","\u0631"]);
  if (saqar) e.terminology.push({ term: saqar, transliteration: "Saqar", gloss: "a named level of Hellfire (editorial gloss)", keys: ["74:26"] });
  const tisataAshar = findWord(30, ["\u062a","\u0633","\u0639","\u0629"]);
  // Using 'nineteen' reference
  const ashara = findWord(30, ["\u0639","\u0634","\u0631"]);
  if (ashara) e.terminology.push({ term: ashara, transliteration: "tis'ata 'ashar", gloss: "nineteen (editorial gloss)", keys: ["74:30"] });
}

// === POPULATE P3 (74:32-48) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Criminals confessing four failures: prayer neglect, poor-feeding neglect, vain discourse and denial of the Day", keys: ["74:43","74:44","74:45","74:46"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Certainty arriving too late for intercession to benefit", keys: ["74:47","74:48"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Neglect of feeding the poor listed alongside prayer abandonment as grounds for Saqar", keys: ["74:44"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Moon, departing night and brightening morning sworn by to establish the Fire's gravity", keys: ["74:32","74:33","74:34"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Companions of the right in gardens questioning criminals across the boundary", keys: ["74:39","74:40","74:41","74:42"], evidenceClass: "EXPLICIT_TEXT" });

  const yaqeen = findWord(47, ["\u064a","\u0642","\u064a","\u0646"]);
  if (yaqeen) e.terminology.push({ term: yaqeen, transliteration: "al-yaqin", gloss: "certainty/death (editorial gloss)", keys: ["74:47"] });
}

// === POPULATE P4 (74:49-56) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Turning from the reminder likened to alarmed donkeys fleeing a lion", keys: ["74:49","74:50","74:51"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Desire for individual scriptures exposed as refusal rooted in not fearing the Hereafter", keys: ["74:52","74:53"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Quran affirmed as reminder remembered only by Allah's will", keys: ["74:54","74:55","74:56"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Allah alone worthy of fear and adequate for forgiveness", keys: ["74:56"], evidenceClass: "EXPLICIT_TEXT" });

  const mudhakkir = findWord(54, ["\u0630","\u0643","\u0631"]);
  // Using 'reminder' reference
  const dhikra = findWord(54, ["\u0630","\u0643","\u0631","\u0649"]);
  if (dhikra) e.terminology.push({ term: dhikra, transliteration: "dhikrah", gloss: "reminder (editorial gloss)", keys: ["74:54"] });
  const taqwa = findWord(56, ["\u0623","\u0647","\u0644"]);
  // Using 'worthy of fear' reference
  const ahluTaqwa = findWord(56, ["\u062a","\u0642","\u0648","\u0649"]);
  if (ahluTaqwa) e.terminology.push({ term: ahluTaqwa, transliteration: "ahl al-taqwa", gloss: "worthy of fear/taqwa (editorial gloss)", keys: ["74:56"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `074-al-muddaththir-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 074-al-muddaththir-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-074-p1,ext-074-p2,ext-074-p3,ext-074-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1851", label: "Five-fold prophetic commission: arise, warn, glorify, purify, avoid impurity", def: "In 74:1-5: O you who covers himself with a garment; arise and warn; and your Lord glorify; and your clothing purify; and uncleanliness avoid.", key: "74:1", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Muddaththir commission sequence."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Physical and ritual purity joined."}] },
  { id: "cand-1852", label: "Favour-conferring prohibited; patience for the Lord commanded instead", def: "In 74:6-7: And do not confer favor to acquire more; but for your Lord be patient.", key: "74:6", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr replacing transactional giving."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Mann prohibited in da'wah."}] },

  { id: "cand-1853", label: "Bounty recipient demanding more while obstinate toward verses", def: "In 74:11-16: Leave Me with the one I created alone and to whom I granted extensive wealth and children present with him and spread everything before him easing his life; then he desires that I should add more; no indeed he has been toward Our verses obstinate.", key: "74:11", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Ni'mah producing kufr."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Wealth as fitnah not proof."}] },
  { id: "cand-1854", label: "Deliberation producing dismissal as magic or human speech, cursed twice", def: "In 74:18-25: Indeed he thought and deliberated; so may he be destroyed for how he deliberated; then may he be destroyed for how he deliberated; then he considered again; then he frowned and scowled; then he turned back and was arrogant; and said this is not but magic imitated from others; this is not but the word of a human being.", key: "74:18", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Fikr misused to reject."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Tawalla wa-stakbara diagnosed."}] },
  { id: "cand-1855", label: "Saqar leaving nothing unburned with nineteen angel-keepers as trial", def: "In 74:26-31: I will drive him into Saqar; and what can make you know what is Saqar; it lets nothing remain and leaves nothing unburned; blackening the skins; over it are nineteen angels; and We have not made the keepers of the Fire except angels and We have not made their number except as a trial for those who disbelieve.", key: "74:26", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"La tubqi wa-la tadhar."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Khazana al-nar numbered."}] },

  { id: "cand-1856", label: "Criminal confession: no prayer, no feeding, vain discourse, denial until certainty", def: "In 74:42-47: Asking them what put you into Saqar; they will say we were not of those who prayed; nor did we used to feed the poor; and we used to enter into vain discourse with those who engaged in it; and we used to deny the Day of Recompense; until there came to us the certainty.", key: "74:42", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Salat absence as primary cause."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"It'am al-miskin neglected."}] },
  { id: "cand-1857", label: "Intercession nullified after certainty arrives", def: "In 74:48: So there will not benefit them the intercession of any intercessors.", key: "74:48", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Shafa'ah void post-yaqin."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual responsibility sealed."}] },

  { id: "cand-1858", label: "Quran as reminder remembered only by Allah's will", def: "In 74:54-56: No indeed the Quran is a reminder; then whoever wills will remember it; and they will not remember except that Allah wills; He is worthy of fear and adequate for granting forgiveness.", key: "74:54", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Dhikrah function defined."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Human will nested under divine will."}] }
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
extractions[3].topicCandidateIds = candidates.candidates.slice(7, 8).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `074-al-muddaththir-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-098.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-098.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");