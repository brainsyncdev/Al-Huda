"use client";

// Tafsir viewer component (FR-030/031/032).
//
// Displays classical Arabic tafsirs that are already available through the
// translation system (ar.jalalayn = Tafsir al-Jalalayn, ar.muyassar = Tafsir
// al-Muyassar). This is an honest reuse of existing data: the tafsirs are
// loaded via the same Tanzil proxy as translations, with full provenance
// tracking. No new data is fabricated or fetched from unverified sources.
//
// The viewer is collapsible and lazy-loads tafsir text only when the user
// expands it, avoiding ~3 MB of network traffic on every ayah page.

import { useState } from "react";
import { BookText, ChevronDown, ExternalLink } from "lucide-react";
import { useTranslationText, isFallback, isGated, getGatedMetadata, getActualEdition } from "@/lib/quran/translation-store";
import { getTranslation } from "@/lib/quran/translations";
import { getSource, sourceLanguageLabel } from "@/lib/quran/sources";
import { cn } from "@/lib/utils";

interface TafsirViewerProps {
  surah: number;
  ayah: number;
}

/**
 * Classical Arabic tafsirs available through the translation system.
 * These are link-method sources in the catalog, but their text is accessible
 * via the Tanzil proxy (same mechanism as translations).
 */
const AVAILABLE_TAFSIRS = [
  {
    translationId: "ar.jalalayn",
    sourceId: "tafsir-jalalayn",
    work: "Tafsir al-Jalalayn",
    authors: "Jalal al-Din al-Mahalli and Jalal al-Din al-Suyuti",
    period: "15th century CE",
  },
  {
    translationId: "ar.muyassar",
    sourceId: "tafsir-muyassar",
    work: "Tafsir al-Muyassar",
    authors: "King Fahd Quran Printing Complex",
    period: "Contemporary",
  },
];

export function TafsirViewer({ surah, ayah }: TafsirViewerProps) {
  const [open, setOpen] = useState(false);

  return (
    <section
      aria-labelledby="tafsir-viewer-heading"
      className="rounded-2xl border border-border/80 bg-card p-5"
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2">
          <BookText className="h-5 w-5 text-primary" aria-hidden />
          <h2 id="tafsir-viewer-heading" className="font-display text-lg font-semibold">
            Classical tafsirs
          </h2>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>

      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Excerpts from classical Arabic tafsirs for {surah}:{ayah}. Text loads
        only when you expand this section. Consult qualified scholarship for
        interpretation.
      </p>

      {open && (
        <div className="mt-4 space-y-4">
          {AVAILABLE_TAFSIRS.map((tafsir) => (
            <TafsirBlock
              key={tafsir.translationId}
              translationId={tafsir.translationId}
              sourceId={tafsir.sourceId}
              work={tafsir.work}
              authors={tafsir.authors}
              period={tafsir.period}
              surah={surah}
              ayah={ayah}
            />
          ))}

          <p className="rounded-xl bg-gold-soft/70 px-3.5 py-2.5 text-xs leading-relaxed text-accent-foreground">
            These tafsirs are classical Arabic works. They are not translations
            and should not be treated as such. Interpretation is left to
            qualified scholarship (FR-031: link to external source for full
            editions).
          </p>
        </div>
      )}
    </section>
  );
}

function TafsirBlock({
  translationId,
  sourceId,
  work,
  authors,
  period,
  surah,
  ayah,
}: {
  translationId: string;
  sourceId: string;
  work: string;
  authors: string;
  period: string;
  surah: number;
  ayah: number;
}) {
  const translationMeta = getTranslation(translationId);
  const sourceRecord = getSource(sourceId);
  const text = useTranslationText(translationId, surah, ayah);

  // MFD-12.4 WS5 Gap 1: Check if this tafsir edition is gated or has been
  // substituted with a fallback translation. Displaying English translation
  // text under an Arabic tafsir heading is a semantic mismatch that could
  // mislead users about the nature of the content.
  const isTafsirFallback = isFallback(translationId);
  const isTafsirGated = isGated(translationId);
  const gatedMeta = getGatedMetadata(translationId);
  const actualEditionId = getActualEdition(translationId);
  const actualMeta = isTafsirFallback ? getTranslation(actualEditionId) : null;

  if (!translationMeta) return null;

  return (
    <div className="rounded-xl border border-border/70 bg-background/60 p-4">
      <div className="mb-2 space-y-1">
        <p className="font-semibold text-foreground">{work}</p>
        <p className="text-xs text-muted-foreground">
          {authors} · {period}
        </p>
        {sourceRecord && (
          <p className="text-[0.6875rem] text-muted-foreground">
            Language: {sourceLanguageLabel(sourceRecord.language)} · License:{" "}
            {sourceRecord.license} · Publisher: {sourceRecord.publisher}
          </p>
        )}
      </div>

      {/* MFD-12.4 WS5 Gap 1: Fallback notice — tafsir was substituted with translation */}
      {isTafsirFallback && actualMeta && (
        <div className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 dark:border-amber-900/50 dark:bg-amber-950/30">
          <p className="flex items-start gap-2 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
            <span aria-hidden className="shrink-0">⚠</span>
            <span>
              This tafsir ({translationMeta.name}) is under rights review. Showing{" "}
              <strong>{actualMeta.name}</strong> ({actualMeta.languageLabel}) instead.
              This is a translation, not the original Arabic tafsir.
            </span>
          </p>
          <a
            href={`https://tanzil.net/trans/${encodeURIComponent(translationId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-[0.6875rem] font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200"
          >
            <ExternalLink className="h-3 w-3" aria-hidden />
            View original {work} on Tanzil.net
          </a>
        </div>
      )}

      {/* MFD-12.4 WS5 Gap 1: Gated with no fallback — show unavailable state */}
      {isTafsirGated && !isTafsirFallback && gatedMeta && (
        <div className="rounded-lg border border-border/60 bg-card/50 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            {gatedMeta.message || "This tafsir is currently unavailable."}
          </p>
          <a
            href={gatedMeta.externalUrl || `https://tanzil.net/trans/${encodeURIComponent(translationId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            <ExternalLink className="h-3 w-3" aria-hidden />
            Read {work} on Tanzil.net
          </a>
        </div>
      )}

      {/* Only render tafsir text when NOT in a gated-without-fallback state */}
      {!isTafsirGated || isTafsirFallback ? (
        <div
          lang={isTafsirFallback && actualMeta ? actualMeta.language : "ar"}
          dir={isTafsirFallback && actualMeta ? (actualMeta.direction ?? "ltr") : "rtl"}
          className={cn(
            "rounded-lg border border-border/60 bg-card/50 p-3 text-base leading-loose text-foreground",
            !isTafsirFallback && "arabic-text"
          )}
        >
          {text ?? "Loading…"}
        </div>
      ) : null}

      {sourceRecord && (!isTafsirGated || isTafsirFallback) && (
        <p className="mt-2 text-[0.6875rem] text-muted-foreground">
          Source: {sourceRecord.attribution}. {sourceRecord.notes}
        </p>
      )}
    </div>
  );
}
