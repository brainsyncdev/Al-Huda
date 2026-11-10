// Quality validation helpers for the three-dimension model.
//
// These functions validate content entities against each quality dimension
// independently. They do not modify data or fabricate information.

import type { Topic } from "@/lib/topics/data";
import type { StudyJourney } from "@/lib/study-journeys/types";
import type {
  TechnicalIntegrityResult,
  EditorialCompletenessResult,
  ScholarlyReviewResult,
  QualityState,
  TechnicalIssue,
  EditorialElement,
} from "./types";
import { getSurahIndex } from "@/lib/quran/data";

/**
 * Validate technical integrity of a topic.
 * Checks: valid ayah references, no duplicates, required fields present.
 */
export function validateTopicTechnicalIntegrity(topic: Topic): TechnicalIntegrityResult {
  const issues: TechnicalIssue[] = [];
  const surahs = getSurahIndex();
  const surahMap = new Map(surahs.map((s) => [s.id, s]));
  const refKeys = new Set<string>();

  // Check required fields
  if (!topic.slug) {
    issues.push({ type: "missing_required_field", severity: "error", message: "Missing slug", field: "slug" });
  }
  if (!topic.title) {
    issues.push({ type: "missing_required_field", severity: "error", message: "Missing title", field: "title" });
  }
  if (!topic.arabicTitle) {
    issues.push({ type: "missing_required_field", severity: "error", message: "Missing arabicTitle", field: "arabicTitle" });
  }
  if (!topic.summary) {
    issues.push({ type: "missing_required_field", severity: "error", message: "Missing summary", field: "summary" });
  }

  // Check ayah references
  for (const relation of topic.relations) {
    const surah = surahMap.get(relation.ref.surah);
    if (!surah) {
      issues.push({
        type: "invalid_reference",
        severity: "error",
        message: `Invalid surah ${relation.ref.surah}`,
        field: `relations[${topic.relations.indexOf(relation)}].ref.surah`,
      });
    } else if (relation.ref.ayah < 1 || relation.ref.ayah > surah.ayahCount) {
      issues.push({
        type: "invalid_reference",
        severity: "error",
        message: `Invalid ayah ${relation.ref.ayah} for surah ${relation.ref.surah} (max: ${surah.ayahCount})`,
        field: `relations[${topic.relations.indexOf(relation)}].ref.ayah`,
      });
    }

    // Check duplicates
    const key = `${relation.ref.surah}:${relation.ref.ayah}`;
    if (refKeys.has(key)) {
      issues.push({
        type: "duplicate_reference",
        severity: "warning",
        message: `Duplicate reference ${key}`,
        field: `relations[${topic.relations.indexOf(relation)}]`,
      });
    }
    refKeys.add(key);
  }

  const hasErrors = issues.some((i) => i.severity === "error");
  return {
    status: hasErrors ? "failed" : issues.length > 0 ? "passed" : "passed",
    issues,
    validatedAt: new Date().toISOString(),
  };
}

/**
 * Validate editorial completeness of a topic.
 * Checks: description, limitations, review state, translations.
 */
export function validateTopicEditorialCompleteness(topic: Topic): EditorialCompletenessResult {
  const elements: EditorialElement[] = [];

  // Check editorial description
  if (!topic.editorialDescription || topic.editorialDescription.trim() === "") {
    elements.push({ element: "editorialDescription", status: "missing", description: "Expanded description of topic scope" });
  } else if (topic.editorialDescription.length < 50) {
    elements.push({ element: "editorialDescription", status: "incomplete", description: "Description too short (< 50 chars)" });
  } else {
    elements.push({ element: "editorialDescription", status: "present" });
  }

  // Check known limitations
  if (!topic.knownLimitations || topic.knownLimitations.length === 0) {
    elements.push({ element: "knownLimitations", status: "missing", description: "Known limitations and scope disclosures" });
  } else {
    elements.push({ element: "knownLimitations", status: "present" });
  }

  // Check review state
  if (!topic.reviewState) {
    elements.push({ element: "reviewState", status: "missing", description: "Editorial workflow state" });
  } else {
    elements.push({ element: "reviewState", status: "present" });
  }

  // Check Urdu title (optional but tracked)
  if (!topic.urduTitle) {
    elements.push({ element: "urduTitle", status: "missing", description: "Urdu translation (optional)" });
  } else {
    elements.push({ element: "urduTitle", status: "present" });
  }

  // Check provenance
  if (!topic.provenance) {
    elements.push({ element: "provenance", status: "missing", description: "Editorial provenance record" });
  } else {
    elements.push({ element: "provenance", status: "present" });
  }

  // Check relations have rationales
  const missingRationales = topic.relations.filter((r) => !r.rationale || r.rationale.trim() === "").length;
  if (missingRationales > 0) {
    elements.push({
      element: "relationRationales",
      status: "incomplete",
      description: `${missingRationales} relations missing rationale`,
    });
  } else {
    elements.push({ element: "relationRationales", status: "present" });
  }

  const presentCount = elements.filter((e) => e.status === "present").length;
  const completenessScore = (presentCount / elements.length) * 100;

  let status: EditorialCompletenessResult["status"];
  if (completenessScore === 100) {
    status = "complete";
  } else if (completenessScore >= 70) {
    status = "needs_review";
  } else {
    status = "incomplete";
  }

  return {
    status,
    missingElements: elements.filter((e) => e.status !== "present"),
    completenessScore,
  };
}

/**
 * Validate scholarly review status of a topic.
 * Checks: provenance.status, review evidence.
 */
export function validateTopicScholarlyReview(topic: Topic): ScholarlyReviewResult {
  // Topics currently have status: "pending-scholarly-review"
  // This is the actual state — we do not fabricate review evidence
  const status = topic.provenance.status === "editorial-approved" ? "reviewed" : "pending";

  return {
    status,
    notes: status === "pending" ? "Awaiting scholarly review" : undefined,
  };
}

/**
 * Build complete quality state for a topic.
 */
export function buildTopicQualityState(topic: Topic): QualityState {
  return {
    entityId: topic.slug,
    entityType: "topic",
    technicalIntegrity: validateTopicTechnicalIntegrity(topic),
    editorialCompleteness: validateTopicEditorialCompleteness(topic),
    scholarlyReview: validateTopicScholarlyReview(topic),
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Validate technical integrity of a journey.
 */
export function validateJourneyTechnicalIntegrity(journey: StudyJourney): TechnicalIntegrityResult {
  const issues: TechnicalIssue[] = [];

  // Check required fields
  if (!journey.slug) {
    issues.push({ type: "missing_required_field", severity: "error", message: "Missing slug", field: "slug" });
  }
  if (!journey.title) {
    issues.push({ type: "missing_required_field", severity: "error", message: "Missing title", field: "title" });
  }
  if (!journey.learningObjective) {
    issues.push({ type: "missing_required_field", severity: "error", message: "Missing learningObjective", field: "learningObjective" });
  }
  if (!journey.stages || journey.stages.length === 0) {
    issues.push({ type: "missing_required_field", severity: "error", message: "Missing stages", field: "stages" });
  }

  // Check stage order
  const orders = journey.stages.map((s) => s.order);
  const expectedOrders = Array.from({ length: journey.stages.length }, (_, i) => i + 1);
  if (JSON.stringify(orders) !== JSON.stringify(expectedOrders)) {
    issues.push({
      type: "invalid_relationship",
      severity: "warning",
      message: "Stage order is not sequential",
      field: "stages.order",
    });
  }

  const hasErrors = issues.some((i) => i.severity === "error");
  return {
    status: hasErrors ? "failed" : "passed",
    issues,
    validatedAt: new Date().toISOString(),
  };
}

/**
 * Validate editorial completeness of a journey.
 */
export function validateJourneyEditorialCompleteness(journey: StudyJourney): EditorialCompletenessResult {
  const elements: EditorialElement[] = [];

  // Check journey-level elements
  if (!journey.learningObjective || journey.learningObjective.trim() === "") {
    elements.push({ element: "learningObjective", status: "missing" });
  } else {
    elements.push({ element: "learningObjective", status: "present" });
  }

  if (!journey.completionCriteria || journey.completionCriteria.length === 0) {
    elements.push({ element: "completionCriteria", status: "missing" });
  } else {
    elements.push({ element: "completionCriteria", status: "present" });
  }

  // Check stage-level elements
  const stagesMissingObjectives = journey.stages.filter((s) => !s.objective || s.objective.trim() === "").length;
  if (stagesMissingObjectives > 0) {
    elements.push({
      element: "stageObjectives",
      status: "incomplete",
      description: `${stagesMissingObjectives} stages missing objectives`,
    });
  } else {
    elements.push({ element: "stageObjectives", status: "present" });
  }

  const stagesMissingReflection = journey.stages.filter((s) => !s.reflectionPrompt || s.reflectionPrompt.trim() === "").length;
  if (stagesMissingReflection > 0) {
    elements.push({
      element: "stageReflectionPrompts",
      status: "incomplete",
      description: `${stagesMissingReflection} stages missing reflection prompts`,
    });
  } else {
    elements.push({ element: "stageReflectionPrompts", status: "present" });
  }

  const stagesMissingCriteria = journey.stages.filter((s) => !s.completionCriteria || s.completionCriteria.trim() === "").length;
  if (stagesMissingCriteria > 0) {
    elements.push({
      element: "stageCompletionCriteria",
      status: "incomplete",
      description: `${stagesMissingCriteria} stages missing completion criteria`,
    });
  } else {
    elements.push({ element: "stageCompletionCriteria", status: "present" });
  }

  const presentCount = elements.filter((e) => e.status === "present").length;
  const completenessScore = (presentCount / elements.length) * 100;

  let status: EditorialCompletenessResult["status"];
  if (completenessScore === 100) {
    status = "complete";
  } else if (completenessScore >= 70) {
    status = "needs_review";
  } else {
    status = "incomplete";
  }

  return {
    status,
    missingElements: elements.filter((e) => e.status !== "present"),
    completenessScore,
  };
}

/**
 * Validate scholarly review status of a journey.
 */
export function validateJourneyScholarlyReview(journey: StudyJourney): ScholarlyReviewResult {
  const status = journey.provenance.status === "editorial-approved" ? "reviewed" : "pending";

  return {
    status,
    notes: status === "pending" ? "Awaiting scholarly review" : undefined,
  };
}

/**
 * Build complete quality state for a journey.
 */
export function buildJourneyQualityState(journey: StudyJourney): QualityState {
  return {
    entityId: journey.slug,
    entityType: "journey",
    technicalIntegrity: validateJourneyTechnicalIntegrity(journey),
    editorialCompleteness: validateJourneyEditorialCompleteness(journey),
    scholarlyReview: validateJourneyScholarlyReview(journey),
    lastUpdated: new Date().toISOString(),
  };
}
