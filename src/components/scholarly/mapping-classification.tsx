"use client";

// MFD-10.2 — Mapping Classification Display
//
// Shows the four distinct classification categories with definitions,
// highlights which one the mapping maps to, and states plainly that
// classification is editorial and pending scholarly review.

import type { TopicMapping } from "@/lib/taxonomy/topic-translation-data";
import type { ReviewDecision, MappingReviewState } from "@/lib/scholarly/types";
import {
  classifyMappingType,
  type MappingClassification,
} from "@/lib/scholarly/types";
import { summarizeEvidence, type EvidenceSummary } from "@/lib/scholarly/evidence";
import type { EvidenceRecord } from "@/lib/scholarly/types";

interface MappingClassificationProps {
  mapping: TopicMapping;
  evidence?: EvidenceRecord[];
  reviewState?: MappingReviewState;
  reviewerDecision?: ReviewDecision;
  reviewerRationale?: string;
  reviewerDate?: string;
  className?: string;
}

const CLASSIFICATION_DEFINITIONS: Record<MappingClassification, string> = {
  DIRECT_QURANIC_REFERENCE:
    "The mapping points directly to specific Quranic verses whose text explicitly addresses this topic.",
  THEMATIC_REFERENCE:
    "The mapping connects verses thematically related to this topic, though the connection may require interpretive context.",
  EDITORIAL_EDUCATIONAL_CATEGORY:
    "An editorial categorization created for educational organization, including explicit instructions and prophetic narratives grouped by pedagogical purpose.",
  CONTEMPORARY_APPLICATION:
    "Modern application or contextualization of Quranic guidance to contemporary situations.",
};

const CLASSIFICATION_LABELS: Record<MappingClassification, string> = {
  DIRECT_QURANIC_REFERENCE: "Direct Quranic Reference",
  THEMATIC_REFERENCE: "Thematic Reference",
  EDITORIAL_EDUCATIONAL_CATEGORY: "Editorial Educational Category",
  CONTEMPORARY_APPLICATION: "Contemporary Application",
};

export function MappingClassificationDisplay({
  mapping,
  evidence = [],
  reviewState,
  reviewerDecision,
  reviewerRationale,
  reviewerDate,
  className,
}: MappingClassificationProps) {
  const currentClassification = classifyMappingType(mapping.mappingType);
  const summary: EvidenceSummary = summarizeEvidence(evidence);

  return (
    <div className={className}>
      <h3 className="mb-3 text-base font-semibold text-foreground">
        Mapping Classification
      </h3>

      <p className="mb-4 text-xs italic text-muted-foreground">
        This classification is editorial and pending scholarly review. It has not
        been approved by qualified scholars.
      </p>

      <div className="space-y-2">
        {(Object.keys(CLASSIFICATION_DEFINITIONS) as MappingClassification[]).map(
          (cls) => {
            const isActive = cls === currentClassification;
            return (
              <div
                key={cls}
                className={`rounded-lg border p-3 ${
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border/60 bg-background/40 opacity-60"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${
                      isActive ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                    aria-hidden
                  />
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {CLASSIFICATION_LABELS[cls]}
                      {isActive && (
                        <span className="ml-2 text-xs font-semibold text-primary">
                          ← Current
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                      {CLASSIFICATION_DEFINITIONS[cls]}
                    </p>
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>

      {/* Mapping metadata */}
      <div className="mt-4 space-y-2 border-t border-border/60 pt-3 text-sm">
        <div>
          <span className="font-semibold text-foreground">Original rationale: </span>
          <span className="text-foreground/85">{mapping.rationale}</span>
        </div>
        <div>
          <span className="font-semibold text-foreground">Evidence attached: </span>
          <span className="text-foreground/85">{summary.total} record{summary.total !== 1 ? "s" : ""}</span>
        </div>
        <div>
          <span className="font-semibold text-foreground">Verification status: </span>
          <span className="text-foreground/85">
            {summary.hasVerified
              ? `${summary.byStatus.VERIFIED} verified`
              : "No verified evidence"}
          </span>
        </div>
        {reviewState && (
          <div>
            <span className="font-semibold text-foreground">Current review status: </span>
            <span className="text-foreground/85">
              {reviewState.currentDecision ?? "Not yet reviewed"}
            </span>
          </div>
        )}
      </div>

      {/* Reviewer decision if provided */}
      {reviewerDecision && (
        <div className="mt-3 rounded-lg border border-border/60 bg-secondary/30 p-3">
          <p className="text-sm">
            <span className="font-semibold text-foreground">Reviewer decision: </span>
            <span className="text-foreground/85">{reviewerDecision}</span>
          </p>
          {reviewerRationale && (
            <p className="mt-1 text-sm">
              <span className="font-semibold text-foreground">Rationale: </span>
              <span className="text-foreground/85">{reviewerRationale}</span>
            </p>
          )}
          {reviewerDate && (
            <p className="mt-1 text-xs text-muted-foreground">
              Decided: {reviewerDate}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
