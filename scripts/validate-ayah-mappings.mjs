#!/usr/bin/env node
/**
 * MFD-08 Ayah Mapping Validator
 * 
 * Validates topic-ayah-mappings.json integrity:
 * - Valid surah numbers (1-114)
 * - Valid ayah numbers (within surah range)
 * - Valid topic IDs
 * - Unique mapping IDs
 * - Required fields present
 * - Valid mapping types
 */

import fs from 'node:fs';
import path from 'node:path';

const TAXONOMY_DIR = path.join(process.cwd(), 'data', 'taxonomy');
const QURAN_PATH = path.join(process.cwd(), 'node_modules', 'quran-json', 'dist', 'quran.json');

let issues = 0;
let warnings = 0;

function error(msg) {
  console.error(`❌ ${msg}`);
  issues++;
}

function warn(msg) {
  console.warn(`⚠️  ${msg}`);
  warnings++;
}

function ok(msg) {
  console.log(`✅ ${msg}`);
}

function loadJSON(filepath) {
  if (!fs.existsSync(filepath)) {
    error(`File not found: ${filepath}`);
    return null;
  }
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to parse ${filepath}: ${err.message}`);
    return null;
  }
}

// Load Quran dataset for verse counts
const quran = loadJSON(QURAN_PATH);
if (!quran) {
  console.error('Cannot proceed without Quran dataset');
  process.exit(1);
}

const surahVerseCounts = new Map();
for (const surah of quran) {
  surahVerseCounts.set(surah.id, surah.verses.length);
}

// Load mappings
const mappings = loadJSON(path.join(TAXONOMY_DIR, 'topic-ayah-mappings.json'));
if (!mappings) {
  process.exit(1);
}

// Load topics for validation
const topics = loadJSON(path.join(TAXONOMY_DIR, 'topics.json'));
if (!topics) {
  process.exit(1);
}

const topicIds = new Set(topics.map(t => t.id));

console.log('🔍 MFD-08 Ayah Mapping Validator\n');
console.log(`📊 Total mappings: ${mappings.length}`);
console.log(`📊 Total topics: ${topics.length}`);
console.log(`📊 Quran surahs: ${quran.length}`);

console.log('\n🔐 Unique ID Validation:');
const mappingIds = new Set();
const duplicateIds = [];
for (const mapping of mappings) {
  if (mappingIds.has(mapping.id)) {
    duplicateIds.push(mapping.id);
  }
  mappingIds.add(mapping.id);
}
if (duplicateIds.length > 0) {
  error(`Found ${duplicateIds.length} duplicate mapping IDs: ${duplicateIds.slice(0, 5).join(', ')}`);
} else {
  ok(`All ${mappingIds.size} mapping IDs are unique`);
}

console.log('\n🔗 Topic Reference Validation:');
let invalidTopicRefs = 0;
for (const mapping of mappings) {
  if (!topicIds.has(mapping.topicId)) {
    invalidTopicRefs++;
    if (invalidTopicRefs <= 3) {
      error(`Mapping ${mapping.id} references non-existent topic: ${mapping.topicId}`);
    }
  }
}
if (invalidTopicRefs === 0) {
  ok('All topic references are valid');
} else {
  error(`${invalidTopicRefs} mappings reference non-existent topics`);
}

console.log('\n📖 Surah & Ayah Validation:');
let invalidSurahs = 0;
let invalidAyahs = 0;
let invalidRanges = 0;

for (const mapping of mappings) {
  // Check surah number
  if (mapping.surahNumber < 1 || mapping.surahNumber > 114) {
    invalidSurahs++;
    if (invalidSurahs <= 3) {
      error(`Mapping ${mapping.id} has invalid surah number: ${mapping.surahNumber}`);
    }
    continue;
  }
  
  const maxVerses = surahVerseCounts.get(mapping.surahNumber);
  if (!maxVerses) {
    error(`Mapping ${mapping.id} references surah ${mapping.surahNumber} not found in dataset`);
    continue;
  }
  
  // Check ayah numbers
  if (mapping.ayahStart < 1 || mapping.ayahStart > maxVerses) {
    invalidAyahs++;
    if (invalidAyahs <= 3) {
      error(`Mapping ${mapping.id} has invalid ayahStart: ${mapping.ayahStart} (surah ${mapping.surahNumber} has ${maxVerses} verses)`);
    }
  }
  
  if (mapping.ayahEnd < mapping.ayahStart || mapping.ayahEnd > maxVerses) {
    invalidRanges++;
    if (invalidRanges <= 3) {
      error(`Mapping ${mapping.id} has invalid ayahEnd: ${mapping.ayahEnd} (start: ${mapping.ayahStart}, max: ${maxVerses})`);
    }
  }
}

if (invalidSurahs === 0) ok('All surah numbers are valid (1-114)');
else error(`${invalidSurahs} mappings have invalid surah numbers`);

if (invalidAyahs === 0) ok('All ayah numbers are within valid ranges');
else error(`${invalidAyahs} mappings have invalid ayah numbers`);

if (invalidRanges === 0) ok('All ayah ranges are valid (end >= start)');
else error(`${invalidRanges} mappings have invalid ayah ranges`);

console.log('\n📋 Required Fields Validation:');
const requiredFields = ['id', 'topicId', 'surahNumber', 'ayahStart', 'ayahEnd', 'mappingType', 'rationale', 'provenance'];
let missingFields = 0;
for (const mapping of mappings) {
  for (const field of requiredFields) {
    if (mapping[field] === undefined || mapping[field] === null || mapping[field] === '') {
      missingFields++;
      if (missingFields <= 5) {
        error(`Mapping ${mapping.id || '(no id)'} missing required field: ${field}`);
      }
    }
  }
}
if (missingFields === 0) {
  ok('All mappings have required fields');
} else {
  error(`${missingFields} total missing required fields`);
}

console.log('\n🏷️  Mapping Type Validation:');
const validTypes = [
  'DIRECT_REFERENCE',
  'EXPLICIT_INSTRUCTION',
  'THEMATIC_REFERENCE',
  'GENERAL_QURANIC_PRINCIPLE',
  'PROPHETIC_NARRATIVE',
  'TAFSIR_SUPPORTED',
  'TAFFSIR_SUPPORTED', // legacy typo
  'EDITORIAL_CROSS_REFERENCE',
  'CONTEMPORARY_APPLICATION'
];
const typeDistribution = new Map();
let invalidTypes = 0;

for (const mapping of mappings) {
  const type = mapping.mappingType;
  typeDistribution.set(type, (typeDistribution.get(type) || 0) + 1);
  
  if (!validTypes.includes(type)) {
    invalidTypes++;
    if (invalidTypes <= 3) {
      error(`Mapping ${mapping.id} has invalid mapping type: ${type}`);
    }
  }
}

if (invalidTypes === 0) {
  ok(`All mapping types are valid`);
} else {
  error(`${invalidTypes} mappings have invalid types`);
}

console.log('\n📊 Mapping Type Distribution:');
for (const [type, count] of [...typeDistribution.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`   ${type}: ${count}`);
}

console.log('\n📊 Coverage Statistics:');
const mappedTopics = new Set(mappings.map(m => m.topicId));
console.log(`   Topics with mappings: ${mappedTopics.size} / ${topics.length}`);
console.log(`   Topics without mappings: ${topics.length - mappedTopics.size}`);

// Calculate expanded ayat
let expandedAyat = 0;
const uniqueAyat = new Set();
for (const mapping of mappings) {
  const rangeSize = mapping.ayahEnd - mapping.ayahStart + 1;
  expandedAyat += rangeSize;
  for (let ayah = mapping.ayahStart; ayah <= mapping.ayahEnd; ayah++) {
    uniqueAyat.add(`${mapping.surahNumber}:${ayah}`);
  }
}
console.log(`   Expanded ayat (sum of ranges): ${expandedAyat}`);
console.log(`   Unique ayat referenced: ${uniqueAyat.size}`);

const surahsReferenced = new Set(mappings.map(m => m.surahNumber));
console.log(`   Surahs referenced: ${surahsReferenced.size} / 114`);

console.log('\n' + '='.repeat(60));
if (issues === 0) {
  console.log(`✅ Ayah mapping validation PASSED (${warnings} warnings)`);
  process.exit(0);
} else {
  console.log(`❌ Ayah mapping validation FAILED (${issues} issues, ${warnings} warnings)`);
  process.exit(1);
}
