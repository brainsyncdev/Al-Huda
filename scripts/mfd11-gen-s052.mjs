// MFD-11 Wave 8: Surah 52 (At-Tur) genuine re-extraction.
// Covers 52:1-49 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "052-0001-0049.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 52:${n} not found`);
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

console.log("Generating Surah 52 (At-Tur) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T16:55:00.000Z";

const PASSAGES = [
  { id: "ext-052-p1", from: 1, to: 16,
    label: "By mount; Book inscribed; parchment spread open; frequented House; ceiling raised high; sea set fire; indeed punishment Lord occur; no preventer; Day heaven sway circular motion; mountains pass departing; woe Day deniers; within discourse falsehood amusing; Day thrust toward fire Hell violent shove angels say; this Fire used deny; magic or not see; enter burn patient impatient same only recompensed used do",
    mainLabel: "Six oaths by the Mount, an inscribed Book on spread parchment, the frequented House, the raised ceiling and the sea set on fire grounding the certainty of the Lord's inevitable punishment that none can prevent; the Day the heaven sways and mountains depart bringing woe to deniers absorbed in false amusement; their violent shoving toward Hell where angels declare this is the Fire they denied, challenged whether it is magic or they cannot see; told to burn patiently or impatiently since both are equal — they are only being recompensed for their deeds" },
  { id: "ext-052-p2", from: 17, to: 28,
    label: "Righteous among gardens happiness; rejoicing Lord given protected punishment Hellfire; eat drink satisfaction used do; reclining arranged couches marry fair women large beautiful eyes; believed descendants followed faith join descendants not deprive anything deeds every person earned retained; provide fruit meat whatever desire; exchange cup wine no ill speech commission sin; circulate servant boys especially pearls well-protected; approach one another inquiring; say indeed previously among people fearful; Allah conferred favor protected punishment Scorching Fire; indeed used supplicate Him before indeed Beneficent Merciful",
    mainLabel: "The righteous placed among gardens and happiness, rejoicing in their Lord's gift and His protection from Hellfire; eating and drinking in satisfaction for their prior deeds, reclining on arranged couches and married to fair large-eyed women; believing parents joined with their faithful descendants without any deed-deprivation since each person retains what they earned; provided with desired fruit and meat, exchanging cups free of ill speech or sin, served by pearl-like boys circulating especially for them; approaching one another in mutual inquiry, recalling their former fear of displeasing Allah and His conferred favour protecting them from the Scorching Fire, attributed to their prior supplication to the Beneficent Merciful" },
  { id: "ext-052-p3", from: 29, to: 49,
    label: "Remind Muhammad grace Lord not soothsayer madman; say poet await misfortune time; say wait indeed with you among wait; minds command this transgressing people; say made up rather not believe; produce statement like it truthful; created nothing creators themselves; create heavens earth rather not certain; depositories Lord control; stairway heaven listen listener produce clear authority; daughters you sons; ask payment weighed debt; unseen write down; intend plan disbelieve against them plan; deity other Allah exalted above associate; see fragment sky falling say clouds brought layers; leave meet Day struck unconscious; Day plan not avail nor helped; indeed wronged punishment besides most not know; patient Muhammad decision Lord indeed Our eyes exalt praise Lord arise; part night exalt after setting stars",
    mainLabel: "Reminder commissioned by the Lord's grace affirming the Prophet is neither soothsayer nor madman; their accusation of poet awaiting misfortune answered by mutual waiting; their minds commanding this or they being transgressors; the fabrication charge countered by their disbelief and challenge to produce a like statement; five rhetorical questions exposing their incoherence — created from nothing or self-created, creators of cosmos yet uncertain, possessing divine depositories or control, having a heavenly stairway with authoritative listener, attributing daughters to Allah while claiming sons; further challenges on payment demanded, unseen knowledge written down, plotted plans recoiling on plotters, and any deity besides the Exalted Allah; even seeing a sky-fragment fall they would dismiss it as layered clouds; commanded to leave them until their Day of unconsciousness when plans fail and no help arrives; wrongdoers facing additional punishment unknown to most; patience commanded under the Lord's decision with the Prophet held in divine sight, timed praise upon arising, during part of the night and after the stars set" }
];

const SUB_LABELS = {
  "ext-052-p1": [
    "Oath by the Mount",
    "Oath by an inscribed Book",
    "On parchment spread open",
    "Oath by the frequented House",
    "Oath by the ceiling raised high",
    "Oath by the sea set on fire",
    "The punishment of your Lord declared certain to occur",
    "None can prevent it",
    "The Day the heaven sways with circular motion",
    "The mountains passing on and departing",
    "Woe that Day to the deniers",
    "Absorbed in false discourse and self-amusement",
    "Thrust toward Hell's fire with a violent shove by its angels",
    "Told this is the Fire they used to deny",
    "Challenged whether it is magic or they cannot see",
    "Told to burn patiently or impatiently since both are equal — only recompensed for deeds"
  ],
  "ext-052-p2": [
    "The righteous placed among gardens and happiness",
    "Rejoicing in their Lord's gift and protected from Hellfire's punishment",
    "Eating and drinking in satisfaction for what they used to do",
    "Reclining on arranged couches and married to fair large-eyed women",
    "Believing parents joined with faithful descendants without deed-deprivation, each retaining what they earned",
    "Provided with fruit and meat from whatever they desire",
    "Exchanging cups free of ill speech or sin",
    "Pearl-like servant boys circulating especially for them",
    "Approaching one another in mutual inquiry",
    "Recalling their former fear of displeasing Allah among their people",
    "Allah's conferred favour and protection from the Scorching Fire acknowledged",
    "Attributed to prior supplication to the Beneficent and Merciful"
  ],
  "ext-052-p3": [
    "Reminder commissioned by the Lord's grace; the Prophet is neither soothsayer nor madman",
    "Poet-accusation answered by mutual waiting for outcome",
    "Their minds commanding this or they being a transgressing people",
    "Fabrication charge countered by their disbelief and challenge to produce a like statement",
    "Created from nothing or self-created — exposing incoherence",
    "Creators of heavens and earth yet uncertain",
    "Possessing divine depositories or exercising control over them",
    "Having a heavenly stairway upon which they listen",
    "Let their listener produce a clear authority",
    "Attributing daughters to Allah while claiming sons for themselves",
    "Payment demanded so they are weighed down by debt",
    "Unseen knowledge claimed and written down",
    "Plotting plans that recoil upon the plotters",
    "No deity besides Allah; He is exalted above what they associate",
    "Even seeing a sky-fragment fall they would dismiss it as layered clouds",
    "Leave them until their Day of unconsciousness",
    "That Day their plan will not avail them nor will they be helped",
    "Wrongdoers facing additional punishment besides that",
    "Most of them do not know about this additional punishment",
    "Patience commanded for the Lord's decision with the Prophet held in divine sight",
    "Timed praise upon arising, during part of the night and after the stars set"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`52:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`52:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 52, surahName: "At-Tur",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 8 genuine re-extraction. Boundaries follow the text: P1 closes with the burn-patiently-or-impatiently verdict (16) before the righteous-reward block opens (17); P2 ends with the Beneficent-Merciful attribution (28) before the reminder-commission begins (29); P3 runs from that commission through the rhetorical challenges, sky-fragment dismissal, Day-of-unconsciousness and the closing timed-praise command (29-49).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (52:1-16) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Deniers absorbed in false discourse and self-amusement", keys: ["52:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Violent shoving toward Hell with angels declaring this is the Fire they denied", keys: ["52:13","52:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Six oaths grounding the inevitability of the Lord's punishment", keys: ["52:1","52:2","52:3","52:4","52:5","52:6","52:7","52:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Heaven swaying and mountains departing as cosmic signs of the Day", keys: ["52:9","52:10"], evidenceClass: "EXPLICIT_TEXT" });

  const tur = findWord(1, ["\u0637","\u0648","\u0631"]);
  if (tur) e.terminology.push({ term: tur, transliteration: "tur", gloss: "the Mount (editorial gloss)", keys: ["52:1"] });
  const mastur = findWord(2, ["\u0645","\u0633","\u0637","\u0648","\u0631"]);
  if (mastur) e.terminology.push({ term: mastur, transliteration: "mastur", gloss: "inscribed (editorial gloss)", keys: ["52:2"] });
  const bayt = findWord(4, ["\u0628","\u064a","\u062a"]);
  if (bayt) e.terminology.push({ term: bayt, transliteration: "al-bayt al-ma'mur", gloss: "frequented House (editorial gloss)", keys: ["52:4"] });
}

// === POPULATE P2 (52:17-28) ===
{
  const e = extractions[1];
  const barr = findWord(28, ["\u0628","\u0631"]);
  const raheem = findWord(28, ["\u0631","\u062d","\u064a","\u0645"]);
  if (barr) e.divineNamesAndAttributes.push({ term: barr, transliteration: "Barr", gloss: "Beneficent (editorial gloss)", keys: ["52:28"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["52:28"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Former fear of displeasing Allah recalled as the cause of divine favour and protection", keys: ["52:26","52:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prior supplication identified as the means by which Allah's favour was conferred", keys: ["52:28"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Gardens, happiness, food, drink, couches and fair spouses as the righteous reward", keys: ["52:17","52:18","52:19","52:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Pearl-like servant boys circulating in Paradise", keys: ["52:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Believing parents joined with faithful descendants without any deed-deprivation", keys: ["52:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Cups exchanged in Paradise free of ill speech or sin", keys: ["52:23"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P3 (52:29-49) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["52:29"], excerpt: fv(29), description: "So remind; by the grace of your Lord you are not a soothsayer or a madman." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["52:45"], excerpt: fv(45), description: "So leave them until they meet their Day in which they will be struck unconscious." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["52:48"], excerpt: fv(48), description: "Be patient for the decision of your Lord; indeed you are in Our eyes; exalt with praise when you arise." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["52:49"], excerpt: fv(49), description: "And in a part of the night exalt Him and after the setting of the stars." });

  e.humanConditionsAndSpiritualStates.push({ label: "Accusations of poet, soothsayer and madman rejected by divine grace", keys: ["52:29","52:30"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Even seeing a sky-fragment fall they would dismiss it as layered clouds", keys: ["52:44"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Five rhetorical questions exposing the incoherence of denial", keys: ["52:35","52:36","52:37","52:38","52:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Plans of disbelievers recoiling upon them while Allah is exalted above association", keys: ["52:42","52:43"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Prophet held in divine sight with timed praise stations commanded", keys: ["52:48","52:49"], evidenceClass: "EXPLICIT_TEXT" });

  const kahin = findWord(29, ["\u0643","\u0647","\u0646"]);
  if (kahin) e.terminology.push({ term: kahin, transliteration: "kahin", gloss: "soothsayer (editorial gloss)", keys: ["52:29"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `052-at-tur-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 052-at-tur-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-052-p1,ext-052-p2,ext-052-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1632", label: "Six oaths grounding the inevitability of divine punishment", def: "In 52:1-8: By the mount and a Book inscribed in parchment spread open and the frequented House and the ceiling raised high and the sea set on fire; indeed the punishment of your Lord will occur; of it there is no preventer.", key: "52:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Qasam series affirming adhab."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Ma min dafi' impossibility."}] },
  { id: "cand-1633", label: "Cosmic upheaval on the Day: heaven swaying and mountains departing", def: "In 52:9-10: On the Day the heaven will sway with circular motion and the mountains will pass on departing.", key: "52:9", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Tamuru and tasir imagery."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Cosmic dissolution as ayah."}] },
  { id: "cand-1634", label: "Violent shoving toward Hell with angels declaring the denied Fire", def: "In 52:13-14: The Day they are thrust toward the fire of Hell with a violent shove; this is the Fire which you used to deny.", key: "52:13", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Yuda'unna pushing."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Denied truth confronted."}] },
  { id: "cand-1635", label: "Patience and impatience equal in Hell — only recompense for deeds", def: "In 52:16: Enter to burn therein; then be patient or impatient it is all the same for you; you are only being recompensed for what you used to do.", key: "52:16", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Sabr impatience equivalence."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Jaza' amal principle."}] },

  { id: "cand-1636", label: "Righteous reward: gardens, joy, protection, food, drink, spouses and servants", def: "In 52:17-24: Indeed the righteous will be among gardens and happiness rejoicing in what their Lord has given them and their Lord protected them from the punishment of Hellfire; eat and drink in satisfaction; reclining on arranged couches married to fair women with large beautiful eyes; provided with fruit and meat; exchanging cups with no ill speech or sin; servant boys circulating like protected pearls.", key: "52:17", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Comprehensive Jannah description."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Reward tied to prior righteousness."}] },
  { id: "cand-1637", label: "Believing families reunited in Paradise without deed-deprivation", def: "In 52:21: And those who believed and whose descendants followed them in faith We will join with them their descendants and We will not deprive them of anything of their deeds; every person for what he earned is retained.", key: "52:21", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Family reunion in Jannah."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual retention affirmed."}] },
  { id: "cand-1638", label: "Former fear and supplication acknowledged as cause of divine favour", def: "In 52:26-28: They will say indeed we were previously among our people fearful of displeasing Allah; so Allah conferred favor upon us and protected us from the punishment of the Scorching Fire; indeed we used to supplicate Him before; indeed He is the Beneficent the Merciful.", key: "52:26", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Kha'ifin as salvific state."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Du'a as means of protection."}] },

  { id: "cand-1639", label: "Reminder commissioned; Prophet neither soothsayer nor madman", def: "In 52:29: So remind by the grace of your Lord you are not a soothsayer or a madman.", key: "52:29", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Ni'mah negating kahin/majnun."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Dhakkir commission."}] },
  { id: "cand-1640", label: "Five rhetorical questions exposing denial's incoherence", def: "In 52:35-39: Or were they created by nothing or were they the creators of themselves? Or did they create the heavens and the earth? Rather they are not certain. Or have they the depositories of your Lord or are they in control? Or have they a stairway upon which they listen? Then let their listener produce a clear authority. Or has He daughters while you have sons?", key: "52:35", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Creation argument chain."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"La yuqinun diagnosed."}] },
  { id: "cand-1641", label: "Sky-fragment dismissed as clouds illustrating obstinate denial", def: "In 52:44: And if they were to see a fragment from the sky falling they would say it is merely clouds brought in layers.", key: "52:44", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Sign rejection pattern."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Obstinate reinterpretation."}] },
  { id: "cand-1642", label: "Timed praise commanded alongside patience under divine sight", def: "In 52:48-49: And be patient for the decision of your Lord for indeed you are in Our eyes; and exalt with praise of your Lord when you arise and in a part of the night exalt Him and after the setting of the stars.", key: "52:48", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr li-hukm rabbika."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Three temporal dhikr stations."}] }
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
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 8).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(8, 11).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `052-at-tur-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-076.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-076.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");