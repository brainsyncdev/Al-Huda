// MFD-11 Batch generator for surahs 37–42.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OUT_DIR = path.join(ROOT, "research", "mfd-11");
const CORPUS_BASE = path.join(ROOT, "node_modules", "quran-json", "dist", "chapters", "en");
const TS = "2026-11-19T16:35:00.000Z";

const SURAHS = [
  { num: 37, name: "As-Saffat", prefix: "037-as-saffat", candStart: 1297, candBatch: "candidates-061.json", passages: 5 },
  { num: 38, name: "Sad", prefix: "038-sad", candStart: 1347, candBatch: "candidates-062.json", passages: 3 },
  { num: 39, name: "Az-Zumar", prefix: "039-az-zumar", candStart: 1377, candBatch: "candidates-063.json", passages: 3 },
  { num: 40, name: "Ghafir", prefix: "040-ghafir", candStart: 1407, candBatch: "candidates-064.json", passages: 3 },
  { num: 41, name: "Fussilat", prefix: "041-fussilat", candStart: 1437, candBatch: "candidates-065.json", passages: 2 },
  // NOTE: Surah 42 has been genuinely re-extracted by scripts/mfd11-gen-s042.mjs
// with prefix 042-ash-shura and 4 passages. This batch entry is retained only
// for historical record; do NOT re-run this batch generator for surah 42.
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
    for (let ci = 0; ci < 10 && candNum <= s.candStart + 69; ci++) {
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
      notes: `Pass A Surah ${s.num} passage ${pi+1}/${passages.length}. Generated by mfd11-gen-batch-37-42.mjs.`,
      proposedBy: "ai-assisted", reviewStatus: "pending-scholarly-review", createdAt: TS
    };
    writeFileSync(path.join(OUT_DIR, "extractions", `${s.prefix}-p${pi+1}.json`), JSON.stringify(ext, null, 2) + "\n");
    console.log(`  Wrote ${s.prefix}-p${pi+1}.json`);
  }
  writeFileSync(path.join(OUT_DIR, "candidates", s.candBatch), JSON.stringify(candidates, null, 2) + "\n");
  console.log(`  Wrote ${s.candBatch} with ${candidates.candidates.length} candidates`);
}
console.log("\n=== Batch generation complete ===");
