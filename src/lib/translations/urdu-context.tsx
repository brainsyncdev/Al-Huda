"use client";

// Urdu translation context provider (Sprint 54).
//
// Provides CRUD operations for Urdu translation records. This is intentionally
// separate from the shared backup envelope to avoid schema churn — Urdu
// translations have their own localStorage key and lifecycle.
//
// See docs/URDU-TRANSLATION-REVIEW.md for the full workflow and policy decisions.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  type UrduTranslationRecord,
  validateTranslationRecord,
} from "./urdu-types";
import {
  readUrduTranslationsStore,
  writeUrduTranslationsStore,
  normalizeTranslationRecord,
  type UrduTranslationsStore,
} from "./urdu-storage";

interface UrduTranslationsContextValue {
  /** True once localStorage has been read (avoids hydration mismatch). */
  hydrated: boolean;
  /** All translation records keyed by topic slug. */
  records: Record<string, UrduTranslationRecord>;
  /** Get a single record by topic slug. */
  getRecord: (topicSlug: string) => UrduTranslationRecord | null;
  /** Create or update a translation record. Validates before writing. */
  setRecord: (record: UrduTranslationRecord) => UrduTranslationRecord;
  /** Delete a translation record by topic slug. */
  deleteRecord: (topicSlug: string) => void;
  /** Get all records as an array. */
  getAllRecords: () => UrduTranslationRecord[];
  /** Export the entire store for backup. */
  exportStore: () => UrduTranslationsStore;
  /** Import a store from backup data. Validates all records. */
  importStore: (data: unknown) => { success: boolean; errors: string[] };
  /** Clear all translation records. */
  clearAll: () => void;
}

const UrduTranslationsContext =
  createContext<UrduTranslationsContextValue | null>(null);

export function UrduTranslationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [store, setStore] = useState<UrduTranslationsStore>(() => ({
    version: 1,
    records: {},
    lastUpdated: new Date().toISOString(),
  }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStore(readUrduTranslationsStore());
    setHydrated(true);
  }, []);

  const commit = useCallback((next: UrduTranslationsStore) => {
    setStore(next);
    writeUrduTranslationsStore(next);
  }, []);

  const value = useMemo<UrduTranslationsContextValue>(() => {
    return {
      hydrated,
      records: store.records,
      getRecord: (topicSlug) => {
        return store.records[topicSlug] || null;
      },
      setRecord: (record) => {
        const errors = validateTranslationRecord(record);
        if (errors.length > 0) {
          throw new Error(
            `Invalid translation record for ${record.topicSlug}: ${errors.join(", ")}`
          );
        }
        const normalized = normalizeTranslationRecord(record);
        normalized.topicSlug = record.topicSlug;
        const next: UrduTranslationsStore = {
          ...store,
          records: {
            ...store.records,
            [record.topicSlug]: normalized,
          },
          lastUpdated: new Date().toISOString(),
        };
        commit(next);
        return normalized;
      },
      deleteRecord: (topicSlug) => {
        const nextRecords = { ...store.records };
        delete nextRecords[topicSlug];
        const next: UrduTranslationsStore = {
          ...store,
          records: nextRecords,
          lastUpdated: new Date().toISOString(),
        };
        commit(next);
      },
      getAllRecords: () => {
        return Object.values(store.records);
      },
      exportStore: () => {
        return store;
      },
      importStore: (data) => {
        // Validate all records before importing
        if (!data || typeof data !== "object") {
          return { success: false, errors: ["Invalid data format"] };
        }
        const obj = data as Record<string, unknown>;
        if (!obj.records || typeof obj.records !== "object") {
          return { success: false, errors: ["Missing records field"] };
        }
        const errors: string[] = [];
        const rawRecords = obj.records as Record<string, unknown>;
        for (const [slug, rawRecord] of Object.entries(rawRecords)) {
          if (rawRecord && typeof rawRecord === "object") {
            const normalized = normalizeTranslationRecord(
              rawRecord as Partial<UrduTranslationRecord> & {
                topicSlug: string;
              }
            );
            normalized.topicSlug = slug;
            const recordErrors = validateTranslationRecord(normalized);
            if (recordErrors.length > 0) {
              errors.push(`${slug}: ${recordErrors.join(", ")}`);
            }
          }
        }
        if (errors.length > 0) {
          return { success: false, errors };
        }
        // All valid, import
        const importedStore = readUrduTranslationsStore();
        for (const [slug, rawRecord] of Object.entries(rawRecords)) {
          if (rawRecord && typeof rawRecord === "object") {
            const normalized = normalizeTranslationRecord(
              rawRecord as Partial<UrduTranslationRecord> & {
                topicSlug: string;
              }
            );
            normalized.topicSlug = slug;
            importedStore.records[slug] = normalized;
          }
        }
        importedStore.lastUpdated = new Date().toISOString();
        commit(importedStore);
        return { success: true, errors: [] };
      },
      clearAll: () => {
        const next: UrduTranslationsStore = {
          version: 1,
          records: {},
          lastUpdated: new Date().toISOString(),
        };
        commit(next);
      },
    };
  }, [store, hydrated, commit]);

  return (
    <UrduTranslationsContext.Provider value={value}>
      {children}
    </UrduTranslationsContext.Provider>
  );
}

/**
 * Access the Urdu translations context. Throws if used outside provider.
 */
export function useUrduTranslations(): UrduTranslationsContextValue {
  const ctx = useContext(UrduTranslationsContext);
  if (!ctx) {
    throw new Error(
      "useUrduTranslations must be used within UrduTranslationsProvider"
    );
  }
  return ctx;
}
