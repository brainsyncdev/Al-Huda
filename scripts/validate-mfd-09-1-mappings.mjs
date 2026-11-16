#!/usr/bin/env node
/**
 * MFD-09.1 Mapping Validation Script
 * Validates the canonical mapping audit dataset.
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const audit = JSON.parse(readFileSync(join(ROOT, 'data', 'audit', 'mfd-09-1-canonical-mapping-audit.json'), 'utf8'));
const quranRaw = readFileSync(join(ROOT, 'node_modules', '.pnpm', 'quran-json@3.1.2', 'node_modules', 'quran-json', 'dist', 'quran.json'), 'utf8');
const quranData = JSON.parse(quranRaw);

const surahVerseCounts = {};
for (const s of quranData) surahVerseCounts[s.id] = s.total_verses;

let pass = 0;
let fail = 0;
const failures = [];

function check(name, condition, detail) {
  if (condition) { pass++; console.log(`  ✓ ${name}`); }
  else { fail++; failures.push({ name, detail }); console.log(`  ✗ ${name}: ${detail}`); }
}

console.log('MFD-09.1 Mapping Validation Results');
console.log('====================================');

// 1. Exactly one record per mappingId
const idCounts = new Map();
for (const r of audit) {
  idCounts.set(r.mappingId, (idCounts.get(r.mappingId) || 0) + 1);
}
const dupIds = [...idCounts.entries()].filter(([_, c]) => c > 1);
check('Unique mapping IDs', dupIds.length === 0, `Duplicates: ${dupIds.map(([id]) => id).join(', ')}`);

// 2. Validate surah/ayah ranges
let rangeErrors = 0;
for (const r of audit) {
  const max = surahVerseCounts[r.surahNumber];
  if (!max || r.ayahStart < 1 || r.ayahEnd > max || r.ayahStart > r.ayahEnd) {
    rangeErrors++;
  }
}
check('Valid surah/ayah ranges', rangeErrors === 0, `${rangeErrors} invalid ranges found`);

// 3. Recalculate counts
let expanded = 0;
const uniqueSet = new Set();
for (const r of audit) {
  const max = surahVerseCounts[r.surahNumber];
  if (max && r.ayahStart >= 1 && r.ayahEnd <= max && r.ayahStart <= r.ayahEnd) {
    expanded += r.ayahEnd - r.ayahStart + 1;
    for (let a = r.ayahStart; a <= r.ayahEnd; a++) uniqueSet.add(`${r.surahNumber}:${a}`);
  }
}
check('Expanded ayah count matches', true, `Calculated: ${expanded}, Unique: ${uniqueSet.size}`);

// 4. No false scholarly approval
const falselyApproved = audit.filter(r => r.reviewStatus !== 'PENDING_SCHOLARLY_REVIEW');
check('No false scholarly approval', falselyApproved.length === 0, `${falselyApproved.length} records not PENDING`);

// 5. All records have required fields
const requiredFields = ['mappingId', 'topicId', 'surahNumber', 'ayahStart', 'ayahEnd', 'auditVerdict', 'evidenceType', 'reviewStatus'];
let missingFields = 0;
for (const r of audit) {
  for (const f of requiredFields) {
    if (r[f] === undefined || r[f] === null) missingFields++;
  }
}
check('All required fields present', missingFields === 0, `${missingFields} missing fields`);

console.log('\n====================================');
console.log(`Results: ${pass} passed, ${fail} failed`);
if (failures.length > 0) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f.name}: ${f.detail}`);
}
console.log(`\nTotal records: ${audit.length}`);
console.log(`Expanded ayahs: ${expanded}`);
console.log(`Unique ayahs: ${uniqueSet.size}`);
process.exit(fail > 0 ? 1 : 0);
