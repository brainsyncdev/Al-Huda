// MFD-11 Maidah Pass 3 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Ma'idah 5:71-96 (Passages 9-11, Candidates cand-0247..cand-0256).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "005-0071-0096.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 5:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Maidah Pass 3 files from verbatim corpus (5:71-96)...");
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

// ─── Passage 9: 5:71–77 ────────────────────────────────────────────────────────
const p9 = {
  extractionId: "ext-005-p9",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 71, toAyah: 77, label: "Al-Ma'idah — Thought no fitnah would strike so became blind deaf; Allah accepted repentance then many became blind deaf again; Allah sees what they do; disbelieved who say Allah is Messiah son Maryam; Messiah said worship Allah my Lord your Lord; shirk forbids Paradise Fire refuge; no helpers for wrongdoers; disbelieved who say Allah third of three; no god except One; if do not desist painful punishment; will they not repent seek forgiveness; Allah Forgiving Merciful; Messiah only messenger before whom messengers passed; mother truthful; both ate food; see how signs clarified yet deluded; worship besides Allah what owns no harm benefit; Allah Hearing Knowing; O People of Scripture do not exceed religion beyond truth; do not follow desires of people who went astray before misled many strayed from sound way" },
  verseKeys: ["5:71","5:72","5:73","5:74","5:75","5:76","5:77"],
  arabicExcerpts: Array.from({length:7}, (_,i) => ({ key: `5:${i+71}`, text: fv(i+71) })),
  mainSubject: {
    label: "Spiritual blindness cycle: assuming immunity from trial then losing perception; refutation of Messiah-divinity and Trinity doctrines; Messiah's own testimony commanding worship of Allah alone; shirk as absolute barrier to Paradise; repentance invitation with divine mercy assurance; Messiah and mother as human beings eating food; prohibition of religious excess and following misguided predecessors",
    keys: ["5:71","5:72","5:73","5:74","5:75","5:76","5:77"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Fitnah immunity assumption leading to spiritual blindness and deafness", keys: ["5:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance acceptance followed by renewed blindness for many", keys: ["5:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine omniscience over human actions", keys: ["5:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messiah-divinity claim as definitive disbelief", keys: ["5:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messiah's own command: worship Allah my Lord and your Lord", keys: ["5:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shirk consequence: Paradise forbidden Fire as refuge", keys: ["5:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trinity doctrine rejected: no god except One God", keys: ["5:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Painful punishment warning for those not desisting from Trinity speech", keys: ["5:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance and forgiveness invitation paired with Ghafoor Raheem", keys: ["5:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messiah as messenger only; messengers passed before him", keys: ["5:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Maryam as siddiqah (truthful supporter)", keys: ["5:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Human nature proof: both Messiah and mother ate food", keys: ["5:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Signs clarified yet people remain deluded", keys: ["5:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worship of powerless entities contrasted with Allah Hearing Knowing", keys: ["5:76"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition of ghuluww (excess) in religion beyond truth", keys: ["5:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Warning against following desires of previously misguided communities", keys: ["5:77"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Messiah Isa son of Maryam commanding worship of Allah alone and denying divinity", keys: ["5:72","5:75"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Spiritual blindness-deafness cycle after assuming trial immunity", keys: ["5:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Delusion persisting despite clear sign clarification", keys: ["5:75"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0247","cand-0248","cand-0249"],
  notes: "Pass A Maidah passage 9/11. Core Christological correction block. Messiah's own speech quoted as primary evidence against divinization claims. Eating-food argument establishes shared creaturely ontology. Ghuluww prohibition (5:77) extends beyond Trinity to any religious excess. Repentance invitation (5:74) prevents doctrinal rejection from becoming permanent exclusion. Blindness-deafness cycle (5:71) illustrates progressive spiritual degradation when divine mercy is taken for granted.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p9.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:72"], excerpt: fv(72), description: "Declaration: whoever associates others with Allah — Allah has forbidden him Paradise and his refuge is the Fire." });
p9.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:74"], excerpt: fv(74), description: "Invitation: will they not repent to Allah and seek His forgiveness? And Allah is Forgiving Merciful." });
p9.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:77"], excerpt: fv(77), description: "Prohibition: O People of Scripture do not exceed limits in your religion beyond the truth and do not follow inclinations of people who went astray before." });

// P9 divine names
{
  const t1 = findWordContaining(74, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(74, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t1 && t2) {
    const fullText = fv(74);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p9.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafoorun Raheem", gloss: "Forgiving Merciful (editorial gloss)", keys: ["5:74"] });
    }
  }
}
{
  const t1 = findWordContaining(76, ["\u0633","\u0645","\u064a","\u0639"]); // alssameeAAu
  const t2 = findWordContaining(76, ["\u0639","\u0644","\u064a","\u0645"]); // alAAaleemu
  if (t1 && t2) {
    const fullText = fv(76);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p9.divineNamesAndAttributes.push({ term: phrase, transliteration: "al-Samee'u al-Aleem", gloss: "the Hearing the Knowing (editorial gloss)", keys: ["5:76"] });
    }
  }
}
{
  const t = findWordContaining(71, ["\u0628","\u0635","\u064a","\u0631"]); // baseerun
  if (t) p9.divineNamesAndAttributes.push({ term: t, transliteration: "Baseer", gloss: "All-Seeing (editorial gloss)", keys: ["5:71"] });
}

// P9 terminology
{
  const t = findWordContaining(71, ["\u0641","\u062a","\u0646"]); // fitnatun
  if (t) p9.terminology.push({ term: t, transliteration: "fitnah", gloss: "trial/punishment/test (editorial gloss)", keys: ["5:71"] });
}
{
  const t = findWordContaining(75, ["\u0635","\u062f","\u064a","\u0642"]); // siddeeqatun
  if (t) p9.terminology.push({ term: t, transliteration: "siddiqah", gloss: "truthful/righteous woman (editorial gloss)", keys: ["5:75"] });
}
{
  const t = findWordContaining(77, ["\u062a","\u063a","\u0644","\u0648"]); // taghloo
  if (t) p9.terminology.push({ term: t, transliteration: "ghuluww", gloss: "excess/extremism in religion (editorial gloss)", keys: ["5:77"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p9.json"), JSON.stringify(p9, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p9.json");

// ─── Passage 10: 5:78–86 ──────────────────────────────────────────────────────
const p10 = {
  extractionId: "ext-005-p10",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 78, toAyah: 86, label: "Al-Ma'idah — Cursed disbelievers among Children of Israel by tongue Dawud and Isa son Maryam; because disobeyed transgressed; did not forbid one another wrongdoing; wretched deeds; many allying with disbelievers; wretched what souls sent ahead; Allah angry abiding punishment; if believed Allah Prophet revelation would not take allies; many defiantly disobedient; nearest affection believers those saying we are Christians; among them priests monks not arrogant; when hear revelation eyes overflow tears recognizing truth; say our Lord we believe write us witnesses; why not believe Allah truth come hoping Lord admits us righteous; Allah rewarded gardens rivers flowing abiding; reward doers good; disbelievers denied signs companions Hellfire" },
  verseKeys: ["5:78","5:79","5:80","5:81","5:82","5:83","5:84","5:85","5:86"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `5:${i+78}`, text: fv(i+78) })),
  mainSubject: {
    label: "Israelite curse through Dawud and Isa tongues for disobedience transgression and failure to forbid wrongdoing; alliance with disbelievers causing divine anger eternal punishment; Christian proximity to believers due to priests monks humility; Christian recognition of truth through tearful response; supplication for witness status and righteous company; divine reward of gardens for confessing believers; disbelievers as Hellfire companions",
    keys: ["5:78","5:79","5:80","5:81","5:82","5:83","5:84","5:85","5:86"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Curse upon Israelite disbelievers pronounced by Dawud and Isa", keys: ["5:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disobedience and transgression as grounds for curse", keys: ["5:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Failure to forbid mutual wrongdoing as communal moral collapse", keys: ["5:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Alliance with disbelievers producing divine anger and eternal punishment", keys: ["5:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True faith preventing alliance with disbelievers; many are fasiqoon", keys: ["5:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Christians nearest in affection to believers due to priests monks and lack of arrogance", keys: ["5:82"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Christian tearful recognition of revealed truth", keys: ["5:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Christian confession of faith and request for witness registration", keys: ["5:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Christian aspiration for admission with righteous people", keys: ["5:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine reward of gardens with rivers for confessing believers", keys: ["5:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reward designated for muhsinin (doers of good)", keys: ["5:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers denying signs as companions of Hellfire", keys: ["5:86"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Dawud and Isa pronouncing curse upon disobedient Israelites", keys: ["5:78"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Tearful recognition of truth as sign of sincere faith", keys: ["5:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Humility and absence of arrogance enabling truth recognition", keys: ["5:82"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Failure to enjoin good forbid evil as societal moral breakdown", keys: ["5:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Interfaith affinity gradient: Christians closer than Jews and mushrikoon to believers", keys: ["5:82"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0250","cand-0251","cand-0252"],
  notes: "Pass A Maidah passage 10/11. Contrasts Israelite curse with Christian commendation within same passage. Failure-to-forbid-wrongdoing (5:79) parallels 5:63 rabbis critique extending communal accountability principle. Christian recognition scene (5:83-85) provides positive interfaith model: emotional truth-recognition verbal confession eschatological hope. Priests-monks-humility triad explains Christian proximity without endorsing doctrine. Binary closure (5:85-86) maintains ultimate salvation distinction based on belief-signs response.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p10.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["5:83"], excerpt: fv(83), description: "Supplication: Our Lord we have believed so register us among the witnesses." });

// P10 divine names
// None explicitly named as attributes in this passage beyond standard references

// P10 terminology
{
  const t = findWordContaining(82, ["\u0642","\u0633","\u064a","\u0633"]); // qisseeseena
  if (t) p10.terminology.push({ term: t, transliteration: "qissees", gloss: "priests/ministers (editorial gloss)", keys: ["5:82"] });
}
{
  const t = findWordContaining(82, ["\u0631","\u0647","\u0628","\u0627"]); // ruhbanan
  if (t) p10.terminology.push({ term: t, transliteration: "ruhban", gloss: "monks (editorial gloss)", keys: ["5:82"] });
}
{
  const t = findWordContaining(85, ["\u0645","\u062d","\u0633","\u0646"]); // almuhsineena
  if (t) p10.terminology.push({ term: t, transliteration: "muhsin", gloss: "doers of good/excellence (editorial gloss)", keys: ["5:85"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p10.json"), JSON.stringify(p10, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p10.json");

// ─── Passage 11: 5:87–96 ──────────────────────────────────────────────────────
const p11 = {
  extractionId: "ext-005-p11",
  workstream: "MFD-11",
  pass: "A",
  surah: 5,
  surahName: "Al-Ma'idah",
  passage: { fromAyah: 87, toAyah: 96, label: "Al-Ma'idah — Do not forbid good things Allah made lawful; do not transgress; Allah loves not transgressors; eat lawful good provision; fear Allah; oath expiation: unintentional not blamed intentional binding blamed; feed ten needy or clothe or free slave; cannot fast three days; guard oaths; Allah clarifies signs for gratitude; intoxicants gambling stone altars divining arrows defilement from shaytan work avoid succeed; shaytan causes animosity hatred hinders remembrance prayer; will you desist; obey Allah obey Messenger beware; Messenger duty clear notification; no blame on past consumption for believers who feared believed did good then feared believed then feared did good; Allah loves muhsinin; Allah tests with game hands spears reach to know who fears unseen; transgressor painful punishment; do not kill game in ihram; intentional killer compensate equivalent domestic animal judged two just men offering reaching Kaaba or feed needy or fast equivalent; taste consequence; Allah pardoned past; returns Allah takes retribution; Allah Exalted Owner Retribution; lawful sea game food for you travelers; forbidden land game in ihram; fear Allah to whom gathered" },
  verseKeys: ["5:87","5:88","5:89","5:90","5:91","5:92","5:93","5:94","5:95","5:96"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `5:${i+87}`, text: fv(i+87) })),
  mainSubject: {
    label: "Prohibition of self-imposed restrictions on lawful good things; oath legislation distinguishing unintentional from binding oaths with graded expiation; intoxicants gambling stone altars divining arrows declared satanic defilement requiring total avoidance; shaytan's strategy of animosity and hindering dhikr-salah; obedience to Allah and Messenger; past consumption pardoned for righteous believers; hunting test during ihram revealing unseen taqwa; game compensation rules with judicial oversight; sea game lawful land game forbidden during ihram",
    keys: ["5:87","5:88","5:89","5:90","5:91","5:92","5:93","5:94","5:95","5:96"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Prohibition of making lawful things unlawful through personal asceticism", keys: ["5:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Transgression boundary: Allah does not love transgressors", keys: ["5:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command to eat halal tayyib provision and maintain taqwa", keys: ["5:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Oath legislation: laghw (unintentional) exempt aqqadtum (binding) liable", keys: ["5:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Oath expiation hierarchy: feed ten needy or clothe or free slave or fast three days", keys: ["5:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guard oaths command; Allah clarifies signs for gratitude", keys: ["5:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khamr maysir ansab azlam declared rijs from shaytan's work", keys: ["5:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Avoidance command linked to falah (success)", keys: ["5:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaytan's dual objective: inter-communal animosity and hindering dhikr-salah", keys: ["5:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rhetorical challenge: will you not desist?", keys: ["5:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Triple obedience command: Allah Messenger and beware", keys: ["5:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger's limited duty: clear notification only", keys: ["5:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Past consumption pardoned for those maintaining taqwa-faith-righteousness cycle", keys: ["5:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah loves muhsinin reiterated", keys: ["5:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hunting test during ihram revealing unseen taqwa", keys: ["5:94"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Intentional game killing compensation: equivalent domestic animal judged by two just men", keys: ["5:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Alternative expiations: feeding needy or fasting equivalent", keys: ["5:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Past violations pardoned; repeat offenders face divine retribution", keys: ["5:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sea game lawful; land game forbidden during ihram", keys: ["5:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eschatological gathering reminder", keys: ["5:96"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Gratitude as intended outcome of legislative clarification", keys: ["5:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Unseen taqwa as true measure tested through accessible temptations", keys: ["5:94"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Judicial oversight in compensation: two just men adjudicate equivalence", keys: ["5:95"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Traveler provision consideration in sea-game legislation", keys: ["5:96"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0253","cand-0254","cand-0255","cand-0256"],
  notes: "Pass A Maidah passage 11/11. Final legislative block of Surah Al-Ma'idah. Prohibition-of-prohibition (5:87) prevents ascetic extremism balancing earlier halal permissions. Oath legislation (5:89) distinguishes intentionality establishing mens rea principle. Khamr-maysir-ansab-azlam cluster (5:90) groups intoxicants gambling idolatry divination as unified satanic system. Hunting regulations (5:94-96) frame ihram as sacred state requiring behavioral transformation. Past-consumption pardon (5:93) addresses pre-revelation practices preventing retroactive guilt. Sea-land game distinction (5:96) demonstrates nuanced legal reasoning accommodating traveler needs.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

p11.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:87"], excerpt: fv(87), description: "Prohibition: do not make unlawful the good things Allah has permitted and do not transgress." });
p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:88"], excerpt: fv(88), description: "Command: eat from what Allah provided as lawful and good and fear Allah." });
p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:89"], excerpt: fv(89), description: "Command: guard your oaths. Thus Allah makes clear His signs that you may be grateful." });
p11.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:90"], excerpt: fv(90), description: "Prohibition: intoxicants gambling stone altars divining arrows are defilement from shaytan's work so avoid it that you may succeed." });
p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["5:92"], excerpt: fv(92), description: "Command: obey Allah and obey the Messenger and beware." });
p11.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["5:95"], excerpt: fv(95), description: "Prohibition: do not kill game while you are in the state of ihram." });

// P11 divine names
{
  const t = findWordContaining(95, ["\u0639","\u0632","\u064a","\u0632"]); // AAazeezun
  if (t) {
    const t2 = findWordContaining(95, ["\u0627","\u0646","\u062a","\u0642"]); // thoo intiqamin
    if (t2) {
      const fullText = fv(95);
      const idx1 = fullText.indexOf(t);
      const idx2 = fullText.indexOf(t2);
      if (idx1 >= 0 && idx2 > idx1) {
        const phrase = fullText.slice(idx1, idx2 + t2.length);
        p11.divineNamesAndAttributes.push({ term: phrase, transliteration: "Azeezun Thoo Intiqam", gloss: "Exalted Mighty Owner of Retribution (editorial gloss)", keys: ["5:95"] });
      }
    }
  }
}
{
  const t = findWordContaining(93, ["\u0645","\u062d","\u0633","\u0646"]); // almuhsineena
  if (t) p11.divineNamesAndAttributes.push({ term: t, transliteration: "al-Muhsinin", gloss: "the doers of good whom Allah loves (editorial gloss)", keys: ["5:93"] });
}

// P11 terminology
{
  const t = findWordContaining(89, ["\u0644","\u063a","\u0648"]); // biallaghwi
  if (t) p11.terminology.push({ term: t, transliteration: "laghw", gloss: "unintentional/meaningless oath speech (editorial gloss)", keys: ["5:89"] });
}
{
  const t = findWordContaining(89, ["\u0643","\u0641","\u0627","\u0631"]); // fakaffaratuhu
  if (t) p11.terminology.push({ term: t, transliteration: "kaffarah", gloss: "expiation/atonement (editorial gloss)", keys: ["5:89"] });
}
{
  const t = findWordContaining(90, ["\u062e","\u0645","\u0631"]); // alkhamru
  if (t) p11.terminology.push({ term: t, transliteration: "khamr", gloss: "intoxicants/wine (editorial gloss)", keys: ["5:90"] });
}
{
  const t = findWordContaining(90, ["\u0645","\u064a","\u0633","\u0631"]); // almaysiru
  if (t) p11.terminology.push({ term: t, transliteration: "maysir", gloss: "gambling/games of chance (editorial gloss)", keys: ["5:90"] });
}
{
  const t = findWordContaining(90, ["\u0623","\u0646","\u0635","\u0627"]); // waalansabu
  if (t) p11.terminology.push({ term: t, transliteration: "ansab", gloss: "stone altars/idols (editorial gloss)", keys: ["5:90"] });
}
{
  const t = findWordContaining(90, ["\u0623","\u0632","\u0644","\u0627"]); // waalazlamu
  if (t) p11.terminology.push({ term: t, transliteration: "azlam", gloss: "divining arrows (editorial gloss)", keys: ["5:90"] });
}
{
  const t = findWordContaining(90, ["\u0631","\u062c","\u0633"]); // rijsun
  if (t) p11.terminology.push({ term: t, transliteration: "rijs", gloss: "defilement/impurity (editorial gloss)", keys: ["5:90"] });
}
{
  const t = findWordContaining(95, ["\u062d","\u0631","\u0645"]); // hurumun
  if (t) p11.terminology.push({ term: t, transliteration: "ihram", gloss: "sacred pilgrimage state (editorial gloss)", keys: ["5:95","5:96"] });
}
{
  const t = findWordContaining(95, ["\u0647","\u062f","\u064a"]); // hadyan
  if (t) p11.terminology.push({ term: t, transliteration: "hady", gloss: "sacrificial offering (editorial gloss)", keys: ["5:95"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "005-al-maidah-p11.json"), JSON.stringify(p11, null, 2) + "\n");
console.log("Wrote 005-al-maidah-p11.json");

// ─── Candidates batch (cand-0247 through cand-0256) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-005-p9,ext-005-p10,ext-005-p11",
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

// cand-0247: Spiritual blindness cycle
candidates.candidates.push(makeCand("cand-0247",
  "Spiritual blindness cycle: assuming immunity from divine trial leads to loss of perception; repentance accepted then blindness returns for many",
  undefined, "دورة العمى الروحي: افتراض المناعة من الفتنة يؤدي لفقدان الإدراك؛ التوبة مقبولة ثم يعود العمى للكثيرين",
  "In 5:71: They thought there would be no fitnah so they became blind and deaf. Then Allah turned to them in forgiveness; then many of them became blind and deaf again. And Allah is Seeing of what they do.",
  [{ key: "5:71", excerpt: fv(71), evidenceClass: "EXPLICIT_TEXT", rationale: "Wahasiboo alla takoona fitnatun faAAamoo wasammoo: assumption of trial immunity precedes sensory-spiritual loss. Thumma taba Allahu AAalayhim: divine mercy intervenes. Thumma AAamoo wasammoo katheerun minhum: relapse into blindness affects majority. WaAllahu baseerun bima yaAAmaloona: divine observation persists regardless of human perception state." }],
  [],
  "Gap candidate. Establishes cyclical pattern of spiritual degradation distinct from linear apostasy narratives. Fitnah-immunity assumption identified as root cognitive error. Divine repentance acceptance shows mercy not contingent on permanence of reform. Majority-relapse statistic (katheerun minhum) warns against complacency after forgiveness. Baseer attribute frames divine awareness as constant counterpoint to intermittent human perception."
));

// cand-0248: Messiah's self-testimony against divinity
candidates.candidates.push(makeCand("cand-0248",
  "Messiah's self-testimony: Isa ibn Maryam explicitly commands worship of Allah alone and denies divinity through shared human nature with his mother",
  undefined, "شهادة المسيح على نفسه: عيسى ابن مريم يأمر صراحة بعبادة الله وحده وينفي الألوهية من خلال طبيعته البشرية المشتركة مع أمه",
  "In 5:72: The Messiah said O Children of Israel worship Allah my Lord and your Lord. In 5:75: The Messiah son of Mary was not but a messenger; messengers passed before him. His mother was a siddiqah. They both used to eat food.",
  [{ key: "5:72", excerpt: fv(72), evidenceClass: "EXPLICIT_TEXT", rationale: "Waqala almaseehu ya banee israeela oAAbudoo Allaha rabbee warabbakum: Messiah's own quoted speech directing worship exclusively to Allah. Rabbee warabbakum establishes shared Creator eliminating ontological distinction." },
   { key: "5:75", excerpt: fv(75), evidenceClass: "EXPLICIT_TEXT", rationale: "Ma almaseehu ibnu maryama illa rasoolun: explicit limitation to messenger status. Qad khalat min qablihi alrrusulu: placement within prophetic succession. Waommuhu siddeeqatun: mother's righteousness noted without elevation. Kana yakulani alttaAAama: shared food-consumption as creaturely proof." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept", note: "Primary Quranic evidence of Isa's self-understanding as servant-messenger" }],
  "Overlap with isa-story. Messiah's own speech as primary evidence prevents attribution of later theological development. Eating-food argument operates at ontological level: divine beings do not consume. Siddiqah designation honors Maryam without implying supernatural status. Dual-address (rabbee warabbakum) collapses any hierarchical distinction between Messiah and community."
));

// cand-0249: Ghuluww prohibition
candidates.candidates.push(makeCand("cand-0249",
  "Religious excess prohibition: ghuluww (exceeding bounds) in religion forbidden; following desires of previously misguided communities warned against",
  undefined, "تحريم الغلو في الدين: تجاوز الحدود في الدين محظور؛ التحذير من اتباع أهواء أقوام ضلوا من قبل",
  "In 5:77: Say O People of the Scripture do not exceed limits in your religion beyond the truth and do not follow the inclinations of a people who had gone astray before and misled many and have strayed from the soundness of the way.",
  [{ key: "5:77", excerpt: fv(77), evidenceClass: "EXPLICIT_TEXT", rationale: "La taghloo fee deenikum ghayra alhaqqi: ghuluww defined as exceeding truth-boundaries not merely excessive practice. Wala tattabiAAoo ahwaa qawmin qad dalloo min qablu: historical precedent as warning mechanism. Waadalloo katheeran: misleadership quantified showing scale of damage. Wadalloo AAan sawai alssabeeli: deviation from sound path as endpoint of excess." }],
  [],
  "Gap candidate. Ghuluww concept applicable beyond Trinity to any religious innovation exceeding textual bounds. Ahwaa (inclinations/desires) identifies psychological driver of excess. Historical-cautionary structure links present behavior to past community failures. Sawaa al-sabeel (sound path) implies balanced middle exists between deficiency and excess. Addressed to People of Scripture but principle universalizes through structural parallel with Muslim community warnings elsewhere."
));

// cand-0250: Communal moral enforcement failure
candidates.candidates.push(makeCand("cand-0250",
  "Communal moral enforcement failure: not forbidding mutual wrongdoing cited as ground for divine curse alongside disobedience and transgression",
  undefined, "فشل الإنكار المتبادل: عدم النهي عن المنكر سبب للعن الإلهي إلى جانب المعصية والاعتداء",
  "In 5:78-79: Cursed were those who disbelieved among Children of Israel by tongue of Dawud and Isa son of Maryam because they disobeyed and transgressed. They used not to prevent one another from wrongdoing they did. How wretched what they were doing.",
  [{ key: "5:78", excerpt: fv(78), evidenceClass: "EXPLICIT_TEXT", rationale: "LuAAina allatheena kafaroo min banee israeela AAala lisani dawooda waAAeesa ibni maryama: curse pronounced through prophetic tongues giving it scriptural authority. Thalika bima AAasaw wakanoo yaAAtadoona: dual grounds (disobedience + habitual transgression)." },
   { key: "5:79", excerpt: fv(79), evidenceClass: "EXPLICIT_TEXT", rationale: "Kanoo la yatanahawna AAan munkarin faAAaloohu: negative formulation emphasizes active omission. Labisa ma kanoo yafAAaloona: comprehensive condemnation of collective behavior." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "related-not-identical", note: "Moral enforcement failure as covenant-breach mechanism" }],
  "Overlap with covenants-ahd. Yatanahawna (mutual prevention) implies reciprocal communal obligation not top-down enforcement. Curse-through-prophets structure shows internal scriptural witness against community. Habitual aspect (kanoo) indicates systemic rather than incidental failure. Positioned immediately after Christological section suggesting doctrinal error and moral collapse are interconnected phenomena."
));

// cand-0251: Christian proximity to believers
candidates.candidates.push(makeCand("cand-0251",
  "Christian affection proximity: Christians identified as nearest in mawaddah to believers due to presence of priests monks and absence of arrogance",
  undefined, "قرب المودة النصرانية: النصارى أقرب مودة للمؤمنين بسبب وجود القسيسين والرهبان وعدم الاستكبار",
  "In 5:82: You will find nearest of them in affection to the believers those who say we are Christians. That is because among them are priests and monks and they are not arrogant.",
  [{ key: "5:82", excerpt: fv(82), evidenceClass: "EXPLICIT_TEXT", rationale: "Walatajidanna aqrabahum mawaddatan lillatheena amanoo allatheena qaloo inna nasara: comparative superlative (aqrabahum mawaddatan) establishes graduated affinity scale. Thalika bianna minhum qisseeseena waruhbanan: institutional-religious explanation. Waannahum la yastakbiroona: character-trait explanation (humility) completing causal chain." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "related-not-identical", note: "Differentiated assessment within People of Book covenant framework" }],
  "Overlap with people-of-book. Mawaddah (affection/love) stronger term than mere tolerance or peace. Priest-monk presence suggests institutional structures preserving certain virtues. Humility (la yastakbiroona) presented as decisive factor enabling truth-recognition. Does not endorse Christian doctrine but acknowledges positive moral-spiritual qualities. Graduated structure (Jews-mushrikoon vs Christians) prevents monolithic treatment of non-Muslim communities."
));

// cand-0252: Truth recognition through tears
candidates.candidates.push(makeCand("cand-0252",
  "Truth recognition through tears: believing Christians' eyes overflow with tears upon hearing revelation due to recognized truth; immediate faith confession and witness-status request",
  undefined, "التعرف على الحق بالدموع: عيون المؤمنين النصارى تفيض بالدمع عند سماع الوحي اعترافاً بالحق؛ إيمان فوري وطلب الشهادة",
  "In 5:83-84: When they hear what was revealed to the Messenger you see their eyes overflowing with tears from what they recognized of the truth. They say our Lord we have believed so register us among the witnesses. Why should we not believe in Allah and what came to us of truth hoping our Lord admits us with the righteous.",
  [{ key: "5:83", excerpt: fv(83), evidenceClass: "EXPLICIT_TEXT", rationale: "Waitha samiAAoo ma onzila ila alrrasooli tara aAAyunahum tafeedu mina alddamAAi: physical-emotional response preceding intellectual articulation. Mimma AAarafoo mina alhaqqi: recognition (not new learning) triggers response. Rabbana amanna faoktubna maAAa alshshahideena: immediate verbal confession with eschatological registration request." },
   { key: "5:84", excerpt: fv(84), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama lana la numinu biAllahi wama jaana mina alhaqqi: rhetorical question affirming belief inevitability. WanatmaAAu an yudkhilana rabbuna maAAa alqawmi alssaliheena: eschatological hope expressed as aspiration not entitlement." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "related-not-identical", note: "Christian response to Quranic revelation as continuation of Isa-tradition recognition" }],
  "Overlap with isa-story. Tearful recognition suggests pre-existing scriptural familiarity enabling truth-identification. Shahideen (witnesses) implies bearing testimony to truth across temporal boundaries. Rhetorical question format (5:84) presents belief as rational necessity given evidence. Hope-aspiration (natmaAAu) contrasts with presumption maintaining humble posture. Model of sincere interfaith engagement rooted in shared Abrahamic heritage."
));

// cand-0253: Oath legislation with intentionality distinction
candidates.candidates.push(makeCand("cand-0253",
  "Oath legislation: unintentional oaths (laghw) exempt from liability; binding intentional oaths require graded expiation; guard oaths command linked to gratitude",
  undefined, "تشريع الأيمان: الأيمان اللغو معفاة من المؤاخذة؛ الأيمان المعقدة المقصودة تتطلب كفارة متدرجة؛ أمر بحفظ الأيمان مرتبط بالشكر",
  "In 5:89: Allah will not impose blame for laghw in your oaths but will impose blame for what you bound of oaths. Its expiation is feeding ten needy from average family food or clothing them or freeing a slave. Whoever cannot find then fasting three days. That is expiation for oaths when sworn. Guard your oaths. Thus Allah clarifies signs that you may be grateful.",
  [{ key: "5:89", excerpt: fv(89), evidenceClass: "EXPLICIT_TEXT", rationale: "La yuakhithukumu Allahu biallaghwi fee aymanikum: laghw exemption establishes intentionality principle. Walakin yuakhithukum bima AAaqqadtumu alaymana: aqqadtum (bound/knotted) implies deliberate commitment. Fakaffaratuhu itAAamu AAasharati masakeena: primary expiation feeds community. Aw kiswatuhum aw tahreeru raqabatin: alternative options accommodate varying circumstances. Faman lam yajid fasiyamu thalathati ayyamin: fasting as accessible fallback. Waihfathoo aymanakum: proactive guard command. Kathalika yubayyinu Allahu lakum ayatihi laAAallakum tashkuroona: legislative clarity aimed at cultivating gratitude." }],
  [],
  "Gap candidate. Laghw-aqqadtum distinction introduces mens rea into oath jurisprudence. Graded expiation hierarchy (feed/clothe/free/fast) accommodates economic capacity differences. Average-family-food standard prevents performative minimalism. Three-day fasting as universal fallback ensures accessibility. Gratitude framing transforms legal compliance into spiritual cultivation. Comprehensive single-verse legislation demonstrating Quranic legal precision."
));

// cand-0254: Intoxicants gambling as satanic system
candidates.candidates.push(makeCand("cand-0254",
  "Satanic quartet: intoxicants gambling stone altars divining arrows declared unified rijs from shaytan's work; avoidance linked to success; shaytan's objectives exposed as animosity and hindering dhikr-salah",
  undefined, "الرباعية الشيطانية: الخمر والميسر والأنصاب والأزلام رجس من عمل الشيطان؛ الاجتناب مرتبط بالفلاح؛ أهداف الشيطان مكشوفة كإيقاع العداوة وصرف الذكر والصلاة",
  "In 5:90-91: O believers indeed intoxicants gambling stone altars divining arrows are defilement from shaytan's work so avoid it that you may succeed. Shaytan only wants to cause between you animosity and hatred through intoxicants and gambling and hinder you from remembrance of Allah and prayer. So will you not desist?",
  [{ key: "5:90", excerpt: fv(90), evidenceClass: "EXPLICIT_TEXT", rationale: "Innama alkhamru waalmaysiru waalansabu waalazlamu rijsun min AAamali alshshaytani: four items grouped under single predicate (rijs) with unified origin (shaytan's work). Faijtaniboohu: avoidance stronger than mere prohibition. LaAAallakum tuflihoona: success conditional on compliance." },
   { key: "5:91", excerpt: fv(91), evidenceClass: "EXPLICIT_TEXT", rationale: "Innama yureedu alshshaytanu an yooqiAAa baynakumu alAAadawata waalbaghdaa: dual social harm (animosity + hatred). Fee alkhamri waalmaysiri: intoxicants-gambling as specific instruments. Wayasuddakum AAan thikri Allahi waAAani alssalati: dual spiritual harm (dhikr + salah obstruction). Fahal antum muntahoona: rhetorical challenge demanding response." }],
  [],
  "Gap candidate. Four-item grouping reveals underlying unity: all involve altered states or chance replacing divine reliance. Rijs (defilement) frames issue as purity-pollution not merely harm-benefit. Ijtinab (avoidance) implies complete distance not moderated use. Falah (success) links abstinence to positive flourishing not mere sin-avoidance. Shaytan's strategy analysis exposes mechanisms enabling informed resistance. Rhetorical question (hal antum muntahoona) demands active decision not passive reception."
));

// cand-0255: Hunting test and ihram regulations
candidates.candidates.push(makeCand("cand-0255",
  "Ihram hunting test: Allah tests believers with accessible game during sacred state to distinguish unseen taqwa; intentional violation requires judicial compensation; past violations pardoned repeat offenses punished",
  undefined, "ابتلاء الصيد في الإحرام: الله يختبر المؤمنين بصيد متاح في الحالة المقدسة لتمييز التقوى بالغيب؛ الانتهاك العمد يتطلب تعويضاً قضائياً؛ ما سلف عفي عنه والعائد يعاقب",
  "In 5:94-95: O believers Allah will test you with something of game your hands and spears reach that Allah may know who fears Him unseen. Whoever transgresses after that has painful punishment. Do not kill game while in ihram. Whoever kills intentionally compensation is equivalent domestic animal judged by two just men among you as offering reaching Kaaba or expiation feeding needy or fasting equivalent to taste consequence. Allah pardoned what is past; whoever returns Allah takes retribution. Allah Exalted Owner of Retribution.",
  [{ key: "5:94", excerpt: fv(94), evidenceClass: "EXPLICIT_TEXT", rationale: "Layabluwannakumu Allahu bishayin mina alssaydi tanaluhu aydeekum warimahukum: test involves physically accessible temptation. LiyaAAlama Allahu man yakhafuhu bialghaybi: purpose is revealing unseen taqwa. Famani iAAtada baAAda thalika falahu AAathabun aleemun: post-legislation transgression carries enhanced penalty." },
   { key: "5:95", excerpt: fv(95), evidenceClass: "EXPLICIT_TEXT", rationale: "La taqtuloo alssayda waantum hurumun: explicit prohibition tied to sacred state. Waman qatalahu minkum mutaAAammidan: intentionality requirement (mutaAAammidan). Fajazaon mithlu ma qatala mina alnnaAAami: equivalence principle. Yahkumu bihi thawa AAadlin minkum: judicial oversight by two just persons. Hadyan baligha alkaAAbati: offering must reach Kaaba ensuring ritual completion. Aw kaffaratun taAAamu masakeena aw AAadlu thalika siyaman: alternative expiations maintaining proportionality. Liyathooqa wabala amrihi: consequence-experiencing as pedagogical purpose. AAafa Allahu AAamma salafa: past pardon. Waman AAada fayantaqimu Allahu minhu: escalation for recidivism. WaAllahu AAazeezun thoo intiqamin: divine retribution capacity affirmed." }],
  [{ topicId: "trial-and-test", layer: "scholarly", relationship: "same-concept", note: "Hunting test as explicit divine trial revealing unseen taqwa" }],
  "Overlap with hajj-umrah-pilgrimage. Test-framing transforms prohibition from arbitrary restriction to spiritual diagnostic. Bialghaybi (unseen) specifies that true taqwa operates beyond surveillance. Judicial oversight (thawa AAadlin) prevents subjective self-assessment. Equivalence principle (mithlu) maintains proportional justice. Triple expiation options accommodate varying capacities. Past-pardon prevents despair; return-warning prevents presumption. Azeezun Thoo Intiqam pairing balances power with justice."
));

// cand-0256: Past consumption pardon for righteous believers
candidates.candidates.push(makeCand("cand-0256",
  "Past consumption pardon: believers who consumed prohibited items before legislation not blamed if they now maintain taqwa faith and righteous deeds in progressive cycles",
  undefined, "العفو عن الطعم السابق: المؤمنون الذين تناولوا المحرمات قبل التشريع لا يؤاخَذون إذا حافظوا على التقوى والإيمان والعمل الصالح في دورات تصاعدية",
  "In 5:93: There is no blame on those who believed and did righteous deeds concerning what they tasted if they feared Allah and believed and did righteous deeds then feared Allah and believed then feared Allah and did good. And Allah loves the doers of good.",
  [{ key: "5:93", excerpt: fv(93), evidenceClass: "EXPLICIT_TEXT", rationale: "Laysa AAala allatheena amanoo waAAamiloo alssalihati junahun feema taAAimoo: blanket exoneration for past consumption. Itha ma ittaqaw waamanoo waAAamiloo alssalihati: first condition set (taqwa + faith + action). Thumma ittaqaw waamanoo: second repetition emphasizing persistence. Thumma ittaqaw waahsanoo: third iteration culminating in ihsan (excellence). WaAllahu yuhibbu almuhsineena: divine love as ultimate reward for sustained excellence." }],
  [],
  "Gap candidate. Addresses transitional community members who consumed khamr etc. before prohibition. Triple-condition structure suggests progressive spiritual maturation not static compliance. Taqwa-iman-amal triad repeated with variation (final iteration substitutes ihsan for amal) indicating qualitative growth. Junah (blame/sin) negation provides psychological relief preventing retroactive guilt. Muhsinin designation elevates sustained practitioners beyond mere compliance. Positioned after intoxicant prohibition providing immediate pastoral application."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-025.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-025.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 3 (ext-005-p9 through ext-005-p11)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0247 through cand-${String(246 + candidates.candidates.length).padStart(4,'0')})`);
