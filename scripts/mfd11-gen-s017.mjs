// MFD-11 Wave 2: Surah 17 (Al-Isra) genuine re-extraction.
// Covers 17:1-111 in 4 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "017-0001-0111.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 17:${n} not found`);
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

console.log("Generating Surah 17 (Al-Isra) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T13:00:00.000Z";

const PASSAGES = [
  { id: "ext-017-p1", from: 1, to: 30,
    label: "Isra miracle linking two sacred mosques; Musa scripture as Israelite guidance; Bani Israel dual corruption-elevation cycle; Quran guides to most suitable; human hastiness vs divine patience; cosmic signs for temporal navigation; individual responsibility via neck-book metaphor; ethical framework: parental kindness orphan protection covenant commercial justice epistemic humility anti-arrogance; wisdom as divine grant",
    mainLabel: "Night Journey as supreme sign linking Masjid Haram to Masjid Aqsa; Musa scripture establishing exclusive divine disposal for Israelites; dual rise-fall cycle with prophetic warning; Quran as guide to aslah with reward-punishment duality; hastiness in supplication contrasted with divine timing; cosmic signs enabling calendar and navigation; individual accountability through neck-bound record; comprehensive ethics spanning family commerce knowledge conduct; hikmah as selective divine bestowal enabling dhikr" },
  { id: "ext-017-p2", from: 31, to: 60,
    label: "Infanticide prohibition grounded in divine provision; sexual immorality as fahishah; murder prohibition with just-cause exception; orphan property protection; covenant fulfillment; commercial justice; epistemic humility; anti-arrogance command; shirk consequence as disgrace; parental kindness with tawheed; universal term principle; provision expansion-restriction; prophetic identity as clear warner; closing worship-tasbih-sujud triad",
    mainLabel: "Ethical decalogue: infanticide forbidden via rizq guarantee; zina as indecency-evil path; qatl prohibited except bi'l-haqq with heir authority limit; orphan wealth protected until maturity; ahd fulfillment accountable; honest measurement commanded; knowledge pursuit bounded by faculties; arrogance physically impossible and divinely hated; wisdom granted selectively; shirk produces khizy; birr al-walidayn integrated with tawheed; ajal musamma preventing premature judgment; rizq distribution as divine prerogative; nadhir mubin as prophetic identity; tasbih-sujud-ibadah closing triad" },
  { id: "ext-017-p3", from: 61, to: 89,
    label: "Iblis refusal based on clay-contempt; satanic multi-directional ambush limited by divine protection of believers; Quran uniqueness challenge; gradual revelation mode; disbeliever demands for miracles rejected; divine sufficiency against mockers; chest-constriction remedy through tasbih",
    mainLabel: "Iblis prostration refusal rooted in material superiority claim over clay-created Adam; satanic strategy encompassing voice-incitement military-economic assault shared-wealth offspring promises; divine protection limiting satanic authority over believing servants; Quran inimitability challenge despite jinn-human cooperation impossibility; gradual revelation (mufrriqan) enabling paced recitation; miracle demands catalogued and deferred; divine sufficiency (kafa) against mockers replacing prophetic anxiety; tasbih-sujud as prescribed remedy for chest-constriction" },
  { id: "ext-017-p4", from: 90, to: 111,
    label: "Musa nine signs before Firawn; drowning as collective punishment; post-Firawn Israelite settlement; Quran sent in truth descended in truth; believer response: falling prostrate weeping increased submission; flexible divine naming; closing tawheed tasbih affirming no son no partner no protector",
    mainLabel: "Nine evident signs given to Musa establishing prophetic authentication; Firawn's dismissal as sorcery leading to collective drowning; post-destruction Israelite territorial settlement with eschatological gathering promise; Quranic truthfulness in both sending and descending; knowledge-bearers' prostrate-weeping response demonstrating epistemic humility; flexible naming (Allah/Rahman) with asma al-husna principle; closing tasbih affirming absolute divine uniqueness: no son no sharik no wali from weakness; takbir as final affirmation" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`17:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`17:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 17, surahName: "Al-Isra",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 2 genuine re-extraction. P1=Isra-BaniIsrael-ethics(1-30), P2=ethical-decalogue(31-60), P3=Iblis-Quran-challenge(61-89), P4=Musa-signs-closing-tawheed(90-111).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE ANALYTICAL ARRAYS ===

// P1 (17:1-30)
{
  const e = extractions[0];
  const allah = findWord(1, ["\u0627","\u0644","\u0644","\u0647"]);
  const samee = findWord(1, ["\u0633","\u0645","\u064a","\u0639"]);
  const baseer = findWord(1, ["\u0628","\u0635","\u064a","\u0631"]);
  if (allah) e.divineNamesAndAttributes.push({ term: allah, transliteration: "Allah", gloss: "God (editorial gloss)", keys: ["17:1"] });
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "All-Hearing (editorial gloss)", keys: ["17:1"] });
  if (baseer) e.divineNamesAndAttributes.push({ term: baseer, transliteration: "Baseer", gloss: "All-Seeing (editorial gloss)", keys: ["17:1"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["17:23"], excerpt: fv(23), description: "Your Lord has decreed that you worship none but Him and do good to parents." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["17:23"], excerpt: fv(23), description: "Do not say to them uff nor repel them but speak noble word." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["17:24"], excerpt: fv(24), description: "Lower to them the wing of humility out of mercy and say My Lord have mercy upon them as they raised me small." });
  // Commands 17:36-37 moved to P2 where they belong

  e.propheticNarratives.push({ label: "Isra miracle: Servant taken by night from Masjid Haram to Masjid Aqsa whose surroundings blessed to show divine signs", keys: ["17:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Bani Israel dual corruption-elevation cycle: first destruction by mighty servants then return victory then final promise", keys: ["17:4","17:5","17:6","17:7","17:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Human hastiness in supplication: man prays for evil as he prays for good; man is ever hasty", keys: ["17:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Individual responsibility: every person's deeds attached to neck; Day of Resurrection book brought wide open", keys: ["17:13","17:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Parent-child relationship: divine decree linking tawheed with birr al-walidayn as inseparable obligations", keys: ["17:23","17:24"], evidenceClass: "EXPLICIT_TEXT" });

  const isra = findWord(1, ["\u0623","\u0633","\u0631","\u0649"]);
  if (isra) e.terminology.push({ term: isra, transliteration: "isra'", gloss: "night journey (editorial gloss)", keys: ["17:1"] });
}

// P2 (17:31-60)
{
  const e = extractions[1];
  const hakeem = findWord(39, ["\u062d","\u0643","\u064a","\u0645"]);
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["17:39"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["17:31"], excerpt: fv(31), description: "Do not kill your children fearing poverty; We provide for them and for you; killing them is great sin." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["17:32"], excerpt: fv(32), description: "Do not approach unlawful sexual intercourse; it is indecency and evil way." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["17:33"], excerpt: fv(33), description: "Do not kill soul Allah has forbidden except by right; whoever killed unjustly given authority to heir." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["17:34"], excerpt: fv(34), description: "Do not approach orphan's property except in best way until reaching maturity; fulfill covenant." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["17:35"], excerpt: fv(35), description: "Give full measure when measuring weigh with just scales; that is better and best determination." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["17:36"], excerpt: fv(36), description: "Do not pursue that of which you have no knowledge; hearing sight heart all will be questioned." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["17:37"], excerpt: fv(37), description: "Do not walk upon earth arrogantly; you will never tear mountains nor reach height of stars." });

  e.humanConditionsAndSpiritualStates.push({ label: "Epistemic humility: prohibition of pursuing what one has no knowledge of; all faculties accountable", keys: ["17:36"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Anti-arrogance: physical impossibility demonstration — cannot tear mountains or reach star-heights", keys: ["17:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Commercial justice framework: honest measurement and weighing as divine command with practical benefit", keys: ["17:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Orphan property protection until maturity as fiduciary obligation", keys: ["17:34"], evidenceClass: "EXPLICIT_TEXT" });

  const fahisha = findWord(32, ["\u0641","\u062d","\u0634"]);
  if (fahisha) e.terminology.push({ term: fahisha, transliteration: "fahisha", gloss: "indecency/gross immorality (editorial gloss)", keys: ["17:32"] });
}

// P3 (17:61-89)
{
  const e = extractions[2];
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["17:88"], excerpt: fv(88), description: "Say: If mankind and jinn gathered to produce like this Quran they could not produce its like even mutual support." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["17:81"], excerpt: fv(81), description: "Say: Truth has come and falsehood has perished; indeed falsehood is ever-perishing." });

  e.propheticNarratives.push({ label: "Iblis refusal to prostrate before Adam based on material superiority: should I prostrate to one created from clay?", keys: ["17:61"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Satanic strategy: incite with voice assault with horses foot soldiers share wealth offspring make promises; but no authority over believing servants", keys: ["17:62","17:63","17:64","17:65"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Quran as healing and mercy for believers increasing wrongdoers only in loss", keys: ["17:82"], evidenceClass: "EXPLICIT_TEXT" });
  // Miracle demands (17:90-93) moved to P4 where they belong
  e.humanConditionsAndSpiritualStates.push({ label: "Satanic promises as deception producing only delusion (ghurur)", keys: ["17:64"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine protection of believers: over My servants you have no authority; sufficient is your Lord as Disposer of affairs", keys: ["17:65"], evidenceClass: "EXPLICIT_TEXT" });

  const quran = findWord(88, ["\u0642","\u0631","\u0622","\u0646"]);
  if (quran) e.terminology.push({ term: quran, transliteration: "Quran", gloss: "recitation/scripture (editorial gloss)", keys: ["17:88"] });
}

// P4 (17:90-111)
{
  const e = extractions[3];
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["17:111"], excerpt: fv(111), description: "Say: Praise to Allah who has not taken son nor partner in dominion nor protector from weakness; and magnify Him greatly." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["17:110"], excerpt: fv(110), description: "Call upon Allah or call upon Rahman; whichever name you call to Him belong best names; do not recite prayer aloud nor quietly seek middle way." });

  e.propheticNarratives.push({ label: "Musa given nine evident signs before Firawn who dismissed as sorcery; drowned with followers collectively", keys: ["17:101","17:102","17:103"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Disbeliever demands for specific miracles: spring gushing garden palace river gold tablet angel — all deferred", keys: ["17:90","17:91","17:92","17:93"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Knowledge-bearers' response to Quran: falling upon faces weeping with increased humble submission (khushu')", keys: ["17:107","17:108","17:109"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Quran sent in truth descended in truth; prophet sent only as bearer of glad tidings and warner", keys: ["17:105"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Flexible divine naming: Allah or Rahman interchangeable; to Him belong asma al-husna", keys: ["17:110"], evidenceClass: "EXPLICIT_TEXT" });

  const khushu = findWord(109, ["\u062e","\u0634","\u0639"]);
  if (khushu) e.terminology.push({ term: khushu, transliteration: "khushu'", gloss: "humble submission/reverence (editorial gloss)", keys: ["17:109"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `017-al-isra-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 017-al-isra-p${num}.json`);
}

// === CANDIDATES (cand-0677..cand-0716, 40 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-017-p1,ext-017-p2,ext-017-p3,ext-017-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0677..0686)
  { id: "cand-0677", label: "Night Journey (Isra) as supreme divine sign linking sacred mosques", def: "In 17:1: Exalted is He who took His Servant by night from Masjid Haram to Masjid Aqsa whose surroundings We blessed to show him Our signs.", key: "17:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Isra as ayat kubra."},{topicId:"muhammad-story",layer:"scholarly",relationship:"same-concept",note:"Prophetic night journey."}] },
  { id: "cand-0678", label: "Bani Israel dual corruption-elevation cycle with prophetic warning", def: "In 17:4-8: Conveyed in Scripture you will cause corruption twice; first promise fulfilled by mighty servants; return victory; final promise enters Masjid.", key: "17:4", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Cyclical rise-fall as divine pattern."},{topicId:"divine-wrath",layer:"scholarly",relationship:"related-not-identical",note:"Destruction following corruption."}] },
  { id: "cand-0679", label: "Quran as guide to most suitable with dual outcome", def: "In 17:9: Indeed this Quran guides to that which is most suitable (aqwam) and gives good tidings to believers doing righteous deeds of great reward.", key: "17:9", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Aqwam as superlative guidance."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Reward linked to belief-action."}] },
  { id: "cand-0680", label: "Human hastiness in supplication contrasted with divine patience", def: "In 17:11: Man supplicates for evil as he supplicates for good; man is ever hasty.", key: "17:11", overlap: [{topicId:"patience-haste",layer:"scholarly",relationship:"same-concept",note:"Ajul as inherent human trait."},{topicId:"supplication",layer:"curated",relationship:"related-not-identical",note:"Misguided dua from haste."}] },
  { id: "cand-0681", label: "Individual responsibility through neck-bound record metaphor", def: "In 17:13-14: Every person's deeds We attached to his neck; Day of Resurrection bring book wide open read sufficient reckoner against yourself.", key: "17:13", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Kitab manshur as personal record."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Individual reckoning."}] },
  { id: "cand-0682", label: "Parental kindness decreed alongside tawheed as inseparable obligations", def: "In 17:23-24: Your Lord decreed worship none but Him and good to parents; if old age reaches say not uff speak noble word lower wing of mercy.", key: "17:23", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Birr al-walidayn paired with tawheed."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Qawl karim and janah al-dhull."}] },
  { id: "cand-0683", label: "Cosmic signs enabling temporal navigation and calendar", def: "In 17:12: We made night day signs erased sign of night made sign of day visible seeking bounty from Lord knowing number years and account.", key: "17:12", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Celestial bodies as timekeeping signs."},{topicId:"intellect-importance",layer:"scholarly",relationship:"related-not-identical",note:"Calculation enabled by signs."}] },
  { id: "cand-0684", label: "Epistemic humility prohibiting pursuit beyond faculties", def: "In 17:36: Do not pursue that of which you have no knowledge; hearing sight heart all will be questioned.", key: "17:36", overlap: [{topicId:"knowledge-seeking",layer:"scholarly",relationship:"same-concept",note:"Bounded knowledge pursuit."},{topicId:"self-accountability",layer:"scholarly",relationship:"related-not-identical",note:"Faculty accountability."}] },
  { id: "cand-0685", label: "Anti-arrogance command with physical impossibility demonstration", def: "In 17:37: Do not walk upon earth arrogantly; you will never tear mountains nor reach height of stars.", key: "17:37", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Mashy marahan as prohibited posture."},{topicId:"balance-moderation",layer:"scholarly",relationship:"related-not-identical",note:"Physical limits demonstrating humility."}] },
  { id: "cand-0686", label: "Wisdom as selective divine grant enabling remembrance", def: "In 17:39: That is from what your Lord revealed of wisdom; whoever granted wisdom granted much good; none remembers except understanding.", key: "17:39", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"same-concept",note:"Hikmah as wahy content."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Ulu al-albab as recipients."}] },

  // P2 (cand-0687..0696)
  { id: "cand-0687", label: "Infanticide prohibition grounded in divine provision guarantee", def: "In 17:31: Do not kill your children fearing poverty; We provide for them and for you; their killing is great sin.", key: "17:31", overlap: [{topicId:"right-to-life",layer:"scholarly",relationship:"same-concept",note:"Child life protected by rizq guarantee."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Rizq trust replacing fear."}] },
  { id: "cand-0688", label: "Sexual immorality classified as indecency and evil path", def: "In 17:32: Do not approach zina; it is fahisha and evil way.", key: "17:32", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Zina as moral boundary."},{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"La taqrabu as preventive prohibition."}] },
  { id: "cand-0689", label: "Murder prohibition with just-cause exception and heir authority", def: "In 17:33: Do not kill soul Allah forbidden except by right; whoever killed unjustly given authority to heir not exceed in killing.", key: "17:33", overlap: [{topicId:"right-to-life",layer:"scholarly",relationship:"same-concept",note:"Nafs muharramah with haqq exception."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Heir authority bounded by proportionality."}] },
  { id: "cand-0690", label: "Orphan property protection as fiduciary obligation until maturity", def: "In 17:34: Do not approach orphan property except in best way until reaching maturity.", key: "17:34", overlap: [{topicId:"orphan-care",layer:"scholarly",relationship:"same-concept",note:"Mal al-yatim as protected trust."},{topicId:"justice",layer:"curated",relationship:"related-not-identical",note:"Fiduciary standard."}] },
  { id: "cand-0691", label: "Commercial justice through honest measurement and weighing", def: "In 17:35: Give full measure when measuring weigh with just scales; that is better and best determination.", key: "17:35", overlap: [{topicId:"business-ethics",layer:"scholarly",relationship:"same-concept",note:"Kayl-wazn justice."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Qistas mustaqim."}] },
  { id: "cand-0692", label: "Covenant fulfillment as accountable obligation", def: "In 17:34: Fulfill the covenant; indeed the covenant will be questioned about.", key: "17:34", overlap: [{topicId:"covenants-ahd",layer:"scholarly",relationship:"same-concept",note:"Ahd as mas'ul."},{topicId:"self-accountability",layer:"scholarly",relationship:"related-not-identical",note:"Covenant accountability."}] },
  { id: "cand-0693", label: "Shirk consequence as disgrace and abandonment", def: "In 17:22: Do not set up another deity with Allah lest you sit disgraced abandoned.", key: "17:22", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Madhmum makhdhulan as shirk outcome."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"related-not-identical",note:"Exclusive worship preventing disgrace."}] },
  { id: "cand-0694", label: "Universal term principle preventing premature judgment", def: "In 17:49: Every nation has appointed term; when term comes cannot delay hour nor advance it.", key: "17:49", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"related-not-identical",note:"Ajal as fixed collective deadline."}] },
  { id: "cand-0695", label: "Provision expansion-restriction as divine prerogative", def: "In 17:30: Indeed your Lord extends provision for whom He wills and restricts; He is ever Knowing Seeing of His servants.", key: "17:30", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Bast-qadr as divine control."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Acceptance of divine distribution."}] },
  { id: "cand-0696", label: "Closing worship-tasbih-sujud triad extending until death", def: "In 17:111: Say praise to Allah who has not taken son nor partner nor protector from weakness; magnify Him greatly.", key: "17:111", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Takbir as closing act."},{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Triple negation affirming uniqueness."}] },

  // P3 (cand-0697..0706)
  { id: "cand-0697", label: "Iblis refusal rooted in material superiority claim over clay creation", def: "In 17:61: When We said to angels prostrate to Adam they prostrated except Iblis; said should I prostrate to one You created from clay?", key: "17:61", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Material hierarchy as satanic logic."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Kibr originating in creation-contempt."}] },
  { id: "cand-0698", label: "Satanic multi-directional strategy limited by divine protection", def: "In 17:62-65: Incite with voice assault with horses foot soldiers share wealth offspring make promises; over My servants no authority.", key: "17:62", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Comprehensive but bounded strategy."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Divine kifayah as protection."}] },
  { id: "cand-0699", label: "Quran inimitability challenge despite jinn-human cooperation", def: "In 17:88: Say if mankind and jinn gathered to produce like this Quran they could not produce its like even mutual support.", key: "17:88", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"I'jaz affirmed against combined effort."},{topicId:"jinn-creation",layer:"scholarly",relationship:"related-not-identical",note:"Jinn included in challenge scope."}] },
  { id: "cand-0700", label: "Gradual revelation enabling paced recitation and comprehension", def: "In 17:106: Quran We separated by intervals (faraqnahu) that you might recite to people over prolonged period; sent down gradually.", key: "17:106", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Tafriq as pedagogical design."},{topicId:"quran-preservation",layer:"scholarly",relationship:"related-not-identical",note:"Gradual descent ensuring retention."}] },
  { id: "cand-0701", label: "Truth-arrival falsehood-perishing as eschatological certainty", def: "In 17:81: Say truth has come and falsehood has perished; indeed falsehood is ever-perishing.", key: "17:81", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Haqq-batil binary."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Batil zahuq as inevitable."}] },
  { id: "cand-0702", label: "Quran as healing and mercy for believers increasing wrongdoers in loss", def: "In 17:82: We send down Quran as healing and mercy for believers; it increases wrongdoers only in loss.", key: "17:82", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Shifa-rahmah duality."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Differential effect based on reception."}] },
  { id: "cand-0703", label: "Disbeliever miracle demands catalogued and deferred", def: "In 17:90-93: Demands for spring garden palace river gold tablet angel; responded nothing prevented except prior denial pattern.", key: "17:90", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Demanded vs given signs."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Demand as ignorance marker."}] },
  { id: "cand-0704", label: "Divine sufficiency against mockers replacing prophetic anxiety", def: "In 17:95: Say sufficient is your Lord as guardian between me and you; He is ever Seeing Knowing of His servants.", key: "17:95", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Kafa billahi as anxiety remedy."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Divine guardianship enabling endurance."}] },
  { id: "cand-0705", label: "Satanic promises as deception producing only delusion", def: "In 17:64: Make promises to them; Satan promises them only delusion (ghurur).", key: "17:64", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Wa'd shaytan as ghurur."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Delusion vs truth."}] },
  { id: "cand-0706", label: "Hell as sufficient recompense for satanic followers", def: "In 17:63: Whoever follows you among them Hell will be recompense ample and sufficient.", key: "17:63", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Jahannam as jazaa'."},{topicId:"justice-oppression",layer:"scholarly",relationship:"related-not-identical",note:"Ample recompense."}] },

  // P4 (cand-0707..0716)
  { id: "cand-0707", label: "Musa nine evident signs as prophetic authentication", def: "In 17:101: We gave Musa nine evident signs; ask Children of Israel when he came to them.", key: "17:101", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Ti' ayat bayyinat."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Evident signs as proof."}] },
  { id: "cand-0708", label: "Firawn dismissal as sorcery leading to collective drowning", def: "In 17:101-103: Firawn said I think you bewitched O Musa; said you know none sent these except Lord heavens earth as evidences; intended to drive out so We drowned him and all with him.", key: "17:101", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Sihr accusation and drowning."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Collective punishment."}] },
  { id: "cand-0709", label: "Post-destruction Israelite settlement with eschatological gathering", def: "In 17:104: Said after Pharaoh to Children of Israel dwell in land; when promise of Hereafter comes We bring you forth in gathering.", key: "17:104", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Wa'd al-akhirah as gathering."},{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Post-Firawn settlement."}] },
  { id: "cand-0710", label: "Quranic truthfulness in both sending and descending", def: "In 17:105: With truth We sent it down and with truth it descended; sent you only as bearer of glad tidings and warner.", key: "17:105", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq dual affirmation."},{topicId:"prophet-definition",layer:"scholarly",relationship:"related-not-identical",note:"Bashir-nadhir function."}] },
  { id: "cand-0711", label: "Knowledge-bearers prostrate-weeping response demonstrating epistemic humility", def: "In 17:107-109: Those given knowledge before it fall upon faces weeping when recited; increases them in humble submission.", key: "17:107", overlap: [{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Ilm producing khushu."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Emotional-intellectual integration."}] },
  { id: "cand-0712", label: "Flexible divine naming with asma al-husna principle", def: "In 17:110: Say call upon Allah or call upon Rahman; whichever name you call to Him belong best names.", key: "17:110", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Naming flexibility within unity."},{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Asma husna as attribute framework."}] },
  { id: "cand-0713", label: "Closing tasbih affirming absolute divine uniqueness", def: "In 17:111: Praise to Allah who has not taken son nor partner in dominion nor protector from weakness; magnify Him greatly.", key: "17:111", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Triple negation: no son no sharik no wali."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Takbir as closing dhikr."}] },
  { id: "cand-0714", label: "Prayer volume moderation between loudness and silence", def: "In 17:110: Do not recite prayer aloud nor quietly seek between that a middle way.", key: "17:110", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Wasatiyyah in salah volume."},{topicId:"balance-moderation",layer:"scholarly",relationship:"same-concept",note:"Middle path in worship."}] },
  { id: "cand-0715", label: "Believer recognition of fulfilled divine promise", def: "In 17:108: They say exalted is our Lord indeed promise of our Lord has been fulfilled.", key: "17:108", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"related-not-identical",note:"Promise fulfillment strengthening iman."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Confirmed trust."}] },
  { id: "cand-0716", label: "Quran increasing believers in humble submission through recitation", def: "In 17:109: They fall upon faces weeping and it increases them in humble submission (khushu').", key: "17:109", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Khushu as Quranic effect."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Transformative recitation."}] }
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
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(30, 40).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `017-al-isra-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-041.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-041.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
