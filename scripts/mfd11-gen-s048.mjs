// MFD-11 Wave 7: Surah 48 (Al-Fath) genuine re-extraction.
// Covers 48:1-29 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "048-0001-0029.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 48:${n} not found`);
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

console.log("Generating Surah 48 (Al-Fath) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T16:20:00.000Z";

const PASSAGES = [
  { id: "ext-048-p1", from: 1, to: 10,
    label: "Given clear conquest; Allah forgive preceded sin follow complete favour guide straight path; aid mighty victory; sent down tranquillity hearts believers increase faith along present faith; Allah belong soldiers heavens earth ever Allah Knowing Wise; admit believing men women gardens rivers flow abide eternally remove misdeeds ever that sight Allah great attainment; punish hypocrite men women polytheist men women assume about Allah assumption evil nature; upon them misfortune evil nature Allah angry cursed prepared Hell evil destination; Allah belong soldiers heavens earth ever Allah Exalted Might Wise; sent you witness bringer good tidings warner; people believe Allah Messenger honor him respect Prophet exalt Allah morning afternoon; pledge allegiance you actually pledging allegiance Allah hand Allah over their hands; breaks word only breaks detriment himself; fulfills promised Allah give great reward",
    mainLabel: "Clear conquest granted so that Allah may forgive prior and future sin, complete His favour, guide to a straight path and aid with mighty victory; tranquillity sent into believers' hearts increasing their faith, with cosmic soldiers belonging to Allah the Knowing Wise; believing men and women admitted to rivered gardens eternally with misdeeds removed as great attainment; hypocrites and polytheists of both sexes punished for assuming evil of Allah, earning His anger, curse and Hell as evil destination; soldiers of heavens and earth reaffirmed under the Mighty Wise; the Prophet sent as witness, bringer of good tidings and warner so that people believe, honour, respect and exalt Allah morning and afternoon; pledging allegiance to the Prophet identified as pledging to Allah whose hand is over theirs, breaking it harming only oneself while fulfilling it earning great reward" },
  { id: "ext-048-p2", from: 11, to: 22,
    label: "Remained behind bedouins say properties families occupied us ask forgiveness; say tongues what not within hearts; say who could prevent Allah intended harm benefit rather ever Allah with do Acquainted; thought Messenger believers never return families ever made pleasing hearts assumed assumption evil became people ruined; whoever not believed Allah Messenger prepared disbelievers Blaze; Allah belongs dominion heavens earth forgives whom wills punishes whom wills ever Allah Forgiving Merciful; remained behind say set out toward war booty take it let us follow wish change words Allah; say never follow thus did Allah say before; say rather envy us but not understanding except little; say remained behind bedouins called face people great military might fight them or submit; obey Allah give good reward turn away as turned away before punish painful punishment; not upon blind guilt lame ill guilt remaining behind; obeys Allah Messenger admit gardens rivers flow turns away punish painful punishment; certainly Allah pleased believers pledged allegiance you under tree knew what was in hearts sent down tranquillity rewarded imminent conquest; much war booty take ever Allah Exalted Might Wise",
    mainLabel: "Bedouins remaining behind excusing themselves with property and family claims, asking forgiveness verbally while hearts are empty, answered by Allah's exclusive control over harm and benefit and His acquaintance with their deeds; their expectation that the Messenger and believers would never return exposed as an evil assumption producing ruin; disbelievers facing a prepared Blaze against divine dominion where forgiveness and punishment are dispensed by will; those remaining behind wishing to follow for booty told they will never follow since Allah has already spoken, their accusation of envy reflecting minimal understanding; called instead to face a people of great military might with obedience earning reward and repetition of prior turning earning painful punishment; exemptions for the blind, lame and ill affirmed alongside obedience-reward and disobedience-punishment; Allah's pleasure with the believers who pledged under the tree confirmed by His knowledge of their hearts, tranquillity sent and imminent conquest rewarded alongside much booty under the Mighty Wise" },
  { id: "ext-048-p3", from: 23, to: 29,
    label: "Established way Allah occurred before never find way Allah any change; withheld their hands from you your hands from them within Makkah after caused overcome them ever Allah what do Seeing; ones disbelieved obstructed Masjid al-Haram offering prevented reaching place sacrifice; if not for believing men women did not know trample befall dishonor without knowledge permitted enter Makkah so Allah might admit mercy whom willed; if apart would have punished disbelieved among them painful punishment; disbelieved put hearts chauvinism chauvinism time ignorance; Allah sent down tranquillity Messenger believers imposed word righteousness more deserving worthy ever Allah all things Knowing; certainly Allah showed Messenger vision truth; surely enter Masjid al-Haram if Allah wills safety heads shaved hair shortened not fearing; knew what did not know arranged before conquest near hand; sent Messenger guidance religion truth manifest over all religion sufficient Allah Witness; Muhammad Messenger Allah those with him forceful against disbelievers merciful among themselves; see bowing prostrating seeking bounty Allah pleasure; mark faces trace prostration; description Torah; description Gospel plant produces offshoots strengthens grow firm stand upon stalks delighting sowers so Allah enrage by them disbelievers; Allah promised believe righteous deeds among them forgiveness great reward",
    mainLabel: "The established way of Allah confirmed as unchanging; His withholding of both sides' hands within Makkah after granting overcoming, seeing all actions; obstruction of al-Masjid al-Haram and prevention of the sacrificial offering cited, with entry restrained only to protect unknown believers from trampling-dishonour and to admit mercy to whom He wills, otherwise painful punishment would have struck the disbelievers; jahiliyya chauvinism placed in disbelievers' hearts against tranquillity and the word of righteousness imposed on the Messenger and believers who were most deserving; the vision shown to the Prophet in truth confirmed — safe entry to al-Masjid al-Haram with shaved or shortened heads and no fear, with an earlier near conquest arranged beyond their knowledge; the Messenger sent with guidance and the religion of truth to prevail over all religions, Allah sufficing as Witness; Muhammad named Messenger of Allah, his companions forceful against disbelievers yet merciful among themselves, seen bowing and prostrating seeking bounty and pleasure, their facial marks from prostration described in the Torah and compared in the Gospel to a strengthening plant delighting sowers so that Allah enrages the disbelievers through them; forgiveness and great reward promised to those among them who believe and do righteous deeds" }
];

const SUB_LABELS = {
  "ext-048-p1": [
    "Clear conquest granted to the Prophet",
    "Forgiveness of prior and future sin, completion of favour, guidance to a straight path stated as its purposes",
    "Mighty victory promised as further divine aid",
    "Tranquillity sent into believers' hearts increasing their faith alongside existing faith",
    "Cosmic soldiers belonging to Allah, the Knowing and Wise",
    "Believing men and women admitted to rivered gardens eternally with misdeeds removed as great attainment",
    "Hypocrite and polytheist men and women punished for assuming evil of Allah",
    "Evil-natured misfortune, divine anger, curse and Hell prepared for them as evil destination",
    "Soldiers of heavens and earth reaffirmed under the Exalted in Might, the Wise",
    "The Prophet sent as witness, bringer of good tidings and warner so that people believe, honour, respect and exalt Allah morning and afternoon"
  ],
  "ext-048-p2": [
    "Bedouins remaining behind excusing themselves with property and family, asking forgiveness verbally while hearts are empty",
    "Allah's exclusive control over harm and benefit affirmed with full acquaintance with their deeds",
    "Their expectation that the Messenger and believers would never return exposed as an evil assumption producing ruin",
    "Disbelievers facing a prepared Blaze against divine dominion where forgiveness and punishment are dispensed by will",
    "Those remaining behind wishing to follow for booty told they will never follow since Allah spoke first",
    "Their accusation of envy reflecting minimal understanding",
    "Called instead to face a people of great military might with obedience earning reward and repeated refusal earning painful punishment",
    "Exemptions for the blind, lame and ill affirmed alongside obedience-reward and disobedience-punishment",
    "Allah pleased with believers who pledged under the tree, knowing their hearts, sending tranquillity and rewarding with imminent conquest",
    "Much war booty promised as hastened victory with hands withheld as a sign for believers and guidance to a straight path",
    "Future victories already encompassed by Allah under universal competence",
    "Disbelievers would have fled if they had fought, finding no protector or helper"
  ],
  "ext-048-p3": [
    "The established way of Allah confirmed as unchanging across history",
    "Both sides' hands withheld within Makkah after overcoming, under divine sight",
    "Obstruction of al-Masjid al-Haram and prevention of the sacrificial offering, with entry restrained to protect unknown believers and admit mercy",
    "Jahiliyya chauvinism against tranquillity and the word of righteousness imposed on the Messenger and believers who were most deserving",
    "Vision of safe Masjid entry confirmed in truth with near conquest arranged beyond their knowledge",
    "The Messenger sent with guidance and the religion of truth to prevail over all religions, Allah sufficing as Witness",
    "Muhammad named Messenger of Allah with companions described in Torah and Gospel as forceful yet merciful, bowing and prostrating, their mark from prostration, like a strengthening plant delighting sowers to enrage disbelievers, with forgiveness and great reward promised"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`48:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`48:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 48, surahName: "Al-Fath",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 7 genuine re-extraction. Boundaries follow the text: P1 closes with the pledge-allegiance-to-Allah sequence (10) before the bedouin-excuses block opens (11); P2 ends with the imminent-conquest-and-booty promise (19) plus the competence affirmation (20-22 contextually linked); P3 runs from the unchanging sunnah through the Masjid al-Haram restraint, the vision confirmation, the Messenger's universal mission and the closing companion-description with reward (23-29). Note: P2 includes verses 20-22 as part of the booty-and-competence continuation despite the thematic shift, keeping the passage count at 3 for this 29-verse surah.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (48:1-10) ===
{
  const e = extractions[0];
  const aleem = findWord(4, ["\u0639","\u0644","\u064a","\u0645"]);
  const hakeem = findWord(4, ["\u062d","\u0643","\u064a","\u0645"]);
  const aziz = findWord(7, ["\u0639","\u0632","\u064a","\u0632"]);
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["48:4"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["48:4"] });
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["48:7"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["48:9"], excerpt: fv(9), description: "That you may believe in Allah and His Messenger and honour him and respect the Prophet and exalt Allah morning and afternoon." });

  e.humanConditionsAndSpiritualStates.push({ label: "Tranquillity increasing faith alongside existing faith in believers' hearts", keys: ["48:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Evil assumption about Allah earning anger, curse and Hell", keys: ["48:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Pledging allegiance to the Prophet identified as pledging to Allah with His hand over theirs", keys: ["48:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Breaking the pledge harming only oneself while fulfilling it earns great reward", keys: ["48:10"], evidenceClass: "EXPLICIT_TEXT" });

  const fath = findWord(1, ["\u0641","\u062a","\u062d"]);
  if (fath) e.terminology.push({ term: fath, transliteration: "fath", gloss: "clear conquest/victory (editorial gloss)", keys: ["48:1"] });
  const sakinah = findWord(4, ["\u0633","\u0643","\u064a","\u0646"]);
  if (sakinah) e.terminology.push({ term: sakinah, transliteration: "sakinah", gloss: "tranquillity (editorial gloss)", keys: ["48:4"] });
}

// === POPULATE P2 (48:11-22) ===
{
  const e = extractions[1];
  const ghafoor = findWord(14, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(14, ["\u0631","\u062d","\u064a","\u0645"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["48:14"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["48:14"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["48:16"], excerpt: fv(16), description: "Say to those who remained behind: You will be called to face a people of great military might; fight them or they will submit." });

  e.humanConditionsAndSpiritualStates.push({ label: "Verbal excuse masking inner disbelief among the bedouins who remained behind", keys: ["48:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Evil assumption that the Messenger and believers would never return producing ruin", keys: ["48:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Envy accusation reflecting minimal understanding", keys: ["48:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Allah's pleasure with the believers under the tree confirmed by knowledge of their hearts", keys: ["48:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Exemption from battle guilt for the blind, lame and ill", keys: ["48:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "War booty as divine reward following the pledge under the tree", keys: ["48:18","48:19"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine dominion dispensing forgiveness and punishment by will", keys: ["48:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Future victories already encompassed by Allah under universal competence", keys: ["48:21"], evidenceClass: "EXPLICIT_TEXT" });

  const bayah = findWord(18, ["\u0628","\u0627","\u064a","\u0639"]);
  if (bayah) e.terminology.push({ term: bayah, transliteration: "bay'ah", gloss: "pledge of allegiance (editorial gloss)", keys: ["48:18"] });
}

// === POPULATE P3 (48:23-29) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Jahiliyya chauvinism placed in disbelievers' hearts against tranquillity and the word of righteousness", keys: ["48:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Companions described as forceful against disbelievers yet merciful among themselves", keys: ["48:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Facial marks from prostration as the visible sign of devotion", keys: ["48:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Restraint at Makkah protecting unknown believers from trampling-dishonour", keys: ["48:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "The established way of Allah confirmed as unchanging across history", keys: ["48:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Vision of safe entry to al-Masjid al-Haram confirmed in truth with near conquest arranged", keys: ["48:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The religion of truth sent to prevail over all religions with Allah as sufficient Witness", keys: ["48:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Companion-description in Torah and Gospel as strengthening plant delighting sowers to enrage disbelievers", keys: ["48:29"], evidenceClass: "EXPLICIT_TEXT" });

  const sunnah = findWord(23, ["\u0633","\u0646","\u062a"]);
  if (sunnah) e.terminology.push({ term: sunnah, transliteration: "sunnat Allah", gloss: "established way of Allah (editorial gloss)", keys: ["48:23"] });
  const kalimat = findWord(26, ["\u0643","\u0644","\u0645"]);
  if (kalimat) e.terminology.push({ term: kalimat, transliteration: "kalimat al-taqwa", gloss: "word of righteousness (editorial gloss)", keys: ["48:26"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `048-al-fath-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 048-al-fath-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-048-p1,ext-048-p2,ext-048-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1583", label: "Clear conquest granted with forgiveness, favour completion and guidance", def: "In 48:1-2: Indeed We have given you a clear conquest that Allah may forgive for you what preceded of your sin and what will follow and complete His favour upon you and guide you to a straight path.", key: "48:1", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Fath mubin as prophetic sign."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Maghfirah framing the victory."}] },
  { id: "cand-1584", label: "Tranquillity increasing faith alongside existing faith", def: "In 48:4: It is He who sent down tranquillity into the hearts of the believers that they would increase in faith along with their present faith; and to Allah belong the soldiers of the heavens and the earth.", key: "48:4", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman ziyadah via sakinah."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Heart-settling as divine gift."}] },
  { id: "cand-1585", label: "Evil assumption about Allah earning anger, curse and Hell", def: "In 48:6: And that He may punish the hypocrite men and women and polytheist men and women who assume about Allah an assumption of evil nature; upon them is misfortune of evil nature and Allah has become angry with them and cursed them and prepared Hell.", key: "48:6", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Zann al-saw' as faith failure."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Ghadab and la'n paired."}] },
  { id: "cand-1586", label: "Pledge to the Prophet identified as pledge to Allah with His hand over theirs", def: "In 48:10: Indeed those who pledge allegiance to you are actually pledging allegiance to Allah; the hand of Allah is over their hands; so he who breaks his word only breaks it to the detriment of himself, and he who fulfills what he promised Allah, He will give him a great reward.", key: "48:10", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Bay'ah as divine covenant."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Yad Allah metaphor."}] },

  { id: "cand-1587", label: "Bedouin excuses masking inner disbelief exposed by divine acquaintance", def: "In 48:11-12: Those who remained behind of the bedouins will say our properties and families occupied us so ask forgiveness for us; they say with their tongues what is not within their hearts; but you thought the Messenger and believers would never return and assumed an assumption of evil and became a people ruined.", key: "48:11", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Tongue-heart mismatch."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Zann al-saw' producing ruin."}] },
  { id: "cand-1588", label: "Battle exemptions for the blind, lame and ill with obedience-reward framework", def: "In 48:17: There is not upon the blind any guilt or upon the lame any guilt or upon the ill any guilt for remaining behind; and whoever obeys Allah and His Messenger He will admit him to gardens beneath which rivers flow.", key: "48:17", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Capacity-based exemption."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Obedience tied to reward."}] },
  { id: "cand-1589", label: "Allah's pleasure with the pledge under the tree confirmed by heart-knowledge", def: "In 48:18: Certainly was Allah pleased with the believers when they pledged allegiance to you under the tree and He knew what was in their hearts so He sent down tranquillity upon them and rewarded them with an imminent conquest.", key: "48:18", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Rida linked to bay'ah."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Immediate reward for steadfastness."}] },

  { id: "cand-1590", label: "Unchanging established way of Allah across history", def: "In 48:23: This is the established way of Allah which has occurred before; and never will you find in the way of Allah any change.", key: "48:23", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sunnah consistency."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"No tabdil fi sunnat Allah."}] },
  { id: "cand-1591", label: "Restraint at Makkah protecting unknown believers from trampling-dishonour", def: "In 48:25: They are the ones who disbelieved and obstructed you from al-Masjid al-Haram while the offering was prevented from reaching its place of sacrifice; and if not for believing men and women whom you did not know that you might trample them and there would befall you because of them dishonor without knowledge, you would have been permitted to enter.", key: "48:25", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Collective protection principle."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Restraint as mercy mechanism."}] },
  { id: "cand-1592", label: "Jahiliyya chauvinism against tranquillity and the word of righteousness", def: "In 48:26: When those who disbelieved had put into their hearts chauvinism, the chauvinism of the time of ignorance; but Allah sent down His tranquillity upon His Messenger and upon the believers and imposed upon them the word of righteousness and they were more deserving of it and worthy of it.", key: "48:26", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Hammiyyat al-jahiliyyah named."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Kalimat al-taqwa imposed."}] },
  { id: "cand-1593", label: "Vision of safe Masjid entry confirmed with near conquest arranged", def: "In 48:27: Certainly has Allah showed to His Messenger the vision in truth; you will surely enter al-Masjid al-Haram if Allah wills in safety with your heads shaved and hair shortened not fearing anyone; He knew what you did not know and has arranged before that a conquest near at hand.", key: "48:27", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Ru'ya bi'l-haqq fulfilled."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Near fath as divine arrangement."}] },
  { id: "cand-1594", label: "Religion of truth sent to prevail over all religions with Allah as Witness", def: "In 48:28: It is He who sent His Messenger with guidance and the religion of truth to manifest it over all religion; and sufficient is Allah as Witness.", key: "48:28", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Din al-haqq universal scope."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Shahid sufficiency."}] },
  { id: "cand-1595", label: "Companions described in Torah and Gospel as strengthening plant delighting sowers", def: "In 48:29: Muhammad is the Messenger of Allah and those with him are forceful against the disbelievers merciful among themselves; you see them bowing and prostrating seeking bounty from Allah and His pleasure; their mark is on their faces from the trace of prostration; that is their description in the Torah and their description in the Gospel is as a plant which produces its offshoots and strengthens them so they grow firm and stand upon their stalks delighting the sowers so that Allah may enrage by them the disbelievers; Allah has promised those who believe and do righteous deeds among them forgiveness and a great reward.", key: "48:29", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Cross-scriptural description."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ashidda' ruhamā' profile."}] }
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
    notes: "Wave 7 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 9).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(9, 13).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `048-al-fath-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-072.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-072.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");