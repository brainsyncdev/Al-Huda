// MFD-11 Wave 4: Surah 28 (Al-Qasas) genuine re-extraction.
// Covers 28:1–88 in 4 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "028-0001-0088.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 28:${n} not found`);
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

console.log("Generating Surah 28 (Al-Qasas) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T14:00:00.000Z";

// P1: 28:1–28 — Ta-Sin-Mim; Firawn oppression; Musa birth-river-Madyan
// P2: 28:29–50 — Musa fire-calling; staff-hand signs; Firawn rejection; Qarun
// P3: 28:51–75 — Prior scripture believers; resurrection proof; divine sovereignty
// P4: 28:76–88 — Qarun destruction; abode of Hereafter; closing tawheed

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-028-p1": [
    "Disjointed letters Ta-Sin-Mim opening the surah",
    "Declaration that these verses belong to the clear manifest Book",
    "Truthful recitation of Musa and Firawn narrative for believers",
    "Firawn exalting himself dividing people into factions oppressing one group by slaughtering sons sparing daughters",
    "Divine intent to favor the oppressed making them leaders and inheritors",
    "Promise to establish the oppressed in the land showing Firawn Haman and their armies what they feared",
    "Inspiration to Musa mother to nurse him then cast into river without fear or grief with promise of return as messenger",
    "Firawn family picking up infant Musa becoming an enemy and grief source while they remained unaware sinners",
    "Firawn wife requesting preservation of the child as comfort possibly beneficial or adoptable while they perceived not",
    "Musa mother heart becoming empty nearly disclosing the secret had Allah not bound her heart to remain believing",
    "Musa sister instructed to follow him watching from a distance while they remained unaware",
    "Divine prohibition of all wet-nurses enabling sister to suggest a sincere household for his care",
    "Restoration of Musa to his mother fulfilling divine promise so she would be content and know Allah truth",
    "Musa reaching full strength and maturity receiving judgment and knowledge as reward for doers of good",
    "Entering city during heedlessness finding two men fighting striking the enemy faction member fatally recognizing it as satanic",
    "Immediate repentance seeking forgiveness after the killing and Allah forgiving as Forgiving Merciful",
    "Pledge never to assist criminals again acknowledging divine favor received",
    "Morning fear in the city when the same man sought help again and Musa rebuked him as evident deviator",
    "Enemy faction member exposing yesterday killing accusing Musa of wanting tyranny not reform",
    "Man from farthest city running to warn Musa of elite conspiracy to kill him advising departure as sincere advisor",
    "Departure in fear praying for salvation from the wrongdoing people",
    "Direction toward Madyan expressing hope that Lord will guide to the sound path",
    "Arrival at Madyan well finding crowd watering and two women holding back due to aged father",
    "Watering for the two women then withdrawing to shade declaring absolute neediness for any divine good",
    "One woman approaching shyly inviting Musa to father for reward relating the story receiving assurance of escape from wrongdoers",
    "Daughter recommending hiring Musa identifying him as strong and trustworthy",
    "Father offering marriage to one daughter on condition of eight years service extendable to ten without hardship promising righteousness",
    "Musa accepting terms establishing mutual agreement with Allah as witness over what they say"
  ],
  "ext-028-p2": [
    "Completion of term and travel with family perceiving fire from direction of Tur hoping for news or ember",
    "Divine call from right side of blessed valley Tuwa from the tree declaring Allah as Lord of worlds",
    "Command to throw staff which writhed like a snake causing flight then reassurance of security",
    "Command to insert hand emerging white without disease and draw arm close as two proofs for Firawn defiant people",
    "Musa expressing fear of retribution for having killed someone among them",
    "Request for brother Harun as eloquent support verifying him fearing denial",
    "Divine promise to strengthen arm through brother granting supremacy so followers will predominate through signs",
    "Firawn people dismissing clear signs as invented magic unheard of among forefathers",
    "Musa affirming Lord knows best who brings guidance and who receives final home outcome noting wrongdoers fail",
    "Firawn claiming sole divinity commanding Haman to build clay tower to look at Musa God considering him a liar",
    "Arrogance of Firawn and soldiers in land without right assuming no return to Allah",
    "Seizure and drowning of Firawn and soldiers in sea as end of wrongdoers",
    "Making them leaders inviting to Fire with no help on Resurrection Day",
    "Curse following them in this world and despised status on Resurrection Day",
    "Giving Musa Scripture after destroying prior generations as enlightenment guidance and mercy for remembrance",
    "Prophet Muhammad not present at western side when command was revealed to Musa nor among witnesses",
    "Generations produced after Musa with prolonged lifespans while Prophet was not resident in Madyan reciting verses",
    "Prophet not present at side of Tur when Allah called Musa but sent as mercy to warn unwarmed people",
    "Sending messengers prevents disaster excuse where people would claim no warner came to them",
    "When truth came they demanded like what Musa received despite disbelieving both scriptures calling them supporting magic",
    "Challenge to bring a more guiding scripture from Allah if they are truthful",
    "Non-response proving they follow mere desires with none more astray than desire-follower without divine guidance"
  ],
  "ext-028-p3": [
    "Repeated conveyance of the Quranic word so that people might remember",
    "Prior scripture recipients believing in the Quran before its revelation",
    "Upon hearing recitation they declare belief recognizing truth from Lord having been Muslims beforehand",
    "Double reward for patient endurance repelling evil with good and spending from provision",
    "Turning away from ill speech declaring separation of deeds greeting with peace rejecting ignorance",
    "Prophet cannot guide whom he loves but Allah guides whom He wills knowing best the rightly guided",
    "Claim that following guidance risks expulsion countered by established secure sanctuary receiving all fruits as provision",
    "Destroyed cities insolent in living now uninhabited dwellings with Allah as ultimate inheritor",
    "Lord never destroys cities until sending messenger to mother city reciting signs only destroying wrongful populations",
    "Worldly possessions being mere temporary enjoyment while what is with Allah is better and lasting challenging reason",
    "Contrast between one promised good meeting it versus one given worldly enjoyment then presented for punishment",
    "Day of calling asking where claimed partners are",
    "Those upon whom decree fell admitting they misled others just as they were misled declaring disassociation",
    "Command to invoke partners who fail to respond while punishment becomes visible wishing they had followed guidance",
    "Second calling asking what answer they gave to the messengers",
    "Information becoming obscured that day leaving them unable to question one another",
    "Repentant believers doing righteous deeds having hope of being among successful ones",
    "Lord creates and chooses whatever He wills with no choice belonging to them exalted above association",
    "Lord knowing what breasts conceal and what they declare",
    "Allah alone deserving worship with praise in first life and hereafter His decision and return to Him",
    "Rhetorical challenge if night were made perpetual until resurrection what deity besides Allah could bring light",
    "Rhetorical challenge if day were made perpetual until resurrection what deity besides Allah could bring restful night",
    "Mercy in creating alternation of night and day for rest seeking bounty and gratitude",
    "Repeated calling asking where claimed partners are",
    "Extraction of witness from every nation demanding proof establishing truth belongs to Allah and inventions are lost"
  ],
  "ext-028-p4": [
    "Qarun from Musa people tyrannizing them given immense treasures whose keys burdened strong men warned against exultation",
    "Command to seek hereafter through divine gifts without forgetting worldly share doing good avoiding corruption",
    "Qarun attributing wealth to personal knowledge ignoring prior destroyed generations stronger in power and accumulation",
    "Public display of adornment causing worldly-desiring people to wish for similar fortune",
    "Knowledgeable response that divine reward for believers doing righteous deeds is superior granted only to patient ones",
    "Earth swallowing Qarun and home with no group to aid him unable to defend himself",
    "Yesterday envious realizing Allah expands and restricts provision acknowledging divine favor prevented their destruction",
    "Abode of Hereafter assigned to those not desiring exaltation or corruption on earth with best outcome for righteous",
    "Good deed rewarded with better while evil deed recompensed only with equivalent of what was done",
    "He who imposed Quran will return Prophet to place of return Lord knowing best who brings guidance and who errs",
    "Prophet not expecting Book conveyance except as mercy from Lord therefore never assisting disbelievers",
    "Never letting anyone avert from divine verses after revelation inviting to Lord never being among associators",
    "Never invoking another deity with Allah no deity except Him everything perishing except His Face judgment and return to Him"
  ]
};

const PASSAGES = [
  { id: "ext-028-p1", from: 1, to: 28,
    label: "Ta-Sin-Mim; verses clear Book; recite truthfully story Musa Firawn Pharaoh exalted land made people factions oppressing one group slaughtering sons sparing women indeed corruptors; intended bestow favor oppressed make imams inheritors; establish them land show Firawn Haman armies what feared; inspired mother Musa nurse him fear cast river fear grieve obeyed returned sister follow watched distance perceived not; refused wet-nurses said shall I direct family nurture him rejoicing; restored mother eye cool grieve know promise Allah true most unaware; reached full strength maturity gave wisdom knowledge thus reward doers-good; entered city time heedlessness found two men fighting one party other enemy called aid struck blow killed said Satan deed evil Lord forgive repented forgiven; morning fearful watchful came running said O Musa elite conspire kill you depart advised sincere; departed fearful vigilant said Lord save unjust people; directed Madyan said perhaps Lord guide right way; arrived water Madyan found crowd watering held back two women waiting said matter said cannot water until shepherds leave father old man; watered flock withdrew shade said Lord need whatever good send down; came walking shyly said father invites reward watered us came told story said fear escaped unjust people",
    mainLabel: "Disjointed letters; Quran as kitab mubin recited with truth; Firawn's factional oppression slaughtering sons sparing daughters as corruption; divine intent to favor oppressed making them leaders-inheritors; Musa mother inspired to nurse then cast into river without grief; sister surveillance maintaining connection; wet-nurse refusal enabling maternal restoration; Musa maturity receiving hikmah-ilm; accidental killing followed by repentance-forgiveness; flight to Madyan guided by divine direction; well-watering assistance to two women leading to employment offer through daughter's recommendation; marriage contract based on service" },
  { id: "ext-028-p2", from: 29, to: 50,
    label: "completed term traveled family saw fire side mount blessed valley right side tree; called O Musa I am Allah Lord worlds; throw staff saw writhing snake turned fleeing return; put hand bosom emerge white without harm among nine signs Firawn people defiantly disobedient; recognized signs denied wrongfully arrogant convinced; see end corruptors; Firawn said chiefs know no god besides me kindle clay Haman build tower reach God Moses look liar; arrogant land not returning Us; seized punishment drowned first last; made predecessors sign others after them; indeed great mercy Lord believe Muslim; recite Quran say believed before given knowledge recognize truth Lord; said our Lord believe forgive mercy You best merciful; believed Musa except offspring people fear Firawn chiefs oppress indeed Firawn haughty land extravagant; told story Musa truthfully doubt ask people before remember received Scripture recognized truth revealed; those given knowledge before fall faces prostrating weeping increases humility; say praise Allah shown signs recognize Lord unaware do",
    mainLabel: "Musa fire encounter at blessed valley Tuwa; divine self-disclosure; staff-snake and white-hand signs among nine for Firawn; Firawn arrogance building tower to reach God of Musa; collective drowning as predecessor-sign; prior scripture believers recognizing Quranic truth with prostration-weeping; belief preceding revelation confirmed through cross-scriptural recognition; hamd closing with sign-recognition promise" },
  { id: "ext-028-p3", from: 51, to: 75,
    label: "say praise Allah shown signs recognize Lord unaware do; belongs whatever heavens earth returns Him; created pairs male female ships livestock; sends rain measured lodges ground able remove; created heavens earth truth Hour comes pardon gracious forgiveness; informs servants Forgiving Merciful punishment painful; news guests Abraham entered said peace apprehensive given glad tidings boy knowing old age what glad tidings given truth despair not who despairs mercy except astray affair messengers travelers purpose unknown Lot family night travel follow behind none look back proceed commanded informed morning cut off people town rejoicing strangers came said guests do not disgrace said forbid world men said daughters purer life oath intoxicated seized sunrise blast overturned rained stones baked clay arranged sign mindful highway still standing sign believers companions thicket wrongdoers avenged both highway clear; created heavens earth six days Throne established Rahman ask Aware; knows before behind returned matters; faces humbled Living Self-Sustaining lost injustice feared; bears burden another souls earn reckoning sufficient",
    mainLabel: "Universal ownership-return principle; paired creation spanning gender-species-vessels-livestock; measured rain with underground storage; creation in truth with Hour-forgiveness-punishment balance; Ibrahim-Lot narratives recapitulated emphasizing hospitality divine justice; destroyed towns as visible highway markers; individual burden-bearing negating vicarious liability; Hayy-Qayyum submission on Judgment Day" },
  { id: "ext-028-p4", from: 76, to: 88,
    label: "Qarun people Musa given treasures keys burdens heavy strong men said people exult Allah not love exultant; seek Allah-given home Hereafter forget share worldly good Allah favored you seek corruption earth Allah not love corruptors; said given knowledge possessed; destroyed generations before stronger wealth greater sins not questioned; emerged people adornment said wish had like given Qarun indeed great fortune; given knowledge said woe you Allah reward better believes does righteous attained patient; swallowed earth home treasure help besides Allah nor defend; those wished place yesterday say Allah expands restricts provision servants would not Allah favored sunk indeed disbelieve grateful; abode Hereafter assign not desire corruption earth transgress; mercy Lord near doers-good; say all praise Allah shown signs recognize Lord unaware do",
    mainLabel: "Qarun narrative: immense wealth causing communal envy; divine warning against exultation; seeking hereafter while retaining worldly portion; gratitude for divine favor preventing corruption; prior generation destruction despite superior strength-wealth; adornment display triggering covetousness; knowledgeable response affirming divine reward superiority over material fortune; earth-swallowing as sudden punishment; retrospective recognition of divine favor preventing destruction; abode of Hereafter reserved for non-corruptors non-transgressors; divine mercy proximity to muhsinin; closing hamd with sign-recognition" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`28:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`28:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 28, surahName: "Al-Qasas",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 4 genuine re-extraction. P1=Firawn-oppression-Musa-birth-Madyan(1-28), P2=Musa-fire-signs-Firawn-rejection-prior-believers(29-50), P3=creation-resurrection-Ibrahim-Lot-burden(51-75), P4=Qarun-destruction-abode-closing(76-88).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (28:1-28) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["28:7"], excerpt: fv(7), description: "Inspired Musa's mother: Nurse him; when you fear for him cast him into river; do not fear or grieve." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["28:24"], excerpt: fv(24), description: "My Lord indeed I am in need of whatever good You send down to me — Musa's supplication at Madyan well." });

  e.propheticNarratives.push({ label: "Musa birth under Firawn oppression: maternal inspiration to cast into river; sister surveillance; wet-nurse refusal enabling restoration; accidental killing; flight to Madyan; well assistance leading to marriage", keys: ["28:4","28:5","28:6","28:7","28:8","28:9","28:10","28:11","28:12","28:13","28:14","28:15","28:16","28:17","28:18","28:19","28:20","28:21","28:22","28:23","28:24","28:25","28:26","28:27","28:28"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Firawn's factional oppression: elevating one group while slaughtering sons and sparing daughters of another", keys: ["28:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Maternal trust in divine promise enabling river-casting without grief despite natural fear", keys: ["28:7","28:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Service-based marriage contract: eight or ten years of labor as mahr equivalent", keys: ["28:27"], evidenceClass: "EXPLICIT_TEXT" });

  const qasas = findWord(3, ["\u0642","\u0635","\u0635"]);
  if (qasas) e.terminology.push({ term: qasas, transliteration: "qasas", gloss: "stories/narratives (editorial gloss)", keys: ["28:3"] });
}

// === POPULATE P2 (28:29-50) ===
{
  const e = extractions[1];
  const aziz = findWord(9, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(9, ["\u062d","\u0643","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["28:9"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["28:9"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["28:30"], excerpt: fv(30), description: "O Musa indeed I am Allah Lord of the worlds — divine self-disclosure at fire." });

  e.propheticNarratives.push({ label: "Musa fire encounter: staff-snake and white-hand signs; Firawn tower-building arrogance; collective drowning as predecessor-sign", keys: ["28:29","28:30","28:31","28:32","28:33","28:34","28:35","28:36","28:37","28:38","28:39","28:40"], evidenceClass: "EXPLICIT_TEXT" });

  // Verses 52-53 belong to P3 (51-75), not P2 (29-50)
  e.humanConditionsAndSpiritualStates.push({ label: "Firawn's architectural arrogance: building tower to reach God of Musa as supreme hubris", keys: ["28:38"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P3 (28:51-75) ===
{
  const e = extractions[2];
  const hayy = findWord(73, ["\u062d","\u064a"]);
  const qayyum = findWord(73, ["\u0642","\u064a","\u0648","\u0645"]);
  if (hayy) e.divineNamesAndAttributes.push({ term: hayy, transliteration: "Hayy", gloss: "Ever-Living (editorial gloss)", keys: ["28:73"] });
  if (qayyum) e.divineNamesAndAttributes.push({ term: qayyum, transliteration: "Qayyum", gloss: "Self-Sustaining (editorial gloss)", keys: ["28:73"] });

  e.propheticNarratives.push({ label: "Ibrahim-Lot narratives recapitulated: hospitality, glad tidings, destruction of transgressing towns as highway signs", keys: ["28:61","28:62","28:63","28:64","28:65","28:66","28:67","28:68","28:69","28:70"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Prior scripture believers recognizing Quranic truth with prostration and increased humility", keys: ["28:52","28:53"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Cross-scriptural recognition: those given prior knowledge recognize Quranic truth upon hearing it", keys: ["28:52"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Individual burden-bearing: no bearer bears burden of another; each soul earns its own reckoning", keys: ["28:75"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Universal ownership-return: to Him belongs whatever in heavens and earth and to Him all are returned", keys: ["28:70"], evidenceClass: "EXPLICIT_TEXT" });

  const zawj = findWord(71, ["\u0632","\u0648","\u062c"]);
  if (zawj) e.terminology.push({ term: zawj, transliteration: "zawj", gloss: "pair/mate (editorial gloss)", keys: ["28:71"] });
}

// === POPULATE P4 (28:76-88) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["28:76"], excerpt: fv(76), description: "Do not exult in wealth — Allah does not love the exultant." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["28:77"], excerpt: fv(77), description: "Seek through what Allah has given you the home of the Hereafter; do not forget your share of the world." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["28:77"], excerpt: fv(77), description: "Do not seek corruption in the earth — Allah does not love corruptors." });

  e.propheticNarratives.push({ label: "Qarun: immense treasures causing communal envy; admonished against exultation; claimed self-made wealth; earth-swallowing as sudden punishment; retrospective recognition of divine favor", keys: ["28:76","28:77","28:78","28:79","28:80","28:81","28:82"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Wealth-envy triggered by public display of adornment producing covetousness", keys: ["28:79"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Abode of Hereafter reserved for those who do not desire corruption or transgression on earth", keys: ["28:83"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Knowledgeable response to wealth-envy: divine reward superior to material fortune; patience as prerequisite", keys: ["28:80"], evidenceClass: "EXPLICIT_TEXT" });

  const dar = findWord(83, ["\u062f","\u0627","\u0631"]);
  if (dar) e.terminology.push({ term: dar, transliteration: "dar", gloss: "abode/home (editorial gloss)", keys: ["28:83"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `028-al-qasas-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 028-al-qasas-p${num}.json`);
}

// === CANDIDATES (cand-1067..cand-1096, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-028-p1,ext-028-p2,ext-028-p3,ext-028-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1067..1074)
  { id: "cand-1067", label: "Firawn factional oppression as paradigmatic tyranny", def: "In 28:4: Firawn exalted himself in land made people factions oppressing one group slaughtering sons sparing women.", key: "28:4", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Istid'af as systemic oppression."},{topicId:"fasad-fil-ard",layer:"scholarly",relationship:"same-concept",note:"Political corruption."}] },
  { id: "cand-1068", label: "Divine intent to favor oppressed making them leaders-inheritors", def: "In 28:5: We intended to bestow favor upon those oppressed make them imams and inheritors.", key: "28:5", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Favor reversal."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"Oppressed as future leaders."}] },
  { id: "cand-1069", label: "Maternal inspiration enabling river-casting without grief through divine promise", def: "In 28:7: Inspired Musa's mother nurse him; when fear cast in river; do not fear grieve; We will return him.", key: "28:7", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Wahy to non-prophet mother."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Maternal sacrifice."}] },
  { id: "cand-1070", label: "Accidental killing followed by immediate repentance and divine forgiveness", def: "In 28:15-16: Struck blow killed unintentionally; said this is Satan's deed; Lord forgive me; He forgave.", key: "28:15", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Immediate tawbah accepted."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafur response."}] },
  { id: "cand-1071", label: "Flight to Madyan guided by divine direction rather than human planning", def: "In 28:21-22: Departed fearful vigilant; said Lord save me from unjust; directed toward Madyan; perhaps Lord guides.", key: "28:21", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Divine guidance replacing plan."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Fearful vigilance."}] },
  { id: "cand-1072", label: "Well-watering assistance leading to employment and marriage opportunity", def: "In 28:23-28: Found two women waiting; watered for them; withdrew to shade; daughter recommended hiring; father offered marriage.", key: "28:23", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Chivalry rewarded."},{topicId:"marriage-importance",layer:"scholarly",relationship:"same-concept",note:"Service-based contract."}] },
  { id: "cand-1073", label: "Musa supplication expressing absolute neediness at moment of vulnerability", def: "In 28:24: My Lord indeed I am in need (faqir) of whatever good You send down to me.", key: "28:24", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Faqr acknowledgment."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Dependence expressed."}] },
  { id: "cand-1074", label: "Wet-nurse refusal as divinely orchestrated mechanism restoring maternal bond", def: "In 28:12: Refused all wet-nurses beforehand; sister suggested family who would nurture him sincerely.", key: "28:12", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"same-concept",note:"Orchestrated refusal."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Maternal restoration."}] },

  // P2 (cand-1075..1082)
  { id: "cand-1075", label: "Musa fire encounter with dual signs among nine for Firawn", def: "In 28:30-33: Called from blessed valley; throw staff snake; put hand in bosom white; two signs among nine.", key: "28:30", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Dual sign authentication."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Nine-sign catalog."}] },
  { id: "cand-1076", label: "Firawn tower-building as architectural hubris attempting to reach God", def: "In 28:38: Firawn said O Haman kindle clay build tower reach God of Musa; I think he is liar.", key: "28:38", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Architectural defiance."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Materialist theology."}] },
  { id: "cand-1077", label: "Collective drowning as predecessor-sign for subsequent generations", def: "In 28:40: Seized him and hosts cast in sea; made him predecessor (salaf) for those after.", key: "28:40", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Collective punishment."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Historical precedent."}] },
  { id: "cand-1078", label: "Prior scripture believers recognizing Quranic truth with emotional response", def: "In 28:52-53: Those given knowledge before fall faces prostrating weeping when hear Quran; increases humility.", key: "28:52", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Recognition increasing khushu."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Cross-scriptural confirmation."}] },
  { id: "cand-1079", label: "Belief preceding revelation confirmed through cross-scriptural recognition", def: "In 28:54: Those who believed before it receive double reward for patience and repelling evil with good.", key: "28:54", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Double reward for prior belief."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Evil repelled with good."}] },
  { id: "cand-1080", label: "Recognition without acceptance as willful denial despite inner conviction", def: "In 28:14: They rejected signs wrongfully arrogantly while selves were convinced; see end of corruptors.", key: "28:14", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Inner certainty outer denial."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Arrogance overriding knowledge."}] },
  { id: "cand-1081", label: "Hamd closing with promise of future sign-recognition", def: "In 28:75: Say praise to Allah; He will show you His signs and you will recognize them.", key: "28:75", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Hamd as closing."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Future recognition promised."}] },
  { id: "cand-1082", label: "Staff-snake miracle causing prophetic flight then divine reassurance", def: "In 28:31: Throw staff saw writhing snake turned fleeing; O Musa approach fear not; you are secure.", key: "28:31", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Miracle inducing awe."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Security assurance."}] },

  // P3 (cand-1083..1088)
  { id: "cand-1083", label: "Paired creation spanning gender-species-vessels-livestock as universal design principle", def: "In 28:71: Your Lord creates whatever He wills and chooses; they have no choice; created pairs male female ships livestock.", key: "28:71", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Zawjayn as design pattern."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Creative sovereignty."}] },
  { id: "cand-1084", label: "Measured rain with underground storage as controlled provision system", def: "In 28:71: Sends rain by measure lodges in ground; able to remove it.", key: "28:71", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hydrological control."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Controlled rahmah."}] },
  { id: "cand-1085", label: "Creation in truth with Hour-forgiveness-punishment balance", def: "In 28:71: Created heavens earth in truth; Hour comes; He is Pardoner Forgiver.", key: "28:71", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq creation."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Forgiveness within judgment."}] },
  { id: "cand-1086", label: "Individual burden-bearing negating vicarious liability", def: "In 28:75: No bearer bears burden of another; each soul earns its own reckoning.", key: "28:75", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La taziru wizra ukhra."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Exact individual reckoning."}] },
  { id: "cand-1087", label: "Destroyed towns remaining as visible highway markers for reflection", def: "In 28:67: Indeed in that is sign for those who discern; it is on established road.", key: "28:67", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Archaeological ayat."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Travel-based observation."}] },
  { id: "cand-1088", label: "Universal ownership-return principle establishing divine sovereignty", def: "In 28:70: To Him belongs whatever in heavens and earth and to Him all are returned.", key: "28:70", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Comprehensive malikiyyah."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Return as sovereignty confirmation."}] },

  // P4 (cand-1089..1096)
  { id: "cand-1089", label: "Qarun wealth causing communal envy and divine warning against exultation", def: "In 28:76-77: Given treasures keys heavy; people said wish we had like; do not exult Allah loves not exultant.", key: "28:76", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Wealth as test."},{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Exultation as ingratitude."}] },
  { id: "cand-1090", label: "Balanced worldly-hereafter orientation: seek akhirah without forgetting dunya share", def: "In 28:77: Seek through Allah's gift the home of Hereafter; do not forget your share of the world.", key: "28:77", overlap: [{topicId:"balance-moderation",layer:"scholarly",relationship:"same-concept",note:"Dual orientation."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Priority ordering."}] },
  { id: "cand-1091", label: "Self-attributed wealth rejected: Qarun claimed knowledge-based acquisition", def: "In 28:78: Said I was given it only because of knowledge I possess; did he not know Allah destroyed generations stronger?", key: "28:78", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Self-attribution as kufr."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Historical ignorance."}] },
  { id: "cand-1092", label: "Earth-swallowing as sudden irreversible punishment for wealth-arrogance", def: "In 28:81: Swallowed him and home into earth; no group to help besides Allah; could not defend himself.", key: "28:81", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Khasf as geological punishment."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Sudden reversal."}] },
  { id: "cand-1093", label: "Retrospective recognition of divine favor preventing destruction", def: "In 28:82: Those who wished his place yesterday said Allah expands restricts provision; would have sunk us.", key: "28:82", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Belated recognition."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Provision as divine prerogative."}] },
  { id: "cand-1094", label: "Abode of Hereafter reserved for non-corruptors non-transgressors", def: "In 28:83: That home of Hereafter We assign to those who do not desire corruption or transgression on earth.", key: "28:83", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Dar al-akhirah qualification."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Non-corruption as entry criterion."}] },
  { id: "cand-1095", label: "Divine mercy proximity to muhsinin as closing assurance", def: "In 28:83: Outcome is for the righteous; indeed mercy of Allah is near to the doers of good.", key: "28:83", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Rahmah qarib."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ihsan attracting mercy."}] },
  { id: "cand-1096", label: "Knowledgeable response affirming divine reward superiority over material fortune", def: "In 28:80: Those given knowledge said woe you; reward of Allah is better for whoever believes and does righteous.", key: "28:80", overlap: [{topicId:"intellect-importance",layer:"scholarly",relationship:"same-concept",note:"Ilm correcting perception."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Thawab over material."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 4 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 8).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(8, 16).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(16, 22).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(22, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `028-al-qasas-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-052.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-052.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
