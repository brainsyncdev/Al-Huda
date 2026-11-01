import { describe, it, expect } from "vitest";
import { interpolate, selectPlural, translate, formatNumber } from "./translate";
import { LOCALES, DEFAULT_LOCALE, isLocale, getLocaleConfig, directionOf, matchBrowserLocale } from "./locales";
import { resolveLocale, resolveInitialLocale } from "./storage";
import { dictionaries } from "./dictionaries";
import type { Locale } from "./types";

describe("i18n locale registry", () => {
  it("has four initial locales", () => {
    expect(LOCALES).toHaveLength(4);
    expect(LOCALES.map((l) => l.code)).toEqual(["en", "ur", "ar", "zh"]);
  });

  it("marks English as default", () => {
    expect(DEFAULT_LOCALE).toBe("en");
    const def = LOCALES.find((l) => l.isDefault);
    expect(def?.code).toBe("en");
  });

  it("assigns correct directions", () => {
    expect(directionOf("en")).toBe("ltr");
    expect(directionOf("ur")).toBe("rtl");
    expect(directionOf("ar")).toBe("rtl");
    expect(directionOf("zh")).toBe("ltr");
  });

  it("validates locale codes", () => {
    expect(isLocale("en")).toBe(true);
    expect(isLocale("ur")).toBe(true);
    expect(isLocale("ar")).toBe(true);
    expect(isLocale("zh")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
    expect(isLocale(42)).toBe(false);
    expect(isLocale("")).toBe(false);
  });

  it("returns locale config", () => {
    const cfg = getLocaleConfig("ur");
    expect(cfg.name).toBe("Urdu");
    expect(cfg.nativeName).toBe("اردو");
    expect(cfg.dir).toBe("rtl");
  });

  it("matches browser locale tags", () => {
    expect(matchBrowserLocale("en-US")).toBe("en");
    expect(matchBrowserLocale("ur-PK")).toBe("ur");
    expect(matchBrowserLocale("ar-SA")).toBe("ar");
    expect(matchBrowserLocale("zh-CN")).toBe("zh");
    expect(matchBrowserLocale("zh-TW")).toBe("zh");
    expect(matchBrowserLocale("fr-FR")).toBeNull();
    expect(matchBrowserLocale(undefined)).toBeNull();
  });
});

describe("i18n storage", () => {
  it("resolves valid locale", () => {
    expect(resolveLocale("en")).toBe("en");
    expect(resolveLocale("ur")).toBe("ur");
    expect(resolveLocale("ar")).toBe("ar");
    expect(resolveLocale("zh")).toBe("zh");
  });

  it("falls back to default for invalid values", () => {
    expect(resolveLocale("fr")).toBe("en");
    expect(resolveLocale(null)).toBe("en");
    expect(resolveLocale(undefined)).toBe("en");
    expect(resolveLocale(42)).toBe("en");
    expect(resolveLocale("")).toBe("en");
  });

  it("resolves initial locale with stored preference", () => {
    expect(resolveInitialLocale("ur")).toBe("ur");
    expect(resolveInitialLocale("ar", "en-US")).toBe("ar");
  });

  it("falls back to browser tag when no stored preference", () => {
    expect(resolveInitialLocale(null, "ur-PK")).toBe("ur");
    expect(resolveInitialLocale(undefined, "ar")).toBe("ar");
    expect(resolveInitialLocale(null, "zh-CN")).toBe("zh");
  });

  it("falls back to default when nothing matches", () => {
    expect(resolveInitialLocale(null, "fr-FR")).toBe("en");
    expect(resolveInitialLocale(null)).toBe("en");
  });
});

describe("i18n translate", () => {
  it("interpolates placeholders", () => {
    expect(interpolate("Hello {name}", { name: "World" })).toBe("Hello World");
    expect(interpolate("{a} + {b} = {c}", { a: 1, b: 2, c: 3 })).toBe(
      "1 + 2 = 3"
    );
  });

  it("leaves unknown placeholders intact", () => {
    expect(interpolate("Hello {name}", {})).toBe("Hello {name}");
  });

  it("returns template when no params", () => {
    expect(interpolate("Hello")).toBe("Hello");
  });

  it("selects plural forms", () => {
    const value = { one: "{count} item", other: "{count} items" };
    // selectPlural picks the CLDR category; interpolation happens in translate()
    expect(selectPlural(value, 1, "en")).toBe("{count} item");
    expect(selectPlural(value, 5, "en")).toBe("{count} items");
  });

  it("translates a key from dictionary", () => {
    const dict = dictionaries.en;
    const result = translate(dict, "en", "common.loading");
    expect(result).toBe("Loading…");
  });

  it("interpolates during translation", () => {
    const dict = dictionaries.en;
    const result = translate(dict, "en", "quran.juz", { number: 3 });
    expect(result).toBe("Juz 3");
  });

  it("falls back to English for missing keys", () => {
    const dict = { "common.loading": "لوڈ ہو رہا ہے" };
    const fallback = dictionaries.en;
    const result = translate(dict, "ur", "common.error", undefined, {
      fallback,
      reportMissing: false,
    });
    // "common.error" is missing from dict, falls back to en
    expect(result).toBe("Something went wrong");
  });

  it("returns empty string for completely missing keys", () => {
    const dict = {};
    const result = translate(dict, "en", "nonexistent.key", undefined, {
      reportMissing: false,
    });
    expect(result).toBe("");
  });
});

describe("i18n formatNumber", () => {
  it("formats numbers for English locale", () => {
    const result = formatNumber(1234, "en");
    expect(result).toMatch(/1[,.]?234/);
  });

  it("formats numbers for Arabic locale", () => {
    const result = formatNumber(1234, "ar");
    // Arabic may use Eastern Arabic numerals or Western depending on env
    expect(result.length).toBeGreaterThan(0);
  });
});

describe("i18n dictionary completeness", () => {
  const enKeys = Object.keys(dictionaries.en);

  it("English dictionary has keys", () => {
    expect(enKeys.length).toBeGreaterThan(100);
  });

  for (const locale of ["ur", "ar", "zh"] as Locale[]) {
    it(`${locale} dictionary covers all English keys`, () => {
      const dict = dictionaries[locale];
      const missing = enKeys.filter((k) => !(k in dict));
      if (missing.length > 0) {
        // Report first 10 missing keys
        throw new Error(
          `${locale} is missing ${missing.length} keys: ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? "…" : ""}`
        );
      }
    });
  }

  it("no English value is an empty string", () => {
    const empties = enKeys.filter(
      (k) => dictionaries.en[k] === ""
    );
    expect(empties).toEqual([]);
  });
});
