"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale, TranslationParams } from "./types";
import { DEFAULT_LOCALE, getLocaleConfig, directionOf } from "./locales";
import { dictionaries } from "./dictionaries";
import { translate, formatNumber, formatDate } from "./translate";
import {
  readStoredLocale,
  writeStoredLocale,
  resolveInitialLocale,
  setLocaleCookie,
} from "./storage";

interface I18nContextValue {
  locale: Locale;
  dir: "ltr" | "rtl";
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: TranslationParams) => string;
  n: (value: number) => string;
  d: (
    value: Date | number | string,
    options?: Intl.DateTimeFormatOptions
  ) => string;
  hydrated: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/**
 * Root i18n provider.
 *
 * Accepts an optional `initialLocale` from server-side resolution to avoid
 * hydration mismatch. Falls back to client-side resolution if not provided.
 *
 * Resolution order on first render (when no initialLocale):
 *   1. Stored preference (localStorage)
 *   2. Browser language tag (navigator.language)
 *   3. Default locale (English)
 *
 * The document's `lang` and `dir` attributes are kept in sync so screen
 * readers and search engines see the correct values.
 */
export function I18nProvider({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale ?? DEFAULT_LOCALE
  );
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // If we have a server-resolved locale, use it directly
    if (initialLocale) {
      setLocaleState(initialLocale);
      setHydrated(true);
      return;
    }

    // Otherwise, resolve client-side
    const browserTag =
      typeof navigator !== "undefined" ? navigator.language : undefined;
    const stored = readStoredLocale();
    const resolved = resolveInitialLocale(stored, browserTag);
    setLocaleState(resolved);
    setHydrated(true);
  }, [initialLocale]);

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.lang = locale;
    root.dir = directionOf(locale);
  }, [locale, hydrated]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    writeStoredLocale(next);
    setLocaleCookie(next);
  }, []);

  const value = useMemo<I18nContextValue>(() => {
    const dict = dictionaries[locale];
    const fallback = dictionaries[DEFAULT_LOCALE];

    return {
      locale,
      dir: directionOf(locale),
      setLocale,
      hydrated,
      t: (key: string, params?: TranslationParams) =>
        translate(dict, locale, key, params, { fallback }),
      n: (v: number) => formatNumber(v, locale),
      d: (v: Date | number | string, opts?: Intl.DateTimeFormatOptions) =>
        formatDate(v, locale, opts),
    };
  }, [locale, setLocale, hydrated]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * Access the i18n context. Throws if used outside I18nProvider.
 */
export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

/**
 * Convenience hook: returns the `t` function bound to the active locale.
 */
export function useTranslation() {
  return useI18n().t;
}

/**
 * Returns the locale config for the active locale (name, nativeName, dir).
 */
export function useLocaleConfig() {
  const { locale } = useI18n();
  return getLocaleConfig(locale);
}
