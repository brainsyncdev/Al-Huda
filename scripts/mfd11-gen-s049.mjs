// MFD-11 Wave 8: Surah 49 (Al-Hujurat) genuine re-extraction.
// Covers 49:1-18 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "049-0001-0018.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 49:${n} not found`);
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

console.log("Generating Surah 49 (Al-Hujurat) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T16:25:00.000Z";

const PASSAGES = [
  { id: "ext-049-p1", from: 1, to: 8,
    label: "O believed do not put yourselves before Allah Messenger fear Allah Hearing Knowing; do not raise voices above voice Prophet loud speech like loudness some others lest deeds become worthless perceive not; lower voices before Messenger hearts tested righteousness forgiveness great reward; call you behind chambers most not use reason; patient until come out better Forgiving Merciful; disobedient one information investigate lest harm people ignorance become regretful; know among you Messenger Allah obey much matter difficulty; endeared faith made pleasing hearts made hateful disbelief defiance disobedience rightly guided; bounty favour Allah Knowing Wise",
    mainLabel: "Believers commanded not to precede Allah and His Messenger but to fear Him, the Hearing Knowing; prohibition against raising voices above the Prophet's or being loud as with peers, lest deeds become worthless unperceived; those lowering their voices identified as having hearts tested for righteousness earning forgiveness and great reward; callers from behind the chambers named as mostly lacking reason, patience noted as better under divine forgiveness and mercy; the fasiq-information rule requiring investigation to prevent ignorant harm and subsequent regret; the Prophet's presence among them affirmed with obedience-warning that excessive compliance would cause difficulty, countered by Allah endearing faith and making it pleasing while rendering disbelief, defiance and disobedience hateful — those being the guided; this framed as bounty and favour from the Knowing Wise" },
  { id: "ext-049-p2", from: 9, to: 13,
    label: "Two factions believers fight make settlement between two; one oppresses other fight against oppresses returns ordinance Allah; returns make settlement justice act justly Allah loves just; believers brothers make settlement between brothers fear Allah receive mercy; let not people ridicule people perhaps better; nor women ridicule women perhaps better; do not insult one another do not call offensive nicknames; wretched name disobedience after faith; whoever not repent wrongdoers; avoid much negative assumption some assumption sin; do not spy backbite each other; would one like eat flesh brother dead detest; fear Allah Accepting repentance Merciful; mankind created male female made peoples tribes know one another; most noble sight Allah most righteous Knowing Acquainted",
    mainLabel: "Inter-believer conflict resolution: settlement between fighting factions, fighting the oppressor until return to Allah's ordinance, then just settlement since Allah loves the just; brotherhood declared with mutual settlement urged alongside taqwa for mercy; ridicule prohibited between peoples and between women since the ridiculed may be superior; mutual insult and offensive nicknames forbidden, naming disobedience after faith as wretched and non-repenters as wrongdoers; excessive negative assumption warned against since some is sin; spying and backbiting prohibited with the dead-brother-flesh analogy producing revulsion; taqwa urged under the Repentance-Acceptor and Merciful; humanity addressed as created from male and female into peoples and tribes for mutual recognition, nobility defined exclusively by righteousness under the Knowing Acquainted" },
  { id: "ext-049-p3", from: 14, to: 18,
    label: "Bedouins say believed say not yet believed say submitted faith not yet entered hearts; obey Allah Messenger not deprive deeds anything Forgiving Merciful; believers only believed Allah Messenger doubt not strive properties lives cause Allah truthful; say acquaint Allah religion Allah knows whatever heavens earth Knowing all things; consider favour accepted Islam say do not consider Islam favour me rather Allah conferred favour guided faith truthful; Allah knows unseen heavens earth Seeing what do",
    mainLabel: "Bedouins claiming belief told they have only submitted since faith has not yet entered their hearts, with obedience preserving deeds under the Forgiving Merciful; true believers defined as those believing in Allah and His Messenger without doubt and striving with properties and lives in Allah's cause — they are the truthful; the absurdity of acquainting Allah with one's religion when He already knows all in heavens and earth; their consideration of Islam as a favour to the Prophet reversed — Allah conferred the favour by guiding them to faith if they are truthful; closing affirmation that Allah knows the unseen of heavens and earth and sees all deeds" }
];

const SUB_LABELS = {
  "ext-049-p1": [
    "Believers commanded not to precede Allah and His Messenger but to fear Him, the Hearing and Knowing",
    "Prohibition against raising voices above the Prophet's or being loud as with peers, lest deeds become worthless unperceived",
    "Those lowering their voices identified as having hearts tested for righteousness, earning forgiveness and great reward",
    "Callers from behind the chambers named as mostly lacking reason",
    "Patience until the Prophet comes out noted as better, under divine forgiveness and mercy",
    "The fasiq-information rule requiring investigation to prevent ignorant harm and subsequent regret",
    "The Prophet's presence affirmed with warning that excessive obedience would cause difficulty, countered by Allah endearing faith and making disbelief hateful",
    "This guidance framed as bounty and favour from the Knowing and Wise"
  ],
  "ext-049-p2": [
    "Settlement mandated between fighting believer factions, with fighting the oppressor until return to Allah's ordinance, then just settlement since Allah loves the just",
    "Believers declared brothers with mutual settlement urged alongside taqwa for mercy",
    "Ridicule prohibited between peoples and between women since the ridiculed may be superior; mutual insult and offensive nicknames forbidden as wretched disobedience after faith",
    "Excessive negative assumption, spying and backbiting prohibited with the dead-brother-flesh analogy producing revulsion, taqwa urged under the Repentance-Acceptor",
    "Humanity created from male and female into peoples and tribes for mutual recognition, nobility defined exclusively by righteousness under the Knowing Acquainted"
  ],
  "ext-049-p3": [
    "Bedouins claiming belief told they have only submitted since faith has not yet entered their hearts, with obedience preserving deeds under the Forgiving and Merciful",
    "True believers defined as those believing without doubt and striving with properties and lives in Allah's cause — they are the truthful",
    "The absurdity of acquainting Allah with one's religion when He already knows all in heavens and earth",
    "Their consideration of Islam as a favour reversed — Allah conferred the favour by guiding them to faith if truthful",
    "Closing affirmation that Allah knows the unseen of heavens and earth and sees all deeds"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`49:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`49:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 49, surahName: "Al-Hujurat",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 8 genuine re-extraction. Boundaries follow the text: P1 closes with the bounty-and-favour framing (8) before the inter-believer conflict rules open (9); P2 ends with the universal nobility-by-righteousness declaration (13) before the bedouin iman-submission distinction begins (14); P3 runs from that distinction through the true-believer definition, the favour reversal and the closing unseen-knowledge affirmation (14-18).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (49:1-8) ===
{
  const e = extractions[0];
  const samee = findWord(1, ["\u0633","\u0645","\u064a","\u0639"]);
  const aleem = findWord(1, ["\u0639","\u0644","\u064a","\u0645"]);
  const ghafoor = findWord(5, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(5, ["\u0631","\u062d","\u064a","\u0645"]);
  const aleem2 = findWord(8, ["\u0639","\u0644","\u064a","\u0645"]);
  const hakeem = findWord(8, ["\u062d","\u0643","\u064a","\u0645"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "Hearing (editorial gloss)", keys: ["49:1"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["49:1"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["49:5"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["49:5"] });
  if (aleem2) e.divineNamesAndAttributes.push({ term: aleem2, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["49:8"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["49:8"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["49:1"], excerpt: fv(1), description: "Do not put yourselves before Allah and His Messenger; fear Allah." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["49:2"], excerpt: fv(2), description: "Do not raise your voices above the voice of the Prophet or be loud to him in speech." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["49:6"], excerpt: fv(6), description: "If there comes to you a disobedient one with information, investigate." });

  e.humanConditionsAndSpiritualStates.push({ label: "Hearts tested for righteousness through lowering voices before the Messenger", keys: ["49:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Calling from behind the chambers indicating lack of reason", keys: ["49:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Faith endeared and made pleasing while disbelief, defiance and disobedience rendered hateful", keys: ["49:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Deeds becoming worthless through loudness to the Prophet while the doer perceives nothing", keys: ["49:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Fasiq information requiring investigation to prevent ignorant harm and regret", keys: ["49:6"], evidenceClass: "EXPLICIT_TEXT" });

  const hujurat = findWord(4, ["\u062d","\u062c","\u0631"]);
  if (hujurat) e.terminology.push({ term: hujurat, transliteration: "hujurat", gloss: "chambers/private rooms (editorial gloss)", keys: ["49:4"] });
  const fasiq = findWord(6, ["\u0641","\u0627","\u0633","\u0642"]);
  if (fasiq) e.terminology.push({ term: fasiq, transliteration: "fasiq", gloss: "disobedient/unreliable person (editorial gloss)", keys: ["49:6"] });
}

// === POPULATE P2 (49:9-13) ===
{
  const e = extractions[1];
  const tawwab = findWord(12, ["\u062a","\u0648","\u0627","\u0628"]);
  const raheem = findWord(12, ["\u0631","\u062d","\u064a","\u0645"]);
  const aleem = findWord(13, ["\u0639","\u0644","\u064a","\u0645"]);
  const khabir = findWord(13, ["\u062e","\u0628","\u064a","\u0631"]);
  if (tawwab) e.divineNamesAndAttributes.push({ term: tawwab, transliteration: "Tawwab", gloss: "Accepting of repentance (editorial gloss)", keys: ["49:12"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["49:12"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["49:13"] });
  if (khabir) e.divineNamesAndAttributes.push({ term: khabir, transliteration: "Khabir", gloss: "Acquainted (editorial gloss)", keys: ["49:13"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["49:9"], excerpt: fv(9), description: "If two factions among the believers fight, make settlement between them; if one oppresses, fight the oppressor until it returns to Allah's ordinance." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["49:10"], excerpt: fv(10), description: "The believers are but brothers, so make settlement between your brothers and fear Allah." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["49:11"], excerpt: fv(11), description: "Let not a people ridicule another people, nor women ridicule women; do not insult one another or call by offensive nicknames." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["49:12"], excerpt: fv(12), description: "Avoid much negative assumption; do not spy or backbite each other." });

  e.humanConditionsAndSpiritualStates.push({ label: "Naming disobedience after faith as wretched, with non-repenters identified as wrongdoers", keys: ["49:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Backbiting compared to eating the flesh of one's dead brother to produce revulsion", keys: ["49:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Inter-believer conflict resolution protocol with just settlement and fighting the oppressor", keys: ["49:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Peoples and tribes created for mutual recognition with nobility defined by righteousness alone", keys: ["49:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Believers declared brothers requiring mutual settlement and taqwa for mercy", keys: ["49:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Allah loving those who act justly in settlement between factions", keys: ["49:9"], evidenceClass: "EXPLICIT_TEXT" });

  const ghibah = findWord(12, ["\u063a","\u064a","\u0628"]);
  if (ghibah) e.terminology.push({ term: ghibah, transliteration: "ghibah", gloss: "backbiting (editorial gloss)", keys: ["49:12"] });
  const taqwa = findWord(13, ["\u062a","\u0642","\u0649"]);
  // atqaakum root check
  const atqa = findWord(13, ["\u0623","\u062a","\u0642","\u0649"]);
  if (atqa) e.terminology.push({ term: atqa, transliteration: "atqa", gloss: "most righteous (editorial gloss)", keys: ["49:13"] });
}

// === POPULATE P3 (49:14-18) ===
{
  const e = extractions[2];
  const ghafoor = findWord(14, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(14, ["\u0631","\u062d","\u064a","\u0645"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["49:14"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["49:14"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["49:14"], excerpt: fv(14), description: "Say: You have not yet believed; say instead we have submitted, for faith has not yet entered your hearts." });

  e.humanConditionsAndSpiritualStates.push({ label: "Bedouins claiming belief corrected to submission since faith has not entered their hearts", keys: ["49:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "True belief defined by absence of doubt and striving with properties and lives in Allah's cause", keys: ["49:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Considering Islam a favour to the Prophet reversed as Allah's favour of guidance", keys: ["49:17"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Obedience preserving deeds under divine forgiveness and mercy", keys: ["49:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Allah knowing the unseen of heavens and earth and seeing all deeds", keys: ["49:18"], evidenceClass: "EXPLICIT_TEXT" });

  const iman = findWord(14, ["\u0625","\u064a","\u0645","\u0627","\u0646"]);
  if (iman) e.terminology.push({ term: iman, transliteration: "iman", gloss: "faith/belief (editorial gloss)", keys: ["49:14"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `049-al-hujurat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 049-al-hujurat-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-049-p1,ext-049-p2,ext-049-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1596", label: "Prohibition against preceding Allah and His Messenger with fear commanded", def: "In 49:1: O you who have believed do not put yourselves before Allah and His Messenger but fear Allah; indeed Allah is Hearing and Knowing.", key: "49:1", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"La tuqaddimu priority rule."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Prophetic precedence affirmed."}] },
  { id: "cand-1597", label: "Voice-lowering before the Prophet as heart-testing for righteousness", def: "In 49:2-3: Do not raise your voices above the voice of the Prophet or be loud to him in speech lest your deeds become worthless while you perceive not; indeed those who lower their voices before the Messenger of Allah are the ones whose hearts Allah has tested for righteousness.", key: "49:2", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Adab with the Prophet."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Ibtala al-qulub testing."}] },
  { id: "cand-1598", label: "Fasiq information requiring investigation to prevent ignorant harm", def: "In 49:6: O you who have believed if there comes to you a disobedient one with information investigate lest you harm a people out of ignorance and become over what you have done regretful.", key: "49:6", overlap: [{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Tabayyun verification duty."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Preventing ignorant harm."}] },
  { id: "cand-1599", label: "Faith endeared and disbelief rendered hateful as divine bounty", def: "In 49:7-8: But Allah has endeared to you the faith and has made it pleasing in your hearts and has made hateful to you disbelief defiance and disobedience; those are the guided as bounty from Allah and favour.", key: "49:7", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Hubb al-iman divinely planted."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Fadl min Allah framing."}] },

  { id: "cand-1600", label: "Inter-believer conflict resolution with just settlement and oppressor-fighting", def: "In 49:9: And if two factions among the believers should fight then make settlement between the two; but if one oppresses the other then fight against the one that oppresses until it returns to the ordinance of Allah; and if it returns then make settlement between them in justice and act justly.", key: "49:9", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Islah with qital al-baghi."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Conflict within brotherhood."}] },
  { id: "cand-1601", label: "Believers declared brothers requiring mutual settlement and taqwa", def: "In 49:10: The believers are but brothers so make settlement between your brothers and fear Allah that you may receive mercy.", key: "49:10", overlap: [{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Innama al-mu'minuna ikhwah."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Mercy conditioned on islah."}] },
  { id: "cand-1602", label: "Ridicule, insult and offensive nicknames prohibited among believers", def: "In 49:11: O you who have believed let not a people ridicule another people perhaps they may be better than them; nor let women ridicule other women; do not insult one another and do not call each other by offensive nicknames; wretched is the name of disobedience after faith.", key: "49:11", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Sukhriyah and lamz forbidden."},{topicId:"parents-and-family",layer:"curated",relationship:"related-not-identical",note:"Communal dignity protected."}] },
  { id: "cand-1603", label: "Negative assumption, spying and backbiting prohibited with dead-flesh analogy", def: "In 49:12: O you who have believed avoid much negative assumption indeed some assumption is sin; and do not spy or backbite each other; would one of you like to eat the flesh of his brother when dead? You would detest it.", key: "49:12", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Zann tajassus ghibah triad."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Brother-flesh analogy."}] },
  { id: "cand-1604", label: "Peoples and tribes created for mutual recognition with nobility by righteousness", def: "In 49:13: O mankind indeed We have created you from male and female and made you peoples and tribes that you may know one another; indeed the most noble of you in the sight of Allah is the most righteous of you.", key: "49:13", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Li-ta'arafu purpose."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Inna akramakum atqakum."}] },

  { id: "cand-1605", label: "Bedouin iman corrected to submission since faith has not entered hearts", def: "In 49:14: The bedouins say we have believed; say you have not yet believed but say instead we have submitted for faith has not yet entered your hearts; and if you obey Allah and His Messenger He will not deprive you from your deeds of anything.", key: "49:14", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman versus islam distinction."},{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Obedience preserving deeds."}] },
  { id: "cand-1606", label: "True believers defined by absence of doubt and striving with wealth and life", def: "In 49:15: The believers are only the ones who have believed in Allah and His Messenger and then doubt not but strive with their properties and their lives in the cause of Allah; it is those who are the truthful.", key: "49:15", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Lam yartabu certainty criterion."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Jihad bi-amwal wa-anfus."}] },
  { id: "cand-1607", label: "Islam as Allah's favour of guidance not a human favour to the Prophet", def: "In 49:17: They consider it a favour to you that they have accepted Islam; say do not consider your Islam a favour to me; rather Allah has conferred favour upon you that He has guided you to the faith if you should be truthful.", key: "49:17", overlap: [{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Minna reversed to Allah."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Prophet not beneficiary of conversion."}] }
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
    notes: "Wave 8 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 9).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(9, 12).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `049-al-hujurat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-073.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-073.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");