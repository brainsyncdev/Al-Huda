import type { NextRequest } from "next/server";
import { getSurah } from "@/lib/quran/data";
import { getJuzForAyah } from "@/lib/quran/juz";
import {
  apiError,
  apiOk,
  boundedInt,
  contentProvenance,
  guarded,
  invalidSurahError,
  toApiAyah,
  toApiSurahMeta,
} from "@/lib/api/v1";

// GET /api/v1/surahs/{surahNumber} — metadata plus every ayah, in canonical
// order, verbatim from the pinned dataset (PRD §9 Surah entity).
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surahNumber: string }> }
) {
  const { surahNumber } = await params;

  return guarded(request, () => {
    const id = boundedInt(surahNumber, 1, 114);
    if (id === null) return invalidSurahError(surahNumber);

    const surah = getSurah(id);
    if (!surah) {
      return apiError(
        "surah_not_found",
        `Surah ${id} is not present in the pinned dataset.`,
        404
      );
    }

    return apiOk(
      {
        ...toApiSurahMeta(surah),
        ayat: surah.ayat.map((a) => toApiAyah(a, getJuzForAyah(a.surah, a.ayah))),
      },
      { provenance: contentProvenance() }
    );
  });
}