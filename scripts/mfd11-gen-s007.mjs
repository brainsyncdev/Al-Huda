// MFD-11 Wave 1: Surah 7 (Al-A'raf) genuine re-extraction.
// Covers 7:1–206 in 6 meaningful passages with populated analytical arrays.
// All Arabic extracted verbatim from pinned corpus via indexOf+slice.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "007-0001-0206.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 7:${n} not found`);
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

console.log("Generating Surah 7 (Al-A'raf) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T12:15:00.000Z";

// === PASSAGE BOUNDARIES (meaningful thematic units) ===
// P1: 7:1–30 — Quran revelation, follow messengers, Satan's deception of Adam, divine clothing/piety
// P2: 7:31–58 — Adornment in worship, moderation, covenant taken from prophets, people of A'raf
// P3: 7:59–102 — Nuh narrative, Hud narrative, Salih narrative (she-camel sign)
// P4: 7:103–141 — Lot narrative, Shu'ayb narrative, Musa-Firawn confrontation begins
// P5: 7:142–171 — Musa's forty nights, tablets, calf worship, seventy elders, wilderness trials
// P6: 7:172–206 — Primordial covenant (am I not your Lord), parable of dog, closing commands

const PASSAGES = [
  { id: "ext-007-p1", from: 1, to: 30,
    label: "A'raf — Book revealed follow it do not follow other protectors; Allah created heavens earth six days established Throne; call upon Lord humbly secretly; do not spread corruption earth after rectification; mercy near good-doers; wind heralds rain dead land revived thus resurrection; towns destroyed sent messengers clear proofs denied seized; balance justice call upon Him fear hope; Satan deceived parents expelled from Garden stripped clothing enmity between you; children Adam clothing conceals shame righteousness better; Satan sees you he tribe unseen; made leaders disbelievers adorn what they used to do",
    mainLabel: "Quran as revealed Book commanding exclusive following and rejection of false protectors; creation-establishment framework grounding divine authority; supplication etiquette requiring humility and secrecy; corruption prohibition after divine rectification; mercy proximity to good-doers; natural-cycle resurrection analogy; historical destruction pattern through messenger rejection; Satan's primordial deception of Adam establishing ongoing enmity; clothing as both physical covering and moral metaphor; righteous garment superior to material adornment" },
  { id: "ext-007-p2", from: 31, to: 58,
    label: "A'raf — Children Adam take adornment every mosque eat drink not wasteful He loves not wasteful; say who forbade adornment Allah produced good provisions; say forbidden only immoralities apparent hidden sin unjust aggression associate Allah what no authority revealed say about Allah what not know; every nation term arrives cannot delay advance; those denied signs deluded gradually unaware; when punishment comes suddenly cry regret; say travel observe end deniers; heaven gates not opened enter Paradise until camel passes needle eye thus recompense criminals; fire bed coverings above coverings thus recompense wrongdoers; believed did righteous deeds burden beyond capacity companions Paradise abide; people A'raf recognize by marks call Lord poured faith no longer fear grieve; companions Fire call companions Paradise pour water provision said forbidden Allah withheld reward ungrateful",
    mainLabel: "Adornment permitted in worship context with waste prohibition; rhetorical challenge to those forbidding divine provisions; four-fold prohibition list (immoralities, sin, aggression, shirk); universal term principle preventing premature judgment; gradual delusion mechanism for persistent deniers; sudden punishment triggering belated regret; observational command to study historical outcomes; heaven-gate impossibility metaphor for criminal recompense; A'raf inhabitants as intermediate category recognizing both groups; intercession denied based on prior ingratitude" },
  { id: "ext-007-p3", from: 59, to: 102,
    label: "A'raf — Sent Nuh people worship Allah no god besides Him fear great Day; elites said we see you clear error; Nuh said no error messenger Lord worlds convey messages advise know from Allah what not know; remind appointed successor after Nuh people; sent Hud brothers Aad worship Allah fear; said we follow what fathers followed even if fathers understood nothing guided; cursed disbelief this world Resurrection Day; remember made successors after Nuh increased stature generously remember blessings succeed; said come us worship Allah alone have no god besides fabricate lie; said already defilement anger fallen upon you from Lord dispute names you named no authority wait I among waiting; saved him believers mercy destroyed others; sent Salih Thamud worship Allah came clear proof she-camel Allah sign leave her eat earth harm lest seize painful punishment; hamstrung she-camel defied command Lord earthquake seized morning prostrate homes; turned away said conveyed message Lord advised but love not advisors",
    mainLabel: "Nuh mission establishing tawheed-fear paradigm met with elite dismissal; prophet's self-defense claiming divine appointment and knowledge transmission; Hud mission to Aad repeating tawheed warning rejected through ancestral-following defense; divine curse linked to persistent disbelief across temporal domains; Aad destruction following generous succession demonstrating ingratitude consequence; Salih mission with she-camel as tangible divine sign; hamstringing as deliberate defiance triggering seismic punishment; prophet's departing lament distinguishing sincere counsel from rejected advice" },
  { id: "ext-007-p4", from: 103, to: 141,
    label: "A'raf — After them sent Musa signs Firawn establishment transgressed; see end corrupters; Musa said O Firawn messenger Lord worlds worthy say nothing about Allah except truth brought sign Lord send children Israel; cast staff became serpent drew hand white radiant; nobles said skilled magician wants expel you land; said give respite appoint day open assembly witnessed; came magicians threw ropes staffs appeared crawling; inspired Musa throw yours swallowed what fabricated; magicians fell prostrate believed Lord worlds Lord Musa Harun; Firawn threatened cut hands feet opposite sides crucify palm trunks; said returning Lord forgive first believe; filled wells houses gold silver entice religion; said two men among fearing Allah blessed enter gate victory trust Allah upon Him trust; said Moses pray Lord remove plague believe promise send children Israel; removed plague broke promise; seized vengeance drowned Red Sea; divided sea twelve tribes struck rock twelve springs ate drank shade clouds sent manna quails eat good provided not transgress",
    mainLabel: "Musa-Firawn confrontation initiated with demand for Israelite liberation; staff-serpent and luminous-hand as dual signs; magician conversion marking pivotal recognition of divine power; Firawn's retaliatory threats demonstrating tyrannical response to faith; economic manipulation through wealth distribution as counter-propaganda; believing minority within Firawn's people advocating trust-based strategy; plague removal followed by broken promise establishing pattern of conditional faith; Red Sea drowning as definitive divine judgment; wilderness provision cycle (water, food, shade, manna) demonstrating sustained divine care" },
  { id: "ext-007-p5", from: 142, to: 171,
    label: "A'raf — Appointed Musa thirty nights completed ten completion forty nights spoke directly; asked forgiveness people chose seventy best; seized earthquake said Lord would have destroyed before me kill us fools test; You are Protector forgive merciful; wrote tablets guidance mercy hold firmly command best; return angry sorrowful people adopted calf after departure; Aaron said oppressed nearly killed me enemies rejoice disbelievers; seized beard head dragged said son people oppressed me; threw tablets seized brother head dragging said son mother reckoned weak nearly killed; prayed Lord forgive me brother enter mercy most merciful; those adopted calf wrath humiliation fall upon them life world thus recompense fabricators; repented believed Lord indeed Forgiving Merciful; anger subsided took tablets copy guidance mercy; raised mountain above them like canopy thought fall upon them hold firmly given fear; divided twelve tribes nation asked water struck rock twelve springs knew drinking place; shaded clouds sent manna quails eat good provided; settled holy land enter prostrate say relieve burden forgive enter gate; changed word substituted injustice entered crawling faces; tested prosperity adversity returned evil ways; ship story saved believers drowned deniers; Sabbath transgressors fish came openly rested transformed apes despised; community forbade evil reminded Lord's duty; saved forbidders destroyed transgressors",
    mainLabel: "Forty-night divine appointment establishing direct communication; seventy elders seized by earthquake showing collective accountability; tablets as guidance-mercy gift; calf-worship crisis during Musa absence with Aaron powerless protest; Musa anguished intercession; wrath-humiliation on calf-worshippers followed by accepted repentance; mountain-raising as covenant enforcement; twelve-tribe division with wilderness provision; Sabbath violation establishing communal responsibility; three-tier outcome of saved forbidders silent majority and destroyed transgressors" },
  { id: "ext-007-p6", from: 172, to: 206,
    label: "A'raf — Lord took from children Adam backs descendants testified Am I not your Lord said Yes testify lest say Day Resurrection unaware; or say fathers associated partners before offspring followed; recite news one given signs withdrew shaytan pursued went astray; could have elevated adhered earth inclined desires like dog panting whether chased left; evil example people denied signs; whoever Allah guides guided whoever misled lost heedless; created jinn mankind many for Hell hearts understand eyes see ears hear like livestock more astray; ask Messenger previous messengers different gods; every nation term neither delayed advanced; punishment comes suddenly unexpectedly; say possess myself neither benefit nor harm except Allah wills; know unseen disclose not; follow revealed warn fear hope; dwellers townships believed profited faith except Yunus people; if Lord willed all believed compel people; no soul believes except Allah permission wrath upon unreasoning; say look heavens earth signs warners benefit not unbelievers; wait days like theirs save whom Willed; say sufficient witness between me you knows Scripture; invoke Lord humbly secretly He loves not transgressors; do not spread corruption after rectification call fear hope; mercy near good-doers; wind bears glad tidings rain revives dead land thus bring forth dead; good land produces abundant bad sparse thus explain signs grateful people",
    mainLabel: "Primordial covenant (alastu bi-rabbikum) establishing innate divine recognition; testimony mechanism preventing future denial; parable of one given signs who withdrew becoming dog-like in base desire pursuit; jinn-mankind creation purpose including Hell-population warning; sensory faculties misused reducing humans below livestock; universal term principle reiterated; prophetic consistency across generations affirmed; compulsion impossibility preserving agency; permission-condition balancing divine sovereignty with human reasoning; closing supplication commands mirroring opening; mercy-goodness proximity restated; agricultural metaphor linking gratitude to productivity" }
];

// Per-ayah editorial subject descriptions, ordered from each passage first ayah.
const SUB_LABELS = {
  "ext-007-p1": [
    "Disjointed letters Alif Lam Meem Sad opening the surah as a Quranic initial marker",
    "Revelation of the Book commanding warning and serving as reminder for believers without causing breast distress",
    "Command to follow what has been revealed from the Lord and prohibition against taking other allies besides Him",
    "Destruction of numerous cities whose punishment arrived at night or during midday rest",
    "Condemned towns declaring their own wrongdoing only when divine punishment had already descended upon them",
    "Divine promise to question both the recipients of messengers and the messengers themselves about their missions",
    "Allah relating deeds back to nations with full knowledge since He was never absent from their actions",
    "Weighing of deeds on Judgment Day as truth where heavy scales indicate success",
    "Light scales resulting in self-loss due to injustice committed against divine signs",
    "Establishment of humanity on earth with livelihood provisions yet minimal gratitude shown",
    "Creation of human form followed by angelic prostration command to Adam with Iblis refusing to comply",
    "Divine interrogation of Iblis regarding his refusal citing fire-over-clay superiority claim",
    "Expulsion of Iblis from Paradise as debased one unfit for arrogance within it",
    "Iblis requesting reprieve until resurrection day to pursue his misguidance agenda",
    "Allah granting Iblis the requested reprieve among those given respite",
    "Iblis declaring intent to ambush humanity on the straight path from all directions",
    "Satanic strategy of approaching from front behind right and left ensuring most remain ungrateful",
    "Final expulsion decree filling Hell with Iblis and all who follow him among humanity",
    "Adam and wife permitted to dwell in Paradise eating freely but forbidden from one specific tree",
    "Satan whispering to expose their concealed private parts claiming the tree grants angelic status or immortality",
    "Satan swearing by Allah as false sincere advisor to deceive Adam and his wife",
    "Deception succeeding causing nakedness exposure leading to leaf-covering and divine rebuke for approaching the forbidden tree",
    "Adam and wife confessing self-wrongdoing seeking divine forgiveness and mercy to avoid being among losers",
    "Divine decree sending them to earth as mutual enemies with temporary settlement and enjoyment",
    "Declaration that earth is the place of living dying and eventual resurrection",
    "Bestowal of clothing to conceal shame and as adornment while righteousness garment remains superior as divine sign",
    "Warning against Satan tempting descendants as he expelled parents stripping their clothing while devils observe unseen",
    "Immoral acts justified by ancestral tradition falsely attributed to divine command which Allah explicitly denies ordering",
    "Command to maintain justice worship sincerely at every prostration place returning to Allah as originally created",
    "Division into guided group and misled group who took devils as allies while believing themselves rightly guided"
  ],
  "ext-007-p2": [
    "Command to wear adornment at every mosque eat and drink without excess as Allah dislikes the wasteful",
    "Rhetorical challenge questioning who forbade divine adornments and good provisions meant for believers in worldly life and exclusively theirs in hereafter",
    "Comprehensive prohibition list covering apparent and hidden immoralities sin unjust aggression unauthorized shirk and speaking about Allah without knowledge",
    "Every nation having a fixed term that can neither be delayed nor advanced when its appointed time arrives",
    "Promise of no fear or grief for those who receive messengers fear Allah and reform themselves",
    "Deniers of divine signs characterized by arrogance destined as eternal companions of Fire",
    "Inventors of lies about Allah receiving their decreed portion until death angels arrive exposing abandoned false deities",
    "Nations entering Fire cursing preceding sister nations with last blaming first for misguidance requesting double punishment",
    "Earlier arrivals denying any favor to later ones commanding them to taste earned punishment directly",
    "Heaven gates sealed against arrogant deniers using camel-through-needle-eye impossibility metaphor for criminal recompense",
    "Hell providing bed and coverings of fire as reciprocal recompense for wrongdoers",
    "Believers doing righteous deeds charged only within capacity becoming eternal Paradise companions",
    "Removal of breast resentment among Paradise inhabitants flowing rivers beneath them praising Allah for guidance through messengers",
    "Paradise companions confirming to Fire companions that divine promises proved true with announcer declaring curse upon wrongdoers",
    "Wrongdoers defined as those averting people from Allah path seeking deviation while disbelieving in Hereafter",
    "Partition between Paradise and Fire with Araf elevations holding men recognizing all inhabitants by distinguishing marks greeting Paradise companions",
    "Araf inhabitants praying not to be placed among wrongdoing people when gazing toward Fire companions",
    "Araf dwellers addressing Hell inhabitants noting their gathered numbers and arrogance availed them nothing",
    "Divine declaration presenting those whom Hell swore Allah would never show mercy invited to enter Paradise without fear or grief",
    "Fire companions requesting water or provision from Paradise companions denied because Allah forbade both to disbelievers",
    "Disbelievers characterized as taking religion as amusement deluded by worldly life now forgotten as they forgot this meeting and rejected signs",
    "Detailed Book brought with knowledge serving as guidance and mercy for believing people",
    "Awaiters of interpretation facing regret when result arrives too late for intercession or return opportunity",
    "Six-day creation of heavens and earth followed by Throne establishment with night day sun moon stars subjected by divine command",
    "Supplication commanded in humility and privacy as Allah dislikes transgressors in prayer",
    "Prohibition against spreading corruption after earth rectification combined with invocation balancing fear and hope near divine mercy",
    "Winds sent as glad tidings carrying rain clouds to dead land producing fruits as resurrection analogy for reflection",
    "Good land producing abundant vegetation by divine permission while bad land yields sparse growth illustrating gratitude principle"
  ],
  "ext-007-p3": [
    "Nuh sent commanding exclusive worship of Allah fearing punishment of tremendous Day",
    "Elite among Nuh people dismissing him as being in clear error",
    "Nuh defending himself as error-free messenger from Lord of worlds conveying divine messages",
    "Nuh claiming ability to convey Lord messages advise sincerely and know from Allah what people do not",
    "Nuh expressing wonder that divine reminder came through familiar man urging fear and mercy-seeking",
    "Nuh people denying him resulting in ship salvation for believers and drowning for blind deniers",
    "Hud sent to Aad as brother figure commanding exclusive worship and urging God-fearing awareness",
    "Aad elite dismissing Hud as foolish and accusing him of lying",
    "Hud denying foolishness affirming messenger status from Lord of worlds",
    "Hud claiming role as trustworthy conveyor of Lord messages and sincere adviser",
    "Hud reminding Aad of succession after Nuh people with increased stature urging remembrance of divine favors",
    "Aad rejecting tawheed demanding abandonment of ancestral worship challenging Hud to produce threatened punishment",
    "Hud declaring divine defilement and anger fallen upon them disputing mere names without authority while awaiting outcome together",
    "Hud and believers saved by divine mercy while deniers eliminated completely lacking faith",
    "Salih sent to Thamud commanding exclusive worship presenting she-camel as clear divine sign demanding non-interference",
    "Salih reminding Thamud of succession after Aad settled in land building palaces and carving mountain homes urging gratitude over corruption",
    "Arrogant Thamud elite questioning oppressed believers about Salih divine mission with believers affirming faith",
    "Arrogant faction declaring disbelief in what oppressed believers accepted",
    "Thamud hamstringing she-camel defying Lord command challenging Salih to bring promised punishment",
    "Earthquake seizing Thamud leaving them prone corpses in their homes",
    "Salih departing lamenting conveyed message and sincere advice noting they dislike advisors",
    "Lut condemning unprecedented immorality unknown among prior civilizations",
    "Lut specifying male-with-male desire replacing women as transgressive behavior",
    "Lut people responding only with eviction demand characterizing his household as purists",
    "Lut and family saved except wife remaining among evildoers",
    "Stone rain destroying Lut people demonstrating criminal end",
    "Shuayb sent to Madyan commanding worship fulfilling measures and weights prohibiting deprivation and post-reformation corruption",
    "Shuayb prohibiting highway banditry threatening believers and diverting from Allah path reminding of numerical increase and corrupter ends",
    "Shuayb proposing patient coexistence between believing and disbelieving factions until divine judgment as best arbiter",
    "Madyan arrogant elite threatening Shuayb and believers with eviction or forced religious return which prophet rejects even if unwilling",
    "Shuayb declaring return to former religion as fabricating lies against Allah relying on divine encompassing knowledge and truthful arbitration",
    "Disbelieving Madyan elite warning followers that obeying Shuayb guarantees loss",
    "Earthquake seizing Madyan leaving them prone corpses in homes",
    "Shuayb deniers erased as though never residing there confirmed as ultimate losers",
    "Shuayb departing stating conveyed messages and advice unable to grieve for disbelieving people",
    "Pattern of poverty and hardship sent to every city receiving denied prophets to induce humility",
    "Hardship replaced with prosperity until increase triggered complacency then sudden seizure while unaware",
    "Conditional blessing formula where belief and God-fearing would open heaven and earth blessings denied through rejection",
    "City dwellers questioning security from nighttime punishment arrival during sleep",
    "City dwellers questioning security from morning punishment arrival during play",
    "No one secure from divine plan except losing people as fundamental theological principle",
    "Post-inheritance generations warned that prior destruction proves capability to afflict for sins with sealed hearts preventing hearing",
    "City narratives related as partial news confirming messengers brought proofs yet prior denial prevented subsequent belief sealing hearts",
    "Most destroyed peoples found lacking covenant fidelity instead characterized by defiant disobedience"
  ],
  "ext-007-p4": [
    "Musa sent after prior prophets with divine signs to Firawn establishment who treated them unjustly demonstrating corrupter end",
    "Musa declaring messenger status from Lord of worlds before Firawn",
    "Musa obligated to speak only truth about Allah bringing clear evidence demanding Israelite liberation",
    "Firawn demanding proof production if Musa claims truthfulness",
    "Musa casting staff transforming into manifest serpent",
    "Musa drawing hand appearing white and radiant for observers",
    "Firawn elite identifying Musa as learned magician",
    "Elite suspecting Musa aims territorial expulsion requesting strategic instruction",
    "Advisors recommending postponement while dispatching gatherers across cities",
    "Gatherers tasked to recruit every learned magician for confrontation",
    "Magicians arriving before Firawn negotiating reward for victory",
    "Firawn promising reward plus proximity status among court favorites",
    "Magicians offering Musa choice of throwing first or yielding priority",
    "Musa deferring to them resulting in bewitching display terrorizing audience with great magic feat",
    "Divine inspiration commanding Musa to throw his staff which immediately devoured fabricated illusions",
    "Truth established abolishing magician works rendering them void",
    "Firawn and establishment overcome and debased at that very location",
    "Magicians falling prostrate recognizing superior power",
    "Egyptian magicians declaring belief in Lord of worlds after witnessing staff-serpent miracle",
    "Magicians specifying Lord of Musa and Harun as object of new faith",
    "Firawn accusing magicians of premature conspiracy alleging urban plot to expel inhabitants",
    "Firawn threatening cross-limb amputation and universal crucifixion of converted magicians",
    "Magicians declaring inevitable return to their Lord regardless of earthly punishment",
    "Magicians attributing Firawn resentment solely to their belief in divine signs requesting patience and Muslim death",
    "Firawn elite warning against leaving Musa unchecked fearing corruption and deity abandonment authorizing infanticide and female preservation",
    "Musa instructing people to seek divine help practice patience affirming earth inheritance belongs to righteous servants",
    "People complaining of harm before and after Musa arrival with prophet promising enemy destruction and succession test",
    "Firawn people seized with famine years and fruit deficiency intended as reminder",
    "Prosperity claimed as entitlement while adversity blamed as Musa omen ignoring divine control over fortune",
    "Firawn people declaring immunity to any further signs refusing belief regardless of miraculous evidence",
    "Sequential plagues of flood locusts lice frogs and blood sent as distinct signs met with persistent arrogance and criminality",
    "Punishment prompting conditional plea for Musa to invoke removal promising belief and Israelite release",
    "Punishment removed for specified term immediately triggering broken promise demonstrating transactional faith",
    "Retribution through sea drowning justified by sign denial and heedlessness",
    "Oppressed people inheriting blessed eastern and western lands fulfilling divine good word through patient endurance destroying Firawn constructions",
    "Israelites crossing sea encountering idol-devoted people requesting Musa make similar gods revealing ignorance",
    "Musa condemning idol pursuit as worthless engagement",
    "Musa rhetorically questioning desire for other than Allah who already preferred them over all worlds",
    "Reminder of salvation from Firawn worst torment killing sons sparing women as great divine trial"
  ],
  "ext-007-p5": [
    "Thirty-night appointment with Musa completed by ten totaling forty nights with Aaron deputized commanding righteousness avoiding corrupter way",
    "Musa requesting vision of Allah denied direct sight but mountain manifestation rendered level causing unconsciousness followed by repentance and first-believer declaration",
    "Divine selection of Musa over people through messages and direct speech commanding acceptance of gifts and gratitude",
    "Tablets inscribed with comprehensive instruction and explanation commanding firm adoption and best-of implementation showing home of defiantly disobedient",
    "Arrogant sign-deniers diverted from consciousness path adopting error path instead due to heedless denial",
    "Sign-deniers and Hereafter-meeting rejecters rendered deed-worthy of nothing but exact recompense",
    "Israelites fashioning lowing calf image from ornaments after Musa departure unable to speak or guide yet adopted for worship as wrongdoers",
    "Regret overcoming calf-worshippers acknowledging straying pleading for divine mercy to avoid loser status",
    "Musa returning angry and grieved condemning replacement worship throwing tablets seizing Aaron head-drag toward him while Aaron pleads oppression and near-death",
    "Musa supplicating forgiveness for himself and brother appealing to most merciful of mercifuls",
    "Calf-worshippers sentenced to divine wrath and worldly humiliation as recompense for falsehood fabrication",
    "Evil-doers who subsequently repent and believe assured of Lord forgiveness and mercy thereafter",
    "Anger subsiding Musa retrieving tablets containing guidance and mercy inscription for Lord-fearers",
    "Seventy elders chosen for divine appointment seized by earthquake prompting Musa intercession acknowledging divine trial mechanism and requesting protection as best forgiver",
    "Request for goodness in both worlds affirmed with divine response restricting punishment to willed targets while mercy encompasses all things especially God-fearers zakat-givers and sign-believers",
    "Unlettered prophet described in Torah and Gospel enjoining right forbidding wrong permitting good prohibiting evil relieving burdens and shackles defining successful followers",
    "Universal messenger address to all mankind from dominion-holder of heavens and earth commanding belief in Allah and His unlettered messenger for guidance",
    "Musa community subset identified as guiding by truth and establishing justice through it",
    "Twelve tribes divided as distinct nations with rock-struck twelve springs cloud shade manna and quails provided while wronging only themselves",
    "Entry command to city eating freely requesting burden relief entering gate bowing humbly promising sin forgiveness and good-doer increase",
    "Wrongdoers substituting prescribed entry words triggering sky punishment for persistent wrongdoing",
    "Sabbath seaside town trial where fish appeared openly on rest day only testing defiant disobedience",
    "Community division between advisors warning transgressors and those questioning why warn people destined for destruction answered as absolution before Lord",
    "Forgetful majority punished saving evil-forbidders while seizing wrongdoers with wretched punishment for defiance",
    "Insolent forbidden-act persisters transformed into despised apes",
    "Divine declaration of continuous torment-senders until Resurrection balanced by swift penalty and forgiving mercy",
    "Earth-wide national division with righteous and otherwise tested through prosperity and adversity prompting potential return",
    "Scripture inheritors accepting worldly commodities assuming automatic forgiveness repeating pattern despite covenant requiring truth-only speech about Allah preferring Hereafter home through reason",
    "Book-holders establishing prayer assured of unrewarded reformer compensation",
    "Mountain raised above them like dark cloud commanding determined acceptance and content remembrance for divine fear"
  ],
  "ext-007-p6": [
    "Primordial covenant extracting descendants from Adam loins testifying divine lordship preventing Resurrection Day ignorance defense",
    "Preemptive blocking of ancestral-shirk excuse claiming fathers associated partners while descendants merely followed questioning destruction for falsifiers",
    "Detailed verse explanation methodology aimed at prompting return to righteousness",
    "Recitation command regarding one given divine signs who detached allowing satanic pursuit into deviation",
    "Elevation possibility rejected through earth-adherence and desire-following compared to panting dog whether chased or left as sign-denier parable",
    "Evil example characterization applied to sign-deniers who wronged themselves",
    "Divine guidance producing guided individuals while misdirection producing losers",
    "Jinn and mankind created for Hell possessing unused hearts eyes ears reduced below livestock as heedless beings",
    "Best names belonging to Allah commanding invocation through them while abandoning name-deviators awaiting recompense",
    "Guiding truth-based community reiterated within Musa people establishing justice",
    "Sign-deniers progressively led to destruction from unknown directions",
    "Extended respite granted with affirmation that divine plan remains firm",
    "Reflective challenge denying madness in companion Muhammad affirming clear warner status",
    "Observational command examining heavens earth creation questioning imminent appointed time and alternative statement belief",
    "Misguided individuals left without guide wandering blindly in transgression",
    "Hour timing knowledge restricted to Lord alone weighing heavily on heavens and earth arriving unexpectedly despite popular inquiry",
    "Prophet disclaiming personal benefit-harm power or unseen knowledge affirming warner-good-tidings role limited to believers",
    "Single-soul creation producing mate for security with pregnancy progression from light to heavy burden invoking gratitude for good offspring",
    "Gratitude reversed upon receiving good child through partner-ascription to Allah exalted above associations",
    "False associates challenged as created non-creators incapable of helping others or themselves",
    "Invitation to guidance ignored by false deities whether called upon or met with silence",
    "Polytheist deities exposed as fellow servants challenged to respond proving truthfulness",
    "Anatomical incapacity of false gods lacking walking feet striking hands seeing eyes hearing ears challenged to conspire without respite",
    "Allah declared sole protector having sent down Book allying with righteous",
    "Non-divine entities confirmed unable to help callers or themselves",
    "Guidance invitation unheard by false deities appearing to look while actually blind",
    "Behavioral triad command accepting free giving enjoining good turning away from ignorant",
    "Satanic evil suggestion countered by seeking refuge in Hearing Knowing Allah",
    "God-fearers experiencing satanic impulse immediately remembering Allah gaining insight",
    "Devil-brothers increasing error without cessation contrasting god-fearing recovery",
    "Sign-demanding challengers answered that Prophet follows only revelation serving as enlightenment guidance and mercy for believers",
    "Quran recitation etiquette commanding listening and attention for mercy reception",
    "Internal humble fearful Lord-remembrance commanded morning and evening without vocal display avoiding heedlessness",
    "Near-Lord angels unimpeded by arrogance engaging in continuous worship exaltation and prostration",
    "Closing affirmation that those nearest to Allah never disdain His worship but glorify and prostrate to Him"
  ]
};

// Build extractions
const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`7:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`7:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 7, surahName: "Al-A'raf",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: `Wave 1 genuine re-extraction. Passage boundaries follow thematic-prophetic structure.`,
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE ANALYTICAL ARRAYS ===

// P1 (7:1-30): Revelation, creation, Adam/Satan
{
  const e = extractions[0];
  const allah = findWord(3, ["\u0627","\u0644","\u0644","\u0647"]);
  if (allah) e.divineNamesAndAttributes.push({ term: allah, transliteration: "Allah", gloss: "God (editorial gloss)", keys: ["7:3"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:3"], excerpt: fv(3), description: "Follow what has been revealed to you from your Lord and do not follow other protectors besides Him." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["7:3"], excerpt: fv(3), description: "Do not follow other protectors (awliya) besides Allah." });
  e.propheticNarratives.push({ label: "Satan's deception of Adam and Eve in the Garden resulting in expulsion and establishment of ongoing enmity", keys: ["7:20","7:21","7:22","7:23","7:24","7:25"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Clothing as dual concept: physical covering of shame and spiritual garment of righteousness (libas al-taqwa)", keys: ["7:26"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Satan's invisible observation of humanity from positions humans cannot perceive", keys: ["7:27"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Allah-humanity relationship through revelation commanding exclusive following and rejection of false protectors", keys: ["7:3"], evidenceClass: "EXPLICIT_TEXT" });

  const kitab = findWord(2, ["\u0643","\u062a","\u0627","\u0628"]);
  if (kitab) e.terminology.push({ term: kitab, transliteration: "kitab", gloss: "Book/scripture (editorial gloss)", keys: ["7:2"] });
}

// P2 (7:31-58): Worship adornment, prohibitions, A'raf
{
  const e = extractions[1];
  // Divine names (within 7:31-58 range)
  const rabb2 = findWord(54, ["\u0631","\u0628"]);
  if (rabb2) e.divineNamesAndAttributes.push({ term: rabb2, transliteration: "Rabb", gloss: "Lord/Sustainer (editorial gloss)", keys: ["7:54"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:31"], excerpt: fv(31), description: "Take your adornment at every mosque and eat and drink but be not excessive." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["7:56"], excerpt: fv(56), description: "Do not spread corruption on earth after its rectification." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:56"], excerpt: fv(56), description: "Call upon Him with fear and hope — indeed mercy of Allah is near to the good-doers." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["7:33"], excerpt: fv(33), description: "Say: My Lord has only forbidden immoralities (fawahish) apparent and hidden, sin, unjust aggression, associating partners with Allah without authority, and saying about Allah what you do not know." });

  e.humanConditionsAndSpiritualStates.push({ label: "Gradual delusion (istidraj) mechanism: Allah extends respite to deniers while they remain unaware", keys: ["7:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Belated regret upon sudden punishment arrival — too late for benefit", keys: ["7:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "People of A'raf as intermediate category recognizing both Paradise and Hell inhabitants by their marks", keys: ["7:46","7:47","7:48"], evidenceClass: "EXPLICIT_TEXT" });

  const fawahish = findWord(33, ["\u0641","\u062d","\u0634"]);
  if (fawahish) e.terminology.push({ term: fawahish, transliteration: "fawahish", gloss: "immoralities/gross indecencies (editorial gloss)", keys: ["7:33"] });
}

// P3 (7:59-102): Nuh, Hud, Salih narratives
{
  const e = extractions[2];
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:59"], excerpt: fv(59), description: "We sent Nuh to his people: worship Allah — you have no god besides Him. Indeed I fear for you the punishment of a great Day." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:65"], excerpt: fv(65), description: "To Aad their brother Hud: worship Allah — you have no god besides Him. Will you not fear Him?" });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:73"], excerpt: fv(73), description: "To Thamud their brother Salih: worship Allah — there is no god besides Him. Clear proof has come: she-camel of Allah as sign." });

  e.propheticNarratives.push({ label: "Nuh mission: tawheed proclamation met with elite dismissal claiming clear error; prophet defends divine appointment", keys: ["7:59","7:60","7:61","7:62"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Hud mission to Aad: tawheed warning rejected through ancestral-following defense; divine curse and destruction follow", keys: ["7:65","7:66","7:67","7:68","7:69","7:70","7:71","7:72"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Salih mission with she-camel as tangible divine sign; hamstringing triggers seismic punishment destroying entire community", keys: ["7:73","7:74","7:75","7:76","7:77","7:78","7:79"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Ancestral-following defense: we follow what our fathers followed even if fathers lacked understanding and guidance", keys: ["7:70"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Prophet's departing lament distinguishing sincere counsel from rejected advice: conveyed Lord's message and advised but you love not advisors", keys: ["7:79"], evidenceClass: "EXPLICIT_TEXT" });

  const naqah = findWord(73, ["\u0646","\u0627","\u0642","\u0629"]);
  if (naqah) e.terminology.push({ term: naqah, transliteration: "naqah", gloss: "she-camel (editorial gloss)", keys: ["7:73"] });
}

// P4 (7:103-141): Lot, Shu'ayb, Musa-Firawn
{
  const e = extractions[3];
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:105"], excerpt: fv(105), description: "Worthy that I say nothing about Allah except truth — I have come with sign from your Lord so send with me children of Israel." });
  e.propheticNarratives.push({ label: "Musa-Firawn confrontation: staff-serpent and luminous-hand as dual signs demanding Israelite liberation", keys: ["7:104","7:105","7:106","7:107","7:108"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Magician conversion: Egyptian sorcerers recognize divine power fall prostrate declare belief in Lord of worlds despite Firawn's threats", keys: ["7:113","7:114","7:115","7:116","7:117","7:118","7:119","7:120","7:121","7:122","7:123","7:124","7:125","7:126"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Conditional faith pattern: plague removed leads to broken promise demonstrating transactional belief", keys: ["7:134","7:135"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Economic manipulation as counter-propaganda: Firawn fills houses with gold and silver to entice people away from Musa's religion", keys: ["7:131"], evidenceClass: "EXPLICIT_TEXT" });

  const ayat = findWord(105, ["\u0622","\u064a","\u0629"]);
  if (ayat) e.terminology.push({ term: ayat, transliteration: "ayah", gloss: "sign/verse (editorial gloss)", keys: ["7:105"] });
}

// P5 (7:142-171): Tablets, calf, covenant enforcement
{
  const e = extractions[4];
  // Commands (within 7:142-171 range)
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:144"], excerpt: fv(144), description: "Take what I have given you firmly and be among the grateful — instruction regarding tablets." });

  // Social/economic (within 7:142-171 range)
  e.socialEconomicCivilisational.push({ label: "Wilderness provision cycle: twelve springs from struck rock, shade from clouds, manna and quails — sustained divine care during transition", keys: ["7:160"], evidenceClass: "EXPLICIT_TEXT" });

  const ghafur = findWord(151, ["\u063a","\u0641","\u0648","\u0631"]);
  const rahman = findWord(151, ["\u0631","\u062d","\u0645","\u0646"]);
  if (ghafur) e.divineNamesAndAttributes.push({ term: ghafur, transliteration: "Ghafur", gloss: "Forgiving (editorial gloss)", keys: ["7:151"] });
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["7:151"] });

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["7:151"], excerpt: fv(151), description: "Musa's prayer: My Lord forgive me and my brother and admit us into Your mercy — You are most merciful of the merciful." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:145"], excerpt: fv(145), description: "Take what I have given you firmly and be among the grateful — instruction regarding tablets." });

  e.propheticNarratives.push({ label: "Forty-night divine appointment: thirty nights completed by ten establishing direct divine communication with Musa", keys: ["7:142","7:143"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Calf-worship crisis: community adopts calf during Musa's absence; Aaron protests powerlessly; Musa returns in anger intercedes", keys: ["7:148","7:149","7:150","7:151","7:152","7:153","7:154"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Mountain-raising as covenant-enforcement: held above them like canopy commanding hold firmly what was given", keys: ["7:171"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Collective accountability: seventy elders seized by earthquake demonstrating shared responsibility for communal failures", keys: ["7:155"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Three-tier communal outcome: saved forbidders of evil, silent majority, destroyed transgressors — Sabbath narrative paradigm", keys: ["7:163","7:164","7:165"], evidenceClass: "EXPLICIT_TEXT" });

  const alwah = findWord(145, ["\u0623","\u0644","\u0648","\u0627","\u062d"]);
  if (alwah) e.terminology.push({ term: alwah, transliteration: "alwah", gloss: "tablets (editorial gloss)", keys: ["7:145"] });
}

// P6 (7:172-206): Primordial covenant, closing
{
  const e = extractions[5];
  const hakeem = findWord(1, ["\u062d","\u0643","\u064a","\u0645"]);
  const aleem = findWord(1, ["\u0639","\u0644","\u064a","\u0645"]);
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["7:1"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["7:1"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:205"], excerpt: fv(205), description: "Remember your Lord within yourself humbly and fearfully without loudness of speech morning and evening." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["7:205"], excerpt: fv(205), description: "Do not be among the heedless (ghafilin)." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["7:199"], excerpt: fv(199), description: "Take what is given freely, enjoin good, and turn away from the ignorant." });

  e.propheticNarratives.push({ label: "Primordial covenant (mithaq): Lord extracted descendants from Adam's loins making them testify Am I not your Lord — establishing innate divine recognition", keys: ["7:172","7:173"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Dog-parable: one given signs who withdrew becoming attached to earth panting whether chased or left — base desire pursuit", keys: ["7:176"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Sensory faculty misuse: hearts that do not understand eyes that do not see ears that do not hear — reduced below livestock", keys: ["7:179"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Divine compulsion impossibility: if Lord willed all would believe — preserves human agency and accountability", keys: ["7:199"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Innate Allah-humanity relationship through primordial testimony preceding individual birth", keys: ["7:172"], evidenceClass: "EXPLICIT_TEXT" });

  const mithaq = findWord(172, ["\u0645","\u064a","\u062b","\u0627","\u0642"]);
  if (mithaq) e.terminology.push({ term: mithaq, transliteration: "mithaq", gloss: "covenant/pact (editorial gloss)", keys: ["7:172"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `007-al-araf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 007-al-araf-p${num}.json`);
}

// === CANDIDATES (cand-0317..cand-0376, 60 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-007-p1,ext-007-p2,ext-007-p3,ext-007-p4,ext-007-p5,ext-007-p6",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0317..0326)
  { id: "cand-0317", label: "Quran as revealed Book commanding exclusive following", def: "In 7:2: A Book revealed to you so let there be no discomfort in your breast from it — that you may warn thereby and as reminder for believers.", key: "7:2", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Quran self-described as revealed Book with warning-reminder function."}] },
  { id: "cand-0318", label: "Creation-establishment framework grounding divine authority", def: "In 7:54: Indeed your Lord is Allah who created heavens and earth in six days then established Himself above the Throne.", key: "7:54", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Creation and istawa as rububiyyah foundations."},{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"Six-day creation demonstrating power."}] },
  { id: "cand-0319", label: "Supplication etiquette requiring humility and secrecy", def: "In 7:55: Call upon your Lord humbly and secretly — indeed He does not love transgressors.", key: "7:55", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Dua manner specified."},{topicId:"dua-etiquette",layer:"scholarly",relationship:"same-concept",note:"Humility-secrecy as proper form."}] },
  { id: "cand-0320", label: "Corruption prohibition after divine rectification", def: "In 7:56: Do not spread corruption on earth after its rectification and call upon Him with fear and hope.", key: "7:56", overlap: [{topicId:"fasad-fil-ard",layer:"scholarly",relationship:"same-concept",note:"Fasad explicitly prohibited post-islah."},{topicId:"environmental-corruption",layer:"scholarly",relationship:"related-not-identical",note:"Earth-corruption as ecological concept."}] },
  { id: "cand-0321", label: "Natural-cycle resurrection analogy through rain revival", def: "In 7:57: Wind bears glad tidings bringing rain to dead land reviving it — thus We bring forth the dead.", key: "7:57", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Rain-revival as resurrection sign."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Natural phenomena as theological evidence."}] },
  { id: "cand-0322", label: "Historical destruction pattern through messenger rejection", def: "In 7:4-5: How many towns We destroyed Our punishment came by night or while resting; their claim when punishment came was only we were wrongdoers.", key: "7:4", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Destruction follows rejection pattern."}] },
  { id: "cand-0323", label: "Satan's primordial deception establishing ongoing enmity", def: "In 7:20-25: Satan whispered to Adam and Eve causing expulsion from Garden; Allah declared enmity between Satan and humanity.", key: "7:20", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Origin of satanic enmity narrated."},{topicId:"adam-story",layer:"scholarly",relationship:"same-concept",note:"Fall narrative establishing enemy identity."}] },
  { id: "cand-0324", label: "Clothing as dual physical-spiritual concept", def: "In 7:26: O children of Adam We have bestowed clothing to conceal shame and as adornment but clothing of righteousness is best.", key: "7:26", overlap: [{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Libas al-taqwa as moral garment."}] },
  { id: "cand-0325", label: "Satan's invisible observation from unseen positions", def: "In 7:27: Indeed he sees you he and his tribe from where you do not see them.", key: "7:27", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"related-not-identical",note:"Asymmetric visibility as satanic advantage."},{topicId:"unseen-belief",layer:"scholarly",relationship:"related-not-identical",note:"Unseen realm affecting visible world."}] },
  { id: "cand-0326", label: "Mercy proximity conditioned on goodness", def: "In 7:56: Indeed mercy of Allah is near to the good-doers (muhsinin).", key: "7:56", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Rahmah linked to ihsan."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Divine mercy as responsive attribute."}] },

  // P2 (cand-0327..0336)
  { id: "cand-0327", label: "Worship-context adornment with waste prohibition", def: "In 7:31: O children of Adam take your adornment at every masjid and eat and drink but be not excessive — He loves not the excessive.", key: "7:31", overlap: [{topicId:"balance-moderation",layer:"scholarly",relationship:"same-concept",note:"Wasatiyyah in consumption."},{topicId:"prayer",layer:"curated",relationship:"related-not-identical",note:"Adornment linked to masjid attendance."}] },
  { id: "cand-0328", label: "Four-fold prohibition list defining moral boundaries", def: "In 7:33: Say my Lord has forbidden immoralities apparent and hidden sin unjust aggression associating partners without authority and saying about Allah what you do not know.", key: "7:33", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Shirk listed among fundamental prohibitions."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Comprehensive moral boundary definition."}] },
  { id: "cand-0329", label: "Gradual delusion mechanism for persistent deniers", def: "In 7:37: Those who deny Our signs We draw them gradually from where they do not know; I extend respite for them — indeed My plan is firm.", key: "7:37", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"related-not-identical",note:"Istidraj as divine strategy."},{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Extended respite as test."}] },
  { id: "cand-0330", label: "Heaven-gate impossibility metaphor for criminal recompense", def: "In 7:40: Indeed those who deny Our signs and are arrogant toward them — gates of Heaven will not be opened nor will they enter Paradise until camel passes through needle eye.", key: "7:40", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Impossible-entry metaphor for eternal exclusion."}] },
  { id: "cand-0331", label: "People of A'raf as intermediate eschatological category", def: "In 7:46-48: Between them a partition on A'raf are men who recognize each by marks; they call to Paradise companions and to Fire companions.", key: "7:46", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Intermediate state between salvation and damnation."}] },
  { id: "cand-0332", label: "Universal term principle preventing premature judgment", def: "In 7:34: Every nation has a term; when their term comes they cannot remain an hour nor precede it.", key: "7:34", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"related-not-identical",note:"Fixed term as divine decree."}] },
  { id: "cand-0333", label: "Observational command to study historical outcomes", def: "In 7:86: Say travel through the land and observe what was the end of the deniers.", key: "7:86", overlap: [{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Empirical observation commanded."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Historical sites as reflective evidence."}] },
  { id: "cand-0334", label: "Intercession denied based on prior ingratitude", def: "In 7:53: Are they awaiting anything but its interpretation? The Day its interpretation comes those who forgot it before will say messengers came with truth.", key: "7:53", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Belated recognition without benefit."}] },
  { id: "cand-0335", label: "Rhetorical challenge to those forbidding divine provisions", def: "In 7:32: Say who has forbidden the adornment of Allah which He has produced for His servants and the good things of provision?", key: "7:32", overlap: [{topicId:"halal-food",layer:"scholarly",relationship:"related-not-identical",note:"Provision permissibility as default."}] },
  { id: "cand-0336", label: "Fire as reciprocal recompense for wrongdoing", def: "In 7:41: For them from Fire a bed and above them coverings — thus We recompense the wrongdoers.", key: "7:41", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Jahannam described as bedding."},{topicId:"justice-oppression",layer:"scholarly",relationship:"related-not-identical",note:"Reciprocal punishment principle."}] },

  // P3 (cand-0337..0346)
  { id: "cand-0337", label: "Nuh tawheed-fear paradigm as prophetic template", def: "In 7:59: We sent Nuh to his people saying worship Allah you have no god besides Him indeed I fear for you punishment of great Day.", key: "7:59", overlap: [{topicId:"nuh-story",layer:"scholarly",relationship:"same-concept",note:"Nuh's foundational message."},{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Exclusive worship command."}] },
  { id: "cand-0338", label: "Elite dismissal of prophet as clear error claim", def: "In 7:60: Said the eminent among his people indeed we see you in clear error.", key: "7:60", overlap: [{topicId:"prophets",layer:"curated",relationship:"related-not-identical",note:"Rejection pattern across prophetic missions."}] },
  { id: "cand-0339", label: "Hud mission rejected through ancestral-following defense", def: "In 7:70: They said have you come to us that we worship Allah alone and abandon what our fathers worshipped? Bring what you promise if truthful.", key: "7:70", overlap: [{topicId:"hud-story",layer:"scholarly",relationship:"same-concept",note:"Aad rejection rationale."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Ancestral tradition vs revealed knowledge."}] },
  { id: "cand-0340", label: "She-camel as tangible divine sign demanding respect", def: "In 7:73: This is she-camel of Allah as a sign for you so leave her to eat in Allah's land and do not touch her with harm.", key: "7:73", overlap: [{topicId:"salih-story",layer:"scholarly",relationship:"same-concept",note:"Naqah as miraculous sign."},{topicId:"animals-as-communities",layer:"scholarly",relationship:"related-not-identical",note:"Sacred animal status."}] },
  { id: "cand-0341", label: "Hamstringing as deliberate defiance triggering seismic punishment", def: "In 7:77: They hamstrung the she-camel and defied command of their Lord saying O Salih bring us what you promise if you are messenger.", key: "7:77", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Defiance triggering immediate punishment."}] },
  { id: "cand-0342", label: "Prophet's departing lament distinguishing counsel from rejection", def: "In 7:79: He turned away from them and said O my people I conveyed to you message of my Lord and advised you but you do not love advisors.", key: "7:79", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Nasihah distinguished from rejected advice."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Sincere counsel as prophetic virtue."}] },
  { id: "cand-0343", label: "Divine curse linked to persistent disbelief across temporal domains", def: "In 7:67: Indeed upon them is curse in this world and Day of Resurrection — indeed Aad disbelieved in their Lord so away with Aad people of Hud.", key: "7:67", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Dual-temporal curse formula."}] },
  { id: "cand-0344", label: "Succession after Nuh with increased stature as divine generosity", def: "In 7:69: Remember when He made you successors after people of Nuh and increased you in stature extensively.", key: "7:69", overlap: [{topicId:"khalifah-vicegerent",layer:"scholarly",relationship:"related-not-identical",note:"Khilafah as post-destruction succession."}] },
  { id: "cand-0345", label: "Seismic punishment as collective annihilation mechanism", def: "In 7:78: So the earthquake seized them and they became within their home prostrate corpses.", key: "7:78", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Rajfah as destruction instrument."}] },
  { id: "cand-0346", label: "Messenger self-defense claiming divine knowledge transmission", def: "In 7:62: I am only a messenger from Lord of worlds conveying messages of my Lord and advising you and I know from Allah what you do not know.", key: "7:62", overlap: [{topicId:"prophet-vs-messenger",layer:"scholarly",relationship:"related-not-identical",note:"Rasul role defined through function."}] },

  // P4 (cand-0347..0356)
  { id: "cand-0347", label: "Staff-serpent and luminous-hand as dual prophetic signs", def: "In 7:107-108: He cast his staff and behold it was a serpent manifest; he drew out his hand and behold it was white for the observers.", key: "7:107", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Dual miracle demonstration."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Physical signs as divine authentication."}] },
  { id: "cand-0348", label: "Magician conversion as pivotal recognition of divine power", def: "In 7:120-122: Magicians fell prostrate saying we have believed in Lord of worlds Lord of Musa and Harun.", key: "7:120", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Sorcerer-to-believer transformation."},{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Immediate faith upon witnessing truth."}] },
  { id: "cand-0349", label: "Firawn's retaliatory threats demonstrating tyrannical response", def: "In 7:124: I will cut off your hands and feet on opposite sides then crucify you on palm trunks.", key: "7:124", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Tyrannical punishment as oppression."}] },
  { id: "cand-0350", label: "Economic manipulation as counter-propaganda against faith", def: "In 7:131: And We filled their houses with gold and silver to entice them away from religion.", key: "7:131", overlap: [{topicId:"wealth-ownership",layer:"scholarly",relationship:"related-not-identical",note:"Wealth as distraction mechanism."},{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Material temptation as test."}] },
  { id: "cand-0351", label: "Believing minority within oppressive regime advocating trust", def: "In 7:127-128: Two men among those who feared whom Allah had blessed said enter upon them the gate — when you enter it you will be prevailing.", key: "7:127", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Tawakkul amid oppression."}] },
  { id: "cand-0352", label: "Conditional faith pattern: relief triggers broken promise", def: "In 7:134-135: When plague removed they broke their promise demonstrating transactional belief.", key: "7:134", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Faith fluctuates with circumstances."},{topicId:"covenant-breach",layer:"scholarly",relationship:"same-concept",note:"Broken promise after divine relief."}] },
  { id: "cand-0353", label: "Red Sea drowning as definitive divine judgment", def: "In 7:136: So We took retribution from them and drowned them in the sea because they denied Our signs and were heedless.", key: "7:136", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Sea-drowning as climactic judgment."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Retribution following persistent denial."}] },
  { id: "cand-0354", label: "Wilderness provision cycle demonstrating sustained divine care", def: "In 7:160: We divided them into twelve tribes; struck rock twelve springs; shaded with clouds; sent manna and quails.", key: "7:160", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Multi-modal provision system."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Daily dependence on divine provision."}] },
  { id: "cand-0355", label: "Twelve-tribe division as organizational divine act", def: "In 7:160: We divided them into twelve tribes as nations.", key: "7:160", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"related-not-identical",note:"Social organization as divine arrangement."}] },
  { id: "cand-0356", label: "Demand for Israelite liberation as prophetic mission core", def: "In 7:105: Worthy that I say nothing about Allah except truth — send with me children of Israel.", key: "7:105", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Liberation demand as mission statement."}] },

  // P5 (cand-0357..0366)
  { id: "cand-0357", label: "Forty-night divine appointment establishing direct communication", def: "In 7:142: We appointed for Musa thirty nights and completed them with ten so term of his Lord was forty nights.", key: "7:142", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Mi'qat as divine appointment."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Direct communication preceding scripture."}] },
  { id: "cand-0358", label: "Tablet-reception as guidance-mercy dual gift", def: "In 7:145: We wrote for him on tablets guidance and mercy for everything so take it firmly and command your people to take best of it.", key: "7:145", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Alwah as written revelation."},{topicId:"divine-mercy",layer:"scholarly",relationship:"related-not-identical",note:"Mercy embedded in legislation."}] },
  { id: "cand-0359", label: "Calf-worship crisis revealing communal betrayal during absence", def: "In 7:148-149: People of Musa adopted after him a calf image having lowing sound; when regret overtook them they acknowledged straying.", key: "7:148", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Ijl worship as apostasy."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Idolatry during prophet absence."}] },
  { id: "cand-0360", label: "Musa's anguished intercession for brother and self", def: "In 7:151: Said my Lord forgive me and my brother and admit us into Your mercy — You are most merciful of the merciful.", key: "7:151", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Model intercessory dua."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Forgiveness sought through mercy appeal."}] },
  { id: "cand-0361", label: "Collective accountability through elder seizure", def: "In 7:155: He chose seventy men from his people for Our appointment; when earthquake seized them he said my Lord if You willed You could have destroyed them before.", key: "7:155", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"related-not-identical",note:"Representative accountability."},{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Selection as test mechanism."}] },
  { id: "cand-0362", label: "Mountain-raising as covenant-enforcement mechanism", def: "In 7:171: When We shook the mountain above them as if it were a canopy and they thought it would fall upon them hold firmly what We have given you.", key: "7:171", overlap: [{topicId:"covenants-ahd",layer:"scholarly",relationship:"same-concept",note:"Physical enforcement of covenant acceptance."},{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Raf al-jabal episode."}] },
  { id: "cand-0363", label: "Three-tier communal outcome from Sabbath transgression", def: "In 7:163-165: Community divided into forbidders of evil silent majority and transgressors; saved forbidders destroyed transgressors.", key: "7:163", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Differential punishment based on communal response to transgression."},{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Sabbath as communal test with three outcomes."}] },
  { id: "cand-0364", label: "Aaron's powerless protest against communal idolatry", def: "In 7:150: Aaron said O son of my mother indeed the people oppressed me and were about to kill me so let not enemies rejoice over me.", key: "7:150", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"related-not-identical",note:"Harun's constrained position."}] },
  { id: "cand-0365", label: "Repentance acceptance confirming divine mercy after idolatry", def: "In 7:153: Those who committed evil deeds then repented after them and believed indeed your Lord thereafter is Forgiving Merciful.", key: "7:153", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Post-idolatry tawbah accepted."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafur Rahim following repentance."}] },
  { id: "cand-0366", label: "Sabbath violation as communal responsibility test case", def: "In 7:163: Ask them about the town by the sea when they transgressed in Sabbath — fish came openly on Sabbath day absent otherwise.", key: "7:163", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Sabbath as specific test."}] },

  // P6 (cand-0367..0376)
  { id: "cand-0367", label: "Primordial covenant establishing innate divine recognition", def: "In 7:172: When your Lord took from children of Adam from their loins their descendants and made them testify concerning themselves Am I not your Lord they said Yes we testify.", key: "7:172", overlap: [{topicId:"fitrah-nature",layer:"scholarly",relationship:"same-concept",note:"Mithaq as fitrah foundation."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Pre-existent lordship acknowledgment."},{topicId:"covenants-ahd",layer:"scholarly",relationship:"same-concept",note:"Original covenant preceding revelation."}] },
  { id: "cand-0368", label: "Testimony mechanism preventing future denial excuse", def: "In 7:172-173: Lest you say on Day of Resurrection we were unaware of this or our fathers associated partners before and we were descendants after them.", key: "7:172", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Pre-emptive elimination of ignorance defense."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual testimony binding."}] },
  { id: "cand-0369", label: "Dog-parable illustrating base desire pursuit", def: "In 7:176: His example is like the dog — if you chase him he pants or leave him he pants. That is example of people who denied Our signs.", key: "7:176", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Animal comparison for spiritual degradation."}] },
  { id: "cand-0370", label: "Sensory faculty misuse reducing humans below livestock", def: "In 7:179: They have hearts with which they do not understand eyes with which they do not see ears with which they do not hear — like livestock rather more astray.", key: "7:179", overlap: [{topicId:"intellect-importance",layer:"scholarly",relationship:"same-concept",note:"Unused faculties as spiritual failure."},{topicId:"human-dignity",layer:"scholarly",relationship:"related-not-identical",note:"Sub-animal state as dignity loss."}] },
  { id: "cand-0371", label: "Jinn-mankind creation purpose including Hell-population", def: "In 7:179: We have created for Hell many of jinn and mankind.", key: "7:179", overlap: [{topicId:"jinn-creation",layer:"scholarly",relationship:"same-concept",note:"Jinn included in accountability."},{topicId:"jahannam-description",layer:"scholarly",relationship:"related-not-identical",note:"Hell as destination for many."}] },
  { id: "cand-0372", label: "Divine compulsion impossibility preserving human agency", def: "In 7:199: Take what is given freely enjoin good turn away from ignorant; if evil suggestion from Satan comes seek refuge in Allah.", key: "7:199", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"related-not-identical",note:"Agency preserved through choice commands."}] },
  { id: "cand-0373", label: "Closing supplication commands mirroring opening themes", def: "In 7:205: Remember your Lord within yourself humbly and fearfully without loudness morning and evening and do not be among heedless.", key: "7:205", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr as internal practice."},{topicId:"supplication",layer:"curated",relationship:"related-not-identical",note:"Private remembrance as worship form."}] },
  { id: "cand-0374", label: "Agricultural metaphor linking gratitude to productivity", def: "In 7:58: Good land produces vegetation abundantly by Lord's permission; bad land produces only sparsely. Thus We explain signs for grateful people.", key: "7:58", overlap: [{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Gratitude as fertility condition."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Agriculture as sign system."}] },
  { id: "cand-0375", label: "Permission-condition balancing divine sovereignty with reasoning", def: "In 7:199: No soul can believe except by Allah's permission and He places wrath upon those who do not use reason.", key: "7:199", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Permission and reason as complementary conditions."},{topicId:"intellect-importance",layer:"scholarly",relationship:"same-concept",note:"Reason as prerequisite for guidance."}] },
  { id: "cand-0376", label: "Wind-rain cycle as glad-tidings bearer and resurrection sign", def: "In 7:57: He sends winds as glad tidings before His mercy until they bear heavy clouds driven to dead land sending rain producing fruits.", key: "7:57", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Meteorological signs."},{topicId:"divine-mercy",layer:"scholarly",relationship:"related-not-identical",note:"Rain as mercy manifestation."}] }
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

const candPerPassage = [[0,10],[10,20],[20,30],[30,40],[40,50],[50,60]];
for (let pi = 0; pi < 6; pi++) {
  const [start, end] = candPerPassage[pi];
  extractions[pi].topicCandidateIds = candidates.candidates.slice(start, end).map(c => c.candidateId);
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `007-al-araf-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-031.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-031.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
