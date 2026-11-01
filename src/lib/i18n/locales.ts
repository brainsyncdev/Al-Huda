import type { Locale, LocaleConfig } from "./types";

/**
 * The typed locale registry. Adding a language means adding one entry here,
 * one dictionary file, and one import in `dictionaries/index.ts`. No routing
 * changes are required (see SPRINT-36-REPORT.md for the routing decision).
 */
export const LOCALES: readonly LocaleConfig[] = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    dir: "ltr",
    isDefault: true,
  },
  {
    code: "ur",
    name: "Urdu",
    nativeName: "اردو",
    dir: "rtl",
    isDefault: false,
  },
  {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    dir: "rtl",
    isDefault: false,
  },
  {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    dir: "ltr",
    isDefault: false,
  },
] as const;

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_CODES: readonly Locale[] = LOCALES.map((l) => l.code);

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && LOCALE_CODES.includes(value as Locale)
  );
}

export function getLocaleConfig(locale: Locale): LocaleConfig {
  const found = LOCALES.find((l) => l.code === locale);
  if (!found) {
    throw new Error(`Unknown locale: ${locale}`);
  }
  return found;
}

export function directionOf(locale: Locale): "ltr" | "rtl" {
  return getLocaleConfig(locale).dir;
}

/** Best-effort match against a browser language tag (e.g. "ur-PK"). */
export function matchBrowserLocale(tag: string | undefined): Locale | null {
  if (!tag) return null;
  const base = tag.toLowerCase().split("-")[0];
  return isLocale(base) ? base : null;
}