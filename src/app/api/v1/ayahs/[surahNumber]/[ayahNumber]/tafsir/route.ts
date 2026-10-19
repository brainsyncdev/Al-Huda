import type { NextRequest } from "next/server";
import { getAyah, getSurah } from "@/lib/quran/data";
import { SOURCES } from "@/lib/quran/sources";
import {
  apiError,
  apiOk,
  boundedInt,
  contentProvenance,
  guarded,
  invalidAyahError,
  invalidSurahError,
} from "@/lib/api/v1";

// GET /api/v1/ayahs/{surahNumber}/{ayahNumber}/tafsir (PRD §14).
//
// This endpoint CANNOT return exegesis. The source catalog records that tafsir
// is link-out only — "No tafsir text is displayed or stored locally" — so the
// honest response is an availability record plus outbound links. Fabricating
// tafsir text, or returning an empty `entries` array that implies a corpus was
// searched, would both misrepresent the product (PRD §2 principle 3).
export const dynamic = "force-dynamic";

/** Tafsir works the catalog knows about, i.e. link-method records. */
const TAFSIR_WORKS = SOURCES.filter(
  (s) => s.method === "link" && s.id.startsWith("tafsir-")
);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ surahNumber: string; ayahNumber: string }> }
) {
  const { surahNumber, ayahNumber } = await params;

  return guarded(request, () => {
    const surah = boundedInt(surahNumber, 1, 114);
    if (surah === null) return invalidSurahError(surahNumber);

    const ayah = boundedInt(ayahNumber, 1, 9_999);
    if (ayah === null) return invalidAyahError(ayahNumber);

    const verse = getAyah(surah, ayah);
    const meta = getSurah(surah);
    if (!verse || !meta) {
      return apiError(
        "ayah_not_found",
        `Surah ${surah} does not contain ayah ${ayah}.`,
        404,
        meta ? `Surah ${surah} (${meta.transliteration}) has ${meta.ayahCount} ayat.` : undefined
      );
    }

    return apiOk(
      {
        reference: `${surah}:${ayah}`,
        surah: { number: meta.id, transliteration: meta.transliteration },
        /** False by construction: no tafsir corpus is bundled or licensed. */
        bundled: false,
        /** How the app relates to tafsir content (FR-031). */
        displayMode: "link-to-external-source",
        works: TAFSIR_WORKS.map((w) => ({
          id: w.id,
          work: w.provides,
          author: w.attribution,
          publisher: w.publisher,
          language: w.language ?? "unspecified",
          edition: w.version,
          license: w.license,
          homepage: w.homepage,
          permittedUse: w.notes ?? w.license,
        })),
      },
      {
        provenance: contentProvenance(),
        notes: [
          "No tafsir text is served by this API. The works listed above are link records; their licensing and permitted display remain with the publishers (FR-032).",
          "Interpretation is left to qualified scholarship and reviewed tafsir editions. Consult the linked publisher editions rather than treating this record as exegesis.",
        ],
      }
    );
  });
}