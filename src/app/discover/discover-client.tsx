"use client";

import Link from "next/link";
import { BookOpen, Compass, GraduationCap, Search, Sparkles } from "lucide-react";
import { DIMENSIONS } from "@/lib/explore/dimensions";
import { PATHS, RECOMMENDED_PATHS, AUDIENCE_LABELS, AUDIENCE_DESCRIPTIONS } from "@/lib/paths/data";
import { getBroadestThemes } from "@/lib/explore/broadest-themes";
import { useTranslation, useI18n } from "@/lib/i18n/context";

/**
 * Discover page — client component so it can use the i18n context.
 */
export function DiscoverClient() {
  const t = useTranslation();
  const { n } = useI18n();
  const dimensions = DIMENSIONS;
  const broadestThemes = getBroadestThemes(6);
  const audiences = Object.keys(RECOMMENDED_PATHS) as Array<keyof typeof RECOMMENDED_PATHS>;

  return (
    <div className="space-y-12 pb-8">
      {/* Hero */}
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-gold" aria-hidden />
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("discover.title")}
          </h1>
        </div>
        <p className="max-w-2xl text-lg text-muted-foreground">
          {t("discover.intro")}
        </p>
      </header>

      {/* Start with a path */}
      <section aria-labelledby="start-with-path" className="space-y-5">
        <div>
          <h2
            id="start-with-path"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            {t("discover.startWithPath")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("discover.pathDescription")}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {audiences.map((audience) => {
            const pathSlug = RECOMMENDED_PATHS[audience][0];
            const path = PATHS.find((p) => p.slug === pathSlug);
            if (!path) return null;

            return (
              <Link
                key={audience}
                href={`/learn/paths/${path.slug}`}
                className="group rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gold mb-1">
                      {t("discover.forAudience", { audience: AUDIENCE_LABELS[audience] })}
                    </p>
                    <h3 className="font-display text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">
                      {path.title}
                    </h3>
                    <p
                      className="arabic-display text-base text-gold mt-0.5"
                      lang="ar"
                      dir="rtl"
                    >
                      {path.arabicTitle}
                    </p>
                  </div>
                  <GraduationCap
                    className="h-5 w-5 shrink-0 text-primary"
                    aria-hidden
                  />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {path.summary}
                </p>
                <p className="text-xs text-muted-foreground">
                  {n(path.steps.length)} steps · {AUDIENCE_DESCRIPTIONS[audience]}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/learn/paths"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <GraduationCap className="h-4 w-4" aria-hidden />
            {t("discover.allPaths")}
          </Link>
        </div>
      </section>

      {/* Broadest themes */}
      <section aria-labelledby="broadest-themes" className="space-y-5">
        <div>
          <h2
            id="broadest-themes"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            {t("discover.broadestThemes")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("discover.themesDescription")}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {broadestThemes.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                    {topic.title}
                  </h3>
                  <p
                    className="arabic-display text-lg text-gold mt-0.5"
                    lang="ar"
                    dir="rtl"
                  >
                    {topic.arabicTitle}
                  </p>
                </div>
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                  {topic.dimensionCount}
                </span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {topic.summary}
              </p>
              <p className="mt-2 text-xs font-medium text-primary group-hover:underline">
                {t("discover.inDimensions", { count: topic.dimensionCount })} →
              </p>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/topics"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            {t("discover.allTopics")}
          </Link>
        </div>
      </section>

      {/* All 15 dimensions */}
      <section aria-labelledby="all-dimensions" className="space-y-5">
        <div>
          <h2
            id="all-dimensions"
            className="font-display text-2xl font-semibold tracking-tight"
          >
            {t("discover.exploreByDimension")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("discover.dimensionDescription")}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {dimensions.map((dim) => (
            <Link
              key={dim.id}
              href={`/explore/dimension/${dim.id}`}
              className="group rounded-2xl border border-border/80 bg-card p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
            >
              <div className="flex items-start gap-3 mb-2">
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
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {dim.covers}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/explore"
            className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Compass className="h-4 w-4" aria-hidden />
            {t("discover.fullDimensionExplorer")}
          </Link>
        </div>
      </section>

      {/* Go deeper */}
      <section
        aria-labelledby="go-deeper"
        className="rounded-2xl border border-border/80 bg-card p-6"
      >
        <h2
          id="go-deeper"
          className="font-display text-xl font-semibold tracking-tight mb-4"
        >
          {t("discover.goDeeper")}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/explore/graph"
            className="group rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3 mb-2">
              <Compass className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                {t("discover.knowledgeGraph")}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("discover.graphDescription")}
            </p>
          </Link>

          <Link
            href="/search"
            className="group rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                {t("discover.searchQuran")}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("discover.searchDescription")}
            </p>
          </Link>

          <Link
            href="/quran"
            className="group rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                {t("discover.readQuran")}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("discover.readDescription")}
            </p>
          </Link>

          <Link
            href="/learn"
            className="group rounded-xl border border-border/80 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-secondary/40"
          >
            <div className="flex items-center gap-3 mb-2">
              <GraduationCap className="h-5 w-5 text-primary" aria-hidden />
              <h3 className="font-display text-base font-semibold tracking-tight group-hover:text-primary transition-colors">
                {t("discover.learningDashboard")}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("discover.dashboardDescription")}
            </p>
          </Link>
        </div>
      </section>

      {/* Review status notice */}
      <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
        <p>
          {t("discover.editorialNote")}
        </p>
      </aside>
    </div>
  );
}
