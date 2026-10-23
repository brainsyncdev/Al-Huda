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
} from "@/lib/backup";
import { useLibrary } from "@/lib/library/context";
import { usePrefs } from "@/lib/prefs/context";
import { useRevision } from "@/lib/revision/context";
import { usePaths } from "@/lib/paths/context";
import { useQuiz } from "@/lib/quiz/context";

const BUTTON_CLASS =
  "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";

export function BackupControls() {
  const library = useLibrary();
  const revision = useRevision();
  const prefs = usePrefs();
  const paths = usePaths();
  const quiz = useQuiz();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [reading, setReading] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const ready =
    library.hydrated &&
    revision.hydrated &&
    prefs.hydrated &&
    paths.hydrated &&
    quiz.hydrated;
  const planCount = Object.keys(revision.items).length;
  const pathsCount = Object.keys(paths.state.progress).length;
  const quizCount = quiz.state.attempts.filter(
    (a) => a.completedAt !== null
  ).length;

  function handleExport() {
    if (!ready) return;
    const file = buildBackup({
      library: {
        bookmarks: library.bookmarks,
        notes: library.notes,
        progress: library.progress,
      },
      revision: revision.exportState(),
      preferences: prefs.exportPrefs(),
      paths: paths.exportState(),
      quiz: quiz.exportState(),
    });
    downloadJson(file, backupFileName());
    toast.success(
      `Backup exported — ${library.bookmarks.length} bookmarks, ${library.notes.length} notes, ${planCount} planned verse${planCount === 1 ? "" : "s"}, ${pathsCount} learning path${pathsCount === 1 ? "" : "s"}, ${quizCount} quiz attempt${quizCount === 1 ? "" : "s"}.`
    );
    setNote(null);
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    // Checked before reading so a hostile file never gets buffered in full.
    if (file.size > MAX_BACKUP_CHARS) {
      setNote("This file is larger than 5 MB, which no Al-Huda backup reaches. Nothing was imported.");
      toast.error("Backup not imported");
      return;
    }

    setReading(true);
    setNote(null);
    try {
      const text = await file.text();
      const result = parseBackup(text);
      if (!result.ok) {
        setNote(result.error);
        toast.error("Backup not imported");
        return;
      }
      const data = result.data;

      const confirmed = window.confirm(
        `Replace everything on this device with the backup${
          data.exportedAt ? ` from ${new Date(data.exportedAt).toLocaleString()}` : ""
        }?\n\n` +
          `This overwrites:\n` +
          `• ${library.bookmarks.length} bookmarks, ${library.notes.length} notes, ${library.progress.length} reading entries\n` +
          `• ${planCount} planned verses and their schedules\n` +
          `• ${pathsCount} learning path progress entries\n` +
          `• ${quizCount} completed quiz attempts\n` +
          `• your reader preferences\n\n` +
          `The backup contains ${data.library.bookmarks.length} bookmarks, ` +
          `${data.library.notes.length} notes, ${Object.keys(data.revision.items).length} planned verses, ` +
          `${Object.keys(data.paths.progress).length} learning paths, and ` +
          `${data.quiz.attempts.filter((a) => a.completedAt !== null).length} completed quiz attempts. ` +
          `This cannot be undone.`
      );
      if (!confirmed) {
        setNote("Import cancelled. Nothing on this device was changed.");
        return;
      }

      const lib = library.restoreLibrary(data.library);
      const rev = revision.restoreState(data.revision);
      prefs.restorePrefs(data.preferences);
      paths.restoreState(data.paths);
      quiz.restoreState(data.quiz);

      toast.success(
        `Backup imported — ${lib.bookmarks} bookmarks, ${lib.notes} notes, ${rev.items} planned verses, ${Object.keys(data.paths.progress).length} learning paths, ${data.quiz.attempts.length} quiz attempts.`
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
    } catch {
      setNote("The file could not be read. Nothing was imported.");
      toast.error("Backup not imported");
    } finally {
      setReading(false);
      // Let the same file be picked again after a failed attempt.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function handleErase() {
    if (!ready) return;
    const confirmed = window.confirm(
      "Erase all local data on this device?\n\n" +
        "• bookmarks, private notes and reading history\n" +
        "• your revision plan and its review log\n" +
        "• learning path progress and onboarding\n" +
        "• quiz attempts and their answers\n" +
        "• reader preferences\n\n" +
        "There is no server copy to restore from. Export a backup first if you want to keep any of it. This cannot be undone."
    );
    if (!confirmed) return;
    library.clearAll();
    revision.clearAll();
    prefs.restorePrefs(undefined); // back to defaults
    paths.clearAll();
    quiz.clearAll();
    setNote("All local data erased from this device.");
    toast.success("All local data erased");
  }

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
          Export backup
        </button>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={!ready || reading}
          className={`${BUTTON_CLASS} bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground`}
        >
          <Upload className="h-4 w-4" aria-hidden />
          {reading ? "Reading…" : "Import backup"}
        </button>

        <button
          type="button"
          onClick={handleErase}
          disabled={!ready}
          className={`${BUTTON_CLASS} text-destructive hover:bg-destructive/10`}
        >
          <Trash2 className="h-4 w-4" aria-hidden />
          Delete all local data
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFile}
          className="sr-only"
          aria-label="Choose an Al-Huda backup file"
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
    </div>
  );
}
