import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, FileWarning, ShieldCheck } from "lucide-react";
import { getAyah, validateDataset } from "@/lib/quran/data";
import {
  SOURCES,
  sourceLanguageLabel,
  sourceVersionLabel,
} from "@/lib/quran/sources";
import { APPROVED_SOURCES } from "@/lib/ai/approved-sources";
import { AI_GATES } from "@/lib/ai/feature-flag";
import { TOPICS, individuallyReviewedCount } from "@/lib/topics/data";
import {
  REVIEWS,
  REVIEWS_LAST_UPDATED,
  type ReviewSubjectType,
} from "@/lib/editorial/reviews";

// Editorial review board (FR-072, FR-073, FR-075, PRD §20).
//
// Server component, read-only, no accounts: the build has none, so the honest
// shape of an editorial tool here is a status surface over the data file that
// is the source of truth, not a CMS with write paths nobody can authenticate
// to. Publication state changes happen in code review and are recorded by
// `provenance.status` / `reviewedAt`.
//
// Noindex: an editor's status board has no meaning to a reader (§15).

export const metadata: Metadata = {
  title: "Editorial status",
  description: "Review state of topics, sources, and dataset validation.",
  robots: { index: false, follow: false },
};

const STATUS_STYLES: Record<string, string> = {
  "editorial-approved":
    "bg-primary/10 text-primary border-primary/30",
  "pending-scholarly-review":
    "bg-gold-soft/70 text-accent-foreground border-gold/40",
};

export default function EditorialPage() {
  const report = validateDataset();

  const topicRows = TOPICS.map((topic) => {
    const unresolved = topic.relations.filter((relation) => {
      const verse = getAyah(relation.ref.surah, relation.ref.ayah);
      return verse === null;
    });
    const individuallyReviewed = individuallyReviewedCount(topic);
    return { topic, unresolved, individuallyReviewed };
  });

  const pendingCount = TOPICS.filter(
    (topic) => topic.provenance.status === "pending-scholarly-review"
  ).length;

  const totalRelations = topicRows.reduce(
    (sum, row) => sum + row.topic.relations.length,
    0
  );
  const totalIndividuallyReviewed = topicRows.reduce(
    (sum, row) => sum + row.individuallyReviewed,
    0
  );

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-2">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <FileWarning className="h-4 w-4 text-gold" aria-hidden />
          Internal · not indexed
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Editorial status
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
          Review state for every curated topic, the rights register, and the
          dataset validation scan — the surfaces PRD §20 asks editors to see.
          This page reads data; it does not publish changes. See{" "}
          <Link
            href="/report"
            className="font-medium text-primary underline decoration-gold/60 underline-offset-2"
          >
            /report
          </Link>{" "}
          for the correction intake.
        </p>
      </header>

      {/* --- Dataset validation (FR-070 gates) ---------------------------- */}
      <section aria-labelledby="dataset-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="dataset-heading" className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-gold" aria-hidden />
          Dataset validation
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/70 bg-background/60 p-3">
            <p className="text-2xl font-semibold tabular-nums text-foreground">{report.surahCount}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Surahs</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-3">
            <p className="text-2xl font-semibold tabular-nums text-foreground">{report.totalAyat}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Ayat</p>
          </div>
          <div className="rounded-xl border border-border/70 bg-background/60 p-3">
            <p className="text-2xl font-semibold tabular-nums text-foreground">{report.issues.length}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Issues</p>
          </div>
        </div>
        {report.issues.length > 0 ? (
          <ul className="mt-3 space-y-1 text-xs text-destructive">
            {report.issues.map((issue) => (
              <li key={issue}>{issue}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Structural scan clean. The same scan runs in{" "}
            <code className="rounded bg-secondary px-1">scripts/validate-quran-data.mjs</code>{" "}
            for release gating; it has not been executed in this environment.
          </p>
        )}
      </section>

      {/* --- Topic publication state (FR-072, FR-073) --------------------- */}
      <section aria-labelledby="topics-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="topics-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Topic mappings
        </h2>
        <p className="mt-2 max-w-prose text-xs leading-relaxed text-muted-foreground">
          {pendingCount} of {TOPICS.length} topics are pending scholarly review.
          Approval requires a qualified reviewer, who is not yet assigned —
          until then nothing flips to editorial-approved.
        </p>
        {/* FR-073: per-relation review records are surfaced, including the
            honest zero — the schema supports individual review, the history
            does not contain any yet. */}
        <p className="mt-1 max-w-prose text-xs leading-relaxed text-muted-foreground">
          Per-relation provenance: {totalIndividuallyReviewed} of{" "}
          {totalRelations} relations carry an individual review record; the
          remaining {totalRelations - totalIndividuallyReviewed} inherit the
          topic-level record.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[46rem] text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th scope="col" className="py-2 pr-3 font-medium">Topic</th>
                <th scope="col" className="py-2 pr-3 font-medium">Status</th>
                <th scope="col" className="py-2 pr-3 font-medium">Relations</th>
                <th scope="col" className="py-2 pr-3 font-medium">Curator / method</th>
                <th scope="col" className="py-2 font-medium">Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {topicRows.map(({ topic, unresolved, individuallyReviewed }) => (
                <tr key={topic.slug} className="border-b border-border/60 align-top">
                  <td className="py-2.5 pr-3">
                    <Link
                      href={`/topics/${topic.slug}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {topic.title}
                    </Link>
                    <span className="block text-xs text-muted-foreground">{topic.slug}</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span
                      className={`inline-block rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider ${
                        STATUS_STYLES[topic.provenance.status] ?? ""
                      }`}
                    >
                      {topic.provenance.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 tabular-nums text-foreground/85">
                    {topic.relations.length}
                    <span className="block text-xs font-normal text-muted-foreground">
                      {individuallyReviewed} individually reviewed
                    </span>
                    {unresolved.length > 0 && (
                      <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-medium text-destructive">
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden />
                        {unresolved.length} unresolved
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-xs text-muted-foreground">
                    {topic.provenance.curator}
                    <span className="block">{topic.provenance.method}</span>
                  </td>
                  <td className="py-2.5 text-xs tabular-nums text-muted-foreground">
                    {topic.provenance.reviewedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* --- Editorial review log (FR-072, FR-073) ------------------------ */}
      <section aria-labelledby="review-log-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="review-log-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Editorial review log
        </h2>
        <p className="mt-2 max-w-prose text-xs leading-relaxed text-muted-foreground">
          {REVIEWS.length} entries, last updated {REVIEWS_LAST_UPDATED}. The log
          is generated from the topic and source registries by{" "}
          <code className="rounded bg-secondary px-1">scripts/build-editorial-log.mjs</code>{" "}
          and maintained through git review. The same file is editable with
          Decap CMS at{" "}
          <code className="rounded bg-secondary px-1">/admin</code> against a
          local backend; see{" "}
          <code className="rounded bg-secondary px-1">docs/EDITORIAL.md</code>.
        </p>

        <div className="mt-4 space-y-5">
          {(
            [
              { type: "topic", label: "Topics" },
              { type: "source", label: "Sources" },
              { type: "feature", label: "Features" },
            ] as { type: ReviewSubjectType; label: string }[]
          ).map(({ type, label }) => {
            const rows = REVIEWS.filter((r) => r.subjectType === type);
            if (rows.length === 0) return null;
            return (
              <div key={type}>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {label} ({rows.length})
                </h3>
                <div className="mt-2 overflow-x-auto">
                  <table className="w-full min-w-[44rem] text-left text-sm">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                        <th scope="col" className="py-2 pr-3 font-medium">Subject</th>
                        <th scope="col" className="py-2 pr-3 font-medium">Status</th>
                        <th scope="col" className="py-2 pr-3 font-medium">Curator / method</th>
                        <th scope="col" className="py-2 pr-3 font-medium">Reviewed</th>
                        <th scope="col" className="py-2 font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row) => (
                        <tr key={row.id} className="border-b border-border/60 align-top">
                          <td className="py-2.5 pr-3 font-medium text-foreground/90">
                            {row.subjectId}
                          </td>
                          <td className="py-2.5 pr-3">
                            <span
                              className={`inline-block rounded-full border px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider ${
                                STATUS_STYLES[row.status] ?? ""
                              }`}
                            >
                              {row.status}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-xs text-muted-foreground">
                            {row.curator}
                            <span className="block">{row.method}</span>
                          </td>
                          <td className="py-2.5 pr-3 text-xs tabular-nums text-muted-foreground">
                            {row.reviewedAt}
                          </td>
                          <td className="py-2.5 text-xs leading-relaxed text-muted-foreground">
                            {row.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* --- Rights register (FR-075) ------------------------------------- */}
      <section aria-labelledby="rights-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="rights-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Content rights and source status
        </h2>
        <ul className="mt-3 space-y-2">
          {SOURCES.map((source) => {
            const approved = APPROVED_SOURCES.some((a) => a.id === source.id);
            return (
              <li
                key={source.id}
                className="rounded-xl border border-border/70 bg-background/60 p-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-sm font-medium text-foreground">{source.attribution}</p>
                  <span className="rounded-full border border-gold/40 bg-gold-soft/60 px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-accent-foreground">
                    {source.license}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sourceVersionLabel(source)} · {source.method === "package" ? "bundled in this build" : "link-out only, not redistributed"}
                  {" · "}
                  {sourceLanguageLabel(source.language)}
                  {" · "}
                  {approved ? "retrieval-approved (AI allowlist)" : "not on the AI allowlist"}
                </p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* --- AI gates (FR-065 gate report) -------------------------------- */}
      <section aria-labelledby="gates-heading" className="rounded-2xl border border-border/80 bg-card p-5">
        <h2 id="gates-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI safety gates
        </h2>
        <p className="mt-2 max-w-prose text-xs leading-relaxed text-muted-foreground">
          The answer feature is off until every gate below is met. This board
          exists so nobody has to take that on trust.
        </p>
        <ul className="mt-3 space-y-1.5">
          {AI_GATES.map((gate) => (
            <li key={gate.id} className="flex items-start gap-2 text-xs">
              <span
                aria-hidden
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${gate.met ? "bg-primary" : "bg-muted-foreground/40"}`}
              />
              <span>
                <span className={gate.met ? "font-medium text-foreground" : "font-medium text-muted-foreground"}>
                  {gate.label}
                </span>{" "}
                <span className="text-muted-foreground">— {gate.met ? "met" : "not met"}.</span>{" "}
                <span className="text-muted-foreground/80">{gate.evidence}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
