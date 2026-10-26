// /explore/root/[root] — Root-word discovery detail page.
//
// Displays root-topic details based on review state:
//   - "approved" with non-empty includedLemmas: shows paginated ayah results
//   - "pending-review": shows review information (lemma breakdown, counts)
//   - "rejected": shows rejection reason
//   - unknown slug: 404
//
// This page uses server-side data loading to access the morphology index.
// The canActivateRootTopic guard prevents public display without validated data
// and explicit lemma review.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, Clock, XCircle, CheckCircle2, BookOpen } from "lucide-react";
import {
  getRootTopicEntryBySlug,
  getRootOccurrences,
  getRootStats,
  isMorphologyDataAvailable,
  loadMorphologyIndex,
} from "@/lib/morphology/root-data";
import { canActivateRootTopic } from "@/lib/morphology/root-allowlist";
import { buildRootTopicIndex, type RootOccurrence } from "@/lib/morphology/occurrence-index";
import { getSurah } from "@/lib/quran/data";
import type { RootTopicEntry } from "@/lib/morphology/root-allowlist";
import type { Ayah } from "@/lib/quran/types";

interface Props {
  params: Promise<{ root: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { root: slug } = await params;
  const entry = getRootTopicEntryBySlug(slug);

  if (!entry) {
    return {
      title: `Root not found · Al-Huda`,
      robots: { index: false },
    };
  }

  return {
    title: `${entry.title} (${entry.arabicTitle}) · Al-Huda`,
    description: `Arabic root ${entry.roots[0]} — ${entry.title}. ${
      entry.reviewState === "approved"
        ? "Explore ayat containing forms associated with this root."
        : "Pending review — lemma selection not yet approved."
    }`,
    robots: entry.reviewState === "approved" ? undefined : { index: false },
  };
}

export default async function RootDiscoveryDetailPage({ params }: Props) {
  const { root: slug } = await params;
  const entry = getRootTopicEntryBySlug(slug);

  if (!entry) {
    notFound();
  }

  const dataAvailable = isMorphologyDataAvailable();

  if (!dataAvailable) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 pb-12">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Explore · Arabic root
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="arabic-display mr-3 text-gold" lang="ar" dir="rtl">
              {entry.arabicTitle}
            </span>
            {entry.title}
          </h1>
        </header>

        <section
          aria-labelledby="data-unavailable"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
            <div className="space-y-2 text-sm">
              <h2 id="data-unavailable" className="font-display text-base font-semibold">
                Morphology data not available
              </h2>
              <p>
                The morphology index has not been generated yet. Run{" "}
                <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs">
                  python scripts/import-morphology.py
                </code>{" "}
                to generate the validated morphology data.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const canActivate = canActivateRootTopic(entry);

  if (entry.reviewState === "rejected") {
    return <RejectedRootView entry={entry} />;
  }

  if (entry.reviewState === "pending-review" || !canActivate.canActivate) {
    return <PendingReviewRootView entry={entry} reasons={canActivate.reasons} />;
  }

  // Approved root with validated data — show ayah results
  return <ApprovedRootView entry={entry} />;
}

function ApprovedRootView({ entry }: { entry: RootTopicEntry }) {
  const records = loadMorphologyIndex();
  const index = buildRootTopicIndex(entry, records);

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic root
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="arabic-display mr-3 text-gold" lang="ar" dir="rtl">
            {entry.arabicTitle}
          </span>
          {entry.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden />
          <span>Approved · {index.totalMatches} occurrences across {index.uniqueAyahs.length} ayat</span>
        </div>
        <p className="max-w-prose text-muted-foreground">
          Ayat containing forms associated with this root. This list shows verses
          in which words derived from the root <span lang="ar" dir="rtl">{entry.roots[0]}</span>{" "}
          appear, filtered by the reviewed lemma selections.
        </p>
      </header>

      {index.occurrences.length === 0 ? (
        <section
          aria-labelledby="no-results"
          className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center"
        >
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden />
          <h2 id="no-results" className="mt-4 font-display text-lg font-semibold">
            No matching ayat found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No ayat matched the reviewed lemma selections for this root.
          </p>
        </section>
      ) : (
        <section aria-labelledby="ayah-results" className="space-y-4">
          <h2 id="ayah-results" className="font-display text-xl font-semibold tracking-tight">
            Ayat ({index.totalMatches})
          </h2>
          <div className="space-y-3">
            {index.occurrences.map((occ, i) => (
              <AyahOccurrenceCard key={i} occurrence={occ} />
            ))}
          </div>

          {index.pagination && index.pagination.hasMore && (
            <p className="text-sm text-muted-foreground">
              Showing {index.totalOccurrences} of {index.totalMatches} matches.
              Pagination not yet implemented in UI.
            </p>
          )}
        </section>
      )}

      <footer className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p>
          <strong className="text-foreground">Source integrity.</strong> All occurrence
          data is derived from QUL morphology v1, validated against the pinned Quran
          dataset. No Quran text has been altered.
        </p>
      </footer>
    </div>
  );
}

function PendingReviewRootView({
  entry,
  reasons,
}: {
  entry: RootTopicEntry;
  reasons: string[];
}) {
  const stats = getRootStats(entry.roots[0]);
  const occurrences = getRootOccurrences(entry.roots[0]);

  // Group by lemma for review display
  const lemmaCounts = new Map<string, number>();
  for (const occ of occurrences) {
    if (occ.lemma) {
      lemmaCounts.set(occ.lemma, (lemmaCounts.get(occ.lemma) ?? 0) + 1);
    }
  }
  const sortedLemmas = Array.from(lemmaCounts.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-3xl space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic root
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="arabic-display mr-3 text-gold" lang="ar" dir="rtl">
            {entry.arabicTitle}
          </span>
          {entry.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
          <Clock className="h-4 w-4" aria-hidden />
          <span>Pending review</span>
        </div>
      </header>

      <section
        aria-labelledby="review-status"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
          <div className="space-y-2 text-sm">
            <h2 id="review-status" className="font-display text-base font-semibold">
              This root is pending review
            </h2>
            <p>
              The morphology data for this root has been imported and validated, but
              the lemma selections have not yet been reviewed by a human. Ayah results
              are withheld until the review is complete.
            </p>
            {reasons.length > 0 && (
              <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                {reasons.map((reason, i) => (
                  <li key={i}>{reason}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <section aria-labelledby="raw-data" className="space-y-4">
        <h2 id="raw-data" className="font-display text-xl font-semibold tracking-tight">
          Raw occurrence data (for review)
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <div className="text-xs text-muted-foreground">Total occurrences</div>
            <div className="mt-1 text-2xl font-semibold">{stats.totalOccurrences}</div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <div className="text-xs text-muted-foreground">Distinct ayat</div>
            <div className="mt-1 text-2xl font-semibold">{stats.distinctAyat}</div>
          </div>
        </div>

        {sortedLemmas.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-display text-base font-semibold">Lemma breakdown</h3>
            <div className="rounded-2xl border border-border/60 bg-card/60 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Lemma</th>
                    <th className="px-4 py-2 text-right font-medium">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedLemmas.map(([lemma, count]) => (
                    <tr key={lemma} className="border-t border-border/40">
                      <td className="px-4 py-2 arabic-display" lang="ar" dir="rtl">
                        {lemma}
                      </td>
                      <td className="px-4 py-2 text-right font-mono">{count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {entry.notes && (
          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <h3 className="font-display text-base font-semibold">Review notes</h3>
            <p className="mt-2 text-sm text-muted-foreground">{entry.notes}</p>
          </div>
        )}
      </section>

      <footer className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p>
          <strong className="text-foreground">Review required.</strong> This root cannot
          be publicly displayed until a reviewer selects which lemmas belong to this
          topic and approves the entry.
        </p>
      </footer>
    </div>
  );
}

function RejectedRootView({ entry }: { entry: RootTopicEntry }) {
  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic root
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="arabic-display mr-3 text-gold" lang="ar" dir="rtl">
            {entry.arabicTitle}
          </span>
          {entry.title}
        </h1>
        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
          <XCircle className="h-4 w-4" aria-hidden />
          <span>Rejected</span>
        </div>
      </header>

      <section
        aria-labelledby="rejection-reason"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20"
      >
        <div className="flex items-start gap-3">
          <XCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
            aria-hidden
          />
          <div className="space-y-2 text-sm">
            <h2 id="rejection-reason" className="font-display text-base font-semibold">
              This root has been rejected
            </h2>
            <p>
              This root was reviewed and rejected. It will not be displayed in the
              root-discovery experience.
            </p>
            {entry.notes && (
              <div className="mt-4 rounded-lg bg-white/50 p-3 dark:bg-black/20">
                <p className="text-xs font-medium">Review notes:</p>
                <p className="mt-1 text-muted-foreground">{entry.notes}</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AyahOccurrenceCard({ occurrence }: { occurrence: RootOccurrence }) {
  const surah = getSurah(occurrence.ref.surah);
  const ayah: Ayah | undefined = surah?.ayat.find(
    (a) => a.ayah === occurrence.ref.ayah
  );

  if (!surah || !ayah) return null;

  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="arabic-display text-lg leading-relaxed" lang="ar" dir="rtl">
            {ayah.arabic}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{ayah.translation}</p>
        </div>
        <Link
          href={`/${surah.slug}/${occurrence.ref.ayah}`}
          className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
        >
          {surah.transliteration} {occurrence.ref.ayah}
        </Link>
      </div>
      <div className="mt-3 flex gap-4 text-xs text-muted-foreground">
        <div>
          <span className="font-medium">Matched form:</span>{" "}
          <span className="arabic-display" lang="ar" dir="rtl">
            {occurrence.matchedToken}
          </span>
        </div>
        <div>
          <span className="font-medium">Lemma:</span>{" "}
          <span className="arabic-display" lang="ar" dir="rtl">
            {occurrence.matchedLemma}
          </span>
        </div>
      </div>
    </div>
  );
}
