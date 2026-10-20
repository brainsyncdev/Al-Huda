// Grounded answer pipeline (PRD §10; docs/AI-SAFETY.md steps 1–7).
//
// SERVER-ONLY. This module reads the pinned dataset through @/lib/quran/data,
// which uses node:fs; nothing here belongs in a client bundle, and no client
// file imports it. That is also why there is no `/api/ai/ask` route: the
// harness exists so its rules can be evaluated and audited while the feature
// is off, not to serve answers.
//
// WHAT IT GUARANTEES, IN ORDER:
//   1. Non-authority claims (hadith, tafsir, ruling, consensus, worldly
//      guarantee) abstain UNCONDITIONALLY, before any passage is consulted.
//      The bundled corpus contains none of those things, so any answer would
//      be invention (FR-064).
//   2. Quran and translation claims must name a reference that resolves in the
//      pinned dataset — "2:286" passes, "2:287" fails (FR-061, step 3).
//   3. Quran text must match the dataset byte for byte. A claim whose text
//      differs is abstained on, never "corrected": Arabic is never generated
//      (restricted behavior, AI-SAFETY).
//   4. Quotations and generated summaries are different segment types, so the
//      UI can label them differently (FR-062).
//   5. High-risk requests abstain with a redirect before classification of any
//      claim (AI-SAFETY high-risk list).
//   6. The feature flag is checked first: with the flag off, nothing is even
//      evaluated for emission.
//
// Everything abstains with a reason string. There is no partial answer path —
// one unsupported claim voids the whole draft (FR-063).

// RELATIVE IMPORTS, NOT `@/lib/...` — deliberately, and do not "tidy" these.
// vitest.config.ts configures no path alias on purpose, and evaluation-set.test.ts
// imports this module relatively. Vite does not read tsconfig `paths` without a
// plugin, so an alias here does not fail the app build — it fails the AI suite at
// import resolution, which silently voids the gate evidence in feature-flag.ts.
import { getAyah, getSurah } from "../quran/data";
import { getSource } from "../quran/sources";
import { parseReference } from "../quran/reference";
import { getTopic } from "../topics/data";
import { isApprovedSource, getApprovedSource } from "./approved-sources";
import { isAiAnswerEnabled } from "./feature-flag";
import { buildAuditRecord, type AiAuditRecord } from "./audit";

// ---------------------------------------------------------------------------
// Claim model
// ---------------------------------------------------------------------------

/**
 * Kinds a claim can have. The three authority kinds the PRD singles out —
 * hadith, tafsir, ruling/consensus — are present as claim types on purpose:
 * they exist so they can be recognised and refused, not so they can be stored.
 */
export type ClaimKind =
  | "quran-arabic"
  | "translation"
  | "topic-note"
  | "interface-help"
  | "hadith"
  | "tafsir"
  | "ruling"
  | "scholarly-consensus"
  | "worldly-guarantee";

/** Claim kinds this build can never support with bundled sources. */
export const NON_AUTHORITY_KINDS: readonly ClaimKind[] = [
  "hadith",
  "tafsir",
  "ruling",
  "scholarly-consensus",
  "worldly-guarantee",
];

interface BaseClaim {
  kind: ClaimKind;
  /** Plain text of the claim as a model would have drafted it. */
  text: string;
}

export interface QuranClaim extends BaseClaim {
  kind: "quran-arabic";
  /** Canonical reference, e.g. "2:286". */
  reference: string;
  /** The Arabic text being asserted — must match the dataset exactly. */
  arabic: string;
}

export interface TranslationClaim extends BaseClaim {
  kind: "translation";
  reference: string;
  text: string;
}

export interface TopicClaim extends BaseClaim {
  kind: "topic-note";
  /** Curated topic slug; must exist in the topic catalog. */
  slug: string;
}

export type Claim =
  | QuranClaim
  | TranslationClaim
  | TopicClaim
  | BaseClaim;

export interface Citation {
  /** "2:286" when the claim cites a verse; absent for topic notes. */
  reference?: string;
  /** Approved-source id — validated, never taken on trust. */
  sourceId: string;
  sourceVersion: string;
  /** User-facing label from the required list (AI-SAFETY labels). */
  label: string;
}

export type ClaimVerdict =
  | { verdict: "supported"; citation: Citation; label: string }
  | { verdict: "abstain"; reason: string; redirect?: string };

// ---------------------------------------------------------------------------
// Reference and text validation
// ---------------------------------------------------------------------------

/**
 * Resolve a reference string against the canonical dataset.
 * Returns null for anything that does not name a real verse — this is where
 * an invented citation like "2:287" dies.
 */
function resolveReference(reference: string): {
  surah: number;
  ayah: number;
} | null {
  const parsed = parseReference(reference);
  if (!parsed || parsed.ayah === undefined) return null;
  if (!getSurah(parsed.surah)) return null;
  if (!getAyah(parsed.surah, parsed.ayah)) return null;
  return { surah: parsed.surah, ayah: parsed.ayah };
}

const PACKAGE = getSource("quran-json");
const TRANSLATION_EDITION = getSource("tanzil-sahih");

function packageCitation(reference: string, label: string): Citation | null {
  const sourceId = "quran-json";
  if (!isApprovedSource(sourceId) || !PACKAGE) return null;
  return {
    reference,
    sourceId,
    sourceVersion: PACKAGE.version,
    label,
  };
}

// ---------------------------------------------------------------------------
// Request classification (pipeline step 1)
// ---------------------------------------------------------------------------

export type RequestClass =
  | "factual-reference"
  | "explanation"
  | "topic-list"
  | "ruling"
  | "sensitive-advice"
  | "text-generation";

/**
 * Heuristic, deliberately conservative: anything that smells like a ruling or
 * a guaranteed worldly outcome is classified as high-risk, and a misclassification
 * toward risk costs an abstention, while one away from risk would cost a
 * citation's worth of honesty.
 */
export function classifyRequest(question: string): RequestClass {
  const q = question.toLowerCase();

  if (
    /\b(fatwa|ruling|haram|halal|permissible|forbidden|is.*allowed|lawful|jurisprudence|sharia|shariah)\b/.test(
      q
    )
  ) {
    return "ruling";
  }
  if (
    /\b(cure|cured|healing|guarantee[d]?|medical|medicine|depression|anxiety|debt|investment|lottery|profit|job offer)\b/.test(
      q
    )
  ) {
    return "sensitive-advice";
  }
  if (/\b(generate|compose|write|make up)\b.*\b(arabic|quranic text|verse)\b/.test(q)) {
    return "text-generation";
  }
  if (/\b(topic|themes?|verses? about|show me.*about)\b/.test(q)) {
    return "topic-list";
  }
  if (/\d+\s*:\s*\d+/.test(q) || /\bwhich (surah|ayah|verse)\b/.test(q)) {
    return "factual-reference";
  }
  return "explanation";
}

const HIGH_RISK: ReadonlySet<RequestClass> = new Set<RequestClass>([
  "ruling",
  "sensitive-advice",
  "text-generation",
]);

/** Exposed for the evaluation set: which classes always redirect. */
export function isHighRisk(requestClass: RequestClass): boolean {
  return HIGH_RISK.has(requestClass);
}

/** Exposed for the evaluation set: does this reference name a real verse? */
export function referenceResolves(reference: string): boolean {
  return resolveReference(reference) !== null;
}

const REDIRECTS: Record<RequestClass, string> = {
  ruling:
    "This build does not issue religious rulings. Please take the question to a qualified scholar with your sources.",
  "sensitive-advice":
    "For medical, psychological, or financial matters, speak to a qualified professional. Verses are not guarantees of outcomes.",
  "text-generation":
    "Quranic Arabic is never generated here. Read the verbatim text in the reader instead.",
  "factual-reference": "",
  explanation: "",
  "topic-list": "",
};

// ---------------------------------------------------------------------------
// Claim evaluation (pipeline steps 3–5)
// ---------------------------------------------------------------------------

export function evaluateClaim(claim: Claim): ClaimVerdict {
  // Order matters: refusal before retrieval, always.
  if (NON_AUTHORITY_KINDS.includes(claim.kind)) {
    return {
      verdict: "abstain",
      reason: `No bundled, versioned source supports a "${claim.kind}" claim, so none is made.`,
      redirect:
        claim.kind === "worldly-guarantee"
          ? REDIRECTS["sensitive-advice"]
          : REDIRECTS.ruling,
    };
  }

  if (claim.kind === "quran-arabic") {
    const resolved = resolveReference(claim.reference);
    if (!resolved) {
      return {
        verdict: "abstain",
        reason: `Reference ${claim.reference} does not resolve in the pinned dataset, so nothing is quoted for it.`,
      };
    }
    const verse = getAyah(resolved.surah, resolved.ayah);
    if (!verse) {
      return { verdict: "abstain", reason: "The dataset returned no text for that reference." };
    }
    if (verse.arabic !== claim.arabic) {
      // Never "fix" the text: the claim was generated, and the dataset is the
      // only acceptable Arabic source.
      return {
        verdict: "abstain",
        reason: "The proposed Arabic text does not match the pinned dataset verbatim, so it is not shown.",
      };
    }
    const citation = packageCitation(
      `${resolved.surah}:${resolved.ayah}`,
      "Quran text (Uthmani script)"
    );
    if (!citation) {
      return { verdict: "abstain", reason: "The content package is not on the approved source list." };
    }
    return { verdict: "supported", citation, label: "Quran text" };
  }

  if (claim.kind === "translation") {
    const resolved = resolveReference(claim.reference);
    if (!resolved) {
      return {
        verdict: "abstain",
        reason: `Reference ${claim.reference} does not resolve in the pinned dataset, so no translation is quoted.`,
      };
    }
    const verse = getAyah(resolved.surah, resolved.ayah);
    if (!verse || verse.translation !== claim.text) {
      return {
        verdict: "abstain",
        reason: "The proposed translation does not match the pinned edition verbatim, so it is not shown.",
      };
    }
    const sourceId = "tanzil-sahih";
    const edition = TRANSLATION_EDITION;
    if (!isApprovedSource(sourceId) || !edition) {
      return { verdict: "abstain", reason: "The translation edition is not an approved source." };
    }
    return {
      verdict: "supported",
      citation: {
        reference: `${resolved.surah}:${resolved.ayah}`,
        sourceId,
        sourceVersion: edition.version,
        label: `Translation — ${edition.attribution}`,
      },
      label: "Translation",
    };
  }

  if (claim.kind === "topic-note") {
    // Topic notes are editorial, not authoritative: answerable only as a
    // labelled editorial connection (AI-SAFETY labels). The slug must exist,
    // or the note refers to a topic this build does not publish.
    if (!getTopic(claim.slug)) {
      return {
        verdict: "abstain",
        reason: `No curated topic "${claim.slug}" exists in this build, so no topic note is made.`,
      };
    }
    const pkg = getApprovedSource("quran-json");
    if (!pkg) {
      return { verdict: "abstain", reason: "Approved source registry unavailable." };
    }
    return {
      verdict: "supported",
      citation: {
        sourceId: pkg.id,
        sourceVersion: pkg.version,
        label: "Editorial topic connection",
      },
      label: "Editorial topic connection",
    };
  }

  // interface-help: no religious claim, still cited to the build itself.
  const pkg = getApprovedSource("quran-json");
  if (!pkg) {
    return { verdict: "abstain", reason: "Approved source registry unavailable." };
  }
  return {
    verdict: "supported",
    citation: {
      sourceId: pkg.id,
      sourceVersion: pkg.version,
      label: "Interface help (not religious content)",
    },
    label: "Interface",
  };
}

// ---------------------------------------------------------------------------
// Answer assembly (pipeline steps 4, 6, 7)
// ---------------------------------------------------------------------------

export interface QuoteSegment {
  type: "quote";
  label: string;
  text: string;
  citation: Citation;
}

export interface SummarySegment {
  type: "summary";
  label: string;
  text: string;
  citation: Citation;
}

export type AnswerSegment = QuoteSegment | SummarySegment;

export type AnswerOutcome = "answered" | "abstained" | "rejected-flag-off";

export interface AnswerResult {
  outcome: AnswerOutcome;
  reason: string;
  redirect?: string;
  segments: AnswerSegment[];
  audit: AiAuditRecord;
}

/**
 * The single entry point. With the feature flag off — the only state this
 * build can be in — every call returns `rejected-flag-off` and an audit record
 * saying so, which is itself useful evidence for the gate report.
 */
export function respond(question: string, claims: Claim[]): AnswerResult {
  const requestClass = classifyRequest(question);
  const origin = "evaluation-harness" as const;

  if (!isAiAnswerEnabled()) {
    return {
      outcome: "rejected-flag-off",
      reason:
        "The AI answer feature is disabled until the AI-SAFETY evaluation gates pass. Nothing was generated.",
      segments: [],
      audit: buildAuditRecord({
        outcome: "rejected-flag-off",
        requestClass,
        sourceIds: [],
        claimCount: claims.length,
        citationCount: 0,
        validationFailures: 0,
        origin,
      }),
    };
  }

  if (HIGH_RISK.has(requestClass)) {
    return {
      outcome: "abstained",
      reason: `This request was classified as "${requestClass}" and is answered only with a redirect.`,
      redirect: REDIRECTS[requestClass],
      segments: [],
      audit: buildAuditRecord({
        outcome: "abstained",
        requestClass,
        sourceIds: [],
        claimCount: claims.length,
        citationCount: 0,
        validationFailures: 0,
        origin,
      }),
    };
  }

  if (claims.length === 0) {
    return {
      outcome: "abstained",
      reason: "Retrieval returned no supportable material, so nothing is asserted.",
      segments: [],
      audit: buildAuditRecord({
        outcome: "abstained",
        requestClass,
        sourceIds: [],
        claimCount: 0,
        citationCount: 0,
        validationFailures: 0,
        origin,
      }),
    };
  }

  const segments: AnswerSegment[] = [];
  const sourceIds = new Set<string>();
  let validationFailures = 0;
  let firstFailure: string | null = null;

  for (const claim of claims) {
    const verdict = evaluateClaim(claim);
    if (verdict.verdict === "abstain") {
      validationFailures += 1;
      firstFailure = firstFailure ?? verdict.reason;
      continue;
    }
    sourceIds.add(verdict.citation.sourceId);

    // FR-062: quotation and summary are structurally different segments, so
    // the interface can label one "Quran text"/"Translation" and the other
    // "AI-assisted summary".
    const isQuote = claim.kind === "quran-arabic" || claim.kind === "translation";
    segments.push(
      isQuote
        ? { type: "quote", label: verdict.label, text: claim.text, citation: verdict.citation }
        : { type: "summary", label: verdict.label, text: claim.text, citation: verdict.citation }
    );
  }

  if (validationFailures > 0 || segments.length === 0) {
    return {
      outcome: "abstained",
      reason:
        firstFailure ??
        "No claim survived citation validation, so the draft is withheld in full.",
      segments: [],
      audit: buildAuditRecord({
        outcome: "abstained",
        requestClass,
        sourceIds: [...sourceIds],
        claimCount: claims.length,
        citationCount: 0,
        validationFailures,
        origin,
      }),
    };
  }

  return {
    outcome: "answered",
    reason: "Every claim resolved against an approved source.",
    segments,
    audit: buildAuditRecord({
      outcome: "answered",
      requestClass,
      sourceIds: [...sourceIds],
      claimCount: claims.length,
      citationCount: segments.length,
      validationFailures,
      origin,
    }),
  };
}
