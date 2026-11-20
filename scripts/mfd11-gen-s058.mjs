// MFD-11 Wave 9: Surah 58 (Al-Mujadila) genuine re-extraction.
// Covers 58:1-22 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "058-0001-0022.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 58:${n} not found`);
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

console.log("Generating Surah 58 (Al-Mujadila) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T17:45:00.000Z";

const PASSAGES = [
  { id: "ext-058-p1", from: 1, to: 4,
    label: "Allah heard speech of one who argues concerning her husband and directs complaint to Allah, He hears your dialogue, Hearing Seeing; those pronouncing zihar from wives are not their mothers, mothers only those who gave birth, objectionable statement and falsehood, yet Pardoning Forgiving; those pronouncing zihar then wishing to go back must free a slave before touching one another, admonished thereby, Acquainted with what you do; whoever finds none fasts two consecutive months before touching, whoever unable feeds sixty poor persons, that you believe completely in Allah and His Messenger, these are the limits of Allah, painful punishment for disbelievers",
    mainLabel: "The pleading woman's argument concerning her husband heard by Allah who hears the whole dialogue as Hearing and Seeing; the zihar formula repudiated because a wife is not a mother, mothers being only those who gave birth, the utterance named objectionable and false while pardon and forgiveness remain open; retraction conditioned on freeing a slave before marital contact resumes, with divine acquaintance affirmed; inability met by two consecutive months of fasting, and further inability by feeding sixty poor persons, all framed as completing belief in Allah and His Messenger within His set limits, with painful punishment reserved for disbelievers" },
  { id: "ext-058-p2", from: 5, to: 10,
    label: "those opposing Allah and His Messenger abased as those before them abased, clear-evidence verses sent down, humiliating punishment for disbelievers; Day Allah resurrects them all and informs them of what they did, He enumerated it while they forgot it, over all things Witness; Allah knows what is in heavens and earth, no private conversation of three but He is the fourth nor five but He is the sixth, no less and no more except He is with them wherever they are, then informs them on Resurrection Day, of all things Knowing; those forbidden private conversation returning to it conversing about sin aggression and disobedience to the Messenger, greeting with what Allah does not greet with, saying why does Allah not punish us, Hell sufficient and wretched destination; believers commanded when conversing privately not to converse about sin aggression disobedience but righteousness and piety, fear Allah to whom gathered; private conversation only from Satan to grieve believers yet harming none except by permission, upon Allah let believers rely",
    mainLabel: "Opposition to Allah and His Messenger answered by abasement matching earlier opponents, with clear-evidence verses sent and humiliating punishment promised; the resurrection gathering where deeds are disclosed, Allah having enumerated what they forgot as universal Witness; His knowledge of heavens and earth demonstrated through the private-conversation formula — never three without Him as fourth, never five without Him as sixth, always with them wherever they are before disclosure at Resurrection; those returning to forbidden secret counsel about sin, aggression and disobedience, greeting with words Allah does not use and challenging Him to punish, told Hell suffices; believers commanded to make their private counsel about righteousness and piety under taqwa; such whispering traced to Satan seeking to grieve believers yet powerless without permission, closing with reliance upon Allah" },
  { id: "ext-058-p3", from: 11, to: 13,
    label: "believers told space yourselves in assemblies then make space and Allah will make space for you, told arise then arise, Allah raises those who believed and those given knowledge by degrees, Acquainted with what you do; when wishing to privately consult the Messenger present before consultation a charity, better and purer, if means not found Allah Forgiving Merciful; feared to present charities before consultation, when you do not and Allah has forgiven you then establish prayer give zakah and obey Allah and His Messenger, Acquainted with what you do",
    mainLabel: "Assembly etiquette commanding believers to make room when asked and to rise when told, with Allah making space for them and raising believers and the knowledgeable by degrees under His acquaintance with their deeds; private consultation with the Messenger preceded by charity as better and purer, with concession when means are lacking under forgiveness and mercy; when the charity requirement proves too burdensome and pardon is granted, the standing obligations of prayer, zakah and obedience to Allah and His Messenger are reaffirmed" },
  { id: "ext-058-p4", from: 14, to: 22,
    label: "those allying a people Allah angry with neither of you nor of them swearing to untruth knowingly; severe punishment prepared, evil what they were doing; took false oaths as cover averting from way of Allah, humiliating punishment; wealth and children never avail against Allah, companions of Fire abiding eternally; Day Allah resurrects them all and they swear to Him as they swear to you thinking they stand on something, they are the liars; Satan overcome them made them forget remembrance of Allah, party of Satan, they will be losers; those opposing Allah and His Messenger among most humbled; Allah has written I will surely overcome I and My messengers, Powerful Exalted Might; no people believing in Allah and Last Day having affection for those opposing Allah and His Messenger even fathers sons brothers kindred, He decreed faith within their hearts and supported them with spirit from Him, admitted to gardens beneath rivers flowing abiding eternally, Allah pleased with them and they pleased with Him, party of Allah, they are the successful",
    mainLabel: "Alliance with a people under divine anger exposed as belonging to neither side, sealed by knowing false oaths and severe punishment for evil conduct; oaths used as cover to avert from Allah's way earning humiliation, with wealth and children useless against Him and eternal Fire awaiting; at resurrection they swear to Allah as they swore to the believers, imagining a standing they lack, named liars; Satan's mastery making them forget remembrance identifies them as the party of Satan destined to lose; opponents of Allah and His Messenger placed among the most humbled against the written decree that Allah and His messengers will prevail; genuine believers shown incapable of affection for Allah's opponents even among fathers, sons, brothers or kindred, faith inscribed in their hearts and supported by a spirit from Him, admitted to eternal rivered gardens with mutual pleasure — the party of Allah who are the successful" }
];

const SUB_LABELS = {
  "ext-058-p1": [
    "The pleading woman's argument about her husband heard by Allah who hears the entire dialogue, Hearing and Seeing",
    "The zihar formula repudiated: wives are not mothers, mothers being only those who gave birth, the utterance named objectionable and false yet pardon remains open",
    "Retraction of zihar conditioned on freeing a slave before marital contact resumes, under divine acquaintance",
    "Substitute expiations of two consecutive months' fasting or feeding sixty poor persons, framed as completing belief within Allah's limits"
  ],
  "ext-058-p2": [
    "Opponents of Allah and His Messenger abased like earlier opponents, with clear-evidence verses sent and humiliating punishment promised",
    "Resurrection disclosure of deeds Allah enumerated while they forgot them, as universal Witness",
    "The private-conversation formula: never three without Him as fourth nor five without Him as sixth, always with them wherever they are",
    "Returners to forbidden secret counsel about sin, aggression and disobedience, greeting with words Allah does not use and challenging Him to punish",
    "Believers commanded to make private counsel about righteousness and piety rather than sin, under taqwa before the gathering",
    "Whispering traced to Satan seeking to grieve believers yet powerless without permission, with reliance upon Allah commanded"
  ],
  "ext-058-p3": [
    "Assembly etiquette: make space when asked and rise when told, with Allah raising believers and the knowledgeable by degrees",
    "Charity required before private consultation with the Messenger as better and purer, with concession when means are lacking",
    "When the charity requirement is pardoned, prayer, zakah and obedience to Allah and His Messenger are reaffirmed"
  ],
  "ext-058-p4": [
    "Alliance with a people under divine anger exposed as belonging to neither side, sealed by knowing false oaths",
    "Severe punishment prepared for them because their conduct was evil",
    "False oaths taken as cover to avert people from Allah's way, earning humiliating punishment",
    "Wealth and children declared useless against Allah, with eternal Fire as their residence",
    "At resurrection they swear to Allah as they swore to the believers, imagining a standing they lack, named liars",
    "Satan's mastery making them forget remembrance identifies them as the party of Satan destined to lose",
    "Opponents of Allah and His Messenger placed among the most humbled",
    "The written decree that Allah and His messengers will surely prevail, under power and might",
    "Believers shown incapable of affection for Allah's opponents even among close kin, faith inscribed in their hearts and supported by a spirit from Him, admitted to eternal gardens with mutual pleasure as the successful party of Allah"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`58:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`58:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 58, surahName: "Al-Mujadila",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the zihar expiation ladder and divine limits (4) before the opposition-and-abasement block opens (5); P2 ends with the Satanic-whispering diagnosis and reliance command (10) before assembly etiquette begins (11); P3 covers assembly conduct and the consultation-charity rule with its concession (11-13); P4 runs from the false-alliance critique through the two parties to the closing success declaration (14-22).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (58:1-4) ===
{
  const e = extractions[0];
  const samee = findWord(1, ["\u0633","\u0645","\u064a","\u0639"]);
  const baseer = findWord(1, ["\u0628","\u0635","\u064a","\u0631"]);
  const afoow = findWord(2, ["\u0639","\u0641","\u0648"]);
  const ghafoor = findWord(2, ["\u063a","\u0641","\u0648","\u0631"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "Hearing (editorial gloss)", keys: ["58:1"] });
  if (baseer) e.divineNamesAndAttributes.push({ term: baseer, transliteration: "Baseer", gloss: "Seeing (editorial gloss)", keys: ["58:1"] });
  if (afoow) e.divineNamesAndAttributes.push({ term: afoow, transliteration: "Afuww", gloss: "Pardoning (editorial gloss)", keys: ["58:2"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["58:2"] });

  e.humanConditionsAndSpiritualStates.push({ label: "A wife's complaint directed to Allah after arguing with the Prophet concerning her husband", keys: ["58:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Objectionable and false speech in the zihar formula, yet pardon and forgiveness remain open", keys: ["58:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Zihar repudiated on the ground that mothers are only those who gave birth", keys: ["58:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Graduated expiation ladder: freeing a slave, two consecutive months of fasting, or feeding sixty poor persons", keys: ["58:3","58:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Marital contact suspended until the prescribed expiation is completed", keys: ["58:3","58:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The rulings named the limits set by Allah, with painful punishment for disbelievers", keys: ["58:4"], evidenceClass: "EXPLICIT_TEXT" });

  const zihar = findWord(2, ["\u0638","\u0647","\u0631"]);
  if (zihar) e.terminology.push({ term: zihar, transliteration: "zihar", gloss: "likening a wife to one's mother (editorial gloss)", keys: ["58:2"] });
  const hudud = findWord(4, ["\u062d","\u062f","\u0648","\u062f"]);
  if (hudud) e.terminology.push({ term: hudud, transliteration: "hudud Allah", gloss: "limits set by Allah (editorial gloss)", keys: ["58:4"] });
}

// === POPULATE P2 (58:5-10) ===
{
  const e = extractions[1];
  const shaheed = findWord(6, ["\u0634","\u0647","\u064a","\u062f"]);
  const aleem = findWord(7, ["\u0639","\u0644","\u064a","\u0645"]);
  if (shaheed) e.divineNamesAndAttributes.push({ term: shaheed, transliteration: "Shaheed", gloss: "Witness (editorial gloss)", keys: ["58:6"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["58:7"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["58:9"], excerpt: fv(9), description: "When you converse privately, do not converse about sin and aggression and disobedience to the Messenger." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["58:9"], excerpt: fv(9), description: "But converse about righteousness and piety, and fear Allah to whom you will be gathered." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["58:10"], excerpt: fv(10), description: "And upon Allah let the believers rely." });

  e.humanConditionsAndSpiritualStates.push({ label: "Returning to forbidden secret counsel about sin, aggression and disobedience", keys: ["58:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Greeting the Prophet with words Allah does not use while challenging Him to punish", keys: ["58:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Private-counsel ethics redirecting believers from sin-talk to righteousness and piety", keys: ["58:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Deeds enumerated by Allah though forgotten by their doers, disclosed at resurrection", keys: ["58:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Never three in private conversation without Him as fourth, nor five without Him as sixth, always with them wherever they are", keys: ["58:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Satanic whispering intended to grieve believers yet harming none except by divine permission", keys: ["58:10"], evidenceClass: "EXPLICIT_TEXT" });

  const najwa = findWord(8, ["\u0646","\u062c","\u0648","\u0649"]);
  if (najwa) e.terminology.push({ term: najwa, transliteration: "najwa", gloss: "private conversation (editorial gloss)", keys: ["58:8"] });
}

// === POPULATE P3 (58:11-13) ===
{
  const e = extractions[2];
  const khabir = findWord(11, ["\u062e","\u0628","\u064a","\u0631"]);
  const ghafoor = findWord(12, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(12, ["\u0631","\u062d","\u064a","\u0645"]);
  if (khabir) e.divineNamesAndAttributes.push({ term: khabir, transliteration: "Khabir", gloss: "Acquainted (editorial gloss)", keys: ["58:11"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["58:12"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["58:12"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["58:11"], excerpt: fv(11), description: "When you are told space yourselves in assemblies, then make space; and when you are told arise, then arise." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["58:12"], excerpt: fv(12), description: "When you wish to privately consult the Messenger, present before your consultation a charity." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["58:13"], excerpt: fv(13), description: "Establish prayer, give zakah and obey Allah and His Messenger." });

  e.humanConditionsAndSpiritualStates.push({ label: "Believers and those given knowledge raised by degrees", keys: ["58:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Reluctance to present charities before consultation answered by pardon", keys: ["58:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Assembly courtesy of making room and rising when instructed", keys: ["58:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Charity preceding private consultation with the Prophet, with concession for those lacking means", keys: ["58:12","58:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Making space for others answered by Allah making space for them", keys: ["58:11"], evidenceClass: "EXPLICIT_TEXT" });

  const majalis = findWord(11, ["\u0645","\u062c","\u0644","\u0633"]);
  if (majalis) e.terminology.push({ term: majalis, transliteration: "majalis", gloss: "assemblies (editorial gloss)", keys: ["58:11"] });
}

// === POPULATE P4 (58:14-22) ===
{
  const e = extractions[3];
  const qawi = findWord(21, ["\u0642","\u0648","\u064a"]);
  const aziz = findWord(21, ["\u0639","\u0632","\u064a","\u0632"]);
  if (qawi) e.divineNamesAndAttributes.push({ term: qawi, transliteration: "Qawi", gloss: "Powerful (editorial gloss)", keys: ["58:21"] });
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["58:21"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Alliance with a people under divine anger leaving them belonging to neither side", keys: ["58:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "False oaths taken as cover to avert people from Allah's way", keys: ["58:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Swearing to Allah at resurrection as they swore to the believers, imagining a standing they lack", keys: ["58:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Satan's mastery making them forget the remembrance of Allah", keys: ["58:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Faith inscribed in believers' hearts and supported with a spirit from Him", keys: ["58:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Loyalty boundaries overriding kinship with fathers, sons, brothers and kindred who oppose Allah", keys: ["58:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Two opposing parties named: the party of Satan as losers and the party of Allah as successful", keys: ["58:19","58:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Wealth and children declared unable to avail against Allah, with eternal Fire as residence", keys: ["58:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The written decree that Allah and His messengers will surely overcome", keys: ["58:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Mutual pleasure between Allah and the believers admitted to eternal rivered gardens", keys: ["58:22"], evidenceClass: "EXPLICIT_TEXT" });

  const hizb = findWord(19, ["\u062d","\u0632","\u0628"]);
  if (hizb) e.terminology.push({ term: hizb, transliteration: "hizb", gloss: "party (editorial gloss)", keys: ["58:19"] });
  const ruh = findWord(22, ["\u0631","\u0648","\u062d"]);
  if (ruh) e.terminology.push({ term: ruh, transliteration: "ruh minhu", gloss: "spirit from Him (editorial gloss)", keys: ["58:22"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `058-al-mujadila-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 058-al-mujadila-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-058-p1,ext-058-p2,ext-058-p3,ext-058-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1703", label: "The pleading woman's complaint heard by Allah who hears the whole dialogue", def: "In 58:1: Certainly has Allah heard the speech of the one who argues with you concerning her husband and directs her complaint to Allah; and Allah hears your dialogue, indeed Allah is Hearing and Seeing.", key: "58:1", overlap: [{topicId:"supplication",layer:"curated",relationship:"related-not-identical",note:"Shakwa directed to Allah."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Divine hearing of a domestic grievance."}] },
  { id: "cand-1704", label: "Zihar repudiated because mothers are only those who gave birth", def: "In 58:2: Those who pronounce zihar among you to separate from their wives, they are not consequently their mothers; their mothers are none but those who gave birth to them; and indeed they are saying an objectionable statement and a falsehood, but indeed Allah is Pardoning and Forgiving.", key: "58:2", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Motherhood defined by birth."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Afuww Ghafoor after false speech."}] },
  { id: "cand-1705", label: "Graduated expiation ladder for retracting zihar within Allah's limits", def: "In 58:3-4: Those who pronounce zihar and then wish to go back on what they said must free a slave before they touch one another; and he who does not find one then a fast for two months consecutively; and he who is unable then the feeding of sixty poor persons; those are the limits set by Allah.", key: "58:3", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Capacity-graded restitution."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Feeding sixty as final tier."}] },

  { id: "cand-1706", label: "Deeds enumerated by Allah though forgotten by their doers", def: "In 58:6: On the Day when Allah will resurrect them all and inform them of what they did; Allah had enumerated it while they forgot it, and Allah is over all things Witness.", key: "58:6", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ahsahu Allah wa-nasuha."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Enumeration versus human forgetting."}] },
  { id: "cand-1707", label: "Private-conversation formula establishing knowledge-based presence", def: "In 58:7: There is in no private conversation three but that He is the fourth of them, nor are there five but that He is the sixth of them, and no less than that and no more except that He is with them wherever they are.", key: "58:7", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ma'iyyah by knowledge in najwa."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Awareness grounding conduct."}] },
  { id: "cand-1708", label: "Private counsel redirected from sin and aggression to righteousness and piety", def: "In 58:9: O you who have believed, when you converse privately do not converse about sin and aggression and disobedience to the Messenger but converse about righteousness and piety, and fear Allah to whom you will be gathered.", key: "58:9", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Birr and taqwa as counsel content."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Communal speech ethic."}] },
  { id: "cand-1709", label: "Satanic whispering meant to grieve believers yet powerless without permission", def: "In 58:10: Private conversation is only from Satan that he may grieve those who have believed, but he will not harm them at all except by permission of Allah; and upon Allah let the believers rely.", key: "58:10", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Najwa as Satanic instrument."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Tawakkul as the response."}] },

  { id: "cand-1710", label: "Assembly courtesy answered by divine elevation of believers and the knowledgeable", def: "In 58:11: O you who have believed, when you are told space yourselves in assemblies then make space, Allah will make space for you; and when you are told arise then arise, Allah will raise those who have believed among you and those who were given knowledge by degrees.", key: "58:11", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Tafassuh as communal adab."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Knowledge ranked with faith."}] },
  { id: "cand-1711", label: "Charity before private consultation with concession and reaffirmed obligations", def: "In 58:12-13: When you wish to privately consult the Messenger present before your consultation a charity, that is better for you and purer, but if you find not the means then indeed Allah is Forgiving and Merciful; have you feared to present charities, then when you do not and Allah has forgiven you then establish prayer and give zakah and obey Allah and His Messenger.", key: "58:12", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Sadaqah before najwa."},{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Standing duties reaffirmed after concession."}] },

  { id: "cand-1712", label: "False oaths used as cover to avert people from Allah's way", def: "In 58:16: They took their false oaths as a cover so they averted people from the way of Allah, and for them is a humiliating punishment.", key: "58:16", overlap: [{topicId:"evidence-standards",layer:"scholarly",relationship:"related-not-identical",note:"Oath abused as junnah."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Obstruction of the divine way."}] },
  { id: "cand-1713", label: "Satan's mastery producing forgetfulness of remembrance and the losing party", def: "In 58:19: Satan has overcome them and made them forget the remembrance of Allah; those are the party of Satan; unquestionably the party of Satan they will be the losers.", key: "58:19", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr forgotten under Satanic mastery."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Hizb al-shaytan named."}] },
  { id: "cand-1714", label: "Written decree that Allah and His messengers will surely overcome", def: "In 58:21: Allah has written, I will surely overcome, I and My messengers; indeed Allah is Powerful and Exalted in Might.", key: "58:21", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Ghalabah promised to messengers."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Kataba Allah decree."}] },
  { id: "cand-1715", label: "Loyalty overriding kinship with faith inscribed and mutual pleasure as the successful party", def: "In 58:22: You will not find a people who believe in Allah and the Last Day having affection for those who oppose Allah and His Messenger even if they were their fathers or their sons or their brothers or their kindred; those He has decreed within their hearts faith and supported them with spirit from Him, and We will admit them to gardens beneath which rivers flow wherein they abide eternally; Allah is pleased with them and they are pleased with Him, those are the party of Allah, unquestionably the party of Allah they are the successful.", key: "58:22", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Kataba fi qulubihim al-iman."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Kinship subordinated to loyalty."}] }
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
extractions[3].topicCandidateIds = candidates.candidates.slice(9, 13).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `058-al-mujadila-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-082.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-082.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
