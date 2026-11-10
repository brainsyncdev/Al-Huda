#!/usr/bin/env node
// Sprint 54 Workstream B: Study Journey Educational Quality Audit
//
// This script evaluates all 4 journeys and 20 stages against educational
// quality criteria. It checks for:
// - Clear, measurable learning objectives
// - Logical stage progression
// - Valid topic and ayah references
// - Meaningful completion criteria (not generic)
// - Reflection prompts that don't claim to be Tafsir or rulings
//
// Exit code 0 = all critical checks pass
// Exit code 1 = critical issues found

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const issues = [];
const warnings = [];
const info = [];

console.log("=== Sprint 54: Study Journey Educational Quality Audit ===\n");

// Read source files
const journeysPath = join(process.cwd(), 'src/lib/study-journeys/data.ts');
const topicsPath = join(process.cwd(), 'src/lib/topics/data.ts');

const journeysContent = readFileSync(journeysPath, 'utf-8');
const topicsContent = readFileSync(topicsPath, 'utf-8');

// Surah verse counts for validation
const SURAH_VERSE_COUNTS = {
  2: 286,   // Al-Baqarah
  13: 43,   // Ar-Ra'd
  14: 52,   // Ibrahim
  31: 34,   // Luqman
  39: 75,   // Az-Zumar
  49: 18,   // Al-Hujurat
  55: 78,   // Ar-Rahman
  65: 12,   // At-Talaq
  94: 8,    // Ash-Sharh
  112: 4    // Al-Ikhlas
};

// Extract journeys and stages using regex
function extractJourneys() {
  const journeys = [];
  const journeyBlocks = journeysContent.match(/\{[\s\S]*?slug: "([^"]+)"[\s\S]*?stages: \[([\s\S]*?)\]\s*\}/g);
  
  if (!journeyBlocks) return journeys;
  
  for (const block of journeyBlocks) {
    const slugMatch = block.match(/slug: "([^"]+)"/);
    const titleMatch = block.match(/title: "([^"]+)"/);
    const objectiveMatch = block.match(/learningObjective:\s*"([^"]+)"/);
    const audienceMatch = block.match(/intendedAudience:\s*"([^"]+)"/);
    const criteriaMatch = block.match(/completionCriteria: \[([\s\S]*?)\]/);
    
    if (!slugMatch) continue;
    
    const stages = [];
    const stageBlocks = block.match(/\{[\s\S]*?order: \d+[\s\S]*?\}/g) || [];
    
    for (const stageBlock of stageBlocks) {
      const orderMatch = stageBlock.match(/order: (\d+)/);
      const stageTitleMatch = stageBlock.match(/title: "([^"]+)"/);
      const stageObjMatch = stageBlock.match(/objective:\s*"([^"]+)"/);
      const reflectionMatch = stageBlock.match(/reflectionPrompt:\s*"([^"]+)"/);
      const stageCriteriaMatch = stageBlock.match(/completionCriteria:\s*"([^"]+)"/);
      const nextStepMatch = stageBlock.match(/nextStep:\s*"([^"]+)"/);
      const topicSlugMatch = stageBlock.match(/topicSlug: "([^"]+)"/);
      const refMatch = stageBlock.match(/ref: \{ surah: (\d+), ayah: (\d+) \}/);
      
      if (orderMatch) {
        stages.push({
          order: parseInt(orderMatch[1]),
          title: stageTitleMatch ? stageTitleMatch[1] : '',
          objective: stageObjMatch ? stageObjMatch[1] : '',
          reflectionPrompt: reflectionMatch ? reflectionMatch[1] : '',
          completionCriteria: stageCriteriaMatch ? stageCriteriaMatch[1] : '',
          nextStep: nextStepMatch ? nextStepMatch[1] : '',
          topicSlug: topicSlugMatch ? topicSlugMatch[1] : null,
          ref: refMatch ? { surah: parseInt(refMatch[1]), ayah: parseInt(refMatch[2]) } : null
        });
      }
    }
    
    journeys.push({
      slug: slugMatch[1],
      title: titleMatch ? titleMatch[1] : '',
      learningObjective: objectiveMatch ? objectiveMatch[1] : '',
      intendedAudience: audienceMatch ? audienceMatch[1] : '',
      completionCriteria: criteriaMatch ? criteriaMatch[1].split('","').map(s => s.replace(/"/g, '').trim()) : [],
      stages
    });
  }
  
  return journeys;
}

// Extract topic slugs
function extractTopicSlugs() {
  const matches = topicsContent.match(/slug: "([^"]+)"/g) || [];
  return matches.map(m => m.match(/slug: "([^"]+)"/)[1]);
}

// Quality checks
function checkJourneyQuality(journey) {
  const journeyIssues = [];
  const journeyWarnings = [];
  
  // 1. Learning objective is clear and measurable
  if (!journey.learningObjective || journey.learningObjective.length < 20) {
    journeyIssues.push(`Journey "${journey.slug}": Learning objective is too short or missing`);
  }
  
  // 2. Intended audience is specified
  if (!journey.intendedAudience) {
    journeyWarnings.push(`Journey "${journey.slug}": No intended audience specified`);
  }
  
  // 3. Completion criteria are meaningful (not generic)
  const genericCriteria = ['Completed all', 'Reflected on'];
  const hasGenericCriteria = journey.completionCriteria.some(c => 
    genericCriteria.some(g => c.includes(g))
  );
  if (hasGenericCriteria) {
    journeyWarnings.push(`Journey "${journey.slug}": Contains generic completion criteria`);
  }
  
  // 4. Has at least one meaningful completion criterion
  const meaningfulCriteria = journey.completionCriteria.filter(c => 
    c.startsWith('Can ') || c.includes('demonstrate') || c.includes('articulate')
  );
  if (meaningfulCriteria.length === 0) {
    journeyIssues.push(`Journey "${journey.slug}": No meaningful completion criteria (e.g., "Can articulate...")`);
  }
  
  // 5. Stage sequence builds naturally
  if (journey.stages.length < 3) {
    journeyWarnings.push(`Journey "${journey.slug}": Only ${journey.stages.length} stages - may be too short`);
  }
  
  return { issues: journeyIssues, warnings: journeyWarnings };
}

function checkStageQuality(stage, journeySlug, stageIndex, totalStages) {
  const stageIssues = [];
  const stageWarnings = [];
  
  // 1. Clear learning purpose
  if (!stage.objective || stage.objective.length < 30) {
    stageIssues.push(`Stage ${stage.order} in "${journeySlug}": Objective is too short or missing`);
  }
  
  // 2. Completion criteria are meaningful
  if (!stage.completionCriteria || stage.completionCriteria.length < 20) {
    stageIssues.push(`Stage ${stage.order} in "${journeySlug}": Completion criteria too short`);
  }
  
  // 3. Next step is specified
  if (!stage.nextStep) {
    stageWarnings.push(`Stage ${stage.order} in "${journeySlug}": No nextStep specified`);
  }
  
  // 4. Reflection prompt doesn't claim to be Tafsir or ruling
  if (stage.reflectionPrompt) {
    const rulingKeywords = ['must', 'should', 'required', 'obligatory', 'forbidden', 'haram', 'halal', 'ruling', 'fatwa', 'tafsir', 'interpretation'];
    const hasRulingLanguage = rulingKeywords.some(k => 
      stage.reflectionPrompt.toLowerCase().includes(k)
    );
    if (hasRulingLanguage) {
      stageIssues.push(`Stage ${stage.order} in "${journeySlug}": Reflection prompt uses ruling/Tafsir language`);
    }
    
    // Check it's a question or invitation to reflect
    if (!stage.reflectionPrompt.includes('?') && !stage.reflectionPrompt.toLowerCase().includes('consider')) {
      stageWarnings.push(`Stage ${stage.order} in "${journeySlug}": Reflection prompt is not phrased as a question`);
    }
  }
  
  // 5. Valid ayah reference
  if (stage.ref) {
    const maxVerses = SURAH_VERSE_COUNTS[stage.ref.surah];
    if (!maxVerses) {
      stageIssues.push(`Stage ${stage.order} in "${journeySlug}": Unknown surah ${stage.ref.surah}`);
    } else if (stage.ref.ayah > maxVerses) {
      stageIssues.push(`Stage ${stage.order} in "${journeySlug}": Ayah ${stage.ref.ayah} exceeds surah ${stage.ref.surah} verse count (${maxVerses})`);
    }
  }
  
  // 6. Check for repetitive stages (same ayah or very similar objectives)
  // This is checked at journey level
  
  return { issues: stageIssues, warnings: stageWarnings };
}

function checkRepetitiveStages(journey) {
  const warnings = [];
  
  // Check for duplicate ayah references
  const ayahRefs = journey.stages
    .filter(s => s.ref)
    .map(s => `${s.ref.surah}:${s.ref.ayah}`);
  const uniqueRefs = new Set(ayahRefs);
  if (ayahRefs.length !== uniqueRefs.size) {
    warnings.push(`Journey "${journey.slug}": Contains duplicate ayah references`);
  }
  
  // Check for very similar objectives (simple similarity check)
  for (let i = 0; i < journey.stages.length - 1; i++) {
    const obj1 = journey.stages[i].objective.toLowerCase();
    const obj2 = journey.stages[i + 1].objective.toLowerCase();
    
    // Simple word overlap check
    const words1 = new Set(obj1.split(/\s+/));
    const words2 = new Set(obj2.split(/\s+/));
    const overlap = [...words1].filter(w => words2.has(w)).length;
    const similarity = overlap / Math.min(words1.size, words2.size);
    
    if (similarity > 0.7) {
      warnings.push(`Journey "${journey.slug}": Stages ${i + 1} and ${i + 2} have very similar objectives (${Math.round(similarity * 100)}% overlap)`);
    }
  }
  
  return warnings;
}

// Main audit
console.log("1. Extracting journeys and stages...");
const journeys = extractJourneys();
const topicSlugs = extractTopicSlugs();

console.log(`   Found ${journeys.length} journeys`);
console.log(`   Found ${topicSlugs.length} topics\n`);

if (journeys.length !== 4) {
  issues.push(`Expected 4 journeys, found ${journeys.length}`);
}

let totalStages = 0;

console.log("2. Auditing journey-level quality...");
for (const journey of journeys) {
  const { issues: jIssues, warnings: jWarnings } = checkJourneyQuality(journey);
  issues.push(...jIssues);
  warnings.push(...jWarnings);
  
  console.log(`   ✓ ${journey.slug}: ${journey.stages.length} stages`);
  totalStages += journey.stages.length;
}

console.log(`\n3. Auditing stage-level quality...");
for (const journey of journeys) {
  for (let i = 0; i < journey.stages.length; i++) {
    const stage = journey.stages[i];
    const { issues: sIssues, warnings: sWarnings } = checkStageQuality(
      stage, 
      journey.slug, 
      i, 
      journey.stages.length
    );
    issues.push(...sIssues);
    warnings.push(...sWarnings);
    
    // Validate topic reference
    if (stage.topicSlug && !topicSlugs.includes(stage.topicSlug)) {
      issues.push(`Stage ${stage.order} in "${journey.slug}": Topic "${stage.topicSlug}" not found`);
    }
  }
  
  // Check for repetitive stages
  const repWarnings = checkRepetitiveStages(journey);
  warnings.push(...repWarnings);
}

console.log(`   ✓ Audited ${totalStages} stages\n`);

if (totalStages !== 20) {
  issues.push(`Expected 20 total stages, found ${totalStages}`);
}

// Summary
console.log("=== Audit Summary ===");
console.log(`Journeys: ${journeys.length}`);
console.log(`Total stages: ${totalStages}`);
console.log(`Topics referenced: ${new Set(journeys.flatMap(j => j.stages.filter(s => s.topicSlug).map(s => s.topicSlug))).size}`);
console.log(`\nCritical issues: ${issues.length}`);
console.log(`Warnings: ${warnings.length}`);

if (issues.length > 0) {
  console.log("\n❌ Critical Issues:");
  for (const issue of issues) {
    console.log(`   - ${issue}`);
  }
}

if (warnings.length > 0) {
  console.log("\n⚠️  Warnings:");
  for (const warning of warnings) {
    console.log(`   - ${warning}`);
  }
}

if (issues.length === 0) {
  console.log("\n✅ All critical quality checks passed.");
  process.exit(0);
} else {
  console.log(`\n❌ Audit failed with ${issues.length} critical issue(s).`);
  process.exit(1);
}
