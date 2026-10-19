// Unit tests for ayah reference parsing and formatting.
//
// Pins the ACTUAL behavior of parseReference(), including two documented
// limitations that are NOT bugs to fix in Release 1.1:
//   1. Bare surah names without the "al-"/"an-" prefix (e.g. "baqarah")
//      do NOT resolve because the dataset slug is "al-baqarah".
//   2. Concatenated name+number without a space (e.g. "al-baqarah153")
//      does NOT parse because the name regex excludes digits from group 1
//      and the optional ayah group requires leading whitespace.
// Captured here so future changes to parse semantics are deliberate.

import { describe, expect, it } from "vitest";
import { getSurahIndex } from "./data";
import {
  ayahPath,
  formatRef,
  parseReference,
  refLabel,
  surahPath,
} from "./reference";

describe("formatRef", () => {
  it("produces canonical surah:ayah form", () => {
    expect(formatRef({ surah: 2, ayah: 255 })).toBe("2:255");
    expect(formatRef({ surah: 1, ayah: 1 })).toBe("1:1");
    expect(formatRef({ surah: 114, ayah: 6 })).toBe("114:6");
  });
});

describe("refLabel", () => {
  it("uses the provided transliteration when given", () => {
    expect(refLabel({ surah: 2, ayah: 255 }, "Al-Baqarah")).toBe("Al-Baqarah 255");
  });

  it("looks up the surah name from the dataset when omitted", () => {
    expect(refLabel({ surah: 1, ayah: 7 })).toBe("Al-Fatihah 7");
    expect(refLabel({ surah: 114, ayah: 6 })).toBe("An-Nas 6");
  });

  it("falls back to numeric form for an unknown surah", () => {
    expect(refLabel({ surah: 999, ayah: 1 })).toBe("999:1");
  });
});

describe("ayahPath / surahPath", () => {
  it("generates correct ayah routes", () => {
    expect(ayahPath({ surah: 2, ayah: 255 })).toBe("/ayah/2/255");
    expect(ayahPath({ surah: 114, ayah: 6 })).toBe("/ayah/114/6");
  });

  it("surahPath uses the provided slug when given", () => {
    expect(surahPath(2, "al-baqarah")).toBe("/quran/al-baqarah");
  });

  it("surahPath resolves the slug from the dataset when omitted", () => {
    expect(surahPath(2)).toBe("/quran/al-baqarah");
    expect(surahPath(114)).toBe("/quran/an-nas");
  });

  it("surahPath falls back to numeric id for an unknown surah", () => {
    expect(surahPath(999)).toBe("/quran/999");
  });
});

describe("parseReference - numeric forms", () => {
  it("accepts colon, dot, hyphen, and space separators", () => {
    expect(parseReference("2:255")).toEqual({ surah: 2, ayah: 255, kind: "numeric" });
    expect(parseReference("2.255")).toEqual({ surah: 2, ayah: 255, kind: "numeric" });
    expect(parseReference("2-255")).toEqual({ surah: 2, ayah: 255, kind: "numeric" });
    expect(parseReference("2 255")).toEqual({ surah: 2, ayah: 255, kind: "numeric" });
  });

  it("accepts surah-only numeric references", () => {
    expect(parseReference("36")).toEqual({ surah: 36, kind: "numeric" });
    expect(parseReference("1")).toEqual({ surah: 1, kind: "numeric" });
    expect(parseReference("114")).toEqual({ surah: 114, kind: "numeric" });
  });

  it("trims surrounding whitespace", () => {
    expect(parseReference("  2:255  ")).toEqual({ surah: 2, ayah: 255, kind: "numeric" });
  });

  it("rejects out-of-range surah numbers", () => {
    expect(parseReference("0:1")).toBeNull();
    expect(parseReference("115:1")).toBeNull();
    expect(parseReference("999:1")).toBeNull();
    expect(parseReference("0")).toBeNull();
    expect(parseReference("115")).toBeNull();
  });

  it("rejects zero or negative ayah numbers", () => {
    expect(parseReference("2:0")).toBeNull();
  });

  it("does NOT validate ayah bounds (documented limitation)", () => {
    // 2:287 parses successfully even though Al-Baqarah has only 286 ayat.
    // The caller must use getAyah() to confirm existence.
    const ref = parseReference("2:287");
    expect(ref).toEqual({ surah: 2, ayah: 287, kind: "numeric" });
  });
});

describe("parseReference - name forms", () => {
  it("resolves exact dataset slugs", () => {
    expect(parseReference("al-baqarah")).toEqual({ surah: 2, kind: "name" });
    expect(parseReference("an-nas")).toEqual({ surah: 114, kind: "name" });
    expect(parseReference("al-fatihah")).toEqual({ surah: 1, kind: "name" });
  });

  it("resolves slug + space + ayah number", () => {
    expect(parseReference("al-baqarah 255")).toEqual({ surah: 2, ayah: 255, kind: "name" });
    expect(parseReference("an-nas 6")).toEqual({ surah: 114, ayah: 6, kind: "name" });
  });

  it("resolves every dataset slug (generated from the index)", () => {
    for (const meta of getSurahIndex()) {
      const ref = parseReference(meta.slug);
      expect(ref).not.toBeNull();
      expect(ref?.surah).toBe(meta.id);
      expect(ref?.kind).toBe("name");
    }
  });

  it("LIMITATION: bare names without al-/an- prefix return null", () => {
    expect(parseReference("baqarah")).toBeNull();
    expect(parseReference("baqarah 255")).toBeNull();
    expect(parseReference("nas")).toBeNull();
  });

  it("LIMITATION: concatenated name+number without space returns null", () => {
    expect(parseReference("al-baqarah153")).toBeNull();
    expect(parseReference("an-nas6")).toBeNull();
  });
});

describe("parseReference - invalid inputs", () => {
  it("returns null for empty or whitespace-only strings", () => {
    expect(parseReference("")).toBeNull();
    expect(parseReference("   ")).toBeNull();
  });

  it("returns null for arbitrary non-reference text", () => {
    expect(parseReference("helloworld")).toBeNull();
    expect(parseReference("!!!")).toBeNull();
    expect(parseReference("2:255:extra")).toBeNull();
    expect(parseReference("abc:def")).toBeNull();
  });

  it("returns null for Arabic text (not a reference format)", () => {
    expect(parseReference("\u0627\u0644\u0628\u0642\u0631\u0629")).toBeNull();
  });
});