import { NextResponse } from "next/server";
import { getSuggestions } from "@/lib/search/autocomplete";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/search/suggestions?q=...
 *
 * Returns autocomplete suggestions as JSON. Local-only and deterministic,
 * drawing exclusively on canonical surah names, curated topic titles, and
 * Quran references validated by the existing reference parser. No search
 * history is stored, no queries are tracked, and no AI or external services
 * are involved.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const suggestions = getSuggestions(query);

  return NextResponse.json({ suggestions });
}
