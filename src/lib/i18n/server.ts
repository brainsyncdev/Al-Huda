import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, isLocale, matchBrowserLocale } from "./locales";
import type { Locale } from "./types";

/**
 * Server-side locale resolution.
 *
 * Resolution order:
 *   1. NEXT_LOCALE cookie (user's explicit choice, persisted)
 *   2. Accept-Language header (browser preference)
 *   3. Default locale (English)
 *
 * Always returns a validated locale from the supported list.
 */
export async function resolveServerLocale(): Promise<Locale> {
  // 1. Check cookie first (highest priority - user's explicit choice)
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");
  if (localeCookie?.value && isLocale(localeCookie.value)) {
    return localeCookie.value;
  }

  // 2. Fall back to Accept-Language header
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language");
  if (acceptLanguage) {
    // Parse the first language tag (e.g., "en-US,en;q=0.9,ur;q=0.8")
    const primary = acceptLanguage.split(",")[0]?.trim();
    const matched = matchBrowserLocale(primary);
    if (matched) {
      return matched;
    }
  }

  // 3. Fall back to default
  return DEFAULT_LOCALE;
}
