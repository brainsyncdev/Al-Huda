import type {
  Dictionary,
  Locale,
  PluralCategory,
  TranslationParams,
  TranslationValue,
} from "./types";

/** Replace `{name}` placeholders. Unknown placeholders are left intact. */
export function interpolate(
  template: string,
  params?: TranslationParams
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) => {
    const value = params[name];
    return value === undefined ? match : String(value);
  });
}

/**
 * Choose a plural form for `count`.
 *
 * Falls back through CLDR category -> other -> one. Returning an empty string
 * is preferable to leaking a key or a raw object into the UI.
 */
export function selectPlural(
  value: TranslationValue,
  count: number,
  locale: Locale
): string {
  if (typeof value === "string") return value;
  let category: PluralCategory = "other";
  try {
    category = new Intl.PluralRules(locale).select(count) as PluralCategory;
  } catch {
    category = "other";
  }
  return value[category] ?? value.other ?? value.one ?? "";
}

export interface TranslateOptions {
  /** Fallback dictionary (normally English). */
  fallback?: Dictionary;
  /** When true, missing keys are reported to the console in development. */
  reportMissing?: boolean;
}

/**
 * Translate a key.
 *
 * - Missing keys fall back to the fallback dictionary, then to an empty string.
 *   A raw key is never rendered to the user.
 * - If `params.count` is present and the value is a plural object, the CLDR
 *   plural category for the active locale is selected.
 */
export function translate(
  dictionary: Dictionary,
  locale: Locale,
  key: string,
  params?: TranslationParams,
  options: TranslateOptions = {}
): string {
  const { fallback, reportMissing = process.env.NODE_ENV !== "production" } =
    options;

  let value = dictionary[key];
  if (value === undefined && fallback) {
    value = fallback[key];
    if (value !== undefined && reportMissing) {
      console.warn(
        `[i18n] Missing "${key}" in "${locale}"; using English fallback.`
      );
    }
  }

  if (value === undefined) {
    if (reportMissing) {
      console.warn(`[i18n] Missing translation key "${key}".`);
    }
    return "";
  }

  const count = params?.count;
  const text =
    typeof count === "number"
      ? selectPlural(value, count, locale)
      : typeof value === "string"
        ? value
        : (value.other ?? value.one ?? "");

  return interpolate(text, params);
}

/** Locale-aware number formatting for counts (not references). */
export function formatNumber(value: number, locale: Locale): string {
  try {
    return new Intl.NumberFormat(locale).format(value);
  } catch {
    return String(value);
  }
}

/** Locale-aware date formatting. Accepts a Date, epoch ms, or ISO string. */
export function formatDate(
  value: Date | number | string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  }
): string {
  const date =
    value instanceof Date
      ? value
      : new Date(typeof value === "number" ? value : value);
  if (Number.isNaN(date.getTime())) return "";
  try {
    return new Intl.DateTimeFormat(locale, options).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}