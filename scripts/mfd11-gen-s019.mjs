// MFD-11 Wave 3: Surah 19 (Maryam) genuine re-extraction.
// Covers 19:1–98 in 3 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "019-0001-0098.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 19:${n} not found`);
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

console.log("Generating Surah 19 (Maryam) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T13:15:00.000Z";

// P1: 19:1–40 — Zakariyya-Yahya + Maryam-Isa narratives
// P2: 19:41–75 — Ibrahim, Musa, Ismail, Idrees, successors, eschatology
// P3: 19:76–98 — Sonship refutation, universal servitude, wudd, closing

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-019-p1": [
    "Disjointed letters Kaf-Ha-Ya-Ayn-Sad as surah opening marker",
    "Announcement of divine mercy shown to servant Zakariyya",
    "Zakariyya calling his Lord with a private hidden supplication",
    "Zakariyya describing physical decay and lifelong acceptance of supplication",
    "Fear of successors after death and request for heir due to barren wife",
    "Heir specified to inherit from him and from family of Yaqub and be pleasing",
    "Divine glad tidings of a son named Yahya never previously assigned to anyone",
    "Zakariyya questioning possibility of son given barren wife and extreme old age",
    "Divine response affirming ease based on prior creation from nothingness",
    "Sign of temporary muteness for three nights while remaining physically sound",
    "Emerging from mihrab signaling people to glorify Allah morning and evening",
    "Command to Yahya to hold Scripture firmly and grant of judgment in childhood",
    "Bestowal of hanan affection and zakah purity upon Yahya with taqwa",
    "Yahya characterized as dutiful to parents and neither tyrannical nor disobedient",
    "Triple peace formula upon Yahya at birth death and resurrection",
    "Command to mention Maryam in the Book and her withdrawal to an eastern place",
    "Maryam taking a screen and receiving the Spirit appearing as a well-proportioned man",
    "Maryam seeking refuge in Rahman from the visitor conditional on his piety",
    "Angel identifying himself as messenger of her Lord bearing news of a pure boy",
    "Maryam questioning conception without male contact or unchastity",
    "Divine decree affirming ease and designating child as sign and mercy already decided",
    "Conception occurring and withdrawal to a remote place",
    "Childbirth pains driving Maryam to palm trunk and wish for prior oblivion",
    "Voice from below commanding no grief and announcing a stream provided beneath her",
    "Instruction to shake palm trunk so fresh ripe dates drop upon her",
    "Command to eat drink and be comforted with silence vow explanation for any human encounter",
    "Returning to her people carrying the infant and their accusation of unprecedented act",
    "People invoking her noble lineage questioning how she could commit such deed",
    "Maryam pointing to the infant and people objecting to speaking with a cradle child",
    "Infant Isa declaring himself servant of Allah given Scripture and made prophet",
    "Isa declaring blessed status wherever he is and lifelong prayer-zakah obligation",
    "Isa declaring dutifulness to mother and absence of tyranny or wretchedness",
    "Triple peace formula upon Isa at birth death and resurrection",
    "Narrative closure identifying Isa ibn Maryam as word of truth about which factions dispute",
    "Negation of divine sonship with kun-fayakoon creative command affirmation",
    "Isa declaring shared Lordship and commanding worship as straight path",
    "Factions differing concerning Isa with woe pronounced on disbelievers at tremendous Day",
    "Rhetorical exclamation on clarity of hearing and seeing when they come to Allah",
    "Warning of Day of Regret when matter concludes while people remain heedless",
    "Declaration that Allah inherits earth and all upon it with universal return"
  ],
  "ext-019-p2": [
    "Command to mention Ibrahim in the Book as siddiq and nabi",
    "Ibrahim questioning father about worshipping what cannot hear see or benefit",
    "Ibrahim claiming received knowledge unavailable to father and offering guidance to even path",
    "Prohibition against worshipping Satan declared eternally disobedient to Rahman",
    "Fear expressed that father will face Rahman punishment and become Satan companion",
    "Father threatening stoning and demanding prolonged separation from Ibrahim",
    "Ibrahim responding with salam and promising istighfar citing divine graciousness toward him",
    "Ibrahim declaring withdrawal from father and false gods turning solely to his Lord",
    "After separation Allah granting Ishaq and Yaqub making each a prophet",
    "Bestowal of mercy and high reputation of truthfulness upon Ibrahim progeny",
    "Command to mention Musa in the Book as mukhlas rasul nabi",
    "Musa called from right side of mount and brought near in confidential communion",
    "Harun granted to Musa as mercy from Allah and made prophet",
    "Command to mention Ismail in the Book as true-to-promise rasul nabi",
    "Ismail enjoining prayer and zakah on his people and being pleasing to his Lord",
    "Command to mention Idrees in the Book as siddiq nabi",
    "Idrees raised to a high station",
    "Catalog of favored prophets from Adam Nuh Ibrahim Israel descendants who prostrated weeping at ayat",
    "Successors after them neglecting prayer and pursuing desires destined to meet ghayy",
    "Exception clause for those who repent believe and do righteous deeds entering Jannah unjust-free",
    "Gardens of Adn promised by Rahman in unseen with ever-arriving promise",
    "No idle speech heard therein only salam with provision morning and evening",
    "Jannah described as inheritance for those servants who possessed taqwa",
    "Angels declaring descent only by Lord command with comprehensive temporal ownership",
    "Lord of heavens earth and between commanding worship and patience asking if any equal exists",
    "Human questioning resurrection after death",
    "Rhetorical reminder that Allah created humanity before from nothingness",
    "Oath-affirmed gathering of humans and shayatin around Jahannam kneeling",
    "Extraction from every sect of those most insolent against Rahman",
    "Divine knowledge of who most deserves burning affirmed",
    "Universal passing over Hell declared as decreed inevitability",
    "Salvation of muttaqin and abandonment of zalimin kneeling within Hell",
    "Disbelievers challenging believers on which party has better position and assembly",
    "Prior destroyed generations cited as superior in possessions and appearance yet annihilated",
    "Command to let misguided receive extension until punishment or Hour reveals worst position"
  ],
  "ext-019-p3": [
    "Allah increasing the guided in guidance with enduring good deeds as best reward and recourse",
    "Disbeliever denying ayat yet claiming certainty of receiving wealth and children in afterlife",
    "Rhetorical challenge whether he perceived ghayb or obtained covenant from Rahman",
    "Rejection of claim with recording of statement and extension of punishment",
    "Allah inheriting what he claims and his arrival alone",
    "Taking deities besides Allah seeking honor through them",
    "False deities denying their worship and becoming opponents on Judgment Day",
    "Shayatin sent upon kafirin inciting them persistently",
    "Command not to hasten punishment as their numbered term is merely counted out",
    "Day when muttaqin are gathered to Rahman as honored delegation",
    "Criminals driven to Jahannam in thirst",
    "Intercession owned only by those who took covenant from Rahman",
    "Attribution of son to Rahman stated as their claim",
    "Condemnation of sonship claim as atrocious monstrous thing",
    "Cosmic devastation described heavens almost rupturing earth splitting mountains collapsing",
    "Cause of cosmic reaction identified as attributing son to Rahman",
    "Inappropriateness of Rahman taking a son declared",
    "Universal servitude affirmed everyone in heavens and earth comes to Rahman as abd",
    "Complete enumeration and counting of all creation",
    "Individual arrival on Resurrection Day without tribal or familial protection",
    "Believers doing righteous deeds receiving appointed wudd affection from Rahman",
    "Quran facilitated in Arabic tongue for giving tidings to muttaqin and warning hostile people",
    "Destroyed prior generations cited with rhetorical question on perceiving or hearing any remnant"
  ]
};

const PASSAGES = [
  { id: "ext-019-p1", from: 1, to: 40,
    label: "Kaf-Ha-Ya-Ayn-Sad; Zakariyya private supplication bones weakened head white wife barren give heir inherit Yaqub pleasing; good tidings Yahya not assigned before; how boy wife barren extreme old age; easy Me created you before nothing; sign not speak three nights sound; emerged sanctuary signaled glorify morning evening; O Yahya hold Scripture firmly given judgment childhood hanan purity kind mother not domineering miserable; peace born die raised alive; mention Book Maryam withdrew eastern place screened veil sent spirit well-proportioned man; seek refuge Rahman from you if fear; messenger Lord give pure boy; easy Me make sign people mercy matter decreed; conceived withdrew remote place; pains childbirth drove palm trunk wish died forgotten; called beneath her grieve not Lord made stream shake trunk fresh dates fall; eat drink cool eyes see human say vowed Rahman fast not speak today; brought people carrying pointed how speak infant cradle; said servant Allah gave Scripture made prophet blessed wherever enjoined prayer zakah alive kind mother not domineering miserable; peace born die raised alive",
    mainLabel: "Disjointed letters opening; Zakariyya private supplication for heir despite old age barren wife granted through divine ease; Yahya given wisdom-judgment in childhood with hanan-purity-parental kindness; Maryam narrative: seclusion angelic annunciation miraculous conception divine decree; birth under palm with providential stream-dates; infant Isa speaking from cradle declaring servanthood scripture prophethood blessing prayer-zakah maternal kindness peace formula" },
  { id: "ext-019-p2", from: 41, to: 75,
    label: "Mention Book Ibrahim truthful prophet; said father worship what not hear see avail nothing; knowledge come not followed Satan way; worship Satan disobey Rahman fear touch punishment become companion; reject gods father see people ignorant; disassociate worship call upon Lord perhaps pleased; left gods except one destined destroy; mention Book Musa chosen messenger prophet called side mount right brought near confiding gave mercy brother Harun prophet; mention Book Ismail true promise messenger prophet enjoin people prayer zakah pleasing Lord; mention Book Idrees man truth prophet raised high station; those bestowed favor prophets descendants Adam carried Nuh Abraham Israel guided chose; successors neglected prayer pursued desires meet evil; except repent believe righteous enter Paradise not wronged; Gardens Eden promised Rahman unseen servants enter angels greet peace provision morning evening inherited servants feared; descend not except command Lord what before behind between Lord not forgetful; Lord heavens earth whatever between worship endure patient; man says resurrected dead remember created before nothing; by Lord gather him demons present stand around Hell kneeling extract every nation witness rebelled Rahman know best deserve burn none pass over decreed Lord return pious saved wrongdoers left knees",
    mainLabel: "Ibrahim rejecting paternal idolatry with knowledge-based argument; disassociation from false worship; Musa chosen-called-confided given Harun as mercy; Ismail true-to-promise enjoining prayer-zakah; Idrees raised high station; favored prophets catalog spanning Adam-Nuh-Ibrahim-Israel; successors neglecting prayer pursuing desires meeting ghayy contrasted with repentant-believers entering Adn gardens; angels greeting salam perpetual provision; revelation descent conditioned on divine command; worship-patience linkage; resurrection denial answered by creation-from-nothing precedent; gathering with demons witnessing against rebels" },
  { id: "ext-019-p3", from: 76, to: 98,
    label: "Recite signs disbelieve say wealth children better or eternal extend disbelief extend punishment say misguided extended until perceive promised punishment Hour taste; serve besides Allah gods power help deny worship bear long; warn Day silence except permitted Rahman speaks rightly knows before behind concealed intercession avail except permitted Rahman accepted word; say Rahman taken son atrocious thing heavens rupture earth split mountains collapse devastate attribute Rahman son not appropriate Rahman take son none heavens earth comes Rahman servant enumerated counted full counting all coming Day Resurrection alone; believed righteous Rahman appoint affection; made Quran easy Arabic give tidings righteous warn contentious; destroyed generations before perceive anyone hear sound",
    mainLabel: "Disbeliever wealth-children preference extending punishment; false gods unable to help; Judgment Day silence except Rahman-permitted speech; intercession limited to accepted word; sonship attribution causing cosmic devastation heavens rupture earth splits mountains collapse; universal servitude negating divine offspring; individual resurrection without tribal protection; belief-righteousness producing divine wudd; Quran facilitated in Arabic for dual warning-tidings function; destroyed generations as sensory-absence proof" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`19:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`19:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 19, surahName: "Maryam",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 3 genuine re-extraction. P1=Zakariyya-Yahya-Maryam-Isa (1-40), P2=Ibrahim-Musa-Ismail-Idrees-successors-eschatology (41-75), P3=sonship-refutation-wudd-closing (76-98).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (19:1-40) ===
{
  const e = extractions[0];
  const rahman = findWord(18, ["\u0631","\u062d","\u0645","\u0646"]);
  const hannaan = findWord(13, ["\u062d","\u0646","\u0627"]);
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["19:18"] });
  if (hannaan) e.divineNamesAndAttributes.push({ term: hannaan, transliteration: "Hannaan", gloss: "Affectionate/Tender (editorial gloss)", keys: ["19:13"] });

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["19:4","19:5","19:6"], excerpt: fv(4), description: "Zakariyya supplication: My Lord bones weakened head white never unpleased; fear successors wife barren give heir." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["19:12"], excerpt: fv(12), description: "O Yahya hold the Scripture firmly — divine command to child prophet." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["19:31"], excerpt: fv(31), description: "Isa declares: He enjoined upon me prayer and zakah as long as I am alive." });

  e.propheticNarratives.push({ label: "Zakariyya-Yahya: elderly prophet private supplication for heir granted despite barren wife extreme old age; Yahya given wisdom childhood with hanan purity", keys: ["19:2","19:3","19:4","19:5","19:6","19:7","19:8","19:9","19:10","19:11","19:12","19:13","19:14","19:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Maryam-Isa: seclusion angelic annunciation miraculous virgin conception divine decree; birth under palm providential stream-dates; infant speech declaring servanthood prophethood blessing", keys: ["19:16","19:17","19:18","19:19","19:20","19:21","19:22","19:23","19:24","19:25","19:26","19:27","19:28","19:29","19:30","19:31","19:32","19:33","19:34","19:35","19:36"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Private supplication (nida'an khafiyyan) as intimate divine communication mode", keys: ["19:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Divine ease principle: It is easy for Me — creation from nothingness establishing omnipotence", keys: ["19:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Parent-child kindness (birr al-walidayn) as prophetic attribute: Yahya and Isa both described as kind to mothers", keys: ["19:14","19:32"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P2 (19:41-75) ===
{
  const e = extractions[1];
  const rahman2 = findWord(45, ["\u0631","\u062d","\u0645","\u0646"]);
  if (rahman2) e.divineNamesAndAttributes.push({ term: rahman2, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["19:45"] });

  const nabi = findWord(51, ["\u0646","\u0628","\u064a"]);
  const rasul = findWord(51, ["\u0631","\u0633","\u0648","\u0644"]);
  if (nabi) e.terminology.push({ term: nabi, transliteration: "nabi", gloss: "prophet (editorial gloss)", keys: ["19:51"] });
  if (rasul) e.terminology.push({ term: rasul, transliteration: "rasul", gloss: "messenger (editorial gloss)", keys: ["19:51"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["19:42"], excerpt: fv(42), description: "Ibrahim to father: Why worship what does not hear or see or avail you anything?" });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["19:65"], excerpt: fv(65), description: "Worship and be patient in His worship — dual command linking ibadah with sabr." });

  e.propheticNarratives.push({ label: "Ibrahim rejecting paternal idolatry with knowledge-based argument; disassociating from false gods calling upon Lord alone", keys: ["19:41","19:42","19:43","19:44","19:45","19:46","19:47","19:48"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Favored prophets catalog: Musa chosen-called-confided given Harun; Ismail true-to-promise enjoining prayer-zakah; Idrees raised high station", keys: ["19:51","19:52","19:53","19:54","19:55","19:56","19:57","19:58"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Successors who neglected prayer and pursued desires meeting ghayy (evil/destruction)", keys: ["19:59"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P3 (19:76-98) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["19:88","19:89","19:90","19:91","19:92"], excerpt: fv(88), description: "Attributing son to Rahman causes cosmic devastation; not appropriate for Rahman to take a son." });

  e.humanConditionsAndSpiritualStates.push({ label: "Cosmic reaction to sonship claim: heavens almost rupture earth splits mountains collapse", keys: ["19:90"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Divine wudd (affection/love) appointed for believers doing righteous deeds", keys: ["19:96"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Universal servitude: no one in heavens or earth except comes to Rahman as abd (servant)", keys: ["19:93"], evidenceClass: "EXPLICIT_TEXT" });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `019-maryam-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 019-maryam-p${num}.json`);
}

// === CANDIDATES (cand-0757..cand-0786, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-019-p1,ext-019-p2,ext-019-p3",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0757..0771)
  { id: "cand-0757", label: "Private supplication as intimate divine communication mode", def: "In 19:3: When he called to his Lord a private supplication (nida'an khafiyyan).", key: "19:3", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Khafi dua as intimate register."},{topicId:"remembrance",layer:"curated",relationship:"related-not-identical",note:"Privacy enabling sincerity."}] },
  { id: "cand-0758", label: "Divine ease principle establishing omnipotence over biological impossibility", def: "In 19:9: Your Lord says it is easy for Me for I created you before while you were nothing.", key: "19:9", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Yasir ala as creative capacity."},{topicId:"human-creation",layer:"scholarly",relationship:"related-not-identical",note:"Creation ex nihilo as precedent."}] },
  { id: "cand-0759", label: "Yahya given wisdom-judgment in childhood with hanan and purity", def: "In 19:12-13: O Yahya hold Scripture firmly; We gave him judgment in childhood and affection (hanan) from Us and purity.", key: "19:12", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Childhood hikmah as exceptional."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Hanan-zakat pairing."}] },
  { id: "cand-0760", label: "Maryam miraculous virgin conception through divine decree", def: "In 19:17-21: Sent spirit appeared well-proportioned man; said messenger Lord give pure boy; said thus Lord says easy Me make sign people mercy.", key: "19:17", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Virgin birth as ayat."},{topicId:"divine-mercy",layer:"scholarly",relationship:"related-not-identical",note:"Birth as rahmah manifestation."}] },
  { id: "cand-0761", label: "Infant Isa speaking from cradle declaring servanthood and prophethood", def: "In 19:30-33: Said I am servant Allah gave Scripture made prophet blessed wherever be enjoined prayer zakah alive kind mother not domineering.", key: "19:30", overlap: [{topicId:"isa-story",layer:"scholarly",relationship:"same-concept",note:"Cradle speech as miracle."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Abd-nabi-blessed triad."}] },
  { id: "cand-0762", label: "Providential sustenance during childbirth: stream and fresh dates from palm", def: "In 19:24-25: Called beneath her grieve not Lord made stream beneath shake trunk fresh dates fall upon you.", key: "19:24", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Emergency rizq."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Divine provision replacing grief."}] },
  { id: "cand-0763", label: "Silence vow as devotional practice", def: "In 19:26: Say vowed Rahman fast (sawman) so will not speak today any human.", key: "19:26", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Sawm al-samt as devotional silence."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Silence as discipline."}] },
  { id: "cand-0764", label: "Parent-child kindness as recurring prophetic attribute across narratives", def: "In 19:14,32: Yahya kind to mother not domineering; Isa kind to mother not domineering miserable.", key: "19:14", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Birr repeated for two prophets."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Non-jabbar non-shaqiyy pattern."}] },
  { id: "cand-0765", label: "Peace formula (salam) marking prophetic birth-death-resurrection transitions", def: "In 19:15,33: Peace upon him day born day dies day raised alive.", key: "19:15", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Triple salam structure."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Resurrection included in peace."}] },
  { id: "cand-0766", label: "Zakariyya fear of successors motivating heir request", def: "In 19:5: Indeed I fear the successors after me and my wife has been barren so give me from Yourself an heir.", key: "19:5", overlap: [{topicId:"leadership-qualities",layer:"scholarly",relationship:"related-not-identical",note:"Succession concern as leadership trait."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Turning to Allah for succession."}] },
  { id: "cand-0767", label: "Sign of muteness as confirmation mechanism for Zakariyya", def: "In 19:10: Your sign is that you will not speak to people three nights being sound.", key: "19:10", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Temporary muteness as ayah."},{topicId:"supplication",layer:"curated",relationship:"related-not-identical",note:"Sign confirming accepted dua."}] },
  { id: "cand-0768", label: "Angel appearing as well-proportioned man testing Maryam piety", def: "In 19:17: We sent to her Our spirit and he appeared to her as a well-proportioned man (basharan sawiyyan).", key: "19:17", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Jibril in human form."},{topicId:"unseen-belief",layer:"scholarly",relationship:"related-not-identical",note:"Malak visibility."}] },
  { id: "cand-0769", label: "Isa blessing (barakah) as portable divine favor", def: "In 19:31: And made me blessed (mubarakan) wherever I may be.", key: "19:31", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Barakah as mobile grace."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Location-independent blessing."}] },
  { id: "cand-0770", label: "Prayer-zakah as lifelong prophetic obligation", def: "In 19:31: Enjoined upon me prayer and zakah as long as I am alive (ma damtu hayyan).", key: "19:31", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Salah-zakah pairing."},{topicId:"god-consciousness",layer:"curated",relationship:"related-not-identical",note:"Lifelong ibadah mandate."}] },
  { id: "cand-0771", label: "Maryam seclusion and screening as spiritual preparation", def: "In 19:17: She withdrew from them to an eastern place and took a screen (hijab) from them.", key: "19:17", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Uzlah as devotional seclusion."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Withdrawal enabling divine encounter."}] },

  // P2 (cand-0772..0781)
  { id: "cand-0772", label: "Ibrahim knowledge-based rejection of paternal idolatry", def: "In 19:42-43: Why worship what does not hear see or avail? O father indeed came to me knowledge not come to you.", key: "19:42", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Ilm-based tawheed argument."},{topicId:"knowledge-seeking",layer:"scholarly",relationship:"same-concept",note:"Knowledge distinguishing truth."}] },
  { id: "cand-0773", label: "Successors neglecting prayer pursuing desires meeting destruction", def: "In 19:59: There came after them successors who neglected prayer (ada'u al-salah) and pursued desires (ittaba'u al-shahawat) so they will meet ghayy.", key: "19:59", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Neglect as generational decline."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Desire-pursuit as corruption."}] },
  { id: "cand-0774", label: "Repentance-belief-righteousness as exception to destructive succession", def: "In 19:60: Except those who repent believe and do righteousness; for those will enter Paradise not wronged.", key: "19:60", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Tawbah-iman-amal triad."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Exception clause as hope."}] },
  { id: "cand-0775", label: "Gardens of Eden with angelic salam greeting and perpetual provision", def: "In 19:61-62: Gardens Eden promised Rahman unseen; enter therein greeted with salam; provision morning evening.", key: "19:61", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Adn as eternal abode."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Angelic welcome."}] },
  { id: "cand-0776", label: "Revelation descent conditioned on divine command encompassing all temporal dimensions", def: "In 19:64: We descend not except by command of your Lord; to Him belongs what is before us behind us and between.", key: "19:64", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Amr-conditioned nuzul."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Temporal omniscience."}] },
  { id: "cand-0777", label: "Worship-patience linkage as sustained devotional requirement", def: "In 19:65: Worship Him and be patient in His worship (wa-stabir li-ibadatihi).", key: "19:65", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Istibar as endurance in ibadah."},{topicId:"prayer",layer:"curated",relationship:"related-not-identical",note:"Sabr sustaining salah."}] },
  { id: "cand-0778", label: "Resurrection denial answered by prior creation-from-nothing precedent", def: "In 19:67: Does man not remember We created him before while he was nothing?", key: "19:67", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Initial creation as ba'th proof."},{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Min ghayri shay' argument."}] },
  { id: "cand-0779", label: "Intercession limited to Rahman-permitted speech on Judgment Day", def: "In 19:87: Intercession avails not except for one whom Rahman has permitted and accepted his word.", key: "19:87", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Shafa'ah as conditional."},{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"Permission-based mediation."}] },
  { id: "cand-0780", label: "Musa called from right side of mount brought near in confidence", def: "In 19:52: We called him from side of mount at right and brought him near confiding (najiyyan).", key: "19:52", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Najwa as intimate revelation."},{topicId:"prophetic-character",layer:"scholarly",relationship:"related-not-identical",note:"Proximity as honor."}] },
  { id: "cand-0781", label: "Idrees raised to high station as unique prophetic elevation", def: "In 19:57: And We raised him to a high station (makanan aliyyan).", key: "19:57", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Raf' as distinction."},{topicId:"unseen-belief",layer:"scholarly",relationship:"related-not-identical",note:"Elevation beyond ordinary."}] },

  // P3 (cand-0782..0786)
  { id: "cand-0782", label: "Sonship attribution causing cosmic devastation", def: "In 19:89-91: Atrocious thing; heavens almost rupture earth splits mountains collapse because they attribute to Rahman a son.", key: "19:89", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Cosmic reaction to shirk."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Walad as ontological violation."}] },
  { id: "cand-0783", label: "Universal servitude negating divine offspring possibility", def: "In 19:93: There is no one in heavens or earth except comes to Rahman as servant (abd).", key: "19:93", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Ubudiyyah universal."},{topicId:"human-dignity",layer:"scholarly",relationship:"related-not-identical",note:"Servitude as equalizer."}] },
  { id: "cand-0784", label: "Divine wudd (affection) appointed for believing righteous servants", def: "In 19:96: Those who believed and did righteous deeds Rahman will appoint for them affection (wudd).", key: "19:96", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Wudd as relational attribute."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"related-not-identical",note:"Iman-amal producing divine love."}] },
  { id: "cand-0785", label: "Quran facilitated in Arabic for dual warning-tidings function", def: "In 19:97: We made Quran easy in your tongue that you may give good tidings to righteous and warn contentious people.", key: "19:97", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Taysir as linguistic accessibility."},{topicId:"quranic-vocabulary",layer:"scholarly",relationship:"related-not-identical",note:"Arabic facilitation."}] },
  { id: "cand-0786", label: "Destroyed generations as sensory-absence proof of divine judgment", def: "In 19:98: How many We destroyed before them of generations; do you perceive anyone or hear from them a sound?", key: "19:98", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Total erasure as evidence."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Absence as negative proof."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 3 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 15).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(15, 25).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(25, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `019-maryam-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-043.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-043.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
