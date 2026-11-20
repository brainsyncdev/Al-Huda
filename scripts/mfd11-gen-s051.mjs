// MFD-11 Wave 8: Surah 51 (Adh-Dhariyat) genuine re-extraction.
// Covers 51:1-60 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "051-0001-0060.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 51:${n} not found`);
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

console.log("Generating Surah 51 (Adh-Dhariyat) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T16:40:00.000Z";

const PASSAGES = [
  { id: "ext-051-p1", from: 1, to: 23,
    label: "Winds scattering dispersing; clouds carrying load water; ships sailing ease; angels apportioning matter; indeed promised true recompense occur; heaven containing pathways; indeed differing speech; deluded away Quran deluded; destroyed falsifiers; within flood confusion heedless; ask when Day Recompense; Day tormented Fire; taste torment impatient; righteous among gardens springs; accepting Lord given doers good; sleep little night; hours before dawn ask forgiveness; properties right petitioner deprived; earth signs certain; yourselves will you not see; heaven provision whatever promised; by Lord heaven earth indeed truth just as sure speaking",
    mainLabel: "Four oaths by winds scattering, rain-bearing clouds, smooth-sailing ships and apportioning angels grounding the certainty of the promised recompense; the pathway-containing heaven sworn against their differing speech; the deluded turned away from the Quran while falsifiers are destroyed in confused heedlessness; the Day of Recompense named as their torment-in-Fire day where they taste what they were impatient for; the righteous placed among gardens and springs having accepted their Lord's gift as prior doers of good who slept little at night, sought forgiveness before dawn and gave the needy their due from their wealth; signs on earth and in themselves offered to the certain, with provision and promise located in heaven; oath by the Lord of heaven and earth affirming it as truth equal to the certainty of their own speech" },
  { id: "ext-051-p2", from: 24, to: 46,
    label: "Reached story honored guests Abraham; entered said peace answered peace people unknown; went family came fat roasted calf; placed near them said will you not eat; felt apprehension said fear not gave good tidings learned boy; wife approached cry struck face said barren old woman; said thus said your Lord indeed Wise Knowing; Abraham said what business messengers; said sent people criminals; send down stones clay; marked presence Lord transgressors; brought out whoever cities believers; found not within other than single house Muslims; left therein sign fear painful punishment; Moses sent Pharaoh clear authority; turned away supporters said magician madman; took soldiers cast sea blameworthy; Aad sent barren wind; left nothing came upon made disintegrated ruins; Thamud said enjoy yourselves time; insolent command Lord thunderbolt seized looking on; unable arise nor defend; people Noah before defiantly disobedient",
    mainLabel: "The honoured guests of Abraham entering with peace, greeted in kind as unknown people; his hastening to bring a fat roasted calf placed near them with an invitation to eat; his apprehension met with their reassurance and glad tidings of a learned son; his wife's alarmed cry, face-striking and barren-old-woman declaration answered by their citation of the Wise Knowing Lord's word; Abraham asking their mission, revealed as being sent to criminal people to rain marked clay stones upon transgressors; all believers extracted from those cities leaving only one Muslim household as a sign for those fearing painful punishment; Moses sent to Pharaoh with clear authority but dismissed as magician or madman, then taken with his soldiers and cast into the sea as blameworthy; Aad struck by a barren wind reducing everything to disintegrated ruins; Thamud told to enjoy themselves for a time but growing insolent toward their Lord's command, seized by a thunderbolt while watching, unable to rise or defend; Noah's people destroyed before them as defiantly disobedient" },
  { id: "ext-051-p3", from: 47, to: 55,
    label: "Heaven constructed strength indeed expander; earth spread out excellent preparer; all things created two mates perhaps remember; flee Allah indeed I from Him clear warner; do not make equal Allah another deity indeed I from Him clear warner; similarly came not those before messenger except said magician madman; suggest them rather transgressing people; leave them Muhammad not blamed; remind indeed reminder benefits believers",
    mainLabel: "Heaven constructed with strength and expanded, earth spread out by an excellent preparer; all things created in pairs inviting remembrance; flight to Allah urged since the Prophet is a clear warner from Him; prohibition of making any deity equal to Allah reiterated with the same warner-commission; every prior messenger likewise dismissed as magician or madman, not through mutual suggestion but because they are themselves a transgressing people; the Prophet told to leave them since he is not blameworthy, and to remind since reminder benefits believers" },
  { id: "ext-051-p4", from: 56, to: 60,
    label: "Did not create jinn mankind except worship Me; do not want provision nor want feed Me; indeed Allah continual Provider firm possessor strength; indeed wronged portion punishment like portion predecessors let not impatiently urge Me; woe disbelieved Day promised",
    mainLabel: "Jinn and mankind created solely to worship Allah, who needs no provision from them nor feeding; He alone is the continual Provider and firm possessor of strength; wrongdoers assured a portion of punishment like their predecessors', told not to impatiently urge its arrival; woe pronounced on disbelievers from the Day they are promised" }
];

const SUB_LABELS = {
  "ext-051-p1": [
    "Oath by winds scattering dust",
    "Oath by rain-bearing clouds carrying a load",
    "Oath by ships sailing with ease",
    "Oath by angels apportioning each matter",
    "What is promised declared true",
    "The recompense certain to occur",
    "Oath by the heaven containing pathways",
    "Their speech identified as differing and contradictory",
    "The deluded turned away from the Quran",
    "Falsifiers declared destroyed",
    "They described as submerged in confusion and heedlessness",
    "Their question about when the Day of Recompense arrives",
    "That Day identified as their torment-over-the-Fire day",
    "Told to taste their torment as what they were impatient for",
    "The righteous placed among gardens and springs",
    "Accepting what their Lord gave them as prior doers of good",
    "Sleeping but little of the night",
    "Seeking forgiveness in the hours before dawn",
    "Giving the right of the petitioner and deprived from their properties",
    "Signs on earth for those certain in faith",
    "Signs in themselves posed as a challenge to see",
    "Provision and promise located in heaven",
    "Oath by the Lord of heaven and earth affirming it as truth equal to the certainty of speech"
  ],
  "ext-051-p2": [
    "The story of Abraham's honoured guests introduced",
    "Their entry with peace greeted in kind",
    "Abraham recognising them as unknown people",
    "Abraham hastening to his family and returning with a fat roasted calf",
    "Placing it near them and inviting them to eat",
    "His apprehension met with reassurance and glad tidings of a learned son",
    "His wife approaching with a cry, striking her face and declaring herself a barren old woman",
    "Their reply citing the Wise Knowing Lord's decree",
    "Abraham asking their mission",
    "Revealed as sent to a people of criminals",
    "To send down upon them stones of clay",
    "Marked in the presence of their Lord for the transgressors",
    "All believers extracted from those cities",
    "Only one Muslim household found within them",
    "A sign left therein for those fearing painful punishment",
    "Moses sent to Pharaoh with clear authority",
    "Pharaoh turning away with supporters calling him magician or madman",
    "Taken with his soldiers and cast into the sea as blameworthy",
    "Aad struck by a barren wind leaving nothing but disintegrated ruins",
    "Thamud told to enjoy themselves for a time",
    "Insolent toward their Lord's command, seized by thunderbolt while watching",
    "Unable to arise or defend themselves",
    "Noah's people destroyed before as defiantly disobedient"
  ],
  "ext-051-p3": [
    "Heaven constructed with strength and expanded by Us",
    "Earth spread out by an excellent preparer",
    "All things created in pairs inviting remembrance",
    "Flight to Allah urged since the Prophet is a clear warner from Him",
    "Prohibition of making any deity equal to Allah reiterated with the same warner-commission",
    "Every prior messenger likewise dismissed as magician or madman",
    "Not through mutual suggestion but because they are themselves transgressors",
    "The Prophet told to leave them since he is not blameworthy",
    "Reminder commanded since it benefits believers"
  ],
  "ext-051-p4": [
    "Jinn and mankind created solely to worship Allah",
    "He needs no provision from them nor does He want them to feed Him",
    "Allah alone is the continual Provider and firm possessor of strength",
    "Wrongdoers assured a portion like their predecessors' and told not to impatiently urge its arrival",
    "Woe pronounced on disbelievers from the Day they are promised"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`51:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`51:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 51, surahName: "Adh-Dhariyat",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 8 genuine re-extraction. Boundaries follow the text: P1 closes with the Lord-of-heaven-and-earth oath (23) before the Abraham-guests narrative opens (24); P2 ends with Noah's people as defiantly disobedient (46) before the cosmic-signs block begins (47); P3 runs from heaven-construction through the reminder-benefits-believers close (47-55); P4 covers the worship-purpose declaration through the closing woe (56-60).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (51:1-23) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Differing speech producing delusion away from the Quran", keys: ["51:8","51:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Falsifiers destroyed in a flood of confusion and heedlessness", keys: ["51:10","51:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Righteous accepting their Lord's gift as prior doers of good who slept little and sought forgiveness before dawn", keys: ["51:15","51:16","51:17","51:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Right of the petitioner and deprived given from properties as mark of the righteous", keys: ["51:19"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Four oaths grounding the certainty of the promised recompense", keys: ["51:1","51:2","51:3","51:4","51:5","51:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Signs on earth and in themselves for the certain, with provision and promise in heaven", keys: ["51:20","51:21","51:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Oath by the Lord of heaven and earth affirming truth equal to the certainty of speech", keys: ["51:23"], evidenceClass: "EXPLICIT_TEXT" });

  const dhariyat = findWord(1, ["\u0630","\u0631","\u064a","\u0627","\u062a"]);
  if (dhariyat) e.terminology.push({ term: dhariyat, transliteration: "dhariyat", gloss: "scatterers/winds (editorial gloss)", keys: ["51:1"] });
}

// === POPULATE P2 (51:24-46) ===
{
  const e = extractions[1];
  const hakeem = findWord(30, ["\u062d","\u0643","\u064a","\u0645"]);
  const aleem = findWord(30, ["\u0639","\u0644","\u064a","\u0645"]);
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["51:30"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["51:30"] });

  e.propheticNarratives.push({ label: "Abraham's honoured guests entering with peace; fat roasted calf; apprehension and reassurance; glad tidings of learned son; wife's barren-old-woman cry; Wise Knowing Lord's decree; mission to criminal people; marked clay stones; believers extracted; one Muslim household; sign left", keys: ["51:24","51:25","51:26","51:27","51:28","51:29","51:30","51:31","51:32","51:33","51:34","51:35","51:36","51:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Moses sent to Pharaoh with clear authority; dismissed as magician or madman; taken with soldiers cast into sea", keys: ["51:38","51:39","51:40"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Aad struck by barren wind leaving disintegrated ruins; Thamud told to enjoy then insolent, seized by thunderbolt; Noah's people destroyed as defiantly disobedient", keys: ["51:41","51:42","51:43","51:44","51:45","51:46"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Abraham's apprehension at his guests' refusal to eat", keys: ["51:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wife's alarm at the announcement of a son despite barrenness and old age", keys: ["51:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Hospitality protocol: hastening to prepare food and placing it near guests with invitation", keys: ["51:26","51:27"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P3 (51:47-55) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["51:50"], excerpt: fv(50), description: "So flee to Allah; indeed I am to you from Him a clear warner." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["51:51"], excerpt: fv(51), description: "Do not make with Allah another deity; indeed I am to you from Him a clear warner." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["51:55"], excerpt: fv(55), description: "And remind, for indeed the reminder benefits the believers." });

  e.humanConditionsAndSpiritualStates.push({ label: "Prior messengers universally dismissed as magician or madman by transgressing peoples", keys: ["51:52","51:53"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Heaven constructed with strength and expanded, earth spread by an excellent preparer", keys: ["51:47","51:48"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "All things created in pairs as an invitation to remembrance", keys: ["51:49"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Prophet not blameworthy over their rejection, his role limited to beneficial reminder", keys: ["51:54","51:55"], evidenceClass: "EXPLICIT_TEXT" });

  const musawwi = findWord(48, ["\u0645","\u0647","\u062f"]);
  // mahid root check
  const mahid = findWord(48, ["\u0645","\u0647","\u062f"]); 
  if (mahid) e.terminology.push({ term: mahid, transliteration: "mahid", gloss: "preparer/spreader (editorial gloss)", keys: ["51:48"] });
}

// === POPULATE P4 (51:56-60) ===
{
  const e = extractions[3];
  const razzaq = findWord(58, ["\u0631","\u0632","\u0627","\u0642"]);
  const quwwah = findWord(58, ["\u0642","\u0648","\u0649"]);
  if (razzaq) e.divineNamesAndAttributes.push({ term: razzaq, transliteration: "Razzaq", gloss: "Continual Provider (editorial gloss)", keys: ["51:58"] });
  if (quwwah) e.divineNamesAndAttributes.push({ term: quwwah, transliteration: "dhu al-quwwah", gloss: "firm possessor of strength (editorial gloss)", keys: ["51:58"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Woe pronounced on disbelievers from the Day they are promised", keys: ["51:60"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Jinn and mankind created solely for worship, with Allah needing no provision or feeding from them", keys: ["51:56","51:57"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Wrongdoers assured a portion like their predecessors' and told not to impatiently urge it", keys: ["51:59"], evidenceClass: "EXPLICIT_TEXT" });

  const ibadah = findWord(56, ["\u0639","\u0628","\u062f"]);
  if (ibadah) e.terminology.push({ term: ibadah, transliteration: "li-ya'budun", gloss: "to worship Me (editorial gloss)", keys: ["51:56"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `051-adh-dhariyat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 051-adh-dhariyat-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-051-p1,ext-051-p2,ext-051-p3,ext-051-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1620", label: "Four oaths grounding the certainty of promised recompense", def: "In 51:1-6: By those winds scattering and those clouds carrying a load and those ships sailing with ease and those angels apportioning each matter; indeed what you are promised is true and indeed the recompense is to occur.", key: "51:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Qasam series affirming wa'd."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Muqassimat amr allocation."}] },
  { id: "cand-1621", label: "Righteous profile: little sleep, pre-dawn istighfar, giving the needy their due", def: "In 51:17-19: They used to sleep but little of the night and in the hours before dawn they would ask forgiveness and from their properties was given the right of the petitioner and the deprived.", key: "51:17", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Night vigil and sahar istighfar."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Haqq al-sa'il wa'l-mahrum."}] },
  { id: "cand-1622", label: "Signs on earth and in selves for the certain with provision in heaven", def: "In 51:20-22: And on the earth are signs for the certain in faith and in yourselves then will you not see; and in the heaven is your provision and whatever you are promised.", key: "51:20", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Dual ayat domain."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Afa-la tubsirun challenge."}] },
  { id: "cand-1623", label: "Lord-of-heaven-and-earth oath affirming truth equal to speech-certainty", def: "In 51:23: Then by the Lord of the heaven and earth indeed it is truth just as sure as it is that you are speaking.", key: "51:23", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Rabb al-sama' wa'l-ard oath."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Haqq equated to natiqun certainty."}] },

  { id: "cand-1624", label: "Abraham's hospitality and the guests' glad tidings of a learned son", def: "In 51:24-30: Has there reached you the story of the honoured guests of Abraham when they entered and said peace; he went to his family and came with a fat roasted calf placed near them; he felt apprehension, they said fear not and gave glad tidings of a learned boy; his wife approached with a cry striking her face saying barren old woman; they said thus has said your Lord indeed He is the Wise the Knowing.", key: "51:24", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Dayf Ibrahim narrative."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Hospitality as prophetic model."}] },
  { id: "cand-1625", label: "Marked clay stones rained upon transgressors after believers extracted", def: "In 51:33-37: To send down upon them stones of clay marked in the presence of your Lord for the transgressors; so We brought out whoever was in the cities of the believers and found not within them other than a single house of Muslims and We left therein a sign for those who fear the painful punishment.", key: "51:33", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Hijarah min tin musawwamah."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Believer extraction before punishment."}] },
  { id: "cand-1626", label: "Five destroyed communities catalogued as warning signs", def: "In 51:38-46: Moses sent to Pharaoh with clear authority but dismissed as magician or madman, taken with soldiers cast into sea; Aad struck by barren wind leaving disintegrated ruins; Thamud told to enjoy then insolent, seized by thunderbolt; Noah's people destroyed as defiantly disobedient.", key: "51:38", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Comprehensive destruction catalogue."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Each as ayah for later peoples."}] },

  { id: "cand-1627", label: "Heaven constructed with strength and expanded, earth spread by excellent preparer", def: "In 51:47-48: And the heaven We constructed with strength and indeed We are its expander; and the earth We have spread out and excellent is the preparer.", key: "51:47", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Bana'a and musi'un."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Cosmic architecture as ayah."}] },
  { id: "cand-1628", label: "All things created in pairs inviting remembrance", def: "In 51:49: And of all things We created two mates; perhaps you will remember.", key: "51:49", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Zawjayn universal pairing."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"La'allakum tadhakkarun."}] },
  { id: "cand-1629", label: "Flight to Allah urged with clear-warner commission", def: "In 51:50-51: So flee to Allah; indeed I am to you from Him a clear warner; and do not make with Allah another deity; indeed I am to you from Him a clear warner.", key: "51:50", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Firru ila Allah urgency."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Nadhir mubin repeated."}] },

  { id: "cand-1630", label: "Jinn and mankind created solely for worship with Allah needing nothing", def: "In 51:56-58: And I did not create the jinn and mankind except to worship Me; I do not want from them any provision nor do I want them to feed Me; indeed Allah is the continual Provider the firm possessor of strength.", key: "51:56", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Illa li-ya'budun purpose."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Razzaq dhu al-quwwah."}] },
  { id: "cand-1631", label: "Woe to disbelievers from their promised Day", def: "In 51:60: And woe to those who have disbelieved from their Day which they are promised.", key: "51:60", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Wayl closure."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Yawm promised as threat."}] }
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
    notes: "Wave 8 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 7).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(7, 9).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(9, 12).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `051-adh-dhariyat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-075.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-075.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");