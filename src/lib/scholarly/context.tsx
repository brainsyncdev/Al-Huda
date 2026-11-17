"use client";

// MFD-10.2 — Scholarly Evidence & Review provider (local-first).
//
// Same contract as ReflectionsProvider: everything lives in this browser's
// localStorage, there is no account and no server copy. The storage module
// owns parsing/validation; this file owns actions and hydration.
//
// GOVERNANCE:
// - No auto-approval anywhere. recordDecision delegates to the pure validator,
//   which requires a human rationale and (for APPROVED) verified evidence.
// - Reviewer identity is locally entered, NOT authenticated. credentialVerified
//   starts false and can only become true through an explicit governance action
//   recorded with setReviewer(..., {credentialVerification}).
// - History is append-only: decisions append new records via reviews.ts.
// - Agent 1 owns evidence.ts; we import its functions and unwrap its result
//   objects ({ok, record?, error?}) without editing that file.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createEvidenceRecord,
  verifyEvidence as verifyEvidencePure,
  summarizeEvidence,
  deriveEvidenceStatusForMapping,
  type CreateEvidenceInput,
  type EvidenceSummary,
} from "./evidence";
import {
  recordDecision as recordDecisionPure,
  setPriority as setPriorityPure,
  getReviewHistory,
  deriveMappingReviewState,
  type ValidateDecisionInput,
  type ReviewPriority,
} from "./reviews";
import {
  cloneEmptyState,
  clearScholarlyState,
  exportScholarlyState,
  loadScholarlyState,
  normalizeScholarlyState,
  restoreScholarlyState,
  saveScholarlyState,
  type ScholarlyReviewerIdentity,
  type ScholarlyState,
} from "./storage";
import type {
  EvidenceRecord,
  MappingReviewState,
  ReviewRecord,
} from "./types";

export type ActionResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: string };

/** Explicit governance action required to mark credentials verified. */
export interface CredentialVerificationAction {
  /** Who performed the verification (local identifier). */
  verifiedBy: string;
  /** What was checked (institution, ijazah, etc.). Recorded verbatim. */
  basis: string;
  /** ISO timestamp; defaults to now. */
  verifiedAt?: string;
}

interface ScholarlyContextValue {
  /** True once localStorage has been read (avoids hydration mismatch). */
  hydrated: boolean;
  state: ScholarlyState;
  /** False when the last persistence attempt failed (quota/private mode). */
  persisted: boolean;
  /** Append a human review decision. Never auto-approves. */
  recordDecision: (
    input: Omit<ValidateDecisionInput, "previousState" | "id" | "verifiedEvidenceIds">
  ) => ActionResult<ReviewRecord>;
  /** Attach an evidence record to a mapping (Agent 1's creator). */
  attachEvidence: (input: CreateEvidenceInput) => ActionResult<EvidenceRecord>;
  /** Human verification of one evidence record (Agent 1's verifier). */
  verifyEvidence: (
    evidenceId: string,
    input: { verifierId?: string; notes: string; verifiedAt?: string }
  ) => ActionResult<EvidenceRecord>;
  /** Update the local reviewer identity. Credentials stay unverified unless
   * an explicit governance action is supplied. */
  setReviewer: (
    identity: { id: string; displayName: string; roleNote?: string },
    credentialVerification?: CredentialVerificationAction
  ) => ActionResult<ScholarlyReviewerIdentity>;
  /** Human-set priority only; never AI-derived. */
  setPriority: (mappingId: string, priority: ReviewPriority) => void;
  /** Chronological review history for a mapping (oldest first). */
  getHistory: (mappingId: string) => ReviewRecord[];
  /** Derived review-state summary for a mapping. */
  getMappingState: (mappingId: string) => MappingReviewState;
  /** Evidence summary for a mapping (Agent 1's summarizer). */
  getEvidenceSummary: (mappingId: string) => EvidenceSummary;
  /** JSON-serializable snapshot for the shared v10 backup export. */
  exportState: () => ScholarlyState;
  /** Replace the whole store from a parsed backup section (re-normalized). */
  restoreState: (raw: unknown) => void;
  /** Erase all scholarly data on this device. */
  clearAll: () => void;
}

const ScholarlyContext = createContext<ScholarlyContextValue | null>(null);

export function ScholarlyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ScholarlyState>(() => cloneEmptyState());
  const [hydrated, setHydrated] = useState(false);
  const [persisted, setPersisted] = useState(true);

  useEffect(() => {
    setState(loadScholarlyState());
    setHydrated(true);
  }, []);

  const commit = useCallback((next: ScholarlyState) => {
    const stamped: ScholarlyState = {
      ...next,
      lastSavedAt: new Date().toISOString(),
    };
    setState(stamped);
    setPersisted(saveScholarlyState(stamped));
  }, []);

  const value = useMemo<ScholarlyContextValue>(() => {
    const evidenceFor = (mappingId: string): EvidenceRecord[] =>
      state.evidence.filter((e) => e.mappingId === mappingId);

    return {
      hydrated,
      state,
      persisted,
      recordDecision: (input) => {
        const verifiedEvidenceIds = evidenceFor(input.mappingId)
          .filter((e) => e.status === "VERIFIED")
          .map((e) => e.id);
        const result = recordDecisionPure(
          {
            schemaVersion: state.schemaVersion,
            reviews: state.reviews,
            lastSavedAt: state.lastSavedAt,
          },
          { ...input, verifiedEvidenceIds }
        );
        if (!result.ok) return { ok: false, error: result.error };
        commit({ ...state, reviews: result.store.reviews });
        return { ok: true, value: result.record };
      },
      attachEvidence: (input) => {
        const result = createEvidenceRecord(input);
        if (!result.ok || !result.record) {
          return { ok: false, error: result.error ?? "Could not create the evidence record." };
        }
        // One record per (mapping, source): re-attaching replaces nothing —
        // it is rejected so history stays honest.
        if (state.evidence.some((e) => e.id === result.record!.id)) {
          return {
            ok: false,
            error: "Evidence from this source is already attached to this mapping.",
          };
        }
        commit({ ...state, evidence: [...state.evidence, result.record] });
        return { ok: true, value: result.record };
      },
      verifyEvidence: (evidenceId, input) => {
        const record = state.evidence.find((e) => e.id === evidenceId);
        if (!record) {
          return { ok: false, error: `Unknown evidence record: ${evidenceId}` };
        }
        const verifierId = input.verifierId ?? state.reviewer.id;
        const result = verifyEvidencePure(record, {
          verifierId,
          notes: input.notes,
          verifiedAt: input.verifiedAt,
        });
        if (!result.ok || !result.record) {
          return { ok: false, error: result.error ?? "Verification failed." };
        }
        commit({
          ...state,
          evidence: state.evidence.map((e) =>
            e.id === evidenceId ? result.record! : e
          ),
        });
        return { ok: true, value: result.record };
      },
      setReviewer: (identity, credentialVerification) => {
        const id = identity.id.trim();
        const displayName = identity.displayName.trim();
        if (!id || !displayName) {
          return {
            ok: false,
            error: "Reviewer ID and display name are required (locally entered, not authenticated).",
          };
        }
        let credentialVerified = false;
        if (credentialVerification) {
          if (
            !credentialVerification.verifiedBy.trim() ||
            !credentialVerification.basis.trim()
          ) {
            return {
              ok: false,
              error:
                "Credential verification requires who verified it and the basis of verification.",
            };
          }
          credentialVerified = true;
        }
        const reviewer: ScholarlyReviewerIdentity = {
          id,
          displayName,
          credentialVerified,
          ...(identity.roleNote && identity.roleNote.trim()
            ? { roleNote: identity.roleNote.trim() }
            : {}),
        };
        commit({ ...state, reviewer });
        return { ok: true, value: reviewer };
      },
      setPriority: (mappingId, priority) => {
        commit(setPriorityPure(state, mappingId, priority));
      },
      getHistory: (mappingId) =>
        getReviewHistory(
          {
            schemaVersion: state.schemaVersion,
            reviews: state.reviews,
            lastSavedAt: state.lastSavedAt,
          },
          mappingId
        ),
      getMappingState: (mappingId) =>
        deriveMappingReviewState(mappingId, state.reviews, state.evidence),
      getEvidenceSummary: (mappingId) => summarizeEvidence(evidenceFor(mappingId)),
      exportState: () => exportScholarlyState(state),
      restoreState: (raw) => {
        commit(restoreScholarlyState(raw));
      },
      clearAll: () => {
        clearScholarlyState();
        setState(cloneEmptyState());
        setPersisted(true);
      },
    };
  }, [state, hydrated, persisted, commit]);

  return (
    <ScholarlyContext.Provider value={value}>
      {children}
    </ScholarlyContext.Provider>
  );
}

export function useScholarly(): ScholarlyContextValue {
  const ctx = useContext(ScholarlyContext);
  if (!ctx) {
    throw new Error("useScholarly must be used within ScholarlyProvider");
  }
  return ctx;
}

// Re-export derivation helpers so UI code can compute per-mapping evidence
// status without importing Agent 1's module directly.
export { deriveEvidenceStatusForMapping, summarizeEvidence };
export { normalizeScholarlyState };
