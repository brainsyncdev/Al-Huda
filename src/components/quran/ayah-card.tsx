"use client";

import { useEffect, useState } from "react";
import { Bookmark, Check, Copy, Link2, NotebookPen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { Ayah } from "@/lib/quran/types";
import { useLibrary } from "@/lib/library/context";
import { arabicSizeClass, arabicLineHeightClass, usePrefs } from "@/lib/prefs/context";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site";

interface AyahCardProps {
  ayah: Ayah;
  surahTransliteration: string;
  /** "full" for reader pages, "compact" for search/preview lists. */
  variant?: "full" | "compact";
  /** Suppress the note editor (used on dense pages). */
  allowNotes?: boolean;
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
}: AyahCardProps) {
  const {
    isBookmarked,
    toggleBookmark,
    noteFor,
    saveNote,
    deleteNote,
    recordVisit,
  } = useLibrary();
  const { arabicSize, lineHeight, showTranslation, showTransliteration, hydrated } = usePrefs();

  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const existingNote = noteFor(ayah.surah, ayah.ayah);
  const bookmarked = isBookmarked(ayah.surah, ayah.ayah);
  const ref = `${ayah.surah}:${ayah.ayah}`;
  const href = `/ayah/${ayah.surah}/${ayah.ayah}`;

  useEffect(() => {
    if (noteOpen) setNoteDraft(existingNote?.text ?? "");
    // Intentionally keyed to open-state and the ayah reference only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteOpen, ayah.surah, ayah.ayah]);

  // Track reading progress once per mount on reader pages.
  useEffect(() => {
    if (variant === "full") recordVisit(ayah.surah, ayah.ayah);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ayah.surah, ayah.ayah, variant]);

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
    ? `"${ayah.arabic}"\n\n${ayah.translation}\n\n— Quran ${surahTransliteration} ${ref} (Saheeh International)`
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
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {surahTransliteration} · {ref}
        </span>
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
          className={cn(
            "mt-4 text-foreground/85",
            variant === "full" ? "text-[1.05rem] leading-relaxed" : "text-sm leading-relaxed"
          )}
        >
          {ayah.translation}
        </p>
      )}

      {showTransliteration && (
        <p className="mt-3 text-sm italic leading-relaxed text-muted-foreground">
          {ayah.transliteration}
        </p>
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
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[0.6875rem] text-muted-foreground">
              Notes are never uploaded and can be exported or deleted in your Library.
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
                  saveNote(ayah.surah, ayah.ayah, noteDraft);
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
