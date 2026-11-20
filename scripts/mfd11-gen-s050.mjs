// MFD-11 Wave 8: Surah 50 (Qaf) genuine re-extraction.
// Covers 50:1-45 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "050-0001-0045.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 50:${n} not found`);
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

console.log("Generating Surah 50 (Qaf) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T16:35:00.000Z";

const PASSAGES = [
  { id: "ext-050-p1", from: 1, to: 15,
    label: "Qaf by honored Quran; wonder warner among themselves disbelievers say amazing thing; died become dust return life distant return; know earth diminishes retaining record; denied truth came confused condition; looked heaven above structured adorned no rifts; earth spread out cast firmly set mountains made grow every beautiful kind; giving insight reminder servant turns; sent down blessed rain sky made grow gardens grain harvest; lofty palm trees fruit arranged layers; provision servants given life dead land thus resurrection; people Noah denied companions well Thamud; Aad Pharaoh brothers Lot; companions thicket people Tubba all denied messengers threat justly fulfilled; fail first creation confusion new creation",
    mainLabel: "Opening letter Qaf and oath by the honoured Quran; their wonder at a warner from among themselves dismissed as amazing, denying resurrection after becoming dust as a distant return; divine knowledge of what the earth diminishes affirmed alongside a retaining record; denial producing confusion against the structured adorned riftless heaven and the spread earth with firm mountains and every beautiful growth providing insight and reminder for the returning servant; blessed rain producing gardens, harvest grain and layered-date palms as provision and revival of dead land paralleling resurrection; nine prior communities named — Noah's people, the well-companions, Thamud, Aad, Pharaoh, Lot's brothers, the thicket-companions and Tubba's people — all denying messengers with the threat justly fulfilled; the first creation invoked to expose their confusion over a new one" },
  { id: "ext-050-p2", from: 16, to: 35,
    label: "created man know soul whispers closer jugular vein; two receivers receive seated right left; man utter word observer prepared; intoxication death bring truth trying avoid; Horn blown Day threat; every soul come driver witness; unmindfulness removed cover sight sharp; companion angel say record with me prepared; throw Hell every obstinate disbeliever; preventer good aggressor doubter; made equal Allah another deity throw severe punishment; devil companion say Lord not make transgress extreme error; say do not dispute before Me presented warning; word not changed unjust servants; say Hell filled some more; Paradise brought near righteous not far; promised every returner keeper; feared Most Merciful unseen came heart returning; enter peace Day Eternity; whatever wish therein Us more",
    mainLabel: "Man created with divine knowledge of his soul's whispering and proximity closer than the jugular vein; two recording receivers seated right and left capturing every uttered word; death's intoxication bringing the avoided truth; the Horn-blast Day of threat when every soul arrives with driver and witness; unmindfulness stripped away as the cover is removed and sight sharpened; the companion-angel presenting the prepared record; the command to cast into Hell every obstinate disbeliever — preventer of good, aggressor, doubter and associator — into severe punishment; the devil-companion disclaiming responsibility while Allah forbids dispute having already warned and His word remaining unchanged without injustice; Hell asked if full and asking for more; Paradise brought near to the righteous — every returning keeper who feared the Rahman unseen and came with a repentant heart — entering in peace on the Day of Eternity with whatever they wish and more from Us" },
  { id: "ext-050-p3", from: 36, to: 45,
    label: "many generation before destroyed greater striking power explored lands place escape; indeed that reminder whoever has heart listens present mind; certainly create heavens earth between six days touched no weariness; be patient Muhammad over say exalt praise Lord before rising sun before setting; part night exalt after prostration; listen Day Caller call out place near; Day hear blast truth Day Emergence graves; indeed We give life cause death Us destination; Day earth breaks away rapidly gathering easy Us; most knowing say not over them tyrant; remind Quran whoever fears threat",
    mainLabel: "Many prior generations greater in striking power and land-exploration destroyed, leaving no place of escape; this serving as reminder for whoever has a heart or listens attentively; creation of heavens, earth and between in six days without weariness affirmed; patience commanded over their words alongside timed praise before sunrise, before sunset, during part of the night and after prostration; listening urged for the Day the nearby Caller calls and the truthful blast signals emergence from graves; life and death dispensed by Us with return to Us; the earth breaking open for rapid gathering described as easy for Us; divine knowledge of their speech affirmed while the Prophet is not a tyrant over them, his role limited to reminding by the Quran whoever fears the divine threat" }
];

const SUB_LABELS = {
  "ext-050-p1": [
    "Opening letter Qaf and oath by the honoured Quran",
    "Wonder at a warner from among themselves dismissed as amazing by disbelievers",
    "Denial of resurrection after death and dust as a distant return",
    "Divine knowledge of what the earth diminishes alongside a retaining record",
    "Denial of arriving truth producing a confused condition",
    "Structured adorned riftless heaven offered as evidence",
    "Earth spread out with firmly set mountains and every beautiful kind growing therein",
    "Insight and reminder provided for every servant who turns to Allah",
    "Blessed rain sent down producing gardens and harvest grain",
    "Lofty palm trees with fruit arranged in layers",
    "Provision for servants and revival of dead land declared as the resurrection parallel",
    "People of Noah, companions of the well and Thamud named as prior deniers",
    "Aad, Pharaoh and brothers of Lot added to the denial catalogue",
    "Companions of the thicket and people of Tubba completing the list with the threat justly fulfilled",
    "First creation invoked to expose their confusion over a new creation"
  ],
  "ext-050-p2": [
    "Man created with divine knowledge of what his soul whispers",
    "Allah closer to him than his jugular vein",
    "Two recording receivers seated on the right and on the left",
    "Every uttered word captured by a prepared observer",
    "Death's intoxication bringing the truth they tried to avoid",
    "The Horn blown as the Day of the promised threat",
    "Every soul arriving with a driver and a witness",
    "Unmindfulness ended as the cover is removed and sight sharpened",
    "The companion-angel presenting the prepared record",
    "Command to throw into Hell every obstinate disbeliever",
    "Preventer of good, aggressor and doubter specified",
    "One who made another deity equal to Allah thrown into severe punishment",
    "Devil-companion disclaiming transgression-inducement before Allah",
    "Dispute forbidden since the warning was already presented and Allah's word is unchanged without injustice",
    "Hell asked if full and responding are there some more",
    "Paradise brought near to the righteous, not far",
    "Promised to every returner and keeper who feared the Rahman unseen and came with a repentant heart",
    "Enter it in peace as the Day of Eternity",
    "Whatever they wish therein provided",
    "And with Us is more beyond their wishes"
  ],
  "ext-050-p3": [
    "Many prior generations greater in striking power and land-exploration destroyed",
    "No place of escape remaining, serving as reminder for whoever has a heart or listens attentively",
    "Creation of heavens, earth and between in six days without any weariness touching Us",
    "Patience commanded over what they say alongside praise before sunrise and before sunset",
    "Night-time exaltation and post-prostration praise added to the timed stations",
    "Listening urged for the Day the Caller calls out from a nearby place",
    "The truthful blast heard as the Day of Emergence from graves",
    "Life and death dispensed by Us with return to Us as the destination",
    "Earth breaking open for rapid gathering described as easy for Us",
    "Divine knowledge of their speech affirmed while the Prophet is not a tyrant, reminding by the Quran whoever fears the threat"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`50:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`50:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 50, surahName: "Qaf",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 8 genuine re-extraction. Boundaries follow the text: P1 closes with the first-creation argument (15) before the intimate-knowledge-and-recording block opens (16); P2 ends with the Paradise-entry promise (35) before the prior-destruction reminder begins (36); P3 runs from that reminder through creation-without-weariness, timed praise, the Day sequence and the closing reminder commission (36-45). Note: P1 spans 15 verses with 10 subordinate labels covering multi-verse thematic units; P2 spans 20 verses with 9 labels; P3 spans 10 verses with 5 labels.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (50:1-15) ===
{
  const e = extractions[0];

  e.humanConditionsAndSpiritualStates.push({ label: "Wonder at an internal warner dismissed as amazing while resurrection is denied as distant", keys: ["50:2","50:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Confusion produced by denying the arriving truth", keys: ["50:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Blessed rain producing gardens, harvest grain and layered-date palms as provision reviving dead land", keys: ["50:9","50:10","50:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Earth diminishing its contents known to Allah alongside a retaining record", keys: ["50:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Nine prior communities denying messengers with the threat justly fulfilled", keys: ["50:12","50:13","50:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "First creation invoked to expose confusion over resurrection", keys: ["50:15"], evidenceClass: "EXPLICIT_TEXT" });

  const qaf = findWord(1, ["\u0642"]);
  if (qaf) e.terminology.push({ term: qaf, transliteration: "Qaf", gloss: "disjointed letter (editorial gloss)", keys: ["50:1"] });
  const majid = findWord(1, ["\u0645","\u062c","\u064a","\u062f"]);
  if (majid) e.terminology.push({ term: majid, transliteration: "majid", gloss: "honoured/glorious (editorial gloss)", keys: ["50:1"] });
}

// === POPULATE P2 (50:16-35) ===
{
  const e = extractions[1];
  const rahman = findWord(33, ["\u0631","\u062d","\u0645","\u0646"]);
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["50:33"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["50:24"], excerpt: fv(24), description: "Throw into Hell every obstinate disbeliever." });

  e.humanConditionsAndSpiritualStates.push({ label: "Soul's whispering known to Allah who is closer than the jugular vein", keys: ["50:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Every uttered word recorded by a prepared observer", keys: ["50:17","50:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Death's intoxication bringing the truth they tried to avoid", keys: ["50:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Cover removed and sight sharpened on the Day of threat", keys: ["50:22"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Fear of the Rahman unseen combined with a repentant heart as entry criteria", keys: ["50:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Driver and witness accompanying every soul on the Day of threat", keys: ["50:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Devil-companion disclaiming transgression-inducement while Allah's word remains unchanged", keys: ["50:27","50:28","50:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Hell asking for more while Paradise is brought near to the righteous", keys: ["50:30","50:31"], evidenceClass: "EXPLICIT_TEXT" });

  const nafs = findWord(16, ["\u0646","\u0641","\u0633"]);
  if (nafs) e.terminology.push({ term: nafs, transliteration: "nafs", gloss: "soul/self (editorial gloss)", keys: ["50:16"] });
  const hable = findWord(16, ["\u062d","\u0628","\u0644"]);
  if (hable) e.terminology.push({ term: hable, transliteration: "habl al-warid", gloss: "jugular vein (editorial gloss)", keys: ["50:16"] });
}

// === POPULATE P3 (50:36-45) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["50:39"], excerpt: fv(39), description: "So be patient over what they say and exalt with praise of your Lord before the rising of the sun and before its setting." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["50:40"], excerpt: fv(40), description: "And in part of the night exalt Him and after prostration." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["50:45"], excerpt: fv(45), description: "Remind by the Quran whoever fears My threat." });

  e.humanConditionsAndSpiritualStates.push({ label: "Reminder effective only for whoever has a heart or listens attentively", keys: ["50:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Earth breaking open for rapid gathering described as easy for Allah", keys: ["50:44"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creation of heavens, earth and between in six days without any weariness touching Us", keys: ["50:38"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Life and death dispensed by Us with return to Us as the destination", keys: ["50:43"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Prophet not a tyrant over them, his role limited to reminding whoever fears the threat", keys: ["50:45"], evidenceClass: "EXPLICIT_TEXT" });

  const sabr = findWord(39, ["\u0635","\u0628","\u0631"]);
  if (sabr) e.terminology.push({ term: sabr, transliteration: "sabr", gloss: "patience (editorial gloss)", keys: ["50:39"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `050-qaf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 050-qaf-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-050-p1,ext-050-p2,ext-050-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1608", label: "Oath by the honoured Quran framing the surah", def: "In 50:1: Qaf; by the honoured Quran.", key: "50:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Quran majid oath."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"related-not-identical",note:"Majid as divine attribute."}] },
  { id: "cand-1609", label: "Resurrection denied as distant despite divine retaining record", def: "In 50:3-4: When we have died and have become dust we will return to life? That is a distant return; We know what the earth diminishes of them and with Us is a retaining record.", key: "50:3", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Ba'id denial refuted."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Kitab hafiz preservation."}] },
  { id: "cand-1610", label: "Cosmic signs of structured heaven and productive earth as insight and reminder", def: "In 50:6-8: Have they not looked at the heaven above them how We structured it and adorned it and it has no rifts; and the earth We spread it out and cast therein firmly set mountains and made grow therein of every beautiful kind giving insight and a reminder for every servant who turns.", key: "50:6", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Samā' and arḍ as āyāt."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Tabṣirah wa-dhikrā function."}] },
  { id: "cand-1611", label: "Blessed rain reviving dead land as resurrection parallel", def: "In 50:9-11: And We have sent down blessed rain from the sky and made grow thereby gardens and grain from the harvest and lofty palm trees having fruit arranged in layers as provision for the servants and We have given life thereby to a dead land; thus is the resurrection.", key: "50:9", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Kadhalika al-khuruj analogy."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Rain-revival as ayah."}] },
  { id: "cand-1612", label: "Nine prior communities named as deniers with justly fulfilled threat", def: "In 50:12-14: The people of Noah denied before them and the companions of the well and Thamud and Aad and Pharaoh and the brothers of Lot and the companions of the thicket and the people of Tubba'; all denied the messengers so My threat was justly fulfilled.", key: "50:12", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Comprehensive denial catalogue."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Haqqa al-wa'id justice."}] },

  { id: "cand-1613", label: "Divine proximity closer than the jugular vein with soul-whispering known", def: "In 50:16: And We have already created man and know what his soul whispers to him and We are closer to him than his jugular vein.", key: "50:16", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Aqrab min habl al-warid."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Intimacy grounding awareness."}] },
  { id: "cand-1614", label: "Dual recording angels capturing every uttered word", def: "In 50:17-18: When the two receivers receive seated on the right and on the left; man does not utter any word except that with him is an observer prepared.", key: "50:17", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Al-mutaqabbilan recording."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Raqib 'atid surveillance."}] },
  { id: "cand-1615", label: "Cover removed and sight sharpened on the Day of threat", def: "In 50:22: You were certainly in unmindfulness of this and We have removed from you your cover so your sight this Day is sharp.", key: "50:22", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Kashf ghaṭā' revelation."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Ghaflah ended."}] },
  { id: "cand-1616", label: "Hell asking for more while Paradise brought near to the righteous", def: "In 50:30-31: On the Day We will say to Hell have you been filled and it will say are there some more; and Paradise will be brought near to the righteous not far.", key: "50:30", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Hal imtala't inquiry."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jannah proximity for muttaqin."}] },

  { id: "cand-1617", label: "Creation in six days without weariness affirming divine capacity", def: "In 50:38: And We did certainly create the heavens and earth and what is between them in six days and there touched Us no weariness.", key: "50:38", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Lā massanā nuṣūb negation."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Six-day creation as sign."}] },
  { id: "cand-1618", label: "Timed praise commanded alongside patience over their words", def: "In 50:39-40: So be patient over what they say and exalt with praise of your Lord before the rising of the sun and before its setting and in part of the night exalt Him and after prostration.", key: "50:39", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr paired with tasbih."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Four temporal stations of dhikr."}] },
  { id: "cand-1619", label: "Reminder by Quran limited to whoever fears the divine threat", def: "In 50:45: We are most knowing of what they say and you are not over them a tyrant; but remind by the Quran whoever fears My threat.", key: "50:45", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Dhakkir bi'l-Quran function."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Lasta 'alayhim bi-musaytir limitation."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 5).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(5, 9).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(9, 12).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `050-qaf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-074.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-074.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");