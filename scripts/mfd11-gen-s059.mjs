// MFD-11 Wave 9: Surah 59 (Al-Hashr) genuine re-extraction.
// Covers 59:1-24 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "059-0001-0024.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 59:${n} not found`);
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

console.log("Generating Surah 59 (Al-Hashr) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T17:55:00.000Z";

const PASSAGES = [
  { id: "ext-059-p1", from: 1, to: 5,
    label: "Whatever heavens earth exalts Allah Exalted Might Wise; He expelled disbelieving People Scripture homes first gathering you did not think they would leave they thought fortresses protect from Allah decree came unexpected cast terror hearts destroyed houses own hands believers hands take warning people vision; if not decreed evacuation punished world Hereafter punishment Fire; because opposed Allah Messenger whoever opposes severe penalty; palm trees cut down left standing trunks by permission Allah disgrace defiantly disobedient",
    mainLabel: "Universal tasbih affirming the Mighty Wise; the expulsion of disbelieving People of the Scripture from their homes at the first gathering, contrary to both sides' expectations since they trusted fortresses while the decree arrived unperceived and terror was cast into their hearts so they demolished their own houses alongside the believers — a warning addressed to people of vision; had evacuation not been decreed, worldly punishment would have struck with Fire awaiting hereafter; the cause named as opposition to Allah and His Messenger under severity of penalty; the cutting or sparing of palm trees declared to be by divine permission so the defiantly disobedient are disgraced" },
  { id: "ext-059-p2", from: 6, to: 10,
    label: "what Allah restored Messenger from them no horses camels spurred Allah gives messengers power whom wills over all competent; what restored Messenger people towns for Allah Messenger near relatives orphans needy stranded traveler not perpetual distribution among rich whatever Messenger given take forbidden refrain fear Allah severe penalty; poor emigrants expelled homes properties seeking bounty approval supporting Allah Messenger truthful; those settled Madinah faith before them love emigrants find no want breasts what given prefer over themselves though privation protected stinginess soul successful; those came after saying Lord forgive us brothers preceded faith put not hearts resentment toward believed Kind Merciful",
    mainLabel: "Property restored to the Messenger without any expedition of horses or camels, since Allah empowers His messengers over whom He wills under universal competence; the fay' of the towns allocated to Allah, the Messenger, near relatives, orphans, the needy and the stranded traveller so wealth does not circulate perpetually among the rich, with the command to accept what the Messenger gives and abstain from what he forbids under taqwa and severity of penalty; a share assigned to poor emigrants expelled from homes and properties seeking bounty and approval while supporting Allah and His Messenger, named the truthful; a share for the earlier settled believers of Madinah who love the emigrants, harbour no resentment over what they receive and prefer them despite their own privation, with success promised to whoever is guarded from his soul's stinginess; a share for later generations praying for forgiveness of themselves and their predecessors in faith and for hearts free of rancour toward believers, invoking the Kind and Merciful" },
  { id: "ext-059-p3", from: 11, to: 17,
    label: "hypocrites saying brothers disbelieved People Scripture if expelled leave with you not obey anyone regarding you if fought aid you Allah testifies liars; if expelled not leave if fought not aid even if aid turn backs then not aided; you more fearful breasts than Allah people not understand; not fight all except fortified cities behind walls violence among themselves severe think together hearts diverse people not reason; like example those shortly before tasted bad consequence affair painful punishment; hypocrites like Satan says man disbelieve when disbelieves says disassociated fear Allah Lord worlds; outcome both Fire abiding eternally recompense wrongdoers",
    mainLabel: "Hypocrites promising their disbelieving brethren among the People of the Scripture that they would leave with them, obey no one concerning them and aid them if attacked, while Allah testifies they lie; the prediction that they neither depart nor assist, and that any assistance ends in retreat leaving both unaided; the believers feared more than Allah within their breasts because they do not understand; their refusal to fight except from fortified cities or behind walls, severe internal violence and apparent unity masking divided hearts because they do not reason; comparison with those just before them who tasted the evil consequence of their affair and face painful punishment; the hypocrites likened to Satan who urges disbelief then disavows the disbeliever claiming fear of the Lord of the worlds, so both end in eternal Fire as the recompense of wrongdoers" },
  { id: "ext-059-p4", from: 18, to: 24,
    label: "O believed fear Allah let every soul look what put forth tomorrow fear Allah Acquainted what do; be not like those forgot Allah made forget themselves defiantly disobedient; not equal companions Fire companions Paradise attainers success; if sent Quran upon mountain seen humbled coming apart fear Allah examples presented perhaps give thought; He Allah no deity Knower unseen witnessed Entirely Merciful Especially Merciful; He Allah no deity Sovereign Pure Perfection Bestower Faith Overseer Exalted Might Compeller Superior exalted above associate; He Allah Creator Inventor Fashioner best names whatever heavens earth exalting Exalted Might Wise",
    mainLabel: "Believers commanded to fear Allah and let every soul examine what it has sent ahead for tomorrow, repeated under His acquaintance with their deeds; warning against resembling those who forgot Allah so He made them forget themselves, named defiantly disobedient; the inequality of Fire-companions and Paradise-companions, the latter being the attainers of success; the parable of a mountain humbling and splitting apart from fear of Allah had the Quran descended upon it, presented so people reflect; the closing name-sequence declaring Allah alone as deity, Knower of unseen and witnessed, Entirely and Especially Merciful, then Sovereign, Pure, Perfection, Bestower of Faith, Overseer, Mighty, Compeller and Superior exalted above association, then Creator, Inventor and Fashioner owning the best names with all creation exalting Him, the Mighty and Wise" }
];

const SUB_LABELS = {
  "ext-059-p1": [
    "Al-Hashr opens with creation's tasbih declaring Him Mighty and Wise before the expulsion account",
    "Expulsion of the disbelieving People of the Scripture at the first gathering, their fortresses failing as the decree arrived unperceived and terror drove them to demolish their own houses, a warning for people of vision",
    "Had evacuation not been decreed, worldly punishment would have struck with the Fire's punishment awaiting hereafter",
    "The cause named as opposition to Allah and His Messenger, with severity of penalty for whoever opposes",
    "Cutting or sparing palm trees declared to be by divine permission so the defiantly disobedient are disgraced"
  ],
  "ext-059-p2": [
    "Property restored to the Messenger without spurring horses or camels, since Allah empowers His messengers by will",
    "Fay' allocated to Allah, the Messenger, near relatives, orphans, the needy and the traveller so wealth does not circulate only among the rich, with obedience to his giving and forbidding commanded",
    "A share for poor emigrants expelled from homes and properties seeking bounty and approval while supporting Allah and His Messenger, named the truthful",
    "A share for the earlier settled believers who love the emigrants and prefer them despite privation, with success promised to whoever is guarded from his soul's stinginess",
    "A share for later generations praying for forgiveness of themselves and their predecessors and for hearts free of rancour toward believers"
  ],
  "ext-059-p3": [
    "Hypocrites promising departure, refusal to obey anyone and military aid to their disbelieving brethren, while Allah testifies they lie",
    "The prediction that they neither depart nor assist, and any assistance ends in retreat leaving both unaided",
    "The believers feared more than Allah within their breasts because they are a people who do not understand",
    "Refusal to fight except from fortified cities or behind walls, severe internal violence and apparent unity masking divided hearts",
    "Comparison with those shortly before them who tasted the evil consequence of their affair and face painful punishment",
    "The hypocrites likened to Satan who urges disbelief then disavows the disbeliever claiming fear of the Lord of the worlds",
    "Both ending in eternal Fire as the recompense of the wrongdoers"
  ],
  "ext-059-p4": [
    "Believers commanded to fear Allah and let every soul examine what it has sent ahead for tomorrow",
    "Warning against resembling those who forgot Allah so He made them forget themselves, named defiantly disobedient",
    "Inequality of Fire-companions and Paradise-companions, the latter being the attainers of success",
    "The parable of a mountain humbling and splitting from fear of Allah had the Quran descended upon it, presented for reflection",
    "Allah alone as deity, Knower of the unseen and the witnessed, the Entirely Merciful, the Especially Merciful",
    "The name-sequence of Sovereign, Pure, Perfection, Bestower of Faith, Overseer, Mighty, Compeller and Superior, exalted above association",
    "Creator, Inventor and Fashioner owning the best names, with all creation exalting Him, the Exalted in Might, the Wise"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`59:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`59:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 59, surahName: "Al-Hashr",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the palm-tree permission ruling (5) before the fay' distribution block opens (6); P2 ends with the later-generations supplication (10) before the hypocrite-alliance critique begins (11); P3 runs through their broken promises, the Satan parable and the shared Fire outcome (11-17); P4 covers the self-examination command, the forgetting warning, the mountain parable and the closing divine-name sequence (18-24).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (59:1-5) ===
{
  const e = extractions[0];
  const aziz = findWord(1, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(1, ["\u062d","\u0643","\u064a","\u0645"]);
  const shadid = findWord(4, ["\u0634","\u062f","\u064a","\u062f"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["59:1"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["59:1"] });
  if (shadid) e.divineNamesAndAttributes.push({ term: shadid, transliteration: "Shadid al-iqab", gloss: "severe in penalty (editorial gloss)", keys: ["59:4"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["59:2"], excerpt: fv(2), description: "So take warning, O people of vision." });

  e.humanConditionsAndSpiritualStates.push({ label: "Confidence in fortresses shattered by an unperceived decree and terror cast into hearts", keys: ["59:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Expulsion from homes at the first gathering with houses demolished by their own hands and the believers'", keys: ["59:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Cutting or sparing palm trees permitted by Allah to disgrace the defiantly disobedient", keys: ["59:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Evacuation decreed in place of immediate worldly punishment, with Fire reserved for the Hereafter", keys: ["59:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Opposition to Allah and His Messenger named as the cause of their penalty", keys: ["59:4"], evidenceClass: "EXPLICIT_TEXT" });

  const hashr = findWord(2, ["\u062d","\u0634","\u0631"]);
  if (hashr) e.terminology.push({ term: hashr, transliteration: "hashr", gloss: "gathering/expulsion (editorial gloss)", keys: ["59:2"] });
}

// === POPULATE P2 (59:6-10) ===
{
  const e = extractions[1];
  const qadeer = findWord(6, ["\u0642","\u062f","\u064a","\u0631"]);
  const raoof = findWord(10, ["\u0631","\u0621","\u0648","\u0641"]);
  const raheem = findWord(10, ["\u0631","\u062d","\u064a","\u0645"]);
  if (qadeer) e.divineNamesAndAttributes.push({ term: qadeer, transliteration: "Qadeer", gloss: "Competent (editorial gloss)", keys: ["59:6"] });
  if (raoof) e.divineNamesAndAttributes.push({ term: raoof, transliteration: "Ra'oof", gloss: "Kind (editorial gloss)", keys: ["59:10"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["59:10"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["59:7"], excerpt: fv(7), description: "Whatever the Messenger has given you take, and what he has forbidden you refrain from, and fear Allah." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["59:10"], excerpt: fv(10), description: "Our Lord, forgive us and our brothers who preceded us in faith and put not in our hearts any resentment toward those who have believed." });

  e.humanConditionsAndSpiritualStates.push({ label: "Poor emigrants seeking bounty and approval while supporting Allah and His Messenger, named the truthful", keys: ["59:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Ansar preferring emigrants over themselves despite privation, with no resentment in their breasts", keys: ["59:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Protection from the soul's stinginess named as the mark of the successful", keys: ["59:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Fay' distributed to defined categories so wealth does not circulate perpetually among the rich", keys: ["59:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Three-tier allocation covering emigrants, earlier settled believers and later generations", keys: ["59:8","59:9","59:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Property restored without military expedition since Allah empowers His messengers by will", keys: ["59:6"], evidenceClass: "EXPLICIT_TEXT" });

  const fay = findWord(6, ["\u0623","\u0641","\u0627"]);
  if (fay) e.terminology.push({ term: fay, transliteration: "fay'", gloss: "property restored without fighting (editorial gloss)", keys: ["59:6"] });
  const shuhh = findWord(9, ["\u0634","\u062d"]);
  if (shuhh) e.terminology.push({ term: shuhh, transliteration: "shuhh al-nafs", gloss: "stinginess of the soul (editorial gloss)", keys: ["59:9"] });
}

// === POPULATE P3 (59:11-17) ===
{
  const e = extractions[2];

  e.humanConditionsAndSpiritualStates.push({ label: "Hypocrites promising support they will never deliver, testified liars by Allah", keys: ["59:11","59:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Believers feared more than Allah within their breasts due to lack of understanding", keys: ["59:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Apparent unity masking diverse hearts with severe internal violence", keys: ["59:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Fighting confined to fortified cities and behind walls", keys: ["59:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Comparison with those shortly before who tasted the evil consequence of their affair", keys: ["59:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Satan urging disbelief then disavowing the disbeliever, both ending in eternal Fire", keys: ["59:16","59:17"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P4 (59:18-24) ===
{
  const e = extractions[3];
  const khabir = findWord(18, ["\u062e","\u0628","\u064a","\u0631"]);
  const rahman = findWord(22, ["\u0631","\u062d","\u0645","\u0646"]);
  const rahim = findWord(22, ["\u0631","\u062d","\u064a","\u0645"]);
  const malik = findWord(23, ["\u0645","\u0644","\u0643"]);
  const quddus = findWord(23, ["\u0642","\u062f","\u0648","\u0633"]);
  const salam = findWord(23, ["\u0633","\u0644","\u0627","\u0645"]);
  const mumin = findWord(23, ["\u0645","\u0624","\u0645","\u0646"]);
  const muhaymin = findWord(23, ["\u0645","\u0647","\u064a","\u0645","\u0646"]);
  const jabbar = findWord(23, ["\u062c","\u0628","\u0627","\u0631"]);
  const mutakabbir = findWord(23, ["\u0645","\u062a","\u0643","\u0628","\u0631"]);
  const khaliq = findWord(24, ["\u062e","\u0627","\u0644","\u0642"]);
  const bari = findWord(24, ["\u0628","\u0627","\u0631","\u0626"]);
  const musawwir = findWord(24, ["\u0645","\u0635","\u0648","\u0631"]);
  if (khabir) e.divineNamesAndAttributes.push({ term: khabir, transliteration: "Khabir", gloss: "Acquainted (editorial gloss)", keys: ["59:18"] });
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Entirely Merciful (editorial gloss)", keys: ["59:22"] });
  if (rahim) e.divineNamesAndAttributes.push({ term: rahim, transliteration: "Raheem", gloss: "Especially Merciful (editorial gloss)", keys: ["59:22"] });
  if (malik) e.divineNamesAndAttributes.push({ term: malik, transliteration: "Malik", gloss: "Sovereign (editorial gloss)", keys: ["59:23"] });
  if (quddus) e.divineNamesAndAttributes.push({ term: quddus, transliteration: "Quddus", gloss: "Pure (editorial gloss)", keys: ["59:23"] });
  if (salam) e.divineNamesAndAttributes.push({ term: salam, transliteration: "Salam", gloss: "Perfection (editorial gloss)", keys: ["59:23"] });
  if (mumin) e.divineNamesAndAttributes.push({ term: mumin, transliteration: "Mu'min", gloss: "Bestower of Faith (editorial gloss)", keys: ["59:23"] });
  if (muhaymin) e.divineNamesAndAttributes.push({ term: muhaymin, transliteration: "Muhaymin", gloss: "Overseer (editorial gloss)", keys: ["59:23"] });
  if (jabbar) e.divineNamesAndAttributes.push({ term: jabbar, transliteration: "Jabbar", gloss: "Compeller (editorial gloss)", keys: ["59:23"] });
  if (mutakabbir) e.divineNamesAndAttributes.push({ term: mutakabbir, transliteration: "Mutakabbir", gloss: "Superior (editorial gloss)", keys: ["59:23"] });
  if (khaliq) e.divineNamesAndAttributes.push({ term: khaliq, transliteration: "Khaliq", gloss: "Creator (editorial gloss)", keys: ["59:24"] });
  if (bari) e.divineNamesAndAttributes.push({ term: bari, transliteration: "Bari", gloss: "Inventor (editorial gloss)", keys: ["59:24"] });
  if (musawwir) e.divineNamesAndAttributes.push({ term: musawwir, transliteration: "Musawwir", gloss: "Fashioner (editorial gloss)", keys: ["59:24"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["59:18"], excerpt: fv(18), description: "O you who have believed, fear Allah, and let every soul look to what it has put forth for tomorrow." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["59:19"], excerpt: fv(19), description: "Be not like those who forgot Allah so He made them forget themselves." });

  e.humanConditionsAndSpiritualStates.push({ label: "Forgetting Allah answered by being made to forget oneself", keys: ["59:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Paradise-companions named the attainers of success against Fire-companions", keys: ["59:20"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Every soul examining what it has sent ahead for tomorrow under divine acquaintance", keys: ["59:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Mountain parable: the Quran would humble and split it from fear of Allah, presented for reflection", keys: ["59:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Closing name-sequence with all creation exalting Him and the best names belonging to Him", keys: ["59:22","59:23","59:24"], evidenceClass: "EXPLICIT_TEXT" });

  const husna = findWord(24, ["\u062d","\u0633","\u0646","\u0649"]);
  if (husna) e.terminology.push({ term: husna, transliteration: "al-asma al-husna", gloss: "the best names (editorial gloss)", keys: ["59:24"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `059-al-hashr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 059-al-hashr-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-059-p1,ext-059-p2,ext-059-p3,ext-059-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1716", label: "Fortress confidence shattered by an unperceived decree and cast terror", def: "In 59:2: It is He who expelled the ones who disbelieved among the People of the Scripture from their homes at the first gathering; you did not think they would leave and they thought their fortresses would protect them from Allah, but the decree of Allah came upon them from where they had not expected and He cast terror into their hearts so they destroyed their houses by their own hands and the hands of the believers; so take warning, O people of vision.", key: "59:2", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Decree arriving unperceived."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"I'tibar for uli al-absar."}] },
  { id: "cand-1717", label: "Evacuation decreed in place of immediate worldly punishment", def: "In 59:3: And if not that Allah had decreed for them evacuation He would have punished them in this world, and for them in the Hereafter is the punishment of the Fire.", key: "59:3", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Kataba al-jala'."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Worldly versus hereafter penalty."}] },

  { id: "cand-1718", label: "Fay' distributed to defined categories preventing wealth concentration", def: "In 59:7: And what Allah restored to His Messenger from the people of the towns is for Allah and for the Messenger and for his near relatives and orphans and the needy and the stranded traveler, so that it will not be a perpetual distribution among the rich from among you; and whatever the Messenger has given you take and what he has forbidden you refrain from.", key: "59:7", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Anti-concentration distribution rule."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Orphans needy traveller categories."}] },
  { id: "cand-1719", label: "Ansar preference for emigrants despite privation and protection from soul-stinginess", def: "In 59:9: And also for those who were settled in al-Madinah and adopted the faith before them; they love those who emigrated to them and find not any want in their breasts of what the emigrants were given but give them preference over themselves even though they are in privation; and whoever is protected from the stinginess of his soul, it is those who will be the successful.", key: "59:9", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ithar ala al-nafs."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Muhajir-Ansar bond."}] },
  { id: "cand-1720", label: "Later generations praying for predecessors and hearts free of rancour", def: "In 59:10: And there is a share for those who came after them saying our Lord forgive us and our brothers who preceded us in faith and put not in our hearts any resentment toward those who have believed; our Lord indeed You are Kind and Merciful.", key: "59:10", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Taught intergenerational dua."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghill removed from hearts."}] },

  { id: "cand-1721", label: "Hypocrite promises of support exposed as lies by divine testimony", def: "In 59:11-12: Have you not considered those who practice hypocrisy saying to their brothers who disbelieved among the People of the Scripture if you are expelled we will surely leave with you and if you are fought we will surely aid you, but Allah testifies that they are liars; if they are expelled they will not leave with them and if they are fought they will not aid them.", key: "59:11", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Nifaq exposed by prediction."},{topicId:"evidence-standards",layer:"scholarly",relationship:"related-not-identical",note:"Divine testimony against claims."}] },
  { id: "cand-1722", label: "Apparent unity masking divided hearts with fear of believers exceeding fear of Allah", def: "In 59:13-14: You are more fearful within their breasts than Allah, that is because they are a people who do not understand; they will not fight you all except within fortified cities or from behind walls, their violence among themselves is severe, you think they are together but their hearts are diverse.", key: "59:13", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"La yafqahun and la ya'qilun."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"related-not-identical",note:"Shatta hearts contrasted with unity."}] },
  { id: "cand-1723", label: "Satan urging disbelief then disavowing the disbeliever", def: "In 59:16-17: The hypocrites are like the example of Satan when he says to man disbelieve, but when he disbelieves he says indeed I am disassociated from you, indeed I fear Allah Lord of the worlds; so the outcome for both of them is that they will be in the Fire abiding eternally therein.", key: "59:16", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Tabarru' after incitement."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Both parties bear the outcome."}] },

  { id: "cand-1724", label: "Self-examination for tomorrow commanded under divine acquaintance", def: "In 59:18: O you who have believed fear Allah, and let every soul look to what it has put forth for tomorrow, and fear Allah; indeed Allah is Acquainted with what you do.", key: "59:18", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Muhasabah for the morrow."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Taqwa repeated twice."}] },
  { id: "cand-1725", label: "Forgetting Allah answered by being made to forget oneself", def: "In 59:19: And be not like those who forgot Allah so He made them forget themselves; those are the defiantly disobedient.", key: "59:19", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Nasiya Allah reciprocal loss."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Self-alienation as consequence."}] },
  { id: "cand-1726", label: "Mountain parable illustrating the Quran's weight against hardened hearts", def: "In 59:21: If We had sent down this Quran upon a mountain you would have seen it humbled and coming apart from fear of Allah; and these examples We present to the people that perhaps they will give thought.", key: "59:21", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Weight of revelation illustrated."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Amthal for tafakkur."}] },
  { id: "cand-1727", label: "Closing divine-name sequence culminating in the best names", def: "In 59:22-24: He is Allah other than whom there is no deity, Knower of the unseen and the witnessed, the Entirely Merciful the Especially Merciful; He is Allah other than whom there is no deity, the Sovereign the Pure the Perfection the Bestower of Faith the Overseer the Exalted in Might the Compeller the Superior; He is Allah the Creator the Inventor the Fashioner, to Him belong the best names.", key: "59:22", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Densest name cluster in the Quran."},{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Attribute affirmation with transcendence."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 8).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(8, 12).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `059-al-hashr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-083.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-083.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
