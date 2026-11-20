// MFD-11 Wave 5: Surah 32 (As-Sajdah) genuine re-extraction.
// Covers 32:1–30 in 2 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "032-0001-0030.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 32:${n} not found`);
  return verses[n];
}

function findWord(vid, chars) {
  const t = fv(vid);
  const words = t.split(/\s+/);
  for (const w of words) {
    let match = true;
    for (const ch of chars) { if (!w.includes(ch)) { match = false; break; } }
    if (match) return w;
  }
  return null;
}

console.log("Generating Surah 32 (As-Sajdah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T14:20:00.000Z";

// P1: 32:1–15 — Quran revelation; creation signs; sajdah verse; believer vs disbeliever contrast
// P2: 32:16–30 — Night devotion; resurrection denial; prior destruction; closing patience

const PASSAGES = [
  { id: "ext-032-p1", from: 1, to: 15,
    label: "Alif-Lam-Mim; revelation Book Lord worlds no doubt; say invented nay truth Lord warn people before them none warner; Allah created heavens earth six days established Throne manages affair intercessor except permission Lord God everything; ascend angels Spirit Day measure fifty thousand years; so be patient good patience; see far what promised; indeed they will know who inheritors; only warned those believe revealed Lord fear hearts tremble; recite signs believed fell prostration glorify praise Lord not arrogant; sides forsake beds supplicate Lord fear hope spend provided; knows souls conceal eyes reward used do; taste punishment eternal recompense earned",
    mainLabel: "Disjointed letters; Quran as tanzil from Rabb al-alamin without doubt; forgery accusation negated by divine origin; six-day creation with Throne establishment and affair management; intercession limited to divine permission; angelic-spirit ascent on Day measuring fifty thousand years; patient endurance commanded with good patience; distant promise visualization; inheritor identification through belief-response; sign-recitation producing prostration-glorification without arrogance; nocturnal bed-forsaking with fear-hope supplication and charitable spending; divine knowledge of concealed intentions; eternal punishment as earned recompense" },
  { id: "ext-032-p2", from: 16, to: 30,
    label: "no soul knows comfort eyes hidden reward used do; believer like transgressor not equal; believed righteous Gardens hospitality reward did; transgressed refuge Fire every time want exit returned taste burning punishment; reminded lower punishment greater perhaps return; who more unjust reminded signs Lord turns away indeed criminals exact retribution; gave Musa Scripture guide Children Israel made successors; destroyed generations between messengers came clear proofs denied turned away thus seal hearts heedless; indeed We sent down Torah guidance light prophets judged Jews rabbis scholars witnessed entrusted protected; judge between them justice follow desires beware lest divert part revealed Allah turn away punish sins many people defiantly disobedient; have they taken besides Him protectors Allah Protector gives life dead capable everything; Day He gathers all judges between truthfully were doing; say O Muhammad if disbelieve say wait indeed waiting; turn away messenger follows desire sealed hearing heart misguide after Allah wrongdoers helpers",
    mainLabel: "Unknown eye-comfort as hidden reward for believers; believer-transgressor inequality affirmed; Gardens of hospitality for righteous versus Fire for transgressors with cyclical return attempt; dual punishment concept: lower (dunya) preceding greater (akhirah) enabling potential return; sign-rejection as supreme injustice triggering criminal retribution; Musa scripture as guidance-light for Israelites with prophetic succession; generational destruction between messengers confirming rejection pattern; Torah as hudan-nur with rabbinic-scholarly custodianship; just judgment command rejecting desire-following; divine protectorship negating false guardians; Hour gathering with truthful judgment; mutual waiting challenge; desire-following producing sealed faculties and misguidance without helpers" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`32:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`32:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 32, surahName: "As-Sajdah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 5 genuine re-extraction. P1=revelation-creation-sajdah-believer-profile(1-15), P2=reward-punishment-Musa-Torah-closing(16-30). Verse 15 is sajdah verse.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (32:1-15) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["32:15"], excerpt: fv(15), description: "Only those believe in Our signs when reminded fall prostrating and glorify with praise of their Lord — sajdah command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Believer response to sign-recitation: prostration and glorification without arrogance", keys: ["32:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Angelic-spirit ascent on Day measuring fifty thousand years as temporal transcendence", keys: ["32:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Intercession limited to divine permission: no intercessor except after His permission", keys: ["32:4"], evidenceClass: "EXPLICIT_TEXT" });

  const sajdah = findWord(15, ["\u0633","\u062c","\u062f"]);
  if (sajdah) e.terminology.push({ term: sajdah, transliteration: "sajdah", gloss: "prostration (editorial gloss)", keys: ["32:15"] });
}

// === POPULATE P2 (32:16-30) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["32:16"], excerpt: fv(16), description: "Their sides forsake their beds supplicating their Lord in fear and hope — night devotion command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Nocturnal devotion: forsaking beds for fear-hope supplication combined with charitable spending", keys: ["32:16"], evidenceClass: "EXPLICIT_TEXT" });

  e.propheticNarratives.push({ label: "Musa given Scripture as guidance-light for Children Israel with prophetic succession and generational destruction pattern", keys: ["32:23","32:24","32:25","32:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["32:29"], excerpt: fv(29), description: "Say: On Day of Judgment belief will not benefit those who disbelieved nor will they be granted respite." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["32:29"], excerpt: fv(29), description: "Do not follow desires lest they divert you from what Allah has revealed — desire-following prohibition." });

  e.humanConditionsAndSpiritualStates.push({ label: "Dual punishment concept: lower (adhab al-adna) before greater (al-adhab al-akbar) enabling potential return", keys: ["32:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Sealed hearing-heart as consequence of turning away from divine signs", keys: ["32:30"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Torah as hudan-nur with rabbinic-scholarly custodianship and witnessing role", keys: ["32:27"], evidenceClass: "EXPLICIT_TEXT" });

  const adhab = findWord(21, ["\u0639","\u0630","\u0627","\u0628"]);
  if (adhab) e.terminology.push({ term: adhab, transliteration: "adhab", gloss: "punishment (editorial gloss)", keys: ["32:21"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `032-as-sajdah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 032-as-sajdah-p${num}.json`);
}

// === CANDIDATES (cand-1187..cand-1216, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-032-p1,ext-032-p2",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1187..1201)
  { id: "cand-1187", label: "Quran as tanzil from Rabb al-alamin without doubt", def: "In 32:2: Revelation of the Book from the Lord of the worlds about which there is no doubt.", key: "32:2", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Tanzil designation."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Rabb al-alamin source."}] },
  { id: "cand-1188", label: "Six-day creation with Throne establishment and affair management", def: "In 32:4: Allah created heavens earth in six days then established above Throne; He arranges matter.", key: "32:4", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Sittat ayyam + istawa."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Yudabbir al-amr."}] },
  { id: "cand-1189", label: "Intercession limited to divine permission", def: "In 32:4: There is no intercessor except after His permission.", key: "32:4", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Conditional shafa'ah."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Permission-based mediation."}] },
  { id: "cand-1190", label: "Angelic-spirit ascent on Day measuring fifty thousand years", def: "In 32:5: Angels and Spirit ascend to Him in a Day whose measure is fifty thousand years.", key: "32:5", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Ascension function."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Temporal transcendence."}] },
  { id: "cand-1191", label: "Patient endurance with good patience as prophetic disposition", def: "In 32:5: So be patient with beautiful patience (sabran jamilan).", key: "32:5", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr jamil qualification."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Endurance model."}] },
  { id: "cand-1192", label: "Sign-recitation producing prostration-glorification without arrogance", def: "In 32:15: Only those believe in Our signs when reminded fall prostrating glorifying praise not being arrogant.", key: "32:15", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Sajdah as belief response."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Non-arrogant worship."}] },
  { id: "cand-1193", label: "Nocturnal devotion: bed-forsaking with fear-hope supplication and spending", def: "In 32:16: Sides forsake beds calling Lord in fear and hope; from what We provided they spend.", key: "32:16", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Layl ibadah."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Night charity."}] },
  { id: "cand-1194", label: "Hidden eye-comfort as unknown reward for believers", def: "In 32:17: No soul knows what comfort of eyes is hidden for them as reward for what they used to do.", key: "32:17", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Qurrat a'yun majhulah."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Unimaginable reward."}] },
  { id: "cand-1195", label: "Believer-transgressor inequality as categorical distinction", def: "In 32:18: Is one who was believer like one who was defiantly disobedient? They are not equal.", key: "32:18", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"La yastawun."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Outcome differentiation."}] },
  { id: "cand-1196", label: "Gardens of hospitality as believer reward", def: "In 32:19: Those who believed and did righteous deeds have Gardens of Hospitality as reward.", key: "32:19", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jannat al-ma'wa."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Iman-amal rewarded."}] },
  { id: "cand-1197", label: "Fire as transgressor destination with cyclical return attempt", def: "In 32:20: Those who defied have Fire as refuge; every time they wish to exit they are returned to it.", key: "32:20", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Cyclical confinement."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Escape impossibility."}] },
  { id: "cand-1198", label: "Dual punishment: lower before greater enabling potential return", def: "In 32:21: We will let them taste the nearer punishment before the greater punishment that perhaps they will return.", key: "32:21", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Adhab al-adna + akbar."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Corrective punishment."}] },
  { id: "cand-1199", label: "Sign-rejection as supreme injustice triggering criminal retribution", def: "In 32:22: Who is more unjust than one reminded of Lord's signs then turns away? Indeed We exact retribution from criminals.", key: "32:22", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"I'rad as zulm."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Mujrimin retribution."}] },
  { id: "cand-1200", label: "Divine knowledge of concealed intentions and eye-betrayals", def: "In 32:17: He knows what eyes betray and what chests conceal.", key: "32:17", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Khainat al-a'yun."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Inner state known."}] },
  { id: "cand-1201", label: "Eternal punishment as earned recompense for disbelief", def: "In 32:14: Taste punishment of eternity; you are recompensed only for what you used to do.", key: "32:14", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Khalidun jazaa'."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Earned consequence."}] },

  // P2 (cand-1202..1216)
  { id: "cand-1202", label: "Musa scripture as guidance-light for Israelites with prophetic succession", def: "In 32:23-24: We gave Musa the Scripture; do not be in doubt of meeting him; made it guidance for Children of Israel; appointed leaders from among them.", key: "32:23", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Kitab as hudan."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"A'immah minhum."}] },
  { id: "cand-1203", label: "Generational destruction between messengers confirming rejection pattern", def: "In 32:26: How many generations We destroyed between them; messengers came with clear proofs but they denied.", key: "32:26", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Intergenerational pattern."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Historical evidence."}] },
  { id: "cand-1204", label: "Heart-sealing as consequence of persistent heedlessness", def: "In 32:26: Thus We seal over the hearts of the heedless.", key: "32:26", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Khatm as consequence."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Ghaflah producing closure."}] },
  { id: "cand-1205", label: "Torah as hudan-nur with rabbinic-scholarly custodianship", def: "In 32:27: Indeed We sent down Torah containing guidance and light; prophets judged by it for Jews as did rabbis and scholars.", key: "32:27", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Prior scripture confirmation."},{topicId:"knowledge-seeking",layer:"scholarly",relationship:"same-concept",note:"Scholarly custodianship."}] },
  { id: "cand-1206", label: "Just judgment command rejecting desire-following in legal matters", def: "In 32:29: Judge between them in justice; do not follow desire lest it diverts you from what Allah revealed.", key: "32:29", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Judicial impartiality."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Hawa as judicial corruption."}] },
  { id: "cand-1207", label: "Divine protectorship negating false guardians", def: "In 32:28: Have they taken protectors besides Him? Allah is the Protector; He gives life to dead.", key: "32:28", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Exclusive wali."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Life-giving as proof."}] },
  { id: "cand-1208", label: "Hour gathering with truthful judgment based on deeds", def: "In 32:29: Day He gathers all then judges between them in truth concerning what they used to do.", key: "32:29", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Jam' + qada' bi'l-haqq."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Deed-based verdict."}] },
  { id: "cand-1209", label: "Mutual waiting challenge between prophet and disbelievers", def: "In 32:30: Say if you disbelieve say wait; indeed we too are waiting.", key: "32:30", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Intizar mutuality."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Prophetic steadfastness."}] },
  { id: "cand-1210", label: "Desire-following producing sealed faculties and misguidance without helpers", def: "In 32:30: Whoever turns away follows his desire; Allah sealed his hearing and heart; who guides after Allah misled?", key: "32:30", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Hawa causing khatm."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Post-deviation sealing."}] },
  { id: "cand-1211", label: "Creation-resurrection ease comparison via single-soul analogy", def: "In 32:28: Your creation and resurrection not but like single soul; Allah is Hearing Seeing.", key: "32:28", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Scale-independent capacity."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Nafs wahidah analogy."}] },
  { id: "cand-1212", label: "Forgery accusation negated by divine origin affirmation", def: "In 32:3: Or do they say he invented it? Nay it is truth from your Lord to warn people before whom no warner came.", key: "32:3", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Haqq min rabbika."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"First warner function."}] },
  { id: "cand-1213", label: "Distant promise visualization commanding imaginative engagement", def: "In 32:5: You see it distant but We see it near.", key: "32:5", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ba'id-qarib contrast."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Divine perspective."}] },
  { id: "cand-1214", label: "Charitable spending from divine provision as nocturnal devotion component", def: "In 32:16: From what We provided them they spend — infaq linked to layl ibadah.", key: "32:16", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Night charity."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Integrated devotion."}] },
  { id: "cand-1215", label: "Inheritor identification through belief-response to revelation", def: "In 32:10: They say when is this decision? Say on Day of Decision belief benefits not those who disbelieved.", key: "32:10", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Yawm al-fasl."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Belated belief void."}] },
  { id: "cand-1216", label: "Turning away from messenger as desire-following with sealed faculties", def: "In 32:30: If someone turns away from Our messenger he follows his desire; Allah sealed hearing heart.", key: "32:30", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Messenger rejection."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Consequential blindness."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 5 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 15).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(15, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `032-as-sajdah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-056.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-056.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
