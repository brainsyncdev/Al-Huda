// /explore/root/[root] — truthful unavailable state.
//
// This route is deliberately NOT a functioning root-word discovery
// experience. The project does not currently hold validated Arabic
// morphology or root-letter data:
//
//   - quran-json@3.1.2 supplies surahs, ayat, transliteration, and
//     Uthmani text only — no lemma, no root, no part-of-speech tags.
//   - The word-by-word dataset (public/word-data/*.json, sourced from
//     the QUL word API) carries arabic, translation, transliteration,
//     and position — again, no root field.
//   - No morphology.ts, roots.ts, or similar module exists in src/lib/.
//
// The PRD (FR-023) explicitly gates SAME_ROOT relation types on the
// availability of "validated morphology data." Rather than fabricate a
// root index, infer roots from spelling, or present guessed groupings
// as authoritative, this page states the absence plainly and points the
// reader to the discovery surfaces that ARE backed by verified data.
//
// robots: noindex — search engines must not treat this as a functioning
// root catalog. If validated root data is integrated in a future sprint,
// this file is the single place to replace the unavailable body with
// the real root-discovery experience.

import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, BookOpen, Compass, Search } from "lucide-react";

interface Props {
  params: Promise<{ root: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { root } = await params;
  return {
    title: `Arabic root ${root} — not yet available · Al-Huda`,
    description:
      "Al-Huda does not currently hold validated Arabic morphology data. This root-discovery placeholder states what is missing and points to the discovery surfaces that are backed by verified data.",
    robots: { index: false, follow: true },
  };
}

export default async function RootDiscoveryUnavailablePage({ params }: Props) {
  const { root } = await params;

  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic root
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          <span
            className="arabic-display mr-3 text-gold"
            lang="ar"
            dir="rtl"
          >
            {root}
          </span>
          Root-word discovery is not yet available
        </h1>
        <p className="max-w-prose text-muted-foreground">
          You reached this page through a link or bookmark of the form{" "}
          <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs">
            /explore/root/{"{root}"}
          </code>
          . Al-Huda does not currently hold the validated Arabic morphology
          data needed to show which Quranic words share this root, so rather
          than present a fabricated index we describe what is missing and
          where you can go instead.
        </p>
      </header>

      <section
        aria-labelledby="why-unavailable"
        className="rounded-2xl border border-gold/30 bg-gold-soft/40 p-6"
      >
        <div className="flex items-start gap-3">
          <AlertCircle
            className="mt-0.5 h-5 w-5 shrink-0 text-gold"
            aria-hidden
          />
          <div className="space-y-2 text-sm">
            <h2
              id="why-unavailable"
              className="font-display text-base font-semibold"
            >
              Why this page is empty
            </h2>
            <p>
              A root-word discovery experience requires a validated
              morphology dataset — typically lemma, root, part of speech,
              and verbal pattern for every Quranic token. The datasets
              currently vendored with Al-Huda do not include that layer:
            </p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li>
                <strong>quran-json 3.1.2</strong> — surahs, ayat, Uthmani
                text, transliteration. No lemma or root fields.
              </li>
              <li>
                <strong>Word-by-word data</strong> (QUL word API, vendored
                under <code>public/word-data/</code>) — per-word Arabic,
                English gloss, transliteration, and position. No root
                field.
              </li>
            </ul>
            <p>
              The PRD gates root-based relation types on validated
              morphology, and Al-Huda declines to infer roots from surface
              spelling or present guessed groupings as authoritative. This
              page will be replaced the sprint a trusted morphology source
              is integrated.
            </p>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="what-is-available"
        className="space-y-4"
      >
        <h2
          id="what-is-available"
          className="font-display text-xl font-semibold tracking-tight"
        >
          Discovery surfaces that ARE backed by verified data
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/explore"
            className="group flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <Compass
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold group-hover:text-primary">
                Explore by dimension
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Ten editorial navigation dimensions, each mapped to
                curated topics with stated review status.
              </p>
            </div>
          </Link>
          <Link
            href="/topics"
            className="group flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <BookOpen
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold group-hover:text-primary">
                Curated topics
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Eleven editorial selections with typed ayah relations,
                provenance, and review status.
              </p>
            </div>
          </Link>
          <Link
            href="/explore/graph"
            className="group flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <Compass
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold group-hover:text-primary">
                Knowledge graph
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Visualize how dimensions and curated topics connect.
              </p>
            </div>
          </Link>
          <Link
            href="/search"
            className="group flex items-start gap-3 rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <Search
              className="mt-0.5 h-5 w-5 shrink-0 text-primary"
              aria-hidden
            />
            <div className="min-w-0">
              <h3 className="font-display text-base font-semibold group-hover:text-primary">
                Arabic text search
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Search the Uthmani text directly — diacritics normalized
                for matching, displayed verbatim.
              </p>
            </div>
          </Link>
        </div>
      </section>

      <footer className="rounded-2xl border border-border/60 bg-card/60 p-5 text-xs text-muted-foreground">
        <p>
          <strong className="text-foreground">Source integrity.</strong> No
          Quran text, translation, tafsir, or morphological analysis has
          been fabricated to populate this page. When validated morphology
          data is integrated, root discovery will be built on top of the
          same provenance and review-status model used for topics and
          dimensions today.
        </p>
      </footer>
    </div>
  );
}
