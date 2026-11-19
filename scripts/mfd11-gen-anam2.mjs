// MFD-11 An'am Pass 2 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-An'am 6:41-80 (Passages 5-8, Candidates cand-0277..cand-0286).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "006-0041-0080.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 6:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating An'am Pass 2 files from verbatim corpus (6:41-80)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T14:30:00.000Z";

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

// ─── Passage 5: 6:41–50 ────────────────────────────────────────────────────────
const p5 = {
  extractionId: "ext-006-p5",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 41,
    toAyah: 50,
    label: "Al-An'am — Him alone you invoke in distress He removes if wills forget associates; sent to nations before seized with hardship perhaps humble; hearts hardened Satan adorned; forgot reminder opened doors everything rejoiced seized suddenly despair; cut off wrongdoers praise Lord worlds; say if Allah took hearing sight sealed hearts who restores besides Allah? diversify signs yet turn away; say if punishment comes suddenly or openly destroyed except wrongdoers; send messengers only bearers good news warners; believe reform no fear grief; deny signs punishment touches for disobedience; say not claim treasuries Allah nor know unseen nor am angel follow only revealed; blind equal to seeing? reflect"
  },
  verseKeys: ["6:41","6:42","6:43","6:44","6:45","6:46","6:47","6:48","6:49","6:50"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+41}`, text: fv(i+41) })),
  mainSubject: {
    label: "Crisis-invocation sincerity test proving exclusive divine reliance; historical pattern of nations seized with hardship failing to humble; heart-hardening and satanic adornment as barriers; forgotten-reminder leading to sudden seizure after prosperity; wrongdoers eliminated with hamd-closure; sensory-deprivation hypothetical proving no deity besides Allah can restore; sign-diversification met with persistent aversion; punishment-suddenness warning targeting only wrongdoers; messenger-function restricted to glad-tidings and warning; prophetic disavowal of supernatural knowledge affirming revelation-following only; blind-seeing contrast demanding reflection",
    keys: ["6:41","6:42","6:43","6:44","6:45","6:46","6:47","6:48","6:49","6:50"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Exclusive crisis-invocation: iyyahu tadAAoona revealing true reliance under duress", keys: ["6:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Forgetting associates (tansawna ma tushrikoona) during genuine distress", keys: ["6:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Previous nations seized with poverty and hardship to induce humility", keys: ["6:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heart-hardening (qasat quloobuhum) preventing response to divine discipline", keys: ["6:43"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Satanic adornment of deeds reinforcing spiritual blindness", keys: ["6:43"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Forgotten-reminder triggering opening of all doors as istidraj mechanism", keys: ["6:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sudden seizure (baghtatan) at peak rejoicing producing despair (mublisoona)", keys: ["6:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wrongdoers' elimination (qutiAAa dabiru) with hamd-praise closure", keys: ["6:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sensory-deprivation hypothetical: hearing sight heart-seal restoration challenge", keys: ["6:46"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign-diversification (nusarrifu alayati) met with persistent turning away (yasdifoona)", keys: ["6:46"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Punishment arrival modes: suddenly (baghtatan) or manifestly (jahratan)", keys: ["6:47"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Destruction limited to wrongdoers (illa alqawmu alththalimoona)", keys: ["6:47"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger function restricted to bashir-nadhir duality", keys: ["6:48"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Belief-reformation yielding freedom from fear and grief", keys: ["6:48"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign-denial punished proportionally to disobedience (fusuq)", keys: ["6:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic disavowal of treasuries unseen-knowledge and angel-status", keys: ["6:50"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Revelation-following as sole prophetic authority (in attabiAAu illa ma yooha)", keys: ["6:50"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Blind-seeing rhetorical contrast demanding intellectual engagement", keys: ["6:50"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Heart-hardening (qasat quloobuhum) as consequence of ignoring divine discipline", keys: ["6:43"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Despair (mublisoona) upon sudden seizure after false security", keys: ["6:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Persistent sign-aversion (yasdifoona) despite diversification", keys: ["6:46"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Istidraj pattern: forgotten reminder triggers abundance then sudden destruction", keys: ["6:44"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0277","cand-0278","cand-0279"],
  notes: "Pass A An'am passage 5/4. Crisis-invocation verse (6:41) provides experiential tawheed proof: polytheists themselves abandon associates under genuine duress. Istidraj mechanism (6:44) explains delayed punishment as deliberate divine strategy not neglect. Sensory-deprivation hypothetical (6:46) functions as reductio ad absurdum against polytheism: if faculties lost no created being restores them. Messenger-function restriction (6:48) protects prophetic office from supernatural expectations. Blind-seeing contrast (6:50) closes passage with epistemic challenge shifting burden to audience's reasoning capacity.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P5 divine names - search for specific attribute words in 6:41-50
{
  // 6:41-50 does not contain standard divine name pairs beyond Allah
  // Check for any attributes
}

// P5 terminology
{
  const t = findWordContaining(43, ["\u0642","\u0633","\u062a"]); // qasat
  if (t) p5.terminology.push({ term: t, transliteration: "qaswah", gloss: "hardening (editorial gloss)", keys: ["6:43"] });
}
{
  const t = findWordContaining(44, ["\u0628","\u063a","\u062a"]); // baghtatan
  if (t) p5.terminology.push({ term: t, transliteration: "baghtah", gloss: "suddenness (editorial gloss)", keys: ["6:44"] });
}
{
  const t = findWordContaining(44, ["\u0645","\u0628","\u0644","\u0633"]); // mublisoona
  if (t) p5.terminology.push({ term: t, transliteration: "iblas", gloss: "despair/dumbfoundedness (editorial gloss)", keys: ["6:44"] });
}
{
  const t = findWordContaining(45, ["\u062f","\u0627","\u0628","\u0631"]); // dabiru
  if (t) p5.terminology.push({ term: t, transliteration: "dabir", gloss: "remnant/root (editorial gloss)", keys: ["6:45"] });
}
{
  const t = findWordContaining(48, ["\u0645","\u0628","\u0634","\u0631"]); // mubashshireena
  if (t) p5.terminology.push({ term: t, transliteration: "mubashshir", gloss: "bearer of good tidings (editorial gloss)", keys: ["6:48"] });
}
{
  const t = findWordContaining(48, ["\u0645","\u0646","\u0630","\u0631"]); // munthireena
  if (t) p5.terminology.push({ term: t, transliteration: "munthir", gloss: "warner (editorial gloss)", keys: ["6:48"] });
}
{
  const t = findWordContaining(49, ["\u0641","\u0633","\u0642"]); // yafsuqoona
  if (t) p5.terminology.push({ term: t, transliteration: "fusuq", gloss: "defiant disobedience (editorial gloss)", keys: ["6:49"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p5.json"), JSON.stringify(p5, null, 2) + "\n");
console.log("Wrote 006-al-anam-p5.json");

// ─── Passage 6: 6:51–60 ──────────────────────────────────────────────────────
const p6 = {
  extractionId: "ext-006-p6",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 51,
    toAyah: 60,
    label: "Al-An'am — Warn those fearing gathering to Lord no protector intercessor besides Him; do not drive away morning-evening supplicants seeking His face; nothing of their account on you nor yours on them; tested some by others so said did Allah favor these? Allah knows best grateful; when believers come say peace upon you Lord decreed mercy on Himself; evil done in ignorance then repents reforms Forgiving Merciful; detail signs so criminal way becomes clear; forbidden worship besides Allah not follow desires; clear evidence from Lord denied; decision only Allah relates truth best deciders; keys unseen none knows except Him; knows land sea leaf falls grain darkness moist dry all in clear record; takes souls night knows committed day revives fulfill specified term return informed"
  },
  verseKeys: ["6:51","6:52","6:53","6:54","6:55","6:56","6:57","6:58","6:59","6:60"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+51}`, text: fv(i+51) })),
  mainSubject: {
    label: "Warning directed at those fearing divine gathering emphasizing exclusive accountability; prohibition against dismissing low-status believers establishing community ethics; divine testing through social stratification challenging materialist assumptions; greeting-believers command with self-decreed mercy reaffirmation; repentance-mercy pathway for ignorant wrongdoing; sign-detailing making criminal path distinct; prophetic disavowal of desire-following and shirk-worship; divine decision-monopoly with truth-relating; comprehensive unseen-knowledge including keys land-sea leaf-grain; nightly soul-taking and daily accounting establishing continuous divine oversight",
    keys: ["6:51","6:52","6:53","6:54","6:55","6:56","6:57","6:58","6:59","6:60"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Warning scope: those fearing gathering to Lord with no intermediary", keys: ["6:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No protector-intercessor (waliy-shafee') besides Allah establishing direct accountability", keys: ["6:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: do not drive away morning-evening supplicants seeking His face", keys: ["6:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual non-accountability between Prophet and poor believers", keys: ["6:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Social testing (fatanna baAAdahum bibaAAdin) exposing elitist assumptions", keys: ["6:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine knowledge of grateful ones (aAAlama bialshshakireena) vs human judgment", keys: ["6:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Greeting believers with salam and self-decreed mercy reassurance", keys: ["6:54"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance pathway: evil in ignorance then tawbah-islah yields ghafur-raheem", keys: ["6:54"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign-detailing purpose: criminal path becomes evident (tastabeena sabeelu almujrimeena)", keys: ["6:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic prohibition from worshipping other-than-Allah entities", keys: ["6:56"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Desire-following rejection: would constitute misguidance", keys: ["6:56"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Clear evidence (bayyinah) from Lord acknowledged but denied by audience", keys: ["6:57"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Decision-monopoly: ini alhukmu illa lillahi with truth-relating", keys: ["6:57"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Keys of unseen (mafatihu alghaybi) exclusively with Allah", keys: ["6:59"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Comprehensive knowledge: land sea falling leaf grain darkness moist dry in clear record", keys: ["6:59"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nightly soul-taking and daily accounting establishing continuous oversight", keys: ["6:60"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Specified term (ajal musamma) fulfillment then return and informing", keys: ["6:60"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Fear of divine gathering (yakhafoona an yuhsharoo) as motivator for taqwa", keys: ["6:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gratitude (shukr) as criterion known fully only to Allah", keys: ["6:53"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Social stratification as divine test exposing materialist value systems", keys: ["6:53"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0280","cand-0281","cand-0282"],
  notes: "Pass A An'am passage 6/4. Community-ethics block centered on protecting vulnerable believers. Prohibition against driving away poor supplicants (6:52) establishes that spiritual status transcends social rank. Social-testing verse (6:53) reframes poverty as potential sign of divine favor not disfavor. Self-decreed mercy repetition (6:54 cf. 6:12) anchors repentance theology in divine self-commitment. Repentance conditions (ignorance + tawbah + islah) prevent both despair and presumption. Keys-of-unseen verse (6:59) provides most comprehensive divine-knowledge statement in Quran encompassing micro-scale phenomena. Night-day cycle (6:60) establishes continuous divine engagement with human existence.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P6 divine names
{
  const t1 = findWordContaining(54, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(54, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t1 && t2) {
    const fullText = fv(54);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p6.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafur Raheem", gloss: "Forgiving Merciful (editorial gloss)", keys: ["6:54"] });
    }
  }
}

// P6 terminology
{
  const t = findWordContaining(51, ["\u0648","\u0644","\u064a"]); // waliyyun
  if (t) p6.terminology.push({ term: t, transliteration: "waliy", gloss: "protector/guardian (editorial gloss)", keys: ["6:51"] });
}
{
  const t = findWordContaining(51, ["\u0634","\u0641","\u0639"]); // shafeeAAun
  if (t) p6.terminology.push({ term: t, transliteration: "shafi'", gloss: "intercessor (editorial gloss)", keys: ["6:51"] });
}
{
  const t = findWordContaining(54, ["\u062a","\u0627","\u0628"]); // taba
  if (t) p6.terminology.push({ term: t, transliteration: "tawbah", gloss: "repentance (editorial gloss)", keys: ["6:54"] });
}
{
  const t = findWordContaining(59, ["\u0645","\u0641","\u0627","\u062a"]); // mafatihu
  if (t) p6.terminology.push({ term: t, transliteration: "mafatih", gloss: "keys (editorial gloss)", keys: ["6:59"] });
}
{
  const t = findWordContaining(59, ["\u063a","\u064a","\u0628"]); // alghaybi
  if (t) p6.terminology.push({ term: t, transliteration: "ghayb", gloss: "unseen (editorial gloss)", keys: ["6:59"] });
}
{
  const t = findWordContaining(60, ["\u0623","\u062c","\u0644"]); // ajalun
  if (t) p6.terminology.push({ term: t, transliteration: "ajal", gloss: "specified term (editorial gloss)", keys: ["6:60"] });
}

// P6 commands and prohibitions
p6.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["6:52"], excerpt: fv(52), description: "Prohibition: do not drive away those who call upon their Lord morning and evening seeking His face." });
p6.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["6:54"], excerpt: fv(54), description: "Command: when believers come say peace be upon you." });

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p6.json"), JSON.stringify(p6, null, 2) + "\n");
console.log("Wrote 006-al-anam-p6.json");

// ─── Passage 7: 6:61–70 ──────────────────────────────────────────────────────
const p7 = {
  extractionId: "ext-006-p7",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 61,
    toAyah: 70,
    label: "Al-An'am — Subduer above servants sends guardians until death messengers take without neglect; returned to Allah true Master judgment His swiftest accountant; say who saves from darknesses land sea supplicate humbly secretly if saved will be grateful; Allah saves from every distress then associate; Able send punishment above below feet confuse sects taste violence one another; diversify signs may understand; people denied truth it came; every news has finality will know; see engage offensive discourse turn away until other conversation Satan causes forget do not sit after reminder with wrongdoers; righteous not accountable for them only reminder may fear; leave those taking religion play amusement deluded by worldly life; remind lest soul given up earned no protector intercessor offer ransom not accepted; drink scalding water painful punishment disbelieved"
  },
  verseKeys: ["6:61","6:62","6:63","6:64","6:65","6:66","6:67","6:68","6:69","6:70"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+61}`, text: fv(i+61) })),
  mainSubject: {
    label: "Qahir-sovereignty with guardian-angels ensuring precise death-execution; return to true Master with swift accounting; crisis-rescue from land-sea darknesses proving exclusive divine agency; post-rescue shirk as ingratitude pattern; divine capability over punishment-forms including sectarian division; sign-diversification for understanding; news-finality principle; discourse-withdrawal etiquette protecting believers; righteous non-accountability for others limited to reminder; religion-as-play condemnation; soul-forfeiture for earnings with no ransom acceptance; boiling-water punishment for disbelief",
    keys: ["6:61","6:62","6:63","6:64","6:65","6:66","6:67","6:68","6:69","6:70"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Qahir (Subduer) above servants establishing hierarchical sovereignty", keys: ["6:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guardian-angels (hafathatan) ensuring no negligence in soul-taking", keys: ["6:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Return to Allah as true Master (mawlahumu alhaqqi)", keys: ["6:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Swift accounting (asraAAu alhasibeena) emphasizing divine efficiency", keys: ["6:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rescue from land-sea darknesses through humble-secret supplication", keys: ["6:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Conditional gratitude vow (lain anjana lanakoonanna mina alshshakireena)", keys: ["6:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-rescue shirk as betrayal of crisis-sincerity", keys: ["6:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine capability: punishment from above below or sectarian confusion", keys: ["6:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Internal violence (baAsa baAAdin) as punishment form", keys: ["6:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign-diversification aimed at understanding (laAAallahum yafqahoona)", keys: ["6:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "News-finality principle (likulli nabain mustaqarrun)", keys: ["6:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Discourse-withdrawal command when ayat mocked", keys: ["6:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Satanic-forgetting exception with immediate correction requirement", keys: ["6:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Righteous non-accountability for disbelievers; reminder-only obligation", keys: ["6:69"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Religion as play-amusement (laAAiban walahwan) with dunya-delusion", keys: ["6:70"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Soul-forfeiture (tubsala nafsun) for earned deeds", keys: ["6:70"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No protector-intercessor-ransom available at judgment", keys: ["6:70"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Boiling water (hameem) and painful punishment for disbelief", keys: ["6:70"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Crisis-supplication sincerity followed by post-rescue ingratitude", keys: ["6:63","6:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Delusion by worldly life (gharrathumu alhayatu alddunya) as root of religion-trivialization", keys: ["6:70"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0283","cand-0284"],
  notes: "Pass A An'am passage 7/4. Guardian-angel system (6:61) provides mechanistic detail on death-process complementing theological framing. Crisis-rescue repetition (6:63-64 cf. 6:40-41) reinforces experiential tawheed argument with added emphasis on post-rescue betrayal. Sectarian-confusion punishment (yalbisakum shiyaAAan) uniquely identifies internal division as divine chastisement form. Discourse-withdrawal etiquette (6:68) establishes boundary-maintenance protocol for believers. Religion-as-play diagnosis (6:70) identifies root cause of eschatological negligence. Soul-forfeiture language (tubsala/obsiloo) uses rare root emphasizing irreversible surrender.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P7 divine names
{
  const t = findWordContaining(61, ["\u0642","\u0627","\u0647","\u0631"]); // alqahiru
  if (t) p7.divineNamesAndAttributes.push({ term: t, transliteration: "al-Qahir", gloss: "the Subduer/Dominant (editorial gloss)", keys: ["6:61"] });
}
{
  const t = findWordContaining(65, ["\u0642","\u0627","\u062f","\u0631"]); // alqadiru
  if (t) p7.divineNamesAndAttributes.push({ term: t, transliteration: "al-Qadir", gloss: "the Able/Capable (editorial gloss)", keys: ["6:65"] });
}

// P7 commands and prohibitions
p7.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["6:68"], excerpt: fv(68), description: "Command: when you see those engaging in offensive discourse about Our verses turn away until they enter another conversation." });
p7.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["6:68"], excerpt: fv(68), description: "Prohibition: do not sit after the reminder with the wrongdoing people." });
p7.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["6:70"], excerpt: fv(70), description: "Command: leave those who take their religion as play and amusement." });

// P7 terminology
{
  const t = findWordContaining(61, ["\u062d","\u0641","\u0638"]); // hafathatan
  if (t) p7.terminology.push({ term: t, transliteration: "hafathah", gloss: "guardians (editorial gloss)", keys: ["6:61"] });
}
{
  const t = findWordContaining(62, ["\u062d","\u0627","\u0633","\u0628"]); // alhasibeena
  if (t) p7.terminology.push({ term: t, transliteration: "hasib", gloss: "accountant/reckoner (editorial gloss)", keys: ["6:62"] });
}
{
  const t = findWordContaining(63, ["\u0638","\u0644","\u0645"]); // thulumati
  if (t) p7.terminology.push({ term: t, transliteration: "thulumat", gloss: "darknesses (editorial gloss)", keys: ["6:63"] });
}
{
  const t = findWordContaining(64, ["\u0643","\u0631","\u0628"]); // karbin
  if (t) p7.terminology.push({ term: t, transliteration: "karb", gloss: "distress/anguish (editorial gloss)", keys: ["6:64"] });
}
{
  const t = findWordContaining(65, ["\u0634","\u064a","\u0639"]); // shiyaAAan
  if (t) p7.terminology.push({ term: t, transliteration: "shiya'", gloss: "sects/factions (editorial gloss)", keys: ["6:65"] });
}
{
  const t = findWordContaining(67, ["\u0646","\u0628","\u0623"]); // nabain
  if (t) p7.terminology.push({ term: t, transliteration: "naba'", gloss: "news/happening (editorial gloss)", keys: ["6:67"] });
}
{
  const t = findWordContaining(70, ["\u062d","\u0645","\u064a","\u0645"]); // hameemin
  if (t) p7.terminology.push({ term: t, transliteration: "hamim", gloss: "scalding water (editorial gloss)", keys: ["6:70"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p7.json"), JSON.stringify(p7, null, 2) + "\n");
console.log("Wrote 006-al-anam-p7.json");

// ─── Passage 8: 6:71–80 ──────────────────────────────────────────────────────
const p8 = {
  extractionId: "ext-006-p8",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 71,
    toAyah: 80,
    label: "Al-An'am — Say invoke besides Allah what neither benefits harms turned back heels after guided like devils lured bewildered companions call guidance come; guidance Allah is guidance commanded submit Lord worlds establish prayer fear Him gathers; created heavens earth truth day says Be is word truth dominion Day Trumpet blown Knower unseen witnessed Wise Acquainted; Ibrahim said father Azar take idols gods see you people clear error; showed Ibrahim kingdom heavens earth be certain; night covered saw star said this my Lord set said love not setters; moon rising said this my Lord set said unless Lord guides among astray; sun rising said this my Lord greater set said O people free from what associate; turned face Originator heavens earth hanif not polytheists; people argued said argue about Allah when guided? fear not what associate unless Lord wills; Lord encompasses all knowledge reflect; which party deserving security if know? believed did not mix belief injustice those have security guided"
  },
  verseKeys: ["6:71","6:72","6:73","6:74","6:75","6:76","6:77","6:78","6:79","6:80"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+71}`, text: fv(i+71) })),
  mainSubject: {
    label: "Rejection of benefitless deities; post-guidance regression as devil-lured bewilderment; true guidance is Allah's alone; submission-command with prayer and fear; creation-in-truth with kun-fayakun; Trumpet-day dominion with unseen-witnessed knowledge; Ibrahim confronting Azar over idols; kingdom-vision granting certainty; celestial observation (star moon sun) eliminating through setting; bara'a from associates; face-turning to Fatir as hanif; argumentative confrontation; knowledge-encompassment demanding reflection; security-injustice linkage defining true faith",
    keys: ["6:71","6:72","6:73","6:74","6:75","6:76","6:77","6:78","6:79","6:80"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Benefit-harm test: deities besides Allah neither benefit nor harm", keys: ["6:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-guidance heel-turning as regression metaphor", keys: ["6:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Devil-lured bewilderment simile for shirk-adherent state", keys: ["6:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True guidance defined: inna huda Allahi huwa alhuda", keys: ["6:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Submission command to Lord of worlds (linuslima lirabbi alAAalameena)", keys: ["6:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prayer-establishment and divine-fear as paired obligations", keys: ["6:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Creation in truth (bialhaqqi) establishing ontological seriousness", keys: ["6:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kun-fayakun creative command demonstrating absolute divine fiat", keys: ["6:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trumpet-day dominion (almulku yawma yunfakhu fee alssoori)", keys: ["6:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Knower of unseen-witnessed with Wise-Acquainted attribute cluster", keys: ["6:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim confronting father Azar: idol-as-god rejection", keys: ["6:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Manifest error identification (fee dalalin mubeenin)", keys: ["6:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kingdom-vision (malakoota alssamawati waalardi) granting certainty", keys: ["6:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Star observation and setting-based rejection (la ohibbu alafileena)", keys: ["6:76"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Moon observation with conditional guidance-dependence", keys: ["6:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sun observation as greatest then setting-based bara'a declaration", keys: ["6:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Face-turning toward Fatir as hanif excluding mushrikeen", keys: ["6:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Argumentative confrontation: do you argue about Allah when He guided me?", keys: ["6:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fearlessness toward associated entities based on divine will-supremacy", keys: ["6:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Knowledge-encompassment (wasiAAa rabbee kulla shayin AAilman) demanding reflection", keys: ["6:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Security-injustice linkage: belief unmixed with zulm yields amn-guidance", keys: ["6:80"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Ibrahim's celestial-body observation sequence eliminating transient objects through setting-test", keys: ["6:76","6:77","6:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim's bara'a declaration and hanif-orientation toward Fatir", keys: ["6:78","6:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim's argumentative confrontation with his people establishing divine-guidance as defense", keys: ["6:80"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Bewilderment (hayrana) as spiritual state of devil-lured shirk-adherent", keys: ["6:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Certainty (mooqineena) as outcome of kingdom-vision granted to Ibrahim", keys: ["6:75"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Father-son confrontation: Ibrahim challenging Azar's idol-worship", keys: ["6:74"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0285","cand-0286"],
  notes: "Pass A An'am passage 8/4. Ibrahim narrative serves as paradigmatic tawheed-journey model. Celestial-body sequence (6:76-78) uses empirical observation method: each candidate deity eliminated through transience-test (afla/afalat). This models rational monotheism-discovery accessible to any observer. Bara'a-hanif conjunction (6:78-79) combines negative disavowal with positive orientation. Argumentative stance (6:80) demonstrates that tawheed-possession grants confidence against social pressure. Security-injustice linkage (6:80 end) defines true iman as belief unmixed with zulm producing both psychological security and divine guidance. This passage transitions from Meccan polemic to prophetic exemplar providing concrete model for audience.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P8 divine names
{
  const t1 = findWordContaining(73, ["\u062d","\u0643","\u064a","\u0645"]); // alhakeemu
  const t2 = findWordContaining(73, ["\u062e","\u0628","\u064a","\u0631"]); // alkhabeeru
  if (t1 && t2) {
    const fullText = fv(73);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p8.divineNamesAndAttributes.push({ term: phrase, transliteration: "al-Hakeem al-Khabeer", gloss: "the Wise the Acquainted (editorial gloss)", keys: ["6:73"] });
    }
  }
}
{
  const t = findWordContaining(73, ["\u0639","\u0627","\u0644","\u0645"]); // AAalimu
  if (t) p8.divineNamesAndAttributes.push({ term: t, transliteration: "Aalim", gloss: "Knower (editorial gloss)", keys: ["6:73"] });
}
{
  const t = findWordContaining(79, ["\u0641","\u0637","\u0631"]); // fatara
  if (t) p8.divineNamesAndAttributes.push({ term: t, transliteration: "Fatir", gloss: "Originator/Creator (editorial gloss)", keys: ["6:79"] });
}

// P8 commands and prohibitions
p8.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["6:71"], excerpt: fv(71), description: "Command: we have been commanded to submit to the Lord of the worlds." });
p8.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["6:72"], excerpt: fv(72), description: "Command: establish prayer and fear Him." });

// P8 terminology
{
  const t = findWordContaining(71, ["\u062d","\u064a","\u0631"]); // hayrana
  if (t) p8.terminology.push({ term: t, transliteration: "hayrah", gloss: "bewilderment/confusion (editorial gloss)", keys: ["6:71"] });
}
{
  const t = findWordContaining(73, ["\u0635","\u0648","\u0631"]); // alssoori
  if (t) p8.terminology.push({ term: t, transliteration: "sur", gloss: "trumpet/horn (editorial gloss)", keys: ["6:73"] });
}
{
  const t = findWordContaining(75, ["\u0645","\u0644","\u0643","\u0648"]); // malakoota
  if (t) p8.terminology.push({ term: t, transliteration: "malakut", gloss: "realm/kingdom (editorial gloss)", keys: ["6:75"] });
}
{
  const t = findWordContaining(75, ["\u0645","\u0648","\u0642","\u0646"]); // almooqineena
  if (t) p8.terminology.push({ term: t, transliteration: "yiqin", gloss: "certainty (editorial gloss)", keys: ["6:75"] });
}
{
  const t = findWordContaining(76, ["\u0643","\u0648","\u0643","\u0628"]); // kawkaban
  if (t) p8.terminology.push({ term: t, transliteration: "kawkab", gloss: "star/celestial body (editorial gloss)", keys: ["6:76"] });
}
{
  const t = findWordContaining(76, ["\u0623","\u0641","\u0644"]); // alafileena
  if (t) p8.terminology.push({ term: t, transliteration: "afil", gloss: "those that set/disappear (editorial gloss)", keys: ["6:76"] });
}
{
  const t = findWordContaining(79, ["\u062d","\u0646","\u064a","\u0641"]); // haneefan
  if (t) p8.terminology.push({ term: t, transliteration: "hanif", gloss: "inclining toward truth/monotheist (editorial gloss)", keys: ["6:79"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p8.json"), JSON.stringify(p8, null, 2) + "\n");
console.log("Wrote 006-al-anam-p8.json");

// ─── Candidates batch (cand-0277 through cand-0286) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-006-p5,ext-006-p6,ext-006-p7,ext-006-p8",
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

// cand-0277: Crisis-invocation sincerity and istidraj pattern
candidates.candidates.push(makeCand("cand-0277",
  "Crisis-invocation sincerity and istidraj: Him alone invoked in distress removing affliction forgetting associates; forgotten reminder opens doors abundance then sudden seizure at rejoicing producing despair",
  undefined, "إخلاص الدعاء في الأزمات والاستدراج: إياه تدعون فيكشف الضر وتنسون الشركاء؛ نسيان الذكر يفتح أبواب الرخاء ثم أخذ بغتة عند الفرح فيصيب اليأس",
  "In 6:41-44: It is Him alone you invoke and He removes that for which you invoked Him if He wills and you forget what you associate. So when they forgot that by which they had been reminded We opened to them the doors of everything until when they rejoiced in what they were given We seized them suddenly and they were in despair.",
  [{ key: "6:41", excerpt: fv(41), evidenceClass: "EXPLICIT_TEXT", rationale: "Bal iyyahu tadAAoona fayakshifu ma tadAAoona ilayhi in shaa watansawna ma tushrikoona: crisis reveals true object of reliance as associates are involuntarily forgotten under genuine duress." },
   { key: "6:44", excerpt: fv(44), evidenceClass: "EXPLICIT_TEXT", rationale: "Falamma nasoo ma thukkiroo bihi fatahna AAalayhim abwaba kulli shayin hatta itha farihoo bima ootoo akhathnahum baghtatan faitha hum mublisoona: istidraj mechanism where forgotten reminder triggers abundance-proliferation culminating in sudden seizure at peak false-security." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Experiential tawheed proof through involuntary crisis-reliance" },
   { topicId: "hardship-and-ease", layer: "curated", relationship: "related-not-identical", note: "Ease-as-test mechanism preceding sudden reversal" }],
  "Overlap with tawheed and hardship-and-ease. Crisis-invocation (6:41) provides strongest experiential tawheed evidence: polytheists themselves abandon associates when genuinely threatened. Istidraj (6:44) explains delayed punishment as deliberate divine pedagogy not neglect. Abwaba kulli shayin (doors of everything) indicates comprehensive material prosperity making subsequent reversal more devastating. Baghtatan-mublisoona pairing shows suddenness produces total psychological collapse. Together these verses demonstrate that divine patience operates through structured pedagogical sequence."
));

// cand-0278: Sensory-deprivation hypothetical proving exclusive divine agency
candidates.candidates.push(makeCand("cand-0278",
  "Sensory-deprivation hypothetical: if Allah took hearing sight sealed hearts which deity besides Allah could restore? sign-diversification met with persistent turning away",
  undefined, "فرضية الحرمان الحسي: لو أخذ الله السمع والأبصار وختم على القلوب أي إله غير الله يردها؟ تصريف الآيات يواجه بالإعراض المستمر",
  "In 6:46: Say have you considered if Allah should take away your hearing and your sight and set a seal upon your hearts which deity other than Allah could bring them back to you? Look how We diversify the verses then they still turn away.",
  [{ key: "6:46", excerpt: fv(46), evidenceClass: "EXPLICIT_TEXT", rationale: "Qul araaytum in akhatha Allahu samAAakum waabsarakum wakhatama AAala quloobikum man ilahun ghayru Allahi yateekum bihi: triple-faculty deprivation hypothetical using rhetorical question format forcing acknowledgment that no created being can restore lost capacities. Onthur kayfa nusarrifu alayati thumma hum yasdifoona: sign-diversification explicitly noted yet aversion persists proving rejection is volitional not evidential." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Reductio ad absurdum against polytheism through faculty-dependency argument" }],
  "Overlap with tawheed. Triple-faculty deprivation (hearing sight heart-seal) covers all channels of divine communication making the hypothetical maximally forceful. Man ilahun ghayru Allahi construction excludes all possible alternatives through interrogative negation. Nusarrifu (diversify) implies multiple sign-types already presented yet yasdifoona (turn away) shows systematic rejection regardless of sign modality. This verse functions as philosophical argument accessible to any rational agent independent of revelation-content."
));

// cand-0279: Messenger-function restriction and prophetic disavowal
candidates.candidates.push(makeCand("cand-0279",
  "Messenger-function restriction: messengers sent only as glad-tidings-bearers and warners; belief-reformation yields freedom from fear grief; prophet disavows treasuries unseen-knowledge angel-status follows only revelation",
  undefined, "تحديد وظيفة الرسول: الرسل مبشرون ومنذرون فقط؛ الإيمان والإصلاح يزيلان الخوف والحزن؛ النبي يتبرأ من خزائن الغيب وكونه ملكاً ويتبع الوحي فقط",
  "In 6:48-50: We send not the messengers except as bringers of good tidings and warners. Whoever believes and reforms there will be no fear concerning them nor will they grieve. Say I do not tell you I have the depositories of Allah or know the unseen or am an angel. I only follow what is revealed to me.",
  [{ key: "6:48", excerpt: fv(48), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama nursilu almursaleena illa mubashshireena wamunthireena: messenger-function restricted to dual role excluding supernatural intervention or political authority. Faman amana waaslaha fala khawfun AAalayhim wala hum yahzanoona: belief-reformation pairing producing existential security." },
   { key: "6:50", excerpt: fv(50), evidenceClass: "EXPLICIT_TEXT", rationale: "Qul la aqoolu lakum AAindee khazainu Allahi wala aAAlamu alghayba wala aqoolu lakum innee malakun: triple-disavowal eliminating treasury-access unseen-knowledge and angel-status claims. In attabiAAu illa ma yooha ilayya: revelation-following as sole authority basis." }],
  [{ topicId: "prophets", layer: "curated", relationship: "same-concept", note: "Prophetic office defined through functional restriction and disavowal" }],
  "Overlap with prophets. Illa mubashshireena wamunthireena construction uses exclusive restriction eliminating all other expected messenger-functions. Khazain-ghayb-malak triple disavowal addresses three major Meccan objections systematically. In attabiAAu illa ma yooha establishes wahy as sole epistemic foundation distinguishing prophet from mystic or ruler. Fear-grief removal (6:48) provides psychological outcome of proper belief-response creating incentive structure."
));

// cand-0280: Community ethics and social-testing
candidates.candidates.push(makeCand("cand-0280",
  "Community ethics and social-testing: do not drive away morning-evening supplicants seeking His face; mutual non-accountability; tested some by others exposing elitist assumptions; Allah knows best who are grateful",
  undefined, "أخلاق المجتمع والامتحان الاجتماعي: لا تطرد الذين يدعون ربهم بالغداة والعشي يريدون وجهه؛ عدم المحاسبة المتبادلة؛ امتحان البعض بالبعض لكشف النزعة الطبقية؛ الله أعلم بالشاكرين",
  "In 6:52-53: Do not send away those who call upon their Lord morning and afternoon seeking His countenance. Not upon you is anything of their account nor upon them anything of your account. Thus We have tried some of them through others that they might say is it these whom Allah has favored among us? Is not Allah most knowing of those who grateful?",
  [{ key: "6:52", excerpt: fv(52), evidenceClass: "EXPLICIT_TEXT", rationale: "Wala tatrudi allatheena yadAAoona rabbahum bialghadati waalAAashiyyi yureedoona wajhahu: prohibition protecting vulnerable believers whose spiritual dedication (morning-evening supplication, face-seeking) outweighs social status. Ma AAalayka min hisabihim min shayin: mutual non-accountability establishing that Prophet bears no responsibility for their worldly condition." },
   { key: "6:53", excerpt: fv(53), evidenceClass: "EXPLICIT_TEXT", rationale: "Wakathalika fatanna baAAdahum bibaAAdin: social stratification framed as deliberate divine test not random inequality. Liyaqooloo ahaolai manna Allahu AAalayhim min baynina: exposes elitist assumption that divine favor correlates with wealth. Alaysa Allahu biaAAlama bialshshakireena: divine knowledge of gratitude supersedes human social judgment." }],
  [{ topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Social hierarchy as test of taqwa-based values versus materialist assumptions" }],
  "Overlap with god-consciousness. Morning-evening supplication pattern (bialghadati waalAAashiyyi) indicates sustained devotion not performative piety. Yureedoona wajhahu (seeking His face) specifies pure intention distinguishing these believers from status-seekers. Fatanna (tested) reframes poverty as potential sign of divine selection reversing worldly value hierarchy. BiaAAlama bialshshakireena establishes gratitude as true metric of divine favor inaccessible to human observation."
));

// cand-0281: Self-decreed mercy and repentance pathway
candidates.candidates.push(makeCand("cand-0281",
  "Self-decreed mercy and repentance pathway: greet believers with peace Lord decreed mercy on Himself; evil done in ignorance then repents reforms He is Forgiving Merciful; sign-detailing makes criminal way evident",
  undefined, "الرحمة المكتوبة ومسار التوبة: سلموا على المؤمنين كتب ربكم على نفسه الرحمة؛ من عمل سوءاً بجهالة ثم تاب وأصلح فهو غفور رحيم؛ تفصيل الآيات يستبين سبيل المجرمين",
  "In 6:54-55: When those who believe in Our verses come to you say peace be upon you. Your Lord has decreed upon Himself mercy that whoever does evil in ignorance then repents and reforms indeed He is Forgiving Merciful. Thus We detail the verses so the way of the criminals becomes evident.",
  [{ key: "6:54", excerpt: fv(54), evidenceClass: "EXPLICIT_TEXT", rationale: "Faqul salamun AAalaykum kataba rabbukum AAala nafsihi alrrahmata: greeting-mercy linkage anchoring community welcome in divine self-commitment. Annahu man AAamila minkum sooan bijahalatin thumma taba min baAAdihi waaslaha faannahu ghafoorun raheemun: repentance conditions (ignorance + tawbah + islah) preventing both despair and presumption." },
   { key: "6:55", excerpt: fv(55), evidenceClass: "EXPLICIT_TEXT", rationale: "Wakathalika nufassilu alayati walitastabeena sabeelu almujrimeena: sign-detailing serves diagnostic function making criminal-pathway recognizable and avoidable." }],
  [{ topicId: "repentance", layer: "curated", relationship: "same-concept", note: "Structured repentance pathway with explicit conditions and divine self-commitment" },
   { topicId: "mercy-and-forgiveness", layer: "curated", relationship: "same-concept", note: "Self-decreed mercy as foundation for forgiveness availability" }],
  "Overlap with repentance and mercy-and-forgiveness. Kataba AAala nafsihi alrrahmata repetition (cf. 6:12) reinforces mercy as structural divine commitment not contingent response. Bijahalatin qualifier prevents misuse: intentional persistent sin excluded from this pathway. Taba-waaslaha pairing requires both internal repentance and external reformation. Ghafur-Raheem conclusion provides dual assurance covering past erasure and future compassion. Sabeelu almujrimeena clarity enables proactive avoidance complementing reactive repentance."
));

// cand-0282: Comprehensive unseen-knowledge and continuous oversight
candidates.candidates.push(makeCand("cand-0282",
  "Comprehensive unseen-knowledge and continuous oversight: keys of unseen none knows except Him; knows land sea falling leaf grain in darkness moist dry all in clear record; takes souls night knows daytime deeds revives for specified term then return and informing",
  undefined, "علم الغيب الشامل والرقابة المستمرة: مفاتيح الغيب لا يعلمها إلا هو؛ يعلم البر والبحر وسقوط الورقة والحب في الظلمات والرطب واليابس في كتاب مبين؛ يتوفى الأنفس ليلاً ويعلم جراح النهار ويبعث لقضاء أجل مسمى ثم المرجع والإنباء",
  "In 6:59-60: With Him are the keys of the unseen none knows them except Him. He knows what is on land and in the sea. Not a leaf falls but He knows it nor a grain within the darknesses of the earth nor anything moist or dry but in a clear record. He takes your souls by night and knows what you committed by day then revives you therein that a specified term may be fulfilled then to Him is your return then He will inform you about what you used to do.",
  [{ key: "6:59", excerpt: fv(59), evidenceClass: "EXPLICIT_TEXT", rationale: "WaAAindahu mafatihu alghaybi la yaAAlamuha illa huwa: exclusive unseen-access establishing epistemic monopoly. WayaAAlamu ma fee albarri waalbahri wama tasqutu min waraqatin illa yaAAlamuha wala habbatin fee thulumati alardi wala ratbin wala yabisin illa fee kitabin mubeenin: micro-scale comprehensiveness (leaf grain darkness moisture) demonstrating knowledge penetrates all scales and conditions." },
   { key: "6:60", excerpt: fv(60), evidenceClass: "EXPLICIT_TEXT", rationale: "Wahuwa allathee yatawaffakum biallayli wayaAAlamu ma jarahtum bialnnahari: night-day cycle establishing continuous engagement. Thumma yabAAathukum feehi liyuqda ajalun musamman thumma ilayhi marjiAAukum thumma yunabbiokum bima kuntum taAAmaloona: term-fulfillment return-informing sequence completing accountability framework." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical", note: "Omniscience demonstrated through exhaustive enumeration across all domains" }],
  "Overlap with divine-power. Mafatihu alghaybi (keys of unseen) metaphor suggests locked repositories accessible only to divine holder. Leaf-grain-darkness enumeration moves from visible to hidden from large to small demonstrating no scale escapes. Kitab mubeen (clear record) provides archival mechanism ensuring nothing lost. Yatawaffakum-yabAAathukum cycle mirrors nightly death-daily resurrection prefiguring eschatological pattern. Yunabbiokum (inform) promises complete disclosure closing accountability loop."
));

// cand-0283: Post-rescue ingratitude and punishment-forms
candidates.candidates.push(makeCand("cand-0283",
  "Post-rescue ingratitude and punishment-forms: Allah saves from every distress then you associate; Able to send punishment from above below or confuse into sects tasting violence one another; diversify signs for understanding",
  undefined, "نكران الجميل بعد الإنجاة وأشكال العذاب: الله ينجي من كل كرب ثم تشركون؛ قادر على إرسال عذاب من فوق أو تحت أو لبس شيع وإذاقة بأس بعضكم ببعض؛ تصريف الآيات للفقه",
  "In 6:64-65: Say Allah saves you from it and from every distress then you associate others with Him. Say He is the Able to send upon you affliction from above you or from beneath your feet or to confuse you into sects and make you taste the violence of one another. Look how We diversify the signs that they might understand.",
  [{ key: "6:64", excerpt: fv(64), evidenceClass: "EXPLICIT_TEXT", rationale: "Quli Allahu yunajjeekum minha wamin kulli karbin thumma antum tushrikoona: rescue-ingratitude sequence using thumma (then) marking temporal-causal betrayal. Min kulli karbin extends rescue scope beyond specific crisis to all distress." },
   { key: "6:65", excerpt: fv(65), evidenceClass: "EXPLICIT_TEXT", rationale: "Qul huwa alqadiru AAala an yabAAatha AAalaykum AAathaban min fawqikum aw min tahti arjulikum aw yalbisakum shiyaAAan wayutheeqa baAAdakum basa baAAdin: three punishment-forms (above below sectarian-confusion) covering all spatial-social dimensions. Onthur kayfa nusarrifu alayati laAAallahum yafqahoona: diversification aimed at understanding (yafqahoona) not merely seeing." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "same-concept", note: "Multi-modal punishment capability demonstrating comprehensive divine agency" },
   { topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Post-rescue shirk as violation of experientially proven tawheed" }],
  "Overlap with divine-power and tawheed. Thumma antum tushrikoona uses emphatic antum highlighting agency in betrayal: rescue-recipients actively choose ingratitude. Three punishment-forms cover vertical (above-below) and horizontal (sectarian) dimensions leaving no escape vector. Yalbisakum shiyaAAan (confuse into sects) uniquely identifies internal division as divine chastisement distinct from external calamity. Yafqahoona (understand) targets cognitive faculty suggesting signs are intelligible to willing minds."
));

// cand-0284: Religion-as-play and soul-forfeiture
candidates.candidates.push(makeCand("cand-0284",
  "Religion-as-play and soul-forfeiture: leave those taking religion as play amusement deluded by worldly life; remind lest soul given up for earned no protector intercessor ransom accepted; boiling water painful punishment for disbelief",
  undefined, "الدين لعب ولهو ومهجة النفس: ذر الذين اتخذوا دينهم لعباً ولهواً وغرتهم الحياة الدنيا؛ ذكر لئلا تبسل نفس بما كسبت لا ولي ولا شفيع ولا عدل يؤخذ؛ شراب من حميم وعذاب أليم بالكفر",
  "In 6:70: Leave those who take their religion as play and amusement and whom the worldly life has deluded. Remind with it lest a soul be given up for what it earned. It will have besides Allah no protector nor intercessor. If it offered every compensation it would not be accepted. Those are given up for what they earned. For them is a drink of scalding water and painful punishment because they disbelieved.",
  [{ key: "6:70", excerpt: fv(70), evidenceClass: "EXPLICIT_TEXT", rationale: "Wathari allatheena ittakhathoo deenahum laAAiban walahwan wagharrathumu alhayatu alddunya: religion-trivialization diagnosed as play-amusement rooted in dunya-delusion. Wathakkir bihi an tubsala nafsun bima kasabat: reminder-purpose preventing soul-forfeiture (tubsala) tied to personal earnings. Laysa laha min dooni Allahi waliyyun wala shafeeAAun wain taAAdil kulla AAadlin la yukhath minha: triple-negation (no protector no intercessor no ransom-acceptance) eliminating all escape routes. Lahum sharabun min hameemin waAAathabun aleemun bima kanoo yakfuroona: punishment-specification linked causally to disbelief." }],
  [{ topicId: "the-hereafter", layer: "curated", relationship: "related-not-identical", note: "Eschatological consequences of religion-trivialization" }],
  "Overlap with the-hereafter. LaAAiban walahwan pairing identifies two modes of religion-trivialization: active mockery and passive distraction. Gharrathumu alhayatu alddunya locates root cause in dunya-deception not mere intellectual error. Tubsala (given up/surrendered) uses rare root emphasizing irreversible forfeiture. Triple-negation structure systematically eliminates hoped-for intermediaries. Hameem (scalding water) provides sensory-specific punishment imagery intensifying deterrent effect. Bima kanoo yakfuroona establishes causal link between persistent disbelief-state and punishment-outcome."
));

// cand-0285: Ibrahim's tawheed-journey through celestial observation
candidates.candidates.push(makeCand("cand-0285",
  "Ibrahim's tawheed-journey: confronted father Azar over idol-worship manifest error; shown kingdom heavens earth for certainty; observed star moon sun each rejected upon setting; declared bara'a from associates turned face to Fatir as hanif",
  undefined, "مسيرة إبراهيم التوحيدية: واجه أباه آزر على عبادة الأصنام ضلال مبين؛ أُري ملكوت السماوات والأرض لليقين؛ رصد الكوكب والقمر والشمس ورفض كل منها عند أفولها؛ تبرأ من الشركاء ووجه وجهه للفطر حنيفاً",
  "In 6:74-79: When Ibrahim said to his father Azar do you take idols as deities? I see you and your people in manifest error. Thus We showed Ibrahim the realm of heavens and earth that he would be among the certain. When night covered him he saw a star said this is my lord; when it set said I love not those that set. When he saw moon rising said this is my lord; when it set said unless my Lord guides me I will be among astray. When he saw sun rising said this is my lord this is greater; when it set said O my people I am free from what you associate. I have turned my face toward He who originated heavens and earth as hanif and I am not of the polytheists.",
  [{ key: "6:74", excerpt: fv(74), evidenceClass: "EXPLICIT_TEXT", rationale: "Waith qala ibraheemu liabeehi azara atattakhithu asnaman alihatan innee araka waqawmaka fee dalalin mubeenin: filial confrontation combining respect (addressing father) with uncompromising truth-declaration (manifest error)." },
   { key: "6:75", excerpt: fv(75), evidenceClass: "EXPLICIT_TEXT", rationale: "Wakathalika nuree ibraheema malakoota alssamawati waalardi waliyakoona mina almooqineena: kingdom-vision as divine grant producing certainty (yiqin) not mere intellectual conclusion." },
   { key: "6:76", excerpt: fv(76), evidenceClass: "EXPLICIT_TEXT", rationale: "Falamma janna AAalayhi allaylu raa kawkaban qala hatha rabbee falamma afala qala la ohibbu alafileena: first observation-setting cycle establishing transience-criterion for deity-rejection." },
   { key: "6:77", excerpt: fv(77), evidenceClass: "EXPLICIT_TEXT", rationale: "Falamma raa alqamara bazighan qala hatha rabbee falamma afala qala lain lam yahdinee rabbee laakoonanna mina alqawmi alddalleena: second cycle adding guidance-dependence acknowledgment." },
   { key: "6:78", excerpt: fv(78), evidenceClass: "EXPLICIT_TEXT", rationale: "Falamma raa alshshamsa bazighatan qala hatha rabbee hatha akbaru falamma afalat qala ya qawmi innee bareeon mimma tushrikoona: third cycle with greatest-candidate then public bara'a declaration." },
   { key: "6:79", excerpt: fv(79), evidenceClass: "EXPLICIT_TEXT", rationale: "Innee wajjahtu wajhiya lillathee fatara alssamawati waalarda haneefan wama ana mina almushrikeena: positive orientation (face-turning to Fatir) combined with negative disavowal (not mushrikeen) completing tawheed-declaration." }],
  [{ topicId: "ibrahim-story", layer: "scholarly", relationship: "same-concept", note: "Core Ibrahim tawheed-discovery narrative with empirical methodology" },
   { topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Paradigmatic rational-monotheism discovery through observation and elimination" }],
  "Overlap with ibrahim-story and tawheed. Three-stage celestial observation models empirical methodology accessible to any rational observer. Each stage escalates candidate-plausibility (star < moon < sun) yet all fail transience-test. La ohibbu alafileena expresses affective rejection not merely intellectual. Lain lam yahdinee rabbee acknowledges guidance-dependence preventing self-sufficient rationalism. Ya qawmi address marks transition from private inquiry to public proclamation. Hanif designation connects Ibrahim to primordial monotheism predating revealed scripture."
));

// cand-0286: Security-injustice linkage and divine-knowledge encompassment
candidates.candidates.push(makeCand("cand-0286",
  "Security-injustice linkage: Ibrahim argues from divine-guidance fears not associates unless Lord wills; Lord encompasses all in knowledge reflect; those who believed did not mix belief with injustice have security are guided",
  undefined, "الأمن والظلم: إبراهيم يحتج بالهداية الإلهية ولا يخاف الشركاء إلا بمشيئة الرب؛ الرب وسع كل شيء علماً أفلا تتذكرون؛ الذين آمنوا ولم يلبسوا إيمانهم بظلم لهم الأمن وهم مهتدون",
  "In 6:80: His people argued with him. He said do you argue with me concerning Allah while He has guided me? I fear not what you associate unless my Lord wills something. My Lord encompasses all things in knowledge; will you not remember? Those who believed and did not mix their belief with injustice those have security and they are guided.",
  [{ key: "6:80", excerpt: fv(80), evidenceClass: "EXPLICIT_TEXT", rationale: "Wahajjahu qawmuhu qala atuhajjoonnee fee Allahi waqad hadani: argumentative confidence grounded in received guidance not personal opinion. Wala akhafu ma tushrikoona bihi illa an yashaa rabbee shayan: fearlessness toward associates conditioned only on divine will establishing absolute sovereignty. WasiaAa rabbee kulla shayin AAilman afala tatathakkaroona: knowledge-encompassment demanding reflective response. Allatheena amanoo walam yalbisoo eemanahum bithulmin olaika lahumu alamnu wahum muhtadoona: security-guidance as dual reward for belief unmixed with injustice." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Tawheed-possession producing psychological security and argumentative confidence" },
   { topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Zulm-avoidance as condition for security linking taqwa to existential peace" }],
  "Overlap with tawheed and god-consciousness. Atuhajjoonnee fee Allahi waqad hadani frames debate asymmetry: divine-guidance trumps human argument. Illa an yashaa rabbee shayan exception clause prevents absolute self-confidence maintaining divine-dependence even in fearlessness. WasiaAa-kulla-shayin-AAilman provides epistemic foundation for security: nothing escapes divine awareness therefore nothing threatens outside His permission. Zulm-exclusion condition (walam yalbisoo eemanahum bithulmin) defines true faith as belief-integrity producing both amn (security) and hidayah (guidance) as inseparable outcomes."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-028.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-028.json");

console.log("\nGeneration complete:");
console.log("  Extractions: 4 (ext-006-p5 through ext-006-p8)");
console.log("  Candidates: 10 (cand-0277 through cand-0286)");
console.log("  Verse range: 6:41-80 (40 verses)");
