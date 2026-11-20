// MFD-11 Wave 9: Surah 64 (At-Taghabun) genuine re-extraction.
// Covers 64:1-18 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "064-0001-0018.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 64:${n} not found`);
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

console.log("Generating Surah 64 (At-Taghabun) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T18:45:00.000Z";

const PASSAGES = [
  { id: "ext-064-p1", from: 1, to: 7,
    label: "Whatever heavens earth exalting Allah His dominion His praise over all competent; He created you among disbeliever believer Allah what do Seeing; created heavens earth truth formed perfected forms Him destination; knows within heavens earth knows conceal declare Allah Knowing within breasts; has not come news those disbelieved before tasted bad consequence affair painful punishment; because messengers came clear evidences said shall human beings guide us disbelieved turned away Allah dispensed Free need Praiseworthy; those disbelieve claimed never resurrected say yes by my Lord surely resurrected then surely informed what did that Allah easy",
    mainLabel: "Universal tasbih with dominion, praise and competence affirmed; creation producing both disbeliever and believer under His sight; heavens and earth created in truth with forms perfected and final destination His; knowledge of all in heavens and earth including the concealed, declared and breast-contained; news of earlier disbelievers who tasted their affair's evil consequence and face painful punishment because they rejected their messengers' clear evidences asking shall humans guide us, so Allah dispensed with them as Free of Need and Praiseworthy; deniers of resurrection answered by an oath-affirmed certainty of rising and disclosure of deeds, declared easy for Allah" },
  { id: "ext-064-p2", from: 8, to: 13,
    label: "believe Allah Messenger Quran sent down Allah Acquainted what do; Day assemble Day Assembly Day Deprivation; whoever believes Allah does righteousness remove misdeeds admit gardens rivers flow abide forever great attainment; ones disbelieved denied verses companions Fire abiding eternally wretched destination; no disaster strikes except permission Allah whoever believes Allah guide heart Allah Knowing all things; obey Allah obey Messenger turn away upon Messenger only clear notification; Allah no deity except Him upon Allah let believers rely",
    mainLabel: "Belief in Allah, His Messenger and the sent-down Quran commanded under His acquaintance with deeds; the Day of Assembly named the Day of Deprivation where believers doing righteousness have misdeeds removed and are admitted to eternal rivered gardens as the great attainment while deniers become eternal Fire-companions in a wretched destination; no disaster striking except by Allah's permission with heart-guidance granted to whoever believes under His universal knowledge; obedience to Allah and the Messenger enjoined with the Messenger's duty limited to clear notification for whoever turns away; tawheed declared with reliance upon Allah alone commanded for believers" },
  { id: "ext-064-p3", from: 14, to: 18,
    label: "O believed indeed among wives children enemies beware them; pardon overlook forgive indeed Allah Forgiving Merciful; wealth children trial Allah has great reward; fear Allah much able listen obey spend better selves whoever protected stinginess soul successful; loan Allah goodly loan multiply forgive Allah Most Appreciative Forbearing; Knower unseen witnessed Exalted Might Wise",
    mainLabel: "Believers warned that some wives and children may be enemies requiring vigilance, yet pardoning, overlooking and forgiving are urged since Allah is Forgiving and Merciful; wealth and children identified as a trial against which Allah holds a great reward; taqwa to the extent of ability joined to listening, obeying and spending as better for themselves, with success promised to whoever is guarded from his soul's stinginess; the goodly loan to Allah multiplied and forgiven by the Most Appreciative and Forbearing; the surah closing with the Knower of unseen and witnessed, the Exalted in Might, the Wise" }
];

const SUB_LABELS = {
  "ext-064-p1": [
    "Universal tasbih with dominion, praise and universal competence affirmed",
    "Creation producing both disbeliever and believer under His sight of all deeds",
    "Heavens and earth created in truth with forms perfected and final destination His",
    "Knowledge of all in heavens and earth including the concealed, declared and breast-contained",
    "Earlier disbelievers tasting their affair's evil consequence and facing painful punishment",
    "Their rejection of messengers' clear evidences asking shall humans guide us, so Allah dispensed with them as Free of Need and Praiseworthy",
    "Deniers of resurrection answered by oath-affirmed certainty of rising and disclosure, declared easy for Allah"
  ],
  "ext-064-p2": [
    "Belief in Allah, His Messenger and the sent-down Quran commanded under His acquaintance with deeds",
    "The Day of Assembly named the Day of Deprivation where believers doing righteousness have misdeeds removed and enter eternal rivered gardens as the great attainment",
    "Deniers of the verses becoming eternal Fire-companions in a wretched destination",
    "No disaster striking except by Allah's permission with heart-guidance granted to whoever believes",
    "Obedience to Allah and the Messenger enjoined with the Messenger's duty limited to clear notification",
    "Tawheed declared with reliance upon Allah alone commanded for believers"
  ],
  "ext-064-p3": [
    "Wives and children potentially enemies requiring vigilance, yet pardoning, overlooking and forgiving urged under forgiveness and mercy",
    "Wealth and children identified as a trial against which Allah holds a great reward",
    "Taqwa to the extent of ability joined to listening, obeying and spending as better for themselves, with success for whoever is guarded from his soul's stinginess",
    "The goodly loan to Allah multiplied and forgiven by the Most Appreciative and Forbearing",
    "Closing declaration of the Knower of unseen and witnessed, the Exalted in Might, the Wise"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`64:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`64:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 64, surahName: "At-Taghabun",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the resurrection oath and its ease (7) before the belief-Quran-Day of Assembly block opens (8); P2 ends with tawheed and reliance (13) before the domestic-enemy warning begins (14); P3 covers wives-children enmity, wealth-children trial, capacity-taqwa, the goodly loan and the closing name-pair (14-18).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (64:1-7) ===
{
  const e = extractions[0];
  const ghani = findWord(6, ["\u063a","\u0646","\u064a"]);
  const hameed = findWord(6, ["\u062d","\u0645","\u064a","\u062f"]);
  if (ghani) e.divineNamesAndAttributes.push({ term: ghani, transliteration: "Ghani", gloss: "Free of need (editorial gloss)", keys: ["64:6"] });
  if (hameed) e.divineNamesAndAttributes.push({ term: hameed, transliteration: "Hameed", gloss: "Praiseworthy (editorial gloss)", keys: ["64:6"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Humanity divided into disbeliever and believer under divine sight", keys: ["64:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Earlier communities tasting the evil consequence of rejecting their messengers", keys: ["64:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Dismissing revelation because it comes through human messengers", keys: ["64:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Universal tasbih opening with dominion, praise and competence", keys: ["64:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Resurrection affirmed by oath and declared easy for Allah", keys: ["64:7"], evidenceClass: "EXPLICIT_TEXT" });

  const taghabun = findWord(9, ["\u062a","\u063a","\u0627","\u0628"]);
  // Taghabun appears in v9 but we note it here for the surah-name term
  const bashar = findWord(6, ["\u0628","\u0634","\u0631"]);
  if (bashar) e.terminology.push({ term: bashar, transliteration: "bashar", gloss: "human beings (editorial gloss)", keys: ["64:6"] });
}

// === POPULATE P2 (64:8-13) ===
{
  const e = extractions[1];
  const khabir = findWord(8, ["\u062e","\u0628","\u064a","\u0631"]);
  const aleem = findWord(11, ["\u0639","\u0644","\u064a","\u0645"]);
  if (khabir) e.divineNamesAndAttributes.push({ term: khabir, transliteration: "Khabir", gloss: "Acquainted (editorial gloss)", keys: ["64:8"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["64:11"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["64:8"], excerpt: fv(8), description: "So believe in Allah and His Messenger and the Quran which We have sent down." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["64:12"], excerpt: fv(12), description: "And obey Allah and obey the Messenger." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["64:13"], excerpt: fv(13), description: "And upon Allah let the believers rely." });

  e.humanConditionsAndSpiritualStates.push({ label: "Day of Assembly named the Day of Deprivation (Taghabun)", keys: ["64:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Heart-guidance granted to whoever believes in Allah amid disasters", keys: ["64:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Misdeeds removed and eternal rivered gardens granted as the great attainment", keys: ["64:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "No disaster striking except by Allah's permission", keys: ["64:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Messenger's duty limited to clear notification when people turn away", keys: ["64:12"], evidenceClass: "EXPLICIT_TEXT" });

  const taghabunTerm = findWord(9, ["\u062a","\u063a","\u0627","\u0628"]);
  if (taghabunTerm) e.terminology.push({ term: taghabunTerm, transliteration: "yawm al-taghabun", gloss: "Day of Deprivation/Mutual Loss (editorial gloss)", keys: ["64:9"] });
}

// === POPULATE P3 (64:14-18) ===
{
  const e = extractions[2];
  const ghafoor = findWord(14, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(14, ["\u0631","\u062d","\u064a","\u0645"]);
  const shakoor = findWord(17, ["\u0634","\u0643","\u0648","\u0631"]);
  const haleem = findWord(17, ["\u062d","\u0644","\u064a","\u0645"]);
  const aziz = findWord(18, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(18, ["\u062d","\u0643","\u064a","\u0645"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["64:14"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["64:14"] });
  if (shakoor) e.divineNamesAndAttributes.push({ term: shakoor, transliteration: "Shakoor", gloss: "Most Appreciative (editorial gloss)", keys: ["64:17"] });
  if (haleem) e.divineNamesAndAttributes.push({ term: haleem, transliteration: "Haleem", gloss: "Forbearing (editorial gloss)", keys: ["64:17"] });
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["64:18"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["64:18"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["64:14"], excerpt: fv(14), description: "Beware of them — some wives and children are enemies." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["64:14"], excerpt: fv(14), description: "But if you pardon and overlook and forgive — then indeed Allah is Forgiving and Merciful." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["64:16"], excerpt: fv(16), description: "So fear Allah as much as you are able and listen and obey and spend." });

  e.humanConditionsAndSpiritualStates.push({ label: "Some wives and children identified as potential enemies requiring vigilance", keys: ["64:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wealth and children named a trial against which Allah holds a great reward", keys: ["64:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Protection from the soul's stinginess named as the mark of the successful", keys: ["64:16"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Goodly loan to Allah multiplied and forgiven by the Most Appreciative and Forbearing", keys: ["64:17"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Capacity-based taqwa joined to listening, obedience and spending as better for themselves", keys: ["64:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Closing name-pair affirming knowledge of unseen and witnessed with might and wisdom", keys: ["64:18"], evidenceClass: "EXPLICIT_TEXT" });

  const qard = findWord(17, ["\u0642","\u0631","\u0636"]);
  if (qard) e.terminology.push({ term: qard, transliteration: "qard hasan", gloss: "goodly loan (editorial gloss)", keys: ["64:17"] });
  const shuhh = findWord(16, ["\u0634","\u062d"]);
  if (shuhh) e.terminology.push({ term: shuhh, transliteration: "shuhh al-nafs", gloss: "stinginess of the soul (editorial gloss)", keys: ["64:16"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `064-at-taghabun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 064-at-taghabun-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-064-p1,ext-064-p2,ext-064-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1764", label: "Creation producing both disbeliever and believer under divine sight", def: "In 64:2: It is He who created you and among you is the disbeliever and among you is the believer; and Allah of what you do is Seeing.", key: "64:2", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Ikhtilaf within creation."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Baseer over human division."}] },
  { id: "cand-1765", label: "Earlier disbelievers rejecting human messengers and tasting consequences", def: "In 64:5-6: Has there not come to you the news of those who disbelieved before? So they tasted the bad consequence of their affair and they will have a painful punishment; that is because their messengers used to come to them with clear evidences but they said shall human beings guide us and disbelieved and turned away.", key: "64:5", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Rejection of bashar-rusul."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Dhaqu wabala amrihim."}] },
  { id: "cand-1766", label: "Resurrection affirmed by oath and declared easy for Allah", def: "In 64:7: Those who disbelieve have claimed that they will never be resurrected; say yes by my Lord you will surely be resurrected then you will surely be informed of what you did and that for Allah is easy.", key: "64:7", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Ba'th confirmed by qasam."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Wa-dhalika ala Allah yasir."}] },

  { id: "cand-1767", label: "Day of Assembly named the Day of Deprivation (Taghabun)", def: "In 64:9: The Day He will assemble you for the Day of Assembly, that is the Day of Deprivation.", key: "64:9", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Yawm al-jam' wa-yawm al-taghabun."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Mutual loss revealed."}] },
  { id: "cand-1768", label: "No disaster striking except by Allah's permission with heart-guidance for believers", def: "In 64:11: No disaster strikes except by permission of Allah; and whoever believes in Allah He will guide his heart; and Allah is Knowing of all things.", key: "64:11", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Musibah bi-idhn Allah."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Hidayat al-qalb for the believer."}] },
  { id: "cand-1769", label: "Messenger's duty limited to clear notification when people turn away", def: "In 64:12: And obey Allah and obey the Messenger; but if you turn away then upon Our Messenger is only the duty of clear notification.", key: "64:12", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Al-balagh al-mubin limit."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Turning away bears personal consequence."}] },

  { id: "cand-1770", label: "Wives and children as potential enemies with pardon urged", def: "In 64:14: O you who have believed indeed among your wives and your children are enemies to you so beware of them; but if you pardon and overlook and forgive then indeed Allah is Forgiving and Merciful.", key: "64:14", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Domestic fitnah acknowledged."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Afw safh ghifr triad."}] },
  { id: "cand-1771", label: "Wealth and children as trial against great reward", def: "In 64:15: Your wealth and your children are but a trial and Allah has with Him a great reward.", key: "64:15", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Mal wa-banun fitnah."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ajrun azim counterweight."}] },
  { id: "cand-1772", label: "Capacity-based taqwa with success for guarding against soul-stinginess", def: "In 64:16: So fear Allah as much as you are able and listen and obey and spend; it is better for your selves; and whoever is protected from the stinginess of his soul it is those who will be the successful.", key: "64:16", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Fattaqu ma istata'tum capacity rule."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Shuhh avoidance as falah marker."}] },
  { id: "cand-1773", label: "Goodly loan multiplied and forgiven by the Most Appreciative and Forbearing", def: "In 64:17: If you loan Allah a goodly loan He will multiply it for you and forgive you; and Allah is Most Appreciative and Forbearing.", key: "64:17", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Qard hasan doubled with maghfirah."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Shakur Haleem pairing."}] }
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
    notes: "Wave 9 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 3).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(3, 6).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(6, 10).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `064-at-taghabun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-088.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-088.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");