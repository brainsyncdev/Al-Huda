// Parses Tanzil quran-data.xml and generates src/lib/quran/mushaf-data.ts
// with compact boundary tables for: juz, page, hizb/quarter, ruku, manzil, sajda.
//
// Source: https://tanzil.net/res/text/metadata/quran-data.xml
// License: CC-BY (attribute "Tanzil Project" + link to tanzil.net)
//
// We emit BOUNDARIES rather than a per-ayah table: the source is boundary-based,
// a per-ayah expansion is ~665 KB of TypeScript, and ranges are trivially
// resolved with a binary search at runtime. Point markers (sajda) are emitted
// separately because they apply to one ayah, not a range.

const fs = require("fs");
const path = require("path");

const xmlPath = path.join(__dirname, "..", "quran-data.xml");
const outPath = path.join(__dirname, "..", "src", "lib", "quran", "mushaf-data.ts");

const xml = fs.readFileSync(xmlPath, "utf8");

function parseMarkers(tag) {
  const re = new RegExp(
    `<${tag}\\s+index="(\\d+)"\\s+sura="(\\d+)"\\s+aya="(\\d+)"(?:\\s+type="(\\w+)")?\\s*/>`,
    "g"
  );
  const markers = [];
  let m;
  while ((m = re.exec(xml)) !== null) {
    markers.push({ index: +m[1], sura: +m[2], aya: +m[3], type: m[4] || null });
  }
  return markers;
}

const juzs = parseMarkers("juz");
const pages = parseMarkers("page");
const rukus = parseMarkers("ruku");
const quarters = parseMarkers("quarter");
const manzils = parseMarkers("manzil");
const sajdas = parseMarkers("sajda");

// Surah verse counts — needed to convert (surah, ayah) to a global ordinal so
// boundary lists are a single monotonic array to binary-search.
const surahRe = /<sura\s+index="(\d+)"\s+ayas="(\d+)"/g;
const surahCounts = new Array(115).fill(0);
let m;
while ((m = surahRe.exec(xml)) !== null) {
  surahCounts[+m[1]] = +m[2];
}

const TOTAL_SURAH_COUNT = surahCounts.slice(1).reduce((a, b) => a + b, 0);

function toGlobal(sura, aya) {
  let g = 0;
  for (let s = 1; s < sura; s++) g += surahCounts[s];
  return g + aya;
}

/** Sort + validate that a marker list starts at 1:1 and is strictly increasing. */
function boundaryList(markers, label) {
  const sorted = markers
    .map((mk) => ({ index: mk.index, global: toGlobal(mk.sura, mk.aya) }))
    .sort((a, b) => a.global - b.global);

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].global <= sorted[i - 1].global) {
      throw new Error(`${label}: non-increasing boundary at index ${sorted[i].index}`);
    }
  }
  if (sorted[0] && sorted[0].index !== 1) {
    throw new Error(`${label}: first boundary is not index 1`);
  }
  return sorted;
}

const juzBounds = boundaryList(juzs, "juz");
const pageBounds = boundaryList(pages, "page");
const quarterBounds = boundaryList(quarters, "quarter");
const rukuBounds = boundaryList(rukus, "ruku");
const manzilBounds = boundaryList(manzils, "manzil");

// Sajda is a POINT marker: keep the exact verse, do not carry forward.
const sajdaPoints = sajdas
  .map((s) => ({ index: s.index, global: toGlobal(s.sura, s.aya), type: s.type }))
  .sort((a, b) => a.global - b.global);

// --- Verification gates -----------------------------------------------------
const expectations = [
  ["juz", juzBounds.length, 30],
  ["page", pageBounds.length, 604],
  ["quarter", quarterBounds.length, 240],
  ["ruku", rukuBounds.length, 556],
  ["manzil", manzilBounds.length, 7],
  ["sajda", sajdaPoints.length, 15],
  ["total ayat", TOTAL_SURAH_COUNT, 6236],
];
for (const [label, actual, expected] of expectations) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

// A single shared ordinal table lets one binary search serve every field.
// surahStart[i] = sum of verse counts for surahs 1..i (so surahStart[0]=0,
// surahStart[1]=7 for Al-Fatihah, etc.). The generated TS indexes this as
// SURAH_START[surah - 1] to get the ordinal offset for a given surah.
const surahStart = [0];
for (let s = 1; s <= 113; s++) surahStart.push(surahStart[s - 1] + surahCounts[s]);

const ts = `// AUTO-GENERATED — do not edit by hand.
// Regenerate with: node scripts/generate-mushaf-data.js
//
// Source: https://tanzil.net/res/text/metadata/quran-data.xml
// Attribution: "Tanzil Project", https://tanzil.net (CC-BY)
//
// Boundary data for the standard Madani Mushaf: 30 juz, 604 pages,
// 240 quarters (60 hizb), 556 rukus, 7 manzils, 15 sajda verses.
// Verified at generation time to contain exactly those counts.
//
// The boundaries are stored as global ayah ordinals (1..6236) rather than a
// per-ayah table, because that is how the source records them and because a
// per-ayah expansion would be ~665 KB. Resolution is a binary search.

import { getSurah } from "./data";

/** Global ordinal (1-based) of a verse, or null if the reference is invalid. */
export function toGlobalOrdinal(surah: number, ayah: number): number | null {
  if (!Number.isInteger(surah) || !Number.isInteger(ayah)) return null;
  if (surah < 1 || surah > 114 || ayah < 1) return null;
  const meta = getSurah(surah);
  if (!meta || ayah > meta.ayahCount) return null;
  return SURAH_START[surah - 1] + ayah;
}

/** First global ordinal of each surah (1-based, index 0 unused). */
const SURAH_START: readonly number[] = ${JSON.stringify(surahStart.slice(0, 114))};

interface Boundary {
  /** 1-based index of the juz/page/quarter/ruku/manzil this boundary starts. */
  i: number;
  /** Global ayah ordinal at which this boundary starts. */
  g: number;
}

const JUZ: readonly Boundary[] = ${JSON.stringify(juzBounds.map((b) => ({ i: b.index, g: b.global })))};

const PAGE: readonly Boundary[] = ${JSON.stringify(pageBounds.map((b) => ({ i: b.index, g: b.global })))};

const QUARTER: readonly Boundary[] = ${JSON.stringify(quarterBounds.map((b) => ({ i: b.index, g: b.global })))};

const RUKU: readonly Boundary[] = ${JSON.stringify(rukuBounds.map((b) => ({ i: b.index, g: b.global })))};

const MANZIL: readonly Boundary[] = ${JSON.stringify(manzilBounds.map((b) => ({ i: b.index, g: b.global })))};

interface SajdaPoint {
  i: number;
  g: number;
  t: "recommended" | "obligatory";
}

const SAJDA: readonly SajdaPoint[] = ${JSON.stringify(
  sajdaPoints.map((s) => ({ i: s.index, g: s.global, t: s.type }))
)};

/** Greatest boundary whose start is <= g. Lists always begin at g=1. */
function resolve(list: readonly Boundary[], g: number): number {
  let lo = 0;
  let hi = list.length - 1;
  let answer = list[0].i;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (list[mid].g <= g) {
      answer = list[mid].i;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }
  return answer;
}

export interface AyahMetadata {
  juz: number;
  page: number;
  hizb: number;
  rubElHizb: number;
  ruku: number;
  manzil: number;
  sajda: { index: number; type: "recommended" | "obligatory" } | null;
}

/** All mushaf metadata for a verse, or null for an invalid reference. */
export function getAyahMetadata(surah: number, ayah: number): AyahMetadata | null {
  const g = toGlobalOrdinal(surah, ayah);
  if (g === null) return null;
  const quarter = resolve(QUARTER, g);
  const sajda = SAJDA.find((s) => s.g === g);
  return {
    juz: resolve(JUZ, g),
    page: resolve(PAGE, g),
    hizb: Math.ceil(quarter / 4),
    rubElHizb: quarter,
    ruku: resolve(RUKU, g),
    manzil: resolve(MANZIL, g),
    sajda: sajda ? { index: sajda.i, type: sajda.t } : null,
  };
}

export function getJuzForAyah(surah: number, ayah: number): number | null {
  const g = toGlobalOrdinal(surah, ayah);
  return g === null ? null : resolve(JUZ, g);
}

export function getPageForAyah(surah: number, ayah: number): number | null {
  const g = toGlobalOrdinal(surah, ayah);
  return g === null ? null : resolve(PAGE, g);
}

export function getHizbForAyah(surah: number, ayah: number): number | null {
  const g = toGlobalOrdinal(surah, ayah);
  return g === null ? null : Math.ceil(resolve(QUARTER, g) / 4);
}

export function getRubElHizbForAyah(surah: number, ayah: number): number | null {
  const g = toGlobalOrdinal(surah, ayah);
  return g === null ? null : resolve(QUARTER, g);
}

export function getRukuForAyah(surah: number, ayah: number): number | null {
  const g = toGlobalOrdinal(surah, ayah);
  return g === null ? null : resolve(RUKU, g);
}

export function getManzilForAyah(surah: number, ayah: number): number | null {
  const g = toGlobalOrdinal(surah, ayah);
  return g === null ? null : resolve(MANZIL, g);
}

export function getSajdaForAyah(
  surah: number,
  ayah: number
): { index: number; type: "recommended" | "obligatory" } | null {
  return getAyahMetadata(surah, ayah)?.sajda ?? null;
}

export function isSajdaAyah(surah: number, ayah: number): boolean {
  return getSajdaForAyah(surah, ayah) !== null;
}

/** All 15 sajda verses, in mushaf order. */
export const SAJDA_VERSES: readonly { index: number; type: "recommended" | "obligatory" }[] =
  SAJDA.map((s) => ({ index: s.i, type: s.t }));

/** Juz boundaries (1-based juz number -> first global ordinal). */
export const JUZ_BOUNDARIES = JUZ;
export const PAGE_BOUNDARIES = PAGE;
`;

fs.writeFileSync(outPath, ts);

// Sanity checks against the generated module's own tables.
const check = (label, list, g, expected) => {
  let answer = list[0].i;
  for (const b of list) if (b.g <= g) answer = b.i;
  if (answer !== expected) throw new Error(`${label} @${g}: expected ${expected}, got ${answer}`);
};

check("juz", juzBounds.map((b) => ({ i: b.index, g: b.global })), 1, 1);
check("juz", juzBounds.map((b) => ({ i: b.index, g: b.global })), toGlobal(2, 255), 3);
check("juz", juzBounds.map((b) => ({ i: b.index, g: b.global })), toGlobal(114, 6), 30);
check("page", pageBounds.map((b) => ({ i: b.index, g: b.global })), toGlobal(2, 255), 42);
check("page", pageBounds.map((b) => ({ i: b.index, g: b.global })), toGlobal(114, 6), 604);

console.log("Verified counts:");
for (const [label, actual, expected] of expectations) {
  console.log(`  ${label}: ${actual} (expected ${expected})`);
}
console.log("\nSpot checks:");
console.log(`  1:1     -> juz ${juzBounds[0].index}, page ${pageBounds[0].index}`);
console.log(`  2:255   -> juz 3, page 42`);
console.log(`  114:6   -> juz 30, page 604`);
console.log(`  32:15   -> sajda ${JSON.stringify(sajdaPoints.find((s) => s.g === toGlobal(32, 15)))}`);
console.log(`\nWrote ${outPath} (${fs.statSync(outPath).size} bytes)`);