// MFD-11 Imran Pass 3 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Ali 'Imran 3:71-110 (Passages 9-12, Candidates cand-0147..cand-0156).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "003-0071-0110.json");
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

console.log("Generating Imran Pass 3 files from verbatim corpus (3:71-110)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T17:55:00.000Z";

// ─── Passage 9: 3:71–80 ────────────────────────────────────────────────────────
const p9 = {
  extractionId: "ext-003-p9",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 71, toAyah: 80, label: "Ali 'Imran — O People of Book why mix truth with falsehood and conceal truth while you know; faction say believe what revealed to believers at beginning of day reject at end perhaps they return; do not trust except who follow your religion; say guidance is Allah's guidance lest someone given like you or argue before Lord; say bounty in hand of Allah gives whom He wills Allah Wasi' Aleem; selects mercy whom He wills Allah Dhu al-Fadl al-Azeem; among People of Book who if entrusted qintar returns it and who if entrusted dinar does not return unless standing over him because they say no blame concerning unlearned speak lie about Allah while know; yes whoever fulfills covenant fears Allah loves muttaqin; those who sell covenant of Allah and oaths for small price no share in akhirah Allah will not speak look purify them painful punishment; party twist tongues with Scripture so you think it from Scripture but not from it say from Allah but not from Allah speak lie about Allah while know; not for human given Scripture judgment prophethood then say be servants to me instead of Allah but rabbaniyyun teaching studying Scripture; nor order take angels prophets as lords would he order kufr after being Muslims" },
  verseKeys: ["3:71","3:72","3:73","3:74","3:75","3:76","3:77","3:78","3:79","3:80"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `3:${i+71}`, text: fv(i+71) })),
  mainSubject: {
    label: "Condemnation of truth-concealment and deception by factions among People of the Book: mixing haqq with batil; strategic belief-rejection tactic to undermine Muslim faith; exclusive trust claim refuted; divine guidance and bounty belong to Allah alone; trustworthy vs untrustworthy among Ahl al-Kitab based on covenant fulfillment; false claim of exemption regarding ummiyyun; selling Allah's covenant for small price leads to eschatological deprivation; tongue-twisting distortion of Scripture presented as divine; prophetic authority cannot command worship of self or angels/prophets as lords; rejection of kufr after Islam",
    keys: ["3:71","3:72","3:73","3:74","3:75","3:76","3:77","3:78","3:79","3:80"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Mixing truth with falsehood (talbis)", keys: ["3:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Concealing truth while knowing it", keys: ["3:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Strategic belief-rejection tactic to cause apostasy", keys: ["3:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exclusive trust claim: only those who follow our religion", keys: ["3:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine guidance is Allah's guidance alone", keys: ["3:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bounty in Allah's hand: Wasi' Aleem", keys: ["3:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah selects mercy whom He wills: Dhu al-Fadl al-Azeem", keys: ["3:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trustworthy among Ahl al-Kitab: returns qintar", keys: ["3:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Untrustworthy: refuses dinar unless pressured", keys: ["3:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False exemption claim regarding ummiyyun", keys: ["3:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Speaking lies about Allah knowingly", keys: ["3:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant fulfillment and taqwa earn divine love", keys: ["3:76"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Selling Allah's covenant for small price: no share in akhirah", keys: ["3:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eschatological deprivation: no speech, no gaze, no purification", keys: ["3:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tongue-twisting distortion of Scripture (layy alsina)", keys: ["3:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False attribution to Allah", keys: ["3:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet cannot command worship of self", keys: ["3:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rabbaniyyun: scholars of Lord through teaching Scripture", keys: ["3:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No command to take angels/prophets as lords", keys: ["3:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kuaf after Islam is inconceivable for prophet", keys: ["3:80"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Deliberate truth-concealment as moral corruption", keys: ["3:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-deception through false religious exclusivity", keys: ["3:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant-breaking as spiritual bankruptcy", keys: ["3:77"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Financial trustworthiness as indicator of religious integrity", keys: ["3:75"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0147","cand-0148"],
  notes: "Pass A Imran passage 9/12. Continues critique of Ahl al-Kitab from p8. Introduces financial trustworthiness test (3:75), tongue-twisting distortion (3:78), and rabbaniyyun concept (3:79). Covenant-selling (3:77) connects to covenants-ahd topic.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P9
{
  // Wasi' Aleem from 3:73
  const t73 = fv(73);
  const waIdx = t73.indexOf("\u0648\u064e\u0671\u0644\u0644\u0651\u064e\u0647\u064f \u0648\u064e\u0627\u0633\u0650\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (waIdx >= 0) {
    p9.divineNamesAndAttributes.push({ term: t73.slice(waIdx + 8, waIdx + 22), transliteration: "Wasi' Aleem", gloss: "All-Encompassing, All-Knowing (editorial gloss)", keys: ["3:73"] });
  }

  // Dhu al-Fadl al-Azeem from 3:74
  const t74 = fv(74);
  const dfIdx = t74.indexOf("\u0630\u064f\u0648 \u0671\u0644\u0652\u0641\u064e\u0636\u0652\u0644\u0650 \u0671\u0644\u0652\u0639\u064e\u0638\u0650\u064a\u0645\u0650");
  if (dfIdx >= 0) {
    p9.divineNamesAndAttributes.push({ term: t74.slice(dfIdx, dfIdx + 22), transliteration: "Dhu al-Fadl al-Azeem", gloss: "Possessor of Great Bounty (editorial gloss)", keys: ["3:74"] });
  }

  // Ghafur Raheem from 3:89
  const t89 = fv(89);
  const grIdx = t89.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c \u0631\u064e\u0651\u062d\u0650\u064a\u0645\u064c");
  if (grIdx >= 0) {
    p9.divineNamesAndAttributes.push({ term: t89.slice(grIdx, grIdx + 14), transliteration: "Ghafur Raheem", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["3:89"] });
  }
}

// Extract commands from P9
{
  // 3:73 - Command: Say guidance is Allah's
  p9.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:73"], excerpt: fv(73), description: "Command to Prophet: declare that true guidance is Allah's guidance and bounty is in His hand." });

  // 3:79 - Command: Be rabbaniyyun
  p9.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:79"], excerpt: fv(79), description: "Prophetic instruction: be rabbaniyyun (scholars of the Lord) through teaching and studying Scripture." });
}

// Extract terminology from P9
{
  // Rabbaniyyun from 3:79
  const t79 = fv(79);
  const rabIdx = t79.indexOf("\u0631\u064e\u0628\u064e\u0651\u0627\u0646\u0650\u064a\u0651\u0650\u064a\u0646\u064e");
  if (rabIdx >= 0) {
    p9.terminology.push({ term: t79.slice(rabIdx, rabIdx + 12), transliteration: "rabbaniyyun", gloss: "devout scholars of the Lord (editorial gloss)", keys: ["3:79"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p9.json"), JSON.stringify(p9, null, 2) + "\n");
console.log("Wrote 003-al-imran-p9.json");

// ─── Passage 10: 3:81–91 ────────────────────────────────────────────────────────
const p10 = {
  extractionId: "ext-003-p10",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 81, toAyah: 91, label: "Ali 'Imran — When Allah took covenant of prophets: whatever I give you of Scripture wisdom then comes messenger confirming what is with you believe in him support him; said have you acknowledged taken My commitment; said we acknowledge; said bear witness I am with you among witnesses; whoever turns away after that are fasiqun; seek other than Islam as religion never accepted in akhirah among losers; say believed in Allah what revealed to us Ibrahim Ismail Ishaq Yaqub Asbat Musa Isa prophets from Lord no distinction between any of them we are Muslims to Him; whoever seeks other than Islam as religion never accepted in akhirah among losers; how can Allah guide people who disbelieved after belief witnessed Messenger is true clear signs came; Allah does not guide zalimin; those recompense upon them curse of Allah angels people all together; abiding therein punishment not lightened nor reprieved; except those who repent after and reform Allah Ghafur Raheem; those who disbelieve after belief then increase in disbelief repentance never accepted they are dallun; those who disbelieve die as kuffar full earth of gold not accepted as ransom painful punishment no helpers" },
  verseKeys: ["3:81","3:82","3:83","3:84","3:85","3:86","3:87","3:88","3:89","3:90","3:91"],
  arabicExcerpts: Array.from({length:11}, (_,i) => ({ key: `3:${i+81}`, text: fv(i+81) })),
  mainSubject: {
    label: "Universal prophetic covenant (mithaq al-nabiyyin): all prophets pledged to believe in and support the confirming messenger; turning away is fisq; Islam as the only accepted religion; comprehensive declaration of faith in all revelations and prophets without distinction; impossibility of divine guidance for those who disbelieve after belief and witnessing truth; triple curse (Allah, angels, people) upon persistent disbelievers; eternal punishment without relief; exception for sincere repentance and reform (Ghafur Raheem); escalating disbelief closes door to repentance; death in disbelief makes even earth-full of gold worthless as ransom",
    keys: ["3:81","3:82","3:83","3:84","3:85","3:86","3:87","3:88","3:89","3:90","3:91"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Mithaq al-nabiyyin: covenant of all prophets", keys: ["3:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Confirming messenger condition: musaddiq lima ma'akum", keys: ["3:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual acknowledgment and witnessing", keys: ["3:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Turning away from covenant = fasiqun", keys: ["3:82"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Islam as only accepted religion", keys: ["3:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Comprehensive faith declaration: all prophets, no distinction", keys: ["3:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Impossibility of guidance after deliberate disbelief", keys: ["3:86"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Triple curse: Allah, angels, people", keys: ["3:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eternal punishment without relief or respite", keys: ["3:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance exception: tabu wa aslahu", keys: ["3:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Escalating disbelief closes repentance", keys: ["3:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Death in kufr: earth-full of gold rejected as ransom", keys: ["3:91"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Universal prophetic covenant establishing inter-prophetic continuity", keys: ["3:81"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Fisq as deliberate turning from divine covenant", keys: ["3:82"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Irreversibility of disbelief after witnessing truth", keys: ["3:86","3:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hope through repentance and reform", keys: ["3:89"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0149","cand-0150"],
  notes: "Pass A Imran passage 10/12. Mithaq al-nabiyyin (3:81) is foundational for Islamic prophetology. Islam-as-only-religion (3:85) is key doctrinal verse. Repentance theology nuanced: open for reformers (3:89), closed for escalators (3:90). Connects to covenants-ahd and repentance topics.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P10
{
  // 3:84 - Command: Say we believe...
  p10.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:84"], excerpt: fv(84), description: "Command to Prophet: declare comprehensive faith in all revelations and prophets without distinction." });
}

// Extract terminology from P10
{
  // Mithaq from 3:81
  const t81 = fv(81);
  const mithaqIdx = t81.indexOf("\u0645\u0650\u064a\u062b\u064e\u0627\u0642\u064e");
  if (mithaqIdx >= 0) {
    p10.terminology.push({ term: t81.slice(mithaqIdx, mithaqIdx + 8), transliteration: "mithaq", gloss: "solemn covenant/pact (editorial gloss)", keys: ["3:81"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p10.json"), JSON.stringify(p10, null, 2) + "\n");
console.log("Wrote 003-al-imran-p10.json");

// ─── Passage 11: 3:92–100 ────────────────────────────────────────────────────────
const p11 = {
  extractionId: "ext-003-p11",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 92, toAyah: 100, label: "Ali 'Imran — Never attain birr until spend from what you love; whatever spend Allah knows; all food lawful to Children of Israel except what Israel forbade himself before Torah revealed; bring Torah recite if truthful; whoever fabricates lie against Allah after that are zalimun; say Allah spoke truth so follow millat Ibrahim hanif not of mushrikin; first house established for mankind at Bakkah blessed guidance for worlds; in it clear signs maqam Ibrahim; whoever enters is secure; pilgrimage to house duty upon mankind for whoever can find way; whoever disbelieves Allah Ghaniyy an al-Alamin; say O People of Book why disbelieve in ayat of Allah Allah shaheed on what you do; say O People of Book why avert from way of Allah those who believe seeking deviation while you are witnesses Allah not ghaafil; O you who believe if obey party of those given Scripture turn you back after belief as kafirun" },
  verseKeys: ["3:92","3:93","3:94","3:95","3:96","3:97","3:98","3:99","3:100"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `3:${i+92}`, text: fv(i+92) })),
  mainSubject: {
    label: "True righteousness (birr) requires spending from beloved possessions; divine knowledge of all expenditure; historical food-law clarification for Children of Israel: self-imposed restrictions predate Torah; challenge to produce Torah if truthful; fabrication against Allah condemned; affirmation of Allah's truthfulness; command to follow millat Ibrahim hanif; Ka'bah at Bakkah as first house for mankind, blessed, guidance for worlds; clear signs including Maqam Ibrahim; sanctuary security; Hajj as universal obligation conditional on ability; divine self-sufficiency (Ghaniyy) negates need for creation; renewed challenge to Ahl al-Kitab: why disbelieve in Allah's signs while He witnesses; warning against averting believers from Allah's way; caution against obeying factions among Ahl al-Kitab leading to apostasy",
    keys: ["3:92","3:93","3:94","3:95","3:96","3:97","3:98","3:99","3:100"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Birr contingent on spending from mahabbah (beloved wealth)", keys: ["3:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine omniscience regarding expenditure", keys: ["3:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Historical food laws: Israel's self-imposed restrictions pre-Torah", keys: ["3:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge: bring Torah and recite if truthful", keys: ["3:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fabrication against Allah after clarification = zulm", keys: ["3:94"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Affirmation: Sadaqa Allah", keys: ["3:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Follow millat Ibrahim hanif", keys: ["3:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "First house (awwal bayt) at Bakkah for mankind", keys: ["3:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Blessed and guidance for worlds", keys: ["3:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Clear signs: Maqam Ibrahim", keys: ["3:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sanctuary security: man dakhalahu kana aminan", keys: ["3:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hajj obligation conditional on istita'ah (ability)", keys: ["3:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine self-sufficiency: Ghaniyy an al-Alamin", keys: ["3:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge to Ahl al-Kitab: why disbelieve in ayat", keys: ["3:98"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Warning: averting believers from Allah's way", keys: ["3:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Caution: obeying Ahl al-Kitab faction risks apostasy", keys: ["3:100"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Ibrahim's millat as model for true monotheism", keys: ["3:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Maqam Ibrahim as tangible sign at Ka'bah", keys: ["3:97"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Attachment to wealth as barrier to birr", keys: ["3:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Vulnerability to external influence risking apostasy", keys: ["3:100"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Charitable spending as measure of true piety", keys: ["3:92"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0151","cand-0152","cand-0153"],
  notes: "Pass A Imran passage 11/12. Contains foundational Hajj verses (3:96-97) establishing Ka'bah primacy, Maqam Ibrahim, sanctuary security, and conditional obligation. Birr-spending link (3:92) connects to charity-giving. Millat Ibrahim reprise (3:95) links to ibrahim-story. Food-law clarification (3:93) addresses Jewish dietary claims.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P11
{
  // Ghaniyy an al-Alamin from 3:97
  const t97 = fv(97);
  const ghIdx = t97.indexOf("\u063a\u064e\u0646\u0650\u064a\u0651\u064c \u0639\u064e\u0646\u0650 \u0671\u0644\u0652\u0639\u064e\u0627\u0644\u064e\u0645\u0650\u064a\u0646\u064e");
  if (ghIdx >= 0) {
    p11.divineNamesAndAttributes.push({ term: t97.slice(ghIdx, ghIdx + 22), transliteration: "Ghaniyy an al-Alamin", gloss: "Free from need of the worlds (editorial gloss)", keys: ["3:97"] });
  }
}

// Extract commands from P11
{
  // 3:95 - Command: Follow millat Ibrahim
  p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:95"], excerpt: fv(95), description: "Command: follow the religion of Ibrahim, hanif, not of the mushrikin." });

  // 3:97 - Hajj obligation
  p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:97"], excerpt: fv(97), description: "Divine decree: pilgrimage to the House is a duty upon mankind for whoever can find a way." });
}

// Extract terminology from P11
{
  // Birr from 3:92
  const t92 = fv(92);
  const birrIdx = t92.indexOf("\u0671\u0644\u0652\u0628\u0650\u0631\u064e\u0651");
  if (birrIdx >= 0) {
    p11.terminology.push({ term: t92.slice(birrIdx, birrIdx + 7), transliteration: "al-birr", gloss: "righteousness/piety/good reward (editorial gloss)", keys: ["3:92"] });
  }

  // Bakkah from 3:96
  const t96 = fv(96);
  const bakkahIdx = t96.indexOf("\u0628\u0650\u0628\u064e\u0643\u064e\u0651\u0629\u064e");
  if (bakkahIdx >= 0) {
    p11.terminology.push({ term: t96.slice(bakkahIdx, bakkahIdx + 7), transliteration: "bi-Bakkah", gloss: "at Bakkah (ancient name for Makkah) (editorial gloss)", keys: ["3:96"] });
  }

  // Hijj from 3:97
  const t97h = fv(97);
  const hijjIdx = t97h.indexOf("\u062d\u0650\u062c\u064e\u0651");
  if (hijjIdx >= 0) {
    p11.terminology.push({ term: t97h.slice(hijjIdx, hijjIdx + 5), transliteration: "hijj", gloss: "pilgrimage/Hajj (editorial gloss)", keys: ["3:97"] });
  }

  // Maqam Ibrahim from 3:97
  const maqamIdx = t97h.indexOf("\u0645\u064e\u0642\u064e\u0627\u0645\u064f \u0625\u0650\u0628\u0652\u0631\u064e\u0627\u0647\u0650\u064a\u0645\u064e");
  if (maqamIdx >= 0) {
    p11.terminology.push({ term: t97h.slice(maqamIdx, maqamIdx + 16), transliteration: "Maqam Ibrahim", gloss: "Standing Place of Abraham (editorial gloss)", keys: ["3:97"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p11.json"), JSON.stringify(p11, null, 2) + "\n");
console.log("Wrote 003-al-imran-p11.json");

// ─── Passage 12: 3:101–110 ────────────────────────────────────────────────────────
const p12 = {
  extractionId: "ext-003-p12",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 101, toAyah: 110, label: "Ali 'Imran — How can you disbelieve while ayat of Allah recited to you and His Messenger among you; whoever holds firmly to Allah guided to straight path; O you who believe fear Allah as He should be feared do not die except as Muslims; hold firmly to rope of Allah all together do not become divided; remember Allah's favor when you were enemies He brought hearts together became brothers by His grace; were on edge of pit of Fire saved from it; thus Allah makes clear signs so you may be guided; let there be among you community inviting to good enjoining right forbidding wrong those are muflihun; do not be like those who became divided differed after clear proofs came those have great punishment; day faces brighten faces darken; as for those whose faces darkened did you disbelieve after belief taste punishment for disbelief; as for those whose faces brightened in Allah's mercy abiding eternally; these are ayat of Allah recite in truth Allah intends no injustice to worlds; to Allah belongs whatever in heavens earth to Allah matters returned; you are best nation produced for mankind enjoin right forbid wrong believe in Allah; if People of Book believed better for them among them believers most are fasiqun" },
  verseKeys: ["3:101","3:102","3:103","3:104","3:105","3:106","3:107","3:108","3:109","3:110"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `3:${i+101}`, text: fv(i+101) })),
  mainSubject: {
    label: "Inconceivability of disbelief amid ongoing revelation and prophetic presence; holding firmly to Allah guarantees guidance; command for proper taqwa and dying only as Muslims; collective adherence to Allah's rope prohibiting division; remembrance of divine favor transforming enmity to brotherhood; rescue from brink of Hellfire; divine clarification of signs for guidance; establishment of ummah calling to good, enjoining ma'ruf, forbidding munkar as muflihun; prohibition of post-proof division; eschatological face-whitening vs face-darkening; punishment for post-faith disbelief; eternal mercy for the righteous; Quranic recitation in truth; divine justice affirmed; universal divine ownership and return; Muslim ummah as khayra ummah defined by enjoining right, forbidding wrong, and believing in Allah; conditional benefit for Ahl al-Kitab if they believed; minority of believers among them, majority fasiqun",
    keys: ["3:101","3:102","3:103","3:104","3:105","3:106","3:107","3:108","3:109","3:110"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Disbelief inconceivable with ayat recited and Rasul present", keys: ["3:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "I'tisam bi-Allah yields straight path guidance", keys: ["3:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Haqqa tuqatihi: proper measure of God-consciousness", keys: ["3:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Die only as Muslims", keys: ["3:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Habl Allah: collective adherence to divine rope", keys: ["3:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition of tafarruq (division)", keys: ["3:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ni'mah of transformed enmity to brotherhood", keys: ["3:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rescue from shafa hufratin min al-nar", keys: ["3:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ummah da'wah: inviting to khayr, amr bi-ma'ruf, nahy an munkar", keys: ["3:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Muflihun: the successful ones", keys: ["3:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-proof division brings great punishment", keys: ["3:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eschatological face colors: bayad vs sawad", keys: ["3:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-faith kufr punished", keys: ["3:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bright-faced in eternal rahmah", keys: ["3:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Quranic ayat recited in truth", keys: ["3:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine justice: no zulm for worlds", keys: ["3:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal ownership and return to Allah", keys: ["3:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khayra ummah: best nation for mankind", keys: ["3:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Three defining traits: amr, nahy, iman", keys: ["3:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Conditional benefit for Ahl al-Kitab", keys: ["3:110"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Communal unity as divine blessing requiring active maintenance", keys: ["3:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pre-Islamic enmity transformed by divine grace", keys: ["3:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eschatological anxiety reflected in facial transformation", keys: ["3:106","3:107"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Ummatic identity defined by moral activism (amr/nahy) and faith", keys: ["3:104","3:110"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Brotherhood (ikhwan) as divine gift replacing tribal enmity", keys: ["3:103"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0154","cand-0155","cand-0156"],
  notes: "Pass A Imran passage 12/12. Contains three cornerstone verses: taqwa command (3:102), habl Allah/unity (3:103), and khayra ummah (3:110). Amr bi-ma'ruf wa nahy an munkar appears twice (3:104, 3:110) establishing it as defining ummatic function. Face-color eschatology (3:106-107) unique imagery. Closes major Ahl al-Kitab discourse block.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P12
{
  // Nothing additional beyond what's embedded in verse text
}

// Extract commands from P12
{
  // 3:102 - Fear Allah properly
  p12.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:102"], excerpt: fv(102), description: "Command: fear Allah with the proper measure of His due (haqqa tuqatihi) and do not die except as Muslims." });

  // 3:103 - Hold to Allah's rope, don't divide
  p12.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:103"], excerpt: fv(103), description: "Command: hold firmly to the rope of Allah collectively and do not become divided; remember His favor." });

  // 3:104 - Establish ummah for da'wah
  p12.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:104"], excerpt: fv(104), description: "Command: let there be among you a community inviting to good, enjoining right, forbidding wrong." });

  // 3:105 - Prohibition of post-proof division
  p12.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["3:105"], excerpt: fv(105), description: "Prohibition: do not be like those who divided and differed after clear proofs came to them." });
}

// Extract terminology from P12
{
  // Habl Allah from 3:103
  const t103 = fv(103);
  const hablIdx = t103.indexOf("\u0628\u0650\u062d\u064e\u0628\u0652\u0644\u0650 \u0671\u0644\u0644\u0651\u064e\u0647\u0650");
  if (hablIdx >= 0) {
    p12.terminology.push({ term: t103.slice(hablIdx, hablIdx + 12), transliteration: "bi-habl Allah", gloss: "rope/covenant of Allah (editorial gloss)", keys: ["3:103"] });
  }

  // Khayra ummah from 3:110
  const t110 = fv(110);
  const khayraIdx = t110.indexOf("\u062e\u064e\u064a\u0652\u0631\u064e \u0623\u064f\u0645\u064e\u0651\u0629\u064d");
  if (khayraIdx >= 0) {
    p12.terminology.push({ term: t110.slice(khayraIdx, khayraIdx + 11), transliteration: "khayra ummah", gloss: "best nation/community (editorial gloss)", keys: ["3:110"] });
  }

  // Ma'ruf from 3:104
  const t104 = fv(104);
  const marufIdx = t104.indexOf("\u0671\u0644\u0652\u0645\u064e\u0639\u0652\u0631\u064f\u0648\u0641\u0650");
  if (marufIdx >= 0) {
    p12.terminology.push({ term: t104.slice(marufIdx, marufIdx + 10), transliteration: "al-ma'ruf", gloss: "what is right/good/customary (editorial gloss)", keys: ["3:104","3:110"] });
  }

  // Munkar from 3:104
  const munkarIdx = t104.indexOf("\u0671\u0644\u0652\u0645\u064f\u0646\u0643\u064e\u0631\u0650");
  if (munkarIdx >= 0) {
    p12.terminology.push({ term: t104.slice(munkarIdx, munkarIdx + 10), transliteration: "al-munkar", gloss: "what is wrong/evil/unacceptable (editorial gloss)", keys: ["3:104","3:110"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p12.json"), JSON.stringify(p12, null, 2) + "\n");
console.log("Wrote 003-al-imran-p12.json");

// ─── Candidates batch (cand-0147 through cand-0156) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-003-p9,ext-003-p10,ext-003-p11,ext-003-p12",
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

// cand-0147: Truth-concealment and talbis by People of the Book
candidates.candidates.push(makeCand("cand-0147",
  "Truth-concealment and talbis: mixing haqq with batil as deliberate deception strategy",
  undefined, "\u062d\u0642 \u0627\u0648\u0631 \u0628\u0627\u0637\u0644 \u06a9\u0627 \u0645\u0644\u0627\u067e: \u062c\u0627\u0646 \u0628\u0648\u062c\u06be \u06a9\u0631 \u062d\u0642 \u0686\u06be\u067e\u0627\u0646\u0627",
  "In 3:71: O People of the Scripture, why do you confuse the truth with falsehood and conceal the truth while you know. In 3:78: And indeed, there is among them a party who alter the Scripture with their tongues so you may think it is from the Scripture, but it is not from the Scripture. And they say, This is from Allah, but it is not from Allah. And they speak untruth about Allah while they know.",
  [{ key: "3:71", excerpt: fv(71), evidenceClass: "EXPLICIT_TEXT", rationale: "Direct condemnation of talbis (mixing truth/falsehood) and katm (concealment) performed knowingly." },
   { key: "3:78", excerpt: fv(78), evidenceClass: "EXPLICIT_TEXT", rationale: "Tongue-twisting distortion (layy alsina) presenting human alteration as divine Scripture." }],
  [],
  "Gap candidate: no dedicated talbis/truth-concealment or people-of-book topic in catalogs. Distinctive focus on deliberate epistemic corruption rather than mere disagreement. Layy alsina (3:78) describes mechanism of textual distortion."
));

// cand-0148: Covenant-selling and eschatological deprivation
candidates.candidates.push(makeCand("cand-0148",
  "Covenant-selling: exchanging Allah's covenant and oaths for small price resulting in total eschatological deprivation",
  undefined, "\u0639\u06c1\u062f \u06a9\u06cc \u0641\u0631\u0648\u062e\u062a: \u0645\u0645\u0648\u0644\u06cc \u0642\u06cc\u0645\u062a \u067e\u0631 \u0627\u0644\u0644\u06c1 \u06a9\u0627 \u0639\u06c1\u062f \u0628\u06cc\u0686\u0646\u0627",
  "In 3:77: Indeed, those who exchange the covenant of Allah and their oaths for a small price will have no share in the Hereafter, and Allah will not speak to them or look at them on the Day of Resurrection, nor will He purify them; and they will have a painful punishment.",
  [{ key: "3:77", excerpt: fv(77), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete enumeration of four eschatological deprivations: no share, no speech, no gaze, no purification, plus painful punishment." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "same-concept" },
   { topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with covenants-ahd confirmed. Distinctive as most severe covenant-violation consequence in Quran. Four-fold deprivation formula unique. Thaman qaleel emphasizes triviality of worldly gain traded."
));

// cand-0149: Universal prophetic covenant (mithaq al-nabiyyin)
candidates.candidates.push(makeCand("cand-0149",
  "Mithaq al-nabiyyin: universal covenant binding all prophets to believe in and support the confirming messenger",
  undefined, "\u0645\u06cc\u062b\u0627\u0642 \u0627\u0644\u0646\u0628\u06cc\u06cc\u0646: \u062a\u0645\u0627\u0645 \u0627\u0646\u0628\u06cc\u0627 \u06a9\u0627 \u0639\u06c1\u062f",
  "In 3:81: And when Allah took the covenant of the prophets, saying, Whatever I give you of the Scripture and wisdom and then there comes to you a messenger confirming what is with you, you must believe in him and support him. He said, Have you acknowledged and taken upon that My commitment? They said, We have acknowledged it. He said, Then bear witness, and I am with you among the witnesses.",
  [{ key: "3:81", excerpt: fv(81), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete mithaq protocol: divine offer, prophetic acknowledgment, mutual witnessing. Establishes inter-prophetic continuity centered on confirming messenger." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with covenants-ahd confirmed. Distinctive as meta-covenant encompassing all prophets rather than specific community. Musaddiq lima ma'akum establishes criterion for recognizing final messenger."
));

// cand-0150: Repentance theology — conditional acceptance and escalation closure
candidates.candidates.push(makeCand("cand-0150",
  "Repentance theology: acceptance for reformers, closure for escalating disbelievers, futility of material ransom at death",
  undefined, "\u062a\u0648\u0628\u06c1 \u06a9\u0627 \u0641\u0642\u06c1: \u0627\u0635\u0644\u0627\u062d \u06a9\u0631\u0646\u06d2 \u0648\u0627\u0644\u0648\u06ba \u06a9\u06cc \u0642\u0628\u0648\u0644\u06cc\u062a",
  "In 3:89: Except for those who repent after that and correct themselves. For indeed, Allah is Forgiving and Merciful. In 3:90: Indeed, those who reject the message after their belief and then increase in disbelief - never will their repentance be accepted, and they are the ones astray. In 3:91: Indeed, those who disbelieve and die while they are disbelievers - never would the capacity of the earth in gold be accepted from one of them.",
  [{ key: "3:89", excerpt: fv(89), evidenceClass: "EXPLICIT_TEXT", rationale: "Repentance gate remains open for those who reform (tabu wa aslahu), paired with Ghafur Raheem." },
   { key: "3:90", excerpt: fv(90), evidenceClass: "EXPLICIT_TEXT", rationale: "Escalating disbelief (izdadu kufran) permanently closes repentance." },
   { key: "3:91", excerpt: fv(91), evidenceClass: "EXPLICIT_TEXT", rationale: "Death in kufr renders all material ransom futile." }],
  [{ topicId: "repentance", layer: "curated", relationship: "same-concept" },
   { topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with repentance (curated) and divine-mercy confirmed. Distinctive three-tier structure: open (reform), closed (escalation), futile (death). Ghafur Raheem pairing anchors hope."
));

// cand-0151: True righteousness (birr) requires spending from beloved wealth
candidates.candidates.push(makeCand("cand-0151",
  "True righteousness (birr): unattainable without spending from beloved possessions as measure of sincere devotion",
  undefined, "\u062d\u0642\u06cc\u0642\u06cc \u0646\u06cc\u06a9\u06cc: \u0645\u062d\u0628\u0648\u0628 \u0645\u0627\u0644 \u0633\u06d2 \u062e\u0631\u0686 \u06a9\u06cc\u06d2 \u0628\u063a\u06cc\u0631 \u0646\u0627\u0645\u0645\u06a9\u0646",
  "In 3:92: Never will you attain the good reward until you spend from that which you love. And whatever you spend - indeed, Allah is Knowing of it.",
  [{ key: "3:92", excerpt: fv(92), evidenceClass: "EXPLICIT_TEXT", rationale: "Lan tanalu al-birr hatta tunfiqoo mimma tuhibboona: absolute precondition linking birr to sacrifice of beloved wealth." }],
  [{ topicId: "wealth-distribution", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated charity/infaq topic. Overlap with wealth-distribution (broader). Distinctive as making beloved-possession spending the necessary condition for birr, not merely recommended. Mimma tuhibboona personalizes the test."
));

// cand-0152: Ka'bah at Bakkah — first house, blessed, guidance, clear signs, security
candidates.candidates.push(makeCand("cand-0152",
  "Ka'bah at Bakkah: first house established for mankind, blessed, guidance for worlds, containing clear signs and sanctuary security",
  undefined, "\u06a9\u0639\u0628\u06c1 \u0628\u06a9\u06c1 \u0645\u06cc\u06ba: \u067e\u06c1\u0644\u0627 \u06af\u06be\u0631\u060c \u0628\u0627\u0631\u06a9\u062a \u0648\u0627\u0644\u0627\u060c \u06c1\u062f\u0627\u06cc\u062a",
  "In 3:96: Indeed, the first House established for mankind was that at Makkah - blessed and a guidance for the worlds. In 3:97: In it are clear signs such as the standing place of Abraham. And whoever enters it shall be safe.",
  [{ key: "3:96", excerpt: fv(96), evidenceClass: "EXPLICIT_TEXT", rationale: "Awwal bayt wudi'a lil-nas: primacy claim. Mubarakan wa hudan lil-alamin: dual function." },
   { key: "3:97", excerpt: fv(97), evidenceClass: "EXPLICIT_TEXT", rationale: "Ayat bayyinat includes Maqam Ibrahim. Man dakhalahu kana aminan: sanctuary inviolability." }],
  [{ topicId: "ibrahim-story", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with ibrahim-story via Maqam Ibrahim. Gap candidate: no hajj-umrah-pilgrimage topic verified in catalogs. Distinctive five-fold characterization: awwal, mubarak, huda, ayat bayyinat, amn."
));

// cand-0153: Hajj as universal obligation conditional on ability (istita'ah)
candidates.candidates.push(makeCand("cand-0153",
  "Hajj obligation: pilgrimage to the House as universal duty upon mankind conditional on finding a way (istita'ah)",
  undefined, "\u062d\u062c \u06a9\u06cc \u0641\u0631\u0636\u06cc\u062a: \u0627\u0633\u062a\u0637\u0627\u0639\u062a \u067e\u0631 \u0645\u0634\u0631\u0648\u0637",
  "In 3:97: And due to Allah from the people is a pilgrimage to the House - for whoever is able to find thereto a way. But whoever disbelieves - then indeed, Allah is free from need of the worlds.",
  [{ key: "3:97", excerpt: fv(97), evidenceClass: "EXPLICIT_TEXT", rationale: "Wa lillahi ala al-nasi hijju al-bayti mani istata'a ilayhi sabeelan: obligation stated with explicit ability condition. Ghaniyy an al-alamin negates divine need." }],
  [{ topicId: "ibrahim-story", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: hajj-umrah-pilgrimage not verified in catalogs. Distinctive as sole Quranic verse establishing Hajj obligation with istita'ah condition. Divine self-sufficiency (Ghaniyy) frames obligation as purely for human benefit."
));

// cand-0154: Habl Allah — collective adherence to divine rope prohibiting division
candidates.candidates.push(makeCand("cand-0154",
  "Habl Allah: collective adherence to Allah's rope as antidote to division, remembering divine favor of transformed enmity",
  undefined, "\u062d\u0628\u0644 \u0627\u0644\u0644\u06c1: \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u0631\u0633\u06cc \u06a9\u0648 \u0645\u0636\u0628\u0648\u0637\u06cc \u0633\u06d2 \u067e\u06a9\u0691\u0646\u0627",
  "In 3:103: And hold firmly to the rope of Allah all together and do not become divided. And remember the favor of Allah upon you - when you were enemies and He brought your hearts together and you became, by His favor, brothers. And you were on the edge of a pit of the Fire, and He saved you from it.",
  [{ key: "3:103", excerpt: fv(103), evidenceClass: "EXPLICIT_TEXT", rationale: "Wa'tasimu bi-habl Allah jami'an wa la tafarraqoo: dual command (hold + don't divide). Ni'mah remembrance grounds unity in gratitude. Rescue from fire-edge underscores stakes." }],
  [{ topicId: "brotherhood-islam", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with brotherhood-islam confirmed. Distinctive triple grounding of unity: divine rope, remembered favor, rescue from destruction. Ikhwan bi-ni'matihi defines brotherhood as divine gift not natural bond."
));

// cand-0155: Amr bi-ma'ruf wa nahy an munkar as defining ummatic function
candidates.candidates.push(makeCand("cand-0155",
  "Amr bi-ma'ruf wa nahy an munkar: enjoining right and forbidding wrong as defining characteristic of the best nation",
  undefined, "\u0627\u0645\u0631 \u0628\u0627\u0644\u0645\u0639\u0631\u0648\u0641 \u0648 \u0646\u06c1\u06cc \u0639\u0646 \u0627\u0644\u0645\u0646\u06a9\u0631: \u0628\u06c1\u062a\u0631\u06cc\u0646 \u0627\u0645\u062a \u06a9\u06cc \u067e\u06c1\u0686\u0627\u0646",
  "In 3:104: And let there be arising from you a nation inviting to all that is good, enjoining what is right and forbidding what is wrong, and those will be the successful. In 3:110: You are the best nation produced for mankind. You enjoin what is right and forbid what is wrong and believe in Allah.",
  [{ key: "3:104", excerpt: fv(104), evidenceClass: "EXPLICIT_TEXT", rationale: "Waltakun minkum ummatun: imperative establishment of moral activist community. Muflihun as outcome." },
   { key: "3:110", excerpt: fv(110), evidenceClass: "EXPLICIT_TEXT", rationale: "Kuntum khayra ummah: superlative status defined by amr/nahy/iman triad." }],
  [],
  "Gap candidate: no dedicated amr-bil-maruf topic. Double occurrence (3:104, 3:110) within same passage emphasizes centrality. Khayra ummah status explicitly contingent on this function plus iman."
));

// cand-0156: Khayra ummah — Muslim community as best nation produced for mankind
candidates.candidates.push(makeCand("cand-0156",
  "Khayra ummah: Muslim community declared best nation produced for mankind based on moral activism and faith",
  undefined, "\u062e\u06cc\u0631 \u0627\u0645\u062a: \u0627\u0646\u0633\u0627\u0646\u06cc\u062a \u06a9\u06d2 \u0644\u06cc\u06d2 \u0628\u06c1\u062a\u0631\u06cc\u0646 \u06af\u0631\u0648\u06c1",
  "In 3:110: You are the best nation produced for mankind. You enjoin what is right and forbid what is wrong and believe in Allah. If only the People of the Scripture had believed, it would have been better for them. Among them are believers, but most of them are defiantly disobedient.",
  [{ key: "3:110", excerpt: fv(110), evidenceClass: "EXPLICIT_TEXT", rationale: "Kuntum khayra ummatin ukhrijat lil-nas: superlative designation with public purpose (lil-nas). Three defining traits enumerated. Conditional Ahl al-Kitab benefit noted." }],
  [],
  "Gap candidate: no dedicated ummah/khayra-ummah or people-of-book topic in catalogs. Distinctive as sole Quranic superlative designation for Muslim community. Ukhrijat lil-nas implies outward-facing mission. Majority fasiqun among Ahl al-Kitab provides contrast."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-015.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-015.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-003-p9 through ext-003-p12)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0147 through cand-${String(146 + candidates.candidates.length).padStart(4,'0')})`);
