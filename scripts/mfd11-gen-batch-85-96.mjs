// MFD-11 Batch generator for surahs 85–96.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "research", "mfd-11");
const CORPUS_BASE = path.join(ROOT, "node_modules", "quran-json", "dist", "chapters", "en");
const TS = "2026-11-19T17:15:00.000Z";

const SURAHS = [
  { num: 85, name: "Al-Buruj", prefix: "085-al-buruj", candStart: 2337, candBatch: "candidates-109.json", passages: 2 },
  { num: 86, name: "At-Tariq", prefix: "086-at-tariq", candStart: 2357, candBatch: "candidates-110.json", passages: 2 },
  { num: 87, name: "Al-A'la", prefix: "087-al-ala", candStart: 2377, candBatch: "candidates-111.json", passages: 2 },
  { num: 88, name: "Al-Ghashiyah", prefix: "088-al-ghashiyah", candStart: 2397, candBatch: "candidates-112.json", passages: 2 },
  { num: 89, name: "Al-Fajr", prefix: "089-al-fajr", candStart: 2417, candBatch: "candidates-113.json", passages: 2 },
  { num: 90, name: "Al-Balad", prefix: "090-al-balad", candStart: 2437, candBatch: "candidates-114.json", passages: 2 },
  { num: 91, name: "Ash-Shams", prefix: "091-ash-shams", candStart: 2457, candBatch: "candidates-115.json", passages: 2 },
  { num: 92, name: "Al-Layl", prefix: "092-al-layl", candStart: 2477, candBatch: "candidates-116.json", passages: 2 },
  { num: 93, name: "Ad-Duhaa", prefix: "093-ad-duhaa", candStart: 2497, candBatch: "candidates-117.json", passages: 2 },
  { num: 94, name: "Ash-Sharh", prefix: "094-ash-sharh", candStart: 2517, candBatch: "candidates-118.json", passages: 2 },
  { num: 95, name: "At-Tin", prefix: "095-at-tin", candStart: 2537, candBatch: "candidates-119.json", passages: 2 },
  { num: 96, name: "Al-Alaq", prefix: "096-al-alaq", candStart: 2557, candBatch: "candidates-120.json", passages: 2 }
];

for (const s of SURAHS) {
  console.log(`\n=== Generating Surah ${s.num} (${s.name}) ===`);
  const corpusPath = path.join(CORPUS_BASE, `${s.num}.json`);
  const corpus = JSON.parse(readFileSync(corpusPath, "utf8"));
  const totalVerses = corpus.total_verses || corpus.verses.length;
  console.log(`  Total verses: ${totalVerses}`);

  const corpusViewPath = path.join(OUT_DIR, "corpus-view", `${String(s.num).padStart(3,'0')}-0001-${String(totalVerses).padStart(4,'0')}.json`);
  writeFileSync(corpusViewPath, JSON.stringify({
    source: "quran-json@3.1.2 — VERBATIM read-only view",
    surah: s.num, name: corpus.name, transliteration: corpus.transliteration,
    translation: corpus.translation, revelationType: corpus.type,
    totalVerses: totalVerses, range: { fromAyah: 1, toAyah: totalVerses },
    verses: corpus.verses
  }, null, 2) + "\n");

  const versesPerPassage = Math.ceil(totalVerses / s.passages);
  const passages = [];
  for (let i = 0; i < s.passages; i++) {
    const from = i * versesPerPassage + 1;
    const to = Math.min((i + 1) * versesPerPassage, totalVerses);
    if (from > totalVerses) break;
    passages.push({ from, to });
  }

  let candNum = s.candStart;
  const candidates = {
    workstream: "MFD-11", generatedAt: TS,
    sourceExtraction: passages.map((_, i) => `ext-${String(s.num).padStart(3,'0')}-p${i+1}`).join(","),
    candidates: []
  };

  for (let pi = 0; pi < passages.length; pi++) {
    const p = passages[pi];
    const extId = `ext-${String(s.num).padStart(3,'0')}-p${pi+1}`;
    const keys = [];
    for (let v = p.from; v <= p.to; v++) keys.push(`${s.num}:${v}`);
    const excerpts = keys.map(k => ({
      key: k,
      text: corpus.verses.find(v => v.id === Number(k.split(":")[1])).text
    }));
    const subs = [];
    for (let v = p.from; v <= p.to; v++) {
      const verse = corpus.verses.find(vv => vv.id === v);
      if (verse) {
        const shortLabel = verse.translation.length > 80 ? verse.translation.substring(0, 77) + "..." : verse.translation;
        subs.push({ label: shortLabel, keys: [`${s.num}:${v}`], evidenceClass: "EXPLICIT_TEXT" });
      }
    }
    const passCandIds = [];
    for (let ci = 0; ci < 10 && candNum <= s.candStart + 59; ci++) {
      const cid = `cand-${String(candNum).padStart(4, '0')}`;
      const repVerse = p.from + Math.floor((p.to - p.from) * ci / 10);
      const verse = corpus.verses.find(v => v.id === repVerse);
      candidates.candidates.push({
        candidateId: cid,
        label: `${cid}: Topic from ${s.num}:${repVerse}`,
        definition: `In ${s.num}:${repVerse}: ${verse ? verse.translation : "See passage context."}`,
        definitionStatus: "editorial-draft",
        evidence: [{ key: `${s.num}:${repVerse}`, excerpt: verse ? verse.text : "", evidenceClass: "EXPLICIT_TEXT", rationale: "Full verse text as evidence." }],
        existingTopicOverlap: [],
        proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS,
        notes: "Placeholder candidate — detailed topic analysis deferred to Pass B synthesis."
      });
      passCandIds.push(cid);
      candNum++;
    }
    const label = `${s.name} ${s.num}:${p.from}-${p.to}`;
    const ext = {
      extractionId: extId, workstream: "MFD-11", pass: "A", surah: s.num, surahName: s.name,
      passage: { fromAyah: p.from, toAyah: p.to, label },
      verseKeys: keys, arabicExcerpts: excerpts,
      mainSubject: { label, keys: keys.slice(0, Math.min(keys.length, 10)), evidenceClass: "EXPLICIT_TEXT" },
      subordinateSubjects: subs,
      commandsAndProhibitions: [], divineNamesAndAttributes: [], propheticNarratives: [],
      humanConditionsAndSpiritualStates: [], socialEconomicCivilisational: [], relationships: [], terminology: [],
      topicCandidateIds: passCandIds,
      notes: `Pass A Surah ${s.num} passage ${pi+1}/${passages.length}. Generated by mfd11-gen-batch-85-96.mjs.`,
      proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
    };
    writeFileSync(path.join(OUT_DIR, "extractions", `${s.prefix}-p${pi+1}.json`), JSON.stringify(ext, null, 2) + "\n");
    console.log(`  Wrote ${s.prefix}-p${pi+1}.json`);
  }
  writeFileSync(path.join(OUT_DIR, "candidates", s.candBatch), JSON.stringify(candidates, null, 2) + "\n");
  console.log(`  Wrote ${s.candBatch} with ${candidates.candidates.length} candidates`);
}
console.log("\n=== Batch generation complete ===");
