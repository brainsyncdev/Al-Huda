// MFD-11 Pilot 9 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Baqarah 2:153-182 (Passages 25-28, Candidates cand-0087..cand-0096).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "002-0153-0182.json");
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

console.log("Generating pilot 9 files from verbatim corpus (2:153-182)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T16:54:00.000Z";

// ─── Passage 25: 2:153–157 ────────────────────────────────────────────────────────
const p25 = {
  extractionId: "ext-002-p25",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 153, toAyah: 157, label: "Al-Baqarah — seek help through patience and prayer; Allah is with the patient; do not say those killed in Allah's way are dead — they are alive but you perceive not; We will test you with fear, hunger, loss of wealth, lives, fruits; give glad tidings to the patient; who when disaster strikes say inna lillahi wa inna ilayhi raji'un; upon them are blessings and mercy from their Lord; they are the guided" },
  verseKeys: ["2:153","2:154","2:155","2:156","2:157"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `2:${i+153}`, text: fv(i+153) })),
  mainSubject: {
    label: "Seeking help through patience and prayer; Allah's companionship with the patient; martyrs are alive not dead; divine testing through fear, hunger, loss; glad tidings for those who recite istirja' when afflicted; blessings and mercy upon the patient; they are the rightly guided",
    keys: ["2:153","2:154","2:155","2:156","2:157"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Command: seek help through patience and prayer", keys: ["2:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah is with the patient (inna Allaha ma'a al-sabireen)", keys: ["2:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: do not call martyrs dead; they are alive", keys: ["2:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine testing: fear, hunger, loss of wealth, lives, fruits", keys: ["2:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Glad tidings to the patient", keys: ["2:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Istirja': inna lillahi wa inna ilayhi raji'un", keys: ["2:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Salawat and rahmah from Rabb upon the patient", keys: ["2:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "They are the muhtadoon (guided)", keys: ["2:157"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Patience (sabr) as primary spiritual resource in adversity", keys: ["2:153","2:155","2:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Martyrdom: alive in unseen realm despite apparent death", keys: ["2:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Istirja' as response to calamity: recognition of divine ownership and return", keys: ["2:156"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0087","cand-0088"],
  notes: "Pass A pilot 9, passage 25/4. Core sabr passage. Contains taught supplication (istirja'). Establishes divine testing framework and martyr ontology. Links to sabr-patience, patience-haste topics.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P25
{
  // 2:153 - Command: seek help through patience and prayer
  const t153 = fv(153);
  const istaAAeenooIdx = t153.indexOf("\u0671\u0633\u0652\u062a\u064e\u0639\u0650\u064a\u0646\u064f\u0648\u0627\u0652");
  if (istaAAeenooIdx >= 0) {
    p25.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:153"], excerpt: fv(153), description: "Command: seek help through patience and prayer." });
  }

  // 2:154 - Prohibition: do not say martyrs are dead
  const t154 = fv(154);
  const walaTaqoolooIdx = t154.indexOf("\u0648\u064e\u0644\u064e\u0627 \u062a\u064e\u0642\u064f\u0648\u0644\u064f\u0648\u0627\u0652");
  if (walaTaqoolooIdx >= 0) {
    p25.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:154"], excerpt: fv(154), description: "Prohibition: do not say about those killed in Allah's way that they are dead." });
  }

  // 2:156 - Taught supplication: inna lillahi wa inna ilayhi raji'un
  const t156 = fv(156);
  const innaLillahiIdx = t156.indexOf("\u0625\u0650\u0646\u0651\u064e\u0627 \u0644\u0650\u0644\u0651\u064e\u0647\u0650");
  if (innaLillahiIdx >= 0) {
    p25.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["2:156"], excerpt: fv(156), description: "Taught supplication: Indeed we belong to Allah and indeed to Him we return." });
  }
}

// Extract divine names from P25 — none explicitly named beyond Allah

// Extract terminology from P25
{
  // Sabr from 2:153
  const t153 = fv(153);
  const sabrIdx = t153.indexOf("\u0671\u0644\u0635\u0651\u064e\u0628\u0652\u0631\u0650");
  if (sabrIdx >= 0) {
    p25.terminology.push({ term: t153.slice(sabrIdx, sabrIdx + 8), transliteration: "al-sabr", gloss: "patience/steadfastness (editorial gloss)", keys: ["2:153"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p25.json"), JSON.stringify(p25, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p25.json");

// ─── Passage 26: 2:158–167 ────────────────────────────────────────────────────────
const p26 = {
  extractionId: "ext-002-p26",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 158, toAyah: 167, label: "Al-Baqarah — Safa and Marwa among sha'air Allah; whoever performs hajj or umrah may tawaf between them; whoever volunteers good Allah is Shakir Aleem; those who conceal bayyinat and huda after clarification are cursed by Allah and cursers; except those who repent, reform, clarify — Allah accepts repentance, He is Tawwab Raheem; those who disbelieve and die as kuffar — upon them curse of Allah, angels, people all together; abiding eternally; punishment not lightened nor reprieved; your God is One God, no deity except Him Rahman Raheem; signs in creation of heavens, earth, night/day alternation, ships, rain reviving earth, creatures, winds, clouds for people who reason; among people those who take equals besides Allah loving them as love of Allah; believers stronger in love for Allah; if wrongdoers saw punishment they would know all power belongs to Allah and He is severe in punishment; followers disassociate from followed; ties cut; followers wish for another chance to disassociate; Allah shows them deeds as regrets; never emerging from Fire" },
  verseKeys: ["2:158","2:159","2:160","2:161","2:162","2:163","2:164","2:165","2:166","2:167"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `2:${i+158}`, text: fv(i+158) })),
  mainSubject: {
    label: "Safa and Marwa as divine symbols permitting tawaf; voluntary good appreciated by Allah; curse upon those who conceal clear signs after explanation; exception for repentant reformers; eternal curse on persistent disbelievers; declaration of divine oneness (tawheed); cosmic signs in creation for reasoning people; danger of taking rivals beside Allah; believers' superior love for Allah; severance of worldly bonds in punishment; regret of followers wishing for return",
    keys: ["2:158","2:159","2:160","2:161","2:162","2:163","2:164","2:165","2:166","2:167"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Safa and Marwa among sha'air Allah", keys: ["2:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Permission to tawaf between Safa and Marwa in hajj/umrah", keys: ["2:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Voluntary good: Allah Shakir Aleem", keys: ["2:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Curse on concealers of bayyinat and huda after clarification", keys: ["2:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exception: repentance, reform, clarification accepted", keys: ["2:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah Tawwab Raheem", keys: ["2:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eternal curse on disbelievers who die in kufr", keys: ["2:161","2:162"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawheed declaration: Ilahukum ilahun wahidun", keys: ["2:163"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rahman Raheem", keys: ["2:163"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cosmic signs: heavens, earth, night/day, ships, rain, creatures, winds, clouds", keys: ["2:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taking andad besides Allah; loving them as love of Allah", keys: ["2:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believers ashaddu hubban lillah", keys: ["2:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "All power belongs to Allah; severe in punishment", keys: ["2:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Severance of bonds: followers disassociate from followed", keys: ["2:166"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Regret: followers wish for return to disassociate", keys: ["2:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deeds shown as hasarat; never exiting Fire", keys: ["2:167"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Concealment of truth after clarification as grave moral failure", keys: ["2:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance with reform and clarification as path to acceptance", keys: ["2:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Misplaced love: loving rivals as one should love Allah", keys: ["2:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Regret and severed bonds in afterlife punishment", keys: ["2:166","2:167"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Leader-follower bond dissolution in punishment", keys: ["2:166","2:167"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0089","cand-0090","cand-0091"],
  notes: "Pass A pilot 9, passage 26/4. Transitions from ritual (Safa/Marwa) to theological (tawheed, signs) to eschatological (curse, regret). Key repentance verse 2:160. Cosmic ayat inventory in 2:164. Links to repentance, divine-mercy, tawheed-oneness themes.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P26
{
  // Shakir Aleem from 2:158
  const t158 = fv(158);
  const shakirIdx = t158.indexOf("\u0634\u064e\u0627\u0643\u0650\u0631\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (shakirIdx >= 0) {
    p26.divineNamesAndAttributes.push({ term: t158.slice(shakirIdx, shakirIdx + 12), transliteration: "Shakir Aleem", gloss: "Appreciative, Knowing (editorial gloss)", keys: ["2:158"] });
  }

  // Tawwab Raheem from 2:160
  const t160 = fv(160);
  const tawwabIdx = t160.indexOf("\u0671\u0644\u062a\u0651\u064e\u0648\u0651\u064e\u0627\u0628\u064f \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064f");
  if (tawwabIdx >= 0) {
    p26.divineNamesAndAttributes.push({ term: t160.slice(tawwabIdx, tawwabIdx + 17), transliteration: "At-Tawwab Ar-Raheem", gloss: "The Accepting of Repentance, The Merciful (editorial gloss)", keys: ["2:160"] });
  }

  // Rahman Raheem from 2:163
  const t163 = fv(163);
  const rahmanIdx = t163.indexOf("\u0671\u0644\u0631\u0651\u064e\u062d\u0652\u0645\u064e\u0670\u0646\u064f \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064f");
  if (rahmanIdx >= 0) {
    p26.divineNamesAndAttributes.push({ term: t163.slice(rahmanIdx, rahmanIdx + 19), transliteration: "Ar-Rahman Ar-Raheem", gloss: "The Entirely Merciful, The Especially Merciful (editorial gloss)", keys: ["2:163"] });
  }
}

// Extract terminology from P26
{
  // Sha'air from 2:158
  const t158 = fv(158);
  const shaairIdx = t158.indexOf("\u0634\u064e\u0639\u064e\u0627\u0626\u0650\u0631\u0650");
  if (shaairIdx >= 0) {
    p26.terminology.push({ term: t158.slice(shaairIdx, shaairIdx + 8), transliteration: "sha'air", gloss: "symbols/rites (editorial gloss)", keys: ["2:158"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p26.json"), JSON.stringify(p26, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p26.json");

// ─── Passage 27: 2:168–176 ────────────────────────────────────────────────────────
const p27 = {
  extractionId: "ext-002-p27",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 168, toAyah: 176, label: "Al-Baqarah — O mankind eat what is on earth halal tayyib; do not follow footsteps of shaytan; he is clear enemy; he commands evil, immorality, saying about Allah what you do not know; when told follow what Allah revealed they say we follow what fathers did — even if fathers understood nothing; parable of disbelievers like one shouting to what hears nothing but calls; deaf dumb blind not understanding; O believers eat from good things We provided and be grateful to Allah if you worship Him; He only forbade dead meat, blood, pork, dedicated to other than Allah; necessity exemption without transgression; Allah Ghafoor Raheem; those who conceal what Allah sent down of Book and sell it for small price eat only Fire in bellies; Allah won't speak to them Day of Resurrection nor purify them; painful punishment; they bought dalalah with huda and athab with maghfirah; how patient they are toward Fire; because Allah sent down Book in truth; those who differ over Book are in far shiqaaq" },
  verseKeys: ["2:168","2:169","2:170","2:171","2:172","2:173","2:174","2:175","2:176"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `2:${i+168}`, text: fv(i+168) })),
  mainSubject: {
    label: "Universal command to eat lawful and good; prohibition of following shaytan's footsteps; shaytan commands evil and false attribution to Allah; blind ancestral following rebuked; parable of disbelievers as deaf/dumb/blind; believers commanded to eat good provisions and be grateful; specific dietary prohibitions (dead meat, blood, pork, non-divine dedication) with necessity exemption; concealment of scripture for worldly gain condemned; punishment: eating Fire, divine silence on Judgment Day; exchanging guidance for error and forgiveness for punishment; Book sent in truth; dissenters in extreme dissension",
    keys: ["2:168","2:169","2:170","2:171","2:172","2:173","2:174","2:175","2:176"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Universal address: O mankind eat halal tayyib", keys: ["2:168"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: do not follow khutuwat al-shaytan", keys: ["2:168"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaytan as clear enemy", keys: ["2:168"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaytan commands su', fahsha', saying about Allah without knowledge", keys: ["2:169"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Blind ancestral following: fathers understood nothing", keys: ["2:170"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Parable: disbelievers like caller to deaf/dumb/blind", keys: ["2:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believers: eat tayyibat and be grateful", keys: ["2:172"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dietary prohibitions: maytah, dam, lahm khinzeer, uhilla lighayr Allah", keys: ["2:173"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Necessity exemption: ghayra baghin wala 'adin", keys: ["2:173"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah Ghafoor Raheem", keys: ["2:173"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Concealers of Book selling for small price eat Fire", keys: ["2:174"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine silence and non-purification on Judgment Day", keys: ["2:174"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exchanged guidance for error, forgiveness for punishment", keys: ["2:175"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Book sent in truth; dissenters in far shiqaaq", keys: ["2:176"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Blind traditionalism: following ancestors without understanding", keys: ["2:170"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spiritual deafness/dumbness/blindness of disbelievers", keys: ["2:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gratitude conditioned on true worship", keys: ["2:172"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0092","cand-0093","cand-0094"],
  notes: "Pass A pilot 9, passage 27/4. Dietary law core passage. Universal address (ya ayyuha al-nas) distinguishes from believer-specific addresses. Shaytan epistemology defined. Concealment-for-profit theme continues from P26. Links to food-dietary-laws, shukr-gratitude themes.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P27
{
  // 2:168 - Command: eat halal tayyib; Prohibition: don't follow shaytan
  p27.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:168"], excerpt: fv(168), description: "Command: O mankind, eat from whatever is on earth that is lawful and good." });
  p27.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:168"], excerpt: fv(168), description: "Prohibition: do not follow the footsteps of Satan." });

  // 2:172 - Command: eat good things and be grateful
  p27.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:172"], excerpt: fv(172), description: "Command: O believers, eat from good things We provided and be grateful to Allah." });
}

// Extract divine names from P27
{
  // Ghafoor Raheem from 2:173
  const t173 = fv(173);
  const ghafoorIdx = t173.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c \u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064c");
  if (ghafoorIdx >= 0) {
    p27.divineNamesAndAttributes.push({ term: t173.slice(ghafoorIdx, ghafoorIdx + 12), transliteration: "Ghafoor Raheem", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["2:173"] });
  }
}

// Extract terminology from P27
{
  // Halal from 2:168
  const t168 = fv(168);
  const halalIdx = t168.indexOf("\u062d\u064e\u0644\u064e\u0670\u0644\u064b\u0627");
  if (halalIdx >= 0) {
    p27.terminology.push({ term: t168.slice(halalIdx, halalIdx + 7), transliteration: "halalan", gloss: "lawful/permissible (editorial gloss)", keys: ["2:168"] });
  }

  // Tayyib from 2:168
  const tayyibIdx = t168.indexOf("\u0637\u064e\u064a\u0651\u0650\u0628\u064b\u0627");
  if (tayyibIdx >= 0) {
    p27.terminology.push({ term: t168.slice(tayyibIdx, tayyibIdx + 7), transliteration: "tayyiban", gloss: "good/pure/wholesome (editorial gloss)", keys: ["2:168"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p27.json"), JSON.stringify(p27, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p27.json");

// ─── Passage 28: 2:177–182 ────────────────────────────────────────────────────────
const p28 = {
  extractionId: "ext-002-p28",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 177, toAyah: 182, label: "Al-Baqarah — righteousness is not turning faces east or west but belief in Allah, Last Day, angels, Book, prophets; giving wealth despite love to relatives, orphans, needy, traveler, askers, freeing slaves; establishing prayer; giving zakah; fulfilling covenants; patience in poverty, hardship, battle; those are truthful and muttaqoon; qisas prescribed for murder: free for free, slave for slave, female for female; remission by brother followed kindly with good conduct; alleviation and mercy from Rabb; transgressor after that has painful punishment; in qisas there is life O people of understanding so you may attain taqwa; bequest prescribed when death approaches if leaving wealth for parents and near relatives bil-ma'ruf; duty on muttaqeen; whoever alters bequest after hearing it sin is on alterers; Allah Samee' Aleem; whoever fears error/sin from bequeather and reconciles no sin on him; Allah Ghafoor Raheem" },
  verseKeys: ["2:177","2:178","2:179","2:180","2:181","2:182"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `2:${i+177}`, text: fv(i+177) })),
  mainSubject: {
    label: "Comprehensive definition of birr (righteousness): faith pillars plus charitable spending, prayer, zakah, covenant-keeping, patience in adversity; truthful and righteous identified; legal retribution (qisas) prescribed with proportionality; remission encouraged with good conduct; qisas as alleviation and mercy containing life; bequest (wasiyyah) prescribed for parents and relatives; prohibition of altering bequests; reconciliation of bequest errors permitted; divine attributes Samee' Aleem and Ghafoor Raheem",
    keys: ["2:177","2:178","2:179","2:180","2:181","2:182"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Birr redefined: not directional piety but comprehensive faith and action", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Five faith pillars: Allah, Last Day, angels, Book, prophets", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Charitable spending despite love: relatives, orphans, needy, traveler, askers, slaves", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Establishing prayer and giving zakah", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fulfilling covenants", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Patience in ba'sa', darra', and hin al-ba's", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those are sadiqoon and muttaqoon", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Qisas prescribed: proportional retribution", keys: ["2:178"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remission by brother: follow with ma'ruf and ihsan", keys: ["2:178"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Qisas as takhfeef and rahmah from Rabb", keys: ["2:178"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "In qisas there is life for people of understanding", keys: ["2:179"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wasiyyah prescribed for parents and relatives", keys: ["2:180"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Haqqan ala al-muttaqeen", keys: ["2:180"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Altering bequest: sin on alterers", keys: ["2:181"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah Samee' Aleem", keys: ["2:181"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reconciliation of bequest error: no sin", keys: ["2:182"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah Ghafoor Raheem", keys: ["2:182"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Birr as holistic integration of belief, charity, worship, integrity, and endurance", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Giving wealth despite love (ala hubbihi) as test of sincerity", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Truthfulness (sidq) as criterion validating faith claims", keys: ["2:177"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Legal retribution system with built-in mercy mechanism", keys: ["2:178","2:179"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bequest law protecting family inheritance rights", keys: ["2:180","2:181","2:182"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0095","cand-0096"],
  notes: "Pass A pilot 9, passage 28/4. Ayat al-Birr (2:177) is one of the most comprehensive ethical verses in the Quran. Qisas and wasiyyah establish legal frameworks. Note: user's suggested P28 included fasting content (2:183+) but actual verse range ends at 2:182 covering wasiyyah. Fasting begins at 2:183 (next passage).",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P28
{
  // 2:178 - Qisas prescribed (command/legal prescription)
  p28.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:178"], excerpt: fv(178), description: "Legal prescription: qisas (retribution) prescribed for murder with proportionality." });

  // 2:180 - Wasiyyah prescribed
  p28.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:180"], excerpt: fv(180), description: "Legal prescription: bequest prescribed for parents and relatives when death approaches." });

  // 2:181 - Prohibition: altering bequest
  const t181 = fv(181);
  const baddalahuIdx = t181.indexOf("\u0628\u064e\u062f\u0651\u064e\u0644\u064e\u0647\u064f");
  if (baddalahuIdx >= 0) {
    p28.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:181"], excerpt: fv(181), description: "Prohibition: altering a bequest after hearing it incurs sin on the alterer." });
  }
}

// Extract divine names from P28
{
  // Samee' Aleem from 2:181
  const t181 = fv(181);
  const sameeIdx = t181.indexOf("\u0633\u064e\u0645\u0650\u064a\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (sameeIdx >= 0) {
    p28.divineNamesAndAttributes.push({ term: t181.slice(sameeIdx, sameeIdx + 12), transliteration: "Samee' Aleem", gloss: "Hearing, Knowing (editorial gloss)", keys: ["2:181"] });
  }

  // Ghafoor Raheem from 2:182
  const t182 = fv(182);
  const ghafoorIdx = t182.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c \u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064c");
  if (ghafoorIdx >= 0) {
    p28.divineNamesAndAttributes.push({ term: t182.slice(ghafoorIdx, ghafoorIdx + 12), transliteration: "Ghafoor Raheem", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["2:182"] });
  }
}

// Extract terminology from P28
{
  // Birr from 2:177
  const t177 = fv(177);
  const birrIdx = t177.indexOf("\u0671\u0644\u0652\u0628\u0650\u0631\u0651\u064e");
  if (birrIdx >= 0) {
    p28.terminology.push({ term: t177.slice(birrIdx, birrIdx + 7), transliteration: "al-birr", gloss: "righteousness/piety/comprehensive virtue (editorial gloss)", keys: ["2:177"] });
  }

  // Qisas from 2:178
  const t178 = fv(178);
  const qisasIdx = t178.indexOf("\u0671\u0644\u0652\u0642\u0650\u0635\u064e\u0627\u0635\u064f");
  if (qisasIdx >= 0) {
    p28.terminology.push({ term: t178.slice(qisasIdx, qisasIdx + 9), transliteration: "al-qisas", gloss: "legal retribution/equal retaliation (editorial gloss)", keys: ["2:178"] });
  }

  // Wasiyyah from 2:180
  const t180 = fv(180);
  const wasiyyahIdx = t180.indexOf("\u0671\u0644\u0652\u0648\u064e\u0635\u0650\u064a\u0651\u064e\u0629\u064f");
  if (wasiyyahIdx >= 0) {
    p28.terminology.push({ term: t180.slice(wasiyyahIdx, wasiyyahIdx + 10), transliteration: "al-wasiyyah", gloss: "bequest/testament (editorial gloss)", keys: ["2:180"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p28.json"), JSON.stringify(p28, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p28.json");

// ─── Candidates batch (cand-0087 through cand-0096) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-002-p25,ext-002-p26,ext-002-p27,ext-002-p28",
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

// cand-0087: Sabr as divine strategy — seeking help through patience and prayer
candidates.candidates.push(makeCand("cand-0087",
  "Sabr as divine strategy: seeking help through patience and prayer in adversity",
  undefined, "\u0635\u0628\u0631 \u0628\u0637\u0648\u0631 \u062d\u06a9\u0645\u062a \u0627\u0644\u06c1\u06cc: \u0645\u0634\u06a9\u0644\u0627\u062a \u0645\u06cc\u06ba \u0635\u0628\u0631 \u0627\u0648\u0631 \u0646\u0645\u0627\u0632 \u0633\u06d2 \u0645\u062f\u062f",
  "In 2:153: O you who believe, seek help through patience and prayer; indeed Allah is with the patient. In 2:155-157: divine testing through fear, hunger, loss; glad tidings to those who say inna lillahi wa inna ilayhi raji'un when afflicted; upon them blessings and mercy; they are guided.",
  [{ key: "2:153", excerpt: fv(153), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes sabr and salah as primary means of seeking divine help." },
   { key: "2:155", excerpt: fv(155), evidenceClass: "EXPLICIT_TEXT", rationale: "Defines scope of divine testing and promises glad tidings to the patient." },
   { key: "2:157", excerpt: fv(157), evidenceClass: "EXPLICIT_TEXT", rationale: "Confirms blessings, mercy, and guidance as rewards of patience." }],
  [{ topicId: "sabr-patience", layer: "scholarly", relationship: "same-concept" },
   { topicId: "patience-haste", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "tawakkul-trust", layer: "scholarly", relationship: "related-not-identical" }],
  "Foundational sabr passage. Establishes patience not as passive endurance but as active spiritual strategy paired with prayer."
));

// cand-0088: Istirja' — taught supplication recognizing divine ownership and return
candidates.candidates.push(makeCand("cand-0088",
  "Istirja': taught supplication recognizing divine ownership and return in calamity",
  undefined, "\u0627\u0633\u062a\u0631\u062c\u0627\u0639: \u0645\u0635\u06cc\u0628\u062a \u0645\u06cc\u06ba \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u0645\u0644\u06a9\u06cc\u062a \u0627\u0648\u0631 \u0631\u062c\u0648\u0639 \u06a9\u0627 \u0627\u0639\u062a\u0631\u0627\u0641",
  "In 2:156: who when disaster strikes them say 'Indeed we belong to Allah and indeed to Him we will return' — a taught response to calamity affirming divine ownership and ultimate return.",
  [{ key: "2:156", excerpt: fv(156), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides the exact taught formula for responding to calamity." }],
  [{ topicId: "sabr-patience", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "remembrance-forgetfulness", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: specific liturgical formula for grief/calamity. Bridges sabr and dhikr concepts."
));

// cand-0089: Repentance with reform — conditions for divine acceptance
candidates.candidates.push(makeCand("cand-0089",
  "Repentance with reform and clarification: conditions for divine acceptance",
  undefined, "\u062a\u0648\u0628\u06c1 \u0628\u0627 \u0627\u0635\u0644\u0627\u062d \u0627\u0648\u0631 \u0648\u0636\u0627\u062d\u062a: \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u0642\u0628\u0648\u0644\u06cc\u062a \u06a9\u06cc \u0634\u0631\u0627\u0626\u0637",
  "In 2:160: except those who repent, reform themselves, and make evident what they concealed — those Allah accepts their repentance; He is At-Tawwab Ar-Raheem. Contrasts with 2:159 curse on concealers and 2:161-162 eternal curse on persistent disbelievers.",
  [{ key: "2:160", excerpt: fv(160), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse specifies three conditions for repentance acceptance: tawbah, islah, tabyeen." },
   { key: "2:159", excerpt: fv(159), evidenceClass: "CONTEXTUAL", rationale: "Preceding verse establishes the offense (concealment) that repentance addresses." }],
  [{ topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" }],
  "Key repentance verse with three-part condition. Distinguishes genuine reform from mere verbal claim."
));

// cand-0090: Cosmic signs (ayat) in creation for reasoning people
candidates.candidates.push(makeCand("cand-0090",
  "Cosmic signs in creation: heavens, earth, night/day, ships, rain, creatures, winds, clouds",
  undefined, "\u06a9\u0627\u0626\u0646\u0627\u062a\u06cc \u0646\u0634\u0627\u0646\u06cc\u0627\u06ba: \u0622\u0633\u0645\u0627\u0646\u060c \u0632\u0645\u06cc\u0646\u060c \u0631\u0627\u062a \u062f\u0646\u060c \u062c\u06c1\u0627\u0632\u060c \u0628\u0627\u0631\u0634\u060c \u0645\u062e\u0644\u0648\u0642\u0627\u062a\u060c \u06c1\u0648\u0627\u0626\u06cc\u06ba\u060c \u0628\u0627\u062f\u0644",
  "In 2:164: indeed in creation of heavens and earth, alternation of night and day, ships sailing with benefit, rain reviving earth, dispersal of creatures, directing winds and controlled clouds are signs for people who reason.",
  [{ key: "2:164", excerpt: fv(164), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides comprehensive inventory of natural phenomena as divine signs requiring intellectual engagement." }],
  [],
  "Gap candidate: most detailed single-verse catalog of natural ayat in Al-Baqarah. Requires 'aql (reasoning) as reception faculty."
));

// cand-0091: Misplaced love — loving rivals as one should love Allah
candidates.candidates.push(makeCand("cand-0091",
  "Misplaced love: taking rivals beside Allah and loving them as love of Allah",
  undefined, "\u063a\u0644\u0637 \u0645\u062d\u0628\u062a: \u0627\u0644\u0644\u06c1 \u06a9\u06d2 \u0633\u0648\u0627 \u06a9\u0648 \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u0645\u062d\u0628\u062a \u06a9\u06cc \u0637\u0631\u062d \u067e\u0631 \u067e\u06cc\u0627\u0631 \u06a9\u0631\u0646\u0627",
  "In 2:165: among people are those who take equals besides Allah, loving them as love of Allah; but believers are stronger in love for Allah. If wrongdoers saw punishment they would know all power belongs to Allah.",
  [{ key: "2:165", excerpt: fv(165), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse defines idolatry in terms of misplaced emotional devotion and contrasts with believer's superior love." }],
  [],
  "Gap candidate: defines shirk affectively rather than ritually. Love hierarchy as diagnostic of faith."
));

// cand-0092: Halal and tayyib — dual criteria for permissible consumption
candidates.candidates.push(makeCand("cand-0092",
  "Halal and tayyib: dual criteria for lawful and wholesome consumption",
  undefined, "\u062d\u0644\u0627\u0644 \u0627\u0648\u0631 \u0637\u06cc\u0628: \u062c\u0627\u0626\u0632 \u0627\u0648\u0631 \u062e\u0627\u0644\u0635 \u063a\u0630\u0627 \u06a9\u06d2 \u062f\u0648\u06c1\u0631\u06d2 \u0645\u0639\u06cc\u0627\u0631",
  "In 2:168: O mankind, eat from whatever is on earth that is lawful (halal) and good (tayyib). In 2:172: O believers, eat from good things We provided and be grateful. In 2:173: specific prohibitions (dead meat, blood, pork, non-divine dedication) with necessity exemption.",
  [{ key: "2:168", excerpt: fv(168), evidenceClass: "EXPLICIT_TEXT", rationale: "Universal address establishes dual halal-tayyib standard for all humanity." },
   { key: "2:173", excerpt: fv(173), evidenceClass: "EXPLICIT_TEXT", rationale: "Specifies four prohibited categories and necessity exemption." }],
  [{ topicId: "shukr-gratitude", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: halal-tayyib pairing adds qualitative dimension beyond mere permissibility. Universal address (not believer-specific) notable."
));

// cand-0093: Blind ancestral following vs. divine revelation
candidates.candidates.push(makeCand("cand-0093",
  "Blind ancestral following: rejecting revelation for inherited tradition without understanding",
  undefined, "\u0622\u0628\u0627\u0626\u06cc \u062a\u0642\u0644\u06cc\u062f: \u0648\u062d\u06cc \u06a9\u0648 \u0686\u06be\u0648\u0691 \u06a9\u0631 \u0628\u063a\u06cc\u0631 \u0633\u0645\u062c\u06be\u06d2 \u0622\u0628\u0627\u0626\u06cc \u0631\u0633\u0645 \u06a9\u06cc \u067e\u06cc\u0631\u0648\u06cc",
  "In 2:170: when told to follow what Allah revealed they say we follow what our fathers did — even though their fathers understood nothing and were not guided. Parable in 2:171: disbelievers like one shouting to what hears nothing but calls — deaf, dumb, blind.",
  [{ key: "2:170", excerpt: fv(170), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse captures the exchange between divine invitation and traditionalist refusal." },
   { key: "2:171", excerpt: fv(171), evidenceClass: "EXPLICIT_TEXT", rationale: "Parable illustrates cognitive incapacity underlying traditionalist rejection." }],
  [],
  "Gap candidate: archetypal critique of unexamined tradition. Recurring Quranic theme concentrated here."
));

// cand-0094: Concealment of scripture for worldly gain
candidates.candidates.push(makeCand("cand-0094",
  "Concealment of scripture for worldly gain: eating Fire and divine silence",
  undefined, "\u06a9\u062a\u0627\u0628 \u0686\u06be\u067e\u0627\u0646\u0627: \u062f\u0646\u06cc\u0627\u0648\u06cc \u0641\u0627\u0626\u062f\u06d2 \u06a9\u06d2 \u0644\u06cc\u06d2 \u0648\u062d\u06cc \u06a9\u0627 \u0627\u062e\u0641\u0627\u0621",
  "In 2:174-176: those who conceal what Allah sent down of the Book and sell it for small price eat only Fire; Allah won't speak to them or purify them on Judgment Day; they exchanged guidance for error and forgiveness for punishment; Book sent in truth; dissenters in extreme dissension.",
  [{ key: "2:174", excerpt: fv(174), evidenceClass: "EXPLICIT_TEXT", rationale: "Details punishment for concealing scripture: Fire in bellies, divine silence, non-purification." },
   { key: "2:175", excerpt: fv(175), evidenceClass: "EXPLICIT_TEXT", rationale: "Describes the catastrophic exchange: guidance for error, forgiveness for punishment." }],
  [],
  "Continues concealment theme from 2:159. Adds economic motive (thaman qaleel) and eschatological consequences."
));

// cand-0095: Ayat al-Birr — comprehensive righteousness integrating faith and action
candidates.candidates.push(makeCand("cand-0095",
  "Ayat al-Birr: comprehensive righteousness integrating faith pillars with ethical action",
  undefined, "\u0622\u06cc\u062a \u0627\u0644\u0628\u0631: \u0627\u06cc\u0645\u0627\u0646 \u0627\u0648\u0631 \u0639\u0645\u0644 \u06a9\u0627 \u062c\u0627\u0645\u0639 \u062a\u0639\u0631\u06cc\u0641",
  "In 2:177: righteousness is not turning faces east/west but believing in Allah, Last Day, angels, Book, prophets; giving wealth despite love to relatives, orphans, needy, traveler, askers, freeing slaves; establishing prayer; giving zakah; fulfilling covenants; patience in poverty, hardship, battle. Those are truthful and righteous.",
  [{ key: "2:177", excerpt: fv(177), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides the most comprehensive single-verse definition of righteousness in the Quran, integrating creed, charity, worship, integrity, and endurance." }],
  [{ topicId: "sabr-patience", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "shukr-gratitude", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: ayat al-birr as ethical constitution. Redefines piety from ritual orientation to holistic virtue."
));

// cand-0096: Qisas as life-preserving justice with mercy mechanism
candidates.candidates.push(makeCand("cand-0096",
  "Qisas: legal retribution as life-preserving justice with built-in mercy",
  undefined, "\u0642\u0635\u0627\u0635: \u062d\u06cc\u0627\u062a \u0628\u062e\u0634\u0646\u06d2 \u0648\u0627\u0644\u0627 \u0639\u062f\u0644 \u0628\u0627 \u0631\u062d\u0645\u062a",
  "In 2:178-179: qisas prescribed for murder with proportionality (free for free, slave for slave, female for female); remission by brother should be followed with good conduct; this is alleviation and mercy from your Lord; in qisas there is life O people of understanding so you may attain taqwa.",
  [{ key: "2:178", excerpt: fv(178), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes proportional retribution with remission option framed as divine mercy." },
   { key: "2:179", excerpt: fv(179), evidenceClass: "EXPLICIT_TEXT", rationale: "Declares deterrent purpose: life in retribution for people of understanding." }],
  [{ topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: qisas reframed not as vengeance but as life-preserving social mechanism with mercy valve. Addresses ulu al-albab."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-009.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-009.json with ${candidates.candidates.length} candidates`);

console.log("\nDone. Run validator to confirm.");
