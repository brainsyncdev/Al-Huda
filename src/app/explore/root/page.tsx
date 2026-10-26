// /explore/root — Root-word discovery listing page.
//
// Presents three distinct states, because they are three different claims:
//
//   published            — a neutral word-occurrence index is available. This
//                          is either human approval (reviewState "approved"
//                          with selected lemmas) or an automated publication
//                          decision from the Sprint 41 review pipeline.
//   reviewed-unpublished — the automated review ran and declined to publish
//                          (documented ambiguity, incomplete source data, or
//                          output that contradicts the data). Ayat are withheld.
//   needs-validation     — no current automated decision exists, or the stored
//                          decision predates the current policy version.
//
// Counts shown are word-level occurrences from the morphology index, which is
// the same evidence the pipeline used. They are not "verses about X".

import type { Metadata } from "next";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  FileWarning,
  Info,
} from "lucide-react";
import {
  getAllRootTopicEntries,
  getRootStats,
  isMorphologyDataAvailable,
} from "@/lib/morphology/root-data";
import {
  canActivateRootTopic,
  type RootTopicEntry,
} from "@/lib/morphology/root-allowlist";
import {
  canPublishRootIndex,
  getPublicationDecision,
} from "@/lib/morphology/publication-status";

export const metadata: Metadata = {
  title: "Arabic root-word discovery · Al-Huda",
  description:
    "Explore Quranic words by their Arabic roots. Each root maps to a topic with validated occurrence data from QUL morphology.",
};

type PublicationStatus =
  | "published"
  | "reviewed-unpublished"
  | "needs-validation";

interface ResolvedRoot {
  entry: RootTopicEntry;
  status: PublicationStatus;
  basis: "human-approved" | "automated-policy" | null;
  reasons: string[];
  ambiguityCount: number;
  lemmaCount: number;
}

function resolveRoot(entry: RootTopicEntry): ResolvedRoot {
  const human = canActivateRootTopic(entry);
  const decision = getPublicationDecision(entry.slug);
  const automated = canPublishRootIndex(entry, decision);

  if (human.canActivate) {
    return {
      entry,
      status: "published",
      basis: "human-approved",
      reasons: [],
      ambiguityCount: 0,
      lemmaCount: entry.includedLemmas.length,
    };
  }

  if (automated.canPublish && decision) {
    return {
      entry,
      status: "published",
      basis: "automated-policy",
      reasons: decision.reasons,
      ambiguityCount: decision.ambiguityFlags.length,
      lemmaCount: decision.includedLemmas.length,
    };
  }

  if (decision && decision.decision !== "publish") {
    return {
      entry,
      status: "reviewed-unpublished",
      basis: null,
      reasons: decision.reasons,
      ambiguityCount: decision.ambiguityFlags.length,
      lemmaCount: 0,
    };
  }

  // No decision, or a publish decision that fails the current policy gate
  // (for example a decision written under an older policy version).
  return {
    entry,
    status: "needs-validation",
    basis: null,
    reasons: automated.reasons,
    ambiguityCount: 0,
    lemmaCount: 0,
  };
}

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

  const resolved = entries.map(resolveRoot);
  const published = resolved.filter((r) => r.status === "published");
  const reviewed = resolved.filter((r) => r.status === "reviewed-unpublished");
  const needsValidation = resolved.filter(
    (r) => r.status === "needs-validation"
  );

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
          Explore Quranic words by their Arabic roots. A published root opens a
          neutral index of the verses in which forms of that root occur. It is
          not a claim that those verses are about a topic.
        </p>
      </header>

      {published.length > 0 && (
        <section aria-labelledby="published-roots" className="space-y-4">
          <h2
            id="published-roots"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Published roots ({published.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            Occurrence data for these roots passed structural validation and no
            documented ambiguity was observed. Entries marked automated were
            published by the review pipeline, not by a scholar.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {published.map((r) => (
              <RootCard key={r.entry.slug} resolved={r} />
            ))}
          </div>
        </section>
      )}

      {reviewed.length > 0 && (
        <section
          aria-labelledby="reviewed-unpublished-roots"
          className="space-y-4"
        >
          <h2
            id="reviewed-unpublished-roots"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Reviewed, awaiting publication ({reviewed.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            The automated review ran and did not publish these roots. Verse
            lists stay withheld until the flagged evidence is resolved.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {reviewed.map((r) => (
              <RootCard key={r.entry.slug} resolved={r} />
            ))}
          </div>
        </section>
      )}

      {needsValidation.length > 0 && (
        <section aria-labelledby="needs-validation-roots" className="space-y-4">
          <h2
            id="needs-validation-roots"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Needs validation ({needsValidation.length})
          </h2>
          <p className="text-sm text-muted-foreground">
            No current review decision covers these roots. Counts are raw
            occurrence data from the morphology index, not published content.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {needsValidation.map((r) => (
              <RootCard key={r.entry.slug} resolved={r} />
            ))}
          </div>
        </section>
      )}

      <footer className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong className="text-foreground">Source integrity.</strong> All
            occurrence counts are derived from QUL morphology v1 and validated
            against the pinned Quran dataset (quran-json 3.1.2) and word-data
            (quran.com v4 API). Automated publication means the data passed
            deterministic checks; it is not a scholarly approval.
          </span>
        </p>
      </footer>
    </div>
  );
}

function RootCard({ resolved }: { resolved: ResolvedRoot }) {
  const { entry, status, basis, reasons, ambiguityCount, lemmaCount } =
    resolved;
  const stats = getRootStats(entry.roots[0]);

  const statusLabel =
    status === "published"
      ? basis === "human-approved"
        ? "Published (human review)"
        : "Published (automated)"
      : status === "reviewed-unpublished"
        ? "Reviewed, not published"
        : "Needs validation";

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
        {status === "published" && (
          <CheckCircle2
            className="h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
            aria-label="Published"
          />
        )}
        {status === "reviewed-unpublished" && (
          <Clock
            className="h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-label="Reviewed, not published"
          />
        )}
        {status === "needs-validation" && (
          <FileWarning
            className="h-5 w-5 shrink-0 text-muted-foreground"
            aria-label="Needs validation"
          />
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <div className="text-xs text-muted-foreground">Occurrences</div>
          <div className="font-semibold">{stats.totalOccurrences}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Ayat</div>
          <div className="font-semibold">{stats.distinctAyat}</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">
            {status === "published" ? "Lemmas shown" : "Ambiguity flags"}
          </div>
          <div className="font-semibold">
            {status === "published" ? lemmaCount : ambiguityCount}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{statusLabel}</p>

      {status !== "published" && reasons.length > 0 && (
        <p className="line-clamp-3 text-xs text-muted-foreground">
          {reasons[0]}
        </p>
      )}
    </Link>
  );
}