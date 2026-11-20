// MFD-11 Wave 2: Surah 18 (Al-Kahf) genuine re-extraction.
// Covers 18:1–110 in 4 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "018-0001-0110.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 18:${n} not found`);
  return verses[n];
}

function findWord(vid, chars) {
  const t = fv(vid);
  const words = t.split(/\s+/);
  for (const w of words) {
    let match = true;
    for (const ch of chars) { if (!w.includes(ch)) { match = false; break; } }
    if (match) return w;
  }
  return null;
}

console.log("Generating Surah 18 (Al-Kahf) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T13:05:00.000Z";

const PASSAGES = [
  { id: "ext-018-p1", from: 1, to: 31,
    label: "Book sent down straight no deviance warn severe punishment good tidings believers righteous deeds remain forever; warn those say Allah taken son no knowledge nor fathers grave word mouths speak lie; perhaps kill yourself grief not believe message sorrow; made earth adornment test best deed will make barren ground; companions cave inscription wonder among signs; youths retreated cave said Lord grant mercy prepare affair right guidance; sealed ears cave years number; raised them know which two parties better reckoning time stayed; relate story truth young men believed Lord increased guidance bound hearts stood up said Lord Lord heavens earth never invoke besides Him deity spoken enormity; people taken protectors besides Him servants dispute falsehood clear evidence; sleepers turn right left dog stretching paws threshold would flee filled terror; remained three hundred years add nine; Allah knows best time stayed unseen heavens earth belongs dominion no protector besides Him; recite revealed Book none alter words besides Him find refuge; keep yourself patient those call Lord morning evening seeking face turn away eyes desiring worldly life obey whose heart We made heedless remembrance follows desire affair ever neglectful; present example two men one given two gardens grapevines surrounded palms placed crops between; produced fruit failed nothing rivers flow midst; said companion dialogue I greater wealth stronger following entered garden wronged self said think not perish ever; think not Hour established even returned Lord surely find better than this",
    mainLabel: "Quran affirmed as straight Book without deviance warning of punishment and giving glad tidings; divine claim-of-son refutation based on absence of knowledge; earthly adornment as test mechanism with eventual barrenness; Cave narrative: believing youths seeking divine mercy granted supernatural sleep spanning centuries as sign of divine power over time; physical preservation details including turning and dog posture inspiring awe; precise duration (309 years) with divine knowledge supremacy over unseen; recitation command with no-alteration guarantee; patience with fellow-worshippers commanded against worldly attraction; two-garden parable: wealth-owner's arrogance entering garden claiming permanence challenged by companion's tawheed reminder" },
  { id: "ext-018-p2", from: 32, to: 59,
    label: "Present example two men one given two gardens grapevines surrounded palms placed crops between produced fruit failed nothing rivers flow midst; said companion dialogue I greater wealth stronger following entered garden wronged self said think not perish ever; think not Hour established even returned Lord surely find better; companion said disbelieve He who created you dust then sperm-drop fashioned man; but as for me He is Allah my Lord associate none with Lord; entered garden why not say what Allah willed no power except Allah see less wealth children; perhaps Lord give better garden send thunderbolt upon yours become barren ground; water sink deep never reach; fruits encompassed destroyed twisting trellises spent regretting overturned said wish associated none with Lord; no group help besides Allah nor could defend himself; protection belongs only Allah Truth best reward best outcome; present example worldly life rain sent sky plants earth mingle dry scattered wind Allah over everything capable; wealth children adornment worldly life enduring good deeds better Lord reward better hope; Day remove mountains see earth prominent gather leave none; presented Lord rows come Us first created barefoot naked uncircumcised nay promised appointment; record placed open see criminals fearful within say Oh woe us what book leaves nothing small great except enumerated found present what did Lord wrong anyone; Iblis refused prostrate Adam was jinn departed command Lord take him descendants allies instead Me evil exchange; not witness creation heavens earth nor creation selves nor take misleaders assistants; Day say call partners claimed invoke not respond set barrier between; criminals see Fire certain fall therein find way elsewhere; diversified Quran every kind example man most contentious; nothing prevented people believing guidance came asking forgiveness except pattern former peoples or punishment coming face",
    mainLabel: "Two-garden parable continuation: arrogant owner's destruction through divine thunderbolt producing barren ground and sunk water; regretful recognition of shirk futility when no helper remains; divine protection as exclusive truth-based prerogative; worldly life metaphor as rain-produced vegetation drying and scattering; enduring good deeds (al-baqiyat al-salihat) superior to wealth-children adornment; eschatological scene: mountain removal earth prominence total gathering bare presentation; individual record causing criminal dread with complete enumeration; Iblis identified as jinn departing divine command with descendants as false allies replacing Allah; rejected shirk-makers facing fire certainty with no escape; Quran diversification of examples meeting human contentiousness; belief obstruction attributed to historical precedent fear rather than evidence deficit" },
  { id: "ext-018-p3", from: 60, to: 83,
    label: "Musa said young man journey until reach junction two seas continue years; reached junction forgot fish took way sea tunnel; passed beyond said bring meal suffered fatigue journey; said remember rested rock forgot fish Satan made forget; said that sought turned back retracing footsteps; found servant servants given mercy Us taught knowledge Us; Musa said follow learn right judgment taught; said indeed cannot endure patience how endure what encompasses comprehension; said find willing Allah will patient disobey command; said accompany ask anything explain interpretation; traveled embarked boat scuttled said scuttle drown crew committed grave matter; said not said cannot endure patience; said seize not forgetfulness difficult matter; landed boy killed said kill innocent soul retaliation slain committed evil; said not said cannot endure patience third time part ways reach explanation; wall about collapse town asked food refused hospitality found wall collapsing repaired said wished took payment; said separation between interpret unable endure; boat belonged poor working sea wanted damage behind king seizing every boat force; boy parents believers feared oppress rebellion disbelief intended Lord replace better purity nearer mercy; wall belonged two orphan boys town beneath treasure father righteous Lord intended reach maturity extract treasure mercy Lord not done own command interpret unable endure",
    mainLabel: "Musa-Khidr journey initiation: forgotten fish as divinely orchestrated sign marking meeting point; Khidr as recipient of special divine mercy and knowledge (ilm ladunni); Musa's learning request met with patience condition acknowledging comprehension limits; three enigmatic acts testing Musa's patience: boat scuttling saving poor fishermen from royal seizure; boy killing preventing future parental oppression-disbelief enabling righteous replacement; wall repair preserving orphan treasure until maturity as gratuitous mercy; each act accompanied by ta'wil (interpretation) revealing hidden wisdom beyond apparent harm; pedagogical structure demonstrating limits of exoteric knowledge before esoteric reality" },
  { id: "ext-018-p4", from: 84, to: 110,
    label: "established him earth given means everything; followed cause until reached setting sun found it setting spring dark mud found people near it said O Dhul-Qarnayn either punish or adopt goodness among them; said wrongdoer punish then return Lord punish severely; believed did righteousness reward best speak ease command; followed cause until reached rising sun found it rising people whom made no shelter against it; thus encompassed knowledge what had fully informed; followed cause until reached two barriers found people scarcely understood speech; said O Dhul-Qarnayn Yajuj Majuj corrupting earth appoint barrier us tribute pay build barrier strength us; said power Lord enabled pile iron blocks level mountain tops blow bellows fire pour molten copper; unable scale pierce said mercy Lord when promise Lord comes make level dust promise Lord ever true; left them Day surge like waves trumpet blown gathered together; Hell presented disbelievers plain display; servants whose eyes covered remembrance able hear; disbelievers think take servants allies instead Me prepared Hell disbelievers lodging; say inform greatest losers deeds; effort lost worldly life think doing well work; disbelieved verses Lord meeting Him deeds worthless weigh Day Resurrection; recompense Hell denied took signs messengers ridicule; believed righteous deeds Gardens Paradise lodging abide eternally desire transfer; say sea ink words Lord sea exhausted words Lord exhausted even brought like addition; say I only man like you revealed your god one God whoever hopes meeting Lord do righteous worship associate none with Lord",
    mainLabel: "Dhul-Qarnayn empowered with comprehensive means traversing east-west; western expedition encountering people at murky spring exercising just governance option; eastern expedition finding unprotected people demonstrating solar geography knowledge; northern expedition encountering linguistically isolated community requesting barrier against Yajuj-Majuj corruption; barrier construction using iron-copper metallurgy as engineering feat enabled by divine empowerment; barrier impermanence linked to eschatological promise fulfillment; Yajuj-Majuj release as end-times sign with wave-like surging; Hell displayed plainly for disbelievers with veiled-servant imagery; greatest losers defined as those whose worldly effort appeared productive but lacked faith foundation; deeds rendered void through disbelief in divine meeting; sea-ink metaphor establishing infinite divine knowledge finitude; closing prophetic identity affirmation: human receiving revelation commanding tawheed and righteous action without association" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`18:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`18:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 18, surahName: "Al-Kahf",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 2 genuine re-extraction. P1=Book-Cave-two-gardens(1-31), P2=garden-destruction-eschatology-Iblis(32-59), P3=Musa-Khidr-journey(60-83), P4=Dhul-Qarnayn-Yajuj-Majuj-closing(84-110).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE ANALYTICAL ARRAYS ===

// P1 (18:1-31)
{
  const e = extractions[0];
  const allah = findWord(1, ["\u0627","\u0644","\u0644","\u0647"]);
  if (allah) e.divineNamesAndAttributes.push({ term: allah, transliteration: "Allah", gloss: "God (editorial gloss)", keys: ["18:1"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["18:27"], excerpt: fv(27), description: "Recite what has been revealed to you of the Book; none can alter His words." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["18:28"], excerpt: fv(28), description: "Keep yourself patient with those who call upon their Lord morning and evening seeking His countenance." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["18:28"], excerpt: fv(28), description: "Do not turn away your eyes from them desiring worldly life adornment." });

  e.propheticNarratives.push({ label: "Cave companions: believing youths retreating to cave seeking divine mercy granted supernatural sleep spanning 309 years as sign", keys: ["18:9","18:10","18:11","18:12","18:13","18:14","18:15","18:16","18:17","18:18","18:19","18:20","18:21","18:22","18:23","18:24","18:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Earthly adornment as test mechanism determining best in deed before eventual barrenness", keys: ["18:7","18:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Claim of divine sonship refuted as grave word from mouths without knowledge basis", keys: ["18:4","18:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Patience-fellowship obligation: keeping company with sincere worshippers over worldly attraction", keys: ["18:28"], evidenceClass: "EXPLICIT_TEXT" });

  const kahf = findWord(9, ["\u0643","\u0647","\u0641"]);
  if (kahf) e.terminology.push({ term: kahf, transliteration: "kahf", gloss: "cave (editorial gloss)", keys: ["18:9"] });
}

// P2 (18:32-59)
{
  const e = extractions[1];
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["18:39"], excerpt: fv(39), description: "Companion's taught response: Ma sha' Allahu la quwwata illa billah — What Allah willed there is no power except in Allah." });

  e.propheticNarratives.push({ label: "Iblis refusal to prostrate before Adam identified as jinn departing divine command taking descendants as false allies", keys: ["18:50"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Wealth-children as worldly adornment contrasted with enduring good deeds (baqiyat salihat) as superior investment", keys: ["18:46"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Agricultural destruction as divine consequence: thunderbolt reducing garden to barren ground with sunk water", keys: ["18:40","18:41"], evidenceClass: "EXPLICIT_TEXT" });

  const baqiyat = findWord(46, ["\u0628","\u0627","\u0642","\u064a","\u0627","\u062a"]);
  if (baqiyat) e.terminology.push({ term: baqiyat, transliteration: "baqiyat", gloss: "enduring/lasting (editorial gloss)", keys: ["18:46"] });
}

// P3 (18:60-83)
{
  const e = extractions[2];
  const rahmah = findWord(65, ["\u0631","\u062d","\u0645","\u0629"]);
  if (rahmah) e.divineNamesAndAttributes.push({ term: rahmah, transliteration: "Rahmah", gloss: "Mercy (editorial gloss)", keys: ["18:65"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["18:66"], excerpt: fv(66), description: "Musa said: May I follow you that you teach me from what you have been taught of right judgment?" });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["18:70"], excerpt: fv(70), description: "Khidr said: If you follow me then ask me not about anything until I explain its interpretation." });

  e.propheticNarratives.push({ label: "Musa-Khidr journey: three enigmatic acts (boat scuttling, boy killing, wall repair) each with hidden ta'wil revealing divine wisdom beyond apparent harm", keys: ["18:60","18:61","18:62","18:63","18:64","18:65","18:66","18:67","18:68","18:69","18:70","18:71","18:72","18:73","18:74","18:75","18:76","18:77","18:78","18:79","18:80","18:81","18:82"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Limits of exoteric knowledge confronted by esoteric reality: Musa's impatience demonstrating comprehension boundary", keys: ["18:68","18:72","18:75"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Forgotten fish as divinely orchestrated sign marking the appointed meeting point with Khidr", keys: ["18:63"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Teacher-student dynamic conditioned on patience and deferred questioning enabling transmission of hidden knowledge", keys: ["18:66","18:70"], evidenceClass: "EXPLICIT_TEXT" });

  const tawil = findWord(78, ["\u062a","\u0623","\u0648","\u064a","\u0644"]);
  if (tawil) e.terminology.push({ term: tawil, transliteration: "ta'wil", gloss: "interpretation/hidden meaning (editorial gloss)", keys: ["18:78"] });
}

// P4 (18:84-110)
{
  const e = extractions[3];
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["18:110"], excerpt: fv(110), description: "Say: I am only a man like you revealed that your god is one God; whoever hopes for meeting with his Lord do righteous worship and associate none." });

  e.propheticNarratives.push({ label: "Dhul-Qarnayn expeditions: west (murky spring justice), east (unprotected people), north (Yajuj-Majuj barrier construction using iron-copper metallurgy)", keys: ["18:84","18:85","18:86","18:87","18:88","18:89","18:90","18:91","18:92","18:93","18:94","18:95","18:96","18:97","18:98"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Greatest loss: effort expended in worldly life while thinking oneself productive but lacking faith foundation", keys: ["18:103","18:104"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Sea-ink metaphor establishing infinite divine knowledge versus finite creation capacity", keys: ["18:109"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Yajuj-Majuj release as eschatological sign with wave-like surging preceding final gathering", keys: ["18:99"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Barrier engineering as communal infrastructure project: tributary labor combined with divine empowerment enabling metallurgical feat", keys: ["18:95","18:96"], evidenceClass: "EXPLICIT_TEXT" });

  const qarnayn = findWord(86, ["\u0642","\u0631","\u0646","\u064a","\u0646"]);
  if (qarnayn) e.terminology.push({ term: qarnayn, transliteration: "Dhul-Qarnayn", gloss: "possessor of two horns/epochs (editorial gloss)", keys: ["18:86"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `018-al-kahf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 018-al-kahf-p${num}.json`);
}

// === CANDIDATES (cand-0717..cand-0756, 40 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-018-p1,ext-018-p2,ext-018-p3,ext-018-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0717..0726)
  { id: "cand-0717", label: "Quran as straight Book without deviance serving dual warning-tidings function", def: "In 18:1-2: Praise to Allah who sent down upon His Servant the Book and made it straight to warn of severe punishment and give good tidings to believers.", key: "18:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"La 'iwaja fihi as structural perfection."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Dual outcome framework."}] },
  { id: "cand-0718", label: "Divine sonship claim refuted through absence of knowledge basis", def: "In 18:4-5: Warn those who say Allah has taken a son; they have no knowledge of it nor their fathers; grave is the word from their mouths.", key: "18:4", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Walad negation."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Absence of ilm as refutation."}] },
  { id: "cand-0719", label: "Earthly adornment as test mechanism with eventual barrenness", def: "In 18:7-8: We made what is on earth adornment for it that We may test which is best in deed; We will make it barren ground.", key: "18:7", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Zinah as ibtila'."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Adornment preceding desolation."}] },
  { id: "cand-0720", label: "Cave companions as believing youths granted supernatural sleep spanning centuries", def: "In 18:9-26: Youths retreated to cave seeking mercy; sealed ears for years numbered; raised to determine which party better at reckoning.", key: "18:9", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ashab al-kahf as ayat."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Youthful faith rewarded."}] },
  { id: "cand-0721", label: "Precise duration (309 years) with divine knowledge supremacy over unseen", def: "In 18:25-26: Remained 300 years adding nine; say Allah knows best how long they remained; to Him belongs unseen of heavens and earth.", key: "18:25", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ghayb as divine monopoly."},{topicId:"unseen-belief",layer:"scholarly",relationship:"related-not-identical",note:"Temporal ghayb."}] },
  { id: "cand-0722", label: "Recitation command with no-alteration guarantee establishing textual integrity", def: "In 18:27: Recite what has been revealed of the Book; none can alter His words; find besides Him no refuge.", key: "18:27", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"Tabdil impossibility."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Recitation as preservation act."}] },
  { id: "cand-0723", label: "Patience-fellowship obligation prioritizing sincere worshippers over worldly attraction", def: "In 18:28: Keep yourself patient with those who call their Lord morning evening seeking His face; do not turn eyes desiring worldly adornment.", key: "18:28", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr nafsaka as self-discipline."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Companionship ethics."}] },
  { id: "cand-0724", label: "Two-garden parable: wealth-owner arrogance entering garden claiming permanence", def: "In 18:32-35: Man given two gardens grapevines palms crops; entered wronging self saying I think not this perishes ever.", key: "18:32", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Material security breeding arrogance."},{topicId:"wealth-ownership",layer:"scholarly",relationship:"related-not-identical",note:"Property as test."}] },
  { id: "cand-0725", label: "Companion's tawheed correction challenging materialist assumptions", def: "In 18:37-38: Companion said disbelieve He who created you from dust then sperm-drop fashioned you man; but as for me He is Allah my Lord.", key: "18:37", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Creation-origin argument."},{topicId:"human-creation",layer:"scholarly",relationship:"related-not-identical",note:"Nutfah-to-insan progression."}] },
  { id: "cand-0726", label: "Ma sha' Allah la quwwata illa billah as taught protective formula", def: "In 18:39: Companion said if you had said entering garden: Ma sha' Allahu la quwwata illa billah.", key: "18:39", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Taught dhikr formula."},{topicId:"gratitude",layer:"curated",relationship:"related-not-identical",note:"Attribution preventing arrogance."}] },

  // P2 (cand-0727..0736)
  { id: "cand-0727", label: "Agricultural destruction as divine consequence producing barren ground", def: "In 18:40-41: Perhaps Lord sends thunderbolt making barren ground; water sinks deep never reached.", key: "18:40", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Material reversal as punishment."},{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Loss as corrective."}] },
  { id: "cand-0728", label: "Regretful recognition of shirk futility when no helper remains", def: "In 18:42-43: Fruits encompassed destroyed wringing hands spent said wish associated none with Lord; no group help besides Allah.", key: "18:42", overlap: [{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Belated recognition."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Shirk exposed through helplessness."}] },
  { id: "cand-0729", label: "Worldly life metaphor as rain-produced vegetation drying and scattering", def: "In 18:45: Present example worldly life like rain sent sky plants mingle then dry scattered wind.", key: "18:45", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Botanical cycle as dunya metaphor."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Growth preceding decay."}] },
  { id: "cand-0730", label: "Enduring good deeds superior to wealth-children as lasting investment", def: "In 18:46: Wealth children adornment worldly life; enduring good deeds (baqiyat salihat) better with Lord for reward and hope.", key: "18:46", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Baqiyat as eternal capital."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Thawab-abqa pairing."}] },
  { id: "cand-0731", label: "Eschatological scene: mountain removal earth prominence total bare gathering", def: "In 18:47-48: Day remove mountains see earth prominent gather leave none; presented Lord rows came first time barefoot naked.", key: "18:47", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Cosmic transformation."},{topicId:"resurrection-process",layer:"scholarly",relationship:"related-not-identical",note:"Total exposure."}] },
  { id: "cand-0732", label: "Individual record causing criminal dread with complete enumeration", def: "In 18:49: Record placed open criminals fearful say woe what book leaves nothing small great unenumerated.", key: "18:49", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Kitab as exhaustive mirror."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Complete reckoning."}] },
  { id: "cand-0733", label: "Iblis identified as jinn departing divine command with descendants as false allies", def: "In 18:50: When We said angels prostrate to Adam they prostrated except Iblis was of jinn departed command; take him descendants allies instead Me?", key: "18:50", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Jinn origin explicit."},{topicId:"jinn-creation",layer:"scholarly",relationship:"same-concept",note:"Non-angelic nature."}] },
  { id: "cand-0734", label: "Quran diversification of examples meeting human contentiousness", def: "In 18:54: Diversified in Quran every kind example; man most contentious of things.", key: "18:54", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Tasrif as pedagogical method."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Contentiousness despite clarity."}] },
  { id: "cand-0735", label: "Belief obstruction attributed to historical precedent fear rather than evidence deficit", def: "In 18:55: Nothing prevented people believing guidance came asking forgiveness except pattern former peoples or punishment expectation.", key: "18:55", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"related-not-identical",note:"Psychological barriers to iman."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Historical trauma blocking reception."}] },
  { id: "cand-0736", label: "Hell displayed plainly for disbelievers with veiled-servant imagery", def: "In 18:100-101: Presented Hell disbelievers plain display; servants whose eyes covered from My remembrance unable to hear.", key: "18:100", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Ard as visual presentation."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Veiled perception."}] },

  // P3 (cand-0737..0746)
  { id: "cand-0737", label: "Musa-Khidr journey initiation through forgotten fish as divinely orchestrated sign", def: "In 18:60-64: Musa told youth journey until junction; forgot fish at rock Satan caused forget; turned back retracing found servant.", key: "18:60", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Fish as meeting marker."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Apparent forgetfulness as divine arrangement."}] },
  { id: "cand-0738", label: "Khidr as recipient of special divine mercy and knowledge (ilm ladunni)", def: "In 18:65: Found servant from Our servants given mercy from Us and taught knowledge from Us.", key: "18:65", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Rahmah min indina."},{topicId:"knowledge-seeking",layer:"scholarly",relationship:"related-not-identical",note:"Ladunni as direct divine teaching."}] },
  { id: "cand-0739", label: "Patience condition acknowledging comprehension limits in teacher-student dynamic", def: "In 18:67-70: Khidr said cannot endure patience how endure what encompasses not comprehension; if follow ask nothing until explained.", key: "18:67", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr as epistemological prerequisite."},{topicId:"knowledge-seeking",layer:"scholarly",relationship:"related-not-identical",note:"Deferred understanding."}] },
  { id: "cand-0740", label: "Boat scuttling as protective measure saving poor fishermen from royal seizure", def: "In 18:71,79: Scuttled boat; belonged to poor working sea wanted damage because king seized every boat by force.", key: "18:71", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"related-not-identical",note:"Apparent harm as actual protection."},{topicId:"divine-wisdom",layer:"scholarly",relationship:"same-concept",note:"Hidden benefit beyond appearance."}] },
  { id: "cand-0741", label: "Boy killing preventing future parental oppression-disbelief enabling righteous replacement", def: "In 18:74,80-81: Killed boy; parents believers feared oppression disbelief; Lord intended replace better purity nearer mercy.", key: "18:74", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"same-concept",note:"Apparent evil as hidden mercy."},{topicId:"parents-and-family",layer:"curated",relationship:"related-not-identical",note:"Parental faith protected."}] },
  { id: "cand-0742", label: "Wall repair preserving orphan treasure until maturity as gratuitous mercy", def: "In 18:77,82: Wall collapsing repaired without payment; belonged to two orphan boys beneath treasure father righteous Lord intended maturity extraction.", key: "18:77", overlap: [{topicId:"orphan-care",layer:"scholarly",relationship:"same-concept",note:"Posthumous parental barakah."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Gratuitous khidmah."}] },
  { id: "cand-0743", label: "Ta'wil as hidden interpretation revealing divine wisdom beyond apparent harm", def: "In 18:78,82: This interpretation (ta'wil) of what you could not endure; each act explained after testing patience.", key: "18:78", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"same-concept",note:"Ta'wil as hermeneutical key."},{topicId:"knowledge-seeking",layer:"scholarly",relationship:"related-not-identical",note:"Esoteric vs exoteric."}] },
  { id: "cand-0744", label: "Limits of exoteric knowledge confronted by esoteric reality", def: "In 18:68,72,75: Musa repeatedly failed patience test demonstrating boundary between observable and hidden dimensions.", key: "18:68", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Epistemological humility."},{topicId:"intellect-importance",layer:"scholarly",relationship:"related-not-identical",note:"Reason bounded by revelation."}] },
  { id: "cand-0745", label: "Forgotten fish as divinely orchestrated sign marking appointed meeting point", def: "In 18:63: Youth said remember rested rock forgot fish Satan made forget; took way into sea tunnel.", key: "18:63", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Apparent error as divine signal."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"related-not-identical",note:"Satanic interference serving divine purpose."}] },
  { id: "cand-0746", label: "Teacher-student dynamic conditioned on patience and deferred questioning", def: "In 18:66,70: Musa requested learning; Khidr set condition of silence until voluntary explanation enabled transmission.", key: "18:66", overlap: [{topicId:"knowledge-seeking",layer:"scholarly",relationship:"same-concept",note:"Adab al-ta'allum."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Silence as learning discipline."}] },

  // P4 (cand-0747..0756)
  { id: "cand-0747", label: "Dhul-Qarnayn empowered with comprehensive means traversing east-west", def: "In 18:84-85: Established him on earth given means of everything; followed a cause.", key: "18:84", overlap: [{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"Tamkin as comprehensive empowerment."},{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"Means as divine grant."}] },
  { id: "cand-0748", label: "Western expedition exercising just governance option at murky spring", def: "In 18:86-88: Reached setting sun found spring dark mud people nearby; said punish or adopt goodness; wrongdoer punished believer rewarded.", key: "18:86", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Governance discretion."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"related-not-identical",note:"Just ruler model."}] },
  { id: "cand-0749", label: "Yajuj-Majuj barrier construction using iron-copper metallurgy as engineering feat", def: "In 18:94-97: People requested barrier against Yajuj-Majuj corruption; built using iron blocks fire bellows molten copper; unable scale or pierce.", key: "18:94", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Engineering as ayat."},{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"Human effort enabled by divine means."}] },
  { id: "cand-0750", label: "Barrier impermanence linked to eschatological promise fulfillment", def: "In 18:98: Said this mercy from Lord; when promise Lord comes make level dust; promise Lord ever true.", key: "18:98", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Wa'd as temporal boundary."},{topicId:"unseen-belief",layer:"scholarly",relationship:"related-not-identical",note:"Future certainty."}] },
  { id: "cand-0751", label: "Yajuj-Majuj release as end-times sign with wave-like surging", def: "In 18:99: Left them Day surge like waves one another; trumpet blown gathered together.", key: "18:99", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Mawj as chaos imagery."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Pre-gathering chaos."}] },
  { id: "cand-0752", label: "Greatest losers defined as those whose worldly effort appeared productive but lacked faith", def: "In 18:103-104: Say inform greatest losers deeds; effort lost in worldly life while thinking doing well in work.", key: "18:103", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Misdirected productivity."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Dunya-success as illusion."}] },
  { id: "cand-0753", label: "Deeds rendered void through disbelief in divine meeting", def: "In 18:105: Disbelieved verses Lord and meeting Him; deeds became worthless; weigh nothing Day Resurrection.", key: "18:105", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Kufr nullifying amal."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Weightlessness as verdict."}] },
  { id: "cand-0754", label: "Sea-ink metaphor establishing infinite divine knowledge versus finite creation", def: "In 18:109: Say if sea were ink for words of Lord sea exhausted before words exhausted even brought like addition.", key: "18:109", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Kalimat as inexhaustible."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Ocean as finite comparator."}] },
  { id: "cand-0755", label: "Closing prophetic identity: human receiving revelation commanding tawheed without association", def: "In 18:110: Say I only man like you revealed your god one God; whoever hopes meeting Lord do righteous worship associate none.", key: "18:110", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Bashar mithlukum with wahy."},{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Ilah wahid as closing affirmation."}] },
  { id: "cand-0756", label: "Gardens of Paradise as eternal lodging without desire for transfer", def: "In 18:107-108: Believed righteous deeds have Gardens Paradise lodging; abide eternally not desiring transfer.", key: "18:107", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Firdaws as final abode."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Righteousness rewarded permanently."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 2 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(30, 40).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `018-al-kahf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-042.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-042.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
