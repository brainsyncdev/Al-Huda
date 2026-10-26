import { en } from "./en";
import { ur } from "./ur";
import { ar } from "./ar";
import type { Locale } from "../types";
import type { Dictionary } from "../types";

/**
 * Locale -> dictionary map.
 * English is the fallback: if a key is missing in another locale, the
 * translate() function falls through to en before rendering anything.
 */
export const dictionaries: Record<Locale, Dictionary> = {
  en: en as unknown as Dictionary,
  ur: ur as unknown as Dictionary,
  ar: ar as unknown as Dictionary,
};

export { en } from "./en";
export { ur } from "./ur";
export { ar } from "./ar";
export type { TranslationKey } from "./en";
