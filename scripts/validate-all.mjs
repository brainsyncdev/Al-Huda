#!/usr/bin/env node
/**
 * MFD-08 Master Validation Runner
 * 
 * Runs all validation scripts and reports overall status.
 */

import { execSync } from 'node:child_process';

const validators = [
  { name: 'Quran Data', script: 'validate-quran-data.mjs' },
  { name: 'Source Licenses', script: 'validate-source-licenses.mjs' },
  { name: 'Taxonomy', script: 'validate-taxonomy.mjs' },
  { name: 'Ayah Mappings', script: 'validate-ayah-mappings.mjs' },
  { name: 'Root Registry', script: 'validate-roots.mjs' },
];

console.log('🔍 MFD-08 Master Validation Runner\n');
console.log('Running all validators...\n');

let passed = 0;
let failed = 0;
const results = [];

for (const validator of validators) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Running: ${validator.name}`);
  console.log('='.repeat(60));
  
  try {
    execSync(`node scripts/${validator.script}`, { stdio: 'inherit' });
    results.push({ name: validator.name, status: 'PASSED' });
    passed++;
  } catch (err) {
    results.push({ name: validator.name, status: 'FAILED' });
    failed++;
  }
}

console.log('\n\n' + '='.repeat(60));
console.log('VALIDATION SUMMARY');
console.log('='.repeat(60));

for (const result of results) {
  const icon = result.status === 'PASSED' ? '✅' : '❌';
  console.log(`${icon} ${result.name}: ${result.status}`);
}

console.log('\n' + '='.repeat(60));
console.log(`Total: ${passed} passed, ${failed} failed`);
console.log('='.repeat(60));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\n✅ All validations passed!');
  process.exit(0);
}
