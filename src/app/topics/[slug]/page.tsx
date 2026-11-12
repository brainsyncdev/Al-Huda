import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, Map } from "lucide-react";
import { TopicAyahCard } from "@/components/topics/topic-ayah-card";
import { getAyah, getSurah } from "@/lib/quran/data";
import type { AyahRef } from "@/lib/quran/types";
import {
  LANGUAGE_LABELS,
  TOPICS,
  getTopic,
  relationProvenance,
} from "@/lib/topics/data";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, breadcrumbs, topicJsonLd } from "@/lib/seo/json-ld";
import { PATHS } from "@/lib/paths/data";
import { getDimensionsForTopic } from "@/lib/explore/dimensions";
import {
  getTopicDomainRelations,
  type DomainTopicRelation,
} from "@/lib/taxonomy/domain-topics";
import { getDomain, type Domain } from "@/lib/taxonomy/domains";
import { getTopicRootLinks } from "@/lib/morphology/root-links";
import { getJourneysForTopic } from "@/lib/topics/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return {};
  return {
    title: `Topic: ${topic.title}`,
    description: topic.summary,
    alternates: { canonical: absoluteUrl(`/topics/${topic.slug}`) },
    openGraph: {
      title: `${topic.title} — Quran Topic`,
      description: topic.summary,
      url: absoluteUrl(`/topics/${topic.slug}`),
      type: "website",
      siteName: SITE_NAME,
    },
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return notFound();

  const related = topic.related
    .map((s) => getTopic(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  // Resolve every curated reference against the pinned dataset up front. A
  // relation whose ayah does not exist is reported on the page rather than
  // silently skipped, so the visible count can never overstate what the
  // editorial selection actually contains.
  const resolved: {
    relation: (typeof topic.relations)[number];
    verse: NonNullable<ReturnType<typeof getAyah>>;
    surah: NonNullable<ReturnType<typeof getSurah>>;
  }[] = [];
  const unresolved: { ref: AyahRef; type: string }[] = [];

  for (const relation of topic.relations) {
    const verse = getAyah(relation.ref.surah, relation.ref.ayah);
    const surah = getSurah(relation.ref.surah);
    if (!verse || !surah) {
      unresolved.push({ ref: relation.ref, type: relation.type });
      continue;
    }
    resolved.push({ relation, verse, surah });
  }

  // Learning paths that reference this topic on one or more steps. A path
  // step's topicSlug is the editorial link between the path curriculum and
  // the topic catalog; showing paths here lets a reader continue from a
  // topic into a structured study sequence.
  const relatedPaths = PATHS.filter((path) =>
    path.steps.some((step) => step.topicSlug === topic.slug)
  );

  // Study journeys that reference this topic in their stages. Journeys are
  // dimension-targeted learning experiences that provide structured progression
  // through topics and ayat.
  const relatedJourneys = getJourneysForTopic(topic.slug);

  // Dimensions whose editorial navigation mapping lists this topic. Derived
  // from the same canonical `Dimension.topicSlugs` the Explore pages use, so
  // this is the exact reverse of the mapping a reader may have arrived from —
  // nothing new is asserted about the Quran's content.
  const dimensions = getDimensionsForTopic(topic.slug);

  // Domain-topic relationships from the Sprint 34 relationship layer. Each
  // relationship is an organizational proposal pending review, not a scholarly
  // classification. Resolve the domain record defensively so a broken relation
  // is dropped rather than rendered with a missing link target.
  const domainRelations = getTopicDomainRelations(topic.slug)
    .map((relation) => ({ relation, domain: getDomain(relation.domainId) }))
    .filter(
      (entry): entry is { relation: DomainTopicRelation; domain: Domain } =>
        Boolean(entry.domain)
    );

  // Topic → root cross-references (Sprint 40). Only links whose target root
  // passes canActivateRootTopic() are rendered — while Sabr is pending review
  // the mapping exists but shows nothing, so no reader is sent to a page that
  // withholds its results.
  const rootLinks = getTopicRootLinks(topic.slug);
  const activeRootLinks = rootLinks.filter((l) => l.active);

  const topicPagePath = `/topics/${topic.slug}`;

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Topics", path: "/topics" },
            { name: topic.title, path: topicPagePath },
          ]),
          topicJsonLd(topic),
        ]}
      />

      <header className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="arabic-display text-4xl text-gold" lang="ar" dir="rtl">
            {topic.arabicTitle}
          </span>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {topic.title}
          </h1>
        </div>
        <p className="max-w-prose text-muted-foreground">{topic.summary}</p>

        <div className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden />
            <span>
              Review status: {topic.provenance.status.replace(/-/g, " ")} — curated by {topic.provenance.curator} via {topic.provenance.method} (last pass {topic.provenance.reviewedAt}). Editorial content language: {LANGUAGE_LABELS[topic.language] ?? topic.language} ({topic.language}); the Quran text itself is always Arabic and is rendered verbatim from the pinned dataset. Editorial selections are not tafsir and are not intended as rulings.
            </span>
          </p>
        </div>
      </header>

      <section aria-label="Verses on this topic" className="space-y-4">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {resolved.length} of {topic.relations.length} curated verses shown
        </p>

        {unresolved.length > 0 && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            <p>
              {unresolved.length} curated reference{unresolved.length === 1 ? "" : "s"} on
              this topic could not be resolved against the pinned Quran dataset
              and {unresolved.length === 1 ? "is" : "are"} therefore not shown:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-0.5 text-xs">
              {unresolved.map((r) => (
                <li key={`${r.ref.surah}:${r.ref.ayah}`}>
                  {r.ref.surah}:{r.ref.ayah} — {r.type}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs">
              This is a data-integrity problem in the editorial selection, not a
              missing verse. It is surfaced rather than silently dropped so the
              count above is never overstated.
            </p>
          </div>
        )}

        {resolved.map(({ relation, verse, surah }) => (
          <TopicAyahCard
            key={`${relation.ref.surah}:${relation.ref.ayah}`}
            ayah={verse}
            surahTransliteration={surah.transliteration}
            type={relation.type}
            rationale={relation.rationale}
            provenance={relationProvenance(relation, topic)}
            provenanceScope={relation.provenance ? "relation" : "topic"}
          />
        ))}
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-topics" className="space-y-4">
          <h2
            id="related-topics"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Related topics
          </h2>
          <div className="flex flex-wrap gap-3">
            {related.map((t) => (
              <Link
                key={t.slug}
                href={`/topics/${t.slug}`}
                className="rounded-2xl border border-border/80 bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
              >
                <span className="arabic-display mr-2 text-lg text-gold" lang="ar" dir="rtl">
                  {t.arabicTitle}
                </span>
                {t.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {dimensions.length > 0 && (
        <section aria-labelledby="topic-dimensions" className="space-y-4">
          <h2
            id="topic-dimensions"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Explore this theme by dimension
          </h2>
          <p className="text-sm text-muted-foreground">
            This topic appears in the editorial navigation mapping for{" "}
            {dimensions.length === 1
              ? "the following dimension"
              : `these ${dimensions.length} dimensions`}
            . Each dimension page shows how this theme connects to other topics
            and offers search terms for further exploration.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {dimensions.map((dim) => (
              <Link
                key={dim.id}
                href={`/explore/dimension/${dim.id}`}
                className="group rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {dim.number}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {dim.title}
                    </h3>
                    <p
                      className="arabic-display text-lg text-gold mt-0.5"
                      lang="ar"
                      dir="rtl"
                    >
                      {dim.arabicTitle}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2">
                      {dim.covers}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-xs font-medium text-primary group-hover:underline">
                  Open {dim.title} dimension →
                </p>
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Dimension-to-topic mappings are editorial navigation aids, not
            ayah-level classifications. Each dimension page carries its review
            status.
          </p>
        </section>
      )}

      {domainRelations.length > 0 && (
        <section aria-labelledby="topic-domains" className="space-y-4">
          <h2
            id="topic-domains"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Proposed exploration domains
          </h2>
          <p className="text-sm text-muted-foreground">
            This topic is editorially proposed to belong to{" "}
            {domainRelations.length === 1
              ? "the following domain"
              : `these ${domainRelations.length} domains`}
            . These are organizational proposals pending review — not scholarly
            classifications of Quranic passages.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {domainRelations.map(({ relation, domain }) => (
              <Link
                key={relation.id}
                href={`/explore/domains/${domain.id}`}
                className="group rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {domain.title}
                    </h3>
                    {domain.arabicTitle && (
                      <p
                        className="arabic-display text-lg text-gold mt-0.5"
                        lang="ar"
                        dir="rtl"
                      >
                        {domain.arabicTitle}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-2">
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
                </div>
                <p className="mt-2 text-xs font-medium text-primary group-hover:underline">
                  Open {domain.title} domain →
                </p>
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Domain-topic relationships are organizational proposals, not scholarly
            conclusions. Each domain page carries its review status and explains
            what the relationship does and does not claim.
          </p>
        </section>
      )}

      {rootLinks.length > 0 && (
        <section aria-labelledby="topic-roots" className="space-y-4">
          <h2
            id="topic-roots"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Arabic root index
          </h2>
          {activeRootLinks.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-card/60 p-5 text-sm text-muted-foreground">
              <p>
                A word-occurrence index for the root{" "}
                <span lang="ar" dir="rtl" className="arabic-display text-gold">
                  {rootLinks[0].entry.roots[0]}
                </span>{" "}
                ({rootLinks[0].entry.title}) has been prepared from the QUL
                morphology dataset, but it is awaiting lemma review before it
                can be shown. The configuration for this link is in place; once
                a reviewer approves the lemma selection the link will appear
                here automatically.
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Word-occurrence index for the related Arabic root{" "}
                {activeRootLinks.length === 1 ? "" : "s"}. Each link opens the
                validated word-form list for that root — not a thematic
                classification of the ayat.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {activeRootLinks.map(({ link, entry }) => (
                  <Link
                    key={link.rootSlug}
                    href={`/explore/root/${entry.slug}`}
                    className="group rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                  >
                    <div className="flex items-start gap-3">
                      <span
                        className="arabic-display text-2xl text-gold"
                        lang="ar"
                        dir="rtl"
                      >
                        {entry.arabicTitle}
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                          {entry.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          Root: {entry.roots[0]}
                        </p>
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {link.note}
                    </p>
                    <p className="mt-2 text-xs font-medium text-primary group-hover:underline">
                      Open root index →
                    </p>
                  </Link>
                ))}
              </div>
            </>
          )}
          <p className="text-xs text-muted-foreground">
            Root-topic links are navigational aids, not scholarly claims that
            the ayat are thematically about the root. Each root page carries
            its own review status.
          </p>
        </section>
      )}

      {relatedPaths.length > 0 && (
        <section aria-labelledby="related-paths" className="space-y-4">
          <h2
            id="related-paths"
            className="font-display text-xl font-semibold tracking-tight"
          >
            Learning paths on this theme
          </h2>
          <div className="flex flex-wrap gap-3">
            {relatedPaths.map((path) => (
              <Link
                key={path.slug}
                href={`/learn/paths/${path.slug}`}
                className="rounded-2xl border border-border/80 bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
              >
                <span className="arabic-display mr-2 text-lg text-gold" lang="ar" dir="rtl">
                  {path.arabicTitle}
                </span>
                {path.title}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            These paths include steps that reference this topic. Each path
            marks its review status and is not tafsir.
          </p>
        </section>
      )}

      {/* Study journeys integration */}
      {relatedJourneys.length > 0 && (
        <section
          aria-labelledby="related-journeys-heading"
          className="rounded-2xl border border-border/80 bg-muted/30 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Map className="h-5 w-5 text-primary" aria-hidden />
            <h2
              id="related-journeys-heading"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Related Study Journeys
            </h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Structured learning experiences that include this topic. Each
            journey provides a guided progression through ayat and themes.
          </p>
          <ul className="space-y-3">
            {relatedJourneys.map((journey) => (
              <li key={journey.slug}>
                <Link
                  href={`/learn/journeys/${journey.slug}`}
                  className="group block rounded-xl border border-border/70 bg-background/50 p-4 transition-colors hover:border-primary/30 hover:bg-secondary/30"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary">
                        {journey.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                        {journey.summary}
                      </p>
                    </div>
                    <span
                      className="arabic-display text-xl text-gold shrink-0"
                      lang="ar"
                    >
                      {journey.arabicTitle}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>{journey.stages.length} stages</span>
                    <span aria-hidden>·</span>
                    <span>{journey.estimatedMinutes} min</span>
                    <span aria-hidden>·</span>
                    <span className="capitalize">{journey.difficulty}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FR-073: state the provenance model readers are looking at — including
          that every relation currently inherits the topic-level record because
          no relation has been individually reviewed yet. */}
      <div className="text-xs text-muted-foreground space-y-1">
        <p>
          Provenance: each verse above shows its effective review record — a
          relation with no individual review inherits the topic-level record
          (status, curator, method, last pass) displayed at the top. No
          relation on this topic has an individual review record yet. All
          displayed text originates from the source catalog listed on this
          site. No AI-generated exegesis is presented as scripture.
        </p>
      </div>
    </div>
  );
}
