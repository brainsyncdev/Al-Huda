#!/usr/bin/env node
/**
 * MFD-08 Root Registry Validator
 * 
 * Validates root-discovery-registry.json integrity:
 * - Valid root structure
 * - Valid status values
 * - No duplicate slugs
 * - Source attribution present
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOTS_PATH = path.join(process.cwd(), 'data', 'root-discovery-registry.json');

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

function loadJSON(filepath) {
  if (!fs.existsSync(filepath)) {
    error(`File not found: ${filepath}`);
    return null;
  }
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to parse ${filepath}: ${err.message}`);
    return null;
  }
}

const registry = loadJSON(ROOTS_PATH);
if (!registry) {
  process.exit(1);
}

console.log('🔍 MFD-08 Root Registry Validator\n');

// Validate registry structure
console.log('📋 Registry Metadata:');
if (!registry.generatedAt) error('Missing generatedAt');
else ok(`generatedAt: ${registry.generatedAt}`);

if (!registry.policyVersion) error('Missing policyVersion');
else ok(`policyVersion: ${registry.policyVersion}`);

if (!registry.sourceDataset) error('Missing sourceDataset');
else ok(`sourceDataset: ${registry.sourceDataset}`);

if (!registry.roots || !Array.isArray(registry.roots)) {
  error('Missing or invalid roots array');
  process.exit(1);
}

console.log(`\n📊 Total roots: ${registry.roots.length}`);

// Validate unique slugs
console.log('\n🔐 Unique Slug Validation:');
const slugs = new Set();
const duplicateSlugs = [];
for (const root of registry.roots) {
  if (slugs.has(root.slug)) {
    duplicateSlugs.push(root.slug);
  }
  slugs.add(root.slug);
}
if (duplicateSlugs.length > 0) {
  error(`Found ${duplicateSlugs.length} duplicate slugs: ${duplicateSlugs.slice(0, 5).join(', ')}`);
} else {
  ok(`All ${slugs.size} root slugs are unique`);
}

// Validate status values
console.log('\n🏷️  Status Validation:');
const validStatuses = ['activated', 'partially-activated', 'needs-review', 'discovered'];
const statusDistribution = new Map();
let invalidStatuses = 0;

for (const root of registry.roots) {
  const status = root.status;
  statusDistribution.set(status, (statusDistribution.get(status) || 0) + 1);
  
  if (!validStatuses.includes(status)) {
    invalidStatuses++;
    if (invalidStatuses <= 3) {
      error(`Root ${root.slug} has invalid status: ${status}`);
    }
  }
}

if (invalidStatuses === 0) {
  ok('All root statuses are valid');
} else {
  error(`${invalidStatuses} roots have invalid statuses`);
}

console.log('\n📊 Status Distribution:');
for (const [status, count] of [...statusDistribution.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`   ${status}: ${count}`);
}

// Validate required fields
console.log('\n📋 Required Fields Validation:');
const requiredFields = ['slug', 'root', 'status', 'totalLemmas', 'occurrenceCount', 'distinctAyahCount'];
let missingFields = 0;
for (const root of registry.roots) {
  for (const field of requiredFields) {
    if (root[field] === undefined || root[field] === null) {
      missingFields++;
      if (missingFields <= 5) {
        error(`Root ${root.slug || '(no slug)'} missing required field: ${field}`);
      }
    }
  }
}
if (missingFields === 0) {
  ok('All roots have required fields');
} else {
  error(`${missingFields} total missing required fields`);
}

// Validate summary matches actual counts
console.log('\n📊 Summary Validation:');
if (registry.summary) {
  const actualTotal = registry.roots.length;
  const actualActivated = registry.roots.filter(r => r.status === 'activated').length;
  const actualPartial = registry.roots.filter(r => r.status === 'partially-activated').length;
  const actualNeedsReview = registry.roots.filter(r => r.status === 'needs-review').length;
  const actualDiscovered = registry.roots.filter(r => r.status === 'discovered').length;
  
  if (registry.summary.totalRoots !== actualTotal) {
    error(`Summary totalRoots (${registry.summary.totalRoots}) != actual (${actualTotal})`);
  } else {
    ok(`Summary totalRoots matches: ${actualTotal}`);
  }
  
  if (registry.summary.activated !== actualActivated) {
    warn(`Summary activated (${registry.summary.activated}) != actual (${actualActivated})`);
  } else {
    ok(`Summary activated matches: ${actualActivated}`);
  }
  
  if (registry.summary.partiallyActivated !== actualPartial) {
    warn(`Summary partiallyActivated (${registry.summary.partiallyActivated}) != actual (${actualPartial})`);
  } else {
    ok(`Summary partiallyActivated matches: ${actualPartial}`);
  }
  
  if (registry.summary.needsReview !== actualNeedsReview) {
    warn(`Summary needsReview (${registry.summary.needsReview}) != actual (${actualNeedsReview})`);
  } else {
    ok(`Summary needsReview matches: ${actualNeedsReview}`);
  }
} else {
  warn('No summary section in registry');
}

console.log('\n' + '='.repeat(60));
if (issues === 0) {
  console.log(`✅ Root registry validation PASSED (${warnings} warnings)`);
  process.exit(0);
} else {
  console.log(`❌ Root registry validation FAILED (${issues} issues, ${warnings} warnings)`);
  process.exit(1);
}
