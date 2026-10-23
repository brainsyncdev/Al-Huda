"use client";

// Per-ayah recitation player (FR-054).
//
// Streams a single MP3 from the Islamic Network CDN. One shared <audio>
// element per card keeps playback state local; the browser only downloads a
// file once the user presses play, so enabling audio costs no bandwidth for
// readers who never use it.
//
// Accessibility: the button exposes aria-pressed and a text label (never colour
// or icon alone), and the native audio element is keyboard-operable.

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2 } from "lucide-react";
import { ayahAudioUrl, getReciter, AUDIO_CREDIT } from "@/lib/quran/audio";
import { cn } from "@/lib/utils";

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

  const src = ayahAudioUrl(reciterId, surah, ayah);
  const reciter = getReciter(reciterId);

  // Changing reciter or verse must not leave a stale player reporting "playing"
  // for audio that is no longer loaded.
  useEffect(() => {
    setPlaying(false);
    setFailed(false);
    const el = audioRef.current;
    if (el) {
      el.pause();
      el.currentTime = 0;
    }
  }, [src]);

  if (!src) return null;

  async function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      return;
    }
    try {
      await el.play();
      setPlaying(true);
      setFailed(false);
    } catch {
      // Autoplay policy or a network failure — surface it in text rather than
      // silently doing nothing.
      setFailed(true);
      setPlaying(false);
    }
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
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
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