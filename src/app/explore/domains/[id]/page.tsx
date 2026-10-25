import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import {
  DOMAINS,
  DOMAIN_PROVENANCE,
  getDomain,
  getDomainsOverlappingWith,
  type DomainId,
} from "@/lib/taxonomy/domains";
import {
  getDomainTopicRelations,
  type DomainTopicRelation,
} from "@/lib/taxonomy/domain-topics";
import { getTopic } from "@/lib/topics/data";
import { absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return DOMAINS.map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const domain = getDomain(id);
  if (!domain) return {};
  const canonical = absoluteUrl(`/explore/domains/${domain.id}`);
  return {
    title: `${domain.title} — Quran Domain`,
    description: domain.scope,
    alternates: { canonical },
    openGraph: {
      title: `${domain.title} — Quran Domain`,
      description: domain.scope,
      url: canonical,
      type: "website",
      siteName: "Al-Huda",
    },
  };
}

export default async function DomainDetailPage({ params }: Props) {
  const { id } = await params;
  const domain = getDomain(id);
  if (!domain) return notFound();

  const overlapping = getDomainsOverlappingWith(domain.id as DomainId);
  const declaredOverlaps = domain.overlaps
    .map((oid) => getDomain(oid))
    .filter((d): d is NonNullable<typeof d> => Boolean(d));

  // Resolve every relationship against the canonical topic catalog. A
  // relation whose topic slug does not resolve is dropped rather than
  // rendered with a broken link; the catalog validator already rejects
  // such records, so this is defence in depth.
  const topicRelations = getDomainTopicRelations(domain.id as DomainId)
    .map((relation) => ({ relation, topic: getTopic(relation.topicSlug) }))
    .filter(
      (entry): entry is { relation: DomainTopicRelation; topic: NonNullable<ReturnType<typeof getTopic>> } =>
        Boolean(entry.topic)
    );

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${domain.title} — Quran Domain`,
            description: domain.scope,
            url: absoluteUrl(`/explore/domains/${domain.id}`),
            inLanguage: ["en"],
          },
        ]}
      />

      <nav aria-label="Breadcrumb" className="text-sm">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/explore" className="text-primary hover:underline">
              Explore
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link
              href="/explore/domains"
              className="text-primary hover:underline"
            >
              Domains
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-muted-foreground">{domain.title}</li>
        </ol>
      </nav>

      <header className="space-y-4">
        <Link
          href="/explore/domains"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All domains
        </Link>

        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {domain.title}
            </h1>
            {domain.arabicTitle && (
              <p
                className="arabic-display text-3xl text-gold mt-2"
                lang="ar"
                dir="rtl"
              >
                {domain.arabicTitle}
              </p>
            )}
          </div>
          <span className="shrink-0 rounded-full border border-gold/40 bg-gold-soft/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent-foreground">
            proposed
          </span>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-5">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">
            Scope
          </p>
          <p className="text-base text-foreground">{domain.scope}</p>
        </div>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              <strong>Organizational proposal.</strong> This domain is a slot
              for future editorial and scholarly work.{" "}
              {topicRelations.length === 0
                ? "No topic or passage has been assigned to it yet."
                : `${topicRelations.length} curated ${
                    topicRelations.length === 1 ? "topic is" : "topics are"
                  } editorially proposed below. No Quran passage has been assigned to this domain.`}{" "}
              Review status:{" "}
              <strong>
                {DOMAIN_PROVENANCE.status.replace(/-/g, " ")}
              </strong>
              . Catalog method: {DOMAIN_PROVENANCE.method}.
            </span>
          </p>
        </div>
      </header>

      <section aria-labelledby="subjects-heading" className="space-y-4">
        <h2
          id="subjects-heading"
          className="font-display text-xl font-semibold tracking-tight"
        >
          Subject areas this domain may cover
        </h2>
        <p className="text-sm text-muted-foreground">
          A non-exhaustive list of subjects within this domain&apos;s scope.
          These are placeholders for future editorial work — no Quran
          passage has been classified under them yet.
        </p>
        <ul className="flex flex-wrap gap-2">
          {domain.subjects.map((subject) => (
            <li
              key={subject}
              className="rounded-full border border-border/80 bg-card px-3 py-1.5 text-sm"
            >
              {subject}
            </li>
          ))}
        </ul>
      </section>

      {topicRelations.length > 0 ? (
        <section aria-labelledby="topics-heading" className="space-y-4">
          <div>
            <h2
              id="topics-heading"
              className="font-display text-xl font-semibold tracking-tight"
            >
              Curated topics in this domain
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Editorial proposals connecting existing curated topics to this
              domain. Each link opens the topic&apos;s own page, where its
              curated verses and review status are shown. These are
              organizational proposals pending review — not a scholarly
              classification of the Quran, and not a claim that any ayah
              belongs to this domain.
            </p>
          </div>

          <ul className="space-y-3">
            {topicRelations.map(({ relation, topic }) => (
              <li key={relation.id}>
                <div className="rounded-2xl border border-border/80 bg-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-display text-lg font-semibold tracking-tight">
                        <Link
                          href={`/topics/${topic.slug}`}
                          className="text-primary hover:underline"
                        >
                          {topic.title}
                        </Link>
                      </h3>
                      <p
                        className="arabic-display mt-0.5 text-lg text-gold"
                        lang="ar"
                        dir="rtl"
                      >
                        {topic.arabicTitle}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <span className="rounded-full border border-border/80 bg-muted/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {relation.semantics === "navigation-only"
                          ? "navigation aid"
                          : "organizational proposal"}
                      </span>
                      <span className="rounded-full border border-gold/40 bg-gold-soft/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-accent-foreground">
                        {relation.provenance.state.replace(/-/g, " ")}
                      </span>
                    </div>
                  </div>

                  <p className="mt-3 text-sm text-foreground">
                    {relation.purpose}
                  </p>
                  {relation.evidence[0]?.statement && (
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                      {relation.evidence[0].statement}
                    </p>
                  )}
                  <p className="mt-3 text-xs">
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="font-medium text-primary hover:underline"
                    >
                      Open the {topic.title} topic page →
                    </Link>
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground">
            No Quran passages are assigned to this domain. Passage-level
            classification would require a real authorized reviewer decision
            and is not claimed here.
          </p>
        </section>
      ) : (
        <section
          aria-labelledby="empty-state-heading"
          className="rounded-2xl border border-border/80 bg-muted/30 p-6"
        >
          <h2
            id="empty-state-heading"
            className="font-display text-lg font-semibold tracking-tight mb-2"
          >
            Topics and passages
          </h2>
          <p className="text-sm text-muted-foreground">
            No curated topics and no Quran passages have been assigned to
            this domain yet. Assignments will be added only after a real
            editorial pass with review metadata, and — for passage
            classifications — a real authorized reviewer decision. Until
            then, this page honestly shows an empty state rather than
            fabricated links.
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            To explore existing content, visit the{" "}
            <Link href="/topics" className="text-primary hover:underline">
              topic catalog
            </Link>{" "}
            or the{" "}
            <Link href="/explore" className="text-primary hover:underline">
              10 life dimensions
            </Link>
            .
          </p>
        </section>
      )}

      {declaredOverlaps.length > 0 && (
        <section aria-labelledby="overlaps-declared-heading" className="space-y-3">
          <h2
            id="overlaps-declared-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Related domains (declared)
          </h2>
          <p className="text-xs text-muted-foreground">
            Domains this domain declares as overlapping.
          </p>
          <div className="flex flex-wrap gap-2">
            {declaredOverlaps.map((d) => (
              <Link
                key={d.id}
                href={`/explore/domains/${d.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/50"
              >
                {d.arabicTitle && (
                  <span
                    className="arabic-display text-base text-gold"
                    lang="ar"
                    aria-hidden
                  >
                    {d.arabicTitle}
                  </span>
                )}
                {d.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {overlapping.length > 0 && (
        <section aria-labelledby="overlaps-inbound-heading" className="space-y-3">
          <h2
            id="overlaps-inbound-heading"
            className="font-display text-lg font-semibold tracking-tight"
          >
            Domains that reference this one
          </h2>
          <p className="text-xs text-muted-foreground">
            Domains whose declared overlaps include {domain.title}.
          </p>
          <div className="flex flex-wrap gap-2">
            {overlapping.map((d) => (
              <Link
                key={d.id}
                href={`/explore/domains/${d.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/50"
              >
                {d.arabicTitle && (
                  <span
                    className="arabic-display text-base text-gold"
                    lang="ar"
                    aria-hidden
                  >
                    {d.arabicTitle}
                  </span>
                )}
                {d.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section
        aria-labelledby="what-this-page-does-not-claim-heading"
        className="rounded-2xl border border-border/80 bg-card p-5 text-sm text-muted-foreground"
      >
        <h2
          id="what-this-page-does-not-claim-heading"
          className="font-display text-base font-semibold tracking-tight text-foreground mb-2"
        >
          What this page does NOT claim
        </h2>
        <ul className="list-inside list-disc space-y-1">
          <li>
            That the Quran has been classified into these 14 domains.
          </li>
          <li>
            That any specific ayah belongs to this domain.
          </li>
          <li>
            That this domain is an exhaustive or canonical category.
          </li>
          <li>
            That this catalog has been reviewed or approved by a scholar.
          </li>
          <li>
            That subject-area placeholders represent actual content.
          </li>
        </ul>
      </section>
    </div>
  );
}
