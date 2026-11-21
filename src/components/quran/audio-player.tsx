"use client";

// Per-ayah recitation player (FR-054).
//
// MFD-12.4 WS2: Streams audio through the server proxy at
// /api/audio/[reciter]/[globalAyah] which enforces rights gating before
// delivering MP3 bytes from the Islamic Network CDN.
//
// Handles three states:
// 1. No URL (invalid reference) → render nothing
// 2. Gated (403 with gated: true) → render informational message with external link
// 3. Error (network failure, 502) → render "Audio unavailable"
//
// Accessibility: the button exposes aria-pressed and a text label (never colour
// or icon alone), and the native audio element is keyboard-operable.

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, ExternalLink } from "lucide-react";
import { ayahAudioProxyUrl, getReciter, AUDIO_CREDIT } from "@/lib/quran/audio";
import { cn } from "@/lib/utils";

interface AudioGatedInfo {
  gated: true;
  reason: string;
  reciterId: string;
  externalUrl: string;
  message: string;
}

interface AudioPlayerProps {
  surah: number;
  ayah: number;
  reciterId: string;
  /** Compact rendering for dense lists (search results, previews). */
  compact?: boolean;
}

export function AudioPlayer({ surah, ayah, reciterId, compact = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [gatedInfo, setGatedInfo] = useState<AudioGatedInfo | null>(null);

  // MFD-12.4 WS2: Use server-proxied URL instead of direct CDN URL
  const srcOrNull = ayahAudioProxyUrl(reciterId, surah, ayah);
  const reciter = getReciter(reciterId);

  // Changing reciter or verse must not leave a stale player reporting "playing"
  // for audio that is no longer loaded.
  useEffect(() => {
    setPlaying(false);
    setFailed(false);
    setGatedInfo(null);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  }, [srcOrNull]);

  if (!srcOrNull) return null;
  const src: string = srcOrNull;

  async function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }

    // MFD-12.4 WS2: Before playing, check if the proxy returns a gated response.
    // The <audio> element cannot distinguish 403 JSON from audio bytes, so we
    // pre-fetch to detect gating.
    try {
      const headRes = await fetch(src, { method: "HEAD" });
      if (headRes.status === 403) {
        const contentType = headRes.headers.get("content-type") ?? "";
        if (contentType.includes("application/json")) {
          const body = await fetch(src).then((r) => r.json()).catch(() => null);
          if (body && typeof body === "object" && "gated" in body && body.gated === true) {
            setGatedInfo(body as AudioGatedInfo);
            setFailed(false);
            setPlaying(false);
            return;
          }
        }
      }
    } catch {
      // HEAD failed — fall through to attempt play; onError will catch real failures
    }

    try {
      await el.play();
      setPlaying(true);
      setFailed(false);
      setGatedInfo(null);
    } catch {
      // Autoplay policy or a network failure — surface it in text rather than
      // silently doing nothing.
      setFailed(true);
      setPlaying(false);
    }
  }

  // MFD-12.4 WS2: Render gated state with informational message
  if (gatedInfo) {
    return (
      <span className={cn("inline-flex items-center gap-2", compact && "text-[0.6875rem]")}>
        <span role="status" className="text-xs text-muted-foreground">
          🎧 {gatedInfo.message}
        </span>
        {gatedInfo.externalUrl && (
          <a
            href={gatedInfo.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary underline hover:text-primary/80"
            aria-label={`Listen to ${reciter?.name ?? reciterId} on Islamic Network CDN (opens in new tab)`}
          >
            Listen externally
            <ExternalLink className="h-3 w-3" aria-hidden />
          </a>
        )}
        <span className="sr-only">{AUDIO_CREDIT}</span>
      </span>
    );
  }

  const label = playing ? "Pause recitation" : "Play recitation";

  return (
    <span className={cn("inline-flex items-center gap-1.5", compact && "text-[0.6875rem]")}>
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={`${label} — ${reciter?.name ?? reciterId}`}
        title={
          failed
            ? "Audio could not be played. Check your connection and try again."
            : `${label} (${reciter?.name ?? reciterId})`
        }
        className={cn(
          "inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-colors",
          playing
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
        )}
      >
        {playing ? (
          <Pause className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Play className="h-3.5 w-3.5" aria-hidden />
        )}
        {playing ? "Pause" : "Listen"}
      </button>

      {failed && (
        <span role="status" className="text-[0.6875rem] text-destructive">
          Audio unavailable
        </span>
      )}

      <audio
        ref={audioRef}
        src={src}
        preload="none"
        onEnded={() => setPlaying(false)}
        onError={() => {
          setFailed(true);
          setPlaying(false);
        }}
        className="hidden"
      >
        <track kind="captions" />
      </audio>

      <span className="sr-only">{AUDIO_CREDIT}</span>
    </span>
  );
}

/** Small volume glyph used next to a reciter selector heading. */
export function AudioGlyph({ className }: { className?: string }) {
  return <Volume2 className={className} aria-hidden />;
}
