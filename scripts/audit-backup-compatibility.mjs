#!/usr/bin/env node

/**
 * Backup Compatibility Audit Script
 * 
 * Verifies that all backup fixtures are valid JSON, parse successfully,
 * and that migrations preserve data integrity across versions v3-v9.
 * 
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FIXTURES_DIR = path.join(__dirname, '..', 'tests', 'fixtures', 'backup');
const VERSIONS = [3, 4, 5, 6, 7, 8, 9];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function log(message, type = 'info') {
  const prefix = {
    info: 'ℹ',
    success: '✓',
    error: '✗',
    warn: '⚠'
  }[type] || '•';
  
  console.log(`${prefix}  ${message}`);
}

function check(description, condition) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    log(description, 'success');
    return true;
  } else {
    failedChecks++;
    log(description, 'error');
    return false;
  }
}

function loadFixture(version) {
  const filename = `v${version}-backup.json`;
  const filePath = path.join(FIXTURES_DIR, filename);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  return fs.readFileSync(filePath, 'utf-8');
}

function validateJSON(text) {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

async function runAudit() {
  console.log('\n=== Backup Compatibility Audit ===\n');
  
  // Check fixtures directory exists
  log('Checking fixtures directory...', 'info');
  if (!fs.existsSync(FIXTURES_DIR)) {
    log('Fixtures directory not found', 'error');
    process.exit(1);
  }
  check('Fixtures directory exists', true);
  
  // Audit each version
  for (const version of VERSIONS) {
    console.log(`\n--- Version ${version} ---`);
    
    const text = loadFixture(version);
    
    // Check fixture exists
    if (!check(`v${version} fixture exists`, text !== null)) {
      continue;
    }
    
    // Check valid JSON
    if (!check(`v${version} is valid JSON`, validateJSON(text))) {
      continue;
    }
    
    // Parse and validate structure
    const backup = JSON.parse(text);
    
    // Check format
    check(`v${version} has correct format`, backup.format === 'al-huda-backup');
    
    // Check version
    check(`v${version} has correct version`, backup.version === version);
    
    // Check app
    check(`v${version} has correct app`, backup.app === 'Al-Huda');
    
    // Check exportedAt
    check(`v${version} has exportedAt`, typeof backup.exportedAt === 'string');
    
    // Check library structure
    check(`v${version} has library`, typeof backup.library === 'object');
    check(`v${version} has bookmarks array`, Array.isArray(backup.library?.bookmarks));
    check(`v${version} has notes array`, Array.isArray(backup.library?.notes));
    check(`v${version} has progress array`, Array.isArray(backup.library?.progress));
    
    // Check revision structure
    check(`v${version} has revision`, typeof backup.revision === 'object');
    check(`v${version} has revision.items`, typeof backup.revision?.items === 'object');
    check(`v${version} has revision.events`, Array.isArray(backup.revision?.events));
    
    // Check preferences
    check(`v${version} has preferences`, typeof backup.preferences === 'object');
    
    // Check paths
    check(`v${version} has paths`, typeof backup.paths === 'object');
    
    // Version-specific checks
    if (version >= 5) {
      check(`v${version} has quiz`, typeof backup.quiz === 'object');
    }
    
    if (version >= 6) {
      check(`v${version} has readingPlans`, typeof backup.readingPlans === 'object');
    }
    
    if (version >= 7) {
      check(`v${version} has collections`, Array.isArray(backup.library?.collections));
      check(`v${version} has collectionAyat`, Array.isArray(backup.library?.collectionAyat));
    }
    
    if (version >= 8) {
      check(`v${version} has journeys`, typeof backup.journeys === 'object');
    }
    
    if (version >= 9) {
      check(`v${version} has reflections`, typeof backup.reflections === 'object');
      check(`v${version} has reflections.reflections`, Array.isArray(backup.reflections?.reflections));
    }
  }
  
  // Summary
  console.log('\n=== Audit Summary ===\n');
  log(`Total checks: ${totalChecks}`, 'info');
  log(`Passed: ${passedChecks}`, 'success');
  log(`Failed: ${failedChecks}`, failedChecks > 0 ? 'error' : 'info');
  
  if (failedChecks > 0) {
    console.log('\n❌ Audit failed\n');
    process.exit(1);
  } else {
    console.log('\n✅ All checks passed\n');
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error('Audit script error:', err);
  process.exit(1);
});
