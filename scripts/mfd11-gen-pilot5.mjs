// MFD-11 Pilot 5 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Baqarah 2:62-86 (Passages 11-14, Candidates cand-0047..cand-0056).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "002-0062-0086.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 2:${n} not found`);
  return verses[n];
}

// Full verse helper
function fv(n) { return v(n); }

console.log("Generating pilot 5 files from verbatim corpus (2:62-86)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

// ─── Passage 11: 2:62–63 ────────────────────────────────────────────────────────
const p11 = {
  extractionId: "ext-002-p11",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 62, toAyah: 63, label: "Al-Baqarah — universal salvation for believers across communities; covenant at Mount Sinai raised above them" },
  verseKeys: ["2:62","2:63"],
  arabicExcerpts: [
    { key: "2:62", text: fv(62) },
    { key: "2:63", text: fv(63) }
  ],
  mainSubject: {
    label: "Universal reward for all who believe in Allah and the Last Day and do righteousness regardless of community affiliation; covenant with Bani Israel at Mount Sinai commanding them to hold firmly to what was given and remember its contents for taqwa",
    keys: ["2:62","2:63"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Believers, Jews, Christians, Sabians who believe in Allah and Last Day and do good: reward with Lord, no fear, no grief", keys: ["2:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taking covenant from Bani Israel", keys: ["2:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Raising Mount Sinai (at-Tur) above them", keys: ["2:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: take what We gave you with strength/determination", keys: ["2:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: remember what is in it so perhaps you attain taqwa", keys: ["2:63"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  humanConditionsAndSpiritualStates: [
    { label: "Taqwa as intended outcome of holding to divine scripture", keys: ["2:63"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Freedom from fear and grief as reward for true faith and righteous action", keys: ["2:62"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Covenantal relationship between Allah and Bani Israel at Sinai", keys: ["2:63"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0047","cand-0048"],
  notes: "Pass A pilot 5, passage 11/4. Key ecumenical verse (2:62) establishing salvation criteria beyond communal identity. Transition from wilderness narrative to covenant renewal.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:18:00.000Z"
};

// Extract commands from P11
{
  // 2:63 - command: خُذُواْ مَآ ءَاتَيۡنَٰكُم بِقُوَّةٖ
  const t63 = fv(63);
  const khuthooIdx = t63.indexOf("\u062e\u064f\u0630\u064f\u0648\u0627\u0652");
  if (khuthooIdx >= 0) {
    const biquwwatinIdx = t63.indexOf("\u0628\u0650\u0642\u064f\u0648\u0651\u064e\u0629\u064d", khuthooIdx);
    if (biquwwatinIdx >= 0) {
      const cmdText = t63.slice(khuthooIdx, biquwwatinIdx + 8).trim();
      p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:63"], excerpt: cmdText, description: "Command: take what We have given you with determination/strength." });
    }
  }

  // 2:63 - command: وَٱذۡكُرُواْ مَا فِيهِ
  const othkurooIdx = t63.indexOf("\u0648\u064e\u0671\u0630\u0652\u0643\u064f\u0631\u064f\u0648\u0627\u0652");
  if (othkurooIdx >= 0) {
    const maFeehiIdx = t63.indexOf("\u0645\u064e\u0627 \u0641\u0650\u064a\u0647\u0650", othkurooIdx);
    if (maFeehiIdx >= 0) {
      const cmdText = t63.slice(othkurooIdx, maFeehiIdx + 6).trim();
      p11.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:63"], excerpt: cmdText, description: "Command: remember what is in it (the scripture)." });
    }
  }
}

// Extract divine names from P11
{
  // Rabbihim from 2:62
  const t62 = fv(62);
  const rabbihimIdx = t62.indexOf("\u0631\u064e\u0628\u0651\u0650\u0647\u0650\u0645\u0652");
  if (rabbihimIdx >= 0) {
    p11.divineNamesAndAttributes.push({ term: t62.slice(rabbihimIdx, rabbihimIdx + 7), transliteration: "Rabbihim", gloss: "their Lord (editorial gloss)", keys: ["2:62"] });
  }

  // Allah from 2:62
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u0650", "\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t62.indexOf(form);
    if (idx >= 0) {
      p11.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:62"] });
      break;
    }
  }
}

// Extract terminology from P11
{
  // Taqwa from 2:63 - تَتَّقُونَ
  const t63 = fv(63);
  const tattaqoonIdx = t63.indexOf("\u062a\u064e\u062a\u064e\u0651\u0642\u064f\u0648\u0646\u064e");
  if (tattaqoonIdx >= 0) {
    p11.terminology.push({ term: t63.slice(tattaqoonIdx, tattaqoonIdx + 7), transliteration: "tattaqoon", gloss: "you become righteous/God-conscious (editorial gloss)", keys: ["2:63"] });
  }

  // Meethaq from 2:63 - مِيثَٰقَكُمۡ
  const meethaqIdx = t63.indexOf("\u0645\u0650\u064a\u062b\u064e\u0627\u0642\u064e\u0643\u064f\u0645\u0652");
  if (meethaqIdx >= 0) {
    p11.terminology.push({ term: t63.slice(meethaqIdx, meethaqIdx + 9), transliteration: "meethaqakum", gloss: "your covenant (editorial gloss)", keys: ["2:63"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p11.json"), JSON.stringify(p11, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p11.json");

// ─── Passage 12: 2:64–71 ────────────────────────────────────────────────────────
const p12 = {
  extractionId: "ext-002-p12",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 64, toAyah: 71, label: "Al-Baqarah — turning away after covenant; sabbath transgressors turned to apes; cow command narrative with detailed questioning; striking slain man with part of cow; Allah brings dead to life" },
  verseKeys: ["2:64","2:65","2:66","2:67","2:68","2:69","2:70","2:71"],
  arabicExcerpts: Array.from({length:8}, (_,i) => ({ key: `2:${i+64}`, text: fv(i+64) })),
  mainSubject: {
    label: "Consequences of turning away after covenant; sabbath violators transformed into despised apes as deterrent and lesson; Allah's command through Musa to slaughter a cow; Bani Israel's excessive questioning about cow's attributes; final compliance after clarification; striking slain man with part of cow demonstrating Allah's power to revive the dead",
    keys: ["2:64","2:65","2:66","2:67","2:68","2:69","2:70","2:71"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Turning away after covenant: without Allah's favor and mercy they would be losers", keys: ["2:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sabbath transgressors commanded to be despised apes", keys: ["2:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Transformation made as deterrent punishment for contemporaries and successors", keys: ["2:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lesson/admonition for the muttaqeen", keys: ["2:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Musa conveying Allah's command to slaughter a cow", keys: ["2:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bani Israel accusing Musa of ridicule", keys: ["2:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Musa seeking refuge in Allah from being among the ignorant", keys: ["2:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "First clarification request: what kind of cow? Answer: neither old nor virgin, median", keys: ["2:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Second clarification: color? Answer: yellow, bright, pleasing to observers", keys: ["2:69"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Third clarification: cows look alike; if Allah wills we will be guided", keys: ["2:70"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Final specification: untrained, no fault, no spot; they finally complied but barely", keys: ["2:71"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Musa conveying the cow command and responding to Bani Israel's questions", keys: ["2:67","2:68","2:69","2:70","2:71"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Reluctant obedience: complying with divine command only after exhaustive questioning", keys: ["2:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Accusing prophets of mockery when receiving difficult commands", keys: ["2:67"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Prophet-community dynamic: messenger conveys, people resist through excessive questioning", keys: ["2:67","2:68","2:69","2:70","2:71"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0049","cand-0050"],
  notes: "Pass A pilot 5, passage 12/4. The cow narrative gives Surah Al-Baqarah its name. Contains sabbath ape-transformation as nakal. Excessive questioning pattern unique to this passage.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:18:00.000Z"
};

// Extract commands from P12
{
  // 2:67 - command via Musa: إِنَّ ٱللَّهَ يَأۡمُرُكُمۡ أَن تَذۡبَحُواْ بَقَرَةٗ
  const t67 = fv(67);
  const yamurukumIdx = t67.indexOf("\u064a\u064e\u0623\u0652\u0645\u064f\u0631\u064f\u0643\u064f\u0645\u0652");
  if (yamurukumIdx >= 0) {
    const baqaratanIdx = t67.indexOf("\u0628\u064e\u0642\u064e\u0631\u064e\u0629\u064b", yamurukumIdx);
    if (baqaratanIdx >= 0) {
      const cmdText = t67.slice(yamurukumIdx, baqaratanIdx + 6).trim();
      p12.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:67"], excerpt: cmdText, description: "Command via Musa: Allah commands you to slaughter a cow." });
    }
  }

  // 2:68 - command: فَٱفۡعَلُواْ مَا تُؤۡمَرُونَ
  const t68 = fv(68);
  const fafAAalooIdx = t68.indexOf("\u0641\u064e\u0671\u0641\u0652\u0639\u064e\u0644\u064f\u0648\u0627\u0652");
  if (fafAAalooIdx >= 0) {
    const tumaroonIdx = t68.indexOf("\u062a\u064f\u0624\u0652\u0645\u064e\u0631\u064f\u0648\u0646\u064e", fafAAalooIdx);
    if (tumaronIdx >= 0) {
      const cmdText = t68.slice(fafAAalooIdx, tumaronIdx + 8).trim();
      p12.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:68"], excerpt: cmdText, description: "Command: do what you are commanded." });
    }
  }
}

// Extract divine names from P12
{
  // Allah from 2:64
  const t64 = fv(64);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u0650", "\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t64.indexOf(form);
    if (idx >= 0) {
      p12.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:64"] });
      break;
    }
  }
}

// Extract terminology from P12
{
  // Nakal from 2:66 - نَكَٰلٗا
  const t66 = fv(66);
  const nakalanIdx = t66.indexOf("\u0646\u064e\u0643\u064e\u0627\u0644\u064b\u0627");
  if (nakalanIdx >= 0) {
    p12.terminology.push({ term: t66.slice(nakalanIdx, nakalanIdx + 6), transliteration: "nakalan", gloss: "deterrent/exemplary punishment (editorial gloss)", keys: ["2:66"] });
  }

  // MawAAithatan from 2:66 - مَوۡعِظَةٗ
  const mawAAithatanIdx = t66.indexOf("\u0645\u064e\u0648\u0652\u0639\u0650\u0638\u064e\u0629\u064b");
  if (mawAAithatanIdx >= 0) {
    p12.terminology.push({ term: t66.slice(mawAAithatanIdx, mawAAithatanIdx + 7), transliteration: "mawAAithatan", gloss: "admonition/lesson (editorial gloss)", keys: ["2:66"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p12.json"), JSON.stringify(p12, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p12.json");

// ─── Passage 13: 2:72–76 ────────────────────────────────────────────────────────
const p13 = {
  extractionId: "ext-002-p13",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 72, toAyah: 76, label: "Al-Baqarah — murder dispute resolved by striking with cow part; hearts hardened like stones; some hear Allah's word then distort it knowingly after understanding" },
  verseKeys: ["2:72","2:73","2:74","2:75","2:76"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `2:${i+72}`, text: fv(i+72) })),
  mainSubject: {
    label: "Murder case dispute among Bani Israel resolved by striking slain man with part of the cow, demonstrating Allah's power to revive the dead and show signs for reasoning; subsequent hardening of hearts becoming like or harder than stones; party among them hearing Allah's word then deliberately distorting it after understanding, while knowing",
    keys: ["2:72","2:73","2:74","2:75","2:76"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Killing a person and disputing over it", keys: ["2:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah bringing out what they were concealing", keys: ["2:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: strike him with part of it (the cow)", keys: ["2:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Thus Allah brings the dead to life and shows signs for reasoning", keys: ["2:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hearts hardened after that, like stones or harder", keys: ["2:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Some stones burst forth rivers, split open with water, fall from fear of Allah", keys: ["2:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah is not unaware of what they do", keys: ["2:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Party hearing Allah's word then distorting it after understanding, knowingly", keys: ["2:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocritical profession of faith when meeting believers", keys: ["2:76"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Private concern: sharing revelation enables believers to argue before Lord", keys: ["2:76"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  humanConditionsAndSpiritualStates: [
    { label: "Hardening of hearts (qaswat al-quloob) as spiritual deterioration after witnessing signs", keys: ["2:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deliberate distortion (tahreef) of divine word after understanding it", keys: ["2:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocrisy: professing faith publicly while concealing disbelief privately", keys: ["2:76"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0051","cand-0052"],
  notes: "Pass A pilot 5, passage 13/4. Connects cow narrative to murder resolution. Introduces tahreef (distortion) and qaswat al-quloob (hardening of hearts) as key theological concepts.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:18:00.000Z"
};

// Extract commands from P13
{
  // 2:73 - command: ٱضۡرِبُوهُ بِبَعۡضِهَا
  const t73 = fv(73);
  const idriboohuIdx = t73.indexOf("\u0671\u0636\u0652\u0631\u0650\u0628\u064f\u0648\u0647\u064f");
  if (idriboohuIdx >= 0) {
    const bibaAAdihaIdx = t73.indexOf("\u0628\u0650\u0628\u064e\u0639\u0652\u0636\u0650\u0647\u064e\u0627", idriboohuIdx);
    if (bibaAAdihaIdx >= 0) {
      const cmdText = t73.slice(idriboohuIdx, bibaAAdihaIdx + 7).trim();
      p13.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:73"], excerpt: cmdText, description: "Command: strike him (the slain man) with part of it (the cow)." });
    }
  }
}

// Extract divine names from P13
{
  // Allah from 2:73
  const t73 = fv(73);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t73.indexOf(form);
    if (idx >= 0) {
      p13.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:73"] });
      break;
    }
  }
}

// Extract terminology from P13
{
  // Qasat/qaswatan from 2:74 - قَسَتۡ قُلُوبُكُم ... قَسۡوَةٗ
  const t74 = fv(74);
  const qaswatanIdx = t74.indexOf("\u0642\u064e\u0633\u0652\u0648\u064e\u0629\u064b");
  if (qaswatanIdx >= 0) {
    p13.terminology.push({ term: t74.slice(qaswatanIdx, qaswatanIdx + 6), transliteration: "qaswatan", gloss: "hardness (of hearts) (editorial gloss)", keys: ["2:74"] });
  }

  // Yuharrifoonahu from 2:75 - يُحَرِّفُونَهُۥ
  const t75 = fv(75);
  const yuharrifoonIdx = t75.indexOf("\u064a\u064f\u062d\u064e\u0631\u0651\u0650\u0641\u064f\u0648\u0646\u064e\u0647\u064f\u0625");
  if (yuharrifoonIdx >= 0) {
    p13.terminology.push({ term: t75.slice(yuharrifoonIdx, yuharrifoonIdx + 9), transliteration: "yuharrifoonahu", gloss: "they distort it (editorial gloss)", keys: ["2:75"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p13.json"), JSON.stringify(p13, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p13.json");

// ─── Passage 14: 2:77–86 ────────────────────────────────────────────────────────
const p14 = {
  extractionId: "ext-002-p14",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 77, toAyah: 86, label: "Al-Baqarah — illiterate claiming scripture is wishful thinking; woe to those writing scripture with own hands; false claim about limited hellfire; earning evil vs faith+good deeds; Bani Israel covenant violations: killing prophets, magic, selling souls for worldly life" },
  verseKeys: ["2:77","2:78","2:79","2:80","2:81","2:82","2:83","2:84","2:85","2:86"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `2:${i+77}`, text: fv(i+77) })),
  mainSubject: {
    label: "Allah knows what they conceal and declare; unlettered among them know scripture only as wishful thinking; woe to those who write scripture with their hands claiming it is from Allah for small price; false belief in limited hellfire challenged; those who earn evil encompassed by sin are companions of Fire eternally; believers doing righteous deeds are companions of Paradise eternally; renewed covenant with Bani Israel: worship Allah alone, goodness to parents/relatives/orphans/needy, speak well, establish prayer, give zakah — yet they turned away except few; covenant against shedding blood and evicting from homes acknowledged yet violated; killing own people, evicting them, cooperating in sin, ransoming captives while eviction forbidden; believing in part of scripture and disbelieving in part; disgrace in worldly life and severest punishment in Hereafter; buying worldly life for Hereafter with no lightened punishment or aid",
    keys: ["2:77","2:78","2:79","2:80","2:81","2:82","2:83","2:84","2:85","2:86"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Allah knows what they conceal and declare", keys: ["2:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Unlettered (ummiyyoon) knowing scripture only as wishful thinking (amaniyy)", keys: ["2:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Woe to those writing scripture with own hands then claiming divine origin for small price", keys: ["2:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False claim: fire will touch us only for numbered days", keys: ["2:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge: have you taken covenant with Allah, or saying about Allah what you don't know?", keys: ["2:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Whoever earns evil encompassed by sin: companions of Fire eternally", keys: ["2:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those who believe and do righteous deeds: companions of Paradise eternally", keys: ["2:82"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant with Bani Israel: worship none but Allah", keys: ["2:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant: goodness to parents, relatives, orphans, needy", keys: ["2:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant: speak good words to people", keys: ["2:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant: establish prayer and give zakah", keys: ["2:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "They turned away except few, refusing", keys: ["2:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant against shedding each other's blood and evicting from homes", keys: ["2:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "They acknowledged covenant while witnessing", keys: ["2:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yet killing each other and evicting party from homes", keys: ["2:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cooperating against own people in sin and aggression", keys: ["2:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ransoming captives while their eviction was forbidden", keys: ["2:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believing in part of scripture, disbelieving in part", keys: ["2:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Recompense: disgrace in worldly life, severest punishment on Day of Resurrection", keys: ["2:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah not unaware of what they do", keys: ["2:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Buying worldly life for Hereafter: no lightened punishment, no aid", keys: ["2:86"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  humanConditionsAndSpiritualStates: [
    { label: "Wishful thinking (amaniyy) substituting for genuine scriptural knowledge", keys: ["2:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fabrication of scripture for worldly gain", keys: ["2:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False sense of security regarding divine punishment", keys: ["2:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Selective belief: accepting part of scripture while rejecting part", keys: ["2:85"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Writing false scripture for monetary gain as religious-economic corruption", keys: ["2:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Internal violence: killing and eviction within covenant community", keys: ["2:84","2:85"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Covenant obligations toward parents, relatives, orphans, needy, and general society", keys: ["2:83"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0053","cand-0054","cand-0055","cand-0056"],
  notes: "Pass A pilot 5, passage 14/4. Comprehensive indictment of Bani Israel's covenant violations. Contains ummiyyoon/amaniyy distinction, fabricating scripture, selective belief concept, and dual eternal outcomes.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:18:00.000Z"
};

// Extract commands/prohibitions from P14
{
  // 2:83 - prohibition: لَا تَعۡبُدُونَ إِلَّا ٱللَّهَ
  const t83 = fv(83);
  const laTaAAbudooIdx = t83.indexOf("\u0644\u064e\u0627 \u062a\u064e\u0639\u0652\u0628\u064f\u062f\u064f\u0648\u0646\u064e");
  if (laTaAAbudooIdx >= 0) {
    const illaAllahIdx = t83.indexOf("\u0625\u0650\u0644\u064e\u0651\u0627 \u0671\u0644\u0644\u064e\u0651\u0647\u064e", laTaAAbudooIdx);
    if (illaAllahIdx >= 0) {
      const prohText = t83.slice(laTaAAbudooIdx, illaAllahIdx + 10).trim();
      p14.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:83"], excerpt: prohText, description: "Prohibition: do not worship except Allah." });
    }
  }

  // 2:83 - command: وَأَقِيمُواْ ٱلصَّلَوٰةَ
  const aqeemooIdx = t83.indexOf("\u0648\u064e\u0623\u064e\u0642\u0650\u064a\u0645\u064f\u0648\u0627\u0652");
  if (aqeemooIdx >= 0) {
    const salataIdx = t83.indexOf("\u0671\u0644\u0635\u064e\u0651\u0644\u064e\u0648\u064e\u0629\u064e", aqeemooIdx);
    if (salataIdx >= 0) {
      const cmdText = t83.slice(aqeemooIdx, salataIdx + 8).trim();
      p14.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:83"], excerpt: cmdText, description: "Command: establish prayer." });
    }
  }

  // 2:83 - command: وَءَاتُواْ ٱلزَّكَوٰةَ
  const aatooIdx = t83.indexOf("\u0648\u064e\u0621\u064e\u0627\u062a\u064f\u0648\u0627\u0652");
  if (aatooIdx >= 0) {
    const zakataIdx = t83.indexOf("\u0671\u0644\u0632\u064e\u0651\u0643\u064e\u0648\u064e\u0629\u064e", aatooIdx);
    if (zakataIdx >= 0) {
      const cmdText = t83.slice(aatooIdx, zakataIdx + 8).trim();
      p14.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:83"], excerpt: cmdText, description: "Command: give zakah." });
    }
  }

  // 2:84 - prohibition: لَا تَسۡفِكُونَ دِمَآءَكُمۡ
  const t84 = fv(84);
  const laTasfikooIdx = t84.indexOf("\u0644\u064e\u0627 \u062a\u064e\u0633\u0652\u0641\u0650\u0643\u064f\u0648\u0646\u064e");
  if (laTasfikooIdx >= 0) {
    const dimaakumIdx = t84.indexOf("\u062f\u0650\u0645\u064e\u0627\u0621\u064e\u0643\u064f\u0645\u0652", laTasfikooIdx);
    if (dimaakumIdx >= 0) {
      const prohText = t84.slice(laTasfikooIdx, dimaakumIdx + 8).trim();
      p14.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:84"], excerpt: prohText, description: "Prohibition: do not shed each other's blood." });
    }
  }
}

// Extract divine names from P14
{
  // Allah from 2:77
  const t77 = fv(77);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t77.indexOf(form);
    if (idx >= 0) {
      p14.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:77"] });
      break;
    }
  }
}

// Extract terminology from P14
{
  // Ummiyyoon from 2:78 - أُمِّيُّونَ
  const t78 = fv(78);
  const ommiyyoonIdx = t78.indexOf("\u0623\u064f\u0645\u0651\u0650\u064a\u0651\u064f\u0648\u0646\u064e");
  if (ommiyyoonIdx >= 0) {
    p14.terminology.push({ term: t78.slice(ommiyyoonIdx, ommiyyoonIdx + 7), transliteration: "ummiyyoon", gloss: "unlettered/those who do not know scripture (editorial gloss)", keys: ["2:78"] });
  }

  // Amaniyy from 2:78 - أَمَانِيَّ
  const amaniyyIdx = t78.indexOf("\u0623\u064e\u0645\u064e\u0627\u0646\u0650\u064a\u0651\u064e");
  if (amaniyyIdx >= 0) {
    p14.terminology.push({ term: t78.slice(amaniyyIdx, amaniyyIdx + 6), transliteration: "amaniyy", gloss: "wishful thinking/unfounded hopes (editorial gloss)", keys: ["2:78"] });
  }

  // Meethaq from 2:83 - مِيثَٰقَ
  const t83 = fv(83);
  const meethaqIdx83 = t83.indexOf("\u0645\u0650\u064a\u062b\u064e\u0627\u0642\u064e");
  if (meethaqIdx83 >= 0) {
    p14.terminology.push({ term: t83.slice(meethaqIdx83, meethaqIdx83 + 7), transliteration: "meethaq", gloss: "covenant (editorial gloss)", keys: ["2:83"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p14.json"), JSON.stringify(p14, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p14.json");

// ─── Candidates batch (cand-0047 through cand-0056) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: "2026-11-18T16:18:00.000Z",
  sourceExtraction: "ext-002-p11,ext-002-p12,ext-002-p13,ext-002-p14",
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
    createdAt: "2026-11-18T16:18:00.000Z"
  };
  if (arabicLabel) c.arabicLabel = arabicLabel;
  if (urduLabel) c.urduLabel = urduLabel;
  if (notes) c.notes = notes;
  return c;
}

// cand-0047: Universal salvation criteria across communities
candidates.candidates.push(makeCand("cand-0047",
  "Universal salvation criteria: faith in Allah, Last Day, and righteous deeds across communities",
  undefined, "\u0639\u0627\u0644\u0645\u06cc \u0646\u062c\u0627\u062a \u06a9\u06d2 \u0645\u0639\u06cc\u0627\u0631\u0627\u062a",
  "In 2:62: believers, Jews, Christians, and Sabians who believe in Allah and the Last Day and do righteous deeds receive reward with no fear or grief — establishing salvation criteria based on faith and action rather than communal identity alone.",
  [{ key: "2:62", excerpt: fv(62), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse enumerates four communities and establishes universal salvation criteria." }],
  [],
  "Gap candidate: ecumenical salvation principle distinct from interfaith dialogue. Addresses whether pre-Islamic adherents of other faiths can attain salvation."
));

// cand-0048: Covenant at Mount Sinai with raising of the mountain
candidates.candidates.push(makeCand("cand-0048",
  "Covenant at Mount Sinai: raising the mountain and commanding firm adherence to scripture",
  undefined, "\u0637\u0648\u0631 \u0633\u06cc\u0646\u0627 \u067e\u0631 \u0639\u06c1\u062f",
  "In 2:63: Allah took covenant from Bani Israel, raised Mount Sinai above them, and commanded them to take what was given with strength and remember its contents for taqwa.",
  [{ key: "2:63", excerpt: fv(63), evidenceClass: "EXPLICIT_TEXT", rationale: "Verse describes covenant-taking, mountain-raising, and dual command." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "same-concept" }]
));

// cand-0049: Sabbath transgression and transformation into apes
candidates.candidates.push(makeCand("cand-0049",
  "Sabbath transgression: transformation into despised apes as deterrent punishment",
  undefined, "\u0633\u0628\u062a \u06a9\u06cc \u062e\u0644\u0627\u0641 \u0648\u0631\u0632\u06cc \u0627\u0648\u0631 \u0628\u0646\u062f\u0631 \u0628\u0646\u0646\u0627",
  "In 2:65-66: those who transgressed the sabbath were told 'be apes, despised' — made as nakal (deterrent) for contemporaries and successors, and mawAAithatan (admonition) for the muttaqeen.",
  [{ key: "2:65", excerpt: fv(65), evidenceClass: "EXPLICIT_TEXT", rationale: "Describes sabbath transgression and transformation command." },
   { key: "2:66", excerpt: fv(66), evidenceClass: "EXPLICIT_TEXT", rationale: "Describes purpose as deterrent and admonition." }],
  [{ topicId: "musa-story", layer: "scholarly", relationship: "related-not-identical" }],
  "Distinct from general covenant-breaking: specific sabbath violation with unique punitive transformation."
));

// cand-0050: Excessive questioning leading to difficulty in obedience
candidates.candidates.push(makeCand("cand-0050",
  "Excessive questioning making divine commands burdensome: the cow narrative",
  undefined, "\u0636\u0631\u0648\u0631\u062a \u0633\u06d2 \u0632\u06cc\u0627\u062f\u06c1 \u0633\u0648\u0627\u0644\u0627\u062a",
  "In 2:67-71: Bani Israel asked repeatedly about the cow's attributes despite a simple initial command, making compliance increasingly specific and difficult until they barely managed to fulfill it.",
  [{ key: "2:67", excerpt: fv(67), evidenceClass: "EXPLICIT_TEXT", rationale: "Initial command and accusation of ridicule." },
   { key: "2:71", excerpt: fv(71), evidenceClass: "EXPLICIT_TEXT", rationale: "Final compliance described as barely done." }],
  [],
  "Gap candidate: behavioral pattern of making religion difficult through unnecessary detail-seeking."
));

// cand-0051: Hardening of hearts after witnessing signs
candidates.candidates.push(makeCand("cand-0051",
  "Hardening of hearts (qaswat al-quloob) after witnessing divine signs",
  undefined, "\u062f\u0644\u0648\u06ba \u06a9\u0627 \u0633\u062e\u062a \u06c1\u0648\u0646\u0627",
  "In 2:74: after witnessing revival through the cow, hearts became hardened like stones or even harder — contrasted with stones that burst forth rivers, split with water, or fall from fear of Allah.",
  [{ key: "2:74", excerpt: fv(74), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse describes heart-hardening and stone comparison." }],
  [],
  "Gap candidate: spiritual deterioration mechanism following exposure to clear signs."
));

// cand-0052: Deliberate distortion of divine word after understanding
candidates.candidates.push(makeCand("cand-0052",
  "Deliberate distortion (tahreef) of Allah's word after understanding it",
  undefined, "\u06a9\u0644\u0627\u0645 \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u062a\u062d\u0631\u06cc\u0641",
  "In 2:75: a party among them hears Allah's word, understands it, then deliberately distorts it while knowing — establishing tahreef as conscious post-comprehension alteration.",
  [{ key: "2:75", excerpt: fv(75), evidenceClass: "EXPLICIT_TEXT", rationale: "Verse explicitly describes hearing, understanding, then distorting knowingly." }],
  [{ topicId: "evidence-standards", layer: "scholarly", relationship: "related-not-identical" }],
  "Key theological concept: distinguishes honest misunderstanding from deliberate post-understanding distortion."
));

// cand-0053: Fabricating scripture for worldly gain
candidates.candidates.push(makeCand("cand-0053",
  "Writing false scripture with own hands and attributing it to Allah for worldly gain",
  undefined, "\u0622\u067e \u06c1\u0627\u062a\u06be \u0633\u06d2 \u06a9\u062a\u0627\u0628\u062a \u06a9\u0631 \u06a9\u06d2 \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u0637\u0631\u0641 \u0645\u0646\u0633\u0648\u0628 \u06a9\u0631\u0646\u0627",
  "In 2:79: woe to those who write scripture with their own hands then say 'this is from Allah' to exchange it for a small price — double woe for what hands wrote and what they earn.",
  [{ key: "2:79", excerpt: fv(79), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse condemns fabrication and its motivation." }],
  [],
  "Gap candidate: specific category of religious fraud combining authorship deception with financial motive."
));

// cand-0054: Selective belief in scripture
candidates.candidates.push(makeCand("cand-0054",
  "Believing in part of scripture while disbelieving in part",
  undefined, "\u06a9\u062a\u0627\u0628 \u06a9\u06d2 \u0628\u0639\u0636 \u067e\u0631 \u0627\u06cc\u0645\u0627\u0646 \u0627\u0648\u0631 \u0628\u0639\u0636 \u06a9\u0627 \u0627\u0646\u06a9\u0627\u0631",
  "In 2:85: rhetorical question challenging those who believe in part of al-kitab and disbelieve in part — identified as cause of disgrace in worldly life and severest punishment in Hereafter.",
  [{ key: "2:85", excerpt: fv(85), evidenceClass: "EXPLICIT_TEXT", rationale: "Verse poses direct challenge about selective belief and states consequences." }],
  [],
  "Gap candidate: addresses partial acceptance of revelation as distinct from total rejection."
));

// cand-0055: Internal violence within covenant community
candidates.candidates.push(makeCand("cand-0055",
  "Killing and evicting own people despite covenant prohibition",
  undefined, "\u0639\u06c1\u062f \u06a9\u06d2 \u0628\u0627\u0648\u062c\u0648\u062f \u0622\u067e\u0633 \u0645\u06cc\u06ba \u0642\u062a\u0644 \u0627\u0648\u0631 \u0628\u06cc\u062f\u062e\u0644\u06cc",
  "In 2:84-85: covenant prohibited shedding blood and eviction, acknowledged while witnessing, yet violated through killing, eviction, cooperation in sin/aggression, and paradoxically ransoming captives whose eviction was forbidden.",
  [{ key: "2:84", excerpt: fv(84), evidenceClass: "EXPLICIT_TEXT", rationale: "Covenant terms stated." },
   { key: "2:85", excerpt: fv(85), evidenceClass: "EXPLICIT_TEXT", rationale: "Violations enumerated including contradictory behavior." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "same-concept" }],
  "Highlights internal communal violence as covenant violation distinct from external conflict."
));

// cand-0056: Buying worldly life for Hereafter
candidates.candidates.push(makeCand("cand-0056",
  "Buying worldly life in exchange for the Hereafter",
  undefined, "\u062f\u0646\u06cc\u0627 \u06a9\u0648 \u0622\u062e\u0631\u062a \u067e\u0631 \u062a\u0631\u062c\u06cc\u062d \u062f\u06cc\u0646\u0627",
  "In 2:86: those who bought (ishtaraw) the worldly life for the Hereafter face unlightened punishment and no aid — framing worldly preference as a transactional exchange with eternal consequences.",
  [{ key: "2:86", excerpt: fv(86), evidenceClass: "EXPLICIT_TEXT", rationale: "Verse uses commercial metaphor (ishtaraw) for eschatological trade-off." }],
  [{ topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" }],
  "Contrasts with divine mercy theme: this passage emphasizes absence of mitigation for deliberate worldly preference."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-005.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-005.json with ${candidates.candidates.length} candidates`);

console.log("\nDone. Run validator to confirm.");
