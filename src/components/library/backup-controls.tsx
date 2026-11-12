"use client";

// Export / import / erase for every local store (FR-043).
//
// One control row used by both the Library and Settings pages, so the file a
// learner downloads is always the shared v2 envelope from @/lib/backup and
// there is no second exporter that could quietly omit a store.
//
// Import is replace, not merge, and says so before anything is written: a
// silent merge would make the resulting contents unpredictable, and a learner
// restoring a backup after losing site data wants their old state back, not a
// mixture of leftovers.

import { useRef, useState, type ChangeEvent } from "react";
import { Download, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import {
  MAX_BACKUP_CHARS,
  backupFileName,
  buildBackup,
  downloadJson,
  parseBackup,
  type RestorableBackup,
} from "@/lib/backup";
import { useLibrary } from "@/lib/library/context";
import { usePrefs } from "@/lib/prefs/context";
import { useRevision } from "@/lib/revision/context";
import { usePaths } from "@/lib/paths/context";
import { useQuiz } from "@/lib/quiz/context";
import { useReadingPlans } from "@/lib/reading-plans/context";
import { useJourneys } from "@/lib/study-journeys/context";
import { useReflections } from "@/lib/reflections/context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n/context";

const BUTTON_CLASS =
  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";

export function BackupControls() {
  const library = useLibrary();
  const revision = useRevision();
  const prefs = usePrefs();
  const paths = usePaths();
  const quiz = useQuiz();
  const readingPlans = useReadingPlans();
  const journeys = useJourneys();
  const reflections = useReflections();
  const t = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<RestorableBackup | null>(
    null
  );
  const [showEraseDialog, setShowEraseDialog] = useState(false);

  const ready =
    library.hydrated &&
    revision.hydrated &&
    prefs.hydrated &&
    paths.hydrated &&
    quiz.hydrated &&
    readingPlans.hydrated &&
    journeys.hydrated &&
    reflections.hydrated;
  const planCount = Object.keys(revision.items).length;
  const pathsCount = Object.keys(paths.state.progress).length;
  const quizCount = quiz.state.attempts.filter(
    (a) => a.completedAt !== null
  ).length;
  const readingPlansCount = readingPlans.state.targets.length;
  const journeysCount = Object.keys(journeys.state.progress).length;
  const reflectionsCount = reflections.state.reflections.length;

  function handleExport() {
    if (!ready) return;
    const file = buildBackup({
      library: {
        bookmarks: library.bookmarks,
        notes: library.notes,
        progress: library.progress,
        collections: library.collections,
        collectionAyat: library.collectionAyat,
      },
      revision: revision.exportState(),
      preferences: prefs.exportPrefs(),
      paths: paths.exportState(),
      quiz: quiz.exportState(),
      readingPlans: readingPlans.exportState(),
      journeys: journeys.exportState(),
      reflections: reflections.exportState(),
    });
    downloadJson(file, backupFileName());
    toast.success(
      `Backup exported — ${library.bookmarks.length} bookmarks, ${library.notes.length} notes, ${planCount} planned verse${planCount === 1 ? "" : "s"}, ${pathsCount} learning path${pathsCount === 1 ? "" : "s"}, ${quizCount} quiz attempt${quizCount === 1 ? "" : "s"}, ${readingPlansCount} reading plan${readingPlansCount === 1 ? "" : "s"}, ${journeysCount} study journey${journeysCount === 1 ? "" : "s"}, ${reflectionsCount} reflection${reflectionsCount === 1 ? "" : "s"}.`
    );
    setNote(null);
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Checked before reading so a hostile file never gets buffered in full.
    if (file.size > MAX_BACKUP_CHARS) {
      setNote(t("backup.tooLarge"));
      toast.error(t("backup.notImported"));
      return;
    }

    setReading(true);
    setNote(null);
    try {
      const text = await file.text();
      const result = parseBackup(text);
      if (!result.ok) {
        setNote(result.error);
        toast.error(t("backup.notImported"));
        return;
      }
      // Open the confirmation dialog instead of a blocking window.confirm.
      setPendingImport(result.data);
    } catch {
      setNote(t("backup.couldNotRead"));
      toast.error(t("backup.notImported"));
    } finally {
      setReading(false);
      // Let the same file be picked again after a failed attempt.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function confirmImport() {
    if (!pendingImport) return;
    const data = pendingImport;

    const lib = library.restoreLibrary(data.library);
    const rev = revision.restoreState(data.revision);
    prefs.restorePrefs(data.preferences);
    paths.restoreState(data.paths);
    quiz.restoreState(data.quiz);
    readingPlans.restoreState(data.readingPlans);
    journeys.restoreState(data.journeys);
    reflections.restoreState(data.reflections);

    toast.success(
      `Backup imported — ${lib.bookmarks} bookmarks, ${lib.notes} notes, ${rev.items} planned verses, ${Object.keys(data.paths.progress).length} learning paths, ${data.quiz.attempts.length} quiz attempts, ${data.readingPlans.targets.length} reading plans, ${Object.keys(data.journeys.progress).length} study journeys, ${data.reflections.reflections.length} reflections.`
    );
    setNote(
      data.sourceVersion === 1
        ? "This was a legacy (v1) library-only backup, so it contained no revision plan, learning paths, quiz attempts, or reader preferences: those were left empty and reset to defaults rather than guessed at."
        : data.sourceVersion === 2
        ? "This was a v2 backup without learning paths or quiz attempts: those sections were left empty."
        : data.sourceVersion === 3
        ? "This was a v3 backup without quiz attempts: that section was left empty."
        : null
    );
    setPendingImport(null);
  }

  function cancelImport() {
    setPendingImport(null);
    setNote(t("backup.importCancelled"));
  }

  function handleErase() {
    if (!ready) return;
    setShowEraseDialog(true);
  }

  function confirmErase() {
    library.clearAll();
    revision.clearAll();
    prefs.restorePrefs(undefined); // back to defaults
    paths.clearAll();
    quiz.clearAll();
    readingPlans.clearAll();
    journeys.clearAll();
    reflections.clearAll();
    setNote(t("backup.allDataErased"));
    toast.success(t("backup.allDataErased"));
    setShowEraseDialog(false);
  }

  const backupIn = pendingImport;
  const backupBookmarks = backupIn?.library.bookmarks.length ?? 0;
  const backupNotes = backupIn?.library.notes.length ?? 0;
  const backupPlanned = backupIn ? Object.keys(backupIn.revision.items).length : 0;
  const backupPaths = backupIn ? Object.keys(backupIn.paths.progress).length : 0;
  const backupQuiz = backupIn
    ? backupIn.quiz.attempts.filter((a) => a.completedAt !== null).length
    : 0;
  const backupJourneys = backupIn
    ? Object.keys(backupIn.journeys.progress).length
    : 0;
  const backupReflections = backupIn ? backupIn.reflections.reflections.length : 0;
  const backupExportedAt = backupIn?.exportedAt
    ? new Date(backupIn.exportedAt).toLocaleString()
    : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={handleExport}
          disabled={!ready}
          className={`${BUTTON_CLASS} bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground`}
        >
          <Download className="h-4 w-4" aria-hidden />
          {t("backup.exportBackup")}
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={!ready || reading}
          className={`${BUTTON_CLASS} bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground`}
        >
          <Upload className="h-4 w-4" aria-hidden />
          {reading ? t("backup.reading") : t("backup.importBackup")}
        </button>

        <button
          type="button"
          onClick={handleErase}
          disabled={!ready}
          className={`${BUTTON_CLASS} text-destructive hover:bg-destructive/10`}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          {t("backup.deleteAll")}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFile}
          className="sr-only"
          aria-label={t("backup.chooseFile")}
        />
      </div>

      {note && (
        <p
          role="status"
          className="max-w-prose rounded-xl border border-border/70 bg-background/70 p-3 text-xs leading-relaxed text-foreground/85"
        >
          {note}
        </p>
      )}

      <Dialog open={pendingImport !== null} onOpenChange={(open) => { if (!open) cancelImport(); }}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{t("backup.importDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("backup.importDialogDescription")}
              {backupExportedAt && (
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t("backup.exportedOn").replace("{date}", backupExportedAt)}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 text-sm sm:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">
                {t("backup.importDialogCurrentDevice")}
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {library.bookmarks.length} bookmarks</li>
                <li>• {library.notes.length} notes</li>
                <li>• {library.progress.length} reading entries</li>
                <li>• {planCount} planned verses</li>
                <li>• {pathsCount} learning path entries</li>
                <li>• {quizCount} completed quiz attempts</li>
                <li>• {journeysCount} study journey entries</li>
                <li>• {reflectionsCount} reflections</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-foreground">
                {t("backup.importDialogInBackup")}
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {backupBookmarks} bookmarks</li>
                <li>• {backupNotes} notes</li>
                <li>• {backupPlanned} planned verses</li>
                <li>• {backupPaths} learning path entries</li>
                <li>• {backupQuiz} completed quiz attempts</li>
                <li>• {backupJourneys} study journey entries</li>
                <li>• {backupReflections} reflections</li>
              </ul>
            </div>
          </div>

          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {t("backup.cannotBeUndone")}
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={cancelImport}
            >
              {t("common.cancel")}
            </Button>
            <Button type="button" onClick={confirmImport}>
              {t("backup.importDialogConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEraseDialog} onOpenChange={setShowEraseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("backup.eraseDialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("backup.eraseDialogDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-2 text-sm text-muted-foreground">
            <p>• bookmarks, private notes and reading history</p>
            <p>• your revision plan and its review log</p>
            <p>• learning path progress and onboarding</p>
            <p>• quiz attempts and their answers</p>
            <p>• study journey progress</p>
            <p>• personal reflections</p>
            <p>• reader preferences</p>
          </div>

          <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            {t("backup.eraseWarning")}
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowEraseDialog(false)}
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={confirmErase}
            >
              {t("backup.eraseDialogConfirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
