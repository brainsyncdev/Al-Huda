// MFD-11 Wave 9: Surah 55 (Ar-Rahman) genuine re-extraction.
// Covers 55:1-78 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "055-0001-0078.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 55:${n} not found`);
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

console.log("Generating Surah 55 (Ar-Rahman) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T17:15:00.000Z";

const PASSAGES = [
  { id: "ext-055-p1", from: 1, to: 30,
    label: "Most Merciful taught Quran created man taught eloquence; sun moon precise calculation stars trees prostrate; heaven raised imposed balance not transgress balance establish weight justice not deficient balance; earth laid out creatures fruit palm trees sheaths grain husks scented plants which favors deny; created man clay pottery jinn smokeless flame fire which favors deny; Lord two sunrises two sunsets which favors deny; released two seas meeting barrier neither transgresses which favors deny; both emerge pearl coral which favors deny; ships elevated sea mountains which favors deny; everyone earth perish remain Face Lord Owner Majesty Honor which favors deny; whoever heavens earth asks Him every day bringing matter which favors deny",
    mainLabel: "The Most Merciful named as teacher of the Quran, creator of man and giver of eloquence; sun and moon moving by precise calculation while stars and trees prostrate; the heaven raised with the balance imposed, commanding no transgression in weighing and just establishment of measure; the earth laid out for creatures bearing fruit, sheathed palms, husked grain and scented plants; man created from pottery-like clay and jinn from smokeless flame; lordship of the two sunrises and two sunsets; the two seas released to meet behind a barrier neither transgresses, yielding pearl and coral; mountain-like elevated ships belonging to Him; universal perishing of all on earth while the Face of the Lord, Owner of Majesty and Honour, remains; every being in heavens and earth asking Him while He brings about a matter each day — each unit closed by the refrain challenging denial of the Lord's favours" },
  { id: "ext-055-p2", from: 31, to: 45,
    label: "attend you prominent beings which favors deny; company jinn mankind able pass regions heavens earth pass not pass except authority which favors deny; sent flame fire smoke not defend which favors deny; heaven split rose-colored oil which favors deny; Day none asked sin men jinn which favors deny; criminals known marks seized forelocks feet which favors deny; this Hell criminals deny which favors deny; go around between it scalding water heated utmost which favors deny",
    mainLabel: "Divine attention announced toward the two prominent beings; the company of jinn and mankind challenged to pass beyond the regions of heavens and earth, unable to do so except by authority; flame and smoke sent against them with no self-defence possible; the heaven split open becoming rose-coloured like oil; on that Day no man or jinn questioned about sin since criminals are known by their marks and seized by forelocks and feet; Hell identified as what the criminals denied, circulating between it and scalding water heated to the utmost — each stage sealed by the favours-denial refrain" },
  { id: "ext-055-p3", from: 46, to: 61,
    label: "feared position Lord two gardens which favors deny; spreading branches which favors deny; both two springs flowing which favors deny; both every fruit two kinds which favors deny; reclining beds linings silk brocade fruit hanging low which favors deny; women limiting glances untouched man jinni which favors deny; rubies coral which favors deny; reward good anything but good which favors deny",
    mainLabel: "Two gardens promised to whoever feared standing before his Lord, with spreading branches, two flowing springs and every fruit in two kinds; reclining on beds lined with silk brocade while the gardens' fruit hangs low within reach; women restricting their glances, untouched before them by man or jinn, likened to rubies and coral; the whole framed by the principle that the reward for good is nothing but good, each detail punctuated by the favours-denial refrain" },
  { id: "ext-055-p4", from: 62, to: 78,
    label: "below them both excellence two other gardens which favors deny; dark green color which favors deny; both two springs spouting which favors deny; both fruit palm trees pomegranates which favors deny; good beautiful women which favors deny; fair ones reserved pavilions which favors deny; untouched man jinni which favors deny; reclining green cushions beautiful fine carpets which favors deny; blessed name Lord Owner Majesty Honor",
    mainLabel: "Two further gardens below the first pair in excellence, dark green in colour, with two spouting springs, fruit, palms and pomegranates; good and beautiful women, fair ones reserved in pavilions untouched by man or jinn; reclining on green cushions and beautiful fine carpets; the surah closing with blessing upon the name of the Lord, Owner of Majesty and Honour, mirroring the earlier permanence declaration" }
];

const SUB_LABELS = {
  "ext-055-p1": [
    "The Most Merciful named as the surah's opening subject",
    "He taught the Quran",
    "He created man",
    "He taught him eloquence",
    "Sun and moon moving by precise calculation",
    "Stars and trees prostrating",
    "The heaven raised and the balance imposed",
    "Prohibition of transgressing within the balance",
    "Command to establish weight in justice without making the balance deficient",
    "The earth laid out for the creatures",
    "Fruit and palm trees with sheaths of dates therein",
    "Grain with husks and scented plants added to the earth's provision",
    "First refrain: which of the favours of your Lord would you deny",
    "Man created from clay like that of pottery",
    "Jinn created from a smokeless flame of fire",
    "Second refrain challenging denial after the two creations",
    "Lordship of the two sunrises and the two sunsets",
    "Third refrain following the double-east and double-west lordship",
    "The two seas released to meet side by side",
    "A barrier between them that neither transgresses",
    "Fourth refrain following the barred meeting of the seas",
    "Pearl and coral emerging from both seas",
    "Fifth refrain following the sea's gems",
    "Ships with elevated sails in the sea like mountains belonging to Him",
    "Sixth refrain following the mountain-like ships",
    "Everyone upon the earth declared destined to perish",
    "The Face of the Lord remaining, Owner of Majesty and Honour",
    "Seventh refrain following the permanence of the divine Face",
    "All in heavens and earth asking Him while He brings about a matter every day",
    "Eighth refrain following His daily disposal of affairs"
  ],
  "ext-055-p2": [
    "Divine attention announced toward the two prominent beings",
    "Ninth refrain following the address to the thaqalan",
    "Company of jinn and mankind challenged to pass beyond the regions of heavens and earth, unable except by authority",
    "Tenth refrain following the escape challenge",
    "Flame of fire and smoke sent with no capacity for self-defence",
    "Eleventh refrain following the undefendable flame",
    "The heaven split open becoming rose-coloured like oil",
    "Twelfth refrain following the heaven's dissolution",
    "On that Day no man or jinn asked about his sin",
    "Thirteenth refrain following the absence of questioning",
    "Criminals known by their marks and seized by forelocks and feet",
    "Fourteenth refrain following the marked seizure",
    "This named as the Hell which the criminals deny",
    "Circulation between Hell and scalding water heated to the utmost degree",
    "Fifteenth refrain following the circulation of punishment"
  ],
  "ext-055-p3": [
    "Two gardens promised to whoever feared the position of his Lord",
    "Sixteenth refrain following the promise to the fearful",
    "Both gardens having spreading branches",
    "Seventeenth refrain following the branching foliage",
    "Two flowing springs in both gardens",
    "Eighteenth refrain following the flowing springs",
    "Every fruit present in two kinds in both gardens",
    "Nineteenth refrain following the paired fruits",
    "Reclining on beds lined with silk brocade while the gardens' fruit hangs low",
    "Twentieth refrain following the brocade-lined couches",
    "Women limiting their glances, untouched before them by man or jinn",
    "Twenty-first refrain following the chaste companions",
    "They likened to rubies and coral",
    "Twenty-second refrain following the gem comparison",
    "The reward for good declared to be nothing but good",
    "Twenty-third refrain following the good-for-good principle"
  ],
  "ext-055-p4": [
    "Two further gardens below the first pair in excellence",
    "Twenty-fourth refrain following the second garden pair",
    "Both dark green in colour",
    "Twenty-fifth refrain following their deep greenness",
    "Two spouting springs in both gardens",
    "Twenty-sixth refrain following the gushing springs",
    "Fruit, palm trees and pomegranates in both gardens",
    "Twenty-seventh refrain following the pomegranate provision",
    "Good and beautiful women therein",
    "Twenty-eighth refrain following their goodness and beauty",
    "Fair ones reserved in pavilions",
    "Twenty-ninth refrain following the pavilion seclusion",
    "Untouched before them by man or jinn",
    "Thirtieth refrain following their untouched purity",
    "Reclining on green cushions and beautiful fine carpets",
    "Thirty-first refrain closing the reward sequence",
    "Blessed is the name of your Lord, Owner of Majesty and Honour"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`55:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`55:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 55, surahName: "Ar-Rahman",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the eighth refrain after daily disposal (30) before the thaqalan address opens (31); P2 ends with the fifteenth refrain after the Hell-hamim circulation (45); P3 covers the first garden pair through the good-for-good principle and its refrain (46-61); P4 covers the second garden pair through the closing blessing on the divine name (62-78). The 31 occurrences of the favours-denial refrain are labelled individually with their preceding subject so no subordinate label repeats.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (55:1-30) ===
{
  const e = extractions[0];
  const rahman = findWord(1, ["\u0631","\u062d","\u0645","\u0646"]);
  const jalal = findWord(27, ["\u062c","\u0644","\u0644"]);
  const ikram = findWord(27, ["\u0625","\u0643","\u0631","\u0627","\u0645"]);
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["55:1"] });
  if (jalal) e.divineNamesAndAttributes.push({ term: jalal, transliteration: "dhu al-jalal", gloss: "Owner of Majesty (editorial gloss)", keys: ["55:27"] });
  if (ikram) e.divineNamesAndAttributes.push({ term: ikram, transliteration: "wa'l-ikram", gloss: "and Honour (editorial gloss)", keys: ["55:27"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["55:8"], excerpt: fv(8), description: "That you not transgress within the balance." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["55:9"], excerpt: fv(9), description: "And establish weight in justice and do not make deficient the balance." });

  e.humanConditionsAndSpiritualStates.push({ label: "Stars and trees prostrating in submission alongside calculated celestial motion", keys: ["55:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Universal perishing of all upon the earth contrasted with the remaining divine Face", keys: ["55:26","55:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Balance imposed with the command to weigh justly and never make the measure deficient", keys: ["55:7","55:8","55:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Earth laid out for creatures with fruit, sheathed palms, husked grain and scented plants", keys: ["55:10","55:11","55:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Pearl and coral emerging from the two barred seas, with mountain-like ships as provision", keys: ["55:22","55:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Man created from pottery-like clay while jinn created from smokeless flame", keys: ["55:14","55:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Two seas meeting behind a barrier neither transgresses", keys: ["55:19","55:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "All in heavens and earth asking Him while He brings about a matter every day", keys: ["55:29"], evidenceClass: "EXPLICIT_TEXT" });

  const mizan = findWord(7, ["\u0645","\u064a","\u0632","\u0646"]);
  if (mizan) e.terminology.push({ term: mizan, transliteration: "mizan", gloss: "balance (editorial gloss)", keys: ["55:7"] });
  const bayan = findWord(4, ["\u0628","\u064a","\u0627","\u0646"]);
  if (bayan) e.terminology.push({ term: bayan, transliteration: "bayan", gloss: "eloquence/expression (editorial gloss)", keys: ["55:4"] });
}

// === POPULATE P2 (55:31-45) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Jinn and mankind challenged to pass beyond cosmic regions, unable except by authority", keys: ["55:33"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Flame and smoke sent with no capacity for self-defence", keys: ["55:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "No questioning about sin on that Day since criminals are known by their marks", keys: ["55:39","55:41"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine attention announced toward the two prominent beings", keys: ["55:31"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Heaven split open becoming rose-coloured like oil", keys: ["55:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Circulation between the denied Hell and scalding water heated to the utmost", keys: ["55:43","55:44"], evidenceClass: "EXPLICIT_TEXT" });

  const thaqalan = findWord(31, ["\u062b","\u0642","\u0644"]);
  if (thaqalan) e.terminology.push({ term: thaqalan, transliteration: "thaqalan", gloss: "two prominent beings (editorial gloss)", keys: ["55:31"] });
  const sultan = findWord(33, ["\u0633","\u0644","\u0637","\u0646"]);
  if (sultan) e.terminology.push({ term: sultan, transliteration: "sultan", gloss: "authority (editorial gloss)", keys: ["55:33"] });
}

// === POPULATE P3 (55:46-61) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Fear of standing before the Lord earning two gardens", keys: ["55:46"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Two gardens with spreading branches, flowing springs and every fruit in two kinds", keys: ["55:48","55:50","55:52"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Beds lined with silk brocade and low-hanging fruit within reach", keys: ["55:54"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Companions restricting their glances, untouched by man or jinn, likened to rubies and coral", keys: ["55:56","55:58"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "The reward for good declared to be nothing but good", keys: ["55:60"], evidenceClass: "EXPLICIT_TEXT" });

  const jannatan = findWord(46, ["\u062c","\u0646","\u062a"]);
  if (jannatan) e.terminology.push({ term: jannatan, transliteration: "jannatan", gloss: "two gardens (editorial gloss)", keys: ["55:46"] });
}

// === POPULATE P4 (55:62-78) ===
{
  const e = extractions[3];
  const jalal2 = findWord(78, ["\u062c","\u0644","\u0644"]);
  const ikram2 = findWord(78, ["\u0625","\u0643","\u0631","\u0627","\u0645"]);
  if (jalal2) e.divineNamesAndAttributes.push({ term: jalal2, transliteration: "dhu al-jalal", gloss: "Owner of Majesty (editorial gloss)", keys: ["55:78"] });
  if (ikram2) e.divineNamesAndAttributes.push({ term: ikram2, transliteration: "wa'l-ikram", gloss: "and Honour (editorial gloss)", keys: ["55:78"] });

  e.socialEconomicCivilisational.push({ label: "Second garden pair dark green with spouting springs, palms and pomegranates", keys: ["55:64","55:66","55:68"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Fair companions reserved in pavilions, untouched by man or jinn", keys: ["55:72","55:74"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Green cushions and beautiful fine carpets as reclining furnishings", keys: ["55:76"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Blessing declared upon the name of the Lord, Owner of Majesty and Honour", keys: ["55:78"], evidenceClass: "EXPLICIT_TEXT" });

  const abqari = findWord(76, ["\u0639","\u0628","\u0642","\u0631"]);
  if (abqari) e.terminology.push({ term: abqari, transliteration: "abqari", gloss: "fine carpets (editorial gloss)", keys: ["55:76"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `055-ar-rahman-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 055-ar-rahman-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-055-p1,ext-055-p2,ext-055-p3,ext-055-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1665", label: "The Most Merciful as teacher of Quran and giver of eloquence", def: "In 55:1-4: The Most Merciful taught the Quran, created man and taught him eloquence.", key: "55:1", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Rahman as opening name."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Bayan as taught faculty."}] },
  { id: "cand-1666", label: "Balance imposed with prohibition of transgression and command of just weight", def: "In 55:7-9: And the heaven He raised and imposed the balance, that you not transgress within the balance, and establish weight in justice and do not make deficient the balance.", key: "55:7", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Mizan as commercial ethic."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Cosmic order grounding measure."}] },
  { id: "cand-1667", label: "Distinct creation materials for man and jinn", def: "In 55:14-15: He created man from clay like that of pottery and He created the jinn from a smokeless flame of fire.", key: "55:14", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Salsal kal-fakhkhar."},{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Marij min nar for jinn."}] },
  { id: "cand-1668", label: "Two seas meeting behind an untransgressed barrier yielding pearl and coral", def: "In 55:19-22: He released the two seas meeting side by side, between them is a barrier so neither of them transgresses; from both of them emerge pearl and coral.", key: "55:19", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Barzakh between the seas."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Boundary maintained by decree."}] },
  { id: "cand-1669", label: "Universal perishing against the remaining Face of Majesty and Honour", def: "In 55:26-27: Everyone upon the earth will perish and there will remain the Face of your Lord, Owner of Majesty and Honor.", key: "55:26", overlap: [{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Wajh and baqa affirmed."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Creaturely finitude."}] },
  { id: "cand-1670", label: "Continuous dependence of all beings on daily divine disposal", def: "In 55:29: Whoever is within the heavens and earth asks Him; every day He is bringing about a matter.", key: "55:29", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Universal su'al."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Kulla yawm huwa fi sha'n."}] },

  { id: "cand-1671", label: "Escape beyond cosmic regions impossible without authority", def: "In 55:33: O company of jinn and mankind, if you are able to pass beyond the regions of the heavens and the earth then pass; you will not pass except by authority.", key: "55:33", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Aqtar confinement."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"No escape from reckoning."}] },
  { id: "cand-1672", label: "Criminals known by marks and seized without questioning", def: "In 55:39-41: Then on that Day none will be asked about his sin among men or jinn; the criminals will be known by their marks and they will be seized by the forelocks and the feet.", key: "55:39", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Sima identification."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Marks replace interrogation."}] },
  { id: "cand-1673", label: "Circulation between the denied Hell and utmost-heated scalding water", def: "In 55:43-44: This is Hell which the criminals deny; they will go around between it and scalding water heated to the utmost degree.", key: "55:43", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Tawaf baynaha wa-hamim an."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Denied reality confronted."}] },

  { id: "cand-1674", label: "Two gardens for whoever feared standing before his Lord", def: "In 55:46-52: But for he who has feared the position of his Lord are two gardens having spreading branches; in both of them are two springs flowing; in both of them are of every fruit two kinds.", key: "55:46", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Khafa maqam rabbihi."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jannatan dual reward."}] },
  { id: "cand-1675", label: "Reward for good declared to be nothing but good", def: "In 55:60: Is the reward for good anything but good?", key: "55:60", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Jaza' al-ihsan principle."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ihsan reciprocated."}] },

  { id: "cand-1676", label: "Second garden pair with spouting springs and reserved companions", def: "In 55:62-76: And below them both in excellence are two other gardens, dark green in color; in both are two springs spouting; in both are fruit and palm trees and pomegranates; in them are good and beautiful women, fair ones reserved in pavilions untouched before them by man or jinni; reclining on green cushions and beautiful fine carpets.", key: "55:62", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Graduated garden ranks."},{topicId:"parents-and-family",layer:"curated",relationship:"related-not-identical",note:"Companionship in reward."}] },
  { id: "cand-1677", label: "Closing blessing on the name of the Lord of Majesty and Honour", def: "In 55:78: Blessed is the name of your Lord, Owner of Majesty and Honor.", key: "55:78", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Tabaraka ism rabbika."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Blessing as dhikr closure."}] }
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
    notes: "Wave 9 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 6).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(6, 9).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(9, 11).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(11, 13).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `055-ar-rahman-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-079.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-079.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
