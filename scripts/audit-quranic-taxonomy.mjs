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

// Initialize counts
let dimensionCount = 0;
let topicCount = 0;
let domainCount = 0;
let relationCount = 0;

// 1. Validate dimensions count
console.log("1. Validating dimensions...");
const dimensionMatches = dimensionsContent.match(/export const DIMENSIONS: Dimension\[\] = \[/);
if (!dimensionMatches) {
  issues.push("Could not find DIMENSIONS array");
} else {
  // Count dimension objects by looking for 'number:' patterns within the array
  const dimensionsSection = dimensionsContent.substring(
    dimensionsContent.indexOf('export const DIMENSIONS'),
    dimensionsContent.indexOf('];', dimensionsContent.indexOf('export const DIMENSIONS'))
  );
  dimensionCount = (dimensionsSection.match(/\n    number: \d+/g) || []).length;
  console.log(`   ✓ Found ${dimensionCount} dimensions`);
  if (dimensionCount !== 15) {
    issues.push(`Expected 15 dimensions, found ${dimensionCount}`);
  }
}

// 2. Validate topics count
console.log("2. Validating topics...");
// Topics are defined with slug: "..." pattern
const topicSlugs = topicsContent.match(/slug: "[a-z-]+"/g) || [];
topicCount = topicSlugs.length;
console.log(`   ✓ Found ${topicCount} topics`);
if (topicCount !== 18) {
  issues.push(`Expected 18 topics, found ${topicCount}`);
}

// 3. Validate domains count
console.log("3. Validating domains...");
// Domains are defined with id: "..." pattern in the DOMAINS array
const domainIds = domainsContent.match(/id: "[a-z-]+"/g) || [];
domainCount = domainIds.length;
console.log(`   ✓ Found ${domainCount} domains`);
if (domainCount !== 14) {
  issues.push(`Expected 14 domains, found ${domainCount}`);
}

// 4. Validate domain-topic relationships count
console.log("4. Validating domain-topic relationships...");
// Count rel() function calls in the DOMAIN_TOPIC_RELATIONS array
const domainTopicsSection = domainTopicsContent.substring(
  domainTopicsContent.indexOf('export const DOMAIN_TOPIC_RELATIONS'),
  domainTopicsContent.indexOf('];', domainTopicsContent.indexOf('export const DOMAIN_TOPIC_RELATIONS'))
);
relationCount = (domainTopicsSection.match(/\n  rel\(/g) || []).length;
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
console.log(`Dimensions: ${dimensionCount}`);
console.log(`Topics: ${topicCount}`);
console.log(`Domains: ${domainCount}`);
console.log(`Domain-topic relationships: ${relationCount}`);

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
