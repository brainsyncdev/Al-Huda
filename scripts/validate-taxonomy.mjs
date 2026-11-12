#!/usr/bin/env node
/**
 * MFD-08 Taxonomy Validator
 * 
 * Validates canonical taxonomy data integrity:
 * - Unique IDs across all entity types
 * - Valid parent references
 * - No orphan entities
 * - No circular hierarchies
 * - Required fields present
 */

import fs from 'node:fs';
import path from 'node:path';

const TAXONOMY_DIR = path.join(process.cwd(), 'data', 'taxonomy');

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

function loadJSON(filename) {
  const filepath = path.join(TAXONOMY_DIR, filename);
  if (!fs.existsSync(filepath)) {
    error(`File not found: ${filename}`);
    return null;
  }
  try {
    const content = fs.readFileSync(filepath, 'utf-8');
    return JSON.parse(content);
  } catch (err) {
    error(`Failed to parse ${filename}: ${err.message}`);
    return null;
  }
}

function validateUniqueIds(entities, entityType, filename) {
  if (!entities) return;
  const ids = new Set();
  const duplicates = [];
  
  for (const entity of entities) {
    if (!entity.id) {
      error(`${entityType} missing id in ${filename}`);
      continue;
    }
    if (ids.has(entity.id)) {
      duplicates.push(entity.id);
    }
    ids.add(entity.id);
  }
  
  if (duplicates.length > 0) {
    error(`${entityType} has ${duplicates.length} duplicate IDs: ${duplicates.join(', ')}`);
  } else {
    ok(`${entityType}: ${ids.size} unique IDs`);
  }
  
  return ids;
}

function validateRequiredFields(entities, entityType, requiredFields) {
  if (!entities) return;
  
  let missingCount = 0;
  for (const entity of entities) {
    for (const field of requiredFields) {
      if (entity[field] === undefined || entity[field] === null || entity[field] === '') {
        missingCount++;
        if (missingCount <= 5) {
          error(`${entityType} ${entity.id || '(no id)'} missing required field: ${field}`);
        }
      }
    }
  }
  
  if (missingCount > 5) {
    error(`${entityType} has ${missingCount} total missing required fields`);
  } else if (missingCount === 0) {
    ok(`${entityType}: all required fields present`);
  }
}

function validateParentReferences(entities, entityType, parentIdField, validParentIds, filename) {
  if (!entities || !validParentIds) return;
  
  const orphans = [];
  for (const entity of entities) {
    const parentId = entity[parentIdField];
    if (parentId && !validParentIds.has(parentId)) {
      orphans.push(`${entity.id} -> ${parentId}`);
    }
  }
  
  if (orphans.length > 0) {
    error(`${entityType} has ${orphans.length} orphan references (invalid ${parentIdField}):`);
    orphans.slice(0, 5).forEach(o => console.error(`   ${o}`));
    if (orphans.length > 5) {
      console.error(`   ... and ${orphans.length - 5} more`);
    }
  } else {
    ok(`${entityType}: all ${parentIdField} references valid`);
  }
}

function validateNoCircularHierarchy(entities, entityType, parentIdField) {
  if (!entities) return;
  
  const entityMap = new Map(entities.map(e => [e.id, e]));
  const visited = new Set();
  const inStack = new Set();
  
  function hasCycle(entityId, stack = []) {
    if (inStack.has(entityId)) {
      return true;
    }
    if (visited.has(entityId)) {
      return false;
    }
    
    const entity = entityMap.get(entityId);
    if (!entity || !entity[parentIdField]) {
      return false;
    }
    
    inStack.add(entityId);
    const hasCycleResult = hasCycle(entity[parentIdField], [...stack, entityId]);
    inStack.delete(entityId);
    visited.add(entityId);
    
    return hasCycleResult;
  }
  
  let cycles = 0;
  for (const entity of entities) {
    if (hasCycle(entity.id)) {
      cycles++;
      if (cycles <= 3) {
        error(`${entityType} ${entity.id} has circular hierarchy`);
      }
    }
  }
  
  if (cycles === 0) {
    ok(`${entityType}: no circular hierarchies`);
  } else if (cycles > 3) {
    error(`${entityType} has ${cycles} total circular hierarchies`);
  }
}

// Main validation
console.log('🔍 MFD-08 Taxonomy Validator\n');

const domains = loadJSON('domains.json');
const dimensions = loadJSON('dimensions.json');
const subdimensions = loadJSON('subdimensions.json');
const topics = loadJSON('topics.json');
const relationships = loadJSON('relationships.json');

console.log('\n📊 Entity Counts:');
console.log(`   Domains: ${domains?.length || 0}`);
console.log(`   Dimensions: ${dimensions?.length || 0}`);
console.log(`   Subdimensions: ${subdimensions?.length || 0}`);
console.log(`   Topics: ${topics?.length || 0}`);
console.log(`   Relationships: ${relationships?.length || 0}`);

console.log('\n🔐 Unique ID Validation:');
const domainIds = validateUniqueIds(domains, 'Domains', 'domains.json');
const dimensionIds = validateUniqueIds(dimensions, 'Dimensions', 'dimensions.json');
const subdimensionIds = validateUniqueIds(subdimensions, 'Subdimensions', 'subdimensions.json');
const topicIds = validateUniqueIds(topics, 'Topics', 'topics.json');

console.log('\n📋 Required Fields Validation:');
validateRequiredFields(domains, 'Domain', ['id', 'title', 'description']);
validateRequiredFields(dimensions, 'Dimension', ['id', 'title', 'parentDomainId', 'description']);
validateRequiredFields(subdimensions, 'Subdimension', ['id', 'title', 'parentDimensionId', 'description']);
validateRequiredFields(topics, 'Topic', ['id', 'title', 'parentDomainId', 'parentDimensionId', 'description']);

console.log('\n🔗 Parent Reference Validation:');
validateParentReferences(dimensions, 'Dimensions', 'parentDomainId', domainIds, 'dimensions.json');
validateParentReferences(subdimensions, 'Subdimensions', 'parentDimensionId', dimensionIds, 'subdimensions.json');
validateParentReferences(topics, 'Topics', 'parentDomainId', domainIds, 'topics.json');
validateParentReferences(topics, 'Topics', 'parentDimensionId', dimensionIds, 'topics.json');

console.log('\n🔄 Circular Hierarchy Check:');
validateNoCircularHierarchy(dimensions, 'Dimensions', 'parentDomainId');
validateNoCircularHierarchy(subdimensions, 'Subdimensions', 'parentDimensionId');

console.log('\n🔗 Relationship Validation:');
if (relationships) {
  let brokenRefs = 0;
  for (const rel of relationships) {
    if (rel.sourceTopicId && !topicIds.has(rel.sourceTopicId)) {
      brokenRefs++;
      if (brokenRefs <= 3) {
        error(`Relationship ${rel.id} references non-existent sourceTopicId: ${rel.sourceTopicId}`);
      }
    }
    if (rel.targetTopicId && !topicIds.has(rel.targetTopicId)) {
      brokenRefs++;
      if (brokenRefs <= 3) {
        error(`Relationship ${rel.id} references non-existent targetTopicId: ${rel.targetTopicId}`);
      }
    }
  }
  if (brokenRefs === 0) {
    ok(`Relationships: all topic references valid`);
  } else {
    error(`Relationships: ${brokenRefs} broken topic references`);
  }
}

console.log('\n' + '='.repeat(60));
if (issues === 0) {
  console.log(`✅ Taxonomy validation PASSED (${warnings} warnings)`);
  process.exit(0);
} else {
  console.log(`❌ Taxonomy validation FAILED (${issues} issues, ${warnings} warnings)`);
  process.exit(1);
}
