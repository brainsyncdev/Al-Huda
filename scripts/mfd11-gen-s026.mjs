// MFD-11 Wave 4: Surah 26 (Ash-Shu'ara) genuine re-extraction.
// Covers 26:1–227 in 5 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "026-0001-0227.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 26:${n} not found`);
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

console.log("Generating Surah 26 (Ash-Shu'ara) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T13:50:00.000Z";

// P1: 26:1–51 — Ta-Sin-Mim; Quran as clear Book; Musa-Firawn confrontation
// P2: 26:52–104 — Musa sea-crossing; Firawn drowning; Ibrahim idol rejection
// P3: 26:105–159 — Nuh, Hud, Salih narratives with refrain
// P4: 26:160–191 — Lut, Shu'ayb narratives; poet defense intro
// P5: 26:192–227 — Quran revelation mode; poet exception; closing warning

const PASSAGES = [
  { id: "ext-026-p1", from: 1, to: 51,
    label: "Ta-Sin-Mim; verses clear Book; perhaps destroy self grief not believe; willed sent down sky angel messenger warn mother towns Arabic tongue; indeed it is in scriptures ancients; sign learned scholars recite; disbelieve arrogant say hearts locked; revealed Lord heavens earth Forgiving Merciful; story Musa reached; called Lord valley Tuwa sacred; go Firawn transgressed; purify bring signs Lord worlds; threw staff serpent white hand spectators; said sorcery two wanted drive out land superior magic; summoned every learned magician; came Firawn said wage among those nearest; said yes surely among those brought near; threw ropes staffs imagined moving magic felt fear within; inspired throw staff swallow crafted; magicians fell prostration believed Lord worlds Lord Musa Harun; said believe before permission indeed chief taught magic cut hands feet alternate sides crucify; said no harm return Lord forgive first sins compelled magic; Lord better abiding; comes criminal neither die live; comes believer done righteous high ranks Gardens Eden beneath rivers abide eternally reward purified",
    mainLabel: "Disjointed letters; Quran as mubin Book causing prophetic grief over disbelief; divine willingness to send angelic warner deferred; scripture continuity with ancients; Musa fire-valley calling; Firawn mission with purification-signs command; staff-serpent and white-hand miracles; magician contest with imaginative deception; Musa's internal fear divinely reassured; staff swallowing exposing craft; mass prostration-conversion of magicians; Firawn threats of mutilation-crucifixion rejected; eschatological reward contrast: criminal eternal loss vs believer eternal gardens" },
  { id: "ext-026-p2", from: 52, to: 104,
    label: "inspired servants travel night follow behind none look back proceed commanded; informed morning drowned left behind; inherited gardens springs treasures noble station; thus expelled Firawn hosts; indeed sign most not believe; Lord Mighty Merciful; Ibrahim said father people worship; said idols devoted; said hear call benefit harm; said found fathers worshipping; said you fathers manifest error; said come truth or jest; said Lord heavens earth created witness; swear Allah plan against idols turned away; made fragments except large one might return question; said who done gods wrongdoers; heard young man mention called Ibrahim; brought sight people bear witness; asked did you do this gods; said rather largest did ask speaks; admitted shame reversed blame; said worship besides Allah benefit harm; burned said fire cool safe Ibrahim; wanted harm made greatest losers; saved delivered blessed land Isaac Yaqub additional gift; indeed sign most not believe; Lord Mighty Merciful",
    mainLabel: "Night exodus command with no-looking-back instruction; morning drowning announcement; Firawn inheritance transfer to oppressed; sign-refrain establishing pattern; Ibrahim questioning paternal idolatry through rational interrogation; ancestral tradition exposed as manifest error; idol-destruction rhetorical trap using largest statue; communal shame and blame reversal; fire miracle reversing oppressor intent; deliverance to blessed land with Ishaq-Yaqub grant; repeated sign-refrain confirming prophetic consistency" },
  { id: "ext-026-p3", from: 105, to: 159,
    label: "people Nuh denied messengers; brother Nuh said fear Allah trustworthy messenger; ask wage reward only Lord worlds; fear Allah obey; said shall we believe you followed lowest; said knowledge deeds Lord; expel town indeed believers; threatened drown; said Lord help denied; saved ark full pairs; drowned remaining; indeed sign most not believe; Lord Mighty Merciful; Aad denied messengers; brother Hud said fear Allah trustworthy messenger; ask wage reward only Lord worlds; build every elevation monument sporting take structures hoping remain forever; seize seizing mighty powerful; fear Allah obey; denied destroyed punishment Day overshadowing; indeed sign most not believe; Lord Mighty Merciful; Thamud denied messengers; brother Salih said fear Allah trustworthy messenger; ask wage reward only Lord worlds; left secure gardens springs crops palm trees delicate; carve mountains houses rejoicing; fear Allah obey; said O Salih hope among us before this; forbid worship what fathers worship doubt suspicious; said she-camel Allah sign test drink known day alternate; harmed her regretted; seized earthquake became motionless homes; indeed sign most not believe; Lord Mighty Merciful",
    mainLabel: "Nuh narrative: trustworthiness claim; wage-free mission; class-based rejection (lowest followers); expulsion threat preceding flood salvation; ark pairs preservation; sign-refrain. Hud-Aad narrative: monument-building as arrogance marker; mighty seizure destroying sportive architecture; shadow-punishment; sign-refrain. Salih-Thamud narrative: secure habitation taken for granted; mountain-carved dwellings as false permanence; she-camel as divine test with alternating drinking schedule; hamstringing triggering earthquake destruction; sign-refrain. Triple narrative cycle establishing identical prophetic pattern across communities" },
  { id: "ext-026-p4", from: 160, to: 191,
    label: "people Lut denied messengers; brother Lut said fear Allah trustworthy messenger; ask wage reward only Lord worlds; save family except old woman destined remain behind; destroyed others rained rain evil warned; indeed sign most not believe; Lord Mighty Merciful; companions thicket denied messengers; Shu'ayb said fear Allah trustworthy messenger; ask wage reward only Lord worlds; give full measure weigh just scales defraud people things righteously spread corruption earth; fear created you former generations; said sorcerer following lowest; drop piece sky see truthful; said Lord knows best what doing; denied seized punishment Day overshadowing; indeed sign most not believe; Lord Mighty Merciful; indeed Quran revelation Lord worlds; descended Trustworthy Spirit upon heart warning Arabic tongue; indeed it is in scriptures ancients; sign scholars Israelites recite; even sent down non-Arabs recited would not believe; thus inserted denial hearts criminals; not believe until see painful punishment; comes suddenly perceive not; say when; nay soon come know; fear Lord relatives close; warn nearest kindred; lower wing mercy believers follow; say no wage ask except whoever wills path Lord; indeed Lord Mighty Merciful",
    mainLabel: "Lut narrative: family salvation with wife exception; evil-rain destruction; sign-refrain. Shu'ayb-thicket narrative: commercial justice commands (measure-weight-no-defraud); anti-corruption linked to creation-origin remembrance; sorcery accusation; sky-drop challenge; shadow-punishment; sign-refrain. Five-narrative cycle complete. Transition to Quran revelation: Tanzil from Rabb al-alamin via Ruh al-Amin upon prophet's heart as Arabic warning; prior scripture confirmation; Israelite scholar recognition as cross-communal validation; non-Arab recitation hypothetical proving universal accessibility; denial insertion as divine consequence; sudden punishment awareness; familial warning command with mercy-wing posture; wage-free mission reiterated" },
  { id: "ext-026-p5", from: 192, to: 227,
    label: "indeed Quran revelation Lord worlds; descended Trustworthy Spirit upon heart warning Arabic tongue; indeed it is in scriptures ancients; sign scholars Israelites recite; even sent down non-Arabs recited would not believe; thus inserted denial hearts criminals; not believe until see painful punishment; comes suddenly perceive not; say when; nay soon come know; fear Lord relatives close; warn nearest kindred; lower wing mercy believers follow; say no wage ask except whoever wills path Lord; rely Mighty Merciful sees stand prostrate among worshippers; indeed He Hearing Knowing; inform descended devils; descend upon every sinful liar; eavesdroppers most listeners; poets followed astray wander every valley say not do; except believed righteous remembered Allah much avenged after wronged; wrongdoers know return",
    mainLabel: "Quran revelation reaffirmed: Tanzil-Ruh-Amin-heart-Arabic sequence; ancient scripture confirmation; Israelite scholar cross-validation; universal accessibility proof; denial as divine sealing; sudden punishment certainty; kinship-warning prioritized; mercy-wing for believing followers; tawakkul upon Aziz Rahim observing sujud; shayatin descent upon sinful liars as eavesdropping mechanism; poet exception clause: only believing-righteous-dhikr-practicing poets exempted from misguidance charge; post-wronging vengeance acknowledged; wrongdoer return as final warning" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`26:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`26:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 26, surahName: "Ash-Shu'ara",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 4 genuine re-extraction. P1=Musa-Firawn-magicians(1-51), P2=sea-crossing-Ibrahim-idols(52-104), P3=Nuh-Hud-Salih(105-159), P4=Lut-Shuayb-Quran-transition(160-191), P5=revelation-poets-closing(192-227). Refrain 'inna fi dhalika la-ayatan wa-ma kana aktharuhum mu'minin / wa-inna rabbaka la-huwa al-azizu al-rahim' anchors each narrative cycle.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (26:1-51) ===
{
  const e = extractions[0];
  const ghafur = findWord(9, ["\u063a","\u0641","\u0648","\u0631"]);
  const rahman = findWord(9, ["\u0631","\u062d","\u0645","\u0646"]);
  if (ghafur) e.divineNamesAndAttributes.push({ term: ghafur, transliteration: "Ghafur", gloss: "Forgiving (editorial gloss)", keys: ["26:9"] });
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Merciful (editorial gloss)", keys: ["26:9"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["26:18"], excerpt: fv(18), description: "Go to Firawn — he has transgressed." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["26:19"], excerpt: fv(19), description: "Purify yourself and bring signs of your Lord to Firawn." });

  e.propheticNarratives.push({ label: "Musa-Firawn confrontation: valley Tuwa calling; staff-serpent and white-hand signs; magician contest; mass conversion-prostration; Firawn mutilation threats rejected", keys: ["26:10","26:11","26:12","26:13","26:14","26:15","26:16","26:17","26:18","26:19","26:20","26:21","26:22","26:23","26:24","26:25","26:26","26:27","26:28","26:29","26:30","26:31","26:32","26:33","26:34","26:35","26:36","26:37","26:38","26:39","26:40","26:41","26:42","26:43","26:44","26:45","26:46","26:47","26:48","26:49","26:50","26:51"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Magician mass conversion through professional recognition of supernatural superiority", keys: ["26:46","26:47","26:48"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Internal prophetic fear divinely reassured enabling mission continuation", keys: ["26:21"], evidenceClass: "EXPLICIT_TEXT" });

  const kitab = findWord(2, ["\u0643","\u062a","\u0627","\u0628"]);
  if (kitab) e.terminology.push({ term: kitab, transliteration: "kitab", gloss: "Book/scripture (editorial gloss)", keys: ["26:2"] });

  const aziz = findWord(9, ["\u0639","\u0632","\u064a","\u0632"]);
  const rahim = findWord(9, ["\u0631","\u062d","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["26:9"] });
  if (rahim) e.divineNamesAndAttributes.push({ term: rahim, transliteration: "Rahim", gloss: "Merciful (editorial gloss)", keys: ["26:9"] });
}

// === POPULATE P2 (26:52-104) ===
{
  const e = extractions[1];
  // Aziz-Rahim (26:9) moved to P1 where verse 9 belongs

  e.propheticNarratives.push({ label: "Ibrahim idol rejection: rational interrogation of paternal tradition; idol-destruction rhetorical trap; fire miracle; deliverance to blessed land with Ishaq-Yaqub", keys: ["26:69","26:70","26:71","26:72","26:73","26:74","26:75","26:76","26:77","26:78","26:79","26:80","26:81","26:82","26:83","26:84","26:85","26:86","26:87","26:88","26:89","26:90","26:91","26:92","26:93","26:94","26:95","26:96","26:97","26:98","26:99","26:100","26:101","26:102","26:103","26:104"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["26:52"], excerpt: fv(52), description: "Travel by night with My servants — night exodus command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Ancestral tradition exposed as manifest error through rational interrogation", keys: ["26:74","26:75","26:76"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Firawn wealth-gardens-treasures transferred to formerly oppressed community", keys: ["26:57","26:58","26:59"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P3 (26:105-159) ===
{
  const e = extractions[2];

  e.propheticNarratives.push({ label: "Nuh: trustworthiness claim; wage-free mission; class-based rejection; flood salvation with ark pairs", keys: ["26:105","26:106","26:107","26:108","26:109","26:110","26:111","26:112","26:113","26:114","26:115","26:116","26:117","26:118","26:119","26:120","26:121","26:122"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Hud-Aad: monument-building arrogance; mighty seizure destroying sportive architecture; shadow-punishment", keys: ["26:123","26:124","26:125","26:126","26:127","26:128","26:129","26:130","26:131","26:132","26:133","26:134","26:135","26:136","26:137","26:138","26:139","26:140"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Salih-Thamud: secure habitation; mountain-carved dwellings; she-camel test with alternating drinking; hamstringing triggering earthquake", keys: ["26:141","26:142","26:143","26:144","26:145","26:146","26:147","26:148","26:149","26:150","26:151","26:152","26:153","26:154","26:155","26:156","26:157","26:158","26:159"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["26:106"], excerpt: fv(106), description: "Fear Allah and obey me — triple prophetic command formula." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["26:155","26:156"], excerpt: fv(155), description: "Do not harm the she-camel of Allah lest punishment of great Day seizes you." });

  e.humanConditionsAndSpiritualStates.push({ label: "Class-based rejection: elite reject prophet because followed by lowest social classes", keys: ["26:111"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Monument-building as architectural arrogance masking spiritual emptiness", keys: ["26:128","26:129"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Mountain-carved dwellings representing technological achievement divorced from moral accountability", keys: ["26:149"], evidenceClass: "EXPLICIT_TEXT" });

  const ayah = findWord(121, ["\u0622","\u064a","\u0629"]);
  if (ayah) e.terminology.push({ term: ayah, transliteration: "ayah", gloss: "sign (editorial gloss)", keys: ["26:121"] });
}

// === POPULATE P4 (26:160-191) ===
{
  const e = extractions[3];

  e.propheticNarratives.push({ label: "Lut: family salvation with wife exception; evil-rain destruction of transgressing community", keys: ["26:160","26:161","26:162","26:163","26:164","26:165","26:166","26:167","26:168","26:169","26:170","26:171","26:172","26:173","26:174","26:175"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Shu'ayb-thicket: commercial justice commands; anti-corruption linked to creation remembrance; shadow-punishment", keys: ["26:176","26:177","26:178","26:179","26:180","26:181","26:182","26:183","26:184","26:185","26:186","26:187","26:188","26:189","26:190","26:191"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["26:181","26:182","26:183"], excerpt: fv(181), description: "Give full measure and do not be of those who cause loss; weigh with just scales; do not defraud people of their things." });
  // Verse 214 belongs to P5 (192-227), not P4 (160-191)

  e.humanConditionsAndSpiritualStates.push({ label: "Commercial corruption linked to forgetting creation-origin as root cause", keys: ["26:184"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Commercial justice triad: honest measurement, just weighing, no defrauding — foundational market ethics", keys: ["26:181","26:182","26:183"], evidenceClass: "EXPLICIT_TEXT" });

  // Ruh (26:193) moved to P5 where it belongs
}

// === POPULATE P5 (26:192-227) ===
{
  const e = extractions[4];
  const samee = findWord(217, ["\u0633","\u0645","\u064a","\u0639"]);
  const aleem = findWord(217, ["\u0639","\u0644","\u064a","\u0645"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "All-Hearing (editorial gloss)", keys: ["26:217"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["26:217"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["26:215"], excerpt: fv(215), description: "Lower your wing to those who follow you of the believers — mercy posture toward followers." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["26:216"], excerpt: fv(216), description: "If they disobey you say I am innocent of what you do — prophetic disavowal formula." });

  e.humanConditionsAndSpiritualStates.push({ label: "Poet exception: only believing-righteous-dhikr-practicing poets exempted from misguidance charge", keys: ["26:224","26:225","26:226","26:227"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Devils descending upon every sinful liar as eavesdropping information source", keys: ["26:221","26:222","26:223"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine observation of prophetic sujud among worshippers as sustaining presence", keys: ["26:218","26:219"], evidenceClass: "EXPLICIT_TEXT" });

  const ruh = findWord(193, ["\u0631","\u0648","\u062d"]);
  if (ruh) e.terminology.push({ term: ruh, transliteration: "ruh", gloss: "spirit (editorial gloss)", keys: ["26:193"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["26:214"], excerpt: fv(214), description: "Warn your nearest kindred — kinship-prioritized warning command." });

  const shuar = findWord(224, ["\u0634","\u0639","\u0631"]);
  if (shuar) e.terminology.push({ term: shuar, transliteration: "shu'ara'", gloss: "poets (editorial gloss)", keys: ["26:224"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `026-ash-shuara-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 026-ash-shuara-p${num}.json`);
}

// === CANDIDATES (cand-0997..cand-1036, 40 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-026-p1,ext-026-p2,ext-026-p3,ext-026-p4,ext-026-p5",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0997..1004)
  { id: "cand-0997", label: "Quran as clear Book (kitab mubin) causing prophetic grief over disbelief", def: "In 26:2-3: These are verses of the clear Book; perhaps you will destroy yourself in grief that they do not believe.", key: "26:2", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Kitab mubin designation."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Prophetic compassion-grief."}] },
  { id: "cand-0998", label: "Scripture continuity confirmed through ancient texts and scholarly recognition", def: "In 26:196-197: Indeed it is in scriptures of ancients; is it not a sign that scholars of Israelites know it?", key: "26:196", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"Cross-scriptural confirmation."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Scholarly validation."}] },
  { id: "cand-0999", label: "Musa internal fear divinely reassured enabling mission continuation", def: "In 26:21: He felt fear within himself; We said fear not indeed you are superior.", key: "26:21", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Divine reassurance overcoming fear."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Courage through divine support."}] },
  { id: "cand-1000", label: "Magician mass conversion through professional recognition of supernatural superiority", def: "In 26:46-48: Magicians fell in prostration saying we believe in Lord of worlds Lord of Musa and Harun.", key: "26:46", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Instant conversion through evidence."},{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Professional acknowledgment."}] },
  { id: "cand-1001", label: "Firawn mutilation-crucifixion threats rejected with eternal perspective", def: "In 26:49-51: Cut hands feet alternate sides crucify; said no matter return to Lord; forgive first sins.", key: "26:49", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Persecution testing sincerity."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Eternal outweighing temporal."}] },
  { id: "cand-1002", label: "Eschatological reward contrast: criminal eternal loss vs believer eternal gardens", def: "In 26:88-89: Day wealth sons avail not; except who comes Allah with sound heart.", key: "26:88", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Qalb salim as sole currency."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Material worthlessness."}] },
  { id: "cand-1003", label: "Staff swallowing exposing crafted magic as truth-consuming-falsehood paradigm", def: "In 26:45: Threw staff behold it swallowed what they fabricated.", key: "26:45", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Haqq consuming batil."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Miracle overriding illusion."}] },
  { id: "cand-1004", label: "Purification command preceding prophetic confrontation", def: "In 26:18: Go to Firawn he has transgressed; purify yourself (tatahhara).", key: "26:18", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Ritual preparation."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Inner-outer purity."}] },

  // P2 (cand-1005..1012)
  { id: "cand-1005", label: "Night exodus with no-looking-back as obedience test under pressure", def: "In 26:52: Travel by night with My servants; do not look back; proceed as commanded.", key: "26:52", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Nocturnal departure."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Forward-only obedience."}] },
  { id: "cand-1006", label: "Firawn wealth-gardens-treasures transferred to formerly oppressed", def: "In 26:57-59: Thus We expelled them from gardens springs treasures noble station; made others inherit.", key: "26:57", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Wealth redistribution through divine intervention."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Reversal of fortunes."}] },
  { id: "cand-1007", label: "Sign-refrain establishing prophetic consistency across narratives", def: "In 26:8,67,104,122,140,159,175,191,213: Indeed in that is a sign but most were not believers; indeed your Lord is Aziz Rahim.", key: "26:8", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Repeated structural anchor."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Unified prophetic message."}] },
  { id: "cand-1008", label: "Ibrahim rational interrogation exposing ancestral tradition as manifest error", def: "In 26:70-77: What do you worship? Idols; do they hear benefit harm? Found fathers worshipping; you and fathers in manifest error.", key: "26:70", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Rational tawheed argument."},{topicId:"intellect-importance",layer:"scholarly",relationship:"same-concept",note:"Logic defeating tradition."}] },
  { id: "cand-1009", label: "Idol-destruction rhetorical trap using largest statue as silent accuser", def: "In 26:62-66: Made fragments except large one; ask it if it speaks; admitted shame then blamed Ibrahim.", key: "26:62", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Rhetorical entrapment."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Idol speechlessness proven."}] },
  { id: "cand-1010", label: "Fire miracle reversing oppressor intent demonstrating elemental subjugation", def: "In 26:69: Said O fire be cool and safe for Ibrahim; intended harm made them greatest losers.", key: "26:69", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Nar barid salam."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Element reversal."}] },
  { id: "cand-1011", label: "Deliverance to blessed land with multi-generational blessing grant", def: "In 26:89: Saved him and Lut to land We blessed for worlds; gave Isaac Yaqub additional gift.", key: "26:89", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Blessed geography."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Multi-generational barakah."}] },
  { id: "cand-1012", label: "Communal shame and blame reversal upon idol-worshippers", def: "In 26:65-66: Admitted shame; then reversed blame onto Ibrahim; said you already knew these cannot speak.", key: "26:65", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Momentary recognition then denial."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Cognitive dissonance."}] },

  // P3 (cand-1013..1020)
  { id: "cand-1013", label: "Triple prophetic command formula: fear Allah obey me ask no wage", def: "In 26:106-109,124-127,142-145,161-164,177-180: Fear Allah obey me; I ask no wage; reward only from Lord worlds.", key: "26:106", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Standardized prophetic formula."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Gratuitous guidance."}] },
  { id: "cand-1014", label: "Class-based rejection: elite refuse prophet because followed by lowest", def: "In 26:111: Shall we believe you while followed by the lowest (adhalla)?", key: "26:111", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Status-based dismissal."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Class prejudice."}] },
  { id: "cand-1015", label: "Monument-building as architectural arrogance masking spiritual emptiness", def: "In 26:128-129: Build on every elevation a monument sporting; take structures hoping to remain forever.", key: "26:128", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Architectural hubris."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Physical permanence vs spiritual impermanence."}] },
  { id: "cand-1016", label: "She-camel as divine test with alternating drinking schedule", def: "In 26:155-156: She-camel of Allah as sign; she has drink appointment and you have known day; do not harm her.", key: "26:155", overlap: [{topicId:"salih-story",layer:"scholarly",relationship:"same-concept",note:"Naqat Allah."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Resource-sharing test."}] },
  { id: "cand-1017", label: "Hamstringing she-camel triggering earthquake as collective punishment", def: "In 26:157-158: Hamstrung her then regretted; seized by earthquake became motionless in homes.", key: "26:157", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Rajfah as seismic punishment."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Collective accountability."}] },
  { id: "cand-1018", label: "Shadow-punishment (adhab yawm al-zullah) as unique Aad-Thamud penalty", def: "In 26:135,189: Denied so seized by punishment of Day of Shadow; indeed it was punishment of great Day.", key: "26:135", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Zullah as distinctive punishment."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Temporal punishment anticipating final."}] },
  { id: "cand-1019", label: "Secure habitation taken for granted preceding Thamud destruction", def: "In 26:146-149: Left secure in gardens springs crops palms; carve mountains houses rejoicing.", key: "26:146", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Security preceding loss."},{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Comfort breeding complacency."}] },
  { id: "cand-1020", label: "Five-narrative cycle establishing identical prophetic pattern across civilizations", def: "In 26:105-191: Nuh-Hud-Salih-Lut-Shuayb each following identical structure: trustworthiness claim, wage-free mission, rejection, punishment, sign-refrain.", key: "26:105", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Structural uniformity."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Repetition as emphasis."}] },

  // P4 (cand-1021..1028)
  { id: "cand-1021", label: "Commercial justice triad as foundational market ethics", def: "In 26:181-183: Give full measure do not cause loss; weigh with just scales; do not defraud people of their things.", key: "26:181", overlap: [{topicId:"business-ethics",layer:"scholarly",relationship:"same-concept",note:"Triple commercial command."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Market integrity."}] },
  { id: "cand-1022", label: "Anti-corruption linked to creation-origin remembrance as moral anchor", def: "In 26:184: Fear Him who created you and the former generations — creation as ethical foundation.", key: "26:184", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Creation-awareness preventing corruption."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Origin-memory as restraint."}] },
  { id: "cand-1023", label: "Lut family salvation with wife exception demonstrating individual accountability within household", def: "In 26:169-171: Saved him and family all except old woman among those remaining behind.", key: "26:169", overlap: [{topicId:"lut-story",layer:"scholarly",relationship:"same-concept",note:"Spousal exception."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual merit over kinship."}] },
  { id: "cand-1024", label: "Evil-rain destruction as targeted punishment for sexual transgression", def: "In 26:173: Rained upon them rain of evil; evil was rain of those warned.", key: "26:173", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Matr al-saw'."},{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Sexual transgression punished."}] },
  { id: "cand-1025", label: "Sorcery accusation as standard elite response to prophetic signs", def: "In 26:153,185: You are only bewitched; following lowest; same accusation across narratives.", key: "26:153", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Recurring sihr charge."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Dismissal strategy."}] },
  { id: "cand-1026", label: "Sky-drop challenge as empirical verification demand reflecting materialist epistemology", def: "In 26:187: Drop upon us pieces from sky if you are truthful.", key: "26:187", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Demanded vs given signs."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Materialist verification standard."}] },
  { id: "cand-1027", label: "Kinship-prioritized warning command establishing familial da'wah obligation", def: "In 26:214: Warn your nearest kindred (ashiratuka al-aqrabin).", key: "26:214", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Family-first da'wah."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Kinship priority."}] },
  { id: "cand-1028", label: "Mercy-wing posture toward believing followers as prophetic gentleness", def: "In 26:215: Lower your wing to those who follow you of the believers.", key: "26:215", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Janah al-dhull."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Leader-follower tenderness."}] },

  // P5 (cand-1029..1036)
  { id: "cand-1029", label: "Quran revelation via Trustworthy Spirit upon prophet's heart", def: "In 26:192-194: Indeed it is revelation of Lord of worlds; descended Trustworthy Spirit upon your heart.", key: "26:192", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Ruh al-Amin delivery."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Heart as reception locus."}] },
  { id: "cand-1030", label: "Arabic tongue specification ensuring linguistic accessibility", def: "In 26:195: In a clear Arabic tongue (bi-lisanin arabiyyin mubin).", key: "26:195", overlap: [{topicId:"quranic-vocabulary",layer:"scholarly",relationship:"same-concept",note:"Lisan arabi mubin."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Linguistic clarity."}] },
  { id: "cand-1031", label: "Non-Arab recitation hypothetical proving universal accessibility beyond ethnicity", def: "In 26:198-199: Even if sent down upon some non-Arabs and they recited it they would not believe.", key: "26:198", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Language not barrier."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Rejection volitional not linguistic."}] },
  { id: "cand-1032", label: "Denial insertion into criminal hearts as divine consequence of persistent rejection", def: "In 26:200: Thus We inserted it into hearts of criminals.", key: "26:200", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Salk as sealing."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Consequential blindness."}] },
  { id: "cand-1033", label: "Sudden punishment awareness producing belated perception", def: "In 26:202: Comes to them suddenly while they do not perceive.", key: "26:202", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Baghtatan arrival."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Unawareness until impact."}] },
  { id: "cand-1034", label: "Poet exception clause: believing-righteous-dhikr poets exempted from misguidance", def: "In 26:224-227: Poets followed by astray; except those who believed did righteous remembered Allah much avenged after wronged.", key: "26:224", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Righteous poetry exempted."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr as distinguishing marker."}] },
  { id: "cand-1035", label: "Devils descending upon sinful liars as eavesdropping information source", def: "In 26:221-223: Shall I inform you upon whom devils descend? Upon every sinful liar; they give ear most are fabricators.", key: "26:221", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Shayatin as misinformation agents."},{topicId:"lying",layer:"scholarly",relationship:"same-concept",note:"Fabrication linked to demonic source."}] },
  { id: "cand-1036", label: "Divine observation of prophetic sujud as sustaining presence during mission", def: "In 26:218-219: Who sees you when you stand and your movement among those who prostrate.", key: "26:218", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Visual omniscience."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Observed devotion sustained."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 4 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 8).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(8, 16).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(16, 24).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(24, 32).map(c => c.candidateId);
extractions[4].topicCandidateIds = candidates.candidates.slice(32, 40).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `026-ash-shuara-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-050.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-050.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
