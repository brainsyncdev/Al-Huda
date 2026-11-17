"use client";

// MFD-10.2 — Evidence Panel Component
//
// Renders visually separate, clearly labelled sections for a mapping review:
// a. Quran Arabic (read-only)
// b. Translation with attribution
// c. Tafsir sources with evidence status badges
// d. Editorial explanation (rationale)
// e. Contemporary application (if exists)
// f. Private reviewer notes
//
// Shows prominent statement when no VERIFIED tafsir evidence exists.
// Provides Attach and Verify affordances that call callbacks.
// Keyboard accessible, responsive layout.

import { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  ExternalLink,
  FileText,
  Link2,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { TopicMapping } from "@/lib/taxonomy/topic-translation-data";
import type { EvidenceRecord } from "@/lib/scholarly/types";
import { getAyah } from "@/lib/quran/data";
import { TRANSLATION_CREDIT } from "@/lib/quran/sources";
import {
  EVIDENCE_STATUS_LABELS,
  EVIDENCE_STATUS_DESCRIPTIONS,
  isVerified,
  summarizeEvidence,
  getAvailableTafsirSourcesForAyah,
  verifyEvidence,
  createEvidenceRecord,
  validateEvidenceReference,
} from "@/lib/scholarly/evidence";
import { SourceAttribution } from "./source-attribution";
import { cn } from "@/lib/utils";

interface EvidencePanelProps {
  mapping: TopicMapping;
  evidence: EvidenceRecord[];
  onAttach?: (
    sourceId: string,
    ref: { volumePage?: string; sourceUrl?: string; excerpt?: string }
  ) => void;
  onVerify?: (evidenceId: string, notes: string) => void;
  reviewerId?: string;
  className?: string;
}

export function EvidencePanel({
  mapping,
  evidence,
  onAttach,
  onVerify,
  reviewerId,
  className,
}: EvidencePanelProps) {
  const summary = summarizeEvidence(evidence);
  const hasVerifiedEvidence = summary.hasVerified;

  // Resolve first ayah in range for display
  const ayah = getAyah(mapping.surahNumber, mapping.ayahStart);
  const tafsirSources = getAvailableTafsirSourcesForAyah(
    mapping.surahNumber,
    mapping.ayahStart
  );

  return (
    <div className={cn("space-y-6", className)}>
      {/* Prominent notice when no verified evidence */}
      {!hasVerifiedEvidence && (
        <div
          role="status"
          className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-700 dark:text-amber-300"
        >
          <div className="flex items-start gap-2">
            <CircleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <p>
              No verified tafsir evidence is currently attached to this mapping.
              The editorial rationale below has not been confirmed by scholarly
              review.
            </p>
          </div>
        </div>
      )}

      {/* Section A: Quran Arabic */}
      <section aria-labelledby="evidence-arabic-heading">
        <h3
          id="evidence-arabic-heading"
          className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Quran Text
        </h3>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          {ayah ? (
            <p
              dir="rtl"
              lang="ar"
              className="arabic-display text-xl leading-loose text-foreground"
            >
              {ayah.arabic}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Could not load Arabic text for Surah {mapping.surahNumber}, Ayah{" "}
              {mapping.ayahStart}.
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Surah {mapping.surahNumber}, Ayah{" "}
            {mapping.ayahStart === mapping.ayahEnd
              ? mapping.ayahStart
              : `${mapping.ayahStart}–${mapping.ayahEnd}`}
          </p>
        </div>
      </section>

      {/* Section B: Translation */}
      <section aria-labelledby="evidence-translation-heading">
        <h3
          id="evidence-translation-heading"
          className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Translation
        </h3>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          {ayah ? (
            <p className="text-sm leading-relaxed text-foreground">
              {ayah.translation}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Translation unavailable.
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            {TRANSLATION_CREDIT}
          </p>
        </div>
      </section>

      {/* Section C: Tafsir Sources */}
      <section aria-labelledby="evidence-tafsir-heading">
        <h3
          id="evidence-tafsir-heading"
          className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <BookOpen className="h-3.5 w-3.5" aria-hidden />
          Tafsir Sources
        </h3>
        <div className="space-y-3">
          {tafsirSources.map((source) => {
            // Find matching evidence record for this source
            const evRecord = evidence.find(
              (e) => e.sourceId === source.sourceId
            );
            return (
              <TafsirSourceCard
                key={source.sourceId}
                source={source}
                evidenceRecord={evRecord}
                mapping={mapping}
                onAttach={onAttach}
                onVerify={onVerify}
                reviewerId={reviewerId}
              />
            );
          })}
        </div>
      </section>

      {/* Section D: Editorial Explanation */}
      <section aria-labelledby="evidence-editorial-heading">
        <h3
          id="evidence-editorial-heading"
          className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          <FileText className="h-3.5 w-3.5" aria-hidden />
          Editorial Explanation
        </h3>
        <div className="rounded-xl border border-border/70 bg-secondary/30 p-4">
          <p className="text-sm leading-relaxed text-foreground">
            {mapping.rationale}
          </p>
          <p className="mt-2 text-xs italic text-muted-foreground">
            This is an editorial rationale, not a tafsir quotation. It explains
            why this ayah was mapped to this topic.
          </p>
        </div>
      </section>

      {/* Section E: Contemporary Application */}
      <section aria-labelledby="evidence-contemporary-heading">
        <h3
          id="evidence-contemporary-heading"
          className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Contemporary Application
        </h3>
        <div className="rounded-xl border border-border/70 bg-card p-4">
          <p className="text-sm text-muted-foreground">
            No contemporary application recorded for this mapping.
          </p>
        </div>
      </section>

      {/* Section F: Private Reviewer Notes */}
      <section aria-labelledby="evidence-notes-heading">
        <h3
          id="evidence-notes-heading"
          className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
        >
          Private Reviewer Notes
        </h3>
        <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4">
          <p className="text-xs text-muted-foreground">
            Local/private notes are stored separately and are not part of the
            scholarly evidence record. They are visible only on this device.
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Tafsir Source Card ──────────────────────────────────────────────────────

interface TafsirSourceCardProps {
  source: ReturnType<typeof getAvailableTafsirSourcesForAyah>[number];
  evidenceRecord?: EvidenceRecord;
  mapping: TopicMapping;
  onAttach?: EvidencePanelProps["onAttach"];
  onVerify?: EvidencePanelProps["onVerify"];
  reviewerId?: string;
}

function TafsirSourceCard({
  source,
  evidenceRecord,
  mapping,
  onAttach,
  onVerify,
  reviewerId,
}: TafsirSourceCardProps) {
  const [showAttach, setShowAttach] = useState(false);
  const [attachVolume, setAttachVolume] = useState("");
  const [attachUrl, setAttachUrl] = useState("");
  const [attachExcerpt, setAttachExcerpt] = useState("");
  const [verifyNotes, setVerifyNotes] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const [inlineError, setInlineError] = useState<string | null>(null);

  const status = evidenceRecord?.status ?? "NOT_ATTACHED";
  const statusLabel = EVIDENCE_STATUS_LABELS[status];
  const statusDescription = EVIDENCE_STATUS_DESCRIPTIONS[status];
  const verified = isVerified(status);

  const handleAttach = () => {
    if (!onAttach) return;
    setInlineError(null);

    // Validate reference against mapping
    const tempRecord = {
      surahNumber: mapping.surahNumber,
      ayahNumber: mapping.ayahStart,
    } as EvidenceRecord;
    const validation = validateEvidenceReference(tempRecord, mapping);
    if (!validation.ok) {
      setInlineError(validation.error ?? "Invalid reference.");
      return;
    }

    onAttach(source.sourceId, {
      volumePage: attachVolume.trim() || undefined,
      sourceUrl: attachUrl.trim() || undefined,
      excerpt: attachExcerpt.trim() || undefined,
    });
    setShowAttach(false);
    setAttachVolume("");
    setAttachUrl("");
    setAttachExcerpt("");
  };

  const handleVerify = () => {
    if (!onVerify || !evidenceRecord) return;
    setInlineError(null);

    // Use the lib's verification logic to validate preconditions
    const result = verifyEvidence(evidenceRecord, {
      verifierId: reviewerId ?? "",
      notes: verifyNotes,
    });
    if (!result.ok) {
      setInlineError(result.error ?? "Verification failed.");
      return;
    }

    onVerify(evidenceRecord.id, verifyNotes);
    setShowVerify(false);
    setVerifyNotes("");
  };

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {source.name}
            </span>
            <StatusBadge status={status} />
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {source.attribution}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Language: {source.language} · Reference level:{" "}
            {source.referenceLevel === "AYAH"
              ? "Ayah-level"
              : "Publisher homepage only"}
          </p>
          {!source.available && (
            <p className="mt-1 text-xs font-medium text-destructive">
              Currently unavailable
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex shrink-0 flex-col gap-1.5">
          {status === "NOT_ATTACHED" && onAttach && (
            <button
              type="button"
              onClick={() => {
                setShowAttach((v) => !v);
                setShowVerify(false);
                setInlineError(null);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary hover:bg-primary/10"
            >
              <Link2 className="h-3 w-3" aria-hidden />
              Attach source
            </button>
          )}
          {evidenceRecord && !verified && onVerify && (
            <button
              type="button"
              onClick={() => {
                setShowVerify((v) => !v);
                setShowAttach(false);
                setInlineError(null);
              }}
              className="inline-flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/5 px-2.5 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-400"
            >
              <ShieldCheck className="h-3 w-3" aria-hidden />
              Mark verified
            </button>
          )}
          {source.isExternal && source.available && (
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-md border border-border/70 bg-background/40 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-secondary/40"
            >
              <ExternalLink className="h-3 w-3" aria-hidden />
              Open
            </a>
          )}
        </div>
      </div>

      {/* Status description */}
      {status !== "NOT_ATTACHED" && (
        <p className="mt-2 text-xs text-muted-foreground">
          {statusDescription}
        </p>
      )}

      {/* Full attribution when evidence is attached */}
      {evidenceRecord && (
        <div className="mt-3 border-t border-border/50 pt-3">
          <SourceAttribution record={evidenceRecord} />
        </div>
      )}

      {/* Inline error */}
      {inlineError && (
        <div
          role="alert"
          className="mt-2 flex items-start gap-1.5 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive"
        >
          <XCircle className="mt-0.5 h-3 w-3 shrink-0" aria-hidden />
          {inlineError}
        </div>
      )}

      {/* Attach form */}
      {showAttach && (
        <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
          <label className="block text-xs font-medium text-foreground">
            Volume/Page (optional)
            <input
              type="text"
              value={attachVolume}
              onChange={(e) => setAttachVolume(e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              placeholder="e.g., Vol. 1, p. 234"
            />
          </label>
          <label className="block text-xs font-medium text-foreground">
            Specific URL (optional)
            <input
              type="url"
              value={attachUrl}
              onChange={(e) => setAttachUrl(e.target.value)}
              className="mt-1 block w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              placeholder="Ayah-level URL, not homepage"
            />
          </label>
          <label className="block text-xs font-medium text-foreground">
            Excerpt (optional, copyright-compliant)
            <textarea
              value={attachExcerpt}
              onChange={(e) => setAttachExcerpt(e.target.value)}
              rows={2}
              className="mt-1 block w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              placeholder="Brief passage excerpt"
            />
          </label>
          <button
            type="button"
            onClick={handleAttach}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            Attach reference
          </button>
        </div>
      )}

      {/* Verify form */}
      {showVerify && (
        <div className="mt-3 space-y-2 border-t border-border/50 pt-3">
          <label className="block text-xs font-medium text-foreground">
            Verification notes (required)
            <textarea
              value={verifyNotes}
              onChange={(e) => setVerifyNotes(e.target.value)}
              rows={3}
              required
              className="mt-1 block w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm"
              placeholder="Confirm this evidence supports the mapping…"
            />
          </label>
          <button
            type="button"
            onClick={handleVerify}
            disabled={!verifyNotes.trim()}
            className="rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            Confirm verification
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Status Badge ────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const config: Record<
    string,
    { icon: React.ComponentType<{ className?: string }>; colorClass: string }
  > = {
    VERIFIED: {
      icon: CheckCircle2,
      colorClass:
        "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
    },
    SOURCE_IDENTIFIED: {
      icon: Link2,
      colorClass: "bg-blue-500/10 text-blue-700 border-blue-500/30 dark:text-blue-400",
    },
    REFERENCE_PENDING_VERIFICATION: {
      icon: CircleAlert,
      colorClass:
        "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400",
    },
    UNAVAILABLE: {
      icon: XCircle,
      colorClass: "bg-muted text-muted-foreground border-border/60",
    },
    RIGHTS_RESTRICTED: {
      icon: ShieldCheck,
      colorClass: "bg-orange-500/10 text-orange-700 border-orange-500/30 dark:text-orange-400",
    },
    REJECTED: {
      icon: XCircle,
      colorClass:
        "bg-destructive/10 text-destructive border-destructive/30",
    },
    NOT_ATTACHED: {
      icon: FileText,
      colorClass: "bg-muted/50 text-muted-foreground border-border/50",
    },
  };

  const entry = config[status] ?? config.NOT_ATTACHED;
  const Icon = entry.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.625rem] font-semibold",
        entry.colorClass
      )}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {EVIDENCE_STATUS_LABELS[status as keyof typeof EVIDENCE_STATUS_LABELS] ??
        status}
    </span>
  );
}
