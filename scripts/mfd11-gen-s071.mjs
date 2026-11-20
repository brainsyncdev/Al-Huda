// MFD-11 Wave 10: Surah 71 (Nuh) genuine re-extraction.
// Covers 71:1-28 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "071-0001-0028.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 71:${n} not found`);
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

console.log("Generating Surah 71 (Nuh) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T19:55:00.000Z";

const PASSAGES = [
  { id: "ext-071-p1", from: 1, to: 4,
    label: "Indeed We sent Noah people saying warn people before comes painful punishment; he said O my people indeed I am to you clear warner; saying worship Allah fear Him obey me; Allah forgive you sins delay you specified term indeed time set Allah when comes not delayed if only knew",
    mainLabel: "Noah sent to his people with the commission to warn them before a painful punishment arrives; his self-declaration as a clear warner followed by the threefold message — worship Allah, fear Him and obey me; the promised outcome being forgiveness of sins and respite for a specified term, sealed by the principle that Allah's appointed time cannot be delayed once it arrives" },
  { id: "ext-071-p2", from: 5, to: 20,
    label: "he said My Lord indeed invited people night day; invitation increased not except flight; every time invited You may forgive put fingers ears covered garments persisted arrogant great arrogance; then invited publicly; then announced confided secretly; said ask forgiveness Lord indeed ever Perpetual Forgiver; send rain sky continuing showers; give increase wealth children provide gardens rivers; what matter not attribute Allah due grandeur; while created you stages; not consider how created seven heavens layers; made moon therein reflected light sun burning lamp; caused grow earth progressive growth; then return into it extract another extraction; made earth expanse; that follow therein roads passage",
    mainLabel: "Noah's complaint that he invited his people night and day yet the invitation only increased their flight; each call toward forgiveness met with fingers in ears, garments drawn over themselves, persistence and great arrogance; he then invited publicly, announced openly and confided secretly, urging them to seek forgiveness from the Perpetual Forgiver who would send continuing rain, increase wealth and children and provide gardens and rivers; he questions their failure to attribute due grandeur to Allah who created them in stages, pointing to the seven layered heavens with the moon as reflected light and the sun as a burning lamp, their progressive growth from the earth followed by return into it and another extraction, and the earth made an expanse for traversing its roads" },
  { id: "ext-071-p3", from: 21, to: 28,
    label: "Noah said My Lord indeed disobeyed me followed him whose wealth children not increase except loss; conspired immense conspiracy; said never leave gods never leave Wadd Suwa Yaghuth Yauq Nasr; already misled many do not increase wrongdoers except error; because sins drowned put into Fire found not besides Allah helpers; Noah said My Lord do not leave upon earth disbelievers inhabitant; indeed if leave them mislead Your servants not beget except wicked confirmed disbeliever; My Lord forgive me parents whoever enters house believer believing men believing women do not increase wrongdoers except destruction",
    mainLabel: "Noah reporting that his people disobeyed him and followed one whose wealth and children only increased his loss; their immense conspiracy expressed in the command never to abandon their gods — Wadd, Suwa, Yaghuth, Ya'uq and Nasr — having already misled many, prompting his plea that the wrongdoers be increased only in error; because of their sins they were drowned and put into the Fire finding no helpers besides Allah; his further plea that no disbelieving inhabitant be left on earth since they would mislead His servants and beget only the wicked and confirmed disbelievers; closing with the taught supplication for forgiveness of himself, his parents, whoever enters his house as a believer and all believing men and women, while asking that the wrongdoers be increased only in destruction" }
];

const SUB_LABELS = {
  "ext-071-p1": [
    "Noah sent to his people with the commission to warn before a painful punishment arrives",
    "His self-declaration as a clear warner to his people",
    "The threefold message: worship Allah, fear Him and obey me",
    "Forgiveness of sins and respite for a specified term promised, with Allah's appointed time undelayable once it comes"
  ],
  "ext-071-p2": [
    "Noah's complaint that he invited his people night and day",
    "The invitation increasing them only in flight",
    "Each call toward forgiveness met with fingers in ears, garments drawn over themselves, persistence and great arrogance",
    "He then invited them publicly",
    "He announced openly and also confided to them secretly",
    "Urging them to seek forgiveness from their Lord who is ever a Perpetual Forgiver",
    "Continuing rain from the sky promised as its fruit",
    "Increase in wealth and children with gardens and rivers provided",
    "Questioning their failure to attribute due grandeur to Allah",
    "Their creation in stages cited as grounds for that grandeur",
    "The seven layered heavens offered for consideration",
    "The moon made a reflected light therein and the sun a burning lamp",
    "Their progressive growth caused from the earth",
    "Return into the earth followed by another extraction from it",
    "The earth made an expanse for them",
    "So that they may follow roads of passage therein"
  ],
  "ext-071-p3": [
    "Noah reporting their disobedience and their following one whose wealth and children only increased his loss",
    "Their immense conspiracy against the message",
    "The command never to abandon their gods: Wadd, Suwa, Yaghuth, Ya'uq and Nasr",
    "Many already misled, with the plea that wrongdoers be increased only in error",
    "Because of their sins they were drowned and put into the Fire with no helpers besides Allah",
    "The plea that no disbelieving inhabitant be left upon the earth",
    "The reason given: they would mislead His servants and beget only the wicked and confirmed disbelievers",
    "Closing supplication for forgiveness of himself, his parents, believers entering his house and all believing men and women, with destruction asked for the wrongdoers"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`71:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`71:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 71, surahName: "Nuh",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 10 genuine re-extraction. Boundaries follow the text: P1 closes with the undelayable appointed term (4) before Noah's night-and-day complaint opens (5); P2 ends with the earth-as-expanse and roads-of-passage argument (20) before the disobedience-and-conspiracy report begins (21); P3 runs through the five named idols, the drowning verdict, the no-inhabitant plea and the closing comprehensive supplication (21-28).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (71:1-4) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["71:1"], excerpt: fv(1), description: "Warn your people before there comes to them a painful punishment." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["71:3"], excerpt: fv(3), description: "Worship Allah, fear Him and obey me." });

  e.propheticNarratives.push({ label: "Noah sent to his people as a clear warner delivering the worship-taqwa-obedience message", keys: ["71:1","71:2","71:3"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Forgiveness and respite offered in exchange for worship, taqwa and obedience", keys: ["71:3","71:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Allah's appointed time declared undelayable once it arrives", keys: ["71:4"], evidenceClass: "EXPLICIT_TEXT" });

  const nadhir = findWord(2, ["\u0646","\u0630","\u064a","\u0631"]);
  if (nadhir) e.terminology.push({ term: nadhir, transliteration: "nadhir mubin", gloss: "clear warner (editorial gloss)", keys: ["71:2"] });
  const ajal = findWord(4, ["\u0623","\u062c","\u0644"]);
  if (ajal) e.terminology.push({ term: ajal, transliteration: "ajal Allah", gloss: "the time set by Allah (editorial gloss)", keys: ["71:4"] });
}

// === POPULATE P2 (71:5-20) ===
{
  const e = extractions[1];
  const ghaffar = findWord(10, ["\u063a","\u0641","\u0627","\u0631"]);
  if (ghaffar) e.divineNamesAndAttributes.push({ term: ghaffar, transliteration: "Ghaffar", gloss: "Perpetual Forgiver (editorial gloss)", keys: ["71:10"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["71:10"], excerpt: fv(10), description: "Ask forgiveness of your Lord. Indeed, He is ever a Perpetual Forgiver." });

  e.propheticNarratives.push({ label: "Noah's escalating da'wah methods: night and day, public invitation, open announcement and secret confiding", keys: ["71:5","71:8","71:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Invitation increasing the audience only in flight", keys: ["71:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Fingers in ears, garments drawn over themselves, persistence and great arrogance as rejection postures", keys: ["71:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Failure to attribute due grandeur to Allah despite staged creation", keys: ["71:13","71:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Istighfar linked to continuing rain, increased wealth and children, gardens and rivers", keys: ["71:10","71:11","71:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Earth made an expanse so people may follow roads of passage", keys: ["71:19","71:20"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Seven layered heavens with the moon as reflected light and the sun as a burning lamp", keys: ["71:15","71:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Progressive growth from the earth, return into it and another extraction", keys: ["71:17","71:18"], evidenceClass: "EXPLICIT_TEXT" });

  const istighfar = findWord(10, ["\u0627","\u0633","\u062a","\u063a","\u0641"]);
  if (istighfar) e.terminology.push({ term: istighfar, transliteration: "istaghfiru", gloss: "ask forgiveness (editorial gloss)", keys: ["71:10"] });
  const midrar = findWord(11, ["\u0645","\u062f","\u0631","\u0627","\u0631"]);
  if (midrar) e.terminology.push({ term: midrar, transliteration: "midrara", gloss: "continuing showers (editorial gloss)", keys: ["71:11"] });
  const siraj = findWord(16, ["\u0633","\u0631","\u0627","\u062c"]);
  if (siraj) e.terminology.push({ term: siraj, transliteration: "siraj", gloss: "burning lamp (editorial gloss)", keys: ["71:16"] });
}

// === POPULATE P3 (71:21-28) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["71:26"], excerpt: fv(26), description: "My Lord, do not leave upon the earth from among the disbelievers an inhabitant." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["71:28"], excerpt: fv(28), description: "My Lord, forgive me and my parents and whoever enters my house a believer and the believing men and believing women." });

  e.propheticNarratives.push({ label: "Noah's people conspiring to preserve Wadd, Suwa, Yaghuth, Ya'uq and Nasr, then drowned and put into the Fire", keys: ["71:22","71:23","71:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Following one whose wealth and children only increase his loss", keys: ["71:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Immense conspiracy expressed as refusal to abandon inherited idols", keys: ["71:22","71:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Concern that surviving disbelievers would mislead servants and beget only wicked disbelievers", keys: ["71:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Five named idols of Noah's people preserved through communal conspiracy", keys: ["71:23"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Drowning followed by the Fire with no helpers found besides Allah", keys: ["71:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Comprehensive intercession covering self, parents, household believers and all believing men and women", keys: ["71:28"], evidenceClass: "EXPLICIT_TEXT" });

  const wadd = findWord(23, ["\u0648","\u062f"]);
  if (wadd) e.terminology.push({ term: wadd, transliteration: "Wadd", gloss: "a named idol of Noah's people (editorial gloss)", keys: ["71:23"] });
  const suwa = findWord(23, ["\u0633","\u0648","\u0627","\u0639"]);
  if (suwa) e.terminology.push({ term: suwa, transliteration: "Suwa'", gloss: "a named idol of Noah's people (editorial gloss)", keys: ["71:23"] });
  const nasr = findWord(23, ["\u0646","\u0633","\u0631"]);
  if (nasr) e.terminology.push({ term: nasr, transliteration: "Nasr", gloss: "a named idol of Noah's people (editorial gloss)", keys: ["71:23"] });
  const tabar = findWord(28, ["\u062a","\u0628","\u0627","\u0631"]);
  if (tabar) e.terminology.push({ term: tabar, transliteration: "tabar", gloss: "destruction (editorial gloss)", keys: ["71:28"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `071-nuh-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 071-nuh-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-071-p1,ext-071-p2,ext-071-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1829", label: "Noah's threefold message of worship, taqwa and obedience with undelayable term", def: "In 71:2-4: He said O my people indeed I am to you a clear warner, saying worship Allah fear Him and obey me; Allah will forgive you of your sins and delay you for a specified term; indeed the time set by Allah when it comes will not be delayed if you only knew.", key: "71:2", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Nuh's core da'wah formula."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Ajal Allah undelayable."}] },

  { id: "cand-1830", label: "Escalating da'wah methods met with physical rejection postures", def: "In 71:5-9: My Lord indeed I invited my people night and day but my invitation increased them not except in flight; and indeed every time I invited them that You may forgive them they put their fingers in their ears covered themselves with their garments persisted and were arrogant with great arrogance; then I invited them publicly; then I announced to them and also confided to them secretly.", key: "71:5", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Persistence across four methods."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Istikbar kabir diagnosed."}] },
  { id: "cand-1831", label: "Istighfar linked to rain, wealth, children, gardens and rivers", def: "In 71:10-12: Ask forgiveness of your Lord indeed He is ever a Perpetual Forgiver; He will send rain from the sky upon you in continuing showers and give you increase in wealth and children and provide for you gardens and provide for you rivers.", key: "71:10", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Istighfar as material cause."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghaffar naming the promise."}] },
  { id: "cand-1832", label: "Staged creation and layered heavens as grounds for attributing grandeur", def: "In 71:13-18: What is the matter with you that you do not attribute to Allah due grandeur while He has created you in stages; do you not consider how Allah has created seven heavens in layers and made the moon therein a reflected light and made the sun a burning lamp; and Allah has caused you to grow from the earth a progressive growth then He will return you into it and extract you another extraction.", key: "71:13", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Atwar staged development."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Cosmic and agricultural signs combined."}] },

  { id: "cand-1833", label: "Five named idols preserved through immense conspiracy", def: "In 71:22-23: And they conspired an immense conspiracy and said never leave your gods and never leave Wadd or Suwa or Yaghuth and Yauq and Nasr.", key: "71:22", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Five idols named as objects of communal worship."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"related-not-identical",note:"Communal enforcement of shirk."}] },
  { id: "cand-1834", label: "Drowning followed by the Fire with no helpers besides Allah", def: "In 71:25: Because of their sins they were drowned and put into the Fire and they found not for themselves besides Allah any helpers.", key: "71:25", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Khata'aya causing dual punishment."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Nuh's people's end."}] },
  { id: "cand-1835", label: "Comprehensive supplication for self, parents, household and all believers", def: "In 71:28: My Lord forgive me and my parents and whoever enters my house a believer and the believing men and believing women; and do not increase the wrongdoers except in destruction.", key: "71:28", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Prophetic istighfar scope."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Parents included in the dua."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 1).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(1, 4).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(4, 7).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `071-nuh-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-095.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-095.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");