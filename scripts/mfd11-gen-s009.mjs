// MFD-11 At-Tawbah generator — extracts ALL Arabic directly from corpus bytes.
// Covers Surah At-Tawbah 9:1-129 (Passages 1-4, Candidates cand-0407..cand-0446).
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const CORPUS_VIEW = path.join(ROOT, "research", "mfd-11", "corpus-view", "009-0001-0129.json");
const OUT_DIR = path.join(ROOT, "research", "mfd-11");
const corpus = JSON.parse(readFileSync(CORPUS_VIEW, "utf8"));
const verses = {};
for (const v of corpus.verses) verses[v.id] = v.text;
function fv(n) {
  if (!verses[n]) throw new Error(`Verse 9:${n} not found`);
  return verses[n];
}
console.log("Generating At-Tawbah files from verbatim corpus (9:1-129)...");
console.log(`Corpus loaded: ${Object.keys(verses).length} verses`);
const TS = "2026-11-20T10:30:00.000Z";
function findWordContaining(vid, chars) {
  const t = fv(vid); const words = t.split(/\s+/);
  for (const w of words) { let m = true; for (const ch of chars) { if (!w.includes(ch)) { m = false; break; } } if (m) return w; }
  return null;
}
function findPhrase(vid, phrase) { const t = fv(vid); const i = t.indexOf(phrase); return i >= 0 ? t.slice(i, i + phrase.length) : null; }
function makeCand(id, label, def, evidenceArr, overlap, notes) {
  return { candidateId: id, label, definition: def, definitionStatus: "editorial-draft", evidence: evidenceArr, existingTopicOverlap: overlap || [], proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS, notes };
}

// ─── Passage 1: 9:1–29 ────────────────────────────────────────────────────────
const p1Keys = Array.from({length:29}, (_,i) => `9:${i+1}`);
const p1 = {
  extractionId: "ext-009-p1", workstream: "MFD-11", pass: "A", surah: 9, surahName: "At-Tawbah",
  passage: { fromAyah: 1, toAyah: 29, label: "At-Tawbah — Bara'ah declaration disassociation from treaty-polytheists; four-month grace; Hajj Akbar announcement; repentance pathway; faithful treaty exception; post-sacred-months combat directive; asylum for knowledge-seekers; mosque maintenance restricted to believers; siqayah-imarah not equal faith-jihad; Hunayn sakina lesson; najas ruling; jizyah framework for People of Scripture" },
  verseKeys: p1Keys,
  arabicExcerpts: Array.from({length:29}, (_,i) => ({ key: `9:${i+1}`, text: fv(i+1) })),
  mainSubject: { label: "Comprehensive bara'ah disassociation establishing new politico-religious order; four-month grace with Hajj Akbar proclamation; conditional warfare with repentance-prayer-zakat brotherhood pathway; asylum obligation; mosque-maintenance criteria; faith-hijrah-jihad hierarchy; Hunayn divine sakina lesson; najas exclusion; jizyah framework", keys: p1Keys, evidenceClass: "EXPLICIT_TEXT" },
  subordinateSubjects: [
    { label: "Bara'ah declaration from Allah and Messenger to treaty-polytheists", keys: ["9:1"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Four-month free travel with inability-to-defeat-Allah warning", keys: ["9:2"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hajj Akbar public announcement of disassociation", keys: ["9:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Faithful treaty-partners exception: complete their term", keys: ["9:4"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-sacred-months combat: kill capture besiege ambush", keys: ["9:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance-establish-zakat opens safe path Ghafoor Raheem", keys: ["9:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Asylum obligation: grant protection hear Allah's word deliver safely", keys: ["9:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "No valid treaty except Masjid Haram upright parties", keys: ["9:7"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Oral compliance hearts refusal most fasiqeen", keys: ["9:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Signs sold small price averting from way evil deeds", keys: ["9:9"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance-prayer-zakat establishes brotherhood in religion", keys: ["9:11"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Oath-breaking defamation triggers fighting leaders of kufr", keys: ["9:12"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Combat purpose: punish disgrace victory heal breasts remove fury", keys: ["9:14","9:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jihad test distinguishing strivers without intimates besides Allah-Rasool-believers", keys: ["9:16"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Polytheists cannot maintain mosques witnessing kufr deeds worthless", keys: ["9:17"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True mosque maintainers: believe Last Day prayer zakat fear only Allah", keys: ["9:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Siqayah-imarah not equal faith-jihad", keys: ["9:19"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Faith-hijrah-jihad greater rank faaizoon", keys: ["9:20"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prohibition taking fathers brothers allies preferring kufr", keys: ["9:23"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Love hierarchy test: family wealth commerce vs Allah-Rasool-jihad", keys: ["9:24"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hunayn: numerical superiority availed nothing fled", keys: ["9:25"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine sakina unseen soldiers punished disbelievers", keys: ["9:26"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Najas ruling: polytheists barred from Masjid Haram", keys: ["9:28"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jizyah command: fight People of Scripture until jizyah saghiroona", keys: ["9:29"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["9:5"], excerpt: fv(5), description: "Command: when sacred months passed kill polytheists wherever found capture besiege ambush." },
    { kind: "COMMAND", keys: ["9:6"], excerpt: fv(6), description: "Command: grant asylum to polytheist seeking protection so he hears Allah's word then deliver safely." },
    { kind: "PROHIBITION", keys: ["9:23"], excerpt: fv(23), description: "Prohibition: do not take fathers or brothers as allies if they prefer disbelief over belief." },
    { kind: "COMMAND", keys: ["9:29"], excerpt: fv(29), description: "Command: fight People of Scripture not believing until they give jizyah willingly humbled." }
  ],
  divineNamesAndAttributes: [],
  propheticNarratives: [],
  humanConditionsAndSpiritualStates: [
    { label: "Oral compliance masking heart-refusal among treaty violators", keys: ["9:8"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believer breast healing through divine victory", keys: ["9:14","9:15"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Numerical self-admiration leading to battlefield collapse at Hunayn", keys: ["9:25"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Treaty enforcement with temporal grace period and conditional amnesty", keys: ["9:2","9:3","9:4","9:5"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Asylum protocol ensuring safe hearing for knowledge-seeking non-Muslims", keys: ["9:6"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sacred space governance restricting mosque maintenance to believers", keys: ["9:17","9:18"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Jizyah system establishing regulated fiscal relationship with People of Scripture", keys: ["9:29"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Allah-Messenger joint declaration in treaty dissolution", keys: ["9:1","9:3"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance-prayer-zakat as entry into believer brotherhood", keys: ["9:11"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0407","cand-0408","cand-0409","cand-0410","cand-0411","cand-0412","cand-0413","cand-0414","cand-0415","cand-0416"],
  notes: "Pass A At-Tawbah passage 1/4. Foundational politico-religious restructuring. Bara'ah lacks Basmalah marking rupture. Four-month grace balances severity with fairness. Asylum clause preserves epistemic access. Mosque-maintenance criteria redefine sacred space. Hunayn provides empirical lesson on divine agency. Najas establishes ritual boundary. Jizyah creates regulated coexistence.",
  proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
};
// P1 divine names
{ const t1=findWordContaining(5,["\u063a","\u0641","\u0648","\u0631"]); const t2=findWordContaining(5,["\u0631","\u062d","\u064a","\u0645"]); if(t1&&t2){const ft=fv(5);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p1.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"Ghafoorun Raheem",gloss:"Forgiving Merciful (editorial gloss)",keys:["9:5"]});} }
{ const t1=findWordContaining(15,["\u0639","\u0644","\u064a","\u0645"]); const t2=findWordContaining(15,["\u062d","\u0643","\u064a","\u0645"]); if(t1&&t2){const ft=fv(15);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p1.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"Aleem Hakeem",gloss:"Knowing Wise (editorial gloss)",keys:["9:15"]});} }
{ const t1=findWordContaining(28,["\u0639","\u0644","\u064a","\u0645"]); const t2=findWordContaining(28,["\u062d","\u0643","\u064a","\u0645"]); if(t1&&t2){const ft=fv(28);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p1.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"Aleem Hakeem",gloss:"Knowing Wise (editorial gloss)",keys:["9:28"]});} }
// P1 terminology
{ const t=findWordContaining(1,["\u0628","\u0631","\u0623"]); if(t)p1.terminology.push({term:t,transliteration:"bara'ah",gloss:"disassociation/immunity (editorial gloss)",keys:["9:1"]}); }
{ const t=findPhrase(3,"\u0671\u0644\u0652\u062d\u064e\u062c\u0651\u0650 \u0671\u0644\u0652\u0623\u064e\u0643\u0652\u0628\u064e\u0631\u0650"); if(t)p1.terminology.push({term:t,transliteration:"al-hajj al-akbar",gloss:"greater pilgrimage (editorial gloss)",keys:["9:3"]}); }
{ const t=findWordContaining(28,["\u0646","\u062c","\u0633"]); if(t)p1.terminology.push({term:t,transliteration:"najas",gloss:"unclean/impure (editorial gloss)",keys:["9:28"]}); }
{ const t=findWordContaining(29,["\u062c","\u0632","\u064a"]); if(t)p1.terminology.push({term:t,transliteration:"jizyah",gloss:"poll tax/tribute (editorial gloss)",keys:["9:29"]}); }
writeFileSync(path.join(OUT_DIR,"extractions","009-at-tawbah-p1.json"),JSON.stringify(p1,null,2)+"\n");
console.log("Wrote 009-at-tawbah-p1.json");

// ─── Passage 2: 9:30–66 ────────────────────────────────────────────────────────
const p2Keys = Array.from({length:37}, (_,i) => `9:${i+30}`);
const p2 = {
  extractionId: "ext-009-p2", workstream: "MFD-11", pass: "A", surah: 9, surahName: "At-Tawbah",
  passage: { fromAyah: 30, toAyah: 66, label: "At-Tawbah — Theological correction of sonship claims; clerical corruption critique; hoarding condemnation; sacred calendar restoration rejecting nasi; hypocrite psychology exposing excuses fitna charity-criticism; divine light perfection; jihad mobilization; zakah distribution framework; mockery-revelation dynamic" },
  verseKeys: p2Keys,
  arabicExcerpts: Array.from({length:37}, (_,i) => ({ key: `9:${i+30}`, text: fv(i+30) })),
  mainSubject: { label: "Systematic theological correction of Jewish-Christian sonship claims; clerical wealth-devouring linked to way-aversion; hoarding eschatological branding; nasi rejection restoring calendar sovereignty; extensive hypocrite behavioral analysis; divine light perfection; jihad mobilization contrasting believer eagerness with hypocrite reluctance; zakah eight-category codification; mockery-exposure dynamic", keys: p2Keys, evidenceClass: "EXPLICIT_TEXT" },
  subordinateSubjects: [
    { label: "Jewish Uzayr Christian Masih sonship claims as oral imitation", keys: ["9:30"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Scholars monks taken as arbāb besides Allah and Masih", keys: ["9:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Attempt extinguish Allah light mouths Allah perfects light", keys: ["9:32"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger sent hudá din haqq manifest over all religion", keys: ["9:33"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ahbar ruhban devour wealth batil avert from way", keys: ["9:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Gold-silver hoarders warned painful punishment branding", keys: ["9:34","9:35"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Twelve months four sacred correct religion do not wrong selves", keys: ["9:36"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nasi increase kufr misleads alternating lawful-unlawful", keys: ["9:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heaviness earth when called infiroo dunya preference", keys: ["9:38"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Cave narrative la tahzan sakina unseen soldiers", keys: ["9:40"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mobilization command light heavy strive wealth lives", keys: ["9:41"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocrite conditional loyalty easy gain would follow distant deterrent", keys: ["9:42"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "True believers do not ask excuse from striving", keys: ["9:44"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Excuse-seekers non-believers doubtful hearts hesitating", keys: ["9:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Trial-avoidance request actually fallen into fitna", keys: ["9:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Qadar response never struck except decreed tawakkul", keys: ["9:51"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Spending rejection willing unwilling never accepted fasiqeen", keys: ["9:53"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Contentment formula hasbuna Allah raghiboon", keys: ["9:59"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Zakah eight recipients fareedah Aleem Hakeem", keys: ["9:60"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet-abuse ear of goodness believes believers mercy", keys: ["9:61"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mockery excuse conversing playing challenged Allah verses mocking", keys: ["9:65"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Post-belief disbelief verdict no excuse pardon punish mujrimeena", keys: ["9:66"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "PROHIBITION", keys: ["9:36"], excerpt: fv(36), description: "Prohibition: do not wrong yourselves during sacred months." },
    { kind: "COMMAND", keys: ["9:41"], excerpt: fv(41), description: "Command: go forth light or heavy strive with wealth and lives." },
    { kind: "TAUGHT_SUPPLICATION", keys: ["9:59"], excerpt: fv(59), description: "Taught response: sufficient for us is Allah; Allah will give from bounty; to Allah desirous." }
  ],
  divineNamesAndAttributes: [],
  propheticNarratives: [{ label: "Cave hijrah: Prophet-companion divine reassurance sakina unseen support", keys: ["9:40"], evidenceClass: "EXPLICIT_TEXT" }],
  humanConditionsAndSpiritualStates: [
    { label: "Doubt-induced hesitation rayb yataraddadoona as hypocrite marker", keys: ["9:45"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fitna-avoidance pretext masking actual fall into trial", keys: ["9:49"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Contentment formula hasbuna Allah as proper believer response", keys: ["9:59"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Clerical wealth-devouring akl amwal batil as systemic corruption", keys: ["9:34"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Precious-metal hoarding condemned with branding penalty", keys: ["9:34","9:35"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Calendar manipulation nasi as institutionalized innovation", keys: ["9:37"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Zakah distribution codified eight categories divine fareedah", keys: ["9:60"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Scholar-monk lordship usurpation displacing divine authority", keys: ["9:31"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet as ear of goodness believing believers mercy", keys: ["9:61"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0417","cand-0418","cand-0419","cand-0420","cand-0421","cand-0422","cand-0423","cand-0424","cand-0425","cand-0426"],
  notes: "Pass A At-Tawbah passage 2/4. Theological-polemical core. Sonship refutation targets specific claims. Clerical corruption links economic exploitation to spiritual obstruction. Hoarding uses sensory branding. Nasi restores calendar sovereignty. Hypocrite psychology covers excuse-making volatility charity-resentment. Zakah codifies eight categories. Mockery-exposure demonstrates revelation diagnostic function.",
  proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
};
// P2 divine names
{ const t1=findWordContaining(40,["\u0639","\u0632","\u064a","\u0632"]); const t2=findWordContaining(40,["\u062d","\u0643","\u064a","\u0645"]); if(t1&&t2){const ft=fv(40);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p2.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"al-Azeez al-Hakeem",gloss:"Exalted Mighty Wise (editorial gloss)",keys:["9:40"]});} }
{ const t1=findWordContaining(60,["\u0639","\u0644","\u064a","\u0645"]); const t2=findWordContaining(60,["\u062d","\u0643","\u064a","\u0645"]); if(t1&&t2){const ft=fv(60);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p2.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"Aleem Hakeem",gloss:"Knowing Wise (editorial gloss)",keys:["9:60"]});} }
// P2 terminology
{ const t=findWordContaining(37,["\u0646","\u0633","\u064a"]); if(t)p2.terminology.push({term:t,transliteration:"nasi'",gloss:"postponement/intercalation (editorial gloss)",keys:["9:37"]}); }
{ const t=findWordContaining(40,["\u0633","\u0643","\u064a"]); if(t)p2.terminology.push({term:t,transliteration:"sakina",gloss:"tranquillity/divine reassurance (editorial gloss)",keys:["9:40"]}); }
{ const t=findWordContaining(60,["\u0645","\u0624","\u0644"]); if(t)p2.terminology.push({term:t,transliteration:"mu'allafah quloobuhum",gloss:"hearts brought together/reconciled (editorial gloss)",keys:["9:60"]}); }
writeFileSync(path.join(OUT_DIR,"extractions","009-at-tawbah-p2.json"),JSON.stringify(p2,null,2)+"\n");
console.log("Wrote 009-at-tawbah-p2.json");

// ─── Passage 3: 9:67–95 ────────────────────────────────────────────────────────
const p3Keys = Array.from({length:29}, (_,i) => `9:${i+67}`);
const p3 = {
  extractionId: "ext-009-p3", workstream: "MFD-11", pass: "A", surah: 9, surahName: "At-Tawbah",
  passage: { fromAyah: 67, toAyah: 95, label: "At-Tawbah — Hypocrite-believer structural contrast; destroyed-nations precedent; broken-covenant psychology producing permanent nifaq; charity-resentment and mockery of contributors; seventy-times forgiveness limit; remaining-behind rejoicing and Hell-hotter counter; funeral prayer prohibition; wealth-children as punishment instrument; Bedouin excuse-makers versus sincere tearful volunteers; blame restricted to rich excuse-seekers" },
  verseKeys: p3Keys,
  arabicExcerpts: Array.from({length:29}, (_,i) => ({ key: `9:${i+67}`, text: fv(i+67) })),
  mainSubject: { label: "Structural mirror between hypocrite and believer communities with inverted moral orientations; historical precedent linking contemporary hypocrisy to destroyed nations; covenant-breaking producing implanted nifaq; charity-criticism and contributor-mockery condemned; intercession efficacy limit for rooted disbelief; expedition-abandonment consequences including funeral-rite exclusion; exemption framework distinguishing genuine incapacity from wealthy evasion; Bedouin sincerity spectrum assessed by divine knowledge", keys: p3Keys, evidenceClass: "EXPLICIT_TEXT" },
  subordinateSubjects: [
    { label: "Hypocrite men-women mutual reinforcement enjoining munkar forbidding maruf closing hands", keys: ["9:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Reciprocal forgetting: forgot Allah so He forgot them; they are fasiqoon", keys: ["9:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocrites-kuffar shared destiny Jahannam eternal cursed enduring punishment", keys: ["9:68"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Predecessors stronger richer enjoyed portion engaged vanities deeds worthless losers", keys: ["9:69"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Destroyed nations catalog Nuh Aad Thamud Ibrahim Madyan Mutafikat self-wronging not divinely wronged", keys: ["9:70"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believing men-women allies enjoining maruf forbidding munkar prayer zakat obedience mercy promised", keys: ["9:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Believer reward gardens rivers pleasant dwellings Adn ridwan akbar fawz azim", keys: ["9:72"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic command fight kuffar munafiqeen harshness Jahannam destination", keys: ["9:73"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "False denial oath while word of kufr spoken disbelieved after islam planned unattained", keys: ["9:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Resentment motive only Allah-Messenger enrichment; repentance offered better option", keys: ["9:74"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Conditional covenant promising charity if enriched then stinginess and turning away", keys: ["9:75","9:76"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Covenant-breaking penalty nifaq in hearts until meeting day due to promise-failure and lying", keys: ["9:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine knowledge of secrets private conversations Allam al-ghuyub", keys: ["9:78"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Mockery of voluntary contributors and effort-only givers reciprocated by divine ridicule", keys: ["9:79"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Seventy-times istighfar insufficient for those disbelieving Allah and Messenger", keys: ["9:80"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Remaining-behind rejoicing heat-avoidance answered by hotter Jahannam fire", keys: ["9:81"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Laugh-little weep-much reversal as recompense for earning", keys: ["9:82"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Permanent expedition exclusion for initial sitting-satisfaction", keys: ["9:83"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Funeral prayer and grave-standing prohibition for deceased hypocrites", keys: ["9:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wealth-children not impressive intended as worldly punishment souls depart as kafirun", keys: ["9:85"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Wealthy asking permission to sit when jihad surah revealed", keys: ["9:86"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Satisfaction with remaining behind leads to heart-sealing and comprehension loss", keys: ["9:87"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger and believers strove with wealth lives receiving khayrat and success", keys: ["9:88"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prepared gardens rivers eternal abode as great attainment for strivers", keys: ["9:89"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bedouin excuse-makers seeking permission and outright liars staying home", keys: ["9:90"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exemption for weak ill resourceless when sincere to Allah and Messenger", keys: ["9:91"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tearful mount-less volunteers eyes overflowing grief at inability to spend", keys: ["9:92"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Blame only on rich permission-seekers whose hearts Allah sealed", keys: ["9:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Return-excuse rejection Allah already informed deeds observed returned to Knower unseen witnessed", keys: ["9:94"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Oath-driven avoidance request answered by turn-away command rijs and Jahannam refuge", keys: ["9:95"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["9:73"], excerpt: fv(73), description: "Command: O Prophet strive against disbelievers and hypocrites and be harsh upon them." },
    { kind: "PROHIBITION", keys: ["9:84"], excerpt: fv(84), description: "Prohibition: never pray over any of them who died nor stand at his grave." },
    { kind: "PROHIBITION", keys: ["9:85"], excerpt: fv(85), description: "Prohibition: let not their wealth and children impress you." },
    { kind: "COMMAND", keys: ["9:95"], excerpt: fv(95), description: "Command: turn away from them; they are rijs and their refuge is Jahannam." }
  ],
  divineNamesAndAttributes: [],
  propheticNarratives: [{ label: "Destroyed-nations precedent catalog: people of Nuh, Aad, Thamud, Ibrahim, Madyan and the overturned towns received clear proofs yet wronged themselves", keys: ["9:70"], evidenceClass: "EXPLICIT_TEXT" }],
  humanConditionsAndSpiritualStates: [
    { label: "Reciprocal divine forgetting following human forgetting of Allah", keys: ["9:67"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nifaq implanted in hearts as lasting consequence of broken promise and habitual lying", keys: ["9:77"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Heart-sealing and loss of understanding after choosing comfort over commitment", keys: ["9:87","9:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tearful grief of resource-unable volunteers as marker of sincerity", keys: ["9:92"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Funeral-rite restriction establishing visible communal membership boundary", keys: ["9:84"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Military exemption law distinguishing incapacity and poverty from wealthy evasion", keys: ["9:91","9:92","9:93"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Voluntary charity protected from public criticism and ridicule", keys: ["9:79"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Believer mutual alliance defined by shared moral enforcement ritual practice and obedience", keys: ["9:71"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hypocrite solidarity mirroring believer alliance with inverted moral content", keys: ["9:67"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0427","cand-0428","cand-0429","cand-0430","cand-0431","cand-0432","cand-0433","cand-0434","cand-0435","cand-0436"],
  notes: "Pass A At-Tawbah passage 3/4. Boundary chosen at 9:67 where the text shifts from individual hypocrite incidents to the paired community portraits (munafiqoon/munafiqat 9:67 versus muminoon/muminat 9:71); closes at 9:95 with the return-from-expedition oath scene before the Bedouin survey begins at 9:96-97. Historical precedent chain universalizes the warning. Covenant-breaking psychology reveals transactional faith producing permanent nifaq. Seventy-times limit establishes intercession boundary. Funeral ban creates communal boundary. Tearful volunteers supply an emotional authenticity criterion contrasting wealthy evaders.",
  proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
};
// P3 divine names
{ const t1=findWordContaining(71,["\u0639","\u0632","\u064a","\u0632"]); const t2=findWordContaining(71,["\u062d","\u0643","\u064a","\u0645"]); if(t1&&t2){const ft=fv(71);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p3.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"Azeezun Hakeem",gloss:"Exalted in Might Wise (editorial gloss)",keys:["9:71"]});} }
{ const t1=findWordContaining(78,["\u0639","\u0644","\u0627","\u0645"]); const t2=findWordContaining(78,["\u063a","\u064a","\u0648","\u0628"]); if(t1&&t2){const ft=fv(78);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p3.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"Allamu al-Ghuyoob",gloss:"Knower of the unseen realms (editorial gloss)",keys:["9:78"]});} }
{ const t1=findWordContaining(91,["\u063a","\u0641","\u0648","\u0631"]); const t2=findWordContaining(91,["\u0631","\u062d","\u064a","\u0645"]); if(t1&&t2){const ft=fv(91);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p3.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"Ghafoorun Raheem",gloss:"Forgiving Merciful (editorial gloss)",keys:["9:91"]});} }
// P3 terminology
{ const t=findWordContaining(67,["\u0645","\u0646","\u0643"]); if(t)p3.terminology.push({term:t,transliteration:"munkar",gloss:"wrong/disapproved conduct (editorial gloss)",keys:["9:67"]}); }
{ const t=findWordContaining(71,["\u0645","\u0639","\u0631"]); if(t)p3.terminology.push({term:t,transliteration:"ma'ruf",gloss:"right/approved conduct (editorial gloss)",keys:["9:71"]}); }
{ const t=findWordContaining(77,["\u0646","\u0641","\u0627"]); if(t)p3.terminology.push({term:t,transliteration:"nifaq",gloss:"hypocrisy/duplicity (editorial gloss)",keys:["9:77"]}); }
{ const t=findWordContaining(91,["\u062d","\u0631","\u062c"]); if(t)p3.terminology.push({term:t,transliteration:"haraj",gloss:"constraint/blame-worthy burden (editorial gloss)",keys:["9:91"]}); }
writeFileSync(path.join(OUT_DIR,"extractions","009-at-tawbah-p3.json"),JSON.stringify(p3,null,2)+"\n");
console.log("Wrote 009-at-tawbah-p3.json");

// ─── Passage 4: 9:96–129 ────────────────────────────────────────────────────────
const p4Keys = Array.from({length:34}, (_,i) => `9:${i+96}`);
const p4 = {
  extractionId: "ext-009-p4", workstream: "MFD-11", pass: "A", surah: 9, surahName: "At-Tawbah",
  passage: { fromAyah: 96, toAyah: 129, label: "At-Tawbah — Oaths cannot buy divine approval; Bedouin survey of hardened hypocrites versus sincere spenders; forerunners Muhajireen Ansar mutual pleasure; confessors of mixed deeds purified by sadaqah and prophetic invocation; deferred cases left to Allah's command; masjid dirar exposed against taqwa-founded mosque; divine purchase of lives and wealth for Paradise confirmed in Torah Injeel Quran; nine believer attributes; istighfar for polytheists barred with Ibrahim precedent; guidance clarified before misguidance; dominion life-death; hour-of-difficulty forgiveness and the three left behind finding refuge only in Allah; be with the truthful; every hardship and expenditure registered; tafaqqah fi al-din division of labor; fight adjacent disbelievers; revelation increases faith or filth; annual trials without repentance; hearts turned away; Messenger from among yourselves raoof raheem; hasbiya Allah tawakkul Lord of the Great Throne" },
  verseKeys: p4Keys,
  arabicExcerpts: Array.from({length:34}, (_,i) => ({ key: `9:${i+96}`, text: fv(i+96) })),
  mainSubject: { label: "Community consolidation: Bedouin sincerity spectrum; forerunner vanguard mutual pleasure; graded repentance via sadaqah purification and deferred cases; masjid dirar versus taqwa-founded mosque; divine purchase covenant for Paradise across three scriptures; nine believer attributes; istighfar limits with Ibrahim precedent; forgiveness of hour-of-difficulty and three left behind; deed-registration; tafaqqah-mobilization balance; revelation bifurcation; Messenger portrait and closing tawakkul", keys: p4Keys, evidenceClass: "EXPLICIT_TEXT" },
  subordinateSubjects: [
    { label: "Human satisfaction cannot substitute for divine displeasure with fasiqeen", keys: ["9:96"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bedouins stronger in kufr and nifaq and less likely to know revealed limits", keys: ["9:97"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Bedouins treating spending as maghram loss while awaiting believers' misfortune", keys: ["9:98"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sincere Bedouins treat spending as qurbat nearness and seek the Messenger's invocations", keys: ["9:99"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Forerunners among Muhajireen and Ansar and their ihsan-followers attain mutual pleasure and eternal gardens", keys: ["9:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Entrenched hypocrites around Madinah unknown to the Prophet but known to Allah; punished twice then great punishment", keys: ["9:101"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Confessors who mixed a righteous deed with a bad one may receive Allah's turning", keys: ["9:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Sadaqah taken from their wealth purifies and causes growth; prophetic salah is sakan reassurance", keys: ["9:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah alone accepts tawbah and receives sadaqat; He is al-Tawwab al-Raheem", keys: ["9:104"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Work command with threefold observation (Allah, Messenger, believers) and return to Knower of unseen and witnessed", keys: ["9:105"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Deferred group awaiting Allah's command: punishment or forgiveness", keys: ["9:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Masjid dirar built for harm disbelief division and ambush-station for Allah's enemy; false good-intention oath exposed", keys: ["9:107"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Never stand in it; the mosque founded on taqwa from day one is worthier, its men love purification", keys: ["9:108"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Foundation parable: taqwa and ridwan versus collapsing bank edge falling into Jahannam", keys: ["9:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Their building remains riba doubt in their hearts until hearts are cut apart", keys: ["9:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Divine purchase: believers' selves and wealth bought for Paradise; they fight kill and are killed", keys: ["9:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Purchase promise binding in Torah Injeel and Quran; none fulfills covenant better than Allah; rejoice in the transaction", keys: ["9:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Nine attributes: repentant worshipping praising journeying bowing prostrating enjoining maruf forbidding munkar guarding Allah's limits", keys: ["9:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophet and believers barred from istighfar for polytheists even relatives once their Hellfire status is clear", keys: ["9:113"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Ibrahim's istighfar for his father was only a prior promise; he disassociated when enmity to Allah became clear; awwah haleem", keys: ["9:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah does not misguide a people after guiding them until He clarifies what to avoid", keys: ["9:115"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Dominion of heavens and earth; gives life and causes death; no protector or helper besides Him", keys: ["9:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah turned to Prophet Muhajireen Ansar who followed in the hour of difficulty after hearts nearly swerved; Raoof Raheem", keys: ["9:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "The three left behind: earth and selves narrowed until they knew no refuge from Allah except in Him; then He turned so they repent", keys: ["9:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Command: fear Allah and be with the sadiqeen", keys: ["9:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Madinah people and surrounding Bedouins must not stay behind or prefer themselves over the Messenger", keys: ["9:120"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Every thirst fatigue hunger and enemy-infliction in Allah's cause registered as righteous deed; muhsineen reward not lost", keys: ["9:120","9:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Not all believers mobilize: a group from each division stays for tafaqqah fi al-din and warns their people on return", keys: ["9:122"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Fight adjacent disbelievers who should find harshness in you; Allah is with the muttaqeen", keys: ["9:123"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Revelation increases believers in faith with rejoicing while hypocrites ask mockingly who gained faith", keys: ["9:124"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Diseased hearts gain rijs upon rijs and die as disbelievers", keys: ["9:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tried once or twice yearly yet neither repent nor remember", keys: ["9:126"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "At each revelation they glance for observers then slip away; Allah turned their hearts because they do not understand", keys: ["9:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger from among yourselves: your suffering grievous to him, concerned over you, raoof raheem to believers", keys: ["9:128"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Closing confession if they turn away: hasbiya Allah, no deity but He, upon Him I rely, Lord of the Great Throne", keys: ["9:129"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  commandsAndProhibitions: [
    { kind: "COMMAND", keys: ["9:103"], excerpt: fv(103), description: "Command: take sadaqah from their wealth purifying and growing them, and invoke blessings upon them." },
    { kind: "COMMAND", keys: ["9:105"], excerpt: fv(105), description: "Command: say work, for Allah, His Messenger and the believers will see your deeds." },
    { kind: "PROHIBITION", keys: ["9:108"], excerpt: fv(108), description: "Prohibition: never stand for prayer in the masjid dirar; the taqwa-founded mosque is worthier." },
    { kind: "COMMAND", keys: ["9:111"], excerpt: fv(111), description: "Command: rejoice in the transaction you have contracted with Allah." },
    { kind: "COMMAND", keys: ["9:112"], excerpt: fv(112), description: "Command: give good tidings to the believers described by the nine attributes." },
    { kind: "PROHIBITION", keys: ["9:113"], excerpt: fv(113), description: "Prohibition: it is not for the Prophet and believers to seek forgiveness for polytheists even relatives after their Hellfire status is clear." },
    { kind: "COMMAND", keys: ["9:119"], excerpt: fv(119), description: "Command: O believers fear Allah and be with the truthful." },
    { kind: "COMMAND", keys: ["9:123"], excerpt: fv(123), description: "Command: fight those adjacent to you of the disbelievers and let them find harshness in you." },
    { kind: "TAUGHT_SUPPLICATION", keys: ["9:129"], excerpt: fv(129), description: "Taught declaration when they turn away: sufficient for me is Allah; no deity except Him; on Him I rely; He is Lord of the Great Throne." }
  ],
  divineNamesAndAttributes: [],
  propheticNarratives: [
    { label: "Ibrahim's promised istighfar for his father ended in disassociation once enmity to Allah became clear", keys: ["9:114"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hour-of-difficulty expedition: Allah's turning upon the Prophet, Muhajireen and Ansar after hearts nearly swerved", keys: ["9:117"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "The three left behind whose earth and selves narrowed until refuge was found only in Allah", keys: ["9:118"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  humanConditionsAndSpiritualStates: [
    { label: "Mixed-deed state: righteous and evil acts combined with acknowledged sins open to divine turning", keys: ["9:102"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Suspension before divine judgment: neither condemned nor absolved, awaiting Allah's command", keys: ["9:106"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Persistent inner doubt (reeba) lodged by the dirar building until death", keys: ["9:110"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repentance (tawbah) as the first listed attribute of the covenant believers", keys: ["9:112"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Constriction of earth and self producing certainty that refuge from Allah is only in Him", keys: ["9:118"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Truthfulness companionship (ma'a al-sadiqeen) commanded as spiritual orientation", keys: ["9:119"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Faith increase with rejoicing versus filth increase in diseased hearts at the same revelation", keys: ["9:124","9:125"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Repeated annual trials met with neither repentance nor remembrance", keys: ["9:126"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Hearts turned away (sarafa Allahu quloobahum) as consequence of persistent non-understanding", keys: ["9:127"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Tawakkul reliance confessed after communal rejection", keys: ["9:129"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  socialEconomicCivilisational: [
    { label: "Sadaqah as institutional purification and growth mechanism administered by the Prophet", keys: ["9:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Religious architecture assessed by founding intent: harm-division-ambush mosque versus taqwa-founded mosque", keys: ["9:107","9:108","9:109"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Purchase-covenant economy exchanging lives and property for Paradise attested in three scriptures", keys: ["9:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Comprehensive deed-registration covering hardship, terrain and every small or large expenditure", keys: ["9:120","9:121"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Division of communal labor between mobilization and religious scholarship (tafaqqah fi al-din)", keys: ["9:122"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  relationships: [
    { label: "Mutual pleasure between Allah and the forerunners and their ihsan-followers", keys: ["9:100"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Allah as purchaser and believers as sellers in a binding covenant transaction", keys: ["9:111"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Prophetic invocation functioning as reassurance (sakan) for repentant givers", keys: ["9:103"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Exclusive protectorship: no wali or naseer besides Allah who gives life and death", keys: ["9:116"], evidenceClass: "EXPLICIT_TEXT" },
    { label: "Messenger-community bond: shared origin, shared suffering, kindness and mercy toward believers", keys: ["9:128"], evidenceClass: "EXPLICIT_TEXT" }
  ],
  terminology: [],
  topicCandidateIds: ["cand-0437","cand-0438","cand-0439","cand-0440","cand-0441","cand-0442","cand-0443","cand-0444","cand-0445","cand-0446"],
  notes: "Pass A At-Tawbah passage 4/4. Boundary opens at 9:96 where the text closes the expedition-excuse scenes with the oath-for-approval verdict and begins the final community survey (Bedouins 9:97-99, forerunners 9:100, graded repentance cases 9:101-106); runs through the dirar episode, the purchase covenant, intercession limits, the forgiveness narratives and closing legislation to the surah's tawakkul seal at 9:129. The three-case repentance gradient (hardened hypocrites, confessors, deferred) is the passage's organizing structure. Deferred to scholarly review: identification of the specific mosque founded on taqwa in 9:108, the identity of the three left behind in 9:118, and the referent of the hour of difficulty in 9:117 — the text itself names none of these.",
  proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
};
// P4 divine names
{ const t1=findWordContaining(104,["\u062a","\u0648","\u0627","\u0628"]); const t2=findWordContaining(104,["\u0631","\u062d","\u064a","\u0645"]); if(t1&&t2){const ft=fv(104);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p4.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"al-Tawwab al-Raheem",gloss:"the Accepting of repentance the Merciful (editorial gloss)",keys:["9:104"]});} }
{ const t1=findWordContaining(117,["\u0631","\u0621","\u0648","\u0641"]); const t2=findWordContaining(117,["\u0631","\u062d","\u064a","\u0645"]); if(t1&&t2){const ft=fv(117);const i1=ft.indexOf(t1);const i2=ft.indexOf(t2);if(i1>=0&&i2>i1)p4.divineNamesAndAttributes.push({term:ft.slice(i1,i2+t2.length),transliteration:"Raoofun Raheem",gloss:"Kind Merciful (editorial gloss)",keys:["9:117"]});} }
{ const t=findPhrase(129,"\u0631\u064e\u0628\u0651\u064f \u0671\u0644\u0652\u0639\u064e\u0631\u0652\u0634\u0650 \u0671\u0644\u0652\u0639\u064e\u0638\u0650\u064a\u0645\u0650"); if(t)p4.divineNamesAndAttributes.push({term:t,transliteration:"Rabbu al-Arsh al-Azeem",gloss:"Lord of the Great Throne (editorial gloss)",keys:["9:129"]}); }
// P4 terminology
{ const t=findWordContaining(99,["\u0642","\u0631","\u0628"]); if(t)p4.terminology.push({term:t,transliteration:"qurbat",gloss:"means of nearness (editorial gloss)",keys:["9:99"]}); }
{ const t=findWordContaining(103,["\u0633","\u0643","\u0646"]); if(t)p4.terminology.push({term:t,transliteration:"sakan",gloss:"reassurance/tranquillity (editorial gloss)",keys:["9:103"]}); }
{ const t=findWordContaining(107,["\u0636","\u0631","\u0627"]); if(t)p4.terminology.push({term:t,transliteration:"dirar",gloss:"harm/injury-causing (editorial gloss)",keys:["9:107"]}); }
{ const t=findWordContaining(111,["\u0628","\u064a","\u0639"]); if(t)p4.terminology.push({term:t,transliteration:"bay'",gloss:"sale/transaction (editorial gloss)",keys:["9:111"]}); }
{ const t=findWordContaining(122,["\u0641","\u0642","\u0647"]); if(t)p4.terminology.push({term:t,transliteration:"tafaqqah",gloss:"deep understanding/jurisprudential learning (editorial gloss)",keys:["9:122"]}); }
writeFileSync(path.join(OUT_DIR,"extractions","009-at-tawbah-p4.json"),JSON.stringify(p4,null,2)+"\n");
console.log("Wrote 009-at-tawbah-p4.json");

// ─── Candidates batch (cand-0407..cand-0446) ──────────────────────────────────
const candidates = { workstream: "MFD-11", generatedAt: TS, sourceExtraction: "ext-009-p1,ext-009-p2,ext-009-p3,ext-009-p4", candidates: [] };
function ev(n, rationale) { return { key: `9:${n}`, excerpt: fv(n), evidenceClass: "EXPLICIT_TEXT", rationale }; }

// P1 candidates cand-0407..0416
candidates.candidates.push(makeCand("cand-0407",
  "Bara'ah disassociation proclamation: Allah and His Messenger publicly dissolve treaty relations with polytheists through a four-month grace period announced at the greater pilgrimage",
  "In 9:1-3 a declaration of disassociation from Allah and His Messenger is issued to treaty-holding polytheists, granting four months of free travel while warning they cannot thwart Allah, and an announcement on the day of the greater pilgrimage confirms the rupture while offering repentance as the better course.",
  [ev(1,"Baraatun mina Allahi warasoolihi ila allatheena AAahadtum mina almushrikeena: the dissolution is attributed jointly to Allah and the Messenger and addressed specifically to existing treaty partners, not to polytheists in general."),
   ev(2,"Faseehoo fee alardi arbaAAata ashhurin: a defined four-month window of safe movement precedes any hostilities; ghayru muAAjizee Allahi frames the grace as strength, not weakness."),
   ev(3,"Waathanun ... yawma alhajji alakbari: the announcement is timed to the mass gathering of pilgrimage so the whole community hears it; fain tubtum fahuwa khayrun lakum keeps repentance open even within the proclamation.")],
  [],
  "Gap candidate. The text names no existing topic for treaty dissolution or public diplomatic proclamation. Deferred to scholarly review: which historical treaties are meant and how the four months relate to the sacred months of 9:5 — the verses themselves do not specify."
));
candidates.candidates.push(makeCand("cand-0408",
  "Treaty fidelity obligation: agreements with parties who neither breached terms nor aided enemies must be completed to their full term, grounded in Allah's love of the muttaqeen",
  "In 9:4 and 9:7 polytheist treaty partners who have not been deficient in anything nor supported anyone against the believers are explicitly excepted from dissolution; their treaties must be honored to the agreed term, and uprightness toward them is required as long as they remain upright.",
  [ev(4,"Illa allatheena AAahadtum ... thumma lam yanqusookum shayan walam yuthahiroo AAalaykum ahadan: two concrete breach tests (deficiency and aiding enemies) define the exception; faatimmoo ilayhim AAahdahum ila muddatihim commands full-term completion; inna Allaha yuhibbu almuttaqeena grounds fidelity in taqwa."),
   ev(7,"Fama istaqamoo lakum faistaqeemoo lahum: reciprocity clause making continued honoring conditional on the other party's continued uprightness, again closed with Allah's love of the muttaqeen.")],
  [{ topicId: "justice", layer: "curated", relationship: "related-not-identical", note: "Keeping covenants to their term with non-breaching parties is a concrete application of justice, but the curated topic does not cover treaty law specifically" }],
  "Overlap with justice. The exception structure shows the dissolution is breach-triggered rather than blanket; the same taqwa refrain closes both verses, tying international fidelity to God-consciousness."
));
candidates.candidates.push(makeCand("cand-0409",
  "Conditional combat directive with repentance exit: after the sacred months, hostilities against the treaty-breaking polytheists are commanded, but repentance with prayer and zakah immediately opens a safe path",
  "In 9:5, once the sacred months have passed, killing, capturing, besieging and ambushing the polytheists is commanded; yet if they repent, establish prayer and give zakah their way must be freed, for Allah is Forgiving and Merciful.",
  [ev(5,"Faitha insalakha alashhuru alhurumu: the directive is time-gated by the sacred months. Faoqtuloo ... wakhuthoohum waohsuroohum waoqAAudoo lahum kulla marsadin enumerates the military measures. Fain taboo waaqamoo alssalata waatawoo alzzakata fakhalloo sabeelahum makes cessation mandatory upon repentance-prayer-zakat; inna Allaha ghafoorun raheemun seals the exit clause.")],
  [{ topicId: "repentance", layer: "curated", relationship: "related-not-identical", note: "Repentance here functions as a legal trigger terminating hostilities, a dimension beyond personal repentance" }],
  "Overlap with repentance. The verse pairs maximal severity with an unconditional amnesty mechanism. Deferred to scholarly review: the scope of 'the polytheists' here (all, or the treaty-breakers of the surrounding verses) is disputed in tafsir and is not settled by the verse alone."
));
candidates.candidates.push(makeCand("cand-0410",
  "Asylum right for the seeking polytheist: protection must be granted so he can hear Allah's word, then he must be delivered to his place of safety because his people do not know",
  "In 9:6, if any polytheist seeks protection, it must be granted until he hears the speech of Allah, and he must then be conveyed to his secure place; the stated reason is that they are a people who do not know.",
  [ev(6,"Wain ahadun mina almushrikeena istajaraka faajirhu: individual initiative (istajara, seeking refuge) triggers a binding grant. Hatta yasmaAAa kalama Allahi defines the purpose as exposure to revelation, not coercion. Thumma ablighhu mamanahu guarantees safe return even if he does not accept. Thalika biannahum qawmun la yaAAlamoona grounds the duty in their ignorance rather than hostility.")],
  [],
  "Gap candidate. No verified topic covers asylum, safe conduct, or the right to hear revelation without compulsion. This verse sits inside the combat passage and constrains it: even during authorized hostilities, an individual seeker gains protected hearing and guaranteed delivery."
));
candidates.candidates.push(makeCand("cand-0411",
  "Repentance brotherhood clause: former enemies who repent, establish prayer and give zakah become brothers in religion, with the signs detailed for a people who know",
  "In 9:11, if the polytheists repent, establish prayer and give zakah they are declared the believers' brothers in religion; the verse closes by noting that the signs are made distinct for a people who know.",
  [ev(11,"Fain taboo waaqamoo alssalata waatawoo alzzakata faikhwanukum fee alddeeni: the same three conditions as 9:5 now yield not merely safe passage but full fraternal membership. Wanufassilu alayati liqawmin yaAAlamoona ties comprehension of the detailed signs to knowledge rather than lineage.")],
  [{ topicId: "repentance", layer: "curated", relationship: "related-not-identical", note: "Repentance here produces social incorporation into the believing community, beyond the personal turning covered by the curated topic" }],
  "Overlap with repentance. The progression from 9:5 (free their way) to 9:11 (they are your brothers) shows repentance escalating from ceasefire to kinship. Deferred to scholarly review: whether the three conditions are exhaustive legal criteria or representative markers of sincere conversion."
));
candidates.candidates.push(makeCand("cand-0412",
  "Oath-breaking and religious defamation as combat triggers: fight the leaders of disbelief whose oaths are void so that they may cease",
  "In 9:12-13, breaking oaths after a treaty combined with defaming the religion triggers fighting the leaders of disbelief because no oaths bind them; the following verse asks why one would not fight a people who broke oaths, plotted to expel the Messenger and attacked first, and rebukes fearing them instead of Allah.",
  [ev(12,"Wain nakathoo aymanahum min baAAdi AAahdihim wataAAanoo fee deenikum: two cumulative triggers, oath-breach and religious defamation. Faqatiloo aimmata alkufri targets leadership rather than the general population. Innahum la aymana lahum declares their oaths void. LaAAallahum yantahoona states the purpose as cessation, not extermination."),
   ev(13,"Nakathoo aymanahum wahammoo biikhraji alrrasooli wahum badaookum awwala marratin: three concrete grievances establish the casus belli, including prior aggression. Atakhshawnahum faAllahu ahaqqu an takhshawhu redirects fear from the enemy to Allah as a test of belief.")],
  [],
  "Gap candidate. No verified topic covers just-war triggers or the voiding of oaths by repeated breach. The stated aim (that they may cease) frames the fighting as coercive deterrence rather than annihilation."
));
candidates.candidates.push(makeCand("cand-0413",
  "Mosque maintenance qualification: only those who believe in Allah and the Last Day, establish prayer, give zakah and fear none but Allah may maintain Allah's mosques",
  "In 9:17-18, polytheists witnessing disbelief against themselves are barred from maintaining Allah's mosques and their deeds are worthless; maintenance belongs only to those who believe in Allah and the Last Day, establish prayer, give zakah and fear none but Allah, who may be among the guided.",
  [ev(17,"Ma kana lilmushrikeena an yaAAmuroo masajida Allahi shahideena AAala anfusihim bialkufri: self-witnessed disbelief disqualifies custodianship. Habitat aAAmaluhum nullifies their works despite outward service."),
   ev(18,"Innama yaAAmuru masajida Allahi man amana biAllahi waalyawmi alakhiri waaqama alssalata waata alzzakata walam yakhsha illa Allaha: four positive qualifications plus exclusive fear define legitimate custodianship; faAAasa olaika an yakoonoo mina almuhtadeena keeps the outcome hopeful rather than guaranteed.")],
  [{ topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Exclusive fear of Allah is one qualification among several for mosque custodianship, not the whole topic" }],
  "Overlap with god-consciousness. Custodianship is defined by creed and practice rather than wealth or tribal prestige, directly preparing the ranking argument of 9:19."
));
candidates.candidates.push(makeCand("cand-0414",
  "Rank of deeds: providing pilgrim water and maintaining the Sacred Mosque are not equal to belief and striving; believers who emigrated and strove with wealth and lives hold greater rank",
  "In 9:19-22, supplying water to pilgrims and maintaining al-Masjid al-Haram are declared unequal in Allah's sight to believing in Allah and the Last Day and striving in His cause; those who believed, emigrated and strove with their wealth and lives are greater in rank and are the attainers, given tidings of mercy, approval and gardens of enduring pleasure.",
  [ev(19,"AjaAAaltum siqayata alhajji waAAimarata almasjidi alharami kaman amana ... wajahada fee sabeeli Allahi: the rhetorical question sets ritual-prestige services against faith and striving. La yastawoona AAinda Allahi settles the comparison by divine standard."),
   ev(20,"Amanoo wahajaroo wajahadoo ... biamwalihim waanfusihim aAAthamu darajatan AAinda Allahi: the triad of belief, emigration and striving with both property and persons defines the higher rank; humu alfaizoona names them the successful."),
   ev(21,"Birahmatin minhu waridwanin wajannatin ... naAAeemun muqeemun: three rewards, mercy, approval and lasting delight."),
   ev(22,"Khalideena feeha abadan inna Allaha AAindahu ajrun AAatheemun: permanence doubled by khalideena and abadan, with a great reward held with Allah.")],
  [{ topicId: "the-hereafter", layer: "curated", relationship: "related-not-identical", note: "The reward description serves a ranking argument about present deeds rather than describing the Hereafter as such" }],
  "Overlap with the-hereafter. The passage dismantles a prestige economy built on sanctuary service by subordinating it to faith and costly commitment."
));
candidates.candidates.push(makeCand("cand-0415",
  "Loyalty over kinship: fathers and brothers who prefer disbelief are not to be taken as allies, and family, wealth, commerce and dwellings must not be dearer than Allah, His Messenger and striving",
  "In 9:23-24, believers are forbidden to take fathers or brothers as allies when they prefer disbelief over belief, and are warned that if fathers, sons, brothers, wives, clan, acquired wealth, feared-declining commerce and pleasing dwellings are dearer than Allah, His Messenger and striving in His cause, they should await Allah's command.",
  [ev(23,"La tattakhithoo abaakum waikhwanakum awliyaa ini istahabboo alkufra AAala aleemani: the prohibition is conditional on the relatives' preference of kufr, not on kinship itself; waman yatawallahum minkum faolaika humu alththalimoona marks violation as wrongdoing."),
   ev(24,"Eight enumerated attachments (fathers, sons, brothers, wives, clan, wealth, commerce, dwellings) are weighed against three loyalties (Allah, Messenger, jihad); fatarabbasoo hatta yatiya Allahu biamrihi issues a waiting-threat rather than an immediate penalty; the fasiqeen refrain closes it.")],
  [{ topicId: "parents-and-family", layer: "curated", relationship: "related-not-identical", note: "The verse limits family allegiance under a specific condition rather than teaching family duties generally" }],
  "Overlap with parents-and-family. The eight-item inventory covers the full range of ordinary human attachments including economic ones (commerce whose decline is feared), making this a comprehensive loyalty-ordering test rather than a narrow family rule."
));
candidates.candidates.push(makeCand("cand-0416",
  "Hunayn lesson and sanctuary exclusion: numbers availed nothing until divine tranquillity and unseen forces arrived; polytheists are barred from the Sacred Mosque with economic loss answered by divine enrichment",
  "In 9:25-28, victory is recalled at many places and at Hunayn where great numbers pleased the believers but availed nothing and the earth narrowed despite its vastness; then Allah sent down His tranquillity upon the Messenger and believers and unseen forces; afterwards repentance is accepted for whom He wills, and the polytheists are declared najas and barred from the Sacred Mosque after that year, with fear of poverty answered by promised enrichment from His bounty.",
  [ev(25,"Ith aAAjabatkum kathratukum falam tughni AAankum shayan: self-admiration at numerical strength is named as the failure point; wadaqat AAalaykumu alardu bima rahubat describes spatial constriction despite vastness; thumma wallaytum mudbireena records the flight."),
   ev(26,"Thumma anzala Allahu sakeenatahu AAala rasoolihi waAAala almumineena waanzala junoodan lam tarawha: reversal comes through sent-down tranquillity and unseen forces, not recovered numbers."),
   ev(27,"Thumma yatoobu Allahu min baAAdi thalika AAala man yashao: even after defeat of the enemy, repentance remains open by divine will."),
   ev(28,"Innama almushrikoona najasun fala yaqraboo almasjida alharama baAAda AAamihim hatha: the exclusion is dated from that year; wain khiftum AAaylatan fasawfa yughneekumu Allahu min fadlihi in shaa answers the concrete economic fear with a conditional promise.")],
  [{ topicId: "trust-in-god", layer: "curated", relationship: "related-not-identical", note: "Reliance is demonstrated through a battle narrative and an economic reassurance rather than taught abstractly" }],
  "Overlap with trust-in-god. Deferred to scholarly review: whether najas here denotes ritual impurity or moral filth, and the precise scope of the Haram exclusion — the verse states the ruling without defining its terms."
));

// P2 candidates cand-0417..0426
candidates.candidates.push(makeCand("cand-0417",
  "Sonship claims as oral imitation: Jewish assertion about Uzayr and Christian assertion about the Messiah are spoken fabrications imitating earlier disbelievers, met with divine curse and delusion diagnosis",
  "In 9:30, the Jews say Uzayr is Allah's son and the Christians say the Messiah is Allah's son; these are statements from their mouths imitating the saying of those who disbelieved before them; may Allah destroy them, how they are turned away.",
  [ev(30,"Thalika qawluhum biafwahihim: restricts the claims to oral utterance without scriptural basis. Yudhioona qawla allatheena kafaroo min qablu frames both claims as derivative imitation rather than independent theology. Qatalahumu Allahu anna yufakoona pairs a curse formula with a rhetorical question diagnosing delusion.")],
  [{ topicId: "tawheed", layer: "curated", relationship: "related-not-identical", note: "The refutation serves tawheed by denying progeny attribution, but focuses on the mechanism (oral imitation) rather than theological argument" }],
  "Overlap with tawheed. The parallel structure treats two distinct community claims identically, suggesting the critique targets the pattern of attributing sons to Allah rather than the specific figures."
));
candidates.candidates.push(makeCand("cand-0418",
  "Scholarly lordship usurpation: rabbis and monks taken as lords besides Allah while the command was to worship one God alone, followed by divine exaltation above what they associate",
  "In 9:31, they took their scholars and monks as lords besides Allah and the Messiah son of Mary, though they were commanded only to worship one God; there is no deity except Him; He is exalted above what they associate.",
  [ev(31,"Ittakhathoo ahbarahum waruhbanahum arbaban min dooni Allahi: ittakhathoo implies active adoption of human authorities into a lordship role. Wama omiroo illa liyaAAbudoo ilahan wahidan contrasts the adopted practice with the original singular command. La ilaha illa huwa subhanahu AAamma yushrikoona closes with tawheed declaration and transcendence.")],
  [{ topicId: "tawheed", layer: "curated", relationship: "same-concept", note: "Direct articulation of shirk through elevating religious authorities to lordship status" }],
  "Overlap with tawheed. The verse identifies the mechanism of shirk not as idol-worship but as granting legislative or devotional authority to scholars and monks that belongs to Allah alone."
));
candidates.candidates.push(makeCand("cand-0419",
  "Light-extinguishing attempt and divine perfection: they want to extinguish Allah's light with their mouths but Allah refuses except to perfect His light even if disbelievers dislike it; Messenger sent with guidance and true religion to manifest over all religion",
  "In 9:32-33, disbelievers try to extinguish Allah's light orally but Allah insists on perfecting it despite their aversion; He sent His Messenger with guidance and the religion of truth to make it prevail over all religion despite polytheist aversion.",
  [ev(32,"Yureedoona an yutfioo noora Allahi biafwahihim: metaphor of oral extinguishing shows futility. Wayaba Allahu illa an yutimma noorahu walaw kariha alkafiroona: divine refusal guarantees completion regardless of opposition."),
   ev(33,"Huwa allathee arsala rasoolahu bialhuda wadeeni alhaqqi liyuthhirahu AAala alddeeni kullihi: universal manifestation claim for the religion of truth; walaw kariha almushrikoona repeats the aversion refrain from 9:32 creating structural parallelism.")],
  [],
  "Gap candidate. No verified topic covers the light metaphor or the universal manifestation claim. The doubled 'walaw kariha' refrain across both verses creates a literary insistence on divine inevitability despite human resistance."
));
candidates.candidates.push(makeCand("cand-0420",
  "Clerical wealth-devouring and hoarding condemnation: many scholars and monks consume people's wealth unjustly and bar the way; gold and silver hoarders who do not spend in Allah's way face branding punishment on the Day heated in Hellfire",
  "In 9:34-35, many ahbar and ruhban eat people's wealth falsely and obstruct Allah's way; those who hoard gold and silver without spending in Allah's cause receive tidings of painful punishment; on the Day the metal is heated in Jahannam fire their foreheads, flanks and backs are branded with 'this is what you hoarded for yourselves'.",
  [ev(34,"Inna katheeran mina alahbari waalrruhbani layakuloona amwala alnnasi bialbatili: quantifier katheeran avoids blanket condemnation. Wayasuddoona AAan sabeeli Allahi links economic exploitation to spiritual obstruction. Waallatheena yaknizoona alththahaba waalfiddata wala yunfiqoonaha fee sabeeli Allahi defines hoarding as non-spending in the divine cause specifically."),
   ev(35,"Yawma yuhma AAalayha fee nari jahannama fatukwa biha jibahuhum wajunoobuhum wathuhooruhum: three body surfaces branded. Hath ma kanaztum lianfusikum fathooqoo ma kuntum taknizoona: the punishment uses the hoarded material itself as the instrument, and the taunt echoes their own accumulation.")],
  [{ topicId: "giving", layer: "curated", relationship: "related-not-identical", note: "Condemnation of hoarding is the negative mirror of the giving obligation, targeting wealth withheld from Allah's cause" },
   { topicId: "justice", layer: "curated", relationship: "related-not-identical", note: "Consuming wealth bi-al-batil is framed as injustice against people" }],
  "Overlap with giving and justice. The clerical critique and the hoarding critique share the same passage because both involve wealth misappropriation blocking access to Allah's way."
));
candidates.candidates.push(makeCand("cand-0421",
  "Sacred calendar sovereignty: twelve months ordained since creation day, four sacred, constituting the correct religion; self-wronging prohibition during them; collective fighting reciprocity; nasi postponement condemned as kufr increase that manipulates lawful-unlawful boundaries",
  "In 9:36-37, the number of months with Allah is twelve since the day He created heavens and earth, four of them sacred, which is the upright religion; believers must not wrong themselves during them and must fight polytheists collectively; the postponement (nasi) is declared an increase in disbelief by which disbelievers alternate lawful and unlawful to match Allah's prohibited count, their evil deeds made pleasing to them.",
  [ev(36,"Inna AAiddata alshshuhoori AAinda Allahi ithna AAashara shahran fee kitabi Allahi yawma khalaqa alssamawati waalarda: calendar grounded in creation act and divine register. Minha arbaAAatun hurumun specifies four sacred. Thalika alddeenu alqayyimu equates calendar observance with correct religion. Fala tathlimoo feehinna anfusakum prohibits self-harm during sacred months."),
   ev(37,"Innama alnnaseeo ziyadatun fee alkufri: postponement defined as additive disbelief. Yuhilloonahu AAaman wayuharrimoonahu AAaman liyuwatioo AAiddata ma harrama Allahu fayuhilloo ma harrama Allahu describes the manipulation mechanism precisely. Zuyyina lahum sooo aAAmalihim diagnoses aesthetic deception.")],
  [{ topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Self-wronging prohibition during sacred months requires heightened awareness of divine temporal boundaries" }],
  "Overlap with god-consciousness. Nasi represents institutionalized calendar manipulation to evade sacred constraints, treated as epistemological corruption (ziyada fi al-kufr) not mere administrative error."
));
candidates.candidates.push(makeCand("cand-0422",
  "Mobilization heaviness and Hijrah reassurance: believers criticized for clinging to earth when called to go forth, preferring worldly life whose enjoyment is little compared to Hereafter; threat of replacement by another people; Hijrah cave narrative where Allah sent tranquillity and unseen forces making disbelievers' word lowest and Allah's highest",
  "In 9:38-40, believers are rebuked for heaviness toward earth when told to mobilize, having preferred dunya over akhira whose enjoyment is little; refusal brings painful punishment and replacement; then the Prophet's expulsion is recalled: second of two in the cave telling his companion not to grieve for Allah is with us, Allah sent down sakina and supported him with unseen soldiers, making the disbelievers' word lowest and Allah's word highest.",
  [ev(38,"Iththaqaltum ila alardi: physical metaphor for spiritual reluctance. Aradeetum bialhayati alddunya mina alakhirati identifies preference as root cause. Fama mataAAu alhayati alddunya fee alakhirati illa qaleelun relativizes worldly enjoyment."),
   ev(39,"Illa tanfiroo yuAAaththibkum AAathaban aleeman wayastabdil qawman ghayrakum: dual consequence, punishment and replacement showing dispensability of reluctant community. Wala tadurroohu shayan affirms divine independence."),
   ev(40,"Thaniya ithnayni ith huma fee alghari: historical anchor in the cave. La tahzan inna Allaha maAAana: direct prophetic speech providing reassurance. Faanzala Allahu sakeenatahu AAalayhi waayyadahu bijunoodin lam tarawha: divine intervention via tranquillity and invisible forces. WajaAAala kalimata allatheena kafaroo alssufla wakalimatu Allahi hiya alAAulya: cosmic word-ranking establishing permanent hierarchy.")],
  [{ topicId: "trust-in-god", layer: "curated", relationship: "same-concept", note: "La tahzan inna Allaha ma'ana is a paradigmatic trust-in-God statement in extremis" },
   { topicId: "hardship-and-ease", layer: "curated", relationship: "related-not-identical", note: "The cave scene represents ultimate hardship resolved by divine ease" }],
  "Overlap with trust-in-god and hardship-and-ease. The Hijrah narrative functions as proof-text for the mobilization command: if Allah preserved His Messenger at maximum vulnerability, the community has no grounds for reluctance."
));
candidates.candidates.push(makeCand("cand-0423",
  "Hypocrite mobilization psychology: conditional loyalty based on proximity of gain, false oaths of willingness, excuse-seeking rooted in doubt-hearts, divine prevention of their departure, fitna-seeking behavior, trial-avoidance pretext masking actual fall into trial, emotional volatility between distress at good and joy at disaster, and tawakkul response affirming divine decree",
  "In 9:42-52, hypocrites would follow only for easy near gain but the journey seemed far so they swear falsely; only those doubting Allah and Last Day seek excuses while believers do not; Allah disliked their going and held them back; they would add confusion seeking fitna; they ask permission claiming trial-fear but have already fallen into trial; good news distresses them while disaster makes them rejoice claiming prior precaution; the response affirms nothing strikes except by Allah's decree and believers should rely on Him; both sides await outcomes but believers await one of two goods while awaiting punishment for hypocrites.",
  [ev(42,"Law kana AAaradan qareeban wasafaran qasidan laittabaAAooka walakin baAAudat AAalayhimu alshshuqqatu: cost-benefit analysis revealing transactional faith. Wasayahlifoona biAllahi lawi istataAAna lakharajna maAAakum: preemptive oath-swearing identified as characteristic behavior."),
   ev(44,"La yastathinuka allatheena yuminoona biAllahi waalyawmi alakhiri: negative criterion, true believers simply do not ask permission to avoid striving."),
   ev(45,"Wairtabat quloobuhum fahum fee raybihim yataraddadoona: doubt-heart oscillation as diagnostic marker."),
   ev(49,"Ala fee alfitnati saqatoo: ironic reversal, the trial they sought to avoid is the one they entered by staying."),
   ev(50,"In tusibka hasanatun tasuhum wain tusibka museebatun yaqooloo qad akhathna amrana min qablu: emotional asymmetry proving internal hostility. Wayatawallaw wahum farihoona: visible gloating."),
   ev(51,"Qul lan yuseebana illa ma kataba Allahu lana huwa mawlana waAAala Allahi falyatawakkali almuminoona: qadar-affirmation as antidote to emotional volatility; mawlana-tawakkul pairing.")],
  [{ topicId: "trust-in-god", layer: "curated", relationship: "same-concept", note: "Verse 9:51 directly commands tawakkul as the believer's response to hypocrite psychological warfare" }],
  "Overlap with trust-in-god. This extended passage provides the most detailed behavioral profile of hypocrisy in the Quran, covering seven distinct symptoms from cost-benefit faith to emotional inversion."
));
candidates.candidates.push(makeCand("cand-0424",
  "Expenditure rejection and wealth-as-punishment: spending from hypocrites never accepted whether willing or unwilling because they disbelieve, pray lazily and spend reluctantly; their wealth and children are not impressive but intended as worldly punishment until souls depart in disbelief; they swear belonging out of fear and would flee to any refuge",
  "In 9:53-57, neither willing nor unwilling spending is accepted from them because they are fasiqeen who disbelieve in Allah and His Messenger, come to prayer lazy and spend reluctantly; believers should not be impressed by their wealth or children which serve only as instruments of worldly punishment until death in disbelief; they swear membership out of fear and would flee to any shelter if found.",
  [ev(53,"Qul anfiqoo tawAAan aw karhan lan yutaqabbala minkum innakum kuntum qawman fasiqeena: binary rejection covering both modes of giving. Innakum kuntum qawman fasiqeena assigns collective character label."),
   ev(54,"Wama manaAAahum an tuqbala minhum nafaqatuhum illa annahum kafaroo biAllahi wabirasoolihi: disbelief as root cause. Wala yatoona alssalata illa wahum kusala wala yunfiqoona illa wahum karihoona: two behavioral proofs, lazy prayer and reluctant spending."),
   ev(55,"Fala tuAAjibka amwaluhum wala awladuhum: prohibition against admiration. Innama yureedu Allahu liyuAAaththibahum biha fee alhayati alddunya: reframe of apparent blessing as punishment instrument. Watazhaqa anfusuhum wahum kafiroona: death-state specification."),
   ev(56,"Wayahlifoona biAllahi innahum laminkum wama hum minkum walakinnahum qawmun yafraqoona: fear-driven false belonging."),
   ev(57,"Law yajidoona maljaan aw magharatin aw muddakhalan lawallaw ilayhi wahum yajmahoona: desperate flight imagery confirming absence of genuine commitment.")],
  [],
  "Gap candidate. The concept of wealth and children functioning as divine punishment instruments rather than blessings has no exact match in verified topics. This inverts ordinary assumptions about prosperity."
));
candidates.candidates.push(makeCand("cand-0425",
  "Zakah distribution framework: eight recipient categories ordained as a divine obligation, with Allah Knowing and Wise",
  "In 9:60, zakah expenditures are restricted to the poor, needy, those employed to collect it, those whose hearts are to be reconciled, freeing captives, debtors, Allah's cause, and the stranded traveler — an obligation from Allah who is Knowing and Wise.",
  [ev(60,"Innama alssadaqatu lilfuqarai waalmasakeeni waalAAamileena AAalayha waalmuallafati quloobuhum wafee alrriqabi waalgharimeena wafee sabeeli Allahi waibni alssabeeli: exhaustive eight-category enumeration introduced by innama (only). Fareedatan mina Allahi designates it as divine ordinance not prophetic discretion. WaAllahu AAaleemun hakeemun grounds the allocation in divine knowledge and wisdom.")],
  [{ topicId: "giving", layer: "curated", relationship: "same-concept", note: "Definitive Quranic legislation on obligatory charity distribution" }],
  "Overlap with giving. The innama restriction makes this an exclusive list. Mu'allafah quloobuhum introduces a socio-political category absent from voluntary sadaqah discussions. Gharimeen addresses systemic debt relief. Ibn al-sabeel covers displacement. Deferred to scholarly review: whether fi sabeeli Allah here means military expenditure specifically or any righteous cause."
));
candidates.candidates.push(makeCand("cand-0426",
  "Mockery exposure and post-belief disbelief verdict: hypocrites fear revelation exposing their hearts; when confronted they claim mere conversation and play; challenged whether they mock Allah, His verses and Messenger; told no excuse remains as disbelief occurred after professed belief; pardon for one faction, punishment for criminal faction",
  "In 9:64-66, hypocrites fear a surah revealing their hearts and are told to mock freely for Allah will expose what they dread; when questioned they claim idle conversation and play, and are challenged whether they mocked Allah, His verses and His Messenger; told not to excuse themselves for they disbelieved after belief; if one group is pardoned another will be punished because they were criminals.",
  [ev(64,"Yahtharu almunafiqoona an tunazzala AAalayhim sooratun tunabbiohum bima fee quloobihim: revelation feared as diagnostic tool. Quli istahzioo inna Allaha mukhrijun ma tahtharoona: permission to mock paired with guarantee of exposure."),
   ev(65,"Innama kunna nakhoodu wanalAAabu: minimization defense framing religious mockery as social banter. Qul abiAllahi waayatihi warasoolihi kuntum tastahzioona: triple-object challenge elevating the target from social to sacred."),
   ev(66,"La taAAtathiroo qad kafartum baAAda eemanikum: verdict pronounced without further hearing. In naAAfu AAan taifatin minkum nuAAaththib taifatan biannahum kanoo mujrimeena: split outcome showing both mercy and justice operating within the same community.")],
  [],
  "Gap candidate. No verified topic covers the epistemological function of revelation as heart-exposing diagnostic, nor the specific legal status of mockery directed at Allah and His verses. The pardon-punishment split within one community is deferred to scholarly review regarding criteria for faction assignment."
));

// P3 candidates cand-0427..0436
candidates.candidates.push(makeCand("cand-0427",
  "Inverted moral architecture: hypocrite men and women reinforce each other in enjoining wrong and forbidding right while closing their hands, forgotten by Allah as they forgot Him; contrasted with believing men and women allied in enjoining right, forbidding wrong, establishing prayer, giving zakah and obeying Allah and His Messenger",
  "In 9:67 and 9:71, the hypocrite community is described as structurally unified in inverted morality (enjoining munkar, forbidding maruf, withholding spending) resulting in reciprocal divine forgetting; the believer community mirrors this structure with correct moral orientation producing divine mercy.",
  [ev(67,"Almunafiqoona waalmunafiqatu baAAduhum min baAAdin yamuroona bialmunkari wayanhawna AAani almaAAroofi wayaqbidoona aydiyahum nasoo Allaha fanasiyahum: six-part description showing communal reinforcement of inversion. Nasoo-fanasiyahum reciprocity establishes theological consequence."),
   ev(71,"Waalmuminoona waalmuminatu baAAduhum awliyao baAAdin yamuroona bialmaAAroofi wayanhawna AAani almunkari wayuqeemoona alssalata wayutoona alzzakata wayuteeAAoona Allaha warasoolahu: seven-part mirror with correct polarity. Olaika sayarhamuhumu Allahu replaces the forgetting curse with promised mercy.")],
  [{ topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Forgetting Allah and being forgotten is the ultimate failure of God-consciousness; remembering through obedience produces mercy" }],
  "Overlap with god-consciousness. The structural parallelism between 9:67 and 9:71 demonstrates that community formation follows moral orientation: inverted values produce inverted solidarity. Closed hands (yaqbidoona aydiyahum) symbolizes economic withdrawal from communal obligation."
));
candidates.candidates.push(makeCand("cand-0428",
  "Historical precedent chain: predecessors stronger in power and richer enjoyed their portion then engaged in vanities like those before them; news of destroyed nations (Nuh, Aad, Thamud, Ibrahim's people, Madyan, overturned towns) confirms messengers brought clear proofs and self-wronging caused destruction",
  "In 9:69-70, contemporary disbelievers are compared to predecessors who were stronger and wealthier yet perished after enjoying their portion and engaging in vanities; the catalog of destroyed peoples confirms messengers came with clear proofs and destruction resulted from self-inflicted wrong, not divine injustice.",
  [ev(69,"Kanoo ashadda minkum quwwatan waakthara amwalan waawladan faistamtaAAoo bikhalaqihim: four comparisons (strength, wealth, children, enjoyment) all exceeded yet availed nothing. Wakhudtum kaallathee khadoo: direct behavioral parallel making historical warning personally applicable."),
   ev(70,"Qawmi noohin waAAadin wathamooda waqawmi ibraheema waashabi madyana waalmutafikati: six named precedents spanning different eras and geographies. Atathum rusuluhum bialbayyinati: universal messenger-proof pattern. Fama kana Allahu liyathlimahum walakin kanoo anfusahum yathlimoona: explicit exoneration of divine justice placing blame entirely on self-wronging.")],
  [{ topicId: "the-hereafter", layer: "curated", relationship: "related-not-identical", note: "Worldly destruction serves as precursor warning for eschatological accountability" }],
  "Overlap with the-hereafter. The six-nation catalog functions as empirical evidence against the assumption that material superiority guarantees survival. Self-wronging (anfusahum yathlimoona) recurs as the mechanism of destruction across all cases."
));
candidates.candidates.push(makeCand("cand-0429",
  "Prophetic harshness command and false-oath exposure: Prophet commanded to strive against disbelievers and hypocrites with harshness; hypocrites swear they said nothing while having spoken the word of disbelief after professing Islam, resenting only the enrichment Allah gave them; repentance offered but turning away brings punishment with no earthly protector",
  "In 9:73-74, the Prophet receives a dual command to strive against kuffar and munafiqeen with harshness; the following verse exposes hypocrites who swear they did not speak while having uttered disbelief-words after Islam, harboring resentment only because Allah enriched them, with repentance available but rejection bringing worldly-otherworldly punishment.",
  [ev(73,"Ya ayyuha alnnabiyyu jahidi alkuffara waalmunafiqeena waoghluth AAalayhim: unique combined address targeting both external and internal enemies simultaneously. Waoghluth demands harshness breaking diplomatic norms. Wamawahum jahannamu wabisa almaseeru: shared destination despite different categories."),
   ev(74,"Yahlifoona biAllahi ma qaloo walaqad qaloo kalimata alkufri wakafaroo baAAda islamihim: oath-denial immediately contradicted by divine assertion. Wahammoo bima lam yanaloo: unachieved plot suggesting assassination or rebellion. Wama naqamoo illa an aghnahumu Allahu warasooluhu min fadlihi: resentment rooted in divine favor rather than grievance.")],
  [],
  "Gap candidate. No verified topic covers the combined jihad against kuffar and munafiqeen or the psychology of resenting divine enrichment. The transition from external warfare to internal community discipline marks a structural shift in the surah."
));
candidates.candidates.push(makeCand("cand-0430",
  "Broken covenant producing permanent nifaq: those who covenanted with Allah that if given bounty they would spend and be righteous became stingy upon receiving it and turned away; penalized with hypocrisy implanted in hearts until Judgment Day for breaking promise and habitual lying",
  "In 9:75-77, individuals made conditional covenants promising charity and righteousness if enriched by Allah's bounty; upon receiving it they became stingy and turned away refusing; Allah penalized them by implanting nifaq in their hearts permanently until meeting Him, because they broke their promise and habitually lied.",
  [ev(75,"Waminhum man AAahada Allaha lain atana min fadlihi lanassaddaqanna walanakoonanna mina alssaliheena: conditional vow using emphatic future forms (lanassaddaqanna, walanakoonanna) expressing strong commitment."),
   ev(76,"Falamma atahum min fadlihi bakhiloo bihi watawallaw wahum muAAridoona: immediate reversal upon fulfillment of condition. Bakhiloo (stinginess) contrasts lanassaddaqanna (we will surely give charity). MuAAridoona (turning away) contrasts saliheena (righteous)."),
   ev(77,"FaaAAqabahum nifaqan fee quloobihim ila yawmi yalqawnahu: penalty is nifaq itself, not merely punishment for it. Ila yawmi yalqawnahu suggests permanence until death/judgment. Bima akhlafoo Allaha ma waAAadoohu wabima kanoo yakthiboona: two causes, broken promise and habitual lying.")],
  [{ topicId: "repentance", layer: "curated", relationship: "related-not-identical", note: "Demonstrates the consequence of failed repentance-vows, where transactional faith produces permanent spiritual damage" }],
  "Overlap with repentance. This passage reveals transactional faith as spiritually destructive: treating divine bounty as a trigger for conditional promises rather than unconditional gratitude produces nifaq as organic consequence, not arbitrary punishment."
));
candidates.candidates.push(makeCand("cand-0431",
  "Intercession limit and contributor-mockery: seventy-times forgiveness seeking cannot benefit those who disbelieve in Allah and His Messenger; those who criticize voluntary contributors and effort-only givers face divine ridicule reciprocation and painful punishment",
  "In 9:79-80, those who mock believers contributing voluntarily to charity and those who find nothing except their effort are warned that Allah ridicules them and they face painful punishment; asking forgiveness for them seventy times will never result in Allah forgiving them because they disbelieved in Allah and His Messenger.",
  [ev(79,"Allatheena yalmizoona almuttawwiAAeena mina almumineena fee alssadaqati waallatheena la yajidoona illa juhdahum: two victim categories, willing givers and effort-only givers. Fayaskharoona minhum sakhira Allahu minhum: ridicule reciprocated by divine ridicule creating perfect symmetry. Walahum AAathabun aleemun: punishment beyond ridicule."),
   ev(80,"Istaghfir lahum aw la tastaghfir lahum in tastaghfir lahum sabAAeena marratan falan yaghfira Allahu lahum: quantitative limit (seventy) establishing intercession boundary. Thalika biannahum kafaroo biAllahi warasoolihi: root cause identified as disbelief not insufficient intercession. WaAllahu la yahdee alqawma alfasiqeena: guidance withheld from defiant disobedience.")],
  [{ topicId: "mercy-and-forgiveness", layer: "curated", relationship: "related-not-identical", note: "Establishes a boundary condition where forgiveness-seeking becomes ineffective due to rooted disbelief" },
   { topicId: "giving", layer: "curated", relationship: "related-not-identical", note: "Protects voluntary charity from public criticism and mockery" }],
  "Overlap with mercy-and-forgiveness and giving. The seventy-times figure may reference hyperbole or specific cultural practice; either way it establishes that quantity of intercession cannot overcome quality of disbelief. Mockery of effort-only givers targets the most vulnerable contributors."
));
candidates.candidates.push(makeCand("cand-0432",
  "Expedition abandonment consequences: remaining behind rejoicing in sitting produces permanent exclusion from future campaigns; funeral prayer prohibition and grave-standing ban for deceased hypocrites; wealth and children reframed as worldly punishment instruments rather than blessings",
  "In 9:81-85, those who remained behind rejoiced in their sitting and disliked striving with wealth and lives in heat are told Hell-fire is hotter; commanded to laugh little and weep much as recompense; upon return told they will never go out again or fight enemies, ordered to sit with remainders; forbidden to pray over their dead or stand at graves; reminded wealth and children are intended as punishment until death in disbelief.",
  [ev(81,"Fariha almukhallafoona bimaqAAadihim khilafa rasooli Allahi: joy in absence defined as opposition to the Messenger. Wakarihoo an yujahidoo ... waqaloo la tanfiroo fee alharri: heat-avoidance as stated motive. Qul naru jahannama ashaddu harran law kanoo yafqahoona: proportional counter-argument requiring understanding."),
   ev(82,"Falyadhakoo qaleelan walyabkoo katheeran jazaan bima kanoo yaksiboona: eschatological emotional reversal framed as earned recompense."),
   ev(83,"Lan takhrujoo maAAiya abadan walan tuqatiloo maAAiya AAaduwwan: double-abada (never) establishing permanent exclusion. Innakum radeetum bialquAAoodi awwala marratin faoqAAudoo maAAa alkhalifeena: first-choice satisfaction determines permanent status."),
   ev(84,"Wala tusalli AAala ahadin minhum mata abadan wala taqum AAala qabrihi: funeral rites prohibition creating visible communal boundary. Innahum kafaroo biAllahi warasoolihi wamatoo wahum fasiqoona: three-fold indictment justifying exclusion."),
   ev(85,"Wala tuAAjibka amwaluhum waawladuhum innama yureedu Allahu an yuAAaththibahum biha fee alddunya: repeated from 9:55 reinforcing the inversion theme. Watazhaqa anfusuhum wahum kafiroona: death-state specification.")],
  [{ topicId: "the-hereafter", layer: "curated", relationship: "related-not-identical", note: "Eschatological reversal (laugh-weep) and permanent exclusion demonstrate Hereafter consequences manifesting in worldly communal discipline" }],
  "Overlap with the-hereafter. The funeral prayer prohibition represents one of the strongest communal boundary mechanisms in the Quran, transforming invisible hypocrisy into visible social exclusion. Permanent expedition ban converts temporal choice into lasting identity."
));
candidates.candidates.push(makeCand("cand-0433",
  "Bedouin sincerity spectrum: some consider spending as loss awaiting misfortune while others believe in Allah and Last Day treating spending as nearness and seeking prophetic invocation; Bedouins generally stronger in kufr and nifaq less likely to know revealed limits",
  "In 9:97-99, Bedouins are assessed as stronger in disbelief and hypocrisy and less likely to know revealed limits; among them some treat spending as maghram (loss/fine) and await misfortunes for believers while others believe in Allah and Last Day considering spending as qurbat (nearness) seeking the Messenger's prayers which become genuine nearness for them.",
  [ev(97,"AlaAArabu ashaddu kufran wanifaqan waajdaru alla yaAAlamoo hudooda ma anzala Allahu AAala rasoolihi: comparative assessment (ashadd, ajdar) avoiding absolute condemnation. Hudood (limits/boundaries) refers to legal-moral parameters of revelation."),
   ev(98,"Wamina alaAArabi man yattakhithu ma yunfiqu maghraman: spending conceptualized as financial loss. Wayatarabbasu bikumu alddawaira: awaiting cyclical misfortune. AAalayhim dairatu alssawi: evil cycle redirected upon them. WaAllahu sameeAAun AAaleemun: divine awareness of hidden intentions."),
   ev(99,"Wamina alaAArabi man yuminu biAllahi waalyawmi alakhiri: sincere minority exists within same ethnic group. Wayattakhithu ma yunfiqu qurubatin AAinda Allahi wasalawati alrrasooli: spending reconceptualized as nearness plus prophetic blessing. Ala innaha qurbatun lahum: divine confirmation of their intention. Sayudkhiluhumu Allahu fee rahmatihi: mercy-admission promised.")],
  [{ topicId: "giving", layer: "curated", relationship: "related-not-identical", note: "Contrasts two orientations toward the same act of spending based on underlying faith" }],
  "Overlap with giving. The passage avoids ethnic essentialism by distinguishing sincere from insincere within the same Bedouin population. Maghram vs qurbat represents fundamentally different economic theologies. Prophetic salah functioning as sought-after blessing demonstrates intercessory practice."
));
candidates.candidates.push(makeCand("cand-0434",
  "Tearful volunteers and wealthy evaders: those who came seeking mounts finding none returned with eyes overflowing tears from grief at inability to spend; blame falls only on rich excuse-seekers satisfied with remaining behind whose hearts Allah sealed",
  "In 9:92-93, those who came requesting transport and were told nothing was available turned away with eyes overflowing tears from grief at inability to contribute; the path of blame is only upon those who ask permission while being wealthy, satisfied to remain with those who stay behind, whose hearts Allah sealed so they do not know.",
  [ev(92,"Wala AAala allatheena itha ma atawka litahmilahum qulta la ajidu ma ahmilukum AAalayhi tawallaw waaAAyunuhum tafeedu mina alddamAAi hazanan alla yajidoo ma yunfiqoona: physical-emotional description of sincere inability. Tafeedu (overflow) indicates uncontrollable weeping. Hazanan specifies grief-motivation not anger."),
   ev(93,"Innama alssabeelu AAala allatheena yastathinoonaka wahum aghniyao: blame restricted to wealthy excuse-seekers. Radoo bian yakoonoo maAAa alkhawalifi: satisfaction with staying defines their choice. WatibaAAa Allahu AAala quloobihim fahum la yaAAlamoona: divine sealing as consequence of chosen preference producing cognitive incapacity.")],
  [{ topicId: "hardship-and-ease", layer: "curated", relationship: "related-not-identical", note: "Emotional hardship of unable volunteers contrasted with ease-preference of wealthy evaders" }],
  "Overlap with hardship-and-ease. The tearful volunteers provide an emotional authenticity criterion that distinguishes genuine inability from comfortable evasion. Heart-sealing (taba'a) appears as consequence rather than precondition of their choice."
));
candidates.candidates.push(makeCand("cand-0435",
  "Return-excuse rejection and divine observation: returning hypocrites make excuses but are told never to excuse for Allah has already informed of their news; Allah and Messenger will observe their deeds; returned to Knower of unseen and witnessed who will inform them of what they did; they swear to be left alone but are rijs destined for Jahannam",
  "In 9:94-96, upon return hypocrites offer excuses but are told not to bother for Allah has already informed of their affairs; Allah and Messenger will observe their actions; they will be returned to the Knower of unseen and witnessed who will report their deeds; they swear oaths to be left alone but are declared filth with Hell as refuge; their attempts to satisfy believers fail because Allah is not satisfied with fasiqeen.",
  [ev(94,"YaAAtathiroona ilaykum itha rajaAAtum ilayhim qul la taAAtathiroo lan numina lakum: preemptive rejection of excuse-making. Qad nabbaana Allahu min akhbarikum: divine intelligence preceding human explanation. Wasayara Allahu AAamalukum warasooluhu: dual observation system. Thumma turaddoona ila AAalimi alghaybi waalshshahadati fayunabbiokum bima kuntum taAAmaloona: eschatological reporting guaranteed."),
   ev(95,"Sayahlifoona biAllahi lakum itha inqalabtum ilayhim lituAAridoo AAanhum faaAAridoo AAanhum: commanded avoidance matching their request. Innahum rijsun: ontological designation as impurity. Wamawahum jahannamu jazaan bima kanoo yaksiboona: earned destination."),
   ev(96,"Yahlifoona lakum litardaw AAanhum fain tardaw AAanhum fainna Allaha la yarda AAani alqawmi alfasiqeena: human satisfaction cannot substitute for divine displeasure. Establishes independence of divine judgment from communal acceptance.")],
  [],
  "Gap candidate. The tripartite observation system (Allah, Messenger, believers seeing deeds followed by eschatological reporting by Knower of unseen/witnessed) has no single verified topic match. The rijs designation parallels 9:28 najas creating thematic bookends."
));
candidates.candidates.push(makeCand("cand-0436",
  "Reciprocal divine forgetting and heart-sealing: those who forgot Allah are forgotten by Him in return; those satisfied with remaining behind have their hearts sealed preventing comprehension; laughing little and weeping much as earned eschatological reversal",
  "In 9:67 and 9:82-87, the hypocrite condition is diagnosed through reciprocal forgetting (they forgot Allah so He forgot them) and heart-sealing (those satisfied with sitting had hearts sealed so they do not understand); the eschatological consequence reverses their worldly comfort into little laughter and much weeping as earned recompense.",
  [ev(67,"Nasoo Allaha fanasiyahum inna almunafiqeena humu alfasiqoona: symmetrical verb pairing (nasoo-fanasiyahum) shows divine response mirrors human action. Humu alfasiqoona assigns definitive categorization."),
   ev(82,"Falyadhakoo qaleelan walyabkoo katheeran jazaan bima kanoo yaksiboona: imperative reversal of their worldly behavior. Jazaan frames it as earned consequence not arbitrary punishment."),
   ev(87,"Radoo bian yakoonoo maAAa alkhawalifi watubiAAa AAala quloobihim fahum la yaAAlamoona: satisfaction (radoo) precedes sealing (tubi'a) establishing volitional basis. La yaAAlamoona describes resulting cognitive state.")],
  [{ topicId: "god-consciousness", layer: "curated", relationship: "related-not-identical", note: "Forgetting Allah represents the ultimate failure of God-consciousness; heart-sealing is its permanent consequence" }],
  "Overlap with god-consciousness. The causal sequence (forgetting → forgotten; satisfaction → sealing → non-comprehension) demonstrates that spiritual states have progressive consequences. Reciprocal forgetting differs from punitive punishment: it is relational withdrawal mirroring the human initiative."
));

// P4 candidates cand-0437..0446
candidates.candidates.push(makeCand("cand-0437",
  "Bedouin sincerity spectrum and forerunner reward: Bedouins range from treating spending as loss awaiting misfortune to believing and seeking nearness through prophetic invocation; forerunners among Muhajireen and Ansar and their ihsan-followers attain mutual divine pleasure and eternal gardens",
  "In 9:97-100, Bedouins are assessed as stronger in disbelief and hypocrisy yet containing sincere believers who treat spending as nearness; then the forerunners (sabiqoon awwaloon) among Muhajireen and Ansar and those who followed them with excellence receive Allah's pleasure and their pleasure in Him, with prepared gardens of eternal rivers as the great attainment.",
  [ev(97,"AlaAArabu ashaddu kufran wanifaqan waajdaru alla yaAAlamoo hudooda ma anzala Allahu AAala rasoolihi: comparative assessment avoiding absolute condemnation while noting knowledge deficit."),
   ev(98,"Wamina alaAArabi man yattakhithu ma yunfiqu maghraman wayatarabbasu bikumu alddawaira: spending conceptualized as financial loss; awaiting cyclical misfortune for believers."),
   ev(99,"Wamina alaAArabi man yuminu biAllahi waalyawmi alakhiri wayattakhithu ma yunfiqu qurubatin AAinda Allahi wasalawati alrrasooli ala innaha qurbatun lahum sayudkhiluhumu Allahu fee rahmatihi: sincere minority reconceptualizes spending as nearness; divine confirmation and mercy-admission promised."),
   ev(100,"Waalssabiqoona alawwaloona mina almuhajireena waalansari waallatheena ittabaAAoohum biihsanin radiya Allahu AAanhum waradoo AAanhu waaAAadda lahum jannatin tajree tahtaha alanharu khalideena feeha abadan thalika alfawzu alAAatheemu: three-tier vanguard (Muhajireen, Ansar, ihsan-followers); mutual pleasure formula (radiya-waradoo); double-eternity emphasis; fawz azim designation.")],
  [{ topicId: "giving", layer: "curated", relationship: "related-not-identical", note: "Contrasts two orientations toward spending based on underlying faith" }],
  "Overlap with giving. Maghram vs qurbat represents fundamentally different economic theologies within the same ethnic group. The forerunner verse establishes historical precedence as salvific category. Deferred to scholarly review: precise identity boundaries of sabiqoon awwaloon."
));
candidates.candidates.push(makeCand("cand-0438",
  "Graded repentance pathways: entrenched hypocrites unknown to Prophet but known to Allah punished twice; confessors of mixed deeds may receive divine turning; deferred cases await Allah's command; sadaqah taken purifies and grows with prophetic invocation providing reassurance; Allah alone accepts tawbah and receives charities",
  "In 9:101-106, three categories of post-expedition individuals emerge: hardened hypocrites around Madinah unknown to the Prophet but known to Allah facing double punishment then great punishment; others who confessed sins having mixed righteous and bad deeds hoping for Allah's turning; and deferred cases left to Allah's command whether to punish or forgive. Between these, the sadaqah mechanism is prescribed: take from their wealth charity that purifies and causes growth, invoke blessings upon them for prophetic salah provides reassurance, knowing Allah alone accepts repentance and receives charities as al-Tawwab al-Raheem.",
  [ev(101,"Wamimman hawlakum mina alaAArabi munafiqoona wamin ahli almadeenati maradoo AAala alnnifaqi la taAAlamuhum nahnu naAAlamuhum sanuAAaththibuhum marratayni thumma yuraddoona ila AAathabin AAatheemin: epistemological gap between prophetic and divine knowledge; double punishment then ultimate punishment; maradoo indicates habituation."),
   ev(102,"Waakharoona iAAtarafoo bithunoobihim khalatoo AAamalan salihan waakhara sayyian AAasa Allahu an yatooba AAalayhim: confession plus mixed-deed acknowledgment opens possibility of divine turning; AAasa expresses hope not guarantee."),
   ev(103,"Khuth min amwalihim sadaqatan tutahhiruhum watuzakkeehim biha wasalli AAalayhim inna salataka sakanun lahum: four-fold mechanism: taking, purifying, growing, invoking. Salah-sakan link establishes prophetic blessing as psychological reassurance."),
   ev(104,"Alam yaAAlamoo anna Allaha huwa yaqbalu alttawbata AAan AAibadihi wayakhuthu alssadaqati waanna Allaha huwa alttawwabu alrraheemu: rhetorical question affirming exclusive divine acceptance of both repentance and charity."),
   ev(105,"Waquli iAAmaloo fasayara Allahu AAamalukum warasooluhu waalmuminoona wasaturaddoona ila AAalimi alghaybi waalshshahadati fayunabbiokum bima kuntum taAAmaloona: work-command with threefold observation then eschatological reporting."),
   ev(106,"Waakharoona murjawna liamri Allahi imma yuAAaththibuhum waimma yatoobu AAalayhim: suspension state neither condemned nor absolved; entirely dependent on divine command.")],
  [{ topicId: "repentance", layer: "curated", relationship: "same-concept", note: "Comprehensive treatment of graded repentance pathways including confession, purification, and deferred judgment" }],
  "Overlap with repentance. The three-case gradient (hardened, confessing, deferred) structures the entire passage. Sadaqah functions simultaneously as legal obligation and spiritual medicine. Prophetic salah as sakan bridges institutional and personal dimensions. Deferred to scholarly review: identification of the three deferred individuals and the specific double punishment referenced."
));
candidates.candidates.push(makeCand("cand-0439",
  "Masjid dirar exposure versus taqwa-founded mosque: building erected for harm, disbelief, division and ambush-station exposed despite false good-intention oaths; commanded never to stand in it; contrasted with mosque founded on taqwa from first day whose men love purification; foundation parable of secure taqwa versus collapsing bank edge falling into Jahannam; doubt remains until hearts stop",
  "In 9:107-110, those who built a mosque for harm, disbelief, dividing believers and as station for one who warred against Allah and Messenger are exposed; they swear they intended only good but Allah testifies they are liars; the Prophet is forbidden to ever stand in it; a mosque founded on taqwa from the first day is declared worthier, containing men who love purification whom Allah loves; a parable contrasts one founding on taqwa and ridwan with one founding on crumbling bank edge collapsing into Hellfire; the dirar building remains doubt in their hearts until hearts are torn apart.",
  [ev(107,"Waallatheena ittakhathoo masjidan diraran wakufran watafreeqan bayna almumineena wairsadan liman haraba Allaha warasoolahu min qablu: four purposes enumerated: harm, disbelief, division, ambush-station. Walayahlifunna in aradna illa alhusna waAllahu yashhadu innahum lakathiboona: oath of good intention directly contradicted by divine testimony."),
   ev(108,"La taqum feehi abadan lamasjidun ossisa AAala alttaqwa min awwali yawmin ahaqqu an taqooma feehi feehi rijalun yuhibboona an yatatahharoo waAllahu yuhibbu almuttahhireena: permanent prohibition; taqwa-foundation criterion; purification-loving men; divine love for the purified."),
   ev(109,"Afaman assasa bunyanahu AAala taqwa mina Allahi waridwanin khayrun am man assasa bunyanahu AAala shafa jurufin harin fainhara bihi fee nari jahannama: architectural parable contrasting stable divine foundation with unstable natural edge; collapse into fire."),
   ev(110,"La yazalu bunyanuhumu allathee banaw reebatan fee quloobihim illa an taqattaAAa quloobuhum: persistent psychological effect of the building; doubt lodged permanently until cardiac death.")],
  [],
  "Gap candidate. No verified topic covers religious architecture assessed by founding intent, nor the concept of buildings producing lasting psychological doubt. Deferred to scholarly review: specific historical referents of the masjid dirar and the taqwa-founded mosque — the text names neither."
));
candidates.candidates.push(makeCand("cand-0440",
  "Divine purchase covenant: Allah bought believers' selves and wealth in exchange for Paradise; they fight kill and are killed; binding promise confirmed across Torah Injeel and Quran; none fulfills covenant better than Allah; commanded to rejoice in the transaction as the great attainment",
  "In 9:111, Allah has purchased from the believers their lives and properties in exchange for Paradise; they fight in His cause killing and being killed; this is a binding promise upon Him in the Torah, Gospel and Quran; no one fulfills covenant better than Allah; believers are commanded to rejoice in the transaction they contracted, which is the great attainment.",
  [ev(111,"Inna Allaha ishtara mina almumineena anfusahum waamwalahum bianna lahumu aljannata yuqatiloona fee sabeeli Allahi fayaqtuloona wayuqtaloona waAAdan AAalayhi haqqan fee alttawrati waalinjeeli waalqurani waman awfa biAAahdihi mina Allahi faistabshiroo bibayAAikumu allathee bayaAAtum bihi wathalika huwa alfawzu alAAatheemu: commercial metaphor (ishtara-bayAAikumu) applied to ultimate sacrifice; triple-scripture attestation; superlative covenant-fulfillment claim; rejoicing commanded; fawz azim closure.")],
  [{ topicId: "trust-in-god", layer: "curated", relationship: "related-not-identical", note: "The covenant framework demands absolute trust in Allah's promise-keeping capacity" }],
  "Overlap with trust-in-god. The purchase metaphor transforms military sacrifice from loss into profitable transaction. Triple-scripture attestation grounds the covenant in continuous revelation history rather than single-source claim. Rejoicing-command reframes martyrdom anxiety as celebration."
));
candidates.candidates.push(makeCand("cand-0441",
  "Nine attributes of covenant believers: repentant, worshipping, praising, journeying, bowing, prostrating, enjoining right, forbidding wrong, guarding Allah's limits — given glad tidings",
  "In 9:112, the participants in the divine purchase covenant are characterized by nine active participles: the repentant, worshippers, praisers, travelers/journeyers, those who bow, those who prostrate, those who enjoin right, those who forbid wrong, and those who guard Allah's limits; the Prophet is commanded to give glad tidings to the believers.",
  [ev(112,"Alttaiboona alAAabidoona alhamidoona alssaihoona alrrakiAAoona alssajidoona alamiroona bialmaAAroofi waalnnahoona AAani almunkari waalhafithoona lihudoodi Allahi wabashshiri almumineena: nine plural active participles forming comprehensive believer portrait spanning internal states (tawbah, worship, praise), physical devotion (bowing, prostrating, journeying), social ethics (enjoining, forbidding), and legal observance (guarding limits). Wabashshiri almumineena imperative closing.")],
  [{ topicId: "good-character", layer: "curated", relationship: "related-not-identical", note: "Comprehensive character portrait combining devotional, ethical and legal dimensions" },
   { topicId: "repentance", layer: "curated", relationship: "related-not-identical", note: "Tawbah leads the attribute list as foundational quality" }],
  "Overlap with good-character and repentance. Saihoon is debated among scholars (travelers for knowledge, fasting persons, or ascetics) — deferred to scholarly review. The list moves from individual spiritual states through ritual practice to communal responsibility ending with boundary-guarding, creating a complete progression from inner to outer."
));
candidates.candidates.push(makeCand("cand-0442",
  "Istighfar prohibition for polytheists and Ibrahim precedent: Prophet and believers barred from seeking forgiveness for polytheists even relatives once Hellfire status is clear; Ibrahim's istighfar for his father was only due to a prior promise; when enmity to Allah became apparent he disassociated; Ibrahim described as compassionate and forbearing",
  "In 9:113-114, it is not for the Prophet or believers to seek forgiveness for polytheists even if relatives after it becomes clear they are companions of Hellfire; Ibrahim's istighfar for his father was only because of a promise he made to him; when it became clear his father was an enemy to Allah he disassociated himself; Ibrahim is described as awwah (compassionate/supplicating) and haleem (forbearing/patient).",
  [ev(113,"Ma kana lilnnabiyyi waallatheena amanoo an yastaghfiroo lilmushrikeena walaw kanoo olee qurba min baAAdi ma tabayyana lahum annahum ashabu aljaheemi: negation formula (ma kana) establishing impossibility not mere prohibition; even kinship cannot override; clarity condition (tabayyana) prevents premature judgment."),
   ev(114,"Wama kana istighfaru ibraheema liabeehi illa AAan mawAAidatin waAAadaha iyyahu falamma tabayyana lahu annahu AAaduwwun lillahi tabarraa minhu inna ibraheema laawwahun haleemun: exception explained as promise-bound not approval-based; same tabayyana verb links to 9:113; tabarraa (disassociation) echoes surah-opening bara'ah theme; awwah-haleem pairing preserves Ibrahim's tenderness while confirming his obedience.")],
  [{ topicId: "prophets", layer: "curated", relationship: "related-not-identical", note: "Ibrahim's precedent governs contemporary intercession boundaries" }],
  "Overlap with prophets. The tabarraa-tabayyana pairing shows disassociation triggered by clarity not hostility. Awwah-haleem prevents the ruling from appearing cold: Ibrahim's compassion was real but subordinate to divine alignment. This creates thematic bookend with surah's opening bara'ah."
));
candidates.candidates.push(makeCand("cand-0443",
  "Guidance clarification principle and absolute dominion: Allah does not misguide a people after guiding them until He clarifies what they should avoid; Allah possesses dominion of heavens and earth, gives life and causes death, and no protector or helper exists besides Him",
  "In 9:115-116, a theological principle is established that Allah would not let a people stray after guidance until He makes clear what they must guard against, for He knows all things; then absolute divine dominion is declared over heavens and earth with power over life and death, leaving no protector or helper besides Allah.",
  [ev(115,"Wama kana Allahu liyudilla qawman baAAda ith hadahum hatta yubayyina lahum ma yattaqoona inna Allaha bikulli shayin AAaleemun: negative capability formula (ma kana ... liyudilla) protecting divine justice; hatta yubayyina establishes clarification as prerequisite for accountability; bikulli shayin AAaleemun grounds the principle in comprehensive knowledge."),
   ev(116,"Inna Allaha lahu mulku alssamawati waalardi yuhyee wayumeetu wama lakum min dooni Allahi min waliyyin wala naseerin: mulk (dominion) + ihya-imata (life-death) + nafi wali-naseer (negation of protectors) = comprehensive sovereignty declaration closing any space for alternative reliance.")],
  [{ topicId: "knowledge-and-reflection", layer: "curated", relationship: "related-not-identical", note: "Clarification before accountability requires knowledge transmission" }],
  "Overlap with knowledge-and-reflection. The guidance-clarification principle protects divine justice: misguidance cannot be attributed to Allah when clarification preceded deviation. Positioned after Ibrahim precedent showing that prophetic knowledge triggers disassociation obligations."
));
candidates.candidates.push(makeCand("cand-0444",
  "Hour-of-difficulty forgiveness and the three left behind: Allah turned in forgiveness to the Prophet, Muhajireen and Ansar who followed him in the hour of difficulty after hearts nearly swerved; also forgave three left behind whose earth narrowed despite vastness and souls confined until certain no refuge from Allah except in Him, then He turned so they could repent",
  "In 9:117-118, Allah's forgiveness extends to the Prophet and the emigrant-helper community who accompanied him during extreme hardship after some hearts almost deviated; then specifically to three individuals left behind who experienced such intense constriction that earth felt narrow despite its vastness and their own souls pressed upon them until they realized there is no refuge from Allah except toward Him, at which point He turned to them so they could repent.",
  [ev(117,"Laqad taba Allahu AAala alnnabiyyi waalmuhajireena waalansari allatheena ittabaAAoohu fee saAAati alAAusrati min baAAdi ma kada yazeeghu quloobu fareeqin minhum thumma taba AAalayhim innahu bihim raoofun raheemun: laqad taba emphasizes accomplished forgiveness; saAAati alAAusrati names the crisis without specifying it; kada yazeeghu acknowledges near-deviation without condemning; raoof-raheem pairing closes with tenderness."),
   ev(118,"WaAAala alththalathati allatheena khullifoo hatta itha daqat AAalayhimu alardu bima rahubat wadaqat AAalayhim anfusuhum wathannoo an la maljaa mina Allahi illa ilayhi thumma taba AAalayhim liyatooboo inna Allaha huwa alttawwabu alrraheemu: khullifoo indicates deliberate leaving-behind; dual constriction (earth + self); certainty of no refuge except in Allah produces the turning point; liyatooboo shows divine forgiveness enables human repentance not vice versa; alttawwab alrraheem as closing divine names.")],
  [{ topicId: "mercy-and-forgiveness", layer: "curated", relationship: "same-concept", note: "Paradigmatic demonstration of divine forgiveness encompassing both communal near-deviation and individual abandonment" },
   { topicId: "hardship-and-ease", layer: "curated", relationship: "same-concept", note: "Earth-narrowing and soul-constriction represent maximum hardship resolved by divine turning" }],
  "Overlap with mercy-and-forgiveness and hardship-and-ease. The three-left-behind narrative provides the most detailed phenomenology of repentance-psychology in the Quran: external pressure (earth narrowing) plus internal pressure (soul confining) plus cognitive breakthrough (no refuge except in Him) produces the condition for divine turning. Liyatooboo reverses expected causality: Allah turns first enabling their repentance."
));
candidates.candidates.push(makeCand("cand-0445",
  "Truthfulness companionship and comprehensive deed-registration: believers commanded to fear Allah and be with the truthful; Madinah people and surrounding Bedouins must not remain behind the Messenger or prefer themselves over him; every thirst, fatigue, hunger, ground-treading that enrages disbelievers, enemy-infliction, and expenditure small or large registered as righteous deed; Allah does not waste muhsineen reward",
  "In 9:119-121, after the repentance narratives, believers are commanded to maintain taqwa and keep company with the truthful; the community around Madinah is told not to stay behind the Messenger or value themselves above him; then an exhaustive registration system is described where every hardship endured and expenditure made in Allah's cause is recorded as righteous deed, for Allah does not allow the reward of those who do good to be lost.",
  [ev(119,"Ya ayyuha allatheena amanoo ittaqoo Allaha wakoonoo maAAa alssadiqeena: dual command pairing taqwa with truthful companionship; maAAa implies sustained proximity not mere agreement."),
   ev(120,"Ma kana liahli almadeenati waman hawlahum mina alaAArabi an yatakhallafoo AAan rasooli Allahi wala yarghaboo bianfusihim AAan nafsihi: negative framing (ma kana) establishing behavioral impossibility for true community. Thalika biannahum la yuseebuhum thamaon wala nasabun wala makhmasatun fee sabeeli Allahi wala yataoona mawtian yagheethu alkuffara wala yanaloona min AAaduwwin naylan illa kutiba lahum bihi AAamalun salihun: six hardship types each individually registered. Illa kutiba lahum bihi AAamalun salihun universalizes the registration mechanism."),
   ev(121,"Wala yunfiqoona nafaqatan sagheeratan wala kabeeratan wala yaqtaAAoona wadiyan illa kutiba lahum liyajziyahumu Allahu ahsana ma kanoo yaAAmaloona: extends registration to financial contributions and terrain crossings. Liyajziyahumu Allahu ahsana ma kanoo yaAAmaloona promises optimal reward matching.")],
  [{ topicId: "good-character", layer: "curated", relationship: "related-not-identical", note: "Truthfulness companionship as character-forming environment" }],
  "Overlap with good-character. The registration system removes any anxiety about unnoticed sacrifice: every micro-hardship achieves cosmic significance through divine record-keeping. Truthfulness-companionship command follows repentance narratives suggesting that truthfulness is both the lesson learned and the ongoing requirement."
));
candidates.candidates.push(makeCand("cand-0446",
  "Knowledge-mobilization balance and divergent revelation effects: believers need not mobilize entirely; a group from each division must remain for deep religious understanding to warn returning people; adjacent disbelievers fought with visible harshness; each revealed surah increases believers in faith with rejoicing while adding filth to diseased hearts who die disbelieving; annual trials unmet by repentance or remembrance; hypocrites glance for observers then slip away with hearts turned; Messenger from among yourselves grieved by your suffering concerned for you kind merciful to believers; closing tawakkul confession",
  "In 9:122-129, the surah transitions from total mobilization to balanced knowledge preservation: a group from each division stays for tafaqqah fi al-din to warn their people on return; adjacent disbelievers are to be fought with visible harshness; the effect of revelation is shown to bifurcate communities: believers gain faith and rejoice while diseased hearts gain filth upon filth dying in disbelief; hypocrites face annual trials without repentance, glancing for observers before slipping away with divinely-turned hearts; the surah closes with the Prophet's characterization as one from among them for whom their suffering is grievous, concerned over them, kind and merciful to believers; final verse teaches the tawakkul confession when they turn away.",
  [ev(122,"Wama kana almuminoona liyanfiroo kaffatan falawla nafara min kulli firqatin minhum taifatun liyatafaqqahoo fee alddeeni waliyunthiroo qawmahum itha rajaAAoo ilayhim laAAallahum yahtharoona: kaffatan negation prevents total militarization; tafaqqah establishes scholarly class function; warning-return cycle creates sustainable knowledge infrastructure."),
   ev(123,"Qatiloo allatheena yaloonakum mina alkuffari walyajidoo feekum ghilthatan: proximity-based engagement priority; ghiltha demands visible deterrence."),
   ev(124,"Faamma allatheena amanoo fazadathum eemanan wahum yastabshiroona: revelation as faith-amplifier for healthy hearts."),
   ev(125,"Waamma allatheena fee quloobihim maradun fazadathum rijsan ila rijsihim wamatoo wahum kafiroona: revelation as filth-amplifier for diseased hearts; death-state specification."),
   ev(126,"Awala yarawna annahum yuftanoona fee kulli AAamin marratan aw marratayni thumma la yatooboona wala hum yaththakkaroona: annual trial frequency met with zero response."),
   ev(127,"Nathara baAAduhum ila baAAdin hal yarakum min ahadin thumma insarafoo sarafa Allahu quloobahum biannahum qawmun la yafqahoona: surveillance behavior exposing cowardice; heart-turning as consequence of non-understanding."),
   ev(128,"Laqad jaakum rasoolun min anfusikum AAazeezun AAalayhi ma AAanittum hareesun AAalaykum bialmumineena raoofun raheemun: shared origin (min anfusikum); grief at community suffering; eagerness for their welfare; kindness-mercy pairing directed specifically at believers."),
   ev(129,"Fain tawallaw faqul hasbiya Allahu la ilaha illa huwa AAalayhi tawakkaltu wahuwa rabbu alAAarshi alAAatheemi: conditional turning-away triggers tawakkul confession; hasbiya-la ilaha-tawakkaltu-rabbu al-arsh four-part formula establishing complete reliance; Great Throne reference as cosmic authority anchor.")],
  [{ topicId: "knowledge-and-reflection", layer: "curated", relationship: "same-concept", note: "Tafaqqah fi al-din establishes institutional knowledge preservation as communal obligation equal to mobilization" },
   { topicId: "trust-in-god", layer: "curated", relationship: "same-concept", note: "Closing hasbiya Allah tawakkaltu formula is paradigmatic trust-in-God declaration" }],
  "Overlap with knowledge-and-reflection and trust-in-god. Tafaqqah-fi-al-din verse prevents jihad from consuming the community's intellectual infrastructure. Revelation bifurcation (faith-increase vs filth-increase) demonstrates that the same text produces opposite effects based on heart-condition. Closing Messenger portrait humanizes prophetic authority through shared origin and emotional investment. Final tawakkul confession provides the individual believer's response when communal efforts fail."
));

writeFileSync(path.join(OUT_DIR, "candidates", "candidates-033.json"), JSON.stringify(candidates, null, 2) + "\n");
console.log("Wrote candidates-033.json");
console.log(`Generated ${candidates.candidates.length} candidates (cand-0407..cand-0446)`);
console.log("Done.");