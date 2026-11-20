// MFD-11 Wave 9: Surah 63 (Al-Munafiqun) genuine re-extraction.
// Covers 63:1-11 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "063-0001-0011.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 63:${n} not found`);
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

console.log("Generating Surah 63 (Al-Munafiqun) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T18:35:00.000Z";

const PASSAGES = [
  { id: "ext-063-p1", from: 1, to: 4,
    label: "When hypocrites come you Muhammad say testify Messenger Allah; Allah knows you are His Messenger testifies hypocrites liars; taken oaths cover averted people way Allah evil doing; because believed then disbelieved hearts sealed over not understand; when see them forms please you speak listen speech like pieces wood propped up think every shout against them enemy beware them may Allah destroy them how deluded",
    mainLabel: "Hypocrites approaching the Prophet with verbal testimony that he is Allah's Messenger while Allah confirms his messengership and testifies they lie; their oaths used as cover to avert people from Allah's way, named as evil conduct rooted in belief followed by disbelief producing sealed hearts incapable of understanding; their pleasing appearance and eloquent speech masking hollow interiors like propped-up timber, paranoid that every cry targets them, identified as the enemy requiring vigilance, cursed with the question of how they remain deluded" },
  { id: "ext-063-p2", from: 5, to: 8,
    label: "When said come Messenger Allah ask forgiveness turn heads aside see evading arrogant; all same whether ask forgiveness or not never Allah forgive them indeed Allah does not guide defiantly disobedient; ones say do not spend those with Messenger Allah until disband; Allah belongs depositories heavens earth hypocrites not understand; say if return Madinah more honored power surely expel more humble; Allah belongs honor Messenger believers hypocrites not know",
    mainLabel: "Their refusal when invited to seek prophetic forgiveness — turning away arrogantly — answered by the declaration that asking or not asking makes no difference since Allah will never forgive them and does not guide the defiantly disobedient; their campaign to withhold spending on those with the Messenger until dispersal, ignorant that Allah owns the cosmic depositories; their boast that returning to Madinah the honoured would expel the humble, unaware that honour belongs entirely to Allah, His Messenger and the believers" },
  { id: "ext-063-p3", from: 9, to: 11,
    label: "O believed let not wealth children divert remembrance Allah whoever does losers; spend way Allah provided before death approaches says Lord delay brief term give charity among righteous; never Allah delay soul time come Allah Acquainted what do",
    mainLabel: "Believers warned not to let wealth or children divert them from Allah's remembrance, with whoever does so named among the losers; spending urged from divine provision before death arrives prompting the plea for a brief delay to give charity and join the righteous; the impossibility of delay affirmed once a soul's appointed time arrives, under His acquaintance with all deeds" }
];

const SUB_LABELS = {
  "ext-063-p1": [
    "Hypocrites approaching with verbal testimony that the Prophet is Allah's Messenger",
    "Allah confirming the messengership while testifying the hypocrites are liars",
    "Oaths used as cover to avert people from Allah's way, named as evil conduct",
    "Belief followed by disbelief producing sealed hearts incapable of understanding"
  ],
  "ext-063-p2": [
    "Refusal to seek prophetic forgiveness by turning away arrogantly",
    "Asking or not asking making no difference since Allah will never forgive them nor guide the defiantly disobedient",
    "Campaign to withhold spending on those with the Messenger, ignorant that Allah owns the cosmic depositories",
    "Boast that the honoured would expel the humble upon returning to Madinah, unaware that honour belongs to Allah, His Messenger and the believers"
  ],
  "ext-063-p3": [
    "Warning not to let wealth or children divert from Allah's remembrance, with whoever does so named among the losers",
    "Spending urged from divine provision before death prompts the plea for delay to give charity and join the righteous",
    "The impossibility of delay affirmed once a soul's time arrives, under His acquaintance with all deeds"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`63:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`63:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 63, surahName: "Al-Munafiqun",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the propped-timber paranoia and enemy identification (4) before the forgiveness-refusal block opens (5); P2 ends with the honour-attribution correction (8) before the believer-address begins (9); P3 covers the wealth-children warning, the pre-death spending urge and the closing no-delay affirmation (9-11).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (63:1-4) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Verbal testimony masking inner falsehood exposed by divine counter-testimony", keys: ["63:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Belief followed by disbelief sealing hearts against understanding", keys: ["63:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Pleasing exterior and eloquent speech hiding hollow interiors like propped timber, paranoid at every sound", keys: ["63:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Oaths weaponised as cover to obstruct the divine way", keys: ["63:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Hypocrites identified as the enemy requiring vigilance, cursed with delusion", keys: ["63:4"], evidenceClass: "EXPLICIT_TEXT" });

  const munafiqun = findWord(1, ["\u0645","\u0646","\u0627","\u0641","\u0642"]);
  if (munafiqun) e.terminology.push({ term: munafiqun, transliteration: "munafiqun", gloss: "hypocrites (editorial gloss)", keys: ["63:1"] });
  const khusub = findWord(4, ["\u062e","\u0634","\u0628"]);
  if (khusub) e.terminology.push({ term: khusub, transliteration: "khusub musannadah", gloss: "propped-up timber (editorial gloss)", keys: ["63:4"] });
}

// === POPULATE P2 (63:5-8) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["63:5"], excerpt: fv(5), description: "Come, the Messenger of Allah will ask forgiveness for you — an invitation they refused." });

  e.humanConditionsAndSpiritualStates.push({ label: "Turning heads aside arrogantly when invited to seek prophetic forgiveness", keys: ["63:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Forgiveness permanently withheld and guidance denied to the defiantly disobedient", keys: ["63:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "False claim that the honoured would expel the humble upon returning to Madinah", keys: ["63:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Economic blockade attempted by urging withholding of spending from the Messenger's companions", keys: ["63:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine ownership of cosmic depositories contrasted with hypocrite ignorance", keys: ["63:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Honour belonging exclusively to Allah, His Messenger and the believers, unknown to hypocrites", keys: ["63:8"], evidenceClass: "EXPLICIT_TEXT" });

  const khazaain = findWord(7, ["\u062e","\u0632","\u0627","\u0626"]);
  if (khazaain) e.terminology.push({ term: khazaain, transliteration: "khaza'in", gloss: "depositories/treasuries (editorial gloss)", keys: ["63:7"] });
  const izzah = findWord(8, ["\u0639","\u0632"]);
  if (izzah) e.terminology.push({ term: izzah, transliteration: "izzah", gloss: "honour/might (editorial gloss)", keys: ["63:8"] });
}

// === POPULATE P3 (63:9-11) ===
{
  const e = extractions[2];
  const khabir = findWord(11, ["\u062e","\u0628","\u064a","\u0631"]);
  if (khabir) e.divineNamesAndAttributes.push({ term: khabir, transliteration: "Khabir", gloss: "Acquainted (editorial gloss)", keys: ["63:11"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["63:9"], excerpt: fv(9), description: "Let not your wealth and your children divert you from remembrance of Allah." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["63:10"], excerpt: fv(10), description: "Spend from what We have provided you before death approaches one of you." });

  e.humanConditionsAndSpiritualStates.push({ label: "Wealth and children identified as potential diversions from divine remembrance", keys: ["63:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Deathbed plea for delay to give charity and join the righteous, declared impossible", keys: ["63:10","63:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Spending from divine provision urged before the deadline of death", keys: ["63:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Whoever allows diversion named among the losers", keys: ["63:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No delay granted once a soul's appointed time arrives, under complete divine acquaintance", keys: ["63:11"], evidenceClass: "EXPLICIT_TEXT" });

  const dhikr = findWord(9, ["\u0630","\u0643","\u0631"]);
  if (dhikr) e.terminology.push({ term: dhikr, transliteration: "dhikr Allah", gloss: "remembrance of Allah (editorial gloss)", keys: ["63:9"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `063-al-munafiqun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 063-al-munafiqun-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-063-p1,ext-063-p2,ext-063-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1755", label: "Verbal testimony exposed as lying by divine counter-testimony", def: "In 63:1: When the hypocrites come to you O Muhammad they say we testify that you are the Messenger of Allah; and Allah knows that you are His Messenger and Allah testifies that the hypocrites are liars.", key: "63:1", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Shahadah al-lisan without qalb."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Divine testimony overriding theirs."}] },
  { id: "cand-1756", label: "Oaths weaponised as cover to obstruct the divine way", def: "In 63:2: They have taken their oaths as a cover so they averted people from the way of Allah; indeed it was evil that they were doing.", key: "63:2", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Aymān as junnah."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Oath abuse condemned."}] },
  { id: "cand-1757", label: "Belief then disbelief sealing hearts against understanding", def: "In 63:3: That is because they believed and then they disbelieved so their hearts were sealed over and they do not understand.", key: "63:3", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman then kufr sequence."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Khatm preventing fiqh."}] },
  { id: "cand-1758", label: "Propped-timber exterior masking paranoia and enmity", def: "In 63:4: And when you see them their forms please you and if they speak you listen to their speech; they are as if they were pieces of wood propped up, they think every shout is against them; they are the enemy so beware of them.", key: "63:4", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Appearance versus reality."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Identified as al-aduww."}] },

  { id: "cand-1759", label: "Forgiveness permanently withheld after arrogant refusal", def: "In 63:5-6: When it is said come the Messenger will ask forgiveness for you they turn their heads aside evading arrogantly; it is all the same whether you ask forgiveness for them or not, never will Allah forgive them, indeed Allah does not guide the defiantly disobedient.", key: "63:5", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"I'rad with istikbar."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Lan yaghfira permanence."}] },
  { id: "cand-1760", label: "Economic blockade attempt exposed by divine treasury ownership", def: "In 63:7: They are the ones who say do not spend on those with the Messenger of Allah until they disband; and to Allah belong the depositories of the heavens and the earth but the hypocrites do not understand.", key: "63:7", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Withholding infaq as weapon."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Khaza'in samawat wa-ard."}] },
  { id: "cand-1761", label: "Honour belonging to Allah, His Messenger and believers alone", def: "In 63:8: They say if we return to al-Madinah the more honoured will surely expel the more humble; and to Allah belongs all honour and to His Messenger and to the believers but the hypocrites do not know.", key: "63:8", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Izzah exclusively divine-prophetic-believer."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"related-not-identical",note:"Power claim refuted."}] },

  { id: "cand-1762", label: "Wealth and children as diversions from remembrance producing loss", def: "In 63:9: O you who have believed let not your wealth and your children divert you from remembrance of Allah; and whoever does that then those are the losers.", key: "63:9", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr priority over dunya attachments."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Wealth-children as fitnah."}] },
  { id: "cand-1763", label: "Deathbed plea for delay to give charity declared impossible", def: "In 63:10-11: And spend from what We have provided you before death approaches one of you and he says my Lord if only You would delay me for a brief term so I would give charity and be among the righteous; but never will Allah delay a soul when its time has come.", key: "63:10", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Sadaqah urgency before mawt."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Too-late regret pattern."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 7).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(7, 9).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `063-al-munafiqun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-087.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-087.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");