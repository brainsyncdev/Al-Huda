// MFD-11 Wave 11: Surah 78 (An-Naba) genuine re-extraction.
// Covers 78:1-40 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "078-0001-0040.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 78:${n} not found`);
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

console.log("Generating Surah 78 (An-Naba) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T21:05:00.000Z";

const PASSAGES = [
  { id: "ext-078-p1", from: 1, to: 16,
    label: "About what asking one another; great news; over which disagreement; No going know; Then no going know; Have We not made earth resting place; mountains stakes; created you pairs; made sleep rest; made night clothing; made day livelihood; constructed above seven strong heavens; made burning lamp; sent down rain clouds pouring water; bring forth grain vegetation; gardens entwined growth",
    mainLabel: "Their mutual questioning about the great news over which they disagree answered with doubled certainty that they will come to know; the earth made a resting place with mountains as stakes, humanity created in pairs, sleep made for rest, night as clothing and day for livelihood; seven strong heavens constructed above with a burning lamp, pouring water sent down from rain clouds bringing forth grain, vegetation and gardens of entwined growth" },
  { id: "ext-078-p2", from: 17, to: 30,
    label: "Indeed Day Judgement appointed time; Day Horn blown come forth multitudes; heaven opened become gateways; mountains removed become mirage; Indeed Hell lying wait; transgressors place return; remain ages unending; not taste coolness drink; except scalding water foul purulence; appropriate recompense; Indeed not expecting account; denied verses emphatic denial; enumerated everything writing; taste penalty never increase except torment",
    mainLabel: "The Day of Judgement declared an appointed time when the Horn is blown and multitudes come forth, heaven opens into gateways and mountains vanish like a mirage; Hell lying in wait for transgressors as their place of return where they remain for unending ages tasting neither coolness nor drink except scalding water and foul purulence as appropriate recompense; they did not expect an account and denied the verses emphatically, yet everything has been enumerated in writing — taste the penalty with no increase except torment" },
  { id: "ext-078-p3", from: 31, to: 36,
    label: "Indeed righteous attainment; gardens grapevines; full-breasted companions equal age; full cup; no ill speech hear falsehood; reward Lord generous gift made due account",
    mainLabel: "For the righteous there is attainment: gardens and grapevines, full-breasted companions of equal age and a full cup; no ill speech or falsehood heard therein; all as reward from their Lord, a generous gift made due by account" },
  { id: "ext-078-p4", from: 37, to: 40,
    label: "Lord heavens earth whatever between Most Merciful not possess authority speech; Day Spirit angels stand row not speak except one Most Merciful permits said correct; True Day whoever wills take Lord way return; Indeed warned impending punishment Day man observe hands put forth disbeliever say Oh wish were dust",
    mainLabel: "The Lord of heavens, earth and whatever is between them, the Most Merciful, before whom none possesses authority for speech; on that Day the Spirit and angels stand in rows and none speaks except one permitted by the Most Merciful who has spoken correctly; this is the True Day so whoever wills should take a way of return to his Lord; the warning of impending punishment on the Day when a man observes what his hands have put forth and the disbeliever wishes he were dust" }
];

const SUB_LABELS = {
  "ext-078-p1": [
    "Their mutual questioning about something identified",
    "The great news specified as its subject",
    "That over which they are in disagreement",
    "First declaration: they are going to know",
    "Reinforced: they are certainly going to know",
    "The earth made a resting place",
    "Mountains established as stabilising stakes",
    "Humanity created in pairs",
    "Sleep made a means for rest",
    "Night made as clothing",
    "Day made for livelihood",
    "Seven strong heavens constructed above",
    "A burning lamp placed therein",
    "Pouring water sent down from rain clouds",
    "Grain and vegetation brought forth thereby",
    "Gardens of entwined growth produced"
  ],
  "ext-078-p2": [
    "The Day of Judgement declared an appointed time",
    "The Horn blown and multitudes coming forth",
    "Heaven opened becoming gateways",
    "Mountains removed becoming a mirage",
    "Hell lying in wait for the transgressors",
    "Named as their place of return",
    "Remaining therein for unending ages",
    "No coolness or drink tasted therein",
    "Except scalding water and foul purulence",
    "An appropriate recompense for their deeds",
    "They were not expecting any account",
    "And denied the verses with emphatic denial",
    "Everything enumerated in writing",
    "Taste the penalty with no increase except torment"
  ],
  "ext-078-p3": [
    "Attainment promised for the righteous",
    "Gardens and grapevines as its setting",
    "Full-breasted companions of equal age",
    "A full cup served",
    "No ill speech or falsehood heard therein",
    "All as reward from their Lord, a generous gift made due by account"
  ],
  "ext-078-p4": [
    "The Lord of heavens, earth and between them, the Most Merciful, before whom none possesses speech-authority",
    "The Spirit and angels standing in rows, none speaking except by permission with correct speech",
    "The True Day identified; whoever wills takes a way of return to his Lord",
    "Warning of impending punishment when a man observes his deeds and the disbeliever wishes he were dust"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`78:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`78:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 78, surahName: "An-Naba",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 11 genuine re-extraction. Boundaries follow the text: P1 closes with the agricultural-produce catalogue (16) before the Day-of-Judgement appointment opens (17); P2 ends with the no-increase-except-torment verdict (30) before the righteous-attainment block begins (31); P3 covers the six-verse reward description (31-36); P4 runs through divine sovereignty, angelic rows, the True Day and the closing dust-wish (37-40).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (78:1-16) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Mutual questioning about the great news reflecting disagreement and ignorance", keys: ["78:1","78:2","78:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Earth as resting place with mountains as stakes enabling settled life", keys: ["78:6","78:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Sleep for rest, night as clothing and day for livelihood structuring human rhythm", keys: ["78:9","78:10","78:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Pouring rain producing grain, vegetation and gardens of entwined growth", keys: ["78:14","78:15","78:16"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Doubled certainty that they will come to know answering their dispute", keys: ["78:4","78:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Seven strong heavens with a burning lamp completing the cosmic framework", keys: ["78:12","78:13"], evidenceClass: "EXPLICIT_TEXT" });

  const naba = findWord(2, ["\u0646","\u0628","\u0623"]);
  if (naba) e.terminology.push({ term: naba, transliteration: "al-naba' al-azim", gloss: "the great news (editorial gloss)", keys: ["78:2"] });
  const awtad = findWord(7, ["\u0623","\u0648","\u062a","\u0627","\u062f"]);
  if (awtad) e.terminology.push({ term: awtad, transliteration: "awtad", gloss: "stakes/pegs (editorial gloss)", keys: ["78:7"] });
}

// === POPULATE P2 (78:17-30) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Unexpecting of account and emphatic denial of verses producing eternal punishment", keys: ["78:27","78:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Scalding water and foul purulence as the only drink in Hell", keys: ["78:24","78:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Everything enumerated in writing ensuring precise accountability", keys: ["78:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Horn blast producing multitudes emerging toward opened heaven and vanished mountains", keys: ["78:18","78:19","78:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Hell lying in wait as the transgressors' place of return for unending ages", keys: ["78:21","78:22","78:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Appropriate recompense followed by no increase except torment", keys: ["78:26","78:30"], evidenceClass: "EXPLICIT_TEXT" });

  const yawm = findWord(17, ["\u064a","\u0648","\u0645"]);
  // Using 'appointed time' reference
  const miqat = findWord(17, ["\u0645","\u064a","\u0642","\u0627","\u062a"]);
  if (miqat) e.terminology.push({ term: miqat, transliteration: "miqat", gloss: "appointed time (editorial gloss)", keys: ["78:17"] });
  const ghassaq = findWord(25, ["\u063a","\u0633","\u0627","\u0642"]);
  if (ghassaq) e.terminology.push({ term: ghassaq, transliteration: "ghassaq", gloss: "foul purulence (editorial gloss)", keys: ["78:25"] });
}

// === POPULATE P3 (78:31-36) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Attainment comprising gardens, grapevines, companions, full cup and pure speech", keys: ["78:31","78:32","78:33","78:34","78:35"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Reward framed as a generous gift made due by divine accounting", keys: ["78:36"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Absence of ill speech and falsehood distinguishing the reward environment", keys: ["78:35"], evidenceClass: "EXPLICIT_TEXT" });

  const atiyah = findWord(36, ["\u0639","\u0637","\u0627","\u0621"]);
  if (atiyah) e.terminology.push({ term: atiyah, transliteration: "ata' hisab", gloss: "gift made due by account (editorial gloss)", keys: ["78:36"] });
}

// === POPULATE P4 (78:37-40) ===
{
  const e = extractions[3];
  const rahman = findWord(37, ["\u0631","\u062d","\u0645","\u0646"]);
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["78:37"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Man observing what his hands have put forth on the Day of reckoning", keys: ["78:40"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Disbeliever wishing he were dust upon seeing his deeds", keys: ["78:40"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Lord of heavens and earth as Most Merciful before whom none holds speech-authority", keys: ["78:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Spirit and angels in rows with speech permitted only to the correct speaker", keys: ["78:38"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "True Day enabling whoever wills to take a way of return to his Lord", keys: ["78:39"], evidenceClass: "EXPLICIT_TEXT" });

  const ruh = findWord(38, ["\u0631","\u0648","\u062d"]);
  if (ruh) e.terminology.push({ term: ruh, transliteration: "al-ruh", gloss: "the Spirit (editorial gloss)", keys: ["78:38"] });
  const turab = findWord(40, ["\u062a","\u0631","\u0627","\u0628"]);
  if (turab) e.terminology.push({ term: turab, transliteration: "turab", gloss: "dust/soil (editorial gloss)", keys: ["78:40"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `078-an-naba-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 078-an-naba-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-078-p1,ext-078-p2,ext-078-p3,ext-078-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1883", label: "Great news disputed but doubly certain to be known", def: "In 78:1-5: About what are they asking one another; about the great news; that over which they are in disagreement; no they are going to know; then no they are going to know.", key: "78:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Naba' azim as eschatological subject."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Disagreement resolved by certainty."}] },
  { id: "cand-1884", label: "Cosmic provisions: resting earth, stake-mountains, paired creation, sleep-night-day cycle", def: "In 78:6-11: Have We not made the earth a resting place and the mountains as stakes; and We created you in pairs; and We made your sleep a means for rest; and We made the night as clothing; and We made the day for livelihood.", key: "78:6", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Earth-mountains-pairs-nocturnal-diurnal signs."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Rest-livelihood balance designed."}] },
  { id: "cand-1885", label: "Rain-driven agriculture producing grain, vegetation and entwined gardens", def: "In 78:14-16: And We sent down from the rain clouds pouring water that We may bring forth thereby grain and vegetation and gardens of entwined growth.", key: "78:14", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ma' thajjaj as agricultural cause."},{topicId:"gratitude",layer:"curated",relationship:"related-not-identical",note:"Provision preceding judgement."}] },

  { id: "cand-1886", label: "Hell lying in wait as transgressors' unending return with scalding-purulence drink", def: "In 78:21-26: Indeed Hell has been lying in wait for the transgressors a place of return; in which they will remain for ages unending; they will not taste therein any coolness or drink except scalding water and foul purulence; an appropriate recompense.", key: "78:21", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Mirsad and mathwab."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Jaza'an wifaqa proportionality."}] },
  { id: "cand-1887", label: "Emphatic denial and unexpecting account met with enumerated writing", def: "In 78:27-30: Indeed they were not expecting an account and denied Our verses with emphatic denial; but We have enumerated everything in writing; so taste the penalty and never will We increase you except in torment.", key: "78:27", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La yarjuna hisaban diagnosed."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ahsayna kulla shay'in kitaba."}] },

  { id: "cand-1888", label: "Righteous attainment: gardens, companions, full cup and pure speech as accounted gift", def: "In 78:31-36: Indeed for the righteous is attainment; gardens and grapevines and full-breasted companions of equal age and a full cup; no ill speech will they hear therein or falsehood; reward from your Lord a generous gift made due by account.", key: "78:31", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Mafaz detailed."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Ata' hisab as earned gift."}] },

  { id: "cand-1889", label: "Spirit and angels in rows with restricted speech on the True Day", def: "In 78:38-39: On the Day the Spirit and the angels will stand in row they will not speak except for one whom the Most Merciful permits and he has said what is correct; that is the True Day so whoever wills should take to his Lord a way of return.", key: "78:38", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Ruh wa-mala'ikah saffan."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Yawm al-haqq defined."}] },

  { id: "cand-1890", label: "Impending punishment producing self-observation and the dust-wish", def: "In 78:40: Indeed We have warned you of an impending punishment on the Day when a man will observe what his hands have put forth and the disbeliever will say oh I wish that I were dust.", key: "78:40", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Yanzuru ma qaddamat yadah."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Too-late wish pattern."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 3).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(3, 6).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(6, 7).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(7, 8).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `078-an-naba-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-102.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-102.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");