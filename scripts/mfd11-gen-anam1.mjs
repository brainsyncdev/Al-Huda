// MFD-11 An'am Pass 1 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-An'am 6:1-40 (Passages 1-4, Candidates cand-0267..cand-0276).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "006-0001-0040.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 6:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating An'am Pass 1 files from verbatim corpus (6:1-40)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T09:00:00.000Z";

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

// ─── Passage 1: 6:1–10 ────────────────────────────────────────────────────────
const p1 = {
  extractionId: "ext-006-p1",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 1,
    toAyah: 10,
    label: "Al-An'am — Praise to Allah who created heavens earth made darkness light; disbelievers equate others with Lord; He created you from clay decreed term appointed term yet you doubt; He is Allah in heavens earth knows secret public knows what you earn; no sign comes except they turn away; denied truth when came; news of ridicule will come; destroyed generations before established on earth sent rain made rivers destroyed for sins brought another generation; even if scripture on page touched hands disbelievers say magic; ask why angel not sent down if sent matter decided no reprieve; if made angel would make him man cover them with confusion; messengers ridiculed before enveloped by ridicule"
  },
  verseKeys: ["6:1","6:2","6:3","6:4","6:5","6:6","6:7","6:8","6:9","6:10"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+1}`, text: fv(i+1) })),
  mainSubject: {
    label: "Divine creation of heavens earth darkness light establishing Allah as sole Creator; disbelievers' equation of others despite this; human creation from clay with decreed and appointed terms; divine omniscience over secret and public; systematic sign-rejection by disbelievers; historical destruction of previous generations despite greater establishment; hypothetical scripture-on-page scenario proving obstinacy; angel-demand rebuttal showing mercy in human messenger; previous messenger-ridicule pattern and its consequences",
    keys: ["6:1","6:2","6:3","6:4","6:5","6:6","6:7","6:8","6:9","6:10"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Hamd (praise) due to Allah as Creator of heavens earth and Maker of darkness light", keys: ["6:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers equating others with their Lord despite creation evidence", keys: ["6:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Human creation from clay with decreed term and appointed term known only to Allah", keys: ["6:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Human doubt despite clear creation and term decree", keys: ["6:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah's exclusive deity-status in heavens and earth", keys: ["6:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine knowledge of secret and public and all earnings", keys: ["6:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Systematic sign-rejection: no ayah comes except they turn away", keys: ["6:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Truth-denial followed by coming news of what was ridiculed", keys: ["6:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Previous generations destroyed despite superior earthly establishment and abundant provision", keys: ["6:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypothetical written scripture on page still rejected as obvious magic", keys: ["6:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Angel-demand rebuttal: sending angel would end respite period", keys: ["6:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Angel in human form would cause same confusion they already experience", keys: ["6:9"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Previous messengers ridiculed; mockers enveloped by what they mocked", keys: ["6:10"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Pattern of previous messenger-ridicule and consequent envelopment of mockers", keys: ["6:10"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Persistent doubt (tamtaroon) despite creation evidence and term decree", keys: ["6:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Systematic sign-aversion (muAArideena) as habitual response to divine signs", keys: ["6:4"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Historical cycle: civilizations established with rain and rivers then destroyed for sins replaced by others", keys: ["6:6"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0267","cand-0268","cand-0269"],
  notes: "Pass A An'am passage 1/4. Opening theological foundation establishing Allah as sole Creator through hamd-formula. Darkness-light duality (6:1) frames epistemic contrast between guidance and misguidance. Dual-term concept (ajal + ajal musamma, 6:2) distinguishes individual lifespan from cosmic eschatological deadline. Sign-rejection pattern (6:4-5) establishes Meccan opposition's systematic character. Historical precedent (6:6) provides empirical argument against complacency. Hypothetical scenarios (6:7-9) demonstrate that objection is not evidential insufficiency but volitional rejection. Messenger-ridicule closure (6:10) connects Muhammad's experience to prophetic history providing both consolation and warning.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P1 divine names
{
  const t = findWordContaining(3, ["\u0633","\u0645","\u064a","\u0639"]); // alssameeAAu or similar
  // Actually look for specific names in verse 3
  // Verse 3 has no explicit divine name attributes beyond "Allah"
  // Check verse 1 for creator language
}
// Divine names from P1 verses - search for specific attribute words
{
  // 6:3 does not have named attributes beyond Allah
  // Let's check what attributes actually appear in verses 1-10
  // None of the standard divine name pairs appear explicitly in 6:1-10
  // The passage focuses on actions (khalaqa, jaAAala, qada) rather than name-attributions
}

// P1 terminology
{
  const t = findWordContaining(1, ["\u0638","\u0644","\u0645"]); // alththulumati
  if (t) p1.terminology.push({ term: t, transliteration: "thulumat", gloss: "darknesses (editorial gloss)", keys: ["6:1"] });
}
{
  const t = findWordContaining(1, ["\u0646","\u0648","\u0631"]); // alnnoora
  if (t) p1.terminology.push({ term: t, transliteration: "noor", gloss: "light (editorial gloss)", keys: ["6:1"] });
}
{
  const t = findWordContaining(2, ["\u0637","\u064a","\u0646"]); // teenin
  if (t) p1.terminology.push({ term: t, transliteration: "teen", gloss: "clay (editorial gloss)", keys: ["6:2"] });
}
{
  const t = findWordContaining(2, ["\u0623","\u062c","\u0644"]); // ajalan
  if (t) p1.terminology.push({ term: t, transliteration: "ajal", gloss: "term/decreed period (editorial gloss)", keys: ["6:2"] });
}
{
  const t = findWordContaining(5, ["\u0623","\u0646","\u0628"]); // anbao
  if (t) p1.terminology.push({ term: t, transliteration: "anba'", gloss: "news/tidings (editorial gloss)", keys: ["6:5"] });
}
{
  const t = findWordContaining(6, ["\u0642","\u0631","\u0646"]); // qarnin
  if (t) p1.terminology.push({ term: t, transliteration: "qarn", gloss: "generation/civilization (editorial gloss)", keys: ["6:6"] });
}
{
  const t = findWordContaining(7, ["\u0633","\u062d","\u0631"]); // sihrun
  if (t) p1.terminology.push({ term: t, transliteration: "sihr", gloss: "magic/sorcery (editorial gloss)", keys: ["6:7"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p1.json"), JSON.stringify(p1, null, 2) + "\n");
console.log("Wrote 006-al-anam-p1.json");

// ─── Passage 2: 6:11–20 ──────────────────────────────────────────────────────
const p2 = {
  extractionId: "ext-006-p2",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 11,
    toAyah: 20,
    label: "Al-An'am — Travel observe end of deniers; to whom belongs heavens earth? To Allah who decreed mercy upon Himself gathers to Resurrection Day no doubt; losers do not believe; His what rests night day He Hearing Knowing; take protector other than Allah Originator feeds not fed? commanded first submitter not polytheists; fear punishment great Day; spared that Day mercy clear success; if harm touches none removes except Him; if good He Capable; Subduer above servants Wise Acquainted; greatest testimony Allah witness between me you Quran revealed warn; He one God I free from associates; Scripture people recognize as sons; losers disbelieve"
  },
  verseKeys: ["6:11","6:12","6:13","6:14","6:15","6:16","6:17","6:18","6:19","6:20"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+11}`, text: fv(i+11) })),
  mainSubject: {
    label: "Command to travel and observe deniers' fate; exclusive divine ownership of heavens and earth; self-decreed mercy as foundational divine attribute; certain resurrection gathering; rhetorical rejection of non-Allah protectors based on Creator-feeder distinction; prophetic command to be first submitter and avoid shirk; divine harm-good monopoly establishing tawheed through dependency; Qahir-Hakeem-Khabeer attribute cluster; Allah as supreme witness with Quran as warning instrument; tawheed declaration with bara'a (disavowal) from associates; People of Scripture recognition contrasted with self-losers' disbelief",
    keys: ["6:11","6:12","6:13","6:14","6:15","6:16","6:17","6:18","6:19","6:20"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Travel-observation command: seeroo fee al-ardhi then observe deniers' end", keys: ["6:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine ownership declaration through rhetorical question-answer format", keys: ["6:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-decreed mercy (kataba AAala nafsihi alrrahmata) as voluntary divine commitment", keys: ["6:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Certain resurrection gathering with no-doubt clause", keys: ["6:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-losers identified as those who do not believe", keys: ["6:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine ownership of all that rests in night and day", keys: ["6:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rhetorical rejection of non-Allah waliy based on Fatir-yutAAimu distinction", keys: ["6:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic command to be first submitter (awwala man aslama)", keys: ["6:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition of being among mushrikeen", keys: ["6:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic fear of great Day punishment if disobedient", keys: ["6:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine sparing as mercy; clear success (alfawzu almubeenu)", keys: ["6:16"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Harm-good monopoly: none removes harm except Allah; He is Capable over all", keys: ["6:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Qahir (Subduer) above servants; Hakeem Khabeer pairing", keys: ["6:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah as greatest witness between Prophet and audience", keys: ["6:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Quran revealed as warning to Prophet's community and whomever it reaches", keys: ["6:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawheed declaration: ilahun wahidun with bara'a from shirk", keys: ["6:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People of Scripture recognizing truth as they recognize their own sons", keys: ["6:20"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-losers persist in disbelief despite recognition capacity", keys: ["6:20"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Self-loss (khasiroo anfusahum) as consequence of disbelief", keys: ["6:12","6:20"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0270","cand-0271","cand-0272"],
  notes: "Pass A An'am passage 2/4. Core tawheed argumentation block. Self-decreed mercy (6:12) uniquely presents rahmah as divine self-commitment rather than contingent response. Fatir-yutAAimu argument (6:14) grounds tawheed in ontological dependency: only Creator who feeds without being fed deserves worship. Harm-good monopoly (6:17) provides experiential tawheed proof through universal human vulnerability. Triple-attribute cluster Qahir-Hakeem-Khabeer (6:18) combines sovereignty wisdom and intimate knowledge. Witness-Quran linkage (6:19) makes revelation itself the evidentiary instrument. Universal-warning scope (waman balagha) extends Quran's reach beyond immediate audience. Bara'a formula (bareeon mimma tushrikoona) establishes prophetic disavowal as necessary corollary of tawheed affirmation. Son-recognition simile (6:20) implies Scripture-people's recognition is intuitive and undeniable making their rejection culpable.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P2 commands and prohibitions
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["6:11"], excerpt: fv(11), description: "Command: travel through the land then observe how was the end of the deniers." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["6:14"], excerpt: fv(14), description: "Command: I have been commanded to be the first who submits." });
p2.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["6:14"], excerpt: fv(14), description: "Prohibition: do not ever be of the polytheists." });

// P2 divine names
{
  const t1 = findWordContaining(13, ["\u0633","\u0645","\u064a","\u0639"]); // alssameeAAu
  const t2 = findWordContaining(13, ["\u0639","\u0644","\u064a","\u0645"]); // alAAaleemu
  if (t1 && t2) {
    const fullText = fv(13);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p2.divineNamesAndAttributes.push({ term: phrase, transliteration: "al-Samee' al-Aleem", gloss: "the Hearing the Knowing (editorial gloss)", keys: ["6:13"] });
    }
  }
}
{
  const t = findWordContaining(14, ["\u0641","\u0627","\u0637","\u0631"]); // fatiri
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Fatir", gloss: "Originator/Creator (editorial gloss)", keys: ["6:14"] });
}
{
  const t = findWordContaining(17, ["\u0642","\u062f","\u064a","\u0631"]); // qadeerun
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Qadeer", gloss: "Capable/Competent (editorial gloss)", keys: ["6:17"] });
}
{
  const t = findWordContaining(18, ["\u0642","\u0627","\u0647","\u0631"]); // alqahiru
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "al-Qahir", gloss: "the Subduer/Dominant (editorial gloss)", keys: ["6:18"] });
}
{
  const t1 = findWordContaining(18, ["\u062d","\u0643","\u064a","\u0645"]); // alhakeemu
  const t2 = findWordContaining(18, ["\u062e","\u0628","\u064a","\u0631"]); // alkhabeeru
  if (t1 && t2) {
    const fullText = fv(18);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p2.divineNamesAndAttributes.push({ term: phrase, transliteration: "al-Hakeem al-Khabeer", gloss: "the Wise the Acquainted (editorial gloss)", keys: ["6:18"] });
    }
  }
}
{
  const t = findWordContaining(19, ["\u0634","\u0647","\u064a","\u062f"]); // shaheedun
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Shaheed", gloss: "Witness (editorial gloss)", keys: ["6:19"] });
}

// P2 terminology
{
  const t = findWordContaining(12, ["\u0631","\u062d","\u0645"]); // alrrahmata
  if (t) p2.terminology.push({ term: t, transliteration: "rahmah", gloss: "mercy (editorial gloss)", keys: ["6:12"] });
}
{
  const t = findWordContaining(12, ["\u0642","\u064a","\u0627","\u0645"]); // alqiyamati
  if (t) p2.terminology.push({ term: t, transliteration: "qiyamah", gloss: "resurrection (editorial gloss)", keys: ["6:12"] });
}
{
  const t = findWordContaining(16, ["\u0641","\u0648","\u0632"]); // alfawzu
  if (t) p2.terminology.push({ term: t, transliteration: "fawz", gloss: "attainment/success (editorial gloss)", keys: ["6:16"] });
}
{
  const t = findWordContaining(14, ["\u0648","\u0644","\u064a"]); // waliyyan
  if (t) p2.terminology.push({ term: t, transliteration: "waliy", gloss: "protector/guardian (editorial gloss)", keys: ["6:14"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p2.json"), JSON.stringify(p2, null, 2) + "\n");
console.log("Wrote 006-al-anam-p2.json");

// ─── Passage 3: 6:21–30 ──────────────────────────────────────────────────────
const p3 = {
  extractionId: "ext-006-p3",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 21,
    toAyah: 30,
    label: "Al-An'am — Who more unjust than fabricates lie against Allah or denies signs? wrongdoers not succeed; Day gather all ask polytheists where partners? swear by Allah we were not polytheists; see how lied against selves lost what fabricated; some listen but coverings on hearts deafness in ears see every sign still disbelieve; argue legends of former peoples; prohibit from it avoid it destroy only selves perceive not; if could see standing before Fire wish returned not deny signs be believers; appeared what concealed; if returned would return forbidden indeed liars; say nothing but worldly life not resurrected; stand before Lord is this truth? yes by our Lord taste punishment for disbelief"
  },
  verseKeys: ["6:21","6:22","6:23","6:24","6:25","6:26","6:27","6:28","6:29","6:30"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+21}`, text: fv(i+21) })),
  mainSubject: {
    label: "Fabrication-denial as supreme injustice; wrongdoers' failure guaranteed; eschatological interrogation exposing polytheists' self-deception through false oaths; heart-coverings and ear-deafness as divine barriers preventing comprehension despite sign-exposure; legends-dismissal as argumentative strategy; self-destructive prohibition-avoidance unrecognized; hypothetical fire-standing scene revealing regret and desire for return; exposed concealment and inevitable reversion to forbidden if returned; materialist worldview denial of resurrection; standing before Lord confirming truth followed by punishment-tasting",
    keys: ["6:21","6:22","6:23","6:24","6:25","6:26","6:27","6:28","6:29","6:30"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Supreme injustice defined as fabrication against Allah or sign-denial", keys: ["6:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wrongdoers' guaranteed non-success (la yuflihu alththalimoona)", keys: ["6:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eschatological gathering and partner-location interrogation", keys: ["6:22"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False oath defense: swearing by Allah we were not polytheists", keys: ["6:23"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-directed lying: kathaboo AAala anfusihim and loss of fabricated deities", keys: ["6:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heart-coverings (akinnatan) and ear-deafness (waqran) preventing understanding", keys: ["6:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign-saturation still insufficient for belief: even seeing every sign rejected", keys: ["6:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Legends-of-former-peoples dismissal as argumentative tactic", keys: ["6:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dual prohibition-avoidance: preventing others and avoiding themselves", keys: ["6:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Unrecognized self-destruction: yuhlikoona illa anfusahum wama yashAAuroona", keys: ["6:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypothetical fire-standing: regret-wish for return and belief", keys: ["6:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Concealed matters appearing at judgment", keys: ["6:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Inevitable reversion to forbidden even if returned: innahum lakathiboona", keys: ["6:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Materialist creed: only worldly life no resurrection", keys: ["6:29"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Standing before Lord: truth confirmed by oath then punishment tasted", keys: ["6:30"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Heart-coverings and ear-deafness as divinely placed cognitive-spiritual barriers", keys: ["6:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Regret at fire-standing: desire for return and belief after seeing punishment", keys: ["6:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Confirmed liar-status: even if returned would revert to forbidden", keys: ["6:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Unperceived self-destruction: destroying only themselves without awareness", keys: ["6:26"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0273","cand-0274"],
  notes: "Pass A An'am passage 3/4. Extended eschatological-psychological analysis of disbelief. Supreme-injustice definition (6:21) establishes fabrication and sign-denial as worst possible acts. Eschatological interrogation (6:22-24) exposes self-deception mechanism: polytheists lie even to themselves under divine oath. Heart-ear barrier system (6:25) explains persistent rejection despite evidence saturation. Legends-dismissal (asateeru al-awwaleena) identified as intellectual defense mechanism. Self-destruction paradox (6:26) shows prohibition-enforcers harming only themselves unknowingly. Fire-regret scene (6:27-28) demonstrates post-hoc recognition is worthless: return would produce same rejection confirming volitional nature of disbelief. Materialist creed quotation (6:29) gives voice to opposing worldview before refuting it through standing-before-Lord scene (6:30). Truth-oath-punishment sequence (6:30) shows confession comes too late.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P3 terminology
{
  const t = findWordContaining(25, ["\u0623","\u0643","\u0646"]); // akinnatan
  if (t) p3.terminology.push({ term: t, transliteration: "akinnah", gloss: "coverings/veils (editorial gloss)", keys: ["6:25"] });
}
{
  const t = findWordContaining(25, ["\u0648","\u0642","\u0631"]); // waqran
  if (t) p3.terminology.push({ term: t, transliteration: "waqr", gloss: "deafness/heaviness (editorial gloss)", keys: ["6:25"] });
}
{
  const t = findWordContaining(25, ["\u0623","\u0633","\u0627","\u0637"]); // asateeru
  if (t) p3.terminology.push({ term: t, transliteration: "asateer", gloss: "legends/myths (editorial gloss)", keys: ["6:25"] });
}
{
  const t = findWordContaining(21, ["\u0623","\u0641","\u062a","\u0631"]); // iftara
  if (t) p3.terminology.push({ term: t, transliteration: "iftira'", gloss: "fabrication/invention (editorial gloss)", keys: ["6:21"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p3.json"), JSON.stringify(p3, null, 2) + "\n");
console.log("Wrote 006-al-anam-p3.json");

// ─── Passage 4: 6:31–40 ──────────────────────────────────────────────────────
const p4 = {
  extractionId: "ext-006-p4",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 31,
    toAyah: 40,
    label: "Al-An'am — Lost those denying meeting Allah; Hour comes suddenly regret neglect bear burdens on backs evil burden; worldly life play diversion Hereafter better for righteous reason?; We know saddened by words they reject not you but Allah's signs; messengers denied before patient harmed until victory came no altering Allah's words; if evasion difficult seek tunnel stairway bring sign if Allah willed gathered on guidance not ignorant; only hearing ones respond dead Allah resurrects returned to Him; say Allah Able send sign most don't know; every creature bird communities like you nothing neglected in Register gathered to Lord; denyers deaf dumb in darknesses Allah misguides or places on straight path; say if punishment or Hour comes invoke other than Allah if truthful"
  },
  verseKeys: ["6:31","6:32","6:33","6:34","6:35","6:36","6:37","6:38","6:39","6:40"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+31}`, text: fv(i+31) })),
  mainSubject: {
    label: "Loss through meeting-denial; sudden Hour bringing regret; worldly life as play-diversion versus Hereafter superiority; prophetic consolation redirecting blame to sign-rejection; previous messenger patience until unalterable victory; tunnel-stairway hyperbole showing sign-demand futility; hearing-response principle; divine sign-capability withheld; creature-communities in Register; deaf-dumb-darkness for deniers; guidance-misguidance prerogative; crisis-invocation sincerity test",
    keys: ["6:31","6:32","6:33","6:34","6:35","6:36","6:37","6:38","6:39","6:40"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Meeting-denial (kadhdhaboo biliqa'i Allahi) as cause of loss", keys: ["6:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sudden Hour arrival (baghtatan) producing regret-cry", keys: ["6:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Burden-bearing on backs as punishment imagery", keys: ["6:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly life as laAAibun walahwun (play and diversion)", keys: ["6:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hereafter superiority for muttaqeen with reasoning appeal", keys: ["6:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic grief acknowledged; rejection directed at signs not person", keys: ["6:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Previous messengers denied yet patient until unalterable victory", keys: ["6:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypothetical tunnel-stairway: sign-demanding futility against divine will", keys: ["6:35"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine will could have united all on guidance; prohibition of ignorance", keys: ["6:35"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Only hearing ones respond; dead resurrected and returned", keys: ["6:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine capability to send sign acknowledged; majority ignorance noted", keys: ["6:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "All creatures and birds as communities like humans; nothing neglected in Register", keys: ["6:38"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal gathering to Lord including all creature-communities", keys: ["6:38"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deniers characterized as deaf dumb in darknesses", keys: ["6:39"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine guidance-misguidance prerogative: yudlilhu or yajAAalhu AAala siratin mustaqeemin", keys: ["6:39"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Crisis-invocation challenge: invoke other than Allah if truthful", keys: ["6:40"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Previous messengers' patience through denial and harm until divine victory arrived", keys: ["6:34"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Regret (hasratana) at sudden Hour arrival over neglected preparation", keys: ["6:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic sadness caused by rejection; divine acknowledgment and redirection", keys: ["6:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spiritual deafness-dumbness-darkness as condition of sign-deniers", keys: ["6:39"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0275","cand-0276"],
  notes: "Pass A An'am passage 4/4. Transition from eschatological warning to theological consolidation. Meeting-denial (6:31) identifies root error underlying all preceding behaviors. Sudden-Hour motif emphasizes unpredictability requiring constant preparedness. Play-diversion characterization (6:32) provides ontological assessment of dunya not merely moral warning. Prophetic consolation (6:33) reveals divine empathy while correcting attribution: rejection targets signs not messenger. Unalterable-words principle (6:34) guarantees prophetic vindication. Tunnel-stairway hyperbole (6:35) demonstrates that even impossible sign-production would not overcome volitional rejection. Hearing-response principle (6:36) distinguishes spiritual receptivity from physical audition. Creature-communities verse (6:38) expands divine concern beyond humanity establishing ecological theology. Guidance-misguidance prerogative (6:39) affirms divine sovereignty over spiritual outcomes. Crisis-invocation challenge (6:40) serves as practical tawheed test: emergency reveals true reliance.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P4 divine names
{
  const t = findWordContaining(37, ["\u0642","\u0627","\u062f","\u0631"]); // qadirun
  if (t) p4.divineNamesAndAttributes.push({ term: t, transliteration: "Qadir", gloss: "Able/Capable (editorial gloss)", keys: ["6:37"] });
}

// P4 terminology
{
  const t = findWordContaining(32, ["\u0644","\u0639","\u0628"]); // laAAibun
  if (t) p4.terminology.push({ term: t, transliteration: "la'b", gloss: "play/amusement (editorial gloss)", keys: ["6:32"] });
}
{
  const t = findWordContaining(32, ["\u0644","\u0647","\u0648"]); // walahwun
  if (t) p4.terminology.push({ term: t, transliteration: "lahw", gloss: "diversion/distraction (editorial gloss)", keys: ["6:32"] });
}
{
  const t = findWordContaining(31, ["\u062d","\u0633","\u0631"]); // hasratana
  if (t) p4.terminology.push({ term: t, transliteration: "hasrah", gloss: "regret/remorse (editorial gloss)", keys: ["6:31"] });
}
{
  const t = findWordContaining(31, ["\u0648","\u0632","\u0631"]); // awzarahum
  if (t) p4.terminology.push({ term: t, transliteration: "wizr", gloss: "burden/load (editorial gloss)", keys: ["6:31"] });
}
{
  const t = findWordContaining(38, ["\u0643","\u062a","\u0627","\u0628"]); // alkitabi
  if (t) p4.terminology.push({ term: t, transliteration: "kitab", gloss: "Register/Book (editorial gloss)", keys: ["6:38"] });
}
{
  const t = findWordContaining(39, ["\u0635","\u0631","\u0627","\u0637"]); // siratin
  if (t) p4.terminology.push({ term: t, transliteration: "sirat", gloss: "path/way (editorial gloss)", keys: ["6:39"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p4.json"), JSON.stringify(p4, null, 2) + "\n");
console.log("Wrote 006-al-anam-p4.json");

// ─── Candidates batch (cand-0267 through cand-0276) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-006-p1,ext-006-p2,ext-006-p3,ext-006-p4",
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

// cand-0267: Creation-duality and sign-rejection pattern
candidates.candidates.push(makeCand("cand-0267",
  "Creation-duality and sign-rejection: Allah created heavens earth made darkness light yet disbelievers equate others; no sign comes except they turn away; denied truth awaits news of ridicule",
  undefined, "ثنائية الخلق ورفض الآيات: الله خلق السماوات والأرض وجعل الظلمات والنور ومع ذلك يعدل الكافرون؛ لا تأتيهم آية إلا أعرضوا؛ كذبوا بالحق ينتظرهم أنباء ما يستهزئون",
  "In 6:1-5: All praise to Allah who created the heavens and the earth and made the darkness and the light. Then those who disbelieve equate others with their Lord. No sign comes to them from the signs of their Lord except that they turn away. They denied the truth when it came to them so there will come to them news of what they used to ridicule.",
  [{ key: "6:1", excerpt: fv(1), evidenceClass: "EXPLICIT_TEXT", rationale: "Alhamdu lillahi allathee khalaqa alssamawati waalarda wajaAAala alththulumati waalnnoora: creation-praise establishing Allah as sole originator of cosmos and epistemic duality. Thumma allatheena kafaroo birabbihim yaAAdiloona: despite creation evidence disbelievers equate others showing volitional rejection not evidential deficit." },
   { key: "6:4", excerpt: fv(4), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama tateehim min ayatin min ayati rabbihim illa kanoo AAanha muAArideena: systematic sign-aversion pattern using illa kanoo construction indicating habitual response regardless of sign type." },
   { key: "6:5", excerpt: fv(5), evidenceClass: "EXPLICIT_TEXT", rationale: "Faqad kaththaboo bialhaqqi lamma jaahum: truth-denial temporally linked to its arrival. Fasawfa yateehim anbao ma kanoo bihi yastahzioona: future news-arrival as ironic reversal where ridiculed content becomes experienced reality." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Creation-based tawheed argument undermined by persistent sign-rejection" }],
  "Overlap with tawheed. Darkness-light duality frames entire epistemic landscape: creation itself is sign yet disbelievers choose darkness. YaAAdiloona (equate) implies active comparison not passive ignorance. Sign-rejection pattern uses absolute negation (ma...illa) showing no exception exists. Ridicule-news reversal establishes poetic justice principle operating in eschatological timeframe. Positioned as surah-opening thematic statement governing all subsequent argumentation."
));

// cand-0268: Historical civilization cycle
candidates.candidates.push(makeCand("cand-0268",
  "Historical civilization cycle: previous generations established with superior resources rain rivers yet destroyed for sins replaced by others; empirical argument against complacency",
  undefined, "دورة الحضارات التاريخية: أمم سابقة مكنت بأفضل موارد وأمطار وأنهار ثم أهلكت بذنوبها وأبدلت بغيرها؛ حجة تجريبية ضد الاغترار",
  "In 6:6: Have they not seen how many generations We destroyed before them which We had established upon the earth as We have not established you? And We sent rain upon them in showers and made rivers flow beneath them; then We destroyed them for their sins and brought forth after them another generation.",
  [{ key: "6:6", excerpt: fv(6), evidenceClass: "EXPLICIT_TEXT", rationale: "Alam yaraw kam ahlakna min qablihim min qarnin: rhetorical question demanding empirical observation of historical destruction. Makkannahum fee alardi ma lam numakkin lakum: comparative establishment showing predecessors had superior earthly power. Waarsalna alssamaa AAalayhim midraran wajaAAalna alanhara tajree min tahtihim: abundant provision demonstrating material success did not prevent destruction. Faahlaknahum bithunoobihim: sin-causation linking destruction to moral not material factors. Waanshana min baAAdihim qarnan akhareena: replacement principle showing civilizations are dispensable." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical", note: "Historical demonstration of divine power through civilizational destruction and replacement" }],
  "Overlap with divine-power. Empirical argument form (alam yaraw) demands observation not faith. Comparative superiority (ma lam numakkin lakum) eliminates resource-insufficiency excuse. Rain-river imagery represents peak agricultural prosperity making destruction more striking. Bithunoobihim specifies moral causation distinguishing from natural disaster. Replacement cycle (qarnan akhareena) shows divine governance continues beyond any single civilization. Functions as warning to Meccan audience enjoying similar prosperity."
));

// cand-0269: Hypothetical scenarios proving obstinacy
candidates.candidates.push(makeCand("cand-0269",
  "Hypothetical scenarios proving obstinacy: even written scripture on page touched by hands called magic; angel demanded but sending would end respite; angel in human form causes same confusion; previous messengers ridiculed and mockers enveloped",
  undefined, "سيناريوهات افتراضية تثبت العناد: حتى كتاب مكتوب على قرطاس لمسوه بأيديهم سموه سحراً؛ طالبوا بملك لكن إنزاله ينهي الإمهال؛ ملك بصيغة بشر يسبب نفس اللبس؛ رسل سابقون سُخِر منهم فحاق بالمستهزئين",
  "In 6:7-10: Even if We sent down a written scripture on a page and they touched it with their hands the disbelievers would say this is obvious magic. They say why was an angel not sent down? If We sent an angel the matter would be decided then they would not be reprieved. If We made him an angel We would make him a man and cover them with confusion. Messengers were ridiculed before you and those who mocked were enveloped by what they ridiculed.",
  [{ key: "6:7", excerpt: fv(7), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaw nazzalna AAalayka kitaban fee qirtasin falamasoohu biaydeehim: maximum-evidence hypothetical combining written form with tactile verification. Laqala allatheena kafaroo in hatha illa sihrun mubeenun: predetermined rejection response proving objection is volitional not evidential." },
   { key: "6:8", excerpt: fv(8), evidenceClass: "EXPLICIT_TEXT", rationale: "Waqaloo lawla onzila AAalayhi malakun: angel-demand as recurring Meccan objection. Walaw anzalna malakan laqudiya alamru: angel-sending would terminate probationary period eliminating mercy-space. Thumma la yuntharoona: no-respite consequence showing current human-messenger format is itself mercy." },
   { key: "6:9", excerpt: fv(9), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaw jaAAalnahu malakan lajaAAalnahu rajulan: angel in human appearance creates identical epistemic situation. Walalabasna AAalayhim ma yalbisoona: confusion would persist proving problem is perceptual-volitional not ontological." },
   { key: "6:10", excerpt: fv(10), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaqadi istuhzia birusulin min qablika: historical precedent confirming ridicule pattern. Fahaqa biallatheena sakhiroo minhum ma kanoo bihi yastahzioona: ironic envelopment where mockery-content becomes mocker's fate." }],
  [{ topicId: "prophets", layer: "curated", relationship: "related-not-identical", note: "Prophetic ridicule pattern and its consequences across messenger history" }],
  "Overlap with prophets. Four-scenario progression escalates evidence-level while maintaining constant rejection-response. Written-touchable scripture represents maximum possible physical evidence yet still dismissed. Angel-demand rebuttal reframes absence as mercy not deficiency. Human-form-angel hypothetical shows form-change solves nothing. Historical envelopment (haqa) provides empirical confirmation of pattern. Collectively these scenarios function as meta-argument: no conceivable evidence satisfies volitional rejection."
));

// cand-0270: Self-decreed mercy and certain gathering
candidates.candidates.push(makeCand("cand-0270",
  "Self-decreed mercy and certain gathering: Allah wrote mercy upon Himself as voluntary commitment; will surely assemble for Resurrection Day no doubt; self-losers do not believe",
  undefined, "الرحمة المكتوبة والتجمع المؤكد: الله كتب الرحمة على نفسه التزاماً طوعياً؛ ليجمعنكم إلى يوم القيامة لا ريب فيه؛ الذين خسروا أنفسهم لا يؤمنون",
  "In 6:12: Say to whom belongs whatever is in the heavens and earth? Say to Allah. He has decreed upon Himself mercy. He will surely assemble you for the Day of Resurrection about which there is no doubt. Those who will lose themselves do not believe.",
  [{ key: "6:12", excerpt: fv(12), evidenceClass: "EXPLICIT_TEXT", rationale: "Qul liman ma fee alssamawati waalardi qul lillahi: ownership declaration through rhetorical question-answer establishing exclusive divine dominion. Kataba AAala nafsihi alrrahmata: self-decreed mercy using kataba (wrote/decreed) implying binding self-commitment not contingent response. LayajmaAAannakum ila yawmi alqiyamati la rayba feehi: emphatic gathering certainty using la- prefix and la rayba double-affirmation. Allatheena khasiroo anfusahum fahum la yuminoona: self-loss identified as disbelief-consequence creating causal link between epistemic and existential loss." }],
  [{ topicId: "divine-mercy", layer: "scholarly", relationship: "same-concept", note: "Unique formulation of mercy as divine self-decree rather than contingent attribute" },
   { topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical", note: "Resurrection gathering presented as certain outcome of divine self-commitment" }],
  "Overlap with divine-mercy and day-of-judgment. Kataba AAala nafsihi is unique Quranic formulation presenting rahmah as voluntary divine legislation binding upon Allah Himself. This transforms mercy from optional benevolence to structural feature of divine-human relationship. Gathering-certainty follows logically: self-decreed mercy necessitates fair adjudication through resurrection. Self-loss (khasiroo anfusahum) uses reflexive pronoun emphasizing self-inflicted nature of damnation. Positioned after ownership-declaration showing mercy operates within sovereignty not despite it."
));

// cand-0271: Harm-good monopoly and divine attributes
candidates.candidates.push(makeCand("cand-0271",
  "Harm-good monopoly and attribute cluster: if Allah touches harm none removes except Him; if good He is Capable; He is Subduer above servants Wise Acquainted establishing tawheed through experiential dependency",
  undefined, "احتكار الضر والخير وعناقيد الصفات: إن يمسسك الله بضر فلا كاشف له إلا هو؛ وإن بخير فهو قدير؛ وهو القاهر فوق عباده الحكيم الخبير تأسيس التوحيد عبر التبعية التجريبية",
  "In 6:17-18: If Allah touches you with harm there is no remover except Him. If He touches you with good He is over all things Capable. He is the Subduer above His servants and He is the Wise the Acquainted.",
  [{ key: "6:17", excerpt: fv(17), evidenceClass: "EXPLICIT_TEXT", rationale: "Wain yamsaska Allahu bidurrin fala kashifa lahu illa huwa: harm-monopoly using illa huwa exclusion proving no other agent can remove divine affliction. Wain yamsaska bikhayrin fahuwa AAala kulli shayin qadeerun: good-attribution paired with universal capability establishing Allah as sole source of benefit." },
   { key: "6:18", excerpt: fv(18), evidenceClass: "EXPLICIT_TEXT", rationale: "Wahuwa alqahiru fawqa AAibadihi: subjugation-above-servants establishing hierarchical sovereignty. Wahuwa alhakeemu alkhabeeru: wisdom-acquaintance pairing combining transcendent knowledge with intimate awareness preventing tyranny-concern." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Experiential tawheed through universal human dependency on divine harm-good agency" },
   { topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical", note: "Qadir-Qahir attributes demonstrating comprehensive divine power" }],
  "Overlap with tawheed and divine-power. Harm-good monopoly provides experiential proof accessible to every human regardless of intellectual capacity. Illa huwa exclusion in harm-removal is absolute leaving no intermediary space. Qadeer after good-touch shows capability is activated not dormant. Qahir-fawqa-AAibadihi establishes servant-status as ontological fact not chosen identity. Hakeem-Khabeer pairing addresses potential objection: absolute power exercised with perfect wisdom and intimate knowledge. Together these verses compress complete tawheed argument into dependency-experience."
));

// cand-0272: Witness-Quran-tawheed-barā'a complex
candidates.candidates.push(makeCand("cand-0272",
  "Witness-Quran-tawheed-barā'a complex: Allah greatest witness between Prophet and audience; Quran revealed to warn you and whomever reaches; He is one God; I am free from what you associate; Scripture-people recognize truth as sons",
  undefined, "مركب الشهادة والقرآن والتوحيد والبراءة: الله أكبر شهيد بين النبي والمخاطبين؛ القرآن أنذر به من بلغ؛ إنما هو إله واحد وأنا بريء مما تشركون؛ أهل الكتاب يعرفونه كما يعرفون أبناءهم",
  "In 6:19-20: Say what thing is greatest in testimony? Say Allah is witness between me and you. This Quran was revealed to warn you and whomever it reaches. Do you testify that with Allah there are other deities? Say I will not testify. Say He is but one God and I am free from what you associate. Those given Scripture recognize it as they recognize their sons. Those who lose themselves do not believe.",
  [{ key: "6:19", excerpt: fv(19), evidenceClass: "EXPLICIT_TEXT", rationale: "Qul ayyu shayin akbaru shahadatan quli Allahu shaheedun baynee wabaynakum: supreme-witness designation making Allah Himself evidentiary authority. Waoohiya ilayya hatha alquranu lionthirakum bihi waman balagha: revelation-purpose as warning with universal scope (waman balagha). Ainnakum latashhadoona anna maAAa Allahi alihatan okhra qul la ashhadu: counter-testimony refusing to validate polytheism. Qul innama huwa ilahun wahidun wainnanee bareeon mimma tushrikoona: tawheed-bara'a conjunction making disavowal necessary corollary of unity-affirmation." },
   { key: "6:20", excerpt: fv(20), evidenceClass: "EXPLICIT_TEXT", rationale: "Allatheena ataynahumu alkitaba yaAArifoonahu kama yaAArifoona abnaahum: son-recognition simile implying intuitive undeniable recognition by Scripture-people. Allatheena khasiroo anfusahum fahum la yuminoona: self-loss persists despite recognition-capacity showing volitional component." }],
  [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Comprehensive tawheed declaration with prophetic barā'a and universal warning scope" }],
  "Overlap with tawheed. Greatest-testimony framing elevates divine witness above all human testimony. Waman balagha extends Quran's jurisdiction beyond immediate audience to all future recipients. La ashhadu refusal models proper response to polytheist pressure. Ilahun wahidun uses wahid (numerical one) excluding any plurality. Bareeon mimma tushrikoona establishes prophetic innocence from association as theological necessity. Son-recognition simile suggests Scripture-knowledge should produce automatic acceptance making rejection culpable. Self-loss repetition (cf. 6:12) creates thematic bracket around passage."
));

// cand-0273: Supreme injustice and eschatological self-deception
candidates.candidates.push(makeCand("cand-0273",
  "Supreme injustice and eschatological self-deception: who more unjust than fabricates against Allah or denies signs? wrongdoers fail; Day gather ask polytheists where partners? swear we were not polytheists; lied against selves lost fabricated deities",
  undefined, "أعلى درجات الظلم والخداع الذاتي الأخروي: من أظلم ممن افترى على الله كذباً أو كذب بآياته؟ الظالمون لا يفلحون؛ يوم الحشر نسأل المشركين أين شركاؤكم؟ يحلفون ما كنا مشركين؛ كذبوا على أنفسهم وضل عنهم ما كانوا يفترون",
  "In 6:21-24: Who is more unjust than one who fabricates against Allah a lie or denies His signs? The wrongdoers will not succeed. Day We gather them all then say to those who associated where are your partners you claimed? Their examination-excuse is only saying by Allah our Lord we were not polytheists. See how they lied against themselves and lost from them what they fabricated.",
  [{ key: "6:21", excerpt: fv(21), evidenceClass: "EXPLICIT_TEXT", rationale: "Waman athlamu mimmani iftara AAala Allahi kathiban aw kaththaba biayatihi: supreme-injustice definition combining two crimes fabrication and denial. Innahu la yuflihu alththalimoona: guaranteed non-success using la yuflihu negation of falah (success/salvation)." },
   { key: "6:22", excerpt: fv(22), evidenceClass: "EXPLICIT_TEXT", rationale: "Wayawma nahshuruhum jameeAAan: universal gathering. Thumma naqoolu lillatheena ashrakoo ayna shurakaokumu: partner-location demand exposing absence. Allatheena kuntum tazAAumoona: past-tense claim-highlighting showing former assertion now void." },
   { key: "6:23", excerpt: fv(23), evidenceClass: "EXPLICIT_TEXT", rationale: "Thumma lam takun fitnatuhum illa an qaloo waAllahi rabbina ma kunna mushrikeena: sole defense is false oath using Allah's name demonstrating continued deception even at judgment." },
   { key: "6:24", excerpt: fv(24), evidenceClass: "EXPLICIT_TEXT", rationale: "Onthur kayfa kathaboo AAala anfusihim: self-directed lying command to observe. Wadalla AAanhum ma kanoo yaftaroona: fabricated deities abandoning their inventors completing ironic reversal." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical", note: "Eschatological interrogation scene exposing polytheist self-deception" }],
  "Overlap with day-of-judgment. Supreme-injustice definition provides moral taxonomy: fabrication and denial are worst possible acts. Guaranteed non-success functions as theological axiom. Partner-location question is rhetorical since partners are nonexistent. False-oath defense shows self-deception persists even before divine presence. Kathaboo AAala anfusihim (lied against themselves) identifies self as primary victim of polytheism. Dallah (lost/strayed) applied to fabricated deities shows invented gods have no independent existence. Scene functions as warning to living audience still capable of correction."
));

// cand-0274: Cognitive barriers and irreversible regret
candidates.candidates.push(makeCand("cand-0274",
  "Cognitive barriers and irreversible regret: heart-coverings and ear-deafness prevent understanding even seeing every sign; legends-dismissal as tactic; self-destructive avoidance unrecognized; fire-standing regret wishing return; if returned would revert to forbidden confirmed liars",
  undefined, "الحواجز المعرفية والندم اللاعكسي: أكننة على القلوب ووقر في الآذان تمنع الفقه حتى رؤية كل آية؛ أساطير الأولين كتكتيك؛ تدمير الذات غير المدرك؛ ندم عند النار متمنين العودة؛ لو ردوا لعادوا للمنهى عنه كاذبون",
  "In 6:25-28: Among them are those who listen but We placed coverings on their hearts lest they understand and in their ears deafness. If they see every sign they will not believe. When they come arguing they say this is legends of former peoples. They prevent others and avoid it destroying only themselves unawares. If you could see when standing before Fire saying would we could return not deny signs be believers. But appeared to them what they concealed. If returned they would return to forbidden; they are liars.",
  [{ key: "6:25", excerpt: fv(25), evidenceClass: "EXPLICIT_TEXT", rationale: "WajaAAalna AAala quloobihim akinnatan an yafqahoohu wafee athanihim waqran: dual-barrier system heart-covering plus ear-deafness preventing comprehension. Wain yaraw kulla ayatin la yuminoo biha: sign-saturation insufficiency proving barrier is volitional-ontological not informational. In hatha illa asateeru alawwaleena: legends-dismissal as intellectual defense mechanism." },
   { key: "6:26", excerpt: fv(26), evidenceClass: "EXPLICIT_TEXT", rationale: "Wahum yanhawna AAanhu wayanawna AAanhu: dual prohibition preventing others while avoiding themselves. Wain yuhlikoona illa anfusahum wama yashAAuroona: unrecognized self-destruction paradox." },
   { key: "6:27", excerpt: fv(27), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaw tara ith wuqifoo AAala alnnari faqaloo ya laytana nuraddu: hypothetical fire-standing revealing post-hoc regret. Wala nukaththiba biayati rabbina wanakoona mina almumineena: desired correction includes both sign-acceptance and believer-identity." },
   { key: "6:28", excerpt: fv(28), evidenceClass: "EXPLICIT_TEXT", rationale: "Bal bada lahum ma kanoo yukhfoona min qablu: concealed matters now exposed. Walaw ruddoo laAAadoo lima nuhoo AAanhu: inevitable reversion proving volitional nature. Wainnahum lakathiboona: confirmed liar-status invalidating regret-sincerity." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical", note: "Post-mortem regret scene demonstrating irreversibility of missed opportunity" }],
  "Overlap with day-of-judgment. Akinnatan-waqran barrier system explains persistent rejection without excusing it. Kulla ayatin (every sign) saturation shows problem is not evidence quantity. Asateeru al-awwaleena dismissal categorizes rejection as pre-packaged response. Yanhawna-yanawna duality shows active opposition combined with personal avoidance. Wama yashAAuroona (unaware) highlights tragic self-ignorance. Fire-regret scene uses walaw tara (if you could see) inviting audience to visualize. LaAAadoo lima nuhoo AAanhu confirms volitional persistence: even second chance produces same choice. Kathiboona verdict retroactively invalidates all prior claims including regret-expression."
));

// cand-0275: Worldly-play and prophetic consolation
candidates.candidates.push(makeCand("cand-0275",
  "Worldly-play characterization and prophetic consolation: worldly life is play and diversion Hereafter better for righteous; We know your sadness they reject not you but Allah's signs; previous messengers patient until unalterable victory",
  undefined, "توصيف الدنيا واللعب وتعزية النبي: الحياة الدنيا لعب ولهو والدار الآخرة خير للمتقين؛ قد نعلم إنه ليحزنك الذي يقولون فإنهم لا يكذبونك ولكن الظالمين بآيات الله يجحدون؛ رسل سابقة صبرت حتى جاء نصرنا ولا مبدل لكلمات الله",
  "In 6:32-34: The worldly life is nothing but play and diversion but the home of the Hereafter is best for those who fear Allah so will you not reason? We know that what they say saddens you. They do not call you untruthful but the wrongdoers reject Allah's signs. Messengers were denied before you and were patient over denial and harm until Our victory came. None can alter Allah's words.",
  [{ key: "6:32", excerpt: fv(32), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama alhayatu alddunya illa laAAibun walahwun: ontological characterization reducing dunya to amusement-distraction. Walalddaru alakhirati khayrun lillatheena yattaqoona: Hereafter superiority conditional on taqwa. Afala taAAqiloona: reasoning appeal connecting ontological assessment to rational faculty." },
   { key: "6:33", excerpt: fv(33), evidenceClass: "EXPLICIT_TEXT", rationale: "Qad naAAlamu innahu layahzunuka allathee yaqooloona: divine acknowledgment of prophetic grief. Fainnahum la yukaththiboonaka walakinna alththalimeena biayati Allahi yajhadoona: redirection clarifying rejection target is signs not messenger personally." },
   { key: "6:34", excerpt: fv(34), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaqad kuththibat rusulun min qablika fasabaroo: historical precedent normalizing rejection experience. Hatta atahum nasruna: victory-certainly as divine promise. Wala mubaddila likalimati Allahi: unalterable-words principle guaranteeing prophetic vindication." }],
  [{ topicId: "prophets", layer: "curated", relationship: "related-not-identical", note: "Prophetic consolation through historical precedent and unalterable divine promise" },
   { topicId: "mercy-and-forgiveness", layer: "curated", relationship: "related-not-identical", note: "Divine empathy toward prophetic grief as expression of mercy" }],
  "Overlap with prophets and mercy-and-forgiveness. La'b-lahw characterization is ontological not merely moral: dunya's nature is triviality regardless of apparent seriousness. Khayrun comparative requires taqwa-condition preventing antinomian reading. Divine grief-acknowledgment (naAAlamu...layahzunuka) shows empathetic knowledge. Redirection (la yukaththiboonaka) protects prophetic dignity while accurately diagnosing problem. Sabaroo-patience model provides behavioral template. Nasruna-victory uses first-person plural emphasizing divine agency in vindication. La mubaddila likalimati Allahi functions as theological anchor: divine speech cannot be frustrated by human opposition."
));

// cand-0276: Creature-communities and crisis-invocation test
candidates.candidates.push(makeCand("cand-0276",
  "Creature-communities and crisis-invocation test: every creature bird communities like you nothing neglected in Register gathered to Lord; deniers deaf dumb in darknesses Allah guides or misguides; if punishment or Hour comes invoke other than Allah if truthful",
  undefined, "أمم المخلوقات وامتحان الدعاء في الأزمات: كل دابة وطائر أمم أمثالكم ما فرطنا في الكتاب من شيء إلى ربهم يحشرون؛ المكذبون صم بكم في ظلمات الله يضل أو يهدي؛ إن أتاكم عذاب الله أو الساعة أغَيْر الله تدعون إن كنتم صادقين",
  "In 6:38-40: There is no creature on earth or bird flying with wings except communities like you. We have not neglected in the Register anything. Then to their Lord they will be gathered. Those who deny Our signs are deaf dumb in darknesses. Whomever Allah wills He misguides and whomever He wills He places on straight path. Say have you considered if punishment or Hour came would you invoke other than Allah if truthful?",
  [{ key: "6:38", excerpt: fv(38), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama min dabbatin fee alardi wala tairin yateeru bijanahayhi illa omamun amthalukum: universal creature-community parallel extending moral consideration beyond humanity. Ma farratna fee alkitabi min shayin: comprehensive Register ensuring nothing omitted from divine record. Thumma ila rabbihim yuhsharoona: universal gathering including all creature-communities." },
   { key: "6:39", excerpt: fv(39), evidenceClass: "EXPLICIT_TEXT", rationale: "Waallatheena kaththaboo biayatina summun wabukmun fee alththulumati: triple-sensory deprivation imagery for sign-deniers. Man yashai Allahu yudlilhu waman yasha yajAAalhu AAala siratin mustaqeemin: divine guidance-misguidance prerogative affirming sovereignty over spiritual outcomes." },
   { key: "6:40", excerpt: fv(40), evidenceClass: "EXPLICIT_TEXT", rationale: "Qul araaytakum in atakum AAathabu Allahi aw atatkumu alssaAAatu: crisis-scenario positing punishment or Hour arrival. Aghayra Allahi tadAAoona in kuntum sadiqeena: sincerity-test through emergency invocation challenging polytheist consistency." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "related-not-identical", note: "Comprehensive divine governance over all creature-communities and spiritual outcomes" },
   { topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Practical tawheed test through crisis-invocation challenge" }],
  "Overlap with divine-power and tawheed. Omamun amthalukum (communities like you) establishes creaturely solidarity challenging human exceptionalism. Kitab-register comprehensiveness ensures ecological accountability. Summun-bukmun-fee-alththulumati triple-deprivation contrasts with hearing-response principle (6:36). Guidance-misguidance prerogative prevents mechanical salvation-theology. Crisis-invocation test (6:40) functions as practical falsification: emergency reveals true object of reliance. In kuntum sadiqeena challenges sincerity: if polytheists truly believed in partners they would invoke them in crisis. Passage closes section with actionable tawheed test complementing preceding theoretical arguments."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-027.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-027.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-006-p1 through ext-006-p4)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0267 through cand-${String(266 + candidates.candidates.length).padStart(4,'0')})`);
