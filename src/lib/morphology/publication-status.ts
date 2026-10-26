// Publication status gate — bridges generated publication decisions to the UI.
//
// This module is the ONLY place that turns an automated publication decision
// into something a page may render. It never mutates ROOT_ALLOWLIST and never
// changes `reviewState`: human review status and automated publication status
// are separate axes, both of which must be read explicitly.
//
// WHY A SEPARATE GATE:
//   `canActivateRootTopic()` encodes human review (approved + selected lemmas).
//   Sprint 41 adds a different, narrower claim: the source data for this root
//   passed structural validation, no documented ambiguity was observed, and an
//   automated review recommended the complete attested lemma set. That justifies
//   a neutral word-occurrence index — not a scholarly classification, and not a
//   change to the human review lifecycle.
//
// A decision is accepted only when it was produced by the current policy
// version. A stale decision file therefore fails closed (page falls back to the
// pending-review view) instead of publishing under rules it was not checked
// against.

import { getPublication, type PublicationDecision } from "./publications";
import { PUBLICATION_POLICY_VERSION } from "./publication-policy";
import type { RootTopicEntry } from "./root-allowlist";

export type { PublicationDecision };

/** Get the automated publication decision for a root slug, if one exists. */
export function getPublicationDecision(
  slug: string
): PublicationDecision | null {
  return getPublication(slug);
}

/**
 * Check whether an automated publication decision authorizes a neutral
 * root-index page for this entry. Pure; reads no files.
 */
export function canPublishRootIndex(
  entry: RootTopicEntry,
  decision: PublicationDecision | null
): { canPublish: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!decision) {
    reasons.push("No automated review decision exists for this root.");
    return { canPublish: false, reasons };
  }

  if (decision.decision !== "publish") {
    reasons.push(`Automated review decision is "${decision.decision}", not "publish".`);
  }
  if (decision.slug !== entry.slug) {
    reasons.push(
      `Decision is for slug "${decision.slug}", not "${entry.slug}".`
    );
  }
  if (decision.decidedBy !== "automated-policy") {
    reasons.push("Decision was not produced by the automated policy.");
  }
  if (decision.policyVersion !== PUBLICATION_POLICY_VERSION) {
    reasons.push(
      `Decision uses policy ${decision.policyVersion}; current policy is ${PUBLICATION_POLICY_VERSION}. Re-run the review pipeline.`
    );
  }
  if (decision.root !== entry.roots[0]) {
    reasons.push(
      `Decision covers root "${decision.root}", not "${entry.roots[0]}".`
    );
  }
  if (decision.includedLemmas.length === 0) {
    reasons.push("Decision approved no lemmas.");
  }

  return { canPublish: reasons.length === 0, reasons };
}

/**
 * Derive the entry used to build an occurrence index.
 *
 * Only `includedLemmas` is substituted. `reviewState` is deliberately left
 * untouched so the human review lifecycle is never overwritten by an automated
 * decision, and so nothing that reads `reviewState` mistakes this for approval.
 */
export function buildPublishedIndexEntry(
  entry: RootTopicEntry,
  decision: PublicationDecision
): RootTopicEntry {
  return {
    ...entry,
    includedLemmas: [...decision.includedLemmas].sort(),
  };
}