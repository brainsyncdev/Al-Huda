// MFD-11 Wave 13: Surah 93 (Ad-Duha) genuine re-extraction.
// Covers 93:1-11 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "093-0001-0011.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 93:${n} not found`);
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

console.log("Generating Surah 93 (Ad-Duha) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T23:35:00.000Z";

const PASSAGES = [
  { id: "ext-093-p1", from: 1, to: 5,
    label: "By morning brightness; night covers darkness; Lord not taken leave nor detested; Hereafter better first life; Lord going give satisfied",
    mainLabel: "Oaths by the morning brightness and the night when it covers with darkness affirming that the Lord has neither taken leave nor detested the Prophet; the Hereafter declared better for him than the first life, with his Lord promising to give until he is satisfied" },
  { id: "ext-093-p2", from: 6, to: 8,
    label: "Did He not find orphan give refuge; found lost guided; found poor made self-sufficient",
    mainLabel: "Three past divine favours recalled: finding the Prophet an orphan and giving him refuge, finding him lost and guiding him, and finding him poor and making him self-sufficient" },
  { id: "ext-093-p3", from: 9, to: 11,
    label: "as for orphan do not oppress; as for petitioner do not repel; as for favor Lord report",
    mainLabel: "Three ethical imperatives flowing from those favours: do not oppress the orphan, do not repel the petitioner, and report the favour of your Lord" }
];

const SUB_LABELS = {
  "ext-093-p1": [
    "Oath sworn by the morning brightness",
    "And by the night when it covers with darkness",
    "The Lord has not taken leave of the Prophet nor detested him",
    "The Hereafter affirmed better for him than the first life",
    "His Lord will give to him until he is satisfied"
  ],
  "ext-093-p2": [
    "Found an orphan and given refuge",
    "Found lost and guided",
    "Found poor and made self-sufficient"
  ],
  "ext-093-p3": [
    "The orphan must not be oppressed",
    "The petitioner must not be repelled",
    "The favour of the Lord must be reported"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`93:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`93:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 93, surahName: "Ad-Duha",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the satisfaction promise (5) before the three past-favour reminders open (6); P2 ends with the self-sufficiency gift (8) before the three resulting ethical commands begin (9); P3 covers the orphan-petitioner-favour-report triad (9-11).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (93:1-5) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Divine reassurance against abandonment or detestation", keys: ["93:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Future satisfaction promised through divine giving", keys: ["93:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Morning brightness and darkening night sworn by to ground the reassurance", keys: ["93:1","93:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Hereafter named superior to the first life as part of the consolation", keys: ["93:4"], evidenceClass: "EXPLICIT_TEXT" });

  const duha = findWord(1, ["\u0636","\u062d","\u0649"]);
  if (duha) e.terminology.push({ term: duha, transliteration: "al-duha", gloss: "the morning brightness (editorial gloss)", keys: ["93:1"] });
  const saja = findWord(2, ["\u0633","\u062c","\u0649"]);
  if (saja) e.terminology.push({ term: saja, transliteration: "saja", gloss: "covers with darkness/stillness (editorial gloss)", keys: ["93:2"] });
}

// === POPULATE P2 (93:6-8) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Three stages of divine care: orphanhood-to-refuge, lostness-to-guidance, poverty-to-self-sufficiency", keys: ["93:6","93:7","93:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.propheticNarratives.push({ label: "The Prophet's personal history of divine favour recalled as proof of ongoing care", keys: ["93:6","93:7","93:8"], evidenceClass: "EXPLICIT_TEXT" });

  const yateem = findWord(6, ["\u064a","\u062a","\u064a","\u0645"]);
  if (yateem) e.terminology.push({ term: yateem, transliteration: "yatim", gloss: "orphan (editorial gloss)", keys: ["93:6"] });
  const dalla = findWord(7, ["\u0636","\u0644","\u0644"]);
  if (dalla) e.terminology.push({ term: dalla, transliteration: "dallan fa-hada", gloss: "lost then guided (editorial gloss)", keys: ["93:7"] });
  const aila = findWord(8, ["\u0639","\u0627","\u0626","\u0644"]);
  if (aila) e.terminology.push({ term: aila, transliteration: "a'ilan fa-aghna", gloss: "poor then enriched (editorial gloss)", keys: ["93:8"] });
}

// === POPULATE P3 (93:9-11) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["93:9"], excerpt: fv(9), description: "Do not oppress the orphan." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["93:10"], excerpt: fv(10), description: "Do not repel the petitioner." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["93:11"], excerpt: fv(11), description: "Report the favour of your Lord." });

  e.socialEconomicCivilisational.push({ label: "Orphan protection and petitioner reception as social obligations derived from personal divine favour", keys: ["93:9","93:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine favour received translated into ethical duty toward the vulnerable", keys: ["93:9","93:10","93:11"], evidenceClass: "EXPLICIT_TEXT" });

  const saail = findWord(10, ["\u0633","\u0627","\u0626","\u0644"]);
  if (saail) e.terminology.push({ term: saail, transliteration: "al-sa'il", gloss: "the petitioner/asker (editorial gloss)", keys: ["93:10"] });
  const haddith = findWord(11, ["\u062d","\u062f","\u062b"]);
  if (haddith) e.terminology.push({ term: haddith, transliteration: "fa-haddith", gloss: "report/speak about (editorial gloss)", keys: ["93:11"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `093-ad-duha-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 093-ad-duha-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-093-p1,ext-093-p2,ext-093-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1964", label: "Morning-night oaths reassuring the Prophet against divine abandonment", def: "In 93:1-5: By the morning brightness and by the night when it covers with darkness; your Lord has not taken leave of you O Muhammad nor has He detested you; and the Hereafter is better for you than the first life; and your Lord is going to give you and you will be satisfied.", key: "93:1", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Personal reassurance to the Messenger."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Ma wadda'aka rabbuka wa-ma qala."}] },

  { id: "cand-1965", label: "Three past favours: orphan-refuge, lost-guidance, poor-self-sufficiency", def: "In 93:6-8: Did He not find you an orphan and give you refuge; and He found you lost and guided you; and He found you poor and made you self-sufficient.", key: "93:6", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Yatim-dall-a'il triad of divine care."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Prophetic biography as theological proof."}] },

  { id: "cand-1966", label: "Ethical imperatives: orphan protection, petitioner reception, favour reporting", def: "In 93:9-11: So as for the orphan do not oppress him; and as for the petitioner do not repel him; but as for the favor of your Lord report it.", key: "93:9", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Yatim and sa'il rights."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Ni'mah narration as shukr."}] }
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
    notes: "Wave 13 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 1).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(1, 2).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(2, 3).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `093-ad-duha-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-117.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-117.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");