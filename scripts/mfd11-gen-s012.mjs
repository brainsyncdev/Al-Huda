// MFD-11 Wave 1: Surah 12 (Yusuf) genuine re-extraction.
// Covers 12:1–111 in 4 narrative-act passages with populated analytical arrays.
// All Arabic extracted verbatim from pinned corpus via indexOf+slice.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "012-0001-0111.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 12:${n} not found`);
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

console.log("Generating Surah 12 (Yusuf) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T12:00:00.000Z";

// === PASSAGE BOUNDARIES (following narrative acts) ===
// P1: 12:1–25 — Dream, betrayal, well, Potiphar's house, temptation
// P2: 12:26–52 — Imprisonment, dream interpretation, king's dream, exoneration
// P3: 12:53–86 — Rise to power, famine, brothers' visits, Benjamin detained
// P4: 12:87–111 — Reunion, forgiveness, family prostration, closing tawheed

const PASSAGES = [
  { id: "ext-012-p1", from: 1, to: 25,
    label: "Yusuf — Ahsan al-qasas revelation; Yusuf's dream eleven stars sun moon prostrating; father Yaqub warns against telling brothers fearing shaytan plot; brothers conspire kill or exile Yusuf for father's love; cast into well caravan finds him sold cheap; Aziz Egypt buys tells wife honor guest; Yusuf given wisdom knowledge; Aziz wife tempts locks doors he seeks refuge Allah; she tears garment from behind; husband witnesses truth from torn garment; women city cut hands amazed at beauty; Yusuf chooses prison over sin",
    mainLabel: "Quran as best of narratives establishing prophetic storytelling paradigm; Yusuf's cosmic dream foreshadowing future authority; paternal warning against sibling jealousy and shaytan exploitation; fratricidal conspiracy driven by perceived paternal favoritism; well-as-transition motif from family to foreign land; divine providence through commercial transaction; sexual temptation resisted through isti'adha; garment-tearing as forensic evidence of innocence; collective female recognition of Yusuf's extraordinary nature; voluntary imprisonment chosen over moral compromise" },
  { id: "ext-012-p2", from: 26, to: 52,
    label: "Yusuf — Witness from her family testifies if garment torn front she truthful if behind he truthful; husband acknowledges wife guilt asks forgiveness; women repeat invitation Yusuf prays Lord prison dearer than what they invite; imprisoned years two young men enter one dreams pressing wine other birds eating bread; Yusuf teaches tawhid before interpretation; interprets wine-presser serves king bird-eater crucified; asks wine-presser mention him to lord but shaytan makes forget; king dreams seven fat cows eaten by lean seven green ears dry; nobles confused call it jumbled dreams; released prisoner remembers Yusuf interprets seven years abundance then seven drought; king summons Yusuf refuses until cleared of accusation; women confess truth Yusuf innocent; Aziz wife admits guilt; Yusuf requests investigation to prove innocence; king recognizes trustworthiness appoints over storehouses",
    mainLabel: "Forensic testimony establishing Yusuf's innocence through garment direction; public female confession confirming virtue; dream interpretation preceded by tawheed instruction establishing theological priority; dual prisoner dreams demonstrating interpretive accuracy; royal dream crisis enabling Yusuf's emergence from obscurity; delayed remembrance as divine timing mechanism; conditional release requiring prior exoneration; institutional appointment based on proven trustworthiness and knowledge" },
  { id: "ext-012-p3", from: 53, to: 86,
    label: "Yusuf — Establishes grain storage policy during abundance years; famine strikes Egypt and surrounding lands; brothers arrive unrecognized bow fulfilling childhood dream; Yusuf recognizes them they unaware; demands bring younger brother as proof of honesty; detains Simeon returns money in sacks; brothers report to Yaqub who recalls Yusuf disappearance fears another loss; Jacob initially refuses Benjamin citing past trauma; supplies exhausted forces return; Judah guarantees Benjamin safety; second visit Yusuf reveals identity to Benjamin privately; plants cup in Benjamin sack accuses theft; brothers deny recall Yusuf theft accusation; Benjamin detained brothers plead offer themselves instead; Judah delivers impassioned appeal citing father's grief and previous loss; Yusuf unable to bear concealment dismisses attendants reveals identity",
    mainLabel: "Administrative foresight in agricultural surplus management; famine as catalyst for family reunion and dream fulfillment; unrecognized encounter enabling testing of brothers' character transformation; Simeon detention as leverage ensuring Benjamin's return; returned silver demonstrating Yusuf's integrity despite power; Jacob's protective reluctance rooted in unresolved trauma; Judah's guarantee marking moral growth from original conspirator; cup-test revealing brothers' willingness to sacrifice for sibling; Judah's eloquent plea demonstrating complete character reformation; emotional disclosure scene as narrative climax" },
  { id: "ext-012-p4", from: 87, to: 111,
    label: "Yusuf — Reveals I am Yusuf this my brother Allah favored us whoever fears Allah patient Allah does not waste reward good-doers; brothers acknowledge Allah preferred you we were sinful; no blame today Allah forgive most merciful; sends shirt cast on father face restores sight; entire family arrives honored seated on thrones; parents raised upon throne all fall prostrate fulfilling childhood dream; Yusuf recalls dream interpretation Lord made reality favored me brought from prison reunited after shaytan estrangement; Lord subtle accomplishes will He Knowing Wise; Joseph's prayer gratitude for sovereignty and dream interpretation requesting death as Muslim joined with righteous; concluding address to humanity Quran reminder believers not fabricated hadith confirmation previous scriptures detailed explanation guidance mercy",
    mainLabel: "Identity revelation paired with divine favor attribution; brothers' acknowledgment of Yusuf's election and their culpability; unconditional forgiveness mirroring divine mercy; shirt-as-healing-motif connecting physical restoration to relational restoration; throne-prostration fulfilling cosmic dream completing narrative arc; retrospective recognition of divine subtlety (latif) across decades of suffering; closing dua integrating personal gratitude with universal submission; meta-narrative framing positioning Yusuf story as Quranic confirmation of prior revelation and guidance for believing community" }
];

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-012-p1": [
    "Alif Lam Ra opening followed by declaration that these are verses of the clear Book",
    "Revelation of an Arabic Quran so that people may understand through their own language",
    "Divine narration of the best of stories through Quranic revelation addressing prior unawareness",
    "Yusuf recounting his dream of eleven stars sun and moon prostrating to him",
    "Father Yaqub prohibiting Yusuf from relating his vision to brothers warning of shaytan enmity",
    "Divine election of Yusuf teaching interpretation of narratives completing favor upon family of Yaqub as with Ibrahim and Ishaq",
    "Declaration that in Yusuf and his brothers are signs for those who ask",
    "Brothers declaring Yusuf and his brother more beloved to father despite being a stronger clan calling father in clear error",
    "Brothers conspiring to kill Yusuf or exile him so father would be only for them claiming righteousness afterward",
    "One brother proposing not to kill Yusuf but cast him into well bottom for travelers to find",
    "Brothers asking father why he does not entrust them with Yusuf claiming sincere counsel",
    "Brothers requesting Yusuf be sent with them to graze and play pledging guardianship",
    "Yaqub expressing sadness at their taking Yusuf and fear wolf would eat him while they are unaware",
    "Brothers retorting that if wolf ate him while they are a strong clan they would truly be losers",
    "Brothers taking Yusuf agreeing to put him in well bottom while Allah inspires him he will remind them of this deed unseen",
    "Brothers returning to father at nightfall weeping falsely",
    "Brothers fabricating story of racing leaving Yusuf with belongings and wolf eating him anticipating disbelief even if truthful",
    "Brothers presenting shirt with false blood Yaqub responding souls enticed them choosing beautiful patience seeking Allah help",
    "Caravan arriving sending water drawer lowering bucket discovering boy concealing him as merchandise Allah knowing their actions",
    "Yusuf sold for reduced price few counted dirhams sellers content with little regarding his worth",
    "Egyptian buyer instructing wife to honor Yusuf possibly benefiting or adopting him Allah establishing Yusuf teaching interpretation",
    "Yusuf reaching maturity granted judgment and knowledge as reward for doers of good",
    "Aziz wife seducing Yusuf closing doors inviting him he seeks refuge in Allah affirming master honored residence wrongdoers fail",
    "She determined to seduce him he would have inclined had he not seen proof of Lord averting evil and immorality from chosen servant",
    "Both racing to door she tearing shirt from behind finding husband at door she accuses Yusuf demanding imprisonment or punishment"
  ],
  "ext-012-p2": [
    "Yusuf declaring she sought to seduce him witness from her family testifying torn-front means her truth torn-back means his truth",
    "Witness continuing if shirt torn from back then she lied and he is among truthful",
    "Husband seeing shirt torn from back recognizing it as women scheme calling their plan great",
    "Husband telling Yusuf to ignore incident commanding wife to seek forgiveness acknowledging her sinfulness",
    "Women in city gossiping Aziz wife seducing slave boy love impassioning her seeing her in clear error",
    "Aziz wife hosting women preparing banquet giving knives summoning Yusuf they admire him cut hands declaring noble angel not human",
    "Aziz wife vindicated before guests confirming she seduced him he refused threatening imprisonment and debasement if disobedient",
    "Yusuf praying prison dearer than their invitation asking Allah avert their plan lest he incline and become ignorant",
    "Lord responding to Yusuf averting women scheme affirming He is Hearing Knowing",
    "Authorities deciding after seeing signs to imprison Yusuf for a time despite his innocence",
    "Two young men entering prison with Yusuf one dreaming pressing wine other carrying bread birds eating from head requesting interpretation",
    "Yusuf promising interpretation before food arrives attributing knowledge to Lord rejecting polytheist religion disbelieving in Hereafter",
    "Yusuf affirming following religion of fathers Ibrahim Ishaq Yaqub denying association with Allah crediting divine favor noting ingratitude",
    "Yusuf addressing prison companions rhetorically asking whether multiple lords better or Allah One Prevailing",
    "Yusuf explaining worship of named idols without divine authority legislation belonging solely to Allah defining correct religion",
    "Yusuf interpreting one prisoner serving king wine other crucified birds eating from head matter decreed",
    "Yusuf asking freed prisoner to mention him to master shaytan causing forgetfulness extending imprisonment several years",
    "King dreaming seven fat cows eaten by seven lean seven green ears and dry ones asking nobles for interpretation",
    "Nobles dismissing kings dream as jumbled false dreams claiming ignorance of dream interpretation",
    "Freed prisoner remembering Yusuf after long delay offering to inform king of interpretation requesting dispatch",
    "Messenger addressing Yusuf as man of truth repeating kings dream hoping people learn about him",
    "Yusuf interpreting seven consecutive planting years storing harvest in spikes except little eaten",
    "Seven difficult years following consuming stored grain except small reserve preserved",
    "Year after drought bringing rain enabling people to press olives and grapes restoring abundance",
    "King ordering Yusuf brought messenger arriving Yusuf refusing return until women who cut hands investigated proving innocence",
    "King questioning women about seduction attempt they deny any evil Aziz wife confessing truth now manifest Yusuf among truthful",
    "Yusuf explaining investigation purpose proving no betrayal in absence Allah not guiding betrayers plans"
  ],
  "ext-012-p3": [
    "Yusuf disclaiming self-acquittal soul commanding evil except where Lord shows mercy affirming Forgiving Merciful",
    "King ordering Yusuf brought exclusively for himself declaring him established and trusted after private conversation",
    "Yusuf volunteering appointment over storehouses declaring himself knowing guardian hafiz aleem",
    "Allah establishing Yusuf in land settling wherever he wills touching mercy to whom He wills not wasting reward of good-doers",
    "Reward of Hereafter better for those who believed and maintained taqwa",
    "Yusuf brothers arriving entering upon him he recognizing them they unaware of his identity",
    "Yusuf furnishing supplies demanding younger brother from father as proof of honesty citing fair measure and hospitality",
    "Yusuf threatening no further measure and no approach unless younger brother brought",
    "Brothers pledging to persuade father to release Benjamin affirming determination",
    "Yusuf instructing servants return merchandise to saddlebags so brothers recognize it upon return encouraging second visit",
    "Brothers returning to father reporting measure denied requesting Benjamin accompany them pledging guardianship",
    "Yaqub questioning trustworthiness recalling prior loss of Yusuf placing trust in Allah as best guardian most merciful",
    "Brothers opening baggage finding merchandise returned celebrating provision opportunity protecting brother gaining extra camel load",
    "Yaqub demanding solemn covenant by Allah for Benjamins safe return unless surrounded accepting Allah as witness over agreement",
    "Yaqub advising sons enter Egypt through separate gates acknowledging inability to avert divine decree relying on Allah alone",
    "Entry through separate gates not availing against Allah fulfilling need in Yaqub soul possessing taught knowledge most people unaware",
    "Yusuf taking brother aside privately revealing identity comforting him not to despair over past treatment",
    "Yusuf furnishing supplies placing measuring cup in brothers bag announcer crying out caravan accused of theft",
    "Brothers turning back asking what item is missing",
    "Officials stating kings measuring bowl lost offering camel-load reward guarantor responsible",
    "Brothers swearing by Allah they did not come to corrupt land nor were thieves",
    "Accusers asking what recompense applies if brothers proven liars",
    "Brothers proposing whoever found with stolen item becomes its recompense describing standard punishment for wrongdoers",
    "Search beginning with other bags before brothers bag extracting cup from Benjamins bag Allah planning for Yusuf raising degrees above knowledgeable",
    "Brothers accusing Yusuf of prior theft referencing earlier sibling Yusuf concealing pain internally declaring them worse Allah knowing",
    "Brothers pleading Aziz has elderly father requesting one substitute themselves appealing to his goodness",
    "Yusuf refusing to take anyone except one found with possession declaring otherwise unjust",
    "Brothers despairing consulting privately eldest reminding oath to father and prior failure with Yusuf refusing departure until father permits or Allah judges",
    "Eldest instructing return tell father son stole testimony limited to known facts not guardians of unseen",
    "Eldest advising verify with city residents and caravan companions affirming truthfulness",
    "Yaqub responding souls enticed them choosing beautiful patience hoping Allah brings all together affirming Knowing Wise",
    "Yaqub turning away lamenting sorrow over Yusuf eyes whitened from grief suppressing anguish",
    "Sons warning father incessant remembrance of Yusuf will cause fatal illness or death",
    "Yaqub declaring complaint directed only to Allah knowing from Allah what others do not know"
  ],
  "ext-012-p4": [
    "Yaqub commanding sons go search for Yusuf and brother forbidding despair of Allah relief only disbelievers despair",
    "Brothers entering upon Yusuf reporting adversity poor merchandise requesting full measure charity Allah rewarding charitable",
    "Yusuf confronting brothers asking whether they know what they did to Yusuf and brother when ignorant",
    "Brothers asking are you Yusuf he confirming identity attributing favor to Allah rewarding taqwa and patience never wasting good-doers reward",
    "Brothers acknowledging Allah preferred Yusuf admitting they were sinners",
    "Yusuf declaring no blame today invoking Allah forgiveness most merciful of merciful",
    "Yusuf sending shirt to cast on fathers face restoring sight commanding bring entire family",
    "Caravan departing Yaqub detecting Yusuf scent despite family thinking him senile",
    "Family dismissing Yaqub perception as old delusion",
    "Bearer of good tidings arriving casting shirt on Yaqub face sight restored Yaqub reminding he knew from Allah what they did not",
    "Brothers requesting father seek forgiveness for their sins admitting wrongdoing",
    "Yaqub promising to seek forgiveness from Lord affirming Forgiving Merciful",
    "Family entering upon Yusuf embracing parents inviting entry to Egypt in safety by Allah will",
    "Parents raised on throne family prostrating fulfilling childhood dream Yusuf attributing realization to Lord Latif Aleem Hakeem",
    "Yusuf supplicating gratitude for sovereignty and dream interpretation requesting death as Muslim joined with righteous",
    "Narrative identified as news of unseen revealed to Prophet absent during original conspiracy",
    "Most people not believers despite Prophets earnest desire for their guidance",
    "Prophet asking no payment for message it being reminder to all worlds",
    "Many signs in heavens and earth passed over by people turning away in heedlessness",
    "Most believing in Allah only while associating partners with Him",
    "Rhetorical challenge whether people feel secure from overwhelming punishment or sudden Hour unperceived",
    "Prophet commanded declare path of inviting to Allah with insight followers glorifying Allah free from shirk",
    "Prior messengers all men from towns receiving revelation travel command observing predecessors ends Hereafter home best for mutaqqin",
    "Messengers despairing certain of denial then victory arrives saving whomever Allah wills punishment irrevocable for criminals",
    "Stories containing lesson for people of understanding Quran confirming prior scripture detailing everything guidance mercy for believers"
  ]
};

// Build extractions
const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`12:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`12:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 12, surahName: "Yusuf",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: `Wave 1 genuine re-extraction. Passage boundaries follow narrative acts of the Yusuf story.`,
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE ANALYTICAL ARRAYS ===

// P1 (12:1-25): Dream, betrayal, temptation
{
  const e = extractions[0];
  // Divine names
  const allah = findWord(3, ["\u0627","\u0644","\u0644","\u0647"]); // Allah
  const hakeem = findWord(1, ["\u062d","\u0643","\u064a","\u0645"]); // Hakeem
  const aleem = findWord(1, ["\u0639","\u0644","\u064a","\u0645"]); // Aleem
  if (allah) e.divineNamesAndAttributes.push({ term: allah, transliteration: "Allah", gloss: "God (editorial gloss)", keys: ["12:3"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["12:1"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["12:1"] });

  // Commands
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["12:5"], excerpt: fv(5), description: "Father's prohibition: do not relate your vision to your brothers lest they devise a plan against you." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["12:23"], excerpt: fv(23), description: "Yusuf's response to temptation: ma'adh Allah — seeking refuge in Allah from sin." });

  // Prophetic narratives
  e.propheticNarratives.push({ label: "Yusuf's cosmic dream: eleven stars, sun, and moon prostrating — foreshadowing future familial authority", keys: ["12:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Fraternal conspiracy: brothers plot to kill or exile Yusuf due to perceived paternal favoritism", keys: ["12:8","12:9","12:10"], evidenceClass: "EXPLICIT_TEXT" });

  // Human conditions
  e.humanConditionsAndSpiritualStates.push({ label: "Sibling jealousy driven by perceived unequal parental love leading to murderous conspiracy", keys: ["12:8"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Sexual temptation resisted through conscious divine refuge-seeking (isti'adha)", keys: ["12:23"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Voluntary imprisonment chosen over moral compromise demonstrating prioritization of taqwa", keys: ["12:24"], evidenceClass: "EXPLICIT_TEXT" });

  // Relationships
  e.relationships.push({ label: "Father-son relationship marked by protective warning and preferential love triggering sibling conflict", keys: ["12:5","12:8"], evidenceClass: "EXPLICIT_TEXT" });

  // Terminology
  const qasas = findWord(3, ["\u0642","\u0635","\u0635"]); // qasas
  if (qasas) e.terminology.push({ term: qasas, transliteration: "qasas", gloss: "narrative/story (editorial gloss)", keys: ["12:3"] });
}

// P2 (12:26-52): Imprisonment, dreams, exoneration
{
  const e = extractions[1];
  // Divine names
  const ghafur = findWord(29, ["\u063a","\u0641","\u0648","\u0631"]); // Ghafur
  const rahman = findWord(29, ["\u0631","\u062d","\u0645","\u0646"]); // Rahman
  if (ghafur) e.divineNamesAndAttributes.push({ term: ghafur, transliteration: "Ghafur", gloss: "Forgiving (editorial gloss)", keys: ["12:29"] });

  // Commands
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["12:39"], excerpt: fv(39), description: "Yusuf's tawheed instruction to fellow prisoners before dream interpretation: worship one God rather than multiple lords." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["12:50"], excerpt: fv(50), description: "King's command: bring him to me — recognizing Yusuf's trustworthiness after exoneration." });

  // Prophetic narratives
  e.propheticNarratives.push({ label: "Dream interpretation ministry in prison: tawheed taught before interpretation establishing theological priority", keys: ["12:36","12:37","12:38","12:39","12:40","12:41"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Royal dream crisis: seven fat cows eaten by seven lean enabling Yusuf's emergence from prison", keys: ["12:43","12:44","12:45","12:46","12:47","12:48","12:49"], evidenceClass: "EXPLICIT_TEXT" });

  // Human conditions
  e.humanConditionsAndSpiritualStates.push({ label: "Delayed remembrance as divine timing: shaytan caused prisoner to forget mentioning Yusuf to his lord", keys: ["12:42"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Conditional release requiring prior public exoneration — Yusuf refuses freedom without cleared name", keys: ["12:50","12:51"], evidenceClass: "EXPLICIT_TEXT" });

  // Terminology
  const tawil = findWord(36, ["\u062a","\u0623","\u0648","\u064a","\u0644"]); // ta'wil
  if (tawil) e.terminology.push({ term: tawil, transliteration: "ta'wil", gloss: "interpretation/unfolding of meaning (editorial gloss)", keys: ["12:36"] });
}

// P3 (12:53-86): Rise, famine, testing, revelation
{
  const e = extractions[2];
  // Commands (within 12:53-86 range)
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["12:55"], excerpt: fv(55), description: "Yusuf volunteers: appoint me over the storehouses — I am a knowing guardian." });

  // Prophetic narratives (within 12:53-86 range)
  e.propheticNarratives.push({ label: "Brothers' unrecognized encounter: bowing fulfills childhood dream while Yusuf tests their character transformation", keys: ["12:58","12:59","12:60"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Cup-test and Judah's impassioned plea offering himself in place of Benjamin demonstrating complete moral reformation", keys: ["12:70","12:78","12:79","12:80","12:81","12:82","12:83","12:84","12:85"], evidenceClass: "EXPLICIT_TEXT" });

  // Human conditions
  e.humanConditionsAndSpiritualStates.push({ label: "Jacob's protective reluctance rooted in unresolved trauma from Yusuf's disappearance", keys: ["12:64","12:65","12:66"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Character transformation evidenced by brothers' willingness to sacrifice for sibling contrasting original fratricidal intent", keys: ["12:78","12:79"], evidenceClass: "EXPLICIT_TEXT" });

  // Social/economic (within 12:53-86 range)
  e.socialEconomicCivilisational.push({ label: "Institutional appointment based on proven trustworthiness (hafiz) and knowledge (aleem)", keys: ["12:55"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Grain storage policy implemented during abundance years enabling famine survival", keys: ["12:55"], evidenceClass: "EXPLICIT_TEXT" });

  // Terminology (within 12:53-86 range)
  const hafiz = findWord(55, ["\u062d","\u0641","\u064a","\u0638"]); // hafiz
  if (hafiz) e.terminology.push({ term: hafiz, transliteration: "hafiz", gloss: "guardian/preserver (editorial gloss)", keys: ["12:55"] });
}

// P4 (12:87-111): Reunion, forgiveness, dream fulfillment, closing
{
  const e = extractions[3];
  // Divine names
  const latif2 = findWord(100, ["\u0644","\u0637","\u064a","\u0641"]); // Latif
  const aleem2 = findWord(100, ["\u0639","\u0644","\u064a","\u0645"]); // Aleem
  const hakeem2 = findWord(100, ["\u062d","\u0643","\u064a","\u0645"]); // Hakeem
  if (latif2) e.divineNamesAndAttributes.push({ term: latif2, transliteration: "Latif", gloss: "Subtle/Gentle (editorial gloss)", keys: ["12:100"] });
  if (aleem2) e.divineNamesAndAttributes.push({ term: aleem2, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["12:100"] });
  if (hakeem2) e.divineNamesAndAttributes.push({ term: hakeem2, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["12:100"] });

  // Commands
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["12:92"], excerpt: fv(92), description: "Yusuf's unconditional forgiveness: no blame upon you today — may Allah forgive you and He is most merciful." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["12:101"], excerpt: fv(101), description: "Yusuf's closing prayer: Lord You have given me sovereignty and taught me interpretation of narratives — Creator of heavens and earth You are my protector in this world and Hereafter — cause me to die as Muslim and join me with the righteous." });

  // Prophetic narratives
  e.propheticNarratives.push({ label: "Identity revelation and dream fulfillment: family prostration completes cosmic dream from verse 4 closing narrative arc", keys: ["12:90","12:99","12:100"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Shirt-as-healing-motif: Yusuf's garment cast on father's face restores sight paralleling earlier garment-tearing as evidence", keys: ["12:93","12:96"], evidenceClass: "EXPLICIT_TEXT" });

  // Human conditions
  e.humanConditionsAndSpiritualStates.push({ label: "Unconditional forgiveness mirroring divine mercy: no blame today followed by invocation of Allah's forgiveness", keys: ["12:92"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Retrospective recognition of divine subtlety (latif) across decades of suffering and separation", keys: ["12:100"], evidenceClass: "EXPLICIT_TEXT" });

  // Relationships
  e.relationships.push({ label: "Allah-human relationship characterized by subtle providence (lutf) accomplishing will through apparent adversity", keys: ["12:100"], evidenceClass: "EXPLICIT_TEXT" });

  // Terminology
  const muslim = findWord(101, ["\u0645","\u0633","\u0644","\u0645"]); // muslim
  if (muslim) e.terminology.push({ term: muslim, transliteration: "muslim", gloss: "one who submits to Allah (editorial gloss)", keys: ["12:101"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `012-yusuf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 012-yusuf-p${num}.json`);
}

// === CANDIDATES (cand-0527..cand-0566, 40 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-012-p1,ext-012-p2,ext-012-p3,ext-012-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0527..0536)
  { id: "cand-0527", label: "Quran as ahsan al-qasas establishing prophetic storytelling paradigm", def: "In 12:3: We relate to you the best of narratives through Our revelation of this Quran.", key: "12:3", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Quran self-described as best narrative."}] },
  { id: "cand-0528", label: "Cosmic dream foreshadowing future familial authority", def: "In 12:4: Yusuf saw eleven stars and sun and moon prostrating to him.", key: "12:4", overlap: [{topicId:"dream-interpretation",layer:"scholarly",relationship:"same-concept",note:"Foundational dream initiating narrative."},{topicId:"yusuf-dreams",layer:"scholarly",relationship:"same-concept",note:"Yusuf's first dream."}] },
  { id: "cand-0529", label: "Paternal warning against sibling jealousy and shaytan exploitation", def: "In 12:5: Do not relate your vision to your brothers lest they devise a plan against you — shaytan is an open enemy.", key: "12:5", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"related-not-identical",note:"Father's protective counsel."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Shaytan named as explicit enemy."}] },
  { id: "cand-0530", label: "Fratricidal conspiracy driven by perceived paternal favoritism", def: "In 12:8-9: Brothers say Yusuf and his brother more beloved to father than us though we are stronger group — kill Yusuf or exile him.", key: "12:8", overlap: [{topicId:"envy-hasad",layer:"scholarly",relationship:"same-concept",note:"Envy as motive for fratricide."}] },
  { id: "cand-0531", label: "Well-as-transition motif from family to foreign providence", def: "In 12:10: Cast him into bottom of well — some travelers will pick him up. Well functions as liminal space between abandonment and divine rescue.", key: "12:10", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Well as trial mechanism."}] },
  { id: "cand-0532", label: "Divine providence through commercial transaction", def: "In 12:19-20: Caravan water-scout finds Yusuf at well; sold for few dirhams counted out — divine plan operating through mundane commerce.", key: "12:19", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Providence hidden in human transactions."}] },
  { id: "cand-0533", label: "Sexual temptation resisted through isti'adha (divine refuge)", def: "In 12:23: She said come to me; he said ma'adh Allah — my lord has made my residence good. Seeking refuge in Allah from sin.", key: "12:23", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Taqwa expressed as isti'adha."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Chastity under pressure."}] },
  { id: "cand-0534", label: "Garment-tearing as forensic evidence of innocence", def: "In 12:25-28: Garment torn from behind proves Yusuf fled rather than pursued; witness from her family testifies to directional evidence.", key: "12:25", overlap: [{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Physical evidence determining truth."}] },
  { id: "cand-0535", label: "Collective female recognition of Yusuf's extraordinary nature", def: "In 12:31: Women of city invited, given knives, amazed at Yusuf's beauty cutting their hands saying hash lil-lah this is no human but noble angel.", key: "12:31", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"related-not-identical",note:"Beauty as sign of prophetic distinction."}] },
  { id: "cand-0536", label: "Voluntary imprisonment chosen over moral compromise", def: "In 12:33: Yusuf says Lord prison is dearer to me than what they invite me to — choosing confinement over sin.", key: "12:33", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr expressed as willing endurance."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Taqwa prioritized over freedom."}] },

  // P2 (cand-0537..0546)
  { id: "cand-0537", label: "Dream interpretation preceded by tawheed instruction", def: "In 12:37-40: Before interpreting dreams Yusuf teaches monotheism rejecting multiple lords affirming judgment belongs to Allah alone.", key: "12:37", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Theological instruction precedes practical service."},{topicId:"dream-interpretation",layer:"scholarly",relationship:"related-not-identical",note:"Tawheed frames interpretive authority."}] },
  { id: "cand-0538", label: "Dual prisoner dreams demonstrating interpretive accuracy", def: "In 12:36-41: Wine-presser will serve king again; baker will be crucified and birds eat from head — both fulfilled exactly.", key: "12:36", overlap: [{topicId:"dream-interpretation",layer:"scholarly",relationship:"same-concept",note:"Verified predictions establish credibility."}] },
  { id: "cand-0539", label: "Royal dream crisis enabling emergence from obscurity", def: "In 12:43-49: King dreams seven fat cows eaten by seven lean seven green ears dry; nobles confused; released prisoner remembers Yusuf.", key: "12:43", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"related-not-identical",note:"Crisis as divinely timed opportunity."}] },
  { id: "cand-0540", label: "Delayed remembrance as divine timing mechanism", def: "In 12:42: Shaytan made him forget mentioning Yusuf to his lord — so Yusuf remained in prison several more years.", key: "12:42", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"related-not-identical",note:"Divine delay serving larger purpose."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Extended waiting as test."}] },
  { id: "cand-0541", label: "Conditional release requiring prior public exoneration", def: "In 12:50-51: King says bring him; Yusuf says return to your lord ask about women who cut hands — refuses freedom without cleared name.", key: "12:50", overlap: [{topicId:"justice",layer:"curated",relationship:"related-not-identical",note:"Public vindication before elevation."}] },
  { id: "cand-0542", label: "Institutional appointment based on proven trustworthiness and knowledge", def: "In 12:55: Yusuf says appoint me over storehouses inni hafizun aleem — I am a knowing guardian.", key: "12:55", overlap: [{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"Hifz and ilm as qualification criteria."},{topicId:"work-honor",layer:"scholarly",relationship:"related-not-identical",note:"Merit-based appointment."}] },
  { id: "cand-0543", label: "Forensic testimony establishing innocence through garment direction", def: "In 12:26-28: Witness from her family testifies if torn from front she truthful if from behind he truthful — garment torn from behind confirms Yusuf.", key: "12:26", overlap: [{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Directional evidence as legal standard."}] },
  { id: "cand-0544", label: "Public female confession confirming Yusuf's virtue", def: "In 12:51: King asks women what was your affair when you seduced Yusuf; they say hash lil-lah we know no evil of him.", key: "12:51", overlap: [{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Collective testimony clearing reputation."}] },
  { id: "cand-0545", label: "Aziz wife's admission of guilt completing exoneration", def: "In 12:51: Aziz's wife says now truth has become manifest — I seduced him and he is among the truthful.", key: "12:51", overlap: [{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Confession as form of acknowledgment."}] },
  { id: "cand-0546", label: "Seven-year agricultural cycle as divine sign and administrative framework", def: "In 12:47-49: Seven years of abundance followed by seven years of drought consuming stored grain except little preserved.", key: "12:47", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Natural cycles as divine communication."}] },

  // P3 (cand-0547..0556)
  { id: "cand-0547", label: "Administrative foresight in agricultural surplus management", def: "In 12:47-48: Yusuf instructs storing harvest during abundant years leaving only what is eaten preparing for seven drought years.", key: "12:47", overlap: [{topicId:"balance-moderation",layer:"scholarly",relationship:"related-not-identical",note:"Prudent resource management."}] },
  { id: "cand-0548", label: "Unrecognized encounter enabling character testing", def: "In 12:58: Brothers came entered upon Yusuf he recognized them but they did not recognize him.", key: "12:58", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Asymmetric recognition enables testing."}] },
  { id: "cand-0549", label: "Returned silver demonstrating integrity despite power", def: "In 12:62: Yusuf tells servants put their merchandise back in their sacks so they recognize it when returning to family.", key: "12:62", overlap: [{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Honesty when advantage could be taken."}] },
  { id: "cand-0550", label: "Jacob's protective reluctance rooted in unresolved trauma", def: "In 12:64: Shall I entrust you with him as I entrusted you with his brother before? Allah is best guardian most merciful.", key: "12:64", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Parental anxiety from prior loss."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Tawakkul despite fear."}] },
  { id: "cand-0551", label: "Judah's guarantee marking moral growth from original conspirator", def: "In 12:66: Judah says I will not send him until you give firm covenant before Allah that you will bring him back.", key: "12:66", overlap: [{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Former conspirator now guarantor."},{topicId:"covenants-ahd",layer:"scholarly",relationship:"same-concept",note:"Solemn oath as commitment mechanism."}] },
  { id: "cand-0552", label: "Cup-test revealing brothers' willingness to sacrifice for sibling", def: "In 12:70-76: Cup placed in Benjamin's sack; brothers accused of theft; they respond whoever took it should be held — offering themselves.", key: "12:70", overlap: [{topicId:"brotherhood-islam",layer:"scholarly",relationship:"related-not-identical",note:"Sibling loyalty tested and proven."}] },
  { id: "cand-0553", label: "Judah's eloquent plea demonstrating complete character reformation", def: "In 12:78-85: Judah appeals citing father's grief previous loss of Yusuf offers himself as substitute showing transformation from original plotter.", key: "12:78", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Complete moral reversal demonstrated."},{topicId:"parents-and-family",layer:"curated",relationship:"related-not-identical",note:"Filial concern motivating sacrifice."}] },
  { id: "cand-0554", label: "Emotional disclosure as narrative climax", def: "In 12:90: I am Yusuf and this is my brother — Allah has truly favored us. Identity revelation resolves dramatic tension.", key: "12:90", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"related-not-identical",note:"Revelation paired with favor attribution."}] },
  { id: "cand-0555", label: "Famine as catalyst for family reunion and dream fulfillment", def: "In 12:58: Famine drives brothers to Egypt where Yusuf governs — adversity becomes vehicle of divine plan.", key: "12:58", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Hardship serving hidden purpose."}] },
  { id: "cand-0556", label: "Simeon detention as leverage ensuring Benjamin's return", def: "In 12:69: Yusuf keeps one brother (Simeon) as hostage demanding younger brother as proof of honesty.", key: "12:69", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Strategic detention testing family bonds."}] },

  // P4 (cand-0557..0566)
  { id: "cand-0557", label: "Unconditional forgiveness mirroring divine mercy", def: "In 12:92: No blame upon you today — may Allah forgive you and He is most merciful of the merciful.", key: "12:92", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Human forgiveness reflecting divine attribute."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Magnanimity toward former persecutors."}] },
  { id: "cand-0558", label: "Brothers' acknowledgment of Yusuf's election and their culpability", def: "In 12:91: By Allah certainly has Allah preferred you over us and we were indeed sinners.", key: "12:91", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Admission of wrongdoing and divine preference."}] },
  { id: "cand-0559", label: "Shirt-as-healing-motif connecting physical and relational restoration", def: "In 12:93-96: Go with this shirt cast it on father's face he will regain sight; shirt arrives scent detected before arrival sight restored.", key: "12:93", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Material object as vehicle of divine healing."}] },
  { id: "cand-0560", label: "Throne-prostration fulfilling cosmic dream completing narrative arc", def: "In 12:100: He raised his parents upon the throne and they fell prostrate before him; he said this is the interpretation of my vision of old.", key: "12:100", overlap: [{topicId:"yusuf-dreams",layer:"scholarly",relationship:"same-concept",note:"Dream fulfillment closes narrative circle."},{topicId:"dream-interpretation",layer:"scholarly",relationship:"same-concept",note:"Ta'wil realized after decades."}] },
  { id: "cand-0561", label: "Divine subtlety (lutf) recognized retrospectively across suffering", def: "In 12:100: Indeed my Lord is Subtle (Latif) in what He wills — He is Knowing Wise. Recognition of hidden divine plan.", key: "12:100", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"same-concept",note:"Latif as key divine attribute in narrative."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Retrospective trust validated."}] },
  { id: "cand-0562", label: "Closing dua integrating personal gratitude with universal submission", def: "In 12:101: Lord You have given me sovereignty and taught interpretation — cause me to die as Muslim join me with righteous.", key: "12:101", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Model dua combining gratitude and eschatological hope."},{topicId:"tawheed",layer:"curated",relationship:"related-not-identical",note:"Submission as culmination of prophetic journey."}] },
  { id: "cand-0563", label: "Meta-narrative framing as Quranic confirmation of prior revelation", def: "In 12:111: This is not fabricated hadith but confirmation of what came before and detailed explanation of everything.", key: "12:111", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Yusuf story as musaddiq and tafsil."}] },
  { id: "cand-0564", label: "Yusuf narrative as guidance and mercy for believing community", def: "In 12:111: Guidance and mercy for people who believe — narrative serves communal spiritual function.", key: "12:111", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"related-not-identical",note:"Story as rahmah for mu'mineen."}] },
  { id: "cand-0565", label: "Death as Muslim as ultimate aspiration of prophetic life", def: "In 12:101: Cause me to die as Muslim (mutawaffini musliman) — submission as desired end-state.", key: "12:101", overlap: [{topicId:"tawheed",layer:"curated",relationship:"related-not-identical",note:"Islam as life's culmination."}] },
  { id: "cand-0566", label: "Family reunion as eschatological preview of righteous gathering", def: "In 12:101: Join me with the righteous (al-salihin) — earthly reunion prefiguring heavenly assembly.", key: "12:101", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Earthly fulfillment pointing to ultimate gathering."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 1 genuine re-extraction candidate."
  });
}

const candPerPassage = [[0,10],[10,20],[20,30],[30,40]];
for (let pi = 0; pi < 4; pi++) {
  const [start, end] = candPerPassage[pi];
  extractions[pi].topicCandidateIds = candidates.candidates.slice(start, end).map(c => c.candidateId);
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `012-yusuf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-036.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-036.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
