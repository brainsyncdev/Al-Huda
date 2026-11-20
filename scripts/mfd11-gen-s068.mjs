// MFD-11 Wave 10: Surah 68 (Al-Qalam) genuine re-extraction.
// Covers 68:1-52 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "068-0001-0052.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 68:${n} not found`);
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

console.log("Generating Surah 68 (Al-Qalam) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T19:25:00.000Z";

const PASSAGES = [
  { id: "ext-068-p1", from: 1, to: 16,
    label: "Nun by pen what inscribe; not Muhammad favor Lord madman; indeed reward uninterrupted; indeed great moral character; see they see; which afflicted devil; indeed Lord most knowing gone astray way most knowing guided; do not obey deniers; wish soften would soften; do not obey worthless habitual swearer; scorner going malicious gossip; preventer good transgressing sinful; cruel moreover illegitimate pretender; because possessor wealth children; verses recited says legends former peoples; brand him upon snout",
    mainLabel: "Oath by the pen and what is inscribed affirming the Prophet is not mad by his Lord's favour, possessing uninterrupted reward and great moral character; both sides will see who is truly afflicted; the Lord most knowing of the astray and the guided; prohibition of obeying deniers who wish mutual softening, nor every worthless swearer, scorner, gossip-monger, preventer of good, transgressor, sinner, cruel illegitimate pretender emboldened by wealth and children who dismisses recited verses as former legends — he will be branded on the snout" },
  { id: "ext-068-p2", from: 17, to: 33,
    label: "indeed tried them tried companions garden swore cut fruit morning without exception; came upon garden affliction Lord while asleep became though reaped; called one another morning; saying go early crop would cut fruit; set out lowering voices; saying surely not enter today upon poor person; went early determination assuming able; saw said indeed lost; rather deprived; most moderate said did not say why not exalt Allah; said Exalted Lord indeed wrongdoers; approached one another blaming; said O woe us indeed transgressors; perhaps Lord substitute better indeed toward Lord desirous; such punishment world punishment Hereafter greater only knew",
    mainLabel: "Trial paralleled to the garden-companions who swore to harvest at dawn without exception, so an affliction from their Lord struck while they slept leaving it as though reaped; calling each other at dawn to harvest before any poor person enters, setting out determined yet whispering, only to find it destroyed and admit loss and deprivation; the most moderate reminding them of his counsel to exalt Allah, prompting collective glorification, confession of wrongdoing, mutual blame and hope for a better replacement since they desire their Lord; this named worldly punishment with the Hereafter's being greater if they knew" },
  { id: "ext-068-p3", from: 34, to: 47,
    label: "indeed righteous Lord Gardens Pleasure; treat Muslims like criminals; what matter how judge; scripture learn; indeed whatever choose; oaths binding Us extending Day Resurrection indeed whatever judge; ask which responsible; partners bring partners truthful; Day shin uncovered invited prostration disbelievers not able; eyes humbled humiliation cover used invited prostration sound; leave Me whoever denies Quran progressively lead punishment where not know; give time indeed plan firm; ask payment debt burdened; knowledge unseen write down",
    mainLabel: "The righteous promised Gardens of Pleasure with their Lord; the rhetorical challenge whether Muslims could be treated like criminals or whether they possess a scripture teaching chosen outcomes or binding oaths until Resurrection; demand to identify who bears that claim or produce partners if truthful; the Day the shin is uncovered and prostration is invited but disbelievers cannot comply, their eyes humbled under humiliation having refused prostration when sound; the Prophet told to leave the matter of Quran-deniers to Allah who progressively leads them unknowingly with firm planning and granted respite; challenges whether he asks payment burdening them with debt or they possess written knowledge of the unseen" },
  { id: "ext-068-p4", from: 48, to: 52,
    label: "patient decision Lord Muhammad not like companion fish called distressed; favor Lord overtook thrown naked shore censured; Lord chose made righteous; indeed disbelieve almost make slip eyes hear message say indeed mad; not except reminder worlds",
    mainLabel: "Patience commanded for the Lord's decision, warning against resembling the companion of the fish who called out in distress and would have been cast onto the naked shore censured had divine favour not overtaken him, after which his Lord chose him and made him righteous; disbelievers nearly making the Prophet slip with their eyes upon hearing the message, calling him mad, while it is nothing but a reminder to the worlds" }
];

const SUB_LABELS = {
  "ext-068-p1": [
    "Oath by the pen and what is inscribed",
    "The Prophet affirmed not mad by his Lord's favour",
    "Uninterrupted reward declared for him",
    "Great moral character attributed to him",
    "Both sides will see who is truly afflicted",
    "The question posed: which of you is the afflicted by a devil",
    "The Lord most knowing of who has gone astray and who is guided",
    "Prohibition of obeying the deniers",
    "Their wish that he would soften so they could soften toward him",
    "Prohibition of obeying every worthless habitual swearer",
    "Scorner going about with malicious gossip",
    "Preventer of good, transgressing and sinful",
    "Cruel, moreover, and an illegitimate pretender",
    "His boldness attributed to possessing wealth and children",
    "Dismissing recited verses as legends of former peoples",
    "He will be branded upon the snout"
  ],
  "ext-068-p2": [
    "Trial paralleled to the garden-companions who swore to harvest at dawn",
    "They swore without making any exception for divine will",
    "An affliction from their Lord struck the garden while they slept",
    "It became as though reaped by morning",
    "They called one another at dawn",
    "Urging each other to go early to cut the fruit",
    "Setting out while lowering their voices",
    "Declaring no poor person would enter upon them that day",
    "Going early in determination, assuming themselves able",
    "Seeing it destroyed, they admitted they were lost",
    "Rather, they confessed they had been deprived",
    "The most moderate reminded them of his counsel to exalt Allah",
    "They glorified their Lord and confessed wrongdoing",
    "Approaching one another in mutual blame",
    "Crying woe and admitting transgression",
    "Hoping their Lord would substitute something better since they desire Him",
    "This named worldly punishment with the Hereafter's being greater if they knew"
  ],
  "ext-068-p3": [
    "The righteous promised Gardens of Pleasure with their Lord",
    "Rhetorical challenge: shall Muslims be treated like criminals",
    "Challenge continued: what is the matter with your judgement",
    "Do they possess a scripture in which they learn",
    "That indeed for them is whatever they choose",
    "Or binding oaths upon Us extending until the Day of Resurrection guaranteeing whatever they judge",
    "Demand to ask them which of them bears responsibility for that claim",
    "Or do they have partners — then let them bring their partners if they should be truthful",
    "The Day the shin is uncovered and prostration invited but disbelievers cannot comply",
    "Their eyes humbled under humiliation, having been invited to prostration while sound",
    "Leave the matter of Quran-deniers to Allah who progressively leads them unknowingly",
    "Respite granted with firm divine planning",
    "Challenge: does he ask payment burdening them with debt",
    "Or do they possess written knowledge of the unseen"
  ],
  "ext-068-p4": [
    "Patience commanded for the Lord's decision, warning against resembling the companion of the fish",
    "He called out in distress and would have been cast onto the naked shore censured",
    "Divine favour overtook him so his Lord chose him and made him righteous",
    "Disbelievers nearly making the Prophet slip with their eyes, calling him mad upon hearing the message",
    "It is nothing but a reminder to the worlds"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`68:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`68:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 68, surahName: "Al-Qalam",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 10 genuine re-extraction. Boundaries follow the text: P1 closes with the snout-branding verdict (16) before the garden-companions parable opens (17); P2 ends with the worldly-versus-hereafter punishment comparison (33) before the righteous-gardens and rhetorical challenges begin (34); P3 runs through the criminal-equation challenge, the shin-uncovering scene and the progressive-leading declaration (34-47); P4 covers Yunus's patience lesson, the evil-eye threat and the closing reminder-to-the-worlds declaration (48-52).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (68:1-16) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["68:8"], excerpt: fv(8), description: "Then do not obey the deniers." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["68:10"], excerpt: fv(10), description: "And do not obey every worthless habitual swearer." });

  e.humanConditionsAndSpiritualStates.push({ label: "Prophetic sanity affirmed by divine favour against accusations of madness", keys: ["68:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Great moral character attributed to the Prophet as factual declaration", keys: ["68:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wealth and children emboldening dismissal of revelation as former legends", keys: ["68:14","68:15"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Detailed profile of the denier: swearer, scorner, gossip-monger, preventer of good, transgressor, sinner, cruel, illegitimate pretender", keys: ["68:10","68:11","68:12","68:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Oath by the pen and inscription grounding the prophetic vindication", keys: ["68:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Branding on the snout as the divine answer to arrogant dismissal", keys: ["68:16"], evidenceClass: "EXPLICIT_TEXT" });

  const qalam = findWord(1, ["\u0642","\u0644","\u0645"]);
  if (qalam) e.terminology.push({ term: qalam, transliteration: "qalam", gloss: "pen (editorial gloss)", keys: ["68:1"] });
  const khuluq = findWord(4, ["\u062e","\u0644","\u0642"]);
  if (khuluq) e.terminology.push({ term: khuluq, transliteration: "khuluq azim", gloss: "great moral character (editorial gloss)", keys: ["68:4"] });
}

// === POPULATE P2 (68:17-33) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["68:28"], excerpt: fv(28), description: "Did I not say to you: Why do you not exalt Allah?" });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["68:29"], excerpt: fv(29), description: "Exalted is our Lord! Indeed, we were wrongdoers." });

  e.humanConditionsAndSpiritualStates.push({ label: "Swearing to harvest without invoking divine will producing total loss", keys: ["68:17","68:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Overnight divine affliction reducing the garden to a reaped field", keys: ["68:19","68:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Whispered exclusion of the poor followed by shocked admission of loss and deprivation", keys: ["68:23","68:24","68:26","68:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Collective repentance: glorification, confession, mutual blame and hope for substitution", keys: ["68:29","68:30","68:31","68:32"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Agricultural trial illustrating consequences of excluding the poor and omitting istithna'", keys: ["68:17","68:18","68:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Worldly punishment presented as lesser than the Hereafter's for those who know", keys: ["68:33"], evidenceClass: "EXPLICIT_TEXT" });

  const istithna = findWord(18, ["\u064a","\u0633","\u062a","\u062b"]);
  // Using 'without making exception' reference
  const yashtathimun = findWord(18, ["\u064a","\u0633","\u062a","\u062b","\u0646"]);
  if (yashtathimun) e.terminology.push({ term: yashtathimun, transliteration: "la yastathnun", gloss: "without making exception (editorial gloss)", keys: ["68:18"] });
}

// === POPULATE P3 (68:34-47) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Shin uncovered on the Day with prostration invited but disbelievers unable", keys: ["68:42"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Humiliation covering eyes that refused prostration when sound", keys: ["68:43"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Righteous granted Gardens of Pleasure against the criminal-equation absurdity", keys: ["68:34","68:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Progressive divine leading from unknown directions with firm planning during respite", keys: ["68:44","68:45"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Challenges regarding payment, debt and unseen-knowledge exposing baseless claims", keys: ["68:46","68:47"], evidenceClass: "EXPLICIT_TEXT" });

  const saq = findWord(42, ["\u0633","\u0627","\u0642"]);
  if (saq) e.terminology.push({ term: saq, transliteration: "saq", gloss: "shin (editorial gloss)", keys: ["68:42"] });
  const istidraj = findWord(44, ["\u0633","\u062a","\u062f","\u0631"]);
  if (istidraj) e.terminology.push({ term: istidraj, transliteration: "nastadrijuhum", gloss: "progressively lead (editorial gloss)", keys: ["68:44"] });
}

// === POPULATE P4 (68:48-52) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["68:48"], excerpt: fv(48), description: "Be patient for the decision of your Lord, and be not like the companion of the fish." });

  e.propheticNarratives.push({ label: "Companion of the fish calling out in distress, saved by divine favour, chosen and made righteous", keys: ["68:48","68:49","68:50"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Distress in confinement answered by divine rescue leading to prophetic election", keys: ["68:48","68:49","68:50"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Evil-eyed hostility nearly making the Prophet slip upon hearing the message", keys: ["68:51"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "The Quran named nothing but a reminder to the worlds against charges of madness", keys: ["68:52"], evidenceClass: "EXPLICIT_TEXT" });

  const dhuNun = findWord(48, ["\u0630","\u0627","\u0644"]);
  // Using sahib al-hut reference
  const hut = findWord(48, ["\u062d","\u0648","\u062a"]);
  if (hut) e.terminology.push({ term: hut, transliteration: "sahib al-hut", gloss: "companion of the fish (editorial gloss)", keys: ["68:48"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `068-al-qalam-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 068-al-qalam-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-068-p1,ext-068-p2,ext-068-p3,ext-068-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1801", label: "Pen-oath grounding prophetic sanity and great moral character", def: "In 68:1-4: Nun; by the pen and what they inscribe; you are not O Muhammad by the favor of your Lord a madman; and indeed for you is a reward uninterrupted; and indeed you are of a great moral character.", key: "68:1", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Qalam oath vindicating rasul."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Khuluq azim affirmed."}] },
  { id: "cand-1802", label: "Detailed denier profile: swearer, scorner, gossip, preventer of good, cruel pretender", def: "In 68:10-15: And do not obey every worthless habitual swearer, scorner going about with malicious gossip, a preventer of good transgressing and sinful, cruel moreover and an illegitimate pretender, because he is a possessor of wealth and children; when Our verses are recited to him he says legends of the former peoples.", key: "68:10", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Anti-virtue catalogue."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Wealth enabling denial."}] },
  { id: "cand-1803", label: "Snout-branding as divine answer to arrogant dismissal of revelation", def: "In 68:16: We will brand him upon the snout.", key: "68:16", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Sasm as humiliation mark."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Physical consequence for verbal arrogance."}] },

  { id: "cand-1804", label: "Garden-companions trial: oath without exception producing overnight destruction", def: "In 68:17-20: Indeed We have tried them as We tried the companions of the garden when they swore to cut its fruit in the early morning without making exception; so there came upon the garden an affliction from your Lord while they were asleep and it became as though reaped.", key: "68:17", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Bala' as agricultural trial."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Istithna' omission punished."}] },
  { id: "cand-1805", label: "Exclusion of the poor answered by total deprivation and collective repentance", def: "In 68:24-32: Saying there will surely not enter it today upon you any poor person; and they went early in determination assuming themselves able; but when they saw it they said indeed we are lost, rather we have been deprived; the most moderate said did I not say to you why do you not exalt Allah; they said exalted is our Lord indeed we were wrongdoers; then they approached one another blaming each other; they said O woe to us indeed we were transgressors; perhaps our Lord will substitute for us one better than it indeed we are toward our Lord desirous.", key: "68:24", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Poor excluded then all lost."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Collective tawbah pattern."}] },

  { id: "cand-1806", label: "Shin uncovered with impossible prostation for those who refused when sound", def: "In 68:42-43: The Day the shin will be uncovered and they are invited to prostration but the disbelievers will not be able; their eyes humbled humiliation will cover them and they used to be invited to prostration while they were sound.", key: "68:42", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Kashf an saq imagery."},{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Sujud refused then impossible."}] },
  { id: "cand-1807", label: "Progressive divine leading from unknown directions during granted respite", def: "In 68:44-45: So leave Me O Muhammad with whoever denies the Quran; We will progressively lead them to punishment from where they do not know; and I will give them time indeed My plan is firm.", key: "68:44", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Istidraj as gradual punishment."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Kayd Allah confirmed."}] },

  { id: "cand-1808", label: "Yunus's distress and rescue as patience model for the Prophet", def: "In 68:48-50: Then be patient for the decision of your Lord O Muhammad and be not like the companion of the fish when he called out while he was distressed; if not that a favor from his Lord overtook him he would have been thrown onto the naked shore while he was censured; and his Lord chose him and made him of the righteous.", key: "68:48", overlap: [{topicId:"yunus-story",layer:"scholarly",relationship:"same-concept",note:"Dhu'l-nun as sabr precedent."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr li-hukm rabbika commanded."}] },
  { id: "cand-1809", label: "Quran named a reminder to the worlds against charges of madness", def: "In 68:51-52: And indeed those who disbelieve would almost make you slip with their eyes when they hear the message and they say indeed he is mad; but it is not except a reminder to the worlds.", key: "68:52", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Dhikr li'l-alamin defined."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Lamz bi'l-ayn exposed."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 3).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(3, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 7).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(7, 9).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `068-al-qalam-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-092.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-092.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");