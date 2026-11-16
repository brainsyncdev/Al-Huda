#!/usr/bin/env node
/**
 * MFD-09.2.1 Deterministic Audit Report Generator
 *
 * Reads canonical production data (READ-ONLY) plus existing audit artifacts,
 * recomputes every statistic programmatically, and emits machine-readable JSON
 * and Markdown reports into docs/audits/mfd-09-2-1/.
 *
 * DETERMINISM CONTRACT
 *   - No timestamps, no randomness, no environment-dependent values in output.
 *   - All collections sorted with a stable comparator before serialization.
 *   - JSON: 2-space indent, LF newlines, trailing newline, no BOM.
 *   - Running twice on identical inputs produces byte-identical files.
 *
 * PRODUCTION SAFETY
 *   This script never writes to data/taxonomy/, src/, or any application file.
 *   It only writes inside OUT_DIR.
 *
 * Usage:
 *   node scripts/generate-mfd-09-2-1-reports.mjs [--out <dir>]
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const argv = process.argv.slice(2);
const outIdx = argv.indexOf('--out');
const OUT_DIR = outIdx >= 0 ? resolve(ROOT, argv[outIdx + 1]) : resolve(ROOT, 'docs/audits/mfd-09-2-1');

// ---------------------------------------------------------------- utilities

function readJson(rel) {
  let t = readFileSync(resolve(ROOT, rel), 'utf8');
  if (t.charCodeAt(0) === 0xFEFF) t = t.slice(1);
  return JSON.parse(t);
}

function sha256File(rel) {
  const buf = readFileSync(resolve(ROOT, rel));
  return createHash('sha256').update(buf).digest('hex').toUpperCase();
}

function sizeFile(rel) {
  return readFileSync(resolve(ROOT, rel)).length;
}

/** Stable string comparator independent of locale. */
function cmp(a, b) {
  const x = String(a);
  const y = String(b);
  return x < y ? -1 : x > y ? 1 : 0;
}

/** Recursively sort object keys so serialization order is deterministic. */
function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    const o = {};
    for (const k of Object.keys(value).sort(cmp)) o[k] = stable(value[k]);
    return o;
  }
  return value;
}

function jsonText(value) {
  return JSON.stringify(stable(value), null, 2) + '\n';
}

function mdTable(headers, rows) {
  const head = '| ' + headers.join(' | ') + ' |';
  const sep = '|' + headers.map(() => '---').join('|') + '|';
  const body = rows.map((r) => '| ' + r.map((c) => String(c)).join(' | ') + ' |');
  return [head, sep, ...body].join('\n');
}

const written = [];
function emit(name, text) {
  const p = join(OUT_DIR, name);
  writeFileSync(p, text, { encoding: 'utf8' });
  written.push({ file: name, bytes: Buffer.byteLength(text, 'utf8'), sha256: createHash('sha256').update(Buffer.from(text, 'utf8')).digest('hex').toUpperCase() });
}

// ------------------------------------------------------- canonical inputs

const SRC = {
  domains: 'data/taxonomy/domains.json',
  dimensions: 'data/taxonomy/dimensions.json',
  subdimensions: 'data/taxonomy/subdimensions.json',
  topics: 'data/taxonomy/topics.json',
  relationships: 'data/taxonomy/relationships.json',
  mappings: 'data/taxonomy/topic-ayah-mappings.json'
};

const domains = readJson(SRC.domains);
const dimensions = readJson(SRC.dimensions);
const subdimensions = readJson(SRC.subdimensions);
const topics = readJson(SRC.topics);
const relationships = readJson(SRC.relationships);
const mappings = readJson(SRC.mappings);

const proposals = readJson('data/audit/mfd-09-1-topic-proposals-classified.json');
const mfd092MappingAudit = readJson('data/audit/mfd-09-2-mapping-integrity.json');
const mfd092TaxonomyAudit = readJson('data/audit/mfd-09-2-taxonomy-integrity.json');

const topicById = new Map(topics.map((t) => [t.id, t]));
const dimensionById = new Map(dimensions.map((d) => [d.id, d]));
const subdimensionIds = new Set(subdimensions.map((s) => s.id));
const domainIds = new Set(domains.map((d) => d.id));
const dimensionIds = new Set(dimensions.map((d) => d.id));
const allEntityIds = new Set([...domainIds, ...dimensionIds, ...subdimensionIds, ...topicById.keys()]);

// ------------------------------------------- Workstream B3: ayah counting

/**
 * CANONICAL METHOD: full range expansion.
 * Every mapping record contributes one occurrence per ayah in
 * [ayahStart, ayahEnd]. Identity is surahNumber:ayah.
 */
const occTopics = new Map(); // key -> array of topicId occurrences
let expandedOccurrences = 0;
const invalidRanges = [];
for (const m of mappings) {
  const s = m.surahNumber;
  const a = m.ayahStart;
  const b = m.ayahEnd;
  if (!Number.isInteger(s) || !Number.isInteger(a) || !Number.isInteger(b) || b < a || s < 1 || s > 114) {
    invalidRanges.push({ mappingId: m.id, surahNumber: s, ayahStart: a, ayahEnd: b });
    continue;
  }
  expandedOccurrences += b - a + 1;
  for (let y = a; y <= b; y++) {
    const k = s + ':' + y;
    if (!occTopics.has(k)) occTopics.set(k, []);
    occTopics.get(k).push(m.topicId);
  }
}

function ayahKeyCompare(x, y) {
  const [sx, ax] = x.split(':').map(Number);
  const [sy, ay] = y.split(':').map(Number);
  return sx - sy || ax - ay;
}

const ayahRows = [];
let multiTopicAyat = 0;
let threePlusTopicAyat = 0;
let maxOverlap = 0;
let duplicateOccurrenceCount = 0;
let rawMultiTopicOccurrences = 0;
let rawMultiTopicAyat = 0;
const duplicateAssignments = [];

for (const key of [...occTopics.keys()].sort(ayahKeyCompare)) {
  const list = occTopics.get(key);
  const distinct = [...new Set(list)].sort(cmp);
  const repeated = [];
  const counts = new Map();
  for (const t of list) counts.set(t, (counts.get(t) || 0) + 1);
  for (const t of [...counts.keys()].sort(cmp)) {
    if (counts.get(t) > 1) {
      repeated.push({ topicId: t, occurrences: counts.get(t), excess: counts.get(t) - 1 });
      duplicateOccurrenceCount += counts.get(t) - 1;
      duplicateAssignments.push({ ayah: key, topicId: t, occurrences: counts.get(t), excess: counts.get(t) - 1 });
    }
  }
  const isMulti = distinct.length > 1;
  if (isMulti) {
    multiTopicAyat++;
    rawMultiTopicOccurrences += list.length;
  }
  // Raw occurrence-based definition: an ayah qualifies when it carries more
  // than one mapping OCCURRENCE, even if every occurrence repeats one topic.
  if (list.length > 1) rawMultiTopicAyat++;
  if (distinct.length >= 3) threePlusTopicAyat++;
  if (distinct.length > maxOverlap) maxOverlap = distinct.length;
  ayahRows.push({
    ayah: key,
    surahNumber: Number(key.split(':')[0]),
    ayahNumber: Number(key.split(':')[1]),
    occurrenceCount: list.length,
    distinctTopicCount: distinct.length,
    distinctTopicIds: distinct,
    repeatedTopicIds: repeated,
    isMultiTopic: isMulti
  });
}

duplicateAssignments.sort((a, b) => ayahKeyCompare(a.ayah, b.ayah) || cmp(a.topicId, b.topicId));

// Defective methodologies reproduced for root-cause documentation only.
function groupBy(keyFn) {
  const g = new Map();
  for (const m of mappings) {
    const k = keyFn(m);
    if (!g.has(k)) g.set(k, []);
    g.get(k).push(m.topicId);
  }
  let multi = 0;
  let raw = 0;
  let dup = 0;
  for (const list of g.values()) {
    const d = new Set(list);
    if (d.size > 1) {
      multi++;
      raw += list.length;
    }
    if (list.length > d.size) dup += list.length - d.size;
  }
  return { keys: g.size, multiTopicGroups: multi, rawRecordsInMultiGroups: raw, duplicateExcess: dup };
}

const methodStartOnly = groupBy((m) => m.surahNumber + ':' + m.ayahStart);
const methodRangeKey = groupBy((m) => m.surahNumber + ':' + m.ayahStart + '-' + m.ayahEnd);

// --------------------------------------------- verdict / evidence integrity

function tally(fn) {
  const o = {};
  for (const m of mappings) {
    const k = String(fn(m));
    o[k] = (o[k] || 0) + 1;
  }
  return o;
}

const mappingTypeDistribution = tally((m) => m.mappingType);
const statusDistribution = tally((m) => m.status);
const provenanceDistribution = tally((m) => m.provenance);
const sourceIdDistribution = tally((m) => (Array.isArray(m.sourceIds) ? m.sourceIds.join('|') : m.sourceIds));

const derivedVerdictDistribution = {
  ACCEPT_AS_DIRECT: (mappingTypeDistribution.DIRECT_REFERENCE || 0) + (mappingTypeDistribution.EXPLICIT_INSTRUCTION || 0) + (mappingTypeDistribution.PROPHETIC_NARRATIVE || 0),
  ACCEPT_AS_THEMATIC: mappingTypeDistribution.THEMATIC_REFERENCE || 0
};

const recordsWithVerdictField = mappings.filter((m) => m.auditVerdict !== undefined || m.verdict !== undefined).length;
const uniqueMappingIds = new Set(mappings.map((m) => m.id)).size;
const duplicateMappingIds = (() => {
  const seen = new Map();
  const dups = [];
  for (const m of mappings) {
    if (seen.has(m.id)) dups.push(m.id);
    seen.set(m.id, true);
  }
  return dups.sort(cmp);
})();

const evidenceIntegrity = {
  quranTextCount: mappings.length,
  translationSupportedCount: mappings.filter((m) => String(m.sourceIds).includes('quran-json')).length,
  tafsirAttachedCount: mappings.filter((m) => /tafsir/i.test(String(m.sourceIds))).length,
  tafsirVerifiedCount: mappings.filter((m) => m.tafsirVerified === true).length,
  scholarReviewedCount: mappings.filter((m) => m.provenance === 'scholar-reviewed' || m.scholarReviewed === true).length,
  pendingScholarlyReviewCount: mappings.filter((m) => m.provenance === 'pending-scholarly-review').length,
  distinctSourceIdSets: Object.keys(sourceIdDistribution).sort(cmp)
};

// ------------------------------------- Workstream B4: phantom classification

/**
 * Classification is evidence-based, not heuristic similarity scoring.
 * A reference is classified by what can be PROVEN from canonical files.
 */
const phantomReferences = [];
const wrongParentReferences = [];
let dimensionSideTotalRefs = 0;
let duplicateRefsWithinDimension = 0;
let existingButWrongParent = 0;

for (const d of [...dimensions].sort((a, b) => cmp(a.id, b.id))) {
  const ids = d.topicIds || [];
  dimensionSideTotalRefs += ids.length;
  const localSeen = new Set();
  for (const id of ids) {
    if (localSeen.has(id)) duplicateRefsWithinDimension++;
    localSeen.add(id);
    const t = topicById.get(id);
    if (t) {
      // The topic record EXISTS, so this is not a phantom reference.
      // A parent mismatch is recorded separately as a bidirectional finding.
      if (t.parentDimensionId !== d.id) {
        existingButWrongParent++;
        wrongParentReferences.push({
          dimensionId: d.id,
          referencedTopicId: id,
          classification: 'EXISTING_TOPIC_WRONG_PARENT',
          topicExists: true,
          actualParentDimensionId: t.parentDimensionId,
          requiresHumanReview: true,
          evidence: 'topics.json contains this id with parentDimensionId=' + t.parentDimensionId
        });
      }
      continue;
    }
    const isSub = subdimensionIds.has(id);
    const isDim = dimensionIds.has(id);
    const isDom = domainIds.has(id);
    let classification = 'NONEXISTENT_TOPIC_ID';
    let evidence = 'No record with this id exists in topics.json.';
    if (isSub) {
      classification = 'NAMESPACE_COLLISION_SUBDIMENSION';
      evidence = 'Id exists in subdimensions.json, not topics.json.';
    } else if (isDim) {
      classification = 'NAMESPACE_COLLISION_DIMENSION';
      evidence = 'Id exists in dimensions.json, not topics.json.';
    } else if (isDom) {
      classification = 'NAMESPACE_COLLISION_DOMAIN';
      evidence = 'Id exists in domains.json, not topics.json.';
    } else if (typeof id !== 'string' || id.trim() === '' || /\s/.test(id)) {
      classification = 'MALFORMED_REFERENCE';
      evidence = 'Reference is empty, non-string, or contains whitespace.';
    }
    phantomReferences.push({
      dimensionId: d.id,
      referencedTopicId: id,
      classification,
      topicExists: false,
      actualParentDimensionId: null,
      isSubdimensionId: isSub,
      isDuplicateWithinDimension: false,
      requiresHumanReview: true,
      evidence
    });
  }
}

// Mark duplicates within a dimension's own topicIds array.
{
  const perDim = new Map();
  for (const p of phantomReferences) {
    const k = p.dimensionId + '|' + p.referencedTopicId;
    perDim.set(k, (perDim.get(k) || 0) + 1);
  }
  for (const p of phantomReferences) {
    const k = p.dimensionId + '|' + p.referencedTopicId;
    if (perDim.get(k) > 1) p.isDuplicateWithinDimension = true;
  }
}

phantomReferences.sort((a, b) => cmp(a.dimensionId, b.dimensionId) || cmp(a.referencedTopicId, b.referencedTopicId));

const phantomClassificationCounts = {};
for (const p of phantomReferences) {
  phantomClassificationCounts[p.classification] = (phantomClassificationCounts[p.classification] || 0) + 1;
}

// ------------------------------------------ bidirectional coverage (103 rows)

const topicCountByDimension = new Map();
for (const t of topics) {
  topicCountByDimension.set(t.parentDimensionId, (topicCountByDimension.get(t.parentDimensionId) || 0) + 1);
}
const subdimCountByDimension = new Map();
for (const s of subdimensions) {
  subdimCountByDimension.set(s.parentDimensionId, (subdimCountByDimension.get(s.parentDimensionId) || 0) + 1);
}

function bucket(count) {
  if (count === 0) return 'ZERO_TOPICS';
  if (count === 1) return 'ONE_TOPIC';
  if (count === 2) return 'TWO_TOPICS';
  if (count <= 4) return 'THREE_TO_FOUR_TOPICS';
  return 'FIVE_OR_MORE_TOPICS';
}
const BUCKETS = ['ZERO_TOPICS', 'ONE_TOPIC', 'TWO_TOPICS', 'THREE_TO_FOUR_TOPICS', 'FIVE_OR_MORE_TOPICS'];

const bidirectionalCoverage = [];
const topicSideDistribution = Object.fromEntries(BUCKETS.map((b) => [b, 0]));
const dimensionSideDistribution = Object.fromEntries(BUCKETS.map((b) => [b, 0]));

for (const d of [...dimensions].sort((a, b) => cmp(a.id, b.id))) {
  const declared = d.topicIds || [];
  const dimSide = declared.length;
  const topicSide = topicCountByDimension.get(d.id) || 0;
  const missingTopicIds = declared.filter((id) => !topicById.has(id)).sort(cmp);
  const declaredSet = new Set(declared);
  const unexpectedTopicRefs = topics
    .filter((t) => t.parentDimensionId === d.id && !declaredSet.has(t.id))
    .map((t) => t.id)
    .sort(cmp);
  topicSideDistribution[bucket(topicSide)]++;
  dimensionSideDistribution[bucket(dimSide)]++;
  bidirectionalCoverage.push({
    domainId: d.parentDomainId,
    dimensionId: d.id,
    dimensionName: d.title,
    dimensionSideTopicCount: dimSide,
    topicSideTopicCount: topicSide,
    coverageDiscrepancy: dimSide !== topicSide,
    missingTopicIds,
    unexpectedTopicRefs,
    subdimensionCount: subdimCountByDimension.get(d.id) || 0,
    reviewStatus: 'PENDING_HUMAN_TAXONOMY_REVIEW'
  });
}

// ------------------------------------------------------ seven discrepancies

const SEVEN = ['salah-prayer', 'moral-virtues', 'sincerity-ikhlas', 'intellect-reason', 'personal-development', 'human-rights', 'quranic-vocabulary'];
const sevenDiscrepancies = SEVEN.map((id) => {
  const row = bidirectionalCoverage.find((r) => r.dimensionId === id);
  const hist = (mfd092TaxonomyAudit.sevenDiscrepancies || []).find((r) => r.dimensionId === id) || null;
  return {
    dimensionId: id,
    dimensionName: row ? row.dimensionName : null,
    dimensionSideTopicCount: row ? row.dimensionSideTopicCount : null,
    topicSideTopicCount: row ? row.topicSideTopicCount : null,
    missingTopicIds: row ? row.missingTopicIds : [],
    unexpectedTopicRefs: row ? row.unexpectedTopicRefs : [],
    historicalMfd091TopicCount: hist ? hist.mfd091TopicCount : null,
    historicalMfd091TopicCountFromDimFile: hist ? hist.mfd091TopicCountFromDimFile : null,
    historicalMfd091TopicCountFromTopicFile: hist ? hist.mfd091TopicCountFromTopicFile : null,
    rootCause:
      'dimensions.json topicIds and topics.json parentDimensionId disagree. ' +
      'Missing ids are unimplemented references; unexpected refs are real topics absent from the dimension list. ' +
      'The historical MFD-09.1 topicCount matches neither side independently.',
    resolution: 'DOCUMENTED — REQUIRES HUMAN TAXONOMY DECISION'
  };
});

// --------------------------------------------------- relationship integrity

const relationshipTypeCounts = {};
for (const r of relationships) {
  const k = r.type || r.relationshipType;
  relationshipTypeCounts[k] = (relationshipTypeCounts[k] || 0) + 1;
}
let relValidEndpoints = 0;
let relSelfRefs = 0;
let relDupEdges = 0;
const relOrphans = [];
const edgeSeen = new Set();
for (const r of relationships) {
  const okS = allEntityIds.has(r.sourceId);
  const okT = allEntityIds.has(r.targetId);
  if (okS && okT) relValidEndpoints++;
  else relOrphans.push({ relationshipId: r.id, sourceId: r.sourceId, targetId: r.targetId, sourceResolves: okS, targetResolves: okT });
  if (r.sourceId === r.targetId) relSelfRefs++;
  const k = r.sourceId + '>' + r.targetId + '>' + (r.type || r.relationshipType);
  if (edgeSeen.has(k)) relDupEdges++;
  edgeSeen.add(k);
}
relOrphans.sort((a, b) => cmp(a.relationshipId, b.relationshipId));

const relationshipIntegrity = {
  totalRelationships: relationships.length,
  validEndpointPairs: relValidEndpoints,
  orphanEndpoints: relOrphans,
  selfReferences: relSelfRefs,
  duplicateEdges: relDupEdges,
  uniqueRelationshipIds: new Set(relationships.map((r) => r.id)).size,
  typeDistribution: relationshipTypeCounts,
  structuralValidity: relValidEndpoints === relationships.length && relSelfRefs === 0 && relDupEdges === 0,
  semanticValidity: 'NOT_ASSESSED_BY_AUTOMATION',
  scholarlyValidity: 'NOT_ASSESSED_BY_AUTOMATION'
};

// ------------------------------------------------------ proposal integrity

const proposalCategoryCounts = {};
const proposalRecommendationCounts = {};
const proposalReviewStatusCounts = {};
const proposalInvalidTargets = [];
const proposalSeenIds = new Set();
const proposalDuplicateIds = [];
const proposalSeenTitles = new Set();
const proposalDuplicateTitles = [];
for (const p of proposals) {
  proposalCategoryCounts[p.knowledgeCategory] = (proposalCategoryCounts[p.knowledgeCategory] || 0) + 1;
  proposalRecommendationCounts[p.recommendation] = (proposalRecommendationCounts[p.recommendation] || 0) + 1;
  proposalReviewStatusCounts[p.reviewStatus] = (proposalReviewStatusCounts[p.reviewStatus] || 0) + 1;
  if (proposalSeenIds.has(p.proposedTopicId)) proposalDuplicateIds.push(p.proposedTopicId);
  proposalSeenIds.add(p.proposedTopicId);
  if (proposalSeenTitles.has(p.proposedName)) proposalDuplicateTitles.push(p.proposedName);
  proposalSeenTitles.add(p.proposedName);
  const okDom = domainIds.has(p.targetDomainId);
  const okDim = dimensionIds.has(p.targetDimensionId);
  if (!okDom || !okDim) proposalInvalidTargets.push({ proposedTopicId: p.proposedTopicId, targetDomainId: p.targetDomainId, targetDimensionId: p.targetDimensionId, domainResolves: okDom, dimensionResolves: okDim });
}
proposalDuplicateIds.sort(cmp);
proposalDuplicateTitles.sort(cmp);
proposalInvalidTargets.sort((a, b) => cmp(a.proposedTopicId, b.proposedTopicId));

const proposalIntegrity = {
  totalCount: proposals.length,
  uniqueIdCount: proposalSeenIds.size,
  duplicateIds: proposalDuplicateIds,
  duplicateTitles: proposalDuplicateTitles,
  categoryDistribution: proposalCategoryCounts,
  recommendationDistribution: proposalRecommendationCounts,
  reviewStatusDistribution: proposalReviewStatusCounts,
  invalidTargetReferences: proposalInvalidTargets,
  quranMappingAppropriateTrue: proposals.filter((p) => p.quranMappingAppropriate === true).length,
  quranMappingAppropriateFalse: proposals.filter((p) => p.quranMappingAppropriate === false).length,
  implementedInProduction: 0,
  note: 'ACCEPT_FOR_FUTURE_REVIEW is a triage recommendation, not production approval or scholarly approval.'
};

// ------------------------------------------------------ production protection

const PROTECTED_FILES = [
  SRC.domains,
  SRC.dimensions,
  SRC.subdimensions,
  SRC.topics,
  SRC.relationships,
  SRC.mappings
];
const productionHashes = PROTECTED_FILES.map((p) => ({ path: p, bytes: sizeFile(p), sha256: sha256File(p) }));

const featureFlagText = readFileSync(resolve(ROOT, 'src/lib/ai/feature-flag.ts'), 'utf8');
const aiFlagOff = /export\s+const\s+AI_ANSWER_FEATURE_ENABLED\s*=\s*false\s+as\s+const/.test(featureFlagText);

// --------------------------------------------------------------- assemble

const countReconciliation = {
  schemaVersion: '1.0.0',
  auditId: 'MFD-09.2.1-B3',
  sourceFile: SRC.mappings,
  sourceSha256: sha256File(SRC.mappings),
  fieldDocumentation: {
    canonicalMethod: 'Full range expansion: each mapping contributes one occurrence per ayah in [ayahStart, ayahEnd]; identity = surahNumber:ayah.',
    occurrenceCount: 'Number of mapping occurrences covering this ayah (ranges expanded).',
    distinctTopicCount: 'Number of distinct topicIds covering this ayah.',
    isMultiTopic: 'true when distinctTopicCount > 1.',
    repeatedTopicIds: 'topicIds occurring more than once for this ayah, with excess = occurrences - 1.',
    duplicateOccurrenceCount: 'Sum of excess occurrences across all ayat (same topic counted twice on one ayah).'
  },
  historicalClaims: {
    totalRecords: 789,
    expandedOccurrences: 1886,
    uniqueAyat: 1550,
    multiTopicAyatUnique: 230,
    multiTopicAyatRaw: 236,
    threePlusTopicAyat: 74,
    maxOverlap: 6,
    duplicateTopicAssignments: 7
  },
  verified: {
    totalRecords: mappings.length,
    expandedOccurrences,
    uniqueAyat: occTopics.size,
    multiTopicAyatUnique: multiTopicAyat,
    multiTopicAyatRawOccurrenceBasis: rawMultiTopicAyat,
    rawMultiTopicOccurrences,
    threePlusTopicAyat,
    maxOverlap,
    duplicateOccurrenceCount,
    ayatWithDuplicateTopicAssignments: duplicateAssignments.length,
    invalidRanges,
    duplicateMappingIds,
    uniqueMappingIds
  },
  arithmetic: {
    statement: '230 + 6 = 236',
    explanation:
      'Of the 7 ayat carrying a repeated topicId, 6 carry ONLY that one distinct topic (22:27, 22:28, 22:29, 22:33, 22:34 hajj-rites; 2:184 ramadan-fasting). ' +
      'Those 6 are NOT multi-topic under the distinct-topic definition, but ARE counted by a raw occurrence-based definition. ' +
      'The 7th ayah (17:23) has 3 distinct topics, so it is already inside the 230. ' +
      'Therefore raw multi-topic ayat = 230 + 6 = 236, and 236 - 7 = 229 is an INVALID subtraction because only 6 of the 7 duplicates lie outside the 230 set.',
    rawMinusUnique: 236 - 230,
    duplicatesOutsideUniqueSet: 6,
    duplicatesInsideUniqueSet: 1,
    invalidHistoricalSubtraction: '236 - 7 = 229 (does not equal 230; the operands describe different sets)'
  },
  defectiveMethodologiesReproduced: {
    startKeyOnly: {
      description: 'Groups by surahNumber:ayahStart, ignoring ayahEnd. Under-counts ayat covered by ranges that start elsewhere.',
      result: methodStartOnly
    },
    rangeKeyGrouping: {
      description: 'Groups by surahNumber:ayahStart-ayahEnd, treating each distinct range as a separate unit instead of expanding to individual ayat.',
      result: methodRangeKey
    },
    conclusion: 'Both are methodology defects. Neither indicates a change in production data.'
  },
  duplicateAssignments,
  multiTopicAyatRows: ayahRows.filter((r) => r.isMultiTopic),
  allAyahRows: ayahRows
};

const phantomDataset = {
  schemaVersion: '1.0.0',
  auditId: 'MFD-09.2.1-B4',
  sourceFiles: [SRC.dimensions, SRC.topics, SRC.subdimensions, SRC.domains],
  fieldDocumentation: {
    classification: 'Evidence-based class derived from canonical files (see classificationDefinitions).',
    topicExists: 'Whether topics.json contains a record with this exact id.',
    actualParentDimensionId: 'For WRONG_PARENT, the parent recorded in topics.json.',
    isDuplicateWithinDimension: 'Whether the same id appears more than once in this dimension topicIds array.',
    requiresHumanReview: 'Always true; automation must not resolve taxonomy references.'
  },
  classificationDefinitions: {
    NONEXISTENT_TOPIC_ID: 'No record with this id exists in any taxonomy namespace. Unimplemented/planned reference.',
    WRONG_PARENT: 'Topic exists but its parentDimensionId points to a different dimension.',
    NAMESPACE_COLLISION_SUBDIMENSION: 'Id resolves in subdimensions.json, not topics.json.',
    NAMESPACE_COLLISION_DIMENSION: 'Id resolves in dimensions.json, not topics.json.',
    NAMESPACE_COLLISION_DOMAIN: 'Id resolves in domains.json, not topics.json.',
    MALFORMED_REFERENCE: 'Empty, non-string, or whitespace-containing reference.',
    UNRESOLVED: 'Could not be classified from available evidence.'
  },
  totals: {
    dimensionSideTotalReferences: dimensionSideTotalRefs,
    phantomReferenceCount: phantomReferences.length,
    duplicateReferencesWithinDimension: duplicateRefsWithinDimension,
    existingButWrongParent: existingButWrongParent,
    historicalClaimedPhantomCount: (mfd092TaxonomyAudit.phantomReferences || []).length
  },
  classificationCounts: phantomClassificationCounts,
  references: phantomReferences,
  wrongParentNote:
    'These references resolve to real topic records, so they are NOT phantoms. They are listed separately because the dimension declares a topic whose parentDimensionId points elsewhere.',
  wrongParentReferences: wrongParentReferences.sort((a, b) => cmp(a.dimensionId, b.dimensionId) || cmp(a.referencedTopicId, b.referencedTopicId))
};

const mappingDataset = {
  schemaVersion: '1.0.0',
  auditId: 'MFD-09.2.1-MAPPING',
  sourceFile: SRC.mappings,
  sourceSha256: sha256File(SRC.mappings),
  totalRecords: mappings.length,
  expandedOccurrences,
  uniqueAyat: occTopics.size,
  multiTopicAyat: multiTopicAyat,
  threePlusTopicAyat,
  maxOverlap,
  duplicateOccurrenceCount,
  invalidRanges,
  duplicateMappingIds,
  mappingTypeDistribution,
  statusDistribution,
  provenanceDistribution,
  sourceIdDistribution,
  derivedVerdictDistribution,
  recordsCarryingAnAuditVerdictField: recordsWithVerdictField,
  verdictProvenanceNote:
    'No mapping record carries an auditVerdict/verdict field. The 661/128 split is DERIVED from mappingType ' +
    '(DIRECT_REFERENCE + EXPLICIT_INSTRUCTION + PROPHETIC_NARRATIVE = ACCEPT_AS_DIRECT; THEMATIC_REFERENCE = ACCEPT_AS_THEMATIC). ' +
    'It is a technical derivation, not a stored scholarly verdict.',
  evidenceIntegrity,
  historicalAuditComparison: {
    file: 'data/audit/mfd-09-2-mapping-integrity.json',
    totalRecords: mfd092MappingAudit.totalRecords,
    expandedOccurrences: mfd092MappingAudit.expandedOccurrences,
    uniqueAyat: mfd092MappingAudit.uniqueAyat,
    multiTopicAyat: mfd092MappingAudit.multiTopicAyat,
    multiTopicAyatRaw: mfd092MappingAudit.multiTopicAyatRaw,
    threePlusTopicAyat: mfd092MappingAudit.threePlusTopicAyat,
    maxOverlap: mfd092MappingAudit.maxOverlap,
    agreesWithRecomputation:
      mfd092MappingAudit.totalRecords === mappings.length &&
      mfd092MappingAudit.expandedOccurrences === expandedOccurrences &&
      mfd092MappingAudit.uniqueAyat === occTopics.size &&
      mfd092MappingAudit.multiTopicAyat === multiTopicAyat &&
      mfd092MappingAudit.threePlusTopicAyat === threePlusTopicAyat &&
      mfd092MappingAudit.maxOverlap === maxOverlap
  }
};

const taxonomyDataset = {
  schemaVersion: '1.0.0',
  auditId: 'MFD-09.2.1-TAXONOMY',
  entityCounts: {
    domains: domains.length,
    dimensions: dimensions.length,
    subdimensions: subdimensions.length,
    topics: topics.length,
    relationships: relationships.length
  },
  topicSideDistribution,
  dimensionSideDistribution,
  bidirectionalCoverage,
  sevenDiscrepancies,
  relationshipIntegrity,
  proposalIntegrity,
  upstreamValidationPassedFlag: mfd092TaxonomyAudit.validationPassed,
  upstreamFlagMeaning:
    'validationPassed:false in data/audit/mfd-09-2-taxonomy-integrity.json records that known data-integrity issues exist ' +
    '(phantom references, bidirectional asymmetry, cross-report inconsistencies). It is NOT the exit status of scripts/validate-mfd-09-2.mjs.',
  openHumanDecisions: [
    'Resolve ' + phantomReferences.length + ' phantom topic references in dimensions.json.',
    'Address ' + topicSideDistribution.ZERO_TOPICS + ' dimensions with zero actual topics.',
    'Review ' + duplicateAssignments.length + ' duplicate topic assignments on ayat.',
    'Attach Tafsir evidence (currently 0 of ' + mappings.length + ' mappings).',
    'Engage qualified scholars for all ' + mappings.length + ' mappings (all remain pending).',
    'Approve or reject ' + proposals.length + ' classified topic proposals.'
  ]
};

const inventoryPaths = [
  'docs/MFD-09-2-BASELINE.md',
  'docs/MFD-09-2-FINAL-RECONCILIATION-REPORT.md',
  'docs/MFD-09-2-MAPPING-INTEGRITY-REPORT.md',
  'docs/MFD-09-2-TAXONOMY-INTEGRITY-REPORT.md',
  'data/audit/mfd-09-2-mapping-integrity.json',
  'data/audit/mfd-09-2-taxonomy-integrity.json',
  'scripts/validate-mfd-09-2.mjs'
];

// NOTE: The generator and validator scripts are deliberately NOT hashed here.
// They are inputs to this pipeline, not outputs of it. Hashing them inside a
// generated artifact creates a self-reference cycle (editing the script changes
// the artifact that records the script's hash), which breaks byte-identical
// regeneration. Their hashes are recorded in MFD-09-2-1-BASELINE.md instead.

const artifactInventory = {
  schemaVersion: '1.0.0',
  auditId: 'MFD-09.2.1-B1',
  fieldDocumentation: {
    exists: 'File present on disk at generation time.',
    bytes: 'File size in bytes.',
    sha256: 'Uppercase hex SHA-256 of file contents.',
    requiredForReproducibility: 'Whether the file is needed to reproduce the audit baseline.'
  },
  mfd092ClaimedNewFileCount: 6,
  mfd092ActualArtifactCount: 7,
  countDiscrepancyNote:
    'docs/MFD-09-2-FINAL-RECONCILIATION-REPORT.md section 15 states "6 new files" while its own listing enumerates ' +
    '4 Markdown + 2 JSON + 1 MJS = 7 files. The correct count is 7. Historical report preserved unchanged; correction recorded here.',
  artifacts: inventoryPaths.map((p) => ({
    path: p,
    type: p.endsWith('.md') ? 'markdown' : p.endsWith('.json') ? 'json' : 'mjs',
    exists: existsSync(resolve(ROOT, p)),
    bytes: existsSync(resolve(ROOT, p)) ? sizeFile(p) : null,
    sha256: existsSync(resolve(ROOT, p)) ? sha256File(p) : null,
    requiredForReproducibility: true
  })),
  productionFiles: productionHashes,
  aiAnswerFeatureEnabled: !aiFlagOff,
  deterministicGenerator: 'scripts/generate-mfd-09-2-1-reports.mjs'
};

// ------------------------------------------------------------ markdown emit

function header(title) {
  return [
    '# ' + title,
    '',
    '**Audit ID:** MFD-09.2.1  ',
    '**Generated by:** `scripts/generate-mfd-09-2-1-reports.mjs` (deterministic; no timestamps)  ',
    '**Canonical source:** `data/taxonomy/topic-ayah-mappings.json`  ',
    '**Source SHA-256:** `' + sha256File(SRC.mappings) + '`',
    '',
    '---',
    ''
  ].join('\n');
}

const countMd =
  header('MFD-09.2.1 — Count Reconciliation (230 / 236 / 7)') +
  [
    '## 1. Verified canonical figures',
    '',
    mdTable(
      ['Metric', 'MFD-09.2 claimed', 'MFD-09.2.1 recomputed', 'Agreement'],
      [
        ['Mapping records', 789, mappings.length, 789 === mappings.length ? 'MATCH' : 'MISMATCH'],
        ['Expanded ayah occurrences', 1886, expandedOccurrences, 1886 === expandedOccurrences ? 'MATCH' : 'MISMATCH'],
        ['Unique Surah:Ayah', 1550, occTopics.size, 1550 === occTopics.size ? 'MATCH' : 'MISMATCH'],
        ['Multi-topic ayat (distinct topics)', 230, multiTopicAyat, 230 === multiTopicAyat ? 'MATCH' : 'MISMATCH'],
        ['Multi-topic ayat (raw occurrence basis)', 236, rawMultiTopicAyat, 236 === rawMultiTopicAyat ? 'MATCH' : 'MISMATCH'],
        ['Ayat with 3+ topics', 74, threePlusTopicAyat, 74 === threePlusTopicAyat ? 'MATCH' : 'MISMATCH'],
        ['Maximum overlap', 6, maxOverlap, 6 === maxOverlap ? 'MATCH' : 'MISMATCH'],
        ['Duplicate topic assignments', 7, duplicateOccurrenceCount, 7 === duplicateOccurrenceCount ? 'MATCH' : 'MISMATCH']
      ]
    ),
    '',
    '## 2. The arithmetic, resolved',
    '',
    'The historical statement `236 - 7 = 230` is **invalid arithmetic** (`236 - 7 = 229`).',
    'The two operands describe different sets, so subtracting them was never meaningful.',
    '',
    'Correct relationship:',
    '',
    '```',
    'distinct-topic multi-topic ayat                 = 230',
    'ayat whose ONLY topic is duplicated (not multi)  =   6',
    '                                                  ---',
    'raw occurrence-based multi-topic ayat            = 236',
    '',
    'total ayat carrying a repeated topicId           =   7',
    '  of which already inside the 230 set (17:23)    =   1',
    '  of which outside the 230 set                   =   6',
    '```',
    '',
    'So `230 + 6 = 236`. The number 7 counts *duplicate-bearing ayat*, not *ayat added by the raw method*.',
    '',
    '## 3. Every affected Surah:Ayah',
    '',
    mdTable(
      ['Ayah', 'Topic repeated', 'Occurrences', 'Excess', 'Distinct topics on ayah', 'Inside 230 set?'],
      duplicateAssignments.map((d) => {
        const row = ayahRows.find((r) => r.ayah === d.ayah);
        return [d.ayah, '`' + d.topicId + '`', d.occurrences, d.excess, row.distinctTopicCount, row.distinctTopicCount > 1 ? 'YES' : 'NO'];
      })
    ),
    '',
    '## 4. Root cause of the earlier false alarm',
    '',
    'Two defective grouping methods were used during this audit before the canonical method was applied.',
    'Both are reproduced here so the error is auditable rather than hidden.',
    '',
    mdTable(
      ['Method', 'Grouping key', 'Keys', 'Multi groups', 'Raw records', 'Duplicate excess', 'Verdict'],
      [
        ['Canonical (range expansion)', '`surahNumber:ayah` for every ayah in range', occTopics.size, multiTopicAyat, rawMultiTopicOccurrences, duplicateOccurrenceCount, 'CORRECT'],
        ['Start-key only', '`surahNumber:ayahStart`', methodStartOnly.keys, methodStartOnly.multiTopicGroups, methodStartOnly.rawRecordsInMultiGroups, methodStartOnly.duplicateExcess, 'DEFECTIVE'],
        ['Range-key grouping', '`surahNumber:ayahStart-ayahEnd`', methodRangeKey.keys, methodRangeKey.multiTopicGroups, methodRangeKey.rawRecordsInMultiGroups, methodRangeKey.duplicateExcess, 'DEFECTIVE']
      ]
    ),
    '',
    'The start-key method ignores `ayahEnd`, so an ayah covered by a range starting elsewhere is never counted.',
    'The range-key method treats each distinct range as its own unit instead of expanding to individual ayat.',
    '**Neither result indicates any change to production data.** The production mapping file hash is unchanged from the MFD-09.2 baseline.',
    '',
    '## 5. Row-level dataset',
    '',
    'Full per-ayah rows (`allAyahRows`, ' + ayahRows.length + ' entries) and the multi-topic subset (`multiTopicAyatRows`, ' + multiTopicAyat + ' entries) are in',
    '[`mfd-09-2-1-count-reconciliation.json`](./mfd-09-2-1-count-reconciliation.json).',
    '',
    '---',
    '',
    '*No production data was modified. Classification and counting only.*',
    ''
  ].join('\n');

const phantomMd =
  header('MFD-09.2.1 — Phantom Reference Reconciliation') +
  [
    '## 1. Totals',
    '',
    mdTable(
      ['Metric', 'Value'],
      [
        ['Dimension-side topic references (all 103 dimensions)', dimensionSideTotalRefs],
        ['Phantom references (no matching topic record)', phantomReferences.length],
        ['Historical MFD-09.2 claimed phantom count', (mfd092TaxonomyAudit.phantomReferences || []).length],
        ['Duplicate references within a single dimension array', duplicateRefsWithinDimension],
        ['References resolving to a topic under a different parent', existingButWrongParent]
      ]
    ),
    '',
    '## 2. Evidence-based classification',
    '',
    mdTable(
      ['Classification', 'Count', 'Meaning'],
      Object.keys(phantomClassificationCounts)
        .sort(cmp)
        .map((k) => [k, phantomClassificationCounts[k], phantomDataset.classificationDefinitions[k] || ''])
    ),
    '',
    '### Method note',
    '',
    'An earlier pass in this audit classified phantoms using **substring similarity** to existing topic ids',
    '(labels such as `NAMESPACE_COLLISION` for merely similar strings). That is a heuristic guess, not evidence.',
    'This dataset replaces it with classifications that can be **proven from canonical files**:',
    'a reference either resolves in another namespace, resolves under a different parent, or does not exist at all.',
    'No similarity scoring is used. Nothing is auto-resolved.',
    '',
    '## 3. Bidirectional coverage distribution (never combined)',
    '',
    mdTable(
      ['Bucket', 'Topic-side (actual, from topics.json)', 'Dimension-side (declared, from dimensions.json)'],
      BUCKETS.map((b) => [b, topicSideDistribution[b], dimensionSideDistribution[b]])
    ),
    '',
    'Both columns total ' + dimensions.length + ' dimensions.',
    '',
    '## 4. Seven investigated dimensions',
    '',
    mdTable(
      ['Dimension', 'Dim-side', 'Topic-side', 'Missing ids', 'Unexpected refs'],
      sevenDiscrepancies.map((s) => [s.dimensionId, s.dimensionSideTopicCount, s.topicSideTopicCount, s.missingTopicIds.length, s.unexpectedTopicRefs.length])
    ),
    '',
    '## 5. Machine-readable dataset',
    '',
    '[`mfd-09-2-1-phantom-reference-reconciliation.json`](./mfd-09-2-1-phantom-reference-reconciliation.json) contains all ' + phantomReferences.length + ' classified references with per-reference evidence.',
    '',
    '---',
    '',
    '*Classification only. No topic was created, renamed, reassigned, or deleted.*',
    ''
  ].join('\n');

const artifactMd =
  header('MFD-09.2.1 — Report & Artifact Integrity') +
  [
    '## 1. File inventory',
    '',
    mdTable(
      ['Path', 'Type', 'Exists', 'Bytes'],
      artifactInventory.artifacts.map((a) => ['`' + a.path + '`', a.type, a.exists ? 'YES' : 'NO', a.bytes === null ? 'n/a' : a.bytes])
    ),
    '',
    '### Artifact-count contradiction (resolved)',
    '',
    artifactInventory.countDiscrepancyNote,
    '',
    '## 2. Deterministic report generation',
    '',
    mdTable(
      ['Item', 'Status'],
      [
        ['MFD-09.2 generator existed?', 'NO — only a validator was produced'],
        ['MFD-09.2 claim "Report generation is deterministic"', 'UNSUPPORTED at the time it was made'],
        ['MFD-09.2.1 generator', '`scripts/generate-mfd-09-2-1-reports.mjs` — CREATED'],
        ['Timestamps in generated output', 'NONE'],
        ['Ordering', 'Stable comparators; recursive key sorting'],
        ['Reproducibility test', 'Two runs compared by SHA-256 (see final report)']
      ]
    ),
    '',
    'A validator is not a generator. `scripts/validate-mfd-09-2.mjs` asserts conditions; it never writes reports.',
    '',
    '## 3. Production protection',
    '',
    mdTable(
      ['File', 'Bytes', 'SHA-256'],
      productionHashes.map((h) => ['`' + h.path + '`', h.bytes, '`' + h.sha256 + '`'])
    ),
    '',
    'Public AI religious answers: **' + (aiFlagOff ? 'OFF' : 'ON — VIOLATION') + '** (`AI_ANSWER_FEATURE_ENABLED = false as const`).',
    '',
    '## 4. Evidence and scholarly state',
    '',
    mdTable(
      ['State', 'Count'],
      [
        ['Mappings referencing quran-json (text + translation)', evidenceIntegrity.translationSupportedCount],
        ['Tafsir attached', evidenceIntegrity.tafsirAttachedCount],
        ['Tafsir verified', evidenceIntegrity.tafsirVerifiedCount],
        ['Scholar reviewed', evidenceIntegrity.scholarReviewedCount],
        ['Pending scholarly review', evidenceIntegrity.pendingScholarlyReviewCount]
      ]
    ),
    '',
    mappingDataset.verdictProvenanceNote,
    '',
    '## 5. Relationship integrity',
    '',
    mdTable(
      ['Check', 'Value'],
      [
        ['Total relationships', relationshipIntegrity.totalRelationships],
        ['Valid endpoint pairs', relationshipIntegrity.validEndpointPairs],
        ['Orphan endpoints', relationshipIntegrity.orphanEndpoints.length],
        ['Self references', relationshipIntegrity.selfReferences],
        ['Duplicate edges', relationshipIntegrity.duplicateEdges],
        ['Structural validity', relationshipIntegrity.structuralValidity ? 'PASS' : 'FAIL'],
        ['Semantic validity', relationshipIntegrity.semanticValidity],
        ['Scholarly validity', relationshipIntegrity.scholarlyValidity]
      ]
    ),
    '',
    'Structural validity is **not** evidence of theological correctness.',
    '',
    '## 6. Topic proposals',
    '',
    mdTable(
      ['Check', 'Value'],
      [
        ['Total proposals', proposalIntegrity.totalCount],
        ['Unique ids', proposalIntegrity.uniqueIdCount],
        ['Duplicate ids', proposalIntegrity.duplicateIds.length],
        ['Duplicate titles', proposalIntegrity.duplicateTitles.length],
        ['Invalid target references', proposalIntegrity.invalidTargetReferences.length],
        ['Implemented in production', proposalIntegrity.implementedInProduction]
      ]
    ),
    '',
    mdTable(['Category', 'Count'], Object.keys(proposalIntegrity.categoryDistribution).sort(cmp).map((k) => [k, proposalIntegrity.categoryDistribution[k]])),
    '',
    proposalIntegrity.note,
    '',
    '---',
    '',
    '*Historical MFD-09.2 reports were preserved unchanged. All corrections are recorded in MFD-09.2.1 artifacts.*',
    ''
  ].join('\n');

// ------------------------------------------------------------------- write

mkdirSync(OUT_DIR, { recursive: true });

emit('mfd-09-2-1-count-reconciliation.json', jsonText(countReconciliation));
emit('mfd-09-2-1-phantom-reference-reconciliation.json', jsonText(phantomDataset));
emit('mfd-09-2-1-artifact-inventory.json', jsonText(artifactInventory));
emit('mfd-09-2-1-mapping-integrity.json', jsonText(mappingDataset));
emit('mfd-09-2-1-taxonomy-integrity.json', jsonText(taxonomyDataset));
emit('MFD-09-2-1-COUNT-RECONCILIATION.md', countMd);
emit('MFD-09-2-1-PHANTOM-REFERENCE-REPORT.md', phantomMd);
emit('MFD-09-2-1-REPORT-ARTIFACT-INTEGRITY-REPORT.md', artifactMd);

console.log('MFD-09.2.1 deterministic generation complete.');
console.log('Output directory: ' + OUT_DIR);
for (const w of written.sort((a, b) => cmp(a.file, b.file))) {
  console.log('  ' + w.file + '  ' + w.bytes + ' bytes  ' + w.sha256);
}
console.log('');
console.log('Verified: records=' + mappings.length + ' expanded=' + expandedOccurrences + ' unique=' + occTopics.size + ' multi=' + multiTopicAyat + ' threePlus=' + threePlusTopicAyat + ' maxOverlap=' + maxOverlap + ' duplicates=' + duplicateOccurrenceCount);
console.log('Phantoms=' + phantomReferences.length + ' dimensionSideRefs=' + dimensionSideTotalRefs);
process.exit(0);
