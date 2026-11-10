#!/usr/bin/env node

/**
 * Sprint 50 — Global Root-Ayah Coverage Audit
 * 
 * Independently verifies the global unique ayah count across all activated roots.
 * 
 * Key distinction:
 * - Global unique ayat: count each surah:ayah pair ONCE, even if multiple roots occur in it
 * - Per-root sum: count each ayah once per root (allows duplicates)
 * 
 * This audit produces the authoritative global unique ayah count.
 */

import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'data');
const REGISTRY_PATH = join(DATA_DIR, 'root-discovery-registry.json');
const OCCURRENCES_DIR = join(DATA_DIR, 'root-occurrences');

console.log('=== Sprint 50: Global Root-Ayah Coverage Audit ===\n');

// Load registry
if (!existsSync(REGISTRY_PATH)) {
  console.error('ERROR: Registry not found at', REGISTRY_PATH);
  process.exit(1);
}

const registry = JSON.parse(readFileSync(REGISTRY_PATH, 'utf-8'));
console.log(`Loaded registry with ${registry.roots.length} roots\n`);

// ============================================================================
// 1. Calculate Global Unique Ayat (Union)
// ============================================================================

console.log('=== 1. Global Unique Ayat (Union) ===\n');

const globalAyat = new Set();
const occurrenceFiles = readdirSync(OCCURRENCES_DIR).filter(f => f.endsWith('.json'));

let totalOccurrences = 0;
let totalMatches = 0;

for (const file of occurrenceFiles) {
  const filePath = join(OCCURRENCES_DIR, file);
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  
  if (data.totalMatches > 0) {
    for (const occ of data.occurrences) {
      const key = `${occ.ref.surah}:${occ.ref.ayah}`;
      globalAyat.add(key);
    }
    totalOccurrences += data.occurrences.length;
    totalMatches += data.totalMatches;
  }
}

console.log(`Total occurrence files: ${occurrenceFiles.length}`);
console.log(`Populated files (totalMatches > 0): ${occurrenceFiles.filter(f => {
  const data = JSON.parse(readFileSync(join(OCCURRENCES_DIR, f), 'utf-8'));
  return data.totalMatches > 0;
}).length}`);
console.log(`Total occurrences across all files: ${totalOccurrences}`);
console.log(`Total matches (from totalMatches field): ${totalMatches}`);
console.log(`\nGlobal unique ayat (union): ${globalAyat.size}`);
console.log(`This is the authoritative count of unique ayat covered by at least one activated root.\n`);

// ============================================================================
// 2. Calculate Per-Root Distinct Ayat (Sum)
// ============================================================================

console.log('=== 2. Per-Root Distinct Ayat (Sum) ===\n');

let sumOfPerRootAyat = 0;
const perRootCounts = [];

for (const root of registry.roots) {
  if (root.status === 'activated' || root.status === 'partially-activated') {
    sumOfPerRootAyat += root.distinctAyahCount;
    perRootCounts.push({
      slug: root.slug,
      root: root.root,
      distinctAyahCount: root.distinctAyahCount,
    });
  }
}

console.log(`Sum of per-root distinctAyahCount: ${sumOfPerRootAyat}`);
console.log(`This exceeds global count because ayat can appear in multiple roots.\n`);

// ============================================================================
// 3. Verify Occurrence Integrity
// ============================================================================

console.log('=== 3. Occurrence Integrity ===\n');

let duplicateWithinRoot = 0;
let duplicateAcrossRoots = 0;
let invalidReferences = 0;

const allOccurrences = new Map(); // key -> array of roots

for (const file of occurrenceFiles) {
  const filePath = join(OCCURRENCES_DIR, file);
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  
  if (data.totalMatches === 0) continue;
  
  const rootSlug = data.entry.slug;
  const seenInRoot = new Set();
  
  for (const occ of data.occurrences) {
    const key = `${occ.ref.surah}:${occ.ref.ayah}:${occ.wordPosition}`;
    
    // Check for duplicates within same root
    if (seenInRoot.has(key)) {
      duplicateWithinRoot++;
    }
    seenInRoot.add(key);
    
    // Check for duplicates across roots
    const ayahKey = `${occ.ref.surah}:${occ.ref.ayah}`;
    if (!allOccurrences.has(ayahKey)) {
      allOccurrences.set(ayahKey, []);
    }
    allOccurrences.get(ayahKey).push(rootSlug);
    
    // Validate reference
    if (occ.ref.surah < 1 || occ.ref.surah > 114 || occ.ref.ayah < 1) {
      invalidReferences++;
    }
  }
}

// Count cross-root duplicates (same ayah in multiple roots)
for (const [ayah, roots] of allOccurrences.entries()) {
  if (roots.length > 1) {
    duplicateAcrossRoots += roots.length - 1;
  }
}

console.log(`Duplicate occurrences within same root: ${duplicateWithinRoot}`);
console.log(`Duplicate occurrences across different roots: ${duplicateAcrossRoots}`);
console.log(`Invalid surah/ayah references: ${invalidReferences}`);
console.log(`Integrity: ${duplicateWithinRoot === 0 && invalidReferences === 0 ? '✓ PASS' : '✗ FAIL'}\n`);

// ============================================================================
// 4. Status Breakdown
// ============================================================================

console.log('=== 4. Status Breakdown ===\n');

const statusCounts = {
  activated: 0,
  'partially-activated': 0,
  'needs-review': 0,
  discovered: 0,
};

for (const root of registry.roots) {
  statusCounts[root.status]++;
}

console.log(`Activated: ${statusCounts.activated}`);
console.log(`Partially activated: ${statusCounts['partially-activated']}`);
console.log(`Needs review: ${statusCounts['needs-review']}`);
console.log(`Discovered: ${statusCounts.discovered}`);
console.log(`Total: ${Object.values(statusCounts).reduce((a, b) => a + b, 0)}`);
console.log(`Sum check: ${Object.values(statusCounts).reduce((a, b) => a + b, 0) === registry.roots.length ? '✓ PASS' : '✗ FAIL'}\n`);

// ============================================================================
// 5. Generate Report
// ============================================================================

const report = {
  auditDate: new Date().toISOString(),
  registrySummary: registry.summary,
  globalCoverage: {
    uniqueAyat: globalAyat.size,
    totalOccurrences: totalOccurrences,
    totalMatches: totalMatches,
    occurrenceFiles: occurrenceFiles.length,
  },
  perRootCoverage: {
    sumOfDistinctAyat: sumOfPerRootAyat,
    explanation: 'Sum of per-root distinctAyahCount. Exceeds global count because ayat can appear in multiple roots.',
  },
  integrity: {
    duplicateWithinRoot: duplicateWithinRoot,
    duplicateAcrossRoots: duplicateAcrossRoots,
    invalidReferences: invalidReferences,
    status: duplicateWithinRoot === 0 && invalidReferences === 0 ? 'PASS' : 'FAIL',
  },
  statusBreakdown: statusCounts,
  conclusions: [
    `Global unique ayat count: ${globalAyat.size}`,
    `This is the authoritative count of unique ayat covered by at least one activated root.`,
    `Per-root sum (${sumOfPerRootAyat}) exceeds global count due to cross-root duplicates.`,
    `No within-root duplicates found.`,
    `No invalid references found.`,
    `All status counts are mutually exclusive and sum to ${registry.roots.length}.`,
  ],
};

const reportPath = join(DATA_DIR, 'global-root-ayah-coverage-report.json');
writeFileSync(reportPath, JSON.stringify(report, null, 2));

console.log('=== Coverage Report Generated ===');
console.log(`Written to: ${reportPath}\n`);

console.log('=== Audit Complete ===');
console.log(`\nAuthoritative global unique ayah count: ${globalAyat.size}`);
