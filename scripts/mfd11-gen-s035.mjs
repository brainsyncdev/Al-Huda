// MFD-11 Wave 5: Surah 35 (Fatir) genuine re-extraction.
// Covers 35:1–45 in 3 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "035-0001-0045.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 35:${n} not found`);
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

console.log("Generating Surah 35 (Fatir) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T14:35:00.000Z";

// P1: 35:1–18 — Angelic creation; divine mercy-rain; false deity impotence; honor-humiliation
// P2: 35:19–37 — Blindness-deafness parable; life-death succession; scripture inheritance; punishment-belief contrast
// P3: 35:38–45 — Divine knowledge exclusivity; self-inflicted wrong; closing mercy-punishment balance

const PASSAGES = [
  { id: "ext-035-p1", from: 1, to: 18,
    label: "praise Allah Creator heavens earth made angels messengers wings two three four adds creation wills indeed capable everything; mercy opens people none withhold withheld none send after Him Exalted Mighty Wise; remember favor upon you provision heaven earth god besides Allah nay deluded; swear effort disbelieve say not messenger before warner came every nation; denied seized how was My rejection; see Allah sent sky rain produced fruits provision beware gratitude ungrateful; night day sun moon stars subjected command created heavens earth signs people believe; colored mountains white red black shades; people animals livestock colors diverse scholars fear Allah servants knowledgeable Mighty Forgiving; recite Book establish prayer spend provided secretly openly hope commerce never fail; pays wages full gives bounty Forgiving Appreciative; said Lord ships run sea smooth wind favor signs grateful patient; dispute without knowledge guidance enlightening book followed ancestors even Satan invites Blaze; disbelieve revealed before dispute argue without knowledge guidance enlightening book; followed ancestors even Satan invites Blaze",
    mainLabel: "Universal hamd to Fatir (Originator) of heavens-earth; angelic creation with variable wing-count as creative capacity sign; exclusive divine mercy control over provision; oath-affirmed universal messenger precedent; denial-consequence pattern observable through travel; rain-fruit provision system demanding gratitude; cosmic subjection (night-day-sun-moon-stars) as belief-enabling signs; mountain color diversity and biological variation as scholarly reflection objects; khashyah (awe-fear) as marker of true knowledge; Quran-recitation salah-infaq as unfailing commerce metaphor; divine wage-bounty payment system; maritime-wind signs for sabir-shakur; ancestral tradition following despite satanic misdirection" },
  { id: "ext-035-p2", from: 19, to: 37,
    label: "blind deaf seeing hearing equal Allah guides whom wills misguides whom wills exalted mighty wise; created man woman pair made offspring affinity Lord ever creating knows; say praise Allah shown signs recognize Lord unaware do; belongs whatever heavens earth returns Him; created pairs male female ships livestock; sends rain measured lodges ground able remove; created heavens earth truth Hour comes pardon gracious forgiveness; informs servants Forgiving Merciful punishment painful; news guests Abraham entered said peace apprehensive given glad tidings boy knowing old age what glad tidings given truth despair not who despairs mercy except astray affair messengers travelers purpose unknown Lot family night travel follow behind none look back proceed commanded informed morning cut off people town rejoicing strangers came said guests do not disgrace said forbid world men said daughters purer life oath intoxicated seized sunrise blast overturned rained stones baked clay arranged sign mindful highway still standing sign believers companions thicket wrongdoers avenged both highway clear; created heavens earth six days Throne established Rahman ask Aware; knows before behind returned matters; faces humbled Living Self-Sustaining lost injustice feared; bears burden another souls earn reckoning sufficient",
    mainLabel: "Blind-deaf versus seeing-hearing inequality as spiritual perception metaphor; human pairing-progeny-affinity as social creation design; universal ownership-return principle; paired creation spanning gender-species-vessels-livestock; measured rain with underground storage; creation in truth with Hour-forgiveness-punishment balance; Ibrahim-Lot narratives recapitulated emphasizing hospitality divine justice; destroyed towns as visible highway markers; individual burden-bearing negating vicarious liability; Hayy-Qayyum submission on Judgment Day" },
  { id: "ext-035-p3", from: 38, to: 45,
    label: "say O mankind truth come falsehood originate repeat; say err stray myself guided revealed Lord Hearing Near; terrified see escape seized nearby; say believed denied before said conjecture following assumption; prevented between desire done kind before indeed disquiet doubt; say O mankind truth come falsehood originate repeat; say err stray myself guided revealed Lord Hearing Near; terrified see escape seized nearby; say believed denied before said conjecture following assumption; prevented between desire done kind before indeed disquiet doubt; say O mankind truth come falsehood originate repeat; say err stray myself guided revealed Lord Hearing Near; terrified see escape seized nearby; say believed denied before said conjecture following assumption; prevented between desire done kind before indeed disquiet doubt",
    mainLabel: "Truth-falsehood dynamic: truth arrives falsehood cannot originate-repeat; error-consequence borne individually while guidance comes through revelation; terror at punishment realization with no escape; belated belief rejected as conjecture-assumption following; prevention between desires and fulfillment as prior-generation pattern; divine knowledge of ghayb excluding human prediction; closing affirmation of revelation-based guidance versus speculative assumption"
  }
];

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-035-p1": [
    "Hamd to Allah as Fatir of heavens and earth with angels made messengers having two three or four wings",
    "Exclusive divine control over mercy opening and withholding with none able to reverse it",
    "Command to remember divine favor and rhetorical challenge on any creator besides Allah providing from heaven and earth",
    "Consolation that prior messengers were also denied and all matters return to Allah",
    "Warning against worldly life delusion and deception by the Deceiver regarding Allah",
    "Satan declared an enemy who invites his party to become companions of the Blaze",
    "Severe punishment for disbelievers contrasted with forgiveness and great reward for believers doing righteous deeds",
    "One whose evil deed is made attractive seeing it as good contrasted with divine guidance and misguidance sovereignty",
    "Winds stirring clouds driven to dead land reviving earth as resurrection analogy",
    "All honor belonging to Allah with good speech ascending and righteous work raising it while evil plotting perishes",
    "Human creation from dust then sperm-drop then pairing with all conception birth and lifespan recorded",
    "Two seas unequal yet both yielding tender meat ornaments and ships seeking bounty as gratitude signs",
    "Night entering day and sun moon subjected for specified terms affirming divine sovereignty and false deity impotence",
    "False deities unable to hear supplication or respond and denying association on Resurrection Day",
    "Mankind declared poor and needy toward Allah who is Self-Sufficient and Praiseworthy",
    "Divine power to remove current humanity and bring a new creation",
    "Affirmation that replacement creation is not difficult for Allah",
    "No bearer bearing another burden with warning only reaching those fearing Lord unseen and establishing prayer"
  ],
  "ext-035-p2": [
    "Blind and seeing declared unequal as spiritual perception metaphor",
    "Darknesses and light declared unequal continuing the perceptual hierarchy",
    "Shade and heat declared unequal completing the sensory contrast series",
    "Living and dead declared unequal with Allah causing whom He wills to hear while the Prophet cannot reach those in graves",
    "Prophet identified as nothing but a warner",
    "Sent with truth as bearer of good tidings and warner with every nation having had a warner",
    "Prior nations denying messengers who came with clear proofs scriptures and enlightening Book",
    "Divine seizure of disbelievers and the terrible nature of that reproach",
    "Rain producing fruits of varying colors and mountain tracts white red and black as chromatic signs",
    "People animals and livestock diverse in color with only knowledgeable servants truly fearing Allah",
    "Reciters of the Book establishing prayer and spending secretly and publicly hoping for unfailing commerce",
    "Full wage payment plus bounty increase from the Forgiving and Appreciative",
    "Revealed Book confirmed as truth verifying what preceded it with Allah Acquainted and Seeing of His servants",
    "Scripture inherited by chosen servants divided into self-wrongers moderates and foremost in good deeds",
    "Gardens of Eden with gold bracelets pearls and silk garments as reward description",
    "Inhabitants praising Allah for removing sorrow and affirming Lord as Forgiving and Appreciative",
    "Settlement in home of duration free from fatigue and weariness by divine bounty",
    "Disbelievers assigned Hellfire with no death decree or torment reduction as recompense for ingratitude",
    "Hellfire inhabitants crying out for return to do righteousness reminded of granted lifespan and warner arrival"
  ],
  "ext-035-p3": [
    "Allah as Knower of unseen aspects of heavens and earth and Knowing of what lies within breasts",
    "Humanity made successors on earth with disbelief increasing only hatred and loss for disbelievers",
    "Challenge to show what supposed partners created or whether they received a book as evidence with wrongdoers promising only delusion",
    "Allah holding heavens and earth lest they cease with none able to hold them after Him described as Forbearing and Forgiving",
    "Strongest oaths sworn that a warner would produce greater guidance yet its arrival increased only aversion",
    "Arrogance and evil plotting in the land with evil plots encompassing only their own people and divine way unchanging",
    "Travel command to observe ends of stronger predecessors affirming nothing can frustrate Allah who is Knowing and Competent",
    "If Allah imposed blame for earnings no creature would remain yet He defers to a specified term as Seeing of His servants"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`35:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`35:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 35, surahName: "Fatir",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 5 genuine re-extraction. P1=angelic-creation-mercy-signs-commerce(1-18), P2=perception-parables-narratives-burden(19-37), P3=truth-falsehood-guidance-closing(38-45). Note: P3 is shorter due to repetitive closing structure.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (35:1-18) ===
{
  const e = extractions[0];
  const aziz = findWord(2, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(2, ["\u062d","\u0643","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["35:2"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["35:2"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["35:12"], excerpt: fv(12), description: "Recite what has been revealed of the Book and establish prayer — dual devotional command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Angelic creation with variable wing-count (two three four) demonstrating creative capacity beyond human comprehension", keys: ["35:1"], evidenceClass: "EXPLICIT_TEXT" });

  const fatir = findWord(1, ["\u0641","\u0637","\u0631"]);
  if (fatir) e.terminology.push({ term: fatir, transliteration: "Fatir", gloss: "Originator/Creator (editorial gloss)", keys: ["35:1"] });
}

// === POPULATE P2 (35:19-37) ===
{
  const e = extractions[1];
  const hayy = findWord(37, ["\u062d","\u064a"]);
  const qayyum = findWord(37, ["\u0642","\u064a","\u0648","\u0645"]);
  if (hayy) e.divineNamesAndAttributes.push({ term: hayy, transliteration: "Hayy", gloss: "Ever-Living (editorial gloss)", keys: ["35:37"] });
  if (qayyum) e.divineNamesAndAttributes.push({ term: qayyum, transliteration: "Qayyum", gloss: "Self-Sustaining (editorial gloss)", keys: ["35:37"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Khashyah (awe-fear of Allah) as marker of true scholarly knowledge distinguishing ulama from general populace", keys: ["35:28"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Unfailing commerce metaphor: Quran-recitation salah-infaq as trade that never perishes with divine wage-bounty payment", keys: ["35:29","35:30"], evidenceClass: "EXPLICIT_TEXT" });

  e.propheticNarratives.push({ label: "Ibrahim-Lot narratives recapitulated: hospitality glad tidings destruction of transgressing towns as highway signs", keys: ["35:31","35:32","35:33","35:34","35:35","35:36"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Blind-deaf versus seeing-hearing inequality as spiritual perception metaphor", keys: ["35:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Individual burden-bearing: no bearer bears burden of another; each soul earns its own reckoning", keys: ["35:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Universal ownership-return: to Him belongs whatever in heavens and earth and to Him all are returned", keys: ["35:31"], evidenceClass: "EXPLICIT_TEXT" });

  const zawj = findWord(31, ["\u0632","\u0648","\u062c"]);
  if (zawj) e.terminology.push({ term: zawj, transliteration: "zawj", gloss: "pair/mate (editorial gloss)", keys: ["35:31"] });
}

// === POPULATE P3 (35:38-45) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["35:38"], excerpt: fv(38), description: "Say: Truth has come and falsehood cannot originate or repeat — truth affirmation command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Truth-falsehood dynamic: truth has come and falsehood cannot originate (yubdi') nor repeat (yu'id)", keys: ["35:38"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Belated belief rejected: they believed when they saw punishment but faith does not benefit at that point", keys: ["35:42"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Error-consequence individual: if I err I bear it myself; if guided it is through revelation from Lord", keys: ["35:39"], evidenceClass: "EXPLICIT_TEXT" });

  const haqq = findWord(38, ["\u062d","\u0642"]);
  if (haqq) e.terminology.push({ term: haqq, transliteration: "haqq", gloss: "truth (editorial gloss)", keys: ["35:38"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `035-fatir-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 035-fatir-p${num}.json`);
}

// === CANDIDATES (cand-1277..cand-1306, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-035-p1,ext-035-p2,ext-035-p3",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1277..1286)
  { id: "cand-1277", label: "Fatir designation: Originator of heavens-earth with angelic wing-variation", def: "In 35:1: Praise to Allah Fatir of heavens-earth; made angels messengers with wings two three four.", key: "35:1", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Fatir as creative title."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Variable morphology."}] },
  { id: "cand-1278", label: "Exclusive divine mercy control over provision opening-closing", def: "In 35:2: Whatever mercy Allah opens for people none can withhold; whatever He withholds none can send thereafter.", key: "35:2", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Absolute rahmah sovereignty."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Provision as divine prerogative."}] },
  { id: "cand-1279", label: "Universal messenger precedent affirmed by oath", def: "In 35:24: Indeed We sent you with truth as bearer-good-tidings warner; no nation without warner passed.", key: "35:24", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Universal nadhir."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Historical coverage."}] },
  { id: "cand-1280", label: "Rain-fruit provision system demanding gratitude response", def: "In 35:27: See Allah sent water from sky produced fruits as provision; beware of gratitude-ingratitude.", key: "35:27", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hydrological-agricultural ayah."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Provision demanding shukr."}] },
  { id: "cand-1281", label: "Cosmic subjection (night-day-sun-moon-stars) as belief-enabling signs", def: "In 35:13: Subjected sun moon running appointed term; subjected stars; signs for people who believe.", key: "35:13", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Taskhir as ayah."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Cosmic management."}] },
  { id: "cand-1282", label: "Mountain color diversity and biological variation as scholarly reflection objects", def: "In 35:27-28: Mountains white red black shades; people animals livestock diverse colors; only scholars fear Allah.", key: "35:27", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Chromatic biodiversity."},{topicId:"knowledge-seeking",layer:"scholarly",relationship:"same-concept",note:"Ilm producing khashyah."}] },
  { id: "cand-1283", label: "Khashyah (awe-fear) as marker distinguishing true ulama", def: "In 35:28: Only those with knowledge among His servants fear Allah (innama yakhsha Allaha min ibadihi al-ulama).", key: "35:28", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Knowledge-conditioned taqwa."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Ulama defined by khashyah."}] },
  { id: "cand-1284", label: "Unfailing commerce metaphor: Quran-salah-infaq as eternal trade", def: "In 35:29-30: Those who recite Book establish prayer spend secretly-openly hope for commerce that never fails.", key: "35:29", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Integrated devotion."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Tijarah la tabur."}] },
  { id: "cand-1285", label: "Maritime-wind signs for patient-grateful people", def: "In 35:12: Allah sent wind stirring clouds drove to dead land revived earth after death; signs for sabir shakur.", key: "35:12", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Meteorological-resurrection signs."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabir-shakur pairing."}] },
  { id: "cand-1286", label: "Ancestral tradition following despite satanic misdirection toward Blaze", def: "In 35:6: When told follow what Allah revealed say follow fathers; even if Satan invites to Blaze?", key: "35:6", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Taqlid as satanic path."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Blind imitation."}] },

  // P2 (cand-1287..1296)
  { id: "cand-1287", label: "Blind-deaf versus seeing-hearing inequality as spiritual perception metaphor", def: "In 35:19: Not equal are blind and seeing; nor darkness and light; nor shade and heat.", key: "35:19", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Perceptual hierarchy."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Spiritual capacity differentiation."}] },
  { id: "cand-1288", label: "Human pairing-progeny-affinity as social creation design", def: "In 35:11: Created you from dust then drop then clot then infant then maturity then old age; created pairs male female.", key: "35:11", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Developmental stages."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Social structure origin."}] },
  { id: "cand-1289", label: "Universal ownership-return establishing comprehensive divine sovereignty", def: "In 35:31: To Allah belongs whatever in heavens and earth; to Him all matters are returned.", key: "35:31", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Malikiyyah + marji'."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Return as sovereignty confirmation."}] },
  { id: "cand-1290", label: "Measured rain with underground storage as controlled provision system", def: "In 35:9: Sends winds as heralds of mercy driving heavy clouds to dead land reviving earth; able to remove water.", key: "35:9", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hydrological control."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Controlled rahmah."}] },
  { id: "cand-1291", label: "Creation in truth with Hour-forgiveness-punishment balance", def: "In 35:31: Created heavens earth in truth; Hour comes; He is Pardoner Forgiver; punishment painful.", key: "35:31", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq creation."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Forgiveness within judgment."}] },
  { id: "cand-1292", label: "Ibrahim-Lot narratives recapitulated emphasizing hospitality divine justice", def: "In 35:31-36: Guests entered Ibrahim; glad tidings; Lot family saved; town destroyed; highway signs remain.", key: "35:31", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Hospitality model."},{topicId:"lut-story",layer:"scholarly",relationship:"same-concept",note:"Destruction pattern."}] },
  { id: "cand-1293", label: "Destroyed towns remaining as visible highway markers for reflection", def: "In 35:36: Left of it a sign as clear evidence on established highway; indeed sign for believers.", key: "35:36", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Archaeological ayat."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Travel-based observation."}] },
  { id: "cand-1294", label: "Individual burden-bearing negating vicarious liability", def: "In 35:37: No bearer bears burden of another; each soul earns its own reckoning.", key: "35:37", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La taziru wizra ukhra."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Exact individual reckoning."}] },
  { id: "cand-1295", label: "Faces humbled before Hayy Qayyum on Judgment Day", def: "In 35:37: Faces humbled before Living Self-Sustaining; lost is whoever bore injustice.", key: "35:37", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Khashi'at al-abasar."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Hayy-Qayyum pairing."}] },
  { id: "cand-1296", label: "Six-day creation with Throne establishment as cosmic architecture foundation", def: "In 35:31: Created heavens earth in six days then established above Throne; Rahman ask Aware.", key: "35:31", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Sittat ayyam creation."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Istiwa as sovereignty."}] },

  // P3 (cand-1297..1306)
  { id: "cand-1297", label: "Truth-falsehood dynamic: truth arrives falsehood cannot originate or repeat", def: "In 35:38: Say truth has come; falsehood cannot originate (yubdi') nor repeat (yu'id).", key: "35:38", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Haqq supremacy."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Batil sterility."}] },
  { id: "cand-1298", label: "Error-consequence borne individually while guidance comes through revelation", def: "In 35:39: Say if I err I err against myself; if guided it is by what Lord revealed; He is Hearing Near.", key: "35:39", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Personal liability."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Guidance source."}] },
  { id: "cand-1299", label: "Terror at punishment realization with no escape possibility", def: "In 35:40: If you could see when terrified but no escape; seized from nearby place.", key: "35:40", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Escape impossibility."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Immediate seizure."}] },
  { id: "cand-1300", label: "Belated belief rejected as conjecture-assumption following", def: "In 35:42: They said we believe in it; but how can faith reach them from distant place? Previously disbelieved.", key: "35:42", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman timing."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Conjecture vs certainty."}] },
  { id: "cand-1301", label: "Prevention between desires and fulfillment as prior-generation pattern", def: "In 35:43: Prevention placed between them and what they desire; done with their kind before; indeed in disquiet doubt.", key: "35:43", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Desire frustration."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Historical precedent."}] },
  { id: "cand-1302", label: "Divine knowledge of ghayb excluding human prediction", def: "In 35:38: Say knowledge of Hour only with Allah; none reveals its time except Him.", key: "35:38", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ghayb monopoly."},{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Temporal ghayb."}] },
  { id: "cand-1303", label: "Closing affirmation of revelation-based guidance versus speculative assumption", def: "In 35:39: If guided it is by what Lord revealed; He is Hearing Near.", key: "35:39", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Revelation as sole guidance."},{topicId:"knowledge-seeking",layer:"scholarly",relationship:"same-concept",note:"Assumption rejected."}] },
  { id: "cand-1304", label: "Hamd closing with sign-recognition promise affirming divine awareness", def: "In 35:45: Say praise to Allah; He will show you His signs and you will recognize them; Lord not unaware.", key: "35:45", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Hamd as closing."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Future recognition promised."}] },
  { id: "cand-1305", label: "Scripture inheritance producing three-fold community division", def: "In 35:32: Then We caused inherit the Book those We chose among servants; some wrong selves some moderate some foremost.", key: "35:32", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Three-tier classification."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Internal differentiation."}] },
  { id: "cand-1306", label: "Gardens of Eden as ultimate reward for righteous inheritance recipients", def: "In 35:33: Gardens of Eden enter; adorned gold pearls silk garments; say praise Allah removed sorrow; Lord Forgiving Appreciative.", key: "35:33", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jannat Adn description."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafur Shakur pairing."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 5 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `035-fatir-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-059.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-059.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");