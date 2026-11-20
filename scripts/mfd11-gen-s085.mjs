// MFD-11 Wave 12: Surah 85 (Al-Buruj) genuine re-extraction.
// Covers 85:1-22 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "085-0001-0022.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 85:${n} not found`);
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

console.log("Generating Surah 85 (Al-Buruj) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T22:15:00.000Z";

const PASSAGES = [
  { id: "ext-085-p1", from: 1, to: 9,
    label: "By sky containing great stars; promised Day; witness what witnessed; Cursed companions trench; fire full fuel; sitting near it; what doing against believers witnesses; resented not except believed Allah Exalted Might Praiseworthy; belongs dominion heavens earth Allah over all Witness",
    mainLabel: "Oaths by the sky containing great stars, the promised Day, and the witness with what is witnessed; the companions of the trench cursed — a fire full of fuel beside which they sat, witnessing their own treatment of the believers; their resentment directed at nothing but belief in Allah, the Exalted in Might and Praiseworthy, whose dominion covers heavens and earth while He is Witness over all things" },
  { id: "ext-085-p2", from: 10, to: 16,
    label: "tortured believing men women not repented punishment Hell punishment Burning Fire; believed righteous deeds gardens rivers flow great attainment; vengeance Lord severe; He originates creation repeats; Forgiving Affectionate; Honorable Owner Throne; Effecter what intends",
    mainLabel: "Those who tortured believing men and women without repenting face the punishment of Hell and of the Burning Fire, while believers doing righteous deeds receive rivered gardens as the great attainment; the Lord's vengeance declared severe alongside His originating and repeating creation; He is named Forgiving and Affectionate, Honourable Owner of the Throne, Effecter of whatever He intends" },
  { id: "ext-085-p3", from: 17, to: 22,
    label: "Has reached you story soldiers; Pharaoh Thamud; disbelieve persistent denial; Allah encompasses behind; honored Quran; Preserved Slate",
    mainLabel: "The story of the soldiers — those of Pharaoh and Thamud — recalled as precedent; disbelievers persisting in denial while Allah encompasses them from behind; the whole closed by affirming an honoured Quran inscribed in a Preserved Slate" }
];

const SUB_LABELS = {
  "ext-085-p1": [
    "Oath sworn by the sky containing great stars",
    "And by the promised Day",
    "And by the witness together with what is witnessed",
    "The companions of the trench cursed",
    "Their trench described as a fire full of fuel",
    "They were sitting beside that fire",
    "Witnessing their own treatment of the believers",
    "Their resentment directed only at belief in Allah, the Exalted in Might, the Praiseworthy",
    "His dominion over heavens and earth affirmed with Him as Witness over all things"
  ],
  "ext-085-p2": [
    "Torturers of believing men and women who did not repent facing Hell and the Burning Fire",
    "Believers doing righteous deeds receiving rivered gardens as the great attainment",
    "The Lord's vengeance declared severe",
    "He originates creation and repeats it",
    "Named the Forgiving and the Affectionate",
    "Honourable Owner of the Throne",
    "Effecter of whatever He intends"
  ],
  "ext-085-p3": [
    "The story of the soldiers introduced rhetorically",
    "Identified as those of Pharaoh and Thamud",
    "Disbelievers persisting in denial despite the precedent",
    "Allah encompassing them from behind",
    "The revelation affirmed as an honoured Quran",
    "Inscribed in a Preserved Slate"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`85:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`85:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 85, surahName: "Al-Buruj",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 12 genuine re-extraction. Boundaries follow the text: P1 closes with the dominion-and-Witness affirmation (9) before the torturer-versus-believer verdict opens (10); P2 ends with the Effecter-of-what-He-intends attribute (16) before the soldiers' precedent begins (17); P3 runs through Pharaoh and Thamud, the encompassment statement and the closing Preserved-Slate affirmation (17-22).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (85:1-9) ===
{
  const e = extractions[0];
  const aziz = findWord(8, ["\u0639","\u0632","\u064a","\u0632"]);
  const hameed = findWord(8, ["\u062d","\u0645","\u064a","\u062f"]);
  const shaheed = findWord(9, ["\u0634","\u0647","\u064a","\u062f"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["85:8"] });
  if (hameed) e.divineNamesAndAttributes.push({ term: hameed, transliteration: "Hameed", gloss: "Praiseworthy (editorial gloss)", keys: ["85:8"] });
  if (shaheed) e.divineNamesAndAttributes.push({ term: shaheed, transliteration: "Shaheed", gloss: "Witness (editorial gloss)", keys: ["85:9"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Resentment directed solely at belief in Allah rather than any worldly grievance", keys: ["85:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Persecutors seated beside their own fire witnessing their treatment of believers", keys: ["85:6","85:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "The trench episode: organised burning of believers as religious persecution", keys: ["85:4","85:5","85:6","85:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Three-fold oath by the star-bearing sky, the promised Day and the witness with what is witnessed", keys: ["85:1","85:2","85:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Dominion over heavens and earth joined to universal witnessing of the persecution", keys: ["85:9"], evidenceClass: "EXPLICIT_TEXT" });

  const buruj = findWord(1, ["\u0628","\u0631","\u0648","\u062c"]);
  if (buruj) e.terminology.push({ term: buruj, transliteration: "al-buruj", gloss: "great stars/constellations (editorial gloss)", keys: ["85:1"] });
  const ukhdud = findWord(4, ["\u0623","\u062e","\u062f","\u0648","\u062f"]);
  if (ukhdud) e.terminology.push({ term: ukhdud, transliteration: "al-ukhdud", gloss: "the trench (editorial gloss)", keys: ["85:4"] });
}

// === POPULATE P2 (85:10-16) ===
{
  const e = extractions[1];
  const ghafoor = findWord(14, ["\u063a","\u0641","\u0648","\u0631"]);
  const wadud = findWord(14, ["\u0648","\u062f","\u0648","\u062f"]);
  const majeed = findWord(15, ["\u0645","\u062c","\u064a","\u062f"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["85:14"] });
  if (wadud) e.divineNamesAndAttributes.push({ term: wadud, transliteration: "Wadud", gloss: "Affectionate (editorial gloss)", keys: ["85:14"] });
  if (majeed) e.divineNamesAndAttributes.push({ term: majeed, transliteration: "Majeed", gloss: "Honourable (editorial gloss)", keys: ["85:15"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Failure to repent after torturing believers sealing the double punishment", keys: ["85:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Belief joined to righteous deeds earning rivered gardens as the great attainment", keys: ["85:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Severity of divine vengeance set beside origination and repetition of creation", keys: ["85:12","85:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Forgiveness and affection paired with Throne-ownership and effective will", keys: ["85:14","85:15","85:16"], evidenceClass: "EXPLICIT_TEXT" });

  const arsh = findWord(15, ["\u0639","\u0631","\u0634"]);
  if (arsh) e.terminology.push({ term: arsh, transliteration: "dhu al-arsh", gloss: "Owner of the Throne (editorial gloss)", keys: ["85:15"] });
  const faaal = findWord(16, ["\u0641","\u0639","\u0627","\u0644"]);
  if (faaal) e.terminology.push({ term: faaal, transliteration: "fa'al lima yurid", gloss: "Effecter of what He intends (editorial gloss)", keys: ["85:16"] });
}

// === POPULATE P3 (85:17-22) ===
{
  const e = extractions[2];

  e.propheticNarratives.push({ label: "The soldiers of Pharaoh and Thamud cited as precedent for persecuting powers", keys: ["85:17","85:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Persistent denial maintained while Allah encompasses the deniers from behind", keys: ["85:19","85:20"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Honoured Quran inscribed in a Preserved Slate as the closing authentication", keys: ["85:21","85:22"], evidenceClass: "EXPLICIT_TEXT" });

  const lawh = findWord(22, ["\u0644","\u0648","\u062d"]);
  if (lawh) e.terminology.push({ term: lawh, transliteration: "lawh mahfuz", gloss: "Preserved Slate (editorial gloss)", keys: ["85:22"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `085-al-buruj-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 085-al-buruj-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-085-p1,ext-085-p2,ext-085-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1926", label: "Companions of the trench cursed for burning believers", def: "In 85:4-7: Cursed were the companions of the trench containing the fire full of fuel; when they were sitting near it and they to what they were doing against the believers were witnesses.", key: "85:4", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Ashab al-ukhdud persecution."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Qutila curse pronounced."}] },
  { id: "cand-1927", label: "Resentment grounded solely in belief in the Mighty Praiseworthy", def: "In 85:8-9: And they resented them not except because they believed in Allah the Exalted in Might the Praiseworthy, to whom belongs the dominion of the heavens and the earth; and Allah over all things is Witness.", key: "85:8", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman as the sole offence."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Aziz Hameed pairing."}] },

  { id: "cand-1928", label: "Unrepented torture of believers answered by Hell and the Burning Fire", def: "In 85:10: Indeed those who have tortured the believing men and believing women and then have not repented will have the punishment of Hell and they will have the punishment of the Burning Fire.", key: "85:10", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Tawbah withheld seals the verdict."},{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Adhab jahannam wa-hariq doubled."}] },
  { id: "cand-1929", label: "Severe vengeance alongside origination, repetition, forgiveness and affection", def: "In 85:12-16: Indeed the vengeance of your Lord is severe; indeed it is He who originates creation and repeats; and He is the Forgiving the Affectionate, Honorable Owner of the Throne, Effecter of what He intends.", key: "85:12", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Batsh shadid with yubdi'u wa-yu'id."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafoor Wadud beside severity."}] },

  { id: "cand-1930", label: "Pharaoh and Thamud as precedent with divine encompassment from behind", def: "In 85:17-20: Has there reached you the story of the soldiers, those of Pharaoh and Thamud; but they who disbelieve are in persistent denial while Allah encompasses them from behind.", key: "85:17", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Junud Firawn wa-Thamud precedent."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Min wara'ihim muhit."}] },
  { id: "cand-1931", label: "Honoured Quran inscribed in a Preserved Slate", def: "In 85:21-22: But this is an honored Quran inscribed in a Preserved Slate.", key: "85:21", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"Lawh mahfuz guarding the text."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Quran majeed authentication."}] }
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
    notes: "Wave 12 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 4).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(4, 6).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `085-al-buruj-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-109.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-109.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");