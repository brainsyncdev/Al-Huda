import type { NextRequest } from "next/server";
import { getAyah, getSurah } from "@/lib/quran/data";
import { getJuzForAyah } from "@/lib/quran/juz";
import {
  crossReferencesForAyah,
  CROSS_REFERENCE_DESCRIPTIONS,
  CROSS_REFERENCE_LABELS,
} from "@/lib/quran/cross-references";
import { topicsForAyah } from "@/lib/topics/data";
import {
  apiError,
  apiOk,
  boundedInt,
  contentProvenance,
  guarded,
  invalidAyahError,
  invalidSurahError,
  toApiAyah,
  toApiSurahMeta,
} from "@/lib/api/v1";

// GET /api/v1/ayahs/{surahNumber}/{ayahNumber} — one stable ayah reference with
// its text, edition metadata, and the graph edges that hang off it (PRD §9).
export const dynamic = "force-dynamic";

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
      // The 404 states the real bound so a caller can correct the reference
      // rather than guess at it.
      return apiError(
        "ayah_not_found",
        `Surah ${surah} does not contain ayah ${ayah}.`,
        404,
        meta ? `Surah ${surah} (${meta.transliteration}) has ${meta.ayahCount} ayat.` : undefined
      );
    }

    const crossRefs = crossReferencesForAyah({ surah, ayah });
    const topics = topicsForAyah({ surah, ayah });

    return apiOk(
      {
        ...toApiAyah(verse, getJuzForAyah(surah, ayah)),
        // Nested under a distinct key: `surah` and `ayah` stay integers so the
        // payload matches the §9 Ayah entity ("Surah number, ayah number").
        surahInformation: toApiSurahMeta(meta),
        url: `/ayah/${surah}/${ayah}`,
        crossReferences: crossRefs.map((x) => ({
          target: `${x.target.surah}:${x.target.ayah}`,
          relation: x.relation,
          relationLabel: CROSS_REFERENCE_LABELS[x.relation],
          description: CROSS_REFERENCE_DESCRIPTIONS[x.relation],
          evidence: x.evidence,
          reviewStatus: x.reviewStatus,
        })),
        topics: topics.map((t) => ({
          slug: t.slug,
          title: t.title,
          language: t.language,
          reviewStatus: t.provenance.status,
        })),
      },
      {
        provenance: contentProvenance(),
        // Scope note travels with the payload so a consumer cannot mistake a
        // wording-identity edge for a thematic or legal relationship.
        crossReferenceScope:
          "Identical Arabic wording within the same surah only. Derived from the dataset; nothing here is a thematic, causal, or legal claim.",
        topicScope:
          "Curated editorial selections. Topic membership is not tafsir and carries the review status shown on each entry.",
      }
    );
  });
}