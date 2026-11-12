import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  getTopicDomainRelations,
  DOMAIN_TOPIC_RELATIONS,
  validateDomainTopicCatalog,
} from "./domain-topics";
import { getDomain, DOMAINS, domainUrl } from "./domains";
import { TOPICS } from "@/lib/topics/data";
import { DIMENSIONS } from "@/lib/explore/dimensions";

/**
 * Sprint 35 — Topic-domain bidirectional navigation regression tests.
 *
 * These tests verify that:
 * 1. Every canonical topic resolves its domain relations to valid domains
 * 2. Every relation's topicSlug is a valid canonical topic
 * 3. Domain detail routes exist for each resolved domain
 * 4. All shipped relations are pending-review with organizational-membership semantics
 * 5. Topics without relationships render safely (unknown slug returns [])
 * 6. Bidirectional navigation works (domain → topic → domain)
 * 7. Existing catalogs unchanged (14 domains, 15 dimensions, 11 topics, 11 relations)
 * 8. Evidence policy intact
 * 9. UI source contains required copy (semantics, status, organizational proposal language)
 */

describe("Sprint 35 — Topic-domain navigation data layer", () => {
  it("every canonical topic resolves its domain relations to valid domains", () => {
    for (const topic of TOPICS) {
      const relations = getTopicDomainRelations(topic.slug);
      for (const relation of relations) {
        const domain = getDomain(relation.domainId);
        expect(domain, `topic ${topic.slug} has relation to non-existent domain ${relation.domainId}`).not.toBeNull();
        expect(domain?.id).toBe(relation.domainId);
      }
    }
  });

  it("every relation's topicSlug is a valid canonical topic", () => {
    const topicSlugs = new Set(TOPICS.map(t => t.slug));
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      expect(topicSlugs.has(relation.topicSlug), `relation ${relation.id} references non-existent topic ${relation.topicSlug}`).toBe(true);
    }
  });

  it("domain detail routes exist for each resolved domain", () => {
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      const domain = getDomain(relation.domainId);
      expect(domain).not.toBeNull();
      const url = domainUrl(domain!.id);
      expect(url).toBe(`/explore/domains/${domain!.id}`);
      expect(url).toMatch(/^\/explore\/domains\/[a-z0-9-]+$/);
    }
  });

  it("all shipped relations are pending-review with organizational-membership semantics", () => {
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      expect(relation.provenance.state).toBe("pending-review");
      expect(relation.semantics).toBe("organizational-membership");
    }
  });

  it("topics without relationships render safely (unknown slug returns [])", () => {
    const relations = getTopicDomainRelations("non-existent-topic");
    expect(relations).toEqual([]);
    expect(Array.isArray(relations)).toBe(true);
  });

  it("each of the 18 topics has exactly 1 domain relation", () => {
    const relationCounts = new Map<string, number>();
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      relationCounts.set(relation.topicSlug, (relationCounts.get(relation.topicSlug) ?? 0) + 1);
    }
    expect(relationCounts.size).toBe(18);
    for (const [slug, count] of relationCounts) {
      expect(count, `topic ${slug} has ${count} relations, expected 1`).toBe(1);
    }
  });

  it("bidirectional navigation: domain → topic → domain consistency", () => {
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      const domain = getDomain(relation.domainId);
      expect(domain).not.toBeNull();
      
      // From domain, can we find the topic?
      const topic = TOPICS.find(t => t.slug === relation.topicSlug);
      expect(topic, `relation ${relation.id} references non-existent topic`).toBeDefined();
      
      // From topic, can we find the domain?
      const topicRelations = getTopicDomainRelations(topic!.slug);
      expect(topicRelations.length).toBeGreaterThan(0);
      expect(topicRelations.some(r => r.domainId === relation.domainId)).toBe(true);
    }
  });
});

describe("Sprint 35 — Catalog integrity", () => {
  it("existing catalogs unchanged: 14 domains, 15 dimensions, 18 topics, 18 relations", () => {
    expect(DOMAINS.length).toBe(14);
    expect(DIMENSIONS.length).toBe(15);
    expect(TOPICS.length).toBe(18);
    expect(DOMAIN_TOPIC_RELATIONS.length).toBe(18);
  });

  it("evidence policy intact: validateDomainTopicCatalog passes", () => {
    const result = validateDomainTopicCatalog(DOMAIN_TOPIC_RELATIONS);
    expect(result.ok).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it("no scholarly evidence in shipped relations", () => {
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      const hasScholarly = relation.evidence.some(e => e.type === "scholarly");
      expect(hasScholarly, `relation ${relation.id} has scholarly evidence`).toBe(false);
    }
  });

  it("no approved decisions in shipped relations", () => {
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      const hasApproval = relation.provenance.decisions.some(d => d.state === "approved");
      expect(hasApproval, `relation ${relation.id} has approved decision`).toBe(false);
    }
  });

  it("domain ids are disjoint from dimension ids (no reinterpretation)", () => {
    const domainIds = new Set<string>(DOMAINS.map(d => d.id));
    const dimensionIds = new Set<string>(DIMENSIONS.map(d => d.id));
    for (const domainId of domainIds) {
      expect(dimensionIds.has(domainId), `domain id ${domainId} overlaps with dimension id`).toBe(false);
    }
  });

  it("each relation has non-empty purpose and evidence statement for UI rendering", () => {
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      expect(relation.purpose.length).toBeGreaterThan(0);
      expect(relation.evidence.length).toBeGreaterThan(0);
      for (const evidence of relation.evidence) {
        expect(evidence.statement.length).toBeGreaterThan(0);
      }
    }
  });

  it("domain titles are non-empty and arabic titles are optional", () => {
    for (const relation of DOMAIN_TOPIC_RELATIONS) {
      const domain = getDomain(relation.domainId);
      expect(domain).not.toBeNull();
      expect(domain!.title.length).toBeGreaterThan(0);
      // arabicTitle is optional, no assertion needed
    }
  });
});

describe("Sprint 35 — Topic page UI source assertions", () => {
  const topicPageSrc = readFileSync(
    resolve(process.cwd(), "src/app/topics/[slug]/page.tsx"),
    "utf8"
  );

  it("topic page imports getTopicDomainRelations and getDomain", () => {
    expect(topicPageSrc).toMatch(
      /getTopicDomainRelations[\s\S]*?from "@\/lib\/taxonomy\/domain-topics"/
    );
    expect(topicPageSrc).toMatch(
      /getDomain[\s\S]*?from "@\/lib\/taxonomy\/domains"/
    );
  });

  it("topic page resolves domainRelations defensively", () => {
    expect(topicPageSrc).toMatch(/const domainRelations = getTopicDomainRelations/);
    expect(topicPageSrc).toMatch(/\.filter\([\s\S]*?Boolean\(entry\.domain\)/);
  });

  it("topic page renders 'Proposed exploration domains' section when relations exist", () => {
    expect(topicPageSrc).toMatch(/domainRelations\.length > 0/);
    expect(topicPageSrc).toMatch(/Proposed exploration domains/);
  });

  it("topic page displays organizational proposal semantics badge", () => {
    expect(topicPageSrc).toMatch(/organizational proposal/);
    expect(topicPageSrc).toMatch(/navigation aid/);
  });

  it("topic page displays pending review status badge", () => {
    expect(topicPageSrc).toMatch(/relation\.provenance\.state\.replace/);
  });

  it("topic page includes organizational proposal disclaimer", () => {
    expect(topicPageSrc).toMatch(/organizational proposals pending review/);
    expect(topicPageSrc).toMatch(/not scholarly\s+classifications/);
  });

  it("topic page links to domain detail pages", () => {
    expect(topicPageSrc).toMatch(/href=\{`\/explore\/domains\/\$\{domain\.id\}`\}/);
  });

  it("topic page displays domain title and optional arabic title", () => {
    expect(topicPageSrc).toMatch(/\{domain\.title\}/);
    expect(topicPageSrc).toMatch(/\{domain\.arabicTitle &&/);
    expect(topicPageSrc).toMatch(/lang="ar"/);
    expect(topicPageSrc).toMatch(/dir="rtl"/);
  });

  it("topic page includes footer disclaimer about organizational proposals", () => {
    expect(topicPageSrc).toMatch(/Domain-topic relationships are organizational proposals/);
    expect(topicPageSrc).toMatch(/not scholarly\s+conclusions/);
  });
});
