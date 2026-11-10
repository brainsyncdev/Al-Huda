// Root context panel for ayah reader.
// Sprint 50: Shows root information when user navigates from root discovery.
// Displays Arabic root, transliteration, lemma, occurrence reference, and
// navigation to other occurrences of the same root.

import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";

interface RootContextPanelProps {
  root: string;
  slug: string;
  transliteration?: string;
  lemma?: string;
  occurrenceIndex: number;
  totalOccurrences: number;
  prevOccurrence?: { surah: number; ayah: number };
  nextOccurrence?: { surah: number; ayah: number };
}

export function RootContextPanel({
  root,
  slug,
  transliteration,
  lemma,
  occurrenceIndex,
  totalOccurrences,
  prevOccurrence,
  nextOccurrence,
}: RootContextPanelProps) {
  return (
    <section
      aria-labelledby="root-context"
      className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold-soft/50 to-secondary/30 p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            Root context
          </p>
          <h2
            id="root-context"
            className="mt-1 font-display text-xl font-semibold tracking-tight"
          >
            <span className="arabic-display mr-2 text-gold" lang="ar" dir="rtl">
              {root}
            </span>
            {transliteration && (
              <span className="text-muted-foreground">({transliteration})</span>
            )}
          </h2>
          {lemma && (
            <p className="mt-1 text-sm text-muted-foreground">
              Lemma:{" "}
              <span className="arabic-display" lang="ar" dir="rtl">
                {lemma}
              </span>
            </p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">
            Occurrence {occurrenceIndex} of {totalOccurrences} for this root
          </p>
        </div>
        <Link
          href={`/explore/root/${slug}`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to root
        </Link>
      </div>

      {/* Occurrence navigation */}
      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border/40 pt-4">
        {prevOccurrence ? (
          <Link
            href={`/ayah/${prevOccurrence.surah}/${prevOccurrence.ayah}?from=root&root=${slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Previous occurrence · {prevOccurrence.surah}:{prevOccurrence.ayah}
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground/60">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            First occurrence
          </span>
        )}
        {nextOccurrence ? (
          <Link
            href={`/ayah/${nextOccurrence.surah}/${nextOccurrence.ayah}?from=root&root=${slug}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            Next occurrence · {nextOccurrence.surah}:{nextOccurrence.ayah}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground/60">
            Last occurrence
            <ChevronRight className="h-4 w-4" aria-hidden />
          </span>
        )}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        This ayah contains a word derived from the root{" "}
        <span lang="ar" dir="rtl">{root}</span>. Navigate between occurrences
        to explore how this root appears throughout the Quran.
      </p>
    </section>
  );
}
