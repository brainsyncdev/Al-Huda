// MFD-11 Wave 2: Surah 16 (An-Nahl) genuine re-extraction.
// Covers 16:1–128 in 4 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "016-0001-0128.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 16:${n} not found`);
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

console.log("Generating Surah 16 (An-Nahl) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T12:50:00.000Z";

// P1: 16:1–34 — Divine command, creation signs, blessing catalog, resurrection argument
// P2: 16:35–64 — Shirk refutation, messenger humanity, divine justice, revelation purpose
// P3: 16:65–97 — Natural signs (livestock, bee, fruits), gratitude, Ibrahim millat, halal/haram
// P4: 16:98–128 — Quran recitation etiquette, justice commands, Abraham model, closing taqwa

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-016-p1": [
    "Divine command imminence prohibiting impatience and declaring Allah exalted above associates",
    "Angelic inspiration delivering tawheed warning through chosen servants",
    "Creation of heavens and earth in truth affirming divine transcendence over shirk",
    "Human origin from sperm-drop contrasting immediate adversarial posture toward Creator",
    "Grazing livestock providing warmth benefits and food as comprehensive blessing",
    "Livestock beauty appreciated during evening return and morning pasture departure",
    "Beasts carrying heavy loads to distant lands demonstrating divine kindness and mercy",
    "Horses mules and donkeys created for riding adornment plus unknown future creations",
    "Right way direction belonging to Allah with deviating paths existing by divine will",
    "Rain sent from sky producing drink and pasture foliage for animals",
    "Agricultural produce including crops olives palms grapevines and fruits as sign for thinkers",
    "Night day sun moon and stars subjected by divine command as signs for reasoning people",
    "Earth multiplied in varying colors as sign for those who remember",
    "Sea subjected for fresh meat ornaments shipping and bounty-seeking as gratitude occasion",
    "Mountains cast as stabilizers plus rivers roads and landmarks for guidance",
    "Star-based navigation completing terrestrial and celestial guidance systems",
    "Rhetorical challenge contrasting Creator with non-creator demanding remembrance",
    "Uncountable divine favors establishing human inability to enumerate blessings",
    "Divine knowledge encompassing all concealed and declared human matters",
    "False deities invoked besides Allah unable to create being themselves created",
    "Idols characterized as dead not alive unaware of resurrection timing",
    "One God declared with disbelieving hearts rejecting and showing arrogance",
    "Allah knowing all secrets and declarations disliking the arrogant",
    "Disbelievers dismissing revelation as legends of former peoples",
    "Misleaders bearing full burdens plus burdens of those misled without knowledge",
    "Prior plotters destroyed when punishment came from foundations unexpectedly",
    "Resurrection Day disgrace for polytheists with knowledgeable witnesses testifying",
    "Angels taking wrongdoers in death while they falsely claim innocence",
    "Arrogant entering Hell gates eternally as wretched residence",
    "Righteous asked what Lord sent down answering good with better Hereafter home",
    "Gardens of Eden with flowing rivers as reward for the righteous",
    "Angels greeting pure souls at death with peace and Paradise entry",
    "Disbelievers awaiting only angelic arrival or divine command having wronged themselves",
    "Evil consequences of deeds enveloping those who ridiculed the truth"
  ],
  "ext-016-p2": [
    "Polytheist determinism excuse claiming divine will forced their worship refuted by messenger precedent",
    "Universal messenger sent to every nation commanding tawheed and taghut avoidance with bifurcated outcomes",
    "Prophetic eagerness for guidance tempered by divine sovereignty over misguidance",
    "Solemn oaths denying resurrection answered by binding divine promise most do not know",
    "Resurrection purpose clarifying disputed matters and exposing disbelievers as liars",
    "Divine creative word Kun fayakoon demonstrating absolute power over existence",
    "Emigrants wronged then settled well in this world with greater Hereafter reward",
    "Patient emigrants relying on their Lord as model of steadfast faith",
    "Prior messengers were only men receiving revelation commanding consultation with people of remembrance",
    "Revealed message with clear proofs making things clear for people to reflect",
    "Evil planners insecure against earth swallowing or unseen punishment arrival",
    "Punishment seizing wrongdoers during daily activity with no escape possible",
    "Gradual seizure in dread balanced by divine kindness and mercy",
    "All created things casting shadows in prostration to Allah humbly",
    "Heavenly and earthly creatures plus angels prostrating without arrogance",
    "Angels fearing their Lord above them executing commanded duties",
    "Prohibition against taking two deities affirming one God and commanding fear of Him alone",
    "Universal ownership and constant worship owed to Allah alone questioning other fears",
    "All favors from Allah yet humans cry to Him only when adversity strikes",
    "Adversity removal triggering immediate shirk by a party of beneficiaries",
    "Ingratitude for divine gifts followed by temporary enjoyment then inevitable knowledge",
    "Assigning portion of provision to unknown entities provoking accountability question",
    "Attributing daughters to Allah while desiring sons for themselves",
    "Face darkening and grief suppression upon receiving female birth news",
    "Hiding from community debating whether to keep daughter in humiliation or bury her",
    "Evil description for those disbelieving in Hereafter contrasted with highest divine attribute",
    "Divine forbearance deferring punishment to specified term preventing total destruction",
    "Tongues asserting lie of best outcome while Fire and neglect await fabricators",
    "Satan beautifying deeds for prior nations becoming their ally with painful punishment ahead",
    "Book revealed solely to clarify differences and provide guidance mercy for believers"
  ],
  "ext-016-p3": [
    "Rain reviving dead earth as observable sign for listening people",
    "Livestock bellies producing pure milk between excretion and blood as biological lesson",
    "Palm and grapevine fruits yielding intoxicant and good provision as sign for reasoners",
    "Bee receiving divine inspiration to build houses in mountains trees and human structures",
    "Bee eating fruits following divinely laid paths producing multi-colored healing drink",
    "Human lifecycle from creation through death with senile reversal demonstrating divine knowledge-power",
    "Provision disparity among humans contrasted with refusal to share equally with slaves",
    "Spouses progeny and good provisions from Allah contrasted with belief in falsehood and favor denial",
    "False deities possessing no provision power from heavens or earth being utterly unable",
    "Prohibition against drawing similitudes for Allah who knows while humans do not",
    "Slave-free parable contrasting powerless owned person with generous provider proving inequality",
    "Dumb burden-bearing man contrasted with justice-commanding person on straight path",
    "Unseen of heavens and earth belonging to Allah with Hour arriving instantaneously",
    "Human extraction from maternal wombs knowing nothing then granted hearing sight intellect for gratitude",
    "Birds suspended in sky atmosphere held only by Allah as sign for believers",
    "Homes as resting place plus animal-hide tents wool fur hair furnishings as temporal blessings",
    "Shadows mountain shelters heat-protective and battle-protective garments completing divine favor for submission",
    "Turning away leaving only clear notification responsibility upon the messenger",
    "Recognizing divine favor then denying it characterizing most as disbelievers",
    "Witness resurrected from every nation with disbelievers denied permission to apologize",
    "Wrongdoers seeing punishment with no lightening or reprieve granted",
    "Polytheists identifying partners who reject them as liars on Judgment Day",
    "Submission imparted to Allah on Judgment Day with invented fabrications lost",
    "Double punishment for disbelievers who averted others from divine way due to corruption",
    "Witness from every nation plus Prophet as witness with Book as clarification guidance mercy glad tidings",
    "Comprehensive divine command ordering justice good conduct kin-giving forbidding immorality evil oppression",
    "Covenant fulfillment and oath confirmation with Allah as guarantor knowing all actions",
    "Untwisted-thread parable warning against oath deception for numerical advantage between communities",
    "Divine will could have made single community but guides and misleads by choice with accountability",
    "Oath deception causing foot-slipping after firmness tasting evil for diverting from divine way",
    "Prohibition against trading divine covenant for small price since Allah has what is better lasting",
    "Human possessions perishable while divine possessions lasting with patient rewarded by best deeds",
    "Righteous male or female believer granted good life and rewarded by best deeds"
  ],
  "ext-016-p4": [
    "Quran recitation preceded by seeking refuge from expelled Satan",
    "Satan having no authority over believers who rely upon their Lord",
    "Satanic authority limited to those taking him as ally and associating through him",
    "Verse substitution acknowledged within divine knowledge with accusers called inventors",
    "Pure Spirit bringing revelation in truth to strengthen believers as guidance and glad tidings",
    "Foreign-language teacher objection answered by clear Arabic tongue of revelation",
    "Non-believers in divine signs denied guidance receiving painful punishment",
    "Falsehood invention limited to non-believers in signs identified as the liars",
    "Post-belief disbelief exception for coerced person with heart secure versus willing apostates receiving wrath",
    "Worldly life preference over Hereafter causing divine abandonment of disbelieving people",
    "Sealed hearts hearing sight characterizing heedless people",
    "Heedless confirmed as losers in the Hereafter",
    "Post-persecution emigrants who fought patiently receiving divine forgiveness and mercy",
    "Every soul disputing for itself fully compensated without injustice on Judgment Day",
    "Secure abundant town becoming ungrateful tasting hunger-fear garment for wrongdoing",
    "Messenger from among townspeople denied leading to punishment overtaking wrongdoers",
    "Command to eat lawful good provision and show gratitude if truly worshipping Allah",
    "Four dietary prohibitions with necessity exception under duress without transgression",
    "Prohibition against declaring lawful-unlawful based on tongue assertions inventing lies against Allah",
    "Brief enjoyment for fabricators followed by painful punishment",
    "Jewish dietary restrictions as self-inflicted consequence of prior transgression not divine injustice",
    "Ignorant wrongdoers repenting and reforming receiving divine forgiveness and mercy",
    "Abraham as comprehensive leader devoutly obedient hanif not among polytheists",
    "Abraham grateful for favors chosen and guided to straight path",
    "Abraham given good in this world and assured among righteous in Hereafter",
    "Revelation commanding following millat Ibrahim as hanif excluding polytheism",
    "Sabbath appointed only for those who differed with divine judgment deferred to Resurrection Day",
    "Da'wah methodology defined as wisdom good instruction and best argumentation with divine knowledge of guidance",
    "Proportional retaliation permitted with patience declared better for the patient",
    "Patience sourced exclusively through Allah with prohibition against grief-distress over opponents",
    "Divine companionship promised to muttaqin and muhsinin as closing assurance"
  ]
};

const PASSAGES = [
  { id: "ext-016-p1", from: 1, to: 34,
    label: "Nahl — Command Allah coming be not impatient Exalted above associates; sends angels inspiration command upon whom wills warn no deity except Me fear; created heavens earth truth High above associates; created man sperm-drop clear adversary; grazing livestock warmth benefits eat beauty bringing in sending out carry loads land could not reached difficulty Lord Kind Merciful; horses mules donkeys ride adornment creates what not know; upon Allah direction right way among paths deviating willed guided all; sends rain sky drink foliage pasture; grows crops olives palms grapevines fruits sign people reflect; subjected night day sun moon stars subjected command signs people reason; earth colored varied signs people remember; He who made sea subservient eat fresh meat extract ornaments wear ships plow through it seek bounty grateful; cast mountains earth stabilize lest shake rivers roads guide landmarks star guided; Creator equal one does not create knows count favors unjust ungrateful; brought punishment denied messengers seized suddenly perceived not; taste worldly life Hereafter punishment greater knew",
    mainLabel: "Divine command imminence removing impatience; angelic inspiration as warning mechanism establishing tawheed; creation in truth negating shirk; human origin from sperm-drop contrasting adversarial posture; comprehensive livestock blessing catalog (warmth, food, beauty, transport); celestial subjection enabling navigation and timekeeping; rain-vegetation cycle as agricultural provision system; maritime subjection enabling commerce and sustenance seeking; mountain stabilization as geological mercy; uncountable favors establishing human indebtedness; punishment suddenness as historical warning" },
  { id: "ext-016-p2", from: 35, to: 64,
    label: "Nahl — Polytheists say if Allah willed not worshipped besides Him nor fathers forbidden anything thus did those before clear transmission only; every nation sent messenger worship Allah avoid taghut some guided some misled travel earth observe end deniers; guide eager not guided Allah does not guide wrongdoers; sworn solemn oaths Allah not raise dead rather promise binding most not know; make clear differed reveal Book explain everything guidance mercy believe; command Allah come anxious hasten Allah judges fairly; sends angels spirit command whom wills servants warn no deity except Me fear; created heavens earth truth exalted above associate; man sperm-drop adversary; disbeliever blessed bestowed wealth sons expect good nay test unaware; invoked besides Allah create nothing created themselves dead not alive not perceive when resurrected; gods called cannot help themselves nor helped; recite signs denied arrogant; hearts sealed hearing sight covered seals never guided; migrated persecuted fought patiently Lord Forgiving Merciful; revealed Book clarify differed guidance mercy believe; attribute Allah dislike tongues assert lie best have Fire; by Allah sent nations before Satan made deeds attractive hakeem painful punishment; revealed Book make clear differed guidance mercy believers",
    mainLabel: "Polytheist determinism excuse refuted by prior messenger pattern; universal prophethood with bifurcated outcome (guided/misled); observational command to study historical consequences; divine oath affirming resurrection against denial; Book revealed as clarification-guidance-mercy triad; idol incapacity demonstrated through creation-inability and self-helplessness; migration-persecution-patience sequence with divine forgiveness; satanic beautification of deeds as counter-revelation mechanism; repeated Book-purpose formula anchoring revelation function" },
  { id: "ext-016-p3", from: 65, to: 97,
    label: "Nahl — Allah sent rain sky given life earth after lifelessness sign listeners; grazing livestock lesson drink bellies between excretion blood pure milk pleasant drinkers; fruits palms grapevines intoxicant good provision sign people reason; Lord inspired bee take houses mountains trees build; eat fruits follow ways Lord laid down emerges bellies drink varying colors healing people sign reflect; Allah created you takes death reversed decrepit age knows nothing after knowing Allah Knowing Powerful; favored some provision over others would not hand back right hands slaves equal deny favor Allah; Allah made spouses yourselves produced sons grandchildren provided good things believe falsehood deny favor; serve besides Allah possess provision heaven earth unable helped; strike example slave owned unable anything versus one provided good spends secretly openly equal praise Allah most not know; Allah struck example town secure abundant provision came ungrateful tasted hunger fear wrongdoing; messenger came denied seized punishment; eat lawful good provided grateful worship; forbidden only dead meat blood pork dedicated other than Allah forced transgressing sinning Allah Forgiving Merciful; conceal witness knowledge entrusted judgment Day questioned; invented lie Allah fabricate lies not succeed brief enjoyment painful punishment; Jews forbade narrated before transgression Lord Forgiving Merciful disputed Day Judgment",
    mainLabel: "Rain-revival as resurrection microcosm; livestock milk production as biological sign spanning digestive physiology; bee revelation (wahy to non-human) producing multi-colored healing drink; human lifecycle encompassing birth death and senile reversal demonstrating divine knowledge-power; spousal-progeny-provision triad as social blessing; slave-free parable demonstrating inequality of created versus Creator; town-security-to-punishment narrative as gratitude-ingratitude paradigm; halal-haram framework with necessity exception; Jewish dietary restrictions as punitive measure for transgression; lying fabrication against Allah producing brief enjoyment then severe punishment" },
  { id: "ext-016-p4", from: 98, to: 128,
    label: "Nahl — Recite Quran seek refuge Allah Satan cursed; no authority over believed rely Lord; authority only over take him patron associate Him; replaced verse verse Allah knows best revealed say inventing lie most not know; sent down spirit truth Lord strengthen believed guidance glad tidings submit; know tongue foreigner Arabic clear; signs rejected wronged after believing faith increased forced heart content wrath Allah severe punishment; preferred worldly life Hereafter Allah guides not disbelieve; sealed hearts hearing sight never guided; fled persecution fought patiently Lord Forgiving Merciful; Abraham leader devout obedient inclining truth not polytheists grateful favors chose guided straight path gave good world Hereafter righteous; revealed follow religion Abraham inclining truth not polytheists; Sabbath appointed differed Lord judge Day Resurrection concerning differed; invite way Lord wisdom good instruction argue best way Lord knows strayed guided; punish equivalent harmed patient better Allah patient; grieve distressed plotting Allah with feared doers good",
    mainLabel: "Quran recitation preceded by isti'adha establishing spiritual protection; satanic powerlessness against trusting believers; verse replacement acknowledged within divine knowledge framework; foreign-language objection answered by Arabic clarity; faith increase-decrease linked to response under persecution; Abraham as millat Ibrahim prototype: hanif, grateful, chosen, guided, rewarded; prophetic methodology defined: hikmah, mau'idah hasanah, jidal ahsan; proportional retaliation with patience preference; closing divine companionship promise for muttaqin and muhsinin" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`16:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`16:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 16, surahName: "An-Nahl",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: `Wave 2 genuine re-extraction. Passage boundaries: P1=creation-blessings (1-34), P2=shirk-refutation-messenger-pattern (35-64), P3=natural-signs-dietary-law (65-97), P4=quran-etiquette-abraham-model-closing (98-128).`,
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE ANALYTICAL ARRAYS ===

// P1 (16:1-34)
{
  const e = extractions[0];
  const allah = findWord(2, ["\u0627","\u0644","\u0644","\u0647"]);
  const rauf = findWord(7, ["\u0631","\u0624","\u0648","\u0641"]);
  const raheem = findWord(7, ["\u0631","\u062d","\u064a","\u0645"]);
  if (allah) e.divineNamesAndAttributes.push({ term: allah, transliteration: "Allah", gloss: "God (editorial gloss)", keys: ["16:2"] });
  if (rauf) e.divineNamesAndAttributes.push({ term: rauf, transliteration: "Ra'uf", gloss: "Kind/Compassionate (editorial gloss)", keys: ["16:7"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["16:7"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["16:1"], excerpt: fv(1), description: "Be not impatient for Allah's command — prohibition of hastening divine decree." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:2"], excerpt: fv(2), description: "Warn that there is no deity except Me so fear Him — core tawheed proclamation via angelic inspiration." });

  e.humanConditionsAndSpiritualStates.push({ label: "Human origin from sperm-drop immediately becoming clear adversary to Creator", keys: ["16:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Uncountable divine favors establishing perpetual human indebtedness", keys: ["16:18"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Creator-creation relationship through comprehensive provision: livestock, celestial bodies, rain, maritime access, geological stability", keys: ["16:5","16:12","16:15"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Maritime commerce enabled by divine subjection of sea: fresh meat extraction, ornament acquisition, bounty-seeking through shipping", keys: ["16:14"], evidenceClass: "EXPLICIT_TEXT" });

  const nimah = findWord(18, ["\u0646","\u0639","\u0645"]);
  if (nimah) e.terminology.push({ term: nimah, transliteration: "ni'mah", gloss: "blessing/favor (editorial gloss)", keys: ["16:18"] });
}

// P2 (16:35-64)
{
  const e = extractions[1];
  const hakeem = findWord(63, ["\u062d","\u0643","\u064a","\u0645"]);
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["16:63"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:36"], excerpt: fv(36), description: "We sent to every nation a messenger: worship Allah and avoid taghut (false deities)." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:43"], excerpt: fv(43), description: "Ask the people of remembrance if you do not know — command to consult knowledgeable predecessors." });

  e.propheticNarratives.push({ label: "Universal messenger pattern: every nation received a messenger commanding tawheed and taghut-avoidance with bifurcated outcomes", keys: ["16:36"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Polytheist determinism excuse: if Allah willed we would not have worshipped others — refuted by prior messenger evidence", keys: ["16:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Satanic beautification of deeds making evil appear attractive to disbelieving communities", keys: ["16:63"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine justice principle: Allah does not wrong people but they wrong themselves through rejection", keys: ["16:61"], evidenceClass: "EXPLICIT_TEXT" });

  const taghut = findWord(36, ["\u0637","\u063a","\u0648","\u062a"]);
  if (taghut) e.terminology.push({ term: taghut, transliteration: "taghut", gloss: "false deity/idol/transgressor (editorial gloss)", keys: ["16:36"] });
}

// P3 (16:65-97)
{
  const e = extractions[2];
  // Divine names (within 16:65-97 range)
  const aleem = findWord(66, ["\u0639","\u0644","\u064a","\u0645"]);
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["16:66"] });

  // Commands (within 16:65-97 range)
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:69"], excerpt: fv(69), description: "Eat from all the fruits and follow the ways of your Lord laid down for you — bee instruction as divine guidance." });

  e.humanConditionsAndSpiritualStates.push({ label: "Bee receiving divine inspiration (wahy) producing multi-colored healing drink from diverse fruit sources", keys: ["16:68","16:69"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Human lifecycle reversal: created then taken in death, some reversed to decrepit old age knowing nothing after having known", keys: ["16:70"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Spousal-progeny-provision triad as social blessing structure requiring recognition over falsehood", keys: ["16:72"], evidenceClass: "EXPLICIT_TEXT" });

  const wahy = findWord(68, ["\u0648","\u062d","\u064a"]);
  const nahl = findWord(68, ["\u0646","\u062d","\u0644"]);
  if (wahy) e.terminology.push({ term: wahy, transliteration: "wahy", gloss: "inspiration/revelation (editorial gloss)", keys: ["16:68"] });
  if (nahl) e.terminology.push({ term: nahl, transliteration: "nahl", gloss: "bee (editorial gloss)", keys: ["16:68"] });
}

// P4 (16:98-128)
{
  const e = extractions[3];
  // Divine names (within 16:98-128 range)
  const ghafur = findWord(110, ["\u063a","\u0641","\u0648","\u0631"]);
  const rahman = findWord(110, ["\u0631","\u062d","\u0645","\u0646"]);
  if (ghafur) e.divineNamesAndAttributes.push({ term: ghafur, transliteration: "Ghafur", gloss: "Forgiving (editorial gloss)", keys: ["16:110"] });
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["16:110"] });

  // Commands (within 16:98-128 range)
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:98"], excerpt: fv(98), description: "When you recite the Quran seek refuge in Allah from Satan the expelled." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:114"], excerpt: fv(114), description: "Eat from what Allah has provided as lawful and good and be grateful for Allah's favor if you worship Him." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["16:115"], excerpt: fv(115), description: "He has only forbidden to you dead meat, blood, flesh of swine, and what has been dedicated to other than Allah." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["16:116"], excerpt: fv(116), description: "Do not say about what your tongues describe as lie this is lawful and this is forbidden to invent lies against Allah." });

  // Prophetic narratives (within 16:98-128 range)
  e.propheticNarratives.push({ label: "Town security-to-punishment narrative: secure abundant town became ungrateful, tasted hunger and fear as consequence of wrongdoing", keys: ["16:112","16:113"], evidenceClass: "EXPLICIT_TEXT" });

  // Social/economic (within 16:98-128 range)
  e.socialEconomicCivilisational.push({ label: "Halal-haram dietary framework with necessity exception: forced without transgression or sin Allah is Forgiving Merciful", keys: ["16:115"], evidenceClass: "EXPLICIT_TEXT" });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:125"], excerpt: fv(125), description: "Invite to the way of your Lord with wisdom and good instruction and argue with them in a way that is best." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:126"], excerpt: fv(126), description: "If you punish then punish with equivalent of what you were harmed; but if you are patient it is better for the patient." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:127"], excerpt: fv(127), description: "Be patient and your patience is not but through Allah; do not grieve over them nor be in distress from what they plot." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["16:128"], excerpt: fv(128), description: "Indeed Allah is with those who fear Him and those who are doers of good." });

  e.propheticNarratives.push({ label: "Abraham as millat Ibrahim prototype: comprehensive leader (ummah), devoutly obedient (qanit), hanif, grateful, chosen, guided to straight path, rewarded in both worlds", keys: ["16:120","16:121","16:122","16:123"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Faith increase under persecution: those who believed after disbelief then migrated and fought patiently — Lord is Forgiving Merciful", keys: ["16:110"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Satanic powerlessness against trusting believers: he has no authority over those who believed and relied upon their Lord", keys: ["16:99"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine companionship promise: Allah is with the muttaqin and muhsinin as closing assurance", keys: ["16:128"], evidenceClass: "EXPLICIT_TEXT" });

  const millat = findWord(123, ["\u0645","\u0644","\u0629"]);
  const hanif = findWord(120, ["\u062d","\u0646","\u0641"]);
  if (millat) e.terminology.push({ term: millat, transliteration: "millah", gloss: "religion/creed/community (editorial gloss)", keys: ["16:123"] });
  if (hanif) e.terminology.push({ term: hanif, transliteration: "hanif", gloss: "inclining toward truth/monotheist (editorial gloss)", keys: ["16:120"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `016-an-nahl-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 016-an-nahl-p${num}.json`);
}

// === CANDIDATES (cand-0637..cand-0676, 40 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-016-p1,ext-016-p2,ext-016-p3,ext-016-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0637..0646)
  { id: "cand-0637", label: "Divine command imminence removing human impatience", def: "In 16:1: The command of Allah is coming so be not impatient for it; Exalted is He above what they associate.", key: "16:1", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Amr Allah as eschatological event."},{topicId:"patience-haste",layer:"scholarly",relationship:"same-concept",note:"La tasta'jilu as patience command."}] },
  { id: "cand-0638", label: "Angelic inspiration as warning mechanism establishing tawheed", def: "In 16:2: He sends down angels with inspiration of His command upon whom He wills saying warn there is no deity except Me so fear Him.", key: "16:2", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Wahy through malak as warning delivery."},{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"La ilaha illa Ana as core message."}] },
  { id: "cand-0639", label: "Comprehensive livestock blessing catalog spanning multiple utilities", def: "In 16:5-8: Grazing livestock provide warmth benefits food beauty transport; horses mules donkeys for riding and adornment.", key: "16:5", overlap: [{topicId:"animals-as-communities",layer:"scholarly",relationship:"same-concept",note:"An'am as multi-purpose blessing."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Livestock as tangible ni'mah."}] },
  { id: "cand-0640", label: "Celestial subjection enabling navigation and timekeeping", def: "In 16:12: He subjected night day sun moon stars subjected by His command; indeed in that are signs for people who reason.", key: "16:12", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Taskhir of celestial bodies."},{topicId:"intellect-importance",layer:"scholarly",relationship:"related-not-identical",note:"Reasoning as sign-recognition faculty."}] },
  { id: "cand-0641", label: "Rain-vegetation cycle as agricultural provision system", def: "In 16:10-11: He sends down rain from sky producing drink and foliage for pasturing; grows crops olives palms grapevines fruits.", key: "16:10", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hydrological-agricultural sign chain."},{topicId:"divine-mercy",layer:"scholarly",relationship:"related-not-identical",note:"Rain as rahmah manifestation."}] },
  { id: "cand-0642", label: "Maritime commerce enabled by divine sea subjection", def: "In 16:14: He subjected sea to eat fresh meat extract ornaments wear ships plowing through it seeking His bounty.", key: "16:14", overlap: [{topicId:"work-honor",layer:"scholarly",relationship:"related-not-identical",note:"Fadl-seeking through maritime labor."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sea taskhir as economic enabler."}] },
  { id: "cand-0643", label: "Mountain stabilization as geological mercy preventing earthquakes", def: "In 16:15: He cast firmly set mountains on earth lest it shift with you; rivers roads landmarks; by stars they are guided.", key: "16:15", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Rawasi as geological sign."},{topicId:"environmental-corruption",layer:"scholarly",relationship:"related-not-identical",note:"Stability as environmental blessing."}] },
  { id: "cand-0644", label: "Uncountable divine favors establishing perpetual indebtedness", def: "In 16:18: If you should count the favors of Allah you could not enumerate them; indeed mankind is most unjust ungrateful.", key: "16:18", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Enumeration impossibility proving infinite ni'mah."},{topicId:"shukr-gratitude",layer:"scholarly",relationship:"same-concept",note:"Kufr al-ni'mah as ingratitude."}] },
  { id: "cand-0645", label: "Human origin from sperm-drop contrasting adversarial posture", def: "In 16:4: He created man from a sperm-drop then at once he is a clear adversary.", key: "16:4", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Nutfah origin vs khusumah posture."},{topicId:"pride-kibr",layer:"scholarly",relationship:"related-not-identical",note:"Adversarial stance despite humble origin."}] },
  { id: "cand-0646", label: "Creation in truth negating purposeless existence and shirk", def: "In 16:3: He created heavens and earth in truth; Exalted is He above what they associate.", key: "16:3", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq as purposeful creation."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"related-not-identical",note:"Truth-creation linked to tanzih."}] },

  // P2 (cand-0647..0656)
  { id: "cand-0647", label: "Polytheist determinism excuse refuted by prior messenger evidence", def: "In 16:35: Polytheists say if Allah willed we would not have worshipped besides Him nor our fathers nor forbidden anything; thus did those before them.", key: "16:35", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Determinism excuse rejected."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Historical precedent invalidates excuse."}] },
  { id: "cand-0648", label: "Universal messenger pattern with bifurcated guidance outcome", def: "In 16:36: We sent to every nation a messenger worship Allah avoid taghut; among them were guided and among them were justly misled.", key: "16:36", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Universal risalah principle."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"related-not-identical",note:"Guidance-misguidance duality."}] },
  { id: "cand-0649", label: "Observational command to study historical consequences of denial", def: "In 16:36: So travel through the earth and observe how was the end of the deniers.", key: "16:36", overlap: [{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Empirical observation commanded."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Historical sites as reflective evidence."}] },
  { id: "cand-0650", label: "Book revealed as clarification-guidance-mercy triad", def: "In 16:64: We have not revealed to you the Book except to make clear to them that wherein they differ and as guidance and mercy for people who believe.", key: "16:64", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Triple function: tibyan hudan rahmah."}] },
  { id: "cand-0651", label: "Idol incapacity demonstrated through creation-inability", def: "In 16:20-21: Those invoked besides Allah create nothing and are themselves created; dead not alive not perceiving when resurrected.", key: "16:20", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Created-status negating divinity."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Creation capacity as divinity criterion."}] },
  { id: "cand-0652", label: "Migration-persecution-patience sequence with divine forgiveness", def: "In 16:110: Then indeed your Lord to those who migrated after being persecuted then fought and were patient — your Lord thereafter is Forgiving Merciful.", key: "16:110", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Hijrah-fitnah-sabr sequence."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Post-trial ghafur rahim."}] },
  { id: "cand-0653", label: "Satanic beautification of deeds as counter-revelation mechanism", def: "In 16:63: Satan made their deeds attractive to them so he is their ally today and for them is painful punishment.", key: "16:63", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Tazyin as satanic deception."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Beautified evil as epistemological failure."}] },
  { id: "cand-0654", label: "Consultation command directing to people of remembrance", def: "In 16:43: Ask the people of remembrance (ahl al-dhikr) if you do not know.", key: "16:43", overlap: [{topicId:"knowledge-seeking",layer:"scholarly",relationship:"same-concept",note:"Su'al ahl al-dhikr as knowledge method."},{topicId:"remembrance",layer:"curated",relationship:"related-not-identical",note:"Dhikr-bearers as knowledge custodians."}] },
  { id: "cand-0655", label: "Slave-free parable demonstrating inequality of created versus Creator", def: "In 16:75: Allah strikes example: slave owned unable over anything versus one provided good spending secretly openly — are they equal?", key: "16:75", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Inequality parable refuting shirk."},{topicId:"giving",layer:"curated",relationship:"related-not-identical",note:"Spending capacity distinguishing Creator."}] },
  { id: "cand-0656", label: "Divine oath affirming resurrection against persistent denial", def: "In 16:38: They swore by Allah most solemn oaths Allah will not raise one who dies; rather it is a binding promise upon Him.", key: "16:38", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Qasam affirming ba'th."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Wa'd haqq as resurrection guarantee."}] },

  // P3 (cand-0657..0666)
  { id: "cand-0657", label: "Bee revelation producing multi-colored healing drink as natural sign", def: "In 16:68-69: Your Lord inspired the bee take houses in mountains trees; eat from all fruits follow ways of Lord; emerges from bellies drink varying colors in it healing for people.", key: "16:68", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Non-human wahy as extraordinary sign."},{topicId:"prophetic-medicine",layer:"scholarly",relationship:"same-concept",note:"Shifa' fihi as therapeutic sign."}] },
  { id: "cand-0658", label: "Livestock milk production spanning digestive physiology as biological sign", def: "In 16:66: Indeed for you in grazing livestock is a lesson; We give you drink from what is in their bellies between excretion and blood pure milk pleasant for drinkers.", key: "16:66", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Ibrah from biological process."},{topicId:"animals-as-communities",layer:"scholarly",relationship:"related-not-identical",note:"Livestock as provision community."}] },
  { id: "cand-0659", label: "Halal-haram dietary framework with necessity exception", def: "In 16:115: He has only forbidden dead meat blood flesh of swine dedicated to other than Allah; whoever is forced not transgressing nor sinning Allah is Forgiving Merciful.", key: "16:115", overlap: [{topicId:"halal-food",layer:"scholarly",relationship:"same-concept",note:"Four prohibitions with darurah exception."},{topicId:"haram-food",layer:"scholarly",relationship:"same-concept",note:"Maytah dam lahm khinzir ma uhilla."}] },
  { id: "cand-0660", label: "Gratitude linked to worship as integrated devotion", def: "In 16:114: Eat from what Allah provided lawful good and be grateful for Allah's favor if it is Him you worship.", key: "16:114", overlap: [{topicId:"shukr-gratitude",layer:"scholarly",relationship:"same-concept",note:"Shukr conditioned on ibadah."},{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Gratitude as worship expression."}] },
  { id: "cand-0661", label: "Town security-to-punishment narrative as gratitude-ingratitude paradigm", def: "In 16:112-113: Town secure abundant provision became ungrateful for Allah's favors; tasted garment of hunger and fear because of what they used to do.", key: "16:112", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Kufran bi'l-ni'mah triggering punishment."},{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Security as test condition."}] },
  { id: "cand-0662", label: "Human lifecycle reversal demonstrating divine knowledge-power", def: "In 16:70: Allah created you then takes you in death; among you reversed to most decrepit age knowing nothing after having known.", key: "16:70", overlap: [{topicId:"old-age-wisdom",layer:"scholarly",relationship:"related-not-identical",note:"Ardhal al-umur as knowledge loss."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Knowledge grant-withdrawal as divine prerogative."}] },
  { id: "cand-0663", label: "Lying fabrication against Allah producing brief enjoyment then severe punishment", def: "In 16:116-117: Do not invent lies against Allah saying this is lawful this is forbidden; those who fabricate enjoy briefly then have painful punishment.", key: "16:116", overlap: [{topicId:"lying",layer:"scholarly",relationship:"same-concept",note:"Iftira' ala Allah as supreme falsehood."},{topicId:"justice-oppression",layer:"scholarly",relationship:"related-not-identical",note:"Brief enjoyment followed by lasting penalty."}] },
  { id: "cand-0664", label: "Jewish dietary restrictions as punitive measure for transgression", def: "In 16:118: To those who are Jews We forbade what We related to you before; We did not wrong them but they used to wrong themselves.", key: "16:118", overlap: [{topicId:"halal-food",layer:"scholarly",relationship:"related-not-identical",note:"Tahrim as uqubah not asli."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Self-inflicted restriction through zulm."}] },
  { id: "cand-0665", label: "Spousal-progeny-provision triad as social blessing requiring recognition", def: "In 16:72: Allah made for you spouses from yourselves produced sons grandchildren provided good things; in falsehood believe in favor deny?", key: "16:72", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Family structure as ni'mah."},{topicId:"marriage-importance",layer:"scholarly",relationship:"related-not-identical",note:"Azواج as divine gift."}] },
  { id: "cand-0666", label: "Rain-revival as resurrection microcosm accessible to observation", def: "In 16:65: Allah sent down rain from sky given life to earth after lifelessness; indeed in that is sign for people who listen.", key: "16:65", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Ihya' al-ard as ba'th analogy."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Observable revival as theological evidence."}] },

  // P4 (cand-0667..0676)
  { id: "cand-0667", label: "Quran recitation preceded by isti'adha establishing spiritual protection", def: "In 16:98: When you recite the Quran seek refuge in Allah from Satan the expelled.", key: "16:98", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Recitation etiquette prescribed."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Isti'adha as protective dua."}] },
  { id: "cand-0668", label: "Satanic powerlessness against trusting believers", def: "In 16:99: Indeed he has no authority over those who believed and upon their Lord rely.", key: "16:99", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Tawakkul as satanic immunity."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Limited satanic jurisdiction."}] },
  { id: "cand-0669", label: "Prophetic methodology: wisdom good instruction best argumentation", def: "In 16:125: Invite to way of your Lord with wisdom and good instruction and argue with them in way that is best.", key: "16:125", overlap: [{topicId:"dialogue-principles",layer:"scholarly",relationship:"same-concept",note:"Hikmah-mau'idah-jidal triad."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Methodology reflecting prophetic character."}] },
  { id: "cand-0670", label: "Proportional retaliation with patience preference", def: "In 16:126: If you punish punish with equivalent of what you were harmed; but if you are patient it is better for the patient.", key: "16:126", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Qisas principle with afdal alternative."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr as superior response."}] },
  { id: "cand-0671", label: "Abraham as millat Ibrahim prototype defining prophetic identity", def: "In 16:120-123: Abraham was ummah qanit hanif not of mushrikin grateful for favors chosen guided straight path; revealed to you follow millat Ibrahim.", key: "16:120", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Millat Ibrahim as normative model."},{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Hanif as pure monotheism."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Multi-attribute prophetic exemplar."}] },
  { id: "cand-0672", label: "Patience sourced exclusively through divine enablement", def: "In 16:127: Be patient and your patience is not but through Allah; do not grieve over them nor be in distress from what they plot.", key: "16:127", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Ma sabruka illa billah as divine dependency."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Tawakkul replacing grief-distress."}] },
  { id: "cand-0673", label: "Divine companionship promise for muttaqin and muhsinin", def: "In 16:128: Indeed Allah is with those who fear Him and those who are doers of good.", key: "16:128", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Ma'iyyah conditioned on taqwa."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ihsan as companionship qualifier."}] },
  { id: "cand-0674", label: "Verse replacement acknowledged within divine knowledge framework", def: "In 16:101: When We replace a verse in place of another verse Allah knows best what He reveals; they say you are inventing.", key: "16:101", overlap: [{topicId:"quran-abrogation",layer:"scholarly",relationship:"same-concept",note:"Naskh acknowledged with divine knowledge."},{topicId:"quran-preservation",layer:"scholarly",relationship:"related-not-identical",note:"Replacement within preservation."}] },
  { id: "cand-0675", label: "Foreign-language objection answered by Arabic clarity", def: "In 16:103: We know they say he teaches him; tongue of one they refer to is foreign and this is clear Arabic language.", key: "16:103", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Lisan ajami vs lisan arabi mubin."},{topicId:"quranic-vocabulary",layer:"scholarly",relationship:"related-not-identical",note:"Arabic clarity as proof."}] },
  { id: "cand-0676", label: "Faith increase under persecution with divine forgiveness-mercy response", def: "In 16:110: Those who migrated after trial then fought and were patient — your Lord thereafter is Forgiving Merciful.", key: "16:110", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman strengthened through fitnah."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Post-trial divine response."}] }
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
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(30, 40).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `016-an-nahl-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-040.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-040.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
