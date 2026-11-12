import { resolveServerLocale } from "./server";
import { dictionaries } from "./dictionaries";
import { translate } from "./translate";
import type { TranslationParams } from "./types";
import { DEFAULT_LOCALE } from "./locales";

/**
 * Server-side translation function.
 * 
 * Usage in server components:
 * ```ts
 * const t = await getServerTranslation();
 * const text = t("reader.save");
 * ```
 */
export async function getServerTranslation(): Promise<(key: string, params?: TranslationParams) => string> {
  const locale = await resolveServerLocale();
  const dict = dictionaries[locale];
  const fallback = dictionaries[DEFAULT_LOCALE];
  
  return (key: string, params?: TranslationParams) => {
    return translate(dict, locale, key, params, { fallback });
  };
}
