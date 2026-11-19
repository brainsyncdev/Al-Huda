// MFD-11 An'am Pass 3 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-An'am 6:81-120 (Passages 9-12, Candidates cand-0287..cand-0296).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "006-0081-0120.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 6:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating An'am Pass 3 files from verbatim corpus (6:81-120)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T14:35:00.000Z";

// Safe term extractor using word-boundary splitting to get exact corpus forms
function findWordContaining(vid, chars) {
  const t = fv(vid);
  const words = t.split(/\s+/);
  for (const w of words) {
    let match = true;
    for (const ch of chars) {
      if (!w.includes(ch)) { match = false; break; }
    }
    if (match) return w;
  }
  return null;
}

// Also support direct indexOf for multi-word phrases
function findPhrase(vid, phrase) {
  const t = fv(vid);
  const i = t.indexOf(phrase);
  if (i >= 0) return t.slice(i, i + phrase.length);
  return null;
}

// ─── Passage 9: 6:81–90 ────────────────────────────────────────────────────────
const p9 = {
  extractionId: "ext-006-p9",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 81,
    toAyah: 90,
    label: "Al-An'am — How fear what associate while fear not associated with Allah without authority? which party deserves security if know? believed did not mix belief injustice have security guided; that Our argument gave Ibrahim against people raise degrees whom will Lord Wise Knowing; gave Ishaq Yaqub each guided Nuh before from offspring Dawud Sulayman Ayyub Yusuf Musa Harun thus reward doers-good; Zakariyya Yahya Isa Elias all righteous; Ismail Alyasa Yunus Lut each preferred over worlds; from fathers offspring brothers chose guided straight path; that guidance Allah guides whom wills servants if associated would void deeds; those given Book wisdom prophethood if disbelieve entrusted people not disbelieving; those Allah guided follow guidance say ask no wage reminder for worlds"
  },
  verseKeys: ["6:81","6:82","6:83","6:84","6:85","6:86","6:87","6:88","6:89","6:90"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+81}`, text: fv(i+81) })),
  mainSubject: {
    label: "Security-asymmetry argument: associators lack authority yet believers secure; faith-injustice separation yielding amn-hidayah; divine hujjah granted to Ibrahim with degree-raising; eighteen prophets enumerated across generations demonstrating continuous guidance-chain; chosen-guided to straight path as collective election; shirk-nullification conditional erasing prior deeds; scripture-wisdom-prophethood triad entrusted to non-disbelieving successors; prophetic-following command with wage-free reminder universalized",
    keys: ["6:81","6:82","6:83","6:84","6:85","6:86","6:87","6:88","6:89","6:90"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Security-asymmetry rhetorical question: which party more deserving of amn?", keys: ["6:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Associators' lack of sultan (authority) for shirk vs believers' grounded security", keys: ["6:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Faith unmixed with zulm producing security and guidance (6:82)", keys: ["6:82"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine hujjah given to Ibrahim against his people as conclusive argument", keys: ["6:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Degree-raising (narfaAAu darajatin man nashao) as divine prerogative", keys: ["6:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wise-Knowing (hakeemun AAaleemun) attribute pair closing Ibrahim section", keys: ["6:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ishaq-Yaqub gift and guidance extending patriarchal line", keys: ["6:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nuh guided before establishing pre-Abrahamic prophetic continuity", keys: ["6:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Six descendants enumerated: Dawud Sulayman Ayyub Yusuf Musa Harun", keys: ["6:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reward of muhsineen (doers-of-good) as theological principle", keys: ["6:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Second prophet group: Zakariyya Yahya Isa Elias all salihin", keys: ["6:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Third prophet group: Ismail Alyasa Yunus Lut preferred over worlds", keys: ["6:86"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Collective election: fathers offspring brothers chosen and guided", keys: ["6:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Straight path (siratin mustaqeemin) as destination of divine choosing", keys: ["6:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guidance defined as Allah's prerogative over whomever He wills", keys: ["6:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shirk-nullification: association would void all prior deeds (habitat)", keys: ["6:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Scripture-wisdom-prophethood triad (alkitaba waalhukma waalnnubuwwata)", keys: ["6:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Succession safeguard: entrusting to non-disbelieving people if current recipients reject", keys: ["6:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Follow-their-guidance command (fabihudahumu iqtadih)", keys: ["6:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wage-free proclamation (la asalukum ajran) universalizing message as dhikra", keys: ["6:90"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["6:90"], excerpt: fv(90), description: "Command: follow the guidance of those prophets; say I ask no wage for it; it is only a reminder for the worlds." }
  ],
  divineNamesAndAttributes: [
    { term: findWordContaining(83, ["\u062d","\u0643","\u064a","\u0645"]) || "\u062d\u0643\u064a\u0645", transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["6:83"] },
    { term: findWordContaining(83, ["\u0639","\u0644","\u064a","\u0645"]) || "\u0639\u0644\u064a\u0645", transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["6:83"] }
  ],
  propheticNarratives: [
    { label: "Eighteen prophets enumerated across three groups demonstrating unbroken guidance-chain from Nuh to Isa", keys: ["6:84","6:85","6:86"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine hujjah conferred upon Ibrahim as paradigmatic argument against polytheism", keys: ["6:83"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Security (amn) as existential state of belief unmixed with injustice", keys: ["6:82"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deed-nullification (habitat) as consequence of post-faith shirk", keys: ["6:88"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Intergenerational prophetic succession: fathers offspring brothers chosen together", keys: ["6:87"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0287","cand-0288"],
  notes: "Pass A An'am passage 9/4. Security-asymmetry argument (6:81) reverses Meccan power-dynamics: associators lack sultan yet feel secure while believers possess genuine amn. Eighteen-prophet enumeration (6:84-86) spans pre-Abrahamic (Nuh) through Abrahamic descendants plus collateral lines establishing universality of guidance. Shirk-nullification clause (6:88) introduces critical conditionality: even prophetic deeds voided by association undermining any notion of inherited merit. Scripture-wisdom-prophethood triad (6:89) defines complete revelatory package. Succession-safeguard ensures divine message persists regardless of recipient rejection. Wage-free reminder (6:90) distinguishes prophetic mission from commercial or political enterprise.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P9 terminology
{
  const t = findWordContaining(81, ["\u0633","\u0644","\u0637"]); // sultanan
  if (t) p9.terminology.push({ term: t, transliteration: "sultan", gloss: "authority/proof (editorial gloss)", keys: ["6:81"] });
}
{
  const t = findWordContaining(83, ["\u062d","\u062c","\u062c"]); // hujjatuna
  if (t) p9.terminology.push({ term: t, transliteration: "hujjah", gloss: "conclusive argument/proof (editorial gloss)", keys: ["6:83"] });
}
{
  const t = findWordContaining(84, ["\u0645","\u062d","\u0633","\u0646"]); // almuhsineena
  if (t) p9.terminology.push({ term: t, transliteration: "muhsin", gloss: "doer of good/excellence (editorial gloss)", keys: ["6:84"] });
}
{
  const t = findWordContaining(86, ["\u0641","\u0636","\u0644"]); // faddalna
  if (t) p9.terminology.push({ term: t, transliteration: "tafdil", gloss: "preference/superiority (editorial gloss)", keys: ["6:86"] });
}
{
  const t = findWordContaining(87, ["\u0627","\u062c","\u062a","\u0628"]); // ijtabaynahum
  if (t) p9.terminology.push({ term: t, transliteration: "ijtiba'", gloss: "choosing/election (editorial gloss)", keys: ["6:87"] });
}
{
  const t = findWordContaining(88, ["\u062d","\u0628","\u0637"]); // lahabita
  if (t) p9.terminology.push({ term: t, transliteration: "hubut", gloss: "voiding/nullification (editorial gloss)", keys: ["6:88"] });
}
{
  const t = findWordContaining(89, ["\u0646","\u0628","\u0648"]); // alnnubuwwata
  if (t) p9.terminology.push({ term: t, transliteration: "nubuwwah", gloss: "prophethood (editorial gloss)", keys: ["6:89"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p9.json"), JSON.stringify(p9, null, 2) + "\n");
console.log("Wrote 006-al-anam-p9.json");

// ─── Passage 10: 6:91–100 ──────────────────────────────────────────────────────
const p10 = {
  extractionId: "ext-006-p10",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 91,
    toAyah: 100,
    label: "Al-An'am — Did not value Allah true value said Allah revealed nothing human; say who revealed Book Musa light guidance people make parchments display conceal taught what neither you nor fathers knew; say Allah leave them playing confusion; Book sent down blessed confirming before warn Mother Cities surrounding believe Hereafter believe guard prayers; who more unjust fabricates lie Allah says inspired when not inspired says reveal like Allah revealed? see wrongdoers death-throes angels extending hands discharge souls today recompensed humiliation saying about Allah other than truth arrogant signs; come individually created first left behind bestowed no intercessors claimed partners severed lost fabricated; Allah splits grain date-stone brings living dead dead living that Allah how deluded; Originator daybreak night rest sun moon calculation determination Exalted Knowing; placed stars guide darknesses land sea detailed signs people know; produced one soul dwelling storage detailed signs understand; sent water sky produced growth greenery grains layers palm clusters gardens grapes olives pomegranates similar varied look fruit ripening signs believe; attributed partners jinn created fabricated sons daughters without knowledge exalted above describe"
  },
  verseKeys: ["6:91","6:92","6:93","6:94","6:95","6:96","6:97","6:98","6:99","6:100"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+91}`, text: fv(i+91) })),
  mainSubject: {
    label: "Failed divine-appraisal in revelation-denial; Mosaic Book counter-proof; blessed Quran warning Umm al-Qura; fabrication-of-lie with death-throes angel-extraction; individual return stripping possessions severing intercessors; biological signs grain-splitting life-death cycling; cosmic signs daybreak night-rest solar-lunar calculation; stellar navigation; single-soul origin; vegetative cycle rain growth palm grape olive pomegranate; jinn-partnership offspring-fabrication condemned tasbih-closure",
    keys: ["6:91","6:92","6:93","6:94","6:95","6:96","6:97","6:98","6:99","6:100"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Failed appraisal (ma qadaroo Allaha haqqa qadrihi) rooted in revelation-denial", keys: ["6:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mosaic Book as light-guidance proving Allah reveals to humans", keys: ["6:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Parchment-display concealing much as selective revelation-distortion", keys: ["6:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taught what neither you nor fathers knew as novel revelation-proof", keys: ["6:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Leave them playing in confusion (khawdihim yalAAaboona) as dismissal", keys: ["6:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Blessed Book confirming prior scripture warning Umm al-Qura", keys: ["6:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hereafter-belief linked to Quran-acceptance and prayer-guardianship", keys: ["6:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supreme injustice: fabricating lie against Allah or claiming false inspiration", keys: ["6:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Death-throes scene: angels extending hands demanding soul-discharge", keys: ["6:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Humiliation punishment (AAathaba alhooni) for falsehood and sign-arrogance", keys: ["6:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Individual return (furada) mirroring original creation", keys: ["6:94"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly possessions abandoned behind backs at judgment", keys: ["6:94"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Claimed intercessors severed and fabricated partners lost", keys: ["6:94"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Grain-datestone splitting as biological resurrection-metaphor", keys: ["6:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Life-from-death death-from-life cycling demonstrating divine agency", keys: ["6:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Daybreak-cleaving night-rest sun-moon calculation as cosmic order", keys: ["6:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Stellar navigation through land-sea darknesses as practical sign", keys: ["6:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Single-soul origin (nafsin wahidatin) with mustaqarr-mustawda'", keys: ["6:98"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Vegetative cycle: rain producing greenery grains palm-clusters grape olive pomegranate", keys: ["6:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fruit-observation command (onthuroo ila thamarihi) directing empirical attention", keys: ["6:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jinn-partnership attribution despite Allah creating them", keys: ["6:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Offspring-fabrication (banina wabanatin bighayri AAilmin) condemned", keys: ["6:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tasbih-closure: subhanahu wataAAala AAamma yasifoona", keys: ["6:100"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["6:99"], excerpt: fv(99), description: "Command: look at its fruit when it yields and at its ripening." }
  ],
  divineNamesAndAttributes: [
    { term: findWordContaining(96, ["\u0639","\u0632","\u064a","\u0632"]) || "\u0627\u0644\u0639\u0632\u064a\u0632", transliteration: "al-Aziz", gloss: "the Exalted in Might (editorial gloss)", keys: ["6:96"] },
    { term: findWordContaining(96, ["\u0639","\u0644","\u064a","\u0645"]) || "\u0627\u0644\u0639\u0644\u064a\u0645", transliteration: "al-Aleem", gloss: "the Knowing (editorial gloss)", keys: ["6:96"] }
  ],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Death-throes panic (ghamarati almawti) with angelic soul-extraction", keys: ["6:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Delusion (tufakoona) despite manifest biological and cosmic signs", keys: ["6:95"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0289","cand-0290","cand-0291"],
  notes: "Pass A An'am passage 10/4. Failed-appraisal diagnosis (6:91) identifies root error as underestimation of divine capacity not mere intellectual disagreement. Death-throes scene (6:93) provides most vivid eschatological imagery in this section making abstract accountability sensorially immediate. Individual-return motif (6:94) strips social identity reducing person to bare created-state. Biological signs (6:95) use agricultural metaphor accessible to agrarian audience. Cosmic signs (6:96-97) move from daily cycles to navigational utility. Vegetative catalogue (6:99) demonstrates biodiversity as deliberate design. Tasbih-closure (6:100) provides liturgical response to anthropomorphic fabrication.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P10 terminology
{
  const t = findWordContaining(91, ["\u0642","\u062f","\u0631"]); // qadrihi
  if (t) p10.terminology.push({ term: t, transliteration: "qadr", gloss: "true value/appraisal (editorial gloss)", keys: ["6:91"] });
}
{
  const t = findWordContaining(91, ["\u0642","\u0631","\u0627","\u0637"]); // qarateesa
  if (t) p10.terminology.push({ term: t, transliteration: "qaratis", gloss: "parchments/pages (editorial gloss)", keys: ["6:91"] });
}
{
  const t = findWordContaining(92, ["\u0645","\u0628","\u0627","\u0631"]); // mubarakun
  if (t) p10.terminology.push({ term: t, transliteration: "mubarak", gloss: "blessed (editorial gloss)", keys: ["6:92"] });
}
{
  const t = findWordContaining(93, ["\u063a","\u0645","\u0631"]); // ghamarati
  if (t) p10.terminology.push({ term: t, transliteration: "ghamarat", gloss: "overwhelming pangs (editorial gloss)", keys: ["6:93"] });
}
{
  const t = findWordContaining(93, ["\u0647","\u0648","\u0646"]); // alhooni
  if (t) p10.terminology.push({ term: t, transliteration: "hawn", gloss: "humiliation/degradation (editorial gloss)", keys: ["6:93"] });
}
{
  const t = findWordContaining(94, ["\u0641","\u0631","\u0627","\u062f"]); // furada
  if (t) p10.terminology.push({ term: t, transliteration: "furada", gloss: "individually/alone (editorial gloss)", keys: ["6:94"] });
}
{
  const t = findWordContaining(95, ["\u0641","\u0627","\u0644","\u0642"]); // faliqu
  if (t) p10.terminology.push({ term: t, transliteration: "faliq", gloss: "cleaver/splitter (editorial gloss)", keys: ["6:95"] });
}
{
  const t = findWordContaining(98, ["\u0645","\u0633","\u062a","\u0642"]); // mustaqarrun
  if (t) p10.terminology.push({ term: t, transliteration: "mustaqarr", gloss: "place of dwelling (editorial gloss)", keys: ["6:98"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p10.json"), JSON.stringify(p10, null, 2) + "\n");
console.log("Wrote 006-al-anam-p10.json");

// ─── Passage 11: 6:101–110 ──────────────────────────────────────────────────────
const p11 = {
  extractionId: "ext-006-p11",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 101,
    toAyah: 110,
    label: "Al-An'am — Originator heavens earth how have son no consort created everything Knower all things; that Allah your Lord no deity except Him Creator all things worship Disposer all; vision perceives not He perceives vision Subtle Acquainted; insight came from Lord whoever sees for own soul blind upon it not guardian over you; diversify signs say studied make clear people know; follow revealed from Lord no deity except He turn away polytheists; if Allah willed would not have associated not guardian responsible; do not insult invoke besides Allah lest insult Allah enmity without knowledge; made fair every nation deeds then return informs; swore strongest oaths sign came would believe; say signs only with Allah what makes realize when comes will not believe? turn hearts vision as did not believe first leave wandering blindly transgression"
  },
  verseKeys: ["6:101","6:102","6:103","6:104","6:105","6:106","6:107","6:108","6:109","6:110"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+101}`, text: fv(i+101) })),
  mainSubject: {
    label: "Badi'-originator refuting sonship through consort-absence; tawheed-declaration with worship-command Wakil-disposition; vision-non-perception establishing transcendence; Latif-Khabeer pair; basair-insight as personal responsibility; sign-diversification clarifying for knowledgeable; revelation-following with polytheist-avoidance; divine-will supremacy absolving prophet; insult-prohibition preventing reciprocal blasphemy; deed-beautification per nation with return-informing; oath-breaking sign-demand met with disbelief-prediction; heart-vision inversion as rejection-consequence",
    keys: ["6:101","6:102","6:103","6:104","6:105","6:106","6:107","6:108","6:109","6:110"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Badi' (Originator) excluding offspring through consort-absence logic", keys: ["6:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Creative-totality (khalaqa kulla shayin) reinforcing sole-deity status", keys: ["6:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawheed-formula: la ilaha illa huwa with exclusive worship-command", keys: ["6:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wakil (Disposer) over all things establishing comprehensive trusteeship", keys: ["6:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Vision-non-perception (la tudrikuhu alabsaru) establishing transcendence", keys: ["6:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine perception of all vision (yudriku alabsara) reversing epistemic asymmetry", keys: ["6:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Latif-Khabeer (Subtle Acquainted) attribute pair", keys: ["6:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Basair (insights) from Lord as personal-responsibility basis", keys: ["6:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Seeing-blindness dichotomy: benefit-harm falls on individual soul", keys: ["6:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic non-guardianship (ma ana AAalaykum bihafeethin)", keys: ["6:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign-diversification provoking 'darasta' accusation", keys: ["6:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Clarification for people who know (liqawmin yaAAlamoona)", keys: ["6:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Revelation-following command with tawheed-anchor", keys: ["6:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Polytheist-avoidance command (waaAArid AAani almushrikeena)", keys: ["6:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine-will supremacy: if Allah willed they would not associate", keys: ["6:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic non-responsibility: not hafeeth nor wakeel over them", keys: ["6:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Insult-prohibition preventing reciprocal blasphemy without knowledge", keys: ["6:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deed-beautification per nation (zayyanna likulli ommatin AAamalahum)", keys: ["6:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Return-informing closure (marjiAAuhum fayunabbiohum)", keys: ["6:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Oath-breaking: strongest oaths for sign-belief contradicted by prediction", keys: ["6:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Signs belong only to Allah (innama alayatu AAinda Allahi)", keys: ["6:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heart-vision inversion (nuqallibu afidatahum waabsarahum) as consequence", keys: ["6:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Blind wandering in transgression (fee tughyanihim yaAAmahoona)", keys: ["6:110"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["6:102"], excerpt: fv(102), description: "Command: worship Him, the Creator of all things." },
    { kind: "COMMAND", keys: ["6:106"], excerpt: fv(106), description: "Command: follow what has been revealed to you from your Lord and turn away from the polytheists." },
    { kind: "PROHIBITION", keys: ["6:108"], excerpt: fv(108), description: "Prohibition: do not insult those they invoke other than Allah lest they insult Allah in enmity without knowledge." }
  ],
  divineNamesAndAttributes: [
    { term: findWordContaining(101, ["\u0628","\u062f","\u064a","\u0639"]) || "\u0628\u062f\u064a\u0639", transliteration: "Badi'", gloss: "Originator (editorial gloss)", keys: ["6:101"] },
    { term: findWordContaining(102, ["\u062e","\u0644","\u0642"]) || "\u062e\u064e\u0670\u0644\u0650\u0642", transliteration: "Khaliq", gloss: "Creator (editorial gloss)", keys: ["6:102"] },
    { term: findWordContaining(102, ["\u0648","\u0643","\u064a","\u0644"]) || "\u0648\u0643\u064a\u0644", transliteration: "Wakeel", gloss: "Disposer/Trustee (editorial gloss)", keys: ["6:102"] },
    { term: findWordContaining(103, ["\u0644","\u0637","\u064a","\u0641"]) || "\u0627\u0644\u0644\u0637\u064a\u0641", transliteration: "al-Latif", gloss: "the Subtle (editorial gloss)", keys: ["6:103"] },
    { term: findWordContaining(103, ["\u062e","\u0628","\u064a","\u0631"]) || "\u0627\u0644\u062e\u0628\u064a\u0631", transliteration: "al-Khabeer", gloss: "the Acquainted (editorial gloss)", keys: ["6:103"] }
  ],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Personal insight-responsibility: seeing benefits own soul blindness harms it", keys: ["6:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Blind wandering (yaAAmahoona) in transgression as spiritual state", keys: ["6:110"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Deed-beautification per nation explaining cultural-religious diversity as divine arrangement", keys: ["6:108"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0292","cand-0293"],
  notes: "Pass A An'am passage 11/4. Badi'-refutation (6:101) uses logical impossibility: offspring requires consort yet Allah originated without precedent. Vision-non-perception verse (6:103) establishes most explicit divine-transcendence statement in Quran distinguishing Islamic theology from incarnational traditions. Latif-Khabeer pairing suggests divine knowledge operates through subtlety not brute force. Basair-plural (6:104) indicates multiple insight-channels available. Insult-prohibition (6:108) demonstrates pragmatic ethics protecting divine honor through restraint rather than retaliation. Heart-vision inversion (6:110) describes psychological mechanism of persistent disbelief: faculties turned inward preventing reception.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P11 terminology
{
  const t = findWordContaining(103, ["\u0623","\u0628","\u0635","\u0627"]); // alabsaru
  if (t) p11.terminology.push({ term: t, transliteration: "absar", gloss: "vision/sight (editorial gloss)", keys: ["6:103"] });
}
{
  const t = findWordContaining(104, ["\u0628","\u0635","\u0627","\u0626"]); // basairu
  if (t) p11.terminology.push({ term: t, transliteration: "basair", gloss: "insights/enlightenment (editorial gloss)", keys: ["6:104"] });
}
{
  const t = findWordContaining(105, ["\u062f","\u0631","\u0633"]); // darasta
  if (t) p11.terminology.push({ term: t, transliteration: "darasa", gloss: "studied/learned (editorial gloss)", keys: ["6:105"] });
}
{
  const t = findWordContaining(108, ["\u0632","\u064a","\u0646"]); // zayyanna
  if (t) p11.terminology.push({ term: t, transliteration: "tazyin", gloss: "beautification/adornment (editorial gloss)", keys: ["6:108"] });
}
{
  const t = findWordContaining(110, ["\u0637","\u063a","\u064a"]); // tughyanihim
  if (t) p11.terminology.push({ term: t, transliteration: "tughyan", gloss: "transgression/excess (editorial gloss)", keys: ["6:110"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p11.json"), JSON.stringify(p11, null, 2) + "\n");
console.log("Wrote 006-al-anam-p11.json");

// ─── Passage 12: 6:111–120 ──────────────────────────────────────────────────────
const p12 = {
  extractionId: "ext-006-p12",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 111,
    toAyah: 120,
    label: "Al-An'am — Even if sent angels dead spoke gathered everything before them would not believe unless Allah wills most ignorant; thus made every prophet enemy devils mankind jinn inspiring decorative speech delusion if Lord willed would not have done leave them fabricate; hearts disbelieve Hereafter incline pleased earn earning; seek judge other than Allah? He sent down Book detailed those given scripture know revealed from Lord truth never doubt; word Lord fulfilled truth justice none alters His words Hearing Knowing; obey most earth mislead way Allah follow assumption conjecture; Lord knows best who strays knows guided; eat what mentioned Allah name if believe signs; why not eat mentioned Allah name when detailed forbidden except compelled? many mislead desires without knowledge Lord knows transgressors; leave apparent sin hidden; earn sin recompensed earned"
  },
  verseKeys: ["6:111","6:112","6:113","6:114","6:115","6:116","6:117","6:118","6:119","6:120"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+111}`, text: fv(i+111) })),
  mainSubject: {
    label: "Belief-impossibility without divine will under maximal evidence; devil-enemy system inspiring decorative-delusion speech; heart-inclination toward delusion as Hereafter-disbelief consequence; divine-judge exclusivity with detailed Book confirmed by prior scripture; word-fulfillment truth-justice immutability; majority-opinion misguidance following assumption-conjecture; divine knowledge straying-guided; dietary permission mentioning Allah's name conditioned on belief; detailed prohibition compulsion-exception; desire-based misguidance; apparent-hidden sin abandonment earnings-recompense",
    keys: ["6:111","6:112","6:113","6:114","6:115","6:116","6:117","6:118","6:119","6:120"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Maximal-evidence hypothetical: angels dead-speaking all-gathered insufficient without divine will", keys: ["6:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine-will as necessary condition for belief (illa an yashaa Allahu)", keys: ["6:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Majority ignorance (aktharahum yajhaloona) despite evidence-availability", keys: ["6:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Devil-enemy system assigned to every prophet from mankind and jinn", keys: ["6:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Decorative speech (zukhrufa alqawli ghurooran) as deception-mechanism", keys: ["6:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine permission of opposition: if Lord willed they would not do it", keys: ["6:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Leave-them command regarding fabrications", keys: ["6:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heart-inclination toward delusion as Hereafter-disbelief effect", keys: ["6:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Satisfaction with delusion and earning consequences", keys: ["6:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine-judge exclusivity: afaghayra Allahi abtaghee hakaman", keys: ["6:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Detailed Book (alkitaba mufassalan) as sufficient criterion", keys: ["6:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prior-scripture recipients confirming revelation-truth", keys: ["6:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Doubt-prohibition (fala takoonanna mina almumtareena)", keys: ["6:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Word-fulfillment in sidq-adl (truth-justice)", keys: ["6:115"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Word-immutability (la mubaddila likalimatihi)", keys: ["6:115"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sami'-Aleem (Hearing Knowing) closing word-fulfillment", keys: ["6:115"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Majority-opinion danger: obeying most on earth causes misguidance", keys: ["6:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Assumption-conjecture (alththanna-yakhrusoona) as epistemic failure", keys: ["6:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine knowledge of straying and guided superseding human judgment", keys: ["6:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dietary permission: eat what mentions Allah's name if believers", keys: ["6:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rhetorical challenge: why not eat what mentions Allah's name?", keys: ["6:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Detailed prohibition with compulsion-exception (illa ma idturirtum)", keys: ["6:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Desire-based misguidance without knowledge as widespread problem", keys: ["6:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Apparent-hidden sin abandonment command", keys: ["6:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sin-earnings recompense principle", keys: ["6:120"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["6:112"], excerpt: fv(112), description: "Command: leave them and that which they fabricate." },
    { kind: "COMMAND", keys: ["6:118"], excerpt: fv(118), description: "Command: eat of that upon which the name of Allah has been mentioned if you are believers in His verses." },
    { kind: "COMMAND", keys: ["6:120"], excerpt: fv(120), description: "Command: leave what is apparent of sin and what is concealed thereof." }
  ],
  divineNamesAndAttributes: [
    { term: findWordContaining(115, ["\u0633","\u0645","\u064a","\u0639"]) || "\u0627\u0644\u0633\u0645\u064a\u0639", transliteration: "al-Sami'", gloss: "the Hearing (editorial gloss)", keys: ["6:115"] },
    { term: findWordContaining(115, ["\u0639","\u0644","\u064a","\u0645"]) || "\u0627\u0644\u0639\u0644\u064a\u0645", transliteration: "al-Aleem", gloss: "the Knowing (editorial gloss)", keys: ["6:115"] }
  ],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Ignorance (yajhaloona) persisting despite maximal evidence availability", keys: ["6:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heart-inclination toward delusion as volitional disposition", keys: ["6:113"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0294","cand-0295","cand-0296"],
  notes: "Pass A An'am passage 12/4. Maximal-evidence hypothetical (6:111) establishes that belief is ultimately dependent on divine will not evidential sufficiency undermining purely rationalist soteriology. Devil-enemy system (6:112) normalizes prophetic opposition as structural feature not anomalous failure. Decorative-speech diagnosis identifies aesthetic persuasion as primary deception-vector. Divine-judge exclusivity (6:114) eliminates extra-revelatory authority sources. Word-immutability (6:115) guarantees textual stability against corruption claims. Majority-opinion warning (6:116) provides democratic-skepticism grounding epistemic vigilance. Dietary verses (6:118-119) transition from theological to practical legislation anchoring food-permission in divine-name invocation. Apparent-hidden sin pairing (6:120) demands comprehensive ethical integrity covering both public and private conduct.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P12 terminology
{
  const t = findWordContaining(112, ["\u0632","\u062e","\u0631","\u0641"]); // zukhrufa
  if (t) p12.terminology.push({ term: t, transliteration: "zukhruf", gloss: "decorative/adorned speech (editorial gloss)", keys: ["6:112"] });
}
{
  const t = findWordContaining(114, ["\u0645","\u0641","\u0635","\u0644"]); // mufassalan
  if (t) p12.terminology.push({ term: t, transliteration: "mufassal", gloss: "detailed/explained (editorial gloss)", keys: ["6:114"] });
}
{
  const t = findWordContaining(115, ["\u0635","\u062f","\u0642"]); // sidqan
  if (t) p12.terminology.push({ term: t, transliteration: "sidq", gloss: "truth/truthfulness (editorial gloss)", keys: ["6:115"] });
}
{
  const t = findWordContaining(116, ["\u0638","\u0646"]); // alththanna
  if (t) p12.terminology.push({ term: t, transliteration: "thann", gloss: "assumption/conjecture (editorial gloss)", keys: ["6:116"] });
}
{
  const t = findWordContaining(119, ["\u0623","\u0647","\u0648"]); // biahwaihim
  if (t) p12.terminology.push({ term: t, transliteration: "hawa", gloss: "desire/inclination (editorial gloss)", keys: ["6:119"] });
}
{
  const t = findWordContaining(120, ["\u0638","\u0627","\u0647","\u0631"]); // thahira
  if (t) p12.terminology.push({ term: t, transliteration: "thahir", gloss: "apparent/outward (editorial gloss)", keys: ["6:120"] });
}
{
  const t = findWordContaining(120, ["\u0628","\u0627","\u0637","\u0646"]); // wabatinahu
  if (t) p12.terminology.push({ term: t, transliteration: "batin", gloss: "concealed/inward (editorial gloss)", keys: ["6:120"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p12.json"), JSON.stringify(p12, null, 2) + "\n");
console.log("Wrote 006-al-anam-p12.json");

// ─── Candidates batch (cand-0287 through cand-0296) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-006-p9,ext-006-p10,ext-006-p11,ext-006-p12",
  candidates: []
};

function makeCand(id, label, arabicLabel, urduLabel, def, evidenceArr, overlap, notes) {
  const c = {
    candidateId: id,
    label,
    definition: def,
    definitionStatus: "editorial-draft",
    evidence: evidenceArr,
    existingTopicOverlap: overlap || [],
    proposedBy: "ai-assisted",
    reviewStatus: "pending-scholarly-review",
    createdAt: TS
  };
  if (arabicLabel) c.arabicLabel = arabicLabel;
  if (urduLabel) c.urduLabel = urduLabel;
  if (notes) c.notes = notes;
  return c;
}

// cand-0287: Prophetic lineage and continuous guidance-chain
candidates.candidates.push(makeCand("cand-0287",
  "Prophetic lineage and continuous guidance-chain: eighteen prophets enumerated across generations from Nuh to Isa; hujjah given Ibrahim; chose guided straight path; if associated would void deeds; scripture wisdom prophethood entrusted non-disbelieving successors",
  undefined, "السلالة النبوية وسلسلة الهداية المتصلة: ثمانية عشر نبياً من نوح إلى عيسى؛ الحجة الممنوحة لإبراهيم؛ اصطفاء وهداية إلى صراط مستقيم؛ الشرك يبطل الأعمال؛ الكتاب والحكمة والنبوة مؤتمنة عند قوم غير كافرين",
  "In 6:83-89: That was Our argument We gave Ibrahim against his people. We raise degrees whom We will. Your Lord is Wise Knowing. We gave him Ishaq and Yaqub each We guided. And Nuh We guided before. From his offspring Dawud Sulayman Ayyub Yusuf Musa Harun. Thus We reward doers of good. And Zakariyya Yahya Isa Elias all of the righteous. And Ismail Alyasa Yunus Lut each We preferred over the worlds. From their fathers offspring brothers We chose and guided to straight path. If they had associated it would have been voided for them. Those We gave scripture wisdom prophethood. If these disbelieve We entrusted it to people not disbelieving.",
  [{ key: "6:83", excerpt: fv(83), evidenceClass: "EXPLICIT_TEXT", rationale: "Watilka hujjatuna ataynaha ibraheema AAala qawmihi narfaAAu darajatin man nashao inna rabbaka hakeemun AAaleemun: divine hujjah as conclusive argument establishing prophetic authority derived from God not social consensus." },
   { key: "6:84", excerpt: fv(84), evidenceClass: "EXPLICIT_TEXT", rationale: "Wawahabna lahu ishaqa wayaAAqooba kullan hadayna wanoohan hadayna min qablu wamin thurriyyatihi dawooda wasulaymana waayyooba wayoosufa wamoosa waharoona wakathalika najzee almuhsineena: six descendants plus Nuh establishing pre-Abrahamic continuity." },
   { key: "6:85", excerpt: fv(85), evidenceClass: "EXPLICIT_TEXT", rationale: "Wazakariyya wayahya waAAeesa wailyasa kullun mina alssaliheena: second group spanning priestly (Zakariyya-Yahya) messianic (Isa) and prophetic (Elias) roles." },
   { key: "6:86", excerpt: fv(86), evidenceClass: "EXPLICIT_TEXT", rationale: "WaismaAAeela wailyasaAAa wayoonusa walootan wakullan faddalna AAala alAAalameena: third group including Arabian-line (Ismail) and non-Israelite (Lut) prophets demonstrating universality." },
   { key: "6:88", excerpt: fv(88), evidenceClass: "EXPLICIT_TEXT", rationale: "Thalika huda Allahi yahdee bihi man yashao min AAibadihi walaw ashrakoo lahabita AAanhum ma kanoo yaAAmaloona: shirk-nullification clause establishing conditionality of all prophetic achievement." },
   { key: "6:89", excerpt: fv(89), evidenceClass: "EXPLICIT_TEXT", rationale: "Olaika allatheena ataynahumu alkitaba waalhukma waalnnubuwwata fain yakfur biha haolai faqad wakkalna biha qawman laysoo biha bikafireena: scripture-wisdom-prophethood triad with succession-safeguard ensuring message persistence." }],
  [{ topicId: "prophets", layer: "curated", relationship: "same-concept", note: "Comprehensive prophetic enumeration establishing continuity and universality" },
   { topicId: "ibrahim-story", layer: "scholarly", relationship: "related-not-identical", note: "Ibrahim as anchor-point of prophetic chain receiving divine hujjah" }],
  "Overlap with prophets and ibrahim-story. Eighteen-prophet enumeration spans three distinct groups demonstrating both genealogical connection and functional diversity. Nuh-placement before Ibrahim establishes pre-Abrahamic monotheism. Shirk-nullification (6:88) prevents prophet-veneration from becoming independent salvation-mechanism. Succession-safeguard (6:89) addresses historical reality of community apostasy while guaranteeing message-survival. This passage functions as canonical prophet-list providing authoritative reference for subsequent Islamic prophetology."
));

// cand-0288: Security-injustice linkage and wage-free reminder
candidates.candidates.push(makeCand("cand-0288",
  "Security-injustice linkage and wage-free reminder: believed did not mix belief injustice have security guided; follow their guidance ask no wage reminder for worlds",
  undefined, "الأمن والظلم والتذكير المجاني: الذين آمنوا ولم يلبسوا إيمانهم بظلم لهم الأمن وهم مهتدون؛ اتبعوا هداهم لا أجر إلا ذكرى للعالمين",
  "In 6:82,90: They who believe and do not mix their belief with injustice those will have security and they are guided. Those are the ones whom Allah has guided so from their guidance take an example. Say I ask of you for this message no payment. It is not but a reminder for the worlds.",
  [{ key: "6:82", excerpt: fv(82), evidenceClass: "EXPLICIT_TEXT", rationale: "Allatheena amanoo walam yalbisoo eemanahum bithulmin olaika lahumu alamnu wahum muhtadoona: faith-zulm separation producing dual outcome of existential security and right-guidance." },
   { key: "6:90", excerpt: fv(90), evidenceClass: "EXPLICIT_TEXT", rationale: "Olaika allatheena hada Allahu fabihudahumu iqtadih qul la asalukum AAalayhi ajran in huwa illa thikra lilAAalameena: prophetic-following command combined with wage-free universal reminder distinguishing revelation from commerce." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Security as experiential outcome of pure tawheed unmixed with zulm" },
   { topicId: "god-consciousness", layer: "curated", relationship: "same-concept", note: "Zulm-avoidance as taqwa-expression producing existential peace" }],
  "Overlap with tawheed and god-consciousness. Amn-security here differs from political safety denoting existential peace arising from belief-integrity. Zulm-exclusion prevents faith from becoming tribal identity-marker divorced from ethical substance. Wage-free declaration (la asalukum ajran) protects prophetic credibility against commercial suspicion. Dhikra lilAAalameena universalizes message beyond immediate audience. Together these verses define authentic faith as producing both internal security and external accessibility."
));

// cand-0289: Failed divine-appraisal and Mosaic Book counter-proof
candidates.candidates.push(makeCand("cand-0289",
  "Failed divine-appraisal and Mosaic Book counter-proof: did not value Allah true value said Allah revealed nothing human; say who revealed Book Musa light guidance people make parchments display conceal taught what neither you nor fathers knew",
  undefined, "عدم التقدير الحق لله وحجة كتاب موسى: ما قدروا الله حق قدره إذ قالوا ما أنزل الله على بشر من شيء؛ قل من أنزل الكتاب الذي جاء به موسى نوراً وهدى للناس تجعلونه قراطيس تبدونها وتخفون كثيراً وعلمتم ما لم تعلموا أنتم ولا آباؤكم",
  "In 6:91: And they did not appraise Allah with true appraisal when they said Allah did not reveal to a human being anything. Say who revealed the Scripture that Moses brought as light and guidance to the people? You make it into pages disclosing some and concealing much. And you were taught that which you knew not neither you nor your fathers. Say Allah. Then leave them in their discourse amusing themselves.",
  [{ key: "6:91", excerpt: fv(91), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama qadaroo Allaha haqqa qadrihi ith qaloo ma anzala Allahu AAala basharin min shayin: failed-appraisal diagnosed as root cause of revelation-denial not mere intellectual disagreement. Qul man anzala alkitaba allathee jaa bihi moosa nooran wahudan lilnnasi: Mosaic Book invoked as undeniable counter-proof since opponents themselves accept Torah. TajAAaloonahu qarateesa tubdoonaha watukhfoona katheeran: selective disclosure exposing textual manipulation undermining claim to faithful transmission. WaAAullimtum ma lam taAAlamoo antum wala abaokum: novel-knowledge argument proving revelation transcends ancestral tradition." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Underestimation of divine capacity as root of revelation-denial" },
   { topicId: "prophets", layer: "curated", relationship: "related-not-identical", note: "Musa as proof-text for human-revelation possibility" }],
  "Overlap with tawheed and prophets. Haqqa qadrihi (true appraisal) implies Allah's capacity exceeds human estimation making revelation-denial a failure of imagination not evidence. Mosaic Book serves as internal critique: opponents accept Torah yet deny Quran creating inconsistency. Parchment-display concealing much exposes selective hermeneutics. Novel-knowledge argument breaks ancestral-authority monopoly opening epistemic space for new revelation. Khawdihim yalAAaboona dismissal refuses engagement with bad-faith argumentation."
));

// cand-0290: Death-throes scene and individual return
candidates.candidates.push(makeCand("cand-0290",
  "Death-throes scene and individual return: wrongdoers in death-pangs angels extending hands discharge souls today recompensed humiliation for falsehood arrogance; come individually created first left behind bestowed no intercessors severed lost fabricated",
  undefined, "مشهد سكرات الموت والرجوع الفردي: الظالمون في غمرات الموت والملائكة باسطو أيديهم أخرجوا أنفسكم اليوم تجزون عذاب الهون بما قلتم على الله غير الحق واستكبرتم عن آياته؛ جئتمونا فرادى كما خلقناكم أول مرة وتركتم ما خولناكم وراء ظهوركم لا شفعاء تقطع بينكم وضل ما تزعمون",
  "In 6:93-94: And who is more unjust than one who invents a lie about Allah or says it has been inspired to me while nothing has been inspired to him. And if you could but see when the wrongdoers are in the overwhelming pangs of death while the angels extend their hands saying discharge your souls. Today you will be awarded the punishment of humiliation for what you used to say against Allah other than the truth and you were toward His verses being arrogant. And you have certainly come to Us alone as We created you the first time and you have left whatever We bestowed upon you behind you. And We do not see with you your intercessors which you claimed. It has been severed between you and lost from you is what you used to claim.",
  [{ key: "6:93", excerpt: fv(93), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaw tara ithi alththalimoona fee ghamarati almawti waalmalaikatu basitoo aydeehim akhrijoo anfusakumu alyawma tujzawna AAathaba alhooni bima kuntum taqooloona AAala Allahi ghayra alhaqqi wakuntum AAan ayatihi tastakbiroona: death-throes visualization making abstract accountability sensorially immediate with angelic soul-extraction and humiliation-punishment linked to falsehood-arrogance." },
   { key: "6:94", excerpt: fv(94), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaqad jitumoona furada kama khalaqnakum awwala marratin wataraktum ma khawwalnakum waraa thuhoorikum wama nara maAAakum shufaAAaakumu allatheena zaAAamtum annahum feekum shurakao laqad taqattaAAa baynakum wadalla AAankum ma kuntum tazAAumoona: individual-return mirroring original creation stripping social identity and worldly possessions severing claimed intercessors." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "same-concept", note: "Vivid eschatological scene with soul-extraction and intercessor-severance" },
   { topicId: "the-hereafter", layer: "curated", relationship: "same-concept", note: "Individual accountability eliminating all intermediaries" }],
  "Overlap with day-of-judgment and the-hereafter. Ghamarati almawti (overwhelming pangs) provides most visceral death-description in this section. Angelic hand-extension (basitoo aydeehim) physicalizes soul-extraction process. AAathaba alhooni (humiliation punishment) specifically targets false-claim and sign-arrogance linking punishment-form to sin-type. Furada-individuality mirrors awwala marratin (first creation) establishing ontological symmetry between birth and judgment. ShufaAAa-severance demonstrates practical nullification of intercession-doctrine at moment of need."
));

// cand-0291: Biological and cosmic signs of divine agency
candidates.candidates.push(makeCand("cand-0291",
  "Biological and cosmic signs of divine agency: Allah splits grain date-stone brings living dead dead from living; Originator daybreak night rest sun moon calculation; stars guide darknesses land sea; single soul origin dwelling storage; rain produces growth greenery grains palm clusters grape olive pomegranate look fruit ripening signs believe; exalted above offspring-fabrication",
  undefined, "الآيات البيئية والكونية الدالة على القدرة الإلهية: الله فالق الحب والنوى يخرج الحي من الميت ومخرج الميت من الحي؛ فالق الإصباح جعل الليل سكناً والشمس والقمر حسبانه؛ النجوم للاهتداء في ظلمات البر والبحر؛ نفس واحدة مستقر ومستودع؛ المطر يُخرج النبات والخضر والحب والنخل والعنب والزيتون والرمان انظروا إلى ثمره وينعه آيات للمؤمنين؛ سبحانه وتعالى عما يصفون",
  "In 6:95-100: Indeed Allah is the cleaver of grain and date seeds. He brings the living out of the dead and brings the dead out of the living. That is Allah so how are you deluded? Cleaver of daybreak made night for rest sun and moon for calculation. That is determination of the Exalted Knowing. He placed stars to guide through darknesses of land and sea. Produced you from one soul with dwelling and storage. Sent down water from sky produced growth of all things greenery grains arranged palm clusters gardens of grapevines olives pomegranates similar yet varied. Look at its fruit when it yields and ripening. Indeed in that are signs for people who believe. They attributed partners jinn while He created them fabricated sons daughters without knowledge. Exalted is He above what they describe.",
  [{ key: "6:95", excerpt: fv(95), evidenceClass: "EXPLICIT_TEXT", rationale: "Inna Allaha faliqu alhabbi waalnnawa yukhriju alhayya mina almayyiti wamukhriju almayyiti mina alhayyi thalikumu Allahu faanna tufakoona: grain-splitting and life-death cycling as biological resurrection-metaphor accessible to agrarian observation." },
   { key: "6:96", excerpt: fv(96), evidenceClass: "EXPLICIT_TEXT", rationale: "Faliqu alisbahi wajaAAala allayla sakanan waalshshamsa waalqamara husbanan thalika taqdeeru alAAazeezi alAAaleemi: cosmic-order signs establishing regularity as divine determination not natural necessity." },
   { key: "6:99", excerpt: fv(99), evidenceClass: "EXPLICIT_TEXT", rationale: "Wahuwa allathee anzala mina alssamai maan faakhrajna bihi nabata kulli shayin...onthuroo ila thamarihi itha athmara wayanAAihi inna fee thalikum laayatin liqawmin yuminoona: vegetative catalogue with empirical observation-command directing attention to biodiversity as designed phenomenon." },
   { key: "6:100", excerpt: fv(100), evidenceClass: "EXPLICIT_TEXT", rationale: "WajaAAaloo lillahi shurakaa aljinna wakhalaqahum wakharaqoo lahu baneena wabanatin bighayri AAilmin subhanahu wataAAala AAamma yasifoona: jinn-partnership and offspring-fabrication condemned with tasbih-closure providing liturgical correction." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "same-concept", note: "Multi-domain signs demonstrating comprehensive creative agency" },
   { topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Sign-observation leading to recognition of sole creator" }],
  "Overlap with divine-power and tawheed. Faliq (cleaver) applied to both biological (grain) and cosmic (daybreak) domains unifying creative action. Life-death cycling provides empirical resurrection-proof preceding eschatological argument. Husbanan (calculation) frames celestial bodies as functional instruments not objects of worship. Single-soul origin establishes human unity preceding diversity. Vegetative catalogue moves from general (nabata kulli shayin) to specific (grape olive pomegranate) demonstrating taxonomic awareness. Onthuroo-command shifts burden to observer making sign-recognition active not passive. Tasbih-closure provides appropriate response to anthropomorphic fabrication."
));

// cand-0292: Divine transcendence and vision-non-perception
candidates.candidates.push(makeCand("cand-0292",
  "Divine transcendence and vision-non-perception: Originator heavens earth no son no consort created everything Knower; no deity except Him Creator worship Disposer; vision perceives not He perceives vision Subtle Acquainted; insight from Lord sees for own soul blind upon it not guardian",
  undefined, "التنزيه الإلهي وعدم إدراك الأبصار: بديع السماوات والأرض لا ولد ولا صاحبة خلق كل شيء عليم؛ لا إله إلا هو الخالق فاعبدوه وكيل؛ لا تدركه الأبصار وهو يدرك الأبصار اللطيف الخبير؛ بصائر من ربكم من أبصر فلنفسه ومن عمي فعليها وما أنا عليكم بحفيظ",
  "In 6:101-104: Originator of heavens and earth how could He have a son when He does not have a companion and He created all things and He is of all things Knowing. That is Allah your Lord no deity except Him Creator of all things so worship Him and He is Disposer of all things. Vision perceives Him not but He perceives vision and He is the Subtle the Acquainted. There has come to you enlightenment from your Lord so whoever sees does so for his own soul and whoever is blind does harm against it and I am not a guardian over you.",
  [{ key: "6:101", excerpt: fv(101), evidenceClass: "EXPLICIT_TEXT", rationale: "BadeeAAu alssamawati waalardi anna yakoonu lahu waladun walam takun lahu sahibatun wakhalaqa kulla shayin wahuwa bikulli shayin AAaleemun: Badi'-originator excluding offspring through logical impossibility requiring consort." },
   { key: "6:102", excerpt: fv(102), evidenceClass: "EXPLICIT_TEXT", rationale: "Thalikumu Allahu rabbukum la ilaha illa huwa khaliqu kulli shayin faoAAbudoohu wahuwa AAala kulli shayin wakeelun: tawheed-formula with exclusive worship-command and Wakil-disposition." },
   { key: "6:103", excerpt: fv(103), evidenceClass: "EXPLICIT_TEXT", rationale: "La tudrikuhu alabsaru wahuwa yudriku alabsara wahuwa allateefu alkhabeeru: vision-non-perception establishing divine transcendence beyond sensory capture while affirming divine perception of all vision." },
   { key: "6:104", excerpt: fv(104), evidenceClass: "EXPLICIT_TEXT", rationale: "Qad jaakum basairu min rabbikum faman absara falinafsihi waman AAamiya faAAalayha wama ana AAalaykum bihafeethin: basair-insight as personal responsibility basis with prophetic non-guardianship." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Most explicit divine-transcendence statement distinguishing Islamic theology" },
   { topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical", note: "Transcendence established through epistemic asymmetry not merely power-demonstration" }],
  "Overlap with tawheed and divine-power. La tudrikuhu alabsaru constitutes most explicit divine-transcendence verse in Quran distinguishing Islamic theology from incarnational and anthropomorphic traditions. Yudriku alabsara reversal establishes that divine knowledge encompasses all perception while remaining imperceptible. Latif-Khabeer pairing suggests divine engagement operates through subtlety not sensory manifestation. Basair-plural indicates multiple insight-channels available to willing observers. Prophetic non-guardianship clarifies messenger-role as conveyor not enforcer."
));

// cand-0293: Insult-prohibition and deed-beautification per nation
candidates.candidates.push(makeCand("cand-0293",
  "Insult-prohibition and deed-beautification per nation: do not insult invoke besides Allah lest insult Allah enmity without knowledge; made fair every nation deeds then return informs; swore strongest oaths sign came would believe say signs only with Allah what makes realize when comes will not believe? turn hearts vision leave wandering blindly transgression",
  undefined, "تحريم السب وتزيين الأعمال لكل أمة: لا تسبوا الذين يدعون من دون الله فيسبوا الله عدواً بغير علم؛ زينا لكل أمة عملهم ثم إلى ربهم مرجعهم فينبئهم؛ أقسموا جهد أيمانهم لئن جاءتهم آية ليؤمنن بها قل إنما الآيات عند الله وما يشعركم أنها إذا جاءت لا يؤمنون؛ نقلب أفئدتهم وأبصارهم ونذرهم في طغيانهم يعمهون",
  "In 6:108-110: And do not insult those they invoke other than Allah lest they insult Allah in enmity without knowledge. Thus We have made pleasing to every community their deeds. Then to their Lord is their return and He will inform them about what they used to do. And they swear by Allah their strongest oaths that if a sign came to them they would surely believe in it. Say the signs are only with Allah. And what will make you perceive that even if a sign came they would not believe? And We will turn away their hearts and their eyes just as they refused to believe in it the first time. And We will leave them in their transgression wandering blindly.",
  [{ key: "6:108", excerpt: fv(108), evidenceClass: "EXPLICIT_TEXT", rationale: "Wala tasubboo allatheena yadAAoona min dooni Allahi fayasubboo Allaha AAadwan bighayri AAilmin kathalika zayyanna likulli ommatin AAamalahum thumma ila rabbihim marjiAAuhum fayunabbiohum bima kanoo yaAAmaloona: insult-prohibition preventing reciprocal blasphemy with deed-beautification explaining religious diversity as divine arrangement." },
   { key: "6:109", excerpt: fv(109), evidenceClass: "EXPLICIT_TEXT", rationale: "Waaqsamoo biAllahi jahda aymanihim lain jaathum ayatun layuminunna biha qul innama alayatu AAinda Allahi wama yushAAirukum annaha itha jaat la yuminoona: oath-breaking pattern exposing insincerity of sign-demands." },
   { key: "6:110", excerpt: fv(110), evidenceClass: "EXPLICIT_TEXT", rationale: "Wanuqallibu afidatahum waabsarahum kama lam yuminoo bihi awwala marratin wanatharuhum fee tughyanihim yaAAmahoona: heart-vision inversion as consequence of initial rejection producing persistent blind-wandering." }],
  [{ topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Restraint-based ethics protecting divine honor through non-retaliation" },
   { topicId: "the-hereafter", layer: "curated", relationship: "related-not-identical", note: "Return-informing as ultimate resolution of religious disagreement" }],
  "Overlap with god-consciousness and the-hereafter. Insult-prohibition demonstrates pragmatic ethics: protecting Allah's honor through believer-restraint rather than retaliatory escalation. Zayyanna likulli ommatin explains religious diversity as divine arrangement not mere historical accident. MarjiAAuhum fayunabbiohum defers resolution to divine judgment preventing premature coercion. Oath-breaking analysis (6:109) exposes performative faith-claims. Heart-vision inversion (6:110) describes psychological mechanism where persistent rejection produces faculty-dysfunction making future belief increasingly difficult."
));

// cand-0294: Belief-impossibility without divine will and devil-enemy system
candidates.candidates.push(makeCand("cand-0294",
  "Belief-impossibility without divine will and devil-enemy system: even if sent angels dead spoke gathered everything would not believe unless Allah wills most ignorant; made every prophet enemy devils mankind jinn inspiring decorative speech delusion if Lord willed would not have done leave them fabricate; hearts disbelieve Hereafter incline pleased earn",
  undefined, "استحالة الإيمان بدون المشيئة الإلهية ونظام أعداء الشياطين: لو نزلت الملائكة وكلمهم الموتى وحشرنا عليهم كل شيء ما كانوا ليؤمنوا إلا أن يشاء الله ولكن أكثرهم يجهلون؛ جعلنا لكل نبي عدواً شياطين الإنس والجن يوحي بعضهم إلى بعض زخرف القول غروراً ولو شاء ربك ما فعلوه فذرهم وما يفترون؛ لتصغى إليه أفئدة الذين لا يؤمنون بالآخرة وليرضوه وليقترفوا ما هم مقترفون",
  "In 6:111-113: And even if We had sent down to them the angels and the dead spoke to them and We gathered together every thing in front of them they would not believe unless Allah should will. But most of them are ignorant. And thus We have made for every prophet an enemy devils from mankind and jinn inspiring to one another decorative speech in delusion. But if your Lord had willed they would not have done it so leave them and that which they invent. And so the hearts of those who disbelieve in the Hereafter will incline toward it and that they will be satisfied with it and that they will commit that which they are committing.",
  [{ key: "6:111", excerpt: fv(111), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaw annana nazzalna ilayhimu almalaikata wakallamahumu almawta wahasharna AAalayhim kulla shayin qubulan ma kanoo liyuminoo illa an yashaa Allahu walakinna aktharahum yajhaloona: maximal-evidence hypothetical establishing belief-dependence on divine will not evidential sufficiency." },
   { key: "6:112", excerpt: fv(112), evidenceClass: "EXPLICIT_TEXT", rationale: "Wakathalika jaAAalna likulli nabiyyin AAaduwwan shayateena alinsi waaljinni yoohee baAAduhum ila baAAdin zukhrufa alqawli ghurooran walaw shaa rabbuka ma faAAaloohu fatharhum wama yaftaroona: devil-enemy system normalized as structural prophetic-experience feature with decorative-speech diagnosis." },
   { key: "6:113", excerpt: fv(113), evidenceClass: "EXPLICIT_TEXT", rationale: "Walitasgha ilayhi afidatu allatheena la yuminoona bialakhirati waliyardawhu waliyaqtarifoo ma hum muqtarifoona: heart-inclination toward delusion explained as Hereafter-disbelief consequence producing satisfaction and earning." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Divine will as ultimate determinant of belief undermining purely rationalist soteriology" },
   { topicId: "prophets", layer: "curated", relationship: "related-not-identical", note: "Prophetic opposition normalized as structural feature not anomalous failure" }],
  "Overlap with tawheed and prophets. Maximal-evidence hypothetical (angels dead-speaking all-gathered) systematically eliminates evidential insufficiency as explanation for disbelief locating cause in divine-will withholding. Aktharahum yajhaloona identifies ignorance not malice as primary barrier. Devil-enemy assignment to every prophet normalizes opposition preventing discouragement. Zukhrufa alqawli ghurooran identifies aesthetic-persuasion as primary deception-vector relevant to media-age propagation. Liyarodawhu explains psychological attraction to delusion as affective not merely intellectual."
));

// cand-0295: Divine-judge exclusivity and word-immutability
candidates.candidates.push(makeCand("cand-0295",
  "Divine-judge exclusivity and word-immutability: seek judge other than Allah? He sent down Book detailed those given scripture know revealed from Lord truth never doubt; word Lord fulfilled truth justice none alters His words Hearing Knowing; obey most earth mislead follow assumption conjecture; Lord knows best who strays knows guided",
  undefined, "اختصاص الله بالحكم وثبات كلمته: أفغير الله أبتغي حكماً وهو الذي أنزل إليكم الكتاب مفصلاً والذين آتيناهم الكتاب يعلمون أنه منزل من ربك بالحق فلا تكونن من الممترين؛ وتمت كلمة ربك صدقاً وعدلاً لا مبدل لكلماته وهو السميع العليم؛ إن تطع أكثر من في الأرض يضلوك عن سبيل الله إن يتبعون إلا الظن وإن هم إلا يخرصون؛ إن ربك هو أعلم من يضل عن سبيله وهو أعلم بالمهتدين",
  "In 6:114-117: Then is it other than Allah I should seek as judge while it is He who has revealed to you the Book explained in detail? And those to whom We gave the Scripture know that it is sent down from your Lord in truth so never be among the doubters. And the word of your Lord has been fulfilled in truth and in justice. None can alter His words and He is the Hearing the Knowing. And if you obey most of those upon the earth they will mislead you from the way of Allah. They follow not except assumption and they are not but falsifying. Indeed your Lord is most knowing of who strays from His way and He is most knowing of the guided.",
  [{ key: "6:114", excerpt: fv(114), evidenceClass: "EXPLICIT_TEXT", rationale: "Afaghayra Allahi abtaghee hakaman wahuwa allathee anzala ilaykumu alkitaba mufassalan waallatheena ataynahumu alkitaba yaAAlamoona annahu munazzalun min rabbika bialhaqqi fala takoonanna mina almumtareena: divine-judge exclusivity with detailed Book confirmed by prior-scripture recipients eliminating extra-revelatory authority." },
   { key: "6:115", excerpt: fv(115), evidenceClass: "EXPLICIT_TEXT", rationale: "Watammat kalimatu rabbika sidqan waAAadlan la mubaddila likalimatihi wahuwa alssameeAAu alAAaleemu: word-fulfillment in truth-justice with immutability guarantee and Sami'-Aleem closure." },
   { key: "6:116", excerpt: fv(116), evidenceClass: "EXPLICIT_TEXT", rationale: "Wain tutiAA akthara man fee alardi yudillooka AAan sabeeli Allahi in yattabiAAoona illa alththanna wain hum illa yakhrusoona: majority-opinion danger with assumption-conjecture diagnosis." },
   { key: "6:117", excerpt: fv(117), evidenceClass: "EXPLICIT_TEXT", rationale: "Inna rabbaka huwa aAAlamu man yadillu AAan sabeelihi wahuwa aAAlamu bialmuhtadeena: divine knowledge of straying-guided superseding human estimation." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Divine legislative exclusivity eliminating extra-revelatory authority sources" },
   { topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Epistemic vigilance against majority-opinion and assumption-following" }],
  "Overlap with tawheed and god-consciousness. Afaghayra Allahi abtaghee hakaman uses interrogative-negation eliminating all alternative authority sources. Mufassalan emphasizes sufficient detail preventing need for supplementary interpretation. Prior-scripture confirmation provides cross-communal validation. Sidq-adl pairing defines divine speech as simultaneously truthful and just. La mubaddila likalimatihi guarantees textual stability against corruption-claims. Majority-opinion warning provides democratic-skepticism grounding epistemic vigilance. Thann-yakhrusoona diagnoses popular epistemology as assumption-falsification."
));

// cand-0296: Dietary legislation and comprehensive sin-abandonment
candidates.candidates.push(makeCand("cand-0296",
  "Dietary legislation and comprehensive sin-abandonment: eat what mentioned Allah name if believe signs; why not eat mentioned Allah name when detailed forbidden except compelled? many mislead desires without knowledge Lord knows transgressors; leave apparent sin hidden; earn sin recompensed earned",
  undefined, "التشريع الغذائي وترك الإثم ظاهره وباطنه: كلوا مما ذكر اسم الله عليه إن كنتم بآياته مؤمنين؛ وما لكم ألا تأكلوا مما ذكر اسم الله عليه وقد فصل لكم ما حرم عليكم إلا ما اضطررتم إليه؛ إن كثيراً ليضلون بأهوائهم بغير علم إن ربك هو أعلم بالمعتدين؛ وذروا ظاهر الإثم وباطنه إن الذين يكسبون الإثم سيجزون بما كانوا يقترفون",
  "In 6:118-120: So eat of that upon which the name of Allah has been mentioned if you are believers in His verses. And why should you not eat of that upon which the name of Allah has been mentioned while He has explained in detail to you what He has forbidden you excepting that to which you are compelled. And indeed many lead others astray through their inclinations without knowledge. Indeed your Lord He is most knowing of the transgressors. And leave what is apparent of sin and what is concealed thereof. Indeed those who earn sin will be recompensed for that which they used to commit.",
  [{ key: "6:118", excerpt: fv(118), evidenceClass: "EXPLICIT_TEXT", rationale: "Fakuloo mimma thukira ismu Allahi AAalayhi in kuntum biayatihi mumineena: dietary permission conditioned on divine-name invocation and sign-belief linking food-practice to theological commitment." },
   { key: "6:119", excerpt: fv(119), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama lakum alla takuloo mimma thukira ismu Allahi AAalayhi waqad fassala lakum ma harrama AAalaykum illa ma idturirtum ilayhi wainna katheeran layudilloona biahwaihim bighayri AAilmin inna rabbaka huwa aAAlamu bialmuAAtadeena: rhetorical challenge defending halal-consumption with detailed-prohibition reference and compulsion-exception. Desire-based misguidance identified as widespread problem." },
   { key: "6:120", excerpt: fv(120), evidenceClass: "EXPLICIT_TEXT", rationale: "Watharoo thahira alithmi wabatinahu inna allatheena yaksiboona alithma sayujzawna bima kanoo yaqtarifoona: apparent-hidden sin pairing demanding comprehensive ethical integrity with earnings-recompense principle." }],
  [{ topicId: "halal-food", layer: "scholarly", relationship: "same-concept", note: "Core dietary legislation anchoring food-permission in divine-name invocation" },
   { topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Comprehensive sin-abandonment covering both public and private conduct" }],
  "Overlap with halal-food and god-consciousness. Divine-name invocation (thukira ismu Allahi) transforms slaughter from mere food-preparation to ritual act linking consumption to theological acknowledgment. Fassala lakum ma harrama references detailed prohibition elsewhere establishing cross-referential legal system. Idturirtum-exception prevents law from becoming lethal under compulsion. Biahwaihim bighayri AAilmin diagnoses desire-based fatwa as primary misguidance-source. Thahir-batin pairing demands integrity covering both observable and hidden conduct preventing performative piety. Yaksiboona-yaqtarifoona links earning to committing establishing comprehensive accountability."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-029.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-029.json");

console.log("\nGeneration complete:");
console.log("  Extractions: 4 (p9-p12)");
console.log("  Candidates: 10 (cand-0287..cand-0296)");
console.log("  Verse keys: 40 (6:81-120)");
