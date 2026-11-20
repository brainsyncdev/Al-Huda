// MFD-11 Wave 10: Surah 70 (Al-Ma'arij) genuine re-extraction.
// Covers 70:1-44 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "070-0001-0044.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 70:${n} not found`);
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

console.log("Generating Surah 70 (Al-Ma'arij) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T19:45:00.000Z";

const PASSAGES = [
  { id: "ext-070-p1", from: 1, to: 18,
    label: "supplicant asked punishment bound happen disbelievers no preventer Allah owner ways ascent; angels Spirit ascend Him Day extent fifty thousand years; patient gracious patience; they see distant We see near; Day sky like murky oil mountains like wool; no friend ask anything friend shown each other criminal wish ransomed punishment Day children wife brother nearest kindred shelter whoever earth entirely save; No indeed Flame Hell remover exteriors invites turned back truth went away obedience collected wealth hoarded",
    mainLabel: "A supplicant asking for a punishment bound to fall upon disbelievers with no preventer, issued from Allah as owner of the ways of ascent; angels and the Spirit ascending to Him during a Day measuring fifty thousand years; gracious patience commanded since they see it distant while He sees it near; on that Day the sky becomes like murky oil and mountains like wool, no friend enquiring of another though shown each other, the criminal wishing to ransom himself with children, wife, brother, sheltering kindred and everyone on earth; the answer is refusal — it is the Flame stripping away exteriors, summoning whoever turned his back on truth, withdrew from obedience, and collected and hoarded wealth" },
  { id: "ext-070-p2", from: 19, to: 35,
    label: "indeed mankind created anxious evil touches impatient good touches withholding; except observers prayer constant prayer; within wealth known right petitioner deprived; believe Day Recompense; fearful punishment Lord indeed punishment Lord not safe; guard private parts except wives right hands possess not blamed whoever seeks beyond transgressors; trusts promises attentive; testimonies upright; carefully maintain prayer; gardens honored",
    mainLabel: "Mankind declared created anxious — impatient when evil touches and withholding when good touches — with the exception of the prayer-observers who are constant in prayer; those whose wealth carries a known right for the petitioner and the deprived; believers in the Day of Recompense who fear their Lord's punishment since it offers no security; those guarding their private parts except with wives or rightful possessions without blame, while whoever seeks beyond is a transgressor; those attentive to trusts and promises, upright in testimony and careful in maintaining prayer — these will be honoured in gardens" },
  { id: "ext-070-p3", from: 36, to: 41,
    label: "what matter disbelieve hastening before you Muhammad sit right left separate groups; every person aspire enter garden pleasure; No indeed created them that which know; swear Lord risings settings indeed able replace better not outdone",
    mainLabel: "The disbelievers questioned for hastening away from the Prophet to sit in separate groups on his right and left, each aspiring to enter a garden of pleasure; the refusal grounded in their creation from what they know; an oath by the Lord of all risings and settings affirming ability to replace them with better people, with none able to outdo Him" },
  { id: "ext-070-p4", from: 42, to: 44,
    label: "leave them converse vainly amuse until meet Day promised; Day emerge graves rapidly toward erected idol hastening; eyes humbled humiliation cover that Day had been promised",
    mainLabel: "The Prophet told to leave them to vain conversation and amusement until they meet their promised Day; that Day they emerge from graves rapidly as though hastening toward an erected idol, their eyes humbled and humiliation covering them — the very Day they had been promised" }
];

const SUB_LABELS = {
  "ext-070-p1": [
    "A supplicant asking for a punishment bound to happen",
    "It is destined for the disbelievers with no preventer against it",
    "Issued from Allah, owner of the ways of ascent",
    "Angels and the Spirit ascending to Him during a Day measuring fifty thousand years",
    "Gracious patience commanded for the Prophet",
    "They perceive the punishment as distant",
    "But Allah perceives it as near",
    "On that Day the sky becomes like murky oil",
    "And the mountains become like carded wool",
    "No friend will enquire of another friend",
    "Though shown each other, the criminal wishes to ransom himself from that Day's punishment with his children",
    "And with his wife and his brother",
    "And his nearest kindred who shelter him",
    "And whoever is on earth entirely, if that could save him",
    "The refusal: it is the Flame of Hell",
    "A remover of exteriors",
    "It summons whoever turned his back on truth and withdrew from obedience",
    "And who collected wealth and hoarded it"
  ],
  "ext-070-p2": [
    "Mankind declared created anxious by nature",
    "Impatient when evil touches him",
    "Withholding when good touches him",
    "The exception named: the observers of prayer",
    "Those constant in their prayer",
    "Those within whose wealth is a known right",
    "Assigned to the petitioner and the deprived",
    "Those who believe in the Day of Recompense",
    "Those fearful of their Lord's punishment",
    "Since their Lord's punishment offers no security",
    "Those who guard their private parts",
    "Except with their wives or rightful possessions, for which they are not blamed",
    "Whoever seeks beyond that being counted among the transgressors",
    "Those attentive to their trusts and promises",
    "Those upright in their testimonies",
    "Those who carefully maintain their prayer",
    "These will be in gardens, honoured"
  ],
  "ext-070-p3": [
    "The disbelievers questioned for hastening away from the Prophet",
    "Sitting on his right and left in separate groups",
    "Each person among them aspiring to enter a garden of pleasure",
    "The refusal grounded in their creation from what they know",
    "Oath by the Lord of all risings and settings affirming His ability",
    "To replace them with better people, with none able to outdo Him"
  ],
  "ext-070-p4": [
    "Leave them to converse vainly and amuse themselves until they meet their promised Day",
    "That Day they emerge from graves rapidly as though hastening toward an erected idol",
    "Their eyes humbled and humiliation covering them — the Day they had been promised"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`70:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`70:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 70, surahName: "Al-Ma'arij",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 10 genuine re-extraction. Boundaries follow the text: P1 closes with the hoarding-and-turning-away indictment (18) before the human-nature diagnosis opens (19); P2 ends with the honoured-in-gardens verdict (35) before the disbeliever-hastening question begins (36); P3 runs through the garden-aspiration refusal and the replacement oath (36-41); P4 covers the leave-them instruction, the grave-emergence scene and the closing humiliation statement (42-44).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (70:1-18) ===
{
  const e = extractions[0];
  const maarij = findWord(3, ["\u0645","\u0639","\u0627","\u0631","\u062c"]);
  if (maarij) e.divineNamesAndAttributes.push({ term: maarij, transliteration: "dhu al-ma'arij", gloss: "owner of the ways of ascent (editorial gloss)", keys: ["70:3"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["70:5"], excerpt: fv(5), description: "So be patient with gracious patience." });

  e.humanConditionsAndSpiritualStates.push({ label: "A supplicant demanding the punishment that no one can prevent", keys: ["70:1","70:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Perceiving the reckoning as distant while Allah sees it near", keys: ["70:6","70:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "The criminal wishing to ransom himself with children, spouse, brother, kindred and all humanity", keys: ["70:11","70:12","70:13","70:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Turning away from truth and hoarding wealth named as what the Flame summons", keys: ["70:17","70:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Accumulation and hoarding of wealth identified as grounds for the Flame's summons", keys: ["70:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Angels and the Spirit ascending during a Day measuring fifty thousand years", keys: ["70:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Sky like murky oil and mountains like wool on that Day", keys: ["70:8","70:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No friend enquiring of another though they are shown each other", keys: ["70:10","70:11"], evidenceClass: "EXPLICIT_TEXT" });

  const ruh = findWord(4, ["\u0631","\u0648","\u062d"]);
  if (ruh) e.terminology.push({ term: ruh, transliteration: "al-ruh", gloss: "the Spirit (editorial gloss)", keys: ["70:4"] });
  const laza = findWord(15, ["\u0644","\u0638","\u0649"]);
  if (laza) e.terminology.push({ term: laza, transliteration: "laza", gloss: "the Flame (editorial gloss)", keys: ["70:15"] });
}

// === POPULATE P2 (70:19-35) ===
{
  const e = extractions[1];

  e.humanConditionsAndSpiritualStates.push({ label: "Human nature diagnosed as anxious: impatient under evil and withholding under good", keys: ["70:19","70:20","70:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Constancy in prayer marking the exception to anxious human nature", keys: ["70:22","70:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Fear of the Lord's punishment grounded in its offering no security", keys: ["70:27","70:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Chastity guarded within lawful bounds, with transgression named for seeking beyond", keys: ["70:29","70:30","70:31"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["70:31"], excerpt: fv(31), description: "But whoever seeks beyond that, then they are the transgressors." });

  e.socialEconomicCivilisational.push({ label: "A known right within wealth assigned to the petitioner and the deprived", keys: ["70:24","70:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Attentiveness to trusts and promises paired with upright testimony", keys: ["70:32","70:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Belief in the Day of Recompense listed among the qualities of the exempted", keys: ["70:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Careful maintenance of prayer closing the virtue list before the honour verdict", keys: ["70:34","70:35"], evidenceClass: "EXPLICIT_TEXT" });

  const haqq = findWord(24, ["\u062d","\u0642"]);
  if (haqq) e.terminology.push({ term: haqq, transliteration: "haqq ma'lum", gloss: "a known right (editorial gloss)", keys: ["70:24"] });
  const sail = findWord(25, ["\u0633","\u0627","\u0626","\u0644"]);
  if (sail) e.terminology.push({ term: sail, transliteration: "sa'il", gloss: "petitioner (editorial gloss)", keys: ["70:25"] });
}

// === POPULATE P3 (70:36-41) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Hastening away from the Prophet into separate groups while aspiring to a garden of pleasure", keys: ["70:36","70:37","70:38"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Group formation on the right and left as a posture of avoidance", keys: ["70:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creation from what they know cited against unearned garden aspiration", keys: ["70:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Oath by the Lord of risings and settings affirming power to replace them with better people", keys: ["70:40","70:41"], evidenceClass: "EXPLICIT_TEXT" });

  const mashariq = findWord(40, ["\u0645","\u0634","\u0627","\u0631","\u0642"]);
  if (mashariq) e.terminology.push({ term: mashariq, transliteration: "rabb al-mashariq wa'l-magharib", gloss: "Lord of risings and settings (editorial gloss)", keys: ["70:40"] });
}

// === POPULATE P4 (70:42-44) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["70:42"], excerpt: fv(42), description: "So leave them to converse vainly and amuse themselves until they meet their Day which they are promised." });

  e.humanConditionsAndSpiritualStates.push({ label: "Vain conversation and amusement permitted until the promised Day arrives", keys: ["70:42"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Eyes humbled and humiliation covering them at the grave-emergence", keys: ["70:44"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Rapid emergence from graves likened to hastening toward an erected idol", keys: ["70:43"], evidenceClass: "EXPLICIT_TEXT" });

  const nusub = findWord(43, ["\u0646","\u0635","\u0628"]);
  if (nusub) e.terminology.push({ term: nusub, transliteration: "nusub", gloss: "an erected idol or marker (editorial gloss)", keys: ["70:43"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `070-al-maarij-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 070-al-maarij-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-070-p1,ext-070-p2,ext-070-p3,ext-070-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1819", label: "Angelic ascent during a Day measuring fifty thousand years", def: "In 70:3-4: It is from Allah, owner of the ways of ascent; the angels and the Spirit will ascend to Him during a Day the extent of which is fifty thousand years.", key: "70:3", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Ta'ruj al-mala'ikah wa'l-ruh."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Khamseen alf sanah measure."}] },
  { id: "cand-1820", label: "Gracious patience commanded against perceiving the reckoning as distant", def: "In 70:5-7: So be patient with gracious patience; indeed they see it as distant but We see it as near.", key: "70:5", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr jamil commanded."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ba'id versus qarib perception."}] },
  { id: "cand-1821", label: "Criminal wishing to ransom himself with kin and all humanity", def: "In 70:10-14: And no friend will ask anything of a friend; they will be shown each other; the criminal will wish that he could be ransomed from the punishment of that Day by his children and his wife and his brother and his nearest kindred who shelter him and whoever is on earth entirely so then it could save him.", key: "70:10", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Fidyah impossible."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Kinship cannot ransom."}] },
  { id: "cand-1822", label: "The Flame stripping exteriors and summoning the hoarding turncoat", def: "In 70:15-18: No indeed it is the Flame of Hell, a remover of exteriors; it invites he who turned his back on truth and went away from obedience and collected wealth and hoarded.", key: "70:15", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Laza nazzā'ah li'l-shawa."},{topicId:"giving",layer:"curated",relationship:"related-not-identical",note:"Jam' and wa'a condemned."}] },

  { id: "cand-1823", label: "Anxious human nature exempted by constancy in prayer", def: "In 70:19-23: Indeed mankind was created anxious; when evil touches him impatient and when good touches him withholding; except the observers of prayer, those who are constant in their prayer.", key: "70:19", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Salat as character remedy."},{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Khuliqa al-insan halu'a."}] },
  { id: "cand-1824", label: "A known right within wealth for the petitioner and the deprived", def: "In 70:24-25: And those within whose wealth is a known right for the petitioner and the deprived.", key: "70:24", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Haqq ma'lum as entitlement not favour."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Named claimants defined."}] },
  { id: "cand-1825", label: "Chastity within lawful bounds with transgression named beyond it", def: "In 70:29-31: And those who guard their private parts except from their wives or those their right hands possess, for indeed they are not to be blamed; but whoever seeks beyond that then they are the transgressors.", key: "70:29", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Hifz al-furuj discipline."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Lawful marital bounds."}] },
  { id: "cand-1826", label: "Trusts, promises and upright testimony completing the virtue profile", def: "In 70:32-35: And those who are to their trusts and promises attentive and those who are in their testimonies upright and those who carefully maintain their prayer; they will be in gardens, honored.", key: "70:32", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Amanah and 'ahd kept."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Qa'imun bi-shahadatihim."}] },

  { id: "cand-1827", label: "Garden aspiration refused with replacement oath by the Lord of risings", def: "In 70:38-41: Does every person among them aspire to enter a garden of pleasure? No indeed We have created them from that which they know; so I swear by the Lord of all risings and settings that indeed We are able to replace them with better than them and We are not to be outdone.", key: "70:38", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Tabdil bi-khayr minhum."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Aspiration without qualification."}] },

  { id: "cand-1828", label: "Grave-emergence likened to hastening toward an erected idol", def: "In 70:43-44: The Day they will emerge from the graves rapidly as if they were toward an erected idol hastening; their eyes humbled, humiliation will cover them; that is the Day which they had been promised.", key: "70:43", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Khuru' min al-ajdath sira'an."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Khashi'ah absaruhum tarhaquhum dhillah."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 8).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(8, 9).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(9, 10).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `070-al-maarij-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-094.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-094.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");