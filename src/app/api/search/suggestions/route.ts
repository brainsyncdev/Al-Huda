import { NextResponse } from "next/server";
import { getSuggestions } from "@/lib/search/autocomplete";

/**
 * GET /api/search/suggestions?q=...
 *
 * Returns autocomplete suggestions as JSON. Local-only, deterministic,
 * drawn from canonical surah names, topic titles, and Quran references.
 * No analytics, no tracking, no AI-generated content.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";

  const suggestions = getSuggestions(query);

  return NextResponse.json({ suggestions });
}
