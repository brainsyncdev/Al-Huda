// MFD-11 Wave 6: Surah 39 (Az-Zumar) genuine re-extraction.
// Covers 39:1-75 in 5 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "039-0001-0075.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 39:${n} not found`);
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

console.log("Generating Surah 39 (Az-Zumar) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T15:20:00.000Z";

const PASSAGES = [
  { id: "ext-039-p1", from: 1, to: 10,
    label: "Revelation from the Mighty Wise; Book sent in truth with the command to worship Allah sincere in religion; pure religion belongs to Him while those taking protectors claim nearness; judgement over their dispute and no guidance for the lying disbeliever; son-taking refuted by free choice among creation, He is One Prevailing; heavens and earth created in truth, night wrapped over day, sun and moon running to a term; creation from one soul with its mate, eight mates of livestock, creation after creation in three darknesses; disbelief not approved though He is free of need, gratitude approved, no bearer carries another's burden; adversity-call then favour-forgetting and setting up equals; the night-devout prostrating and standing contrasted with the heedless, knowers unequal to non-knowers; fear of the Lord, spacious earth, patient reward without account",
    mainLabel: "The Quran's origin in the Mighty and Wise grounding the command of sincere worship; intermediaries justified as bringers of nearness exposed as a dispute Allah will judge; divine sonship refuted through His freedom to choose, affirming Oneness and Prevailing power; truthful creation with the wrapping of night and day and the termed courses of sun and moon; human origin from one soul with its mate, paired livestock, and staged gestation within three darknesses; divine independence from human belief coupled with disapproval of disbelief and approval of gratitude; individual burden-bearing and return; the adversity-to-prosperity reversal producing forgotten calls and invented equals; nocturnal devotion contrasted with heedlessness and knowledge with ignorance; taqwa, the spaciousness of the earth, and unaccounted reward for the patient" },
  { id: "ext-039-p2", from: 11, to: 22,
    label: "Commanded to worship Allah sincere and to be first of the Muslims; fear of a tremendous Day's punishment for disobedience; worship of Allah alone with the challenge to worship what they will besides Him; losers defined as those losing themselves and their families on Resurrection Day; canopies of fire above and below as threat, so fear Me; those avoiding Taghut and turning back receive good tidings; those listening to speech and following the best of it are guided and possess understanding; the one deserving the decree of punishment cannot be saved from the Fire; chambers above chambers with rivers beneath as an unfailing promise; rain made to flow as springs producing varied crops that yellow and become debris as reminder; the breast expanded to Islam upon a light contrasted with hearts hardened against remembrance, those in manifest error",
    mainLabel: "The Prophet's commissioned sincerity and precedence in submission, with fear of the tremendous Day; exclusive worship asserted alongside the challenge to worship alternatives; loss defined as the forfeiture of self and family at resurrection; layered fire-canopies as the divine threat calling servants to taqwa; avoidance of Taghut and return to Allah earning glad tidings; the criterion of hearing speech and following its best as the mark of guidance and understanding; the impossibility of rescuing one under the punishment decree; elevated chambers with flowing rivers as an unfailing promise; the agricultural cycle from rain to withered debris as reminder for the understanding; the expanded breast resting on divine light set against hearts hardened to remembrance" },
  { id: "ext-039-p3", from: 23, to: 40,
    label: "Best statement sent down as a consistent Book of reiteration; skins shiver then relax with hearts at remembrance; guidance given to whom He wills and no guide for whom He leaves astray; shielding the face from the worst punishment, taste what you earned; prior denial bringing punishment from unperceived directions, disgrace in this world and greater punishment hereafter; every kind of example presented that they might remember; an Arabic Quran without deviance that they might become righteous; the parable of a slave owned by quarrelling partners against one belonging to a single man; mortality of both parties and dispute before the Lord; the liar about Allah and denier of truth as most unjust with Hell as residence; the bringer of truth and its believers as the righteous receiving whatever they desire, worst deeds removed and best rewarded; Allah sufficient for His servant while they threaten with others; guidance and misguidance irreversible, He is Mighty and Owner of Retribution; the creator question answered Allah, then whether others remove His harm or withhold His mercy; reliance on Him alone; work according to your position, disgrace and enduring punishment to come",
    mainLabel: "The best statement as a self-consistent reiterated Book whose recitation shivers then settles the skins and hearts of the fearful; guidance as divine dispensation with no guide for the abandoned; the face-shielding posture at the worst punishment and the verdict to taste what was earned; prior communities struck from unperceived directions, worldly disgrace preceding greater punishment; the Quran's comprehensive parables and its unambiguous Arabic aimed at remembrance and taqwa; the ownership parable contrasting divided and exclusive mastership; universal mortality followed by dispute before the Lord; fabrication against Allah and denial of arriving truth as supreme injustice; the truthful bringer and believers rewarded by removal of the worst and recompense for the best; divine sufficiency against threats from false objects; irreversibility of guidance and abandonment; the creator-question concession followed by the harm-and-mercy challenge establishing exclusive reliance; mutual working with disgrace and enduring punishment awaiting" },
  { id: "ext-039-p4", from: 41, to: 52,
    label: "Book sent for people in truth, guidance benefiting the soul and straying harming it, the Prophet not a manager over them; souls taken at death and in sleep, those decreed for death retained and others released to a term as signs for thinkers; intercessors taken besides Allah who possess nothing and do not reason; intercession belonging entirely to Allah with dominion of heavens and earth and return to Him; hearts shrinking when Allah alone is mentioned and rejoicing at others; invocation of the Creator, Knower of unseen and witnessed, who judges the disputes; the whole earth and its like offered as ransom failing, with the unaccounted appearing; earned evils appearing and ridicule enveloping them; adversity-call then the claim of knowledge-based entitlement, rather a trial most do not know; prior claimants unavailing, evil consequences striking and none causing failure; provision extended and restricted as signs for believers",
    mainLabel: "The Book sent in truth for people with guidance and straying returning to the soul alone and no prophetic managership; the taking of souls at death and in sleep with retention or release to an appointed term as signs for reflection; intercessors devoid of possession and reason rejected, intercession reserved wholly to Allah whose dominion and return are absolute; aversion at the mention of Allah alone against joy at rivals; the appeal to the Creator and Knower judging their disputes; the futility of ransoming with the earth doubled when the unaccounted appears; earned evils surfacing and ridicule closing around them; prosperity misread as knowledge-based entitlement rather than trial; the repetition of that claim across generations without avail; provision expanded and restricted as signs for believers" },
  { id: "ext-039-p5", from: 53, to: 75,
    label: "Servants who transgressed against themselves told not to despair of mercy, Allah forgives all sins, Forgiving Merciful; return in repentance and submit before punishment when none will help; follow the best revealed before sudden punishment; the soul's regret over neglect and mockery, the wish for guidance, the plea for another turn; the answer that the verses came but were denied in arrogance; blackened faces of the liars about Allah and Hell as residence for the arrogant; the God-fearing saved by their attainment untouched by evil or grief; Creator of all things and Disposer over all; keys of heavens and earth with the deniers as losers; the challenge to worship other than Allah; shirk rendering work worthless; worship Allah and be grateful; failure to appraise Him truly while the earth is in His grip and heavens folded in His right hand; the Horn blown with universal death save whom He wills then a second blast raising them; earth shining with its Lord's light, record placed, prophets and witnesses brought, judged in truth without wrong; every soul fully compensated; disbelievers driven in groups to Hell whose keepers ask about the messengers, the word of punishment taking effect; eternal entry and wretched residence of the arrogant; the God-fearing driven to Paradise greeted with peace and purity; praise for the fulfilled promise and inheritance of the earth to settle where they will; angels surrounding the Throne exalting with praise, judgement in truth, praise to the Lord of the worlds",
    mainLabel: "The address to self-transgressing servants forbidding despair because all sins are forgiven; repentance and submission urged before unhelped punishment, following the best revelation before it comes suddenly; the three regrets of neglect, absent guidance and the wish for a second turn answered by the arrival of denied verses; blackened faces and Hell for the arrogant liars against the God-fearing saved untouched by evil or grief; universal creation and disposal with the keys of the cosmos; the challenge over worship and the warning that shirk voids all work; the call to worship and gratitude; inadequate appraisal corrected by the earth in His grip and the heavens folded in His right hand; the double blast of the Horn with the willed exception; the illuminated earth, placed record, assembled prophets and witnesses, and truthful judgement without wrong; full compensation of every soul; the grouped drivings to Hell and Paradise with their keepers' words, the effective punishment decree, eternal entry, the greeting of peace and purity, the fulfilled promise and inherited settlement; the angels encircling the Throne in praise closing with hamd to the Lord of the worlds" }
];

const SUB_LABELS = {
  "ext-039-p1": [
    "The Quran's revelation traced to Allah, the Exalted in Might, the Wise",
    "The Book sent down in truth with the command to worship Allah sincerely in religion",
    "Pure religion assigned to Allah while intermediary-worshippers plead nearness, their dispute reserved for His judgement and the lying disbeliever left unguided",
    "Son-taking refuted by His freedom to choose from creation, with the affirmation that He is Allah, One and Prevailing",
    "Truthful creation of heavens and earth, the mutual wrapping of night and day, and sun and moon running to a specified term",
    "Creation from one soul with its mate, eight mates of livestock, and staged creation in the wombs within three darknesses, ending with the challenge of being averted",
    "Divine independence of human belief, disapproval of disbelief and approval of gratitude, individual burden-bearing, and return with disclosure of deeds",
    "Adversity prompting a solitary call, then favour causing forgetfulness and the setting up of equals to mislead, answered by brief enjoyment and the Fire",
    "The night-devout prostrating and standing in fear and hope contrasted with the heedless, and knowers declared unequal to non-knowers",
    "Servants commanded to fear their Lord, promised good for good deeds, reminded of the earth's spaciousness and unaccounted reward for the patient"
  ],
  "ext-039-p2": [
    "Declaration of being commanded to worship Allah with sincerity in religion",
    "Declaration of being commanded to be the first of the Muslims",
    "Declaration of fearing the punishment of a tremendous Day should he disobey his Lord",
    "Declaration of worshipping Allah alone with sincerity in religion",
    "The challenge to worship what they will besides Him, with losers defined as those losing themselves and their families at resurrection",
    "Canopies of fire above and below named as the divine threat, with the call to fear Him",
    "Glad tidings for those who avoided worshipping Taghut and turned back to Allah",
    "Those who listen to speech and follow its best identified as guided and possessing understanding",
    "Rhetorical impossibility of guiding one under the punishment decree or saving one already in the Fire",
    "Elevated chambers with rivers flowing beneath promised to the God-fearing as an unfailing promise",
    "Rain sent down and made to flow as springs producing varied crops that yellow into debris, a reminder for the understanding",
    "The breast expanded to Islam upon a light contrasted with hearts hardened against remembrance, those in manifest error"
  ],
  "ext-039-p3": [
    "The best statement described as a consistent reiterated Book whose recitation shivers then relaxes skins and hearts, guidance dispensed by will",
    "The face-shielding posture against the worst punishment contrasted with security, and wrongdoers told to taste what they earned",
    "Prior denial met by punishment arriving from directions they did not perceive",
    "Disgrace tasted in worldly life with the Hereafter's punishment declared greater",
    "Every kind of example presented in the Quran so that people might remember",
    "The Quran described as Arabic without deviance so that they might become righteous",
    "The parable of a slave owned by quarrelling partners against one belonging exclusively to a single man",
    "Mortality affirmed for the Prophet and for them alike",
    "Their dispute before the Lord on the Day of Resurrection",
    "The liar about Allah and denier of arriving truth named most unjust, with Hell as residence for disbelievers",
    "The bringer of truth and those who believed in it identified as the righteous",
    "Whatever they desire granted with their Lord as the reward of the doers of good",
    "Removal of the worst of their deeds and recompense according to the best",
    "Allah declared sufficient for His servant against threats from other objects, with no guide for whom He leaves astray",
    "No misleader for whom Allah guides, and His might and ownership of retribution affirmed",
    "The creator-question conceded as Allah, then the challenge whether others remove His harm or withhold His mercy, ending in exclusive reliance",
    "The instruction to work according to their position while he works, with knowledge to come",
    "The question of who receives a disgracing torment and an enduring punishment"
  ],
  "ext-039-p4": [
    "The Book sent for people in truth, guidance benefiting the soul and straying harming it, with no prophetic managership",
    "Souls taken at death and during sleep, the decreed retained and the rest released to a specified term as signs for thinkers",
    "Intercessors taken besides Allah challenged as possessing nothing and lacking reason",
    "Intercession assigned entirely to Allah with dominion of heavens and earth and return to Him",
    "Hearts shrinking when Allah alone is mentioned while rejoicing when others are mentioned",
    "Invocation of the Creator of heavens and earth, Knower of unseen and witnessed, who judges their disputes",
    "The whole earth and its like offered as ransom yet failing, with the unaccounted appearing from Allah",
    "Earned evils becoming visible and their former ridicule enveloping them",
    "Adversity-call followed by the claim of knowledge-based entitlement, corrected as a trial most do not recognise",
    "Prior generations making the same claim without being availed by their earnings",
    "Evil consequences striking them and the wrongdoers among these people likewise, unable to cause failure",
    "Provision extended and restricted by will as signs for a believing people"
  ],
  "ext-039-p5": [
    "Self-transgressing servants told not to despair of mercy since Allah forgives all sins, being Forgiving and Merciful",
    "Return in repentance and submission commanded before punishment arrives when no help remains",
    "Following the best of what was revealed urged before punishment comes suddenly and unperceived",
    "The soul's regret over neglect toward Allah and having been among the mockers",
    "The soul's claim that had Allah guided it, it would have been among the righteous",
    "The soul's wish for another turn to be among the doers of good upon seeing punishment",
    "The rebuttal that His verses had come but were denied in arrogance and disbelief",
    "Blackened faces of those who lied about Allah, with Hell as residence for the arrogant",
    "The God-fearing saved by their attainment, untouched by evil and free of grief",
    "Allah named Creator of all things and Disposer of affairs over all things",
    "The keys of heavens and earth belonging to Him, with deniers of His verses named the losers",
    "The challenge asking whether he is ordered to worship other than Allah, addressed to the ignorant",
    "The revelation to him and to prior messengers that associating anything with Allah voids all work and brings loss",
    "The command to worship Allah alone and be among the grateful",
    "Failure to appraise Allah truly, corrected by the earth within His grip and the heavens folded in His right hand",
    "The Horn blown causing universal death except whom He wills, then blown again raising them to look on",
    "The earth shining with its Lord's light, the record placed, prophets and witnesses brought, and truthful judgement without wrong",
    "Every soul fully compensated for what it did, with His knowledge of their deeds affirmed",
    "Disbelievers driven in groups to Hell whose opened gates and keepers confront them with the messengers they denied, the punishment decree taking effect",
    "The order to enter Hell's gates eternally, with the arrogant's residence named wretched",
    "The God-fearing driven in groups to Paradise whose gates stand open and whose keepers greet them with peace and purity for eternal entry",
    "Their praise for the fulfilled promise and inheritance of the earth to settle in Paradise wherever they will",
    "Angels surrounding the Throne exalting with praise, judgement in truth, and praise declared to the Lord of the worlds"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`39:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`39:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 39, surahName: "Az-Zumar",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 6 genuine re-extraction. Boundaries follow the text: P1 closes with the patient-reward address (10) before the commissioned say-block opens (11); P2 ends at the expanded-breast/hardened-heart contrast (22); P3 runs from the best-statement description through the mutual-working challenge (23-40); P4 covers the Book-for-people declaration through the provision signs (41-52); P5 begins with the no-despair address and runs through judgement and the grouped drivings to the Throne close (53-75).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (39:1-10) ===
{
  const e = extractions[0];
  const aziz = findWord(1, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(1, ["\u062d","\u0643","\u064a","\u0645"]);
  const wahid = findWord(4, ["\u0648","\u0627","\u062d","\u062f"]);
  const qahhar = findWord(4, ["\u0642","\u0647","\u0627","\u0631"]);
  const ghaffar = findWord(5, ["\u063a","\u0641","\u0627","\u0631"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["39:1"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["39:1"] });
  if (wahid) e.divineNamesAndAttributes.push({ term: wahid, transliteration: "Wahid", gloss: "One (editorial gloss)", keys: ["39:4"] });
  if (qahhar) e.divineNamesAndAttributes.push({ term: qahhar, transliteration: "Qahhar", gloss: "Prevailing (editorial gloss)", keys: ["39:4"] });
  if (ghaffar) e.divineNamesAndAttributes.push({ term: ghaffar, transliteration: "Ghaffar", gloss: "Perpetual Forgiver (editorial gloss)", keys: ["39:5"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:2"], excerpt: fv(2), description: "So worship Allah, being sincere to Him in religion." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:10"], excerpt: fv(10), description: "Say: O My servants who have believed, fear your Lord." });

  e.humanConditionsAndSpiritualStates.push({ label: "Intermediary worship justified as seeking nearness to Allah in position", keys: ["39:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Adversity prompting a solitary call, then favour causing forgetfulness and the setting up of equals", keys: ["39:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Night devotion prostrating and standing while fearing the Hereafter and hoping for mercy", keys: ["39:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine independence of human belief with disapproval of disbelief and approval of gratitude", keys: ["39:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No bearer of burdens bears another's burden, followed by return and disclosure of deeds", keys: ["39:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "The earth of Allah declared spacious alongside unaccounted reward for the patient", keys: ["39:10"], evidenceClass: "EXPLICIT_TEXT" });

  const zulumat = findWord(6, ["\u0638","\u0644","\u0645","\u062a"]);
  if (zulumat) e.terminology.push({ term: zulumat, transliteration: "zulumat", gloss: "darknesses (editorial gloss)", keys: ["39:6"] });
}

// === POPULATE P2 (39:11-22) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:11"], excerpt: fv(11), description: "Say: I have been commanded to worship Allah, being sincere to Him in religion." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:12"], excerpt: fv(12), description: "And I have been commanded to be the first of the Muslims." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:16"], excerpt: fv(16), description: "O My servants, then fear Me." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:17"], excerpt: fv(17), description: "So give good tidings to My servants." });

  e.humanConditionsAndSpiritualStates.push({ label: "Loss defined as forfeiting oneself and one's family on the Day of Resurrection", keys: ["39:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Avoidance of Taghut worship combined with turning back to Allah", keys: ["39:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Listening to speech and following the best of it as the mark of guidance and understanding", keys: ["39:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "The breast expanded to Islam resting upon a light from the Lord", keys: ["39:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hearts hardened against the remembrance of Allah placed in manifest error", keys: ["39:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Layered canopies of fire above and below named as the means by which Allah threatens His servants", keys: ["39:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Chambers above chambers with rivers beneath as a promise Allah does not fail", keys: ["39:20"], evidenceClass: "EXPLICIT_TEXT" });

  const taghut = findWord(17, ["\u0637","\u0627","\u063a","\u0648","\u062a"]);
  if (taghut) e.terminology.push({ term: taghut, transliteration: "Taghut", gloss: "object of false worship (editorial gloss)", keys: ["39:17"] });
}

// === POPULATE P3 (39:23-40) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:38"], excerpt: fv(38), description: "Say: Sufficient for me is Allah; upon Him alone rely the wise reliers." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:39"], excerpt: fv(39), description: "Say: O my people, work according to your position; indeed I am working." });

  e.humanConditionsAndSpiritualStates.push({ label: "Skins shivering at the recitation then relaxing with hearts at the remembrance of Allah", keys: ["39:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Shielding the face against the worst punishment contrasted with being secure from it", keys: ["39:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Worldly disgrace tasted with the Hereafter's punishment declared greater", keys: ["39:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Ownership parable contrasting a slave held by quarrelling partners with one belonging exclusively to a single master", keys: ["39:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Guidance dispensed by divine will with no guide for whom He leaves astray", keys: ["39:23","39:36","39:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Universal mortality followed by dispute before the Lord on the Day of Resurrection", keys: ["39:30","39:31"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Removal of the worst deeds and recompense according to the best for the doers of good", keys: ["39:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "False objects challenged as unable to remove His harm or withhold His mercy", keys: ["39:38"], evidenceClass: "EXPLICIT_TEXT" });

  const mathalan = findWord(29, ["\u0645","\u062b","\u0644"]);
  if (mathalan) e.terminology.push({ term: mathalan, transliteration: "mathal", gloss: "parable/example (editorial gloss)", keys: ["39:29"] });
}

// === POPULATE P4 (39:41-52) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Souls taken at death and during sleep, the decreed retained and others released to a specified term", keys: ["39:42"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hearts shrinking with aversion when Allah alone is mentioned while rejoicing at rivals", keys: ["39:45"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prosperity misread as knowledge-based entitlement when it is in fact a trial", keys: ["39:49"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Guidance benefiting the soul and straying harming it, with the Prophet not a manager over them", keys: ["39:41"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Intercession belonging entirely to Allah with cosmic dominion and return to Him", keys: ["39:44"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Ransom of the whole earth doubled failing against the worst punishment", keys: ["39:47"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Provision extended and restricted by will as signs for a believing people", keys: ["39:52"], evidenceClass: "EXPLICIT_TEXT" });

  const shufa = findWord(44, ["\u0634","\u0641","\u0627","\u0639"]);
  if (shufa) e.terminology.push({ term: shufa, transliteration: "shafa'ah", gloss: "intercession (editorial gloss)", keys: ["39:44"] });
}

// === POPULATE P5 (39:53-75) ===
{
  const e = extractions[4];
  const ghafoor = findWord(53, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(53, ["\u0631","\u062d","\u064a","\u0645"]);
  const khaliq = findWord(62, ["\u062e","\u0627","\u0644","\u0642"]);
  const wakeel = findWord(62, ["\u0648","\u0643","\u064a","\u0644"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["39:53"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["39:53"] });
  if (khaliq) e.divineNamesAndAttributes.push({ term: khaliq, transliteration: "Khaliq", gloss: "Creator (editorial gloss)", keys: ["39:62"] });
  if (wakeel) e.divineNamesAndAttributes.push({ term: wakeel, transliteration: "Wakeel", gloss: "Disposer of affairs (editorial gloss)", keys: ["39:62"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["39:53"], excerpt: fv(53), description: "Do not despair of the mercy of Allah; indeed Allah forgives all sins." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:54"], excerpt: fv(54), description: "Return in repentance to your Lord and submit to Him before the punishment comes." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:55"], excerpt: fv(55), description: "Follow the best of what was revealed to you from your Lord before punishment comes suddenly." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["39:66"], excerpt: fv(66), description: "Rather, worship only Allah and be among the grateful." });

  e.humanConditionsAndSpiritualStates.push({ label: "Self-transgression answered by the prohibition of despair because all sins are forgiven", keys: ["39:53"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Threefold regret: neglect and mockery, absent guidance, and the wish for another turn", keys: ["39:56","39:57","39:58"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Blackened faces of those who lied about Allah on the Day of Resurrection", keys: ["39:60"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "The God-fearing saved by their attainment, untouched by evil and free of grief", keys: ["39:61"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Inadequate appraisal of Allah corrected by the earth in His grip and the heavens folded in His right hand", keys: ["39:67"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Associating anything with Allah rendering all work worthless and placing one among the losers", keys: ["39:65"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "The double blast of the Horn with universal death save whom He wills, then standing to look on", keys: ["39:68"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The earth shining with its Lord's light, the record placed, prophets and witnesses brought, judged in truth without wrong", keys: ["39:69"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Grouped drivings to Hell and Paradise with their keepers' questioning and greeting", keys: ["39:71","39:73"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Angels surrounding the Throne exalting with praise as judgement is passed in truth", keys: ["39:75"], evidenceClass: "EXPLICIT_TEXT" });

  const zumar = findWord(71, ["\u0632","\u0645","\u0631"]);
  if (zumar) e.terminology.push({ term: zumar, transliteration: "zumar", gloss: "groups/crowds (editorial gloss)", keys: ["39:71"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `039-az-zumar-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 039-az-zumar-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-039-p1,ext-039-p2,ext-039-p3,ext-039-p4,ext-039-p5",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1397", label: "Sincerity in religion as the condition of the worship command", def: "In 39:2-3: We sent down the Book in truth, so worship Allah being sincere to Him in religion; unquestionably for Allah is the pure religion.", key: "39:2", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Mukhlisan lahu al-din."},{topicId:"god-consciousness",layer:"curated",relationship:"related-not-identical",note:"Ikhlas as worship quality."}] },
  { id: "cand-1398", label: "Intermediary worship pleaded as seeking nearness, reserved for divine judgement", def: "In 39:3: Those who take protectors besides Him say we only worship them that they may bring us nearer to Allah in position; Allah will judge between them concerning that over which they differ.", key: "39:3", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Wasilah rationale exposed."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Dispute deferred to judgement."}] },
  { id: "cand-1399", label: "Divine sonship refuted through freedom of choice, affirming Oneness and Prevailing power", def: "In 39:4: If Allah had intended to take a son He could have chosen from what He creates whatever He willed; exalted is He, He is Allah the One the Prevailing.", key: "39:4", overlap: [{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Walad attribution negated."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Wahid Qahhar pairing."}] },
  { id: "cand-1400", label: "Staged creation in the wombs within three darknesses", def: "In 39:6: He created you from one soul then made from it its mate, and produced eight mates of grazing livestock; He creates you in the wombs of your mothers, creation after creation, within three darknesses.", key: "39:6", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Khalqan min ba'di khalq."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Embryonic staging as sign."}] },
  { id: "cand-1401", label: "Divine independence of belief with approval of gratitude and individual burden-bearing", def: "In 39:7: If you disbelieve, Allah is Free from need of you, and He does not approve disbelief for His servants; if you are grateful He approves it; no bearer of burdens bears another's burden.", key: "39:7", overlap: [{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Shukr approved."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La taziru waziratun wizra ukhra."}] },
  { id: "cand-1402", label: "Night devotion contrasted with heedlessness and knowledge with ignorance", def: "In 39:9: Is one who is devoutly obedient during periods of the night, prostrating and standing, fearing the Hereafter and hoping for the mercy of his Lord, like one who does not? Say, are those who know equal to those who do not know?", key: "39:9", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Qiyam and sujud at night."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Knowledge inequality asserted."}] },

  { id: "cand-1403", label: "Commissioned sincerity and precedence in submission with fear of the tremendous Day", def: "In 39:11-13: I have been commanded to worship Allah sincere in religion and to be the first of the Muslims; say I fear, if I should disobey my Lord, the punishment of a tremendous Day.", key: "39:11", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Umirtu commission formula."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Prophetic fear of disobedience."}] },
  { id: "cand-1404", label: "Loss defined as forfeiting oneself and one's family at resurrection", def: "In 39:15: Indeed the losers are the ones who will lose themselves and their families on the Day of Resurrection; that is the manifest loss.", key: "39:15", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Khusran mubin defined."},{topicId:"parents-and-family",layer:"curated",relationship:"related-not-identical",note:"Family included in the loss."}] },
  { id: "cand-1405", label: "Avoidance of Taghut and return to Allah earning glad tidings", def: "In 39:17: Those who have avoided Taghut lest they worship it and turned back to Allah, for them are good tidings; so give good tidings to My servants.", key: "39:17", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Anabu ila Allah."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Ijtinab al-taghut."}] },
  { id: "cand-1406", label: "Hearing speech and following its best as the criterion of guidance", def: "In 39:18: Who listen to speech and follow the best of it; those are the ones Allah has guided and those are people of understanding.", key: "39:18", overlap: [{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Ahsan al-qawl discernment."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Selective listening as virtue."}] },
  { id: "cand-1407", label: "The agricultural cycle from rain to withered debris as reminder", def: "In 39:21: Allah sends down rain and makes it flow as springs in the earth, then produces crops of varying colors, then they dry and turn yellow, then He makes them scattered debris; indeed in that is a reminder for those of understanding.", key: "39:21", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Growth-decay cycle as ayah."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Dhikra li-uli al-albab."}] },
  { id: "cand-1408", label: "The expanded breast upon divine light against hearts hardened to remembrance", def: "In 39:22: Is one whose breast Allah has expanded to accept Islam and he is upon a light from his Lord like one whose heart rejects it? Then woe to those whose hearts are hardened against the remembrance of Allah.", key: "39:22", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Sharh al-sadr versus qaswah."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Hardness measured against dhikr."}] },

  { id: "cand-1409", label: "The best statement as a reiterated Book affecting skin and heart", def: "In 39:23: Allah has sent down the best statement, a consistent Book wherein is reiteration; the skins shiver of those who fear their Lord, then their skins and hearts relax at the remembrance of Allah.", key: "39:23", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Ahsan al-hadith mathani."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Physiological response to dhikr."}] },
  { id: "cand-1410", label: "Comprehensive parables in an unambiguous Arabic Quran aimed at remembrance and taqwa", def: "In 39:27-28: We have presented for the people in this Quran every kind of example that they might remember; an Arabic Quran without any deviance that they might become righteous.", key: "39:27", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Arabi ghayra dhi iwaj."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"La'allahum yattaqun."}] },
  { id: "cand-1411", label: "Ownership parable contrasting divided and exclusive mastership", def: "In 39:29: Allah presents an example, a slave owned by quarreling partners and another belonging exclusively to one man; are they equal in comparison?", key: "39:29", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Exclusive ownership analogy."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Shuraka mutashakisun refuted."}] },
  { id: "cand-1412", label: "Universal mortality followed by dispute before the Lord", def: "In 39:30-31: Indeed you are to die and indeed they are to die; then indeed you, on the Day of Resurrection, before your Lord will dispute.", key: "39:30", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Takhtasimun before the Lord."},{topicId:"self-accountability",layer:"scholarly",relationship:"related-not-identical",note:"Shared mortality, individual reckoning."}] },
  { id: "cand-1413", label: "Removal of the worst deeds and recompense according to the best", def: "In 39:34-35: They will have whatever they desire with their Lord, that is the reward of the doers of good, that Allah may remove from them the worst of what they did and reward them for the best of what they used to do.", key: "39:34", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Takfir aswa' alladhi amilu."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ahsan as reward standard."}] },
  { id: "cand-1414", label: "Divine sufficiency against threats, with exclusive reliance after the harm-and-mercy challenge", def: "In 39:36-38: Is not Allah sufficient for His servant? If Allah intended me harm, are they removers of His harm, or if He intended mercy, are they withholders of His mercy? Say, sufficient for me is Allah; upon Him alone rely the reliers.", key: "39:36", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Hasbi Allah and tawakkul."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Darr and rahmah monopoly."}] },

  { id: "cand-1415", label: "Guidance and straying returning to the soul with no prophetic managership", def: "In 39:41: We sent down the Book for the people in truth; whoever is guided, it is for the benefit of his soul, and whoever goes astray only goes astray to its detriment; and you are not a manager over them.", key: "39:41", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Benefit and detriment to the nafs."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Not wakili over them."}] },
  { id: "cand-1416", label: "Souls taken at death and in sleep with retention or release to a term", def: "In 39:42: Allah takes the souls at the time of their death, and those that do not die during their sleep; then He keeps those for which He has decreed death and releases the others for a specified term.", key: "39:42", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sleep-death analogy as ayah."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Qada al-mawt and ajal musamma."}] },
  { id: "cand-1417", label: "Intercession reserved wholly to Allah against powerless intercessors", def: "In 39:43-44: Have they taken other than Allah as intercessors? Say, even though they do not possess anything nor do they reason? Say, to Allah belongs intercession entirely.", key: "39:43", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Shafa'ah as divine prerogative."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Powerless mediators rejected."}] },
  { id: "cand-1418", label: "Aversion at the mention of Allah alone against joy at rivals", def: "In 39:45: When Allah is mentioned alone the hearts of those who do not believe in the Hereafter shrink with aversion, but when those worshipped other than Him are mentioned, immediately they rejoice.", key: "39:45", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Ishmizaz versus istibshar."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Linked to disbelief in the Hereafter."}] },
  { id: "cand-1419", label: "Prosperity misread as knowledge-based entitlement rather than trial", def: "In 39:49: When adversity touches man he calls upon Us; then when We bestow a favor he says I have only been given it because of my knowledge; rather it is a trial, but most of them do not know.", key: "39:49", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Fitnah misread as entitlement."},{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Ni'mah attributed to self."}] },

  { id: "cand-1420", label: "Prohibition of despair for self-transgressing servants because all sins are forgiven", def: "In 39:53: Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah; indeed Allah forgives all sins; indeed it is He who is the Forgiving, the Merciful.", key: "39:53", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Yaghfiru al-dhunub jami'an."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Israf ala al-nafs addressed."}] },
  { id: "cand-1421", label: "Repentance and following the best revelation urged before sudden punishment", def: "In 39:54-55: Return in repentance to your Lord and submit to Him before the punishment comes upon you; and follow the best of what was revealed to you from your Lord before the punishment comes suddenly while you do not perceive.", key: "39:54", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Anaba and aslama before adhab."},{topicId:"god-consciousness",layer:"curated",relationship:"related-not-identical",note:"Urgency before the deadline."}] },
  { id: "cand-1422", label: "Threefold regret answered by the arrival of denied verses", def: "In 39:56-59: Lest a soul say oh my regret over what I neglected in regard to Allah; or if only Allah had guided me; or if only I had another turn; but yes, there had come to you My verses, but you denied them and were arrogant.", key: "39:56", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Excuses invalidated by prior delivery."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Hasrat at the reckoning."}] },
  { id: "cand-1423", label: "Shirk voiding all work, answered by the command to worship and be grateful", def: "In 39:65-66: It was revealed to you and to those before you that if you should associate anything with Allah your work would surely become worthless; rather worship only Allah and be among the grateful.", key: "39:65", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Layahbatanna amaluka."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Shakirin as the alternative."}] },
  { id: "cand-1424", label: "Inadequate appraisal corrected by the earth in His grip and heavens folded in His right hand", def: "In 39:67: They have not appraised Allah with true appraisal, while the earth entirely will be within His grip on the Day of Resurrection and the heavens will be folded in His right hand.", key: "39:67", overlap: [{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Ma qadaru Allaha haqqa qadrihi."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Qabdah and tayy imagery."}] },
  { id: "cand-1425", label: "The double blast, illuminated earth, placed record and assembled witnesses", def: "In 39:68-70: The Horn will be blown and all will fall dead except whom Allah wills, then blown again and they stand looking on; the earth will shine with the light of its Lord, the record placed, the prophets and witnesses brought, judged in truth without wrong; every soul fully compensated.", key: "39:68", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Sur, kitab and shuhada sequence."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Wuffiyat without zulm."}] },
  { id: "cand-1426", label: "Grouped drivings to Hell and Paradise with their keepers' words", def: "In 39:71-75: Those who disbelieved driven to Hell in groups whose keepers ask about the messengers; those who feared their Lord driven to Paradise in groups greeted with peace and purity; and you will see the angels surrounding the Throne exalting with praise, and it will be said praise to Allah Lord of the worlds.", key: "39:71", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Zumar division and eternal entry."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Keepers and Throne-encircling praise."}] }
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
    notes: "Wave 6 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 6).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(6, 12).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(12, 18).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(18, 23).map(c => c.candidateId);
extractions[4].topicCandidateIds = candidates.candidates.slice(23, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `039-az-zumar-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-063.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-063.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
