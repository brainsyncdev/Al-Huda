// MFD-11 Wave 2: Surah 14 (Ibrahim) genuine re-extraction.
// Covers 14:1–52 in 2 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "014-0001-0052.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 14:${n} not found`);
  return verses[n];
}

function findWord(vid, chars) {
  const t = fv(vid);
  const words = t.split(/\s+/);
  for (const w of words) {
    let match = true;
    for (const ch of chars) { if (!w.includes(ch)) { match = false; break; } }
    if (match) return w;
  }
  return null;
}

console.log("Generating Surah 14 (Ibrahim) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T12:35:00.000Z";

// P1: 14:1–27 — Prophetic mission in native language, gratitude principle, messenger-humanity tension, good/bad word parables
// P2: 14:28–52 — Ingratitude consequences, Abraham's Mecca supplications, eschatological justice, closing tawheed

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-014-p1": [
    "Book revealed to bring mankind from darknesses into light by permission of their Lord to path of Exalted Praiseworthy",
    "Divine ownership of heavens and earth with woe declared for disbelievers from severe punishment",
    "Preference for worldly life over Hereafter and averting others from Allah's way as extreme error",
    "Messenger sent only in language of his people for clarity while Allah guides and misleads whom He wills",
    "Musa sent with signs to bring people from darknesses to light and remind them of days of Allah",
    "Musa commanding remembrance of divine favor saving from Firawn's worst torment killing sons sparing women",
    "Lord's proclamation that gratitude brings increase while denial brings severe punishment",
    "Musa declaring Allah Free of Need and Praiseworthy even if all on earth disbelieve",
    "News of prior peoples Nuh Aad Thamud and those after whose messengers brought clear proofs yet were rejected",
    "Messengers asking can there be doubt about Creator of heavens earth who invites to forgiveness and delayed term",
    "Messengers affirming human likeness but divine favor conferred upon whom He wills with authority only by His permission",
    "Declaration of reliance upon Allah who guided to good ways and patience against harm inflicted",
    "Disbelievers threatening expulsion or forced return to ancestral religion prompting divine destruction decree",
    "Promise of settlement in land after destroyed peoples for those fearing divine station and threat",
    "Request for victory resulting in disappointment for every obstinate tyrant",
    "Hell awaiting the obstinate tyrant with drink of purulent water",
    "Gulping purulent water without swallowing while death approaches from every direction yet no release",
    "Disbelievers' deeds likened to ashes scattered by storm wind unable to retain anything earned",
    "Creation of heavens and earth in truth with power to remove current humanity and produce new creation",
    "Affirmation that replacing humanity with new creation is not difficult for Allah in Ibrahim context",
    "Weak followers confronting arrogant leaders on Judgment Day finding no avail against divine punishment",
    "Satan's post-judgment confession of having no authority except invitation and blaming those who responded",
    "Believers doing righteous deeds admitted to gardens with rivers flowing greeted with peace",
    "Good word likened to good tree with firm root and branches reaching sky producing perpetual fruit",
    "Perpetual fruit production by divine permission with parables presented for remembrance",
    "Bad word likened to bad tree uprooted from earth surface having no stability",
    "Allah keeping believers firm with steadfast word in both worlds while sending wrongdoers astray"
  ],
  "ext-014-p2": [
    "Those exchanging divine favor for disbelief settling their people in home of ruin",
    "Hell as destination for those who exchanged favor described as wretched settlement",
    "Attributing equals to Allah to mislead from His way with command to enjoy before Fire destination",
    "Command to believing servants to establish prayer and spend secretly publicly before tradeless friendship-less Day",
    "Allah creating heavens earth sending rain producing fruits and subjecting ships rivers as provision",
    "Subjection of sun moon in continuous orbit and night day cycle as divine favors",
    "All requested provisions granted yet counting divine favors impossible with mankind unjust ungrateful",
    "Abraham supplicating for city security and protection of himself and sons from idol worship",
    "Acknowledgment that idols led many astray with followers belonging to Abraham and disobedients under divine mercy",
    "Settling descendants in uncultivated valley near sacred House to establish prayer with hearts inclined and fruit provision",
    "Declaration that Allah knows what is concealed and declared with nothing hidden in earth or heaven",
    "Praise for granting Ishmael and Isaac in old age affirming Lord as Hearer of supplication",
    "Supplication to be made establisher of prayer along with descendants and acceptance of prayer",
    "Supplication for forgiveness of self parents and believers on Day account is established",
    "Warning not to consider Allah unaware of wrongdoers merely delaying them until staring-eyes Day",
    "Eschatological scene of racing ahead heads raised glances not returning hearts void",
    "Wrongdoers requesting brief delay on punishment Day reminded of prior oaths denying cessation",
    "Living in dwellings of self-wrongers with clear examples of divine dealing presented",
    "Human plotting recorded with Allah even if plot could move mountains",
    "Affirmation Allah never fails promise to messengers described as Exalted Owner of Retribution",
    "Earth replaced by another earth and heavens transformed with creatures appearing before One Prevailing",
    "Criminals bound together in shackles on Judgment Day",
    "Garments of liquid pitch with faces covered by Fire as punishment imagery",
    "Recompense of every soul for what it earned with Allah swift in account",
    "Quran as notification warning people establishing one God and reminding those of understanding"
  ]
};

const PASSAGES = [
  { id: "ext-014-p1", from: 1, to: 27,
    label: "Ibrahim — Book revealed bring mankind darknesses into light by permission Mighty Praiseworthy; Allah owns heavens earth woe disbelievers severe punishment; prefer worldly life avert way Allah seeking deviation far astray; sent messenger only language his people state clearly Allah misleads guides wills He Exalted Wise; sent Musa signs bring people darknesses light remind days Allah; Moses told people remember favor saved Firawn people afflicting worst torment killing sons sparing women great trial Lord; Lord proclaimed grateful increase deny punishment severe; Moses said disbelieve you all earth Allah Free need Praiseworthy; news reached those before Nuh Aad Thamud after them none knows except Allah; messengers said doubt about Allah Creator heavens earth invites forgive sins delay term; messengers said only men like you Allah favors whom wills servants never brought authority except permission Allah; upon Allah rely guided ways patient harm done us; disbelievers said drive out land or return religion; Lord caused dwell land after them fears position threat; requested victory disappointed obstinate tyrant; Hell before given purulent water gulp hardly swallow death comes everywhere not die severe punishment ahead; example disbelievers deeds like ashes wind blows forcefully stormy day unable keep earned; created heavens earth truth wills remove produce new creation not difficult Allah; come out judgement together weak say arrogant followers could avail anything; Satan says matter concluded Allah promised truth I promised betrayed no authority called believed then disbelieved; believed righteous gardens rivers abide eternally greeting peace",
    mainLabel: "Quran as Book bringing humanity from darkness to light through divine permission; prophetic mission conducted in native language ensuring clarity; gratitude-ingratitude principle as divine law of increase and punishment; messenger humanity affirmed while divine favor distinguished; historical precedent of destroyed peoples establishing pattern; tyrant punishment sequence from purulent water to eternal torment; disbelief metaphor as ashes scattered by storm wind; good word-good tree parable with firm root and perpetual fruit; bad word-bad tree uprooted without stability; divine firmness for believers through steadfast word in both worlds" },
  { id: "ext-014-p2", from: 28, to: 52,
    label: "Ibrahim — Exchanged favor Allah disbelief settled home ruin Hell burn wretched settlement; attributed equals Allah mislead say enjoy destination Fire; tell servants believed establish prayer spend secretly publicly before Day no trade friendship; Allah created heavens earth sent rain produced fruits provision subjected sun moon continuous night day; gave all asked count favor cannot enumerate mankind unjust ungrateful; Abraham said Lord make city secure keep sons worshipping idols; led astray many follows me of me disobeys Forgiving Merciful; settled descendants uncultivated valley near sacred House establish prayer make hearts incline provide fruits grateful; Lord knows conceal declare nothing hidden earth heaven; praise Allah granted old age Ishmael Isaac Hearer supplication; Lord make establisher prayer descendants accept supplication; forgive parents believers Day account established; never think Allah unaware wrongdoers delays Day eyes stare horror; racing heads raised glance not return hearts void; warn people Day punishment comes wrongdoers say delay brief term; lived dwellings wronged selves clear dealt presented examples; planned plan Allah recorded even sufficient do away mountains; never think Allah fail promise messengers Exalted Might Owner Retribution; Day earth replaced another earth heavens creatures come Allah One Prevailing; criminals bound shackles garments liquid pitch faces covered Fire; recompense every soul earned swift account; notification warned know one God mindful",
    mainLabel: "Favor-for-disbelief exchange resulting in hellish settlement; shirk as misdirection strategy with deferred fire destination; prayer-spending command as believer identity markers preceding tradeless Day; creation-provision catalog demonstrating uncountable divine favors; Abraham's comprehensive Mecca supplication: security, monotheism protection, prayer establishment, provision, gratitude; divine omniscience over concealed and declared; parental blessing recognition in old age; intercessory prayer for descendants and all believers on Judgment Day; wrongdoer delusion exposed through delayed punishment; historical proximity to destroyed peoples as warning evidence; human plotting versus divine recording; earth-heaven replacement as cosmic transformation; criminal binding and pitch-garment punishment imagery; closing tawheed affirmation and mindfulness command" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`14:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`14:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 14, surahName: "Ibrahim",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: `Wave 2 genuine re-extraction. Passage boundaries: P1 covers prophetic framework and parables (1-27), P2 covers Abraham supplications and eschatology (28-52).`,
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE ANALYTICAL ARRAYS ===

// P1 (14:1-27)
{
  const e = extractions[0];
  const allah = findWord(2, ["\u0627","\u0644","\u0644","\u0647"]);
  const aziz = findWord(1, ["\u0639","\u0632","\u064a","\u0632"]);
  const hameed = findWord(1, ["\u062d","\u0645","\u064a","\u062f"]);
  const ghani = findWord(8, ["\u063a","\u0646","\u064a"]);
  if (allah) e.divineNamesAndAttributes.push({ term: allah, transliteration: "Allah", gloss: "God (editorial gloss)", keys: ["14:2"] });
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Mighty/Exalted (editorial gloss)", keys: ["14:1"] });
  if (hameed) e.divineNamesAndAttributes.push({ term: hameed, transliteration: "Hameed", gloss: "Praiseworthy (editorial gloss)", keys: ["14:1"] });
  if (ghani) e.divineNamesAndAttributes.push({ term: ghani, transliteration: "Ghani", gloss: "Free of Need/Self-Sufficient (editorial gloss)", keys: ["14:8"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["14:7"], excerpt: fv(7), description: "Your Lord proclaimed: If you are grateful I will surely increase you; but if you deny indeed My punishment is severe." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["14:12"], excerpt: fv(12), description: "Why should we not rely upon Allah while He has guided us to our good ways — trust declaration." });

  e.propheticNarratives.push({ label: "Musa mission: bringing people from darkness to light with reminder of Allah's days and salvation from Firawn", keys: ["14:5","14:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Historical destruction sequence: Nuh, Aad, Thamud and those after them — pattern unknown except to Allah", keys: ["14:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Preference for worldly life over Hereafter as root cause of aversion from divine path", keys: ["14:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Messenger-messaged tension: prophets are only men like you but Allah confers favor upon whom He wills", keys: ["14:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Satan's post-judgment confession: Allah promised truth I promised but betrayed you with no authority over you", keys: ["14:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine guidance-misguidance sovereignty: Allah sends astray whom He wills and guides whom He wills", keys: ["14:4"], evidenceClass: "EXPLICIT_TEXT" });

  const kalimah = findWord(24, ["\u0643","\u0644","\u0645","\u0629"]);
  const shajarah = findWord(24, ["\u0634","\u062c","\u0631","\u0629"]);
  if (kalimah) e.terminology.push({ term: kalimah, transliteration: "kalimah", gloss: "word/statement (editorial gloss)", keys: ["14:24"] });
  if (shajarah) e.terminology.push({ term: shajarah, transliteration: "shajarah", gloss: "tree (editorial gloss)", keys: ["14:24"] });
}

// P2 (14:28-52)
{
  const e = extractions[1];
  const samee = findWord(39, ["\u0633","\u0645","\u064a","\u0639"]);
  const jabbar = findWord(47, ["\u062c","\u0628","\u0627","\u0631"]);
  const muntaqim = findWord(47, ["\u0645","\u0646","\u062a","\u0642","\u0645"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee", gloss: "All-Hearing (editorial gloss)", keys: ["14:39"] });
  if (jabbar) e.divineNamesAndAttributes.push({ term: jabbar, transliteration: "Jabbar", gloss: "Compeller/Mighty (editorial gloss)", keys: ["14:47"] });
  if (muntaqim) e.divineNamesAndAttributes.push({ term: muntaqim, transliteration: "Muntaqim", gloss: "Owner of Retribution (editorial gloss)", keys: ["14:47"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["14:31"], excerpt: fv(31), description: "Tell My servants who have believed to establish prayer and spend from what We provided secretly and publicly before Day of no trade or friendship." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["14:35","14:36","14:37","14:38","14:39","14:40","14:41"], excerpt: fv(35), description: "Abraham's comprehensive supplication: Make this city secure, protect my sons from idol worship, make me establisher of prayer and my descendants, accept my supplication, forgive me and my parents and believers on Judgment Day." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["14:52"], excerpt: fv(52), description: "This Quran is notification for people that they may be warned and know He is one God and that people of understanding may be reminded." });

  e.propheticNarratives.push({ label: "Abraham's Mecca supplication cycle: security for sacred city, monotheism protection for descendants, prayer establishment, provision-gratitude linkage, intercession for all believers", keys: ["14:35","14:36","14:37","14:38","14:39","14:40","14:41"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Uncountable divine favors contrasted with human injustice and ingratitude", keys: ["14:34"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wrongdoer delusion on Judgment Day requesting brief delay despite prior opportunity", keys: ["14:44"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Eschatological horror: racing ahead heads raised glances not returning hearts void", keys: ["14:43"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Trade and friendship impossibility on Judgment Day establishing temporal boundary for economic-social relations", keys: ["14:31"], evidenceClass: "EXPLICIT_TEXT" });

  const salah = findWord(31, ["\u0635","\u0644","\u0627","\u0629"]);
  if (salah) e.terminology.push({ term: salah, transliteration: "salah", gloss: "prayer (editorial gloss)", keys: ["14:31"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `014-ibrahim-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 014-ibrahim-p${num}.json`);
}

// === CANDIDATES (cand-0587..cand-0606, 20 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-014-p1,ext-014-p2",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0587..0596)
  { id: "cand-0587", label: "Quran as Book bringing humanity from darkness to light", def: "In 14:1: A Book We revealed to you that you might bring mankind out of darknesses into the light by permission of their Lord.", key: "14:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Min al-zulumat ila al-nur as Quranic function."}] },
  { id: "cand-0588", label: "Prophetic mission in native language ensuring clarity", def: "In 14:4: We did not send any messenger except in the language of his people to state clearly for them.", key: "14:4", overlap: [{topicId:"prophet-vs-messenger",layer:"scholarly",relationship:"related-not-identical",note:"Linguistic accessibility as prophetic principle."},{topicId:"quranic-vocabulary",layer:"scholarly",relationship:"related-not-identical",note:"Language-specific revelation."}] },
  { id: "cand-0589", label: "Gratitude-ingratitude principle as divine law of increase and punishment", def: "In 14:7: Your Lord proclaimed if you are grateful I will surely increase you but if you deny indeed My punishment is severe.", key: "14:7", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"La'in shakartum la'azidannakum as conditional divine law."},{topicId:"shukr-gratitude",layer:"scholarly",relationship:"same-concept",note:"Shukr linked to ziyadah."}] },
  { id: "cand-0590", label: "Messenger humanity affirmed while divine favor distinguished", def: "In 14:11: Their messengers said we are only men like you but Allah confers favor upon whom He wills of His servants.", key: "14:11", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Bashar mithlukum with divine distinction."}] },
  { id: "cand-0591", label: "Historical destruction pattern through Nuh Aad Thamud sequence", def: "In 14:9: Has there not reached you news of those before you people of Nuh and Aad and Thamud and those after them? None knows them except Allah.", key: "14:9", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Repeated pattern of rejection-destruction."},{topicId:"divine-wrath",layer:"scholarly",relationship:"related-not-identical",note:"Collective punishment following persistent denial."}] },
  { id: "cand-0592", label: "Disbelief metaphor as ashes scattered by storm wind", def: "In 14:18: Example of those who disbelieve their deeds are like ashes which wind blows forcefully on stormy day unable to keep anything earned.", key: "14:18", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Amthal as pedagogical device."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Futility of godless action."}] },
  { id: "cand-0593", label: "Good word-good tree parable with firm root and perpetual fruit", def: "In 14:24-25: Allah presents example good word like good tree root firmly fixed branches in sky producing fruit all the time by permission of its Lord.", key: "14:24", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Kalimah tayyibah as moral foundation."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Botanical metaphor for spiritual reality."}] },
  { id: "cand-0594", label: "Bad word-bad tree uprooted without stability", def: "In 14:26: Example of bad word like bad tree uprooted from surface of earth having no stability.", key: "14:26", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Kalimah khabithah as rootless falsehood."}] },
  { id: "cand-0595", label: "Divine firmness for believers through steadfast word in both worlds", def: "In 14:27: Allah keeps firm those who believe with the firm word in worldly life and Hereafter; Allah sends astray wrongdoers.", key: "14:27", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Al-qawl al-thabit as divine stabilization."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Thabat as fruit of iman."}] },
  { id: "cand-0596", label: "Satan's post-judgment confession of powerlessness", def: "In 14:22: Satan says when matter concluded Allah promised you promise of truth I promised but betrayed you had no authority over you except invitation.", key: "14:22", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Iblis admits limited power."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual responsibility confirmed by enemy testimony."}] },

  // P2 (cand-0597..0606)
  { id: "cand-0597", label: "Favor-for-disbelief exchange resulting in hellish settlement", def: "In 14:28-29: Those who exchanged favor of Allah for disbelief and settled their people in home of ruin — Hell which they burn wretched settlement.", key: "14:28", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Tabdil al-ni'mah as ultimate ingratitude."},{topicId:"jahannam-description",layer:"scholarly",relationship:"related-not-identical",note:"Dar al-halak as destination."}] },
  { id: "cand-0598", label: "Prayer-spending command as believer identity before tradeless Day", def: "In 14:31: Tell My servants who believed establish prayer spend from what We provided secretly publicly before Day no trade nor friendship.", key: "14:31", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Salah as primary believer marker."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Infaq as secondary marker."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Temporal boundary for economic relations."}] },
  { id: "cand-0599", label: "Uncountable divine favors contrasted with human ingratitude", def: "In 14:34: He gave you from all you asked; if you count favor of Allah you cannot enumerate it; indeed mankind is most unjust ungrateful.", key: "14:34", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Enumeration impossibility proving infinite ni'mah."},{topicId:"human-dignity",layer:"scholarly",relationship:"related-not-identical",note:"Zalum kafur as fallen state."}] },
  { id: "cand-0600", label: "Abraham's Mecca supplication for security and monotheism", def: "In 14:35-37: Abraham said My Lord make this city secure keep me and sons from worshipping idols; settled descendants in uncultivated valley near sacred House to establish prayer.", key: "14:35", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Model dua combining temporal and spiritual requests."},{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Ibrahim's foundational prayer for Ummah."},{topicId:"tawheed",layer:"curated",relationship:"related-not-identical",note:"Protection from shirk as primary concern."}] },
  { id: "cand-0601", label: "Intercessory prayer for parents and all believers on Judgment Day", def: "In 14:41: Our Lord forgive me and my parents and the believers the Day the account is established.", key: "14:41", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Parental forgiveness in prophetic dua."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"related-not-identical",note:"Universal believer intercession."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Yawm al-hisab as intercession context."}] },
  { id: "cand-0602", label: "Wrongdoer delusion exposed through delayed punishment", def: "In 14:42-44: Never think Allah unaware of wrongdoers He delays them for Day eyes stare horror; they say our Lord delay us brief term.", key: "14:42", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Divine awareness despite apparent delay."},{topicId:"patience-haste",layer:"scholarly",relationship:"related-not-identical",note:"Belated urgency vs prior opportunity."}] },
  { id: "cand-0603", label: "Earth-heaven replacement as cosmic transformation on Judgment Day", def: "In 14:48: On Day earth replaced by another earth and heavens all creatures come out before Allah One Prevailing.", key: "14:48", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Cosmic renewal as judgment precondition."},{topicId:"resurrection-process",layer:"scholarly",relationship:"related-not-identical",note:"Physical transformation accompanying spiritual reckoning."}] },
  { id: "cand-0604", label: "Criminal binding and pitch-garment punishment imagery", def: "In 14:49-50: You see criminals that Day bound together in shackles their garments of liquid pitch faces covered by Fire.", key: "14:49", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Qatran garments and facial fire coverage."},{topicId:"justice-oppression",layer:"scholarly",relationship:"related-not-identical",note:"Visual punishment manifestation."}] },
  { id: "cand-0605", label: "Creation-provision catalog demonstrating uncountable favors", def: "In 14:32-33: Allah created heavens earth sent rain produced fruits subjected sun moon continuous night day ships rivers.", key: "14:32", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Comprehensive ni'mah inventory."},{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"Taskhir as ongoing divine sustenance."}] },
  { id: "cand-0606", label: "Closing tawheed affirmation and mindfulness command", def: "In 14:52: This is notification for people warned thereby know He is one God and people of understanding reminded.", key: "14:52", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Ilah wahid as closing affirmation."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Ulu al-albab as intended audience."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 2 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `014-ibrahim-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-038.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-038.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
