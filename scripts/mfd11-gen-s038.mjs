// MFD-11 Wave 6: Surah 38 (Sad) genuine re-extraction.
// Covers 38:1-88 in 5 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "038-0001-0088.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 38:${n} not found`);
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

console.log("Generating Surah 38 (Sad) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T15:15:00.000Z";

const PASSAGES = [
  { id: "ext-038-p1", from: 1, to: 16,
    label: "Sad; oath by the Quran containing reminder; disbelievers in pride and dissension; prior generations destroyed crying out when escape had passed; wonder at a warner from among themselves called magician and liar; objection to making the gods one God; the eminent urging persistence over their gods and calling it a thing intended; claim of never hearing this in the latest religion and calling it fabrication; question whether the message was singled out for him; correction that they doubt the message and have not tasted the penalty; challenge on possessing the treasuries of mercy or the dominion of heavens and earth; defeated companies; Nuh, Aad, Pharaoh of the stakes, Thamud, the people of Lut and the companions of the thicket each denying so the penalty was justified; awaiting one blast with no delay; their demand to hasten their share before the Day of Account",
    mainLabel: "Oath by Sad and the dhikr-bearing Quran answered by pride and dissension; destroyed generations whose outcry came after the time of escape; rejection of a warner from among themselves as magician and liar; tawheed treated as a curious innovation and defended against by the elite in the name of ancestral religion; the singling-out objection answered by their doubt and untasted penalty; the treasury and dominion challenges exposing their lack of authority; a catalogue of denying communities whose penalty was justified; the single undelayed blast set against their impatient demand for punishment before the Day of Account" },
  { id: "ext-038-p2", from: 17, to: 29,
    label: "Patience over what they say and remembrance of Dawud possessor of strength repeatedly turning back; mountains subjected to exalt with him at afternoon and sunrise; birds assembled repeating with him; kingdom strengthened with wisdom and discernment in speech; the adversaries climbing the prayer-chamber wall alarming him; two litigants asking judgement in truth without excess and guidance to the sound path; the ninety-nine ewes against one ewe and overpowering in speech; his verdict of wrongdoing, the oppression of associates except the believing doers of good who are few; his certainty of being tried, seeking forgiveness, falling bowing and turning; forgiveness with nearness and a good return; appointment as successor commanded to judge in truth and not follow desire which leads astray with severe punishment for forgetting the Day of Account; heaven and earth not created aimlessly, that being the disbelievers' assumption bringing woe from the Fire; refusal to treat believers like corrupters or the God-fearing like the wicked; a blessed Book revealed for reflection and reminder to those of understanding",
    mainLabel: "Patience commanded alongside remembrance of Dawud as possessor of strength and repeated return; mountains and birds joined in his glorification at fixed times; kingdom reinforced by wisdom and decisive speech; the chamber-wall intrusion of two litigants presenting the ewe dispute; his verdict naming associate oppression with the believing exception, followed by recognition of the trial, forgiveness-seeking, prostration and repentance; divine pardon granting nearness and good return; the khilafah charge to judge in truth and refuse desire, with severe punishment tied to forgetting the Day of Account; creation declared purposeful against the disbelievers' aimlessness assumption; categorical refusal to equate believers with corrupters; the blessed Book given for tadabbur and reminder" },
  { id: "ext-038-p3", from: 30, to: 48,
    label: "Sulayman given to Dawud as an excellent servant repeatedly turning back; racehorses exhibited in the afternoon; his preference for love of good things over remembrance until the sun vanished behind the curtain; order to return them and striking of legs and necks; trial by a body placed on his throne and his return; supplication for forgiveness and a kingdom belonging to none after him; wind subjected blowing gently by his command wherever he directed; devils as builders and divers with others bound in shackles; the gift to grant or withhold without account; nearness and good return; Ayyub calling that Satan touched him with hardship and torment; the command to strike with his foot producing a cool bath and drink; family restored with a like number as mercy and reminder; the bunch of grass to strike with without breaking the oath, found patient and excellent; Ibrahim, Ishaq and Yaqub as possessors of strength and vision chosen for remembrance of the home; Ismail, Elisha and Dhul-Kifl among the outstanding",
    mainLabel: "Sulayman granted to Dawud and praised as an excellent returning servant; the afternoon horse display and his admission of preferring good things over dhikr until sunset; the return order and striking of legs and necks; the throne-body trial followed by his turning; the supplication for forgiveness and an unrepeatable kingdom answered by subjection of wind and of builder and diver devils with others shackled, and licence to give or withhold without account; Ayyub's affliction call answered by the foot-strike spring, restored family doubled as mercy, and the grass-bunch concession preserving his oath while confirming his patience; Ibrahim, Ishaq and Yaqub distinguished by strength, vision and exclusive remembrance of the Hereafter; Ismail, Elisha and Dhul-Kifl counted among the outstanding" },
  { id: "ext-038-p4", from: 49, to: 64,
    label: "This is a reminder and for the righteous a good return; gardens of perpetual residence with doors opened; reclining and calling for abundant fruit and drink; glance-restricting companions of equal age; the promise for the Day of Account; provision without depletion; for the transgressors an evil return, Hell they will burn in, a wretched resting place; scalding water and purulence to taste with other punishments of its kind; a company bursting in unwelcomed and burning; the retort blaming the leaders who brought this upon them; the plea for double punishment on whoever caused it; questioning why the men they counted among the worst are unseen, whether taken in ridicule or missed by their sight; the truth of the quarrelling of the people of the Fire",
    mainLabel: "Reminder framing the two returns: gardens of perpetual residence with opened doors, reclining ease, abundant fruit and drink, matched-age glance-restricted companions, and inexhaustible provision promised for the Day of Account; against this the transgressors' evil return into Hell with scalding water, purulence and kindred punishments; the incoming company denied welcome and the mutual recrimination between followers and leaders; the plea for doubled punishment on the instigators; the search for those they once mocked and counted among the worst; the whole named as the truth of the Fire-dwellers' quarrelling" },
  { id: "ext-038-p5", from: 65, to: 88,
    label: "Say I am only a warner and there is no deity except Allah the One the Prevailing, Lord of heavens earth and between them the Exalted in Might the Perpetual Forgiver; say it is great news from which you turn away; no knowledge of the exalted assembly when they disputed, only revelation that I am a clear warner; the Lord telling the angels He will create a human from clay, and when proportioned and breathed into of His soul to fall in prostration; the angels prostrating all entirely except Iblees who was arrogant and became of the disbelievers; the question what prevented prostration to what was created with My hands, arrogance or haughtiness; his claim of fire over clay; expulsion from Paradise and curse until the Day of Recompense; the reprieve request until resurrection granted until the Day of the time well-known; his oath by divine might to mislead all except the chosen servants; the truth-oath that Hell will be filled with him and his followers together; no payment asked for the Quran and no pretension; it is but a reminder to the worlds and its information will be known after a time",
    mainLabel: "The Prophet's self-definition as warner only, paired with the confession of Allah as One and Prevailing, Lord of the cosmos, Mighty and Perpetually Forgiving; the message named great news turned away from; his disclaimer of independent knowledge of the angelic assembly, receiving only the warner commission; the creation announcement to the angels with the prostration command after proportioning and in-breathing; universal angelic prostration with Iblees excepted through arrogance; the interrogation of his refusal and his fire-over-clay claim; expulsion and curse to the Day of Recompense; reprieve granted to a known appointed day; his oath to mislead all but the chosen servants answered by the divine truth-oath filling Hell with him and his followers; closing disavowal of payment and pretension, the Quran as reminder to the worlds whose news will be verified after a time" }
];

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-038-p1": [
    "Oath by the letter Sad and the Quran that carries reminder",
    "Disbelievers described as standing in pride and dissension",
    "Prior generations destroyed whose outcry came when escape was no longer possible",
    "Astonishment at a warner arising from among themselves, dismissed as magician and liar",
    "Objection to the reduction of the gods to one God as a curious matter",
    "The eminent urging persistence in defending their gods and alleging an intended design",
    "Claim that this teaching is unheard of in the latest religion and is fabrication",
    "Question whether the message was singled out for him, answered by their doubt and untasted penalty",
    "Challenge whether they hold the treasuries of the mercy of the Mighty Bestower",
    "Challenge whether the dominion of heavens and earth is theirs, with the invitation to ascend by any access",
    "Prediction that they are but defeated soldiers among the companies of disbelievers",
    "Denial by the people of Nuh, Aad and Pharaoh the owner of stakes",
    "Denial by Thamud, the people of Lut and the companions of the thicket, named as the companies",
    "Each company's denial of the messengers making the penalty justified",
    "Their awaiting a single blast of the Horn admitting no delay",
    "Their demand that their share of punishment be hastened before the Day of Account"
  ],
  "ext-038-p2": [
    "Command to be patient over their words and remember Dawud, possessor of strength and repeated return",
    "Mountains subjected to exalt Allah with him in the late afternoon and after sunrise",
    "Birds assembled, all repeating praise along with him",
    "His kingdom strengthened and wisdom with discernment in speech granted",
    "Report of the adversaries climbing over the wall of his prayer chamber",
    "Their entry alarming him, their reassurance, and their request for truthful judgement guiding to the sound path",
    "The complaint of ninety-nine ewes against one, with the demand to entrust her and overpowering speech",
    "His verdict of wrongdoing, the oppression among associates except the few believing doers of good, his certainty of trial, forgiveness-seeking, bowing and repentance",
    "Forgiveness granted with nearness to Allah and a good place of return",
    "Appointment as successor on earth with the charge to judge in truth, refuse desire, and the severe punishment for forgetting the Day of Account",
    "Denial that heaven and earth were created aimlessly, that assumption assigned to disbelievers with woe from the Fire",
    "Refusal to treat believing doers of good like corrupters, or the God-fearing like the wicked",
    "The blessed Book revealed for reflection on its verses and reminder to those of understanding"
  ],
  "ext-038-p3": [
    "Sulayman given to Dawud, praised as an excellent servant repeatedly turning back",
    "Poised racehorses exhibited before him in the afternoon",
    "His admission of preferring love of good things over remembrance of his Lord until sunset",
    "His order to return them and his striking of their legs and necks",
    "His trial through a body placed upon his throne, followed by his return",
    "His supplication for forgiveness and a kingdom belonging to no one after him",
    "Wind subjected to blow gently by his command wherever he directed",
    "Devils subjected as every builder and diver",
    "Others of them bound together in shackles",
    "The gift declared free to grant or withhold without account",
    "Nearness to Allah and a good place of return affirmed for him",
    "Ayyub's call that Satan has touched him with hardship and torment",
    "The command to strike with his foot producing a cool bath and drink",
    "His family granted with a like number as mercy and reminder for those of understanding",
    "The bunch of grass to strike with without breaking his oath, with his patience and excellence affirmed",
    "Ibrahim, Ishaq and Yaqub remembered as possessors of strength and religious vision",
    "Their selection for the exclusive quality of remembering the home of the Hereafter",
    "Their standing among the chosen and outstanding",
    "Ismail, Elisha and Dhul-Kifl remembered, all among the outstanding"
  ],
  "ext-038-p4": [
    "The surah named a reminder, with a good place of return for the righteous",
    "Gardens of perpetual residence whose doors are opened to them",
    "Reclining within and calling for abundant fruit and drink",
    "Companions restricting their glances and matched in age",
    "This state identified as the promise for the Day of Account",
    "The provision declared inexhaustible",
    "An evil place of return assigned to the transgressors",
    "Hell named as their burning place and a wretched resting place",
    "Scalding water and purulence offered for them to taste",
    "Further punishments of the same type in various kinds",
    "An incoming company denied welcome and destined to burn",
    "The retort denying welcome to the leaders who brought this upon them",
    "The plea for double punishment on whoever caused their ruin",
    "Their question why the men they counted among the worst are not seen",
    "Their uncertainty whether they ridiculed them or their sight turned away",
    "The quarrelling of the people of the Fire affirmed as truth"
  ],
  "ext-038-p5": [
    "Declaration of being only a warner, with no deity except Allah the One the Prevailing",
    "His lordship over heavens, earth and what lies between, as Mighty and Perpetual Forgiver",
    "The message named great news",
    "Their turning away from that news",
    "Disclaimer of knowledge of the exalted assembly during their dispute",
    "Restriction of what is revealed to him to being a clear warner",
    "The announcement to the angels of creating a human being from clay",
    "The command to prostrate once he is proportioned and breathed into of the created soul",
    "The angels prostrating, all of them entirely",
    "Iblees excepted, arrogant and counted among the disbelievers",
    "The question what prevented prostration to what was created with divine hands, arrogance or haughtiness",
    "His claim of superiority through fire origin against clay origin",
    "The expulsion order removing him from Paradise",
    "The curse placed upon him until the Day of Recompense",
    "His request for reprieve until the Day of resurrection",
    "The grant of reprieve",
    "Its limit set at the Day of the time well-known",
    "His oath by divine might to mislead them all",
    "The exception of the chosen servants among them",
    "The divine oath affirming the truth of what is said",
    "The declaration that Hell will be filled with him and his followers together",
    "Disavowal of asking payment for the Quran and of pretension",
    "The Quran identified as nothing but a reminder to the worlds",
    "Assurance that its information will be known after a time"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`38:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`38:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 38, surahName: "Sad",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 6 genuine re-extraction. Boundaries follow the text: P1 ends at the punishment-hastening demand (16) before the patience command opens the Dawud block (17); P2 closes with the blessed-Book reflection verse (29); P3 groups the Sulayman, Ayyub and patriarch remembrance sequence (30-48); P4 is the two-returns contrast ending with the Fire quarrel (49-64); P5 begins with the warner-only declaration and runs through the Adam-Iblees narrative to the closing reminder (65-88).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (38:1-16) ===
{
  const e = extractions[0];
  const aziz = findWord(9, ["\u0639","\u0632","\u064a","\u0632"]);
  const wahhab = findWord(9, ["\u0648","\u0647","\u0627","\u0628"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["38:9"] });
  if (wahhab) e.divineNamesAndAttributes.push({ term: wahhab, transliteration: "Wahhab", gloss: "Bestower (editorial gloss)", keys: ["38:9"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Pride and dissension as the standing condition of those who disbelieve", keys: ["38:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Outcry raised only after the time of escape has passed", keys: ["38:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Tawheed received as a curious novelty and defended against in the name of the latest religion", keys: ["38:5","38:6","38:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Doubt about the message coupled with not yet having tasted the penalty", keys: ["38:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Mercy treasuries and cosmic dominion challenged as possessions they do not hold", keys: ["38:9","38:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Every denying company's rejection of messengers making the divine penalty justified", keys: ["38:12","38:13","38:14"], evidenceClass: "EXPLICIT_TEXT" });

  const sad = findWord(1, ["\u0635"]);
  if (sad) e.terminology.push({ term: sad, transliteration: "Sad", gloss: "disjointed letter opening the surah (editorial gloss)", keys: ["38:1"] });
}

// === POPULATE P2 (38:17-29) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["38:17"], excerpt: fv(17), description: "Be patient over what they say and remember Our servant David, possessor of strength, who repeatedly turned back." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["38:26"], excerpt: fv(26), description: "O David, We made you a successor on earth, so judge between people in truth." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["38:26"], excerpt: fv(26), description: "Do not follow desire, as it will lead you astray from the way of Allah." });

  e.propheticNarratives.push({ label: "Dawud: mountains and birds joining his glorification; strengthened kingdom with wisdom and discernment; the two litigants climbing the chamber wall with the ewe dispute; his verdict, recognition of the trial, prostration and repentance; forgiveness with nearness and good return; appointment as successor charged with truthful judgement", keys: ["38:17","38:18","38:19","38:20","38:21","38:22","38:23","38:24","38:25","38:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Repeated turning back to Allah as the defining trait of the remembered servant", keys: ["38:17","38:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Certainty of being tried leading to forgiveness-seeking, bowing and repentance", keys: ["38:24","38:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Desire-following producing straying and severe punishment through forgetting the Day of Account", keys: ["38:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Property dispute between brothers over ninety-nine ewes against one, with overpowering speech", keys: ["38:23","38:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Oppression among associates as the norm, with the believing doers of good named as the few exceptions", keys: ["38:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Successorship on earth carrying the obligation of truthful judgement between people", keys: ["38:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creation declared purposeful, with aimlessness assigned as the disbelievers' assumption", keys: ["38:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Categorical refusal to equate believing doers of good with corrupters, or the God-fearing with the wicked", keys: ["38:28"], evidenceClass: "EXPLICIT_TEXT" });

  const awwab = findWord(17, ["\u0623","\u0648","\u0627","\u0628"]);
  if (awwab) e.terminology.push({ term: awwab, transliteration: "awwab", gloss: "one repeatedly turning back (editorial gloss)", keys: ["38:17"] });
  const khalifah = findWord(26, ["\u062e","\u0644","\u064a","\u0641"]);
  if (khalifah) e.terminology.push({ term: khalifah, transliteration: "khalifah", gloss: "successor upon the earth (editorial gloss)", keys: ["38:26"] });
}

// === POPULATE P3 (38:30-48) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["38:35"], excerpt: fv(35), description: "My Lord, forgive me and grant me a kingdom such as will not belong to anyone after me; You are the Bestower." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["38:42"], excerpt: fv(42), description: "Strike the ground with your foot; this is a cool bath and drink." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["38:44"], excerpt: fv(44), description: "Take a bunch of grass in your hand and strike with it, and do not break your oath." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["38:45"], excerpt: fv(45), description: "Remember Our servants Abraham, Isaac and Jacob, possessors of strength and vision." });

  e.propheticNarratives.push({ label: "Sulayman: the afternoon racehorses and preference of good things over remembrance; return order and striking; the throne-body trial; supplication for forgiveness and an unrepeatable kingdom; wind and builder-diver devils subjected with others shackled; licence to grant or withhold", keys: ["38:30","38:31","38:32","38:33","38:34","38:35","38:36","38:37","38:38","38:39","38:40"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Ayyub: affliction attributed to Satan's touch; the foot-strike spring for bathing and drinking; family restored with a like number; the grass-bunch concession preserving his oath; patience and excellence affirmed", keys: ["38:41","38:42","38:43","38:44"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Ibrahim, Ishaq and Yaqub as possessors of strength and vision chosen for remembrance of the Hereafter; Ismail, Elisha and Dhul-Kifl counted among the outstanding", keys: ["38:45","38:46","38:47","38:48"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Preference for love of good things over remembrance until the sun disappeared", keys: ["38:32"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Trial through a body placed on the throne followed by returning to Allah", keys: ["38:34"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Affliction experienced as hardship and torment, voiced in a call to the Lord", keys: ["38:41"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Patience found and affirmed in the afflicted servant who repeatedly turns back", keys: ["38:44"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Builder and diver labour organised under prophetic command, with others bound in shackles", keys: ["38:37","38:38"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Family restoration doubled as mercy and as a reminder for those of understanding", keys: ["38:43"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine gift permitting grant or withholding without account", keys: ["38:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Selection of the patriarchs for the exclusive quality of remembering the home of the Hereafter", keys: ["38:46","38:47"], evidenceClass: "EXPLICIT_TEXT" });

  const sabirin = findWord(44, ["\u0635","\u0627","\u0628","\u0631"]);
  if (sabirin) e.terminology.push({ term: sabirin, transliteration: "sabir", gloss: "patient one (editorial gloss)", keys: ["38:44"] });
}

// === POPULATE P4 (38:49-64) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Righteous given a good return in gardens of perpetual residence with opened doors", keys: ["38:49","38:50","38:51"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Provision declared inexhaustible as the promise for the Day of Account", keys: ["38:53","38:54"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Transgressors assigned an evil return with scalding water and purulence to taste", keys: ["38:55","38:56","38:57","38:58"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Uncertainty whether the mocked believers were ridiculed or simply missed by their sight", keys: ["38:62","38:63"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Mutual denial of welcome between the incoming company and those who led them", keys: ["38:59","38:60"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Plea for doubled punishment on whoever brought the ruin upon them", keys: ["38:61"], evidenceClass: "EXPLICIT_TEXT" });

  const ghassaq = findWord(57, ["\u063a","\u0633","\u0627","\u0642"]);
  if (ghassaq) e.terminology.push({ term: ghassaq, transliteration: "ghassaq", gloss: "foul purulence (editorial gloss)", keys: ["38:57"] });
}

// === POPULATE P5 (38:65-88) ===
{
  const e = extractions[4];
  const wahid = findWord(65, ["\u0648","\u0627","\u062d","\u062f"]);
  const qahhar = findWord(65, ["\u0642","\u0647","\u0627","\u0631"]);
  const ghaffar = findWord(66, ["\u063a","\u0641","\u0627","\u0631"]);
  if (wahid) e.divineNamesAndAttributes.push({ term: wahid, transliteration: "Wahid", gloss: "One (editorial gloss)", keys: ["38:65"] });
  if (qahhar) e.divineNamesAndAttributes.push({ term: qahhar, transliteration: "Qahhar", gloss: "Prevailing (editorial gloss)", keys: ["38:65"] });
  if (ghaffar) e.divineNamesAndAttributes.push({ term: ghaffar, transliteration: "Ghaffar", gloss: "Perpetual Forgiver (editorial gloss)", keys: ["38:66"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["38:65"], excerpt: fv(65), description: "Say: I am only a warner, and there is no deity except Allah, the One, the Prevailing." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["38:72"], excerpt: fv(72), description: "When I have proportioned him and breathed into him of My soul, fall down to him in prostration." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["38:86"], excerpt: fv(86), description: "Say: I do not ask you any payment for the Quran, and I am not of the pretentious." });

  e.propheticNarratives.push({ label: "Adam and Iblees: the creation announcement to the angels; proportioning and in-breathing followed by the prostration command; universal angelic prostration with Iblees excepted; the interrogation of his refusal and his fire-over-clay claim; expulsion, curse, reprieve to a known day, his oath to mislead, and the divine counter-oath", keys: ["38:71","38:72","38:73","38:74","38:75","38:76","38:77","38:78","38:79","38:80","38:81","38:82","38:83","38:84","38:85"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Turning away from the great news after it is announced", keys: ["38:67","38:68"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Arrogance placing Iblees among the disbelievers despite the universal prostration", keys: ["38:74","38:75"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Material-origin superiority claimed as fire against clay", keys: ["38:76"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Chosen servants exempted from the declared misguidance campaign", keys: ["38:83"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Prophetic knowledge restricted to what is revealed, disclaiming independent access to the angelic assembly", keys: ["38:69","38:70"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Reprieve granted but bounded by the Day of the time well-known", keys: ["38:79","38:80","38:81"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine truth-oath answering the misguidance oath by filling Hell with the misleader and his followers", keys: ["38:84","38:85"], evidenceClass: "EXPLICIT_TEXT" });

  const iblis = findWord(74, ["\u0625","\u0628","\u0644","\u064a","\u0633"]);
  if (iblis) e.terminology.push({ term: iblis, transliteration: "Iblis", gloss: "proper name of the one who refused prostration (editorial gloss)", keys: ["38:74"] });
  const nabaa = findWord(67, ["\u0646","\u0628","\u0623"]);
  if (nabaa) e.terminology.push({ term: nabaa, transliteration: "naba", gloss: "news/tidings (editorial gloss)", keys: ["38:67"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `038-sad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 038-sad-p${num}.json`);
}

// === CANDIDATES (cand-1367..cand-1396, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-038-p1,ext-038-p2,ext-038-p3,ext-038-p4,ext-038-p5",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1367..1372)
  { id: "cand-1367", label: "Oath by Sad and the reminder-bearing Quran establishing the surah's authority", def: "In 38:1: Sad. By the Quran containing reminder.", key: "38:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Dhi al-dhikr designation."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Quran identified by its reminder function."}] },
  { id: "cand-1368", label: "Pride and dissension as the standing condition of disbelief", def: "In 38:2: But those who disbelieve are in pride and dissension.", key: "38:2", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Izzah paired with shiqaq."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Disposition preceding argument."}] },
  { id: "cand-1369", label: "Outcry raised after the time of escape has already passed", def: "In 38:3: How many a generation We destroyed before them; they called out, but it was not a time for escape.", key: "38:3", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Generational destruction."},{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Belated appeal ineffective."}] },
  { id: "cand-1370", label: "Elite defence of ancestral gods against the reduction of deity to One", def: "In 38:5-7: Has he made the gods one God? The eminent went forth saying continue and be patient over your gods; we have not heard of this in the latest religion; this is fabrication.", key: "38:5", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Organised resistance to tawheed."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Oneness treated as novelty."}] },
  { id: "cand-1371", label: "Catalogue of denying companies whose rejection justified the penalty", def: "In 38:12-14: The people of Noah denied, and Aad and Pharaoh owner of stakes, and Thamud and the people of Lot and the companions of the thicket; each denied the messengers so My penalty was justified.", key: "38:12", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Six named communities."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Haqqat iqab."}] },
  { id: "cand-1372", label: "Impatient demand for punishment set against the single undelayed blast", def: "In 38:15-16: These await not but one blast with no delay; and they say our Lord hasten for us our share before the Day of Account.", key: "38:15", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Wahidah without fawaq."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Mocking haste answered."}] },

  // P2 (cand-1373..1379)
  { id: "cand-1373", label: "Patience over hostile speech paired with remembrance of the returning servant", def: "In 38:17: Be patient over what they say and remember Our servant David, possessor of strength; indeed he repeatedly turned back.", key: "38:17", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr over verbal hostility."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Dhu al-ayd and awwab."}] },
  { id: "cand-1374", label: "Mountains and birds joined in timed glorification with the prophet", def: "In 38:18-19: We subjected the mountains to exalt with him in the late afternoon and after sunrise; and the birds assembled, all repeating with him.", key: "38:18", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Creation participating in tasbih."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Ashi and ishraq timing."}] },
  { id: "cand-1375", label: "Litigant intrusion testing judicial impartiality through the ewe dispute", def: "In 38:21-23: The adversaries climbed the wall of his prayer chamber; fear not, two adversaries, one has wronged the other, so judge with truth; this my brother has ninety-nine ewes and I have one, and he overpowered me in speech.", key: "38:21", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Impartial arbitration demanded."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Surprise intrusion as test."}] },
  { id: "cand-1376", label: "Associate oppression as the norm with the believing doers of good as the few exceptions", def: "In 38:24: Many associates oppress one another, except those who believe and do righteous deeds, and few are they; and David became certain We had tried him, sought forgiveness, fell bowing and turned.", key: "38:24", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Khulata partnership abuse."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Recognition triggering istighfar."}] },
  { id: "cand-1377", label: "Successorship on earth carrying the charge of truthful judgement and refusal of desire", def: "In 38:26: O David, We made you a successor upon the earth, so judge between people in truth and do not follow desire, as it will lead you astray; severe punishment for forgetting the Day of Account.", key: "38:26", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Judgement by haqq mandated."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"Khilafah as judicial office."}] },
  { id: "cand-1378", label: "Purposeful creation asserted against the disbelievers' aimlessness assumption", def: "In 38:27: We did not create the heaven and the earth and what is between them aimlessly; that is the assumption of those who disbelieve, so woe to them from the Fire.", key: "38:27", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"Batil creation negated."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Purpose inherent in lordship."}] },
  { id: "cand-1379", label: "Blessed Book revealed for reflection and reminder to those of understanding", def: "In 38:29: A blessed Book We revealed to you that they might reflect upon its verses and that those of understanding would be reminded.", key: "38:29", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Kitab mubarak designation."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Tadabbur and ulu al-albab."}] },

  // P3 (cand-1380..1386)
  { id: "cand-1380", label: "Preference for good things over remembrance until sunset as a prophetic trial", def: "In 38:31-32: There were exhibited before him in the afternoon the poised racehorses; and he said I gave preference to the love of good things over the remembrance of my Lord until the sun disappeared into the curtain.", key: "38:31", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Wealth competing with dhikr."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Priority of dhikr asserted."}] },
  { id: "cand-1381", label: "Throne-body trial followed by returning to Allah", def: "In 38:34: We certainly tried Solomon and placed on his throne a body; then he returned.", key: "38:34", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Fatanna Sulayman."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Anaba after the trial."}] },
  { id: "cand-1382", label: "Supplication for forgiveness and an unrepeatable kingdom", def: "In 38:35: My Lord, forgive me and grant me a kingdom such as will not belong to anyone after me; indeed You are the Bestower.", key: "38:35", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Istighfar joined to request."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Wahhab invoked."}] },
  { id: "cand-1383", label: "Wind and jinn labour subjected with licence to grant or withhold without account", def: "In 38:36-39: We subjected the wind blowing gently by his command wherever he directed, and the devils, every builder and diver, and others bound in shackles; this is Our gift, so grant or withhold without account.", key: "38:36", overlap: [{topicId:"jinn-creation",layer:"scholarly",relationship:"same-concept",note:"Jinn under prophetic command."},{topicId:"work-honor",layer:"scholarly",relationship:"related-not-identical",note:"Organised construction and diving labour."}] },
  { id: "cand-1384", label: "Affliction voiced as Satan's touch answered by a healing spring", def: "In 38:41-42: Remember Our servant Job when he called to his Lord, Satan has touched me with hardship and torment; strike with your foot, this is a cool bath and drink.", key: "38:41", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Durr relieved by command."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Nida answered directly."}] },
  { id: "cand-1385", label: "Family restoration doubled as mercy and reminder for those of understanding", def: "In 38:43: We granted him his family and a like number with them as mercy from Us and a reminder for those of understanding.", key: "38:43", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Household restored and doubled."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Rahmah with dhikra."}] },
  { id: "cand-1386", label: "Oath preserved through a concessive remedy while patience is affirmed", def: "In 38:44: Take in your hand a bunch of grass and strike with it and do not break your oath; We found him patient, an excellent servant, repeatedly turning back.", key: "38:44", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabir confirmed."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Oath integrity maintained."}] },

  // P4 (cand-1387..1391)
  { id: "cand-1387", label: "Gardens of perpetual residence with opened doors and inexhaustible provision", def: "In 38:49-51: This is a reminder, and for the righteous a good return; gardens of perpetual residence whose doors are opened to them; reclining within, calling for abundant fruit and drink.", key: "38:49", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jannat adn with mufattahah doors."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Muttaqin as recipients."}] },
  { id: "cand-1388", label: "Glance-restricted companions of equal age within the promised reward", def: "In 38:52-53: With them women limiting their glances and of equal age; this is what you are promised for the Day of Account.", key: "38:52", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Qasirat al-tarf atrab."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Promise tied to yawm al-hisab."}] },
  { id: "cand-1389", label: "Transgressors' evil return with scalding water and purulence", def: "In 38:55-58: For the transgressors is an evil return; Hell they will burn in, wretched is the resting place; scalding water and purulence, so let them taste it, and other punishments of its type.", key: "38:55", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Hamim and ghassaq."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Sharra ma'ab contrast."}] },
  { id: "cand-1390", label: "Recrimination between followers and leaders with a plea for doubled punishment", def: "In 38:59-61: This is a company bursting in with you, no welcome for them; nor you, you brought this upon us; our Lord, whoever brought this upon us, increase for him double punishment in the Fire.", key: "38:59", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Blame shifted to instigators."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"related-not-identical",note:"Misleading leadership judged."}] },
  { id: "cand-1391", label: "Search for the mocked believers and the truth of the Fire-dwellers' quarrel", def: "In 38:62-64: Why do we not see men we used to count among the worst; did we take them in ridicule or has our vision turned away; indeed that is truth, the quarrelling of the people of the Fire.", key: "38:62", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Reversal of worldly ranking."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Misjudgement exposed."}] },

  // P5 (cand-1392..1396)
  { id: "cand-1392", label: "Warner-only self-definition paired with the confession of the One Prevailing God", def: "In 38:65-66: Say I am only a warner, and there is no deity except Allah the One the Prevailing, Lord of the heavens and the earth and what is between them, the Exalted in Might, the Perpetual Forgiver.", key: "38:65", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Nadhir limitation."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Wahid Qahhar Aziz Ghaffar."}] },
  { id: "cand-1393", label: "Prophetic knowledge restricted to revelation, disclaiming access to the angelic assembly", def: "In 38:69-70: I had no knowledge of the exalted assembly when they were disputing; it has not been revealed to me except that I am a clear warner.", key: "38:69", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Wahy as sole channel."},{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Ghayb known only by disclosure."}] },
  { id: "cand-1394", label: "Creation from clay with proportioning and in-breathing preceding the prostration command", def: "In 38:71-73: Your Lord said to the angels, I am going to create a human being from clay; when I have proportioned him and breathed into him of My soul, fall down to him in prostration; so the angels prostrated, all of them entirely.", key: "38:71", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Tin, taswiyah and ruh."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Universal compliance."}] },
  { id: "cand-1395", label: "Fire-over-clay superiority claim producing expulsion and curse", def: "In 38:74-78: Except Iblees, he was arrogant and became of the disbelievers; what prevented you from prostrating to what I created with My hands; I am better than him, You created me from fire and him from clay; then get out of Paradise, you are expelled; upon you is My curse until the Day of Recompense.", key: "38:74", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Istakbara grounded in origin."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Expulsion and la'nah."}] },
  { id: "cand-1396", label: "Bounded reprieve and the misguidance oath answered by the divine truth-oath", def: "In 38:79-85: My Lord, reprieve me until the Day they are resurrected; you are of those reprieved until the Day of the time well-known; by Your might I will mislead them all except Your chosen servants; the truth is My oath, I will fill Hell with you and those who follow you all together.", key: "38:79", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Respite bounded by appointed day."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Mukhlasin exemption and counter-oath."}] }
];

// Evidence must cover every ayah the definition actually cites.
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
    notes: "Wave 6 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 6).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(6, 13).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(13, 20).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(20, 25).map(c => c.candidateId);
extractions[4].topicCandidateIds = candidates.candidates.slice(25, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `038-sad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-062.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-062.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
