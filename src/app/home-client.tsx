"use client";

import Link from "next/link";
import { BookOpen, ChevronRight, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { SearchBox } from "@/components/search/search-box";
import { ContinueReading } from "@/components/home/continue-reading";
import { VerseOfDayDisplay } from "@/components/home/verse-of-day";
import { LearningHub } from "@/components/home/learning-hub";
import { useTranslation } from "@/lib/i18n/context";
import type { SurahMeta } from "@/lib/quran/types";
import type { Topic } from "@/lib/topics/data";
import type { Dimension } from "@/lib/explore/dimensions";

interface HomeClientProps {
  featured: SurahMeta[];
  featuredTopics: Topic[];
  dimensions: Dimension[];
  siteName: string;
}

export function HomeClient({ featured, featuredTopics, dimensions, siteName }: HomeClientProps) {
  const t = useTranslation();

  return (
    <>
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
            {siteName}
          </p>
          <h1
            id="hero-heading"
            className="rise-in mt-3 font-display text-4xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl"
            style={{ animationDelay: "70ms" }}
          >
            {t("home.heroTitle")}
          </h1>
          <p
            className="rise-in mt-4 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "140ms" }}
          >
            {t("home.heroDescription")}
          </p>

          <div
            className="rise-in mx-auto mt-8 max-w-xl"
            style={{ animationDelay: "210ms" }}
          >
            <SearchBox />
            <p className="mt-3 text-xs text-muted-foreground">
              {t("home.searchHint")}
            </p>
            <p className="mt-3 text-sm">
              <Link
                href="/discover"
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
              >
                {t("home.discoverLink")}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Verse of the day + continue reading ------------------------------ */}
      <section className="grid gap-5 md:grid-cols-3" aria-label={t("home.verseOfDay")}>
        <div className="md:col-span-2">
          <article className="parchment-panel rounded-2xl border border-border/80 p-6 sm:p-8">
            <VerseOfDayDisplay />
          </article>
        </div>

        <div className="space-y-5">
          <ContinueReading />
          <LearningHub />

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
                {t("home.attributedHeading")}
              </h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {t("home.attributedDescription")}
            </p>
            <Link
              href="/sources"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("home.reviewSources")}
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
              {t("home.startReading")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("home.featuredSurahsDescription")}
            </p>
          </div>
          <Link
            href="/quran"
            className="inline-flex items-center gap-1 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <BookOpen className="h-4 w-4" aria-hidden />
            {t("home.allSurahs")}
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
                    {surah.meaning} · {surah.ayahCount} {t("home.ayat")}
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

      {/* Explore: 10 dimensions ------------------------------------------- */}
      <section aria-labelledby="explore-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2
              id="explore-heading"
              className="flex items-center gap-2 font-display text-2xl font-semibold tracking-tight"
            >
              <Compass className="h-5 w-5 text-primary" aria-hidden />
              {t("home.exploreByDimension")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("home.dimensionsDescription")}
            </p>
          </div>
          <Link
            href="/explore"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("home.allDimensions")}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {dimensions.map((dim) => (
            <li key={dim.id}>
              <Link
                href={`/explore/dimension/${dim.id}`}
                className="group flex h-full flex-col gap-1.5 rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {dim.number}
                </span>
                <span className="font-medium text-sm transition-colors group-hover:text-primary">
                  {dim.title}
                </span>
                <span
                  className="arabic-display text-base text-gold"
                  lang="ar"
                  dir="rtl"
                  aria-hidden
                >
                  {dim.arabicTitle}
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
              {t("home.exploreByTopic")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("home.topicsDescription")}
            </p>
          </div>
          <Link
            href="/topics"
            className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
          >
            {t("home.allTopics")}
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
    </>
  );
}
