"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Clock, Hash, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLibrary } from "@/lib/library/context";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n/context";

type SortMode = "recent" | "quran";

export default function MyStudyBookmarksPage() {
  const { bookmarks, toggleBookmark, hydrated } = useLibrary();
  const t = useTranslation();
  const [sort, setSort] = useState<SortMode>("recent");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const sorted = useMemo(() => {
    const list = [...bookmarks];
    if (sort === "recent") {
      list.sort((a, b) => b.savedAt.localeCompare(a.savedAt));
    } else {
      list.sort((a, b) => a.surah - b.surah || a.ayah - b.ayah);
    }
    return list;
  }, [bookmarks, sort]);

  function handleRemove(surah: number, ayah: number) {
    toggleBookmark(surah, ayah);
    setConfirmDelete(null);
    toast.success(t("reader.bookmarkRemoved"));
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
            Bookmarks
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            Your saved ayat — stored only on this device.
          </p>
        </div>
      </header>

      {hydrated && bookmarks.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSort("recent")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              sort === "recent"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Clock className="h-3.5 w-3.5" aria-hidden />
            Recently saved
          </button>
          <button
            type="button"
            onClick={() => setSort("quran")}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors",
              sort === "quran"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Hash className="h-3.5 w-3.5" aria-hidden />
            Quran order
          </button>
        </div>
      )}

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading bookmarks…
        </div>
      )}

      {hydrated && bookmarks.length === 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
          <Bookmark className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-sm text-muted-foreground">
            No bookmarks yet. Open any ayah and tap the bookmark icon to save it.
          </p>
          <Link
            href="/quran"
            className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            Open Quran
          </Link>
        </div>
      )}

      {hydrated && sorted.length > 0 && (
        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {sorted.map((b) => (
              <li key={`${b.surah}:${b.ayah}`}>
                <article className="rounded-2xl border border-border/80 bg-card p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link
                        href={`/ayah/${b.surah}/${b.ayah}`}
                        className="text-sm font-semibold underline underline-offset-2 hover:decoration-gold"
                      >
                        Surah {b.surah}:{b.ayah}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Saved {new Date(b.savedAt).toLocaleString()}
                      </p>
                    </div>
                    {confirmDelete === `${b.surah}:${b.ayah}` ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleRemove(b.surah, b.ayah)}
                          className="rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground"
                        >
                          {t("myStudy.confirm")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDelete(null)}
                          className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          {t("common.cancel")}
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmDelete(`${b.surah}:${b.ayah}`)}
                        className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label={`Remove bookmark for ${b.surah}:${b.ayah}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Link
                      href={`/ayah/${b.surah}/${b.ayah}`}
                      className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground"
                    >
                      Open ayah
                    </Link>
                  </div>
                </article>
              </li>
          ))}
        </ul>
      )}
    </div>
  );
}
