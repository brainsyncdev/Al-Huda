import Link from "next/link";
import { BookOpen, Search } from "lucide-react";

/**
 * Root not-found boundary. Reached for unknown routes and for pages that
 * call notFound() — an unresolvable surah slug, an out-of-range ayah
 * reference, or an unknown topic slug.
 *
 * The copy deliberately does not guess at a correction: pointing a reader at
 * a wrong verse is worse than admitting the reference is not in the corpus.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-6 py-12 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
        Not found
      </p>

      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        That reference is not in the Quran
      </h1>

      <p className="text-pretty text-muted-foreground">
        Surah numbers run from 1 to 114, and each surah has a fixed number of
        ayat. If you typed a reference by hand, check it against the surah
        index. Nothing here is generated or estimated — only verses present in
        the pinned dataset are shown.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <Link
          href="/quran"
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Browse all 114 surahs
        </Link>
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          <Search className="h-4 w-4" aria-hidden />
          Search instead
        </Link>
      </div>
    </div>
  );
}
