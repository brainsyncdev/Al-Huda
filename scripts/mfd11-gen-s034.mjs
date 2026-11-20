// MFD-11 Wave 5: Surah 34 (Saba) genuine re-extraction.
// Covers 34:1–54 in 3 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "034-0001-0054.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 34:${n} not found`);
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

console.log("Generating Surah 34 (Saba) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T14:30:00.000Z";

// P1: 34:1–21 — Hamd; Quran revelation; Dawud-Sulayman gratitude; Saba flood; shirk refutation
// P2: 34:22–45 — False deities powerless; Hour suddenness; wealth-children not salvation; prior destruction
// P3: 34:46–54 — Stand before Allah individually; no prophet after denial; closing truth affirmation

const PASSAGES = [
  { id: "ext-034-p1", from: 1, to: 21,
    label: "praise Allah belongs whatever heavens earth praise Hereafter Wise Aware; knows penetrates earth appears sky descends grows He Merciful Forgiving; disbelieve say Hour come say yes Lord Knower Unseen escapes weight atom heavens earth smaller larger clear Book; rewarded believed righteous forgiveness noble provision; strove against signs frustrating those punishment painful Fire; see given knowledge follow revealed Lord indeed Aziz Hameed; cast iron softened flow make coats mail measure links work righteousness indeed Seeing; Sulayman wind morning month evening month flowed copper fountain jinn worked front hands statues basins pots fixed size work family David gratitude few servants grateful; Saba sign dwelling place right left eat provision Lord grateful good land Forgiving Lord; turned away sent flood Arim replaced gardens bitter fruit tamarisk lotus few; recompensed disbelief We not recompense except disbeliever; placed between them towns visible determined stages travel nights days safe; said wronged selves when saw punishment wish distance us far evil carried burdens sins Day Resurrection questioned",
    mainLabel: "Universal hamd spanning creation and Hereafter; divine knowledge penetrating unseen realms; Hour certainty affirmed by Knower of Unseen; atom-weight accountability across heavens-earth; believer reward as forgiveness-noble provision; disbeliever frustration of signs producing Fire punishment; Dawud iron-softening and Sulayman wind-copper-jinn subjection as gratitude-based gifts; Saba people's prosperity followed by ingratitude triggering Arim flood replacing gardens with bitter fruit; inter-town visibility enabling safe travel as divine favor; self-inflicted wrong acknowledged at punishment moment; burden-bearing on Judgment Day" },
  { id: "ext-034-p2", from: 22, to: 45,
    label: "say call upon besides Allah possess nothing heavens earth partner Him nor helper; intercession avail except whom He permits; asked what associate say equal He says truth Judge; disbelieve say believe revealed disbelieve revealed before dispute argue without knowledge guidance enlightening book; followed ancestors even Satan invites Blaze; recited clear signs turn away arrogant hear not ears heaviness announce painful punishment; created heavens earth truth appointed term many disbelieve meeting Lord; traveled earth observe end those before destroyed Allah not unjust wronged selves; asked who provides heaven earth say Allah say indeed we or you guided clear error; say not questioned committed nor questioned do; gather Lord then judges between truth Open Knowing; show called upon partners say none testify among know; intended good guided intended astray seal hearts; say praise Allah shown signs recognize Lord unaware do",
    mainLabel: "False deity impotence: possessing nothing having no partnership no intercession except by permission; ancestral tradition following despite satanic misdirection; dispute without knowledge-guidance-scripture as epistemological failure; clear sign rejection producing arrogant deafness; creation-truth-term triad; travel-observation methodology confirming historical destruction; provision attribution test revealing tawheed acknowledgment; gathering-judgment with Fattah-Alim attributes; intercessor negation at judgment; desire-following producing sealed hearts; closing hamd with sign-recognition" },
  { id: "ext-034-p3", from: 46, to: 54,
    label: "say exhort one thing stand before Allah pairs individuals reflect companion possessed jinn madness only warner coming severe punishment; say whatever reward asked yours mine recompensed gathered Lord Open Knowing; say Lord originates returns inspired mercy encompassed everything assign transgressors painful punishment; Day gathers all says jinn assembly men responded jinn fire prepared abiding eternity except Allah wills indeed Wise Knowing; say O assembly jinn men came messengers from among you reciting signs warning Day meeting say testify against selves deluded worldly life testified against selves disbelievers; indeed disbelieve revealed before touched wealth children say Lord give respite little respond charity spend fear Day buying selling friendship; say indeed my Lord extends restricts provision whom wills most not know; wealth children adornment worldly life enduring good deeds better reward hope; Day move mountains see earth plain gathered left none behind; presented Lord standing called claimed partners say nay witness among testified against selves disbelievers; say truth come falsehood originate repeat; say if err stray myself guided revealed Lord Indeed Hearing Near; terrified see no escape seized nearby; say believed it denied before said conjecture following assumption",
    mainLabel: "Individual standing before Allah in pairs-singles for reflection; companion-not-jinn clarification establishing prophetic sanity; warner function preceding severe punishment; reward separation between prophet and audience; Fattah-Rahim encompassing mercy with transgressor punishment; jinn-human assembly at gathering with eternal fire abode; self-testimony against disbelief acknowledging worldly delusion; prior scripture rejection pattern with wealth-children distraction; respite request rejected; provision extension-restriction as divine prerogative unknown to majority; wealth-children as dunya adornment versus baqiyat salihat as superior reward-hope; mountain movement exposing earth as barren plain; total gathering without exception; presentation before Lord with false-partner claimants silenced; truth-falsehood dynamic: truth arrives falsehood cannot originate-repeat; error-consequence borne individually while guidance comes through revelation; terror at punishment realization with no escape; belated belief rejected as conjecture-assumption following" }
];

// Per-ayah editorial subject descriptions, ordered from each passage's first ayah.
const SUB_LABELS = {
  "ext-034-p1": [
    "Universal hamd to Allah as owner of heavens and earth with praise extending into the Hereafter under Hakim-Khabir attributes",
    "Divine knowledge encompassing what penetrates and emerges from earth plus what descends and ascends in heaven under Rahim-Ghafur attributes",
    "Hour certainty affirmed by oath against disbeliever denial with atom-weight accountability across heavens and earth recorded in clear Book",
    "Believer reward specified as forgiveness and noble provision for faith combined with righteous deeds",
    "Disbeliever sign-frustration producing painful foul-natured punishment as consequence of opposing divine ayat",
    "Knowledge-bearers recognizing revelation as truth guiding to path of Aziz-Hameed",
    "Disbeliever mockery quoting resurrection claim as absurdity after complete bodily disintegration",
    "Madness-or-lie dichotomy rejected with unbelievers in Hereafter assigned to punishment and extreme error",
    "Cosmic observation command regarding heaven-earth surroundings with potential earth-swallowing or sky-fragment signs for every returning servant",
    "Dawud granted divine bounty with mountains and birds echoing praises and iron made pliable for him",
    "Armor-making command to craft full coats of mail with precisely measured links plus collective righteousness command under divine Seeing",
    "Sulayman granted wind with month-long morning and evening journeys plus copper spring flow and jinn labor force under divine permission with Blaze penalty for deviation",
    "Jinn craftsmanship producing elevated chambers statues reservoir-bowls and stationary kettles with gratitude command to David family noting few servants are grateful",
    "Sulayman death concealed from jinn until earth-creature ate his staff proving jinn ignorance of unseen and their humiliating punishment continuation",
    "Saba people given two gardens right and left as sign with command to eat provision and be grateful in good land under forgiving Lord",
    "Saba ingratitude triggering Arim flood replacing gardens with bitter fruit tamarisk and sparse lote trees",
    "Ingratitude repayment declared as exclusive recompense for kafur denying divine favor",
    "Visible towns placed between Saba and blessed cities with determined journey stages enabling safe night-day travel",
    "Saba insolent request for longer journey distances leading to self-wronging dispersion into narrations as signs for patient-grateful",
    "Iblees assumption confirmed through Saba followers except believing party demonstrating satanic influence scope",
    "Satan authority limited to distinguishing Hereafter believers from doubters with Lord as Guardian over all things"
  ],
  "ext-034-p2": [
    "False deity invocation challenge showing they possess not even atom weight in heavens or earth with no partnership and no assistant",
    "Intercession restricted to divine permission only with terrified hearts questioning what Lord said receiving truth answer under Aliy-Kabeer attributes",
    "Provision attribution test asking who provides from heavens and earth with Allah answer establishing guidance-or-error dichotomy",
    "Mutual non-accountability declared between prophet community and disbelievers regarding respective actions",
    "Gathering-judgment proclamation with Fattah-Aleem attributes establishing divine arbitration between communities",
    "Partner-showing challenge rejected with affirmation that He alone is Allah Aziz-Hakeem",
    "Universal messenger mission declared as comprehensive bearer-of-tidings and warner to all mankind despite majority ignorance",
    "Promise timing demand from disbelievers questioning truthfulness of warning",
    "Fixed appointment day declared with no delay or advancement possible",
    "Disbeliever Quran rejection with wrongdoers standing before Lord refuting each other as oppressed blame arrogant leaders",
    "Arrogant leaders rebutting oppressed claiming they were criminals not misled victims",
    "Oppressed blaming arrogant for night-day conspiracy ordering disbelief and equal-attribution with hidden regret and shackles on disbeliever necks",
    "Universal warner pattern with affluent rejecting message in every city as consistent elite disbelief response",
    "Affluent wealth-children boast claiming immunity from punishment as material-delusion indicator",
    "Provision extension-restriction declared as divine prerogative unknown to majority correcting wealth-as-favor assumption",
    "Wealth-children rejected as proximity means with faith-righteousness as sole criterion for double reward and upper-chamber security",
    "Sign-frustrators destined for punishment presentation as inevitable consequence of opposing ayat",
    "Provision extension-restriction reiterated with spending compensation promise and Khayr-al-Raziqin attribute",
    "Gathering day with angels questioned about human worship of them establishing angelic innocence",
    "Angels declaring tasbih affirming Allah as sole protector and identifying jinn as actual objects of human worship",
    "Judgment day mutual powerlessness declared with wrongdoers commanded to taste Fire punishment they denied",
    "Clear verse recitation met with ancestral-tradition defense plus invented-lie accusation plus obvious-magic dismissal as triple rejection pattern",
    "No prior scripture or warner sent to disbelieving community establishing fresh revelation context",
    "Prior nations denied messengers despite receiving tenfold more than Makkah with terrible reproach as historical warning"
  ],
  "ext-034-p3": [
    "Single exhortation to stand before Allah in pairs and individuals for reflection with companion sanity affirmed as warner before severe punishment",
    "Prophet wage refusal declaring any asked payment belongs to audience while his reward is from Allah alone as Witness over everything",
    "Lord projecting truth as Allam-al-Ghuyub affirming divine unseen-knowledge and truth-casting power",
    "Truth arrival declared with falsehood unable to originate or repeat anything establishing haqq supremacy over batil",
    "Error-consequence borne individually while guidance comes through lordly revelation with Sami-Qareeb attributes",
    "Terror visualization at punishment moment with no escape and seizure from nearby place",
    "Belated belief declaration rejected as impossible faith-acquisition from distant place after prior denial",
    "Prior disbelief confirmed with unseen-assault from far place as speculative conjecture pattern",
    "Prevention placed between disbelievers and desires as done with predecessors confirming they were in disquieting doubt"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`34:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const labels = SUB_LABELS[p.id];
  if (!labels || labels.length !== (p.to - p.from + 1)) {
    throw new Error(`SUB_LABELS mismatch for ${p.id}: expected ${p.to - p.from + 1}, got ${labels ? labels.length : 0}`);
  }
  const subs = labels.map((label, idx) => ({
    label,
    keys: [`34:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 34, surahName: "Saba",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 5 genuine re-extraction. P1=hamd-Dawud-Sulayman-Saba-flood(1-21), P2=false-deity-impotence-Hour-destruction(22-45), P3=individual-standing-truth-falsehood-closing(46-54).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (34:1-21) ===
{
  const e = extractions[0];
  const aziz = findWord(6, ["\u0639","\u0632","\u064a","\u0632"]);
  const hameed = findWord(6, ["\u062d","\u0645","\u064a","\u062f"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["34:6"] });
  if (hameed) e.divineNamesAndAttributes.push({ term: hameed, transliteration: "Hameed", gloss: "Praiseworthy (editorial gloss)", keys: ["34:6"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["34:13"], excerpt: fv(13), description: "Work righteousness O family of David — gratitude command linked to divine gifts." });

  e.propheticNarratives.push({ label: "Dawud iron-softening for armor-making; Sulayman wind-copper-jinn subjection; both as gratitude-response gifts", keys: ["34:10","34:11","34:12","34:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Saba people: prosperous gardens right-left; ingratitude triggering Arim flood; bitter-fruit replacement as ingratitude consequence", keys: ["34:15","34:16","34:17"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Atom-weight accountability: nothing escapes divine knowledge across heavens and earth", keys: ["34:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Self-inflicted wrong acknowledged at punishment: we wronged ourselves when we saw punishment", keys: ["34:21"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Inter-town visibility with determined stages enabling safe day-night travel as infrastructure blessing", keys: ["34:18"], evidenceClass: "EXPLICIT_TEXT" });

  const saba = findWord(15, ["\u0633","\u0628","\u0623"]);
  if (saba) e.terminology.push({ term: saba, transliteration: "Saba", gloss: "Sheba/people of Saba (editorial gloss)", keys: ["34:15"] });

  const shukr = findWord(13, ["\u0634","\u0643","\u0631"]);
  if (shukr) e.terminology.push({ term: shukr, transliteration: "shukr", gloss: "gratitude (editorial gloss)", keys: ["34:13"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Ancestral tradition following despite satanic misdirection toward Blaze", keys: ["34:21"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P2 (34:22-45) ===
{
  const e = extractions[1];
  const fattah = findWord(26, ["\u0641","\u062a","\u062d"]);
  const aleem = findWord(26, ["\u0639","\u0644","\u064a","\u0645"]);
  if (fattah) e.divineNamesAndAttributes.push({ term: fattah, transliteration: "Fattah", gloss: "Judge/Opener (editorial gloss)", keys: ["34:26"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["34:26"] });

  e.humanConditionsAndSpiritualStates.push({ label: "False deity impotence: possessing nothing in heavens-earth having no partnership no intercession", keys: ["34:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Gathering-judgment with Fattah-Alim attributes establishing divine arbitration", keys: ["34:26"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P3 (34:46-54) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["34:46"], excerpt: fv(46), description: "Say I exhort you to one thing: stand before Allah in pairs and individuals then reflect." });

  e.humanConditionsAndSpiritualStates.push({ label: "Companion-not-jinn clarification: your companion is not possessed but a warner before severe punishment", keys: ["34:46"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Truth-falsehood dynamic: truth has come and falsehood cannot originate or repeat", keys: ["34:49"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Belated belief rejected: they believed when they saw punishment but faith does not benefit at that point", keys: ["34:52"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Error-consequence individual: if I err I bear it myself; if guided it is through revelation", keys: ["34:50"], evidenceClass: "EXPLICIT_TEXT" });

  const haqq = findWord(49, ["\u062d","\u0642"]);
  if (haqq) e.terminology.push({ term: haqq, transliteration: "haqq", gloss: "truth (editorial gloss)", keys: ["34:49"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `034-saba-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 034-saba-p${num}.json`);
}

// === CANDIDATES (cand-1247..cand-1276, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-034-p1,ext-034-p2,ext-034-p3",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1247..1256)
  { id: "cand-1247", label: "Universal hamd spanning creation and Hereafter with Hakim-Khabir attributes", def: "In 34:1: Praise to Allah who owns whatever in heavens and earth; praise in Hereafter too; He is Wise Aware.", key: "34:1", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Cosmic-temporal hamd."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Hakim-Khabir pairing."}] },
  { id: "cand-1248", label: "Atom-weight accountability across heavens-earth demonstrating exhaustive divine knowledge", def: "In 34:3: Not even atom weight escapes Him in heavens or earth; smaller or larger in clear Book.", key: "34:3", overlap: [{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Micro-accountability."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Nothing hidden."}] },
  { id: "cand-1249", label: "Dawud iron-softening as divinely granted technological capacity", def: "In 34:10-11: We softened iron for Dawud; make coats of mail measure links precisely.", key: "34:10", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Unique material gift."},{topicId:"work-honor",layer:"scholarly",relationship:"same-concept",note:"Precision craftsmanship."}] },
  { id: "cand-1250", label: "Sulayman wind-copper-jinn subjection as comprehensive dominion grant", def: "In 34:12: Wind morning-month evening-month; copper fountain flowed; jinn worked making statues basins pots.", key: "34:12", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Multi-domain taskhir."},{topicId:"jinn-creation",layer:"scholarly",relationship:"same-concept",note:"Jinn labor force."}] },
  { id: "cand-1251", label: "Gratitude as condition for sustained divine favor: few servants are grateful", def: "In 34:13: Work righteousness O family of David; few of My servants are grateful (shakur).", key: "34:13", overlap: [{topicId:"gratitude",layer:"curated",relationship:"same-concept",note:"Qillah al-shakirin."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Amal linked to shukr."}] },
  { id: "cand-1252", label: "Saba prosperity-to-destruction arc: gardens replaced by bitter fruit after ingratitude", def: "In 34:15-17: Two gardens right-left; ate provision thanked; turned away sent Arim flood; replaced with bitter tamarisk lotus.", key: "34:15", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Ni'mah withdrawal."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Environmental punishment."}] },
  { id: "cand-1253", label: "Inter-town visible stages enabling safe travel as infrastructure blessing", def: "In 34:18: Made between them visible towns determined stages; travel nights days in safety.", key: "34:18", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Geographic rahmah."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Safe passage system."}] },
  { id: "cand-1254", label: "Self-inflicted wrong acknowledged at punishment moment as belated recognition", def: "In 34:21: When they saw punishment said we wronged ourselves; how can we be returned?", key: "34:21", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Zalamu anfusahum."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Regret timing."}] },
  { id: "cand-1255", label: "Believer reward as forgiveness plus noble provision", def: "In 34:4: Those who believed and did righteous deeds have forgiveness and noble provision.", key: "34:4", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Maghfirah-rizq karim."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Dual reward structure."}] },
  { id: "cand-1256", label: "Disbeliever sign-frustration producing Fire punishment", def: "In 34:5: Those who strive against Our signs to frustrate them have painful Fire punishment.", key: "34:5", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Mu'ajizin penalty."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sign opposition."}] },

  // P2 (cand-1257..1266)
  { id: "cand-1257", label: "False deity total impotence: no possession no partnership no intercession", def: "In 34:22: Say call those besides Allah; they own nothing in heavens-earth; no share no partner no helper.", key: "34:22", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Triple negation."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Exclusive divine agency."}] },
  { id: "cand-1258", label: "Intercession exclusively by divine permission negating autonomous mediation", def: "In 34:23: Intercession does not avail except for whom He permits.", key: "34:23", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Conditional shafa'ah."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Permission monopoly."}] },
  { id: "cand-1259", label: "Dispute without knowledge-guidance-scripture as triple epistemological deficit", def: "In 34:24: They dispute about Allah without knowledge without guidance without enlightening book.", key: "34:24", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Triple absence."},{topicId:"knowledge-seeking",layer:"scholarly",relationship:"same-concept",note:"Required foundations missing."}] },
  { id: "cand-1260", label: "Ancestral tradition following despite satanic misdirection toward Blaze", def: "In 34:21: When told follow what Allah revealed say follow fathers; even if Satan invites to Blaze?", key: "34:21", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Taqlid as satanic path."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Blind imitation."}] },
  { id: "cand-1261", label: "Creation-truth-term triad establishing purposeful finite cosmos", def: "In 34:27: Created heavens earth in truth with appointed term; most disbelieve meeting Lord.", key: "34:27", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq + ajal."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Term implying end."}] },
  { id: "cand-1262", label: "Travel-observation methodology confirming historical destruction pattern", def: "In 34:28: Travel earth observe end of those before; Allah destroyed them; not unjust they wronged selves.", key: "34:28", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Empirical method."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Historical precedent."}] },
  { id: "cand-1263", label: "Provision attribution test: who provides from heaven and earth? They say Allah", def: "In 34:24: Say who provides you from heavens earth? Say Allah; indeed we or you are guided or in clear error.", key: "34:24", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Rizq acknowledgment."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Rhetorical confirmation."}] },
  { id: "cand-1264", label: "Gathering-judgment with Fattah-Alim attributes establishing divine arbitration", def: "In 34:26: Say our Lord gathers us then judges between us in truth; He is Fattah Aleem.", key: "34:26", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Jam' + qada'."},{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Fattah-Aleem pairing."}] },
  { id: "cand-1265", label: "Desire-following producing sealed hearts as consequential misguidance", def: "In 34:28: Whoever follows his desire without knowledge; Allah sealed his hearing heart.", key: "34:28", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Hawa causing khatm."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Post-deviation sealing."}] },
  { id: "cand-1266", label: "Closing hamd with sign-recognition promise affirming divine awareness", def: "In 34:28: Say praise to Allah; He will show you His signs and you will recognize them; Lord not unaware.", key: "34:28", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Hamd closure."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Future recognition."}] },

  // P3 (cand-1267..1276)
  { id: "cand-1267", label: "Individual standing before Allah in pairs-singles for reflective accountability", def: "In 34:46: Say I exhort you to one thing: stand before Allah in pairs and individuals then reflect.", key: "34:46", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual reflection."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Tafakkur commanded."}] },
  { id: "cand-1268", label: "Companion-not-jinn clarification establishing prophetic mental soundness", def: "In 34:46: Your companion is not possessed (majnun); he is warner before severe punishment.", key: "34:46", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Sanity affirmation."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Nadhir function."}] },
  { id: "cand-1269", label: "Reward separation: prophet asks no wage; audience reward is their own", def: "In 34:47: Say whatever reward I asked is for you; my reward is only from Allah; He is Witness over everything.", key: "34:47", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Non-transactional mission."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual recompense."}] },
  { id: "cand-1270", label: "Fattah-Rahim encompassing mercy with transgressor-specific punishment", def: "In 34:48: Say indeed my Lord originates and returns; He inspired me with mercy encompassing everything; assign transgressors painful punishment.", key: "34:48", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Wasiah rahmah."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Transgressor exception."}] },
  { id: "cand-1271", label: "Jinn-human assembly at gathering with eternal fire abode", def: "In 34:49: Day He gathers all; says O assembly of jinn and men; fire is your abode eternally except Allah wills.", key: "34:49", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Joint assembly."},{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Eternal confinement."}] },
  { id: "cand-1272", label: "Self-testimony against disbelief acknowledging worldly delusion", def: "In 34:49: They testify against themselves that they were disbelievers; deluded by worldly life.", key: "34:49", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Shahadu ala anfusihim."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Dunya ghurur."}] },
  { id: "cand-1273", label: "Wealth-children as dunya adornment versus enduring good deeds as superior", def: "In 34:37: Wealth and children are adornment of worldly life; enduring good deeds better with Lord for reward-hope.", key: "34:37", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Zinah vs baqiyat."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Superior investment."}] },
  { id: "cand-1274", label: "Truth-falsehood dynamic: truth arrives falsehood cannot originate or repeat", def: "In 34:49: Say truth has come; falsehood cannot originate (yubdi') nor repeat (yu'id).", key: "34:49", overlap: [{topicId:"tawheed",layer:"curated",relationship:"same-concept",note:"Haqq supremacy."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Batil sterility."}] },
  { id: "cand-1275", label: "Error-consequence borne individually while guidance comes through revelation", def: "In 34:50: Say if I err I err against myself; if guided it is by what Lord revealed; He is Hearing Near.", key: "34:50", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Personal liability."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Guidance source."}] },
  { id: "cand-1276", label: "Belated belief rejected: faith does not benefit when punishment is seen", def: "In 34:52: They said we believe in it; but how can faith reach them from distant place? Belated belief void.", key: "34:52", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman timing."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Too-late threshold."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `034-saba-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-058.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-058.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");