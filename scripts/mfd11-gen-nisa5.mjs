// MFD-11 Nisa Pass 5 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah An-Nisa 4:153-176 (Passages 17-19, Candidates cand-0217..cand-0226).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "004-0153-0176.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 4:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Nisa Pass 5 files from verbatim corpus (4:153-176)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T07:48:00.000Z";

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

// ─── Passage 17: 4:153–162 ────────────────────────────────────────────────────────
const p17 = {
  extractionId: "ext-004-p17",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: {
    fromAyah: 153,
    toAyah: 162,
    label: "An-Nisa — People of Scripture demand book from sky; asked Musa greater show us Allah openly thunderbolt seized them; took calf after clear proofs yet pardoned gave Musa clear authority; raised Mount for covenant enter gate bowing do not transgress Sabbath solemn covenant; breaking covenant rejecting signs killing prophets unjustly saying hearts wrapped Allah sealed them for disbelief believe not except few; kufr and saying against Maryam great slander; saying we killed Messiah Isa son of Maryam messenger of Allah did not kill nor crucify but appeared so; those who differ in doubt no knowledge except assumption; did not kill him certainly; rather Allah raised him to Himself Aziz Hakeem; none of People of Scripture but will believe in him before death Day Resurrection witness against them; wrongdoing of Jews forbade good things previously lawful hindering many from Allah's way; taking riba though forbidden consuming wealth unjustly painful punishment for disbelievers among them; those firm in knowledge and believers believe in what revealed to you and before establishers of prayer givers of zakah believers in Allah Last Day great reward"
  },
  verseKeys: ["4:153","4:154","4:155","4:156","4:157","4:158","4:159","4:160","4:161","4:162"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `4:${i+153}`, text: fv(i+153) })),
  mainSubject: {
    label: "People of Scripture demanded physical manifestation of Allah thunderbolt seized them; took calf after clear proofs yet pardoned; raised Mount for covenant enter gate bowing do not transgress Sabbath; breaking covenant rejecting signs killing prophets hearts wrapped sealed for disbelief; slander against Maryam; claim of killing Isa denied he was not killed nor crucified but raised to Allah; all People of Scripture will believe before death; Jewish wrongdoing resulted in prohibition of good foods hindering from Allah's way taking riba consuming wealth unjustly; firm in knowledge and believers establishers of prayer givers of zakah earn great reward",
    keys: ["4:153","4:154","4:155","4:156","4:157","4:158","4:159","4:160","4:161","4:162"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Demand for physical manifestation of Allah and thunderbolt punishment", keys: ["4:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Calf worship after clear proofs; pardon and clear authority to Musa", keys: ["4:153"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mount raised for covenant; enter gate bowing; Sabbath prohibition", keys: ["4:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Solemn covenant taken from them", keys: ["4:154"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Breaking covenant rejecting signs killing prophets unjustly", keys: ["4:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hearts wrapped claim; Allah sealed them for disbelief", keys: ["4:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Great slander against Maryam", keys: ["4:156"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Claim of killing Isa denied; not killed nor crucified but appeared so", keys: ["4:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those who differ in doubt following assumption not knowledge", keys: ["4:157"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah raised Isa to Himself; Aziz Hakeem", keys: ["4:158"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "All People of Scripture will believe in Isa before death; witness on Resurrection", keys: ["4:159"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jewish wrongdoing: prohibition of previously lawful good foods", keys: ["4:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hindering many from Allah's way", keys: ["4:160"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taking riba despite prohibition; consuming wealth unjustly", keys: ["4:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Painful punishment prepared for disbelievers among them", keys: ["4:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Firm in knowledge and believers: belief in revelation prayer zakah great reward", keys: ["4:162"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Musa: demand for physical manifestation thunderbolt calf worship pardon clear authority Mount covenant Sabbath", keys: ["4:153","4:154","4:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa ibn Maryam: denial of killing/crucifixion raising to Allah future belief witness", keys: ["4:157","4:158","4:159"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Sealed hearts as consequence of persistent disbelief", keys: ["4:155"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Doubt based on assumption not knowledge", keys: ["4:157"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Riba prohibition and unjust wealth consumption as communal transgression", keys: ["4:161"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Punitive dietary restrictions as consequence of wrongdoing", keys: ["4:160"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0217","cand-0218","cand-0219","cand-0220"],
  notes: "Pass A Nisa passage 17/19. Comprehensive indictment of Bani Israel's historical transgressions: demanding physical manifestation, calf worship, covenant-breaking, prophet-killing, slandering Maryam, claiming Isa's murder. Isa narrative provides definitive Quranic correction: neither killed nor crucified but raised. Universal eschatological belief in Isa affirmed. Financial transgressions (riba, unjust wealth) linked to broader pattern of hindering from Allah's way. Contrasts with righteous remnant firm in knowledge.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P17 commands/prohibitions
p17.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:154"], excerpt: fv(154), description: "Prohibition: do not transgress on the Sabbath." });
p17.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:154"], excerpt: fv(154), description: "Command: enter the gate bowing humbly." });

// P17 divine names
{
  const t1 = findWordContaining(158, ["\u0639","\u0632","\u064a","\u0632"]); // AAazeezan
  const t2 = findWordContaining(158, ["\u062d","\u0643","\u064a","\u0645"]); // hakeeman
  if (t1 && t2) {
    const fullText = fv(158);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p17.divineNamesAndAttributes.push({ term: phrase, transliteration: "AAazeezan Hakeema", gloss: "Exalted in Might Wise (editorial gloss)", keys: ["4:158"] });
    }
  }
}

// P17 terminology
{
  const t = findWordContaining(153, ["\u0633","\u0644","\u0637","\u0627","\u0646"]); // sultanan
  if (t) p17.terminology.push({ term: t, transliteration: "sultanan", gloss: "clear authority/proof (editorial gloss)", keys: ["4:153"] });
}
{
  const t = findWordContaining(154, ["\u0645","\u064a","\u062b","\u0627","\u0642"]); // meethaqan
  if (t) p17.terminology.push({ term: t, transliteration: "meethaqan", gloss: "solemn covenant (editorial gloss)", keys: ["4:154"] });
}
{
  const t = findWordContaining(155, ["\u063a","\u0644","\u0641"]); // ghulfun
  if (t) p17.terminology.push({ term: t, transliteration: "ghulfun", gloss: "wrapped/covered hearts (editorial gloss)", keys: ["4:155"] });
}
{
  const t = findWordContaining(156, ["\u0628","\u0647","\u062a","\u0627","\u0646"]); // buhtanan
  if (t) p17.terminology.push({ term: t, transliteration: "buhtanan", gloss: "great slander/fabrication (editorial gloss)", keys: ["4:156"] });
}
{
  const t = findWordContaining(161, ["\u0631","\u0628","\u0648"]); // alrriba
  if (t) p17.terminology.push({ term: t, transliteration: "al-rriba", gloss: "usury/interest (editorial gloss)", keys: ["4:161"] });
}
{
  const t = findWordContaining(162, ["\u0631","\u0627","\u0633","\u062e"]); // alrrasikhoona
  if (t) p17.terminology.push({ term: t, transliteration: "al-rasikhoona", gloss: "firm/rooted in knowledge (editorial gloss)", keys: ["4:162"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p17.json"), JSON.stringify(p17, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p17.json");

// ─── Passage 18: 4:163–170 ───────────────────────────────────────────────────────
const p18 = {
  extractionId: "ext-004-p18",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: {
    fromAyah: 163,
    toAyah: 170,
    label: "An-Nisa — Revelation to Muhammad as to Nuh and prophets after; inspired Ibrahim Ismail Ishaq Yaqub tribes Isa Ayyub Yunus Harun Sulayman; gave Dawud Zabur; messengers mentioned and not mentioned; Allah spoke directly to Musa; messengers bearers of good news warners so mankind has no argument against Allah after messengers; Allah bears witness to what sent down with His knowledge angels bear witness sufficient is Allah as Witness; disbelievers hindering from Allah's way gone far astray; disbelievers wrongdoers Allah never forgive nor guide except way Hell abiding forever easy for Allah; O mankind Messenger came with truth from Lord believe better for you; if disbelieve to Allah belongs heavens earth Allah Knowing Wise"
  },
  verseKeys: ["4:163","4:164","4:165","4:166","4:167","4:168","4:169","4:170"],
  arabicExcerpts: Array.from({length:8}, (_,i) => ({ key: `4:${i+163}`, text: fv(i+163) })),
  mainSubject: {
    label: "Revelation continuity: inspired Muhammad as Nuh and prophets including Ibrahim Ismail Ishaq Yaqub tribes Isa Ayyub Yunus Harun Sulayman; gave Dawud Zabur; Allah spoke directly to Musa; messengers bearers of good news and warners removing argument against Allah; Allah bears witness to revelation sent with His knowledge angels also witness sufficient is Allah as Witness; disbelievers hindering from Allah's way gone far astray; unforgivable disbelief with wrongdoing leads only to Hell eternally; O mankind Messenger came with truth believe better; if disbelieve Allah owns all Knowing Wise",
    keys: ["4:163","4:164","4:165","4:166","4:167","4:168","4:169","4:170"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Revelation continuity across named prophets and unnamed messengers", keys: ["4:163","4:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Direct speech to Musa as unique distinction", keys: ["4:164"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messengers as good-news-bearers and warners removing post-messenger argument", keys: ["4:165"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Triple witness: Allah His knowledge and angels attest to revelation", keys: ["4:166"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Far astray: disbelievers hindering from Allah's way", keys: ["4:167"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Unforgivable: disbelief combined with wrongdoing", keys: ["4:168"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Only path Hell eternal abode; easy for Allah", keys: ["4:169"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal address: Messenger came with truth believe better", keys: ["4:170"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine self-sufficiency: if disbelieve Allah owns all", keys: ["4:170"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Prophetic chain: Nuh Ibrahim Ismail Ishaq Yaqub tribes Isa Ayyub Yunus Harun Sulayman Dawud Musa", keys: ["4:163","4:164"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0221","cand-0222"],
  notes: "Pass A Nisa passage 18/19. Establishes prophetic continuity as theological foundation for Muhammad's message. Lists 13 named prophets plus unnamed others. Takleem (direct speech) to Musa distinguished. Triple-witness formula (Allah + knowledge + angels) provides epistemological grounding. Unforgivability clause (kufr + zulm) narrower than general kufr. Universal address (ya ayyuha al-nasu) expands audience beyond believers.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P18 commands
p18.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:170"], excerpt: fv(170), description: "Command: O mankind the Messenger has come with truth from your Lord so believe it is better for you." });

// P18 divine names
{
  const t1 = findWordContaining(165, ["\u0639","\u0632","\u064a","\u0632"]); // AAazeezan
  const t2 = findWordContaining(165, ["\u062d","\u0643","\u064a","\u0645"]); // hakeeman
  if (t1 && t2) {
    const fullText = fv(165);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p18.divineNamesAndAttributes.push({ term: phrase, transliteration: "AAazeezan Hakeema", gloss: "Exalted in Might Wise (editorial gloss)", keys: ["4:165"] });
    }
  }
}
{
  const t = findWordContaining(166, ["\u0634","\u0647","\u064a","\u062f"]); // shaheedan
  if (t) p18.divineNamesAndAttributes.push({ term: t, transliteration: "Shaheedan", gloss: "Witness (editorial gloss)", keys: ["4:166"] });
}
{
  const t1 = findWordContaining(170, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleeman
  const t2 = findWordContaining(170, ["\u062d","\u0643","\u064a","\u0645"]); // hakeeman
  if (t1 && t2) {
    const fullText = fv(170);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p18.divineNamesAndAttributes.push({ term: phrase, transliteration: "AAaleeman Hakeema", gloss: "Knowing Wise (editorial gloss)", keys: ["4:170"] });
    }
  }
}

// P18 terminology
{
  const t = findWordContaining(163, ["\u0632","\u0628","\u0648","\u0631"]); // zabooran
  if (t) p18.terminology.push({ term: t, transliteration: "zabooran", gloss: "Psalms/book of Dawud (editorial gloss)", keys: ["4:163"] });
}
{
  const t = findWordContaining(164, ["\u062a","\u0643","\u0644","\u064a","\u0645"]); // takleeman
  if (t) p18.terminology.push({ term: t, transliteration: "takleeman", gloss: "direct speech/conversation (editorial gloss)", keys: ["4:164"] });
}
{
  const t = findWordContaining(165, ["\u062d","\u062c","\u0629"]); // hujjatun
  if (t) p18.terminology.push({ term: t, transliteration: "hujjatun", gloss: "argument/proof (editorial gloss)", keys: ["4:165"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p18.json"), JSON.stringify(p18, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p18.json");

// ─── Passage 19: 4:171–176 ───────────────────────────────────────────────────────
const p19 = {
  extractionId: "ext-004-p19",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: {
    fromAyah: 171,
    toAyah: 176,
    label: "An-Nisa — O People of Scripture do not exceed limits in religion say nothing about Allah except truth; Messiah Isa son of Maryam only messenger of Allah and His Word directed to Maryam and spirit from Him; believe in Allah and messengers do not say Three desist better for you; Allah only one God exalted above having son; to Him belongs heavens earth sufficient as Disposer of affairs; Messiah would not disdain being servant nor angels near; whoever disdains worship arrogant He gathers all to Himself; believers righteous deeds rewards in full plus increase from bounty; disdainers arrogant painful punishment no protector helper; O mankind proof came from Lord sent down clear light; believers holding fast to Allah admitted mercy bounty guided straight path; ruling on kalalah: man dies no child has sister half inheritance; he inherits if she no child; two sisters two-thirds; siblings male female male share of two females; Allah makes clear lest you go astray Allah Knower of all things"
  },
  verseKeys: ["4:171","4:172","4:173","4:174","4:175","4:176"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `4:${i+171}`, text: fv(i+171) })),
  mainSubject: {
    label: "O People of Scripture do not exceed religious limits speak only truth about Allah; Isa ibn Maryam is messenger of Allah His Word cast to Maryam and spirit from Him not divine; believe in Allah and all messengers do not say Three desist; Allah one God exalted above having son; sufficient as Wakeel; Isa and angels would never disdain servitude; arrogant disdainers gathered for punishment; believers righteous deeds rewarded fully with increase; clear proof and light sent down; holding fast to Allah earns mercy bounty guidance; kalalah inheritance ruling: sister half brother inherits two sisters two-thirds male share of two females; Allah clarifies to prevent straying",
    keys: ["4:171","4:172","4:173","4:174","4:175","4:176"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Prohibition: do not exceed limits in religion", keys: ["4:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Speak only truth about Allah", keys: ["4:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa defined: messenger Word cast to Maryam spirit from Him", keys: ["4:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: do not say Three; desist it is better", keys: ["4:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawheed: Allah one God exalted above having son", keys: ["4:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa and angels would never disdain servitude to Allah", keys: ["4:172"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Arrogant disdainers gathered to Allah for judgment", keys: ["4:172"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believers righteous deeds: full reward plus increase from bounty", keys: ["4:173"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disdainers arrogant: painful punishment no protector helper", keys: ["4:173"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Clear proof and light sent down to mankind", keys: ["4:174"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Holding fast to Allah: mercy bounty straight path", keys: ["4:175"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kalalah inheritance: sister half; brother inherits; two sisters two-thirds; male double female", keys: ["4:176"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah clarifies to prevent straying; Knower of all things", keys: ["4:176"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Isa ibn Maryam: precise ontological status as messenger Word and spirit not divine", keys: ["4:171"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Religious excess (ghuluww) as deviation", keys: ["4:171"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Arrogance (istikbar) as barrier to worship", keys: ["4:172","4:173"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Kalalah inheritance law: gender-differentiated shares for siblings", keys: ["4:176"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0223","cand-0224","cand-0225","cand-0226"],
  notes: "Pass A Nisa passage 19/19. Concludes surah with three distinct blocks: (1) Christological correction addressing People of Scripture - precise definition of Isa as messenger/Word/spirit, explicit rejection of Trinity and divine sonship; (2) Servitude theology - Isa and angels model willing submission vs arrogant disdain; (3) Kalalah inheritance - final legislative ruling closing the surah's extensive family-law section. Ghuluww (excess) identified as root error. Wakeel (Disposer of affairs) frames divine sufficiency.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P19 commands/prohibitions
p19.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:171"], excerpt: fv(171), description: "Prohibition: do not exceed limits in your religion and do not say about Allah except the truth." });
p19.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:171"], excerpt: fv(171), description: "Prohibition: do not say Three (Trinity); desist it is better for you." });
p19.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:171"], excerpt: fv(171), description: "Command: believe in Allah and His messengers." });

// P19 divine names
{
  const t = findWordContaining(171, ["\u0648","\u0643","\u064a","\u0644"]); // wakeelan
  if (t) p19.divineNamesAndAttributes.push({ term: t, transliteration: "Wakeelan", gloss: "Disposer of affairs/Guardian (editorial gloss)", keys: ["4:171"] });
}
{
  const t = findWordContaining(176, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t) p19.divineNamesAndAttributes.push({ term: t, transliteration: "AAaleemun", gloss: "Knower of all things (editorial gloss)", keys: ["4:176"] });
}

// P19 terminology
{
  const t = findWordContaining(171, ["\u062a","\u063a","\u0644","\u0648"]); // taghloo
  if (t) p19.terminology.push({ term: t, transliteration: "taghloo", gloss: "exceed limits/exaggerate (editorial gloss)", keys: ["4:171"] });
}
{
  const t = findWordContaining(171, ["\u0643","\u0644","\u0645","\u0629"]); // kalimatuhu
  if (t) p19.terminology.push({ term: t, transliteration: "kalimatuhu", gloss: "His Word (editorial gloss)", keys: ["4:171"] });
}
{
  const t = findWordContaining(171, ["\u0631","\u0648","\u062d"]); // roohun
  if (t) p19.terminology.push({ term: t, transliteration: "roohun", gloss: "spirit/soul (editorial gloss)", keys: ["4:171"] });
}
{
  const t = findWordContaining(176, ["\u0643","\u0644","\u0627","\u0644","\u0629"]); // alkalalati
  if (t) p19.terminology.push({ term: t, transliteration: "al-kalalah", gloss: "one leaving neither descendants nor ascendants (editorial gloss)", keys: ["4:176"] });
}
{
  const t = findWordContaining(174, ["\u0628","\u0631","\u0647","\u0627","\u0646"]); // burhanun
  if (t) p19.terminology.push({ term: t, transliteration: "burhanun", gloss: "conclusive proof/demonstration (editorial gloss)", keys: ["4:174"] });
}
{
  const t = findWordContaining(174, ["\u0646","\u0648","\u0631"]); // nooran
  if (t) p19.terminology.push({ term: t, transliteration: "nooran", gloss: "light (editorial gloss)", keys: ["4:174"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p19.json"), JSON.stringify(p19, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p19.json");

// ─── Candidates batch (cand-0217 through cand-0226) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-004-p17,ext-004-p18,ext-004-p19",
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

// cand-0217: Isa non-crucifixion and raising
candidates.candidates.push(makeCand("cand-0217",
  "Isa non-crucifixion and divine raising: definitive Quranic correction denying killing or crucifixion affirming elevation to Allah",
  undefined, "عدم صلب عيسى ورفعه إلى الله: تصحيح قرآني قاطع ينفي القتل والصلب ويؤكد الرفع",
  "In 4:157-158: They said we killed the Messiah Isa son of Maryam messenger of Allah but they did not kill him nor crucify him but it was made to appear so to them. Those who differ are in doubt with no knowledge except assumption. They did not kill him for certain. Rather Allah raised him to Himself and Allah is Exalted in Might Wise.",
  [{ key: "4:157", excerpt: fv(157), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama qataloohu wama salaboohu walakin shubbiha lahum: triple negation (did not kill, did not crucify, but appeared so). Ma lahum bihi min AAilmin illa ittibaAAa alththanni: epistemological diagnosis - doubt based on assumption not knowledge. Wama qataloohu yaqeenan: emphatic certainty of non-killing." },
   { key: "4:158", excerpt: fv(158), evidenceClass: "EXPLICIT_TEXT", rationale: "Bal rafaAAahu Allahu ilayhi: divine raising as counter-narrative to crucifixion claim. AAazeezan Hakeema: might and wisdom frame the act." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept", note: "Core Quranic Isa narrative correcting crucifixion claim" }],
  "Overlap with isa-story (scholarly) confirmed. Most definitive Quranic statement on Isa's fate. Shubbiha lahum (made to appear so) leaves mechanism unspecified creating interpretive space. Yaqeenan (for certain) provides epistemic certainty contrasting with opponents' zann (assumption). Raising to Allah implies continued existence not death."
));

// cand-0218: Covenant-breaking pattern of Bani Israel
candidates.candidates.push(makeCand("cand-0218",
  "Covenant-breaking cycle: Bani Israel's repeated violations including calf worship Sabbath transgression prophet-killing and heart-sealing",
  undefined, "دورة نقض العهد: انتهاكات بني إسرائيل المتكررة من عبادة العجل وتجاوز السبت وقتل الأنبياء وختم القلوب",
  "In 4:153-155: They asked Musa to show Allah openly so thunderbolt seized them; then took calf after clear proofs; raised Mount for covenant enter gate bowing do not transgress Sabbath took solemn covenant; because breaking covenant rejecting signs killing prophets unjustly saying hearts wrapped Allah sealed them for disbelief so believe not except few.",
  [{ key: "4:153", excerpt: fv(153), evidenceClass: "EXPLICIT_TEXT", rationale: "Faqad saaloo moosa akbara min thalika faqaloo arina Allaha jahratan: audacious demand for physical manifestation. Faakhathathumu alssaAAiqatu bithulmihim: thunderbolt as consequence. Thumma ittakhathoo alAAijla: calf worship immediately after clear proofs." },
   { key: "4:154", excerpt: fv(154), evidenceClass: "EXPLICIT_TEXT", rationale: "WarafaAAna fawqahumu alttoora bimeethaqihim: Mount raised as covenant enforcement. La taAAdoo fee alssabti: Sabbath prohibition. Waakhathna minhum meethaqan ghaleethan: solemn covenant emphasized." },
   { key: "4:155", excerpt: fv(155), evidenceClass: "EXPLICIT_TEXT", rationale: "Fabima naqdihim meethaqahum: covenant-breaking as primary cause. Waqatlihimu alanbiyaa bighayri haqqin: prophet-killing without right. TabaAAa Allahu AAalayha bikufrihim: divine sealing as consequence." }],
  [{ topicId: "covenants-ahd", layer: "scholarly", relationship: "same-concept", note: "Detailed enumeration of covenant violations" }],
  "Overlap with covenants-ahd (scholarly) confirmed. Five enumerated violations: demanding physical manifestation, calf worship, refusing gate entry, Sabbath transgression, prophet-killing. Heart-sealing presented as divine response to persistent kufr not arbitrary predestination. Ghaleethan (solemn/heavy) emphasizes covenant gravity."
));

// cand-0219: Slander against Maryam
candidates.candidates.push(makeCand("cand-0219",
  "Slander against Maryam: great fabrication cited as distinct transgression alongside covenant-breaking and disbelief",
  undefined, "الافتراء على مريم: بهتان عظيم مذكور كمخالفة مستقلة مع نقض العهد والكفر",
  "In 4:156: And for their disbelief and their saying against Mary a great slander.",
  [{ key: "4:156", excerpt: fv(156), evidenceClass: "EXPLICIT_TEXT", rationale: "Wabikufrihim waqawlihim AAala maryama buhtanan AAatheeman: buhtan (slander/fabrication) qualified as AAatheem (great/enormous). Positioned between covenant violations and Isa-denial suggesting independent gravity." }],
  [],
  "Gap candidate. Only Quranic verse explicitly naming the slander against Maryam without specifying its content. Buhtan AAatheem (great fabrication) suggests severity exceeding ordinary falsehood. Placement in sequence implies slander against Maryam is distinct category of transgression not merely subset of general disbelief."
));

// cand-0220: Riba and unjust wealth consumption
candidates.candidates.push(makeCand("cand-0220",
  "Riba and unjust wealth consumption: financial transgressions cited as grounds for punitive dietary restrictions and painful punishment",
  undefined, "الربا وأكل أموال الناس بالباطل: مخالفات مالية سببت تحريم الطيبات وعذاب أليم",
  "In 4:160-161: For wrongdoing of those who were Jews We made unlawful good things previously lawful and for their averting from Allah's way many; and their taking riba while forbidden and consuming people's wealth unjustly. We prepared for disbelievers among them painful punishment.",
  [{ key: "4:160", excerpt: fv(160), evidenceClass: "EXPLICIT_TEXT", rationale: "Fabithulmin mina allatheena hadoo harramna AAalayhim tayyibatin ohillat lahum: punitive prohibition as consequence of zulm. Wabisaddihim AAan sabeeli Allahi katheeran: systemic hindering quantified as katheer." },
   { key: "4:161", excerpt: fv(161), evidenceClass: "EXPLICIT_TEXT", rationale: "Waakhthihimu alrriba waqad nuhoo AAanhu: riba taken despite explicit prior prohibition. Waaklihim amwala alnnasi bialbatili: unjust wealth consumption paired with riba. AAathaban aleeman: painful punishment specified." }],
  [{ topicId: "interest-free-finance", layer: "scholarly", relationship: "related-not-identical", note: "Historical precedent for riba prohibition in earlier community" }],
  "Overlap with interest-free-finance (scholarly) as related concept. Historical framing: riba prohibition existed before Islam (waqad nuhoo AAanhu). Pairing riba with batil wealth consumption suggests systemic economic injustice not isolated practice. Punitive dietary restriction (tahreem tayyibat) as temporal consequence distinguishes from eternal punishment."
));

// cand-0221: Prophetic revelation continuity
candidates.candidates.push(makeCand("cand-0221",
  "Prophetic revelation continuity: Muhammad's inspiration identical in kind to Nuh Ibrahim and thirteen named prophets establishing unified message",
  undefined, "استمرارية الوحي النبوي: وحي محمد مطابق لوحي نوح وإبراهيم وثلاثة عشر نبياً مؤكداً وحدة الرسالة",
  "In 4:163-164: Indeed We revealed to you as We revealed to Nuh and prophets after him. We revealed to Ibrahim Ismail Ishaq Yaqub tribes Isa Ayyub Yunus Harun Sulayman and gave Dawud Zabur. Messengers We mentioned before and messengers We did not mention. Allah spoke directly to Musa.",
  [{ key: "4:163", excerpt: fv(163), evidenceClass: "EXPLICIT_TEXT", rationale: "Inna awhayna ilayka kama awhayna ila noohin: kama (as/like) establishes equivalence of revelation mode. Thirteen named prophets plus asbat (tribes) create comprehensive chain. Waatayna dawooda zabooran: specific scripture gift noted." },
   { key: "4:164", excerpt: fv(164), evidenceClass: "EXPLICIT_TEXT", rationale: "Warusulan lam naqsushum AAalayka: acknowledgment of unnamed prophets prevents exhaustive enumeration. Wakallama Allahu moosa takleeman: direct speech distinguished as unique modality." }],
  [{ topicId: "prophets", layer: "curated", relationship: "same-concept", note: "Comprehensive prophetic chain establishing message unity" }],
  "Overlap with prophets (curated) confirmed. Kama awhayna (as We revealed) establishes qualitative identity of revelation across prophets. Named list spans patriarchal (Ibrahim Ismail Ishaq Yaqub), Levitical (Harun Sulayman Dawud), and universal (Nuh Isa Ayyub Yunus) traditions. Takleem to Musa noted as exception proving rule of mediated revelation."
));

// cand-0222: Triple witness to revelation
candidates.candidates.push(makeCand("cand-0222",
  "Triple witness to revelation: Allah His knowledge and angels jointly attest to divine origin of Quranic revelation",
  undefined, "الشهادة الثلاثية على الوحي: الله وعلمه والملائكة يشهدون على المصدر الإلهي للقرآن",
  "In 4:166: But Allah bears witness to what He sent down to you. He sent it down with His knowledge and the angels bear witness. And sufficient is Allah as Witness.",
  [{ key: "4:166", excerpt: fv(166), evidenceClass: "EXPLICIT_TEXT", rationale: "Lakini Allahu yashhadu bima anzala ilayka: divine self-testimony as primary witness. Anzalahu biAAilmihi: knowledge as second attestation linking content to divine omniscience. Waalmalaikatu yashhadoona: angelic corroboration as third witness. Wakafa biAllahi shaheedan: sufficiency clause emphasizing divine testimony alone is adequate." }],
  [],
  "Gap candidate. Unique epistemological formula providing three-tier verification of revelation. Divine self-witness (primary), knowledge-based attestation (content verification), angelic witness (cosmic corroboration). Sufficiency clause (wakafa) paradoxically renders additional witnesses unnecessary while listing them. Addresses potential skepticism about revelation source."
));

// cand-0223: Isa ontological precision
candidates.candidates.push(makeCand("cand-0223",
  "Isa ontological precision: defined as messenger of Allah His Word cast to Maryam and spirit from Him explicitly excluding divinity",
  undefined, "التحديد الأنطولوجي لعيسى: رسول الله وكلمته ألقاها إلى مريم وروح منه نافياً الألوهية صراحة",
  "In 4:171: O People of Scripture do not exceed limits in religion nor say about Allah except truth. The Messiah Isa son of Maryam was only a messenger of Allah and His Word which He cast to Maryam and a spirit from Him. So believe in Allah and His messengers. Do not say Three desist it is better for you. Allah is only one God exalted above having a son.",
  [{ key: "4:171", excerpt: fv(171), evidenceClass: "EXPLICIT_TEXT", rationale: "Innama almaseehu AAeesa ibnu maryama rasoolu Allahi: innama (only/but) restricts status to messenger. Wakalimatuhu alqaha ila maryama: Word as created entity cast/directed not co-eternal. Waroohun minhu: spirit from Him indicating origin not essence. Wala taqooloo thalathatun intahoo: explicit Trinity rejection. Innama Allahu ilahun wahidun subhanahu an yakoona lahu waladun: tawheed affirmation with sonship negation." }],
  [{ topicId: "isa-story", layer: "scholarly", relationship: "same-concept", note: "Definitive Christological correction" },
   { topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "Tawheed applied to correct Isa doctrine" }],
  "Overlap with isa-story (scholarly) and tawheed (curated) confirmed. Four-part definition: rasool (messenger), kalimatuhu (His Word), alqaha (cast - implying creation), roohun minhu (spirit from). Each term carefully chosen to affirm honored status while denying divinity. Innama (restrictive particle) appears twice framing both Isa's status and Allah's oneness. Subhanahu (exalted/glory to Him) expresses transcendence over sonship concept."
));

// cand-0224: Religious excess prohibition
candidates.candidates.push(makeCand("cand-0224",
  "Religious excess prohibition: ghuluww (exceeding proper bounds) identified as root error addressed to People of Scripture",
  undefined, "تحريم الغلو في الدين: تجاوز الحدود الشرعية كخطأ جذري موجّه لأهل الكتاب",
  "In 4:171: O People of Scripture do not exceed limits in your religion and do not say about Allah except the truth.",
  [{ key: "4:171", excerpt: fv(171), evidenceClass: "EXPLICIT_TEXT", rationale: "Ya ahla alkitabi la taghloo fee deenikum: taghloo (exceed/transgress) from gh-l-w root meaning excess/extremism. Fee deenikum specifies domain as religion not secular matters. Wala taqooloo AAala Allahi illa alhaqqa: truth constraint paired with excess prohibition suggesting ghuluww manifests as false theological claims." }],
  [],
  "Gap candidate. Ghuluww (excess) identified as fundamental error pattern applicable beyond Trinity doctrine. Addressed specifically to People of Scripture but principle extends universally. Pairing with truth-speech constraint suggests excess manifests primarily through doctrinal innovation. Intahoo khayran lakum (desist it is better) frames moderation as beneficial not merely obligatory."
));

// cand-0225: Servitude theology
candidates.candidates.push(makeCand("cand-0225",
  "Servitude theology: Isa and angels as paradigmatic servants who would never disdain worship contrasting with human arrogance",
  undefined, "لاهوت العبودية: عيسى والملائكة عباد نموذجيون لا يستنكفون عن العبادة مقابل تكبر الإنسان",
  "In 4:172-173: Never would the Messiah disdain to be a servant of Allah nor the angels near to Him. Whoever disdains His worship and is arrogant He will gather them all to Himself. As for those who believed and did righteous deeds He gives full rewards and increases from His bounty. As for those who disdained and were arrogant He punishes with painful punishment and they find no protector or helper besides Allah.",
  [{ key: "4:172", excerpt: fv(172), evidenceClass: "EXPLICIT_TEXT", rationale: "Lan yastankifa almaseehu an yakoona AAabdan lillahi: lan (never) categorical negation of disdain. AAabdan lillahi: servitude framed as honorable status. Wala almalaikatu almuqarraboona: angels included as parallel exemplars. Fayahshuruhum ilayhi jameeAAan: gathering implies accountability." },
   { key: "4:173", excerpt: fv(173), evidenceClass: "EXPLICIT_TEXT", rationale: "Faamma allatheena amanoo...fayuwaffeehim ojoorahum wayazeeduhum min fadlihi: believers receive full reward plus increase. Waamma allatheena istankafoo waistakbaroo: istinkaf (disdain) paired with istikbar (arrogance) as twin sins. Wala yajidoona lahum min dooni Allahi waliyyan wala naseeran: absolute isolation in punishment." }],
  [],
  "Gap candidate. Establishes servitude (ubudiyyah) as highest ontological status. Isa and muqarraboon angels serve as cosmic proof that proximity to Allah correlates with willingness to serve not claims of equality. Istinkaf (disdain) identified as specific sin distinct from mere disbelief. Binary outcome structure (faamma...waamma) mirrors earlier salvation formulas. Fadl (bounty) beyond earned reward signals divine generosity."
));

// cand-0226: Kalalah inheritance ruling
candidates.candidates.push(makeCand("cand-0226",
  "Kalalah inheritance ruling: sibling inheritance shares when deceased leaves neither descendants nor ascendants with gender-differentiated portions",
  undefined, "حكم ميراث الكلالة: أنصبة الإخوة عند عدم وجود أصول أو فروع مع تفاوت الأنصبة حسب الجنس",
  "In 4:176: They request ruling. Say Allah gives ruling concerning kalalah: if man dies leaving no child but has sister she gets half what he left; he inherits from her if she has no child; if two sisters they get two-thirds; if siblings male and female male gets share of two females. Allah makes clear for you lest you go astray. Allah is Knower of all things.",
  [{ key: "4:176", excerpt: fv(176), evidenceClass: "EXPLICIT_TEXT", rationale: "Yastaftoonaka quli Allahu yufteekum fee alkalalati: kalalah defined contextually as lacking walad (child/descendant). Falaha nisfu ma taraka: single sister receives half. Wahuwa yarithuha in lam yakun laha waladun: reciprocal inheritance. Fain kanata ithnatayni falahuma alththuluthani: two sisters receive two-thirds. Falilththakari mithlu haththi alonthayayni: 2:1 male-female ratio. Yubayyinu Allahu lakum an tadilloo: clarification purpose stated." }],
  [],
  "Gap candidate. Completes surah's inheritance legislation block. Kalalah etymology debated but context defines as lacking direct descendants/ascendants. Reciprocal inheritance (brother inherits from childless sister) unique to this verse. Two-thirds cap for multiple sisters prevents estate exhaustion. 2:1 ratio consistent with 4:11 but applied to collateral rather than direct heirs. Closing yubayyinu...an tadilloo frames legislation as protective guidance. Final bikulli shayin AAaleemun seals surah with divine omniscience."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-022.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-022.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 3 (ext-004-p17 through ext-004-p19)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0217 through cand-${String(216 + candidates.candidates.length).padStart(4,'0')})`);
