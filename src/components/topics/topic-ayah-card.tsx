"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check, Copy, Link2 } from "lucide-react";
import { toast } from "sonner";
import type { Ayah } from "@/lib/quran/types";
import { useLibrary } from "@/lib/library/context";
import { arabicSizeClass, usePrefs } from "@/lib/prefs/context";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";
import {
  RELATION_TYPE_LABELS,
  type ProvenanceRecord,
  type RelationType,
} from "@/lib/topics/data";

interface TopicAyahCardProps {
  ayah: Ayah;
  surahTransliteration: string;
  type: RelationType;
  rationale: string;
  /**
   * FR-073: effective review record for this relation (relation-level
   * override if present, otherwise the topic's record via
   * `relationProvenance`). `provenanceScope` says which of the two it is, so
   * the card never implies a per-relation review that did not happen.
   */
  provenance: ProvenanceRecord;
  provenanceScope: "topic" | "relation";
}

/**
 * Ayah card variant for topic pages: shows the typed relation and its
 * rationale, plus local-first save actions. Translation text is rendered
 * verbatim from the dataset; the rationale is labeled editorial copy.
 */
export function TopicAyahCard({
  ayah,
  surahTransliteration,
  type,
  rationale,
  provenance,
  provenanceScope,
}: TopicAyahCardProps) {
  const { isBookmarked, toggleBookmark, hydrated } = useLibrary();
  const { arabicSize, showTranslation } = usePrefs();
  const [copied, setCopied] = useState<"link" | "text" | null>(null);

  // Keep bookmark state client-only to avoid hydration mismatch.
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const bookmarked = isClient && isBookmarked(ayah.surah, ayah.ayah);

  const ref = `${ayah.surah}:${ayah.ayah}`;
  const href = `/ayah/${ayah.surah}/${ayah.ayah}`;

  async function copyToClipboard(value: string, kind: "link" | "text") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      toast.success(kind === "link" ? "Link copied" : "Verse text copied");
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  }

  const copyTextValue = showTranslation
    ? `"${ayah.arabic}"\n\n${ayah.translation}\n\n— Quran ${surahTransliteration} ${ref}`
    : `"${ayah.arabic}"\n\n— Quran ${surahTransliteration} ${ref}`;

  return (
    <article
      id={`ayah-${ayah.surah}-${ayah.ayah}`}
      className="rounded-2xl border border-border/80 bg-card parchment-panel p-5 sm:p-6"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="ayah-number" aria-label={`Ayah ${ayah.ayah}`}>
          {ayah.ayah}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {surahTransliteration} · {ref}
        </span>
      </div>

      <p
        lang="ar"
        dir="rtl"
        className={cn(
          "arabic-text text-foreground",
          hydrated
            ? arabicSizeClass(arabicSize)
            : "text-[1.875rem] leading-[2.3]"
        )}
      >
        {ayah.arabic}
      </p>

      {showTranslation && (
        <p className="mt-4 text-[1.05rem] leading-relaxed text-foreground/85">
          {ayah.translation}
        </p>
      )}

      <div className="mt-4 rounded-xl border border-gold/25 bg-gold-soft/60 p-3">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-wider text-accent-foreground">
          Why it is listed · {RELATION_TYPE_LABELS[type]}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/85">
          {rationale}
        </p>
        {/* FR-073: the review record readers see is the effective one, with
            its scope stated so topic-level status is never mistaken for an
            individual review of this relation. */}
        <p className="mt-2 text-[0.6875rem] text-muted-foreground">
          Review: {provenance.status} (
          {provenanceScope === "relation"
            ? "this relation"
            : "inherited from topic"}
          ) · {provenance.curator} · {provenance.reviewedAt}.
        </p>
        <p className="mt-1 text-[0.6875rem] text-muted-foreground">
          Editorial selection — not tafsir.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <a
          href={href}
          className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Open full page
        </a>
        <button
          type="button"
          onClick={() => {
            toggleBookmark(ayah.surah, ayah.ayah);
            toast.success(bookmarked ? "Bookmark removed" : "Saved to your library");
          }}
          aria-pressed={bookmarked}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            bookmarked
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Bookmark
            className={cn("h-3.5 w-3.5", bookmarked && "fill-current")}
            aria-hidden
          />
          {bookmarked ? "Saved" : "Save"}
        </button>
        <button
          type="button"
          onClick={() => copyToClipboard(absoluteUrl(href), "link")}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {copied === "link" ? (
            <Check className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Link2 className="h-3.5 w-3.5" aria-hidden />
          )}
          Copy link
        </button>
        <button
          type="button"
          onClick={() => copyToClipboard(copyTextValue, "text")}
          className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
        >
          {copied === "text" ? (
            <Check className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <Copy className="h-3.5 w-3.5" aria-hidden />
          )}
          Copy verse
        </button>
      </div>
    </article>
  );
}
