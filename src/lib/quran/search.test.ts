// Unit tests for Quran search, normalization, and snippet offsets.
//
// The central PRD invariant under test: Arabic normalization exists ONLY for
// matching. Displayed text must come back byte-identical to the vendored
// dataset. Every assertion that touches Unicode is built from code points
// (String.fromCharCode / new RegExp with escaped ranges) so no Arabic literal
// has to survive a source-encoding round-trip to be meaningful.

import { describe, expect, it } from "vitest";
import { getAyah, getSurah } from "./data";
import {
  findSnippetRange,
  normalizeArabic,
  normalizeLatin,
  searchQuran,
} from "./search";

// --- Code-point helpers -----------------------------------------------------

const CP = {
  shadda: String.fromCharCode(0x0651),
  fathatan: String.fromCharCode(0x064b),
  tatweel: String.fromCharCode(0x0640),
  alefHamzaAbove: String.fromCharCode(0x0623),
  alefHamzaBelow: String.fromCharCode(0x0625),
  alefMadda: String.fromCharCode(0x0622),
  alefWasla: String.fromCharCode(0x0671),
  alef: String.fromCharCode(0x0627),
  alefMaqsura: String.fromCharCode(0x0649),
  ya: String.fromCharCode(0x064a),
  taMarbuta: String.fromCharCode(0x0629),
  ha: String.fromCharCode(0x0647),
  qaf: String.fromCharCode(0x0642),
  lam: String.fromCharCode(0x0644),
};

/** Same ranges normalizeArabic strips, assembled from escapes (ASCII source). */
const DIACRITICS = new RegExp("[\\u064B-\\u065F\\u0670\\u06D6-\\u06ED\\u0640]");
const HAS_ARABIC = new RegExp("[\\u0600-\\u06FF]");

describe("normalizeArabic", () => {
  it("removes harakat, Quranic annotation marks, and tatweel", () => {
    const raw = `${CP.qaf}${CP.lam}${CP.shadda}${CP.alef}${CP.fathatan}${CP.tatweel}`;
    const out = normalizeArabic(raw);
    expect(DIACRITICS.test(out)).toBe(false);
    expect(DIACRITICS.test(raw)).toBe(true);
  });

  it("unifies every alef variant onto plain alef", () => {
    for (const variant of [
      CP.alefMadda,
      CP.alefHamzaAbove,
      CP.alefHamzaBelow,
      CP.alefWasla,
    ]) {
      expect(normalizeArabic(variant)).toBe(CP.alef);
    }
    expect(normalizeArabic(CP.alef)).toBe(CP.alef);
  });

  it("maps alef maqsura to ya and ta marbuta to ha", () => {
    expect(normalizeArabic(CP.alefMaqsura)).toBe(CP.ya);
    expect(normalizeArabic(CP.taMarbuta)).toBe(CP.ha);
  });

  it("is idempotent", () => {
    const stored = getAyah(1, 1)?.arabic ?? "";
    const once = normalizeArabic(stored);
    expect(normalizeArabic(once)).toBe(once);
  });

  it("strips diacritics from real dataset text without touching the store",
    () => {
      const stored = getAyah(1, 1)?.arabic ?? "";
      expect(stored.length).toBeGreaterThan(0);
      expect(DIACRITICS.test(stored)).toBe(true);

      const normalized = normalizeArabic(stored);
      expect(normalized).not.toBe(stored);
      expect(DIACRITICS.test(normalized)).toBe(false);

      // The stored value is untouched by a normalization pass.
      expect(getAyah(1, 1)?.arabic).toBe(stored);
    });
});

describe("normalizeLatin", () => {
  it("lowercases, drops apostrophes, and neutralizes punctuation", () => {
    expect(normalizeLatin("Hello, world!")).toBe("hello world");
    expect(normalizeLatin("Ma'idah")).toBe("maidah");
    expect(normalizeLatin("  Spaced   Out  ")).toBe("spaced out");
  });

  it("preserves hyphens (they are part of dataset slugs)", () => {
    expect(normalizeLatin("Al-Baqarah")).toBe("al-baqarah");
    expect(normalizeLatin("Al-Ma'idah")).toBe("al-maidah");
  });

  it("is idempotent", () => {
    const once = normalizeLatin("Al-Ma'idah, The Cow!");
    expect(normalizeLatin(once)).toBe(once);
  });
});

describe("searchQuran - reference queries", () => {
  it("resolves 2:255 to exactly one hit flagged as a reference", () => {
    const r = searchQuran("2:255");
    expect(r.reference).toEqual({ surah: 2, ayah: 255, kind: "numeric" });
    expect(r.referenceOutOfRange).toBe(false);
    expect(r.hits).toHaveLength(1);
    expect(r.hits[0].reason).toBe("reference");
    expect(r.hits[0].surah).toBe(2);
    expect(r.hits[0].ayah).toBe(255);
    // Reference resolution short-circuits the corpus scan.
    expect(r.totalScanned).toBe(0);
  });

  it("returns hit content byte-identical to the loader (verbatim integrity)",
    () => {
      const stored = getAyah(2, 255);
      const hit = searchQuran("2:255").hits[0];
      expect(stored).not.toBeNull();
      expect(hit.arabic).toBe(stored?.arabic);
      expect(hit.translation).toBe(stored?.translation);
      expect(hit.transliteration).toBe(stored?.transliteration);

      const surah2 = getSurah(2);
      expect(hit.surahTransliteration).toBe(surah2?.transliteration);
      expect(hit.surahSlug).toBe(surah2?.slug);
    });

  it("flags an in-range surah with an out-of-range ayah instead of guessing",
    () => {
      const r = searchQuran("2:287"); // Al-Baqarah has 286 ayat
      expect(r.hits).toHaveLength(0);
      expect(r.referenceOutOfRange).toBe(true);
      expect(r.reference?.surah).toBe(2);

      const short = searchQuran("1:8"); // Al-Fatihah has 7 ayat
      expect(short.hits).toHaveLength(0);
      expect(short.referenceOutOfRange).toBe(true);
    });

  it("treats an out-of-range surah as a plain text query, not a reference",
    () => {
      const r = searchQuran("999:1");
      expect(r.reference).toBeNull();
      expect(r.hits).toHaveLength(0);
      expect(r.referenceOutOfRange).toBe(false);
    });

  it("accepts name+ayah references such as 'al-baqarah 255'", () => {
    const r = searchQuran("al-baqarah 255");
    expect(r.reference).toEqual({ surah: 2, ayah: 255, kind: "name" });
    expect(r.hits).toHaveLength(1);
    expect(r.hits[0].reason).toBe("reference");
    expect(r.hits[0].ayah).toBe(255);
  });

  it("expands a surah-only reference into its opening ayat", () => {
    const r = searchQuran("al-baqarah");
    expect(r.reference).toEqual({ surah: 2, kind: "name" });
    expect(r.hits.length).toBeGreaterThan(0);
    expect(r.hits.length).toBeLessThanOrEqual(3);
    for (const h of r.hits) {
      expect(h.surah).toBe(2);
      expect(h.reason).toBe("surah-name");
    }
    expect(r.hits.map((h) => h.ayah)).toEqual([1, 2, 3]);

    const numeric = searchQuran("36");
    expect(numeric.reference).toEqual({ surah: 36, kind: "numeric" });
    expect(numeric.hits.length).toBeGreaterThan(0);
    for (const h of numeric.hits) expect(h.surah).toBe(36);
  });
});

describe("searchQuran - text queries", () => {
  it("finds Arabic text via normalization and still returns verbatim Arabic",
    () => {
      const stored1 = getAyah(1, 1)?.arabic ?? "";
      const needle = normalizeArabic(stored1);
      const r = searchQuran(needle);

      // Arabic input never parses as a reference and never yields a Latin name
      // match, so every hit here must be an Arabic-text hit.
      expect(r.reference).toBeNull();
      expect(r.hits.length).toBeGreaterThan(0);
      expect(r.hits.some((h) => h.surah === 1 && h.ayah === 1)).toBe(true);

      for (const h of r.hits) {
        expect(h.reason).toBe("arabic");
        const stored = getAyah(h.surah, h.ayah);
        expect(stored).not.toBeNull();
        // Displayed text is verbatim; only the lookup copy is normalized.
        expect(h.arabic).toBe(stored?.arabic);
        expect(HAS_ARABIC.test(h.arabic)).toBe(true);
        // The matched 1:1 hit must still carry its original diacritics.
        if (h.surah === 1 && h.ayah === 1) {
          expect(DIACRITICS.test(h.arabic)).toBe(true);
        }
        expect(normalizeArabic(h.arabic)).toContain(needle);
      }
    });

  it("finds English translation words and labels the reason accurately",
    () => {
      const r = searchQuran("patience");
      expect(r.reference).toBeNull();
      expect(r.hits.length).toBeGreaterThan(0);
      expect(r.hits.some((h) => h.reason === "translation")).toBe(true);

      for (const h of r.hits) {
        const stored = getAyah(h.surah, h.ayah);
        expect(stored).not.toBeNull();
        expect(h.translation).toBe(stored?.translation);
        expect(h.arabic).toBe(stored?.arabic);
        if (h.reason === "translation") {
          expect(normalizeLatin(h.translation)).toContain("patience");
        }
      }
    });

  it("matches surah meaning text ('the cow')", () => {
    const r = searchQuran("the cow");
    expect(r.hits.length).toBeGreaterThan(0);
    expect(r.hits.some((h) => h.surah === 2 && h.reason === "surah-name")).toBe(
      true
    );
  });

  it("scans the whole corpus and reports the count when nothing matches",
    () => {
      const r = searchQuran("zzzzqqqq");
      expect(r.hits).toHaveLength(0);
      expect(r.reference).toBeNull();
      expect(r.totalScanned).toBe(6236);
    });

  it("honors the limit option and truncates deterministically", () => {
    const bounded = searchQuran("lord", { limit: 5 });
    const unbounded = searchQuran("lord");
    expect(bounded.hits.length).toBeLessThanOrEqual(5);
    expect(bounded.hits.length).toBeGreaterThan(0);
    expect(unbounded.hits.length).toBeGreaterThan(bounded.hits.length);
    expect(unbounded.hits.length).toBeLessThanOrEqual(50);
    // The bounded result is a prefix of the unbounded one (stable ordering).
    expect(bounded.hits.map((h) => `${h.surah}:${h.ayah}`)).toEqual(
      unbounded.hits.slice(0, bounded.hits.length).map((h) => `${h.surah}:${h.ayah}`)
    );
  });

  it("is deterministic across repeated calls", () => {
    const a = searchQuran("mercy").hits.map((h) => `${h.surah}:${h.ayah}:${h.reason}`);
    const b = searchQuran("mercy").hits.map((h) => `${h.surah}:${h.ayah}:${h.reason}`);
    expect(a.length).toBeGreaterThan(0);
    expect(a).toEqual(b);
  });

  it("echoes the trimmed query", () => {
    expect(searchQuran("  patience  ").query).toBe("patience");
  });

  it("rejects queries shorter than two characters without scanning", () => {
    for (const q of ["", " ", "a", "1"]) {
      const r = searchQuran(q);
      expect(r.hits).toHaveLength(0);
      expect(r.reference).toBeNull();
      expect(r.referenceOutOfRange).toBe(false);
      expect(r.totalScanned).toBe(0);
      expect(r.query).toBe(q.trim());
    }
  });
});

describe("findSnippetRange", () => {
  it("returns padded text whose offsets slice back to the literal",
    () => {
      const text = "And seek help through patience and prayer";
      const s = findSnippetRange(text, "patience", 5);
      expect(s).not.toBeNull();
      expect(s!.text.slice(s!.matchStart, s!.matchEnd)).toBe("patience");
      // Padded on both sides, so both ellipses are present.
      expect(s?.text.startsWith("\u2026")).toBe(true);
      expect(s?.text.endsWith("\u2026")).toBe(true);
      expect(s!.matchStart).toBeLessThan(s!.matchEnd);
    });

  it("omits ellipses at the string edges and preserves original casing",
    () => {
      const s = findSnippetRange("Patience is key", "Patience", 60);
      expect(s).not.toBeNull();
      expect(s?.matchStart).toBe(0);
      expect(s?.text.startsWith("\u2026")).toBe(false);
      expect(s?.text.endsWith("\u2026")).toBe(false);
      expect(s?.text).toBe("Patience is key");
      expect(s!.text.slice(s!.matchStart, s!.matchEnd)).toBe("Patience");
    });

  it("matches case-insensitively but slices the original text",
    () => {
      const s = findSnippetRange("Patience is key", "PATIENCE", 60);
      expect(s!.text.slice(s!.matchStart, s!.matchEnd)).toBe("Patience");
    });

  it("returns null when the literal is absent or the query is blank",
    () => {
      expect(findSnippetRange("Hello world", "zzzz")).toBeNull();
      expect(findSnippetRange("Hello world", "")).toBeNull();
      expect(findSnippetRange("Hello world", "   ")).toBeNull();
    });

  it("returns null when only a normalized form matched (punctuation differs)",
    () => {
      // Snippet matching is a literal search on the raw translation, so a
      // query that matched only after normalization has no highlight range.
      expect(findSnippetRange("the believers, and patience", "believers and")).toBeNull();
    });

  it("never exceeds the source length plus two ellipsis characters",
    () => {
      const text = getAyah(2, 255)?.translation ?? "";
      const s = findSnippetRange(text, "Allah", 40);
      if (s) {
        expect(s.text.length).toBeLessThanOrEqual(text.length + 2);
        expect(s.text.replace(/\u2026/g, "")).toBe(
          text.slice(
            Math.max(0, text.toLowerCase().indexOf("allah") - 40),
            Math.min(text.length, text.toLowerCase().indexOf("allah") + 5 + 40)
          )
        );
      }
    });
});