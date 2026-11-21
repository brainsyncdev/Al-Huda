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

/**
 * MFD-12.3 WS4 Gap 2: Metadata stored when a translation is gated.
 * Allows the UI to render a link-out card instead of a generic error.
 */
export interface GatedMetadata {
  gated: true;
  reason: string;
  editionId: string;
  externalUrl: string;
  message: string;
}

/** In-memory cache of loaded translations. Keyed by ACTUAL edition ID. */
const cache = new Map<string, TranslationMap>();

/** In-flight load promises, deduped by REQUESTED edition ID. */
const inflight = new Map<string, Promise<TranslationMap>>();

/**
 * MFD-12.3 WS3: Maps a requested edition ID to the actual edition ID served.
 * Only populated when the proxy returned a fallback substitution.
 * Example: "ur.jalandhry" -> "en.sahih"
 */
const fallbackMap = new Map<string, string>();

/** MFD-12.3 WS4 Gap 2: Cache of gating metadata for editions that returned 403. */
const gatedCache = new Map<string, GatedMetadata>();

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

/**
 * MFD-12.3 WS3: Returns true when the given requested edition ID was served
 * via a transparent fallback substitution.
 */
export function isFallback(requestedId: string): boolean {
  return fallbackMap.has(requestedId);
}

/**
 * MFD-12.3 WS3: Returns the actual edition ID being served for a requested ID.
 * When no fallback is active, returns the requested ID unchanged.
 */
export function getActualEdition(requestedId: string): string {
  return fallbackMap.get(requestedId) ?? requestedId;
}

/**
 * MFD-12.3 WS3: Clear the fallback mapping for a requested edition.
 * Called when the user switches to a non-gated edition or when enforcement
 * is lifted, allowing the original preference to be restored transparently.
 */
export function clearFallback(requestedId: string): void {
  fallbackMap.delete(requestedId);
}

/** Whether a translation is already cached (checks actual edition). */
export function isLoaded(id: string): boolean {
  const actualId = getActualEdition(id);
  return cache.has(actualId);
}

/** Get cached translation map, or undefined if not yet loaded. */
export function getCached(id: string): TranslationMap | undefined {
  const actualId = getActualEdition(id);
  return cache.get(actualId);
}

/**
 * MFD-12.3 WS4 Gap 2: Check whether an edition was previously found to be gated.
 * Returns the gating metadata if so, or undefined if the edition is not known
 * to be gated (it may still be unloaded).
 */
export function getGatedMetadata(id: string): GatedMetadata | undefined {
  return gatedCache.get(id);
}

/**
 * MFD-12.3 WS4 Gap 2: Check whether an edition is known to be gated.
 */
export function isGated(id: string): boolean {
  return gatedCache.has(id);
}

/** Look up one verse in a cached translation (resolves fallback). */
export function getVerse(
  id: string,
  surah: number,
  ayah: number
): string | null {
  const actualId = getActualEdition(id);
  const map = cache.get(actualId);
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

      // MFD-12.3 WS4 Gap 2: Parse JSON on non-200 responses to detect
      // structured GatedResponse from the rights-gate. The server returns
      // { gated: true, ... } with status 403 for gated editions.
      if (!res.ok) {
        const contentType = res.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          try {
            const body = await res.json();
            if (body && typeof body === "object" && body.gated === true) {
              // Store gating metadata so the UI can render a link-out card.
              gatedCache.set(id, {
                gated: true,
                reason: body.reason ?? "unknown",
                editionId: body.editionId ?? id,
                externalUrl: body.externalUrl ?? "",
                message: body.message ?? "This edition is unavailable.",
              });
              notify();
            }
          } catch {
            // JSON parse failed on error response; fall through to generic error.
          }
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const text = await res.text();
      const map = parseTanzilText(text);

      // MFD-12.3 WS3: Detect fallback metadata from proxy response headers.
      // The proxy sets X-Fallback-Requested-Id when serving a substitution.
      const actualId = res.headers.get("X-Translation-Id") ?? id;
      const fallbackRequested = res.headers.get("X-Fallback-Requested-Id");

      if (fallbackRequested && actualId !== id) {
        // Record that this requested ID is being served by a different actual ID.
        // This preserves the user's saved preference while accurately tracking
        // what content is actually displayed.
        fallbackMap.set(fallbackRequested, actualId);
      } else if (!fallbackRequested && actualId === id) {
        // MFD-12.3 WS3 Edge case: If we previously had a fallback for this ID
        // but now the server returns it directly (e.g., enforcement lifted),
        // clear the stale fallback mapping so the preference is restored.
        fallbackMap.delete(id);
      }

      // Cache under the ACTUAL edition ID to avoid duplicate storage
      cache.set(actualId, map);
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