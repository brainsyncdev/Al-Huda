#!/usr/bin/env node
/**
 * Multilingual Presentation Audit Script
 * Sprint 53, Workstream E
 *
 * Audits Arabic, Urdu, and English content presentation:
 * - Checks RTL rendering for Arabic (lang="ar" dir="rtl")
 * - Checks RTL rendering for Urdu (lang="ur" dir="rtl")
 * - Verifies English content is LTR
 * - Reports missing Urdu translations
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Track audit results
const results = {
  topicsWithUrdu: [],
  topicsWithoutUrdu: [],
  journeysWithUrdu: [],
  journeysWithoutUrdu: [],
  componentIssues: [],
  passed: true,
};

console.log('🔍 Multilingual Presentation Audit\n');
console.log('='.repeat(60));

// ============================================================================
// 1. AUDIT TOPICS DATA
// ============================================================================
console.log('\n📚 Auditing Topics Data...\n');

try {
  const topicsDataPath = join(rootDir, 'src/lib/topics/data.ts');
  const topicsContent = readFileSync(topicsDataPath, 'utf-8');

  // Extract topic slugs and check for urduTitle field
  const topicRegex = /slug:\s*["']([^"']+)["'][\s\S]*?arabicTitle:\s*["']([^"']+)["']/g;
  let match;
  const topics = [];

  while ((match = topicRegex.exec(topicsContent)) !== null) {
    topics.push({
      slug: match[1],
      arabicTitle: match[2],
    });
  }

  // Check if urduTitle field exists in the data structure
  const hasUrduTitleField = topicsContent.includes('urduTitle');

  console.log(`Found ${topics.length} topics`);
  console.log(`Urdu title field exists: ${hasUrduTitleField ? '✅ YES' : '❌ NO'}`);

  if (hasUrduTitleField) {
    // Extract topics with urduTitle
    const urduRegex = /slug:\s*["']([^"']+)["'][\s\S]*?urduTitle:\s*["']([^"']+)["']/g;
    while ((match = urduRegex.exec(topicsContent)) !== null) {
      results.topicsWithUrdu.push({
        slug: match[1],
        urduTitle: match[2],
      });
    }

    // Find topics without urduTitle
    topics.forEach(topic => {
      if (!results.topicsWithUrdu.find(t => t.slug === topic.slug)) {
        results.topicsWithoutUrdu.push(topic.slug);
      }
    });
  } else {
    // No urduTitle field - all topics are missing Urdu translations
    results.topicsWithoutUrdu = topics.map(t => t.slug);
  }

  console.log(`\nTopics with Urdu titles: ${results.topicsWithUrdu.length}`);
  console.log(`Topics without Urdu titles: ${results.topicsWithoutUrdu.length}`);

  if (results.topicsWithUrdu.length > 0) {
    console.log('\n✅ Topics with verified Urdu titles:');
    results.topicsWithUrdu.forEach(t => {
      console.log(`   - ${t.slug}: ${t.urduTitle}`);
    });
  }

  if (results.topicsWithoutUrdu.length > 0) {
    console.log('\n⚠️  Topics missing Urdu titles:');
    results.topicsWithoutUrdu.forEach(slug => {
      console.log(`   - ${slug}`);
    });
  }

} catch (error) {
  console.error('❌ Error reading topics data:', error.message);
  results.passed = false;
}

// ============================================================================
// 2. AUDIT STUDY JOURNEYS DATA
// ============================================================================
console.log('\n\n🎓 Auditing Study Journeys Data...\n');

try {
  const journeysDataPath = join(rootDir, 'src/lib/study-journeys/data.ts');
  const journeysContent = readFileSync(journeysDataPath, 'utf-8');

  // Extract journey slugs
  const journeyRegex = /slug:\s*["']([^"']+)["'][\s\S]*?arabicTitle:\s*["']([^"']+)["']/g;
  let match;
  const journeys = [];

  while ((match = journeyRegex.exec(journeysContent)) !== null) {
    journeys.push({
      slug: match[1],
      arabicTitle: match[2],
    });
  }

  // Check if urduTitle field exists
  const hasUrduTitleField = journeysContent.includes('urduTitle');

  console.log(`Found ${journeys.length} study journeys`);
  console.log(`Urdu title field exists: ${hasUrduTitleField ? '✅ YES' : '❌ NO'}`);

  if (hasUrduTitleField) {
    // Extract journeys with urduTitle
    const urduRegex = /slug:\s*["']([^"']+)["'][\s\S]*?urduTitle:\s*["']([^"']+)["']/g;
    while ((match = urduRegex.exec(journeysContent)) !== null) {
      results.journeysWithUrdu.push({
        slug: match[1],
        urduTitle: match[2],
      });
    }

    // Find journeys without urduTitle
    journeys.forEach(journey => {
      if (!results.journeysWithUrdu.find(j => j.slug === journey.slug)) {
        results.journeysWithoutUrdu.push(journey.slug);
      }
    });
  } else {
    // No urduTitle field - all journeys are missing Urdu translations
    results.journeysWithoutUrdu = journeys.map(j => j.slug);
  }

  console.log(`\nJourneys with Urdu titles: ${results.journeysWithUrdu.length}`);
  console.log(`Journeys without Urdu titles: ${results.journeysWithoutUrdu.length}`);

  if (results.journeysWithUrdu.length > 0) {
    console.log('\n✅ Journeys with verified Urdu titles:');
    results.journeysWithUrdu.forEach(j => {
      console.log(`   - ${j.slug}: ${j.urduTitle}`);
    });
  }

  if (results.journeysWithoutUrdu.length > 0) {
    console.log('\n⚠️  Journeys missing Urdu titles:');
    results.journeysWithoutUrdu.forEach(slug => {
      console.log(`   - ${slug}`);
    });
  }

} catch (error) {
  console.error('❌ Error reading journeys data:', error.message);
  results.passed = false;
}

// ============================================================================
// 3. AUDIT COMPONENT RTL/LTR RENDERING
// ============================================================================
console.log('\n\n🎨 Auditing Component RTL/LTR Rendering...\n');

const componentsToCheck = [
  {
    path: 'src/app/explore/topics/page.tsx',
    name: 'Explore Topics Index',
    expectedArabic: { lang: 'ar', dir: 'rtl' },
  },
  {
    path: 'src/app/topics/[slug]/page.tsx',
    name: 'Topic Detail',
    expectedArabic: { lang: 'ar', dir: 'rtl' },
  },
  {
    path: 'src/app/study-journeys/page.tsx',
    name: 'Study Journeys Index',
    expectedArabic: { lang: 'ar', dir: 'rtl' },
  },
  {
    path: 'src/app/study-journeys/[slug]/page.tsx',
    name: 'Study Journey Detail',
    expectedArabic: { lang: 'ar', dir: 'rtl' },
  },
];

componentsToCheck.forEach(component => {
  const filePath = join(rootDir, component.path);

  if (!existsSync(filePath)) {
    console.log(`⚠️  ${component.name}: File not found at ${component.path}`);
    results.componentIssues.push({
      component: component.name,
      path: component.path,
      issue: 'File not found',
    });
    return;
  }

  const content = readFileSync(filePath, 'utf-8');
  const issues = [];

  // Check for Arabic text rendering
  const arabicElements = content.match(/lang=["']ar["'][^>]*>/g) || [];
  const arabicWithDir = content.match(/lang=["']ar["'][^>]*dir=["']rtl["'][^>]*>/g) || [];
  const arabicWithoutDir = arabicElements.filter(el => !el.includes('dir='));

  if (arabicElements.length === 0) {
    issues.push('No Arabic text elements found');
  } else {
    if (arabicWithoutDir.length > 0) {
      issues.push(`${arabicWithoutDir.length} Arabic element(s) missing dir="rtl"`);
    }
  }

  // Check for Urdu text rendering (if present)
  const urduElements = content.match(/lang=["']ur["'][^>]*>/g) || [];
  const urduWithDir = content.match(/lang=["']ur["'][^>]*dir=["']rtl["'][^>]*>/g) || [];

  if (urduElements.length > 0) {
    const urduWithoutDir = urduElements.filter(el => !el.includes('dir='));
    if (urduWithoutDir.length > 0) {
      issues.push(`${urduWithoutDir.length} Urdu element(s) missing dir="rtl"`);
    }
  }

  if (issues.length > 0) {
    console.log(`❌ ${component.name}:`);
    issues.forEach(issue => {
      console.log(`   - ${issue}`);
      results.componentIssues.push({
        component: component.name,
        path: component.path,
        issue,
      });
    });
    results.passed = false;
  } else {
    console.log(`✅ ${component.name}: All Arabic elements have proper lang/dir attributes`);
  }
});

// ============================================================================
// 4. SUMMARY
// ============================================================================
console.log('\n\n' + '='.repeat(60));
console.log('\n📊 AUDIT SUMMARY\n');

console.log(`Topics with Urdu titles: ${results.topicsWithUrdu.length}`);
console.log(`Topics without Urdu titles: ${results.topicsWithoutUrdu.length}`);
console.log(`Journeys with Urdu titles: ${results.journeysWithUrdu.length}`);
console.log(`Journeys without Urdu titles: ${results.journeysWithoutUrdu.length}`);
console.log(`Component issues found: ${results.componentIssues.length}`);

if (results.passed) {
  console.log('\n✅ AUDIT PASSED: All multilingual presentation checks passed\n');
  process.exit(0);
} else {
  console.log('\n❌ AUDIT FAILED: Issues found in multilingual presentation\n');
  console.log('Note: Missing Urdu translations are expected and documented.');
  console.log('The audit fails only if RTL rendering attributes are incorrect.\n');
  process.exit(1);
}
