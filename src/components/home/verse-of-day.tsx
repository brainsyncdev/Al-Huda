"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface VerseOfDayPayload {
  surah: number;
  ayah: number;
  surahTransliteration: string;
  surahArabicName: string;
  arabic: string;
  translation: string;
}

interface VerseOfDayResponse {
  verse: VerseOfDayPayload | null;
  /** Edition/license block from `contentProvenance()` in the route. Optional
   *  so a payload without it still renders the verse rather than failing. */
  provenance?: {
    datasetPackage?: string;
    translation?: string | null;
    sourceCatalog?: string;
  } | null;
}

type Status = "loading" | "ready" | "empty" | "error";

/**
 * Verse of the day card for the home page.
 *
 * The home page is statically generated, so the verse cannot be rendered on
 * the server at build time (it would be frozen until the next rebuild).
 * This component resolves it after hydration from /api/verse-of-day, which
 * computes it per request from the pinned dataset. The rest of the page stays
 * static and keeps its SEO characteristics.
 *
 * The payload is fetched rather than imported from lib/quran/verse-of-day:
 * that module reads the dataset from the filesystem and must never enter the
 * client bundle.
 *
 * The heading is rendered unconditionally so the section keeps a stable
 * accessible name and the layout does not jump while loading.
 */
export function VerseOfDayDisplay() {
  const [status, setStatus] = useState<Status>("loading");
  const [verse, setVerse] = useState<VerseOfDayPayload | null>(null);
  const [translationEdition, setTranslationEdition] = useState<string | null>(
    null
  );

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/verse-of-day", { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error("bad status"))))
      .then((data: VerseOfDayResponse) => {
              setVerse(data.verse ?? null);
              setTranslationEdition(data.provenance?.translation ?? null);
              setStatus(data.verse ? "ready" : "empty");
            })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("error");
      });

    return () => controller.abort();
  }, []);

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Verse of the day
        </h2>
        {status === "ready" && verse && (
          <Link
            href={`/ayah/${verse.surah}/${verse.ayah}`}
            className="text-xs font-medium text-primary hover:underline"
          >
            Open full page
          </Link>
        )}
      </div>

      {status === "loading" && (
        <div aria-busy="true" aria-live="polite" className="space-y-3">
          <div className="h-14 animate-pulse rounded-lg bg-muted/50" />
          <div className="h-5 w-4/5 animate-pulse rounded bg-muted/50" />
          <div className="h-4 w-2/5 animate-pulse rounded bg-muted/50" />
        </div>
      )}

      {status === "ready" && verse && (
        <>
          <p
            lang="ar"
            dir="rtl"
            className="arabic-text text-[1.75rem] leading-[2.2] text-foreground sm:text-[2rem]"
          >
            {verse.arabic}
          </p>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-foreground/85">
            {verse.translation}
          </p>
          {/* FR-004: the translation edition label travels with the text on
              every public Quran surface, including this one. */}
          {translationEdition && (
            <p className="mt-2 text-xs text-muted-foreground">
              Translation: {translationEdition} ·{" "}
              <Link
                href="/sources"
                className="underline underline-offset-2 hover:text-foreground"
              >
                source details
              </Link>
            </p>
          )}
          <p className="mt-4 text-sm font-medium text-gold">
            {verse.surahTransliteration} · {verse.surah}:{verse.ayah}
          </p>
        </>
      )}

      {status === "empty" && (
        <p className="text-sm text-muted-foreground">
          Verse of the day is unavailable right now.
        </p>
      )}

      {status === "error" && (
        <p className="text-sm text-muted-foreground">
          Could not load today&apos;s verse. It will appear on your next visit
          to this page.
        </p>
      )}
    </>
  );
}
