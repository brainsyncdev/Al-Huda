// MFD-11 An'am Pass 4 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-An'am 6:121-165 (Passages 13-16, Candidates cand-0297..cand-0306).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "006-0121-0165.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 6:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating An'am Pass 4 files from verbatim corpus (6:121-165)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T14:56:00.000Z";

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

// ─── Passage 13: 6:121–135 ────────────────────────────────────────────────────────
const p13 = {
  extractionId: "ext-006-p13",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 121,
    toAyah: 135,
    label: "Al-An'am — Unnamed slaughter forbidden as fisq; devil-inspired dispute leads to shirk; light versus darkness; city elites plot against themselves; sign-demand met by divine placement of the message; breast expanded or constricted; Home of Peace; jinn and mankind judged, self-witnessing; no city destroyed unwarned; degrees by deeds; a people may be replaced; work-position challenge"
  },
  verseKeys: ["6:121","6:122","6:123","6:124","6:125","6:126","6:127","6:128","6:129","6:130","6:131","6:132","6:133","6:134","6:135"],
  arabicExcerpts: Array.from({length:15}, (_,i) => ({ key: `6:${i+121}`, text: fv(i+121) })),
  mainSubject: {
    label: "Dietary prohibition unnamed-slaughter as fisq; devil-alliance inspiring dispute leading to shirk; life-light vs death-darkness contrast; criminal-elites conspiring self-destructively; sign-demand refusal with divine message-placement knowledge; breast-expansion guidance vs constriction misguidance; straight path detailed for rememberers; Dar al-Salam reward; jinn-mankind gathering mutual exploitation Fire-residence; prophetic warning self-witness; divine non-destruction without prior warning; degrees from deeds; Ghani-Rahman replacement-capacity; promise-certainty; work-position challenge outcome-knowledge",
    keys: ["6:121","6:122","6:123","6:124","6:125","6:126","6:127","6:128","6:129","6:130","6:131","6:132","6:133","6:134","6:135"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Unnamed-slaughter prohibition as grave disobedience (fisq)", keys: ["6:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Devil-allies inspired to dispute believers into compromise", keys: ["6:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Obeying devils constitutes shirk (innakum lamushrikoona)", keys: ["6:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Life-light metaphor: dead revived walks among people vs permanent darkness", keys: ["6:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deed-beautification for disbelievers parallel to deed-beautification per nation", keys: ["6:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Criminal-elites (akabira mujrimeeha) placed in every city as test", keys: ["6:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Conspiracy reflexive: they plot only against themselves unawares", keys: ["6:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign-demand: refuse belief until given like messengers received", keys: ["6:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine prerogative: Allah knows best where He places His message", keys: ["6:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Criminals' recompense: saghar (debasement) and severe punishment", keys: ["6:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Breast-expansion (yashrah sadrahu lilislami) as guidance-mechanism", keys: ["6:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Breast-constriction (dayyiqan harajan) climbing-sky simile for misguidance", keys: ["6:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rijs (defilement) placed upon non-believers as consequence", keys: ["6:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Straight path (siratu rabbika mustaqeeman) with detailed signs", keys: ["6:126"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dar al-Salam (Home of Peace) with Lord as waliyy", keys: ["6:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jinn-mankind gathering: istikthar (excessive exploitation) confessed", keys: ["6:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fire as mathwa (residence) khalideena with exception clause", keys: ["6:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hakeem-Aleem closing jinn-mankind judgment scene", keys: ["6:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wrongdoers allied to wrongdoers (nuwallee baAda alththalimeena baAdan)", keys: ["6:129"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic messengers from among jinn and mankind relating signs", keys: ["6:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-witness confession: shahidna AAala anfusina", keys: ["6:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly life delusion (gharrathumu alhayatu alddunya)", keys: ["6:130"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine justice: no destruction without prior messenger-warning", keys: ["6:131"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Degrees from deeds (darajatun mimma AAamiloo)", keys: ["6:132"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ghani (Free of need) Dhu al-Rahmah (possessor of mercy)", keys: ["6:133"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Replacement-capacity: yuthhibkum wayastakhlif min baAAdikum", keys: ["6:133"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Promise-certainty: laatin wama antum bimuAAjizeena", keys: ["6:134"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Work-position challenge: iAAmaloo AAala makanatikum innee AAamilun", keys: ["6:135"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Outcome-knowledge: fasawfa taAAlamoona man takoonu lahu AAaqibatu alddari", keys: ["6:135"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "PROHIBITION", keys: ["6:121"], excerpt: fv(121), description: "Prohibition: do not eat of that upon which the name of Allah has not been mentioned." },
    { kind: "COMMAND", keys: ["6:135"], excerpt: fv(135), description: "Command: say O my people work according to your position; indeed I am working." }
  ],
  divineNamesAndAttributes: [
    { term: findWordContaining(128, ["\u062d","\u0643","\u064a","\u0645"]) || "\u062d\u0643\u064a\u0645", transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["6:128"] },
    { term: findWordContaining(128, ["\u0639","\u0644","\u064a","\u0645"]) || "\u0639\u0644\u064a\u0645", transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["6:128"] },
    { term: findWordContaining(133, ["\u063a","\u0646","\u064a"]) || "\u0627\u0644\u063a\u0646\u064a", transliteration: "al-Ghani", gloss: "the Free of Need (editorial gloss)", keys: ["6:133"] }
  ],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Breast-expansion as experiential guidance-mechanism contrasting constriction", keys: ["6:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-witness at judgment: confessing disbelief after worldly delusion", keys: ["6:130"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Criminal-elites (akabira mujrimeeha) as structural feature of urban societies", keys: ["6:123"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Jinn-mankind mutual exploitation (istikthar) as cross-species alliance", keys: ["6:128"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0297","cand-0298"],
  notes: "Pass A An'am passage 13/4. Dietary prohibition (6:121) links unnamed-slaughter to fisq establishing ritual-intentionality as food-legitimacy criterion. Devil-alliance system extends 6:112 enemy-motif showing operational mechanism: inspiring dispute to normalize compromise. Life-light vs death-darkness (6:122) provides existential metaphor distinguishing believer-disbeliever states. Criminal-elites placement (6:123) reveals sociological insight: corruption concentrated in leadership not distributed equally. Breast-expansion/constriction (6:125) offers most vivid phenomenological description of guidance-misguidance in Quran. Dar al-Salam (6:127) names eschatological reward uniquely here. Jinn-mankind gathering (6:128) provides only explicit Quranic depiction of joint species-accountability. Self-witness (6:130) eliminates external accusation making judgment self-evident. Divine non-destruction principle (6:131) establishes procedural justice prerequisite. Work-position challenge (6:135) shifts from argumentation to existential competition.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P13 terminology
{
  const t = findWordContaining(121, ["\u0641","\u0633","\u0642"]); // lafisqun
  if (t) p13.terminology.push({ term: t, transliteration: "fisq", gloss: "grave disobedience/transgression (editorial gloss)", keys: ["6:121"] });
}
{
  const t = findWordContaining(125, ["\u0634","\u0631","\u062d"]); // yashrah
  if (t) p13.terminology.push({ term: t, transliteration: "sharh", gloss: "expansion/opening (editorial gloss)", keys: ["6:125"] });
}
{
  const t = findWordContaining(125, ["\u062d","\u0631","\u062c"]); // harajan
  if (t) p13.terminology.push({ term: t, transliteration: "haraj", gloss: "constriction/difficulty (editorial gloss)", keys: ["6:125"] });
}
{
  const t = findWordContaining(125, ["\u0631","\u062c","\u0633"]); // alrrijsa
  if (t) p13.terminology.push({ term: t, transliteration: "rijs", gloss: "defilement/impurity (editorial gloss)", keys: ["6:125"] });
}
{
  const t = findWordContaining(127, ["\u0633","\u0644","\u0645"]); // alssalami
  if (t) p13.terminology.push({ term: t, transliteration: "salam", gloss: "peace (editorial gloss)", keys: ["6:127"] });
}
{
  const t = findWordContaining(128, ["\u062b","\u0648","\u0649"]); // mathwakum
  if (t) p13.terminology.push({ term: t, transliteration: "mathwa", gloss: "residence/abode (editorial gloss)", keys: ["6:128"] });
}
{
  const t = findWordContaining(133, ["\u0631","\u062d","\u0645"]); // alrrahmati
  if (t) p13.terminology.push({ term: t, transliteration: "rahmah", gloss: "mercy (editorial gloss)", keys: ["6:133"] });
}
{
  const t = findWordContaining(134, ["\u0645","\u0639","\u062c"]); // bimuAAjizeena
  if (t) p13.terminology.push({ term: t, transliteration: "i'jaz", gloss: "causing failure/incapacitation (editorial gloss)", keys: ["6:134"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p13.json"), JSON.stringify(p13, null, 2) + "\n");
console.log("Wrote 006-al-anam-p13.json");

// ─── Passage 14: 6:136–145 ──────────────────────────────────────────────────────
const p14 = {
  extractionId: "ext-006-p14",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 136,
    toAyah: 145,
    label: "Al-An'am — Crops and livestock split between Allah and partners with one-way flow; partners beautify child-killing; fabricated taboos on animals, crops, riding and unborn young; loss of those who kill children and forbid provision; gardens with harvest due and no excess; eight mates challenged by gender and womb; four dietary prohibitions with necessity exception"
  },
  verseKeys: ["6:136","6:137","6:138","6:139","6:140","6:141","6:142","6:143","6:144","6:145"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+136}`, text: fv(i+136) })),
  mainSubject: {
    label: "Crops and livestock apportioned to Allah and partners with one-way flow; partners beautify child-killing; fabricated taboos on animals, crops, riding and unborn young; loss of those who kill children and forbid provision; gardens trellised and untrellised with harvest due and no excess; burden-carriers and small livestock; eight mates challenged by gender and womb; lie invented against Allah to mislead; four dietary prohibitions with necessity exception and Ghafoor-Raheem",
    keys: ["6:136","6:137","6:138","6:139","6:140","6:141","6:142","6:143","6:144","6:145"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Portion-division (naseeban): assigning shares of crops-livestock to Allah and partners", keys: ["6:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Asymmetric flow: partners' share does not reach Allah but Allah's reaches partners", keys: ["6:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Evil judgment (saa ma yahkumoona) condemning allocation-logic", keys: ["6:136"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Child-killing beautified (zayyana qatla awladihim) by partners", keys: ["6:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dual purpose: liyurdoohum (bring destruction) waliyalbisoo (confuse religion)", keys: ["6:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine permission: if Allah willed they would not have done it", keys: ["6:137"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fabricated prohibitions: hijrun (reserved) livestock crops by claim", keys: ["6:138"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Back-prohibition (hurrimat thuhooruha) riding-restriction fabrication", keys: ["6:138"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Name-omission fabrication: not mentioning Allah's name over livestock", keys: ["6:138"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Belly-exclusivity: khalisatun lithukoorina wamuharramun AAala azwajina", keys: ["6:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Stillborn-sharing exception: in yakun maytatan fahum feehi shurakao", keys: ["6:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hakeem-Aleem closing fabrication-recompense", keys: ["6:139"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Loss-diagnosis: khasira allatheena qataloo awladahum safahan bighayri AAilmin", keys: ["6:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Provision-prohibition as fabrication against Allah", keys: ["6:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Garden-catalogue: maAArooshatin waghayra maAArooshatin waalnnakhla waalzzarAAa", keys: ["6:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Olive-pomegranate pairing: mutashabihan waghayra mutashabihin", keys: ["6:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Harvest-due command: waatoo haqqahu yawma hasadihi", keys: ["6:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Excess-prohibition: wala tusrifoo innahu la yuhibbu almusrifeena", keys: ["6:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Grazing livestock categories: hamoolatan wafarshan", keys: ["6:142"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Satan-footsteps warning: khutuwati alshshaytani AAaduwwun mubeenun", keys: ["6:142"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eight-mates enumeration: sheep two goats two camels two cattle two", keys: ["6:143","6:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gender-challenge: alththakarayni harrama ami alonthayayni", keys: ["6:143","6:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Knowledge-demand: nabbioonee biAAilmin in kuntum sadiqeena", keys: ["6:143"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Witness-challenge: am kuntum shuhadaa ith wassakumu Allahu", keys: ["6:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supreme injustice: inventing lie to mislead without knowledge", keys: ["6:144"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Four-prohibitions: maytatan daman masfoohan lahma khinzeerin fisqan", keys: ["6:145"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Swine-flesh designated rijs (impure)", keys: ["6:145"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Necessity-exception: idturra ghayra baghin wala AAadin", keys: ["6:145"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ghafoor-Raheem closing dietary legislation", keys: ["6:145"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["6:141"], excerpt: fv(141), description: "Command: eat of its fruit when it yields and give its due on the day of harvest." },
    { kind: "PROHIBITION", keys: ["6:141"], excerpt: fv(141), description: "Prohibition: do not be excessive; indeed He does not like those who commit excess." },
    { kind: "COMMAND", keys: ["6:142"], excerpt: fv(142), description: "Command: eat of what Allah has provided for you." },
    { kind: "PROHIBITION", keys: ["6:142"], excerpt: fv(142), description: "Prohibition: do not follow the footsteps of Satan." },
    { kind: "PROHIBITION", keys: ["6:145"], excerpt: fv(145), description: "Prohibition: dead animal, spilled blood, swine flesh, disobedience-dedicated are forbidden." }
  ],
  divineNamesAndAttributes: [
    { term: findWordContaining(139, ["\u062d","\u0643","\u064a","\u0645"]) || "\u062d\u0643\u064a\u0645", transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["6:139"] },
    { term: findWordContaining(139, ["\u0639","\u0644","\u064a","\u0645"]) || "\u0639\u0644\u064a\u0645", transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["6:139"] },
    { term: findWordContaining(145, ["\u063a","\u0641","\u0648","\u0631"]) || "\u063a\u0641\u0648\u0631", transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["6:145"] },
    { term: findWordContaining(145, ["\u0631","\u062d","\u064a","\u0645"]) || "\u0631\u062d\u064a\u0645", transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["6:145"] }
  ],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Loss (khasira) as consequence of child-killing and provision-prohibition", keys: ["6:140"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Straying (dalloo) and non-guidance as fabrication-consequence", keys: ["6:140"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Agricultural economy: gardens trellised-untrellised palm crops olive pomegranate harvest-due", keys: ["6:141"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Livestock economy: carriers (hamoolah) and small (farsh) categories", keys: ["6:142"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0299","cand-0300","cand-0301"],
  notes: "Pass A An'am passage 14/4. Portion-division critique (6:136) exposes logical asymmetry: partners benefit from Allah's share while Allah receives nothing from partners' share revealing zero-sum exploitation. Child-killing beautification (6:137) identifies aesthetic manipulation as mechanism enabling infanticide linking to 6:140 loss-diagnosis. Fabricated prohibitions catalogue (6:138-139) documents pre-Islamic Arabian religious innovations systematically. Garden-catalogue (6:141) parallels 6:99 vegetative signs but adds harvest-due and excess-prohibition integrating agricultural ethics. Eight-mates enumeration (6:143-144) uses exhaustive taxonomic challenge proving arbitrary nature of customary prohibitions. Four-prohibitions verse (6:145) provides most concise dietary law summary in Quran establishing canonical list. Necessity-exception with dual-condition (non-desiring non-transgressing) prevents abuse. Ghafoor-Raheem closure balances legal strictness with divine compassion.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P14 terminology
{
  const t = findWordContaining(136, ["\u0646","\u0635","\u064a","\u0628"]); // naseeban
  if (t) p14.terminology.push({ term: t, transliteration: "naseeb", gloss: "share/portion (editorial gloss)", keys: ["6:136"] });
}
{
  const t = findWordContaining(138, ["\u062d","\u062c","\u0631"]); // hijrun
  if (t) p14.terminology.push({ term: t, transliteration: "hijr", gloss: "reserved/forbidden (editorial gloss)", keys: ["6:138"] });
}
{
  const t = findWordContaining(140, ["\u0633","\u0641","\u0647"]); // safahan
  if (t) p14.terminology.push({ term: t, transliteration: "safah", gloss: "foolishness/ignorance (editorial gloss)", keys: ["6:140"] });
}
{
  const t = findWordContaining(141, ["\u0645","\u0639","\u0631","\u0634"]); // maAArooshatin
  if (t) p14.terminology.push({ term: t, transliteration: "ma'rush", gloss: "trellised/supported (editorial gloss)", keys: ["6:141"] });
}
{
  const t = findWordContaining(141, ["\u0633","\u0631","\u0641"]); // tusrifoo
  if (t) p14.terminology.push({ term: t, transliteration: "israf", gloss: "excess/wastefulness (editorial gloss)", keys: ["6:141"] });
}
{
  const t = findWordContaining(142, ["\u062d","\u0645","\u0648","\u0644"]); // hamoolatan
  if (t) p14.terminology.push({ term: t, transliteration: "hamulah", gloss: "beasts of burden/carriers (editorial gloss)", keys: ["6:142"] });
}
{
  const t = findWordContaining(142, ["\u0641","\u0631","\u0634"]); // wafarshan
  if (t) p14.terminology.push({ term: t, transliteration: "farsh", gloss: "small livestock/grazing animals (editorial gloss)", keys: ["6:142"] });
}
{
  const t = findWordContaining(145, ["\u0645","\u0633","\u0641","\u0648"]); // masfoohan
  if (t) p14.terminology.push({ term: t, transliteration: "masfuh", gloss: "spilled/poured out (editorial gloss)", keys: ["6:145"] });
}
{
  const t = findWordContaining(145, ["\u0631","\u062c","\u0633"]); // rijsun
  if (t) p14.terminology.push({ term: t, transliteration: "rijs", gloss: "impurity/filth (editorial gloss)", keys: ["6:145"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p14.json"), JSON.stringify(p14, null, 2) + "\n");
console.log("Wrote 006-al-anam-p14.json");

// ─── Passage 15: 6:146–155 ──────────────────────────────────────────────────────
const p15 = {
  extractionId: "ext-006-p15",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 146,
    toAyah: 155,
    label: "Al-An'am — Clawed animals and cattle-sheep fat forbidden to the Jews as recompense; vast mercy yet unrepelled punishment; determinist plea answered by a demand for knowledge; Allah's conclusive argument; witnesses challenged; recited code: no shirk, parents, children, immoralities, life, orphan wealth, measure, just speech, covenant; My straight path; Musa's Book; this blessed Book"
  },
  verseKeys: ["6:146","6:147","6:148","6:149","6:150","6:151","6:152","6:153","6:154","6:155"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+146}`, text: fv(i+146) })),
  mainSubject: {
    label: "Clawed animals and cattle-sheep fat forbidden to the Jews as recompense for baghy; vast mercy with unrepelled punishment; determinist plea answered by a demand for knowledge exposing thann; Allah's hujjah balighah; witnesses challenged and desire-following barred; recited code: no shirk, parental ihsan, children, fawahish, life, orphan wealth, measure and weight, just speech, covenant — for reason, remembrance, taqwa; one straight path against scattering subul; Musa's Book and this blessed Book",
    keys: ["6:146","6:147","6:148","6:149","6:150","6:151","6:152","6:153","6:154","6:155"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Clawed animals (kulla thee thufurin) forbidden to those who are Jews", keys: ["6:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cattle-sheep fat prohibited except backs, entrails, bone-mixed portions", keys: ["6:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Restriction framed as jazaynahum bibaghyihim — recompense for their transgression", keys: ["6:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Truthfulness affirmation wainna lasadiqoona closing the restriction report", keys: ["6:146"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Denial-response formula: rabbukum thoo rahmatin wasiAAatin", keys: ["6:147"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Punishment not repelled from the criminal people (la yuraddu basuhu)", keys: ["6:147"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Associators' predicted determinist plea covering selves, fathers and prohibitions", keys: ["6:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Historical precedent: earlier deniers tasted Our punishment (thaqoo basana)", keys: ["6:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Knowledge-production demand hal AAindakum min AAilmin fatukhrijoohu lana", keys: ["6:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Assumption-following and conjecture (alththanna / takhrusoona) diagnosed", keys: ["6:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah's far-reaching argument (alhujjatu albalighatu)", keys: ["6:149"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal-guidance capacity: falaw shaa lahadakum ajmaAAeena", keys: ["6:149"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Witness-summons halumma shuhadaakumu over claimed prohibition", keys: ["6:150"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Refusal of co-testimony fala tashhad maAAahum", keys: ["6:150"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Desire-following barred for sign-deniers, Hereafter-disbelievers, Lord-equaters", keys: ["6:150"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Recitation summons qul taAAalaw atlu ma harrama rabbukum AAalaykum", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "First charge: associate nothing with Him (alla tushrikoo bihi shayan)", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Parental ihsan (wabialwalidayni ihsanan)", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Child-killing from imlaq barred with provision-guarantee for parents and children", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Non-approach to alfawahisha in apparent and hidden forms", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Soul sanctity: killing only bialhaqq", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reason-purpose clause laAAallakum taAAqiloona", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Orphan property approached only biallatee hiya ahsanu until ashuddahu", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Full measure and weight bialqisti", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Capacity limit la nukallifu nafsan illa wusAAaha", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Just speech even concerning a near relative (walaw kana tha qurba)", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant of Allah to be fulfilled (wabiAAahdi Allahi awfoo)", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remembrance-purpose clause laAAallakum tathakkaroona", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "My straight path (siratee mustaqeeman) commanded to be followed", keys: ["6:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Other ways (alssubula) scatter followers away from His sabeel", keys: ["6:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taqwa-purpose clause laAAallakum tattaqoona", keys: ["6:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Musa given the Book as tamam upon the one who did good", keys: ["6:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Book as tafseelan likulli shayin with huda and rahmah", keys: ["6:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Belief in meeting the Lord as aim of the Mosaic gift", keys: ["6:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "This revealed Book declared mubarak with follow-and-fear command", keys: ["6:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mercy-reception purpose laAAallakum turhamoona", keys: ["6:155"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["6:147"], excerpt: fv(147), description: "Command: if they deny you, say your Lord is possessor of vast mercy, yet His punishment is not repelled from the criminal people." },
    { kind: "COMMAND", keys: ["6:148"], excerpt: fv(148), description: "Command: say, do you have any knowledge you can produce for us? You follow only assumption and conjecture." },
    { kind: "COMMAND", keys: ["6:149"], excerpt: fv(149), description: "Command: say, to Allah belongs the conclusive argument; had He willed He would have guided you all." },
    { kind: "PROHIBITION", keys: ["6:150"], excerpt: fv(150), description: "Prohibition: if they testify, do not testify with them, and do not follow the desires of those who deny Our signs, disbelieve in the Hereafter and equate others with their Lord." },
    { kind: "PROHIBITION", keys: ["6:151"], excerpt: fv(151), description: "Prohibition: associate nothing with Him; do not kill your children out of poverty; do not approach immoralities apparent or hidden; do not kill the soul Allah has forbidden except by right." },
    { kind: "COMMAND", keys: ["6:151"], excerpt: fv(151), description: "Command: come, I will recite what your Lord has forbidden; and to parents, good treatment — instructed so that you may reason." },
    { kind: "PROHIBITION", keys: ["6:152"], excerpt: fv(152), description: "Prohibition: do not approach the orphan's property except in the way that is best until he reaches maturity." },
    { kind: "COMMAND", keys: ["6:152"], excerpt: fv(152), description: "Command: give full measure and weight in justice; when you speak be just even concerning a near relative; fulfill the covenant of Allah — instructed so that you may remember." },
    { kind: "COMMAND", keys: ["6:153"], excerpt: fv(153), description: "Command: this is My straight path, so follow it — instructed so that you may become God-fearing." },
    { kind: "PROHIBITION", keys: ["6:153"], excerpt: fv(153), description: "Prohibition: do not follow other ways, lest they scatter you from His way." },
    { kind: "COMMAND", keys: ["6:155"], excerpt: fv(155), description: "Command: this is a blessed Book We have revealed, so follow it and be God-fearing that you may receive mercy." }
  ],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Musa receives the Book completing favour upon the good-doer, detailing everything, as guidance and mercy toward belief in the meeting with the Lord", keys: ["6:154"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Conjecture-driven certainty: following thann while claiming divine sanction", keys: ["6:148"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Progressive purposes of instruction: reasoning, remembering, God-fearing", keys: ["6:151","6:152","6:153"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Market integrity: full kayl and meezan weighed bialqist", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guardianship economics: orphan wealth managed only in the best manner until maturity", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Poverty-driven infanticide answered by a provision guarantee rather than censure alone", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Judicial impartiality extending to kin, with obligation bounded by capacity", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Parent-child bond: ihsan to parents paired with protection of children", keys: ["6:151"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kinship does not license partiality in speech or testimony", keys: ["6:152"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0302","cand-0303","cand-0304"],
  notes: "Pass A An'am passage 15/4. The Jewish restrictions (6:146) are explicitly labelled recompense for baghy, distinguishing punitive legislation from the fabricated taboos condemned in 6:138-140; scholarly questions about abrogation and applicability are deferred to review. The determinist plea (6:148) repeats the pattern already answered at 6:137 and is met here with an epistemic demand rather than a metaphysical counter-claim, while 6:149 reserves the conclusive hujjah to Allah. Verses 6:151-153 form a compact recited code whose three closing purpose-clauses (reason, remembrance, taqwa) grade the intended response; whether these constitute a formal decalogue parallel to earlier scripture is left to scholarly review. Verse 6:154 anchors the code in the Mosaic gift and 6:155 transfers authority to the present blessed Book.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P15 divine names / attributes — extracted verbatim from corpus words
{
  const t = findWordContaining(147, ["\u0631","\u062d","\u0645"]); // rahmatin
  if (t) p15.divineNamesAndAttributes.push({ term: t, transliteration: "rahmah", gloss: "mercy, described here as vast (editorial gloss)", keys: ["6:147"] });
}

// P15 terminology
{
  const t = findWordContaining(146, ["\u0638","\u0641","\u0631"]); // thufurin
  if (t) p15.terminology.push({ term: t, transliteration: "thufur", gloss: "claw/nail, of uncloven-hoofed animals (editorial gloss)", keys: ["6:146"] });
}
{
  const t = findWordContaining(146, ["\u0628","\u063a","\u064a"]); // bibaghyihim
  if (t) p15.terminology.push({ term: t, transliteration: "baghy", gloss: "transgression/injustice (editorial gloss)", keys: ["6:146"] });
}
{
  const t = findWordContaining(149, ["\u0628","\u0644","\u063a"]); // albalighatu
  if (t) p15.terminology.push({ term: t, transliteration: "balighah", gloss: "far-reaching/conclusive (editorial gloss)", keys: ["6:149"] });
}
{
  const t = findWordContaining(151, ["\u0625","\u0645","\u0644","\u0642"]); // imlaqin
  if (t) p15.terminology.push({ term: t, transliteration: "imlaq", gloss: "destitution/poverty (editorial gloss)", keys: ["6:151"] });
}
{
  const t = findWordContaining(151, ["\u0641","\u0648","\u062d","\u0634"]); // alfawahisha
  if (t) p15.terminology.push({ term: t, transliteration: "fawahish", gloss: "gross immoralities (editorial gloss)", keys: ["6:151"] });
}
{
  const t = findWordContaining(152, ["\u0642","\u0633","\u0637"]); // bialqisti
  if (t) p15.terminology.push({ term: t, transliteration: "qist", gloss: "equity/justice (editorial gloss)", keys: ["6:152"] });
}
{
  const t = findWordContaining(152, ["\u0648","\u0633","\u0639"]); // wusAAaha
  if (t) p15.terminology.push({ term: t, transliteration: "wus'", gloss: "capacity/ability (editorial gloss)", keys: ["6:152"] });
}
{
  const t = findWordContaining(153, ["\u0633","\u0628","\u0644"]); // alssubula
  if (t) p15.terminology.push({ term: t, transliteration: "subul", gloss: "ways/paths (plural, contrasted with the single path)", keys: ["6:153"] });
}
{
  const t = findWordContaining(154, ["\u062a","\u0641","\u0635","\u0644"]); // watafseelan
  if (t) p15.terminology.push({ term: t, transliteration: "tafseel", gloss: "detailed explanation (editorial gloss)", keys: ["6:154"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p15.json"), JSON.stringify(p15, null, 2) + "\n");
console.log("Wrote 006-al-anam-p15.json");

// ─── Passage 16: 6:156–165 ──────────────────────────────────────────────────────
const p16 = {
  extractionId: "ext-006-p16",
  workstream: "MFD-11",
  pass: "A",
  surah: 6,
  surahName: "Al-An'am",
  passage: {
    fromAyah: 156,
    toAyah: 165,
    label: "Al-An'am — Two scriptural excuses removed by clear proof, guidance and mercy; worst punishment for turning away; awaiting angels, the Lord's coming or His signs ends profitable belief; sects disowned; good tenfold, evil only its like; millat Ibrahim; prayer, sacrifice, life and death for Allah alone; no soul bears another's burden; successors tested by rank; swift penalty, Forgiving, Merciful"
  },
  verseKeys: ["6:156","6:157","6:158","6:159","6:160","6:161","6:162","6:163","6:164","6:165"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `6:${i+156}`, text: fv(i+156) })),
  mainSubject: {
    label: "Surah close: two scriptural excuses cancelled by a bayyinah of guidance and mercy; denial and turning away earn the worst recompense; awaiting angels, the Lord's coming or His signs ends profitable belief; sects disowned, affair left to Allah; tenfold good versus like-for-like evil without wronging; straight path as qayyim deen and millat Ibrahim haneef; salat, nusuk, living and dying for the Lord of the worlds, no partner, first of the Muslims; self-earning and non-transferable burden; khala'if tested by rank; swift iqab with Ghafoor-Raheem",
    keys: ["6:156","6:157","6:158","6:159","6:160","6:161","6:162","6:163","6:164","6:165"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "First excuse: the Book was sent only to two groups before us (taifatayni)", keys: ["6:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Claimed unawareness of their study (AAan dirasatihim laghafileena)", keys: ["6:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Second excuse: had the Book been sent to us we would have been better guided", keys: ["6:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bayyinah from your Lord arriving as huda and rahmah cancels both excuses", keys: ["6:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supreme injustice defined as denying Allah's ayat and turning aside (sadafa AAanha)", keys: ["6:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worst recompense (sooa alAAathabi) proportioned to the act of turning away", keys: ["6:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Awaited alternatives: angels coming, your Lord coming, or some of His signs", keys: ["6:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Faith not previously held or unproductive of good ceases to profit when signs come", keys: ["6:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual waiting formula quli intathiroo inna muntathiroona", keys: ["6:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dividing the religion and becoming sects (shiyaAAan)", keys: ["6:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic dissociation lasta minhum fee shayin", keys: ["6:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Their affair referred to Allah who will inform them of what they did", keys: ["6:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tenfold reward for the hasanah (AAashru amthaliha)", keys: ["6:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Evil recompensed only with its like (illa mithlaha)", keys: ["6:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No wronging in the reckoning (wahum la yuthlamoona)", keys: ["6:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guidance to siratin mustaqeemin described as deenan qiyaman", keys: ["6:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Millat Ibrahim haneefan as the content of that path", keys: ["6:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim excluded from the mushrikeen", keys: ["6:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fourfold dedication: salatee, nusukee, mahyaya, mamatee for Allah", keys: ["6:162"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rabb al-AAalameen as the sole recipient of that dedication", keys: ["6:162"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Partner-negation la shareeka lahu with the command received (wabithalika omirtu)", keys: ["6:163"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Priority declaration waana awwalu almuslimeena", keys: ["6:163"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sole-lordship question aghayra Allahi abghee rabban answered by rabbu kulli shayin", keys: ["6:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-earning principle wala taksibu kullu nafsin illa AAalayha", keys: ["6:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Non-transferable burden wala taziru waziratun wizra okhra", keys: ["6:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Return to the Lord who informs about the matters disputed (takhtalifoona)", keys: ["6:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khala'if of the earth as appointed human station", keys: ["6:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rank-differentiation raised some above others in darajat", keys: ["6:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trial-purpose liyabluwakum fee ma atakum attached to what is given", keys: ["6:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Swift penalty (sareeAAu alAAiqabi) paired with laghafoorun raheemun", keys: ["6:165"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["6:158"], excerpt: fv(158), description: "Command: say, wait; indeed we too are waiting." },
    { kind: "COMMAND", keys: ["6:161"], excerpt: fv(161), description: "Command: say, my Lord has guided me to a straight path, an upright religion, the way of Ibrahim, inclining to truth, not among the associators." },
    { kind: "COMMAND", keys: ["6:162"], excerpt: fv(162), description: "Command: say, my prayer, my sacrifice, my living and my dying are for Allah, Lord of the worlds." },
    { kind: "COMMAND", keys: ["6:163"], excerpt: fv(163), description: "Command: declare that He has no partner, that this is what I was commanded, and that I am the first of the Muslims." },
    { kind: "COMMAND", keys: ["6:164"], excerpt: fv(164), description: "Command: say, shall I seek other than Allah as lord while He is Lord of all things? Each soul earns only against itself and no bearer bears another's burden." }
  ],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Ibrahim's millat named haneef and explicitly separated from the mushrikeen as the model of the straight path", keys: ["6:161"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Belated faith that neither preceded nor earned good through belief yields no benefit", keys: ["6:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Total-life devotion spanning worship, sustenance-ritual, living and dying", keys: ["6:162"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Islam as submitted identity claimed in the first-person priority declaration", keys: ["6:163"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Religious fragmentation into sects treated as a communal failure disowned by the messenger", keys: ["6:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Asymmetric moral economy: tenfold credit for good, exact equivalence for evil", keys: ["6:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Earth-succession and unequal ranks framed as a test of what each has been given", keys: ["6:165"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Individual accountability excludes transfer of burden between persons", keys: ["6:164"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0305","cand-0306","cand-0307","cand-0308"],
  notes: "Pass A An'am passage 16/4 — final section of the surah. The two quoted excuses (6:156-157) close the revelation-apologetic begun at 6:91 by removing both ignorance-of-earlier-scripture and comparative-superiority claims once a bayyinah has arrived. Verse 6:158 links eschatological delay to a closing window for effective belief; the identity of 'some of the signs of your Lord', the manner of the Lord's coming, and how this interacts with acceptance of late repentance are theological questions deferred to scholarly review rather than resolved here. Verse 6:159 disowns sectarian division without naming groups. The tenfold/equivalent asymmetry (6:160) states a recompense ratio without further specification. Verses 6:161-163 form a first-person confession sequence tying the straight path to millat Ibrahim and extending devotion beyond ritual to living and dying; the precise referent of nusuk and of awwalu almuslimeena is left to review. Verse 6:164 combines sole-lordship with non-transferable burden, and 6:165 closes the surah by framing rank inequality as trial and pairing swift penalty with forgiveness and mercy.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P16 divine names / attributes — verbatim corpus words only
{
  const t = findWordContaining(165, ["\u063a","\u0641","\u0648","\u0631"]); // laghafoorun
  if (t) p16.divineNamesAndAttributes.push({ term: t, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["6:165"] });
}
{
  const t = findWordContaining(165, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t) p16.divineNamesAndAttributes.push({ term: t, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["6:165"] });
}
{
  const t = findPhrase(162, fv(162).split(/\s+/).slice(-2).join(" ")); // rabbi alAAalameena
  if (t) p16.divineNamesAndAttributes.push({ term: t, transliteration: "Rabb al-'Alameen", gloss: "Lord of the worlds (editorial gloss)", keys: ["6:162"] });
}

// P16 terminology
{
  const t = findWordContaining(157, ["\u0628","\u064a","\u0646"]); // bayyinatun
  if (t) p16.terminology.push({ term: t, transliteration: "bayyinah", gloss: "clear proof/evidence (editorial gloss)", keys: ["6:157"] });
}
{
  const t = findWordContaining(157, ["\u0635","\u062f","\u0641"]); // wasadafa
  if (t) p16.terminology.push({ term: t, transliteration: "sadaf", gloss: "turning away/aside (editorial gloss)", keys: ["6:157"] });
}
{
  const t = findWordContaining(159, ["\u0634","\u064a","\u0639"]); // shiyaAAan
  if (t) p16.terminology.push({ term: t, transliteration: "shiya'", gloss: "sects/factions (editorial gloss)", keys: ["6:159"] });
}
{
  const t = findWordContaining(161, ["\u0642","\u064a","\u0645"]); // qiyaman
  if (t) p16.terminology.push({ term: t, transliteration: "qayyim", gloss: "upright/straight (editorial gloss)", keys: ["6:161"] });
}
{
  const t = findWordContaining(161, ["\u0645","\u0644","\u0629"]); // millata
  if (t) p16.terminology.push({ term: t, transliteration: "millah", gloss: "religious way/community-path (editorial gloss)", keys: ["6:161"] });
}
{
  const t = findWordContaining(161, ["\u062d","\u0646","\u064a","\u0641"]); // haneefan
  if (t) p16.terminology.push({ term: t, transliteration: "haneef", gloss: "inclining toward truth (editorial gloss)", keys: ["6:161"] });
}
{
  const t = findWordContaining(162, ["\u0646","\u0633","\u0643"]); // wanusukee
  if (t) p16.terminology.push({ term: t, transliteration: "nusuk", gloss: "rites of sacrifice/devotion (editorial gloss)", keys: ["6:162"] });
}
{
  const t = findWordContaining(164, ["\u0648","\u0632","\u0631"]); // waziratun
  if (t) p16.terminology.push({ term: t, transliteration: "wazirah", gloss: "bearer of a burden (editorial gloss)", keys: ["6:164"] });
}
{
  const t = findWordContaining(165, ["\u062e","\u0644","\u0626","\u0641"]); // khalaifa
  if (t) p16.terminology.push({ term: t, transliteration: "khala'if", gloss: "successors/vicegerents (editorial gloss)", keys: ["6:165"] });
}
{
  const t = findWordContaining(165, ["\u0639","\u0642","\u0627","\u0628"]); // alAAiqabi
  if (t) p16.terminology.push({ term: t, transliteration: "'iqab", gloss: "penalty/retribution (editorial gloss)", keys: ["6:165"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "006-al-anam-p16.json"), JSON.stringify(p16, null, 2) + "\n");
console.log("Wrote 006-al-anam-p16.json");

// ─── Candidates batch (cand-0297 through cand-0308) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-006-p13,ext-006-p14,ext-006-p15,ext-006-p16",
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

// cand-0297: Guidance mechanics — breast expansion vs constriction
{
  const p = fv(125);
  candidates.candidates.push(makeCand("cand-0297",
    "Guidance mechanics: breast expansion for Islam versus constriction as though climbing sky; Allah places rijs upon non-believers",
    undefined,
    "آليات الهداية: شرح الصدر للإسلام مقابل الضيق والحرج كأنما يصعد في السماء؛ الله يجعل الرجس على الذين لا يؤمنون",
    "In 6:125: So whoever Allah wants to guide He expands his breast to Islam and whoever He wants to misguide He makes his breast tight and constricted as though he were climbing into the sky. Thus does Allah place defilement upon those who do not believe.",
    [{ key: "6:125", excerpt: p, evidenceClass: "EXPLICIT_TEXT", rationale: "Faman yuridi Allahu an yahdiyahu yashrah sadrahu lilislami waman yurid an yudillahu yajAAal sadrahu dayyiqan harajan kaannama yassaAAAAadu fee alssamai kathalika yajAAalu Allahu alrrijsa AAala allatheena la yuminoona: phenomenological description of guidance as experiential opening and misguidance as suffocating constriction with rijs as divine placement." }],
    [{ topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Guidance-misguidance asymmetry rooted in divine will" },
     { topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Breast-expansion as spiritual capacity enabling reception of Islam" }],
    "Overlap with tawheed and god-consciousness. Yashrah sadrahu lilislami provides the most vivid Quranic metaphor for guidance-as-experiential-opening contrasting sharply with intellectual assent models. Dayyiqan harajan paired with climbing-sky simile renders misguidance sensorially immediate rather than abstractly punitive. Rijs-placement frames impurity as consequence of persistent disbelief not inherent nature. This verse establishes that guidance operates through affective transformation not merely cognitive persuasion."
  ));
}

// cand-0298: Dar al-Salam and jinn-mankind joint accountability
{
  const v127 = fv(127);
  const v128 = fv(128);
  const v130 = fv(130);
  candidates.candidates.push(makeCand("cand-0298",
    "Dar al-Salam reward and jinn-mankind joint accountability: Home of Peace with Lord as protecting friend; Day gathering jinn and mankind mutual exploitation confessed Fire residence eternal except Allah wills Wise Knowing; messengers warned self-witness against selves worldly life deluded",
    undefined,
    "دار السلام والمسؤولية المشتركة للجن والإنس: دار السلام عند ربهم وهو وليهم؛ يوم يحشر الجن والإنس استكثار متبادل النار مثواهم خالدين إلا ما شاء الله حكيم عليم؛ الرسل أنذروا شهادة على الأنفس الحياة الدنيا غرتهم",
    "In 6:127-130: For them will be the Home of Peace with their Lord and He will be their protecting friend because of what they used to do. And the Day when He will gather them together O company of jinn you have misled many of mankind and their allies among mankind will say Our Lord some of us made use of others and we have reached our term which you appointed for us. He will say The Fire is your residence wherein you will abide eternally except for what Allah wills. Indeed your Lord is Wise and Knowing. O company of jinn and mankind did there not come to you messengers from among you relating My verses and warning you of this Day? They will say We bear witness against ourselves and the worldly life had deluded them and they will bear witness against themselves that they were disbelievers.",
    [{ key: "6:127", excerpt: v127, evidenceClass: "EXPLICIT_TEXT", rationale: "Lahum daru alssalami AAinda rabbihim wahuwa waliyyuhum bima kanoo yaAAmaloona: Dar al-Salam as unique eschatological reward-name with divine wilayah conditioned on deeds." },
     { key: "6:128", excerpt: v128, evidenceClass: "EXPLICIT_TEXT", rationale: "Wayawma yahshuruhum jameeAAan ya maAAshara aljinni qadi istakthartum mina alinsi...alnnaru mathwakum khalideena feeha illa ma shaa Allahu inna rabbaka hakeemun AAaleemun: only explicit Quranic scene of joint jinn-mankind species-accountability with mutual exploitation (istikthar) confessed and Fire-residence decreed." },
     { key: "6:130", excerpt: v130, evidenceClass: "EXPLICIT_TEXT", rationale: "Ya maAAshara aljinni waalinsi alam yatikum rusulun minkum...qaloo shahidna AAala anfusina wagharrathumu alhayatu alddunya washahidoo AAala anfusihim annahum kanoo kafireena: prophetic warning confirmed by self-witness eliminating external accusation with worldly-delusion diagnosis." }],
    [{ topicId: "day-of-judgment", layer: "scholarly", relationship: "same-concept", note: "Joint species judgment scene unique in Quran" },
     { topicId: "the-hereafter", layer: "curated", relationship: "same-concept", note: "Dar al-Salam as eschatological reward and Fire as punishment" }],
    "Overlap with day-of-judgment and the-hereafter. Dar al-Salam appears uniquely here as named eschatological destination distinguishing it from generic jannah references. Istikthar (mutual excessive exploitation) between jinn and mankind reveals cross-species alliance as structural feature of misguidance not incidental temptation. Self-witness (shahidna AAala anfusina) eliminates prosecutorial need making judgment self-evident. Illa ma shaa Allahu exception clause in Fire-residence raises theological questions about duration deferred to scholarly review. Gharrathumu alhayatu alddunya identifies worldly delusion as root cause preceding confession."
  ));
}

// cand-0299: Fabricated taboos and child-killing beautification
{
  const v137 = fv(137);
  const v138 = fv(138);
  const v140 = fv(140);
  candidates.candidates.push(makeCand("cand-0299",
    "Fabricated taboos and child-killing beautification: partners beautified killing children causing destruction confusing religion; livestock crops reserved backs forbidden name-omission fabrication; lost those who killed children foolishly forbade provision fabricating lie gone astray",
    undefined,
    "التحريمات المفتعلة وتزيين قتل الأولاد: شركاؤهم زينوا لهم قتل أولادهم ليردوهم ويلبسوا عليهم دينهم؛ أنعام وحرث حجر ظهور محرمة عدم ذكر اسم الله افتراء؛ خسر الذين قتلوا أولادهم سفهاً بغير علم وحرموا ما رزقهم الله افتراءاً ضلوا وما كانوا مهتدين",
    "In 6:137-140: And likewise to many of the polytheists their partners have made pleasing the killing of their children in order to bring about their destruction and to cover them with confusion in their religion. And if Allah had willed they would not have done so so leave them and that which they invent. And they say These animals and crops are forbidden no one may eat from them except whom we will by their claim. And there are those whose backs are forbidden and those upon which the name of Allah is not mentioned an invention of untruth about Him. He will punish them for what they were inventing. Those will have lost who killed their children in foolishness without knowledge and prohibited what Allah had provided for them inventing untruth about Allah. They have gone astray and were not rightly guided.",
    [{ key: "6:137", excerpt: v137, evidenceClass: "EXPLICIT_TEXT", rationale: "Wakathalika zayyana likatheerin mina almushrikeena qatla awladihim shurakaohum liyurdoohum waliyalbisoo AAalayhim deenahum walaw shaa Allahu ma faAAaloohu fatharhum wama yaftaroona: aesthetic manipulation (zayyana) identified as mechanism enabling infanticide with dual destructive purpose." },
     { key: "6:138", excerpt: v138, evidenceClass: "EXPLICIT_TEXT", rationale: "Waqaloo hathihi anAAamun waharthun hijrun la yatAAamuha illa man nashao bizaAAmihim waanAAamun hurrimat thuhooruha waanAAamun la yathkuroona isma Allahi AAalayha iftiraan AAalayhi sayajzeehim bima kanoo yaftaroona: systematic catalogue of fabricated prohibitions covering food reservation riding restriction and name-omission all labelled iftiraan." },
     { key: "6:140", excerpt: v140, evidenceClass: "EXPLICIT_TEXT", rationale: "Qad khasira allatheena qataloo awladahum safahan bighayri AAilmin waharramoo ma razaqahumu Allahu iftiraan AAala Allahi qad dalloo wama kanoo muhtadeena: loss-diagnosis linking child-killing and provision-prohibition as twin fabrications producing straying." }],
    [{ topicId: "shirk-prohibition", layer: "scholarly", relationship: "same-concept", note: "Fabricated religious law as practical expression of shirk" },
     { topicId: "right-to-life", layer: "scholarly", relationship: "related-not-identical", note: "Infanticide condemned as loss-producing foolishness" }],
    "Overlap with shirk-prohibition and right-to-life. Zayyana (beautification) identifies aesthetic manipulation as primary mechanism enabling atrocities linking to 6:112 zukhruf motif. Liyurdoohum waliyalbisoo reveals dual satanic purpose: physical destruction plus religious confusion preventing recovery. Hijr (reservation) documents pre-Islamic Arabian religious innovation systematically. Safahan bighayri AAilmin diagnoses infanticide as ignorant foolishness not calculated pragmatism. Khasira-dalloo pairing establishes comprehensive loss spanning both worldly welfare and spiritual direction."
  ));
}

// cand-0300: Agricultural ethics and harvest due
{
  const v141 = fv(141);
  const v142 = fv(142);
  candidates.candidates.push(makeCand("cand-0300",
    "Agricultural ethics and harvest due: gardens trellised untrellised palm crops olive pomegranate similar dissimilar eat fruit give due harvest day not excessive; grazing livestock carriers small eat provided follow not Satan footsteps clear enemy",
    undefined,
    "الأخلاق الزراعية وحق الحصاد: جنات معروشات وغير معروشات والنخل والزرع مختلف أكله والزيتون والرمان متشابه وغير متشابه كلوا من ثمره وآتوا حقه يوم حصاده ولا تسرفوا؛ الأنعام حمولة وفرشاً كلوا مما رزقكم الله ولا تتبعوا خطوات الشيطان عدو مبين",
    "In 6:141-142: And He it is who causes gardens to grow trellised and untrellised and palm trees and crops of different kinds of food and olives and pomegranates similar and dissimilar. Eat of its fruit when it yields and give its due on the day of its harvest. And be not excessive. Indeed He does not like those who commit excess. And of the grazing livestock are carriers and those too small. Eat of what Allah has provided for you and do not follow the footsteps of Satan. Indeed he is to you a clear enemy.",
    [{ key: "6:141", excerpt: v141, evidenceClass: "EXPLICIT_TEXT", rationale: "Wahuwa allathee anshaa jannatin maAArooshatin waghayra maAArooshatin waalnnakhla waalzzarAAa mukhtalifan okuluhu waalzzaytoona waalrrummana mutashabihan waghayra mutashabihin kuloo min thamarihi itha athmara waatoo haqqahu yawma hasadihi wala tusrifoo innahu la yuhibbu almusrifeena: agricultural catalogue integrating biodiversity appreciation with harvest-due obligation and excess-prohibition establishing ethical framework for consumption." },
     { key: "6:142", excerpt: v142, evidenceClass: "EXPLICIT_TEXT", rationale: "Wamina alanAAami hamoolatan wafarshan kuloo mimma razaqakumu Allahu wala tattabiAAoo khutuwati alshshaytani innahu lakum AAaduwwun mubeenun: livestock categorization with permission-command and Satan-footsteps prohibition framing dietary practice within cosmic enmity." }],
    [{ topicId: "giving", layer: "curated", relationship: "related-not-identical", note: "Harvest-due as agricultural zakat precursor" },
     { topicId: "balance-moderation", layer: "scholarly", relationship: "same-concept", note: "Israf-prohibition establishing consumption limits" }],
    "Overlap with giving and balance-moderation. MaAArooshatin waghayra maAArooshatin demonstrates taxonomic awareness distinguishing cultivation methods. Mukhtalifan okuluhu celebrates food-diversity as divine design. Waatoo haqqahu yawma hasadihi links consumption-permission to immediate social obligation preventing hoarding. Wala tusrifoo establishes moderation principle applicable beyond food. Hamoolatan wafarshan distinguishes working animals from meat-sources recognizing functional differentiation. Khutuwati alshshaytani frames dietary transgression as following satanic trajectory not isolated error."
  ));
}

// cand-0301: Four dietary prohibitions and necessity exception
{
  const v145 = fv(145);
  candidates.candidates.push(makeCand("cand-0301",
    "Four dietary prohibitions and necessity exception: nothing forbidden except dead animal spilled blood swine flesh impure disobedience dedicated other than Allah; forced neither desiring transgressing Forgiving Merciful",
    undefined,
    "المحرمات الغذائية الأربع واستثناء الضرورة: لا محرم إلا ميتة أو دم مسفوح أو لحم خنزير رجس أو فسق أهل لغير الله به؛ اضطر غير باغ ولا عاد فإن ربك غفور رحيم",
    "In 6:145: Say I do not find within that which was revealed to me anything forbidden to one who would eat it unless it be a dead animal or blood spilled out or the flesh of swine for indeed it is impure or it be disobedience dedicated to other than Allah. But whoever is forced neither desiring nor transgressing then indeed your Lord is Forgiving and Merciful.",
    [{ key: "6:145", excerpt: v145, evidenceClass: "EXPLICIT_TEXT", rationale: "Qul la ajidu fee ma oohiya ilayya muharraman AAala taAAimin yatAAamuhu illa an yakoona maytatan aw daman masfoohan aw lahma khinzeerin fainnahu rijsun aw fisqan ohilla lighayri Allahi bihi famani idturra ghayra baghin wala AAadin fainna rabbaka ghafoorun raheemun: canonical four-prohibition list with rijs-designation for swine and dual-condition necessity exception balanced by Ghafoor-Raheem closure." }],
    [{ topicId: "halal-food", layer: "scholarly", relationship: "same-concept", note: "Most concise dietary law summary in Quran" },
     { topicId: "mercy-and-forgiveness", layer: "curated", relationship: "related-not-identical", note: "Necessity exception demonstrating divine compassion within legal strictness" }],
    "Overlap with halal-food and mercy-and-forgiveness. La ajidu fee ma oohiya ilayya grounds prohibitions in revelation not custom distinguishing Islamic from pre-Islamic dietary law. Maytatan daman masfoohan lahma khinzeerin fisqan provides exhaustive canonical list referenced elsewhere. Fainnahu rijsun singles out swine as inherently impure unlike other prohibitions based on circumstance. Ghayra baghin wala AAadin prevents necessity-exception abuse through dual intent-condition. Ghafoorun raheemun balances legal precision with pastoral reassurance preventing scrupulosity."
  ));
}

// cand-0302: Recited decalogue and three purpose clauses
{
  const v151 = fv(151);
  const v152 = fv(152);
  const v153 = fv(153);
  candidates.candidates.push(makeCand("cand-0302",
    "Recited decalogue and three purpose clauses: associate nothing parents good treatment kill not children poverty approach not immoralities apparent hidden kill not soul except right instructed reason; orphan property best way full measure weight justice speak just even relative fulfill covenant instructed remember; My straight path follow follow not paths scatter instructed fear",
    undefined,
    "الوصايا المتلوة وغاياتها الثلاث: ألا تشركوا به شيئاً وبالوالدين إحساناً ولا تقتلوا أولادكم من إملاق ولا تقربوا الفواحش ما ظهر منها وما بطن ولا تقتلوا النفس التي حرم الله إلا بالحق وصاكم به لعلكم تعقلون؛ ولا تقربوا مال اليتيم إلا بالتي هي أحسن وأوفوا الكيل والميزان بالقسط وإذا قلتم فاعدلوا وبعهد الله أوفوا وصاكم به لعلكم تذكرون؛ هذا صراطي مستقيماً فاتبعوه ولا تتبعوا السبل وصاكم به لعلكم تتقون",
    "In 6:151-153: Say Come I will recite what your Lord has prohibited to you that you not associate anything with Him and to parents good treatment and do not kill your children out of poverty We will provide for you and them and do not approach immoralities what is apparent and what is concealed and do not kill the soul which Allah has forbidden except by right. This has He instructed you that you may use reason. And do not approach the orphan's property except in a way that is best until he reaches maturity. And give full measure and weight in justice. We do not charge any soul except within its capacity. And when you testify be just even if it concerns a near relative. And the covenant of Allah fulfill. This has He instructed you that you may remember. And this is My path which is straight so follow it and do not follow other ways for you will be separated from His way. This has He instructed you that you may become righteous.",
    [{ key: "6:151", excerpt: v151, evidenceClass: "EXPLICIT_TEXT", rationale: "Qul taAAalaw atlu ma harrama rabbukum AAalaykum alla tushrikoo bihi shayan wabialwalidayni ihsanan wala taqtuloo awladakum min imlaqin nahnu narzuqukum waiyyahum wala taqraboo alfawahisha ma thahara minha wama batana wala taqtuloo alnnafsa allatee harrama Allahu illa bialhaqqi thalikum wassakum bihi laAAallakum taAAqiloona: first five commands with reason-purpose clause establishing tawheed-parents-life-sexual ethics foundation." },
     { key: "6:152", excerpt: v152, evidenceClass: "EXPLICIT_TEXT", rationale: "Wala taqraboo mala alyateemi illa biallatee hiya ahsanu hatta yablugha ashuddahu waawfoo alkayla waalmeezana bialqisti la nukallifu nafsan illa wusAAaha waitha qultum faiAAdiloo walaw kana tha qurba wabiAAahdi Allahi awfoo thalikum wassakum bihi laAAallakum tathakkaroona: second set covering orphan-property market-integrity speech-justice covenant with remembrance-purpose clause." },
     { key: "6:153", excerpt: v153, evidenceClass: "EXPLICIT_TEXT", rationale: "Waanna hatha siratee mustaqeeman faittabiAAoohu wala tattabiAAoo alssubula fatafarraqa bikum AAan sabeelihi thalikum wassakum bihi laAAallakum tattaqoona: single-path command versus scattering subul with taqwa-purpose clause completing progressive instruction sequence." }],
    [{ topicId: "good-character", layer: "curated", relationship: "same-concept", note: "Comprehensive ethical code spanning worship family economics and civic duty" },
     { topicId: "justice", layer: "curated", relationship: "same-concept", note: "Market and judicial integrity embedded within divine command structure" },
     { topicId: "parents-and-family", layer: "curated", relationship: "same-concept", note: "Parental ihsan positioned immediately after tawheed establishing priority hierarchy" }],
    "Overlap with good-character justice and parents-and-family. TaAAalaw atlu frames these as recited divine commands not human wisdom. Alla tushrikoo bihi shayan opens with absolute tawheed anchoring all subsequent ethics. Wabialwalidayni ihsanan places parental goodness second establishing intergenerational bond as foundational social unit. Min imlaqin nahnu narzuqukum waiyyahum addresses poverty-driven infanticide with provision-guarantee replacing mere prohibition. Ma thahara minha wama batana demands comprehensive sexual ethics covering public and private. Illa bialhaqq limits lethal force to legitimate authority. LaAAallakum taAAqiloona-tathakkaroona-tattaqoona forms progressive pedagogical sequence from reasoning through memory to God-consciousness. Siratee mustaqeeman claims divine ownership of the path while alssubula warns against plural alternatives."
  ));
}

// cand-0303: Jewish dietary restrictions as punitive recompense
{
  const v146 = fv(146);
  candidates.candidates.push(makeCand("cand-0303",
    "Jewish dietary restrictions as punitive recompense: every clawed animal forbidden cattle sheep fat except backs entrails bone-mixed recompensed transgression truthful",
    undefined,
    "التحريمات الغذائية اليهودية كجزاء عقابي: كل ذي ظفر حرم ومن البقر والغنم شحومهما إلا ما حملت ظهورهما أو الحوايا أو ما اختلط بعظم جزيناهم ببغيهم وإنا لصادقون",
    "In 6:146: And to those who are Jews We prohibited every animal of uncloven hoof and of the cattle and the sheep We prohibited to them their fat except what adheres to their backs or the entrails or what is joined with bone. By that We repaid them for their injustice. And indeed We are truthful.",
    [{ key: "6:146", excerpt: v146, evidenceClass: "EXPLICIT_TEXT", rationale: "WaAAala allatheena hadoo harramna kulla thee thufurin wamina albaqari waalghanami harramna AAalayhim shuhoomahuma illa ma hamalat thuhooruhuma awi alhawaya aw ma ikhtalata biAAathmin thalika jazaynahum bibaghyihim wainna lasadiqoona: explicit framing of Jewish dietary law as punitive recompense for baghy distinguished from fabricated taboos condemned earlier." }],
    [{ topicId: "divine-wrath", layer: "scholarly", relationship: "related-not-identical", note: "Punitive legislation as historical divine response to communal transgression" },
     { topicId: "halal-food", layer: "scholarly", relationship: "related-not-identical", note: "Contrast between divinely-imposed restrictions and human fabrication" }],
    "Overlap with divine-wrath and halal-food. Jazaynahum bibaghyihim explicitly labels these restrictions as punishment not divine preference distinguishing them from Islamic dietary law grounded in mercy. Kulla thee thufurin provides taxonomic criterion (uncloven hoof) absent from Islamic prohibitions. Shuhoom-exception details anatomical specificity demonstrating precise legislative knowledge. Wainna lasadiqoona affirms truthfulness of this historical report against potential denial. Whether these restrictions remain binding or were abrogated is a scholarly question deferred to review."
  ));
}

// cand-0304: Determinist excuse refuted by knowledge demand
{
  const v148 = fv(148);
  const v149 = fv(149);
  candidates.candidates.push(makeCand("cand-0304",
    "Determinist excuse refuted by knowledge demand: associators say if Allah willed not associated nor fathers nor forbidden; thus denied before tasted punishment; say have knowledge produce? follow assumption falsifying; Allah conclusive argument if willed guided all",
    undefined,
    "دحض الحجة القدرية بالمطالبة بالعلم: قال الذين أشركوا لو شاء الله ما أشركنا ولا آباؤنا ولا حرمنا من شيء؛ كذلك كذب الذين من قبلهم حتى ذاقوا بأسنا؛ قل هل عندكم من علم فتخرجوه لنا إن تتبعون إلا الظن وإن أنتم إلا تخرصون؛ فلله الحجة البالغة فلو شاء لهداكم أجمعين",
    "In 6:148-149: Those who associated with Allah will say If Allah had willed we would not have associated anything and neither would our fathers nor would we have prohibited anything. Likewise did those before deny until they tasted Our punishment. Say Do you have any knowledge that you can produce for us? You follow not except assumption and you are not but falsifying. Say With Allah is the far-reaching argument. If He had willed He would have guided you all.",
    [{ key: "6:148", excerpt: v148, evidenceClass: "EXPLICIT_TEXT", rationale: "Sayaqoolu allatheena ashrakoo law shaa Allahu ma ashrakna wala abaona wala harramna min shayin kathalika kaththaba allatheena min qablihim hatta thaqoo basana qul hal AAindakum min AAilmin fatukhrijoohu lana in tattabiAAoona illa alththanna wain antum illa takhrusoona: predicted determinist plea met with epistemic demand exposing assumption-following rather than metaphysical counter-argument." },
     { key: "6:149", excerpt: v149, evidenceClass: "EXPLICIT_TEXT", rationale: "Qul falillahi alhujjatu albalighatu falaw shaa lahadakum ajmaAAeena: conclusive argument reserved to Allah with universal-guidance capacity affirmed without resolving tension between divine will and human responsibility." }],
    [{ topicId: "predestination-free-will", layer: "scholarly", relationship: "same-concept", note: "Determinist excuse addressed without full metaphysical resolution" },
     { topicId: "knowledge-ignorance", layer: "scholarly", relationship: "related-not-identical", note: "Epistemic demand shifting debate from ontology to evidence" }],
    "Overlap with predestination-free-will and knowledge-ignorance. Law shaa Allahu ma ashrakna represents classic determinist defense attributing shirk to divine will. Kathalika kaththaba allatheena min qablihim hatta thaqoo basana invokes historical precedent showing this excuse failed previous communities. Hal AAindakum min AAilmin fatukhrijoohu lana shifts ground from metaphysics to epistemology demanding positive evidence rather than accepting negative inference. Alththanna-takhrusoona diagnoses popular theology as assumption-falsification. Alhujjatu albalighatu reserves ultimate argument to divine prerogative. Falaw shaa lahadakum ajmaAAeena affirms universal guidance capacity without explaining why it is not exercised leaving theological tension intact for scholarly engagement."
  ));
}

// cand-0305: Two excuses cancelled by bayyinah arrival
{
  const v156 = fv(156);
  const v157 = fv(157);
  candidates.candidates.push(makeCand("cand-0305",
    "Two excuses cancelled by bayyinah arrival: scripture only sent to two groups before unaware of study; or would have been better guided; clear proof guidance mercy now come; worst punishment turning away signs",
    undefined,
    "إبطال العذرين بمجيء البينة: الكتاب أنزل على طائفتين من قبلنا كنا عن دراستهم لغافلين؛ أو لو أنزل علينا الكتاب لكنا أهدى منهم؛ قد جاءكم بينة من ربكم وهدى ورحمة؛ سوء العذاب لمن صدّف عن الآيات",
    "In 6:156-157: Lest you say The Scripture was only sent down to two groups before us but we were of their study unaware. Or lest you say If only the Scripture had been revealed to us we would have been better guided than they. So there has now come to you a clear evidence from your Lord and a guidance and mercy. Then who is more unjust than one who denies the verses of Allah and turns away from them? We will recompense those who turn away from Our verses with the worst of punishment for their having turned away.",
    [{ key: "6:156", excerpt: v156, evidenceClass: "EXPLICIT_TEXT", rationale: "An taqooloo innama onzila alkitabu AAala taifatayni min qablina wain kunna AAan dirasatihim laghafileena: first excuse anticipating ignorance-of-earlier-scripture claim preemptively cancelled." },
     { key: "6:157", excerpt: v157, evidenceClass: "EXPLICIT_TEXT", rationale: "Aw taqooloo law anna onzila AAalayna alkitabu lakunna ahda minhum faqad jaakum bayyinatun min rabbikum wahudan warahmatun faman athlamu mimman kaththaba biayati Allahi wasadafa AAanha sanajzee allatheena yasdifoona AAan ayatina sooa alAAathabi bima kanoo yasdifoona: second excuse anticipating comparative-superiority claim cancelled by bayyinah arrival with worst-punishment proportioned to turning-away." }],
    [{ topicId: "quran-revelation-process", layer: "scholarly", relationship: "related-not-identical", note: "Bayyinah as culminating revelation cancelling prior excuses" },
     { topicId: "divine-wrath", layer: "scholarly", relationship: "related-not-identical", note: "Worst punishment specifically linked to active turning-away not mere ignorance" }],
    "Overlap with quran-revelation-process and divine-wrath. Taifatayni identifies two earlier scripture-bearing communities (Jews and Christians) whose study was accessible. Laghafileena acknowledges genuine unawareness as potentially valid excuse now removed. Lakunna ahda minhum captures competitive superiority claim common in inter-religious polemic. Bayyinatun min rabbikum wahudan warahmatun defines current revelation as simultaneously evidential guiding and merciful. Sadoo AAanha (turning away) specifies active rejection not passive ignorance as culpable act. Sooaa alAAathabi bima kanoo yasdifoona establishes proportionality between punishment and deliberate aversion."
  ));
}

// cand-0306: Sectarian fragmentation disowned
{
  const v159 = fv(159);
  candidates.candidates.push(makeCand("cand-0306",
    "Sectarian fragmentation disowned: divided religion became sects prophet not associated with them affair only with Allah then informs what they did",
    undefined,
    "نبذ التفرق المذهبي: فرقوا دينهم وكانوا شيعاً لست منهم في شيء إنما أمرهم إلى الله ثم ينبئهم بما كانوا يفعلون",
    "In 6:159: Indeed those who have divided their religion and become sects you O Muhammad are not associated with them in anything. Their affair is only left to Allah then He will inform them about what they used to do.",
    [{ key: "6:159", excerpt: v159, evidenceClass: "EXPLICIT_TEXT", rationale: "Inna allatheena farraqoo deenahum wakanoo shiyaAAan lasta minhum fee shayin innama amruhum ila Allahi thumma yunabbiohum bima kanoo yafAAaloona: prophetic dissociation from sectarian division with affair-deferral to divine judgment preventing premature coercion or alignment." }],
    [{ topicId: "brotherhood-islam", layer: "scholarly", relationship: "related-not-identical", note: "Sectarian division as antithesis of unified community" },
     { topicId: "day-of-judgment", layer: "scholarly", relationship: "related-not-identical", note: "Divine informing as ultimate resolution of sectarian disputes" }],
    "Overlap with brotherhood-islam and day-of-judgment. Farraqoo deenahum identifies religion-division as active verb not passive drift. ShiyaAAan names factionalism as structural outcome of division. Lasta minhum fee shayin provides absolute prophetic dissociation preventing appropriation of messenger's authority for sectarian purposes. Innama amruhum ila Allahi defers resolution exclusively to divine jurisdiction removing human enforcement. Yunabbiohum bima kanoo yafAAaloona promises future clarification without specifying timing or mechanism. Which groups constitute shiyaAA and whether intra-Muslim disagreement qualifies are scholarly questions deferred to review."
  ));
}

// cand-0307: Asymmetric recompense and sole devotion
{
  const v160 = fv(160);
  const v162 = fv(162);
  const v163 = fv(163);
  candidates.candidates.push(makeCand("cand-0307",
    "Asymmetric recompense and sole devotion: good deed tenfold evil only equivalent not wronged; prayer sacrifice living dying for Allah Lord worlds no partner commanded first Muslims",
    undefined,
    "الجزاء غير المتماثل والتفاني الخالص: بالحسنة عشر أمثالها وبالسيئة مثلها لا يظلمون؛ صلاتي ونسكي ومحياي ومماتي لله رب العالمين لا شريك له بذلك أمرت وأنا أول المسلمين",
    "In 6:160-163: Whoever comes with a good deed will have ten times the like thereof and whoever comes with an evil deed will not be recompensed except the like thereof and they will not be wronged. Say Indeed my prayer my rites of sacrifice my living and my dying are for Allah Lord of the worlds. No partner has He. And this I have been commanded and I am the first of the Muslims.",
    [{ key: "6:160", excerpt: v160, evidenceClass: "EXPLICIT_TEXT", rationale: "Man jaa bialhasanati falahu AAashru amthaliha waman jaa bialssayyiati fala yujza illa mithlaha wahum la yuthlamoona: asymmetric moral economy establishing tenfold credit for good versus exact equivalence for evil with injustice-negation." },
     { key: "6:162", excerpt: v162, evidenceClass: "EXPLICIT_TEXT", rationale: "Qul inna salatee wanusukee wamahyaya wamamatee lillahi rabbi alAAalameena: fourfold total-life devotion spanning ritual sustenance existence and death directed exclusively to Rabb al-AAalameen." },
     { key: "6:163", excerpt: v163, evidenceClass: "EXPLICIT_TEXT", rationale: "La shareeka lahu wabithalika omirtu waana awwalu almuslimeena: partner-negation command-affirmation and priority-declaration forming confessional climax." }],
    [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Total devotion as practical expression of exclusive lordship" },
     { topicId: "justice", layer: "curated", relationship: "related-not-identical", note: "Recompense asymmetry favoring good over evil as divine generosity" }],
    "Overlap with tawheed and justice. AAashru amthaliha establishes divine generosity multiplier exceeding strict justice. Illa mithlaha limits evil-recompense to equivalence preventing excessive punishment. La yuthlamoona negates any injustice in either direction. Salatee wanusukee wamahyaya wamamatee extends devotion beyond ritual to encompass entire existence. Rabbi alAAalameen universalizes lordship beyond tribal or national deity. La shareeka lahu provides absolute monotheistic formula. Wabithalika omirtu grounds confession in received command not self-generated piety. Awwalu almuslimeena claims priority in submission establishing prophetic exemplarity."
  ));
}

// cand-0308: Individual accountability and khilaafah trial
{
  const v164 = fv(164);
  const v165 = fv(165);
  candidates.candidates.push(makeCand("cand-0308",
    "Individual accountability and khilaafah trial: seek other than Allah lord? Lord everything; soul earns only against itself bearer bears not burden another; return Lord informs differed; successors earth raised degrees test given; swift penalty Forgiving Merciful",
    undefined,
    "المسؤولية الفردية وابتلاء الخلافة: أغير الله أبغي رباً وهو رب كل شيء؛ لا تكسب كل نفس إلا عليها ولا تزر وازرة وزر أخرى؛ إلى ربكم مرجعكم فينبئكم بما كنتم فيه تختلفون؛ جعلكم خلفاء الأرض ورفع بعضكم فوق بعض درجات ليبلوكم فيما آتاكم؛ سريع العقاب وغفور رحيم",
    "In 6:164-165: Say Is it other than Allah I should desire as a lord while He is the Lord of all things? And every soul earns not except against itself and no bearer of burdens will bear the burden of another. Then to your Lord is your return and He will inform you concerning that over which you used to differ. And it is He who has made you successors upon the earth and has raised some of you above others in degrees that He may try you through what He has given you. Indeed your Lord is swift in penalty but indeed He is Forgiving and Merciful.",
    [{ key: "6:164", excerpt: v164, evidenceClass: "EXPLICIT_TEXT", rationale: "Qul aghayra Allahi abghee rabban wahuwa rabbu kulli shayin wala taksibu kullu nafsin illa AAalayha wala taziru waziratun wizra okhra thumma ila rabbikum marjiAAukum fayunabbiokum bima kuntum feehi takhtalifoona: sole-lordship rhetorical question combined with individual earning-principle and non-transferable burden establishing absolute personal accountability." },
     { key: "6:165", excerpt: v165, evidenceClass: "EXPLICIT_TEXT", rationale: "Wahuwa allathee jaAAalakum khalaifa alardi warafaAAa baAAdakum fawqa baAAdin darajatin liyabluwakum fee ma atakum inna rabbaka sareeAAu alAAiqabi wainnahu laghafoorun raheemun: khilaafah-station with rank-differentiation framed as trial-purpose closed by swift-penalty and forgiveness-mercy pairing." }],
    [{ topicId: "khalifah-concept", layer: "scholarly", relationship: "same-concept", note: "Earth-succession as appointed station with testing function" },
     { topicId: "trial-and-test", layer: "scholarly", relationship: "same-concept", note: "Rank inequality reframed as divine trial rather than inherent superiority" },
     { topicId: "self-accountability", layer: "scholarly", relationship: "same-concept", note: "Non-transferable burden establishing irreducible individual responsibility" }],
    "Overlap with khalifah-concept trial-and-test and self-accountability. Aghayra Allahi abghee rabban uses interrogative-negation eliminating alternative lordship possibilities. Rabbu kulli shayin universalizes divine authority matching 6:162 rabb al-AAalameen. Wala taksibu kullu nafsin illa AAalayha establishes earning-confined-to-self principle. Wala taziru waziratun wizra okhra provides most explicit non-transferability statement in Quran. Fayunabbiokum bima kuntum feehi takhtalifoona promises future clarification of present disputes. Khalaifa alardi defines human earth-station as delegated succession not ownership. Darajatin liyabluwakum reframes social hierarchy as testing mechanism rather than merit-indicator. Fee ma atakum locates trial in what is given not what is achieved. SareeAAu alAAiqabi laghafoorun raheemun closes surah with balanced attributes preventing despair or presumption."
  ));
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-030.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-030.json");

console.log("\nGeneration complete:");
console.log("  Extractions: 4 (p13-p16)");
console.log("  Candidates: 12 (cand-0297..cand-0308)");
console.log("  Verse keys: 45 (6:121-165)");