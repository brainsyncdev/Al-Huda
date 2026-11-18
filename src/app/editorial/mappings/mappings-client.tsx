"use client";

// MFD-10.2 — Scholarly Mapping Review Workspace (client).
//
// Browse/search/filter/sort all 789 mappings, inspect one mapping's rationale,
// classification, append-only review history and evidence state, and record an
// explicit human decision behind a confirmation dialog.
//
// GOVERNANCE:
// - Mappings are READ-ONLY props from the server; nothing here mutates them.
// - No auto-approval: validateDecision gates every decision; APPROVED needs
//   verified evidence explicitly considered.
// - Reviewer identity is locally entered, NOT authenticated — stated inline.
// - Status is always text + icon, never colour alone. Provenance is visible
//   text, not hidden in tooltips.
// - Agent 1's <EvidencePanel/> is wired by the Lead at EVIDENCE_PANEL_SLOT;
//   this file does not import Agent 1's components.

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowDownWideNarrow,
  BookOpenCheck,
  CheckCircle2,
  CircleDashed,
  Clock,
  FileQuestion,
  Filter,
  Flag,
  History,
  Loader2,
  PauseCircle,
  Search,
  ShieldAlert,
  UserRound,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useScholarly } from "@/lib/scholarly/context";
import {
  deriveGovernanceBucket,
  getPriority,
  validateDecision,
  REVIEW_DECISION_DESCRIPTIONS,
  REVIEW_DECISION_LABELS,
  REVIEW_PRIORITY_LABELS,
  REVIEW_PRIORITIES,
  REVIEW_STATUS_BUCKET_LABELS,
  UNREVIEWED_LABEL,
  type ReviewPriority,
} from "@/lib/scholarly/reviews";
import {
  EVIDENCE_STATUS_LABELS,
  deriveEvidenceStatusForMapping,
} from "@/lib/scholarly/evidence";
import {
  classifyMappingType,
  type EvidenceStatus,
  type MappingClassification,
  type ReviewDecision,
} from "@/lib/scholarly/types";
import { EvidencePanel } from "@/components/scholarly/evidence-panel";
import type { TopicMapping } from "@/lib/taxonomy/topic-translation-data";

// ─── Serializable props ──────────────────────────────────────────────────────

export interface MappingRow {
  id: string;
  topicId: string;
  topicTitle: string;
  surahNumber: number;
  ayahStart: number;
  ayahEnd: number;
  mappingType: string;
  rationale: string;
  sourceIds: string[];
  provenance: string;
  status: string;
  /** Pre-resolved ayah text (server-side). Null when resolution failed. */
  ayahText?: { arabic: string; translation: string } | null;
}

export interface SurahLabel {
  id: number;
  transliteration: string;
  meaning: string;
  ayahCount: number;
}

interface MappingsClientProps {
  mappings: MappingRow[];
  surahs: SurahLabel[];
}

// ─── Static option tables ────────────────────────────────────────────────────

const DECISIONS: ReviewDecision[] = [
  "APPROVED",
  "REJECTED",
  "REVISION_REQUIRED",
  "INSUFFICIENT_EVIDENCE",
  "DEFERRED",
];

const EVIDENCE_STATUSES: EvidenceStatus[] = [
  "NOT_ATTACHED",
  "SOURCE_IDENTIFIED",
  "REFERENCE_PENDING_VERIFICATION",
  "VERIFIED",
  "UNAVAILABLE",
  "RIGHTS_RESTRICTED",
  "REJECTED",
];

const CLASSIFICATIONS: MappingClassification[] = [
  "DIRECT_QURANIC_REFERENCE",
  "THEMATIC_REFERENCE",
  "EDITORIAL_EDUCATIONAL_CATEGORY",
  "CONTEMPORARY_APPLICATION",
];

const CLASSIFICATION_LABELS: Record<MappingClassification, string> = {
  DIRECT_QURANIC_REFERENCE: "Direct Quranic reference",
  THEMATIC_REFERENCE: "Thematic reference",
  EDITORIAL_EDUCATIONAL_CATEGORY: "Editorial / educational category",
  CONTEMPORARY_APPLICATION: "Contemporary application",
};

type SortKey = "surah" | "topic" | "review" | "evidence" | "lastReview";

const SORT_LABELS: Record<SortKey, string> = {
  surah: "Surah + Ayah",
  topic: "Topic",
  review: "Review status",
  evidence: "Evidence status",
  lastReview: "Last review date",
};

type QueuePreset =
  | "none"
  | "no-evidence"
  | "source-unverified"
  | "verified-awaiting-review"
  | "insufficient"
  | "revision"
  | "deferred"
  | "approved"
  | "rejected";

const QUEUE_PRESETS: { value: QueuePreset; label: string }[] = [
  { value: "none", label: "All mappings" },
  { value: "no-evidence", label: "No evidence attached" },
  { value: "source-unverified", label: "Source identified, unverified" },
  { value: "verified-awaiting-review", label: "Evidence verified, awaiting review" },
  { value: "insufficient", label: "Insufficient evidence" },
  { value: "revision", label: "Revision required" },
  { value: "deferred", label: "Deferred" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

// ─── Small presentational helpers (text + icon, never colour alone) ─────────

function DecisionBadge({ decision }: { decision: ReviewDecision | null }) {
  if (decision === null) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
        <CircleDashed className="h-3 w-3" aria-hidden />
        {UNREVIEWED_LABEL}
      </span>
    );
  }
  const Icon =
    decision === "APPROVED"
      ? CheckCircle2
      : decision === "REJECTED"
        ? XCircle
        : decision === "REVISION_REQUIRED"
          ? AlertCircle
          : decision === "INSUFFICIENT_EVIDENCE"
            ? FileQuestion
            : PauseCircle;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
      <Icon className="h-3 w-3" aria-hidden />
      {REVIEW_DECISION_LABELS[decision]}
    </span>
  );
}

function EvidenceBadge({ status }: { status: EvidenceStatus }) {
  const Icon =
    status === "VERIFIED"
      ? BookOpenCheck
      : status === "NOT_ATTACHED"
        ? CircleDashed
        : status === "REJECTED" || status === "UNAVAILABLE"
          ? XCircle
          : Clock;
  return (
    <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
      <Icon className="h-3 w-3" aria-hidden />
      {EVIDENCE_STATUS_LABELS[status]}
    </span>
  );
}

function ayahRangeLabel(m: MappingRow): string {
  return m.ayahStart === m.ayahEnd
    ? `${m.surahNumber}:${m.ayahStart}`
    : `${m.surahNumber}:${m.ayahStart}–${m.ayahEnd}`;
}

/** Parse "2:255", "2:255-260", or plain numbers into a search predicate input. */
function parseAyahQuery(query: string): { surah: number; ayah?: number } | null {
  const trimmed = query.trim();
  const colon = /^(\d{1,3})\s*:\s*(\d{1,3})/.exec(trimmed);
  if (colon) {
    return { surah: Number(colon[1]), ayah: Number(colon[2]) };
  }
  if (/^\d{1,3}$/.test(trimmed)) {
    return { surah: Number(trimmed) };
  }
  return null;
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function MappingsClient({ mappings, surahs }: MappingsClientProps) {
  const scholarly = useScholarly();
  const { hydrated, state } = scholarly;

  const [query, setQuery] = useState("");
  const [decisionFilter, setDecisionFilter] = useState<string>("all");
  const [evidenceFilter, setEvidenceFilter] = useState<string>("all");
  const [classificationFilter, setClassificationFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("surah");
  const [preset, setPreset] = useState<QueuePreset>("none");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Decision form state
  const [formDecision, setFormDecision] = useState<ReviewDecision>("DEFERRED");
  const [formRationale, setFormRationale] = useState("");
  const [formConsidered, setFormConsidered] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [recordedNote, setRecordedNote] = useState<string | null>(null);

  // Reviewer identity panel state
  const [reviewerIdInput, setReviewerIdInput] = useState<string | null>(null);
  const [reviewerNameInput, setReviewerNameInput] = useState<string | null>(null);
  const [reviewerRoleInput, setReviewerRoleInput] = useState<string | null>(null);
  const [reviewerError, setReviewerError] = useState<string | null>(null);

  const surahById = useMemo(() => {
    const map = new Map<number, SurahLabel>();
    for (const s of surahs) map.set(s.id, s);
    return map;
  }, [surahs]);

  /** Per-mapping derived view data. Recomputed when reviews/evidence change. */
  const derived = useMemo(() => {
    const map = new Map<
      string,
      {
        decision: ReviewDecision | null;
        evidenceStatus: EvidenceStatus;
        classification: MappingClassification;
        lastReviewedAt: string | null;
        bucketLabel: string;
      }
    >();
    for (const m of mappings) {
      const rs = scholarly.getMappingState(m.id);
      const evRecords = state.evidence.filter((e) => e.mappingId === m.id);
      const evidenceStatus = deriveEvidenceStatusForMapping(
        {
          id: m.id,
          topicId: m.topicId,
          surahNumber: m.surahNumber,
          ayahStart: m.ayahStart,
          ayahEnd: m.ayahEnd,
          mappingType: m.mappingType,
          rationale: m.rationale,
          sourceIds: m.sourceIds,
          provenance: m.provenance,
          status: m.status,
        },
        evRecords
      );
      // Technical validation floor: the dataset loader already resolved these
      // rows server-side; that fact NEVER upgrades governance status.
      const bucket = deriveGovernanceBucket(rs, true);
      map.set(m.id, {
        decision: rs.currentDecision,
        evidenceStatus,
        classification: classifyMappingType(m.mappingType),
        lastReviewedAt: rs.lastReviewedAt,
        bucketLabel: REVIEW_STATUS_BUCKET_LABELS[bucket],
      });
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mappings, state.reviews, state.evidence]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const ayahQuery = q ? parseAyahQuery(q) : null;

    let rows = mappings.filter((m) => {
      const d = derived.get(m.id)!;

      // Search: topic title/id OR surah:ayah OR plain number.
      if (q) {
        const topicHit =
          m.topicTitle.toLowerCase().includes(q) ||
          m.topicId.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q);
        let ayahHit = false;
        if (ayahQuery) {
          ayahHit =
            m.surahNumber === ayahQuery.surah &&
            (ayahQuery.ayah === undefined ||
              (ayahQuery.ayah >= m.ayahStart && ayahQuery.ayah <= m.ayahEnd));
        }
        const surahName = surahById.get(m.surahNumber)?.transliteration.toLowerCase() ?? "";
        const nameHit = !ayahQuery && surahName.includes(q);
        if (!topicHit && !ayahHit && !nameHit) return false;
      }

      // Filters
      if (decisionFilter !== "all") {
        if (decisionFilter === "UNREVIEWED") {
          if (d.decision !== null) return false;
        } else if (d.decision !== decisionFilter) {
          return false;
        }
      }
      if (evidenceFilter !== "all" && d.evidenceStatus !== evidenceFilter) return false;
      if (classificationFilter !== "all" && d.classification !== classificationFilter) {
        return false;
      }

      // Queue presets
      switch (preset) {
        case "no-evidence":
          if (d.evidenceStatus !== "NOT_ATTACHED") return false;
          break;
        case "source-unverified":
          if (
            d.evidenceStatus !== "SOURCE_IDENTIFIED" &&
            d.evidenceStatus !== "REFERENCE_PENDING_VERIFICATION"
          )
            return false;
          break;
        case "verified-awaiting-review":
          if (d.evidenceStatus !== "VERIFIED" || d.decision !== null) return false;
          break;
        case "insufficient":
          if (d.decision !== "INSUFFICIENT_EVIDENCE") return false;
          break;
        case "revision":
          if (d.decision !== "REVISION_REQUIRED") return false;
          break;
        case "deferred":
          if (d.decision !== "DEFERRED") return false;
          break;
        case "approved":
          if (d.decision !== "APPROVED") return false;
          break;
        case "rejected":
          if (d.decision !== "REJECTED") return false;
          break;
        case "none":
          break;
      }
      return true;
    });

    const decisionOrder: Record<string, number> = {
      UNREVIEWED: 0,
      INSUFFICIENT_EVIDENCE: 1,
      REVISION_REQUIRED: 2,
      DEFERRED: 3,
      REJECTED: 4,
      APPROVED: 5,
    };
    const evidenceOrder: Record<string, number> = Object.fromEntries(
      EVIDENCE_STATUSES.map((s, i) => [s, i])
    );

    rows = rows.slice().sort((a, b) => {
      const da = derived.get(a.id)!;
      const db = derived.get(b.id)!;
      switch (sortKey) {
        case "topic":
          return (
            a.topicTitle.localeCompare(b.topicTitle) ||
            a.surahNumber - b.surahNumber ||
            a.ayahStart - b.ayahStart
          );
        case "review":
          return (
            (decisionOrder[da.decision ?? "UNREVIEWED"] ?? 9) -
              (decisionOrder[db.decision ?? "UNREVIEWED"] ?? 9) ||
            a.surahNumber - b.surahNumber ||
            a.ayahStart - b.ayahStart
          );
        case "evidence":
          return (
            (evidenceOrder[da.evidenceStatus] ?? 9) -
              (evidenceOrder[db.evidenceStatus] ?? 9) ||
            a.surahNumber - b.surahNumber ||
            a.ayahStart - b.ayahStart
          );
        case "lastReview": {
          const ta = da.lastReviewedAt ?? "";
          const tb = db.lastReviewedAt ?? "";
          // Newest first; never-reviewed rows sink to the bottom.
          if (ta === tb) return a.surahNumber - b.surahNumber || a.ayahStart - b.ayahStart;
          if (!ta) return 1;
          if (!tb) return -1;
          return tb.localeCompare(ta);
        }
        case "surah":
        default:
          return a.surahNumber - b.surahNumber || a.ayahStart - b.ayahStart;
      }
    });
    return rows;
  }, [
    mappings,
    derived,
    query,
    decisionFilter,
    evidenceFilter,
    classificationFilter,
    sortKey,
    preset,
    surahById,
  ]);

  const selected = selectedId ? mappings.find((m) => m.id === selectedId) ?? null : null;
  const selectedDerived = selected ? derived.get(selected.id)! : null;
  const selectedHistory = selected ? scholarly.getHistory(selected.id) : [];
  const selectedEvidence = selected
    ? state.evidence.filter((e) => e.mappingId === selected.id)
    : [];

  function selectMapping(id: string) {
    setSelectedId(id);
    setFormDecision("DEFERRED");
    setFormRationale("");
    setFormConsidered([]);
    setFormError(null);
    setRecordedNote(null);
  }

  function openConfirmation() {
    if (!selected) return;
    setRecordedNote(null);
    // Single source of truth: run the pure validator BEFORE opening the
    // confirmation dialog so its exact errors appear inline and nothing can
    // silently succeed. The same rules are re-checked inside recordDecision.
    const history = scholarly.getHistory(selected.id);
    const previousState =
      history.length > 0 ? history[history.length - 1].decision : null;
    const validated = validateDecision({
      mappingId: selected.id,
      reviewerId: state.reviewer.id,
      reviewerRole: state.reviewer.roleNote,
      decision: formDecision,
      rationale: formRationale,
      evidenceConsidered: formConsidered,
      verifiedEvidenceIds: selectedEvidence
        .filter((e) => e.status === "VERIFIED")
        .map((e) => e.id),
      previousState,
    });
    if (!validated.ok) {
      setFormError(validated.error);
      return;
    }
    setFormError(null);
    setConfirmOpen(true);
  }

  function confirmDecision() {
    if (!selected) return;
    const result = scholarly.recordDecision({
      mappingId: selected.id,
      reviewerId: state.reviewer.id,
      reviewerRole: state.reviewer.roleNote,
      decision: formDecision,
      rationale: formRationale,
      evidenceConsidered: formConsidered,
    });
    setConfirmOpen(false);
    if (!result.ok) {
      setFormError(result.error);
      return;
    }
    setFormError(null);
    setFormRationale("");
    setFormConsidered([]);
    setRecordedNote(
      `Recorded ${REVIEW_DECISION_LABELS[result.value.decision]} as ${result.value.id}. Earlier records were preserved (append-only).`
    );
  }

  function saveReviewer() {
    const result = scholarly.setReviewer({
      id: reviewerIdInput ?? state.reviewer.id,
      displayName: reviewerNameInput ?? state.reviewer.displayName,
      roleNote: reviewerRoleInput ?? state.reviewer.roleNote ?? "",
    });
    if (!result.ok) {
      setReviewerError(result.error);
      return;
    }
    setReviewerError(null);
    setReviewerIdInput(null);
    setReviewerNameInput(null);
    setReviewerRoleInput(null);
  }

  // ─── Loading / empty states ────────────────────────────────────────────────

  if (!hydrated) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex items-center gap-3 rounded-xl border p-6 text-sm text-muted-foreground"
      >
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Loading your local review workspace…
      </div>
    );
  }

  if (mappings.length === 0) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm dark:border-amber-900/50 dark:bg-amber-950/20">
        <p className="flex items-center gap-2 font-medium">
          <AlertCircle className="h-4 w-4" aria-hidden /> No mappings available
        </p>
        <p className="mt-1 text-muted-foreground">
          The mapping dataset returned no records. Nothing was modified.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {!scholarly.persisted && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
          <p>
            Local storage could not be written (quota or private mode). Your
            work is kept in memory for this session only — export a backup
            before closing the page.
          </p>
        </div>
      )}

      {/* ── Reviewer identity panel ── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserRound className="h-4 w-4" aria-hidden /> Reviewer identity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="flex items-start gap-2 text-sm text-muted-foreground">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            <span>
              Identity is <strong>locally entered, not independently authenticated</strong>.
              {state.reviewer.credentialVerified
                ? " A credential verification has been recorded through governance for this identity."
                : " No credential has been verified; you are not described as a qualified scholar."}
            </span>
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <Label htmlFor="reviewer-id">Reviewer ID</Label>
              <Input
                id="reviewer-id"
                value={reviewerIdInput ?? state.reviewer.id}
                onChange={(e) => setReviewerIdInput(e.target.value)}
                placeholder="e.g. local-reviewer-1"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reviewer-name">Display name</Label>
              <Input
                id="reviewer-name"
                value={reviewerNameInput ?? state.reviewer.displayName}
                onChange={(e) => setReviewerNameInput(e.target.value)}
                placeholder="Your name"
                autoComplete="off"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="reviewer-role">Role note (self-declared)</Label>
              <Input
                id="reviewer-role"
                value={reviewerRoleInput ?? state.reviewer.roleNote ?? ""}
                onChange={(e) => setReviewerRoleInput(e.target.value)}
                placeholder="e.g. Student of knowledge"
                autoComplete="off"
              />
            </div>
          </div>
          {reviewerError && (
            <p role="alert" className="flex items-center gap-1.5 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" aria-hidden /> {reviewerError}
            </p>
          )}
          <Button type="button" variant="outline" size="sm" onClick={saveReviewer}>
            Save identity
          </Button>
        </CardContent>
      </Card>

      {/* ── Queue controls ── */}
      <section aria-label="Review queue controls" className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <div className="relative xl:col-span-2">
            <Search
              className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
              aria-hidden
            />
            <Input
              aria-label="Search by topic or Surah:Ayah"
              className="pl-8"
              placeholder='Topic, or "2:255", or surah number'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={decisionFilter} onValueChange={setDecisionFilter}>
            <SelectTrigger aria-label="Filter by review status">
              <SelectValue placeholder="Review status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All review statuses</SelectItem>
              <SelectItem value="UNREVIEWED">{UNREVIEWED_LABEL}</SelectItem>
              {DECISIONS.map((d) => (
                <SelectItem key={d} value={d}>
                  {REVIEW_DECISION_LABELS[d]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={evidenceFilter} onValueChange={setEvidenceFilter}>
            <SelectTrigger aria-label="Filter by evidence status">
              <SelectValue placeholder="Evidence status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All evidence statuses</SelectItem>
              {EVIDENCE_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {EVIDENCE_STATUS_LABELS[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={classificationFilter} onValueChange={setClassificationFilter}>
            <SelectTrigger aria-label="Filter by mapping classification">
              <SelectValue placeholder="Classification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All classifications</SelectItem>
              {CLASSIFICATIONS.map((c) => (
                <SelectItem key={c} value={c}>
                  {CLASSIFICATION_LABELS[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger aria-label="Sort mappings">
              <ArrowDownWideNarrow className="mr-1 h-4 w-4" aria-hidden />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SORT_LABELS) as SortKey[]).map((k) => (
                <SelectItem key={k} value={k}>
                  {SORT_LABELS[k]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <Filter className="h-3.5 w-3.5" aria-hidden /> Queue:
          </span>
          {QUEUE_PRESETS.map((p) => (
            <Button
              key={p.value}
              type="button"
              size="sm"
              variant={preset === p.value ? "default" : "outline"}
              aria-pressed={preset === p.value}
              onClick={() => setPreset(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground" aria-live="polite">
          Showing {filtered.length} of {mappings.length} mappings ·{" "}
          {state.reviews.length} review record{state.reviews.length === 1 ? "" : "s"} ·{" "}
          {state.evidence.length} evidence record{state.evidence.length === 1 ? "" : "s"}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        {/* ── Queue list ── */}
        <section aria-label="Mapping queue" className="space-y-2">
          {filtered.length === 0 ? (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <FileQuestion className="h-4 w-4" aria-hidden /> No mappings match
              </p>
              <p className="mt-1">
                Adjust the search, filters, or queue preset. No data was changed.
              </p>
            </div>
          ) : (
            <ul className="max-h-[70vh] space-y-2 overflow-y-auto pr-1">
              {filtered.map((m) => {
                const d = derived.get(m.id)!;
                const priority = getPriority(state, m.id);
                const isSelected = m.id === selectedId;
                return (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => selectMapping(m.id)}
                      aria-current={isSelected ? "true" : undefined}
                      className={`w-full rounded-xl border p-3 text-left text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isSelected ? "border-primary bg-accent" : ""
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium">{m.topicTitle}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          {ayahRangeLabel(m)}
                          {surahById.get(m.surahNumber)
                            ? ` · ${surahById.get(m.surahNumber)!.transliteration}`
                            : ""}
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-1.5">
                        <DecisionBadge decision={d.decision} />
                        <EvidenceBadge status={d.evidenceStatus} />
                        {priority !== "NORMAL" && (
                          <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium">
                            <Flag className="h-3 w-3" aria-hidden />
                            {REVIEW_PRIORITY_LABELS[priority]} priority
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-xs text-muted-foreground">
                        {CLASSIFICATION_LABELS[d.classification]} · provenance:{" "}
                        {m.provenance}
                      </p>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ── Detail workspace ── */}
        <section aria-label="Mapping detail" className="space-y-4">
          {!selected || !selectedDerived ? (
            <div className="rounded-xl border p-6 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <BookOpenCheck className="h-4 w-4" aria-hidden /> Select a mapping
              </p>
              <p className="mt-1">
                Choose a mapping from the queue to see its rationale,
                classification, evidence state, and append-only review history.
              </p>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">
                    {selected.topicTitle} · {ayahRangeLabel(selected)}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {selected.id} · topic: {selected.topicId}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex flex-wrap gap-1.5">
                    <DecisionBadge decision={selectedDerived.decision} />
                    <EvidenceBadge status={selectedDerived.evidenceStatus} />
                    <Badge variant="outline">
                      {CLASSIFICATION_LABELS[selectedDerived.classification]}
                    </Badge>
                  </div>
                  <p>
                    <span className="font-medium">Existing rationale:</span>{" "}
                    {selected.rationale}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Provenance:</span>{" "}
                    {selected.provenance} · <span className="font-medium text-foreground">Dataset status:</span>{" "}
                    {selected.status} · <span className="font-medium text-foreground">Sources:</span>{" "}
                    {selected.sourceIds.join(", ") || "none recorded"}
                  </p>
                  <p className="text-muted-foreground">
                    Governance bucket: {selectedDerived.bucketLabel}
                  </p>
                  <Separator />
                  <div className="flex flex-wrap items-center gap-2">
                    <Label htmlFor="priority-select" className="inline-flex items-center gap-1">
                      <Flag className="h-3.5 w-3.5" aria-hidden /> Priority (human-set)
                    </Label>
                    <Select
                      value={getPriority(state, selected.id)}
                      onValueChange={(v) =>
                        scholarly.setPriority(selected.id, v as ReviewPriority)
                      }
                    >
                      <SelectTrigger id="priority-select" className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {REVIEW_PRIORITIES.map((p) => (
                          <SelectItem key={p} value={p}>
                            {REVIEW_PRIORITY_LABELS[p]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Evidence Panel (Agent 1 component wired by Lead) */}
              {(() => {
                // Convert the serializable MappingRow back to TopicMapping
                // for the EvidencePanel. This is a read-only projection; the
                // panel never mutates the mapping.
                const topicMapping: TopicMapping = {
                  id: selected.id,
                  topicId: selected.topicId,
                  surahNumber: selected.surahNumber,
                  ayahStart: selected.ayahStart,
                  ayahEnd: selected.ayahEnd,
                  mappingType: selected.mappingType,
                  rationale: selected.rationale,
                  sourceIds: selected.sourceIds,
                  provenance: selected.provenance,
                  status: selected.status,
                };
                return (
                  <EvidencePanel
                    mapping={topicMapping}
                    evidence={selectedEvidence}
                    ayahText={selected.ayahText}
                    reviewerId={state.reviewer.id || undefined}
                    onAttach={(sourceId, ref) => {
                      const result = scholarly.attachEvidence({
                        mappingId: selected.id,
                        sourceId,
                        surahNumber: selected.surahNumber,
                        ayahNumber: selected.ayahStart,
                        volumePage: ref.volumePage,
                        sourceUrl: ref.sourceUrl,
                        excerpt: ref.excerpt,
                      });
                      if (!result.ok) {
                        setFormError(result.error);
                      } else {
                        setFormError(null);
                      }
                    }}
                    onVerify={(evidenceId, notes) => {
                      const result = scholarly.verifyEvidence(evidenceId, {
                        notes,
                      });
                      if (!result.ok) {
                        setFormError(result.error);
                      } else {
                        setFormError(null);
                      }
                    }}
                  />
                );
              })()}

              {/* ── Append-only history ── */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <History className="h-4 w-4" aria-hidden /> Review history
                    (append-only)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {selectedHistory.length === 0 ? (
                    <p className="text-muted-foreground">
                      No decisions recorded. This mapping awaits scholarly review.
                    </p>
                  ) : (
                    <ol className="space-y-2">
                      {selectedHistory.map((r) => (
                        <li key={r.id} className="rounded-lg border p-2">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <DecisionBadge decision={r.decision} />
                            <span className="text-xs text-muted-foreground">
                              {new Date(r.decidedAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="mt-1">
                            <span className="font-medium">Reviewer:</span>{" "}
                            {r.reviewerId}
                            {r.reviewerRole ? ` (${r.reviewerRole}, self-declared)` : ""}{" "}
                            — locally entered, not authenticated
                          </p>
                          <p className="mt-1">{r.rationale}</p>
                          {r.evidenceConsidered.length > 0 && (
                            <p className="mt-1 break-all text-xs text-muted-foreground">
                              Evidence considered: {r.evidenceConsidered.join(", ")}
                            </p>
                          )}
                          <p className="mt-1 font-mono text-xs text-muted-foreground">
                            {r.id} · {r.previousState ?? "UNREVIEWED"} → {r.newState}
                          </p>
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>

              {/* ── Decision form ── */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Record a decision</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-muted-foreground">
                    Every decision requires a written rationale and is appended
                    to the history — earlier records are never erased. A
                    reversal creates a new record.
                  </p>
                  <div className="space-y-1">
                    <Label htmlFor="decision-select">Decision</Label>
                    <Select
                      value={formDecision}
                      onValueChange={(v) => setFormDecision(v as ReviewDecision)}
                    >
                      <SelectTrigger id="decision-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DECISIONS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {REVIEW_DECISION_LABELS[d]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {REVIEW_DECISION_DESCRIPTIONS[formDecision]}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="decision-rationale">
                      Rationale (required for every decision)
                    </Label>
                    <Textarea
                      id="decision-rationale"
                      value={formRationale}
                      onChange={(e) => setFormRationale(e.target.value)}
                      placeholder="Explain the basis for this decision, citing the evidence you examined."
                      rows={4}
                    />
                  </div>
                  <fieldset className="space-y-2">
                    <legend className="text-sm font-medium">
                      Evidence considered
                    </legend>
                    {selectedEvidence.length === 0 ? (
                      <p className="text-xs text-muted-foreground">
                        No evidence records exist for this mapping yet.
                      </p>
                    ) : (
                      selectedEvidence.map((e) => (
                        <div key={e.id} className="flex items-start gap-2">
                          <Checkbox
                            id={`consider-${e.id}`}
                            checked={formConsidered.includes(e.id)}
                            onCheckedChange={(checked) =>
                              setFormConsidered((prev) =>
                                checked === true
                                  ? [...prev, e.id]
                                  : prev.filter((id) => id !== e.id)
                              )
                            }
                          />
                          <Label
                            htmlFor={`consider-${e.id}`}
                            className="text-xs font-normal leading-snug"
                          >
                            {e.sourceTitle} — {EVIDENCE_STATUS_LABELS[e.status]}
                            <span className="block break-all font-mono text-muted-foreground">
                              {e.id}
                            </span>
                          </Label>
                        </div>
                      ))
                    )}
                  </fieldset>
                  {formError && (
                    <p role="alert" className="flex items-start gap-1.5 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      {formError}
                    </p>
                  )}
                  {recordedNote && (
                    <p role="status" className="flex items-start gap-1.5 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                      {recordedNote}
                    </p>
                  )}
                  <Button type="button" onClick={openConfirmation}>
                    Review &amp; record decision…
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </section>
      </div>

      {/* ── Explicit confirmation dialog ── */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm review decision</DialogTitle>
            <DialogDescription>
              This will append a new, permanent record to this device&apos;s
              review history. Earlier records are preserved.
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Mapping:</span> {selected.id} ({selected.topicTitle},{" "}
                {ayahRangeLabel(selected)})
              </p>
              <p>
                <span className="font-medium">Decision:</span>{" "}
                {REVIEW_DECISION_LABELS[formDecision]}
              </p>
              <p>
                <span className="font-medium">Reviewer:</span> {state.reviewer.id}
                {state.reviewer.displayName ? ` (${state.reviewer.displayName})` : ""} —
                locally entered, not independently authenticated
                {state.reviewer.credentialVerified
                  ? "; credential verification recorded via governance"
                  : "; no verified credential"}
              </p>
              <p>
                <span className="font-medium">Rationale:</span> {formRationale}
              </p>
              <p className="break-all">
                <span className="font-medium">Evidence considered:</span>{" "}
                {formConsidered.length > 0 ? formConsidered.join(", ") : "none"}
              </p>
              {formDecision === "DEFERRED" && (
                <p className="text-xs text-muted-foreground">
                  Reminder: deferral is a postponement, not a rejection.
                </p>
              )}
              {formDecision === "INSUFFICIENT_EVIDENCE" && (
                <p className="text-xs text-muted-foreground">
                  Reminder: insufficient evidence does not mean the mapping is wrong.
                </p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={confirmDecision}>
              Record decision
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
