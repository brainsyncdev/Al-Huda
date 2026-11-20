// MFD-11 Wave 6: Surah 40 (Ghafir) genuine re-extraction.
// Covers 40:1-85 in 5 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "040-0001-0085.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 40:${n} not found`);
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

console.log("Generating Surah 40 (Ghafir) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T15:30:00.000Z";

const PASSAGES = [
  { id: "ext-040-p1", from: 1, to: 22,
    label: "Ha-Meem; revelation from the Mighty Knowing, forgiver of sin, acceptor of repentance, severe in punishment, owner of abundance, no deity except Him and to Him the destination; only disbelievers dispute the signs so be not deceived by their movement in the land; Nuh's people and later factions denied and plotted to seize their messenger, disputing with falsehood, then seized; the word taking effect that they are companions of the Fire; Throne-bearers and those around it exalting, believing and seeking forgiveness for believers, asking admission to promised gardens with righteous fathers, spouses and offspring, and protection from evil consequences as mercy and great attainment; the disbelievers told His hatred exceeded their self-hatred when invited to faith; two deaths and two lives confessed with a plea for exit, answered by their disbelief at Allah alone and belief in associates, judgement resting with the Most High Grand; signs shown and provision sent down remembered only by the returning; sincere invocation despite dislike; degrees exalted, Owner of the Throne placing inspiration to warn of the Day of Meeting when nothing is concealed and sovereignty is His, One and Prevailing; every soul recompensed without injustice, swift in account; warning of the Approaching Day with hearts at throats and no friend or obeyed intercessor; knowledge of deceiving eyes and hidden breasts; truthful judgement against powerless objects; travel showing greater strength and impression ended by seizure for sins without protector; clear proofs disbelieved so He seized them",
    mainLabel: "Opening letters and the Book's origin in the Mighty Knowing, whose attributes join forgiveness of sin and acceptance of repentance to severity in punishment and abundance, with exclusive deity and destination; disputation restricted to disbelievers whose freedom of movement must not deceive; the denial-and-seizure pattern from Nuh through later factions who argued with falsehood; the effective word naming them Fire-companions; the Throne-bearing angels' praise, faith and intercessory supplication for believers and their righteous kin, framing protection from evil consequences as mercy and attainment; divine hatred exceeding their own self-hatred at the refused invitation; the confession after two deaths and two lives answered by their earlier rejection of Allah alone; signs and provision remembered only by the repentant; sincere invocation commanded despite dislike; the Throne-Owner dispensing inspiration to warn of the Day when all is exposed and sovereignty belongs to the One Prevailing; exact recompense without injustice; the Approaching Day's choking distress without friend or effective intercessor; knowledge of eye-deceit and concealed intent; travel evidence of stronger nations seized for sin after denying clear proofs" },
  { id: "ext-040-p2", from: 23, to: 37,
    label: "Musa sent with signs and clear authority to Pharaoh, Haman and Qarun who called him magician and liar; when he brought truth they ordered the sons of believers killed and women kept alive, but their plan was in error; Pharaoh proposing to kill Musa while fearing he would change their religion or cause corruption; Musa seeking refuge in his Lord and theirs from every arrogant one who disbelieves the Day of Account; a believing man of Pharaoh's family concealing his faith arguing against killing a man for saying my Lord is Allah while bringing clear proofs, noting the liar bears his lie and the truthful brings part of what he promises, and that transgressors and liars are unguided; his appeal that today's dominance cannot shield from divine punishment against Pharaoh's claim to show only what he sees and guide to right conduct; his fear of a day like the companies, the custom of Nuh, Aad, Thamud and those after, with Allah wanting no injustice; his fear of the Day of Calling when backs turn in flight without protector or guide; Yusuf's earlier clear proofs met with lasting doubt until his death and the claim no messenger would follow, thus transgressors and skeptics left astray; disputation without authority hated by Allah and believers, hearts of arrogant tyrants sealed; Pharaoh ordering Haman to build a tower to reach the ways of the heavens and look at Musa's deity while thinking him a liar, his evil deed made attractive and his plan ending in ruin",
    mainLabel: "Musa's commission with signs and clear authority to Pharaoh, Haman and Qarun, dismissed as magic and lying; the counter-order to kill believing sons while sparing women, itself declared errant; Pharaoh's proposal to kill Musa framed as protecting religion and public order; Musa's refuge-seeking in the shared Lord against arrogance that denies the Day of Account; the concealed believer of Pharaoh's household arguing from evidentiary fairness that a liar bears his own lie while a truthful warner's promise may strike them; his contrast between present dominance and inability to shield from punishment against Pharaoh's self-authorising guidance claim; his warning of a day like the companies repeating the custom of earlier nations, with divine intent excluding injustice; the Day of Calling with futile flight and no guide for the abandoned; Yusuf's prior proofs met with doubt and the post-mortem claim that no messenger would follow; disputation without authority drawing divine and believer hatred and sealing tyrant hearts; the tower project to inspect Musa's deity, its evil made attractive and its plan ruined" },
  { id: "ext-040-p3", from: 38, to: 50,
    label: "The believer urging his people to follow him to the way of right conduct; this worldly life only temporary enjoyment while the Hereafter is the home of settlement; evil recompensed by its like while righteous believers male or female enter Paradise with provision without account; his question why he invites to salvation while they invite to the Fire; their call to disbelief and association without knowledge against his call to the Mighty Perpetual Forgiver; the invoked objects answering no supplication in this world or the next, return being to Allah with transgressors as Fire-companions; his notice that they will remember his words and his entrusting his affair to Allah who sees His servants; Allah protecting him from their plotted evils while Pharaoh's people were enveloped by the worst punishment; the Fire shown morning and evening with the order at the Hour to enter them into the severest punishment; their argument in the Fire where the weak ask the arrogant to relieve a share, answered that all are in it and Allah has judged; their request to Hell's keepers to supplicate for one day's relief, met by the question about messengers with clear proofs and the reply to supplicate themselves since disbelievers' supplication is only in error",
    mainLabel: "The believer's invitation to right conduct set against Pharaoh's claim; worldly life reduced to temporary enjoyment against the Hereafter as permanent settlement; exact recompense for evil with unaccounted provision for righteous believers of either sex; the mutual-invitation paradox of salvation against Fire; association without knowledge contrasted with the call to the Mighty Perpetual Forgiver; the impotence of invoked objects to answer any supplication in either realm; his forecast of their remembrance and his entrustment of the affair to the Seeing Lord; divine protection of him and enveloping punishment of Pharaoh's household; morning-and-evening exposure to the Fire before the severest entry at the Hour; the internal quarrel where followers seek relief from leaders who admit shared confinement under divine judgement; the keepers' refusal redirecting supplication back to those who already received clear proofs" },
  { id: "ext-040-p4", from: 51, to: 68,
    label: "Support promised to messengers and believers in worldly life and on the Day witnesses stand, when excuses fail and curse and worst home fall to wrongdoers; Musa given guidance and the Children of Israel made to inherit the Scripture as guidance and reminder for the understanding; patience commanded with the truth of the promise, forgiveness sought for sin and praise exalted evening and morning; disputation without authority rooted in unreachable pride, refuge sought in the Hearing Seeing; creation of heavens and earth greater than creating mankind though most do not know; blind and seeing unequal, as are believing doers of good and evildoers, little remembrance; the Hour coming without doubt though most disbelieve; the call to invoke Him with the promise of response and contemptible Hell for those disdaining worship; night made for rest and day for sight with bounty most do not thank; Creator of all things with no deity except Him, delusion challenged; prior deniers likewise deluded; earth made a settlement and sky a ceiling, forms perfected and good things provided, blessed Lord of the worlds; Ever-Living with sincere invocation and praise; forbidden to worship their objects after clear proofs and commanded to submit; creation from dust, sperm-drop, clinging clot, childhood, maturity and old age with some taken earlier to a specified term so they may reason; giver of life and death decreeing by Be and it is",
    mainLabel: "Guaranteed support for messengers and believers in both realms, with failed excuses, curse and worst home for wrongdoers at the standing of witnesses; Musa's guidance and Israelite inheritance of Scripture as guidance and reminder; patience anchored in the true promise alongside istighfar and timed tasbih; disputation traced to unreachable pride answered by refuge in the Hearing Seeing; the greater creation of the cosmos set against human creation; inequality of blind and seeing and of believing doers versus evildoers amid scant remembrance; the undoubted Hour disbelieved by most; the invitation-response promise with contempt for those disdaining worship; night-rest and day-sight as bounty met by ingratitude; universal creation and exclusive deity challenging delusion; earth as settlement, sky as ceiling, perfected forms and good provision prompting blessing; the Ever-Living invoked sincerely with praise; prohibition of rival worship after clear proofs and the command to submit; the staged human lifecycle to an appointed term inviting reasoning; life, death and the instantaneous decree" },
  { id: "ext-040-p5", from: 69, to: 85,
    label: "Consideration of those disputing the signs and how they are averted; deniers of the Book and the messengers' message will know when shackles and chains drag them through boiling water into the Fire; asked where their associates are, they answer that these departed and that they previously invoked nothing, thus disbelievers led astray; told this was for exulting without right and insolence; eternal entry through Hell's gates as the wretched residence of the arrogant; patience with the true promise whether some promised punishment is shown or he is taken in death, since return is to Him; prior messengers related and unrelated, none bringing a sign except by permission, and when the command comes it is concluded in truth with falsifiers losing; grazing animals made for riding and eating with other benefits and needs fulfilled upon them and ships, carried on both; signs shown with the challenge which sign is denied; travel showing more numerous and stronger predecessors unavailing in earnings and impressions; rejoicing in their own knowledge when messengers brought proofs, then enveloped by what they ridiculed; belief declared only on seeing punishment, never benefiting once seen, as the established way of Allah among His servants, and the disbelievers losing",
    mainLabel: "The aversion of disputers examined; deniers of the Book and messengers dragged in shackles through boiling water into fire; the interrogation of vanished associates answered by the admission of invoking nothing, exposing misguidance; exultation without right and insolence named as causes of eternal entry into the arrogant's wretched residence; patience held to the true promise whether punishment is witnessed or death intervenes, since all return to Him; the related and unrelated prior messengers bound to permission for signs, with truthful conclusion and falsifier loss at the command; livestock for transport, food and further needs alongside ships as combined carriage; the challenge over which sign is denied; travel evidence of larger, stronger nations whose earnings did not avail; self-satisfied knowledge at the arrival of proofs followed by envelopment by the ridiculed; belief professed only at the sight of punishment declared ineffective under the established divine way, ending in loss" }
];

const SUB_LABELS = {
  "ext-040-p1": [
    "Opening disjointed letters Ha-Meem",
    "The Book's revelation traced to Allah, the Exalted in Might, the Knowing",
    "Attributes joining forgiveness of sin, acceptance of repentance, severity in punishment and abundance, with exclusive deity and destination",
    "Disputation over the signs restricted to disbelievers, with warning not to be deceived by their movement in the land",
    "Denial by Nuh's people and later factions, each plotting to seize its messenger and arguing with falsehood, followed by seizure",
    "The Lord's word taking effect upon disbelievers that they are companions of the Fire",
    "Throne-bearers and those around it exalting, believing, and seeking forgiveness for believers whose Lord encompassed all in mercy and knowledge",
    "Their plea for admission to promised gardens together with righteous fathers, spouses and offspring",
    "Their plea for protection from evil consequences, naming such protection mercy and the great attainment",
    "Disbelievers addressed that divine hatred exceeded their self-hatred when they refused the invitation to faith",
    "Their confession after two deaths and two lives, with the question whether any exit exists",
    "The answer citing disbelief when Allah alone was invoked and belief when others were associated, judgement resting with the Most High Grand",
    "Signs shown and provision sent from the sky, remembered only by one who turns back",
    "Command to invoke Allah sincerely in religion despite the disbelievers' dislike",
    "Exaltation above degrees and ownership of the Throne, placing inspiration by will to warn of the Day of Meeting",
    "The Day when nothing is concealed and sovereignty is declared to belong to Allah, the One, the Prevailing",
    "Every soul recompensed for what it earned with no injustice, and swiftness of account affirmed",
    "Warning of the Approaching Day with hearts at throats and no devoted friend or obeyed intercessor for wrongdoers",
    "Knowledge of what deceives the eyes and what the breasts conceal",
    "Truthful divine judgement against invoked objects that judge nothing, with hearing and sight affirmed",
    "Travel showing predecessors greater in strength and impression seized for their sins without protector",
    "Their seizure explained by disbelief after messengers brought clear proofs, with power and severity affirmed"
  ],
  "ext-040-p2": [
    "Musa sent with signs and a clear authority",
    "His mission to Pharaoh, Haman and Qarun, who called him a magician and a liar",
    "Their order to kill the sons of believers and spare their women, with their plan declared errant",
    "Pharaoh's proposal to kill Musa, fearing he would change their religion or cause corruption",
    "Musa's seeking refuge in his Lord and theirs from every arrogant denier of the Day of Account",
    "The concealed believer of Pharaoh's family arguing against killing a man for declaring Allah his Lord while bringing proofs, weighing liar against truthful warner",
    "His appeal that present dominance cannot shield from divine punishment, against Pharaoh's claim to show only his own view and guide rightly",
    "His fear of a day like the day of the companies",
    "Comparison with the custom of Nuh, Aad, Thamud and later peoples, with divine intent excluding injustice",
    "His fear of the Day of Calling",
    "The Day of turning backs in flight without protector, and no guide for whom Allah leaves astray",
    "Yusuf's earlier clear proofs met with doubt until his death and the claim that no messenger would follow",
    "Disputation without authority hated by Allah and believers, with arrogant tyrant hearts sealed",
    "Pharaoh ordering Haman to build a tower to reach the ways of access",
    "The aim to reach the heavens and inspect Musa's deity while judging him a liar, his evil made attractive and his plan ruined"
  ],
  "ext-040-p3": [
    "The believer calling his people to follow him to the way of right conduct",
    "Worldly life described as temporary enjoyment against the Hereafter as the home of settlement",
    "Evil recompensed by its like, while righteous believers of either sex enter Paradise with unaccounted provision",
    "His question why he invites to salvation while they invite him to the Fire",
    "Their invitation to disbelief and association without knowledge against his call to the Mighty Perpetual Forgiver",
    "The invoked objects answering no supplication in either realm, with return to Allah and transgressors as Fire-companions",
    "His notice that they will remember his words and his entrusting the affair to Allah who sees His servants",
    "Divine protection from their plotted evils while Pharaoh's people were enveloped by the worst punishment",
    "Exposure to the Fire morning and evening, with the order at the Hour to enter them into the severest punishment",
    "Their argument in the Fire where the weak ask the arrogant to relieve a share of it",
    "The arrogant replying that all are in it and Allah has judged between the servants",
    "Their request to Hell's keepers for one day's relief",
    "The keepers' question about messengers with clear proofs and their redirection of supplication, since disbelievers' supplication is in error"
  ],
  "ext-040-p4": [
    "Support promised to messengers and believers in worldly life and on the Day the witnesses stand",
    "The Day when excuses fail wrongdoers, who receive the curse and the worst home",
    "Musa given guidance and the Children of Israel made to inherit the Scripture",
    "That inheritance described as guidance and reminder for those of understanding",
    "Patience commanded with the truth of the promise, forgiveness sought for sin, and praise exalted evening and morning",
    "Disputation without authority traced to unreachable pride, with refuge sought in the Hearing Seeing",
    "Creation of heavens and earth declared greater than the creation of mankind, though most do not know",
    "Inequality of blind and seeing, and of believing doers of good and evildoers, with scant remembrance noted",
    "The Hour affirmed as coming without doubt though most people do not believe",
    "The call to invoke Him with the promise of response, and contemptible Hell for those disdaining worship",
    "Night made for rest and day for sight, with bounty met by widespread ingratitude",
    "Creator of all things with no deity except Him, and the challenge of how they are deluded",
    "Prior deniers of the signs likewise deluded",
    "Earth made a settlement and sky a ceiling, forms perfected and good things provided, with blessing to the Lord of the worlds",
    "The Ever-Living invoked sincerely in religion, with praise to the Lord of the worlds",
    "Prohibition of worshipping their objects after clear proofs, and the command to submit to the Lord of the worlds",
    "Creation staged from dust, sperm-drop and clinging clot through childhood, maturity and old age, some taken earlier, to a specified term inviting reason",
    "Giving life and causing death, decreeing a matter by saying Be and it is"
  ],
  "ext-040-p5": [
    "Consideration of those who dispute the signs and how they are averted",
    "Deniers of the Book and the messengers' message told they will come to know",
    "Shackles around necks and chains by which they are dragged",
    "Dragging in boiling water, then being filled with flame in the Fire",
    "The question where their former associates are",
    "Their answer that these departed and that they previously invoked nothing, exposing divine leading-astray of disbelievers",
    "The explanation that they exulted without right and behaved insolently",
    "Eternal entry through Hell's gates named the wretched residence of the arrogant",
    "Patience with the true promise whether some punishment is shown or he is taken in death, since return is to Him",
    "Prior messengers related and unrelated, none bringing a sign except by permission, with truthful conclusion and falsifier loss at the command",
    "Grazing animals made for riding and for eating",
    "Further benefits and needs fulfilled upon them, with carriage upon them and upon ships",
    "Signs shown with the challenge which of them is denied",
    "Travel showing more numerous and stronger predecessors whose earnings did not avail them",
    "Their rejoicing in their own knowledge when messengers brought proofs, then envelopment by what they ridiculed",
    "Belief in Allah alone declared only when they saw the punishment",
    "Faith never benefiting once punishment was seen, as the established divine way, with disbelievers losing"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`40:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`40:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 40, surahName: "Ghafir",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 6 genuine re-extraction. Boundaries follow the text: P1 closes with the travel-and-seizure argument (22) before Musa's commission opens (23); P2 ends with Pharaoh's ruined tower plan (37); P3 runs from the believer's invitation through the Fire dialogues (38-50); P4 covers the support promise, patience commands and creation signs to the Be-and-it-is decree (51-68); P5 begins with the disputers' aversion and runs through dragging, livestock signs and the ineffective deathbed faith (69-85).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (40:1-22) ===
{
  const e = extractions[0];
  const aziz = findWord(2, ["\u0639","\u0632","\u064a","\u0632"]);
  const aleem = findWord(2, ["\u0639","\u0644","\u064a","\u0645"]);
  const ghafir = findWord(3, ["\u063a","\u0627","\u0641","\u0631"]);
  const qabil = findWord(3, ["\u0642","\u0627","\u0628","\u0644"]);
  const shadid = findWord(3, ["\u0634","\u062f","\u064a","\u062f"]);
  const ali = findWord(12, ["\u0639","\u0644","\u064a"]);
  const kabeer = findWord(12, ["\u0643","\u0628","\u064a","\u0631"]);
  const wahid = findWord(16, ["\u0648","\u0627","\u062d","\u062f"]);
  const qahhar = findWord(16, ["\u0642","\u0647","\u0627","\u0631"]);
  if (aziz) e.divineNamesAndAttributes.push({ term: aziz, transliteration: "Aziz", gloss: "Exalted in Might (editorial gloss)", keys: ["40:2"] });
  if (aleem) e.divineNamesAndAttributes.push({ term: aleem, transliteration: "Aleem", gloss: "Knowing (editorial gloss)", keys: ["40:2"] });
  if (ghafir) e.divineNamesAndAttributes.push({ term: ghafir, transliteration: "Ghafir al-dhanb", gloss: "forgiver of sin (editorial gloss)", keys: ["40:3"] });
  if (qabil) e.divineNamesAndAttributes.push({ term: qabil, transliteration: "Qabil al-tawb", gloss: "acceptor of repentance (editorial gloss)", keys: ["40:3"] });
  if (shadid) e.divineNamesAndAttributes.push({ term: shadid, transliteration: "Shadid al-iqab", gloss: "severe in punishment (editorial gloss)", keys: ["40:3"] });
  if (ali) e.divineNamesAndAttributes.push({ term: ali, transliteration: "Ali", gloss: "Most High (editorial gloss)", keys: ["40:12"] });
  if (kabeer) e.divineNamesAndAttributes.push({ term: kabeer, transliteration: "Kabeer", gloss: "Grand (editorial gloss)", keys: ["40:12"] });
  if (wahid) e.divineNamesAndAttributes.push({ term: wahid, transliteration: "Wahid", gloss: "One (editorial gloss)", keys: ["40:16"] });
  if (qahhar) e.divineNamesAndAttributes.push({ term: qahhar, transliteration: "Qahhar", gloss: "Prevailing (editorial gloss)", keys: ["40:16"] });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["40:4"], excerpt: fv(4), description: "Be not deceived by their uninhibited movement throughout the land." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:14"], excerpt: fv(14), description: "So invoke Allah, being sincere to Him in religion, although the disbelievers dislike it." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:18"], excerpt: fv(18), description: "And warn them of the Approaching Day when hearts are at the throats." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["40:7"], excerpt: fv(7), description: "Our Lord, You have encompassed all things in mercy and knowledge, so forgive those who have repented and followed Your way and protect them from the punishment of Hellfire." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["40:8"], excerpt: fv(8), description: "Our Lord, admit them to gardens of perpetual residence which You promised them, and whoever was righteous among their fathers, spouses and offspring." });
  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["40:9"], excerpt: fv(9), description: "And protect them from the evil consequences of their deeds; whom You protect that Day, You will have given him mercy." });

  e.humanConditionsAndSpiritualStates.push({ label: "Disputation over the signs confined to disbelievers whose freedom of movement can deceive", keys: ["40:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Confession of sins after two deaths and two lives, with a plea for any way of exit", keys: ["40:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hearts at the throats filled with distress on the Approaching Day", keys: ["40:18"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Remembrance of signs and provision granted only to one who turns back in repentance", keys: ["40:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Throne-bearing angels praising, believing and seeking forgiveness for believers", keys: ["40:7"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Protection from evil consequences named as mercy and the great attainment", keys: ["40:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine hatred exceeding their hatred of themselves at the refused invitation to faith", keys: ["40:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Sovereignty on that Day belonging to Allah alone, with every soul recompensed and no injustice", keys: ["40:16","40:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No devoted friend and no obeyed intercessor for wrongdoers on the Approaching Day", keys: ["40:18"], evidenceClass: "EXPLICIT_TEXT" });

  const yawm = findWord(15, ["\u064a","\u0648","\u0645"]);
  if (yawm) e.terminology.push({ term: yawm, transliteration: "yawm al-talaq", gloss: "Day of Meeting (editorial gloss)", keys: ["40:15"] });
  const azifah = findWord(18, ["\u0623","\u0632","\u0641","\u0629"]);
  if (azifah) e.terminology.push({ term: azifah, transliteration: "al-azifah", gloss: "the Approaching (Day) (editorial gloss)", keys: ["40:18"] });
}

// === POPULATE P2 (40:23-37) ===
{
  const e = extractions[1];

  e.propheticNarratives.push({ label: "Musa sent with signs and clear authority to Pharaoh, Haman and Qarun; the order to kill believing sons; Pharaoh's proposal to kill him; his refuge-seeking; the concealed believer's defence and warnings; Yusuf's earlier proofs doubted; the tower project to inspect Musa's deity ending in ruin", keys: ["40:23","40:24","40:25","40:26","40:27","40:28","40:29","40:30","40:31","40:32","40:33","40:34","40:35","40:36","40:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["40:26"], excerpt: fv(26), description: "Pharaoh's proposal to kill Musa, cited as the tyrant's stated intent rather than a divine command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Concealed faith maintained within Pharaoh's household while speaking in defence of the messenger", keys: ["40:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Arrogance denying the Day of Account, against which refuge is sought in the shared Lord", keys: ["40:27"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Lasting doubt about Yusuf's proofs culminating in the claim that no messenger would follow him", keys: ["40:34"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Evil of the deed made attractive while being averted from the right way", keys: ["40:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "State violence ordered against the sons of believers while their women are spared", keys: ["40:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Political authority claiming to show only its own view and to guide to right conduct", keys: ["40:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Monumental construction ordered to reach the ways of the heavens", keys: ["40:36","40:37"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Evidentiary fairness argued: a liar bears his lie while a truthful warner's promise may strike them", keys: ["40:28"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Present dominance unable to shield from divine punishment if it comes", keys: ["40:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine intent excluding injustice toward servants amid the warning of a day like the companies", keys: ["40:31"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Sealing of every arrogant tyrant's heart following disputation without authority", keys: ["40:35"], evidenceClass: "EXPLICIT_TEXT" });

  const sultan = findWord(23, ["\u0633","\u0644","\u0637","\u0646"]);
  if (sultan) e.terminology.push({ term: sultan, transliteration: "sultan", gloss: "authority/proof (editorial gloss)", keys: ["40:23"] });
}

// === POPULATE P3 (40:38-50) ===
{
  const e = extractions[2];
  const ghaffar = findWord(42, ["\u063a","\u0641","\u0627","\u0631"]);
  if (ghaffar) e.divineNamesAndAttributes.push({ term: ghaffar, transliteration: "Ghaffar", gloss: "Perpetual Forgiver (editorial gloss)", keys: ["40:42"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:38"], excerpt: fv(38), description: "O my people, follow me; I will guide you to the way of right conduct." });

  e.humanConditionsAndSpiritualStates.push({ label: "Worldly life reduced to temporary enjoyment against the Hereafter as permanent settlement", keys: ["40:39"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Entrusting one's affair to Allah with the expectation that opponents will remember the warning", keys: ["40:44"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Weak followers seeking relief from arrogant leaders who admit all are confined together", keys: ["40:47","40:48"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Righteous believers of either sex entering Paradise with provision without account", keys: ["40:40"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Mutual invitations contrasted: one to salvation, the other to the Fire", keys: ["40:41","40:42"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Evil recompensed only by its like while righteousness receives unaccounted provision", keys: ["40:40"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Invoked objects answering no supplication in this world or the Hereafter", keys: ["40:43"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Divine protection of the believer while Pharaoh's household is enveloped by the worst punishment", keys: ["40:45"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Exposure to the Fire morning and evening before the severest entry ordered at the Hour", keys: ["40:46"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Hell's keepers redirecting supplication to those who already received clear proofs", keys: ["40:49","40:50"], evidenceClass: "EXPLICIT_TEXT" });

  const dar = findWord(39, ["\u062f","\u0627","\u0631"]);
  if (dar) e.terminology.push({ term: dar, transliteration: "dar al-qarar", gloss: "home of permanent settlement (editorial gloss)", keys: ["40:39"] });
}

// === POPULATE P4 (40:51-68) ===
{
  const e = extractions[3];
  const samee = findWord(56, ["\u0633","\u0645","\u064a","\u0639"]);
  const baseer = findWord(56, ["\u0628","\u0635","\u064a","\u0631"]);
  const khaliq = findWord(62, ["\u062e","\u0627","\u0644","\u0642"]);
  const hayy = findWord(65, ["\u062d","\u064a"]);
  if (samee) e.divineNamesAndAttributes.push({ term: samee, transliteration: "Samee'", gloss: "Hearing (editorial gloss)", keys: ["40:56"] });
  if (baseer) e.divineNamesAndAttributes.push({ term: baseer, transliteration: "Baseer", gloss: "Seeing (editorial gloss)", keys: ["40:56"] });
  if (khaliq) e.divineNamesAndAttributes.push({ term: khaliq, transliteration: "Khaliq", gloss: "Creator (editorial gloss)", keys: ["40:62"] });
  if (hayy) e.divineNamesAndAttributes.push({ term: hayy, transliteration: "Hayy", gloss: "Ever-Living (editorial gloss)", keys: ["40:65"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:55"], excerpt: fv(55), description: "So be patient; the promise of Allah is truth; ask forgiveness for your sin and exalt with praise evening and morning." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:56"], excerpt: fv(56), description: "So seek refuge in Allah; indeed He is the Hearing, the Seeing." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:60"], excerpt: fv(60), description: "Call upon Me; I will respond to you." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:65"], excerpt: fv(65), description: "He is the Ever-Living; there is no deity except Him, so call upon Him sincere in religion." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["40:66"], excerpt: fv(66), description: "I have been forbidden to worship those you call upon besides Allah once clear proofs came." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:66"], excerpt: fv(66), description: "And I have been commanded to submit to the Lord of the worlds." });

  e.propheticNarratives.push({ label: "Musa given guidance and the Children of Israel caused to inherit the Scripture as guidance and reminder", keys: ["40:53","40:54"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Excuses failing wrongdoers on the Day the witnesses stand, with curse and worst home assigned", keys: ["40:52"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Disputation without authority rooted in pride whose extent cannot be reached", keys: ["40:56"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Scant remembrance despite the inequality of blind and seeing and of believers and evildoers", keys: ["40:58"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Disdain of worship answered by contemptible entry into Hell", keys: ["40:60"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Night appointed for rest and day for sight as bounty met by widespread ingratitude", keys: ["40:61"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Earth as settlement and sky as ceiling with perfected forms and good provision", keys: ["40:64"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Support guaranteed to messengers and believers in worldly life and at the standing of witnesses", keys: ["40:51"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Cosmic creation declared greater than human creation though most do not know", keys: ["40:57"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Invocation answered by promise, with response pledged to the caller", keys: ["40:60"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Staged human creation from dust through old age to a specified term inviting reasoning", keys: ["40:67"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Life and death dispensed by decree expressed as Be and it is", keys: ["40:68"], evidenceClass: "EXPLICIT_TEXT" });

  const kun = findWord(68, ["\u0643","\u0646"]);
  if (kun) e.terminology.push({ term: kun, transliteration: "kun fa-yakun", gloss: "Be and it is (editorial gloss)", keys: ["40:68"] });
}

// === POPULATE P5 (40:69-85) ===
{
  const e = extractions[4];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:77"], excerpt: fv(77), description: "So be patient; indeed the promise of Allah is truth, whether We show you some of what We promised them or take you in death." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["40:81"], excerpt: fv(81), description: "And He shows you His signs; so which of the signs of Allah do you deny?" });

  e.humanConditionsAndSpiritualStates.push({ label: "Shackles and chains dragging deniers through boiling water into the Fire", keys: ["40:71","40:72"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Admission that former associates departed and that nothing was truly invoked before", keys: ["40:74"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Exultation without right and insolent behaviour named as the cause of eternal entry", keys: ["40:75","40:76"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Self-satisfaction in existing knowledge when messengers brought clear proofs", keys: ["40:83"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Faith professed only at the sight of punishment declared ineffective under the established divine way", keys: ["40:84","40:85"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Grazing animals providing transport, food and further needs, with carriage upon them and ships", keys: ["40:79","40:80"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "More numerous and stronger predecessors whose earnings and impressions did not avail them", keys: ["40:82"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Return to Allah whether promised punishment is witnessed or death intervenes", keys: ["40:77"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "No messenger bringing a sign except by permission, with truthful conclusion at the divine command", keys: ["40:78"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Envelopment by what they used to ridicule after rejecting arriving proofs", keys: ["40:83"], evidenceClass: "EXPLICIT_TEXT" });

  const sunnah = findWord(85, ["\u0633","\u0646","\u062a"]);
  if (sunnah) e.terminology.push({ term: sunnah, transliteration: "sunnat Allah", gloss: "established way of Allah (editorial gloss)", keys: ["40:85"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `040-ghafir-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 040-ghafir-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-040-p1,ext-040-p2,ext-040-p3,ext-040-p4,ext-040-p5",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1427", label: "Forgiveness and acceptance of repentance joined to severity and abundance", def: "In 40:3: The forgiver of sin, acceptor of repentance, severe in punishment, owner of abundance; there is no deity except Him and to Him is the destination.", key: "40:3", overlap: [{topicId:"asma-ul-husna",layer:"scholarly",relationship:"same-concept",note:"Ghafir, Qabil al-tawb, Shadid al-iqab, Dhi al-tawl."},{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Mercy paired with severity."}] },
  { id: "cand-1428", label: "Freedom of movement in the land named as a deceptive appearance", def: "In 40:4: No one disputes concerning the signs except those who disbelieve, so be not deceived by their uninhibited movement throughout the land.", key: "40:4", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"related-not-identical",note:"Prosperity as apparent success."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Disputation without standing."}] },
  { id: "cand-1429", label: "Throne-bearing angels interceding for believers and their righteous kin", def: "In 40:7-9: Those who carry the Throne and those around it exalt with praise, believe in Him and ask forgiveness for believers; our Lord, forgive those who repented and followed Your way, admit them to promised gardens with righteous fathers, spouses and offspring, and protect them from evil consequences, which is mercy and the great attainment.", key: "40:7", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Hamalat al-arsh intercession."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Taught angelic dua."}] },
  { id: "cand-1430", label: "Divine hatred exceeding self-hatred at the refused invitation to faith", def: "In 40:10: Those who disbelieve will be addressed that the hatred of Allah for them was greater than their hatred of themselves when they were invited to faith but refused.", key: "40:10", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Maqt Allah at the reckoning."},{topicId:"self-accountability",layer:"scholarly",relationship:"related-not-identical",note:"Refusal recalled against them."}] },
  { id: "cand-1431", label: "Two deaths and two lives confessed with the plea for an exit refused", def: "In 40:11-12: They say our Lord, You made us lifeless twice and gave us life twice and we confess our sins, so is there any way to an exit; that is because when Allah alone was invoked you disbelieved, and judgement is with Allah the Most High Grand.", key: "40:11", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"I'tiraf after the deadline."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Rejection of exclusive invocation."}] },
  { id: "cand-1432", label: "The Day of Meeting with exposed sovereignty and exact recompense", def: "In 40:15-17: He places inspiration to warn of the Day of Meeting, the Day they come forth with nothing concealed; to whom belongs sovereignty this Day? To Allah the One the Prevailing; this Day every soul is recompensed for what it earned, no injustice today.", key: "40:15", overlap: [{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Yawm al-talaq and exposed mulk."},{topicId:"justice",layer:"curated",relationship:"same-concept",note:"La zulm al-yawm."}] },

  { id: "cand-1433", label: "State violence against believing sons while women are spared", def: "In 40:25: When he brought them the truth they said kill the sons of those who believed with him and keep their women alive, but the plan of the disbelievers is only in error.", key: "40:25", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Targeted demographic violence."},{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Repeat of the earlier decree."}] },
  { id: "cand-1434", label: "Refuge sought in the shared Lord against arrogance denying the Day of Account", def: "In 40:27: Moses said I have sought refuge in my Lord and your Lord from every arrogant one who does not believe in the Day of Account.", key: "40:27", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"I'dha bi-rabbi."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Mutakabbir defined by denial."}] },
  { id: "cand-1435", label: "Concealed faith defending the messenger through evidentiary fairness", def: "In 40:28: A believing man of Pharaoh's family who concealed his faith said do you kill a man because he says my Lord is Allah while bringing clear proofs; if he lies his lie is upon him, and if truthful some of what he promises will strike you.", key: "40:28", overlap: [{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Bayyinat weighed before violence."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Courageous counsel under risk."}] },
  { id: "cand-1436", label: "Present political dominance unable to shield from divine punishment", def: "In 40:29: O my people, sovereignty is yours today, dominant in the land, but who would protect us from the punishment of Allah if it came? Pharaoh said I show you only what I see and guide you only to right conduct.", key: "40:29", overlap: [{topicId:"leadership-qualities",layer:"scholarly",relationship:"same-concept",note:"Self-authorising rule exposed."},{topicId:"divine-power",layer:"scholarly",relationship:"related-not-identical",note:"Power subordinate to decree."}] },
  { id: "cand-1437", label: "Doubt persisting after Yusuf's proofs and the claim that no messenger would follow", def: "In 40:34: Joseph had come before with clear proofs but you remained in doubt until he died, then said never will Allah send a messenger after him; thus Allah leaves astray the transgressor and skeptic.", key: "40:34", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Succession denied after a prophet."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Murtab disposition."}] },
  { id: "cand-1438", label: "Tower construction to inspect the deity, its evil made attractive and plan ruined", def: "In 40:36-37: O Haman, construct for me a tower that I might reach the ways into the heavens so I may look at the deity of Moses, though I think he is a liar; thus the evil of his deed was made attractive and he was averted from the way, and his plan was only in ruin.", key: "40:36", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Architectural defiance."},{topicId:"shaytan-enemy",layer:"scholarly",relationship:"related-not-identical",note:"Tazyin of the evil deed."}] },

  { id: "cand-1439", label: "Worldly enjoyment against the Hereafter as the home of settlement", def: "In 40:39: O my people, this worldly life is only temporary enjoyment, and indeed the Hereafter is the home of permanent settlement.", key: "40:39", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Dar al-qarar versus mata'."},{topicId:"hardship-and-ease",layer:"curated",relationship:"related-not-identical",note:"Temporality of worldly ease."}] },
  { id: "cand-1440", label: "Exact recompense for evil with unaccounted provision for believing men and women", def: "In 40:40: Whoever does an evil deed is recompensed only by its like, but whoever does righteousness, male or female, while a believer, enters Paradise given provision without account.", key: "40:40", overlap: [{topicId:"justice",layer:"curated",relationship:"same-concept",note:"Mithl recompense for evil."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Gender-explicit reward parity."}] },
  { id: "cand-1441", label: "Mutual invitations contrasted between salvation and the Fire", def: "In 40:41-42: How is it that I invite you to salvation while you invite me to the Fire? You invite me to disbelieve and associate without knowledge, and I invite you to the Exalted in Might, the Perpetual Forgiver.", key: "40:41", overlap: [{topicId:"dialogue-principles",layer:"scholarly",relationship:"same-concept",note:"Competing invitations named."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Da'wah to Aziz Ghaffar."}] },
  { id: "cand-1442", label: "Invoked objects answering no supplication in either realm", def: "In 40:43: Assuredly that to which you invite me has no response to supplication in this world or the Hereafter, and our return is to Allah, and the transgressors are companions of the Fire.", key: "40:43", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"No da'wah capacity in rivals."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Response as divine prerogative."}] },
  { id: "cand-1443", label: "Entrustment of the affair to Allah answered by protection from plotted evils", def: "In 40:44-45: You will remember what I say to you and I entrust my affair to Allah, indeed Allah is Seeing of His servants; so Allah protected him from the evils they plotted and Pharaoh's people were enveloped by the worst punishment.", key: "40:44", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Ufawwidu amri ila Allah."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Waqaya from kayd."}] },
  { id: "cand-1444", label: "Morning-and-evening exposure to the Fire before the severest entry", def: "In 40:46: The Fire, they are exposed to it morning and evening, and the Day the Hour appears it will be said make the people of Pharaoh enter the severest punishment.", key: "40:46", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Barzakh exposure preceding entry."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Ashadd al-adhab at the Hour."}] },

  { id: "cand-1445", label: "Support guaranteed to messengers and believers in both realms", def: "In 40:51: Indeed We will support Our messengers and those who believe during the life of this world and on the Day when the witnesses will stand.", key: "40:51", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Nasr extended to believers."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Assurance across both realms."}] },
  { id: "cand-1446", label: "Patience joined to forgiveness-seeking and timed praise", def: "In 40:55: So be patient, indeed the promise of Allah is truth, and ask forgiveness for your sin and exalt with praise of your Lord in the evening and the morning.", key: "40:55", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr with wa'd haqq."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Ashi and ibkar tasbih."}] },
  { id: "cand-1447", label: "Disputation traced to unreachable pride answered by refuge", def: "In 40:56: Those who dispute concerning the signs without authority have within their breasts only pride the extent of which they cannot reach, so seek refuge in Allah, indeed He is the Hearing, the Seeing.", key: "40:56", overlap: [{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Kibr as sole motive."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Isti'adha commanded."}] },
  { id: "cand-1448", label: "Cosmic creation greater than human creation as a resurrection argument", def: "In 40:57: The creation of the heavens and earth is greater than the creation of mankind, but most of the people do not know.", key: "40:57", overlap: [{topicId:"resurrection-process",layer:"scholarly",relationship:"same-concept",note:"Greater-to-lesser argument."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Scale comparison as ayah."}] },
  { id: "cand-1449", label: "Invocation answered by promise with contempt for those disdaining worship", def: "In 40:60: And your Lord says call upon Me, I will respond to you; indeed those who disdain My worship will enter Hell rendered contemptible.", key: "40:60", overlap: [{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Ud'uni astajib lakum."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Istikbar an ibadati."}] },
  { id: "cand-1450", label: "Staged human creation to an appointed term inviting reasoning", def: "In 40:67: It is He who created you from dust, then a sperm-drop, then a clinging clot, then brings you out as a child, then to maturity, then to old age, and among you is he taken before that, so that you reach a specified term and perhaps use reason.", key: "40:67", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Turab, nutfah, alaqah staging."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"La'allakum ta'qilun."}] },

  { id: "cand-1451", label: "Dragging in shackles through boiling water into the Fire", def: "In 40:71-72: When the shackles are around their necks and the chains they will be dragged, in boiling water, then in the Fire they will be filled with flame.", key: "40:71", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Aghlal, salasil and hamim."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Sahb as punishment mode."}] },
  { id: "cand-1452", label: "Vanished associates and the admission of having invoked nothing", def: "In 40:73-74: Then it will be said where is that which you used to associate other than Allah; they say they have departed from us, rather we did not used to invoke previously anything; thus Allah puts astray the disbelievers.", key: "40:73", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Rivals absent at need."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Retrospective admission."}] },
  { id: "cand-1453", label: "Patience held whether punishment is witnessed or death intervenes", def: "In 40:77: So be patient, indeed the promise of Allah is truth, and whether We show you some of what We promised them or take you in death, it is to Us they will be returned.", key: "40:77", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabr independent of outcome timing."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Return regardless of witness."}] },
  { id: "cand-1454", label: "Signs brought only by permission with truthful conclusion at the command", def: "In 40:78: We sent messengers before you, some related and some not; it was not for any messenger to bring a sign except by permission of Allah, so when His command comes it is concluded in truth and the falsifiers lose.", key: "40:78", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Sign capacity by idhn."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Related and unreported narratives."}] },
  { id: "cand-1455", label: "Livestock and ships as combined carriage with further benefits", def: "In 40:79-80: It is Allah who made for you grazing animals upon which you ride and some you eat, and for you therein are other benefits and that you may realise upon them a need in your breasts, and upon them and upon ships you are carried.", key: "40:79", overlap: [{topicId:"animals-as-communities",layer:"scholarly",relationship:"related-not-identical",note:"An'am placed in service."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Land and sea transport as ayah."}] },
  { id: "cand-1456", label: "Faith professed at the sight of punishment declared ineffective", def: "In 40:84-85: When they saw Our punishment they said we believe in Allah alone and disbelieve in what we associated; but never did their faith benefit them once they saw Our punishment, the established way of Allah among His servants, and the disbelievers lost.", key: "40:84", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman timing invalidated."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Deadline for accepted return."}] }
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

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 6).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(6, 12).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(12, 18).map(c => c.candidateId);
extractions[3].topicCandidateIds = candidates.candidates.slice(18, 24).map(c => c.candidateId);
extractions[4].topicCandidateIds = candidates.candidates.slice(24, 30).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `040-ghafir-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-064.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-064.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
