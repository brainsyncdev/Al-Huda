"use client";

// Composes the revision surfaces (FR-050–FR-053).
//
// HYDRATION GATE. Every date-derived value on this page — what is due, what is
// upcoming, how far away a review is — depends on the current instant. If any
// of it were computed during server render, the HTML and the first client
// render would disagree and React would discard the server output. So nothing
// date-dependent is rendered until `hydrated` and a measured instant are both
// available, and the placeholder occupies the same structural position.
//
// The instant refreshes on a one-minute interval and whenever the tab becomes
// visible again, so a plan left open across midnight updates without the
// learner reloading.

import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";
import Link from "next/link";
import { useRevision } from "@/lib/revision/context";
import { dueItems } from "@/lib/revision/scheduling";
import type { SurahOption } from "@/lib/revision/surah-options";
import { AddVerses } from "./add-verses";
import { DueQueue } from "./due-queue";
import { PlanOverview } from "./plan-overview";

export function RevisionWorkspace({ surahOptions }: { surahOptions: SurahOption[] }) {
  const { hydrated, state } = useRevision();
  const [nowMs, setNowMs] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNowMs(Date.now());
    tick();

    const intervalId = window.setInterval(tick, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const ready = hydrated && nowMs !== null;
  // The hook call above is unconditional; the earlier conditional form here
  // changed hook order after hydration and crashed at runtime while still
  // typechecking. Null narrowing is explicit rather than leaning on `ready`,
  // which TypeScript does not reliably carry into JSX.
  const due = ready && nowMs !== null ? dueItems(state, nowMs) : [];

  return (
    <div className="space-y-6 pb-4">
      <header className="space-y-3">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <GraduationCap className="h-4 w-4 text-gold" aria-hidden />
          Memorization
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
          Revision
        </h1>
        <p className="max-w-prose text-sm leading-relaxed text-foreground/85">
          A quiet schedule for the ayat you are holding. Add a verse or a span,
          recall it from memory when it comes due, and rate how it went. The
          spacing adjusts itself; nothing here is graded, timed, or compared.
        </p>
        <p className="max-w-prose text-xs leading-relaxed text-muted-foreground">
          Your plan lives only in this browser. There is no account and no
          server copy, which means clearing site data, using a private window, or
          switching device will remove it. Export a backup from your{" "}
          <Link
            href="/library"
            className="font-medium text-primary underline decoration-gold/60 underline-offset-2 hover:decoration-gold"
          >
            library
          </Link>{" "}
          if you intend to keep it. The app never sends reminders — there is no
          notification or messaging capability here.
        </p>
      </header>

      {!ready ? (
        <div
          role="status"
          className="rounded-2xl border border-border/80 bg-card p-5 text-sm text-muted-foreground"
        >
          Loading your plan from this browser…
        </div>
      ) : (
        <>
          <DueQueue due={due} surahOptions={surahOptions} />
          <AddVerses surahOptions={surahOptions} />
          {nowMs !== null && (
            <PlanOverview nowMs={nowMs} surahOptions={surahOptions} />
          )}
        </>
      )}
    </div>
  );
}
