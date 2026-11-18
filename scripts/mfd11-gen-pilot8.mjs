// MFD-11 Pilot 8 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Baqarah 2:124-152 (Passages 21-24, Candidates cand-0077..cand-0086).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "002-0124-0152.json");
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

console.log("Generating pilot 8 files from verbatim corpus (2:124-152)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

// ─── Passage 21: 2:124–129 ────────────────────────────────────────────────────────
const p21 = {
  extractionId: "ext-002-p21",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 124, toAyah: 129, label: "Al-Baqarah — Ibrahim tested by Rabb with kalimāt and fulfilled them; appointed imam for people; covenant does not include wrongdoers; House made place of return and security; take maqam Ibrahim as musalla; covenant with Ibrahim and Ismail to purify House for taaifeen, aakifeen, rukkaAA sujud; Ibrahim's prayer for secure city and provision; whoever disbelieves enjoys briefly then forced to Fire; Ibrahim and Ismail raising foundations praying acceptance; Allah sameeAA aleem; prayer to be muslimayn and Muslim ummah; show us manasik and accept repentance; Allah tawwab raheem; prayer for messenger from among them reciting ayat, teaching kitab and hikmah, purifying; Allah azeez hakeem" },
  verseKeys: ["2:124","2:125","2:126","2:127","2:128","2:129"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `2:${i+124}`, text: fv(i+124) })),
  mainSubject: {
    label: "Ibrahim tested by his Lord with commands and fulfilled them; appointed imam for mankind; covenant excludes wrongdoers; Kaaba made place of return and security; maqam Ibrahim as prayer station; Ibrahim and Ismail charged to purify House for pilgrims; Ibrahim prayed for secure city and provision for believers; disbelievers granted brief enjoyment then punishment; Ibrahim and Ismail raised foundations praying acceptance; supplication to be Muslims and have Muslim descendants; request to be shown rites and receive repentance; prayer for messenger from among them to teach Book, wisdom, and purification",
    keys: ["2:124","2:125","2:126","2:127","2:128","2:129"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Ibrahim tested with kalimāt and fulfilled them", keys: ["2:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Appointment as imam for mankind", keys: ["2:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant does not include zalimeen", keys: ["2:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kaaba as mathabah and amn for people", keys: ["2:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Maqam Ibrahim as musalla", keys: ["2:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Purification of House for taaifeen, aakifeen, rukkaAA sujud", keys: ["2:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim's dua for balad amin and rizq from thamarat", keys: ["2:126"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbeliever granted brief enjoyment then Fire", keys: ["2:126"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim and Ismail raising qawaAAid of House", keys: ["2:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dua: rabbana taqabbal minna", keys: ["2:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah sameeAA aleem", keys: ["2:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dua: make us muslimayn and Muslim ummah", keys: ["2:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dua: show us manasikana and accept repentance", keys: ["2:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah tawwab raheem", keys: ["2:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dua: send messenger reciting ayat, teaching kitab and hikmah, purifying", keys: ["2:129"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah azeez hakeem", keys: ["2:129"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Ibrahim tested with commands and fulfilled them; appointed imam", keys: ["2:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim and Ismail building Kaaba and purifying it", keys: ["2:125","2:127"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0077","cand-0078","cand-0079"],
  notes: "Pass A pilot 8, passage 21/4. Foundation narrative of imamah, Kaaba construction, and Ibrahim's supplications. Contains three taught supplications (taught-supplication class). Links to ibrahim-story topic.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:45:00.000Z"
};

// Extract commands/supplications from P21
{
  // 2:125 - وَٱتَّخِذُواْ مِن مَّقَامِ إِبۡرَٰهِـۧمَ مُصَلّٗى
  const t125 = fv(125);
  const waittakhithooIdx = t125.indexOf("\u0648\u064e\u0671\u062a\u0651\u064e\u062e\u0650\u0630\u064f\u0648\u0627\u0652");
  if (waittakhithooIdx >= 0) {
    const musallanEnd = t125.indexOf("\u0645\u064f\u0635\u064e\u0644\u0651\u064b\u0649", waittakhithooIdx);
    if (musallanEnd >= 0) {
      const cmdText = t125.slice(waittakhithooIdx, musallanEnd + 6).trim();
      p21.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:125"], excerpt: cmdText, description: "Command: take from the standing place of Ibrahim a place of prayer." });
    }
  }

  // 2:127 - رَبَّنَا تَقَبَّلۡ مِنَّآ (taught supplication)
  const t127 = fv(127);
  const rabbana127Idx = t127.indexOf("\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627");
  if (rabbana127Idx >= 0) {
    const minnaEnd = t127.indexOf("\u0645\u0650\u0646\u0651\u064e\u0627", rabbana127Idx);
    if (minnaEnd >= 0) {
      const supText = t127.slice(rabbana127Idx, minnaEnd + 5).trim();
      p21.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["2:127"], excerpt: supText, description: "Taught supplication: Our Lord, accept from us." });
    }
  }

  // 2:128 - رَبَّنَا وَٱجۡعَلۡنَا مُسۡلِمَيۡنِ لَكَ (taught supplication)
  const t128 = fv(128);
  const rabbana128Idx = t128.indexOf("\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627");
  if (rabbana128Idx >= 0) {
    // Use full verse as excerpt for safety
    p21.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["2:128"], excerpt: fv(128), description: "Taught supplication: Our Lord, make us Muslims to You and from our descendants a Muslim nation; show us our rites and accept our repentance." });
  }

  // 2:129 - رَبَّنَا وَٱبۡعَثۡ فِيهِمۡ رَسُولٗا (taught supplication)
  const t129 = fv(129);
  const rabbana129Idx = t129.indexOf("\u0631\u064e\u0628\u0651\u064e\u0646\u064e\u0627");
  if (rabbana129Idx >= 0) {
    p21.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["2:129"], excerpt: fv(129), description: "Taught supplication: Our Lord, send among them a messenger reciting Your verses, teaching the Book and wisdom, and purifying them." });
  }
}

// Extract divine names from P21
{
  // As-SameeAA Al-Aleem from 2:127
  const t127 = fv(127);
  const sameeAAIdx = t127.indexOf("\u0671\u0644\u0633\u0651\u064e\u0645\u0650\u064a\u0639\u064f \u0671\u0644\u0652\u0639\u064e\u0644\u0650\u064a\u0645\u064f");
  if (sameeAAIdx >= 0) {
    p21.divineNamesAndAttributes.push({ term: t127.slice(sameeAAIdx, sameeAAIdx + 17), transliteration: "As-Samee' Al-Aleem", gloss: "The Hearing, The Knowing (editorial gloss)", keys: ["2:127"] });
  }

  // At-Tawwab Ar-Raheem from 2:128
  const t128 = fv(128);
  const tawwabIdx = t128.indexOf("\u0671\u0644\u062a\u0651\u064e\u0648\u0651\u064e\u0627\u0628\u064f \u0671\u0644\u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064f");
  if (tawwabIdx >= 0) {
    p21.divineNamesAndAttributes.push({ term: t128.slice(tawwabIdx, tawwabIdx + 17), transliteration: "At-Tawwab Ar-Raheem", gloss: "The Accepting of Repentance, The Merciful (editorial gloss)", keys: ["2:128"] });
  }

  // Al-Azeez Al-Hakeem from 2:129
  const t129 = fv(129);
  const azeezIdx = t129.indexOf("\u0671\u0644\u0652\u0639\u064e\u0632\u0650\u064a\u0632\u064f \u0671\u0644\u0652\u062d\u064e\u0643\u0650\u064a\u0645\u064f");
  if (azeezIdx >= 0) {
    p21.divineNamesAndAttributes.push({ term: t129.slice(azeezIdx, azeezIdx + 15), transliteration: "Al-Azeez Al-Hakeem", gloss: "The Exalted in Might, The Wise (editorial gloss)", keys: ["2:129"] });
  }
}

// Extract terminology from P21
{
  // Imam from 2:124
  const t124 = fv(124);
  const imamIdx = t124.indexOf("\u0625\u0650\u0645\u064e\u0627\u0645\u064b\u0627");
  if (imamIdx >= 0) {
    p21.terminology.push({ term: t124.slice(imamIdx, imamIdx + 6), transliteration: "imaman", gloss: "leader/imam (editorial gloss)", keys: ["2:124"] });
  }

  // Mathabah from 2:125
  const t125 = fv(125);
  const mathabahIdx = t125.indexOf("\u0645\u064e\u062b\u064e\u0627\u0628\u064e\u0629\u064b");
  if (mathabahIdx >= 0) {
    p21.terminology.push({ term: t125.slice(mathabahIdx, mathabahIdx + 7), transliteration: "mathabatan", gloss: "place of return/gathering (editorial gloss)", keys: ["2:125"] });
  }

  // Manasik from 2:128
  const t128 = fv(128);
  const manasikIdx = t128.indexOf("\u0645\u064e\u0646\u064e\u0627\u0633\u0650\u0643\u064e\u0646\u064e\u0627");
  if (manasikIdx >= 0) {
    p21.terminology.push({ term: t128.slice(manasikIdx, manasikIdx + 9), transliteration: "manasikana", gloss: "our rites/ceremonies (editorial gloss)", keys: ["2:128"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p21.json"), JSON.stringify(p21, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p21.json");

// ─── Passage 22: 2:130–135 ────────────────────────────────────────────────────────
const p22 = {
  extractionId: "ext-002-p22",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 130, toAyah: 135, label: "Al-Baqarah — who turns away from millat Ibrahim except fooling himself; chosen in dunya and among saliheen in akhirah; Ibrahim told aslim, replied aslamtu lirabb al-aalameen; willed to sons and Yaqoob; Allah chose deen so do not die except as Muslims; were you witnesses when death came to Yaqoob; sons testified worship One God of fathers; that ummah has passed; each earns own deeds; not asked about what they did; People of Book say be Jews or Christians for guidance; say rather millat Ibrahim hanifan not of mushrikeen" },
  verseKeys: ["2:130","2:131","2:132","2:133","2:134","2:135"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `2:${i+130}`, text: fv(i+130) })),
  mainSubject: {
    label: "Millat Ibrahim as the only valid path; turning away is self-delusion; Ibrahim chosen in this world and righteous in hereafter; submission dialogue between Rabb and Ibrahim; testament to children and Yaqoob to die as Muslims; Yaqoob's deathbed testimony of tawheed; past nations accountable for own deeds; rejection of exclusive Jewish/Christian salvation claims in favor of millat Ibrahim hanifan",
    keys: ["2:130","2:131","2:132","2:133","2:134","2:135"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Turning from millat Ibrahim = self-foolishness", keys: ["2:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim istafaynahu in dunya and salihin in akhirah", keys: ["2:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine command aslim and Ibrahim's response aslamtu", keys: ["2:131"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wasiyyah to sons and Yaqoob: chosen deen, die as Muslims", keys: ["2:132"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yaqoob's deathbed question and sons' tawheed testimony", keys: ["2:133"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Past ummah: each reaps what it earned; no cross-accountability", keys: ["2:134"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rejection: be Jews or Christians for guidance", keys: ["2:135"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Affirmation: millat Ibrahim hanifan, not of mushrikeen", keys: ["2:135"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Ibrahim's submission dialogue: aslim / aslamtu lirabb al-aalameen", keys: ["2:131"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Yaqoob's deathbed testament and sons' testimony of tawheed", keys: ["2:133"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Self-delusion (safih nafsahu) in rejecting millat Ibrahim", keys: ["2:130"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0080","cand-0081"],
  notes: "Pass A pilot 8, passage 22/4. Defines millat Ibrahim as universal creed. Deathbed testimonies establish continuity of tawheed across generations. Individual accountability principle in 2:134.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:45:00.000Z"
};

// Extract terminology from P22
{
  // Millat Ibrahim from 2:130
  const t130 = fv(130);
  const millatIdx = t130.indexOf("\u0645\u0650\u0644\u0651\u064e\u0629\u0650 \u0625\u0650\u0628\u0652\u0631\u064e\u0670\u0647\u0650\u064a\u0645\u064e");
  if (millatIdx >= 0) {
    p22.terminology.push({ term: t130.slice(millatIdx, millatIdx + 14), transliteration: "millati ibraheema", gloss: "religion/creed of Ibrahim (editorial gloss)", keys: ["2:130"] });
  }

  // Hanif from 2:135
  const t135 = fv(135);
  const hanifIdx = t135.indexOf("\u062d\u064e\u0646\u0650\u064a\u0641\u064b\u0627");
  if (hanifIdx >= 0) {
    p22.terminology.push({ term: t135.slice(hanifIdx, hanifIdx + 6), transliteration: "haneefan", gloss: "inclining toward truth, upright monotheist (editorial gloss)", keys: ["2:135"] });
  }
}

// Extract divine names from P22
{
  // Rabb al-aalameen from 2:131
  const t131 = fv(131);
  const rabbAlameenIdx = t131.indexOf("\u0644\u0650\u0631\u064e\u0628\u0651\u0650 \u0671\u0644\u0652\u0639\u064e\u0670\u0644\u064e\u0645\u0650\u064a\u0646\u064e");
  if (rabbAlameenIdx >= 0) {
    p22.divineNamesAndAttributes.push({ term: t131.slice(rabbAlameenIdx, rabbAlameenIdx + 16), transliteration: "Rabb al-Aalameen", gloss: "Lord of the Worlds (editorial gloss)", keys: ["2:131"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p22.json"), JSON.stringify(p22, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p22.json");

// ─── Passage 23: 2:136–141 ────────────────────────────────────────────────────────
const p23 = {
  extractionId: "ext-002-p23",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 136, toAyah: 141, label: "Al-Baqarah — say we believe in Allah and what was revealed to us and to Ibrahim, Ismail, Ishaq, Yaqoob, asbaat, Musa, Isa, and prophets; no distinction between them; we are Muslims to Him; if they believe like you they are guided; if they turn away they are in shiqaaq; Allah suffices against them; sibghat Allah; who better than Allah in sibghah; we are aabidoon; do you argue about Allah who is our Rabb and your Rabb; our deeds ours, yours yours; we are mukhlisoon; do you say Ibrahim etc were Jews or Christians; are you more knowing or Allah; who more unjust than concealing shahadah from Allah; Allah not ghafil; that ummah has passed; each earns own; not asked about their deeds" },
  verseKeys: ["2:136","2:137","2:138","2:139","2:140","2:141"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `2:${i+136}`, text: fv(i+136) })),
  mainSubject: {
    label: "Declaration of faith in all revelations without distinction; belief criterion: if they believe similarly they are guided, otherwise in dissension; Allah sufficient protector; sibghat Allah as best religion; rejection of argument about Allah who is shared Rabb; each community owns its deeds; sincerity to Allah; refutation of claim that patriarchs were Jews or Christians; Allah more knowing; concealing divine testimony is gravest injustice; individual accountability of past nations",
    keys: ["2:136","2:137","2:138","2:139","2:140","2:141"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Comprehensive iman declaration: all revelations, no distinction", keys: ["2:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "We are Muslims to Him", keys: ["2:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Belief match = guidance; rejection = shiqaaq", keys: ["2:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yakfeekahum: divine sufficiency against opponents", keys: ["2:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sibghat Allah: divine coloring/religion", keys: ["2:138"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Who better than Allah in sibghah", keys: ["2:138"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not argue about Allah who is shared Rabb", keys: ["2:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Our deeds ours, yours yours; mukhlisoon", keys: ["2:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Refutation: patriarchs were not Jews or Christians", keys: ["2:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Are you more knowing or Allah?", keys: ["2:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Concealing shahadah from Allah = greatest zulm", keys: ["2:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Individual accountability: past ummah earned its own", keys: ["2:141"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Sincerity (ikhlas) as defining posture toward Allah", keys: ["2:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Concealing known truth as moral failure", keys: ["2:140"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0082","cand-0083"],
  notes: "Pass A pilot 8, passage 23/4. Core interfaith creed statement. Sibghat Allah concept unique to this verse. Repeated individual accountability formula from 2:134.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:45:00.000Z"
};

// Extract commands from P23
{
  // 2:136 - قُولُوٓاْ ءَامَنَّا بِٱللَّهِ
  const t136 = fv(136);
  const qoolooIdx = t136.indexOf("\u0642\u064f\u0648\u0644\u064f\u0648\u0622");
  if (qoolooIdx >= 0) {
    p23.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:136"], excerpt: fv(136), description: "Command: Say we believe in Allah and all revelations without distinction." });
  }
}

// Extract terminology from P23
{
  // Sibghat Allah from 2:138
  const t138 = fv(138);
  const sibghatIdx = t138.indexOf("\u0635\u0650\u0628\u0652\u063a\u064e\u0629\u064e \u0671\u0644\u0644\u0651\u064e\u0647\u0650");
  if (sibghatIdx >= 0) {
    p23.terminology.push({ term: t138.slice(sibghatIdx, sibghatIdx + 11), transliteration: "sibghata Allah", gloss: "coloring/religion of Allah (editorial gloss)", keys: ["2:138"] });
  }

  // Mukhlisoon from 2:139
  const t139 = fv(139);
  const mukhlisoonIdx = t139.indexOf("\u0645\u064f\u062e\u0652\u0644\u0650\u0635\u064f\u0648\u0646\u064e");
  if (mukhlisoonIdx >= 0) {
    p23.terminology.push({ term: t139.slice(mukhlisoonIdx, mukhlisoonIdx + 8), transliteration: "mukhlisoon", gloss: "sincere ones (editorial gloss)", keys: ["2:139"] });
  }

  // Shahadah from 2:140
  const t140 = fv(140);
  const shahadahIdx = t140.indexOf("\u0634\u064e\u0647\u064e\u0670\u062f\u064e\u0629\u064b");
  if (shahadahIdx >= 0) {
    p23.terminology.push({ term: t140.slice(shahadahIdx, shahadahIdx + 7), transliteration: "shahadatan", gloss: "testimony (editorial gloss)", keys: ["2:140"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p23.json"), JSON.stringify(p23, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p23.json");

// ─── Passage 24: 2:142–152 ────────────────────────────────────────────────────────
const p24 = {
  extractionId: "ext-002-p24",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 142, toAyah: 152, label: "Al-Baqarah — fools will ask what turned them from qiblah; east and west belong to Allah; He guides whom He wills to straight path; made you ummatan wasatan as witnesses over people and Messenger witness over you; previous qiblah test to distinguish followers from those turning back; difficult except for guided; Allah would not waste your iman; Allah raoof raheem; seen turning of face toward heaven; will turn to qiblah you are pleased with; turn face toward Masjid al-Haram; wherever you are turn faces toward it; People of Book know it is truth from Rabb; even with every sign they won't follow your qiblah; following desires after knowledge makes you among wrongdoers; People of Book recognize him as own sons; party conceals truth knowingly; truth from Rabb do not be among doubters; each has direction; race to good deeds; Allah gathers all; turn face toward Masjid al-Haram from wherever you set out; so people have no hujjah except wrongdoers; fear Me not them; complete niAAmah; perhaps you will be guided; sent messenger reciting ayat, purifying, teaching kitab and hikmah and what you did not know; remember Me I remember you; be grateful do not deny" },
  verseKeys: ["2:142","2:143","2:144","2:145","2:146","2:147","2:148","2:149","2:150","2:151","2:152"],
  arabicExcerpts: Array.from({length:11}, (_,i) => ({ key: `2:${i+142}`, text: fv(i+142) })),
  mainSubject: {
    label: "Qibla change narrative: fools question the change; east and west belong to Allah; ummatan wasatan established as witnesses; qiblah change as test of obedience; difficulty eased for the guided; Allah preserves iman; Prophet's longing for Kaaba answered; command to face Masjid al-Haram universally; People of Book recognize truth but some conceal it; following desires after knowledge = wrongdoing; each community has direction so race to good; Allah gathers all for judgment; repeated qiblah command to remove people's argument; completion of niAAmah; sending of messenger for recitation, purification, teaching; mutual remembrance between Allah and believers; gratitude commanded, ingratitude prohibited",
    keys: ["2:142","2:143","2:144","2:145","2:146","2:147","2:148","2:149","2:150","2:151","2:152"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Fools question qiblah change", keys: ["2:142"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mashriq and maghrib belong to Allah", keys: ["2:142"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ummatan wasatan: just/middle community as witnesses", keys: ["2:143"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Previous qiblah as test distinguishing followers from reverters", keys: ["2:143"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Qiblah change difficult except for guided", keys: ["2:143"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah would not waste your iman", keys: ["2:143"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah raoof raheem", keys: ["2:143"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet's face turning toward heaven noted; new qiblah promised", keys: ["2:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: turn face toward Masjid al-Haram", keys: ["2:144","2:149","2:150"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People of Book know it is truth from Rabb", keys: ["2:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Even with every sign People of Book won't follow your qiblah", keys: ["2:145"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Following desires after knowledge = zalimeen", keys: ["2:145"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People of Book recognize him as own sons", keys: ["2:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Party conceals truth knowingly", keys: ["2:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Truth from Rabb; do not be among mumtareen", keys: ["2:147"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Each has wijhah; race to khayrat", keys: ["2:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah gathers all; ala kulli shayin qadeer", keys: ["2:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remove people's hujjah except wrongdoers", keys: ["2:150"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear Me not them; complete niAAmah; guidance", keys: ["2:150"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger sent: reciting, purifying, teaching kitab, hikmah, unknown", keys: ["2:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remember Me I remember you", keys: ["2:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Be grateful; do not deny", keys: ["2:152"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Messenger sent from among believers: reciting, purifying, teaching", keys: ["2:151"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Mutual remembrance: fadhkuroonee adhkurkum", keys: ["2:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gratitude as obligation paired with prohibition of kufr", keys: ["2:152"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Ummatan wasatan: middle/moderate community identity", keys: ["2:143"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0084","cand-0085","cand-0086"],
  notes: "Pass A pilot 8, passage 24/4. Qibla change as central narrative. Ummatan wasatan concept foundational. Culminates in mutual dhikr and shukr commands in 2:152. Links to sabr-patience, shukr-gratitude, remembrance-forgetfulness topics.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:45:00.000Z"
};

// Extract commands from P24
{
  // 2:144 - فَوَلِّ وَجۡهَكَ شَطۡرَ ٱلۡمَسۡجِدِ ٱلۡحَرَامِ
  const t144 = fv(144);
  const fawalliIdx = t144.indexOf("\u0641\u064e\u0648\u064e\u0644\u0651\u0650 \u0648\u064e\u062c\u0652\u0647\u064e\u0643\u064e \u0634\u064e\u0637\u0652\u0631\u064e \u0671\u0644\u0652\u0645\u064e\u0633\u0652\u062c\u0650\u062f\u0650 \u0671\u0644\u0652\u062d\u064e\u0631\u064e\u0627\u0645\u0650");
  if (fawalliIdx >= 0) {
    p24.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:144"], excerpt: t144.slice(fawalliIdx, fawalliIdx + 33).trim(), description: "Command: turn your face toward al-Masjid al-Haram." });
  }

  // 2:148 - فَٱسۡتَبِقُواْ ٱلۡخَيۡرَٰتِ
  const t148 = fv(148);
  const fastabiqooIdx = t148.indexOf("\u0641\u064e\u0671\u0633\u0652\u062a\u064e\u0628\u0650\u0642\u064f\u0648\u0627ْ");
  if (fastabiqooIdx >= 0) {
    const khayratEnd = t148.indexOf("\u0671\u0644\u0652\u062e\u064e\u064a\u0652\u0631\u064e\u0670\u062a\u0650", fastabiqooIdx);
    if (khayratEnd >= 0) {
      const cmdText = t148.slice(fastabiqooIdx, khayratEnd + 10).trim();
      p24.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:148"], excerpt: cmdText, description: "Command: race to good deeds." });
    }
  }

  // 2:152 - فَٱذۡكُرُونِيٓ أَذۡكُرۡكُمۡ وَٱشۡكُرُواْ لِي وَلَا تَكۡفُرُونِ
  const t152 = fv(152);
  const faothkurooneeIdx = t152.indexOf("\u0641\u064e\u0671\u0630\u0652\u0643\u064f\u0631\u064f\u0648\u0646\u0650\u064a");
  if (faothkurooneeIdx >= 0) {
    p24.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:152"], excerpt: fv(152), description: "Commands: remember Me I remember you; be grateful to Me; do not deny Me." });
  }
}

// Extract divine names from P24
{
  // Raoof Raheem from 2:143
  const t143 = fv(143);
  const raoofIdx = t143.indexOf("\u0644\u064e\u0631\u064e\u0621\u064f\u0648\u0641\u064c \u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064c");
  if (raoofIdx >= 0) {
    p24.divineNamesAndAttributes.push({ term: t143.slice(raoofIdx, raoofIdx + 12), transliteration: "Raoof Raheem", gloss: "Kind, Merciful (editorial gloss)", keys: ["2:143"] });
  }
}

// Extract terminology from P24
{
  // Ummatan wasatan from 2:143
  const t143 = fv(143);
  const ummatanWasatanIdx = t143.indexOf("\u0623\u064f\u0645\u0651\u064e\u0629\u064b \u0648\u064e\u0633\u064e\u0637\u064b\u0627");
  if (ummatanWasatanIdx >= 0) {
    p24.terminology.push({ term: t143.slice(ummatanWasatanIdx, ummatanWasatanIdx + 11), transliteration: "ummatan wasatan", gloss: "middle/just community (editorial gloss)", keys: ["2:143"] });
  }

  // Qiblah from 2:142
  const t142 = fv(142);
  const qiblahIdx = t142.indexOf("\u0642\u0650\u0628\u0652\u0644\u064e\u062a\u0650\u0647\u0650\u0645\u064f");
  if (qiblahIdx >= 0) {
    p24.terminology.push({ term: t142.slice(qiblahIdx, qiblahIdx + 9), transliteration: "qiblatihim", gloss: "their direction of prayer (editorial gloss)", keys: ["2:142"] });
  }

  // Masjid al-Haram from 2:144
  const t144 = fv(144);
  const masjidHaramIdx = t144.indexOf("\u0671\u0644\u0652\u0645\u064e\u0633\u0652\u062c\u0650\u062f\u0650 \u0671\u0644\u0652\u062d\u064e\u0631\u064e\u0627\u0645\u0650");
  if (masjidHaramIdx >= 0) {
    p24.terminology.push({ term: t144.slice(masjidHaramIdx, masjidHaramIdx + 18), transliteration: "al-Masjid al-Haram", gloss: "the Sacred Mosque (editorial gloss)", keys: ["2:144"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p24.json"), JSON.stringify(p24, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p24.json");

// ─── Candidates batch (cand-0077 through cand-0086) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: "2026-11-18T16:45:00.000Z",
  sourceExtraction: "ext-002-p21,ext-002-p22,ext-002-p23,ext-002-p24",
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
    createdAt: "2026-11-18T16:45:00.000Z"
  };
  if (arabicLabel) c.arabicLabel = arabicLabel;
  if (urduLabel) c.urduLabel = urduLabel;
  if (notes) c.notes = notes;
  return c;
}

// cand-0077: Ibrahim's imamah appointment and covenant
candidates.candidates.push(makeCand("cand-0077",
  "Imamah appointment: Ibrahim tested and made leader; covenant excludes wrongdoers",
  undefined, "\u0627\u0645\u0627\u0645\u062a: \u0627\u0628\u0631\u0627\u06c1\u06cc\u0645 \u06a9\u0627 \u0627\u0645\u062a\u062d\u0627\u0646 \u0627\u0648\u0631 \u0631\u06c1\u0646\u0645\u0627\u0626\u06cc \u067e\u0631 \u062a\u0642\u0631\u0631",
  "In 2:124: Ibrahim was tested by his Lord with commands and fulfilled them; Allah said 'I will make you imam for people'; Ibrahim asked about descendants; Allah said covenant does not include wrongdoers.",
  [{ key: "2:124", excerpt: fv(124), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes imamah appointment linked to passing divine tests and excludes wrongdoers from covenant." }],
  [{ topicId: "ibrahim-story", layer: "scholarly", relationship: "same-concept" }],
  "Foundational imamah verse. Conditional leadership tied to moral qualification."
));

// cand-0078: Kaaba construction and purification by Ibrahim and Ismail
candidates.candidates.push(makeCand("cand-0078",
  "Kaaba construction and purification: Ibrahim and Ismail's joint service",
  undefined, "\u06a9\u0639\u0628\u06c1 \u06a9\u06cc \u062a\u0639\u0645\u06cc\u0631 \u0627\u0648\u0631 \u067e\u0627\u06a9\u06cc: \u0627\u0628\u0631\u0627\u06c1\u06cc\u0645 \u0627\u0648\u0631 \u0627\u0633\u0645\u0627\u0639\u06cc\u0644 \u06a9\u06cc \u0645\u0634\u062a\u0631\u06a9 \u062e\u062f\u0645\u062a",
  "In 2:125-127: Allah made the House a place of return and security; charged Ibrahim and Ismail to purify it for pilgrims; they raised its foundations praying for acceptance.",
  [{ key: "2:125", excerpt: fv(125), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes Kaaba's purpose and purification mandate." },
   { key: "2:127", excerpt: fv(127), evidenceClass: "EXPLICIT_TEXT", rationale: "Shows active construction and accompanying supplication." }],
  [{ topicId: "ibrahim-story", layer: "scholarly", relationship: "same-concept" }],
  "Core Hajj/Kaaba origin narrative. Joint father-son prophetic labor."
));

// cand-0079: Ibrahim's supplications: Muslim identity, rites, messenger
candidates.candidates.push(makeCand("cand-0079",
  "Ibrahim's taught supplications: Muslim identity, rites, and future messenger",
  undefined, "\u0627\u0628\u0631\u0627\u06c1\u06cc\u0645 \u06a9\u06cc \u062f\u0639\u0627\u0626\u06cc\u06ba: \u0645\u0633\u0644\u0645 \u06c1\u0648\u0646\u0627\u060c \u0645\u0646\u0627\u0633\u06a9\u060c \u0627\u0648\u0631 \u0631\u0633\u0648\u0644 \u06a9\u06cc \u0628\u0634\u0627\u0631\u062a",
  "In 2:128-129: Ibrahim and Ismail pray to be Muslims, have Muslim descendants, be shown rites, receive repentance, and for a messenger who recites, teaches, and purifies.",
  [{ key: "2:128", excerpt: fv(128), evidenceClass: "EXPLICIT_TEXT", rationale: "Supplication for Muslim identity and rites." },
   { key: "2:129", excerpt: fv(129), evidenceClass: "EXPLICIT_TEXT", rationale: "Supplication for future messenger with four functions." }],
  [{ topicId: "ibrahim-story", layer: "scholarly", relationship: "same-concept" }],
  "Three consecutive taught supplications forming liturgical template. Prophetic anticipation of Muhammad."
));

// cand-0080: Millat Ibrahim as universal creed
candidates.candidates.push(makeCand("cand-0080",
  "Millat Ibrahim: the universal creed excluding sectarian exclusivism",
  undefined, "\u0645\u0644\u062a \u0627\u0628\u0631\u0627\u06c1\u06cc\u0645: \u0639\u0627\u0644\u0645\u06af\u06cc\u0631 \u0639\u0642\u06cc\u062f\u06c1 \u062c\u0648 \u0641\u0631\u0642\u06c1 \u067e\u0631\u0633\u062a\u06cc \u06a9\u0648 \u0645\u0633\u062a\u0631\u062f \u06a9\u0631\u062a\u0627 \u06c1\u06d2",
  "In 2:130-135: turning from millat Ibrahim is self-foolishness; Ibrahim chosen and righteous; submitted to Rabb al-aalameen; willed to descendants; Yaqoob's deathbed tawheed; reject Jewish/Christian exclusivism; follow millat Ibrahim hanifan.",
  [{ key: "2:130", excerpt: fv(130), evidenceClass: "EXPLICIT_TEXT", rationale: "Defines rejection of millat Ibrahim as self-delusion." },
   { key: "2:135", excerpt: fv(135), evidenceClass: "EXPLICIT_TEXT", rationale: "Prescribes millat Ibrahim hanifan as alternative to sectarian claims." }],
  [{ topicId: "ibrahim-story", layer: "scholarly", relationship: "same-concept" }],
  "Defines Islam as pre-sectarian Abrahamic monotheism. Deathbed testimonies confirm continuity."
));

// cand-0081: Individual accountability across generations
candidates.candidates.push(makeCand("cand-0081",
  "Individual accountability: each nation earns its own; no cross-generational burden",
  undefined, "\u0627\u0646\u0641\u0631\u0627\u062f\u06cc \u0630\u0645\u06c1 \u062f\u0627\u0631\u06cc: \u06c1\u0631 \u0627\u0645\u062a \u06a9\u0627 \u0627\u067e\u0646\u0627 \u062d\u0635\u0627\u062f\u060c \u0646\u06c1 \u062f\u0648\u0633\u0631\u0648\u06ba \u06a9\u0627 \u0628\u0648\u062c\u06be",
  "In 2:134 and 2:141: that was an ummah that has passed; it has what it earned and you have what you earned; you will not be asked about what they used to do.",
  [{ key: "2:134", excerpt: fv(134), evidenceClass: "EXPLICIT_TEXT", rationale: "First occurrence of individual accountability formula." },
   { key: "2:141", excerpt: fv(141), evidenceClass: "EXPLICIT_TEXT", rationale: "Repeated formula reinforcing principle in different context." }],
  [],
  "Repeated twice in close proximity emphasizing non-transferability of spiritual merit or blame."
));

// cand-0082: Comprehensive iman declaration without distinction
candidates.candidates.push(makeCand("cand-0082",
  "Universal faith declaration: believing in all revelations without distinction",
  undefined, "\u0639\u0627\u0644\u0645\u06af\u06cc\u0631 \u0627\u06cc\u0645\u0627\u0646\u06cc \u0627\u0639\u0644\u0627\u0646: \u062a\u0645\u0627\u0645 \u0648\u062d\u06cc\u0648\u06ba \u067e\u0631 \u0628\u063a\u06cc\u0631 \u062a\u0641\u0631\u06cc\u0642 \u06a9\u06d2 \u0627\u06cc\u0645\u0627\u0646",
  "In 2:136: say we believe in Allah and what was revealed to us and to Ibrahim, Ismail, Ishaq, Yaqoob, asbaat, Musa, Isa, and all prophets; we make no distinction; we are Muslims to Him.",
  [{ key: "2:136", excerpt: fv(136), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse articulates comprehensive creed encompassing all prophetic traditions." }],
  [],
  "Gap candidate: most explicit Quranic statement of non-discrimination between prophets."
));

// cand-0083: Sibghat Allah — divine religion as best coloring
candidates.candidates.push(makeCand("cand-0083",
  "Sibghat Allah: divine coloring as the best religion",
  undefined, "\u0635\u0628\u063a\u062a \u0627\u0644\u0644\u06c1: \u0627\u0644\u0644\u06c1 \u06a9\u0627 \u0631\u0646\u06af \u0628\u06c1\u062a\u0631\u06cc\u0646 \u062f\u06cc\u0646",
  "In 2:138: sibghat Allah — and who is better than Allah in coloring/religion? And we are worshippers of Him.",
  [{ key: "2:138", excerpt: fv(138), evidenceClass: "EXPLICIT_TEXT", rationale: "Unique sibghah metaphor defining Islam as divinely ordained disposition." }],
  [],
  "Gap candidate: hapax legomenon sibghah. Metaphor of divine imprint on human nature."
));

// cand-0084: Qibla change as test and ummatan wasatan identity
candidates.candidates.push(makeCand("cand-0084",
  "Qibla change: divine test establishing ummatan wasatan as witnesses",
  undefined, "\u062a\u0628\u062f\u06cc\u0644\u06cc \u0642\u0628\u0644\u06c1: \u0627\u0644\u0644\u06c1 \u06a9\u0627 \u0627\u0645\u062a\u062d\u0627\u0646 \u0627\u0648\u0631 \u0627\u0645\u062a \u0648\u0633\u0637\u06cc\u06c1 \u06a9\u06cc \u0634\u0646\u0627\u062e\u062a",
  "In 2:143: thus We made you a middle community to be witnesses over people and Messenger witness over you; previous qiblah was test to distinguish followers from reverters; difficult except for guided; Allah preserves iman.",
  [{ key: "2:143", excerpt: fv(143), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse defines ummatan wasatan purpose and qiblah change as obedience test." }],
  [],
  "Gap candidate: ummatan wasatan as defining communal identity. Qiblah change as epistemological test."
));

// cand-0085: Mutual remembrance and gratitude as covenant
candidates.candidates.push(makeCand("cand-0085",
  "Mutual remembrance and gratitude: fadhkuroonee adhkurkum wa-ushkuroo lee",
  undefined, "\u0628\u0627\u06c1\u0645\u06cc \u06cc\u0627\u062f \u0627\u0648\u0631 \u0634\u06a9\u0631: \u0645\u062c\u06be\u06d2 \u06cc\u0627\u062f \u06a9\u0631\u0648 \u0645\u06cc\u06ba \u062a\u0645\u06c1\u06cc\u06ba \u06cc\u0627\u062f \u06a9\u0631\u0648\u06ba\u06af\u0627\u060c \u0634\u06a9\u0631 \u06a9\u0631\u0648 \u0627\u0646\u06a9\u0627\u0631 \u0646\u06c1 \u06a9\u0631\u0648",
  "In 2:152: remember Me I will remember you; be grateful to Me and do not deny Me — establishing reciprocal divine-human relationship through dhikr and shukr.",
  [{ key: "2:152", excerpt: fv(152), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse pairs mutual remembrance with gratitude command and ingratitude prohibition." }],
  [{ topicId: "remembrance-forgetfulness", layer: "scholarly", relationship: "same-concept" },
   { topicId: "shukr-gratitude", layer: "scholarly", relationship: "same-concept" },
   { topicId: "gratitude-ingratitude", layer: "scholarly", relationship: "same-concept" }],
  "Culminating verse of qiblah section. Reciprocal covenant formula."
));

// cand-0086: Following desires after knowledge as wrongdoing
candidates.candidates.push(makeCand("cand-0086",
  "Following desires after knowledge: post-knowledge deviation as zulm",
  undefined, "\u0639\u0644\u0645 \u06a9\u06d2 \u0628\u0639\u062f \u062e\u0648\u0627\u06c1\u0634 \u06a9\u06cc \u067e\u06cc\u0631\u0648\u06cc: \u0639\u0644\u0645 \u0622\u0646\u06d2 \u06a9\u06d2 \u0628\u0639\u062f \u0627\u0646\u062d\u0631\u0627\u0641 \u0638\u0644\u0645",
  "In 2:145: if you follow their desires after what has come to you of knowledge, you would then be among the wrongdoers — reiterating that knowledge increases accountability.",
  [{ key: "2:145", excerpt: fv(145), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse warns that post-knowledge capitulation to desires constitutes injustice." }],
  [{ topicId: "patience-haste", layer: "scholarly", relationship: "related-not-identical" }],
  "Echoes 2:120 warning. Knowledge-heightened accountability theme."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-008.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-008.json with ${candidates.candidates.length} candidates`);

console.log("\nDone. Run validator to confirm.");
