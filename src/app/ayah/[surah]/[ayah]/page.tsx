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
import { getAyah, getSurah } from "@/lib/quran/data";
import { ayahPath, surahPath } from "@/lib/quran/reference";
import { absoluteUrl } from "@/lib/site";
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

interface Props {
  params: Promise<{ surah: string; ayah: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surah, ayah } = await params;
  const s = Number(surah);
  const a = Number(ayah);
  if (!Number.isInteger(s) || !Number.isInteger(a)) return {};
  const verse = getAyah(s, a);
  if (!verse) return {};
  const surahMeta = getSurah(s);
  return {
    title: `Quran ${s}:${a} — ${surahMeta?.transliteration ?? s}`,
    description: `Ayah ${s}:${a} (${surahMeta?.transliteration ?? "Surah"}). Uthmani Arabic with translation in 100+ languages (default: Urdu — Jalandhry).`,
    alternates: { canonical: absoluteUrl(ayahPath({ surah: s, ayah: a })) },
  };
}

export default async function AyahPage({ params }: Props) {
  const { surah, ayah } = await params;
  const s = Number(surah);
  const a = Number(ayah);
  if (!Number.isInteger(s) || !Number.isInteger(a)) return notFound();
  const verse = getAyah(s, a);
  const surahMeta = getSurah(s);
  if (!verse || !surahMeta) return notFound();

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
              Ayah reference
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
            Read full surah
          </Link>
        </div>
      </header>

      <ReaderControls />

      <AyahCard
        ayah={verse}
        surahTransliteration={surahMeta.transliteration}
        variant="full"
      />

      {topics.length > 0 && (
        <section
          aria-labelledby="topics-for-ayah"
          className="rounded-2xl border border-border/80 bg-card p-5"
        >
          <h2
            id="topics-for-ayah"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Appears in topics
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
            Topic pages mark the review status and are not tafsir.
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
            Appears in learning paths
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
            Previous · {prev.surah}:{prev.ayah}
          </Link>
        )}
        {next && (
          <Link
            href={ayahPath(next)}
            className="ml-auto inline-flex items-center gap-1.5 rounded-2xl border border-border/80 bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-secondary/50"
          >
            Next · {next.surah}:{next.ayah}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        )}
      </nav>
    </div>
  );
}
