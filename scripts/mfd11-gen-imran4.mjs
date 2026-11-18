// MFD-11 Imran Pass 4 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Ali 'Imran 3:111-150 (Passages 13-16, Candidates cand-0157..cand-0166).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "003-0111-0150.json");
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

console.log("Generating Imran Pass 4 files from verbatim corpus (3:111-150)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T18:10:00.000Z";

// ─── Passage 13: 3:111–115 ────────────────────────────────────────────────────────
const p13 = {
  extractionId: "ext-003-p13",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 111, toAyah: 115, label: "Ali 'Imran — Limited harm of disbelievers; abasement stamped upon them except rope from Allah and rope from people; wrath and poverty earned through disbelief, killing prophets, transgression; among People of Book an upright community reciting ayat at night prostrating; believing in Allah and Last Day enjoining good forbidding evil hastening to good deeds among righteous; whatever good they do never denied; Allah knows muttaqin" },
  verseKeys: ["3:111","3:112","3:113","3:114","3:115"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `3:${i+111}`, text: fv(i+111) })),
  mainSubject: {
    label: "Limited capacity of hostile factions to harm believers; abasement (dhillah) and destitution (maskanah) imposed upon them except through divine or human covenant; divine wrath earned through systematic disbelief, unjust killing of prophets, and habitual transgression; recognition of an upright community (ummah qaimah) among People of the Book who recite ayat at night, prostrate, believe in Allah and Last Day, enjoin good, forbid evil, hasten to good deeds; their righteousness acknowledged; no good deed of theirs will be denied; Allah's knowledge of the muttaqin",
    keys: ["3:111","3:112","3:113","3:114","3:115"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Limited harm: only annoyance (adhan)", keys: ["3:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Military defeat: turning backs when fighting", keys: ["3:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No aid for hostile faction", keys: ["3:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dhillah (abasement) stamped wherever found", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exception: habl min Allah wa habl min al-nas", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine wrath earned (ba'u bi-ghadab)", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Maskanah (destitution/poverty) stamped upon them", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cause: disbelief in ayat of Allah", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cause: killing prophets without right", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cause: disobedience and habitual transgression", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Not all same: ummah qaimah among Ahl al-Kitab", keys: ["3:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Night recitation and prostration", keys: ["3:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Belief in Allah and Last Day", keys: ["3:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Amr bi-ma'ruf wa nahy an munkar by Ahl al-Kitab", keys: ["3:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hastening to khayrat", keys: ["3:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Among the salihin", keys: ["3:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Good deeds never denied (lan yukfaroohu)", keys: ["3:115"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah Aleem bi-al-muttaqin", keys: ["3:115"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Unjust killing of prophets by factions among People of the Book", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Abasement as consequence of systemic covenant-breaking", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Righteous minority maintaining devotion amid corrupt majority", keys: ["3:113","3:114"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Destitution (maskanah) as socio-spiritual consequence of transgression", keys: ["3:112"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0157","cand-0158"],
  notes: "Pass A Imran passage 13/16. Continues Ahl al-Kitab discourse from p12. Introduces dual-rope exception (habl min Allah + habl min al-nas) to universal abasement. Ummah qaimah (3:113-114) provides positive model within Ahl al-Kitab paralleling khayra ummah (3:110). Amr/nahy appears again confirming its cross-communal moral significance.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P13
{
  // Aleem from 3:115
  const t115 = fv(115);
  const aleemIdx = t115.indexOf("\u0639َ\u0644ِ\u064a\u0645ُ\u0628ِ\u0671لْ\u0645ُ\u062aَ\u0651\u0642ِ\u064a\u0646َ");
  if (aleemIdx >= 0) {
    p13.divineNamesAndAttributes.push({ term: t115.slice(aleemIdx, aleemIdx + 8), transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["3:115"] });
  }
}

// Extract terminology from P13
{
  // Habl from 3:112
  const t112 = fv(112);
  const hablIdx = t112.indexOf("\u0628ِ\u062dَ\u0628ْ\u0644ٍ");
  if (hablIdx >= 0) {
    p13.terminology.push({ term: t112.slice(hablIdx, hablIdx + 7), transliteration: "bi-habl", gloss: "rope/covenant (editorial gloss)", keys: ["3:112"] });
  }

  // Dhillah from 3:112
  const dhillahIdx = t112.indexOf("\u0671\u0644\u0630ِ\u0644َ\u0651\u0629ُ");
  if (dhillahIdx >= 0) {
    p13.terminology.push({ term: t112.slice(dhillahIdx, dhillahIdx + 9), transliteration: "al-dhillah", gloss: "abasement/humiliation (editorial gloss)", keys: ["3:112"] });
  }

  // Maskanah from 3:112
  const maskanahIdx = t112.indexOf("\u0671لْ\u0645َ\u0633ْ\u0643َ\u0646َ\u0629ُ");
  if (maskanahIdx >= 0) {
    p13.terminology.push({ term: t112.slice(maskanahIdx, maskanahIdx + 12), transliteration: "al-maskanah", gloss: "destitution/poverty (editorial gloss)", keys: ["3:112"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p13.json"), JSON.stringify(p13, null, 2) + "\n");
console.log("Wrote 003-al-imran-p13.json");

// ─── Passage 14: 3:116–120 ────────────────────────────────────────────────────────
const p14 = {
  extractionId: "ext-003-p14",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 116, toAyah: 120, label: "Ali 'Imran — Wealth and children won't avail disbelievers against Allah; companions of Fire abiding eternally; parable of worldly spending like frost-laden wind destroying crop of self-wrongers; Allah did not wrong them but they wronged themselves; prohibition of taking intimates from outside ranks who spare no corruption; hatred appeared from mouths what breasts conceal greater; clear signs if you reason; you love them they don't love you; you believe in all scripture; when meet say we believe alone bite fingertips in rage; say die in rage; Allah knows what is in breasts; good touching you grieves them evil striking you rejoices them; patience and taqwa neutralize their plot; Allah encompasses what they do" },
  verseKeys: ["3:116","3:117","3:118","3:119","3:120"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `3:${i+116}`, text: fv(i+116) })),
  mainSubject: {
    label: "Futility of material wealth and progeny against divine judgment; eternal damnation of disbelievers; parable of worldly expenditure as destructive frost-wind annihilating harvest of self-wrongers; divine justice affirmed: Allah did not wrong them, they wronged themselves; prohibition of intimate alliances (bitanah) with those outside the faith who actively seek Muslim ruin; exposed hatred vs concealed malice; divine clarification of signs for those who reason; asymmetry of affection: believers love hypocrites who reciprocate with hidden rage; biting fingertips in private as sign of suppressed fury; command to declare 'die in your rage'; divine knowledge of innermost thoughts; emotional Schadenfreude of enemies toward Muslim fortune/misfortune; sabr and taqwa as shield against enemy plotting; divine encompassment of all actions",
    keys: ["3:116","3:117","3:118","3:119","3:120"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Wealth and children cannot avert divine punishment", keys: ["3:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Companions of Fire: eternal abode", keys: ["3:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Parable: worldly spending like frost-wind destroying harvest", keys: ["3:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-inflicted destruction: zulm anfusihim", keys: ["3:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine non-injustice affirmed", keys: ["3:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: bitanah min dunikum", keys: ["3:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "La yaloonakum khabalan: they spare no ruin", keys: ["3:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hatred manifest from mouths", keys: ["3:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Concealed malice greater than expressed hatred", keys: ["3:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bayyanna lakum al-ayat: signs clarified for reasoning", keys: ["3:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Asymmetric love: tuhibboonahum / la yuhibboonakum", keys: ["3:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Biting fingertips in rage when alone", keys: ["3:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: mutoo bi-ghaythikum", keys: ["3:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Aleem bi-dhat al-sudoor", keys: ["3:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enemy grief at Muslim good fortune", keys: ["3:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enemy joy at Muslim misfortune", keys: ["3:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sabr + taqwa neutralizes kayd", keys: ["3:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Muheet: Allah encompasses all actions", keys: ["3:120"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Self-deception through misplaced trust in hostile parties", keys: ["3:118","3:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Suppressed rage as indicator of deep-seated enmity", keys: ["3:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Emotional vulnerability to enemy schadenfreude", keys: ["3:120"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Worldly expenditure without faith as economically destructive", keys: ["3:117"], evidenceClass: "THEMATIC" }
  ],
  relationships: [
    { label: "Bitanah (intimate alliance) boundaries between faith communities", keys: ["3:118"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0159","cand-0160"],
  notes: "Pass A Imran passage 14/16. Frost-wind parable (3:117) unique agricultural metaphor for futility of godless charity. Bitanah prohibition (3:118) establishes loyalty boundaries. Fingertip-biting imagery (3:119) vivid psychological portrait. Sabr-taqwa pairing (3:120) as strategic defense formula.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P14
{
  // 3:118 - Prohibition: do not take bitanah
  p14.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["3:118"], excerpt: fv(118), description: "Prohibition: do not take as intimates (bitanah) those outside your ranks who spare no corruption against you." });

  // 3:119 - Command: Say die in your rage
  p14.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:119"], excerpt: fv(119), description: "Command to Prophet: tell the enraged enemies to die in their rage; Allah knows what is in the breasts." });
}

// Extract divine names from P14
{
  // Muheet from 3:120
  const t120 = fv(120);
  const muheetIdx = t120.indexOf("\u0645ُ\u062dِ\u064a\u0637ٌ");
  if (muheetIdx >= 0) {
    p14.divineNamesAndAttributes.push({ term: t120.slice(muheetIdx, muheetIdx + 7), transliteration: "Muheet", gloss: "All-Encompassing (editorial gloss)", keys: ["3:120"] });
  }
}

// Extract terminology from P14
{
  // Bitanah from 3:118
  const t118 = fv(118);
  const bitanahIdx = t118.indexOf("\u0628ِ\u0637َ\u0627\u0646َ\u0629ً");
  if (bitanahIdx >= 0) {
    p14.terminology.push({ term: t118.slice(bitanahIdx, bitanahIdx + 9), transliteration: "bitanah", gloss: "intimate allies/inner circle (editorial gloss)", keys: ["3:118"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p14.json"), JSON.stringify(p14, null, 2) + "\n");
console.log("Wrote 003-al-imran-p14.json");

// ─── Passage 15: 3:121–135 ────────────────────────────────────────────────────────
const p15 = {
  extractionId: "ext-003-p15",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 121, toAyah: 135, label: "Ali 'Imran — Uhud deployment; two groups almost lost courage Allah was their ally; let believers rely on Allah; Badr victory recalled when few; fear Allah be grateful; reinforcement with 3000 angels descending; if patient and fear Allah and enemy comes suddenly 5000 marked angels; glad tidings and reassurance only; victory only from Allah Aziz Hakeem; cut off or suppress disbelievers so return frustrated; not for you whether He forgives or punishes they are wrongdoers; to Allah belongs heavens earth forgives whom wills punishes whom wills Ghafur Raheem; prohibition of riba doubled multiplied; fear Allah succeed; fear Fire prepared for disbelievers; obey Allah and Messenger receive mercy; hasten to forgiveness and Garden wide as heavens earth prepared for muttaqin; who spend in ease and hardship restrain anger pardon people Allah loves muhsinin; who commit indecency or wrong self remember Allah seek forgiveness for sins who forgives except Allah do not persist knowingly; reward forgiveness and Gardens rivers flowing abiding excellent reward of workers" },
  verseKeys: ["3:121","3:122","3:123","3:124","3:125","3:126","3:127","3:128","3:129","3:130","3:131","3:132","3:133","3:134","3:135"],
  arabicExcerpts: Array.from({length:15}, (_,i) => ({ key: `3:${i+121}`, text: fv(i+121) })),
  mainSubject: {
    label: "Uhud battle context: Prophet assigning stations; two parties nearly faltered but Allah was their protector; tawakkul command; Badr victory recalled as precedent of divine aid despite weakness; gratitude linked to taqwa; angelic reinforcement promised: 3000 descending angels, escalating to 5000 marked angels conditional on sabr and taqwa during sudden attack; angelic aid as bushra and heart-reassurance only; victory exclusively from Allah al-Aziz al-Hakeem; strategic purpose: cutting down or suppressing disbelievers to frustrate them; prophetic non-agency over divine forgiveness/punishment decision; universal divine ownership; Ghafur Raheem; riba prohibition with emphasis on compounding multiplication; fire warning for disbelievers; obedience to Allah and Messenger as path to mercy; racing toward maghfirah and Jannah spanning heavens and earth prepared for muttaqin; defining traits of muttaqin: spending in prosperity and adversity, restraining anger (kazimin al-ghayth), pardoning people (afeena an al-nas), Allah loves muhsinin; repentance pattern: committing fahishah or self-wrong, remembering Allah, seeking forgiveness, not persisting knowingly; rhetorical question: who forgives sins except Allah; reward: maghfirah and gardens with rivers, eternal abode, excellent reward of amilin",
    keys: ["3:121","3:122","3:123","3:124","3:125","3:126","3:127","3:128","3:129","3:130","3:131","3:132","3:133","3:134","3:135"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Uhud deployment: tabwi' al-mumineena maqa'id", keys: ["3:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Two parties nearly lost courage (tafshala)", keys: ["3:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah waliyyuhuma: divine protection for wavering groups", keys: ["3:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawakkul command: ala Allah falyatawakkal al-muminun", keys: ["3:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Badr victory recalled: nasarakum Allah bi-Badr", keys: ["3:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Weakness at Badr: antum athillah", keys: ["3:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taqwa-gratitude link: ittaqoo Allah la'allakum tashkuroona", keys: ["3:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "3000 angels descending (munzaleen)", keys: ["3:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "5000 marked angels (musawwimeen) conditional on sabr+taqwa", keys: ["3:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bushra and tatma'inna quloob: reassurance function", keys: ["3:126"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Victory only from Allah al-Aziz al-Hakeem", keys: ["3:126"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Strategic aim: cut off or suppress disbelievers", keys: ["3:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic non-agency over forgiveness/punishment", keys: ["3:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal ownership: lillahi ma fi al-samawat wa ma fi al-ard", keys: ["3:129"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ghafur Raheem paired after punishment mention", keys: ["3:129"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Riba prohibition: ad'afan muda'afah", keys: ["3:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taqwa-success link: ittaqoo Allah la'allakum tuflihun", keys: ["3:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fire prepared for kafirin", keys: ["3:131"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Obedience to Allah and Rasul for rahmah", keys: ["3:132"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Race to maghfirah and Jannah wide as heavens/earth", keys: ["3:133"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spending in sarra' and darra'", keys: ["3:134"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kazimin al-ghayth: restraining anger", keys: ["3:134"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Afeena an al-nas: pardoning people", keys: ["3:134"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yuhibbu al-muhsinin", keys: ["3:134"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-sin repentance pattern: dhikr + istighfar + non-persistence", keys: ["3:135"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rhetorical: man yaghfiru al-dhunub illa Allah", keys: ["3:135"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Battle of Badr as historical precedent for divine military aid", keys: ["3:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Uhud deployment and internal crisis of confidence", keys: ["3:121","3:122"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Wavering faith under military pressure", keys: ["3:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Anger restraint as spiritual discipline", keys: ["3:134"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance as immediate response to moral failure", keys: ["3:135"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Riba prohibition targeting compounded interest exploitation", keys: ["3:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Charitable spending across economic conditions", keys: ["3:134"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0161","cand-0162","cand-0163","cand-0164"],
  notes: "Pass A Imran passage 15/16. Densest passage in this range covering Uhud, Badr, angelic reinforcement, riba, and muttaqin ethics. Kazimin al-ghayth (3:134) is primary Quranic anger-management text. Riba verse (3:130) specifies compounding (ad'afan muda'afah). Repentance formula (3:135) most detailed in Quran. Ni'ma ajr al-amilin closes with worker-reward motif.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P15
{
  // 3:122 - Tawakkul command
  p15.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:122"], excerpt: fv(122), description: "Command: upon Allah let the believers rely (tawakkul)." });

  // 3:123 - Fear Allah, be grateful
  p15.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:123"], excerpt: fv(123), description: "Command: fear Allah so that you may be grateful." });

  // 3:130 - Riba prohibition
  p15.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["3:130"], excerpt: fv(130), description: "Prohibition: do not consume riba doubled and multiplied; fear Allah that you may succeed." });

  // 3:131 - Fear the Fire
  p15.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:131"], excerpt: fv(131), description: "Command: fear the Fire prepared for the disbelievers." });

  // 3:132 - Obey Allah and Messenger
  p15.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:132"], excerpt: fv(132), description: "Command: obey Allah and the Messenger that you may receive mercy." });

  // 3:133 - Hasten to forgiveness and Garden
  p15.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:133"], excerpt: fv(133), description: "Command: race toward forgiveness from your Lord and a Garden as wide as heavens and earth." });
}

// Extract divine names from P15
{
  // Samee' Aleem from 3:121
  const t121 = fv(121);
  const saIdx = t121.indexOf("\u0633َ\u0645ِ\u064a\u0639ٌ \u0639َ\u0644ِ\u064a\u0645ٌ");
  if (saIdx >= 0) {
    p15.divineNamesAndAttributes.push({ term: t121.slice(saIdx, saIdx + 14), transliteration: "Samee' Aleem", gloss: "All-Hearing, All-Knowing (editorial gloss)", keys: ["3:121"] });
  }

  // Aziz Hakeem from 3:126
  const t126 = fv(126);
  const ahIdx = t126.indexOf("\u0671لْ\u0639َ\u0632ِ\u064a\u0632ِ \u0671لْ\u062dَ\u0643ِ\u064a\u0645ِ");
  if (ahIdx >= 0) {
    p15.divineNamesAndAttributes.push({ term: t126.slice(ahIdx, ahIdx + 20), transliteration: "al-Aziz al-Hakeem", gloss: "the Exalted in Might, the Wise (editorial gloss)", keys: ["3:126"] });
  }

  // Ghafur Raheem from 3:129
  const t129 = fv(129);
  const grIdx = t129.indexOf("\u063aَ\u0641ُ\u0648\u0631ٌ \u0631َ\u0651\u062dِ\u064a\u0645ٌ");
  if (grIdx >= 0) {
    p15.divineNamesAndAttributes.push({ term: t129.slice(grIdx, grIdx + 14), transliteration: "Ghafur Raheem", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["3:129"] });
  }
}

// Extract terminology from P15
{
  // Riba from 3:130
  const t130 = fv(130);
  const ribaIdx = t130.indexOf("\u0671\u0644\u0631ِ\u0651\u0628َ\u0648َ\u0627");
  if (ribaIdx >= 0) {
    p15.terminology.push({ term: t130.slice(ribaIdx, ribaIdx + 10), transliteration: "al-riba", gloss: "usury/interest (editorial gloss)", keys: ["3:130"] });
  }

  // Kazimin al-ghayth from 3:134
  const t134 = fv(134);
  const kazimIdx = t134.indexOf("\u0671لْ\u0643َ\u0627\u0638ِ\u0645ِ\u064a\u0646َ \u0671لْ\u063aَ\u064aْ\u0638َ");
  if (kazimIdx >= 0) {
    p15.terminology.push({ term: t134.slice(kazimIdx, kazimIdx + 22), transliteration: "al-kazimin al-ghayth", gloss: "those who restrain anger (editorial gloss)", keys: ["3:134"] });
  }

  // Afeena an al-nas from 3:134
  const afeenaIdx = t134.indexOf("\u0671لْ\u0639َ\u0627\u0641ِ\u064a\u0646َ \u0639َ\u0646ِ \u0671\u0644\u0646َ\u0651\u0627\u0633ِ");
  if (afeenaIdx >= 0) {
    p15.terminology.push({ term: t134.slice(afeenaIdx, afeenaIdx + 22), transliteration: "al-afeena an al-nas", gloss: "those who pardon people (editorial gloss)", keys: ["3:134"] });
  }
}

// Extract taught supplication from P15
{
  // Note: 3:147 contains the rabbana supplication but that's in P16 range per our split.
  // However 3:135 describes the repentance pattern which includes istighfar.
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p15.json"), JSON.stringify(p15, null, 2) + "\n");
console.log("Wrote 003-al-imran-p15.json");

// ─── Passage 16: 3:136–150 ────────────────────────────────────────────────────────
const p16 = {
  extractionId: "ext-003-p16",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 136, toAyah: 150, label: "Ali 'Imran — Reward of muttaqin: forgiveness and Gardens beneath rivers flowing; sunan of past nations travel earth see end of deniers; bayan for people guidance and admonition for muttaqin; do not weaken or grieve you are superior if believers; wound touching you similar wound touched them days alternate so Allah knows believers takes martyrs Allah does not love zalimin; purify believers destroy disbelievers; do you think enter Jannah before Allah makes evident those who strive and those patient; wished for death before encountering now see it looking on; Muhammad only messenger messengers passed before if dies or killed turn back on heels whoever turns back harms Allah nothing Allah rewards shakirin; no soul dies except by Allah's permission appointed term; whoever wants world reward given whoever wants akhirah reward given reward shakirin; many prophets fought alongside ribbiyyun did not weaken nor submit Allah loves sabirin; their saying rabbana forgive sins excesses firm feet grant victory over kafirin; Allah gave them world reward and good akhirah reward Allah loves muhsinin; O believers if obey those who disbelieve turn back on heels become losers; Allah mawlakum best of helpers" },
  verseKeys: ["3:136","3:137","3:138","3:139","3:140","3:141","3:142","3:143","3:144","3:145","3:146","3:147","3:148","3:149","3:150"],
  arabicExcerpts: Array.from({length:15}, (_,i) => ({ key: `3:${i+136}`, text: fv(i+136) })),
  mainSubject: {
    label: "Reward confirmation for muttaqin: maghfirah and gardens with rivers; historical precedent (sunan) inviting empirical observation of deniers' fate; Quran as bayan, huda, maw'ithah; encouragement against weakness and grief: believers are superior; reciprocal wounding principle (qarh mithluhu); alternating days (ayyam nudawiluha) as divine test mechanism; martyr selection (shuhada'); purification of believers and destruction of disbelievers; challenge: entering Jannah requires proven jihad and sabr; prior wish for martyrdom now realized; Muhammad's mortality affirmed: rasool like previous messengers; turning back on heels harms only self; Allah rewards shakirin; death by divine permission only (kitaban mu'ajjalan); dual reward system: world or akhirah based on intention; prophetic precedent: many prophets fought with ribbiyyun without weakening; Allah loves sabirin; taught supplication (rabbana): forgiveness for sins/excesses, firm feet, victory over kafirin; dual reward granted: world + good akhirah; Allah loves muhsinin; warning: obeying disbelievers leads to regression and loss; Allah as mawla and khayr al-nasirin",
    keys: ["3:136","3:137","3:138","3:139","3:140","3:141","3:142","3:143","3:144","3:145","3:146","3:147","3:148","3:149","3:150"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Muttaqin reward: maghfirah + jannat + rivers + eternal", keys: ["3:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ni'ma ajr al-amilin: excellent worker reward", keys: ["3:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sunan min qablikum: historical precedents", keys: ["3:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Empirical command: siroo fi al-ard fa-onthuroo", keys: ["3:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Quran as bayan + huda + maw'ithah", keys: ["3:138"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Encouragement: la tahinu wa la tahzanu", keys: ["3:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Antumu al-a'lawn: superiority conditional on iman", keys: ["3:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reciprocal wounding: qarh mithluhu", keys: ["3:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ayyam nudawiluha: alternating vicissitudes", keys: ["3:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine knowledge of believers and martyr selection", keys: ["3:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah la yuhibbu al-zalimin", keys: ["3:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tamhis: purification of believers", keys: ["3:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mahq: destruction of disbelievers", keys: ["3:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jannah entry requires proven jihad and sabr", keys: ["3:142"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prior martyrdom wish now confronted", keys: ["3:143"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Muhammad's mortality: rasool like predecessors", keys: ["3:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Turning back on heels: self-harm only", keys: ["3:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah rewards shakirin", keys: ["3:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Death by divine permission: kitaban mu'ajjalan", keys: ["3:145"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dual reward based on intention: dunia or akhirah", keys: ["3:145"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ribbiyyun: devout scholars fighting alongside prophets", keys: ["3:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No weakening or submission in Allah's path", keys: ["3:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yuhibbu al-sabirin", keys: ["3:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taught supplication: rabbana ighfir lana...", keys: ["3:147"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dual reward: thawab al-dunya + husn thawab al-akhirah", keys: ["3:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Warning: obeying disbelievers causes regression", keys: ["3:149"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah mawlakum wa huwa khayr al-nasirin", keys: ["3:150"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Many prophets fought with ribbiyyun without losing heart", keys: ["3:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Muhammad's mortality placed in prophetic succession", keys: ["3:144"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Grief and weakness as natural responses to battlefield loss", keys: ["3:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Testing through alternating fortune and misfortune", keys: ["3:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Martyrdom aspiration tested by actual encounter", keys: ["3:143"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Historical empiricism: traveling to observe civilizational outcomes", keys: ["3:137"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0165","cand-0166"],
  notes: "Pass A Imran passage 16/16. Contains key Uhud aftermath theology: ayyam nudawiluha (3:140), tamhis/mahq (3:141), prophetic mortality (3:144), ribbiyyun precedent (3:146), rabbana supplication (3:147). Closes major battle-theology block. Mawla/khayr al-nasirin (3:150) provides reassurance anchor.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P16
{
  // 3:137 - Travel and observe
  p16.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:137"], excerpt: fv(137), description: "Command: travel through the earth and observe the outcome of the deniers." });

  // 3:139 - Do not weaken or grieve
  p16.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:139"], excerpt: fv(139), description: "Command: do not weaken and do not grieve; you are superior if true believers." });

  // 3:149 - Warning against obeying disbelievers
  p16.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["3:149"], excerpt: fv(149), description: "Warning/prohibition: if you obey those who disbelieve, they will turn you back on your heels as losers." });
}

// Extract divine names from P16
{
  // Mawla from 3:150
  const t150 = fv(150);
  const mawlaIdx = t150.indexOf("\u0645َ\u0648ْ\u0644َ\u0627\u0643ُ\u0645ُ");
  if (mawlaIdx >= 0) {
    p16.divineNamesAndAttributes.push({ term: t150.slice(mawlaIdx, mawlaIdx + 10), transliteration: "Mawlakum", gloss: "your Protector/Master (editorial gloss)", keys: ["3:150"] });
  }
}

// Extract taught supplication from P16
{
  // 3:147 - Rabbana ighfir lana
  p16.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["3:147"], excerpt: fv(147), description: "Supplication of the steadfast: Our Lord, forgive us our sins and excesses in our affairs, plant firmly our feet, and grant us victory over the disbelieving people." });
}

// Extract terminology from P16
{
  // Ribbiyyun from 3:146
  const t146 = fv(146);
  const ribbiIdx = t146.indexOf("\u0631ِ\u0628ِ\u0651\u064aُ\u0648\u0646َ");
  if (ribbiIdx >= 0) {
    p16.terminology.push({ term: t146.slice(ribbiIdx, ribbiIdx + 10), transliteration: "ribbiyyun", gloss: "devout scholars/companions of prophets (editorial gloss)", keys: ["3:146"] });
  }

  // Sunan from 3:137
  const t137 = fv(137);
  const sunanIdx = t137.indexOf("\u0633ُ\u0646َ\u0646ٌ");
  if (sunanIdx >= 0) {
    p16.terminology.push({ term: t137.slice(sunanIdx, sunanIdx + 6), transliteration: "sunan", gloss: "precedents/ways/customs (editorial gloss)", keys: ["3:137"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p16.json"), JSON.stringify(p16, null, 2) + "\n");
console.log("Wrote 003-al-imran-p16.json");

// ─── Candidates batch (cand-0157 through cand-0166) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-003-p13,ext-003-p14,ext-003-p15,ext-003-p16",
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

// cand-0157: Dual-rope exception to universal abasement
candidates.candidates.push(makeCand("cand-0157",
  "Dual-rope exception: abasement lifted only through covenant from Allah and covenant from people",
  undefined, "\u062f\u0648\u06af\u0646\u06cc \u0631\u0633\u06cc: \u0627\u0644\u0644\u06c1 \u0627\u0648\u0631 \u0644\u0648\u06af\u0648\u06ba \u06a9\u0627 \u0639\u06c1\u062f",
  "In 3:112: They have been put under humiliation wherever they are overtaken, except for a covenant from Allah and a rope from the Muslims. And they have drawn upon themselves anger from Allah and have been put under destitution.",
  [{ key: "3:112", excerpt: fv(112), evidenceClass: "EXPLICIT_TEXT", rationale: "Illa bi-hablin min Allahi wa hablin min al-nas: dual exception clause specifying both divine and communal covenants as sole escape from universal abasement." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated habl/dual-covenant topic. Distinctive as only verse pairing divine and human ropes as joint exception. Connects to habl Allah in 3:103 (p12). Dhillah + maskanah double-stamping unique."
));

// cand-0158: Ummah qaimah — righteous community among People of the Book
candidates.candidates.push(makeCand("cand-0158",
  "Ummah qaimah: upright community among People of the Book practicing night devotion, amr/nahy, and hastening to good",
  undefined, "\u0627\u0645\u062a \u0642\u0627\u0626\u0645\u06c1: \u0627\u06c1\u0644 \u06a9\u062a\u0627\u0628 \u0645\u06cc\u06ba \u0646\u06cc\u06a9 \u06af\u0631\u0648\u06c1",
  "In 3:113-114: They are not all the same; among the People of the Scripture is a community standing in obedience, reciting the verses of Allah during periods of the night and prostrating. They believe in Allah and the Last Day, and they enjoin what is right and forbid what is wrong and hasten to good deeds. And those are among the righteous.",
  [{ key: "3:113", excerpt: fv(113), evidenceClass: "EXPLICIT_TEXT", rationale: "Ummatun qaimatun yatloona ayati Allahi ana'a al-layli wa hum yasjudun: night devotion as distinguishing mark." },
   { key: "3:114", excerpt: fv(114), evidenceClass: "EXPLICIT_TEXT", rationale: "Full ethical profile: iman + amr/nahy + musara'ah fi al-khayrat + min al-salihin." }],
  [],
  "Gap candidate: no dedicated people-of-book-righteous or ummah-qaimah topic. Parallels khayra ummah (3:110) with identical amr/nahy vocabulary. Provides theological basis for recognizing righteousness outside Muslim community."
));

// cand-0159: Frost-wind parable — futility of godless worldly expenditure
candidates.candidates.push(makeCand("cand-0159",
  "Frost-wind parable: worldly spending without faith likened to frost-laden wind destroying harvest of self-wrongers",
  undefined, "\u062a\u0634\u0628\u06cc\u06c1 \u0628\u0631\u0641\u06cc\u0644\u06cc \u06c1\u0648\u0627: \u0628\u06d2 \u0627\u06cc\u0645\u0627\u0646 \u062e\u0631\u0686 \u06a9\u06cc \u0645\u062b\u0627\u0644",
  "In 3:117: The example of what they spend in this worldly life is like that of a wind containing frost which strikes the harvest of a people who have wronged themselves and destroys it. And Allah has not wronged them, but they wrong themselves.",
  [{ key: "3:117", excerpt: fv(117), evidenceClass: "EXPLICIT_TEXT", rationale: "Mathalu ma yunfiqoona... ka-mathali reehin feeha sirrun: complete agricultural parable linking godless charity to crop destruction. Self-wronging affirmed twice." }],
  [],
  "Gap candidate: no dedicated mathal/parable or worldly-spending-futility topic. Unique agricultural metaphor in Quran. Contrasts sharply with birr-spending (3:92, p11). Zulm anfusihim framing emphasizes self-inflicted nature."
));

// cand-0160: Bitanah prohibition — intimate alliance boundaries between faith communities
candidates.candidates.push(makeCand("cand-0160",
  "Bitanah prohibition: forbidding intimate alliances with those outside the faith who actively seek Muslim corruption",
  undefined, "\u0628\u0637\u0627\u0646\u06c1 \u06a9\u06cc \u0645\u0645\u0646\u0648\u0639\u06cc\u062a: \u063a\u06cc\u0631 \u0645\u0633\u0644\u0645\u0648\u06ba \u0633\u06d2 \u062e\u0641\u06cc\u06c1 \u062a\u0639\u0644\u0642\u0627\u062a",
  "In 3:118: O you who have believed, do not take as intimates those other than yourselves, for they will not spare you any ruin. They wish you would have hardship. Hatred has already appeared from their mouths, and what their breasts conceal is greater.",
  [{ key: "3:118", excerpt: fv(118), evidenceClass: "EXPLICIT_TEXT", rationale: "La tattakhithoo bitanatan min dunikum: explicit prohibition with rationale (la yaloonakum khabalan). Exposed vs concealed hatred gradient." }],
  [],
  "Gap candidate: no dedicated bitanah or interfaith-alliance-boundaries topic. Distinctive as specific prohibition of intimate/confidential relationships rather than general interaction. Psychological insight into concealed enmity."
));

// cand-0161: Anger restraint (kazimin al-ghayth) as defining trait of muttaqin
candidates.candidates.push(makeCand("cand-0161",
  "Anger restraint: kazimin al-ghayth and pardoning people as defining ethical traits of the muttaqin",
  undefined, "\u063a\u0635\u06c1 \u067e\u06cc\u0646\u0627: \u0645\u062a\u0642\u06cc\u0646 \u06a9\u06cc \u067e\u06c1\u0686\u0627\u0646",
  "In 3:134: Who spend during ease and hardship and who restrain anger and who pardon the people - and Allah loves the doers of good.",
  [{ key: "3:134", excerpt: fv(134), evidenceClass: "EXPLICIT_TEXT", rationale: "Al-kazimin al-ghaytha wa al-afeena an al-nas: paired ethical traits within muttaqin profile. Yuhibbu al-muhsinin as divine approval." }],
  [{ topicId: "anger-management", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with anger-management confirmed. Primary Quranic locus for anger restraint vocabulary. Paired with afw (pardoning) creating two-step emotional discipline: restrain then forgive. Spending in sarra'/darra' provides economic context."
));

// cand-0162: Riba prohibition targeting compounded multiplication
candidates.candidates.push(makeCand("cand-0162",
  "Riba prohibition: explicit ban on consuming interest doubled and multiplied with taqwa-success linkage",
  undefined, "\u0631\u0628\u0627 \u06a9\u06cc \u0645\u0645\u0646\u0648\u0639\u06cc\u062a: \u062f\u06af\u0646\u0627 \u0633\u0648\u062f \u062e\u0648\u0631\u06cc",
  "In 3:130: O you who have believed, do not consume usury, doubled and multiplied, but fear Allah that you may be successful.",
  [{ key: "3:130", excerpt: fv(130), evidenceClass: "EXPLICIT_TEXT", rationale: "La takulu al-riba ad'afan muda'afatan: specifies compounding mechanism. Ittaqoo Allah la'allakum tuflihun links avoidance to success." }],
  [{ topicId: "interest-free-finance", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with interest-free-finance confirmed. Distinctive specification of ad'afan muda'afatan (compounded multiplication) as the prohibited form. Taqwa-falah pairing frames riba avoidance as spiritual-economic success condition."
));

// cand-0163: Post-sin repentance pattern — dhikr, istighfar, non-persistence
candidates.candidates.push(makeCand("cand-0163",
  "Post-sin repentance pattern: remembering Allah, seeking forgiveness, and not persisting knowingly after moral failure",
  undefined, "\u06af\u0646\u0627\u06c1 \u06a9\u06d2 \u0628\u0639\u062f \u062a\u0648\u0628\u06c1: \u06cc\u0627\u062f\u060c \u0627\u0633\u062a\u063a\u0641\u0627\u0631\u060c \u0639\u062f\u0645 \u0627\u0635\u0631\u0627\u0631",
  "In 3:135: And those who, when they commit an immorality or wrong themselves, remember Allah and seek forgiveness for their sins - and who can forgive sins except Allah? - and do not persist in what they have done while they know.",
  [{ key: "3:135", excerpt: fv(135), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete repentance sequence: fahishah/zulm -> dhikr Allah -> istighfar -> non-persistence. Rhetorical question affirms exclusive divine forgiveness authority." }],
  [{ topicId: "repentance", layer: "curated", relationship: "same-concept" }],
  "Overlap with repentance (curated) confirmed. Most detailed Quranic repentance formula. Three-step sequence operationalizes tawbah. Walam yusirroo adds cognitive condition (knowingly). Fahishah covers major sins, zulm anfusihim covers self-wronging broadly."
));

// cand-0164: Angelic reinforcement in battle — conditional escalation from 3000 to 5000
candidates.candidates.push(makeCand("cand-0164",
  "Angelic reinforcement: divine military aid through descending angels escalating from 3000 to 5000 conditional on sabr and taqwa",
  undefined, "\u0641\u0631\u0634\u062a\u0648\u06ba \u06a9\u06cc \u0645\u062f\u062f: 3000 \u0633\u06d2 5000 \u062a\u06a9",
  "In 3:124-125: Is it not sufficient for you that your Lord should reinforce you with three thousand angels sent down? Yes, if you remain patient and conscious of Allah and the enemy come upon you in rage, your Lord will reinforce you with five thousand angels having marks of distinction.",
  [{ key: "3:124", excerpt: fv(124), evidenceClass: "EXPLICIT_TEXT", rationale: "Bi-thalathati alafin min al-malaikati munzaleen: initial reinforcement offer." },
   { key: "3:125", excerpt: fv(125), evidenceClass: "EXPLICIT_TEXT", rationale: "Bi-khamsati alafin min al-malaikati musawwimeen: escalated reinforcement conditional on sabr+taqwa+fawr." }],
  [],
  "Gap candidate: no dedicated angelic-reinforcement or badr-uhud-angels topic. Distinctive numerical escalation (3000->5000) with explicit conditions. Musawwimeen (marked) adds visual distinction. Bushra/tatma'inna function (3:126) clarifies psychological purpose over military mechanics."
));

// cand-0165: Alternating days (ayyam nudawiluha) — divine test through vicissitude
candidates.candidates.push(makeCand("cand-0165",
  "Alternating days: divine rotation of fortune and misfortune among people as test mechanism to distinguish believers and select martyrs",
  undefined, "\u062f\u0646\u0648\u06ba \u06a9\u0627 \u0627\u0644\u0679 \u067e\u0644\u0679: \u0627\u0644\u0644\u06c1 \u06a9\u0627 \u0622\u0632\u0645\u0627\u0626\u0634\u06cc \u0646\u0638\u0627\u0645",
  "In 3:140: If a wound should touch you - there has already touched the opposing people a wound similar to it. And these days We alternate among the people so that Allah may make evident those who believe and may take to Himself from among you martyrs.",
  [{ key: "3:140", excerpt: fv(140), evidenceClass: "EXPLICIT_TEXT", rationale: "Tilka al-ayyamu nudawiluha bayna al-nas: explicit divine rotation principle. Triple purpose: li-ya'lama allatheena amanoo + yattakhitha minkum shuhada'. Qarh mithluhu establishes reciprocity." }],
  [{ topicId: "sabr-patience", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "patience-haste", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with sabr-patience and patience-haste confirmed. Distinctive as explicit theology of historical vicissitude. Nudawiluha implies intentional divine alternation not random fortune. Shuhada' selection reframes battlefield death as divine honor."
));

// cand-0166: Rabbana supplication — taught prayer for forgiveness, steadfastness, and victory
candidates.candidates.push(makeCand("cand-0166",
  "Rabbana supplication: taught prayer combining forgiveness for sins/excesses, request for firm footing, and victory over disbelievers",
  undefined, "\u062f\u0639\u0627\u0626\u06d2 \u0631\u0628\u0646\u0627: \u0645\u0639\u0627\u0641\u06cc\u060c \u062b\u0628\u0627\u062a\u060c \u0641\u062a\u062d",
  "In 3:147: And their words were not but that they said, Our Lord, forgive us our sins and the excess committed in our affairs and plant firmly our feet and give us victory over the disbelieving people.",
  [{ key: "3:147", excerpt: fv(147), evidenceClass: "EXPLICIT_TEXT", rationale: "Rabbana ighfir lana dhunoobana wa israfana fi amrina wa thabbit aqdamana wa onsurna ala al-qawmi al-kafireen: four-part supplication attributed to ribbiyyun/prophets." }],
  [{ topicId: "repentance", layer: "curated", relationship: "related-not-identical" }],
  "Overlap with repentance via istighfar component. Distinctive as comprehensive battlefield supplication combining spiritual (forgiveness), physical (firm feet), and communal (victory) petitions. Thabbit aqdamana echoes military context. Attributed to prophetic-era righteous, not directly commanded to Muhammad's community."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-016.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-016.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-003-p13 through ext-003-p16)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0157 through cand-${String(156 + candidates.candidates.length).padStart(4,'0')})`);
