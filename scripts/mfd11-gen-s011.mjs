// MFD-11 Surah Hud (11) Pass A generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah Hud 11:1-123 (Passages 1-4, Candidates cand-0487..cand-0526).
// No hardcoded Unicode escapes for excerpts. Every excerpt/term is a substring of the
// verbatim corpus text, guaranteeing byte-perfect matches.

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "011-0001-0123.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");

const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;

function v(n) {
  if (!verses[n]) throw new Error(`Verse 11:${n} not found in corpus (id=${n})`);
  return verses[n];
}
function fv(n) { return v(n); }

console.log("Generating Surah Hud Pass A files from verbatim corpus (11:1-123)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);

const TS = "2026-11-19T15:57:00.000Z";

// Safe term extractor using word-boundary splitting to get exact corpus forms
function findWordContaining(vid, chars) {
  const t = fv(vid);
  const words = t.split(/\s+/);
  for (const w of words) {
    let match = true;
    for (const ch of chars) {
      if (!w.includes(ch)) { match = false; break; }
    }
    if (match) return w;
  }
  return null;
}

function findPhrase(vid, phrase) {
  const t = fv(vid);
  const i = t.indexOf(phrase);
  if (i >= 0) return t.slice(i, i + phrase.length);
  return null;
}

// ─── Passage 1: 11:1–24 ────────────────────────────────────────────────────────
const p1 = {
  extractionId: "ext-011-p1",
  workstream: "MFD-11",
  pass: "A",
  surah: 11,
  surahName: "Hud",
  passage: {
    fromAyah: 1,
    toAyah: 24,
    label: "Hud — Book perfected then detailed from Wise Acquainted; worship only Allah as warner-bearer; seek forgiveness repent for good provision and favor; return to Allah Capable; disbelievers hide breasts He knows secrets Aware of chests; every creature provision on Allah knows dwelling storage all in Clear Register; created heavens earth six days Throne on water testing best deed; resurrection claim dismissed as magic; punishment delay provokes ridicule but Day comes unaverted; mercy withdrawn makes man despairing ungrateful; favor after hardship makes him boastful; except patient righteous have forgiveness great reward; Messenger constrained by demands for treasure angel; challenge bring ten invented surahs call besides Allah if truthful; no response proves Quran from Allah's knowledge no deity but He; worldly-desire seekers fully repaid here nothing in Hereafter but Fire lost worthless deeds; clear-evidence believers with witness from Him and Musa's Book before as imam mercy believe in it; disbelieving factions Fire their promise; who invents lie against Allah most unjust presented before Lord witnesses testify they lied curse on wrongdoers; avert from Allah's way seek deviance disbelieve Hereafter; not causing failure on earth no protectors besides Allah punishment doubled could not hear nor see; lost themselves lost what they invented; greatest losers in Hereafter; believing righteous humble companions Paradise eternal; two parties parable blind-deaf vs seeing-hearing not equal"
  },
  verseKeys: Array.from({length:24}, (_,i) => `11:${i+1}`),
  arabicExcerpts: Array.from({length:24}, (_,i) => ({ key: `11:${i+1}`, text: fv(i+1) })),
  mainSubject: {
    label: "Quranic revelation as perfected-detailed Book from Wise Acquainted establishing exclusive tawheed worship; istighfar-repentance linked to temporal provision and ultimate return; divine omniscience over hidden thoughts and all creatures' provision; creation as test of best conduct; human psychological volatility between despair and boastfulness contrasted with patient-righteous stability; prophetic challenge to produce ten surahs proving divine origin; two-party parable contrasting spiritual blindness with insight; belief-clear-evidence nexus versus fabrication-invention leading to ultimate loss",
    keys: Array.from({length:24}, (_,i) => `11:${i+1}`),
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Book uhkimat ayatuhu thumma fussilat from Hakeem Khabeer", keys: ["11:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exclusive worship command: alla taAAbudoo illa Allaha with warner-bearer role", keys: ["11:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Istighfar-tawbah sequence yielding good provision and favor distribution", keys: ["11:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Return to Allah with Qadeer attribute as eschatological anchor", keys: ["11:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disbelievers hiding breasts yet Allah knows secrets and declarations", keys: ["11:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Universal creature provision guaranteed by Allah with dwelling-storage knowledge", keys: ["11:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Six-day creation with Throne on water as test of best conduct", keys: ["11:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Resurrection proclamation dismissed by disbelievers as obvious magic", keys: ["11:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Punishment delay provoking ridicule but Day arrives unaverted enveloping mockers", keys: ["11:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mercy withdrawal producing despair-ingratitude in man", keys: ["11:9"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Favor after hardship producing boastful exultation", keys: ["11:10"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exception: patient righteous receive forgiveness and great reward", keys: ["11:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger's breast constrained by demands for treasure or angel", keys: ["11:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Challenge to produce ten invented surahs and call upon anyone besides Allah", keys: ["11:13"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Non-response proves Quran revealed with Allah's knowledge confirming tawheed", keys: ["11:14"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly-desire seekers fully compensated in this life without deprivation", keys: ["11:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Worldly seekers receive only Fire in Hereafter; deeds lost and worthless", keys: ["11:16"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Clear-evidence believer with divine witness and Musa's Book as imam-mercy", keys: ["11:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fabricating lies against Allah as supreme injustice; witnesses testify to lying", keys: ["11:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Averting from Allah's way seeking deviation while disbelieving in Hereafter", keys: ["11:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wrongdoers unable to escape on earth; no protectors; punishment doubled", keys: ["11:20"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-loss and loss of fabricated inventions as ultimate consequence", keys: ["11:21"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believers doing righteous deeds and humbling themselves as Paradise companions", keys: ["11:23"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Two-party parable: blind-deaf versus seeing-hearing as unequal comparison", keys: ["11:24"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Human despair-ingratitude when mercy withdrawn and boastful exultation when favor granted", keys: ["11:9","11:10"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Patient-righteous exception receiving maghfirah and ajr kabeer", keys: ["11:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Humility (ikhbat) toward Lord as distinguishing quality of Paradise companions", keys: ["11:23"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0487","cand-0488","cand-0489","cand-0490","cand-0491","cand-0492","cand-0493","cand-0494","cand-0495","cand-0496"],
  notes: "Pass A Hud passage 1/4. Opening theological framework establishing Quran as perfected-detailed revelation grounding exclusive tawheed. Istighfar-provision linkage (11:3) connects spiritual practice to material well-being. Universal provision doctrine (11:6) establishes divine sustenance as comprehensive. Creation-as-test framing (11:7) gives purpose to existence. Human psychological analysis (11:9-10) reveals instability of fortune-dependent faith contrasted with sabr-amal salih stability (11:11). Ten-surah challenge (11:13) provides falsification criterion. Two-party parable (11:24) summarizes entire epistemological divide. Passage functions as thematic overture for subsequent prophet narratives.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P1 commands
p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:2"], excerpt: fv(2), description: "Command: do not worship except Allah." });
p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:3"], excerpt: fv(3), description: "Command: seek forgiveness of your Lord and repent to Him." });
p1.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:14"], excerpt: fv(14), description: "Rhetorical command: would you not be Muslims?" });

// P1 divine names
{
  const t1 = findWordContaining(1, ["\u062d","\u0643","\u064a","\u0645"]); // hakeemin
  const t2 = findWordContaining(1, ["\u062e","\u0628","\u064a","\u0631"]); // khabeerin
  if (t1 && t2) {
    const fullText = fv(1);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p1.divineNamesAndAttributes.push({ term: phrase, transliteration: "Hakeem Khabeer", gloss: "Wise Acquainted (editorial gloss)", keys: ["11:1"] });
    }
  }
}
{
  const t = findWordContaining(4, ["\u0642","\u062f","\u064a","\u0631"]); // qadeerun
  if (t) p1.divineNamesAndAttributes.push({ term: t, transliteration: "Qadeer", gloss: "Competent/Capable (editorial gloss)", keys: ["11:4"] });
}
{
  const t = findWordContaining(5, ["\u0639","\u0644","\u064a","\u0645"]); // AAaleemun
  if (t) p1.divineNamesAndAttributes.push({ term: t, transliteration: "Aleem", gloss: "All-Knowing (editorial gloss)", keys: ["11:5"] });
}
{
  const t = findWordContaining(6, ["\u0645","\u0628","\u064a","\u0646"]); // mubeenin
  if (t) p1.divineNamesAndAttributes.push({ term: t, transliteration: "Mubeen", gloss: "Clear/Manifest (editorial gloss)", keys: ["11:6"] });
}
{
  const t = findWordContaining(12, ["\u0648","\u0643","\u064a","\u0644"]); // wakeelun
  if (t) p1.divineNamesAndAttributes.push({ term: t, transliteration: "Wakeel", gloss: "Disposer/Guardian (editorial gloss)", keys: ["11:12"] });
}

// P1 terminology
{
  const t = findWordContaining(3, ["\u0645","\u062a","\u0627","\u0639"]); // mataAAan
  if (t) p1.terminology.push({ term: t, transliteration: "mata'", gloss: "provision/enjoyment (editorial gloss)", keys: ["11:3"] });
}
{
  const t = findWordContaining(23, ["\u0623","\u062e","\u0628","\u062a"]); // akhbatoo
  if (t) p1.terminology.push({ term: t, transliteration: "ikhbat", gloss: "humbling oneself/devotion (editorial gloss)", keys: ["11:23"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "011-hud-p1.json"), JSON.stringify(p1, null, 2) + "\n");
console.log("Wrote 011-hud-p1.json");

// ─── Passage 2: 11:25–60 ──────────────────────────────────────────────────────
const p2 = {
  extractionId: "ext-011-p2",
  workstream: "MFD-11",
  pass: "A",
  surah: 11,
  surahName: "Hud",
  passage: {
    fromAyah: 25,
    toAyah: 60,
    label: "Hud — Nuh sent as clear warner worship only Allah fear painful day; elites dismiss him as mere man followed by lowest reject merit call liars; Nuh claims clear evidence mercy from Lord unseen to them cannot force; asks no wealth reward from Allah alone; refuses to drive away believers who will meet Lord; does not claim treasuries unseen knowledge angelhood; Allah knows souls best; warns who protects him from Allah if drives believers; people demand punishment if truthful; Nuh says only Allah brings it if He wills they cannot escape; advice useless if Allah intends misguidance He is Lord return; revelation that none will believe except already believed do not grieve; build ship under Our eyes inspiration do not plead for wrongdoers they drown; elites ridicule he responds we ridicule you as you ridicule; you will know who receives disgraceful enduring punishment; command came oven overflowed load pairs family except word-preceded and few believers; embark bismillah majraha mursaha Lord Ghafoor Raheem; waves like mountains Nuh calls son apart come aboard not with disbelievers; son seeks mountain refuge no protector today except mercy waves separate him drowned; earth swallow sky cease water subsided matter accomplished rested on Judiyy away with wrongdoers; Nuh appeals son is family Your promise true You best judge; Allah says not of family unrighteous work do not ask without knowledge lest ignorant; Nuh seeks refuge from asking without knowledge unless forgiven mercied among losers; disembark peace blessings upon you nations from those with you other nations enjoy then painful punishment; news of unseen revealed to you neither you nor people knew before so be patient outcome for muttaqeen; Hud sent to Ad worship Allah no deity other Him you invent; asks no reward from Creator reason; seek forgiveness repent sends rain showers increases strength do not turn criminals; reject no clear evidence will not leave gods not believers; claim gods possessed him with evil he calls Allah witness free from shirk; challenges plot against me all together no respite; relies on Allah his Lord their Lord holds every creature forelock Lord on straight path; if turn away conveyed message Lord succeeds other people cannot harm Him Guardian; command came saved Hud believers by mercy saved from harsh punishment; Ad rejected signs disobeyed messengers followed every obstinate tyrant; followed by curse this world and Resurrection Day Ad denied Lord away with Ad people of Hud"
  },
  verseKeys: Array.from({length:36}, (_,i) => `11:${i+25}`),
  arabicExcerpts: Array.from({length:36}, (_,i) => ({ key: `11:${i+25}`, text: fv(i+25) })),
  mainSubject: {
    label: "Nuh-Hud dual narratives: tawheed message elite rejection prophet disavowal of worldly motives believer protection ship construction under divine observation flood with father-son separation divine family-redefinition by righteousness disembarkation blessing Hud's istighfar-rain-strength promise Ad rejection tawakkul with forelock-holding salvation-destruction double-world curse",
    keys: Array.from({length:36}, (_,i) => `11:${i+25}`),
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Nuh sent as natheer mubeen commanding exclusive Allah worship", keys: ["11:25","11:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Elite dismissal: bashar mithlana followed by arathiluna badiya al-rrayi", keys: ["11:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nuh's bayyinah-rahmah claim with forced-imposition impossibility", keys: ["11:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No wealth request; reward only from Allah; refusing to expel believers", keys: ["11:29"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Who protects me from Allah if I drive believers away?", keys: ["11:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disavowal of treasuries unseen-knowledge angelhood; Allah knows souls best", keys: ["11:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "People demanding threatened punishment; Nuh defers to Allah's will", keys: ["11:32","11:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Advice useless if Allah intends misguidance; He is Lord return", keys: ["11:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Revelation: none will believe except already believed; do not grieve", keys: ["11:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ship construction bi-a'yunina wawahyina; wrongdoers destined drowning", keys: ["11:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual ridicule exchange during ship building", keys: ["11:38"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Flood onset: amruna + fara altannooru; paired loading with believer inclusion", keys: ["11:40"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Embarkation formula: bismi Allahi majraha wamursaha; Ghafoor Raheem", keys: ["11:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Father-son dialogue amid waves: come aboard vs mountain refuge", keys: ["11:42","11:43"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No protector today from Allah's decree except whom He mercies", keys: ["11:43"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Earth-sky commands; water subsides; ship rests on Judiyy", keys: ["11:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nuh's appeal: son is family; Your promise true; best of judges", keys: ["11:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine correction: not of family; unrighteous work; do not ask without knowledge", keys: ["11:46"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nuh's repentance: seek refuge from asking without knowledge", keys: ["11:47"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Disembarkation with salam-barakat; future nations enjoy then punished", keys: ["11:48"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Unseen news revealed; patience commanded; outcome for muttaqeen", keys: ["11:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hud sent to Ad: worship Allah no other deity; you are inventors", keys: ["11:50"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hud asks no reward from Creator; reasoning appeal", keys: ["11:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Istighfar-tawbah yields rain showers and added strength", keys: ["11:52"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ad reject: no bayyinah; will not leave gods; not believers", keys: ["11:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ad claim gods possessed Hud; Hud calls Allah witness free from shirk", keys: ["11:54"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hud's challenge: plot against me all together no respite", keys: ["11:55"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawakkul on Allah holding every creature's forelock; Lord on straight path", keys: ["11:56"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "If turn away: message conveyed; Lord succeeds other people; cannot harm Him", keys: ["11:57"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Salvation of Hud and believers by mercy from harsh punishment", keys: ["11:58"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ad rejected signs disobeyed messengers followed every jabbar aneed", keys: ["11:59"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Curse in this world and Resurrection; Ad denied Lord; away with Ad", keys: ["11:60"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Nuh's complete prophetic cycle: tawheed message elite rejection ship construction flood father-son separation divine family-redefinition disembarkation blessing", keys: ["11:25","11:26","11:27","11:28","11:29","11:30","11:31","11:32","11:33","11:34","11:36","11:37","11:38","11:39","11:40","11:41","11:42","11:43","11:44","11:45","11:46","11:47","11:48","11:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hud's mission to Ad: tawheed istighfar-rain promise rejection tawakkul salvation-destruction", keys: ["11:50","11:51","11:52","11:53","11:54","11:55","11:56","11:57","11:58","11:59","11:60"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Elite social-status-based rejection of prophetic message dismissing followers as low-status", keys: ["11:27"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic grief over community disbelief divinely addressed through revelation", keys: ["11:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Patience (sabr) commanded with outcome reserved for muttaqeen", keys: ["11:49"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [],
  relationships: [
    { label: "Father-son relationship subordinated to faith: biological kinship overridden by righteousness criterion", keys: ["11:42","11:43","11:45","11:46"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0497","cand-0498","cand-0499","cand-0500","cand-0501","cand-0502","cand-0503","cand-0504","cand-0505","cand-0506"],
  notes: "Pass A Hud passage 2/4. Dual prophet narratives (Nuh + Hud) establishing recurring pattern: tawheed message, elite rejection based on social hierarchy, prophet's disavowal of worldly motives, divine salvation-destruction execution. Nuh narrative uniquely includes father-son separation scene where biological family ties are explicitly subordinated to righteousness (11:46 amal ghayr salih). Divine correction of Nuh's intercession (11:46-47) establishes boundary between prophetic compassion and divine prerogative. Ship construction under divine observation (bi-a'yunina wawahyina) emphasizes continuous divine supervision. Hud's istighfar-rain-strength linkage (11:52) parallels opening passage's istighfar-provision theme (11:3). Tawakkul declaration with naseeyah-holding imagery (11:56) provides concrete metaphor for divine sovereignty.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P2 commands
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:26"], excerpt: fv(26), description: "Command through Nuh: do not worship except Allah." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:50"], excerpt: fv(50), description: "Command through Hud: worship Allah you have no deity other than Him." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:52"], excerpt: fv(52), description: "Command through Hud: seek forgiveness of your Lord then repent to Him." });
p2.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["11:52"], excerpt: fv(52), description: "Prohibition through Hud: do not turn away being criminals." });
p2.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:49"], excerpt: fv(49), description: "Command to Prophet: be patient; indeed the outcome is for the righteous." });

// P2 divine names
{
  const t1 = findWordContaining(41, ["\u063a","\u0641","\u0648","\u0631"]); // ghafoorun
  const t2 = findWordContaining(41, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  if (t1 && t2) {
    const fullText = fv(41);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p2.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ghafoor Raheem", gloss: "Forgiving Merciful (editorial gloss)", keys: ["11:41"] });
    }
  }
}
{
  const t = findWordContaining(45, ["\u0623","\u062d","\u0643","\u0645"]); // ahkamu
  if (t) {
    const t2 = findWordContaining(45, ["\u062d","\u0627","\u0643","\u0645"]); // hakimeena
    if (t2) {
      const fullText = fv(45);
      const idx1 = fullText.indexOf(t);
      const idx2 = fullText.indexOf(t2);
      if (idx1 >= 0 && idx2 > idx1) {
        const phrase = fullText.slice(idx1, idx2 + t2.length);
        p2.divineNamesAndAttributes.push({ term: phrase, transliteration: "Ahkam al-Hakimeen", gloss: "Most Just of Judges (editorial gloss)", keys: ["11:45"] });
      }
    }
  }
}
{
  const t = findWordContaining(57, ["\u062d","\u0641","\u064a","\u0638"]); // hafeethun
  if (t) p2.divineNamesAndAttributes.push({ term: t, transliteration: "Hafeeth", gloss: "Guardian/Preserver (editorial gloss)", keys: ["11:57"] });
}

// P2 terminology
{
  const t = findWordContaining(41, ["\u0645","\u062c","\u0631"]); // majraha
  if (t) p2.terminology.push({ term: t, transliteration: "majra", gloss: "course/navigation (editorial gloss)", keys: ["11:41"] });
}
{
  const t = findWordContaining(41, ["\u0645","\u0631","\u0633"]); // mursaha
  if (t) p2.terminology.push({ term: t, transliteration: "mursa", gloss: "anchorage/mooring (editorial gloss)", keys: ["11:41"] });
}
{
  const t = findWordContaining(44, ["\u062c","\u0648","\u062f"]); // aljoodiyyi
  if (t) p2.terminology.push({ term: t, transliteration: "al-Judiyy", gloss: "Mount Judi landing place (editorial gloss)", keys: ["11:44"] });
}
{
  const t = findWordContaining(56, ["\u0646","\u0627","\u0635","\u064a"]); // nasiyatiha
  if (t) p2.terminology.push({ term: t, transliteration: "nasiyah", gloss: "forelock/front of head symbolizing control (editorial gloss)", keys: ["11:56"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "011-hud-p2.json"), JSON.stringify(p2, null, 2) + "\n");
console.log("Wrote 011-hud-p2.json");

// ─── Passage 3: 11:61–95 ──────────────────────────────────────────────────────
const p3 = {
  extractionId: "ext-011-p3",
  workstream: "MFD-11",
  pass: "A",
  surah: 11,
  surahName: "Hud",
  passage: {
    fromAyah: 61,
    toAyah: 95,
    label: "Hud — Salih sent to Thamud worship Allah produced you from earth settled therein seek forgiveness repent Lord near responsive; Thamud recall Salih was promising before now forbid fathers' worship in disquieting doubt; Salih asks if on clear evidence mercy who protects from Allah if disobeyed only increase loss; she-camel of Allah as sign let her feed on Allah's earth do not touch with harm impending punishment; they hamstrung her enjoy homes three days promise not denied; command came saved Salih believers by mercy from disgrace Strong Mighty; shriek seized wrongdoers became prone in homes as if never prospered Thamud denied Lord away with Thamud; messengers came Ibrahim with glad tidings said peace he responded peace brought roasted calf; saw hands not reaching distrusted felt apprehension they said fear not sent to Lot's people; wife standing smiled given glad tidings of Ishaq and after him Yaqub; she exclaimed woe shall I bear old woman husband old amazing thing; they said amazed at Allah's decree mercy blessings upon you household He is Hameed Majeed; fright left Ibrahim glad tidings arrived he argues concerning Lot's people; Ibrahim haleem awwah muneeb; told give up plea Lord's command come punishment irrevocable; messengers came Lot anguished distressed trying day; people hastened previously doing evil he offers daughters purer fear Allah do not disgrace guests any reasonable man; they say you know no right in daughters you know what we want; he wishes strength or strong support; angels reveal identity Lord's messengers they will not reach you set out with family at night none look back except wife struck same morning appointment near; command came made high low rained stones sijjeel mandood marked from Lord not far from wrongdoers; Shuayb sent to Madyan worship Allah do not decrease measure scale see you in prosperity fear encompassing day; give full measure weight justice do not deprive people things do not abuse earth corrupting; baqiyyat Allah best if believers not guardian over you; they ask does prayer command leaving fathers' worship doing what we please with wealth you are haleem rasheed; Salih says on clear evidence good provision not intending differ only reform as able success only through Allah relied returned; warns dissension may cause like Nuh Hud Salih peoples Lot not far; seek forgiveness repent Lord Raheem Wadood; they say do not understand much see you weak if not for family would stone you not respected; he asks is family more respected than Allah put Him behind backs Lord encompassing deeds; work on your position I working you will know who receives disgrace who lies watch I am watcher with you; command came saved Shuayb believers by mercy shriek seized wrongdoers prone in homes as if never prospered away with Madyan as Thamud"
  },
  verseKeys: Array.from({length:35}, (_,i) => `11:${i+61}`),
  arabicExcerpts: Array.from({length:35}, (_,i) => ({ key: `11:${i+61}`, text: fv(i+61) })),
  mainSubject: {
    label: "Salih-Thamud she-camel sign hamstringing sayhah destruction; Ibrahim-Lut angelic visit glad tidings Sarah's amazement intercession halted city inversion sijjeel rain; Shu'ayb-Madyan economic justice baqiyyat Allah reform intent family-power critique mutual challenge identical sayhah destruction completing four-nation cycle",
    keys: Array.from({length:35}, (_,i) => `11:${i+61}`),
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Salih's tawheed message linking creation-settlement to istighfar", keys: ["11:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine nearness-responsiveness: Rabbee qareebun mujeeb", keys: ["11:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Thamud recalling Salih's prior promise now doubting his message", keys: ["11:62"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "She-camel of Allah as sign: let her feed do not harm", keys: ["11:64"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hamstringing the she-camel; three-day enjoyment promise not denied", keys: ["11:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Salvation of Salih-believers by mercy from disgrace; Qawiyy Azeez", keys: ["11:66"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sayhah seizing wrongdoers prone in homes as if never prospered", keys: ["11:67","11:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Angelic visit to Ibrahim with salam exchange and roasted calf hospitality", keys: ["11:69"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim's distrust when hands did not reach food; angels reveal Lot mission", keys: ["11:70"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sarah's glad tidings of Ishaq and Yaqub; her amazed exclamation at old-age birth", keys: ["11:71","11:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Angelic response: do not be amazed at Allah's decree; Hameed Majeed upon household", keys: ["11:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim's intercession for Lot after fright departed; haleem awwah muneeb", keys: ["11:74","11:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Intercession halted: Lord's command come punishment irrevocable", keys: ["11:76"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lot's anguish at messengers' arrival; trying day", keys: ["11:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lot offers daughters as purer alternative; people reject claiming no right", keys: ["11:78","11:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lot wishes for strength or strong support", keys: ["11:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Angels reveal identity; night departure command; wife exception; morning appointment", keys: ["11:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "City inversion and sijjeel mandood stone rain marked from Lord", keys: ["11:82","11:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shu'ayb's tawheed plus economic justice: full measure weight no deprivation no corruption", keys: ["11:84","11:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Baqiyyat Allah khayr lakum in kuntum mumineena", keys: ["11:86"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Madyan's sarcastic question: does prayer command abandoning fathers' worship?", keys: ["11:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shu'ayb's reform declaration: only intend islaha; success only through Allah", keys: ["11:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Warning against dissension causing fate like Nuh Hud Salih peoples; Lot not far", keys: ["11:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Seek forgiveness repent; Rabbee Raheem Wadood", keys: ["11:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Madyan dismiss Shu'ayb: do not understand; weak; family protection only", keys: ["11:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shu'ayb counters: is family more respected than Allah? Lord encompasses deeds", keys: ["11:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual work-watch challenge: work on your position I working I am raqeeb", keys: ["11:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Identical salvation-destruction pattern for Shu'ayb-Madyan as Thamud", keys: ["11:94","11:95"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Salih-Thamud narrative: tawheed istighfar she-camel sign hamstringing three-day warning sayhah destruction", keys: ["11:61","11:62","11:63","11:64","11:65","11:66","11:67","11:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim-Lut combined narrative: angelic visit glad tidings Sarah's reaction intercession halted Lot's anguish daughters-offer rescue city destruction", keys: ["11:69","11:70","11:71","11:72","11:73","11:74","11:75","11:76","11:77","11:78","11:79","11:80","11:81","11:82","11:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shu'ayb-Madyan narrative: economic justice baqiyyat Allah reform intent family-power critique mutual challenge sayhah destruction", keys: ["11:84","11:85","11:86","11:87","11:88","11:89","11:90","11:91","11:92","11:93","11:94","11:95"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Sarah's amazed laughter at old-age pregnancy announcement showing human limitation before divine power", keys: ["11:71","11:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim as haleem awwah muneeb: forbearing grieving returning model of prophetic character", keys: ["11:75"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lot's anguish and distress at hosting angels knowing community's intentions", keys: ["11:77"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Economic justice framework: full measure weight qist no deprivation no earth-corruption linked to baqiyyat Allah", keys: ["11:85","11:86"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Host-guest relationship: Ibrahim's hospitality and Lot's protective anguish for angelic guests", keys: ["11:69","11:77","11:78"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0507","cand-0508","cand-0509","cand-0510","cand-0511","cand-0512","cand-0513","cand-0514","cand-0515","cand-0516"],
  notes: "Pass A Hud passage 3/4. Three prophet narratives (Salih + Ibrahim/Lut + Shu'ayb) completing the four-nation destruction cycle. Salih narrative introduces unique she-camel sign with explicit harm-prohibition and timed punishment. Ibrahim-Lut narrative uniquely includes domestic elements (hospitality Sarah's laughter old-age birth) alongside destruction. Intercession-halt (11:76) establishes divine decree boundary even for prophets. Shu'ayb narrative distinctively combines tawheed with economic ethics (measure-weight justice) making it the most socially-oriented prophet account. Baqiyyat Allah concept (11:86) links lawful remainder to faith condition. Four-nation pattern shows identical salvation-destruction mechanics reinforcing divine consistency. Reform-intent declaration (11:88 innee oreedu illa alislaha) provides prophetic methodology template.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P3 commands
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:61"], excerpt: fv(61), description: "Command through Salih: worship Allah you have no deity other than Him." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:61"], excerpt: fv(61), description: "Command through Salih: seek forgiveness of Him then repent to Him." });
p3.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["11:64"], excerpt: fv(64), description: "Prohibition through Salih: do not touch the she-camel with harm." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:84"], excerpt: fv(84), description: "Command through Shu'ayb: worship Allah you have no deity other than Him." });
p3.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["11:84"], excerpt: fv(84), description: "Prohibition through Shu'ayb: do not decrease from the measure and the scale." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:85"], excerpt: fv(85), description: "Command through Shu'ayb: give full measure and weight in justice." });
p3.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["11:85"], excerpt: fv(85), description: "Prohibition through Shu'ayb: do not deprive people of their due and do not commit abuse on earth spreading corruption." });
p3.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:90"], excerpt: fv(90), description: "Command through Shu'ayb: seek forgiveness of your Lord then repent to Him." });

// P3 divine names
{
  const t1 = findWordContaining(61, ["\u0642","\u0631","\u064a","\u0628"]); // qareebun
  const t2 = findWordContaining(61, ["\u0645","\u062c","\u064a","\u0628"]); // mujeebun
  if (t1 && t2) {
    const fullText = fv(61);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "Qareeb Mujeeb", gloss: "Near Responsive (editorial gloss)", keys: ["11:61"] });
    }
  }
}
{
  const t1 = findWordContaining(66, ["\u0642","\u0648","\u064a"]); // alqawiyyu
  const t2 = findWordContaining(66, ["\u0639","\u0632","\u064a","\u0632"]); // alAAazeezu
  if (t1 && t2) {
    const fullText = fv(66);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "al-Qawiyy al-Azeez", gloss: "the Powerful the Exalted in Might (editorial gloss)", keys: ["11:66"] });
    }
  }
}
{
  const t1 = findWordContaining(73, ["\u062d","\u0645","\u064a","\u062f"]); // hameedun
  const t2 = findWordContaining(73, ["\u0645","\u062c","\u064a","\u062f"]); // majeedun
  if (t1 && t2) {
    const fullText = fv(73);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "Hameed Majeed", gloss: "Praiseworthy Honorable (editorial gloss)", keys: ["11:73"] });
    }
  }
}
{
  const t1 = findWordContaining(90, ["\u0631","\u062d","\u064a","\u0645"]); // raheemun
  const t2 = findWordContaining(90, ["\u0648","\u062f","\u0648","\u062f"]); // wadoodun
  if (t1 && t2) {
    const fullText = fv(90);
    const idx1 = fullText.indexOf(t1);
    const idx2 = fullText.indexOf(t2);
    if (idx1 >= 0 && idx2 > idx1) {
      const phrase = fullText.slice(idx1, idx2 + t2.length);
      p3.divineNamesAndAttributes.push({ term: phrase, transliteration: "Raheem Wadood", gloss: "Merciful Affectionate (editorial gloss)", keys: ["11:90"] });
    }
  }
}

// P3 terminology
{
  const t = findWordContaining(64, ["\u0646","\u0627","\u0642"]); // naqatu
  if (t) p3.terminology.push({ term: t, transliteration: "naqah", gloss: "she-camel (editorial gloss)", keys: ["11:64"] });
}
{
  const t = findWordContaining(82, ["\u0633","\u062c","\u064a","\u0644"]); // sijjeelin
  if (t) p3.terminology.push({ term: t, transliteration: "sijjeel", gloss: "hard clay/baked stone (editorial gloss)", keys: ["11:82"] });
}
{
  const t = findWordContaining(86, ["\u0628","\u0642","\u064a"]); // baqiyyatu
  if (t) p3.terminology.push({ term: t, transliteration: "baqiyyah", gloss: "remainder/lawful provision from Allah (editorial gloss)", keys: ["11:86"] });
}
{
  const t = findWordContaining(88, ["\u0625","\u0635","\u0644","\u0627"]); // alislaha
  if (t) p3.terminology.push({ term: t, transliteration: "islah", gloss: "reform/reconciliation (editorial gloss)", keys: ["11:88"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "011-hud-p3.json"), JSON.stringify(p3, null, 2) + "\n");
console.log("Wrote 011-hud-p3.json");

// ─── Passage 4: 11:96–123 ──────────────────────────────────────────────────────
const p4 = {
  extractionId: "ext-011-p4",
  workstream: "MFD-11",
  pass: "A",
  surah: 11,
  surahName: "Hud",
  passage: {
    fromAyah: 96,
    toAyah: 123,
    label: "Hud — Musa sent with signs clear authority to Firawn establishment followed Firawn's command not rashid; leads people into Fire on Resurrection wretched destination; followed by curse this world and Resurrection wretched gift; cities news related some standing some harvested; did not wrong them wronged themselves gods availed nothing when Lord's command came only increased ruin; thus Lord's seizure when seizing cities wronging painful severe; sign for fearing Hereafter punishment Day collected witnessed; not delayed except limited term; Day comes no soul speaks except by permission wretched prosperous; wretched in Fire exhaling inhaling abiding while heavens earth endure except Lord wills Lord effecter of intends; prosperous in Paradise abiding while heavens earth endure except Lord wills uninterrupted bestowal; do not doubt what these worship same as fathers before We complete their share undiminished; gave Musa Book disagreed if not for preceding word would have been judged they in disquieting doubt; each fully compensated for deeds Lord Acquainted; remain steadfast as commanded those who turned with you do not transgress He Seeing; do not incline to wrongdoers lest Fire touch you no protectors besides Allah then not helped; establish prayer two ends day approach night good deeds remove misdeeds reminder for rememberers; be patient Allah does not lose reward of good-doers; why were there not generations before with enduring discrimination forbidding corruption except few saved; wrongdoers pursued luxury were criminals; Lord would not destroy cities unjustly while people reformers; if Lord willed could make mankind one community but they differ; except whom Lord mercied for that created them; Lord's word fulfilled fill Hell jinn men together; each story from messengers news firms your heart truth instruction reminder believers; say to disbelievers work on position we working; wait we waiting; to Allah unseen heavens earth to Him returns matter all worship Him rely on Him Lord not unaware of deeds"
  },
  verseKeys: Array.from({length:28}, (_,i) => `11:${i+96}`),
  arabicExcerpts: Array.from({length:28}, (_,i) => ({ key: `11:${i+96}`, text: fv(i+96) })),
  mainSubject: {
    label: "Musa-Firawn leadership-to-Fire; cities news summary self-wronging false-gods futility divine seizure; shaqiyy-sa'eed conditional eternity; istiqamah command anti-inclination warning; prayer hasanat-sayyi'at removal; uloo baqiyyah diagnosis muslihoona principle; difference as divine will mercy-exception; stories firm heart; closing tawheed-tawakkul divine awareness",
    keys: Array.from({length:28}, (_,i) => `11:${i+96}`),
    evidenceClass: "EXPLICIT_TEXT"
  },
  subordinateSubjects: [
    { label: "Musa sent with ayatina sultan mubeen to Firawn", keys: ["11:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Firawn's establishment following his non-rashid command", keys: ["11:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Firawn leading people into Fire on Resurrection; wretched destination", keys: ["11:98"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Double curse: this world and Resurrection; wretched gift", keys: ["11:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cities news: some standing some harvested", keys: ["11:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Self-wronging not divine wronging; false gods availed nothing", keys: ["11:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine seizure of wronging cities: aleem shadeed", keys: ["11:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sign for Hereafter-fearers: Day collected and witnessed", keys: ["11:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Day not delayed except for limited term", keys: ["11:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Permission-limited speech on the Day; shaqiyy-sa'eed division", keys: ["11:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Shaqiyy in Fire: zafeer shaheeq; conditional eternity", keys: ["11:106","11:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sa'eed in Paradise: conditional eternity; ata' ghayr majthooth", keys: ["11:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Do not doubt polytheists' worship; ancestral pattern; full share undiminished", keys: ["11:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Musa given Book; disagreement; preceding word prevents judgment; disquieting doubt", keys: ["11:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Full compensation for deeds; Khabeer attribute", keys: ["11:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Istiqamah command: remain steadfast as commanded; do not transgress; Baseer", keys: ["11:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Anti-inclination to wrongdoers: Fire contact; no protectors; no help", keys: ["11:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prayer at day-ends and night approach; hasanat remove sayyi'at; dhikra", keys: ["11:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Patience command; Allah does not waste muhsineen reward", keys: ["11:115"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Uloo baqiyyah question: why no generations forbidding corruption? Few saved", keys: ["11:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wrongdoers pursued luxury; were mujrimeen", keys: ["11:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Lord would not destroy cities unjustly while people are muslihoona", keys: ["11:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine will could unify mankind but they continue differing", keys: ["11:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mercy-exception as creation purpose; hell-filling word fulfilled", keys: ["11:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Stories firm heart; truth instruction reminder for believers", keys: ["11:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual work challenge to disbelievers", keys: ["11:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mutual wait challenge", keys: ["11:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Closing: Allah owns unseen heavens earth; matter returns to Him; worship rely; Lord not unaware", keys: ["11:123"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Musa-Firawn brief account: signs-sultan sent; Firawn's non-rashid command leading to Fire", keys: ["11:96","11:97","11:98","11:99"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Shaqiyy-sa'eed binary as ultimate human categorization on Judgment Day", keys: ["11:105","11:106","11:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Generational moral failure: absence of uloo baqiyyah enabling corruption persistence", keys: ["11:116"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Luxury-pursuit (itraf) linked to criminal behavior as societal decline mechanism", keys: ["11:116"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [],
  terminology: [],
  topicCandidateIds: ["cand-0517","cand-0518","cand-0519","cand-0520","cand-0521","cand-0522","cand-0523","cand-0524","cand-0525","cand-0526"],
  notes: "Pass A Hud passage 4/4. Eschatological-theological conclusion synthesizing all preceding narratives. Musa-Firawn account (11:96-99) provides leadership-responsibility paradigm contrasting with prophet narratives. Cities-news summary (11:100-102) abstracts patterns from specific stories. Shaqiyy-sa'eed duality (11:105-108) with illa ma shaa rabbuka exception preserves divine sovereignty over eternal states. Istiqamah command (11:112) addresses Prophet directly after historical lessons. Hasanat-sayyi'at removal principle (11:114) provides practical spiritual mechanism. Uloo baqiyyah question (11:116) diagnoses civilizational collapse through absence of moral vanguard. Muslihoona principle (11:117) establishes divine justice constraint. Difference-as-divine-will (11:118) reframes pluralism theologically. Closing tawheed-tawakkul (11:123) mirrors opening creating structural ring.",
  proposedBy: "ai-assisted",
  reviewStatus: "pending-scholarly-review",
  createdAt: TS
};

// P4 commands
p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:112"], excerpt: fv(112), description: "Command: remain steadfast as commanded, you and those who turned with you." });
p4.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["11:112"], excerpt: fv(112), description: "Prohibition: do not transgress." });
p4.commandsAndProhibitions.push({ kind: "PROHIBITION", keys: ["11:113"], excerpt: fv(113), description: "Prohibition: do not incline toward those who do wrong." });
p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:114"], excerpt: fv(114), description: "Command: establish prayer at two ends of day and approach of night." });
p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:115"], excerpt: fv(115), description: "Command: be patient." });
p4.commandsAndProhibitions.push({ kind: "COMMAND", keys: ["11:123"], excerpt: fv(123), description: "Command: worship Him and rely upon Him." });

// P4 divine names
{
  const t = findWordContaining(107, ["\u0641","\u0639","\u0627","\u0644"]); // faAAAAalun
  if (t) p4.divineNamesAndAttributes.push({ term: t, transliteration: "Fa'al", gloss: "Effecter/Doer (editorial gloss)", keys: ["11:107"] });
}
{
  const t = findWordContaining(111, ["\u062e","\u0628","\u064a","\u0631"]); // khabeerun
  if (t) p4.divineNamesAndAttributes.push({ term: t, transliteration: "Khabeer", gloss: "Acquainted/All-Aware (editorial gloss)", keys: ["11:111"] });
}
{
  const t = findWordContaining(112, ["\u0628","\u0635","\u064a","\u0631"]); // baseerun
  if (t) p4.divineNamesAndAttributes.push({ term: t, transliteration: "Baseer", gloss: "All-Seeing (editorial gloss)", keys: ["11:112"] });
}

// P4 terminology
{
  const t = findWordContaining(114, ["\u062d","\u0633","\u0646","\u0627"]); // alhasanatu
  if (t) p4.terminology.push({ term: t, transliteration: "hasanat", gloss: "good deeds (editorial gloss)", keys: ["11:114"] });
}
{
  const t = findWordContaining(114, ["\u0633","\u064a","\u0626","\u0627"]); // alssayyiati
  if (t) p4.terminology.push({ term: t, transliteration: "sayyi'at", gloss: "misdeeds/bad deeds (editorial gloss)", keys: ["11:114"] });
}
{
  const t = findWordContaining(116, ["\u0628","\u0642","\u064a","\u0629"]); // baqiyyatin
  if (t) p4.terminology.push({ term: t, transliteration: "baqiyyah", gloss: "enduring discrimination/remnant (editorial gloss)", keys: ["11:116"] });
}
{
  const t = findWordContaining(117, ["\u0645","\u0635","\u0644","\u062d"]); // muslihoona
  if (t) p4.terminology.push({ term: t, transliteration: "muslih", gloss: "reformer/peacemaker (editorial gloss)", keys: ["11:117"] });
}

writeFileSync(path.join(OUT_DIR, "extractions", "011-hud-p4.json"), JSON.stringify(p4, null, 2) + "\n");
console.log("Wrote 011-hud-p4.json");

// ─── Candidates batch (cand-0487 through cand-0526) ──────────────────────────
const candidates = {
  workstream: "MFD-11",
  generatedAt: TS,
  sourceExtraction: "ext-011-p1,ext-011-p2,ext-011-p3,ext-011-p4",
  candidates: []
};

function makeCand(id, label, def, evidenceArr, overlap, notes) {
  return {
    candidateId: id,
    label,
    definition: def,
    definitionStatus: "editorial-draft",
    evidence: evidenceArr,
    existingTopicOverlap: overlap || [],
    proposedBy: "ai-assisted",
    reviewStatus: "pending-scholarly-review",
    createdAt: TS,
    notes: notes || undefined
  };
}

// === P1 candidates (cand-0487..cand-0496) ===
candidates.candidates.push(makeCand("cand-0487",
  "Perfected-detailed Book: Quran described as uhkimat ayatuhu thumma fussilat from Hakeem Khabeer establishing dual quality of precision and elaboration",
  "In 11:1: Alif Lam Ra. A Book whose verses are perfected then detailed from One Wise Acquainted.",
  [{ key: "11:1", excerpt: fv(1), evidenceClass: "EXPLICIT_TEXT", rationale: "Kitabun ohkimat ayatuhu thumma fussilat: two-stage description establishing both structural perfection and communicative detail. Min ladun hakeemin khabeerin: divine source attributing both wisdom and intimate knowledge." }],
  [], "Gap candidate. Dual descriptor pairing (uhkimat+fussilat) resolves tension between Quran's concise legal precision and its narrative elaboration. Hakeem-Khabeer pairing grounds textual qualities in divine attributes."
));

candidates.candidates.push(makeCand("cand-0488",
  "Istighfar-provision linkage: seeking forgiveness and repentance yields good temporal provision and favor distribution connecting spiritual practice to material well-being",
  "In 11:3: Seek forgiveness of your Lord and repent to Him. He will let you enjoy good provision for a specified term and give every doer of favor his favor.",
  [{ key: "11:3", excerpt: fv(3), evidenceClass: "EXPLICIT_TEXT", rationale: "Istaghfiroo rabbakum thumma tooboo ilayhi: sequential istighfar-tawbah as condition. YumattiAAkum mataAAan hasanan: temporal enjoyment as consequence. Ila ajalin musamman: time-bound nature preventing materialist reading. Wayuti kulla thee fadlin fadlahu: individualized favor distribution." }],
  [], "Gap candidate. Establishes causal link between spiritual rectification and material provision without reducing faith to transaction. Ajal musamman qualifier prevents prosperity-gospel reading."
));

candidates.candidates.push(makeCand("cand-0489",
  "Human psychological volatility: mercy withdrawal produces despair-ingratitude while favor after hardship produces boastful exultation revealing fortune-dependent faith instability",
  "In 11:9-10: If We give man mercy then withdraw it he is despairing ungrateful. If We give favor after hardship he says bad times left me indeed he is exultant boastful.",
  [{ key: "11:9", excerpt: fv(9), evidenceClass: "EXPLICIT_TEXT", rationale: "Layaoosun kafoorun: despair paired with ingratitude showing emotional collapse triggers theological failure." },
   { key: "11:10", excerpt: fv(10), evidenceClass: "EXPLICIT_TEXT", rationale: "Lafarihun fakhoorun: exultation paired with boastfulness showing comfort triggers self-attribution error." }],
  [], "Gap candidate. Psychological analysis reveals symmetric vulnerability: both deprivation and prosperity threaten faith integrity. Contrasts with sabr-amal salih stability in 11:11."
));

candidates.candidates.push(makeCand("cand-0490",
  "Ten-surah challenge: falsification criterion demanding production of ten invented surahs calling upon anyone besides Allah proving Quran's divine origin through non-response",
  "In 11:13-14: Say bring ten surahs like it invented and call whomever you can besides Allah if truthful. If they do not respond know it was revealed with Allah's knowledge.",
  [{ key: "11:13", excerpt: fv(13), evidenceClass: "EXPLICIT_TEXT", rationale: "Faatoo biAAashri suwarin mithlihi muftarayatin: specific quantitative challenge with invention-permission lowering barrier. WaodAAoo mani istataAAtum min dooni Allahi: open assistance invitation maximizing opponent resources." },
   { key: "11:14", excerpt: fv(14), evidenceClass: "EXPLICIT_TEXT", rationale: "Fai llam yastajeeboo lakum faiAAlamoo annama onzila biAAilmi Allahi: non-response as positive proof of divine origin. Fahal antum muslimoona: rhetorical conversion appeal following evidentiary demonstration." }],
  [], "Gap candidate. Most specific quantitative challenge in Quran (ten surahs vs one or whole). Muftarayatin concession removes originality objection. Non-response logic transforms absence into evidence."
));

candidates.candidates.push(makeCand("cand-0491",
  "Worldly-desire seekers fully repaid here: those wanting dunya life and adornment receive complete compensation without deprivation but Fire alone in Hereafter with worthless deeds",
  "In 11:15-16: Whoever desires worldly life We fully repay their deeds therein not deprived. Those have only Fire in Hereafter; lost what they made worthless what they did.",
  [{ key: "11:15", excerpt: fv(15), evidenceClass: "EXPLICIT_TEXT", rationale: "Nuwaffi ilayhim aAAmalahum feeha: complete compensation principle. Wala yubkhasoona: no injustice even to worldly-oriented." },
   { key: "11:16", excerpt: fv(16), evidenceClass: "EXPLICIT_TEXT", rationale: "Laysa lahum fee alakhirati illa alnnaru: exclusive Fire outcome. Wahabita ma sanaAAoo: deed-nullification. Wabatilun ma kanoo yaAAmaloona: retroactive worthlessness." }],
  [], "Gap candidate. Establishes divine justice even for disbelievers in temporal realm. Complete worldly repayment prevents grievance. Deed-nullification shows actions require correct intention-framework to have eternal value."
));

candidates.candidates.push(makeCand("cand-0492",
  "Clear-evidence believer with divine witness: person on bayyinah from Lord with shahid minhu and Musa's Book as imam-mercy believes in Quran establishing multi-source verification",
  "In 11:17: Is one on clear evidence from Lord followed by witness from Him and before it Musa's Book as leader and mercy? Those believe in it.",
  [{ key: "11:17", excerpt: fv(17), evidenceClass: "EXPLICIT_TEXT", rationale: "AAala bayyinatin min rabbihi: primary divine evidence. Wayatloohu shahidun minhu: corroborating divine witness. Kitabu moosa imaman warahmatan: prior scripture confirmation. Olaika yuminoona bihi: belief as natural outcome of multi-source verification." }],
  [], "Gap candidate. Triple-evidence structure (bayyinah + shahid + prior scripture) models epistemological robustness. Imam-rahmah pairing shows guidance and mercy as complementary scripture functions."
));

candidates.candidates.push(makeCand("cand-0493",
  "Supreme injustice of fabricating lies against Allah: inventing falsehood about God as worst wrongdoing with public exposure before Lord and witness testimony confirming lying",
  "In 11:18: Who is more unjust than one who invents lie about Allah? Those presented before Lord witnesses say these lied against Lord. Curse of Allah on wrongdoers.",
  [{ key: "11:18", excerpt: fv(18), evidenceClass: "EXPLICIT_TEXT", rationale: "Waman athlamu mimmani iftara AAala Allahi kathiban: superlative injustice framing. YuAAradoona AAala rabbihim: public presentation. Wayaqoolu alashhadu haolai allatheena kathaboo: witness confirmation. Ala laAAnatu Allahi: divine curse as consequence." }],
  [], "Gap candidate. Establishes theological crime hierarchy with fabrication-at-top. Public-exposure scene serves as deterrent. Witness testimony parallels earthly legal procedure."
));

candidates.candidates.push(makeCand("cand-0494",
  "Two-party parable: blind-deaf versus seeing-hearing as fundamental epistemological divide illustrating irreducible inequality between disbelief and faith",
  "In 11:24: Example of two parties like blind-deaf and seeing-hearing. Are they equal? Will you not remember?",
  [{ key: "11:24", excerpt: fv(24), evidenceClass: "EXPLICIT_TEXT", rationale: "Mathalu alfareeqayni kaalaAAma waalasammi waalbaseeri waalssameeAAi: sensory metaphor mapping spiritual states. Hal yastawiyani mathalan: rhetorical equality-negation. Afala tathakkaroona: memory-appeal closing argument." }],
  [], "Gap candidate. Sensory-metaphor makes abstract epistemological distinction concrete. Binary structure eliminates middle ground. Positioned as section-summary after detailed contrast of believer-disbeliever outcomes."
));

candidates.candidates.push(makeCand("cand-0495",
  "Universal creature provision doctrine: every dabbah on earth has rizq guaranteed by Allah who knows mustaqarr and mustawda' all recorded in kitab mubeen",
  "In 11:6: No creature on earth but upon Allah is its provision. He knows its dwelling and storage. All in clear register.",
  [{ key: "11:6", excerpt: fv(6), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama min dabbatin fee alardi illa AAala Allahi rizquha: universal scope encompassing all creatures. WayaAAlamu mustaqarraha wamustawdaAAaha: comprehensive spatial-temporal knowledge. Kullun fee kitabin mubeenin: written-record guarantee." }],
  [], "Gap candidate. Extends divine care beyond humans establishing ecological theology. Mustaqarr-mustawda' pairing covers both fixed and transient states. Kitab mubeen provides metaphysical guarantee beyond observable provision."
));

candidates.candidates.push(makeCand("cand-0496",
  "Creation as test of best conduct: six-day creation with Throne on water explicitly purposed to test which person is best in deed establishing existence as examination",
  "In 11:7: He created heavens earth in six days His Throne on water to test you which is best in deed.",
  [{ key: "11:7", excerpt: fv(7), evidenceClass: "EXPLICIT_TEXT", rationale: "Liyaabluwakum ayyukum ahsanu AAamalan: explicit test-purpose clause. Ahsanu (best) not aktharu (most) emphasizing quality over quantity. Throne-on-water detail grounds cosmology in divine sovereignty." }],
  [], "Gap candidate. Test-purpose framing gives existential meaning to creation. Quality-emphasis (ahsanu) prevents mechanical deed-counting. Six-day + Throne context situates human test within cosmic framework."
));

// === P2 candidates (cand-0497..cand-0506) ===
candidates.candidates.push(makeCand("cand-0497",
  "Elite social-status rejection: dismissing prophet as mere man followed by lowest social class (arathiluna badiya al-rrayi) revealing class-based epistemological barrier",
  "In 11:27: Eminent disbelievers said we see you only as man like us followed only by lowest among us at first suggestion. We see no merit in you; we think you liars.",
  [{ key: "11:27", excerpt: fv(27), evidenceClass: "EXPLICIT_TEXT", rationale: "Ma naraka illa basharan mithlana: humanity-as-limitation argument. Illa allatheena hum arathiluna badiya alrrayi: follower-quality dismissal. Badiya al-rrayi suggests impulsive unthinking adherence. Ma nara lakum AAalayna min fadlin: merit-denial based on social hierarchy." }],
  [], "Gap candidate. Reveals how social status functions as epistemological filter. Arathiluna (lowest) + badiya al-rrayi (first opinion) double-dismissal targets both class and intellectual quality. Pattern recurs across all prophet narratives."
));

candidates.candidates.push(makeCand("cand-0498",
  "Prophetic disavowal template: Nuh denies possessing treasuries unseen-knowledge or angelhood affirming pure messenger function limited to conveyed revelation",
  "In 11:31: I do not say I have Allah's treasuries or know unseen or am angel. Allah knows best what is in their souls.",
  [{ key: "11:31", excerpt: fv(31), evidenceClass: "EXPLICIT_TEXT", rationale: "Wala aqoolu lakum AAindee khazainu Allahi: material-resource denial. Wala aAAlamu alghayba: supernatural-knowledge denial. Wala aqoolu innee malakun: ontological-status denial. Allahu aAAlamu bima fee anfusihim: divine-knowledge deference." }],
  [], "Gap candidate. Three-fold denial systematically strips prophet of any independent authority. Positions messenger as pure conduit. Prevents personality-cult formation around prophetic figure."
));

candidates.candidates.push(makeCand("cand-0499",
  "Believer protection principle: refusing to expel low-status believers because they will meet their Lord establishing divine accountability as social-equality guarantor",
  "In 11:29-30: I am not driving away believers; they will meet their Lord. Who would protect me from Allah if I drove them away?",
  [{ key: "11:29", excerpt: fv(29), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama ana bitaridi allatheena amanoo: expulsion-refusal. Innahum mulaqoo rabbihim: divine-meeting as dignity-grounding." },
   { key: "11:30", excerpt: fv(30), evidenceClass: "EXPLICIT_TEXT", rationale: "Man yansurunee mina Allahi in taradtuhum: rhetorical protection-question making expulsion existentially dangerous for prophet himself." }],
  [], "Gap candidate. Establishes faith-based social equality overriding class hierarchy. Divine-meeting (mulaqoo rabbihim) grants believers irreducible dignity. Protection-question makes social justice a matter of prophetic self-preservation."
));

candidates.candidates.push(makeCand("cand-0500",
  "Ship construction under divine observation: building bi-a'yunina wawahyina establishing continuous supervision and inspiration during obedient labor amid ridicule",
  "In 11:37: Construct the ship under Our observation and Our inspiration. Do not address Me concerning wrongdoers; they are drowned.",
  [{ key: "11:37", excerpt: fv(37), evidenceClass: "EXPLICIT_TEXT", rationale: "WaisnaAAi alfulka biaAAyunina wawahyina: dual divine-presence (observation+inspiration) during construction. Wala tukhatibnee fee allatheena thalamoo: intercession-prohibition. Innahum mughraqoona: predetermined fate stated as fact." }],
  [], "Gap candidate. Bi-a'yunina wawahyina pairing sanctifies physical labor. Intercession-prohibition establishes boundary between prophetic compassion and divine decree. Mughraqoona certainty contrasts with ongoing construction uncertainty."
));

candidates.candidates.push(makeCand("cand-0501",
  "Father-son separation by faith: Nuh's son refuses boarding seeking mountain refuge; waves separate them; divine correction redefines family by righteousness not blood",
  "In 11:42-46: Son says I will take refuge on mountain. Nuh says no protector today except mercy. Waves separated them. Nuh appeals son is family. Allah says not of family; unrighteous work; do not ask without knowledge.",
  [{ key: "11:42", excerpt: fv(42), evidenceClass: "EXPLICIT_TEXT", rationale: "Ya bunayya irkab maAAana: paternal plea. Wala takun maAAa alkafireena: faith-binary framing." },
   { key: "11:43", excerpt: fv(43), evidenceClass: "EXPLICIT_TEXT", rationale: "Saawee ila jabalin: son's alternative-trust. La AAasima alyawma min amri Allahi illa man rahima: absolute divine-decree supremacy." },
   { key: "11:46", excerpt: fv(46), evidenceClass: "EXPLICIT_TEXT", rationale: "Innahu laysa min ahlika: family-membership revoked. Innahu AAamalun ghayru salihin: righteousness substituted for lineage. Fala tasalni ma laysa laka bihi AAilmun: knowledge-boundary enforcement." }],
  [], "Gap candidate. Most emotionally intense prophet-narrative moment. Amal ghayr salih redefinition of family collapses biological privilege. Knowledge-boundary (11:46-47) prevents prophetic intercession from overriding divine criteria."
));

candidates.candidates.push(makeCand("cand-0502",
  "Disembarkation blessing with future warning: salam-barakat upon Nuh and nations from those with him; other nations enjoy then face painful punishment",
  "In 11:48: Disembark in peace from Us and blessings upon you and nations from those with you. Other nations We grant enjoyment then painful punishment touches them.",
  [{ key: "11:48", excerpt: fv(48), evidenceClass: "EXPLICIT_TEXT", rationale: "Ihbit bisalamin minna wabarakatin: dual divine-gift (peace+blessings). WaAAala omamin mimman maAAaka: blessing extends to descendant nations. Waomamun sanumattiAAuhum thumma yamassuhum minna AAathabun aleemun: cyclical rise-fall pattern for future communities." }],
  [], "Gap candidate. Establishes post-deluge covenant framework. Blessing-punishment duality for future nations previews entire subsequent prophetic history. SanumattiAAuhum (We grant enjoyment) shows divine agency in temporal prosperity."
));

candidates.candidates.push(makeCand("cand-0503",
  "Hud's istighfar-rain-strength promise: seek forgiveness repent yields rain showers and added strength linking spiritual renewal to environmental and physical empowerment",
  "In 11:52: O my people seek forgiveness of your Lord then repent. He will send sky rain in showers and increase you strength added to your strength.",
  [{ key: "11:52", excerpt: fv(52), evidenceClass: "EXPLICIT_TEXT", rationale: "Istaghfiroo rabbakum thumma tooboo ilayhi: identical formula to 11:3. Yursili alssamaa AAalaykum midraran: abundant rain as tangible response. Wayazidkum quwwatan ila quwwatikum: strength-addition implying existing capacity enhanced not replaced." }],
  [], "Gap candidate. Parallels 11:3 istighfar-provision theme but specifies environmental mechanism (rain). Quwwatan ila quwwatikum suggests cumulative empowerment. Contextualizes Ad's physical might as potentially renewable through repentance."
));

candidates.candidates.push(makeCand("cand-0504",
  "Tawakkul with forelock-holding imagery: Hud declares reliance on Allah who holds every creature's forelock establishing total divine control metaphor",
  "In 11:56: I have relied upon Allah my Lord and your Lord. There is no creature but He holds its forelock. My Lord is on straight path.",
  [{ key: "11:56", excerpt: fv(56), evidenceClass: "EXPLICIT_TEXT", rationale: "Innee tawakkaltu AAala Allahi: personal trust declaration. Rabbee warabbikum: shared lordship eliminating hierarchy. Ma min dabbatin illa huwa akhithun binasiyatiha: universal control via forelock-metaphor. Inna rabbee AAala siratin mustaqeemin: divine-path certainty grounding trust." }],
  [], "Gap candidate. Naseeyah (forelock) metaphor conveys total control without violence imagery. Shared-lordship (rabbee warabbikum) democratizes divine relationship. Sirat mustaqeem attribution to Allah Himself (not just human path) grounds cosmic order."
));

candidates.candidates.push(makeCand("cand-0505",
  "Ad's obstinate tyranny pattern: rejected signs disobeyed messengers followed every jabbar aneed establishing leadership-following as destruction mechanism",
  "In 11:59: That was Ad who rejected Lord's signs disobeyed His messengers followed command of every obstinate tyrant.",
  [{ key: "11:59", excerpt: fv(59), evidenceClass: "EXPLICIT_TEXT", rationale: "Jahadoo biayati rabbihim: sign-rejection. WaAAasaw rusulahu: messenger-disobedience. WaittabaAAoo amra kulli jabbarin AAaneedin: systematic tyrant-following. Kulli (every) indicates pattern not isolated incident." }],
  [], "Gap candidate. Three-step degradation: reject evidence → disobey messenger → follow tyrant. Jabbar-Aneed pairing combines power-abuse with stubbornness. Kulli generalizes to systemic political pathology."
));

candidates.candidates.push(makeCand("cand-0506",
  "Double-world curse: Ad followed by curse in this world and Resurrection Day establishing comprehensive consequences extending beyond temporal punishment",
  "In 11:60: They were followed in this world with curse and on Resurrection Day. Indeed Ad denied their Lord; away with Ad people of Hud.",
  [{ key: "11:60", excerpt: fv(60), evidenceClass: "EXPLICIT_TEXT", rationale: "WaotbiAAoo fee hathihi alddunya laAAnatan wayawma alqiyamati: dual-temporal curse. Ala inna AAadan kafaroo rabbahum: denial-diagnosis. Ala buAAdan liAAadin qawmi hoodin: distancing-formula as final verdict." }],
  [], "Gap candidate. Dual-curse structure shows consequences transcend temporal destruction. Kafaroo rabbahum (denied their Lord) uses possessive emphasizing broken relationship. BuAAdan formula echoes throughout surah marking each nation's closure."
));

// === P3 candidates (cand-0507..cand-0516) ===
candidates.candidates.push(makeCand("cand-0507",
  "She-camel as divine sign with harm prohibition: naqat Allah designated as ayah with feeding permission and touching-harm prohibition triggering timed punishment",
  "In 11:64-65: This she-camel of Allah is sign for you. Let her feed on Allah's earth. Do not touch with harm or impending punishment takes you. They hamstrung her.",
  [{ key: "11:64", excerpt: fv(64), evidenceClass: "EXPLICIT_TEXT", rationale: "Hathihi naqatu Allahi lakum ayatan: divine-ownership designation. Fatharooha takul fee ardi Allahi: feeding-permission on divine-earth. Wala tamassooha bisooin: harm-prohibition. Fayakhuthakum AAathabun qareebun: imminent-punishment warning." },
   { key: "11:65", excerpt: fv(65), evidenceClass: "EXPLICIT_TEXT", rationale: "FaAAaqarooha: deliberate hamstringing as sign-violation. TamattaAAoo fee darikum thalathata ayyamin: precise three-day grace period. Thalika waAAdun ghayru makthoobin: unfailing-promise emphasis." }],
  [], "Gap candidate. Only prophet-narrative with animal-sign bearing explicit harm-prohibition. Three-day window creates suspense-testing interval. Ghayru makthoobin emphasizes divine-promise reliability even for punishment."
));

candidates.candidates.push(makeCand("cand-0508",
  "Sayhah destruction pattern: shriek seizes wrongdoers leaving them prone in homes as if never prospered establishing sudden-total annihilation signature",
  "In 11:67-68: Shriek seized wrongdoers; they became prone in homes. As if never prospered. Thamud denied Lord; away with Thamud.",
  [{ key: "11:67", excerpt: fv(67), evidenceClass: "EXPLICIT_TEXT", rationale: "Waakhatha allatheena thalamoo alssayhatu: sayhah as divine-instrument. Faasbahoo fee diyarihim jathimeena: domestic-setting death emphasizing totality." },
   { key: "11:68", excerpt: fv(68), evidenceClass: "EXPLICIT_TEXT", rationale: "Kaan lam yaghnaw feeha: prosperity-erasure metaphor. Ala inna thamooda kafaroo rabbahum: denial-diagnosis. Ala buAAdan lithamooda: closure-formula." }],
  [], "Gap candidate. Jathimeena (prone/fallen) conveys instantaneity. Kaan lam yaghnaw erases historical presence. Identical formula repeated for Madyan (11:94-95) establishing pattern-recognition device."
));

candidates.candidates.push(makeCand("cand-0509",
  "Ibrahim's hospitality model: immediate salam exchange roasted calf offering establishing prophetic hospitality standard with guest honor priority",
  "In 11:69: Messengers came to Ibrahim with glad tidings. They said peace. He said peace. Did not delay bringing roasted calf.",
  [{ key: "11:69", excerpt: fv(69), evidenceClass: "EXPLICIT_TEXT", rationale: "Qaloo salaman qala salamun: reciprocal peace-exchange. Fama labitha an jaa biAAijlin haneethin: speed-emphasis (fama labitha) showing hospitality urgency. AAijlin haneethin: specific food-quality detail." }],
  [], "Gap candidate. Hospitality sequence (greeting→food) establishes prophetic etiquette norm. Speed-emphasis shows eagerness. Haneethin (roasted/fattened) indicates best-available offering."
));

candidates.candidates.push(makeCand("cand-0510",
  "Sarah's amazed laughter at old-age birth: human limitation confronted by divine creative power producing astonished joy mixed with incredulity",
  "In 11:71-72: Wife standing smiled. Given glad tidings of Ishaq and Yaqub. She said woe to me shall I bear when old and husband old? Amazing thing!",
  [{ key: "11:71", excerpt: fv(71), evidenceClass: "EXPLICIT_TEXT", rationale: "Waimraatuhu qaimatun fadahikat: standing-smile suggesting attentive reception. Fabashsharnaha biishaqa wamin warai ishaqa yaAAqooba: double-generation promise." },
   { key: "11:72", excerpt: fv(72), evidenceClass: "EXPLICIT_TEXT", rationale: "Ya waylata aalidu waana AAajoozun: self-referential impossibility assessment. Wahatha baAAlee shaykhan: spouse-age compounding factor. Inna hatha lashayon AAajeebun: amazement-declaration." }],
  [], "Gap candidate. Human emotional authenticity preserved within miracle narrative. Double-generation promise (Ishaq+Yaqub) exceeds request. AAajeebun acknowledges genuine wonder without disbelief."
));

candidates.candidates.push(makeCand("cand-0511",
  "Intercession boundary: Ibrahim's pleading for Lot halted by angels declaring Lord's command arrived punishment irrevocable establishing prophetic-intercession limits",
  "In 11:74-76: After fright left and glad tidings came he argued concerning Lot. Angels said give up; Lord's command come; punishment cannot be repelled.",
  [{ key: "11:74", excerpt: fv(74), evidenceClass: "EXPLICIT_TEXT", rationale: "Yujadiluna fee qawmi lootin: active argumentation showing prophetic compassion." },
   { key: "11:76", excerpt: fv(76), evidenceClass: "EXPLICIT_TEXT", rationale: "AaArid AAan hatha: cessation-command. Innahu qad jaa amru rabbika: decree-finality. AAathabun ghayru mardoodin: irrevocability emphasis." }],
  [], "Gap candidate. Establishes intercession has boundaries set by divine decree timing. Ghayru mardoodin prevents any hope of reversal once threshold crossed. Compassionate-argument preserved as virtuous even when unsuccessful."
));

candidates.candidates.push(makeCand("cand-0512",
  "Lot's protective anguish for guests: host distress at community intentions offering daughters as purer alternative revealing extreme hospitality obligation",
  "In 11:77-79: Lot anguished felt discomfort said trying day. People hastening doing evil. He said these my daughters purer for you fear Allah do not disgrace me in guests.",
  [{ key: "11:77", excerpt: fv(77), evidenceClass: "EXPLICIT_TEXT", rationale: "Seea bihim wadaqa bihim tharAAan: triple-distress vocabulary. Hatha yawmun AAaseebun: day-characterization as trying." },
   { key: "11:78", excerpt: fv(78), evidenceClass: "EXPLICIT_TEXT", rationale: "Haolai banatee hunna atharu lakum: daughter-offer as purity-alternative. Faittaqoo Allaha wala tukhzooni fee dayfee: taqwa-shame dual appeal." }],
  [], "Gap candidate. Host-guest obligation shown at maximum intensity. Atharu (purer) frames offer as moral upgrade not compromise. Tukhzooni (disgrace me) personalizes communal violation."
));

candidates.candidates.push(makeCand("cand-0513",
  "City inversion and sijjeel stone rain: high-made-low with marked stones from Lord establishing distinctive punishment signature for Lut's people",
  "In 11:82-83: When command came We made high low rained stones of layered hard clay marked from your Lord not far from wrongdoers.",
  [{ key: "11:82", excerpt: fv(82), evidenceClass: "EXPLICIT_TEXT", rationale: "JaAAalna AAaliyaha safilaha: spatial-inversion as moral-symbolic act. Waamtarna AAalayha hijaratan min sijjeelin mandoodin: material-specificity (layered baked clay)." },
   { key: "11:83", excerpt: fv(83), evidenceClass: "EXPLICIT_TEXT", rationale: "Musawwamatan AAinda rabbika: divine-marking indicating targeted precision. Wama hiya mina alththalimeena bibaAAeedin: proximity-warning to all wrongdoers." }],
  [], "Gap candidate. Spatial-inversion embodies moral-inversion symbolism. Sijjeel-mandood specificity distinguishes from generic destruction. BibaAAeedin warning universalizes lesson beyond single community."
));

candidates.candidates.push(makeCand("cand-0514",
  "Economic justice as prophetic mission: Shu'ayb combines tawheed with measure-weight fairness prohibiting deprivation and earth-corruption linking commerce to faith",
  "In 11:84-85: Worship Allah no deity other Him. Do not decrease measure scale. Give full measure weight in justice. Do not deprive people things. Do not abuse earth corrupting.",
  [{ key: "11:84", excerpt: fv(84), evidenceClass: "EXPLICIT_TEXT", rationale: "Wala tanqusoo almikyala waalmeezana: economic-command immediately follows tawheed. Innee arakum bikhayrin: prosperity-acknowledgment preventing ascetic reading." },
   { key: "11:85", excerpt: fv(85), evidenceClass: "EXPLICIT_TEXT", rationale: "Awfoo almikyala waalmeezana bialqisti: positive-command with justice-standard. Wala tabkhasoo alnnasa ashyaahum: deprivation-prohibition. Wala taAAthaw fee alardi mufsideena: systemic-corruption prohibition." }],
  [], "Gap candidate. Only prophet-narrative where economic ethics equals tawheed in prominence. Bialqisti establishes objective standard beyond subjective fairness. Earth-corruption framing elevates commercial dishonesty to ecological-spiritual crime."
));

candidates.candidates.push(makeCand("cand-0515",
  "Baqiyyat Allah concept: what remains lawful from Allah is best for believers linking honest remainder to faith condition as economic-spiritual principle",
  "In 11:86: What remains from Allah is best for you if you are believers. I am not guardian over you.",
  [{ key: "11:86", excerpt: fv(86), evidenceClass: "EXPLICIT_TEXT", rationale: "Baqiyyatu Allahi khayrun lakum: divine-remainder superiority claim. In kuntum mumineena: faith-condition. Wama ana AAalaykum bihafeethin: prophetic-non-coercion disclaimer." }],
  [], "Gap candidate. Baqiyyah (remainder) implies honest profit after fair dealing vs fraudulent gain. Faith-condition makes economic honesty a belief-test. Non-guardianship disclaimer preserves human agency."
));

candidates.candidates.push(makeCand("cand-0516",
  "Reform-intent declaration: Shu'ayb states only intending islaha as able with success only through Allah establishing prophetic methodology combining effort with tawakkul",
  "In 11:88: I only intend reform as much as I am able. My success is only through Allah. Upon Him I rely and to Him I return.",
  [{ key: "11:88", excerpt: fv(88), evidenceClass: "EXPLICIT_TEXT", rationale: "In oreedu illa alislaha ma istataAAtu: effort-bounded reform intent. Wama tawfeeqee illa biAllahi: success-attribution. AAalayhi tawakkaltu wailayhi oneebu: trust-return pairing." }],
  [], "Gap candidate. Ma istataAAtu acknowledges human limitation without excusing inaction. Tawfeeq-success attribution prevents reformer-pride. Tawakkul-Inabah pairing models complete prophetic orientation."
));

// === P4 candidates (cand-0517..cand-0526) ===
candidates.candidates.push(makeCand("cand-0517",
  "Leadership-to-Fire pattern: Firawn leads people into Fire on Resurrection demonstrating that following non-rashid leadership produces collective damnation",
  "In 11:97-98: They followed Firawn's command; not rashid. He precedes people on Resurrection leads them into Fire; wretched destination.",
  [{ key: "11:97", excerpt: fv(97), evidenceClass: "EXPLICIT_TEXT", rationale: "FaittabaAAoo amra firAAawna: active-following verb. Wama amru firAAawna birasheedin: leadership-quality negation." },
   { key: "11:98", excerpt: fv(98), evidenceClass: "EXPLICIT_TEXT", rationale: "Yaqdumu qawmahu yawma alqiyamati: vanguard-position inverted from worldly leadership. Faawradahumu alnnara: fire-leading as leadership-consequence. Wabisa alwirdu almawroodu: wretchedness-emphasis." }],
  [], "Gap candidate. Leadership-responsibility principle: leaders bear amplified accountability. Qadama (precedes) inverts worldly precedence into eschatological liability. Birasheedin negation defines minimum leadership qualification."
));

candidates.candidates.push(makeCand("cand-0518",
  "Self-wronging principle: Allah did not wrong destroyed communities; they wronged themselves; false gods availed nothing establishing divine justice in punishment",
  "In 11:101: We did not wrong them but they wronged themselves. Their gods invoked besides Allah availed nothing when Lord's command came.",
  [{ key: "11:101", excerpt: fv(101), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama thalamnahum walakin thalamoo anfusahum: explicit self-wronging attribution. Fama aghnat AAanhum alihatuhum: false-gods futility demonstration. Min shayin lamma jaa amru rabbika: total-uselessness at critical moment." }],
  [], "Gap candidate. Self-wronging doctrine absolves divine justice of any unfairness charge. False-gods-futility proven at decisive moment (not abstractly). Pattern applies universally across all destroyed nations."
));

candidates.candidates.push(makeCand("cand-0519",
  "Shaqiyy-sa'eed duality with conditional eternity: wretched in Fire prosperous in Paradise both abiding while heavens earth endure except what Lord wills preserving divine sovereignty",
  "In 11:107-108: Wretched in Fire with exhaling inhaling abiding while heavens earth endure except Lord wills; Lord is Effecter of what He intends. Prosperous in Paradise abiding similarly; uninterrupted bestowal.",
  [{ key: "11:107", excerpt: fv(107), evidenceClass: "EXPLICIT_TEXT", rationale: "Khalideena feeha ma damati alssamawatu waalardu: duration-tied-to-cosmos. Illa ma shaa rabbuka: divine-will exception. Inna rabbaka faAAAAalun lima yureedu: effecter-attribute justifying exception." },
   { key: "11:108", excerpt: fv(108), evidenceClass: "EXPLICIT_TEXT", rationale: "AAataan ghayra majthoothin: uninterrupted-bestowal emphasizing permanence for sa'eed." }],
  [], "Gap candidate. Conditional-eternity formula (illa ma shaa rabbuka) preserves absolute divine sovereignty over even eternal states. Cosmos-duration tie makes eternity comprehensible. Ata' ghayr majthoothin assures believers of unbroken divine generosity."
));

candidates.candidates.push(makeCand("cand-0520",
  "Istiqamah command: remain steadfast as commanded with those who turned with you; do not transgress; He is Seeing establishing perseverance-community-vigilance triad",
  "In 11:112: Remain steadfast as commanded, you and those who turned with you. Do not transgress. Indeed He is Seeing of what you do.",
  [{ key: "11:112", excerpt: fv(112), evidenceClass: "EXPLICIT_TEXT", rationale: "Faistaqim kama omirta: steadfastness tied to received command. Waman taba maAAaka: communal dimension. Wala tatghaw: transgression-prohibition. Innahu bima taAAmaloona baseerun: divine-surveillance as motivation." }],
  [], "Gap candidate. Istiqamah directed specifically to Prophet after historical lessons. Communal inclusion (waman taba) prevents individualistic reading. Baseer attribute makes vigilance internal not external."
));

candidates.candidates.push(makeCand("cand-0521",
  "Anti-inclination to wrongdoers: do not lean toward oppressors lest Fire touch you; no protectors besides Allah; no help available establishing association-danger principle",
  "In 11:113: Do not incline toward wrongdoers lest Fire touch you. You have no protectors besides Allah; then you would not be helped.",
  [{ key: "11:113", excerpt: fv(113), evidenceClass: "EXPLICIT_TEXT", rationale: "Wala tarkanoo ila allatheena thalamoo: inclination-prohibition (rakanoo implies leaning/trusting). Fatamassakumu alnnaru: fire-contact as consequence. Wama lakum min dooni Allahi min awliyaa: protector-absence. Thumma la tunsaroona: help-impossibility." }],
  [], "Gap candidate. Rakanoo (incline/lean) targets subtle sympathy not overt alliance. Fire-contact (tamassakum) suggests even proximity burns. Triple-negative (no protectors, no help) eliminates escape routes."
));

candidates.candidates.push(makeCand("cand-0522",
  "Hasanat remove sayyi'at: good deeds actively eliminate misdeeds establishing practical spiritual purification mechanism tied to prayer timing",
  "In 11:114: Establish prayer at two ends of day and night approach. Indeed good deeds remove misdeeds. That is reminder for rememberers.",
  [{ key: "11:114", excerpt: fv(114), evidenceClass: "EXPLICIT_TEXT", rationale: "Waaqimi alssalata tarafayi alnnahari wazulafan mina allayli: temporal-specificity for prayer. Inna alhasanati yuthhibna alssayyiati: active-removal mechanism. Thalika thikra lilththakireena: reminder-function for receptive hearts." }],
  [], "Gap candidate. Yuthhibna (remove/dispel) stronger than 'forgive' suggesting active cleansing. Prayer-timing specification links ritual regularity to moral maintenance. Dhikra positioning makes this actionable wisdom not abstract theology."
));

candidates.candidates.push(makeCand("cand-0523",
  "Uloo baqiyyah diagnosis: why no generations with enduring discrimination forbidding corruption? Few saved; wrongdoers pursued luxury were criminals identifying civilizational-collapse mechanism",
  "In 11:116: Why were there not among generations before those of enduring discrimination forbidding corruption except few We saved? Wrongdoers pursued luxury therein and were criminals.",
  [{ key: "11:116", excerpt: fv(116), evidenceClass: "EXPLICIT_TEXT", rationale: "Falawla kana mina alqurooni min qablikum oloo baqiyyatin: counterfactual questioning. Yanhawna AAani alfasadi fee alardi: active-corruption-prevention as criterion. Illa qaleelan mimman anjayna minhum: remnant-salvation exception. WaittabaAAa allatheena thalamoo ma otrifoo feehi: luxury-pursuit as decline-driver. Wakanoo mujrimeena: criminality-conclusion." }],
  [], "Gap candidate. Uloo baqiyyah (those with remainder/endurance) identifies moral vanguard as civilization-preservation mechanism. Luxury-pursuit (ma otrifoo) explains elite corruption. Criminality-diagnosis (mujrimeena) reframes cultural decline as moral failure."
));

candidates.candidates.push(makeCand("cand-0524",
  "Divine justice constraint: Lord would not destroy cities unjustly while people are reformers establishing muslihoona as divine-punishment safeguard",
  "In 11:117: Your Lord would not destroy cities unjustly while their people are reformers.",
  [{ key: "11:117", excerpt: fv(117), evidenceClass: "EXPLICIT_TEXT", rationale: "Wama kana rabbuka liyuhlika alqura bithulmin: injustice-negation. Waahluha muslihoona: reformer-presence as protection-condition." }],
  [], "Gap candidate. Establishes divine self-limitation based on human righteousness. Muslihoona (reformers) sets minimum threshold for communal preservation. Bithulmin negation protects divine justice reputation."
));

candidates.candidates.push(makeCand("cand-0525",
  "Difference as divine will: if Lord willed could make mankind one community but they continue differing; mercy-exception as creation purpose",
  "In 11:118-119: If Lord willed He could make mankind one community but they differ. Except whom Lord mercied; for that He created them.",
  [{ key: "11:118", excerpt: fv(118), evidenceClass: "EXPLICIT_TEXT", rationale: "Walaw shaa rabbuka lajaAAala alnnasa ommatan wahidatan: hypothetical-unification showing divine capacity. Wala yazaloona mukhtalifeena: persistent-difference as observed reality." },
   { key: "11:119", excerpt: fv(119), evidenceClass: "EXPLICIT_TEXT", rationale: "Illa man rahima rabbuka: mercy-exception. Walithalika khalaqahum: creation-purpose identification. Watammat kalimatu rabbika: fulfilled-word as eschatological anchor." }],
  [], "Gap candidate. Reframes pluralism from problem to divine design. Mercy-as-creation-purpose gives positive meaning to difference. Hell-filling word balances mercy-theme with accountability."
));

candidates.candidates.push(makeCand("cand-0526",
  "Closing tawheed-tawakkul synthesis: Allah owns unseen heavens earth; all matter returns to Him; worship and rely on Him; Lord not unaware of deeds",
  "In 11:123: To Allah belongs unseen of heavens earth. To Him returns all matter. Worship Him and rely on Him. Your Lord is not unaware of what you do.",
  [{ key: "11:123", excerpt: fv(123), evidenceClass: "EXPLICIT_TEXT", rationale: "Walillahi ghaybu alssamawati waalardi: unseen-ownership. Wailayhi yurjaAAu alamru kulluhu: comprehensive-return. FaoAAbudhu watawakkal AAalayhi: worship-trust pairing as response. Wama rabbuka bighafilin AAamma taAAmaloona: divine-awareness as final motivation." }],
  [], "Gap candidate. Surah-closure mirrors opening themes completing ring structure. Ghayb-ownership affirms limits of human knowledge. Worship-tawakkul pairing summarizes entire prophetic message. Ghafilin-negation provides perpetual accountability motivation."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-035.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-035.json");
console.log(`Generated ${candidates.candidates.length} candidates`);
console.log("Surah Hud Pass A generation complete.");
