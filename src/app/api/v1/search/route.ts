import type { NextRequest } from "next/server";
import {
  findSnippetRange,
  searchQuran,
  type MatchReason,
} from "@/lib/quran/search";
import {
  REASON_DESCRIPTIONS,
  REASON_LABELS,
} from "@/lib/quran/match-reasons";
import { apiError, apiOk, boundedInt, contentProvenance, guarded } from "@/lib/api/v1";

// GET /api/v1/search?q=...&limit=...&offset=...&language=... (PRD §14).
//
// Pagination note: searchQuran stops scanning once it has filled its limit, so
// the true result count is unknowable without a full scan. Rather than
// publishing a fabricated `total`, this endpoint reports `returned` and
// `truncated` and lets the caller page until truncated is false.
export const dynamic = "force-dynamic";

const MAX_QUERY_LENGTH = 200;
const DEFAULT_LIMIT = 25;
const MAX_LIMIT = 100;
const MAX_OFFSET = 5_000;
/** Hard ceiling on how many hits a single request may materialise. */
const SCAN_CAP = 500;

/** Reasons that constitute a match in Arabic verse text. */
const ARABIC_REASONS = new Set<MatchReason>(["arabic"]);
/** Reasons that constitute a match in Latin/English fields or surah metadata. */
const ENGLISH_REASONS = new Set<MatchReason>([
  "translation",
  "transliteration",
  "surah-name",
]);

export async function GET(request: NextRequest) {
  return guarded(request, () => {
    const sp = request.nextUrl.searchParams;

    const q = (sp.get("q") ?? "").trim();
    if (!q) {
      return apiError("missing_query", "The q parameter is required.", 400);
    }
    if (q.length < 2) {
      return apiError(
        "query_too_short",
        "Queries must be at least 2 characters.",
        400
      );
    }
    if (q.length > MAX_QUERY_LENGTH) {
      return apiError(
        "query_too_long",
        `Queries are limited to ${MAX_QUERY_LENGTH} characters.`,
        400
      );
    }

    const rawLimit = sp.get("limit");
    const limit =
      rawLimit === null ? DEFAULT_LIMIT : boundedInt(rawLimit, 1, MAX_LIMIT);
    if (limit === null) {
      return apiError(
        "invalid_limit",
        `limit must be an integer between 1 and ${MAX_LIMIT}.`,
        400,
        `Received ${JSON.stringify(rawLimit)}.`
      );
    }

    const rawOffset = sp.get("offset");
    const offset =
      rawOffset === null ? 0 : boundedInt(rawOffset, 0, MAX_OFFSET);
    if (offset === null) {
      return apiError(
        "invalid_offset",
        `offset must be an integer between 0 and ${MAX_OFFSET}.`,
        400,
        `Received ${JSON.stringify(rawOffset)}.`
      );
    }

    const rawLanguage = sp.get("language");
    let language: "ar" | "en" | null = null;
    if (rawLanguage !== null && rawLanguage !== "") {
      if (rawLanguage !== "ar" && rawLanguage !== "en") {
        return apiError(
          "invalid_language",
          "language must be 'ar' or 'en'.",
          400,
          `Received ${JSON.stringify(rawLanguage)}.`
        );
      }
      language = rawLanguage;
    }

    // Ask for exactly as many hits as this page needs, bounded by SCAN_CAP.
    const requested = Math.min(offset + limit, SCAN_CAP);
    const results = searchQuran(q, { limit: requested });

    const allowed = (reason: MatchReason): boolean => {
      if (language === null) return true;
      // A parsed reference is not language-dependent, so it survives any filter.
      if (reason === "reference") return true;
      return language === "ar"
        ? ARABIC_REASONS.has(reason)
        : ENGLISH_REASONS.has(reason);
    };

    const filtered = results.hits.filter((h) => allowed(h.reason));
    const page = filtered.slice(offset, offset + limit);
    const hitCapReached = requested >= SCAN_CAP && results.hits.length >= requested;
    const truncated =
      filtered.length > offset + limit || (hitCapReached && page.length === limit);

    return apiOk(
      {
        query: q,
        reference: results.reference
          ? {
              surah: results.reference.surah,
              ayah: results.reference.ayah ?? null,
              kind: results.reference.kind,
            }
          : null,
        referenceOutOfRange: results.referenceOutOfRange,
        results: page.map((hit) => {
          const snippet =
            hit.reason === "translation" ? findSnippetRange(hit.translation, q) : null;
          return {
            reference: `${hit.surah}:${hit.ayah}`,
            surah: hit.surah,
            ayah: hit.ayah,
            surahTransliteration: hit.surahTransliteration,
            surahSlug: hit.surahSlug,
            url: `/ayah/${hit.surah}/${hit.ayah}`,
            arabic: hit.arabic,
            translation: hit.translation,
            transliteration: hit.transliteration,
            match: {
              reason: hit.reason,
              label: REASON_LABELS[hit.reason],
              description: REASON_DESCRIPTIONS[hit.reason],
            },
            // Null when the literal query does not appear in the raw
            // translation (e.g. only a normalized form matched); the full
            // translation is always present above, so nothing is lost.
            snippet,
          };
        }),
      },
      {
        language: language ?? "any",
        limit,
        offset,
        returned: page.length,
        truncated,
        scanCap: SCAN_CAP,
        totalScanned: results.totalScanned,
        provenance: contentProvenance(),
        notes: [
          "No total count is published: the searcher stops at its limit, so an exact total would require a full corpus scan per request.",
          "Arabic matching strips diacritics and unifies letter variants for lookup only; the Arabic returned is verbatim from the pinned dataset.",
          "language=ar restricts to Arabic-text matches; language=en restricts to translation, transliteration and surah-metadata matches. Reference matches are always included.",
          "A surah-name match indicates the query hit surah metadata, not the verse text; those ayat are entry points into the surah.",
        ],
      }
    );
  });
}