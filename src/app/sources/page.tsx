import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, ShieldCheck } from "lucide-react";
import { SOURCES, sourceLanguageLabel, sourceVersionLabel } from "@/lib/quran/sources";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs, sourcesJsonLd } from "@/lib/seo/json-ld";

export const metadata: Metadata = {
  title: "Sources & provenance",
  description: "Complete source catalog for the Quran text, translation, transliteration, and packaged dataset.",
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
          Every verse shown here traces to a recorded source with attribution, license, publisher, version, and homepage. Content is reproduced verbatim as distributed; no AI-generated text is presented as scripture.
        </p>
      </header>

      <section className="space-y-4">
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

      <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 flex items-start gap-2 text-sm text-accent-foreground">
        <ShieldCheck className="mt-0.5 h-4 w-4" aria-hidden />
        <p>This catalog is the single source of truth for attribution in this application. All references shown elsewhere point to this list.</p>
      </aside>
    </div>
  );
}
