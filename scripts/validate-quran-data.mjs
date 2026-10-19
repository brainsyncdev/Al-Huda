#!/usr/bin/env node
// PRD §13 / FR-070 — validate the pinned Quran dataset.
//
// Structural scan of node_modules/quran-json/dist/chapters/en, run against the
// package exactly as installed (the pin in package.json is the version under
// test). Checks PRD data-validation gates 1, 2, 7:
//   1. expected surahs and ayat exist under the package's numbering,
//   2. duplicates, missing, reordered, and malformed records are reported,
//   7. regression check: total ayat must equal 6236 (Hafs standard count).
//
// Exits 1 on any issue, so CI can gate a re-pin on it. Does not modify data.
//
// Usage: node scripts/validate-quran-data.mjs [--json]

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const chapterDir = path.join(
  root,
  "node_modules",
  "quran-json",
  "dist",
  "chapters",
  "en"
);

const EXPECTED_SURAHS = 114;
const EXPECTED_TOTAL_AYAT = 6236;

const issues = [];

function fail(message) {
  issues.push(message);
}

if (!existsSync(path.join(chapterDir, "index.json"))) {
  console.error(
    `Dataset not found at ${chapterDir} — install dependencies first (the pin in package.json decides what is validated).`
  );
  process.exit(2);
}

function readJson(file) {
  try {
    return JSON.parse(readFileSync(file, "utf-8"));
  } catch (error) {
    fail(`${file}: not valid JSON (${error.message})`);
    return null;
  }
}

const index = readJson(path.join(chapterDir, "index.json"));

if (!Array.isArray(index)) {
  console.error("index.json is not an array");
  process.exit(1);
}

if (index.length !== EXPECTED_SURAHS) {
  fail(`index.json declares ${index.length} surahs, expected ${EXPECTED_SURAHS}`);
}

// --- Index level: duplicates, ordering, field shape -------------------------
const seenIds = new Set();
const seenSlugs = new Set();

index.forEach((entry, position) => {
  const where = `index.json[${position}]`;
  if (typeof entry !== "object" || entry === null) {
    fail(`${where}: not an object`);
    return;
  }
  for (const field of ["id", "name", "transliteration", "translation", "type", "total_verses"]) {
    if (entry[field] === undefined || entry[field] === "") {
      fail(`${where}: missing field "${field}"`);
    }
  }
  if (entry.id !== position + 1) {
    fail(`${where}: id ${entry.id} out of canonical order (expected ${position + 1})`);
  }
  if (seenIds.has(entry.id)) fail(`${where}: duplicate surah id ${entry.id}`);
  seenIds.add(entry.id);

  const slug = String(entry.transliteration ?? "")
    .toLowerCase()
    .replace(/[''`]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (seenSlugs.has(slug)) fail(`${where}: duplicate slug "${slug}"`);
  seenSlugs.add(slug);

  if (!["meccan", "medinan"].includes(entry.type)) {
    fail(`${where}: unexpected revelation type "${entry.type}"`);
  }
});

// --- Chapter level: verse counts, sequence, duplicates, empties -------------
let totalAyat = 0;

for (const entry of index) {
  if (typeof entry?.id !== "number") continue;
  const file = path.join(chapterDir, `${entry.id}.json`);
  if (!existsSync(file)) {
    fail(`surah ${entry.id}: file ${file}.json missing`);
    continue;
  }
  const chapter = readJson(file);
  if (!chapter || !Array.isArray(chapter.verses)) {
    fail(`surah ${entry.id}: verses is not an array`);
    continue;
  }

  if (chapter.verses.length !== entry.total_verses) {
    fail(
      `surah ${entry.id}: declares ${entry.total_verses} ayat but file contains ${chapter.verses.length}`
    );
  }

  const seenVerseIds = new Set();
  chapter.verses.forEach((verse, position) => {
    const where = `surah ${entry.id} verse[${position}]`;
    if (typeof verse?.id !== "number") {
      fail(`${where}: missing or non-numeric id`);
      return;
    }
    if (verse.id !== position + 1) {
      fail(`${where}: id ${verse.id} out of order (expected ${position + 1})`);
    }
    if (seenVerseIds.has(verse.id)) fail(`${where}: duplicate verse id ${verse.id}`);
    seenVerseIds.add(verse.id);

    if (typeof verse.text !== "string" || verse.text.length === 0) {
      fail(`${where}: empty Arabic text`);
    }
    if (typeof verse.translation !== "string" || verse.translation.length === 0) {
      fail(`${where}: empty translation`);
    }
  });

  totalAyat += chapter.verses.length;
}

if (totalAyat !== EXPECTED_TOTAL_AYAT) {
  fail(`total ayat ${totalAyat}, expected ${EXPECTED_TOTAL_AYAT}`);
}

// --- Report -----------------------------------------------------------------
const report = {
  chapterDir,
  surahs: index.length,
  totalAyat,
  issueCount: issues.length,
  issues,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `quran-json dataset: ${index.length} surahs, ${totalAyat} ayat, ${issues.length} issue(s)`
  );
  for (const issue of issues) console.error(`  ✗ ${issue}`);
}

process.exit(issues.length === 0 ? 0 : 1);
