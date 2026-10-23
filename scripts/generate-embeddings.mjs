#!/usr/bin/env node
// Semantic-search embedding generator (FR-014).
//
// Produces a static, vendored embedding index over the built-in English
// translation of all 6,236 ayat. The runtime search page loads this index and
// the same model in the browser, so a query is embedded once locally and
// compared against the precomputed vectors — nothing about the user's query
// leaves the device.
//
// Model: Xenova/all-MiniLM-L6-v2 (quantized ONNX, 21.9 MB, 384 dimensions).
//   - Apache-2.0, sentence-transformers family.
//   - English-only, which matches the search index (the built-in English
//     translation). The multilingual variant is 112.8 MB and is not worth a
//     5x download for an optional feature.
//
// Output (checked into public/embeddings/):
//   quran-minilm.bin   float16, row-major, count x dim
//   quran-minilm.json  { model, dim, count, normalize, verses: [[surah,ayah]] }
//
// Usage:
//   node scripts/generate-embeddings.mjs --probe    # 5 verses, no write
//   node scripts/generate-embeddings.mjs            # full corpus
//
// The script deliberately imports @xenova/transformers from .tmp/embedgen
// rather than the app's node_modules: Transformers.js is a build-time tool
// here, not a runtime dependency of the Next app (the browser loads the same
// library from a CDN in src/lib/quran/semantic-search.ts).

import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "embeddings");
const require = createRequire(import.meta.url);

const MODEL = "Xenova/all-MiniLM-L6-v2";
const MODEL_LABEL = "Xenova/all-MiniLM-L6-v2 (quantized)";
const DIM = 384;
const BATCH = 16;

const probe = process.argv.includes("--probe");

/** float32 -> IEEE 754 half (little-endian), standard round-to-nearest. */
function toFloat16(value) {
  const f32 = new Float32Array(1);
  f32[0] = value;
  const bits = new Uint32Array(f32.buffer)[0];
  const sign = (bits >>> 16) & 0x8000;
  let exp = (bits >>> 23) & 0xff;
  let mant = bits & 0x7fffff;

  if (exp === 0xff) {
    // Inf/NaN
    return sign | 0x7c00 | (mant ? 0x200 : 0);
  }
  let e = exp - 127 + 15;
  if (e >= 0x1f) return sign | 0x7c00; // overflow -> inf
  if (e <= 0) {
    // subnormal or zero
    if (e < -10) return sign;
    mant |= 0x800000;
    const shift = 14 - e;
    const half = mant >> shift;
    return sign | (half & 0x3ff);
  }
  // round to nearest even
  const round = mant & 0x1fff;
  let half = (e << 10) | (mant >>> 13);
  if (round > 0x1000 || (round === 0x1000 && (half & 1))) half += 1;
  return sign | half;
}

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

async function main() {
  // Load the vendored English dataset the app itself ships.
  const quran = require("quran-json/dist/quran_en.json");

  const items = [];
  for (const surah of quran) {
    for (const verse of surah.verses) {
      items.push({
        surah: surah.id,
        ayah: verse.id,
        text: verse.translation,
      });
    }
  }

  const corpus = probe ? items.slice(0, 5) : items;
  console.log(
    `${probe ? "probe" : "full"}: ${corpus.length} verses, model ${MODEL_LABEL}`
  );

  // Import from the isolated build-time install. pathToFileURL is required on
  // Windows: a bare filesystem path is not a valid ES module specifier.
  const transformersEntry = path.join(
    root, ".tmp", "embedgen", "node_modules", "@xenova", "transformers", "src", "transformers.js"
  );
  const { pipeline, env } = await import(pathToFileURL(transformersEntry).href);

  env.allowRemoteModels = true;
  env.useBrowserCache = false;

  console.log("loading model (first run downloads ~22 MB)…");
  const extractor = await pipeline("feature-extraction", MODEL, {
    quantized: true,
  });

  const vectors = [];
  const started = Date.now();

  for (let i = 0; i < corpus.length; i += BATCH) {
    const batch = corpus.slice(i, i + BATCH);
    const output = await extractor(
      batch.map((b) => b.text),
      { pooling: "mean", normalize: true }
    );
    // output.data is Float32Array of batch.length * DIM
    const data = output.data;
    for (let r = 0; r < batch.length; r++) {
      vectors.push(data.subarray(r * DIM, (r + 1) * DIM));
    }
    if ((i / BATCH) % 25 === 0 || i + BATCH >= corpus.length) {
      const done = Math.min(i + BATCH, corpus.length);
      const rate = done / ((Date.now() - started) / 1000);
      process.stdout.write(
        `  ${done}/${corpus.length} (${rate.toFixed(0)}/s)\n`
      );
    }
  }

  if (vectors.length !== corpus.length) {
    throw new Error(
      `vector count ${vectors.length} != verse count ${corpus.length}`
    );
  }
  for (const v of vectors) {
    if (v.length !== DIM) throw new Error(`unexpected dimension ${v.length}`);
  }

  // Pack as float16, row-major.
  const packed = new Uint16Array(corpus.length * DIM);
  let k = 0;
  for (const v of vectors) {
    for (let d = 0; d < DIM; d++) packed[k++] = toFloat16(v[d]);
  }
  const bin = Buffer.from(packed.buffer);

  console.log(
    `packed ${corpus.length} x ${DIM} float16 = ${(bin.length / 1048576).toFixed(2)} MB`
  );

  if (probe) {
    console.log("probe complete — nothing written");
    console.log("first vector[0..4]:", Array.from(vectors[0].slice(0, 5)));
    console.log("norm:", Math.hypot(...vectors[0]));
    return;
  }

  mkdirSync(outDir, { recursive: true });
  const binPath = path.join(outDir, "quran-minilm.bin");
  writeFileSync(binPath, bin);

  const index = {
    model: MODEL_LABEL,
    dim: DIM,
    count: corpus.length,
    dtype: "float16",
    normalize: true,
    sha256: sha256(bin),
    verses: corpus.map((c) => [c.surah, c.ayah]),
  };
  writeFileSync(
    path.join(outDir, "quran-minilm.json"),
    JSON.stringify(index),
    "utf8"
  );

  console.log(`wrote ${path.relative(root, binPath)}`);
  console.log(`wrote ${path.relative(root, path.join(outDir, "quran-minilm.json"))}`);
}

main().catch((err) => {
  console.error(err?.stack ?? err?.message ?? err);
  process.exit(1);
});