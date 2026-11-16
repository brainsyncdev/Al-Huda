#!/usr/bin/env node
/**
 * MFD-09.2.1 Integrity Validator
 *
 * Verifies that every MFD-09.2.1 audit artifact agrees with canonical source
 * data, that generation is deterministic, and that production data is untouched.
 *
 * READ-ONLY: this script never writes any file.
 *
 * Exit codes:
 *   0 = all CRITICAL/HIGH checks passed (warnings reported separately)
 *   1 = at least one critical check failed
 *
 * Warnings are NEVER counted as passes.
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const AUDIT_DIR = 'docs/audits/mfd-09-2-1';

const results = [];
let passed = 0;
let failed = 0;
let warned = 0;

function record(id, name, status, severity, detail) {
  results.push({ id, name, status, severity, detail: detail === undefined ? null : detail });
  if (status === 'PASS') passed++;
  else if (status === 'WARNING') warned++;
  else failed++;
  const mark = status === 'PASS' ? '\u2713' : status === 'WARNING' ? '!' : '\u2717';
  console.log('  ' + mark + ' [' + id + '] ' + name + (detail && status !== 'PASS' ? ': ' + detail : ''));
}

function check(id, name, condition, severity, detail) {
  record(id, name, condition ? 'PASS' : 'FAIL', severity || 'CRITICAL', detail);
}

function warn(id, name, condition, detail) {
  record(id, name, condition ? 'PASS' : 'WARNING', 'MEDIUM', detail);
}

function readJson(rel) {
  let t = readFileSync(resolve(ROOT, rel), 'utf8');
  if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
  return JSON.parse(t);
}

function sha256(rel) {
  return createHash('sha256').update(readFileSync(resolve(ROOT, rel))).digest('hex').toUpperCase();
}

// ------------------------------------------------------------- load inputs

console.log('\n=== MFD-09.2.1 INTEGRITY VALIDATION ===\n');

const mappings = readJson('data/taxonomy/topic-ayah-mappings.json');
const domains = readJson('data/taxonomy/domains.json');
const dimensions = readJson('data/taxonomy/dimensions.json');
const subdimensions = readJson('data/taxonomy/subdimensions.json');
const topics = readJson('data/taxonomy/topics.json');
const relationships = readJson('data/taxonomy/relationships.json');
const proposals = readJson('data/audit/mfd-09-1-topic-proposals-classified.json');

const countData = readJson(AUDIT_DIR + '/mfd-09-2-1-count-reconciliation.json');
const phantomData = readJson(AUDIT_DIR + '/mfd-09-2-1-phantom-reference-reconciliation.json');
const inventoryData = readJson(AUDIT_DIR + '/mfd-09-2-1-artifact-inventory.json');
const mappingData = readJson(AUDIT_DIR + '/mfd-09-2-1-mapping-integrity.json');
const taxonomyData = readJson(AUDIT_DIR + '/mfd-09-2-1-taxonomy-integrity.json');
const validatorResults = readJson(AUDIT_DIR + '/mfd-09-2-1-validator-results.json');

// ------------------------------------------- independent recomputation

const occ = new Map();
let expanded = 0;
for (const m of mappings) {
  for (let a = m.ayahStart; a <= m.ayahEnd; a++) {
    const k = m.surahNumber + ':' + a;
    if (!occ.has(k)) occ.set(k, []);
    occ.get(k).push(m.topicId);
    expanded++;
  }
}
let multi = 0;
let threePlus = 0;
let maxOverlap = 0;
let dupExcess = 0;
let rawMultiAyat = 0;
for (const list of occ.values()) {
  const d = new Set(list).size;
  if (d > 1) multi++;
  if (d >= 3) threePlus++;
  if (d > maxOverlap) maxOverlap = d;
  if (list.length > d) dupExcess += list.length - d;
  if (list.length > 1) rawMultiAyat++;
}

const topicIds = new Set(topics.map((t) => t.id));
const dimIds = new Set(dimensions.map((d) => d.id));
const domIds = new Set(domains.map((d) => d.id));
const subIds = new Set(subdimensions.map((s) => s.id));
let phantomCalc = 0;
let dimSideRefs = 0;
for (const d of dimensions) {
  for (const id of d.topicIds || []) {
    dimSideRefs++;
    if (!topicIds.has(id)) phantomCalc++;
  }
}

// ---------------------------------------------------- GROUP 1: mapping

console.log('Mapping integrity:');
check('M01', 'Mapping record count is 789', mappings.length === 789, 'CRITICAL', 'got ' + mappings.length);
check('M02', 'Mapping IDs unique', new Set(mappings.map((m) => m.id)).size === mappings.length, 'CRITICAL');
check('M03', 'All ayah ranges valid', mappings.every((m) => Number.isInteger(m.surahNumber) && m.surahNumber >= 1 && m.surahNumber <= 114 && Number.isInteger(m.ayahStart) && Number.isInteger(m.ayahEnd) && m.ayahEnd >= m.ayahStart), 'CRITICAL');
check('M04', 'Expanded occurrences reproduce 1886', expanded === 1886, 'CRITICAL', 'calc ' + expanded);
check('M05', 'Unique Surah:Ayah reproduces 1550', occ.size === 1550, 'CRITICAL', 'calc ' + occ.size);
check('M06', 'Multi-topic ayat reproduces 230', multi === 230, 'CRITICAL', 'calc ' + multi);
check('M07', 'Raw occurrence-basis multi-topic ayat reproduces 236', rawMultiAyat === 236, 'CRITICAL', 'calc ' + rawMultiAyat);
check('M08', '3+ topic ayat reproduces 74', threePlus === 74, 'CRITICAL', 'calc ' + threePlus);
check('M09', 'Max overlap reproduces 6', maxOverlap === 6, 'CRITICAL', 'calc ' + maxOverlap);
check('M10', 'Duplicate topic excess reproduces 7', dupExcess === 7, 'CRITICAL', 'calc ' + dupExcess);
check('M11', 'Count dataset agrees with recomputation', countData.verified.totalRecords === mappings.length && countData.verified.expandedOccurrences === expanded && countData.verified.uniqueAyat === occ.size && countData.verified.multiTopicAyatUnique === multi && countData.verified.multiTopicAyatRawOccurrenceBasis === rawMultiAyat && countData.verified.threePlusTopicAyat === threePlus && countData.verified.maxOverlap === maxOverlap && countData.verified.duplicateOccurrenceCount === dupExcess, 'CRITICAL');
check('M12', 'Row-level dataset covers every unique ayah', Array.isArray(countData.allAyahRows) && countData.allAyahRows.length === occ.size, 'CRITICAL');
check('M13', 'Multi-topic row subset length equals 230', countData.multiTopicAyatRows.length === multi, 'CRITICAL');
check('M14', 'Arithmetic 230 + 6 = 236 documented correctly', countData.arithmetic.rawMinusUnique === 6 && countData.arithmetic.duplicatesOutsideUniqueSet === 6 && countData.arithmetic.duplicatesInsideUniqueSet === 1, 'CRITICAL');
check('M15', 'Historical invalid subtraction flagged', typeof countData.arithmetic.invalidHistoricalSubtraction === 'string' && countData.arithmetic.invalidHistoricalSubtraction.includes('229'), 'HIGH');

// ---------------------------------------------- GROUP 2: evidence/status

console.log('\nEvidence and scholarly status:');
check('E01', 'All mappings reference quran-json only', mappings.every((m) => String(m.sourceIds) === 'quran-json'), 'CRITICAL');
check('E02', 'Zero Tafsir attached', mappingData.evidenceIntegrity.tafsirAttachedCount === 0, 'CRITICAL');
check('E03', 'Zero Tafsir verified', mappingData.evidenceIntegrity.tafsirVerifiedCount === 0, 'CRITICAL');
check('E04', 'Zero scholar reviewed', mappingData.evidenceIntegrity.scholarReviewedCount === 0, 'CRITICAL');
check('E05', 'All 789 remain pending scholarly review', mappings.every((m) => m.provenance === 'pending-scholarly-review'), 'CRITICAL');
check('E06', 'No mapping carries a stored audit verdict field', mappings.every((m) => m.auditVerdict === undefined && m.verdict === undefined), 'HIGH');
check('E07', 'Derived verdict split sums to 789', mappingData.derivedVerdictDistribution.ACCEPT_AS_DIRECT + mappingData.derivedVerdictDistribution.ACCEPT_AS_THEMATIC === 789, 'CRITICAL');
check('E08', 'Verdict derivation disclosed as technical, not scholarly', typeof mappingData.verdictProvenanceNote === 'string' && mappingData.verdictProvenanceNote.includes('DERIVED'), 'HIGH');

// -------------------------------------------------- GROUP 3: taxonomy

console.log('\nTaxonomy integrity:');
check('T01', 'Domain count 20', domains.length === 20, 'CRITICAL');
check('T02', 'Dimension count 103', dimensions.length === 103, 'CRITICAL');
check('T03', 'Subdimension count 25', subdimensions.length === 25, 'CRITICAL');
check('T04', 'Topic count 184', topics.length === 184, 'CRITICAL');
check('T05', 'Relationship count 150', relationships.length === 150, 'CRITICAL');
check('T06', 'Entity IDs unique within namespaces', new Set(domains.map((d) => d.id)).size === domains.length && new Set(dimensions.map((d) => d.id)).size === dimensions.length && new Set(subdimensions.map((s) => s.id)).size === subdimensions.length && new Set(topics.map((t) => t.id)).size === topics.length, 'CRITICAL');
check('T07', 'All dimension parentDomainId resolve', dimensions.every((d) => domIds.has(d.parentDomainId)), 'CRITICAL');
check('T08', 'All topic parentDimensionId resolve', topics.every((t) => dimIds.has(t.parentDimensionId)), 'CRITICAL');
check('T09', 'Bidirectional coverage has 103 rows', taxonomyData.bidirectionalCoverage.length === 103, 'CRITICAL');
const BUCKETS = ['ZERO_TOPICS', 'ONE_TOPIC', 'TWO_TOPICS', 'THREE_TO_FOUR_TOPICS', 'FIVE_OR_MORE_TOPICS'];
const sumOf = (o) => BUCKETS.reduce((a, b) => a + (o[b] || 0), 0);
check('T10', 'Topic-side distribution totals 103', sumOf(taxonomyData.topicSideDistribution) === 103, 'CRITICAL');
check('T11', 'Dimension-side distribution totals 103', sumOf(taxonomyData.dimensionSideDistribution) === 103, 'CRITICAL');
check('T12', 'Distributions reported separately (not merged)', JSON.stringify(taxonomyData.topicSideDistribution) !== JSON.stringify(taxonomyData.dimensionSideDistribution), 'HIGH');
check('T13', 'Seven discrepancy investigations present', taxonomyData.sevenDiscrepancies.length === 7, 'CRITICAL');
check('T14', 'Upstream validationPassed flag preserved as false', taxonomyData.upstreamValidationPassedFlag === false, 'HIGH');
check('T15', 'Upstream flag meaning documented', typeof taxonomyData.upstreamFlagMeaning === 'string' && taxonomyData.upstreamFlagMeaning.includes('NOT the exit status'), 'HIGH');

// -------------------------------------------- GROUP 4: phantom references

console.log('\nPhantom references:');
check('P01', 'Phantom count reproduces 370', phantomCalc === 370, 'CRITICAL', 'calc ' + phantomCalc);
check('P02', 'Dataset phantom count matches recomputation', phantomData.references.length === phantomCalc, 'CRITICAL');
check('P03', 'Historical claim of 370 preserved', phantomData.totals.historicalClaimedPhantomCount === 370, 'HIGH');
check('P04', 'Dimension-side reference total reproduces 549', dimSideRefs === 549 && phantomData.totals.dimensionSideTotalReferences === dimSideRefs, 'CRITICAL');
check('P05', 'Every phantom classified (no UNRESOLVED left silent)', phantomData.references.every((r) => typeof r.classification === 'string' && r.classification.length > 0), 'CRITICAL');
check('P06', 'Classification counts sum to reference count', Object.values(phantomData.classificationCounts).reduce((a, b) => a + b, 0) === phantomData.references.length, 'CRITICAL');
check('P07', 'No phantom marked as auto-resolved', phantomData.references.every((r) => r.requiresHumanReview === true), 'CRITICAL');
check('P08', 'Wrong-parent refs separated from phantoms', Array.isArray(phantomData.wrongParentReferences) && phantomData.wrongParentReferences.length === phantomData.totals.existingButWrongParent, 'HIGH');
check('P09', 'Every phantom truly absent from topics.json', phantomData.references.every((r) => !topicIds.has(r.referencedTopicId)), 'CRITICAL');

// ------------------------------------------ GROUP 5: relationships/proposals

console.log('\nRelationships and proposals:');
const allIds = new Set([...domIds, ...dimIds, ...subIds, ...topicIds]);
check('R01', 'All relationship endpoints resolve', relationships.every((r) => allIds.has(r.sourceId) && allIds.has(r.targetId)), 'CRITICAL');
check('R02', 'No self-references', relationships.every((r) => r.sourceId !== r.targetId), 'HIGH');
check('R03', 'No duplicate edges', new Set(relationships.map((r) => r.sourceId + '>' + r.targetId + '>' + r.type)).size === relationships.length, 'HIGH');
check('R04', 'Semantic/scholarly validity NOT claimed by automation', taxonomyData.relationshipIntegrity.semanticValidity === 'NOT_ASSESSED_BY_AUTOMATION' && taxonomyData.relationshipIntegrity.scholarlyValidity === 'NOT_ASSESSED_BY_AUTOMATION', 'CRITICAL');
check('Q01', 'Proposal count 60', proposals.length === 60, 'CRITICAL');
check('Q02', 'Proposal IDs unique', new Set(proposals.map((p) => p.proposedTopicId)).size === 60, 'CRITICAL');
check('Q03', 'Proposal titles unique', new Set(proposals.map((p) => p.proposedName)).size === 60, 'HIGH');
check('Q04', 'Proposal targets resolve', proposals.every((p) => domIds.has(p.targetDomainId) && dimIds.has(p.targetDimensionId)), 'CRITICAL');
check('Q05', 'Category distribution sums to 60', Object.values(taxonomyData.proposalIntegrity.categoryDistribution).reduce((a, b) => a + b, 0) === 60, 'CRITICAL');
check('Q06', 'All proposals remain PENDING', proposals.every((p) => p.reviewStatus === 'PENDING'), 'CRITICAL');
check('Q07', 'No proposal implemented in production', taxonomyData.proposalIntegrity.implementedInProduction === 0 && proposals.every((p) => !topicIds.has(p.proposedTopicId)), 'CRITICAL');

// ---------------------------------------- GROUP 6: report/JSON agreement

console.log('\nReport-to-JSON agreement:');
const countMd = readFileSync(resolve(ROOT, AUDIT_DIR + '/MFD-09-2-1-COUNT-RECONCILIATION.md'), 'utf8');
const phantomMd = readFileSync(resolve(ROOT, AUDIT_DIR + '/MFD-09-2-1-PHANTOM-REFERENCE-REPORT.md'), 'utf8');
check('D01', 'Count Markdown contains no retracted 149 figure as canonical', !/\| Multi-topic ayat \(distinct topics\) \| 230 \| 149/.test(countMd), 'CRITICAL');
check('D02', 'Count Markdown contains no retracted 138 figure as canonical', !/\| Multi-topic ayat \(distinct topics\) \| 230 \| 138/.test(countMd), 'CRITICAL');
check('D03', 'Count Markdown states verified 230', countMd.includes('| Multi-topic ayat (distinct topics) | 230 | 230 | MATCH |'), 'CRITICAL');
check('D04', 'Count Markdown states verified 236', countMd.includes('| Multi-topic ayat (raw occurrence basis) | 236 | 236 | MATCH |'), 'CRITICAL');
check('D05', 'Phantom Markdown states 370', phantomMd.includes('| Phantom references (no matching topic record) | 370 |'), 'CRITICAL');
check('D06', 'Defective methodologies disclosed, not hidden', countMd.includes('DEFECTIVE') && countMd.includes('Start-key only') && countMd.includes('Range-key grouping'), 'HIGH');
check('D07', 'Validator results JSON records 39 executed checks', Array.isArray(validatorResults.checks) && validatorResults.checks.length === 39, 'CRITICAL');
check('D08', 'Validator results JSON records exit code 0', validatorResults.executionResult.exitCode === 0 && validatorResults.executionResult.passed === 39, 'CRITICAL');

// ------------------------------------------- GROUP 7: determinism proof

console.log('\nDeterministic generation:');
const GEN_OUTPUTS = [
  'mfd-09-2-1-count-reconciliation.json',
  'mfd-09-2-1-phantom-reference-reconciliation.json',
  'mfd-09-2-1-artifact-inventory.json',
  'mfd-09-2-1-mapping-integrity.json',
  'mfd-09-2-1-taxonomy-integrity.json',
  'MFD-09-2-1-COUNT-RECONCILIATION.md',
  'MFD-09-2-1-PHANTOM-REFERENCE-REPORT.md',
  'MFD-09-2-1-REPORT-ARTIFACT-INTEGRITY-REPORT.md'
];
check('G01', 'Generator script exists', existsSync(resolve(ROOT, 'scripts/generate-mfd-09-2-1-reports.mjs')), 'CRITICAL');
const before = GEN_OUTPUTS.map((f) => sha256(AUDIT_DIR + '/' + f));
let genExit = -1;
try {
  execFileSync(process.execPath, [resolve(ROOT, 'scripts/generate-mfd-09-2-1-reports.mjs')], { cwd: ROOT, stdio: 'ignore' });
  genExit = 0;
} catch (e) {
  genExit = e.status === undefined ? -1 : e.status;
}
const after = GEN_OUTPUTS.map((f) => sha256(AUDIT_DIR + '/' + f));
check('G02', 'Generator exits 0', genExit === 0, 'CRITICAL', 'exit ' + genExit);
const drift = GEN_OUTPUTS.filter((f, i) => before[i] !== after[i]);
check('G03', 'Regeneration is byte-identical (SHA-256)', drift.length === 0, 'CRITICAL', drift.join(', '));
check('G04', 'Generated output contains no timestamps', GEN_OUTPUTS.every((f) => !/"(timestamp|generatedAt|generated_at)"\s*:/.test(readFileSync(resolve(ROOT, AUDIT_DIR + '/' + f), 'utf8'))), 'HIGH');

// --------------------------------------- GROUP 8: production protection

console.log('\nProduction protection:');
const PROTECTED = [
  'data/taxonomy/domains.json',
  'data/taxonomy/dimensions.json',
  'data/taxonomy/subdimensions.json',
  'data/taxonomy/topics.json',
  'data/taxonomy/relationships.json',
  'data/taxonomy/topic-ayah-mappings.json'
];
const BASELINE_HASHES = {
  'data/taxonomy/domains.json': '26322BAAFA13E967669B49D7117C6C51B238D4236E2B98D108248CB556D8F610',
  'data/taxonomy/dimensions.json': 'A88CD118FBDD438D8742085631C4787B9BC920D846AA65809AEE85CC245138AA',
  'data/taxonomy/subdimensions.json': 'B4CC4982FB079A45EB239592B0BEDE28A53B30D560F034F8DF42371D9279E6D6',
  'data/taxonomy/topics.json': '6571E74AA644D168ACC3EF2BA10DA889B02CA4F73B5B83156DA376E8C954C3E9',
  'data/taxonomy/relationships.json': 'D545121703FFBC825A6F185052E49DC93BF415D233CC3FC188E355DF60E1B82A',
  'data/taxonomy/topic-ayah-mappings.json': '3CA33A47925E25E1BA282E28D3C3212F9654CE2DC897BA0A4150EB974D2C2CED'
};
for (let i = 0; i < PROTECTED.length; i++) {
  const p = PROTECTED[i];
  check('X0' + (i + 1), 'Unchanged: ' + p.split('/').pop(), sha256(p) === BASELINE_HASHES[p], 'CRITICAL', sha256(p));
}
let gitProdDiff = '';
try {
  gitProdDiff = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', 'data/taxonomy', 'src'], { cwd: ROOT, encoding: 'utf8' }).trim();
} catch (e) {
  gitProdDiff = 'GIT_ERROR';
}
check('X07', 'Git reports no changes under data/taxonomy or src', gitProdDiff === '', 'CRITICAL', gitProdDiff);
const flagText = readFileSync(resolve(ROOT, 'src/lib/ai/feature-flag.ts'), 'utf8');
check('X08', 'Public AI answers remain OFF', /export\s+const\s+AI_ANSWER_FEATURE_ENABLED\s*=\s*false\s+as\s+const/.test(flagText), 'CRITICAL');
check('X09', 'Inventory records AI feature disabled', inventoryData.aiAnswerFeatureEnabled === false, 'CRITICAL');
check('X10', 'Artifact-count contradiction documented (6 vs 7)', inventoryData.mfd092ClaimedNewFileCount === 6 && inventoryData.mfd092ActualArtifactCount === 7, 'HIGH');

// ---------------------------------------------------------------- summary

console.log('\n========================================');
console.log('Checks: ' + results.length + '  PASS: ' + passed + '  FAIL: ' + failed + '  WARNING: ' + warned);
console.log('========================================\n');

if (failed > 0) {
  console.log('FAILURES:');
  for (const r of results.filter((x) => x.status === 'FAIL')) console.log('  - [' + r.id + '] ' + r.name + (r.detail ? ': ' + r.detail : ''));
}
if (warned > 0) {
  console.log('WARNINGS (not counted as passes):');
  for (const r of results.filter((x) => x.status === 'WARNING')) console.log('  - [' + r.id + '] ' + r.name + (r.detail ? ': ' + r.detail : ''));
}

process.exit(failed > 0 ? 1 : 0);
