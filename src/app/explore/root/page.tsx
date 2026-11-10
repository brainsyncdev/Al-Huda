// /explore/root — Root discovery listing page.
//
// Sprint 49: Now uses Sprint 48 registry data for all 1,642 discovered roots
// with proper activation statuses, transliteration search, and better UX.
//
// Server component loads data and passes to client component for interactivity.

import type { Metadata } from "next";
import { AlertCircle } from "lucide-react";
import {
  isMorphologyDataAvailable,
} from "@/lib/morphology/root-data";
import {
  loadSprint48Registry,
  isSprint48DataAvailable,
} from "@/lib/morphology/sprint-48-root-data";
import RootListingClient from "./root-listing-client";

export const metadata: Metadata = {
  title: "Quranic Root Explorer · Al-Huda",
  description:
    "Explore Quranic Arabic roots and discover the word forms and Quranic verses associated with each root. Search by Arabic root or transliteration.",
};

export default function RootDiscoveryListingPage() {
  const dataAvailable = isMorphologyDataAvailable();
  const s48Available = isSprint48DataAvailable();

  if (!dataAvailable) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 pb-12">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Explore · Arabic roots
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Quranic Root Explorer
          </h1>
        </header>

        <section
          aria-labelledby="data-unavailable"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
            <div className="space-y-2 text-sm">
              <h2
                id="data-unavailable"
                className="font-display text-base font-semibold"
              >
                Morphology data not available
              </h2>
              <p>
                The morphology index has not been generated yet. Run{" "}
                <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs">
                  python scripts/import-morphology.py
                </code>{" "}
                to generate the validated morphology data from the QUL SQLite
                files.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Load Sprint 48 registry
  const s48Registry = s48Available ? loadSprint48Registry() : null;

  if (!s48Registry || s48Registry.roots.length === 0) {
    return (
      <div className="mx-auto max-w-2xl space-y-8 pb-12">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Explore · Arabic roots
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Quranic Root Explorer
          </h1>
        </header>

        <section
          aria-labelledby="registry-unavailable"
          className="rounded-2xl border border-amber-200 bg-amber-50 p-6 dark:border-amber-900/50 dark:bg-amber-950/20"
        >
          <div className="flex items-start gap-3">
            <AlertCircle
              className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400"
              aria-hidden
            />
            <div className="space-y-2 text-sm">
              <h2
                id="registry-unavailable"
                className="font-display text-base font-semibold"
              >
                Root discovery registry not available
              </h2>
              <p>
                The root discovery registry has not been generated yet. Run{" "}
                <code className="rounded bg-secondary/60 px-1.5 py-0.5 text-xs">
                  node scripts/generate-discovery-registry.mjs
                </code>{" "}
                to discover all roots from the morphology index.
              </p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Explore · Arabic roots
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Quranic Root Explorer
        </h1>
        <p className="max-w-prose text-muted-foreground">
          Explore Quranic Arabic roots and discover the word forms and Quranic
          verses associated with each root. Search by Arabic root or
          transliteration.
        </p>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span>
            <strong className="text-foreground">{s48Registry.summary.totalRoots}</strong>{" "}
            roots discovered
          </span>
          <span>
            <strong className="text-foreground">{s48Registry.summary.activated}</strong>{" "}
            activated
          </span>
          <span>
            <strong className="text-foreground">{s48Registry.summary.totalOccurrences.toLocaleString()}</strong>{" "}
            occurrences available
          </span>
        </div>
      </header>

      <RootListingClient registry={s48Registry} />
    </div>
  );
}
