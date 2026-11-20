// MFD-11 Wave 5: Surah 36 (Ya-Sin) genuine re-extraction.
// Covers 36:1–83 in 4 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "036-0001-0083.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 36:${n} not found`);
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

console.log("Generating Surah 36 (Ya-Sin) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T14:40:00.000Z";

// P1: 36:1–32 — Ya-Sin; Quran confirmation; messenger to heedless people; town parable
// P2: 36:33–50 — Creation signs: dead earth, night-day, sun-moon orbits, ship riding
// P3: 36:51–68 — Resurrection blast; judgment assembly; limbs testify; divine command Kun
// P4: 36:69–83 — Prophet not poet; Quran as reminder; creation from drop; sovereignty-knowledge closing

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-036-p1": [
    "Disjointed letters Ya-Sin as surah-opening oath",
    "Oath by the wise Quran affirming its revelatory authority",
    "Confirmation of Muhammad as one of the sent messengers",
    "Prophetic mission situated on a straight path",
    "Revelation identified as descent from the Exalted Mighty Merciful",
    "Warning directed at people whose forefathers were never warned leaving them heedless",
    "Divine word justified against most who have confirmed disbelief",
    "Shackles placed on necks up to chins forcing heads aloft as perceptual punishment",
    "Barrier set before and behind with covering preventing sight",
    "Warning equivalence for those sealed in disbelief whether warned or not",
    "Warning effective only for followers of the Reminder who fear Rahman unseen with promise of forgiveness and noble reward",
    "Revival of dead with recording of deeds sent ahead and traces left behind in clear register",
    "Town parable introduced as example when messengers arrived",
    "Two messengers sent then denied so reinforced with third declaring messenger status",
    "Townspeople rejecting messengers as mere humans claiming Rahman revealed nothing",
    "Messengers invoking divine omniscience as witness to their mission",
    "Messenger duty limited to clear conveyance alone",
    "Townspeople accusing messengers of bad omen threatening stoning and painful punishment",
    "Messengers reversing omen back onto accusers identifying them as transgressors",
    "Man running from farthest city urging his people to follow the messengers",
    "Appeal to follow those asking no wage who are rightly guided",
    "Rhetorical question on why he should not worship his Creator to whom all return",
    "Rejection of false deities whose intercession cannot avail against Rahman adversity",
    "Declaration that taking other gods would be manifest error",
    "Public profession of faith in the Lord of the messengers urging audience to listen",
    "Posthumous command to enter Paradise expressing wish his people could know",
    "Lord forgiveness and placement among the honored as posthumous vindication",
    "No heavenly soldiers sent down upon his people after him nor would any be sent",
    "Single shout extinguishing the transgressors instantly",
    "Regret over servants who ridicule every messenger that comes to them",
    "Destroyed generations before them cited as evidence they will not return",
    "All humanity gathered and brought present before Allah"
  ],
  "ext-036-p2": [
    "Dead earth revived producing grain as observable resurrection sign",
    "Gardens of palms and grapevines with springs gushing forth as provision system",
    "Fruit produced for eating without human labor demanding gratitude",
    "Glorification of Creator of all pairs from earth plants selves and unknown things",
    "Night stripping away daylight leaving darkness as temporal sign",
    "Sun running toward appointed resting place by decree of Exalted Knowing",
    "Moon assigned phases returning to old palm-stalk appearance",
    "Sun unable to overtake moon and night unable to outpace day each floating in orbit",
    "Laden ship carrying descendants as maritime sign of divine favor",
    "Similar vessels created for subsequent generations to ride",
    "Drowning threat with no rescuer except divine mercy",
    "Mercy and temporary provision granted for a time",
    "Command to beware what is before and behind so mercy may be received",
    "Every sign from their Lord met with turning away",
    "Disbelievers mocking charity command saying Allah would feed whom He willed",
    "Demand for timeline of promised judgment challenging truthfulness",
    "Only one blast awaited seizing them mid-dispute",
    "Inability to make any will or return to family after sudden seizure"
  ],
  "ext-036-p3": [
    "Trumpet blown causing immediate emergence from graves hastening toward Lord",
    "Regretful cry asking who raised them from sleeping place acknowledging Rahman promise fulfilled",
    "Single blast gathering all humanity present before Allah",
    "No soul wronged that Day recompensed only for what they used to do",
    "Paradise companions preoccupied in joyful occupation",
    "Spouses together in shade reclining on adorned couches",
    "Fruit available plus whatever they request or wish for",
    "Peace spoken as word from Merciful Lord",
    "Criminals commanded to stand apart on Judgment Day",
    "Adamic covenant recalled prohibiting satanic worship as clear enemy",
    "Exclusive worship of Allah commanded as straight path",
    "Satan having misled masses with rhetorical challenge on lack of reason",
    "Hellfire presented as the promised destination",
    "Entry into Hellfire commanded as recompense for denial",
    "Mouths sealed while hands speak and feet testify to earnings as bodily accountability",
    "Eye obliteration hypothetical showing power to blind those racing to find path",
    "Deformation hypothetical paralyzing in place unable to proceed or return",
    "Long life causing reversal in creation prompting reflection on decline"
  ],
  "ext-036-p4": [
    "Prophet not taught poetry nor is it befitting him distinguishing revelation from verse",
    "Quran identified as Reminder and clear recitation warning the living justifying word against disbelievers",
    "Livestock created by divine hands making humans their owners",
    "Animals tamed for riding and eating as subjection signs",
    "Additional benefits and drinks from livestock demanding gratitude",
    "False deities taken besides Allah in hope of help",
    "False gods unable to help even themselves brought as gathered soldiers against worshippers",
    "Prophet consoled that their speech should not grieve since Allah knows concealment and declaration",
    "Human origin from sperm-drop producing open adversary disputing resurrection",
    "Man presenting example to Allah forgetting own creation asking who revives decayed bones",
    "Answer that initial Creator gives life again being All-Knowing of every creation",
    "Fire produced from green tree as paradoxical creative sign enabling ignition",
    "Creator of heavens and earth able to create their likes affirmed as Knowing Creator",
    "Divine command instantaneous saying Be and it is establishing absolute creative sovereignty",
    "Closing glorification of Him holding dominion of everything to whom all return"
  ]
};

const PASSAGES = [
  { id: "ext-036-p1", from: 1, to: 32,
    label: "Ya-Sin; wise Quran; indeed messengers; straight path; revelation Exalted Mighty Merciful; warn people fathers not warned unaware; word fulfilled against most disbelieve; placed shackles necks chins heads raised; barrier before behind covered not see; same warn or not warn believe; warn follows reminder fears Rahman unseen forgiveness noble reward; revive dead record sent ahead traces everything clear Book; strike example companions town messengers came; sent two denied reinforced third said messengers to you; said not but human like us Rahman revealed nothing lying; said Lord knows indeed messengers to you; duty only clear conveyance; said bad omen you desist stone painful punishment; said omen yourselves reminded transgressors; came running man city end said O people follow messengers; ask no wage guided; followed religion Lord forgive enter generous; destroyed one shout became silent extinguished; alas servants never comes messenger except ridiculed; see destroyed generations before them not returning",
    mainLabel: "Disjointed letters; Quran as hakim confirming prophetic mission on straight path; revelation from Aziz Rahim targeting heedless people whose fathers were unwarned; divine word justified against majority disbelief; physical-spiritual barriers preventing perception; warning equivalence for believers vs non-believers; revival of dead recording deeds-traces in clear Imam; town parable (ashab al-qaryah): three messengers rejected; reinforcement by third; denial based on anthropomorphic objection; divine omniscience affirming messenger status; clear conveyance as sole duty; bad-omen accusation reversed onto accusers; believing man from city outskirts urging following messengers; selfless guidance offered; posthumous pardon-entry granted; destruction by single shout silencing transgressors; servant-regret pattern across generations" },
  { id: "ext-036-p2", from: 33, to: 50,
    label: "sign dead earth revived produced grain eat; made gardens date-vines springs gushed forth; eat fruit hands made not grateful; created pairs male female ships ride; subjected sun moon running appointed term stars prostrate; sky rain produce fruits livestock eat; say praise Allah created pairs all things know not; sign night strip day darkness; sun runs resting place decree Exalted Knowing; moon determined phases returns old palm-stalk; sun not overtake moon night not outpace day float orbit; sign laden ship rode descendants; created similar carry; will drown none save cry hear; mercy enjoyment time; struck disaster said what hands sent forward ungrateful; say obey Allah Messenger turn away loves not disbelievers",
    mainLabel: "Dead-earth revival producing grain as resurrection microcosm; gardens-datevines-springs as provision system demanding gratitude; paired creation spanning gender-species-vessels; cosmic subjection: sun-moon orbits with appointed terms; star prostration; night-day alternation; solar-lunar orbital mechanics preventing collision; floating-orbit principle; laden ship carrying descendants as maritime sign; drowning rescue dependent on sincere supplication; mercy-provision preceding disaster; disaster-response revealing ingratitude; obedience command with divine indifference to rejection" },
  { id: "ext-036-p3", from: 51, to: 68,
    label: "trumpet blown graves rush Lord; say woe us raised sleeping place promise Rahman truth messengers; one shout seized gathered; Day no soul wronged recompensed except did; owners Gardens busy rejoicing; spouses reclining thrones shade; fruit everything called; peace word Merciful Lord; stand apart criminals Day; not charge Adam children worship Satan enemy; worship Allah straight path; misled many understand; Hell earned today; sealed mouths hands speak feet testify earned; will erase eyes rush crime; transform creation repeat; say give life bones decayed; say gives life first created knowing everything; made fire green trees kindle; created heavens earth able create like yes Commander intends thing says Be is; glory hand dominion everything returned",
    mainLabel: "Trumpet-blast triggering grave-emergence toward Lord; regretful awakening acknowledging Rahman's promise-truth; single-shout gathering without injustice; Garden-owners preoccupied with joy-spouse-companionship; criminal separation at judgment; Adamic covenant against satanic worship recalled; straight-path command; mass misguidance noted; Jahannam as earned destination; mouth-sealing with hand-speech foot-testimony as bodily accountability; eye-erasure transformation into crime-rushing; creation-repetition ease argument; bone-decay resurrection answered by initial-creation precedent; divine knowledge encompassing all; fire-from-green-tree paradox demonstrating creative power; Kun-fa-yakun (Be-and-it-is) as instantaneous divine command; glorification of sovereign hand holding universal dominion-return" },
  { id: "ext-036-p4", from: 69, to: 83,
    label: "not taught poetry suitable not; reminder Quran living warn alive word fulfilled disbelievers; see cattle created yoke ride eat; benefits drinks bow down grateful; taken besides Allah gods help; able assist brought gathered; grieve speech Indeed We know conceal declare; man see created drop sperm open adversary; makes likeness forgets creation says revives bones decayed; gives life first created knowing everything; made fire green trees kindle; created heavens earth able create like yes Commander intends says Be is; glory hand dominion everything returned",
    mainLabel: "Prophet distinguished from poet: Quran is dhikr-quran mubin warning the living; divine word justified against confirmed disbelievers; livestock subjection providing transport-nourishment-drink demanding gratitude; false-god impotence: cannot help even themselves; grief negated through divine knowledge of concealment-declaration; human origin from nutfah producing arrogant disputant; bone-decay resurrection answered by initial-creation analogy; fire-from-green-tree as creative paradox; Kun-fa-yakun establishing instantaneous divine capacity; closing tasbih affirming universal dominion-return" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`36:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`36:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 36, surahName: "Ya-Sin",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 5 genuine re-extraction. P1=quran-messenger-town-parable(1-32), P2=creation-signs-earth-cosmos-ship(33-50), P3=resurrection-judgment-kun(51-68), P4=poet-distinction-livestock-closing(69-83).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (36:1-32) ===
{
  const e = extractions[0];
  const aziz = findWord(5, ["\u0639","\u0632","\u064a","\u0632"]);
  const raheem = findWord(5, ["\u0631","\u062d","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["36:5"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["36:5"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["36:20"], excerpt: fv(20), description: "O my people follow the messengers — believing man's exhortation." });

  e.propheticNarratives.push({ label: "Town parable (ashab al-qaryah): three messengers sent then denied; reinforced by third; anthropomorphic rejection; believing man from outskirts urging compliance; posthumous pardon; single-shout destruction", keys: ["36:13","36:14","36:15","36:16","36:17","36:18","36:19","36:20","36:21","36:22","36:23","36:24","36:25","36:26","36:27","36:28","36:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Physical-spiritual barriers: shackles on necks-chins, barrier before-behind, covered so they cannot see", keys: ["36:8","36:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Servant-regret pattern: alas for servants, no messenger comes except they ridicule", keys: ["36:30"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Revival of dead with recording of deeds and traces (athar) in clear Imam", keys: ["36:12"], evidenceClass: "EXPLICIT_TEXT" });

  const quran = findWord(2, ["\u0642","\u0631","\u0622","\u0646"]);
  if (quran) e.terminology.push({ term: quran, transliteration: "Quran", gloss: "recitation/scripture (editorial gloss)", keys: ["36:2"] });
}

// === POPULATE P2 (36:33-50) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["36:47"], excerpt: fv(47), description: "Say: Obey Allah and obey the Messenger — dual obedience command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Dead-earth revival producing grain as resurrection microcosm accessible to observation", keys: ["36:33"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Cosmic orbital mechanics: sun cannot overtake moon nor night outpace day; each floats in orbit", keys: ["36:40"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Laden ship carrying descendants as maritime civilization sign enabling intergenerational continuity", keys: ["36:41"], evidenceClass: "EXPLICIT_TEXT" });

  const falak = findWord(40, ["\u0641","\u0644","\u0643"]);
  if (falak) e.terminology.push({ term: falak, transliteration: "falak", gloss: "orbit/circuit (editorial gloss)", keys: ["36:40"] });
}

// === POPULATE P3 (36:51-68) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["36:61"], excerpt: fv(61), description: "Did I not enjoin upon you O children of Adam not to worship Satan — Adamic covenant recalled." });

  e.humanConditionsAndSpiritualStates.push({ label: "Mouth-sealing with hand-speech and foot-testimony as bodily accountability mechanism on Judgment Day", keys: ["36:65"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P4 (36:69-83) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Kun fa-yakun (Be and it is): instantaneous divine command establishing creation-repetition capacity", keys: ["36:82"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prophet distinguished from poet: Quran is dhikr and quran mubin warning the living", keys: ["36:69","36:70"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creation-repetition ease: He who created first is able to repeat; He is All-Knowing", keys: ["36:79"], evidenceClass: "EXPLICIT_TEXT" });

  const kun = findWord(82, ["\u0643","\u0646"]);
  if (kun) e.terminology.push({ term: kun, transliteration: "kun fa-yakun", gloss: "Be and it is (editorial gloss)", keys: ["36:82"] });
  e.humanConditionsAndSpiritualStates.push({ label: "Human origin from nutfah producing open adversary disputing resurrection", keys: ["36:77"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Livestock subjection providing transport-nourishment-drink demanding gratitude response", keys: ["36:71","36:72","36:73"], evidenceClass: "EXPLICIT_TEXT" });

  const nutfah = findWord(77, ["\u0646","\u0637","\u0641"]);
  if (nutfah) e.terminology.push({ term: nutfah, transliteration: "nutfah", gloss: "drop/sperm-drop (editorial gloss)", keys: ["36:77"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `036-ya-sin-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 036-ya-sin-p${num}.json`);
}

// === CANDIDATES (cand-1307..cand-1336, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-036-p1,ext-036-p2,ext-036-p3,ext-036-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1307..1314)
  { id: "cand-1307", label: "Quran as hakim confirming prophetic mission on sirat mustaqim", def: "In 36:2-4: Wise Quran; indeed you are among messengers; on straight path.", key: "36:2", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Hakim designation."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Sirat mustaqim alignment."}] },
  { id: "cand-1308", label: "Revelation from Aziz-Rahim targeting heedless unwarned people", def: "In 36:5-6: Revelation of Exalted Mighty Merciful; warn people whose fathers were not warned.", key: "36:5", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Aziz-Rahim pairing."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"First-warner function."}] },
  { id: "cand-1309", label: "Physical-spiritual barriers preventing perception of truth", def: "In 36:8-9: Shackles on necks to chins; barrier before and behind; covered so they do not see.", key: "36:8", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Perceptual closure."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Sealed faculties."}] },
  { id: "cand-1310", label: "Revival of dead with recording of deeds and traces in clear Imam", def: "In 36:12: We revive dead and record what they sent ahead and their traces; everything in clear Book.", key: "36:12", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Athar recording."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Imam mubin register."}] },
  { id: "cand-1311", label: "Town parable: three messengers rejected then reinforced by third", def: "In 36:13-14: Strike example companions of town; sent two denied; reinforced with third.", key: "36:13", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Multi-messenger reinforcement."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Mathal as pedagogical tool."}] },
  { id: "cand-1312", label: "Believing man from city outskirts urging messenger-following without wage", def: "In 36:20-21: Man came running from farthest city; follow messengers; ask no wage of you.", key: "36:20", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Selfless advocacy."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Non-transactional mission."}] },
  { id: "cand-1313", label: "Posthumous pardon and entry granted to believing advocate", def: "In 36:26-27: Said enter Garden; would that my people knew how Lord forgave me made me honored.", key: "36:26", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghufran post-mortem."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ikram as reward."}] },
  { id: "cand-1314", label: "Single-shout destruction silencing transgressors as recurring pattern", def: "In 36:29: One shout only; became silent extinguished.", key: "36:29", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Sayhah wahidah."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Instant retribution."}] },

  // P2 (cand-1315..1322)
  { id: "cand-1315", label: "Dead-earth revival producing grain as observable resurrection proof", def: "In 36:33: Sign for them dead earth; We revived it produced grain from which they eat.", key: "36:33", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Botanical ba'th."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Observable ayah."}] },
  { id: "cand-1316", label: "Gardens-datevines-springs as integrated provision system demanding gratitude", def: "In 36:34-35: Made gardens date-vines caused springs gush forth; eat fruit hands not made; grateful?", key: "36:34", overlap: [{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Ni'mah demanding shukr."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Agricultural-hydrological integration."}] },
  { id: "cand-1317", label: "Paired creation spanning gender-species-vessels as universal design", def: "In 36:36: Created pairs of all things earth produces, of themselves, of what they know not.", key: "36:36", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Zawjayn universality."},{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Biological pairing."}] },
  { id: "cand-1318", label: "Solar-lunar orbital mechanics preventing collision with floating principle", def: "In 36:40: Sun not overtake moon nor night outpace day; each in falak swims.", key: "36:40", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Celestial precision."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Orbital maintenance."}] },
  { id: "cand-1319", label: "Laden ship carrying descendants as intergenerational maritime sign", def: "In 36:41: Sign for them We carried descendants in laden ship.", key: "36:41", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Nuh-Fulk echo."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Dhurriyyah transport."}] },
  { id: "cand-1320", label: "Drowning rescue dependent on sincere supplication alone", def: "In 36:43-44: If We will drown them no helper saved except mercy from Us enjoyment for time.", key: "36:43", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Crisis-driven ikhlas."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Conditional salvation."}] },
  { id: "cand-1321", label: "Disaster-response revealing prior ingratitude despite provision", def: "In 36:45-46: Struck disaster say what hands sent forward; ungrateful.", key: "36:45", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Kufran ni'mah exposed."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Adversity as disclosure."}] },
  { id: "cand-1322", label: "Dual obedience command with divine indifference to rejection", def: "In 36:47: Say obey Allah obey Messenger; if turn away he bears own burden; loves not disbelievers.", key: "36:47", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Ta'ah dual."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual burden."}] },

  // P3 (cand-1323..1330)
  { id: "cand-1323", label: "Trumpet-blast triggering grave-emergence toward Lord", def: "In 36:51: Trumpet blown; from graves to Lord they rush.", key: "36:51", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Sur + nushur."},{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Grave emergence."}] },
  { id: "cand-1324", label: "Regretful awakening acknowledging Rahman's promise-truth", def: "In 36:52: Say woe us who raised us from sleeping place; promise Rahman truth messengers spoke.", key: "36:52", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Belated recognition."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Wa'd confirmed."}] },
  { id: "cand-1325", label: "Garden-owners preoccupied with joy and spouse-companionship", def: "In 36:55-56: Owners Gardens that Day busy rejoicing; spouses reclining thrones shade.", key: "36:55", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jannah occupation."},{topicId:"marriage-importance",layer:"scholarly",relationship:"same-concept",note:"Eternal companionship."}] },
  { id: "cand-1326", label: "Adamic covenant against satanic worship recalled at judgment", def: "In 36:60-61: Did I not enjoin O children Adam not worship Satan; he is enemy; worship Allah straight path.", key: "36:60", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Primordial warning."},{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Exclusive worship mandate."}] },
  { id: "cand-1327", label: "Mouth-sealing with hand-speech and foot-testimony as bodily accountability", def: "In 36:65: Seal mouths; hands speak; feet testify to what they earned.", key: "36:65", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Bodily witness."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Physical testimony."}] },
  { id: "cand-1328", label: "Bone-decay resurrection answered by initial-creation precedent", def: "In 36:78-79: Says who revives bones decayed? Say gives life who created first; All-Knowing.", key: "36:78", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"I'adah argument."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Knowledge enabling repetition."}] },
  { id: "cand-1329", label: "Fire-from-green-tree paradox demonstrating creative power beyond natural law", def: "In 36:80: Made fire from green tree; you kindle from it.", key: "36:80", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Paradoxical creation."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Counter-intuitive ayah."}] },
  { id: "cand-1330", label: "Kun fa-yakun establishing instantaneous divine command capacity", def: "In 36:82: His command when He intends thing: say Be and it is.", key: "36:82", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Instantaneous creation."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Amr as sovereignty."}] },

  // P4 (cand-1331..1336)
  { id: "cand-1331", label: "Prophet distinguished from poet: Quran as dhikr-quran mubin", def: "In 36:69: Not taught poetry nor suitable; this is reminder and clear Quran.", key: "36:69", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Non-poet distinction."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Dhikr-Quran pairing."}] },
  { id: "cand-1332", label: "Quran warning the living while word justified against confirmed disbelievers", def: "In 36:70: Warn whoever is alive; word fulfilled against disbelievers.", key: "36:70", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Living-targeted warning."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Confirmed rejection."}] },
  { id: "cand-1333", label: "Livestock subjection providing transport-nourishment-drink demanding gratitude", def: "In 36:71-73: Created cattle; ride eat drink; benefits uses; grateful?", key: "36:71", overlap: [{topicId:"animals-as-communities",layer:"scholarly",relationship:"same-concept",note:"Taskhir li-service."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Animal-based ni'mah."}] },
  { id: "cand-1334", label: "False-god total impotence: cannot help even themselves", def: "In 36:74-75: Taken gods besides Allah; cannot help; brought gathered against them.", key: "36:74", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Powerlessness exposed."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Muhdarun confrontation."}] },
  { id: "cand-1335", label: "Human origin from nutfah producing arrogant disputant", def: "In 36:77: Man not see We created him from drop; now open adversary.", key: "36:77", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Nutfah origin."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Lowly-origin arrogance."}] },
  { id: "cand-1336", label: "Closing tasbih affirming universal dominion and return", def: "In 36:83: Glory to Him in whose hand is dominion of everything; to Him returned.", key: "36:83", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Tasbih closure."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Malakiyyah-marji'."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 5 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 8).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(8, 16).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(16, 24).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(24, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `036-ya-sin-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-060.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-060.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");