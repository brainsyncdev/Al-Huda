// MFD-11 Wave 10: Surah 69 (Al-Haqqah) genuine re-extraction.
// Covers 69:1-52 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "069-0001-0052.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 69:${n} not found`);
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

console.log("Generating Surah 69 (Al-Haqqah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T19:35:00.000Z";

const PASSAGES = [
  { id: "ext-069-p1", from: 1, to: 12,
    label: "Inevitable Reality what Inevitable Reality what make know Inevitable Reality; Thamud Aad denied Striking Calamity; Thamud destroyed overpowering blast; Aad destroyed screaming violent wind imposed seven nights eight days succession people fallen hollow trunks palm trees see any remains; came Pharaoh those before overturned cities sin disobeyed messenger Lord seized seizure exceeding severity; when water overflowed carried ancestors sailing ship make reminder conscious ear conscious",
    mainLabel: "The Inevitable Reality announced and its unknowability emphasised by repeated questioning; Thamud and Aad denying the Striking Calamity, Thamud destroyed by an overpowering blast and Aad by a screaming violent wind imposed seven nights and eight days until their people lay like hollow palm trunks with no remains left; Pharaoh, his predecessors and the overturned cities arriving with sin and disobeying their Lord's messenger, seized with exceeding severity; the flood recalled as the occasion when ancestors were carried in the sailing ship, made a reminder for a conscious ear" },
  { id: "ext-069-p2", from: 13, to: 37,
    label: "Horn blown one blast earth mountains lifted leveled one blow Day Resurrection occur heaven split infirm angels edges bear Throne Lord above them eight; Day exhibited judgement nothing concealed hidden; given record right hand says here read record certain meeting account pleasant life elevated garden fruit picked hanging near eat drink satisfaction put forth days past; given record left hand says wish not given record not known account wish death decisive wealth not availed gone authority; seize shackle Hellfire drive chain seventy cubits insert; not believe Allah Most Great nor encourage feeding poor; no devoted friend this Day no food except discharge wounds none eat except sinners",
    mainLabel: "The single Horn blast lifting and levelling earth and mountains so the Resurrection occurs, heaven splitting in infirmity with angels at its edges and eight bearing the Throne above them; all exhibited for judgement with nothing concealed; the right-hand record-holder inviting others to read it because he was certain of meeting his account, entering a pleasant life in an elevated garden with near-hanging fruit and satisfied eating for past deeds; the left-hand record-holder wishing he had never received it nor known his account, wishing death decisive since wealth and authority failed him; the command to seize, shackle, drive into Hellfire and insert into a seventy-cubit chain because he neither believed in Allah the Most Great nor encouraged feeding the poor, leaving him without devoted friend and with only wound-discharge food eaten by sinners" },
  { id: "ext-069-p3", from: 38, to: 47,
    label: "swear what see what not see; indeed Quran word noble Messenger; not word poet little believe; nor word soothsayer little remember; revelation Lord worlds; if Muhammad made up about Us false sayings seized right hand cut aorta none prevent Us from him",
    mainLabel: "Oath by both the seen and the unseen establishing the Quran as the word of a noble Messenger, neither a poet's word met with little belief nor a soothsayer's word met with little remembrance, but a revelation from the Lord of the worlds; the counterfactual guarantee that had Muhammad fabricated sayings against Allah he would have been seized by the right hand and his aorta cut with none able to prevent it" },
  { id: "ext-069-p4", from: 48, to: 52,
    label: "indeed Quran reminder righteous; indeed We know among deniers; indeed cause regret upon disbelievers; indeed truth certainty; exalt name Lord Most Great",
    mainLabel: "The Quran affirmed as a reminder for the righteous, with divine knowledge of deniers among them acknowledged; it will become a cause of regret upon disbelievers and is named the truth of certainty, closing with the command to exalt the name of the Lord, the Most Great" }
];

const SUB_LABELS = {
  "ext-069-p1": [
    "The Inevitable Reality announced as the surah's subject",
    "Its nature questioned emphatically",
    "The question of what could make its reality known",
    "Thamud and Aad named as deniers of the Striking Calamity",
    "Thamud destroyed by the overpowering blast",
    "Aad destroyed by a screaming violent wind",
    "That wind imposed seven nights and eight days until the people lay like hollow palm trunks",
    "The rhetorical question whether any remains of them can be seen",
    "Pharaoh, his predecessors and the overturned cities arriving with sin",
    "Their disobedience to their Lord's messenger answered by an exceeding seizure",
    "The overflowing water recalled as the occasion when ancestors were carried in the sailing ship",
    "That deliverance made a reminder for a conscious ear"
  ],
  "ext-069-p2": [
    "The Horn blown with a single blast",
    "Earth and mountains lifted and levelled with one blow",
    "The Resurrection occurring on that Day",
    "The heaven splitting open, infirm on that Day",
    "Angels at its edges with eight bearing the Throne of the Lord above them",
    "All exhibited for judgement with nothing concealed remaining hidden",
    "The right-hand record-holder inviting others to read his record",
    "His certainty of meeting his account declared as the reason",
    "A pleasant life granted to him",
    "An elevated garden named as his pleasant-life setting",
    "Its fruit hanging near for picking",
    "Eating and drinking in satisfaction for what was put forth in past days",
    "The left-hand record-holder wishing he had never been given his record",
    "Wishing he had not known his account",
    "Wishing his death had been the decisive end",
    "His wealth declared to have availed him nothing",
    "His authority declared gone from him",
    "The command to seize him and shackle him",
    "Then to drive him into Hellfire",
    "Then to insert him into a chain seventy cubits long",
    "The cause named: he did not believe in Allah the Most Great",
    "Nor did he encourage the feeding of the poor",
    "No devoted friend available to him on that Day",
    "No food for him except the discharge of wounds",
    "None eating that food except the sinners"
  ],
  "ext-069-p3": [
    "Oath sworn by what they see",
    "And by what they do not see",
    "The Quran established as the word of a noble Messenger",
    "Not the word of a poet, met with little belief",
    "Nor the word of a soothsayer, met with little remembrance",
    "Al-Haqqah affirms it as a revelation from the Lord of the worlds after denying poet and soothsayer authorship",
    "The counterfactual: had Muhammad fabricated sayings against Allah",
    "He would have been seized by the right hand",
    "Then his aorta would have been cut",
    "And none of them could have prevented it"
  ],
  "ext-069-p4": [
    "The Quran affirmed as a reminder for the righteous",
    "Divine knowledge that deniers exist among them acknowledged",
    "It will become a cause of regret upon the disbelievers",
    "It is named the truth of certainty",
    "Al-Haqqah closes with the command to exalt the name of the Lord, the Most Great"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`69:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`69:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 69, surahName: "Al-Haqqah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 10 genuine re-extraction. Boundaries follow the text: P1 closes with the flood-reminder and conscious-ear statement (12) before the Horn blast opens (13); P2 ends with the wound-discharge food verdict (37) before the seen-unseen oath begins (38); P3 runs through the Messenger-word affirmation, the poet-soothsayer denials and the fabrication counterfactual (38-47); P4 covers the reminder-for-the-righteous, the regret declaration, the truth-of-certainty and the closing exaltation (48-52).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (69:1-12) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Thamud and Aad denying the Striking Calamity before their destruction", keys: ["69:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Disobedience to the Lord's messenger answered by an exceeding seizure", keys: ["69:9","69:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Seven nights and eight days of imposed wind leaving a population like hollow palm trunks", keys: ["69:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Ancestors carried in the sailing ship when the water overflowed", keys: ["69:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.propheticNarratives.push({ label: "The flood deliverance of the ancestors in the sailing ship, made a reminder for a conscious ear", keys: ["69:11","69:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "The Inevitable Reality introduced through escalating questions of unknowability", keys: ["69:1","69:2","69:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No remains of the destroyed peoples left to be seen", keys: ["69:8"], evidenceClass: "EXPLICIT_TEXT" });

  const haqqah = findWord(1, ["\u062d","\u0627","\u0642"]);
  if (haqqah) e.terminology.push({ term: haqqah, transliteration: "al-haqqah", gloss: "the Inevitable Reality (editorial gloss)", keys: ["69:1"] });
  const qariah = findWord(4, ["\u0642","\u0627","\u0631","\u0639"]);
  if (qariah) e.terminology.push({ term: qariah, transliteration: "al-qari'ah", gloss: "the Striking Calamity (editorial gloss)", keys: ["69:4"] });
}

// === POPULATE P2 (69:13-37) ===
{
  const e = extractions[1];
  const azeem = findWord(33, ["\u0639","\u0638","\u064a","\u0645"]);
  if (azeem) e.divineNamesAndAttributes.push({ term: azeem, transliteration: "Azeem", gloss: "Most Great (editorial gloss)", keys: ["69:33"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["69:30"], excerpt: fv(30), description: "Seize him and shackle him — the divine verdict on the left-hand record-holder." });

  e.humanConditionsAndSpiritualStates.push({ label: "Certainty of meeting the account producing joy at receiving the right-hand record", keys: ["69:19","69:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Regret at receiving the left-hand record with the wish that death had been decisive", keys: ["69:25","69:26","69:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wealth and authority failing their owner at the reckoning", keys: ["69:28","69:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Failure to believe in Allah the Most Great and to encourage feeding the poor named as the cause of punishment", keys: ["69:33","69:34"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Neglect of encouraging the feeding of the poor paired with disbelief as grounds for the chain", keys: ["69:34"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Elevated garden with near-hanging fruit and satisfied eating for past deeds", keys: ["69:22","69:23","69:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Single Horn blast levelling earth and mountains as the Resurrection's onset", keys: ["69:13","69:14","69:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Eight angels bearing the Throne above the edges of the split heaven", keys: ["69:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Complete exhibition for judgement with nothing concealed", keys: ["69:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Seventy-cubit chain and wound-discharge food as the denier's provision", keys: ["69:32","69:36","69:37"], evidenceClass: "EXPLICIT_TEXT" });

  const sur = findWord(13, ["\u0635","\u0648","\u0631"]);
  if (sur) e.terminology.push({ term: sur, transliteration: "sur", gloss: "the Horn (editorial gloss)", keys: ["69:13"] });
  const arsh = findWord(17, ["\u0639","\u0631","\u0634"]);
  if (arsh) e.terminology.push({ term: arsh, transliteration: "arsh", gloss: "Throne (editorial gloss)", keys: ["69:17"] });
  const ghisleen = findWord(36, ["\u063a","\u0633","\u0644","\u064a","\u0646"]);
  if (ghisleen) e.terminology.push({ term: ghisleen, transliteration: "ghislin", gloss: "discharge of wounds (editorial gloss)", keys: ["69:36"] });
}

// === POPULATE P3 (69:38-47) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Little belief and little remembrance offered against the poet and soothsayer charges", keys: ["69:41","69:42"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Oath covering both the seen and the unseen establishing the revelation's source", keys: ["69:38","69:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The Quran named the word of a noble Messenger and a revelation from the Lord of the worlds", keys: ["69:40","69:43"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Fabrication counterfactual: seizure by the right hand and cutting of the aorta with no possible prevention", keys: ["69:44","69:45","69:46","69:47"], evidenceClass: "EXPLICIT_TEXT" });

  const rasool = findWord(40, ["\u0631","\u0633","\u0648","\u0644"]);
  if (rasool) e.terminology.push({ term: rasool, transliteration: "rasul karim", gloss: "noble Messenger (editorial gloss)", keys: ["69:40"] });
  const wateen = findWord(46, ["\u0648","\u062a","\u064a","\u0646"]);
  if (wateen) e.terminology.push({ term: wateen, transliteration: "al-watin", gloss: "the aorta (editorial gloss)", keys: ["69:46"] });
}

// === POPULATE P4 (69:48-52) ===
{
  const e = extractions[3];
  const azeem2 = findWord(52, ["\u0639","\u0638","\u064a","\u0645"]);
  if (azeem2) e.divineNamesAndAttributes.push({ term: azeem2, transliteration: "Azeem", gloss: "Most Great (editorial gloss)", keys: ["69:52"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["69:52"], excerpt: fv(52), description: "So exalt the name of your Lord, the Most Great." });

  e.humanConditionsAndSpiritualStates.push({ label: "The Quran becoming a cause of regret upon the disbelievers", keys: ["69:50"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Reminder for the righteous set against acknowledged deniers among the audience", keys: ["69:48","69:49"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The truth of certainty affirmed immediately before the exaltation command", keys: ["69:51","69:52"], evidenceClass: "EXPLICIT_TEXT" });

  const yaqeen = findWord(51, ["\u064a","\u0642","\u064a","\u0646"]);
  if (yaqeen) e.terminology.push({ term: yaqeen, transliteration: "haqq al-yaqin", gloss: "the truth of certainty (editorial gloss)", keys: ["69:51"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `069-al-haqqah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 069-al-haqqah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-069-p1,ext-069-p2,ext-069-p3,ext-069-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1810", label: "Thamud and Aad destroyed by blast and sustained violent wind", def: "In 69:4-8: Thamud and Aad denied the Striking Calamity; so as for Thamud they were destroyed by the overpowering blast; and as for Aad they were destroyed by a screaming violent wind which Allah imposed upon them for seven nights and eight days in succession so you would see the people therein fallen as if they were hollow trunks of palm trees; then do you see of them any remains.", key: "69:4", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Taghiyah and sarsar 'atiyah."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hollow-trunk imagery as historical sign."}] },
  { id: "cand-1811", label: "Flood deliverance made a reminder for a conscious ear", def: "In 69:11-12: Indeed when the water overflowed We carried your ancestors in the sailing ship that We might make it for you a reminder and that a conscious ear would be conscious of it.", key: "69:11", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Nuh's ark as ancestral deliverance."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Udhun wa'iyah receptivity."}] },

  { id: "cand-1812", label: "Single Horn blast levelling creation with eight bearing the Throne", def: "In 69:13-17: Then when the Horn is blown with one blast and the earth and the mountains are lifted and leveled with one blow then on that Day the Resurrection will occur; and the heaven will split open for that Day it is infirm; and the angels are at its edges and there will bear the Throne of your Lord above them that Day eight of them.", key: "69:13", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Nafkhah wahidah sequence."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Hamalat al-arsh numbered eight."}] },
  { id: "cand-1813", label: "Right-hand record received with certainty-driven joy and elevated garden", def: "In 69:19-24: So as for he who is given his record in his right hand he will say here read my record; indeed I was certain that I would be meeting my account; so he will be in a pleasant life in an elevated garden its fruit to be picked hanging near; eat and drink in satisfaction for what you put forth in the days past.", key: "69:19", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Kitab bi'l-yamin."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Yaqin al-hisab producing reward."}] },
  { id: "cand-1814", label: "Left-hand record producing regret with wealth and authority失效", def: "In 69:25-29: But as for he who is given his record in his left hand he will say oh I wish I had not been given my record and had not known what is my account; I wish my death had been the decisive one; my wealth has not availed me; gone from me is my authority.", key: "69:25", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Mal and sultan both void."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Kitab bi'l-shimal regret."}] },
  { id: "cand-1815", label: "Disbelief and neglect of feeding the poor as joint grounds for the chain", def: "In 69:30-34: Seize him and shackle him then into Hellfire drive him then into a chain whose length is seventy cubits insert him; indeed he did not used to believe in Allah the Most Great nor did he encourage the feeding of the poor.", key: "69:30", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Ta'am al-miskin neglected."},{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Silsilah sab'un dhira'an."}] },

  { id: "cand-1816", label: "Seen-unseen oath establishing the Quran as a noble Messenger's word", def: "In 69:38-43: So I swear by what you see and what you do not see; indeed the Quran is the word of a noble Messenger; and it is not the word of a poet little do you believe; nor the word of a soothsayer little do you remember; it is a revelation from the Lord of the worlds.", key: "69:38", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Qawl rasul karim tanzil."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Poet and kahin charges refuted."}] },
  { id: "cand-1817", label: "Fabrication counterfactual guaranteeing prophetic authenticity", def: "In 69:44-47: And if Muhammad had made up about Us some false sayings We would have seized him by the right hand then We would have cut from him the aorta and there is no one of you who could prevent Us from him.", key: "69:44", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Iftira' impossibility argument."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Akhdh bi'l-yamin wa-qat' al-watin."}] },

  { id: "cand-1818", label: "Quran as reminder for the righteous and truth of certainty", def: "In 69:48-52: And indeed the Quran is a reminder for the righteous; and indeed We know that among you are deniers; and indeed it will be a cause of regret upon the disbelievers; and indeed it is the truth of certainty; so exalt the name of your Lord the Most Great.", key: "69:48", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Tadhkirah li'l-muttaqin."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Haqq al-yaqin closure."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 6).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(6, 8).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(8, 9).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `069-al-haqqah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-093.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-093.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");