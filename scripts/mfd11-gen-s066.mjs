// MFD-11 Wave 9: Surah 66 (At-Tahrim) genuine re-extraction.
// Covers 66:1-12 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "066-0001-0012.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 66:${n} not found`);
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

console.log("Generating Surah 66 (At-Tahrim) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T19:05:00.000Z";

const PASSAGES = [
  { id: "ext-066-p1", from: 1, to: 5,
    label: "O Prophet why prohibit what Allah made lawful seeking approval wives Allah Forgiving Merciful; Allah ordained dissolution oaths Allah protector Knowing Wise; when Prophet confided wife statement she informed another Allah showed him made known part ignored part informed her said who told you said informed Knowing Acquainted; if two repent Allah best hearts deviated cooperate against him indeed Allah protector Gabriel righteous believers angels assistants; perhaps Lord if divorced substitute wives better submitting believing devoutly obedient repentant worshipping traveling previously married virgins",
    mainLabel: "The Prophet questioned for prohibiting what Allah made lawful in seeking his wives' approval, under forgiveness and mercy; oath-dissolution already ordained by Allah as protector, Knowing and Wise; the confidential statement disclosed by one wife to another, shown to him by Allah so he made part known and ignored part, identifying the source as the Knowing and Acquainted; both wives called to repentance since their hearts had deviated, warned that cooperating against him would meet Allah as protector alongside Gabriel, righteous believers and angels as assistants; the possibility raised that divorce would bring better wives — submissive, believing, obedient, repentant, worshipping, travelling, previously married or virgins" },
  { id: "ext-066-p2", from: 6, to: 9,
    label: "O believed protect yourselves families Fire fuel people stones over which angels harsh severe not disobey Allah commands do what commanded; O disbelieved make no excuses Day recompensed what used do; O believed repent Allah sincere repentance perhaps Lord remove misdeeds admit gardens rivers flow Day Allah not disgrace Prophet believed with him light proceed before right say Our Lord perfect us light forgive us indeed You over all competent; O Prophet strive against disbelievers hypocrites harsh upon them refuge Hell wretched destination",
    mainLabel: "Believers commanded to protect themselves and their families from a Fire fuelled by people and stones, overseen by harsh angels who never disobey divine commands; disbelievers told to offer no excuses on that Day since they will only be recompensed for their deeds; believers urged toward sincere repentance so their Lord may remove misdeeds and admit them to rivered gardens on the Day the Prophet and his fellow believers are not disgraced, their light proceeding before them and on their right while they pray for its perfection and forgiveness; the Prophet commanded to strive harshly against disbelievers and hypocrites whose refuge is Hell, a wretched destination" },
  { id: "ext-066-p3", from: 10, to: 12,
    label: "Allah presents example disbelieved wife Noah wife Lot under two righteous servants betrayed them prophets not avail them Allah at all said enter Fire those enter; Allah presents example believed wife Pharaoh said My Lord build me near You house Paradise save me Pharaoh deeds save me wrongdoing people; Mary daughter Imran guarded chastity blew into garment through angel believed words Lord scriptures devoutly obedient",
    mainLabel: "Two examples of disbelief presented through the wives of Noah and Lot who were under righteous servants yet betrayed them, so their husbands availed them nothing against Allah and they were told to enter the Fire with its entrants; an example of belief presented through Pharaoh's wife who prayed for a house near Allah in Paradise and salvation from Pharaoh, his deeds and the wrongdoers; and Mary daughter of Imran who guarded her chastity, received the divine breath through an angel, believed in her Lord's words and scriptures and was among the devoutly obedient" }
];

const SUB_LABELS = {
  "ext-066-p1": [
    "The Prophet questioned for prohibiting what Allah made lawful in seeking his wives' approval, under forgiveness and mercy",
    "Oath-dissolution already ordained by Allah as protector, Knowing and Wise",
    "The confidential statement disclosed by one wife to another, shown to him by Allah so he made part known and ignored part, identifying the source as the Knowing and Acquainted",
    "Both wives called to repentance since their hearts had deviated, warned that cooperating against him would meet Allah, Gabriel, righteous believers and angels as his assistants",
    "The possibility raised that divorce would bring better wives — submissive, believing, obedient, repentant, worshipping, travelling, previously married or virgins"
  ],
  "ext-066-p2": [
    "Believers commanded to protect themselves and their families from a Fire fuelled by people and stones, overseen by harsh angels who never disobey",
    "Disbelievers told to offer no excuses on that Day since they will only be recompensed for their deeds",
    "Believers urged toward sincere repentance so misdeeds are removed and rivered gardens granted on the Day the Prophet and believers are not disgraced, their light proceeding while they pray for its perfection and forgiveness",
    "The Prophet commanded to strive harshly against disbelievers and hypocrites whose refuge is Hell, a wretched destination"
  ],
  "ext-066-p3": [
    "Wives of Noah and Lot under righteous servants yet betraying them, availing nothing against Allah, told to enter the Fire",
    "Pharaoh's wife praying for a house near Allah in Paradise and salvation from Pharaoh, his deeds and the wrongdoers",
    "Mary daughter of Imran guarding her chastity, receiving the divine breath through an angel, believing in her Lord's words and scriptures as one of the devoutly obedient"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`66:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`66:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 66, surahName: "At-Tahrim",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the better-wives substitution scenario (5) before the fire-protection command opens (6); P2 ends with the jihad-harshness command and Hell-refuge verdict (9) before the four-women exempla block begins (10); P3 covers the two disbelieving and two believing women exemplars (10-12).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (66:1-5) ===
{
  const e = extractions[0];
  const ghafoor = findWord(1, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(1, ["\u0631","\u062d","\u064a","\u0645"]);
  const aleem = findWord(2, ["\u0639","\u0644","\u064a","\u0645"]);
  const hakeem = findWord(2, ["\u062d","\u0643","\u064a","\u0645"]);
  const khabir = findWord(3, ["\u062e","\u0628","\u064a","\u0631"]);
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["66:1"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["66:1"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["66:2"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["66:2"] });
  if (khabir) e.divineNamesAndAttributes.push({ term: khabir, transliteration: "Khabir", gloss: "Acquainted (editorial gloss)", keys: ["66:3"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["66:1"], excerpt: fv(1), description: "Why do you prohibit yourself from what Allah has made lawful for you, seeking the approval of your wives?" });

  e.humanConditionsAndSpiritualStates.push({ label: "Prophetic self-prohibition of a lawful matter in pursuit of spousal approval", keys: ["66:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hearts of two wives having deviated, requiring joint repentance", keys: ["66:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Oath-dissolution mechanism ordained by Allah as legal relief", keys: ["66:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Better-wife profile enumerated: submissive, believing, obedient, repentant, worshipping, travelling, previously married or virgin", keys: ["66:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Confidential disclosure breached and divinely revealed, with partial confrontation and partial overlooking", keys: ["66:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine protection network: Allah, Gabriel, righteous believers and angels backing the Prophet against domestic opposition", keys: ["66:4"], evidenceClass: "EXPLICIT_TEXT" });

  const tahrim = findWord(1, ["\u062d","\u0631","\u0645"]);
  if (tahrim) e.terminology.push({ term: tahrim, transliteration: "tuharrim", gloss: "prohibiting (editorial gloss)", keys: ["66:1"] });
  const kafarah = findWord(2, ["\u0643","\u0641","\u0631"]);
  // Using yamīn / oath dissolution reference
  const yameen = findWord(2, ["\u064a","\u0645","\u0646"]);
  if (yameen) e.terminology.push({ term: yameen, transliteration: "tahlil al-ayman", gloss: "dissolution of oaths (editorial gloss)", keys: ["66:2"] });
}

// === POPULATE P2 (66:6-9) ===
{
  const e = extractions[1];
  const qadeer = findWord(8, ["\u0642","\u062f","\u064a","\u0631"]);
  if (qadeer) e.divineNamesAndAttributes.push({ term: qadeer, transliteration: "Qadeer", gloss: "Competent (editorial gloss)", keys: ["66:8"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["66:6"], excerpt: fv(6), description: "Protect yourselves and your families from a Fire whose fuel is people and stones." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["66:8"], excerpt: fv(8), description: "Repent to Allah with sincere repentance." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["66:8"], excerpt: fv(8), description: "Our Lord, perfect for us our light and forgive us. Indeed, You are over all things competent." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["66:9"], excerpt: fv(9), description: "O Prophet, strive against the disbelievers and the hypocrites and be harsh upon them." });

  e.humanConditionsAndSpiritualStates.push({ label: "Fire fuelled by people and stones overseen by harsh angels who never disobey", keys: ["66:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "No excuses accepted from disbelievers on the Day of Recompense", keys: ["66:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Light proceeding before believers and on their right on the Day of non-disgrace", keys: ["66:8"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Family protection from Hellfire framed as a believer obligation", keys: ["66:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Sincere repentance potentially removing misdeeds and granting garden admission", keys: ["66:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Hell named as the wretched destination for disbelievers and hypocrites", keys: ["66:9"], evidenceClass: "EXPLICIT_TEXT" });

  const tawbah = findWord(8, ["\u062a","\u0648","\u0628"]);
  if (tawbah) e.terminology.push({ term: tawbah, transliteration: "tawbah nasuh", gloss: "sincere repentance (editorial gloss)", keys: ["66:8"] });
  const nur = findWord(8, ["\u0646","\u0648","\u0631"]);
  if (nur) e.terminology.push({ term: nur, transliteration: "nur", gloss: "light (editorial gloss)", keys: ["66:8"] });
}

// === POPULATE P3 (66:10-12) ===
{
  const e = extractions[2];

  e.propheticNarratives.push({ label: "Wife of Noah and wife of Lot under righteous servants yet betraying them, availing nothing against Allah, told to enter the Fire", keys: ["66:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Pharaoh's wife praying for a house near Allah in Paradise and salvation from Pharaoh and the wrongdoers", keys: ["66:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Mary daughter of Imran guarding her chastity, receiving the divine breath through an angel, believing in her Lord's words and scriptures", keys: ["66:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Spousal betrayal of righteous prophets producing no divine avail", keys: ["66:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Believing woman under tyrannical husband seeking proximity to Allah and rescue from wrongdoing", keys: ["66:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Chastity guarded, divine spirit breathed, scriptural belief affirmed and devout obedience completed", keys: ["66:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Four women presented as paired exempla: two disbelieving spouses and two believing women across prophetic history", keys: ["66:10","66:11","66:12"], evidenceClass: "EXPLICIT_TEXT" });

  const qanitin = findWord(12, ["\u0642","\u0627","\u0646","\u062a"]);
  if (qanitin) e.terminology.push({ term: qanitin, transliteration: "qanitun", gloss: "devoutly obedient (editorial gloss)", keys: ["66:12"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `066-at-tahrim-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 066-at-tahrim-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-066-p1,ext-066-p2,ext-066-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1781", label: "Self-prohibition of the lawful for spousal approval corrected under forgiveness", def: "In 66:1: O Prophet why do you prohibit yourself from what Allah has made lawful for you seeking the approval of your wives? And Allah is Forgiving and Merciful.", key: "66:1", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Prophetic correction as legislation."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafoor Raheem framing the rebuke."}] },
  { id: "cand-1782", label: "Oath-dissolution ordained as legal relief under divine knowledge and wisdom", def: "In 66:2: Allah has already ordained for you the dissolution of your oaths; and Allah is your protector and He is the Knowing the Wise.", key: "66:2", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Tahlil al-ayman as legislative mercy."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Aleem Hakeem grounding the ruling."}] },
  { id: "cand-1783", label: "Confidential disclosure breached and divinely revealed with partial confrontation", def: "In 66:3: And when the Prophet confided to one of his wives a statement and when she informed another of it and Allah showed it to him he made known part of it and ignored a part; and when he informed her about it she said who told you this; he said I was informed by the Knowing the Acquainted.", key: "66:3", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Aleem Khabir as disclosure source."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Partial overlooking as prophetic adab."}] },
  { id: "cand-1784", label: "Domestic opposition met by divine-angelic-believer protection network", def: "In 66:4: If you two repent to Allah it is best for your hearts have deviated; but if you cooperate against him then indeed Allah is his protector and Gabriel and the righteous of the believers and the angels moreover are his assistants.", key: "66:4", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Heart deviation diagnosed."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Jibreel wa-mala'ikah as support."}] },

  { id: "cand-1785", label: "Family protection from Fire fuelled by people and stones as believer duty", def: "In 66:6: O you who have believed protect yourselves and your families from a Fire whose fuel is people and stones over which are angels harsh and severe; they do not disobey Allah in what He commands them but do what they are commanded.", key: "66:6", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Qu anfusakum wa-ahlikum nar."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Angel-guarded punishment described."}] },
  { id: "cand-1786", label: "Sincere repentance removing misdeeds with light perfected on the Day of non-disgrace", def: "In 66:8: O you who have believed repent to Allah with sincere repentance; perhaps your Lord will remove from you your misdeeds and admit you into gardens beneath which rivers flow on the Day when Allah will not disgrace the Prophet and those who believed with him; their light will proceed before them and on their right; they will say our Lord perfect for us our light and forgive us indeed You are over all things competent.", key: "66:8", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Tawbah nasuh defined."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Light-perfection dua taught."}] },

  { id: "cand-1787", label: "Two disbelieving wives under righteous prophets availing nothing against Allah", def: "In 66:10: Allah presents an example of those who disbelieved: the wife of Noah and the wife of Lot; they were under two of Our righteous servants but betrayed them so those prophets did not avail them from Allah at all and it was said enter the Fire with those who enter.", key: "66:10", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Nuh and Lut spousal failure."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Kinship cannot substitute for faith."}] },
  { id: "cand-1788", label: "Pharaoh's wife and Mary as believing-women exempla across tyranny and chastity", def: "In 66:11-12: And Allah presents an example of those who believed: the wife of Pharaoh when she said my Lord build for me near You a house in Paradise and save me from Pharaoh and his deeds and save me from the wrongdoing people; and Mary the daughter of Imran who guarded her chastity so We blew into her garment through Our angel and she believed in the words of her Lord and His scriptures and was of the devoutly obedient.", key: "66:11", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ihsan and chastity modelled."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Asiyah's dua as paradigm."}] }
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
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 6).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(6, 8).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `066-at-tahrim-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-090.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-090.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");