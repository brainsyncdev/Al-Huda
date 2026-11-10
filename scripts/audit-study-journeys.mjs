#!/usr/bin/env node
// Audit script for validating study journeys.

import { JOURNEYS, getJourney } from "../src/lib/study-journeys/data.ts";
import { getTopic } from "../src/lib/topics/data.ts";
import { getDimension } from "../src/lib/explore/dimensions.ts";
import { getAyah, getSurah } from "../src/lib/quran/data.ts";

const issues = [];

console.log("=== Study Journeys Audit ===\n");

// 1. Validate journeys
console.log("1. Validating journeys...");
const journeySlugs = new Set();

for (const journey of JOURNEYS) {
  if (journeySlugs.has(journey.slug)) {
    issues.push(`Duplicate journey slug: ${journey.slug}`);
  }
  journeySlugs.add(journey.slug);
  
  if (!journey.title || !journey.arabicTitle || !journey.summary) {
    issues.push(`Journey ${journey.slug} missing required fields`);
  }
  
  if (!journey.dimensionId) {
    issues.push(`Journey ${journey.slug} missing dimensionId`);
  } else if (!getDimension(journey.dimensionId)) {
    issues.push(`Journey ${journey.slug} references non-existent dimension: ${journey.dimensionId}`);
  }
  
  if (journey.stages.length === 0) {
    issues.push(`Journey ${journey.slug} has no stages`);
  }
  
  // Check prerequisites exist
  for (const prereq of journey.prerequisites) {
    if (!getJourney(prereq)) {
      issues.push(`Journey ${journey.slug} references non-existent prerequisite: ${prereq}`);
    }
  }
  
  // Validate stages
  const stageOrders = new Set();
  for (const stage of journey.stages) {
    if (stageOrders.has(stage.order)) {
      issues.push(`Journey ${journey.slug} has duplicate stage order: ${stage.order}`);
    }
    stageOrders.add(stage.order);
    
    if (!stage.title || !stage.objective) {
      issues.push(`Journey ${journey.slug} stage ${stage.order} missing required fields`);
    }
    
    // Check topicSlug references existing topic
    if (stage.topicSlug && !getTopic(stage.topicSlug)) {
      issues.push(`Journey ${journey.slug} stage ${stage.order} references non-existent topic: ${stage.topicSlug}`);
    }
    
    // Check ref references existing ayah
    if (stage.ref) {
      const ayah = getAyah(stage.ref.surah, stage.ref.ayah);
      const surah = getSurah(stage.ref.surah);
      if (!ayah || !surah) {
        issues.push(`Journey ${journey.slug} stage ${stage.order} references non-existent ayah: ${stage.ref.surah}:${stage.ref.ayah}`);
      }
    }
    
    // Must have either ref or topicSlug
    if (!stage.ref && !stage.topicSlug) {
      issues.push(`Journey ${journey.slug} stage ${stage.order} has neither ref nor topicSlug`);
    }
  }
}

console.log(`   ✓ ${JOURNEYS.length} journeys validated`);

// 2. Summary
console.log("\n=== Summary ===");
console.log(`Journeys: ${JOURNEYS.length}`);
console.log(`Total stages: ${JOURNEYS.reduce((sum, j) => sum + j.stages.length, 0)}`);

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
