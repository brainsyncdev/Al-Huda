// MFD-11 Wave 3: Surah 21 (Al-Anbiya) genuine re-extraction.
// Covers 21:1–112 in 4 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "021-0001-0112.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 21:${n} not found`);
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

console.log("Generating Surah 21 (Al-Anbiya) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T13:25:00.000Z";

// P1: 21:1–29 — Reckoning approach, disbeliever playfulness, prophet humanity, tawheed argument
// P2: 21:30–50 — Creation signs, prior destruction, resurrection, divine justice
// P3: 21:51–93 — Prophetic narratives: Ibrahim idols, Lut, Nuh, Ayyub, Yunus, Zakariyya, Maryam
// P4: 21:94–112 — Righteous inheritance, folding heavens, rahmatan lil-alamin, closing judgment

const PASSAGES = [
  { id: "ext-021-p1", from: 1, to: 29,
    label: "Account approached people heedlessness turning away; no mention comes anew Lord except listen play hearts distracted; wrongdoers conceal private conversation is this except human like yourselves; would you follow magic while aware; said Lord knows whatever said heaven earth Hearing Knowing; say mixture false dreams invented poet bring sign like sent before; not city destroyed believed before will they believe; sent not before except men revealed ask people message know; not make prophets forms not eating food nor immortal; fulfilled promise saved whom willed destroyed transgressors; sent down Book mention will you not reason; how many cities unjust destroyed raised after them another generation; perceived punishment fled; do not flee return luxury dwellings perhaps questioned; said woe us indeed wrongdoers; ceased not saying until made stubble silent; not make creation play; intended take amusement taken besides Us; rather hurl truth upon falsehood destroys perishes woe describe; belongs Him whoever heavens earth those near Him not disdain worship glorify night day never flagging; taken gods earth raise dead; had been deities besides Allah would have ruined both testify exalted above describe; says none should be questioned what He does they questioned; taken besides Him gods cannot help themselves nor helped; cut skin faces fire fuel; every soul taste death test evil good trial returned",
    mainLabel: "Reckoning imminence met with heedless playfulness; new revelation received as entertainment; prophet humanity affirmed against supernatural expectations; tawheed argument through creation-purpose negation; prior destruction pattern establishing precedent; Book as dhikr demanding reasoning; fleeing punishment futility; creation not play but purposeful; divine self-sufficiency negating need for partners; universal mortality and trial-return cycle" },
  { id: "ext-021-p2", from: 30, to: 50,
    label: "Disbelieved see heavens earth joined clove apart made water everything living will they not believe; placed earth firmly set mountains lest shake made broad paths perhaps guided; made sky protected ceiling turn away; created night day sun moon each swimming orbit; not granted immortality any human before would you live forever if died; created man haste show signs fear not; say when promise if truthful; disbelieve say when promise if truthful; wish knew disbelieve ward off faces fire protect selves; nay come suddenly bewilder unable reprieve nor respite; already ridiculed messengers before descended scoffed encompassed; say who protects night day Rahman turn away remembrance; have gods protect besides Us cannot help themselves nor accompanied; enjoyed lives fathers passed away word preceded remain; travel earth observe end deniers; say warn revelation deaf hear not call; touched slightest punishment Lord say woe us indeed wrongdoers; set scales justice Day Resurrection soul wronged nothing even mustard seed suffice reckoner; gave Musa Harun criterion light reminder muttaqin; fear Lord unseen dread Hour; blessed name Lord Possessor Majesty Honor",
    mainLabel: "Heavens-earth separation and water-life origin as creation signs; geological stabilization enabling habitation; celestial protection and orbital precision; human mortality contrasted with divine eternity; hastiness in demanding punishment reflecting impatience; prior messenger ridicule pattern; Rahman as sole protector negating false guardians; eschatological scales ensuring exact justice; Musa-Harun receiving furqan-dhaw'-dhikr triad for muttaqin; divine majesty-honor as closing attributes" },
  { id: "ext-021-p3", from: 51, to: 93,
    label: "Gave Ibrahim sound judgement before well-knowing; said father people statues devoted; found fathers worshippers; said you fathers manifest error; come truth or jest; said Lord heavens earth created witness; swear Allah plan against idols turned away; made fragments except large one might return question; said who done gods indeed wrongdoers; heard young man mention called Ibrahim; said brought him sight people bear witness; asked did you do this gods; said rather largest did ask speaks; admitted shame then reversed blame; said worship besides Allah benefit harm; burned said fire cool safe Ibrahim; wanted harm made greatest losers; saved Lut said emigrate Lord Merciful Wise; gave Isaac Yaqub additional gift made righteous leaders guiding command inspired establish prayer zakah worshippers; Lut given wisdom knowledge delivered town committing abominations evil people except family wife destined remain behind; rained stones marked Lord not far wrongdoers; Nuh called We responded saved family great distress; helped people denied signs drowned all; Dhu al-Nun went angry thought We powerless called darkness none deity except You glory indeed wrongdoer; responded saved grief thus save believers; Zakariyya called Lord leave not alone best inheritors; responded gave Yahya made wife right conduct hastened good deeds called hoping fearing humble; guarded chastity breathed spirit made her son sign worlds; indeed community single community I am Lord worship; split affairs return",
    mainLabel: "Ibrahim sound judgement demonstrated through idol-destruction exposing paternal tradition as manifest error; largest-idol rhetorical trap forcing self-recognition; fire miracle as divine protection reversing oppressor intent; Lut emigration and deliverance from abomination-community; Ibrahim-Ishaq-Yaqub lineage established as righteous leadership with prayer-zakah inspiration; Lut narrative emphasizing hospitality versus communal evil; Nuh salvation paired with collective drowning; Yunus (Dhu al-Nun) darkness supplication as universal rescue formula; Zakariyya-Yahya grant responding to faithful petition; Maryam chastity and Isa as unified sign for all worlds; ummah wahidah principle preceding division" },
  { id: "ext-021-p4", from: 94, to: 112,
    label: "Whoever does righteous deeds believer effort denied nor forgotten; prohibited city destroyed return forbidden; impossible people destroyed return; Gog Magog opened every elevation rushing; true promise near stares disbelieved glazed woe described; roll up heavens scroll began first creation repeat promise ever doer; written Psalms after mention land inherited righteous servants; indeed notification worshipping people; sent not except mercy worlds; say revealed god one God will you be Muslims; turn away announced equally know not near far promised; knows declared speech knows conceal; know not perhaps trial enjoyment time; said Lord judge truth Lord Most Merciful help sought describe",
    mainLabel: "Righteous effort guaranteed recognition without denial; destroyed-city return impossibility establishing finality; Yajuj-Majuj release from every elevation as eschatological sign; true promise proximity causing disbeliever visual shock; cosmic folding mirroring initial creation; Zabur confirmation of righteous inheritance; Quran as balagh for worshipping community; rahmatan lil-alamin as universal prophetic mission definition; flexible divine naming with asma al-husna closure; mutual waiting challenge with divine judgment appeal" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`21:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`21:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 21, surahName: "Al-Anbiya",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 3 genuine re-extraction. P1=reckoning-tawheed(1-29), P2=creation-signs-justice(30-50), P3=prophetic-narratives(51-93), P4=eschatology-rahmah-closing(94-112).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (21:1-29) ===
{
  const e = extractions[0];
  const samee = findWord(4, ["\u0633","\u0645","\u064a","\u0639"]);
  const aleem = findWord(4, ["\u0639","\u0644","\u064a","\u0645"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "All-Hearing (editorial gloss)", keys: ["21:4"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["21:4"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["21:10"], excerpt: fv(10), description: "We have sent down a Book containing your mention — will you not reason?" });

  e.humanConditionsAndSpiritualStates.push({ label: "Heedless playfulness (la'ibun) as default reception mode for new revelation", keys: ["21:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creation-purpose relationship: We did not create heavens and earth in play", keys: ["21:16"], evidenceClass: "EXPLICIT_TEXT" });

  const dhikr = findWord(10, ["\u0630","\u0643","\u0631"]);
  if (dhikr) e.terminology.push({ term: dhikr, transliteration: "dhikr", gloss: "mention/reminder (editorial gloss)", keys: ["21:10"] });
}

// === POPULATE P2 (21:30-50) ===
{
  const e = extractions[1];
  const rahman = findWord(36, ["\u0631","\u062d","\u0645","\u0646"]);
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["21:36"] });

  e.propheticNarratives.push({ label: "Musa-Harun receiving furqan (criterion), dhaw' (light), and dhikr (reminder) for the muttaqin", keys: ["21:48"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Universal mortality: every soul tastes death as trial of good and evil", keys: ["21:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Human hastiness (ajul) in demanding immediate punishment rather than patience", keys: ["21:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Geological stabilization through firmly-set mountains preventing earth-shaking", keys: ["21:31"], evidenceClass: "EXPLICIT_TEXT" });

  const furqan = findWord(48, ["\u0641","\u0631","\u0642"]);
  if (furqan) e.terminology.push({ term: furqan, transliteration: "furqan", gloss: "criterion/distinction (editorial gloss)", keys: ["21:48"] });
}

// === POPULATE P3 (21:51-93) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["21:87"], excerpt: fv(87), description: "Dhu al-Nun's supplication: La ilaha illa Anta subhanaka inni kuntu min al-zalimin." });

  e.propheticNarratives.push({ label: "Ibrahim idol destruction: sound judgement demonstrated; largest-idol rhetorical trap; fire miracle as divine protection", keys: ["21:51","21:52","21:53","21:54","21:55","21:56","21:57","21:58","21:59","21:60","21:61","21:62","21:63","21:64","21:65","21:66","21:67","21:68","21:69","21:70"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Yunus (Dhu al-Nun): departed in anger thinking divine power limited; called from darkness with tawheed-tasbih-confession; rescued and believers similarly saved", keys: ["21:87","21:88"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Zakariyya-Yahya: faithful petition for heir despite old age; wife made suitable; hastening in good deeds with hope-fear-humility", keys: ["21:89","21:90"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Ummah wahidah (single community) principle before division into sects", keys: ["21:92"], evidenceClass: "EXPLICIT_TEXT" });

  const ummah = findWord(92, ["\u0623","\u0645","\u0629"]);
  if (ummah) e.terminology.push({ term: ummah, transliteration: "ummah", gloss: "community/nation (editorial gloss)", keys: ["21:92"] });
}

// === POPULATE P4 (21:94-112) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["21:108"], excerpt: fv(108), description: "Say: It is only revealed to me that your god is one God — will you be Muslims?" });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["21:112"], excerpt: fv(112), description: "My Lord judge in truth; our Lord is Most Merciful whose help is sought against what you describe." });

  e.humanConditionsAndSpiritualStates.push({ label: "Rahmatan lil-alamin: prophet sent exclusively as mercy to all worlds", keys: ["21:107"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Yajuj-Majuj release from every elevation as eschatological sign preceding true promise", keys: ["21:96"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine judgment appeal: Prophet invokes Rabb as Hakam bil-haqq against disbeliever descriptions", keys: ["21:112"], evidenceClass: "EXPLICIT_TEXT" });

  const rahmah = findWord(107, ["\u0631","\u062d","\u0645","\u0629"]);
  if (rahmah) e.terminology.push({ term: rahmah, transliteration: "rahmah", gloss: "mercy (editorial gloss)", keys: ["21:107"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `021-al-anbiya-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 021-al-anbiya-p${num}.json`);
}

// === CANDIDATES (cand-0827..cand-0866, 40 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-021-p1,ext-021-p2,ext-021-p3,ext-021-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0827..0836)
  { id: "cand-0827", label: "Reckoning imminence met with heedless playfulness", def: "In 21:1-2: Their account has approached while they are in heedlessness turning away; no mention comes anew except they listen at play.", key: "21:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Hisab approaching."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Ghaflah as reception barrier."}] },
  { id: "cand-0828", label: "Prophet humanity affirmed against supernatural expectations", def: "In 21:3,8: Is this except human like yourselves; We did not make prophets forms not eating food nor immortal.", key: "21:3", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Bashar mithlukum affirmed."},{topicId:"human-dignity",layer:"scholarly",relationship:"related-not-identical",note:"Shared mortality."}] },
  { id: "cand-0829", label: "Creation not play but purposeful negating divine amusement", def: "In 21:16-17: We did not create heavens earth and between in play; had We intended amusement taken it from Ourselves.", key: "21:16", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"La'b negated."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Purposeful creation as rububiyyah."}] },
  { id: "cand-0830", label: "Book as dhikr demanding intellectual engagement", def: "In 21:10: We sent down Book containing your mention; will you not reason (afala ta'qilun)?", key: "21:10", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Dhikr fihi function."},{topicId:"intellect-importance",layer:"scholarly",relationship:"same-concept",note:"Aql as reception faculty."}] },
  { id: "cand-0831", label: "Prior destruction pattern establishing historical precedent", def: "In 21:6: Not a city We destroyed believed before them; so will they believe?", key: "21:6", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Repeated pattern."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Historical evidence."}] },
  { id: "cand-0832", label: "Fleeing punishment futility demonstrating divine omnipresence", def: "In 21:12-15: When perceived punishment fled; do not flee return to luxury; said woe us wrongdoers; ceased not until made stubble.", key: "21:12", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"No escape from divine reach."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Belated recognition."}] },
  { id: "cand-0833", label: "Universal mortality and trial-return cycle", def: "In 21:35: Every soul tastes death; We test you with evil and good as trial; to Us you are returned.", key: "21:35", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Khayr-sharr as ibtila'."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Return to divine reckoning."}] },
  { id: "cand-0834", label: "Divine self-sufficiency negating need for partners", def: "In 21:17: Had We intended amusement We would have taken it from Ourselves if We were doing.", key: "21:17", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Self-sufficiency excluding partners."},{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"No external dependency."}] },
  { id: "cand-0835", label: "Truth hurling upon falsehood causing its perishing", def: "In 21:18: Rather We hurl truth upon falsehood so it destroys it; behold it perishes.", key: "21:18", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Haqq-batil dynamic."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Truth's destructive power over falsehood."}] },
  { id: "cand-0836", label: "Angelic perpetual worship without fatigue as model devotion", def: "In 21:20: They glorify night and day never flagging.", key: "21:20", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Continuous tasbih."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Uninterrupted dhikr."}] },

  // P2 (cand-0837..0846)
  { id: "cand-0837", label: "Heavens-earth separation and water-life origin as creation signs", def: "In 21:30: Have disbelievers not seen heavens earth were joined We clove apart; made from water everything living.", key: "21:30", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Cosmic-biological dual sign."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Separation as creative act."}] },
  { id: "cand-0838", label: "Geological stabilization through firmly-set mountains", def: "In 21:31: Placed firmly set mountains on earth lest it shake with you; made broad paths perhaps guided.", key: "21:31", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Rawasi as stability sign."},{topicId:"environmental-corruption",layer:"scholarly",relationship:"related-not-identical",note:"Prevention of chaos."}] },
  { id: "cand-0839", label: "Celestial protection and orbital precision as cosmic order", def: "In 21:33: Made sky protected ceiling yet turn away; each in orbit swimming.", key: "21:33", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Saqf mahfuz and falak."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Orbital maintenance."}] },
  { id: "cand-0840", label: "Human hastiness in demanding immediate punishment", def: "In 21:37: Man was created of haste; I will show you My signs so do not urge Me.", key: "21:37", overlap: [{topicId:"patience-haste",layer:"scholarly",relationship:"same-concept",note:"Ajul as inherent trait."},{topicId:"divine-wisdom",layer:"scholarly",relationship:"related-not-identical",note:"Divine timing vs human urgency."}] },
  { id: "cand-0841", label: "Rahman as sole protector negating false guardians", def: "In 21:42: Say who protects you night day from Rahman; yet turn away from remembrance.", key: "21:42", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Exclusive divine protection."},{topicId:"remembrance",layer:"curated",relationship:"related-not-identical",note:"Protection linked to dhikr."}] },
  { id: "cand-0842", label: "Eschatological scales ensuring exact individual justice", def: "In 21:47: Set scales of justice Day Resurrection; no soul wronged anything even mustard seed suffice reckoner.", key: "21:47", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Mawazin al-qist."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Exact reckoning."}] },
  { id: "cand-0843", label: "Musa-Harun receiving furqan-dhaw-dhikr triad for muttaqin", def: "In 21:48: Gave Musa and Harun the criterion and light and reminder for the God-conscious.", key: "21:48", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Triple revelation gift."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Muttaqin as beneficiaries."}] },
  { id: "cand-0844", label: "Prior messenger ridicule pattern preceding divine response", def: "In 21:41: Already ridiculed messengers before you; descended upon scoffers what they used to mock.", key: "21:41", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Recurring istihza'."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Mockery returning upon mockers."}] },
  { id: "cand-0845", label: "Destroyed-city return impossibility establishing finality", def: "In 21:95: Prohibited to any city We destroyed that they return.", key: "21:95", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Irreversible destruction."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Absence as permanent sign."}] },
  { id: "cand-0846", label: "Divine majesty-honor as closing attributes", def: "In 21:50: Blessed is the name of your Lord Possessor of Majesty and Honor.", key: "21:50", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Dhu al-jalal wa'l-ikram."},{topicId:"remembrance",layer:"curated",relationship:"related-not-identical",note:"Name blessing through invocation."}] },

  // P3 (cand-0847..0856)
  { id: "cand-0847", label: "Ibrahim sound judgement demonstrated through idol-destruction rhetoric", def: "In 21:51-67: Gave Ibrahim rushd; asked about statues; said fathers worshippers; said manifest error; broke idols left largest; asked it speak; admitted shame.", key: "21:51", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Rushd as rational capacity."},{topicId:"intellect-importance",layer:"scholarly",relationship:"same-concept",note:"Logic exposing shirk."}] },
  { id: "cand-0848", label: "Fire miracle as divine protection reversing oppressor intent", def: "In 21:69: Said O fire be cool and safe for Ibrahim; wanted harm made them greatest losers.", key: "21:69", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Nar barid salam."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Element subjugation."}] },
  { id: "cand-0849", label: "Yunus darkness supplication as universal rescue formula", def: "In 21:87-88: Dhu al-Nun went angry thought We powerless; called la ilaha illa Anta subhanaka inni kuntu min al-zalimin; responded saved; thus save believers.", key: "21:87", overlap: [{topicId:"yunus-story",layer:"scholarly",relationship:"same-concept",note:"Dua dhu al-nun."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Universal rescue template."}] },
  { id: "cand-0850", label: "Zakariyya-Yahya grant responding to faithful petition", def: "In 21:89-90: Zakariyya called Lord leave not alone best inheritors; responded gave Yahya made wife suitable; hastened good deeds hoping fearing humble.", key: "21:89", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Faithful petition answered."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Righteous progeny as divine gift."}] },
  { id: "cand-0851", label: "Maryam chastity and Isa as unified sign for all worlds", def: "In 21:91: She who guarded chastity; breathed into her Our spirit; made her and son a sign for the worlds.", key: "21:91", overlap: [{topicId:"isa-story",layer:"scholarly",relationship:"same-concept",note:"Ayah lil-alamin."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Dual sign: mother and son."}] },
  { id: "cand-0852", label: "Ummah wahidah principle before sectarian division", def: "In 21:92: Indeed this community of yours is one community and I am your Lord so worship Me.", key: "21:92", overlap: [{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Ummah wahidah as ideal."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Unity grounded in exclusive worship."}] },
  { id: "cand-0853", label: "Lut deliverance from abomination-community with family exception", def: "In 21:71-74: Delivered Lut to blessed land; gave Isaac Yaqub; made righteous leaders; wife destined remain behind.", key: "21:71", overlap: [{topicId:"lut-story",layer:"scholarly",relationship:"same-concept",note:"Najat from fahishah."},{topicId:"parents-and-family",layer:"curated",relationship:"related-not-identical",note:"Spousal exception to salvation."}] },
  { id: "cand-0854", label: "Nuh salvation paired with collective drowning as dual outcome", def: "In 21:76-77: Nuh called We responded saved family great distress; helped against people who denied signs; drowned all.", key: "21:76", overlap: [{topicId:"nuh-story",layer:"scholarly",relationship:"same-concept",note:"Salvation-destruction duality."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Nasr as divine aid."}] },
  { id: "cand-0855", label: "Ayyub patience rewarded with restored family and mercy", def: "In 21:83-84: Ayyub called harm touched me Most Merciful of merciful; responded removed harm restored family plus like as mercy.", key: "21:83", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr rewarded."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Rahmah as restoration."}] },
  { id: "cand-0856", label: "Ibrahim-Ishaq-Yaqub lineage as righteous leadership model", def: "In 21:72-73: Gave Isaac Yaqub additional gift; made all righteous; appointed leaders guiding by command; inspired prayer zakah; worshippers.", key: "21:72", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Multi-generational righteousness."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"Imams yahduna bi-amrina."}] },

  // P4 (cand-0857..0866)
  { id: "cand-0857", label: "Righteous effort guaranteed recognition without denial", def: "In 21:94: Whoever does righteous deeds as believer no denial of effort nor are We forgetful.", key: "21:94", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La kufr li-sa'yih."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Non-forgetfulness as guarantee."}] },
  { id: "cand-0858", label: "Yajuj-Majuj release from every elevation as eschatological sign", def: "In 21:96: Until Gog and Magog are let loose from every elevation rushing.", key: "21:96", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ya'juj-Ma'juj emergence."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Pre-judgment chaos."}] },
  { id: "cand-0859", label: "True promise proximity causing disbeliever visual shock", def: "In 21:97: True promise draws near; stares of disbelievers glazed; woe to us we were heedless.", key: "21:97", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Wa'd haqq approaching."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Belated awareness."}] },
  { id: "cand-0860", label: "Cosmic folding mirroring initial creation as resurrection proof", def: "In 21:104: Day We fold heaven like folding scroll for records; as began first creation repeat it; promise binding.", key: "21:104", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Tayy al-sama' as reversal."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Re-creation as repeated act."}] },
  { id: "cand-0861", label: "Zabur confirmation of righteous inheritance of earth", def: "In 21:105: Written in Zabur after dhikr that land inherited by righteous servants.", key: "21:105", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ard yarithuha."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Salihun as inheritors."}] },
  { id: "cand-0862", label: "Quran as balagh for worshipping community", def: "In 21:106: Indeed in this is notification (balagh) for a worshipping people (qaum 'abidin).", key: "21:106", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Balagh as communicative function."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Abidin as target audience."}] },
  { id: "cand-0863", label: "Rahmatan lil-alamin as universal prophetic mission definition", def: "In 21:107: We sent you not except as mercy to the worlds (rahmatan lil-alamin).", key: "21:107", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Universal mercy mandate."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Rahmah as mission essence."}] },
  { id: "cand-0864", label: "Flexible divine naming with asma al-husna closure", def: "In 21:112: Our Lord is Most Merciful whose help is sought against what you describe.", key: "21:112", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Rahman musta'an."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Closing dua format."}] },
  { id: "cand-0865", label: "Mutual waiting challenge distinguishing guided from misguided", def: "In 21:112: My Lord judge in truth — mutual waiting for divine verdict.", key: "21:112", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Temporal delay as discriminator."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Divine hukm as resolution."}] },
  { id: "cand-0866", label: "Declaration of equal announcement removing prophetic responsibility", def: "In 21:109: If they turn away say I announced equally; know not near or far what you are promised.", key: "21:109", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Balagh removing liability."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Equal notification ensuring fairness."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(30, 40).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `021-al-anbiya-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-045.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-045.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
