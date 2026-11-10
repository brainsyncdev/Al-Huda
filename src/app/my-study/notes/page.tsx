"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, NotebookPen, Search, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLibrary } from "@/lib/library/context";
import { cn } from "@/lib/utils";

export default function MyStudyNotesPage() {
  const { notes, deleteNote, hydrated } = useLibrary();
  const [query, setQuery] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [surahFilter, setSurahFilter] = useState<number | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    for (const note of notes) {
      for (const tag of note.tags) tags.add(tag);
    }
    return Array.from(tags).sort();
  }, [notes]);

  const filtered = useMemo(() => {
    let list = [...notes];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((n) => n.text.toLowerCase().includes(q));
    }
    if (tagFilter) {
      list = list.filter((n) => n.tags.includes(tagFilter));
    }
    if (surahFilter !== null) {
      list = list.filter((n) => n.surah === surahFilter);
    }
    list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return list;
  }, [notes, query, tagFilter, surahFilter]);

  function handleDelete(id: string) {
    deleteNote(id);
    toast.success("Note deleted");
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-3">
        <Link
          href="/my-study"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:decoration-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to My Study
        </Link>
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            My Notes
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            Your private notes on ayat — stored only on this device.
          </p>
        </div>
      </header>

      {hydrated && notes.length > 0 && (
        <>
          {/* Search */}
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search notes…"
              className="w-full rounded-full border border-border/80 bg-card py-2 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setTagFilter("")}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                  tagFilter === ""
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                )}
              >
                All tags
              </button>
              {allTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTagFilter(tag === tagFilter ? "" : tag)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
                    tagFilter === tag
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-accent"
                  )}
                >
                  <Tag className="h-3 w-3" aria-hidden />
                  {tag}
                </button>
              ))}
            </div>
          )}

          {/* Surah filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="surah-filter" className="text-xs font-medium text-muted-foreground">
              Filter by surah:
            </label>
            <select
              id="surah-filter"
              value={surahFilter ?? ""}
              onChange={(e) =>
                setSurahFilter(e.target.value ? Number(e.target.value) : null)
              }
              className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-xs"
            >
              <option value="">All surahs</option>
              {Array.from({ length: 114 }, (_, i) => i + 1).map((id) => (
                <option key={id} value={id}>
                  Surah {id}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading notes…
        </div>
      )}

      {hydrated && notes.length === 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
          <NotebookPen className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-sm text-muted-foreground">
            No notes yet. Open any ayah and tap &ldquo;Add note&rdquo; to write a private note.
          </p>
        </div>
      )}

      {hydrated && filtered.length === 0 && notes.length > 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-center text-sm text-muted-foreground">
          No notes match your filters.
        </div>
      )}

      {hydrated && filtered.length > 0 && (
        <ul className="space-y-3">
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
                    Surah {note.surah}:{note.ayah}
                  </Link>
                  <div className="flex items-center gap-2">
                    <p className="text-xs tabular-nums text-muted-foreground">
                      {note.updatedAt.split("T")[0]}
                    </p>
                    <button
                      type="button"
                      onClick={() => handleDelete(note.id)}
                      className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Delete note for ${note.surah}:${note.ayah}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
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
    </div>
  );
}
