import type { Metadata } from "next";
import Link from "next/link";
import { getSurahIndex } from "@/lib/quran/data";
import { JsonLd } from "@/components/seo/json-ld";
import {
  HOME_CRUMB,
  breadcrumbs,
  surahIndexJsonLd,
} from "@/lib/seo/json-ld";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Quran",
  description:
    "Browse all 114 surahs with Arabic names, transliteration, verse counts, and stable links into the reader.",
  alternates: { canonical: absoluteUrl("/quran") },
  openGraph: {
    title: "Quran — surah index",
    description:
      "All 114 surahs with Arabic names, transliteration, and verse counts.",
    url: absoluteUrl("/quran"),
  },
};

export default function QuranIndexPage() {
  const surahs = getSurahIndex();

  return (
    <div className="space-y-6 pb-8">
      <JsonLd
              nodes={[
                breadcrumbs([HOME_CRUMB, { name: "Quran", path: "/quran" }]),
                surahIndexJsonLd(surahs),
              ]}
            />

      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Quran
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Every surah, in canonical order, with its Arabic name and verse
          count. Select one to read its full text.
        </p>
      </header>

      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {surahs.map((surah) => (
          <li key={surah.id}>
            <Link
              href={`/quran/${surah.slug}`}
              className="group flex h-full items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-sm font-semibold text-gold"
                aria-hidden
              >
                {surah.id}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium text-foreground">
                  {surah.transliteration}
                </span>
                <span className="block truncate text-sm text-muted-foreground">
                  {surah.meaning} · {surah.ayahCount} ayat
                </span>
              </span>
              <span
                className="arabic-display shrink-0 text-xl text-foreground/70"
                lang="ar"
                dir="rtl"
                aria-hidden
              >
                {surah.arabicName}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
