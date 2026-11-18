// MFD-11 Pilot 7 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Baqarah 2:104-123 (Passages 18-20, Candidates cand-0067..cand-0076).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "002-0104-0123.json");
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

console.log("Generating pilot 7 files from verbatim corpus (2:104-123)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

// ─── Passage 18: 2:104–109 ────────────────────────────────────────────────────────
const p18 = {
  extractionId: "ext-002-p18",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 104, toAyah: 109, label: "Al-Baqarah — do not say ra'ina but unzurna; People of Book and mushrikeen wish no good sent to believers; Allah selects mercy for whom He wills; abrogation (naskh) bringing better or similar; Allah's dominion over heavens and earth; no protector besides Allah; asking messenger as Musa was asked exchanges faith for disbelief; many People of Book wish to turn believers back to kufr out of envy after truth became clear; pardon and overlook until Allah's command" },
  verseKeys: ["2:104","2:105","2:106","2:107","2:108","2:109"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `2:${i+104}`, text: fv(i+104) })),
  mainSubject: {
    label: "Believers commanded not to say ra'ina but to say unzurna and listen; painful punishment for disbelievers; neither People of Book who disbelieved nor mushrikeen wish any good sent down from Lord; Allah selects for His mercy whom He wills and is possessor of great bounty; whatever ayah is abrogated or forgotten is replaced with better or similar; Allah over all things qadeer; Allah owns mulk of heavens and earth; no waliyy or naseer besides Allah; intending to question messenger as Musa was questioned before leads to straying from sound path; exchanging kufr for iman means losing the way; many People of Book wish to turn believers back to kufr out of hasad after truth became clear; commanded to pardon and overlook until Allah brings His command; Allah over all things qadeer",
    keys: ["2:104","2:105","2:106","2:107","2:108","2:109"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Prohibition: do not say ra'ina", keys: ["2:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: say unzurna and listen", keys: ["2:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Painful punishment for kafireen", keys: ["2:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People of Book and mushrikeen do not wish good for believers", keys: ["2:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yakhtassu birahmatihi man yashaa", keys: ["2:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah dhu al-fadl al-atheem", keys: ["2:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Naskh: replacing abrogated/forgotten ayah with better or similar", keys: ["2:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah ala kulli shayin qadeer", keys: ["2:106","2:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah's mulk over samawat and ard", keys: ["2:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No waliyy or naseer besides Allah", keys: ["2:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Questioning messenger as Musa was questioned leads to straying", keys: ["2:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exchanging kufr for iman = dallala sawaa as-sabeel", keys: ["2:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Many People of Book wish to return believers to kufr out of hasad", keys: ["2:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Truth had become clear to them yet they envied", keys: ["2:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: faAAfoo waisfahoo until Allah brings His command", keys: ["2:109"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Musa being questioned by his people as precedent for inappropriate questioning", keys: ["2:108"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Envy (hasad) driving desire to revert others to disbelief despite knowing truth", keys: ["2:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Inappropriate questioning of prophet as sign of weak faith", keys: ["2:108"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0067","cand-0068","cand-0069"],
  notes: "Pass A pilot 7, passage 18/3. Contains the naskh (abrogation) principle in 2:106, speech etiquette correction in 2:104, and diagnosis of envy-driven opposition in 2:109. Links to prior passages on People of Book hostility.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:32:00.000Z"
};

// Extract commands/prohibitions from P18
{
  // 2:104 - prohibition: لَا تَقُولُواْ رَٰعِنَا
  const t104 = fv(104);
  const laTaqoolooIdx = t104.indexOf("\u0644\u064e\u0627 \u062a\u064e\u0642\u064f\u0648\u0644\u064f\u0648\u0627\u0652");
  if (laTaqoolooIdx >= 0) {
    const raaInaEnd = t104.indexOf("\u0631\u064e\u0670\u0639\u0650\u0646\u064e\u0627", laTaqoolooIdx);
    if (raaInaEnd >= 0) {
      const cmdText = t104.slice(laTaqoolooIdx, raaInaEnd + 6).trim();
      p18.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:104"], excerpt: cmdText, description: "Prohibition: do not say 'ra'ina' (a word with double meaning used disrespectfully)." });
    }
  }

  // 2:104 - command: وَقُولُواْ ٱنظُرۡنَا وَٱسۡمَعُواْ
  const waQoolooIdx = t104.indexOf("\u0648\u064e\u0642\u064f\u0648\u0644\u064f\u0648\u0627\u0652");
  if (waQoolooIdx >= 0) {
    const waismaAAooEnd = t104.indexOf("\u0648\u064e\u0671\u0633\u0652\u0645\u064e\u0639\u064f\u0648\u0627\u0652", waQoolooIdx);
    if (waismaAAooEnd >= 0) {
      const cmdText = t104.slice(waQoolooIdx, waismaAAooEnd + 9).trim();
      p18.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:104"], excerpt: cmdText, description: "Command: say 'unzurna' (look at us / attend to us) and listen." });
    }
  }

  // 2:109 - command: فَٱعۡفُواْ وَٱصۡفَحُواْ
  const t109 = fv(109);
  const faoAAfooIdx = t109.indexOf("\u0641\u064e\u0671\u0639\u0652\u0641\u064f\u0648\u0627\u0652");
  if (faoAAfooIdx >= 0) {
    const waisfahooEnd = t109.indexOf("\u0648\u064e\u0671\u0635\u0652\u0641\u064e\u062d\u064f\u0648\u0627\u0652", faoAAfooIdx);
    if (waisfahooEnd >= 0) {
      const cmdText = t109.slice(faoAAfooIdx, waisfahooEnd + 9).trim();
      p18.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:109"], excerpt: cmdText, description: "Command: pardon and overlook until Allah delivers His command." });
    }
  }
}

// Extract divine names from P18
{
  // Allah from 2:105
  const t105 = fv(105);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u0650", "\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t105.indexOf(form);
    if (idx >= 0) {
      p18.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:105"] });
      break;
    }
  }
}

// Extract terminology from P18
{
  // Ra'ina from 2:104
  const t104 = fv(104);
  const raainaIdx = t104.indexOf("\u0631\u064e\u0670\u0639\u0650\u0646\u064e\u0627");
  if (raainaIdx >= 0) {
    p18.terminology.push({ term: t104.slice(raainaIdx, raainaIdx + 6), transliteration: "ra'ina", gloss: "an ambiguous word meaning 'look at us' or 'herd us' (editorial gloss)", keys: ["2:104"] });
  }

  // Unzurna from 2:104
  const unzurnaIdx = t104.indexOf("\u0671\u0646\u0638\u064f\u0631\u0652\u0646\u064e\u0627");
  if (unzurnaIdx >= 0) {
    p18.terminology.push({ term: t104.slice(unzurnaIdx, unzurnaIdx + 7), transliteration: "unzurna", gloss: "look at us / attend to us (editorial gloss)", keys: ["2:104"] });
  }

  // Nansakh from 2:106
  const t106 = fv(106);
  const nansakhIdx = t106.indexOf("\u0646\u064e\u0646\u0633\u064e\u062e\u0652");
  if (nansakhIdx >= 0) {
    p18.terminology.push({ term: t106.slice(nansakhIdx, nansakhIdx + 5), transliteration: "nansakh", gloss: "We abrogate (editorial gloss)", keys: ["2:106"] });
  }

  // Hasad from 2:109
  const t109 = fv(109);
  const hasadIdx = t109.indexOf("\u062d\u064e\u0633\u064e\u062f\u064b\u0627");
  if (hasadIdx >= 0) {
    p18.terminology.push({ term: t109.slice(hasadIdx, hasadIdx + 5), transliteration: "hasadan", gloss: "envy (editorial gloss)", keys: ["2:109"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p18.json"), JSON.stringify(p18, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p18.json");

// ─── Passage 19: 2:110–115 ────────────────────────────────────────────────────────
const p19 = {
  extractionId: "ext-002-p19",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 110, toAyah: 115, label: "Al-Baqarah — establish prayer and give zakah; whatever good you send ahead you will find with Allah; Jews and Christians claim exclusive Paradise entry; challenge to produce proof; whoever submits face to Allah as muhsin has reward with no fear or grief; mutual rejection between Jews and Christians despite both reciting Scripture; Allah judges between them on Day of Resurrection; preventing masajid from Allah's dhikr is greatest injustice; disgrace in dunya and great punishment in akhirah; east and west belong to Allah; wherever you turn there is Allah's face; Allah wasiAA aleem" },
  verseKeys: ["2:110","2:111","2:112","2:113","2:114","2:115"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `2:${i+110}`, text: fv(i+110) })),
  mainSubject: {
    label: "Establish salah and give zakah; whatever good you send ahead for yourselves you will find with Allah; Allah baseer of what you do; Jews and Christians claim none enters Jannah except their own group; these are their wishes; challenged to bring burhan if truthful; rather whoever submits face to Allah as muhsin has ajr with Rabb with no khawf or huzn; Jews say Christians have nothing and Christians say Jews have nothing while both recite the Kitab; those who do not know say similar; Allah yahkumu baynahum on yawm al-qiyamah concerning their ikhtilaf; none more unjust than one who prevents masajid Allah from dhikr of His name and strives for their ruin; they should only enter in fear; khizy in dunya and great athaab in akhirah; to Allah belongs mashriq and maghrib; wherever you turn thamma wajh Allah; Allah wasiAA aleem",
    keys: ["2:110","2:111","2:112","2:113","2:114","2:115"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Command: aqeemoo as-salah", keys: ["2:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: aatoo az-zakah", keys: ["2:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Whatever good sent ahead found with Allah", keys: ["2:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah baseer bima taAAmaloona", keys: ["2:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exclusive salvation claim: none enters Jannah except Jew or Christian", keys: ["2:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "These are amaniyyuhum (wishful thinking)", keys: ["2:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge: haatoo burhanakum in kuntum sadiqeen", keys: ["2:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Whoever aslama wajhahu lillah as muhsin: ajr with Rabb", keys: ["2:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No khawf or huzn for the submitted muhsin", keys: ["2:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual rejection: Jews deny Christians and vice versa", keys: ["2:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Both recite the Kitab yet deny each other", keys: ["2:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those who do not know speak similarly", keys: ["2:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah judges between them on yawm al-qiyamah", keys: ["2:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Preventing masajid Allah from dhikr of His name", keys: ["2:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Striving for masjid destruction", keys: ["2:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "They should only enter masajid in fear", keys: ["2:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khizy in dunya and great athaab in akhirah for masjid preventers", keys: ["2:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "To Allah belongs mashriq and maghrib", keys: ["2:115"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wherever you turn thamma wajh Allah", keys: ["2:115"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah wasiAA aleem", keys: ["2:115"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Wishful thinking (amaniyy) as basis for exclusive salvation claims", keys: ["2:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Security from fear and grief through sincere submission and ihsan", keys: ["2:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual sectarian denial despite shared scripture", keys: ["2:113"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Masjid protection as civilizational duty; destruction as grave injustice", keys: ["2:114"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0070","cand-0071","cand-0072"],
  notes: "Pass A pilot 7, passage 19/3. Core salah/zakah command in 2:110. Universal salvation criterion in 2:112. Masjid sanctity in 2:114. Divine omnipresence in 2:115.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:32:00.000Z"
};

// Extract commands from P19
{
  // 2:110 - وَأَقِيمُواْ ٱلصَّلَوٰةَ وَءَاتُواْ ٱلزَّكَوٰةَ
  const t110 = fv(110);
  const aqeemooIdx = t110.indexOf("\u0648\u064e\u0623\u064e\u0642\u0650\u064a\u0645\u064f\u0648\u0627\u0652");
  if (aqeemooIdx >= 0) {
    const zzakahEnd = t110.indexOf("\u0671\u0644\u0632\u064e\u0651\u0643\u064e\u0648\u0670\u0629\u064e", aqeemooIdx);
    if (zzakahEnd >= 0) {
      const cmdText = t110.slice(aqeemooIdx, zzakahEnd + 8).trim();
      p19.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:110"], excerpt: cmdText, description: "Command: establish prayer and give zakah." });
    }
  }
}

// Extract divine names from P19
{
  // Allah from 2:110
  const t110 = fv(110);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u0650", "\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t110.indexOf(form);
    if (idx >= 0) {
      p19.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:110"] });
      break;
    }
  }
}

// Extract terminology from P19
{
  // Burhan from 2:111
  const t111 = fv(111);
  const burhanIdx = t111.indexOf("\u0628\u064f\u0631\u0652\u0647\u064e\u0670\u0646\u064e\u0643\u064f\u0645\u0652");
  if (burhanIdx >= 0) {
    p19.terminology.push({ term: t111.slice(burhanIdx, burhanIdx + 9), transliteration: "burhanakum", gloss: "your proof (editorial gloss)", keys: ["2:111"] });
  }

  // Muhsin from 2:112
  const t112 = fv(112);
  const muhsinIdx = t112.indexOf("\u0645\u064f\u062d\u0652\u0633\u0650\u0646\u064c");
  if (muhsinIdx >= 0) {
    p19.terminology.push({ term: t112.slice(muhsinIdx, muhsinIdx + 6), transliteration: "muhsin", gloss: "doer of good/excellence (editorial gloss)", keys: ["2:112"] });
  }

  // Masajid from 2:114
  const t114 = fv(114);
  const masajidIdx = t114.indexOf("\u0645\u064e\u0633\u064e\u0670\u062c\u0650\u062f\u064e");
  if (masajidIdx >= 0) {
    p19.terminology.push({ term: t114.slice(masajidIdx, masajidIdx + 6), transliteration: "masajid", gloss: "mosques/places of prostration (editorial gloss)", keys: ["2:114"] });
  }

  // Wajh Allah from 2:115
  const t115 = fv(115);
  const wajhIdx = t115.indexOf("\u0648\u064e\u062c\u0652\u0647\u064f \u0671\u0644\u0644\u064e\u0651\u0647\u0650");
  if (wajhIdx >= 0) {
    p19.terminology.push({ term: t115.slice(wajhIdx, wajhIdx + 9), transliteration: "wajh Allah", gloss: "Face of Allah (editorial gloss)", keys: ["2:115"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p19.json"), JSON.stringify(p19, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p19.json");

// ─── Passage 20: 2:116–123 ────────────────────────────────────────────────────────
const p20 = {
  extractionId: "ext-002-p20",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 116, toAyah: 123, label: "Al-Baqarah — Allah has taken no son; subhanahu; everything in heavens and earth belongs to Him; all are qanitoon; BadiAA of heavens and earth; kun fayakoon; ignorant demand direct speech or sign; hearts of past and present resemble each other; ayat made clear for people of yaqeen; Prophet sent with haqq as basheer and nadheer; not responsible for companions of jaheem; Jews and Christians will never be pleased until you follow their millah; hudaa Allah huwa al-hudaa; following their desires after knowledge leaves no waliyy or naseer; those given Kitab who recite it properly believe in it; disbelievers are losers; Bani Israel reminded of niAAmah and preference over worlds; fear Day when no soul suffices for another; no adl accepted; no shafaAAah benefits; no help" },
  verseKeys: ["2:116","2:117","2:118","2:119","2:120","2:121","2:122","2:123"],
  arabicExcerpts: Array.from({length:8}, (_,i) => ({ key: `2:${i+116}`, text: fv(i+116) })),
  mainSubject: {
    label: "Claim that Allah took a son refuted: subhanahu; rather to Him belongs whatever is in heavens and earth; all are qanitoon to Him; BadiAA of samawat and ard; when He decrees matter He says kun fayakoon; those who do not know ask why Allah does not speak to them or bring sign; same words spoken by those before them; their hearts resemble each other; ayat clarified for people of certainty; Prophet sent with truth as bearer of glad tidings and warner; not asked about companions of Hellfire; Jews and Christians will never be pleased until you follow their religion; guidance of Allah is the guidance; following their desires after knowledge means no protector or helper from Allah; those given Book who recite it with true recital believe in it; whoever disbelieves in it is loser; Bani Israel reminded of Allah's favor and preference over worlds; fear Day when no soul suffices for another, no compensation accepted, no intercession benefits, no help given",
    keys: ["2:116","2:117","2:118","2:119","2:120","2:121","2:122","2:123"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Refutation: Allah has taken no son", keys: ["2:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Subhanahu: Allah exalted above having offspring", keys: ["2:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Everything in heavens and earth belongs to Allah", keys: ["2:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "All creation qanitoon (devoutly obedient) to Allah", keys: ["2:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "BadiAA as-samaawaati wal-ard: Originator without precedent", keys: ["2:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kun fayakoon: divine creative command", keys: ["2:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ignorant demand direct divine speech or sign", keys: ["2:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Past nations spoke identical demands", keys: ["2:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hearts resembling each other across generations", keys: ["2:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ayat clarified for people of yaqeen", keys: ["2:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet sent with haqq as basheer and nadheer", keys: ["2:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Not accountable for companions of jaheem", keys: ["2:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jews and Christians never pleased until you follow their millah", keys: ["2:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hudaa Allah huwa al-hudaa", keys: ["2:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Following desires after knowledge: no waliyy or naseer", keys: ["2:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True reciters of Kitab believe in it", keys: ["2:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers in Kitab are khaasiroon", keys: ["2:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bani Israel reminded of niAAmah and fadl over worlds", keys: ["2:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear Day when no soul suffices for another", keys: ["2:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No adl (compensation) accepted on Judgment Day", keys: ["2:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No shafaAAah (intercession) benefits", keys: ["2:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No help given on Judgment Day", keys: ["2:123"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Prophet Muhammad sent with truth as basheer and nadheer", keys: ["2:119"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Demanding signs due to ignorance rather than seeking understanding", keys: ["2:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hearts resembling across generations: persistent pattern of disbelief", keys: ["2:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Certainty (yaqeen) as prerequisite for receiving clarified signs", keys: ["2:118"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0073","cand-0074","cand-0075","cand-0076"],
  notes: "Pass A pilot 7, passage 20/3. Tawheed core: refutation of divine sonship, BadiAA attribute, kun fayakoon. Judgment Day conditions in 2:123. True recitation concept in 2:121. Warning against following desires after knowledge in 2:120.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: "2026-11-18T16:32:00.000Z"
};

// Extract commands from P20
{
  // 2:122 - يَٰبَنِيٓ إِسۡرَـٰٓءِيلَ ٱذۡكُرُواْ نِعۡمَتِيَ
  const t122 = fv(122);
  const othkurooIdx = t122.indexOf("\u0671\u0630\u0652\u0643\u064f\u0631\u064f\u0648\u0627\u0652");
  if (othkurooIdx >= 0) {
    const niAAmatiyaEnd = t122.indexOf("\u0646\u0650\u0639\u0652\u0645\u064e\u062a\u0650\u064a\u064e", othkurooIdx);
    if (niAAmatiyaEnd >= 0) {
      const cmdText = t122.slice(othkurooIdx, niAAmatiyaEnd + 7).trim();
      p20.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:122"], excerpt: cmdText, description: "Command to Bani Israel: remember My favor which I bestowed upon you." });
    }
  }

  // 2:123 - وَٱتَّقُواْ يَوۡمٗا
  const t123 = fv(123);
  const waittaqooIdx = t123.indexOf("\u0648\u064e\u0671\u062a\u0651\u064e\u0642\u064f\u0648\u0627\u0652");
  if (waittaqooIdx >= 0) {
    const yawmanEnd = t123.indexOf("\u064a\u064e\u0648\u0652\u0645\u064b\u0627", waittaqooIdx);
    if (yawmanEnd >= 0) {
      const cmdText = t123.slice(waittaqooIdx, yawmanEnd + 5).trim();
      p20.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:123"], excerpt: cmdText, description: "Command: fear a Day when no soul suffices for another." });
    }
  }
}

// Extract divine names from P20
{
  // Allah from 2:116
  const t116 = fv(116);
  for (const form of ["\u0671\u0644\u0644\u064e\u0651\u0647\u0650", "\u0671\u0644\u0644\u064e\u0651\u0647\u064f", "\u0671\u0644\u0644\u064e\u0651\u0647\u064e", "\u0627\u0644\u0644\u0647"]) {
    const idx = t116.indexOf(form);
    if (idx >= 0) {
      p20.divineNamesAndAttributes.push({ term: form, transliteration: "Allah", gloss: "The divine name (editorial gloss)", keys: ["2:116"] });
      break;
    }
  }

  // Subhanahu from 2:116
  const subhanaIdx = t116.indexOf("\u0633\u064f\u0628\u0652\u062d\u064e\u0670\u0646\u064e\u0647\u064f");
  if (subhanaIdx >= 0) {
    p20.divineNamesAndAttributes.push({ term: t116.slice(subhanaIdx, subhanaIdx + 7), transliteration: "Subhanahu", gloss: "Exalted is He (editorial gloss)", keys: ["2:116"] });
  }

  // BadeeAA from 2:117
  const t117 = fv(117);
  const badeeAAIdx = t117.indexOf("\u0628\u064e\u062f\u0650\u064a\u0639\u064f");
  if (badeeAAIdx >= 0) {
    p20.divineNamesAndAttributes.push({ term: t117.slice(badeeAAIdx, badeeAAIdx + 5), transliteration: "Badee'", gloss: "Originator/Creator without precedent (editorial gloss)", keys: ["2:117"] });
  }
}

// Extract terminology from P20
{
  // Qanitoon from 2:116
  const t116 = fv(116);
  const qanitoonIdx = t116.indexOf("\u0642\u064e\u0670\u0646\u0650\u062a\u064f\u0648\u0646\u064e");
  if (qanitoonIdx >= 0) {
    p20.terminology.push({ term: t116.slice(qanitoonIdx, qanitoonIdx + 6), transliteration: "qanitoon", gloss: "devoutly obedient (editorial gloss)", keys: ["2:116"] });
  }

  // Kun fayakoon from 2:117
  const t117 = fv(117);
  const kunIdx = t117.indexOf("\u0643\u064f\u0646 \u0641\u064e\u064a\u064e\u0643\u064f\u0648\u0646\u064f");
  if (kunIdx >= 0) {
    p20.terminology.push({ term: t117.slice(kunIdx, kunIdx + 9), transliteration: "kun fayakoon", gloss: "Be, and it is (editorial gloss)", keys: ["2:117"] });
  }

  // Basheer from 2:119
  const t119 = fv(119);
  const basheerIdx = t119.indexOf("\u0628\u064e\u0634\u0650\u064a\u0631\u064b\u0627");
  if (basheerIdx >= 0) {
    p20.terminology.push({ term: t119.slice(basheerIdx, basheerIdx + 5), transliteration: "basheeran", gloss: "bringer of glad tidings (editorial gloss)", keys: ["2:119"] });
  }

  // Nadheer from 2:119
  const nadheerIdx = t119.indexOf("\u0648\u064e\u0646\u064e\u0630\u0650\u064a\u0631\u064b\u0627");
  if (nadheerIdx >= 0) {
    p20.terminology.push({ term: t119.slice(nadheerIdx, nadheerIdx + 6), transliteration: "wanadheeran", gloss: "and warner (editorial gloss)", keys: ["2:119"] });
  }

  // Millah from 2:120
  const t120 = fv(120);
  const millahIdx = t120.indexOf("\u0645\u0650\u0644\u064e\u0651\u062a\u064e\u0647\u064f\u0645\u0652");
  if (millahIdx >= 0) {
    p20.terminology.push({ term: t120.slice(millahIdx, millahIdx + 7), transliteration: "millatahum", gloss: "their religion/creed (editorial gloss)", keys: ["2:120"] });
  }

  // ShafaAAah from 2:123
  const t123 = fv(123);
  const shafaAAahIdx = t123.indexOf("\u0634\u064e\u0641\u064e\u0670\u0639\u064e\u0629\u064c");
  if (shafaAAahIdx >= 0) {
    p20.terminology.push({ term: t123.slice(shafaAAahIdx, shafaAAahIdx + 6), transliteration: "shafa'ah", gloss: "intercession (editorial gloss)", keys: ["2:123"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p20.json"), JSON.stringify(p20, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p20.json");

// ─── Candidates batch (cand-0067 through cand-0076) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: "2026-11-18T16:32:00.000Z",
  sourceExtraction: "ext-002-p18,ext-002-p19,ext-002-p20",
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
    createdAt: "2026-11-18T16:32:00.000Z"
  };
  if (arabicLabel) c.arabicLabel = arabicLabel;
  if (urduLabel) c.urduLabel = urduLabel;
  if (notes) c.notes = notes;
  return c;
}

// cand-0067: Abrogation (naskh) principle
candidates.candidates.push(makeCand("cand-0067",
  "Abrogation (naskh): replacing verses with better or similar",
  undefined, "\u0646\u0633\u062e: \u0622\u06cc\u0627\u062a \u06a9\u06cc \u062a\u0628\u062f\u06cc\u0644\u06cc \u0628\u06c1\u062a\u0631 \u06cc\u0627 \u0645\u0645\u0627\u062b\u0644 \u0633\u06d2",
  "In 2:106: whatever ayah We abrogate (nansakh) or cause to be forgotten, We bring better or similar; establishing divine authority over revelation modification.",
  [{ key: "2:106", excerpt: fv(106), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse states the naskh principle with replacement guarantee." }],
  [],
  "Gap candidate: foundational naskh doctrine verse. Distinguishes abrogation from forgetting."
));

// cand-0068: Speech etiquette with the Prophet — ra'ina vs unzurna
candidates.candidates.push(makeCand("cand-0068",
  "Speech etiquette: replacing ambiguous ra'ina with respectful unzurna",
  undefined, "\u0628\u0627\u062a \u06a9\u0631\u0646\u06d2 \u06a9\u0627 \u0622\u062f\u0627\u0628: \u0631\u0627\u0639\u0646\u0627 \u06a9\u06cc \u062c\u06af\u06c1 \u0627\u0646\u0638\u0631\u0646\u0627",
  "In 2:104: believers commanded not to say 'ra'ina' (ambiguous word with disrespectful connotation) but to say 'unzurna' (attend to us) and listen — establishing respectful address to the Prophet.",
  [{ key: "2:104", excerpt: fv(104), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse contains both the prohibition and the prescribed alternative." }],
  [],
  "Gap candidate: unique speech etiquette correction addressing linguistic ambiguity."
));

// cand-0069: Envy-driven wish to revert believers to disbelief
candidates.candidates.push(makeCand("cand-0069",
  "Post-truth envy: wishing to revert believers after truth became clear",
  undefined, "\u062d\u0642 \u0638\u0627\u06c1\u0631 \u06c1\u0648\u0646\u06d2 \u06a9\u06d2 \u0628\u0639\u062f \u062d\u0633\u062f \u0633\u06d2 \u06a9\u0641\u0631 \u067e\u0631 \u0648\u0627\u067e\u0633 \u0644\u0627\u0646\u06d2 \u06a9\u06cc \u062e\u0648\u0627\u06c1\u0634",
  "In 2:109: many People of Book wish to turn believers back to kufr out of hasad from themselves even after truth became clear to them; believers commanded to pardon and overlook.",
  [{ key: "2:109", excerpt: fv(109), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse identifies post-clarity envy as motive and prescribes patient response." }],
  [],
  "Distinguishes post-truth envy from pre-truth ignorance. Links to hasad theme."
));

// cand-0070: Establishing salah and zakah as paired obligations
candidates.candidates.push(makeCand("cand-0070",
  "Salah and zakah: paired establishment as pillars of devotion",
  undefined, "\u0646\u0645\u0627\u0632 \u0627\u0648\u0631 \u0632\u06a9\u0648\u06c3\u06c1: \u0639\u0628\u0627\u062f\u062a \u06a9\u06d2 \u062f\u0648 \u0633\u062a\u0648\u0646",
  "In 2:110: believers commanded to establish prayer and give zakah together, with assurance that whatever good sent ahead will be found with Allah.",
  [{ key: "2:110", excerpt: fv(110), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse pairs salah and zakah commands with divine reward assurance." }],
  [{ topicId: "five-daily-prayers", layer: "scholarly", relationship: "same-concept" },
   { topicId: "zakat-calculation", layer: "scholarly", relationship: "related-not-identical" }],
  "Core salah-zakah pairing verse. Forward-looking reward motivation."
));

// cand-0071: Universal salvation criterion — islam and ihsan
candidates.candidates.push(makeCand("cand-0071",
  "Universal salvation: submitting face to Allah with ihsan",
  undefined, "\u0639\u0627\u0644\u0645\u06af\u06cc\u0631 \u0646\u062c\u0627\u062a: \u0627\u0644\u0644\u06c1 \u06a9\u06d2 \u0622\u06af\u06d2 \u062c\u06be\u06a9\u0646\u0627 \u0627\u0648\u0631 \u0627\u062d\u0633\u0627\u0646",
  "In 2:112: whoever submits his face to Allah as muhsin has reward with his Lord; no fear upon them nor grief — establishing universal criterion beyond ethnic/religious identity.",
  [{ key: "2:112", excerpt: fv(112), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse defines salvation by submission and excellence, not group membership." }],
  [{ topicId: "tawheed-rububiyyah", layer: "scholarly", relationship: "related-not-identical" }],
  "Direct rebuttal to exclusive salvation claims in 2:111. Defines islam as universal submission."
));

// cand-0072: Masjid sanctity and prevention of Allah's dhikr
candidates.candidates.push(makeCand("cand-0072",
  "Masjid sanctity: preventing Allah's remembrance as gravest injustice",
  undefined, "\u0645\u0633\u062c\u062f \u06a9\u06cc \u062d\u0631\u0645\u062a: \u0627\u0644\u0644\u06c1 \u06a9\u06d2 \u0630\u06a9\u0631 \u06a9\u0648 \u0631\u0648\u06a9\u0646\u0627 \u0633\u0628 \u0633\u06d2 \u0628\u0691\u0627 \u0638\u0644\u0645",
  "In 2:114: none more unjust than one who prevents masajid Allah from dhikr of His name and strives for their destruction; they should only enter in fear; disgrace in dunya and great punishment in akhirah.",
  [{ key: "2:114", excerpt: fv(114), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes masjid protection as sacred duty with severe consequences." }],
  [],
  "Gap candidate: comprehensive masjid sanctity doctrine with worldly and otherworldly consequences."
));

// cand-0073: Refutation of divine sonship and affirmation of tawheed
candidates.candidates.push(makeCand("cand-0073",
  "Refutation of divine sonship: subhanahu and universal qanitoon",
  undefined, "\u0627\u0644\u0644\u06c1 \u06a9\u06d2 \u0628\u06cc\u0679\u06d2 \u06a9\u0627 \u0627\u0646\u06a9\u0627\u0631 \u0627\u0648\u0631 \u062a\u0648\u062d\u06cc\u062f \u06a9\u0627 \u0627\u062b\u0628\u0627\u062a",
  "In 2:116: they say Allah took a son; subhanahu! Rather to Him belongs whatever is in heavens and earth; all are qanitoon to Him — absolute refutation of divine offspring.",
  [{ key: "2:116", excerpt: fv(116), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse refutes sonship claim and affirms universal divine ownership and obedience." }],
  [{ topicId: "tawheed-rububiyyah", layer: "scholarly", relationship: "same-concept" },
   { topicId: "tawheed", layer: "curated", relationship: "same-concept" }],
  "Core tawheed verse refuting trinitarian/pagan sonship claims."
));

// cand-0074: BadiAA and kun fayakoon — divine origination and creative command
candidates.candidates.push(makeCand("cand-0074",
  "Divine origination (BadiAA) and creative command (kun fayakoon)",
  undefined, "\u0628\u062f\u06cc\u0639 \u0627\u0648\u0631 \u06a9\u0646 \u0641\u06cc\u06a9\u0648\u0646: \u0627\u0644\u0644\u06c1 \u06a9\u0627 \u0628\u062f\u06cc\u0639 \u06c1\u0648\u0646\u0627 \u0627\u0648\u0631 \u062a\u062e\u0644\u06cc\u0642\u06cc \u062d\u06a9\u0645",
  "In 2:117: Allah is BadiAA (Originator) of heavens and earth; when He decrees a matter He only says 'kun' (Be) and it is (fayakoon) — establishing effortless divine creation without precedent.",
  [{ key: "2:117", excerpt: fv(117), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse names BadiAA attribute and demonstrates instant creative command." }],
  [{ topicId: "divine-power", layer: "scholarly", relationship: "same-concept" }],
  "Key verse for divine creative power. BadiAA implies creation without prior model."
));

// cand-0075: Warning against following desires after receiving knowledge
candidates.candidates.push(makeCand("cand-0075",
  "Following desires after knowledge: loss of divine protection",
  undefined, "\u0639\u0644\u0645 \u0622\u0646\u06d2 \u06a9\u06d2 \u0628\u0639\u062f \u062e\u0648\u0627\u06c1\u0634 \u0646\u0641\u0633 \u06a9\u06cc \u067e\u06cc\u0631\u0648\u06cc: \u0627\u0644\u0644\u06c1 \u06a9\u06cc \u062d\u0645\u0627\u06cc\u062a \u0633\u06d2 \u0645\u062d\u0631\u0648\u0645\u06cc",
  "In 2:120: if you follow their desires after what has come to you of knowledge, you would have against Allah no protector or helper — warning that knowledge increases accountability.",
  [{ key: "2:120", excerpt: fv(120), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse warns that post-knowledge deviation removes divine protection." }],
  [{ topicId: "divine-knowledge", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: knowledge-accountability nexus. Post-knowledge sin worse than pre-knowledge ignorance."
));

// cand-0076: Judgment Day conditions — no sufficiency, compensation, intercession, or help
candidates.candidates.push(makeCand("cand-0076",
  "Judgment Day: no soul suffices for another; no compensation, intercession, or help",
  undefined, "\u06cc\u0648\u0645 \u0642\u06cc\u0627\u0645\u062a: \u0646\u06c1 \u06a9\u0648\u0626\u06cc \u06a9\u0633\u06cc \u06a9\u06d2 \u06a9\u0627\u0645 \u0622\u0626\u06d2\u06af\u0627\u060c \u0646\u06c1 \u0641\u062f\u06cc\u06c1\u060c \u0646\u06c1 \u0634\u0641\u0627\u0639\u062a\u060c \u0646\u06c1 \u0645\u062f\u062f",
  "In 2:123: fear a Day when no soul suffices for another at all, no compensation accepted, no intercession benefits, no help given — comprehensive description of individual accountability.",
  [{ key: "2:123", excerpt: fv(123), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse enumerates four negations establishing absolute individual accountability." }],
  [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "same-concept" }],
  "Comprehensive Judgment Day verse. Four-fold negation of external rescue mechanisms."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-007.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-007.json with ${candidates.candidates.length} candidates`);

console.log("\nDone. Run validator to confirm.");
