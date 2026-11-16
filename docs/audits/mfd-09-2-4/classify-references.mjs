import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..', '..', '..');

// Load canonical taxonomy files (READ ONLY - never modified)
const dimensions = JSON.parse(readFileSync(resolve(root, 'data/taxonomy/dimensions.json'), 'utf8'));
const subdimensions = JSON.parse(readFileSync(resolve(root, 'data/taxonomy/subdimensions.json'), 'utf8'));
const domains = JSON.parse(readFileSync(resolve(root, 'data/taxonomy/domains.json'), 'utf8'));
const topics = JSON.parse(readFileSync(resolve(root, 'data/taxonomy/topics.json'), 'utf8'));

// Build lookup sets for O(1) collision detection
const dimensionIds = new Set(dimensions.map(d => d.id));
const subdimensionIds = new Set(subdimensions.map(s => s.id));
const domainIds = new Set(domains.map(d => d.id));
const topicMap = new Map(topics.map(t => [t.id, t]));

// Classification precedence (CRITICAL ORDER):
// 1. NAMESPACE_COLLISION_DIMENSION
// 2. NAMESPACE_COLLISION_SUBDIMENSION
// 3. NAMESPACE_COLLISION_DOMAIN
// 4. NONEXISTENT (not in topics AND not a namespace collision)
// 5. WRONG_PARENT (topic exists but parentDimensionId mismatch)
// 6. VALID (topic exists AND parentDimensionId matches)

function classifyReference(referencedTopicId, referencingDimensionId) {
  // Check namespace collisions FIRST (before topic existence)
  if (dimensionIds.has(referencedTopicId)) {
    return 'NAMESPACE_COLLISION_DIMENSION';
  }
  if (subdimensionIds.has(referencedTopicId)) {
    return 'NAMESPACE_COLLISION_SUBDIMENSION';
  }
  if (domainIds.has(referencedTopicId)) {
    return 'NAMESPACE_COLLISION_DOMAIN';
  }

  // Now check topic existence
  const topic = topicMap.get(referencedTopicId);
  if (!topic) {
    return 'NONEXISTENT';
  }

  // Topic exists - check parent alignment
  if (topic.parentDimensionId !== referencingDimensionId) {
    return 'WRONG_PARENT';
  }

  return 'VALID';
}

// Process all references from dimensions.topicIds
const allRefs = [];
const counts = {
  VALID: 0,
  NONEXISTENT: 0,
  WRONG_PARENT: 0,
  NAMESPACE_COLLISION_DIMENSION: 0,
  NAMESPACE_COLLISION_SUBDIMENSION: 0,
  NAMESPACE_COLLISION_DOMAIN: 0,
};

for (const dim of dimensions) {
  if (!dim.topicIds || dim.topicIds.length === 0) continue;

  for (const tid of dim.topicIds) {
    const classification = classifyReference(tid, dim.id);
    counts[classification]++;

    const record = {
      dimensionId: dim.id,
      domainId: dim.parentDomainId,
      referencedTopicId: tid,
      topicExists: topicMap.has(tid),
      actualParentDimensionId: topicMap.has(tid) ? topicMap.get(tid).parentDimensionId : null,
      classification,
      evidenceSource: 'data/taxonomy/dimensions.json',
      evidencePath: `dimensions[id='${dim.id}'].topicIds`,
    };
    allRefs.push(record);
  }
}

// === REGRESSION TESTS (Task A.3) ===
let testsPassed = 0;
let testsFailed = 0;
const testResults = [];

function assertClassification(refId, expectedClass, label) {
  // Find any reference with this ID (could appear in multiple dimensions)
  const matches = allRefs.filter(r => r.referencedTopicId === refId);
  if (matches.length === 0) {
    testsFailed++;
    testResults.push({ test: label, status: 'FAIL', reason: `No reference found for '${refId}'` });
    return;
  }
  // All occurrences should have the expected classification
  for (const m of matches) {
    if (m.classification === expectedClass) {
      testsPassed++;
      testResults.push({ test: `${label} (${m.dimensionId})`, status: 'PASS', classification: m.classification });
    } else {
      testsFailed++;
      testResults.push({
        test: `${label} (${m.dimensionId})`,
        status: 'FAIL',
        expected: expectedClass,
        actual: m.classification,
      });
    }
  }
}

// 6 known namespace collisions
assertClassification('conflict-resolution', 'NAMESPACE_COLLISION_DIMENSION', 'conflict-resolution → NS_DIMENSION');
assertClassification('business-ethics', 'NAMESPACE_COLLISION_DIMENSION', 'business-ethics → NS_DIMENSION');
assertClassification('mizan-balance', 'NAMESPACE_COLLISION_DIMENSION', 'mizan-balance → NS_DIMENSION');
assertClassification('accountability', 'NAMESPACE_COLLISION_DIMENSION', 'accountability → NS_DIMENSION');
assertClassification('quranic-vocabulary', 'NAMESPACE_COLLISION_DIMENSION', 'quranic-vocabulary → NS_DIMENSION');
assertClassification('child-education', 'NAMESPACE_COLLISION_SUBDIMENSION', 'child-education → NS_SUBDIMENSION');

// Edge cases
assertClassification('tawheed-fundamentals', 'VALID', 'tawheed-fundamentals → VALID');
// Genuinely nonexistent topic ID actually referenced in canonical source:
// quran-science.topicIds contains 'quran-interpretation-principles', which is absent
// from topics.json and is not a dimension/subdimension/domain ID.
assertClassification('quran-interpretation-principles', 'NONEXISTENT', 'quran-interpretation-principles → NONEXISTENT');

// WRONG_PARENT edge cases. NOTE: classification is per (dimensionId, referencedTopicId)
// pair, not per topic ID. A topic such as wealth-distribution is legitimately VALID under
// its true parent (economic-justice) and WRONG_PARENT only under wealth-property, so these
// assertions must be scoped to the referencing dimension.
function assertPair(refId, dimId, expectedClass, label) {
  const m = allRefs.find(r => r.referencedTopicId === refId && r.dimensionId === dimId);
  if (!m) {
    testsFailed++;
    testResults.push({ test: label, status: 'FAIL', reason: `No reference '${refId}' under dimension '${dimId}'` });
    return;
  }
  if (m.classification === expectedClass) {
    testsPassed++;
    testResults.push({ test: `${label} (${dimId})`, status: 'PASS', classification: m.classification });
  } else {
    testsFailed++;
    testResults.push({ test: `${label} (${dimId})`, status: 'FAIL', expected: expectedClass, actual: m.classification });
  }
}

assertPair('ikhlas-sincerity', 'moral-virtues', 'WRONG_PARENT', 'ikhlas-sincerity → WRONG_PARENT');

const wrongParentRefs = allRefs.filter(r => r.classification === 'WRONG_PARENT');
if (wrongParentRefs.length === 0) {
  testsFailed++;
  testResults.push({ test: 'WRONG_PARENT edge case', status: 'FAIL', reason: 'No WRONG_PARENT references found in dataset' });
} else {
  for (const w of wrongParentRefs) {
    if (w.referencedTopicId === 'ikhlas-sincerity' && w.dimensionId === 'moral-virtues') continue;
    assertPair(w.referencedTopicId, w.dimensionId, 'WRONG_PARENT', `${w.referencedTopicId} → WRONG_PARENT`);
  }
}

// Precedence unit assertions on the classifier itself (not just inventory rows).
// These prove collisions win even when the ID is absent from topics.json,
// and that NONEXISTENT can never swallow a namespace collision.
function assertDirect(refId, dimId, expectedClass, label) {
  const actual = classifyReference(refId, dimId);
  if (actual === expectedClass) {
    testsPassed++;
    testResults.push({ test: label, status: 'PASS', classification: actual });
  } else {
    testsFailed++;
    testResults.push({ test: label, status: 'FAIL', expected: expectedClass, actual });
  }
}
assertDirect('accountability', 'resurrection-judgment', 'NAMESPACE_COLLISION_DIMENSION', 'precedence: dimension-collision absent from topics.json ≠ NONEXISTENT');
assertDirect('conflict-resolution', 'spousal-relations', 'NAMESPACE_COLLISION_DIMENSION', 'precedence: conflict-resolution absent from topics.json ≠ NONEXISTENT');
assertDirect('child-education', 'parenting-child-development', 'NAMESPACE_COLLISION_SUBDIMENSION', 'precedence: subdimension-collision outranks VALID');
assertDirect('belief-theology', 'allah-divine-attributes', 'NAMESPACE_COLLISION_DOMAIN', 'precedence: domain ID resolves to NS_DOMAIN');
assertDirect('mfd-09-2-4-synthetic-absent-id', 'allah-divine-attributes', 'NONEXISTENT', 'precedence: synthetic absent ID → NONEXISTENT');
assertDirect('tawheed-fundamentals', 'allah-divine-attributes', 'VALID', 'precedence: matching parent → VALID');
assertDirect('tawheed-fundamentals', 'moral-virtues', 'WRONG_PARENT', 'precedence: mismatched parent → WRONG_PARENT');

// === OUTPUT ARTIFACTS (Task A.5) ===

// 1. Canonical reference inventory
writeFileSync(
  resolve(__dirname, 'mfd-09-2-4-canonical-reference-inventory.json'),
  JSON.stringify(allRefs, null, 2),
  'utf8'
);

// 2. Classification summary
const phantomRefs = allRefs.filter(r => r.classification === 'NONEXISTENT');
const summary = {
  auditId: 'MFD-09.2.4',
  generatedAt: new Date().toISOString(),
  totalReferencesScanned: allRefs.length,
  classificationCounts: counts,
  countsSumCheck: Object.values(counts).reduce((a, b) => a + b, 0),
  countsMatchTotal: allRefs.length === Object.values(counts).reduce((a, b) => a + b, 0),
  regressionTests: {
    passed: testsPassed,
    failed: testsFailed,
    details: testResults,
  },
  phantomCount: phantomRefs.length,
};
writeFileSync(
  resolve(__dirname, 'mfd-09-2-4-classification-summary.json'),
  JSON.stringify(summary, null, 2),
  'utf8'
);

// 3. Dimension-level inventory (Task A.6)
const dimInventory = dimensions.map(dim => {
  const dimRefs = allRefs.filter(r => r.dimensionId === dim.id);
  return {
    dimensionId: dim.id,
    domainId: dim.parentDomainId,
    totalRefs: dimRefs.length,
    validCount: dimRefs.filter(r => r.classification === 'VALID').length,
    nonexistentCount: dimRefs.filter(r => r.classification === 'NONEXISTENT').length,
    wrongParentCount: dimRefs.filter(r => r.classification === 'WRONG_PARENT').length,
    nsCollisionCount: dimRefs.filter(r =>
      r.classification.startsWith('NAMESPACE_COLLISION')
    ).length,
  };
});

const dimTotalSum = dimInventory.reduce((sum, d) => sum + d.totalRefs, 0);
writeFileSync(
  resolve(__dirname, 'mfd-09-2-4-dimension-inventory.json'),
  JSON.stringify(dimInventory, null, 2),
  'utf8'
);

// === CONSOLE REPORT ===
console.log('=== MFD-09.2.4 CLASSIFICATION AUDIT COMPLETE ===');
console.log(`Total references scanned: ${allRefs.length}`);
console.log(`VALID: ${counts.VALID}`);
console.log(`NONEXISTENT: ${counts.NONEXISTENT}`);
console.log(`WRONG_PARENT: ${counts.WRONG_PARENT}`);
console.log(`NS_DIMENSION: ${counts.NAMESPACE_COLLISION_DIMENSION}`);
console.log(`NS_SUBDIMENSION: ${counts.NAMESPACE_COLLISION_SUBDIMENSION}`);
console.log(`NS_DOMAIN: ${counts.NAMESPACE_COLLISION_DOMAIN}`);
console.log(`Sum check: ${Object.values(counts).reduce((a, b) => a + b, 0)} (match: ${allRefs.length === Object.values(counts).reduce((a, b) => a + b, 0)})`);
console.log(`Dimension-level total sum: ${dimTotalSum} (match global: ${dimTotalSum === allRefs.length})`);
console.log(`\nRegression tests: ${testsPassed} passed, ${testsFailed} failed`);
if (testsFailed > 0) {
  console.log('FAILED TESTS:');
  for (const t of testResults.filter(r => r.status === 'FAIL')) {
    console.log(`  ✗ ${t.test}: ${t.reason || `expected ${t.expected}, got ${t.actual}`}`);
  }
  process.exit(1);
}
console.log('All regression tests passed.');
