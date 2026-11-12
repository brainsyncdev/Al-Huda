"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, FolderHeart, NotebookPen, Search } from "lucide-react";
import { useLibrary } from "@/lib/library/context";
import { useTranslation } from "@/lib/i18n/context";

export default function MyStudySearchPage() {
  const { bookmarks, notes, collections, collectionAyat, hydrated } = useLibrary();
  const t = useTranslation();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return { bookmarks: [], notes: [], collections: [] };
    const q = query.toLowerCase();

    const matchedBookmarks = bookmarks.filter((b) => {
      const label = `${b.surah}:${b.ayah}`.toLowerCase();
      return label.includes(q);
    });

    const matchedNotes = notes.filter((n) => {
      const label = `${n.surah}:${n.ayah} ${n.text} ${n.tags.join(" ")}`.toLowerCase();
      return label.includes(q);
    });

    // M19: also match collections whose ayat references contain the query.
    // A query like "2:255" or "baqarah 255" should surface a collection that
    // contains that ayah, not only one whose name happens to match.
    const matchedCollections = collections.filter((c) => {
      if (c.name.toLowerCase().includes(q)) return true;
      return collectionAyat.some((ca) => {
        if (ca.collectionId !== c.id) return false;
        const ref = `${ca.surah}:${ca.ayah}`.toLowerCase();
        return ref.includes(q);
      });
    });

    return {
      bookmarks: matchedBookmarks,
      notes: matchedNotes,
      collections: matchedCollections,
    };
  }, [query, bookmarks, notes, collections]);

  const totalResults =
    results.bookmarks.length + results.notes.length + results.collections.length;

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
            Search
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            Search your bookmarks, notes, and collections — all local, nothing
            is sent to a server.
          </p>
          <p className="max-w-prose text-xs text-muted-foreground/80">
            {t("myStudy.searchIncludesAyat")}
          </p>
        </div>
      </header>

      {hydrated && (
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bookmarks, notes, collections…"
            autoFocus
            className="w-full rounded-full border border-border/80 bg-card py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      )}

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading search…
        </div>
      )}

      {hydrated && query.trim() && totalResults === 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
          <Search className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-sm text-muted-foreground">
            No results found for &ldquo;{query}&rdquo;
          </p>
        </div>
      )}

      {hydrated && query.trim() && totalResults > 0 && (
        <div className="space-y-6">
          {results.collections.length > 0 && (
            <section aria-labelledby="search-collections" className="space-y-3">
              <h2
                id="search-collections"
                className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
              >
                <FolderHeart className="h-5 w-5 text-gold" aria-hidden />
                Collections ({results.collections.length})
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {results.collections.map((c) => (
                  <li key={c.id}>
                    <Link
                      href={`/my-study/collections/${encodeURIComponent(c.id)}`}
                      className="rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:bg-secondary/40"
                    >
                      <p className="font-semibold">{c.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {collectionAyat.filter((ca) => ca.collectionId === c.id).length}{" "}
                        ayat
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.bookmarks.length > 0 && (
            <section aria-labelledby="search-bookmarks" className="space-y-3">
              <h2
                id="search-bookmarks"
                className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
              >
                <Bookmark className="h-5 w-5 text-gold" aria-hidden />
                Bookmarks ({results.bookmarks.length})
              </h2>
              <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {results.bookmarks.map((b) => (
                  <li key={`${b.surah}:${b.ayah}`}>
                    <Link
                      href={`/ayah/${b.surah}/${b.ayah}`}
                      className="rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:bg-secondary/40"
                    >
                      <p className="font-semibold">
                        Surah {b.surah}:{b.ayah}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Saved {new Date(b.savedAt).toLocaleDateString()}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {results.notes.length > 0 && (
            <section aria-labelledby="search-notes" className="space-y-3">
              <h2
                id="search-notes"
                className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
              >
                <NotebookPen className="h-5 w-5 text-gold" aria-hidden />
                Notes ({results.notes.length})
              </h2>
              <ul className="space-y-2">
                {results.notes.map((n) => (
                  <li key={n.id}>
                    <Link
                      href={`/ayah/${n.surah}/${n.ayah}`}
                      className="rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:bg-secondary/40"
                    >
                      <p className="font-semibold">
                        Surah {n.surah}:{n.ayah}
                      </p>
                      {n.text && (
                        <p className="mt-1 line-clamp-2 text-sm text-foreground/80">
                          {n.text}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">
                        Updated {new Date(n.updatedAt).toLocaleDateString()}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {hydrated && !query.trim() && (
        <div className="rounded-2xl border border-border/80 bg-card p-8 text-center">
          <Search className="mx-auto h-6 w-6 text-muted-foreground" aria-hidden />
          <p className="mt-2 text-sm text-muted-foreground">
            Start typing to search your bookmarks, notes, and collections.
          </p>
        </div>
      )}
    </div>
  );
}
