#!/usr/bin/env node
// Audit script for validating the expanded Quranic taxonomy.
// Checks dimensions, topics, domains, and their relationships.
//
// This script reads the TypeScript source files and validates the structure
// without importing them (to avoid TypeScript compilation issues).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const issues = [];

console.log("=== Quranic Taxonomy Audit ===\n");

// Read source files
const dimensionsPath = join(process.cwd(), 'src/lib/explore/dimensions.ts');
const topicsPath = join(process.cwd(), 'src/lib/topics/data.ts');
const domainsPath = join(process.cwd(), 'src/lib/taxonomy/domains.ts');
const domainTopicsPath = join(process.cwd(), 'src/lib/taxonomy/domain-topics.ts');

const dimensionsContent = readFileSync(dimensionsPath, 'utf-8');
const topicsContent = readFileSync(topicsPath, 'utf-8');
const domainsContent = readFileSync(domainsPath, 'utf-8');
const domainTopicsContent = readFileSync(domainTopicsPath, 'utf-8');

// 1. Validate dimensions count
console.log("1. Validating dimensions...");
const dimensionMatches = dimensionsContent.match(/export const DIMENSIONS: Dimension\[\] = \[/);
if (!dimensionMatches) {
  issues.push("Could not find DIMENSIONS array");
} else {
  // Count dimension objects by looking for 'id:' patterns within the array
  const dimensionsSection = dimensionsContent.substring(
    dimensionsContent.indexOf('export const DIMENSIONS'),
    dimensionsContent.indexOf('];', dimensionsContent.indexOf('export const DIMENSIONS'))
  );
  const dimensionCount = (dimensionsSection.match(/\nid: "/g) || []).length;
  console.log(`   ✓ Found ${dimensionCount} dimensions`);
  if (dimensionCount !== 15) {
    issues.push(`Expected 15 dimensions, found ${dimensionCount}`);
  }
}

// 2. Validate topics count
console.log("2. Validating topics...");
const topicsSection = topicsContent.substring(
  topicsContent.indexOf('const RAW_TOPICS'),
  topicsContent.indexOf('];', topicsContent.indexOf('const RAW_TOPICS'))
);
const topicCount = (topicsSection.match(/\n  slug: "/g) || []).length;
console.log(`   ✓ Found ${topicCount} topics`);
if (topicCount !== 18) {
  issues.push(`Expected 18 topics, found ${topicCount}`);
}

// 3. Validate domains count
console.log("3. Validating domains...");
const domainsSection = domainsContent.substring(
  domainsContent.indexOf('export const DOMAINS'),
  domainsContent.indexOf('];', domainsContent.indexOf('export const DOMAINS'))
);
const domainCount = (domainsSection.match(/\n  id: "/g) || []).length;
console.log(`   ✓ Found ${domainCount} domains`);
if (domainCount !== 14) {
  issues.push(`Expected 14 domains, found ${domainCount}`);
}

// 4. Validate domain-topic relationships count
console.log("4. Validating domain-topic relationships...");
const domainTopicsSection = domainTopicsContent.substring(
  domainTopicsContent.indexOf('export const DOMAIN_TOPIC_RELATIONS'),
  domainTopicsContent.indexOf('];', domainTopicsContent.indexOf('export const DOMAIN_TOPIC_RELATIONS'))
);
const relationCount = (domainTopicsSection.match(/\n  rel\(/g) || []).length;
console.log(`   ✓ Found ${relationCount} relationships`);
if (relationCount !== 18) {
  issues.push(`Expected 18 domain-topic relationships, found ${relationCount}`);
}

// 5. Check for new topics
console.log("5. Checking for new topics...");
const newTopics = ['tawheed', 'prayer', 'supplication', 'god-consciousness', 'repentance', 'prophets', 'good-character'];
for (const topic of newTopics) {
  if (!topicsContent.includes(`slug: "${topic}"`)) {
    issues.push(`New topic "${topic}" not found`);
  }
}
console.log(`   ✓ All ${newTopics.length} new topics present`);

// 6. Check for new dimensions
console.log("6. Checking for new dimensions...");
const newDimensions = ['worship', 'prophets', 'creation', 'hereafter', 'law'];
for (const dim of newDimensions) {
  if (!dimensionsContent.includes(`id: "${dim}"`)) {
    issues.push(`New dimension "${dim}" not found`);
  }
}
console.log(`   ✓ All ${newDimensions.length} new dimensions present`);

// Summary
console.log("\n=== Summary ===");
console.log(`Dimensions: ${dimensionCount || '?'}`);
console.log(`Topics: ${topicCount || '?'}`);
console.log(`Domains: ${domainCount || '?'}`);
console.log(`Domain-topic relationships: ${relationCount || '?'}`);

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
