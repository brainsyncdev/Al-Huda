#!/usr/bin/env node
// Audit script for validating the expanded Quranic taxonomy.
// Checks dimensions, topics, domains, and their relationships.

import { getAllDimensions, getDimension } from "../src/lib/explore/dimensions.ts";
import { TOPICS, getTopic } from "../src/lib/topics/data.ts";
import { getAllDomains, getDomain } from "../src/lib/taxonomy/domains.ts";
import { DOMAIN_TOPIC_RELATIONS } from "../src/lib/taxonomy/domain-topics.ts";

const issues = [];

console.log("=== Quranic Taxonomy Audit ===\n");

// 1. Validate dimensions
console.log("1. Validating dimensions...");
const dimensions = getAllDimensions();
const dimensionIds = new Set();

for (const dim of dimensions) {
  if (dimensionIds.has(dim.id)) {
    issues.push(`Duplicate dimension id: ${dim.id}`);
  }
  dimensionIds.add(dim.id);
  
  if (!dim.title || !dim.arabicTitle || !dim.description) {
    issues.push(`Dimension ${dim.id} missing required fields`);
  }
  
  // Check topicSlugs reference existing topics
  for (const slug of dim.topicSlugs) {
    if (!getTopic(slug)) {
      issues.push(`Dimension ${dim.id} references non-existent topic: ${slug}`);
    }
  }
}

console.log(`   ✓ ${dimensions.length} dimensions validated`);

// 2. Validate topics
console.log("2. Validating topics...");
const topicSlugs = new Set();

for (const topic of TOPICS) {
  if (topicSlugs.has(topic.slug)) {
    issues.push(`Duplicate topic slug: ${topic.slug}`);
  }
  topicSlugs.add(topic.slug);
  
  if (!topic.title || !topic.arabicTitle || !topic.summary) {
    issues.push(`Topic ${topic.slug} missing required fields`);
  }
  
  if (topic.relations.length === 0) {
    issues.push(`Topic ${topic.slug} has no relations`);
  }
  
  // Check related topics exist
  for (const relatedSlug of topic.related) {
    if (!getTopic(relatedSlug)) {
      issues.push(`Topic ${topic.slug} references non-existent related topic: ${relatedSlug}`);
    }
  }
  
  // Check relations have proper structure
  for (const rel of topic.relations) {
    if (!rel.ref || !rel.type || !rel.rationale) {
      issues.push(`Topic ${topic.slug} has malformed relation`);
    }
  }
}

console.log(`   ✓ ${TOPICS.length} topics validated`);

// 3. Validate domains
console.log("3. Validating domains...");
const domains = getAllDomains();
const domainIds = new Set();

for (const domain of domains) {
  if (domainIds.has(domain.id)) {
    issues.push(`Duplicate domain id: ${domain.id}`);
  }
  domainIds.add(domain.id);
  
  if (!domain.title || !domain.scope) {
    issues.push(`Domain ${domain.id} missing required fields`);
  }
  
  // Check overlaps reference existing domains
  for (const overlapId of domain.overlaps) {
    if (!getDomain(overlapId)) {
      issues.push(`Domain ${domain.id} references non-existent overlap: ${overlapId}`);
    }
  }
}

console.log(`   ✓ ${domains.length} domains validated`);

// 4. Validate domain-topic relationships
console.log("4. Validating domain-topic relationships...");
const relationIds = new Set();

for (const rel of DOMAIN_TOPIC_RELATIONS) {
  if (relationIds.has(rel.id)) {
    issues.push(`Duplicate relationship id: ${rel.id}`);
  }
  relationIds.add(rel.id);
  
  if (!getDomain(rel.domainId)) {
    issues.push(`Relationship ${rel.id} references non-existent domain: ${rel.domainId}`);
  }
  
  if (!getTopic(rel.topicSlug)) {
    issues.push(`Relationship ${rel.id} references non-existent topic: ${rel.topicSlug}`);
  }
}

console.log(`   ✓ ${DOMAIN_TOPIC_RELATIONS.length} relationships validated`);

// 5. Summary
console.log("\n=== Summary ===");
console.log(`Dimensions: ${dimensions.length}`);
console.log(`Topics: ${TOPICS.length}`);
console.log(`Domains: ${domains.length}`);
console.log(`Domain-topic relationships: ${DOMAIN_TOPIC_RELATIONS.length}`);

if (issues.length === 0) {
  console.log("\n✅ All taxonomy validations passed.");
  process.exit(0);
} else {
  console.log(`\n❌ Found ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.log(`   - ${issue}`);
  }
  process.exit(1);
}
