// Server-only: search across the two classical tafsir editions readable
// in-app (al-Jalalayn and al-Muyassar). Both are Arabic texts served through
// the translation proxy; this module is a thin convenience wrapper over
// translation-search that runs the query against both editions and merges
// the hits into a single ranked list.
//
// Used by /api/v1/search/tafsir and by the search page's "Search tafsir"
// mode. Nothing here is interpretation — the hits are literal substring
// matches in the tafsir text, labeled as such.

import { searchTranslationEdition, type TranslationSearchHit } from "./translation-search";

/** The two tafsir editions the app can read through the translation proxy. */
export const TAFSIR_EDITION_IDS = ["ar.jalalayn", "ar.muyassar"] as const;
export type TafsirEditionId = (typeof TAFSIR_EDITION_IDS)[number];

export interface TafsirHit extends TranslationSearchHit {
  editionId: TafsirEditionId;
  editionName: string;
}

export interface TafsirSearchResults {
  query: string;
  hits: TafsirHit[];
  totalScanned: number;
  editionsSearched: { id: TafsirEditionId; name: string; loadError: boolean }[];
}

/**
 * Search both tafsir editions for the query and return a merged list of hits,
 * ordered by surah then ayah (mushaf order). Each hit carries the edition it
 * came from so the UI can label provenance.
 */
export async function searchTafsir(
  query: string,
  limit = 100
): Promise<TafsirSearchResults> {
  const editionsSearched: TafsirSearchResults["editionsSearched"] = [];
  const merged: TafsirHit[] = [];
  let totalScanned = 0;

  for (const id of TAFSIR_EDITION_IDS) {
    const result = await searchTranslationEdition(id, query, limit);
    if (!result) continue;
    editionsSearched.push({
      id,
      name: result.edition.name,
      loadError: result.loadError,
    });
    if (result.loadError) continue;
    totalScanned += result.totalScanned;
    for (const hit of result.hits) {
      merged.push({ ...hit, editionId: id, editionName: result.edition.name });
    }
  }

  // Mushaf order: surah asc, ayah asc. Stable sort preserves the per-edition
  // ordering within ties.
  merged.sort((a, b) =>
    a.surah === b.surah ? a.ayah - b.ayah : a.surah - b.surah
  );

  return {
    query,
    hits: merged.slice(0, limit),
    totalScanned,
    editionsSearched,
  };
}
