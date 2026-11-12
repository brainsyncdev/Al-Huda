"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, Shield, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { BackupControls } from "@/components/library/backup-controls";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLibrary } from "@/lib/library/context";
import { useTranslation } from "@/lib/i18n/context";

export default function MyStudySettingsPage() {
  const t = useTranslation();
  const { clearAll, bookmarks, notes, collections, progress, hydrated } =
    useLibrary();
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClearAll() {
    clearAll();
    setConfirmClear(false);
    toast.success(t("myStudySettings.clearedToast"));
  }

  return (
    <div className="space-y-6 pb-8">
      <header className="space-y-3">
        <Link
          href="/my-study"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-primary underline underline-offset-2 hover:decoration-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          {t("myStudySettings.backToMyStudy")}
        </Link>
        <div className="space-y-1">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("myStudySettings.title")}
          </h1>
          <p className="max-w-prose text-sm text-muted-foreground">
            {t("myStudySettings.subtitle")}
          </p>
        </div>
      </header>

      {!hydrated && (
        <div className="rounded-2xl border border-border/80 bg-card p-6 text-sm text-muted-foreground">
          {t("myStudySettings.loading")}
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
              {t("myStudySettings.privacy")}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>✓ {t("myStudySettings.privacyLocalBrowser")}</li>
              <li>✓ {t("myStudySettings.privacyNoAccount")}</li>
              <li>✓ {t("myStudySettings.privacyNoCloud")}</li>
              <li>✓ {t("myStudySettings.privacyNoAnalytics")}</li>
              <li>✓ {t("myStudySettings.privacyNoExternal")}</li>
              <li>✓ {t("myStudySettings.privacyClearing")}</li>
            </ul>
          </section>

          {/* Current data summary */}
          <section aria-labelledby="data-summary" className="space-y-3">
            <h2
              id="data-summary"
              className="font-display text-lg font-semibold tracking-tight"
            >
              {t("myStudySettings.yourData")}
            </h2>
            <div className="rounded-2xl border border-border/80 bg-card p-5">
              <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("myStudySettings.bookmarks")}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                    {bookmarks.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("myStudySettings.notes")}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                    {notes.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("myStudySettings.collections")}
                  </dt>
                  <dd className="mt-1 font-display text-2xl font-semibold tabular-nums">
                    {collections.length}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("myStudySettings.recentReads")}
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
              {t("myStudySettings.backupRestore")}
            </h2>
            <div className="rounded-2xl border border-border/80 bg-card p-5">
              <p className="text-sm text-muted-foreground">
                {t("myStudySettings.backupDesc")}
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
              {t("myStudySettings.clearAllData")}
            </h2>
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
              <p className="text-sm text-muted-foreground">
                {t("myStudySettings.clearAllDataDesc")}
              </p>
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                {t("myStudySettings.clearAllData")}
              </button>
            </div>
          </section>

          <Dialog open={confirmClear} onOpenChange={setConfirmClear}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" aria-hidden />
                  {t("myStudySettings.clearAllData")}
                </DialogTitle>
                <DialogDescription>
                  {t("myStudySettings.clearAllDataDesc")}
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="rounded-full bg-destructive px-4 py-2 text-sm font-semibold text-destructive-foreground transition-opacity hover:opacity-90"
                >
                  {t("myStudySettings.confirmDelete")}
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
