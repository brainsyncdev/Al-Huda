#!/usr/bin/env node
// Word-by-word dataset generator (FR-009).
//
// Downloads verse-by-verse word segmentation from the Quran.com API (v4), which
// serves the Quranic Universal Library (QUL) word data. The output is vendored
// into this repository as static JSON, because docs/DATA-PROVENANCE.md forbids
// runtime fetching of Quran content: the text a visitor sees must be pinned to
// a release, not to a third party's current database state.
//
// Output layout:
//   public/word-data/{surah}.json   compact per-surah word lists
//   public/word-data/manifest.json  counts + sha256 per file + source pin
//
// Compact per-surah shape:
//   { "1:1": [["بِسْمِ","In (the) name","bis'mi"], ...], ... }
// Each inner array is [arabic, translation, transliteration]. Position is the
// index, so no redundant position field is stored. Ayah-number markers
// (char_type_name === "end") are not words and are dropped.
//
// Usage:
//   node scripts/generate-word-data.js            # all 114 surahs
//   node scripts/generate-word-data.js --only=2   # one surah (probe)
//   node scripts/generate-word-data.js --dry-run  # measure, write nothing

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync, rmSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "word-data");

const API = "https://api.quran.com/api/v4/verses/by_chapter";
const PER_PAGE = 50;
const WORD_FIELDS = "text_uthmani,translation,transliteration";
const SOURCE_PIN = "quran.com API v4 (QUL word data), fetched 2026-10-23";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const onlyArg = args.find((a) => a.startsWith("--only="));
const only = onlyArg ? Number(onlyArg.split("=")[1]) : null;

/** Fetch every verse of one chapter, following pagination. */
async function fetchChapter(surah) {
  const verses = [];
  let page = 1;
  for (;;) {
    const url =
      `${API}/${surah}?words=true&word_fields=${WORD_FIELDS}` +
      `&per_page=${PER_PAGE}&page=${page}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Al-Huda Quran App (https://al-huda.app)",
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`surah ${surah} page ${page}: HTTP ${res.status}`);
    }
    const data = await res.json();
    const batch = data.verses ?? [];
    verses.push(...batch);
    const pagination = data.pagination ?? {};
    if (batch.length === 0 || !pagination.next_page) break;
    page = pagination.next_page;
  }
  return verses;
}

/** Reduce one verse's words to [arabic, translation, transliteration]. */
function compactWords(words) {
  const out = [];
  for (const w of words ?? []) {
    if (w.char_type_name !== "word") continue;
    const arabic = w.text_uthmani ?? w.text ?? "";
    if (!arabic) continue;
    out.push([
      arabic,
      w.translation?.text ?? "",
      w.transliteration?.text ?? "",
    ]);
  }
  return out;
}

function sha256(text) {
  return createHash("sha256").update(text).digest("hex");
}

async function main() {
  const surahs = only ? [only] : Array.from({ length: 114 }, (_, i) => i + 1);

  if (!dryRun && !existsSync(outDir)) mkdirSync(outDir, { recursive: true });

  const manifest = { source: SOURCE_PIN, files: {}, totals: { verses: 0, words: 0 } };
  let bytes = 0;

  for (const surah of surahs) {
    const verses = await fetchChapter(surah);
    const map = {};
    let wordCount = 0;
    for (const v of verses) {
      const words = compactWords(v.words);
      if (words.length === 0) continue;
      // Prefer verse_key ("2:255") — it is canonical and independent of order.
      map[v.verse_key] = words;
      wordCount += words.length;
    }

    const json = JSON.stringify(map);
    const size = Buffer.byteLength(json, "utf8");
    bytes += size;
    manifest.files[`${surah}.json`] = {
      verses: Object.keys(map).length,
      words: wordCount,
      bytes: size,
      sha256: sha256(json),
    };
    manifest.totals.verses += Object.keys(map).length;
    manifest.totals.words += wordCount;

    if (!dryRun) {
      writeFileSync(path.join(outDir, `${surah}.json`), json, "utf8");
    }
    process.stdout.write(
      `surah ${String(surah).padStart(3, " ")}: ${Object.keys(map).length} verses, ${wordCount} words, ${(size / 1024).toFixed(0)} KB\n`
    );
  }

  manifest.totals.bytes = bytes;
  process.stdout.write(
    `\ntotal: ${manifest.totals.verses} verses, ${manifest.totals.words} words, ${(bytes / 1024 / 1024).toFixed(2)} MB\n`
  );

  if (dryRun) {
    process.stdout.write("dry run — nothing written\n");
    return;
  }

  writeFileSync(
    path.join(outDir, "manifest.json"),
    JSON.stringify(manifest, null, 2),
    "utf8"
  );
  process.stdout.write(`wrote ${path.relative(root, outDir)}/manifest.json\n`);
}

main().catch((err) => {
  console.error(err.message ?? err);
  process.exit(1);
});