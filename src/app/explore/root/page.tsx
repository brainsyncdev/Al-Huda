// /explore/root — Root-word discovery listing page.
//
// Displays all root-topic entries from ROOT_ALLOWLIST with their review status,
// occurrence counts, and lemma breakdowns. Roots marked "approved" with non-empty
// includedLemmas link to the detail page; others show "pending review" status.
//
// This page uses server-side data loading to access the morphology index.

import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import {
  getAllRootTopicEntries,
  getRootStats,
  isMorphologyDataAvailable,
} from "@/lib/morphology/root-data";
import type { RootTopicEntry } from "@/lib/morphology/root-allowlist";

export const metadata: Metadata = {
  title: "Arabic root-word discovery · Al-Huda",
  description:
    "Explore Quranic words by their Arabic roots. Each root maps to a topic with validated occurrence data from QUL morphology.",
};

export default function RootDiscoveryListingPage() {
  const dataAvailable = isMorphologyDataAvailable();
  const entries = getAllRootTopicEntries();

  if (!dataAvailable) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 pb-12">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Explore · Arabic roots
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Root-word discovery
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
              <h2
                id="data-unavailable"
                className="font-display text-base font-semibold"
              >
                Morphology data not available
              </h2>
              <p>
                The morphology index has not been generated yet. Run{" "}
                <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs">
                  python scripts/import-morphology.py
                </code>{" "}
                to generate the validated morphology data from the QUL SQLite
                files.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Group entries by review state
  const approved = entries.filter((e) => e.reviewState === "approved");
  const pendingReview = entries.filter(
    (e) => e.reviewState === "pending-review"
  );
  const rejected = entries.filter((e) => e.reviewState === "rejected");

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic roots
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Root-word discovery
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Explore Quranic words by their Arabic roots. Each root maps to a
          topic with validated occurrence data from QUL morphology. Roots are
          listed below with their review status — only approved roots with
          reviewed lemma selections are available for detailed exploration.
        </p>
      </header>

      {approved.length > 0 && (
        <section aria-labelledby="approved-roots" className="space-y-4">
          <h2
            id="approved-roots"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Approved roots ({approved.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {approved.map((entry) => (
              <RootCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {pendingReview.length > 0 && (
        <section
          aria-labelledby="pending-review-roots"
          className="space-y-4"
        >
          <h2
            id="pending-review-roots"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Pending review ({pendingReview.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            These roots have been identified in the morphology data but require
            human review of their lemma selections before activation. Counts
            shown are raw occurrence data, not approved content.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {pendingReview.map((entry) => (
              <RootCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      )}

      {rejected.length > 0 && (
        <section aria-labelledby="rejected-roots" className="space-y-4">
          <h2
            id="rejected-roots"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Rejected ({rejected.length})
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {rejected.map((entry) => (
              <RootCard key={entry.slug} entry={entry} />
            ))}
          </div>
        </section>
      )}

      <footer className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p>
          <strong className="text-foreground">Source integrity.</strong> All
          occurrence counts are derived from QUL morphology v1, validated
          against the pinned Quran dataset (quran-json 3.1.2) and word-data
          (quran.com v4 API). No roots are activated without validated data
          and explicit lemma review.
        </p>
      </footer>
    </div>
  );
}

function RootCard({ entry }: { entry: RootTopicEntry }) {
  const stats = getRootStats(entry.roots[0]);
  const isApproved = entry.reviewState === "approved";
  const isPending = entry.reviewState === "pending-review";

  return (
    <Link
      href={`/explore/root/${entry.slug}`}
      className="group flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold group-hover:text-primary">
            <span className="arabic-display mr-2 text-gold" lang="ar" dir="rtl">
              {entry.arabicTitle}
            </span>
            {entry.title}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Root: {entry.roots[0]}
          </p>
        </div>
        {isApproved && (
          <CheckCircle2
            className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
            aria-label="Approved"
          />
        )}
        {isPending && (
          <Clock
            className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-label="Pending review"
          />
        )}
      </div>

      <div className="flex gap-4 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Occurrences</div>
          <div className="font-semibold">{stats.totalOccurrences}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Ayat</div>
          <div className="font-semibold">{stats.distinctAyat}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Status</div>
          <div className="font-semibold capitalize">{entry.reviewState}</div>
        </div>
      </div>

      {entry.notes && (
        <p className="line-clamp-2 text-xs text-muted-foreground">
          {entry.notes}
        </p>
      )}
    </Link>
  );
}
