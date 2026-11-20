// MFD-11 Wave 4: Surah 29 (Al-Ankabut) genuine re-extraction.
// Covers 29:1–69 in 3 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "029-0001-0069.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 29:${n} not found`);
  return verses[n];
}

function findWord(vid, chars) {
  const t = fv(vid);
  const words = t.split(/\s+/);
  for (const w of words) {
    let match = true;
    for (const ch of chars) { if (!w.includes(ch)) { match = false; break; } }
    if (match) return w;
  }
  return null;
}

console.log("Generating Surah 29 (Al-Ankabut) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T14:05:00.000Z";

// P1: 29:1–25 — Faith-testing principle; parental obedience limits; conditional belief
// P2: 29:26–45 — Ibrahim-Lut-Shuayb-Nuh narratives; destruction catalog; spider-web parable
// P3: 29:46–69 — Scripture dialogue; creation signs; worldly life as play; striving-guidance

const PASSAGES = [
  { id: "ext-029-p1", from: 1, to: 25,
    label: "Alif-Lam-Mim; people think left say believe not tried; tried those before Allah make evident truthful make evident liars; evil doers think outrun Us evil judge; hopes meeting Allah term decreed coming Hearing Knowing; strives only for himself Allah free need worlds; believed righteous remove misdeeds reward best did; enjoined man goodness parents endeavor associate Me knowledge not obey return reckoning; believed righteous admit among righteous; people say believe Allah harmed cause Allah consider trial people; comes victory Lord say indeed were you; Allah knows believed knows hypocrites; disbelieve said believers follow way ours carry sins carry nothing sins theirs burdens burdens Day Resurrection questioned forged; tested those before them Allah knows believed knows hypocrites; evil doers think outrun Us evil judge; hopes meeting Allah term decreed Hearing Knowing; strives only himself Allah free need; believed righteous remove misdeeds reward best; enjoined goodness parents endeavor associate knowledge not obey return; believed righteous admit righteous",
    mainLabel: "Disjointed letters; faith-testing (fitnah) as universal principle distinguishing truthful from lying; evil-doers cannot outrun divine reach; hope for divine meeting tied to appointed term; striving benefits self alone as Allah is Ghani; belief-righteousness producing sin-removal and best reward; parental kindness bounded by shirk prohibition with continued worldly companionship; conditional belief exposed: claiming faith but treating persecution as mere trial then reverting when victory comes; prior generation testing establishing pattern; hypocrite identification through trial response" },
  { id: "ext-029-p2", from: 26, to: 45,
    label: "Lut believed him said emigrating Lord Mighty Wise; gave Isaac Yaqub made descendants prophethood scripture gave reward world Hereafter among righteous; Ibrahim said people worship besides Allah idols create falsehood worship besides Allah no power help provision seek Allah worship grateful; worship besides Allah idols create falsehood powerless provide; burn him fire made cool safe sign believing people; saved delivered blessed land Isaac Yaqub additional gift; Lot messengers came distressed discomfort said fear grieve save family except wife destined remain behind; bring down punishment sky defiantly disobedient; left sign clear evidence people reason; Madyan brother Shuayb said worship Allah expect Last Day commit corruption earth; denied earthquake seized became home corpses fallen prone; Aad Thamud clear ruined dwellings Satan made pleasing deeds averted way unable guided; Qarun Firawn Haman Musa came clear evidences arrogant land not beyond Us; each seized sin storm stones swallowed earth drowned; Allah not wronged wronged selves; example took protectors besides Allah like spider took home weakest homes knew; thus Allah presents examples people truth; created heavens earth truth not play; intended take amusement taken besides Us; say praise Allah shown signs recognize Lord unaware do",
    mainLabel: "Lut belief and emigration; Ibrahim-Ishaq-Yaqub prophethood-scripture-reward lineage; Ibrahim idol rejection exposing creative impotence; fire miracle as sign for believers; deliverance to blessed land; Lut-messengers distress and reassurance; wife exception to salvation; sky-punishment leaving visible sign; Shuayb-Madyan earthquake destruction; Aad-Thamud ruins as observable evidence with satanic beautification noted; Qarun-Firawn-Haman triad destroyed by distinct punishments; self-inflicted wrong negating divine injustice; spider-web parable (mathal al-ankabut): weakest house as shirk-protection metaphor; creation in truth not play; hamd closing with sign-recognition" },
  { id: "ext-029-p3", from: 46, to: 69,
    label: "dispute People Scripture except best way say believe revealed us revealed you God our God yours one Him Muslims; revealed Book clarification everything guidance mercy people believe; who more unjust invents lie Allah denies truth come Hell residence arrogant; recite revealed Book establish prayer indeed prayer prohibits immorality wrongdoing remembrance Allah greater Allah knows fabricate; strive Us surely guide ways Allah doers good; many creature carries not provision Allah provides it you Hearing Knowing; asked created heavens earth subjected sun moon say Allah deluded; extends restricts provision whom wills servants Indeed Allah Knowing everything; asked sends rain sky gives life earth lifelessness say Allah deluded; worldly life diversion amusement home Hereafter eternal life knew; board ship supplicate Allah sincere delivers land associate others; deny granted enjoy know; made Makkah safe sanctuary people taken away around believe falsehood deny favor; who more unjust invents lie Allah denies truth come Hell residence arrogant; strive Us guide ways Allah doers good",
    mainLabel: "Scriptural dialogue protocol: dispute only in best way; shared belief in One God as common ground; Quran as tibyan-huda-rahmah for believers; injustice defined as fabrication-denial combination; salah as fahisha-munkar prohibition mechanism; dhikr Allah akbar as supreme devotional act; creature provision dependency demonstrating divine sustenance; rhetorical tawheed questions producing unanimous Allah-response; provision expansion-restriction as divine prerogative; rain-revival as resurrection microcosm; worldly life as lahw-la'b versus eternal hereafter; maritime sincerity versus land-based polytheism as situational faith pattern; Makkah sanctuary as tangible divine favor; striving-for-Allah producing divine guidance as reciprocal promise" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`29:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`29:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 29, surahName: "Al-Ankabut",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 4 genuine re-extraction. P1=faith-testing-parental-limits-conditional-belief(1-25), P2=Ibrahim-Lut-Shuayb-destruction-spider-parable(26-45), P3=scripture-dialogue-signs-striving(46-69).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (29:1-25) ===
{
  const e = extractions[0];
  const samee = findWord(5, ["\u0633","\u0645","\u064a","\u0639"]);
  const aleem = findWord(5, ["\u0639","\u0644","\u064a","\u0645"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "All-Hearing (editorial gloss)", keys: ["29:5"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["29:5"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["29:8"], excerpt: fv(8), description: "We have enjoined upon man goodness to parents — birr al-walidayn as universal obligation." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["29:8"], excerpt: fv(8), description: "If they endeavor to make you associate with Me that of which you have no knowledge do not obey them — shirk-obedience limit." });

  e.humanConditionsAndSpiritualStates.push({ label: "Faith-testing (fitnah) as universal principle: Do people think they will be left to say 'we believe' without being tried?", keys: ["29:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Conditional belief exposed: claiming faith but treating persecution as trial then reverting when victory comes", keys: ["29:10"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Parental kindness bounded by tawheed: obey in all except shirk while maintaining worldly companionship (ma'ruf)", keys: ["29:8"], evidenceClass: "EXPLICIT_TEXT" });

  const fitnah = findWord(2, ["\u0641","\u062a","\u0646"]);
  if (fitnah) e.terminology.push({ term: fitnah, transliteration: "fitnah", gloss: "trial/testing (editorial gloss)", keys: ["29:2"] });
}

// === POPULATE P2 (29:26-45) ===
{
  const e = extractions[1];

  e.propheticNarratives.push({ label: "Ibrahim: idol rejection exposing creative impotence; fire miracle as sign; deliverance to blessed land with Ishaq-Yaqub grant", keys: ["29:26","29:27","29:28","29:29","29:30"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Lut: messenger distress and reassurance; family salvation with wife exception; sky-punishment leaving visible sign", keys: ["29:31","29:32","29:33","29:34","29:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Shuayb-Madyan: worship-Last Day command; denial triggering earthquake destruction", keys: ["29:36","29:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["29:45"], excerpt: fv(45), description: "Recite what has been revealed of the Book and establish prayer — dual devotional command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Spider-web parable: those taking protectors besides Allah are like spider building weakest house", keys: ["29:41"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Self-inflicted wrong: Allah did not wrong them but they wronged themselves", keys: ["29:40"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Destroyed town ruins remaining as observable archaeological evidence for reasoning people", keys: ["29:35","29:38"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Salah as fahisha-munkar prohibition mechanism: indeed prayer prohibits immorality and wrongdoing", keys: ["29:45"], evidenceClass: "EXPLICIT_TEXT" });

  const ankabut = findWord(41, ["\u0639","\u0646","\u0643","\u0628"]);
  if (ankabut) e.terminology.push({ term: ankabut, transliteration: "ankabut", gloss: "spider (editorial gloss)", keys: ["29:41"] });
}

// === POPULATE P3 (29:46-69) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["29:46"], excerpt: fv(46), description: "Do not dispute with People of the Scripture except in the best way — dialogue etiquette command." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["29:69"], excerpt: fv(69), description: "Those who strive for Us We will surely guide them to Our ways — striving-guidance reciprocity." });

  // Verse 45 belongs to P2 (26-45), not P3 (46-69)
  e.humanConditionsAndSpiritualStates.push({ label: "Worldly life as diversion-amusement (lahw wa-la'b) versus eternal hereafter as true life", keys: ["29:64"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Maritime sincerity versus land-based polytheism: sincere supplication at sea reverting to shirk on land", keys: ["29:65"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Striving-guidance reciprocity: those who strive for Allah receive divine guidance to His ways", keys: ["29:69"], evidenceClass: "EXPLICIT_TEXT" });

  const jihad = findWord(69, ["\u062c","\u0627","\u0647","\u062f"]);
  if (jihad) e.terminology.push({ term: jihad, transliteration: "jihad", gloss: "striving/struggle (editorial gloss)", keys: ["29:69"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `029-al-ankabut-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 029-al-ankabut-p${num}.json`);
}

// === CANDIDATES (cand-1097..cand-1126, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-029-p1,ext-029-p2,ext-029-p3",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1097..1106)
  { id: "cand-1097", label: "Faith-testing (fitnah) as universal principle distinguishing truthful from lying", def: "In 29:2-3: Do people think left to say we believe without trial? We tried those before; Allah makes evident truthful and liars.", key: "29:2", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Fitnah as iman discriminator."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Testing revealing authenticity."}] },
  { id: "cand-1098", label: "Evil-doers cannot outrun divine reach", def: "In 29:4: Or do those who do evil deeds think they can outrun Us? Evil is what they judge.", key: "29:4", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"La yu'jizuna."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Escape impossibility."}] },
  { id: "cand-1099", label: "Striving benefits self alone as Allah is free from need", def: "In 29:6: Whoever strives only strives for himself; Allah is Ghani (free from need) of the worlds.", key: "29:6", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Divine self-sufficiency."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Benefit returns to agent."}] },
  { id: "cand-1100", label: "Belief-righteousness producing sin-removal and best reward", def: "In 29:7: Those who believe and do righteous deeds We remove their misdeeds and reward according to best of what they did.", key: "29:7", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Takfir al-sayyi'at."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ahsan reward standard."}] },
  { id: "cand-1101", label: "Parental kindness bounded by tawheed with continued worldly companionship", def: "In 29:8: Enjoined goodness to parents; if they endeavor shirk do not obey; accompany in world with ma'ruf.", key: "29:8", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Birr with tawheed boundary."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ma'ruf companionship despite disagreement."}] },
  { id: "cand-1102", label: "Conditional belief exposed through persecution response", def: "In 29:10: Some say we believe in Allah; when harmed for Allah consider it trial; when victory comes say we were with you.", key: "29:10", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Situational iman."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Persecution as authenticity test."}] },
  { id: "cand-1103", label: "Prior generation testing establishing historical pattern", def: "In 29:3: We certainly tried those before them; Allah will make evident the truthful and the liars.", key: "29:3", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Historical precedent."},{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Repeated pattern."}] },
  { id: "cand-1104", label: "Hope for divine meeting tied to appointed term", def: "In 29:5: Whoever hopes for meeting with Allah the term decreed by Allah is coming; He is Hearing Knowing.", key: "29:5", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Liqa' Allah as motivation."},{topicId:"predestination-free-will",layer:"scholarly",relationship:"same-concept",note:"Ajal musamma."}] },
  { id: "cand-1105", label: "Hypocrite identification through trial response pattern", def: "In 29:11: Allah will surely know those who believed and will surely know the hypocrites.", key: "29:11", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Trial as disclosure mechanism."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Inner state revealed."}] },
  { id: "cand-1106", label: "Burden-bearing principle: each soul carries only its own load plus misled burdens", def: "In 29:12-13: They carry their own burdens and other burdens with their own; questioned about what they forged.", key: "29:12", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Awzar + awzar ukhra."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Compound accountability."}] },

  // P2 (cand-1107..1116)
  { id: "cand-1107", label: "Ibrahim idol rejection exposing creative impotence of fabricated deities", def: "In 29:17: You worship besides Allah idols creating falsehood; those you worship besides Allah possess no provision.", key: "29:17", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Rational tawheed argument."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Creative incapacity proof."}] },
  { id: "cand-1108", label: "Fire miracle as sign confirming divine protection of prophet", def: "In 29:24: Said burn him; Allah made it cool and safe for Ibrahim; indeed in that is sign for believing people.", key: "29:24", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Nar barid salam."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Element subjugation as ayah."}] },
  { id: "cand-1109", label: "Lut messenger distress and divine reassurance preceding community destruction", def: "In 29:33: Messengers came to Lot; he was distressed; they said fear not nor grieve; we save you and family except wife.", key: "29:33", overlap: [{topicId:"lut-story",layer:"scholarly",relationship:"same-concept",note:"Prophetic empathy."},{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Reassurance before action."}] },
  { id: "cand-1110", label: "Sky-punishment leaving visible sign for reasoning people", def: "In 29:34-35: Bring down punishment from sky; left of it a sign as clear evidence for people who use reason.", key: "29:34", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Archaeological ayah."},{topicId:"intellect-importance",layer:"scholarly",relationship:"same-concept",note:"Reason as sign-recognition faculty."}] },
  { id: "cand-1111", label: "Multiple destruction methods demonstrating divine punitive versatility", def: "In 29:40: Each seized for sin; storm of stones, swallowing by earth, drowning — distinct punishments for distinct communities.", key: "29:40", overlap: [{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Differentiated adhab."},{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Sin-specific punishment."}] },
  { id: "cand-1112", label: "Spider-web parable: weakest house as metaphor for shirk-based protection", def: "In 29:41: Example of those who took protectors besides Allah is like spider who took a home; weakest of houses.", key: "29:41", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Awthan bayt as fragility."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Natural metaphor for theological truth."}] },
  { id: "cand-1113", label: "Creation in truth negating divine play or amusement", def: "In 29:44: Allah created heavens and earth in truth; not in play.", key: "29:44", overlap: [{topicId:"life-purpose",layer:"scholarly",relationship:"same-concept",note:"Bi'l-haqq creation."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Purposeful rububiyyah."}] },
  { id: "cand-1114", label: "Salah as fahisha-munkar prohibition mechanism", def: "In 29:45: Establish prayer; indeed prayer prohibits immorality and wrongdoing.", key: "29:45", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Salah as moral restraint."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Worship producing ethical effect."}] },
  { id: "cand-1115", label: "Dhikr Allah as greater than ritual performance", def: "In 29:45: Remembrance of Allah is greater (wa-la-dhikru Allahi akbar).", key: "29:45", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr supremacy."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Awareness exceeding form."}] },
  { id: "cand-1116", label: "Self-inflicted wrong negating divine injustice claim", def: "In 29:40: Allah did not wrong them but they wronged themselves.", key: "29:40", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Zalamu anfusahum."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Divine justice affirmed."}] },

  // P3 (cand-1117..1126)
  { id: "cand-1117", label: "Scriptural dialogue protocol: dispute only in best way with shared tawheed foundation", def: "In 29:46: Do not dispute with People of Scripture except in best way; say we believe in what was revealed to us and you; our God and your God is one.", key: "29:46", overlap: [{topicId:"dialogue-principles",layer:"scholarly",relationship:"same-concept",note:"Ahsan jidal."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"related-not-identical",note:"Shared Abrahamic foundation."}] },
  { id: "cand-1118", label: "Quran as tibyan-huda-rahmah for believing community", def: "In 29:51: Is it not sufficient that We sent down Book recited to them? Indeed in that is mercy and reminder for believing people.", key: "29:51", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Triple function."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Rahmah-dhikra pairing."}] },
  { id: "cand-1119", label: "Rhetorical tawheed questions producing unanimous Allah-response", def: "In 29:61,63: If you ask who created heavens earth subjected sun moon they say Allah; who sends rain gives life they say Allah.", key: "29:61", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Universal acknowledgment."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Natural phenomena eliciting tawheed."}] },
  { id: "cand-1120", label: "Worldly life as lahw wa-la'b versus eternal hereafter as hayawan", def: "In 29:64: This worldly life is not but diversion and amusement; home of Hereafter is the eternal life if only they knew.", key: "29:64", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Dunya trivialized."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Hayawan as true life."}] },
  { id: "cand-1121", label: "Maritime sincerity versus land-based polytheism as situational faith pattern", def: "In 29:65: When they board ship supplicate Allah sincere; when delivered to land associate others.", key: "29:65", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Situational ikhlas."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Crisis-driven tawheed."}] },
  { id: "cand-1122", label: "Makkah sanctuary as tangible divine favor contrasting surrounding insecurity", def: "In 29:67: Have they not seen We made safe sanctuary while people are taken away around them?", key: "29:67", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Geographic security as ayah."},{topicId:"gratitude-ingratitude",layer:"scholarly",relationship:"same-concept",note:"Favor demanding recognition."}] },
  { id: "cand-1123", label: "Creature provision dependency demonstrating universal divine sustenance", def: "In 29:60: How many creatures carry not their own provision; Allah provides for it and for you; Hearing Knowing.", key: "29:60", overlap: [{topicId:"animals-as-communities",layer:"scholarly",relationship:"same-concept",note:"Non-human rizq."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Universal provider."}] },
  { id: "cand-1124", label: "Provision expansion-restriction as divine prerogative demonstrating knowledge", def: "In 29:62: Allah extends provision for whom He wills and restricts; indeed Allah is Knowing of all things.", key: "29:62", overlap: [{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Bast-qadr cycle."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Knowledge governing distribution."}] },
  { id: "cand-1125", label: "Striving-for-Allah producing divine guidance as reciprocal promise", def: "In 29:69: Those who strive for Us We will surely guide them to Our ways; Allah is with the doers of good.", key: "29:69", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Jihad-hidayah reciprocity."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Divine companionship."}] },
  { id: "cand-1126", label: "Fabrication-denial combination as supreme injustice", def: "In 29:68: Who is more unjust than one who invents lie about Allah or denies truth when it comes?", key: "29:68", overlap: [{topicId:"lying",layer:"scholarly",relationship:"same-concept",note:"Iftira' ala Allah."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Denial despite clarity."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 4 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `029-al-ankabut-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-053.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-053.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
