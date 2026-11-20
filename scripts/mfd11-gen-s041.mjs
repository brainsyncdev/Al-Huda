// MFD-11 Wave 6: Surah 41 (Fussilat) genuine re-extraction.
// Covers 41:1-54 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "041-0001-0054.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 41:${n} not found`);
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

console.log("Generating Surah 41 (Fussilat) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T15:35:00.000Z";

const PASSAGES = [
  { id: "ext-041-p1", from: 1, to: 18,
    label: "Ha-Meem; revelation from the Entirely Merciful Especially Merciful; Book detailed Arabic Quran for knowers; bashir-nadhir most turn away deaf; hearts covered ears deaf partition work we work; only man like you revealed one God straight course seek forgiveness woe associators no zakah Hereafter disbelievers; believers righteous uninterrupted reward; earth two days equals Lord worlds; mountains blessed sustenance four days; heaven smoke come willingly or compulsion came willingly; seven heavens two days inspired command lamps protection Aziz Aleem; warned thunderbolt Aad Thamud; messengers before after worship not except Allah said Lord willed angels sent disbelievers; Aad arrogant without right who greater strength Allah greater rejecting signs; screaming wind days misfortune disgrace worldly Hereafter more disgracing not helped; Thamud guided preferred blindness thunderbolt humiliating seized earned; saved believed feared Allah",
    mainLabel: "Opening letters and revelation from Rahman-Rahim grounding a detailed Arabic Book for knowers; bashir-nadhir function met by majority turning away; claimed heart-coverings ear-deafness and partition answered by the Prophet's human likeness and revealed tawheed with istighfar; woe to associators who withhold zakah and deny the Hereafter against uninterrupted reward for believing doers; the creation sequence of earth in two days, mountains and sustenance in four, heaven as smoke commanded to come willingly, seven heavens in two days with inspired command and lamp-adornment as protection; the thunderbolt warning recalling Aad and Thamud whose messengers came before and after calling to exclusive worship; Aad's unjust arrogance in strength answered by the Creator's greater power and a screaming wind of disgrace; Thamud preferring blindness over guidance seized by humiliating thunderbolt while believers who feared Allah were saved" },
  { id: "ext-041-p2", from: 19, to: 32,
    label: "Day enemies Allah gathered Fire driven assembled rows; reach it hearing eyes skins testify used do; say skins why testified made speak Allah makes everything speak created first time returned; not covering lest hearing sight skins testify assumed Allah not know much do; assumption about Lord brought ruin losers; patient Fire residence ask appease not allowed; appointed companions made attractive before behind sin word effect nations passed jinn men losers; disbelieve say not listen Quran speak noisily perhaps overcome; taste severe punishment recompense worst doing; recompense enemies Fire home eternity rejecting verses; disbelieved say show us misled jinn men put under feet lowest; said Our Lord Allah remained right course angels descend fear not grieve good tidings Paradise promised; allies worldly Hereafter souls desire request wish; accommodation Forgiving Merciful",
    mainLabel: "The gathering of Allah's enemies to the Fire in driven rows; bodily testimony of hearing, eyes and skins against their owners, answered by the skins' declaration that Allah made them speak as He created them first; the failure to conceal from one's own faculties rooted in the assumption that Allah does not know much of what they do, an assumption bringing ruin; patience and appeasement both useless in the Fire; appointed companions beautifying sin until the word takes effect among prior nations of jinn and men; the tactic of noisy disruption during recitation answered by severe punishment and recompense for the worst; the Fire as eternal home for rejecting verses; the plea to trample misleading jinn and men; against this, those who say our Lord is Allah and remain steadfast receive descending angels with fear-grief removal and Paradise tidings, angelic alliance in both realms, fulfilled desires and requests as accommodation from the Forgiving Merciful" },
  { id: "ext-041-p3", from: 33, to: 46,
    label: "who better speech invites Allah does righteousness says I am Muslims; good bad not equal repel evil better enmity becomes devoted friend; none granted except patient great portion good; Satan evil suggestion seek refuge Allah Hearing Knowing; signs night day sun moon prostrate not sun moon prostrate Allah created them if Him worship; arrogant near Lord exalt night day not weary; sign earth stilled rain quivers grows giver life dead competent; inject deviation verses not concealed cast Fire better secure Resurrection do whatever will Seeing; disbelieve message after come mighty Book; falsehood cannot approach before behind revelation Wise Praiseworthy; nothing said except said messengers before Lord possessor forgiveness painful penalty; non-Arabic Quran would say why not detailed foreign Arab say believers guidance cure non-believers ears deafness blindness called distant; Musa Scripture disagreement word preceded concluded disquieting doubt; righteousness for soul evil against it Lord not unjust servants",
    mainLabel: "The best speech defined as inviting to Allah with righteousness and declared submission; good and bad deeds unequal with evil repelled by better transforming enmity into devoted friendship, granted only to the patient possessing great good; Satanic suggestion answered by refuge in the Hearing Knowing; night-day-sun-moon as signs with prostration reserved to their Creator; the near ones exalting tirelessly despite human arrogance; the stilled earth revived by rain as proof of giving life to the dead; deviation-injectors exposed with the Fire-versus-security contrast; the mighty Book inaccessible to falsehood from before or behind as revelation from the Wise Praiseworthy; the message identical to prior messengers with forgiveness and painful penalty both held; the hypothetical non-Arabic objection answered by guidance-and-cure for believers against deafness-blindness for others; Musa's Scripture disputed under a preceding word; righteousness benefiting and evil harming the soul with divine justice affirmed" },
  { id: "ext-041-p4", from: 47, to: 54,
    label: "knowledge Hour attributed Him fruits coverings female conceive birth His knowledge Day call where partners announce no witness; lost invoking before certain no escape; man not weary supplication good evil touches hopeless despairing; taste mercy after adversity says this due me not think Hour occur if returned best inform disbelieved did taste massive punishment; favor turns away distances evil touches extensive supplication; consider if Quran from Allah disbelieved who more astray extreme dissension; show signs horizons within themselves clear truth sufficient Lord over all Witness; doubt meeting Lord encompassing all things",
    mainLabel: "Knowledge of the Hour attributed to Him alone with fruit-emergence and conception-birth known only to Him; the call for partners answered by the announcement that no witness remains; former invoked objects lost with certainty of no escape; man tireless in supplicating for good yet hopeless when evil touches; mercy after adversity misread as personal entitlement with denial of the Hour and presumption of the best outcome, answered by disclosure and massive punishment; favour producing withdrawal while evil produces extensive supplication; the challenge of disbelief in a Quran from Allah as extreme dissension; signs promised in the horizons and within themselves until truth becomes clear, with divine witness sufficing; closing doubt about the meeting answered by His encompassing all things" }
];

const SUB_LABELS = {
  "ext-041-p1": [
    "Fussilat opens with the same two letters that introduce the preceding Ha-Meem surah",
    "Revelation traced to the Entirely Merciful, the Especially Merciful",
    "A Book whose verses are detailed, an Arabic Quran for a people who know",
    "Its function as giver of good tidings and warner, met by most turning away without hearing",
    "Their claim of heart-coverings, ear-deafness and a partition, with mutual working declared",
    "The Prophet's human likeness and revealed oneness of God, with the straight course and forgiveness-seeking commanded and woe to associators",
    "Associators described as withholding zakah and disbelieving in the Hereafter",
    "Believing doers of righteous deeds promised an uninterrupted reward",
    "Challenge on disbelieving in the Creator of the earth in two days while attributing equals, named Lord of the worlds",
    "Firmly set mountains, blessing and determined sustenance in four days for those who ask",
    "Direction to the heaven while smoke, commanding it and the earth to come willingly or by compulsion, answered willingly",
    "Completion as seven heavens in two days with inspired command, lamp-adornment and protection as the determination of the Mighty Knowing",
    "Warning of a thunderbolt like that of Aad and Thamud if they turn away",
    "Messengers coming before and after calling to worship none but Allah, answered by the claim that angels would have been sent",
    "Aad's unjust arrogance and strength-boast answered by the Creator's greater strength, while they rejected the signs",
    "A screaming wind sent during days of misfortune to taste disgrace in this world, with the Hereafter more disgracing and no help",
    "Thamud guided but preferring blindness, seized by the thunderbolt of humiliating punishment for their earnings",
    "Those who believed and feared Allah saved from that seizure"
  ],
  "ext-041-p2": [
    "The Day the enemies of Allah are gathered to the Fire, driven and assembled in rows",
    "On reaching it their hearing, eyes and skins testify against them concerning their deeds",
    "Their question to their skins answered by the declaration that Allah made them speak as He made everything speak and created them first",
    "Their failure to conceal from their own faculties, rooted in the assumption that Allah does not know much of what they do",
    "That assumption about their Lord named as the cause of ruin and loss",
    "Patience availing nothing in the Fire, and requests to appease refused",
    "Appointed companions beautifying what was before and behind them until the word took effect among prior nations of jinn and men",
    "The disbelievers' instruction not to listen to the Quran and to speak noisily during recitation to overcome it",
    "Severe punishment promised with recompense for the worst of their deeds",
    "The Fire named the recompense of Allah's enemies and their home of eternity for rejecting His verses",
    "Their plea to be shown the jinn and men who misled them so they may trample them lowest",
    "Those who say our Lord is Allah and remain on a right course receiving descending angels with fear and grief removed and Paradise tidings",
    "Angelic alliance in worldly life and the Hereafter with whatever souls desire and request granted",
    "That state named accommodation from a Forgiving and Merciful Lord"
  ],
  "ext-041-p3": [
    "The best speech assigned to one who invites to Allah, does righteousness and declares himself among the Muslims",
    "Good and bad deeds declared unequal, with evil repelled by better turning enmity into devoted friendship",
    "That capacity granted only to the patient and to one possessing a great portion of good",
    "Satanic evil suggestion answered by seeking refuge in the Hearing Knowing",
    "Night, day, sun and moon named as signs, with prostration reserved to Allah who created them",
    "If they are arrogant, those near the Lord exalt Him night and day without weariness",
    "The stilled earth quivering and growing under rain as proof that its reviver gives life to the dead",
    "Those injecting deviation into the verses declared not concealed, with the Fire-versus-security contrast and the notice that He sees",
    "Disbelief in the message after its arrival set against its being a mighty Book",
    "Falsehood unable to approach it from before or behind, as revelation from the Wise Praiseworthy",
    "Nothing said to him except what was said to prior messengers, with the Lord possessing forgiveness and painful penalty",
    "The hypothetical non-Arabic Quran objection answered by guidance and cure for believers against deafness and blindness for others called from afar",
    "Musa's Scripture given but disputed, judgement deferred by a preceding word, with disquieting doubt about the Quran",
    "Righteousness benefiting the soul and evil harming it, with the Lord never unjust to His servants"
  ],
  "ext-041-p4": [
    "Knowledge of the Hour attributed to Him alone, with fruit-emergence and conception and birth known only to Him, and the call for partners answered by no remaining witness",
    "Former invoked objects lost from them with certainty that no place of escape exists",
    "Man tireless in supplicating for good but hopeless and despairing when evil touches him",
    "Mercy after adversity misread as personal entitlement with denial of the Hour and presumption of the best, answered by disclosure and massive punishment",
    "Favour causing turning away and distancing, while evil produces extensive supplication",
    "The challenge of who is more astray than one in extreme dissension if the Quran is from Allah and they disbelieved",
    "Signs promised in the horizons and within themselves until the truth becomes clear, with His witness over all things sufficing",
    "Their doubt about the meeting with their Lord answered by His encompassing all things"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`41:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`41:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 41, surahName: "Fussilat",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 6 genuine re-extraction. Boundaries follow the text: P1 closes with the saving of believers from Thamud's thunderbolt (18) before the enemies-gathering scene opens (19); P2 ends with the angelic accommodation promise (32); P3 runs from the best-speech question through the individual-recompense principle (33-46); P4 begins with Hour-knowledge exclusivity and closes with the encompassing-witness affirmation (47-54).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (41:1-18) ===
{
  const e = extractions[0];
  const rahman = findWord(2, ["\u0631","\u062d","\u0645","\u0646"]);
  const rahim = findWord(2, ["\u0631","\u062d","\u064a","\u0645"]);
  const aziz = findWord(12, ["\u0639","\u0632","\u064a","\u0632"]);
  const aleem = findWord(12, ["\u0639","\u0644","\u064a","\u0645"]);
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Entirely Merciful (editorial gloss)", keys: ["41:2"] });
  if (rahim) e.divineNamesAndAttributes.push({ term: rahim, transliteration: "Raheem", gloss: "Especially Merciful (editorial gloss)", keys: ["41:2"] });
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["41:12"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["41:12"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["41:6"], excerpt: fv(6), description: "So take a straight course to Him and seek His forgiveness." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["41:14"], excerpt: fv(14), description: "Worship not except Allah — the messengers' exclusive-worship call to Aad and Thamud." });

  e.humanConditionsAndSpiritualStates.push({ label: "Claimed heart-coverings, ear-deafness and partition blocking reception of the invitation", keys: ["41:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Aad's unjust arrogance and strength-boast answered by the Creator's greater strength", keys: ["41:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Thamud preferring blindness over guidance after being guided", keys: ["41:17"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Withholding zakah paired with disbelief in the Hereafter as the associators' profile", keys: ["41:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Determined sustenance placed in the earth alongside firmly set mountains", keys: ["41:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Heaven and earth commanded to come willingly or by compulsion, answering willingly", keys: ["41:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Believers who feared Allah saved while the preferring-blindness community was seized", keys: ["41:17","41:18"], evidenceClass: "EXPLICIT_TEXT" });

  const fussilat = findWord(3, ["\u0641","\u0635","\u0644","\u062a"]);
  if (fussilat) e.terminology.push({ term: fussilat, transliteration: "fussilat", gloss: "detailed/expounded (editorial gloss)", keys: ["41:3"] });
}

// === POPULATE P2 (41:19-32) ===
{
  const e = extractions[1];
  const ghafoor = findWord(32, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(32, ["\u0631","\u062d","\u064a","\u0645"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["41:32"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["41:32"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Hearing, eyes and skins testifying against their owners at the Fire", keys: ["41:20","41:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Assumption that Allah does not know much of what they do, named as the cause of ruin", keys: ["41:22","41:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Steadfastness after declaring our Lord is Allah earning descending angels with fear and grief removed", keys: ["41:30"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Organised noisy disruption during Quran recitation as a suppression tactic", keys: ["41:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Appointed companions beautifying sin until the word takes effect among prior nations of jinn and men", keys: ["41:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Bodily faculties made to speak by the One who created them first and to whom they return", keys: ["41:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Angelic alliance in worldly life and the Hereafter with desires and requests fulfilled", keys: ["41:31"], evidenceClass: "EXPLICIT_TEXT" });

  const istaqamu = findWord(30, ["\u0627","\u0633","\u062a","\u0642","\u0645"]);
  if (istaqamu) e.terminology.push({ term: istaqamu, transliteration: "istaqamu", gloss: "remained on a right course (editorial gloss)", keys: ["41:30"] });
}

// === POPULATE P3 (41:33-46) ===
{
  const e = extractions[2];
  const samee = findWord(36, ["\u0633","\u0645","\u064a","\u0639"]);
  const aleem = findWord(36, ["\u0639","\u0644","\u064a","\u0645"]);
  const hakeem = findWord(42, ["\u062d","\u0643","\u064a","\u0645"]);
  const hameed = findWord(42, ["\u062d","\u0645","\u064a","\u062f"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "Hearing (editorial gloss)", keys: ["41:36"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["41:36"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["41:42"] });
  if (hameed) e.divineNamesAndAttributes.push({ term: hameed, transliteration: "Hameed", gloss: "Praiseworthy (editorial gloss)", keys: ["41:42"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["41:34"], excerpt: fv(34), description: "Repel evil by that deed which is better, whereupon enmity becomes devoted friendship." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["41:36"], excerpt: fv(36), description: "If an evil suggestion comes from Satan, seek refuge in Allah." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["41:37"], excerpt: fv(37), description: "Do not prostrate to the sun or to the moon, but prostrate to Allah who created them." });

  e.humanConditionsAndSpiritualStates.push({ label: "Repelling evil with better granted only to the patient possessing a great portion of good", keys: ["41:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Guidance and cure for believers against deafness and blindness for those called from a distant place", keys: ["41:44"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Invitation to Allah joined to righteous action and declared submission as the best speech", keys: ["41:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Falsehood unable to approach the Book from before or behind", keys: ["41:42"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Righteousness benefiting the soul and evil harming it, with the Lord never unjust to His servants", keys: ["41:46"], evidenceClass: "EXPLICIT_TEXT" });

  const shifa = findWord(44, ["\u0634","\u0641","\u0627"]);
  if (shifa) e.terminology.push({ term: shifa, transliteration: "shifa", gloss: "cure/healing (editorial gloss)", keys: ["41:44"] });
}

// === POPULATE P4 (41:47-54) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Tireless supplication for good turned to hopelessness and despair when evil touches", keys: ["41:49"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Mercy after adversity misread as personal entitlement with denial of the Hour", keys: ["41:50"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Favour producing withdrawal and distancing while evil produces extensive supplication", keys: ["41:51"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Knowledge of the Hour, fruit-emergence and conception-birth reserved to Him alone", keys: ["41:47"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Signs in the horizons and within themselves until truth becomes clear, with His witness sufficing", keys: ["41:53"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Doubt about the meeting with their Lord answered by His encompassing all things", keys: ["41:54"], evidenceClass: "EXPLICIT_TEXT" });

  const afaq = findWord(53, ["\u0622","\u0641","\u0627","\u0642"]);
  if (afaq) e.terminology.push({ term: afaq, transliteration: "afaq", gloss: "horizons (editorial gloss)", keys: ["41:53"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `041-fussilat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 041-fussilat-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-041-p1,ext-041-p2,ext-041-p3,ext-041-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1457", label: "Detailed Arabic Quran addressed to a people who know", def: "In 41:3: A Book whose verses have been detailed, an Arabic Quran for a people who know.", key: "41:3", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Fussilat ayatuhu designation."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"related-not-identical",note:"Knowledge as reception condition."}] },
  { id: "cand-1458", label: "Claimed heart-coverings and partition answered by human likeness and revealed oneness", def: "In 41:5-6: They say our hearts are within coverings and in our ears is deafness and between us and you is a partition; say I am only a man like you to whom it has been revealed that your god is but one God, so take a straight course to Him and seek His forgiveness.", key: "41:5", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Self-declared perceptual closure."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Istighfar paired with istiqamah."}] },
  { id: "cand-1459", label: "Withholding zakah paired with Hereafter-disbelief as the associators' profile", def: "In 41:7: Those who do not give zakah, and in the Hereafter they are disbelievers.", key: "41:7", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Zakah withheld."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Kufr bil-akhirah linked."}] },
  { id: "cand-1460", label: "Staged cosmic creation with willing compliance of heaven and earth", def: "In 41:9-12: Do you disbelieve in He who created the earth in two days; He placed mountains and determined sustenance in four days; then directed Himself to the heaven while it was smoke and said come willingly or by compulsion, they said we come willingly; and completed them as seven heavens in two days inspiring each its command.", key: "41:9", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Staged creation with amr."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Cosmic architecture as ayah."}] },
  { id: "cand-1461", label: "Strength-boast answered by the Creator's greater strength", def: "In 41:15: As for Aad they were arrogant upon the earth without right and said who is greater than us in strength; did they not consider that Allah who created them was greater than them in strength?", key: "41:15", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Istikbar bi-ghayr al-haqq."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Creator stronger than created."}] },
  { id: "cand-1462", label: "Preferring blindness over guidance after guidance was given", def: "In 41:17: And as for Thamud We guided them but they preferred blindness over guidance, so the thunderbolt of humiliating punishment seized them for what they used to earn.", key: "41:17", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Istahabbu al-ama ala al-huda."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Sa'iqat al-adhab al-hun."}] },

  { id: "cand-1463", label: "Bodily faculties testifying against their owners at the Fire", def: "In 41:20-21: When they reach it their hearing and their eyes and their skins will testify against them; and they say to their skins why have you testified against us, they say we were made to speak by Allah who made everything speak.", key: "41:20", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Sam', absar and julud as witnesses."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Body as involuntary witness."}] },
  { id: "cand-1464", label: "Assumption of limited divine knowledge named as the cause of ruin", def: "In 41:22-23: You were not covering yourselves lest your hearing or sight or skins testify against you, but you assumed that Allah does not know much of what you do; and that was your assumption about your Lord, it has brought you to ruin.", key: "41:22", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Zann limiting ilm."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Faulty theology producing loss."}] },
  { id: "cand-1465", label: "Noisy disruption during recitation as an organised suppression tactic", def: "In 41:26: And those who disbelieve say do not listen to this Quran and speak noisily during it that perhaps you may overcome.", key: "41:26", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Laghw aimed at recitation."},{topicId:"justice-oppression",layer:"scholarly",relationship:"related-not-identical",note:"Suppression of hearing."}] },
  { id: "cand-1466", label: "Steadfastness after declaring Allah as Lord earning angelic descent and Paradise tidings", def: "In 41:30-32: Indeed those who have said our Lord is Allah and then remained on a right course, the angels descend upon them saying do not fear and do not grieve but receive good tidings of Paradise; we were your allies in worldly life and the Hereafter; as accommodation from a Forgiving and Merciful Lord.", key: "41:30", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Istiqamah following iqrar."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Tanazzul al-mala'ikah."}] },

  { id: "cand-1467", label: "Best speech defined as invitation to Allah with righteousness and declared submission", def: "In 41:33: And who is better in speech than one who invites to Allah and does righteousness and says indeed I am of the Muslims.", key: "41:33", overlap: [{topicId:"dialogue-principles",layer:"scholarly",relationship:"same-concept",note:"Ahsan qawl as da'wah."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Speech joined to action."}] },
  { id: "cand-1468", label: "Repelling evil with better transforming enmity into devoted friendship", def: "In 41:34-35: Not equal are the good deed and the bad; repel by that which is better and thereupon the one between whom and you is enmity becomes as a devoted friend; but none is granted it except those who are patient and one having a great portion of good.", key: "41:34", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Idfa' billati hiya ahsan."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr as prerequisite."}] },
  { id: "cand-1469", label: "Prostration reserved to the Creator rather than the celestial signs", def: "In 41:37: And of His signs are the night and day and the sun and moon; do not prostrate to the sun or to the moon but prostrate to Allah who created them.", key: "41:37", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Celestial worship forbidden."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Sujud to Creator alone."}] },
  { id: "cand-1470", label: "Earth revived by rain as proof of giving life to the dead", def: "In 41:39: And of His signs is that you see the earth stilled but when We send down rain upon it it quivers and grows; indeed He who gave it life is the Giver of Life to the dead.", key: "41:39", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Muhyi al-mawta argument."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ihtizzat and rabat as ayah."}] },
  { id: "cand-1471", label: "Mighty Book inaccessible to falsehood from before or behind", def: "In 41:41-42: Indeed it is a mighty Book; falsehood cannot approach it from before it or from behind it, a revelation from a Wise and Praiseworthy Lord.", key: "41:41", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"Batil barred from both directions."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Hakeem Hameed pairing."}] },
  { id: "cand-1472", label: "Quran as guidance and cure for believers against deafness and blindness for others", def: "In 41:44: Say it is for those who believe a guidance and cure; and those who do not believe, in their ears is deafness and it is upon them blindness, those are being called from a distant place.", key: "41:44", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Hudan wa-shifa dual function."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Reception conditioned on iman."}] },

  { id: "cand-1473", label: "Hour-knowledge and hidden natural processes reserved to Allah alone", def: "In 41:47: To Him alone is attributed knowledge of the Hour; and fruits emerge not from their coverings nor does a female conceive or give birth except with His knowledge.", key: "41:47", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ilm al-sa'ah and ghayb details."},{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Hidden processes as ghayb."}] },
  { id: "cand-1474", label: "Tireless supplication for good turned to despair when evil touches", def: "In 41:49: Man is not weary of supplication for good things, but if evil touches him he is hopeless and despairing.", key: "41:49", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Du'a bil-khayr pattern."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Ya'us qanut at adversity."}] },
  { id: "cand-1475", label: "Mercy after adversity misread as entitlement with denial of the Hour", def: "In 41:50: And if We let him taste mercy after adversity he will surely say this is due to me and I do not think the Hour will occur, and even if I am returned to my Lord indeed for me there will be the best.", key: "41:50", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Ni'mah claimed as li haqq."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Presumption of favourable outcome."}] },
  { id: "cand-1476", label: "Signs in the horizons and within themselves until truth becomes clear", def: "In 41:53: We will show them Our signs in the horizons and within themselves until it becomes clear to them that it is the truth; but is it not sufficient concerning your Lord that He is over all things a Witness?", key: "41:53", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Afaq and anfus dual domain."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Progressive clarification."}] }
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
    notes: "Wave 6 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 6).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(6, 10).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(10, 16).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(16, 20).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `041-fussilat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-065.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-065.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
