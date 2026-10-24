"use client";

import { useEffect, useState } from "react";
import { Bookmark, BookOpen, Check, Copy, Link2, ListPlus, NotebookPen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Ayah } from "@/lib/quran/types";
import { useLibrary } from "@/lib/library/context";
import { useRevision } from "@/lib/revision/context";
import { arabicSizeClass, arabicLineHeightClass, usePrefs } from "@/lib/prefs/context";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";
import { getComprehensionNote } from "@/lib/comprehension/notes";
import { useTranslationText } from "@/lib/quran/translation-store";
import { getTranslation } from "@/lib/quran/translations";
import { AudioPlayer } from "./audio-player";

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
}

function ParallelTranslationBlock({ translationId, surah, ayah }: { translationId: string; surah: number; ayah: number }) {
  const meta = getTranslation(translationId);
  const text = useTranslationText(translationId, surah, ayah);
  if (!meta) return null;
  return (
    <div className="rounded-xl border border-border/60 bg-background/50 p-3">
      <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wider text-muted-foreground">
        {meta.name} — {meta.languageLabel}
      </p>
      <p lang={meta.language} dir={meta.direction ?? "ltr"} className="text-sm leading-relaxed text-foreground/85">
        {text ?? "Loading…"}
      </p>
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
}: AyahCardProps) {
  const {
    isBookmarked,
    toggleBookmark,
    noteFor,
    saveNote,
    deleteNote,
    recordVisit,
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

  // Resolve the active translation text. Falls back to the dataset's built-in
  // English translation while the selected edition is still loading.
  const translationMeta = getTranslation(translationId);
  const selectedTranslationText = useTranslationText(translationId, ayah.surah, ayah.ayah);
  const displayTranslation = selectedTranslationText ?? ayah.translation;
  const translationDir = translationMeta?.direction ?? "ltr";
  const translationLang = translationMeta?.language ?? "en";
  // Snippet highlighting only applies to the built-in English translation;
  // when the user picks a different edition we show the full text instead.
  const activeSnippet = translationId === "en.sahih" ? snippet : null;

  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");
  const [tagDraft, setTagDraft] = useState("");
  const [comprehensionOpen, setComprehensionOpen] = useState(false);

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
      toast.success(`${ref} removed from your plan. Its recorded reviews are kept.`);
    } else {
      addRange([{ surah: ayah.surah, ayah: ayah.ayah }]);
      toast.success(
        `${ref} added to your plan. The first review is scheduled for tomorrow.`
      );
    }
  }

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

  const translationCredit =
    translationId === "en.sahih"
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
              <div className="flex min-w-0 items-center justify-end gap-2">
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
                <span className="truncate text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {surahTransliteration} · {ref}
                </span>
              </div>
            </div>

      <p
        lang="ar"
        dir="rtl"
        className={cn(
          "arabic-text text-foreground",
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
        <p
          lang={translationLang}
          dir={translationDir}
          className={cn(
            "mt-4 text-foreground/85",
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
          ) : (
            displayTranslation
          )}
        </p>
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

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
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
          {planned ? "In plan" : "Add to plan"}
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

        {comprehensionNote && variant === "full" && (
          <button
            type="button"
            onClick={() => setComprehensionOpen((o) => !o)}
            aria-expanded={comprehensionOpen}
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden />
            Show context
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
            {existingNote ? "Edit note" : "Add note"}
          </button>
        )}
      </div>

      {comprehensionOpen && variant === "full" && comprehensionNote && (
        <div className="mt-4 rounded-xl border border-border/80 bg-background/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground">Context</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {comprehensionNote.context}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-gold-soft px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-accent-foreground">
              Pending review
            </span>
          </div>
          <p className="mt-3 text-[0.6875rem] text-muted-foreground">
            This note provides historical or structural context only — not
            interpretation. It has not yet been validated by a qualified scholar.
          </p>
        </div>
      )}

      {noteOpen && variant === "full" && allowNotes && (
        <div className="mt-4 rounded-xl border border-border/80 bg-background/70 p-3">
          <label
            htmlFor={`note-${ayah.surah}-${ayah.ayah}`}
            className="mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Private note — stored only on this device
          </label>
          <textarea
            id={`note-${ayah.surah}-${ayah.ayah}`}
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={3}
            placeholder="Your reflection, a question to look up, a reminder…"
            className="w-full resize-y rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring"
          />

          <label
            htmlFor={`tags-${ayah.surah}-${ayah.ayah}`}
            className="mt-3 mb-1.5 block text-xs font-medium text-muted-foreground"
          >
            Tags (comma-separated)
          </label>
          <input
            id={`tags-${ayah.surah}-${ayah.ayah}`}
            value={tagDraft}
            onChange={(e) => setTagDraft(e.target.value)}
            placeholder="e.g. patience, reflection, to-look-up"
            className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:outline-2 focus-visible:outline-ring"
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[0.6875rem] text-muted-foreground">
              Notes and tags are never uploaded and can be exported or deleted in your Library.
            </p>
            <div className="flex shrink-0 items-center gap-1.5">
              {existingNote && (
                <button
                  type="button"
                  onClick={() => {
                    deleteNote(existingNote.id);
                    setNoteOpen(false);
                    toast.success("Note deleted");
                  }}
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  Delete
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
                  toast.success(noteDraft.trim() ? "Note saved" : "Note removed");
                }}
                className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Save note
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
