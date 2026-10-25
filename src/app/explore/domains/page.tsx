import Link from "next/link";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft, BookMarked } from "lucide-react";
import { DOMAINS, DOMAIN_PROVENANCE } from "@/lib/taxonomy/domains";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Domains — Quran Exploration Areas",
  description:
    "14 proposed broad areas of Quran exploration: belief, worship, ethics, family, society, economics, prophets, creation, revelation, human experience, interfaith, language, law, and eschatology. Organizational proposal, pending scholarly review.",
  alternates: { canonical: absoluteUrl("/explore/domains") },
  openGraph: {
    title: "Domains — Quran Exploration Areas",
    description:
      "14 proposed broad areas of Quran exploration. Organizational proposal, pending scholarly review.",
    url: absoluteUrl("/explore/domains"),
    type: "website",
    siteName: "Al-Huda",
  },
};

export default function DomainsDirectoryPage() {
  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Domains — Quran Exploration Areas",
            description:
              "14 proposed broad areas of Quran exploration. Organizational proposal, pending scholarly review.",
            url: absoluteUrl("/explore/domains"),
            inLanguage: ["en", "ar"],
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Explore
        </Link>
      </nav>

      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <BookMarked className="h-8 w-8 text-primary" aria-hidden />
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Quran Domains
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {DOMAINS.length} proposed broad areas of Quran exploration. Each
          domain organizes a family of subjects for future editorial work.
        </p>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              <strong>Organizational proposal — not an approved taxonomy.</strong>{" "}
              This catalog defines slots for future content, not a finished
              classification of the Quran. No topic or passage has been
              assigned to any domain yet. The catalog carries{" "}
              <strong>
                {DOMAIN_PROVENANCE.status.replace(/-/g, " ")}
              </strong>{" "}
              status ({DOMAIN_PROVENANCE.method}). The 10 existing life
              dimensions on the Explore page remain the active navigation
              system.
            </span>
          </p>
        </div>
      </header>

      <section aria-labelledby="domains-heading" className="space-y-4">
        <h2
          id="domains-heading"
          className="sr-only"
        >
          Proposed domains
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain) => (
            <Link
              key={domain.id}
              href={`/explore/domains/${domain.id}`}
              className="group flex flex-col rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                  {domain.title}
                </h3>
                <span className="shrink-0 rounded-full border border-gold/40 bg-gold-soft/60 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
                  proposed
                </span>
              </div>
              {domain.arabicTitle && (
                <p
                  className="arabic-display text-xl text-gold mb-2"
                  lang="ar"
                  dir="rtl"
                >
                  {domain.arabicTitle}
                </p>
              )}
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {domain.scope}
              </p>
              <p className="mt-auto text-xs font-medium text-primary group-hover:underline">
                View {domain.subjects.length} subjects →
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="what-next-heading"
        className="rounded-2xl border border-border/80 bg-muted/30 p-6"
      >
        <h2
          id="what-next-heading"
          className="font-display text-lg font-semibold tracking-tight mb-2"
        >
          What comes next
        </h2>
        <p className="text-sm text-muted-foreground">
          As editorial review and real scholarly engagement produce
          evidence-backed topic and passage assignments, domains will
          gradually fill with links. Until then, domain pages honestly
          show empty states rather than fabricated content. The existing{" "}
          <Link
            href="/explore"
            className="text-primary hover:underline"
          >
            10 life dimensions
          </Link>{" "}
          and{" "}
          <Link href="/topics" className="text-primary hover:underline">
            curated topics
          </Link>{" "}
          remain the active navigation system.
        </p>
      </section>
    </div>
  );
}
