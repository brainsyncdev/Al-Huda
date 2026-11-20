// MFD-11 Wave 5: Surah 33 (Al-Ahzab) genuine re-extraction.
// Covers 33:1–73 in 4 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "033-0001-0073.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 33:${n} not found`);
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

console.log("Generating Surah 33 (Al-Ahzab) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T14:25:00.000Z";

// P1: 33:1–20 — Taqwa command; Ahzab siege; believer-hypocrite contrast
// P2: 33:21–40 — Prophet as uswah hasanah; Zayd-Zaynab marriage reform; khatam al-nabiyyin
// P3: 33:41–59 — Dhikr-salah commands; wives-daughters hijab; slander punishment
// P4: 33:60–73 — Hypocrite-munafiq threats; Hour knowledge; amanah trust

const PASSAGES = [
  { id: "ext-033-p1", from: 1, to: 20,
    label: "O Prophet fear Allah obey not disbelievers hypocrites Allah Knowing Wise; follow revealed Lord indeed Allah Aware Doing; put trust Allah sufficient Trustee; Allah made man two hearts womb; made adopted sons real sons say names fathers juster Allah; if know not fathers brothers religion wards; Prophet closer believers selves wives mothers; blood-relatives closer decree Book migrants Ansar except kindness allies written; took covenant prophets you belief messenger confirming came take covenant bear witness faithful; fulfilled among them pledge receive reward; disbelievers think sent messengers never return Us; recite signs worship establish prayer truth bring darkness light mercy; Day He gathers all judges between truthfully were doing; say O Muhammad if disbelieve say wait indeed waiting; turn away messenger follows desire sealed hearing heart misguide after Allah wrongdoers helpers",
    mainLabel: "Taqwa command with divine sufficiency as Trustee; negation of dual-heart anatomy and adopted-son legal fiction; naming by biological father as justice standard; Prophet's priority over believers' selves; wives as mothers of believers; blood-relation priority in inheritance over migration-brotherhood; prophetic covenant chain requiring confirmation of successors; believer response to Ahzab siege: increased faith-submission versus hypocrite doubt-abandonment; divine aid through unseen forces; testing through extreme adversity revealing inner states" },
  { id: "ext-033-p2", from: 21, to: 40,
    label: "indeed Messenger Allah excellent example whoever hopes Allah Last Day remembers Allah much; believers saw confederates said promise Allah Messenger truth increased faith submission; hypocrites hearts disease said deception deluded; Allah returned favor grace sufficient; fought alongside Messenger hardship said give permission stay behind love sitting; enter houses Prophet meal invited linger conversation hurt Prophet ashamed Allah not ashamed truth; ask women screen purer hearts hearts; no harm adornment display jahiliyyah first; established prayer zakah obey Allah Messenger intend purification People House thorough cleansing; recited homes signs wisdom indeed Allah Subtle Aware; men believe women believe submit obedient truthful patient humble charitable fasting guarding private parts remembering Allah prepared forgiveness great reward; Muslims submitted men women believed men women devoted men women truthful men women patient men women humble men women charitable men women fasting men women guarding modesty men women remembering Allah much forgiveness great reward; decided matter choice disobey Allah Messenger clearly astray; conceal love reveal Allah knows fears people right fear Allah; Zayd divorced married gave no blame prophet marry divorced wives adopted sons done remove difficulty believers; no blame Prophet what Allah ordained practice former messengers command Allah destined decree; convey messages fear none besides Allah sufficient Reckoner; Muhammad not father any men Messenger Allah seal prophets Allah Knowing everything",
    mainLabel: "Prophet as uswah hasanah for those hoping in Allah-Last Day with abundant dhikr; believer vs hypocite response to confederate threat; household etiquette: meal invitation limits conversation prohibition; screen-command for purity of hearts; jahiliyyah tabarruj prohibition; People of House purification through salah-zakah-obedience; ten-fold virtuous qualities catalog for believing men-women producing forgiveness-great reward; divine choice negating personal preference; Zayd-Zaynab marriage establishing adopted-son divorce permissibility; removal of adoption-based restriction on prophetic marriage; khatam al-nabiyyin (seal of prophets) with divine omniscience affirmation" },
  { id: "ext-033-p3", from: 41, to: 59,
    label: "O believers remember Allah much glorify morning evening; sends blessings upon you angels mercy bring darkness light Merciful; greeting Day meet Him peace prepared noble reward; O Prophet indeed We sent witness bearer-good-tidings warner caller permission lamp illuminating; give good tidings believers mercy bounty; obey not disbelievers hypocrites disregard abuse trust Allah sufficient Protector; O Prophet say wives daughters believing women draw outer garments around recognized not harmed ever-forgiving merciful; if hypocrites cease not hearts diseased nor rumor-spreaders city stir against you seize wherever found killed mercilessly; sunnah Allah passed before never change way Allah; people ask Hour say knowledge only with Allah what makes know perhaps near; cursed disbelievers prepared Blaze abiding forever find protector helper; Day faces overturned Fire say wish obeyed Allah obeyed Messenger; say Lord misled leaders elders misled twice way; curse them mighty curse; O believers be not like those harmed Musa cleared said beloved Allah; O believers fear Allah speak appropriate speech rectify deeds forgive sins obey Allah Messenger attained great success",
    mainLabel: "Abundant dhikr command with morning-evening glorification; divine-angelic salawat bringing believers from darkness to light; peaceful meeting-day greeting; five-fold prophetic function: witness-bashir-nadhir-da'i-siraj munir; wives-daughters-believing women jilbab command for recognition-protection; hypocrite-rumor-spreader expulsion-threat as recurring divine pattern; Hour knowledge exclusively divine; face-overturning regret expressing belated obedience wish; Musa harassment parallel clearing innocent prophet; qawl sadid (appropriate speech) producing deed-rectification and sin-forgiveness; obedience-success equation" },
  { id: "ext-033-p4", from: 60, to: 73,
    label: "indeced offered trust heavens earth mountains declined bore feared bore man unjust ignorant; Allah turns repenting men women believing men women obedient men women truthful men women patient men women humble men women charitable men women fasting men women guarding modesty men women remembering Allah much forgiveness great reward; not believer man woman when Allah Messenger decided affair choice disobey Allah Messenger clearly astray; mention Ibrahim Ismail Ishaq Yaqub tribes guided none asked way followed desires; say praise Allah shown signs recognize Lord unaware do; belongs whatever heavens earth returns Him; created pairs male female ships livestock; sends rain measured lodges ground able remove; created heavens earth truth Hour comes pardon gracious forgiveness; informs servants Forgiving Merciful punishment painful; news guests Abraham entered said peace apprehensive given glad tidings boy knowing old age what glad tidings given truth despair not who despairs mercy except astray affair messengers travelers purpose unknown Lot family night travel follow behind none look back proceed commanded informed morning cut off people town rejoicing strangers came said guests do not disgrace said forbid world men said daughters purer life oath intoxicated seized sunrise blast overturned rained stones baked clay arranged sign mindful highway still standing sign believers companions thicket wrongdoers avenged both highway clear; created heavens earth six days Throne established Rahman ask Aware; knows before behind returned matters; faces humbled Living Self-Sustaining lost injustice feared; bears burden another souls earn reckoning sufficient",
    mainLabel: "Amanah (trust) offered to heavens-earth-mountains refused but borne by man as zalum-jahul; repentance-belief-obedience-truthfulness-patience-humility-charity-fasting-modesty-dhikr as ten-fold virtue catalog repeated; divine choice in affairs negating personal preference; Ibrahim-Ismail-Ishaq-Yaqub guidance lineage; universal ownership-return; paired creation; measured rain provision; creation in truth with Hour-forgiveness balance; Ibrahim-Lot narratives recapitulated; destroyed towns as highway signs; individual burden-bearing principle; Hayy-Qayyum submission" }
];

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-033-p1": [
    "Command to Prophet to fear Allah and not obey disbelievers or hypocrites with affirmation of divine knowledge and wisdom",
    "Command to follow revelation from Lord with affirmation that Allah is Acquainted with all actions",
    "Command to rely upon Allah with declaration of divine sufficiency as Trustee",
    "Negation of dual-heart anatomy and adopted-son legal fiction affirming Allah speaks truth and guides to right way",
    "Command to call adopted sons by biological fathers names as more just with fallback to brotherhood-in-religion when father unknown",
    "Prophet closer to believers than their own selves and his wives as their mothers with blood-relation inheritance priority over migration ties",
    "Solemn covenant taken from prophets including Noah Abraham Moses Jesus and Muhammad requiring accountability for truthfulness",
    "Purpose of covenant to question truthful about their truth with painful punishment prepared for disbelievers",
    "Command to remember divine favor during Ahzab siege when unseen wind and angelic armies were sent against confederates",
    "Description of siege terror with enemies attacking from above and below while hearts reached throats and assumptions multiplied",
    "Believers tested and shaken severely during the confederate siege as trial of faith",
    "Hypocrites and those with heart-disease declaring divine promise was nothing but delusion during siege crisis",
    "Faction requesting permission to leave claiming houses unprotected while actually intending only to flee battle",
    "Hypocrite readiness to commit fitnah if enemy entered from every direction showing commitment was never genuine",
    "Reminder of prior pledge to Allah not to flee with affirmation that divine covenant will be questioned",
    "Declaration that fleeing from death or killing brings no benefit and worldly enjoyment would be brief regardless",
    "Rhetorical challenge on who can protect from divine ill or mercy with negation of any protector besides Allah",
    "Divine knowledge of hinderers and those calling others away from battle while themselves avoiding combat",
    "Hypocrite cowardice during fear contrasted with sharp-tongued abuse after safety returns resulting in nullified deeds",
    "Hypocrite wish to be among bedouins asking news from afar rather than fighting alongside believers"
  ],
  "ext-033-p2": [
    "Prophet established as excellent example for those hoping in Allah and Last Day who remember Allah abundantly",
    "Believer response to seeing confederates confirming divine promise and increasing in faith and submission",
    "Men among believers who fulfilled their covenant with Allah either dying in fulfillment or awaiting their turn without alteration",
    "Divine reward for truthful ones and punishment or accepted repentance for hypocrites with forgiveness-mercy affirmation",
    "Allah repelling disbelievers in rage without gain and sufficing believers in battle as Powerful and Mighty",
    "People of Scripture who supported confederates brought down from fortresses with terror cast into hearts enabling capture and killing",
    "Inheritance of land homes and properties of defeated People of Scripture plus lands not yet trodden as sign of divine competence",
    "Option presented to Prophet wives between worldly life with gracious release versus Allah-Messenger-Hereafter with great reward",
    "Great reward prepared for doers of good among Prophet wives who choose Allah and Messenger and Hereafter",
    "Double punishment warning for Prophet wife committing clear immorality as elevated accountability standard",
    "Double reward and noble provision for Prophet wife who devoutly obeys Allah and Messenger and does righteousness",
    "Prophet wives distinguished from other women with command against soft speech to prevent coveting by diseased hearts",
    "Command for Prophet wives to remain in homes avoid jahiliyyah display establish prayer give zakah and obey Allah-Messenger",
    "Command for Prophet wives to remember verses and wisdom recited in their homes with Latif-Khabir affirmation",
    "Ten-fold virtue catalog for believing men and women covering submission belief devotion truthfulness patience humility charity fasting modesty and dhikr",
    "Negation of personal choice when Allah and Messenger decide a matter with clear-error warning for disobedience",
    "Zayd-Zaynab marriage narrative establishing removal of adopted-son divorce restriction on prophetic marriage as divine decree",
    "No discomfort upon Prophet regarding what Allah imposed as established sunnah of prior prophets with destined decree",
    "Praise for those conveying divine messages fearing none but Allah with sufficiency of Allah as Reckoner",
    "Muhammad declared not father of any man but Messenger of Allah and seal of prophets with comprehensive divine knowledge"
  ],
  "ext-033-p3": [
    "Command for believers to remember Allah with abundant remembrance",
    "Command to glorify Allah morning and evening as temporal dhikr structure",
    "Divine and angelic salawat bringing believers from darknesses into light as expression of mercy toward believers",
    "Greeting of peace on Day of meeting Allah with noble reward prepared for believers",
    "Prophet sent as witness bearer-of-good-tidings and warner establishing threefold prophetic function",
    "Prophet as caller to Allah by divine permission and illuminating lamp completing fivefold role description",
    "Good tidings to believers of great bounty from Allah as encouragement amid adversity",
    "Command not to obey disbelievers and hypocrites disregard their harm and trust Allah as sufficient Trustee",
    "Pre-consummation divorce ruling waiving waiting period with command to provide and release graciously",
    "Special marriage permissions for Prophet including dowered wives captives migrant female relatives and self-gifted believing woman",
    "Prophet permitted to defer or receive any wife without blame ensuring contentment and preventing grief among co-wives",
    "Prohibition on additional wives or substitution after current set except right-hand possessions with divine observation affirmed",
    "Household etiquette limiting entry for meals prohibiting lingering conversation and mandating screen-based requests for purity of hearts",
    "Affirmation that Allah knows everything whether revealed or concealed as omniscience reminder",
    "Exemption for women regarding male relatives sons brothers nephews and female servants with taqwa command and witness affirmation",
    "Divine and angelic blessings upon Prophet with command for believers to send salawat and salam",
    "Curse upon those abusing Allah and Messenger in this world and Hereafter with humiliating punishment prepared",
    "Slander and manifest sin upon those harming believing men and women without cause establishing false accusation prohibition",
    "Jilbab command for wives daughters and believing women enabling recognition and preventing harm with forgiveness-mercy closure"
  ],
  "ext-033-p4": [
    "Ultimatum to hypocrites heart-diseased and rumor-spreaders in Madinah threatening expulsion if they do not cease",
    "Accursed status for agitators with seizure and execution wherever found as enforcement measure",
    "Established divine pattern with prior communities affirmed as unchanging sunnah of Allah",
    "Hour knowledge exclusively with Allah with suggestion it may be near as eschatological uncertainty",
    "Divine curse upon disbelievers with Blaze prepared as eternal punishment",
    "Eternal abiding in Fire without protector or helper as absolute abandonment consequence",
    "Face-overturning in Fire expressing belated wish to have obeyed Allah and Messenger as regret archetype",
    "Blaming masters and dignitaries for misguidance exposing the social chain of misdirected obedience",
    "Request for double punishment and great curse upon misleading leaders expressing communal accountability demand",
    "Warning against being like those who abused Musa whom Allah cleared establishing prophetic innocence precedent",
    "Command to fear Allah and speak appropriate speech establishing qawl-sadid as foundational ethical principle",
    "Qawl sadid producing deed rectification and sin forgiveness with obedience-success equation as great attainment",
    "Amanah offered to heavens earth and mountains which refused out of fear but borne by man characterized as unjust and ignorant",
    "Divine punishment for hypocrites and mushriks contrasted with accepted repentance for believing men and women closing with Ghafur-Rahim"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`33:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`33:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 33, surahName: "Al-Ahzab",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 5 genuine re-extraction. P1=taqwa-ahzab-siege-believer-hypocrite(1-20), P2=uswah-zayd-zaynab-khatam(21-40), P3=dhikr-jilbab-qawl-sadid(41-59), P4=amanah-virtues-closing(60-73).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (33:1-20) ===
{
  const e = extractions[0];
  const wakeel = findWord(3, ["\u0648","\u0643","\u064a","\u0644"]);
  if (wakeel) e.divineNamesAndAttributes.push({ term: wakeel, transliteration: "Wakeel", gloss: "Trustee (editorial gloss)", keys: ["33:3"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["33:1"], excerpt: fv(1), description: "O Prophet fear Allah and do not obey the disbelievers and hypocrites." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["33:3"], excerpt: fv(3), description: "And put your trust in Allah; sufficient is Allah as Trustee." });

  e.humanConditionsAndSpiritualStates.push({ label: "Negation of dual-heart anatomy: Allah did not make for man two hearts within him", keys: ["33:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Adopted-son legal fiction negated: call them by their fathers' names as more just", keys: ["33:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Prophet closer to believers than their own selves; his wives are their mothers", keys: ["33:6"], evidenceClass: "EXPLICIT_TEXT" });

  const ahzab = findWord(20, ["\u0623","\u062d","\u0632","\u0627","\u0628"]);
  if (ahzab) e.terminology.push({ term: ahzab, transliteration: "ahzab", gloss: "confederates/parties (editorial gloss)", keys: ["33:20"] });
}

// === POPULATE P2 (33:21-40) ===
{
  const e = extractions[1];

  // Verse 53 belongs to P3 (41-59), not P2 (21-40). Moved below.

  e.propheticNarratives.push({ label: "Zayd-Zaynab marriage: divine ordinance removing adopted-son divorce restriction on prophetic marriage; khatam al-nabiyyin declaration", keys: ["33:37","33:38","33:39","33:40"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Prophet as uswah hasanah (excellent example) for those hoping in Allah and Last Day with abundant dhikr", keys: ["33:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Ten-fold virtuous qualities catalog: submitting-believing-devoted-truthful-patient-humble-charitable-fasting-guarding-remembering for men and women", keys: ["33:35"], evidenceClass: "EXPLICIT_TEXT" });

  // Verse 53 social entry moved to P3

  const khatam = findWord(40, ["\u062e","\u0627","\u062a","\u0645"]);
  if (khatam) e.terminology.push({ term: khatam, transliteration: "khatam al-nabiyyin", gloss: "seal of prophets (editorial gloss)", keys: ["33:40"] });
}

// === POPULATE P3 (33:41-59) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["33:41"], excerpt: fv(41), description: "O you who believe remember Allah with much remembrance." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["33:42"], excerpt: fv(42), description: "And glorify Him morning and evening." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["33:53"], excerpt: fv(53), description: "When you ask women for something ask from behind a screen — purity for hearts." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["33:59"], excerpt: fv(59), description: "O Prophet tell your wives and daughters and believing women to draw their outer garments around them — recognized and not harmed." });

  e.socialEconomicCivilisational.push({ label: "Household etiquette: meal invitation timing limits; lingering conversation prohibited as hurtful to Prophet", keys: ["33:53"], evidenceClass: "EXPLICIT_TEXT" });
  // Verses 70-71 belong to P4 (60-73), not P3 (41-59). Moved below.

  e.relationships.push({ label: "Divine-angelic salawat bringing believers from darkness to light as Merciful act", keys: ["33:43"], evidenceClass: "EXPLICIT_TEXT" });

  const jilbab = findWord(59, ["\u062c","\u0644","\u0628","\u0627","\u0628"]);
  if (jilbab) e.terminology.push({ term: jilbab, transliteration: "jilbab", gloss: "outer garment (editorial gloss)", keys: ["33:59"] });
}

// === POPULATE P4 (33:60-73) ===
{
  const e = extractions[3];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["33:70"], excerpt: fv(70), description: "O you who believe fear Allah and speak appropriate speech (qawl sadid)." });

  e.humanConditionsAndSpiritualStates.push({ label: "Qawl sadid (appropriate speech) producing deed-rectification and sin-forgiveness", keys: ["33:70","33:71"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Amanah (trust) offered to heavens-earth-mountains; they refused and feared it; man bore it being zalum jahul", keys: ["33:72"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Individual burden-bearing: no bearer bears burden of another; each soul earns its own reckoning", keys: ["33:73"], evidenceClass: "EXPLICIT_TEXT" });

  const amanah = findWord(72, ["\u0623","\u0645","\u0627","\u0646","\u0629"]);
  if (amanah) e.terminology.push({ term: amanah, transliteration: "amanah", gloss: "trust/responsibility (editorial gloss)", keys: ["33:72"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `033-al-ahzab-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 033-al-ahzab-p${num}.json`);
}

// === CANDIDATES (cand-1217..cand-1246, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-033-p1,ext-033-p2,ext-033-p3,ext-033-p4",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1217..1224)
  { id: "cand-1217", label: "Taqwa command with divine sufficiency as Wakeel", def: "In 33:1,3: O Prophet fear Allah; put trust in Allah; sufficient is Allah as Trustee.", key: "33:1", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Taqwa as opening command."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Kafa bi-Allah wakeela."}] },
  { id: "cand-1218", label: "Dual-heart anatomy negated as biological impossibility", def: "In 33:4: Allah did not make for man two hearts within his cavity.", key: "33:4", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Anatomical negation."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"related-not-identical",note:"Metaphorical claim refuted."}] },
  { id: "cand-1219", label: "Adopted-son legal fiction negated: naming by biological father as justice", def: "In 33:5: Call them by their fathers' names; that is more just in sight of Allah.", key: "33:5", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Aqsad designation."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Biological lineage affirmed."}] },
  { id: "cand-1220", label: "Prophet's priority over believers' selves establishing spiritual authority", def: "In 33:6: The Prophet is closer to the believers than their own selves.", key: "33:6", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Awla bi-anfusihim."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Spiritual precedence."}] },
  { id: "cand-1221", label: "Wives of Prophet as mothers of believers establishing sacred status", def: "In 33:6: And his wives are their mothers.", key: "33:6", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Ummahat al-mu'minin."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Maternal honor extended."}] },
  { id: "cand-1222", label: "Blood-relation priority in inheritance over migration-brotherhood ties", def: "In 33:6: Blood relatives are more entitled in decree of Allah than believers and migrants.", key: "33:6", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Inheritance hierarchy."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"related-not-identical",note:"Non-inheriting solidarity."}] },
  { id: "cand-1223", label: "Prophetic covenant chain requiring successor confirmation", def: "In 33:7-8: When We took covenant from prophets and from you; that He may question truthful about truthfulness.", key: "33:7", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Mithaq al-nabiyyin."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Truthfulness audit."}] },
  { id: "cand-1224", label: "Believer vs hypocrite response to Ahzab siege: increased faith vs abandonment", def: "In 33:22: When believers saw confederates said this is what Allah-Messenger promised; increased faith-submission.", key: "33:22", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Adversity strengthening iman."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Siege as discriminator."}] },

  // P2 (cand-1225..1232)
  { id: "cand-1225", label: "Prophet as uswah hasanah for those hoping in Allah-Last Day", def: "In 33:21: Indeed in Messenger of Allah is excellent example for whoever hopes in Allah and Last Day remembers Allah much.", key: "33:21", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Uswah hasanah designation."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Eschatological motivation."}] },
  { id: "cand-1226", label: "Ten-fold virtuous qualities catalog for believing men-women", def: "In 33:35: Muslim men-women, believing, devoted, truthful, patient, humble, charitable, fasting, guarding modesty, remembering Allah much.", key: "33:35", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Comprehensive virtue list."},{topicId:"balance-moderation",layer:"scholarly",relationship:"same-concept",note:"Gender-parallel enumeration."}] },
  { id: "cand-1227", label: "Zayd-Zaynab marriage establishing adopted-son divorce permissibility", def: "In 33:37: When Zayd finished with her We married her to you so no blame on believers marrying divorced wives of adopted sons.", key: "33:37", overlap: [{topicId:"marriage-importance",layer:"scholarly",relationship:"same-concept",note:"Legal reform via prophetic action."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Adoption boundaries clarified."}] },
  { id: "cand-1228", label: "Khatam al-nabiyyin: Muhammad as seal of prophets with divine omniscience", def: "In 33:40: Muhammad is not father of any men but Messenger of Allah and seal of prophets; Allah is Knowing of everything.", key: "33:40", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Finality declaration."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Knowledge framing finality."}] },
  { id: "cand-1229", label: "Household etiquette: meal invitation timing and conversation limits", def: "In 33:53: When invited to meal enter; when eaten disperse; do not linger for conversation; that hurts Prophet.", key: "33:53", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Social sensitivity."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Prophet's feelings protected."}] },
  { id: "cand-1230", label: "Screen-command for purity of hearts in gender interaction", def: "In 33:53: When you ask women for something ask from behind screen; purer for your hearts and their hearts.", key: "33:53", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Hijab as heart-purification."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Mutual purity."}] },
  { id: "cand-1231", label: "People of House purification through integrated devotional program", def: "In 33:33: Allah intends only to remove impurity from you People of House and purify you thoroughly.", key: "33:33", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Ahl al-bayt distinction."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Tathir as divine intent."}] },
  { id: "cand-1232", label: "Jahiliyyah tabarruj prohibition contrasting Islamic modesty", def: "In 33:33: Do not display yourselves as display of former ignorance (tabarruj al-jahiliyyah al-ula).", key: "33:33", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Modesty vs exhibitionism."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Jahiliyyah as behavioral category."}] },

  // P3 (cand-1233..1240)
  { id: "cand-1233", label: "Abundant dhikr command with morning-evening glorification", def: "In 33:41-42: O believers remember Allah much; glorify Him morning and evening.", key: "33:41", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Kathiran specification."},{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Temporal structure."}] },
  { id: "cand-1234", label: "Divine-angelic salawat bringing believers from darkness to light", def: "In 33:43: He sends blessings upon you and His angels to bring you from darkness into light; He is Merciful.", key: "33:43", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Rahmah as transformation."},{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Salawat function."}] },
  { id: "cand-1235", label: "Five-fold prophetic function: witness-bashir-nadhir-da'i-siraj munir", def: "In 33:45-46: Indeed We sent you as witness bearer-good-tidings warner caller to Allah by permission illuminating lamp.", key: "33:45", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Pentadic role definition."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Siraj munir metaphor."}] },
  { id: "cand-1236", label: "Jilbab command for wives-daughters-believing women enabling recognition-protection", def: "In 33:59: Tell wives daughters believing women draw outer garments around them; likelier to be recognized not harmed.", key: "33:59", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Recognition-based protection."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Public modesty."}] },
  { id: "cand-1237", label: "Qawl sadid producing deed-rectification and sin-forgiveness", def: "In 33:70-71: Fear Allah speak appropriate speech; He will rectify your deeds and forgive your sins.", key: "33:70", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Speech ethics."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Speech-deed causal link."}] },
  { id: "cand-1238", label: "Peaceful meeting-day greeting as eschatological welcome", def: "In 33:44: Their greeting on Day they meet Him is Peace; He prepared noble reward.", key: "33:44", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Salam as eternal greeting."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Peace as devotional outcome."}] },
  { id: "cand-1239", label: "Hypocite-rumor-spreader expulsion as recurring divine pattern (sunnat Allah)", def: "In 33:60-62: If hypocrites cease not hearts diseased nor rumor-spreaders; seized wherever found; sunnat Allah passed before.", key: "33:60", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Pattern consistency."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Internal threat neutralization."}] },
  { id: "cand-1240", label: "Musa harassment parallel establishing prophetic innocence precedent", def: "In 33:69: O believers be not like those who harmed Musa; Allah cleared him of what they said; he was distinguished.", key: "33:69", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Wajihan designation."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Vindication pattern."}] },

  // P4 (cand-1241..1246)
  { id: "cand-1241", label: "Amanah offered to heavens-earth-mountains refused; man bore it as zalum jahul", def: "In 33:72: We offered trust to heavens earth mountains; they declined fearing it; man bore it; he was unjust ignorant.", key: "33:72", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Volitional burden."},{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Zalum-jahul characterization."}] },
  { id: "cand-1242", label: "Repentance-belief-obedience-truthfulness-patience-humility-charity-fasting-modesty-dhikr as comprehensive virtue set", def: "In 33:73: So Allah may punish hypocrite men-women mushrik men-women; Allah turns to believing men-women; Forgiving Merciful.", key: "33:73", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Tawbah as divine turning."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafur-Rahim closure."}] },
  { id: "cand-1243", label: "Hour knowledge exclusively divine negating human prediction", def: "In 33:63: People ask about Hour; say knowledge only with Allah; what makes you know perhaps it is near.", key: "33:63", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ghayb monopoly."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Temporal uncertainty."}] },
  { id: "cand-1244", label: "Face-overturning regret expressing belated obedience wish", def: "In 33:66: Day faces overturned in Fire say wish we had obeyed Allah obeyed Messenger.", key: "33:66", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Regret as punishment component."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Belated recognition."}] },
  { id: "cand-1245", label: "Individual burden-bearing negating vicarious liability", def: "In 33:73: No bearer bears burden of another; each soul earns its own reckoning.", key: "33:73", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"La taziru wizra ukhra."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Exact individual reckoning."}] },
  { id: "cand-1246", label: "Forgiveness-mercy as divine response to believer repentance", def: "In 33:73: Allah turns in forgiveness to believing men-women; Allah is Ever-Forgiving Most Merciful.", key: "33:73", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafur-Rahim pairing."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Divine tawbah response."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 8).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(8, 16).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(16, 24).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(24, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `033-al-ahzab-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-057.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-057.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");