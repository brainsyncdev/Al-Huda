// MFD-11 Wave 11: Surah 75 (Al-Qiyamah) genuine re-extraction.
// Covers 75:1-40 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "075-0001-0040.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 75:${n} not found`);
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

console.log("Generating Surah 75 (Al-Qiyamah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T20:35:00.000Z";

const PASSAGES = [
  { id: "ext-075-p1", from: 1, to: 15,
    label: "swear Day Resurrection; swear reproaching soul certainty resurrection; man think not assemble bones; Yes Able proportion fingertips; man desires continue sin; asks when Day Resurrection; vision dazzled; moon darkens; sun moon joined; man say Day where escape; No no refuge; Lord Day permanence; man informed Day sent ahead kept back; Rather man against himself witness; even presents excuses",
    mainLabel: "Oaths by the Day of Resurrection and the reproaching soul affirming bone-reassembly and fingertip-proportioning power; man's desire to persist in sin producing the question when is the Day; when vision is dazzled, the moon darkens and sun and moon are joined, man asks where escape is — there is none, permanence belongs only to the Lord that Day; man informed of what he sent ahead and kept back, becoming a witness against himself even if he offers excuses" },
  { id: "ext-075-p2", from: 16, to: 25,
    label: "move not tongue hasten recitation Quran; indeed upon Us collection heart make possible recitation; when recited through Gabriel follow recitation; then upon Us clarification you; No love immediate; leave Hereafter; faces Day radiant; looking Lord; faces Day contorted; expecting done backbreaking",
    mainLabel: "The Prophet instructed not to hasten his tongue with Quranic recitation since its collection in his heart and its recitation rest upon Allah; once recited through Gabriel he should follow its recitation, with clarification also resting upon Allah; their love of the immediate and abandonment of the Hereafter exposed; radiant faces looking at their Lord contrasted with contorted faces expecting something backbreaking to be done to them" },
  { id: "ext-075-p3", from: 26, to: 35,
    label: "No soul reached collar bones; said who cure; dying certain time separation; leg wound about leg; Lord Day procession; disbeliever not believed nor prayed; denied turned away; went people swaggering pride; Woe you woe; Then woe you woe",
    mainLabel: "When the soul reaches the collar bones and it is asked who will cure him, the dying one becomes certain it is the time of separation with leg wound about leg; to the Lord that Day is the procession; the disbeliever neither believed nor prayed but denied and turned away, going to his people swaggering in pride; repeated woe pronounced upon him" },
  { id: "ext-075-p4", from: 36, to: 40,
    label: "man think left neglected; had not been sperm semen emitted; clinging clot created form proportioned; made two mates male female; not Creator Able give life dead",
    mainLabel: "Man questioned whether he thinks he will be left neglected after having been a sperm from emitted semen, then a clinging clot that Allah created and proportioned, making of him two mates male and female; the rhetorical conclusion that the Creator who did all this is surely able to give life to the dead" }
];

const SUB_LABELS = {
  "ext-075-p1": [
    "Oath sworn by the Day of Resurrection",
    "And by the reproaching soul as further confirmation",
    "Does man think We will not assemble his bones",
    "Yes — We are able even to proportion his fingertips",
    "But man desires to continue in sin",
    "He asks when the Day of Resurrection is",
    "When vision is dazzled",
    "And the moon darkens",
    "And the sun and moon are joined",
    "Man will ask on that Day where escape is",
    "There is no refuge",
    "To your Lord alone is permanence that Day",
    "Man informed of what he sent ahead and kept back",
    "Rather man against himself will be a witness",
    "Even if he presents his excuses"
  ],
  "ext-075-p2": [
    "Do not move your tongue to hasten the Quran's recitation",
    "Its collection in your heart and its recitation rest upon Us",
    "When We have recited it through Gabriel, follow its recitation",
    "Then its clarification to you also rests upon Us",
    "You love the immediate",
    "And leave the Hereafter",
    "Faces that Day will be radiant",
    "Looking at their Lord",
    "Faces that Day will be contorted",
    "Expecting that something backbreaking will be done to them"
  ],
  "ext-075-p3": [
    "When the soul has reached the collar bones",
    "And it is asked who will cure him",
    "The dying one is certain it is the time of separation",
    "And the leg is wound about the leg",
    "To your Lord that Day will be the procession",
    "The disbeliever had not believed nor had he prayed",
    "But instead he denied and turned away",
    "And went to his people swaggering in pride",
    "Woe to you, and woe",
    "Then woe to you, and woe"
  ],
  "ext-075-p4": [
    "Does man think he will be left neglected",
    "Had he not been a sperm from semen emitted",
    "Then a clinging clot that Allah created and proportioned",
    "And made of him two mates, the male and the female",
    "Is not that Creator able to give life to the dead"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`75:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`75:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 75, surahName: "Al-Qiyamah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 11 genuine re-extraction. Boundaries follow the text: P1 closes with the self-witness and excuses statement (15) before the Quran-recitation instruction opens (16); P2 ends with the contorted-faces-backbreaking-expectation scene (25) before the deathbed sequence begins (26); P3 runs through collar-bones, separation certainty, leg-wound, procession and the swaggering-denier woe (26-35); P4 covers the neglected-question, embryological stages and the closing resurrection-ability argument (36-40).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (75:1-15) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Desire to persist in sin producing denial of resurrection timing", keys: ["75:5","75:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Cosmic dissolution — dazzled vision, darkened moon, joined sun and moon — prompting the futile escape question", keys: ["75:7","75:8","75:9","75:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Self-witness against oneself despite offered excuses", keys: ["75:14","75:15"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Bone reassembly and fingertip proportioning demonstrating resurrection power", keys: ["75:3","75:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No refuge exists; permanence belongs solely to the Lord on that Day", keys: ["75:11","75:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Deeds sent ahead and kept back disclosed to man on that Day", keys: ["75:13"], evidenceClass: "EXPLICIT_TEXT" });

  const qiyamah = findWord(1, ["\u0642","\u064a","\u0627","\u0645"]);
  if (qiyamah) e.terminology.push({ term: qiyamah, transliteration: "yawm al-qiyamah", gloss: "Day of Resurrection (editorial gloss)", keys: ["75:1"] });
  const lawwamah = findWord(2, ["\u0644","\u0648","\u0627","\u0645"]);
  if (lawwamah) e.terminology.push({ term: lawwamah, transliteration: "al-nafs al-lawwamah", gloss: "the reproaching soul (editorial gloss)", keys: ["75:2"] });
  const banan = findWord(4, ["\u0628","\u0646","\u0627","\u0646"]);
  if (banan) e.terminology.push({ term: banan, transliteration: "banan", gloss: "fingertips (editorial gloss)", keys: ["75:4"] });
}

// === POPULATE P2 (75:16-25) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["75:16"], excerpt: fv(16), description: "Move not your tongue with it to hasten the recitation of the Quran." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["75:18"], excerpt: fv(18), description: "When We have recited it through Gabriel, then follow its recitation." });

  e.humanConditionsAndSpiritualStates.push({ label: "Love of the immediate and abandonment of the Hereafter diagnosed", keys: ["75:20","75:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Radiant faces looking at their Lord contrasted with contorted faces expecting backbreaking punishment", keys: ["75:22","75:23","75:24","75:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Quran collection, recitation and clarification all resting upon Allah", keys: ["75:17","75:18","75:19"], evidenceClass: "EXPLICIT_TEXT" });

  const nazir = findWord(23, ["\u0646","\u0627","\u0638","\u0631"]);
  if (nazir) e.terminology.push({ term: nazir, transliteration: "nazirah ila rabbiha", gloss: "looking at their Lord (editorial gloss)", keys: ["75:23"] });
}

// === POPULATE P3 (75:26-35) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Soul reaching collar bones with no cure available and certainty of separation", keys: ["75:26","75:27","75:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Leg wound about leg marking the final moment before procession to the Lord", keys: ["75:29","75:30"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Disbelief combined with prayer neglect, denial, turning away and swaggering pride", keys: ["75:31","75:32","75:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Swaggering return to people after denial identified as grounds for repeated woe", keys: ["75:33","75:34","75:35"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Procession to the Lord on that Day as the universal destination", keys: ["75:30"], evidenceClass: "EXPLICIT_TEXT" });

  const tarq = findWord(26, ["\u062a","\u0631","\u0642"]);
  if (tarq) e.terminology.push({ term: tarq, transliteration: "taraqi", gloss: "collar bones (editorial gloss)", keys: ["75:26"] });
  const saq = findWord(29, ["\u0633","\u0627","\u0642"]);
  if (saq) e.terminology.push({ term: saq, transliteration: "saq bi-saq", gloss: "leg wound about leg (editorial gloss)", keys: ["75:29"] });
}

// === POPULATE P4 (75:36-40) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Questioning whether man thinks he will be left neglected after creation", keys: ["75:36"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Embryological progression from sperm to clot to proportioned form with two mates", keys: ["75:37","75:38","75:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Creator's ability to give life to the dead argued from prior creative acts", keys: ["75:40"], evidenceClass: "EXPLICIT_TEXT" });

  const nutfah = findWord(37, ["\u0646","\u0637","\u0641"]);
  if (nutfah) e.terminology.push({ term: nutfah, transliteration: "nutfah", gloss: "sperm-drop (editorial gloss)", keys: ["75:37"] });
  const alaqah = findWord(38, ["\u0639","\u0644","\u0642"]);
  if (alaqah) e.terminology.push({ term: alaqah, transliteration: "alaqah", gloss: "clinging clot (editorial gloss)", keys: ["75:38"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `075-al-qiyamah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 075-al-qiyamah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-075-p1,ext-075-p2,ext-075-p3,ext-075-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1859", label: "Bone reassembly and fingertip proportioning proving resurrection power", def: "In 75:3-4: Does man think that We will not assemble his bones? Yes We are able even to proportion his fingertips.", key: "75:3", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Jam' al-izam wa-taswiyat al-banan."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Precision beyond mere reassembly."}] },
  { id: "cand-1860", label: "Reproaching soul sworn by alongside the Day of Resurrection", def: "In 75:1-2: I swear by the Day of Resurrection and I swear by the reproaching soul to the certainty of resurrection.", key: "75:1", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Nafs lawwamah as inner witness."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Dual oath structure."}] },
  { id: "cand-1861", label: "Cosmic dissolution producing the futile escape question", def: "In 75:7-12: So when vision is dazzled and the moon darkens and the sun and the moon are joined; man will say on that Day where is the place of escape; no there is no refuge; to your Lord that Day is the place of permanence.", key: "75:7", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Baraq basar and jama' shams wa-qamar."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"La malja' illa ilayhi."}] },

  { id: "cand-1862", label: "Quran collection, recitation and clarification guaranteed by Allah", def: "In 75:16-19: Move not your tongue with it to hasten with recitation of the Quran; indeed upon Us is its collection in your heart and to make possible its recitation; so when We have recited it through Gabriel then follow its recitation; then upon Us is its clarification to you.", key: "75:16", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"Jam' and bayan both ala Allah."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Gabriel-mediated tartil."}] },
  { id: "cand-1863", label: "Radiant faces looking at their Lord versus contorted faces expecting backbreaking", def: "In 75:22-25: Some faces that Day will be radiant looking at their Lord; and some faces that Day will be contorted expecting that there will be done to them something backbreaking.", key: "75:22", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Wujuh nadirah nazirah."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Basirah 'aqilah contrasted."}] },

  { id: "cand-1864", label: "Deathbed sequence: collar bones, no cure, separation certainty, leg-wound", def: "In 75:26-30: No when the soul has reached the collar bones and it is said who will cure him; and the dying one is certain that it is the time of separation; and the leg is wound about the leg; to your Lord that Day will be the procession.", key: "75:26", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Taraqi and saq bi-saq imagery."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Yaqin al-firaq at death."}] },
  { id: "cand-1865", label: "Denial, prayer neglect and swaggering pride earning repeated woe", def: "In 75:31-35: And the disbeliever had not believed nor had he prayed; but instead he denied and turned away; and then he went to his people swaggering in pride; woe to you and woe; then woe to you and woe.", key: "75:31", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Lam yusalli as primary indictment."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Khila ila ahlihi yatrukku."}] },

  { id: "cand-1866", label: "Embryological progression arguing resurrection ability", def: "In 75:36-40: Does man think that he will be left neglected; had he not been a sperm from semen emitted; then he was a clinging clot and Allah created his form and proportioned him; and made of him two mates the male and the female; is not that Creator able to give life to the dead.", key: "75:36", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Nutfah-alaqah-taswiyah sequence."},{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Qadir ala ihyā' al-mawta concluded."}] }
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
    notes: "Wave 11 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 3).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(3, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 7).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(7, 8).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `075-al-qiyamah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-099.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-099.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");