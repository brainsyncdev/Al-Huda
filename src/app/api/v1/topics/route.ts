import type { NextRequest } from "next/server";
import { LANGUAGE_LABELS, TOPICS } from "@/lib/topics/data";
import { apiOk, contentProvenance, guarded } from "@/lib/api/v1";

// GET /api/v1/topics — curated topic index (PRD §14, §9 Topic entity).
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return guarded(request, () => {
    const topics = TOPICS.map((t) => ({
      slug: t.slug,
      title: t.title,
      arabicTitle: t.arabicTitle,
      language: t.language,
      languageLabel: LANGUAGE_LABELS[t.language] ?? t.language,
      summary: t.summary,
      curatedVerseCount: t.relations.length,
      related: t.related,
      editorialStatus: t.provenance.status,
      url: `/topics/${t.slug}`,
    }));

    return apiOk(
      { topics },
      {
        count: topics.length,
        provenance: contentProvenance(),
        notes: [
          "Topics are editorial selections of well-known ayat, not tafsir and not rulings.",
          "Every entry carries its editorial review status; none has completed scholarly review in this release.",
        ],
      }
    );
  });
}