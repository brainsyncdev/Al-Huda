// Urdu translation storage layer (localStorage-backed).
//
// Storage key: alhuda.urdu-translations.v1
//
// This module owns parsing, validation, and normalization of Urdu translation
// records. It is intentionally separate from the shared backup envelope to
// avoid schema churn — see docs/URDU-TRANSLATION-REVIEW.md for rationale.
//
// Policy: translations cannot be published without proper review. This module
// enforces validation on every write.
//
// Architecture: Pure logic (normalize, validate) is separated from I/O
// (localStorage read/write) so the pure functions can be tested without
// mocking globals.

import {
  type UrduTranslationRecord,
  type UrduTranslationReviewState,
  VALID_REVIEW_STATES,
  validateTranslationRecord,
} from "./urdu-types";

export const STORAGE_KEY = "alhuda.urdu-translations.v1";

/**
 * Shape of the stored data.
 */
export interface UrduTranslationsStore {
  version: 1;
  records: Record<string, UrduTranslationRecord>;
  lastUpdated: string;
}

/**
 * Empty initial store.
 */
export const EMPTY_STORE: UrduTranslationsStore = {
  version: 1,
  records: {},
  lastUpdated: new Date().toISOString(),
};

/**
 * Normalize a translation record to ensure all required fields are present
 * and valid. Returns a normalized copy (does not mutate input).
 */
export function normalizeTranslationRecord(
  record: Partial<UrduTranslationRecord> & { topicSlug: string }
): UrduTranslationRecord {
  const normalized: UrduTranslationRecord = {
    topicSlug: String(record.topicSlug || ""),
    englishTitle: String(record.englishTitle || ""),
    arabicTitle: String(record.arabicTitle || ""),
    proposedUrduTitle: record.proposedUrduTitle
      ? String(record.proposedUrduTitle)
      : undefined,
    translationSource: record.translationSource
      ? String(record.translationSource)
      : undefined,
    translatorAttribution: record.translatorAttribution
      ? String(record.translatorAttribution)
      : undefined,
    reviewState: VALID_REVIEW_STATES.includes(
      record.reviewState as UrduTranslationReviewState
    )
      ? (record.reviewState as UrduTranslationReviewState)
      : "missing",
    reviewNotes: record.reviewNotes ? String(record.reviewNotes) : undefined,
    lastReviewedDate: record.lastReviewedDate
      ? String(record.lastReviewedDate)
      : undefined,
    knownLimitations: Array.isArray(record.knownLimitations)
      ? record.knownLimitations.map(String)
      : [],
  };

  return normalized;
}

/**
 * Normalize the entire store, ensuring all records are valid.
 * Pure function — no I/O.
 */
export function normalizeStore(raw: unknown): UrduTranslationsStore {
  if (!raw || typeof raw !== "object") {
    return { ...EMPTY_STORE, lastUpdated: new Date().toISOString() };
  }

  const obj = raw as Record<string, unknown>;
  const version = obj.version === 1 ? 1 : 1;
  const lastUpdated =
    typeof obj.lastUpdated === "string"
      ? obj.lastUpdated
      : new Date().toISOString();

  const records: Record<string, UrduTranslationRecord> = {};

  if (obj.records && typeof obj.records === "object") {
    const rawRecords = obj.records as Record<string, unknown>;
    for (const [slug, rawRecord] of Object.entries(rawRecords)) {
      if (rawRecord && typeof rawRecord === "object") {
        const normalized = normalizeTranslationRecord(
          rawRecord as Partial<UrduTranslationRecord> & { topicSlug: string }
        );
        // Ensure the slug key matches the record's topicSlug
        normalized.topicSlug = slug;
        records[slug] = normalized;
      }
    }
  }

  return { version, records, lastUpdated };
}

/**
 * Minimal Storage-like interface for dependency injection.
 * Allows tests to pass a mock without touching globals.
 */
export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

/**
 * Get the storage backend. Returns undefined if no storage is available
 * (e.g., SSR or restricted environments).
 */
function getStorage(): StorageLike | undefined {
  if (typeof localStorage !== "undefined") {
    return localStorage;
  }
  return undefined;
}

/**
 * Read the store from a storage backend. Pure function.
 */
export function readStoreFromStorage(
  storage: StorageLike | undefined
): UrduTranslationsStore {
  if (!storage) {
    return { ...EMPTY_STORE };
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return { ...EMPTY_STORE };
    }
    const parsed = JSON.parse(raw);
    return normalizeStore(parsed);
  } catch {
    console.warn("Failed to parse Urdu translations store, resetting");
    return { ...EMPTY_STORE };
  }
}

/**
 * Write the store to a storage backend. Pure function.
 */
export function writeStoreToStorage(
  storage: StorageLike | undefined,
  store: UrduTranslationsStore
): void {
  if (!storage) {
    return;
  }

  try {
    const serialized = JSON.stringify({
      ...store,
      lastUpdated: new Date().toISOString(),
    });
    storage.setItem(STORAGE_KEY, serialized);
  } catch (err) {
    console.error("Failed to write Urdu translations store:", err);
  }
}

/**
 * Read the store from localStorage.
 */
export function readUrduTranslationsStore(): UrduTranslationsStore {
  return readStoreFromStorage(getStorage());
}

/**
 * Write the store to localStorage.
 */
export function writeUrduTranslationsStore(store: UrduTranslationsStore): void {
  writeStoreToStorage(getStorage(), store);
}

/**
 * Get a single translation record by topic slug.
 */
export function getTranslationRecord(
  topicSlug: string
): UrduTranslationRecord | null {
  const store = readUrduTranslationsStore();
  return store.records[topicSlug] || null;
}

/**
 * Set (create or update) a translation record.
 * Validates the record before writing. Throws on validation failure.
 */
export function setTranslationRecord(
  record: UrduTranslationRecord
): UrduTranslationRecord {
  const errors = validateTranslationRecord(record);
  if (errors.length > 0) {
    throw new Error(
      `Invalid translation record for ${record.topicSlug}: ${errors.join(", ")}`
    );
  }

  const store = readUrduTranslationsStore();
  const normalized = normalizeTranslationRecord(record);
  normalized.topicSlug = record.topicSlug;

  store.records[record.topicSlug] = normalized;
  store.lastUpdated = new Date().toISOString();

  writeUrduTranslationsStore(store);
  return normalized;
}

/**
 * Delete a translation record by topic slug.
 */
export function deleteTranslationRecord(topicSlug: string): void {
  const store = readUrduTranslationsStore();
  delete store.records[topicSlug];
  store.lastUpdated = new Date().toISOString();
  writeUrduTranslationsStore(store);
}

/**
 * Get all translation records.
 */
export function getAllTranslationRecords(): UrduTranslationRecord[] {
  const store = readUrduTranslationsStore();
  return Object.values(store.records);
}

/**
 * Export the entire store as a JSON-serializable object.
 */
export function exportUrduTranslations(): UrduTranslationsStore {
  return readUrduTranslationsStore();
}

/**
 * Import a store from a JSON-serializable object.
 * Validates all records before importing.
 */
export function importUrduTranslations(
  data: unknown
): { success: boolean; errors: string[] } {
  const normalized = normalizeStore(data);
  const errors: string[] = [];

  // Validate all records
  for (const record of Object.values(normalized.records)) {
    const recordErrors = validateTranslationRecord(record);
    if (recordErrors.length > 0) {
      errors.push(`${record.topicSlug}: ${recordErrors.join(", ")}`);
    }
  }

  if (errors.length > 0) {
    return { success: false, errors };
  }

  writeUrduTranslationsStore(normalized);
  return { success: true, errors: [] };
}

/**
 * Clear all translation records.
 */
export function clearUrduTranslations(): void {
  const storage = getStorage();
  if (!storage) {
    return;
  }
  storage.removeItem(STORAGE_KEY);
}
