"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ListChecks, NotebookPen } from "lucide-react";
import { toast } from "sonner";
import { BackupControls } from "@/components/library/backup-controls";
import { useLibrary } from "@/lib/library/context";
import { absoluteUrl } from "@/lib/site";

// Note: noindex for this route is handled in ./layout.tsx (a `metadata` export
// in a "use client" page is ignored by the App Router).

function refPath(surah: number, ayah: number) {
  return `/ayah/${surah}/${ayah}`;
}

export default function LibraryPage() {
  const { bookmarks, notes, progress, hydrated } = useLibrary();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const bookmarkList = useMemo(
    () => [...bookmarks].sort((a, b) => b.savedAt.localeCompare(a.savedAt)),
    [bookmarks]
  );

  const noteList = useMemo(
    () => [...notes].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [notes]
  );

  const recent = useMemo(() => progress.slice(0, 20), [progress]);

  async function copyLink(surah: number, ayah: number) {
    try {
      await navigator.clipboard.writeText(absoluteUrl(refPath(surah, ayah)));
      setCopiedId(`${surah}:${ayah}`);
      toast.success("Link copied");
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Your library
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Bookmarks, private notes, and recent reads — stored only on this device. Nothing is uploaded; there is no account and no analytics.
        </p>
      </header>

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading your local library…
        </div>
      )}

      {hydrated && bookmarks.length + notes.length + progress.length === 0 && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          No saved items yet. Open any ayah to bookmark it or add a private note — it will appear here.
        </div>
      )}

      {hydrated && recent.length > 0 && (
        <section aria-labelledby="recent-reading" className="space-y-3">
          <h2 id="recent-reading" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
            <ListChecks className="h-5 w-5 text-gold" aria-hidden />
            Recent reading
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((p) => (
              <li key={`${p.surah}:${p.ayah}:${p.at}`}>
                <Link
                  href={refPath(p.surah, p.ayah)}
                  className="flex h-full items-center justify-between gap-2 rounded-2xl border border-border/80 bg-card px-4 py-3 text-sm transition-colors hover:bg-secondary/40"
                >
                  <span className="font-medium">Surah {p.surah}:{p.ayah}</span>
                  <span className="text-xs text-muted-foreground">{new Date(p.at).toLocaleString()}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hydrated && bookmarkList.length > 0 && (
        <section aria-labelledby="bookmarks" className="space-y-3">
          <h2 id="bookmarks" className="font-display text-xl font-semibold tracking-tight">
            Bookmarks
          </h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {bookmarkList.map((b) => (
              <li key={`${b.surah}:${b.ayah}`}>
                <article className="rounded-2xl border border-border/80 bg-card p-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">Surah {b.surah}:{b.ayah}</h3>
                    <span className="text-xs text-muted-foreground">Saved {new Date(b.savedAt).toLocaleString()}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <Link
                      href={refPath(b.surah, b.ayah)}
                      className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      Open ayah
                    </Link>
                    <button
                      type="button"
                      onClick={() => copyLink(b.surah, b.ayah)}
                      className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {copiedId === `${b.surah}:${b.ayah}` ? "Copied" : "Copy link"}
                    </button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}

      {hydrated && noteList.length > 0 && (
        <section aria-labelledby="notes" className="space-y-3">
          <h2 id="notes" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
            <NotebookPen className="h-5 w-5 text-gold" aria-hidden />
            Private notes
          </h2>
          <ul className="space-y-2">
            {noteList.map((n) => (
              <li key={n.id}>
                <article className="rounded-2xl border border-border/80 bg-card p-5">
                  <header className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-semibold">Surah {n.surah}:{n.ayah}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Updated {new Date(n.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <Link
                      href={refPath(n.surah, n.ayah)}
                      className="rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      View ayah
                    </Link>
                  </header>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                    {n.text}
                  </p>
                  {(n.tags ?? []).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {(n.tags ?? []).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-secondary px-2 py-0.5 text-[0.6875rem] font-medium text-secondary-foreground"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="manage-library" className="space-y-3">
        <h2 id="manage-library" className="font-display text-xl font-semibold tracking-tight">
          Manage this copy
        </h2>
        <BackupControls />
        <p className="text-xs text-muted-foreground">
          Export writes one JSON file holding your bookmarks, notes, reading history,
          revision plan, and reader preferences. Import replaces what is on this
          device with a chosen backup file. Delete erases this browser’s copy permanently.
        </p>
        {/* FR-044 / Journey D acceptance: the persistence limits are stated
            plainly, including the loss conditions. "Local-only" is only an
            honest privacy claim if the reader also knows it means "no server
            copy to restore from". */}
        <div className="rounded-xl border border-border/80 bg-background/70 p-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Where this data lives — and how it can be lost
          </p>
          <p className="mt-1.5 max-w-prose text-xs leading-relaxed text-muted-foreground">
            Your library is stored only in this browser’s local storage. There is
            no account and no server copy, which also means there is no recovery
            path. Clearing site data or cookies, using a private or incognito
            window, switching browser or device, or uninstalling the browser can
            delete it permanently. Export a JSON backup if you intend to keep it.
          </p>
        </div>
      </section>
    </div>
  );
}
