// MFD-12.4 WS2: Audio proxy route with rights gating.
//
// All audio requests transit this server-side proxy which enforces rights checks
// before streaming MP3 bytes from the Islamic Network CDN. This replaces direct
// client-side CDN URL construction, ensuring every audio delivery passes through
// the default-deny gate.
//
// Pattern mirrors src/app/api/translations/[id]/route.ts for consistency.
//
// GET /api/audio/{reciterId}/{globalAyah}?bitrate={bitrate}
//
// proposedBy: ai-assisted
// reviewStatus: pending-review

import { NextResponse } from "next/server";
import { getReciter, AUDIO_BITRATES, DEFAULT_BITRATE } from "@/lib/quran/audio";
import {
  isReciterGated,
  isRecordingGated,
  getPrimaryRecordingId,
  buildAudioGatedResponse,
  RIGHTS_CACHE_VERSION,
} from "@/lib/quran/audio-rights";

export const runtime = "nodejs";

const CDN_BASE = "https://cdn.islamic.network/quran/audio";

/** Maximum global ayah ordinal in the standard Madani Mushaf. */
const MAX_GLOBAL_AYAH = 6236;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ reciter: string; globalAyah: string }> }
) {
  const { reciter: reciterId, globalAyah: globalAyahRaw } = await params;

  // --- Parameter validation ---------------------------------------------------

  const reciter = getReciter(reciterId);
  if (!reciter) {
    return NextResponse.json(
      {
        error: "invalid-parameter",
        message: `Unknown reciter id: ${reciterId}`,
        reciterId,
      },
      { status: 400 }
    );
  }

  const globalAyah = Number(globalAyahRaw);
  if (!Number.isInteger(globalAyah) || globalAyah < 1 || globalAyah > MAX_GLOBAL_AYAH) {
    return NextResponse.json(
      {
        error: "invalid-parameter",
        message: `globalAyah must be an integer between 1 and ${MAX_GLOBAL_AYAH}`,
        reciterId,
        globalAyah: globalAyahRaw,
      },
      { status: 400 }
    );
  }

  // Parse bitrate from query string
  const url = new URL(req.url);
  const bitrateParam = url.searchParams.get("bitrate");
  let bitrate: number = DEFAULT_BITRATE;
  if (bitrateParam) {
    const parsed = Number(bitrateParam);
    if (
      Number.isInteger(parsed) &&
      (AUDIO_BITRATES as readonly number[]).includes(parsed)
    ) {
      bitrate = parsed;
    }
    // Invalid bitrate values silently fall back to default rather than erroring
  }

  // MFD-12.4 WS2 Gap A: Parse optional recordingId query param.
  // Defaults to the reciter's primary recording (CDN edition id).
  const recordingParam = url.searchParams.get("recording");
  const recordingId = recordingParam || getPrimaryRecordingId(reciterId) || reciterId;

  // --- Rights gate check (BEFORE any CDN fetch) -------------------------------

  // Check both reciter-level AND recording-level gates.
  // isReciterGated checks if reciter has ANY cleared recording.
  // isRecordingGated checks the specific recording variant.
  const reciterGated = isReciterGated(reciterId);
  const recordingGated = !reciterGated && isRecordingGated(reciterId, recordingId);

  if (reciterGated || recordingGated) {
    // Audit log matching existing rights-gate pattern from translations proxy
    // MFD-12.4 WS2 Gap A: includes recordingId and distinguishes gate level.
    console.warn(
      JSON.stringify({
        event: "audio-rights-gate-blocked",
        reciterId,
        recordingId,
        globalAyah,
        bitrate,
        timestamp: new Date().toISOString(),
        userAgent: req.headers.get("user-agent") ?? "unknown",
        referer: req.headers.get("referer") ?? null,
        reason: "rights-under-review",
        gateLevel: reciterGated ? "reciter" : "recording",
        rightsCacheVersion: RIGHTS_CACHE_VERSION,
      })
    );

    const gatedResponse = buildAudioGatedResponse(reciterId, bitrate, globalAyah);
    return NextResponse.json(gatedResponse, {
      status: 403,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "application/json",
        "X-Rights-Cache-Version": RIGHTS_CACHE_VERSION,
      },
    });
  }

  // --- Proxy audio from CDN ---------------------------------------------------

  const cdnUrl = `${CDN_BASE}/${bitrate}/${encodeURIComponent(reciterId)}/${globalAyah}.mp3`;

  try {
    const upstreamRes = await fetch(cdnUrl, {
      headers: {
        "User-Agent": "Al-Huda Quran App (https://al-huda.app)",
        Accept: "audio/mpeg, audio/*",
      },
    });

    if (!upstreamRes.ok) {
      console.warn(
        JSON.stringify({
          event: "audio-upstream-failure",
          reciterId,
          globalAyah,
          bitrate,
          cdnUrl,
          upstreamStatus: upstreamRes.status,
          timestamp: new Date().toISOString(),
        })
      );
      return NextResponse.json(
        {
          error: "upstream-failure",
          message: `CDN returned ${upstreamRes.status} for ${cdnUrl}`,
          reciterId,
          globalAyah,
        },
        { status: 502 }
      );
    }

    // MFD-12.4 WS2 Gap B: Generate ETag from reciter+recording+ayah+bitrate+version.
    // Changing RIGHTS_CACHE_VERSION changes every ETag, forcing revalidation.
    const etagRaw = `${reciterId}:${recordingId}:${globalAyah}:${bitrate}:rv${RIGHTS_CACHE_VERSION}`;
    const etag = `"${Buffer.from(etagRaw).toString("base64url")}"`;

    // Check If-None-Match for conditional requests (cache revalidation after version bump)
    const ifNoneMatch = req.headers.get("if-none-match");
    if (ifNoneMatch === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          ETag: etag,
          "Cache-Control": "public, max-age=300",
          "X-Audio-Source": "cdn.islamic.network",
          "X-Audio-Reciter": reciterId,
          "X-Audio-Recording": recordingId,
          "X-Audio-Global-Ayah": String(globalAyah),
          "X-Audio-Bitrate": String(bitrate),
          "X-Rights-Cache-Version": RIGHTS_CACHE_VERSION,
        },
      });
    }

    // Stream response without buffering entire file in memory
    // MFD-12.4 WS2 Gap B: Reduced max-age to 300s (5 min) and REMOVED
    // stale-while-revalidate so withdrawn content cannot be served stale.
    const headers: Record<string, string> = {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=300",
      ETag: etag,
      "X-Audio-Source": "cdn.islamic.network",
      "X-Audio-Reciter": reciterId,
      "X-Audio-Recording": recordingId,
      "X-Audio-Global-Ayah": String(globalAyah),
      "X-Audio-Bitrate": String(bitrate),
      "X-Rights-Cache-Version": RIGHTS_CACHE_VERSION,
      // CORS headers for cross-origin audio element compatibility
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Range",
      "Access-Control-Expose-Headers": "Content-Length, Content-Range, X-Audio-Source, X-Audio-Reciter, X-Audio-Recording, X-Audio-Global-Ayah, X-Rights-Cache-Version",
    };

    // Preserve content-length from upstream when available
    const contentLength = upstreamRes.headers.get("content-length");
    if (contentLength) {
      headers["Content-Length"] = contentLength;
    }

    // Support range requests for seeking
    const contentRange = upstreamRes.headers.get("content-range");
    if (contentRange) {
      headers["Content-Range"] = contentRange;
    }
    if (upstreamRes.headers.get("accept-ranges")) {
      headers["Accept-Ranges"] = upstreamRes.headers.get("accept-ranges")!;
    }

    // Return streamed response
    return new NextResponse(upstreamRes.body, {
      status: upstreamRes.status === 206 ? 206 : 200,
      headers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    console.error(
      JSON.stringify({
        event: "audio-proxy-error",
        reciterId,
        globalAyah,
        bitrate,
        cdnUrl,
        error: message,
        timestamp: new Date().toISOString(),
      })
    );
    return NextResponse.json(
      {
        error: "upstream-failure",
        message: `Failed to fetch audio from CDN: ${message}`,
        reciterId,
        globalAyah,
      },
      { status: 502 }
    );
  }
}

/** Handle preflight CORS requests for audio elements. */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Range, Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
