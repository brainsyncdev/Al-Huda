import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AyahCard } from "@/components/quran/ayah-card";
import { ReaderControls } from "@/components/quran/reader-controls";
import { SourcePanel } from "@/components/quran/source-panel";
import { TafsirLinks } from "@/components/quran/tafsir-links";
import { getSurah, getSurahIdBySlug, getSurahIndex } from "@/lib/quran/data";
import { absoluteUrl } from "@/lib/site";
import { getJuzForAyah } from "@/lib/quran/juz";
import { lexicalMatchGroups } from "@/lib/quran/cross-references";
import { LexicalMatchGroupsPanel } from "@/components/quran/cross-reference-panel";
import { JsonLd } from "@/components/seo/json-ld";
import {
  HOME_CRUMB,
  breadcrumbs,
  chapterJsonLd,
  quranJsonLd,
} from "@/lib/seo/json-ld";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getSurahIndex().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const id = getSurahIdBySlug(slug);
  if (!id) return {};
  const surah = getSurah(id);
  if (!surah) return {};
  return {
    title: `${surah.transliteration} — ${surah.meaning}`,
    description: `Read Surah ${surah.transliteration} (${surah.arabicName}) — ${surah.ayahCount} ayat, ${surah.revelation}. Uthmani text with 100+ translations in 50+ languages.`,
    alternates: { canonical: absoluteUrl(`/quran/${surah.slug}`) },
  };
}

export default async function SurahPage({ params }: Props) {
  const { slug } = await params;
  const id = getSurahIdBySlug(slug);
  if (!id) return notFound();
  const surah = getSurah(id);
  if (!surah) return notFound();

  const index = getSurahIndex();
  const prev = surah.id > 1 ? index[surah.id - 2] : null;
  const next = surah.id < 114 ? index[surah.id] : null;

  // Compute Juz range for this surah
  const firstJuz = getJuzForAyah(surah.id, 1);
  const lastJuz = getJuzForAyah(surah.id, surah.ayahCount);
  const juzLabel =
    firstJuz && lastJuz
      ? firstJuz === lastJuz
        ? `Juz ${firstJuz}`
        : `Juz ${firstJuz}–${lastJuz}`
      : null;

  // FR-024 accessible list view: repeated wording within this surah, derived
  // from the dataset rather than curated. Bounded by this surah only.
  const lexicalGroups = lexicalMatchGroups(surah.id);

  // Same path shape generateMetadata already uses for its canonical tag, so
  // the markup and the canonical cannot disagree.
  const surahPagePath = `/quran/${surah.slug}`;

  return (
    <div className="space-y-8 pb-8">
      <JsonLd
        nodes={[
          breadcrumbs([
            HOME_CRUMB,
            { name: "Quran", path: "/quran" },
            { name: surah.transliteration, path: surahPagePath },
          ]),
          quranJsonLd(),
                    chapterJsonLd(surah),
        ]}
      />

      <header className="parchment-panel rounded-2xl border border-border/80 p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="min-w-0 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Surah {surah.id}
            </p>
            <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {surah.transliteration}
            </h1>
            <p className="text-base text-muted-foreground">
              {surah.meaning} · {surah.arabicName} · {surah.revelation} ·{" "}
              {surah.ayahCount} ayat{ juzLabel && <> · {juzLabel}</>}
            </p>
            <p className="max-w-prose text-sm text-muted-foreground">
              Read continuously below. Use the controls to adjust Arabic size
              and toggle translation/transliteration.
            </p>
          </div>
          <div className="text-right">
            <p
              lang="ar"
              dir="rtl"
              className="arabic-display text-4xl leading-tight sm:text-5xl"
            >
              {surah.arabicName}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {prev && (
              <Link
                href={`/quran/${prev.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                {prev.transliteration} ({prev.id})
              </Link>
            )}
            {next && (
              <Link
                href={`/quran/${next.slug}`}
                className="inline-flex items-center gap-1 rounded-full border border-border/80 bg-secondary px-3.5 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {next.transliteration} ({next.id})
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Navigate by ayah number or use the table of contents in index.
          </p>
        </div>
      </header>

      <ReaderControls />

      <LexicalMatchGroupsPanel groups={lexicalGroups} />

      <section aria-label="Surah verses" className="space-y-4">
        {surah.ayat.map((ayah) => (
          <AyahCard
            key={ayah.ayah}
            ayah={ayah}
            surahTransliteration={surah.transliteration}
            variant="full"
          />
        ))}
      </section>

      <TafsirLinks surah={surah.id} />
      <SourcePanel />

      <nav className="flex flex-wrap items-center justify-between gap-3">
        {prev && (
          <Link
            href={`/quran/${prev.slug}`}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Previous: {prev.transliteration}
          </Link>
        )}
        {next && (
          <Link
            href={`/quran/${next.slug}`}
            className="ml-auto inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            Next: {next.transliteration}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </nav>
    </div>
  );
}
