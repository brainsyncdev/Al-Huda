import { DEFAULT_LOCALE, isLocale } from "./locales";
import type { Locale } from "./types";

/**
 * Locale preference storage.
 *
 * The app's existing persistence posture is localStorage-only: no cookies,
 * no account, no server copy. The UI locale follows the same rule and uses a
 * separate versioned key so it can evolve independently of reader prefs.
 */
export const LOCALE_STORAGE_KEY = "alhuda.locale.v1";

/** Validate an arbitrary stored value. Invalid values resolve to English. */
export function resolveLocale(raw: unknown): Locale {
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

/** Read the stored locale, or null when unset/unavailable (SSR, private mode). */
export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    return isLocale(raw) ? raw : null;
  } catch {
    return null;
  }
}

/** Persist the locale. Silently ignores unavailable storage. */
export function writeStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Storage may be unavailable (private mode, quota). The in-memory locale
    // still applies for this session.
  }
}

/**
 * Resolve the initial locale in this order: stored preference, browser
 * language, default. Used only on the client after hydration.
 */
export function resolveInitialLocale(
  stored: unknown,
  browserTag?: string
): Locale {
  if (isLocale(stored)) return stored;
  if (browserTag) {
    const base = browserTag.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return DEFAULT_LOCALE;
}

/**
 * Set the NEXT_LOCALE cookie so SSR picks up the user's choice on the next
 * request. Client-side only — silently no-ops during SSR.
 */
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  try {
    const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `NEXT_LOCALE=${locale}; path=/; expires=${expires}; SameSite=Lax`;
  } catch {
    // Silently fail if cookies are unavailable
  }
}