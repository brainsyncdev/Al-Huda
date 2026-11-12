"use client";

// Sprint 46 — Phase C: Human Review Interface (client component)
//
// Provides the interactive lemma review workflow for the 10 manual roots.
// Source evidence is passed as props from the server component and is
// immutable. Reviewer decisions are stored in localStorage via the
// human-review storage module.
//
// DESIGN PRINCIPLES:
//   - Source evidence is never mutated by reviewer actions.
//   - Reviewer decisions are explicit and require a deliberate click.
//   - Undecided lemmas prevent approval.
//   - AI recommendations never become reviewer decisions.
//   - All decisions persist across page reloads via localStorage.

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileCheck,
  Info,
  XCircle,
} from "lucide-react";
import type { ReviewWorkbook } from "@/lib/morphology/human-review/data";
import {
  HUMAN_REVIEW_SCHEMA_VERSION,
  HUMAN_REVIEW_STORAGE_KEY,
  type LemmaDecision,
  type LemmaReviewRecord,
  type RootReviewDecision,
  type RootReviewState,
} from "@/lib/morphology/human-review/types";
import {
  canApproveReview,
  deriveIncludedLemmas,
  getReviewProgress,
  isReviewComplete,
} from "@/lib/morphology/human-review/storage";
import { getPolysemyConcernsForRoot } from "@/lib/morphology/human-review/polysemy";

interface ReviewClientProps {
  workbook: ReviewWorkbook;
}

// === Local storage helpers (client-side only) ===

function loadStoredReviews(): Record<string, RootReviewDecision> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(HUMAN_REVIEW_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    const obj = parsed as Record<string, unknown>;
    const reviews = obj.reviews;
    if (typeof reviews !== "object" || reviews === null) return {};
    return reviews as Record<string, RootReviewDecision>;
  } catch {
    return {};
  }
}

function saveStoredReviews(reviews: Record<string, RootReviewDecision>): boolean {
  if (typeof window === "undefined") return false;
  try {
    const store = {
      schemaVersion: HUMAN_REVIEW_SCHEMA_VERSION,
      reviews,
      lastSavedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(HUMAN_REVIEW_STORAGE_KEY, JSON.stringify(store));
    return true;
  } catch {
    return false;
  }
}

// === Decision badge component ===

function DecisionBadge({ decision }: { decision: LemmaDecision }) {
  if (decision === "include") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
        <CheckCircle2 className="h-3 w-3" aria-hidden />
        Include
      </span>
    );
  }
  if (decision === "exclude") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900/40 dark:text-red-300">
        <XCircle className="h-3 w-3" aria-hidden />
        Exclude
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
      <Clock className="h-3 w-3" aria-hidden />
      Undecided
    </span>
  );
}

// === Review state badge ===

function ReviewStateBadge({ state }: { state: RootReviewState }) {
  const styles: Record<RootReviewState, string> = {
    "pending-review": "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    "in-review": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    "needs-review": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[state]}`}>
      {state}
    </span>
  );
}

// === Main component ===

export default function ReviewClient({ workbook }: ReviewClientProps) {
  const [reviews, setReviews] = useState<Record<string, RootReviewDecision>>({});
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [expandedLemma, setExpandedLemma] = useState<string | null>(null);
  const [storageWarning, setStorageWarning] = useState(false);
  const [reviewerIdentity, setReviewerIdentity] = useState("");

  // Load stored reviews on mount
  useEffect(() => {
    const stored = loadStoredReviews();
    setReviews(stored);
  }, []);

  // Initialize review records from workbook if not already stored
  const initializedReviews = useMemo(() => {
    const result = { ...reviews };
    for (const wbRoot of workbook.roots) {
      if (!result[wbRoot.slug]) {
        // Create initial review from workbook evidence
        const lemmaRecords: LemmaReviewRecord[] = wbRoot.lemmaDistribution.map(
          (ld) => ({
            lemma: ld.lemma,
            sourceLemmaId: null,
            sourceOccurrenceCount: ld.count,
            sourceAyahRefs: wbRoot.sampleAyat
              .filter((sa) => sa.lemma === ld.lemma)
              .map((sa) => `${sa.surah}:${sa.ayah}`)
              .slice(0, 10),
            consonantallyCompatible: ld.consonantallyCompatible,
            polysemyWarnings: [],
            evidenceSummary: `${ld.count} occurrences (${ld.percentage.toFixed(1)}% of root)`,
            reviewerDecision: "undecided" as LemmaDecision,
            reviewerNotes: "",
            decisionTimestamp: null,
          })
        );

        result[wbRoot.slug] = {
          slug: wbRoot.slug,
          root: wbRoot.root,
          title: wbRoot.title,
          arabicTitle: wbRoot.arabicTitle,
          reviewState: "pending-review" as RootReviewState,
          sourceDatasetVersion: workbook.sourceDataset,
          policyVersion: "2.0.0",
          lemmaRecords,
          finalIncludedLemmas: [],
          reviewerNotes: "",
          reviewerIdentity: null,
          lastSavedAt: null,
          approvedAt: null,
          activationStatus: "not-activated" as const,
          activatedAt: null,
        };
      }
    }
    return result;
  }, [reviews, workbook]);

  // Persist reviews
  const persistReviews = useCallback(
    (updated: Record<string, RootReviewDecision>) => {
      setReviews(updated);
      const saved = saveStoredReviews(updated);
      if (!saved) setStorageWarning(true);
    },
    []
  );

  // Update a lemma decision
  const updateLemmaDecision = useCallback(
    (slug: string, lemma: string, decision: LemmaDecision, notes: string) => {
      const review = initializedReviews[slug];
      if (!review) return;

      const updatedLemmas = review.lemmaRecords.map((lr) =>
        lr.lemma === lemma
          ? {
              ...lr,
              reviewerDecision: decision,
              reviewerNotes: notes,
              decisionTimestamp: new Date().toISOString(),
            }
          : lr
      );

      // Auto-transition to in-review if pending
      const newState: RootReviewState =
        review.reviewState === "pending-review" ? "in-review" : review.reviewState;

      const updated = {
        ...initializedReviews,
        [slug]: {
          ...review,
          reviewState: newState,
          lemmaRecords: updatedLemmas,
          lastSavedAt: new Date().toISOString(),
        },
      };
      persistReviews(updated);
    },
    [initializedReviews, persistReviews]
  );

  // Approve a root
  const approveRoot = useCallback(
    (slug: string, reviewerIdentity: string) => {
      const review = initializedReviews[slug];
      if (!review) return;

      const includedLemmas = deriveIncludedLemmas(review);
      const approval = canApproveReview(review);
      if (!approval.canApprove) return;

      const updated = {
        ...initializedReviews,
        [slug]: {
          ...review,
          reviewState: "approved" as RootReviewState,
          finalIncludedLemmas: includedLemmas,
          reviewerIdentity,
          approvedAt: new Date().toISOString(),
          lastSavedAt: new Date().toISOString(),
        },
      };
      persistReviews(updated);
    },
    [initializedReviews, persistReviews]
  );

  // Export decisions as JSON for the activation script
  const exportDecisions = useCallback(() => {
    const store = {
      schemaVersion: HUMAN_REVIEW_SCHEMA_VERSION,
      reviews: initializedReviews,
      lastSavedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(store, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "human-review-decisions.json";
    a.click();
    URL.revokeObjectURL(url);
  }, [initializedReviews]);

  const selectedRoot = selectedSlug
    ? initializedReviews[selectedSlug]
    : null;
  const selectedWorkbookRoot = selectedSlug
    ? workbook.roots.find((r) => r.slug === selectedSlug)
    : null;

  return (
    <div className="space-y-6">
      {storageWarning && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
          <p>
            Failed to save to browser storage. Changes may not persist across
            page reloads. Check browser storage permissions or try a different
            browser.
          </p>
        </div>
      )}

      {/* Root selection list */}
      <section aria-labelledby="root-list-heading">
        <h2 id="root-list-heading" className="mb-3 text-lg font-semibold">
          Roots under review ({workbook.roots.length})
        </h2>
        <div className="grid gap-2">
          {workbook.roots.map((wbRoot) => {
            const review = initializedReviews[wbRoot.slug];
            const progress = review ? getReviewProgress(review) : null;
            const isSelected = selectedSlug === wbRoot.slug;

            return (
              <button
                key={wbRoot.slug}
                type="button"
                onClick={() => setSelectedSlug(isSelected ? null : wbRoot.slug)}
                aria-expanded={isSelected}
                className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:bg-secondary/50"
                }`}
              >
                {isSelected ? (
                  <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                ) : (
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                )}
                <span className="arabic-display text-lg text-gold" lang="ar" dir="rtl">{wbRoot.arabicTitle}</span>
                <span className="flex-1 text-sm font-medium">{wbRoot.title}</span>
                <span className="text-xs text-muted-foreground">
                  {wbRoot.totalWordRecords} records · {wbRoot.distinctAyat} ayat
                </span>
                {progress && (
                  <span className="text-xs text-muted-foreground">
                    {progress.decided}/{progress.totalLemmas} decided
                  </span>
                )}
                {review && <ReviewStateBadge state={review.reviewState} />}
              </button>
            );
          })}
        </div>
      </section>

      {/* Selected root detail */}
      {selectedRoot && selectedWorkbookRoot && (
        <section aria-labelledby="root-detail-heading" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 id="root-detail-heading" className="text-xl font-semibold">
              <span className="arabic-display text-gold" lang="ar" dir="rtl">{selectedRoot.arabicTitle}</span>{" "}
              — {selectedRoot.title} ({selectedRoot.root})
            </h2>
            <ReviewStateBadge state={selectedRoot.reviewState} />
          </div>

          {/* Polysemy concerns */}
          {getPolysemyConcernsForRoot(selectedRoot.slug).length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                ⚠️ Polysemy concerns for this root
              </h3>
              {getPolysemyConcernsForRoot(selectedRoot.slug).map((concern, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/20"
                >
                  <p className="font-medium">{concern.description}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    <strong>Reviewer action:</strong> {concern.reviewerAction}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Existing allowlist notes */}
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-1 flex items-center gap-1.5 text-sm font-semibold">
              <Info className="h-4 w-4 text-muted-foreground" aria-hidden />
              Existing allowlist notes
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedWorkbookRoot.existingAllowlistNotes}
            </p>
          </div>

          {/* Lemma review table */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">
              Lemma decisions ({selectedRoot.lemmaRecords.length} lemmas)
            </h3>
            {selectedRoot.lemmaRecords.map((lr) => {
              const isExpanded = expandedLemma === lr.lemma;
              const polysemyConcerns = getPolysemyConcernsForRoot(selectedRoot.slug).filter(
                (c) => c.affectedLemmas.includes(lr.lemma)
              );
              const hasWarnings =
                !lr.consonantallyCompatible || polysemyConcerns.length > 0;

              return (
                <div
                  key={lr.lemma}
                  className={`rounded-xl border p-4 ${
                    hasWarnings
                      ? "border-amber-300 dark:border-amber-800"
                      : "border-border"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="arabic-display text-base text-gold" lang="ar" dir="rtl">
                      {lr.lemma}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {lr.sourceOccurrenceCount} occurrences
                    </span>
                    <DecisionBadge decision={lr.reviewerDecision} />
                    {!lr.consonantallyCompatible && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/40 dark:text-red-300">
                        <AlertCircle className="h-3 w-3" aria-hidden />
                        Incompatible
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setExpandedLemma(isExpanded ? null : lr.lemma)}
                      aria-expanded={isExpanded}
                      aria-label={`Toggle details for lemma ${lr.lemma}`}
                      className="ml-auto rounded-lg p-1 text-muted-foreground hover:bg-secondary"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" aria-hidden />
                      ) : (
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      )}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 space-y-3">
                      {/* Evidence */}
                      <div className="rounded-lg bg-secondary/30 p-3 text-sm">
                        <p className="font-medium">Source evidence</p>
                        <p className="text-muted-foreground">{lr.evidenceSummary}</p>
                        {lr.sourceAyahRefs.length > 0 && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Sample refs: {lr.sourceAyahRefs.join(", ")}
                          </p>
                        )}
                      </div>

                      {/* Polysemy warnings */}
                      {polysemyConcerns.length > 0 && (
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm dark:border-amber-900/50 dark:bg-amber-950/20">
                          <p className="font-medium text-amber-700 dark:text-amber-300">
                            Polysemy warning
                          </p>
                          {polysemyConcerns.map((c, i) => (
                            <p key={i} className="mt-1 text-amber-800 dark:text-amber-200">
                              {c.description}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Decision buttons */}
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateLemmaDecision(
                              selectedRoot.slug,
                              lr.lemma,
                              "include",
                              lr.reviewerNotes
                            )
                          }
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            lr.reviewerDecision === "include"
                              ? "bg-emerald-600 text-white"
                              : "border border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
                          }`}
                        >
                          Include
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateLemmaDecision(
                              selectedRoot.slug,
                              lr.lemma,
                              "exclude",
                              lr.reviewerNotes
                            )
                          }
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            lr.reviewerDecision === "exclude"
                              ? "bg-red-600 text-white"
                              : "border border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
                          }`}
                        >
                          Exclude
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            updateLemmaDecision(
                              selectedRoot.slug,
                              lr.lemma,
                              "undecided",
                              lr.reviewerNotes
                            )
                          }
                          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                            lr.reviewerDecision === "undecided"
                              ? "bg-amber-600 text-white"
                              : "border border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-300 dark:hover:bg-amber-900/20"
                          }`}
                        >
                          Undecided
                        </button>
                      </div>

                      {/* Reviewer notes */}
                      <div>
                        <label
                          htmlFor={`notes-${selectedRoot.slug}-${lr.lemma}`}
                          className="mb-1 block text-xs font-medium text-muted-foreground"
                        >
                          Reviewer notes
                        </label>
                        <textarea
                          id={`notes-${selectedRoot.slug}-${lr.lemma}`}
                          value={lr.reviewerNotes}
                          onChange={(e) =>
                            updateLemmaDecision(
                              selectedRoot.slug,
                              lr.lemma,
                              lr.reviewerDecision,
                              e.target.value
                            )
                          }
                          rows={2}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Reasoning for this decision..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Approval section */}
          <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <h3 className="text-sm font-semibold">Approval</h3>
            {(() => {
              const progress = getReviewProgress(selectedRoot);
              const complete = isReviewComplete(selectedRoot);
              const approval = canApproveReview(selectedRoot);
              const isApproved = selectedRoot.reviewState === "approved";

              return (
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm">
                    <span>
                      {progress.included} included · {progress.excluded} excluded ·{" "}
                      {progress.undecided} undecided
                    </span>
                    {complete ? (
                      <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" aria-hidden />
                        All lemmas decided
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Clock className="h-4 w-4" aria-hidden />
                        {progress.undecided} remaining
                      </span>
                    )}
                  </div>

                  {!approval.canApprove && !isApproved && (
                    <ul className="space-y-1 text-sm text-red-600 dark:text-red-400">
                      {approval.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  )}

                  {isApproved ? (
                    <div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
                      <FileCheck className="h-4 w-4 shrink-0" aria-hidden />
                      <p>
                        Approved with {selectedRoot.finalIncludedLemmas.length} lemmas.
                        Export decisions and run{" "}
                        <code className="rounded bg-secondary/60 px-1 py-0.5 text-xs">
                          node scripts/activate-approved-roots.mjs
                        </code>{" "}
                        to generate the occurrence index.
                      </p>
                    </div>
                  ) : (
                    approval.canApprove && (
                      <div className="space-y-2">
                        <label
                          htmlFor={`reviewer-${selectedRoot.slug}`}
                          className="block text-xs font-medium text-muted-foreground"
                        >
                          Reviewer identity (your name or role — not AI)
                        </label>
                        <input
                          id={`reviewer-${selectedRoot.slug}`}
                          type="text"
                          value={reviewerIdentity}
                          onChange={(e) => setReviewerIdentity(e.target.value)}
                          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="e.g., Dawood (founder) or Scholar Advisory Board"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            approveRoot(selectedRoot.slug, reviewerIdentity.trim());
                          }}
                          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                        >
                          Approve root
                        </button>
                      </div>
                    )
                  )}
                </div>
              );
            })()}
          </div>
        </section>
      )}

      {/* Export button */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={exportDecisions}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
        >
          Export decisions as JSON
        </button>
      </div>
    </div>
  );
}