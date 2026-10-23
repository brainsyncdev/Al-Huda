import type { NextRequest } from "next/server";
import {
  TRANSLATIONS,
  getTranslationsByLanguage,
} from "@/lib/quran/translations";
import { apiOk, contentProvenance, guarded } from "@/lib/api/v1";

// GET /api/v1/translations (PRD §14).
//
// Catalog metadata only: this endpoint names the editions the app can read and
// the ids accepted by `edition` on /api/v1/search. It does not serve edition
// text. Text is fetched on demand from Tanzil.net through
// /api/translations/{id} (the browser-facing proxy) and, server-side, by the
// search modules. Licensing and permitted use remain with each publisher —
// the catalog records ids and languages, not redistribution rights.
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  return guarded(request, () => {
    const editions = TRANSLATIONS.map((t) => ({
      id: t.id,
      name: t.name,
      language: t.language,
      languageLabel: t.languageLabel,
      direction: t.direction ?? "ltr",
      /** Text endpoint for this edition (proxied from Tanzil.net). */
      textEndpoint: `/api/translations/${t.id}`,
    }));

    const byLanguage = Object.entries(getTranslationsByLanguage())
      .map(([language, list]) => ({
        language,
        languageLabel: list[0]?.languageLabel ?? language,
        count: list.length,
      }))
      .sort((a, b) => a.languageLabel.localeCompare(b.languageLabel));

    return apiOk(
      { editions, languages: byLanguage, count: editions.length },
      {
        provenance: contentProvenance(),
        notes: [
          "This endpoint publishes catalog metadata only. Edition text is fetched from Tanzil.net on demand and is never bundled with the app.",
          "An id appearing here means the app can request that edition, not that its licence permits redistribution. Consult each publisher's terms before redistributing text.",
          "Classical tafsir editions (ar.jalalayn, ar.muyassar) are listed on the same footing as translations because they are read through the same text proxy; they are interpretation, not translation.",
        ],
      }
    );
  });
}