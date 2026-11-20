// MFD-11 Wave 6: Surah 37 (As-Saffat) genuine re-extraction.
// Covers 37:1-182 in 5 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "037-0001-0182.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 37:${n} not found`);
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

console.log("Generating Surah 37 (As-Saffat) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T15:00:00.000Z";

const PASSAGES = [
  { id: "ext-037-p1", from: 1, to: 39,
    label: "Oath by those lined up in rows, those who drive, those who recite the message; indeed your God is One, Lord of heavens earth and between them and Lord of the sunrises; nearest heaven adorned with stars and guarded against every rebellious devil; devils cannot listen to the exalted assembly, pelted from every side, repelled with constant punishment, except one who snatches by theft pursued by a piercing burning flame; inquire are they a stronger creation or those We created, We created them from sticky clay; you wonder while they mock; reminded they remember not; see a sign they ridicule calling it obvious magic; when we are dust and bones are we resurrected and our forefathers; say yes and you will be contemptible; one shout and at once they observe; woe to us this is the Day of Recompense; this is the Day of Judgement you denied; gather the wrongdoers their kinds and what they worshipped besides Allah and guide them to the path of Hellfire; stop them they are to be questioned; why do you not help each other; that Day they are in surrender; they approach one another blaming; you used to come at us from the right; rather you yourselves were not believers; we had no authority over you, you were a transgressing people; the word of our Lord has come into effect upon us, we will taste; we led you to deviation, we were deviators; that Day they share the punishment; thus We deal with the criminals; when told there is no deity but Allah they were arrogant, saying shall we leave our gods for a mad poet; rather he came with the truth and confirmed the messengers; you will taste the painful punishment and be recompensed only for what you used to do",
    mainLabel: "Opening oath triad (saffat, zajirat, taliyat) grounding the affirmation that God is One and Lord of the heavens, the earth and the sunrises; the nearest heaven's star-adornment serving both beauty and protection; rebellious devils barred from the exalted assembly and pelted, with the stolen-word exception pursued by a piercing flame; creation from sticky clay answering the claim of superior difficulty; mockery, non-remembrance and sign-ridicule as the disbeliever's response pattern; resurrection of dust and bones affirmed with a single shout; the Day of Judgement gathering wrongdoers with their objects of worship toward Hellfire; mutual blame between misleaders and followers resolved by the admission of no coercive authority; shared punishment as criminal treatment; arrogance at la ilaha illa Allah and the mad-poet accusation answered by truth and confirmation of prior messengers" },
  { id: "ext-037-p2", from: 40, to: 82,
    label: "Except the chosen servants of Allah; for them a provision determined, fruits, and they are honored in gardens of pleasure on thrones facing one another; circulated among them a cup from a flowing spring, white and delicious to the drinkers, no bad effect in it nor intoxication; with them women limiting their glances with large beautiful eyes as if delicate well-protected eggs; they approach one another inquiring; a speaker says I had a companion who asked are you of those who believe, that when we are dust and bones we will be recompensed; would you care to look; he looks and sees him in the midst of the Hellfire; by Allah you almost ruined me; if not for the favor of my Lord I would have been among those brought in; are we not to die except our first death and not be punished; this is the great attainment; for the like of this let the workers work; is Paradise a better accommodation or the tree of zaqqum; We made it a torment for the wrongdoers, a tree issuing from the bottom of Hellfire, its emerging fruit as if heads of devils; they eat from it and fill their bellies, then a mixture of scalding water, then their return is to the Hellfire; they found their fathers astray and hastened in their footsteps; most of the former peoples had strayed before them and We sent warners among them; look how was the end of those warned, except the chosen servants; Noah called Us and We are the best of responders; We saved him and his family from the great affliction and made his descendants those remaining; left favorable mention among later generations; peace upon Noah among the worlds; thus We reward the doers of good; he was of Our believing servants; then We drowned the disbelievers",
    mainLabel: "Chosen servants exempted from punishment with determined provision, fruits and honor in gardens of pleasure; throne-facing fellowship and a circulating cup free of harm and intoxication; glance-restricted companions described as protected eggs; the inquiry scene contrasting a believer with his former mocking companion now seen in Hellfire, and the acknowledgment that only divine favor prevented ruin; single-death security declared the great attainment for which workers should work; the zaqqum tree contrasted with Paradise as torment issuing from Hellfire's base with devil-head fruit and scalding mixture; ancestral haste in misguidance and the fate of warned nations; Nuh's call answered by rescue from great affliction, survival through his descendants, lasting mention, universal peace and the muhsin reward formula, followed by the drowning of the disbelievers" },
  { id: "ext-037-p3", from: 83, to: 113,
    label: "Among his kind was Abraham, when he came to his Lord with a sound heart; he said to his father and his people what do you worship, is it falsehood as gods other than Allah you desire, then what is your thought about the Lord of the worlds; he cast a look at the stars and said indeed I am about to be ill, so they turned away departing; he turned to their gods saying do you not eat, what is wrong with you that you do not speak, and turned upon them a blow with his right hand; the people came hastening; he said do you worship that which you yourselves carve while Allah created you and that which you do; they said construct for him a furnace and throw him into the burning fire; they intended a plan but We made them the most debased; he said indeed I will go to my Lord, He will guide me; my Lord grant me a child from among the righteous; We gave him good tidings of a forbearing boy; when he reached with him the age of exertion he said O my son I have seen in a dream that I must sacrifice you so see what you think; he said O my father do as you are commanded, you will find me if Allah wills of the steadfast; when they had both submitted and he put him down upon his forehead We called O Abraham you have fulfilled the vision; thus We reward the doers of good; this was the clear trial; We ransomed him with a great sacrifice; left favorable mention among later generations; peace upon Abraham; thus We reward the doers of good; he was of Our believing servants; We gave him good tidings of Isaac a prophet from among the righteous; We blessed him and Isaac, but among their descendants is the doer of good and the clearly unjust to himself",
    mainLabel: "Ibrahim introduced as of Nuh's kind, approaching his Lord with a sound heart; the paternal and communal interrogation exposing idol-worship as desired falsehood and pressing the question of the Lord of the worlds; the star-glance and illness statement enabling the private confrontation with silent, non-eating idols and the right-hand blow; the carving argument that Allah created both the worshippers and their works; the furnace plot reversed into the plotters' debasement; emigration under promised guidance and the supplication for righteous offspring answered by tidings of a forbearing boy; the dream-sacrifice dialogue at the age of exertion met with filial compliance conditioned on Allah's will; mutual submission and the forehead placement followed by the call declaring the vision fulfilled; the clear trial resolved by ransom with a great sacrifice; lasting mention, peace and the muhsin-believing-servant formula; tidings of Isaac and blessing whose descendants divide into the doer of good and the self-unjust" },
  { id: "ext-037-p4", from: 114, to: 148,
    label: "We conferred favor upon Moses and Aaron and saved them and their people from the great affliction; We supported them so it was they who overcame; We gave them the explicit Scripture and guided them on the straight path; left favorable mention among later generations; peace upon Moses and Aaron; thus We reward the doers of good; they were of Our believing servants; Elias was among the messengers, when he said to his people will you not fear Allah, do you call upon Ba'l and leave the best of creators, Allah your Lord and the Lord of your first forefathers; they denied him so they will be brought for punishment except the chosen servants; left favorable mention; peace upon Elias; thus We reward the doers of good; he was of Our believing servants; Lot was among the messengers, when We saved him and his family all except his wife among those who remained; then We destroyed the others; you pass by them in the morning and at night, then will you not use reason; Jonah was among the messengers, when he ran away to the laden ship and drew lots and was among the losers; the fish swallowed him while he was blameworthy; had he not been of those who exalt Allah he would have remained inside its belly until the Day they are resurrected; We threw him onto the open shore while he was ill and caused a gourd vine to grow over him; We sent him to a hundred thousand or more and they believed so We gave them enjoyment of life for a time",
    mainLabel: "Musa and Harun granted favor, rescue from great affliction, support producing victory, the explicit Scripture and straight-path guidance, closed by mention, peace and the muhsin formula; Ilyas confronting Ba'l worship with the taqwa question and the appeal to the best of creators as Lord of them and their forefathers, denial bringing presentation for punishment with the chosen-servant exemption; Lut's household rescued except the wife counted among those remaining, the destroyed sites passed morning and night as a reasoning challenge; Yunus fleeing to the laden ship, losing the lot and being swallowed while blameworthy, his prior tasbih preventing confinement until resurrection, the sick shore-casting shaded by a gourd vine, and a mission to a hundred thousand or more whose belief earned temporal enjoyment" },
  { id: "ext-037-p5", from: 149, to: 182,
    label: "Inquire of them does your Lord have daughters while they have sons, or did We create the angels as females while they were witnesses; out of their invented falsehood they say Allah has begotten and they are liars; has He chosen daughters over sons; what is wrong with you, how do you make judgement; will you not be reminded, or do you have a clear authority, then produce your scripture if you are truthful; they claimed a lineage between Him and the jinn but the jinn already know they will be brought to punishment; exalted is Allah above what they describe, except the chosen servants; you and whatever you worship cannot tempt anyone away from Him except he who is to burn in the Hellfire; there is not among us any except that he has a known position, we are those who line up and we are those who exalt Allah; the disbelievers used to say if we had a message from the former peoples we would have been the chosen servants, but they disbelieved in it so they are going to know; Our word has already preceded for Our servants the messengers that they would be given victory and that Our soldiers will be those who overcome; leave them for a time and see, for they are going to see; for Our punishment are they impatient, but when it descends in their territory evil is the morning of those warned; leave them for a time and see, for they are going to see; exalted is your Lord the Lord of might above what they describe; peace upon the messengers; praise to Allah Lord of the worlds",
    mainLabel: "The daughter-attribution interrogated against their own preference for sons and the absent witness to angelic creation; begetting declared invented falsehood and the choice-of-daughters claim challenged as defective judgement; the demand for clear authority and a produced scripture; the asserted jinn-lineage refuted by the jinn's own knowledge of presentation for punishment; divine transcendence with the chosen-servant exemption; the limits of temptation excluding only the destined burner; the angelic declaration of known station, ranked alignment and glorification; the disbelievers' conditional claim of sincerity invalidated by their actual disbelief; the prior word guaranteeing messenger victory and the overcoming of divine soldiers; repeated leave-and-see patience commands against punishment-impatience and the evil morning of territorial descent; closing tasbih of the Lord of might, salam upon the messengers and hamd to the Lord of the worlds" }
];

// Per-ayah editorial subject descriptions, ordered from the passage's first ayah.
const SUB_LABELS = {
  "ext-037-p1": [
    "Oath sworn by the angels arranged in ranks",
    "Oath sworn by those who drive onward",
    "Oath sworn by those who recite the reminder",
    "Affirmation that the God addressed is One",
    "Lordship over heavens, earth, what lies between, and the places of sunrise",
    "Nearest heaven adorned with the adornment of stars",
    "That adornment doubling as a guard against every rebellious devil",
    "Devils denied hearing of the exalted assembly and pelted from every side",
    "Their repulsion accompanied by a lasting punishment",
    "Exception of the one who snatches a word by theft and is pursued by a piercing flame",
    "Challenge on whether they or other creatures are the harder creation, with their origin in sticky clay",
    "The Prophet's wonder set against their mockery",
    "Reminder received without any act of remembrance",
    "A sign seen only to be ridiculed",
    "Their dismissal of the sign as plain magic",
    "Question whether dust and bones will be raised again",
    "Extension of that question to their forefathers",
    "Answer affirming resurrection while they are rendered contemptible",
    "A single shout sufficing to bring them into observation",
    "Their cry of woe naming the Day of Recompense",
    "Identification of that Day as the Judgement they used to deny",
    "Order to gather the wrongdoers, their kinds, and their objects of worship",
    "Those objects named as what they worshipped besides Allah, with guidance to the path of Hellfire",
    "Order to halt them because they must be questioned",
    "Question why they no longer help one another",
    "Their condition of surrender on that Day",
    "Their turning toward one another in mutual blame",
    "Followers complaining that the misleaders approached them from the right",
    "Misleaders retorting that the followers were themselves not believers",
    "Admission of no authority over them, only their own transgression",
    "The Lord's word taking effect so that tasting punishment is certain",
    "Confession of having led others astray while being astray themselves",
    "Sharing in the punishment on that Day",
    "Statement that this is how the criminals are dealt with",
    "Their arrogance when told there is no deity but Allah",
    "Their refusal to abandon their gods for one they call a mad poet",
    "Correction that he brought the truth and confirmed earlier messengers",
    "Notice that they will taste the painful punishment",
    "Recompense limited strictly to what they used to do"
  ],
  "ext-037-p2": [
    "Exemption of the chosen servants of Allah from that punishment",
    "Their provision described as determined",
    "Fruits named among that provision, with honor conferred",
    "Their setting in gardens of pleasure",
    "Seated on thrones facing one another",
    "A cup circulated among them from a flowing spring",
    "Its whiteness and delight to those who drink",
    "Absence of any bad effect and of intoxication",
    "Companions restricting their glances, large-eyed",
    "Their likeness to delicate eggs kept well protected",
    "The inhabitants approaching one another with questions",
    "One speaker recalling a companion he had on earth",
    "That companion's mocking question about being among believers",
    "His doubt that dust and bones would be recompensed",
    "Invitation to look upon his former companion's state",
    "The look revealing him in the midst of Hellfire",
    "Acknowledgment that the companion nearly ruined him",
    "Attribution of his escape solely to his Lord's favor",
    "Rhetorical question whether death now ends after the first death",
    "Assurance of no further punishment",
    "Naming this outcome the great attainment",
    "Directive that workers should work for the like of this",
    "Comparison of Paradise's accommodation with the tree of zaqqum",
    "Zaqqum appointed as a torment for the wrongdoers",
    "Its origin at the bottom of Hellfire",
    "Its emerging fruit likened to the heads of devils",
    "Their eating from it until their bellies are filled",
    "A mixture of scalding water following that food",
    "Their return thereafter to Hellfire",
    "Their finding their fathers already astray",
    "Their haste to follow in those footsteps",
    "Most former peoples having strayed before them",
    "Warners having been sent among those peoples",
    "Command to observe the end of those who were warned",
    "Renewed exemption of the chosen servants",
    "Nuh's call to Allah and the claim of being the best of responders",
    "Rescue of Nuh and his family from the great affliction",
    "His descendants made the ones who remain",
    "Favorable mention left for him among later generations",
    "Peace declared upon Nuh among the worlds",
    "Formula stating that the doers of good are thus rewarded",
    "Affirmation that Nuh was among the believing servants",
    "Drowning of the disbelievers"
  ],
  "ext-037-p3": [
    "Ibrahim introduced as belonging to Nuh's kind",
    "His approach to his Lord with a sound heart",
    "His question to his father and people about what they worship",
    "His framing of their worship as desired falsehood besides Allah",
    "His pressing question about their conception of the Lord of the worlds",
    "His glance cast toward the stars",
    "His statement that he is about to be ill",
    "Their turning away and departing from him",
    "His address to their gods asking whether they eat",
    "His question why they do not speak",
    "His striking them with a blow of his right hand",
    "The people hastening toward him",
    "His argument against worshipping what they themselves carve",
    "His assertion that Allah created them and what they make",
    "Their call to build a furnace and cast him into the fire",
    "Their plot answered by making them the most debased",
    "His declaration of going to his Lord who will guide him",
    "His supplication for a child from among the righteous",
    "Tidings given of a forbearing boy",
    "The dream-sacrifice consultation at the age of exertion and the son's conditional steadfastness",
    "Their mutual submission and the placing of him upon his forehead",
    "The divine call addressing Ibrahim",
    "Declaration that the vision has been fulfilled, with the muhsin reward formula",
    "Naming the episode the clear trial",
    "Ransom of the son with a great sacrifice",
    "Favorable mention left among later generations",
    "Peace declared upon Ibrahim",
    "Repeated formula of rewarding the doers of good",
    "Affirmation that Ibrahim was among the believing servants",
    "Tidings of Isaac as a prophet among the righteous",
    "Blessing of Ibrahim and Isaac with descendants divided between the doer of good and the self-unjust"
  ],
  "ext-037-p4": [
    "Favor conferred upon Musa and Harun",
    "Their rescue together with their people from the great affliction",
    "Support granted so that they were the ones who overcame",
    "Grant of the explicit Scripture to them",
    "Their guidance upon the straight path",
    "Favorable mention left for them among later generations",
    "Peace declared upon Musa and Harun",
    "Reward formula applied to them as doers of good",
    "Affirmation that both were among the believing servants",
    "Ilyas named among the messengers",
    "His question to his people whether they will fear Allah",
    "His rebuke for invoking Ba'l while leaving the best of creators",
    "Identification of that creator as their Lord and the Lord of their forefathers",
    "Their denial and consequent presentation for punishment",
    "Exemption of the chosen servants from that presentation",
    "Favorable mention left for Ilyas among later generations",
    "Peace declared upon Ilyas",
    "Reward formula applied to him as a doer of good",
    "Affirmation that Ilyas was among the believing servants",
    "Lut named among the messengers",
    "Rescue of him and his entire household",
    "Exception of his wife among those who remained behind",
    "Destruction of the remaining people",
    "Passing by their ruins in the morning",
    "Passing by them at night with the challenge to use reason",
    "Yunus named among the messengers",
    "His flight to the laden ship",
    "His drawing of lots and being among the losers",
    "The fish swallowing him while he was blameworthy",
    "Condition that he had been among those who exalt Allah",
    "Consequence avoided: remaining in its belly until the Day of resurrection",
    "His casting onto the open shore while ill",
    "A gourd vine caused to grow over him",
    "His mission to a hundred thousand or more",
    "Their belief and the enjoyment of life granted for a time"
  ],
  "ext-037-p5": [
    "Interrogation whether their Lord has daughters while they have sons",
    "Question whether they witnessed the angels being created female",
    "Their claim identified as proceeding from invented falsehood",
    "Their assertion that Allah has begotten, with their lying affirmed",
    "Challenge on whether He preferred daughters over sons",
    "Question about the defect in their manner of judgement",
    "Call for them to accept reminder",
    "Demand whether they possess a clear authority",
    "Demand to produce their scripture if truthful",
    "Their claimed lineage between Allah and the jinn, refuted by the jinn's knowledge of presentation",
    "Allah declared exalted above their descriptions",
    "Exemption of the chosen servants from that description",
    "Address to the disbelievers and what they worship",
    "Denial that they can tempt anyone away from Him",
    "Exception only of the one destined to burn in Hellfire",
    "Angelic statement that each has a known position",
    "Angelic self-description as those who line up",
    "Angelic self-description as those who exalt Allah",
    "Report of what the disbelievers used to say",
    "Their conditional claim about possessing a message from the former peoples",
    "Their claim that they would then have been chosen servants",
    "Their actual disbelief and the notice that they will come to know",
    "Prior word already issued for the messenger servants",
    "Content of that word: they would be given victory",
    "Further content: His soldiers would be the ones who overcome",
    "Command to leave them for a time",
    "Command to observe them, since they too will observe",
    "Question whether they are impatient for His punishment",
    "Warning that its descent in their courtyard makes an evil morning for the warned",
    "Repeated command to leave them for a time",
    "Repeated command to observe, since they will observe",
    "Tasbih of the Lord of might above their descriptions",
    "Peace declared upon the messengers",
    "Praise to Allah, Lord of the worlds"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`37:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  // Subordinate subjects must explain the actual subject of each ayah.
  // Truncated translations are explicitly disallowed by the wave brief, and they
  // also collide across records whenever the Qur'an repeats a refrain verbatim.
  // Each entry below is an editorial description of that specific verse.
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`37:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 37, surahName: "As-Saffat",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 6 genuine re-extraction. P1=angelic-oaths-tawheed-guarded-heaven-resurrection-blame(1-39), P2=chosen-servants-reward-zaqqum-Nuh(40-82), P3=Ibrahim-idols-furnace-dream-sacrifice-ransom-Isaac(83-113), P4=Musa-Harun-Ilyas-Lut-Yunus(114-148), P5=daughter-attribution-jinn-lineage-angelic-stations-victory-closing(149-182).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (37:1-39) ===
{
  const e = extractions[0];
  const wahid = findWord(4, ["\u0648","\u0627","\u062d","\u062f"]);
  if (wahid) e.divineNamesAndAttributes.push({ term: wahid, transliteration: "Wahid", gloss: "One (editorial gloss)", keys: ["37:4"] });

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["37:11"], excerpt: fv(11), description: "Then inquire of them whether they are a stronger creation or those We created — interrogative challenge on created origin." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["37:18"], excerpt: fv(18), description: "Say: Yes, and you will be rendered contemptible — affirmative answer to the resurrection question." });

  e.humanConditionsAndSpiritualStates.push({ label: "Angelic orders sworn by: those lined up in rows, those who drive, those who recite the message", keys: ["37:1","37:2","37:3"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Rebellious devils barred from the exalted assembly and pelted from every side, with the stolen-word exception pursued by a piercing flame", keys: ["37:7","37:8","37:9","37:10"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Reminder without remembrance and sign-seeing met with ridicule labelled obvious magic", keys: ["37:13","37:14","37:15"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Arrogance at the declaration of divine oneness and dismissal of the messenger as a mad poet", keys: ["37:35","37:36"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Mutual blame between misleaders and followers resolved by the admission of no coercive authority and shared punishment", keys: ["37:27","37:28","37:29","37:30","37:31","37:32","37:33"], evidenceClass: "EXPLICIT_TEXT" });

  const saffat = findWord(1, ["\u0635","\u0641","\u062a"]);
  if (saffat) e.terminology.push({ term: saffat, transliteration: "saffat", gloss: "those lined up in rows (editorial gloss)", keys: ["37:1"] });
  const shihab = findWord(10, ["\u0634","\u0647","\u0628"]);
  if (shihab) e.terminology.push({ term: shihab, transliteration: "shihab", gloss: "burning flame (editorial gloss)", keys: ["37:10"] });
}

// === POPULATE P2 (37:40-82) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["37:61"], excerpt: fv(61), description: "For the like of this let the workers work — directive orienting effort toward the great attainment." });

  e.propheticNarratives.push({ label: "Nuh: his call answered as the best of responders; rescue of him and his family from great affliction; descendants made the survivors; lasting mention and peace among the worlds; the disbelievers drowned", keys: ["37:75","37:76","37:77","37:78","37:79","37:80","37:81","37:82"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Chosen servants exempted with determined provision, fruits and honor in gardens of pleasure on facing thrones", keys: ["37:40","37:41","37:42","37:43","37:44"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Circulated cup from a flowing spring, white and delicious, carrying no bad effect and no intoxication", keys: ["37:45","37:46","37:47"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Single-death security declared the great attainment after the believer sees his former companion in Hellfire", keys: ["37:55","37:56","37:57","37:58","37:59","37:60"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Ancestral misguidance followed in haste, repeating the straying of most former peoples despite sent warners", keys: ["37:69","37:70","37:71","37:72","37:73"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Zaqqum tree issuing from the bottom of Hellfire with devil-head fruit, eaten to fullness then mixed with scalding water", keys: ["37:62","37:63","37:64","37:65","37:66","37:67","37:68"], evidenceClass: "EXPLICIT_TEXT" });

  const mukhlasin = findWord(40, ["\u0645","\u062e","\u0644","\u0635"]);
  if (mukhlasin) e.terminology.push({ term: mukhlasin, transliteration: "mukhlasin", gloss: "chosen/purified servants (editorial gloss)", keys: ["37:40"] });
  const zaqqum = findWord(62, ["\u0632","\u0642","\u0648","\u0645"]);
  if (zaqqum) e.terminology.push({ term: zaqqum, transliteration: "zaqqum", gloss: "tree of torment (editorial gloss)", keys: ["37:62"] });
}

// === POPULATE P3 (37:83-113) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "TAUGHT_SUPPLICATION", keys: ["37:100"], excerpt: fv(100), description: "My Lord, grant me a child from among the righteous — Ibrahim's supplication for offspring." });

  e.propheticNarratives.push({ label: "Ibrahim: sound-heart approach; questioning his father and people about desired falsehood; star-glance and illness statement; blow against the silent idols; the carving argument; furnace plot debased; emigration under guidance; tidings of a forbearing boy; dream-sacrifice dialogue and mutual submission; vision fulfilled and ransom with a great sacrifice; tidings and blessing of Isaac", keys: ["37:83","37:84","37:85","37:86","37:87","37:88","37:89","37:90","37:91","37:92","37:93","37:94","37:95","37:96","37:97","37:98","37:99","37:100","37:101","37:102","37:103","37:104","37:105","37:106","37:107","37:108","37:109","37:110","37:111","37:112","37:113"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Qalb salim (sound heart) as the manner of Ibrahim's approach to his Lord", keys: ["37:84"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Dream-sacrifice consultation at the age of exertion met with filial compliance conditioned on Allah's will and steadfastness", keys: ["37:102"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Mutual submission and forehead placement preceding the call that the vision was fulfilled, named the clear trial", keys: ["37:103","37:104","37:105","37:106"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Ransom with a great sacrifice replacing the son after the trial was fulfilled", keys: ["37:107"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Blessing of Ibrahim and Isaac whose descendants divide into the doer of good and the clearly unjust to himself", keys: ["37:113"], evidenceClass: "EXPLICIT_TEXT" });

  const salim = findWord(84, ["\u0633","\u0644","\u064a","\u0645"]);
  if (salim) e.terminology.push({ term: salim, transliteration: "salim", gloss: "sound/whole (of the heart) (editorial gloss)", keys: ["37:84"] });
  const dhibh = findWord(107, ["\u0630","\u0628","\u062d"]);
  if (dhibh) e.terminology.push({ term: dhibh, transliteration: "dhibh", gloss: "sacrifice/ransom offering (editorial gloss)", keys: ["37:107"] });
}

// === POPULATE P4 (37:114-148) ===
{
  const e = extractions[3];

  e.propheticNarratives.push({ label: "Musa and Harun: favor conferred, rescue from great affliction, support producing victory, explicit Scripture and straight-path guidance, lasting mention and peace", keys: ["37:114","37:115","37:116","37:117","37:118","37:119","37:120","37:121","37:122"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Ilyas: taqwa question to his people; rejection of Ba'l in favour of the best of creators, Lord of them and their forefathers; denial bringing presentation for punishment with the chosen-servant exemption", keys: ["37:123","37:124","37:125","37:126","37:127","37:128","37:129","37:130","37:131","37:132"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Lut: household saved except the wife among those remaining; the others destroyed; their sites passed morning and night as a reasoning challenge", keys: ["37:133","37:134","37:135","37:136","37:137","37:138"], evidenceClass: "EXPLICIT_TEXT" });
  e.propheticNarratives.push({ label: "Yunus: flight to the laden ship, lost lot, swallowing while blameworthy, prior glorification averting confinement until resurrection, sick shore-casting shaded by a gourd vine, mission to a hundred thousand or more who believed", keys: ["37:139","37:140","37:141","37:142","37:143","37:144","37:145","37:146","37:147","37:148"], evidenceClass: "EXPLICIT_TEXT" });

  e.humanConditionsAndSpiritualStates.push({ label: "Yunus swallowed while blameworthy after fleeing, with prior tasbih preventing confinement until the Day of resurrection", keys: ["37:142","37:143","37:144"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Destroyed sites passed by morning and night presented as an observable reasoning challenge", keys: ["37:137","37:138"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "A community of a hundred thousand or more believing and receiving enjoyment of life for a time", keys: ["37:147","37:148"], evidenceClass: "EXPLICIT_TEXT" });

  const bal = findWord(125, ["\u0628","\u0639","\u0644"]);
  if (bal) e.terminology.push({ term: bal, transliteration: "Ba'l", gloss: "name of the deity invoked by Ilyas's people (editorial gloss)", keys: ["37:125"] });
  const hut = findWord(142, ["\u062d","\u0648","\u062a"]);
  if (hut) e.terminology.push({ term: hut, transliteration: "hut", gloss: "fish/whale (editorial gloss)", keys: ["37:142"] });
}

// === POPULATE P5 (37:149-182) ===
{
  const e = extractions[4];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["37:149"], excerpt: fv(149), description: "So inquire of them whether their Lord has daughters while they have sons — interrogative refutation." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["37:157"], excerpt: fv(157), description: "Then produce your scripture, if you should be truthful — evidentiary demand." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["37:174"], excerpt: fv(174), description: "So leave them for a time — prophetic withdrawal command." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["37:179"], excerpt: fv(179), description: "And see, for they are going to see — mutual observation command." });

  e.humanConditionsAndSpiritualStates.push({ label: "Begetting attributed to Allah declared invented falsehood, with the choice of daughters over sons challenged as defective judgement", keys: ["37:151","37:152","37:153","37:154"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Angelic self-declaration: each has a known position, they line up and they exalt Allah", keys: ["37:164","37:165","37:166"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Conditional claim of sincerity had a former message reached them, invalidated by their actual disbelief", keys: ["37:167","37:168","37:169","37:170"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Prior word for the messenger servants guaranteeing their victory and the overcoming of divine soldiers", keys: ["37:171","37:172","37:173"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Claimed lineage between Allah and the jinn refuted by the jinn's knowledge that the claimants will be brought to punishment", keys: ["37:158"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Closing sequence: tasbih of the Lord of might above their descriptions, salam upon the messengers, hamd to the Lord of the worlds", keys: ["37:180","37:181","37:182"], evidenceClass: "EXPLICIT_TEXT" });

  const jinn = findWord(158, ["\u062c","\u0646","\u0629"]);
  if (jinn) e.terminology.push({ term: jinn, transliteration: "jinn", gloss: "jinn (editorial gloss)", keys: ["37:158"] });
}

// Write extraction files
for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `037-as-saffat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 037-as-saffat-p${num}.json`);
}

// === CANDIDATES (cand-1337..cand-1366, 30 total) ===
const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-037-p1,ext-037-p2,ext-037-p3,ext-037-p4,ext-037-p5",
  candidates: []
};

const CAND_DEFS = [
  // P1 (cand-1337..1342)
  { id: "cand-1337", label: "Angelic oath triad grounding the affirmation that God is One", def: "In 37:1-4: By those lined up in rows, those who drive, those who recite the message; indeed your God is One.", key: "37:1", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Three functional orders sworn by."},{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Ilahukum la-wahid."}] },
  { id: "cand-1338", label: "Lordship extending to the heavens, the earth and the sunrises", def: "In 37:5: Lord of the heavens and the earth and what is between them and Lord of the sunrises.", key: "37:5", overlap: [{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Rabb al-mashariq."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Cosmic scope of lordship."}] },
  { id: "cand-1339", label: "Star-adornment of the nearest heaven serving beauty and protection together", def: "In 37:6-7: We adorned the nearest heaven with an adornment of stars and as protection against every rebellious devil.", key: "37:6", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Zinat al-kawakib."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Guarded cosmic architecture."}] },
  { id: "cand-1340", label: "Devils barred from the exalted assembly with the stolen word pursued by a piercing flame", def: "In 37:8-10: They may not listen to the exalted assembly and are pelted from every side, repelled with constant punishment, except one who snatches by theft pursued by a piercing burning flame.", key: "37:8", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Expulsion and pursuit."},{topicId:"unseen-belief",layer:"scholarly",relationship:"same-concept",note:"Celestial hearing restricted."}] },
  { id: "cand-1341", label: "Creation from sticky clay answering the claim of superior difficulty", def: "In 37:11: Are they a stronger creation or those We created? Indeed We created them from sticky clay.", key: "37:11", overlap: [{topicId:"human-creation",layer:"scholarly",relationship:"same-concept",note:"Tin lazib origin."},{topicId:"resurrection-process",layer:"scholarly",relationship:"related-not-identical",note:"Created origin implies recreatability."}] },
  { id: "cand-1342", label: "Misleaders admitting no coercive authority while sharing punishment with followers", def: "In 37:28-33: You came at us from the right; rather you were not believers; we had no authority over you, you were a transgressing people; that Day they share the punishment.", key: "37:30", overlap: [{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"No sultan over the follower."},{topicId:"day-of-judgment",layer:"scholarly",relationship:"same-concept",note:"Shared adhab."}] },

  // P2 (cand-1343..1348)
  { id: "cand-1343", label: "Chosen servants exempted with determined provision and honor in gardens of pleasure", def: "In 37:40-44: But not the chosen servants of Allah; a provision determined, fruits, honored in gardens of pleasure on thrones facing one another.", key: "37:40", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Jannat al-na'im."},{topicId:"good-character",layer:"curated",relationship:"related-not-identical",note:"Ikhlas as exemption basis."}] },
  { id: "cand-1344", label: "Circulating cup free of bad effect and intoxication as perfected pleasure", def: "In 37:45-47: Circulated among them a cup from a flowing spring, white and delicious to the drinkers; no bad effect in it nor will they be intoxicated.", key: "37:45", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Ka's min ma'in."},{topicId:"balance-moderation",layer:"scholarly",relationship:"related-not-identical",note:"Pleasure without harm."}] },
  { id: "cand-1345", label: "Glance-restricted companions described as well-protected eggs", def: "In 37:48-49: With them women limiting their glances with large beautiful eyes, as if they were delicate well-protected eggs.", key: "37:48", overlap: [{topicId:"marriage-importance",layer:"scholarly",relationship:"same-concept",note:"Qasirat al-tarf."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Bayd maknun imagery."}] },
  { id: "cand-1346", label: "Divine favor acknowledged as the sole cause of escaping a companion's ruin", def: "In 37:56-57: By Allah you almost ruined me; if not for the favor of my Lord I would have been of those brought in.", key: "37:57", overlap: [{topicId:"divine-mercy",layer:"scholarly",relationship:"same-concept",note:"Ni'mat rabb as rescue."},{topicId:"trust-in-god",layer:"curated",relationship:"related-not-identical",note:"Attribution of salvation."}] },
  { id: "cand-1347", label: "Zaqqum contrasted with Paradise as torment issuing from Hellfire's base", def: "In 37:62-68: Is Paradise a better accommodation or the tree of zaqqum; a torment for wrongdoers issuing from the bottom of Hellfire, its fruit as heads of devils, eaten to fullness then mixed with scalding water.", key: "37:62", overlap: [{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Zaqqum and hamim."},{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Accommodation contrast."}] },
  { id: "cand-1348", label: "Nuh's call answered with rescue, surviving descendants and peace among the worlds", def: "In 37:75-82: Noah called Us and We are the best of responders; saved him and his family from great affliction; made his descendants those remaining; peace upon Noah among the worlds; then We drowned the disbelievers.", key: "37:75", overlap: [{topicId:"nuh-story",layer:"scholarly",relationship:"same-concept",note:"Rescue and survival."},{topicId:"supplication",layer:"curated",relationship:"same-concept",note:"Khayr al-mujibin."}] },

  // P3 (cand-1349..1354)
  { id: "cand-1349", label: "Sound heart as the manner of approaching the Lord", def: "In 37:84: When he came to his Lord with a sound heart.", key: "37:84", overlap: [{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Qalb salim."},{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Approach disposition."}] },
  { id: "cand-1350", label: "Idol-worship exposed as desired falsehood before the Lord of the worlds", def: "In 37:85-87: What do you worship? Is it falsehood as gods other than Allah you desire? Then what is your thought about the Lord of the worlds?", key: "37:86", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Ifk as object of desire."},{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Paternal interrogation."}] },
  { id: "cand-1351", label: "Silent non-eating idols struck after the star-glance and illness statement", def: "In 37:88-93: He cast a look at the stars and said I am about to be ill; they turned away; he said to their gods do you not eat, why do you not speak, and struck them with his right hand.", key: "37:91", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Iconoclastic demonstration."},{topicId:"signs-and-reflection",layer:"scholarly",relationship:"related-not-identical",note:"Impotence made visible."}] },
  { id: "cand-1352", label: "The carving argument: Allah created the worshippers and their works", def: "In 37:95-96: Do you worship that which you yourselves carve, while Allah created you and that which you do?", key: "37:95", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Maker-made reversal."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Creator of acts and objects."}] },
  { id: "cand-1353", label: "Furnace plot reversed into the debasement of the plotters", def: "In 37:97-98: Construct for him a furnace and throw him into the burning fire; they intended a plan but We made them the most debased.", key: "37:98", overlap: [{topicId:"ibrahim-story",layer:"scholarly",relationship:"same-concept",note:"Kayd reversed."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Al-asfalun outcome."}] },
  { id: "cand-1354", label: "Dream-sacrifice consultation answered by conditional filial steadfastness and ransom", def: "In 37:102-107: O my son I have seen in a dream that I must sacrifice you; O my father do as you are commanded, you will find me if Allah wills of the steadfast; you have fulfilled the vision; this was the clear trial; We ransomed him with a great sacrifice.", key: "37:102", overlap: [{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Consulted obedience."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Sabirin conditioned on Allah's will."}] },

  // P4 (cand-1355..1360)
  { id: "cand-1355", label: "Musa and Harun granted support, explicit Scripture and straight-path guidance", def: "In 37:114-118: We conferred favor upon Moses and Aaron, saved them and their people, supported them so they overcame, gave them the explicit Scripture and guided them on the straight path.", key: "37:114", overlap: [{topicId:"musa-story",layer:"scholarly",relationship:"same-concept",note:"Paired prophethood."},{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Kitab mubin grant."}] },
  { id: "cand-1356", label: "Ilyas confronting Ba'l worship with the best of creators and ancestral Lordship", def: "In 37:124-126: Will you not fear Allah? Do you call upon Ba'l and leave the best of creators, Allah your Lord and the Lord of your first forefathers?", key: "37:125", overlap: [{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Named deity rejected."},{topicId:"tawheed-rububiyyah",layer:"scholarly",relationship:"same-concept",note:"Ahsan al-khaliqin."}] },
  { id: "cand-1357", label: "Lut's household rescued with the wife counted among those remaining", def: "In 37:133-136: Lot was among the messengers; We saved him and his family all except his wife among those who remained; then We destroyed the others.", key: "37:135", overlap: [{topicId:"lut-story",layer:"scholarly",relationship:"same-concept",note:"Ghabirin exception."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Kinship does not exempt."}] },
  { id: "cand-1358", label: "Destroyed sites passed morning and night posed as a reasoning challenge", def: "In 37:137-138: You pass by them in the morning and at night; then will you not use reason?", key: "37:137", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Repeated spatial exposure."},{topicId:"knowledge-and-reflection",layer:"curated",relationship:"same-concept",note:"Afa-la ta'qilun."}] },
  { id: "cand-1359", label: "Yunus swallowed while blameworthy after flight and the lost lot", def: "In 37:139-142: He ran away to the laden ship, drew lots and was among the losers; the fish swallowed him while he was blameworthy.", key: "37:142", overlap: [{topicId:"yunus-story",layer:"scholarly",relationship:"same-concept",note:"Abaqa and mulam."},{topicId:"self-accountability",layer:"scholarly",relationship:"same-concept",note:"Consequence of departure."}] },
  { id: "cand-1360", label: "Prior glorification averting confinement until the Day of resurrection", def: "In 37:143-144: Had he not been of those who exalt Allah, he would have remained inside its belly until the Day they are resurrected.", key: "37:143", overlap: [{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Musabbihin habit."},{topicId:"repentance",layer:"curated",relationship:"related-not-identical",note:"Deliverance through tasbih."}] },

  // P5 (cand-1361..1366)
  { id: "cand-1361", label: "Daughter-attribution interrogated against their own preference for sons", def: "In 37:149-150: Does your Lord have daughters while they have sons, or did We create the angels as females while they were witnesses?", key: "37:149", overlap: [{topicId:"tawheed-asma-wa-sifat",layer:"scholarly",relationship:"same-concept",note:"Gender projection refuted."},{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Absent witnessing."}] },
  { id: "cand-1362", label: "Begetting declared invented falsehood with an evidentiary demand for scripture", def: "In 37:151-157: Out of their invented falsehood they say Allah has begotten; how do you make judgement; do you have a clear authority; then produce your scripture if you are truthful.", key: "37:157", overlap: [{topicId:"lying",layer:"scholarly",relationship:"same-concept",note:"Ifk and kadhibun."},{topicId:"evidence-standards",layer:"scholarly",relationship:"same-concept",note:"Sultan mubin demanded."}] },
  { id: "cand-1363", label: "Claimed jinn-lineage refuted by the jinn's own knowledge of presentation", def: "In 37:158: They claimed a lineage between Him and the jinn, but the jinn have already known that they will be brought to punishment.", key: "37:158", overlap: [{topicId:"jinn-creation",layer:"scholarly",relationship:"same-concept",note:"Nasab claim denied."},{topicId:"shirk-prohibition",layer:"scholarly",relationship:"same-concept",note:"Kinship attribution rejected."}] },
  { id: "cand-1364", label: "Angelic declaration of known station, ranked alignment and glorification", def: "In 37:164-166: There is not among us any except that he has a known position; we are those who line up and we are those who exalt Allah.", key: "37:164", overlap: [{topicId:"angelic-duties",layer:"scholarly",relationship:"same-concept",note:"Maqam ma'lum."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Musabbihun identity."}] },
  { id: "cand-1365", label: "Prior word guaranteeing messenger victory and the overcoming of divine soldiers", def: "In 37:171-173: Our word has already preceded for Our servants the messengers, that they would be given victory and that Our soldiers will be those who overcome.", key: "37:171", overlap: [{topicId:"prophets",layer:"curated",relationship:"same-concept",note:"Mansurun assurance."},{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Junduna ghalibun."}] },
  { id: "cand-1366", label: "Leave-and-see patience against punishment-impatience closing in tasbih, salam and hamd", def: "In 37:174-182: Leave them for a time and see; for Our punishment are they impatient; when it descends in their territory evil is the morning of those warned; exalted is your Lord the Lord of might; peace upon the messengers; praise to Allah Lord of the worlds.", key: "37:180", overlap: [{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Tawarru' temporizing."},{topicId:"remembrance",layer:"curated",relationship:"same-concept",note:"Tasbih-salam-hamd closure."}] }
];

// Evidence must cover every ayah the definition actually cites.
// Definitions open with "In S:A" or "In S:A-B"; expand that span into full-verse
// evidence so the semantic audit's F check (definition citation vs evidence keys)
// is satisfied by construction rather than by narrowing the prose.
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
  writeFileSync(path.join(OUT_DIR, "extractions", `037-as-saffat-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-061.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-061.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");
