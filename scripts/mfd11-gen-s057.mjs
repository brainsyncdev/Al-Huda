// MFD-11 Wave 9: Surah 57 (Al-Hadid) genuine re-extraction.
// Covers 57:1-29 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "057-0001-0029.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 57:${n} not found`);
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

console.log("Generating Surah 57 (Al-Hadid) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T17:35:00.000Z";

const PASSAGES = [
  { id: "ext-057-p1", from: 1, to: 6,
    label: "Whatever heavens earth exalts Allah Exalted Might Wise; His dominion heavens earth gives life causes death over all competent; First Last Ascendant Intimate of all Knowing; created heavens earth six days established above Throne knows penetrates earth emerges descends heaven ascends with you wherever Seeing; His dominion heavens earth to Allah returned matters; causes night enter day day enter night Knowing within breasts",
    mainLabel: "Universal tasbih of all in heavens and earth affirming the Mighty Wise; cosmic dominion joined to giving life and causing death under universal competence; the four paired names — First and Last, Ascendant and Intimate — sealed by complete knowledge; creation in six days followed by establishment above the Throne, with knowledge of what penetrates and emerges from the earth and what descends and ascends in heaven, accompanied by His being with them wherever they are and seeing their deeds; dominion reaffirmed with all matters returning to Him; the mutual entering of night into day and day into night closing with knowledge of what the breasts contain" },
  { id: "ext-057-p2", from: 7, to: 15,
    label: "Believe Allah Messenger spend out made successors believed spent great reward; why not believe Messenger invites believe Lord taken covenant truly believers; sends down Servant verses clear evidence bring darknesses light Kind Merciful; why not spend cause Allah heritage heavens earth not equal spent before conquest fought after greater degree all promised best Acquainted; who loan Allah goodly loan multiply noble reward; Day believing men women light proceeding before right good tidings gardens rivers abide eternally great attainment; hypocrite men women say wait acquire light go back behind seek light wall placed door interior mercy outside torment; hypocrites call were we not with you yes afflicted yourselves awaited doubted wishful thinking deluded command came Deceiver deceived concerning Allah; today no ransom taken you disbelieved refuge Fire most worthy wretched destination",
    mainLabel: "Belief in Allah and His Messenger joined to spending from what He made them successors over, with great reward for believing spenders; the rebuke for not believing while the Messenger invites and the covenant already stands; clear-evidence verses sent upon the Servant to bring them from darknesses into light under kindness and mercy; the rebuke for not spending while cosmic heritage belongs to Allah, with pre-conquest spenders and fighters ranked above later ones though all are promised the best; the goodly-loan offer multiplied into noble reward; the Day when believing men and women have light proceeding before them and on their right with tidings of eternal rivered gardens as great attainment; hypocrites of both sexes asking to borrow light, told to seek it behind them, separated by a wall whose inner side holds mercy and outer side torment; their claim of having been with the believers answered by self-affliction, waiting, doubt and deluding wishful thinking until the command came and the Deceiver deceived them about Allah; no ransom accepted from them or the disbelievers, the Fire named their fitting refuge and wretched destination" },
  { id: "ext-057-p3", from: 16, to: 24,
    label: "time not come believed hearts humbly submissive remembrance Allah come down truth not like given Scripture before long period passed hearts hardened many defiantly disobedient; know Allah gives life earth lifelessness made clear signs perhaps understand; men charity women charity loaned goodly loan multiplied noble reward; believed Allah messengers supporters truth martyrs with Lord reward light disbelieved denied verses companions Hellfire; know worldly life amusement diversion adornment boasting competition wealth children like rain plant growth pleases tillers dries yellow debris Hereafter severe punishment forgiveness approval enjoyment delusion; race toward forgiveness Garden width heavens earth prepared believed Allah messengers bounty gives wills possessor great bounty; no disaster earth among except register before bring being easy; not despair eluded not exult given not like self-deluded boastful; stingy enjoin stinginess turns away Allah Free need Praiseworthy",
    mainLabel: "The question whether the time has come for believers' hearts to humble at Allah's remembrance and the descended truth, warning against resembling earlier Scripture-recipients whose hearts hardened over a long period until many became defiantly disobedient; the revival of dead earth offered as clarified sign inviting understanding; charitable men and women who lend the goodly loan receiving multiplication and noble reward; believers in Allah and His messengers ranked as supporters of truth and martyrs with reward and light, against deniers as Hellfire companions; worldly life exposed as amusement, diversion, adornment, mutual boasting and competition in wealth and children, likened to rain-fed growth that pleases tillers then yellows into debris, while the Hereafter holds severe punishment or forgiveness and approval; racing urged toward forgiveness and a Garden as wide as heavens and earth prepared for believers, as bounty given by will; every disaster recorded in a register before its occurrence, declared easy for Allah, so that they neither despair over loss nor exult over gifts, since Allah dislikes the self-deluded and boastful; stinginess and its enforcement condemned, with divine independence and praiseworthiness affirmed against whoever turns away" },
  { id: "ext-057-p4", from: 25, to: 29,
    label: "sent messengers clear evidences sent down Scripture balance people maintain justice sent down iron great military might benefits make evident support Him messengers unseen Powerful Exalted Might; sent Noah Abraham placed descendants prophethood scripture guided many defiantly disobedient; sent following footsteps messengers followed Jesus son Mary gave Gospel placed hearts followers compassion mercy monasticism innovated not prescribed except seeking approval not observe due observance gave believed reward many defiantly disobedient; O believed fear Allah believe Messenger double portion mercy light walk forgive Forgiving Merciful; People Scripture know not able obtain anything bounty all bounty hand Allah gives wills possessor great bounty",
    mainLabel: "Messengers sent with clear evidences alongside Scripture and the balance so people maintain justice; iron sent down containing great military might and human benefits, so that Allah may make evident those supporting Him and His messengers unseen, under power and might; Noah and Abraham sent with prophethood and scripture placed among their descendants, some guided but many defiantly disobedient; subsequent messengers followed by Jesus son of Mary given the Gospel, with compassion and mercy placed in his followers' hearts alongside monasticism they innovated seeking approval without it being prescribed, which they failed to observe properly, so believers among them received reward while many remained defiantly disobedient; believers commanded to fear Allah and believe His Messenger for a double portion of mercy, a walking light and forgiveness; the whole framed so the People of the Scripture know they cannot monopolise divine bounty, which rests wholly in Allah's hand given by will as possessor of great bounty" }
];

const SUB_LABELS = {
  "ext-057-p1": [
    "All in heavens and earth exalting Allah, the Exalted in Might, the Wise",
    "Cosmic dominion joined to giving life and causing death under universal competence",
    "The First and the Last, the Ascendant and the Intimate, Knowing of all things",
    "Creation in six days and establishment above the Throne, with knowledge of all penetration, emergence, descent and ascent, and His presence wherever they are",
    "Dominion reaffirmed with all matters returning to Allah",
    "Night caused to enter day and day to enter night, with knowledge of what the breasts contain"
  ],
  "ext-057-p2": [
    "Belief in Allah and His Messenger joined to spending from what He made them successors over, with great reward",
    "Rebuke for not believing while the Messenger invites and the covenant already stands",
    "Clear-evidence verses sent upon the Servant to bring them from darknesses into light under kindness and mercy",
    "Rebuke for not spending while cosmic heritage is His, with pre-conquest spenders and fighters ranked higher though all promised the best",
    "The goodly-loan offer multiplied into a noble reward",
    "Believing men and women with light proceeding before them and on their right, given tidings of eternal rivered gardens",
    "Hypocrites of both sexes asking to borrow light, told to seek it behind them, separated by a wall holding mercy inside and torment outside",
    "Their claim of having been with the believers answered by self-affliction, waiting, doubt and deluding wishful thinking until the Deceiver deceived them",
    "No ransom accepted from hypocrites or disbelievers, the Fire named their fitting refuge and wretched destination"
  ],
  "ext-057-p3": [
    "The question whether the time has come for hearts to humble at remembrance, warning against the hardening of earlier Scripture-recipients",
    "Revival of the dead earth offered as clarified sign inviting understanding",
    "Charitable men and women lending the goodly loan receiving multiplication and noble reward",
    "Believers ranked as supporters of truth and martyrs with reward and light, against deniers as Hellfire companions",
    "Worldly life exposed as amusement, boasting and competition, likened to rain-fed growth yellowing into debris, against the Hereafter's punishment or forgiveness",
    "Racing urged toward forgiveness and a Garden as wide as heavens and earth, as bounty given by will",
    "Every disaster recorded in a register before its occurrence, declared easy for Allah",
    "Purpose stated: neither despair over loss nor exult over gifts, since Allah dislikes the self-deluded and boastful",
    "Stinginess and its enforcement condemned, with divine independence and praiseworthiness against whoever turns away"
  ],
  "ext-057-p4": [
    "Messengers sent with clear evidences, Scripture and the balance for justice, and iron sent down with military might and benefits to reveal unseen supporters",
    "Noah and Abraham sent with prophethood and scripture among their descendants, some guided but many defiantly disobedient",
    "Jesus given the Gospel with compassion and mercy in his followers' hearts, and self-innovated monasticism they failed to observe properly",
    "Believers commanded to fear Allah and believe His Messenger for a double portion of mercy, a walking light and forgiveness",
    "The People of the Scripture brought to know that all bounty rests in Allah's hand, given by will"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`57:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`57:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 57, surahName: "Al-Hadid",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the night-day interpenetration and breast-knowledge (6) before the belief-and-spending commission opens (7); P2 ends with the hypocrites' refused ransom (15) before the heart-humbling question begins (16); P3 runs through charity, worldly-life critique, the race command, the disaster register and stinginess (16-24); P4 covers the messengers-Scripture-balance-iron commission, the prophetic chain including Isa's followers, and the closing bounty-in-Allah's-hand declaration (25-29).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (57:1-6) ===
{
  const e = extractions[0];
  const aziz = findWord(1, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(1, ["\u062d","\u0643","\u064a","\u0645"]);
  const awwal = findWord(3, ["\u0623","\u0648","\u0644"]);
  const akhir = findWord(3, ["\u0622","\u062e","\u0631"]);
  const zahir = findWord(3, ["\u0638","\u0627","\u0647","\u0631"]);
  const batin = findWord(3, ["\u0628","\u0627","\u0637","\u0646"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["57:1"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["57:1"] });
  if (awwal) e.divineNamesAndAttributes.push({ term: awwal, transliteration: "Awwal", gloss: "the First (editorial gloss)", keys: ["57:3"] });
  if (akhir) e.divineNamesAndAttributes.push({ term: akhir, transliteration: "Akhir", gloss: "the Last (editorial gloss)", keys: ["57:3"] });
  if (zahir) e.divineNamesAndAttributes.push({ term: zahir, transliteration: "Zahir", gloss: "the Ascendant (editorial gloss)", keys: ["57:3"] });
  if (batin) e.divineNamesAndAttributes.push({ term: batin, transliteration: "Batin", gloss: "the Intimate (editorial gloss)", keys: ["57:3"] });

  e.relationships.push({ label: "Universal tasbih of all in heavens and earth", keys: ["57:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Knowledge of what penetrates and emerges from the earth and what descends and ascends in heaven, with His presence wherever they are", keys: ["57:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Night caused to enter day and day to enter night under knowledge of the breasts", keys: ["57:6"], evidenceClass: "EXPLICIT_TEXT" });

  const istawa = findWord(4, ["\u0627","\u0633","\u062a","\u0648","\u0649"]);
  if (istawa) e.terminology.push({ term: istawa, transliteration: "istawa ala al-arsh", gloss: "established Himself above the Throne (editorial gloss)", keys: ["57:4"] });
}

// === POPULATE P2 (57:7-15) ===
{
  const e = extractions[1];
  const raof = findWord(9, ["\u0631","\u0621","\u0648","\u0641"]);
  const raheem = findWord(9, ["\u0631","\u062d","\u064a","\u0645"]);
  if (raof) e.divineNamesAndAttributes.push({ term: raof, transliteration: "Ra'oof", gloss: "Kind (editorial gloss)", keys: ["57:9"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["57:9"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["57:7"], excerpt: fv(7), description: "Believe in Allah and His Messenger and spend out of that in which He has made you successors." });

  e.humanConditionsAndSpiritualStates.push({ label: "Pre-conquest spending and fighting ranked above later spending and fighting", keys: ["57:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Light proceeding before believers and on their right on the Day", keys: ["57:12"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hypocrites asking to borrow light and being told to seek it behind them", keys: ["57:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Self-affliction, waiting, doubt and deluding wishful thinking named as the hypocrites' failure", keys: ["57:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Spending framed as stewardship over what Allah made them successors in", keys: ["57:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "The goodly loan multiplied with a noble reward", keys: ["57:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Clear-evidence verses bringing believers out of darknesses into light", keys: ["57:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "A wall placed between believers and hypocrites with mercy inside and torment outside", keys: ["57:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No ransom accepted from hypocrites or disbelievers, the Fire named their fitting refuge", keys: ["57:15"], evidenceClass: "EXPLICIT_TEXT" });

  const qard = findWord(11, ["\u0642","\u0631","\u0636"]);
  if (qard) e.terminology.push({ term: qard, transliteration: "qard hasan", gloss: "goodly loan (editorial gloss)", keys: ["57:11"] });
}

// === POPULATE P3 (57:16-24) ===
{
  const e = extractions[2];
  const ghani = findWord(24, ["\u063a","\u0646","\u064a"]);
  const hameed = findWord(24, ["\u062d","\u0645","\u064a","\u062f"]);
  if (ghani) e.divineNamesAndAttributes.push({ term: ghani, transliteration: "Ghani", gloss: "Free of need (editorial gloss)", keys: ["57:24"] });
  if (hameed) e.divineNamesAndAttributes.push({ term: hameed, transliteration: "Hameed", gloss: "Praiseworthy (editorial gloss)", keys: ["57:24"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["57:21"], excerpt: fv(21), description: "Race toward forgiveness from your Lord and a Garden whose width is like the width of the heavens and earth." });

  e.humanConditionsAndSpiritualStates.push({ label: "Hearts humbling at remembrance contrasted with the hardening of earlier Scripture-recipients over time", keys: ["57:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Believers in Allah and His messengers ranked as supporters of truth and martyrs with reward and light", keys: ["57:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Neither despairing over loss nor exulting over gifts as the purpose of the pre-written disaster register", keys: ["57:22","57:23"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Charitable men and women lending the goodly loan for multiplication and noble reward", keys: ["57:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Worldly life as amusement, adornment, boasting and competition in wealth and children, likened to yellowing crops", keys: ["57:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Stinginess and enjoining stinginess upon others condemned", keys: ["57:24"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Allah giving life to the earth after its lifelessness as clarified sign", keys: ["57:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Every disaster written in a register before being brought into being, easy for Allah", keys: ["57:22"], evidenceClass: "EXPLICIT_TEXT" });

  const siddiqun = findWord(19, ["\u0635","\u062f","\u064a","\u0642"]);
  if (siddiqun) e.terminology.push({ term: siddiqun, transliteration: "siddiqun", gloss: "supporters of truth (editorial gloss)", keys: ["57:19"] });
}

// === POPULATE P4 (57:25-29) ===
{
  const e = extractions[3];
  const qawi = findWord(25, ["\u0642","\u0648","\u064a"]);
  const ghafoor = findWord(28, ["\u063a","\u0641","\u0648","\u0631"]);
  if (qawi) e.divineNamesAndAttributes.push({ term: qawi, transliteration: "Qawi", gloss: "Powerful (editorial gloss)", keys: ["57:25"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["57:28"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["57:28"], excerpt: fv(28), description: "O you who have believed, fear Allah and believe in His Messenger." });

  e.propheticNarratives.push({ label: "Noah and Abraham sent with prophethood and scripture placed among their descendants", keys: ["57:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Jesus son of Mary given the Gospel; compassion and mercy placed in his followers' hearts alongside self-innovated monasticism they failed to observe", keys: ["57:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Compassion and mercy placed in the hearts of Isa's followers", keys: ["57:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Scripture and the balance sent with messengers so people maintain justice", keys: ["57:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Iron sent down with great military might and benefits for people", keys: ["57:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Monasticism innovated rather than prescribed, seeking approval but not properly observed", keys: ["57:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Double portion of mercy, a walking light and forgiveness promised for taqwa and belief in the Messenger", keys: ["57:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "All bounty in Allah's hand given by will, denying any monopoly to the People of the Scripture", keys: ["57:29"], evidenceClass: "EXPLICIT_TEXT" });

  const hadid = findWord(25, ["\u062d","\u062f","\u064a","\u062f"]);
  if (hadid) e.terminology.push({ term: hadid, transliteration: "hadid", gloss: "iron (editorial gloss)", keys: ["57:25"] });
  const rahbaniyyah = findWord(27, ["\u0631","\u0647","\u0628","\u0646"]);
  if (rahbaniyyah) e.terminology.push({ term: rahbaniyyah, transliteration: "rahbaniyyah", gloss: "monasticism (editorial gloss)", keys: ["57:27"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `057-al-hadid-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 057-al-hadid-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-057-p1,ext-057-p2,ext-057-p3,ext-057-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1690", label: "The four paired names: First, Last, Ascendant, Intimate", def: "In 57:3: He is the First and the Last, the Ascendant and the Intimate, and He is of all things Knowing.", key: "57:3", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Awwal Akhir Zahir Batin quartet."},{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Paired attribute structure."}] },
  { id: "cand-1691", label: "Throne establishment with comprehensive knowledge and presence wherever they are", def: "In 57:4: It is He who created the heavens and earth in six days and then established Himself above the Throne; He knows what penetrates into the earth and what emerges from it and what descends from the heaven and what ascends therein; and He is with you wherever you are.", key: "57:4", overlap: [{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Istiwa and ma'iyyah together."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Four-directional knowledge."}] },

  { id: "cand-1692", label: "Spending as stewardship over what Allah made them successors in", def: "In 57:7: Believe in Allah and His Messenger and spend out of that in which He has made you successors; for those who have believed among you and spent there will be a great reward.", key: "57:7", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Istikhlaf framing of wealth."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman joined to infaq."}] },
  { id: "cand-1693", label: "Pre-conquest spenders and fighters ranked above later ones", def: "In 57:10: Not equal among you are those who spent before the conquest and fought and those who did so after it; those are greater in degree than they who spent afterwards and fought, but to all Allah has promised the best.", key: "57:10", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Graduated merit by timing."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Sacrifice under hardship valued."}] },
  { id: "cand-1694", label: "The goodly loan multiplied into a noble reward", def: "In 57:11: Who is it that would loan Allah a goodly loan so He will multiply it for him and he will have a noble reward?", key: "57:11", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Qard hasan metaphor."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"related-not-identical",note:"Multiplication as grace."}] },
  { id: "cand-1695", label: "Believers' light proceeding before them while hypocrites are walled off", def: "In 57:12-13: On the Day you see the believing men and believing women their light proceeding before them and on their right; the hypocrite men and women will say wait for us that we may acquire some of your light; it will be said go back behind you and seek light; and a wall will be placed between them with a door, its interior containing mercy but on the outside torment.", key: "57:12", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Nur and the separating wall."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Light as salvific marker."}] },
  { id: "cand-1696", label: "Hypocrisy diagnosed as self-affliction, doubt and deluding wishful thinking", def: "In 57:14: They will say yes but you afflicted yourselves and awaited misfortune and doubted and wishful thinking deluded you until there came the command of Allah, and the Deceiver deceived you concerning Allah.", key: "57:14", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Rayb and tamanni diagnosed."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Al-gharur deception."}] },

  { id: "cand-1697", label: "Heart-humbling at remembrance against the hardening of earlier communities", def: "In 57:16: Has the time not come for those who have believed that their hearts should become humbly submissive at the remembrance of Allah and what has come down of the truth; and let them not be like those who were given the Scripture before and a long period passed over them so their hearts hardened.", key: "57:16", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Khushu' at dhikr."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Qaswah over time warned."}] },
  { id: "cand-1698", label: "Worldly life as boasting and competition likened to yellowing crops", def: "In 57:20: Know that the life of this world is but amusement and diversion and adornment and boasting to one another and competition in increase of wealth and children, like the example of a rain whose plant growth pleases the tillers then it dries and you see it turned yellow then it becomes scattered debris.", key: "57:20", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Mata' al-ghurur critique."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Agricultural parable of transience."}] },
  { id: "cand-1699", label: "Disaster pre-written in a register so believers neither despair nor exult", def: "In 57:22-23: No disaster strikes upon the earth or among yourselves except that it is in a register before We bring it into being, indeed that for Allah is easy, in order that you not despair over what has eluded you and not exult over what He has given you.", key: "57:22", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Kitab preceding occurrence."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Equanimity as the stated purpose."}] },

  { id: "cand-1700", label: "Scripture, balance and iron sent so people maintain justice", def: "In 57:25: We have already sent Our messengers with clear evidences and sent down with them the Scripture and the balance that the people may maintain their affairs in justice; and We sent down iron wherein is great military might and benefits for the people.", key: "57:25", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Li-yaquma al-nas bi'l-qist."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Kitab mizan hadid triad."}] },
  { id: "cand-1701", label: "Monasticism innovated rather than prescribed and improperly observed", def: "In 57:27: And We placed in the hearts of those who followed him compassion and mercy and monasticism which they innovated; We did not prescribe it for them except that they did so seeking the approval of Allah, but they did not observe it with due observance.", key: "57:27", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ra'fah and rahmah implanted."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Bid'ah versus prescription."}] },
  { id: "cand-1702", label: "Double mercy, walking light and forgiveness for taqwa and belief", def: "In 57:28: O you who have believed fear Allah and believe in His Messenger; He will then give you a double portion of His mercy and make for you a light by which you will walk and forgive you.", key: "57:28", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Taqwa with iman."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Kiflayn min rahmatihi."}] }
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
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 7).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(7, 10).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(10, 13).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `057-al-hadid-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-081.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-081.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
