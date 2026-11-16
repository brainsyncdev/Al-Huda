#!/usr/bin/env node
/**
 * MFD-09.2 Automated Integrity Validator
 * Validates canonical audit datasets against production source data.
 * Exit code 0 = all checks passed, non-zero = critical failure.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

let passed = 0;
let failed = 0;
const failures = [];

function check(name, condition, detail) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}${detail ? ': ' + detail : ''}`);
    failed++;
    failures.push({ name, detail });
  }
}

// Helper to strip BOM before parsing
function readJson(filePath) {
  let content = readFileSync(resolve(root, filePath), 'utf8');
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  return JSON.parse(content);
}

// Load source data
const mappings = readJson('data/taxonomy/topic-ayah-mappings.json');
const domains = readJson('data/taxonomy/domains.json');
const dimensions = readJson('data/taxonomy/dimensions.json');
const subdimensions = readJson('data/taxonomy/subdimensions.json');
const topics = readJson('data/taxonomy/topics.json');
const relationships = readJson('data/taxonomy/relationships.json');

// Load audit datasets
const mappingAudit = readJson('data/audit/mfd-09-2-mapping-integrity.json');
const taxonomyAudit = readJson('data/audit/mfd-09-2-taxonomy-integrity.json');

console.log('\n=== MFD-09.2 VALIDATION ===\n');

// --- Mapping Validation ---
console.log('Mapping Validation:');
check('Mapping record count', mappings.length === 789, `got ${mappings.length}`);
check('Audit totalRecords matches', mappingAudit.totalRecords === mappings.length);

// Expanded occurrences
let expandedCalc = 0;
const uniqueMap = new Map();
for (const m of mappings) {
  const exp = m.ayahEnd - m.ayahStart + 1;
  expandedCalc += exp;
  for (let a = m.ayahStart; a <= m.ayahEnd; a++) {
    const key = `${m.surahNumber}:${a}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, new Set());
    uniqueMap.get(key).add(m.topicId);
  }
}
check('Expanded ayah occurrences', expandedCalc === 1886, `calculated ${expandedCalc}`);
check('Audit expandedOccurrences matches', mappingAudit.expandedOccurrences === expandedCalc);
check('Unique ayat count', uniqueMap.size === 1550, `calculated ${uniqueMap.size}`);
check('Audit uniqueAyat matches', mappingAudit.uniqueAyat === uniqueMap.size);

// Overlaps
let multiTopic = 0, threePlus = 0, maxOverlap = 0;
for (const [, topicSet] of uniqueMap) {
  const c = topicSet.size;
  if (c > 1) multiTopic++;
  if (c >= 3) threePlus++;
  if (c > maxOverlap) maxOverlap = c;
}
check('Multi-topic ayat (unique)', multiTopic === 230, `calculated ${multiTopic}`);
check('3+ topic ayat', threePlus === 74, `calculated ${threePlus}`);
check('Max overlap', maxOverlap === 6, `calculated ${maxOverlap}`);
check('Audit threePlusTopicAyat matches', mappingAudit.threePlusTopicAyat === threePlus);
check('Audit maxOverlap matches', mappingAudit.maxOverlap === maxOverlap);

// Verdicts
const verdictSum = Object.values(mappingAudit.verdictDistribution).reduce((a, b) => a + b, 0);
check('Verdict sum equals 789', verdictSum === 789, `sum=${verdictSum}`);
check('ACCEPT_AS_DIRECT count', mappingAudit.verdictDistribution.ACCEPT_AS_DIRECT === 661);
check('ACCEPT_AS_THEMATIC count', mappingAudit.verdictDistribution.ACCEPT_AS_THEMATIC === 128);

// Evidence
check('No tafsir attached', mappingAudit.evidenceIntegrity.tafsirAttachedCount === 0);
check('No scholar reviewed', mappingAudit.evidenceIntegrity.scholarReviewedCount === 0);
check('All translation supported', mappingAudit.evidenceIntegrity.translationSupportedCount === 789);

// Invalid ranges
check('No invalid ranges', mappingAudit.invalidRanges.length === 0);
check('No duplicate IDs', mappingAudit.duplicateIds.length === 0);

console.log('\nTaxonomy Validation:');
check('Domain count', domains.length === 20, `got ${domains.length}`);
check('Dimension count', dimensions.length === 103, `got ${dimensions.length}`);
check('Subdimension count', subdimensions.length === 25, `got ${subdimensions.length}`);
check('Topic count', topics.length === 184, `got ${topics.length}`);
check('Relationship count', relationships.length === 150, `got ${relationships.length}`);

// Entity counts match audit
check('Audit entityCounts.domains', taxonomyAudit.entityCounts.domains === domains.length);
check('Audit entityCounts.dimensions', taxonomyAudit.entityCounts.dimensions === dimensions.length);
check('Audit entityCounts.topics', taxonomyAudit.entityCounts.topics === topics.length);
check('Audit entityCounts.relationships', taxonomyAudit.entityCounts.relationships === relationships.length);

// Topic-side coverage distribution sums to 103
const topicDistSum = Object.values(taxonomyAudit.topicSideDistribution).reduce((a, b) => a + b, 0);
check('Topic-side distribution sums to 103', topicDistSum === 103, `sum=${topicDistSum}`);

// Dimension-side coverage distribution sums to 103
const dimDistSum = Object.values(taxonomyAudit.dimensionSideDistribution).reduce((a, b) => a + b, 0);
check('Dimension-side distribution sums to 103', dimDistSum === 103, `sum=${dimDistSum}`);

// Independent topic-side coverage verification
const topicByDim = new Map();
for (const t of topics) {
  const d = t.parentDimensionId;
  topicByDim.set(d, (topicByDim.get(d) || 0) + 1);
}
let zeroT = 0, oneT = 0, twoT = 0, tfT = 0, fpT = 0;
for (const dim of dimensions) {
  const c = topicByDim.get(dim.id) || 0;
  if (c === 0) zeroT++;
  else if (c === 1) oneT++;
  else if (c === 2) twoT++;
  else if (c <= 4) tfT++;
  else fpT++;
}
check('Topic-side ZERO_TOPICS', taxonomyAudit.topicSideDistribution.ZERO_TOPICS === zeroT, `audit=${taxonomyAudit.topicSideDistribution.ZERO_TOPICS} calc=${zeroT}`);
check('Topic-side ONE_TOPIC', taxonomyAudit.topicSideDistribution.ONE_TOPIC === oneT, `audit=${taxonomyAudit.topicSideDistribution.ONE_TOPIC} calc=${oneT}`);
check('Topic-side TWO_TOPICS', taxonomyAudit.topicSideDistribution.TWO_TOPICS === twoT, `audit=${taxonomyAudit.topicSideDistribution.TWO_TOPICS} calc=${twoT}`);
check('Topic-side THREE_TO_FOUR', taxonomyAudit.topicSideDistribution.THREE_TO_FOUR_TOPICS === tfT, `audit=${taxonomyAudit.topicSideDistribution.THREE_TO_FOUR_TOPICS} calc=${tfT}`);
check('Topic-side FIVE_OR_MORE', taxonomyAudit.topicSideDistribution.FIVE_OR_MORE_TOPICS === fpT, `audit=${taxonomyAudit.topicSideDistribution.FIVE_OR_MORE_TOPICS} calc=${fpT}`);

// Relationship validation
let relValid = 0;
const allIds = new Set([
  ...domains.map(d => d.id),
  ...dimensions.map(d => d.id),
  ...subdimensions.map(s => s.id),
  ...topics.map(t => t.id)
]);
for (const r of relationships) {
  if (allIds.has(r.sourceId) && allIds.has(r.targetId)) relValid++;
}
check('All relationship endpoints valid', relValid === 150, `valid=${relValid}`);

// Proposal verification
check('Proposal count', taxonomyAudit.proposalVerification.totalCount === 60);

// Production protection
console.log('\nProduction Protection:');
check('Phantom references documented', taxonomyAudit.phantomReferences.length > 0, `${taxonomyAudit.phantomReferences.length} phantoms found`);
check('Bidirectional discrepancies documented', taxonomyAudit.bidirectionalCoverage.some(d => d.coverageDiscrepancy));

console.log(`\n========================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`========================================\n`);

if (failed > 0) {
  console.log('FAILURES:');
  for (const f of failures) {
    console.log(`  - ${f.name}: ${f.detail || 'no detail'}`);
  }
  process.exit(1);
} else {
  console.log('✅ All checks passed.');
  process.exit(0);
}
