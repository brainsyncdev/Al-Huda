// MFD-11 Wave 9: Surah 61 (As-Saff) genuine re-extraction.
// Covers 61:1-14 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "061-0001-0014.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 61:${n} not found`);
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

console.log("Generating Surah 61 (As-Saff) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T18:15:00.000Z";

const PASSAGES = [
  { id: "ext-061-p1", from: 1, to: 4,
    label: "Whatever heavens earth exalts Allah Exalted Might Wise; O believed why say what not do; great hatred sight Allah say what not do; indeed Allah loves those fight His cause row as though single structure joined firmly",
    mainLabel: "Universal tasbih affirming the Mighty Wise; believers rebuked for saying what they do not do, named as greatly hateful in Allah's sight; Allah loving those who fight in His cause standing in a row like a firmly joined structure" },
  { id: "ext-061-p2", from: 5, to: 9,
    label: "Moses said people why harm me while you know I am messenger Allah to you; when deviated Allah caused hearts deviate; Allah does not guide defiantly disobedient; Jesus son Mary said children Israel indeed I am messenger Allah confirming came before me Torah bringing good tidings messenger come after whose name Ahmad; when came clear evidences said obvious magic; who more unjust invents about Allah untruth while invited Islam; Allah does not guide wrongdoing; want extinguish light Allah mouths Allah perfect His light although disbelievers dislike; sent Messenger guidance religion truth manifest over all religion although associate others dislike",
    mainLabel: "Musa's complaint that his people harmed him despite knowing he was their messenger, with their deviation answered by Allah causing their hearts to deviate since He does not guide the defiantly disobedient; Isa son of Mary confirming the prior Torah and giving glad tidings of a messenger named Ahmad coming after him, met with the charge of obvious magic when clear evidences arrived; none more unjust than one fabricating against Allah while being invited to Islam, under the principle that He does not guide wrongdoers; their attempt to extinguish divine light with their mouths answered by Allah perfecting it despite their dislike; the Messenger sent with guidance and the religion of truth to prevail over all religion despite associators' displeasure" },
  { id: "ext-061-p3", from: 10, to: 14,
    label: "O believed shall I guide you transaction save painful punishment; believe Allah Messenger strive cause Allah wealth lives best should know; forgive sins admit gardens rivers flow pleasant dwellings perpetual residence great attainment; another favor love victory Allah imminent conquest give good tidings believers; O believed be supporters Allah as Jesus son Mary said disciples who are my supporters Allah; disciples said we are supporters Allah; faction Children Israel believed faction disbelieved; supported those believed against enemy became dominant",
    mainLabel: "Believers offered a trade that saves from painful punishment: believing in Allah and His Messenger and striving in His cause with wealth and lives, named the best if they knew; the reward comprising forgiveness of sins, admission to rivered gardens and pleasant dwellings in perpetual residence as the great attainment; an additional beloved favour of victory from Allah and imminent conquest announced with glad tidings to believers; the command to be Allah's supporters as Isa asked his disciples who would support him for Allah, they answering we are the supporters; Israel split into believing and disbelieving factions, with Allah supporting the believers against their enemy until they became dominant" }
];

const SUB_LABELS = {
  "ext-061-p1": [
    "As-Saff opens with creation's tasbih affirming Him Mighty and Wise before addressing believers",
    "Believers rebuked for saying what they do not do",
    "Saying without doing named as greatly hateful in Allah's sight",
    "Allah loving those who fight in His cause standing in a row like a firmly joined structure"
  ],
  "ext-061-p2": [
    "Musa complaining that his people harmed him despite knowing he was their messenger, with their deviation answered by heart-deviation since He does not guide the defiantly disobedient",
    "Isa confirming the prior Torah and announcing a messenger named Ahmad coming after him, met with the charge of obvious magic when clear evidences arrived",
    "None more unjust than one fabricating against Allah while being invited to Islam, under the rule that wrongdoers are not guided",
    "Attempts to extinguish divine light with mouths answered by Allah perfecting it despite their dislike",
    "The Messenger sent with guidance and the religion of truth to prevail over all religion despite associators' displeasure"
  ],
  "ext-061-p3": [
    "A saving trade offered to believers against painful punishment, defined as belief in Allah and His Messenger plus striving with wealth and lives",
    "Forgiveness of sins and admission to rivered gardens with pleasant dwellings in perpetual residence as the great attainment",
    "An additional beloved favour of victory from Allah and imminent conquest, with glad tidings to believers",
    "Command to be Allah's supporters as Isa asked his disciples who would support him for Allah, they answering we are the supporters",
    "Israel splitting into believing and disbelieving factions, with Allah supporting the believers against their enemy until they became dominant"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`61:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`61:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 61, surahName: "As-Saff",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the firm-rank imagery (4) before the Musa narrative opens (5); P2 ends with the religion-of-truth prevalence declaration (9) before the saving-trade offer begins (10); P3 runs from that offer through the victory promise, the hawariyyun dialogue and the closing dominance statement (10-14).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (61:1-4) ===
{
  const e = extractions[0];
  const aziz = findWord(1, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(1, ["\u062d","\u0643","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["61:1"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["61:1"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Saying what one does not do named as greatly hateful in Allah's sight", keys: ["61:2","61:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Universal tasbih opening the surah before the address to believers", keys: ["61:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Fighting in Allah's cause in a firm row likened to a joined structure as what Allah loves", keys: ["61:4"], evidenceClass: "EXPLICIT_TEXT" });

  const saff = findWord(4, ["\u0635","\u0641"]);
  if (saff) e.terminology.push({ term: saff, transliteration: "saff", gloss: "row/rank (editorial gloss)", keys: ["61:4"] });
  const bunyan = findWord(4, ["\u0628","\u0646","\u064a","\u0627","\u0646"]);
  if (bunyan) e.terminology.push({ term: bunyan, transliteration: "bunyan marsus", gloss: "firmly joined structure (editorial gloss)", keys: ["61:4"] });
}

// === POPULATE P2 (61:5-9) ===
{
  const e = extractions[1];

  e.propheticNarratives.push({ label: "Musa complaining that his people harmed him despite knowing he was their messenger; their deviation answered by heart-deviation", keys: ["61:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Isa confirming the Torah and announcing Ahmad; clear evidences dismissed as magic", keys: ["61:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["61:7"], excerpt: fv(7), description: "Who is more unjust than one who invents about Allah untruth while being invited to Islam." });

  e.humanConditionsAndSpiritualStates.push({ label: "Fabrication against Allah while being invited to Islam named as supreme injustice", keys: ["61:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Attempting to extinguish divine light with mouths while Allah perfects it", keys: ["61:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine guidance withheld from the defiantly disobedient and the wrongdoers", keys: ["61:5","61:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The Messenger sent with guidance and the religion of truth to prevail over all religion", keys: ["61:9"], evidenceClass: "EXPLICIT_TEXT" });

  const ahmad = findWord(6, ["\u0623","\u062d","\u0645","\u062f"]);
  if (ahmad) e.terminology.push({ term: ahmad, transliteration: "Ahmad", gloss: "the praised one (editorial gloss)", keys: ["61:6"] });
  const nur = findWord(8, ["\u0646","\u0648","\u0631"]);
  if (nur) e.terminology.push({ term: nur, transliteration: "nur Allah", gloss: "light of Allah (editorial gloss)", keys: ["61:8"] });
}

// === POPULATE P3 (61:10-14) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["61:14"], excerpt: fv(14), description: "O you who have believed, be supporters of Allah." });

  e.humanConditionsAndSpiritualStates.push({ label: "Victory from Allah and imminent conquest named as an additional beloved favour", keys: ["61:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Israel splitting into believing and disbelieving factions with divine support deciding the outcome", keys: ["61:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "The saving trade defined as belief in Allah and His Messenger plus striving with wealth and lives", keys: ["61:10","61:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Reward comprising forgiveness, rivered gardens, pleasant dwellings and perpetual residence as the great attainment", keys: ["61:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.propheticNarratives.push({ label: "Isa asking his disciples who would support him for Allah, with the hawariyyun answering we are the supporters", keys: ["61:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Believers becoming dominant through divine support against their enemies", keys: ["61:14"], evidenceClass: "EXPLICIT_TEXT" });

  const tijarah = findWord(10, ["\u062a","\u062c","\u0627","\u0631"]);
  if (tijarah) e.terminology.push({ term: tijarah, transliteration: "tijarah", gloss: "trade/transaction (editorial gloss)", keys: ["61:10"] });
  const hawariyyun = findWord(14, ["\u062d","\u0648","\u0627","\u0631"]);
  if (hawariyyun) e.terminology.push({ term: hawariyyun, transliteration: "hawariyyun", gloss: "disciples (editorial gloss)", keys: ["61:14"] });
  const ansar = findWord(14, ["\u0623","\u0646","\u0635","\u0627","\u0631"]);
  if (ansar) e.terminology.push({ term: ansar, transliteration: "ansar Allah", gloss: "supporters of Allah (editorial gloss)", keys: ["61:14"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `061-as-saff-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 061-as-saff-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-061-p1,ext-061-p2,ext-061-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1738", label: "Saying without doing named as greatly hateful in Allah's sight", def: "In 61:2-3: O you who have believed why do you say what you do not do? Great is hatred in the sight of Allah that you say what you do not do.", key: "61:2", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Qawl without fi'l condemned."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Maqt inda Allah severity."}] },
  { id: "cand-1739", label: "Firm ranks in Allah's cause likened to a joined structure as what He loves", def: "In 61:4: Indeed Allah loves those who fight in His cause in a row as though they are a single structure joined firmly.", key: "61:4", overlap: [{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Bunyan marsus unity image."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Structural discipline in struggle."}] },

  { id: "cand-1740", label: "Musa's complaint of harm from his own people despite known messengership", def: "In 61:5: And when Moses said to his people O my people why do you harm me while you certainly know that I am the messenger of Allah to you? And when they deviated Allah caused their hearts to deviate.", key: "61:5", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Adha min qawmihi."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Deviation answered by heart-sealing."}] },
  { id: "cand-1741", label: "Isa confirming Torah and naming Ahmad as the coming messenger", def: "In 61:6: And when Jesus the son of Mary said O children of Israel indeed I am the messenger of Allah to you confirming what came before me of the Torah and bringing good tidings of a messenger to come after me whose name is Ahmad; but when he came to them with clear evidences they said this is obvious magic.", key: "61:6", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Isa-Ahmad continuity."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Musaddiq li-ma bayna yadayya."}] },
  { id: "cand-1742", label: "Supreme injustice named as fabrication against Allah during invitation to Islam", def: "In 61:7: And who is more unjust than one who invents about Allah untruth while he is being invited to Islam? And Allah does not guide the wrongdoing people.", key: "61:7", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Azwalam superlative challenge."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Invitation rejected by fabrication."}] },
  { id: "cand-1743", label: "Divine light perfected despite attempts to extinguish it with mouths", def: "In 61:8: They want to extinguish the light of Allah with their mouths but Allah will perfect His light although the disbelievers dislike it.", key: "61:8", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Nur cannot be extinguished."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Light as revelation metaphor."}] },

  { id: "cand-1744", label: "The saving trade: belief and striving with wealth and lives", def: "In 61:10-11: O you who have believed shall I guide you to a transaction that will save you from a painful punishment? It is that you believe in Allah and His Messenger and strive in the cause of Allah with your wealth and your lives; that is best for you if you should know.", key: "61:10", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Wealth and life as investment."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Salvation framed as commerce."}] },
  { id: "cand-1745", label: "Great attainment: forgiveness, rivered gardens and pleasant dwellings", def: "In 61:12: He will forgive for you your sins and admit you to gardens beneath which rivers flow and pleasant dwellings in gardens of perpetual residence; that is the great attainment.", key: "61:12", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Maghfirah opening the reward."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Fawz azim defined."}] },
  { id: "cand-1746", label: "Victory and imminent conquest as additional beloved favour", def: "In 61:13: And another favour that you love, victory from Allah and an imminent conquest; and give good tidings to the believers.", key: "61:13", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Fath qarib as near-term hope."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Nasr min Allah promised."}] },
  { id: "cand-1747", label: "Hawariyyun pledge of support as model for the believing community", def: "In 61:14: O you who have believed be supporters of Allah as when Jesus the son of Mary said to the disciples who are my supporters for Allah? The disciples said we are supporters of Allah; and a faction of the Children of Israel believed and a faction disbelieved; so We supported those who believed against their enemy and they became dominant.", key: "61:14", overlap: [{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Ansar Allah as communal identity."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Isa's hawariyyun as precedent."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 6).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(6, 10).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `061-as-saff-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-085.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-085.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");