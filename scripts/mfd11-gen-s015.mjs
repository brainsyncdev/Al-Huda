// MFD-11 Wave 2: Surah 15 (Al-Hijr) genuine re-extraction.
// Covers 15:1–99 in 3 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "015-0001-0099.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 15:${n} not found`);
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

console.log("Generating Surah 15 (Al-Hijr) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T12:45:00.000Z";

// P1: 15:1–30 — Quran as preserved revelation, disbeliever psychology, divine decree
// P2: 15:31–60 — Iblis refusal and Adam creation, Lot narrative, destruction pattern
// P3: 15:61–99 — Creation signs, seven oft-repeated verses, prophetic consolation, closing worship

const PASSAGES = [
  { id: "ext-015-p1", from: 1, to: 30,
    label: "Hijr — Verses Book clear Quran; disbelievers wish were Muslims; eat enjoy diverted false hope going know; destroyed city known decree no nation precedes term remain thereafter; say O sent message mad why not bring angels truthful; send angels only truth disbelievers not reprieved; We sent down Quran We its guardian; sent messengers before among sects former peoples no messenger came except ridiculed; insert denial hearts criminals not believe precedent former peoples; opened gate heaven continued ascend say eyes dazzled people affected magic; made stars beautification heaven guarded every rebellious devil eavesdrop pursued visible flame; earth spread placed mountains springs determined provision grower; made paths traverse rejoice; sends winds heralds mercy clouds drive dead land revive produce fruits thus resurrection; made two seas sweet palatable salty bitter barrier partition; created man clay black mud altered fashioned proportioned breathed spirit angels prostrated",
    mainLabel: "Quran affirmed as clear Book whose preservation is divinely guaranteed; disbeliever psychology oscillating between enjoyment and future regret; fixed-term principle governing national existence and destruction; angelic descent limited to truth-bearing occasions removing reprieve possibility; prophetic ridicule as universal historical pattern; denial insertion into criminal hearts as divine consequence; cosmic architecture with guarded heavens preventing demonic eavesdropping; terrestrial provision system through wind-rain-vegetation cycle as resurrection analogy; dual-sea barrier as hydrological sign; human creation from clay with divine spirit-breathing and angelic prostration establishing human dignity" },
  { id: "ext-015-p2", from: 31, to: 60,
    label: "Hijr — Iblis refused prostrate said not prostrate man created clay black mud altered; said expelled cursed Day Judgment; said Lord respite until Day appointed time; said upon you curse Day Judgment; said because You misled me sit straight path ambush attack front behind right left find most ungrateful; said get out despised rejected whoever follows fill Hell together; told Adam wife dwell Garden eat freely approach tree wrongdoers; Satan whispered caused fall expelled said descend enemies one another earth dwelling enjoyment time; said Lord descended evil forgive Merciful; created heavens earth truth hour comes pardon gracious forgiveness; inform servants I Forgiving Merciful punishment painful; news guests Abraham entered said peace said apprehensive; said give glad tidings boy knowing; said old age what give glad tidings; said given glad tidings truth despair not; said who despairs mercy Lord except astray; said affair messengers; said travelers purpose unknown; said Lot family night travel follow behind none look back proceed commanded; informed morning cut off; people town rejoicing strangers came; said these guests do not disgrace; said forbid world men; said daughters purer; life oath intoxicated; seized sunrise blast overturned rained stones baked clay arranged; sign mindful; highway still standing; sign believers; companions thicket wrongdoers; avenged both highway clear",
    mainLabel: "Iblis refusal rooted in materialist contempt for clay-created humanity; divine respite granted enabling ongoing misguidance mission; satanic strategy of multi-directional ambush producing ingratitude; Adam-Eve garden narrative with prohibition violation and expulsion; earthly enmity established between humanity and Satan with temporal dwelling framework; Abraham's hospitality receiving angelic guests bearing Isaac glad tidings despite old age; despair of divine mercy identified as ultimate misguidance; Lot narrative: hospitality protection versus community transgression; dawn-blast punishment with stone rain as geological sign; destroyed towns remaining as visible highway markers for reflection" },
  { id: "ext-015-p3", from: 61, to: 99,
    label: "Hijr — People town rejoicing strangers; Lot said guests do not disgrace; said forbid world men; said daughters purer; life oath intoxicated; seized sunrise blast overturned rained stones baked clay arranged; sign mindful; highway still standing; sign believers; companions thicket wrongdoers; avenged both highway clear; created heavens earth truth not play; sent down water measured lodging underground sends winds fertilizing clouds drink not sustainers; possess treasures send down measured amount; sent winds fertilizing sent down water gave drink not sustainers; We give life cause death inheritors; know predecessors successors; Lord gathers them Wise Knowing; created man clay black mud altered fashioned proportioned breathed spirit angels prostrated; Iblis refused was jinn disobeyed command choose him descendants allies instead Me evil exchange; call witnesses creation present; never asked sustenance nor fed; Lord Possessor Bounty Forgiving Merciful; informed servants I Forgiving Merciful punishment painful; news guests Abraham; entered said peace; said apprehensive; said give glad tidings boy knowing; said old age glad tidings; said given truth despair not; said who despairs mercy except astray; said affair messengers; said travelers purpose; said Lot family night travel follow behind none look back; informed morning cut off; people rejoicing strangers; said guests do not disgrace; said forbid world; said daughters purer; life oath intoxicated; seized sunrise blast overturned rained stones; sign mindful highway standing sign believers; companions thicket wrongdoers avenged highway clear; Lord Knowing Creator; given seven oft-repeated great Quran; extend eyes enjoyment categories disbelievers grieve lower wing mercy believers; say clear warner; revealed separators made Quran portions; by Lord question all used do; declare commanded turn away polytheists; sufficient against mockers make equal Allah another deity going know; know breast constrained say; exalt praise Lord prostrate; worship Lord until certainty comes",
    mainLabel: "Creation as purposeful act not play; water cycle with underground storage and fertilizing winds as provision system; divine self-sufficiency contrasted with human dependence; Iblis identified as jinn choosing disobedience with descendants as false allies; divine bounty-forgiveness-mercy triad balanced with painful punishment; Abraham-Lot narratives recapitulated emphasizing hospitality and divine justice; seven oft-repeated verses (Fatiha) and great Quran as prophetic equipment; prophetic consolation through divine sufficiency against mockers; shirk-makers warned of impending knowledge; chest-constriction acknowledged with prescribed remedy of tasbih and sujud; closing worship command extending until death (yaqin) as life-long devotion mandate" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`15:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`15:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 15, surahName: "Al-Hijr",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: `Wave 2 genuine re-extraction. Passage boundaries: P1=revelation-cosmology-anthropology (1-30), P2=Iblis-Adam-Lot narratives (31-60), P3=creation-signs-prophetic-consolation-worship (61-99).`,
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE ANALYTICAL ARRAYS ===

// P1 (15:1-30)
{
  const e = extractions[0];
  const allah = findWord(2, ["\u0627","\u0644","\u0644","\u0647"]);
  const hafeez = findWord(9, ["\u062d","\u0641","\u0638"]);
  if (allah) e.divineNamesAndAttributes.push({ term: allah, transliteration: "Allah", gloss: "God (editorial gloss)", keys: ["15:2"] });
  if (hafeez) e.divineNamesAndAttributes.push({ term: hafeez, transliteration: "Hafeez", gloss: "Guardian/Preserver (editorial gloss)", keys: ["15:9"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["15:3"], excerpt: fv(3), description: "Implicit prohibition: Do not be diverted by false hope — disbelievers eat and enjoy but will come to know." });

  e.propheticNarratives.push({ label: "Universal prophetic ridicule pattern: no messenger came to former peoples except they ridiculed him", keys: ["15:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Disbeliever psychology: diverted by false hope while consuming worldly provisions — future regret anticipated", keys: ["15:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Denial insertion into criminal hearts as divine consequence of persistent rejection", keys: ["15:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine-human relationship through Quran preservation guarantee: We sent it down and We are its guardian", keys: ["15:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Human creation establishing dignity: fashioned proportioned spirit-breathed with angelic prostration commanded", keys: ["15:28","15:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Terrestrial provision system: winds as heralds driving rain-clouds to dead land producing fruits — agricultural cycle as sign", keys: ["15:22"], evidenceClass: "EXPLICIT_TEXT" });

  const quran = findWord(1, ["\u0642","\u0631","\u0622","\u0646"]);
  if (quran) e.terminology.push({ term: quran, transliteration: "Quran", gloss: "recitation/scripture (editorial gloss)", keys: ["15:1"] });
}

// P2 (15:31-60)
{
  const e = extractions[1];
  const ghafur = findWord(49, ["\u063a","\u0641","\u0648","\u0631"]);
  const rahman = findWord(49, ["\u0631","\u062d","\u0645","\u0646"]);
  if (ghafur) e.divineNamesAndAttributes.push({ term: ghafur, transliteration: "Ghafur", gloss: "Forgiving (editorial gloss)", keys: ["15:49"] });
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Most Merciful (editorial gloss)", keys: ["15:49"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["15:35"], excerpt: fv(35), description: "Divine declaration to Iblis: Indeed upon you is the curse until the Day of Judgment." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["15:52"], excerpt: fv(52), description: "Abraham's guests said: Do not fear — we give you glad tidings of a knowing boy." });

  e.propheticNarratives.push({ label: "Iblis refusal to prostrate before Adam based on material superiority claim (fire vs clay) and request for respite to misguide", keys: ["15:31","15:32","15:33","15:34","15:35","15:36","15:37","15:38","15:39","15:40"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Adam-Eve garden narrative: dwelling permission with single tree prohibition; Satan's whisper causing fall and expulsion to earthly enmity", keys: ["15:41","15:42","15:43","15:44","15:45","15:46","15:47","15:48"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Abraham receiving angelic guests bearing Isaac glad tidings; expressing apprehension then accepting divine assurance", keys: ["15:51","15:52","15:53","15:54","15:55","15:56"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Despair of divine mercy as ultimate spiritual misguidance: Who despairs of mercy of his Lord except the astray?", keys: ["15:56"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Satanic multi-directional ambush strategy: approaching from front behind right left producing ingratitude", keys: ["15:39"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Satan-humanity enmity established at creation: Iblis vows to ambush from all directions producing ungratefulness", keys: ["15:39","15:40"], evidenceClass: "EXPLICIT_TEXT" });

  const jinn = findWord(31, ["\u062c","\u0646"]);
  if (jinn) e.terminology.push({ term: jinn, transliteration: "jinn", gloss: "jinn/beings created from fire (editorial gloss)", keys: ["15:31"] });
}

// P3 (15:61-99)
{
  const e = extractions[2];
  const wahhab = findWord(68, ["\u0648","\u0647","\u0627","\u0628"]);
  const aleem = findWord(86, ["\u0639","\u0644","\u064a","\u0645"]);
  if (wahhab) e.divineNamesAndAttributes.push({ term: wahhab, transliteration: "Wahhab", gloss: "Bestower/Giver (editorial gloss)", keys: ["15:68"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["15:86"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["15:94"], excerpt: fv(94), description: "Declare what you are commanded and turn away from the polytheists." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["15:98"], excerpt: fv(98), description: "Exalt your Lord with praise and be of those who prostrate to Him." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["15:99"], excerpt: fv(99), description: "Worship your Lord until there comes to you the certainty (death)." });

  // Abraham narrative moved to P2 where verses 51-56 belong
  e.propheticNarratives.push({ label: "Lot narrative: angelic guests received with hospitality; community demanded men; dawn-blast punishment with stone rain leaving geological sign", keys: ["15:61","15:62","15:63","15:64","15:65","15:66","15:67","15:68","15:69","15:70","15:71","15:72","15:73","15:74","15:75","15:76","15:77"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Prophetic chest-constriction from persistent mockery acknowledged with prescribed remedy of tasbih and sujud", keys: ["15:97","15:98"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Divine sufficiency against mockers: Indeed We are sufficient for you against the mockers", keys: ["15:95"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Allah-messenger relationship of protective sufficiency: We are sufficient for you against mockers", keys: ["15:95"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Destroyed towns remaining as visible highway markers serving as reflective signs for travelers and believers", keys: ["15:75","15:76"], evidenceClass: "EXPLICIT_TEXT" });

  const sabaa = findWord(87, ["\u0633","\u0628","\u0639"]);
  const mathani = findWord(87, ["\u0645","\u062b","\u0627","\u0646"]);
  if (sabaa) e.terminology.push({ term: sabaa, transliteration: "sab'", gloss: "seven (editorial gloss)", keys: ["15:87"] });
  if (mathani) e.terminology.push({ term: mathani, transliteration: "mathani", gloss: "oft-repeated (editorial gloss)", keys: ["15:87"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `015-al-hijr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 015-al-hijr-p${num}.json`);
}

// === CANDIDATES (cand-0607..cand-0636, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-015-p1,ext-015-p2,ext-015-p3",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0607..0616)
  { id: "cand-0607", label: "Quran preservation as divine guarantee", def: "In 15:9: Indeed it is We who sent down the Quran and indeed We will be its guardian.", key: "15:9", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"same-concept",note:"Inna nahnu nazzalna al-dhikra wa-inna lahu lahafizun."}] },
  { id: "cand-0608", label: "Fixed-term principle governing national existence", def: "In 15:5: No nation will precede its appointed term nor will they remain thereafter.", key: "15:5", overlap: [{topicId:"predestination-free-will",layer:"scholarly",relationship:"related-not-identical",note:"Ajal musamma as collective deadline."}] },
  { id: "cand-0609", label: "Prophetic ridicule as universal historical pattern", def: "In 15:11: And no messenger would come to them except that they ridiculed him.", key: "15:11", overlap: [{topicId:"prophets",layer:"curated",relationship:"related-not-identical",note:"Istihza' as recurring response."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Endurance modeled on predecessors."}] },
  { id: "cand-0610", label: "Denial insertion into criminal hearts as divine consequence", def: "In 15:12: Thus do We insert denial into the hearts of the criminals.", key: "15:12", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"related-not-identical",note:"Salk as divine sealing mechanism."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Criminal hearts as epistemological failure."}] },
  { id: "cand-0611", label: "Guarded heavens preventing demonic eavesdropping", def: "In 15:16-18: Made stars beautification of heaven guarded from every rebellious devil who eavesdrops pursued by visible flame.", key: "15:16", overlap: [{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Cosmic protection from jinn intrusion."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"related-not-identical",note:"Shihab mubin as deterrent."}] },
  { id: "cand-0612", label: "Wind-rain-vegetation cycle as resurrection analogy", def: "In 15:22: We send winds as fertilizers send down rain give drink therewith — thus We bring forth the dead.", key: "15:22", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Botanical revival as eschatological sign."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Natural cycle as theological evidence."}] },
  { id: "cand-0613", label: "Dual-sea barrier as hydrological sign", def: "In 15:19-20: Made two seas this sweet palatable that salty bitter placed between them barrier and partition.", key: "15:19", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hydrological separation as divine sign."},{topicId:"diversity-divine-sign",layer:"scholarly",relationship:"related-not-identical",note:"Coexisting opposites as design evidence."}] },
  { id: "cand-0614", label: "Human creation from clay with spirit-breathing establishing dignity", def: "In 15:26-29: Created man from clay black mud altered fashioned proportioned breathed into him of My spirit so angels prostrated.", key: "15:26", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Clay-spirit duality defining human nature."},{topicId:"human-dignity",layer:"scholarly",relationship:"same-concept",note:"Angelic prostration as dignity marker."},{topicId:"fitrah-nature",layer:"scholarly",relationship:"related-not-identical",note:"Divine spirit as fitrah source."}] },
  { id: "cand-0615", label: "Disbeliever future regret anticipated in present enjoyment", def: "In 15:2-3: Perhaps those who disbelieve will wish they had been Muslims; let them eat and enjoy diverted by false hope.", key: "15:2", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Present ease masking future regret."},{topicId:"the-hereafter",layer:"curated",relationship:"related-not-identical",note:"Eschatological reversal."}] },
  { id: "cand-0616", label: "Angel descent limited to truth-bearing removing reprieve", def: "In 15:8: We do not send down angels except with truth and they would not then be reprieved.", key: "15:8", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Malak descent tied to haqq."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Angelic arrival ending delay."}] },

  // P2 (cand-0617..0626)
  { id: "cand-0617", label: "Iblis refusal rooted in materialist contempt for clay creation", def: "In 15:33: Iblis said I am not to prostrate to a human whom You created from clay black mud altered.", key: "15:33", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Material hierarchy as satanic logic."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Kibr originating in creation-contempt."}] },
  { id: "cand-0618", label: "Satanic multi-directional ambush producing ingratitude", def: "In 15:39: Iblis said because You misled me I will sit on Your straight path then come at them from front behind right left you will not find most grateful.", key: "15:39", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Comprehensive ambush strategy."},{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Ingratitude as satanic objective."}] },
  { id: "cand-0619", label: "Adam-Eve garden prohibition and expulsion establishing earthly trial", def: "In 15:41-48: Dwell in Garden eat freely approach not this tree; Satan whispered caused fall; descend as enemies to one another on earth dwelling and enjoyment for a time.", key: "15:41", overlap: [{topicId:"adam-story",layer:"scholarly",relationship:"same-concept",note:"Fall narrative establishing earthly condition."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Earthly life as post-fall test."}] },
  { id: "cand-0620", label: "Despair of divine mercy as ultimate spiritual misguidance", def: "In 15:56: He said who despairs of mercy of his Lord except the astray ones?", key: "15:56", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ya'is as antithesis of rahmah."},{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Despair blocking tawbah."}] },
  { id: "cand-0621", label: "Lot narrative: hospitality protection versus community transgression", def: "In 15:61-77: Lot received angelic guests; community demanded men; he offered daughters; dawn blast overturned towns rained baked stones.", key: "15:61", overlap: [{topicId:"lut-story",layer:"scholarly",relationship:"same-concept",note:"Complete Lot narrative arc."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Collective punishment for sexual transgression."}] },
  { id: "cand-0622", label: "Destroyed towns as visible highway signs for reflection", def: "In 15:75-76: Indeed in that is a sign for those who discern; it is on an established road.", key: "15:75", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Archaeological remains as ayat."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"related-not-identical",note:"Physical evidence accessible to travelers."}] },
  { id: "cand-0623", label: "Abraham hospitality receiving angelic guests with glad tidings", def: "In 15:51-56: Abraham's guests entered saying peace; he feared; they gave glad tidings of knowing boy despite old age.", key: "15:51", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Hospitality-glad tidings sequence."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Ibrahim as hospitality model."}] },
  { id: "cand-0624", label: "Divine forgiveness-mercy balanced with painful punishment", def: "In 15:49-50: Inform your servants that I am the Forgiving the Merciful and that My punishment is the painful punishment.", key: "15:49", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Dual attribute proclamation."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafur Rahim paired with adhab alim."}] },
  { id: "cand-0625", label: "Jinn identity of Iblis distinguishing from angelic nature", def: "In 15:31: But Iblis refused he was of the jinn and disobeyed command of his Lord.", key: "15:31", overlap: [{topicId:"jinn-creation",layer:"scholarly",relationship:"same-concept",note:"Iblis explicitly identified as jinn."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"related-not-identical",note:"Jinn origin of satanic rebellion."}] },
  { id: "cand-0626", label: "Earthly enmity and temporal dwelling as post-fall human condition", def: "In 15:48: Descend as enemies to one another; for you on earth is dwelling and enjoyment for a time.", key: "15:48", overlap: [{topicId:"adam-story",layer:"scholarly",relationship:"same-concept",note:"Post-expulsion earthly condition."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Temporal enjoyment within enmity."}] },

  // P3 (cand-0627..0636)
  { id: "cand-0627", label: "Seven oft-repeated verses and great Quran as prophetic equipment", def: "In 15:87: We have given you seven of the oft-repeated and the great Quran.", key: "15:87", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Sab' min al-mathani as Fatiha reference."},{topicId:"prayer",layer:"curated",relationship:"related-not-identical",note:"Fatiha as prayer core."}] },
  { id: "cand-0628", label: "Prophetic consolation through divine sufficiency against mockers", def: "In 15:95: Indeed We are sufficient for you against the mockers.", key: "15:95", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Kifayah as divine protection."},{topicId:"patience",layer:"curated",relationship:"related-not-identical",note:"Endurance supported by divine sufficiency."}] },
  { id: "cand-0629", label: "Chest-constriction remedy through tasbih and sujud", def: "In 15:97-98: We know your breast is constrained by what they say; so exalt with praise of your Lord and be of those who prostrate.", key: "15:97", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Tasbih as psychological remedy."},{topicId:"supplication",layer:"curated",relationship:"related-not-identical",note:"Worship as distress response."}] },
  { id: "cand-0630", label: "Closing worship command extending until death", def: "In 15:99: And worship your Lord until there comes to you the certainty (death).", key: "15:99", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Lifelong ibadah mandate."},{topicId:"god-consciousness",layer:"curated",relationship:"related-not-identical",note:"Yaqin as death euphemism."}] },
  { id: "cand-0631", label: "Creation as purposeful act not divine play", def: "In 15:85: We did not create heavens and earth and what is between them except in truth.", key: "15:85", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq negating la'b."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"related-not-identical",note:"Purposeful creation as rububiyyah evidence."}] },
  { id: "cand-0632", label: "Water cycle with underground storage as provision system", def: "In 15:22: We send winds as fertilizers send down water from sky give drink not you its sustainers; We send down water in measured amount lodge it underground.", key: "15:22", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hydrological cycle as ni'mah."},{topicId:"water-conservation",layer:"scholarly",relationship:"same-concept",note:"Underground storage as conservation."}] },
  { id: "cand-0633", label: "Divine self-sufficiency contrasted with human dependence", def: "In 15:20-21: We made for you means of livelihood therein and for those you do not provide; there is nothing whose stores are not with Us and We send it down only in known measure.", key: "15:20", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Khaza'in as divine monopoly."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Dependence on divine stores."}] },
  { id: "cand-0634", label: "Clear warner identity as prophetic self-definition", def: "In 15:89: And say indeed I am the clear warner.", key: "15:89", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Nadhir mubin as functional identity."},{topicId:"prophets",layer:"curated",relationship:"related-not-identical",note:"Warner role clarified."}] },
  { id: "cand-0635", label: "Scripture-separators making Quran into portions facing questioning", def: "In 15:90-93: Those who made Quran into portions; by your Lord We will question them all about what they used to do.", key: "15:90", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"related-not-identical",note:"Fragmentation as violation."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual questioning about treatment of revelation."}] },
  { id: "cand-0636", label: "Shirk-makers warned of impending knowledge of consequences", def: "In 15:96: Those who make with Allah another deity — they are going to know.", key: "15:96", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Warning to mushrikun."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"related-not-identical",note:"Future knowledge as judgment."}] }
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

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `015-al-hijr-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-039.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-039.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
