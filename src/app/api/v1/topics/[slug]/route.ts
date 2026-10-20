import type { NextRequest } from "next/server";
import {
  LANGUAGE_LABELS,
  RELATION_TYPE_LABELS,
  getTopic,
  relationProvenance,
  TOPICS,
} from "@/lib/topics/data";
import { apiError, apiOk, contentProvenance, guarded } from "@/lib/api/v1";

// GET /api/v1/topics/{slug} — one topic with typed relations and its full
// provenance record (FR-021, FR-022, FR-073). Each relation reports its
// effective provenance (relation-level override or topic-level inheritance)
// with an `inherited` flag stating which one it is.
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

    return apiOk(
      {
        slug: topic.slug,
        title: topic.title,
        arabicTitle: topic.arabicTitle,
        language: topic.language,
        languageLabel: LANGUAGE_LABELS[topic.language] ?? topic.language,
        summary: topic.summary,
        related: topic.related,
        relations: topic.relations.map((r) => {
          const effective = relationProvenance(r, topic);
          return {
            reference: `${r.ref.surah}:${r.ref.ayah}`,
            surah: r.ref.surah,
            ayah: r.ref.ayah,
            type: r.type,
            typeLabel: RELATION_TYPE_LABELS[r.type],
            rationale: r.rationale,
            provenance: {
              method: effective.method,
              curator: effective.curator,
              reviewedAt: effective.reviewedAt,
              status: effective.status,
              inherited: r.provenance === undefined,
            },
          };
        }),
        provenance: {
          method: topic.provenance.method,
          curator: topic.provenance.curator,
          reviewedAt: topic.provenance.reviewedAt,
          status: topic.provenance.status,
        },
        url: `/topics/${topic.slug}`,
      },
      {
        curatedVerseCount: topic.relations.length,
        provenance: contentProvenance(),
        notes: [
          "Rationales are descriptive editorial copy about what a verse addresses. They are not interpretation.",
          "Relation provenance is the effective review record; `inherited: true` means the relation has no individual review record and reports the topic-level one.",
          "Quran text is not included on this endpoint; fetch it from /api/v1/ayahs/{surah}/{ayah} or /api/v1/topics/{slug}/ayahs.",
        ],
      }
    );
  });
}
