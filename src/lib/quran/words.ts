"use client";

// Word-by-word dataset loader (FR-009).
//
// The generator script (`scripts/generate-word-data.js`) downloads verse-by-verse
// word segmentation from the Quran.com API (v4), which serves the Quranic
// Universal Library (QUL) word data, and writes per-surah JSON files to
// `public/word-data/`. This module loads those files on demand, caches them in
// memory, and provides a React hook for components to subscribe.
//
// The dataset is vendored (not fetched at runtime from a third party) because
// docs/DATA-PROVENANCE.md forbids runtime fetching of Quran content: the text
// a visitor sees must be pinned to a release, not to a third party's current
// database state.

import { useEffect, useReducer } from "react";

/** One word token: Arabic text, translation, transliteration, position. */
export interface WordToken {
  arabic: string;
  translation: string;
  transliteration: string;
  position: number;
}

/** Map of verse key ("surah:ayah") to word list. */
export type WordMap = Record<string, WordToken[]>;

/** In-memory cache of loaded surah word maps. */
const cache = new Map<number, WordMap>();

/** In-flight load promises, deduped per surah. */
const inflight = new Map<number, Promise<WordMap>>();

/** Monotonic version counter; bumped whenever a surah finishes loading. */
let version = 0;

/** Subscribers notified on version change. */
const listeners = new Set<() => void>();

function notify() {
  version += 1;
  for (const fn of listeners) {
    try {
      fn();
    } catch {
      // ignore subscriber errors
    }
  }
}

/** Subscribe to cache changes. Returns an unsubscribe function. */
export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

/** Current version — used by useSyncExternalStore-style hooks. */
export function getVersion(): number {
  return version;
}

/** Whether a surah's word map is already cached. */
export function isLoaded(surah: number): boolean {
  return cache.has(surah);
}

/** Get cached word map, or undefined if not yet loaded. */
export function getCached(surah: number): WordMap | undefined {
  return cache.get(surah);
}

/** Look up one verse's words in a cached map. */
export function getVerseWords(
  map: WordMap,
  surah: number,
  ayah: number
): WordToken[] {
  return map[`${surah}:${ayah}`] ?? [];
}

/**
 * Parse the compact JSON format: each entry is [arabic, translation, transliteration].
 * Position is the index, so no redundant position field is stored.
 */
function parseWordMap(raw: Record<string, string[][]>): WordMap {
  const map: WordMap = {};
  for (const [key, words] of Object.entries(raw)) {
    map[key] = words.map((w, i) => ({
      arabic: w[0] ?? "",
      translation: w[1] ?? "",
      transliteration: w[2] ?? "",
      position: i + 1,
    }));
  }
  return map;
}

/**
 * Ensure a surah's word map is loaded. Returns the parsed map. Deduplicates
 * concurrent requests for the same surah.
 */
export async function ensureLoaded(surah: number): Promise<WordMap> {
  const existing = cache.get(surah);
  if (existing) return existing;

  const pending = inflight.get(surah);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const res = await fetch(`/word-data/${surah}.json`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const raw = (await res.json()) as Record<string, string[][]>;
      const map = parseWordMap(raw);
      cache.set(surah, map);
      notify();
      return map;
    } finally {
      inflight.delete(surah);
    }
  })();

  inflight.set(surah, promise);
  return promise;
}

/**
 * React hook: returns the words of one verse, or null while the surah is still
 * loading / if the verse is missing.
 *
 * Triggers the load on mount (the store does not fetch on its own) and
 * subscribes for re-render when the cache changes.
 */
export function useVerseWords(
  surah: number,
  ayah: number
): WordToken[] | null {
  const [, forceRender] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let active = true;
    if (!isLoaded(surah)) {
      ensureLoaded(surah).catch(() => {
        // Swallow: the caller falls back to null.
      });
    }
    const unsubscribe = subscribe(() => {
      if (active) forceRender();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [surah]);

  const map = getCached(surah);
  if (!map) return null;
  const words = getVerseWords(map, surah, ayah);
  return words.length === 0 ? null : words;
}

/**
 * Kick off loading for a surah without subscribing. Used by non-React code
 * paths if needed; components should prefer the hook.
 */
export function preloadSurahWords(surah: number): void {
  if (!isLoaded(surah) && !inflight.has(surah)) {
    ensureLoaded(surah).catch(() => {
      // swallow — UI will show fallback
    });
  }
}
