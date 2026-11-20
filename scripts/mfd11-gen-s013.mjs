// MFD-11 Wave 2: Surah 13 (Ar-Ra'd) genuine re-extraction.
// Covers 13:1–43 in 2 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "013-0001-0043.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 13:${n} not found`);
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

console.log("Generating Surah 13 (Ar-Ra'd) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T12:25:00.000Z";

// P1: 13:1–24 — Divine sovereignty in creation/nature, covenant ethics, believer reward
// P2: 13:25–43 — Consequences of covenant-breaking, prophetic consolation, divine decree

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-013-p1": [
    "Mysterious letters introducing verses of the Book affirmed as truth despite majority disbelief",
    "Cosmic architecture: heavens raised without visible pillars, Throne established, sun and moon subjected to appointed terms",
    "Earth spread with mountains and rivers; paired fruits and night-day cycle as signs for reflective people",
    "Neighboring plots and diverse vegetation watered by one source yet distinguished in taste as signs for reasoning people",
    "Astonishment at resurrection denial: dust-to-new-creation rejection earning shackles and eternal fire",
    "Impatient demand for punishment before mercy despite prior exemplary punishments; Lord as forgiving yet severe",
    "Disbelievers demand a sign; Prophet identified as warner only while every people has a guide",
    "Divine omniscience over what wombs carry, what is lost or exceeded; everything by precise measure",
    "Knower of unseen and witnessed, the Grand, the Exalted",
    "Equality of concealed and publicized speech, hidden night traveler and conspicuous day mover before divine knowledge",
    "Successive guardian angels protecting by divine decree; conditional principle that Allah changes a people only when they change themselves",
    "Lightning shown as cause of fear and hope; generation of heavy clouds",
    "Thunder glorifying with praise; angels in awe; thunderbolts striking whom Allah wills amid human dispute about Him",
    "Supplication of truth belonging to Allah alone; futility of calling upon others illustrated by outstretched hands reaching for distant water",
    "Universal prostration of all in heavens and earth, willingly or compelled, including shadows at morning and evening",
    "Rhetorical tawheed interrogation: Lord of heavens and earth identified as Allah; blind versus seeing; darkness versus light; partners unable to create",
    "Rain parable: torrent bearing foam and smelted ore producing scum; truth endures while falsehood vanishes",
    "Best reward for those who respond to their Lord; worst account and Hell for those who refuse even with earthly ransom",
    "One who knows revelation is truth contrasted with the blind; only people of understanding take heed",
    "Those who fulfill Allah's covenant and do not break the contract",
    "Those who join what Allah ordered joined, fear their Lord, and dread evil account",
    "Patient seekers of divine countenance establishing prayer, spending secretly and publicly, repelling evil with good",
    "Gardens of perpetual residence entered with righteous ancestors, spouses, and descendants; angels greeting from every gate",
    "Salutation of peace bestowed for patient endurance; excellent final home"
  ],
  "ext-013-p2": [
    "Covenant-breakers severing divine bonds and spreading corruption earn curse and evil abode",
    "Allah extends and restricts provision; worldly rejoicing contrasted with brief enjoyment versus hereafter",
    "Disbelievers demand a sign; divine misguidance of whom He wills and guidance of whoever turns back",
    "Believers whose hearts find assurance through remembrance of Allah; dhikr as unique tranquillity mechanism",
    "Believers performing righteous deeds receive blessed state and good return",
    "Prophet sent to a community preceded by past nations; recitation of revelation met with Rahman-denial; declaration of reliance on Lord alone",
    "Hypothetical Quran moving mountains, splitting earth, or speaking to the dead; affair belongs entirely to Allah; persistent calamities until divine promise arrives",
    "Messengers ridiculed before; respite granted then seizure enacted; severity of divine penalty recalled",
    "Maintainer of every soul knowing what it earns; challenge to name alleged partners; human plotting beautified for disbelievers leaving them without guide",
    "Worldly punishment compounded by severer hereafter punishment; no protector against Allah",
    "Paradise description for the righteous: flowing rivers, lasting fruit and shade; Fire as consequence for disbelievers",
    "Scripture recipients rejoicing at revelation while factions deny portions; command to worship Allah alone without association",
    "Arabic legislation revealed; warning against following inclinations after knowledge arrives lest one lose all divine protection",
    "Prior messengers given wives and children; signs arrive only by divine permission; every term has a decree",
    "Allah eliminates or confirms what He wills; Mother of the Book as master record",
    "Whether Prophet sees part of promised punishment or dies first, his duty is notification while accountability rests with Allah",
    "Territorial reduction from borders as visible sign; Allah judges without adjustment and is swift in reckoning",
    "Prior plotting surpassed by divine planning; Allah knows every soul's earnings; disbelievers will learn whose final home prevails",
    "Disbelievers denying prophethood met with sufficiency of Allah and Scripture-knowledge holders as witnesses"
  ]
};

const PASSAGES = [
  { id: "ext-013-p1", from: 1, to: 24,
    label: "Ra'd — Verses of Book truth from Lord but most disbelieve; Allah erected heavens without pillars established Throne subjected sun moon stars; spread earth mountains rivers fruits two mates; neighboring plots gardens vines crops palms single root diverse taste water same; astonished at resurrection denial; urge evil before good similar punishments passed; why no sign sent you only warner every people guide; Allah knows female carries wombs lose exceed everything due measure; Knower unseen witnessed Grand Exalted; same conceal speech publicize hidden night conspicuous day; successive angels protect by decree Allah does not change condition people until change themselves; lightning fear hope heavy clouds; thunder exalts praise angels fear sends thunderbolts strikes whom wills; supplication truth belongs Him alone others respond nothing like one extends hands water reach mouth not reaching; prostrates whoever heavens earth willingly compulsion shadows morning evening; say who Lord heavens earth say Allah; taken allies besides Him possess benefit harm themselves; blind equal seeing darkness light assigned partners creation say Allah Creator everything One Prevailing; rain valleys flow capacity torrent foam ornaments vessels melt away foam vanishes thus Allah presents truth falsehood",
    mainLabel: "Quranic revelation affirmed as truth despite majority disbelief; cosmic architecture without visible pillars establishing divine power; natural diversity from unified water source as sign system; resurrection denial contrasted with observable creation; prophetic role limited to warning while guidance belongs to Allah; divine omniscience encompassing womb contents and all measures; guardian angels as protective mechanism linked to divine decree; conditional divine response principle: Allah does not change a people until they change themselves; thunder-lightning as dual fear-hope phenomena; exclusive validity of divine supplication versus futile idol-worship; universal prostration of creation including shadows; rhetorical tawheed argument through creation ownership; rain-parable distinguishing enduring truth from vanishing falsehood" },
  { id: "ext-013-p2", from: 25, to: 43,
    label: "Ra'd — Those break covenant Allah after contracting sever what Allah ordered joined spread corruption cursed evil home; Allah extends restricts provision rejoice worldly life while worldly life compared Hereafter except enjoyment brief; disbelievers say why sign not sent say Allah leaves astray wills guides whoever returns repentant; believed hearts assured remembrance Allah unquestionably remembrance hearts assured; believed did righteous good state theirs good return; sent community before which communities passed recite revealed disbelieve Rahman say He my Lord no deity except Him upon Him rely to Him return; if Quran mountains removed earth broken dead made speak rather matter belongs entirely Allah; messengers ridiculed before extended time disbelievers seized how was penalty; maintainer every soul knowing earned attributed partners say name them inform names earth know apparent speech; plotting disbelieved plan belongs Allah knows earns disbelievers know outcome home; punishment worldly life Hereafter more severe no protector against Allah; example Paradise promised righteous rivers beneath fruit lasting shade eternal outcome righteous evildoers Fire; given Scripture rejoice revealed some parties deny portions say commanded believe part reject part what recompense those do disgrace worldly life Day Resurrection returned severest punishment; revealed Arabic legislation follow inclinations after knowledge come neither ally protector; sent messengers before assigned wives descendants not messenger produce sign except permission Allah eliminates confirms Mother Book; show part promise take death upon you notification upon Us account; seen reduce land borders Allah decides no adjuster swift reckoning; plotted before Allah plan entirely knows earns disbelievers know outcome; disbelievers say not messenger say sufficient Allah witness between me you whoever has knowledge Scripture",
    mainLabel: "Covenant-breaking defined as severing divine bonds and spreading corruption resulting in curse; provision expansion-restriction as divine prerogative contrasting worldly rejoicing with hereafter perspective; remembrance of Allah (dhikr) as heart-assurance mechanism unique to believers; prophetic consolation through historical precedent of ridiculed messengers; divine decree supremacy over human plotting; Quran's miraculous potential acknowledged yet subordinated to divine will; Arabic legislation as final revelation with warning against post-revelation inclination-following; Umm al-Kitab as divine record underlying elimination-confirmation process; territorial reduction as visible sign of divine authority; closing witness formula invoking Allah and Scripture-knowers as sufficient testimony" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`13:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`13:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 13, surahName: "Ar-Ra'd",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: `Wave 2 genuine re-extraction. Passage boundaries based on thematic shift from creation-covenant theology (P1) to consequence-consolation-eschatology (P2).`,
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE ANALYTICAL ARRAYS ===

// P1 (13:1-24)
{
  const e = extractions[0];
  const allah = findWord(2, ["\u0627","\u0644","\u0644","\u0647"]);
  const aleem = findWord(9, ["\u0639","\u0644","\u064a","\u0645"]);
  const kabir = findWord(9, ["\u0643","\u0628","\u064a","\u0631"]);
  const mutaal = findWord(9, ["\u0645","\u062a","\u0639","\u0627","\u0644"]);
  if (allah) e.divineNamesAndAttributes.push({ term: allah, transliteration: "Allah", gloss: "God (editorial gloss)", keys: ["13:2"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["13:9"] });
  if (kabir) e.divineNamesAndAttributes.push({ term: kabir, transliteration: "Kabir", gloss: "Grand/Great (editorial gloss)", keys: ["13:9"] });
  if (mutaal) e.divineNamesAndAttributes.push({ term: mutaal, transliteration: "Muta'al", gloss: "Exalted/Supreme (editorial gloss)", keys: ["13:9"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["13:16"], excerpt: fv(16), description: "Say: Who is Lord of heavens and earth? Say: Allah — rhetorical tawheed affirmation command." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["13:16"], excerpt: fv(16), description: "Have you taken besides Him allies not possessing benefit or harm for themselves? — prohibition of false protectors." });

  e.humanConditionsAndSpiritualStates.push({ label: "Majority disbelief despite clear revelation: most of mankind do not believe", keys: ["13:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Astonishment at resurrection reflecting materialist worldview limitation", keys: ["13:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Conditional divine response: Allah does not change condition of a people until they change what is in themselves", keys: ["13:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Guardian angels as successive protectors operating by divine decree linking human agency to divine oversight", keys: ["13:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Universal prostration of all creation including shadows demonstrating total submission to divine sovereignty", keys: ["13:15"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Natural diversity from unified sources (same water producing different fruits) as ecological sign system", keys: ["13:4"], evidenceClass: "EXPLICIT_TEXT" });

  const kitab = findWord(1, ["\u0643","\u062a","\u0627","\u0628"]);
  const haqq = findWord(1, ["\u062d","\u0642"]);
  if (kitab) e.terminology.push({ term: kitab, transliteration: "kitab", gloss: "Book/scripture (editorial gloss)", keys: ["13:1"] });
  if (haqq) e.terminology.push({ term: haqq, transliteration: "haqq", gloss: "truth/reality (editorial gloss)", keys: ["13:1"] });
}

// P2 (13:25-43)
{
  const e = extractions[1];
  const rahman = findWord(30, ["\u0631","\u062d","\u0645","\u0646"]);
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["13:30"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["13:25"], excerpt: fv(25), description: "Those who break Allah's covenant after contracting it and sever what Allah ordered joined and spread corruption — cursed." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["13:28"], excerpt: fv(28), description: "Those who believed and whose hearts are assured by remembrance of Allah — indeed by remembrance of Allah hearts are assured." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["13:30"], excerpt: fv(30), description: "Say: He is my Lord there is no deity except Him upon Him I rely and to Him I return." });

  e.humanConditionsAndSpiritualStates.push({ label: "Dhikr (remembrance of Allah) as unique heart-assurance mechanism for believers", keys: ["13:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Worldly rejoicing in expanded provision contrasted with brief enjoyment versus lasting hereafter", keys: ["13:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Worldly life as brief enjoyment compared to lasting hereafter reward", keys: ["13:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Allah-messenger relationship: messenger's duty is notification only while accountability belongs to Allah", keys: ["13:40"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Territorial reduction as visible geopolitical sign of divine authority and judgment", keys: ["13:41"], evidenceClass: "EXPLICIT_TEXT" });

  const dhikr = findWord(28, ["\u0630","\u0643","\u0631"]);
  const ummAlKitab = findWord(39, ["\u0623","\u0645","\u0627","\u0644","\u0643","\u062a","\u0627","\u0628"]);
  if (dhikr) e.terminology.push({ term: dhikr, transliteration: "dhikr", gloss: "remembrance (editorial gloss)", keys: ["13:28"] });
  if (ummAlKitab) e.terminology.push({ term: ummAlKitab, transliteration: "Umm al-Kitab", gloss: "Mother of the Book/divine master record (editorial gloss)", keys: ["13:39"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `013-ar-rad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 013-ar-rad-p${num}.json`);
}

// === CANDIDATES (cand-0567..cand-0586, 20 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-013-p1,ext-013-p2",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0567..0576)
  { id: "cand-0567", label: "Quranic revelation affirmed as truth despite majority disbelief", def: "In 13:1: These are verses of the Book and what has been revealed to you from your Lord is the truth but most of mankind do not believe.", key: "13:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Haqq as defining attribute of revelation."}] },
  { id: "cand-0568", label: "Cosmic architecture without visible pillars as divine power sign", def: "In 13:2: Allah erected heavens without pillars that you see then established Himself above Throne.", key: "13:2", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Invisible support demonstrating transcendent power."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Cosmic structure as observable sign."}] },
  { id: "cand-0569", label: "Natural diversity from unified water source as ecological sign", def: "In 13:4: From all fruits He made two mates; neighboring plots gardens vines crops palms single root or otherwise nourished by one water yet We distinguish some over others in taste.", key: "13:4", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Botanical diversity as sign."},{topicId:"diversity-divine-sign",layer:"scholarly",relationship:"same-concept",note:"Variety from unity as divine signature."}] },
  { id: "cand-0570", label: "Resurrection denial contrasted with observable creation power", def: "In 13:5: If you are astonished then astonishing is their saying when we are dust will we be in new creation? Those disbelieved in their Lord.", key: "13:5", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Denial despite creation evidence."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Materialist blindness to divine capability."}] },
  { id: "cand-0571", label: "Conditional divine response principle linking human change to divine change", def: "In 13:11: Indeed Allah will not change the condition of a people until they change what is in themselves.", key: "13:11", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Human initiative as precondition for divine response."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Internal change as catalyst."}] },
  { id: "cand-0572", label: "Guardian angels as successive protectors by divine decree", def: "In 13:11: For each one are successive angels before and behind him who protect him by decree of Allah.", key: "13:11", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Mu'aqqibat as protective function."},{topicId:"unseen-belief",layer:"scholarly",relationship:"related-not-identical",note:"Invisible guardianship."}] },
  { id: "cand-0573", label: "Thunder-lightning as dual fear-hope natural phenomena", def: "In 13:12-13: He shows lightning causing fear and aspiration generates heavy clouds; thunder exalts with praise of Him.", key: "13:12", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Meteorological signs carrying dual emotional valence."}] },
  { id: "cand-0574", label: "Exclusive validity of divine supplication versus futile idol-worship", def: "In 13:14: To Him alone is supplication of truth; those called besides Him respond with nothing like one extending hands to water that never reaches mouth.", key: "13:14", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Da'wah al-haqq as exclusive divine prerogative."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Futility of non-divine invocation."}] },
  { id: "cand-0575", label: "Universal prostration of creation including shadows", def: "In 13:15: To Allah prostrates whoever is in heavens and earth willingly or by compulsion and their shadows in mornings and evenings.", key: "13:15", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Universal submission as rububiyyah evidence."}] },
  { id: "cand-0576", label: "Rain-parable distinguishing enduring truth from vanishing falsehood", def: "In 13:17: Torrent carries rising foam; ornaments and vessels melt producing foam similarly; thus Allah presents truth and falsehood — foam vanishes but what benefits people remains.", key: "13:17", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hydrological metaphor for epistemological distinction."}] },

  // P2 (cand-0577..0586)
  { id: "cand-0577", label: "Covenant-breaking as severing divine bonds and spreading corruption", def: "In 13:25: Those who break covenant of Allah after contracting it and sever what Allah ordered joined and spread corruption upon earth — for them is curse and evil home.", key: "13:25", overlap: [{topicId:"covenants-ahd",layer:"scholarly",relationship:"same-concept",note:"Nakth al-ahd as fundamental violation."},{topicId:"fasad-fil-ard",layer:"scholarly",relationship:"same-concept",note:"Corruption linked to covenant-breaking."}] },
  { id: "cand-0578", label: "Dhikr as unique heart-assurance mechanism for believers", def: "In 13:28: Those who believed and whose hearts are assured by remembrance of Allah — unquestionably by remembrance of Allah hearts are assured.", key: "13:28", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr as tatma'innu mechanism."},{topicId:"god-consciousness",layer:"curated",relationship:"related-not-identical",note:"Heart-tranquility as taqwa fruit."}] },
  { id: "cand-0579", label: "Provision expansion-restriction as divine prerogative beyond human control", def: "In 13:26: Allah extends provision for whom He wills and restricts it; they rejoice in worldly life while worldly life compared to Hereafter is only brief enjoyment.", key: "13:26", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"Rizq distribution as divine sovereignty."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Provision cycles as test."}] },
  { id: "cand-0580", label: "Prophetic consolation through historical precedent of ridiculed messengers", def: "In 13:32: Already were messengers ridiculed before you and I extended time for disbelievers then seized them — how was My penalty.", key: "13:32", overlap: [{topicId:"prophets",layer:"curated",relationship:"related-not-identical",note:"Pattern of rejection and vindication."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Endurance modeled on predecessors."}] },
  { id: "cand-0581", label: "Divine decree supremacy over human plotting", def: "In 13:42: Those before them plotted but to Allah belongs plan entirely; He knows what every soul earns.", key: "13:42", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Makr vs Allah's makr."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Reliance on divine plan over human schemes."}] },
  { id: "cand-0582", label: "Arabic legislation as final revelation with post-revelation warning", def: "In 13:37: Thus We revealed it as Arabic legislation; if you follow their inclinations after knowledge has come to you have neither ally nor protector from Allah.", key: "13:37", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Hukm arabi as linguistic-theological identity."}] },
  { id: "cand-0583", label: "Umm al-Kitab as divine master record underlying elimination-confirmation", def: "In 13:39: Allah eliminates what He wills or confirms and with Him is Mother of the Book.", key: "13:39", overlap: [{topicId:"qadr-four-levels",layer:"scholarly",relationship:"same-concept",note:"Umm al-Kitab as preserved decree."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"related-not-identical",note:"Master record as knowledge repository."}] },
  { id: "cand-0584", label: "Territorial reduction as visible geopolitical sign of divine authority", def: "In 13:41: Have they not seen We set upon land reducing it from its borders? Allah decides and there is no adjuster of His decision.", key: "13:41", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Geopolitical change as observable sign."},{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"Territorial control as sovereignty evidence."}] },
  { id: "cand-0585", label: "Messenger's duty limited to notification while accountability belongs to Allah", def: "In 13:40: Whether We show you part of what We promise or take you in death upon you is only notification and upon Us is the account.", key: "13:40", overlap: [{topicId:"prophet-vs-messenger",layer:"scholarly",relationship:"same-concept",note:"Balagh as functional limit."},{topicId:"self-accountability",layer:"scholarly",relationship:"related-not-identical",note:"Divine accounting as ultimate authority."}] },
  { id: "cand-0586", label: "Closing witness formula invoking Allah and Scripture-knowers as sufficient testimony", def: "In 13:43: Those who disbelieved say you are not a messenger; say sufficient is Allah as witness between me and you and whoever has knowledge of the Scripture.", key: "13:43", overlap: [{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Dual witness: divine and scholarly."},{topicId:"tawheed",layer:"curated",relationship:"related-not-identical",note:"Allah as sufficient shahid."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 2 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `013-ar-rad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-037.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-037.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
