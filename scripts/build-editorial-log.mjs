// Generate content/editorial/reviews.json from the in-repo topic and source
// registries. Run after editing topics or sources so the review log stays in
// sync. The JSON file is the source of truth the app imports at build time.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");

// Topic slugs from src/lib/topics/data.ts — kept in sync by hand because
// importing TS from a plain .mjs generator is heavier than it's worth.
const TOPIC_SLUGS = [
  "patience",
  "gratitude",
  "trust-in-god",
  "mercy-and-forgiveness",
  "remembrance",
  "giving",
  "justice",
  "parents-and-family",
  "hardship-and-ease",
  "knowledge-and-reflection",
  "the-hereafter",
];

const SOURCE_IDS = [
  {
    id: "islamic-network-audio",
    status: "pending-scholarly-review",
    method: "license-verification-v1 (streaming, not bundled)",
    notes:
      "Islamic Network CDN streams per-ayah MP3s; no explicit redistribution licence is published by the CDN. Streaming is defensible; bundling would require explicit rights clearance.",
  },
  {
    id: "tanzil-mushaf-metadata",
    status: "editorial-approved",
    method: "license-verification-v1 (CC-BY, declared in source file header)",
    notes:
      "Tanzil quran-data.xml declares license=cc-by in the file header. The generator verifies 30 juz, 604 pages, 240 quarters, 556 rukus, 7 manzils, 15 sajda verses, and 6236 ayat before writing.",
  },
  {
    id: "tafsir-jalalayn",
    status: "pending-scholarly-review",
    method: "license-verification-v1 (Tanzil terms, streamed via proxy)",
    notes:
      "Classical Arabic tafsir served through the translation proxy. Tanzil terms require attribution and no modification. Displayed with full provenance (FR-030).",
  },
  {
    id: "tafsir-muyassar",
    status: "pending-scholarly-review",
    method: "license-verification-v1 (Tanzil terms, streamed via proxy)",
    notes:
      "Contemporary Arabic tafsir served through the translation proxy. Tanzil terms require attribution and no modification. Displayed with full provenance (FR-030).",
  },
  {
    id: "qul-word-data",
    status: "editorial-approved",
    method: "license-verification-v1 (MIT, QUL repository verified)",
    notes:
      "QUL by TarteelAI is MIT-licensed. The generator downloads word segmentation from the Quran.com API v4 and vendors per-surah JSON with a sha256 manifest.",
  },
  {
    id: "semantic-embeddings",
    status: "editorial-approved",
    method: "license-verification-v1 (Apache-2.0 model)",
    notes:
      "Xenova/all-MiniLM-L6-v2 is Apache-2.0. Embeddings are generated at build time from the built-in English translation and vendored as a float16 binary.",
  },
];

const FEATURE_IDS = [
  {
    id: "audio-recitation",
    status: "pending-scholarly-review",
    method: "feature-review-v1 (streaming, off by default, provenance tracked)",
    notes:
      "Audio is streamed from the Islamic Network CDN; no files are bundled. Off by default. Reciter selector and source provenance are displayed. Awaiting a qualified reviewer to confirm the reciter selections are appropriate.",
  },
  {
    id: "parallel-translations",
    status: "pending-scholarly-review",
    method: "feature-review-v1 (on-demand loading, provenance tracked)",
    notes:
      "Primary translation plus up to three additional editions are shown side by side. Each edition is fetched on demand from Tanzil.net through the existing proxy. Tanzil terms require attribution and no modification. Awaiting a qualified reviewer to confirm the translation selections are appropriate.",
  },
  {
    id: "mushaf-metadata",
    status: "editorial-approved",
    method: "feature-review-v1 (generated from CC-BY source, counts verified)",
    notes:
      "Juz, page, hizb, ruku, manzil, and sajda boundaries are generated from Tanzil CC-BY quran-data.xml. The generator verifies expected counts before writing. Surfaced on the ayah detail page.",
  },
  {
    id: "tafsir-viewer",
    status: "pending-scholarly-review",
    method: "feature-review-v1 (classical Arabic tafsirs, collapsible, lazy-loaded)",
    notes:
      "Displays Tafsir al-Jalalayn and Tafsir al-Muyassar through the translation proxy. Collapsible and lazy-loaded to avoid loading roughly 3 MB on every ayah page. Full provenance displayed. Awaiting a qualified reviewer to confirm the tafsir selections are appropriate.",
  },
  {
    id: "word-by-word",
    status: "editorial-approved",
    method: "feature-review-v1 (MIT-licensed QUL data, vendored with manifest)",
    notes:
      "Word segmentation, transliteration, and English gloss from QUL (MIT). Vendored as per-surah JSON with a sha256 manifest. The collapsible panel loads on demand.",
  },
  {
    id: "semantic-search",
    status: "pending-scholarly-review",
    method: "feature-review-v1 (Apache-2.0 model, local embedding, provenance tracked)",
    notes:
      "Semantic search uses MiniLM (Apache-2.0) to embed queries locally and compare them against precomputed embeddings. Nothing leaves the device. Experimental; results are not a substitute for lexical search or scholarly interpretation. Awaiting a qualified reviewer to confirm the model choice and usage guidance are appropriate.",
  },
];

const today = new Date().toISOString().slice(0, 10);

const reviews = [];

for (const slug of TOPIC_SLUGS) {
  reviews.push({
    id: `topic-${slug}`,
    subjectType: "topic",
    subjectId: slug,
    status: "pending-scholarly-review",
    curator: "Al-Huda editorial seed",
    method: "editorial-selection-v1 (well-known ayat, non-exhaustive)",
    reviewedAt: "2026-10-17",
    notes: "Initial seed selection; awaiting qualified reviewer.",
  });
}

for (const s of SOURCE_IDS) {
  reviews.push({
    id: `source-${s.id}`,
    subjectType: "source",
    subjectId: s.id,
    status: s.status,
    curator: "Al-Huda editorial seed",
    method: s.method,
    reviewedAt: today,
    notes: s.notes,
  });
}

for (const f of FEATURE_IDS) {
  reviews.push({
    id: `feature-${f.id}`,
    subjectType: "feature",
    subjectId: f.id,
    status: f.status,
    curator: "Al-Huda editorial seed",
    method: f.method,
    reviewedAt: today,
    notes: f.notes,
  });
}

const out = {
  $schema:
    "Editorial review log — tracks review status for topics, sources, and features (FR-072, FR-073, FR-075).",
  version: "1.0",
  lastUpdated: today,
  reviews,
};

const target = resolve(root, "content/editorial/reviews.json");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, JSON.stringify(out, null, 2) + "\n");
console.log(`wrote ${reviews.length} reviews to content/editorial/reviews.json`);
