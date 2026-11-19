// MFD-11 Nisa Pass 1 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah An-Nisa 4:1-35 (Passages 1-4, Candidates cand-0177..cand-0186).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "004-0001-0035.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 4:${n} not found in corpus (id=${n})`);
  return verses[n];
}

// Full verse helper
function fv(n) { return v(n); }

console.log("Generating Nisa Pass 1 files from verbatim corpus (4:1-35)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T06:24:00.000Z";

// ─── Passage 1: 4:1–6 ────────────────────────────────────────────────────────
const p1 = {
  extractionId: "ext-004-p1",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 1, toAyah: 6, label: "An-Nisa — Created from one soul; taqwa and kinship ties; orphans' wealth protection; marriage limits and mahr; do not give weak-minded your property; test orphans before handing over property" },
  verseKeys: ["4:1","4:2","4:3","4:4","4:5","4:6"],
  arabicExcerpts: Array.from({length:6}, (_,i) => ({ key: `4:${i+1}`, text: fv(i+1) })),
  mainSubject: {
    label: "Humanity's origin from a single soul (nafsin wahidah) and its mate; command to fear Allah through whom mutual rights are asked and to respect kinship ties (arham); giving orphans their properties without substitution; marrying women with mahr given graciously; prohibition of giving property to the weak-minded; testing orphans until marriageable age before returning their wealth; witnesses required at handover",
    keys: ["4:1","4:2","4:3","4:4","4:5","4:6"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Creation from one soul and its mate", keys: ["4:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Taqwa of Allah and arham (kinship ties)", keys: ["4:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah as Raqeeb (Observer) over humanity", keys: ["4:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Giving orphans their properties", keys: ["4:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition of substituting bad for good", keys: ["4:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Consuming orphan wealth into own wealth is great sin (huban kabiran)", keys: ["4:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Marriage limits: two, three, four; or one if justice feared", keys: ["4:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Giving women their saduqat (bridal gifts) as nihlah (gracious gift)", keys: ["4:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Women may willingly remit part of mahr", keys: ["4:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not give property to weak-minded (sufaha')", keys: ["4:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Provide and clothe them, speak kindly", keys: ["4:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Test orphans until marriageable age", keys: ["4:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "If rushd perceived, hand over their wealth", keys: ["4:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not consume it extravagantly or hastily", keys: ["4:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guardian who is rich should abstain; poor may take reasonably", keys: ["4:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Witnesses required when returning orphan wealth", keys: ["4:6"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Human weakness: created from single soul, dispersed widely", keys: ["4:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Weak-mindedness (safah) requiring guardianship", keys: ["4:5"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Orphan wealth protection as foundational economic justice", keys: ["4:2","4:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mahr system establishing financial rights of women in marriage", keys: ["4:4"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Kinship ties (arham) as sacred obligation alongside taqwa", keys: ["4:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Guardian-orphan fiduciary relationship with accountability", keys: ["4:5","4:6"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0177","cand-0178"],
  notes: "Pass A Nisa passage 1/4. Opens Surah An-Nisa with universal human origin narrative (nafsin wahidah), grounding all subsequent legislation in shared humanity. Orphan wealth protection dominates vv.2,5,6 forming an inclusio around marriage/mahr (vv.3-4). Testing orphans (ibtaloo) before property transfer introduces developmental readiness concept.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P1
{
  p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:1"], excerpt: fv(1), description: "Command: fear your Lord who created you from one soul, and fear Allah through whom you ask and the kinship ties." });
  p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:2"], excerpt: fv(2), description: "Command: give orphans their properties; do not substitute defective for good; do not consume their properties into yours." });
  p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:4"], excerpt: fv(4), description: "Command: give women their bridal gifts graciously (nihlah)." });
  p1.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:5"], excerpt: fv(5), description: "Prohibition: do not give the weak-minded your property which Allah made sustenance." });
  p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:6"], excerpt: fv(6), description: "Command: test orphans until marriageable age; if sound judgement perceived, hand over their wealth; bring witnesses." });
}

// Extract divine names from P1
{
  const t1 = fv(1);
  const raqIdx = t1.indexOf("رَقِيبٗا");
  if (raqIdx >= 0) {
    p1.divineNamesAndAttributes.push({ term: t1.slice(raqIdx, raqIdx + 8), transliteration: "Raqeeb", gloss: "Ever-Watchful Observer (editorial gloss)", keys: ["4:1"] });
  }
  const t6 = fv(6);
  const hasIdx = t6.indexOf("حَسِيبٗا");
  if (hasIdx >= 0) {
    p1.divineNamesAndAttributes.push({ term: t6.slice(hasIdx, hasIdx + 8), transliteration: "Haseeb", gloss: "Sufficient Reckoner/Accountant (editorial gloss)", keys: ["4:6"] });
  }
}

// Extract terminology from P1
{
  const t1 = fv(1);
  const nafsIdx = t1.indexOf("نَّفۡسٖ وَٰحِدَةٖ");
  if (nafsIdx >= 0) {
    p1.terminology.push({ term: t1.slice(nafsIdx, nafsIdx + 14), transliteration: "nafsin wahidah", gloss: "one/single soul (editorial gloss)", keys: ["4:1"] });
  }
  const t4 = fv(4);
  const sadIdx = t4.indexOf("صَدُقَٰتِهِنَّ");
  if (sadIdx >= 0) {
    p1.terminology.push({ term: t4.slice(sadIdx, sadIdx + 12), transliteration: "saduqatihinna", gloss: "their bridal gifts/dowries (editorial gloss)", keys: ["4:4"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p1.json"), JSON.stringify(p1, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p1.json");

// ─── Passage 2: 4:7–14 ────────────────────────────────────────────────────────
const p2 = {
  extractionId: "ext-004-p2",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 7, toAyah: 14, label: "An-Nisa — Inheritance shares: men and women both have obligatory shares; provision for relatives, orphans, needy at division; fear leaving weak offspring; consuming orphan wealth unjustly is fire; detailed fractional inheritance legislation for children, parents, spouses, siblings; hudud Allah; obedience leads to Gardens; disobedience leads to Fire" },
  verseKeys: ["4:7","4:8","4:9","4:10","4:11","4:12","4:13","4:14"],
  arabicExcerpts: Array.from({length:8}, (_,i) => ({ key: `4:${i+7}`, text: fv(i+7) })),
  mainSubject: {
    label: "Inheritance legislation: both men and women have obligatory shares (naseeban mafroodan) from what parents and relatives leave; provision for relatives, orphans, and needy present at division; warning to executors to fear leaving weak offspring behind; consuming orphan wealth unjustly equals consuming fire in bellies; detailed fractional shares: male gets twice female share; daughters get two-thirds or half; parents get sixth each or mother gets third; spouses get half/quarter or quarter/eighth depending on children; kalalah inheritance for siblings; all after bequests and debts; these are hudud Allah; obedience brings gardens with rivers eternally; disobedience and transgression brings humiliating punishment in Fire",
    keys: ["4:7","4:8","4:9","4:10","4:11","4:12","4:13","4:14"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Men and women both have obligatory inheritance shares", keys: ["4:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Share applies whether estate is small or large", keys: ["4:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Provision for relatives, orphans, needy at division", keys: ["4:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Speak kindly (qawlan ma'rufan) to those present", keys: ["4:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear leaving weak offspring (dhurriyyatan di'afan)", keys: ["4:9"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Speak just words (qawlan sadeedan)", keys: ["4:9"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Consuming orphan wealth unjustly = fire in bellies", keys: ["4:10"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "They will burn in Blaze (sa'eera)", keys: ["4:10"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Male share = twice female share", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Daughters: two-thirds if multiple, half if one", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Parents: sixth each if deceased had child", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mother: third if no child, sixth if siblings exist", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "After bequest (wasiyyah) and debt (dayn)", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "You know not which benefits you more: parents or children", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fareedatan min Allah: obligation from Allah", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spousal shares: half/quarter for husbands, quarter/eighth for wives", keys: ["4:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kalalah: sibling shares (sixth each or third shared)", keys: ["4:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Non-harmful bequest (ghayra mudarr)", keys: ["4:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hudud Allah: these are Allah's limits", keys: ["4:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Obedience to Allah and Messenger = Gardens eternal", keys: ["4:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Great attainment (fawz atheem)", keys: ["4:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disobedience and transgression = Fire with humiliating punishment", keys: ["4:14"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Fear for weak offspring as motivator for executor justice", keys: ["4:9"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ignorance of which relative benefits more", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Comprehensive fractional inheritance system replacing pre-Islamic customs", keys: ["4:11","4:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bequest and debt prioritized before distribution", keys: ["4:11","4:12"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Parent-child inheritance obligations", keys: ["4:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spousal inheritance rights", keys: ["4:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sibling inheritance under kalalah", keys: ["4:12"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0179","cand-0180"],
  notes: "Pass A Nisa passage 2/4. Contains the most detailed fractional inheritance legislation in the Quran (4:11-12). Establishes women's inheritance rights explicitly (4:7). Frames inheritance as hudud Allah (4:13) with eschatological consequences for compliance/violation (4:13-14). Kalalah clause (4:12) addresses collateral inheritance. Wasiyyah and dayn consistently prioritized before distribution.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P2
{
  p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:8"], excerpt: fv(8), description: "Command: provide for relatives, orphans, and needy present at division; speak to them kindly." });
  p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:9"], excerpt: fv(9), description: "Command: let executors fear Allah as if they left weak offspring; speak just words." });
  p2.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:10"], excerpt: fv(10), description: "Prohibition/warning: those who consume orphan wealth unjustly consume fire in their bellies." });
}

// Extract divine names from P2
{
  const t11 = fv(11);
  const oaIdx = t11.indexOf("عَلِيمًا حَكِيمٗا");
  if (oaIdx >= 0) {
    p2.divineNamesAndAttributes.push({ term: t11.slice(oaIdx, oaIdx + 15), transliteration: "Aleeman Hakeema", gloss: "Knowing, Wise (editorial gloss)", keys: ["4:11"] });
  }
  const t12 = fv(12);
  const ohIdx = t12.indexOf("عَلِيمٌ حَلِيمٞ");
  if (ohIdx >= 0) {
    p2.divineNamesAndAttributes.push({ term: t12.slice(ohIdx, ohIdx + 13), transliteration: "Aleemun Haleem", gloss: "Knowing, Forbearing (editorial gloss)", keys: ["4:12"] });
  }
}

// Extract terminology from P2
{
  const t7 = fv(7);
  const nasIdx = t7.indexOf("نَصِيبٗا مَّفۡرُوضٗا");
  if (nasIdx >= 0) {
    p2.terminology.push({ term: t7.slice(nasIdx, nasIdx + 16), transliteration: "naseeban mafroodan", gloss: "obligatory share (editorial gloss)", keys: ["4:7"] });
  }
  const t12 = fv(12);
  const kalIdx = t12.indexOf("كَلَٰلَةً");
  if (kalIdx >= 0) {
    p2.terminology.push({ term: t12.slice(kalIdx, kalIdx + 8), transliteration: "kalalah", gloss: "one leaving neither ascendants nor descendants (editorial gloss)", keys: ["4:12"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p2.json"), JSON.stringify(p2, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p2.json");

// ─── Passage 3: 4:15–25 ────────────────────────────────────────────────────────
const p3 = {
  extractionId: "ext-004-p3",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 15, toAyah: 25, label: "An-Nisa — Fahishah procedures: four witnesses, confinement; dishonor then pardon upon repentance; repentance accepted for ignorance then reform, rejected at death or in disbelief; do not inherit women by compulsion; live with them kindly; do not take back mahr when replacing wife; solemn covenant; forbidden marriage categories detailed; muhsanat protection; marry believing slave women if unable to afford free women; patience better" },
  verseKeys: ["4:15","4:16","4:17","4:18","4:19","4:20","4:21","4:22","4:23","4:24","4:25"],
  arabicExcerpts: Array.from({length:11}, (_,i) => ({ key: `4:${i+15}`, text: fv(i+15) })),
  mainSubject: {
    label: "Fahishah (indecency) procedures: four witnesses required against women, confinement to houses until death or divine way; mutual perpetrators dishonored but pardoned upon repentance and reform; repentance theology: accepted only for those who sin in ignorance then repent promptly, rejected for deathbed repentance or dying in disbelief; women's rights in marriage: prohibition of inheriting women by compulsion or obstructing them to reclaim mahr unless clear fahishah; command to live with wives in kindness (bil-ma'ruf); dislike may conceal divine good; prohibition of taking back mahr when replacing wife even if qintar given; solemn covenant (mithaqan ghaleethan) invoked; comprehensive forbidden marriage categories: mothers, daughters, sisters, aunts, nieces, milk-mothers, milk-sisters, mothers-in-law, step-daughters, daughters-in-law, two sisters simultaneously; muhsanat (married women) prohibited except right-hand possessions; seeking with wealth in chastity not fornication; paying ujur (compensation) as obligation; mutual agreement beyond obligation permitted; permission to marry believing slave women if unable to afford free believing women, with equal ujur and chastity requirements; half punishment for slave women committing fahishah after marriage; patience preferred over concession; Allah Ghafur Raheem",
    keys: ["4:15","4:16","4:17","4:18","4:19","4:20","4:21","4:22","4:23","4:24","4:25"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Four witnesses required for fahishah accusation against women", keys: ["4:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Confinement to houses until death or divine alternative", keys: ["4:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual perpetrators: dishonor then pardon upon tawbah/islah", keys: ["4:16"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawwab Raheem: Allah accepting repentance", keys: ["4:16"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance accepted: sin in ignorance, repent promptly", keys: ["4:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance rejected: deathbed or dying in kufr", keys: ["4:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Painful punishment prepared for unrepentant disbelievers", keys: ["4:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: inheriting women by compulsion (karhan)", keys: ["4:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: obstructing wives to reclaim mahr", keys: ["4:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Live with them bil-ma'ruf (in kindness)", keys: ["4:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dislike may conceal much good from Allah", keys: ["4:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Replacing wife: cannot reclaim anything even qintar", keys: ["4:20"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Buhtan and ithm mubeen: slander and manifest sin", keys: ["4:20"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mithaqan ghaleethan: solemn covenant of marriage", keys: ["4:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Forbidden: fathers' wives (except past)", keys: ["4:22"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Detailed maharim list: blood, milk, marriage relations", keys: ["4:23"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Muhsanat prohibited except right-hand possessions", keys: ["4:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Seeking with wealth: muhsineen not musafiheen", keys: ["4:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ujur as fareedah; mutual agreement beyond permitted", keys: ["4:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Permission to marry believing slave women if unable for free", keys: ["4:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Half punishment for married slave women committing fahishah", keys: ["4:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Patience (tasbiru) better than concession", keys: ["4:25"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Ignorance (jahalatin) as condition for accepted repentance", keys: ["4:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deathbed regret without prior reform as rejected repentance", keys: ["4:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Human weakness (da'eef) acknowledged in concessions", keys: ["4:25"], evidenceClass: "CONTEXTUAL" }
  ],
  socialEconomicCivilisational: [
    { label: "Mahr as protected financial right of women in marriage", keys: ["4:20","4:24","4:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Marriage categories establishing social boundaries and protections", keys: ["4:22","4:23"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Marital covenant (mithaq ghaleeth) as sacred bond", keys: ["4:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Maharim: permanently prohibited marriage relations", keys: ["4:23"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0181","cand-0182","cand-0183"],
  notes: "Pass A Nisa passage 3/4. Densest legal passage covering fahishah procedure, repentance theology, women's marital rights, comprehensive maharim list, muhsanat rules, and slave-marriage concession. Mithaq ghaleethan (4:21) elevates marriage to covenant status. Repentance conditions (4:17-18) define theological boundaries. Verse 4:19 prohibits inheriting women and commands kind cohabitation. Maharim list (4:23) is most comprehensive in Quran.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P3
{
  p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:16"], excerpt: fv(16), description: "Command: if both repent and reform, turn away from them (leave them alone); Allah is Tawwab Raheem." });
  p3.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:19"], excerpt: fv(19), description: "Prohibition: it is not lawful to inherit women by compulsion or obstruct them to reclaim what you gave them." });
  p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:19"], excerpt: fv(19), description: "Command: live with them in kindness (bil-ma'ruf)." });
  p3.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:22"], excerpt: fv(22), description: "Prohibition: do not marry women whom your fathers married, except what has already passed." });
}

// Extract divine names from P3
{
  const t16 = fv(16);
  const trIdx = t16.indexOf("تَوَّابٗا رَّحِيمًا");
  if (trIdx >= 0) {
    p3.divineNamesAndAttributes.push({ term: t16.slice(trIdx, trIdx + 17), transliteration: "Tawwaban Raheema", gloss: "Accepting of repentance, Merciful (editorial gloss)", keys: ["4:16"] });
  }
  const t23 = fv(23);
  const grIdx = t23.indexOf("غَفُورٗا رَّحِيمٗا");
  if (grIdx >= 0) {
    p3.divineNamesAndAttributes.push({ term: t23.slice(grIdx, grIdx + 16), transliteration: "Ghafooran Raheema", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["4:23"] });
  }
  const t25 = fv(25);
  const gr2Idx = t25.indexOf("غَفُورٞ رَّحِيمٞ");
  if (gr2Idx >= 0) {
    p3.divineNamesAndAttributes.push({ term: t25.slice(gr2Idx, gr2Idx + 14), transliteration: "Ghafoorun Raheem", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["4:25"] });
  }
}

// Extract terminology from P3
{
  const t21 = fv(21);
  const mithIdx = t21.indexOf("مِّيثَٰقًا غَلِيظٗا");
  if (mithIdx >= 0) {
    p3.terminology.push({ term: t21.slice(mithIdx, mithIdx + 17), transliteration: "mithaqan ghaleethan", gloss: "solemn covenant (editorial gloss)", keys: ["4:21"] });
  }
  const t15 = fv(15);
  const fahIdx = t15.indexOf("ٱلۡفَٰحِشَةَ");
  if (fahIdx >= 0) {
    p3.terminology.push({ term: t15.slice(fahIdx, fahIdx + 11), transliteration: "al-fahishah", gloss: "indecency/unlawful sexual intercourse (editorial gloss)", keys: ["4:15"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p3.json"), JSON.stringify(p3, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p3.json");

// ─── Passage 4: 4:26–35 ────────────────────────────────────────────────────────
const p4 = {
  extractionId: "ext-004-p4",
  workstream: "MFD-11",
  pass: "A",
  surah: 4,
  surahName: "An-Nisa",
  passage: { fromAyah: 26, toAyah: 35, label: "An-Nisa — Allah intends to make clear and guide to sunan of predecessors; accept repentance; Allah wants to lighten burdens; mankind created weak; do not consume wealth unjustly except trade by mutual consent; do not kill selves; avoid major sins so minor ones expiated; do not wish for what Allah favored some over others; men and women both earn shares; ask Allah of His bounty; mawali for inheritance; qawwamun role of men; righteous women; nushuz procedure: advise, forsake in bed, strike; arbitration between spouses if shiqaq feared" },
  verseKeys: ["4:26","4:27","4:28","4:29","4:30","4:31","4:32","4:33","4:34","4:35"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `4:${i+26}`, text: fv(i+26) })),
  mainSubject: {
    label: "Divine intent: clarification, guidance to predecessors' ways, acceptance of repentance; contrast with those following desires who want great deviation; Allah wants to lighten burdens because mankind was created weak (da'eef); prohibition of consuming wealth unjustly (bil-batil) except through trade by mutual consent (tijaratan an taradin); prohibition of killing selves; avoiding major sins (kaba'ir) leads to expiation of minor sins (sayyi'at) and noble entry; prohibition of envying what Allah favored some over others; both men and women earn shares from their deeds; ask Allah of His bounty; mawali appointed for inheritance including oath-bound allies; men as qawwamun over women due to divine preference and spending; righteous women are qanitat guarding unseen; nushuz (arrogance/disobedience) procedure: admonish, forsake in beds, strike; if they obey seek no further means; arbitration (hakam) from both families if shiqaq (breach) feared; Allah reconciles if both desire islah",
    keys: ["4:26","4:27","4:28","4:29","4:30","4:31","4:32","4:33","4:34","4:35"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Allah wants to clarify and guide to sunan of predecessors", keys: ["4:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah wants to accept repentance", keys: ["4:26","4:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those following desires want great deviation", keys: ["4:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah wants to lighten burdens; man created weak", keys: ["4:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: consume wealth bil-batil", keys: ["4:29"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exception: tijarah an taradin (trade by mutual consent)", keys: ["4:29"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: do not kill yourselves", keys: ["4:29"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Aggression and injustice punished by Fire", keys: ["4:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Avoiding kaba'ir expiates sayyi'at", keys: ["4:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Noble entry (mudkhalan kareeman)", keys: ["4:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not wish for what Allah favored some over others", keys: ["4:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Men and women both earn shares from their deeds", keys: ["4:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ask Allah of His bounty (fadl)", keys: ["4:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mawali appointed for inheritance including oath-allies", keys: ["4:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Men as qawwamun over women", keys: ["4:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Righteous women: qanitat, hafithat lil-ghayb", keys: ["4:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nushuz procedure: fa'ithuhunna, uhjuroohunna, idriboohunna", keys: ["4:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "If they obey, seek no way against them", keys: ["4:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Arbitration: hakam from his family and hers", keys: ["4:35"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "If both desire islah, Allah reconciles", keys: ["4:35"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Human weakness (da'eef) as basis for divine leniency", keys: ["4:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Envy/covetousness toward others' divine favor", keys: ["4:32"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Trade by mutual consent as only legitimate wealth transfer", keys: ["4:29"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Major/minor sin distinction (kaba'ir/sayyi'at) in moral economy", keys: ["4:31"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Qawwamah: men's responsibility over women based on divine preference and spending", keys: ["4:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Marital dispute resolution through family arbitration", keys: ["4:35"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0184","cand-0185","cand-0186"],
  notes: "Pass A Nisa passage 4/4. Transitions from specific legal rulings to broader ethical-economic principles. Tijarah an taradin (4:29) establishes mutual consent as foundation of commerce. Kaba'ir/sayyi'at distinction (4:31) provides major Quranic framework for sin categorization. Qawwamun verse (4:34) defines spousal roles. Arbitration mechanism (4:35) provides communal conflict resolution. Closes first major legislative block of An-Nisa.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands from P4
{
  p4.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:29"], excerpt: fv(29), description: "Prohibition: do not consume one another's wealth unjustly; do not kill yourselves." });
  p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:31"], excerpt: fv(31), description: "Command: if you avoid major sins, minor sins will be expiated and noble entry granted." });
  p4.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["4:32"], excerpt: fv(32), description: "Prohibition: do not wish for that by which Allah has made some exceed others." });
  p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:32"], excerpt: fv(32), description: "Command: ask Allah of His bounty." });
  p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["4:35"], excerpt: fv(35), description: "Command: if you fear breach between them, send an arbitrator from his family and one from hers." });
}

// Extract divine names from P4
{
  const t26 = fv(26);
  const ohIdx = t26.indexOf("عَلِيمٌ حَكِيمٞ");
  if (ohIdx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t26.slice(ohIdx, ohIdx + 13), transliteration: "Aleemun Hakeem", gloss: "Knowing, Wise (editorial gloss)", keys: ["4:26"] });
  }
  const t34 = fv(34);
  const akIdx = t34.indexOf("عَلِيّٗا كَبِيرٗا");
  if (akIdx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t34.slice(akIdx, akIdx + 15), transliteration: "Aliyyan Kabeeran", gloss: "Exalted, Grand (editorial gloss)", keys: ["4:34"] });
  }
  const t35 = fv(35);
  const okhIdx = t35.indexOf("عَلِيمًا خَبِيرٗا");
  if (okhIdx >= 0) {
    p4.divineNamesAndAttributes.push({ term: t35.slice(okhIdx, okhIdx + 15), transliteration: "Aleeman Khabeeran", gloss: "Knowing, Acquainted (editorial gloss)", keys: ["4:35"] });
  }
}

// Extract terminology from P4
{
  const t29 = fv(29);
  const tijIdx = t29.indexOf("تِجَٰرَةً عَن تَرَاضٖ");
  if (tijIdx >= 0) {
    p4.terminology.push({ term: t29.slice(tijIdx, tijIdx + 18), transliteration: "tijaratan an taradin", gloss: "trade by mutual consent (editorial gloss)", keys: ["4:29"] });
  }
  const t31 = fv(31);
  const kabIdx = t31.indexOf("كَبَآئِرَ");
  if (kabIdx >= 0) {
    p4.terminology.push({ term: t31.slice(kabIdx, kabIdx + 8), transliteration: "kaba'ir", gloss: "major sins (editorial gloss)", keys: ["4:31"] });
  }
  const t34 = fv(34);
  const qawIdx = t34.indexOf("قَوَّـٰمُونَ");
  if (qawIdx >= 0) {
    p4.terminology.push({ term: t34.slice(qawIdx, qawIdx + 10), transliteration: "qawwamun", gloss: "maintainers/protectors/in charge (editorial gloss)", keys: ["4:34"] });
  }
  const nushIdx = t34.indexOf("نُشُوزَهُنَّ");
  if (nushIdx >= 0) {
    p4.terminology.push({ term: t34.slice(nushIdx, nushIdx + 11), transliteration: "nushoozahunna", gloss: "their arrogance/disobedience/rebellion (editorial gloss)", keys: ["4:34"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "004-an-nisa-p4.json"), JSON.stringify(p4, null, 2) + "\n");
console.log("Wrote 004-an-nisa-p4.json");

// ─── Candidates batch (cand-0177 through cand-0186) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-004-p1,ext-004-p2,ext-004-p3,ext-004-p4",
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

// cand-0177: Single origin of humanity
candidates.candidates.push(makeCand("cand-0177",
  "Single origin of humanity: creation from one soul and its mate as basis for taqwa and kinship obligations",
  undefined, "انسان کی واحد اصل: ایک نفس سے تخلیق",
  "In 4:1: O mankind, fear your Lord who created you from one soul and created from it its mate and dispersed from both of them many men and women. And fear Allah through whom you ask one another and the wombs.",
  [{ key: "4:1", excerpt: fv(1), evidenceClass: "EXPLICIT_TEXT", rationale: "Khalaqakum min nafsin wahidatin wa khalaqa minha zawjaha: establishes shared human origin as theological basis for mutual obligations. Paired with taqwa of Allah and arham." }],
  [],
  "Gap candidate: no dedicated human-origin or nafsin-wahidah topic. Foundational anthropological verse opening Surah An-Nisa. Links creation narrative directly to ethical obligations (taqwa + arham). Distinctive pairing of divine consciousness with kinship consciousness."
));

// cand-0178: Orphan wealth guardianship and developmental readiness
candidates.candidates.push(makeCand("cand-0178",
  "Orphan wealth guardianship: prohibition of consumption, requirement of testing maturity, and witnessed handover",
  undefined, "یتیموں کے مال کی حفاظت: آزمائش اور حوالگی",
  "In 4:2,5-6: Give orphans their properties, do not substitute bad for good, do not consume their properties into yours. Do not give weak-minded your property. Test orphans until marriageable age; if sound judgement perceived, hand over their wealth with witnesses.",
  [{ key: "4:2", excerpt: fv(2), evidenceClass: "EXPLICIT_TEXT", rationale: "Explicit triple command: give, don't substitute, don't consume. Huban kabiran frames violation as grave sin." },
   { key: "4:6", excerpt: fv(6), evidenceClass: "EXPLICIT_TEXT", rationale: "Ibtaloo al-yatama: testing for rushd before property transfer. Ashhidoo: witness requirement for accountability." }],
  [{ topicId: "orphan-care", layer: "scholarly", relationship: "same-concept" }],
  "Overlap with orphan-care confirmed. Most detailed Quranic treatment of orphan property management. Introduces developmental readiness concept (rushd at nikah age). Distinguishes wealthy vs poor guardian compensation. Witness requirement anticipates modern fiduciary accountability."
));

// cand-0179: Detailed fractional inheritance legislation
candidates.candidates.push(makeCand("cand-0179",
  "Fractional inheritance legislation: precise shares for children, parents, spouses, and siblings as hudud Allah",
  undefined, "وراثت کے حصص: تفصیلی قانون",
  "In 4:11-12: Allah instructs you concerning your children: for the male what is equal to share of two females... These are hudud Allah. Detailed fractions: half, quarter, eighth, two-thirds, third, sixth for various heirs after bequests and debts.",
  [{ key: "4:11", excerpt: fv(11), evidenceClass: "EXPLICIT_TEXT", rationale: "Yooseekumu Allahu fee awladikum: direct divine instruction with precise fractions. Fareedatan min Allah frames as divine obligation not cultural custom." },
   { key: "4:12", excerpt: fv(12), evidenceClass: "EXPLICIT_TEXT", rationale: "Spousal and kalalah shares. Wasiyyatan min Allah confirms divine ordinance status." }],
  [],
  "Gap candidate: no dedicated inheritance-laws or fara'id topic despite being most detailed legal passage in Quran. Establishes women's inheritance rights explicitly (4:7). Consistent wasiyyah-dayn priority. Hudud framing (4:13) elevates to boundary-of-Allah status with eschatological consequences."
));

// cand-0180: Women's obligatory inheritance share
candidates.candidates.push(makeCand("cand-0180",
  "Women's inheritance right: explicit guarantee of obligatory share for women alongside men regardless of estate size",
  undefined, "عورتوں کا وراثت میں حق: فرض شدہ حصہ",
  "In 4:7: For men is a share of what parents and close relatives leave, and for women is a share of what parents and close relatives leave, be it little or much - an obligatory share (naseeban mafroodan).",
  [{ key: "4:7", excerpt: fv(7), evidenceClass: "EXPLICIT_TEXT", rationale: "Walilnnisai naseebun: parallel construction with men's share. Mimma qalla minhu aw kathura removes minimum threshold. Naseeban mafroodan makes it divinely mandated." }],
  [],
  "Gap candidate: revolutionary legal declaration in Arabian context where women were inherited as property (addressed in 4:19). Mafroodan indicates non-negotiable divine mandate. Precedes detailed fractions (4:11-12) as principle statement."
));

// cand-0181: Repentance conditions — prompt reform vs deathbed rejection
candidates.candidates.push(makeCand("cand-0181",
  "Repentance conditions: accepted for ignorant sin followed by prompt reform, rejected for deathbed or persistent disbelief",
  undefined, "توبہ کی شرائط: جہالت میں فوری توبہ قبول، موت کے وقت رد",
  "In 4:17-18: The repentance accepted by Allah is only for those who do wrong in ignorance then repent soon after. But repentance is not accepted of those who do evil until death comes and one says 'I repent now,' nor of those who die as disbelievers.",
  [{ key: "4:17", excerpt: fv(17), evidenceClass: "EXPLICIT_TEXT", rationale: "Bijahalatin thumma yatooboona min qareebin: two conditions - ignorance and promptness. Yatoobu Allahu alayhim confirms acceptance." },
   { key: "4:18", excerpt: fv(18), evidenceClass: "EXPLICIT_TEXT", rationale: "Negative cases: deathbed claim (tubtu al-aana) and dying in kufr. Both rejected. Painful punishment prepared." }],
  [{ topicId: "repentance", layer: "curated", relationship: "same-concept" }],
  "Overlap with repentance (curated) confirmed. Defines precise theological boundaries of tawbah acceptance. Jahalah doesn't mean stupidity but lack of full deliberation. Min qareeb requires temporal proximity. Contrasts with 3:135 pattern by adding explicit rejection criteria."
));

// cand-0182: Solemn marriage covenant (mithaq ghaleeth)
candidates.candidates.push(makeCand("cand-0182",
  "Solemn marriage covenant: mithaq ghaleeth as inviolable bond prohibiting reclamation of mahr upon divorce",
  undefined, "مضبوط عہد: نکاح کا میثاق غلیظ",
  "In 4:21: And how could you take it while you have gone in unto each other and they have taken from you a solemn covenant (mithaqan ghaleethan)?",
  [{ key: "4:21", excerpt: fv(21), evidenceClass: "EXPLICIT_TEXT", rationale: "Mithaqan ghaleethan: unique Quranic phrase elevating marriage to covenant status. Context: prohibition of reclaiming mahr after intimacy. Afda ba'dukum ila ba'd emphasizes physical union reinforcing covenant." }],
  [],
  "Gap candidate: no dedicated marriage-covenant or mithaq-ghaleeth topic. Only occurrence of this exact phrase in Quran. Used rhetorically to prohibit financial reclamation. Connects physical intimacy (afda) with contractual sanctity (mithaq)."
));

// cand-0183: Comprehensive maharim — permanently prohibited marriage categories
candidates.candidates.push(makeCand("cand-0183",
  "Maharim categories: comprehensive list of permanently prohibited marriage relations by blood, nursing, and marriage",
  undefined, "محرمات: نکاح کی مستقل ممنوعہ رشتے داریاں",
  "In 4:23: Prohibited to you are your mothers, daughters, sisters, paternal aunts, maternal aunts, brother's daughters, sister's daughters, milk-mothers, milk-sisters, wives' mothers, step-daughters under guardianship, sons' wives, and two sisters simultaneously.",
  [{ key: "4:23", excerpt: fv(23), evidenceClass: "EXPLICIT_TEXT", rationale: "Hurrimat alaykum: exhaustive enumeration of seven blood relations, two milk relations, three marriage relations, and one combination prohibition. Illa ma qad salafa provides grandfather clause." }],
  [],
  "Gap candidate: no dedicated maharim or prohibited-marriage-categories topic. Most comprehensive single-verse listing in Quran. Three categories: nasabi (blood), rada'i (milk), sihr (marriage). Raba'ib exception (if not consummated) shows precision. Combining two sisters uniquely prohibited."
));

// cand-0184: Trade by mutual consent as sole legitimate wealth exchange
candidates.candidates.push(makeCand("cand-0184",
  "Trade by mutual consent: tijarah an taradin as the only permissible basis for wealth exchange among believers",
  undefined, "باہمی رضامندی سے تجارت: مال کے تبادلے کا واحد جائز طریقہ",
  "In 4:29: O you who have believed, do not consume one another's wealth unjustly but only in lawful business by mutual consent from you. And do not kill yourselves.",
  [{ key: "4:29", excerpt: fv(29), evidenceClass: "EXPLICIT_TEXT", rationale: "Illa an takoona tijaratan an taradin minkum: exception clause defining sole legitimate transfer mechanism. La takuloo amwalakum bil-batil: broad prohibition of unjust consumption." }],
  [{ topicId: "justice", layer: "curated", relationship: "related-not-identical" }],
  "Overlap with justice (curated) via economic justice dimension. Foundational Islamic economics verse. Taradin (mutual consent) becomes basis for contract law. Pairing with la taqtuloo anfusakum links economic exploitation to self-destruction. Bikum raheeman frames as mercy not mere restriction."
));

// cand-0185: Major-minor sin distinction and expiation through avoidance
candidates.candidates.push(makeCand("cand-0185",
  "Kaba'ir and sayyi'at: avoiding major sins causes expiation of minor sins and grants noble entry",
  undefined, "کبیرہ گناہوں سے اجتناب: صغیرہ گناہوں کی معافی",
  "In 4:31: If you avoid the major sins which you are forbidden, We will remove from you your lesser sins and admit you to a noble entrance.",
  [{ key: "4:31", excerpt: fv(31), evidenceClass: "EXPLICIT_TEXT", rationale: "In tajtaniboo kaba'ira ma tunhawna anhu: conditional structure. Nukaffir sayyi'atikum: divine expiation of minors. Mudkhalan kareeman: noble entry as reward." }],
  [],
  "Gap candidate: no dedicated kaba'ir or major-sins topic despite being primary Quranic locus for this distinction. Establishes theological principle: avoiding majors automatically expiates minors. Tajtaniboo implies active avoidance not mere non-commission. Mudkhal kareem contrasts with Fire warnings elsewhere."
));

// cand-0186: Marital arbitration mechanism for dispute resolution
candidates.candidates.push(makeCand("cand-0186",
  "Marital arbitration: sending hakam from each family to resolve spousal discord (shiqaq) with divine facilitation of reconciliation",
  undefined, "مییاں بیوی میں ثالثی: خاندانی حکم مقرر کرنا",
  "In 4:35: And if you fear dissension between the two, send an arbitrator from his people and an arbitrator from her people. If they both desire reconciliation, Allah will cause it between them.",
  [{ key: "4:35", excerpt: fv(35), evidenceClass: "EXPLICIT_TEXT", rationale: "Ib'athoo hakaman min ahlihi wa hakaman min ahliha: dual-arbitrator mechanism ensuring balanced representation. In yureeda islahan yuwaffiqi Allahu: divine facilitation conditional on genuine reform intent." }],
  [],
  "Gap candidate: no dedicated marital-arbitration or shiqaq-resolution topic. Unique communal mechanism for private disputes. Dual-family representation ensures fairness. Yuwaffiqi implies divine agency in reconciliation beyond human effort. Aleeman Khabeeran closes with divine knowledge of inner states."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-018.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-018.json");

console.log("\nGeneration complete.");
console.log(`Extractions: 4 (ext-004-p1 through ext-004-p4)`);
console.log(`Candidates: ${candidates.candidates.length} (cand-0177 through cand-${String(176 + candidates.candidates.length).padStart(4,'0')})`);
