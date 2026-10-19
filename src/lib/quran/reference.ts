// Ayah reference parsing and formatting.
//
// Canonical reference form: "surah:ayah" (e.g. "2:255", "1:1", "114:6").
// Accepts common variants in user input: "2:255", "2.255", "2-255", "2 255",
// and surah-only references by number or name ("baqarah", "al-baqarah").
// This module never fabricates references — parse failures return null.

import type { AyahRef, ParsedReference } from "./types";
import { isValidSurah } from "./types";
import { getSurahIndex } from "./data";

/** Format a reference canonically, e.g. { surah: 2, ayah: 255 } -> "2:255". */
export function formatRef(ref: AyahRef): string {
  return `${ref.surah}:${ref.ayah}`;
}

/** Human-readable label, e.g. "Al-Baqarah 255". Falls back to numeric form. */
export function refLabel(ref: AyahRef, transliteration?: string): string {
  const name =
    transliteration ??
    getSurahIndex().find((s) => s.id === ref.surah)?.transliteration;
  return name ? `${name} ${ref.ayah}` : formatRef(ref);
}

/** Canonical route for an ayah reference page. */
export function ayahPath(ref: AyahRef): string {
  return `/ayah/${ref.surah}/${ref.ayah}`;
}

/** Canonical route for a surah page. */
export function surahPath(surahId: number, slug?: string): string {
  if (slug) return `/quran/${slug}`;
  const index = getSurahIndex();
  const meta = index.find((s) => s.id === surahId);
  return `/quran/${meta ? meta.slug : surahId}`;
}

const NUMERIC_REF = /^(\d{1,3})\s*[:.\-\s]\s*(\d{1,3})$/;
const SURAH_ONLY = /^\d{1,3}$/;

/** Parse a user-supplied reference string. Returns null when invalid.
 *  Never guesses or fabricates. NOTE: only the surah number is range-checked
 *  here (1-114); the ayah number is returned as-parsed WITHOUT validating it
 *  against the surah's actual verse count. Callers must confirm the ayah
 *  exists via getAyah() before using it. */
export function parseReference(input: string): ParsedReference | null {
  const q = input.trim();
  if (!q) return null;

  const numeric = NUMERIC_REF.exec(q);
  if (numeric) {
    const surah = Number(numeric[1]);
    const ayah = Number(numeric[2]);
    if (!isValidSurah(surah) || ayah < 1) return null;
    return { surah, ayah, kind: "numeric" };
  }

  if (SURAH_ONLY.test(q)) {
    const surah = Number(q);
    if (!isValidSurah(surah)) return null;
    return { surah, kind: "numeric" };
  }

  // Name-based: "baqarah 255", "al-baqarah 153", or just "baqarah".
  const nameMatch = /^([a-zA-Z' -]+?)(?:\s+(\d{1,3}))?$/.exec(q);
  if (nameMatch) {
    const slug = nameMatch[1]
      .toLowerCase()
      .replace(/[''`]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const meta = getSurahIndex().find((s) => s.slug === slug);
    if (!meta) return null;
    if (nameMatch[2] !== undefined) {
      const ayah = Number(nameMatch[2]);
      if (ayah < 1) return null;
      return { surah: meta.id, ayah, kind: "name" };
    }
    return { surah: meta.id, kind: "name" };
  }

  return null;
}
