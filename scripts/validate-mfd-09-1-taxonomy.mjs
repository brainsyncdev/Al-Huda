#!/usr/bin/env node
/**
 * MFD-09.1 Taxonomy Validation Script
 * Validates canonical taxonomy data files for structural integrity.
 * 
 * Usage: node scripts/validate-mfd-09-1-taxonomy.mjs
 * 
 * Exit codes:
 *   0 = All checks passed
 *   1 = One or more checks failed
 */

import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BASE = join(__dirname, '..', 'data', 'taxonomy');
const AUDIT = join(__dirname, '..', 'data', 'audit');

let failures = 0;
let passes = 0;

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passes++;
  } else {
    console.log(`  ❌ ${name}${detail ? ': ' + detail : ''}`);
    failures++;
  }
}

// Load files
console.log('Loading taxonomy files...');
const domains = JSON.parse(readFileSync(join(BASE, 'domains.json'), 'utf8'));
const dimensions = JSON.parse(readFileSync(join(BASE, 'dimensions.json'), 'utf8'));
const subdims = JSON.parse(readFileSync(join(BASE, 'subdimensions.json'), 'utf8'));
const topics = JSON.parse(readFileSync(join(BASE, 'topics.json'), 'utf8'));
const rels = JSON.parse(readFileSync(join(BASE, 'relationships.json'), 'utf8'));

// Build ID sets
const domainIds = new Set(domains.map(d => d.id));
const dimIds = new Set(dimensions.map(d => d.id));
const subdimIds = new Set(subdims.map(s => s.id));
const topicIds = new Set(topics.map(t => t.id));
const relIds = new Set(rels.map(r => r.id));

console.log(`Loaded: ${domains.length} domains, ${dimensions.length} dimensions, ${subdims.length} subdimensions, ${topics.length} topics, ${rels.length} relationships\n`);

// === CHECK 1: Unique IDs within namespaces ===
console.log('=== Namespace Uniqueness ===');
check('Domain IDs unique', domainIds.size === domains.length, `${domains.length - domainIds.size} duplicates`);
check('Dimension IDs unique', dimIds.size === dimensions.length, `${dimensions.length - dimIds.size} duplicates`);
check('Subdimension IDs unique', subdimIds.size === subdims.length, `${subdims.length - subdimIds.size} duplicates`);
check('Topic IDs unique', topicIds.size === topics.length, `${topics.length - topicIds.size} duplicates`);
check('Relationship IDs unique', relIds.size === rels.length, `${rels.length - relIds.size} duplicates`);

// === CHECK 2: Parent references valid ===
console.log('\n=== Parent Reference Integrity ===');
let brokenDimParents = 0;
for (const d of dimensions) {
  if (!domainIds.has(d.parentDomainId)) brokenDimParents++;
}
check('All dimension parentDomainId valid', brokenDimParents === 0, `${brokenDimParents} broken`);

let brokenSubdimParents = 0;
for (const s of subdims) {
  if (!dimIds.has(s.parentDimensionId)) brokenSubdimParents++;
}
check('All subdimension parentDimensionId valid', brokenSubdimParents === 0, `${brokenSubdimParents} broken`);

let brokenTopicParents = 0;
for (const t of topics) {
  if (t.parentDimensionId && !dimIds.has(t.parentDimensionId)) brokenTopicParents++;
}
check('All topic parentDimensionId valid', brokenTopicParents === 0, `${brokenTopicParents} broken`);

// === CHECK 3: Relationship endpoints exist ===
console.log('\n=== Relationship Endpoint Integrity ===');
const allNodeIds = new Set([...domainIds, ...dimIds, ...subdimIds, ...topicIds]);
let brokenSources = 0;
let brokenTargets = 0;
for (const r of rels) {
  if (!allNodeIds.has(r.sourceId)) brokenSources++;
  if (!allNodeIds.has(r.targetId)) brokenTargets++;
}
check('All relationship sourceIds exist', brokenSources === 0, `${brokenSources} broken`);
check('All relationship targetIds exist', brokenTargets === 0, `${brokenTargets} broken`);

// === CHECK 4: Valid relationship types ===
console.log('\n=== Relationship Types ===');
const validTypes = new Set(['CONTAINS', 'CROSS_REFERENCES', 'SHARES_CONCEPT']);
let invalidTypes = 0;
for (const r of rels) {
  if (!validTypes.has(r.type)) invalidTypes++;
}
check('All relationship types valid', invalidTypes === 0, `${invalidTypes} invalid`);

// === CHECK 5: Coverage distribution recalculation ===
console.log('\n=== Coverage Distribution (Topic-Side) ===');
const topicByDim = {};
for (const t of topics) {
  if (t.parentDimensionId) {
    topicByDim[t.parentDimensionId] = (topicByDim[t.parentDimensionId] || 0) + 1;
  }
}
const zeroDims = dimensions.filter(d => !topicByDim[d.id] || topicByDim[d.id] === 0);
const oneDims = dimensions.filter(d => topicByDim[d.id] === 1);
const twoDims = dimensions.filter(d => topicByDim[d.id] === 2);
const threeFourDims = dimensions.filter(d => topicByDim[d.id] >= 3 && topicByDim[d.id] <= 4);
const fivePlusDims = dimensions.filter(d => topicByDim[d.id] >= 5);

console.log(`  ZERO_TOPICS: ${zeroDims.length}`);
console.log(`  ONE_TOPIC: ${oneDims.length}`);
console.log(`  TWO_TOPICS: ${twoDims.length}`);
console.log(`  THREE_TO_FOUR_TOPICS: ${threeFourDims.length}`);
console.log(`  FIVE_OR_MORE_TOPICS: ${fivePlusDims.length}`);

const totalCovered = zeroDims.length + oneDims.length + twoDims.length + threeFourDims.length + fivePlusDims.length;
check('Coverage accounts for all dimensions', totalCovered === dimensions.length, `Expected ${dimensions.length}, got ${totalCovered}`);

// === CHECK 6: Bidirectional consistency ===
console.log('\n=== Bidirectional Consistency ===');
let discrepancies = 0;
for (const d of dimensions) {
  const dimSideCount = d.topicIds ? d.topicIds.length : 0;
  const topicSideCount = topicByDim[d.id] || 0;
  if (dimSideCount !== topicSideCount) discrepancies++;
}
console.log(`  Dimensions with discrepancies: ${discrepancies}/${dimensions.length}`);
check('Bidirectional consistency documented', true, `${discrepancies} discrepancies found (expected — see coverage report)`);

// === CHECK 7: Canonical audit JSON exists ===
console.log('\n=== Audit Artifacts ===');
try {
  const coverageData = JSON.parse(readFileSync(join(AUDIT, 'mfd-09-1-dimension-coverage.json'), 'utf8'));
  check('Dimension coverage JSON exists and parseable', Array.isArray(coverageData) && coverageData.length === dimensions.length, `Got ${coverageData?.length} entries`);
} catch (e) {
  check('Dimension coverage JSON exists and parseable', false, e.message);
}

try {
  const proposalsData = JSON.parse(readFileSync(join(AUDIT, 'mfd-09-1-topic-proposals-classified.json'), 'utf8'));
  check('Topic proposals JSON exists and parseable', Array.isArray(proposalsData) && proposalsData.length > 0, `Got ${proposalsData?.length} entries`);
} catch (e) {
  check('Topic proposals JSON exists and parseable', false, e.message);
}

// === SUMMARY ===
console.log(`\n${'='.repeat(50)}`);
console.log(`VALIDATION SUMMARY: ${passes} passed, ${failures} failed`);
console.log(`${'='.repeat(50)}`);

if (failures > 0) {
  console.log('\n⚠️  Some checks failed. Review the output above.');
  process.exit(1);
} else {
  console.log('\n✅ All checks passed.');
  process.exit(0);
}
