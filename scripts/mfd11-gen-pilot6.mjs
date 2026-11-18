// MFD-11 Pilot 6 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Baqarah 2:87-103 (Passages 15-17, Candidates cand-0057..cand-0066).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "002-0087-0103.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 2:${n} not found`);
  return verses[n];
}

// Full verse helper
function fv(n) { return v(n); }

console.log("Generating pilot 6 files from verbatim corpus (2:87-103)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

// ─── Passage 15: 2:87–91 ────────────────────────────────────────────────────────
const p15 = {
  extractionId: "ext-002-p15",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 87, toAyah: 91, label: "Al-Baqarah — messengers after Musa; Isa with clear proofs and Holy Spirit support; rejection pattern driven by arrogance and envy; curse upon disbelievers" },
  verseKeys: ["2:87","2:88","2:89","2:90","2:91"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `2:${i+87}`, text: fv(i+87) })),
  mainSubject: {
    label: "Allah gave Musa the Book and followed him with messengers; gave Isa ibn Maryam clear proofs and supported him with Ruh al-Qudus; yet whenever a messenger came with what their souls did not desire they were arrogant, denying some and killing others; hearts wrapped claim rebutted as Allah cursed them for disbelief; when Book confirming what was with them arrived they disbelieved despite prior recognition; wretched exchange selling themselves to disbelieve out of outrage at Allah's favor; wrath upon wrath and humiliating punishment for disbelievers; selective belief claiming faith only in what was sent to them while rejecting what came after despite it being truth confirming what is with them; challenge: why kill prophets before if truly believers",
    keys: ["2:87","2:88","2:89","2:90","2:91"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Giving Musa the Kitab and following with messengers", keys: ["2:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Giving Isa ibn Maryam bayyinat and supporting with Ruh al-Qudus", keys: ["2:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Arrogance (istakbartum) when messenger brings undesired message", keys: ["2:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pattern: denying a party of messengers and killing another party", keys: ["2:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Claim 'our hearts are wrapped' (ghulf) refuted as curse for kufr", keys: ["2:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Little they believe due to divine curse", keys: ["2:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Book from Allah confirming what was with them arriving", keys: ["2:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Previously praying for victory against disbelievers using expected prophet", keys: ["2:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "When recognized truth arrived they disbelieved in it", keys: ["2:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Curse of Allah upon the kafireen", keys: ["2:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wretched exchange: selling selves to disbelieve in what Allah revealed", keys: ["2:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Outrage (baghyan) that Allah sends favor on whom He wills", keys: ["2:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Returning with wrath upon wrath", keys: ["2:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Humiliating punishment for disbelievers", keys: ["2:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Selective belief: believing only in what was revealed to us", keys: ["2:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelieving in what came after despite it being truth confirming what is with them", keys: ["2:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge: why kill prophets of Allah before if believers", keys: ["2:91"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Musa receiving Kitab and succession of messengers after him", keys: ["2:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa ibn Maryam given bayyinat and supported by Ruh al-Qudus", keys: ["2:87"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Arrogance (istikbar) as root cause of rejecting messengers", keys: ["2:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-deception: claiming hearts are wrapped to excuse disbelief", keys: ["2:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Envy-driven disbelief: rejecting revelation because Allah favored another", keys: ["2:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Selective faith: accepting old revelation while rejecting new confirmation", keys: ["2:91"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0057","cand-0058","cand-0059"],
  notes: "Pass A pilot 6, passage 15/3. Establishes pattern of Bani Israel rejecting successive messengers despite prior expectation. Introduces Ruh al-Qudus supporting Isa. Key concept: baghy (envy/outrage) as motive for disbelief.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:25:00.000Z"
};

// Extract divine names from P15
{
  // Allah from 2:87
  const t87 = fv(87);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u0650", "\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t87.indexOf(form);
    if (idx >= 0) {
      p15.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:87"] });
      break;
    }
  }

  // Ruh al-Qudus from 2:87 - رُوحِ ٱلۡقُدُسِ
  const ruhIdx = t87.indexOf("\u0631\u064f\u0648\u062d\u0650 \u0671\u0644\u0652\u0642\u064f\u062f\u064f\u0633\u0650");
  if (ruhIdx >= 0) {
    p15.divineNamesAndAttributes.push({ term: t87.slice(ruhIdx, ruhIdx + 13), transliteration: "Ruh al-Qudus", gloss: "the Pure/Holy Spirit (editorial gloss)", keys: ["2:87"] });
  }
}

// Extract terminology from P15
{
  // Bayyinat from 2:87 - ٱلۡبَيِّنَٰتِ
  const t87 = fv(87);
  const bayyinatIdx = t87.indexOf("\u0671\u0644\u0652\u0628\u064e\u064a\u0651\u0650\u0646\u064e\u0627\u062a\u0650");
  if (bayyinatIdx >= 0) {
    p15.terminology.push({ term: t87.slice(bayyinatIdx, bayyinatIdx + 10), transliteration: "al-bayyinat", gloss: "clear proofs/signs (editorial gloss)", keys: ["2:87"] });
  }

  // Ghulf from 2:88 - غُلۡفُۢ
  const t88 = fv(88);
  const ghulfIdx = t88.indexOf("\u063a\u064f\u0644\u0652\u0641\u064c\u06e2");
  if (ghulfIdx >= 0) {
    p15.terminology.push({ term: t88.slice(ghulfIdx, ghulfIdx + 5), transliteration: "ghulf", gloss: "wrapped/covered (hearts) (editorial gloss)", keys: ["2:88"] });
  }

  // Musaddiq from 2:89 - مُصَدِّقٞ
  const t89 = fv(89);
  const musaddiqIdx = t89.indexOf("\u0645\u064f\u0635\u064e\u062f\u0651\u0650\u0642\u064c");
  if (musaddiqIdx >= 0) {
    p15.terminology.push({ term: t89.slice(musaddiqIdx, musaddiqIdx + 7), transliteration: "musaddiq", gloss: "confirming (editorial gloss)", keys: ["2:89"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p15.json"), JSON.stringify(p15, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p15.json");

// ─── Passage 16: 2:92–96 ────────────────────────────────────────────────────────
const p16 = {
  extractionId: "ext-002-p16",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 92, toAyah: 96, label: "Al-Baqarah — clear proofs from Musa yet calf worship; covenant at Mount raised above them; hearing but disobeying; hearts absorbed calf love through kufr; challenge to wish for death if Hereafter is exclusive claim; greed for life exceeding even mushrikeen" },
  verseKeys: ["2:92","2:93","2:94","2:95","2:96"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `2:${i+92}`, text: fv(i+92) })),
  mainSubject: {
    label: "Musa brought clear proofs yet Bani Israel took the calf in worship after him as wrongdoers; covenant taken and Mount raised above them commanding to take what was given with strength and listen; they said 'we hear and disobey'; hearts absorbed calf worship through disbelief; challenge to wish for death if exclusive claim to Hereafter is true; they will never wish it due to what hands sent forth; Allah knowing wrongdoers; found most greedy for life even more than those who associate partners; one wishes to live thousand years but longevity would not remove him from punishment; Allah seeing what they do",
    keys: ["2:92","2:93","2:94","2:95","2:96"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Musa bringing bayyinat to Bani Israel", keys: ["2:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taking the calf in worship after Musa as thalimoon", keys: ["2:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taking covenant and raising at-Tur above them", keys: ["2:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: take what We gave you with quwwah and listen", keys: ["2:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Response: samiAAana wa-AAasayna (we hear and disobey)", keys: ["2:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hearts absorbed (ushriboo) calf love through kufr", keys: ["2:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge: wish for death if Hereafter is exclusively yours", keys: ["2:94"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "They will never wish it due to what hands put forth", keys: ["2:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah aleem of the thalimeen", keys: ["2:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Most greedy for life (ahrasa al-nasi AAala hayat)", keys: ["2:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Even more greedy than mushrikeen", keys: ["2:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wishing for thousand-year lifespan", keys: ["2:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Longevity cannot remove from punishment", keys: ["2:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah baseer of what they do", keys: ["2:96"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  humanConditionsAndSpiritualStates: [
    { label: "Verbal compliance with inner disobedience: samiAAana wa-AAasayna", keys: ["2:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hearts absorbing false worship through disbelief", keys: ["2:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear of death exposing insincerity of exclusive salvation claims", keys: ["2:94","2:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Extreme attachment to worldly life exceeding even polytheists", keys: ["2:96"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Covenant relationship at Sinai with mountain raised as sign", keys: ["2:93"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0060","cand-0061"],
  notes: "Pass A pilot 6, passage 16/3. Contains unique phrase 'samiAAana wa-AAasayna' and concept of hearts absorbing idolatry. Death-wish challenge as test of sincerity. Greed-for-life diagnosis.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:25:00.000Z"
};

// Extract commands from P16
{
  // 2:93 - command: خُذُواْ مَآ ءَاتَيۡنَٰكُم بِقُوَّةٖ وَٱسۡمَعُواْ
  const t93 = fv(93);
  const khuthooIdx = t93.indexOf("\u062e\u064f\u0630\u064f\u0648\u0627\u0652");
  if (khuthooIdx >= 0) {
    const waismaAAooIdx = t93.indexOf("\u0648\u064e\u0671\u0633\u0652\u0645\u064e\u0639\u064f\u0648\u0627\u0652", khuthooIdx);
    if (waismaAAooIdx >= 0) {
      const cmdText = t93.slice(khuthooIdx, waismaAAooIdx + 9).trim();
      p16.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:93"], excerpt: cmdText, description: "Command: take what We gave you with determination and listen." });
    }
  }
}

// Extract divine names from P16
{
  // Allah from 2:93
  const t93 = fv(93);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u0650", "\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t93.indexOf(form);
    if (idx >= 0) {
      p16.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:93"] });
      break;
    }
  }
}

// Extract terminology from P16
{
  // Meethaq from 2:93 - مِيثَٰقَكُمۡ
  const t93 = fv(93);
  const meethaqIdx = t93.indexOf("\u0645\u0650\u064a\u062b\u064e\u0627\u0642\u064e\u0643\u064f\u0645\u0652");
  if (meethaqIdx >= 0) {
    p16.terminology.push({ term: t93.slice(meethaqIdx, meethaqIdx + 9), transliteration: "meethaqakum", gloss: "your covenant (editorial gloss)", keys: ["2:93"] });
  }

  // At-Tur from 2:93 - ٱلطُّورَ
  const turIdx = t93.indexOf("\u0671\u0644\u0637\u064f\u0651\u0648\u0631\u064e");
  if (turIdx >= 0) {
    p16.terminology.push({ term: t93.slice(turIdx, turIdx + 6), transliteration: "at-Tur", gloss: "the Mount (Sinai) (editorial gloss)", keys: ["2:93"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p16.json"), JSON.stringify(p16, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p16.json");

// ─── Passage 17: 2:97–103 ────────────────────────────────────────────────────────
const p17 = {
  extractionId: "ext-002-p17",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 97, toAyah: 103, label: "Al-Baqarah — Jibril bringing Quran confirming previous scripture; enmity toward Jibril/Angels/Messengers means Allah is enemy; clear ayat denied only by fasiqoon; covenant-breaking pattern; throwing Scripture behind backs; following devil-recited magic over Sulayman's kingdom; Harut and Marut trial; learning separation magic; better reward for faith and taqwa" },
  verseKeys: ["2:97","2:98","2:99","2:100","2:101","2:102","2:103"],
  arabicExcerpts: Array.from({length:7}, (_,i) => ({ key: `2:${i+97}`, text: fv(i+97) })),
  mainSubject: {
    label: "Jibril bringing down Quran upon Prophet's heart by Allah's permission confirming previous scripture as guidance and glad tidings for believers; whoever is enemy of Allah, angels, messengers, Jibril, and Mikal has Allah as enemy to disbelievers; clear ayat revealed denied only by fasiqoon; every time they made covenant a party threw it away with most not believing; when messenger confirming what was with them came, party of People of Book threw Allah's Book behind backs as if ignorant; followed what devils recited during Sulayman's reign though Sulayman did not disbelieve but devils taught magic including what was sent down to Harut and Marut at Babylon who warned they were fitnah; learned separation magic harming only by Allah's permission; knew purchaser of magic has no share in Hereafter; wretched exchange; had they believed and feared Allah reward would be better",
    keys: ["2:97","2:98","2:99","2:100","2:101","2:102","2:103"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Jibril nazzala Quran on qalbika by idhn Allah", keys: ["2:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Quran musaddiq lima bayna yadayhi (confirming previous scripture)", keys: ["2:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hudan wa bushra lil-mumineen", keys: ["2:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enemy of Jibril = enemy of Allah's revelation mechanism", keys: ["2:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enemy of Allah, malaikatihi, rusulihi, Jibril, Mikal: Allah is enemy to kafireen", keys: ["2:98"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ayatin bayyinatin revealed; none deny except fasiqoon", keys: ["2:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Every covenant broken by a party; most do not believe", keys: ["2:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger confirming what was with them arriving", keys: ["2:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Party of People of Book throwing Allah's Book behind backs", keys: ["2:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Acting as if they do not know", keys: ["2:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Following what shayateen recite during Sulayman's mulk", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sulayman did not disbelieve; shayateen disbelieved teaching sihr", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "What was sent down to malakayn at Babil: Harut and Marut", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Angels' warning: we are fitnah so do not disbelieve", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Learning separation between man and wife magic", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Magic harms only by idhn Allah", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Learning what harms and does not benefit", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Knowing purchaser of magic has no khalaq in Hereafter", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wretched exchange of selves for magic", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Had they believed and had taqwa: mathoobatun min AAind Allah khayr", keys: ["2:103"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  humanConditionsAndSpiritualStates: [
    { label: "Fisq (defiant disobedience) as condition for denying clear ayat", keys: ["2:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Chronic covenant-breaking as communal trait", keys: ["2:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Willful ignorance: throwing scripture behind backs as if unknowing", keys: ["2:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Choosing harmful knowledge over beneficial guidance", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Awareness without action: knowing consequences yet purchasing magic anyway", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Magic as social harm: causing marital separation", keys: ["2:102"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Divine enmity declared against those hostile to Allah's messengers and angels", keys: ["2:98"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0062","cand-0063","cand-0064","cand-0065","cand-0066"],
  notes: "Pass A pilot 6, passage 17/3. Central passage for Jibril's role in revelation, abrogation context (musaddiq), magic narrative with Harut/Marut, and Sulayman exoneration. Longest single verse (2:102) in this range.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:25:00.000Z"
};

// Extract divine names from P17
{
  // Allah from 2:97
  const t97 = fv(97);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u0650", "\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t97.indexOf(form);
    if (idx >= 0) {
      p17.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:97"] });
      break;
    }
  }

  // Jibreel from 2:97 - جِبۡرِيلَ
  const jibreelIdx = t97.indexOf("\u062c\u0650\u0628\u0652\u0631\u0650\u064a\u0644\u064e");
  if (jibreelIdx >= 0) {
    p17.divineNamesAndAttributes.push({ term: t97.slice(jibreelIdx, jibreelIdx + 7), transliteration: "Jibreel", gloss: "Gabriel (editorial gloss)", keys: ["2:97"] });
  }

  // Mikaal from 2:98 - مِيكَىٰلَ
  const t98 = fv(98);
  const mikaalIdx = t98.indexOf("\u0645\u0650\u064a\u0643\u064e\u0649\u0670\u0644\u064e");
  if (mikaalIdx >= 0) {
    p17.divineNamesAndAttributes.push({ term: t98.slice(mikaalIdx, mikaalIdx + 7), transliteration: "Mikaal", gloss: "Michael (editorial gloss)", keys: ["2:98"] });
  }
}

// Extract terminology from P17
{
  // Musaddiq from 2:97 - مُصَدِّقٗا
  const t97 = fv(97);
  const musaddiqIdx = t97.indexOf("\u0645\u064f\u0635\u064e\u062f\u0651\u0650\u0642\u064b\u0627");
  if (musaddiqIdx >= 0) {
    p17.terminology.push({ term: t97.slice(musaddiqIdx, musaddiqIdx + 8), transliteration: "musaddiqan", gloss: "confirming (editorial gloss)", keys: ["2:97"] });
  }

  // Fasiqoon from 2:99 - ٱلۡفَٰسِقُونَ
  const t99 = fv(99);
  const fasiqoonIdx = t99.indexOf("\u0671\u0644\u0652\u0641\u064e\u0627\u0633\u0650\u0642\u064f\u0648\u0646\u064e");
  if (fasiqoonIdx >= 0) {
    p17.terminology.push({ term: t99.slice(fasiqoonIdx, fasiqoonIdx + 9), transliteration: "al-fasiqoon", gloss: "the defiantly disobedient (editorial gloss)", keys: ["2:99"] });
  }

  // Sihr from 2:102 - ٱلسِّحۡرَ
  const t102 = fv(102);
  const sihrIdx = t102.indexOf("\u0671\u0644\u0633\u0651\u0650\u062d\u0652\u0631\u064e");
  if (sihrIdx >= 0) {
    p17.terminology.push({ term: t102.slice(sihrIdx, sihrIdx + 7), transliteration: "as-sihr", gloss: "magic/sorcery (editorial gloss)", keys: ["2:102"] });
  }

  // Fitnah from 2:102 - فِتۡنَةٞ
  const fitnahIdx = t102.indexOf("\u0641\u0650\u062a\u0652\u0646\u064e\u0629\u064c");
  if (fitnahIdx >= 0) {
    p17.terminology.push({ term: t102.slice(fitnahIdx, fitnahIdx + 6), transliteration: "fitnah", gloss: "trial/test (editorial gloss)", keys: ["2:102"] });
  }

  // Mathoobatun from 2:103 - مَثُوبَةٞ
  const t103 = fv(103);
  const mathoobaIdx = t103.indexOf("\u0644\u064e\u0645\u064e\u062b\u064f\u0648\u0628\u064e\u0629\u064c");
  if (mathoobaIdx >= 0) {
    p17.terminology.push({ term: t103.slice(mathoobaIdx, mathoobaIdx + 7), transliteration: "mathoobatun", gloss: "reward/recompense (editorial gloss)", keys: ["2:103"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p17.json"), JSON.stringify(p17, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p17.json");

// ─── Candidates batch (cand-0057 through cand-0066) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: "2026-11-18T16:25:00.000Z",
  sourceExtraction: "ext-002-p15,ext-002-p16,ext-002-p17",
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
    createdAt: "2026-11-18T16:25:00.000Z"
  };
  if (arabicLabel) c.arabicLabel = arabicLabel;
  if (urduLabel) c.urduLabel = urduLabel;
  if (notes) c.notes = notes;
  return c;
}

// cand-0057: Envy-driven rejection of divine favor upon others
candidates.candidates.push(makeCand("cand-0057",
  "Envy-driven disbelief: rejecting revelation because Allah bestowed favor on another",
  undefined, "\u062d\u0633\u062f \u06a9\u06cc \u0648\u062c\u06c1 \u0633\u06d2 \u0627\u0646\u06a9\u0627\u0631",
  "In 2:90: Bani Israel sold themselves wretchedly by disbelieving in what Allah revealed out of baghy (outrage/envy) that Allah sends His favor upon whom He wills from among His servants — establishing envy as theological motive for kufr.",
  [{ key: "2:90", excerpt: fv(90), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse identifies baghy as motive for disbelieving in Allah's revelation." }],
  [{ topicId: "envy-hasad", layer: "scholarly", relationship: "same-concept" }],
  "Direct link to envy-hasad topic. Distinguishes envy-driven kufr from intellectual disagreement."
));

// cand-0058: Isa ibn Maryam's bayyinat and Ruh al-Qudus support
candidates.candidates.push(makeCand("cand-0058",
  "Isa ibn Maryam: clear proofs and Holy Spirit support as prophetic credentials",
  undefined, "\u0639\u06cc\u0633\u06cc\u0670 \u0627\u0628\u0646 \u0645\u0631\u06cc\u0645 \u06a9\u06d2 \u0645\u0639\u062c\u0632\u0627\u062a \u0627\u0648\u0631 \u0631\u0648\u062d \u0627\u0644\u0642\u062f\u0633 \u06a9\u06cc \u062a\u0627\u06cc\u06cc\u062f",
  "In 2:87: Allah gave Isa ibn Maryam al-bayyinat and supported him with Ruh al-Qudus — establishing his prophetic credentials parallel to Musa receiving the Kitab.",
  [{ key: "2:87", excerpt: fv(87), evidenceClass: "EXPLICIT_TEXT", rationale: "Verse explicitly names Isa's bayyinat and Ruh al-Qudus support." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept" }],
  "Core Isa narrative verse. Ruh al-Qudus identification key for angelology."
));

// cand-0059: Pattern of denying and killing prophets
candidates.candidates.push(makeCand("cand-0059",
  "Systematic rejection pattern: denying some prophets and killing others",
  undefined, "\u0628\u0639\u0636 \u0627\u0646\u0628\u06cc\u0627\u0621 \u06a9\u0627 \u0627\u0646\u06a9\u0627\u0631 \u0627\u0648\u0631 \u0628\u0639\u0636 \u06a9\u0627 \u0642\u062a\u0644",
  "In 2:87 and 2:91: whenever a messenger came with undesired message, Bani Israel were arrogant — denying a party (fareeqan kaththabtum) and killing another party (fareeqan taqtuloona); challenged to explain why they killed prophets before if truly believers.",
  [{ key: "2:87", excerpt: fv(87), evidenceClass: "EXPLICIT_TEXT", rationale: "Describes dual rejection pattern: denial and killing." },
   { key: "2:91", excerpt: fv(91), evidenceClass: "EXPLICIT_TEXT", rationale: "Rhetorical challenge about killing prophets despite professed belief." }],
  [],
  "Gap candidate: systematic prophetic rejection as historical pattern distinct from individual incidents."
));

// cand-0060: Hearing but disobeying — verbal compliance with inner rebellion
candidates.candidates.push(makeCand("cand-0060",
  "Verbal compliance masking disobedience: samiAAana wa-AAasayna",
  undefined, "\u0632\u0628\u0627\u0646\u06cc \u0627\u0637\u0627\u0639\u062a \u0645\u06af\u0631 \u062f\u0644\u06cc \u0646\u0627\u0641\u0631\u0645\u0627\u0646\u06cc",
  "In 2:93: when commanded to take scripture with determination and listen, Bani Israel responded 'samiAAana wa-AAasayna' (we hear and disobey) — and their hearts absorbed calf worship through disbelief.",
  [{ key: "2:93", excerpt: fv(93), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse contains the exact phrase and describes heart absorption of idolatry." }],
  [],
  "Gap candidate: specific linguistic formula of hypocritical compliance unique to this verse."
));

// cand-0061: Extreme greed for worldly life exceeding polytheists
candidates.candidates.push(makeCand("cand-0061",
  "Greed for life exceeding even polytheists: wishing thousand-year lifespan",
  undefined, "\u062d\u06cc\u0627\u062a \u06a9\u06cc \u062d\u0631\u0635 \u062c\u0648 \u0645\u0634\u0631\u06a9\u06cc\u0646 \u0633\u06d2 \u0628\u06be\u06cc \u0632\u06cc\u0627\u062f\u06c1 \u06c1\u06d2",
  "In 2:96: Bani Israel found most greedy for life (ahrasa al-nasi AAala hayat), even more than mushrikeen; one wishes to live a thousand years but longevity cannot remove him from punishment.",
  [{ key: "2:96", excerpt: fv(96), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse diagnoses extreme life-greed and its futility." }],
  [],
  "Gap candidate: comparative diagnosis of material attachment across communities."
));

// cand-0062: Jibril as revelation agent confirming previous scripture
candidates.candidates.push(makeCand("cand-0062",
  "Jibril's role: bringing Quran to Prophet's heart confirming previous scripture",
  undefined, "\u062c\u0628\u0631\u0627\u0626\u06cc\u0644 \u06a9\u0627 \u0648\u062d\u06cc \u0644\u0627\u0646\u06d2 \u06a9\u0627 \u06a9\u0631\u062f\u0627\u0631",
  "In 2:97: Jibril brought down the Quran upon the Prophet's heart by Allah's permission, confirming (musaddiqan) what was before it, as guidance and glad tidings for believers.",
  [{ key: "2:97", excerpt: fv(97), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes Jibril's revelatory function and confirmation role." }],
  [{ topicId: "jibril-michael", layer: "scholarly", relationship: "same-concept" },
   { topicId: "quran-preservation", layer: "scholarly", relationship: "related-not-identical" }],
  "Primary Jibril-revelation verse. Links to both angelology and Quranic confirmation themes."
));

// cand-0063: Divine enmity toward enemies of Allah's messengers and angels
candidates.candidates.push(makeCand("cand-0063",
  "Divine enmity declared against those hostile to Allah, angels, and messengers",
  undefined, "\u0627\u0644\u0644\u06c1 \u06a9\u06d2 \u062f\u0648\u0634\u0645\u0646\u0648\u06ba \u0633\u06d2 \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u062f\u0634\u0645\u0646\u06cc",
  "In 2:98: whoever is enemy of Allah, His angels, His messengers, Jibril, and Mikal — then Allah is enemy to the disbelievers.",
  [{ key: "2:98", excerpt: fv(98), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse declares reciprocal divine enmity." }],
  [{ topicId: "jibril-michael", layer: "scholarly", relationship: "same-concept" }],
  "Key verse for understanding hostility toward revelation agents as equivalent to hostility toward Allah."
));

// cand-0064: Chronic covenant-breaking as communal trait
candidates.candidates.push(makeCand("cand-0064",
  "Chronic covenant-breaking: every covenant thrown away by a party",
  undefined, "\u0639\u06c1\u062f \u0634\u06a9\u0646\u06cc \u06a9\u06cc \u0645\u0633\u062a\u0642\u0644 \u0639\u0627\u062f\u062a",
  "In 2:100: every time they made a covenant (AAahadoo AAahdan), a party threw it away (nabathahu); most of them do not believe.",
  [{ key: "2:100", excerpt: fv(100), evidenceClass: "EXPLICIT_TEXT", rationale: "Verse describes recurring pattern of covenant violation." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "same-concept" }],
  "Establishes covenant-breaking as habitual rather than incidental."
));

// cand-0065: Magic narrative — Sulayman exonerated, devils taught sihr
candidates.candidates.push(makeCand("cand-0065",
  "Magic (sihr) narrative: Sulayman exonerated, devils and Harut-Marut trial",
  undefined, "\u062c\u0627\u062f\u0648 \u06a9\u0627 \u0628\u06cc\u0627\u0646: \u0633\u0644\u06cc\u0645\u0627\u0646 \u06a9\u06cc \u0628\u0631\u0627\u062a \u0627\u0648\u0631 \u06c1\u0627\u0631\u0648\u062a \u0645\u0627\u0631\u0648\u062a \u06a9\u0627 \u0622\u0632\u0645\u0627\u0626\u0634",
  "In 2:102: Bani Israel followed what devils recited during Sulayman's reign; Sulayman did not disbelieve but devils taught sihr including what was sent to Harut and Marut at Babylon who warned they were fitnah; people learned separation magic harming only by Allah's permission; knew purchaser has no Hereafter share.",
  [{ key: "2:102", excerpt: fv(102), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse narrates magic origin, Sulayman's innocence, angelic warning, and consequences." }],
  [],
  "Gap candidate: comprehensive magic theology distinguishing divine trial from demonic deception. Exonerates Sulayman explicitly."
));

// cand-0066: Throwing Allah's Book behind backs as willful ignorance
candidates.candidates.push(makeCand("cand-0066",
  "Throwing scripture behind backs: willful ignorance of known revelation",
  undefined, "\u06a9\u062a\u0627\u0628 \u0627\u0644\u0644\u06c1 \u06a9\u0648 \u067e\u0634\u062a \u067e\u0627\u0646\u06a9\u06be \u067e\u06be\u06cc\u0646\u06a9\u0646\u0627",
  "In 2:101: when messenger confirming what was with them came, a party of People of Book threw Allah's Book behind their backs (waraa thuhoorihim) as if they did not know.",
  [{ key: "2:101", excerpt: fv(101), evidenceClass: "EXPLICIT_TEXT", rationale: "Verse describes deliberate dismissal of known scripture using physical metaphor." }],
  [],
  "Gap candidate: vivid metaphor for willful scriptural neglect distinct from tahreef (distortion)."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-006.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-006.json with ${candidates.candidates.length} candidates`);

console.log("\nDone. Run validator to confirm.");
