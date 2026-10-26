// Morphology data adapter — loads validated morphology index from generated JSON.
//
// SERVER-ONLY: reads from generated JSON files. Never import from client components.
//
// DESIGN: The actual SQLite import is performed by a build-time Python script
// (scripts/import-morphology.py), which validates against the pinned Quran dataset
// and word-data, then writes a deterministic JSON index. This adapter reads that
// JSON index at runtime, avoiding SQLite dependencies in the application.
//
// Data sources (imported by Python script):
//   - word-root.db: 1,642 roots, 50,298 word occurrences
//   - word-lemma.db: 4,817 lemmas, 72,510 word occurrences
//   - ayah-root.db: 6,214 ayah-level root assignments
//
// All records carry source provenance (sourceId: "qul-morphology-v1").

import path from "node:path";
import fs from "node:fs";
import type { MorphologyRecord } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const MORPHOLOGY_INDEX_PATH = path.join(DATA_DIR, "morphology-index.json");

export interface MorphologyAdapterOptions {
  /** Path to the generated morphology index JSON. Defaults to data/morphology-index.json. */
  indexPath?: string;
}

/**
 * Load morphology data from the generated JSON index.
 * The index is produced by scripts/import-morphology.py, which performs
 * validation against the pinned Quran dataset and word-data.
 *
 * Returns an array of MorphologyRecord objects ready for use in the
 * occurrence-index builder and root-topic system.
 */
export function loadMorphologyData(
  options: MorphologyAdapterOptions = {}
): MorphologyRecord[] {
  const indexPath = options.indexPath ?? MORPHOLOGY_INDEX_PATH;

  if (!fs.existsSync(indexPath)) {
    console.warn(
      `Morphology index not found at ${indexPath}. Run scripts/import-morphology.py first.`
    );
    return [];
  }

  try {
    const raw = fs.readFileSync(indexPath, "utf-8");
    const data = JSON.parse(raw);

    // The index is an array of MorphologyRecord objects
    if (!Array.isArray(data)) {
      console.error("Morphology index is not an array");
      return [];
    }

    // Validate each record has the required fields
    const records: MorphologyRecord[] = [];
    for (const item of data) {
      if (
        item &&
        typeof item === "object" &&
        item.ref &&
        typeof item.ref.surah === "number" &&
        typeof item.ref.ayah === "number" &&
        typeof item.token === "string" &&
        typeof item.canonicalArabic === "string" &&
        typeof item.sourceId === "string"
      ) {
        records.push(item as MorphologyRecord);
      }
    }

    return records;
  } catch (error) {
    console.error("Failed to load morphology index:", error);
    return [];
  }
}

/**
 * Check if the morphology index exists and is loadable.
 * Useful for UI components to show appropriate empty/unavailable states.
 */
export function isMorphologyDataAvailable(
  options: MorphologyAdapterOptions = {}
): boolean {
  const indexPath = options.indexPath ?? MORPHOLOGY_INDEX_PATH;
  return fs.existsSync(indexPath);
}
