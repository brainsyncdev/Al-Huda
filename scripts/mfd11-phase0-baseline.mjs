// MFD-11 Phase 0 — Corpus inventory + immutability baseline + production snapshot.
//
// RESEARCH-ONLY tooling. Reads the pinned quran-json corpus and the production
// taxonomy files; writes exclusively under research/mfd-11/data/. It never
// modifies the corpus, the production data, or any application code.
//
// Usage:
//   node scripts/mfd11-phase0-baseline.mjs            # generate baseline
//   node scripts/mfd11-phase0-baseline.mjs --verify   # recompute and compare
//
// --verify exits non-zero if ANY verse text, corpus file, or production file
// has drifted from the recorded baseline. This is the immutability guard for
// the whole MFD-11 workstream.

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_DIR = path.join(ROOT, "node_modules", "quran-json", "dist", "chapters", "en");
const OUT_DIR = path.join(ROOT, "research", "mfd-11", "data");
const VERIFY = process.argv.includes("--verify");

const sha256 = (buf) => createHash("sha256").update(buf).digest("hex");
const sha256Text = (s) => sha256(Buffer.from(s, "utf8"));

function fail(msg) {
  console.error("BASELINE FAILURE: " + msg);
  process.exit(1);
}

// ─── Corpus scan ─────────────────────────────────────────────────────────────

function scanCorpus() {
  const pkg = JSON.parse(readFileSync(path.join(ROOT, "node_modules", "quran-json", "package.json"), "utf8"));
  const surahs = [];
  const verseHashes = {};
  const fileHashes = {};
  let totalVerses = 0;

  for (let n = 1; n <= 114; n++) {
    const rel = `node_modules/quran-json/dist/chapters/en/${n}.json`;
    const abs = path.join(ROOT, rel);
    if (!existsSync(abs)) fail(`missing chapter file ${rel}`);
    const bytes = readFileSync(abs);
    fileHashes[rel] = sha256(bytes);
    const ch = JSON.parse(bytes.toString("utf8"));
    if (ch.id !== n) fail(`chapter ${n}: id mismatch (${ch.id})`);
    if (!Array.isArray(ch.verses)) fail(`chapter ${n}: verses not an array`);
    if (ch.verses.length !== ch.total_verses) fail(`chapter ${n}: verse count ${ch.verses.length} != total_verses ${ch.total_verses}`);
    for (let i = 0; i < ch.verses.length; i++) {
      const v = ch.verses[i];
      if (v.id !== i + 1) fail(`chapter ${n}: verse id ${v.id} at position ${i + 1}`);
      if (typeof v.text !== "string" || v.text.length === 0) fail(`chapter ${n}:${v.id}: empty Arabic text`);
      const key = `${n}:${v.id}`;
      if (verseHashes[key]) fail(`duplicate verse key ${key}`);
      // Hash the Arabic text VERBATIM. No normalization, no trimming, no
      // Unicode rewriting — the pinned bytes are the authority.
      verseHashes[key] = sha256Text(v.text);
    }
    totalVerses += ch.verses.length;
    surahs.push({
      number: ch.id,
      name: ch.name,
      transliteration: ch.transliteration,
      translation: ch.translation,
      revelationType: ch.type,
      verseCount: ch.total_verses,
      firstVerseKey: `${n}:1`,
      lastVerseKey: `${n}:${ch.total_verses}`,
    });
  }

  const indexRel = "node_modules/quran-json/dist/chapters/en/index.json";
  const indexAbs = path.join(ROOT, indexRel);
  if (existsSync(indexAbs)) {
    fileHashes[indexRel] = sha256(readFileSync(indexAbs));
    const idx = JSON.parse(readFileSync(indexAbs, "utf8"));
    if (!Array.isArray(idx) || idx.length !== 114) fail("index.json does not list 114 entries");
  }

  if (totalVerses !== 6236) fail(`total verses ${totalVerses} != 6236`);

  return {
    source: {
      package: pkg.name,
      version: pkg.version,
      license: pkg.license,
      corpusDir: "node_modules/quran-json/dist/chapters/en",
      arabicProvenance: "The Noble Qur'an Encyclopedia (quranenc.com), via quran-json; see docs/DATA-PROVENANCE.md",
    },
    totals: { surahs: surahs.length, verses: totalVerses },
    surahs,
    fileHashes,
    verseHashes,
  };
}

// ─── Production snapshot (read-only) ─────────────────────────────────────────

function countBy(arr, fn) {
  const out = {};
  for (const x of arr) {
    const k = fn(x);
    out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

function scanProduction() {
  const files = {};
  const readJson = (rel) => {
    const abs = path.join(ROOT, rel);
    if (!existsSync(abs)) fail(`missing production file ${rel}`);
    const bytes = readFileSync(abs);
    files[rel] = sha256(bytes);
    return JSON.parse(bytes.toString("utf8"));
  };

  const domains = readJson("data/taxonomy/domains.json");
  const dimensions = readJson("data/taxonomy/dimensions.json");
  const topics = readJson("data/taxonomy/topics.json");
  const mappings = readJson("data/taxonomy/topic-ayah-mappings.json");

  const mappingIds = new Set();
  const ayahKeys = new Set();
  let expandedAyat = 0;
  for (const m of mappings) {
    if (mappingIds.has(m.id)) fail(`duplicate mapping id ${m.id}`);
    mappingIds.add(m.id);
    for (let a = m.ayahStart; a <= m.ayahEnd; a++) {
      ayahKeys.add(`${m.surahNumber}:${a}`);
      expandedAyat++;
    }
  }

  // Curated reader-facing layer (hashed for drift detection; not modified).
  const curatedRel = "src/lib/topics/data.ts";
  const curatedBytes = readFileSync(path.join(ROOT, curatedRel));
  files[curatedRel] = sha256(curatedBytes);
  const curatedSlugs = [...curatedBytes.toString("utf8").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);

  const uiDimsRel = "src/lib/explore/dimensions.ts";
  const uiDimsBytes = readFileSync(path.join(ROOT, uiDimsRel));
  files[uiDimsRel] = sha256(uiDimsBytes);
  const uiDimCount = [...uiDimsBytes.toString("utf8").matchAll(/number:\s*\d+,/g)].length;

  // Read-only resolution statistics for the Phase C comparison. These are
  // computed from production data; nothing in production is modified.
  const topicIds = new Set(topics.map((t) => t.id));
  const mappedTopicIds = new Set(mappings.map((m) => m.topicId));
  const unresolvedMappedTopicIds = [...mappedTopicIds]
    .filter((id) => !topicIds.has(id))
    .sort();
  const topicsWithoutMappings = topics
    .filter((t) => !mappedTopicIds.has(t.id))
    .map((t) => t.id)
    .sort();

  return {
    files,
    counts: {
      domains: domains.length,
      dimensions: dimensions.length,
      topics: topics.length,
      mappings: mappings.length,
      uniqueMappingIds: mappingIds.size,
      expandedAyat,
      uniqueAyahKeys: ayahKeys.size,
      uniqueMappedTopicIds: mappedTopicIds.size,
      mappedTopicIdsResolved: mappedTopicIds.size - unresolvedMappedTopicIds.length,
      mappedTopicIdsUnresolved: unresolvedMappedTopicIds.length,
      topicsWithoutMappings: topicsWithoutMappings.length,
      curatedTopics: curatedSlugs.length,
      uiDimensions: uiDimCount,
    },
    unresolvedMappedTopicIds,
    topicsWithoutMappings,
    distributions: {
      mappingType: countBy(mappings, (m) => m.mappingType),
      provenance: countBy(mappings, (m) => m.provenance),
      status: countBy(mappings, (m) => m.status),
      topicProvenance: countBy(topics, (t) => t.provenance),
    },
  };
}

// ─── Generate / verify ───────────────────────────────────────────────────────

function gitHead() {
  try {
    return execSync("git rev-parse HEAD", { cwd: ROOT }).toString().trim();
  } catch {
    return "unknown";
  }
}

const corpus = scanCorpus();
const production = scanProduction();

if (!VERIFY) {
  mkdirSync(OUT_DIR, { recursive: true });
  const generatedAt = new Date().toISOString();
  const head = gitHead();

  writeFileSync(path.join(OUT_DIR, "corpus-inventory.json"), JSON.stringify({
    workstream: "MFD-11",
    generatedAt,
    gitHead: head,
    source: corpus.source,
    totals: corpus.totals,
    surahs: corpus.surahs,
  }, null, 2) + "\n");

  writeFileSync(path.join(OUT_DIR, "corpus-hashes.json"), JSON.stringify({
    workstream: "MFD-11",
    generatedAt,
    gitHead: head,
    algorithm: "sha256",
    encoding: "utf8",
    note: "Hashes cover the Arabic verse text VERBATIM as stored in the pinned corpus. No normalization is applied. Any drift fails --verify.",
    files: corpus.fileHashes,
    verses: corpus.verseHashes,
  }, null, 2) + "\n");

  writeFileSync(path.join(OUT_DIR, "production-baseline.json"), JSON.stringify({
    workstream: "MFD-11",
    generatedAt,
    gitHead: head,
    note: "Read-only snapshot of production taxonomy and curated layer at MFD-11 start. Research must never change these files; --verify proves it.",
    ...production,
  }, null, 2) + "\n");

  console.log("MFD-11 Phase 0 baseline written to research/mfd-11/data/");
  console.log(`  corpus: ${corpus.totals.surahs} surahs, ${corpus.totals.verses} verses`);
  console.log(`  corpus files hashed: ${Object.keys(corpus.fileHashes).length}`);
  console.log(`  verse hashes: ${Object.keys(corpus.verseHashes).length}`);
  console.log("  production counts: " + JSON.stringify(production.counts));
  console.log("  mappingType: " + JSON.stringify(production.distributions.mappingType));
  console.log("  provenance: " + JSON.stringify(production.distributions.provenance));
  console.log("  status: " + JSON.stringify(production.distributions.status));
  console.log("  gitHead: " + head);
} else {
  const drift = [];
  const load = (name) => {
    const p = path.join(OUT_DIR, name);
    if (!existsSync(p)) fail(`baseline file missing: ${name} (run without --verify first)`);
    return JSON.parse(readFileSync(p, "utf8"));
  };
  const storedHashes = load("corpus-hashes.json");
  const storedProd = load("production-baseline.json");
  const storedInv = load("corpus-inventory.json");

  for (const [rel, h] of Object.entries(corpus.fileHashes)) {
    if (storedHashes.files[rel] !== h) drift.push(`corpus file changed: ${rel}`);
  }
  for (const [key, h] of Object.entries(corpus.verseHashes)) {
    if (storedHashes.verses[key] !== h) drift.push(`VERSE TEXT CHANGED: ${key}`);
  }
  for (const key of Object.keys(storedHashes.verses)) {
    if (!(key in corpus.verseHashes)) drift.push(`verse missing from corpus: ${key}`);
  }
  for (const [rel, h] of Object.entries(production.files)) {
    if (storedProd.files[rel] !== h) drift.push(`PRODUCTION FILE CHANGED: ${rel}`);
  }
  if (JSON.stringify(production.counts) !== JSON.stringify(storedProd.counts)) drift.push("production counts changed");
  if (JSON.stringify(production.distributions) !== JSON.stringify(storedProd.distributions)) drift.push("production distributions changed");
  if (storedInv.totals.verses !== corpus.totals.verses) drift.push("corpus verse total changed");

  if (drift.length > 0) {
    console.error(`IMMUTABILITY DRIFT DETECTED (${drift.length} items):`);
    for (const d of drift.slice(0, 40)) console.error("  - " + d);
    process.exit(1);
  }
  console.log("MFD-11 immutability verification PASSED");
  console.log(`  ${Object.keys(corpus.verseHashes).length} verse hashes identical`);
  console.log(`  ${Object.keys(corpus.fileHashes).length} corpus file hashes identical`);
  console.log(`  ${Object.keys(production.files).length} production/curated file hashes identical`);
  console.log("  production counts and distributions identical");
}
