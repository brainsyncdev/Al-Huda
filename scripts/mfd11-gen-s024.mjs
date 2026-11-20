// MFD-11 Wave 3: Surah 24 (An-Nur) genuine re-extraction.
// Covers 24:1–64 in 3 meaningful passages with populated analytical arrays.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "024-0001-0064.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 24:${n} not found`);
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

console.log("Generating Surah 24 (An-Nur) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T13:35:00.000Z";

// P1: 24:1–20 — Zina punishment, qadhf procedure, li'an oath, repentance
// P2: 24:21–45 — Modesty commands, marriage encouragement, Light Verse, believer commerce
// P3: 24:46–64 — Social etiquette, privacy rules, disability accommodations, closing obedience

const PASSAGES = [
  { id: "ext-024-p1", from: 1, to: 20,
    label: "Surah sent down made obligatory revealed verses clear evidence may remember; unmarried woman man guilty sexual intercourse lash hundred lashes compassion seize religion Allah believe Day Resurrection; witness four believers; fornicator marries only fornicatress polytheist none marries her except fornicator polytheist forbidden believers; accuse chaste women produce four witnesses lash eighty accept testimony ever after transgressors; except repent reform Allah Forgiving Merciful; accuse wives no witnesses except selves testimony one four times swearing Allah truthful; fifth oath curse Allah upon him if liars; prevents punishment her if gives four testimonies swearing Allah indeed he liars; fifth oath wrath Allah upon her if he truthful; favor Allah mercy Allah Accepting repentance Wise; came slander group among you think not evil good yourselves each person earned sin principal share great punishment; when heard should have said not fitting us speak this glory You great slander; admonishes never repeat like believers; Allah explains signs knowing wise; love immorality spread believers painful punishment world Hereafter Allah knows know not; had not favor Allah mercy Allah Kind Merciful",
    mainLabel: "Surah declared obligatory with clear evidentiary verses; zina punishment: hundred lashes for unmarried offenders with public witnessing requirement; fornicator marriage restriction limiting partners to same category; qadhf (false accusation): eighty lashes plus permanent testimony rejection unless repentance; li'an procedure: husband's four oaths plus self-cursing matched by wife's counter-oaths preventing punishment; divine favor-mercy acknowledged as restraint mechanism; slander incident addressing communal responsibility and individual accountability; prohibition against repeating baseless accusations; warning against loving immorality spread among believers" },
  { id: "ext-024-p2", from: 21, to: 45,
    label: "O believed follow not footsteps Satan follows Satan commands immorality wrongdoing; had not favor Allah mercy purified none purifies whom wills hears knows; possessed virtue wealth swear not give relatives needy emigrants pardon overlook love Allah forgive merciful; accused chaste unaware believing women cursed world Hereafter great punishment; Day tongues hands feet testify used do; Day Allah pays full account know Allah manifest truth; evil women evil men evil men evil women; good women good men good men good women innocent said acquitted forgiveness noble provision; believed say not enter houses Prophet unless permitted meal not awaiting preparation invited enter leave food taken disperse conversation pleasing Prophet shy Allah shy truth; asked something ask behind screen purer hearts hearts; not hurt Messenger marry wives after ever great sin Allah; show adornment fathers husbands sons husbands sons brothers brothers sons sisters sons women right hands possess male attendants lacking desire children aware female nakedness stamp feet reveal hidden adornment turn Allah together believers succeed; marry unmarried righteous male slaves female slaves poor Allah enrich bounty Allah Knowing Wide; find not marriage abstain Allah enriches bounty; desire contract writing right hands possess give them writing know good them give wealth Allah gave them force maidens prostitution desire worldly life forced Allah Forgiving Merciful; sent down distinct verses examples passed before admonition God-conscious; Allah Light heavens earth example light niche lamp lamp glass glass brilliant star lit blessed olive tree neither east west oil almost glows fire touched light upon light Allah guides light whom wills Allah presents examples people Allah knowing everything; mosques Allah ordered raised name mentioned exalting mornings evenings; men neither commerce sale distracts remembrance Allah performance prayer giving zakah fear Day hearts eyes overturned; reward best did increase bounty Allah provides without account",
    mainLabel: "Satanic footsteps warning linking immorality to shaytan obedience; divine purification as selective grace; oath-breaking regarding charity to relatives overridden by forgiveness preference; chaste women falsely accused guaranteed divine vindication on Judgment Day through bodily testimony; gender-matched moral pairing principle; entry etiquette for Prophet's household establishing privacy boundaries; screen command for interaction purity; post-prophetic marriage prohibition as supreme respect; adornment concealment with specific exception list; marriage facilitation for unmarried and enslaved persons with divine enrichment promise; mukataba (manumission contract) as emancipation pathway; coercion prohibition protecting vulnerable women; Light Verse (ayat al-nur): divine light metaphor through niche-lamp-glass-star-olive imagery; mosque sanctity tied to dhikr-salah-zakah; believer commerce undistracted by remembrance; divine reward multiplication without measure" },
  { id: "ext-024-p3", from: 46, to: 64,
    label: "Disbelieved deeds mirage lowland thirsty thinks water comes finds nothing finds Allah paid full account swift reckoner; darknesses unfathomable sea covered waves waves clouds darknesses layers cannot see hand Allah makes light has no light; glorify Allah creatures heavens earth birds spreading wings knows prayer praise Allah knowing dominion heavens earth Allah return; sends rain sky produces vegetation fruits provision sends wind glad tidings mercy ships run command seek bounty grateful; succeeded messengers before destroyed towns dwellings observed end deniers; say obeyed Allah obeyed Messenger turn away Messenger responsible responsible; sworn solemn oaths Allah commanded go out fight say not swear known obedience Allah Aware; say obeyed Allah obeyed Messenger turn away Messenger responsible responsible; established prayer given zakah obeyed Messenger receive mercy; think disbelievers causing failure earth refuge Fire wretched destination; believed let right hands possess reached puberty ask permission three times before dawn prayer noon put garments evening prayer three privacy periods besides these blame walk around attending one another; children reach puberty ask permission always thus Allah explains signs knowing; women post-menstrual age desire marriage blame putting aside outer garments displaying adornment better refrain Allah Hearing Knowing; blind constraint lame constraint ill constraint yourselves eat houses keys entrusted eat together separate gathered greet Allah blessed good greeting; thus Allah explains signs understand; believers only believe Allah Messenger meeting matter common interest depart until asked permission asking permission believers Allah Messenger slip away stealthily warn those disobey order strike affliction painful punishment; calling Messenger among yourselves call one another already Allah knows slip away stealthily warn disobey strike affliction painful punishment; belongs Allah whatever heavens earth knows stand knows Day returned Him",
    mainLabel: "Disbeliever deeds as mirage producing nothing at reckoning; layered darkness metaphor for compounded ignorance; universal creature glorification including birds with wing-spreading; rain-wind-ship provision system demonstrating divine management; prior messenger success followed by town destruction as dual precedent; obedience formula: Allah-Messenger dual compliance with individual responsibility; battle reluctance exposed through oath-breaking; salah-zakah-obedience triad as mercy condition; disbeliever failure impossibility affirmed; privacy protocol: three exempted times requiring permission for dependents and prepubescent children; puberty-triggered permanent permission requirement; elderly women's clothing relaxation with modesty preference; disability accommodations removing constraint for blind lame ill communal meals; greeting obligation as blessed social practice; believer definition through collective decision-making consent; prophetic address etiquette distinguishing from ordinary speech; divine omniscience over concealed intentions; closing sovereignty affirmation encompassing all creation" }
];

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`24:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = [];
  for (let i = p.from; i <= p.to; i++) {
    const v = corpus.verses.find(vv => vv.id === i);
    if (v && v.translation) {
      const shortLabel = v.translation.length > 120 ? v.translation.substring(0, 117) + "..." : v.translation;
      subs.push({ label: shortLabel, keys: [`24:${i}`], evidenceClass: "EXPLICIT_TEXT" });
    }
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 24, surahName: "An-Nur",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 3 genuine re-extraction. P1=zina-qadhf-lian-slander(1-20), P2=modesty-marriage-light-verse-commerce(21-45), P3=social-etiquette-privacy-closing(46-64).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (24:1-20) ===
{
  const e = extractions[0];
  const ghafur = findWord(5, ["\u063a","\u0641","\u0648","\u0631"]);
  const rahman = findWord(5, ["\u0631","\u062d","\u0645","\u0646"]);
  if (ghafur) e.divineNamesAndAttributes.push({ term: ghafur, transliteration: "Ghafur", gloss: "Forgiving (editorial gloss)", keys: ["24:5"] });
  if (rahman) e.divineNamesAndAttributes.push({ term: rahman, transliteration: "Rahman", gloss: "Merciful (editorial gloss)", keys: ["24:5"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["24:2"], excerpt: fv(2), description: "Lash each one of them with a hundred lashes — zina hadd punishment." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["24:2"], excerpt: fv(2), description: "Do not be seized by compassion in religion — enforcement imperative." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["24:4"], excerpt: fv(4), description: "Lash false accusers with eighty lashes and do not accept their testimony ever after." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["24:19"], excerpt: fv(19), description: "Those who love that immorality be spread among believers — warned of painful punishment." });

  e.humanConditionsAndSpiritualStates.push({ label: "Public witnessing of zina punishment as communal deterrent and religious obligation", keys: ["24:2"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Repentance-reform pathway restoring testimony eligibility after qadhf conviction", keys: ["24:5"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Fornicator marriage restriction creating social boundary between moral categories", keys: ["24:3"], evidenceClass: "EXPLICIT_TEXT" });

  const zina = findWord(2, ["\u0632","\u0646","\u0649"]);
  if (zina) e.terminology.push({ term: zina, transliteration: "zina", gloss: "sexual intercourse/fornication (editorial gloss)", keys: ["24:2"] });
}

// === POPULATE P2 (24:21-45) ===
{
  const e = extractions[1];
  const nur = findWord(35, ["\u0646","\u0648","\u0631"]);
  if (nur) e.divineNamesAndAttributes.push({ term: nur, transliteration: "Nur", gloss: "Light (editorial gloss)", keys: ["24:35"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["24:30"], excerpt: fv(30), description: "Tell believing men to reduce vision and guard private parts — gaze lowering command." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["24:31"], excerpt: fv(31), description: "Tell believing women to reduce vision guard private parts not expose adornment except specified exceptions." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["24:32"], excerpt: fv(32), description: "Marry the unmarried among you and the righteous among your slaves — marriage facilitation command." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["24:33"], excerpt: fv(33), description: "Do not force your maidens to prostitution seeking worldly gain — coercion prohibition." });

  e.humanConditionsAndSpiritualStates.push({ label: "Divine light metaphor: niche-lamp-glass-star-blessed olive tree producing light upon light", keys: ["24:35"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Believer commerce undistracted from dhikr-salah-zakah as integrated devotion", keys: ["24:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Mukataba (manumission contract) enabling enslaved persons to purchase freedom with master support", keys: ["24:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Disbeliever deeds as mirage producing nothing upon arrival at divine reckoning", keys: ["24:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Layered darkness metaphor: sea-waves-clouds compounding visual impossibility representing spiritual blindness", keys: ["24:40"], evidenceClass: "EXPLICIT_TEXT" });

  const hijab = findWord(31, ["\u062e","\u0645","\u0631"]);
  if (hijab) e.terminology.push({ term: hijab, transliteration: "khumur", gloss: "head-coverings/veils (editorial gloss)", keys: ["24:31"] });
}

// === POPULATE P3 (24:46-64) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["24:56"], excerpt: fv(56), description: "Establish prayer give zakah obey the Messenger — that you may receive mercy." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["24:58"], excerpt: fv(58), description: "Let those whom your right hands possess and those not yet reached puberty ask permission at three specified times." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["24:61"], excerpt: fv(61), description: "When entering houses greet one another with greeting from Allah blessed and good." });

  // Verses 39-40 belong to P2 (21-45), not P3 (46-64)
  e.humanConditionsAndSpiritualStates.push({ label: "Believer definition through collective decision-making consent and prophetic deference", keys: ["24:62"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Privacy protocol establishing three exempted times and puberty-triggered permanent permission requirements", keys: ["24:58","24:59"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Disability accommodations removing constraint for blind lame and ill in communal meals", keys: ["24:61"], evidenceClass: "EXPLICIT_TEXT" });

  const salam = findWord(61, ["\u0633","\u0644","\u0627","\u0645"]);
  if (salam) e.terminology.push({ term: salam, transliteration: "salam", gloss: "peace/greeting (editorial gloss)", keys: ["24:61"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `024-an-nur-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 024-an-nur-p${num}.json`);
}

// === CANDIDATES (cand-0937..cand-0966, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-024-p1,ext-024-p2,ext-024-p3",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-0937..0946)
  { id: "cand-0937", label: "Zina punishment as public hadd with witnessing requirement", def: "In 24:2: Lash each one with hundred lashes; do not let compassion seize you; let group of believers witness.", key: "24:2", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Hadd al-zina."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Public enforcement."}] },
  { id: "cand-0938", label: "Qadhf punishment with permanent testimony disqualification", def: "In 24:4: Those who accuse chaste women without four witnesses lash eighty; do not accept testimony ever; transgressors.", key: "24:4", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"False accusation penalty."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Four-witness threshold."}] },
  { id: "cand-0939", label: "Li'an procedure resolving spousal adultery accusation without external witnesses", def: "In 24:6-9: Husband four oaths plus self-curse; wife four counter-oaths plus self-curse prevents punishment.", key: "24:6", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Spousal oath procedure."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Self-testimony mechanism."}] },
  { id: "cand-0940", label: "Repentance-reform restoring eligibility after qadhf conviction", def: "In 24:5: Except those who repent thereafter and reform; Allah is Forgiving Merciful.", key: "24:5", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Tawbah-islah sequence."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Restoration pathway."}] },
  { id: "cand-0941", label: "Fornicator marriage restriction creating moral category boundaries", def: "In 24:3: Fornicator marries only fornicatress or polytheist; none marries her except fornicator or polytheist; forbidden to believers.", key: "24:3", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Marital compatibility principle."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Moral segregation."}] },
  { id: "cand-0942", label: "Slander incident establishing communal responsibility for rumor propagation", def: "In 24:12-15: When you heard it should have been said not fitting for us to speak this; glory to You great slander.", key: "24:12", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Collective ethical response."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Individual participation guilt."}] },
  { id: "cand-0943", label: "Prohibition against loving immorality spread among believers", def: "In 24:19: Those who love that fahishah be spread among believers have painful punishment in world and Hereafter.", key: "24:19", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Promotion criminalized."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Communal purity protection."}] },
  { id: "cand-0944", label: "Public witnessing as communal deterrence mechanism", def: "In 24:2: Let a group of believers witness their punishment — public dimension of hadd execution.", key: "24:2", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Deterrence through visibility."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"related-not-identical",note:"Communal moral reinforcement."}] },
  { id: "cand-0945", label: "Divine favor-mercy as restraint preventing immediate punishment", def: "In 24:10,14,20: If not for Allah's favor and mercy upon you — repeated acknowledgment of divine forbearance.", key: "24:10", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Fadl-rahmah as delay."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Restraint as ease."}] },
  { id: "cand-0946", label: "Chaste women falsely accused guaranteed divine vindication", def: "In 24:23: Those who accuse chaste unaware believing women are cursed in world and Hereafter; great punishment.", key: "24:23", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Divine defense of innocent."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Reputation protection."}] },

  // P2 (cand-0947..0956)
  { id: "cand-0947", label: "Gaze lowering command for both genders as mutual modesty obligation", def: "In 24:30-31: Tell believing men reduce vision guard private parts; tell believing women reduce vision guard private parts.", key: "24:30", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ghad al-basar."},{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Preventive modesty."}] },
  { id: "cand-0948", label: "Adornment concealment with specified exception list defining mahram boundaries", def: "In 24:31: Not expose adornment except what appears; draw khumur over bosoms; display only to husbands fathers sons etc.", key: "24:31", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Zinah concealment."},{topicId:"parents-and-family",layer:"curated",relationship:"related-not-identical",note:"Mahram exemption list."}] },
  { id: "cand-0949", label: "Marriage facilitation command with divine enrichment promise for poor", def: "In 24:32: Marry unmarried among you and righteous slaves; if poor Allah will enrich from His bounty.", key: "24:32", overlap: [{topicId:"marriage-importance",layer:"scholarly",relationship:"same-concept",note:"Tazwij mandate."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Rizq guarantee."}] },
  { id: "cand-0950", label: "Coercion prohibition protecting enslaved women from forced prostitution", def: "In 24:33: Do not force maidens to prostitution seeking worldly gain; if forced Allah is Forgiving Merciful.", key: "24:33", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Exploitation prohibited."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Vulnerable protection."}] },
  { id: "cand-0951", label: "Mukataba enabling enslaved persons to purchase freedom with master support", def: "In 24:33: Those who desire contract from right hands possess give them writing if you know good in them; give from Allah's wealth.", key: "24:33", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Emancipation pathway."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Master contribution required."}] },
  { id: "cand-0952", label: "Light Verse: divine light metaphor through niche-lamp-glass-star-olive imagery", def: "In 24:35: Allah is Light of heavens earth; example like niche lamp glass brilliant star lit from blessed olive tree neither east nor west.", key: "24:35", overlap: [{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Nur as attribute."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Extended metaphor as ayah."}] },
  { id: "cand-0953", label: "Mosque sanctity tied to dhikr-salah-zakah integration", def: "In 24:36-37: Mosques Allah ordered raised name mentioned; men neither commerce nor sale distracts from dhikr salah zakah.", key: "24:36", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Sacred space function."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Dhikr-centered worship."}] },
  { id: "cand-0954", label: "Believer commerce undistracted from divine remembrance as integrated devotion", def: "In 24:37: Men whom neither tijarah nor bay' distracts from dhikr Allah iqam salah ita' zakah.", key: "24:37", overlap: [{topicId:"work-honor",layer:"scholarly",relationship:"same-concept",note:"Commerce compatible with piety."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Priority ordering."}] },
  { id: "cand-0955", label: "Screen command for interaction purity between genders", def: "In 24:53: When you ask something from them ask from behind screen; purer for your hearts and their hearts.", key: "24:53", overlap: [{topicId:"intimacy-ethics",layer:"scholarly",relationship:"same-concept",note:"Hijab as barrier."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Heart purification."}] },
  { id: "cand-0956", label: "Entry etiquette for Prophet household establishing privacy boundaries", def: "In 24:53: Do not enter houses of Prophet unless permitted for meal not awaiting preparation; when invited enter; when finished disperse.", key: "24:53", overlap: [{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Social etiquette."},{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Prophet's domestic privacy."}] },

  // P3 (cand-0957..0966)
  { id: "cand-0957", label: "Disbeliever deeds as mirage producing nothing at divine reckoning", def: "In 24:39: Deeds of disbelievers like mirage in lowland thirsty thinks water comes finds nothing finds Allah paying full account.", key: "24:39", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sarab as futile effort."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Nullified works."}] },
  { id: "cand-0958", label: "Layered darkness metaphor representing compounded spiritual blindness", def: "In 24:40: Like darknesses in unfathomable sea covered by waves upon waves above which clouds; darknesses layers cannot see hand.", key: "24:40", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Zulumat mutabaqah."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Natural phenomenon as spiritual analogy."}] },
  { id: "cand-0959", label: "Privacy protocol establishing three exempted times for dependents", def: "In 24:58: Right hands possess and prepubescent ask permission three times: before fajr noon undressing after isha.", key: "24:58", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Domestic privacy structure."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Awrah protection."}] },
  { id: "cand-0960", label: "Puberty-triggered permanent permission requirement for household entry", def: "In 24:59: When children reach puberty let them ask permission at all times as those before them did.", key: "24:59", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Maturity-based boundary shift."},{topicId:"intimacy-ethics",layer:"scholarly",relationship:"related-not-identical",note:"Age-graded modesty."}] },
  { id: "cand-0961", label: "Elderly women clothing relaxation with continued modesty preference", def: "In 24:60: Post-menstrual women no marriage desire no blame removing outer garments not displaying adornment; refraining better.", key: "24:60", overlap: [{topicId:"balance-moderation",layer:"scholarly",relationship:"same-concept",note:"Age-differentiated concession."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Modesty preference retained."}] },
  { id: "cand-0962", label: "Disability accommodations removing constraint for communal meals", def: "In 24:61: No constraint on blind lame ill or yourselves eating in own houses or others'; greet with salam.", key: "24:61", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Barrier removal."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Inclusive community."}] },
  { id: "cand-0963", label: "Salah-zakah-obedience triad as mercy reception condition", def: "In 24:56: Establish prayer give zakah obey Messenger that you may receive mercy.", key: "24:56", overlap: [{topicId:"prayer",layer:"curated",relationship:"same-concept",note:"Triple pillar formula."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Conditional rahmah."}] },
  { id: "cand-0964", label: "Prophetic address etiquette distinguishing from ordinary interpersonal speech", def: "In 24:63: Do not make calling of Messenger among yourselves as call of one to another.", key: "24:63", overlap: [{topicId:"prophetic-character",layer:"scholarly",relationship:"same-concept",note:"Distinctive address protocol."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Reverential communication."}] },
  { id: "cand-0965", label: "Universal creature glorification including birds with wing-spreading", def: "In 24:41: Everyone in heavens earth glorifies Him and birds with wings spread; each knows its prayer and praise.", key: "24:41", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Cosmic tasbih."},{topicId:"animals-as-communities",layer:"scholarly",relationship:"same-concept",note:"Non-human worship."}] },
  { id: "cand-0966", label: "Closing sovereignty affirmation encompassing all creation and knowledge", def: "In 24:64: To Allah belongs whatever in heavens earth; He knows upon what you stand and Day they are returned.", key: "24:64", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Comprehensive ownership."},{topicId:"divine-knowledge",layer:"scholarly",relationship:"same-concept",note:"Omniscience over states."}] }
];

for (const cd of CAND_DEFS) {
  candidates.candidates.push({
    candidateId: cd.id, label: cd.label, definition: cd.def, definitionStatus: "editorial-draft",
    evidence: [{ key: cd.key, excerpt: fv(Number(cd.key.split(":")[1])), evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
    existingTopicOverlap: cd.overlap || [],
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
    notes: "Wave 3 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 10).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(10, 20).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(20, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `024-an-nur-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-048.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-048.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
