// Translation proxy. Tanzil.net does not send CORS headers, so the browser
// cannot fetch translations directly. This route fetches on behalf of the
// client, caches the response for 24 hours via Next's data cache, and returns
// the text with permissive CORS for the client loader.
//
// Source: https://tanzil.net/trans/{id} — plain text, one verse per line
// in the form "surah|ayah|text". Licensing: Tanzil terms of use.

import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { getTranslation } from "@/lib/quran/translations";
import {
  isEditionGated,
  buildGatedResponse,
  resolveFallbackEdition,
} from "@/lib/quran/rights-gate";

export const runtime = "nodejs";

const TANZIL_BASE = "https://tanzil.net/trans/";

// MFD-12.3 WS3: Bundled editions ship inside quran-json chapter files
// (node_modules/quran-json/dist/chapters/en/{surah}.json). Each file carries
// the Saheeh International translation and Latin transliteration alongside
// the Uthmani Arabic text. When a bundled edition is requested we read from
// disk instead of hitting Tanzil, eliminating network dependency and keeping
// delivery fully offline-capable.
const QURAN_JSON_DIR = path.join(
  process.cwd(),
  "node_modules",
  "quran-json",
  "dist",
  "chapters",
  "en"
);

interface RawVerse {
  id: number;
  text: string;
  translation: string;
  transliteration: string;
}

/** Lazily loaded surah verse arrays keyed by 1-based surah id. */
const bundledCache = new Map<number, RawVerse[]>();

function loadSurahVerses(surahId: number): RawVerse[] | null {
  const cached = bundledCache.get(surahId);
  if (cached) return cached;
  try {
    const raw = fs.readFileSync(
      path.join(QURAN_JSON_DIR, `${surahId}.json`),
      "utf-8"
    );
    const parsed = JSON.parse(raw) as { verses?: RawVerse[] };
    if (!Array.isArray(parsed.verses)) return null;
    bundledCache.set(surahId, parsed.verses);
    return parsed.verses;
  } catch {
    return null;
  }
}

/**
 * Build the Tanzil plain-text format ("surah|ayah|text\n") for a bundled
 * edition directly from quran-json chapter files. Returns null when any
 * surah file fails to load (should never happen with a valid install).
 */
function buildBundledText(editionId: string): string | null {
  const lines: string[] = [];
  for (let s = 1; s <= 114; s++) {
    const verses = loadSurahVerses(s);
    if (!verses) return null;
    for (const v of verses) {
      const text =
        editionId === "en.transliteration" ? v.transliteration : v.translation;
      lines.push(`${s}|${v.id}|${text}`);
    }
  }
  return lines.join("\n");
}

const BUNDLED_EDITION_IDS = new Set(["en.sahih", "en.transliteration"]);

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

  // MFD-12.3 WS3: When a requested edition is gated, attempt transparent
  // fallback to a rights-cleared bundled edition. The user's preference is
  // preserved (not overwritten); only the displayed content changes.
  let effectiveId = id;
  let fallbackRequestedId: string | null = null;
  let fallbackReason: string | null = null;

  if (isEditionGated(id)) {
    const fallbackId = resolveFallbackEdition(id);
    if (fallbackId) {
      effectiveId = fallbackId;
      fallbackRequestedId = id;
      fallbackReason = "rights-under-review";

      // MFD-12.3 WS4 Gap 7: Audit log for fallback substitutions
      console.warn(
        JSON.stringify({
          event: "rights-gate-fallback",
          requestedEditionId: id,
          actualEditionId: fallbackId,
          language: meta.language,
          translationName: meta.name,
          timestamp: new Date().toISOString(),
          userAgent: _req.headers.get("user-agent") ?? "unknown",
          referer: _req.headers.get("referer") ?? null,
          reason: fallbackReason,
        })
      );
    } else {
      // No fallback available — log and return structured gating response
      console.warn(
        JSON.stringify({
          event: "rights-gate-blocked",
          editionId: id,
          language: meta.language,
          translationName: meta.name,
          timestamp: new Date().toISOString(),
          userAgent: _req.headers.get("user-agent") ?? "unknown",
          referer: _req.headers.get("referer") ?? null,
          reason: "rights-under-review",
        })
      );
      return NextResponse.json(buildGatedResponse(id), { status: 403 });
    }
  }

  // Resolve metadata for the effective (possibly fallback) edition
  const effectiveMeta = getTranslation(effectiveId);
  if (!effectiveMeta) {
    // Should never happen if FALLBACK_CHAIN only contains valid IDs
    return NextResponse.json(
      { error: `Internal error: fallback edition ${effectiveId} not in catalog` },
      { status: 500 }
    );
  }

  // Build response headers — include fallback metadata when applicable
  const headers: Record<string, string> = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    "X-Translation-Id": effectiveId,
    "X-Translation-Language": effectiveMeta.language,
  };

  // MFD-12.3 WS3: Signal to the client that this is a fallback substitution
  if (fallbackRequestedId) {
    headers["X-Fallback-Requested-Id"] = fallbackRequestedId;
    headers["X-Fallback-Reason"] = fallbackReason!;
  }

  // MFD-12.3 WS3: Bundled editions are read from quran-json chapter files on
  // disk rather than fetched from Tanzil. This guarantees availability and
  // avoids network dependency for rights-cleared content.
  if (BUNDLED_EDITION_IDS.has(effectiveId)) {
    const text = buildBundledText(effectiveId);
    if (!text) {
      return NextResponse.json(
        { error: `Failed to read bundled edition ${effectiveId} from quran-json` },
        { status: 500 }
      );
    }
    return new NextResponse(text, { status: 200, headers });
  }

  // Non-bundled editions still transit the Tanzil proxy (only reachable when
  // enforcement is off or the edition has been explicitly cleared).
  try {
    const res = await fetch(`${TANZIL_BASE}${encodeURIComponent(effectiveId)}`, {
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
    return new NextResponse(text, { status: 200, headers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json(
      { error: `Failed to fetch translation: ${message}` },
      { status: 500 }
    );
  }
}
