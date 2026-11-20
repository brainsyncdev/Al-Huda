// MFD-11 Wave 9: Surah 60 (Al-Mumtahanah) genuine re-extraction.
// Covers 60:1-13 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "060-0001-0013.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 60:${n} not found`);
  return verses[n];
}

function findWord(vid, chars) {
  const t = fv(vid);
  for (const w of t.split(/\s+/)) {
    let match = true;
    for (const ch of chars) { if (!w.includes(ch)) { match = false; break; } }
    if (match) return w;
  }
  return null;
}

console.log("Generating Surah 60 (Al-Mumtahanah) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T18:05:00.000Z";

const PASSAGES = [
  { id: "ext-060-p1", from: 1, to: 3,
    label: "O believed do not take My enemies and your enemies as allies extending affection while they disbelieved in the truth that came, having driven out the Prophet and yourselves only because you believe in Allah your Lord; if you came out for jihad in My cause seeking My approval take them not as friends; you confide affection but I am most knowing of what you concealed and declared; whoever does it has strayed from soundness of the way; if they gain dominance they would be enemies extending hands and tongues with evil wishing you would disbelieve; never will relatives or children benefit you, the Day of Resurrection He will judge between you, Allah of what you do is Seeing",
    mainLabel: "Believers forbidden to take Allah's enemies and their own as allies by extending affection to those who rejected the arriving truth and expelled the Prophet and the community solely for believing in Allah; the prohibition tied to their having gone out striving in His cause seeking His approval; secret affection exposed by His knowledge of both the concealed and the declared, with whoever persists named as straying from the sound way; the warning that such people, if dominant, would act as enemies with hands and tongues and wish for their disbelief; kinship and offspring declared useless before the Resurrection judgement under His sight of all deeds" },
  { id: "ext-060-p2", from: 4, to: 7,
    label: "excellent pattern in Abraham and those with him when they said to their people we are disassociated from you and whatever you worship other than Allah, we have denied you and animosity and hatred appeared forever until you believe in Allah alone; except Abraham's saying to his father I will surely ask forgiveness for you but I have no power for you against Allah; Our Lord upon You we relied to You we returned and to You is the destination; Our Lord make us not objects of torment for the disbelievers and forgive us, You are Exalted in Might Wise; excellent pattern for anyone whose hope is in Allah and the Last Day, whoever turns away Allah Free of need Praiseworthy; perhaps Allah will put affection between you and those you were enemies with, Allah competent Forgiving Merciful",
    mainLabel: "The excellent pattern set in Abraham and his companions declaring disassociation from their people and their worship, denying them and announcing lasting animosity until they believe in Allah alone; the single exception of Abraham's promise to seek forgiveness for his father while admitting he holds no power against Allah; their declaration of reliance, return and final destination; the taught supplication asking not to be made objects of torment for disbelievers and for forgiveness under might and wisdom; the pattern reaffirmed for whoever hopes in Allah and the Last Day, with divine independence and praiseworthiness against whoever turns away; the possibility opened that Allah may place affection between former enemies, under competence, forgiveness and mercy" },
  { id: "ext-060-p3", from: 8, to: 9,
    label: "Allah does not forbid you from those who do not fight you because of religion and do not expel you from your homes from being righteous toward them and acting justly toward them, indeed Allah loves those who act justly; Allah only forbids you from those who fight you because of religion and expel you from your homes and aid in your expulsion that you make allies of them, whoever makes allies of them those are the wrongdoers",
    mainLabel: "The distinction drawn between two categories of non-believers: those who neither fight over religion nor expel the believers, toward whom righteousness and justice are permitted since Allah loves the just; and those who fight over religion, expel the believers and assist in their expulsion, alliance with whom is forbidden and renders the ally a wrongdoer" },
  { id: "ext-060-p4", from: 10, to: 13,
    label: "O believed when believing women come as emigrants examine them, Allah most knowing of their faith; if you know them believers do not return them to disbelievers, they are not lawful wives for them nor lawful husbands; give the disbelievers what they spent; no blame if you marry them having given due compensation; hold not marriage bonds with disbelieving women but ask what you spent and let them ask what they spent; that is the judgement of Allah He judges between you, Knowing Wise; if you lost wives to disbelievers and subsequently obtain something give those whose wives gone the equivalent of what they spent, fear Allah in whom you believe; O Prophet when believing women come pledging not to associate anything with Allah nor steal nor commit unlawful sexual intercourse nor kill their children nor bring forth invented slander nor disobey you in what is right, accept their pledge and ask forgiveness for them, Forgiving Merciful; O believed do not make allies of a people Allah angry with, they despaired of the Hereafter as disbelievers despaired of meeting the inhabitants of the graves",
    mainLabel: "Emigrant believing women to be examined, with Allah most knowing of their faith; once recognised as believers they must not be returned to disbelievers since the marriage bond is dissolved in both directions, while the disbelievers' expenditure is reimbursed and remarriage permitted after due compensation; marriage bonds with disbelieving women not to be maintained, with mutual claims for expenditure settled as Allah's judgement under knowledge and wisdom; compensation ruled for men whose wives went over to the disbelievers, under taqwa; the Prophet instructed to accept the pledge of believing women covering six commitments — no association, no theft, no unlawful intercourse, no killing of children, no invented slander and no disobedience in what is right — then to seek forgiveness for them; closing prohibition of alliance with a people under divine anger who have despaired of the Hereafter as disbelievers despair of meeting the grave-dwellers" }
];

const SUB_LABELS = {
  "ext-060-p1": [
    "Prohibition of allying with Allah's enemies by extending affection to those who expelled the Prophet and believers for their faith, with secret affection exposed by His knowledge of the concealed and declared",
    "Warning that such people, if dominant, would act as enemies with hands and tongues and wish for the believers' disbelief",
    "Kinship and offspring declared useless before the Resurrection judgement under His sight of all deeds"
  ],
  "ext-060-p2": [
    "Abraham's pattern of disassociation from his people's worship with lasting animosity until belief in Allah alone, excepting his promise to seek forgiveness for his father",
    "Taught supplication asking not to be made objects of torment for disbelievers and for forgiveness under might and wisdom",
    "The pattern reaffirmed for whoever hopes in Allah and the Last Day, with divine independence against whoever turns away",
    "The possibility that Allah may place affection between former enemies, under competence, forgiveness and mercy"
  ],
  "ext-060-p3": [
    "Righteousness and justice permitted toward those who neither fight over religion nor expel the believers, since Allah loves the just",
    "Alliance forbidden with those who fight over religion, expel the believers and assist in their expulsion, rendering the ally a wrongdoer"
  ],
  "ext-060-p4": [
    "Emigrant believing women examined and not returned to disbelievers, marriage dissolved both ways with expenditure reimbursed and remarriage permitted after compensation",
    "Compensation ruled for men whose wives went over to the disbelievers, under taqwa in whom they believe",
    "The Prophet instructed to accept the women's six-part pledge and seek forgiveness for them",
    "Closing prohibition of alliance with a people under divine anger who have despaired of the Hereafter"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`60:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`60:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 60, surahName: "Al-Mumtahanah",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the kinship-futility and Resurrection-judgement statement (3) before the Abrahamic pattern opens (4); P2 ends with the possible-affection concession (7) before the two-category justice rule begins (8); P3 covers the permitted and forbidden categories of non-believers (8-9); P4 runs from the examination of emigrant women through compensation rulings, the women's pledge and the closing alliance prohibition (10-13).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (60:1-3) ===
{
  const e = extractions[0];
  const baseer = findWord(3, ["\u0628","\u0635","\u064a","\u0631"]);
  if (baseer) e.divineNamesAndAttributes.push({ term: baseer, transliteration: "Baseer", gloss: "Seeing (editorial gloss)", keys: ["60:3"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["60:1"], excerpt: fv(1), description: "Do not take My enemies and your enemies as allies, extending to them affection." });

  e.humanConditionsAndSpiritualStates.push({ label: "Secret affection extended to hostile parties despite knowledge of their expulsion of the believers", keys: ["60:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wishing that the believers would disbelieve as the hostile party's aim", keys: ["60:2"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Expulsion of the Prophet and the community solely for belief in Allah", keys: ["60:1"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Concealed and declared alike known to Allah, with straying from the sound way named as the consequence", keys: ["60:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Relatives and children unable to benefit before the Resurrection judgement", keys: ["60:3"], evidenceClass: "EXPLICIT_TEXT" });

  const awliya = findWord(1, ["\u0623","\u0648","\u0644","\u064a","\u0627"]);
  if (awliya) e.terminology.push({ term: awliya, transliteration: "awliya", gloss: "allies/protectors (editorial gloss)", keys: ["60:1"] });
}

// === POPULATE P2 (60:4-7) ===
{
  const e = extractions[1];
  const aziz = findWord(5, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(5, ["\u062d","\u0643","\u064a","\u0645"]);
  const ghani = findWord(6, ["\u063a","\u0646","\u064a"]);
  const hameed = findWord(6, ["\u062d","\u0645","\u064a","\u062f"]);
  const ghafoor = findWord(7, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(7, ["\u0631","\u062d","\u064a","\u0645"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["60:5"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["60:5"] });
  if (ghani) e.divineNamesAndAttributes.push({ term: ghani, transliteration: "Ghani", gloss: "Free of need (editorial gloss)", keys: ["60:6"] });
  if (hameed) e.divineNamesAndAttributes.push({ term: hameed, transliteration: "Hameed", gloss: "Praiseworthy (editorial gloss)", keys: ["60:6"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["60:7"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["60:7"] });

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["60:4"], excerpt: fv(4), description: "Our Lord, upon You we have relied, and to You we have returned, and to You is the destination." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["60:5"], excerpt: fv(5), description: "Our Lord, make us not objects of torment for the disbelievers and forgive us, our Lord." });

  e.propheticNarratives.push({ label: "Abraham and those with him disassociating from their people and their worship, declaring lasting animosity until belief in Allah alone, with the exception of his promise to seek forgiveness for his father", keys: ["60:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Hope in Allah and the Last Day named as the condition for following the Abrahamic pattern", keys: ["60:6"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Bara'ah declared publicly with animosity until exclusive belief, tempered by the filial exception", keys: ["60:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Reliance, return and final destination declared together in the taught supplication", keys: ["60:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Affection between former enemies left open as a divine possibility", keys: ["60:7"], evidenceClass: "EXPLICIT_TEXT" });

  const uswah = findWord(4, ["\u0623","\u0633","\u0648","\u0629"]);
  if (uswah) e.terminology.push({ term: uswah, transliteration: "uswah hasanah", gloss: "excellent pattern (editorial gloss)", keys: ["60:4"] });
}

// === POPULATE P3 (60:8-9) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["60:8"], excerpt: fv(8), description: "Be righteous toward them and act justly toward them — those who do not fight you over religion or expel you." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["60:9"], excerpt: fv(9), description: "Allah only forbids you from making allies of those who fight you over religion, expel you and aid in your expulsion." });

  e.humanConditionsAndSpiritualStates.push({ label: "Alliance with active persecutors named as wrongdoing", keys: ["60:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Two-category rule distinguishing peaceful non-believers from fighting expellers", keys: ["60:8","60:9"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Allah loving those who act justly toward the non-hostile", keys: ["60:8"], evidenceClass: "EXPLICIT_TEXT" });

  const muqsit = findWord(8, ["\u0645","\u0642","\u0633","\u0637"]);
  if (muqsit) e.terminology.push({ term: muqsit, transliteration: "muqsitun", gloss: "those who act justly (editorial gloss)", keys: ["60:8"] });
}

// === POPULATE P4 (60:10-13) ===
{
  const e = extractions[3];
  const aleem = findWord(10, ["\u0639","\u0644","\u064a","\u0645"]);
  const hakeem = findWord(10, ["\u062d","\u0643","\u064a","\u0645"]);
  const ghafoor = findWord(12, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(12, ["\u0631","\u062d","\u064a","\u0645"]);
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["60:10"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["60:10"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["60:12"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["60:12"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["60:10"], excerpt: fv(10), description: "When the believing women come to you as emigrants, examine them." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["60:10"], excerpt: fv(10), description: "Do not return them to the disbelievers, and hold not to marriage bonds with disbelieving women." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["60:12"], excerpt: fv(12), description: "Accept their pledge and ask forgiveness for them of Allah." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["60:13"], excerpt: fv(13), description: "Do not make allies of a people with whom Allah has become angry." });

  e.humanConditionsAndSpiritualStates.push({ label: "Despair of the Hereafter likened to disbelievers' despair of meeting the grave-dwellers", keys: ["60:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Marriage dissolution across the faith boundary with reciprocal reimbursement of dower expenditure", keys: ["60:10","60:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Six-part women's pledge covering tawheed, theft, chastity, infanticide, slander and obedience in what is right", keys: ["60:12"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Faith examination assigned to the community while Allah remains most knowing of their belief", keys: ["60:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "The rulings named the judgement of Allah who judges between them", keys: ["60:10"], evidenceClass: "EXPLICIT_TEXT" });

  const mumtahanah = findWord(10, ["\u0645","\u062a","\u062d","\u0646"]);
  if (mumtahanah) e.terminology.push({ term: mumtahanah, transliteration: "famtahinuhunna", gloss: "examine them (editorial gloss)", keys: ["60:10"] });
  const bayah = findWord(12, ["\u0628","\u0627","\u064a","\u0639"]);
  if (bayah) e.terminology.push({ term: bayah, transliteration: "yubayi'naka", gloss: "pledging to you (editorial gloss)", keys: ["60:12"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `060-al-mumtahanah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 060-al-mumtahanah-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-060-p1,ext-060-p2,ext-060-p3,ext-060-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1728", label: "Alliance with persecuting enemies forbidden despite concealed affection", def: "In 60:1: O you who have believed do not take My enemies and your enemies as allies extending to them affection while they have disbelieved in what came to you of the truth, having driven out the Prophet and yourselves only because you believe in Allah your Lord; you confide to them affection but I am most knowing of what you have concealed and what you have declared.", key: "60:1", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Wala' boundaries defined by persecution."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Sirr and jahr both known."}] },
  { id: "cand-1729", label: "Kinship and offspring useless before the Resurrection judgement", def: "In 60:3: Never will your relatives or your children benefit you; the Day of Resurrection He will judge between you; and Allah of what you do is Seeing.", key: "60:3", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Yafsilu baynakum."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Kinship subordinated to loyalty."}] },

  { id: "cand-1730", label: "Abrahamic pattern of disassociation with the filial forgiveness exception", def: "In 60:4: There has already been for you an excellent pattern in Abraham and those with him when they said to their people indeed we are disassociated from you and from whatever you worship other than Allah, and there has appeared between us and you animosity and hatred forever until you believe in Allah alone, except for the saying of Abraham to his father I will surely ask forgiveness for you but I have not power to do for you anything against Allah.", key: "60:4", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Uswah hasanah of bara'ah."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Filial istighfar exception preserved."}] },
  { id: "cand-1731", label: "Taught supplication against becoming an object of torment for disbelievers", def: "In 60:5: Our Lord make us not objects of torment for the disbelievers and forgive us our Lord; indeed it is You who is the Exalted in Might the Wise.", key: "60:5", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Fitnah avoidance dua."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Istighfar within the same plea."}] },
  { id: "cand-1732", label: "Affection between former enemies left open as divine possibility", def: "In 60:7: Perhaps Allah will put between you and those to whom you have been enemies among them affection; and Allah is competent and Allah is Forgiving and Merciful.", key: "60:7", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Mawaddah as possible outcome."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Reconciliation not foreclosed."}] },

  { id: "cand-1733", label: "Righteousness and justice permitted toward non-hostile non-believers", def: "In 60:8: Allah does not forbid you from those who do not fight you because of religion and do not expel you from your homes from being righteous toward them and acting justly toward them; indeed Allah loves those who act justly.", key: "60:8", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Qist owed regardless of creed."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Birr toward the peaceful."}] },
  { id: "cand-1734", label: "Alliance forbidden only with fighters, expellers and their assistants", def: "In 60:9: Allah only forbids you from those who fight you because of religion and expel you from your homes and aid in your expulsion that you make allies of them; and whoever makes allies of them then it is those who are the wrongdoers.", key: "60:9", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Three-fold hostility criterion."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Zalimun verdict on the ally."}] },

  { id: "cand-1735", label: "Examination of emigrant women with marriage dissolution and dower reimbursement", def: "In 60:10: O you who have believed when the believing women come to you as emigrants examine them, Allah is most knowing as to their faith; and if you know them to be believers then do not return them to the disbelievers, they are not lawful wives for them nor are they lawful husbands for them, but give the disbelievers what they have spent; and hold not to marriage bonds with disbelieving women but ask for what you have spent and let them ask for what they have spent; that is the judgement of Allah.", key: "60:10", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Marriage law at the faith boundary."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Reciprocal financial settlement."}] },
  { id: "cand-1736", label: "Six-part women's pledge accepted with prophetic istighfar", def: "In 60:12: O Prophet when the believing women come to you pledging that they will not associate anything with Allah nor steal nor commit unlawful sexual intercourse nor kill their children nor bring forth a slander they have invented nor disobey you in what is right, then accept their pledge and ask forgiveness for them of Allah.", key: "60:12", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Shirk renounced first in the pledge."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Six ethical commitments enumerated."}] },
  { id: "cand-1737", label: "Despair of the Hereafter likened to despair of the grave-dwellers", def: "In 60:13: O you who have believed do not make allies of a people with whom Allah has become angry; they have despaired of the Hereafter just as the disbelievers have despaired of meeting the inhabitants of the graves.", key: "60:13", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ya'isu min al-akhirah."},{topicId:"divine-wrath",layer:"scholarly",relationship:"related-not-identical",note:"Ghadab as the alliance bar."}] }
];

function citedKeys(def) {
  const m = def.match(/\bIn\s+(\d+):(\d+)(?:\s*[-\u2013]\s*(\d+))?/i);
  if (!m) return null;
  const s = Number(m[1]);
  const from = Number(m[2]);
  const to = m[3] ? Number(m[3]) : from;
  const out = [];
  for (let a = from; a <= to; a++) out.push(`${s}:${a}`);
  return out;
}

for (const cd of CAND_DEFS) {
  const keys = citedKeys(cd.def) || [cd.key];
  if (!keys.includes(cd.key)) keys.push(cd.key);
  const evidence = keys.map(k => ({
    key: k,
    excerpt: fv(Number(k.split(":")[1])),
    evidenceClass: "EXPLICIT_TEXT",
    rationale: "Full verse text as evidence for the cited span."
  }));
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence,
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 9 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 2).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(2, 5).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(5, 7).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(7, 10).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `060-al-mumtahanah-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-084.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-084.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
