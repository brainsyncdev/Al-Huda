// MFD-11 Imran Pass 5 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Ali 'Imran 3:151-200 (Passages 17-20, Candidates cand-0167..cand-0176).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "003-0151-0200.json");
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

console.log("Generating Imran Pass 5 files from verbatim corpus (3:151-200)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T18:18:00.000Z";

// ─── Passage 17: 3:151–155 ────────────────────────────────────────────────────────
const p17 = {
  extractionId: "ext-003-p17",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 151, toAyah: 155, label: "Ali 'Imran — Terror for shirk; Fire refuge; fulfilled promise victory by His leave until weakness dispute disobedience; some desire world some hereafter; turned away to test; pardoned Dhu Fadl; flight uphill Messenger calling; grief upon grief; Khabeer; security drowsiness; jahiliyyah thought; counterfactual rebutted; testing breasts purifying hearts; Aleem; turned back at armies met Satan caused slip; forgiven Ghafoor Haleem" },
  verseKeys: ["3:151","3:152","3:153","3:154","3:155"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `3:${i+151}`, text: fv(i+151) })),
  mainSubject: {
    label: "Terror for shirk; Fire refuge; fulfilled promise victory by His leave; breakdown weakness dispute disobedience after seeing desired outcome; division world-desirers vs hereafter-desirers; turning away as test; pardon affirmed Dhu Fadl; flight uphill Messenger calling behind; grief upon grief mercy mechanism; Khabeer; security drowsiness post-distress; jahiliyyah assumptions; counterfactual death claims rebutted; breast-heart purification; Aleem; turned back at army encounter slipped by Satan for earned blame; forgiven Ghafoor Haleem",
    keys: ["3:151","3:152","3:153","3:154","3:155"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Ru'b (terror) cast into hearts of kafirin", keys: ["3:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shirk as cause: ma ashraaku bi-Allah", keys: ["3:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fire as refuge: ma'wahum al-nar", keys: ["3:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bi'sa mathwa al-zalimin: wretched residence", keys: ["3:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah fulfilled promise: sadaqa Allahu wa'dahu", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Victory by His leave: tahussoonahum bi-idhnihi", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Breakdown: fashiltum + tanaza'tum + 'asaytum", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "After seeing what you love: min ba'di ma arakum ma tuhibboona", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Internal division: minkum man yureedu al-dunya + minkum man yureedu al-akhirah", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sarafakum: divine turning away as test", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Li-yabtaliyakum: testing purpose", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wa laqad 'afa 'ankum: divine pardon", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dhu fadlin ala al-mu'minin: bounty toward believers", keys: ["3:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Flight without looking back: idh tus'idoona", keys: ["3:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger calling from behind: al-rasoolu yad'ookum fi ukhrakum", keys: ["3:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Grief upon grief: athabakum ghamman bi-ghammin", keys: ["3:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Purpose: not grieving for missed gains or struck losses", keys: ["3:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khabeer bi-ma taf'aloon: Allah aware of actions", keys: ["3:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Security after distress: anzala 'alaykum amanatan nu'asan", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Slumber overcoming a party: yaghsha ta'ifatan minkum", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Party worried about selves: ta'ifatun qad ahammathum anfusuhum", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jahiliyyah thought: yazunnoon bi-Allah ghayr al-haqq zann al-jahiliyyah", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Question: hal lana min al-amri min shay'in", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Response: inn al-amra kullahu lillah", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Concealing in selves: yukhfuna fi anfusihim", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Counterfactual: law kana lana min al-amri shay'un ma qutilna hahuna", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Decreed killing: law kuntum fi buyootikum labaraza allatheena kutiba 'alayhim al-qatlu", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Testing breasts and purifying hearts: li-yabtaliya ma fi sudoorikum wa li-yumahhisa ma fi quloobikum", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Aleem bi-dhat al-sudoor (3:154 battlefield context)", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those who turned back when two armies met: allatheena tawallaw minkum yawma iltaqa al-jam'an", keys: ["3:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Satan caused them to slip for what they earned: istazallahumu al-shaytanu biba'di ma kasaboo", keys: ["3:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah already forgiven them: laqad 'afa Allahu 'anhum", keys: ["3:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ghafoor Haleem: Forgiving Forbearing", keys: ["3:155"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Battlefield panic and flight response", keys: ["3:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cumulative grief as divine mercy mechanism", keys: ["3:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jahiliyyah mindset resurfacing under pressure", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Security slumber as divine reassurance", keys: ["3:154"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0167","cand-0168"],
  notes: "Pass A Imran passage 17/20. Opens Uhud aftermath proper. Triple failure diagnosis (fashil/tanazu'/asa) at 3:152. Jahiliyyah zann (3:154) identifies pre-Islamic fatalism. Dual purification (sudur/qulub) at 3:154. Verse 3:155 addresses those who turned back at army encounter: Satan caused slip due to earned blame; Allah forgave them (Ghafoor Haleem).",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P17
{
  // Khabeer from 3:153
  const t153 = fv(153);
  const khabeerIdx = t153.indexOf("\u062e\u064e\u0628\u0650\u064a\u0631\u064b");
  if (khabeerIdx >= 0) {
    p17.divineNamesAndAttributes.push({ term: t153.slice(khabeerIdx, khabeerIdx + 7), transliteration: "Khabeer", gloss: "All-Aware (editorial gloss)", keys: ["3:153"] });
  }

  // Aleem from 3:154
  const t154 = fv(154);
  const aleemIdx = t154.indexOf("\u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (aleemIdx >= 0) {
    p17.divineNamesAndAttributes.push({ term: t154.slice(aleemIdx, aleemIdx + 6), transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["3:154"] });
  }

  // Ghafoor from 3:155
  const t155 = fv(155);
  const ghafoorIdx = t155.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c");
  if (ghafoorIdx >= 0) {
    p17.divineNamesAndAttributes.push({ term: t155.slice(ghafoorIdx, ghafoorIdx + 6), transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["3:155"] });
  }

  // Haleem from 3:155
  const haleemIdx = t155.indexOf("\u062d\u064e\u0644\u0650\u064a\u0645\u064c");
  if (haleemIdx >= 0) {
    p17.divineNamesAndAttributes.push({ term: t155.slice(haleemIdx, haleemIdx + 6), transliteration: "Haleem", gloss: "Forbearing (editorial gloss)", keys: ["3:155"] });
  }
}

// Extract terminology from P17
{
  // Ru'b from 3:151
  const t151 = fv(151);
  const rubIdx = t151.indexOf("\u0671\u0644\u0631\u0651\u064f\u0639\u0652\u0628\u064e");
  if (rubIdx >= 0) {
    p17.terminology.push({ term: t151.slice(rubIdx, rubIdx + 9), transliteration: "al-ru'b", gloss: "terror/dread (editorial gloss)", keys: ["3:151"] });
  }

  // Nu'as from 3:154
  const t154 = fv(154);
  const nuasIdx = t154.indexOf("\u0646\u064f\u0639\u064e\u0627\u0633\u064b");
  if (nuasIdx >= 0) {
    p17.terminology.push({ term: t154.slice(nuasIdx, nuasIdx + 7), transliteration: "nu'as", gloss: "drowsiness/slumber (editorial gloss)", keys: ["3:154"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p17.json"), JSON.stringify(p17, null, 2) + "\n");
console.log("Wrote 003-al-imran-p17.json");

// ─── Passage 18: 3:156–165 ────────────────────────────────────────────────────────
const p18 = {
  extractionId: "ext-003-p18",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 156, toAyah: 165, label: "Ali 'Imran — Counterfactual grief prohibition hasrah; Allah gives life death Baseer; killed/die in Allah's way maghfirah rahmah better; gathered to Allah; Prophet lenient pardon consult shura rely Allah loves mutawakkileen; divine aid decisive believers rely; ghulul prohibition betrayer brings Qiyamah compensated; ridwan vs sakhat Jahannam; degrees Baseer; favor Messenger tazkiyah hikmah; disaster from yourselves Qadeer" },
  verseKeys: ["3:156","3:157","3:158","3:159","3:160","3:161","3:162","3:163","3:164","3:165"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `3:${i+156}`, text: fv(i+156) })),
  mainSubject: {
    label: "Counterfactual grief prohibition hasrah in hearts; Allah gives life death Baseer; killed/die in Allah's way maghfirah rahmah better than accumulation; gathered to Allah; Prophet lenient by mercy harshness causes disbandment; pardon seek forgiveness consult shura; decide then rely Allah loves mutawakkileen; divine aid decisive none overcomes if forsaken none aids; believers rely Allah; ghulul prohibition betrayer brings goods Qiyamah compensated not wronged; ridwan pursuer vs sakhat bearer Jahannam refuge; degrees Baseer; favor Messenger reciting purifying teaching Book hikmah prior manifest error; disaster from yourselves; Qadeer",
    keys: ["3:156","3:157","3:158","3:159","3:160","3:161","3:162","3:163","3:164","3:165"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Counterfactual grief prohibition: la takoonoo ka-allatheena kafaroo", keys: ["3:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hasrah (regret) made in hearts by Allah", keys: ["3:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yuhyi wa yumitu: life and death sovereignty", keys: ["3:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Baseer bi-ma taf'aloon", keys: ["3:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Killed or die in Allah's way: maghfirah and rahmah better than accumulation", keys: ["3:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Whether die or killed gathered to Allah", keys: ["3:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet lenient by rahmah from Allah", keys: ["3:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Harshness would cause disbandment: law kunta fazzan ghaleeza al-qalb lainfaddoo", keys: ["3:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fa'fu 'anhum: pardon them", keys: ["3:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wastaghfir lahum: seek forgiveness for them", keys: ["3:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Washawirhum fi al-amr: consult them in the matter (shura)", keys: ["3:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fa-idha 'azamta fa-tawakkal: when decided rely on Allah", keys: ["3:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yuhibbu al-mutawakkileen", keys: ["3:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "In yansurkum Allahu fala ghaliba lakum: divine aid decisive", keys: ["3:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wa-in yakhthulkum faman dha alladhee yansurukum: if forsaken who aids", keys: ["3:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wa-ala Allahi fal-yatawakkali al-mu'minoon", keys: ["3:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No prophet commits ghulul (misappropriation of booty)", keys: ["3:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Whoever betrays brings what he took on Qiyamah", keys: ["3:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Every soul fully compensated not wronged: tuwaffa kullu nafsin ma kasabat wa hum la yuzlamoon", keys: ["3:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ridwan follower vs sakhat bearer: afamani ittaba'a ridwana Allahi kaman ba'a bisakhatin", keys: ["3:162"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jahannam refuge for sakhat bearer: ma'wahu jahannam", keys: ["3:162"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hum darajatun 'inda Allah: varying degrees with Allah", keys: ["3:163"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Baseer bi-ma ya'maloon", keys: ["3:163"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah conferred favor: laqad manna Allahu ala al-mu'mineen", keys: ["3:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger from themselves: rasoolan min anfusihim", keys: ["3:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reciting ayat purifying (tazkiyah) teaching Book and hikmah", keys: ["3:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Before in manifest error: la-fee dalalin mubeenin", keys: ["3:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disaster attribution: qul huwa min 'indi anfusikum", keys: ["3:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah ala kulli shay'in qadeer (3:165 self-attribution context)", keys: ["3:165"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Counterfactual thinking as source of spiritual regret", keys: ["3:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reliance on Allah (tawakkul) as believer's posture", keys: ["3:159","3:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prior manifest error before Messenger's mission", keys: ["3:164"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Ghulul prohibition: misappropriation of war booty", keys: ["3:161"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0169"],
  notes: "Pass A Imran passage 18/20. Counterfactual grief psychology (3:156) unique diagnostic. Shura principle (3:159) explicit prophetic consultation mandate. Ghulul prohibition (3:161) addresses war-booty integrity. Ridwan/sakhat contrast (3:162) defines divergent spiritual trajectories. Tazkiyah/hikmah pairing (3:164) describes prophetic mission scope. Self-attribution of disaster (3:165) establishes moral causality.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P18
{
  p18.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["3:156"], excerpt: fv(156), description: "Prohibition: do not be like those who disbelieved and said about absent brothers 'if they were with us they would not have died or been killed'; Allah makes this a source of regret." });
  p18.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:159"], excerpt: fv(159), description: "Command: pardon them, seek forgiveness for them, and consult them in the matter; when you have decided, rely upon Allah." });
  p18.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:160"], excerpt: fv(160), description: "Command: upon Allah let the believers rely." });
}

// Extract divine names from P18
{
  const t156 = fv(156);
  const baseerIdx = t156.indexOf("\u0628\u064e\u0635\u0650\u064a\u0631\u064c");
  if (baseerIdx >= 0) {
    p18.divineNamesAndAttributes.push({ term: t156.slice(baseerIdx, baseerIdx + 6), transliteration: "Baseer", gloss: "All-Seeing (editorial gloss)", keys: ["3:156"] });
  }

  const t163 = fv(163);
  const baseer2Idx = t163.indexOf("\u0628\u064e\u0635\u0650\u064a\u0631\u064c");
  if (baseer2Idx >= 0) {
    p18.divineNamesAndAttributes.push({ term: t163.slice(baseer2Idx, baseer2Idx + 6), transliteration: "Baseer", gloss: "All-Seeing (editorial gloss)", keys: ["3:163"] });
  }

  const t165 = fv(165);
  const qadeerIdx = t165.indexOf("\u0642\u064e\u062f\u0650\u064a\u0631\u064c");
  if (qadeerIdx >= 0) {
    p18.divineNamesAndAttributes.push({ term: t165.slice(qadeerIdx, qadeerIdx + 6), transliteration: "Qadeer", gloss: "All-Powerful (editorial gloss)", keys: ["3:165"] });
  }
}

// Extract terminology from P18
{
  const t156 = fv(156);
  const hasrahIdx = t156.indexOf("\u062d\u064e\u0633\u0652\u0631\u064e\u0629\u064b");
  if (hasrahIdx >= 0) {
    p18.terminology.push({ term: t156.slice(hasrahIdx, hasrahIdx + 7), transliteration: "hasrah", gloss: "regret/remorse (editorial gloss)", keys: ["3:156"] });
  }

  const t161 = fv(161);
  const ghululIdx = t161.indexOf("\u064a\u064e\u063a\u064f\u0644\u0651\u064e");
  if (ghululIdx >= 0) {
    p18.terminology.push({ term: t161.slice(ghululIdx, ghululIdx + 6), transliteration: "yaghulla", gloss: "misappropriate/booty betrayal (editorial gloss)", keys: ["3:161"] });
  }

  const t162 = fv(162);
  const ridwanIdx = t162.indexOf("\u0631\u0650\u0636\u0652\u0648\u064e\u0627\u0646\u0650");
  if (ridwanIdx >= 0) {
    p18.terminology.push({ term: t162.slice(ridwanIdx, ridwanIdx + 8), transliteration: "ridwan", gloss: "divine pleasure/approval (editorial gloss)", keys: ["3:162"] });
  }

  const sakhatIdx = t162.indexOf("\u0633\u064e\u062e\u064e\u0637\u064d");
  if (sakhatIdx >= 0) {
    p18.terminology.push({ term: t162.slice(sakhatIdx, sakhatIdx + 5), transliteration: "sakhat", gloss: "divine anger/displeasure (editorial gloss)", keys: ["3:162"] });
  }

  const t163 = fv(163);
  const darajatIdx = t163.indexOf("\u062f\u064e\u0631\u064e\u062c\u064e\u0627\u062a\u064c");
  if (darajatIdx >= 0) {
    p18.terminology.push({ term: t163.slice(darajatIdx, darajatIdx + 7), transliteration: "darajat", gloss: "degrees/ranks (editorial gloss)", keys: ["3:163"] });
  }

  const t164 = fv(164);
  const tazkiyahIdx = t164.indexOf("\u064a\u064f\u0632\u064e\u0643\u0651\u0650\u064a\u0647\u0650\u0645\u0652");
  if (tazkiyahIdx >= 0) {
    p18.terminology.push({ term: t164.slice(tazkiyahIdx, tazkiyahIdx + 10), transliteration: "yuzakkeehim", gloss: "purifying them (editorial gloss)", keys: ["3:164"] });
  }

  const hikmahIdx = t164.indexOf("\u0671\u0644\u0652\u062d\u0650\u0643\u0652\u0645\u064e\u0629\u064e");
  if (hikmahIdx >= 0) {
    p18.terminology.push({ term: t164.slice(hikmahIdx, hikmahIdx + 10), transliteration: "al-hikmah", gloss: "wisdom (editorial gloss)", keys: ["3:164"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p18.json"), JSON.stringify(p18, null, 2) + "\n");
console.log("Wrote 003-al-imran-p18.json");

// ─── Passage 19: 3:166–180 ────────────────────────────────────────────────────────
const p19 = {
  extractionId: "ext-003-p19",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 166, toAyah: 180, label: "Ali 'Imran — Armies met by Allah's permission distinguish believers hypocrites; nearer kufr than iman mouths not hearts Allah knows; stay-behinds rebutted; martyrs alive provisioned rejoicing glad tidings no fear grief; ni'mah fadl reward preserved; istajaboo after qarhu great reward; threat increased faith hasbuna Allah wakeel; returned ni'mah fadl ridwan Dhu Fadl Azeem; Shaytan frightens fear Me; hastening kufr no share great punishment; kufr purchased painful; respite increases sin humiliating; khabeeth tayyib separation messengers believe fear; withholding bounty worse necks encircled heritage Khabeer" },
  verseKeys: ["3:166","3:167","3:168","3:169","3:170","3:171","3:172","3:173","3:174","3:175","3:176","3:177","3:178","3:179","3:180"],
  arabicExcerpts: Array.from({length:15}, (_,i) => ({ key: `3:${i+166}`, text: fv(i+166) })),
  mainSubject: {
    label: "Armies met by Allah's permission distinguish believers hypocrites; refusal closer kufr than iman mouths not hearts Allah knows concealed; stay-behinds counterfactual rebutted prevent death; martyrs alive provisioned rejoicing glad tidings no fear grief; ni'mah fadl reward preserved; istajaboo after qarhu great reward muhsinin muttaqin; threat increased faith hasbuna Allah wakeel; returned ni'mah fadl no harm ridwan Dhu Fadl Azeem; Shaytan frightens allies fear not them fear Me; hastening kufr cannot harm Allah no share hereafter great punishment; purchased kufr painful punishment; respite increases sin humiliating; khabeeth tayyib separation messenger selection believe fear great reward; withholding bounty worse necks encircled Qiyamah heritage Khabeer",
    keys: ["3:166","3:167","3:168","3:169","3:170","3:171","3:172","3:173","3:174","3:175","3:176","3:177","3:178","3:179","3:180"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Yawm al-taqa al-jam'an: day two armies met", keys: ["3:166"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bi-idhni Allah: by Allah's permission", keys: ["3:166"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Li-ya'lama al-mu'mineen: distinguishing believers", keys: ["3:166"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wa-li-ya'lama allatheena nafaqoo: knowing hypocrites", keys: ["3:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocrite refusal: ta'alaw qatiloo fi sabil Allah aw idfa'oo", keys: ["3:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Law na'lamu qitalan la-ittaba'nakum: if we knew fighting we would follow", keys: ["3:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hum li-al-kufr yawma-idhin aqrabu minhum li-al-iman: closer to disbelief", keys: ["3:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yaquoloona bi-afwahihim ma laysa fi quloobihim", keys: ["3:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah a'lam bi-ma yaktumoon", keys: ["3:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Stay-behinds' counterfactual: law ata'oona ma qutiloo", keys: ["3:168"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Qul fa-idra'u 'an anfusikum al-mawt: rebuttal challenge", keys: ["3:168"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "La tahsabanna allatheena qutiloo fi sabil Allah amwatan: do not think martyrs dead", keys: ["3:169"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bal ahya'un 'inda rabbihim yurzaqoon: alive with Lord receiving provision", keys: ["3:169"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fariheena bima atahumu Allahu min fadlihi: rejoicing in bounty", keys: ["3:170"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yastabshiroona biallatheena lam yalhaqoo bihim: glad tidings for successors", keys: ["3:170"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Alla khawfun 'alayhim wa la hum yahzanoona: no fear no grief", keys: ["3:170"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yastabshiroona bi-ni'matin min Allahi wa fadlin", keys: ["3:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah la yudee'u ajra al-mu'mineen: reward preserved", keys: ["3:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allatheena istajaboo lillahi wa-al-rasooli min ba'di ma asabahum al-qarhu", keys: ["3:172"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Great reward for muhsinin and muttaqin among responders", keys: ["3:172"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enemy gathering threat increased faith: fazadahum imanan", keys: ["3:173"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hasbuna Allah wa ni'ma al-wakeel: sufficient trust formula", keys: ["3:173"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Returned with ni'mah and fadl no harm touched them", keys: ["3:174"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ittaba'oo ridwana Allah: pursued divine pleasure", keys: ["3:174"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dhu Fadl Azeem: Possessor of Great Bounty", keys: ["3:174"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaytan yukhawwifu awliya'ahu: Satan frightens allies", keys: ["3:175"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fala takhafoohum wa-khafoon: fear not them but Me", keys: ["3:175"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not grieve over hasteners into kufr", keys: ["3:176"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cannot harm Allah; no share in hereafter; great punishment", keys: ["3:176"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Purchased kufr for iman: painful punishment", keys: ["3:177"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Respite extension increases sin: numlee lahum li-yazdadoo ithman", keys: ["3:178"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Adhabun muheen: humiliating punishment", keys: ["3:178"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Separation of khabeeth from tayyib", keys: ["3:179"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yajtabee min rusulihi man yasha': messenger selection", keys: ["3:179"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fa-aminoo bi-Allahi wa-rusulihi: believe in Allah and messengers", keys: ["3:179"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Withholding bounty worse: yabkhaloona bima atahumu Allahu", keys: ["3:180"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Necks encircled by withheld goods on Qiyamah", keys: ["3:180"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lillahi meerathu al-samawat wa-al-ard: divine heritage", keys: ["3:180"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khabeer bi-ma taf'aloon", keys: ["3:180"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Hypocrisy as proximity to kufr", keys: ["3:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Verbal profession disconnected from heart conviction", keys: ["3:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Martyr consciousness: alive rejoicing provisioned", keys: ["3:169","3:170"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Faith increase under threat", keys: ["3:173"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Bukhl (withholding divine bounty) as economic-spiritual transgression", keys: ["3:180"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0172"],
  notes: "Pass A Imran passage 19/20. Hypocrite psychology most detailed here (3:167). Martyr ontology explicit: alive provisioned rejoicing (3:169-170). Istijabah after qarh (3:172) defines post-injury faithfulness. Hasbuna Allah formula (3:173) canonical trust declaration. Khabeeth/tayyib separation (3:179) divine sorting principle. Bukhl consequences (3:180) eschatological economics.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P19
{
  p19.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:168"], excerpt: fv(168), description: "Command: say 'Then prevent death from yourselves, if you should be truthful' — rebuttal to counterfactual claims." });
  p19.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["3:169"], excerpt: fv(169), description: "Prohibition: never think of those killed in Allah's way as dead; rather they are alive with their Lord receiving provision." });
  p19.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:175"], excerpt: fv(175), description: "Command: fear not Satan's allies but fear Me, if you are believers." });
  p19.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:179"], excerpt: fv(179), description: "Command: believe in Allah and His messengers; if you believe and fear Him, great reward awaits." });
}

// Extract divine names from P19
{
  const t174 = fv(174);
  const dfIdx = t174.indexOf("\u0630\u064f\u0648 \u0641\u064e\u0636\u0652\u0644\u064d \u0639\u064e\u0638\u0650\u064a\u0645\u064d");
  if (dfIdx >= 0) {
    p19.divineNamesAndAttributes.push({ term: t174.slice(dfIdx, dfIdx + 17), transliteration: "Dhu Fadl Azeem", gloss: "Possessor of Great Bounty (editorial gloss)", keys: ["3:174"] });
  }

  const t180 = fv(180);
  const khabeerIdx = t180.indexOf("\u062e\u064e\u0628\u0650\u064a\u0631\u064c");
  if (khabeerIdx >= 0) {
    p19.divineNamesAndAttributes.push({ term: t180.slice(khabeerIdx, khabeerIdx + 6), transliteration: "Khabeer", gloss: "All-Aware (editorial gloss)", keys: ["3:180"] });
  }
}

// Extract terminology from P19
{
  const t169 = fv(169);
  const yurzaqoonIdx = t169.indexOf("\u064a\u064f\u0631\u0652\u0632\u064e\u0642\u064f\u0648\u0646\u064e");
  if (yurzaqoonIdx >= 0) {
    p19.terminology.push({ term: t169.slice(yurzaqoonIdx, yurzaqoonIdx + 10), transliteration: "yurzaqoon", gloss: "receiving provision (editorial gloss)", keys: ["3:169"] });
  }

  const t173 = fv(173);
  const hasbunaIdx = t173.indexOf("\u062d\u064e\u0633\u0652\u0628\u064f\u0646\u064e");
  if (hasbunaIdx >= 0) {
    p173.terminology = p19.terminology;
    p19.terminology.push({ term: t173.slice(hasbunaIdx, hasbunaIdx + 7), transliteration: "hasbuna", gloss: "sufficient for us (editorial gloss)", keys: ["3:173"] });
  }

  const wakeelIdx = t173.indexOf("\u0671\u0644\u0652\u0648\u064e\u0643\u0650\u064a\u0644\u064f");
  if (wakeelIdx >= 0) {
    p19.terminology.push({ term: t173.slice(wakeelIdx, wakeelIdx + 9), transliteration: "al-wakeel", gloss: "the Disposer of affairs (editorial gloss)", keys: ["3:173"] });
  }

  const t178 = fv(178);
  const numleeIdx = t178.indexOf("\u0646\u064f\u0645\u0652\u0644\u0650\u064a");
  if (numleeIdx >= 0) {
    p19.terminology.push({ term: t178.slice(numleeIdx, numleeIdx + 6), transliteration: "numlee", gloss: "We extend/grant respite (editorial gloss)", keys: ["3:178"] });
  }

  const t179 = fv(179);
  const khabeethIdx = t179.indexOf("\u0671\u0644\u0652\u062e\u064e\u0628\u0650\u064a\u062b\u064e");
  if (khabeethIdx >= 0) {
    p19.terminology.push({ term: t179.slice(khabeethIdx, khabeethIdx + 9), transliteration: "al-khabeeth", gloss: "the evil/bad (editorial gloss)", keys: ["3:179"] });
  }

  const tayyibIdx = t179.indexOf("\u0671\u0644\u0637\u064e\u064a\u0651\u0650\u0628\u0650");
  if (tayyibIdx >= 0) {
    p19.terminology.push({ term: t179.slice(tayyibIdx, tayyibIdx + 9), transliteration: "al-tayyib", gloss: "the good/pure (editorial gloss)", keys: ["3:179"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p19.json"), JSON.stringify(p19, null, 2) + "\n");
console.log("Wrote 003-al-imran-p19.json");

// ─── Passage 20: 3:181–200 ────────────────────────────────────────────────────────
const p20 = {
  extractionId: "ext-003-p20",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 181, toAyah: 200, label: "Ali 'Imran — Allah heard poverty claim recorded prophet-killing taste burning; not unjust; fire-offering demand refuted prior messengers bayyinat zubur kitab muneer denied; death full recompense salvation mata' al-ghurur; tested wealth selves abuse sabr taqwa azm al-umur; covenant thrown sold thaman qaleel; unearned praise warning; dominion Qadeer; creation signs ulu al-albab dhikr tafakkur; four rabbana supplications; gender-equal reward emigration fighting gardens; deception warning brief enjoyment Jahannam; muttaqin gardens abrar; believing Ahl al-Kitab humble Saree' al-Hisab; isbiroo sabiroo rabitoo ittaqoo" },
  verseKeys: ["3:181","3:182","3:183","3:184","3:185","3:186","3:187","3:188","3:189","3:190","3:191","3:192","3:193","3:194","3:195","3:196","3:197","3:198","3:199","3:200"],
  arabicExcerpts: Array.from({length:20}, (_,i) => ({ key: `3:${i+181}`, text: fv(i+181) })),
  mainSubject: {
    label: "Blasphemous poverty claim recorded prophet-killing taste burning; divine non-injustice; fire-offering demand refuted prior messengers bayyinat zubur kitab muneer denied; universal death full recompense salvation zuhziha udkhila faza; mata' al-ghurur; testing wealth selves abuse sabr taqwa azm al-umur; covenant thrown sold thaman qaleel; unearned praise warning painful punishment; dominion Qadeer; creation night-day signs ulu al-albab; fourfold dhikr tafakkur; rabbana supplications 3:191-194 protection disgrace forgiveness abrar promise; divine response gender-equal reward emigration expulsion harm fighting gardens best reward; deception warning brief enjoyment Jahannam; muttaqin gardens rivers abrar; believing Ahl al-Kitab humble not selling ayat Saree' al-Hisab; closing isbiruu sabiroo rabitoo ittaqoo",
    keys: ["3:181","3:182","3:183","3:184","3:185","3:186","3:187","3:188","3:189","3:190","3:191","3:192","3:193","3:194","3:195","3:196","3:197","3:198","3:199","3:200"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Laqad sami'a Allahu qawl allatheena qaloo: divine hearing affirmed", keys: ["3:181"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah faqeer wa nahnu aghniya': blasphemous claim recorded", keys: ["3:181"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sanaktubu ma qaloo: recording of speech", keys: ["3:181"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wa qatlahum al-anbiya'a bi-ghayri haqq: unjust prophet-killing", keys: ["3:181"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dhooqoo adhab al-hareeq: taste burning punishment", keys: ["3:181"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bima qaddamat aydeekum: consequence of own deeds", keys: ["3:182"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Anna Allaha laysa bi-zallamin li-al-abid: divine non-injustice", keys: ["3:182"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Demand for fire-consumed offering as sign", keys: ["3:183"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Refutation: messengers came with bayyinat + same demand", keys: ["3:183"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fa-lim qataltumohum in kuntum sadiqeen: challenge", keys: ["3:183"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Denial pattern: kadhdhaba rusulun min qablikum", keys: ["3:184"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bayyinat zubur kitab muneer: clear proofs scriptures enlightening Book", keys: ["3:184"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kull nafsin dha'iqat al-mawt: universal death", keys: ["3:185"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Full recompense on Day of Resurrection", keys: ["3:185"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Salvation: zuhziha + udkhila + faza", keys: ["3:185"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mata' al-ghurur: worldly delusion", keys: ["3:185"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "La-tublawunna fi amwalikum wa anfusikum: testing announcement", keys: ["3:186"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Abuse from Ahl al-Kitab and mushrikeen", keys: ["3:186"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "In tasbiroo wa tattaqoo fa-inna dhalika min azm al-umur", keys: ["3:186"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant to explain scripture not conceal", keys: ["3:187"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nabadhuhu waraa'a zuhoorihim: throwing behind backs", keys: ["3:187"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ishtaraw bihi thamanan qaleelan: sold for small price", keys: ["3:187"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "La tahsabanna allatheena yafrahoona: false safety warning", keys: ["3:188"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yuhibboona an yuhmadoo bi-ma lam yaf'aloo: love unearned praise", keys: ["3:188"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Adhabun aleem: painful punishment", keys: ["3:188"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lillahi mulku al-samawat wa-al-ard: divine dominion", keys: ["3:189"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah ala kulli shay'in qadeer (3:189 dominion context)", keys: ["3:189"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Creation and night-day alternation as signs for ulu al-albab", keys: ["3:190"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fourfold dhikr posture: qiyaman qu'oodan ala junoobihim", keys: ["3:191"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yatafakkaroon fi khalq al-samawat wa-al-ard: creation reflection", keys: ["3:191"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication: rabbana ma khalaqta hatha batilan subhanaka faqina adhab al-nar", keys: ["3:191"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication: rabbana innaka man tudkhil al-nar faqad akhzaytahu", keys: ["3:192"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication: rabbana faghfir lana dhunoobana wa kaffir anna sayyi'atina wa tawaffana ma'a al-abrar", keys: ["3:193"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication: rabbana wa atina ma wa'adtana ala rusulika wa la tukhzina yawm al-qiyamah", keys: ["3:194"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine response: la odee'u amala amilin min thakarin aw ontha", keys: ["3:195"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gender-equal reward: ba'dukum min ba'din", keys: ["3:195"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Emigration expulsion harm fighting killing rewarded", keys: ["3:195"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "La yaghurrannaka taqallubu allatheena kafaroo: deception warning", keys: ["3:196"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mata'un qaleel thumma ma'wahum jahannam: brief enjoyment then Hell", keys: ["3:197"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Muttaqin gardens rivers eternal accommodation from Allah", keys: ["3:198"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ma 'inda Allah khayrun li-al-abrar", keys: ["3:198"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believing Ahl al-Kitab: humble not selling ayat for small price", keys: ["3:199"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Saree' al-hisab: swift in account", keys: ["3:199"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Closing: isbiruu wa sabiroo wa rabitoo wa ittaqoo Allah", keys: ["3:200"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "La'allakum tuflihun: success condition", keys: ["3:200"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Prior messengers denied despite bayyinat zubur kitab muneer", keys: ["3:184"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prior messengers came with fire-consumed offering yet were killed", keys: ["3:183"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Blasphemous arrogance as spiritual bankruptcy", keys: ["3:181"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ulu al-albab: reflective believers combining dhikr and tafakkur", keys: ["3:190","3:191"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplicant posture: comprehensive du'a sequence", keys: ["3:191","3:192","3:193","3:194"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Scripture commodification: selling ayat for thaman qaleel", keys: ["3:187"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0170","cand-0171","cand-0173","cand-0174","cand-0175","cand-0176"],
  notes: "Pass A Imran passage 20/20. Final section synthesizes surah themes. Mata' al-ghurur (3:185) definitive worldly characterization. Azm al-umur (3:186) resolve formula. Scripture-selling motif (3:187) echoes earlier critique. Four rabbana supplications (3:191-194) unique concentration. Gender-equal reward (3:195) explicit. Ulu al-albab profile (3:190-191) combines dhikr and tafakkur. Closing quadruple imperative (3:200) unique: isbiruu/sabiroo/rabitoo/ittaqoo. Saree' al-Hisab (3:199) closes Ahl al-Kitab discussion.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P20
{
  p20.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:181"], excerpt: fv(181), description: "Command: say 'Taste the burning punishment' as consequence of what your hands have sent forward." });
  p20.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:186"], excerpt: fv(186), description: "Conditional: if you are patient and fear Allah, that is from the matters of determination." });
  p20.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["3:191"], excerpt: fv(191), description: "Taught supplication: Our Lord, You did not create this aimlessly; exalted are You; protect us from the punishment of the Fire." });
  p20.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["3:192"], excerpt: fv(192), description: "Taught supplication: Our Lord, indeed whoever You admit to the Fire You have disgraced, and for the wrongdoers there are no helpers." });
  p20.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["3:193"], excerpt: fv(193), description: "Taught supplication: Our Lord, we heard a caller calling to faith and we believed; forgive us our sins, remove our misdeeds, and cause us to die with the righteous." });
  p20.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["3:194"], excerpt: fv(194), description: "Taught supplication: Our Lord, grant us what You promised through Your messengers and do not disgrace us on the Day of Resurrection; You do not fail in promise." });
  p20.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["3:196"], excerpt: fv(196), description: "Prohibition: let not the movement of disbelievers throughout the land deceive you." });
  p20.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:200"], excerpt: fv(200), description: "Closing quadruple imperative: persevere, endure, remain stationed, and fear Allah that you may be successful." });
}

// Extract divine names from P20
{
  const t189 = fv(189);
  const qadeerIdx = t189.indexOf("\u0642\u064e\u062f\u0650\u064a\u0631\u064c");
  if (qadeerIdx >= 0) {
    p20.divineNamesAndAttributes.push({ term: t189.slice(qadeerIdx, qadeerIdx + 6), transliteration: "Qadeer", gloss: "All-Powerful (editorial gloss)", keys: ["3:189"] });
  }

  const t199 = fv(199);
  const sareeIdx = t199.indexOf("\u0633\u064e\u0631\u0650\u064a\u0639\u064f \u0671\u0644\u0652\u062d\u0650\u0633\u064e\u0627\u0628\u0650");
  if (sareeIdx >= 0) {
    p20.divineNamesAndAttributes.push({ term: t199.slice(sareeIdx, sareeIdx + 16), transliteration: "Saree' al-Hisab", gloss: "Swift in Account (editorial gloss)", keys: ["3:199"] });
  }
}

// Extract terminology from P20
{
  const t185 = fv(185);
  const ghururIdx = t185.indexOf("\u0671\u0644\u0652\u063a\u064f\u0631\u064f\u0648\u0631\u0650");
  if (ghururIdx >= 0) {
    p20.terminology.push({ term: t185.slice(ghururIdx, ghururIdx + 10), transliteration: "al-ghurur", gloss: "delusion/deception (editorial gloss)", keys: ["3:185"] });
  }

  const t186 = fv(186);
  const azmIdx = t186.indexOf("\u0639\u064e\u0632\u0652\u0645\u0650 \u0671\u0644\u0652\u0623\u064f\u0645\u064f\u0648\u0631\u0650");
  if (azmIdx >= 0) {
    p20.terminology.push({ term: t186.slice(azmIdx, azmIdx + 16), transliteration: "azm al-umur", gloss: "determination of affairs (editorial gloss)", keys: ["3:186"] });
  }

  const t187 = fv(187);
  const thamanIdx = t187.indexOf("\u062b\u064e\u0645\u064e\u0646\u064b\u0627 \u0642\u064e\u0644\u0650\u064a\u0644\u064b\u0627");
  if (thamanIdx >= 0) {
    p20.terminology.push({ term: t187.slice(thamanIdx, thamanIdx + 14), transliteration: "thamanan qaleelan", gloss: "small/trivial price (editorial gloss)", keys: ["3:187"] });
  }

  const t190 = fv(190);
  const uluIdx = t190.indexOf("\u0623\u064f\u0648\u0644\u0650\u064a \u0671\u0644\u0652\u0623\u064e\u0644\u0652\u0628\u064e\u0627\u0628\u0650");
  if (uluIdx >= 0) {
    p20.terminology.push({ term: t190.slice(uluIdx, uluIdx + 16), transliteration: "ulu al-albab", gloss: "people of understanding/intellect (editorial gloss)", keys: ["3:190"] });
  }

  const t193 = fv(193);
  const abrarIdx = t193.indexOf("\u0671\u0644\u0652\u0623\u064e\u0628\u0652\u0631\u064e\u0627\u0631\u0650");
  if (abrarIdx >= 0) {
    p20.terminology.push({ term: t193.slice(abrarIdx, abrarIdx + 10), transliteration: "al-abrar", gloss: "the righteous/devout (editorial gloss)", keys: ["3:193"] });
  }

  const t200 = fv(200);
  const rabitooIdx = t200.indexOf("\u0631\u064e\u0627\u0628\u0650\u0637\u064f\u0648\u0627");
  if (rabitooIdx >= 0) {
    p20.terminology.push({ term: t200.slice(rabitooIdx, rabitooIdx + 8), transliteration: "rabitoo", gloss: "remain stationed/guard frontiers (editorial gloss)", keys: ["3:200"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p20.json"), JSON.stringify(p20, null, 2) + "\n");
console.log("Wrote 003-al-imran-p20.json");

// ─── Candidates batch (cand-0167 through cand-0176) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-003-p17,ext-003-p18,ext-003-p19,ext-003-p20",
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

// cand-0167: Jahiliyyah thought — pre-Islamic fatalism resurfacing under crisis
candidates.candidates.push(makeCand("cand-0167",
  "Jahiliyyah thought: pre-Islamic fatalistic assumptions resurfacing in believers under battlefield crisis",
  undefined, "\u062c\u0627\u06c1\u0644\u06cc\u0627\u0646\u06c1 \u0633\u0648\u0686: \u0628\u062d\u0631\u0627\u0646 \u0645\u06cc\u06ba \u067e\u0631\u0627\u0646\u06cc \u0639\u0642\u06cc\u062f\u06c1",
  "In 3:154: Then there came upon you after the distress security — drowsiness covering a party of you, while another party had become anxious about themselves, thinking wrongly about Allah with the assumption of jahiliyyah.",
  [{ key: "3:154", excerpt: fv(154), evidenceClass: "EXPLICIT_TEXT", rationale: "Zann al-jahiliyyah explicitly named as the cognitive framework of the anxious party. Contrasts with divine assurance (amanatan nu'asan) given to the other party." }],
  [],
  "Gap candidate: no dedicated jahiliyyah-thought or pre-islamic-mindset topic. Unique explicit naming of jahiliyyah cognition within a believer context. Shows how crisis triggers regression to pre-faith assumptions."
));

// cand-0168: Divine pardon after failure — Allah's 'afw toward believers despite disobedience
candidates.candidates.push(makeCand("cand-0168",
  "Divine pardon after failure: Allah's 'afw toward believers despite battlefield disobedience and weakness",
  undefined, "\u0646\u0627\u06a9\u0627\u0645\u06cc \u06a9\u06d2 \u0628\u0639\u062f \u0639\u0641\u0648: \u0627\u0644\u0644\u06c1 \u06a9\u0627 \u0639\u0641\u0648",
  "In 3:152: Until when you lost courage and fell to disputing about the matter and disobeyed after He had shown you that which you love. Among you are some who desire this world, and among you are some who desire the Hereafter. Then He turned you back from them in order to test you. And He has already pardoned you. And Allah is the Possessor of Bounty for the believers.",
  [{ key: "3:152", excerpt: fv(152), evidenceClass: "EXPLICIT_TEXT", rationale: "Wa laqad 'afa 'ankum follows triple failure diagnosis (fashil/tanazu'/asa). Pardon precedes any repentance mention, emphasizing divine initiative. Dhu fadl frames pardon as bounty not obligation." }],
  [{ topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "repentance", layer: "curated", relationship: "related-not-identical" }],
  "Overlap with divine-mercy and repentance confirmed. Distinctive as pardon granted BEFORE explicit repentance. Context is collective military failure, not individual sin. 'Afw differs from maghfirah in scope."
));

// cand-0169: Counterfactual grief prohibition — divine making of hasrah in hearts
candidates.candidates.push(makeCand("cand-0169",
  "Counterfactual grief prohibition: divine making of hasrah (regret) in hearts through 'what if' thinking about the dead",
  undefined, "\u0641\u0631\u0636\u06cc \u063a\u0645 \u06a9\u06cc \u0645\u0645\u0646\u0648\u0639\u06cc\u062a: \u062d\u0633\u0631\u062a \u06a9\u0627 \u0628\u0646\u0627\u0646\u0627",
  "In 3:156: O you who have believed, do not be like those who disbelieved and said about their brothers who traveled through the land or were fighting, 'If they had been with us, they would not have died or been killed,' so that Allah makes that a source of regret in their hearts.",
  [{ key: "3:156", excerpt: fv(156), evidenceClass: "EXPLICIT_TEXT", rationale: "La takoonoo ka-allatheena kafaroo establishes behavioral boundary. Li-yaj'ala Allahu dhalika hasratan fi quloobihim reveals divine pedagogical purpose of allowing regret." }],
  [{ topicId: "sabr-patience", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with sabr-patience confirmed. Unique psychological insight: counterfactual thinking ('if only') identified as kafir-pattern behavior. Hasrah as divine-made consequence rather than natural emotion. Connects to qadar theology."
));

// cand-0170: Scripture commodification — selling divine revelation for trivial worldly gain
candidates.candidates.push(makeCand("cand-0170",
  "Scripture commodification: selling divine revelation for trivial worldly gain as wretched purchase",
  undefined, "\u06a9\u062a\u0627\u0628 \u06a9\u06cc \u062a\u062c\u0627\u0631\u062a: \u0645\u0645\u0648\u0644\u06cc \u0645\u0646\u0627\u0641\u0639 \u06a9\u06d2 \u0644\u06cc\u06d2 \u0648\u062d\u06cc \u0628\u06cc\u0686\u0646\u0627",
  "In 3:187: And when Allah took a covenant from those who were given the Scripture, 'You must make it clear to the people and not conceal it.' But they threw it away behind their backs and exchanged it for a small price. And wretched is that which they purchased.",
  [{ key: "3:187", excerpt: fv(187), evidenceClass: "EXPLICIT_TEXT", rationale: "Ishtaraw bihi thamanan qaleelan: explicit commercial metaphor for scripture betrayal. Bi'sa ma yashtaroon evaluates the transaction as wretched." }],
  [],
  "Gap candidate: no dedicated scripture-commodification or religious-corruption-for-gain topic. Commercial vocabulary (ishtara/thaman/qaleel) frames spiritual betrayal as economic transaction. Echoes 2:79 (wail li-allatheena yaktuboona)."
));

// cand-0171: Mata' al-ghurur — worldly life characterized as enjoyment of delusion
candidates.candidates.push(makeCand("cand-0171",
  "Mata' al-ghurur: worldly life definitively characterized as enjoyment of delusion",
  undefined, "\u0645\u062a\u0627\u0639 \u0627\u0644\u063a\u0631\u0648\u0631: \u062f\u0646\u06cc\u0627 \u06a9\u06cc \u062d\u0642\u06cc\u0642\u062a",
  "In 3:185: And what is the worldly life except the enjoyment of delusion.",
  [{ key: "3:185", excerpt: fv(185), evidenceClass: "EXPLICIT_TEXT", rationale: "Wa ma al-hayat al-dunya illa mata' al-ghurur: definitive equation using illa (nothing except). Ghurur implies active deception, not mere transience." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap with day-of-judgment via eschatological framing. Distinctive vocabulary: mata' (temporary provision/enjoyment) + ghurur (delusion/deception). Stronger than mere 'transient' characterization. Appears once in this passage range at 3:185."
));

// cand-0172: Hypocrite proximity to kufr — verbal profession without heart conviction
candidates.candidates.push(makeCand("cand-0172",
  "Hypocrite proximity to kufr: verbal profession of faith disconnected from heart conviction as closer to disbelief",
  undefined, "\u0645\u0646\u0627\u0641\u0642\u06cc\u0646 \u06a9\u0627 \u06a9\u0641\u0631 \u0633\u06d2 \u0642\u0631\u0628: \u0632\u0628\u0627\u0646\u06cc \u0627\u0642\u0631\u0627\u0631 \u0628\u063a\u06cc\u0631 \u062f\u0644\u06cc \u06cc\u0642\u06cc\u0646",
  "In 3:167: And that He might make evident those who are hypocrites. For it was said to them, 'Come, fight in the way of Allah or defend.' They said, 'If we had known there would be fighting, we would have followed you.' They were nearer to disbelief that day than to faith, saying with their mouths what was not in their hearts. And Allah is most Knowing of what they conceal.",
  [{ key: "3:167", excerpt: fv(167), evidenceClass: "EXPLICIT_TEXT", rationale: "Hum li-al-kufr yawma-idhin aqrabu minhum li-al-iman: explicit proximity measurement. Yaquoloona bi-afwahihim ma laysa fi quloobihim defines the disconnect." }],
  [],
  "Gap candidate: no dedicated hypocrisy-psychology or nifaq-inner-state topic. Distinctive as quantified spiritual assessment (aqrab). Mouth-heart disconnect formula appears uniquely here. Battlefield context makes hypocrisy concrete rather than abstract."
));

// cand-0173: Quadruple imperative closing — isbiruu/sabiroo/rabitoo/ittaqoo as comprehensive endurance formula
candidates.candidates.push(makeCand("cand-0173",
  "Quadruple imperative closing: isbiruu/sabiroo/rabitoo/ittaqoo as comprehensive endurance formula for believers",
  undefined, "\u0686\u0627\u0631 \u06af\u0646\u0627 \u062d\u06a9\u0645: \u0635\u0628\u0631\u060c \u062b\u0628\u0627\u062a\u060c \u0645\u0631\u0632\u0628\u0627\u0646\u06cc\u060c \u062a\u0642\u0648\u06ccٰ",
  "In 3:200: O you who have believed, be patient and endure and guard the frontiers and fear Allah that you may be successful.",
  [{ key: "3:200", excerpt: fv(200), evidenceClass: "EXPLICIT_TEXT", rationale: "Four imperatives in sequence: isbiruu (be patient), sabiroo (endure/persevere), rabitoo (guard frontiers/bind together), ittaqoo Allah (fear Allah). La'allakum tuflihun provides success condition." }],
  [{ topicId: "sabr-patience", layer: "scholarly", relationship: "broader" },
   { topicId: "patience-haste", layer: "scholarly", relationship: "broader" }],
  "Overlap with sabr-patience and patience-haste confirmed. Unique four-part imperative structure in Quran. Isbiruu vs sabiroo distinction suggests initial patience vs sustained endurance. Rabitoo adds communal/military dimension. Closes entire surah with actionable summary."
));

// cand-0174: Blasphemous poverty claim — 'Allah is poor we are rich' as recorded transgression
candidates.candidates.push(makeCand("cand-0174",
  "Blasphemous poverty claim: 'Allah is poor we are rich' as divinely recorded transgression warranting burning punishment",
  undefined, "\u06a9\u0641\u0631\u06cc\u0627\u0646\u06c1 \u062f\u0639\u0648\u06ccٰ: \u0627\u0644\u0644\u06c1 \u063a\u0631\u06cc\u0628 \u06c1\u0645 \u0627\u0645\u06cc\u0631",
  "In 3:181: Allah has certainly heard the statement of those who said, 'Indeed, Allah is poor, while we are rich.' We will record what they said and their killing of the prophets without right and will say, 'Taste the punishment of the Burning Fire.'",
  [{ key: "3:181", excerpt: fv(181), evidenceClass: "EXPLICIT_TEXT", rationale: "Laqad sami'a Allahu affirms divine hearing. Sanaktubu ma qaloo establishes permanent record. Dhooqoo adhab al-hareeq links speech to punishment." }],
  [],
  "Gap candidate: no dedicated blasphemy-types or divine-poverty-claim topic. Unique explicit quotation of anti-theological speech. Recording (sanaktubu) emphasizes accountability for speech. Paired with prophet-killing as dual transgression."
));

// cand-0175: Ulu al-albab dhikr-tafakkur profile — fourfold remembrance combined with creation reflection
candidates.candidates.push(makeCand("cand-0175",
  "Ulu al-albab dhikr-tafakkur profile: fourfold remembrance posture combined with creation reflection yielding theological insight",
  undefined, "\u0627\u0648\u0644\u0648 \u0627\u0644\u0627\u0644\u0628\u0627\u0628: \u0630\u06a9\u0631 \u0627\u0648\u0631 \u062a\u0641\u06a9\u0631 \u06a9\u0627 \u0646\u0645\u0648\u0646\u06c1",
  "In 3:190–191: Indeed, in the creation of the heavens and the earth and the alternation of the night and the day are signs for those of understanding, who remember Allah while standing or sitting or on their sides and give thought to the creation of the heavens and the earth, saying, 'Our Lord, You did not create this aimlessly; exalted are You; protect us from the punishment of the Fire.'",
  [{ key: "3:190", excerpt: fv(190), evidenceClass: "EXPLICIT_TEXT", rationale: "Inna fee khalqi al-samawat wa-al-ardi wa-ikhtilafi allayli wa-al-nahari la-ayatin li-uli al-albab: establishes creation and alternation as signs for people of understanding." },
   { key: "3:191", excerpt: fv(191), evidenceClass: "EXPLICIT_TEXT", rationale: "Allatheena yathkuroona Allaha qiyaman wa-qu'oodan wa-ala junoobihim wa-yatafakkaroon: fourfold posture (standing, sitting, lying) plus tafakkur. Rabbana ma khalaqta hatha batilan: theological conclusion from reflection. Subhanaka: recognition of divine transcendence. Faqina adhab al-nar: practical supplication flowing from reflection." }],
  [{ topicId: "reflection-tafakkur", layer: "scholarly", relationship: "same-concept" },
   { topicId: "remembrance-forgetfulness", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "signs-and-reflection", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with reflection-tafakkur, remembrance-forgetfulness, and signs-and-reflection confirmed. Unique combination: dhikr in all physical postures paired with active tafakkur on creation. Theological insight (not created in vain) emerges from reflection rather than revelation. Supplication naturally follows recognition. Defines ulu al-albab profile concretely."
));

// cand-0176: Salvation formula — distance from Fire plus Jannah admission as true success
candidates.candidates.push(makeCand("cand-0176",
  "Salvation formula: distance from Fire combined with Jannah admission as the definition of true success (fawz)",
  undefined, "\u0646\u062c\u0627\u062a \u06a9\u0627 \u0641\u0627\u0631\u0645\u0648\u0644\u0627: \u0622\u06af \u0633\u06d2 \u062f\u0648\u0631\u06cc \u0627\u0648\u0631 \u062c\u0646\u062a \u0645\u06cc\u06ba \u062f\u0627\u062e\u0644\u06c1",
  "In 3:185: So he who is drawn away from the Fire and admitted to Paradise has attained success.",
  [{ key: "3:185", excerpt: fv(185), evidenceClass: "EXPLICIT_TEXT", rationale: "Fa-man zuhziha 'an al-nari wa udkhila al-jannata fa-qad faz: two-condition salvation formula. Zuhziha (drawn away/distance) implies active divine rescue. Faza defines ultimate success." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with day-of-judgment confirmed. Most concise Quranic salvation formula. Two conditions necessary: negative (distance from Fire) AND positive (Jannah entry). Neither alone suffices. Faza vocabulary connects to falah (success) root."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-017.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-017.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-003-p17 through ext-003-p20)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0167 through cand-${String(166 + candidates.candidates.length).padStart(4,'0')})`);
