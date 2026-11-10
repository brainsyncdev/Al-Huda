#!/usr/bin/env node
/**
 * Audit script for study journey completeness.
 *
 * Validates:
 * - All journeys have learningObjective
 * - All stages have reflectionPrompt or are flagged
 * - All stages have completionCriteria
 * - All stages have nextStep
 * - All journeys have completionCriteria array
 *
 * Exit 0 on success, 1 on failure.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read and parse the TypeScript file
const dataPath = resolve(__dirname, "../src/lib/study-journeys/data.ts");
const content = readFileSync(dataPath, "utf-8");

// Extract the JOURNEYS array using regex
const journeysMatch = content.match(/export const JOURNEYS: StudyJourney\[\] = (\[[\s\S]*?\n\];)/);
if (!journeysMatch) {
  console.error("Could not find JOURNEYS array in data.ts");
  process.exit(1);
}

// Parse the array (this is a simplified parser for the specific format)
// We'll use a more robust approach: evaluate the structure
let hasErrors = false;
const warnings = [];
const errors = [];

console.log("Auditing study journey completeness...\n");

// Extract journey slugs and check structure
const journeySlugs = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
const learningObjectives = [...content.matchAll(/learningObjective:\s*"([^"]+)"/g)].map(m => m[1]);
const completionCriteriaArrays = content.match(/completionCriteria:\s*\[[\s\S]*?\]/g) || [];

console.log(`Found ${journeySlugs.length} journeys`);

// Check each journey
for (let i = 0; i < journeySlugs.length; i++) {
  const slug = journeySlugs[i];
  console.log(`\nChecking journey: ${slug}`);

  // Check learningObjective
  if (i >= learningObjectives.length || !learningObjectives[i]) {
    errors.push(`Journey "${slug}" is missing learningObjective`);
    hasErrors = true;
  } else {
    console.log(`  ✓ Has learningObjective`);
  }

  // Check completionCriteria
  if (i >= completionCriteriaArrays.length) {
    errors.push(`Journey "${slug}" is missing completionCriteria array`);
    hasErrors = true;
  } else {
    console.log(`  ✓ Has completionCriteria`);
  }
}

// Extract stages and check them
const stageBlocks = content.match(/stages:\s*\[([\s\S]*?)\n\s*\],?\n\s*\}/g) || [];
let totalStages = 0;

for (let i = 0; i < journeySlugs.length; i++) {
  const slug = journeySlugs[i];
  
  // Find stages for this journey
  const stageRegex = new RegExp(`slug:\\s*"${slug}"[\\s\\S]*?stages:\\s*\\[([\\s\\S]*?)\\n\\s*\\]`, 'm');
  const stageMatches = content.match(stageRegex);
  if (!stageMatches) continue;
  
  const stagesContent = stageMatches[1];
  const stageTitles = [...stagesContent.matchAll(/title:\s*"([^"]+)"/g)].map(m => m[1]);
  const reflectionPrompts = [...stagesContent.matchAll(/reflectionPrompt:\s*"([^"]+)"/g)].map(m => m[1]);
  const stageCompletionCriteria = [...stagesContent.matchAll(/completionCriteria:\s*"([^"]+)"/g)].map(m => m[1]);
  const nextSteps = [...stagesContent.matchAll(/nextStep:\s*"([^"]+)"/g)].map(m => m[1]);
  
  console.log(`  Found ${stageTitles.length} stages`);
  
  for (let j = 0; j < stageTitles.length; j++) {
    totalStages++;
    const stageTitle = stageTitles[j];
    const stageId = `${slug}/stage-${j + 1}`;
    
    // Check reflectionPrompt (optional but warn if missing)
    if (j >= reflectionPrompts.length || !reflectionPrompts[j]) {
      warnings.push(`Stage "${stageId}" (${stageTitle}) is missing reflectionPrompt`);
    }
    
    // Check completionCriteria (required)
    if (j >= stageCompletionCriteria.length || !stageCompletionCriteria[j]) {
      errors.push(`Stage "${stageId}" (${stageTitle}) is missing completionCriteria`);
      hasErrors = true;
    }
    
    // Check nextStep (required)
    if (j >= nextSteps.length || !nextSteps[j]) {
      errors.push(`Stage "${stageId}" (${stageTitle}) is missing nextStep`);
      hasErrors = true;
    }
  }
}

// Report results
if (warnings.length > 0) {
  console.log("\nWarnings:");
  for (const w of warnings) {
    console.log(`  ⚠ ${w}`);
  }
}

if (errors.length > 0) {
  console.log("\nErrors:");
  for (const e of errors) {
    console.log(`  ✗ ${e}`);
  }
}

console.log("\n---");
console.log(`Journeys audited: ${journeySlugs.length}`);
console.log(`Total stages audited: ${totalStages}`);

if (hasErrors) {
  console.log("\n❌ Audit FAILED");
  process.exit(1);
} else {
  console.log("\n✅ Audit PASSED");
  if (warnings.length > 0) {
    console.log(`   (${warnings.length} warnings)`);
  }
  process.exit(0);
}
