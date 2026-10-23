import type { NextRequest } from "next/server";
import { searchTafsir } from "@/lib/quran/tafsir-search";
import {
  apiError,
  apiOk,
  boundedInt,
  contentProvenance,
  guarded,
} from "@/lib/api/v1";

// GET /api/v1/search/tafsir?q=...&limit=...&offset=...
//
// Searches the two classical Arabic tafsir editions readable in-app
// (al-Jalalayn and al-Muyassar) for the query. Returns merged hits in mushaf
// order, each labeled with the edition it came from.
//
// This is a convenience endpoint; the same results are obtainable by calling
// /api/v1/search?edition=ar.jalalayn and /api/v1/search?edition=ar.muyassar
// separately. It exists so the search page can offer a single "Search tafsir"
// mode without two round trips.
export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 200;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;
const MAX_OFFSET = 1_000;

export async function GET(request: NextRequest) {
  return guarded(request, async () => {
    const sp = request.nextUrl.searchParams;

    const q = (sp.get("q") ?? "").trim();
    if (!q) {
      return apiError("missing_query", "The q parameter is required.", 400);
    }
    if (q.length < 2) {
      return apiError(
        "query_too_short",
        "Queries must be at least 2 characters.",
        400
      );
    }
    if (q.length > MAX_QUERY_LENGTH) {
      return apiError(
        "query_too_long",
        `Queries are limited to ${MAX_QUERY_LENGTH} characters.`,
        400
      );
    }

    const rawLimit = sp.get("limit");
    const limit =
      rawLimit === null ? DEFAULT_LIMIT : boundedInt(rawLimit, 1, MAX_LIMIT);
    if (limit === null) {
      return apiError(
        "invalid_limit",
        `limit must be an integer between 1 and ${MAX_LIMIT}.`,
        400,
        `Received ${JSON.stringify(rawLimit)}.`
      );
    }

    const rawOffset = sp.get("offset");
    const offset =
      rawOffset === null ? 0 : boundedInt(rawOffset, 0, MAX_OFFSET);
    if (offset === null) {
      return apiError(
        "invalid_offset",
        `offset must be an integer between 0 and ${MAX_OFFSET}.`,
        400,
        `Received ${JSON.stringify(rawOffset)}.`
      );
    }

    // Fetch enough hits to cover the requested page; the underlying searcher
    // caps per-edition at `limit`, so we ask for limit+offset to cover the
    // slice we need after slicing.
    const results = await searchTafsir(q, offset + limit);
    const page = results.hits.slice(offset, offset + limit);

    return apiOk(
      {
        query: q,
        results: page.map((hit) => ({
          reference: `${hit.surah}:${hit.ayah}`,
          surah: hit.surah,
          ayah: hit.ayah,
          surahTransliteration: hit.surahTransliteration,
          url: `/ayah/${hit.surah}/${hit.ayah}`,
          text: hit.text,
          snippet: hit.snippet,
          edition: {
            id: hit.editionId,
            name: hit.editionName,
          },
        })),
      },
      {
        limit,
        offset,
        returned: page.length,
        truncated: results.hits.length > offset + limit,
        totalScanned: results.totalScanned,
        editionsSearched: results.editionsSearched,
        provenance: contentProvenance(),
        notes: [
          "Tafsir search matches literal substrings in the classical Arabic exegesis of al-Jalalayn and al-Muyassar after Arabic normalization. It is not a semantic or thematic search.",
          "A match does not imply the verse 'means' the query; tafsir is interpretation by qualified scholarship. These hits are pointers into the texts, not summaries.",
          "Editions are fetched from Tanzil.net on first use and cached in process memory. If one edition is unreachable, the other is still searched; the editionsSearched array reports which succeeded.",
        ],
      }
    );
  });
}
