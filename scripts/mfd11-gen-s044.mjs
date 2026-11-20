// MFD-11 Wave 7: Surah 44 (Ad-Dukhan) genuine re-extraction.
// Covers 44:1-59 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "044-0001-0059.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 44:${n} not found`);
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

console.log("Generating Surah 44 (Ad-Dukhan) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T15:55:00.000Z";

const PASSAGES = [
  { id: "ext-044-p1", from: 1, to: 16,
    label: "Ha-Meem; by the clear Book sent down on a blessed night to warn; every precise matter made distinct on that night as a command from Us as mercy from your Lord the Hearing Knowing; Lord of heavens earth and between them if certain; no deity except Him gives life causes death your Lord and Lord of first forefathers; they in doubt amusing themselves; watch for Day sky brings visible smoke covering people painful torment; plea to remove torment claiming belief; how reminder when clear Messenger came then turned away said taught madman; We remove torment little you return disbelief; Day greatest assault take retribution",
    mainLabel: "Opening letters and oath by the clear Book grounding its descent on a blessed night as warning; every precise matter distinguished on that night as divine command and mercy from the Hearing Knowing Lord of heavens and earth; exclusive deity affirmed through life-giving and death-causing, linked to ancestral lordship; their doubtful amusement answered by the watch-command for the visible-smoke Day bringing painful torment; the belated plea for removal met with the reminder that a clear Messenger had already come and been dismissed as taught and mad; temporary relief promised followed by inevitable return to disbelief; the greatest-assault Day named for retribution" },
  { id: "ext-044-p2", from: 17, to: 33,
    label: "tried before them people Pharaoh noble messenger came; render servants Allah trustworthy messenger; be not haughty Allah clear authority; sought refuge Lord lest stone me; if not believe leave me alone; called Lord criminal people; set out My servants night pursued; leave sea stillness army drowned; left behind gardens springs crops noble sites comfort amused; thus inherited another people; heaven earth wept not nor reprieved; saved Children Israel humiliating torment; Pharaoh haughty transgressors; chose them knowledge over worlds; gave signs clear trial",
    mainLabel: "The prior trial of Pharaoh's people through a noble messenger demanding the release of Allah's servants as a trustworthy envoy bearing clear authority; his refuge-seeking against stoning and his conditional withdrawal if unbelieved; his appeal to his Lord naming them criminals followed by the night departure with pursuit and the sea left in stillness for the drowning army; enumeration of abandoned gardens, springs, crops, noble sites and amusement-comfort inherited by another people while heaven and earth neither wept nor granted reprieve; the Children of Israel saved from humiliating torment under a haughty transgressor, chosen by knowledge above the worlds and given signs containing clear trial" },
  { id: "ext-044-p3", from: 34, to: 42,
    label: "these disbelievers saying not but first death not resurrected; bring forefathers if truthful; better or people Tubba those before destroyed criminals; not create heavens earth between play; created except truth most not know; Day Judgement appointed time all; Day no relation avail relation nor helped; except those Allah mercy Exalted Might Merciful",
    mainLabel: "Disbelievers' denial reduced to asserting only the first death and rejecting resurrection, challenged to produce their forefathers if truthful; comparison with Tubba's people and earlier destroyed criminals affirming they are not superior; creation declared purposeful rather than playful, established in truth though most do not know; the Day of Judgement named the appointed time for all when no kinship avails and no help arrives save for those upon whom Allah has mercy, the Mighty and Merciful" },
  { id: "ext-044-p4", from: 43, to: 59,
    label: "tree zaqqum food sinful; like murky oil boils bellies boiling scalding water; seize drag midst Hellfire; pour head torment scalding water; taste honored noble; this used dispute; righteous secure place; gardens springs; wearing fine silk brocade facing each other; thus marry fair women large beautiful eyes; call every fruit safe secure; not taste death except first protected punishment Hellfire; bounty Lord great attainment; eased Quran tongue reminded; watch Muhammad they watching end",
    mainLabel: "The tree of Zaqqum identified as the sinner's food, boiling like murky oil within bellies; seizure and dragging into the Hellfire's midst followed by pouring scalding-water torment over the head with sarcastic address to the formerly honoured and noble, told this is what they disputed; the righteous placed in security within gardens and springs, dressed in fine silk and brocade facing one another, married to fair large-eyed women, calling for every fruit in safety, tasting no death beyond the first and protected from Hellfire as bounty and great attainment; the Quran eased on the Prophet's tongue for remembrance; mutual watching closed with the command to watch while they watch for his end" }
];

const SUB_LABELS = {
  "ext-044-p1": [
    "Ad-Dukhan opens with the Ha-Meem pair shared by this surah group",
    "Oath sworn by the clear Book",
    "Its descent on a blessed night declared alongside the purpose of warning",
    "Every precise matter made distinct on that night",
    "Each matter proceeding as a command from Us",
    "That sending framed as mercy from your Lord, the Hearing, the Knowing",
    "Lordship of heavens, earth and what lies between them affirmed for those who would be certain",
    "Exclusive deity declared through giving life and causing death, linked to ancestral lordship",
    "Their state described as doubtful amusement",
    "Command to watch for the Day when the sky brings visible smoke",
    "The smoke covering people as a painful torment",
    "Their plea for the torment's removal accompanied by a claim of belief",
    "Rhetorical question about receiving a reminder when a clear Messenger had already come",
    "Their turning away from him with the accusation that he was taught and mad",
    "Temporary removal of the torment announced alongside the certainty of their return to disbelief",
    "The Day of the greatest assault named as the occasion of retribution"
  ],
  "ext-044-p2": [
    "The prior trial of Pharaoh's people introduced with the arrival of a noble messenger",
    "His demand to render the servants of Allah as a trustworthy messenger",
    "Prohibition of haughtiness toward Allah backed by clear authority",
    "Refuge sought in the shared Lord against being stoned",
    "Conditional withdrawal offered if they refuse belief",
    "Appeal to his Lord naming them a criminal people",
    "Night departure commanded with the notice that they would be pursued",
    "The sea left in stillness because they were an army destined for drowning",
    "Enumeration of abandoned gardens and springs",
    "Abandoned crops and noble sites added to the list",
    "Abandoned comfort in which they had amused themselves",
    "All inherited by another people",
    "Heaven and earth declared not to have wept for them nor were they reprieved",
    "The Children of Israel saved from humiliating torment",
    "Pharaoh named a haughty one among the transgressors",
    "Israel chosen by knowledge above all the worlds",
    "Given signs containing a clear trial"
  ],
  "ext-044-p3": [
    "Disbelievers quoted as denying anything beyond the first death and rejecting resurrection",
    "Challenge to bring back their forefathers if they are truthful",
    "Rhetorical question whether they are better than Tubba's people and earlier nations",
    "Their destruction affirmed because they were criminals",
    "Creation of heavens, earth and what lies between denied as play",
    "Creation affirmed as being in truth though most do not know",
    "The Day of Judgement named the appointed time for them all",
    "No relation availing another on that Day and no help arriving",
    "Exception made for those upon whom Allah has mercy, the Exalted in Might, the Merciful"
  ],
  "ext-044-p4": [
    "The tree of Zaqqum introduced",
    "Identified as food for the sinful",
    "Described as boiling like murky oil within bellies",
    "Compared to the boiling of scalding water",
    "Command to seize and drag him into the midst of the Hellfire",
    "Command to pour over his head the torment of scalding water",
    "Sarcastic address telling him to taste as the formerly honoured and noble",
    "Declaration that this is what they used to dispute",
    "The righteous placed in a secure location",
    "Within gardens and springs",
    "Wearing fine silk and brocade, facing one another",
    "Married to fair women with large beautiful eyes",
    "Calling therein for every kind of fruit in safety and security",
    "Not tasting death therein except the first, protected from Hellfire's punishment",
    "Named as bounty from your Lord and the great attainment",
    "The Quran eased on the Prophet's tongue so they might be reminded",
    "Command to watch addressed to Muhammad while they watch for his end"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`44:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`44:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 44, surahName: "Ad-Dukhan",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 7 genuine re-extraction. Boundaries follow the text: P1 closes with the greatest-assault retribution (16) before the Pharaoh trial narrative opens (17); P2 ends with Israel's election and signs (33); P3 covers the denial-of-resurrection block through the mercy exception (34-42); P4 runs from Zaqqum through the righteous reward and the closing mutual-watch command (43-59).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (44:1-16) ===
{
  const e = extractions[0];
  const samee = findWord(6, ["\u0633","\u0645","\u064a","\u0639"]);
  const aleem = findWord(6, ["\u0639","\u0644","\u064a","\u0645"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "Hearing (editorial gloss)", keys: ["44:6"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["44:6"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["44:10"], excerpt: fv(10), description: "Then watch for the Day when the sky will bring a visible smoke." });

  e.humanConditionsAndSpiritualStates.push({ label: "Doubtful amusement as the disposition of those rejecting the message", keys: ["44:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Belated plea for torment removal accompanied by a claim of belief", keys: ["44:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Dismissal of the clear Messenger as taught and mad after turning away", keys: ["44:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Blessed-night descent framed as mercy from the Hearing Knowing Lord", keys: ["44:3","44:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Temporary relief granted with the certainty of return to disbelief", keys: ["44:15"], evidenceClass: "EXPLICIT_TEXT" });

  const dukhan = findWord(10, ["\u062f","\u062e","\u0627","\u0646"]);
  if (dukhan) e.terminology.push({ term: dukhan, transliteration: "dukhan", gloss: "visible smoke (editorial gloss)", keys: ["44:10"] });
}

// === POPULATE P2 (44:17-33) ===
{
  const e = extractions[1];

  e.propheticNarratives.push({ label: "Noble messenger sent to Pharaoh's people demanding release of Allah's servants; refuge sought against stoning; conditional withdrawal; appeal naming them criminals; night departure; sea left in stillness; drowning army; abandoned gardens, springs, crops, noble sites and comfort inherited by another people; heaven and earth neither wept nor reprieved; Israel saved from humiliating torment under a haughty transgressor, chosen by knowledge and given signs of clear trial", keys: ["44:17","44:18","44:19","44:20","44:21","44:22","44:23","44:24","44:25","44:26","44:27","44:28","44:29","44:30","44:31","44:32","44:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["44:19"], excerpt: fv(19), description: "Be not haughty with Allah; indeed I have come to you with clear authority." });

  e.humanConditionsAndSpiritualStates.push({ label: "Haughtiness toward Allah rejected by the messenger bearing clear authority", keys: ["44:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Comfort and amusement abandoned along with material wealth at destruction", keys: ["44:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Gardens, springs, crops, noble sites and amusement-comfort enumerated as abandoned inheritance", keys: ["44:25","44:26","44:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Heaven and earth declared not to have wept for the destroyed nor were they reprieved", keys: ["44:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Israel chosen by knowledge above the worlds and given signs containing clear trial", keys: ["44:32","44:33"], evidenceClass: "EXPLICIT_TEXT" });

  const sultan = findWord(19, ["\u0633","\u0644","\u0637","\u0646"]);
  if (sultan) e.terminology.push({ term: sultan, transliteration: "sultan", gloss: "clear authority (editorial gloss)", keys: ["44:19"] });
}

// === POPULATE P3 (44:34-42) ===
{
  const e = extractions[2];
  const aziz = findWord(42, ["\u0639","\u0632","\u064a","\u0632"]);
  const raheem = findWord(42, ["\u0631","\u062d","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["44:42"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["44:42"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Denial of resurrection reduced to asserting only the first death with a challenge to produce forefathers", keys: ["44:34","44:35","44:36"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Kinship rendered entirely useless on the Day of Judgement with no help arriving", keys: ["44:41"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creation declared purposeful and in truth against the assumption of play", keys: ["44:38","44:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Mercy as the sole exception to universal helplessness on the Day of Judgement", keys: ["44:42"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P4 (44:43-59) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Sarcastic address to the punished as formerly honoured and noble", keys: ["44:49"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Righteous placed in security within gardens and springs wearing silk and brocade", keys: ["44:51","44:52","44:53"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Protection from all death beyond the first and from Hellfire's punishment named as bounty and great attainment", keys: ["44:56","44:57"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Zaqqum tree as sinner's food boiling like murky oil within bellies", keys: ["44:43","44:44","44:45","44:46"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Fair large-eyed women as spouses in Paradise alongside every fruit called in safety", keys: ["44:54","44:55"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Seizure, dragging and scalding-water pouring as the punishment sequence for what they disputed", keys: ["44:47","44:48","44:50"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Quran eased on the Prophet's tongue for remembrance paired with mutual watching", keys: ["44:58","44:59"], evidenceClass: "EXPLICIT_TEXT" });

  const zaqqum = findWord(43, ["\u0632","\u0642","\u0648","\u0645"]);
  if (zaqqum) e.terminology.push({ term: zaqqum, transliteration: "zaqqum", gloss: "tree of Zaqqum (editorial gloss)", keys: ["44:43"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `044-ad-dukhan-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 044-ad-dukhan-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-044-p1,ext-044-p2,ext-044-p3,ext-044-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1521", label: "Blessed-night descent of the clear Book as warning and mercy", def: "In 44:2-6: By the clear Book; indeed We sent it down during a blessed night, indeed We were to warn; on that night every precise matter is made distinct as a command from Us as mercy from your Lord, the Hearing, the Knowing.", key: "44:3", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Laylah mubarakah descent."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Rahmah as revelatory motive."}] },
  { id: "cand-1522", label: "Visible smoke covering people as a painful torment", def: "In 44:10-11: Then watch for the Day when the sky will bring a visible smoke covering the people; this is a painful torment.", key: "44:10", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Dukhan as eschatological sign."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Adhab alim descriptor."}] },
  { id: "cand-1523", label: "Belated plea for torment removal after dismissing the clear Messenger", def: "In 44:12-14: Our Lord remove from us the torment, indeed we are believers; how will there be for them a reminder when a clear Messenger had come to them, then they turned away and said taught and mad.", key: "44:12", overlap: [{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Too-late iman."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Clear Messenger rejected."}] },
  { id: "cand-1524", label: "Greatest-assault Day as the occasion of retribution", def: "In 44:16: The Day We will strike with the greatest assault, indeed We will take retribution.", key: "44:16", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Al-batshah al-kubra."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Intiqam as divine response."}] },

  { id: "cand-1525", label: "Noble messenger demanding release of Allah's servants with clear authority", def: "In 44:18-19: Render to me the servants of Allah, indeed I am to you a trustworthy messenger; be not haughty with Allah, indeed I have come to you with clear authority.", key: "44:18", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Rasul karim demand."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Amin with sultan mubin."}] },
  { id: "cand-1526", label: "Night departure with pursuit and sea left in stillness for drowning", def: "In 44:23-24: Then set out with My servants by night, indeed you are to be pursued; and leave the sea in stillness, indeed they are an army to be drowned.", key: "44:23", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Isra bi-'ibadi laylan."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Sea stillness as miracle."}] },
  { id: "cand-1527", label: "Abandoned wealth and comfort inherited by another people without cosmic mourning", def: "In 44:25-29: How much they left behind of gardens and springs and crops and noble sites and comfort wherein they were amused; thus We caused another people to inherit it; and the heaven and earth wept not for them nor were they reprieved.", key: "44:25", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Material legacy as ayah."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"No cosmic grief."}] },
  { id: "cand-1528", label: "Israel chosen by knowledge above the worlds with signs of clear trial", def: "In 44:32-33: And We certainly chose them by knowledge over all the worlds; and We gave them of signs that in which there was a clear trial.", key: "44:32", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Ikhtiyar bi-'ilm."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Ayat fiha bala' mubin."}] },

  { id: "cand-1529", label: "Denial of resurrection challenged to produce forefathers", def: "In 44:34-36: Indeed these are saying there is not but our first death and we will not be resurrected; then bring our forefathers if you should be truthful.", key: "44:34", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Materialist denial."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Impossible demand as refutation."}] },
  { id: "cand-1530", label: "Creation affirmed as purposeful truth against the assumption of play", def: "In 44:38-39: And We did not create the heavens and earth and that between them in play; We did not create them except in truth but most of them do not know.", key: "44:38", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"La'ib negated."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq affirmed."}] },
  { id: "cand-1531", label: "Kinship useless on Judgement Day with mercy as sole exception", def: "In 44:41-42: The Day when no relation will avail a relation at all nor will they be helped; except those on whom Allah has mercy, indeed He is the Exalted in Might, the Merciful.", key: "44:41", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"La yughni mawla."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Rahmah as only rescue."}] },

  { id: "cand-1532", label: "Zaqqum as sinner's food boiling like murky oil", def: "In 44:43-46: Indeed the tree of Zaqqum is food for the sinful; like murky oil it boils within bellies like the boiling of scalding water.", key: "44:43", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Zaqqum food imagery."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Hamim boiling parallel."}] },
  { id: "cand-1533", label: "Righteous in security with silk, brocade, fair spouses and every fruit", def: "In 44:51-55: Indeed the righteous will be in a secure place within gardens and springs wearing fine silk and brocade facing each other; thus We will marry them to fair women with large beautiful eyes; they will call therein for every fruit safe and secure.", key: "44:51", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Maqam amin description."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Reward tied to righteousness."}] },
  { id: "cand-1534", label: "Protection from second death and Hellfire as bounty and great attainment", def: "In 44:56-57: They will not taste death therein except the first death and He will have protected them from the punishment of Hellfire as bounty from your Lord; that is the great attainment.", key: "44:56", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Fawz azim defined."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Fadl min rabbika."}] },
  { id: "cand-1535", label: "Quran eased on the Prophet's tongue for remembrance amid mutual watching", def: "In 44:58-59: And indeed We have eased the Quran in your tongue that they might be reminded; so watch O Muhammad, indeed they are watching.", key: "44:58", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Yassarna facilitation."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Fartaqib endurance command."}] }
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
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 8).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(8, 11).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(11, 15).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `044-ad-dukhan-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-068.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-068.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
