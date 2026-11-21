"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bookmark, BookOpen, Check, Compass, Copy, FolderHeart, Link2, ListPlus, NotebookPen, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Ayah } from "@/lib/quran/types";
import { useLibrary } from "@/lib/library/context";
import { useRevision } from "@/lib/revision/context";
import { arabicSizeClass, arabicLineHeightClass, usePrefs } from "@/lib/prefs/context";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";
import { getComprehensionNote } from "@/lib/comprehension/notes";
import { useTranslationText, isFallback, getActualEdition, isGated, getGatedMetadata } from "@/lib/quran/translation-store";
import { getTranslation } from "@/lib/quran/translations";
import { getTopicsForAyah, getDimensionForTopic, getTopicUrl, getDimensionUrl } from "@/lib/topics/navigation";
import { AudioPlayer } from "./audio-player";
import { useTranslation } from "@/lib/i18n/context";
import { ExpandableTranslation } from "@/components/search/expandable-translation";

interface AyahCardProps {
  ayah: Ayah;
  surahTransliteration: string;
  /** "full" for reader pages, "compact" for search/preview lists. */
  variant?: "full" | "compact";
  /** Suppress the note editor (used on dense pages). */
  allowNotes?: boolean;
  /**
   * FR-013: a padded slice of the verbatim translation with the matched term
   * located by offset. Offsets index into `snippet.text`. Only the English
   * paragraph is affected — the Arabic always renders verbatim from the
   * dataset, and when this is null/undefined the full translation is shown.
   */
  snippet?: { text: string; matchStart: number; matchEnd: number } | null;
  /** FR-015: why this result matched. Plain text, never colour alone. */
  matchReasonLabel?: string;
  /** FR-015: what the label actually means, exposed to assistive tech. */
  matchReasonDescription?: string;
  /**
   * MFD-02E M3: when true and there is no snippet highlight, the translation
   * is truncated to 3 lines with a "Show full verse" toggle. Used on the
   * search results page so long ayahs without a literal match don't dominate
   * the list visually.
   */
  truncateTranslationWhenNoSnippet?: boolean;
}

function ParallelTranslationBlock({ translationId, surah, ayah }: { translationId: string; surah: number; ayah: number }) {
  const actualId = getActualEdition(translationId);
  const meta = getTranslation(actualId);
  const text = useTranslationText(translationId, surah, ayah);
  const showingFallback = isFallback(translationId);
  // MFD-12.4 WS5 Gap 3: Check for gated state with no fallback available.
  const isTranslationGated = isGated(translationId);
  const gatedMeta = getGatedMetadata(translationId);
  const isGatedNoFallback = isTranslationGated && !showingFallback && !!gatedMeta;
  if (!meta && !isGatedNoFallback) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-background/50 p-3">
      <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {meta?.name ?? "Translation"} — {meta?.languageLabel ?? "unavailable"}
        {showingFallback && (
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-amber-100 px-1.5 py-0.5 text-[0.5625rem] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300" title={`Showing ${meta?.name} because your selected translation is under rights review`}>
            ⚠ Fallback
          </span>
        )}
        {isGatedNoFallback && (
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-red-100 px-1.5 py-0.5 text-[0.5625rem] font-medium text-red-800 dark:bg-red-900/30 dark:text-red-300" title="This translation is unavailable">
            ✕ Unavailable
          </span>
        )}
      </p>
      {isGatedNoFallback && gatedMeta ? (
        <div className="text-xs text-muted-foreground">
          <p>{gatedMeta.message || "This translation is currently unavailable."}</p>
          {gatedMeta.externalUrl && (
            <a
              href={gatedMeta.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Read on Tanzil.net ↗
            </a>
          )}
        </div>
      ) : (
        <p lang={meta?.language} dir={meta?.direction ?? "ltr"} className="text-sm leading-relaxed text-foreground/85">
          {text ?? "Loading…"}
        </p>
      )}
    </div>
  );
}

/**
 * One ayah with its translation and transliteration, plus local-first actions
 * (bookmark, copy link, copy text, private note). Rendered verbatim from the
 * dataset — no text transformation happens here.
 */
export function AyahCard({
  ayah,
  surahTransliteration,
  variant = "full",
  allowNotes = true,
  snippet = null,
  matchReasonLabel,
  matchReasonDescription,
  truncateTranslationWhenNoSnippet = false,
}: AyahCardProps) {
  const t = useTranslation();
  const {
    isBookmarked,
    toggleBookmark,
    noteFor,
    saveNote,
    deleteNote,
    recordVisit,
    collections,
    isInCollection,
    addToCollection,
    removeFromCollection,
  } = useLibrary();
  // FR-050: a single ayah is a range of one, added through the same plan
  // action the revision page uses for spans.
  const { isInPlan, addRange, removeItem, hydrated: planHydrated } = useRevision();
  const {
    arabicSize,
    lineHeight,
    showTranslation,
    showTransliteration,
    translationId,
    showAudio,
    reciterId,
    parallelMode,
    parallelTranslationIds,
    hydrated,
  } = usePrefs();

  // MFD-12.3 WS3: Resolve the ACTUAL translation being displayed, which may
  // differ from the user's saved preference when rights enforcement substitutes
  // a fallback. Attribution must reflect what is actually shown.
  const actualTranslationId = getActualEdition(translationId);
  const showingFallback = isFallback(translationId);
  const translationMeta = getTranslation(actualTranslationId);
  const selectedTranslationText = useTranslationText(translationId, ayah.surah, ayah.ayah);
  // MFD-12.4 WS5 Gap 3: Check for gated state with no fallback available.
  // When the translation is gated and no fallback was substituted, we should
  // show a proper unavailable state rather than silently using dataset English.
  const isPrimaryGated = isGated(translationId);
  const primaryGatedMeta = getGatedMetadata(translationId);
  const isPrimaryGatedNoFallback = isPrimaryGated && !showingFallback && !!primaryGatedMeta;
  const displayTranslation = selectedTranslationText ?? ayah.translation;
  const translationDir = translationMeta?.direction ?? "ltr";
  const translationLang = translationMeta?.language ?? "en";
  // Snippet highlighting only applies to the built-in English translation;
  // when the user picks a different edition we show the full text instead.
  const activeSnippet = actualTranslationId === "en.sahih" ? snippet : null;

  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [comprehensionOpen, setComprehensionOpen] = useState(false);
  const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

  const existingNote = noteFor(ayah.surah, ayah.ayah);
  const bookmarked = isBookmarked(ayah.surah, ayah.ayah);
  const ref = `${ayah.surah}:${ayah.ayah}`;
  const planned = isInPlan(ref);
  const href = `/ayah/${ayah.surah}/${ayah.ayah}`;
  const comprehensionNote = getComprehensionNote(ayah.surah, ayah.ayah);
  // Stable id linking the visible match-reason label to its description, so the
  // explanation is announced by assistive tech instead of being mouse-only.
  const reasonId = `reason-${ayah.surah}-${ayah.ayah}`;

  useEffect(() => {
    if (noteOpen) {
      setNoteDraft(existingNote?.text ?? "");
      setTagDraft((existingNote?.tags ?? []).join(", "));
    }
    // Intentionally keyed to open-state and the ayah reference only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteOpen, ayah.surah, ayah.ayah]);

  // Track reading progress once per mount on reader pages.
  useEffect(() => {
    if (variant === "full") recordVisit(ayah.surah, ayah.ayah);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ayah.surah, ayah.ayah, variant]);

  /**
   * Add this verse to the revision plan (FR-050), or take it out again.
   *
   * Ignored before hydration: the plan state is still the empty one, so an
   * early click would offer "Add" for a verse that is already scheduled.
   * Toggling off never touches recorded reviews — they are a record of study
   * that happened (same rule as removing an item on the revision page).
   */
  function togglePlan() {
    if (!planHydrated) return;
    if (planned) {
      removeItem(ref);
      toast.success(t("reader.removedFromPlan", { ref }));
    } else {
      addRange([{ surah: ayah.surah, ayah: ayah.ayah }]);
      toast.success(t("reader.addedToPlan", { ref }));
    }
  }

  async function copyToClipboard(value: string, kind: "link" | "text") {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(kind);
      toast.success(kind === "link" ? t("reader.linkCopied") : t("reader.verseCopied"));
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error(t("reader.couldNotCopy"));
    }
  }

  // MFD-12.3: Credit reflects the ACTUALLY displayed translation, not the
  // user's saved preference (which may be gated).
  const translationCredit =
    actualTranslationId === "en.sahih"
      ? "(Saheeh International)"
      : translationMeta
        ? `(${translationMeta.name})`
        : "";
  const copyTextValue = showTranslation
    ? `"${ayah.arabic}"\n\n${displayTranslation}\n\n— Quran ${surahTransliteration} ${ref} ${translationCredit}`.trim()
    : `"${ayah.arabic}"\n\n— Quran ${surahTransliteration} ${ref}`;

  return (
    <article
      id={`ayah-${ayah.surah}-${ayah.ayah}`}
      aria-label={`Ayah ${ayah.surah}:${ayah.ayah}`}
      className={cn(
        "group rounded-2xl border border-border/80 bg-card transition-shadow",
        variant === "full"
          ? "parchment-panel p-5 sm:p-7"
          : "p-4 hover:shadow-sm"
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
              <span className="ayah-number" aria-label={`Ayah ${ayah.ayah}`}>
                {ayah.ayah}
              </span>
              <div className="flex min-w-0 flex-wrap items-center justify-end gap-2">
                {matchReasonLabel && (
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-secondary-foreground">
                    {/* Description is announced rather than mouse-only: `title` alone
                        is unreachable by keyboard, so it is paired with sr-only text
                        referenced by aria-describedby (PRD §11). */}
                    <span id={reasonId} className="sr-only">
                      {matchReasonDescription}
                    </span>
                    <span title={matchReasonDescription} aria-describedby={reasonId}>
                      {matchReasonLabel}
                    </span>
                  </span>
                )}
                <span className="flex-shrink-0 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {surahTransliteration} · {ref}
                </span>
              </div>
            </div>

      <p
        lang="ar"
        dir="rtl"
        className={cn(
          "arabic-text max-w-3xl text-foreground",
          variant === "full"
            ? hydrated
              ? cn(arabicSizeClass(arabicSize), arabicLineHeightClass(lineHeight))
              : "text-[1.875rem] leading-[2.3]"
            : "text-[1.5rem] leading-[2.2]"
        )}
      >
        {ayah.arabic}
      </p>

      {showTranslation && (
        <div className="mt-4 max-w-3xl">
          {/* MFD-12.3 WS3: Subtle fallback indicator when displaying substituted content */}
          {showingFallback && (
            <p className="mb-1.5 flex items-center gap-1.5 text-[0.6875rem] text-amber-700 dark:text-amber-400" role="status">
              <span aria-hidden>⚠</span>
              <span>
                Showing <strong>{translationMeta?.name ?? "alternative"}</strong> — your selected translation ({getTranslation(translationId)?.name ?? translationId}) is under rights review.
              </span>
            </p>
          )}
          {/* MFD-12.4 WS5 Gap 3: Gated with no fallback — show unavailable state
              instead of silently falling back to dataset English. */}
          {isPrimaryGatedNoFallback && primaryGatedMeta ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/30" role="status">
              <p className="flex items-start gap-2 text-xs leading-relaxed text-red-800 dark:text-red-300">
                <span aria-hidden className="shrink-0">✕</span>
                <span>
                  <strong>{getTranslation(translationId)?.name ?? translationId}</strong> is currently unavailable. {primaryGatedMeta.message || "Rights for this edition are under review."}
                </span>
              </p>
              {primaryGatedMeta.externalUrl && (
                <a
                  href={primaryGatedMeta.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-[0.6875rem] font-medium text-red-700 underline underline-offset-2 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                >
                  Read on Tanzil.net ↗
                </a>
              )}
            </div>
          ) : (
            <p
              lang={translationLang}
              dir={translationDir}
              className={cn(
                "text-foreground/85",
                variant === "full" ? "text-[1.05rem] leading-relaxed" : "text-sm leading-relaxed"
              )}
            >
            {activeSnippet ? (
              <>
                {activeSnippet.text.slice(0, activeSnippet.matchStart)}
                {/* Highlight carries colour AND weight AND underline, so the match
                    is never signalled by colour alone (PRD §11). */}
                <mark className="rounded bg-gold-soft px-0.5 font-semibold text-accent-foreground underline decoration-1 underline-offset-2">
                  {activeSnippet.text.slice(activeSnippet.matchStart, activeSnippet.matchEnd)}
                </mark>
                {activeSnippet.text.slice(activeSnippet.matchEnd)}
              </>
            ) : truncateTranslationWhenNoSnippet ? (
              <ExpandableTranslation translation={displayTranslation} truncated />
            ) : (
              displayTranslation
            )}
            </p>
          )}
        </div>
      )}

      {showTransliteration && (
        <p lang="ar-Latn" className="mt-3 text-sm italic leading-relaxed text-muted-foreground">
          {ayah.transliteration}
        </p>
      )}

      {showAudio && (
        <div className="mt-3">
          <AudioPlayer surah={ayah.surah} ayah={ayah.ayah} reciterId={reciterId} />
        </div>
      )}

      {parallelMode && parallelTranslationIds.length > 0 && (
        <div className="mt-4 space-y-3">
          {parallelTranslationIds.map((pid) => (
            <ParallelTranslationBlock key={pid} translationId={pid} surah={ayah.surah} ayah={ayah.ayah} />
          ))}
        </div>
      )}

      {/* Sprint 53: Topic context section */}
      {variant === "full" && (() => {
        const topics = getTopicsForAyah(ayah.surah, ayah.ayah);
        if (topics.length === 0) return null;
        return (
          <div className="mt-4 rounded-xl border border-border/60 bg-secondary/30 p-4">
            <div className="flex items-start gap-2">
              <Tag className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  {t("reader.exploreAyahThroughTopics")}
                </p>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => {
                    const dimension = getDimensionForTopic(topic.slug);
                    return (
                      <div key={topic.slug} className="space-y-1">
                        <Link
                          href={getTopicUrl(topic.slug)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        >
                          {topic.title}
                          <span className="arabic-display text-xs" lang="ar" aria-hidden>
                            {topic.arabicTitle}
                          </span>
                        </Link>
                        {dimension && (
                          <Link
                            href={getDimensionUrl(dimension.id)}
                            className="ml-2 inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary"
                          >
                            <Compass className="h-3 w-3" aria-hidden />
                            {dimension.title}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <button
          type="button"
          onClick={() => {
            toggleBookmark(ayah.surah, ayah.ayah);
            toast.success(bookmarked ? t("reader.bookmarkRemoved") : t("reader.savedToLibrary"));
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
          {bookmarked ? t("reader.saved") : t("reader.save")}
        </button>

        <button
          type="button"
          onClick={togglePlan}
          aria-pressed={planned}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            planned
              ? "bg-gold-soft text-accent-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {planned ? (
            <Check className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <ListPlus className="h-3.5 w-3.5" aria-hidden />
          )}
          {planned ? t("reader.inPlan") : t("reader.addToPlan")}
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
          {t("reader.copyLink")}
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
          {t("reader.copyVerse")}
        </button>

        {comprehensionNote && variant === "full" && (
          <button
            type="button"
            onClick={() => setComprehensionOpen((o) => !o)}
            aria-expanded={comprehensionOpen}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            {t("reader.showContext")}
          </button>
        )}

        {allowNotes && variant === "full" && (
          <button
            type="button"
            onClick={() => setNoteOpen((o) => !o)}
            aria-expanded={noteOpen}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              existingNote
                ? "bg-gold-soft text-accent-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <NotebookPen className="h-3.5 w-3.5" aria-hidden />
            {existingNote ? t("reader.editNote") : t("reader.addNote")}
          </button>
        )}

        {variant === "full" && (
          <button
            type="button"
            onClick={() => setCollectionPickerOpen((o) => !o)}
            aria-expanded={collectionPickerOpen}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <FolderHeart className="h-3.5 w-3.5" aria-hidden />
            {t("reader.collections")}
          </button>
        )}
      </div>

      {collectionPickerOpen && variant === "full" && (
        <div className="mt-4 rounded-xl border border-border/80 bg-background/70 p-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            {t("reader.addToCollection")}
          </p>
          {collections.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              {t("reader.noCollections")}{" "}
              <Link href="/my-study/collections" className="text-primary underline underline-offset-2">
                My Study
              </Link>
              .
            </p>
          ) : (
            <ul className="space-y-1.5">
              {collections.map((col) => {
                const inCollection = isInCollection(col.id, ayah.surah, ayah.ayah);
                return (
                  <li key={col.id}>
                    <button
                      type="button"
                      onClick={() => {
                        if (inCollection) {
                          removeFromCollection(col.id, ayah.surah, ayah.ayah);
                          toast.success(t("reader.removedFromCollection", { name: col.name }));
                        } else {
                          addToCollection(col.id, ayah.surah, ayah.ayah);
                          toast.success(t("reader.addedToCollection", { name: col.name }));
                        }
                      }}
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                        inCollection
                          ? "border-primary/40 bg-primary/10 text-foreground"
                          : "border-border/60 bg-card text-foreground/80 hover:bg-secondary/40"
                      )}
                    >
                      <span className="font-medium">{col.name}</span>
                      {inCollection && <Check className="h-4 w-4 text-primary" aria-hidden />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}

      {comprehensionOpen && variant === "full" && comprehensionNote && (
        <div className="mt-4 rounded-xl border border-border/80 bg-background/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">{t("reader.context")}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {comprehensionNote.context}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-gold-soft px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-accent-foreground">
              {t("reader.pendingReview")}
            </span>
          </div>
          <p className="mt-3 text-[0.6875rem] text-muted-foreground">
            {t("reader.contextNoteDisclaimer")}
          </p>
        </div>
      )}

      {noteOpen && variant === "full" && allowNotes && (
        <div className="mt-4 rounded-xl border border-border/80 bg-background/70 p-3">
          <label
            htmlFor={`note-${ayah.surah}-${ayah.ayah}`}
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            {t("reader.privateNote")}
          </label>
          <textarea
            id={`note-${ayah.surah}-${ayah.ayah}`}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={3}
            placeholder={t("reader.notePlaceholder")}
            className="w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring"
          />

          <label
            htmlFor={`tags-${ayah.surah}-${ayah.ayah}`}
            className="mt-3 mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            {t("reader.tags")}
          </label>
          <input
            id={`tags-${ayah.surah}-${ayah.ayah}`}
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            placeholder={t("reader.tagPlaceholder")}
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring"
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[0.6875rem] text-muted-foreground">
              {t("reader.notesPrivacy")}
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              {existingNote && (
                <button
                  type="button"
                  onClick={() => {
                    deleteNote(existingNote.id);
                    setNoteOpen(false);
                    toast.success(t("reader.noteDeleted"));
                  }}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  {t("reader.delete")}
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  // Raw fragments only — the library context owns normalization.
                  saveNote(
                    ayah.surah,
                    ayah.ayah,
                    noteDraft,
                    tagDraft.split(",")
                  );
                  setNoteOpen(false);
                  toast.success(noteDraft.trim() ? t("reader.noteSaved") : t("reader.noteRemoved"));
                }}
                className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("reader.saveNote")}
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
