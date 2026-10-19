import type { NextRequest } from "next/server";
import { getSurahIndex } from "@/lib/quran/data";
import { apiOk, contentProvenance, guarded, toApiSurahMeta } from "@/lib/api/v1";

// GET /api/v1/surahs — the full 114-entry index (PRD §14).
//
// force-dynamic rather than prerendered: this is a cheap index.json read, and
// keeping it dynamic means a dataset bump is reflected immediately instead of
// being baked into the build. Cache-Control on the response covers the cost.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return guarded(request, () => {
    const surahs = getSurahIndex().map(toApiSurahMeta);
    const totalVerses = surahs.reduce((sum, s) => sum + s.verseCount, 0);

    return apiOk(
      { surahs },
      {
        count: surahs.length,
        // Computed from the dataset rather than asserted as a constant, so a
        // changed package surfaces a changed number instead of a false claim.
        totalVerses,
        provenance: contentProvenance(),
      }
    );
  });
}