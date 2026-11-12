import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AyahCard } from "@/components/quran/ayah-card";
import { ReaderControls } from "@/components/quran/reader-controls";
import { SourcePanel } from "@/components/quran/source-panel";
import { TafsirLinks } from "@/components/quran/tafsir-links";
import { TafsirViewer } from "@/components/quran/tafsir-viewer";
import { WordByWord } from "@/components/quran/word-by-word";
import { getAyah, getSurah, getSurahIndex } from "@/lib/quran/data";
import { ayahPath, surahPath } from "@/lib/quran/reference";
import { SITE_NAME, absoluteUrl } from "@/lib/site";
import { topicsForAyah } from "@/lib/topics/data";
import { PATHS } from "@/lib/paths/data";
import {
  getJuzForAyah,
  getPageForAyah,
  getHizbForAyah,
  getRukuForAyah,
  getManzilForAyah,
  isSajdaAyah,
} from "@/lib/quran/juz";
import { crossReferencesForAyah } from "@/lib/quran/cross-references";
import {
  CrossReferencePanel,
} from "@/components/quran/cross-reference-panel";
import { JsonLd } from "@/components/seo/json-ld";
import { HOME_CRUMB, ayahJsonLd, breadcrumbs } from "@/lib/seo/json-ld";
import { RootContextPanel } from "@/components/quran/root-context-panel";
import {
  getSprint48RootBySlug,
  loadSprint48OccurrenceFile,
} from "@/lib/morphology/sprint-48-root-data";
import { getServerTranslation } from "@/lib/i18n/server-translate";
import { getCanonicalTopic } from "@/lib/taxonomy/canonical-adapter";
import topicAyahMappings from "../../../../../data/taxonomy/topic-ayah-mappings.json";
import {
  getMappingTypeLabel,
  getMappingTypeDescription,
  getMappingTypeCategory,
  getReviewStatusInfo,
} from "@/lib/taxonomy/mapping-type-labels";

interface AyahMapping {
  id: string;
  topicId: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  mappingType: string;
  rationale: string;
  sourceIds: string[];
  provenance: string;
  status: string;
}

interface Props {
  params: Promise<{ surah: string; ayah: string }>;
  searchParams: Promise<{ from?: string; root?: string }>;
}

/**
 * Sprint 50: Build root context for ayah reader when navigating from root discovery.
 * Returns null if the root or occurrence data is not available.
 */
function buildRootContext(
  rootSlug: string,
  surah: number,
  ayah: number
): {
  root: string;
  slug: string;
  transliteration?: string;
  lemma?: string;
  occurrenceIndex: number;
  totalOccurrences: number;
  prevOccurrence?: { surah: number; ayah: number };
  nextOccurrence?: { surah: number; ayah: number };
} | null {
  const rootEntry = getSprint48RootBySlug(rootSlug);
  if (!rootEntry) return null;

  const occurrenceFile = loadSprint48OccurrenceFile(rootSlug);
  if (!occurrenceFile || occurrenceFile.totalMatches === 0) return null;

  // Find occurrences of this ayah in the root
  const ayahOccurrences = occurrenceFile.occurrences.filter(
    (occ) => occ.ref.surah === surah && occ.ref.ayah === ayah
  );

  if (ayahOccurrences.length === 0) return null;

  // Use the first occurrence for context
  const firstOcc = ayahOccurrences[0];
  const occurrenceIndex = occurrenceFile.occurrences.indexOf(firstOcc) + 1;

  // Find previous and next occurrences for navigation
  const prevOcc = occurrenceIndex > 1 ? occurrenceFile.occurrences[occurrenceIndex - 2] : undefined;
  const nextOcc = occurrenceIndex < occurrenceFile.totalMatches ? occurrenceFile.occurrences[occurrenceIndex] : undefined;

  return {
    root: rootEntry.root,
    slug: rootSlug,
    transliteration: rootEntry.transliteration,
    lemma: firstOcc.matchedLemma,
    occurrenceIndex,
    totalOccurrences: occurrenceFile.totalMatches,
    prevOccurrence: prevOcc ? { surah: prevOcc.ref.surah, ayah: prevOcc.ref.ayah } : undefined,
    nextOccurrence: nextOcc ? { surah: nextOcc.ref.surah, ayah: nextOcc.ref.ayah } : undefined,
  };
}

/**
 * Pre-render every canonical ayah at build time. The 6,236 routes are derived
 * from the pinned dataset (getSurahIndex + ayahCount) so the static params can
 * never invent a reference the page wouldn't resolve.
 */
export async function generateStaticParams() {
  const index = getSurahIndex();
  const params: { surah: string; ayah: string }[] = [];
  for (const surah of index) {
    for (let ayah = 1; ayah <= surah.ayahCount; ayah++) {
      params.push({ surah: String(surah.id), ayah: String(ayah) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surah, ayah } = await params;
  const s = Number(surah);
  const a = Number(ayah);
  if (!Number.isInteger(s) || !Number.isInteger(a)) return {};
  const verse = getAyah(s, a);
  if (!verse) return {};
  const surahMeta = getSurah(s);
  const ayahCanonical = absoluteUrl(ayahPath({ surah: s, ayah: a }));
  return {
    title: `Quran ${s}:${a} — ${surahMeta?.transliteration ?? s}`,
    description: `Ayah ${s}:${a} (${surahMeta?.transliteration ?? "Surah"}). Uthmani Arabic with translation in 100+ languages (default: Urdu — Jalandhry).`,
    alternates: { canonical: ayahCanonical },
    openGraph: {
      title: `Quran ${s}:${a} — ${surahMeta?.transliteration ?? s}`,
      description: `Ayah ${s}:${a} from Surah ${surahMeta?.transliteration ?? "the Quran"}. Uthmani Arabic with translation.`,
      url: ayahCanonical,
      type: "article",
      siteName: SITE_NAME,
    },
  };
}

export default async function AyahPage({ params, searchParams }: Props) {
  const { surah, ayah } = await params;
  const { from, root: rootSlug } = await searchParams;
  const s = Number(surah);
  const a = Number(ayah);
  if (!Number.isInteger(s) || !Number.isInteger(a)) return notFound();
  const verse = getAyah(s, a);
  const surahMeta = getSurah(s);
  if (!verse || !surahMeta) return notFound();
  const t = await getServerTranslation();

  const prev =
    a > 1
      ? { surah: s, ayah: a - 1 }
      : s > 1
        ? { surah: s - 1, ayah: getSurah(s - 1)?.ayahCount ?? 1 }
        : null;
  const next =
    a < surahMeta.ayahCount
      ? { surah: s, ayah: a + 1 }
      : s < 114
        ? { surah: s + 1, ayah: 1 }
        : null;

  const topics = topicsForAyah({ surah: s, ayah: a });

  // MFD-07 Phase 9 + MFD-08 Phase 8: Find canonical topics that reference this ayah.
  // Derives from the pinned topic-ayah-mappings dataset; no fabrication.
  // Now includes mapping type and review status for transparency.
  const canonicalTopicsForAyah = (() => {
    const mappings = topicAyahMappings as AyahMapping[];
    const topicMap = new Map<string, { topic: NonNullable<ReturnType<typeof getCanonicalTopic>>; mapping: AyahMapping }>();
    for (const m of mappings) {
      if (
        m.surahNumber === s &&
        m.ayahStart <= a &&
        m.ayahEnd >= a
      ) {
        const topic = getCanonicalTopic(m.topicId);
        if (topic && !topicMap.has(m.topicId)) {
          topicMap.set(m.topicId, { topic, mapping: m });
        }
      }
    }
    return Array.from(topicMap.values());
  })();

  const juz = getJuzForAyah(s, a);
  const page = getPageForAyah(s, a);
  const hizb = getHizbForAyah(s, a);
  const ruku = getRukuForAyah(s, a);
  const manzil = getManzilForAyah(s, a);
  const isSajda = isSajdaAyah(s, a);
  // Derived from the pinned dataset, so it costs one already-loaded surah and
  // cannot assert anything an editor or a model invented.
  const crossRefs = crossReferencesForAyah({ surah: s, ayah: a });

  // Learning paths that include this ayah. Derived from the curated path
  // dataset, so it only shows paths that actually step on this reference.
  const relatedPaths = PATHS.filter((path) =>
    path.steps.some(
      (step) => step.ref.surah === s && step.ref.ayah === a
    )
  );

  // Sprint 50: Root context when navigating from root discovery
  const rootContext = from === "root" && rootSlug
    ? buildRootContext(rootSlug, s, a)
    : null;

  const ayahPagePath = ayahPath({ surah: s, ayah: a });

  return (

    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Quran", path: "/quran" },
            {
              name: surahMeta.transliteration,
              path: surahPath(surahMeta.id, surahMeta.slug),
            },
            { name: `${s}:${a}`, path: ayahPagePath },
          ]),
          // Derives its own absolute URL from the reference, so the markup and
          // the canonical tag in generateMetadata cannot disagree.
          ayahJsonLd(verse, surahMeta),
        ]}
      />

      <header className="parchment-panel rounded-2xl border border-border/80 p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              {t("quran.ayahReference")}
            </p>
            <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {surahMeta.transliteration} {s}:{a}
            </h1>
            <p className="text-sm text-muted-foreground">
              Surah {s} of 114 · {surahMeta.meaning} · {surahMeta.revelation}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {juz && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  Juz {juz}
                </span>
              )}
              {page && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  Page {page}
                </span>
              )}
              {hizb && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  Hizb {hizb}
                </span>
              )}
              {ruku && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  Ruku {ruku}
                </span>
              )}
              {manzil && (
                <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
                  Manzil {manzil}
                </span>
              )}
              {isSajda && (
                <span className="inline-flex items-center gap-1 rounded-full bg-gold-soft px-2.5 py-1 text-xs font-semibold text-accent-foreground">
                  Sajda verse
                </span>
              )}
            </div>
          </div>
          <Link
            href={surahPath(surahMeta.id, surahMeta.slug)}
            className="rounded-full border border-border/80 bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            {t("quran.readFullSurah")}
          </Link>
        </div>
      </header>

      <ReaderControls />

      <AyahCard
        ayah={verse}
        surahTransliteration={surahMeta.transliteration}
        variant="full"
      />

      {rootContext && (
        <RootContextPanel
          root={rootContext.root}
          slug={rootContext.slug}
          transliteration={rootContext.transliteration}
          lemma={rootContext.lemma}
          occurrenceIndex={rootContext.occurrenceIndex}
          totalOccurrences={rootContext.totalOccurrences}
          prevOccurrence={rootContext.prevOccurrence}
          nextOccurrence={rootContext.nextOccurrence}
        />
      )}

      {topics.length > 0 && (
        <section
          aria-labelledby="topics-for-ayah"
          className="rounded-2xl border border-border/80 bg-card p-5"
        >
          <h2
            id="topics-for-ayah"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {t("quran.appearsInTopics")}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {topics.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/topics/${t.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="arabic-display text-base text-gold">
                    {t.arabicTitle}
                  </span>
                  {t.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Editorial topics are curated thematic connections. Topic pages mark the review status and are not tafsir.
          </p>
        </section>
      )}

      {canonicalTopicsForAyah.length > 0 && (
        <section
          aria-labelledby="canonical-topics-for-ayah"
          className="rounded-2xl border border-primary/30 bg-primary/5 p-5"
        >
          <h2
            id="canonical-topics-for-ayah"
            className="text-xs font-semibold uppercase tracking-wider text-primary"
          >
            Canonical Topics
          </h2>
          <p className="mt-2 text-xs text-muted-foreground">
            Taxonomy-driven references from the expanded canonical topic system.
          </p>
          <ul className="mt-3 space-y-3">
            {canonicalTopicsForAyah.map(({ topic, mapping }) => {
              const typeLabel = getMappingTypeLabel(mapping.mappingType);
              const typeDescription = getMappingTypeDescription(mapping.mappingType);
              const typeCategory = getMappingTypeCategory(mapping.mappingType);
              const statusInfo = getReviewStatusInfo(mapping.status);
              
              return (
                <li key={topic.id} className="rounded-xl border border-border/60 bg-card/60 p-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/explore/topics/${topic.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        {topic.arabicTitle && (
                          <span className="arabic-display text-base text-gold">
                            {topic.arabicTitle}
                          </span>
                        )}
                        {topic.title}
                      </Link>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-foreground">
                        {typeLabel}
                        {typeCategory === 'editorial' && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider font-medium text-muted-foreground">Editorial association</span>
                        )}
                      </p>
                      {typeDescription && (
                        <p className="text-xs text-muted-foreground italic">
                          {typeDescription}
                        </p>
                      )}
                      {mapping.rationale && (
                        <p className="text-xs text-muted-foreground">
                          {mapping.rationale}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Canonical topics are part of the expanded taxonomy and are pending scholarly review.
          </p>
        </section>
      )}

      {relatedPaths.length > 0 && (
        <section
          aria-labelledby="paths-for-ayah"
          className="rounded-2xl border border-border/80 bg-card p-5"
        >
          <h2
            id="paths-for-ayah"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {t("quran.appearsInPaths")}
          </h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {relatedPaths.map((path) => (
              <li key={path.slug}>
                <Link
                  href={`/learn/paths/${path.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary px-3.5 py-1.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="arabic-display text-base text-gold">
                    {path.arabicTitle}
                  </span>
                  {path.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Learning paths are curated study sequences. Each path marks its
            review status and is not tafsir.
          </p>
        </section>
      )}

      <CrossReferencePanel items={crossRefs} />

      <WordByWord surah={s} ayah={a} />
      <TafsirViewer surah={s} ayah={a} />
      <TafsirLinks surah={s} ayah={a} />
      <SourcePanel />

      <nav className="flex flex-wrap items-center justify-between gap-3">
        {prev && (
          <Link
            href={ayahPath(prev)}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            {t("quran.previousAyah", { surah: prev.surah, ayah: prev.ayah })}
          </Link>
        )}
        {next && (
          <Link
            href={ayahPath(next)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            {t("quran.nextAyah", { surah: next.surah, ayah: next.ayah })}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </nav>
    </div>
  );
}
