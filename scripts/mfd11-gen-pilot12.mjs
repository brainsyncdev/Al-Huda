// MFD-11 Pilot 12 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Baqarah 2:253-286 (Passages 37-42, Candidates cand-0117..cand-0126).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "002-0253-0286.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 2:${n} not found in corpus (id=${n})`);
  return verses[n];
}

// Full verse helper
function fv(n) { return v(n); }

console.log("Generating pilot 12 files from verbatim corpus (2:253-286)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T17:22:00.000Z";

// ─── Passage 37: 2:253–257 ────────────────────────────────────────────────────────
const p37 = {
  extractionId: "ext-002-p37",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 253, toAyah: 257, label: "Al-Baqarah — Messengers preferred over others; Isa given clear proofs and supported by Ruh al-Qudus; if Allah willed those after him would not have fought; no compulsion in religion; right path distinct from wrong; whoever rejects taghut and believes in Allah has grasped the trustworthy handhold; Allah is Hearing Knowing; Allah is wali of believers bringing them from darkness to light; disbelievers' allies are taghut bringing them from light to darkness; companions of Fire eternally" },
  verseKeys: ["2:253","2:254","2:255","2:256","2:257"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `2:${i+253}`, text: fv(i+253) })),
  mainSubject: {
    label: "Messenger hierarchy and divine preference; Isa ibn Maryam given bayyinat and confirmed by Ruh al-Qudus; divine will as sole determinant of human conflict or peace; no compulsion in religion as foundational principle; guidance clearly distinguished from misguidance; rejection of taghut combined with belief in Allah constitutes grasping the unbreakable handhold; Allah as Hearing and Knowing; divine wilayah over believers manifesting as extraction from darkness into light; taghut's counter-wilayah drawing disbelievers from light into darkness; eternal consequence of disbelief",
    keys: ["2:253","2:254","2:255","2:256","2:257"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Messenger preference: some raised in degrees above others", keys: ["2:253"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah spoke directly to some messengers", keys: ["2:253"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Isa ibn Maryam: bayyinat + Ruh al-Qudus confirmation", keys: ["2:253"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine will prevents or permits post-prophetic fighting", keys: ["2:253"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spend before Day with no trade, friendship, or intercession", keys: ["2:254"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers are the wrongdoers", keys: ["2:254"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ayat al-Kursi: Allah la ilaha illa huwa al-Hayy al-Qayyum", keys: ["2:255"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No drowsiness or sleep overtakes Allah", keys: ["2:255"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Intercession only by Allah's permission", keys: ["2:255"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kursi encompasses heavens and earth; preservation does not tire Him", keys: ["2:255"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No compulsion in religion (la ikraha fi al-din)", keys: ["2:256"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rushd distinct from ghayy", keys: ["2:256"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rejecting taghut + believing in Allah = grasping urwah wuthqa", keys: ["2:256"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah Samee'un Aleem", keys: ["2:256"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah as wali of believers: darkness to light", keys: ["2:257"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taghut as awliya of disbelievers: light to darkness", keys: ["2:257"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Companions of Fire: khalidoon", keys: ["2:257"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Religious freedom as divine ordinance: no compulsion", keys: ["2:256"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Human epistemic limitation: cannot encompass Allah's knowledge except what He wills", keys: ["2:255"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Eschatological urgency: spend before Day of no exchange or intercession", keys: ["2:254"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0117","cand-0118"],
  notes: "Pass A pilot 12, passage 37/6. Contains Ayat al-Kursi (2:255), the most renowned single verse in the Quran. Establishes no-compulsion principle (2:256), messenger hierarchy, and divine wilayah theology. Links to tawheed-rububiyyah, tawheed-fundamentals, asma-ul-husna.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P37
{
  // 2:254 - Command: spend before the Day
  p37.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:254"], excerpt: fv(254), description: "Command: spend from what We have provided before a Day comes with no trade, friendship, or intercession." });
}

// Extract divine names from P37
{
  // Al-Hayy Al-Qayyum from 2:255
  const t255 = fv(255);
  const hayyIdx = t255.indexOf("\u0671\u0644\u0652\u062d\u064e\u064a\u0651\u064f \u0671\u0644\u0652\u0642\u064e\u064a\u0651\u064f\u0648\u0645\u064f");
  if (hayyIdx >= 0) {
    p37.divineNamesAndAttributes.push({ term: t255.slice(hayyIdx, hayyIdx + 17), transliteration: "Al-Hayy Al-Qayyum", gloss: "The Ever-Living, The Sustainer (editorial gloss)", keys: ["2:255"] });
  }

  // Al-Aliyy Al-Azeem from 2:255
  const aliIdx = t255.indexOf("\u0671\u0644\u0652\u0639\u064e\u0644\u0650\u064a\u0651\u064f \u0671\u0644\u0652\u0639\u064e\u0638\u0650\u064a\u0645\u064f");
  if (aliIdx >= 0) {
    p37.divineNamesAndAttributes.push({ term: t255.slice(aliIdx, aliIdx + 17), transliteration: "Al-Aliyy Al-Azeem", gloss: "The Most High, The Most Great (editorial gloss)", keys: ["2:255"] });
  }

  // Samee'un Aleem from 2:256
  const t256 = fv(256);
  const saIdx = t256.indexOf("\u0633\u064e\u0645\u0650\u064a\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (saIdx >= 0) {
    p37.divineNamesAndAttributes.push({ term: t256.slice(saIdx, saIdx + 12), transliteration: "Samee'un Aleem", gloss: "Hearing, Knowing (editorial gloss)", keys: ["2:256"] });
  }
}

// Extract terminology from P37
{
  // Ruh al-Qudus from 2:253
  const t253 = fv(253);
  const ruhIdx = t253.indexOf("\u0631\u064f\u0648\u062d\u0650 \u0671\u0644\u0652\u0642\u064f\u062f\u064f\u0633\u0650");
  if (ruhIdx >= 0) {
    p37.terminology.push({ term: t253.slice(ruhIdx, ruhIdx + 13), transliteration: "Ruh al-Qudus", gloss: "the Pure Spirit / Holy Spirit (editorial gloss)", keys: ["2:253"] });
  }

  // Al-Taghut from 2:256
  const t256b = fv(256);
  const taghutIdx = t256b.indexOf("\u0671\u0644\u0637\u0651\u064e\u0627\u063a\u064f\u0648\u062a\u0650");
  if (taghutIdx >= 0) {
    p37.terminology.push({ term: t256b.slice(taghutIdx, taghutIdx + 9), transliteration: "al-taghuut", gloss: "false deities / tyrannical powers (editorial gloss)", keys: ["2:256"] });
  }

  // Al-Urwah Al-Wuthqa from 2:256
  const urwahIdx = t256b.indexOf("\u0671\u0644\u0652\u0639\u064f\u0631\u0652\u0648\u064e\u0629\u0650 \u0671\u0644\u0652\u0648\u064f\u062b\u0652\u0642\u064e\u0649\u0670");
  if (urwahIdx >= 0) {
    p37.terminology.push({ term: t256b.slice(urwahIdx, urwahIdx + 18), transliteration: "al-'urwah al-wuthqa", gloss: "the most trustworthy handhold (editorial gloss)", keys: ["2:256"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p37.json"), JSON.stringify(p37, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p37.json");

// ─── Passage 38: 2:258–262 ────────────────────────────────────────────────────────
const p38 = {
  extractionId: "ext-002-p38",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 258, toAyah: 262, label: "Al-Baqarah — Ibrahim's debate with king claiming life/death power; Ibrahim's sun-from-east argument silences disbeliever; parable of one who passed by ruined town — died 100 years then revived; food/drink unchanged but donkey aged; signs for people; spend in Allah's way without reproach or injury — reward with Lord; no fear/grief for them" },
  verseKeys: ["2:258","2:259","2:260","2:261","2:262"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `2:${i+258}`, text: fv(i+258) })),
  mainSubject: {
    label: "Ibrahim's rational debate with tyrant king demonstrating divine lordship through natural phenomena; death-revival miracle as sign of Allah's power over life; spending in Allah's way with manifold multiplication like grain producing seven ears each with hundred grains; charity must be free from reproach and injury to be valid; sincere spenders have reward with their Lord with no fear or grief",
    keys: ["2:258","2:259","2:260","2:261","2:262"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Ibrahim debates king who claims to give life and cause death", keys: ["2:258"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim's decisive argument: sun from east, bring it from west", keys: ["2:258"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbeliever silenced (buhita)", keys: ["2:258"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Parable of man passing by ruined town: how will Allah revive this?", keys: ["2:259"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Death for 100 years then revival", keys: ["2:259"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Food and drink unchanged; donkey aged as sign", keys: ["2:259"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim asks to see how Allah gives life to dead", keys: ["2:260"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Four birds placed on mountains then called back", keys: ["2:260"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spending in Allah's way: grain metaphor seven ears x hundred grains", keys: ["2:261"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah multiplies for whom He wills; Wasi' Aleem", keys: ["2:261"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Charity without reproach or injury: reward with Lord", keys: ["2:262"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No fear or grief for sincere spenders", keys: ["2:262"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Ibrahim's debate with Namrud-like king and four birds demonstration", keys: ["2:258","2:260"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Unnamed man dying 100 years and being revived", keys: ["2:259"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [],
  socialEconomicCivilisational: [
    { label: "Charitable spending multiplied manifold by divine grace", keys: ["2:261"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0119","cand-0120"],
  notes: "Pass A pilot 12, passage 38/6. Contains Ibrahim-Namrud debate and Uzair/Ezra revival narrative (traditional identification). Grain multiplication parable (2:261) foundational to Islamic economics of charity. Links to charity-giving, sadaqah-jariyah, prophets.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P38
{
  // 2:261 - Command: spend in Allah's way (implicit through parable)
  p38.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:261"], excerpt: fv(261), description: "Command: the example of those who spend their wealth in the way of Allah is like a seed producing seven ears." });
}

// Extract divine names from P38
{
  // Wasi' Aleem from 2:261
  const t261 = fv(261);
  const waIdx = t261.indexOf("\u0648\u064e\u0627\u0633\u0650\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (waIdx >= 0) {
    p38.divineNamesAndAttributes.push({ term: t261.slice(waIdx, waIdx + 11), transliteration: "Wasi' Aleem", gloss: "All-Encompassing, Knowing (editorial gloss)", keys: ["2:261"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p38.json"), JSON.stringify(p38, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p38.json");

// ─── Passage 39: 2:263–268 ────────────────────────────────────────────────────────
const p39 = {
  extractionId: "ext-002-p39",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 263, toAyah: 268, label: "Al-Baqarah — Kind word and forgiveness better than charity followed by injury; do not nullify charity with reproach/injury; parable of rock with dust washed away vs. garden on hillside; Allah is Rich Forbearing; Satan promises poverty and commands immorality; Allah promises forgiveness and bounty; Allah gives wisdom to whom He wills" },
  verseKeys: ["2:263","2:264","2:265","2:266","2:267","2:268"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `2:${i+263}`, text: fv(i+263) })),
  mainSubject: {
    label: "Ethics of charitable giving: kind word and forgiveness superior to charity accompanied by harm; prohibition of nullifying sadaqah through reproach or injury; parable contrasting barren rock stripped bare by rain versus fertile garden on elevated ground yielding double or single harvest; Allah Ghaniyy Hakeem; shaytan threatens poverty and orders fahsha while Allah promises maghfirah and fadl; divine wisdom granted selectively; spend from good earnings and produce of earth; do not aim for defective goods you would not accept yourselves; Allah knows what you conceal and reveal",
    keys: ["2:263","2:264","2:265","2:266","2:267","2:268"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Kind word and forgiveness better than charity with injury", keys: ["2:263"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not nullify charity with mann (reproach) or adha (injury)", keys: ["2:264"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Parable of spender seeking show-off: like smooth rock with dust washed clean", keys: ["2:264"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Parable of sincere spender: garden on hillside, heavy rain yields double", keys: ["2:265"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah sees what you do", keys: ["2:265"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Would any wish his garden destroyed by fiery whirlwind?", keys: ["2:266"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spend from tayyibat (good things) earned and produced from earth", keys: ["2:267"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not target khabith (defective) you would not accept except closing eyes", keys: ["2:267"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaytan promises faqr and commands fahsha", keys: ["2:268"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah promises maghfirah and fadl; Wasi' Aleem", keys: ["2:268"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Satanic deception: promising poverty to deter generosity", keys: ["2:268"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-deception in giving defective goods one would not accept", keys: ["2:267"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Quality standards in charitable giving: only good earnings acceptable", keys: ["2:267"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0120"],
  notes: "Pass A pilot 12, passage 39/6. Develops comprehensive ethics of sadaqah: intention, quality, manner. Rock/garden parables vivid pedagogical tools. Shaytan's economic deception (promising poverty) contrasts divine promise of forgiveness and bounty. Links to charity-giving, sadaqah-jariyah, good-character.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P39
{
  // 2:264 - Prohibition: do not nullify charity with reproach
  p39.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:264"], excerpt: fv(264), description: "Prohibition: do not render your charities vain through reproach and injury." });

  // 2:267 - Command: spend from good earnings
  p39.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:267"], excerpt: fv(267), description: "Command: spend from the good things you have earned and from what We have produced for you from the earth." });

  // 2:267 - Prohibition: do not target defective goods
  p39.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:267"], excerpt: fv(267), description: "Prohibition: do not aim at the defective thereof to spend, when you would not take it yourself except with closed eyes." });
}

// Extract divine names from P39
{
  // Ghaniyy Hakeem from 2:263
  const t263 = fv(263);
  const ghIdx = t263.indexOf("\u063a\u064e\u0646\u0650\u064a\u0651\u064c \u062d\u064e\u0644\u0650\u064a\u0645\u064c");
  if (ghIdx >= 0) {
    p39.divineNamesAndAttributes.push({ term: t263.slice(ghIdx, ghIdx + 11), transliteration: "Ghaniyy Haleem", gloss: "Rich, Forbearing (editorial gloss)", keys: ["2:263"] });
  }

  // Wasi' Aleem from 2:268
  const t268 = fv(268);
  const waIdx2 = t268.indexOf("\u0648\u064e\u0627\u0633\u0650\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (waIdx2 >= 0) {
    p39.divineNamesAndAttributes.push({ term: t268.slice(waIdx2, waIdx2 + 11), transliteration: "Wasi' Aleem", gloss: "All-Encompassing, Knowing (editorial gloss)", keys: ["2:268"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p39.json"), JSON.stringify(p39, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p39.json");

// ─── Passage 40: 2:269–276 ────────────────────────────────────────────────────────
const p40 = {
  extractionId: "ext-002-p40",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 269, toAyah: 276, label: "Al-Baqarah — Allah gives hikmah to whom He wills; only ulu al-albab remember; whatever spent or vowed Allah knows it; wrongdoers have no helpers; public vs private charity both valid; riba consumers stand like one touched by shaytan; they say trade is like riba but Allah permitted trade and forbade riba; admonition recipient who stops keeps past gains; war from Allah and Messenger for persisting; debtor in difficulty: grant respite or forgive as charity; fear Day of return to Allah" },
  verseKeys: ["2:269","2:270","2:271","2:272","2:273","2:274","2:275","2:276"],
  arabicExcerpts: Array.from({length:8}, (_,i) => ({ key: `2:${i+269}`, text: fv(i+269) })),
  mainSubject: {
    label: "Divine wisdom (hikmah) granted selectively to those of understanding; accountability for all spending and vows; public and private charity both rewarded; riba prohibition with explicit distinction from permitted trade; graduated response: admonition allows keeping past gains, persistence triggers divine-messenger war declaration; debtor relief through respite or forgiveness as superior charity; eschatological accountability reminder",
    keys: ["2:269","2:270","2:271","2:272","2:273","2:274","2:275","2:276"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Hikmah granted to whom Allah wills; ulu al-albab remember", keys: ["2:269"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "All spending and vows known to Allah; wrongdoers have no helpers", keys: ["2:270"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Public charity good; private charity better and expiates sins", keys: ["2:271"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guidance not incumbent on Prophet; Allah guides whom He wills", keys: ["2:272"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Whatever good spent benefits self; Allah knows it", keys: ["2:272"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Poor absorbed in Allah's way unable to travel; recognized by mark not begging importunately", keys: ["2:273"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those who consume riba stand like one touched by shaytan's stroke", keys: ["2:275"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trade permitted, riba forbidden: explicit divine distinction", keys: ["2:275"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Admonition recipient who stops: past gains retained", keys: ["2:275"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "War from Allah and His Messenger for persistent riba", keys: ["2:275"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Debtor in difficulty: respite until ease; forgiveness better", keys: ["2:276"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear Day of return to Allah; full recompense without injustice", keys: ["2:276"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Riba consumption as spiritual affliction comparable to demonic possession", keys: ["2:275"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dignified poverty: unable to travel, not begging importunately", keys: ["2:273"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Riba prohibition with explicit trade distinction forming Islamic finance foundation", keys: ["2:275"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Debtor protection: mandatory respite or voluntary forgiveness", keys: ["2:276"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0121","cand-0122"],
  notes: "Pass A pilot 12, passage 40/6. Core riba legislation block. Contains the strongest anti-riba language in Quran (war from Allah and Messenger). Hikmah concept (2:269) connects to wisdom tradition. Debtor relief (2:276) anticipates modern bankruptcy concepts. Links to interest-free-finance, contracts-commerce.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P40
{
  // 2:275 - Prohibition: consuming riba
  p40.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:275"], excerpt: fv(275), description: "Prohibition: those who consume riba will not stand except as one whom shaytan has driven to madness." });

  // 2:276 - Command: fear Allah regarding riba
  p40.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:276"], excerpt: fv(276), description: "Command: fear a Day when you will be returned to Allah; every soul will be fully compensated." });
}

// Extract divine names from P40
{
  // Aleem from 2:270
  const t270 = fv(270);
  const aleemIdx = t270.indexOf("\u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (aleemIdx >= 0) {
    p40.divineNamesAndAttributes.push({ term: t270.slice(aleemIdx, aleemIdx + 6), transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["2:270"] });
  }
}

// Extract terminology from P40
{
  // Ar-Riba from 2:275
  const t275 = fv(275);
  const ribaIdx = t275.indexOf("\u0671\u0644\u0631\u0651\u0650\u0628\u064e\u0627");
  if (ribaIdx >= 0) {
    p40.terminology.push({ term: t275.slice(ribaIdx, ribaIdx + 7), transliteration: "ar-riba", gloss: "usury/interest (editorial gloss)", keys: ["2:275"] });
  }

  // Al-Hikmah from 2:269
  const t269 = fv(269);
  const hikmahIdx = t269.indexOf("\u0671\u0644\u0652\u062d\u0650\u0643\u0652\u0645\u064e\u0629\u064e");
  if (hikmahIdx >= 0) {
    p40.terminology.push({ term: t269.slice(hikmahIdx, hikmahIdx + 10), transliteration: "al-hikmah", gloss: "wisdom (editorial gloss)", keys: ["2:269"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p40.json"), JSON.stringify(p40, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p40.json");

// ─── Passage 41: 2:277–282 ────────────────────────────────────────────────────────
const p41 = {
  extractionId: "ext-002-p41",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 277, toAyah: 282, label: "Al-Baqarah — Believers doing good deeds establishing prayer giving zakah: reward with Lord no fear/grief; fear Allah give up remaining riba; if not then war; if repent keep capital neither wrong nor wronged; debtor in difficulty grant respite or forgive as charity; contract writing command for fixed-term debt; scribe writes justly; witnesses two men or one man two women; do not weary of writing small or large; more just closer to testimony except spot transaction" },
  verseKeys: ["2:277","2:278","2:279","2:280","2:281","2:282"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `2:${i+277}`, text: fv(i+277) })),
  mainSubject: {
    label: "Faith-righteous deeds-prayer-zakah tetrad as basis for divine reward without fear or grief; final riba ultimatum: fear Allah, abandon outstanding riba, or face war from Allah and Messenger; repentance preserves capital without injustice; debtor relief reiterated; comprehensive debt documentation legislation: written contract for fixed-term obligations, impartial scribe, witness requirements (two men or one man and two women), no fatigue exemption for documentation regardless of amount, justice-testimony rationale with spot-transaction exception",
    keys: ["2:277","2:278","2:279","2:280","2:281","2:282"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Belief + righteous deeds + prayer + zakah = reward without fear/grief", keys: ["2:277"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear Allah and give up remaining riba if believers", keys: ["2:278"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "War declaration for non-compliance with riba abandonment", keys: ["2:279"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance: capital preserved, no wrong done or suffered", keys: ["2:279"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Debtor in difficulty: respite until ease", keys: ["2:280"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Forgiveness as sadaqah superior to respite", keys: ["2:280"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Written contract for fixed-term debt obligation", keys: ["2:282"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Scribe writes bil-adl (justly)", keys: ["2:282"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Witness requirement: two men or one man and two women", keys: ["2:282"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Documentation regardless of size: more just, closer to testimony", keys: ["2:282"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spot transaction exception from writing requirement", keys: ["2:282"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [],
  socialEconomicCivilisational: [
    { label: "Comprehensive commercial documentation law establishing contractual justice", keys: ["2:282"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gender-differentiated witness requirements in financial contracts", keys: ["2:282"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0122","cand-0123"],
  notes: "Pass A pilot 12, passage 41/6. Contains longest verse in Quran (2:282) with detailed contract law. Riba ultimatum reaches climax here. Debt documentation requirements form basis of Islamic commercial jurisprudence. Witness formula debated in modern contexts. Links to interest-free-finance, evidence-standards, contracts-commerce.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P41
{
  // 2:278 - Command: fear Allah and give up riba
  p41.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:278"], excerpt: fv(278), description: "Command: O you who believe, fear Allah and give up what remains of riba if you should be believers." });

  // 2:282 - Command: write down debt contracts
  p41.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:282"], excerpt: fv(282), description: "Command: when you contract a debt for a specified term, write it down; let a scribe write between you in justice." });
}

// Extract divine names from P41
{
  // Aleem from 2:282
  const t282 = fv(282);
  const aleemIdx2 = t282.indexOf("\u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (aleemIdx2 >= 0) {
    p41.divineNamesAndAttributes.push({ term: t282.slice(aleemIdx2, aleemIdx2 + 6), transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["2:282"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p41.json"), JSON.stringify(p41, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p41.json");

// ─── Passage 42: 2:283–286 ────────────────────────────────────────────────────────
const p42 = {
  extractionId: "ext-002-p42",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 283, toAyah: 286, label: "Al-Baqarah — If traveling and no scribe then pledge; entrusted trustee must fulfill trust; do not conceal testimony; concealer is sinful heart; Allah knows what you do; everything in heavens/earth belongs to Allah; whether disclose or conceal Allah calls to account; Messenger believes in what was revealed; believers believe in Allah angels books messengers no distinction; we hear and obey; forgiveness sought; Allah does not burden soul beyond capacity; earns good for itself evil against itself; our Lord do not impose blame if forgotten/erred; do not burden as burdened those before; do not load what we cannot bear; pardon forgive have mercy; You are mawlana so grant victory over disbelieving people" },
  verseKeys: ["2:283","2:284","2:285","2:286"],
  arabicExcerpts: Array.from({length:4}, (_,i) => ({ key: `2:${i+283}`, text: fv(i+283) })),
  mainSubject: {
    label: "Travel exception: pledge replaces written contract when scribe unavailable; amanah (trust) fulfillment obligation; testimony concealment prohibition with heart-sinfulness warning; universal divine ownership and accountability regardless of disclosure or concealment; prophetic-believer creedal affirmation: belief in Allah, angels, books, messengers without distinction; submission formula 'we hear and obey'; capacity principle reiterated (la yukallifu Allahu nafsan illa wus'aha); individual moral accounting; closing supplication: no blame for forgetfulness/error, no excessive burden, pardon-forgive-mercy triad, victory over disbelievers",
    keys: ["2:283","2:284","2:285","2:286"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Travel pledge exception when no scribe available", keys: ["2:283"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trustee must deliver trust faithfully", keys: ["2:283"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not conceal testimony; concealer has sinful heart", keys: ["2:283"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Everything in heavens and earth belongs to Allah", keys: ["2:284"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disclosure or concealment: Allah will call to account", keys: ["2:284"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger believes in revelation from Lord", keys: ["2:285"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believers affirm Allah, angels, books, messengers without distinction", keys: ["2:285"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Submission: sami'na wa ata'na (we hear and obey)", keys: ["2:285"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Capacity principle: Allah does not burden soul beyond its capacity", keys: ["2:286"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Individual earning: good for self, evil against self", keys: ["2:286"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication: no blame for nisyana (forgetfulness) or khata' (error)", keys: ["2:286"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication: do not burden as those before us", keys: ["2:286"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication: pardon, forgive, have mercy", keys: ["2:286"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mawlana (our Protector): grant victory over kafirin", keys: ["2:286"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Forgetfulness and error acknowledged as human limitations deserving divine leniency", keys: ["2:286"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Total submission expressed through hearing-obeying formula", keys: ["2:285"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Testimony integrity as social obligation with heart-accountability", keys: ["2:283"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0124","cand-0125","cand-0126"],
  notes: "Pass A pilot 12, passage 42/6. Concludes Surah Al-Baqarah with creedal summary, capacity principle, and comprehensive closing du'a. The sami'na wa ata'na formula (2:285) defines believer posture. Final du'a (2:286) among most recited supplications. Capacity principle echoes 2:233. Links to divine-mercy, repentance, accountability-responsibility, patience.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P42
{
  // 2:283 - Command: fulfill trusts
  p42.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:283"], excerpt: fv(283), description: "Command: if one of you entrusts another, let the trusted one deliver his trust and fear Allah." });

  // 2:283 - Prohibition: do not conceal testimony
  p42.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:283"], excerpt: fv(283), description: "Prohibition: do not conceal testimony; whoever conceals it has a sinful heart." });

  // 2:286 - Taught supplication
  p42.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["2:286"], excerpt: fv(286), description: "Taught supplication: Our Lord, do not impose blame upon us if we have forgotten or erred... pardon us, forgive us, have mercy upon us." });
}

// Extract divine names from P42
{
  // Mawlana from 2:286
  const t286 = fv(286);
  const mawlaIdx = t286.indexOf("\u0645\u064e\u0648\u0652\u0644\u064e\u0627\u0646\u064e\u0627");
  if (mawlaIdx >= 0) {
    p42.divineNamesAndAttributes.push({ term: t286.slice(mawlaIdx, mawlaIdx + 8), transliteration: "Mawlana", gloss: "our Protector/Patron (editorial gloss)", keys: ["2:286"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p42.json"), JSON.stringify(p42, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p42.json");

// ─── Candidates batch (cand-0117 through cand-0126) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-002-p37,ext-002-p38,ext-002-p39,ext-002-p40,ext-002-p41,ext-002-p42",
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

// cand-0117: No compulsion in religion — religious freedom as divine ordinance
candidates.candidates.push(makeCand("cand-0117",
  "No compulsion in religion: religious freedom established as divine principle",
  undefined, "\u062f\u06cc\u0646 \u0645\u06cc\u06ba \u06a9\u0648\u0626\u06cc \u062c\u0628\u0631 \u0646\u06c1\u06cc\u06ba: \u0645\u0630\u06c1\u0628\u06cc \u0622\u0632\u0627\u062f\u06cc \u0628\u0637\u0648\u0631 \u0627\u0644\u06c1\u06cc \u0627\u0635\u0648\u0644",
  "In 2:256: There shall be no compulsion in religion. The right course has become clear from the wrong. So whoever disbelieves in Taghut and believes in Allah has grasped the most trustworthy handhold with no break in it. And Allah is Hearing and Knowing.",
  [{ key: "2:256", excerpt: fv(256), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes la ikraha fi al-din as categorical principle with epistemological clarity (rushd vs ghayy) and volitional choice framework." }],
  [{ topicId: "tawheed-fundamentals", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated religious-freedom topic. La ikraha fi al-din is among most cited Quranic principles in interfaith discourse. Scholarly debate on scope (abrogation vs general principle) deferred to review."
));

// cand-0118: Ayat al-Kursi — comprehensive divine attributes declaration
candidates.candidates.push(makeCand("cand-0118",
  "Ayat al-Kursi: comprehensive declaration of divine sovereignty, knowledge, and transcendence",
  undefined, "\u0622\u06cc\u062a \u0627\u0644\u06a9\u0631\u0633\u06cc: \u0627\u0644\u06c1\u06cc \u062d\u0627\u06a9\u0645\u06cc\u062a\u060c \u0639\u0644\u0645 \u0627\u0648\u0631 \u062a\u0639\u0627\u0644\u06cc \u06a9\u0627 \u062c\u0627\u0645\u0639 \u0627\u0639\u0644\u0627\u0646",
  "In 2:255: Allah - there is no deity except Him, the Ever-Living, the Sustainer of existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth. Who is it that can intercede with Him except by His permission? He knows what is before them and what will be after them, and they encompass not a thing of His knowledge except for what He wills. His Kursi extends over the heavens and the earth, and their preservation tires Him not. And He is the Most High, the Most Great.",
  [{ key: "2:255", excerpt: fv(255), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides densest concentration of divine attributes in single ayah: tawheed, hayy/qayyum, omniscience, kursi, intercession-by-permission, transcendence." }],
  [{ topicId: "asma-ul-husna", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "tawheed-rububiyyah", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with asma-ul-husna and tawheed-rububiyyah. Distinctive as unified literary unit combining multiple attribute categories. Most memorized/recited verse in Muslim practice."
));

// cand-0119: Divine wilayah — light-darkness paradigm of belief and disbelief
candidates.candidates.push(makeCand("cand-0119",
  "Divine wilayah: Allah brings believers from darkness to light; taghut leads disbelievers from light to darkness",
  undefined, "\u0627\u0644\u06c1\u06cc \u0648\u0644\u0627\u06cc\u062a: \u0627\u0644\u0644\u06c1 \u0645\u0648\u0645\u0646\u0648\u06ba \u06a9\u0648 \u062a\u0627\u0631\u06cc\u06a9\u06cc\u0648\u06ba \u0633\u06d2 \u0646\u0648\u0631 \u06a9\u06cc \u0637\u0631\u0641 \u0644\u0627\u062a\u0627 \u06c1\u06d2",
  "In 2:257: Allah is the ally of those who believe. He brings them out from darknesses into the light. And those who disbelieve - their allies are Taghut. They take them out of the light into darknesses. Those are the companions of the Fire; they will abide eternally therein.",
  [{ key: "2:257", excerpt: fv(257), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes symmetric wilayah paradigm: divine guidance as light-extraction versus taghut misguidance as darkness-descent." }],
  [{ topicId: "tawheed-fundamentals", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated wilayah/nur-zulumat topic. Light-darkness binary foundational to Quranic epistemology and soteriology."
));

// cand-0120: Charity ethics — intention, quality, and manner of giving
candidates.candidates.push(makeCand("cand-0120",
  "Charity ethics: kind word superior to harmful giving; quality standards; sincerity vs show-off",
  undefined, "\u062e\u06cc\u0631\u0627\u062a \u06a9\u06cc \u0627\u062e\u0644\u0627\u0642\u06cc\u0627\u062a: \u0646\u0631\u0645 \u06af\u0641\u062a\u0627\u0631\u060c \u0645\u0639\u06cc\u0627\u0631\u060c \u0627\u062e\u0644\u0627\u0635",
  "In 2:263: A kind word and forgiveness are better than charity followed by injury. In 2:264: Do not render vain your charities with reproach and injury. In 2:267: Spend from the good things you have earned. In 2:268: Satan promises poverty; Allah promises forgiveness and bounty.",
  [{ key: "2:263", excerpt: fv(263), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes verbal kindness as superior to materially generous but emotionally harmful giving." },
   { key: "2:264", excerpt: fv(264), evidenceClass: "EXPLICIT_TEXT", rationale: "Prohibits nullification of sadaqah through mann and adha." },
   { key: "2:267", excerpt: fv(267), evidenceClass: "EXPLICIT_TEXT", rationale: "Quality standard: only tayyibat acceptable for charity." }],
  [{ topicId: "giving", layer: "curated", relationship: "same-concept" },
   { topicId: "sadaqah-jariyah", layer: "scholarly", relationship: "broader" }],
  "Overlap with curated 'giving' and scholarly 'sadaqah-jariyah'. This candidate captures ethical dimensions (intention, manner, quality) absent from existing topics."
));

// cand-0121: Riba prohibition — divine war declaration and trade distinction
candidates.candidates.push(makeCand("cand-0121",
  "Riba prohibition: explicit trade-riba distinction with divine war declaration for persistence",
  undefined, "\u0633\u0648\u062f \u06a9\u06cc \u0645\u0645\u0646\u0648\u0639\u062a: \u062a\u062c\u0627\u0631\u062a \u0627\u0648\u0631 \u0633\u0648\u062f \u06a9\u0627 \u0641\u0631\u0642\u060c \u0627\u0644\u06c1\u06cc \u0627\u0639\u0644\u0627\u0646 \u062c\u0646\u06af",
  "In 2:275: Those who consume riba will not stand except as one whom shaytan has driven to madness. That is because they say trade is like riba. But Allah has permitted trade and has forbidden riba. Whoever receives admonition from his Lord and desists may keep his past gains. But whoever returns to it - those are companions of the Fire. In 2:279: If you do not desist, be informed of war from Allah and His Messenger.",
  [{ key: "2:275", excerpt: fv(275), evidenceClass: "EXPLICIT_TEXT", rationale: "Core riba text: psychological affliction metaphor, explicit trade-permitted/riba-forbidden distinction, graduated enforcement." },
   { key: "2:279", excerpt: fv(279), evidenceClass: "EXPLICIT_TEXT", rationale: "Ultimate enforcement: divine-messenger war declaration for non-compliance." }],
  [{ topicId: "interest-free-finance", layer: "scholarly", relationship: "same-concept" }],
  "Overlap confirmed with interest-free-finance (one of 8 unmapped scholarly topics). This candidate captures the theological enforcement dimension beyond mere financial regulation."
));

// cand-0122: Debtor relief — respite and forgiveness as superior charity
candidates.candidates.push(makeCand("cand-0122",
  "Debtor relief: mandatory respite for hardship cases; forgiveness as superior charitable act",
  undefined, "\u0645\u0642\u0631\u0636 \u06a9\u06cc \u0631\u0639\u0627\u06cc\u062a: \u0645\u06c1\u0644\u062a\u060c \u0645\u0639\u0627\u0641\u06cc \u0628\u0637\u0648\u0631 \u0628\u06c1\u062a\u0631\u06cc\u0646 \u062e\u06cc\u0631\u0627\u062a",
  "In 2:280: And if someone is in hardship, then [let there be] postponement until [a time of] ease. But if you give [from your right as] charity, then it is better for you, if you only knew.",
  [{ key: "2:280", excerpt: fv(280), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes dual-tier debtor protection: mandatory respite + voluntary forgiveness as spiritually superior option." }],
  [{ topicId: "interest-free-finance", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated debtor-relief/bankruptcy topic. Anticipates modern insolvency concepts. Connected to interest-free-finance but distinct in focus on human compassion over financial mechanics."
));

// cand-0123: Contract documentation — written records, witnesses, and commercial justice
candidates.candidates.push(makeCand("cand-0123",
  "Contract documentation: written debt records, impartial scribes, witness requirements, and justice rationale",
  undefined, "\u0645\u0639\u0627\u06c1\u062f\u06c1 \u06a9\u06cc \u062f\u0633\u062a\u0627\u0648\u06cc\u0632\u0627\u062a: \u062a\u062d\u0631\u06cc\u0631\u060c \u06af\u0648\u0627\u06c1\u060c \u0639\u062f\u0644",
  "In 2:282: O you who have believed, when you contract a debt for a specified term, write it down. And let a scribe write [it] between you in justice... And bring to witness two witnesses from among your men. And if there are not two men [available], then a man and two women from those whom you accept as witnesses... And do not be [too] weary to write it, whether it is small or large, for its [specified] term. That is more just in the sight of Allah and stronger as evidence and closer to preventing doubt between you, except when it is an immediate transaction which you conduct among yourselves.",
  [{ key: "2:282", excerpt: fv(282), evidenceClass: "EXPLICIT_TEXT", rationale: "Longest Quranic verse provides comprehensive commercial documentation law: writing mandate, scribe impartiality, witness formula, size-independence, spot-transaction exception, justice-testimony rationale." }],
  [{ topicId: "evidence-standards", layer: "scholarly", relationship: "same-concept" }],
  "Overlap confirmed with evidence-standards (one of 8 unmapped scholarly topics). This candidate captures the full contractual framework beyond evidentiary rules alone. Gender-differentiated witness requirement subject to scholarly interpretation."
));

// cand-0124: Closing creedal affirmation — belief in Allah, angels, books, messengers without distinction
candidates.candidates.push(makeCand("cand-0124",
  "Closing creedal affirmation: unified belief in Allah, angels, revealed books, and all messengers without distinction",
  undefined, "\u0627\u062e\u062a\u062a\u0627\u0645\u06cc \u0639\u0642\u06cc\u062f\u06c1: \u0627\u0644\u0644\u06c1\u060c \u0641\u0631\u0634\u062a\u0648\u06ba\u060c \u06a9\u062a\u0627\u0628\u0648\u06ba \u0627\u0648\u0631 \u0633\u0628\u06cc \u0631\u0633\u0648\u0644\u0648\u06ba \u067e\u0631 \u0627\u06cc\u0645\u0627\u0646",
  "In 2:285: The Messenger has believed in what was revealed to him from his Lord, and [so have] the believers. All of them have believed in Allah and His angels and His books and His messengers, [saying], 'We make no distinction between any of His messengers.' And they say, 'We hear and we obey. [We seek] Your forgiveness, our Lord, and to You is the [final] destination.'",
  [{ key: "2:285", excerpt: fv(285), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides compact creedal summary: four pillars of belief, non-distinction among messengers, submission formula, forgiveness petition." }],
  [{ topicId: "tawheed-fundamentals", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "prophets", layer: "curated", relationship: "related-not-identical" }],
  "Overlap with tawheed-fundamentals and prophets. Distinctive as unified creedal formula combining all articles of faith with behavioral commitment (sami'na wa ata'na)."
));

// cand-0125: Capacity principle — divine justice in moral obligation
candidates.candidates.push(makeCand("cand-0125",
  "Capacity principle: Allah does not burden any soul beyond its capacity",
  undefined, "\u0635\u0644\u0627\u062d\u06cc\u062a \u06a9\u0627 \u0627\u0635\u0648\u0644: \u0627\u0644\u0644\u06c1 \u06a9\u0633\u06cc \u062c\u0627\u0646 \u067e\u0631 \u0627\u0633 \u06a9\u06cc \u0637\u0627\u0642\u062a \u0633\u06d2 \u0632\u06cc\u0627\u062f\u06c1 \u0628\u0648\u062c\u06be \u0646\u06c1\u06cc\u06ba \u0688\u0627\u0644\u062a\u0627",
  "In 2:286: Allah does not charge a soul except [with that within] its capacity. It will have [the consequence of] what [good] it has gained, and it will bear [the consequence of] what [evil] it has earned.",
  [{ key: "2:286", excerpt: fv(286), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes la yukallifu Allahu nafsan illa wus'aha as foundational jurisprudential principle with individual accountability corollary." }],
  [{ topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "hardship-and-ease", layer: "curated", relationship: "related-not-identical" }],
  "Echoes 2:233 capacity principle. Foundational to Islamic legal theory (fiqh maxims). Gap candidate: no dedicated capacity/wus' topic despite appearing twice in Al-Baqarah alone."
));

// cand-0126: Closing supplication — forgiveness for forgetfulness and error
candidates.candidates.push(makeCand("cand-0126",
  "Closing supplication: divine pardon sought for forgetfulness, error, and excessive burdens",
  undefined, "\u0627\u062e\u062a\u062a\u0627\u0645\u06cc \u062f\u0639\u0627: \u0628\u06be\u0648\u0644 \u0686\u0648\u06a9 \u06a9\u06cc \u0645\u0639\u0627\u0641\u06cc\u060c \u0628\u0648\u062c\u06be \u06a9\u06cc \u062e\u0641\u0641\u06cc",
  "In 2:286: Our Lord, do not impose blame upon us if we have forgotten or erred. Our Lord, and lay not upon us a burden like that which You laid upon those before us. Our Lord, and burden us not with that which we have no ability to bear. And pardon us; and forgive us; and have mercy upon us. You are our protector, so give us victory over the disbelieving people.",
  [{ key: "2:286", excerpt: fv(286), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides comprehensive closing du'a: nisyana/khata' exemption, historical burden relief, capacity reaffirmation, pardon-forgive-mercy triad, mawlana-victory petition." }],
  [{ topicId: "supplication", layer: "curated", relationship: "same-concept" },
   { topicId: "mercy-and-forgiveness", layer: "curated", relationship: "related-not-identical" },
   { topicId: "repentance", layer: "curated", relationship: "related-not-identical" }],
  "Overlap with supplication, mercy-and-forgiveness, repentance. Distinctive as Quran's own taught prayer concluding its longest surah. Among most frequently recited du'as in Muslim devotional practice."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-012.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-012.json");

console.log("\nPilot 12 generation complete.");
console.log(`Extractions: 6 (p37-p42)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0117 through cand-${String(116 + candidates.candidates.length).padStart(4,'0')})`);
