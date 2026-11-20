// MFD-11 Wave 10: Surah 67 (Al-Mulk) genuine re-extraction.
// Covers 67:1-30 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "067-0001-0030.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 67:${n} not found`);
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

console.log("Generating Surah 67 (Al-Mulk) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T19:15:00.000Z";

const PASSAGES = [
  { id: "ext-067-p1", from: 1, to: 14,
    label: "Blessed He hand dominion over all competent; created death life test which best deed Exalted Might Forgiving; created seven heavens layers not see creation Most Merciful inconsistency return vision see breaks; return vision twice again return humbled fatigued; beautified nearest heaven stars made thrown at devils prepared punishment Blaze; disbelieved Lord punishment Hell wretched destination; thrown into it hear dreadful inhaling boils up; almost bursts rage every time company thrown keepers ask did not come warner; say yes warner came denied said Allah not sent down anything not but great error; say if only listening reasoning not among companions Blaze; admit sin alienation companions Blaze; fear Lord unseen forgiveness great reward; conceal speech publicize indeed Knowing within breasts; He who created not know Subtle Acquainted",
    mainLabel: "Blessed is He in whose hand is dominion, competent over all things; creator of death and life to test which is best in deed under might and forgiveness; seven layered heavens created without inconsistency in the Most Merciful's creation, challenged by returning vision twice until it returns humbled and fatigued; nearest heaven beautified with stars that also serve as missiles against devils with the Blaze prepared for them; disbelievers facing Hell's wretched destination where they hear its dreadful inhaling as it almost bursts with rage, its keepers asking whether a warner came, they admitting one did but they denied claiming nothing was sent down, acknowledging that had they listened or reasoned they would not be Blaze-companions, confessing their sin earning alienation; those fearing their Lord unseen promised forgiveness and great reward; speech concealed or publicised alike known to Him since the Creator is necessarily Subtle and Acquainted" },
  { id: "ext-067-p2", from: 15, to: 24,
    label: "He made earth tame walk slopes eat provision Him resurrection; feel secure He authority heaven cause earth swallow suddenly sway; feel secure He authority heaven send storm stones know how severe warning; already those before denied how terrible reproach; not see birds above wings outspread folded none holds except Most Merciful indeed Seeing; who army aid other than Most Merciful disbelievers not but delusion; who provide if withheld provision persisted insolence aversion; one walks fallen face better guided walks erect straight path; say He produced you made hearing vision hearts little grateful; say He multiplied throughout earth Him gathered",
    mainLabel: "Earth made tame for walking its slopes and eating divine provision before resurrection; security questioned regarding the One in heaven causing the earth to swallow or sending a stone-storm so they learn the warning's severity, with earlier deniers' terrible reproach cited; birds held aloft only by the Most Merciful as visible sign; no army or provider besides Him, yet disbelievers persist in insolence and aversion in delusion; the fallen walker contrasted with the upright on a straight path; He who produced them granting hearing, vision and hearts yet receiving little gratitude, multiplying them across the earth toward eventual gathering" },
  { id: "ext-067-p3", from: 25, to: 30,
    label: "say when promise if truthful; say knowledge only Allah I only clear warner; see approaching faces disbelieve distressed said this that used call; say Muhammad considered whether Allah cause death those with me mercy upon us who protect disbelievers painful punishment; say He Most Merciful believed Him upon Him relied you will know who clear error; say considered if water become sunken who bring flowing water",
    mainLabel: "Their demand for the promise's timing answered by declaring knowledge belongs only to Allah while he is merely a clear warner; when they see it approaching their faces distress and they are told this is what they used to invoke; the rhetorical challenge whether anyone can protect disbelievers from painful punishment if Allah causes the Prophet's death or shows mercy; declaration of belief in and reliance upon the Most Merciful with the prediction that they will know who is in clear error; the closing challenge that if their water sinks into the earth, none can restore flowing water" }
];

const SUB_LABELS = {
  "ext-067-p1": [
    "Blessed is He in whose hand is dominion, competent over all things",
    "Creator of death and life to test which is best in deed under might and forgiveness",
    "Seven layered heavens created without inconsistency, challenged by returning vision to find no breaks",
    "Vision returned twice until it comes back humbled and fatigued",
    "Nearest heaven beautified with stars serving as missiles against devils with the Blaze prepared",
    "Disbelievers facing Hell's wretched destination",
    "Thrown in, they hear its dreadful inhaling as it boils up",
    "It almost bursts with rage; keepers ask each company whether a warner came",
    "They admit a warner came but they denied, claiming nothing was sent down and calling him greatly erring",
    "They acknowledge that had they listened or reasoned they would not be Blaze-companions",
    "Confessing their sin earns alienation for the Blaze-companions",
    "Those fearing their Lord unseen promised forgiveness and great reward",
    "Speech concealed or publicised alike known to Him who knows what the breasts contain",
    "The Creator necessarily knows since He is Subtle and Acquainted"
  ],
  "ext-067-p2": [
    "Earth made tame for walking its slopes and eating divine provision before resurrection",
    "Security questioned: could the One in heaven not cause the earth to swallow or sway",
    "Or send a stone-storm so they learn the warning's severity",
    "Earlier deniers' terrible reproach cited as precedent for the current warning",
    "Birds held aloft only by the Most Merciful as visible sign under His sight",
    "No army besides the Most Merciful can aid; disbelievers are in delusion",
    "No provider if He withholds provision; yet they persist in insolence and aversion",
    "The fallen walker contrasted with the upright on a straight path",
    "He produced them granting hearing, vision and hearts yet receiving little gratitude",
    "He multiplied them across the earth toward eventual gathering to Him"
  ],
  "ext-067-p3": [
    "Demand for the promise's timing answered: knowledge is only with Allah, he is merely a clear warner",
    "When they see it approaching their faces distress and they are told this is what they invoked",
    "When they see it approaching their faces distress and they are told this is what they used to invoke",
    "Challenge: who protects disbelievers from painful punishment if Allah causes the Prophet's death or shows mercy",
    "Declaration of belief in and reliance upon the Most Merciful with the prediction that they will know who is in clear error",
    "Closing challenge: if your water sinks, who brings flowing water"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`67:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`67:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 67, surahName: "Al-Mulk",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 10 genuine re-extraction. Boundaries follow the text: P1 closes with the Subtle-Acquainted argument (14) before the earth-provision-security block opens (15); P2 ends with the multiplication-and-gathering statement (24) before the eschatological-challenge block begins (25); P3 covers the timing question, the approach-distress, the protection challenge, the reliance declaration and the water challenge (25-30).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (67:1-14) ===
{
  const e = extractions[0];
  const aziz = findWord(2, ["\u0639","\u0632","\u064a","\u0632"]);
  const ghafoor = findWord(2, ["\u063a","\u0641","\u0648","\u0631"]);
  const rahman = findWord(3, ["\u0631","\u062d","\u0645","\u0646"]);
  const lateef = findWord(14, ["\u0644","\u0637","\u064a","\u0641"]);
  const khabir = findWord(14, ["\u062e","\u0628","\u064a","\u0631"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["67:2"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["67:2"] });
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["67:3"] });
  if (lateef) e.divineNamesAndAttributes.push({ term: lateef, transliteration: "Lateef", gloss: "Subtle (editorial gloss)", keys: ["67:14"] });
  if (khabir) e.divineNamesAndAttributes.push({ term: khabir, transliteration: "Khabir", gloss: "Acquainted (editorial gloss)", keys: ["67:14"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Death and life created as a test of best conduct", keys: ["67:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hell almost bursting with rage as keepers interrogate each incoming company", keys: ["67:7","67:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Regretful admission that listening or reasoning would have prevented Blaze-companionship", keys: ["67:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Fear of the Lord unseen earning forgiveness and great reward", keys: ["67:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Seven layered heavens without inconsistency as sign of the Most Merciful's creation", keys: ["67:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Stars beautifying the nearest heaven and serving as missiles against devils", keys: ["67:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The Creator's knowledge argued from the act of creation itself", keys: ["67:14"], evidenceClass: "EXPLICIT_TEXT" });

  const mulk = findWord(1, ["\u0645","\u0644","\u0643"]);
  if (mulk) e.terminology.push({ term: mulk, transliteration: "mulk", gloss: "dominion/sovereignty (editorial gloss)", keys: ["67:1"] });
  const tabaq = findWord(3, ["\u0637","\u0628","\u0642"]);
  if (tabaq) e.terminology.push({ term: tabaq, transliteration: "tibaq", gloss: "layers (editorial gloss)", keys: ["67:3"] });
}

// === POPULATE P2 (67:15-24) ===
{
  const e = extractions[1];
  const rahman2 = findWord(19, ["\u0631","\u062d","\u0645","\u0646"]);
  const rahman3 = findWord(20, ["\u0631","\u062d","\u0645","\u0646"]);
  const baseer = findWord(19, ["\u0628","\u0635","\u064a","\u0631"]);
  if (rahman2) e.divineNamesAndAttributes.push({ term: rahman2, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["67:19"] });
  if (rahman3) e.divineNamesAndAttributes.push({ term: rahman3, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["67:20"] });
  if (baseer) e.divineNamesAndAttributes.push({ term: baseer, transliteration: "Baseer", gloss: "Seeing (editorial gloss)", keys: ["67:19"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["67:15"], excerpt: fv(15), description: "Walk among the earth's slopes and eat of His provision." });

  e.humanConditionsAndSpiritualStates.push({ label: "False security questioned through earthquake and stone-storm scenarios", keys: ["67:16","67:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Persistence in insolence and aversion despite divine provision", keys: ["67:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Little gratitude shown despite being granted hearing, vision and hearts", keys: ["67:23"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Earth made tame for livelihood with provision sourced from Him alone", keys: ["67:15"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Birds held aloft only by the Most Merciful as observable sign", keys: ["67:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Fallen walker versus upright walker as guidance contrast", keys: ["67:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Multiplication across the earth leading to eventual gathering to Him", keys: ["67:24"], evidenceClass: "EXPLICIT_TEXT" });

  const dhallul = findWord(15, ["\u0630","\u0644","\u0648","\u0644"]);
  if (dhallul) e.terminology.push({ term: dhallul, transliteration: "dhallul", gloss: "tame/subservient (editorial gloss)", keys: ["67:15"] });
}

// === POPULATE P3 (67:25-30) ===
{
  const e = extractions[2];
  const rahman4 = findWord(29, ["\u0631","\u062d","\u0645","\u0646"]);
  if (rahman4) e.divineNamesAndAttributes.push({ term: rahman4, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["67:29"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["67:29"], excerpt: fv(29), description: "Say: He is the Most Merciful; we have believed in Him and upon Him we have relied." });

  e.humanConditionsAndSpiritualStates.push({ label: "Faces distressed when the threatened punishment approaches", keys: ["67:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Reliance placed solely upon the Most Merciful as the believer's stance", keys: ["67:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Knowledge of the Hour belonging exclusively to Allah; the Messenger is only a clear warner", keys: ["67:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No protector for disbelievers against painful punishment regardless of the Prophet's fate", keys: ["67:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Water sinking as irreversible loss illustrating total dependence on divine provision", keys: ["67:30"], evidenceClass: "EXPLICIT_TEXT" });

  const nadhir = findWord(26, ["\u0646","\u0630","\u064a","\u0631"]);
  if (nadhir) e.terminology.push({ term: nadhir, transliteration: "nadhir mubin", gloss: "clear warner (editorial gloss)", keys: ["67:26"] });
  const ghawr = findWord(30, ["\u063a","\u0648","\u0631"]);
  if (ghawr) e.terminology.push({ term: ghawr, transliteration: "ghawr", gloss: "sunken/deep (editorial gloss)", keys: ["67:30"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `067-al-mulk-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 067-al-mulk-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-067-p1,ext-067-p2,ext-067-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1789", label: "Death and life created as a test of best conduct", def: "In 67:2: He who created death and life to test you as to which of you is best in deed, and He is the Exalted in Might the Forgiving.", key: "67:2", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Khalaqa al-mawt wa'l-hayat."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Li-yabluwakum ayyukum ahsan."}] },
  { id: "cand-1790", label: "Seven layered heavens without inconsistency as cosmic sign", def: "In 67:3-4: He who created seven heavens in layers; you do not see in the creation of the Most Merciful any inconsistency; so return your vision to the sky do you see any breaks; then return your vision twice again, your vision will return to you humbled while it is fatigued.", key: "67:3", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sab'a samawat tibaq."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Repeated observation commanded."}] },
  { id: "cand-1791", label: "Hell's rage and keeper-interrogation exposing denial of the warner", def: "In 67:7-9: When they are thrown into it they hear from it a dreadful inhaling while it boils up; it almost bursts with rage; every time a company is thrown into it its keepers ask them did there not come to you a warner; they will say yes a warner had come to us but we denied.", key: "67:7", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Shahiq and fawran imagery."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Warner rejected confessed."}] },
  { id: "cand-1792", label: "Regretful admission that listening or reasoning would have saved them", def: "In 67:10-11: And they will say if only we had been listening or reasoning we would not be among the companions of the Blaze; and they will admit their sin so it is alienation for the companions of the Blaze.", key: "67:10", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Sam' and 'aql missed."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Too-late confession pattern."}] },
  { id: "cand-1793", label: "Fear of the Lord unseen earning forgiveness and great reward", def: "In 67:12: Indeed those who fear their Lord unseen will have forgiveness and great reward.", key: "67:12", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Khashyah bi'l-ghayb."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Maghfirah wa-ajr kabir."}] },

  { id: "cand-1794", label: "Earth made tame for livelihood with provision from Him alone", def: "In 67:15: It is He who made the earth tame for you so walk among its slopes and eat of His provision and to Him is the resurrection.", key: "67:15", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Dhallul framing of earth."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Rizq linked to resurrection."}] },
  { id: "cand-1795", label: "False security challenged through earthquake and stone-storm warnings", def: "In 67:16-18: Do you feel secure that He who holds authority in the heaven would not cause the earth to swallow you and suddenly it would sway; or do you feel secure that He who holds authority in the heaven would not send against you a storm of stones; then you would know how severe was My warning; and already had those before them denied and how terrible was My reproach.", key: "67:16", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Amintum man fi'l-sama'."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Historical precedent cited."}] },
  { id: "cand-1796", label: "Birds held aloft by the Most Merciful as observable sign", def: "In 67:19: Do they not see the birds above them with wings outspread and sometimes folded in; none holds them aloft except the Most Merciful; indeed He is of all things Seeing.", key: "67:19", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Tayr as daily observable ayah."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Rahman as sustainer of flight."}] },
  { id: "cand-1797", label: "Little gratitude despite hearing, vision and hearts", def: "In 67:23: Say it is He who has produced you and made for you hearing and vision and hearts; little are you grateful.", key: "67:23", overlap: [{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Qalila ma tashkurun."},{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Sam' basar af'idah triad."}] },

  { id: "cand-1798", label: "Knowledge of the Hour exclusive to Allah; Messenger only a clear warner", def: "In 67:25-26: And they say when is this promise if you should be truthful; say the knowledge is only with Allah and I am only a clear warner.", key: "67:26", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ilm only with Allah."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Nadhir mubin role limit."}] },
  { id: "cand-1799", label: "Reliance on the Most Merciful as the believer's stance against disbeliever threats", def: "In 67:29: Say He is the Most Merciful; we have believed in Him and upon Him we have relied; and you will come to know who it is that is in clear error.", key: "67:29", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Alayhi tawakkalna."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman plus tawakkul combined."}] },
  { id: "cand-1800", label: "Water sinking as irreversible loss illustrating total dependence", def: "In 67:30: Say have you considered if your water was to become sunken into the earth then who could bring you flowing water.", key: "67:30", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ma' ghawr as existential threat."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Irreplaceable provision demonstrated."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 5).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(5, 9).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(9, 12).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `067-al-mulk-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-091.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-091.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");