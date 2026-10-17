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
  const featured = FEATURED_SURAH_IDS.map((id) =&gt;
    index.find((s) =&gt; s.id === id)
  ).filter((s): s is NonNullable&lt;typeof s&gt; =&gt; Boolean(s));
  const featuredTopics = TOPICS.slice(0, 6);

  return (
    &lt;div className="space-y-14 pb-8"&gt;
      {/* Hero ------------------------------------------------------------- */}
      &lt;section
        className="relative overflow-hidden pt-6 md:pt-12"
        aria-labelledby="hero-heading"
      &gt;
        &lt;div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 select-none text-center text-[7rem] leading-none text-gold/10 md:text-[10rem]"
          aria-hidden
        &gt;
          &lt;span className="arabic-display"&gt;اقرأ&lt;/span&gt;
        &lt;/div&gt;

        &lt;div className="mx-auto max-w-2xl text-center"&gt;
          &lt;p
            className="rise-in text-xs font-semibold uppercase tracking-[0.2em] text-gold"
            style={{ animationDelay: "0ms" }}
          &gt;
            {SITE_NAME}
          &lt;/p&gt;
          &lt;h1
            id="hero-heading"
            className="rise-in mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl"
            style={{ animationDelay: "70ms" }}
          &gt;
            Read the Quran with its sources in plain view
          &lt;/h1&gt;
          &lt;p
            className="rise-in mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "140ms" }}
          &gt;
            Uthmani text, a trusted English translation, stable references you
            can share, and calm search — no clutter, no streaks, nothing
            unattributed.
          &lt;/p&gt;

          &lt;div
            className="rise-in mx-auto mt-8 max-w-xl"
            style={{ animationDelay: "210ms" }}
          &gt;
            &lt;SearchBox /&gt;
            &lt;p className="mt-3 text-xs text-muted-foreground"&gt;
              Try “2:255”, “baqarah 153”, “patience”, or Arabic text.
            &lt;/p&gt;
          &lt;/div&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      {/* Verse of the day + continue reading ------------------------------ */}
      &lt;section className="grid gap-5 md:grid-cols-3" aria-label="Verse of the day"&gt;
        &lt;div className="md:col-span-2"&gt;
          &lt;article className="parchment-panel rounded-2xl border border-border/80 p-6 sm:p-8"&gt;
            &lt;div className="mb-4 flex items-center justify-between gap-3"&gt;
              &lt;h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"&gt;
                Verse of the day
              &lt;/h2&gt;
              {votd &amp;&amp; (
                &lt;Link
                  href={`/ayah/${votd.surah}/${votd.ayah}`}
                  className="text-xs font-medium text-primary hover:underline"
                &gt;
                  Open full page
                &lt;/Link&gt;
              )}
            &lt;/div&gt;

            {votd ? (
              &lt;&gt;
                &lt;p
                  lang="ar"
                  dir="rtl"
                  className="arabic-text text-[1.75rem] leading-[2.2] text-foreground sm:text-[2rem]"
                &gt;
                  {votd.verse.arabic}
                &lt;/p&gt;
                &lt;p className="mt-4 text-[1.05rem] leading-relaxed text-foreground/85"&gt;
                  {votd.verse.translation}
                &lt;/p&gt;
                &lt;p className="mt-4 text-sm font-medium text-gold"&gt;
                  {votd.surahTransliteration} · {votd.surah}:{votd.ayah}
                &lt;/p&gt;
              &lt;/&gt;
            ) : (
              &lt;p className="text-sm text-muted-foreground"&gt;
                Verse of the day is unavailable right now.
              &lt;/p&gt;
            )}
          &lt;/article&gt;
        &lt;/div&gt;

        &lt;div className="space-y-5"&gt;
          &lt;ContinueReading /&gt;

          &lt;section
            aria-labelledby="quick-sources-heading"
            className="rounded-2xl border border-border/80 bg-card p-5"
          &gt;
            &lt;div className="flex items-center gap-2 text-muted-foreground"&gt;
              &lt;ShieldCheck className="h-4 w-4" aria-hidden /&gt;
              &lt;h2
                id="quick-sources-heading"
                className="text-xs font-semibold uppercase tracking-wider"
              &gt;
                Every verse is attributed
              &lt;/h2&gt;
            &lt;/div&gt;
            &lt;p className="mt-3 text-sm leading-relaxed text-muted-foreground"&gt;
              Arabic text, translation, and transliteration each carry a
              license, publisher, and version you can inspect on the Sources
              page.
            &lt;/p&gt;
            &lt;Link
              href="/sources"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            &gt;
              Review sources
              &lt;ChevronRight className="h-4 w-4" aria-hidden /&gt;
            &lt;/Link&gt;
          &lt;/section&gt;
        &lt;/div&gt;
      &lt;/section&gt;

      {/* Featured surahs --------------------------------------------------- */}
      &lt;section aria-labelledby="featured-surahs-heading"&gt;
        &lt;div className="mb-5 flex items-end justify-between gap-4"&gt;
          &lt;div&gt;
            &lt;h2
              id="featured-surahs-heading"
              className="font-display text-2xl font-semibold tracking-tight"
            &gt;
              Start reading
            &lt;/h2&gt;
            &lt;p className="mt-1 text-sm text-muted-foreground"&gt;
              Common entry points — or browse all 114 surahs.
            &lt;/p&gt;
          &lt;/div&gt;
          &lt;Link
            href="/quran"
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          &gt;
            &lt;BookOpen className="h-4 w-4" aria-hidden /&gt;
            All surahs
          &lt;/Link&gt;
        &lt;/div&gt;

        &lt;ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"&gt;
          {featured.map((surah) =&gt; (
            &lt;li key={surah.id}&gt;
              &lt;Link
                href={`/quran/${surah.slug}`}
                className="group flex h-full items-center gap-4 rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              &gt;
                &lt;span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/40 font-display text-sm font-semibold text-gold"
                  aria-hidden
                &gt;
                  {surah.id}
                &lt;/span&gt;
                &lt;span className="min-w-0 flex-1"&gt;
                  &lt;span className="block truncate font-medium text-foreground"&gt;
                    {surah.transliteration}
                  &lt;/span&gt;
                  &lt;span className="block truncate text-sm text-muted-foreground"&gt;
                    {surah.meaning} · {surah.ayahCount} ayat
                  &lt;/span&gt;
                &lt;/span&gt;
                &lt;span
                  className="arabic-display shrink-0 text-xl text-foreground/70"
                  lang="ar"
                  dir="rtl"
                  aria-hidden
                &gt;
                  {surah.arabicName}
                &lt;/span&gt;
              &lt;/Link&gt;
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      &lt;/section&gt;

      {/* Topics ------------------------------------------------------------ */}
      &lt;section aria-labelledby="topics-heading"&gt;
        &lt;div className="mb-5 flex items-end justify-between gap-4"&gt;
          &lt;div&gt;
            &lt;h2
              id="topics-heading"
              className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight"
            &gt;
              &lt;Sparkles className="h-5 w-5 text-gold" aria-hidden /&gt;
              Explore by topic
            &lt;/h2&gt;
            &lt;p className="mt-1 text-sm text-muted-foreground"&gt;
              Editorial entry points with review status — not tafsir.
            &lt;/p&gt;
          &lt;/div&gt;
          &lt;Link
            href="/topics"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          &gt;
            All topics
            &lt;ChevronRight className="h-4 w-4" aria-hidden /&gt;
          &lt;/Link&gt;
        &lt;/div&gt;

        &lt;ul className="flex flex-wrap gap-2.5"&gt;
          {featuredTopics.map((topic) =&gt; (
            &lt;li key={topic.slug}&gt;
              &lt;Link
                href={`/topics/${topic.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-secondary/50"
              &gt;
                &lt;span
                  className="arabic-display text-base text-gold"
                  lang="ar"
                  aria-hidden
                &gt;
                  {topic.arabicTitle}
                &lt;/span&gt;
                {topic.title}
              &lt;/Link&gt;
            &lt;/li&gt;
          ))}
        &lt;/ul&gt;
      &lt;/section&gt;
    &lt;/div&gt;
  );
}
