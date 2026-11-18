// MFD-11 Imran Pass 1 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Ali 'Imran 3:1-35 (Passages 1-4, Candidates cand-0127..cand-0136).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "003-0001-0035.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 3:${n} not found in corpus (id=${n})`);
  return verses[n];
}

// Full verse helper
function fv(n) { return v(n); }

console.log("Generating Imran Pass 1 files from verbatim corpus (3:1-35)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T17:35:00.000Z";

// ─── Passage 1: 3:1–9 ────────────────────────────────────────────────────────
const p1 = {
  extractionId: "ext-003-p1",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 1, toAyah: 9, label: "Ali 'Imran — Alif-Lam-Mim; Allah no deity except Him the Living the Sustainer; tanzil of the Book in truth confirming what was before; Torah and Gospel revealed before as guidance; Furqan revealed; those who disbelieve in Allah's signs have severe punishment; Allah Aziz Dhu Intiqam; nothing hidden from Allah in earth or heaven; He forms in wombs as He wills; Aziz Hakeem; muhkamat and mutashabihat ayat; those with zaygh follow mutashabih seeking fitnah and ta'wil; only Allah knows ta'wil; rasikhun in knowledge say we believe all from our Lord; only ulu al-albab remember; supplication: do not let hearts deviate after guidance; grant mercy; You are Wahhab; You gather people for Day no doubt; Allah does not break promise" },
  verseKeys: ["3:1","3:2","3:3","3:4","3:5","3:6","3:7","3:8","3:9"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `3:${i+1}`, text: fv(i+1) })),
  mainSubject: {
    label: "Opening declaration of divine unity (tawheed): Allah as Hayy Qayyum; Quranic revelation as truth confirming prior scriptures (Torah, Gospel); Furqan as criterion; warning of severe punishment for disbelievers; divine omniscience (nothing hidden); embryonic formation as sign of creative power; muhkamat (precise) and mutashabihat (ambiguous) verses distinguished; deviation of hearts pursuing ambiguous texts seeking discord; exclusive divine knowledge of interpretation; firm-grounded scholars affirm belief in entirety; supplication against heart-deviation post-guidance; affirmation of gathering on Judgment Day without doubt; divine faithfulness to promise",
    keys: ["3:1","3:2","3:3","3:4","3:5","3:6","3:7","3:8","3:9"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Alif-Lam-Mim: disjointed opening letters", keys: ["3:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawheed declaration: la ilaha illa huwa al-Hayy al-Qayyum", keys: ["3:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tanzil of Kitab bil-haqq confirming prior revelation", keys: ["3:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Torah and Gospel revealed as guidance for people", keys: ["3:3","3:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Furqan (criterion) revealed", keys: ["3:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Severe punishment for disbelievers in Allah's signs", keys: ["3:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine omniscience: nothing hidden in earth or heaven", keys: ["3:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Embryonic formation: yusawwirukum fi al-arham", keys: ["3:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Muhkamat as umm al-kitab; mutashabihat as secondary", keys: ["3:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Zaygh (deviation) in hearts leads to following mutashabih", keys: ["3:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Seeking fitnah and ta'wil through ambiguous verses", keys: ["3:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exclusive divine knowledge of ta'wil", keys: ["3:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rasikhun fi al-ilm: holistic belief affirmation", keys: ["3:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Only ulu al-albab take reminder", keys: ["3:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication against heart deviation after guidance", keys: ["3:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wahhab (Bestower) invoked in supplication", keys: ["3:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gathering on Day without doubt; Allah keeps promise", keys: ["3:9"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Heart deviation (zaygh) as spiritual pathology driving misinterpretation", keys: ["3:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Intellectual humility of rasikhun accepting limits of human interpretation", keys: ["3:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplicatory dependence on divine preservation of guidance", keys: ["3:8"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0127","cand-0128","cand-0129"],
  notes: "Pass A Imran passage 1/4. Establishes foundational tawheed, scripture theology, and hermeneutical principles. Muhkamat/mutashabihat distinction is central to Quranic sciences. Supplication in 3:8 is taught supplication model. Links to tawheed-fundamentals, divine-scriptures, quran-science.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P1
{
  // Al-Hayy Al-Qayyum from 3:2
  const t2 = fv(2);
  const hayyIdx = t2.indexOf("\u0671\u0644\u0652\u062d\u064e\u064a\u0651\u064f \u0671\u0644\u0652\u0642\u064e\u064a\u0651\u064f\u0648\u0645\u064f");
  if (hayyIdx >= 0) {
    p1.divineNamesAndAttributes.push({ term: t2.slice(hayyIdx, hayyIdx + 16), transliteration: "al-Hayy al-Qayyum", gloss: "the Ever-Living, the Sustainer (editorial gloss)", keys: ["3:2"] });
  }

  // Aziz Dhu Intiqam from 3:4
  const t4 = fv(4);
  const azizIntIdx = t4.indexOf("\u0639\u064e\u0632\u0650\u064a\u0632\u064c \u0630\u064f\u0648 \u0671\u0646\u0652\u062a\u0650\u0642\u064e\u0627\u0645\u064d");
  if (azizIntIdx >= 0) {
    p1.divineNamesAndAttributes.push({ term: t4.slice(azizIntIdx, azizIntIdx + 18), transliteration: "Aziz Dhu Intiqam", gloss: "Exalted in Might, Owner of Retribution (editorial gloss)", keys: ["3:4"] });
  }

  // Aziz Hakeem from 3:6
  const t6 = fv(6);
  const azizHakIdx = t6.indexOf("\u0671\u0644\u0652\u0639\u064e\u0632\u0650\u064a\u0632\u064f \u0671\u0644\u0652\u062d\u064e\u0643\u0650\u064a\u0645\u064f");
  if (azizHakIdx >= 0) {
    p1.divineNamesAndAttributes.push({ term: t6.slice(azizHakIdx, azizHakIdx + 15), transliteration: "al-Aziz al-Hakeem", gloss: "the Exalted in Might, the Wise (editorial gloss)", keys: ["3:6"] });
  }

  // Al-Wahhab from 3:8
  const t8 = fv(8);
  const wahhabIdx = t8.indexOf("\u0671\u0644\u0652\u0648\u064e\u0647\u0651\u064e\u0627\u0628\u064f");
  if (wahhabIdx >= 0) {
    p1.divineNamesAndAttributes.push({ term: t8.slice(wahhabIdx, wahhabIdx + 10), transliteration: "al-Wahhab", gloss: "the Bestower (editorial gloss)", keys: ["3:8"] });
  }
}

// Extract terminology from P1
{
  // Al-Furqan from 3:4
  const t4b = fv(4);
  const furqanIdx = t4b.indexOf("\u0671\u0644\u0652\u0641\u064f\u0631\u0652\u0642\u064e\u0627\u0646\u064e");
  if (furqanIdx >= 0) {
    p1.terminology.push({ term: t4b.slice(furqanIdx, furqanIdx + 10), transliteration: "al-Furqan", gloss: "the Criterion/distinguisher between truth and falsehood (editorial gloss)", keys: ["3:4"] });
  }

  // Muhkamat from 3:7
  const t7 = fv(7);
  const muhkIdx = t7.indexOf("\u0645\u064f\u062d\u0652\u0643\u064e\u0645\u064e\u0627\u062a\u064c");
  if (muhkIdx >= 0) {
    p1.terminology.push({ term: t7.slice(muhkIdx, muhkIdx + 9), transliteration: "muhkamat", gloss: "precise/clear verses forming the foundation of the Book (editorial gloss)", keys: ["3:7"] });
  }

  // Mutashabihat from 3:7
  const mutashIdx = t7.indexOf("\u0645\u064f\u062a\u064e\u0634\u064e\u0627\u0628\u0650\u0647\u064e\u0627\u062a\u064c");
  if (mutashIdx >= 0) {
    p1.terminology.push({ term: t7.slice(mutashIdx, mutashIdx + 12), transliteration: "mutashabihat", gloss: "ambiguous/allegorical verses requiring careful interpretation (editorial gloss)", keys: ["3:7"] });
  }
}

// Extract commands/supplications from P1
{
  // 3:8 - Taught supplication
  p1.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["3:8"], excerpt: fv(8), description: "Taught supplication: Our Lord, do not let our hearts deviate after You have guided us; grant us mercy from Yourself; You are the Bestower." });
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p1.json"), JSON.stringify(p1, null, 2) + "\n");
console.log("Wrote 003-al-imran-p1.json");

// ─── Passage 2: 3:10–20 ────────────────────────────────────────────────────────
const p2 = {
  extractionId: "ext-003-p2",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 10, toAyah: 20, label: "Ali 'Imran — Disbelievers: wealth and children won't avail against Allah; they are fuel of Fire; like custom of Pharaoh's people and those before; denied signs so Allah seized them for sins; Allah severe in penalty; say to disbelievers you will be overcome and gathered to Jahannam; wretched resting place; sign in two armies that met: one fighting in Allah's way, other disbelieving; saw them twice their number by eyesight; Allah supports with victory whom He wills; lesson for those of vision; beautified for people love of desires: women, sons, heaped gold/silver, branded horses, cattle, tilled land; that is enjoyment of worldly life; Allah has best return; say shall I inform of better: for muttaqin gardens with rivers beneath, eternal, purified spouses, approval from Allah; Allah Baseer bil-ibad; those who say rabbana innana amanna forgive sins protect from Fire punishment; patient, truthful, obedient, spenders, seekers of forgiveness before dawn; Allah witnesses la ilaha illa huwa with angels and people of knowledge maintaining justice; Aziz Hakeem; religion with Allah is Islam; People of Book differed only after knowledge came out of baghy; whoever disbelieves in signs Allah swift in account; if they argue say I submitted my face to Allah and those who follow me; ask People of Book and unlettered: have you submitted? if yes they are guided; if turn away only notification upon you; Allah Baseer bil-ibad" },
  verseKeys: ["3:10","3:11","3:12","3:13","3:14","3:15","3:16","3:17","3:18","3:19","3:20"],
  arabicExcerpts: Array.from({length:11}, (_,i) => ({ key: `3:${i+10}`, text: fv(i+10) })),
  mainSubject: {
    label: "Futility of material resources against divine judgment; disbelievers as fuel for Fire; historical precedent of Pharaoh's people destroyed for denying signs; divine severity in punishment; prophecy of disbeliever defeat and hellfire gathering; Battle of Badr as sign: visual multiplication of Muslim force demonstrating divine support; worldly desires enumerated as temporary enjoyment contrasted with eternal reward for muttaqin; gardens, rivers, purified spouses, divine approval as superior alternative; believer supplication model; five virtues of righteous: patience, truthfulness, obedience, spending, pre-dawn istighfar; divine self-witness of tawheed joined by angels and people of knowledge; Islam as the only true religion with Allah; People of Book disagreement rooted in transgression not ignorance; swift divine accounting; submission formula as response to dispute; universal invitation to Islam including unlettered; prophetic role limited to notification",
    keys: ["3:10","3:11","3:12","3:13","3:14","3:15","3:16","3:17","3:18","3:19","3:20"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Wealth and children cannot avail against Allah", keys: ["3:10"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers as fuel (waqud) of Fire", keys: ["3:10"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pharaoh's people precedent: denied signs, seized for sins", keys: ["3:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah shadeed al-iqab (severe in penalty)", keys: ["3:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophecy: disbelievers overcome and gathered to Jahannam", keys: ["3:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Badr sign: two armies met, believers saw enemy doubled", keys: ["3:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine support (yu'ayyidu binasrihi) for whom He wills", keys: ["3:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly desires: women, sons, gold, silver, horses, cattle, land", keys: ["3:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dunya as mata'; Allah has husn al-ma'ab", keys: ["3:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Superior reward: gardens, rivers, eternal abode, purified spouses, ridwan", keys: ["3:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believer supplication: forgiveness and protection from Fire", keys: ["3:16"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Five virtues: sabirin, sadiqin, qanitin, munfiqin, mustaghfirin bil-asahar", keys: ["3:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine self-witness of tawheed with angels and scholars", keys: ["3:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Islam as the religion with Allah", keys: ["3:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People of Book disagreement from baghy (transgression/envy)", keys: ["3:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Swift divine accounting for disbelievers in signs", keys: ["3:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Submission formula: aslamtu wajhiya lillah", keys: ["3:20"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal invitation including ummiyyin", keys: ["3:20"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Pharaoh's people destruction as historical warning", keys: ["3:11"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Material attachment as spiritual distraction from eternal reality", keys: ["3:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pre-dawn istighfar as mark of spiritual excellence", keys: ["3:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Baghy (transgressive envy) as root cause of religious schism", keys: ["3:19"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Worldly wealth categories defining pre-Islamic Arabian status markers", keys: ["3:14"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0130","cand-0131"],
  notes: "Pass A Imran passage 2/4. Contains Badr reference (3:13), comprehensive dunya/akhirah contrast, five-virtue taxonomy (3:17), and foundational Islam-as-only-religion declaration (3:19). Pre-dawn istighfar unique marker. Links to day-of-judgment, accountability-responsibility, tawheed-rububiyyah.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P2
{
  // Baseer bil-Ibad from 3:15
  const t15 = fv(15);
  const baseerIdx = t15.indexOf("\u0628\u064e\u0635\u0650\u064a\u0631\u064c \u0628\u0650\u0671\u0644\u0652\u0639\u0650\u0628\u064e\u0627\u062f\u0650");
  if (baseerIdx >= 0) {
    p2.divineNamesAndAttributes.push({ term: t15.slice(baseerIdx, baseerIdx + 14), transliteration: "Baseer bil-Ibad", gloss: "Seeing of servants (editorial gloss)", keys: ["3:15"] });
  }

  // Aziz Hakeem from 3:18
  const t18 = fv(18);
  const ahIdx = t18.indexOf("\u0671\u0644\u0652\u0639\u064e\u0632\u0650\u064a\u0632\u064f \u0671\u0644\u0652\u062d\u064e\u0643\u0650\u064a\u0645\u064f");
  if (ahIdx >= 0) {
    p2.divineNamesAndAttributes.push({ term: t18.slice(ahIdx, ahIdx + 15), transliteration: "al-Aziz al-Hakeem", gloss: "the Exalted in Might, the Wise (editorial gloss)", keys: ["3:18"] });
  }
}

// Extract commands/supplications from P2
{
  // 3:16 - Believer supplication
  p2.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["3:16"], excerpt: fv(16), description: "Believer supplication: Our Lord, we have believed, so forgive our sins and protect us from punishment of the Fire." });

  // 3:20 - Command: submit
  p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:20"], excerpt: fv(20), description: "Command: say 'I have submitted my face to Allah and those who follow me'; invite others to submission." });
}

// Extract terminology from P2
{
  // Al-Islam from 3:19
  const t19 = fv(19);
  const islamIdx = t19.indexOf("\u0671\u0644\u0652\u0625\u0650\u0633\u0652\u0644\u064e\u0627\u0645\u064f");
  if (islamIdx >= 0) {
    p2.terminology.push({ term: t19.slice(islamIdx, islamIdx + 9), transliteration: "al-Islam", gloss: "submission to Allah as the only accepted religion (editorial gloss)", keys: ["3:19"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p2.json"), JSON.stringify(p2, null, 2) + "\n");
console.log("Wrote 003-al-imran-p2.json");

// ─── Passage 3: 3:21–25 ────────────────────────────────────────────────────────
const p3 = {
  extractionId: "ext-003-p3",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 21, toAyah: 25, label: "Ali 'Imran — Those who disbelieve in Allah's signs and kill prophets without right and kill those who enjoin justice among people: give tidings of painful punishment; their deeds ruined in dunya and akhirah; no helpers for them; have you not seen those given portion of scripture invited to Allah's Book to judge between them then a party turns away refusing; because they say Fire won't touch us except numbered days; deluded in religion by fabrications; how when We gather them for Day no doubt; each soul paid in full what it earned; not wronged" },
  verseKeys: ["3:21","3:22","3:23","3:24","3:25"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `3:${i+21}`, text: fv(i+21) })),
  mainSubject: {
    label: "Triple crime condemnation: disbelief in signs, unjust killing of prophets, killing justice-enforcers; painful punishment announced; total nullification of deeds in both worlds; absence of any helpers; People of Scripture turning away from divine arbitration despite being invited; false security doctrine ('Fire only numbered days') identified as fabrication-based delusion; eschatological confrontation: inevitable gathering on undoubted Day; complete individual compensation without injustice",
    keys: ["3:21","3:22","3:23","3:24","3:25"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Killing prophets without right as grave crime", keys: ["3:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Killing those who enjoin justice (al-qist) equally condemned", keys: ["3:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Habtat a'mal: deeds voided in both worlds", keys: ["3:22"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No nasireen (helpers) for perpetrators", keys: ["3:22"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Refusal of divine arbitration despite possessing scripture", keys: ["3:23"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False doctrine: Fire only for numbered days", keys: ["3:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Religious delusion from fabricated beliefs (yaftaroon)", keys: ["3:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Inevitable gathering on Day without doubt", keys: ["3:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Complete individual compensation; no zulm (injustice)", keys: ["3:25"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Historical pattern of prophet-killing and justice-enforcer persecution", keys: ["3:21"], evidenceClass: "CONTEXTUAL" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "False religious security enabling moral impunity", keys: ["3:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Willful refusal of known truth despite possessing scripture", keys: ["3:23"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0132","cand-0133"],
  notes: "Pass A Imran passage 3/4. Unique triple-crime formulation linking disbelief, prophet-killing, and justice-enforcer killing. False security doctrine (numbered days) parallels Jewish theological claims addressed elsewhere. Links to day-of-judgment, accountability-responsibility, major-prophets-stories.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p3.json"), JSON.stringify(p3, null, 2) + "\n");
console.log("Wrote 003-al-imran-p3.json");

// ─── Passage 4: 3:26–35 ────────────────────────────────────────────────────────
const p4 = {
  extractionId: "ext-003-p4",
  workstream: "MFD-11",
  pass: "A",
  surah: 3,
  surahName: "Ali 'Imran",
  passage: { fromAyah: 26, toAyah: 35, label: "Ali 'Imran — Say O Allah Malik al-Mulk You give mulk to whom You will and take mulk from whom You will; honor and humble; in Your hand is khayr; over all things Qadeer; insert night into day and day into night; bring living from dead and dead from living; provide without measure; believers should not take disbelievers as awliya instead of believers; whoever does so has nothing with Allah unless guarding against them in precaution; Allah warns you of Himself; to Allah the destination; say whether conceal or reveal what is in breasts Allah knows; knows what is in heavens and earth; over all things Qadeer; Day every soul finds good present and wishes distance from evil; Allah warns of Himself; Allah Ra'uf bil-ibad; say if you love Allah follow me Allah will love you and forgive sins; Ghafoor Raheem; obey Allah and Messenger; if turn away Allah does not love kafirin; Allah chose Adam, Nuh, family of Ibrahim, family of Imran over worlds; descendants some from others; Samee' Aleem; when wife of Imran said My Lord I vowed what is in my womb consecrated accept from me; You are Samee' Aleem" },
  verseKeys: ["3:26","3:27","3:28","3:29","3:30","3:31","3:32","3:33","3:34","3:35"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `3:${i+26}`, text: fv(i+26) })),
  mainSubject: {
    label: "Comprehensive divine sovereignty prayer (Malik al-Mulk): bestowal and removal of dominion, honor and humiliation, all good in divine hand, omnipotence; cosmic cycles (night/day alternation, life/death reversal) as manifestations of power; unlimited provision; prohibition of taking disbelievers as allies over believers with tactical exception for self-protection; divine self-warning; inner-state omniscience (concealed or revealed); eschatological presence of deeds and desire for distance from evil; divine kindness (Ra'uf); love-following reciprocity principle: loving Allah requires following the Prophet resulting in divine love and forgiveness; obedience command to Allah and Messenger; divine displeasure with disbelievers; election of Adam, Noah, Abraham's family, Imran's family above all worlds; generational continuity; wife of Imran's vow dedicating unborn child for sacred service; acceptance plea invoking Samee' Aleem",
    keys: ["3:26","3:27","3:28","3:29","3:30","3:31","3:32","3:33","3:34","3:35"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Malik al-Mulk: Owner of Sovereignty invocation", keys: ["3:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine bestowal and removal of mulk", keys: ["3:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine honoring and humbling", keys: ["3:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "All khayr in divine hand", keys: ["3:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Night-day alternation as divine act", keys: ["3:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Life-death reversal cycle", keys: ["3:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Provision without measure (bighayri hisab)", keys: ["3:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: believers taking kafirin as awliya over mu'minin", keys: ["3:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exception: tuqatan (prudent precaution) against them", keys: ["3:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine self-warning (yuhadhdhirukum Allahu nafsahu)", keys: ["3:28","3:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Inner-state omniscience: conceal or reveal", keys: ["3:29"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eschatological presentation of deeds; wish for distance from evil", keys: ["3:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ra'uf bil-Ibad (Kind to servants)", keys: ["3:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Love-following reciprocity: follow me → Allah loves you", keys: ["3:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Obedience to Allah and Messenger commanded", keys: ["3:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Election of Adam, Nuh, Al Ibrahim, Al Imran", keys: ["3:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Generational continuity: dhurriyyah ba'duha min ba'd", keys: ["3:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wife of Imran's nadhr (vow) dedicating unborn child", keys: ["3:35"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Election narrative: Adam, Noah, Abraham's family, Imran's family chosen above worlds", keys: ["3:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wife of Imran's vow and dedication of unborn child", keys: ["3:35"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Regret at eschaton: wishing distance from one's own evil deeds", keys: ["3:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine love as conditional on prophetic following", keys: ["3:31"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Political alliance restrictions based on faith loyalty", keys: ["3:28"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Generational lineage as basis for collective election", keys: ["3:34"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0134","cand-0135","cand-0136"],
  notes: "Pass A Imran passage 4/4. Contains Malik al-Mulk supplication (3:26), love-following principle (3:31), election list (3:33), and beginning of Maryam narrative via wife of Imran's vow (3:35). Tuqatan exception in 3:28 is jurisprudentially significant. Links to tawheed-rububiyyah, asma-ul-husna, maryam-story, isa-story.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract divine names from P4
{
  // Malik al-Mulk from 3:26
  const t26 = fv(26);
  const malikIdx = t26.indexOf("\u0645\u064e\u0627\u0644\u0650\u0643\u064e \u0671\u0644\u0652\u0645\u064f\u0644\u0652\u0643\u0650");
  if (malikIdx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t26.slice(malikIdx, malikIdx + 12), transliteration: "Malik al-Mulk", gloss: "Owner of Sovereignty (editorial gloss)", keys: ["3:26"] });
  }

  // Qadeer from 3:26
  const qadeerIdx = t26.indexOf("\u0642\u064e\u062f\u0650\u064a\u0631\u064c");
  if (qadeerIdx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t26.slice(qadeerIdx, qadeerIdx + 6), transliteration: "Qadeer", gloss: "Competent/All-Powerful (editorial gloss)", keys: ["3:26"] });
  }

  // Ra'uf bil-Ibad from 3:30
  const t30 = fv(30);
  const raufIdx = t30.indexOf("\u0631\u064e\u0621\u064f\u0648\u0641\u064c \u0628\u0650\u0671\u0644\u0652\u0639\u0650\u0628\u064e\u0627\u062f\u0650");
  if (raufIdx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t30.slice(raufIdx, raufIdx + 14), transliteration: "Ra'uf bil-Ibad", gloss: "Kind to servants (editorial gloss)", keys: ["3:30"] });
  }

  // Ghafoor Raheem from 3:31
  const t31 = fv(31);
  const ghafRahIdx = t31.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c \u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064c");
  if (ghafRahIdx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t31.slice(ghafRahIdx, ghafRahIdx + 12), transliteration: "Ghafoor Raheem", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["3:31"] });
  }

  // Samee' Aleem from 3:34
  const t34 = fv(34);
  const samAleemIdx = t34.indexOf("\u0633\u064e\u0645\u0650\u064a\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (samAleemIdx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t34.slice(samAleemIdx, samAleemIdx + 12), transliteration: "Samee' Aleem", gloss: "Hearing, Knowing (editorial gloss)", keys: ["3:34"] });
  }

  // As-Samee' Al-Aleem from 3:35
  const t35 = fv(35);
  const samAleem2Idx = t35.indexOf("\u0671\u0644\u0633\u0651\u064e\u0645\u0650\u064a\u0639\u064f \u0671\u0644\u0652\u0639\u064e\u0644\u0650\u064a\u0645\u064f");
  if (samAleem2Idx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t35.slice(samAleem2Idx, samAleem2Idx + 16), transliteration: "as-Samee' al-Aleem", gloss: "the Hearing, the Knowing (editorial gloss)", keys: ["3:35"] });
  }
}

// Extract commands/prohibitions from P4
{
  // 3:28 - Prohibition: do not take disbelievers as allies
  p4.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["3:28"], excerpt: fv(28), description: "Prohibition: believers must not take disbelievers as allies instead of believers, except for prudent precaution." });

  // 3:31 - Command: follow the Prophet
  p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:31"], excerpt: fv(31), description: "Command: if you love Allah, follow me (the Prophet), so Allah will love you and forgive your sins." });

  // 3:32 - Command: obey Allah and Messenger
  p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["3:32"], excerpt: fv(32), description: "Command: obey Allah and the Messenger." });
}

// Extract terminology from P4
{
  // Awliya from 3:28
  const t28 = fv(28);
  const awliyaIdx = t28.indexOf("\u0623\u064e\u0648\u0652\u0644\u0650\u064a\u064e\u0627\u0621\u064e");
  if (awliyaIdx >= 0) {
    p4.terminology.push({ term: t28.slice(awliyaIdx, awliyaIdx + 8), transliteration: "awliya'", gloss: "allies/patrons/protectors (editorial gloss)", keys: ["3:28"] });
  }

  // Tuqatan from 3:28
  const tuqatanIdx = t28.indexOf("\u062a\u064f\u0642\u064e\u0627\u0629\u064b");
  if (tuqatanIdx >= 0) {
    p4.terminology.push({ term: t28.slice(tuqatanIdx, tuqatanIdx + 6), transliteration: "tuqatan", gloss: "prudent precaution/dissimulation for safety (editorial gloss)", keys: ["3:28"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "003-al-imran-p4.json"), JSON.stringify(p4, null, 2) + "\n");
console.log("Wrote 003-al-imran-p4.json");

// ─── Candidates batch (cand-0127 through cand-0136) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-003-p1,ext-003-p2,ext-003-p3,ext-003-p4",
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

// cand-0127: Muhkamat and Mutashabihat — Quranic hermeneutical framework
candidates.candidates.push(makeCand("cand-0127",
  "Quranic hermeneutics: muhkamat (precise) and mutashabihat (ambiguous) verses with interpretive boundaries",
  undefined, "\u0642\u0631\u0622\u0646\u06cc \u062a\u0641\u0633\u06cc\u0631 \u06a9\u0627 \u0627\u0635\u0648\u0644: \u0645\u062d\u06a9\u0645\u0627\u062a \u0627\u0648\u0631 \u0645\u062a\u0634\u0627\u0628\u06c1\u0627\u062a",
  "In 3:7: It is He who sent down the Book; in it are precise verses (muhkamat) — they are the foundation of the Book — and others ambiguous (mutashabihat). Those with deviation in hearts follow the ambiguous seeking discord and interpretation. Only Allah knows its interpretation. Those firm in knowledge say: We believe in it; all is from our Lord.",
  [{ key: "3:7", excerpt: fv(7), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes the foundational Quranic hermeneutical distinction with epistemic boundaries." }],
  [{ topicId: "quran-revelation-process", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated muhkamat-mutashabihat topic. Central to Quranic sciences (ulum al-Quran). Defines legitimate vs illegitimate interpretation."
));

// cand-0128: Heart deviation (zaygh) — spiritual pathology of misinterpretation
candidates.candidates.push(makeCand("cand-0128",
  "Heart deviation (zaygh): spiritual pathology driving pursuit of ambiguous texts for discord",
  undefined, "\u062f\u0644 \u06a9\u06cc \u0627\u0646\u062d\u0631\u0627\u0641: \u063a\u0644\u0637 \u062a\u0641\u0633\u06cc\u0631 \u06a9\u06cc \u0631\u0648\u062d\u0627\u0646\u06cc \u0628\u06cc\u0645\u0627\u0631\u06cc",
  "In 3:7: Those in whose hearts is deviation (zaygh) follow the ambiguous from it, seeking discord (fitnah) and seeking its interpretation. In 3:8: Our Lord, do not let our hearts deviate after You have guided us.",
  [{ key: "3:7", excerpt: fv(7), evidenceClass: "EXPLICIT_TEXT", rationale: "Identifies zaygh as the root cause of illegitimate scriptural interpretation." },
   { key: "3:8", excerpt: fv(8), evidenceClass: "EXPLICIT_TEXT", rationale: "Supplication acknowledges ongoing vulnerability to heart deviation even after guidance." }],
  [{ topicId: "good-character", layer: "curated", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated zaygh/qalb topic. Connects epistemology to spiritual state. Supplication in 3:8 provides remedial framework."
));

// cand-0129: Divine self-witness of tawheed — Allah, angels, and scholars testify
candidates.candidates.push(makeCand("cand-0129",
  "Divine self-witness of tawheed: Allah, angels, and people of knowledge testify to divine unity and justice",
  undefined, "\u062a\u0648\u062d\u06cc\u062f \u06a9\u06cc \u06af\u0648\u0627\u06c1\u06cc: \u0627\u0644\u0644\u06c1\u060c \u0641\u0631\u0634\u062a\u06d2\u060c \u0627\u0648\u0631 \u0639\u0644\u0645\u0627\u0621 \u06a9\u06cc \u0634\u06c1\u0627\u062f\u062a",
  "In 3:18: Allah witnesses that there is no deity except Him, and [so do] the angels and those of knowledge — maintaining justice. There is no deity except Him, the Exalted in Might, the Wise.",
  [{ key: "3:18", excerpt: fv(18), evidenceClass: "EXPLICIT_TEXT", rationale: "Unique triple-witness formulation: divine self-testimony joined by angels and scholars, establishing tawheed as objectively attested truth." }],
  [{ topicId: "tawheed-fundamentals", layer: "scholarly", relationship: "same-concept" },
   { topicId: "asma-ul-husna", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap confirmed with tawheed-fundamentals. Distinctive feature: scholars (ulu al-ilm) elevated as co-witnesses alongside angels. Justice (qist) integrated into tawheed testimony."
));

// cand-0130: Worldly desires taxonomy — enumerated attractions and their limitation
candidates.candidates.push(makeCand("cand-0130",
  "Worldly desires taxonomy: seven categories of material attraction contrasted with eternal reward",
  undefined, "\u062f\u0646\u06cc\u0627 \u06a9\u06cc \u062e\u0648\u0627\u06c1\u0634\u0627\u062a: \u0633\u0627\u062a \u0627\u0642\u0633\u0627\u0645 \u0627\u0648\u0631 \u0627\u0646 \u06a9\u0627 \u0645\u062a\u0628\u062f\u0644",
  "In 3:14: Beautified for people is love of desires: women, sons, heaped-up gold and silver, fine branded horses, cattle, and tilled land. That is the enjoyment of worldly life, but Allah has with Him the best return. In 3:15: For the muttaqin: gardens with rivers, eternal abode, purified spouses, divine approval.",
  [{ key: "3:14", excerpt: fv(14), evidenceClass: "EXPLICIT_TEXT", rationale: "Comprehensive enumeration of seven worldly attraction categories as mata' al-hayat al-dunya." },
   { key: "3:15", excerpt: fv(15), evidenceClass: "EXPLICIT_TEXT", rationale: "Contrasting eternal reward package establishing superiority of taqwa-based aspiration." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated hubb al-shahawat / dunya-desires topic. Seven-item taxonomy more specific than general zuhd topics. Gender-specific appeal noted."
));

// cand-0131: Five virtues of the righteous — sabirin, sadiqin, qanitin, munfiqin, mustaghfirin
candidates.candidates.push(makeCand("cand-0131",
  "Five virtues taxonomy: patience, truthfulness, obedience, spending, and pre-dawn forgiveness-seeking",
  undefined, "\u067e\u0627\u0646\u0686 \u0646\u06cc\u06a9\u06cc\u0627\u06ba: \u0635\u0628\u0631\u060c \u0633\u0686\u0627\u0626\u06cc\u060c \u0639\u0628\u0627\u062f\u062a\u060c \u0627\u0646\u0641\u0627\u0642\u060c \u0627\u0648\u0631 \u0633\u062d\u0631\u06cc \u0627\u0633\u062a\u063a\u0641\u0627\u0631",
  "In 3:17: The patient, the truthful, the obedient, those who spend, and those who seek forgiveness before dawn.",
  [{ key: "3:17", excerpt: fv(17), evidenceClass: "EXPLICIT_TEXT", rationale: "Compact five-virtue taxonomy uniquely combining moral character (sabr, sidq), worship (qunut), charity (infaq), and temporal specificity (istighfar bil-asahar)." }],
  [{ topicId: "good-character", layer: "curated", relationship: "related-not-identical" },
   { topicId: "prayer", layer: "curated", relationship: "related-not-identical" }],
  "Gap candidate: no unified five-virtue topic. Pre-dawn istighfar (bil-asahar) is temporally specific marker absent from general virtue lists."
));

// cand-0132: Prophet-killing and justice-enforcer persecution — triple crime
candidates.candidates.push(makeCand("cand-0132",
  "Prophet-killing and justice-enforcer persecution: triple crime with total deed nullification",
  undefined, "\u0627\u0646\u0628\u06cc\u0627\u0621 \u06a9\u0627 \u0642\u062a\u0644 \u0627\u0648\u0631 \u0639\u062f\u0644 \u06a9\u0627 \u062d\u06a9\u0645 \u062f\u06cc\u0646\u06d2 \u0648\u0627\u0644\u0648\u06ba \u06a9\u0627 \u0642\u062a\u0644",
  "In 3:21: Those who disbelieve in Allah's signs and kill the prophets without right and kill those who enjoin justice among people — give them tidings of painful punishment. In 3:22: Their deeds are voided in this world and the Hereafter; no helpers for them.",
  [{ key: "3:21", excerpt: fv(21), evidenceClass: "EXPLICIT_TEXT", rationale: "Triple crime formulation uniquely combining disbelief, prophet-killing, and justice-enforcer killing." },
   { key: "3:22", excerpt: fv(22), evidenceClass: "EXPLICIT_TEXT", rationale: "Total deed nullification (habtat a'mal) across both worlds as consequence." }],
  [{ topicId: "prophet-definition", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "self-accountability", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated prophet-persecution topic. Justice-enforcer killing (allatheena yamuroona bil-qist) extends beyond prophets to include moral reformers."
));

// cand-0133: False religious security — numbered-days doctrine as fabrication
candidates.candidates.push(makeCand("cand-0133",
  "False religious security: 'Fire only numbered days' doctrine identified as fabrication-based delusion",
  undefined, "\u062c\u06be\u0648\u0679\u0627 \u0645\u0630\u06c1\u0628\u06cc \u062a\u062d\u0641\u0638: \u0622\u06af \u0635\u0631\u0641 \u06af\u0646\u06cc \u062f\u0646\u0648\u06ba \u06a9\u0627 \u0639\u0642\u06cc\u062f\u06c1",
  "In 3:24: That is because they say 'Never will the Fire touch us except for numbered days,' and they were deluded in their religion by what they were fabricating.",
  [{ key: "3:24", excerpt: fv(24), evidenceClass: "EXPLICIT_TEXT", rationale: "Explicit identification of false eschatological security doctrine as rooted in fabrication (yaftaroon), producing religious delusion (gharrahum fi deenihim)." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: addresses specific theological error rather than general judgment belief. Fabrication-delusion causality chain is analytically distinctive."
));

// cand-0134: Divine sovereignty (Malik al-Mulk) — comprehensive power supplication
candidates.candidates.push(makeCand("cand-0134",
  "Divine sovereignty (Malik al-Mulk): comprehensive supplication acknowledging absolute divine control over dominion, honor, provision, and cosmic cycles",
  undefined, "\u0627\u0644\u0644\u06c1 \u06a9\u06cc \u062d\u0627\u06a9\u0645\u06cc\u062a: \u0645\u0627\u0644\u06a9 \u0627\u0644\u0645\u0644\u06a9 \u06a9\u06cc \u062f\u0639\u0627",
  "In 3:26: Say, O Allah, Owner of Sovereignty, You give sovereignty to whom You will and take it from whom You will; You honor and humble; in Your hand is all good; You are over all things competent. In 3:27: You cause night to enter day and day into night; bring living from dead and dead from living; provide without measure.",
  [{ key: "3:26", excerpt: fv(26), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete sovereignty supplication covering political, social, and ontological dimensions of divine power." },
   { key: "3:27", excerpt: fv(27), evidenceClass: "EXPLICIT_TEXT", rationale: "Cosmic extensions: temporal cycles, life-death reversal, unlimited provision." }],
  [{ topicId: "tawheed-rububiyyah", layer: "scholarly", relationship: "same-concept" },
   { topicId: "divine-power", layer: "scholarly", relationship: "same-concept" },
   { topicId: "asma-ul-husna", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap confirmed with tawheed-rububiyyah and divine-power. Distinctive as taught supplication format integrating multiple divine attributes in single address."
));

// cand-0135: Love-following reciprocity — prophetic following as condition for divine love
candidates.candidates.push(makeCand("cand-0135",
  "Love-following reciprocity: loving Allah requires following the Prophet, resulting in divine love and forgiveness",
  undefined, "\u0645\u062d\u0628\u062a \u0627\u0648\u0631 \u0627\u062a\u0628\u0627\u0639: \u0627\u0644\u0644\u06c1 \u0633\u06d2 \u0645\u062d\u0628\u062a \u06a9\u0627 \u0634\u0631\u0637 \u0627\u062a\u0628\u0627\u0639 \u0631\u0633\u0648\u0644",
  "In 3:31: Say, If you love Allah, then follow me, [so] Allah will love you and forgive you your sins. And Allah is Forgiving and Merciful.",
  [{ key: "3:31", excerpt: fv(31), evidenceClass: "EXPLICIT_TEXT", rationale: "Conditional reciprocity: human love for Allah validated only through prophetic following, producing divine love and forgiveness as result." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "uncertain", note: "Adjacent to Imran/Maryam narrative but this verse addresses Muhammad's followership" }],
  "Gap candidate: no dedicated mahabbat-ittiba' topic. Establishes prophetic following as sole valid expression of divine love. Foundational to Sufi and orthodox spirituality debates."
));

// cand-0136: Election of families — Adam, Noah, Abraham, Imran chosen above worlds
candidates.candidates.push(makeCand("cand-0136",
  "Divine election of families: Adam, Noah, Abraham's family, and Imran's family chosen above all worlds",
  undefined, "\u062e\u0627\u0646\u062f\u0627\u0646\u0648\u06ba \u06a9\u0627 \u0627\u0646\u062a\u062e\u0627\u0628: \u0622\u062f\u0645\u060c \u0646\u0648\u062d\u060c \u0627\u0628\u0631\u0627\u06c1\u06cc\u0645\u060c \u0639\u0645\u0631\u0627\u0646 \u06a9\u06d2 \u062e\u0627\u0646\u062f\u0627\u0646",
  "In 3:33: Indeed, Allah chose Adam and Noah and the family of Abraham and the family of Imran over the worlds. In 3:34: Descendants, some of them from others. And Allah is Hearing and Knowing.",
  [{ key: "3:33", excerpt: fv(33), evidenceClass: "EXPLICIT_TEXT", rationale: "Explicit election list spanning four patriarchal lines with supra-worldly preference." },
   { key: "3:34", excerpt: fv(34), evidenceClass: "EXPLICIT_TEXT", rationale: "Generational continuity principle linking elected families through biological descent." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "broader" },
   { topicId: "musa-story", layer: "scholarly", relationship: "related-not-identical", note: "Abraham's family includes progenitors of Israelite line" },
   { topicId: "ibrahim-story", layer: "scholarly", relationship: "broader" }],
  "Overlap with isa-story and ibrahim-story (Imran's family connected through Abrahamic lineage). Distinctive as collective/familial election concept rather than individual prophethood. Dhurriyyah principle connects to covenant theology."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-013.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-013.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-003-p1 through ext-003-p4)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0127 through cand-${String(126 + candidates.candidates.length).padStart(4,'0')})`);
