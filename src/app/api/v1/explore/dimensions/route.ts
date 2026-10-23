import type { NextRequest } from "next/server";
import { apiOk, guarded } from "@/lib/api/v1";
import { getAllDimensions, DIMENSION_PROVENANCE } from "@/lib/explore/dimensions";

// GET /api/v1/explore/dimensions — list all 10 dimensions with topic mappings.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return guarded(request, () =>
    apiOk(
      {
        dimensions: getAllDimensions().map((d) => ({
          number: d.number,
          id: d.id,
          title: d.title,
          arabicTitle: d.arabicTitle,
          covers: d.covers,
          description: d.description,
          topicSlugs: d.topicSlugs,
          searchTerms: d.searchTerms,
        })),
        provenance: DIMENSION_PROVENANCE,
      },
      {
        notes: [
          "Dimensions are a topic-level navigation aid, not ayat-level tags.",
          "Individual ayat have not been tagged to dimensions.",
          "The mapping connects each dimension's theme to existing editorial topic selections.",
          "All mappings are pending scholarly review.",
        ],
      }
    )
  );
}