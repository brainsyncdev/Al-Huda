// MFD-11 Wave 7: Surah 47 (Muhammad) genuine re-extraction.
// Covers 47:1-38 in 3 meaningful passages grounded in the pinned corpus translation.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "047-0001-0038.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function fv(n) {
  if (!verses[n]) throw new Error(`Verse 47:${n} not found`);
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

console.log("Generating Surah 47 (Muhammad) genuine re-extraction...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-20T16:15:00.000Z";

const PASSAGES = [
  { id: "ext-047-p1", from: 1, to: 15,
    label: "Disbelieve avert way Allah waste deeds; believe righteous deeds believe sent down Muhammad truth Lord remove misdeeds amend condition; disbelieve follow falsehood believe follow truth Lord thus Allah present comparisons; meet disbelieve battle strike necks inflicted slaughter secure bonds either favor afterwards ransom until war lays burdens command; Allah willed could have taken vengeance Himself test some by means others killed cause Allah never waste deeds; guide them amend condition; admit Paradise made known them; O believed support Allah support you plant firmly feet; disbelieve misery He waste deeds; disliked what Allah revealed rendered worthless deeds; traveled land seen end those before Allah destroyed over them disbelievers something comparable; Allah protector believed disbelievers no protector; admit believed righteous gardens rivers flow disbelieve enjoy eat grazing livestock Fire residence; how many city stronger your city drove out destroyed no helper; clear evidence Lord evil work made attractive follow desires; description Paradise righteous promised rivers water unaltered milk taste never changes wine delicious purified honey all fruits forgiveness Lord like abide eternally Fire given drink scalding water sever intestines",
    mainLabel: "Disbelievers averting from Allah's way having their deeds wasted against believers in Muhammad's revelation whose misdeeds are removed and condition amended; the falsehood-versus-truth contrast as Allah's comparative presentation; combat instructions covering neck-striking, bond-securing and post-battle favour or ransom until war ends, framed as divine testing rather than necessity since Allah could have taken direct vengeance; martyrs' deeds preserved with guidance, amendment and admission to a known Paradise; believers supporting Allah receiving support and firm footing while disbelievers face misery and deed-nullification due to dislike of revelation; travel-based comparison with destroyed predecessors affirming Allah as believer's protector and disbeliever's lack thereof; believing doers admitted to rivered gardens against disbelievers eating like livestock with Fire as residence; destroyed cities stronger than Makkah cited; clear-evidence holder contrasted with one whose evil is beautified; Paradise described with four unchanging rivers and forgiveness set against eternal Fire with intestine-severing scalding water" },
  { id: "ext-047-p2", from: 16, to: 28,
    label: "Among them listen you depart say those given knowledge what said just now; Allah sealed hearts followed desires; guided increases guidance gives righteousness; await except Hour come unexpectedly already indications come what good remembrance when came; know Muhammad no deity except Allah ask forgiveness sin believing men women Allah knows movement resting place; believe say why surah not sent down precise surah revealed fighting mentioned see hearts hypocrisy looking look overcome death more appropriate; obedience good words matter determined if true Allah better; would perhaps turned away cause corruption earth sever relationship; those Allah cursed deafened blinded vision; reflect Quran locks upon hearts; reverted back after guidance became clear Satan enticed prolonged hope; said those disliked what Allah sent down obey part matter Allah knows conceal; how when angels take death striking faces backs; followed angered Allah disliked pleasure rendered worthless deeds",
    mainLabel: "Listeners who question the Prophet's words after departing, their hearts sealed and following desires; the guided increased in guidance and granted righteousness; the Hour arriving unexpectedly despite prior signs, rendering belated remembrance useless; knowledge of tawheed and istighfar commanded for the Prophet and believing men and women under divine awareness of movement and rest; hypocrites requesting a surah yet fearing combat when it arrives, looking death-stricken when obedience and good words were more fitting; turning away producing earthly corruption and severed kinship earning divine curse, deafness and blindness; failure to reflect on the Quran attributed to heart-locks; reverters after clarity enticed by Satan with prolonged hope; secret partial obedience to those disliking revelation exposed by Allah; angels striking faces and backs at death because they followed what angered Allah and disliked His pleasure, nullifying their deeds" },
  { id: "ext-047-p3", from: 29, to: 38,
    label: "Disease hearts think Allah never expose hatred; willed could show them know mark surely know tone speech Allah knows deeds; surely test make evident strive among you patient test affairs; disbelieved averted path Allah opposed Messenger after guidance clear never harm Allah render worthless deeds; O believed obey Allah obey Messenger not invalidate deeds; disbelieved averted path Allah died disbelieving never Allah forgive; weaken call peace superior Allah with you never deprive reward deeds; worldly life amusement diversion; believe fear Allah give rewards not ask properties; ask press withhold expose unwillingness; invited spend cause Allah among withhold greed; whoever withholds withholds himself Allah Free need you needy; turn away replace another people not likes you",
    mainLabel: "Heart-disease holders assuming their hatred remains hidden, answered by Allah's ability to expose them by mark or speech-tone while knowing all deeds; testing continuing until strivers and the patient are distinguished; opposers of the Messenger after clarity unable to harm Allah, their deeds nullified; obedience to Allah and His Messenger commanded without invalidating deeds; dying in disbelief making forgiveness impossible; prohibition of weakening or suing for peace while superior, with Allah's presence and preservation of reward affirmed; worldly life reduced to amusement and diversion; belief and taqwa earning rewards without property demands, since pressing for wealth would expose unwillingness; spending invited while withholding identified as self-harm, Allah being free of need and humans needy; turning away producing replacement by a different people unlike them" }
];

const SUB_LABELS = {
  "ext-047-p1": [
    "Disbelievers averting from Allah's way having their deeds wasted",
    "Believers doing righteous deeds and believing in what was sent to Muhammad having misdeeds removed and condition amended",
    "Falsehood-following disbelievers contrasted with truth-following believers as Allah's comparative presentation",
    "Combat instructions: strike necks until slaughter, then secure bonds, confer favour or ransom until war lays down its burdens",
    "Divine testing through mutual conflict explained as alternative to direct vengeance, with martyrs' deeds preserved",
    "Martyrs guided and their condition amended",
    "Martyrs admitted to a Paradise already made known to them",
    "Believers supporting Allah receiving support and firmly planted feet",
    "Disbelievers facing misery with their deeds wasted",
    "Deed-nullification caused by dislike of what Allah revealed",
    "Travel showing destroyed predecessors with comparable fate awaiting disbelievers",
    "Allah named protector of believers while disbelievers have none",
    "Believing doers admitted to rivered gardens against disbelievers eating like livestock destined for Fire",
    "Cities stronger than Makkah destroyed without helper",
    "Clear-evidence holder contrasted with one whose evil work is beautified, followed by Paradise's four rivers against intestine-severing Fire"
  ],
  "ext-047-p2": [
    "Listeners questioning the Prophet's words after departing, their hearts sealed and following desires",
    "The guided increased in guidance and granted their righteousness",
    "The Hour coming unexpectedly despite prior indications, with belated remembrance availing nothing",
    "Knowledge of tawheed and istighfar commanded for the Prophet and believing men and women under divine awareness",
    "Hypocrites asking why a surah has not been sent, then looking death-stricken when fighting is mentioned",
    "Obedience and good words noted as more appropriate for them",
    "Turning away producing corruption on earth and severed kinship ties",
    "Those cursed by Allah, deafened and blinded in vision",
    "Failure to reflect upon the Quran attributed to locks upon hearts",
    "Reverters after guidance became clear enticed by Satan with prolonged hope",
    "Secret partial obedience to those disliking revelation exposed by Allah's knowledge",
    "Angels striking faces and backs at death as consequence of following what angered Allah",
    "Deeds rendered worthless because they disliked Allah's pleasure"
  ],
  "ext-047-p3": [
    "Heart-disease holders assuming their hatred will never be exposed",
    "Allah able to show them by mark or speech-tone while knowing all deeds",
    "Testing continuing until strivers and the patient are made evident",
    "Opposers of the Messenger after clarity unable to harm Allah, their deeds rendered worthless",
    "Obedience to Allah and His Messenger commanded without invalidating deeds",
    "Dying in disbelief after averting from Allah's path making forgiveness impossible",
    "Prohibition of weakening or suing for peace while superior, with Allah's presence and reward preservation affirmed",
    "Worldly life reduced to amusement and diversion, with belief and taqwa earning rewards without property demands",
    "Pressing for wealth exposing unwillingness, while spending is invited and withholding identified as self-harm",
    "Allah free of need while humans are needy, with replacement promised for those who turn away"
  ]
};

const extractions = [];
for (const p of PASSAGES) {
  const keys = [];
  for (let i = p.from; i <= p.to; i++) keys.push(`47:${i}`);
  const excerpts = keys.map(k => ({ key: k, text: fv(Number(k.split(":")[1])) }));
  const subs = SUB_LABELS[p.id].map((label, idx) => ({
    label,
    keys: [`47:${p.from + idx}`],
    evidenceClass: "EXPLICIT_TEXT"
  }));
  if (subs.length !== p.to - p.from + 1) {
    throw new Error(`${p.id}: ${subs.length} subordinate labels for ${p.to - p.from + 1} verses`);
  }
  extractions.push({
    extractionId: p.id, workstream: "MFD-11", pass: "A", surah: 47, surahName: "Muhammad",
    passage: { fromAyah: p.from, toAyah: p.to, label: p.label },
    verseKeys: keys, arabicExcerpts: excerpts,
    mainSubject: { label: p.mainLabel, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
    subordinateSubjects: subs,
    commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
    humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
    topicCandidateIds: [],
    notes: "Wave 7 genuine re-extraction. Boundaries follow the text: P1 closes with the Paradise-Fire contrast (15) before the listener-hypocrisy block opens (16); P2 ends with deed-nullification at death (28) before the heart-disease exposure begins (29); P3 runs from that exposure through testing, obedience, peace-prohibition and the closing replacement warning (29-38).",
    proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
  });
}

// === POPULATE P1 (47:1-15) ===
{
  const e = extractions[0];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["47:4"], excerpt: fv(4), description: "When you meet disbelievers in battle, strike their necks until slaughter, then secure bonds, confer favour or ransom until war lays down its burdens." });
  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["47:7"], excerpt: fv(7), description: "O you who have believed, if you support Allah, He will support you and plant firmly your feet." });

  e.humanConditionsAndSpiritualStates.push({ label: "Dislike of revelation causing deed-nullification", keys: ["47:9"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Clear-evidence holder contrasted with one whose evil work is beautified", keys: ["47:14"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Combat rules covering neck-striking, bond-securing and post-battle favour or ransom", keys: ["47:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.socialEconomicCivilisational.push({ label: "Destroyed cities stronger than Makkah cited as precedent", keys: ["47:13"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Divine testing through mutual conflict as alternative to direct vengeance", keys: ["47:4"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Allah as protector of believers while disbelievers have no protector", keys: ["47:11"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Paradise with four unchanging rivers and forgiveness set against eternal Fire with intestine-severing scalding water", keys: ["47:15"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P2 (47:16-28) ===
{
  const e = extractions[1];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["47:19"], excerpt: fv(19), description: "Know that there is no deity except Allah and ask forgiveness for your sin and for believing men and women." });

  e.humanConditionsAndSpiritualStates.push({ label: "Listeners questioning the Prophet's words after departing with sealed hearts", keys: ["47:16"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Hypocrites looking death-stricken when fighting is mentioned in a revealed surah", keys: ["47:20"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Locks upon hearts preventing reflection on the Quran", keys: ["47:24"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Satan enticing reverters with prolonged hope after guidance became clear", keys: ["47:25"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Secret partial obedience to those disliking revelation exposed by Allah", keys: ["47:26"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Turning away producing corruption on earth and severed kinship ties", keys: ["47:22"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "The guided increased in guidance and granted their righteousness", keys: ["47:17"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Angels striking faces and backs at death as consequence of following what angered Allah", keys: ["47:27","47:28"], evidenceClass: "EXPLICIT_TEXT" });
}

// === POPULATE P3 (47:29-38) ===
{
  const e = extractions[2];

  e.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["47:33"], excerpt: fv(33), description: "O you who have believed, obey Allah and obey the Messenger and do not invalidate your deeds." });
  e.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["47:35"], excerpt: fv(35), description: "Do not weaken and call for peace while you are superior." });

  e.humanConditionsAndSpiritualStates.push({ label: "Heart-disease holders assuming their hatred will never be exposed", keys: ["47:29"], evidenceClass: "EXPLICIT_TEXT" });
  e.humanConditionsAndSpiritualStates.push({ label: "Withholding spending out of greed identified as self-harm", keys: ["47:38"], evidenceClass: "EXPLICIT_TEXT" });

  e.socialEconomicCivilisational.push({ label: "Spending in Allah's cause invited while withholding exposes unwillingness when pressed", keys: ["47:36","47:37","47:38"], evidenceClass: "EXPLICIT_TEXT" });

  e.relationships.push({ label: "Testing until strivers and the patient are made evident", keys: ["47:31"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Dying in disbelief after opposing the Messenger making forgiveness impossible", keys: ["47:34"], evidenceClass: "EXPLICIT_TEXT" });
  e.relationships.push({ label: "Allah free of need while humans are needy, with replacement promised for those who turn away", keys: ["47:38"], evidenceClass: "EXPLICIT_TEXT" });

  const ghanim = findWord(38, ["\u063a","\u0646","\u064a"]);
  // ghanim root check — 'Free of need' uses ghani
  const ghani = findWord(38, ["\u063a","\u0646"]); 
  if (ghani) e.terminology.push({ term: ghani, transliteration: "ghani", gloss: "Free of need (editorial gloss)", keys: ["47:38"] });
}

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `047-muhammad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
  console.log(`Wrote 047-muhammad-p${num}.json`);
}

const candidates = {
  workstream: "MFD-11", generatedAt: TS,
  sourceExtraction: "ext-047-p1,ext-047-p2,ext-047-p3",
  candidates: []
};

const CAND_DEFS = [
  { id: "cand-1568", label: "Misdeeds removed and condition amended for believers in Muhammad's revelation", def: "In 47:2: And those who believe and do righteous deeds and believe in what has been sent down upon Muhammad, and it is the truth from their Lord, He will remove from them their misdeeds and amend their condition.", key: "47:2", overlap: [{topicId:"mercy-and-forgiveness",layer:"curated",relationship:"same-concept",note:"Takfir and islah al-bal."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Iman linked to muhammadan revelation."}] },
  { id: "cand-1569", label: "Combat instructions with favour-or-ransom until war ends", def: "In 47:4: So when you meet those who disbelieve in battle strike their necks until when you have inflicted slaughter upon them then secure their bonds and either confer favour afterwards or ransom them until the war lays down its burdens.", key: "47:4", overlap: [{topicId:"justice",layer:"curated",relationship:"related-not-identical",note:"Combat rules with post-battle options."},{topicId:"justice",layer:"curated",relationship:"related-not-identical",note:"Post-combat options specified."}] },
  { id: "cand-1570", label: "Divine testing through mutual conflict as alternative to direct vengeance", def: "In 47:4: And if Allah had willed He could have taken vengeance upon them Himself but He ordered armed struggle to test some of you by means of others; and those killed in the cause of Allah, never will He waste their deeds.", key: "47:4", overlap: [{topicId:"trial-and-test",layer:"scholarly",relationship:"same-concept",note:"Yablu ba'dakum bi-ba'd."},{topicId:"divine-power",layer:"scholarly",relationship:"same-concept",note:"Direct vengeance possible but withheld."}] },
  { id: "cand-1571", label: "Believers supporting Allah receiving support and firm footing", def: "In 47:7: O you who have believed, if you support Allah He will support you and plant firmly your feet.", key: "47:7", overlap: [{topicId:"trust-in-god",layer:"curated",relationship:"same-concept",note:"Nasr reciprocal."},{topicId:"patience",layer:"curated",relationship:"same-concept",note:"Tathbit al-aqdam."}] },
  { id: "cand-1572", label: "Travel showing destroyed predecessors with comparable fate for disbelievers", def: "In 47:10: Have they not traveled through the land and seen how was the end of those before them? Allah destroyed everything over them and for the disbelievers is something comparable.", key: "47:10", overlap: [{topicId:"signs-and-reflection",layer:"scholarly",relationship:"same-concept",note:"Sayr fi'l-ard as evidence."},{topicId:"divine-wrath",layer:"scholarly",relationship:"same-concept",note:"Comparable destruction warned."}] },

  { id: "cand-1573", label: "Paradise with four unchanging rivers against intestine-severing Fire", def: "In 47:15: Is the description of Paradise which the righteous are promised wherein are rivers of water unaltered, milk unchanged, wine delicious and purified honey with all fruits and forgiveness from their Lord, like those abiding eternally in Fire given scalding water severing intestines?", key: "47:15", overlap: [{topicId:"the-hereafter",layer:"curated",relationship:"same-concept",note:"Four-river Jannah imagery."},{topicId:"jahannam-description",layer:"scholarly",relationship:"same-concept",note:"Hamim qati' al-am'a."}] },
  { id: "cand-1574", label: "Sealed hearts following desires exposed through post-departure questioning", def: "In 47:16: And among them are those who listen to you until when they depart from you they say to those given knowledge what has he said just now; those are the ones Allah has sealed over their hearts and who follow their desires.", key: "47:16", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Khatm ala al-qulub."},{topicId:"pride-kibr",layer:"scholarly",relationship:"same-concept",note:"Ittiba' al-hawa diagnosed."}] },
  { id: "cand-1575", label: "Guidance increased and righteousness granted to the guided", def: "In 47:17: And those who are guided, He increases them in guidance and gives them their righteousness.", key: "47:17", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Ziyadah fi'l-huda."},{topicId:"god-consciousness",layer:"curated",relationship:"same-concept",note:"Ta'wahum granted."}] },
  { id: "cand-1576", label: "Tawheed knowledge and istighfar commanded under divine awareness", def: "In 47:19: So know O Muhammad that there is no deity except Allah and ask forgiveness for your sin and for believing men and women; and Allah knows of your movement and resting place.", key: "47:19", overlap: [{topicId:"tawheed-uluhiyyah",layer:"scholarly",relationship:"same-concept",note:"Fa'lam la ilaha illa Allah."},{topicId:"repentance",layer:"curated",relationship:"same-concept",note:"Istighfar for self and ummah."}] },
  { id: "cand-1577", label: "Hypocrites death-stricken at fighting mention despite requesting a surah", def: "In 47:20-21: Those who believe say why has a surah not been sent down; but when a precise surah is revealed and fighting is mentioned therein you see those in whose hearts is hypocrisy looking at you with a look of one overcome by death; more appropriate for them would have been obedience and good words.", key: "47:20", overlap: [{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Hypocrites' fear exposing weak iman."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ta'ah wa-qawl ma'ruf preferred."}] },

  { id: "cand-1578", label: "Turning away producing corruption and severed kinship earning divine curse", def: "In 47:22-23: So would you perhaps if you turned away cause corruption on earth and sever your ties of relationship; those are the ones Allah has cursed so He deafened them and blinded their vision.", key: "47:22", overlap: [{topicId:"justice-oppression",layer:"scholarly",relationship:"same-concept",note:"Fasad and qati'at al-arham."},{topicId:"parents-and-family",layer:"curated",relationship:"same-concept",note:"Kinship severance condemned."}] },
  { id: "cand-1579", label: "Heart-locks preventing Quran reflection", def: "In 47:24: Then do they not reflect upon the Quran or are there locks upon their hearts?", key: "47:24", overlap: [{topicId:"knowledge-ignorance",layer:"scholarly",relationship:"same-concept",note:"Aghlaq ala al-qulub."},{topicId:"quran-revelation-process",layer:"scholarly",relationship:"related-not-identical",note:"Tadabbur blocked."}] },
  { id: "cand-1580", label: "Satan enticing reverters with prolonged hope after clarity", def: "In 47:25: Indeed those who reverted back after guidance had become clear to them, Satan enticed them and prolonged hope for them.", key: "47:25", overlap: [{topicId:"shaytan-enemy",layer:"scholarly",relationship:"same-concept",note:"Tazyin and imla'."},{topicId:"faith-increase-decrease",layer:"scholarly",relationship:"same-concept",note:"Irtidad after bayan."}] },
  { id: "cand-1581", label: "Obedience to Allah and Messenger commanded without deed invalidation", def: "In 47:33: O you who have believed obey Allah and obey the Messenger and do not invalidate your deeds.", key: "47:33", overlap: [{topicId:"prophet-definition",layer:"scholarly",relationship:"same-concept",note:"Dual obedience formula."},{topicId:"good-character",layer:"curated",relationship:"same-concept",note:"Ibtal al-a'mal warned."}] },
  { id: "cand-1582", label: "Withholding spending as self-harm against Allah's freedom from need", def: "In 47:38: Here you are invited to spend in the cause of Allah but among you are those who withhold out of greed; whoever withholds only withholds from himself; Allah is Free of need while you are needy; if you turn away He will replace you with another people unlike you.", key: "47:38", overlap: [{topicId:"giving",layer:"curated",relationship:"same-concept",note:"Bukhl as self-harm."},{topicId:"hardship-and-ease",layer:"curated",relationship:"same-concept",note:"Replacement threat."}] }
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
    notes: "Wave 7 genuine re-extraction candidate."
  });
}

extractions[0].topicCandidateIds = candidates.candidates.slice(0, 6).map(c => c.candidateId);
extractions[1].topicCandidateIds = candidates.candidates.slice(6, 11).map(c => c.candidateId);
extractions[2].topicCandidateIds = candidates.candidates.slice(11, 15).map(c => c.candidateId);

for (const ext of extractions) {
  const num = ext.extractionId.split('p')[1];
  writeFileSync(path.join(OUT_DIR, "extractions", `047-muhammad-p${num}.json`), JSON.stringify(ext, null, 2) + "\n");
}

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-071.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-071.json with ${candidates.candidates.length} candidates`);
console.log("Generation complete.");