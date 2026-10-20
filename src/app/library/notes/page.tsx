"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, NotebookPen, Tag } from "lucide-react";
import { useLibrary } from "@/lib/library/context";
import { cn } from "@/lib/utils";

// noindex for this route comes from src/app/library/layout.tsx — a metadata
// export in a "use client" page would be ignored by the App Router.
export default function LibraryNotesPage() {
  const { notes, hydrated } = useLibrary();
  const [tagFilter, setTagFilter] = useState("");

  const sorted = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes]
  );

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const note of notes) {
      for (const tag of note.tags) {
        tags.add(tag);
      }
    }
    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [notes]);

  const filtered = useMemo(() => {
    if (!tagFilter) return sorted;
    return sorted.filter((note) => note.tags.includes(tagFilter));
  }, [sorted, tagFilter]);

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:decoration-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to library
        </Link>
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Notes
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            Your private notes, filterable by tag — stored only on this device.
            There is no account and no server copy.
          </p>
        </div>
      </header>

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading your notes from this browser…
        </div>
      )}

      {hydrated && (
        <>
          <section aria-label="Filter notes by tag" className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTagFilter("")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  tagFilter === ""
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                All ({notes.length})
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tag)}
                  aria-pressed={tagFilter === tag}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                    tagFilter === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Tag className="h-3.5 w-3.5" aria-hidden />
                  {tag}
                </button>
              ))}
            </div>
          </section>

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-border/80 bg-card p-6 text-center">
              <NotebookPen
                className="mx-auto h-5 w-5 text-muted-foreground"
                aria-hidden
              />
              <p className="mt-2 text-sm text-muted-foreground">
                {tagFilter
                  ? "No notes carry this tag yet."
                  : "You haven't added any notes yet."}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Open any ayah and choose “Add note” to start.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {filtered.map((note) => (
                <li
                  key={note.id}
                  className="rounded-2xl border border-border/80 bg-card p-5"
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link
                      href={`/ayah/${note.surah}/${note.ayah}`}
                      className="text-sm font-semibold underline underline-offset-2 hover:decoration-gold"
                    >
                      {note.surah}:{note.ayah}
                    </Link>
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {note.updatedAt.split("T")[0]}
                    </p>
                  </div>
                  {note.text && (
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                      {note.text}
                    </p>
                  )}
                  {note.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                        >
                          <Tag className="h-3 w-3" aria-hidden />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
