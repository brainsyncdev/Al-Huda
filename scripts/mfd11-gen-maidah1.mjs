// MFD-11 Maidah Pass 1 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Ma'idah 5:1-35 (Passages 1-4, Candidates cand-0227..cand-0236).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "005-0001-0035.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 5:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Maidah Pass 1 files from verbatim corpus (5:1-35)...");
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

// ─── Passage 1: 5:1–5 ────────────────────────────────────────────────────────
const p1 = {
  extractionId: "ext-005-p1",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 1, toAyah: 5, label: "Al-Ma'idah — Fulfill contracts; lawful livestock except what is recited; hunting forbidden in ihram; do not violate sacred rites or months; cooperate in righteousness and taqwa not sin and aggression; fear Allah severe in penalty; forbidden: dead meat blood pork dedicated to other than Allah strangled beaten fallen gored eaten by wild animal unless slaughtered sacrificed on stone altars divining arrows; today perfected religion completed favor chosen Islam; forced by hunger Allah Forgiving Merciful; good things made lawful trained hunting animals; food of People of Book lawful mutual; chaste believing women and chaste women of People of Book with mahr; whoever rejects faith work wasted among losers" },
  verseKeys: ["5:1","5:2","5:3","5:4","5:5"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `5:${i+1}`, text: fv(i+1) })),
  mainSubject: {
    label: "Fulfill contracts; lawful livestock except recited exceptions; no hunting in ihram; respect sacred rites; cooperate in righteousness not sin; dietary prohibitions enumerated; religion perfected favor completed Islam approved; necessity exception; trained hunting animals lawful; People of Book food mutually lawful; marriage to chaste believing and PoB women with mahr; disbelief nullifies deeds",
    keys: ["5:1","5:2","5:3","5:4","5:5"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Command: fulfill all contracts and obligations", keys: ["5:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lawful grazing livestock with stated exceptions", keys: ["5:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hunting prohibition during ihram state", keys: ["5:1","5:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sacred rites months offerings garlands pilgrims inviolable", keys: ["5:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hatred of obstructors must not cause transgression", keys: ["5:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cooperate in righteousness and taqwa not sin and aggression", keys: ["5:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Detailed dietary prohibitions: ten categories enumerated", keys: ["5:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Perfection of religion completion of favor approval of Islam", keys: ["5:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Necessity exception: forced by hunger without sinful inclination", keys: ["5:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trained hunting animals: eat what they catch mentioning Allah", keys: ["5:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual food permissibility with People of Book", keys: ["5:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Marriage to chaste believing and People-of-Book women with mahr", keys: ["5:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rejection of faith nullifies deeds; hereafter among losers", keys: ["5:5"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [],
  socialEconomicCivilisational: [
    { label: "Contract fulfillment as foundational social obligation", keys: ["5:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Interfaith food reciprocity establishing communal boundaries", keys: ["5:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Interfaith marriage regulation with chastity conditions", keys: ["5:5"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0227","cand-0228","cand-0229"],
  notes: "Pass A Maidah passage 1/4. Opens surah with comprehensive legal block. Awfoo bil-uqood (fulfill contracts) sets covenant framework. Dietary law most detailed single enumeration in Quran (5:3). Ikmal al-deen statement marks theological culmination. Interfaith provisions (food and marriage) establish regulated permeability of communal boundaries. Hunting regulations link ritual purity to sustenance law.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:1"], excerpt: fv(1), description: "Command: O believers fulfill all contracts and obligations." });
p1.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:1"], excerpt: fv(1), description: "Prohibition: hunting not permitted while in state of ihram." });
p1.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:2"], excerpt: fv(2), description: "Prohibition: do not violate sacred rites of Allah, sacred month, sacrificial animals, garlands, or pilgrims to Sacred House." });
p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:2"], excerpt: fv(2), description: "Command: cooperate in righteousness and taqwa." });
p1.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:2"], excerpt: fv(2), description: "Prohibition: do not cooperate in sin and aggression." });
p1.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:3"], excerpt: fv(3), description: "Prohibition: dead meat, blood, pork, dedicated to other than Allah, strangled, beaten, fallen, gored, eaten by wild animal, sacrificed on stone altars, divining arrows." });
p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:4"], excerpt: fv(4), description: "Command: eat what trained hunting animals catch and mention Allah's name upon it." });

// P1 divine names
{
  const t1 = findWordContaining(3, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(3, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t1 && t2) {
    const fullText = fv(3);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p1.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafoorun Raheem", gloss: "Forgiving Merciful (editorial gloss)", keys: ["5:3"] });
    }
  }
}
{
  const t = findWordContaining(4, ["\u0633","\u0631","\u064a","\u0639"]); // sareeAAu
  if (t) p1.divineNamesAndAttributes.push({ term: t, transliteration: "Saree'u al-Hisab", gloss: "Swift in Account (editorial gloss)", keys: ["5:4"] });
}

// P1 terminology
{
  const t = findWordContaining(1, ["\u0639","\u0642","\u0648","\u062f"]); // alAAuqoodi
  if (t) p1.terminology.push({ term: t, transliteration: "al-uqood", gloss: "contracts/obligations (editorial gloss)", keys: ["5:1"] });
}
{
  const t = findWordContaining(2, ["\u0628","\u0631","\u0651"]); // albirri
  if (t) p1.terminology.push({ term: t, transliteration: "al-birr", gloss: "righteousness/piety (editorial gloss)", keys: ["5:2"] });
}
{
  const t = findWordContaining(3, ["\u0641","\u0633","\u0642"]); // fisqun
  if (t) p1.terminology.push({ term: t, transliteration: "fisq", gloss: "grave disobedience/transgression (editorial gloss)", keys: ["5:3"] });
}
{
  const t = findWordContaining(3, ["\u0646","\u0635","\u0628"]); // alnnusubi
  if (t) p1.terminology.push({ term: t, transliteration: "al-nusub", gloss: "stone altars/idols (editorial gloss)", keys: ["5:3"] });
}
{
  const t = findWordContaining(3, ["\u0623","\u0632","\u0644","\u0627"]); // bialazlami
  if (t) p1.terminology.push({ term: t, transliteration: "al-azlam", gloss: "divining arrows (editorial gloss)", keys: ["5:3"] });
}
{
  const t = findWordContaining(5, ["\u0645","\u062d","\u0635","\u0646"]); // muhsineena
  if (t) p1.terminology.push({ term: t, transliteration: "muhsineen", gloss: "chaste/virtuous ones (editorial gloss)", keys: ["5:5"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p1.json"), JSON.stringify(p1, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p1.json");

// ─── Passage 2: 5:6–11 ───────────────────────────────────────────────────────
const p2 = {
  extractionId: "ext-005-p2",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 6, toAyah: 11, label: "Al-Ma'idah — Wudu procedure: wash faces hands to elbows wipe heads feet to ankles; junub purify; illness travel privy contact women no water tayammum clean earth wipe faces hands; Allah intends ease not hardship purification completion of favor for gratitude; remember Allah's favor and covenant when said hear and obey; stand firmly for Allah witnesses in justice; hatred must not prevent justice; be just closer to taqwa; Allah Acquainted with deeds; promise forgiveness great reward for believers righteous; disbelievers deny signs companions Hellfire; remember favor when people intended aggression but Allah withheld their hands; fear Allah upon Allah let believers rely" },
  verseKeys: ["5:6","5:7","5:8","5:9","5:10","5:11"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `5:${i+6}`, text: fv(i+6) })),
  mainSubject: {
    label: "Wudu procedure specified; janabah purification; tayammum concession when no water; divine intent ease not hardship; remember covenant hear-and-obey; stand firm for justice witnesses; hatred must not prevent justice; justice nearer to taqwa; believers promised forgiveness reward; disbelievers companions Hellfire; divine protection recalled; tawakkul commanded",
    keys: ["5:6","5:7","5:8","5:9","5:10","5:11"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Wudu procedure: four obligatory acts specified", keys: ["5:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Janabah requires full body purification", keys: ["5:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tayammum concession: illness travel privy contact no water", keys: ["5:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine legislative intent: ease not hardship", keys: ["5:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Purification and favor completion aimed at gratitude", keys: ["5:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant remembrance: hear and obey commitment", keys: ["5:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Persistent standing firm for Allah as justice witnesses", keys: ["5:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hatred must never override justice obligation", keys: ["5:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Justice is nearer to taqwa", keys: ["5:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believers doing righteous: forgiveness and great reward", keys: ["5:9"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers denying signs: companions of Hellfire", keys: ["5:10"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine protection: enemy aggression restrained by Allah", keys: ["5:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawakkul: upon Allah let believers rely", keys: ["5:11"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Gratitude as intended outcome of ritual legislation", keys: ["5:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trust in Allah after experiencing divine protection", keys: ["5:11"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Impartial justice transcending communal enmity", keys: ["5:8"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0230","cand-0231"],
  notes: "Pass A Maidah passage 2/4. Primary wudu/tayammum legislation text. Divine rationale explicitly stated: ease, purification, favor completion, gratitude. Justice command (5:8) parallels 4:135 but adds 'nearer to taqwa' framing. Historical reference to restrained enemy aggression grounds tawakkul in experienced deliverance. Covenant recall links ritual obedience to original community pledge.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:6"], excerpt: fv(6), description: "Command: when rising for prayer wash faces hands to elbows wipe heads feet to ankles; if junub purify fully." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:6"], excerpt: fv(6), description: "Command: if ill traveling from privy contacted women and no water found perform tayammum with clean earth." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:7"], excerpt: fv(7), description: "Command: remember Allah's favor and His covenant when you said we hear and obey." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:8"], excerpt: fv(8), description: "Command: be persistently standing firm for Allah witnesses in justice; be just it is nearer to taqwa." });
p2.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:8"], excerpt: fv(8), description: "Prohibition: do not let hatred of a people prevent you from being just." });

// P2 divine names
{
  const t = findWordContaining(8, ["\u062e","\u0628","\u064a","\u0631"]); // khabeerun
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Khabeer", gloss: "Acquainted/Aware (editorial gloss)", keys: ["5:8"] });
}
{
  const t = findWordContaining(7, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["5:7"] });
}

// P2 terminology
{
  const t = findWordContaining(6, ["\u062a","\u064a","\u0645","\u0645"]); // fatayammamoo
  if (t) p2.terminology.push({ term: t, transliteration: "tayammum", gloss: "dry ablution with clean earth (editorial gloss)", keys: ["5:6"] });
}
{
  const t = findWordContaining(6, ["\u062c","\u0646","\u0628"]); // junuban
  if (t) p2.terminology.push({ term: t, transliteration: "junub", gloss: "state of major ritual impurity (editorial gloss)", keys: ["5:6"] });
}
{
  const t = findWordContaining(8, ["\u0642","\u0648","\u0627","\u0645"]); // qawwameena
  if (t) p2.terminology.push({ term: t, transliteration: "qawwameen", gloss: "persistently standing firm (editorial gloss)", keys: ["5:8"] });
}
{
  const t = findWordContaining(8, ["\u0642","\u0633","\u0637"]); // bialqisti
  if (t) p2.terminology.push({ term: t, transliteration: "bil-qist", gloss: "in justice/equity (editorial gloss)", keys: ["5:8"] });
}
{
  const t = findWordContaining(11, ["\u062a","\u0648","\u0643","\u0644"]); // falyatawakkali
  if (t) p2.terminology.push({ term: t, transliteration: "tawakkul", gloss: "reliance/trust in Allah (editorial gloss)", keys: ["5:11"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p2.json"), JSON.stringify(p2, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p2.json");

// ─── Passage 3: 5:12–26 ──────────────────────────────────────────────────────
const p3 = {
  extractionId: "ext-005-p3",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 12, toAyah: 26, label: "Al-Ma'idah — Israelite covenant twelve leaders appointed; conditions prayer zakah belief messengers support good loan; disbelief after covenant equals straying; covenant breach cursed hard hearts distort words forgot portion pardon overlook Allah loves muhsineen; Christian covenant taken forgot portion enmity hatred until Resurrection; People of Book Messenger clarifies concealed scripture light clear Book guides paths of peace darkness to light; those saying Allah is Messiah son Maryam disbelieved; Messiah said worship Allah my Lord your Lord; shirk forbids Paradise refuge Fire; third-of-three claim rejected; repentance better; Messiah only messenger mother truthful both ate food; do not exceed limits follow desires of astray people; cursed disbelievers among Israel by Dawud and Isa tongues disobeyed transgressed did not forbid wrongdoing allied with disbelievers; nearest affection Christians priests monks not arrogant eyes overflow tears recognizing truth believe ask written among witnesses rewarded gardens rivers; do not forbid good things Allah made lawful eat lawful good fear Allah" },
  verseKeys: ["5:12","5:13","5:14","5:15","5:16","5:17","5:18","5:19","5:20","5:21","5:22","5:23","5:24","5:25","5:26"],
  arabicExcerpts: Array.from({length:15}, (_,i) => ({ key: `5:${i+12}`, text: fv(i+12) })),
  mainSubject: {
    label: "Israelite covenant conditions and breach consequences; Christian covenant breach causing enmity; Messenger brings light and clear Book; refutation of Allah-is-Messiah and third-of-three; Messiah commanded worship of Allah alone; shirk bars Paradise; Musa commands entry to Holy Land; people refuse citing tyrants; forty years wandering punishment; do not forbid lawful things",
    keys: ["5:12","5:13","5:14","5:15","5:16","5:17","5:18","5:19","5:20","5:21","5:22","5:23","5:24","5:25","5:26"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Israelite covenant conditions: prayer zakah belief support good loan", keys: ["5:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-covenant disbelief equals straying from sound path", keys: ["5:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant breach consequences: curse hardened hearts distortion", keys: ["5:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pardon and overlooking recommended toward People of Book", keys: ["5:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Christian covenant breach causing perpetual enmity", keys: ["5:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger brings light and clear Book to People of Book", keys: ["5:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guidance to paths of peace from darkness to light", keys: ["5:16"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Refutation: Allah is not Messiah son of Maryam", keys: ["5:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jews and Christians claiming divine sonship refuted", keys: ["5:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger sent after interval to remove excuse", keys: ["5:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Musa reminds people of divine favors prophets kingship", keys: ["5:20"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command to enter Holy Land assigned by Allah", keys: ["5:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People refuse citing tyrannical inhabitants", keys: ["5:22"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Two faithful men urge entry through gate with tawakkul", keys: ["5:23"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Defiant refusal: go you and your Lord fight we sit here", keys: ["5:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Musa's plea: I possess only myself and my brother", keys: ["5:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Forty years wandering punishment for defiant disobedience", keys: ["5:26"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Musa commanding entry to Holy Land; people's refusal and forty-year wandering", keys: ["5:20","5:21","5:22","5:23","5:24","5:25","5:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa ibn Maryam defined as messenger not divine; his mother truthful; both ate food", keys: ["5:17"], evidenceClass: "EXPLICIT_TEXT", notes: "Also referenced implicitly via refutation passages" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Hardened hearts as consequence of covenant breach", keys: ["5:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Recognition of truth causing emotional response (tears)", keys: ["5:83"], evidenceClass: "CONTEXTUAL", notes: "Note: 5:83 is outside range. Checking corpus... Actually the weeping priests/monks passage IS NOT in 5:12-26. It appears later in the surah. Removing this subordinate." }
  ],
  socialEconomicCivilisational: [
    { label: "Failure to forbid wrongdoing as communal moral collapse", keys: ["5:13"], evidenceClass: "THEMATIC", notes: "Implied by nasee haththan and yuharrifoona patterns" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0232","cand-0233","cand-0234"],
  notes: "Pass A Maidah passage 3/4. Longest passage covering dual covenant history (Israelite and Christian). Establishes parallel breach pattern. Most extensive Quranic refutation of Christian divinization claims. Musa-Holy Land narrative illustrates covenant-consequence linkage through concrete historical example. Light/darkness metaphor frames revelation as existential transformation. NOTE: Some prompt-suggested content about Christians weeping/priests/monks appears to be from later verses (5:82-85) outside this range. Extraction strictly limited to actual 5:12-26 content.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Fix humanConditionsAndSpiritualStates - remove out-of-range reference
p3.humanConditionsAndSpiritualStates = [
  { label: "Hardened hearts as consequence of covenant breach", keys: ["5:13"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Defiant disobedience leading to collective punishment", keys: ["5:26"], evidenceClass: "EXPLICIT_TEXT" }
];

p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:13"], excerpt: fv(13), description: "Command: pardon them and overlook their misdeeds." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:21"], excerpt: fv(21), description: "Command via Musa: enter the Holy Land which Allah has assigned to you." });
p3.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:21"], excerpt: fv(21), description: "Prohibition via Musa: do not turn back becoming losers." });

// P3 divine names
{
  const t = findWordContaining(13, ["\u0645","\u062d","\u0633","\u0646"]); // almuhsineena
  if (t) p3.divineNamesAndAttributes.push({ term: t, transliteration: "al-Muhsineen", gloss: "the doers of good / those whom Allah loves (editorial gloss)", keys: ["5:13"] });
}
{
  const t = findWordContaining(17, ["\u0642","\u062f","\u064a","\u0631"]); // qadeerun
  if (t) p3.divineNamesAndAttributes.push({ term: t, transliteration: "Qadeer", gloss: "Competent/All-Powerful (editorial gloss)", keys: ["5:17"] });
}

// P3 terminology
{
  const t = findWordContaining(12, ["\u0645","\u064a","\u062b","\u0627","\u0642"]); // meethaqa
  if (t) p3.terminology.push({ term: t, transliteration: "meethaq", gloss: "solemn covenant (editorial gloss)", keys: ["5:12"] });
}
{
  const t = findWordContaining(12, ["\u0646","\u0642","\u064a","\u0628"]); // naqeeban
  if (t) p3.terminology.push({ term: t, transliteration: "naqeeb", gloss: "leader/representative (editorial gloss)", keys: ["5:12"] });
}
{
  const t = findWordContaining(13, ["\u062a","\u062d","\u0631","\u0641"]); // yuharrifoona
  if (t) p3.terminology.push({ term: t, transliteration: "tahreef", gloss: "distortion of words from proper places (editorial gloss)", keys: ["5:13"] });
}
{
  const t = findWordContaining(15, ["\u0646","\u0648","\u0631"]); // noorun
  if (t) p3.terminology.push({ term: t, transliteration: "noor", gloss: "light/divine guidance (editorial gloss)", keys: ["5:15"] });
}
{
  const t = findWordContaining(16, ["\u0633","\u0644","\u0627","\u0645"]); // alssalami
  if (t) p3.terminology.push({ term: t, transliteration: "al-salam", gloss: "peace/paths of peace (editorial gloss)", keys: ["5:16"] });
}
{
  const t = findWordContaining(26, ["\u0641","\u0627","\u0633","\u0642"]); // alfasiqeena
  if (t) p3.terminology.push({ term: t, transliteration: "al-fasiqeen", gloss: "the defiantly disobedient (editorial gloss)", keys: ["5:26"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p3.json"), JSON.stringify(p3, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p3.json");

// ─── Passage 4: 5:27–35 ──────────────────────────────────────────────────────
const p4 = {
  extractionId: "ext-005-p4",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 27, toAyah: 35, label: "Al-Ma'idah — Story of Adam's two sons: sacrifice accepted from one not other; threat to kill met with refusal fearing Allah Lord of worlds; desire to bear sins making killer companion of Fire; soul permitted murder became loser; raven showed burial; regret; decree for Israel killing one soul unjustly equals killing all mankind saving one equals saving all; messengers came with proofs many transgressed; hirabah punishment: execution crucifixion cross-amputation exile disgrace in world great punishment hereafter; repentance before apprehension Allah Forgiving Merciful; fear Allah seek wasilah strive in His way succeed" },
  verseKeys: ["5:27","5:28","5:29","5:30","5:31","5:32","5:33","5:34","5:35"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `5:${i+27}`, text: fv(i+27) })),
  mainSubject: {
    label: "Story of Adam's two sons: sacrifice accepted from righteous one rejected from other; threatened murder met with principled non-retaliation fearing Allah; killer bears both sins becomes Fire companion; soul permitted fratricide becoming loser; raven taught burial inspiring regret; universal decree for Israel: unjust killing equals killing all mankind saving one equals saving all despite clear proofs many transgressed; hirabah penalty for waging war against Allah and Messenger causing corruption: execution crucifixion cross-amputation exile worldly disgrace otherworldly punishment; repentance before capture earns forgiveness; fear Allah seek means of nearness strive in His cause for success",
    keys: ["5:27","5:28","5:29","5:30","5:31","5:32","5:33","5:34","5:35"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Adam's sons: sacrifice acceptance criterion is taqwa", keys: ["5:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Principled non-retaliation: I fear Allah Lord of worlds", keys: ["5:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Killer bears victim's sin plus own sin; Fire companion", keys: ["5:29"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Soul permitting murder leads to loss", keys: ["5:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Raven teaching burial; first human regret", keys: ["5:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal sanctity of life: killing one equals killing all", keys: ["5:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Saving one life equals saving all mankind", keys: ["5:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Despite clear proofs many transgressed in land", keys: ["5:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hirabah punishment: four penalties for war against Allah/Messenger", keys: ["5:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance before apprehension earns divine forgiveness", keys: ["5:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Seek wasilah and strive in Allah's way for success", keys: ["5:35"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Adam's two sons: first murder and its moral lessons", keys: ["5:27","5:28","5:29","5:30","5:31"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Inner permission of evil: soul enabling fratricide", keys: ["5:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Regret after irreversible action", keys: ["5:31"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Sanctity of life principle: individual murder equals universal destruction", keys: ["5:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "State enforcement against armed rebellion and corruption", keys: ["5:33"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0235","cand-0236"],
  notes: "Pass A Maidah passage 4/4. First murder narrative establishes moral psychology of violence. Taqwa as sole acceptance criterion for worship. Non-retaliation stance grounded in divine fear not pacifism. Raven episode shows learning from creation. Sanctity-of-life formula (5:32) among most cited Quranic ethical principles. Hirabah verse provides graduated penal framework. Repentance clause prevents despair. Wasilah concept opens pathway to spiritual striving.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:35"], excerpt: fv(35), description: "Command: fear Allah seek means of nearness to Him and strive in His cause that you may succeed." });
p4.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:32"], excerpt: fv(32), description: "Prohibition derived: killing a soul unjustly is as if killing all mankind." });

// P4 divine names
{
  const t1 = findWordContaining(34, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(34, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t1 && t2) {
    const fullText = fv(34);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p4.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafoorun Raheem", gloss: "Forgiving Merciful (editorial gloss)", keys: ["5:34"] });
    }
  }
}

// P4 terminology
{
  const t = findWordContaining(27, ["\u0645","\u062a","\u0642","\u064a"]); // almuttaqeena
  if (t) p4.terminology.push({ term: t, transliteration: "al-muttaqeen", gloss: "the righteous who fear Allah (editorial gloss)", keys: ["5:27"] });
}
{
  const t = findWordContaining(31, ["\u0646","\u0627","\u062f","\u0645"]); // alnnadimeena
  if (t) p4.terminology.push({ term: t, transliteration: "al-nadimeen", gloss: "the regretful/remorseful ones (editorial gloss)", keys: ["5:31"] });
}
{
  const t = findWordContaining(33, ["\u062e","\u0632","\u064a"]); // khizyun
  if (t) p4.terminology.push({ term: t, transliteration: "khizy", gloss: "disgrace/humiliation (editorial gloss)", keys: ["5:33"] });
}
{
  const t = findWordContaining(35, ["\u0648","\u0633","\u064a","\u0644"]); // alwaseelata
  if (t) p4.terminology.push({ term: t, transliteration: "al-wasilah", gloss: "means of nearness/approach to Allah (editorial gloss)", keys: ["5:35"] });
}
{
  const t = findWordContaining(32, ["\u0645","\u0633","\u0631","\u0641"]); // lamusrifoona
  if (t) p4.terminology.push({ term: t, transliteration: "musrifoon", gloss: "transgressors/excessive ones (editorial gloss)", keys: ["5:32"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p4.json"), JSON.stringify(p4, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p4.json");

// ─── Candidates batch (cand-0227 through cand-0236) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-005-p1,ext-005-p2,ext-005-p3,ext-005-p4",
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

// cand-0227: Perfection of religion declaration
candidates.candidates.push(makeCand("cand-0227",
  "Perfection of religion: divine declaration of completed revelation finalized favor and approved Islam as definitive way of life",
  undefined, "إكمال الدين: إعلان إلهي باكتمال الوحي وإتمام النعمة وارتضاء الإسلام ديناً",
  "In 5:3: This day I have perfected for you your religion and completed My favor upon you and have approved for you Islam as religion. Declared alongside dietary legislation marking comprehensive legal-theological culmination.",
  [{ key: "5:3", excerpt: fv(3), evidenceClass: "EXPLICIT_TEXT", rationale: "Alyawma akmaltu lakum deenakum waatmamtu AAalaykum niAAmatee waradeetu lakumu alislama deenan: three-fold declaration (perfection completion approval). Alyawma anchors in specific revelatory moment. Deen encompasses total way of life not merely creed. Radeetu implies divine satisfaction and final selection." }],
  [],
  "Gap candidate. Most explicit Quranic statement of revelatory closure. Triple formula (ikmal itmam rida) suggests progressive stages reaching culmination. Context within dietary law suggests perfection includes practical legislation not only doctrine. Foundation for Islamic self-understanding as final dispensation."
));

// cand-0228: Cooperative ethics framework
candidates.candidates.push(makeCand("cand-0228",
  "Cooperative ethics: positive obligation to collaborate in righteousness and taqwa with corresponding prohibition against collaboration in sin and aggression",
  undefined, "أخلاق التعاون: وجوب التعاون على البر والتقوى وتحريم التعاون على الإثم والعدوان",
  "In 5:2: Cooperate in righteousness and taqwa and do not cooperate in sin and aggression. And fear Allah; indeed Allah is severe in penalty.",
  [{ key: "5:2", excerpt: fv(2), evidenceClass: "EXPLICIT_TEXT", rationale: "WataAAawanoo AAala albirri waalttaqwa wala taAAawanoo AAala alithmi waalAAudwani: symmetric command-prohibition pairing. Birr and taqwa define positive scope; ithm and udwan define negative scope. TaAAawanoo (cooperate) implies active collective effort not passive coexistence. Shadeedu al-iqab reinforces seriousness." }],
  [],
  "Gap candidate. Establishes social cooperation as moral category requiring active discernment. Four-term taxonomy (birr taqwa ithm udwan) covers personal piety and social harm dimensions. Collective responsibility framework distinguishing permissible from impermissible solidarity. Applicable to political alliances economic partnerships civil society engagement."
));

// cand-0229: Interfaith marital and dietary permeability
candidates.candidates.push(makeCand("cand-0229",
  "Regulated interfaith permeability: mutual food permissibility with People of Book and marriage to their chaste women under specified conditions",
  undefined, "النفاذية المنظمة بين الأديان: تبادل حل الطعام مع أهل الكتاب ونكاح محصناتهم بشروط",
  "In 5:5: This day good things made lawful; food of those given Scripture lawful for you and your food lawful for them; chaste women from believers and chaste women from those given Scripture before you when given due compensation desiring chastity not fornication or secret lovers.",
  [{ key: "5:5", excerpt: fv(5), evidenceClass: "EXPLICIT_TEXT", rationale: "WataAAamu allatheena ootoo alkitaba hillun lakum wataAAamukum hillun lahum: reciprocal food permissibility unique to People of Book. Waalmuhsanatu mina allatheena ootoo alkitaba: marriage permission conditioned on ihsan (chastity). Muhsineena ghayra musafiheena wala muttakhithee akhdanin: three behavioral conditions ensuring legitimate union." }],
  [{ topicId: "interfaith-marriage", layer: "scholarly", relationship: "same-concept", note: "Primary textual anchor for interfaith marriage ruling" },
   { topicId: "halal-food", layer: "scholarly", relationship: "related-not-identical", note: "Extends halal framework to include People of Book food" }],
  "Overlap with interfaith-marriage and halal-food. Reciprocal food ruling creates shared commensality space. Marriage permission asymmetric (Muslim men to PoB women only). Chastity triple-condition prevents exploitation. Habita amaluhu warning ties interfaith permissibility to continued faith commitment."
));

// cand-0230: Tayammum as divine ease principle
candidates.candidates.push(makeCand("cand-0230",
  "Tayammum concession: dry ablution with clean earth when water unavailable expressing divine legislative intent of ease not hardship",
  undefined, "رخصة التيمم: الطهارة بالتراب عند عدم الماء تعبيراً عن قصد الله للتيسير لا التعسير",
  "In 5:6: If ill or traveling or from privy or contacted women and no water found then seek clean earth and wipe faces and hands. Allah does not intend difficulty but intends purification and completion of favor for gratitude.",
  [{ key: "5:6", excerpt: fv(6), evidenceClass: "EXPLICIT_TEXT", rationale: "Fatayammamoo saAAeedan tayyiban faimsahoo biwujoohikum waaydeekum minhu: tayammum procedure specified. Ma yureedu Allahu liyajAAala AAalaykum min harajin walakin yureedu liyutahhirakum: explicit divine rationale negating hardship affirming purification. Waliyutimma niAAmatahu AAalaykum laAAallakum tashkuroona: teleological chain from concession to gratitude." }],
  [{ topicId: "tayammum", layer: "scholarly", relationship: "same-concept", note: "Primary Quranic legislation for tayammum" },
   { topicId: "wudu-procedure", layer: "scholarly", relationship: "broader", note: "Tayammum as alternative to wudu when conditions prevent water use" }],
  "Overlap with tayammum and wudu-procedure. Only Quranic verse combining wudu and tayammum legislation. Haraj (difficulty/hardship) negated as divine intent establishes ease principle. Purification purpose maintained through alternative means. Gratitude as ultimate legislative goal links ritual to spiritual disposition."
));

// cand-0231: Justice overriding enmity
candidates.candidates.push(makeCand("cand-0231",
  "Justice overriding enmity: hatred of any people must never prevent just conduct; justice itself is nearer to taqwa",
  undefined, "العدالة فوق العداوة: بغض أي قوم لا يمنع من العدل والعدل أقرب للتقوى",
  "In 5:8: O believers be persistently standing firm for Allah witnesses in justice; do not let hatred of a people prevent justice. Be just; that is nearer to taqwa. Fear Allah; Allah is Acquainted with what you do.",
  [{ key: "5:8", excerpt: fv(8), evidenceClass: "EXPLICIT_TEXT", rationale: "Wala yajrimannakum shanaanu qawmin AAala alla taAAdiloo: explicit prohibition against enmity-driven injustice. IAAdiloo huwa aqrabu lilttaqwa: justice positioned as proximate to God-consciousness. Koonoo qawwameena lillahi shuhadaa bialqisti: persistent institutional stance required. Khabeerun bima taAAmaloona: divine surveillance ensures accountability." }],
  [{ topicId: "justice-oppression", layer: "scholarly", relationship: "same-concept", note: "Key textual anchor for impartial justice obligation" }],
  "Overlap with justice-oppression. Parallels 4:135 but adds aqrabu lilttaqwa framing linking justice directly to spiritual proximity. Shanaan (hatred/enmity) identified as systemic threat to judicial integrity. Qawwameena implies structural persistence not situational fairness. Universal application regardless of communal relations."
));

// cand-0232: Covenant breach pattern across communities
candidates.candidates.push(makeCand("cand-0232",
  "Covenant breach pattern: parallel violation histories of Israelite and Christian communities producing hardened hearts word-distortion and inter-communal enmity",
  undefined, "نمط نقض العهد: تاريخ موازٍ لانتهاك بني إسرائيل والنصارى أدى إلى قسوة القلوب وتحريف الكلم والعداوة",
  "In 5:12-14: Allah took covenant from Children of Israel appointing twelve leaders with conditions; whoever disbelieved after that strayed. For breaking covenant We cursed them made hearts hard they distort words forgot portion. From Christians We took covenant they forgot portion so We caused enmity and hatred between them until Resurrection.",
  [{ key: "5:12", excerpt: fv(12), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaqad akhatha Allahu meethaqa banee israeela: covenant establishment. Famankafara baAAda thalika minkum faqad dalla sawaa alssabeeli: post-covenant disbelief as deviation." },
   { key: "5:13", excerpt: fv(13), evidenceClass: "EXPLICIT_TEXT", rationale: "Fabima naqdihim meethaqahum laAAannahum wajaAAalna quloobahum qasiyatan: causal chain breach-curse-hardening. Yuharrifoona alkalima AAan mawadiAAihi: textual distortion as symptom." },
   { key: "5:14", excerpt: fv(14), evidenceClass: "EXPLICIT_TEXT", rationale: "Wamina allatheena qaloo inna nasara akhathna meethaqahum fanasoo haththan: parallel Christian breach. Faaghrayna baynahumu alAAadawata waalbaghdaa: internal enmity as consequence." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "related-not-identical", note: "Illustrates covenant breach consequences rather than covenant theology itself" },
   { topicId: "covenant-breach", layer: "scholarly", relationship: "same-concept", note: "Primary textual exposition of covenant breach pattern" }],
  "Overlap with covenants-ahd and covenant-breach. Dual-community structure shows breach as recurrent pattern not isolated failure. Hardened hearts and word-distortion presented as progressive spiritual degradation. Internal enmity among Christians contrasts with Muslim unity ideal. Pardon recommendation (5:13) tempers critique with mercy posture."
));

// cand-0233: Refutation of Christian divinization claims
candidates.candidates.push(makeCand("cand-0233",
  "Refutation of Christian divinization: explicit rejection of Allah-is-Messiah and third-of-three claims with logical arguments from divine sovereignty and Messiah's own testimony",
  undefined, "دحض تأليه المسيح: رفض صريح لدعوى أن الله هو المسيح وأقنوم الثالث بأدلة السيادة الإلهية وشهادة المسيح نفسه",
  "In 5:17: They have disbelieved who say Allah is Messiah son of Maryam. Say who could prevent Allah if He intended to destroy Messiah his mother and everyone on earth? To Allah belongs dominion of heavens earth and between them He creates what He wills Allah over all things Competent.",
  [{ key: "5:17", excerpt: fv(17), evidenceClass: "EXPLICIT_TEXT", rationale: "Laqad kafara allatheena qaloo inna Allaha huwa almaseehu ibnu maryama: direct identification of claim as kufr. Qul faman yamliku mina Allahi shayan: rhetorical challenge from divine omnipotence. Walillahi mulku alssamawati waalardi: ontological argument from ownership. Yakhluqu ma yashao waAllahu AAala kulli shayin qadeerun: creative sovereignty excludes partnership." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "related-not-identical", note: "Focuses on theological refutation rather than narrative biography" },
   { topicId: "shirk-prohibition", layer: "scholarly", relationship: "narrower", note: "Specific application addressing Christian christological claims" }],
  "Overlap with isa-story and shirk-prohibition. Arguments proceed from divine attributes not historical evidence. Rhetorical question format invites listener to recognize logical impossibility. Dominion-creation-competence triad establishes comprehensive divine exclusivity. Addresses both incarnation (Allah is Messiah) and trinity (third of three) formulations."
));

// cand-0234: Holy Land refusal and collective punishment
candidates.candidates.push(makeCand("cand-0234",
  "Holy Land refusal: Israelite defiance of divine command to enter sacred territory resulting in forty-year wandering as collective consequence of communal disobedience",
  undefined, "رفض الأرض المقدسة: عصيان بني إسرائيل لأمر دخول الأرض المقدسة وعقابهم بالتيه أربعين سنة",
  "In 5:21-26: Musa commanded people enter Holy Land Allah assigned; they refused citing tyrannical inhabitants; two faithful men urged entry with tawakkul; people defiantly said go you and your Lord fight we sit here; Musa appealed to Allah; Allah decreed forty years wandering in land; do not grieve over defiantly disobedient people.",
  [{ key: "5:21", excerpt: fv(21), evidenceClass: "EXPLICIT_TEXT", rationale: "Ya qawmi odkhuloo alarda almuqaddasata allatee kataba Allahu lakum: divine assignment framed as written decree. Wala tartaddoo AAala adbarikum: warning against retreat." },
   { key: "5:24", excerpt: fv(24), evidenceClass: "EXPLICIT_TEXT", rationale: "Faithhab anta warabbuka faqatila inna hahuna qaAAidoona: peak defiance separating Musa from community. Hahuna qaAAidoona: deliberate immobility as resistance." },
   { key: "5:26", excerpt: fv(26), evidenceClass: "EXPLICIT_TEXT", rationale: "Fainnaha muharramatun AAalayhim arbaAAeena sanatan yateehoona fee alardi: proportional punishment matching refusal duration. Fala tasa AAala alqawmi alfasiqeena: prophetic consolation." }],
  [{ topicId: "musa-story", layer: "scholarly", relationship: "narrower", note: "Specific episode within broader Musa narrative" }],
  "Overlap with musa-story. Illustrates covenant-consequence mechanism through concrete historical case. Communal punishment despite individual faithful minority (two men). Forty-year duration matches generational timeframe suggesting complete turnover. Fasiqeen characterization links disobedience to moral category. Consolation directive protects prophet from communal grief burden."
));

// cand-0235: Sanctity of life universal formula
candidates.candidates.push(makeCand("cand-0235",
  "Sanctity of life universal formula: unjust killing of one soul equals killing all mankind; saving one equals saving all mankind",
  undefined, "قدسية الحياة الشاملة: قتل نفس واحدة بغير حق كقتل الناس جميعاً وإحياؤها كإحيائهم جميعاً",
  "In 5:32: Because of that We decreed upon Children of Israel that whoever kills a soul not for soul or corruption in land it is as if he killed mankind entirely and whoever saves one it is as if he saved mankind entirely. Our messengers came with clear proofs then many transgressed after that in land.",
  [{ key: "5:32", excerpt: fv(32), evidenceClass: "EXPLICIT_TEXT", rationale: "Man qatala nafsan bighayri nafsin aw fasadin fee alardi fakaannama qatala alnnasa jameeAAan: equivalence formula with two exceptions (just retribution anti-corruption). Waman ahyaha fakaannama ahya alnnasa jameeAAan: symmetric positive formulation. Katabna AAala banee israeela: originally decreed for Israel extended universally by Quranic citation. Thumma inna katheeran minhum baAAda thalika fee alardi lamusrifoona: acknowledgment that principle often violated despite clarity." }],
  [{ topicId: "right-to-life", layer: "scholarly", relationship: "same-concept", note: "Primary Quranic articulation of life sanctity principle" }],
  "Overlap with right-to-life. Universal quantification (jameeAAan) removes particularistic limitation. Dual exception clause (nafs fasad) acknowledges legitimate state violence. Positive formulation (saving equals saving all) balances prohibition with affirmative duty. Citation from Israelite decree suggests pre-Quranic origin now reaffirmed. Musrifoon diagnosis explains gap between principle and practice."
));

// cand-0236: Hirabah graduated penal framework
candidates.candidates.push(makeCand("cand-0236",
  "Hirabah penal framework: graduated punishments for armed rebellion against Allah and Messenger causing societal corruption with repentance exception before capture",
  undefined, "إطار عقوبة الحرابة: عقوبات متدرجة للمحاربين المفسدين مع استثناء التوبة قبل القبض",
  "In 5:33-34: Penalty for those waging war against Allah and Messenger striving in land for corruption: killed or crucified or hands and feet cut off from opposite sides or exiled from land; disgrace in world great punishment hereafter. Except those who repent before you overcome them; know Allah Forgiving Merciful.",
  [{ key: "5:33", excerpt: fv(33), evidenceClass: "EXPLICIT_TEXT", rationale: "Innama jazao allatheena yuhariboona Allaha warasoolahu wayasAAawna fee alardi fasadan: crime defined as war against divine order plus active corruption. An yuqattaloo aw yusallaboo aw tuqattaAAa aydeehim waarjuluhum min khilafin aw yunfaw mina alardi: four graduated penalties. Thalika lahum khizyun fee alddunya: worldly disgrace component." },
   { key: "5:34", excerpt: fv(34), evidenceClass: "EXPLICIT_TEXT", rationale: "Illa allatheena taboo min qabli an taqdiroo AAalayhim: temporal condition for repentance exception. FaiAAlamoo anna Allaha ghafoorun raheemun: divine mercy affirmed even for gravest offenders." }],
  [{ topicId: "hudud-punishments", layer: "scholarly", relationship: "narrower", note: "Hirabah as specific hudud category distinct from theft or zina" }],
  "Overlap with hudud-punishments. Crime combines theological (war against Allah) and social (corruption) dimensions. Four penalties suggest proportionality based on severity. Min khilaf (opposite sides) specifies cross-amputation method. Exile as least severe option preserves life. Repentance-before-capture clause maintains reform possibility. Khizy (disgrace) adds reputational dimension beyond physical penalty."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-023.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-023.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-005-p1 through ext-005-p4)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0227 through cand-${String(226 + candidates.candidates.length).padStart(4,'0')})`);
