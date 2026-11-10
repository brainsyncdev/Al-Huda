// /editorial/review — Human Lemma Review Interface (Sprint 46)
//
// Server component that loads the review workbook evidence and passes it
// to the client-side review interface. This is a reviewer tool, separate
// from the public root discovery pages.
//
// DESIGN PRINCIPLES:
//   - Source evidence is loaded server-side and passed as props.
//   - Reviewer decisions are stored client-side in localStorage.
//   - No AI model is involved — this is purely human review.
//   - The page is not indexed by search engines (reviewer tool).

import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import { loadReviewWorkbook } from "@/lib/morphology/human-review/data";
import ReviewClient from "./review-client";

export const metadata: Metadata = {
  title: "Human Lemma Review · Al-Huda",
  description: "Reviewer tool for lemma inclusion decisions on curated Quranic roots.",
  robots: { index: false, follow: false },
};

export default function HumanReviewPage() {
  const workbook = loadReviewWorkbook();

  if (!workbook) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 pb-12">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Editorial · Lemma Review
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Human Lemma Review
          </h1>
        </header>

        <section
          aria-labelledby="workbook-unavailable"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
            <div className="space-y-2 text-sm">
              <h2
                id="workbook-unavailable"
                className="font-display text-base font-semibold"
              >
                Review workbook not available
              </h2>
              <p>
                The lemma review workbook has not been generated yet. Run{" "}
                <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs">
                  node scripts/extract-lemma-evidence.mjs
                </code>{" "}
                to generate the evidence workbook from the morphology index.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Editorial · Lemma Review
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Human Lemma Review
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Review each lemma for the 10 curated roots and make explicit
          include/exclude decisions. This is a human review tool — AI
          recommendations cannot substitute for reviewer judgment.
        </p>
        <p className="text-sm text-muted-foreground">
          Source dataset: {workbook.sourceDataset} · Generated:{" "}
          {new Date(workbook.generatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </header>

      <ReviewClient workbook={workbook} />
    </div>
  );
}
