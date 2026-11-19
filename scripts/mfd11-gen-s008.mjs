// MFD-11 Al-Anfal Pass A generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Anfal 8:1-75 (Passages 1-3, Candidates cand-0377..cand-0406).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "008-0001-0075.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 8:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Al-Anfal Pass A files from verbatim corpus (8:1-75)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T10:00:00.000Z";

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

// ─── Passage 1: 8:1–29 ────────────────────────────────────────────────────────
const p1 = {
  extractionId: "ext-008-p1",
  workstream: "MFD-11",
  pass: "A",
  surah: 8,
  surahName: "Al-Anfal",
  passage: {
    fromAyah: 1,
    toAyah: 29,
    label: "Al-Anfal — Anfal belong to Allah and Messenger; fear Allah amend between you obey Allah Messenger if believers; true believers hearts tremble when Allah mentioned verses recited increase faith rely on Lord establish prayer spend from provision; those are believers truly degrees forgiveness noble provision; as Lord brought you out home truth party believers unwilling arguing truth after clear as if driven death looking on; Allah promised one two groups yours wished unarmed one yours Allah intended establish truth words cut root disbelievers; establish truth abolish falsehood even criminals disliked; asked help Lord answered reinforce thousand angels following; made only good tidings hearts assured victory only from Allah Aziz Hakeem; overwhelmed drowsiness security sent rain purify remove rijz shaytan bind hearts plant feet; Lord inspired angels I with you strengthen believers cast terror hearts disbelievers strike necks strike fingertips; because opposed Allah Messenger whoever opposes severe penalty; taste it disbelievers punishment Fire; O believers meet disbelievers advancing do not turn backs; whoever turns back unless swerving battle joining company returned anger Allah refuge Hell wretched destination; did not kill them Allah killed them threw not when threw Allah threw test believers good test SameeAA Aleem; weaken plot disbelievers; seek victory defeat come desist best return We return company avail nothing even increased Allah with believers; obey Allah Messenger do not turn away hearing; do not be like said heard not hearing; worst creatures deaf dumb not reason; Allah knew good made hear turned away refusing; respond Allah Messenger calls gives life know Allah intervenes man heart gathered; fear fitnah not strike wronged exclusively severe penalty; remember few oppressed land fearing abduction sheltered supported victory provided good things grateful; do not betray Allah Messenger betray trusts knowing; wealth children fitnah Allah great reward; O believers fear Allah makes furqan removes misdeeds forgives Dhu Fadl Azeem"
  },
  verseKeys: Array.from({length:29}, (_,i) => `8:${i+1}`),
  arabicExcerpts: Array.from({length:29}, (_,i) => ({ key: `8:${i+1}`, text: fv(i+1) })),
  mainSubject: {
    label: "Anfal归属Allah和使者；真信士定义（心颤、信仰增加、托靠主、立拜功、费用）；Badr神圣干预叙事（天使援助、降雨净化、恐惧投入不信者心中）；服从命令与违抗警告；逃跑禁令及例外；杀敌归因于Allah而非人；不信者阴谋失败；顺从回应给予生命者；fitnah警告；昔日弱势蒙恩回忆；背叛禁令；财富儿女是考验；taqwa带来furqan",
    keys: Array.from({length:29}, (_,i) => `8:${i+1}`),
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Anfal归属Allah和使者：决定权不在人", keys: ["8:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taqwa、修复关系、服从作为信仰条件", keys: ["8:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "真信士四特征：心颤、信仰增加、托靠、立拜功费用", keys: ["8:2","8:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "真信士回报：品级、饶恕、尊贵给养", keys: ["8:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "部分信士不情愿出战如同被驱向死亡", keys: ["8:5","8:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah应许两队之一、信士希望无武装队、Allah要以言辞确立真理", keys: ["8:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "确立真理废除虚妄即使罪人厌恶", keys: ["8:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "求援得应：一千天使接续援助", keys: ["8:9"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "天使援助仅为报喜安心、胜利唯来自Allah", keys: ["8:10"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "瞌睡为安宁、降雨净化、去除shaytan污秽、坚定心志脚步", keys: ["8:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "启示天使：我与你们同在、坚固信士、投恐惧于不信者心", keys: ["8:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "打击脖颈指尖的具体战斗指令", keys: ["8:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "惩罚原因：对抗Allah和使者", keys: ["8:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "不信者品尝火刑", keys: ["8:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "临阵脱逃禁令", keys: ["8:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "战术迂回或归队例外、违者遭怒狱", keys: ["8:16"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "杀敌归因Allah非人、投掷归因Allah非使者、美好考验", keys: ["8:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah削弱不信者计谋", keys: ["8:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "对不信者宣告：求胜已败、停战为佳、再犯必再击、人数无用", keys: ["8:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "服从命令重申、勿转身离去", keys: ["8:20"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "口头听闻实未听者的比喻", keys: ["8:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "最劣生物：聋哑不用理智", keys: ["8:22"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah若知善必使闻、即使闻仍背弃", keys: ["8:23"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "回应给予生命者的召唤、Allah介入人心之间", keys: ["8:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fitnah不限于不义者、严厉刑罚警告", keys: ["8:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "忆昔日少数受压迫、获庇护援助佳美给养", keys: ["8:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "禁止背叛Allah使者和信托", keys: ["8:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "财富儿女是考验、Allah有大报酬", keys: ["8:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taqwa带来furqan、消除罪行、饶恕、大恩", keys: ["8:29"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0377","cand-0378","cand-0379","cand-0380","cand-0381","cand-0382","cand-0383","cand-0384","cand-0385","cand-0386"],
  notes: "Pass A Al-Anfal passage 1/3. Opening anfal ruling establishes divine-prophetic authority over war spoils preventing tribal disputes. True-believer definition (8:2-4) provides measurable spiritual criteria linking internal states (heart-trembling faith-increase) to external practices (prayer spending). Badr narrative (8:5-19) systematically attributes every military outcome to divine agency: angel reinforcement as psychological comfort not combat force (8:10), rain as purification ritual (8:11), terror-casting as divine action (8:12), killing attributed to Allah not fighters (8:17). Flight prohibition (8:15-16) includes tactical exceptions showing military realism within theological framework. Divine-intervention-between-man-and-heart (8:24) establishes intimate divine access to human interiority. Furqan promise (8:29) links taqwa to discernment capacity providing epistemological reward for ethical commitment.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P1 commands and prohibitions
p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:1"], excerpt: fv(1), description: "Command: fear Allah amend relations between you obey Allah and His Messenger." });
p1.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["8:15"], excerpt: fv(15), description: "Prohibition: do not turn your backs to disbelievers advancing for battle." });
p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:20"], excerpt: fv(20), description: "Command: obey Allah and His Messenger do not turn from him while you hear." });
p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:24"], excerpt: fv(24), description: "Command: respond to Allah and Messenger when he calls you to what gives you life." });
p1.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["8:27"], excerpt: fv(27), description: "Prohibition: do not betray Allah and the Messenger or betray your trusts." });

// P1 divine names
{
  const t1 = findWordContaining(10, ["\u0639","\u0632","\u064a","\u0632"]); // AAazeezun
  const t2 = findWordContaining(10, ["\u062d","\u0643","\u064a","\u0645"]); // hakeemun
  if (t1 && t2) {
    const fullText = fv(10);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p1.divineNamesAndAttributes.push({ term: phrase, transliteration: "Azeez Hakeem", gloss: "Exalted Mighty Wise (editorial gloss)", keys: ["8:10"] });
    }
  }
}
{
  const t1 = findWordContaining(17, ["\u0633","\u0645","\u064a","\u0639"]); // sameeAAun
  const t2 = findWordContaining(17, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t1 && t2) {
    const fullText = fv(17);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p1.divineNamesAndAttributes.push({ term: phrase, transliteration: "SameeAA Aleem", gloss: "Hearing Knowing (editorial gloss)", keys: ["8:17"] });
    }
  }
}
{
  const t = findWordContaining(13, ["\u0634","\u062f","\u064a","\u062f"]); // shadeedu
  if (t) {
    const t2 = findWordContaining(13, ["\u0639","\u0642","\u0627","\u0628"]); // alAAiqabi
    if (t2) {
      const fullText = fv(13);
      const idx1 = fullText.indexOf(t);
      const idx2 = fullText.indexOf(t2);
      if (idx1 >= 0 && idx2 > idx1) {
        const phrase = fullText.slice(idx1, idx2 + t2.length);
        p1.divineNamesAndAttributes.push({ term: phrase, transliteration: "Shadeed al-Iqab", gloss: "Severe in Penalty (editorial gloss)", keys: ["8:13"] });
      }
    }
  }
}
{
  const t = findWordContaining(29, ["\u0641","\u0636","\u0644"]); // alfadli
  if (t) {
    const t2 = findWordContaining(29, ["\u0639","\u0638","\u064a","\u0645"]); // alAAatheemi
    if (t2) {
      const fullText = fv(29);
      const idx1 = fullText.indexOf(t);
      const idx2 = fullText.indexOf(t2);
      if (idx1 >= 0 && idx2 > idx1) {
        const phrase = fullText.slice(idx1, idx2 + t2.length);
        p1.divineNamesAndAttributes.push({ term: phrase, transliteration: "Dhu al-Fadl al-Azeem", gloss: "Possessor of Great Bounty (editorial gloss)", keys: ["8:29"] });
      }
    }
  }
}

// P1 terminology
{
  const t = findWordContaining(1, ["\u0623","\u0646","\u0641","\u0627","\u0644"]); // alanfali
  if (t) p1.terminology.push({ term: t, transliteration: "anfal", gloss: "spoils of war/bounties (editorial gloss)", keys: ["8:1"] });
}
{
  const t = findWordContaining(11, ["\u0631","\u062c","\u0632"]); // rijza
  if (t) p1.terminology.push({ term: t, transliteration: "rijz", gloss: "evil suggestion/defilement (editorial gloss)", keys: ["8:11"] });
}
{
  const t = findWordContaining(25, ["\u0641","\u062a","\u0646"]); // fitnatan
  if (t) p1.terminology.push({ term: t, transliteration: "fitnah", gloss: "trial/persecution (editorial gloss)", keys: ["8:25"] });
}
{
  const t = findWordContaining(29, ["\u0641","\u0631","\u0642","\u0627","\u0646"]); // furqanan
  if (t) p1.terminology.push({ term: t, transliteration: "furqan", gloss: "criterion/distinction (editorial gloss)", keys: ["8:29"] });
}

// P1 human conditions
p1.humanConditionsAndSpiritualStates.push({ label: "Heart trembling (wajilat quloobuhum) as authentic faith indicator", keys: ["8:2"], evidenceClass: "EXPLICIT_TEXT" });
p1.humanConditionsAndSpiritualStates.push({ label: "Reluctance toward combat despite faith: believers karrihoon", keys: ["8:5"], evidenceClass: "EXPLICIT_TEXT" });
p1.humanConditionsAndSpiritualStates.push({ label: "Drowsiness as divine security (amanatan minhu) before battle", keys: ["8:11"], evidenceClass: "EXPLICIT_TEXT" });

writeFileSync(path.join(OUT_DIR, "extractions", "008-al-anfal-p1.json"), JSON.stringify(p1, null, 2) + "\n");
console.log("Wrote 008-al-anfal-p1.json");

// ─── Passage 2: 8:30–49 ──────────────────────────────────────────────────────
const p2 = {
  extractionId: "ext-008-p2",
  workstream: "MFD-11",
  pass: "A",
  surah: 8,
  surahName: "Al-Anfal",
  passage: {
    fromAyah: 30,
    toAyah: 49,
    label: "Al-Anfal — Disbelievers plotted restrain kill evict they plan Allah plans best planners; verses recited say heard could say like this legends former peoples; prayed rain stones painful punishment; Allah would not punish while you among them nor while seeking forgiveness; why not punish obstructing Masjid Haram not guardians only muttaqoon but most not know; prayer at House whistling clapping taste punishment disbelief; disbelievers spend wealth avert from Allah way spend regret overcome gathered Hell; distinguish wicked good heap wicked together put Hell losers; say disbelievers cease forgiven past return precedent ancients passed; fight until no fitnah religion entirely for Allah cease Allah Seeing; turn away know Allah mawlakum excellent protector helper; know whatever booty obtained fifth for Allah Messenger near relatives orphans needy traveler believed Allah sent down Servant day Furqan day two armies met Allah Qadeer; near valley far side caravan lower missed appointment Allah accomplish matter destined perish evidence live evidence SameeAA Aleem; dream showed few many would fail dispute Allah saved Knowing breasts; showed few eyes made few their eyes accomplish matter returned Allah; O believers encounter company stand firm remember Allah much succeed; obey Allah Messenger do not dispute lose courage strength depart be patient Allah with sabireen; do not be like came homes insolently seen people avert from Allah way Allah encompassing; Satan adorned deeds said no one overcomes today I am protector saw two armies turned heels disassociated see what you not see fear Allah severe penalty"
  },
  verseKeys: Array.from({length:20}, (_,i) => `8:${i+30}`),
  arabicExcerpts: Array.from({length:20}, (_,i) => ({ key: `8:${i+30}`, text: fv(i+30) })),
  mainSubject: {
    label: "Disbeliever plotting against Prophet neutralized by superior divine planning; Quran-dismissal as recycled ancestral legends; challenge-prayer for punishment answered by immunity during Prophet's presence; Masjid al-Haram guardianship restricted to muttaqoon; pagan prayer reduced to whistling-clapping; disbeliever spending leads to regret and Hell; khabees-tayyib separation principle; cease-offer with forgiveness-return condition; fighting until fitnah ends and religion belongs to Allah; khums five-way distribution tied to belief in Furqan-day revelation; Badr topography and dream-vision as divine orchestration ensuring evidentiary clarity; battlefield conduct commands emphasizing dhikr-obedience-patience; Satan's false protection abandoned at confrontation revealing divine severity",
    keys: Array.from({length:20}, (_,i) => `8:${i+30}`),
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Disbeliever triple plot: restrain kill evict; Allah as best planner", keys: ["8:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Quran dismissed as asateer al-awwaleen", keys: ["8:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge-prayer for stones/punishment from sky", keys: ["8:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dual immunity: Prophet's presence and istighfar prevent punishment", keys: ["8:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Masjid Haram obstruction justifies punishment; guardianship limited to muttaqoon", keys: ["8:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pagan prayer at Kaaba: hanya whistling and tasdiyah clapping", keys: ["8:35"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wealth spent to avert from Allah becomes hasrah then defeat", keys: ["8:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khabees-tayyib separation: wicked heaped into Hell", keys: ["8:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cease-offer: past forgiven; return triggers sunnat al-awwaleen", keys: ["8:38"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fight until no fitnah and religion entirely for Allah", keys: ["8:39"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah as mawla and naseer upon enemy withdrawal", keys: ["8:40"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khums five-way distribution: Allah Messenger relatives orphans needy traveler", keys: ["8:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yawm al-Furqan yawm iltaqa al-jam'aan as revelation anchor", keys: ["8:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Badr topography: near bank far bank caravan below; missed appointment divinely ordained", keys: ["8:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Perish-upon-evidence live-upon-evidence principle", keys: ["8:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet's dream: enemy shown few preventing failure-dispute", keys: ["8:43"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual minimization: each army appeared few to other fulfilling divine decree", keys: ["8:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Battlefield commands: stand firm abundant dhikr for success", keys: ["8:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Obedience-no dispute-patience triad; Allah with sabireen", keys: ["8:46"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Meccan departure characterized by batar and ri'a; averting from Allah's way", keys: ["8:47"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Satan adorned deeds claimed protection fled at confrontation citing fear of Allah", keys: ["8:48"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0387","cand-0388","cand-0389","cand-0390","cand-0391","cand-0392","cand-0393","cand-0394","cand-0395","cand-0396"],
  notes: "Pass A Al-Anfal passage 2/3. Makr-counter-makr framing (8:30) establishes asymmetry between human plotting and divine planning. Asateer dismissal (8:31) documents standard rejection rhetoric. Challenge-prayer (8:32) shows hostile demand for proof met with mercy-explanation (8:33). Masjid-guardianship restriction (8:34) delegitimizes Qurayshi custodianship based on piety not lineage. Whistling-clapping characterization (8:35) reduces pagan ritual to noise-performance. Khums legislation (8:41) ties economic distribution to theological confession creating material-spiritual nexus. Yawm al-Furqan designation anchors entire surah in revelatory event. Dream-vision mechanics (8:43-44) reveal divine management of perception as tactical factor. Satan-abandonment scene (8:48) exposes supernatural ally as unreliable demonstrating tawakkul necessity.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P2 commands and prohibitions
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:39"], excerpt: fv(39), description: "Command: fight them until there is no fitnah and religion entirely for Allah." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:45"], excerpt: fv(45), description: "Command: when you encounter a company stand firm and remember Allah much that you may succeed." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:46"], excerpt: fv(46), description: "Command: obey Allah and His Messenger do not dispute lose courage be patient." });

// P2 divine names
{
  const t = findWordContaining(30, ["\u0645","\u0627","\u0643","\u0631"]); // almakireena
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Khayr al-Makireen", gloss: "Best of Planners (editorial gloss)", keys: ["8:30"] });
}
{
  const t = findWordContaining(40, ["\u0645","\u0648","\u0644"]); // mawlakum
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Mawla", gloss: "Protector/Guardian (editorial gloss)", keys: ["8:40"] });
}
{
  const t = findWordContaining(40, ["\u0646","\u0635","\u064a","\u0631"]); // alnnaseeru
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Naseer", gloss: "Helper (editorial gloss)", keys: ["8:40"] });
}
{
  const t = findWordContaining(41, ["\u0642","\u062f","\u064a","\u0631"]); // qadeerun
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Qadeer", gloss: "Competent/Capable (editorial gloss)", keys: ["8:41"] });
}
{
  const t1 = findWordContaining(42, ["\u0633","\u0645","\u064a","\u0639"]); // lasameeAAun
  const t2 = findWordContaining(42, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t1 && t2) {
    const fullText = fv(42);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p2.divineNamesAndAttributes.push({ term: phrase, transliteration: "SameeAA Aleem", gloss: "Hearing Knowing (editorial gloss)", keys: ["8:42"] });
    }
  }
}
{
  const t1 = findWordContaining(46, ["\u0635","\u0627","\u0628","\u0631"]); // alssabireena
  if (t1) p2.divineNamesAndAttributes.push({ term: t1, transliteration: "maAAa al-Sabireen", gloss: "with the Patient (editorial gloss)", keys: ["8:46"] });
}

// P2 terminology
{
  const t = findWordContaining(31, ["\u0623","\u0633","\u0627","\u0637","\u064a","\u0631"]); // asateeru
  if (t) p2.terminology.push({ term: t, transliteration: "asateer", gloss: "legends/myths (editorial gloss)", keys: ["8:31"] });
}
{
  const t = findWordContaining(35, ["\u0645","\u0643","\u0627","\u0621"]); // mukaan
  if (t) p2.terminology.push({ term: t, transliteration: "muka'", gloss: "whistling (editorial gloss)", keys: ["8:35"] });
}
{
  const t = findWordContaining(35, ["\u062a","\u0635","\u062f","\u064a"]); // tasiyatan
  if (t) p2.terminology.push({ term: t, transliteration: "tasdiyah", gloss: "hand-clapping (editorial gloss)", keys: ["8:35"] });
}
{
  const t = findWordContaining(37, ["\u062e","\u0628","\u064a","\u062b"]); // alkhabeetha
  if (t) p2.terminology.push({ term: t, transliteration: "khabees", gloss: "wicked/foul (editorial gloss)", keys: ["8:37"] });
}
{
  const t = findWordContaining(41, ["\u062e","\u0645","\u0633"]); // khumusahu
  if (t) p2.terminology.push({ term: t, transliteration: "khums", gloss: "one-fifth share (editorial gloss)", keys: ["8:41"] });
}
{
  const t = findWordContaining(41, ["\u0641","\u0631","\u0642","\u0627","\u0646"]); // alfurqani
  if (t) p2.terminology.push({ term: t, transliteration: "furqan", gloss: "criterion/day of distinction (editorial gloss)", keys: ["8:41"] });
}
{
  const t = findWordContaining(47, ["\u0628","\u0637","\u0631"]); // bataran
  if (t) p2.terminology.push({ term: t, transliteration: "batar", gloss: "insolence/exultation (editorial gloss)", keys: ["8:47"] });
}
{
  const t = findWordContaining(47, ["\u0631","\u0626","\u0627","\u0621"]); // riaa
  if (t) p2.terminology.push({ term: t, transliteration: "ri'a", gloss: "showing off/ostentation (editorial gloss)", keys: ["8:47"] });
}

// P2 social-economic
p2.socialEconomicCivilisational.push({ label: "Khums five-category welfare distribution system linked to faith confession", keys: ["8:41"], evidenceClass: "EXPLICIT_TEXT" });
p2.socialEconomicCivilisational.push({ label: "Disbeliever wealth expenditure as futile investment producing regret", keys: ["8:36"], evidenceClass: "EXPLICIT_TEXT" });

writeFileSync(path.join(OUT_DIR, "extractions", "008-al-anfal-p2.json"), JSON.stringify(p2, null, 2) + "\n");
console.log("Wrote 008-al-anfal-p2.json");

// ─── Passage 3: 8:50–75 ──────────────────────────────────────────────────────
const p3 = {
  extractionId: "ext-008-p3",
  workstream: "MFD-11",
  pass: "A",
  surah: 8,
  surahName: "Al-Anfal",
  passage: {
    fromAyah: 50,
    toAyah: 75,
    label: "Al-Anfal — Angels take souls disbelievers striking faces backs taste burning fire; for what hands sent forth Allah not unjust servants; like custom Pharaoh those before disbelieved signs seized sins Qawiyy Shadeed Iqab; Allah does not change favor bestowed people until change themselves SameeAA Aleem; like Pharaoh denied signs destroyed drowned all wrongdoers; worst creatures disbelieved will not believe; made treaty break every time not fear; dominate war disperse those behind perhaps reminded; fear betrayal throw back equally Allah loves not traitors; disbelievers think escaped cannot frustrate; prepare power steeds terrify enemy Allah enemy others unknown Allah knows spend anything repaid not wronged; incline peace incline rely Allah SameeAA Aleem; intend deceive sufficient Allah supported victory believers; united hearts spent earth could not unite Allah united Azeez Hakeem; O Prophet sufficient Allah followers believers; urge believers battle twenty steadfast overcome two hundred hundred overcome thousand disbelievers do not understand; now lightened weakness hundred steadfast overcome two hundred thousand overcome two thousand bi-idhni Allah with sabireen; not for prophet captives until massacre land desire world Allah desires Hereafter Azeez Hakeem; book preceded touched great punishment taken; consume booty halal tayyib fear Allah Ghafoor Raheem; say captives good hearts give better taken forgive Ghafoor Raheem; intend betrayal betrayed Allah before empowered Aleem Hakeem; believed emigrated fought wealth selves sheltered aided allies one another; believed not emigrated no walayah until emigrate seek help religion must help except treaty people Allah Baseer; disbelievers allies one another unless do fitnah earth great corruption; believed emigrated fought sheltered aided truly believers forgiveness noble provision; believed after emigrated fought with you of you; blood relatives more entitled inheritance Book Allah Aleem"
  },
  verseKeys: Array.from({length:26}, (_,i) => `8:${i+50}`),
  arabicExcerpts: Array.from({length:26}, (_,i) => ({ key: `8:${i+50}`, text: fv(i+50) })),
  mainSubject: {
    label: "Angelic soul-taking violence as retributive justice for hands' deeds; Pharaoh-narrative doublet establishing blessing-revocation principle through internal moral change; chronic treaty-breakers identified as worst creatures; graduated treaty-management protocol from dispersal-warning to equal-notification; military preparedness command with deterrent purpose and divine repayment guarantee; peace-inclination reciprocity with tawakkul condition; deception safeguarded by divine sufficiency; heart-unification as exclusively divine act beyond material capacity; proportional combat ratios adjusted for community weakness by divine permission; prisoner-of-war ethics balancing worldly-desire critique with forgiveness possibility; walayah-migration framework defining believer solidarity through hijrah-jihad criteria; blood-kinship inheritance priority superseding faith-alliance in Book of Allah",
    keys: Array.from({length:26}, (_,i) => `8:${i+50}`),
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Angels striking faces-backs at death of disbelievers", keys: ["8:50"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Retribution justified by hands' deeds; Allah not thallam to servants", keys: ["8:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pharaoh precedent: disbelief in signs leads to seizure for sins", keys: ["8:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Blessing-change principle: Allah does not alter favor until people alter themselves", keys: ["8:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pharaoh doublet: denial leads to destruction drowning all thalimeen", keys: ["8:54"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worst creatures: persistent disbelievers la yuminoona", keys: ["8:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Chronic treaty-breakers: naqd covenant every time lacking taqwa", keys: ["8:56"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "War dominance as deterrent: tashrid to remind others", keys: ["8:57"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Anticipated betrayal response: equal notification nabdh", keys: ["8:58"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers cannot escape or frustrate divine plan", keys: ["8:59"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Military preparation: quwwah and ribat al-khayl for deterrence", keys: ["8:60"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spending in Allah's way fully repaid without injustice", keys: ["8:60"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Peace inclination reciprocity with tawakkul", keys: ["8:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deception attempt met with divine sufficiency and past support", keys: ["8:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heart-unification as exclusive divine act surpassing earthly wealth", keys: ["8:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet sufficiency: Allah and believing followers", keys: ["8:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Combat ratio 1:10 for twenty steadfast vs disbelievers who lack fiqh", keys: ["8:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lightened ratio 1:2 recognizing community weakness bi-idhni Allah", keys: ["8:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet should not take captives before ithkhan; worldly vs hereafter desire", keys: ["8:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Preceding kitab prevented punishment for taking captives", keys: ["8:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Booty consumption permitted as halal tayyib with taqwa condition", keys: ["8:69"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Captives addressed: good hearts rewarded better than taken plus forgiveness", keys: ["8:70"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Betrayal intent exposed by prior betrayal of Allah enabling capture", keys: ["8:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Walayah defined by iman-hijrah-jihad-infaq plus shelter-aid", keys: ["8:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Non-emigrant believers excluded from walayah until migration", keys: ["8:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Religious aid obligation except against treaty-partners", keys: ["8:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbeliever mutual alliance; failure produces fitnah-fasad kabeer", keys: ["8:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True believers confirmed: emigrants helpers receive forgiveness noble provision", keys: ["8:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Later emigrants-fighters included; blood kinship priority in Kitab Allah", keys: ["8:75"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0397","cand-0398","cand-0399","cand-0400","cand-0401","cand-0402","cand-0403","cand-0404","cand-0405","cand-0406"],
  notes: "Pass A Al-Anfal passage 3/3. Angelic-violence scene (8:50-51) provides eschatological counterpart to battlefield combat. Blessing-change principle (8:53) articulates foundational historical theology making divine favor contingent on moral self-transformation. Treaty-management protocol (8:56-58) provides graduated response framework distinguishing chronic violators from uncertain parties. Military-preparedness command (8:60) frames armament as deterrence not aggression with divine-repayment incentive. Peace-reciprocity (8:61) balances martial readiness with diplomatic openness. Heart-unification (8:63) represents peak communal-theology declaring social cohesion beyond human engineering. Combat-ratio adjustment (8:65-66) demonstrates legislative flexibility acknowledging human limitation. Prisoner-ethics (8:67-71) navigate tension between strategic necessity and moral aspiration. Walayah-framework (8:72-75) defines Islamic polity boundaries through migration-solidarity criteria while preserving kinship-inheritance rights.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P3 commands and prohibitions
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:57"], excerpt: fv(57), description: "Command: if you gain dominance in war disperse by them those behind them that they may be reminded." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:58"], excerpt: fv(58), description: "Command: if you fear betrayal from a people throw their treaty back equally." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:60"], excerpt: fv(60), description: "Command: prepare against them whatever power and steeds of war you can to terrify enemies." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:61"], excerpt: fv(61), description: "Command: if they incline to peace incline to it and rely upon Allah." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:65"], excerpt: fv(65), description: "Command: urge believers to battle with steadfastness-based combat ratios." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["8:69"], excerpt: fv(69), description: "Command: consume what you obtained as booty lawful and good and fear Allah." });

// P3 divine names
{
  const t1 = findWordContaining(52, ["\u0642","\u0648","\u064a"]); // qawiyyun
  const t2 = findWordContaining(52, ["\u0634","\u062f","\u064a","\u062f"]); // shadeedu
  if (t1 && t2) {
    const fullText = fv(52);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "Qawiyy Shadeed al-Iqab", gloss: "Powerful Severe in Penalty (editorial gloss)", keys: ["8:52"] });
    }
  }
}
{
  const t1 = findWordContaining(53, ["\u0633","\u0645","\u064a","\u0639"]); // sameeAAun
  const t2 = findWordContaining(53, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t1 && t2) {
    const fullText = fv(53);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "SameeAA Aleem", gloss: "Hearing Knowing (editorial gloss)", keys: ["8:53"] });
    }
  }
}
{
  const t1 = findWordContaining(61, ["\u0633","\u0645","\u064a","\u0639"]); // alssameeAAu
  const t2 = findWordContaining(61, ["\u0639","\u0644","\u064a","\u0645"]); // alAAaleemu
  if (t1 && t2) {
    const fullText = fv(61);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "al-SameeAA al-Aleem", gloss: "the Hearing the Knowing (editorial gloss)", keys: ["8:61"] });
    }
  }
}
{
  const t1 = findWordContaining(63, ["\u0639","\u0632","\u064a","\u0632"]); // AAazeezun
  const t2 = findWordContaining(63, ["\u062d","\u0643","\u064a","\u0645"]); // hakeemun
  if (t1 && t2) {
    const fullText = fv(63);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "Azeez Hakeem", gloss: "Exalted Mighty Wise (editorial gloss)", keys: ["8:63"] });
    }
  }
}
{
  const t1 = findWordContaining(67, ["\u0639","\u0632","\u064a","\u0632"]); // AAazeezun
  const t2 = findWordContaining(67, ["\u062d","\u0643","\u064a","\u0645"]); // hakeemun
  if (t1 && t2) {
    const fullText = fv(67);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "Azeez Hakeem", gloss: "Exalted Mighty Wise (editorial gloss)", keys: ["8:67"] });
    }
  }
}
{
  const t1 = findWordContaining(69, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(69, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t1 && t2) {
    const fullText = fv(69);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafoor Raheem", gloss: "Forgiving Merciful (editorial gloss)", keys: ["8:69"] });
    }
  }
}
{
  const t = findWordContaining(75, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t) p3.divineNamesAndAttributes.push({ term: t, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["8:75"] });
}

// P3 terminology
{
  const t = findWordContaining(60, ["\u0631","\u0628","\u0627","\u0637"]); // ribati
  if (t) p3.terminology.push({ term: t, transliteration: "ribat", gloss: "war-steeds/garrison horses (editorial gloss)", keys: ["8:60"] });
}
{
  const t = findWordContaining(67, ["\u0623","\u0633","\u0631","\u0649"]); // asra
  if (t) p3.terminology.push({ term: t, transliteration: "asra", gloss: "prisoners of war/captives (editorial gloss)", keys: ["8:67"] });
}
{
  const t = findWordContaining(67, ["\u064a","\u062b","\u062e","\u0646"]); // yuthkhina
  if (t) p3.terminology.push({ term: t, transliteration: "ithkhan", gloss: "massacre/thorough suppression (editorial gloss)", keys: ["8:67"] });
}
{
  const t = findWordContaining(72, ["\u0648","\u0644","\u0627","\u064a"]); // awliyao
  if (t) p3.terminology.push({ term: t, transliteration: "walayah", gloss: "alliance/guardianship/solidarity (editorial gloss)", keys: ["8:72"] });
}
{
  const t = findWordContaining(75, ["\u0623","\u0631","\u062d","\u0627","\u0645"]); // alarhami
  if (t) p3.terminology.push({ term: t, transliteration: "ulu al-arham", gloss: "blood relatives/kin (editorial gloss)", keys: ["8:75"] });
}

// P3 human conditions
p3.humanConditionsAndSpiritualStates.push({ label: "Community weakness (da'f) acknowledged prompting combat-ratio adjustment", keys: ["8:66"], evidenceClass: "EXPLICIT_TEXT" });
p3.humanConditionsAndSpiritualStates.push({ label: "Worldly desire (arad al-dunya) contrasted with divine hereafter intention", keys: ["8:67"], evidenceClass: "EXPLICIT_TEXT" });

// P3 social-economic
p3.socialEconomicCivilisational.push({ label: "Military deterrence doctrine: visible preparation prevents conflict", keys: ["8:60"], evidenceClass: "EXPLICIT_TEXT" });
p3.socialEconomicCivilisational.push({ label: "Treaty management protocol: graduated response from warning to equal notification", keys: ["8:56","8:57","8:58"], evidenceClass: "EXPLICIT_TEXT" });
p3.socialEconomicCivilisational.push({ label: "Prisoner rehabilitation pathway: sincere repentance rewarded beyond material loss", keys: ["8:70"], evidenceClass: "EXPLICIT_TEXT" });
p3.socialEconomicCivilisational.push({ label: "Islamic polity boundaries defined by hijrah-jihad not mere profession of faith", keys: ["8:72"], evidenceClass: "EXPLICIT_TEXT" });

// P3 relationships
p3.relationships.push({ label: "Believer solidarity through shared migration-struggle creating mutual walayah", keys: ["8:72"], evidenceClass: "EXPLICIT_TEXT" });
p3.relationships.push({ label: "Blood kinship superseding faith-alliance in inheritance per Kitab Allah", keys: ["8:75"], evidenceClass: "EXPLICIT_TEXT" });

writeFileSync(path.join(OUT_DIR, "extractions", "008-al-anfal-p3.json"), JSON.stringify(p3, null, 2) + "\n");
console.log("Wrote 008-al-anfal-p3.json");

// ─── Candidates batch (cand-0377 through cand-0406) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-008-p1,ext-008-p2,ext-008-p3",
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

// cand-0377: True believer definition
candidates.candidates.push(makeCand("cand-0377",
  "True believer definition: hearts tremble at Allah mention; verses increase faith; reliance on Lord; establish prayer; spend from provision; these are believers truly with degrees forgiveness noble provision",
  undefined, "تعريف المؤمن الحقيقي: قلوبهم ترتعد عند ذكر الله؛ آياته تزيد إيماناً؛ يتوكلون على ربهم؛ يقيمون الصلاة؛ ينفقون مما رزقوا؛ أولئك هم المؤمنون حقاً لهم درجات ومغفرة ورزق كريم",
  "In 8:2-4: The believers are only those whose hearts tremble when Allah is mentioned and when His verses are recited it increases them in faith and upon their Lord they rely. Those who establish prayer and from what We provided them they spend. Those are the believers truly for them are degrees with their Lord and forgiveness and noble provision.",
  [{ key: "8:2", excerpt: fv(2), evidenceClass: "EXPLICIT_TEXT", rationale: "Innama almuminoona allatheena itha thukira Allahu wajilat quloobuhum: heart-trembling as primary authenticating marker. Waitha tuliyat AAalayhim ayatuhu zadathum eemanan: faith as dynamic quantity responsive to revelation. WaAAala rabbihim yatawakkaloona: tawakkul as structural dependence." },
   { key: "8:3", excerpt: fv(3), evidenceClass: "EXPLICIT_TEXT", rationale: "Allatheena yuqeemoona alssalata: prayer-establishment as external practice. Wamimma razaqnahum yunfiqoona: spending as material expression of faith." },
   { key: "8:4", excerpt: fv(4), evidenceClass: "EXPLICIT_TEXT", rationale: "Olaika humu almuminoona haqqan: emphatic confirmation of true-believer status. Lahum darajatun: hierarchical reward acknowledging varying degrees. Wamaghfiratun warizqun kareemun: dual reward combining pardon with dignified sustenance." }],
  [],
  "Gap candidate. Four-component definition linking affective (heart-trembling) cognitive (faith-increase) relational (tawakkul) and behavioral (prayer-spending) dimensions. Haqqan (truly) distinguishes nominal from authentic belief. Darajat implies merit-based differentiation within Paradise challenging egalitarian assumptions. Refined across multiple Quranic contexts but this formulation uniquely combines all four elements."
));

// cand-0378: Divine agency in combat
candidates.candidates.push(makeCand("cand-0378",
  "Divine agency in combat: you did not kill them Allah killed them; you threw not when threw Allah threw; good test for believers; SameeAA Aleem",
  undefined, "الوكالة الإلهية في القتال: لم تقتلوهم بل الله قتلهم؛ ما رميت إذ رميت ولكن الله رمى؛ ابتلاء حسن للمؤمنين؛ سميع عليم",
  "In 8:17: You did not kill them but Allah killed them. You threw not when you threw but Allah threw that He might test the believers with a good test. Indeed Allah is Hearing Knowing.",
  [{ key: "8:17", excerpt: fv(17), evidenceClass: "EXPLICIT_TEXT", rationale: "Falam taqtuloohum walakinna Allaha qatalahum: explicit negation of human lethal agency. Wama ramayta ith ramayta walakinna Allaha rama: parallel negation of prophetic projectile-agency. Waliyubliya almumineena minhu balaan hasanan: combat reframed as divine testing not human achievement. Inna Allaha sameeAAun AAaleemun: divine awareness encompassing both human effort and ultimate causation." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "same-concept", note: "Definitive statement of divine causal primacy in warfare" }],
  "Overlap with divine-power. Double-negation structure (lam taqtuloo + ma ramayta) systematically strips human actors of independent causal efficacy. Balaan hasanan reframes violence as pedagogical instrument. Positioned after angel-reinforcement (8:9-12) completing attribution chain from visible (angels) to invisible (divine killing). Prevents military triumphalism by grounding victory in divine will not human prowess."
));

// cand-0379: Fitnah warning
candidates.candidates.push(makeCand("cand-0379",
  "Fitnah warning: trial will not exclusively strike wrongdoers; collective responsibility principle; severe penalty reminder",
  undefined, "تحذير الفتنة: المحنة لا تصيب الظالمين خاصة؛ مبدأ المسؤولية الجماعية؛ تذكير بالعقاب الشديد",
  "In 8:25: Fear a trial which will not strike those who have wronged among you exclusively and know that Allah is severe in penalty.",
  [{ key: "8:25", excerpt: fv(25), evidenceClass: "EXPLICIT_TEXT", rationale: "Waittaqoo fitnatan la tuseebanna allatheena thalamoo minkum khassatan: khassatan (exclusively) negates targeted-punishment assumption implying communal contagion. WaiAAlamoo anna Allaha shadeedu alAAiqabi: severity-reminder motivating preventive vigilance." }],
  [],
  "Gap candidate. Establishes social-contagion model of divine punishment where communal tolerance of wrongdoing expands liability beyond perpetrators. Khassatan functions as critical qualifier preventing individualistic reading. Positioned between response-command (8:24) and gratitude-reminder (8:26) suggesting fitnah-prevention requires both active obedience and historical memory. Foundation for later enjoining-good-forbidding-evil doctrines."
));

// cand-0380: Furqan through taqwa
candidates.candidates.push(makeCand("cand-0380",
  "Furqan through taqwa: fearing Allah produces criterion removing misdeeds granting forgiveness; Allah possessor of great bounty",
  undefined, "الفرقان بالتقوى: تقوى الله تنتج فرقاناً وتمحو السيئات وتمنح المغفرة؛ الله ذو الفضل العظيم",
  "In 8:29: O believers if you fear Allah He will grant you a criterion and remove from you your misdeeds and forgive you. And Allah is possessor of great bounty.",
  [{ key: "8:29", excerpt: fv(29), evidenceClass: "EXPLICIT_TEXT", rationale: "In tattaqoo Allaha yajAAal lakum furqanan: conditional promise linking ethical commitment to epistemological gift. Wayukaffir AAankum sayyiatikum: kafara as covering/removing misdeeds. Wayaghfir lakum: additional forgiveness layer. WaAllahu thoo alfadli alAAatheemi: bounty-attribution preventing furqan from appearing earned rather than granted." }],
  [],
  "Gap candidate. Furqan (criterion/distinction) as cognitive-spiritual capacity emerging from ethical discipline not intellectual study alone. Triple-reward structure (furqan + takfeer + maghfirah) escalates from guidance to cleansing to pardon. Conditional form (in tattaqoo) makes divine gifts responsive to human initiative. Positioned after betrayal-prohibition (8:27-28) suggesting furqan specifically enables trustworthiness discernment."
));

// cand-0381: Makr counter-makr
candidates.candidates.push(makeCand("cand-0381",
  "Divine makr superiority: disbelievers plot restrain kill evict; they plan Allah plans; Allah best of planners",
  undefined, "تفوق المكر الإلهي: الكافرون يمكرون ليثبتوك أو يقتلوك أو يخرجوك؛ ويمكرون ويمكر الله؛ والله خير الماكرين",
  "In 8:30: When those who disbelieved plotted against you to restrain or kill or evict you. They plan and Allah plans and Allah is best of planners.",
  [{ key: "8:30", excerpt: fv(30), evidenceClass: "EXPLICIT_TEXT", rationale: "Waith yamkuru bika allatheena kafaroo liyuthbitooka aw yaqtulooka aw yukhrijooka: three-option plot enumeration showing comprehensive threat assessment. Wayamkuroona wayamkuru Allahu: parallel verb structure asserting simultaneous counter-planning. WaAllahu khayru almakireena: superlative declaration establishing permanent asymmetry." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical", note: "Divine planning superiority expressed through makr vocabulary" }],
  "Overlap with divine-power. Makr (planning/plotting) applied to both humans and Allah but with qualitative asymmetry (khayr). Three-threat enumeration mirrors Hijrah narrative context. Present-tense parallelism (yamkuroona/yamkuru) suggests ongoing dynamic not past event. Functions as reassurance to Prophet facing existential threats while establishing theological principle of divine strategic supremacy."
));

// cand-0382: Masjid Haram guardianship
candidates.candidates.push(makeCand("cand-0382",
  "Masjid al-Haram guardianship restricted to muttaqoon: obstruction justifies punishment; Qurayshi custodianship invalidated; most do not know",
  undefined, "ولاية المسجد الحرام مقصورة على المتقين: الصد عنه يبرر العقاب؛ ولاية قريش مبطلّة؛ وأكثرهم لا يعلمون",
  "In 8:34: Why should Allah not punish them while they obstruct from al-Masjid al-Haram and they were not its guardians? Its guardians are only the muttaqoon but most of them do not know.",
  [{ key: "8:34", excerpt: fv(34), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama lahum alla yuAAaththibahumu Allahu wahum yasuddoona AAani almasjidi alharami: rhetorical question justifying punishment based on obstruction. Wama kanoo awliyaahu: past-tense negation of custodianship claim. In awliyaohu illa almuttaqoona: exclusive restriction to righteous. Walakinna aktharahum la yaAAlamoona: knowledge-deficit explaining false claims." }],
  [],
  "Gap candidate. Radical delegitimization of hereditary-tribal custodianship replacing it with piety-based qualification. Yasuddoona (obstruct) identifies active prevention of access as disqualifying offense. Illa almuttaqoona creates binary: either righteous guardian or illegitimate occupier. La yaAAlamoona diagnoses epistemological failure underlying political pretension. Foundational text for Islamic sacred-space governance principles."
));

// cand-0383: Khums distribution
candidates.candidates.push(makeCand("cand-0383",
  "Khums five-way distribution: one-fifth of booty for Allah Messenger relatives orphans needy traveler; conditioned on belief in Allah and Furqan-day revelation",
  undefined, "توزيع الخمس خمسة أسهم: خمس الغنيمة لله والرسول وذوي القربى واليتامى والمساكين وابن السبيل؛ مشروط بالإيمان بالله ويوم الفرقان",
  "In 8:41: Know that whatever booty you obtain then for Allah is one-fifth and for the Messenger and near relatives and orphans and needy and traveler if you have believed in Allah and what We sent down to Our Servant on day of Furqan day two armies met. And Allah over all things is Capable.",
  [{ key: "8:41", excerpt: fv(41), evidenceClass: "EXPLICIT_TEXT", rationale: "WaiAAlamoo annama ghanimtum min shayin faanna lillahi khumusahu: khums as divine prerogative not human discretion. Walilrrasooli walithee alqurba waalyatama waalmasakeeni waibni alssabeeli: six named beneficiaries (Allah+Messenger counted together as first share). In kuntum amantum biAllahi wama anzalna AAala AAabdina yawma alfurqani: faith-condition tying economic law to theological confession. Yawma iltaqa aljamAAani: historical anchoring in Badr encounter. WaAllahu AAala kulli shayin qadeerun: capability-declaration enforcing compliance." }],
  [{ topicId: "justice", layer: "curated", relationship: "related-not-identical", note: "Economic redistribution mechanism implementing social justice through war-spoils allocation" }],
  "Overlap with justice. Five-category distribution addresses structural vulnerabilities (orphans needy travelers) alongside institutional needs (Allah-Messenger-relatives). Faith-condition prevents mechanical application requiring theological commitment. Yawm al-Furqan designation sacralizes economic law connecting it to revelatory moment. Qadeer closure reminds that enforcement ultimately divine. Most detailed booty-legislation in Quran establishing template for Islamic fiscal policy."
));

// cand-0384: Blessing-change principle
candidates.candidates.push(makeCand("cand-0384",
  "Blessing-change principle: Allah does not alter favor bestowed on people until they alter what is within themselves; SameeAA Aleem",
  undefined, "مبدأ تغيير النعمة: الله لا يغير نعمة أنعمها على قوم حتى يغيروا ما بأنفسهم؛ سميع عليم",
  "In 8:53: That is because Allah would not change a favor He bestowed upon a people until they change what is within themselves. And indeed Allah is Hearing Knowing.",
  [{ key: "8:53", excerpt: fv(53), evidenceClass: "EXPLICIT_TEXT", rationale: "Thalika bianna Allaha lam yaku mughayyiran niAAmatan anAAamaha AAala qawmin: negative formulation emphasizing divine consistency. Hatta yughayyiroo ma bianfusihim: internal moral change as necessary condition for external blessing-revocation. Waanna Allaha sameeAAun AAaleemun: divine awareness ensuring change-detection is perfect." }],
  [],
  "Gap candidate. Foundational historical-theological axiom making divine favor contingent on sustained moral integrity. Ma bianfusihim locates causality in internal states not external circumstances. Negative formulation (lam yaku mughayyiran) emphasizes divine reluctance to withdraw favor placing burden on human moral deterioration. Positioned between Pharaoh-doublets (8:52 8:54) providing explanatory principle for historical patterns. Applicable to communities individuals and civilizations universally."
));

// cand-0385: Heart unification
candidates.candidates.push(makeCand("cand-0385",
  "Heart unification as exclusive divine act: spent all earth could not unite hearts; Allah united them; Azeez Hakeem",
  undefined, "تأليف القلوب كفعل إلهي حصري: لو أنفقت ما في الأرض جميعاً ما ألفت بين قلوبهم؛ لكن الله ألف بينهم؛ عزيز حكيم",
  "In 8:63: And He brought together their hearts. If you had spent all that is in the earth you could not have brought their hearts together but Allah brought them together. Indeed He is Exalted Mighty Wise.",
  [{ key: "8:63", excerpt: fv(63), evidenceClass: "EXPLICIT_TEXT", rationale: "Waallafa bayna quloobihim: divine subject performing heart-unification. Law anfaqta ma fee alardi jameeAAan ma allafta bayna quloobihim: hypothetical impossibility demonstrating material insufficiency. Walakinna Allaha allafa baynahum: affirmative divine action as sole sufficient cause. Innahu AAazeezun hakeemun: power-wisdom pairing explaining both capacity and appropriateness." }],
  [],
  "Gap candidate. Definitive statement of social-cohesion theology declaring interpersonal bonds beyond human engineering. JameeAAan (all together) eliminates any quantitative threshold suggesting even unlimited resources fail. Hearts (quloob) specifies affective dimension not merely political alliance. Azeez-Hakeem pairing suggests unification requires both power to effect and wisdom to orchestrate. Addresses Ansar-Muhajirun reconciliation historically while establishing universal principle for community formation."
));

// cand-0386: Combat ratio adjustment
candidates.candidates.push(makeCand("cand-0386",
  "Combat ratio adjustment: initial 1:10 for twenty steadfast; lightened to 1:2 recognizing weakness; bi-idhni Allah; Allah with sabireen",
  undefined, "تعديل نسبة القتال: أولية ١:١٠ لعشرين صابراً؛ خُفِّفت إلى ١:٢ اعترافاً بالضعف؛ بإذن الله؛ الله مع الصابرين",
  "In 8:65-66: O Prophet urge believers to battle. If twenty steadfast overcome two hundred if hundred overcome thousand of disbelievers because they do not understand. Now Allah lightened for you knowing weakness in you so hundred steadfast overcome two hundred thousand overcome two thousand by Allah's permission. Allah is with the patient.",
  [{ key: "8:65", excerpt: fv(65), evidenceClass: "EXPLICIT_TEXT", rationale: "In yakun minkum AAishroona sabiroona yaghliboo miatayni: 1:10 ratio predicated on sabr quality. Biannahum qawmun la yafqahoona: disbeliever cognitive-deficit as enabling factor." },
   { key: "8:66", excerpt: fv(66), evidenceClass: "EXPLICIT_TEXT", rationale: "Alana khaffafa Allahu AAankum waAAalima anna feekum daAAfan: divine recognition of human limitation prompting legislative adjustment. Fain yakun minkum miatun sabiratun yaghliboo miatayni: revised 1:2 ratio maintaining sabr requirement. Biithni Allahi: permission-qualifier preventing ratio from becoming mechanical formula. WaAllahu maAAa alssabireena: divine accompaniment as ultimate force-multiplier." }],
  [],
  "Gap candidate. Unique legislative flexibility demonstrating divine responsiveness to community capacity. Da'f acknowledgment prevents unrealistic expectations while maintaining combat obligation. Sabr as consistent variable across both ratios identifying steadfastness not numbers as decisive factor. Bi-idhni qualifier maintains divine sovereignty even in adjusted standards. MaAAa al-sabireen provides theological assurance complementing numerical reduction. Historical context suggests post-Badr reassessment preparing for Uhud challenges."
));

// cand-0387: Prisoner ethics
candidates.candidates.push(makeCand("cand-0387",
  "Prisoner ethics: prophet should not take captives before ithkhan; worldly desire critiqued; preceding kitab prevented punishment; booty halal tayyib with taqwa",
  undefined, "أخلاق الأسرى: لا ينبغي للنبي أسر قبل الإثخان؛ نقد الرغبة الدنيوية؛ كتاب سابق منع العقاب؛ الغنيمة حلال طيب مع التقوى",
  "In 8:67-69: Not for a prophet to have captives until he inflicts massacre in land. You desire world commodities Allah desires Hereafter. If not for preceding book from Allah great punishment would have touched you for what you took. So consume what you obtained lawful good and fear Allah. Indeed Allah is Forgiving Merciful.",
  [{ key: "8:67", excerpt: fv(67), evidenceClass: "EXPLICIT_TEXT", rationale: "Ma kana linabiyyin an yakoona lahu asra hatta yuthkhina fee alardi: ithkhan as precondition for legitimate captivity. Tureedoona AAarada alddunya waAllahu yureedu alakhirata: explicit desire-contrast diagnosing motivational error. WaAllahu AAazeezun hakeemun: power-wisdom framing correction." },
   { key: "8:68", excerpt: fv(68), evidenceClass: "EXPLICIT_TEXT", rationale: "Lawla kitabun mina Allahi sabaqa lamassakum feema akhathtum AAathabun AAatheemun: preceding decree as mercy-mechanism preventing punishment for premature captive-taking." },
   { key: "8:69", excerpt: fv(69), evidenceClass: "EXPLICIT_TEXT", rationale: "Fakuloo mimma ghanimtum halalan tayyiban: retroactive legitimization of booty consumption. Waittaqoo Allaha: taqwa as ongoing condition. Inna Allaha ghafoorun raheemun: forgiveness-mercy pairing closing corrective passage." }],
  [],
  "Gap candidate. Complex ethical navigation between strategic necessity and moral aspiration. Ithkhan requirement ensures military objectives prioritized over economic gain. Desire-diagnosis (tureedoona/yureedu) exposes motivational misalignment without condemning actors. Kitab-sabaq introduces concept of pre-ordained legislative mercy preventing retrospective guilt. Halalan tayyiban dual-qualification demands both legal validity and moral wholesomeness. Ghafoor-Raheem closure signals divine accommodation of human imperfection within corrective framework."
));

// cand-0388: Walayah-migration framework
candidates.candidates.push(makeCand("cand-0388",
  "Walayah-migration framework: believer solidarity defined by iman-hijrah-jihad plus shelter-aid; non-emigrants excluded until migration; religious aid obligation except treaty-partners; blood kinship priority in Kitab Allah",
  undefined, "إطار الولاية والهجرة: تضامن المؤمنين يُعرَّف بالإيمان والهجرة والجهاد والإيواء والنصر؛ غير المهاجرين مستبعدون حتى الهجرة؛ واجب النصرة الدينية إلا على قوم معاهدين؛ أولوية قرابة الدم في كتاب الله",
  "In 8:72-75: Those who believed emigrated fought with wealth and selves and those who sheltered aided are allies of one another. Those who believed but did not emigrate you have no walayah with them until they emigrate. If they seek help in religion you must help except against treaty-people. Disbelievers are allies of one another unless you do so fitnah and great corruption. Those who believed emigrated fought sheltered aided are truly believers with forgiveness noble provision. Those who believed after emigrated fought with you are of you. Blood relatives are more entitled in Book of Allah. Indeed Allah is Knowing of all things.",
  [{ key: "8:72", excerpt: fv(72), evidenceClass: "EXPLICIT_TEXT", rationale: "Inna allatheena amanoo wahajaroo wajahadoo biamwalihim waanfusihim: four-component criteria for full walayah. Waallatheena awaw wanasaroo: shelter-aid as complementary qualification. Olaika baAAduhum awliyao baAAdin: mutual alliance declaration. Waallatheena amanoo walam yuhajiroo ma lakum min walayatihim min shayin hatta yuhajiroo: explicit exclusion of non-emigrants. Waini istansarookum fee alddeeni faAAalaykumu alnnasru illa AAala qawmin baynakum wabaynahum meethaqun: conditional aid obligation with treaty exception." },
   { key: "8:73", excerpt: fv(73), evidenceClass: "EXPLICIT_TEXT", rationale: "Waallatheena kafaroo baAAduhum awliyao baAAdin: disbeliever counter-alliance. Illa tafAAaloohu takun fitnatun fee alardi wafasadun kabeerun: failure-consequence as communal catastrophe." },
   { key: "8:74", excerpt: fv(74), evidenceClass: "EXPLICIT_TEXT", rationale: "Olaika humu almuminoona haqqan: true-believer confirmation echoing 8:4. Lahum maghfiratun warizqun kareemun: identical reward formula." },
   { key: "8:75", excerpt: fv(75), evidenceClass: "EXPLICIT_TEXT", rationale: "Waallatheena amanoo min baAAdu wahajaroo wajahadoo maAAakum faolaika minkum: inclusion of later joiners. Waoloo alarhami baAAduhum awla bibaAAdin fee kitabi Allahi: kinship-priority superseding faith-alliance in inheritance. Inna Allaha bikulli shayin AAaleemun: comprehensive divine knowledge closing framework." }],
  [],
  "Gap candidate. Comprehensive polity-definition establishing hijrah as boundary-marker for full communal membership. Four-tier classification: full members (emigrant-fighters) partial members (non-emigrant believers) potential members (later joiners) excluded (disbelievers). Treaty-exception prevents religious solidarity from violating diplomatic commitments. Fitnah-fasad consequence motivates compliance through catastrophe-avoidance. Kinship-priority clause preserves pre-Islamic family obligations within new faith-framework preventing total social rupture. Kitab Allah reference grounds inheritance rules in divine decree not communal consensus."
));

// cand-0389: Satan abandonment
candidates.candidates.push(makeCand("cand-0389",
  "Satan's false protection abandoned: adorned deeds claimed invincibility and guardianship; fled at confrontation disassociated citing fear of Allah; severe penalty",
  undefined, "تخلي الشيطان عن الحماية الزائفة: زيّن الأعمال ادعى عدم الغلبة والجوار؛ فرّ عند المواجهة متبرئاً معلناً خوفه من الله؛ عقاب شديد",
  "In 8:48: When Satan adorned their deeds and said no one overcomes you today I am your protector. When two armies sighted each other he turned on heels said I am disassociated from you I see what you do not see I fear Allah and Allah is severe in penalty.",
  [{ key: "8:48", excerpt: fv(48), evidenceClass: "EXPLICIT_TEXT", rationale: "Waith zayyana lahumu alshshaytanu aAAmalahum: tazeen as deceptive beautification. Waqala la ghaliba lakumu alyawma mina alnnasi: false invincibility claim. Wainnee jarun lakum: false protection claim. Falamma taraati alfiatani nakasa AAala AAaqibayhi: heel-turning as cowardice-image. Waqala innee bareeon minkum: disassociation reversing earlier claim. Innee ara ma la tarawna: superior-perception claim explaining retreat. Innee akhafu Allaha: fear-profession ironically validating divine authority. WaAllahu shadeedu alAAiqabi: severity-declaration confirming Satan's fear was justified." }],
  [],
  "Gap candidate. Dramatic exposure of supernatural ally as unreliable demonstrating tawakkul necessity. Zayyana-a'mal identifies deception mechanism as aesthetic not rational. Jar-claim directly contradicted by baree-disassociation showing satanic promises inherently unstable. Ara ma la tarawna paradoxically acknowledges divine reality while fleeing it. Akhafu Allah from Satan's mouth serves as unintended testimony. Shadeed al-iqab closure confirms that Satan's fear was accurate diagnosis. Functions as cautionary tale against relying on any protection besides Allah."
));

// cand-0390: Peace inclination
candidates.candidates.push(makeCand("cand-0390",
  "Peace inclination reciprocity: if enemy inclines peace incline to it; rely on Allah; SameeAA Aleem",
  undefined, "تبادل الميل للسلم: إن جنحوا للسلم فاجنح لها؛ توكل على الله؛ إنه هو السميع العليم",
  "In 8:61: If they incline to peace then incline to it and rely upon Allah. Indeed He is the Hearing the Knowing.",
  [{ key: "8:61", excerpt: fv(61), evidenceClass: "EXPLICIT_TEXT", rationale: "Wain janahoo lilssalmi faijnah laha: reciprocal peace-obligation using same root (janaha) for both parties. Watawakkal AAala Allahi: tawakkul as safeguard against peace-as-trap. Innahu huwa alssameeAAu alAAaleemu: hearing-knowing pair ensuring divine awareness of both overt proposals and hidden intentions." }],
  [{ topicId: "patience", layer: "curated", relationship: "related-not-identical", note: "Peace-seeking as expression of disciplined restraint balanced with vigilance" }],
  "Overlap with patience. Reciprocal structure (janahoo/fajnaha) makes peace-response obligatory not optional when initiated by opponent. Tawakkul requirement prevents naive pacifism maintaining defensive readiness. SameeAA-Aleem pairing addresses information-asymmetry problem in negotiations: Allah hears proposals and knows intentions. Positioned after military-preparedness command (8:60) showing peace and preparedness as complementary not contradictory. Establishes Islamic diplomatic ethics balancing openness with caution."
));

// cand-0391: Treaty betrayal management
candidates.candidates.push(makeCand("cand-0391",
  "Treaty betrayal management: chronic breakers identified as worst creatures; war dominance as deterrent dispersal; anticipated betrayal met with equal notification; Allah loves not traitors",
  undefined, "إدارة خيانة العهد: ناقضو العهد المزمنون شر الدواب؛ الهيمنة الحربية ردع وتشريد؛ الخيانة المتوقعة تواجه بإنبذاذ على سواء؛ الله لا يحب الخائنين",
  "In 8:55-58: Worst creatures at Allah are those who disbelieved they will not believe. Those you made treaty with then break pledge every time not fearing. If you dominate them in war disperse by them those behind perhaps they remember. If you fear betrayal throw back to them equally. Indeed Allah does not love traitors.",
  [{ key: "8:55", excerpt: fv(55), evidenceClass: "EXPLICIT_TEXT", rationale: "Inna sharra alddawabbi AAinda Allahi allatheena kafaroo fahum la yuminoona: persistent disbelief as defining characteristic of worst creatures." },
   { key: "8:56", excerpt: fv(56), evidenceClass: "EXPLICIT_TEXT", rationale: "Allatheena AAahadta minhum thumma yanqudoona AAahdahum fee kulli marratin: kulli marratin (every time) establishes pattern not incident. Wahum la yattaqoona: taqwa-absence as root cause." },
   { key: "8:57", excerpt: fv(57), evidenceClass: "EXPLICIT_TEXT", rationale: "Faimma tathqafannahum fee alharbi fasharrid bihim man khalfahum: tashrid as deterrent communication. LaAAallahum yaththakkaroona: remembrance as desired outcome not destruction." },
   { key: "8:58", excerpt: fv(58), evidenceClass: "EXPLICIT_TEXT", rationale: "Waimma takhafanna min qawmin khiyanatan fainbith ilayhim AAala sawain: nabdh (throwing back) as transparent notification. AAala sawain: equality-condition preventing treacherous advantage. Inna Allaha la yuhibbu alkhaineena: divine disapproval of treachery applying to both sides." }],
  [],
  "Gap candidate. Graduated treaty-management protocol distinguishing chronic violators from uncertain parties. Kulli marratin identifies behavioral pattern requiring escalated response. Tashrid purpose explicitly pedagogical (yaththakkaroona) not punitive. Nabdh-AAala-sawa ensures procedural fairness even when suspecting betrayal. La yuhibbu al-khaineena universalizes prohibition preventing Muslim exemption from anti-treachery norms. Comprehensive framework balancing security concerns with ethical constraints."
));

// cand-0392: Military preparedness
candidates.candidates.push(makeCand("cand-0392",
  "Military preparedness doctrine: prepare power and war-steeds to terrify Allah's enemy your enemy unknown others; spending fully repaid without injustice",
  undefined, "عقيدة الاستعداد العسكري: أعدوا القوة ورباط الخيل ترهبون به عدو الله وعدوكم وآخرين لا تعلمونهم؛ الإنفاق مُوفّى بلا ظلم",
  "In 8:60: Prepare against them whatever power and war-steeds you can to terrify enemy of Allah and your enemy and others besides them you do not know Allah knows them. Whatever you spend in Allah's way will be fully repaid and you will not be wronged.",
  [{ key: "8:60", excerpt: fv(60), evidenceClass: "EXPLICIT_TEXT", rationale: "WaaAAiddoo lahum ma istataAAtum min quwwatin wamin ribati alkhayli: istataAAtum (whatever you can) sets capacity-relative standard. Turhiboona bihi AAaduwwa Allahi waAAaduwwakum: deterrence as stated purpose not conquest. Waakhareena min doonihim la taAAlamoonahumu Allahu yaAAlamuhum: unknown-enemy category expanding strategic horizon. Wama tunfiqoo min shayin fee sabeeli Allahi yuwaffa ilaykum: full-repayment guarantee. Waantum la tuthlamoona: injustice-negation ensuring divine accounting accuracy." }],
  [],
  "Gap candidate. Deterrence-based military doctrine framing armament as prevention not aggression. IstataAAtum makes obligation proportional to capacity preventing impossible burdens. Triple-enemy scope (Allah's enemy + your enemy + unknown others) requires comprehensive readiness. Unknown-enemy clause acknowledges intelligence limitations while affirming divine omniscience. Repayment-guarantee transforms military spending from loss to investment. La tuthlamoona assures precise accounting preventing anxiety about wasted resources. Foundation for Islamic defense ethics balancing preparedness with proportionality."
));

// cand-0393: Captive rehabilitation
candidates.candidates.push(makeCand("cand-0393",
  "Captive rehabilitation pathway: address prisoners promising better replacement for taken wealth plus forgiveness if hearts contain good; Ghafoor Raheem",
  undefined, "مسار تأهيل الأسرى: مخاطبة الأسرى بوعد تعويض أفضل مما أُخذ ومغفرة إن في قلوبهم خيراً؛ غفور رحيم",
  "In 8:70: O Prophet say to captives in your hands if Allah knows good in your hearts He will give you better than what was taken and forgive you. And Allah is Forgiving Merciful.",
  [{ key: "8:70", excerpt: fv(70), evidenceClass: "EXPLICIT_TEXT", rationale: "Ya ayyuha alnnabiyyu qul liman fee aydeekum mina alasra: direct prophetic address to captives personalizing message. In yaAAlami Allahu fee quloobikum khayran: divine heart-knowledge as basis for evaluation. Yutikum khayran mimma okhitha minkum: material replacement exceeding loss. Wayaghfir lakum: spiritual restoration added to material compensation. WaAllahu ghafoorun raheemun: divine attributes modeling expected treatment." }],
  [],
  "Gap candidate. Rehabilitation-oriented prisoner treatment contrasting with purely punitive approaches. Fee quloobikum khayran makes sincerity not mere compliance the criterion. Khayran mimma okhitha promises net gain incentivizing genuine transformation. Maghfirah addition elevates offer from transaction to redemption. Ghafoor-Raheem divine modeling suggests captors should embody these attributes. Addresses Badr prisoners historically while establishing timeless principle for post-conflict reconciliation."
));

// cand-0394: Pagan prayer characterization
candidates.candidates.push(makeCand("cand-0394",
  "Pagan prayer at Kaaba characterized as whistling and hand-clapping: ritual reduced to noise-performance; taste punishment for disbelief",
  undefined, "وصف صلاة المشركين عند الكعبة بالمكاء والتصدية: الشعيرة مختزلة إلى أداء ضوضائي؛ ذوقوا العذاب بما كنتم تكفرون",
  "In 8:35: Their prayer at the House was nothing but whistling and hand-clapping. So taste punishment for what you disbelieved.",
  [{ key: "8:35", excerpt: fv(35), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama kana salatuhum AAinda albayti illa mukaan watasdiyatan: illa (nothing but) reduces entire ritual to two sounds. Fathooqoo alAAathaba bima kuntum takfuroona: punishment framed as consequence of kufr not merely ritual impropriety." }],
  [],
  "Gap candidate. Radical desacralization of pagan worship reducing it to meaningless performance. Mukaa-tasdiyah pairing strips prayer of semantic content leaving only acoustic phenomena. Illa construction excludes any redeeming element. Taste-command (fathooqoo) makes punishment experiential matching sensory nature of criticized ritual. Bima kuntum takfuroona identifies root offense as disbelief not ritual form. Functions as theological justification for Kaaba purification while documenting pre-Islamic practices."
));

// cand-0395: Angelic soul-taking
candidates.candidates.push(makeCand("cand-0395",
  "Angelic soul-taking violence: angels strike faces and backs of dying disbelievers; taste burning fire; justified by hands' deeds; Allah not unjust",
  undefined, "عنف الملائكة عند قبض الأرواح: الملائكة تضرب وجوه وأدبار الكافرين الموتى؛ ذوقوا عذاب الحريق؛ مبرر بما قدمت الأيدي؛ الله ليس بظلام",
  "In 8:50-51: If you could see when angels take souls of disbelievers striking their faces and backs: taste punishment of burning fire. That is for what your hands sent forth and Allah is not ever unjust to servants.",
  [{ key: "8:50", excerpt: fv(50), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaw tara ith yatawaffa allatheena kafaroo almalaikatu: hypothetical vision inviting imaginative participation. Yadriboona wujoohahum waadbarahum: face-back striking as comprehensive humiliation. Wathooqoo AAathaba alhareeqi: taste-command paralleling 8:35 creating thematic link." },
   { key: "8:51", excerpt: fv(51), evidenceClass: "EXPLICIT_TEXT", rationale: "Thalika bima qaddamat aydeekum: hands-forward metaphor identifying personal responsibility. Waanna Allaha laysa bithallamin lilAAabeedi: injustice-negation defending divine justice even in violent punishment." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical", note: "Death-moment punishment as microcosm of eschatological justice" }],
  "Overlap with day-of-judgment. Hypothetical-vision format (walaw tara) makes unseen accessible to imagination. Face-back striking symbolizes total exposure no hiding place. Taste-command echoes 8:35 linking worldly ritual-critique to otherworldly consequence. Qaddamat aydeekum locates causality in accumulated actions not arbitrary divine wrath. Laysa bi-thallam provides theodicy-defense preempting injustice objections. Functions as eschatological counterpart to battlefield combat completing violence-attribution framework."
));

// cand-0396: Challenge prayer for punishment
candidates.candidates.push(makeCand("cand-0396",
  "Challenge prayer for punishment: disbelievers demanded stones from sky or painful punishment; dual immunity through Prophet presence and istighfar",
  undefined, "دعاء التحدي بالعقاب: الكافرون طلبوا حجارة من السماء أو عذاباً أليماً؛ حصانة مزدوجة بحضور النبي والاستغفار",
  "In 8:32-33: When they said O Allah if this is truth from You rain stones from sky or bring painful punishment. But Allah would not punish them while you are among them nor while they seek forgiveness.",
  [{ key: "8:32", excerpt: fv(32), evidenceClass: "EXPLICIT_TEXT", rationale: "Waith qaloo allahumma in kana hatha huwa alhaqqa min AAindika: conditional framing mimicking believer language. Faamtir AAalayna hijaratan mina alssamai: stone-demand echoing Lot-narrative. Awi itina biAAathabin aleemin: alternative punishment-request showing reckless confidence." },
   { key: "8:33", excerpt: fv(33), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama kana Allahu liyuAAaththibahum waanta feehim: Prophet-presence as first immunity-factor. Wama kana Allahu muAAaththibahum wahum yastaghfiroona: istighfar as second immunity-factor. Dual wama kana construction emphasizes divine restraint not inability." }],
  [],
  "Gap candidate. Hostile challenge transformed into mercy-demonstration through dual-immunity explanation. Stone-demand shows familiarity with prophetic narratives weaponized as mockery. Dual wama kana structure presents two independent mercy-mechanisms either sufficient alone. Prophet-presence immunity establishes his role as communal shield. Istighfar-immunity provides enduring mechanism applicable after his departure. Transforms aggressive demand into educational moment about divine patience."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-032.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-032.json");
console.log(`Generated ${candidates.candidates.length} candidates (cand-0377 through cand-${candidates.candidates[candidates.candidates.length-1].candidateId.replace('cand-','')})`);
console.log("Done.");
