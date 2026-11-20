// MFD-11 Wave 9: Surah 65 (At-Talaq) genuine re-extraction.
// Covers 65:1-12 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "065-0001-0012.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 65:${n} not found`);
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

console.log("Generating Surah 65 (At-Talaq) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T18:55:00.000Z";

const PASSAGES = [
  { id: "ext-065-p1", from: 1, to: 7,
    label: "O Prophet when divorce women divorce them commencement waiting period keep count fear Allah your Lord; do not turn out houses nor leave unless clear immorality; those limits Allah whoever transgresses wronged himself; know not perhaps Allah bring about after that different matter; when fulfilled term retain acceptable terms or part acceptable terms; bring witness two just men establish testimony acceptance Allah; instructed whoever believe Allah Last Day; whoever fears Allah make way out; provide where not expect; relies upon Allah sufficient Him; indeed Allah accomplish purpose set everything decreed extent; those no longer expect menstruation doubt period three months also those not menstruated; pregnant term until give birth; whoever fears Allah make matter ease; command Allah sent down you; whoever fears Allah remove misdeeds make great reward; lodge them section dwell means do not harm oppress; if pregnant spend until give birth; if breastfeed give payment confer acceptable way; if discord another woman breastfeed father; man wealth spend wealth provision restricted spend what Allah given; Allah does not charge soul except what given; Allah bring about after hardship ease",
    mainLabel: "Divorce commanded at the commencement of the waiting period with its count maintained under taqwa; wives not expelled from their homes nor leaving themselves unless committing clear immorality, these being Allah's limits whose transgression is self-wronging since He may yet bring a new matter; retention or separation at term's end on acceptable terms witnessed by two just men as instruction for believers in Allah and the Last Day; whoever fears Allah receiving a way out and provision from unexpected sources, with reliance on Him sufficing since He accomplishes His purpose having set every matter's extent; post-menopausal and non-menstruating women assigned three months while pregnancy lasts until delivery, with ease promised to the God-fearing; this named Allah's sent-down command removing misdeeds and magnifying reward; lodging within means without oppressive harm, spending on pregnant women until delivery, nursing compensation settled amicably or delegated to another nurse if discord arises; the wealthy spending from wealth and the restricted from what Allah gave, since He charges no soul beyond its portion and brings ease after hardship" },
  { id: "ext-065-p2", from: 8, to: 11,
    label: "how many city insolent toward command Lord messengers took severe account punished terrible punishment; tasted bad consequence affair outcome loss; Allah prepared severe punishment; fear Allah O understanding believed; Allah sent down Quran; Messenger reciting distinct verses Allah bring out believe righteous deeds darknesses light; whoever believes Allah righteousness admit gardens rivers flow abide forever perfected provision",
    mainLabel: "Countless cities insolent toward their Lord's command and His messengers brought to severe account and terribly punished, tasting the evil consequence of their affair ending in loss with severe punishment prepared; people of understanding who believe warned to fear Allah since He has sent down the Quran through a Messenger reciting distinct verses to bring believing doers of righteousness from darknesses into light, admitting them to eternal rivered gardens with perfected provision" },
  { id: "ext-065-p3", from: 12, to: 12,
    label: "Allah created seven heavens earth like them command descends among them know Allah over all competent encompassed all knowledge",
    mainLabel: "Allah creating seven heavens and earths alike with His command descending among them so they know He is competent over all things and has encompassed everything in knowledge" }
];

const SUB_LABELS = {
  "ext-065-p1": [
    "Divorce at the commencement of the waiting period with its count maintained under taqwa, wives not expelled nor leaving unless committing clear immorality — Allah's limits whose transgression is self-wronging",
    "Retention or separation at term's end on acceptable terms witnessed by two just men as instruction for believers in Allah and the Last Day",
    "Whoever fears Allah receiving a way out and provision from unexpected sources, with reliance on Him sufficing since He accomplishes His purpose having set every matter's extent",
    "Post-menopausal and non-menstruating women assigned three months while pregnancy lasts until delivery, with ease promised to the God-fearing",
    "This named Allah's sent-down command removing misdeeds and magnifying reward",
    "Lodging within means without oppressive harm, spending on pregnant women until delivery, nursing compensation settled amicably or delegated if discord arises",
    "The wealthy spending from wealth and the restricted from what Allah gave, since He charges no soul beyond its portion and brings ease after hardship"
  ],
  "ext-065-p2": [
    "Cities insolent toward divine command and messengers brought to severe account and terribly punished, tasting the evil consequence ending in loss",
    "Severe punishment prepared for them, with people of understanding who believe warned to fear Allah",
    "Allah sending down the Quran through a Messenger reciting distinct verses to bring believers from darknesses into light",
    "Believing doers of righteousness admitted to eternal rivered gardens with perfected provision"
  ],
  "ext-065-p3": [
    "Seven heavens and earths alike created with His command descending among them so they know He is competent over all things and has encompassed everything in knowledge"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`65:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`65:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 65, surahName: "At-Talaq",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 9 genuine re-extraction. Boundaries follow the text: P1 closes with the capacity-based spending and ease-after-hardship principle (7) before the historical-warning block opens (8); P2 ends with the garden-admission and perfected-provision promise (11) before the closing cosmological declaration (12); P3 is the single-verse cosmic frame affirming competence and comprehensive knowledge.",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (65:1-7) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["65:1"], excerpt: fv(1), description: "When you divorce women, divorce them for the commencement of their waiting period and keep count of it." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["65:1"], excerpt: fv(1), description: "Do not turn them out of their houses, nor should they leave during that period unless they commit clear immorality." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["65:2"], excerpt: fv(2), description: "When they have nearly fulfilled their term, either retain them on acceptable terms or part with them on acceptable terms, and bring two just witnesses." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["65:6"], excerpt: fv(6), description: "Lodge them in a section of where you dwell out of your means and do not harm them to oppress them." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["65:7"], excerpt: fv(7), description: "Let a man of wealth spend from his wealth, and he whose provision is restricted let him spend from what Allah has given him." });

  e.humanConditionsAndSpiritualStates.push({ label: "Transgressing Allah's limits in divorce proceedings identified as self-wronging", keys: ["65:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Way out and unexpected provision granted to whoever fears Allah and relies upon Him", keys: ["65:2","65:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Ease made in one's matter for whoever fears Allah", keys: ["65:4"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Waiting-period lodging mandated within means without oppressive harm", keys: ["65:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Nursing compensation settled amicably or delegated to another nurse if discord arises", keys: ["65:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Capacity-based spending: wealthy from wealth, restricted from what Allah gave", keys: ["65:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divorce boundaries framed as Allah's limits protecting both parties", keys: ["65:1"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Ease following hardship declared as a divine pattern", keys: ["65:7"], evidenceClass: "EXPLICIT_TEXT" });

  const iddah = findWord(1, ["\u0639","\u062f"]);
  if (iddah) e.terminology.push({ term: iddah, transliteration: "iddah", gloss: "waiting period (editorial gloss)", keys: ["65:1"] });
  const hudud = findWord(1, ["\u062d","\u062f","\u0648","\u062f"]);
  if (hudud) e.terminology.push({ term: hudud, transliteration: "hudud Allah", gloss: "limits set by Allah (editorial gloss)", keys: ["65:1"] });
  const qadr = findWord(3, ["\u0642","\u062f","\u0631"]);
  if (qadr) e.terminology.push({ term: qadr, transliteration: "qadr", gloss: "decreed extent (editorial gloss)", keys: ["65:3"] });
}

// === POPULATE P2 (65:8-11) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["65:10"], excerpt: fv(10), description: "So fear Allah, O you of understanding who have believed." });

  e.humanConditionsAndSpiritualStates.push({ label: "Insolent cities tasting the evil consequence of their affair ending in loss", keys: ["65:8","65:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Believers brought from darknesses into light through distinct recited verses", keys: ["65:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Quran sent down through a Messenger reciting distinct verses for guidance", keys: ["65:10","65:11"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Severe punishment prepared for insolent communities as warning to the understanding", keys: ["65:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Eternal rivered gardens with perfected provision for believing doers of righteousness", keys: ["65:11"], evidenceClass: "EXPLICIT_TEXT" });

  const naba = findWord(10, ["\u0630","\u0643","\u0631"]);
  // Using dhikr/quran reference
  const ayat = findWord(11, ["\u0622","\u064a","\u0627","\u062a"]);
  if (ayat) e.terminology.push({ term: ayat, transliteration: "ayat mubayyinah", gloss: "distinct verses (editorial gloss)", keys: ["65:11"] });
}

// === POPULATE P3 (65:12) ===
{
  const e = extractions[2];
  const qadeer = findWord(12, ["\u0642","\u062f","\u064a","\u0631"]);
  const muhit = findWord(12, ["\u0645","\u062d","\u064a","\u0637"]);
  if (qadeer) e.divineNamesAndAttributes.push({ term: qadeer, transliteration: "Qadeer", gloss: "Competent (editorial gloss)", keys: ["65:12"] });

  e.relationships.push({ label: "Seven heavens and earths alike with command descending among them demonstrating competence and comprehensive knowledge", keys: ["65:12"], evidenceClass: "EXPLICIT_TEXT" });

  const sabaa = findWord(12, ["\u0633","\u0628","\u0639"]);
  if (sabaa) e.terminology.push({ term: sabaa, transliteration: "sab'a samawat", gloss: "seven heavens (editorial gloss)", keys: ["65:12"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `065-at-talaq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 065-at-talaq-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-065-p1,ext-065-p2,ext-065-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1774", label: "Divorce at the waiting period's commencement with housing protection and limit-transgression warning", def: "In 65:1: O Prophet when you divorce women divorce them for the commencement of their waiting period and keep count of the waiting period and fear Allah your Lord; do not turn them out of their houses nor should they leave during that period unless they are committing a clear immorality; and those are the limits set by Allah; and whoever transgresses the limits of Allah has certainly wronged himself.", key: "65:1", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Talaq timing and housing rights."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Hudud Allah protecting both parties."}] },
  { id: "cand-1775", label: "Way out and unexpected provision for whoever fears Allah and relies upon Him", def: "In 65:2-3: And whoever fears Allah He will make for him a way out and will provide for him from where he does not expect; and whoever relies upon Allah then He is sufficient for him; indeed Allah will accomplish His purpose.", key: "65:2", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Taqwa plus tawakkul producing makhraj."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Rizq min haythu la yahtasib."}] },
  { id: "cand-1776", label: "Differentiated waiting periods for post-menopausal, non-menstruating and pregnant women", def: "In 65:4: And those who no longer expect menstruation among your women if you doubt then their period is three months and also for those who have not menstruated; and for those who are pregnant their term is until they give birth.", key: "65:4", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Iddah categories detailed."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"related-not-identical",note:"Legal precision reflecting divine wisdom."}] },
  { id: "cand-1777", label: "Capacity-based financial obligation with ease following hardship", def: "In 65:7: Let a man of wealth spend from his wealth and he whose provision is restricted let him spend from what Allah has given him; Allah does not charge a soul except according to what He has given it; Allah will bring about after hardship ease.", key: "65:7", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"La yukallifu illa ma ata."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Ba'd al-'usr yusra."}] },

  { id: "cand-1778", label: "Insolent cities brought to severe account tasting the evil consequence of their affair", def: "In 65:8-9: And how many a city was insolent toward the command of its Lord and His messengers so We took it to severe account and punished it with a terrible punishment; and it tasted the bad consequence of its affair and the outcome of its affair was loss.", key: "65:8", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Hisab shadid for 'atāw."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Dhaqat wabal amriha."}] },
  { id: "cand-1779", label: "Messenger reciting distinct verses bringing believers from darknesses into light", def: "In 65:11: A Messenger reciting to you the distinct verses of Allah that He may bring out those who believe and do righteous deeds from darknesses into the light.", key: "65:11", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Yatlu ayat mubayyinah."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Min al-zulumat ila al-nur as revelatory function."}] },

  { id: "cand-1780", label: "Seven heavens and earths with descending command demonstrating competence and comprehensive knowledge", def: "In 65:12: It is Allah who has created seven heavens and of the earth the like of them; His command descends among them so you may know that Allah is over all things competent and that Allah has encompassed all things in knowledge.", key: "65:12", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sab'a samawat wa-ard."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Ahata bi-kulli shay'in 'ilma."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 4).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(4, 6).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(6, 7).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `065-at-talaq-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-089.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-089.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");