// MFD-11 Maidah Pass 2 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Ma'idah 5:36-70 (Passages 5-8, Candidates cand-0237..cand-0246).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "005-0036-0070.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 5:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Maidah Pass 2 files from verbatim corpus (5:36-70)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T08:00:00.000Z";

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

// ─── Passage 5: 5:36–40 ────────────────────────────────────────────────────────
const p5 = {
  extractionId: "ext-005-p5",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 36, toAyah: 40, label: "Al-Ma'idah — Disbelievers ransom rejected even with earth's wealth; painful enduring punishment; desire to exit Fire impossible; thief male and female cut off hands as recompense deterrent from Allah; Allah Exalted Wise; whoever repents after wrongdoing and reforms Allah accepts repentance; Allah Forgiving Merciful; Allah owns dominion heavens earth punishes forgives whom He wills; over all things Capable" },
  verseKeys: ["5:36","5:37","5:38","5:39","5:40"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `5:${i+36}`, text: fv(i+36) })),
  mainSubject: {
    label: "Disbelievers cannot ransom themselves from Resurrection punishment; enduring torment in Fire; theft penalty hand amputation as divine deterrent; repentance after wrongdoing accepted by Allah; divine sovereignty over punishment and forgiveness",
    keys: ["5:36","5:37","5:38","5:39","5:40"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Ransom rejection: all earth's wealth insufficient for disbelievers on Resurrection Day", keys: ["5:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enduring punishment: desire to leave Fire never granted", keys: ["5:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Theft penalty: hand amputation for male and female thieves as exemplary deterrent", keys: ["5:38"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance acceptance: reform after wrongdoing earns divine forgiveness", keys: ["5:39"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine dominion: Allah punishes and forgives whom He wills; over all things Capable", keys: ["5:40"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Futile desire to escape Fire after entering it", keys: ["5:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance and reform as pathway to divine acceptance", keys: ["5:39"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Theft deterrence through corporal punishment as societal protection", keys: ["5:38"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0237","cand-0238"],
  notes: "Pass A Maidah passage 5/8. Transitions from hirabah penalties (end of P4) to theft hadd. Repentance clause (5:39) parallels 5:34 hirabah exception establishing consistent mercy framework within penal legislation. Divine sovereignty declaration (5:40) grounds both punishment and forgiveness in Allah's exclusive authority preventing human despair or presumption.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p5.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:38"], excerpt: fv(38), description: "Command: cut off hands of male and female thieves as recompense for what they earned." });
p5.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:39"], excerpt: fv(39), description: "Declaration: whoever repents after wrongdoing and reforms, Allah accepts his repentance." });

// P5 divine names
{
  const t1 = findWordContaining(39, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(39, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t1 && t2) {
    const fullText = fv(39);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p5.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafoorun Raheem", gloss: "Forgiving Merciful (editorial gloss)", keys: ["5:39"] });
    }
  }
}
{
  const t1 = findWordContaining(38, ["\u0639","\u0632","\u064a","\u0632"]); // AAazeezun
  const t2 = findWordContaining(38, ["\u062d","\u0643","\u064a","\u0645"]); // hakeemun
  if (t1 && t2) {
    const fullText = fv(38);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p5.divineNamesAndAttributes.push({ term: phrase, transliteration: "Azeezun Hakeem", gloss: "Exalted Mighty Wise (editorial gloss)", keys: ["5:38"] });
    }
  }
}
{
  const t = findWordContaining(40, ["\u0642","\u062f","\u064a","\u0631"]); // qadeerun
  if (t) p5.divineNamesAndAttributes.push({ term: t, transliteration: "Qadeer", gloss: "All-Capable (editorial gloss)", keys: ["5:40"] });
}

// P5 terminology
{
  const t = findWordContaining(38, ["\u0646","\u0643","\u0627","\u0644"]); // nakalan
  if (t) p5.terminology.push({ term: t, transliteration: "nakal", gloss: "exemplary deterrent punishment (editorial gloss)", keys: ["5:38"] });
}
{
  const t = findWordContaining(37, ["\u0645","\u0642","\u064a","\u0645"]); // muqeemun
  if (t) p5.terminology.push({ term: t, transliteration: "muqeem", gloss: "enduring/permanent (editorial gloss)", keys: ["5:37"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p5.json"), JSON.stringify(p5, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p5.json");

// ─── Passage 6: 5:41–50 ───────────────────────────────────────────────────────
const p6 = {
  extractionId: "ext-005-p6",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 41, toAyah: 50, label: "Al-Ma'idah — O Messenger do not grieve over those hastening disbelief; mouths claim belief hearts deny; Jews listeners to lies consumers of illicit gain; judge between them or turn away; if judge then with justice; Allah loves just; Torah contains Allah's judgment prophets rabbis judged by it; do not fear people fear Allah; do not sell signs for small price; whoever does not judge by Allah's revelation is disbeliever; retribution law life-eye-nose-ear-tooth-wounds; charity as expiation better; whoever does not judge by revelation is wrongdoer; Jesus confirming Torah given Gospel guidance light admonition; People of Gospel judge by revelation; whoever does not judge is defiantly disobedient; Book sent in truth confirming guardian; judge by revelation do not follow desires; each community has law and method; Allah tests through diversity; race to good deeds; return to Allah who informs about differences; beware lest tempt away from revelation; many are defiantly disobedient; judgment of ignorance rejected; Allah best in judgment for certain people" },
  verseKeys: ["5:41","5:42","5:43","5:44","5:45","5:46","5:47","5:48","5:49","5:50"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `5:${i+41}`, text: fv(i+41) })),
  mainSubject: {
    label: "Hypocrites and Jews hastening to disbelief consuming illicit gain; judging by divine revelation obligatory across Torah Gospel and Quran; three-fold condemnation: not judging by revelation equals disbelief wrongdoing defiance; retribution law with charity expiation option; Jesus confirming Torah bringing Gospel guidance; pluralism of laws as divine test; race to good deeds; rejection of pre-Islamic judgment standards",
    keys: ["5:41","5:42","5:43","5:44","5:45","5:46","5:47","5:48","5:49","5:50"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Verbal faith without heart conviction: hypocrites identified", keys: ["5:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jews as listeners to falsehood and consumers of illicit gain", keys: ["5:41","5:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Judicial discretion: judge or turn away; turning away causes no harm", keys: ["5:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Justice command: judge with equity; Allah loves the just", keys: ["5:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Torah as source of divine judgment; prophets and rabbis witnessed to it", keys: ["5:43","5:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear Allah not people; do not sell verses for small price", keys: ["5:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Not judging by revelation: disbelievers (5:44) wrongdoers (5:45) defiantly disobedient (5:47)", keys: ["5:44","5:45","5:47"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Retribution law: life eye nose ear tooth wounds; charity as expiation", keys: ["5:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jesus son Maryam confirming Torah; Gospel as guidance light admonition", keys: ["5:46"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Quran as confirming guardian over previous scripture", keys: ["5:48"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pluralism of laws: each community given shir'ah and minhaj as divine test", keys: ["5:48"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Race to good deeds; return to Allah who resolves differences", keys: ["5:48"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Warning against temptation away from revealed truth", keys: ["5:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rejection of jahiliyyah judgment; Allah's judgment supreme for certain people", keys: ["5:50"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Jesus son Maryam confirming Torah and receiving Gospel with guidance light", keys: ["5:46"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Heart-mouth disconnect: verbal profession without inner conviction", keys: ["5:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine purification withheld from those Allah intends fitnah for", keys: ["5:41"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Illicit consumption (suht) as systemic corruption among religious leaders", keys: ["5:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Legal pluralism as intentional divine design testing communities", keys: ["5:48"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0239","cand-0240","cand-0241"],
  notes: "Pass A Maidah passage 6/8. Central judicial-theological block. Three-tiered condemnation formula (kafirun dhalimun fasiqun) for not judging by revelation establishes gradation of culpability. Shir'ah-minhaj distinction (5:48) provides theological basis for legal diversity. Istibiqoo al-khayrat frames competition positively within pluralistic framework. Suht (illicit gain) critique targets religious establishment complicity.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p6.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:42"], excerpt: fv(42), description: "Command: if you judge between them then judge with justice; indeed Allah loves the just." });
p6.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:44"], excerpt: fv(44), description: "Prohibition: do not fear people but fear Me; do not exchange My verses for a small price." });
p6.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:48"], excerpt: fv(48), description: "Command: judge between them by what Allah revealed; do not follow their desires away from truth." });
p6.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:48"], excerpt: fv(48), description: "Command: race to good deeds; to Allah is your return together." });
p6.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:49"], excerpt: fv(49), description: "Prohibition: do not follow their desires; beware lest they tempt you from some of what Allah revealed." });

// P6 divine names
{
  const t = findWordContaining(42, ["\u0645","\u0642","\u0633","\u0637"]); // almuqsiteena
  if (t) p6.divineNamesAndAttributes.push({ term: t, transliteration: "al-Muqsiteen", gloss: "the just/equitable ones whom Allah loves (editorial gloss)", keys: ["5:42"] });
}

// P6 terminology
{
  const t = findWordContaining(42, ["\u0633","\u062d","\u062a"]); // lilssuhti
  if (t) p6.terminology.push({ term: t, transliteration: "suht", gloss: "illicit/unlawful gain (editorial gloss)", keys: ["5:42"] });
}
{
  const t = findWordContaining(45, ["\u0642","\u0635","\u0627","\u0635"]); // qisasun
  if (t) p6.terminology.push({ term: t, transliteration: "qisas", gloss: "legal retribution (editorial gloss)", keys: ["5:45"] });
}
{
  const t = findWordContaining(45, ["\u0643","\u0641","\u0627","\u0631"]); // kaffaratun
  if (t) p6.terminology.push({ term: t, transliteration: "kaffarah", gloss: "expiation/atonement (editorial gloss)", keys: ["5:45"] });
}
{
  const t = findWordContaining(48, ["\u0634","\u0631","\u0639"]); // shirAAatan
  if (t) p6.terminology.push({ term: t, transliteration: "shir'ah", gloss: "divine law/code (editorial gloss)", keys: ["5:48"] });
}
{
  const t = findWordContaining(48, ["\u0645","\u0646","\u0647","\u062c"]); // minhajan
  if (t) p6.terminology.push({ term: t, transliteration: "minhaj", gloss: "clear way/method (editorial gloss)", keys: ["5:48"] });
}
{
  const t = findWordContaining(48, ["\u0645","\u0647","\u064a","\u0645"]); // muhayminan
  if (t) p6.terminology.push({ term: t, transliteration: "muhaymin", gloss: "guardian/criterion over previous scripture (editorial gloss)", keys: ["5:48"] });
}
{
  const t = findWordContaining(50, ["\u062c","\u0627","\u0647","\u0644"]); // aljahiliyyati
  if (t) p6.terminology.push({ term: t, transliteration: "jahiliyyah", gloss: "pre-Islamic ignorance era/judgment (editorial gloss)", keys: ["5:50"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p6.json"), JSON.stringify(p6, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p6.json");

// ─── Passage 7: 5:51–60 ──────────────────────────────────────────────────────
const p7 = {
  extractionId: "ext-005-p7",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 51, toAyah: 60, label: "Al-Ma'idah — Do not take Jews Christians as allies; they are allies of each other; whoever allies with them is of them; Allah guides not wrongdoers; diseased hearts hasten fearing disaster; perhaps Allah brings victory then regretful; believers say these swore strongest oaths yet were with you? deeds wasted losers; whoever turns back from religion Allah brings people He loves who love Him humble to believers firm against disbelievers striving not fearing blame; favor of Allah; Allah Encompassing Knowing; your ally only Allah Messenger believers who establish prayer give zakah while bowing; party of Allah victorious; do not take mockers of religion as allies; fear Allah; prayer call taken as mockery because they do not reason; say O People of Scripture resent us only for believing Allah and revelation? most of you defiantly disobedient; worse recompense: cursed angered made apes swine worshipped taghut; worse position more astray" },
  verseKeys: ["5:51","5:52","5:53","5:54","5:55","5:56","5:57","5:58","5:59","5:60"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `5:${i+51}`, text: fv(i+51) })),
  mainSubject: {
    label: "Prohibition of Jewish-Christian alliances; diseased-heart hypocrisy exposed; apostasy replacement by beloved people; true walayah belongs to Allah Messenger and praying-zakah-giving believers; Hizbullah victorious; mockery of religion disqualifies alliance; People of Scripture resentment baseless; worse divine recompense: transformation curse for taghut worshippers",
    keys: ["5:51","5:52","5:53","5:54","5:55","5:56","5:57","5:58","5:59","5:60"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Walayah prohibition: Jews and Christians as mutual allies only", keys: ["5:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Identity assimilation: allying with them makes one of them", keys: ["5:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Diseased hearts: fear-driven alliance-seeking exposed as opportunism", keys: ["5:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False oath exposure: strongest oaths proven empty by betrayal", keys: ["5:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Apostasy consequence: Allah replaces with people He loves and who love Him", keys: ["5:54"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Replacement people characteristics: humble to believers firm against disbelievers striving fearless", keys: ["5:54"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True walayah defined: Allah His Messenger and believers establishing prayer giving zakah", keys: ["5:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hizbullah: party of Allah are the predominant", keys: ["5:56"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mockery of religion disqualifies from alliance", keys: ["5:57"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prayer call mocked due to lack of reason", keys: ["5:58"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People of Scripture resentment based solely on Muslim belief in Allah and revelation", keys: ["5:59"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worse recompense: cursed angered transformed into apes swine worshippers of taghut", keys: ["5:60"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Disease in hearts driving opportunistic political alignment", keys: ["5:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Regret upon divine reversal of fortunes", keys: ["5:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Love relationship between Allah and righteous community", keys: ["5:54"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Political alliance boundaries defining communal identity", keys: ["5:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Religious mockery as civilizational incompatibility indicator", keys: ["5:57","5:58"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0242","cand-0243"],
  notes: "Pass A Maidah passage 7/8. Walayah theology central: defines loyalty hierarchy (Allah > Messenger > believers > others). Apostasy-replacement principle (5:54) affirms divine commitment to preserving faithful community regardless of individual defection. Hizbullah concept establishes collective identity grounded in divine allegiance. Taghut worship linked to dehumanization (apes/swine) showing idolatry's ontological degradation.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p7.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:51"], excerpt: fv(51), description: "Prohibition: do not take Jews and Christians as allies; they are allies of one another." });
p7.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:57"], excerpt: fv(57), description: "Prohibition: do not take as allies those who took your religion as mockery and amusement." });
p7.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:57"], excerpt: fv(57), description: "Command: fear Allah if you are truly believers." });

// P7 divine names
{
  const t1 = findWordContaining(54, ["\u0648","\u0627","\u0633","\u0639"]); // wasiAAun
  const t2 = findWordContaining(54, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t1 && t2) {
    const fullText = fv(54);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p7.divineNamesAndAttributes.push({ term: phrase, transliteration: "Wasi'un Aleem", gloss: "All-Encompassing Knowing (editorial gloss)", keys: ["5:54"] });
    }
  }
}

// P7 terminology
{
  const t = findWordContaining(51, ["\u0623","\u0648","\u0644","\u064a"]); // awliyaa
  if (t) p7.terminology.push({ term: t, transliteration: "awliya", gloss: "allies/patrons/protectors (editorial gloss)", keys: ["5:51"] });
}
{
  const t = findWordContaining(52, ["\u0645","\u0631","\u0636"]); // maradun
  if (t) p7.terminology.push({ term: t, transliteration: "marad", gloss: "disease/sickness in hearts (editorial gloss)", keys: ["5:52"] });
}
{
  const t = findWordContaining(56, ["\u062d","\u0632","\u0628"]); // hizba
  if (t) p7.terminology.push({ term: t, transliteration: "hizb", gloss: "party/group/faction (editorial gloss)", keys: ["5:56"] });
}
{
  const t = findWordContaining(60, ["\u0637","\u0627","\u063a","\u0648"]); // alttaghooti
  if (t) p7.terminology.push({ term: t, transliteration: "taghut", gloss: "false deity/idol/tyrannical power (editorial gloss)", keys: ["5:60"] });
}
{
  const t = findWordContaining(57, ["\u0647","\u0632","\u0648"]); // huzuwan
  if (t) p7.terminology.push({ term: t, transliteration: "huzuw", gloss: "mockery/ridicule (editorial gloss)", keys: ["5:57"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p7.json"), JSON.stringify(p7, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p7.json");

// ─── Passage 8: 5:61–70 ──────────────────────────────────────────────────────
const p8 = {
  extractionId: "ext-005-p8",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 61, toAyah: 70, label: "Al-Ma'idah — Hypocrites enter with disbelief leave with it; Allah knows concealment; many hasten sin transgression consume illicit gain; wretched deeds; rabbis scholars fail to forbid sinful speech illicit consumption; wretched fabrication; Jews say Allah's hand chained; hands chained and cursed for saying so; both hands extended spends as wills; revelation increases many in transgression disbelief; enmity hatred cast until Resurrection; war fire extinguished by Allah; strive for corruption; Allah loves not corrupters; if People of Book believed feared Allah misdeeds removed gardens of pleasure; if upheld Torah Gospel revelation would eat from above beneath feet; moderate community exists; many evil in deeds; O Messenger convey what revealed; failure means not conveying message; Allah protects from people; Allah guides not disbelievers; say O People of Book stand on nothing until uphold Torah Gospel revelation; revelation increases many in transgression; do not grieve over disbelievers; believers Jews Sabeans Christians who believe Allah Last Day do righteous no fear nor grief; covenant of Israel messengers sent; whenever messenger brought undesired message party denied party killed" },
  verseKeys: ["5:61","5:62","5:63","5:64","5:65","5:66","5:67","5:68","5:69","5:70"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `5:${i+61}`, text: fv(i+61) })),
  mainSubject: {
    label: "Hypocritical faith entry-exit pattern; rabbis failing to forbid sin and illicit gain; Jewish claim of chained divine hand refuted; inter-communal enmity until Resurrection; conditional blessings for People of Book upon upholding revelation; Balligh command: convey fully or fail entirely; divine protection guaranteed; People of Book standing on nothing without upholding Torah Gospel; universal salvation criterion: belief in Allah Last Day plus righteous deeds; Israelite covenant history: denial and killing of messengers",
    keys: ["5:61","5:62","5:63","5:64","5:65","5:66","5:67","5:68","5:69","5:70"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Hypocrisy pattern: entering and leaving with disbelief despite verbal profession", keys: ["5:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Systemic moral failure: hastening sin transgression consuming suht", keys: ["5:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Religious leadership failure: rabbis not forbidding sinful speech and illicit gain", keys: ["5:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Chained-hand blasphemy refuted: both hands extended spending freely", keys: ["5:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Revelation paradoxically increasing transgression for many", keys: ["5:64","5:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Perpetual enmity among Jews until Resurrection; war-fire extinguished by Allah", keys: ["5:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Conditional blessing: belief and taqwa remove misdeeds grant gardens", keys: ["5:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Upholding Torah Gospel brings provision from above and below", keys: ["5:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Moderate community (ummatun muqtasidah) acknowledged among People of Book", keys: ["5:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Balligh command: convey entire revelation or have conveyed nothing", keys: ["5:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine protection of Messenger from people guaranteed", keys: ["5:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People of Book standing on nothing without upholding their own revelation", keys: ["5:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal salvation: believers Jews Sabeans Christians with faith in Allah Last Day and righteous deeds", keys: ["5:69"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Israelite covenant: messengers denied or killed when message displeased", keys: ["5:70"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Israelite pattern of denying and killing messengers bearing unwelcome truth", keys: ["5:70"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Concealed disbelief known to Allah despite outward profession", keys: ["5:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Moderation as recognized virtue within non-Muslim communities", keys: ["5:66"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Religious scholarly class failing moral enforcement duty", keys: ["5:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Material prosperity conditioned on scriptural observance", keys: ["5:66"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0244","cand-0245","cand-0246"],
  notes: "Pass A Maidah passage 8/8. Concludes major legislative-theological section. Balligh verse (5:67) among most emphatic prophetic commission statements in Quran. Ummatun muqtasidah (5:66) acknowledges intra-community moral variation preventing blanket condemnation. Universal salvation formula (5:69) extends beyond Muslim community to all monotheists meeting faith-righteousness criteria. Covenant-violence pattern (5:70) closes historical indictment cycle begun in earlier passages.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p8.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:67"], excerpt: fv(67), description: "Command: O Messenger convey what has been revealed to you from your Lord; if you do not you have not conveyed His message." });
p8.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:68"], excerpt: fv(68), description: "Prohibition: do not grieve over the disbelieving people." });

// P8 divine names
{
  const t = findWordContaining(64, ["\u0645","\u0641","\u0633","\u062f"]); // almufsideena
  if (t) p8.divineNamesAndAttributes.push({ term: t, transliteration: "al-Mufsideen", gloss: "the corrupters whom Allah does not love (editorial gloss)", keys: ["5:64"] });
}

// P8 terminology
{
  const t = findWordContaining(66, ["\u0645","\u0642","\u062a","\u0635"]); // muqtasidatun
  if (t) p8.terminology.push({ term: t, transliteration: "muqtasidah", gloss: "moderate/balanced community (editorial gloss)", keys: ["5:66"] });
}
{
  const t = findWordContaining(67, ["\u0628","\u0644","\u063a"]); // balligh
  if (t) p8.terminology.push({ term: t, transliteration: "balligh", gloss: "convey/proclaim fully (editorial gloss)", keys: ["5:67"] });
}
{
  const t = findWordContaining(67, ["\u0639","\u0635","\u0645"]); // yaAAsimuka
  if (t) p8.terminology.push({ term: t, transliteration: "ismah", gloss: "divine protection/infallibility (editorial gloss)", keys: ["5:67"] });
}
{
  const t = findWordContaining(70, ["\u0645","\u064a","\u062b","\u0627"]); // meethaqa
  if (t) p8.terminology.push({ term: t, transliteration: "meethaq", gloss: "solemn covenant (editorial gloss)", keys: ["5:70"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p8.json"), JSON.stringify(p8, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p8.json");

// ─── Candidates batch (cand-0237 through cand-0246) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-005-p5,ext-005-p6,ext-005-p7,ext-005-p8",
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

// cand-0237: Theft hadd with repentance framework
candidates.candidates.push(makeCand("cand-0237",
  "Theft penalty and repentance: hand amputation as divine deterrent paired with repentance acceptance for reforming offenders",
  undefined, "عقوبة السرقة والتوبة: قطع اليد ردعاً إلهياً مقترناً بقبول توبة المصلحين",
  "In 5:38-39: The thief male and female cut off their hands as recompense for what they earned as deterrent from Allah; Allah Exalted Wise. But whoever repents after wrongdoing and reforms indeed Allah turns to him; Allah Forgiving Merciful.",
  [{ key: "5:38", excerpt: fv(38), evidenceClass: "EXPLICIT_TEXT", rationale: "Waalsariqu waalssariqatu faiqtaAAoo aydiyahuma jazaan bima kasaba nakalan mina Allahi: gender-inclusive penalty specified. Nakalan mina Allahi frames punishment as divine exemplar not merely social utility. AAazeezun Hakeem pairs might with wisdom justifying severity." },
   { key: "5:39", excerpt: fv(39), evidenceClass: "EXPLICIT_TEXT", rationale: "Faman taba min baAAdi thulmihi waaslaha fainna Allaha yatoobu AAalayhi: repentance condition includes both cessation (taba) and positive reform (aslaha). Ghafoorun Raheem assures divine response." }],
  [{ topicId: "hudud-punishments", layer: "scholarly", relationship: "narrower", note: "Theft hadd as specific category within hudud framework" }],
  "Overlap with hudud-punishments. Gender symmetry (sariq/sariqah) ensures equal application. Nakal concept emphasizes deterrent function over retributive justice alone. Repentance clause prevents permanent stigmatization linking penal law to mercy theology. Positioned immediately after hirabah (5:33-34) creating graduated penal sequence."
));

// cand-0238: Divine sovereignty over punishment and forgiveness
candidates.candidates.push(makeCand("cand-0238",
  "Divine sovereignty over punishment and forgiveness: Allah exclusively determines whom to punish and forgive grounded in universal dominion and capability",
  undefined, "السيادة الإلهية في العقاب والمغفرة: الله وحده يقرر من يعاقب ومن يغفر استناداً إلى ملكه وقدرته الشاملة",
  "In 5:40: Do you not know that to Allah belongs dominion of heavens and earth? He punishes whom He wills and forgives whom He wills. And Allah is over all things Capable.",
  [{ key: "5:40", excerpt: fv(40), evidenceClass: "EXPLICIT_TEXT", rationale: "Alam taAAlam anna Allaha lahu mulku alssamawati waalardi: rhetorical question asserting known truth. YuAAaththibu man yashao wayaghfiru liman yashao: symmetric formulation placing punishment and forgiveness under identical divine prerogative. AAala kulli shayin qadeerun: comprehensive capability grounds both actions." }],
  [],
  "Gap candidate. Establishes theological foundation for all preceding penal legislation. Prevents both despair (forgiveness always possible) and presumption (punishment always possible). Dominion-capability pairing provides ontological basis for legislative authority. Rhetorical question format invites acknowledgment rather than argument."
));

// cand-0239: Judging by divine revelation as faith criterion
candidates.candidates.push(makeCand("cand-0239",
  "Judging by divine revelation: three-tiered condemnation equating failure to judge by Allah's revelation with disbelief wrongdoing and defiant disobedience",
  undefined, "الحكم بما أنزل الله: إدانة ثلاثية الدرجات تجعل عدم الحكم بوحي الله كفراً وظلماً وفسوقاً",
  "In 5:44-47: Whoever does not judge by what Allah revealed those are disbelievers (5:44). Whoever does not judge by what Allah revealed those are wrongdoers (5:45). Whoever does not judge by what Allah revealed those are defiantly disobedient (5:47). Applied respectively to Torah judges retribution law and Gospel judges.",
  [{ key: "5:44", excerpt: fv(44), evidenceClass: "EXPLICIT_TEXT", rationale: "Waman lam yahkum bima anzala Allahu faolaika humu alkafiroona: first tier addressing Torah context. La takhshawoo alnnasa waikhshawni: fear displacement as root cause." },
   { key: "5:45", excerpt: fv(45), evidenceClass: "EXPLICIT_TEXT", rationale: "Waman lam yahkum bima anzala Allahu faolaika humu alththalimoona: second tier in retribution context. Thulm implies rights violation beyond mere disbelief." },
   { key: "5:47", excerpt: fv(47), evidenceClass: "EXPLICIT_TEXT", rationale: "Waman lam yahkum bima anzala Allahu faolaika humu alfasiqoona: third tier addressing Gospel community. Fisq implies willful deviation from known truth." }],
  [{ topicId: "justice-oppression", layer: "scholarly", relationship: "same-concept", note: "Primary textual basis for divine legislation as justice foundation" }],
  "Overlap with divine-law. Triple repetition across three scriptural communities universalizes principle beyond Islam. Graduated labels suggest contextual nuance rather than identical condemnation. Each instance follows specific legislative content showing application not abstraction. Scholarly debate centers on whether labels indicate major kufr or lesser degrees."
));

// cand-0240: Legal pluralism as divine test
candidates.candidates.push(makeCand("cand-0240",
  "Legal pluralism as divine design: distinct shir'ah and minhaj for each community serving as test; competitive goodness replacing uniformity",
  undefined, "التعددية القانونية كتصميم إلهي: شريعة ومنهاج لكل أمة كابتلاء؛ التنافس في الخيرات بدل التوحيد",
  "In 5:48: To each of you We prescribed a law and method. Had Allah willed He would have made you one nation but to test you in what He gave you. So race to good deeds. To Allah is your return all together and He will inform you about what you differed.",
  [{ key: "5:48", excerpt: fv(48), evidenceClass: "EXPLICIT_TEXT", rationale: "Likullin jaAAalna minkum shirAAatan waminhajan: dual terminology suggests both legal code and broader way. Walaw shaa Allahu lajaAAalakum ommatan wahidatan: counterfactual affirms intentional diversity. Liyabluwakum fee ma atakum: test framing gives diversity purpose. Faistabiqoo alkhayrati: positive competition replaces conflict." }],
  [],
  "Gap candidate. Most explicit Quranic articulation of normative legal pluralism. Shir'ah-minhaj distinction allows both shared principles and varied implementations. Test framework transforms difference from problem to opportunity. Istibaq (racing) metaphor channels competitive energy toward constructive ends. Eschatological resolution defers final adjudication to Allah."
));

// cand-0241: Rejection of jahiliyyah judgment standards
candidates.candidates.push(makeCand("cand-0241",
  "Rejection of pre-Islamic judgment: jahiliyyah standards explicitly inferior to divine judgment for people of certainty",
  undefined, "رفض معايير الجاهلية: أحكام الجاهلية أدنى صراحة من حكم الله لأهل اليقين",
  "In 5:50: Is it the judgment of ignorance they desire? Who is better than Allah in judgment for a people who are certain?",
  [{ key: "5:50", excerpt: fv(50), evidenceClass: "EXPLICIT_TEXT", rationale: "Afahukma aljahiliyyati yabghoona: rhetorical question framing jahiliyyah judgment as absurd desire. Waman ahsanu mina Allahu hukman: comparative superlative excludes alternatives. Liqawmin yooqinoona: certainty as prerequisite for recognizing divine judgment superiority." }],
  [{ topicId: "tawheed-fundamentals", layer: "scholarly", relationship: "same-concept", note: "Jahiliyyah judgment rejection affirms divine legislative tawheed" }],
  "Overlap with jahiliyyah. Positions divine revelation as sole legitimate legal epistemology. Yooqinoona links legal recognition to spiritual certainty suggesting cognitive-affective integration. Rhetorical structure expects negative answer making affirmation self-evident. Contrasts with preceding pluralism (5:48) showing tolerance of inter-scriptural diversity but not extra-scriptural standards."
));

// cand-0242: Walayah theology and communal loyalty boundaries
candidates.candidates.push(makeCand("cand-0242",
  "Walayah theology: exclusive loyalty to Allah Messenger and believing community; alliance with opponents constitutes identity transfer",
  undefined, "لاهوت الولاء: الولاء الحصري لله والرسول والمؤمنين؛ التحالف مع الخصوم يعني انتقال الهوية",
  "In 5:51-56: O believers do not take Jews and Christians as allies; they are allies of one another; whoever takes them as ally is of them. Your ally is only Allah His Messenger and those who believe who establish prayer give zakah while bowing. Whoever takes Allah Messenger and believers as allies — party of Allah are victorious.",
  [{ key: "5:51", excerpt: fv(51), evidenceClass: "EXPLICIT_TEXT", rationale: "La tattakhithoo alyahooda waalnnasara awliyaa: explicit prohibition naming specific groups. BaAAduhum awliyao baAAdin: mutual solidarity of excluded groups noted. Fainnahu minhum: identity absorption warning." },
   { key: "5:55", excerpt: fv(55), evidenceClass: "EXPLICIT_TEXT", rationale: "Innama waliyyukumu Allahu warasooluhu waallatheena amanoo: exclusive positive definition. Allatheena yuqeemoona alssalata wayutoona alzzakata wahum rakiAAoona: behavioral markers of true allies." },
   { key: "5:56", excerpt: fv(56), evidenceClass: "EXPLICIT_TEXT", rationale: "Fainna hizba Allahi humu alghaliboona: victory promise tied to correct walayah." }],
  [{ topicId: "brotherhood-islam", layer: "scholarly", relationship: "same-concept", note: "Walayah theology defines communal loyalty boundaries" }],
  "Overlap with walayah. Identity-transfer mechanism (minhum) shows alliance as constitutive not merely strategic. Prayer-zakah-bowing triad defines believer-allies through observable practice. Hizbullah concept collectivizes individual loyalty into victorious community. Prohibition scope debated: political-military alliance versus all friendly relations."
));

// cand-0243: Apostasy replacement principle
candidates.candidates.push(makeCand("cand-0243",
  "Apostasy replacement: divine guarantee to replace defectors with people characterized by mutual love humility toward believers and firmness against disbelievers",
  undefined, "استبدال المرتدين: ضمان إلهي بإبدال المنشقين بقوم يتبادلون المحبة مع المؤمنين ويتواضعون لهم ويعزون على الكافرين",
  "In 5:54: O believers whoever turns back from his religion Allah will bring a people He loves and who love Him humble toward believers firm against disbelievers striving in Allah's way not fearing blame of a critic. That is Allah's favor He gives to whom He wills; Allah All-Encompassing Knowing.",
  [{ key: "5:54", excerpt: fv(54), evidenceClass: "EXPLICIT_TEXT", rationale: "Man yartadda minkum AAan deenihi: apostasy acknowledged as possibility. Fasawfa yatee Allahu biqawmin: divine initiative in replacement. Yuhibbuhum wayuhibboonahu: reciprocal love as defining characteristic. Athillatin AAala almumineena aAAizzatin AAala alkafireena: contrasting postures toward in-group and out-group. Yujahidoona fee sabeeli Allahi wala yakhafoona lawmata laimin: activism and courage as marks." }],
  [],
  "Gap candidate. Affirms divine preservation of faithful community independent of individual fidelity. Mutual love (yuhibbuhum wayuhibboonahu) unprecedented in Quranic community descriptions. Dual posture (humble-firm) balances internal compassion with external resolve. Lawmah laim immunity suggests inevitable criticism of principled stands. Fadl attribution prevents merit-based claims to replacement status."
));

// cand-0244: Balligh command and prophetic protection
candidates.candidates.push(makeCand("cand-0244",
  "Balligh imperative: absolute obligation to convey entire revelation with failure equating to non-conveyance; divine protection guaranteed against human opposition",
  undefined, "أمر التبليغ: وجوب مطلق لإبلاغ الوحي كاملاً وعدم الفعل يعني عدم التبليغ؛ الحماية الإلهية مضمونة",
  "In 5:67: O Messenger convey what has been revealed to you from your Lord. If you do not then you have not conveyed His message. And Allah will protect you from the people. Indeed Allah does not guide the disbelieving people.",
  [{ key: "5:67", excerpt: fv(67), evidenceClass: "EXPLICIT_TEXT", rationale: "Balligh ma onzila ilayka min rabbika: imperative with comprehensive object (ma). Wain lam tafAAal fama ballaghta risalatahu: conditional negation makes partial conveyance equivalent to total failure. WaAllahu yaAAsimuka mina alnnasi: protection promise enabling fearless proclamation. La yahdee alqawma alkafireena: divine guidance limitation explains resistance." }],
  [{ topicId: "muhammad-story", layer: "scholarly", relationship: "same-concept", note: "Most emphatic single-verse statement of prophetic conveyance obligation" }],
  "Overlap with prophetic-mission. Equivalence formula (lam taf'al = ma ballaghta) eliminates selective preaching option. Ismah guarantee addresses personal safety concerns that might inhibit full disclosure. Historical context suggests specific occasion but wording universalizes principle. Disbeliever-guidance limitation manages prophetic expectations regarding reception."
));

// cand-0245: Universal salvation criterion across communities
candidates.candidates.push(makeCand("cand-0245",
  "Universal salvation criterion: believers Jews Sabeans and Christians who believe in Allah and Last Day and do righteous deeds assured freedom from fear and grief",
  undefined, "معيار الخلاص الشامل: المؤمنون واليهود والصابئون والنصارى الذين آمنوا بالله واليوم الآخر وعملوا صالحاً لا خوف عليهم ولا يحزنون",
  "In 5:69: Indeed those who believed and those who were Jews and Sabeans and Christians — whoever believed in Allah and the Last Day and did righteousness — no fear upon them nor do they grieve.",
  [{ key: "5:69", excerpt: fv(69), evidenceClass: "EXPLICIT_TEXT", rationale: "Inna allatheena amanoo waallatheena hadoo waalssabioona waalnnasara: four communities enumerated inclusively. Man amana biAllahi waalyawmi alakhiri waAAamila salihan: three conditions (Allah-belief Last-Day-belief righteous-action) transcend communal labels. Fala khawfun AAalayhim wala hum yahzanoona: dual assurance mirroring 2:62 formula." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "same-concept", note: "Universal salvation criterion extends covenant framework beyond single community" }],
  "Overlap with salvation-pluralism. Sabians included alongside Abrahamic communities expanding scope. Triple criterion (faith-eschatology-action) prevents nominal affiliation sufficiency. Identical reassurance formula across multiple Quranic instances suggests stable doctrine. Tension with exclusivist readings resolved variously by scholars through abrogation contextualization or qualification theories."
));

// cand-0246: Religious leadership accountability failure
candidates.candidates.push(makeCand("cand-0246",
  "Religious leadership accountability: rabbis and scholars condemned for failing to forbid sinful speech and illicit consumption among their communities",
  undefined, "مسؤولية القيادة الدينية: إدانة الربانيين والأحبار لعدم نهيهم عن قول الإثم وأكل السحت",
  "In 5:63: Why do the rabbis and religious scholars not forbid them from saying what is sinful and devouring what is unlawful? How wretched is what they have been practicing.",
  [{ key: "5:63", excerpt: fv(63), evidenceClass: "EXPLICIT_TEXT", rationale: "Lawla yanhahumu alrrabbaniyyoona waalahbaru AAan qawlihimu alithma waaklihimu alssuhta: rhetorical question indicting scholarly silence. Labisa ma kanoo yasnaAAoona: double condemnation of both action and fabrication." }],
  [{ topicId: "self-accountability", layer: "scholarly", relationship: "same-concept", note: "Religious leadership accountability as moral enforcement duty" }],
  "Overlap with religious-authority. Establishes that religious knowledge carries active moral enforcement obligation not merely personal piety. Silence equated with complicity through rhetorical indictment. Suht consumption linked to verbal sin showing comprehensive corruption. Fabraication (yasnaAAoona) suggests active production of false norms not merely passive tolerance."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-024.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-024.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-005-p5 through ext-005-p8)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0237 through cand-${String(236 + candidates.candidates.length).padStart(4,'0')})`);