import type { NextRequest } from "next/server";
import { apiOk, apiError, guarded } from "@/lib/api/v1";
import { getDimension, getAllDimensions, DIMENSION_PROVENANCE } from "@/lib/explore/dimensions";
import { getTopic } from "@/lib/topics/data";

// GET /api/v1/explore/dimensions/[id] — one dimension with resolved topics.
export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  return guarded(request, async () => {
    const { id } = await params;
    const dim = getDimension(id);
    if (!dim) {
      return apiError(
        "not_found",
        "Dimension not found",
        404,
        `Available ids: ${getAllDimensions()
          .map((d) => d.id)
          .join(", ")}. Received ${JSON.stringify(id)}.`
      );
    }

    // Resolve mapped topics. A topic slug that does not exist is reported
    // rather than silently dropped.
    const resolvedTopics = dim.topicSlugs
      .map((slug) => {
        const topic = getTopic(slug);
        if (!topic) return null;
        return {
          slug: topic.slug,
          title: topic.title,
          arabicTitle: topic.arabicTitle,
          summary: topic.summary,
          relationCount: topic.relations.length,
          status: topic.provenance.status,
        };
      })
      .filter((t): t is NonNullable<typeof t> => Boolean(t));

    const unresolvedSlugs = dim.topicSlugs.filter((slug) => !getTopic(slug));

    return apiOk(
      {
        dimension: {
          number: dim.number,
          id: dim.id,
          title: dim.title,
          arabicTitle: dim.arabicTitle,
          covers: dim.covers,
          description: dim.description,
          searchTerms: dim.searchTerms,
        },
        topics: resolvedTopics,
        unresolvedSlugs,
        provenance: DIMENSION_PROVENANCE,
      },
      {
        notes: [
          "Dimensions are a topic-level navigation aid, not ayat-level tags.",
          "Individual ayat have not been tagged to dimensions.",
          "The topics listed are curated starting points whose themes overlap the dimension's description.",
          "All mappings are pending scholarly review.",
        ],
      }
    );
  });
}