// MFD-11 Pilot 10 generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Al-Baqarah 2:183-214 (Passages 29-32, Candidates cand-0097..cand-0106).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "002-0183-0214.json");
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

console.log("Generating pilot 10 files from verbatim corpus (2:183-214)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-18T17:10:00.000Z";

// ─── Passage 29: 2:183–187 ────────────────────────────────────────────────────────
const p29 = {
  extractionId: "ext-002-p29",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 183, toAyah: 187, label: "Al-Baqarah — Fasting prescribed for taqwa; numbered days; exemptions for ill/travelers with make-up days; fidya for those unable; voluntary good is better; eat and drink until white thread distinct from black at dawn; complete fast to night; do not approach spouses while in itikaf in masjids; these are Allah's limits so people may attain taqwa" },
  verseKeys: ["2:183","2:184","2:185","2:186","2:187"],
  arabicExcerpts: Array.from({length:5}, (_,i) => ({ key: `2:${i+183}`, text: fv(i+183) })),
  mainSubject: {
    label: "Fasting prescribed upon believers as upon predecessors for attaining taqwa; specified numbered days; exemptions for sick and travelers with obligation to make up; fidya (ransom) for those who can fast only with hardship; voluntary extra good is better; fasting is better if known; timing boundaries: eat/drink until dawn white thread distinct from black; complete fast to nightfall; prohibition of marital intimacy during itikaf retreat in mosques; divine limits established for taqwa",
    keys: ["2:183","2:184","2:185","2:186","2:187"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Fasting prescribed for taqwa (la'allakum tattaqoon)", keys: ["2:183"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Numbered days (ayyaman ma'doodat)", keys: ["2:184"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exemption: sick or traveling — make up other days", keys: ["2:184","2:185"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fidya: feeding a poor person for those able only with hardship", keys: ["2:184"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Voluntary extra good is better; fasting is better if you knew", keys: ["2:184"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ramadan: month of Quran revelation as guidance and clear proofs", keys: ["2:185"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah intends ease not hardship; completion of count; magnifying Allah for guidance; gratitude", keys: ["2:185"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine nearness: when servants ask about Me I am near, answer caller", keys: ["2:186"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Response required: respond to Me, believe in Me for right guidance", keys: ["2:186"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Timing: eat/drink until white thread distinct from black thread of dawn", keys: ["2:187"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Complete fast to night", keys: ["2:187"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: do not approach spouses during itikaf in masjids", keys: ["2:187"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "These are Allah's hudud (limits); do not approach them", keys: ["2:187"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Taqwa as purpose and outcome of fasting", keys: ["2:183","2:187"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine ease vs hardship: Allah wants ease not difficulty", keys: ["2:185"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gratitude (shukr) linked to completing fast and magnifying Allah", keys: ["2:185"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0097","cand-0098"],
  notes: "Pass A pilot 10, passage 29/4. Core fasting legislation. Contains divine nearness declaration (2:186) embedded within fasting context. Establishes Ramadan as Quran-revelation month. Links to sawm/fasting (new candidate), shukr-gratitude, divine-mercy.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P29
{
  // 2:183 - Command: fasting prescribed
  p29.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:183"], excerpt: fv(183), description: "Command: fasting prescribed upon believers for attaining taqwa." });

  // 2:187 - Prohibition: do not approach spouses during itikaf
  const t187 = fv(187);
  const walaIdx = t187.indexOf("\u0648\u064e\u0644\u064e\u0627 \u062a\u064f\u0628\u064e\u0627\u0634\u0650\u0631\u064f\u0648\u0647\u064f\u0646\u0651");
  if (walaIdx >= 0) {
    p29.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:187"], excerpt: fv(187), description: "Prohibition: do not have intimate contact with spouses while in itikaf retreat in mosques." });
  }
}

// Extract divine names from P29
{
  // Aleem Samee' from 2:186 (if present)
  const t186 = fv(186);
  const sameeIdx = t186.indexOf("\u0633\u064e\u0645\u0650\u064a\u0639\u064c");
  if (sameeIdx >= 0) {
    // Find the full pair if possible
    const aleemSamee = t186.indexOf("\u0633\u064e\u0645\u0650\u064a\u0639\u064c \u0639\u064e\u0644\u0650\u064a\u0645\u064c");
    if (aleemSamee >= 0) {
      p29.divineNamesAndAttributes.push({ term: t186.slice(aleemSamee, aleemSamee + 12), transliteration: "Samee' Aleem", gloss: "Hearing, Knowing (editorial gloss)", keys: ["2:186"] });
    }
  }
}

// Extract terminology from P29
{
  // Taqwa from 2:183
  const t183 = fv(183);
  const taqwaIdx = t183.indexOf("\u062a\u064e\u062a\u0651\u064e\u0642\u064f\u0648\u0646\u064e");
  if (taqwaIdx >= 0) {
    p29.terminology.push({ term: t183.slice(taqwaIdx, taqwaIdx + 8), transliteration: "tattaqoon", gloss: "attain taqwa/God-consciousness (editorial gloss)", keys: ["2:183"] });
  }

  // Fidya from 2:184
  const t184 = fv(184);
  const fidyaIdx = t184.indexOf("\u0641\u0650\u062f\u0652\u064a\u064e\u0629\u064c");
  if (fidyaIdx >= 0) {
    p29.terminology.push({ term: t184.slice(fidyaIdx, fidyaIdx + 7), transliteration: "fidyah", gloss: "ransom/redemption payment (editorial gloss)", keys: ["2:184"] });
  }

  // Itikaf from 2:187
  const t187b = fv(187);
  const itikafIdx = t187b.indexOf("\u0639\u064e\u0627\u0643\u0650\u0641\u0650\u064a\u0646\u064e");
  if (itikafIdx >= 0) {
    p29.terminology.push({ term: t187b.slice(itikafIdx, itikafIdx + 8), transliteration: "'akifeen", gloss: "those in spiritual retreat/itikaf (editorial gloss)", keys: ["2:187"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p29.json"), JSON.stringify(p29, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p29.json");

// ─── Passage 30: 2:188–195 ────────────────────────────────────────────────────────
const p30 = {
  extractionId: "ext-002-p30",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 188, toAyah: 195, label: "Al-Baqarah — Do not consume wealth unjustly nor bribe authorities to devour people's wealth knowingly; new moons are timing markers for people and hajj; righteousness is not entering houses from backs but whoever fears Allah; fight in Allah's way those who fight you but do not transgress; kill them where found; expel them from where they expelled you; fitnah worse than killing; do not fight at sacred mosque unless fought there; if they cease Allah is Ghafoor Raheem; fight until no fitnah and religion is for Allah; if they cease no hostility except against oppressors; sacred month for sacred month; retaliation for violations; whoever transgresses against you retaliate likewise; fear Allah; spend in Allah's way; do not throw selves into destruction; do good — Allah loves muhsinin" },
  verseKeys: ["2:188","2:189","2:190","2:191","2:192","2:193","2:194","2:195"],
  arabicExcerpts: Array.from({length:8}, (_,i) => ({ key: `2:${i+188}`, text: fv(i+188) })),
  mainSubject: {
    label: "Prohibition of unjust wealth consumption and bribery of authorities; crescent moons as timing markers; righteousness defined by taqwa not ritual formality; rules of engagement: fight those who fight you without transgression; kill where found; expulsion justified by prior expulsion; fitnah worse than killing; sacred mosque protection with reciprocal defense; cessation condition: if enemies stop Allah is Forgiving Merciful; fight until fitnah ends and religion belongs to Allah; sacred month reciprocity; proportional retaliation permitted; spending in Allah's way commanded; self-destruction prohibited; ihsan (excellence) loved by Allah",
    keys: ["2:188","2:189","2:190","2:191","2:192","2:193","2:194","2:195"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Prohibition: consuming wealth unjustly (bil-batil)", keys: ["2:188"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition: bribing authorities to devour others' wealth knowingly", keys: ["2:188"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Crescents as timing markers for people and hajj", keys: ["2:189"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Righteousness is taqwa not entering houses from backs", keys: ["2:189"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fight those who fight you; do not transgress", keys: ["2:190"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Kill them where found; expel from where expelled", keys: ["2:191"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fitnah ashaddu min al-qatl (persecution worse than killing)", keys: ["2:191"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not fight at sacred mosque unless fought there", keys: ["2:191"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "If they cease: Allah Ghafoor Raheem", keys: ["2:192"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fight until no fitnah and din is for Allah", keys: ["2:193"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sacred month for sacred month; hurumat qisas", keys: ["2:194"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Proportional retaliation: fa-i'tadoo bi-mithl", keys: ["2:194"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spend in Allah's way; do not cast selves into destruction", keys: ["2:195"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do good: Allah loves muhsinin", keys: ["2:195"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Fitnah (religious persecution/oppression) as graver evil than killing", keys: ["2:191","2:193"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-destruction through stinginess or recklessness in spending", keys: ["2:195"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Rules of armed engagement with proportionality and cessation conditions", keys: ["2:190","2:191","2:192","2:193","2:194"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Anti-corruption: prohibition of bribery and unjust wealth acquisition", keys: ["2:188"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0099","cand-0100","cand-0101"],
  notes: "Pass A pilot 10, passage 30/4. Warfare ethics passage with strict proportionality. Fitnah-as-worse-than-killing is key interpretive crux. Anti-corruption verse (2:188) bridges economic ethics. Links to warfare-ethics (new candidate), wealth-property (new candidate), divine-mercy.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P30
{
  // 2:188 - Prohibition: unjust wealth
  p30.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:188"], excerpt: fv(188), description: "Prohibition: do not consume wealth among yourselves unjustly or bribe authorities to devour others' property knowingly." });

  // 2:190 - Command: fight those who fight you; Prohibition: do not transgress
  p30.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:190"], excerpt: fv(190), description: "Command: fight in Allah's way those who fight you." });
  p30.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:190"], excerpt: fv(190), description: "Prohibition: do not transgress limits in warfare; Allah does not love transgressors." });

  // 2:195 - Command: spend in Allah's way; Prohibition: self-destruction
  p30.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:195"], excerpt: fv(195), description: "Command: spend in the way of Allah." });
  p30.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:195"], excerpt: fv(195), description: "Prohibition: do not throw yourselves into destruction with your own hands." });
}

// Extract divine names from P30
{
  // Ghafoor Raheem from 2:192
  const t192 = fv(192);
  const ghafoorIdx = t192.indexOf("\u063a\u064e\u0641\u064f\u0648\u0631\u064c \u0631\u0651\u064e\u062d\u0650\u064a\u0645\u064c");
  if (ghafoorIdx >= 0) {
    p30.divineNamesAndAttributes.push({ term: t192.slice(ghafoorIdx, ghafoorIdx + 12), transliteration: "Ghafoor Raheem", gloss: "Forgiving, Merciful (editorial gloss)", keys: ["2:192"] });
  }
}

// Extract terminology from P30
{
  // Fitnah from 2:191
  const t191 = fv(191);
  const fitnahIdx = t191.indexOf("\u0671\u0644\u0652\u0641\u0650\u062a\u0652\u0646\u064e\u0629\u064f");
  if (fitnahIdx >= 0) {
    p30.terminology.push({ term: t191.slice(fitnahIdx, fitnahIdx + 9), transliteration: "al-fitnah", gloss: "persecution/trial/civil strife (editorial gloss)", keys: ["2:191"] });
  }

  // Muhsinin from 2:195
  const t195 = fv(195);
  const muhsinIdx = t195.indexOf("\u0671\u0644\u0652\u0645\u064f\u062d\u0652\u0633\u0650\u0646\u0650\u064a\u0646\u064e");
  if (muhsinIdx >= 0) {
    p30.terminology.push({ term: t195.slice(muhsinIdx, muhsinIdx + 12), transliteration: "al-muhsineen", gloss: "those who do good/excellence (editorial gloss)", keys: ["2:195"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p30.json"), JSON.stringify(p30, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p30.json");

// ─── Passage 31: 2:196–203 ────────────────────────────────────────────────────────
const p31 = {
  extractionId: "ext-002-p31",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 196, toAyah: 203, label: "Al-Baqarah — Complete hajj and umrah for Allah; if prevented send offering; do not shave heads until offering reaches place; tamattu'/qiran obligations: sacrifice or fast three days in hajj and seven on return; ten complete for those whose families not near sacred mosque; fear Allah severe in punishment; provision for journey; best provision is taqwa; remember Allah at Mash'ar al-Haram as He guided you though before you were astray; hasten from where people hasten; seek forgiveness; when rites completed remember Allah as you remembered fathers or more intensely; some say give us in this world only — no share in hereafter; others say give us good in both worlds and protect from Fire" },
  verseKeys: ["2:196","2:197","2:198","2:199","2:200","2:201","2:202","2:203"],
  arabicExcerpts: Array.from({length:8}, (_,i) => ({ key: `2:${i+196}`, text: fv(i+196) })),
  mainSubject: {
    label: "Completion of hajj and umrah for Allah; prevention protocol: send sacrificial offering; head-shaving deferred until offering arrives; tamattu'/qiran compensation: sacrifice or fasting (3 days during hajj + 7 after return = 10 complete); applicability to those whose families not near Sacred Mosque; taqwa as best provision; remembrance at Mash'ar al-Haram acknowledging prior misguidance and divine guidance; procession from Arafat with istighfar; post-rite dhikr compared to ancestral remembrance but intensified; two types of supplicants: worldly-only seekers with no hereafter share vs. dual-world seekers protected from Fire",
    keys: ["2:196","2:197","2:198","2:199","2:200","2:201","2:202","2:203"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Complete hajj and umrah for Allah", keys: ["2:196"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prevention: send offering; do not shave until it reaches place", keys: ["2:196"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tamattu'/qiran compensation: sacrifice or fasting alternative", keys: ["2:196"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ten-day fast formula for distant families", keys: ["2:196"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fear Allah; severe in punishment", keys: ["2:196"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Best provision is taqwa", keys: ["2:197"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No blame seeking bounty from Rabb during hajj", keys: ["2:198"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remember Allah at Mash'ar al-Haram after prior misguidance", keys: ["2:198"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hasten from where people hasten; seek forgiveness", keys: ["2:199"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-rite dhikr: remember Allah as you remembered fathers or more", keys: ["2:200"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly-only supplicant: no share in hereafter", keys: ["2:200"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dual-world supplicant: good in both + protection from Fire", keys: ["2:201"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Those have share of what they earned; Allah swift in account", keys: ["2:202"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remember Allah in appointed days; hastening or delaying valid", keys: ["2:203"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Prior misguidance acknowledged: 'you were astray before He guided you'", keys: ["2:198"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Two orientations of du'a: materialist vs. comprehensive", keys: ["2:200","2:201"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Permissibility of trade/commerce during pilgrimage", keys: ["2:198"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0102","cand-0103"],
  notes: "Pass A pilot 10, passage 31/4. Hajj legislation core. Contains famous dual-world du'a (rabbana atina...). Contrasts two types of human aspiration. Links to hajj-umrah-pilgrimage (new candidate), sabr-patience (via taqwa provision).",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P31
{
  // 2:196 - Command: complete hajj and umrah
  p31.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:196"], excerpt: fv(196), description: "Command: complete the hajj and umrah for Allah." });

  // 2:203 - Command: remember Allah in appointed days
  p31.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:203"], excerpt: fv(203), description: "Command: remember Allah during the appointed/numbered days of hajj." });
}

// Extract divine names from P31
{
  // Shadeed al-iqab from 2:196
  const t196 = fv(196);
  const shadeedIdx = t196.indexOf("\u0634\u064e\u062f\u0650\u064a\u062f\u064f \u0671\u0644\u0652\u0639\u0650\u0642\u064e\u0627\u0628\u0650");
  if (shadeedIdx >= 0) {
    p31.divineNamesAndAttributes.push({ term: t196.slice(shadeedIdx, shadeedIdx + 15), transliteration: "Shadeed al-Iqab", gloss: "Severe in Penalty (editorial gloss)", keys: ["2:196"] });
  }
}

// Extract terminology from P31
{
  // Tamattu' from 2:196
  const t196b = fv(196);
  const tamattuIdx = t196b.indexOf("\u062a\u064e\u0645\u064e\u062a\u0651\u064e\u0639\u064e");
  if (tamattuIdx >= 0) {
    p31.terminology.push({ term: t196b.slice(tamattuIdx, tamattuIdx + 7), transliteration: "tamatta'a", gloss: "enjoyment-type pilgrimage combining umrah and hajj (editorial gloss)", keys: ["2:196"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p31.json"), JSON.stringify(p31, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p31.json");

// ─── Passage 32: 2:204–214 ────────────────────────────────────────────────────────
const p32 = {
  extractionId: "ext-002-p32",
  workstream: "MFD-11",
  pass: "A",
  surah: 2,
  surahName: "Al-Baqarah",
  passage: { fromAyah: 204, toAyah: 214, label: "Al-Baqarah — Among people one whose speech pleases in worldly life yet most quarrelsome opponent; when turns away strives to cause corruption destroying crops and livestock; Allah does not love corruption; when told fear Allah pride seizes him in sin; Hell sufficient for him; among people one sells self seeking Allah's pleasure; Allah Kind to servants; enter into peace completely; do not follow footsteps of shaytan; he is clear enemy; if you slip after clear signs came know Allah is Mighty Wise; do they wait for anything but Allah's decree or angels or your Lord to come in shadows of clouds? Matter decided; ask Bani Israel how many clear signs We brought; whoever changes favor of Allah after receiving it — Allah severe in punishment; adorned for disbelievers is worldly life; they mock believers; those with taqwa above them on Day of Judgment; Allah provides without measure; mankind was one community then disagreed; Allah sent prophets with truth and Book to judge differences; only those given Scripture differed after clear proofs came out of envy; Allah guided believers to truth regarding their dispute; Allah guides whom He wills to straight path" },
  verseKeys: ["2:204","2:205","2:206","2:207","2:208","2:209","2:210","2:211","2:212","2:213","2:214"],
  arabicExcerpts: Array.from({length:11}, (_,i) => ({ key: `2:${i+204}`, text: fv(i+204) })),
  mainSubject: {
    label: "Two archetypal persons contrasted: pleasing-tongued hypocrite who spreads corruption destroying agriculture and livestock vs. one who sells himself seeking Allah's pleasure; divine kindness to servants; command to enter peace/silm completely; prohibition of following shaytan's footsteps; warning against slipping after receiving clear signs; eschatological waiting: only Allah's decree remains; Bani Israel precedent: numerous clear signs brought; changing divine favor incurs severe punishment; worldly life adorned for disbelievers who mock believers; muttaqoon elevated above them on Judgment Day; unlimited divine provision; humanity originally one community then diverged; prophets sent with Book to judge disputes; disagreement arose from envy after knowledge came; Allah guides believers to truth in disputed matters; divine guidance to straight path",
    keys: ["2:204","2:205","2:206","2:207","2:208","2:209","2:210","2:211","2:212","2:213","2:214"],
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Type 1: pleasing speech but quarrelsome opponent (aladd al-khisam)", keys: ["2:204"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Corruption: destroying crops and livestock when turning away", keys: ["2:205"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah does not love fasad (corruption)", keys: ["2:205"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Pride in sin when told to fear Allah; Jahannam sufficient", keys: ["2:206"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Type 2: sells self seeking Allah's pleasure", keys: ["2:207"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah Ra'oof bil-ibad (Kind to servants)", keys: ["2:207"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Enter into silm (peace/submission) completely", keys: ["2:208"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not follow khutuwat al-shaytan; clear enemy", keys: ["2:208"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Warning: slipping after bayyinat — Allah Aziz Hakeem", keys: ["2:209"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Eschatological waiting: hal yanzuroona illa an ya'tiyahumu Allah", keys: ["2:210"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bani Israel asked: how many clear signs brought", keys: ["2:211"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Changing divine favor: Allah shadeed al-iqab", keys: ["2:211"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly life adorned for disbelievers; mocking believers", keys: ["2:212"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Muttaqoon above disbelievers on Judgment Day", keys: ["2:212"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah yarzuqu man yasha'u bighayri hisab", keys: ["2:212"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mankind one community then disagreed", keys: ["2:213"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophets sent with Book to judge differences", keys: ["2:213"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disagreement from baghy (envy/transgression) after knowledge", keys: ["2:213"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah guided believers to truth in disputed matters", keys: ["2:213"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah guides whom He wills to straight path", keys: ["2:213"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Testing through adversity: do you think you enter Jannah untested?", keys: ["2:214"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Hypocrisy archetype: eloquent speech masking destructive intent", keys: ["2:204","2:205"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-sacrifice for divine pleasure as highest devotion", keys: ["2:207"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Envy (baghy) as root cause of sectarian disagreement after knowledge", keys: ["2:213"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Inevitability of testing before paradise entry", keys: ["2:214"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Environmental/economic corruption: destroying agriculture and livestock", keys: ["2:205"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Original human unity then divergence requiring divine arbitration", keys: ["2:213"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0104","cand-0105","cand-0106"],
  notes: "Pass A pilot 10, passage 32/4. Two-person typology (hypocrite vs. sincere believer). Silm (peace/submission) command unique here. Human unity-then-disagreement narrative foundational. Testing verse (2:214) closes passage. Links to patience-haste, sabr-patience, divine-mercy.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// Extract commands/prohibitions from P32
{
  // 2:208 - Command: enter into peace completely
  p32.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["2:208"], excerpt: fv(208), description: "Command: O you who believe, enter into peace/submission completely." });

  // 2:208 - Prohibition: do not follow shaytan's footsteps
  p32.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["2:208"], excerpt: fv(208), description: "Prohibition: do not follow the footsteps of Satan; he is a clear enemy." });
}

// Extract divine names from P32
{
  // Ra'oof bil-ibad from 2:207
  const t207 = fv(207);
  const raoofIdx = t207.indexOf("\u0631\u064e\u0621\u064f\u0648\u0641\u064c \u0628\u0650\u0671\u0644\u0652\u0639\u0650\u0628\u064e\u0627\u062f\u0650");
  if (raoofIdx >= 0) {
    p32.divineNamesAndAttributes.push({ term: t207.slice(raoofIdx, raoofIdx + 13), transliteration: "Ra'oof bil-Ibad", gloss: "Kind/Compassionate to servants (editorial gloss)", keys: ["2:207"] });
  }

  // Aziz Hakeem from 2:209
  const t209 = fv(209);
  const azizIdx = t209.indexOf("\u0639\u064e\u0632\u0650\u064a\u0632\u064c \u062d\u064e\u0643\u0650\u064a\u0645\u064c");
  if (azizIdx >= 0) {
    p32.divineNamesAndAttributes.push({ term: t209.slice(azizIdx, azizIdx + 11), transliteration: "Aziz Hakeem", gloss: "Mighty, Wise (editorial gloss)", keys: ["2:209"] });
  }

  // Shadeed al-Iqab from 2:211
  const t211 = fv(211);
  const shadeedIdx2 = t211.indexOf("\u0634\u064e\u062f\u0650\u064a\u062f\u064f \u0671\u0644\u0652\u0639\u0650\u0642\u064e\u0627\u0628\u0650");
  if (shadeedIdx2 >= 0) {
    p32.divineNamesAndAttributes.push({ term: t211.slice(shadeedIdx2, shadeedIdx2 + 15), transliteration: "Shadeed al-Iqab", gloss: "Severe in Penalty (editorial gloss)", keys: ["2:211"] });
  }
}

// Extract terminology from P32
{
  // Silm from 2:208
  const t208 = fv(208);
  const silmIdx = t208.indexOf("\u0671\u0644\u0633\u0651\u0650\u0644\u0652\u0645\u0650");
  if (silmIdx >= 0) {
    p32.terminology.push({ term: t208.slice(silmIdx, silmIdx + 7), transliteration: "as-silm", gloss: "peace/submission/compliance (editorial gloss)", keys: ["2:208"] });
  }

  // Baghy from 2:213
  const t213 = fv(213);
  const baghyIdx = t213.indexOf("\u0628\u064e\u063a\u0652\u064a\u064b\u0627");
  if (baghyIdx >= 0) {
    p32.terminology.push({ term: t213.slice(baghyIdx, baghyIdx + 5), transliteration: "baghyan", gloss: "envy/transgression/unjust rivalry (editorial gloss)", keys: ["2:213"] });
  }
}

writeFileSync(path.join(OUT_DIR, "extractions", "002-al-baqarah-p32.json"), JSON.stringify(p32, null, 2) + "\n");
console.log("Wrote 002-al-baqarah-p32.json");

// ─── Candidates batch (cand-0097 through cand-0106) ────────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-002-p29,ext-002-p30,ext-002-p31,ext-002-p32",
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

// cand-0097: Fasting legislation — purpose, exemptions, and timing
candidates.candidates.push(makeCand("cand-0097",
  "Fasting (sawm): prescribed for taqwa with exemptions, timing, and fidya provisions",
  undefined, "\u0631\u0648\u0632\u06c1: \u062a\u0642\u0648\u06cc\u0670 \u06a9\u06d2 \u0644\u06cc\u06d2 \u0641\u0631\u0636 \u0628\u0627 \u0631\u062e\u0635\u062a\u06cc\u06ba\u060c \u0627\u0648\u0642\u0627\u062a \u0627\u0648\u0631 \u0641\u062f\u06cc\u06c1",
  "In 2:183: O you who believe, fasting is prescribed upon you as upon those before you so you may attain taqwa. In 2:184-185: numbered days; exemptions for sick and travelers with make-up; fidya for those with hardship; Ramadan as month of Quran revelation; Allah intends ease. In 2:187: timing from dawn white thread to nightfall; itikaf restrictions.",
  [{ key: "2:183", excerpt: fv(183), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes fasting obligation with taqwa as explicit purpose." },
   { key: "2:184", excerpt: fv(184), evidenceClass: "EXPLICIT_TEXT", rationale: "Details exemptions (illness, travel) and fidya alternative." },
   { key: "2:185", excerpt: fv(185), evidenceClass: "EXPLICIT_TEXT", rationale: "Identifies Ramadan as Quran-revelation month; declares divine intent of ease." },
   { key: "2:187", excerpt: fv(187), evidenceClass: "EXPLICIT_TEXT", rationale: "Defines precise fasting window and itikaf boundaries." }],
  [{ topicId: "sabr-patience", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no existing 'sawm-fasting' topic in catalog. Core ibadah legislation with built-in mercy mechanisms."
));

// cand-0098: Divine nearness and response to supplication
candidates.candidates.push(makeCand("cand-0098",
  "Divine nearness: Allah responds to the caller who asks about Him",
  undefined, "\u0627\u0644\u0644\u06c1 \u06a9\u06cc \u0642\u0631\u0628\u062a: \u067e\u06a9\u0627\u0631\u0646\u06d2 \u0648\u0627\u0644\u06d2 \u06a9\u06cc \u062f\u0639\u0627 \u0642\u0628\u0648\u0644",
  "In 2:186: When My servants ask you concerning Me, indeed I am near. I respond to the invocation of the supplicant when he calls upon Me. So let them respond to Me and believe in Me that they may be rightly guided.",
  [{ key: "2:186", excerpt: fv(186), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse establishes divine proximity and conditional reciprocity of supplication." }],
  [{ topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: unique first-person divine self-disclosure embedded in legal context. Bridges du'a theology with obedience requirement."
));

// cand-0099: Warfare ethics — proportionality, cessation, and fitnah
candidates.candidates.push(makeCand("cand-0099",
  "Warfare ethics: proportional engagement, cessation conditions, and fitnah as graver than killing",
  undefined, "\u062c\u0646\u06af \u06a9\u06cc \u0627\u062e\u0644\u0627\u0642\u06cc\u0627\u062a: \u0645\u062a\u0646\u0627\u0633\u0628 \u0644\u0691\u0627\u0626\u06cc\u060c \u0645\u0641\u0627\u062a\u06cc \u06a9\u06cc \u0634\u0631\u0627\u0626\u0637\u060c \u0641\u062a\u0646\u06c1 \u0642\u062a\u0644 \u0633\u06d2 \u0628\u0691\u06be \u06a9\u0631",
  "In 2:190: Fight in Allah's way those who fight you but do not transgress; Allah does not love transgressors. In 2:191-193: kill where found; fitnah worse than killing; fight until no fitnah and religion is for Allah; if they cease no hostility except against oppressors. In 2:194: sacred month reciprocity; proportional retaliation.",
  [{ key: "2:190", excerpt: fv(190), evidenceClass: "EXPLICIT_TEXT", rationale: "Establishes defensive framing and transgression prohibition." },
   { key: "2:191", excerpt: fv(191), evidenceClass: "EXPLICIT_TEXT", rationale: "Declares fitnah as worse than killing; permits reciprocal combat." },
   { key: "2:192", excerpt: fv(192), evidenceClass: "EXPLICIT_TEXT", rationale: "Cessation condition tied to divine forgiveness and mercy." },
   { key: "2:193", excerpt: fv(193), evidenceClass: "EXPLICIT_TEXT", rationale: "Defines war's end-state: elimination of fitnah and religious freedom." }],
  [{ topicId: "divine-mercy", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: no 'warfare-ethics' topic exists. Foundational just-war framework with built-in de-escalation."
));

// cand-0100: Unjust wealth consumption and anti-corruption
candidates.candidates.push(makeCand("cand-0100",
  "Unjust wealth consumption: prohibition of batil acquisition and bribery of authorities",
  undefined, "\u0646\u0627\u062c\u0627\u0626\u0632 \u0645\u0627\u0644\u06cc \u0645\u0646\u0627\u0641\u0639: \u0628\u0627\u0637\u0644 \u0633\u06d2 \u0645\u0627\u0644 \u06a9\u06be\u0627\u0646\u0627 \u0627\u0648\u0631 \u062d\u06a9\u0627\u0645 \u06a9\u0648 \u0631\u0634\u0648\u062a",
  "In 2:188: Do not consume one another's wealth unjustly (bil-batil) nor offer it as bribery to authorities so that you may knowingly devour a portion of people's wealth in sin.",
  [{ key: "2:188", excerpt: fv(188), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse prohibits both private unjust acquisition and systemic corruption through bribery." }],
  [],
  "Gap candidate: no 'wealth-property' or 'criminal-law' topic covers this specific anti-corruption pairing. Bridges personal and institutional ethics."
));

// cand-0101: Ihsan (excellence) — doing good as beloved to Allah
candidates.candidates.push(makeCand("cand-0101",
  "Ihsan: doing good/excellence as quality beloved to Allah",
  undefined, "\u0627\u062d\u0633\u0627\u0646: \u062e\u0648\u0628\u06cc \u0627\u0648\u0631 \u062e\u062f\u0645\u062a \u0627\u0644\u0644\u06c1 \u06a9\u0648 \u067e\u06cc\u0627\u0631\u06cc",
  "In 2:195: Spend in Allah's way; do not throw yourselves into destruction; and do good — indeed Allah loves the doers of good (al-muhsinin).",
  [{ key: "2:195", excerpt: fv(195), evidenceClass: "EXPLICIT_TEXT", rationale: "Links charitable spending, self-preservation, and excellence under divine love." }],
  [{ topicId: "shukr-gratitude", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: ihsan as divine-love criterion. Connects economic ethics with spiritual excellence."
));

// cand-0102: Hajj and Umrah legislation — rites, compensation, and remembrance
candidates.candidates.push(makeCand("cand-0102",
  "Hajj and Umrah: completion, prevention protocols, tamattu', and post-rite remembrance",
  undefined, "\u062d\u062c \u0627\u0648\u0631 \u0639\u0645\u0631\u06c1: \u062a\u06a9\u0645\u06cc\u0644\u060c \u0631\u06a9\u0627\u0648\u0679\u060c \u062a\u0645\u062a\u0639\u060c \u0627\u0648\u0631 \u0630\u06a9\u0631",
  "In 2:196: Complete hajj and umrah for Allah; prevention requires offering; tamattu'/qiran compensation via sacrifice or fasting. In 2:197-199: taqwa as best provision; no blame seeking bounty; remember Allah at Mash'ar al-Haram acknowledging prior misguidance; hasten from Arafat with istighfar. In 2:200-203: post-rite dhikr exceeding ancestral remembrance.",
  [{ key: "2:196", excerpt: fv(196), evidenceClass: "EXPLICIT_TEXT", rationale: "Core hajj legislation with completion command and compensation alternatives." },
   { key: "2:198", excerpt: fv(198), evidenceClass: "EXPLICIT_TEXT", rationale: "Acknowledges prior misguidance and divine guidance at Mash'ar." },
   { key: "2:200", excerpt: fv(200), evidenceClass: "EXPLICIT_TEXT", rationale: "Post-rite remembrance surpassing ancestral memory." }],
  [],
  "Gap candidate: no 'hajj-umrah-pilgrimage' topic exists. Comprehensive rite legislation with spiritual anthropology."
));

// cand-0103: Dual-world supplication — rabbana atina fi al-dunya wa fi al-akhirah hasanah
candidates.candidates.push(makeCand("cand-0103",
  "Dual-world supplication: seeking good in this life and hereafter with protection from Fire",
  undefined, "\u062f\u0648\u0646\u0648\u06ba \u062c\u06c1\u0627\u0646\u0648\u06ba \u06a9\u06cc \u062f\u0639\u0627: \u062f\u0646\u06cc\u0627 \u0627\u0648\u0631 \u0622\u062e\u0631\u062a \u0645\u06cc\u06ba \u0628\u06be\u0644\u0627\u0626\u06cc \u0627\u0648\u0631 \u0622\u06af \u0633\u06d2 \u062d\u0641\u0627\u0638\u062a",
  "In 2:201: Among them is one who says: Our Lord, give us good in this world and good in the Hereafter and protect us from the punishment of the Fire. Contrasted with 2:200: one who asks only for worldly gain with no hereafter share.",
  [{ key: "2:201", excerpt: fv(201), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides the canonical balanced supplication encompassing both realms." },
   { key: "2:200", excerpt: fv(200), evidenceClass: "CONTEXTUAL", rationale: "Contrasting worldly-only supplication establishes the deficiency this prayer corrects." }],
  [{ topicId: "gratitude-ingratitude", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: most frequently recited Quranic du'a. Defines balanced aspiration vs. materialism."
));

// cand-0104: Hypocrisy archetype — pleasing speech masking destructive intent
candidates.candidates.push(makeCand("cand-0104",
  "Hypocrisy archetype: eloquent speech concealing quarrelsomeness and corruption",
  undefined, "\u0645\u0646\u0627\u0641\u0642\u062a \u06a9\u0627 \u0646\u0645\u0648\u0646\u06c1: \u0645\u06cc\u062a\u06be\u06cc \u0628\u0627\u062a\u06cc\u06ba \u0645\u06af\u0631 \u062c\u06be\u06af\u0691\u0627 \u0627\u0648\u0631 \u0641\u0633\u0627\u062f",
  "In 2:204-206: Among people is one whose speech pleases you in worldly life and he calls Allah to witness what is in his heart, yet he is the most quarrelsome of opponents. When he turns away he strives throughout the land to cause corruption, destroying crops and livestock. Allah does not love corruption. When told to fear Allah, pride seizes him in sin; Hell is sufficient for him.",
  [{ key: "2:204", excerpt: fv(204), evidenceClass: "EXPLICIT_TEXT", rationale: "Defines the type: pleasing exterior masking adversarial interior." },
   { key: "2:205", excerpt: fv(205), evidenceClass: "EXPLICIT_TEXT", rationale: "Specifies destructive behavior: agricultural and economic sabotage." },
   { key: "2:206", excerpt: fv(206), evidenceClass: "EXPLICIT_TEXT", rationale: "Pride prevents reform; eschatological consequence declared." }],
  [],
  "Gap candidate: detailed psychological profile of hypocrisy. Environmental/economic destruction as diagnostic marker."
));

// cand-0105: Entering peace/submission (silm) completely
candidates.candidates.push(makeCand("cand-0105",
  "Entering peace/submission (silm) completely: total commitment to divine order",
  undefined, "\u0645\u06a9\u0645\u0644 \u0637\u0648\u0631 \u067e\u0631 \u0633\u0644\u0645 \u0645\u06cc\u06ba \u062f\u0627\u062e\u0644 \u06c1\u0648\u0646\u0627",
  "In 2:208: O you who believe, enter into peace/submission (silm) completely, and do not follow the footsteps of Satan. Indeed he is to you a clear enemy.",
  [{ key: "2:208", excerpt: fv(208), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse commands total entry into divine peace with shaytan-opposition as counterpoint." }],
  [],
  "Gap candidate: 'silm kaffah' as holistic submission concept. Paired with shaytan-footsteps prohibition echoing 2:168."
));

// cand-0106: Human unity then disagreement — origin of sectarian division
candidates.candidates.push(makeCand("cand-0106",
  "Human unity then disagreement: original community, prophetic arbitration, and envy-driven schism",
  undefined, "\u0627\u0646\u0633\u0627\u0646\u06cc \u0627\u062a\u062d\u0627\u062f \u067e\u06be\u0631 \u0627\u062e\u062a\u0644\u0627\u0641: \u0627\u0635\u0644\u06cc \u0627\u0645\u062a\u060c \u0646\u0628\u0648\u062a \u06a9\u0627 \u0641\u06cc\u0635\u0644\u06c1\u060c \u062d\u0633\u062f \u0633\u06d2 \u0641\u0631\u0642\u06c1 \u0628\u0646\u062f\u06cc",
  "In 2:213: Mankind was one community (ummah wahidah) then they disagreed. Allah sent prophets as bearers of glad tidings and warners, and sent down with them the Book in truth to judge between people concerning their differences. Only those who were given the Scripture differed concerning it after clear proofs came to them, out of envy/transgression (baghyan) among themselves. Allah guided those who believed to the truth concerning that over which they differed. Allah guides whom He wills to a straight path.",
  [{ key: "2:213", excerpt: fv(213), evidenceClass: "EXPLICIT_TEXT", rationale: "Complete verse provides etiology of religious disagreement: original unity, prophetic mediation, envy as corrupting factor, divine guidance as resolution." }],
  [{ topicId: "patience-haste", layer: "scholarly", relationship: "related-not-identical" }],
  "Gap candidate: foundational anthropological narrative explaining sectarianism. Envy (baghy) as root cause post-knowledge."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-010.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log(`Wrote candidates-010.json with ${candidates.candidates.length} candidates`);

console.log("\nDone. Run validator to confirm.");
