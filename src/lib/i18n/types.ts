/**
 * i18n type definitions.
 *
 * The English dictionary is the source of truth for the key surface. Other
 * locales are typed against it, so a missing key is a compile-time error.
 */

export type Locale = "en" | "ur" | "ar" | "zh";

export type Direction = "ltr" | "rtl";

export interface LocaleConfig {
  /** Stable BCP-47 identifier used in storage and `lang` attributes. */
  code: Locale;
  /** English name, used in documentation and admin surfaces. */
  name: string;
  /** Name in the language's own script, shown in the selector. */
  nativeName: string;
  dir: Direction;
  isDefault: boolean;
}

export type PluralCategory =
  | "zero"
  | "one"
  | "two"
  | "few"
  | "many"
  | "other";

/** A string, or a set of plural forms keyed by CLDR plural category. */
export type TranslationValue = string | Partial<Record<PluralCategory, string>>;

export type TranslationParams = Record<string, string | number>;

export type Dictionary = Record<string, TranslationValue>;