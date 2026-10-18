import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { TopicAyahCard } from "@/components/topics/topic-ayah-card";
import { getAyah, getSurah } from "@/lib/quran/data";
import { TOPICS, getTopic } from "@/lib/topics/data";
import { absoluteUrl } from "@/lib/site";

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
  };
}

export default async function TopicDetailPage({ params }: Props) {
  const { slug } = await params;
  const topic = getTopic(slug);
  if (!topic) return notFound();

  const related = topic.related
    .map((s) => getTopic(s))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="space-y-8 pb-8">
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
              Review status: {topic.provenance.status.replace(/-/g, " ")} — curated by {topic.provenance.curator} via {topic.provenance.method} (last pass {topic.provenance.reviewedAt}). Editorial selections are not tafsir and are not intended as rulings.
            </span>
          </p>
        </div>
      </header>

      <section aria-label="Verses on this topic" className="space-y-4">
        {topic.relations.map((relation) => {
          const verse = getAyah(relation.ref.surah, relation.ref.ayah);
          const surah = getSurah(relation.ref.surah);
          if (!verse || !surah) return null;
          return (
            <TopicAyahCard
              key={`${relation.ref.surah}:${relation.ref.ayah}`}
              ayah={verse}
              surahTransliteration={surah.transliteration}
              type={relation.type}
              rationale={relation.rationale}
            />
          );
        })}
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

      <div className="text-xs text-muted-foreground">
        <p>Provenance: see each relation type label and the rationale above. All displayed text originates from the source catalog listed on this site. No AI-generated exegesis is presented as scripture.</p>
      </div>
    </div>
  );
}
