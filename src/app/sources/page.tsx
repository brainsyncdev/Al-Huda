import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { SOURCES, sourceLanguageLabel, sourceVersionLabel } from "@/lib/quran/sources";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs, sourcesJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Sources & provenance",
  description:
    "Complete source catalog and editorial methodology for the Quran text, translation, transliteration, and packaged dataset.",
  alternates: { canonical: "/sources" },
};

export default function SourcesPage() {
  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Sources & provenance", path: "/sources" },
          ]),
          sourcesJsonLd(),
        ]}
      />

      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Sources &amp; provenance
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Every verse shown here traces to a recorded source with attribution,
          license, publisher, version, and homepage. Content is reproduced
          verbatim as distributed; no AI-generated text is presented as
          scripture.
        </p>
      </header>

      <section aria-labelledby="source-catalog" className="space-y-4">
        <h2 id="source-catalog" className="sr-only">
          Source catalog
        </h2>
        {SOURCES.map((s) => (
          <article key={s.id} className="rounded-2xl border border-border/80 bg-card p-5">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">{s.provides}</h2>
                <p className="mt-0.5 text-sm text-muted-foreground">{s.attribution}</p>
              </div>
              <span className="rounded-full border border-gold/40 bg-gold-soft/60 px-3 py-1 text-[0.6875rem] font-medium uppercase tracking-wider text-accent-foreground">
                {s.license}
              </span>
            </header>
            <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Publisher/maintainer</dt>
                <dd className="mt-0.5">{s.publisher}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Version/pin</dt>
                <dd className="mt-0.5">{sourceVersionLabel(s)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Delivery</dt>
                <dd className="mt-0.5 capitalize">{s.method}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted-foreground">Content language</dt>
                <dd className="mt-0.5">{sourceLanguageLabel(s.language)}</dd>
              </div>
            </dl>
            {s.notes && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.notes}</p>}
            <div className="mt-4">
              <Link
                href={s.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Visit source
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </Link>
              {s.licenseUrl && (
                <Link
                  href={s.licenseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1.5 inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  License terms
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                </Link>
              )}
            </div>
          </article>
        ))}
      </section>

      {/* FR-034: public editorial methodology, describing the actual workflow
          in docs/EDITORIAL.md. No scholarly endorsement is implied: every
          topic currently sits at pending-scholarly-review with no reviewer
          assigned. */}
      <section aria-labelledby="editorial-methodology" className="space-y-4">
        <h2
          id="editorial-methodology"
          className="font-display text-xl font-semibold tracking-tight"
        >
          Editorial methodology
        </h2>
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-5 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold">How Quran text and translations enter this app</h3>
            <p className="mt-1 text-muted-foreground">
              Content arrives only as a pinned, versioned npm package
              (<code className="text-xs">quran-json@3.1.2</code>, CC-BY-4.0) —
              never fetched from an unversioned runtime API. The Arabic text and
              Saheeh International translation are rendered verbatim; this app
              does not edit, re-order, or re-generate either. A dataset
              validator (<code className="text-xs">pnpm validate:quran</code>)
              checks surah/ayah counts, duplicate and sequential identifiers,
              and the canonical 6,236-ayah total before a release.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Source and license registration</h3>
            <p className="mt-1 text-muted-foreground">
              Every source — packaged dataset, tafsir link record, or excluded
              candidate — is registered in{" "}
              <code className="text-xs">src/lib/quran/sources.ts</code> with
              publisher, license, version/pin, delivery method, content
              language, and notes. Rejected runtime integrations (e.g. an
              unversioned Quran API) are recorded with their rejection reason so
              the decision is auditable. A second script
              (<code className="text-xs">pnpm validate:licenses</code>) gates
              the rights register for completeness.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Topic and relationship curation</h3>
            <p className="mt-1 text-muted-foreground">
              Topic pages are editorial selections of well-known ayat — entry
              points for reflection, not tafsir and not rulings. Each ayah–topic
              relationship carries a <strong>typed</strong> relationship kind
              (topical association, lexical match, cross-reference, or
              sequential context), a neutral one-line rationale describing what
              the verse addresses, and review metadata. Rationales never assert
              interpretation. Each topic records its method, curator, review
              date, and review status; per-relationship provenance is supported
              in the data model and overrides topic-level status when a
              relationship has been individually reviewed.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Review status and publication policy</h3>
            <p className="mt-1 text-muted-foreground">
              The publication state of every topic is shown on its topic page
              and on the internal{" "}
              <Link
                href="/editorial"
                className="font-medium text-primary underline underline-offset-2 hover:decoration-gold"
              >
                editorial review board
              </Link>
              . <strong>No qualified scholarly reviewer has been assigned</strong>{" "}
              to this project, so every shipped topic is labeled
              <em> pending-scholarly-review</em>. Approval itself happens in
              code review — there is no authenticated admin workflow, by design
              (no accounts). Unresolved dataset references are surfaced on topic
              pages and counted rather than silently dropped.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Correction reporting</h3>
            <p className="mt-1 text-muted-foreground">
              Anyone can report an inaccurate verse, reference, translation
              attribution, topic link, AI-answer concern, or accessibility issue
              via{" "}
              <Link
                href="/report"
                className="font-medium text-primary underline underline-offset-2 hover:decoration-gold"
              >
                /report
              </Link>
              . Quran text and reference errors are treated as critical
              incidents. Reports are prepared on your device; delivery depends
              on the channels the deployment configures (copy/download always,
              email only when an operator has set a destination).
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Rollback</h3>
            <p className="mt-1 text-muted-foreground">
              Because all content is versioned source-of-truth data, rollback is
              a git revert of the offending change and/or a re-pin of the dataset
              package followed by re-running both validators. No rollback has
              been exercised yet; the procedure is documented in{" "}
              <code className="text-xs">docs/EDITORIAL.md</code>.
            </p>
          </div>

          <div className="rounded-xl border border-gold/30 bg-gold-soft/60 p-3 text-accent-foreground">
            <p className="text-xs">
              <strong>AI safety boundary:</strong> AI answer generation is
              disabled by feature flag. When considered for release it will
              require allowlisted source retrieval, claim-level citations,
              abstention on insufficient evidence, and a passing evaluation run
              — none of which has happened yet. AI output is never presented as
              Quran text, tafsir, hadith, fatwa, or scholarly consensus.
            </p>
          </div>
        </div>
      </section>

      <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 flex items-start gap-2 text-sm text-accent-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4" aria-hidden />
        <p>This catalog is the single source of truth for attribution in this application. All references shown elsewhere point to this list.</p>
      </aside>
    </div>
  );
}
