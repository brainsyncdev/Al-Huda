// MFD-11 Wave 6: Surah 42 (Ash-Shura) genuine re-extraction.
// Covers 42:1-53 in 4 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "042-0001-0053.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 42:${n} not found`);
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

console.log("Generating Surah 42 (Ash-Shura) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T15:40:00.000Z";

const PASSAGES = [
  { id: "ext-042-p1", from: 1, to: 12,
    label: "Ha-Meem Ayn-Seen-Qaf; thus revealed to you and to those before you by the Mighty Wise; His is whatever is in heavens and earth, Most High Most Great; heavens almost break from above while angels exalt with praise and seek forgiveness for those on earth, He Forgiving Merciful; those taking allies besides Him have Allah as Guardian and the Prophet is not a manager over them; an Arabic Quran revealed to warn the Mother of Cities and those around it and warn of the Day of Assembly with one party in Paradise and one in the Blaze; had He willed He could have made them one religion but admits whom He wills into mercy while wrongdoers have no protector or helper; Allah alone is Protector giving life to the dead, competent over all; ruling in any disagreement referred to Allah with reliance and turning back; Creator of heavens and earth making mates from yourselves and among cattle, multiplying thereby, nothing like unto Him, Hearing Seeing; keys of heavens and earth His, provision extended and restricted, Knowing of all",
    mainLabel: "The double letter-opening followed by the disclosure that the same revelation given to Muhammad was given to those before him by the Mighty Wise; cosmic ownership paired with loftiness and greatness; the heavens nearly breaking while angels praise and seek forgiveness for earth-dwellers, framed by forgiveness and mercy; rival-alliance takers left under divine guardianship with prophetic managership denied; the Arabic Quran commissioned to warn the Mother of Cities and its surroundings of the undoubted Day of Assembly dividing humanity between Paradise and Blaze; unity of religion possible by will yet mercy admitted selectively while wrongdoers lack protector and helper; exclusive protectorship proved by giving life to the dead; every dispute referred to Allah with reliance and return; creation of the cosmos and of human and cattle mates enabling multiplication, sealed by the negation of any likeness and by hearing and sight; the keys of the cosmos and the extension and restriction of provision under complete knowledge" },
  { id: "ext-042-p2", from: 13, to: 26,
    label: "Religion ordained as enjoined upon Nuh, revealed to Muhammad, and enjoined upon Ibrahim, Musa and Isa: establish the religion and do not be divided therein; difficult for associators, Allah chooses for Himself whom He wills and guides whoever turns back; division came only after knowledge out of jealous animosity, deferred by a preceding word to a specified time, later Scripture-inheritors in disquieting doubt; invite to that and remain on a right course as commanded, do not follow their inclinations, believe what was revealed and do justice among them, our Lord and your Lord, for us our deeds and for you yours, no argument, Allah gathers and to Him the destination; arguing after response invalid with wrath and severe punishment; Book sent in truth with the balance, perhaps the Hour is near; non-believers impatient for it while believers fearful knowing it true, disputers in extreme error; Subtle with servants providing whom He wills, Powerful Mighty; harvest of the Hereafter increased while worldly harvest given without share hereafter; deities ordaining unconsented religion, decisive word deferring conclusion, painful punishment; wrongdoers fearful of earnings which befall them while believing doers in lush garden regions having whatever they will as great bounty; good tidings to believing doers, no payment asked but good will through kinship, good deed increased, Forgiving Appreciative; the lie-invention accusation answered by possible heart-sealing, falsehood eliminated and truth established by His words, Knowing of breasts; accepts repentance and pardons misdeeds knowing deeds; answers believing doers increasing bounty while disbelievers face severe punishment",
    mainLabel: "One religion legislated across Nuh, Ibrahim, Musa, Isa and Muhammad with the twin charge to establish it and refuse division; the difficulty this poses to associators answered by divine selection and guidance for whoever turns back; division traced to jealous animosity arising only after knowledge, its penalty deferred by a preceding word while later Scripture-inheritors remain in disquieting doubt; the commission to invite, hold the commanded straight course, refuse their inclinations, affirm revealed belief and practise justice, with shared lordship, separated deeds, no argument and a gathering at the final destination; post-response disputation declared invalid with wrath and severe punishment; the Book sent with the balance and the possible nearness of the Hour; impatience among deniers against fear among believers who know its truth; subtlety in provision under power and might; the two harvests with increase for the Hereafter-seeker and no hereafter-share for the world-seeker; unconsented religious legislation by rival deities deferred by the decisive word; wrongdoers' fear realised against believing doers in lush gardens with whatever they will; glad tidings with no wage sought save kinship goodwill, increase for good deeds, acceptance of repentance, pardon of misdeeds, and answered supplication with added bounty" },
  { id: "ext-042-p3", from: 27, to: 35,
    label: "Excessive provision would cause tyranny throughout the earth so it is sent down in a willed amount, He Acquainted and Seeing of His servants; rain sent after despair spreading mercy, Protector Praiseworthy; sign in the creation of heavens and earth and the creatures dispersed through them with competence to gather when He wills; whatever disaster strikes is for what hands earned though He pardons much; no causing failure upon the earth and no protector or helper besides Allah; sign in ships at sea like mountains; wind stilled by will leaving them motionless as signs for every patient grateful one; or destroyed for what they earned though He pardons much; disputers over the signs to know there is no place of escape",
    mainLabel: "Provision deliberately measured because excess would produce tyranny across the earth, dispensed by one acquainted with and seeing His servants; rain arriving after despair as spread mercy from the Protector Praiseworthy; the creation of the cosmos and the creatures dispersed within it named as a sign with competence to regather at will; disaster attributed to what hands earned while much is pardoned; inability to cause failure and absence of any protector or helper besides Him; mountain-like ships at sea named as a sign whose stilling by wind-withholding yields signs for the patient and grateful, and whose destruction for earned deeds is likewise tempered by pardon; the whole framed so that disputers over the signs learn there is no place of escape" },
  { id: "ext-042-p4", from: 36, to: 53,
    label: "Whatever is given is enjoyment of worldly life while what is with Allah is better and more lasting for believers who rely on their Lord; those avoiding major sins and immoralities and forgiving when angry; those responding to their Lord, establishing prayer, whose affair is consultation among themselves, spending from provision; those defending themselves when tyranny strikes; retribution for evil is an evil like it but pardon and reconciliation carry reward from Allah who does not like wrongdoers; avenging after being wronged incurs no blame; blame lies on those wronging people and tyrannising without right facing painful punishment; patience and forgiveness are matters requiring determination; whom Allah sends astray has no protector beyond Him, wrongdoers asking for a way of return on seeing punishment; exposed to the Fire humbled from humiliation with covert glances while believers name the true losers as those losing themselves and families, wrongdoers in enduring punishment; no allies aiding besides Allah and no way for whom He sends astray; respond before an unrepellable Day with no refuge and no denial; if they turn away he is not a guardian, only notification, man rejoicing at mercy and ungrateful when evil afflicts for what hands put forth; dominion of heavens and earth His, creating what He wills, giving females or males or both and rendering barren whom He wills, Knowing Competent; no human spoken to except by revelation, from behind a partition, or by a sent messenger revealing by permission, Most High Wise; thus an inspiration of Our command revealed, he knew neither Book nor faith but it was made a light guiding whom He wills, guiding to a straight path, the path of Allah owning all in heavens and earth, to Him all matters evolve",
    mainLabel: "Worldly gifts reduced to temporary enjoyment against the better and more lasting divine portion for relying believers; the communal profile of avoiding major sins and immoralities, forgiving in anger, responding to the Lord, establishing prayer, deciding affairs by consultation, spending from provision, and defending against tyranny; proportionate retribution permitted alongside pardon and reconciliation whose reward rests with Allah who dislikes wrongdoers; self-avenging after wrong cleared of blame while blame falls on those wronging people and tyrannising without right; patience and forgiveness named as matters of determination; abandonment leaving no protector and the wrongdoers' plea for return at the sight of punishment; humiliation and covert glances at the Fire with believers naming the true loss as self and family; no aiding allies and no way for the abandoned; the call to respond before an unrepellable Day without refuge or denial; notification-only commission against human ingratitude after mercy; sovereign disposal of offspring as female, male, both or barren under knowledge and competence; the three exclusive modes of divine address to a human; the revealed inspiration made a light where neither Book nor faith was previously known, guiding to the straight path of the Owner of all, to whom every matter finally evolves" }
];

const SUB_LABELS = {
  "ext-042-p1": [
    "Ash-Shura opens with the Ha-Meem pair that heads this surah group",
    "A second letter-group unique to this surah, Ayn-Seen-Qaf",
    "The manner of revelation to Muhammad declared identical to that given to those before him by the Mighty Wise",
    "Ownership of all in heavens and earth affirmed with loftiness and greatness",
    "The heavens nearly breaking from above while angels praise and seek forgiveness for those on earth, with forgiveness and mercy affirmed",
    "Rival-alliance takers left under divine guardianship while prophetic managership over them is denied",
    "An Arabic Quran revealed to warn the Mother of Cities and its surroundings of the Day of Assembly dividing Paradise and Blaze",
    "Unity of religion possible by will, yet mercy admitted selectively while wrongdoers lack protector and helper",
    "Exclusive protectorship asserted with the giving of life to the dead and competence over all things",
    "Every disagreement referred to Allah's ruling, with reliance upon Him and turning back to Him declared",
    "Creation of heavens and earth with human and cattle mates enabling multiplication, sealed by the negation of likeness and by hearing and sight",
    "The keys of heavens and earth belonging to Him, provision extended and restricted under complete knowledge"
  ],
  "ext-042-p2": [
    "One religion ordained across Nuh, Ibrahim, Musa, Isa and Muhammad with the charge to establish it and refuse division, difficult for associators, with selection and guidance for whoever turns back",
    "Division arising only after knowledge out of jealous animosity, deferred by a preceding word to a specified time, later Scripture-inheritors left in disquieting doubt",
    "The commission to invite, hold the commanded straight course, refuse inclinations, affirm revealed belief and do justice, with shared lordship, separated deeds, no argument and a gathering at the destination",
    "Argument concerning Allah after He has been responded to declared invalid, carrying wrath and severe punishment",
    "The Book sent down in truth together with the balance, with the possible nearness of the Hour raised",
    "Deniers impatient for the Hour while believers fear it knowing it true, and its disputers placed in extreme error",
    "Subtlety toward servants in granting provision to whom He wills, with power and might affirmed",
    "Increase granted to the seeker of the Hereafter's harvest while the world-seeker receives his portion without any hereafter-share",
    "Rival deities ordaining a religion Allah has not consented to, conclusion deferred by the decisive word, with painful punishment for wrongdoers",
    "Wrongdoers fearful of earnings that will befall them against believing doers in lush garden regions with whatever they will as the great bounty",
    "Glad tidings to believing doers with no payment sought save kinship goodwill, increase for good deeds, and forgiveness with appreciation",
    "The lie-invention accusation answered by possible heart-sealing, with falsehood eliminated and truth established by His words and knowledge of breasts",
    "Acceptance of repentance from servants and pardon of misdeeds alongside knowledge of what they do",
    "Answered supplication of believing doers with increase from bounty, against severe punishment for disbelievers"
  ],
  "ext-042-p3": [
    "Excessive provision withheld because it would produce tyranny across the earth, sent instead in a willed amount by one acquainted and seeing",
    "Rain sent down after despair as spread mercy from the Protector Praiseworthy",
    "Creation of heavens and earth with creatures dispersed through them named as a sign, with competence to gather them at will",
    "Disaster attributed to what hands have earned while much is pardoned",
    "Inability to cause failure upon the earth and absence of any protector or helper besides Allah",
    "Ships at sea like mountains named among His signs",
    "Wind stilled by will leaving ships motionless, yielding signs for every patient and grateful person",
    "Alternative destruction for what they earned, again tempered by abundant pardon",
    "The purpose stated so that disputers over the signs know there is no place of escape"
  ],
  "ext-042-p4": [
    "Worldly gifts named temporary enjoyment against the better and more lasting portion with Allah for relying believers",
    "Avoidance of major sins and immoralities joined to forgiveness when angry",
    "Response to the Lord, establishment of prayer, affairs decided by consultation, and spending from provision",
    "Self-defence when tyranny strikes them",
    "Retribution proportionate to the evil act, with pardon and reconciliation carrying reward from Allah who does not like wrongdoers",
    "Self-avenging after being wronged declared free of blame",
    "Blame assigned to those who wrong people and tyrannise without right, facing painful punishment",
    "Patience and forgiveness named among the matters requiring determination",
    "Abandonment leaving no protector beyond Him, with wrongdoers asking for a way of return upon seeing punishment",
    "Exposure to the Fire in humiliation with covert glances, while believers name the true losers as those losing themselves and their families amid enduring punishment",
    "No allies to aid besides Allah and no way for whom He sends astray",
    "The call to respond before an unrepellable Day offering neither refuge nor denial",
    "Notification-only commission if they turn away, with man rejoicing at mercy yet ungrateful when evil afflicts for what his hands put forth",
    "Dominion of heavens and earth with creation by will, granting female offspring to whom He wills and males to whom He wills",
    "Granting both sexes together or rendering barren by will, under knowledge and competence",
    "Divine address to a human restricted to revelation, speech from behind a partition, or a sent messenger revealing by permission",
    "The revealed inspiration of His command made a light where neither Book nor faith was known, guiding whom He wills to a straight path",
    "That path identified as Allah's, owning all in heavens and earth, with every matter evolving to Him"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`42:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`42:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 42, surahName: "Ash-Shura",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 6 genuine re-extraction. Boundaries follow the text: P1 closes with the keys-and-provision affirmation (12) before the shared-religion ordinance opens (13); P2 ends with answered supplication and bounty (26); P3 is the measured-provision, rain, creature and ship sign block ending with the no-escape notice (27-35); P4 begins with the worldly-versus-lasting contrast and runs through the consultative community profile, retribution ethics, judgement scenes and the modes of revelation to the closing evolution of all matters (36-53).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (42:1-12) ===
{
  const e = extractions[0];
  const aziz = findWord(3, ["\u0639","\u0632","\u064a","\u0632"]);
  const hakeem = findWord(3, ["\u062d","\u0643","\u064a","\u0645"]);
  const ali = findWord(4, ["\u0639","\u0644","\u064a"]);
  const azeem = findWord(4, ["\u0639","\u0638","\u064a","\u0645"]);
  const ghafoor = findWord(5, ["\u063a","\u0641","\u0648","\u0631"]);
  const raheem = findWord(5, ["\u0631","\u062d","\u064a","\u0645"]);
  const samee = findWord(11, ["\u0633","\u0645","\u064a","\u0639"]);
  const baseer = findWord(11, ["\u0628","\u0635","\u064a","\u0631"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["42:3"] });
  if (hakeem) e.divineNamesAndAttributes.push({ term: hakeem, transliteration: "Hakeem", gloss: "Wise (editorial gloss)", keys: ["42:3"] });
  if (ali) e.divineNamesAndAttributes.push({ term: ali, transliteration: "Ali", gloss: "Most High (editorial gloss)", keys: ["42:4"] });
  if (azeem) e.divineNamesAndAttributes.push({ term: azeem, transliteration: "Azeem", gloss: "Most Great (editorial gloss)", keys: ["42:4"] });
  if (ghafoor) e.divineNamesAndAttributes.push({ term: ghafoor, transliteration: "Ghafoor", gloss: "Forgiving (editorial gloss)", keys: ["42:5"] });
  if (raheem) e.divineNamesAndAttributes.push({ term: raheem, transliteration: "Raheem", gloss: "Merciful (editorial gloss)", keys: ["42:5"] });
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "Hearing (editorial gloss)", keys: ["42:11"] });
  if (baseer) e.divineNamesAndAttributes.push({ term: baseer, transliteration: "Baseer", gloss: "Seeing (editorial gloss)", keys: ["42:11"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Rival alliances taken while Allah remains Guardian over the takers", keys: ["42:6"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Humanity divided at the Day of Assembly between a party in Paradise and a party in the Blaze", keys: ["42:7"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Angels exalting with praise and seeking forgiveness for those on earth while the heavens nearly break", keys: ["42:5"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Nothing like unto Him, asserted immediately after the making of human and cattle mates", keys: ["42:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Every disputed matter referred to His ruling, with reliance and turning back declared", keys: ["42:10"], evidenceClass: "EXPLICIT_TEXT" });

  const umm = findWord(7, ["\u0623","\u0645"]);
  if (umm) e.terminology.push({ term: umm, transliteration: "umm al-qura", gloss: "Mother of Cities (editorial gloss)", keys: ["42:7"] });
}

// === POPULATE P2 (42:13-26) ===
{
  const e = extractions[1];
  const lateef = findWord(19, ["\u0644","\u0637","\u064a","\u0641"]);
  const qawi = findWord(19, ["\u0642","\u0648","\u064a"]);
  const shakoor = findWord(23, ["\u0634","\u0643","\u0648","\u0631"]);
  if (lateef) e.divineNamesAndAttributes.push({ term: lateef, transliteration: "Lateef", gloss: "Subtle (editorial gloss)", keys: ["42:19"] });
  if (qawi) e.divineNamesAndAttributes.push({ term: qawi, transliteration: "Qawi", gloss: "Powerful (editorial gloss)", keys: ["42:19"] });
  if (shakoor) e.divineNamesAndAttributes.push({ term: shakoor, transliteration: "Shakoor", gloss: "Appreciative (editorial gloss)", keys: ["42:23"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["42:13"], excerpt: fv(13), description: "Establish the religion and do not be divided therein — the ordinance shared across the named prophets." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["42:15"], excerpt: fv(15), description: "Invite to that, remain on a right course as commanded, and I have been commanded to do justice among you." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["42:15"], excerpt: fv(15), description: "Do not follow their inclinations." });

  e.propheticNarratives.push({ label: "Nuh, Ibrahim, Musa and Isa named alongside Muhammad as recipients of the same religious ordinance to establish religion and refuse division", keys: ["42:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Division arising only after knowledge came, driven by jealous animosity between them", keys: ["42:14"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Deniers impatient for the Hour while believers fear it knowing it to be the truth", keys: ["42:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wrongdoers fearful of what they earned while it will certainly befall them", keys: ["42:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Shared lordship with separated deeds and no argument, pending a gathering at the final destination", keys: ["42:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "The Book sent down in truth together with the balance", keys: ["42:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Two harvests contrasted: increase for the Hereafter-seeker and no hereafter-share for the world-seeker", keys: ["42:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Rival deities ordaining a religion to which Allah has not consented", keys: ["42:21"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "No payment sought for the message except good will through kinship", keys: ["42:23"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Selection for Himself and guidance to Himself for whoever turns back", keys: ["42:13"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Repentance accepted from servants and misdeeds pardoned alongside knowledge of their deeds", keys: ["42:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Supplication of believing doers answered with increase from His bounty", keys: ["42:26"], evidenceClass: "EXPLICIT_TEXT" });

  const baghy = findWord(14, ["\u0628","\u063a","\u064a"]);
  if (baghy) e.terminology.push({ term: baghy, transliteration: "baghy", gloss: "jealous animosity/transgression (editorial gloss)", keys: ["42:14"] });
  const mizan = findWord(17, ["\u0645","\u064a","\u0632","\u0646"]);
  if (mizan) e.terminology.push({ term: mizan, transliteration: "mizan", gloss: "balance (editorial gloss)", keys: ["42:17"] });
}

// === POPULATE P3 (42:27-35) ===
{
  const e = extractions[2];
  const khabir = findWord(27, ["\u062e","\u0628","\u064a","\u0631"]);
  const wali = findWord(28, ["\u0648","\u0644","\u064a"]);
  const hameed = findWord(28, ["\u062d","\u0645","\u064a","\u062f"]);
  if (khabir) e.divineNamesAndAttributes.push({ term: khabir, transliteration: "Khabir", gloss: "Acquainted (editorial gloss)", keys: ["42:27"] });
  if (wali) e.divineNamesAndAttributes.push({ term: wali, transliteration: "Wali", gloss: "Protector (editorial gloss)", keys: ["42:28"] });
  if (hameed) e.divineNamesAndAttributes.push({ term: hameed, transliteration: "Hameed", gloss: "Praiseworthy (editorial gloss)", keys: ["42:28"] });

  e.humanConditionsAndSpiritualStates.push({ label: "Despair preceding the arrival of rain and the spreading of mercy", keys: ["42:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Patience and gratitude named as the disposition that reads the stilled-ship sign", keys: ["42:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Provision deliberately measured because excessive extension would produce tyranny throughout the earth", keys: ["42:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Mountain-like ships at sea whose motion depends on wind that may be stilled by will", keys: ["42:32","42:33"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Disaster traced to what hands earned while much is pardoned", keys: ["42:30","42:34"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Creatures dispersed through heavens and earth with competence to gather them when He wills", keys: ["42:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No causing failure upon the earth and no protector or helper besides Him", keys: ["42:31"], evidenceClass: "EXPLICIT_TEXT" });

  const fulk = findWord(32, ["\u0641","\u0644","\u0643"]);
  if (fulk) e.terminology.push({ term: fulk, transliteration: "fulk", gloss: "ships (editorial gloss)", keys: ["42:32"] });
}

// === POPULATE P4 (42:36-53) ===
{
  const e = extractions[3];
  const aleem = findWord(50, ["\u0639","\u0644","\u064a","\u0645"]);
  const qadeer = findWord(50, ["\u0642","\u062f","\u064a","\u0631"]);
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["42:50"] });
  if (qadeer) e.divineNamesAndAttributes.push({ term: qadeer, transliteration: "Qadeer", gloss: "Competent (editorial gloss)", keys: ["42:50"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["42:38"], excerpt: fv(38), description: "Those who responded to their Lord, established prayer, whose affair is consultation among themselves, and who spend from what We provided." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["42:47"], excerpt: fv(47), description: "Respond to your Lord before a Day comes from Allah of which there is no repelling." });

  e.humanConditionsAndSpiritualStates.push({ label: "Avoidance of major sins and immoralities joined to forgiveness when angry", keys: ["42:37"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Patience and forgiveness named among the matters requiring determination", keys: ["42:43"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Wrongdoers asking whether any way of return exists once they see the punishment", keys: ["42:44"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Humiliation at exposure to the Fire with covert glances, while believers name the true loss as self and family", keys: ["42:45"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Rejoicing at mercy yet ingratitude when evil afflicts for what his own hands put forth", keys: ["42:48"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Affairs determined by consultation among the community alongside prayer and spending", keys: ["42:38"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Self-defence permitted when tyranny strikes", keys: ["42:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Retribution proportionate to the evil act, with pardon and reconciliation rewarded by Allah", keys: ["42:40"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Blame confined to those who wrong people and tyrannise upon the earth without right", keys: ["42:41","42:42"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Offspring disposed as female, male, both, or barren by divine will", keys: ["42:49","42:50"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "What is with Allah declared better and more lasting than worldly enjoyment for relying believers", keys: ["42:36"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine address to a human restricted to revelation, speech behind a partition, or a sent messenger by permission", keys: ["42:51"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Neither Book nor faith previously known, yet the inspiration made a light guiding whom He wills", keys: ["42:52"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "All matters evolving to Allah who owns whatever is in the heavens and on the earth", keys: ["42:53"], evidenceClass: "EXPLICIT_TEXT" });

  const shura = findWord(38, ["\u0634","\u0648","\u0631"]);
  if (shura) e.terminology.push({ term: shura, transliteration: "shura", gloss: "consultation (editorial gloss)", keys: ["42:38"] });
  const kabair = findWord(37, ["\u0643","\u0628","\u0627","\u0626","\u0631"]);
  if (kabair) e.terminology.push({ term: kabair, transliteration: "kaba'ir", gloss: "major sins (editorial gloss)", keys: ["42:37"] });
  const ruh = findWord(52, ["\u0631","\u0648","\u062d"]);
  if (ruh) e.terminology.push({ term: ruh, transliteration: "ruh", gloss: "inspiration of Our command (editorial gloss)", keys: ["42:52"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `042-ash-shura-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 042-ash-shura-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-042-p1,ext-042-p2,ext-042-p3,ext-042-p4",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1477", label: "One revelation-mode shared by Muhammad and the messengers before him", def: "In 42:3: Thus has He revealed to you and to those before you, Allah the Exalted in Might, the Wise.", key: "42:3", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Kadhalika yuhi continuity."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Shared channel across messengers."}] },
  { id: "cand-1478", label: "Angelic praise and forgiveness-seeking for earth-dwellers beneath straining heavens", def: "In 42:5: The heavens almost break from above them and the angels exalt with praise of their Lord and ask forgiveness for those on earth; unquestionably it is Allah who is the Forgiving, the Merciful.", key: "42:5", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Istighfar for those on earth."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ghafoor Raheem framing."}] },
  { id: "cand-1479", label: "Warning addressed to the Mother of Cities and its surroundings", def: "In 42:7: Thus We revealed to you an Arabic Quran that you may warn the Mother of Cities and those around it and warn of the Day of Assembly about which there is no doubt; a party in Paradise and a party in the Blaze.", key: "42:7", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Umm al-qura as warning centre."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Yawm al-jam' division."}] },
  { id: "cand-1480", label: "Referral of every disputed matter to divine ruling with reliance and return", def: "In 42:10: And in anything over which you disagree its ruling is to be referred to Allah; that is Allah my Lord, upon Him I have relied and to Him I turn back.", key: "42:10", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Hukm referred upward."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Tawakkul with inabah."}] },
  { id: "cand-1481", label: "Negation of any likeness to Him following the making of mates", def: "In 42:11: Creator of the heavens and the earth; He made for you from yourselves mates and among the cattle mates, multiplying you thereby; there is nothing like unto Him and He is the Hearing, the Seeing.", key: "42:11", overlap: [{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Laysa ka-mithlihi shay'."},{topicId:"human-creation",layer:"scholarly",relationship:"related-not-identical",note:"Azwaj as multiplication mechanism."}] },

  { id: "cand-1482", label: "One religion ordained across five named prophets with the charge to establish and not divide", def: "In 42:13: He has ordained for you of religion what He enjoined upon Noah and what We revealed to you and what We enjoined upon Abraham and Moses and Jesus, to establish the religion and not be divided therein; difficult for the associators is that to which you invite them; Allah chooses for Himself whom He wills and guides to Himself whoever turns back.", key: "42:13", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Shared shar' across named prophets."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Iqamat al-din without tafarruq."}] },
  { id: "cand-1483", label: "Division arising after knowledge out of jealous animosity", def: "In 42:14: They did not become divided until after knowledge had come to them, out of jealous animosity between themselves; and if not for a word that preceded from your Lord until a specified time it would have been concluded between them.", key: "42:14", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Baghy after ilm."},{topicId:"brotherhood-islam",layer:"scholarly",relationship:"same-concept",note:"Sectarian split diagnosed."}] },
  { id: "cand-1484", label: "Commanded straight course with justice, shared lordship and separated deeds", def: "In 42:15: So to that invite and remain on a right course as you are commanded and do not follow their inclinations but say I have believed in what Allah revealed and I have been commanded to do justice among you; Allah is our Lord and your Lord, for us our deeds and for you your deeds, there is no argument between us and you, Allah will bring us together and to Him is the destination.", key: "42:15", overlap: [{topicId:"dialogue-principles",layer:"scholarly",relationship:"same-concept",note:"La hujjah baynana wa-baynakum."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Umirtu li-a'dila baynakum."}] },
  { id: "cand-1485", label: "The Book sent in truth together with the balance", def: "In 42:17: It is Allah who has sent down the Book in truth and also the balance; and what will make you perceive, perhaps the Hour is near.", key: "42:17", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Kitab with mizan."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Balance as revealed measure."}] },
  { id: "cand-1486", label: "Two harvests contrasted with increase reserved for the Hereafter-seeker", def: "In 42:20: Whoever desires the harvest of the Hereafter, We increase for him in his harvest; and whoever desires the harvest of this world, We give him thereof but there is not for him in the Hereafter any share.", key: "42:20", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Harth al-akhirah prioritised."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Worldly portion without share."}] },
  { id: "cand-1487", label: "Repentance accepted and misdeeds pardoned with answered supplication and added bounty", def: "In 42:25-26: It is He who accepts repentance from His servants and pardons misdeeds and knows what you do; and He answers those who have believed and done righteous deeds and increases for them from His bounty.", key: "42:25", overlap: [{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Yaqbalu al-tawbah wa-ya'fu."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Yastajibu with ziyadah."}] },

  { id: "cand-1488", label: "Provision measured because excess would produce tyranny across the earth", def: "In 42:27: And if Allah had extended provision excessively for His servants they would have committed tyranny throughout the earth, but He sends it down in an amount which He wills; indeed He is of His servants Acquainted and Seeing.", key: "42:27", overlap: [{topicId:"divine-wisdom",layer:"scholarly",relationship:"same-concept",note:"Measured rizq preventing baghy."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Restriction as protective wisdom."}] },
  { id: "cand-1489", label: "Rain arriving after despair as the spreading of mercy", def: "In 42:28: And it is He who sends down the rain after they had despaired and spreads His mercy, and He is the Protector, the Praiseworthy.", key: "42:28", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Yanshuru rahmatahu after qunut."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Relief following despair."}] },
  { id: "cand-1490", label: "Disaster traced to earned deeds while much is pardoned", def: "In 42:30: And whatever strikes you of disaster, it is for what your hands have earned, but He pardons much.", key: "42:30", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Bima kasabat aydikum."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Ya'fu an kathir."}] },
  { id: "cand-1491", label: "Mountain-like ships and stillable wind as signs for the patient and grateful", def: "In 42:32-33: And of His signs are the ships in the sea like mountains; if He willed He could still the wind and they would remain motionless on its surface; indeed in that are signs for everyone patient and grateful.", key: "42:32", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Fulk kal-a'lam as ayah."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabbar shakur pairing."}] },

  { id: "cand-1492", label: "Lasting divine portion set against temporary worldly enjoyment", def: "In 42:36: So whatever thing you have been given, it is but enjoyment of the worldly life, but what is with Allah is better and more lasting for those who have believed and upon their Lord rely.", key: "42:36", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Khayrun wa-abqa."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Yatawakkalun as recipient trait."}] },
  { id: "cand-1493", label: "Consultation as the community's decision method alongside prayer and spending", def: "In 42:38: And those who have responded to their Lord and established prayer and whose affair is determined by consultation among themselves, and from what We have provided them they spend.", key: "42:38", overlap: [{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"Amruhum shura baynahum."},{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Infaq within the same profile."}] },
  { id: "cand-1494", label: "Proportionate retribution permitted while pardon and reconciliation carry divine reward", def: "In 42:40: And the retribution for an evil act is an evil one like it, but whoever pardons and makes reconciliation, his reward is due from Allah; indeed He does not like wrongdoers.", key: "42:40", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Jaza' sayyi'ah mithluha."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Afw and islah preferred."}] },
  { id: "cand-1495", label: "Blame confined to those who wrong people and tyrannise without right", def: "In 42:41-42: And whoever avenges himself after having been wronged, those have not upon them any cause for blame; the cause is only against the ones who wrong the people and tyrannise upon the earth without right.", key: "42:41", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Sabil only on the zalimun."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Legitimate redress distinguished."}] },
  { id: "cand-1496", label: "Three exclusive modes of divine address to a human being", def: "In 42:51: And it is not for any human being that Allah should speak to him except by revelation or from behind a partition or that He sends a messenger to reveal by His permission what He wills; indeed He is Most High and Wise.", key: "42:51", overlap: [{topicId:"quran-revelation-process",layer:"scholarly",relationship:"same-concept",note:"Wahy, hijab and rasul modes."},{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Limits of human reception."}] }
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
    notes: "Wave 6 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 5).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(5, 11).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(11, 15).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(15, 20).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `042-ash-shura-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-066.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-066.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
