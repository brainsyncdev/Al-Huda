// Domain-topic relationship catalog v1.
//
// PURE MODULE: no React, no fs, no network. Safe to import from client code.
//
// STATUS OF THIS CATALOG:
//
// This is an EDITORIAL PROPOSAL connecting the 14 proposed domains to the
// 11 existing canonical topics. Each relationship is stamped `pending-review`
// on the editorial track. No relationship has been approved by a scholar.
//
// DESIGN PRINCIPLES:
//
//   1. Each relationship has a stable, unique ID derived from (domainId, topicSlug).
//   2. Each relationship carries explicit semantics distinguishing navigation-only
//      aids from organizational-membership proposals.
//   3. Each relationship carries editorial evidence explaining why the topic
//      belongs in the domain (based on subject-list overlap and topic metadata).
//   4. No relationship is automatically promoted to approved.
//   5. No scholarly evidence is fabricated.
//   6. The schema supports many-to-many (one topic in multiple domains), but
//      this initial set uses 1:1 mappings where the evidence is strongest.
//
// RELATIONSHIP TO DIMENSION.topicSlugs:
//
//   The 15 dimensions in `src/lib/explore/dimensions.ts` have `topicSlugs`
//   fields that are NAVIGATION AIDS, not domain assignments. This catalog
//   is separate and distinct. A topic may appear in both a dimension's
//   topicSlugs and a domain's relationships, but the two systems serve
//   different purposes and carry different provenance.
//
// WHAT THIS MODULE DOES NOT CONTAIN:
//
//   - No passage assignments (no ayah or surah references)
//   - No scholarly approvals or reviewer identities
//   - No claims that a topic is a scholarly classification of the Quran
//   - No duplication of topic content (topics remain canonical in topics/data.ts)

import type { DomainId } from "./domains";
import { getDomain } from "./domains";
import { getTopic } from "@/lib/topics/data";
import type {
  RelationshipEvidence,
  TaxonomyProvenance,
} from "./schema";

/**
 * Semantics of a domain-topic relationship.
 *
 * - "navigation-only": pure UI aid, no interpretive claim. Like
 *   Dimension.topicSlugs. Cannot be presented as a scholarly classification.
 * - "organizational-membership": editorial proposal that the topic belongs
 *   in the domain, based on subject-list overlap and topic metadata. Carries
 *   editorial evidence. Pending review.
 */
export type DomainTopicSemantics =
  | "navigation-only"
  | "organizational-membership";

/**
 * A typed, provenance-aware relationship between a domain and a topic.
 */
export interface DomainTopicRelation {
  /** Stable id: `domain-topic:{domainId}--{topicSlug}`. */
  id: string;
  /** Canonical domain id. */
  domainId: DomainId;
  /** Canonical topic slug. */
  topicSlug: string;
  /** What this relationship asserts (navigation aid vs. organizational proposal). */
  semantics: DomainTopicSemantics;
  /** Plain-language rationale for why this topic belongs in this domain. */
  purpose: string;
  /** At least one evidence record required. */
  evidence: RelationshipEvidence[];
  /** Provenance with review state. */
  provenance: TaxonomyProvenance;
}

/**
 * Stable relationship ID. Deterministic from (domainId, topicSlug).
 */
export function domainTopicRelationId(
  domainId: string,
  topicSlug: string
): string {
  return `domain-topic:${domainId}--${topicSlug}`;
}

/**
 * Common provenance for all domain-topic relationships in this release.
 * Every relationship is `pending-review` on the editorial track with no
 * decisions. No scholarly approval has been granted.
 */
const DOMAIN_TOPIC_PROVENANCE: TaxonomyProvenance = {
  method:
    "editorial-domain-mapping-v1 (subject-list overlap between domain scope and canonical topic metadata)",
  assertedBy: "Al-Huda editorial team",
  assertedAt: "2026-10-26",
  state: "pending-review",
  decisions: [],
  sources: [],
};

/**
 * Helper to build a domain-topic relation with editorial evidence.
 */
function rel(
  domainId: DomainId,
  topicSlug: string,
  semantics: DomainTopicSemantics,
  purpose: string,
  evidenceStatement: string
): DomainTopicRelation {
  return {
    id: domainTopicRelationId(domainId, topicSlug),
    domainId,
    topicSlug,
    semantics,
    purpose,
    evidence: [
      {
        type: "editorial",
        statement: evidenceStatement,
        sources: [],
      },
    ],
    provenance: DOMAIN_TOPIC_PROVENANCE,
  };
}

/**
 * The initial domain-topic relationship catalog.
 *
 * Each entry maps a canonical topic to a domain based on explicit overlap
 * between the domain's subject list and the topic's canonical metadata
 * (title, Arabic title, summary). All relationships are organizational-
 * membership proposals with editorial evidence, pending review.
 *
 * Rationale for each mapping:
 *
 *   patience → ethics-character
 *     Domain subjects include "patience (sabr)". Topic title "Patience",
 *     Arabic "الصبر". Summary addresses verses about patience.
 *
 *   gratitude → ethics-character
 *     Domain subjects include "gratitude (shukr)". Topic title "Gratitude",
 *     Arabic "الشكر". Summary addresses verses about gratitude.
 *
 *   trust-in-god → ethics-character
 *     Domain subjects include "trust in God (tawakkul)". Topic title
 *     "Trust in God", Arabic "التوكل". Summary addresses tawakkul.
 *
 *   mercy-and-forgiveness → ethics-character
 *     Domain subjects include "mercy and forgiveness". Topic title
 *     "Mercy and Forgiveness". Summary addresses God's mercy and forgiveness.
 *
 *   remembrance → worship-practice
 *     Domain subjects include "dhikr (remembrance)". Topic title
 *     "Remembrance", Arabic "الذكر". Summary addresses dhikr.
 *
 *   giving → economic-conduct
 *     Domain subjects include "charity and spending". Topic title
 *     "Giving in the Way of God", Arabic "الإنفاق" (spending/charity).
 *     Summary addresses charity and spending in God's cause.
 *
 *   justice → society-justice
 *     Domain subjects include "justice and fairness". Topic title
 *     "Justice", Arabic "العدل". Summary addresses justice and fairness.
 *
 *   parents-and-family → family-relationships
 *     Domain subjects include "parents and children". Topic title
 *     "Parents and Family". Summary addresses parents and family duties.
 *
 *   hardship-and-ease → human-experiences
 *     Domain subjects include "hardship and ease". Topic title
 *     "Hardship and Ease". Summary addresses difficulty and relief.
 *
 *   knowledge-and-reflection → revelation-guidance
 *     Domain subjects include "the command to read", "reflecting on the
 *     Quran". Topic summary mentions "the first revelation's command to
 *     read" and "calls to ponder the Quran and creation". Primary emphasis
 *     is on revelation and reflection.
 *
 *   the-hereafter → eschatology-afterlife
 *     Domain subjects include "death and the soul", "Day of Judgment",
 *     "resurrection". Topic title "The Hereafter", Arabic "الآخرة".
 *     Domain title "Eschatology and the Afterlife", Arabic "الآخرة".
 *     Summary addresses the life to come.
 */
export const DOMAIN_TOPIC_RELATIONS: DomainTopicRelation[] = [
  rel(
    "ethics-character",
    "patience",
    "organizational-membership",
    "The topic of patience (sabr) is a core subject within the ethics and character domain.",
    "The domain's subject list includes 'patience (sabr)'; the topic's canonical title is 'Patience' (الصبر) and its summary addresses verses about patience (sabr) — seeking help through patience and prayer, responding to loss, and the reward promised to those who persevere."
  ),
  rel(
    "ethics-character",
    "gratitude",
    "organizational-membership",
    "The topic of gratitude (shukr) is a core subject within the ethics and character domain.",
    "The domain's subject list includes 'gratitude (shukr)'; the topic's canonical title is 'Gratitude' (الشكر) and its summary addresses verses about gratitude — remembering God's favors, the promise that gratitude brings increase, and invitations to be thankful."
  ),
  rel(
    "ethics-character",
    "trust-in-god",
    "organizational-membership",
    "The topic of trust in God (tawakkul) is a core subject within the ethics and character domain.",
    "The domain's subject list includes 'trust in God (tawakkul)'; the topic's canonical title is 'Trust in God' (التوكل) and its summary addresses verses about tawakkul — relying upon God after taking action."
  ),
  rel(
    "ethics-character",
    "mercy-and-forgiveness",
    "organizational-membership",
    "The topic of mercy and forgiveness is a core subject within the ethics and character domain.",
    "The domain's subject list includes 'mercy and forgiveness'; the topic's canonical title is 'Mercy and Forgiveness' and its summary addresses verses about God's mercy and forgiveness — the breadth of His mercy, the invitation to seek forgiveness, and the caution against despairing of it."
  ),
  rel(
    "worship-practice",
    "remembrance",
    "organizational-membership",
    "The topic of remembrance (dhikr) is a core subject within the worship and spiritual practice domain.",
    "The domain's subject list includes 'dhikr (remembrance)'; the topic's canonical title is 'Remembrance' (الذكر) and its summary addresses verses about dhikr — the remembrance of God, the tranquility it brings to hearts, and calls to remember Him frequently."
  ),
  rel(
    "economic-conduct",
    "giving",
    "organizational-membership",
    "The topic of giving in the way of God (charity and spending) is a core subject within the economic conduct domain.",
    "The domain's subject list includes 'charity and spending'; the topic's canonical title is 'Giving in the Way of God' (الإنفاق, meaning spending/charity) and its summary addresses verses about charity and spending in God's cause."
  ),
  rel(
    "society-justice",
    "justice",
    "organizational-membership",
    "The topic of justice is a core subject within the society and justice domain.",
    "The domain's subject list includes 'justice and fairness'; the topic's canonical title is 'Justice' (العدل) and its summary addresses verses about justice — standing firmly for fairness, testifying truthfully even against oneself, and the command to act justly."
  ),
  rel(
    "family-relationships",
    "parents-and-family",
    "organizational-membership",
    "The topic of parents and family is a core subject within the family and relationships domain.",
    "The domain's subject list includes 'parents and children'; the topic's canonical title is 'Parents and Family' and its summary addresses verses about parents and family — the command to treat parents with kindness, the effort of a mother, and the duty of care toward relatives."
  ),
  rel(
    "human-experiences",
    "hardship-and-ease",
    "organizational-membership",
    "The topic of hardship and ease is a core subject within the human experiences and responsibility domain.",
    "The domain's subject list includes 'hardship and ease'; the topic's canonical title is 'Hardship and Ease' and its summary addresses verses about difficulty and relief — the pairing of hardship with ease, the principle that no soul is burdened beyond capacity."
  ),
  rel(
    "revelation-guidance",
    "knowledge-and-reflection",
    "organizational-membership",
    "The topic of knowledge and reflection is a core subject within the revelation and guidance domain.",
    "The domain's subject list includes 'the command to read' and 'reflecting on the Quran'; the topic's summary addresses verses about seeking knowledge and reflecting — the first revelation's command to read, prayers for increase in knowledge, and calls to ponder the Quran and creation."
  ),
  rel(
    "eschatology-afterlife",
    "the-hereafter",
    "organizational-membership",
    "The topic of the hereafter is a core subject within the eschatology and afterlife domain.",
    "The domain's subjects include 'death and the soul', 'the Day of Judgment', 'resurrection'; the topic's canonical title is 'The Hereafter' (الآخرة) and the domain's Arabic title is also الآخرة. The topic's summary addresses verses about the life to come — every soul tasting death, deeds weighed, and the scales of justice."
  ),
  rel(
    "belief-theology",
    "tawheed",
    "organizational-membership",
    "The topic of divine oneness (tawheed) is the foundational subject within the belief and theology domain.",
    "The domain's subjects include 'belief in God', 'divine attributes', 'tawheed'; the topic's canonical title is 'Divine Oneness' (التوحيد) and its summary addresses verses about tawheed — the absolute oneness of God, His unique attributes, and the rejection of any partners. This is the foundational theme of the Quran."
  ),
  rel(
    "worship-practice",
    "prayer",
    "organizational-membership",
    "The topic of prayer (salah) is a core subject within the worship and spiritual practice domain.",
    "The domain's subjects include 'salah (prayer)'; the topic's canonical title is 'Prayer' (الصلاة) and its summary addresses verses about salah — the prescribed prayer, its establishment, its timing, and its significance as the pillar of worship."
  ),
  rel(
    "worship-practice",
    "supplication",
    "organizational-membership",
    "The topic of supplication (dua) is a core subject within the worship and spiritual practice domain.",
    "The domain's subjects include 'dua (supplication)'; the topic's canonical title is 'Supplication' (الدعاء) and its summary addresses verses about dua — calling upon God, the invitation to ask, and the assurance that God responds to those who call upon Him."
  ),
  rel(
    "ethics-character",
    "god-consciousness",
    "organizational-membership",
    "The topic of god-consciousness (taqwa) is a core subject within the ethics and character domain.",
    "The domain's subjects include 'taqwa (god-consciousness)'; the topic's canonical title is 'God-Consciousness' (التقوى) and its summary addresses verses about taqwa — consciousness of God, mindfulness that shapes conduct, and the promise that taqwa is the true measure of nobility."
  ),
  rel(
    "ethics-character",
    "repentance",
    "organizational-membership",
    "The topic of repentance (tawbah) is a core subject within the ethics and character domain.",
    "The domain's subjects include 'repentance'; the topic's canonical title is 'Repentance' (التوبة) and its summary addresses verses about tawbah — turning back to God, the invitation to repent, and the assurance that God accepts repentance from those who sincerely return to Him."
  ),
  rel(
    "prophets-narratives",
    "prophets",
    "organizational-membership",
    "The topic of prophets and their stories is the core subject within the prophets and narratives domain.",
    "The domain's subjects include 'stories of the prophets', 'prophetic narratives'; the topic's canonical title is 'Prophets and Their Stories' (الأنبياء) and its summary addresses verses about the prophets — their mission, their trials, their patience, and the lessons drawn from their experiences."
  ),
  rel(
    "ethics-character",
    "good-character",
    "organizational-membership",
    "The topic of good character (akhlaq) is a core subject within the ethics and character domain.",
    "The domain's subjects include 'good character and manners'; the topic's canonical title is 'Good Character' (الأخلاق) and its summary addresses verses about akhlaq — good character, kindness, honesty, humility, and the moral qualities that shape a believer's conduct with others."
  ),
];

/**
 * Look up all domain-topic relationships for a given domain.
 */
export function getDomainTopicRelations(domainId: DomainId): DomainTopicRelation[] {
  return DOMAIN_TOPIC_RELATIONS.filter((r) => r.domainId === domainId);
}

/**
 * Look up all domain-topic relationships for a given topic slug.
 */
export function getTopicDomainRelations(topicSlug: string): DomainTopicRelation[] {
  return DOMAIN_TOPIC_RELATIONS.filter((r) => r.topicSlug === topicSlug);
}

/**
 * Get the domains a topic belongs to (via this catalog).
 */
export function getTopicDomains(topicSlug: string): DomainId[] {
  return getTopicDomainRelations(topicSlug).map((r) => r.domainId);
}

/**
 * Get the topics in a domain (via this catalog).
 */
export function getDomainTopics(domainId: DomainId): string[] {
  return getDomainTopicRelations(domainId).map((r) => r.topicSlug);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface DomainTopicValidationIssue {
  code: string;
  subject: string;
  message: string;
}

/**
 * Validate a single domain-topic relation.
 */
export function validateDomainTopicRelation(
  rel: DomainTopicRelation
): DomainTopicValidationIssue[] {
  const issues: DomainTopicValidationIssue[] = [];

  // ID must match the deterministic pattern
  const expectedId = domainTopicRelationId(rel.domainId, rel.topicSlug);
  if (rel.id !== expectedId) {
    issues.push({
      code: "domain-topic-id-mismatch",
      subject: rel.id,
      message: `Relation id "${rel.id}" does not match expected "${expectedId}".`,
    });
  }

  // Domain must exist
  if (!getDomain(rel.domainId)) {
    issues.push({
      code: "unknown-domain",
      subject: rel.id,
      message: `Domain "${rel.domainId}" does not exist in the domain catalog.`,
    });
  }

  // Topic must exist
  if (!getTopic(rel.topicSlug)) {
    issues.push({
      code: "unknown-topic",
      subject: rel.id,
      message: `Topic "${rel.topicSlug}" does not exist in the topic catalog.`,
    });
  }

  // Semantics must be valid
  if (rel.semantics !== "navigation-only" && rel.semantics !== "organizational-membership") {
    issues.push({
      code: "invalid-semantics",
      subject: rel.id,
      message: `Semantics "${rel.semantics}" is not a valid DomainTopicSemantics value.`,
    });
  }

  // Purpose must be non-empty
  if (!rel.purpose || rel.purpose.trim().length === 0) {
    issues.push({
      code: "empty-purpose",
      subject: rel.id,
      message: "Relationship purpose is empty. State why this topic belongs in this domain.",
    });
  }

  // Evidence must be non-empty
  if (!rel.evidence || rel.evidence.length === 0) {
    issues.push({
      code: "no-evidence",
      subject: rel.id,
      message: "Relationship has no evidence. Every asserted relationship must carry at least one evidence record.",
    });
  }

  // Evidence statements must be non-empty
  for (const e of rel.evidence ?? []) {
    if (!e.statement || e.statement.trim().length === 0) {
      issues.push({
        code: "empty-evidence-statement",
        subject: rel.id,
        message: `Evidence of type "${e.type}" has an empty statement.`,
      });
    }
  }

  // Navigation-only relationships cannot carry scholarly evidence
  if (rel.semantics === "navigation-only") {
    if (rel.evidence.some((e) => e.type === "scholarly")) {
      issues.push({
        code: "navigation-topic-link-cannot-be-scholarly",
        subject: rel.id,
        message: "Navigation-only domain-topic relationship cannot carry scholarly evidence. It is a UI aid, not a scholarly classification.",
      });
    }
    if (rel.provenance.decisions.some((d) => d.state === "approved")) {
      issues.push({
        code: "navigation-topic-link-cannot-be-approved",
        subject: rel.id,
        message: "Navigation-only domain-topic relationship cannot be approved. It is a UI aid, not a scholarly classification.",
      });
    }
  }

  // Organizational-membership relationships require at least editorial evidence
  if (rel.semantics === "organizational-membership") {
    const hasEditorialOrStronger = rel.evidence.some(
      (e) => e.type === "editorial" || e.type === "scholarly"
    );
    if (!hasEditorialOrStronger) {
      issues.push({
        code: "membership-without-editorial-evidence",
        subject: rel.id,
        message: "Organizational-membership relationship requires at least editorial evidence. Machine-verified or navigation evidence is insufficient.",
      });
    }
  }

  // Provenance validation
  for (const d of rel.provenance.decisions) {
    if (!d.decidedBy || d.decidedBy.trim().length === 0) {
      issues.push({
        code: "empty-decided-by",
        subject: rel.id,
        message: `Review decision on ${d.track} track is missing a reviewer id.`,
      });
    }
    if (!d.decidedAt || d.decidedAt.trim().length === 0) {
      issues.push({
        code: "empty-decided-at",
        subject: rel.id,
        message: `Review decision on ${d.track} track is missing a timestamp.`,
      });
    }
  }

  // Scholarly-track approval requires scholarly evidence (mirrors Sprint 33 safeguard)
  for (const d of rel.provenance.decisions) {
    if (d.state === "approved" && d.track === "scholarly") {
      const hasScholarlyEvidence = rel.evidence.some((e) => e.type === "scholarly");
      if (!hasScholarlyEvidence) {
        issues.push({
          code: "scholarly-approval-requires-scholarly-evidence",
          subject: rel.id,
          message: "Scholarly-track approval requires scholarly evidence. Machine-verified or editorial evidence is insufficient for scholarly approval on domain-topic relationships.",
        });
      }
    }
  }

  return issues;
}

/**
 * Validate the entire domain-topic catalog.
 */
export function validateDomainTopicCatalog(
  relations: DomainTopicRelation[] = DOMAIN_TOPIC_RELATIONS
): { ok: boolean; issues: DomainTopicValidationIssue[] } {
  const issues: DomainTopicValidationIssue[] = [];
  const ids = new Set<string>();
  const pairs = new Set<string>();

  for (const r of relations) {
    // Duplicate ID check
    if (ids.has(r.id)) {
      issues.push({
        code: "duplicate-domain-topic-id",
        subject: r.id,
        message: `Duplicate relationship id "${r.id}".`,
      });
    } else {
      ids.add(r.id);
    }

    // Duplicate pair check
    const pairKey = `${r.domainId}::${r.topicSlug}`;
    if (pairs.has(pairKey)) {
      issues.push({
        code: "duplicate-domain-topic-pair",
        subject: r.id,
        message: `Duplicate domain-topic pair (${r.domainId}, ${r.topicSlug}).`,
      });
    } else {
      pairs.add(pairKey);
    }

    // Per-relation validation
    issues.push(...validateDomainTopicRelation(r));
  }

  return {
    ok: issues.length === 0,
    issues,
  };
}
