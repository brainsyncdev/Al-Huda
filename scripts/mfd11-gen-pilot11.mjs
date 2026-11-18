// MFD-11 Pilot 11 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Baqarah 2:215-252 (Passages 33-36, Candidates cand-0107..cand-0116).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "002-0215-0252.json");
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

console.log("Generating pilot 11 files from verbatim corpus (2:215-252)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T17:12:00.000Z";

// ─── Passage 33: 2:215–221 ────────────────────────────────────────────────────────
const p33 = {
  extractionId: "ext-002-p33",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 215, toAyah: 221, label: "Al-Baqarah — Spending priorities: parents, relatives, orphans, needy, travelers; whatever good you spend Allah knows it; fighting prescribed though hateful; perhaps you hate a thing that is good for you; sacred month fighting great but averting from Allah's way greater; fitnah greater than killing; they fight you until they turn you from religion; whoever reverts and dies disbeliever deeds worthless; believers who emigrated and fought hope for Allah's mercy; intoxicants and gambling great sin with some benefit but sin greater; what to spend: surplus; orphan welfare best; mixing affairs with them they are brothers; Allah knows corrupter from amender; marriage restrictions: do not marry mushrikat until they believe; believing slave woman better than free mushrikah; do not marry mushrikin until they believe; believing slave better; those invite to Fire, Allah invites to Paradise and forgiveness" },
  verseKeys: ["2:215","2:216","2:217","2:218","2:219","2:220","2:221"],
  arabicExcerpts: Array.from({length:7}, (_,i) => ({ key: `2:${i+215}`, text: fv(i+215) })),
  mainSubject: {
    label: "Spending priorities established: parents, relatives, orphans, needy, travelers; divine knowledge of all good spent; fighting prescribed despite being hateful; divine wisdom: hating what is good, loving what is harmful; sacred month combat severity weighed against greater evils of religious persecution and expulsion; fitnah declared greater than killing; persistent enemy intent to revert believers; apostasy consequence: deeds voided in both worlds; faith-emigration-jihad triad as basis for hoping divine mercy; intoxicants and gambling: sin exceeds benefit; spending surplus defined; orphan welfare reform; interfaith marriage prohibition with faith-based preference over social status",
    keys: ["2:215","2:216","2:217","2:218","2:219","2:220","2:221"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Spending recipients: parents, relatives, orphans, needy, traveler", keys: ["2:215"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine knowledge of all good expenditure", keys: ["2:215"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fighting prescribed despite being disliked", keys: ["2:216"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Epistemic humility: perhaps you hate what is good for you", keys: ["2:216"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sacred month fighting: great sin but prevention from Allah's way is greater", keys: ["2:217"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fitnah akbaru min al-qatl (persecution worse than killing)", keys: ["2:217"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enemy persistence: fight until reverting you from religion", keys: ["2:217"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Apostasy death: deeds voided in dunya and akhirah", keys: ["2:217"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Faith + hijrah + jihad = hope for Allah's mercy", keys: ["2:218"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Intoxicants and gambling: great sin, some benefit, sin greater", keys: ["2:219"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spending surplus (al-'afw)", keys: ["2:219"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Orphan welfare: islah khayr; mixing = brotherhood", keys: ["2:220"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah knows mufsid from muslih", keys: ["2:220"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Marriage prohibition: no mushrikat until they believe", keys: ["2:221"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believing slave woman better than free mushrikah", keys: ["2:221"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Inverse prohibition: no marrying women to mushrikin", keys: ["2:221"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those invite to Fire; Allah invites to Jannah and maghfirah", keys: ["2:221"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Human epistemic limitation: not knowing what benefits or harms", keys: ["2:216"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Religious persecution (fitnah) as existential threat exceeding physical violence", keys: ["2:217"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hope (raja') grounded in faith-migration-struggle triad", keys: ["2:218"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Charitable spending hierarchy establishing family-first welfare system", keys: ["2:215"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Orphan integration through shared household economics", keys: ["2:220"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Faith-based marriage eligibility overriding social class", keys: ["2:221"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Parent-child financial priority in charitable distribution", keys: ["2:215"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Orphan-guardian relationship reframed as brotherhood", keys: ["2:220"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0107","cand-0108","cand-0109"],
  notes: "Pass A pilot 11, passage 33/4. Establishes spending priorities, warfare theology, intoxicant/gambling ruling, and interfaith marriage boundaries. Contains fitnah-greater-than-killing declaration paralleling 2:191. Links to charity-giving, warfare-ethics, marriage-nikah.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P33
{
  // 2:215 - Command: spending directive
  p33.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:215"], excerpt: fv(215), description: "Command: spend good wealth on parents, relatives, orphans, needy, and travelers." });

  // 2:216 - Command: fighting prescribed
  p33.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:216"], excerpt: fv(216), description: "Command: fighting has been prescribed upon you." });

  // 2:221 - Prohibition: do not marry polytheistic women
  p33.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:221"], excerpt: fv(221), description: "Prohibition: do not marry polytheistic women until they believe." });

  // 2:221 - Prohibition: do not give women in marriage to polytheistic men
  p33.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:221"], excerpt: fv(221), description: "Prohibition: do not give believing women in marriage to polytheistic men until they believe." });
}

// Extract divine names from P33
{
  // Aleem from 2:215
  const t215 = fv(215);
  const aleemIdx = t215.indexOf("\u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (aleemIdx >= 0) {
    p33.divineNamesAndAttributes.push({ term: t215.slice(aleemIdx, aleemIdx + 6), transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["2:215"] });
  }

  // Ghafoor Raheem from 2:218
  const t218 = fv(218);
  const ghafoorIdx = t218.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c \u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064c");
  if (ghafoorIdx >= 0) {
    p33.divineNamesAndAttributes.push({ term: t218.slice(ghafoorIdx, ghafoorIdx + 12), transliteration: "Ghafoor Raheem", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["2:218"] });
  }

  // Aziz Hakeem from 2:220
  const t220 = fv(220);
  const azizIdx = t220.indexOf("\u0639\u064e\u0632\u0650\u064a\u0632\u064c \u062d\u064e\u0643\u0650\u064a\u0645\u064c");
  if (azizIdx >= 0) {
    p33.divineNamesAndAttributes.push({ term: t220.slice(azizIdx, azizIdx + 11), transliteration: "Aziz Hakeem", gloss: "Exalted in Might, Wise (editorial gloss)", keys: ["2:220"] });
  }
}

// Extract terminology from P33
{
  // Fitnah from 2:217
  const t217 = fv(217);
  const fitnahIdx = t217.indexOf("\u0671\u0644\u0652\u0641\u0650\u062a\u0652\u0646\u064e\u0629\u064f");
  if (fitnahIdx >= 0) {
    p33.terminology.push({ term: t217.slice(fitnahIdx, fitnahIdx + 9), transliteration: "al-fitnah", gloss: "persecution/trial/civil strife (editorial gloss)", keys: ["2:217"] });
  }

  // Al-'afw (surplus) from 2:219
  const t219 = fv(219);
  const afwIdx = t219.indexOf("\u0671\u0644\u0652\u0639\u064e\u0641\u0652\u0648\u064e");
  if (afwIdx >= 0) {
    p33.terminology.push({ term: t219.slice(afwIdx, afwIdx + 7), transliteration: "al-'afw", gloss: "surplus/excess beyond needs (editorial gloss)", keys: ["2:219"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p33.json"), JSON.stringify(p33, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p33.json");

// ─── Passage 34: 2:222–233 ────────────────────────────────────────────────────────
const p34 = {
  extractionId: "ext-002-p34",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 222, toAyah: 233, label: "Al-Baqarah — Menstruation: harm, keep away until purified; come to them as Allah ordained; Allah loves tawwabin and mutatahhirin; wives are tilth; send ahead for yourselves; fear Allah; do not make Allah excuse for oaths against righteousness and peacemaking; Allah does not hold accountable for laghw oaths but for what hearts earn; Ghafoor Haleem; ila' oath: four months waiting; if return Allah Ghafoor Raheem; if resolve divorce Allah Samee' Aleem; divorced women wait three quru'; concealment of womb creation prohibited; husbands have right to return during waiting period if seeking reconciliation; women have rights similar to obligations bil-ma'ruf; men have darajah over them; divorce twice: retain honorably or release graciously; no taking back gifts unless both fear failing Allah's limits; khul ransom permitted; hudud Allah warning; third divorce: not lawful until she marries another; if second husband divorces no blame returning if maintaining limits; when divorcing and term reached: retain or release bil-ma'ruf; do not retain for harm/transgression; do not take Allah's verses in jest; remember Allah's favor and Book/wisdom; do not prevent remarriage after term; breastfeeding two complete years; father provides maintenance/clothing bil-ma'ruf; no soul burdened beyond capacity; no harm to mother or child through child; heir inherits same duty; weaning by mutual consent; wet-nursing permitted with fair payment" },
  verseKeys: ["2:222","2:223","2:224","2:225","2:226","2:227","2:228","2:229","2:230","2:231","2:232","2:233"],
  arabicExcerpts: Array.from({length:12}, (_,i) => ({ key: `2:${i+222}`, text: fv(i+222) })),
  mainSubject: {
    label: "Comprehensive family law legislation: menstruation as adha requiring separation until purification; marital intimacy framed within divine ordinance; purity and repentance beloved to Allah; wives as harth (tilth); forward-looking righteousness; oaths not to be used as barriers to virtue and peacemaking; unintentional oaths excused but intentional heart-commitments held accountable; ila' (abstinence oath) four-month limit with return option; divorce procedures: waiting period three menstrual cycles; prohibition of concealing pregnancy; husband's reconciliation priority; reciprocal spousal rights with male degree of responsibility; revocable divorce (twice) with honorable retention or gracious release; khul (ransom divorce) when limits cannot be maintained; irrevocable third divorce requiring intervening marriage; post-divorce conduct: no harm-retention; divine verses not for mockery; remembrance of divine favors; non-interference with widow remarriage; nursing period two years with paternal financial responsibility; capacity principle; mutual weaning consent; wet-nursing provisions",
    keys: ["2:222","2:223","2:224","2:225","2:226","2:227","2:228","2:229","2:230","2:231","2:232","2:233"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Menstruation as adha (harm/discomfort); separation required", keys: ["2:222"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-purification intimacy from where Allah ordained", keys: ["2:222"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah loves tawwabin and mutatahhirin", keys: ["2:222"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wives as harth (place of cultivation); approach as wished", keys: ["2:223"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Send ahead for yourselves; taqwa command", keys: ["2:223"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Oaths not as excuse against birr, taqwa, and islah", keys: ["2:224"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Laghw (unintentional) oaths not held accountable", keys: ["2:225"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Accountability for what hearts earn", keys: ["2:225"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ila' (abstinence oath): four-month tarabbus", keys: ["2:226"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Return from ila': Allah Ghafoor Raheem", keys: ["2:226"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Resolution of divorce: Allah Samee' Aleem", keys: ["2:227"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divorced women: three quru' waiting period", keys: ["2:228"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: concealing what Allah created in wombs", keys: ["2:228"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Husband's priority right to return during iddah for islah", keys: ["2:228"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reciprocal spousal rights bil-ma'ruf; male darajah", keys: ["2:228"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divorce twice: imsak bil-ma'ruf or tasreeh bi-ihsan", keys: ["2:229"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Khul: ransom when fearing inability to maintain hudud", keys: ["2:229"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hudud Allah: do not transgress; transgressors are zalimun", keys: ["2:229"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Third divorce: not lawful until intervening marriage", keys: ["2:230"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-intervening-divorce return permitted if maintaining limits", keys: ["2:230"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "End of iddah: retain or release bil-ma'ruf; no dirar retention", keys: ["2:231"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not take Allah's ayat as huzuwan (jest)", keys: ["2:231"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remember ni'mat Allah and revealed Book/Hikmah", keys: ["2:231"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not prevent women remarrying former husbands after term", keys: ["2:232"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Breastfeeding: two complete years for completion", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Father's obligation: rizq and kiswah bil-ma'ruf", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Capacity principle: la tukallafu nafsun illa wus'aha", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No harm to mother or father through child", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Weaning by mutual consent and consultation", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wet-nursing permitted with fair compensation", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Purification (taharah) as spiritually beloved state", keys: ["2:222"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heart intention as locus of moral accountability", keys: ["2:225"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual consent as ethical foundation for family decisions", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Comprehensive divorce legislation with graduated procedures and safeguards", keys: ["2:228","2:229","2:230","2:231","2:232"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Paternal financial responsibility for nursing mothers", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Capacity-based obligation limiting legal burdens", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Spousal reciprocity with differentiated responsibilities (darajah)", keys: ["2:228"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mother-child and father-child protection from instrumentalization", keys: ["2:233"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0110","cand-0111","cand-0112"],
  notes: "Pass A pilot 11, passage 34/4. Most extensive single-passage family law block in Quran. Covers menstruation, oaths, ila', divorce types (raj'i, ba'in, khul), iddah, nursing. Capacity principle (2:233) foundational to Islamic jurisprudence. Links to divorce-separation, spousal-relations, marriage-nikah.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P34
{
  // 2:222 - Command: keep away during menstruation
  p34.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:222"], excerpt: fv(222), description: "Command: keep away from wives during menstruation; do not approach until purified." });

  // 2:223 - Command: fear Allah
  p34.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:223"], excerpt: fv(223), description: "Command: fear Allah and know you will meet Him." });

  // 2:224 - Prohibition: do not make Allah an excuse for oaths
  p34.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:224"], excerpt: fv(224), description: "Prohibition: do not make Allah an obstacle through oaths against righteousness, piety, and peacemaking." });

  // 2:229 - Command: retain honorably or release graciously
  p34.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:229"], excerpt: fv(229), description: "Command: after divorce, either retain with kindness or release with excellence." });

  // 2:231 - Prohibition: do not retain for harm
  p34.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:231"], excerpt: fv(231), description: "Prohibition: do not retain divorced women intending harm to transgress." });

  // 2:232 - Prohibition: do not prevent remarriage
  p34.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:232"], excerpt: fv(232), description: "Prohibition: do not prevent women from remarrying former husbands when they agree on acceptable terms." });

  // 2:233 - Command: fear Allah
  p34.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:233"], excerpt: fv(233), description: "Command: fear Allah and know that Allah sees what you do." });
}

// Extract divine names from P34
{
  // Ghafoor Haleem from 2:225
  const t225 = fv(225);
  const ghIdx = t225.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c \u062d\u064e\u0644\u0650\u064a\u0645\u064c");
  if (ghIdx >= 0) {
    p34.divineNamesAndAttributes.push({ term: t225.slice(ghIdx, ghIdx + 11), transliteration: "Ghafoor Haleem", gloss: "Forgiving, Forbearing (editorial gloss)", keys: ["2:225"] });
  }

  // Samee' Aleem from 2:227
  const t227 = fv(227);
  const saIdx = t227.indexOf("\u0633\u064e\u0645\u0650\u064a\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (saIdx >= 0) {
    p34.divineNamesAndAttributes.push({ term: t227.slice(saIdx, saIdx + 12), transliteration: "Samee' Aleem", gloss: "Hearing, Knowing (editorial gloss)", keys: ["2:227"] });
  }

  // Aziz Hakeem from 2:228
  const t228 = fv(228);
  const ahIdx = t228.indexOf("\u0639\u064e\u0632\u0650\u064a\u0632\u064c \u062d\u064e\u0643\u0650\u064a\u0645\u064c");
  if (ahIdx >= 0) {
    p34.divineNamesAndAttributes.push({ term: t228.slice(ahIdx, ahIdx + 11), transliteration: "Aziz Hakeem", gloss: "Exalted in Might, Wise (editorial gloss)", keys: ["2:228"] });
  }
}

// Extract terminology from P34
{
  // Al-Maheed from 2:222
  const t222 = fv(222);
  const mahIdx = t222.indexOf("\u0671\u0644\u0652\u0645\u064e\u062d\u0650\u064a\u0636\u0650");
  if (mahIdx >= 0) {
    p34.terminology.push({ term: t222.slice(mahIdx, mahIdx + 8), transliteration: "al-maheed", gloss: "menstruation (editorial gloss)", keys: ["2:222"] });
  }

  // Quru' from 2:228
  const t228b = fv(228);
  const quruIdx = t228b.indexOf("\u0642\u064f\u0631\u064f\u0648\u0621\u064d");
  if (quruIdx >= 0) {
    p34.terminology.push({ term: t228b.slice(quruIdx, quruIdx + 6), transliteration: "quru'", gloss: "menstrual periods/cycles (editorial gloss)", keys: ["2:228"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p34.json"), JSON.stringify(p34, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p34.json");

// ─── Passage 35: 2:234–242 ────────────────────────────────────────────────────────
const p35 = {
  extractionId: "ext-002-p35",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 234, toAyah: 242, label: "Al-Baqarah — Widow waiting period four months ten days; no blame for acceptable self-conduct after term; Allah Khabeer; indirect proposal hints permitted; secret promises prohibited except ma'ruf speech; no marriage contract until kitab reaches term; Allah knows what is in souls; Ghafoor Haleem; no blame divorcing before touching without specified mahr; provide mut'ah according to means: wealthy by capacity, poor by capacity; duty upon muhsinin; if divorced before touching with specified mahr: half unless she waives or wali waives; forgiveness closer to taqwa; do not forget fadl between you; Allah Baseer; maintain prayers and middle prayer; stand qanitin; if fear then pray on foot or riding; when secure remember Allah as He taught what you did not know; widows: bequest of one year maintenance without expulsion; if they leave no blame for reasonable self-conduct; Aziz Hakeem; divorced women: mata' bil-ma'ruf; duty upon muttaqin; thus Allah makes clear His ayat so you may reason" },
  verseKeys: ["2:234","2:235","2:236","2:237","2:238","2:239","2:240","2:241","2:242"],
  arabicExcerpts: Array.from({length:9}, (_,i) => ({ key: `2:${i+234}`, text: fv(i+234) })),
  mainSubject: {
    label: "Widow legislation: four months ten days waiting period; permissible conduct after term; indirect marriage proposals allowed during iddah; secret commitments prohibited; marriage deferred until waiting period ends; divine awareness of inner states; pre-consummation divorce without mahr: mut'ah provision scaled to means as duty upon the excellent; pre-consummation divorce with mahr: half owed unless waived; forgiveness nearer to taqwa; reminder not to forget grace between people; prayer maintenance including middle prayer; standing devoutly obedient; fear-prayer concession (on foot or riding); post-security remembrance acknowledging divine teaching; widow bequest: one year maintenance without expulsion; voluntary departure permitted; divorced women's provision as duty upon the righteous; divine clarification of signs for rational understanding",
    keys: ["2:234","2:235","2:236","2:237","2:238","2:239","2:240","2:241","2:242"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Widow iddah: four months and ten days", keys: ["2:234"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-iddah conduct: no blame for ma'ruf self-determination", keys: ["2:234"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Indirect proposal hints during widow iddah permitted", keys: ["2:235"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Secret promise prohibition; only ma'ruf speech", keys: ["2:235"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No marriage contract until waiting period completes", keys: ["2:235"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pre-consummation divorce without mahr: mut'ah scaled to means", keys: ["2:236"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mut'ah as haqq upon muhsinin", keys: ["2:236"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pre-consummation divorce with mahr: half owed", keys: ["2:237"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Waiver by wife or wali permitted", keys: ["2:237"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Forgiveness (afw) closer to taqwa", keys: ["2:237"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not forget fadl (grace/generosity) between you", keys: ["2:237"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Maintain salawat and salat al-wusta (middle prayer)", keys: ["2:238"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Stand before Allah qanitin (devoutly obedient)", keys: ["2:238"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear-prayer concession: on foot or riding", keys: ["2:239"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-security dhikr acknowledging divine teaching", keys: ["2:239"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Widow bequest: one year maintenance without expulsion", keys: ["2:240"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Voluntary departure: no blame for ma'ruf conduct", keys: ["2:240"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divorced women's mata' bil-ma'ruf: duty upon muttaqin", keys: ["2:241"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine clarification for rational comprehension (ta'qiloon)", keys: ["2:242"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Forgiveness as spiritual proximity to taqwa in financial disputes", keys: ["2:237"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Rational comprehension (ta'qiloon) as intended outcome of divine legislation", keys: ["2:242"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Scaled financial obligations based on economic capacity", keys: ["2:236"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Widow economic security: one-year housing and maintenance guarantee", keys: ["2:240"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prayer flexibility under duress preserving worship continuity", keys: ["2:239"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0113","cand-0114"],
  notes: "Pass A pilot 11, passage 35/4. Bridges family law (widow provisions, pre-consummation divorce) with worship legislation (salat al-wusta, fear-prayer). Contains unique 'do not forget fadl' exhortation. Middle prayer identification debated among scholars. Links to divorce-separation, prayer, wealth-property.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P35
{
  // 2:238 - Command: maintain prayers
  p35.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:238"], excerpt: fv(238), description: "Command: maintain the prayers and the middle prayer; stand before Allah devoutly obedient." });

  // 2:239 - Command: remember Allah when secure
  p35.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:239"], excerpt: fv(239), description: "Command: when secure, remember Allah as He taught you what you did not know." });
}

// Extract divine names from P35
{
  // Khabeer from 2:234
  const t234 = fv(234);
  const khIdx = t234.indexOf("\u062e\u064e\u0628\u0650\u064a\u0631\u064c");
  if (khIdx >= 0) {
    p35.divineNamesAndAttributes.push({ term: t234.slice(khIdx, khIdx + 6), transliteration: "Khabeer", gloss: "Fully Acquainted (editorial gloss)", keys: ["2:234"] });
  }

  // Ghafoor Haleem from 2:235
  const t235 = fv(235);
  const ghIdx2 = t235.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c \u062d\u064e\u0644\u0650\u064a\u0645\u064c");
  if (ghIdx2 >= 0) {
    p35.divineNamesAndAttributes.push({ term: t235.slice(ghIdx2, ghIdx2 + 11), transliteration: "Ghafoor Haleem", gloss: "Forgiving, Forbearing (editorial gloss)", keys: ["2:235"] });
  }

  // Baseer from 2:237
  const t237 = fv(237);
  const basIdx = t237.indexOf("\u0628\u064e\u0635\u0650\u064a\u0631\u064c");
  if (basIdx >= 0) {
    p35.divineNamesAndAttributes.push({ term: t237.slice(basIdx, basIdx + 6), transliteration: "Baseer", gloss: "Seeing (editorial gloss)", keys: ["2:237"] });
  }

  // Aziz Hakeem from 2:240
  const t240 = fv(240);
  const ahIdx2 = t240.indexOf("\u0639\u064e\u0632\u0650\u064a\u0632\u064c \u062d\u064e\u0643\u0650\u064a\u0645\u064c");
  if (ahIdx2 >= 0) {
    p35.divineNamesAndAttributes.push({ term: t240.slice(ahIdx2, ahIdx2 + 11), transliteration: "Aziz Hakeem", gloss: "Exalted in Might, Wise (editorial gloss)", keys: ["2:240"] });
  }
}

// Extract terminology from P35
{
  // Salat al-Wusta from 2:238
  const t238 = fv(238);
  const wustaIdx = t238.indexOf("\u0671\u0644\u0635\u0651\u064e\u0644\u064e\u0627\u0629\u0650 \u0671\u0644\u0652\u0648\u064f\u0633\u0652\u0637\u064e\u0649\u0670");
  if (wustaIdx >= 0) {
    p35.terminology.push({ term: t238.slice(wustaIdx, wustaIdx + 16), transliteration: "as-salat al-wusta", gloss: "the middle prayer (editorial gloss)", keys: ["2:238"] });
  }

  // Mata' from 2:241
  const t241 = fv(241);
  const mataIdx = t241.indexOf("\u0645\u064e\u062a\u064e\u0627\u0639\u064c");
  if (mataIdx >= 0) {
    p35.terminology.push({ term: t241.slice(mataIdx, mataIdx + 6), transliteration: "mata'", gloss: "provision/compensation for divorced women (editorial gloss)", keys: ["2:241"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p35.json"), JSON.stringify(p35, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p35.json");

// ─── Passage 36: 2:243–252 ────────────────────────────────────────────────────────
const p36 = {
  extractionId: "ext-002-p36",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 243, toAyah: 252, label: "Al-Baqarah — Those who fled homes in thousands fearing death: Allah said die then revived them; Allah dhu fadl over people but most do not show gratitude; fight in Allah's way; Allah Samee' Aleem; who lends Allah good loan He multiplies manifold; Allah yaqbidu wa yabsutu; to Him returned; Bani Israel after Musa asked prophet for king to fight; would you refrain if fighting prescribed? driven from homes and children; when prescribed they turned away except few; Allah Aleem bil-zalimin; prophet announced Talut as king; objected: we more deserving, he lacks wealth; Allah chose him, increased in knowledge and stature; Allah gives mulk to whom He wills; Wasi' Aleem; sign of kingship: taboot with sakinah and remnant of Musa/Harun legacy carried by angels; Talut's river test: drinker disqualified except handful scoop; most drank; believers crossing said no strength against Jalut; certain of meeting Allah recalled small companies defeating large by Allah's permission; Allah with sabirin; faced Jalut: rabbana afrigh alayna sabran; thabbit aqdamana; victory granted; David killed Jalut; Allah gave him mulk and hikmah; taught what He wills; Allah's checking people through others prevents earth corruption; Allah dhu fadl over worlds; these are ayat of Allah recited in truth; you are among messengers" },
  verseKeys: ["2:243","2:244","2:245","2:246","2:247","2:248","2:249","2:250","2:251","2:252"],
  arabicExcerpts: Array.from({length:10}, (_,i) => ({ key: `2:${i+243}`, text: fv(i+243) })),
  mainSubject: {
    label: "Death-revival miracle demonstrating divine power over life; ingratitude as default human condition; fighting commanded with divine hearing/knowledge assurance; good-loan-to-Allah metaphor for charitable spending with manifold multiplication; divine control of provision (yaqbidu/yabsutu); Bani Israel narrative: requesting king for battle, reluctance when prescribed, Talut's divinely appointed kingship despite lacking wealth, knowledge/stature as qualification criteria, taboot/sakinah as legitimacy sign, river discipline test, minority faith overcoming majority force by divine permission, patience supplication before battle, David's victory and subsequent kingdom/wisdom grant, cosmic balance principle (daf' Allah preventing earth corruption), affirmation of prophetic truth",
    keys: ["2:243","2:244","2:245","2:246","2:247","2:248","2:249","2:250","2:251","2:252"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Mass flight from death; divine death-command then revival", keys: ["2:243"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah dhu fadl; most people ungrateful", keys: ["2:243"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fight in Allah's way; Samee' Aleem", keys: ["2:244"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Good loan to Allah multiplied manifold", keys: ["2:245"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yaqbidu wa yabsutu (withholds and extends)", keys: ["2:245"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bani Israel request for king to fight", keys: ["2:246"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reluctance when fighting actually prescribed", keys: ["2:246"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Talut appointed: chosen, increased in knowledge and stature", keys: ["2:247"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine sovereignty: gives mulk to whom He wills", keys: ["2:247"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign of kingship: taboot with sakinah and Musa/Harun legacy", keys: ["2:248"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "River test: drinking disqualifies; handful exception", keys: ["2:249"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Minority conviction: kam min fi'atin qaleelatin ghalabat...", keys: ["2:249"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah ma'a al-sabirin (with the patient)", keys: ["2:249"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Battle supplication: pour patience, firm feet, victory", keys: ["2:250"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "David kills Jalut; receives mulk and hikmah", keys: ["2:251"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cosmic balance: daf' Allah prevents earth corruption", keys: ["2:251"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Affirmation: ayat recited in truth; Muhammad among messengers", keys: ["2:252"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Bani Israel requesting king after Musa; Talut/Jalut/Dawud narrative", keys: ["2:246","2:247","2:248","2:249","2:250","2:251"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Unnamed prophet mediating between Bani Israel and divine appointment", keys: ["2:246","2:247","2:248"], evidenceClass: "CONTEXTUAL" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Ingratitude as predominant human response to divine bounty", keys: ["2:243"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Certainty of meeting Allah (yazunnoona annahum mulaqoo Allah) enabling courage", keys: ["2:249"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Supplication for sabr as prerequisite for victory", keys: ["2:250"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Leadership qualification: divine selection over hereditary/wealth claims", keys: ["2:247"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Military discipline testing as loyalty filter", keys: ["2:249"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cosmic sociological principle: mutual checking prevents civilizational collapse", keys: ["2:251"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0115","cand-0116"],
  notes: "Pass A pilot 11, passage 36/4. Contains Talut-Jalut-Dawud narrative cycle. Good-loan metaphor bridges finance and spirituality. Daf' Allah principle (2:251) foundational to Islamic political theology. River test parallels Gideon narrative. Links to warfare-ethics, sabr-patience, shukr-gratitude, leadership-qualities.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P36
{
  // 2:244 - Command: fight in Allah's way
  p36.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:244"], excerpt: fv(244), description: "Command: fight in the cause of Allah." });
}

// Extract divine names from P36
{
  // Samee' Aleem from 2:244
  const t244 = fv(244);
  const saIdx2 = t244.indexOf("\u0633\u064e\u0645\u0650\u064a\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (saIdx2 >= 0) {
    p36.divineNamesAndAttributes.push({ term: t244.slice(saIdx2, saIdx2 + 12), transliteration: "Samee' Aleem", gloss: "Hearing, Knowing (editorial gloss)", keys: ["2:244"] });
  }

  // Wasi' Aleem from 2:247
  const t247 = fv(247);
  const waIdx = t247.indexOf("\u0648\u064e\u0627\u0633\u0650\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
  if (waIdx >= 0) {
    p36.divineNamesAndAttributes.push({ term: t247.slice(waIdx, waIdx + 11), transliteration: "Wasi' Aleem", gloss: "All-Encompassing, Knowing (editorial gloss)", keys: ["2:247"] });
  }
}

// Extract terminology from P36
{
  // Sakinah from 2:248
  const t248 = fv(248);
  const sakIdx = t248.indexOf("\u0633\u064e\u0643\u0650\u064a\u0646\u064e\u0629\u064c");
  if (sakIdx >= 0) {
    p36.terminology.push({ term: t248.slice(sakIdx, sakIdx + 7), transliteration: "sakinah", gloss: "tranquility/assurance/divine presence (editorial gloss)", keys: ["2:248"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p36.json"), JSON.stringify(p36, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p36.json");

// ─── Candidates batch (cand-0107 through cand-0116) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-002-p33,ext-002-p34,ext-002-p35,ext-002-p36",
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

// cand-0107: Spending priorities and charitable distribution hierarchy
candidates.candidates.push(makeCand("cand-0107",
  "Spending priorities: hierarchical distribution to parents, relatives, orphans, needy, and travelers",
  undefined, "\u0627\u0646\u0641\u0627\u0642 \u06a9\u06cc \u062a\u0631\u062c\u06cc\u062d\u0627\u062a: \u0648\u0627\u0644\u062f\u06cc\u0646\u060c \u0631\u0634\u062a\u06c1 \u062f\u0627\u0631\u060c \u06cc\u062a\u06cc\u0645\u060c \u0645\u0633\u06a9\u06cc\u0646\u060c \u0645\u0633\u0627\u0641\u0631",
  "In 2:215: They ask you what they should spend. Say: Whatever you spend of good is for parents and relatives and orphans and the needy and the traveler. And whatever you do of good, indeed Allah is Knowing of it.",
  [{ key: "2:215", excerpt: fv(215), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes five-category spending hierarchy with divine omniscience as accountability." }],
  [{ topicId: "poverty-solutions", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "parents-and-family", layer: "curated", relationship: "related-not-identical" }],
  "Gap candidate: specific priority ordering absent from existing topics. Family-first welfare model."
));

// cand-0108: Intoxicants and gambling — sin-benefit calculus
candidates.candidates.push(makeCand("cand-0108",
  "Intoxicants and gambling: acknowledged benefit outweighed by greater sin",
  undefined, "\u0634\u0631\u0627\u0628 \u0627\u0648\u0631 \u062c\u0648\u0627: \u0641\u0627\u0626\u062f\u06c1 \u0633\u06d2 \u0628\u0691\u06be\u0627 \u06af\u0646\u0627\u06c1",
  "In 2:219: They ask you about wine and gambling. Say: In them is great sin and [yet some] benefit for people. But their sin is greater than their benefit.",
  [{ key: "2:219", excerpt: fv(219), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides explicit cost-benefit framework with sin declared dominant." }],
  [{ topicId: "halal-food", layer: "scholarly", relationship: "broader" }],
  "Gap candidate: no dedicated khamr-maysir topic. Gradual prohibition methodology visible here vs. later absolute prohibition."
));

// cand-0109: Interfaith marriage prohibition — faith over social status
candidates.candidates.push(makeCand("cand-0109",
  "Interfaith marriage prohibition: believing slave preferred over free polytheist",
  undefined, "\u0628\u06cc\u0646 \u0627\u0644\u0645\u0630\u06c1\u0628 \u0634\u0627\u062f\u06cc \u06a9\u06cc \u0645\u0645\u0646\u0648\u0639\u062a: \u0627\u06cc\u0645\u0627\u0646 \u06a9\u0648 \u0645\u0631\u062a\u0628\u06c1 \u067e\u0631 \u062a\u0631\u062c\u06cc\u062d",
  "In 2:221: Do not marry polytheistic women until they believe. A believing slave woman is better than a polytheist even if she pleases you. Do not marry [women to] polytheistic men until they believe. A believing slave is better than a polytheist even if he pleases you. Those invite to the Fire; Allah invites to Paradise and forgiveness.",
  [{ key: "2:221", excerpt: fv(221), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes bidirectional prohibition with faith-status inversion and eschatological rationale." }],
  [{ topicId: "interfaith-marriage", layer: "scholarly", relationship: "same-concept" },
   { topicId: "spouse-selection", layer: "scholarly", relationship: "related-not-identical" }],
  "Overlap confirmed with interfaith-marriage. Adds explicit faith-over-class principle and dual-direction prohibition."
));

// cand-0110: Divorce legislation — comprehensive procedural framework
candidates.candidates.push(makeCand("cand-0110",
  "Divorce legislation: waiting periods, reconciliation rights, khul, and irrevocable divorce procedures",
  undefined, "\u0637\u0644\u0627\u0642 \u06a9\u0627 \u0642\u0627\u0646\u0648\u0646: \u0639\u062f\u062a\u060c \u0631\u062c\u0648\u0639\u060c \u062e\u0644\u0639\u060c \u0627\u0648\u0631 \u062d\u062a\u0645\u06cc \u0637\u0644\u0627\u0642",
  "In 2:228: Divorced women wait three quru'; husbands have reconciliation priority; reciprocal rights with male darajah. In 2:229: Divorce twice; retain honorably or release graciously; khul ransom when fearing hudud failure. In 2:230: Third divorce requires intervening marriage. In 2:231-232: No harm-retention; no preventing remarriage.",
  [{ key: "2:228", excerpt: fv(228), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes waiting period, reconciliation priority, and reciprocal rights framework." },
   { key: "2:229", excerpt: fv(229), evidenceClass: "EXPLICIT_TEXT", rationale: "Defines revocable divorce count and khul mechanism." },
   { key: "2:230", excerpt: fv(230), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes irrevocable divorce rule with intervening marriage requirement." }],
  [{ topicId: "divorce-types", layer: "scholarly", relationship: "same-concept" },
   { topicId: "khul-divorce", layer: "scholarly", relationship: "narrower" }],
  "Overlap confirmed with divorce-types and khul-divorce. This candidate captures unified legislative context across multiple verses."
));

// cand-0111: Breastfeeding and nursing rights — parental obligations and mutual consent
candidates.candidates.push(makeCand("cand-0111",
  "Breastfeeding legislation: two-year period, paternal provision, capacity principle, and mutual weaning consent",
  undefined, "\u062f\u0648\u062f\u06be \u067e\u0644\u0627\u0646\u06d2 \u06a9\u0627 \u0642\u0627\u0646\u0648\u0646: \u062f\u0648 \u0633\u0627\u0644\u060c \u0628\u0627\u067e \u06a9\u06cc \u0630\u0645\u06c1 \u062f\u0627\u0631\u06cc\u060c \u0635\u0644\u0627\u062d\u06cc\u062a\u060c \u0628\u0627\u06c1\u0645\u06cc \u0631\u0636\u0627\u0645\u0646\u062f\u06cc",
  "In 2:233: Mothers breastfeed two complete years for whoever wishes completion. Upon the father is their provision and clothing bil-ma'ruf. No soul burdened beyond capacity. No mother harmed through child nor father through child. Weaning by mutual consent and consultation. Wet-nursing permitted with fair payment.",
  [{ key: "2:233", excerpt: fv(233), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides comprehensive nursing legislation with capacity principle and mutual consent requirements." }],
  [{ topicId: "child-development", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "mother-rights", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated rada'ah/breastfeeding topic. Capacity principle (la tukallafu nafsun illa wus'aha) is jurisprudentially foundational."
));

// cand-0112: Oaths and intentions — laghw exemption and heart accountability
candidates.candidates.push(makeCand("cand-0112",
  "Oaths: unintentional (laghw) exemption with heart-intention accountability",
  undefined, "\u0642\u0633\u0645\u06cc\u06ba: \u063a\u06cc\u0631 \u0627\u0631\u0627\u062f\u06cc \u0686\u06be\u0648\u0679 \u0645\u0639\u0627\u0641\u06cc\u060c \u062f\u0644 \u06a9\u06cc \u0646\u06cc\u062a \u067e\u0631 \u0645\u0648\u0627\u062e\u0630\u06c1",
  "In 2:224-225: Do not make Allah an excuse through oaths against righteousness, piety, and peacemaking. Allah does not hold you accountable for laghw in your oaths but holds you accountable for what your hearts have earned. Allah is Forgiving, Forbearing.",
  [{ key: "2:224", excerpt: fv(224), evidenceClass: "EXPLICIT_TEXT", rationale: "Prohibits instrumentalizing divine name to avoid moral duties." },
   { key: "2:225", excerpt: fv(225), evidenceClass: "EXPLICIT_TEXT", rationale: "Distinguishes unintentional from intentional oath accountability centered on heart." }],
  [{ topicId: "good-character", layer: "curated", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated oaths/ayman topic. Heart-as-moral-locus principle connects to ikhlas-sincerity."
));

// cand-0113: Widow provisions — waiting period, bequest, and remarriage rights
candidates.candidates.push(makeCand("cand-0113",
  "Widow provisions: four-month-ten-day iddah, one-year bequest, and autonomous remarriage",
  undefined, "\u0628\u06cc\u0648\u06c1 \u06a9\u06cc \u062d\u0642\u0648\u0642: \u0639\u062f\u062a\u060c \u0648\u0635\u06cc\u062a\u060c \u0627\u0648\u0631 \u062f\u0648\u0628\u0627\u0631\u06c1 \u0634\u0627\u062f\u06cc",
  "In 2:234: Widows wait four months and ten days; no blame for acceptable self-conduct after term. In 2:235: Indirect proposals permitted; secret commitments prohibited. In 2:240: Bequest of one year maintenance without expulsion; voluntary departure permitted.",
  [{ key: "2:234", excerpt: fv(234), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes widow iddah duration and post-term autonomy." },
   { key: "2:235", excerpt: fv(235), evidenceClass: "EXPLICIT_TEXT", rationale: "Permits indirect proposal while prohibiting secret commitments." },
   { key: "2:240", excerpt: fv(240), evidenceClass: "EXPLICIT_TEXT", rationale: "One-year housing/maintenance bequest with voluntary departure option." }],
  [{ topicId: "marital-rights", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no dedicated widow/iddah topic. Economic security provisions distinctive from divorce iddah."
));

// cand-0114: Middle prayer (salat al-wusta) — maintenance and devotion
candidates.candidates.push(makeCand("cand-0114",
  "Middle prayer (salat al-wusta): specific maintenance command with devout standing",
  undefined, "\u0648\u0633\u0637\u06cc \u0646\u0645\u0627\u0632: \u062d\u0641\u0627\u0638\u062a \u0627\u0648\u0631 \u0639\u0628\u0627\u062f\u062a \u0645\u06cc\u06ba \u06a9\u06be\u0691\u06d2 \u06c1\u0648\u0646\u0627",
  "In 2:238: Maintain the prayers and the middle prayer (salat al-wusta), and stand before Allah devoutly obedient (qanitin).",
  [{ key: "2:238", excerpt: fv(238), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse singles out middle prayer for special emphasis alongside general prayer maintenance." }],
  [{ topicId: "five-daily-prayers", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "prayer", layer: "curated", relationship: "broader" }],
  "Overlap with five-daily-prayers. Specificity of 'wusta' identification remains scholarly debate (Asr most common view)."
));

// cand-0115: Good loan to Allah — charitable spending as divine investment
candidates.candidates.push(makeCand("cand-0115",
  "Good loan to Allah (qard hasan): charitable spending with manifold divine multiplication",
  undefined, "\u0627\u0644\u0644\u06c1 \u06a9\u0648 \u062e\u0648\u0628\u0635\u0648\u0631\u062a \u0642\u0631\u0636: \u062e\u06cc\u0631\u0627\u062a \u067e\u0631 \u06a9\u0626\u06cc \u06af\u0646\u0627 \u0627\u062c\u0631",
  "In 2:245: Who is it that would loan Allah a goodly loan so He may multiply it for him many times over? And Allah withholds and grants abundance, and to Him you will be returned.",
  [{ key: "2:245", excerpt: fv(245), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse frames charity as lending to Allah with guaranteed manifold return." }],
  [{ topicId: "sadaqah-jariyah", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "giving", layer: "curated", relationship: "broader" }],
  "Overlap with sadaqah-jariyah and giving. Qard-hasan metaphor distinctively personalizes divine reciprocity."
));

// cand-0116: Cosmic balance principle — divine checking prevents earth corruption
candidates.candidates.push(makeCand("cand-0116",
  "Cosmic balance (daf' Allah): divine checking of people through others prevents earth corruption",
  undefined, "\u06a9\u0627\u0626\u0646\u0627\u062a\u06cc \u062a\u0648\u0627\u0632\u0646: \u0627\u0644\u0644\u06c1 \u06a9\u0627 \u0644\u0648\u06af\u0648\u06ba \u06a9\u0648 \u0631\u0648\u06a9\u0646\u0627 \u0632\u0645\u06cc\u0646 \u06a9\u0648 \u0641\u0633\u0627\u062f \u0633\u06d2 \u0628\u0686\u0627\u062a\u0627 \u06c1\u06d2",
  "In 2:251: If it were not for Allah checking [some] people by means of others, the earth would have been corrupted, but Allah is full of bounty to the worlds.",
  [{ key: "2:251", excerpt: fv(251), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse articulates cosmic sociological principle justifying conflict as corruption-prevention mechanism." }],
  [{ topicId: "fasad-fil-ard", layer: "scholarly", relationship: "related-not-identical" },
   { topicId: "mizan-balance", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: daf' Allah as political-theological principle distinct from environmental fasad. Connects warfare ethics to cosmology."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-011.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-011.json with ${candidates.candidates.length} candidates`);

console.log("\nDone. Run validator to confirm.");
