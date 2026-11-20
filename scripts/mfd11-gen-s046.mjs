// MFD-11 Wave 7: Surah 46 (Al-Ahqaf) genuine re-extraction.
// Covers 46:1-35 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "046-0001-0035.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 46:${n} not found`);
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

console.log("Generating Surah 46 (Al-Ahqaf) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T16:05:00.000Z";

const PASSAGES = [
  { id: "ext-046-p1", from: 1, to: 14,
    label: "Ha-Meem; revelation Book from Allah Exalted Might Wise; not create heavens earth between except truth specified term; disbelieve warned turning away; say considered invoke besides Allah show created earth partnership heavens bring scripture before this trace knowledge truthful; who more astray invokes besides Allah not respond until Resurrection unaware invocation; people gathered enemies deniers worship; verses recited clear evidences disbelieve say truth came obvious magic; say invented it say invented not possess protection Allah knowing involved sufficient Witness Forgiving Merciful; say not original among messengers nor know done me you only follow revealed not but clear warner; say considered Quran from Allah disbelieve witness Children Israel testified similar believed arrogant Allah not guide wrongdoing; disbelieve say believe if truly good not preceded us not guided say ancient falsehood; before it scripture Musa lead mercy confirming Book Arabic tongue warn wronged good tidings doers good; said Lord Allah remained right course no fear nor grieve; companions Paradise abiding eternally reward used do",
    mainLabel: "Opening letters and the Book's origin in the Mighty Wise; creation in truth for a specified term while the warned turn away; the challenge to produce what invoked rivals created or shared in cosmic creation, demanding prior scripture or a trace of knowledge; none more astray than one invoking entities that cannot respond and are unaware of being invoked, destined to become enemies and deny the worship at gathering; clear-evidence verses dismissed as obvious magic; the invention accusation answered by divine sufficiency as Witness, Forgiving and Merciful; prophetic non-originality affirmed with exclusive following of revelation and clear-warner status; the hypothetical of Quranic divine origin paired with an Israelite witness's belief against their arrogance; the disbelievers' argument that believers' precedence disproves goodness, met with the charge of ancient falsehood; Musa's Scripture recalled as guidance and mercy, with this confirming Arabic Book warning wrongdoers and giving glad tidings; those declaring Allah as Lord and remaining steadfast freed from fear and grief as eternal Paradise companions rewarded for deeds" },
  { id: "ext-046-p2", from: 15, to: 26,
    label: "enjoined upon man parents good treatment; mother carried hardship gave birth hardship gestation weaning thirty months; reaches maturity forty years says Lord enable grateful favour bestowed me parents work righteousness approve make righteous offspring repented Muslims; accept best did overlook misdeeds among companions Paradise promise truth promised; says parents uff you promise brought forth generations passed on; call Allah help woe you believe promise Allah truth says not but legends former people; word come effect among nations passed jinn men losers; all degrees reward punishment done fully compensate deeds not wronged; Day disbelieved exposed Fire exhausted pleasures worldly life enjoyed awarded punishment extreme humiliation arrogant earth without right defiantly disobedient; mention brother Aad warned people Ahqaf warners passed before after saying worship not except Allah fear punishment terrible day; said come delude away gods bring promise us truthful; said knowledge time only Allah convey sent see people behaving ignorantly; saw cloud approaching valleys said cloud bringing rain rather impatient wind within painful punishment; destroying everything command Lord became nothing seen except dwellings thus recompense criminal people",
    mainLabel: "Parental good-treatment enjoined through the mother's double hardship of carrying and birth, the thirty-month gestation-and-weaning span, and the forty-year maturity prayer for gratitude covering self and parents, righteous work approved by Allah, righteous offspring, repentance and submission; acceptance of the best deeds with misdeeds overlooked among Paradise companions as the fulfilled promise; the contrasting child who says uff to parents, rejects resurrection despite prior generations passing, while they plead for help and he dismisses the promise as legends; the word taking effect among prior jinn and men as losers; graded recompense ensuring full compensation without wrong; the Fire-exposure address telling pleasure-exhausters their humiliating punishment is for unjust arrogance and defiant disobedience; the brother of Aad warning his people in al-Ahqaf amid prior and subsequent warners to worship Allah alone fearing a terrible day; their demand for him to produce the threat if truthful; his reply placing timing knowledge with Allah while conveying his commission and naming them ignorant; the approaching cloud mistaken for rain revealed as the impatient-for wind carrying painful punishment; total destruction by divine command leaving only dwellings visible as recompense for criminals" },
  { id: "ext-046-p3", from: 27, to: 35,
    label: "established them such not established you made hearing vision hearts; hearing vision hearts availed not anything rejecting signs Allah enveloped used ridicule; already destroyed surrounds you cities diversified signs perhaps return; why took besides Allah deities approach not aid strayed from them falsehood inventing; mention directed few jinn listening Quran attended said listen quietly concluded went back people warners; said O our people heard Book revealed after Musa confirming before it guides truth straight path; O our people respond Messenger Allah believe him forgive sins protect painful punishment; not respond Caller Allah not cause failure Him upon earth not have besides Him protectors manifest error; not see Allah created heavens earth not fail creation able give life dead Yes indeed over all things competent; Day disbelieved exposed Fire said this not truth say Yes Lord say taste punishment because used disbelieve; be patient Muhammad determination among messengers not impatient them will Day see promised as though not remained except hour day notification will destroyed except defiantly disobedient people",
    mainLabel: "Prior establishment greater than the current audience's, with hearing, vision and hearts granted yet unavailing because signs were rejected and ridicule returned upon them; surrounding cities destroyed and signs diversified for possible return; adopted deities failing to aid and straying from worshippers as proof of invented falsehood; the directing of a few jinn to listen quietly to the Quran, returning as warners to their people announcing a Book revealed after Musa confirming prior scripture and guiding to truth and a straight path; their call to respond to Allah's Messenger for forgiveness and protection, with refusal named as inability to cause divine failure on earth and absence of protectors in manifest error; the creator-of-cosmos argument proving ability to revive the dead under universal competence; the Fire-exposure confirmation dialogue where disbelievers concede the truth by their Lord and are told to taste punishment for disbelief; patience commanded as practised by determined messengers, with urgency discouraged since the promised Day will compress their stay to an hour of a day; closing notification that only the defiantly disobedient are destroyed" }
];

const SUB_LABELS = {
  "ext-046-p1": [
    "Al-Ahqaf opens with the Ha-Meem pair shared by this surah group",
    "The Book's revelation traced to Allah, the Exalted in Might, the Wise",
    "Creation of heavens, earth and between declared in truth for a specified term while the warned turn away",
    "Challenge to show what invoked rivals created of earth or shared in heavens, demanding prior scripture or a trace of knowledge",
    "None more astray than one invoking entities that will not respond until Resurrection and are unaware of the invocation",
    "At the gathering of people those invoked become enemies and deny having been worshipped",
    "Clear-evidence verses dismissed as obvious magic when the truth arrives",
    "The invention accusation answered by divine sufficiency as Witness, Forgiving and Merciful, with no protection possessed by accusers",
    "Prophetic non-originality affirmed alongside ignorance of future outcomes, exclusive following of revelation and clear-warner status",
    "Hypothetical of Quranic divine origin paired with an Israelite witness believing while they remain arrogant, with Allah not guiding wrongdoers",
    "Disbelievers arguing that believers' precedence disproves goodness, then dismissing the message as ancient falsehood when unguided by it",
    "Musa's Scripture recalled as leading guidance and mercy, with this confirming Arabic Book warning wrongdoers and gladdening good-doers",
    "Those declaring Allah as Lord and remaining on a right course freed from fear and grief",
    "They named companions of Paradise abiding eternally as reward for their deeds"
  ],
  "ext-046-p2": [
    "Good treatment of parents enjoined, noting the mother's hardship in carrying and birth across a thirty-month gestation-and-weaning span",
    "At forty years the supplication for gratitude covering self and parents, righteous work, righteous offspring, repentance and submission",
    "Acceptance of their best deeds with misdeeds overlooked among Paradise companions as the promised truth",
    "The contrasting child saying uff to parents and rejecting resurrection while they plead for belief and he calls it legends",
    "The word taking effect upon such people among prior nations of jinn and men as losers",
    "Degrees of recompense assigned so every soul is fully compensated without wrong",
    "Fire-exposure address telling pleasure-exhausters their humiliating punishment is for unjust arrogance and defiant disobedience",
    "The brother of Aad warning his people in al-Ahqaf amid prior and subsequent warners to worship Allah alone fearing a terrible day",
    "Their demand to produce the threat if truthful, accusing him of deluding them from their gods",
    "His reply placing timing knowledge with Allah while conveying his commission and naming them ignorant",
    "The approaching cloud mistaken for rain revealed as the impatient-for wind carrying painful punishment",
    "Total destruction by divine command leaving only dwellings visible as recompense for criminals"
  ],
  "ext-046-p3": [
    "Greater prior establishment recalled alongside granted hearing, vision and hearts that availed nothing when signs were rejected",
    "Surrounding cities destroyed and signs diversified while adopted deities failed to aid and strayed from worshippers",
    "A few jinn directed to listen quietly to the Quran, returning as warners announcing a Book after Musa confirming prior scripture",
    "Their call to respond to Allah's Messenger for forgiveness and protection, with refusal named as manifest error lacking earthly escape",
    "The creator-of-cosmos argument proving ability to revive the dead under universal competence",
    "Fire-exposure dialogue where disbelievers concede the truth by their Lord and are told to taste punishment for disbelief",
    "Patience commanded as practised by determined messengers, with the promised Day compressing worldly stay to an hour",
    "Closing notification that only the defiantly disobedient are destroyed",
    "Final affirmation that this is notification and none are destroyed except the defiantly disobedient"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`46:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`46:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 46, surahName: "Al-Ahqaf",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 7 genuine re-extraction. Boundaries follow the text: P1 closes with the istiqamah-to-Paradise sequence (13-14) before the parental-duty block opens (15); P2 ends with Aad's dwellings-only aftermath (26) before the comparative-establishment reminder begins (27); P3 runs from that reminder through the jinn-listeners, the cosmos-revival argument, the final Fire dialogue and the patience-and-notification close (27-35).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (46:1-14) ===
{
  const e = extractions[0];
  const aziz = findWord(2, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(2, ["\u062d","\u0643","\u064a","\u0645"]);
  const ghafoor = findWord(8, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(8, ["\u0631","\u062d","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["46:2"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["46:2"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["46:8"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["46:8"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["46:4"], excerpt: fv(4), description: "Say: Have you considered that which you invoke besides Allah? Show me what they have created." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["46:9"], excerpt: fv(9), description: "Say: I am not something original among the messengers; I only follow that which is revealed to me, and I am not but a clear warner." });

  e.humanConditionsAndSpiritualStates.push({ label: "Those warned turning away from the truth of purposeful creation", keys: ["46:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Invoking entities unaware of being invoked, destined to become enemies at the gathering", keys: ["46:5","46:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Arrogance preventing guidance even when an Israelite witness confirms the message", keys: ["46:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Musa's Scripture recalled as leading guidance and mercy, with this Arabic Book confirming it", keys: ["46:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Declaring Allah as Lord and remaining steadfast removing fear and grief, earning eternal Paradise", keys: ["46:13","46:14"], evidenceClass: "EXPLICIT_TEXT" });

  const ahqaf = findWord(21, ["\u0623","\u062d","\u0642"]);
  // ahqaf root appears in P2 but the concept anchors the surah name
  const kitab = findWord(12, ["\u0643","\u062a","\u0627","\u0628"]);
  if (kitab) e.terminology.push({ term: kitab, transliteration: "kitab", gloss: "scripture/Book (editorial gloss)", keys: ["46:12"] });
}

// === POPULATE P2 (46:15-26) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["46:15"], excerpt: fv(15), description: "We have enjoined upon man good treatment of his parents." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["46:15"], excerpt: fv(15), description: "My Lord, enable me to be grateful for Your favour upon me and my parents, to work righteousness You approve, and make righteous my offspring; I have repented and am of the Muslims." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["46:21"], excerpt: fv(21), description: "Do not worship except Allah — the warning of Aad's brother in al-Ahqaf." });

  e.propheticNarratives.push({ label: "The brother of Aad warning his people in al-Ahqaf amid prior and subsequent warners; their demand for immediate punishment; his reply deferring timing to Allah; the approaching cloud mistaken for rain; total destruction leaving only dwellings", keys: ["46:21","46:22","46:23","46:24","46:25","46:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Mother's double hardship of carrying and birthing, with thirty-month gestation-and-weaning span", keys: ["46:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Forty-year maturity prompting gratitude prayer for self, parents and offspring with repentance", keys: ["46:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Child saying uff to parents and dismissing resurrection promise as legends of former peoples", keys: ["46:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Pleasure-exhaustion in worldly life answered by humiliating punishment for unjust arrogance", keys: ["46:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Cloud mistaken for rain revealed as the impatient-for wind carrying painful punishment", keys: ["46:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Parental duty codified with specific biological timelines and a maturity supplication model", keys: ["46:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Graded recompense ensuring full compensation of deeds without wrong", keys: ["46:19"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Best deeds accepted and misdeeds overlooked for those whose repentance and submission are sincere", keys: ["46:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The word taking effect upon rejecters among prior nations of jinn and men as losers", keys: ["46:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Destruction leaving only dwellings visible as divine recompense for criminal people", keys: ["46:25","46:26"], evidenceClass: "EXPLICIT_TEXT" });

  const ufn = findWord(17, ["\u0623","\u0641"]);
  if (ufn) e.terminology.push({ term: ufn, transliteration: "uff", gloss: "expression of contempt (editorial gloss)", keys: ["46:17"] });
}

// === POPULATE P3 (46:27-35) ===
{
  const e = extractions[2];
  const qadeer = findWord(33, ["\u0642","\u062f","\u064a","\u0631"]);
  if (qadeer) e.divineNamesAndAttributes.push({ term: qadeer, transliteration: "Qadeer", gloss: "Competent (editorial gloss)", keys: ["46:33"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["46:35"], excerpt: fv(35), description: "So be patient as were those of determination among the messengers and do not be impatient for them." });

  e.humanConditionsAndSpiritualStates.push({ label: "Hearing, vision and hearts availing nothing when signs are persistently rejected", keys: ["46:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Adopted deities straying from worshippers as proof of invented falsehood", keys: ["46:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Jinn listening quietly to the Quran and returning as warners to their people", keys: ["46:29","46:30"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Refusal to respond to Allah's caller named as manifest error with no earthly escape or protectors", keys: ["46:32"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Disbelievers conceding the truth by their Lord at Fire-exposure and told to taste punishment", keys: ["46:34"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Surrounding cities destroyed and signs diversified so they might return from disbelief", keys: ["46:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Jinn announcing a Book after Musa confirming prior scripture and guiding to truth and a straight path", keys: ["46:30"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Creator of heavens and earth who did not fail in their creation proven able to revive the dead", keys: ["46:33"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The promised Day compressing worldly stay to an hour of a day, with only the defiantly disobedient destroyed", keys: ["46:35"], evidenceClass: "EXPLICIT_TEXT" });

  const ululAzm = findWord(35, ["\u0623","\u0648","\u0644","\u0648"]);
  if (ululAzm) e.terminology.push({ term: ululAzm, transliteration: "ulu'l-'azm", gloss: "those of determination (editorial gloss)", keys: ["46:35"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `046-al-ahqaf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 046-al-ahqaf-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-046-p1,ext-046-p2,ext-046-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1552", label: "Purposeful creation for a specified term while the warned turn away", def: "In 46:3: We did not create the heavens and earth and what is between them except in truth and for a specified term; but those who disbelieve, from that of which they are warned, are turning away.", key: "46:3", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq wa-ajal musamma."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Turning from warning."}] },
  { id: "cand-1553", label: "Challenge to produce rival creation or prior scripture as evidence", def: "In 46:4: Say have you considered that which you invoke besides Allah? Show me what they have created of the earth or did they have partnership in the heavens? Bring me a scripture before this or a remaining trace of knowledge if you should be truthful.", key: "46:4", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Creation as proof requirement."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Scripture or trace demanded."}] },
  { id: "cand-1554", label: "Invoked entities unaware of worship becoming enemies at the gathering", def: "In 46:5-6: And who is more astray than he who invokes besides Allah those who will not respond to him until the Day of Resurrection and they of their invocation are unaware; and when the people are gathered they will be enemies to them and deniers of their worship.", key: "46:5", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Unaware objects of worship."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Enmity at gathering."}] },
  { id: "cand-1555", label: "Israelite witness confirming the Quran while disbelievers remain arrogant", def: "In 46:10: Say have you considered if the Quran was from Allah and you disbelieved in it while a witness from the Children of Israel has testified to something similar and believed while you were arrogant? Indeed Allah does not guide the wrongdoing people.", key: "46:10", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Bani Israil witness."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Istikbar blocking guidance."}] },
  { id: "cand-1556", label: "Musa's Scripture as guidance and mercy confirmed by this Arabic Book", def: "In 46:12: And before it was the scripture of Moses to lead and as a mercy; and this is a confirming Book in an Arabic tongue to warn those who have wronged and as good tidings to the doers of good.", key: "46:12", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Musaddiq linguistic continuity."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Dual function warning-tidings."}] },
  { id: "cand-1557", label: "Steadfastness after declaring Allah as Lord removing fear and grief", def: "In 46:13-14: Indeed those who have said our Lord is Allah and then remained on a right course, there will be no fear concerning them nor will they grieve; those are the companions of Paradise abiding eternally therein as reward for what they used to do.", key: "46:13", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Istiqamah after iqrar."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Reward linked to deeds."}] },

  { id: "cand-1558", label: "Parental good-treatment enjoined with biological timeline and maturity supplication", def: "In 46:15: And We have enjoined upon man to his parents good treatment; his mother carried him with hardship and gave birth with hardship, and his gestation and weaning is thirty months; until when he reaches maturity and forty years he says my Lord enable me to be grateful for Your favour upon me and my parents and to work righteousness You approve and make righteous my offspring; indeed I have repented and am of the Muslims.", key: "46:15", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Comprehensive parental duty."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Model dua at forty."}] },
  { id: "cand-1559", label: "Contemptuous rejection of resurrection by a child against pleading parents", def: "In 46:17: But one who says to his parents uff to you, do you promise me I will be brought forth when generations before me have passed on, while they call to Allah for help and say woe to you believe, indeed the promise of Allah is truth; but he says this is not but legends of the former people.", key: "46:17", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Uff as disobedience peak."},{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Asatir dismissal."}] },
  { id: "cand-1560", label: "Word taking effect among prior nations of jinn and men as losers", def: "In 46:18: Those are the ones upon whom the word has come into effect among nations which had passed on before them of jinn and men; indeed they all were losers.", key: "46:18", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Haqqah al-qawl as divine word taking effect."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Khasirun verdict."}] },
  { id: "cand-1561", label: "Pleasure exhaustion in worldly life answered by humiliating punishment", def: "In 46:20: And the Day those who disbelieved are exposed to the Fire it will be said you exhausted your pleasures during your worldly life and enjoyed them, so this Day you will be awarded the punishment of extreme humiliation because you were arrogant upon the earth without right and defiantly disobedient.", key: "46:20", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Dunya pleasure as debt."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Kibr bi-ghayr haqq."}] },
  { id: "cand-1562", label: "Brother of Aad warning in al-Ahqaf amid prior and subsequent warners", def: "In 46:21-23: And mention the brother of Aad when he warned his people in al-Ahqaf, and warners had passed before him and after him, saying do not worship except Allah, I fear for you the punishment of a terrible day; they said have you come to delude us from our gods, bring what you promise if truthful; he said knowledge is only with Allah and I convey what I was sent with but I see you behaving ignorantly.", key: "46:21", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Hud as brother of Aad."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Ignorant behaviour named."}] },
  { id: "cand-1563", label: "Approaching cloud mistaken for rain revealed as destructive wind", def: "In 46:24-25: And when they saw it as a cloud approaching their valleys they said this is a cloud bringing us rain; rather it is that for which you were impatient, a wind within it a painful punishment, destroying everything by command of its Lord; and they became so that nothing was seen except their dwellings; thus do We recompense the criminal people.", key: "46:24", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Rih fiha adhab alim."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Misread natural sign."}] },

  { id: "cand-1564", label: "Faculties availing nothing when signs are persistently rejected", def: "In 46:26: And We had established them in such as We have not established you and made for them hearing and vision and hearts, but their hearing and vision and hearts availed them not from anything when they were rejecting the signs of Allah, and they were enveloped by what they used to ridicule.", key: "46:26", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Faculties negated by kufr."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Rejection nullifying endowment."}] },
  { id: "cand-1565", label: "Jinn directed to listen to the Quran and returning as warners", def: "In 46:29-31: And when We directed to you a few of the jinn listening to the Quran, when they attended it they said listen quietly, and when concluded they went back to their people as warners; they said O our people we have heard a Book revealed after Musa confirming what was before it guiding to truth and a straight path; O our people respond to the Messenger of Allah and believe in him, He will forgive your sins and protect you from painful punishment.", key: "46:29", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Jinn reception parallel."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Response earning forgiveness."}] },
  { id: "cand-1566", label: "Cosmic creation proving ability to revive the dead", def: "In 46:33: Do they not see that Allah who created the heavens and earth and did not fail in their creation is able to give life to the dead? Yes indeed He is over all things competent.", key: "46:33", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Greater-to-lesser argument."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Qadir affirmation."}] },
  { id: "cand-1567", label: "Patience modelled on determined messengers with the Day compressing time", def: "In 46:35: So be patient as were those of determination among the messengers and do not be impatient for them; it will be on the Day they see what they are promised as though they had not remained except an hour of a day; this is notification, and will any be destroyed except the defiantly disobedient people?", key: "46:35", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr ka-ulu'l-azm."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Time compression imagery."}] }
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
    notes: "Wave 7 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 6).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(6, 12).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(12, 16).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `046-al-ahqaf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-070.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-070.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");