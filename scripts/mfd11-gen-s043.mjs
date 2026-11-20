// MFD-11 Wave 6: Surah 43 (Az-Zukhruf) genuine re-extraction.
// Covers 43:1-89 in 5 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "043-0001-0089.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 43:${n} not found`);
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

console.log("Generating Surah 43 (Az-Zukhruf) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T15:45:00.000Z";

const PASSAGES = [
  { id: "ext-043-p1", from: 1, to: 25,
    label: "Ha-Meem; by the clear Book made an Arabic Quran that you might understand; in the Mother of the Book with Us exalted and full of wisdom; should We turn the message away disregarding you because you are a transgressing people; how many a prophet We sent among former peoples but none came except they ridiculed him; We destroyed greater than them in striking power and the example of the former peoples has preceded; ask who created heavens and earth they say the Exalted in Might the Knowing; who made earth a bed and roads upon it for guidance; sends rain in measured amounts reviving dead land thus you will be brought forth; created all species and made ships and animals you mount; settle on their backs remember the favour when settled and say exalted is He who subjected this to us we could not have subdued it and indeed to our Lord we will return; attributed to Him from His servants a portion man clearly ungrateful; taken daughters from what He created and chosen you for sons; when given good tidings of what he attributes to the Most Merciful his face darkens and he suppresses grief; one brought up in ornaments while unevident in conflict attributed to Allah; made angels servants of the Most Merciful females did they witness creation their testimony recorded questioned; said if Most Merciful willed would not have worshipped them no knowledge only falsifying; given book before Quran adhering to; found fathers upon religion following footsteps; similarly no warner sent to city except affluent said found fathers upon religion following footsteps; even if brought better guidance than fathers; disbelievers; took retribution see end of deniers",
    mainLabel: "Opening letters and oath by the clear Book grounding an Arabic Quran meant for understanding, held in the Mother of the Book as exalted and wise; the threat of turning the message away from a transgressing people set against the ridicule met by every prior prophet and the destruction of those greater in striking power; the creator-question answered by concession yet paired with the signs of the earth as bed, guided roads, measured rain reviving dead land, species creation and mounted transport prompting glorification of the Subduer and acknowledgment of return; daughter-attribution exposing ingratitude, with the ornamented-conflict contrast; angels named female without witnessed creation, their testimony reserved for questioning; the claim that divine will excuses worship rejected as knowledge-free falsification; no prior book cited, only ancestral religion followed despite the offer of better guidance; retribution taken and the deniers' end displayed" },
  { id: "ext-043-p2", from: 26, to: 45,
    label: "Ibrahim said to father and people I am disassociated from what you worship except He who created me He will guide me; made it a word remaining among descendants that they might return; gave enjoyment to these and their fathers until truth and clear Messenger came; when truth came said magic disbelievers; why not sent down upon great man from two cities; distribute mercy Lord apportioned livelihood raised some above others degrees use one another service mercy Lord better than accumulate; if not people become one community made disbelievers houses ceilings stairways silver mount; doors couches silver recline; gold ornament all not but enjoyment worldly life Hereafter Lord righteous; blinded remembrance Most Merciful appoint devil companion; devils avert way think rightly guided; comes Us says wish distance east west wretched companion; never benefit Day wronged sharing punishment; make deaf hear guide blind clear error; whether take you away take retribution upon them; show promised Perfect Ability; adhere revealed straight path; remembrance you people questioned; ask messengers before made besides Most Merciful deities worshipped",
    mainLabel: "Ibrahim's disassociation from his people's worship save the Creator who guides, established as a lasting word among his descendants for their return; prolonged enjoyment granted until the truth and clear Messenger arrived, dismissed as magic; the demand for a great man from the two cities answered by the question of distributing divine mercy, which is apportioned through differentiated livelihoods enabling mutual service, surpassing all accumulation; silver ceilings, stairways, doors, couches and gold ornament withheld only to prevent unified disbelief, being mere worldly enjoyment against the Hereafter for the righteous; blindness to the Rahman's remembrance earning a devil-companion who averts while seeming to guide, producing the east-west regret at meeting; shared punishment availing nothing; prophetic inability to make the deaf hear or the blind see; death or demonstration both covered by perfect ability; adherence to the straight path named remembrance and subject to questioning; the challenge to ask prior messengers whether deities beside the Rahman were ever appointed" },
  { id: "ext-043-p3", from: 46, to: 66,
    label: "sent Musa signs Firawn establishment said messenger Lord worlds; brought signs laughed; showed sign greater sister seized affliction perhaps return; said O magician invoke Lord promised guided; removed affliction broke word; Firawn called people said kingdom Egypt mine rivers flowing beneath not see; better than insignificant hardly makes clear; bracelets gold come angels conjunction; bluffed people obeyed defiantly disobedient; angered Us took retribution drowned all; made precedent example later peoples; son Maryam presented example immediately people laughed aloud; said gods better or he presented comparison argument people prone dispute; Isa not but servant bestowed favour made example Children Israel; willed made instead angels succeeding earth; Isa sign knowledge Hour doubt follow Me straight path; never let Satan avert clear enemy; Isa brought clear proofs said come wisdom make clear differ fear Allah obey me; Allah my Lord your Lord worship Him straight path; denominations differed woe wronged painful Day; waiting Hour come suddenly perceive not; close friends Day enemies except righteous",
    mainLabel: "Musa sent with signs to Pharaoh and his establishment declaring himself messenger of the Lord of the worlds, met with laughter; each sign shown greater than its sister, affliction applied for possible return; the magician-address requesting invocation followed by broken word once affliction lifted; Pharaoh boasting of Egypt's kingdom and rivers, dismissing Musa as insignificant without gold bracelets or angelic escort, bluffing his defiantly disobedient people into obedience; anger earned, retribution taken, all drowned as precedent and example; Isa presented as example provoking laughter and a disputatious comparison asking whether their gods or he is better; Isa defined as merely a servant granted favour and made an example for Israel, with angels replaceable by will; Isa as sign of the Hour commanding doubt's removal and following the straight path; Satanic aversion warned against; Isa's arrival with wisdom to clarify differences, commanding fear and obedience to the shared Lord; denominational division producing woe for wrongdoers; sudden Hour awaited while unperceived; close friends becoming enemies save the righteous" },
  { id: "ext-043-p4", from: 67, to: 78,
    label: "O My servants no fear concerning you Day nor grieve; believed verses Muslims; enter Paradise kinds delighted; circulated plates vessels gold whatever souls desire delights eyes abide eternally; Paradise inherit used do; much fruit eat; criminals punishment Hell abiding eternally; not allowed subside despair; not wronged wrongdoers; call O Malik let Lord put end us says remain; brought truth most averse; devised affair devising plan; think hear not secrets private conversations yes messengers recording",
    mainLabel: "Divine address removing fear and grief from believing Muslim servants invited to enter Paradise delighted with their kinds; gold plates and vessels circulated with every desire and eye-delight fulfilled in eternal abode inherited through deeds; abundant fruit provided; criminals in eternal Hell with undiminished punishment and despair, having wronged themselves rather than being wronged; their plea to Malik for termination refused with the command to remain; truth brought yet mostly averted; their plotted affair countered by divine planning; denial of hidden surveillance refuted by affirming that secrets and private conversations are heard and recorded by messengers" },
  { id: "ext-043-p5", from: 79, to: 89,
    label: "say O Muhammad Most Merciful had son first worshippers; exalted Lord heavens earth Lord Throne above describe; leave converse vainly amuse meet Day promised; Allah deity heaven earth Wise Knowing; blessed dominion heavens earth between knowledge Hour returned; invoke besides Him possess not intercession testify truth know; asked who created surely say Allah deluded; acknowledges saying O Lord indeed people not believe; turn aside say Peace going know",
    mainLabel: "The hypothetical sonship of the Rahman answered by the Prophet's priority in worship, immediately negated by exalting the Lord of heavens, earth and the Throne above description; the command to leave them in vain amusement until the promised Day; Allah affirmed as sole deity in heaven and earth, Wise and Knowing; blessing declared over the Owner of cosmic dominion and Hour-knowledge to whom all return; invoked rivals denied intercession except those testifying to truth knowingly; the creator-question producing the unanimous answer Allah yet leaving them deluded; the Prophet's complaint acknowledged that these people do not believe; the instruction to turn aside with a greeting of peace while they will come to know" }
];

const SUB_LABELS = {
  "ext-043-p1": [
    "Opening disjointed letters Ha-Meem",
    "Oath sworn by the clear Book",
    "Its making as an Arabic Quran so that understanding may occur",
    "Its standing in the Mother of the Book as exalted and full of wisdom",
    "The question of turning the message away from a transgressing people",
    "Many prophets sent among former peoples",
    "Every arriving prophet met with ridicule",
    "Destruction of those greater in striking power, with the precedent of earlier peoples noted",
    "The creator-question posed and their answer naming the Mighty Knowing",
    "Earth made a bed with guided roads placed upon it",
    "Rain sent in measured amounts reviving dead land as a resurrection parallel",
    "All species created, with ships and mountable animals provided",
    "Settling on mounts followed by remembering the Subduer's favour and acknowledging return",
    "A portion of His servants attributed to Him while man is clearly ungrateful",
    "Daughters attributed to Him from His creation while sons are claimed for themselves",
    "Darkened face and suppressed grief at receiving what is attributed to the Rahman",
    "One raised in ornaments yet unevident in conflict assigned to Allah",
    "Angels named female without witnessed creation, their testimony reserved for questioning",
    "Worship excused by claiming the Rahman's will, rejected as knowledge-free falsification",
    "Challenge to produce a prior book they adhere to",
    "Ancestral religion cited as the basis for following their footsteps",
    "The pattern repeated for every warner sent to a city whose affluent made the same claim",
    "The offer of better guidance than the fathers' religion rejected",
    "Disbelief declared in what the warner was sent with",
    "Retribution taken from them, with the deniers' end offered for observation"
  ],
  "ext-043-p2": [
    "Ibrahim's disassociation from his father's and people's worship",
    "Exception made for the Creator who will guide him",
    "That declaration established as a lasting word among his descendants for their return",
    "Enjoyment granted to these people and their fathers until the truth and a clear Messenger arrived",
    "The arriving truth dismissed as magic with disbelief declared",
    "Demand for the Quran to be sent upon a great man from one of the two cities",
    "Question of distributing the Lord's mercy answered by His apportionment of livelihood and raising in degrees for mutual service, with divine mercy exceeding accumulation",
    "Silver ceilings and stairways withheld only lest people become one community of disbelief",
    "Silver doors and couches likewise withheld",
    "Gold ornament added, all identified as mere worldly enjoyment against the Hereafter reserved for the righteous",
    "Blindness to the Rahman's remembrance earning a devil appointed as companion",
    "Devils averting from the way while appearing to guide rightly",
    "The east-west regret expressed to the companion upon coming to Us",
    "Shared punishment declared of no benefit on that Day for the wrongdoers",
    "Rhetorical inability to make the deaf hear or guide the blind or one in clear error",
    "Whether the Prophet is taken away or not, retribution will be exacted upon them",
    "Whether the promise is shown or not, perfect ability is affirmed",
    "Command to adhere to what is revealed as a straight path",
    "It named a remembrance for the Prophet and his people, with questioning to come",
    "Challenge to ask prior messengers whether deities beside the Rahman were ever appointed for worship"
  ],
  "ext-043-p3": [
    "Musa sent with signs to Pharaoh and his establishment declaring himself messenger of the Lord of the worlds",
    "His signs met with immediate laughter",
    "Each sign shown greater than its sister, with affliction applied so they might return",
    "Addressed as magician and asked to invoke his Lord by what was promised, with guidance pledged",
    "Affliction removed and the word immediately broken",
    "Pharaoh calling out to his people asserting ownership of Egypt's kingdom and its flowing rivers",
    "Dismissing Musa as insignificant and barely articulate",
    "Challenging why gold bracelets or accompanying angels were not given to him",
    "Pharaoh bluffing his people into obedience while they were already defiantly disobedient",
    "Their angering of Allah bringing retribution and drowning of all",
    "Them made a precedent and example for later peoples",
    "Isa presented as an example provoking immediate loud laughter",
    "The disputatious question whether their gods or Isa is better, named as mere argument from a contentious people",
    "Isa defined as nothing but a servant granted favour and made an example for the Children of Israel",
    "Angels could have been made successors on earth by will instead of humans",
    "Isa named a sign of the Hour's knowledge, commanding freedom from doubt and following the straight path",
    "Warning never to let Satan avert, named a clear enemy",
    "Isa bringing clear proofs and wisdom to clarify their differences, commanding fear of Allah and obedience",
    "Declaration that Allah is his Lord and their Lord, commanding His worship on a straight path",
    "Denominations differing among them, with woe pronounced on the wrongdoers from a painful Day",
    "Their awaiting only the Hour's sudden arrival while they do not perceive"
  ],
  "ext-043-p4": [
    "Close friends becoming enemies on that Day except the righteous",
    "Divine address removing fear and grief from His servants who believed and submitted",
    "Invitation to enter Paradise delighted, they and their kinds",
    "Gold plates and vessels circulated among them",
    "Whatever souls desire and eyes delight in provided, with eternal abode affirmed",
    "Paradise named an inheritance for what they used to do",
    "Abundant fruit available to eat therein",
    "Criminals in the punishment of Hell, abiding eternally",
    "Punishment not lightened for them while they remain in despair",
    "Clarification that they were not wronged but were themselves the wrongdoers",
    "Their cry to Malik asking his Lord to end them, answered with the command to remain",
    "Notice that the truth had been brought but most were averse to it"
  ],
  "ext-043-p5": [
    "Their devising of an affair answered by divine devising of a plan",
    "Question whether He hears not their secrets and private conversations, affirmed with recording messengers present",
    "Hypothetical sonship of the Rahman answered by the Prophet's priority in worship",
    "Exaltation of the Lord of heavens, earth and the Throne above what they describe",
    "Instruction to leave them conversing vainly and amusing themselves until the promised Day",
    "Allah affirmed as the sole deity in heaven and on earth, Wise and Knowing",
    "Blessing declared over the Owner of the dominion of heavens, earth and between them, with Hour-knowledge and return to Him",
    "Those invoked besides Him possessing no intercession, save those who testify to the truth knowingly",
    "The creator-question yielding the answer Allah while they remain deluded",
    "Acknowledgment of the Prophet's complaint that these are a people who do not believe",
    "Instruction to turn aside from them with a greeting of peace, for they will come to know"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`43:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`43:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 43, surahName: "Az-Zukhruf",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 6 genuine re-extraction. Boundaries follow the text: P1 closes with the deniers' retribution (25) before Ibrahim's disassociation opens (26); P2 ends with the challenge to ask prior messengers (45); P3 runs through the Musa-Pharaoh narrative and Isa-as-example block closing with the sudden Hour (66); P4 covers the righteous-friends exception through the truth-aversion notice (67-78); P5 begins with their plotting and closes with the turn-aside-and-peace instruction (79-89).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (43:1-25) ===
{
  const e = extractions[0];
  const aziz = findWord(9, ["\u0639","\u0632","\u064a","\u0632"]);
  const aleem = findWord(9, ["\u0639","\u0644","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["43:9"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["43:9"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Universal ridicule directed at every prophet sent to former peoples", keys: ["43:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Attributing daughters to the Rahman while claiming sons, with darkened face and suppressed grief at the prospect", keys: ["43:16","43:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Naming angels female without witnessing their creation, reserving testimony for future questioning", keys: ["43:19"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Excusing shirk by appealing to the Rahman's will, rejected as baseless falsification", keys: ["43:20"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Earth as bed with guided roads, measured rain reviving dead land, and ships and mountable animals provided", keys: ["43:10","43:11","43:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Glorification of the Subduer prompted upon settling on mounts, with acknowledgment of return to the Lord", keys: ["43:13","43:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Ancestral religion cited as sole justification for rejecting better guidance from every warner", keys: ["43:22","43:23","43:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Retribution taken from them, with their end offered as an example for later peoples", keys: ["43:25"], evidenceClass: "EXPLICIT_TEXT" });

  const umm = findWord(4, ["\u0623","\u0645"]);
  if (umm) e.terminology.push({ term: umm, transliteration: "umm al-kitab", gloss: "Mother of the Book (editorial gloss)", keys: ["43:4"] });
}

// === POPULATE P2 (43:26-45) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["43:43"], excerpt: fv(43), description: "So adhere to that which is revealed to you; indeed you are on a straight path." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["43:45"], excerpt: fv(45), description: "Ask those We sent before you of Our messengers whether We made deities besides the Rahman to be worshipped." });

  e.propheticNarratives.push({ label: "Ibrahim disassociating from his father's and people's worship, establishing a lasting word among his descendants for their return", keys: ["43:26","43:27","43:28"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Truth dismissed as magic upon its arrival despite prolonged enjoyment beforehand", keys: ["43:29","43:30"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Demand for revelation to descend upon a socially prominent figure from the two cities", keys: ["43:31"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Blindness to the Rahman's remembrance earning a devil-companion who averts while seeming to guide", keys: ["43:36","43:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "East-west regret expressed toward the companion upon meeting the Lord", keys: ["43:38"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Differentiated livelihoods and ranks enabling mutual service, with divine mercy exceeding material accumulation", keys: ["43:32"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Silver ceilings, stairways, doors, couches and gold ornament withheld to prevent unified disbelief, identified as worldly enjoyment", keys: ["43:33","43:34","43:35"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Ibrahim's word preserved among his descendants so they might return to it", keys: ["43:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Shared punishment declared useless on the Day for those who wronged", keys: ["43:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Perfect ability affirmed whether the Prophet is taken away or the promise shown", keys: ["43:41","43:42"], evidenceClass: "EXPLICIT_TEXT" });

  const qaryatayn = findWord(31, ["\u0642","\u0631","\u064a","\u062a"]);
  if (qaryatayn) e.terminology.push({ term: qaryatayn, transliteration: "al-qaryatayn", gloss: "the two cities (editorial gloss)", keys: ["43:31"] });
}

// === POPULATE P3 (43:46-66) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["43:61"], excerpt: fv(61), description: "Do not be in doubt of the Hour and follow Me; this is a straight path." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["43:62"], excerpt: fv(62), description: "Never let Satan avert you; indeed he is to you a clear enemy." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["43:64"], excerpt: fv(64), description: "Indeed Allah is my Lord and your Lord, so worship Him; this is a straight path." });

  e.propheticNarratives.push({ label: "Musa sent with signs to Pharaoh and his establishment; signs mocked; each sign greater than its sister; affliction applied; magician-address with broken promise; Pharaoh boasting kingdom and rivers; dismissal as insignificant without gold or angels; bluffing defiantly disobedient people; drowning as precedent and example", keys: ["43:46","43:47","43:48","43:49","43:50","43:51","43:52","43:53","43:54","43:55","43:56"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Isa presented as example provoking laughter; disputatious comparison; defined as servant granted favour and example for Israel; sign of the Hour; brought wisdom clarifying differences; denominations differed producing woe", keys: ["43:57","43:58","43:59","43:60","43:61","43:63","43:64","43:65"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Pharaoh's boast of Egypt's kingdom and rivers while dismissing Musa as insignificant and unclear", keys: ["43:51","43:52"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "People bluffed into obedience while already defiantly disobedient", keys: ["43:54"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Loud laughter at Isa's presentation and disputatious comparison rather than reflection", keys: ["43:57","43:58"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Awaiting only the Hour's sudden arrival while failing to perceive it", keys: ["43:66"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Gold bracelets and angelic escort demanded as conditions for accepting a messenger", keys: ["43:53"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Each sign shown greater than its sister, with affliction applied seeking return", keys: ["43:48"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Promise of guidance given then immediately broken upon affliction's removal", keys: ["43:49","43:50"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Drowning made a precedent and example for later peoples", keys: ["43:56"], evidenceClass: "EXPLICIT_TEXT" });

  const zukhruf = findWord(53, ["\u0632","\u062e","\u0631","\u0641"]);
  if (zukhruf) e.terminology.push({ term: zukhruf, transliteration: "zukhruf", gloss: "gold ornament/adornment (editorial gloss)", keys: ["43:53"] });
}

// === POPULATE P4 (43:67-78) ===
{
  const e = extractions[3];

  e.humanConditionsAndSpiritualStates.push({ label: "Close friends becoming enemies on that Day except the righteous", keys: ["43:67"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Fear and grief removed from believing Muslim servants addressed directly by Allah", keys: ["43:68"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Criminals in eternal Hell with punishment undiminished and despair unabated", keys: ["43:74","43:75"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Plea to Malik for termination refused with the command to remain", keys: ["43:77"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Gold plates and vessels circulated in Paradise with every desire and eye-delight fulfilled", keys: ["43:71"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Paradise inherited as recompense for what they used to do, with abundant fruit to eat", keys: ["43:72","43:73"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Entry into Paradise granted to servants and their kinds in delight", keys: ["43:70"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Self-inflicted wrong affirmed: they were not wronged but were the wrongdoers", keys: ["43:76"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Truth brought yet most averse to it", keys: ["43:78"], evidenceClass: "EXPLICIT_TEXT" });

  const malik = findWord(77, ["\u0645","\u0627","\u0644","\u0643"]);
  if (malik) e.terminology.push({ term: malik, transliteration: "Malik", gloss: "keeper of Hell (editorial gloss)", keys: ["43:77"] });
}

// === POPULATE P5 (43:79-89) ===
{
  const e = extractions[4];
  const hakeem = findWord(84, ["\u062d","\u0643","\u064a","\u0645"]);
  const aleem = findWord(84, ["\u0639","\u0644","\u064a","\u0645"]);
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["43:84"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["43:84"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["43:83"], excerpt: fv(83), description: "So leave them to converse vainly and amuse themselves until they meet their promised Day." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["43:89"], excerpt: fv(89), description: "So turn aside from them and say Peace; but they are going to know." });

  e.humanConditionsAndSpiritualStates.push({ label: "Plotted affair countered by divine planning", keys: ["43:79"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Secrets and private conversations heard and recorded by messengers despite their assumption otherwise", keys: ["43:80"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Unanimous concession that Allah is creator yet persisting in delusion", keys: ["43:87"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Hypothetical sonship of the Rahman answered by prophetic priority in worship, immediately negated by transcendence", keys: ["43:81","43:82"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Intercession denied to invoked rivals, restricted to those testifying to truth knowingly", keys: ["43:86"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Prophetic complaint acknowledged that these are a people who do not believe", keys: ["43:88"], evidenceClass: "EXPLICIT_TEXT" });

  const salam = findWord(89, ["\u0633","\u0644","\u0627","\u0645"]);
  if (salam) e.terminology.push({ term: salam, transliteration: "salam", gloss: "peace (editorial gloss)", keys: ["43:89"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `043-az-zukhruf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 043-az-zukhruf-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-043-p1,ext-043-p2,ext-043-p3,ext-043-p4,ext-043-p5",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1497", label: "Arabic Quran grounded in the Mother of the Book as exalted and wise", def: "In 43:2-4: By the clear Book; indeed We made it an Arabic Quran that you might understand; and indeed it is in the Mother of the Book with Us, exalted and full of wisdom.", key: "43:2", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Umm al-kitab anchoring."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"related-not-identical",note:"Understanding as purpose."}] },
  { id: "cand-1498", label: "Universal ridicule of every prophet sent to former peoples", def: "In 43:6-7: How many a prophet We sent among the former peoples, but there would not come to them a prophet except that they used to ridicule him.", key: "43:6", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Recurring rejection pattern."},{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Ridicule as prophetic trial."}] },
  { id: "cand-1499", label: "Creator-question conceded while daughter-attribution persists", def: "In 43:9-16: If you ask who created heavens and earth they say the Mighty Knowing; yet they attribute to Him from His servants a portion; indeed man is clearly ungrateful; or has He taken daughters from what He created and chosen you for sons?", key: "43:9", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Concession without submission."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Gender projection onto the divine."}] },
  { id: "cand-1500", label: "Mounts prompting glorification of the Subduer and acknowledgment of return", def: "In 43:12-14: Who created the species and made ships and animals you mount, that you may settle on their backs and remember the favour of your Lord when settled and say exalted is He who subjected this to us and we could not have subdued it, and indeed to our Lord we will return.", key: "43:12", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr triggered by taskhir."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Transport as ayah."}] },
  { id: "cand-1501", label: "Angels named female without witnessed creation, testimony deferred", def: "In 43:19: And they have made the angels, who are servants of the Most Merciful, females; did they witness their creation? Their testimony will be recorded and they will be questioned.", key: "43:19", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Servants of the Rahman gendered."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Shahada requirement for attribution."}] },
  { id: "cand-1502", label: "Ancestral religion invoked to reject better guidance from every warner", def: "In 43:22-24: Rather they say we found our fathers upon a religion and we follow their footsteps; similarly We sent no warner to a city except its affluent said we found our fathers upon a religion; even if I brought you better guidance? They said we disbelieve in what you were sent with.", key: "43:22", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Taqlid overriding bayyinah."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Pattern across every city."}] },

  { id: "cand-1503", label: "Ibrahim's lasting word among descendants for their return", def: "In 43:26-28: Ibrahim said I am disassociated from what you worship except He who created me; and he made it a word remaining among his descendants that they might return.", key: "43:26", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Kalimah baqiyah legacy."},{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Return enabled by the word."}] },
  { id: "cand-1504", label: "Demand for revelation to descend upon a socially prominent figure", def: "In 43:31: And they said why was this Quran not sent down upon a great man from one of the two cities?", key: "43:31", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Social status as criterion."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Recipient contested."}] },
  { id: "cand-1505", label: "Differentiated livelihoods enabling mutual service, mercy exceeding accumulation", def: "In 43:32: Do they distribute the mercy of your Lord? It is We who apportioned their livelihood and raised some above others in degrees that they may use one another for service; but the mercy of your Lord is better than whatever they accumulate.", key: "43:32", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Rizq distribution as rahmah."},{topicId:"work-honor",layer:"scholarly",relationship:"same-concept",note:"Mutual service structure."}] },
  { id: "cand-1506", label: "Material wealth withheld to prevent unified disbelief", def: "In 43:33-35: If it were not that people would become one community of disbelievers We would have made for those who disbelieve in the Rahman ceilings and stairways of silver, doors and couches of silver, and gold ornament; but all that is not but the enjoyment of worldly life, and the Hereafter with your Lord is for the righteous.", key: "43:33", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Withholding as protective measure."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Dunya versus akhirah valuation."}] },
  { id: "cand-1507", label: "Blindness to the Rahman's remembrance earning a devil-companion", def: "In 43:36-37: Whoever is blinded from remembrance of the Most Merciful, We appoint for him a devil and he is to him a companion; and indeed the devils avert them from the way while they think they are rightly guided.", key: "43:36", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr neglect consequences."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Qarin appointment."}] },
  { id: "cand-1508", label: "East-west regret toward the companion upon meeting the Lord", def: "In 43:38-39: Until when he comes to Us he says oh I wish there was between me and you the distance between east and west, how wretched a companion; and never will it benefit you that Day when you have wronged that you are sharing in the punishment.", key: "43:38", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Companion regret at meeting."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Shared punishment avails nothing."}] },

  { id: "cand-1509", label: "Each sign greater than its sister with affliction applied for return", def: "In 43:48: And We showed them not a sign except that it was greater than its sister, and We seized them with affliction that perhaps they might return to faith.", key: "43:48", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Escalating ayat sequence."},{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Affliction aimed at return."}] },
  { id: "cand-1510", label: "Promise of guidance given then immediately broken upon relief", def: "In 43:49-50: They said O magician invoke for us your Lord by what He promised you, indeed we will be guided; but when We removed the affliction from them, at once they broke their word.", key: "43:49", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Conditional pledge broken."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Nakth al-wa'd."}] },
  { id: "cand-1511", label: "Pharaoh's boast of kingdom and rivers dismissing Musa as insignificant", def: "In 43:51-52: Pharaoh called out among his people saying does not the kingdom of Egypt belong to me and these rivers flowing beneath me, do you not see? Or am I not better than this one who is insignificant and hardly makes himself clear?", key: "43:51", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Wealth-based superiority claim."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"related-not-identical",note:"Political authority vs prophethood."}] },
  { id: "cand-1512", label: "Gold bracelets and angelic escort demanded as prophetic credentials", def: "In 43:53: Then why have there not been placed upon him bracelets of gold or come with him the angels in conjunction?", key: "43:53", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Material criteria for truth."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Misplaced evidentiary standard."}] },
  { id: "cand-1513", label: "People bluffed into obedience while already defiantly disobedient", def: "In 43:54: So he bluffed his people and they obeyed him; indeed they were themselves a people defiantly disobedient of Allah.", key: "43:54", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Istakhaffa leadership."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Qawm fasiqin complicity."}] },
  { id: "cand-1514", label: "Isa as servant granted favour and example, not object of dispute", def: "In 43:57-59: When the son of Mary was presented as an example your people laughed aloud and said are your gods better or is he? They presented the comparison only for argument, they are a people prone to dispute; Jesus was not but a servant upon whom We bestowed favour and We made him an example for the Children of Israel.", key: "43:57", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Abd and ni'mah definition."},{topicId:"dialogue-principles",layer:"scholarly",relationship:"same-concept",note:"Jadal versus inquiry."}] },

  { id: "cand-1515", label: "Paradise inherited through deeds with gold vessels and fulfilled desires", def: "In 43:71-73: Circulated among them will be plates and vessels of gold, and therein is whatever the souls desire and what delights the eyes, and you will abide therein eternally; and that is Paradise which you are made to inherit for what you used to do; for you therein is much fruit from which you will eat.", key: "43:71", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Irth linked to amal."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Deeds as inheritance basis."}] },
  { id: "cand-1516", label: "Plea to Malik for termination refused with the command to remain", def: "In 43:77: And they will call O Malik let your Lord put an end to us; he will say indeed you will remain.", key: "43:77", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Malik's refusal."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Permanence of punishment."}] },

  { id: "cand-1517", label: "Secrets and private conversations heard and recorded despite assumptions", def: "In 43:80: Or do they think that We hear not their secrets and their private conversations? Yes, and Our messengers are with them recording.", key: "43:80", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Sirr and najwa encompassed."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Recording messengers."}] },
  { id: "cand-1518", label: "Hypothetical sonship negated by transcendence above description", def: "In 43:81-82: Say if the Most Merciful had a son then I would be the first of his worshippers; exalted is the Lord of the heavens and the earth, Lord of the Throne, above what they describe.", key: "43:81", overlap: [{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Walad hypothetically entertained then negated."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Rabb al-arsh transcendence."}] },
  { id: "cand-1519", label: "Intercession denied to invoked rivals, restricted to truthful witnesses", def: "In 43:86: And those they invoke besides Him do not possess power of intercession; but only those who testify to the truth can benefit, and they know.", key: "43:86", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"No shafa'ah for rivals."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Shahada bi'l-haqq condition."}] },
  { id: "cand-1520", label: "Turn aside with peace while they will come to know", def: "In 43:89: So turn aside from them and say Peace; but they are going to know.", key: "43:89", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"I'rad as prophetic response."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Salam as parting word."}] }
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
    notes: "Wave 6 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 6).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(6, 12).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(12, 18).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(18, 20).map(c => c.candidateId);
extractions[4].topicCandidateIds = candidates.candidates.slice(20, 24).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `043-az-zukhruf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-067.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-067.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
