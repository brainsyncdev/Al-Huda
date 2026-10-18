import Link from "next/link";
import { BookOpen, ChevronRight, ShieldCheck, Sparkles } from "lucide-react";
import { SearchBox } from "@/components/search/search-box";
import { ContinueReading } from "@/components/home/continue-reading";
import { getVerseOfDay } from "@/lib/quran/verse-of-day";
import { getSurahIndex } from "@/lib/quran/data";
import { TOPICS } from "@/lib/topics/data";
import { SITE_NAME } from "@/lib/site";

/** Featured surahs shown as quick entry points (widely read selections). */
const FEATURED_SURAH_IDS = [1, 2, 36, 55, 67, 18] as const;

export default function HomePage() {
  const votd = getVerseOfDay();
  const index = getSurahIndex();
  const featured = FEATURED_SURAH_IDS.map((id) =>
    index.find((s) => s.id === id)
  ).filter((s): s is NonNullable<typeof s> => Boolean(s));
  const featuredTopics = TOPICS.slice(0, 6);

  return (
    <div className="space-y-14 pb-8">
      {/* Hero ------------------------------------------------------------- */}
      <section
        className="relative overflow-hidden pt-6 md:pt-12"
        aria-labelledby="hero-heading"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 select-none text-center text-[7rem] leading-none text-gold/10 md:text-[10rem]"
          aria-hidden
        >
          <span className="arabic-display">اقرأ</span>
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <p
            className="rise-in text-xs font-semibold uppercase tracking-[0.2em] text-gold"
            style={{ animationDelay: "0ms" }}
          >
            {SITE_NAME}
          </p>
          <h1
            id="hero-heading"
            className="rise-in mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl"
            style={{ animationDelay: "70ms" }}
          >
            Read the Quran with its sources in plain view
          </h1>
          <p
            className="rise-in mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            Uthmani text, a trusted English translation, stable references you
            can share, and calm search — no clutter, no streaks, nothing
            unattributed.
          </p>

          <div
            className="rise-in mx-auto mt-8 max-w-xl"
            style={{ animationDelay: "210ms" }}
          >
            <SearchBox />
            <p className="mt-3 text-xs text-muted-foreground">
              Try “2:255”, “baqarah 153”, “patience”, or Arabic text.
            </p>
          </div>
        </div>
      </section>

      {/* Verse of the day + continue reading ------------------------------ */}
      <section className="grid gap-5 md:grid-cols-3" aria-label="Verse of the day">
        <div className="md:col-span-2">
          <article className="parchment-panel rounded-2xl border border-border/80 p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Verse of the day
              </h2>
              {votd && (
                <Link
                  href={`/ayah/${votd.surah}/${votd.ayah}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Open full page
                </Link>
              )}
            </div>

            {votd ? (
              <>
                <p
                  lang="ar"
                  dir="rtl"
                  className="arabic-text text-[1.75rem] leading-[2.2] text-foreground sm:text-[2rem]"
                >
                  {votd.verse.arabic}
                </p>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-foreground/85">
                  {votd.verse.translation}
                </p>
                <p className="mt-4 text-sm font-medium text-gold">
                  {votd.surahTransliteration} · {votd.surah}:{votd.ayah}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Verse of the day is unavailable right now.
              </p>
            )}
          </article>
        </div>

        <div className="space-y-5">
          <ContinueReading />

          <section
            aria-labelledby="quick-sources-heading"
            className="rounded-2xl border border-border/80 bg-card p-5"
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              <h2
                id="quick-sources-heading"
                className="text-xs font-semibold uppercase tracking-wider"
              >
                Every verse is attributed
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Arabic text, translation, and transliteration each carry a
              license, publisher, and version you can inspect on the Sources
              page.
            </p>
            <Link
              href="/sources"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              Review sources
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </section>
        </div>
      </section>

      {/* Featured surahs --------------------------------------------------- */}
      <section aria-labelledby="featured-surahs-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2
              id="featured-surahs-heading"
              className="font-display text-2xl font-semibold tracking-tight"
            >
              Start reading
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Common entry points — or browse all 114 surahs.
            </p>
          </div>
          <Link
            href="/quran"
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            All surahs
          </Link>
        </div>

        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((surah) => (
            <li key={surah.id}>
              <Link
                href={`/quran/${surah.slug}`}
                className="group flex h-full items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-sm font-semibold text-gold"
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
        </ul>
      </section>

      {/* Topics ------------------------------------------------------------ */}
      <section aria-labelledby="topics-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2
              id="topics-heading"
              className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight"
            >
              <Sparkles className="h-5 w-5 text-gold" aria-hidden />
              Explore by topic
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Editorial entry points with review status — not tafsir.
            </p>
          </div>
          <Link
            href="/topics"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            All topics
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="flex flex-wrap gap-2.5">
          {featuredTopics.map((topic) => (
            <li key={topic.slug}>
              <Link
                href={`/topics/${topic.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/50"
              >
                <span
                  className="arabic-display text-base text-gold"
                  lang="ar"
                  aria-hidden
                >
                  {topic.arabicTitle}
                </span>
                {topic.title}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
