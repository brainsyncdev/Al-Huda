// MFD-11 passage dump — RESEARCH-ONLY read utility.
//
// Prints (or writes) a VERBATIM view of a verse range from the pinned
// quran-json corpus, so extraction authors read the exact bytes rather than
// recalling text. Never modifies anything.
//
// Usage:
//   node scripts/mfd11-dump-passage.mjs <surah> <fromAyah> <toAyah> [outFile]
//
// If outFile is given (e.g. research/mfd-11/corpus-view/002-0001-0020.json),
// the JSON is written there; otherwise it is printed to stdout.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const [surahArg, fromArg, toArg, outFile] = process.argv.slice(2);
const surah = Number(surahArg);
const from = Number(fromArg);
const to = Number(toArg);

if (!Number.isInteger(surah) || surah < 1 || surah > 114 ||
    !Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to < from) {
  console.error("usage: node scripts/mfd11-dump-passage.mjs <surah 1..114> <fromAyah> <toAyah> [outFile]");
  process.exit(1);
}

const ch = JSON.parse(readFileSync(
  path.join(ROOT, "node_modules", "quran-json", "dist", "chapters", "en", `${surah}.json`),
  "utf8"
));

if (to > ch.verses.length) {
  console.error(`surah ${surah} has ${ch.verses.length} verses; requested to=${to}`);
  process.exit(1);
}

const view = {
  source: "quran-json@3.1.2 — VERBATIM read-only view (do not edit; regenerate with scripts/mfd11-dump-passage.mjs)",
  surah: ch.id,
  name: ch.name,
  transliteration: ch.transliteration,
  translation: ch.translation,
  revelationType: ch.type,
  totalVerses: ch.total_verses,
  range: { fromAyah: from, toAyah: to },
  verses: ch.verses.filter((v) => v.id >= from && v.id <= to),
};

const json = JSON.stringify(view, null, 2) + "\n";
if (outFile) {
  const abs = path.resolve(ROOT, outFile);
  mkdirSync(path.dirname(abs), { recursive: true });
  writeFileSync(abs, json);
  console.log(`wrote ${outFile} (${view.verses.length} verses, verbatim)`);
} else {
  process.stdout.write(json);
}