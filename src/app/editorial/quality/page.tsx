import type { Metadata } from "next";
import { TOPICS } from "@/lib/topics/data";
import { DIMENSIONS } from "@/lib/explore/dimensions";
import { DOMAINS } from "@/lib/taxonomy/domains";
import { JOURNEYS } from "@/lib/study-journeys/data";
import { AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";
import Link from "next/link";
import {
  validateTopicTechnicalIntegrity,
  validateTopicEditorialCompleteness,
  validateTopicScholarlyReview,
  validateJourneyTechnicalIntegrity,
  validateJourneyEditorialCompleteness,
  validateJourneyScholarlyReview,
} from "@/lib/quality/validation";

export const metadata: Metadata = {
  title: "Editorial Quality Dashboard — Al-Huda",
  robots: {
    index: false,
    follow: false,
  },
};

interface QualityIssue {
  type: "error" | "warning" | "info";
  category: string;
  message: string;
  slug?: string;
  dimension?: "technical" | "editorial" | "scholarly";
}

export default function EditorialQualityPage() {
  const issues: QualityIssue[] = [];

  // Topic quality metrics
  let topicsWithUrdu = 0;
  let topicsMissingDescription = 0;
  let topicsMissingLimitations = 0;
  let topicsInvalidReviewState = 0;
  let totalAyahRefs = 0;
  let duplicateRefs = 0;

  // Three-dimension quality tracking
  let technicalPassed = 0;
  let technicalFailed = 0;
  let editorialComplete = 0;
  let editorialIncomplete = 0;
  let scholarlyPending = 0;
  let scholarlyReviewed = 0;

  // Check topics
  for (const topic of TOPICS) {
    totalAyahRefs += topic.relations.length;

    // Validate three dimensions
    const technical = validateTopicTechnicalIntegrity(topic);
    const editorial = validateTopicEditorialCompleteness(topic);
    const scholarly = validateTopicScholarlyReview(topic);

    if (technical.status === "passed") technicalPassed++;
    else technicalFailed++;

    if (editorial.status === "complete") editorialComplete++;
    else editorialIncomplete++;

    if (scholarly.status === "pending") scholarlyPending++;
    else if (scholarly.status === "reviewed") scholarlyReviewed++;

    if (topic.urduTitle) {
      topicsWithUrdu++;
    }

    if (!topic.editorialDescription || topic.editorialDescription.trim() === "") {
      topicsMissingDescription++;
      issues.push({
        type: "error",
        category: "Topic",
        message: `${topic.slug}: missing editorialDescription`,
        slug: topic.slug,
        dimension: "editorial",
      });
    }

    if (!topic.knownLimitations || topic.knownLimitations.length === 0) {
      topicsMissingLimitations++;
      issues.push({
        type: "error",
        category: "Topic",
        message: `${topic.slug}: missing knownLimitations`,
        slug: topic.slug,
        dimension: "editorial",
      });
    }

    const validStates = ["draft", "needs_review", "reviewed", "published"];
    if (!validStates.includes(topic.reviewState)) {
      topicsInvalidReviewState++;
      issues.push({
        type: "error",
        category: "Topic",
        message: `${topic.slug}: invalid reviewState "${topic.reviewState}"`,
        slug: topic.slug,
        dimension: "editorial",
      });
    }

    // Check for duplicate refs
    const refKeys = new Set<string>();
    for (const rel of topic.relations) {
      const key = `${rel.ref.surah}:${rel.ref.ayah}`;
      if (refKeys.has(key)) {
        duplicateRefs++;
        issues.push({
          type: "error",
          category: "Topic",
          message: `${topic.slug}: duplicate reference ${key}`,
          slug: topic.slug,
          dimension: "technical",
        });
      }
      refKeys.add(key);
    }

    // Add technical issues
    for (const issue of technical.issues) {
      issues.push({
        type: issue.severity === "error" ? "error" : "warning",
        category: "Topic",
        message: `${topic.slug}: ${issue.message}`,
        slug: topic.slug,
        dimension: "technical",
      });
    }
  }

  // Journey quality metrics
  let stagesMissingReflection = 0;
  let stagesMissingCriteria = 0;
  let totalStages = 0;
  let journeysTechnicalPassed = 0;
  let journeysEditorialComplete = 0;
  let journeysScholarlyPending = 0;

  for (const journey of JOURNEYS) {
    const technical = validateJourneyTechnicalIntegrity(journey);
    const editorial = validateJourneyEditorialCompleteness(journey);
    const scholarly = validateJourneyScholarlyReview(journey);

    if (technical.status === "passed") journeysTechnicalPassed++;
    if (editorial.status === "complete") journeysEditorialComplete++;
    if (scholarly.status === "pending") journeysScholarlyPending++;

    if (!journey.learningObjective || journey.learningObjective.trim() === "") {
      issues.push({
        type: "error",
        category: "Journey",
        message: `${journey.slug}: missing learningObjective`,
        slug: journey.slug,
        dimension: "editorial",
      });
    }

    for (const stage of journey.stages) {
      totalStages++;

      if (!stage.reflectionPrompt) {
        stagesMissingReflection++;
        issues.push({
          type: "warning",
          category: "Journey Stage",
          message: `${journey.slug} stage ${stage.order}: missing reflectionPrompt`,
          slug: journey.slug,
          dimension: "editorial",
        });
      }

      if (!stage.completionCriteria || stage.completionCriteria.trim() === "") {
        stagesMissingCriteria++;
        issues.push({
          type: "error",
          category: "Journey Stage",
          message: `${journey.slug} stage ${stage.order}: missing completionCriteria`,
          slug: journey.slug,
          dimension: "editorial",
        });
      }
    }
  }

  // Add informational notes
  if (topicsWithUrdu === 0) {
    issues.push({
      type: "info",
      category: "Multilingual",
      message: "No topics have verified Urdu titles yet",
      dimension: "editorial",
    });
  }

  const errorCount = issues.filter((i) => i.type === "error").length;
  const warningCount = issues.filter((i) => i.type === "warning").length;
  const infoCount = issues.filter((i) => i.type === "info").length;

  return (
    <div className="space-y-8 pb-8">
      <header className="space-y-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Editorial Quality Dashboard
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          Internal editorial management tool. This dashboard shows the quality
          and completeness of curated content across three independent dimensions.
        </p>
        <aside className="rounded-2xl border border-gold/30 bg-gold-soft/60 p-4 text-sm text-accent-foreground">
          <p className="flex items-start gap-2">
            <AlertTriangle
              className="mt-0.5 h-4 w-4 shrink-0 text-gold"
              aria-hidden
            />
            <span>
              This page is noindex. It is for editorial review only and should
              not be linked from public navigation.
            </span>
          </p>
        </aside>
      </header>

      {/* Summary Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            Dimensions
          </h2>
          <p className="mt-2 text-3xl font-semibold">{DIMENSIONS.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground">Domains</h2>
          <p className="mt-2 text-3xl font-semibold">{DOMAINS.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground">Topics</h2>
          <p className="mt-2 text-3xl font-semibold">{TOPICS.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            Curated Ayat
          </h2>
          <p className="mt-2 text-3xl font-semibold">{totalAyahRefs}</p>
        </div>
      </section>

      {/* Three-Dimension Quality Model */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Three-Dimension Quality Model
        </h2>
        <p className="text-sm text-muted-foreground">
          Quality is measured across three independent dimensions. Passing one dimension does not automatically satisfy others.
        </p>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Dimension 1: Technical Integrity */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Technical Integrity</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Structural and technical validity
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Topics Passed</span>
                <span className="font-semibold">{technicalPassed} / {TOPICS.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Topics Failed</span>
                <span className="font-semibold text-destructive">{technicalFailed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Journeys Passed</span>
                <span className="font-semibold">{journeysTechnicalPassed} / {JOURNEYS.length}</span>
              </div>
            </div>
          </div>

          {/* Dimension 2: Editorial Completeness */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="h-5 w-5 text-gold" />
              <h3 className="font-semibold">Editorial Completeness</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Presence of required editorial information
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Topics Complete</span>
                <span className="font-semibold">{editorialComplete} / {TOPICS.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Topics Incomplete</span>
                <span className="font-semibold text-gold">{editorialIncomplete}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Journeys Complete</span>
                <span className="font-semibold">{journeysEditorialComplete} / {JOURNEYS.length}</span>
              </div>
            </div>
          </div>

          {/* Dimension 3: Scholarly Review */}
          <div className="rounded-2xl border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-accent-foreground" />
              <h3 className="font-semibold">Scholarly Review</h3>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Actual scholarly review status
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Topics Pending</span>
                <span className="font-semibold">{scholarlyPending} / {TOPICS.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Topics Reviewed</span>
                <span className="font-semibold text-primary">{scholarlyReviewed}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Journeys Pending</span>
                <span className="font-semibold">{journeysScholarlyPending} / {JOURNEYS.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quality Score */}
      <section className="rounded-2xl border bg-card p-6">
        <h2 className="text-xl font-semibold tracking-tight">Issue Summary</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <XCircle className="h-6 w-6 text-destructive" />
            <div>
              <p className="text-2xl font-semibold">{errorCount}</p>
              <p className="text-sm text-muted-foreground">Errors</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-gold" />
            <div>
              <p className="text-2xl font-semibold">{warningCount}</p>
              <p className="text-sm text-muted-foreground">Warnings</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Info className="h-6 w-6 text-primary" />
            <div>
              <p className="text-2xl font-semibold">{infoCount}</p>
              <p className="text-sm text-muted-foreground">Info</p>
            </div>
          </div>
        </div>
      </section>

      {/* Topic Editorial Completeness */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Topic Editorial Completeness
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">With Urdu Title</p>
            <p className="mt-1 text-2xl font-semibold">
              {topicsWithUrdu} / {TOPICS.length}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Missing Description
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {topicsMissingDescription}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Missing Limitations
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {topicsMissingLimitations}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Invalid Review State
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {topicsInvalidReviewState}
            </p>
          </div>
        </div>
      </section>

      {/* Journey Completeness */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Journey Completeness
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Journeys</p>
            <p className="mt-1 text-2xl font-semibold">{JOURNEYS.length}</p>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Stages</p>
            <p className="mt-1 text-2xl font-semibold">{totalStages}</p>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Missing Reflection Prompts
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {stagesMissingReflection}
            </p>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Missing Completion Criteria
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {stagesMissingCriteria}
            </p>
          </div>
        </div>
      </section>

      {/* Issues List */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Issues</h2>
        {issues.length === 0 ? (
          <div className="rounded-2xl border bg-card p-6 text-center">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
            <p className="mt-2 text-lg font-medium">No issues found</p>
            <p className="text-sm text-muted-foreground">
              All editorial checks passed.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {issues.map((issue, idx) => (
              <div
                key={idx}
                className={`rounded-lg border p-4 ${
                  issue.type === "error"
                    ? "border-destructive/50 bg-destructive/10"
                    : issue.type === "warning"
                    ? "border-gold/50 bg-gold-soft/30"
                    : "border-primary/50 bg-primary/10"
                }`}
              >
                <div className="flex items-start gap-3">
                  {issue.type === "error" ? (
                    <XCircle className="h-5 w-5 text-destructive" />
                  ) : issue.type === "warning" ? (
                    <AlertTriangle className="h-5 w-5 text-gold" />
                  ) : (
                    <Info className="h-5 w-5 text-primary" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{issue.category}</p>
                      {issue.dimension && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {issue.dimension}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {issue.message}
                    </p>
                    {issue.slug && (
                      <Link
                        href={`/explore/topics/${issue.slug}`}
                        className="mt-1 inline-block text-xs text-primary hover:underline"
                      >
                        View topic →
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Reference Integrity */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">
          Reference Integrity
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              Total Ayah References
            </p>
            <p className="mt-1 text-2xl font-semibold">{totalAyahRefs}</p>
          </div>
          <div className="rounded-2xl border bg-card p-4">
            <p className="text-sm text-muted-foreground">Duplicate References</p>
            <p className="mt-1 text-2xl font-semibold">{duplicateRefs}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
