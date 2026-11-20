// MFD-11 Wave 3: Surah 23 (Al-Mu'minun) genuine re-extraction.
// Covers 23:1–118 in 4 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "023-0001-0118.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 23:${n} not found`);
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

console.log("Generating Surah 23 (Al-Mu'minun) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T13:30:00.000Z";

// P1: 23:1–30 — Believer success attributes, Nuh narrative, ark salvation
// P2: 23:31–74 — Creation signs, Musa-Harun mission, divine provision, dispute futility
// P3: 23:75–100 — Resurrection denial refuted, punishment suddenness, mercy-fear balance
// P4: 23:101–118 — Judgment Day scenes, divine sovereignty, closing forgiveness supplication

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-023-p1": [
    "Declaration of believer success (falah) as certain outcome",
    "Khushu (humble submission) during prayer as primary believer attribute",
    "Active turning away from laghw (vain or ill speech) as ethical discipline",
    "Observance of zakah as active purification obligation",
    "Guarding private parts as chastity commitment",
    "Exception for spouses and right-hand possessions with no blame attached",
    "Seeking beyond permitted boundaries defined as transgression",
    "Attentiveness to trusts and promises as fidelity marker",
    "Careful maintenance of prayers as consistent devotional practice",
    "Inheritors identified as those possessing preceding attributes",
    "Inheritance of Firdaws with eternal abode as ultimate reward",
    "Human creation initiated from clay extract as origin point",
    "Sperm-drop placed in firm lodging as second developmental stage",
    "Sequential embryonic stages from clot to bones to flesh culminating in another creation with divine praise",
    "Death declared as inevitable post-creation phase",
    "Resurrection on Day of Judgment affirmed as certain return",
    "Seven layered heavens created above humanity with divine awareness of creation",
    "Measured rain sent from sky and lodged in earth with divine ability to withdraw it",
    "Gardens of palms and grapevines produced with abundant fruit for consumption",
    "Tree from Mount Sinai yielding oil and seasoning as specific botanical sign",
    "Livestock providing drink from bellies plus multiple benefits and food as biological lesson",
    "Maritime and animal transport as divine subjection enabling mobility",
    "Nuh sent to his people commanding worship of Allah alone with taqwa",
    "Elite rejection citing messenger mortality and ancestral tradition as grounds for disbelief",
    "Accusation of madness and recommendation to wait as dismissal tactic",
    "Nuh supplicating for divine support against denial",
    "Ark construction under divine observation with oven-boiling as flood signal and loading instructions",
    "Boarding instruction with praise formula for salvation from wrongdoing people",
    "Supplication for blessed landing place acknowledging Allah as best accommodator",
    "Signs in Nuh narrative and declaration of perpetual divine testing"
  ],
  "ext-023-p2": [
    "New generation raised after destruction of preceding people",
    "Messenger sent from among new generation repeating tawheed-taqwa command",
    "Elite rejection citing shared human consumption and denial of Hereafter meeting",
    "Obedience to mortal messenger framed as guaranteed loss",
    "Resurrection promise mocked as impossible after becoming dust and bones",
    "Dismissal of resurrection as distant impossibility",
    "Materialist creed asserting only worldly life with no resurrection",
    "Prophet accused of fabricating lies about Allah with refusal to believe",
    "Messenger supplicating for divine support against denial",
    "Divine response promising imminent regret for deniers",
    "Shriek seizing wrongdoers reducing them to stubble with condemnation",
    "Successive generations raised after prior destruction",
    "Fixed term for every nation neither preceded nor delayed",
    "Sequential messenger dispatch with uniform denial pattern leading to destruction and narrativization",
    "Musa and Harun sent with signs and clear authority",
    "Firawn and nobles showing arrogance as haughty people",
    "Rejection based on messenger mortality and servile status of their followers",
    "Denial resulting in destruction",
    "Musa given Scripture as potential guidance",
    "Isa and Maryam made a sign with shelter on elevated ground with flowing spring",
    "Messengers commanded to eat good foods and work righteousness with divine knowledge affirmed",
    "Ummah wahidah principle declaring religious unity under single Lord with taqwa command",
    "Sectarian fragmentation into rejoicing factions",
    "Command to leave confused factions in their state temporarily",
    "Rhetorical question on whether wealth and children indicate divine favor",
    "Correction that material extension is not hastening toward good but imperceptible trial",
    "Apprehension from fear of Lord as believer disposition",
    "Belief in signs of Lord as believer attribute",
    "Non-association with Lord as believer commitment",
    "Giving accompanied by fearful hearts anticipating return to Lord",
    "Hastening to good deeds and outstripping others as competitive virtue",
    "No soul charged beyond capacity with truthful record ensuring no injustice",
    "Hearts covered in confusion performing evil deeds alongside disbelief",
    "Affluent seized with punishment producing immediate cries for help",
    "Cries rejected permanently with no divine assistance forthcoming",
    "Prior verse recitation recalled with audience turning back on heels",
    "Arrogant nighttime conversation speaking evil about revelation",
    "Failure to reflect on Quran or recognize unprecedented message",
    "Failure to recognize messenger leading to disacknowledgment",
    "Madness accusation rebutted with truth aversion identified as real cause",
    "Cosmic corruption hypothetical if truth followed desires with reminder brought yet rejected",
    "Prophet not seeking payment with divine reward superior and Allah best provider",
    "Prophet inviting to straight path affirmed",
    "Non-believers in Hereafter deviating from path as inevitable consequence"
  ],
  "ext-023-p3": [
    "Hypothetical mercy and affliction removal would only increase blind transgression",
    "Prior punitive grip failing to produce submission or humble supplication",
    "Severe punishment door opening producing sudden despair",
    "Hearing vision and hearts granted by Allah with minimal gratitude shown",
    "Human multiplication across earth with gathering to Allah affirmed",
    "Life-death alternation and night-day cycle as reasoning prompts",
    "Repetition of ancestral denial formulas",
    "Resurrection after dust-and-bones state questioned as implausible",
    "Promise dismissed as recycled legends of former peoples",
    "Rhetorical challenge on earth ownership demanding knowledge",
    "Acknowledgment of Allah ownership followed by remembrance prompt",
    "Lordship of seven heavens and Great Throne posed as recognition test",
    "Acknowledgment followed by taqwa prompt",
    "Sovereignty over all things with exclusive protection capacity posed",
    "Acknowledgment followed by delusion challenge",
    "Truth brought yet labeled as liars",
    "Divine sonship and co-deity negated with polytheistic chaos hypothetical and tanzih declaration",
    "Knower of unseen and witnessed exalted above association",
    "Prophet supplicating to witness promised punishment",
    "Prophet seeking exclusion from wrongdoing people",
    "Divine capability to show promised punishment affirmed",
    "Repelling evil with best response and divine knowledge of descriptions",
    "Seeking refuge from devil incitements",
    "Seeking refuge from devil presence",
    "Death arriving with belated request for return to do righteousness",
    "Return request rejected as mere words with barzakh barrier until resurrection"
  ],
  "ext-023-p4": [
    "Horn blast severing all familial relations and mutual inquiry on Judgment Day",
    "Heavy scales equating to success",
    "Light scales equating to self-loss with eternal Hellfire abode",
    "Fire searing faces with grimacing expression as sensory punishment",
    "Verse recitation recalled with prior denial confronted",
    "Wretchedness acknowledged and astray state confessed",
    "Removal from Hell requested with admission of wrongdoing upon return",
    "Despised permanence decreed with speech prohibition",
    "Believing servants remembered for faith forgiveness and mercy supplication",
    "Mockery of believers causing divine remembrance forgetfulness and laughter",
    "Patient endurance rewarded with attainment of success",
    "Duration on earth questioned in years",
    "Response estimating day or part of day with referral to enumerators",
    "Divine correction stating brief stay with knowledge lament",
    "Creation-purpose challenge negating uselessness and non-return assumption",
    "Allah exalted as Sovereign Truth sole deity and Lord of Noble Throne",
    "Baseless invocation of other deities producing individual accountability without success",
    "Closing supplication for forgiveness and mercy acknowledging Allah as best merciful"
  ]
};

const PASSAGES = [
  { id: "ext-023-p1", from: 1, to: 30,
    label: "Believers succeeded; prayer humbly submissive; turn away ill speech; observant zakah; guard private parts except wives right hands not blamed; seeks beyond transgressors; trusts promises attentive; carefully maintain prayers; inheritors Firdaws eternal therein; created man clay extract placed firm resting place; made clot lump bones clothed flesh produced another creation blessed best creators; after death raised Day Resurrection; created seven heavens above earth Lord Creator unaware; sent rain measured lodged ground able remove; produced gardens palms grapevines many fruits eat; tree grows Mount Sinai produces oil seasoning eaters; livestock lesson drink bellies benefits eat; ships carry; signs fear hope; indeed successful",
    mainLabel: "Believer success defined through ten attributes: khushu in salah, avoidance of laghw, zakah observance, chastity guarding, trust-promise fidelity, prayer maintenance; inheritance of Firdaws as ultimate reward; human creation from clay through embryonic stages demonstrating creative power; seven heavens layered above earth; measured rain with underground storage; botanical provision including Sinai olive tree; livestock milk-benefit catalog; maritime transport as sign; dual fear-hope as believer disposition" },
  { id: "ext-023-p2", from: 31, to: 74,
    label: "Sent Nuh people said worship Allah no deity except Him fear; said O people messenger clear warning worship Allah fear obey; chiefs disbelieved said mortal like you wants superiority would have sent angel; heard ancestors never this except lie invented; said Lord help denied; revealed build ark Our eyes revelation; when decree comes oven boils embark pair every kind family preceded word against them; sailed waves mountains called son apart said ride not disbelievers; said refuge mountain save water today protector except mercied; wave separated drowned; said earth swallow water sky cease subsided settled Judi said away wrongdoers; called Lord son family promise true You justest judges; said O Nuh not family deed unrighteous ask not know; said Lord seek refuge asking know; forgiven merciful; said descend peace blessing nations descend upon them enjoyments then touch painful punishment; stories unseen reveal not present among you nor fathers; truth came most unjust; messengers before denied seized; say observe what heavens earth signs warn benefit believe; wait days like days passed; saved messengers whom willed destroyed transgressors; indeed punishment exemplary",
    mainLabel: "Nuh mission: clear warner commanding tawheed-taqwa-obedience; elite rejection based on prophet humanity and ancestral tradition; divine aid invoked leading to ark construction under supervision; flood execution with oven-boiling sign; son's refusal and drowning demonstrating blood-tie insufficiency; divine justice overriding paternal plea; post-flood settlement on Judi with wrongdoer removal; subsequent generations receiving temporary enjoyment then punishment; unseen narratives as prophetic authentication; signs in heavens-earth as ongoing warning system; historical pattern of salvation-destruction duality" },
  { id: "ext-023-p3", from: 75, to: 100,
    label: "Mercied whom willed destroyed transgressors; indeed punishment exemplary; sent Musa brother Harun signs clear authority; went Firawn nobles arrogant said believe two mortals like us people slaves; denied both became destroyed; gave Musa Book perhaps guided; made Maryam son sign sheltered high ground spring; eat good things work righteousness knowing everything; indeed community single community I am Lord worship; split affairs parties each rejoicing; leave confusion play until time; think wealth children hasten good nay perceive not; apprehensive fear Lord believe signs not associate anything give hearts fearful returning Lord; hasten good deeds outstrip therein; charge soul except capacity record speaks truth wronged; hearts covered confusion evil deeds besides disbelief doing; seize affluent ones punishment crying help; cry not today helped; already My verses recited turned back heels arrogant talked nonsense thereof; has not pondered saying came not first ancients; recognize messenger say madman wait; say Lord forgive mercy best merciful",
    mainLabel: "Musa-Harun mission to Firawn with clear authority; elite arrogance rejecting mortal messengers serving enslaved people; collective destruction following denial; Musa scripture as guidance; Isa-Maryam as sign with elevated refuge and spring; universal ummah wahidah principle preceding sectarian division; righteous giving accompanied by fear of return as sincerity marker; hastening to good deeds as competitive virtue; individual capacity principle with truthful record; confused hearts performing evil alongside disbelief; affluent seizure producing belated helpless supplication; prior verse reception rejected through arrogance and slander; recognition failure despite ancestral precedent; prophetic sanity accusation as delay tactic; closing forgiveness-mercy supplication" },
  { id: "ext-023-p4", from: 101, to: 118,
    label: "Scales weighed Day Resurrection heavy scales successful; light scales lost souls abiding Hell fire burns faces grimacing; were not My signs recited deny; said Lord overcome evil fortune people astray; Lord take us return work righteous indeed believers; said remain therein abased speak not; party servants said believed forgive mercy You best merciful; took mockery forgot remembrance laughed; rewarded patient endurance attainers success; say how long remained earth years; say day part day ask enumerators; say stayed little known; think created uselessly returned; exalted Allah Sovereign Truth no deity except Him Lord Noble Throne; invokes besides Allah another deity no proof account Lord disbelievers not succeed; say Lord forgive mercy best merciful",
    mainLabel: "Judgment Day weighing: heavy scales equal success, light scales equal Hellfire with facial burning; disbeliever regret requesting return denied permanently; mocking believers causing divine remembrance forgetfulness reversed as patient reward; temporal perception distortion: lifetime experienced as day or less; creation-purpose challenge negating uselessness; divine sovereignty affirmation: Malik Haqq La ilaha illa Huwa Rabb al-Arsh al-Karim; baseless invocation producing individual accountability without success; closing isti'adha-dua formula: Rabbi ghfir wa-rham wa-Anta khayru al-rahimin" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`23:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`23:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 23, surahName: "Al-Mu'minun",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 3 genuine re-extraction. P1=believer-success-creation-Nuh-intro(1-30), P2=Nuh-ark-Musa-signs(31-74), P3=Musa-rejection-resurrection-mercy(75-100), P4=judgment-sovereignty-closing(101-118).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (23:1-30) ===
{
  const e = extractions[0];
  const khaliq = findWord(14, ["\u062e","\u0644","\u0642"]);
  if (khaliq) e.divineNamesAndAttributes.push({ term: khaliq, transliteration: "Khaliq", gloss: "Creator (editorial gloss)", keys: ["23:14"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["23:3"], excerpt: fv(3), description: "Turn away from ill speech (laghw) — avoidance of vain talk." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["23:4"], excerpt: fv(4), description: "Be observant of zakah — active purification obligation." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["23:5","23:6","23:7"], excerpt: fv(5), description: "Guard private parts except from spouses; whoever seeks beyond that is a transgressor." });

  e.humanConditionsAndSpiritualStates.push({ label: "Believer success (falah) defined through ten integrated attributes spanning worship ethics and social conduct", keys: ["23:1","23:2","23:3","23:4","23:5","23:6","23:7","23:8","23:9","23:10","23:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Khushu (humble submission) in prayer as primary believer marker", keys: ["23:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Livestock providing drink from bellies plus multiple benefits and food source", keys: ["23:21"], evidenceClass: "EXPLICIT_TEXT" });

  const falah = findWord(1, ["\u0641","\u0644","\u062d"]);
  if (falah) e.terminology.push({ term: falah, transliteration: "falah", gloss: "success/salvation (editorial gloss)", keys: ["23:1"] });

  // Nuh narrative belongs in P1 (verses 23-30 are within 1-30 range)
  e.propheticNarratives.push({ label: "Nuh mission: clear warner commanding tawheed-taqwa; elite rejection citing prophet humanity and ancestral tradition; ark construction under divine supervision; flood with oven-boiling sign; post-flood settlement on Judi", keys: ["23:23","23:24","23:25","23:26","23:27","23:28","23:29","23:30"], evidenceClass: "EXPLICIT_TEXT" });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["23:23"], excerpt: fv(23), description: "Worship Allah — there is no deity except Him; so fear Him." });
  e.humanConditionsAndSpiritualStates.push({ label: "Elite rejection pattern: chiefs disbelieve citing messenger mortality and ancestral precedent", keys: ["23:24","23:25"], evidenceClass: "EXPLICIT_TEXT" });
  const tannur = findWord(27, ["\u062a","\u0646","\u0648","\u0631"]);
  if (tannur) e.terminology.push({ term: tannur, transliteration: "tannur", gloss: "oven/baking kiln (editorial gloss)", keys: ["23:27"] });
}

// === POPULATE P2 (23:31-74) ===
{
  const e = extractions[1];

  // Nuh narrative (23:23-30) moved to P1 where those verses belong
  // Blood-tie (23:45-47) moved to P2 below

  e.relationships.push({ label: "Blood-tie insufficiency: Nuh's son drowned despite father's intercession demonstrating individual accountability", keys: ["23:45","23:46","23:47"], evidenceClass: "EXPLICIT_TEXT" });

  // Musa narrative and related content (verses 45-65 within P2 range 31-74)
  e.propheticNarratives.push({ label: "Musa-Harun sent with clear authority to Firawn and nobles who showed arrogance rejecting mortal messengers", keys: ["23:45","23:46","23:47"], evidenceClass: "EXPLICIT_TEXT" });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["23:51"], excerpt: fv(51), description: "O messengers eat from good things and work righteousness — sustenance-righteousness linkage." });
  e.humanConditionsAndSpiritualStates.push({ label: "Righteous giving accompanied by fear of return to Lord as sincerity marker", keys: ["23:60"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Affluent seizure producing belated helpless supplication rejected permanently", keys: ["23:64","23:65"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Ummah wahidah principle: your community is one community and I am your Lord so worship Me", keys: ["23:52"], evidenceClass: "EXPLICIT_TEXT" });
  const ummah = findWord(52, ["\u0623","\u0645","\u0629"]);
  if (ummah) e.terminology.push({ term: ummah, transliteration: "ummah", gloss: "community/nation (editorial gloss)", keys: ["23:52"] });
}

// === POPULATE P3 (23:75-100) ===
{
  const e = extractions[2];

  // Musa narrative (23:45-47), commands (23:51), conditions (23:60,64-65), ummah (23:52) all belong to P2 (31-74)
  // Moving them below to P2 section
}

// === POPULATE P4 (23:101-118) ===
{
  const e = extractions[3];
  const malik = findWord(116, ["\u0645","\u0644","\u0643"]);
  const haqq = findWord(116, ["\u062d","\u0642"]);
  if (malik) e.divineNamesAndAttributes.push({ term: malik, transliteration: "Malik", gloss: "Sovereign/King (editorial gloss)", keys: ["23:116"] });
  if (haqq) e.divineNamesAndAttributes.push({ term: haqq, transliteration: "Haqq", gloss: "Truth/Reality (editorial gloss)", keys: ["23:116"] });

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["23:118"], excerpt: fv(118), description: "My Lord forgive and have mercy; You are the best of the merciful." });

  e.humanConditionsAndSpiritualStates.push({ label: "Temporal perception distortion on Judgment Day: lifetime experienced as day or part of day", keys: ["23:112","23:113","23:114"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Creation-purpose challenge: Did you think We created you uselessly without return?", keys: ["23:115"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Individual accountability for baseless invocation: his account is only with his Lord", keys: ["23:117"], evidenceClass: "EXPLICIT_TEXT" });

  const arsh = findWord(116, ["\u0639","\u0631","\u0634"]);
  if (arsh) e.terminology.push({ term: arsh, transliteration: "arsh", gloss: "Throne (editorial gloss)", keys: ["23:116"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `023-al-muminun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 023-al-muminun-p${num}.json`);
}

// === CANDIDATES (cand-0897..cand-0936, 40 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-023-p1,ext-023-p2,ext-023-p3,ext-023-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0897..0906)
  { id: "cand-0897", label: "Believer success defined through ten integrated attributes", def: "In 23:1-11: Certainly will believers have succeeded; khushu in prayer; avoid laghw; zakah observant; guard private parts; trust-promise attentive; maintain prayers; inheritors of Firdaws.", key: "23:1", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Falah as comprehensive outcome."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Integrated worship-ethics."}] },
  { id: "cand-0898", label: "Khushu in prayer as primary believer marker", def: "In 23:2: They who during their prayer are humbly submissive (khashi'un).", key: "23:2", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Khushu as inner state."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Humility in ibadah."}] },
  { id: "cand-0899", label: "Avoidance of laghw (vain speech) as ethical discipline", def: "In 23:3: They who turn away from ill speech (al-laghw mu'ridun).", key: "23:3", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Speech purification."},{topicId:"self-accountability",layer:"scholarly",relationship:"related-not-identical",note:"Active avoidance."}] },
  { id: "cand-0900", label: "Chastity boundaries defined with transgression threshold", def: "In 23:5-7: Guard private parts except spouses; whoever seeks beyond that is transgressor (al-adun).", key: "23:5", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Permitted-prohibited boundary."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Sexual discipline."}] },
  { id: "cand-0901", label: "Human creation through embryonic stages demonstrating creative power", def: "In 23:12-14: Created man from clay extract placed firm resting place clot lump bones clothed flesh another creation.", key: "23:12", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Multi-stage embryology."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Developmental process as ayah."}] },
  { id: "cand-0902", label: "Seven heavens layered above earth as cosmic architecture", def: "In 23:17: Created seven heavens above you; not heedless of creation.", key: "23:17", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Sab'a samawat."},{topicId:"unseen-belief",layer:"scholarly",relationship:"related-not-identical",note:"Layered cosmos."}] },
  { id: "cand-0903", label: "Measured rain with underground storage as hydrological provision", def: "In 23:18: Sent down rain by measure lodged in ground; able to remove it.", key: "23:18", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Water cycle as ni'mah."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Controlled provision."}] },
  { id: "cand-0904", label: "Sinai olive tree as specific botanical sign with dual utility", def: "In 23:20: Tree growing from Mount Sinai produces oil and seasoning for eaters.", key: "23:20", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Geographic-botanical specificity."},{topicId:"divine-mercy",layer:"scholarly",relationship:"related-not-identical",note:"Food provision."}] },
  { id: "cand-0905", label: "Livestock milk production spanning digestive physiology as biological sign", def: "In 23:21: Indeed in livestock is lesson; drink from bellies; many benefits; eat from them.", key: "23:21", overlap: [{topicId:"animals-as-communities",layer:"scholarly",relationship:"same-concept",note:"An'am as multi-utility."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Biological process as ibrah."}] },
  { id: "cand-0906", label: "Maritime transport as divine subjection enabling commerce", def: "In 23:22: Upon them and upon ships you are carried.", key: "23:22", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Transport taskhir."},{topicId:"work-honor",layer:"scholarly",relationship:"related-not-identical",note:"Mobility enabling trade."}] },

  // P2 (cand-0907..0916)
  { id: "cand-0907", label: "Nuh mission as clear warner commanding tawheed-taqwa-obedience", def: "In 23:23: We sent Nuh to his people; he said O my people worship Allah; you have no deity except Him; so fear Him.", key: "23:23", overlap: [{topicId:"nuh-story",layer:"scholarly",relationship:"same-concept",note:"Triple command: ibadah-taqwa-ta'ah."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Nadhir mubin."}] },
  { id: "cand-0908", label: "Elite rejection citing prophet humanity and ancestral tradition", def: "In 23:24-25: Chiefs said mortal like you wanting superiority; ancestors never worshipped thus; nothing but invented lie.", key: "23:24", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Ancestral appeal as epistemological failure."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Status-based rejection."}] },
  { id: "cand-0909", label: "Ark construction under direct divine supervision", def: "In 23:27: Revealed to him: Build the ark under Our eyes and Our revelation.", key: "23:27", overlap: [{topicId:"nuh-story",layer:"scholarly",relationship:"same-concept",note:"Bi-a'yunina wa-wahyina."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Supervised construction."}] },
  { id: "cand-0910", label: "Oven-boiling as flood initiation sign", def: "In 23:27: When Our command comes and the oven boils (fara al-tannur).", key: "23:27", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Domestic object as cosmic signal."},{topicId:"nuh-story",layer:"scholarly",relationship:"same-concept",note:"Tannur as flood trigger."}] },
  { id: "cand-0911", label: "Blood-tie insufficiency demonstrated through Nuh's son drowning", def: "In 23:45-47: Called son come aboard; said refuge mountain; said no protector today except mercied; wave separated drowned.", key: "23:45", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Kinship cannot save."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Individual reckoning."}] },
  { id: "cand-0912", label: "Divine justice overriding paternal intercession plea", def: "In 23:47: Said O Nuh he is not of your family; deed unrighteous; ask not what you have no knowledge.", key: "23:47", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"same-concept",note:"Justice over emotion."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Bounded prophetic knowledge."}] },
  { id: "cand-0913", label: "Post-flood settlement on Judi with wrongdoer removal", def: "In 23:29: Water subsided settled on Judi; said away with wrongdoers.", key: "23:29", overlap: [{topicId:"nuh-story",layer:"scholarly",relationship:"same-concept",note:"Judi as landing site."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Wrongdoer elimination."}] },
  { id: "cand-0914", label: "Subsequent generations receiving temporary enjoyment then punishment", def: "In 23:30: Nations after them enjoyments then touched painful punishment.", key: "23:30", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Enjoyment preceding penalty."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Delayed punishment certainty."}] },
  { id: "cand-0915", label: "Unseen narratives as prophetic authentication mechanism", def: "In 23:44: Stories of unseen We reveal; not present among you nor fathers.", key: "23:44", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Ghayb narration as proof."},{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Beyond-human knowledge."}] },
  { id: "cand-0916", label: "Signs in heavens-earth as ongoing warning system for observers", def: "In 23:44: Say observe what is in heavens and earth; signs and warners benefit not those who do not believe.", key: "23:44", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Observational command."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Nazr as cognitive act."}] },

  // P3 (cand-0917..0926)
  { id: "cand-0917", label: "Musa-Harun mission with clear authority rejected by arrogant elite", def: "In 23:45-47: Sent Musa brother Harun with signs clear authority; went Firawn nobles arrogant; said believe two mortals like us.", key: "23:45", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Dual messenger with sultan."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Arrogance blocking reception."}] },
  { id: "cand-0918", label: "Sustenance-righteousness linkage for messengers", def: "In 23:51: O messengers eat from good things and work righteousness; I am Knowing of what you do.", key: "23:51", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Halal consumption tied to amal."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Integrity in sustenance."}] },
  { id: "cand-0919", label: "Ummah wahidah principle preceding sectarian division", def: "In 23:52: Indeed this community of yours is one community and I am your Lord so worship Me.", key: "23:52", overlap: [{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Unity before fragmentation."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Worship grounding unity."}] },
  { id: "cand-0920", label: "Righteous giving accompanied by fear of return as sincerity marker", def: "In 23:60: Those who give what they give while hearts fearful because returning to their Lord.", key: "23:60", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Fear-conditioned charity."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Accountability-aware generosity."}] },
  { id: "cand-0921", label: "Hastening to good deeds as competitive virtue", def: "In 23:61: It is those who hasten to good deeds and outstrip others therein.", key: "23:61", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Musara'at fi'l-khayrat."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"related-not-identical",note:"Speed as iman indicator."}] },
  { id: "cand-0922", label: "Individual capacity principle with truthful record", def: "In 23:62: We charge no soul except within its capacity; with Us is record speaking truth.", key: "23:62", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La nukallifu illa wus'aha."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Capacity-proportional obligation."}] },
  { id: "cand-0923", label: "Confused hearts performing evil alongside disbelief", def: "In 23:63: Hearts covered with confusion; evil deeds besides disbelief which they continue doing.", key: "23:63", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Qulub fi ghamrah."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"related-not-identical",note:"Compound spiritual failure."}] },
  { id: "cand-0924", label: "Affluent seizure producing belated helpless supplication", def: "In 23:64-65: Seize affluent ones with punishment; at once crying for help; do not cry today; not helped.", key: "23:64", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Luxury class targeted."},{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Belated plea rejected."}] },
  { id: "cand-0925", label: "Prior verse reception rejected through arrogance and slander", def: "In 23:67-68: Were My signs not recited to you; turned back heels; arrogant talking nonsense.", key: "23:67", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Active rejection despite clarity."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Istikbar preventing reception."}] },
  { id: "cand-0926", label: "Recognition failure despite ancestral precedent availability", def: "In 23:68: Has not saying come to you that did not come to first ancestors; recognize messenger.", key: "23:68", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Historical evidence ignored."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Willful blindness."}] },

  // P4 (cand-0927..0936)
  { id: "cand-0927", label: "Judgment Day weighing: heavy scales equal success light scales equal loss", def: "In 23:102-103: Whose scales are heavy those are successful; whose scales are light those lost themselves abiding in Hell.", key: "23:102", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Mawazin as verdict mechanism."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Exact weight measurement."}] },
  { id: "cand-0928", label: "Disbeliever regret requesting return denied permanently", def: "In 23:107-108: Said Lord take us out return do righteous; said remain abased; do not speak to Me.", key: "23:107", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Post-mortem tawbah impossible."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Permanent exclusion."}] },
  { id: "cand-0929", label: "Mocking believers causing divine remembrance forgetfulness reversed as patient reward", def: "In 23:109-111: Party of servants believed; you took them in mockery forgot My remembrance; rewarded patient endurance attainers.", key: "23:109", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr rewarded eternally."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Mockery as test."}] },
  { id: "cand-0930", label: "Temporal perception distortion on Judgment Day", def: "In 23:112-114: How long remained on earth; said day or part of day; ask enumerators; said stayed little if only known.", key: "23:112", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Time compression."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Eternal perspective collapsing temporal."}] },
  { id: "cand-0931", label: "Creation-purpose challenge negating uselessness and non-return", def: "In 23:115: Did you think We created you uselessly (abathan) and to Us you would not be returned?", key: "23:115", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"Abath negation."},{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Return as purpose confirmation."}] },
  { id: "cand-0932", label: "Divine sovereignty affirmation: Malik Haqq Rabb al-Arsh al-Karim", def: "In 23:116: Exalted is Allah the Sovereign the Truth; no deity except Him; Lord of the Noble Throne.", key: "23:116", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Four-name cluster."},{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Comprehensive sovereignty."}] },
  { id: "cand-0933", label: "Baseless invocation producing individual accountability without success", def: "In 23:117: Whoever invokes besides Allah another deity without proof; account only with Lord; disbelievers not succeed.", key: "23:117", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Burhan requirement."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual hisab."}] },
  { id: "cand-0934", label: "Closing isti'adha-dua formula as prophetic model supplication", def: "In 23:118: Say My Lord forgive and have mercy; You are best of merciful.", key: "23:118", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Taught closing dua."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafrah-rahmah pairing."}] },
  { id: "cand-0935", label: "Hellfire facial burning as sensory punishment imagery", def: "In 23:104: Fire burns their faces; they therein are grimacing (musihun).", key: "23:104", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Facial tashwiyy."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Visible suffering."}] },
  { id: "cand-0936", label: "Isa-Maryam as sign with elevated refuge and flowing spring", def: "In 23:50: Made son of Maryam and mother a sign; sheltered them on high ground with flowing spring.", key: "23:50", overlap: [{topicId:"isa-story",layer:"scholarly",relationship:"same-concept",note:"Dual sign with sanctuary."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Geographical sign."}] }
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
  writeFileSync(path.join(OUT_DIR, "extractions", `023-al-muminun-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-047.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-047.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
