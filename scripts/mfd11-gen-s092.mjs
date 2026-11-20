// MFD-11 Wave 13: Surah 92 (Al-Layl) genuine re-extraction.
// Covers 92:1-21 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "092-0001-0021.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 92:${n} not found`);
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

console.log("Generating Surah 92 (Al-Layl) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T23:25:00.000Z";

const PASSAGES = [
  { id: "ext-092-p1", from: 1, to: 11,
    label: "By night covers; day appears; He created male female; Indeed efforts diverse; gives fears Allah believes best reward ease toward ease; withholds considers free need denies best reward ease toward difficulty; what wealth avail when falls",
    mainLabel: "Oaths by the covering night, the appearing day and the Creator of male and female establishing that human efforts are diverse; whoever gives, fears Allah and believes in the best reward is eased toward ease while whoever withholds, considers himself free of need and denies the best reward is eased toward difficulty — his wealth unable to avail him when he falls" },
  { id: "ext-092-p2", from: 12, to: 17,
    label: "Indeed upon Us guidance; Indeed Us Hereafter first life; warned Fire blazing; None burn except most wretched; denied turned away; righteous avoid it",
    mainLabel: "Guidance incumbent upon Allah to whom both the Hereafter and the first life belong; a blazing Fire warned of into which none burns except the most wretched who denied and turned away, while the righteous one avoids it" },
  { id: "ext-092-p3", from: 18, to: 21,
    label: "gives wealth purify himself; not anyone favor rewarded; only seeking countenance Lord Most High; going satisfied",
    mainLabel: "The righteous one identified as giving wealth to purify himself, not repaying a favour owed to anyone but seeking only the countenance of his Lord, the Most High — and he is going to be satisfied" }
];

const SUB_LABELS = {
  "ext-092-p1": [
    "Oath sworn by the night when it covers",
    "And by the day when it appears",
    "And by He who created the male and female",
    "Human efforts declared diverse",
    "Whoever gives, fears Allah and believes in the best reward",
    "Is eased toward ease",
    "Whoever withholds and considers himself free of need",
    "And denies the best reward",
    "Is eased toward difficulty",
    "His wealth asked rhetorically what it will avail him",
    "When he falls into destruction"
  ],
  "ext-092-p2": [
    "Guidance declared incumbent upon Allah",
    "Both the Hereafter and the first life belonging to Him",
    "A blazing Fire warned of",
    "None burning therein except the most wretched",
    "Who had denied and turned away",
    "The righteous one avoiding it"
  ],
  "ext-092-p3": [
    "Giving wealth to purify himself",
    "Not giving to repay anyone's favour",
    "Seeking only the countenance of his Lord, the Most High",
    "He is going to be satisfied"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`92:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`92:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 92, surahName: "Al-Layl",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 13 genuine re-extraction. Boundaries follow the text: P1 closes with the wealth-futility question at the point of falling (11) before the guidance-incumbency declaration opens (12); P2 ends with the righteous avoidance statement (17) before the purification-giving description begins (18); P3 runs through the four-verse portrait of sincere giving culminating in satisfaction (18-21).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (92:1-11) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Diverse efforts producing opposite trajectories based on giving or withholding", keys: ["92:4","92:5","92:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wealth rendered useless at the moment of falling", keys: ["92:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Night-day-male-female triple oath grounding effort-diversity in creation", keys: ["92:1","92:2","92:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Ease granted to the giver-fearer-believer versus difficulty eased toward the withholder-denier", keys: ["92:6","92:7","92:9","92:10"], evidenceClass: "EXPLICIT_TEXT" });

  const layl = findWord(1, ["\u0644","\u064a","\u0644"]);
  if (layl) e.terminology.push({ term: layl, transliteration: "al-layl", gloss: "the night (editorial gloss)", keys: ["92:1"] });
  const yusra = findWord(7, ["\u064a","\u0633","\u0631","\u0649"]);
  if (yusra) e.terminology.push({ term: yusra, transliteration: "al-yusra", gloss: "ease (editorial gloss)", keys: ["92:7"] });
  const usra = findWord(10, ["\u0639","\u0633","\u0631"]);
  if (usra) e.terminology.push({ term: usra, transliteration: "al-'usra", gloss: "difficulty (editorial gloss)", keys: ["92:10"] });
}

// === POPULATE P2 (92:12-17) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Most wretched defined by denial and turning away", keys: ["92:15","92:16"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Guidance incumbent upon Allah alongside ownership of both realms", keys: ["92:12","92:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Blazing Fire reserved exclusively for the denier-turner while the righteous avoids it", keys: ["92:14","92:17"], evidenceClass: "EXPLICIT_TEXT" });

  const hudan = findWord(12, ["\u0647","\u062f","\u0649"]);
  if (hudan) e.terminology.push({ term: hudan, transliteration: "huda", gloss: "guidance (editorial gloss)", keys: ["92:12"] });
  const ashqa = findWord(15, ["\u0623","\u0634","\u0642","\u0649"]);
  if (ashqa) e.terminology.push({ term: ashqa, transliteration: "al-ashqa", gloss: "the most wretched (editorial gloss)", keys: ["92:15"] });
}

// === POPULATE P3 (92:18-21) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Wealth given purely for self-purification without expectation of reciprocal favour", keys: ["92:18","92:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Satisfaction promised as the outcome of seeking the Lord's countenance alone", keys: ["92:20","92:21"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["92:18"], excerpt: fv(18), description: "Giving wealth to purify oneself." });

  e.relationships.push({ label: "Seeking the countenance of the Most High as the sole motive excluding all social debt", keys: ["92:19","92:20"], evidenceClass: "EXPLICIT_TEXT" });

  const tazkiyah = findWord(18, ["\u0632","\u0643","\u0649"]);
  if (tazkiyah) e.terminology.push({ term: tazkiyah, transliteration: "yatazakka", gloss: "purifies himself (editorial gloss)", keys: ["92:18"] });
  const wajh = findWord(20, ["\u0648","\u062c","\u0647"]);
  if (wajh) e.terminology.push({ term: wajh, transliteration: "wajh rabbih", gloss: "countenance of his Lord (editorial gloss)", keys: ["92:20"] });
  const ala = findWord(20, ["\u0623","\u0639","\u0644","\u0649"]);
  if (ala) e.divineNamesAndAttributes.push({ term: ala, transliteration: "al-A'la", gloss: "Most High (editorial gloss)", keys: ["92:20"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `092-al-layl-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 092-al-layl-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-092-p1,ext-092-p2,ext-092-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1960", label: "Night-day-male-female oaths framing diverse efforts and opposing ease", def: "In 92:1-11: By the night when it covers and by the day when it appears and by He who created the male and female; indeed your efforts are diverse; as for he who gives and fears Allah and believes in the best reward We will ease him toward ease; but as for he who withholds and considers himself free of need and denies the best reward We will ease him toward difficulty; and what will his wealth avail him when he falls.", key: "92:1", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Layl nahar khalaq qasam triad."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Yusra and 'usra as earned trajectories."}] },
  { id: "cand-1961", label: "Guidance incumbent upon Allah with both realms belonging to Him", def: "In 92:12-13: Indeed incumbent upon Us is guidance and indeed to Us belongs the Hereafter and the first life.", key: "92:12", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Huda plus mulk al-ula wa'l-akhira."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"related-not-identical",note:"Guidance as divine responsibility."}] },

  { id: "cand-1962", label: "Blazing Fire reserved for the denier-turner while the righteous avoids it", def: "In 92:14-17: So I have warned you of a Fire which is blazing; none will enter to burn therein except the most wretched one who had denied and turned away; but the righteous one will avoid it.", key: "92:14", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Nar talazza exclusivity."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Muttaqi as mutajaannib."}] },

  { id: "cand-1963", label: "Sincere giving for purification seeking only the Lord's countenance ending in satisfaction", def: "In 92:18-21: He who gives from his wealth to purify himself and not giving for anyone who has done him a favor to be rewarded but only seeking the countenance of his Lord Most High and he is going to be satisfied.", key: "92:18", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"I'ta' li-tazkiyah la mujazah."},{topicId:"gratitude",layer:"curated",relationship:"related-not-identical",note:"Rida as ultimate return."}] }
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
extractions[1].topicCandidateIds = candidates.candidates.slice(1, 3).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(3, 4).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `092-al-layl-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-116.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-116.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");