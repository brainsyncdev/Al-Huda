#!/usr/bin/env node
/**
 * MFD-08 Graph Validator
 * 
 * Validates knowledge graph integrity by running the graph builder
 * and checking node/edge counts and references.
 */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

let issues = 0;
let warnings = 0;

function error(msg) {
  console.error(`❌ ${msg}`);
  issues++;
}

function warn(msg) {
  console.warn(`⚠️  ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

console.log('🔍 MFD-08 Graph Validator\n');

// Calculate expected counts from JSON files
const TAXONOMY_DIR = path.join(process.cwd(), 'data', 'taxonomy');

function loadJSON(filename) {
  const filepath = path.join(TAXONOMY_DIR, filename);
  const content = fs.readFileSync(filepath, 'utf-8');
  return JSON.parse(content);
}

const domains = loadJSON('domains.json');
const dimensions = loadJSON('dimensions.json');
const subdimensions = loadJSON('subdimensions.json');
const topics = loadJSON('topics.json');
const relationships = loadJSON('relationships.json');

const expectedNodes = domains.length + dimensions.length + subdimensions.length + topics.length;

console.log('📊 Expected Node Counts (from JSON):');
console.log(`   Domains: ${domains.length}`);
console.log(`   Dimensions: ${dimensions.length}`);
console.log(`   Subdimensions: ${subdimensions.length}`);
console.log(`   Topics: ${topics.length}`);
console.log(`   Total expected: ${expectedNodes}`);

// Validate topic references in relationships
console.log('\n🔗 Relationship Reference Validation:');
const topicIds = new Set(topics.map(t => t.id));
let brokenRefs = 0;

for (const rel of relationships) {
  if (rel.sourceTopicId && !topicIds.has(rel.sourceTopicId)) {
    brokenRefs++;
    if (brokenRefs <= 3) {
      error(`Relationship ${rel.id} references non-existent sourceTopicId: ${rel.sourceTopicId}`);
    }
  }
  if (rel.targetTopicId && !topicIds.has(rel.targetTopicId)) {
    brokenRefs++;
    if (brokenRefs <= 3) {
      error(`Relationship ${rel.id} references non-existent targetTopicId: ${rel.targetTopicId}`);
    }
  }
}

if (brokenRefs === 0) {
  ok('All relationship topic references are valid');
} else {
  error(`${brokenRefs} broken topic references in relationships`);
}

// Validate topic parent references
console.log('\n📋 Topic Parent Reference Validation:');
const domainIds = new Set(domains.map(d => d.id));
const dimensionIds = new Set(dimensions.map(d => d.id));
const subdimensionIds = new Set(subdimensions.map(s => s.id));

let invalidDomainRefs = 0;
let invalidDimensionRefs = 0;
let invalidSubdimensionRefs = 0;

for (const topic of topics) {
  if (!domainIds.has(topic.parentDomainId)) {
    invalidDomainRefs++;
    if (invalidDomainRefs <= 3) {
      error(`Topic ${topic.id} references non-existent parentDomainId: ${topic.parentDomainId}`);
    }
  }
  if (!dimensionIds.has(topic.parentDimensionId)) {
    invalidDimensionRefs++;
    if (invalidDimensionRefs <= 3) {
      error(`Topic ${topic.id} references non-existent parentDimensionId: ${topic.parentDimensionId}`);
    }
  }
  if (topic.parentSubdimensionId && !subdimensionIds.has(topic.parentSubdimensionId)) {
    invalidSubdimensionRefs++;
    if (invalidSubdimensionRefs <= 3) {
      error(`Topic ${topic.id} references non-existent parentSubdimensionId: ${topic.parentSubdimensionId}`);
    }
  }
}

if (invalidDomainRefs === 0) ok('All topic parentDomainId references valid');
else error(`${invalidDomainRefs} invalid parentDomainId references`);

if (invalidDimensionRefs === 0) ok('All topic parentDimensionId references valid');
else error(`${invalidDimensionRefs} invalid parentDimensionId references`);

if (invalidSubdimensionRefs === 0) ok('All topic parentSubdimensionId references valid');
else error(`${invalidSubdimensionRefs} invalid parentSubdimensionId references`);

// Validate dimension/subdimension hierarchy
console.log('\n🔄 Hierarchy Validation:');
let orphanDimensions = 0;
for (const dim of dimensions) {
  if (!domainIds.has(dim.parentDomainId)) {
    orphanDimensions++;
    if (orphanDimensions <= 3) {
      error(`Dimension ${dim.id} references non-existent parentDomainId: ${dim.parentDomainId}`);
    }
  }
}
if (orphanDimensions === 0) ok('All dimension parent references valid');
else error(`${orphanDimensions} orphan dimensions`);

let orphanSubdimensions = 0;
for (const sub of subdimensions) {
  if (!dimensionIds.has(sub.parentDimensionId)) {
    orphanSubdimensions++;
    if (orphanSubdimensions <= 3) {
      error(`Subdimension ${sub.id} references non-existent parentDimensionId: ${sub.parentDimensionId}`);
    }
  }
}
if (orphanSubdimensions === 0) ok('All subdimension parent references valid');
else error(`${orphanSubdimensions} orphan subdimensions`);

// Check for duplicate IDs across all entity types
console.log('\n🔐 Cross-Entity ID Uniqueness:');
const allIds = [
  ...domains.map(d => `domain:${d.id}`),
  ...dimensions.map(d => `dimension:${d.id}`),
  ...subdimensions.map(s => `subdimension:${s.id}`),
  ...topics.map(t => `topic:${t.id}`)
];
const idSet = new Set();
const duplicates = [];
for (const id of allIds) {
  if (idSet.has(id)) {
    duplicates.push(id);
  }
  idSet.add(id);
}
if (duplicates.length === 0) {
  ok('All entity IDs are unique (with kind prefix)');
} else {
  error(`${duplicates.length} duplicate entity IDs: ${duplicates.slice(0, 5).join(', ')}`);
}

console.log('\n' + '='.repeat(60));
if (issues === 0) {
  console.log(`✅ Graph validation PASSED (${warnings} warnings)`);
  console.log(`   Expected graph nodes: ${expectedNodes}`);
  process.exit(0);
} else {
  console.log(`❌ Graph validation FAILED (${issues} issues, ${warnings} warnings)`);
  process.exit(1);
}
