#!/usr/bin/env node
// Audit script for validating study journeys.
//
// This script reads the TypeScript source files and validates the structure
// without importing them (to avoid TypeScript compilation issues).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const issues = [];

console.log("=== Study Journeys Audit ===\n");

// Read source files
const journeysPath = join(process.cwd(), 'src/lib/study-journeys/data.ts');
const topicsPath = join(process.cwd(), 'src/lib/topics/data.ts');
const dimensionsPath = join(process.cwd(), 'src/lib/explore/dimensions.ts');

const journeysContent = readFileSync(journeysPath, 'utf-8');
const topicsContent = readFileSync(topicsPath, 'utf-8');
const dimensionsContent = readFileSync(dimensionsPath, 'utf-8');

// 1. Validate journeys count
console.log("1. Validating journeys...");
const journeysSection = journeysContent.substring(
  journeysContent.indexOf('export const JOURNEYS'),
  journeysContent.indexOf('];', journeysContent.indexOf('export const JOURNEYS'))
);
const journeyCount = (journeysSection.match(/\n  \{\n    slug: "/g) || []).length;
console.log(`   ✓ Found ${journeyCount} journeys`);
if (journeyCount !== 4) {
  issues.push(`Expected 4 journeys, found ${journeyCount}`);
}

// 2. Validate journey slugs
console.log("2. Validating journey slugs...");
const expectedJourneys = [
  'understanding-tawheed',
  'patience-through-difficulties',
  'gratitude-and-contentment',
  'building-relationship-with-allah'
];
for (const slug of expectedJourneys) {
  if (!journeysContent.includes(`slug: "${slug}"`)) {
    issues.push(`Expected journey "${slug}" not found`);
  }
}
console.log(`   ✓ All ${expectedJourneys.length} expected journeys present`);

// 3. Validate stages count
console.log("3. Validating stages...");
const stageMatches = journeysContent.match(/order: \d+/g) || [];
console.log(`   ✓ Found ${stageMatches.length} stages`);
if (stageMatches.length !== 20) {
  issues.push(`Expected 20 stages, found ${stageMatches.length}`);
}

// 4. Validate dimension references
console.log("4. Validating dimension references...");
const validDimensions = ['spiritual', 'personal', 'family', 'social', 'economic', 'intellectual', 'governance', 'jihad', 'interfaith', 'ilm', 'worship', 'prophets', 'creation', 'hereafter', 'law'];
const dimensionRefs = journeysContent.match(/dimensionId: "([^"]+)"/g) || [];
for (const ref of dimensionRefs) {
  const dimId = ref.match(/dimensionId: "([^"]+)"/)[1];
  if (!validDimensions.includes(dimId)) {
    issues.push(`Invalid dimension reference: ${dimId}`);
  }
}
console.log(`   ✓ All dimension references valid`);

// 5. Validate topic references
console.log("5. Validating topic references...");
const topicRefs = journeysContent.match(/topicSlug: "([^"]+)"/g) || [];
const uniqueTopics = [...new Set(topicRefs.map(ref => ref.match(/topicSlug: "([^"]+)"/)[1]))];
for (const topicSlug of uniqueTopics) {
  if (!topicsContent.includes(`slug: "${topicSlug}"`)) {
    issues.push(`Topic reference "${topicSlug}" not found in topics`);
  }
}
console.log(`   ✓ All ${uniqueTopics.length} unique topic references valid`);

// 6. Validate prerequisites
console.log("6. Validating prerequisites...");
const prereqMatches = journeysContent.match(/prerequisites: \[[^\]]*\]/g) || [];
console.log(`   ✓ Found ${prereqMatches.length} prerequisite declarations`);

// Summary
console.log("\n=== Summary ===");
console.log(`Journeys: ${journeyCount}`);
console.log(`Total stages: ${stageMatches.length}`);
console.log(`Unique topics referenced: ${uniqueTopics.length}`);

if (issues.length === 0) {
  console.log("\n✅ All journey validations passed.");
  process.exit(0);
} else {
  console.log(`\n❌ Found ${issues.length} issue(s):`);
  for (const issue of issues) {
    console.log(`   - ${issue}`);
  }
  process.exit(1);
}
