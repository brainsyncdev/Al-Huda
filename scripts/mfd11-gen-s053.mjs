// MFD-11 Wave 8: Surah 53 (An-Najm) genuine re-extraction.
// Covers 53:1-62 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "053-0001-0062.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 53:${n} not found`);
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

console.log("Generating Surah 53 (An-Najm) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T17:00:00.000Z";

const PASSAGES = [
  { id: "ext-053-p1", from: 1, to: 18,
    label: "By star descends; companion not strayed nor erred; not speak inclination; not but revelation revealed; taught intense strength; soundness rose true form; higher horizon; approached descended; distance two bow lengths nearer; revealed Servant what revealed; heart not lie saw; dispute over saw; certainly saw another descent; Lote Tree Utmost Boundary; near Garden Refuge; covered Lote Tree covered; sight not swerve nor transgress limit; certainly saw greatest signs Lord",
    mainLabel: "Oath by the descending star grounding the Prophet's freedom from straying and error; his speech identified as revelation rather than inclination, taught by one intense in strength who rose to his true form in the higher horizon, approached and descended to within two bow-lengths or nearer, revealing to His Servant what he revealed; the heart did not lie about what it saw, challenging dispute over the vision; a second descent confirmed at the Lote Tree of the Utmost Boundary near the Garden of Refuge, when something covered the tree; the Prophet's sight neither swerved nor transgressed its limit, having seen the greatest signs of his Lord" },
  { id: "ext-053-p2", from: 19, to: 32,
    label: "Considered al-Lat al-Uzza; Manat third other; male you Him female; unjust division; not but names named forefathers Allah sent down no authority; follow not except assumption souls desire already come Lord guidance; man whatever wishes; rather Allah belongs Hereafter first life; many angels heavens intercession not avail except after Allah permitted wills approves; indeed not believe Hereafter name angels female names; thereof no knowledge follow not except assumption avails not against truth; turn away whoever turns back message desires not except worldly life; sum knowledge; indeed Lord most knowing strays way most knowing guided; Allah belongs whatever heavens earth recompense evil penalty done recompense good best reward; avoid major sins immoralities only slight ones; indeed Lord vast forgiveness; most knowing produced earth fetuses wombs mothers; do not claim yourselves pure; most knowing fears Him",
    mainLabel: "Al-Lat, al-Uzza and Manat challenged as mere names invented without divine authority, their gendered attribution exposed as unjust division; followers relying on assumption and soul-desire despite prior guidance; man's wishes limited since the Hereafter and first life belong to Allah; angelic intercession restricted to divine permission and approval; those naming angels female lacking knowledge and following assumption that avails nothing against truth; turning away from whoever rejects the message for worldly life alone, their knowledge summed up while Allah knows best who strays and who is guided; cosmic ownership affirming exact recompense for evil and best reward for good; avoiders of major sins and immoralities granted vast forgiveness, with self-purification claims rejected since Allah knew them from earth-production and fetal stages and knows best who fears Him" },
  { id: "ext-053-p3", from: 33, to: 55,
    label: "Seen one turned away; gave little refrained; knowledge unseen sees; not informed scriptures Moses; Abraham fulfilled obligations; bearer burdens bear burden another; not man except strives; effort going seen; recompensed fullest recompense; Lord finality; makes laugh weep; causes death gives life; creates two mates male female; sperm-drop emitted; incumbent upon Him next creation; enriches suffices; Lord Sirius; destroyed first Aad; Thamud not spare; people Noah before more unjust oppressing; overturned towns hurled down; covered by that covered; which favors Lord doubt",
    mainLabel: "The one who turned away and gave little then refrained challenged on unseen knowledge; reminded of what was in the scriptures of Moses and Abraham who fulfilled his obligations — that no bearer bears another's burden, man has only what he strives for, his effort will be seen and fully recompensed, the finality belongs to the Lord who makes laugh and weep, causes death and gives life, creates male and female pairs from emitted sperm-drop, owes the next creation, enriches and suffices, and is Lord of Sirius; the destruction of the first Aad, Thamud without sparing, and Noah's people as even more unjust recalled; the overturned towns hurled down and covered; all posed as favors none should doubt" },
  { id: "ext-053-p4", from: 56, to: 62,
    label: "This warner like former warners; Approaching Day approached; besides Allah no remover; this statement wonder; laugh not weep; proudly sporting; prostrate Allah worship Him",
    mainLabel: "This Prophet identified as a warner like the former warners; the Approaching Day declared imminent with no remover besides Allah; their wonder at this statement, laughter without tears and proud sportiveness condemned; closing command to prostrate to Allah and worship Him" }
];

const SUB_LABELS = {
  "ext-053-p1": [
    "Oath by the star when it descends",
    "Your companion has not strayed nor erred",
    "He does not speak from his own inclination",
    "It is nothing but a revelation revealed",
    "Taught to him by one intense in strength",
    "One of soundness who rose to his true form",
    "While he was in the higher part of the horizon",
    "Then he approached and descended",
    "At a distance of two bow-lengths or nearer",
    "And he revealed to His Servant what he revealed",
    "The heart did not lie about what it saw",
    "Will you then dispute with him over what he saw",
    "He certainly saw him in another descent",
    "At the Lote Tree of the Utmost Boundary",
    "Near it is the Garden of Refuge",
    "When there covered the Lote Tree that which covered it",
    "The sight did not swerve nor transgress its limit",
    "He certainly saw the greatest signs of his Lord"
  ],
  "ext-053-p2": [
    "Have you considered al-Lat and al-Uzza",
    "And Manat the third, the other one",
    "Is the male for you and for Him the female — an unjust division",
    "They are not but names you and your forefathers named without divine authority, following only assumption and soul-desire",
    "Guidance having already come from their Lord",
    "Or is there for man whatever he wishes",
    "Rather to Allah belongs the Hereafter and the first life",
    "Many angels in the heavens whose intercession avails only after divine permission and approval",
    "Those disbelieving in the Hereafter name angels female without knowledge, following assumption that avails nothing against truth",
    "Turn away from whoever turns his back on the message desiring only worldly life",
    "That is their sum of knowledge; your Lord knows best who strays and who is guided",
    "To Allah belongs all in heavens and earth for exact recompense of evil and best reward for good",
    "Avoiders of major sins and immoralities granted vast forgiveness; He knew you from earth-production and fetal stages",
    "Do not claim yourselves pure; He is most knowing of who fears Him"
  ],
  "ext-053-p3": [
    "Have you seen the one who turned away",
    "And gave a little then refrained",
    "Does he have knowledge of the unseen so he sees",
    "Or has he not been informed of what was in the scriptures of Moses",
    "And Abraham who fulfilled his obligations",
    "That no bearer of burdens will bear the burden of another",
    "And that there is not for man except that for which he strives",
    "And that his effort is going to be seen",
    "Then he will be recompensed with the fullest recompense",
    "And that to your Lord is the finality",
    "And that it is He who makes one laugh and weep",
    "And that it is He who causes death and gives life",
    "And that He creates the two mates, male and female",
    "From a sperm-drop when it is emitted",
    "And that incumbent upon Him is the next creation",
    "And that it is He who enriches and suffices",
    "And that it is He who is the Lord of Sirius",
    "And that He destroyed the first Aad",
    "And Thamud, and He did not spare them",
    "And the people of Noah before, indeed they were more unjust and oppressing",
    "And the overturned towns He hurled down",
    "And covered them by that which He covered",
    "Then which of the favors of your Lord do you doubt"
  ],
  "ext-053-p4": [
    "This Prophet is a warner like the former warners",
    "The Approaching Day has approached",
    "Of it there is no remover besides Allah",
    "Then at this statement do you wonder",
    "And you laugh and do not weep",
    "While you are proudly sporting",
    "So prostrate to Allah and worship Him"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`53:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`53:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 53, surahName: "An-Najm",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 8 genuine re-extraction. Boundaries follow the text: P1 closes with the greatest-signs affirmation (18) before the idol-challenge block opens (19); P2 ends with the self-purification prohibition (32) before the Musa-Ibrahim scripture reminders begin (33); P3 runs through the ethical axioms, divine attributes and destruction catalogue closing with the favors question (33-55); P4 covers the warner-identity, Approaching Day, their misplaced wonder and the closing prostration command (56-62).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (53:1-18) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "The Prophet's sight neither swerving nor transgressing during the vision", keys: ["53:17"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Revelation taught by one intense in strength who descended to two bow-lengths or nearer", keys: ["53:5","53:6","53:7","53:8","53:9","53:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Second descent at the Lote Tree of the Utmost Boundary near the Garden of Refuge", keys: ["53:13","53:14","53:15","53:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The heart confirming what it saw, challenging dispute over the vision", keys: ["53:11","53:12"], evidenceClass: "EXPLICIT_TEXT" });

  const najm = findWord(1, ["\u0646","\u062c","\u0645"]);
  if (najm) e.terminology.push({ term: najm, transliteration: "najm", gloss: "star (editorial gloss)", keys: ["53:1"] });
  const wahy = findWord(4, ["\u0648","\u062d","\u064a"]);
  if (wahy) e.terminology.push({ term: wahy, transliteration: "wahy", gloss: "revelation (editorial gloss)", keys: ["53:4"] });
  const sidrah = findWord(14, ["\u0633","\u062f","\u0631"]);
  if (sidrah) e.terminology.push({ term: sidrah, transliteration: "sidrat al-muntaha", gloss: "Lote Tree of the Utmost Boundary (editorial gloss)", keys: ["53:14"] });
}

// === POPULATE P2 (53:19-32) ===
{
  const e = extractions[1];
  const ghafoor = findWord(32, ["\u063a","\u0641","\u0648","\u0631"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Vast in forgiveness (editorial gloss)", keys: ["53:32"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["53:32"], excerpt: fv(32), description: "Do not claim yourselves to be pure; He is most knowing of who fears Him." });

  e.humanConditionsAndSpiritualStates.push({ label: "Idol-names invented without divine authority, followed by assumption and soul-desire", keys: ["53:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Gendered attribution to Allah exposed as unjust division", keys: ["53:21","53:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Worldly-life-only desire identified as the sum of rejecters' knowledge", keys: ["53:29","53:30"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Avoidance of major sins and immoralities with only slight lapses earning vast forgiveness", keys: ["53:32"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Angelic intercession restricted to divine permission and approval", keys: ["53:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Exact recompense for evil and best reward for good under cosmic ownership", keys: ["53:31"], evidenceClass: "EXPLICIT_TEXT" });

  const lat = findWord(19, ["\u0644","\u0627","\u062a"]);
  if (lat) e.terminology.push({ term: lat, transliteration: "al-Lat", gloss: "pre-Islamic deity name (editorial gloss)", keys: ["53:19"] });
  const uzza = findWord(19, ["\u0639","\u0632","\u0649"]);
  if (uzza) e.terminology.push({ term: uzza, transliteration: "al-Uzza", gloss: "pre-Islamic deity name (editorial gloss)", keys: ["53:19"] });
  const manat = findWord(20, ["\u0645","\u0646","\u0627","\u0629"]);
  if (manat) e.terminology.push({ term: manat, transliteration: "Manat", gloss: "pre-Islamic deity name (editorial gloss)", keys: ["53:20"] });
}

// === POPULATE P3 (53:33-55) ===
{
  const e = extractions[2];

  e.propheticNarratives.push({ label: "Scriptures of Moses and Abraham cited for the no-burden-bearing and striving axioms", keys: ["53:36","53:37","53:38","53:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Destruction of the first Aad, Thamud without sparing, Noah's people as more unjust, and the overturned towns hurled down and covered", keys: ["53:50","53:51","53:52","53:53","53:54"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "One who turned away and gave little then refrained challenged on unseen knowledge", keys: ["53:33","53:34","53:35"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "No bearer of burdens bearing another's burden; man has only what he strives for", keys: ["53:38","53:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Effort seen and fully recompensed with finality belonging to the Lord", keys: ["53:40","53:41","53:42"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine attributes: making laugh and weep, causing death and life, creating pairs, next creation, enriching, Lord of Sirius", keys: ["53:43","53:44","53:45","53:46","53:47","53:48","53:49"], evidenceClass: "EXPLICIT_TEXT" });

  const shira = findWord(49, ["\u0634","\u0639","\u0631","\u0649"]);
  if (shira) e.terminology.push({ term: shira, transliteration: "shi'ra", gloss: "Sirius star (editorial gloss)", keys: ["53:49"] });
}

// === POPULATE P4 (53:56-62) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["53:62"], excerpt: fv(62), description: "So prostrate to Allah and worship Him." });

  e.humanConditionsAndSpiritualStates.push({ label: "Wonder at the Quranic message accompanied by laughter without tears and proud sportiveness", keys: ["53:59","53:60","53:61"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "This Prophet identified as a warner like the former warners", keys: ["53:56"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The Approaching Day declared imminent with no remover besides Allah", keys: ["53:57","53:58"], evidenceClass: "EXPLICIT_TEXT" });

  const azifah = findWord(57, ["\u0622","\u0632","\u0641","\u0629"]);
  if (azifah) e.terminology.push({ term: azifah, transliteration: "al-azifah", gloss: "the Approaching Day (editorial gloss)", keys: ["53:57"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `053-an-najm-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 053-an-najm-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-053-p1,ext-053-p2,ext-053-p3,ext-053-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1643", label: "Revelation affirmed against inclination; taught by one intense in strength", def: "In 53:3-5: Nor does he speak from his own inclination; it is not but a revelation revealed, taught to him by one intense in strength.", key: "53:3", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Wahy versus hawa distinction."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Shadid al-quwa teacher."}] },
  { id: "cand-1644", label: "Two descents and the Lote Tree vision confirming greatest signs", def: "In 53:13-18: And he certainly saw him in another descent at the Lote Tree of the Utmost Boundary near which is the Garden of Refuge; when there covered the Lote Tree that which covered it; the sight did not swerve nor transgress its limit; he certainly saw the greatest signs of his Lord.", key: "53:13", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Ru'yah affirmed twice."},{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Kubra ayat witnessed."}] },
  { id: "cand-1645", label: "Idol-names as baseless invention without divine authority", def: "In 53:23: They are not but names you have named them, you and your forefathers, for which Allah has sent down no authority; they follow not except assumption and what their souls desire.", key: "53:23", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Asma' sammaytumuha exposed."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Zann and hawa diagnosed."}] },
  { id: "cand-1646", label: "Angelic intercession restricted to divine permission and approval", def: "In 53:26: And how many angels there are in the heavens whose intercession will not avail at all except only after Allah has permitted it to whom He wills and approves.", key: "53:26", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Shafa'ah conditional."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Permission-based mediation."}] },

  { id: "cand-1647", label: "Avoiders of major sins granted vast forgiveness; self-purification claims rejected", def: "In 53:32: Those who avoid the major sins and immoralities, only committing slight ones; indeed your Lord is vast in forgiveness; He was most knowing of you when He produced you from the earth and when you were fetuses in the wombs of your mothers; so do not claim yourselves to be pure; He is most knowing of who fears Him.", key: "53:32", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Wasi' al-maghfirah scope."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Tazkiyah prohibition."}] },
  { id: "cand-1648", label: "No bearer of burdens bearing another's; man has only what he strives for", def: "In 53:38-39: That no bearer of burdens will bear the burden of another; and that there is not for man except that for which he strives.", key: "53:38", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La taziru waziratun principle."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Individual striving basis."}] },
  { id: "cand-1649", label: "Effort seen and fully recompensed with finality to the Lord", def: "In 53:40-42: And that his effort is going to be seen; then he will be recompensed for it with the fullest recompense; and that to your Lord is the finality.", key: "53:40", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Sa'y manifested and judged."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ila rabbika al-muntaha."}] },
  { id: "cand-1650", label: "Divine attributes chain: laugh-weep, death-life, pairs, creation, provision, Sirius", def: "In 53:43-49: And that it is He who makes one laugh and weep and causes death and gives life and creates the two mates male and female from a sperm-drop when emitted and that incumbent upon Him is the next creation and that it is He who enriches and suffices and that it is He who is the Lord of Sirius.", key: "53:43", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Attribute catena."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Comprehensive sovereignty."}] },
  { id: "cand-1651", label: "Five destroyed communities recalled as undeniable favors-signs", def: "In 53:50-55: And that He destroyed the first Aad and Thamud and did not spare them and the people of Noah before, indeed they were more unjust and oppressing; and the overturned towns He hurled down and covered them by that which He covered; then which of the favors of your Lord do you doubt?", key: "53:50", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Destruction catalogue."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ni'mah as warning sign."}] },
  { id: "cand-1652", label: "Approaching Day imminent with no remover besides Allah", def: "In 53:57-58: The Approaching Day has approached; of it from those besides Allah there is no remover.", key: "53:57", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Azifah proximity."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"No dafi' besides Allah."}] },
  { id: "cand-1653", label: "Closing prostration command after condemning laughter and proud sportiveness", def: "In 53:59-62: Then at this statement do you wonder and you laugh and do not weep while you are proudly sporting; so prostrate to Allah and worship Him.", key: "53:62", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Sujud as corrective response."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Worship replacing lahw."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 9).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(9, 11).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `053-an-najm-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-077.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-077.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");