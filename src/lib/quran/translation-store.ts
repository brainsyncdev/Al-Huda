"use client";

// Client-side translation store. Fetches translation text from the local
// /api/translations/[id] proxy (which in turn fetches from Tanzil.net),
// parses the "surah|ayah|text" format, and caches the result in memory.
//
// Components subscribe via useTranslationText() so they re-render when a
// translation finishes loading. The store is module-scoped (one cache per
// browser tab) — translations are ~1.5 MB each, so only a handful should be
// loaded per session.

import { useEffect, useReducer } from "react";

/** Parsed translation: map of "surah:ayah" -> text. */
type TranslationMap = Map<string, string>;

/** In-memory cache of loaded translations. */
const cache = new Map<string, TranslationMap>();

/** In-flight load promises, deduped per id. */
const inflight = new Map<string, Promise<TranslationMap>>();

/** Monotonic version counter; bumped whenever a translation finishes loading. */
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

/** Whether a translation is already cached. */
export function isLoaded(id: string): boolean {
  return cache.has(id);
}

/** Get cached translation map, or undefined if not yet loaded. */
export function getCached(id: string): TranslationMap | undefined {
  return cache.get(id);
}

/** Look up one verse in a cached translation. */
export function getVerse(
  id: string,
  surah: number,
  ayah: number
): string | null {
  const map = cache.get(id);
  if (!map) return null;
  return map.get(`${surah}:${ayah}`) ?? null;
}

/**
 * Parse the Tanzil plain-text format: one verse per line, "surah|ayah|text".
 * The text itself may contain pipe characters (rare but possible in
 * punctuation), so we split on the first two pipes only.
 */
function parseTanzilText(text: string): TranslationMap {
  const map: TranslationMap = new Map();
  const lines = text.split("\n");
  for (const line of lines) {
    if (!line) continue;
    const firstPipe = line.indexOf("|");
    if (firstPipe < 0) continue;
    const secondPipe = line.indexOf("|", firstPipe + 1);
    if (secondPipe < 0) continue;
    const surah = line.slice(0, firstPipe);
    const ayah = line.slice(firstPipe + 1, secondPipe);
    const verseText = line.slice(secondPipe + 1);
    map.set(`${surah}:${ayah}`, verseText);
  }
  return map;
}

/**
 * Ensure a translation is loaded. Returns the parsed map. Deduplicates
 * concurrent requests for the same id.
 */
export async function ensureLoaded(id: string): Promise<TranslationMap> {
  const existing = cache.get(id);
  if (existing) return existing;

  const pending = inflight.get(id);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const res = await fetch(`/api/translations/${encodeURIComponent(id)}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      const map = parseTanzilText(text);
      cache.set(id, map);
      notify();
      return map;
    } finally {
      inflight.delete(id);
    }
  })();

  inflight.set(id, promise);
  return promise;
}

/**
 * React hook: returns the text of one verse in the requested translation,
 * or null while the translation is still loading / if the verse is missing.
 *
 * Triggers the load on mount (the store does not fetch on its own) and
 * subscribes for re-render when the cache changes.
 */
export function useTranslationText(
  translationId: string,
  surah: number,
  ayah: number
): string | null {
  const [, forceRender] = useReducer((n: number) => n + 1, 0);

  useEffect(() => {
    let active = true;
    if (!isLoaded(translationId)) {
      ensureLoaded(translationId).catch(() => {
        // Swallow: the caller falls back to the dataset's built-in English.
      });
    }
    const unsubscribe = subscribe(() => {
      if (active) forceRender();
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [translationId]);

  return getVerse(translationId, surah, ayah);
}

/**
 * Kick off loading for the active translation without subscribing. Used by
 * non-React code paths if needed; components should prefer the hook.
 */
export function preloadTranslation(id: string): void {
  if (!isLoaded(id) && !inflight.has(id)) {
    ensureLoaded(id).catch(() => {
      // swallow — UI will show fallback translation
    });
  }
}