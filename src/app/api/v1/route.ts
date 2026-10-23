import type { NextRequest } from "next/server";
import { API_VERSION, apiOk, contentProvenance, guarded } from "@/lib/api/v1";

// Service index for the public read-only API (PRD §14). Self-documenting so a
// researcher can discover the surface without reading the repository.
export const dynamic = "force-dynamic";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/surahs",
    description:
      "All 114 surahs: canonical number, slug, Arabic name, transliteration, English meaning, revelation type, verse count. Reads only the dataset index.",
  },
  {
    method: "GET",
    path: "/api/v1/surahs/{surahNumber}",
    description:
      "One surah: metadata plus every ayah in canonical order, verbatim from the pinned dataset.",
  },
  {
    method: "GET",
    path: "/api/v1/ayahs/{surahNumber}/{ayahNumber}",
    description:
      "One ayah: stable reference, Arabic, translation, transliteration, juz, edition metadata, plus its derived cross-references and topic memberships.",
  },
  {
    method: "GET",
    path: "/api/v1/ayahs/{surahNumber}/{ayahNumber}/tafsir",
    description:
      "Tafsir availability for one ayah. No tafsir corpus is vendored; this lists the editions readable in-app through the translation proxy plus outbound link records (FR-031, FR-032).",
  },
  {
    method: "GET",
    path: "/api/v1/search?q={query}&limit={n}&offset={n}&language={ar|en}&edition={id}",
    description:
      "Normalized search across reference, Arabic, translation, transliteration and surah metadata. Paginated; each hit carries why it matched and a highlighted snippet where the match was in the translation. With `edition`, searches that one translation or tafsir edition instead of the built-in text.",
  },
  {
    method: "GET",
    path: "/api/v1/search/tafsir?q={query}&limit={n}&offset={n}",
    description:
      "Searches both classical Arabic tafsirs readable in-app (al-Jalalayn and al-Muyassar) in one pass. Hits are literal substring matches labeled with their edition, not interpretation.",
  },
  {
    method: "GET",
    path: "/api/v1/translations",
    description:
      "Catalog of translation and tafsir editions readable in-app: id, translator or publisher, language, text direction. Edition ids are the values accepted by `edition` on /api/v1/search.",
  },
  {
    method: "GET",
    path: "/api/v1/topics",
    description:
      "Curated topic index: slug, titles, language, editorial status and curated verse count.",
  },
  {
    method: "GET",
    path: "/api/v1/topics/{slug}",
    description:
      "One topic including typed relations, rationales and full provenance record.",
  },
  {
    method: "GET",
    path: "/api/v1/topics/{slug}/ayahs",
    description:
      "Verses for a topic, resolved against the dataset. References that fail to resolve are listed rather than silently dropped.",
  },
  {
    method: "GET",
    path: "/api/v1/sources",
    description:
      "Source catalog: name, attribution, publisher, license, pinned version, ingestion method and permitted-use notes (FR-032, FR-075).",
  },
  {
    method: "GET",
    path: "/api/v1/explore/dimensions",
    description:
      "The 10 life dimensions from PRD §04.3 with topic-level navigation mappings. Each dimension lists curated topic slugs whose themes overlap the dimension's description. This is a navigation aid, not ayat-level tagging.",
  },
  {
    method: "GET",
    path: "/api/v1/explore/dimensions/{id}",
    description:
      "One dimension with resolved topic metadata. Returns the dimension's title, Arabic label, coverage description, search terms, and the curated topics mapped to it. Unresolved topic slugs are reported rather than silently dropped.",
  },
  {
    method: "GET",
    path: "/api/v1/graph",
    description:
      "Knowledge-graph foundation (PRD §12.3): typed dimension and topic nodes plus DIMENSION_TOPIC and TOPIC_RELATION edges, each carrying relationship scope, provenance and review status. No ayah-level dimension tags are emitted; unresolved slugs are reported.",
  },
] as const;

export async function GET(request: NextRequest) {
  return guarded(request, () =>
    apiOk(
      {
        name: "Al-Huda public read-only API",
        version: API_VERSION,
        endpoints: ENDPOINTS,
        provenance: contentProvenance(),
      },
      {
        notes: [
          "Read-only. There are no mutating endpoints on this surface.",
          "All verse text is served verbatim from a pinned, version-recorded dataset; nothing is generated, translated, or edited in transit.",
          "Topics are editorial selections and are labelled with their review status. They are not tafsir and not rulings.",
          "No tafsir text is vendored. Classical tafsir editions are fetched from the publisher (Tanzil.net) at request time and cached; edition-scoped search returns matched excerpts, never summaries or generated commentary.",
          "No user data exists on this surface. Library state (bookmarks, notes, revision history) is stored in the reader's own browser and never reaches a server.",
          "Rate limiting is a best-effort per-process fairness brake keyed on a client-supplied header. Durable enforcement belongs at the CDN or edge and is a deployment requirement, not a property of this code.",
          "Juz numbers follow the canonical Hafs an Asim scheme. Page numbers are not published here because they have not been verified against a specific printed mushaf.",
        ],
      }
    )
  );
}