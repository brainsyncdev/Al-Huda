import type { NextRequest } from "next/server";
import { getAyah, getSurah } from "@/lib/quran/data";
import { getJuzForAyah } from "@/lib/quran/juz";
import { RELATION_TYPE_LABELS, getTopic, TOPICS } from "@/lib/topics/data";
import {
  apiError,
  apiOk,
  contentProvenance,
  guarded,
  toApiAyah,
} from "@/lib/api/v1";

// GET /api/v1/topics/{slug}/ayahs — the verses behind a topic's relations.
//
// Resolution happens here rather than in the caller so that an unresolvable
// curated reference is reported instead of silently vanishing: a count that
// overstates what the endpoint actually returns would be the same class of
// defect the topic page was fixed to avoid.
export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  return guarded(request, () => {
    const topic = getTopic(slug);
    if (!topic) {
      return apiError(
        "topic_not_found",
        `No curated topic is registered under the slug ${JSON.stringify(slug)}.`,
        404,
        `Known slugs: ${TOPICS.map((t) => t.slug).join(", ")}.`
      );
    }

    const verses: Array<Record<string, unknown>> = [];
    const unresolved: Array<Record<string, unknown>> = [];

    for (const relation of topic.relations) {
      const verse = getAyah(relation.ref.surah, relation.ref.ayah);
      const meta = getSurah(relation.ref.surah);
      if (!verse || !meta) {
        unresolved.push({
          reference: `${relation.ref.surah}:${relation.ref.ayah}`,
          type: relation.type,
          reason: "not-present-in-pinned-dataset",
        });
        continue;
      }
      verses.push({
        ...toApiAyah(verse, getJuzForAyah(verse.surah, verse.ayah)),
        surahTransliteration: meta.transliteration,
        surahSlug: meta.slug,
        url: `/ayah/${verse.surah}/${verse.ayah}`,
        relation: {
          type: relation.type,
          typeLabel: RELATION_TYPE_LABELS[relation.type],
          rationale: relation.rationale,
        },
      });
    }

    return apiOk(
      { slug: topic.slug, title: topic.title, verses },
      {
        curatedCount: topic.relations.length,
        resolvedCount: verses.length,
        unresolved,
        provenance: contentProvenance(),
        notes: [
          "Verses are rendered verbatim from the pinned dataset; the relation rationale is editorial copy and is not tafsir.",
          "Any entry in `unresolved` is a data-integrity defect in the editorial selection, not a missing verse.",
        ],
      }
    );
  });
}