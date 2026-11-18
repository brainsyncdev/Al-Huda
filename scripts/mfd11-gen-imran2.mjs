// MFD-11 Imran Pass 2 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Ali 'Imran 3:36-70 (Passages 5-8, Candidates cand-0137..cand-0146).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "003-0036-0070.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 3:${n} not found in corpus (id=${n})`);
  return verses[n];
}

// Full verse helper
function fv(n) { return v(n); }

console.log("Generating Imran Pass 2 files from verbatim corpus (3:36-70)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T17:45:00.000Z";

// ─── Passage 5: 3:36–41 ────────────────────────────────────────────────────────
const p5 = {
  extractionId: "ext-003-p5",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 36, toAyah: 41, label: "Ali 'Imran — Birth of Maryam; wife of Imran delivered female; Allah knows best what she delivered; male not like female; named her Maryam; sought refuge for her and offspring from Shaytan Rajim; Lord accepted her with good acceptance; caused her to grow well; put her in care of Zakariyya; whenever he entered mihrab found provision; said O Maryam where is this from; said it is from Allah; Allah provides whom He wills without account; thereupon Zakariyya called his Lord; grant me good offspring from Yourself; You are Hearer of supplication; angels called him while standing praying in mihrab; Allah gives glad tidings of Yahya confirming Word from Allah; sayyid, hasoor, prophet from righteous; said my Lord how can I have boy when old age reached me and wife barren; said thus Allah does what He wills; said my Lord make sign for me; said your sign you will not speak to people three days except by gesture; remember your Lord much; glorify evening and morning" },
  verseKeys: ["3:36","3:37","3:38","3:39","3:40","3:41"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `3:${i+36}`, text: fv(i+36) })),
  mainSubject: {
    label: "Birth and dedication of Maryam: mother's surprise at female child; divine knowledge surpassing human expectation; naming and seeking protection from Satan; Allah's gracious acceptance and nurturing of Maryam; Zakariyya's guardianship and discovery of miraculous provision; Maryam's attribution of provision to Allah; divine unlimited provision principle; Zakariyya's supplication for righteous offspring prompted by witnessing miracle; angelic announcement of Yahya as confirmer of divine Word, leader, abstainer, prophet; Zakariyya's astonishment at prospect of son in old age with barren wife; divine omnipotence declaration; sign of three-day speechlessness; command to abundant remembrance and glorification",
    keys: ["3:36","3:37","3:38","3:39","3:40","3:41"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Mother's realization: female child born despite expectation", keys: ["3:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine omniscience: Allah knows best what was delivered", keys: ["3:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Male not like female: divine differentiation", keys: ["3:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Naming Maryam and seeking refuge from Shaytan Rajim", keys: ["3:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gracious acceptance (qabool hasan) by her Lord", keys: ["3:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Good growth (nabatan hasanan)", keys: ["3:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Zakariyya appointed as guardian (kaffalaha)", keys: ["3:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Miraculous provision found in mihrab", keys: ["3:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Maryam attributes provision to Allah's unlimited giving", keys: ["3:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Zakariyya's supplication for tayyibah offspring", keys: ["3:38"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Samee' al-Du'a (Hearer of Supplication)", keys: ["3:38"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Angelic announcement of Yahya while praying in mihrab", keys: ["3:39"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yahya: musaddiq bi-Kalimah min Allah", keys: ["3:39"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yahya: sayyid, hasoor, nabiyy min al-salihin", keys: ["3:39"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Zakariyya's question about son in old age with barren wife", keys: ["3:40"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine response: Allah does what He wills", keys: ["3:40"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign of three-day speechlessness except by gesture", keys: ["3:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: remember Lord much, glorify evening and morning", keys: ["3:41"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Zakariyya's guardianship of Maryam and miraculous provision", keys: ["3:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Announcement of Yahya's birth to aged Zakariyya", keys: ["3:39","3:40"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Human limitation vs divine power: old age and barrenness overcome", keys: ["3:40"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplicatory hope inspired by witnessing divine generosity", keys: ["3:38"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Guardian-ward relationship: Zakariyya and Maryam", keys: ["3:37"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0137","cand-0138"],
  notes: "Pass A Imran passage 5/8. Continues from wife of Imran's vow (3:35). Establishes Maryam's unique status, Zakariyya-Yahya narrative parallel to Isa narrative. Miraculous provision prefigures Isa's miracles. Three-day silence sign parallels Isa's cradle speech.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P5
{
  // Samee' al-Du'a from 3:38
  const t38 = fv(38);
  const sdIdx = t38.indexOf("\u0633\u064e\u0645\u0650\u064a\u0639\u064f \u0671\u0644\u062f\u0651\u064f\u0639\u064e\u0627\u0621\u0650");
  if (sdIdx >= 0) {
    p5.divineNamesAndAttributes.push({ term: t38.slice(sdIdx, sdIdx + 14), transliteration: "Samee' al-Du'a", gloss: "Hearer of Supplication (editorial gloss)", keys: ["3:38"] });
  }
}

// Extract commands from P5
{
  // 3:41 - Command: remember and glorify
  p5.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:41"], excerpt: fv(41), description: "Command: remember your Lord much and glorify Him in the evening and the morning." });
}

// Extract terminology from P5
{
  // Mihrab from 3:37
  const t37 = fv(37);
  const mihrabIdx = t37.indexOf("\u0671\u0644\u0652\u0645\u0650\u062d\u0652\u0631\u064e\u0627\u0628\u064e");
  if (mihrabIdx >= 0) {
    p5.terminology.push({ term: t37.slice(mihrabIdx, mihrabIdx + 10), transliteration: "al-mihrab", gloss: "prayer chamber/sanctuary (editorial gloss)", keys: ["3:37","3:39"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p5.json"), JSON.stringify(p5, null, 2) + "\n");
console.log("Wrote 003-al-imran-p5.json");

// ─── Passage 6: 3:42–51 ────────────────────────────────────────────────────────
const p6 = {
  extractionId: "ext-003-p6",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 42, toAyah: 51, label: "Ali 'Imran — Angels said O Maryam Allah chose you purified you chose you above women of worlds; O Maryam be obedient to your Lord prostrate bow with those who bow; that is from news of unseen We reveal to you; you were not with them when cast pens who should sponsor Maryam nor when they disputed; when angels said O Maryam Allah gives glad tidings of Word from Him name Messiah Isa son of Maryam distinguished in dunya and akhirah among those brought near; speaks to people in cradle and maturity among righteous; she said my Lord how can I have child no man touched me; said thus Allah creates what He wills when decrees matter says Be and is; teaches him Book wisdom Torah Gospel; messenger to Children of Israel: I came with sign from Lord; create from clay like bird form breathe into it becomes bird by Allah's leave; heal blind leper revive dead by Allah's leave; inform what you eat store in houses; in that sign for you if believers; confirming Torah before me; make lawful some forbidden; came with sign from Lord so fear Allah obey me; indeed Allah my Lord your Lord worship Him straight path" },
  verseKeys: ["3:42","3:43","3:44","3:45","3:46","3:47","3:48","3:49","3:50","3:51"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `3:${i+42}`, text: fv(i+42) })),
  mainSubject: {
    label: "Maryam's election and purification: chosen above all women; commanded to devout obedience, prostration, and communal worship; revelation of unseen knowledge to Prophet Muhammad; pen-casting dispute over Maryam's guardianship as proof of prophetic knowledge; angelic annunciation of Isa as Kalimah from Allah, Messiah, distinguished in both worlds, among muqarrabin; Isa speaks in cradle and maturity; virgin birth: kun fayakoon creative command; Isa taught Book, Wisdom, Torah, Gospel; Isa's mission to Bani Isra'il with four signs: clay bird animated by divine permission, healing blind and leper, reviving dead by divine permission, knowledge of hidden food stores; signs conditional on belief; confirmation of prior Torah; partial abrogation of prohibitions; call to taqwa and obedience; tawheed declaration: Allah is my Lord and your Lord; straight path",
    keys: ["3:42","3:43","3:44","3:45","3:46","3:47","3:48","3:49","3:50","3:51"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Maryam's triple distinction: chosen, purified, chosen above women", keys: ["3:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command to Maryam: qunuti, sujud, ruku' with raki'in", keys: ["3:43"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "News of unseen (anba' al-ghayb) revealed to Prophet", keys: ["3:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pen-casting dispute proving prophetic absence", keys: ["3:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa as Kalimah min Allah", keys: ["3:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa: al-Masih ibn Maryam", keys: ["3:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa: wajih fi al-dunya wa al-akhirah", keys: ["3:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa: min al-muqarrabin", keys: ["3:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa speaks in cradle (fi al-mahd) and maturity (kahlan)", keys: ["3:46"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Virgin birth: kun fayakoon creative fiat", keys: ["3:47"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa taught: Kitab, Hikmah, Tawrat, Injil", keys: ["3:48"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Clay bird miracle by Allah's permission", keys: ["3:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Healing blind (akmah) and leper (abras)", keys: ["3:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reviving dead by Allah's permission", keys: ["3:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Knowledge of eaten and stored food as sign", keys: ["3:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Signs conditional: in kuntum mu'minin", keys: ["3:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Confirming Torah before him", keys: ["3:50"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Making lawful some previously forbidden things", keys: ["3:50"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Call to taqwa and obedience to Isa", keys: ["3:50"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawheed declaration: Allah rabbi wa rabbukum", keys: ["3:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Straight path (sirat mustaqim)", keys: ["3:51"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Isa's miraculous birth and mission to Children of Israel", keys: ["3:45","3:46","3:47","3:48","3:49","3:50","3:51"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Maryam's astonishment at virgin conception", keys: ["3:47"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Devout obedience as mark of Maryam's spiritual excellence", keys: ["3:43"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0139","cand-0140","cand-0141"],
  notes: "Pass A Imran passage 6/8. Core Isa narrative block. Four miracles enumerated with bi-idhnillah qualifier emphasizing divine agency. Kun fayakoon links Isa's creation to Adam's (3:59). Cradle speech unique to Quranic Isa account. Partial legislative authority (tahlil ba'd al-muharram) distinctive.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P6
{
  // Nothing explicit as standalone divine name pair in this range beyond what's embedded
}

// Extract commands from P6
{
  // 3:43 - Command to Maryam
  p6.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:43"], excerpt: fv(43), description: "Command to Maryam: be devoutly obedient to your Lord, prostrate, and bow with those who bow." });

  // 3:50 - Fear Allah and obey me
  p6.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:50"], excerpt: fv(50), description: "Command from Isa: fear Allah and obey me." });

  // 3:51 - Worship Allah
  p6.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:51"], excerpt: fv(51), description: "Command: Allah is my Lord and your Lord, so worship Him; that is the straight path." });
}

// Extract terminology from P6
{
  // Kalimah from 3:45
  const t45 = fv(45);
  const kalimahIdx = t45.indexOf("\u0628\u0650\u0643\u064e\u0644\u0650\u0645\u064e\u0629\u064d");
  if (kalimahIdx >= 0) {
    p6.terminology.push({ term: t45.slice(kalimahIdx, kalimahIdx + 9), transliteration: "bi-kalimah", gloss: "by/from a Word — divine creative word (editorial gloss)", keys: ["3:45"] });
  }

  // Al-Masih from 3:45
  const masihIdx = t45.indexOf("\u0671\u0644\u0652\u0645\u064e\u0633\u0650\u064a\u062d\u064f");
  if (masihIdx >= 0) {
    p6.terminology.push({ term: t45.slice(masihIdx, masihIdx + 9), transliteration: "al-Masih", gloss: "the Messiah/anointed one (editorial gloss)", keys: ["3:45"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p6.json"), JSON.stringify(p6, null, 2) + "\n");
console.log("Wrote 003-al-imran-p6.json");

// ─── Passage 7: 3:52–63 ────────────────────────────────────────────────────────
const p7 = {
  extractionId: "ext-003-p7",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 52, toAyah: 63, label: "Ali 'Imran — When Isa sensed disbelief from them said who are my supporters for Allah; hawariyyun said we are supporters of Allah; we believed in Allah bear witness we are Muslims; our Lord we believed in what You revealed followed messenger write us among witnesses; they schemed Allah schemed Allah best of schemers; when Allah said O Isa I take you raise you to Myself purify you from those who disbelieve make followers superior to disbelievers until Day of Resurrection; then to Me your return I judge between you in what you differed; as for those who disbelieve punish severely in dunya and akhirah no helpers; as for those who believe do righteous deeds give full rewards Allah does not love wrongdoers; that We recite to you of ayat and wise reminder; example of Isa before Allah like Adam created from dust then said Be and was; truth from your Lord do not be among doubters; whoever argues after knowledge came say come call our sons your sons our women your women ourselves yourselves then invoke curse of Allah upon liars; this is true narration no deity except Allah Allah is Aziz Hakeem; if turn away Allah knows corrupters" },
  verseKeys: ["3:52","3:53","3:54","3:55","3:56","3:57","3:58","3:59","3:60","3:61","3:62","3:63"],
  arabicExcerpts: Array.from({length:12}, (_,i) => ({ key: `3:${i+52}`, text: fv(i+52) })),
  mainSubject: {
    label: "Isa's search for supporters against disbelief; hawariyyun declare allegiance to Allah, affirm Islam, and request inscription among witnesses; divine counter-scheming against conspirators; Allah's address to Isa: taking, raising, purification from disbelievers, elevation of followers until Resurrection; eschatological judgment between disputants; severe punishment for disbelievers in both worlds; full reward for believers doing good; divine displeasure with wrongdoers; recitation of signs and wise reminder; Isa-Adam parallel: both created by divine fiat without father; truth affirmation; prohibition of doubt; mubahalah challenge: mutual invocation of divine curse upon liars; true narration declaration; tawheed reaffirmation; Aziz Hakeem; turning away exposes corruption known to Allah",
    keys: ["3:52","3:53","3:54","3:55","3:56","3:57","3:58","3:59","3:60","3:61","3:62","3:63"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Isa senses kufr from his people", keys: ["3:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hawariyyun volunteer as ansar Allah", keys: ["3:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hawariyyun testify: amanna billah wa ish-had bi-anna muslimun", keys: ["3:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hawariyyun supplication: write us among shahidin", keys: ["3:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enemy scheming met by divine scheming", keys: ["3:54"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah khayru al-makirin (best of planners)", keys: ["3:54"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutawaffeeka wa rafi'uka ilayya: taking and raising Isa", keys: ["3:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Purification of Isa from disbelievers", keys: ["3:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Followers of Isa made superior until Day of Resurrection", keys: ["3:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eschatological judgment between disputants", keys: ["3:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Severe punishment for disbelievers in both worlds", keys: ["3:56"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Full rewards for believers doing righteous deeds", keys: ["3:57"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah does not love zalimin", keys: ["3:57"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Recitation of ayat and dhikr hakim", keys: ["3:58"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa-Adam parallel: created from dust, kun fayakoon", keys: ["3:59"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Truth from Lord; prohibition of being mumtarin", keys: ["3:60"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mubahalah challenge: mutual cursing upon liars", keys: ["3:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True narration (al-qasas al-haqq)", keys: ["3:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawheed: ma min ilahin illa Allah", keys: ["3:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Aziz Hakeem closing", keys: ["3:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Turning away reveals mufsidin known to Allah", keys: ["3:63"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Hawariyyun's declaration of faith and supplication", keys: ["3:52","3:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine plan for Isa: taking, raising, purification, follower superiority", keys: ["3:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa-Adam creation parallel as theological argument", keys: ["3:59"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Steadfastness of hawariyyun amid communal disbelief", keys: ["3:52","3:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Doubt (imtira') prohibited after knowledge arrives", keys: ["3:60"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Discipleship: hawariyyun as ansar Allah supporting Isa", keys: ["3:52"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0142","cand-0143","cand-0144"],
  notes: "Pass A Imran passage 7/8. Contains mubahalah verse (3:61), Isa-Adam analogy (3:59), and divine plan for Isa (3:55). Hawariyyun testimony establishes Islamic identity within Isa's community. Khayru al-makirin echoes earlier makr themes.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P7
{
  // Aziz Hakeem from 3:62
  const t62 = fv(62);
  const ahIdx = t62.indexOf("\u0671\u0644\u0652\u0639\u064e\u0632\u0650\u064a\u0632\u064f \u0671\u0644\u0652\u062d\u064e\u0643\u0650\u064a\u0645\u064f");
  if (ahIdx >= 0) {
    p7.divineNamesAndAttributes.push({ term: t62.slice(ahIdx, ahIdx + 15), transliteration: "al-Aziz al-Hakeem", gloss: "the Exalted in Might, the Wise (editorial gloss)", keys: ["3:62"] });
  }
}

// Extract commands/supplications from P7
{
  // 3:53 - Taught supplication of hawariyyun
  p7.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["3:53"], excerpt: fv(53), description: "Taught supplication of the hawariyyun: Our Lord, we have believed in what You revealed and followed the messenger, so register us among the witnesses." });

  // 3:61 - Command: propose mubahalah
  p7.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:61"], excerpt: fv(61), description: "Command: invite disputants to mutual invocation of divine curse upon liars (mubahalah)." });
}

// Extract terminology from P7
{
  // Hawariyyun from 3:52
  const t52 = fv(52);
  const hawIdx = t52.indexOf("\u0671\u0644\u0652\u062d\u064e\u0648\u064e\u0627\u0631\u0650\u064a\u0651\u064f\u0648\u0646\u064e");
  if (hawIdx >= 0) {
    p7.terminology.push({ term: t52.slice(hawIdx, hawIdx + 13), transliteration: "al-hawariyyun", gloss: "the disciples/apostles of Isa (editorial gloss)", keys: ["3:52"] });
  }

  // Mubahalah concept from 3:61
  const t61 = fv(61);
  const nabtahilIdx = t61.indexOf("\u0646\u064e\u0628\u0652\u062a\u064e\u0647\u0650\u0644\u0652");
  if (nabtahilIdx >= 0) {
    p7.terminology.push({ term: t61.slice(nabtahilIdx, nabtahilIdx + 8), transliteration: "nabtahil", gloss: "mutual earnest supplication/invocation of curse (editorial gloss)", keys: ["3:61"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p7.json"), JSON.stringify(p7, null, 2) + "\n");
console.log("Wrote 003-al-imran-p7.json");

// ─── Passage 8: 3:64–70 ────────────────────────────────────────────────────────
const p8 = {
  extractionId: "ext-003-p8",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 64, toAyah: 70, label: "Ali 'Imran — Say O People of Book come to common word between us and you: worship none but Allah associate nothing with Him take not one another as lords besides Allah; if turn away say bear witness we are Muslims; O People of Book why argue about Ibrahim while Torah Gospel not revealed until after him; will you not reason; you argue about what you have knowledge but why argue about what you have no knowledge; Allah knows you do not know; Ibrahim was neither Jew nor Christian but hanif Muslim not of polytheists; most worthy of Ibrahim are those who followed him and this prophet and those who believed; Allah is ally of believers; faction of People of Book wish to mislead you but only mislead themselves and do not perceive; O People of Book why disbelieve in Allah's signs while you witness" },
  verseKeys: ["3:64","3:65","3:66","3:67","3:68","3:69","3:70"],
  arabicExcerpts: Array.from({length:7}, (_,i) => ({ key: `3:${i+64}`, text: fv(i+64) })),
  mainSubject: {
    label: "Universal interfaith invitation (kalimah sawa'): worship Allah alone, reject shirk, refuse human lordship; fallback testimony of Islam if rejected; refutation of Ahl al-Kitab claims on Ibrahim: Torah and Gospel postdate him; appeal to reason; critique of arguing without knowledge; divine knowledge contrasted with human ignorance; Ibrahim's true identity: hanif Muslim, neither Jew nor Christian, not mushrik; true heirs of Ibrahim: followers, this Prophet, and believers; Allah as waliyy al-mu'minin; warning about faction wishing to mislead believers but only harming themselves; challenge: why disbelieve in Allah's signs while witnessing their truth",
    keys: ["3:64","3:65","3:66","3:67","3:68","3:69","3:70"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Kalimah sawa': equitable common word proposal", keys: ["3:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Three conditions: worship Allah alone, no shirk, no human lords", keys: ["3:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fallback: testify we are Muslims if they turn away", keys: ["3:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim predates Torah and Gospel", keys: ["3:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Appeal to reason: afala ta'qilun", keys: ["3:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Critique: arguing beyond knowledge boundaries", keys: ["3:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine knowledge vs human ignorance", keys: ["3:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim: hanifan musliman, not Jew, Christian, or mushrik", keys: ["3:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True heirs of Ibrahim: followers, Prophet, believers", keys: ["3:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah waliyy al-mu'minin", keys: ["3:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Misleading faction only harms itself", keys: ["3:69"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge: disbelieving in signs while witnessing", keys: ["3:70"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Ibrahim's true religious identity as hanif Muslim", keys: ["3:67"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Arguing beyond knowledge as intellectual transgression", keys: ["3:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-deception: misleading others only misleads self", keys: ["3:69"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0145","cand-0146"],
  notes: "Pass A Imran passage 8/8. Kalimat sawa' (3:64) is foundational interfaith dialogue text. Millat Ibrahim defined independently of Judaism/Christianity. Epistemological boundary (knowledge vs ignorance) connects to muhkamat/mutashabihat framework.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P8
{
  // 3:64 - Command: say O People of Book...
  p8.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:64"], excerpt: fv(64), description: "Command: invite People of the Book to equitable common word — worship Allah alone, no association, no human lordship." });
}

// Extract terminology from P8
{
  // Kalimatin sawa' from 3:64
  const t64 = fv(64);
  const ksIdx = t64.indexOf("\u0643\u064e\u0644\u0650\u0645\u064e\u0629\u064d \u0633\u064e\u0648\u064e\u0627\u0621\u064d");
  if (ksIdx >= 0) {
    p8.terminology.push({ term: t64.slice(ksIdx, ksIdx + 13), transliteration: "kalimatin sawa'", gloss: "equitable/common word — basis for interfaith dialogue (editorial gloss)", keys: ["3:64"] });
  }

  // Hanif from 3:67
  const t67 = fv(67);
  const hanifIdx = t67.indexOf("\u062d\u064e\u0646\u0650\u064a\u0641\u064b\u0627");
  if (hanifIdx >= 0) {
    p8.terminology.push({ term: t67.slice(hanifIdx, hanifIdx + 7), transliteration: "hanif", gloss: "inclining toward truth, upright monotheist (editorial gloss)", keys: ["3:67"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p8.json"), JSON.stringify(p8, null, 2) + "\n");
console.log("Wrote 003-al-imran-p8.json");

// ─── Candidates batch (cand-0137 through cand-0146) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-003-p5,ext-003-p6,ext-003-p7,ext-003-p8",
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

// cand-0137: Maryam's election and purification
candidates.candidates.push(makeCand("cand-0137",
  "Maryam's election and purification: chosen, purified, and preferred above all women of the worlds",
  undefined, "\u0645\u0631\u06cc\u0645 \u06a9\u0627 \u0627\u0646\u062a\u062e\u0627\u0628 \u0627\u0648\u0631 \u067e\u0627\u06a9\u06cc: \u062a\u0645\u0627\u0645 \u0639\u0648\u0631\u062a\u0648\u06ba \u067e\u0631 \u0641\u0636\u06cc\u0644\u062a",
  "In 3:42: And when the angels said, O Mary, indeed Allah has chosen you and purified you and chosen you above the women of the worlds. In 3:43: O Mary, be devoutly obedient to your Lord and prostrate and bow with those who bow.",
  [{ key: "3:42", excerpt: fv(42), evidenceClass: "EXPLICIT_TEXT", rationale: "Triple distinction formula: istafa (chose), tahhara (purified), istafa again with preference above all women." },
   { key: "3:43", excerpt: fv(43), evidenceClass: "EXPLICIT_TEXT", rationale: "Obedience, prostration, and communal worship commanded as marks of her spiritual station." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "broader" }],
  "Gap candidate: no dedicated maryam-story topic. Triple-election formula unique in Quran. Links to isa-story but distinct as maternal election narrative."
));

// cand-0138: Zakariyya's supplication and Yahya's announcement
candidates.candidates.push(makeCand("cand-0138",
  "Zakariyya's supplication for righteous offspring and angelic announcement of Yahya",
  undefined, "\u0632\u06a9\u0631\u06cc\u0627 \u06a9\u06cc \u062f\u0639\u0627 \u0627\u0648\u0631 \u06cc\u062d\u06ccٰ\u06cc \u06a9\u06cc \u0628\u0634\u0627\u0631\u062a",
  "In 3:38: Thereupon Zakariyya called upon his Lord: My Lord, grant me from Yourself good offspring; indeed You are the Hearer of supplication. In 3:39: The angels called him while he stood praying in the chamber: Allah gives you glad tidings of Yahya, confirming a Word from Allah, honorable, abstaining, a prophet from the righteous.",
  [{ key: "3:38", excerpt: fv(38), evidenceClass: "EXPLICIT_TEXT", rationale: "Zakariyya's supplication prompted by witnessing Maryam's miraculous provision." },
   { key: "3:39", excerpt: fv(39), evidenceClass: "EXPLICIT_TEXT", rationale: "Angelic announcement with four attributes of Yahya: musaddiq, sayyid, hasoor, nabiyy." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated zakariyya-story topic. Yahya as precursor to Isa. Old-age birth miracle parallels Ibrahim/Sarah narrative."
));

// cand-0139: Isa's miracles with divine permission qualifier
candidates.candidates.push(makeCand("cand-0139",
  "Isa's miracles: four signs performed by divine permission establishing prophetic authority",
  undefined, "\u0639\u06cc\u0633\u06ccٰ \u06a9\u06d2 \u0645\u0639\u062c\u0632\u06d2: \u0686\u0627\u0631 \u0646\u0634\u0627\u0646\u06cc\u0627\u06ba \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u0627\u062c\u0627\u0632\u062a \u0633\u06d2",
  "In 3:49: Indeed I have come to you with a sign from your Lord: I create for you from clay the form of a bird, then I breathe into it and it becomes a bird by Allah's permission; I heal the blind and the leper and give life to the dead by Allah's permission; I inform you of what you eat and store in your houses. Indeed in that is a sign for you if you are believers.",
  [{ key: "3:49", excerpt: fv(49), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete enumeration of four miracles with repeated bi-idhnillah qualifier emphasizing divine agency over prophetic power." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept" },
   { topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with isa-story confirmed. Distinctive focus on bi-idhnillah theology preventing deification. Knowledge of hidden food stores less commonly discussed miracle."
));

// cand-0140: Virgin birth and kun fayakoon creative fiat
candidates.candidates.push(makeCand("cand-0140",
  "Virgin birth of Isa: kun fayakoon creative fiat paralleling divine creation without paternal cause",
  undefined, "\u0639\u06cc\u0633\u06ccٰ \u06a9\u0627 \u067e\u06cc\u062f\u0627\u0626\u0634: \u06a9\u0646 \u0641\u06cc\u06a9\u0648\u0646 \u06a9\u0627 \u062d\u06a9\u0645",
  "In 3:47: She said, My Lord, how will I have a child when no man has touched me? He said, Thus is Allah; He creates what He wills. When He decrees a matter, He only says to it 'Be' and it is.",
  [{ key: "3:47", excerpt: fv(47), evidenceClass: "EXPLICIT_TEXT", rationale: "Virgin birth established through kun fayakoon formula identical to general creation, removing any implication of divine paternity." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept" },
   { topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with isa-story. Distinctive theological function: kun fayakoon neutralizes incarnation theology by equating Isa's creation with all creation."
));

// cand-0141: Isa's legislative authority — confirming Torah and making lawful some forbidden
candidates.candidates.push(makeCand("cand-0141",
  "Isa's legislative authority: confirming prior Torah while making lawful some previously forbidden things",
  undefined, "\u0639\u06cc\u0633\u06ccٰ \u06a9\u0627 \u062a\u0634\u0631\u06cc\u0639\u06cc \u0627\u062e\u062a\u06cc\u0627\u0631: \u062a\u0648\u0631\u06cc\u062a \u06a9\u06cc \u062a\u0635\u062f\u06cc\u0642 \u0627\u0648\u0631 \u0628\u0639\u0636 \u0645\u0645\u0646\u0648\u0639\u0627\u062a \u06a9\u0627 \u062d\u0644\u0627\u0644",
  "In 3:50: And [I have come] confirming what was before me of the Torah and to make lawful for you some of what was forbidden to you. And I have come to you with a sign from your Lord, so fear Allah and obey me.",
  [{ key: "3:50", excerpt: fv(50), evidenceClass: "EXPLICIT_TEXT", rationale: "Dual legislative function: tasdiq (confirmation) of Torah plus selective tahlil (making lawful) of previously forbidden items, demonstrating prophetic authority within continuity." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with isa-story. Distinctive as legislative dimension of Isa's mission rarely emphasized. Ba'd alladhee hurrima implies specific relaxations rather than wholesale abrogation."
));

// cand-0142: Hawariyyun's testimony and Islamic identity within Isa's community
candidates.candidates.push(makeCand("cand-0142",
  "Hawariyyun's testimony: disciples declare faith, Islam, and request inscription among witnesses",
  undefined, "\u062d\u0648\u0627\u0631\u06cc\u06cc\u0646 \u06a9\u06cc \u06af\u0648\u0627\u06c1\u06cc: \u0627\u06cc\u0645\u0627\u0646\u060c \u0627\u0633\u0644\u0627\u0645\u060c \u0627\u0648\u0631 \u06af\u0648\u0627\u06c1\u0648\u06ba \u0645\u06cc\u06ba \u0634\u0645\u0627\u0631",
  "In 3:52: The disciples said, We are supporters of Allah; we have believed in Allah and testify that we are Muslims. In 3:53: Our Lord, we have believed in what You revealed and followed the messenger, so register us among the witnesses.",
  [{ key: "3:52", excerpt: fv(52), evidenceClass: "EXPLICIT_TEXT", rationale: "Explicit self-identification as ansar Allah and muslimun within Isa's community." },
   { key: "3:53", excerpt: fv(53), evidenceClass: "EXPLICIT_TEXT", rationale: "Supplication requesting inscription among shahidin establishes ongoing witness role." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated hawariyyun/disciples topic. Critical for understanding Islamic self-conception within pre-Quranic prophetic communities. Shahidin role connects to ummatic witness theology."
));

// cand-0143: Isa-Adam creation parallel as theological argument
candidates.candidates.push(makeCand("cand-0143",
  "Isa-Adam creation parallel: both created by divine fiat without paternal cause as argument against deification",
  undefined, "\u0639\u06cc\u0633\u06ccٰ \u0627\u0648\u0631 \u0622\u062f\u0645 \u06a9\u06cc \u062a\u0634\u0628\u06cc\u06c1: \u062e\u062f\u0627\u0626\u06cc \u062d\u06a9\u0645 \u0633\u06d2 \u067e\u06cc\u062f\u0627\u0626\u0634",
  "In 3:59: Indeed, the example of Jesus before Allah is like the example of Adam. He created him from dust; then He said to him, 'Be,' and he was.",
  [{ key: "3:59", excerpt: fv(59), evidenceClass: "EXPLICIT_TEXT", rationale: "Direct analogical argument: Isa's fatherless creation paralleled to Adam's parentless creation, both via kun fayakoon, neutralizing incarnation theology." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept" },
   { topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with isa-story. Distinctive as comparative theology tool specifically deployed against Christian deification claims. Adam-Isa typology unique to this passage."
));

// cand-0144: Mubahalah — mutual invocation of divine curse
candidates.candidates.push(makeCand("cand-0144",
  "Mubahalah: mutual invocation of divine curse upon liars as ultimate truth-establishment mechanism",
  undefined, "\u0645\u0628\u0627\u06c1\u0644\u06c1: \u062c\u06be\u0648\u0679\u06d2 \u067e\u0631 \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u0644\u0639\u0646\u062a \u06a9\u06cc \u062f\u0639\u0627",
  "In 3:61: Then whoever argues with you about it after knowledge has come to you, say: Come, let us call our sons and your sons, our women and your women, ourselves and yourselves, then supplicate earnestly and invoke the curse of Allah upon the liars.",
  [{ key: "3:61", excerpt: fv(61), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete mubahalah protocol: family-inclusive mutual imprecation as final epistemic arbiter when rational argument exhausted." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated mubahalah topic. Unique Quranic dispute-resolution mechanism. Family inclusion raises stakes beyond individual disputants. Historical context: Najran delegation."
));

// cand-0145: Kalimat sawa' — equitable common word for interfaith dialogue
candidates.candidates.push(makeCand("cand-0145",
  "Kalimat sawa': equitable common word as foundation for interfaith dialogue with People of the Book",
  undefined, "\u06a9\u0644\u0645\u06c1 \u0633\u0648\u0627\u0621: \u0628\u06cc\u0646 \u0627\u0644\u0645\u0630\u0627\u06c1\u0628 \u0645\u06a9\u0627\u0644\u0645\u06c1 \u06a9\u06cc \u0628\u0646\u06cc\u0627\u062f",
  "In 3:64: Say, O People of the Scripture, come to a word that is equitable between us and you: that we will not worship except Allah, not associate anything with Him, and not take one another as lords instead of Allah. But if they turn away, then say: Bear witness that we are Muslims.",
  [{ key: "3:64", excerpt: fv(64), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete kalimat sawa' formula with three non-negotiable conditions and fallback testimony of Islam." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "uncertain", note: "Adjacent to Isa narrative but addresses broader People of Book engagement" }],
  "Gap candidate: no dedicated interfaith-dialogue or kalimat-sawa topic. Foundational text for Islamic interfaith engagement theory. Three conditions define minimum shared theological ground."
));

// cand-0146: Millat Ibrahim — Abraham as hanif Muslim transcending Jewish and Christian identities
candidates.candidates.push(makeCand("cand-0146",
  "Millat Ibrahim: Abraham as hanif Muslim, neither Jew nor Christian, defining primordial monotheism",
  undefined, "\u0645\u0644\u062a \u0627\u0628\u0631\u0627\u06c1\u06cc\u0645: \u062d\u0646\u06cc\u0641 \u0645\u0633\u0644\u0645\u060c \u0646\u06c1 \u06cc\u06c1\u0648\u062f\u06cc \u0646\u06c1 \u0646\u0635\u0627\u0631\u06cc",
  "In 3:67: Abraham was neither a Jew nor a Christian, but he was one inclining toward truth, a Muslim. And he was not of the polytheists. In 3:68: Indeed, the most worthy of Abraham among people are those who followed him and this prophet and those who believe. And Allah is the ally of the believers.",
  [{ key: "3:67", excerpt: fv(67), evidenceClass: "EXPLICIT_TEXT", rationale: "Definitive negation of Jewish/Christian claims on Ibrahim; positive identification as hanif muslim." },
   { key: "3:68", excerpt: fv(68), evidenceClass: "EXPLICIT_TEXT", rationale: "True heirship defined by following rather than ethnic or sectarian affiliation." }],
  [{ topicId: "ibrahim-story", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with ibrahim-story confirmed. Distinctive as millat-ibrahim identity formulation independent of later religious categories. Hanif-muslim pairing defines pre-sectarian monotheism."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-014.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-014.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-003-p5 through ext-003-p8)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0137 through cand-${String(136 + candidates.candidates.length).padStart(4,'0')})`);
