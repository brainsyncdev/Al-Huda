import type { NextRequest } from "next/server";
import { SOURCES } from "@/lib/quran/sources";
import { apiOk, guarded } from "@/lib/api/v1";

// GET /api/v1/sources — the source catalog as machine-readable records
// (FR-032 permitted use, FR-075 rights/status, PRD §9 SourceRecord).
//
// Not among §14's example endpoints, but §14 is explicitly an initial proposal
// and persona 6 (researcher/developer) is defined by wanting "stable
// references, structured data, provenance". Serving the same catalog the
// /sources page renders avoids two descriptions of rights drifting apart.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return guarded(request, () => {
    const sources = SOURCES.map((s) => ({
      id: s.id,
      provides: s.provides,
      attribution: s.attribution,
      publisher: s.publisher,
      language: s.language ?? "multiple/unspecified",
      license: s.license,
      licenseUrl: s.licenseUrl ?? null,
      homepage: s.homepage,
      version: s.version,
      /** "package" = content is bundled from a pinned artifact;
       *  "link" = outbound reference only, no content redistributed. */
      method: s.method,
      redistributesContent: s.method === "package",
      notes: s.notes ?? null,
    }));

    return apiOk(
      { sources },
      {
        count: sources.length,
        bundled: sources.filter((s) => s.redistributesContent).length,
        linkOnly: sources.filter((s) => !s.redistributesContent).length,
        notes: [
          "Records with method='link' are references only. No tafsir text is stored or served by this application.",
          "Checksums and ingestion/validation status are not yet recorded per artifact (FR-072); see docs/DATA-PROVENANCE.md for the current provenance state and the rejected-source register.",
        ],
      }
    );
  });
}