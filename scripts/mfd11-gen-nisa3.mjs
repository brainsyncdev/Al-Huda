// MFD-11 Nisa Pass 3 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah An-Nisa 4:76-115 (Passages 9-12, Candidates cand-0197..cand-0206).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "004-0076-0115.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 4:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Nisa Pass 3 files from verbatim corpus (4:76-115)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T06:45:00.000Z";

// Safe term extractor: finds searchStr in text, returns exact match or null
function findTerm(text, searchStr) {
  const idx = text.indexOf(searchStr);
  if (idx < 0) return null;
  return text.slice(idx, idx + searchStr.length);
}

// ─── Passage 9: 4:76–87 ────────────────────────────────────────────────────────
const p9 = {
  extractionId: "ext-004-p9",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 76, toAyah: 87, label: "An-Nisa — Believers fight in Allah's way; disbelievers fight in taghut's way; fight allies of shaytan whose plot is weak; those told restrain hands establish prayer give zakah then fear people when fighting prescribed; worldly enjoyment little; death overtakes even in fortified towers; good from Allah evil from yourself; sent as messenger; obeying Messenger equals obeying Allah; hypocrites say obedience but plot differently at night; Allah records; trust Allah sufficient Disposer; reflect on Quran no contradiction; spread news of security or fear instead of referring to Messenger and authorities; but for Allah's favor would follow shaytan except few; fight responsible only for yourself encourage believers; intercession good or evil share thereof; greeting response; Allah Accountant; Tawheed declaration; assembly on Day of Resurrection; who more truthful than Allah" },
  verseKeys: ["4:76","4:77","4:78","4:79","4:80","4:81","4:82","4:83","4:84","4:85","4:86","4:87"],
  arabicExcerpts: Array.from({length:12}, (_,i) => ({ key: `4:${i+76}`, text: fv(i+76) })),
  mainSubject: {
    label: "Contrast between believers fighting in Allah's way and disbelievers fighting in taghut's way; command to fight allies of shaytan whose plot is ever weak; psychology of those previously told to restrain hands establish prayer give zakah who now fear people as much as or more than fearing Allah when fighting prescribed; response that worldly enjoyment is little and hereafter better for god-fearing with no injustice even as a thread; inevitability of death overtaking everywhere even in fortified towers; attribution error corrected: good from Allah evil from self; Prophet sent to mankind as messenger with Allah sufficient Witness; obeying Messenger equals obeying Allah; turning away means Prophet not sent as guardian; hypocrites verbally pledge obedience but secretly plot otherwise at night; Allah records their nocturnal plotting; directive to turn away from them and trust Allah as sufficient Disposer; rhetorical challenge to reflect upon Quran finding no contradiction proving divine origin; spreading rumors of security or fear instead of referring to Messenger and authorities; but for Allah's favor and mercy most would follow shaytan except few; personal responsibility in fighting only responsible for oneself while encouraging believers; intercession principle good earns share evil earns burden Allah Keeper over all; greeting etiquette respond with better or equal; Allah ever Accountant; tawheed declaration; certain assembly on Day of Resurrection; none more truthful than Allah",
    keys: ["4:76","4:77","4:78","4:79","4:80","4:81","4:82","4:83","4:84","4:85","4:86","4:87"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Believers fight in Allah's way; disbelievers in taghut's way", keys: ["4:76"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command to fight allies of shaytan; his plot is weak", keys: ["4:76"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those told restrain hands establish prayer give zakah now fear people when fighting prescribed", keys: ["4:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly enjoyment little; hereafter better for god-fearing", keys: ["4:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Death overtakes wherever you are even in fortified towers", keys: ["4:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Good from Allah evil from yourself", keys: ["4:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Obeying Messenger equals obeying Allah", keys: ["4:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocrites say obedience but plot differently at night; Allah records", keys: ["4:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Turn away from them; trust Allah sufficient Disposer", keys: ["4:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reflect on Quran: no contradiction if from other than Allah", keys: ["4:82"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spreading news without referral to Messenger and authorities", keys: ["4:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "But for Allah's favor would follow shaytan except few", keys: ["4:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fight responsible only for yourself; encourage believers", keys: ["4:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Good intercession earns share; evil earns burden; Allah Keeper", keys: ["4:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Greeting response better or equal; Allah Accountant", keys: ["4:86"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawheed; assembly on Day of Resurrection; none more truthful than Allah", keys: ["4:87"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Fear of people exceeding fear of Allah when fighting prescribed", keys: ["4:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Attribution bias: crediting good to Allah blaming evil on Prophet", keys: ["4:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Secret nocturnal plotting contradicting public obedience", keys: ["4:81"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Information discipline: referral to authorities before spreading news", keys: ["4:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Intercession economy: shares and burdens based on moral quality", keys: ["4:85"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Obedience to Messenger equivalent to obedience to Allah", keys: ["4:80"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0197","cand-0198","cand-0199"],
  notes: "Pass A Nisa passage 9/12. Opens with binary contrast of fighting motivations. Addresses psychological resistance to qital. Establishes theological causality: good from Allah evil from self (4:79). Defines obedience equation (4:80). Exposes hypocrite behavioral pattern. Introduces Quranic coherence argument (4:82). Information security protocol (4:83). Intercession principle (4:85). Closes with tawheed and eschatological certainty.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p9.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:76"], excerpt: fv(76), description: "Command: fight against the allies of Satan; indeed the plot of Satan has ever been weak." });
p9.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:81"], excerpt: fv(81), description: "Command: turn away from them and rely upon Allah; sufficient is Allah as Disposer of affairs." });
p9.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:84"], excerpt: fv(84), description: "Command: fight in the cause of Allah; you are not held responsible except for yourself; encourage the believers." });
p9.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:86"], excerpt: fv(86), description: "Command: when greeted greet in return with better or equal." });

{
  const t = findTerm(fv(79), "شَهِيدٗا");
  if (t) p9.divineNamesAndAttributes.push({ term: t, transliteration: "Shaheedan", gloss: "Witness (editorial gloss)", keys: ["4:79"] });
}
{
  const t = findTerm(fv(81), "وَكِيلًا");
  if (t) p9.divineNamesAndAttributes.push({ term: t, transliteration: "Wakeelan", gloss: "Disposer of affairs (editorial gloss)", keys: ["4:81"] });
}
{
  const t = findTerm(fv(85), "مُقِيتٗا");
  if (t) p9.divineNamesAndAttributes.push({ term: t, transliteration: "Muqeetan", gloss: "Keeper over all things (editorial gloss)", keys: ["4:85"] });
}
{
  const t = findTerm(fv(86), "حَسِيبًا");
  if (t) p9.divineNamesAndAttributes.push({ term: t, transliteration: "Haseeban", gloss: "Accountant (editorial gloss)", keys: ["4:86"] });
}

{
  const t = findTerm(fv(76), "ٱلطَّـٰغُوتِ");
  if (t) p9.terminology.push({ term: t, transliteration: "al-taghoote", gloss: "false objects of worship/tyrannical authority (editorial gloss)", keys: ["4:76"] });
}
{
  const t = findTerm(fv(82), "يَتَدَبَّرُونَ");
  if (t) p9.terminology.push({ term: t, transliteration: "yatadabbaroona", gloss: "reflect upon/contemplate deeply (editorial gloss)", keys: ["4:82"] });
}
{
  const t = findTerm(fv(85), "شَفَٰعَةً");
  if (t) p9.terminology.push({ term: t, transliteration: "shafa'atan", gloss: "intercession (editorial gloss)", keys: ["4:85"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p9.json"), JSON.stringify(p9, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p9.json");

// ─── Passage 10: 4:88–97 ───────────────────────────────────────────────────────
const p10 = {
  extractionId: "ext-004-p10",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 88, toAyah: 97, label: "An-Nisa — Two groups concerning hypocrites; Allah made them fall back for earnings; cannot guide whom Allah sent astray; they wish you disbelieve equally; no alliance until emigration; if turn away seize and kill; exception treaty people or hearts strained; if withdraw offer peace no cause; others seek security both sides fall into fitnah; clear authorization to fight non-withdrawing; accidental killing believer: free slave + blood money; intentional killing: Hell eternal anger curse; verify when going forth; do not reject peace greeting for worldly gain; sitting believers unequal to mujahideen except disabled; mujahideen preferred by degree; both promised best; degrees forgiveness mercy; angels question wrongdoers at death; excuse of oppression rejected earth spacious; refuge Hell" },
  verseKeys: ["4:88","4:89","4:90","4:91","4:92","4:93","4:94","4:95","4:96","4:97"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `4:${i+88}`, text: fv(i+88) })),
  mainSubject: {
    label: "Division among believers regarding hypocrites into two factions while Allah caused them to fall back due to earnings; cannot guide whom Allah sent astray; hypocrites wish believers to disbelieve equally; prohibition against alliance until emigration in Allah's way; if turn away seize and kill wherever found; exception for treaty people or those with hearts strained at fighting; if withdraw and offer peace no authorization against them; second group seeking security from both sides repeatedly falling into fitnah; clear authorization to fight those not withdrawing; accidental killing of believer requires freeing believing slave and blood money unless forgiven; intentional killing results in eternal Hell divine anger curse great punishment; verification command when going forth in Allah's way; prohibition against rejecting peace greeting for worldly spoils; inequality between sitting believers and mujahideen except disabled; mujahideen preferred by degree with great reward; degrees forgiveness mercy from Allah; angels questioning those wronging selves at death about condition; excuse of oppression rejected since Allah's earth spacious for emigration; refuge Hell evil destination",
    keys: ["4:88","4:89","4:90","4:91","4:92","4:93","4:94","4:95","4:96","4:97"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Two factions regarding hypocrites; Allah caused fall back", keys: ["4:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cannot guide whom Allah sent astray", keys: ["4:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No alliance with hypocrites until emigration", keys: ["4:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "If turn away seize and kill wherever found", keys: ["4:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exception: treaty people or hearts strained at fighting", keys: ["4:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Second group fall into fitnah repeatedly", keys: ["4:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Accidental killing: free slave + blood money", keys: ["4:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Intentional killing of believer: Hell eternal anger curse", keys: ["4:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Verify when going forth; do not reject peace greeting for spoils", keys: ["4:94"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mujahideen preferred over sitting believers by degree", keys: ["4:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Degrees forgiveness mercy from Allah", keys: ["4:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Angels question wrongdoers; oppression excuse rejected", keys: ["4:97"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Internal division over treating hypocrites", keys: ["4:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repeated relapse into fitnah", keys: ["4:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-deception through false oppression claim", keys: ["4:97"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Blood money system with graduated obligations", keys: ["4:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Military meritocracy: mujahideen preferred", keys: ["4:95"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Treaty obligations modifying rules of engagement", keys: ["4:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Emigration prerequisite for alliance", keys: ["4:89"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0200","cand-0201","cand-0202"],
  notes: "Pass A Nisa passage 10/12. Complex legal-military section. Three categories of non-combatants. Homicide legislation distinguishes three scenarios. Intentional murder receives strongest condemnation. Verification command (tabayyanoo) establishes evidentiary standard. Mujahideen preference hierarchy. Emigration obligation closes with eschatological consequence.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p10.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:89"], excerpt: fv(89), description: "Prohibition: do not take allies from hypocrites until they emigrate in Allah's way." });
p10.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:89"], excerpt: fv(89), description: "Command: if they turn away seize and kill wherever found; take no ally or helper from them." });
p10.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:94"], excerpt: fv(94), description: "Command: when going forth in Allah's way investigate carefully; do not reject peace greeting seeking worldly goods." });

{
  const t = findTerm(fv(92), "عَلِيمًا حَكِيمًا");
  if (t) p10.divineNamesAndAttributes.push({ term: t, transliteration: "Aleeman Hakeema", gloss: "Knowing Wise (editorial gloss)", keys: ["4:92"] });
}
{
  const t = findTerm(fv(96), "غَفُورًا رَّحِيمًا");
  if (t) p10.divineNamesAndAttributes.push({ term: t, transliteration: "Ghafooran Raheema", gloss: "Forgiving Merciful (editorial gloss)", keys: ["4:96"] });
}

{
  const t = findTerm(fv(88), "ٱلۡمُنَٰفِقِينَ");
  if (t) p10.terminology.push({ term: t, transliteration: "al-munafiqeen", gloss: "the hypocrites (editorial gloss)", keys: ["4:88"] });
}
{
  const t = findTerm(fv(92), "دِيَةٞ");
  if (t) p10.terminology.push({ term: t, transliteration: "diyatan", gloss: "blood money/compensation (editorial gloss)", keys: ["4:92"] });
}
{
  const t = findTerm(fv(95), "ٱلۡمُجَٰهِدُونَ");
  if (t) p10.terminology.push({ term: t, transliteration: "al-mujahidoona", gloss: "those who strive/fight (editorial gloss)", keys: ["4:95"] });
}
{
  const t = findTerm(fv(97), "مُسۡتَضۡعَفِينَ");
  if (t) p10.terminology.push({ term: t, transliteration: "mustad'afeena", gloss: "oppressed/weakened ones (editorial gloss)", keys: ["4:97"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p10.json"), JSON.stringify(p10, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p10.json");

// ─── Passage 11: 4:98–106 ──────────────────────────────────────────────────────
const p11 = {
  extractionId: "ext-004-p11",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 98, toAyah: 106, label: "An-Nisa — Musta'dafun exception men women children unable to plan or find way; perhaps Allah pardons; Allah Pardoning Forgiving; emigrant finds refuge and abundance; death during emigration reward incumbent on Allah; shortening prayer when traveling fearing disbelievers; fear-prayer protocol rotating parties with arms; concession rain illness; remember Allah after prayer standing sitting lying; when secure establish prayer; prayer timed decree; do not weaken pursuing enemy; mutual suffering differentiated hope; Book revealed to judge by what Allah showed; do not advocate for treacherous; seek forgiveness; Allah Forgiving Merciful" },
  verseKeys: ["4:98","4:99","4:100","4:101","4:102","4:103","4:104","4:105","4:106"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `4:${i+98}`, text: fv(i+98) })),
  mainSubject: {
    label: "Exception for genuinely oppressed musta'dafun among men women children unable to devise plan or find way; hope of Allah's pardon; Allah Pardoning Forgiving; emigrant in Allah's way finds refuge and abundance on earth; death during emigration to Allah and Messenger makes reward incumbent upon Allah; concession for shortening prayer when traveling fearing disbelievers; detailed fear-prayer protocol with rotating armed parties; concession to lay down arms in rain or illness while maintaining precaution; remember Allah after prayer in all positions; when secure re-establish regular prayer; prayer is timed decree upon believers; exhortation not to weaken pursuing enemy; mutual suffering acknowledged but believers hope uniquely from Allah; Book revealed in truth to judge by what Allah showed; prohibition against advocating for treacherous; seek forgiveness; Allah Forgiving Merciful",
    keys: ["4:98","4:99","4:100","4:101","4:102","4:103","4:104","4:105","4:106"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Musta'dafun exception: unable to plan or find way", keys: ["4:98"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hope of pardon for genuinely incapable", keys: ["4:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Emigrant finds refuge and abundance", keys: ["4:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Death during emigration: reward incumbent on Allah", keys: ["4:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shortening prayer when traveling fearing disbelievers", keys: ["4:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear-prayer protocol rotating parties with arms", keys: ["4:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remember Allah after prayer in all positions", keys: ["4:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prayer as timed decree upon believers", keys: ["4:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not weaken pursuing enemy; differentiated hope", keys: ["4:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Book revealed to judge by what Allah showed", keys: ["4:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Seek forgiveness; Allah Forgiving Merciful", keys: ["4:106"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Genuine incapacity distinguishing excused from culpable", keys: ["4:98"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual pain but differentiated hope", keys: ["4:104"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Fear-prayer preserving worship under threat", keys: ["4:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prayer as fixed temporal obligation", keys: ["4:103"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Emigration directed toward Allah and Messenger jointly", keys: ["4:100"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0203","cand-0204"],
  notes: "Pass A Nisa passage 11/12. Transitions from punitive to merciful exceptions. Musta'dafun category provides humanitarian exemption based on genuine incapacity. Emigration theology expanded with earthly refuge promise and death-in-transit guarantee. Fear-prayer protocol shows institutional adaptation. Prayer as timed decree establishes fixed temporal structure.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:103"], excerpt: fv(103), description: "Command: when secure re-establish regular prayer; prayer is a timed decree upon believers." });
p11.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:104"], excerpt: fv(104), description: "Prohibition: do not weaken in pursuit of the enemy." });
p11.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:105"], excerpt: fv(105), description: "Prohibition: do not be an advocate for the treacherous." });
p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:106"], excerpt: fv(106), description: "Command: seek forgiveness from Allah; He is Forgiving Merciful." });

{
  const t = findTerm(fv(99), "عَفُوًّا غَفُورًا");
  if (t) p11.divineNamesAndAttributes.push({ term: t, transliteration: "Afuwwan Ghafoora", gloss: "Pardoning Forgiving (editorial gloss)", keys: ["4:99"] });
}
{
  const t = findTerm(fv(100), "غَفُورًا رَّحِيمًا");
  if (t) p11.divineNamesAndAttributes.push({ term: t, transliteration: "Ghafooran Raheema", gloss: "Forgiving Merciful (editorial gloss)", keys: ["4:100"] });
}
{
  const t = findTerm(fv(104), "عَلِيمًا حَكِيمًا");
  if (t) p11.divineNamesAndAttributes.push({ term: t, transliteration: "Aleeman Hakeema", gloss: "Knowing Wise (editorial gloss)", keys: ["4:104"] });
}
{
  const t = findTerm(fv(106), "غَفُورًا رَّحِيمًا");
  if (t) p11.divineNamesAndAttributes.push({ term: t, transliteration: "Ghafooran Raheema", gloss: "Forgiving Merciful (editorial gloss)", keys: ["4:106"] });
}

{
  const t = findTerm(fv(98), "ٱلۡمُسۡتَضۡعَفِينَ");
  if (t) p11.terminology.push({ term: t, transliteration: "al-mustad'afeena", gloss: "the oppressed/weakened ones (editorial gloss)", keys: ["4:98"] });
}
{
  const t = findTerm(fv(101), "تَقۡصُرُواْ");
  if (t) p11.terminology.push({ term: t, transliteration: "taqsuroo", gloss: "shorten (prayer) (editorial gloss)", keys: ["4:101"] });
}
{
  const t = findTerm(fv(103), "كِتَٰبًا مَّوۡقُوتًا");
  if (t) p11.terminology.push({ term: t, transliteration: "kitaban mawqootan", gloss: "timed decree/fixed ordinance (editorial gloss)", keys: ["4:103"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p11.json"), JSON.stringify(p11, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p11.json");

// ─── Passage 12: 4:107–115 ─────────────────────────────────────────────────────
const p12 = {
  extractionId: "ext-004-p12",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 107, toAyah: 115, label: "An-Nisa 4:107–115 — Do not argue for self-deceivers; hiding from people not Allah; bearing others' sins; divine favor through Book and wisdom; limiting private talk to charity, kindness, reconciliation; consequence of opposing the Messenger after guidance; shirk unforgivable while lesser sins may be forgiven" },
  verseKeys: ["4:107","4:108","4:109","4:110","4:111","4:112","4:113","4:114","4:115"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `4:${i+107}`, text: fv(i+107) })),
  mainSubject: {
    label: "Do not argue for self-deceivers; hiding from people not Allah; bearing others' sins; divine favor through Book and wisdom; limiting private talk to charity, kindness, reconciliation; consequence of opposing the Messenger after guidance; shirk unforgivable while lesser sins may be forgiven",
    keys: ["4:107","4:108","4:109","4:110","4:111","4:112","4:113","4:114","4:115"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Do not argue for self-deceivers; Allah loves not sinful deceiver", keys: ["4:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hide from people not Allah; He with them plotting at night", keys: ["4:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Who argues with Allah for them on Resurrection Day", keys: ["4:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Does evil wrongs self; seeks forgiveness finds Allah Forgiving Merciful", keys: ["4:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sin earned only against self; Allah Knowing Wise", keys: ["4:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Throwing sin on innocent: slander and manifest sin", keys: ["4:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "But for Allah's favor party would mislead Prophet", keys: ["4:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Book and wisdom sent; taught what unknown; great favor", keys: ["4:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No good in private talk except charity kindness reconciliation", keys: ["4:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Opposing Messenger after guidance clear: Hell wretched destination", keys: ["4:115"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Self-deception combined with hiding from people not Allah", keys: ["4:107","4:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False accusation as compound sin: slander plus manifest sin", keys: ["4:112"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Private conversation ethics: only charity kindness reconciliation have value", keys: ["4:114"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0205","cand-0206"],
  notes: "Pass A Nisa passage 12/12. Concludes major legislative-theological block. Prohibition against defending self-deceivers opens section. Rhetorical challenge about Resurrection Day advocacy. Personal accountability for sin established. False accusation identified as compound crime. Divine protection of Prophet from conspiracies. Private conversation ethic elevates social reform above idle talk. Opposition to Messenger after guidance linked to Hellfire. Note: shirk-unforgivable formula appears again in 4:116 beyond this passage range.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p12.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:107"], excerpt: fv(107), description: "Prohibition: do not argue on behalf of those who deceive themselves." });
p12.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:110"], excerpt: fv(110), description: "Command: whoever does wrong and seeks forgiveness of Allah will find Allah Forgiving Merciful." });
p12.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:115"], excerpt: fv(115), description: "Prohibition: do not oppose the Messenger after guidance is clear or follow other than the believers' path." });

{
  const t = findTerm(fv(110), "غَفُورًا رَّحِيمًا");
  if (t) p12.divineNamesAndAttributes.push({ term: t, transliteration: "Ghafooran Raheema", gloss: "Forgiving Merciful (editorial gloss)", keys: ["4:110"] });
}
{
  const t = findTerm(fv(111), "عَلِيمًا حَكِيمًا");
  if (t) p12.divineNamesAndAttributes.push({ term: t, transliteration: "Aleeman Hakeema", gloss: "Knowing Wise (editorial gloss)", keys: ["4:111"] });
}

{
  const t = findTerm(fv(107), "خَوَّانًا أَثِيمًا");
  if (t) p12.terminology.push({ term: t, transliteration: "khawwanan atheema", gloss: "habitually sinful deceiver (editorial gloss)", keys: ["4:107"] });
}
{
  const t = findTerm(fv(112), "بُهۡتَٰنًا");
  if (t) p12.terminology.push({ term: t, transliteration: "buhtanan", gloss: "slander/false accusation (editorial gloss)", keys: ["4:112"] });
}
{
  const t = findTerm(fv(114), "نَّجۡوَىٰهُمۡ");
  if (t) p12.terminology.push({ term: t, transliteration: "najwahum", gloss: "private conversation/counsel (editorial gloss)", keys: ["4:114"] });
}
{
  const t = findTerm(fv(115), "يُشَاقِقِ");
  if (t) p12.terminology.push({ term: t, transliteration: "yushaqiqi", gloss: "opposes/acts in breach (editorial gloss)", keys: ["4:115"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p12.json"), JSON.stringify(p12, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p12.json");

// ─── Candidates batch (cand-0197 through cand-0206) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-004-p9,ext-004-p10,ext-004-p11,ext-004-p12",
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

// cand-0197: Theological causality framework
candidates.candidates.push(makeCand("cand-0197",
  "Theological causality: good comes from Allah while evil comes from oneself establishing asymmetric divine-human attribution",
  undefined, "السببية العقدية: الخير من الله والشر من النفس",
  "In 4:78-79: Wherever you are death overtakes you even in fortified towers. If good comes they say this is from Allah; if evil they say this is from you. Say all is from Allah. What comes of good is from Allah; what comes of evil is from yourself.",
  [{ key: "4:78", excerpt: fv(78), evidenceClass: "EXPLICIT_TEXT", rationale: "Qul kullun min AAindi Allahi: universal attribution correcting selective attribution bias. Corrects those who credit good to Allah but blame evil on Prophet." },
   { key: "4:79", excerpt: fv(79), evidenceClass: "EXPLICIT_TEXT", rationale: "Ma asabaka min hasanatin famina Allahi wama asabaka min sayyiatin famin nafsika: refined asymmetric formula. Good traced to divine source; evil traced to human agency." }],
  [],
  "Gap candidate. Establishes nuanced theological causality avoiding both absolute determinism and absolute human autonomy. Asymmetry prevents blaming Allah for evil while preserving divine sovereignty over good. Verse 4:78 corrects popular misconception; 4:79 provides precise formulation."
));

// cand-0198: Quranic coherence as proof of divine origin
candidates.candidates.push(makeCand("cand-0198",
  "Quranic coherence argument: absence of internal contradiction offered as evidence of divine authorship",
  undefined, "تماسك القرآن: عدم التناقض دليل على المنشأ الإلهي",
  "In 4:82: Then do they not reflect upon the Quran? If it had been from other than Allah they would have found within it much contradiction.",
  [{ key: "4:82", excerpt: fv(82), evidenceClass: "EXPLICIT_TEXT", rationale: "Afala yatadabbaroona alqurana: rhetorical invitation to deep reflection. Walaw kana min AAindi ghayri Allahi lawajadoo feehi ikhtilafan katheeran: counterfactual argument from textual coherence. Ikhtilafan katheeran (much contradiction) implies human texts inevitably contain inconsistencies." }],
  [],
  "Gap candidate. Unique epistemological argument for Quranic divine origin based on internal consistency rather than external miracle claims. Yatadabbaroona (deep reflection) frames as accessible intellectual exercise. Counterfactual structure makes falsifiable claim."
));

// cand-0199: Intercession moral economy
candidates.candidates.push(makeCand("cand-0199",
  "Intercession moral economy: mediating good earns reward share while mediating evil incurs burden share with Allah as Keeper",
  undefined, "اقتصاد الشفاعة: الوساطة الحسنة تكسب نصيبا والسيئة تكسب كفلا",
  "In 4:85: Whoever intercedes for a good cause will have a share of it; whoever intercedes for an evil cause will have a burden of it. And ever is Allah over all things a Keeper.",
  [{ key: "4:85", excerpt: fv(85), evidenceClass: "EXPLICIT_TEXT", rationale: "Man yashfaAA shafaAAatan hasanatan yakun lahu naseebun minha: positive intercession earns proportional share. Waman yashfaAA shafaAAatan sayyiatan yakun lahu kiflun minha: negative intercession earns proportional burden. Kana Allahu AAala kulli shayin muqeetan: divine oversight guarantees accounting." }],
  [],
  "Gap candidate. Establishes moral accountability for social influence and mediation. Symmetric structure: same mechanism produces reward or burden based on moral quality. Muqeet (Keeper) ensures no intercession escapes divine accounting. Applies broadly beyond formal intercession to all social influence."
));

// cand-0200: Accidental homicide legislation
candidates.candidates.push(makeCand("cand-0200",
  "Accidental homicide of believer: graduated expiation requiring manumission blood money or fasting based on political relations",
  undefined, "قتل الخطأ: تدرج الكفارة حسب العلاقات السياسية",
  "In 4:92: Never for believer to kill believer except by mistake. Whoever kills believer by mistake must free believing slave and pay blood money to family unless forgiven. If from hostile believing people free slave only. If from treaty people blood money plus free slave. If unable fast two consecutive months as repentance from Allah.",
  [{ key: "4:92", excerpt: fv(92), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama kana limuminin an yaqtula muminan illa khataan: categorical prohibition with sole exception. Fatahreeru raqabatin muminatin wadiyatun musallamatun: dual obligation. Three scenarios distinguished by victim's political affiliation. Fasiyamu shahrayni mutatabiAAayni tawbatan mina Allahi: fasting as alternative framed as repentance." }],
  [],
  "Gap candidate. Most detailed Quranic homicide legislation. Three-tier system based on victim's community status. Manumission prioritized suggesting abolitionist trajectory. Blood money (diyah) acknowledges collective responsibility. Two-month consecutive fasting as spiritual rehabilitation. Tawbatan mina Allahi frames expiation as divine acceptance pathway."
));

// cand-0201: Verification command in wartime
candidates.candidates.push(makeCand("cand-0201",
  "Verification command (tabayyanoo): mandatory investigation before acting in warfare preventing wrongful targeting of those offering peace",
  undefined, "التبين: وجوب التحقق قبل العمل في الحرب",
  "In 4:94: O believers when you go forth in Allah's way investigate carefully and do not say to one who offers peace 'you are not a believer' aspiring for worldly goods. With Allah are many acquisitions. You were like that before then Allah favored you so investigate.",
  [{ key: "4:94", excerpt: fv(94), evidenceClass: "EXPLICIT_TEXT", rationale: "Fatabayyanoo: imperative doubled for emphasis. Wala taqooloo liman alqa ilaykumu alssalama lasta muminan: specific prohibition against declaring non-belief based on convenience. Tabtaghoona AAarada alhayati alddunya: identifies material motive for wrongful targeting. Kathalika kuntum min qablu: historical empathy argument." }],
  [],
  "Gap candidate. Establishes evidentiary standard for wartime decisions. Doubled tabayyanoo emphasizes thoroughness. Prohibition targets economic exploitation disguised as religious zeal. Historical reminder creates empathetic basis for restraint. Maghanimu katheeratun redirects aspiration toward legitimate divine provision."
));

// cand-0202: Mujahideen preference hierarchy
candidates.candidates.push(makeCand("cand-0202",
  "Mujahideen preference: active striving with wealth and selves ranked above sitting believers by degrees though both promised good",
  undefined, "تفضيل المجاهدين: الجهاد بالمال والنفس أعلى درجة",
  "In 4:95-96: Not equal are sitting believers other than disabled and mujahideen in Allah's way with wealth and selves. Allah preferred mujahideen by degree. Both promised best. Allah further preferred mujahideen with great reward: degrees from Him forgiveness and mercy.",
  [{ key: "4:95", excerpt: fv(95), evidenceClass: "EXPLICIT_TEXT", rationale: "La yastawee alqaAAidoona... waalmujahidoona: explicit inequality statement. Ghayru olee alddarari: disability exemption prevents ableism. Faddala Allahu almujahideena... darajatan: divine preference by degree. Wakullan waAAada Allaha alhusna: baseline reward for both." },
   { key: "4:96", excerpt: fv(96), evidenceClass: "EXPLICIT_TEXT", rationale: "Darajatin minhu wamaghfiratan warahmatan: triple specification of additional reward." }],
  [],
  "Gap candidate. Establishes merit-based hierarchy within faith community. Disability exemption (ghayru olee alddarari) crucial qualifier preventing exclusion. Both groups promised husna (best) maintaining dignity. Additional reward specified as degrees plus forgiveness plus mercy. Financial and physical sacrifice both required for highest rank."
));

// cand-0203: Musta'dafun humanitarian exemption
candidates.candidates.push(makeCand("cand-0203",
  "Musta'dafun exemption: genuinely oppressed men women children unable to devise plan or find way excused from emigration obligation",
  undefined, "إعفاء المستضعفين: العجز الحقيقي يعفي من الهجرة",
  "In 4:98-99: Except the oppressed among men women and children who cannot devise a plan nor find a way. For those perhaps Allah will pardon them. Allah is ever Pardoning Forgiving.",
  [{ key: "4:98", excerpt: fv(98), evidenceClass: "EXPLICIT_TEXT", rationale: "Illa almustadAAafeena mina alrrijali waalnnisai waalwildani: three demographic categories explicitly named. La yastateeAAoona heelatan wala yahtadoona sabeelan: dual incapacity criterion - no strategy AND no guidance/path." },
   { key: "4:99", excerpt: fv(99), evidenceClass: "EXPLICIT_TEXT", rationale: "Faolaika AAasa Allahu an yaAAfuwa AAanhum: hopeful expectation of pardon. Wakana Allahu AAafuwwan ghafooran: double divine name emphasizing pardoning nature." }],
  [{ topicId: "hypocrisy", layer: "scholarly", relationship: "related-not-identical", note: "Distinguishes genuine mustad'afun from hypocrites claiming oppression in 4:97" }],
  "Overlap with hypocrisy (scholarly) via contrast: 4:97 condemns false oppression claims while 4:98-99 exempts genuine incapacity. Gender-inclusive language (men women children) unprecedented in exemption clauses. Dual criterion prevents abuse: must lack both capacity to plan AND access to guidance. AAasa (perhaps/hopefully) expresses divine mercy without guarantee."
));

// cand-0204: Fear-prayer institutional adaptation
candidates.candidates.push(makeCand("cand-0204",
  "Fear-prayer (salat al-khawf): detailed protocol preserving communal worship under military threat with rotating armed parties",
  undefined, "صلاة الخوف: بروتوكول الصلاة تحت التهديد العسكري",
  "In 4:101-103: When traveling no blame for shortening prayer if fearing disbelievers. When among them leading prayer let party stand with you carrying arms; when prostrated let other party come behind. If rain or ill lay down arms but take precaution. When finished remember Allah standing sitting lying. When secure establish prayer; prayer is timed decree upon believers.",
  [{ key: "4:101", excerpt: fv(101), evidenceClass: "EXPLICIT_TEXT", rationale: "Falaysa AAalaykum junahun an taqsuroo mina alssalati: concession framed as removal of blame. In khiftum an yaftinakumu allatheena kafaroo: fear condition specified." },
   { key: "4:102", excerpt: fv(102), evidenceClass: "EXPLICIT_TEXT", rationale: "Faltaqum taifatun minhum maAAaka walyakhuthoo aslihatahum: detailed rotation protocol. Wakhuthoo hithrakum: precaution maintained even during concessions." },
   { key: "4:103", excerpt: fv(103), evidenceClass: "EXPLICIT_TEXT", rationale: "Inna alssalata kanat AAala almumineena kitaban mawqootan: prayer as fixed temporal obligation underlying all concessions." }],
  [{ topicId: "prayer", layer: "curated", relationship: "narrower", note: "Specific wartime adaptation of general prayer obligation" }],
  "Overlap with prayer (curated) as specialized application. Most detailed Quranic liturgical protocol. Rotation system balances worship and defense simultaneously. Rain/illness concessions show layered flexibility. Kitaban mawqootan establishes prayer as non-negotiable temporal structure even amid warfare. Post-prayer dhikr in all positions extends worship beyond ritual form."
));

// cand-0205: Opposing Messenger after guidance
candidates.candidates.push(makeCand("cand-0205",
  "Opposition to Messenger after guidance: following other than believers' path leads to Hellfire as wretched destination",
  undefined, "مخالفة الرسول بعد الهدى: اتباع غير سبيل المؤمنين يؤول إلى جهنم",
  "In 4:115: And whoever opposes the Messenger after guidance has become clear to him and follows other than the way of the believers We will give him what he has taken and drive him into Hell and evil it is as a destination.",
  [{ key: "4:115", excerpt: fv(115), evidenceClass: "EXPLICIT_TEXT", rationale: "Waman yushaqiqi alrrasoola min baAAdi ma tabayyana lahu alhuda: opposition defined temporally after clarity. WayattabiAA ghayra sabeeli almumineena: deviation from communal path. Nuwallihi ma tawalla: poetic justice - given what he chose. Wanuslihi jahannama wasaat maseeran: Hellfire as final destination." }],
  [],
  "Gap candidate. Establishes two conditions for severe eschatological consequence: opposing Messenger AND following non-believer path. Min ba'di ma tabayyana (after guidance became clear) removes ignorance excuse. Sabeel al-mu'mineen defines orthopraxy communally not just individually. Nuwallihi ma tawalla represents divine irony - granted exactly what was wrongly chosen."
));

// cand-0206: Private conversation ethics
candidates.candidates.push(makeCand("cand-0206",
  "Private conversation ethics: most secret talk has no good except enjoining charity kindness or reconciliation between people",
  undefined, "آداب النجوى: لا خير في كثير من النجوى إلا صدقة أو معروف أو إصلاح",
  "In 4:114: No good in much of their private conversation except one who enjoins charity or kindness or reconciliation between people. Whoever does that seeking Allah's pleasure We will give great reward.",
  [{ key: "4:114", excerpt: fv(114), evidenceClass: "EXPLICIT_TEXT", rationale: "La khayra fee katheerin min najwahum: sweeping negative assessment of most private talk. Illa man amara bisadaqatin aw maAAroofin aw islahin bayna alnnasi: three positive exceptions - charity (sadaqah), recognized good (ma'ruf), interpersonal reconciliation (islah). Waman yafAAal thalika ibtighaa mardati Allahi: intention requirement - seeking divine pleasure." }],
  [],
  "Gap candidate. Elevates social reform activities above idle private discourse. Three categories cover economic (sadaqah), general ethical (ma'ruf), and relational (islah) dimensions. Ibtighaa mardati Allahi establishes intentionality criterion. Ajran AAatheeman (great reward) signals high valuation. Contrasts sharply with condemned najwa of plotters in 4:81,108."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-020.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-020.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-004-p9 through ext-004-p12)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0197 through cand-${String(196 + candidates.candidates.length).padStart(4,'0')})`);
