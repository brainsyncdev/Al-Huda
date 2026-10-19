import { NextResponse } from "next/server";
import { getVerseOfDay } from "@/lib/quran/verse-of-day";

// The homepage is statically generated for SEO, so the verse of the day must
// NOT be baked in at build time — it would freeze until the next rebuild and
// every visitor would read the same verse for days or weeks. This route
// resolves the verse per request from the pinned dataset and is consumed by
// the client-side verse card on the home page.
//
// Same source of truth as every other page: no separate copy of the text, no
// fabricated reference. If the curated list ever yields an out-of-range
// reference, this returns `verse: null` and the UI shows an honest fallback
// rather than inventing content.
export const dynamic = "force-dynamic";

export async function GET() {
  const result = getVerseOfDay();

  if (!result) {
    return NextResponse.json({ verse: null });
  }

  return NextResponse.json({
    verse: {
      surah: result.surah,
      ayah: result.ayah,
      surahTransliteration: result.surahTransliteration,
      surahArabicName: result.surahArabicName,
      arabic: result.verse.arabic,
      translation: result.verse.translation,
    },
  });
}
