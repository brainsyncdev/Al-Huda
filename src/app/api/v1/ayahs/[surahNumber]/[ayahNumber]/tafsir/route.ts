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
// This endpoint returns an availability record, not the exegesis itself. Two
// classical Arabic tafsirs (al-Jalalayn, al-Muyassar) are readable in the app
// through the translation proxy (`/api/translations/{id}`), which is where the
// text is served from. This route names those editions and the outbound
// publishers, and it never fabricates text or implies a corpus was searched
// when it was not (PRD §2 principle 3).
export const dynamic = "force-dynamic";

/** Tafsir editions readable through the translation proxy. */
const READABLE_EDITIONS = [
  { translationId: "ar.jalalayn", sourceId: "tafsir-jalalayn" },
  { translationId: "ar.muyassar", sourceId: "tafsir-muyassar" },
];

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
        /** False: no tafsir corpus is vendored; text is fetched on demand. */
        bundled: false,
        /** Text is readable in-app for the editions below, via the proxy. */
        displayMode: "in-app-text-plus-external-links",
        readableEditions: READABLE_EDITIONS.map((e) => ({
          ...e,
          textEndpoint: `/api/translations/${e.translationId}`,
        })),
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
          "This endpoint serves no tafsir text. The works listed above are link records; their licensing and permitted display remain with the publishers (FR-032).",
          "The two readable editions above are fetched from Tanzil.net on demand through the translation proxy. They can be searched with /api/v1/search?edition={id}; that endpoint returns matched excerpts from the edition, not summaries or generated commentary.",
          "Interpretation is left to qualified scholarship and reviewed tafsir editions. Consult the linked publisher editions rather than treating this record as exegesis.",
        ],
      }
    );
  });
}