// /explore/root/[root] — Root-word discovery detail page.
//
// Sprint 49: Now supports both manual roots (ROOT_ALLOWLIST) and all 1,574
// Sprint 48 auto-activated roots. The page detects which source the slug
// belongs to and renders the appropriate view.
//
// Manual roots (10): Use ROOT_ALLOWLIST + human review workflow
// Auto-activated roots (1,574): Use Sprint 48 registry + occurrence files
//
// This page uses server-side data loading to access the morphology index.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  Clock,
  XCircle,
  CheckCircle2,
  BookOpen,
  Info,
  ArrowLeft,
} from "lucide-react";
import {
  getRootTopicEntryBySlug,
  getRootOccurrences,
  getRootStats,
  isMorphologyDataAvailable,
  loadMorphologyIndex,
} from "@/lib/morphology/root-data";
import { canActivateRootTopic } from "@/lib/morphology/root-allowlist";
import {
  buildPublishedIndexEntry,
  canPublishRootIndex,
  getPublicationDecision,
  type PublicationDecision,
} from "@/lib/morphology/publication-status";
import { buildRootTopicIndex, type RootOccurrence } from "@/lib/morphology/occurrence-index";
import { getSurah } from "@/lib/quran/data";
import type { RootTopicEntry } from "@/lib/morphology/root-allowlist";
import type { Ayah } from "@/lib/quran/types";
import {
  getSprint48RootBySlug,
  loadSprint48OccurrenceFile,
  type Sprint48RegistryRoot,
  type Sprint48OccurrenceIndex,
} from "@/lib/morphology/sprint-48-root-data";

interface Props {
  params: Promise<{ root: string }>;
  searchParams: Promise<{ page?: string; lemma?: string }>;
}

/** Occurrences per page on an approved root page. */
const PAGE_SIZE = 25;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { root: slug } = await params;

  // Try manual roots first
  const manualEntry = getRootTopicEntryBySlug(slug);
  if (manualEntry) {
    const decision = getPublicationDecision(slug);
    const automated = canPublishRootIndex(manualEntry, decision);
    const isPublic = manualEntry.reviewState === "approved" || automated.canPublish;

    return {
      title: `${manualEntry.title} (${manualEntry.arabicTitle}) · Al-Huda`,
      description: `Arabic root ${manualEntry.roots[0]} — ${manualEntry.title}. ${
        isPublic
          ? "Verses containing forms associated with this root."
          : "Pending review — lemma selection not yet approved."
      }`,
      robots: isPublic ? undefined : { index: false },
    };
  }

  // Try Sprint 48 auto-activated roots
  const s48Root = getSprint48RootBySlug(slug);
  if (s48Root && (s48Root.status === "activated" || s48Root.status === "partially-activated")) {
    return {
      title: `Root ${s48Root.root} · Al-Huda`,
      description: `Arabic root ${s48Root.root} — ${s48Root.occurrenceCount} word occurrences across ${s48Root.distinctAyahCount} distinct ayat. ${s48Root.autoAcceptedLemmas} lemmas auto-accepted by deterministic morphology validation.`,
      robots: undefined,
    };
  }

  return {
    title: `Root not found · Al-Huda`,
    robots: { index: false },
  };
}

export default async function RootDiscoveryDetailPage({
  params,
  searchParams,
}: Props) {
  const { root: slug } = await params;
  const { page: pageParam, lemma: lemmaParam } = await searchParams;
  const parsedPage = Number.parseInt(pageParam ?? "1", 10);
  const requestedPage =
    Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  // Try manual roots first (ROOT_ALLOWLIST)
  const manualEntry = getRootTopicEntryBySlug(slug);
  if (manualEntry) {
    return (
      <ManualRootView
        entry={manualEntry}
        page={requestedPage}
        slug={slug}
      />
    );
  }

  // Try Sprint 48 auto-activated roots
  const s48Root = getSprint48RootBySlug(slug);
  if (s48Root) {
    if (s48Root.status === "activated" || s48Root.status === "partially-activated") {
      return (
        <Sprint48RootView
          root={s48Root}
          page={requestedPage}
          slug={slug}
          lemmaFilter={lemmaParam}
        />
      );
    } else if (s48Root.status === "needs-review") {
      return <Sprint48NeedsReviewView root={s48Root} />;
    } else {
      return <Sprint48DiscoveredView root={s48Root} />;
    }
  }

  // Not found
  notFound();
}

// ============================================================================
// Manual Root View (ROOT_ALLOWLIST)
// ============================================================================

function ManualRootView({
  entry,
  page,
  slug,
}: {
  entry: RootTopicEntry;
  page: number;
  slug: string;
}) {
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

  if (entry.reviewState === "rejected") {
    return <RejectedRootView entry={entry} />;
  }

  const humanGate = canActivateRootTopic(entry);
  const decision = getPublicationDecision(slug);
  const automatedGate = canPublishRootIndex(entry, decision);

  if (humanGate.canActivate) {
    return (
      <RootIndexView
        entry={entry}
        page={page}
        slug={slug}
        provenance="human-approved"
        decision={null}
      />
    );
  }

  if (automatedGate.canPublish && decision) {
    return (
      <RootIndexView
        entry={entry}
        page={page}
        slug={slug}
        provenance="automated-policy"
        decision={decision}
      />
    );
  }

  return (
    <PendingReviewRootView
      entry={entry}
      reasons={[...humanGate.reasons, ...automatedGate.reasons]}
      decision={decision}
    />
  );
}

// ============================================================================
// Sprint 48 Auto-Activated Root View
// ============================================================================

function Sprint48RootView({
  root,
  page,
  slug,
  lemmaFilter,
}: {
  root: Sprint48RegistryRoot;
  page: number;
  slug: string;
  lemmaFilter?: string;
}) {
  const occurrenceIndex = loadSprint48OccurrenceFile(slug);

  if (!occurrenceIndex || occurrenceIndex.totalMatches === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 pb-12">
        <BackToRootsLink />
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Explore · Arabic root
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="arabic-display mr-3 text-gold" lang="ar" dir="rtl">
              {root.root}
            </span>
            Root
          </h1>
        </header>

        <section
          aria-labelledby="no-occurrences"
          className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center"
        >
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden />
          <h2 id="no-occurrences" className="mt-4 font-display text-lg font-semibold">
            No occurrences available
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            This root has been discovered but no occurrence data is currently available.
          </p>
        </section>
      </div>
    );
  }

  // Filter by lemma if requested
  let filteredOccurrences = occurrenceIndex.occurrences;
  if (lemmaFilter) {
    filteredOccurrences = occurrenceIndex.occurrences.filter(
      (occ) => occ.matchedLemma === lemmaFilter
    );
  }

  const totalMatches = filteredOccurrences.length;
  const totalPages = Math.max(1, Math.ceil(totalMatches / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageOccurrences = filteredOccurrences.slice(start, start + PAGE_SIZE);

  // Calculate distinct ayat for filtered results
  const filteredAyat = new Set(
    filteredOccurrences.map((occ) => `${occ.ref.surah}:${occ.ref.ayah}`)
  );

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <BackToRootsLink />

      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic root
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="arabic-display mr-3 text-gold" lang="ar" dir="rtl">
            {root.root}
          </span>
          {root.transliteration && (
            <span className="text-muted-foreground">({root.transliteration})</span>
          )}
        </h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" aria-hidden />
          <span>
            {root.status === "activated" ? "Activated" : "Partially available"} ·{" "}
            {occurrenceIndex.totalMatches} word occurrences across{" "}
            {occurrenceIndex.uniqueAyahs.length} distinct ayat
          </span>
        </div>
        <p className="max-w-prose text-muted-foreground">
          Verses containing forms associated with this root. This list shows
          verses in which words derived from the root{" "}
          <span lang="ar" dir="rtl">{root.root}</span> appear, filtered by
          the auto-accepted lemma forms. Each row corresponds to one word
          occurrence; an ayah containing two forms of the root appears twice.
        </p>
        <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            Lemma selection produced by automated review (policy{" "}
            {root.policyVersion}) from QUL morphology data. This is not a
            scholarly approval or a thematic classification.
          </p>
        </div>
        <aside className="flex items-start gap-2 rounded-xl border border-gold/30 bg-gold-soft/40 p-3 text-xs text-accent-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
          <p>
            <strong>Important distinction:</strong> Root occurrences are
            linguistic units based on morphology, not thematic classifications.
            This page shows where words derived from this root appear — it does
            not claim these verses share a theme. For curated thematic
            exploration, see{" "}
            <Link href="/explore/topics" className="text-primary hover:underline">
              Topics
            </Link>
            .
          </p>
        </aside>
      </header>

      {/* Lemma distribution */}
      <section aria-labelledby="lemma-distribution" className="space-y-3">
        <h2 id="lemma-distribution" className="font-display text-xl font-semibold tracking-tight">
          Lemma distribution ({root.includedLemmas.length})
        </h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {root.includedLemmas.map((lemma) => {
            const count = occurrenceIndex.occurrences.filter(
              (occ) => occ.matchedLemma === lemma
            ).length;
            const isActive = lemmaFilter === lemma;
            return (
              <Link
                key={lemma}
                href={
                  isActive
                    ? `/explore/root/${slug}`
                    : `/explore/root/${slug}?lemma=${encodeURIComponent(lemma)}`
                }
                className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border/60 bg-card hover:bg-secondary/50"
                }`}
              >
                <span className="arabic-display" lang="ar" dir="rtl">
                  {lemma}
                </span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </Link>
            );
          })}
        </div>
        {lemmaFilter && (
          <p className="text-xs text-muted-foreground">
            Showing occurrences for lemma{" "}
            <span className="arabic-display" lang="ar" dir="rtl">
              {lemmaFilter}
            </span>
            .{" "}
            <Link href={`/explore/root/${slug}`} className="text-primary hover:underline">
              Clear filter
            </Link>
          </p>
        )}
      </section>

      {/* Occurrence list */}
      {pageOccurrences.length === 0 ? (
        <section
          aria-labelledby="no-results"
          className="rounded-2xl border border-border/60 bg-card/60 p-8 text-center"
        >
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden />
          <h2 id="no-results" className="mt-4 font-display text-lg font-semibold">
            No matching ayat found
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No ayat matched the selected lemma filter.
          </p>
        </section>
      ) : (
        <section aria-labelledby="ayah-results" className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="ayah-results" className="font-display text-xl font-semibold tracking-tight">
              Word occurrences ({totalMatches})
            </h2>
            <p className="text-xs text-muted-foreground">
              Showing {start + 1}–{start + pageOccurrences.length} of{" "}
              {totalMatches}
              {lemmaFilter ? "" : ` across ${filteredAyat.size} ayat`}
            </p>
          </div>
          <div className="space-y-3">
            {pageOccurrences.map((occ, i) => (
              <Sprint48OccurrenceCard
                key={`${occ.ref.surah}:${occ.ref.ayah}:${occ.wordPosition ?? i}`}
                occurrence={occ}
                slug={slug}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Root occurrence pagination"
              className="flex items-center justify-center gap-2 pt-2"
            >
              {currentPage > 1 ? (
                <Link
                  href={
                    lemmaFilter
                      ? `/explore/root/${slug}?page=${currentPage - 1}&lemma=${encodeURIComponent(lemmaFilter)}`
                      : `/explore/root/${slug}?page=${currentPage - 1}`
                  }
                  className="rounded-lg border border-border/80 bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary/50"
                >
                  ← Previous
                </Link>
              ) : (
                <span className="rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground/60">
                  ← Previous
                </span>
              )}
              <span className="px-3 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={
                    lemmaFilter
                      ? `/explore/root/${slug}?page=${currentPage + 1}&lemma=${encodeURIComponent(lemmaFilter)}`
                      : `/explore/root/${slug}?page=${currentPage + 1}`
                  }
                  className="rounded-lg border border-border/80 bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary/50"
                >
                  Next →
                </Link>
              ) : (
                <span className="rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground/60">
                  Next →
                </span>
              )}
            </nav>
          )}
        </section>
      )}

      {/* Coverage disclosure */}
      <section className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <span>
            <strong className="text-foreground">Coverage disclosure.</strong>{" "}
            Showing source-backed occurrences for the currently activated lemma
            set. This root has {root.totalLemmas} total lemmas in the source,
            of which {root.autoAcceptedLemmas} are auto-accepted and{" "}
            {root.needsReviewLemmas} remain under review. Additional source
            records may have incomplete lemma information.
          </span>
        </p>
      </section>

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

function Sprint48OccurrenceCard({
  occurrence,
  slug,
}: {
  occurrence: Sprint48OccurrenceIndex["occurrences"][number];
  slug: string;
}) {
  const surah = getSurah(occurrence.ref.surah);
  if (!surah) return null;

  const ayah = surah.ayat.find((a) => a.ayah === occurrence.ref.ayah);
  if (!ayah) return null;

  return (
    <article className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:bg-secondary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="arabic-display text-lg leading-loose" lang="ar" dir="rtl">
            {ayah.arabic}
          </p>
          <p className="text-sm text-muted-foreground">{ayah.translation}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/40 pt-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            {surah.transliteration} ({occurrence.ref.surah}:{occurrence.ref.ayah})
          </span>
          <span>·</span>
          <span>
            Lemma:{" "}
            <span className="arabic-display" lang="ar" dir="rtl">
              {occurrence.matchedLemma}
            </span>
          </span>
          <span>·</span>
          <span>
            Form:{" "}
            <span className="arabic-display" lang="ar" dir="rtl">
              {occurrence.matchedToken}
            </span>
          </span>
        </div>
        <Link
          href={`/ayah/${occurrence.ref.surah}/${occurrence.ref.ayah}?from=root&root=${slug}`}
          className="shrink-0 rounded-lg border border-border/80 bg-card px-3 py-1 text-xs font-medium hover:bg-secondary/50"
        >
          View ayah →
        </Link>
      </div>
    </article>
  );
}

function Sprint48NeedsReviewView({ root }: { root: Sprint48RegistryRoot }) {
  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <BackToRootsLink />
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic root
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="arabic-display mr-3 text-gold" lang="ar" dir="rtl">
            {root.root}
          </span>
          {root.transliteration && (
            <span className="text-muted-foreground">({root.transliteration})</span>
          )}
        </h1>
      </header>

      <section
        aria-labelledby="under-review"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
      >
        <div className="flex items-start gap-3">
          <Clock
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
          <div className="space-y-2 text-sm">
            <h2 id="under-review" className="font-display text-base font-semibold">
              Under review
            </h2>
            <p>
              This root has {root.needsReviewLemmas} lemma{root.needsReviewLemmas !== 1 ? "s" : ""}{" "}
              that require further investigation. Occurrence data is not yet available.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Sprint48DiscoveredView({ root }: { root: Sprint48RegistryRoot }) {
  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <BackToRootsLink />
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic root
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="arabic-display mr-3 text-gold" lang="ar" dir="rtl">
            {root.root}
          </span>
          {root.transliteration && (
            <span className="text-muted-foreground">({root.transliteration})</span>
          )}
        </h1>
      </header>

      <section
        aria-labelledby="not-activated"
        className="rounded-2xl border border-border/60 bg-card/60 p-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground"
            aria-hidden
          />
          <div className="space-y-2 text-sm">
            <h2 id="not-activated" className="font-display text-base font-semibold">
              Not yet activated
            </h2>
            <p>
              This root has been discovered in the morphology source but has no
              auto-accepted lemmas. Occurrence data is not available.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function BackToRootsLink() {
  return (
    <Link
      href="/explore/root"
      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Back to root discovery
    </Link>
  );
}

// ============================================================================
// Legacy views (kept for manual roots)
// ============================================================================

function RootIndexView({
  entry,
  page,
  slug,
  provenance,
  decision,
}: {
  entry: RootTopicEntry;
  page: number;
  slug: string;
  provenance: "human-approved" | "automated-policy";
  decision: PublicationDecision | null;
}) {
  const records = loadMorphologyIndex();
  const indexEntry = decision ? buildPublishedIndexEntry(entry, decision) : entry;

  const fullIndex = buildRootTopicIndex(indexEntry, records);
  const totalMatches = fullIndex.totalMatches;
  const totalAyat = fullIndex.uniqueAyahs.length;
  const totalPages = Math.max(1, Math.ceil(totalMatches / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageOccurrences = fullIndex.occurrences.slice(start, start + PAGE_SIZE);
  const index = {
    ...fullIndex,
    occurrences: pageOccurrences,
    totalOccurrences: pageOccurrences.length,
  };

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
          <span>
            {provenance === "human-approved" ? "Approved" : "Published"} ·{" "}
            {totalMatches} word occurrences across {totalAyat} distinct ayat
          </span>
        </div>
        <p className="max-w-prose text-muted-foreground">
          Verses containing forms associated with this root. This list shows
          verses in which words derived from the root{" "}
          <span lang="ar" dir="rtl">{entry.roots[0]}</span> appear, filtered by
          the selected lemma forms. Each row corresponds to one word
          occurrence; an ayah containing two forms of the root appears twice.
        </p>
        {provenance === "automated-policy" && decision && (
          <div className="flex items-start gap-2 rounded-xl border border-border/60 bg-secondary/30 p-3 text-xs text-muted-foreground">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              Lemma selection produced by automated review (policy{" "}
              {decision.policyVersion}) from QUL morphology data. This is not a
              scholarly approval or a thematic classification.
            </p>
          </div>
        )}
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
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="ayah-results" className="font-display text-xl font-semibold tracking-tight">
              Word occurrences ({totalMatches})
            </h2>
            <p className="text-xs text-muted-foreground">
              Showing {start + 1}–{start + pageOccurrences.length} of{" "}
              {totalMatches} across {totalAyat} ayat
            </p>
          </div>
          <div className="space-y-3">
            {pageOccurrences.map((occ, i) => (
              <AyahOccurrenceCard key={`${occ.ref.surah}:${occ.ref.ayah}:${occ.wordPosition ?? i}`} occurrence={occ} slug={slug} />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Root occurrence pagination"
              className="flex items-center justify-center gap-2 pt-2"
            >
              {currentPage > 1 ? (
                <Link
                  href={`/explore/root/${slug}?page=${currentPage - 1}`}
                  className="rounded-lg border border-border/80 bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary/50"
                >
                  ← Previous
                </Link>
              ) : (
                <span className="rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground/60">
                  ← Previous
                </span>
              )}
              <span className="px-3 text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={`/explore/root/${slug}?page=${currentPage + 1}`}
                  className="rounded-lg border border-border/80 bg-card px-3 py-1.5 text-sm font-medium hover:bg-secondary/50"
                >
                  Next →
                </Link>
              ) : (
                <span className="rounded-lg border border-border/40 bg-muted/40 px-3 py-1.5 text-sm text-muted-foreground/60">
                  Next →
                </span>
              )}
            </nav>
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
  decision: _decision,
}: {
  entry: RootTopicEntry;
  reasons: string[];
  decision: PublicationDecision | null;
}) {
  const stats = getRootStats(entry.roots[0]);
  const occurrences = getRootOccurrences(entry.roots[0]);

  const lemmaCounts = new Map<string, number>();
  for (const occ of occurrences) {
    if (occ.lemma) {
      lemmaCounts.set(occ.lemma, (lemmaCounts.get(occ.lemma) ?? 0) + 1);
    }
  }

  const sortedLemmas = Array.from(lemmaCounts.entries()).sort((a, b) => b[1] - a[1]);

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
        aria-labelledby="pending-review"
        className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
      >
        <div className="flex items-start gap-3">
          <Clock
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
          <div className="space-y-2 text-sm">
            <h2 id="pending-review" className="font-display text-base font-semibold">
              Pending review
            </h2>
            <p>
              This root is awaiting lemma review. {stats.totalOccurrences} word
              occurrences across {stats.distinctAyat} distinct ayat have been
              identified, but the lemma selection has not been approved.
            </p>
            {reasons.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs">
                {reasons.map((reason, i) => (
                  <li key={i}>• {reason}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      {sortedLemmas.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-display text-lg font-semibold">Lemma breakdown</h2>
          <div className="space-y-2">
            {sortedLemmas.slice(0, 20).map(([lemma, count]) => (
              <div
                key={lemma}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-card px-3 py-2 text-sm"
              >
                <span className="arabic-display" lang="ar" dir="rtl">
                  {lemma}
                </span>
                <span className="text-xs text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}
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
      </header>

      <section
        aria-labelledby="rejected"
        className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-900/50 dark:bg-red-950/20"
      >
        <div className="flex items-start gap-3">
          <XCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
            aria-hidden
          />
          <div className="space-y-2 text-sm">
            <h2 id="rejected" className="font-display text-base font-semibold">
              Root rejected
            </h2>
            <p>
              This root has been reviewed and rejected. It is not displayed
              publicly.
            </p>
            {entry.notes && <p className="text-xs">{entry.notes}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}

function AyahOccurrenceCard({ occurrence, slug }: { occurrence: RootOccurrence; slug: string }) {
  const surah = getSurah(occurrence.ref.surah);
  if (!surah) return null;

  const ayah = surah.ayat.find((a: Ayah) => a.ayah === occurrence.ref.ayah);
  if (!ayah) return null;

  return (
    <article className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:bg-secondary/30">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <p className="arabic-display text-lg leading-loose" lang="ar" dir="rtl">
            {ayah.arabic}
          </p>
          <p className="text-sm text-muted-foreground">{ayah.translation}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/40 pt-3">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            {surah.transliteration} ({occurrence.ref.surah}:{occurrence.ref.ayah})
          </span>
          {occurrence.matchedLemma && (
            <>
              <span>·</span>
              <span>
                Lemma:{" "}
                <span className="arabic-display" lang="ar" dir="rtl">
                  {occurrence.matchedLemma}
                </span>
              </span>
            </>
          )}
        </div>
        <Link
          href={`/ayah/${occurrence.ref.surah}/${occurrence.ref.ayah}?from=root&root=${slug}`}
          className="shrink-0 rounded-lg border border-border/80 bg-card px-3 py-1 text-xs font-medium hover:bg-secondary/50"
        >
          View ayah →
        </Link>
      </div>
    </article>
  );
}
