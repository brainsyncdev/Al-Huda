// MFD-11 Wave 9: Surah 56 (Al-Waqiah) genuine re-extraction.
// Covers 56:1-96 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "056-0001-0096.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 56:${n} not found`);
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

console.log("Generating Surah 56 (Al-Waqiah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T17:25:00.000Z";

const PASSAGES = [
  { id: "ext-056-p1", from: 1, to: 26,
    label: "Occurrence occurs no denial; bring down raise up; earth shaken convulsion; mountains broken crumbling dust dispersing; three kinds; companions right what right; companions left what left; forerunners forerunners brought near Gardens Pleasure; company former few later; thrones woven reclining facing; circulate young boys eternal vessels pitchers cup flowing spring no headache nor intoxicated; fruit select meat fowl desire; fair women large eyes pearls protected reward used do; not hear ill speech sin only saying peace peace",
    mainLabel: "The Occurrence declared undeniable when it occurs, bringing some down and raising others while the earth convulses and mountains crumble into dispersing dust; humanity divided into three kinds — companions of the right, companions of the left, and the forerunners who are brought near in Gardens of Pleasure, a large company of former peoples and few of later ones; enthroned on woven seats facing one another, served by eternal youths with vessels, pitchers and cups from a flowing spring causing neither headache nor intoxication; selected fruit and desired fowl-meat provided alongside fair large-eyed women likened to protected pearls as reward for deeds; no ill speech or sin heard there, only the greeting of peace repeated" },
  { id: "ext-056-p2", from: 27, to: 56,
    label: "companions right among lote trees thorns removed banana layered shade extended water poured fruit abundant neither limited forbidden beds raised high; produced women Paradise new creation virgins devoted equal age companions right company former later; companions left scorching fire scalding water shade black smoke neither cool beneficial; before indulging affluence persist great violation say die dust bones resurrected forefathers; say former later gathered appointment known Day; astray deniers eating zaqqum filling bellies drinking scalding water thirsty camels accommodation Day Recompense",
    mainLabel: "Companions of the right placed among thornless lote trees, layered fruit-trees, extended shade, poured water and abundant fruit neither seasonal nor forbidden, upon raised beds; the women of Paradise produced in a new creation as devoted virgins of equal age for a company drawn from both former and later peoples; companions of the left consigned to scorching wind, scalding water and a shade of black smoke neither cool nor beneficial, because they had indulged in affluence, persisted in the great violation and denied resurrection of themselves and their forefathers; the answer that former and later peoples alike are gathered for a known Day's appointment; the astray deniers eating Zaqqum until bellies are filled and drinking scalding water like thirsty camels as their accommodation on the Day of Recompense" },
  { id: "ext-056-p3", from: 57, to: 74,
    label: "created you why not believe; seen emit you create We Creator; decreed death not outdone change likenesses produce form not know; known first creation remember; seen sow you grow We grower; willed make debris wonder debt deprived; seen water drink you brought clouds We bring down; willed bitter why not grateful; seen fire ignite you produced tree We producer; made reminder provision travelers; exalt name Lord Most Great",
    mainLabel: "Four evidentiary challenges drawn from ordinary human experience: creation itself demanding belief; the emitted seed whose creator is Allah not man, with death decreed and forms replaceable beyond human knowledge though the first creation is already known; the sown seed whose grower is Allah, capable of reducing it to debris leaving them wondering over debt and deprivation; the drinking water brought down from clouds by Allah, capable of being made bitter, prompting the gratitude question; the ignited fire whose tree Allah produced, made a reminder and provision for travellers — closing with the command to exalt the name of the Lord, the Most Great" },
  { id: "ext-056-p4", from: 75, to: 96,
    label: "swear setting stars oath great if know; noble Quran Register protected none touch except purified revelation Lord worlds; statement indifferent make thanks provision deny; soul death reaches throat looking on angels nearer not see; why not if not recompensed bring back truthful; deceased brought near rest bounty garden pleasure; companions right peace from right; deniers astray accommodation scalding burning Hellfire; true certainty exalt name Lord Most Great",
    mainLabel: "Oath by the settings of the stars declared most great if they could know, grounding a noble Quran held in a well-protected Register touched only by the purified, revealed from the Lord of the worlds; their indifference to this statement and their making denial the thanks for provision challenged; the deathbed scene where the soul reaches the throat while onlookers watch and unseen angels stand nearer, with the challenge to bring it back if no recompense awaits; the threefold outcome — rest, bounty and a garden of pleasure for the brought-near, peace for the companions of the right, and scalding accommodation with Hellfire burning for the astray deniers; all named the true certainty, closing again with exalting the name of the Lord, the Most Great" }
];

const SUB_LABELS = {
  "ext-056-p1": [
    "The Occurrence announced as occurring",
    "No denial possible at its occurrence",
    "It brings some down and raises others up",
    "The earth shaken with convulsion",
    "Mountains broken down and crumbling",
    "Mountains becoming dispersing dust",
    "Humanity divided into three kinds",
    "The companions of the right introduced with an emphatic question",
    "The companions of the left introduced with an emphatic question",
    "The forerunners named twice for emphasis",
    "The forerunners identified as those brought near to Allah",
    "Their station named the Gardens of Pleasure",
    "A large company drawn from the former peoples",
    "And a few from the later peoples",
    "Seated on thrones woven with ornament",
    "Reclining upon them facing one another",
    "Eternal youths circulating among them",
    "Carrying vessels, pitchers and a cup from a flowing spring",
    "Neither headache nor intoxication resulting from it",
    "Fruit of whatever they select",
    "Meat of fowl from whatever they desire",
    "Fair women with large beautiful eyes provided",
    "Likened to well-protected pearls",
    "All of it named reward for what they used to do",
    "No ill speech or commission of sin heard therein",
    "Only the repeated saying of peace"
  ],
  "ext-056-p2": [
    "The companions of the right introduced again with an emphatic question",
    "Placed among lote trees with thorns removed",
    "And fruit-trees layered with produce",
    "Shade extended over them",
    "Water poured out continuously",
    "Fruit abundant and varied",
    "Neither limited to season nor forbidden",
    "Upon beds raised high",
    "The women of Paradise produced in a new creation",
    "Made virgins",
    "Devoted to their husbands and of equal age",
    "Assigned to the companions of the right",
    "A company of the former peoples",
    "And a company of the later peoples",
    "The companions of the left reintroduced before their punishment is detailed",
    "Consigned to scorching wind and scalding water",
    "And a shade of black smoke",
    "Neither cool nor beneficial",
    "Their prior indulgence in affluence cited as cause",
    "Their persistence in the great violation cited",
    "Their denial of resurrection after becoming dust and bones",
    "Extending that denial to their forefathers",
    "The answer that former and later peoples alike are concerned",
    "All gathered for the appointment of a known Day",
    "The astray deniers addressed directly",
    "Condemned to eat from trees of Zaqqum",
    "Filling their bellies with it",
    "Drinking scalding water on top of it",
    "Drinking as thirsty camels drink",
    "Named their accommodation on the Day of Recompense"
  ],
  "ext-056-p3": [
    "Creation itself posed as grounds for belief",
    "The emitted seed offered for consideration",
    "Question whether man creates it or Allah is the Creator",
    "Death decreed among them with Allah not to be outdone",
    "Power to change their likenesses and produce them in unknown forms",
    "The first creation already known, prompting remembrance",
    "The sown seed offered for consideration",
    "Question whether man makes it grow or Allah is the grower",
    "Power to reduce it to dry debris leaving them in wonder",
    "Their lament of being left in debt",
    "Their admission of having been deprived",
    "The drinking water offered for consideration",
    "Question whether man brings it from clouds or Allah sends it down",
    "Power to make it bitter, prompting the gratitude question",
    "The ignited fire offered for consideration",
    "Question whether man produced its tree or Allah is the producer",
    "Fire made a reminder and provision for travellers",
    "Command to exalt the name of the Lord, the Most Great"
  ],
  "ext-056-p4": [
    "Oath sworn by the settings of the stars",
    "That oath declared most great if they could know",
    "The Quran affirmed as noble",
    "Held in a well-protected Register",
    "None touching it except the purified",
    "Named a revelation from the Lord of the worlds",
    "Their indifference to this statement challenged",
    "Their making denial the thanks for provision condemned",
    "The soul at death reaching the throat",
    "Onlookers watching at that moment",
    "Angels nearer to the dying than the watchers though unseen",
    "Challenge issued if they are not to be recompensed",
    "Demand to bring the soul back if truthful",
    "If the deceased was among those brought near",
    "Rest, bounty and a garden of pleasure await him",
    "If he was among the companions of the right",
    "Peace greeted to him from the companions of the right",
    "If he was among the astray deniers",
    "Accommodation of scalding water awaits him",
    "And burning in Hellfire",
    "All of this named the true certainty",
    "Closing command to exalt the name of the Lord, the Most Great"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`56:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`56:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 56, surahName: "Al-Waqiah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the peace-only speech of the forerunners (26) before the companions-of-the-right block opens (27); P2 ends with the Zaqqum accommodation verdict (56) before the four evidentiary challenges begin (57); P3 runs through seed, sowing, water and fire to the first exaltation command (57-74); P4 covers the star-oath, protected Register, deathbed scene, threefold outcome and the closing exaltation (75-96).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (56:1-26) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Humanity divided into three kinds at the Occurrence", keys: ["56:7","56:8","56:9","56:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Forerunners brought near to Allah in Gardens of Pleasure", keys: ["56:11","56:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Woven thrones, eternal serving youths and cups causing neither headache nor intoxication", keys: ["56:15","56:17","56:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Selected fruit, desired fowl-meat and pearl-like companions as reward for deeds", keys: ["56:20","56:21","56:22","56:23","56:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "The Occurrence bringing some down and raising others up", keys: ["56:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Earth convulsing and mountains crumbling into dispersing dust", keys: ["56:4","56:5","56:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Only the greeting of peace heard, with no ill speech or sin", keys: ["56:25","56:26"], evidenceClass: "EXPLICIT_TEXT" });

  const waqiah = findWord(1, ["\u0648","\u0627","\u0642","\u0639"]);
  if (waqiah) e.terminology.push({ term: waqiah, transliteration: "waqi'ah", gloss: "the Occurrence (editorial gloss)", keys: ["56:1"] });
  const sabiqun = findWord(10, ["\u0633","\u0627","\u0628","\u0642"]);
  if (sabiqun) e.terminology.push({ term: sabiqun, transliteration: "sabiqun", gloss: "forerunners (editorial gloss)", keys: ["56:10"] });
}

// === POPULATE P2 (56:27-56) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Prior indulgence in affluence and persistence in the great violation cited as causes of punishment", keys: ["56:45","56:46"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Denial of resurrection extending to their forefathers", keys: ["56:47","56:48"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Astral deniers eating Zaqqum and drinking scalding water like thirsty camels", keys: ["56:51","56:52","56:54","56:55"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Thornless lote trees, layered fruit, extended shade, poured water and unrestricted fruit", keys: ["56:28","56:29","56:30","56:31","56:32","56:33"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Women of Paradise produced in a new creation as devoted virgins of equal age", keys: ["56:35","56:36","56:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Scorching wind, scalding water and black-smoke shade neither cool nor beneficial", keys: ["56:42","56:43","56:44"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Former and later peoples alike gathered for the appointment of a known Day", keys: ["56:49","56:50"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Zaqqum and scalding water named their accommodation on the Day of Recompense", keys: ["56:56"], evidenceClass: "EXPLICIT_TEXT" });

  const zaqqum = findWord(52, ["\u0632","\u0642","\u0648","\u0645"]);
  if (zaqqum) e.terminology.push({ term: zaqqum, transliteration: "zaqqum", gloss: "tree of Zaqqum (editorial gloss)", keys: ["56:52"] });
  const yamin = findWord(27, ["\u064a","\u0645","\u064a","\u0646"]);
  if (yamin) e.terminology.push({ term: yamin, transliteration: "ashab al-yamin", gloss: "companions of the right (editorial gloss)", keys: ["56:27"] });
}

// === POPULATE P3 (56:57-74) ===
{
  const e = extractions[2];
  const azeem = findWord(74, ["\u0639","\u0638","\u064a","\u0645"]);
  if (azeem) e.divineNamesAndAttributes.push({ term: azeem, transliteration: "Azeem", gloss: "Most Great (editorial gloss)", keys: ["56:74"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["56:74"], excerpt: fv(74), description: "So exalt the name of your Lord, the Most Great." });

  e.humanConditionsAndSpiritualStates.push({ label: "Wonder turning to lament over debt and deprivation when crops are reduced to debris", keys: ["56:65","56:66","56:67"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Sown seed whose growth belongs to Allah and can be reduced to dry debris", keys: ["56:63","56:64","56:65"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Drinking water sent from clouds capable of being made bitter, prompting gratitude", keys: ["56:68","56:69","56:70"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Fire whose tree Allah produced, made a reminder and provision for travellers", keys: ["56:71","56:72","56:73"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Death decreed among them with power to change likenesses into unknown forms", keys: ["56:60","56:61"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The first creation already known, offered as grounds for remembrance", keys: ["56:62"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P4 (56:75-96) ===
{
  const e = extractions[3];
  const azeem2 = findWord(96, ["\u0639","\u0638","\u064a","\u0645"]);
  if (azeem2) e.divineNamesAndAttributes.push({ term: azeem2, transliteration: "Azeem", gloss: "Most Great (editorial gloss)", keys: ["56:96"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["56:96"], excerpt: fv(96), description: "So exalt the name of your Lord, the Most Great." });

  e.humanConditionsAndSpiritualStates.push({ label: "Indifference to the Quranic statement and denial offered as thanks for provision", keys: ["56:81","56:82"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Soul reaching the throat while onlookers watch and unseen angels stand nearer", keys: ["56:83","56:84","56:85"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Threefold deathbed outcome: rest and bounty, peace, or scalding accommodation and burning", keys: ["56:88","56:89","56:90","56:91","56:92","56:93","56:94"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Noble Quran in a protected Register touched only by the purified, revealed from the Lord of the worlds", keys: ["56:77","56:78","56:79","56:80"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Challenge to bring the departing soul back if no recompense awaits", keys: ["56:86","56:87"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The whole named the true certainty", keys: ["56:95"], evidenceClass: "EXPLICIT_TEXT" });

  const maknun = findWord(78, ["\u0645","\u0643","\u0646","\u0648","\u0646"]);
  if (maknun) e.terminology.push({ term: maknun, transliteration: "kitab maknun", gloss: "well-protected Register (editorial gloss)", keys: ["56:78"] });
  const yaqeen = findWord(95, ["\u064a","\u0642","\u064a","\u0646"]);
  if (yaqeen) e.terminology.push({ term: yaqeen, transliteration: "haqq al-yaqin", gloss: "the true certainty (editorial gloss)", keys: ["56:95"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `056-al-waqiah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 056-al-waqiah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-056-p1,ext-056-p2,ext-056-p3,ext-056-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1678", label: "The Occurrence levelling and elevating while cosmos dissolves", def: "In 56:1-6: When the Occurrence occurs there is at its occurrence no denial; it will bring down some and raise up others; when the earth is shaken with convulsion and the mountains are broken down crumbling and become dust dispersing.", key: "56:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Waqi'ah as reversal event."},{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Cosmic dissolution sequence."}] },
  { id: "cand-1679", label: "Threefold division of humanity with forerunners brought near", def: "In 56:7-12: And you become of three kinds; then the companions of the right, what are the companions of the right; and the companions of the left, what are the companions of the left; and the forerunners, the forerunners, those are the ones brought near in the Gardens of Pleasure.", key: "56:7", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Thalathah azwaj classification."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Muqarrabun rank."}] },
  { id: "cand-1680", label: "Forerunners' reward: thrones, eternal servants, pure drink and peace-only speech", def: "In 56:15-26: On thrones woven reclining facing each other; there circulate among them young boys made eternal with vessels pitchers and a cup from a flowing spring, no headache nor intoxication; fruit of what they select and meat of fowl; fair women like protected pearls as reward for what they used to do; they will not hear ill speech or sin, only a saying peace peace.", key: "56:15", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Comprehensive muqarrabun reward."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Speech purified of laghw."}] },

  { id: "cand-1681", label: "Companions of the right amid thornless trees, shade and unrestricted fruit", def: "In 56:28-34: Among lote trees with thorns removed and trees layered with fruit and shade extended and water poured out and fruit abundant neither limited to season nor forbidden and upon beds raised high.", key: "56:28", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ashab al-yamin environment."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Removal of thorns and restriction."}] },
  { id: "cand-1682", label: "Affluence-indulgence and great violation cited as causes of the left's punishment", def: "In 56:42-46: In scorching fire and scalding water and a shade of black smoke neither cool nor beneficial; indeed they were before that indulging in affluence and they used to persist in the great violation.", key: "56:42", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Samum hamim yahmum triad."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Ithm azim persistence."}] },
  { id: "cand-1683", label: "Former and later peoples gathered for a known Day's appointment", def: "In 56:49-50: Say indeed the former and the later peoples are to be gathered together for the appointment of a known Day.", key: "56:49", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Awwalun wa-akhirun universality."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Miqat yawm ma'lum."}] },
  { id: "cand-1684", label: "Zaqqum diet and camel-like drinking as the deniers' accommodation", def: "In 56:52-56: Will be eating from trees of zaqqum and filling with it your bellies and drinking on top of it from scalding water and will drink as the drinking of thirsty camels; that is their accommodation on the Day of Recompense.", key: "56:52", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Nuzul on yawm al-din."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Shurb al-him imagery."}] },

  { id: "cand-1685", label: "Emitted seed and decreed death as creation-and-replacement evidence", def: "In 56:58-62: Have you seen that which you emit; is it you who creates it or are We the Creator; We have decreed death among you and We are not to be outdone in that We will change your likenesses and produce you in that form which you do not know; and you have already known the first creation so will you not remember.", key: "56:58", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Nutfah as evidence."},{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Tabdil al-amthal argument."}] },
  { id: "cand-1686", label: "Sown seed, cloud-water and fire-tree as four providential challenges", def: "In 56:63-73: Have you seen that seed which you sow, is it you who makes it grow or are We the grower; have you seen the water that you drink, is it you who brought it down from the clouds or is it We; if We willed We could make it bitter so why are you not grateful; and have you seen the fire that you ignite, is it you who produced its tree or are We the producer; We have made it a reminder and provision for the travelers.", key: "56:63", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Agriculture water fire catena."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Law-la tashkurun challenge."}] },

  { id: "cand-1687", label: "Star-setting oath grounding a noble Quran in a protected Register", def: "In 56:75-80: Then I swear by the setting of the stars and indeed it is an oath if you could know most great; indeed it is a noble Quran in a Register well-protected, none touch it except the purified, a revelation from the Lord of the worlds.", key: "56:75", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"Kitab maknun protection."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Tanzil min rabb al-alamin."}] },
  { id: "cand-1688", label: "Deathbed helplessness with unseen angels nearer than onlookers", def: "In 56:83-87: Then why when the soul at death reaches the throat and you are at that time looking on and Our angels are nearer to him than you but you do not see; then why do you not if you are not to be recompensed bring it back if you should be truthful.", key: "56:83", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Angels at the moment of death."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Irja' challenge unanswerable."}] },
  { id: "cand-1689", label: "Threefold deathbed outcome matched to the three kinds", def: "In 56:88-95: And if the deceased was of those brought near then rest and bounty and a garden of pleasure; and if he was of the companions of the right then peace for you from the companions of the right; but if he was of the deniers astray then accommodation of scalding water and burning in Hellfire; indeed this is the true certainty.", key: "56:88", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Rawh rayhan salam nawm."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Haqq al-yaqin closure."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 3).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(3, 7).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(7, 9).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(9, 12).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `056-al-waqiah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-080.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-080.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
