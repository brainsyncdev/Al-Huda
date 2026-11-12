import Link from "next/link";
import { getAllJourneys } from "@/lib/study-journeys/data";
import { getDimension } from "@/lib/explore/dimensions";
import { absoluteUrl } from "@/lib/site";
import { AlertTriangle, BookOpen, Clock, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Study Journeys",
  description:
    "Structured learning experiences organized around dimensions of Quranic guidance. Each journey has stages that reference topics and ayat.",
  alternates: { canonical: absoluteUrl("/learn/journeys") },
};

export default function StudyJourneysIndexPage() {
  const journeys = getAllJourneys();

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Study Journeys
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Structured learning experiences organized around dimensions of Quranic
          guidance. Each journey has stages that reference topics and ayat,
          building understanding progressively.
        </p>
      </header>

      <aside className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium">Pending Scholarly Review</p>
            <p>
              All journeys are marked pending-scholarly-review. The objectives
              and reflection prompts are editorial starting points, not
              authoritative interpretations. Nothing here is tafsir.
            </p>
          </div>
        </div>
      </aside>

      <section aria-labelledby="journeys-list-heading" className="space-y-3">
        <h2
          id="journeys-list-heading"
          className="font-display text-xl font-semibold tracking-tight"
        >
          All journeys
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {journeys.map((journey) => {
            const dimension = getDimension(journey.dimensionId);
            return (
              <li key={journey.slug}>
                <Link
                  href={`/learn/journeys/${journey.slug}`}
                  className="group flex h-full flex-col rounded-2xl border border-border/80 bg-card p-5 transition-colors hover:border-primary/30 hover:bg-secondary/40"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-display text-lg font-semibold tracking-tight">
                      {journey.title}
                    </h2>
                    <span
                      className="arabic-display text-2xl text-gold"
                      lang="ar"
                      dir="rtl"
                    >
                      {journey.arabicTitle}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {journey.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {dimension && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary">
                        <BookOpen className="h-3 w-3" />
                        {dimension.title}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full bg-secondary/60 px-2.5 py-1">
                      {journey.difficulty}
                    </span>
                    {journey.estimatedMinutes && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {journey.estimatedMinutes} min
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                    {journey.stages.length} stages
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
        <p>
          Each journey carries its editorial provenance — method, curator, review
          date, and status. The UI displays this transparently so you know what
          you&apos;re looking at.
        </p>
      </aside>
    </div>
  );
}
