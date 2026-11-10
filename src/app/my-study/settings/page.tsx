"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BackupControls } from "@/components/library/backup-controls";
import { useLibrary } from "@/lib/library/context";

export default function MyStudySettingsPage() {
  const { clearAll, bookmarks, notes, collections, progress, hydrated } =
    useLibrary();
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClearAll() {
    clearAll();
    setConfirmClear(false);
    toast.success("All personal study data cleared");
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-3">
        <Link
          href="/my-study"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:decoration-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Back to My Study
        </Link>
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            Settings & Privacy
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            Manage your personal study data. Everything is stored locally on
            this device — no account, no cloud sync, no analytics.
          </p>
        </div>
      </header>

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          Loading settings…
        </div>
      )}

      {hydrated && (
        <>
          {/* Privacy disclosure */}
          <section
            aria-labelledby="privacy"
            className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold-soft/50 to-secondary/30 p-5"
          >
            <h2
              id="privacy"
              className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
            >
              <Shield className="h-5 w-5 text-gold" aria-hidden />
              Privacy
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>✓ All data stored locally in your browser</li>
              <li>✓ No account required</li>
              <li>✓ No cloud synchronization</li>
              <li>✓ No analytics or tracking</li>
              <li>✓ No data sent to external servers</li>
              <li>✓ Clearing browser data will erase your study data unless you export a backup</li>
            </ul>
          </section>

          {/* Current data summary */}
          <section aria-labelledby="data-summary" className="space-y-3">
            <h2
              id="data-summary"
              className="font-display text-lg font-semibold tracking-tight"
            >
              Your data
            </h2>
            <div className="rounded-2xl border border-border/80 bg-card p-5">
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Bookmarks
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                    {bookmarks.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Notes
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                    {notes.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Collections
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                    {collections.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Recent reads
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                    {progress.length}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Backup controls */}
          <section aria-labelledby="backup" className="space-y-3">
            <h2
              id="backup"
              className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
            >
              <Download className="h-5 w-5 text-gold" aria-hidden />
              Backup & Restore
            </h2>
            <div className="rounded-2xl border border-border/80 bg-card p-5">
              <p className="text-sm text-muted-foreground">
                Export all your personal study data as a JSON file. You can
                restore it later on this device or another.
              </p>
              <div className="mt-4">
                <BackupControls />
              </div>
            </div>
          </section>

          {/* Clear all data */}
          <section aria-labelledby="clear-data" className="space-y-3">
            <h2
              id="clear-data"
              className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight"
            >
              <Trash2 className="h-5 w-5 text-destructive" aria-hidden />
              Clear all data
            </h2>
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
              <p className="text-sm text-muted-foreground">
                This will permanently delete all your bookmarks, notes,
                collections, and reading history from this device. This action
                cannot be undone.
              </p>
              {confirmClear ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
                  >
                    Yes, delete everything
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmClear(true)}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  Clear all data
                </button>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
