// MFD-11 Nisa Pass 4 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah An-Nisa 4:116-152 (Passages 13-16, Candidates cand-0207..cand-0216).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "004-0116-0152.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 4:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Nisa Pass 4 files from verbatim corpus (4:116-152)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T07:20:00.000Z";

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

// ─── Passage 13: 4:116–126 ────────────────────────────────────────────────────────
const p13 = {
  extractionId: "ext-004-p13",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 116, toAyah: 126, label: "An-Nisa — Shirk unforgivable; invoking females and rebellious shaytan; shaytan's curse and deception program; taking shaytan as ally is clear loss; promises only delusion; refuge Hell; believers doing righteous admitted Gardens; Allah's promise truth; who more truthful than Allah; not by wishful thinking nor People of Scripture; whoever does evil recompensed; no protector besides Allah; righteous male or female enters Paradise not wronged speck; best religion submitting face to Allah being muhsin following millat Ibrahim hanif; Allah took Ibrahim khaleel; to Allah belongs whatever in heavens earth; Allah encompassing" },
  verseKeys: ["4:116","4:117","4:118","4:119","4:120","4:121","4:122","4:123","4:124","4:125","4:126"],
  arabicExcerpts: Array.from({length:11}, (_,i) => ({ key: `4:${i+116}`, text: fv(i+116) })),
  mainSubject: {
    label: "Shirk unforgivable; lesser sins forgivable; invoking females equals invoking rebellious shaytan whose program misleads arouses desires alters creation; taking shaytan as ally is clear loss promising only delusion; refuge Hell; believers doing righteous admitted gardens eternally; Allah's promise truth; paradise not by wishful thinking; evil recompensed; righteous male or female believer enters Paradise without injustice; best religion: submit to Allah be muhsin follow millat Ibrahim; Allah took Ibrahim as khaleel; universal ownership; Allah Encompassing",
    keys: ["4:116","4:117","4:118","4:119","4:120","4:121","4:122","4:123","4:124","4:125","4:126"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Shirk unforgivable; lesser sins forgivable", keys: ["4:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Invoking females equals invoking rebellious shaytan", keys: ["4:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaytan cursed; claims fixed portion of servants", keys: ["4:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaytan's program: mislead desires alter creation", keys: ["4:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taking shaytan as ally is clear loss", keys: ["4:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaytan's promises are only delusion", keys: ["4:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Refuge Hell; no escape", keys: ["4:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believers doing righteous: gardens rivers eternal", keys: ["4:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah's promise truth; who more truthful", keys: ["4:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Not by wishful thinking; evil recompensed", keys: ["4:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Righteous male or female enters Paradise; no injustice", keys: ["4:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Best religion: submit face be muhsin follow millat Ibrahim", keys: ["4:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah took Ibrahim as khaleel", keys: ["4:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal ownership; Allah Encompassing", keys: ["4:126"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Abraham as intimate friend and model of true religion", keys: ["4:125"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Delusion through shaytan's false promises", keys: ["4:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wishful thinking insufficient for salvation", keys: ["4:123"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0207","cand-0208","cand-0209"],
  notes: "Pass A Nisa passage 13/16. Re-establishes shirk-unforgivable axiom after legislative section. Exposes shaytan's operational methodology: altering creation and arousing desires. Contrasts divine promise truth with satanic delusion. Gender-inclusive salvation formula (4:124). Defines 'best religion' via four criteria: submission, ihsan, Abrahamic millat, khullah. Closes with ontological grounding in divine ownership.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p13.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:119"], excerpt: fv(119), description: "Prohibition implied: do not take Satan as an ally instead of Allah." });

// P13 divine names
{
  const t = findWordContaining(126, ["\u0645","\u062d","\u064a","\u0637"]); // muheetan
  if (t) p13.divineNamesAndAttributes.push({ term: t, transliteration: "Muheetan", gloss: "Encompassing (editorial gloss)", keys: ["4:126"] });
}

// P13 terminology
{
  const t = findWordContaining(117, ["\u0634","\u064a","\u0637","\u0627","\u0646"]); // shaytanan
  if (t) p13.terminology.push({ term: t, transliteration: "shaytanan", gloss: "Satan/rebellious one (editorial gloss)", keys: ["4:117"] });
}
{
  const t = findWordContaining(125, ["\u062e","\u0644","\u064a","\u0644"]); // khaleelan
  if (t) p13.terminology.push({ term: t, transliteration: "khaleelan", gloss: "intimate friend (editorial gloss)", keys: ["4:125"] });
}
{
  const t = findWordContaining(125, ["\u062d","\u0646","\u064a","\u0641"]); // haneefan
  if (t) p13.terminology.push({ term: t, transliteration: "haneefan", gloss: "inclining toward truth/monotheist (editorial gloss)", keys: ["4:125"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p13.json"), JSON.stringify(p13, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p13.json");

// ─── Passage 14: 4:127–135 ───────────────────────────────────────────────────────
const p14 = {
  extractionId: "ext-004-p14",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 127, toAyah: 135, label: "An-Nisa — Consultation about women; Allah instructs concerning orphan girls desired for marriage without prescribed share; weak children; maintain orphans justly; whatever good done Allah knows; woman fears ill-treatment or desertion no blame reconciliation; reconciliation better; souls prone to greed; do good fear Allah Allah Acquainted; cannot be equal between wives even if eager do not incline completely leaving one suspended; reform fear Allah Forgiving Merciful; if separate Allah enriches each from abundance Allah Encompassing Wise; to Allah belongs heavens earth; instructed those given scripture before and yourselves fear Allah; if disbelieve still Allah owns all Allah Free of Need Praiseworthy; if wills remove you bring others Allah Powerful; whoever desires reward this world with Allah reward both worlds Allah Hearing Seeing; O believers stand firmly justice witnesses for Allah even against selves parents relatives rich poor Allah more worthy; do not follow inclination avoid justice; distort turn away Allah Acquainted" },
  verseKeys: ["4:127","4:128","4:129","4:130","4:131","4:132","4:133","4:134","4:135"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `4:${i+127}`, text: fv(i+127) })),
  mainSubject: {
    label: "Ruling on orphan girls desired for marriage without prescribed rights; oppressed children; maintain orphans justly; marital conflict settlement preferred; souls prone to greed; impossible emotional equality between wives; do not leave one suspended; reform and taqwa earn forgiveness; separation: Allah enriches each; universal ownership; taqwa instructed to past and present communities; Allah Free of Need Praiseworthy; power to replace people; reward of both worlds with Allah; stand firmly for justice as witnesses for Allah even against self parents relatives rich poor; do not follow inclination avoiding justice",
    keys: ["4:127","4:128","4:129","4:130","4:131","4:132","4:133","4:134","4:135"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Ruling on orphan girls desired for marriage without rights", keys: ["4:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Oppressed children and orphan justice", keys: ["4:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Marital conflict resolution: settlement better", keys: ["4:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Souls prone to greed/shuhh", keys: ["4:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Impossibility of perfect equality between wives", keys: ["4:129"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: do not leave wife suspended", keys: ["4:129"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Separation: Allah enriches each from abundance", keys: ["4:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Instruction to previous and current communities: fear Allah", keys: ["4:131"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah Free of Need Praiseworthy; power to replace", keys: ["4:132","4:133"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reward of this world and hereafter with Allah", keys: ["4:134"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: stand firmly for justice witnesses for Allah", keys: ["4:135"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Justice even against self parents relatives rich poor", keys: ["4:135"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not follow inclination avoiding justice", keys: ["4:135"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Psychological realism: souls prone to greed", keys: ["4:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Acknowledged limitation: imperfect emotional equality", keys: ["4:129"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Protection of orphan girls' marital and financial rights", keys: ["4:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divorce economics: divine enrichment post-separation", keys: ["4:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Impartial justice transcending kinship and class", keys: ["4:135"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Marital reconciliation preferred over conflict", keys: ["4:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guardianship responsibility toward orphans", keys: ["4:127"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0210","cand-0211","cand-0212"],
  notes: "Pass A Nisa passage 14/16. Comprehensive family law and ethics block. Addresses vulnerable demographics (orphan girls, oppressed children). Psychological realism about greed and imperfect polygamous equity. Divorce framed within divine provision theology. Universal taqwa instruction linking past and present communities. Culminates in absolute justice command overriding all social bonds. Qawwameena bil-qisti establishes persistent institutional stance not occasional act.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p14.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:127"], excerpt: fv(127), description: "Command: maintain justice for orphans." });
p14.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:129"], excerpt: fv(129), description: "Prohibition: do not incline completely toward one wife leaving another suspended." });
p14.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:135"], excerpt: fv(135), description: "Command: be persistently standing firm in justice as witnesses for Allah even against yourselves or parents or relatives." });
p14.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:135"], excerpt: fv(135), description: "Prohibition: do not follow personal inclination lest you fail to be just." });

// P14 divine names
{
  const t1 = findWordContaining(129, ["\u063a","\u0641","\u0648","\u0631"]); // ghafooran
  const t2 = findWordContaining(129, ["\u0631","\u062d","\u064a","\u0645"]); // raheeman
  if (t1 && t2) {
    const fullText = fv(129);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p14.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafooran Raheema", gloss: "Forgiving Merciful (editorial gloss)", keys: ["4:129"] });
    }
  }
}
{
  const t1 = findWordContaining(130, ["\u0648","\u0627","\u0633","\u0639"]); // wasiAAan
  const t2 = findWordContaining(130, ["\u062d","\u0643","\u064a","\u0645"]); // hakeeman
  if (t1 && t2) {
    const fullText = fv(130);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p14.divineNamesAndAttributes.push({ term: phrase, transliteration: "WasiAAan Hakeema", gloss: "Encompassing Wise (editorial gloss)", keys: ["4:130"] });
    }
  }
}
{
  const t1 = findWordContaining(131, ["\u063a","\u0646","\u064a"]); // ghaniyyan
  const t2 = findWordContaining(131, ["\u062d","\u0645","\u064a","\u062f"]); // hameedan
  if (t1 && t2) {
    const fullText = fv(131);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p14.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghaniyyan Hameeda", gloss: "Free of Need Praiseworthy (editorial gloss)", keys: ["4:131"] });
    }
  }
}
{
  const t1 = findWordContaining(134, ["\u0633","\u0645","\u064a","\u0639"]); // sameeAAan
  const t2 = findWordContaining(134, ["\u0628","\u0635","\u064a","\u0631"]); // baseeran
  if (t1 && t2) {
    const fullText = fv(134);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p14.divineNamesAndAttributes.push({ term: phrase, transliteration: "SameeAAan Baseera", gloss: "Hearing Seeing (editorial gloss)", keys: ["4:134"] });
    }
  }
}

// P14 terminology
{
  const t = findWordContaining(128, ["\u0646","\u0634","\u0648","\u0632"]); // nushoozan
  if (t) p14.terminology.push({ term: t, transliteration: "nushoozan", gloss: "contempt/rebellion/ill-treatment (editorial gloss)", keys: ["4:128"] });
}
{
  const t = findWordContaining(128, ["\u0634","\u062d"]); // alshshuhha
  if (t) p14.terminology.push({ term: t, transliteration: "al-shuhha", gloss: "greed/stinginess (editorial gloss)", keys: ["4:128"] });
}
{
  const t = findWordContaining(135, ["\u0642","\u0648","\u0627","\u0645","\u064a","\u0646"]); // qawwameena
  if (t) p14.terminology.push({ term: t, transliteration: "qawwameena", gloss: "persistently standing firm/upholders (editorial gloss)", keys: ["4:135"] });
}
{
  const t = findWordContaining(135, ["\u0642","\u0633","\u0637"]); // bilqisti
  if (t) p14.terminology.push({ term: t, transliteration: "bil-qisti", gloss: "in justice/equity (editorial gloss)", keys: ["4:135"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p14.json"), JSON.stringify(p14, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p14.json");

// ─── Passage 15: 4:136–143 ──────────────────────────────────────────────────────
const p15 = {
  extractionId: "ext-004-p15",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 136, toAyah: 143, label: "An-Nisa — O believers believe in Allah Messenger Book sent to Messenger scripture before; whoever disbelieves Allah angels books messengers Last Day gone far astray; believed then disbelieved then believed then disbelieved increased disbelief Allah never forgive nor guide; glad tidings hypocrites painful punishment; take disbelievers allies instead believers seeking honor but honor belongs Allah entirely; revealed in Book when hear ayat denied mocked do not sit until different conversation otherwise like them; Allah gather hypocrites disbelievers Hell together; those wait watching if victory say were we not with you if disbelievers chance say did we not gain advantage protect from believers; Allah judges Day Resurrection never give disbelievers way over believers; hypocrites deceive Allah He deceives them; stand prayer lazily showing off remember little; wavering between neither these nor those; whom Allah sends astray never find way; believers righteous deeds gardens rivers flowing abiding forever promise truth who more truthful than Allah" },
  verseKeys: ["4:136","4:137","4:138","4:139","4:140","4:141","4:142","4:143"],
  arabicExcerpts: Array.from({length:8}, (_,i) => ({ key: `4:${i+136}`, text: fv(i+136) })),
  mainSubject: {
    label: "Believe in Allah Messenger Book and prior scripture; disbelief in core articles equals far astray; repeated belief-disbelief cycle unforgivable; hypocrites face painful punishment; seeking honor through disbeliever alliances misplaced since all honor belongs to Allah; withdraw from ayat-mocking company or become like them; hypocrites and disbelievers gathered in Hell; opportunistic watchers claim allegiance to victors; Allah judges Resurrection Day never giving disbelievers way over believers; hypocrites deceive Allah but He deceives them; lazy showy prayer with minimal dhikr; wavering between neither group; no way for whom Allah misdirects",
    keys: ["4:136","4:137","4:138","4:139","4:140","4:141","4:142","4:143"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Affirmation of comprehensive belief articles", keys: ["4:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelief in core articles equals far astray", keys: ["4:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repeated apostasy cycle: unforgivable escalation", keys: ["4:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocrites: painful punishment announced", keys: ["4:138"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Seeking honor through disbeliever alliances misplaced", keys: ["4:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Protocol: withdraw from ayat-mocking company", keys: ["4:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Equivalence: sitting with mockers makes one like them", keys: ["4:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Opportunistic allegiance of watchers", keys: ["4:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guarantee: disbelievers never dominate believers", keys: ["4:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reciprocal deception: hypocrites deceived by Allah", keys: ["4:142"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Performative prayer: lazy showy minimal dhikr", keys: ["4:142"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Existential wavering: neither group", keys: ["4:143"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Spiritual instability: repeated belief-disbelief cycling", keys: ["4:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Performative religiosity masking inner emptiness", keys: ["4:142"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Existential paralysis: belonging nowhere", keys: ["4:143"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Social boundary maintenance: withdrawal from sacrilege", keys: ["4:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Political opportunism exposed", keys: ["4:141"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0213","cand-0214"],
  notes: "Pass A Nisa passage 15/16. Intensifies treatment of hypocrisy and belief boundaries. Six-article faith formula (4:136). Repeated apostasy distinguished from single lapse (4:137). Social hygiene protocol against sacrilegious company (4:140). Reciprocal deception concept unique to hypocrites (4:142). Existential diagnosis of muthabthabeen (wavering ones) as distinct category. Overlaps with scholarly topic 'hypocrisy'.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p15.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:136"], excerpt: fv(136), description: "Command: O believers believe in Allah His Messenger the Book sent to him and prior scripture." });
p15.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:140"], excerpt: fv(140), description: "Prohibition: do not sit with those denying and mocking Allah's ayat until they change topic." });

// P15 divine names - none explicitly named beyond Allah in this passage segment

// P15 terminology
{
  const t = findWordContaining(138, ["\u0645","\u0646","\u0627","\u0641","\u0642"]); // munafiqeen
  if (t) p15.terminology.push({ term: t, transliteration: "al-munafiqeen", gloss: "the hypocrites (editorial gloss)", keys: ["4:138"] });
}
{
  const t = findWordContaining(142, ["\u064a","\u0631","\u0627","\u0626"]); // yura'oona
  if (t) p15.terminology.push({ term: t, transliteration: "yura'oona", gloss: "showing off/ostentation (editorial gloss)", keys: ["4:142"] });
}
{
  const t = findWordContaining(143, ["\u0645","\u0630","\u0628","\u0630","\u0628"]); // muthabthabeen
  if (t) p15.terminology.push({ term: t, transliteration: "muthabthabeen", gloss: "wavering/undecided ones (editorial gloss)", keys: ["4:143"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p15.json"), JSON.stringify(p15, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p15.json");

// ─── Passage 16: 4:144–152 ─────────────────────────────────────────────────────
const p16 = {
  extractionId: "ext-004-p16",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 144, toAyah: 152, label: "An-Nisa — Alliance prohibition reprise; hypocrites lowest depths Fire; repentance exception; divine non-need for punishment; public evil speech ethics; selective belief as true disbelief; undifferentiated belief earns rewards" },
  verseKeys: ["4:144","4:145","4:146","4:147","4:148","4:149","4:150","4:151","4:152"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `4:${i+144}`, text: fv(i+144) })),
  mainSubject: {
    label: "Do not take disbelievers as allies; hypocrites in lowest Fire no helper; exception: repent reform hold fast to Allah sincere religion join believers; Allah has no need for punishment if grateful believing; public evil speech disliked except by wronged; disclose good conceal or pardon; selective belief between Allah and messengers is true disbelief; undifferentiated belief earns rewards forgiveness mercy",
    keys: ["4:144","4:145","4:146","4:147","4:148","4:149","4:150","4:151","4:152"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Alliance prohibition: clear case against self", keys: ["4:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocrites: lowest depths Fire no helper", keys: ["4:145"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance exception: reform sincerity integration", keys: ["4:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine non-need for punishment given gratitude belief", keys: ["4:147"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Public evil speech disliked except by wronged", keys: ["4:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Preference: disclose good conceal pardon", keys: ["4:149"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Selective belief equals true disbelief", keys: ["4:150","4:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Undifferentiated belief earns forgiveness mercy", keys: ["4:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People of Scripture demanded physical manifestation", keys: ["4:153"], evidenceClass: "CONTEXTUAL", notes: "Note: 4:153 is outside range; this refers to narrative beginning in 4:153 which continues beyond. Actually checking corpus: 4:153 IS in range? No, range ends 152. Wait - corpus dump shows 152 as last. Let me re-check. The prompt says 4:144-152. But the narrative about Musa/calf/Mount extends into 153+. Checking corpus file... yes 152 is last verse in dump. So the narrative summary must be constrained to what appears IN 144-152. Looking at corpus: 4:153 is NOT in the dump. The prompt's suggested passage 16 content includes material from 4:153+. I must adjust. Actually re-reading corpus: verse 152 text mentions 'great reward' ending. The Musa/calf/Sabbath/Isa narrative is in 4:153-159 which is OUTSIDE my range. I MUST NOT include content from verses outside 4:144-152." },
    // CORRECTION: Removing out-of-range content. Passage 16 covers ONLY 4:144-152.
    // Re-examining corpus for actual 4:144-152 content:
    // 144: alliance prohibition
    // 145: hypocrites lowest fire
    // 146: repentance exception
    // 147: what would Allah do with punishment
    // 148: public evil speech
    // 149: disclose good conceal pardon
    // 150: selective belief
    // 151: truly disbelievers humiliating punishment
    // 152: undifferentiated belief rewards
    // The Musa/Isa/Jews narrative is NOT in this range. Correcting labels below.
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Selective belief as cognitive dissonance strategy", keys: ["4:150"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Speech ethics: public vs private handling of evil", keys: ["4:148","4:149"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0215","cand-0216"],
  notes: "Pass A Nisa passage 16/16. Concludes major block with alliance prohibition reprise. Hypocrite eschatology intensified to 'lowest depths'. Repentance pathway specified with four conditions. Divine psychology: no interest in punishment per se. Speech ethics distinguish public/private evil. Selective belief identified as coherent disbelief. NOTE: Prompt suggested content from 4:153+ (Musa/Isa/Jews narratives) but corpus range ends at 4:152. Extraction strictly limited to actual verse content in range.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Fixing subordinate subjects to match ACTUAL 4:144-152 content
p16.subordinateSubjects = [
  { label: "Alliance prohibition: clear case against self", keys: ["4:144"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Hypocrites: lowest depths Fire no helper", keys: ["4:145"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Repentance exception: reform hold fast sincerity", keys: ["4:146"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Divine non-need for punishment given gratitude belief", keys: ["4:147"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Public evil speech disliked except by wronged", keys: ["4:148"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Disclose good conceal pardon: Allah Pardoning Capable", keys: ["4:149"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Selective belief between Allah and messengers is true disbelief", keys: ["4:150"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Humiliating punishment prepared for selective disbelievers", keys: ["4:151"], evidenceClass: "EXPLICIT_TEXT" },
  { label: "Undifferentiated belief in Allah and all messengers earns rewards", keys: ["4:152"], evidenceClass: "EXPLICIT_TEXT" }
];

// Fixing main subject label to remove out-of-range content
p16.mainSubject.label = "Do not take disbelievers as allies; hypocrites in lowest Fire no helper; exception: repent reform hold fast to Allah sincere religion join believers; Allah has no need for punishment if grateful believing; public evil speech disliked except by wronged; disclose good conceal or pardon; selective belief between Allah and messengers is true disbelief; undifferentiated belief earns rewards forgiveness mercy";

p16.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:144"], excerpt: fv(144), description: "Prohibition: do not take disbelievers as allies instead of believers." });
p16.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:146"], excerpt: fv(146), description: "Command implied: repent reform hold fast to Allah and be sincere in religion." });

// P16 divine names
{
  const t1 = findWordContaining(147, ["\u0634","\u0627","\u0643","\u0631"]); // shakiran
  const t2 = findWordContaining(147, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleeman
  if (t1 && t2) {
    const fullText = fv(147);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p16.divineNamesAndAttributes.push({ term: phrase, transliteration: "Shakiran AAaleema", gloss: "Appreciative Knowing (editorial gloss)", keys: ["4:147"] });
    }
  }
}
{
  const t1 = findWordContaining(148, ["\u0633","\u0645","\u064a","\u0639"]); // sameeAAan
  const t2 = findWordContaining(148, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleeman
  if (t1 && t2) {
    const fullText = fv(148);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p16.divineNamesAndAttributes.push({ term: phrase, transliteration: "SameeAAan AAaleema", gloss: "Hearing Knowing (editorial gloss)", keys: ["4:148"] });
    }
  }
}
{
  const t1 = findWordContaining(149, ["\u0639","\u0641","\u0648"]); // AAafuwwan
  const t2 = findWordContaining(149, ["\u0642","\u062f","\u064a","\u0631"]); // qadeeran
  if (t1 && t2) {
    const fullText = fv(149);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p16.divineNamesAndAttributes.push({ term: phrase, transliteration: "AAafuwwan Qadeera", gloss: "Pardoning Capable (editorial gloss)", keys: ["4:149"] });
    }
  }
}
{
  const t1 = findWordContaining(152, ["\u063a","\u0641","\u0648","\u0631"]); // ghafooran
  const t2 = findWordContaining(152, ["\u0631","\u062d","\u064a","\u0645"]); // raheeman
  if (t1 && t2) {
    const fullText = fv(152);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p16.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafooran Raheema", gloss: "Forgiving Merciful (editorial gloss)", keys: ["4:152"] });
    }
  }
}

// P16 terminology
{
  const t = findWordContaining(144, ["\u0633","\u0644","\u0637","\u0627","\u0646"]); // sultanan
  if (t) p16.terminology.push({ term: t, transliteration: "sultanan", gloss: "clear case/proof/authority (editorial gloss)", keys: ["4:144"] });
}
{
  const t = findWordContaining(145, ["\u062f","\u0631","\u0643"]); // alddarki
  if (t) p16.terminology.push({ term: t, transliteration: "al-darki", gloss: "depth/lowest level (editorial gloss)", keys: ["4:145"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p16.json"), JSON.stringify(p16, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p16.json");

// ─── Candidates batch (cand-0207 through cand-0216) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-004-p13,ext-004-p14,ext-004-p15,ext-004-p16",
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

// cand-0207: Shaytan's operational methodology
candidates.candidates.push(makeCand("cand-0207",
  "Shaytan's operational methodology: systematic program of misleading arousing desires commanding alteration of divine creation",
  undefined, "منهجية الشيطان: برنامج منظم للتضليل وإثارة الشهوات وتغيير خلق الله",
  "In 4:119: Shaytan declares his program: I will mislead them, arouse sinful desires in them, command them to slit cattle ears, and command them to change Allah's creation. Taking him as ally instead of Allah is clear loss.",
  [{ key: "4:119", excerpt: fv(119), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaodillannahum walaomanniyannahum walaamurannahum falayubattikunna athana alanAAami walaamurannahum falayughayyirunna khalqa Allahi: four-part declaration of satanic methodology. Misleading (idlal), desire-arousal (tamniya), ritual innovation (ear-slitting), and ontological alteration (taghyeer khalq Allah). Khusranan mubeenan: clear quantifiable loss." }],
  [],
  "Gap candidate. Most detailed Quranic exposition of satanic modus operandi. Four operations target different human vulnerabilities: cognitive (misleading), appetitive (desires), ritual (innovation), ontological (altering nature). Taghyeer khalq Allah suggests bioethical dimension relevant to contemporary debates. Clear loss framing makes alliance calculus explicit."
));

// cand-0208: Wishful thinking insufficiency
candidates.candidates.push(makeCand("cand-0208",
  "Salvation insufficiency of wishful thinking: neither Muslim nor People of Scripture aspirations substitute for accountability",
  undefined, "عدم كفاية الأماني: أماني المسلمين وأهل الكتاب لا تغني عن المحاسبة",
  "In 4:123: Paradise is not obtained by your wishful thinking nor by that of the People of the Scripture. Whoever does evil will be recompensed for it and will find no protector or helper besides Allah.",
  [{ key: "4:123", excerpt: fv(123), evidenceClass: "EXPLICIT_TEXT", rationale: "Laysa biamaniyyikum wala amaniyyi ahli alkitabi: symmetric negation addressing both communities. Man yaAAmal sooan yujza bihi: universal accountability principle. Wala yajid lahu min dooni Allahi waliyyan wala naseeran: divine exclusivity in protection." }],
  [],
  "Gap candidate. Deconstructs communal exceptionalism for both Muslims and People of Scripture. Amanni (wishful thinking/aspirations) distinguished from active righteousness. Universal recompense principle removes ethnic/confessional privilege. Solo divine guardianship eliminates intermediary reliance."
));

// cand-0209: Gender-inclusive salvation formula
candidates.candidates.push(makeCand("cand-0209",
  "Gender-inclusive salvation: righteous deeds by male or female believer equally admitted to Paradise without injustice",
  undefined, "شمولية الخلاص: العمل الصالح من ذكر أو أنثى مؤمنة يدخل الجنة",
  "In 4:124: Whoever does righteous deeds whether male or female while being a believer - those will enter Paradise and will not be wronged even as much as the speck on a date seed.",
  [{ key: "4:124", excerpt: fv(124), evidenceClass: "EXPLICIT_TEXT", rationale: "Min thakarin aw ontha: explicit gender pairing. Wahuwa muminun: faith condition applies equally. Yadkhuloona aljannata: identical outcome. Wala yuthlamoona naqeeran: precision metaphor (date-seed speck) emphasizing zero-tolerance injustice." }],
  [],
  "Gap candidate. Most explicit gender-parity soteriological statement in Quran. Naqeer (speck on date seed) provides concrete micro-measure of divine justice precision. Faith-plus-righteousness formula identical for both genders. Contrasts with pre-Islamic gender-differentiated spiritual valuations."
));

// cand-0210: Orphan girls' marital rights protection
candidates.candidates.push(makeCand("cand-0210",
  "Orphan girls' marital rights: prohibition against marrying orphan wards while withholding prescribed shares",
  undefined, "حقوق اليتيمات الزوجية: النهي عن نكاحهن مع منع حقوقهن المفروضة",
  "In 4:127: They consult you about women. Say Allah instructs concerning orphan girls to whom you do not give what is prescribed for them yet you desire to marry them and concerning oppressed children and maintaining orphans justly.",
  [{ key: "4:127", excerpt: fv(127), evidenceClass: "EXPLICIT_TEXT", rationale: "Fee yatama alnnisai allatee la tutoonahunna ma kutiba lahunna watarghaboona an tankihoohunna: identifies specific abuse pattern - desiring marriage while withholding financial rights. WaalmustadAAafeena mina alwildani: extends protection to vulnerable children generally. Biqisti: justice standard." }],
  [],
  "Gap candidate. Addresses intersection of guardianship power and marital desire creating conflict of interest. La tutoonahunna ma kutiba lahunna implies established written/prescribed entitlement being violated. Protection framed within broader orphan justice mandate. Historical context: pre-Islamic guardians marrying orphan wards for property absorption."
));

// cand-0211: Marital equity psychological realism
candidates.candidates.push(makeCand("cand-0211",
  "Polygamous equity limitation: acknowledged impossibility of perfect emotional equality with prohibition against total neglect",
  undefined, "حدود العدل بين الزوجات: استحالة المساواة العاطفية مع تحريم الإهمال الكلي",
  "In 4:129: You will never be able to be equal between wives even if you strive. So do not incline completely leaving one hanging. If you reform and fear Allah then Allah is Forgiving Merciful.",
  [{ key: "4:129", excerpt: fv(129), evidenceClass: "EXPLICIT_TEXT", rationale: "Walan tastateeAAoo an taAAdiloo bayna alnnisai walaw harastum: categorical impossibility statement despite effort. Fala tameeloo kulla almayli fatatharooha kaalmuAAallaqati: behavioral boundary preventing total abandonment. KaalmuAAallaqati: vivid metaphor of suspended/unattached state." }],
  [],
  "Gap candidate. Psychological realism distinguishes emotional equity (impossible) from behavioral equity (required). MuAAallaqah (suspended) captures liminal suffering of neglected co-wife. Reform-plus-taqwa pathway acknowledges inevitable shortfall while maintaining accountability. Ghafooran Raheema closure provides mercy framework for acknowledged human limitation."
));

// cand-0212: Absolute justice command
candidates.candidates.push(makeCand("cand-0212",
  "Absolute justice imperative: persistent standing firm for justice as witnesses for Allah overriding self-interest kinship and class",
  undefined, "أمر العدالة المطلق: القيام بالقسط شهداء لله فوق المصلحة الذاتية والقرابة والطبقة",
  "In 4:135: O believers be persistently standing firm in justice witnesses for Allah even against yourselves or parents or relatives whether rich or poor Allah is more worthy of both. Do not follow inclination lest you avoid justice.",
  [{ key: "4:135", excerpt: fv(135), evidenceClass: "EXPLICIT_TEXT", rationale: "Koonoo qawwameena bialqisti: intensive form (qawwameena) implies institutional persistence not occasional action. Shuhadaa lillahi: witnessing framed as divine service. Walaw AAala anfusikum awi alwalidayni waalaqrabeena: three-tier override hierarchy (self parents kin). In yakun ghaniyyan aw faqeeran: class neutrality. FaAllahu awla bihima: divine priority over human loyalty." }],
  [],
  "Overlap with justice (scholarly) as primary textual anchor. Qawwameena (persistent upholders) stronger than mere 'doers'. Three-tier override creates graduated loyalty test. Class-neutrality clause prevents economic capture of justice. Hawa (inclination) identified as systemic threat to judicial integrity."
));

// cand-0213: Repeated apostasy unforgivability
candidates.candidates.push(makeCand("cand-0213",
  "Repeated apostasy cycle: belief-disbelief-belief-disbelief escalation resulting in permanent divine abandonment",
  undefined, "دورة الردة المتكررة: الإيمان ثم الكفر ثم الإيمان ثم الكفر تؤدي إلى الهجران الإلهي الدائم",
  "In 4:137: Those who believed then disbelieved then believed then disbelieved then increased in disbelief - Allah will never forgive them nor guide them to a way.",
  [{ key: "4:137", excerpt: fv(137), evidenceClass: "EXPLICIT_TEXT", rationale: "Amanoo thumma kafaroo thumma amanoo thumma kafaroo thumma izdadoo kufran: five-stage oscillation pattern culminating in intensification (izdadoo). Lam yakuni Allahu liyaghfira lahum: categorical forgiveness denial. Wala liyahdiyahum sabeelan: guidance pathway permanently closed." }],
  [],
  "Gap candidate. Distinguishes single apostasy from chronic oscillation pattern. Five-stage sequence suggests deliberate testing rather than sincere struggle. Izdadoo kufran (increased disbelief) marks qualitative shift from vacillation to entrenchment. Permanent closure contrasts with open repentance pathways elsewhere. Psychological profile: instrumental faith treating belief as tactical option."
));

// cand-0214: Sacrilegious company withdrawal protocol
candidates.candidates.push(makeCand("cand-0214",
  "Sacrilege withdrawal protocol: mandatory departure from company denying or mocking divine ayat until topic changes",
  undefined, "بروتوكول الانسحاب من مجالس الاستهزاء: وجوب مغادرة مجلس إنكار آيات الله",
  "In 4:140: It has been revealed in the Book that when you hear Allah's ayat denied and mocked do not sit with them until they enter different conversation otherwise you are like them. Allah will gather hypocrites and disbelievers in Hell together.",
  [{ key: "4:140", excerpt: fv(140), evidenceClass: "EXPLICIT_TEXT", rationale: "Waqad nazzala AAalaykum fee alkitabi: references prior revelation establishing continuity. Itha samiAAtum ayati Allahi yukfaru biha wayustahzao biha: two offenses identified (denial plus mockery). Fala taqAAudoo maAAahum hatta yakhoodoo fee hadeethin ghayrihi: temporal boundary tied to topic change. Innakum ithan mithluhum: equivalence principle making presence complicity." }],
  [],
  "Gap candidate. Establishes social hygiene boundary against sacrilege normalization. Dual trigger (kufr + istihza) covers intellectual rejection and emotional ridicule. Temporal limit (hatta yakhoodoo) prevents permanent isolationism. Mithluhum (like them) collapses distinction between active mocker and passive audience. Eschatological consequence reinforces social boundary."
));

// cand-0215: Selective belief as coherent disbelief
candidates.candidates.push(makeCand("cand-0215",
  "Selective belief invalidity: distinguishing between Allah and His messengers constitutes true disbelief not partial faith",
  undefined, "بطلان الإيمان الانتقائي: التفريق بين الله ورسله كفر حقيقي لا إيمان جزئي",
  "In 4:150-151: Those who disbelieve in Allah and His messengers wishing to distinguish between them saying we believe in some and reject some wanting a middle way - those are the disbelievers truly and We have prepared for disbelievers humiliating punishment.",
  [{ key: "4:150", excerpt: fv(150), evidenceClass: "EXPLICIT_TEXT", rationale: "Yureedoona an yufarriqoo bayna Allahi warusulihi: intentional separation identified. Nu/minu bibaAAdin wanakfuru bibaAAdin: selective creed quoted directly. Yattakhithoo bayna thalika sabeelan: middle-way aspiration diagnosed as strategic compromise." },
   { key: "4:151", excerpt: fv(151), evidenceClass: "EXPLICIT_TEXT", rationale: "Olaika humu alkafiroona haqqan: emphatic classification as true disbelievers. AAathaban muheenan: humiliating punishment matches humiliation of rejected messengers." }],
  [],
  "Gap candidate. Deconstructs cafeteria-style religiosity. Separation of Allah from messengers treated as structural disbelief not gradation. Haqqan (truly) removes ambiguity about classification. Muhinan (humiliating) punishment mirrors dignity violation of selective acceptance. Targets both historical Jewish-Christian partial recognition and modern spiritual-but-not-religious positions."
));

// cand-0216: Divine non-need for punishment
candidates.candidates.push(makeCand("cand-0216",
  "Divine punishment non-necessity: Allah has no interest in punishment when gratitude and belief are present",
  undefined, "عدم حاجة الله للعذاب: لا مصلحة إلهية في العقاب مع وجود الشكر والإيمان",
  "In 4:147: What would Allah do with your punishment if you are grateful and believe? And ever is Allah Appreciative and Knowing.",
  [{ key: "4:147", excerpt: fv(147), evidenceClass: "EXPLICIT_TEXT", rationale: "Ma yafAAalu Allahu biAAathabikum: rhetorical question implying answer 'nothing'. In shakartum waamantum: two sufficient conditions named. Shakiran AAaleema: divine appreciation paired with knowledge suggesting responsive rather than arbitrary disposition." }],
  [],
  "Gap candidate. Fundamental theological statement on divine motivation. Rhetorical question format invites listener to recognize punishment absurdity given gratitude-belief. Shakir (Appreciative) frames Allah as responsive to human moral effort rather than detached sovereign. Contrasts with retributive-only theologies. Establishes gratitude-belief as sufficient condition for divine non-punishment."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-021.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-021.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-004-p13 through ext-004-p16)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0207 through cand-${String(206 + candidates.candidates.length).padStart(4,'0')})`);
