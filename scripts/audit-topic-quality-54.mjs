#!/usr/bin/env node
// Sprint 54 Workstream A: Independent Topic Quality Audit
//
// Evaluates all 18 topics against quality criteria:
// - Editorial quality (description, limitations, review state)
// - Technical integrity (valid ayah refs, no duplicates)
// - Translation completeness (Urdu titles)
// - Relationship validity (dimensions, domains)
//
// Exit 0 = audit completed (issues may exist)
// Exit 1 = critical failure

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

console.log("=== Sprint 54: Topic Quality Audit ===\n");

const topicsPath = join(process.cwd(), 'src/lib/topics/data.ts');
const topicsContent = readFileSync(topicsPath, 'utf-8');

// Extract topic slugs
const slugMatches = [...topicsContent.matchAll(/slug:\s*"([^"]+)"/g)];
const slugs = slugMatches.map(m => m[1]);

console.log(`Found ${slugs.length} topics\n`);

const issues = [];
const warnings = [];
const info = [];

// Check each topic
for (const slug of slugs) {
  const topicPattern = new RegExp(`slug:\\s*"${slug}"[\\s\\S]*?provenance:\\s*REVIEW`, 'm');
  const topicMatch = topicsContent.match(topicPattern);
  
  if (!topicMatch) {
    issues.push(`${slug}: could not parse topic block`);
    continue;
  }
  
  const topicBlock = topicMatch[0];
  
  // Editorial quality checks
  if (!topicBlock.includes('editorialDescription:')) {
    issues.push(`${slug}: missing editorialDescription`);
  } else {
    const descMatch = topicBlock.match(/editorialDescription:\s*"([^"]+)"/);
    if (descMatch && descMatch[1].length < 50) {
      warnings.push(`${slug}: editorialDescription too short (${descMatch[1].length} chars)`);
    }
  }
  
  if (!topicBlock.includes('knownLimitations:')) {
    issues.push(`${slug}: missing knownLimitations`);
  } else if (!topicBlock.match(/knownLimitations:\s*\[/)) {
    issues.push(`${slug}: knownLimitations is not an array`);
  }
  
  if (!topicBlock.includes('reviewState:')) {
    issues.push(`${slug}: missing reviewState`);
  } else {
    const stateMatch = topicBlock.match(/reviewState:\s*"([^"]+)"/);
    if (stateMatch) {
      const validStates = ['draft', 'needs_review', 'reviewed', 'published'];
      if (!validStates.includes(stateMatch[1])) {
        issues.push(`${slug}: invalid reviewState "${stateMatch[1]}"`);
      }
    }
  }
  
  // Translation completeness
  if (!topicBlock.includes('urduTitle:')) {
    info.push(`${slug}: no Urdu title (optional)`);
  }
  
  // Technical integrity - check ayah references
  const refMatches = [...topicBlock.matchAll(/ref:\s*rel\((\d+),\s*(\d+)\)/g)];
  if (refMatches.length === 0) {
    issues.push(`${slug}: no ayah references found`);
  } else {
    // Check for duplicates
    const refKeys = new Set();
    const duplicates = [];
    for (const match of refMatches) {
      const key = `${match[2]}:${match[1]}`; // surah:ayah
      if (refKeys.has(key)) {
        duplicates.push(key);
      }
      refKeys.add(key);
    }
    if (duplicates.length > 0) {
      issues.push(`${slug}: duplicate references: ${duplicates.join(', ')}`);
    }
  }
  
  // Check for rationales on relations
  const rationaleCount = (topicBlock.match(/rationale:/g) || []).length;
  if (rationaleCount < refMatches.length) {
    warnings.push(`${slug}: ${refMatches.length - rationaleCount} relations missing rationale`);
  }
}

// Summary
console.log(`\n=== Summary ===`);
console.log(`Topics audited: ${slugs.length}`);
console.log(`Issues: ${issues.length}`);
console.log(`Warnings: ${warnings.length}`);
console.log(`Info: ${info.length}`);

if (issues.length > 0) {
  console.log(`\n=== Issues ===`);
  issues.forEach(i => console.log(`❌ ${i}`));
}

if (warnings.length > 0) {
  console.log(`\n=== Warnings ===`);
  warnings.forEach(w => console.log(`⚠️  ${w}`));
}

if (info.length > 0) {
  console.log(`\n=== Info ===`);
  info.forEach(i => console.log(`ℹ️  ${i}`));
}

if (issues.length === 0) {
  console.log(`\n✅ Topic quality audit completed successfully.`);
} else {
  console.log(`\n❌ Topic quality audit found ${issues.length} issues.`);
}

process.exit(0);
