// Translation proxy. Tanzil.net does not send CORS headers, so the browser
// cannot fetch translations directly. This route fetches on behalf of the
// client, caches the response for 24 hours via Next's data cache, and returns
// the text with permissive CORS for the client loader.
//
// Source: https://tanzil.net/trans/{id} — plain text, one verse per line
// in the form "surah|ayah|text". Licensing: Tanzil terms of use.

import { NextResponse } from "next/server";
import { getTranslation } from "@/lib/quran/translations";

export const runtime = "nodejs";

const TANZIL_BASE = "https://tanzil.net/trans/";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Only serve IDs present in the catalog — prevents the route from being used
  // as an arbitrary fetch proxy.
  const meta = getTranslation(id);
  if (!meta) {
    return NextResponse.json(
      { error: `Unknown translation id: ${id}` },
      { status: 404 }
    );
  }

  try {
    const res = await fetch(`${TANZIL_BASE}${encodeURIComponent(id)}`, {
      headers: {
        "User-Agent": "Al-Huda Quran App (https://al-huda.app)",
        Accept: "text/plain",
      },
      next: { revalidate: 86400 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream returned ${res.status}` },
        { status: 502 }
      );
    }

    const text = await res.text();

    return new NextResponse(text, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Translation-Id": id,
        "X-Translation-Language": meta.language,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: `Failed to fetch translation: ${message}` },
      { status: 500 }
    );
  }
}
