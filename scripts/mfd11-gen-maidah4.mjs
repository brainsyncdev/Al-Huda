// MFD-11 Maidah Pass 4 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Ma'idah 5:97-120 (Passages 12-14, Candidates cand-0257..cand-0266).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "005-0097-0120.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 5:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Maidah Pass 4 files from verbatim corpus (5:97-120)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T08:00:00.000Z";

// Safe term extractor using word-boundary splitting to get exact corpus forms
function findWordContaining(vid, chars) {
  const t = fv(vid);
  const words = t.split(/\s+/);
  for (const w of words) {
    let match = true;
    for (const ch of chars) {
      if (!w.includes(ch)) { match = false; break; }
    }
    if (match) return w;
  }
  return null;
}

// Also support direct indexOf for multi-word phrases
function findPhrase(vid, phrase) {
  const t = fv(vid);
  const i = t.indexOf(phrase);
  if (i >= 0) return t.slice(i, i + phrase.length);
  return null;
}

// ─── Passage 12: 5:97–108 ────────────────────────────────────────────────────────
const p12 = {
  extractionId: "ext-005-p12",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: {
    fromAyah: 97,
    toAyah: 108,
    label: "Al-Ma'idah — Kaaba sacred house standing for people; sacred months offering garlands so know Allah knows heavens earth All-Knowing; Allah severe penalty Forgiving Merciful; Messenger duty notification only; Allah knows disclose conceal; bad good not equal even abundance impresses; fear Allah O understanding succeed; do not ask things shown distress you; ask during revelation shown pardoned Forgiving Forbearing; people before asked then disbelieved; Allah not appoint bahirah saibah wasilah ham; disbelievers fabricate lies most not reason; come to revealed Messenger say sufficient fathers even if fathers knew nothing not guided; upon you yourselves; astray not harm you when guided; to Allah return informs deeds; testimony bequest two just men or two outsiders traveling death detain after prayer swear not exchange price nor conceal testimony sinners; if guilty two others stand swear truer not transgressed wrongdoers; likely give true testimony fear oaths returned; fear Allah listen; Allah guides not fasiqeen"
  },
  verseKeys: ["5:97","5:98","5:99","5:100","5:101","5:102","5:103","5:104","5:105","5:106","5:107","5:108"],
  arabicExcerpts: Array.from({length:12}, (_,i) => ({ key: `5:${i+97}`, text: fv(i+97) })),
  mainSubject: {
    label: "Kaaba and sacred institutions as signs of divine knowledge; Messenger's limited notification duty; bad-good distinction regardless of quantity; prohibition of distress-causing questions; pre-Islamic animal taboos rejected as fabrication; blind ancestral following condemned; individual responsibility principle; bequest testimony procedure with dual-witness verification and oath reinforcement; perjury replacement mechanism; taqwa-listening command; divine guidance withheld from fasiqeen",
    keys: ["5:97","5:98","5:99","5:100","5:101","5:102","5:103","5:104","5:105","5:106","5:107","5:108"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Kaaba Bayt Haram as qiyaman lil-nnas (standing institution for people)", keys: ["5:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sacred months hady qalaid as signs enabling recognition of divine omniscience", keys: ["5:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine severity-pardon duality: shadeed al-iqab ghafoorun raheem", keys: ["5:98"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger's duty limited to balagh (notification)", keys: ["5:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine knowledge of disclosed and concealed matters", keys: ["5:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bad-good inequality despite bad abundance impressing people", keys: ["5:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear Allah O people of understanding linked to success", keys: ["5:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition of asking questions whose answers would cause distress", keys: ["5:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Questions during revelation period answered; past matters pardoned", keys: ["5:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Previous communities asked similar questions then disbelieved", keys: ["5:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pre-Islamic animal taboos (bahirah saibah wasilah ham) rejected as divine invention", keys: ["5:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers fabricating lies against Allah; most lacking reason", keys: ["5:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ancestral-following defense rejected when ancestors lacked knowledge and guidance", keys: ["5:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Individual responsibility: upon you is yourselves; guided person unharmed by others' straying", keys: ["5:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Return to Allah who will inform of all past deeds", keys: ["5:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bequest testimony: two just men from community or two outsiders when traveling", keys: ["5:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Witness oath: no exchange for price even near relative; no concealing Allah's testimony", keys: ["5:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Perjury discovery: two claimants replace original witnesses with counter-oath", keys: ["5:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Counter-oath mechanism promotes truthful testimony and prevents oath manipulation", keys: ["5:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taqwa and listening commanded; Allah does not guide fasiqeen", keys: ["5:108"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Distress avoidance through question restraint during revelation period", keys: ["5:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lack of reasoning among majority of disbelievers", keys: ["5:103"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Bequest testimony legal framework with travel accommodation and perjury safeguards", keys: ["5:106","5:107","5:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rejection of pre-Islamic customary law (animal taboos) as fabricated innovation", keys: ["5:103"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0257","cand-0258","cand-0259","cand-0260"],
  notes: "Pass A Maidah passage 12/14. Transitional block bridging legislative section to eschatological-prophetic conclusion. Kaaba-sacred-institutions framing (5:97) grounds ritual practice in divine knowledge rather than ancestral custom. Question-prohibition (5:101) protects community from unnecessary burden while maintaining revelation-period inquiry channel. Pre-Islamic taboo rejection (5:103) parallels earlier halal-haram legislation completing normative framework. Individual-responsibility principle (5:105) balances communal obligations with personal accountability. Bequest-testimony procedure (5:106-108) provides detailed legal mechanism with built-in fraud prevention through counter-oath system.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P12 commands and prohibitions
p12.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:100"], excerpt: fv(100), description: "Command: fear Allah O people of understanding that you may succeed." });
p12.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:101"], excerpt: fv(101), description: "Prohibition: do not ask about things which if made plain would distress you." });
p12.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:108"], excerpt: fv(108), description: "Command: fear Allah and listen." });

// P12 divine names
{
  const t1 = findWordContaining(98, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(98, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t1 && t2) {
    const fullText = fv(98);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p12.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafoorun Raheem", gloss: "Forgiving Merciful (editorial gloss)", keys: ["5:98"] });
    }
  }
}
{
  const t1 = findWordContaining(101, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(101, ["\u062d","\u0644","\u064a","\u0645"]); // haleemun
  if (t1 && t2) {
    const fullText = fv(101);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p12.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafoorun Haleem", gloss: "Forgiving Forbearing (editorial gloss)", keys: ["5:101"] });
    }
  }
}
{
  const t = findWordContaining(97, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t) p12.divineNamesAndAttributes.push({ term: t, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["5:97"] });
}

// P12 terminology
{
  const t = findWordContaining(97, ["\u0642","\u064a","\u0627","\u0645"]); // qiyaman
  if (t) p12.terminology.push({ term: t, transliteration: "qiyam", gloss: "standing/support/institution (editorial gloss)", keys: ["5:97"] });
}
{
  const t = findWordContaining(103, ["\u0628","\u062d","\u064a","\u0631"]); // baheeratin
  if (t) p12.terminology.push({ term: t, transliteration: "bahirah", gloss: "pre-Islamic camel taboo (editorial gloss)", keys: ["5:103"] });
}
{
  const t = findWordContaining(103, ["\u0633","\u0627","\u0626","\u0628"]); // saibatin
  if (t) p12.terminology.push({ term: t, transliteration: "saibah", gloss: "pre-Islamic free-roaming animal taboo (editorial gloss)", keys: ["5:103"] });
}
{
  const t = findWordContaining(103, ["\u0648","\u0635","\u064a","\u0644"]); // waseelatin
  if (t) p12.terminology.push({ term: t, transliteration: "wasilah", gloss: "pre-Islamic twin-animal taboo (editorial gloss)", keys: ["5:103"] });
}
{
  const t = findWordContaining(103, ["\u062d","\u0627","\u0645"]); // hamin
  if (t) p12.terminology.push({ term: t, transliteration: "ham", gloss: "pre-Islamic stallion taboo (editorial gloss)", keys: ["5:103"] });
}
{
  const t = findWordContaining(106, ["\u0634","\u0647","\u062f"]); // shahadatu
  if (t) p12.terminology.push({ term: t, transliteration: "shahadah", gloss: "testimony/witnessing (editorial gloss)", keys: ["5:106"] });
}
{
  const t = findWordContaining(106, ["\u0648","\u0635","\u064a","\u0629"]); // alwasiyyati
  if (t) p12.terminology.push({ term: t, transliteration: "wasiyyah", gloss: "bequest/testament (editorial gloss)", keys: ["5:106"] });
}
{
  const t = findWordContaining(108, ["\u0641","\u0627","\u0633","\u0642"]); // alfasiqeena
  if (t) p12.terminology.push({ term: t, transliteration: "fasiqeen", gloss: "defiantly disobedient people (editorial gloss)", keys: ["5:108"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p12.json"), JSON.stringify(p12, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p12.json");

// ─── Passage 13: 5:109–115 ──────────────────────────────────────────────────────
const p13 = {
  extractionId: "ext-005-p13",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: {
    fromAyah: 109,
    toAyah: 115,
    label: "Al-Ma'idah — Day Allah gathers messengers asks response received say no knowledge You Knower unseen; Allah reminds Isa son Maryam favor upon him mother supported Holy Spirit spoke cradle maturity taught Book wisdom Torah Gospel created clay bird form breathed became bird healed blind leper raised dead all by permission restrained Israelites came clear proofs disbelievers said clear magic inspired disciples believe Me Messenger said believed witness Muslims; disciples asked table from heaven Isa said fear Allah if believers; want eat hearts reassured know truth be witnesses; Isa supplicated Allah our Lord send table feast first last sign provide best providers; Allah sending it whoever disbelieves after punished unlike any worlds"
  },
  verseKeys: ["5:109","5:110","5:111","5:112","5:113","5:114","5:115"],
  arabicExcerpts: Array.from({length:7}, (_,i) => ({ key: `5:${i+109}`, text: fv(i+109) })),
  mainSubject: {
    label: "Eschatological messenger gathering where prophets defer knowledge to Allah; comprehensive enumeration of Isa's miracles all performed bi-idhni (by divine permission); disciple faith confession as Muslims; ma'idah request revealing desire for heart-reassurance and truth-confirmation; Isa's supplication for heavenly table as eid and sign; divine grant with unique punishment warning for post-sign disbelief",
    keys: ["5:109","5:110","5:111","5:112","5:113","5:114","5:115"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Messengers gathered on Judgment Day deferring knowledge to Allah alone", keys: ["5:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah's reminder of favors upon Isa and his mother", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa supported with Ruh al-Qudus (Holy Spirit)", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa speaking in cradle and maturity as miraculous sign", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa taught Book wisdom Torah Gospel", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Clay-bird miracle performed bi-idhni (by divine permission)", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Healing blind and leper bi-idhni", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Raising dead bi-idhni", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Israelites restrained from killing Isa when he brought clear proofs", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelieving Israelites dismissing signs as clear magic", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disciples inspired to believe in Allah and His messenger; confessed faith as Muslims", keys: ["5:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disciples requesting heavenly table for heart-reassurance and truth-confirmation", keys: ["5:112","5:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa's initial response: fear Allah if you are believers", keys: ["5:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa's supplication for ma'idah as eid for first and last and sign from Allah", keys: ["5:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine grant of table with unique punishment for subsequent disbelief", keys: ["5:115"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Isa ibn Maryam's miracles enumerated: cradle speech clay bird healing raising dead all by divine permission", keys: ["5:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disciples' faith confession and ma'idah request narrative", keys: ["5:111","5:112","5:113","5:114"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Heart-reassurance (tatmainna quloobuna) as legitimate spiritual need behind sign-request", keys: ["5:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic humility: messengers deferring all knowledge to Allah on Judgment Day", keys: ["5:109"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Master-disciple relationship: Isa teaching and disciples believing witnessing", keys: ["5:111"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0261","cand-0262","cand-0263"],
  notes: "Pass A Maidah passage 13/14. Core Isa-miracle narrative with systematic bi-idhni (by My permission) qualifier repeated four times establishing divine agency behind every miracle. Disciples' Muslim identity explicitly affirmed (5:111) connecting early Christian community to Islamic submission concept. Ma'idah request motivated by heart-reassurance not doubt distinguishing it from demand-for-proof narratives. Isa's supplication (5:114) models proper prayer etiquette: addressing Allah as Rabbana acknowledging Him as Khayr al-Raziqeen. Unique-punishment clause (5:115) establishes heightened accountability for those receiving direct miraculous confirmation yet rejecting it.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P13 commands and prohibitions
p13.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["5:114"], excerpt: fv(114), description: "Supplication taught through Isa's example: O Allah our Lord send down upon us a table from heaven as festival for first and last of us and sign from You; provide for us You are best of providers." });

// P13 divine names
{
  const t = findWordContaining(109, ["\u0639","\u0644","\u0627","\u0645"]); // AAallamu
  if (t) {
    const t2 = findWordContaining(109, ["\u063a","\u064a","\u0648","\u0628"]); // alghuyoobi
    if (t2) {
      const fullText = fv(109);
      const idx1 = fullText.indexOf(t);
      const idx2 = fullText.indexOf(t2);
      if (idx1 >= 0 && idx2 > idx1) {
        const phrase = fullText.slice(idx1, idx2 + t2.length);
        p13.divineNamesAndAttributes.push({ term: phrase, transliteration: "Allam al-Ghuyub", gloss: "Knower of the Unseen (editorial gloss)", keys: ["5:109"] });
      }
    }
  }
}
{
  const t = findWordContaining(114, ["\u062e","\u064a","\u0631"]); // khayru
  if (t) {
    const t2 = findWordContaining(114, ["\u0631","\u0627","\u0632","\u0642"]); // alrraziqeena
    if (t2) {
      const fullText = fv(114);
      const idx1 = fullText.indexOf(t);
      const idx2 = fullText.indexOf(t2);
      if (idx1 >= 0 && idx2 > idx1) {
        const phrase = fullText.slice(idx1, idx2 + t2.length);
        p13.divineNamesAndAttributes.push({ term: phrase, transliteration: "Khayr al-Raziqeen", gloss: "Best of Providers (editorial gloss)", keys: ["5:114"] });
      }
    }
  }
}

// P13 terminology
{
  const t = findWordContaining(110, ["\u0631","\u0648","\u062d"]); // roohi
  if (t) {
    const t2 = findWordContaining(110, ["\u0642","\u062f","\u0633"]); // alqudusi
    if (t2) {
      const fullText = fv(110);
      const idx1 = fullText.indexOf(t);
      const idx2 = fullText.indexOf(t2);
      if (idx1 >= 0 && idx2 > idx1) {
        const phrase = fullText.slice(idx1, idx2 + t2.length);
        p13.terminology.push({ term: phrase, transliteration: "Ruh al-Qudus", gloss: "Holy Spirit/Pure Spirit (editorial gloss)", keys: ["5:110"] });
      }
    }
  }
}
{
  const t = findWordContaining(110, ["\u0645","\u0647","\u062f"]); // almahdi
  if (t) p13.terminology.push({ term: t, transliteration: "mahd", gloss: "cradle (editorial gloss)", keys: ["5:110"] });
}
{
  const t = findWordContaining(114, ["\u0645","\u0627","\u0626","\u062f"]); // maidatan
  if (t) p13.terminology.push({ term: t, transliteration: "ma'idah", gloss: "table spread/feast (editorial gloss)", keys: ["5:114"] });
}
{
  const t = findWordContaining(114, ["\u0639","\u064a","\u062f"]); // AAeedan
  if (t) p13.terminology.push({ term: t, transliteration: "eid", gloss: "festival/recurring celebration (editorial gloss)", keys: ["5:114"] });
}
{
  const t = findWordContaining(111, ["\u062d","\u0648","\u0627","\u0631"]); // alhawariyyeena
  if (t) p13.terminology.push({ term: t, transliteration: "hawariyyoon", gloss: "disciples/apostles (editorial gloss)", keys: ["5:111"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p13.json"), JSON.stringify(p13, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p13.json");

// ─── Passage 14: 5:116–120 ──────────────────────────────────────────────────────
const p14 = {
  extractionId: "ext-005-p14",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: {
    fromAyah: 116,
    toAyah: 120,
    label: "Al-Ma'idah — Allah asks Isa did you tell people take me mother deities besides Allah; Isa says exalted You not for me say without right; if said You would know; You know what in myself I not know what in Yourself You Knower unseen; said only what commanded worship Allah my Lord your Lord; was witness over them while among them; when took me You were Watcher over them You Witness all things; if punish they Your servants; if forgive You Exalted Wise; Allah says this Day truthfulness benefits truthful; gardens rivers flowing abiding forever; Allah pleased with them they pleased with Him great attainment; to Allah dominion heavens earth whatever in them He over all things Capable"
  },
  verseKeys: ["5:116","5:117","5:118","5:119","5:120"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `5:${i+116}`, text: fv(i+116) })),
  mainSubject: {
    label: "Isa's eschatological denial of commanding worship of himself and mother; affirmation of exclusive tawheed message (worship Allah my Lord and your Lord); Isa as temporary witness replaced by divine Watcher after his departure; divine prerogative of punishment-forgiveness balanced with servant-status acknowledgment; truthfulness rewarded with eternal gardens and mutual divine-human pleasure; closing declaration of absolute divine dominion and capability",
    keys: ["5:116","5:117","5:118","5:119","5:120"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Divine interrogation of Isa regarding alleged divinity claim", keys: ["5:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa's exaltation-response: subhanaka denying unauthorized speech", keys: ["5:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Asymmetric knowledge: You know my self I do not know Yours", keys: ["5:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa's message limited to commanded tawheed: worship Allah my Lord your Lord", keys: ["5:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa as witness during earthly presence; Allah as Raqeeb after departure", keys: ["5:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine prerogative: punishment or forgiveness both justified", keys: ["5:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Servant-status acknowledgment: they are Your servants", keys: ["5:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Truthfulness day: sidq benefiting sadiqeen", keys: ["5:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eternal gardens with rivers as reward for truthful", keys: ["5:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual pleasure: Allah pleased with them they pleased with Him", keys: ["5:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Great attainment (fawz azim) as ultimate success designation", keys: ["5:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Absolute divine dominion over heavens earth and all within", keys: ["5:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine capability over all things as closing declaration", keys: ["5:120"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Isa's eschatological testimony denying divinity claims and affirming tawheed-only message", keys: ["5:116","5:117"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Truthfulness (sidq) as salvific quality benefiting its possessor on Judgment Day", keys: ["5:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual divine-human pleasure as highest relational state in Paradise", keys: ["5:119"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Creator-servant relationship affirmed even in intercessory context: they are Your servants", keys: ["5:118"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0264","cand-0265","cand-0266"],
  notes: "Pass A Maidah passage 14/14. Final Christological correction and surah closure. Isa's three-part denial (subhanaka + ma yakoonu lee + in kuntu qultuhu) provides comprehensive refutation template. Asymmetric-knowledge argument (taAAlamu ma fee nafsee wala aAAlamu ma fee nafsika) establishes ontological gap proving creaturely status. Raqeeb-Witness transition (5:117) clarifies prophetic temporality versus divine permanence. Servant-status framing (5:118) prevents intercession from implying independent authority. Mutual-pleasure formula (radiya Allahu AAanhum waradoo AAanhu) represents peak Quranic salvation language. Dominion-capability closure (5:120) echoes surah opening themes completing literary ring structure.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P14 divine names
{
  const t = findWordContaining(116, ["\u0639","\u0644","\u0627","\u0645"]); // AAallamu
  if (t) {
    const t2 = findWordContaining(116, ["\u063a","\u064a","\u0648","\u0628"]); // alghuyoobi
    if (t2) {
      const fullText = fv(116);
      const idx1 = fullText.indexOf(t);
      const idx2 = fullText.indexOf(t2);
      if (idx1 >= 0 && idx2 > idx1) {
        const phrase = fullText.slice(idx1, idx2 + t2.length);
        p14.divineNamesAndAttributes.push({ term: phrase, transliteration: "Allam al-Ghuyub", gloss: "Knower of the Unseen (editorial gloss)", keys: ["5:116"] });
      }
    }
  }
}
{
  const t = findWordContaining(117, ["\u0631","\u0642","\u064a","\u0628"]); // alrraqeeba
  if (t) p14.divineNamesAndAttributes.push({ term: t, transliteration: "al-Raqeeb", gloss: "the Watcher/Observer (editorial gloss)", keys: ["5:117"] });
}
{
  const t = findWordContaining(117, ["\u0634","\u0647","\u064a","\u062f"]); // shaheedun
  if (t) p14.divineNamesAndAttributes.push({ term: t, transliteration: "Shaheed", gloss: "Witness (editorial gloss)", keys: ["5:117"] });
}
{
  const t1 = findWordContaining(118, ["\u0639","\u0632","\u064a","\u0632"]); // alAAazeezu
  const t2 = findWordContaining(118, ["\u062d","\u0643","\u064a","\u0645"]); // alhakeemu
  if (t1 && t2) {
    const fullText = fv(118);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p14.divineNamesAndAttributes.push({ term: phrase, transliteration: "al-Azeez al-Hakeem", gloss: "the Exalted Mighty the Wise (editorial gloss)", keys: ["5:118"] });
    }
  }
}
{
  const t = findWordContaining(120, ["\u0642","\u062f","\u064a","\u0631"]); // qadeerun
  if (t) p14.divineNamesAndAttributes.push({ term: t, transliteration: "Qadeer", gloss: "Capable/Competent (editorial gloss)", keys: ["5:120"] });
}

// P14 terminology
{
  const t = findWordContaining(119, ["\u0635","\u062f","\u0642"]); // sidquhum / alssadiqeena
  if (t) p14.terminology.push({ term: t, transliteration: "sidq", gloss: "truthfulness/truth (editorial gloss)", keys: ["5:119"] });
}
{
  const t = findWordContaining(119, ["\u0641","\u0648","\u0632"]); // alfawzu
  if (t) p14.terminology.push({ term: t, transliteration: "fawz", gloss: "attainment/success/triumph (editorial gloss)", keys: ["5:119"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p14.json"), JSON.stringify(p14, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p14.json");

// ─── Candidates batch (cand-0257 through cand-0266) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-005-p12,ext-005-p13,ext-005-p14",
  candidates: []
};

function makeCand(id, label, arabicLabel, urduLabel, def, evidenceArr, overlap, notes) {
  const c = {
    candidateId: id,
    label,
    definition: def,
    definitionStatus: "editorial-draft",
    evidence: evidenceArr,
    existingTopicOverlap: overlap || [],
    proposedBy: "ai-assisted",
    reviewStatus: "pending-scholarly-review",
    createdAt: TS
  };
  if (arabicLabel) c.arabicLabel = arabicLabel;
  if (urduLabel) c.urduLabel = urduLabel;
  if (notes) c.notes = notes;
  return c;
}

// cand-0257: Distress-question prohibition
candidates.candidates.push(makeCand("cand-0257",
  "Distress-question prohibition: believers forbidden from asking about matters whose disclosure would cause distress; past inquiries pardoned; previous communities asked then disbelieved",
  undefined, "تحريم أسئلة الإزعاج: المؤمنون مُنهَون عن السؤال عما يسوؤهم إذا بُيِّن؛ عفا الله عما سلف؛ أقوام سابقة سألت ثم كفرت",
  "In 5:101-102: O believers do not ask about things which if made plain would distress you. If you ask during Quran revelation they will be made plain. Allah has pardoned them. A people before you asked such questions then became disbelievers.",
  [{ key: "5:101", excerpt: fv(101), evidenceClass: "EXPLICIT_TEXT", rationale: "La tasaloo AAan ashyaa in tubda lakum tasukum: prohibition tied to emotional harm not knowledge suppression. In tasaloo AAanha heena yunazzalu alquranu tubda lakum: temporal exception during active revelation. AAafa Allahu AAanha: past pardon preventing retroactive guilt. WaAllahu ghafoorun haleemun: divine forbearance paired with forgiveness." },
   { key: "5:102", excerpt: fv(102), evidenceClass: "EXPLICIT_TEXT", rationale: "Qad saalaha qawmun min qablikum thumma asbahoo biha kafireena: historical precedent showing question-asking can lead to disbelief when answers contradict expectations." }],
  [],
  "Gap candidate. Establishes epistemic boundary protecting community from premature or harmful knowledge. Temporal qualification (during revelation) shows prohibition is contextual not absolute. Historical caution (5:102) transforms prohibition from paternalism to protective wisdom based on observed community outcomes. Ghafoorun Haleem pairing emphasizes divine patience with human curiosity while maintaining boundaries."
));

// cand-0258: Pre-Islamic animal taboos rejected
candidates.candidates.push(makeCand("cand-0258",
  "Pre-Islamic animal taboos rejected: bahirah saibah wasilah ham declared non-divine innovations; disbelievers fabricate lies against Allah; most lack reasoning",
  undefined, "رفض المحرمات الحيوانية الجاهلية: البحيرة والسائبة والوصيلة والحام بدع غير إلهية؛ المفترى على الله كذباً وأكثرهم لا يعقلون",
  "In 5:103: Allah has not appointed bahirah or saibah or wasilah or ham. But those who disbelieve fabricate lies against Allah and most of them do not reason.",
  [{ key: "5:103", excerpt: fv(103), evidenceClass: "EXPLICIT_TEXT", rationale: "Ma jaAAala Allahu min baheeratin wala saibatin wala waseelatin wala hamin: four specific pre-Islamic taboos negated by divine non-appointment. Walakinna allatheena kafaroo yaftaroona AAala Allahi alkathiba: fabrication charge linking custom-innovation to disbelief. Waaktharuhum la yaAAqiloona: reasoning-deficit diagnosis explaining persistence of baseless customs." }],
  [],
  "Gap candidate. Completes halal-haram legislative framework by explicitly rejecting pre-Islamic customary law. Four-term enumeration (bahirah saibah wasilah ham) demonstrates comprehensive knowledge of Arabian practices. Yaftaroona (fabricate) frames innovation as active deception not innocent tradition. La yaAAqiloona (do not reason) identifies cognitive failure underlying religious innovation. Positioned after question-prohibition suggesting both excessive inquiry and uncritical tradition-following are epistemic errors."
));

// cand-0259: Individual responsibility principle
candidates.candidates.push(makeCand("cand-0259",
  "Individual responsibility principle: upon you is yourselves; others' straying cannot harm the guided; return to Allah who informs of all deeds",
  undefined, "مبدأ المسؤولية الفردية: عليكم أنفسكم؛ ضلال الآخرين لا يضر المهتدين؛ المرجع إلى الله ينبئ بما كنتم تعملون",
  "In 5:105: O believers upon you is yourselves. Whoever goes astray will not harm you when you have been guided. To Allah is your return all together and He will inform you of what you used to do.",
  [{ key: "5:105", excerpt: fv(105), evidenceClass: "EXPLICIT_TEXT", rationale: "AAalaykum anfusakum: reflexive pronoun emphasizing self-accountability. La yadurrukum man dalla itha ihtadaytum: conditional immunity from others' error contingent on own guidance. Ila Allahi marjiAAukum jameeAAan: collective return maintaining communal dimension despite individual responsibility. Fayunabbiokum bima kuntum taAAmaloona: comprehensive deed-reporting ensuring nothing escapes divine accounting." }],
  [],
  "Gap candidate. Balances communal obligation (amr bil-maruf) with personal accountability preventing despair over others' rejection. Conditional structure (itha ihtadaytum) makes immunity contingent on active guidance-seeking not passive assumption. Collective-return clause (jameeAAan) prevents individualism from becoming isolationism. Positioned after ancestral-following critique (5:104) providing positive alternative to inherited religious identity."
));

// cand-0260: Bequest testimony legal framework
candidates.candidates.push(makeCand("cand-0260",
  "Bequest testimony framework: two just witnesses required; travel accommodation with outsider witnesses; oath reinforcement prohibiting price-exchange and concealment; perjury replacement with counter-oath mechanism",
  undefined, "إطار شهادة الوصية: شاهدان عدلان مطلوبان؛ تسهيل السفر بشهود من غيركم؛ تعزيز اليمين بتحريم استبدال الثمن والكتمان؛ استبدال الحنث بآلية اليمين المضاد",
  "In 5:106-108: Testimony among you when death approaches at bequest time: two just men from you or two others if traveling struck by death disaster. Detain after prayer swear by Allah we will not exchange for price even near relative nor conceal Allah's testimony. If found guilty of sin two others stand replacing them swearing our testimony truer not transgressed. That makes more likely true testimony or fear oaths returned. Fear Allah listen; Allah guides not fasiqeen.",
  [{ key: "5:106", excerpt: fv(106), evidenceClass: "EXPLICIT_TEXT", rationale: "Shahadatu baynikum itha hadara ahadakumu almawtu heena alwasiyyati: testimony-bequest-death nexus established. Ithnani thawa AAadlin minkum aw akharani min ghayrikum: dual-witness requirement with travel flexibility. Tahbisoonahuma min baAAdi alssalati: post-prayer detention ensuring solemnity. Fayuqsimani biAllahi ini irtabtum: conditional oath triggered by doubt. La nashtaree bihi thamanan walaw kana tha qurba: price-exchange prohibition even for relatives. Wala naktumu shahadata Allahi: concealment prohibition framing testimony as divine trust." },
   { key: "5:107", excerpt: fv(107), evidenceClass: "EXPLICIT_TEXT", rationale: "Fain AAuthira AAala annahuma istahaqqa ithman: perjury discovery mechanism. Faakharani yaqoomani maqamahuma: replacement procedure maintaining witness count. Mina allatheena istahaqqa AAalayhimu alawlayani: priority given to rightful claimants. Lashahadatuna ahaqqu min shahadatihima: comparative truth-claim requiring counter-oath." },
   { key: "5:108", excerpt: fv(108), evidenceClass: "EXPLICIT_TEXT", rationale: "Thalika adna an yatoo bialshshahadati AAala wajhiha: mechanism designed to elicit truthful testimony. Aw yakhafoo an turadda aymanun baAAda aymanihim: deterrent effect of potential counter-oaths. Waittaqoo Allaha waismaAAoo: taqwa-listening command as ethical foundation. WaAllahu la yahdee alqawma alfasiqeena: divine guidance withheld from defiantly disobedient." }],
  [{ topicId: "justice", layer: "curated", relationship: "related-not-identical", note: "Detailed legal procedure implementing justice principles in testamentary context" }],
  "Overlap with justice. Comprehensive legal framework combining procedural safeguards (two witnesses, post-prayer timing) with ethical reinforcement (oath, divine accountability). Travel accommodation shows practical flexibility within strict standards. Counter-oath mechanism creates self-correcting system where fraud risk increases detection probability. Fasiqeen exclusion maintains moral precondition for legal validity. Most detailed testimony legislation in Quran demonstrating legislative precision."
));

// cand-0261: Isa's miracles all bi-idhni
candidates.candidates.push(makeCand("cand-0261",
  "Isa's miracles qualified by bi-idhni: every miracle (clay bird healing raising dead) explicitly performed by divine permission establishing Allah as sole agent",
  undefined, "معجزات عيسى مقيدة بإذني: كل معجزة (طائر الطين إبراء الأكمه والأبرص إحياء الموتى) صراحة بإذن الله مؤسساً الله كفاعل وحيد",
  "In 5:110: When Allah said O Jesus son of Mary remember My favor upon you and your mother when I supported you with Holy Spirit you spoke to people in cradle and maturity I taught you Book wisdom Torah Gospel you created from clay like bird form by My permission breathed into it became bird by My permission healed blind and leper by My permission brought forth dead by My permission.",
  [{ key: "5:110", excerpt: fv(110), evidenceClass: "EXPLICIT_TEXT", rationale: "Ith ayyadtuka biroohi alqudusi: divine support as prerequisite. Tukallimu alnnasa fee almahdi wakahlan: cradle-speech miracle without bi-idhni (inherent divine gift). Waith AAallamtuka alkitaba waalhikmata: knowledge as divine teaching. Waith takhluqu mina altteeni kahayati alttayri biithnee: clay-bird creation qualified by permission. Fatanfukhu feeha fatakoonu tayran biithnee: animation also by permission. Watubrio alakmaha waalabrasa biithnee: healing by permission. Waith tukhriju almawta biithnee: resurrection by permission. Four-fold bi-idhni repetition systematically attributes all miraculous agency to Allah." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept", note: "Core Quranic miracle enumeration with systematic divine-permission qualification" }],
  "Overlap with isa-story. Bi-idhni repetition (four times) functions as theological safeguard preventing miracle-attribution to Isa independently. Cradle-speech exception (no bi-idhni) may indicate inherent prophetic sign versus acquired miraculous powers. Miracle progression (creation-healing-resurrection) escalates in scope demonstrating comprehensive divine power channeled through prophet. Remember-command (othkur niAAmatee) frames miracles as divine favors not personal achievements."
));

// cand-0262: Disciples' Muslim identity
candidates.candidates.push(makeCand("cand-0262",
  "Disciples' Muslim identity: hawariyyoon explicitly confess belief in Allah and messenger and request witness-status as Muslims establishing early Christian community as submitting believers",
  undefined, "هوية الحواريين المسلمة: الحواريون يصرحون بالإيمان بالله ورسوله ويطلبون الشهادة كمسلمين مؤسسةً الجماعة المسيحية المبكرة كمؤمنين مستسلمين",
  "In 5:111: When I inspired to the disciples believe in Me and My messenger they said we have believed so bear witness that we are Muslims.",
  [{ key: "5:111", excerpt: fv(111), evidenceClass: "EXPLICIT_TEXT", rationale: "Waith awhaytu ila alhawariyyeena an aminoo bee wabirasoolee: divine inspiration directed to disciples specifically. Qaloo amanna waishhad biannana muslimoona: immediate faith confession with explicit Muslim self-identification. Ishhad (bear witness) implies public declaration not private belief. Muslimoona (submitting ones) connects disciples to Abrahamic submission tradition predating Muhammad." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept", note: "Explicit Quranic designation of Isa's followers as Muslims" }],
  "Overlap with isa-story. Muslim self-designation by disciples collapses temporal distinction between Isa-community and Muhammad-community. Divine inspiration (awhaytu) preceding confession shows faith originates from divine initiative. Witness-request (ishhad) parallels Christian believer-confession scenes (5:83-84) creating thematic continuity. Positioned immediately after miracle-enumeration suggesting miracles served to produce faith-submission not mere wonder."
));

// cand-0263: Ma'idah supplication and unique punishment
candidates.candidates.push(makeCand("cand-0263",
  "Ma'idah supplication model: Isa teaches proper prayer etiquette addressing Allah as Rabbana requesting table as eid-sign; divine grant accompanied by unique punishment warning for post-sign disbelief",
  undefined, "نموذج دعوى المائدة: عيسى يعلم أدب الدعاء مخاطباً الله ربنا طالباً المائدة عيداً وآية؛ المنح الإلهي مصحوب بتحذير عقاب فريد لمن يكفر بعد الآية",
  "In 5:114-115: Isa said O Allah our Lord send down upon us table from heaven as festival for first and last of us and sign from You provide for us You are best of providers. Allah said I will send it down but whoever disbelieves after from among you I will punish with punishment I have not punished anyone in the worlds.",
  [{ key: "5:114", excerpt: fv(114), evidenceClass: "EXPLICIT_TEXT", rationale: "Qala AAeesa ibnu maryama allahumma rabbana: proper address combining divine name with lordship acknowledgment. Anzil AAalayna maidatan mina alssamai: specific request matching disciple need. Takoonu lana AAeedan liawwalina waakhirina: temporal scope encompassing entire community across generations. Waayatan minka: sign-request subordinating feast to evidentiary purpose. Waorzuqna waanta khayru alrraziqeena: provision-request acknowledging divine supremacy in sustenance." },
   { key: "5:115", excerpt: fv(115), evidenceClass: "EXPLICIT_TEXT", rationale: "Qala Allahu innee munazziluha AAalaykum: affirmative divine response. Faman yakfur baAAdu minkum: conditional warning targeting post-sign disbelief specifically. Fainnee oAAaththibuhu AAathaban la oAAaththibuhu ahadan mina alAAalameena: unique punishment exceeding all worldly precedents establishing heightened accountability for direct miracle-witnesses." }],
  [{ topicId: "supplication", layer: "curated", relationship: "related-not-identical", note: "Model supplication demonstrating proper prayer structure and etiquette" }],
  "Overlap with supplication. Isa's prayer models five elements: proper address (Allahumma Rabbana) specific request (maidah) communal scope (first-last) sign-intention (ayah) and provider-acknowledgment (Khayr al-Raziqeen). Eid designation suggests recurring commemoration not one-time event. Unique-punishment clause establishes principle that greater evidence entails greater accountability. Post-sign disbelief specified (baAAdu) distinguishing from pre-evidence skepticism."
));

// cand-0264: Isa's eschatological tawheed testimony
candidates.candidates.push(makeCand("cand-0264",
  "Isa's eschatological tawheed testimony: denies commanding worship of self or mother; affirms exclusive message was worship Allah my Lord your Lord; asymmetric knowledge proves creaturely status",
  undefined, "شهادة عيسى التوحيدية الأخروية: ينفي الأمر بعبادة نفسه أو أمه؛ يؤكد أن رسالته الوحيدة كانت اعبدوا الله ربي وربكم؛ المعرفة غير المتماثلة تثبت مكانته المخلوقة",
  "In 5:116-117: Allah said O Jesus did you say to people take me and my mother as deities besides Allah? He said Exalted are You! Not for me to say what I have no right. If I had said it You would have known. You know what is in myself I do not know what is in Yourself. You are Knower of unseen. I said only what You commanded: worship Allah my Lord and your Lord.",
  [{ key: "5:116", excerpt: fv(116), evidenceClass: "EXPLICIT_TEXT", rationale: "Aanta qulta lilnnasi ittakhithoonee waommiya ilahayni min dooni Allahi: divine interrogation specifying exact allegation (self + mother as deities). Qala subhanaka: exaltation-response as immediate denial. Ma yakoonu lee an aqoola ma laysa lee bihaqqin: rights-based denial framing unauthorized speech as impossible not merely untrue. In kuntu qultuhu faqad AAalimtahu: hypothetical concession proving divine omniscience would have detected any such claim. TaAAlamu ma fee nafsee wala aAAlamu ma fee nafsika: asymmetric knowledge establishing ontological hierarchy. Innaka anta AAallamu alghuyoobi: unseen-knowledge attribution confirming divine exclusivity." },
   { key: "5:117", excerpt: fv(117), evidenceClass: "EXPLICIT_TEXT", rationale: "Ma qultu lahum illa ma amartanee bihi: message limited to divine command excluding personal initiative. Ani oAAbudoo Allaha rabbee warabbakum: tawheed formula identical to 5:72 creating cross-passage consistency. Wakuntu AAalayhim shaheedan ma dumtu feehim: temporary witness role bounded by earthly presence. Falamma tawaffaytanee kunta anta alrraqeeba AAalayhim: divine Watcher succession after prophetic departure. Waanta AAala kulli shayin shaheedun: universal witness scope transcending temporal limitation." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept", note: "Definitive eschatological refutation of Isa-divinization through Isa's own testimony" },
   { topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Pure tawheed articulation through prophetic self-testimony" }],
  "Overlap with isa-story and tawheed. Three-part denial structure (subhanaka + ma yakoonu lee + in kuntu qultuhu) provides comprehensive refutation template applicable to any unauthorized religious claim. Asymmetric-knowledge argument operates at ontological level: creator knows creation fully but not vice versa. Rabbee warabbakum formula (my Lord your Lord) eliminates hierarchical distinction between prophet and community. Raqeeb-shaheed transition clarifies prophetic temporality preventing post-departure authority inflation."
));

// cand-0265: Truthfulness day and mutual pleasure
candidates.candidates.push(makeCand("cand-0265",
  "Truthfulness day: sidq benefits sadiqeen on Judgment Day; reward is eternal gardens with rivers; mutual divine-human pleasure (radiya Allahu AAanhum waradoo AAanhu) as peak salvation state",
  undefined, "يوم الصدق: الصدق ينفع الصادقين يوم القيامة؛ الجزاء جنات تجري من تحتها الأنهار خالدين؛ الرضا المتبادل بين الله وعباده كأعلى حالة خلاص",
  "In 5:119: Allah said this is the Day when truthfulness benefits the truthful. For them are gardens beneath which rivers flow abiding forever. Allah is pleased with them and they with Him. That is the great attainment.",
  [{ key: "5:119", excerpt: fv(119), evidenceClass: "EXPLICIT_TEXT", rationale: "Hatha yawmu yanfaAAu alssadiqeena sidquhum: truthfulness (sidq) as salvific currency on Judgment Day. Lahum jannatun tajree min tahtiha alanharu: garden-river imagery as standard Paradise description. Khalideena feeha abadan: double-eternity emphasis (khalideena + abadan). Radiya Allahu AAanhum waradoo AAanhu: mutual pleasure formula representing reciprocal satisfaction beyond transactional reward. Thalika alfawzu alAAatheemu: great-attainment designation marking this as ultimate success." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical", note: "Judgment Day reward specification emphasizing truthfulness as qualifying virtue" },
   { topicId: "the-hereafter", layer: "curated", relationship: "related-not-identical", note: "Paradise description with mutual-pleasure dimension" }],
  "Overlap with day-of-judgment and the-hereafter. Sidq (truthfulness) as qualifying virtue connects to Isa's preceding testimony establishing thematic coherence. Mutual-pleasure formula transcends master-servant transactional paradigm suggesting relational fulfillment as Paradise essence. Double-eternity emphasis prevents any temporal limitation interpretation. Fawz azim (great attainment) echoes surah-opening success themes completing literary structure. Positioned after Isa's servant-status acknowledgment showing that servanthood leads to mutual pleasure not diminishment."
));

// cand-0266: Absolute divine dominion closure
candidates.candidates.push(makeCand("cand-0266",
  "Absolute divine dominion: surah closes declaring Allah's ownership of heavens earth and all within; He is over all things Capable (Qadeer) as final theological statement",
  undefined, "السيادة الإلهية المطلقة: السورة تختتم بإعلان ملك الله للسماوات والأرض وما فيهن؛ وهو على كل شيء قدير كبيان لاهوتي ختامي",
  "In 5:120: To Allah belongs dominion of the heavens and the earth and whatever is within them. And He is over all things Capable.",
  [{ key: "5:120", excerpt: fv(120), evidenceClass: "EXPLICIT_TEXT", rationale: "Lillahi mulku alssamawati waalardi wama feehinna: comprehensive dominion claim encompassing all creation. Wahuwa AAala kulli shayin qadeerun: capability declaration as surah-final statement affirming divine omnipotence. Position as closing verse gives it structural weight as theological summary of entire surah." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "same-concept", note: "Closing declaration of absolute divine dominion and capability" },
   { topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Tawheed affirmation through exclusive dominion-capability declaration" }],
  "Overlap with divine-power and tawheed. Surah-closure position gives verse programmatic significance summarizing all preceding legislation narrative and theology under divine sovereignty. Muluk (dominion) encompasses ownership authority and governance. Qadeer (Capable) as final attribute affirms nothing lies beyond divine power including judgment mercy and creation. Structural parallel with surah-opening covenant themes completing ring composition. Functions as theological anchor preventing any preceding content from being read independently of divine sovereignty."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-026.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-026.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 3 (ext-005-p12 through ext-005-p14)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0257 through cand-${String(256 + candidates.candidates.length).padStart(4,'0')})`);
