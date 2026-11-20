// MFD-11 Wave 7: Surah 45 (Al-Jathiyah) genuine re-extraction.
// Covers 45:1-37 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "045-0001-0037.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 45:${n} not found`);
  return verses[n];
}

function findWord(vid, chars) {
  const t = fv(vid);
  for (const w of t.split(/\s+/)) {
    let match = true;
    for (const ch of chars) { if (!w.includes(ch)) { match = false; break; } }
    if (match) return w;
  }
  return null;
}

console.log("Generating Surah 45 (Al-Jathiyah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T16:00:00.000Z";

const PASSAGES = [
  { id: "ext-045-p1", from: 1, to: 11,
    label: "Ha-Meem; revelation from Allah Exalted Might Wise; heavens earth signs believers; creation yourselves dispersed moving creatures signs certain; alternation night day provision sky gives life earth directing winds signs reason; verses Allah recited truth what statement after Allah verses believe; woe sinful liar; hears verses persists arrogantly as if not heard tidings painful punishment; knows anything verses takes ridicule humiliating punishment; before them Hell earned not avail taken besides Allah allies great punishment; Quran guidance disbelieved verses Lord painful punishment foul nature",
    mainLabel: "Opening letters and the Book's origin in the Mighty Wise; five cosmic and human signs enumerated for believers, the certain and those who reason — heavens and earth, self-creation and dispersed creatures, night-day alternation, sky-provision reviving dead earth, and wind-direction; these declared Allah's verses recited in truth with the challenge of what post-divine statement they will believe; woe pronounced on every sinful liar who hears verses yet persists arrogantly or ridicules known portions, earning painful and humiliating punishment; Hell positioned ahead while earnings and adopted allies prove useless against great punishment; the Quran named guidance while disbelievers face a foul-natured painful penalty" },
  { id: "ext-045-p2", from: 12, to: 22,
    label: "Allah subjected sea ships sail command seek bounty perhaps grateful; subjected whatever heavens earth all from Him signs give thought; say Muhammad believed forgive expect not days Allah recompense people earned; whoever good deed himself whoever evil against self returned Lord; gave Children Israel Scripture judgement prophethood provided good things preferred over worlds; gave clear proofs matter differed except after knowledge jealous animosity Lord judge Resurrection concerning differ; put Muhammad ordained way concerning matter follow it not follow inclinations know not; never avail against Allah wrongdoers allies one another Allah protector righteous; Quran enlightenment mankind guidance mercy certain; commit evils think make like believed done righteous equal life death evil judge; created heavens earth truth soul recompensed earned not wronged",
    mainLabel: "The sea subjected for shipping by divine command to seek bounty prompting gratitude; everything in heavens and earth likewise subjected as signs for thinkers; believers commanded to forgive those expecting no divine days so that recompense remains with Allah; individual deeds returning upon the doer before the Lord; Israel granted Scripture, judgement, prophethood, good provision and world-preference, plus clear proofs, yet differing only after knowledge through jealous animosity with judgement deferred to Resurrection; the Prophet placed on an ordained way commanded to follow it and refuse ignorant inclinations; their inability to avail against Allah affirmed while wrongdoers ally each other and Allah protects the righteous; the Quran named enlightenment, guidance and mercy for the certain; evildoers' assumption of equality with believing doers condemned as evil judgement; creation in truth ensuring exact recompense without wrong" },
  { id: "ext-045-p3", from: 23, to: 37,
    label: "taken god desire Allah sent astray knowledge sealed hearing heart veiled vision who guide after Allah reminded; say not but worldly life die live nothing destroys time no knowledge assuming; verses recited clear evidences argument bring forefathers truthful; say Allah causes live causes die assemble Resurrection no doubt most not know; Allah dominion heavens earth Day Hour appears falsifiers lose; see every nation kneeling called record today recompensed used do; record speaks truth transcribed used do; believed righteous Lord admit mercy clear attainment; disbelieved were verses recited arrogant criminals; said promise Allah truth Hour no doubt said know not Hour assume assumption not convinced; evil consequences appeared enveloped used ridicule; said today forget forgot meeting Day refuge Fire no helpers; took verses ridicule worldly life deluded Day not removed nor asked appease; Allah belongs praise Lord heavens Lord earth Lord worlds; Him belongs grandeur within heavens earth Exalted Might Wise",
    mainLabel: "Desire taken as deity answered by divine misguidance based on knowledge, with hearing sealed, heart sealed and vision veiled, leaving no post-divine guide and inviting remembrance; materialist reduction of existence to worldly life and time-destruction exposed as baseless assumption; the demand to produce forefathers countered by Allah's control of life, death and Resurrection assembly beyond doubt though most are ignorant; divine dominion affirmed with the Hour's appearance bringing falsifier loss; every nation seen kneeling and summoned to its record which speaks truthfully through transcription; believing doers admitted to mercy as clear attainment while disbelievers confronted with their prior arrogance and criminality; their dismissal of the Hour as mere assumption recalled; evil consequences surfacing and ridicule enveloping them; reciprocal forgetting declared — as they forgot this Day's meeting, they are forgotten into the Fire without helpers or appeasement; cause identified as taking verses in ridicule while worldly life deluded; closing praise belonging to Allah as Lord of heavens, earth and worlds with all grandeur His as the Mighty Wise" }
];

const SUB_LABELS = {
  "ext-045-p1": [
    "Al-Jathiyah opens with the Ha-Meem pair shared by this surah group",
    "The Book's revelation traced to Allah, the Exalted in Might, the Wise",
    "Signs within the heavens and earth designated for believers",
    "Signs in self-creation and dispersed moving creatures designated for the certain",
    "Signs in night-day alternation, sky-provision reviving dead earth and wind-direction designated for those who reason",
    "These declared Allah's verses recited in truth, challenging what post-divine statement they would believe",
    "Woe pronounced upon every sinful liar",
    "One who hears verses yet persists arrogantly as if he had not heard them, given tidings of painful punishment",
    "One who learns of Our verses and takes them in ridicule assigned a humiliating punishment",
    "Hell positioned ahead while earnings and adopted allies fail to avail, with great punishment awaiting",
    "The Quran named guidance while disbelievers in their Lord's verses face a foul-natured painful penalty"
  ],
  "ext-045-p2": [
    "The sea subjected for ships to sail by divine command, enabling bounty-seeking and prompting gratitude",
    "Everything in heavens and earth subjected as signs for a thinking people",
    "Believers instructed to forgive those expecting no divine days so that recompense remains Allah's prerogative",
    "Good deeds benefiting and evil deeds harming the doer alone, with return to the Lord affirmed",
    "Israel granted Scripture, judgement, prophethood, good provision and preference over the worlds",
    "Clear proofs given to them yet they differed only after knowledge arrived, driven by jealous animosity, with judgement deferred to Resurrection",
    "The Prophet placed on an ordained way concerning the matter and commanded to follow it rather than ignorant inclinations",
    "Their inability to avail against Allah affirmed while wrongdoers ally one another and Allah protects the righteous",
    "The Quran described as enlightenment for mankind and guidance and mercy for the certain",
    "Evildoers' assumption of equality with believing doers in life and death condemned as evil judgement",
    "Creation of heavens and earth in truth ensuring every soul is recompensed without wrong"
  ],
  "ext-045-p3": [
    "Desire taken as deity answered by divine misguidance based on knowledge, with hearing, heart and vision sealed",
    "The rhetorical question of who guides after Allah, followed by the invitation to be reminded",
    "Materialist claim reducing existence to worldly life and time-based destruction exposed as assumption without knowledge",
    "Their sole argument when verses are recited as clear evidences reduced to demanding the return of forefathers",
    "Allah named as causing life and death then assembling for the undoubted Resurrection, though most do not know",
    "Divine dominion over heavens and earth affirmed, with the Hour's appearance bringing falsifier loss",
    "Every nation seen kneeling and summoned to its record for recompense of past deeds",
    "The record speaking truthfully about them because everything was being transcribed",
    "Believing doers admitted to their Lord's mercy as the clear attainment",
    "Disbelievers confronted with the reminder that verses were recited but they chose arrogance and criminality",
    "Their dismissal of the Hour as unknown and merely assumed recalled against them",
    "Evil consequences of their deeds appearing and the ridicule they practised now enveloping them",
    "Reciprocal forgetting declared: as they forgot this Day's meeting, they are abandoned to the Fire without helpers",
    "Cause identified as taking verses in ridicule while worldly life deluded, preventing removal or appeasement",
    "All praise and grandeur belonging to Allah as Lord of the heavens, earth and worlds, the Exalted in Might, the Wise"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`45:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`45:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 45, surahName: "Al-Jathiyah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 7 genuine re-extraction. Boundaries follow the text: P1 closes with the foul-natured punishment declaration (11) before the subjection-and-forgiveness block opens (12); P2 ends with the truth-based creation affirmation (22) before the desire-as-god critique begins (23); P3 runs from that critique through the kneeling nations, record, reciprocal forgetting and the closing praise (23-37).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (45:1-11) ===
{
  const e = extractions[0];
  const aziz = findWord(2, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(2, ["\u062d","\u0643","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["45:2"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["45:2"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Persistent arrogance upon hearing verses as if they had not been heard", keys: ["45:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Ridicule directed at known portions of the divine verses", keys: ["45:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Five categories of signs addressed to believers, the certain and those who reason", keys: ["45:3","45:4","45:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Earnings and adopted allies declared unable to avail against Hell and great punishment", keys: ["45:10"], evidenceClass: "EXPLICIT_TEXT" });

  const jathiyah = findWord(28, ["\u062c","\u0627","\u062b"]);
  // jathiyah appears later but the root concept of kneeling defines the surah name
  const ayah = findWord(6, ["\u0622","\u064a","\u0627","\u062a"]);
  if (ayah) e.terminology.push({ term: ayah, transliteration: "ayat", gloss: "signs/verses (editorial gloss)", keys: ["45:6"] });
}

// === POPULATE P2 (45:12-22) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["45:14"], excerpt: fv(14), description: "Say to those who have believed that they should forgive those who expect not the days of Allah." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["45:18"], excerpt: fv(18), description: "Follow the ordained way concerning the matter and do not follow the inclinations of those who do not know." });

  e.humanConditionsAndSpiritualStates.push({ label: "Division arising after knowledge through jealous animosity, with judgement deferred to Resurrection", keys: ["45:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wrongdoers allying one another while Allah protects the righteous", keys: ["45:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Evildoers assuming equality with believing doers in life and death, condemned as evil judgement", keys: ["45:21"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Sea subjected for shipping by command to seek bounty, prompting gratitude", keys: ["45:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Israel granted Scripture, judgement, prophethood, good provision and world-preference", keys: ["45:16"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Forgiveness toward those expecting no divine days framed so that Allah may recompense them", keys: ["45:14","45:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The Quran named enlightenment, guidance and mercy for the certain", keys: ["45:20"], evidenceClass: "EXPLICIT_TEXT" });

  const shariah = findWord(18, ["\u0634","\u0631","\u064a"]);
  if (shariah) e.terminology.push({ term: shariah, transliteration: "shari'ah", gloss: "ordained way (editorial gloss)", keys: ["45:18"] });
  const baghy = findWord(17, ["\u0628","\u063a","\u064a"]);
  if (baghy) e.terminology.push({ term: baghy, transliteration: "baghy", gloss: "jealous animosity (editorial gloss)", keys: ["45:17"] });
}

// === POPULATE P3 (45:23-37) ===
{
  const e = extractions[2];
  const aleem = findWord(37, ["\u0639","\u0644","\u064a","\u0645"]);
  const aziz = findWord(37, ["\u0639","\u0632","\u064a","\u0632"]);
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["45:37"] });
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["45:37"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Desire taken as deity resulting in sealed hearing, heart and veiled vision by divine knowledge", keys: ["45:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Materialist reduction of existence to worldly life and time-destruction exposed as assumption", keys: ["45:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Demand to produce forefathers as sole argument against clear evidences", keys: ["45:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Dismissal of the Hour as unknown and merely assumed despite prior warning", keys: ["45:32"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Evil consequences surfacing and former ridicule enveloping them", keys: ["45:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Every nation kneeling and summoned to its transcribed record for exact recompense", keys: ["45:28","45:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "No guide remaining after Allah sends astray based on knowledge, inviting remembrance", keys: ["45:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Allah causing life and death then assembling for the undoubted Resurrection", keys: ["45:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Believing doers admitted to mercy as clear attainment against disbelievers' confrontation", keys: ["45:30","45:31"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Reciprocal forgetting: as they forgot the meeting, they are left in Fire without helpers or appeasement", keys: ["45:34","45:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Closing praise and grandeur belonging to Allah as Lord of all realms, Mighty and Wise", keys: ["45:36","45:37"], evidenceClass: "EXPLICIT_TEXT" });

  const hawa = findWord(23, ["\u0647","\u0648","\u0649"]);
  if (hawa) e.terminology.push({ term: hawa, transliteration: "hawa", gloss: "desire/caprice (editorial gloss)", keys: ["45:23"] });
  const dahr = findWord(24, ["\u062f","\u0647","\u0631"]);
  if (dahr) e.terminology.push({ term: dahr, transliteration: "dahr", gloss: "time/epoch (editorial gloss)", keys: ["45:24"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `045-al-jathiyah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 045-al-jathiyah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-045-p1,ext-045-p2,ext-045-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1536", label: "Five categories of signs addressed to believers, the certain and those who reason", def: "In 45:3-5: Indeed within the heavens and earth are signs for the believers; and in the creation of yourselves and what He disperses of moving creatures are signs for people who are certain; and in the alternation of night and day and what Allah sends down from the sky of provision giving life to the earth and directing the winds are signs for a people who reason.", key: "45:3", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Three recipient classes matched to sign types."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Yaqin and ta'aqqul distinguished."}] },
  { id: "cand-1537", label: "Challenge of what post-divine statement they would believe", def: "In 45:6: These are the verses of Allah which We recite to you in truth; then in what statement after Allah and His verses will they believe?", key: "45:6", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq recitation."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Hadith after Allah exhausted."}] },
  { id: "cand-1538", label: "Arrogant persistence and ridicule upon hearing divine verses", def: "In 45:8-9: Who hears the verses of Allah recited to him then persists arrogantly as if he had not heard them; and when he knows anything of Our verses he takes them in ridicule; those will have a humiliating punishment.", key: "45:8", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Istikbar with istighna posture."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Ridicule as character failure."}] },
  { id: "cand-1539", label: "Earnings and allies failing to avail against Hell", def: "In 45:10: Before them is Hell, and what they had earned will not avail them at all nor what they had taken besides Allah as allies, and they will have a great punishment.", key: "45:10", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Jahim positioned ahead."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Awliya powerless."}] },

  { id: "cand-1540", label: "Believers commanded to forgive those expecting no divine days", def: "In 45:14: Say to those who have believed that they should forgive those who expect not the days of Allah so that He may recompense a people for what they used to earn.", key: "45:14", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Forgiveness as communal ethic."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Recompense reserved to Allah."}] },
  { id: "cand-1541", label: "Individual deeds returning upon the doer before the Lord", def: "In 45:15: Whoever does a good deed it is for himself and whoever does evil it is against the self; then to your Lord you will be returned.", key: "45:15", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Nafs as beneficiary and victim."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Return framing."}] },
  { id: "cand-1542", label: "Israel's endowment and division through jealous animosity after knowledge", def: "In 45:16-17: We gave the Children of Israel the Scripture and judgement and prophethood and provided them with good things and preferred them over the worlds, and gave them clear proofs; and they did not differ except after knowledge had come to them out of jealous animosity between themselves.", key: "45:16", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Comprehensive endowment listed."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Baghy after ilm diagnosed."}] },
  { id: "cand-1543", label: "Ordained way commanded against ignorant inclinations", def: "In 45:18: Then We put you on an ordained way concerning the matter; so follow it and do not follow the inclinations of those who do not know.", key: "45:18", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Shari'ah as ordained path."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Ahwa al-jahilin rejected."}] },
  { id: "cand-1544", label: "Quran as enlightenment, guidance and mercy for the certain", def: "In 45:20: This is enlightenment for mankind and guidance and mercy for a people who are certain in faith.", key: "45:20", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Basa'ir triple function."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Rahmah conditioned on yaqin."}] },
  { id: "cand-1545", label: "Evildoers' equality assumption condemned as evil judgement", def: "In 45:21: Or do those who commit evils think We will make them like those who have believed and done righteous deeds, equal in their life and their death? Evil is that which they judge.", key: "45:21", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Inequality of moral states affirmed."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Sa'a yahkumun verdict."}] },

  { id: "cand-1546", label: "Desire taken as deity producing sealed faculties by divine knowledge", def: "In 45:23: Have you seen he who has taken as his god his own desire, and Allah has sent him astray due to knowledge and has set a seal upon his hearing and his heart and put over his vision a veil?", key: "45:23", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Hawa as ilah."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Idlal ala ilm."}] },
  { id: "cand-1547", label: "Materialist worldview exposed as assumption without knowledge", def: "In 45:24: And they say there is not but our worldly life, we die and live and nothing destroys us except time; and they have of that no knowledge, they are only assuming.", key: "45:24", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Zann versus ilm."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Dahri denial."}] },
  { id: "cand-1548", label: "Forefather-production demand answered by divine life-death-resurrection control", def: "In 45:25-26: When Our verses are recited as clear evidences their argument is only bring back our forefathers if you are truthful; say Allah causes you to live then causes you to die then He will assemble you for the Day of Resurrection about which there is no doubt.", key: "45:25", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Impossible demand refuted."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Life-death-assembly sequence."}] },
  { id: "cand-1549", label: "Every nation kneeling before its transcribed record", def: "In 45:28-29: You will see every nation kneeling; every nation will be called to its record, today you will be recompensed for what you used to do; this Our record speaks about you in truth, indeed We were having transcribed whatever you used to do.", key: "45:28", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Jathiyah posture and kitab."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Transcription as evidence basis."}] },
  { id: "cand-1550", label: "Reciprocal forgetting: abandoning the meeting earns abandonment to Fire", def: "In 45:34-35: It will be said today We will forget you as you forgot the meeting of this Day of yours, and your refuge is the Fire and for you there are no helpers; that is because you took the verses of Allah in ridicule and worldly life deluded you, so that Day they will not be removed nor asked to appease.", key: "45:34", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Nasiya-nansakum symmetry."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Appeasement refused."}] },
  { id: "cand-1551", label: "Closing praise and grandeur belonging exclusively to Allah", def: "In 45:36-37: Then to Allah belongs all praise, Lord of the heavens and Lord of the earth, Lord of the worlds; and to Him belongs all grandeur within the heavens and the earth, and He is the Exalted in Might, the Wise.", key: "45:36", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Hamd and kibriya exclusivity."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Aziz Hakeem closure."}] }
];

function citedKeys(def) {
  const m = def.match(/\bIn\s+(\d+):(\d+)(?:\s*[-\u2013]\s*(\d+))?/i);
  if (!m) return null;
  const s = Number(m[1]);
  const from = Number(m[2]);
  const to = m[3] ? Number(m[3]) : from;
  const out = [];
  for (let a = from; a <= to; a++) out.push(`${s}:${a}`);
  return out;
}

for (const cd of CAND_DEFS) {
  const keys = citedKeys(cd.def) || [cd.key];
  if (!keys.includes(cd.key)) keys.push(cd.key);
  const evidence = keys.map(k => ({
    key: k,
    excerpt: fv(Number(k.split(":")[1])),
    evidenceClass: "EXPLICIT_TEXT",
    rationale: "Full verse text as evidence for the cited span."
  }));
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence,
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 7 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 10).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(10, 16).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `045-al-jathiyah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-069.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-069.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");