// MFD-11 Wave 4: Surah 25 (Al-Furqan) genuine re-extraction.
// Covers 25:1–77 in 3 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "025-0001-0077.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 25:${n} not found`);
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

console.log("Generating Surah 25 (Al-Furqan) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T13:45:00.000Z";

// P1: 25:1–34 — Furqan declaration, disbeliever objections refuted, gradual revelation wisdom
// P2: 25:35–54 — Prophetic destruction narratives, shadow-wind-water signs, desire-as-god
// P3: 25:55–77 — Servant-of-Rahman attributes, repentance transformation, closing supplication

const PASSAGES = [
  { id: "ext-025-p1", from: 1, to: 34,
    label: "Blessed sent down Criterion upon Servant warner worlds; belongs dominion heavens earth not taken son partner dominion created everything measured precisely; taken besides Him gods create nothing created possess harm benefit death life resurrection; disbelieve say falsehood invented another people assisted injustice lie; say legends former peoples written dictated morning afternoon; say revealed He who knows secret heavens earth Forgiving Merciful; say messenger eats food walks markets why not sent angel warner; treasure presented garden eats; wrongdoers say follow bewitched man; look strike comparisons strayed cannot find way; blessed willed made better gardens rivers flow palaces; nay denied Hour prepared fire blazing chains yokes necks bound together; see Hellfire hear raging roaring; thrown narrow place bound hands call destruction today call many destructions; believed righteous Gardens beneath rivers flow eternal therein pure spouses shade abiding; Day wrongdoer bites hands says wish taken path Messenger; woe wish not taken so-and-so friend; led astray remembrance after came me Satan ever betrayer; said Lord people took Quran abandoned thing; thus made every prophet enemy sinners sufficient Lord guide helper; not sent Book except strengthen heart recited distinctly; bring example truth better explanation; those gathered Hell dragged faces taste Fire; gave Musa Scripture appointed brother Harun minister; said go people denied signs destroyed destruction; Nuh denied drowned sign mankind prepared painful punishment; Aad Thamud companions well generations between presented examples destroyed total destruction; passed town showered evil rain not seen not expect resurrection",
    mainLabel: "Furqan (Criterion) sent down as universal warning; divine sovereignty without son-partner-creation-measure; idol incapacity through creation-harm-benefit negation; forgery accusation answered by divine secret-knowledge; prophet humanity objection countered by prior messenger pattern; gradual revelation (tartilan) strengthening prophetic heart; comparison-making as misguidance marker; blessed alternative creation demonstrating divine capacity; Hour denial met with prepared blazing fire; chained-dragged punishment imagery; believer reward: gardens pure spouses eternal shade; regretful wrongdoer biting hands blaming false friend; satanic betrayal acknowledged; Quran abandonment as communal failure; distinctive recitation as heart-strengthening mechanism; seven destruction narratives establishing historical precedent" },
  { id: "ext-025-p2", from: 35, to: 54,
    label: "Musa Scripture appointed brother Harun minister; said go people denied signs destroyed destruction; Nuh denied drowned sign mankind prepared painful punishment; Aad Thamud companions well generations between presented examples destroyed total destruction; passed town showered evil rain not seen not expect resurrection; see take ridicule saying this one Allah sent messenger; almost misled gods steadfast; know when see punishment who astray; seen takes god desire responsible him; think most hear reason like livestock more astray way; considered Lord extends shadow willed stationary made sun indicator; made night covering day awakening; sent winds heralds mercy sent sky pure water revive dead land give drink creation cattle men abundant; distributed among them remember majority refuse ingratitude; willed sent every city warner; obey disbelievers great striving; separated two seas sweet palatable salty bitter placed barrier partition; created human water established lineage marriage relationship Lord ever powerful; worship besides Allah neither benefit harm assistant disbeliever against Lord; sent warner glad tidings ask wage except whoever wills path Lord; rely Living dies praise sufficient Aware sins servants informed Created heavens earth between six days Throne established Most Merciful ask Aware; said prostrate Rahman say prostrate commanded increases aversion; blessed placed constellations heaven lamp moon light; alternated night day reminder wants grateful; created servants Rahman walk earth gently ignorant address peace; spend night prostrating standing Lord; say turn punishment Jahannam evil settlement residence; spent neither wasteful stingy moderate between; invoke besides Allah kill soul forbidden except right commit immorality transgress multiply punishment Day Resurrection abide humiliated",
    mainLabel: "Musa-Harun dual mission to deniers ending in total destruction; Nuh drowning as lasting human sign; Aad-Thamud-well-companions sequential destruction catalog; evil-rain town as observable warning; prophetic ridicule exposing critic arrogance; desire-as-deity identifying root misguidance; livestock comparison for unreasoning masses; shadow-sun-night-day cycle as temporal management signs; wind-rain-water provision system reviving dead land; sea separation maintaining ecological balance; human creation from water establishing kinship-marriage bonds; divine self-sufficiency negating need for intermediaries; Prophet sent without wage demand; tawakkul upon Hayy La Yamut as existential anchor; sujud rejection increasing aversion; celestial architecture with constellations-lamp-moon; night-day alternation enabling gratitude; Ibad al-Rahman introduction: gentle walking peaceful response to ignorance; nocturnal sujud-qiyam devotion; moderation in spending avoiding israf-taqtir; shirk-murder-zina as compound major sins with multiplied punishment" },
  { id: "ext-025-p3", from: 55, to: 77,
    label: "Except repent believe righteous work Allah replace evil deeds good ever Forgiving Merciful; repents does righteousness turns Allah accepted repentance; testify falsehood pass near ill speech pass dignity; reminded verses Lord fall deaf blind; say Lord grant wives offspring comfort eyes make example righteous; awarded Chamber patiently endured received greetings peace; abiding eternally good settlement residence; say what would Lord care supplication denied denial going be inevitable",
    mainLabel: "Repentance-belief-righteousness triad transforming evil deeds into good through divine replacement; accepted tawbah conditioned on behavioral reform; falsehood-testimony avoidance and dignified passage past laghw; verse reception with attentive engagement not deaf-blindness; family comfort supplication (qurrat a'yun) linking domestic blessing to righteous leadership; Chamber (al-Ghurfah) as elevated reward for patient endurance; eternal greeting-peace abode; closing rhetorical challenge: divine care contingent on supplication; denial producing inevitable consequence" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`25:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`25:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 25, surahName: "Al-Furqan",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 4 genuine re-extraction. P1=Furqan-objections-revelation-destruction-intro(1-34), P2=destruction-narratives-signs-desire-shirk-major-sins(35-54), P3=repentance-Ibad-al-Rahman-closing(55-77). Note: Ibad al-Rahman attributes span P2-P3 boundary but core ethical attributes (55-77) placed in P3.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (25:1-34) ===
{
  const e = extractions[0];
  const ghafur = findWord(6, ["\u063a","\u0641","\u0648","\u0631"]);
  const rahman = findWord(6, ["\u0631","\u062d","\u0645","\u0646"]);
  if (ghafur) e.divineNamesAndAttributes.push({ term: ghafur, transliteration: "Ghafur", gloss: "Forgiving (editorial gloss)", keys: ["25:6"] });
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Merciful (editorial gloss)", keys: ["25:6"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["25:30"], excerpt: fv(30), description: "Our people have taken this Quran as something abandoned (mahjuran) — lament of neglected revelation." });

  // Destruction narratives (25:36-40) moved to P2 where they belong

  e.humanConditionsAndSpiritualStates.push({ label: "Gradual revelation (tartilan) as heart-strengthening pedagogical design", keys: ["25:32"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Regretful wrongdoer biting hands blaming false companion for misguidance", keys: ["25:27","25:28","25:29"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Satanic betrayal acknowledged by wrongdoers: Satan was ever a betrayer (khadhulan)", keys: ["25:29"], evidenceClass: "EXPLICIT_TEXT" });

  const furqan = findWord(1, ["\u0641","\u0631","\u0642"]);
  if (furqan) e.terminology.push({ term: furqan, transliteration: "furqan", gloss: "Criterion/distinction (editorial gloss)", keys: ["25:1"] });
}

// === POPULATE P2 (25:35-54) ===
{
  const e = extractions[1];
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["25:43"], excerpt: fv(43), description: "Have you seen the one who takes his own desire as his god? — implicit prohibition of hawa-worship." });

  e.propheticNarratives.push({ label: "Musa-Harun dual mission to deniers resulting in complete destruction", keys: ["25:35","25:36"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Seven destruction narratives: Nuh drowning, Aad, Thamud, well-companions, evil-rain town — sequential historical warnings", keys: ["25:36","25:37","25:38","25:39","25:40"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Desire-as-deity (ittakhadha ilahahu hawah) as root cause of misguidance beyond animal level", keys: ["25:43","25:44"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Shadow-sun-night-day cycle as continuous temporal management signs", keys: ["25:45","25:47"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Sea separation maintaining sweet-salty ecological balance with barrier partition", keys: ["25:53"], evidenceClass: "EXPLICIT_TEXT" });

  const hawa = findWord(43, ["\u0647","\u0648","\u0649"]);
  if (hawa) e.terminology.push({ term: hawa, transliteration: "hawa", gloss: "desire/whim (editorial gloss)", keys: ["25:43"] });
}

// === POPULATE P3 (25:55-77) ===
{
  const e = extractions[2];
  const hayy = findWord(58, ["\u062d","\u064a"]);
  const ghafur2 = findWord(70, ["\u063a","\u0641","\u0648","\u0631"]);
  const rahman2 = findWord(70, ["\u0631","\u062d","\u0645","\u0646"]);
  if (hayy) e.divineNamesAndAttributes.push({ term: hayy, transliteration: "Hayy", gloss: "Ever-Living (editorial gloss)", keys: ["25:58"] });
  if (ghafur2) e.divineNamesAndAttributes.push({ term: ghafur2, transliteration: "Ghafur", gloss: "Forgiving (editorial gloss)", keys: ["25:70"] });
  if (rahman2) e.divineNamesAndAttributes.push({ term: rahman2, transliteration: "Rahman", gloss: "Merciful (editorial gloss)", keys: ["25:70"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["25:68"], excerpt: fv(68), description: "Do not invoke with Allah another deity nor kill the soul Allah has forbidden nor commit zina." });

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["25:74"], excerpt: fv(74), description: "Our Lord grant us from our wives and offspring comfort to our eyes and make us an example for the righteous." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["25:63"], excerpt: fv(63), description: "Servants of Rahman walk upon earth gently; when ignorant address them they say peace." });

  e.humanConditionsAndSpiritualStates.push({ label: "Repentance-belief-righteousness triad transforming evil deeds into good through divine replacement (tabdil)", keys: ["25:70"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Ibad al-Rahman ethical profile: gentle walking, peaceful response, nocturnal devotion, moderate spending, dignified silence", keys: ["25:63","25:64","25:67","25:72"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Family comfort (qurrat a'yun) linked to righteous leadership aspiration", keys: ["25:74"], evidenceClass: "EXPLICIT_TEXT" });

  const ibad = findWord(63, ["\u0639","\u0628","\u0627","\u062f"]);
  if (ibad) e.terminology.push({ term: ibad, transliteration: "ibad", gloss: "servants/devotees (editorial gloss)", keys: ["25:63"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `025-al-furqan-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 025-al-furqan-p${num}.json`);
}

// === CANDIDATES (cand-0967..cand-0996, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-025-p1,ext-025-p2,ext-025-p3",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0967..0976)
  { id: "cand-0967", label: "Furqan as Criterion distinguishing truth from falsehood for universal warning", def: "In 25:1: Blessed is He who sent down the Criterion (al-Furqan) upon His Servant that he may be to the worlds a warner.", key: "25:1", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Furqan as revelatory function."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Nadhir lil-alamin."}] },
  { id: "cand-0968", label: "Divine sovereignty without son or partner affirmed through creation-measure", def: "In 25:2: Dominion of heavens earth; not taken son nor partner; created everything measured it precisely.", key: "25:2", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Malik-muqaddir pairing."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Walad-sharik negation."}] },
  { id: "cand-0969", label: "Idol incapacity demonstrated through creation-harm-benefit-death-life negation", def: "In 25:3: Taken besides Him gods which create nothing while created; possess not harm benefit death life resurrection.", key: "25:3", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Five-fold incapacity."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Functional divinity criteria."}] },
  { id: "cand-0970", label: "Forgery accusation answered by divine secret-knowledge attribute", def: "In 25:6: Say it has been revealed by He who knows every secret within heavens and earth; Forgiving Merciful.", key: "25:6", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Ghayb-knowledge as authentication."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Sirr omniscience."}] },
  { id: "cand-0971", label: "Gradual revelation (tartilan) as heart-strengthening pedagogical design", def: "In 25:32: Why not sent down at once? Thus to strengthen your heart thereby; We recited it distinctly.", key: "25:32", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Tartil as pacing mechanism."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Gradual strengthening."}] },
  { id: "cand-0972", label: "Regretful wrongdoer biting hands blaming false companion", def: "In 25:27-29: Wrongdoer bites hands; wish taken path with Messenger; woe wish not taken so-and-so friend; led astray from remembrance.", key: "25:27", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Post-mortem regret."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Companion influence acknowledged."}] },
  { id: "cand-0973", label: "Satanic betrayal acknowledged as khadhulan (ever-betrayer)", def: "In 25:29: Satan was ever a betrayer (kana al-shaytan li-insani kadhulan).", key: "25:29", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Khadhulan as permanent trait."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Betrayal recognized post-facto."}] },
  { id: "cand-0974", label: "Quran abandonment (hijran) as communal failure of reception", def: "In 25:30: Our people have taken this Quran as something abandoned (mahjuran).", key: "25:30", overlap: [{topicId:"quran-preservation",layer:"scholarly",relationship:"related-not-identical",note:"Social neglect vs textual preservation."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Active abandonment."}] },
  { id: "cand-0975", label: "Distinctive recitation (ratatlhu tartilan) as comprehension enabler", def: "In 25:32: We recited it distinctly (wa-rattalnahu tartilan) — paced delivery enabling understanding.", key: "25:32", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Tartil as pedagogical form."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Paced comprehension."}] },
  { id: "cand-0976", label: "Seven destruction narratives establishing irreversible historical precedent", def: "In 25:36-40: Destroyed with complete destruction; Nuh drowned sign mankind; Aad Thamud well-companions; evil-rain town.", key: "25:36", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Tabdir takbiran."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sequential historical evidence."}] },

  // P2 (cand-0977..0986)
  { id: "cand-0977", label: "Desire-as-deity (hawa) as root misguidance below animal cognition", def: "In 25:43-44: Takes desire as god; like livestock rather more astray in way.", key: "25:43", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Internal idolatry."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Below-animal reasoning."}] },
  { id: "cand-0978", label: "Shadow-sun cycle as temporal management sign demonstrating divine control", def: "In 25:45-46: Lord extends shadow could have made stationary; made sun its indicator.", key: "25:45", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Zill-shams dynamic."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Temporal subjection."}] },
  { id: "cand-0979", label: "Wind-rain-water provision system reviving dead land as resurrection analogy", def: "In 25:48-49: Sent winds heralds mercy; sent sky pure water; revive dead land give drink creation cattle men.", key: "25:48", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Botanical revival as ba'th proof."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Water as rahmah manifestation."}] },
  { id: "cand-0980", label: "Sea separation maintaining ecological balance through barrier partition", def: "In 25:53: Two seas sweet palatable salty bitter; placed between them barzakh and partition.", key: "25:53", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Hydrological separation."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Ecological engineering."}] },
  { id: "cand-0981", label: "Human creation from water establishing kinship-marriage social bonds", def: "In 25:54: Created human from water; established lineage and marriage relationship; Lord ever Powerful.", key: "25:54", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Ma' as origin substance."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Nasab-sihr duality."}] },
  { id: "cand-0982", label: "Tawakkul upon Ever-Living Who Does Not Die as existential anchor", def: "In 25:58: Rely upon the Living who does not die; exalt with His praise; sufficient is He Aware of sins.", key: "25:58", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Hayy-la-yamut as tawakkul object."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Immortality-based reliance."}] },
  { id: "cand-0983", label: "Sujud rejection increasing aversion as volitional hardening", def: "In 25:60: Commanded to prostrate to Rahman; say prostrate to what you command? Increases them in aversion.", key: "25:60", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Inverse response to command."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Arrogance amplified."}] },
  { id: "cand-0984", label: "Celestial architecture with constellations-lamp-moon as navigational signs", def: "In 25:61: Blessed who placed constellations in heaven; placed therein lamp and illuminating moon.", key: "25:61", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Buruj-siraj-qamar triad."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Cosmic arrangement."}] },
  { id: "cand-0985", label: "Shirk-murder-zina as compound major sins with multiplied eternal punishment", def: "In 25:68-69: Do not invoke besides Allah nor kill forbidden soul nor commit zina; multiplied punishment abides humiliated.", key: "25:68", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Triple prohibition cluster."},{topicId:"right-to-life",layer:"scholarly",relationship:"same-concept",note:"Nafs muharramah."}] },
  { id: "cand-0986", label: "Prophet sent without wage demand establishing gratuitous mission", def: "In 25:57: Say I do not ask you for any wage; only whoever wills takes path to his Lord.", key: "25:57", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Ajrah negation."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Gratuitous guidance."}] },

  // P3 (cand-0987..0996)
  { id: "cand-0987", label: "Repentance-belief-righteousness triad transforming evil deeds into good", def: "In 25:70: Except those who repent believe do righteous work; Allah replaces their evil deeds with good; Forgiving Merciful.", key: "25:70", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Tabdil al-sayyi'at."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Transformation through tawbah."}] },
  { id: "cand-0988", label: "Accepted repentance conditioned on behavioral reform", def: "In 25:71: Whoever repents and does righteousness indeed turns to Allah with accepted repentance (matanaba).", key: "25:71", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Matanaba as valid return."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Action-confirming tawbah."}] },
  { id: "cand-0989", label: "Falsehood-testimony avoidance and dignified passage past vain speech", def: "In 25:72: Those who do not testify to falsehood; when pass near ill speech pass by with dignity (kariman).", key: "25:72", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Zur avoidance."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Testimonial integrity."}] },
  { id: "cand-0990", label: "Verse reception with attentive engagement not deaf-blindness", def: "In 25:73: When reminded of verses of their Lord do not fall upon them deaf and blind.", key: "25:73", overlap: [{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Active reception."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Engaged listening."}] },
  { id: "cand-0991", label: "Family comfort supplication (qurrat a'yun) linking domestic blessing to righteous leadership", def: "In 25:74: Our Lord grant us from wives offspring comfort to our eyes; make us imam for the righteous.", key: "25:74", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Domestic-dua model."},{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"Imam al-muttaqin aspiration."}] },
  { id: "cand-0992", label: "Chamber (al-Ghurfah) as elevated reward for patient endurance", def: "In 25:75: Awarded the Chamber for what they patiently endured; received with greetings and peace.", key: "25:75", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ghurfah as high station."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr rewarded spatially."}] },
  { id: "cand-0993", label: "Ibad al-Rahman gentle walking as embodied humility", def: "In 25:63: Servants of Rahman walk upon earth gently (hawanan); ignorant address them say peace.", key: "25:63", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Hawn as gait humility."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Physical expression of taqwa."}] },
  { id: "cand-0994", label: "Nocturnal sujud-qiyam as Ibad al-Rahman devotional rhythm", def: "In 25:64: Those who spend night before their Lord prostrating and standing.", key: "25:64", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Layl ibadah."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Night devotion."}] },
  { id: "cand-0995", label: "Moderation in spending avoiding both extravagance and miserliness", def: "In 25:67: Those who when spending are neither wasteful nor stingy but moderate between that.", key: "25:67", overlap: [{topicId:"balance-moderation",layer:"scholarly",relationship:"same-concept",note:"Qawaman bayna dhalik."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Financial equilibrium."}] },
  { id: "cand-0996", label: "Closing rhetorical challenge: divine care contingent on supplication", def: "In 25:77: Say what would my Lord care for you if not for your supplication? You have denied so denial is inevitable.", key: "25:77", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Dua as existential necessity."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Worship as purpose."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `025-al-furqan-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-049.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-049.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
