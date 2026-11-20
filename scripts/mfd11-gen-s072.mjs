// MFD-11 Wave 10: Surah 72 (Al-Jinn) genuine re-extraction.
// Covers 72:1-28 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "072-0001-0028.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 72:${n} not found`);
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

console.log("Generating Surah 72 (Al-Jinn) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T20:05:00.000Z";

const PASSAGES = [
  { id: "ext-072-p1", from: 1, to: 15,
    label: "Say Muhammad revealed me group jinn listened said indeed heard amazing Quran guides right course believed never associate Lord anyone; exalted nobleness Lord not taken wife son; foolish one saying Allah excessive transgression; thought mankind jinn never speak Allah lie; men mankind sought refuge men jinn increased burden; thought as you thought Allah never send anyone messenger; sought reach heaven found filled powerful guards burning flames; used sit therein positions hearing whoever listens now find burning flame lying wait; do not know whether evil intended earth or Lord intends right course; among us righteous among us not so divided ways; become certain never cause failure Allah upon earth nor escape Him flight; heard guidance believed whoever believes Lord not fear deprivation burden; among us Muslims among us unjust whoever become Muslim sought out right course; unjust will be Hell firewood",
    mainLabel: "Revelation that a group of jinn listened to an amazing Quran guiding to the right course, believed in it and resolved never to associate partners with their Lord; they affirm His exalted nobleness without wife or son, repudiating their own foolish one's excessive transgression and acknowledging that both mankind and jinn had spoken lies about Allah; human men seeking refuge in jinn only increased their burden, and both species had wrongly assumed Allah would never send a messenger; their attempt to eavesdrop on heaven now met with powerful guards and burning flames where listening posts once stood; uncertainty whether evil or guidance is intended for earth's inhabitants; internal division acknowledged — righteous and otherwise, Muslims and unjust — with certainty that neither escape nor causing failure against Allah is possible; belief in the guidance removing fear of deprivation or burden, while the unjust are destined as Hell's firewood" },
  { id: "ext-072-p2", from: 16, to: 23,
    label: "Allah revealed if remained straight way given abundant provision; test them therein whoever turns away remembrance Lord put arduous punishment; revealed masjids Allah do not invoke Allah anyone; Servant Allah stood up supplicating almost became about him compacted mass; Say Muhammad only invoke Lord not associate Him anyone; Say indeed not possess harm right direction; Say indeed never protect me Allah anyone should disobey nor find other than Him refuge; but only notification Allah messages whoever disobeys Allah Messenger fire Hell abide therein forever",
    mainLabel: "Divine revelation that steadfastness on the way would have yielded abundant provision as a test, while turning away from the Lord's remembrance earns arduous punishment; masjids declared belonging to Allah alone with prohibition of invoking anyone alongside Him; the Servant of Allah standing in supplication nearly overwhelmed by a compacted mass of jinn; the Prophet declaring he invokes only his Lord without association, possessing no power over harm or guidance, finding no protector or refuge besides Allah if he were to disobey; his role limited to conveying Allah's notification and messages, with eternal Hellfire awaiting whoever disobeys Allah and His Messenger" },
  { id: "ext-072-p3", from: 24, to: 28,
    label: "disbelievers continue until see promised then know who weaker helpers less number; Say not know what promised near or Lord grant long period; Knower unseen does not disclose unseen anyone except approved messengers sends before each messenger behind observers; may know conveyed messages Lord encompassed whatever with them enumerated all things number",
    mainLabel: "Disbelievers continuing until they see what was promised, at which point they will know who is weaker in helpers and fewer in number; the Prophet's ignorance of whether the promise is near or distant affirmed; Allah named Knower of the unseen who discloses it to none except approved messengers, sending observers before and behind each messenger so He may verify their conveyance, having encompassed all they carry and enumerated everything in number" }
];

const SUB_LABELS = {
  "ext-072-p1": [
    "Revelation that a group of jinn listened to the Quran and found it amazing",
    "It guides to the right course and they believed, resolving never to associate partners with their Lord",
    "His exalted nobleness affirmed without wife or son",
    "Their own foolish one's excessive transgression against Allah repudiated",
    "The prior assumption that neither mankind nor jinn would ever lie about Allah corrected",
    "Human men seeking refuge in jinn only increased their burden",
    "Both species had wrongly assumed Allah would never send a messenger",
    "Their attempt to reach heaven found it filled with powerful guards and burning flames",
    "Former listening posts now replaced by ambush-flames for any eavesdropper",
    "Uncertainty whether evil or a right course is intended for those on earth",
    "Internal division acknowledged: righteous and otherwise among them",
    "Certainty reached that neither escape nor causing failure against Allah is possible",
    "Belief in the guidance removing fear of deprivation or burden",
    "Muslims and unjust among them distinguished; becoming Muslim means seeking the right course",
    "The unjust destined as firewood for Hell"
  ],
  "ext-072-p2": [
    "Steadfastness on the way would have yielded abundant provision as a divine test",
    "Turning away from the Lord's remembrance earning arduous punishment",
    "Masjids declared belonging to Allah alone with prohibition of invoking anyone alongside Him",
    "The Servant of Allah standing in supplication nearly overwhelmed by a compacted mass",
    "The Prophet declaring he invokes only his Lord without associating anyone",
    "He possesses no power over harm or right direction for them",
    "No protector or refuge besides Allah if he were to disobey",
    "His role limited to notification and messages from Allah; disobedience earns eternal Hellfire"
  ],
  "ext-072-p3": [
    "Disbelievers continuing until they see the promise and learn who is weaker in helpers and fewer",
    "The Prophet's ignorance of whether the promise is near or granted a long period",
    "Allah as Knower of the unseen disclosing it to none except approved messengers",
    "Except approved messengers, with observers sent before and behind each one to verify conveyance",
    "Complete divine encompassment of what they carry and enumeration of all things in number"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`72:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`72:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 72, surahName: "Al-Jinn",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 10 genuine re-extraction. Boundaries follow the text: P1 closes with the unjust-as-firewood verdict (15) before the istiqamah-provision and masjid-purity block opens (16); P2 ends with the eternal-Hellfire verdict for disobedience (23) before the eschatological-timing and unseen-knowledge block begins (24); P3 covers the promise-visibility, timing-ignorance and guarded-unseen disclosure (24-28).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (72:1-15) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Jinn hearing the Quran, recognising its guidance and embracing tawheed", keys: ["72:1","72:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Repudiation of divine spouse and offspring claims alongside internal foolishness", keys: ["72:3","72:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prior assumption corrected that neither species would lie about Allah", keys: ["72:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Certainty that escape from Allah and causing Him failure are impossible", keys: ["72:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Belief in the guidance removing fear of deprivation or burden", keys: ["72:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Human men seeking refuge in jinn only increasing their burden", keys: ["72:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Internal jinn community divided between righteous and unjust, Muslims and deviants", keys: ["72:11","72:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Heaven filled with guards and flames replacing former eavesdropping positions", keys: ["72:8","72:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Unjust among the jinn destined as firewood for Hell", keys: ["72:15"], evidenceClass: "EXPLICIT_TEXT" });

  const jinn = findWord(1, ["\u062c","\u0646"]);
  if (jinn) e.terminology.push({ term: jinn, transliteration: "jinn", gloss: "jinn (editorial gloss)", keys: ["72:1"] });
  const quran = findWord(1, ["\u0642","\u0631","\u0622","\u0646"]);
  if (quran) e.terminology.push({ term: quran, transliteration: "quran ajab", gloss: "amazing Quran (editorial gloss)", keys: ["72:1"] });
  const rashid = findWord(2, ["\u0631","\u0634","\u062f"]);
  if (rashid) e.terminology.push({ term: rashid, transliteration: "rushd", gloss: "right course (editorial gloss)", keys: ["72:2"] });
}

// === POPULATE P2 (72:16-23) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["72:18"], excerpt: fv(18), description: "The masjids are for Allah, so do not invoke with Allah anyone." });

  e.humanConditionsAndSpiritualStates.push({ label: "Steadfastness on the way producing abundant provision as a test", keys: ["72:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Turning away from the Lord's remembrance earning arduous punishment", keys: ["72:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "The Servant of Allah nearly overwhelmed by a compacted mass of jinn during supplication", keys: ["72:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prophetic declaration of having no power over harm or guidance and no refuge besides Allah", keys: ["72:21","72:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Masjid purity declared: invocation belongs to Allah alone", keys: ["72:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Notification and messages from Allah as the sole prophetic function", keys: ["72:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Eternal Hellfire for whoever disobeys Allah and His Messenger", keys: ["72:23"], evidenceClass: "EXPLICIT_TEXT" });

  const masajid = findWord(18, ["\u0645","\u0633","\u0627","\u062c","\u062f"]);
  if (masajid) e.terminology.push({ term: masajid, transliteration: "masajid", gloss: "masjids/places of prostration (editorial gloss)", keys: ["72:18"] });
  const abd = findWord(19, ["\u0639","\u0628","\u062f"]);
  if (abd) e.terminology.push({ term: abd, transliteration: "abd Allah", gloss: "Servant of Allah (editorial gloss)", keys: ["72:19"] });
}

// === POPULATE P3 (72:24-28) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Disbelievers learning who is weaker when the promised punishment becomes visible", keys: ["72:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prophetic ignorance of the promise's timing affirmed", keys: ["72:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Unseen knowledge disclosed only to approved messengers under observation", keys: ["72:26","72:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Complete divine encompassment and enumeration verifying message conveyance", keys: ["72:28"], evidenceClass: "EXPLICIT_TEXT" });

  const ghayb = findWord(26, ["\u063a","\u064a","\u0628"]);
  if (ghayb) e.terminology.push({ term: ghayb, transliteration: "ghayb", gloss: "the unseen (editorial gloss)", keys: ["72:26"] });
  const hafazah = findWord(27, ["\u062d","\u0641","\u0638"]);
  // Using 'observers' reference
  const rasid = findWord(27, ["\u0631","\u0635","\u062f"]);
  if (rasid) e.terminology.push({ term: rasid, transliteration: "rasad", gloss: "observers/guards (editorial gloss)", keys: ["72:27"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `072-al-jinn-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 072-al-jinn-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-072-p1,ext-072-p2,ext-072-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1836", label: "Jinn hearing the Quran, believing and embracing tawheed", def: "In 72:1-3: Say O Muhammad it has been revealed to me that a group of the jinn listened and said indeed we have heard an amazing Quran; it guides to the right course and we have believed in it and we will never associate with our Lord anyone; and that exalted is the nobleness of our Lord He has not taken a wife or a son.", key: "72:1", overlap: [{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Jinn iman documented."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"La nushrik bi-rabbina ahada."}] },
  { id: "cand-1837", label: "Human-jinn refuge-seeking increasing burden rather than providing protection", def: "In 72:6: And there were men from mankind who sought refuge in men from the jinn so they only increased them in burden.", key: "72:6", overlap: [{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Isti'adhah bi'l-jinn condemned."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"False refuge exposed."}] },
  { id: "cand-1838", label: "Heaven sealed against eavesdropping with guards and flames", def: "In 72:8-9: And we have sought to reach the heaven but found it filled with powerful guards and burning flames; and we used to sit therein in positions for hearing but whoever listens now will find a burning flame lying in wait for him.", key: "72:8", overlap: [{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Sama' protected post-revelation."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Eavesdropping blocked confirming authenticity."}] },
  { id: "cand-1839", label: "Jinn community internally divided between righteous and unjust", def: "In 72:11-15: And among us are the righteous and among us are others not so we were of divided ways; and we have become certain that we will never cause failure to Allah upon earth nor can we escape Him by flight; and when we heard the guidance we believed in it and whoever believes in his Lord will not fear deprivation or burden; and among us are Muslims in submission to Allah and among us are the unjust and whoever has become Muslim those have sought out the right course; but as for the unjust they will be for Hell firewood.", key: "72:11", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Jinn ummah mirroring human division."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La nu'jiza Allah wa-la nahrub."}] },

  { id: "cand-1840", label: "Istiqamah producing abundant provision as a divine test", def: "In 72:16: And that if they had remained straight on the way We would have given them abundant provision.", key: "72:16", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Istiqamah linked to rizq."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Abundant provision as fitnah."}] },
  { id: "cand-1841", label: "Masjid purity: invocation belongs to Allah alone", def: "In 72:18: And that the masjids are for Allah so do not invoke with Allah anyone.", key: "72:18", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Masajid lillah exclusive."},{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Dua purity legislated."}] },
  { id: "cand-1842", label: "Prophetic limitation: no harm, no guidance, no refuge besides Allah", def: "In 72:21-23: Say indeed I do not possess for you the power of harm or right direction; say indeed there will never protect me from Allah anyone if I should disobey nor will I find in other than Him a refuge; but I have for you only notification from Allah and His messages.", key: "72:21", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Balagh-only role clarified."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"No laja' illa billah."}] },

  { id: "cand-1843", label: "Unseen disclosed only to approved messengers under observation", def: "In 72:26-28: He is Knower of the unseen and He does not disclose His knowledge of the unseen to anyone except whom He has approved of messengers and indeed He sends before each messenger and behind him observers that he may know that they have conveyed the messages of their Lord and He has encompassed whatever is with them and has enumerated all things in number.", key: "72:26", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ghayb disclosure protocol."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Verification through rasad."}] }
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
    notes: "Wave 10 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 7).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(7, 8).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `072-al-jinn-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-096.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-096.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");