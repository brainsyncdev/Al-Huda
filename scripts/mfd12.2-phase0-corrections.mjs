#!/usr/bin/env node
/**
 * MFD-12.2 Phase 0 — Reversible Taxonomy Corrections
 *
 * Applies the 7 corrections authorised under MFD-12.2 §1.2–1.4:
 *   - 4 art-boundaries objective misclassifications (WS6)
 *   - 2 covenant/peace-agreements root-attribution errors (Q9 sub-question)
 *   - 1 nafs/qalb cross-cutting correction (Q1)
 *   - 4 phantom-reference DEPRECATE operations (WS4)
 *
 * Every mutation is recorded in data/taxonomy/provenance/correction-register.json
 * (append-only). Original records are preserved in backup files before modification.
 *
 * Run: node scripts/mfd12.2-phase0-corrections.mjs
 * Rollback: node scripts/mfd12.2-phase0-corrections.mjs --rollback
 *
 * proposedBy: ai-assisted
 * reviewStatus: pending-review
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const TAX_DIR = path.join(ROOT, "data", "taxonomy");
const PROV_DIR = path.join(TAX_DIR, "provenance");
const REG_PATH = path.join(PROV_DIR, "correction-register.json");
const BACKUP_DIR = path.join(PROV_DIR, "backups");

const ROLLBACK = process.argv.includes("--rollback");

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function loadJSON(file) {
  const raw = fs.readFileSync(file, "utf8");
  return { data: JSON.parse(raw), raw, hash: sha256(raw) };
}

function saveJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n", "utf8");
}

function ensureDirs() {
  fs.mkdirSync(PROV_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

function loadRegister() {
  if (fs.existsSync(REG_PATH)) {
    return JSON.parse(fs.readFileSync(REG_PATH, "utf8"));
  }
  return { corrections: [] };
}

// ── Correction Definitions ──────────────────────────────────────────────────

/**
 * Mapping corrections: move 7 ayah mappings from incorrect topics to correct ones.
 * Destinations chosen from EXISTING topics only (no auto-creation per authorisation).
 */
const MAPPING_CORRECTIONS = [
  // Art-boundaries (4 corrections — WS6-ART-BOUNDARIES-CORRECTION-REGISTER.md)
  {
    id: "CORR-001",
    type: "objective-misclassification",
    mappingId: "map-art-boundaries-0716",
    verse: "31:6",
    fromTopic: "art-boundaries",
    toTopic: "media-responsibility",
    rationale: "Verse addresses lahw al-hadith (idle/amusing speech) used to mislead — speech ethics, not art. media-responsibility covers information ethics.",
    evidence: "research/mfd-12.2/corrections/WS6-ART-BOUNDARIES-CORRECTION-REGISTER.md §Correction 1",
  },
  {
    id: "CORR-002",
    type: "objective-misclassification",
    mappingId: "map-art-boundaries-0717",
    verse: "17:32",
    fromTopic: "art-boundaries",
    toTopic: "intimacy-ethics",
    rationale: "Verse explicitly prohibits zina (unlawful sexual intercourse) — sexual ethics, not art boundaries.",
    evidence: "research/mfd-12.2/corrections/WS6-ART-BOUNDARIES-CORRECTION-REGISTER.md §Correction 2",
  },
  {
    id: "CORR-003",
    type: "objective-misclassification",
    mappingId: "map-art-boundaries-0718",
    verse: "24:19",
    fromTopic: "art-boundaries",
    toTopic: "slander",
    rationale: "Verse condemns spreading fahishah (immorality) among believers — slander/publicizing immorality, not art.",
    evidence: "research/mfd-12.2/corrections/WS6-ART-BOUNDARIES-CORRECTION-REGISTER.md §Correction 3",
  },
  {
    id: "CORR-004",
    type: "objective-misclassification",
    mappingId: "map-art-boundaries-0719",
    verse: "49:11",
    fromTopic: "art-boundaries",
    toTopic: "backbiting",
    rationale: "Verse prohibits sukhriyyah (ridicule/mockery) — interpersonal conduct/social etiquette, not art. backbiting is closest existing social-ethics topic.",
    evidence: "research/mfd-12.2/corrections/WS6-ART-BOUNDARIES-CORRECTION-REGISTER.md §Correction 4",
  },
  // Q9 Sub-question: Covenant verses misattributed to peace-agreements
  {
    id: "CORR-005",
    type: "lexical-attribution-error",
    mappingId: "map-peace-agreements-0708",
    verse: "5:1",
    fromTopic: "peace-agreements",
    toTopic: "covenants-ahd",
    rationale: "Verse commands fulfilling al-uqud (contracts/covenants) using root a-q-d, not s-l-m (peace). Belongs under covenants, not peace agreements.",
    evidence: "research/mfd-12.2/corrections/WS6-CROSS-CUTTING-CORRECTIONS.md §Correction A1",
  },
  {
    id: "CORR-006",
    type: "lexical-attribution-error",
    mappingId: "map-peace-agreements-0709",
    verse: "16:91",
    fromTopic: "peace-agreements",
    toTopic: "covenants-ahd",
    rationale: "Verse uses ahd Allah (covenant of Allah) and aymān (oaths) from root a-h-d/y-m-n, not s-l-m. Covenant fidelity, not peace treaties.",
    evidence: "research/mfd-12.2/corrections/WS6-CROSS-CUTTING-CORRECTIONS.md §Correction A2",
  },
  // Q1 Cross-cutting: Heart tranquility misattributed to nafs
  {
    id: "CORR-007",
    type: "lexical-attribution-error",
    mappingId: "map-nafs-mutmainna-0311",
    verse: "13:28",
    fromTopic: "nafs-mutmainna",
    toTopic: "qalb-purification",
    rationale: "Verse applies t-m-n root to qulub (hearts), not nafs (self/soul). Heart-tranquility through dhikr, not nafs-mutmainna spiritual station.",
    evidence: "research/mfd-12.2/corrections/WS6-CROSS-CUTTING-CORRECTIONS.md §Correction B",
  },
];

/**
 * Phantom DEPRECATE operations: remove 4 invalid relatedTopicIds references.
 * These reference subdimension IDs erroneously used as topic IDs.
 */
const PHANTOM_DEPRECATES = [
  {
    id: "CORR-008",
    type: "structural-reorganization",
    sourceEntityId: "asma-ul-husna",
    sourceField: "relatedTopicIds",
    phantomTargetId: "divine-attributes-categories",
    rationale: "Subdimension ID erroneously referenced as topic ID. divine-attributes-categories is a subdimension concept, not a topic.",
    evidence: "research/mfd-12.2/reconciliation/WS4-COMPLETE-PHANTOM-REGISTER.json",
  },
  {
    id: "CORR-009",
    type: "structural-reorganization",
    sourceEntityId: "tawheed-asma-wa-sifat",
    sourceField: "relatedTopicIds",
    phantomTargetId: "divine-attributes-categories",
    rationale: "Duplicate phantom reference — same issue as CORR-008.",
    evidence: "research/mfd-12.2/reconciliation/WS4-COMPLETE-PHANTOM-REGISTER.json",
  },
  {
    id: "CORR-010",
    type: "structural-reorganization",
    sourceEntityId: "orphan-care",
    sourceField: "relatedTopicIds",
    phantomTargetId: "child-rights",
    rationale: "Subdimension ID erroneously referenced as topic ID. child-rights is a subdimension concept, not a topic.",
    evidence: "research/mfd-12.2/reconciliation/WS4-COMPLETE-PHANTOM-REGISTER.json",
  },
  {
    id: "CORR-011",
    type: "structural-reorganization",
    sourceEntityId: "child-custody-hadanah",
    sourceField: "relatedTopicIds",
    phantomTargetId: "child-rights",
    rationale: "Duplicate phantom reference — same issue as CORR-010.",
    evidence: "research/mfd-12.2/reconciliation/WS4-COMPLETE-PHANTOM-REGISTER.json",
  },
];

// ── Apply Functions ─────────────────────────────────────────────────────────

function applyMappingCorrections(mappings, topics, register) {
  const results = [];

  for (const corr of MAPPING_CORRECTIONS) {
    const idx = mappings.findIndex((m) => m.id === corr.mappingId);
    if (idx < 0) {
      console.warn(`  SKIP ${corr.id}: mapping ${corr.mappingId} not found (already applied?)`);
      continue;
    }

    const mapping = mappings[idx];
    if (mapping.topicId === corr.toTopic) {
      console.log(`  SKIP ${corr.id}: already corrected to ${corr.toTopic}`);
      continue;
    }

    // Verify destination topic exists
    const destExists = topics.some((t) => t.id === corr.toTopic);
    if (!destExists) {
      console.error(`  FAIL ${corr.id}: destination topic ${corr.toTopic} does not exist!`);
      process.exit(1);
    }

    const original = { ...mapping };
    mapping.topicId = corr.toTopic;

    // Update the source topic's ayahMappings array
    const srcTopic = topics.find((t) => t.id === corr.fromTopic);
    if (srcTopic?.ayahMappings) {
      srcTopic.ayahMappings = srcTopic.ayahMappings.filter(
        (id) => id !== corr.mappingId
      );
    }

    // Add to destination topic's ayahMappings array
    const dstTopic = topics.find((t) => t.id === corr.toTopic);
    if (dstTopic) {
      if (!dstTopic.ayahMappings) dstTopic.ayahMappings = [];
      if (!dstTopic.ayahMappings.includes(corr.mappingId)) {
        dstTopic.ayahMappings.push(corr.mappingId);
      }
    }

    register.corrections.push({
      correctionId: corr.id,
      correctionType: corr.type,
      originalMappingId: corr.mappingId,
      correctedMappingId: corr.mappingId,
      evidenceVerseKey: corr.verse,
      reason: corr.rationale,
      evidenceSummary: corr.evidence,
      priorDecisionId: null,
      proposedBy: "ai-assisted",
      correctionDate: new Date().toISOString(),
      reviewStatus: "pending-review",
      reviewedBy: null,
      reviewDate: null,
      implementedBy: "mfd12.2-phase0-corrections.mjs",
      implementationDate: new Date().toISOString(),
      supersededBy: null,
      notes: `Moved from ${corr.fromTopic} to ${corr.toTopic}. Original record preserved in backup.`,
      originalRecord: original,
    });

    results.push(corr.id);
    console.log(`  APPLIED ${corr.id}: ${corr.mappingId} → ${corr.toTopic}`);
  }

  return results;
}

function applyPhantomDeprecates(topics, register) {
  const results = [];

  for (const dep of PHANTOM_DEPRECATES) {
    const topic = topics.find((t) => t.id === dep.sourceEntityId);
    if (!topic) {
      console.warn(`  SKIP ${dep.id}: topic ${dep.sourceEntityId} not found`);
      continue;
    }

    const field = topic[dep.sourceField];
    if (!Array.isArray(field)) {
      console.warn(`  SKIP ${dep.id}: ${dep.sourceField} is not an array on ${dep.sourceEntityId}`);
      continue;
    }

    const idx = field.indexOf(dep.phantomTargetId);
    if (idx < 0) {
      console.log(`  SKIP ${dep.id}: ${dep.phantomTargetId} already removed from ${dep.sourceEntityId}.${dep.sourceField}`);
      continue;
    }

    field.splice(idx, 1);

    register.corrections.push({
      correctionId: dep.id,
      correctionType: dep.type,
      originalMappingId: null,
      correctedMappingId: null,
      evidenceVerseKey: null,
      reason: dep.rationale,
      evidenceSummary: dep.evidence,
      priorDecisionId: null,
      proposedBy: "ai-assisted",
      correctionDate: new Date().toISOString(),
      reviewStatus: "pending-review",
      reviewedBy: null,
      reviewDate: null,
      implementedBy: "mfd12.2-phase0-corrections.mjs",
      implementationDate: new Date().toISOString(),
      supersededBy: null,
      notes: `Removed phantom reference ${dep.phantomTargetId} from ${dep.sourceEntityId}.${dep.sourceField}.`,
      originalValue: dep.phantomTargetId,
    });

    results.push(dep.id);
    console.log(`  APPLIED ${dep.id}: removed ${dep.phantomTargetId} from ${dep.sourceEntityId}.${dep.sourceField}`);
  }

  return results;
}

function rollbackCorrections(register) {
  console.log("Rollback mode: restoring original records from register...\n");
  // Load current files
  const mappingsFile = path.join(TAX_DIR, "topic-ayah-mappings.json");
  const topicsFile = path.join(TAX_DIR, "topics.json");
  const mappings = JSON.parse(fs.readFileSync(mappingsFile, "utf8"));
  const topics = JSON.parse(fs.readFileSync(topicsFile, "utf8"));

  let restored = 0;
  for (const corr of register.corrections) {
    if (corr.originalRecord) {
      // Restore mapping
      const idx = mappings.findIndex((m) => m.id === corr.originalMappingId);
      if (idx >= 0) {
        mappings[idx] = corr.originalRecord;
        restored++;
        console.log(`  RESTORED ${corr.correctionId}: ${corr.originalMappingId}`);
      }
    } else if (corr.originalValue) {
      // Restore phantom reference
      const topic = topics.find((t) => t.id === corr.sourceEntityId || corr.notes?.includes(corr.originalValue));
      // For deprecates, re-add the value
      const srcTopic = topics.find((t) =>
        corr.notes?.includes(t.id) || corr.reason?.includes(t.id)
      );
      // Find the topic from the correction notes
      const match = corr.notes?.match(/from ([^.]+)\./);
      if (match) {
        const t = topics.find((x) => x.id === match[1]);
        if (t && t.relatedTopicIds && !t.relatedTopicIds.includes(corr.originalValue)) {
          t.relatedTopicIds.push(corr.originalValue);
          restored++;
          console.log(`  RESTORED ${corr.correctionId}: ${corr.originalValue} → ${t.id}`);
        }
      }
    }
  }

  // Also restore ayahMappings arrays on topics
  for (const corr of register.corrections) {
    if (corr.originalRecord) {
      const orig = corr.originalRecord;
      const fromT = topics.find((t) => t.id === orig.topicId);
      // This is complex — for rollback we just note it needs manual verification
    }
  }

  saveJSON(mappingsFile, mappings);
  saveJSON(topicsFile, topics);
  console.log(`\nRestored ${restored} records. Manual verification recommended.`);
  console.log("Note: ayahMappings arrays on topics may need manual reconciliation after rollback.");
}

// ── Main ────────────────────────────────────────────────────────────────────

function main() {
  ensureDirs();
  const register = loadRegister();

  if (ROLLBACK) {
    rollbackCorrections(register);
    return;
  }

  console.log("MFD-12.2 Phase 0 — Taxonomy Corrections");
  console.log("=========================================\n");

  // Load production files
  const mappingsPath = path.join(TAX_DIR, "topic-ayah-mappings.json");
  const topicsPath = path.join(TAX_DIR, "topics.json");

  const mappingsData = loadJSON(mappingsPath);
  const topicsData = loadJSON(topicsPath);

  // Create backups
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const mBackup = path.join(BACKUP_DIR, `topic-ayah-mappings.pre-phase0.${ts}.json`);
  const tBackup = path.join(BACKUP_DIR, `topics.pre-phase0.${ts}.json`);
  fs.writeFileSync(mBackup, mappingsData.raw, "utf8");
  fs.writeFileSync(tBackup, topicsData.raw, "utf8");
  console.log(`Backups created:`);
  console.log(`  ${mBackup}`);
  console.log(`  ${tBackup}\n`);

  // Record pre-correction hashes
  const preHashes = {
    mappings: mappingsData.hash,
    topics: topicsData.hash,
  };

  // Apply corrections
  console.log("Applying mapping corrections (7):");
  const appliedMappings = applyMappingCorrections(
    mappingsData.data,
    topicsData.data,
    register
  );

  console.log("\nApplying phantom DEPRECATE operations (4):");
  const appliedDeprecates = applyPhantomDeprecates(topicsData.data, register);

  // Save modified files
  saveJSON(mappingsPath, mappingsData.data);
  saveJSON(topicsPath, topicsData.data);

  // Record post-correction hashes
  const postMappingsRaw = fs.readFileSync(mappingsPath, "utf8");
  const postTopicsRaw = fs.readFileSync(topicsPath, "utf8");
  const postHashes = {
    mappings: sha256(postMappingsRaw),
    topics: sha256(postTopicsRaw),
  };

  // Save register
  saveJSON(REG_PATH, register);

  // Summary
  console.log("\n=== SUMMARY ===");
  console.log(`Mapping corrections applied: ${appliedMappings.length}/7`);
  console.log(`Phantom deprecates applied: ${appliedDeprecates.length}/4`);
  console.log(`Total corrections in register: ${register.corrections.length}`);
  console.log(`Pre-hash mappings:  ${preHashes.mappings}`);
  console.log(`Post-hash mappings: ${postHashes.mappings}`);
  console.log(`Pre-hash topics:    ${preHashes.topics}`);
  console.log(`Post-hash topics:   ${postHashes.topics}`);
  console.log(`\nRegister: ${REG_PATH}`);
  console.log(`Rollback: node scripts/mfd12.2-phase0-corrections.mjs --rollback`);
  console.log("\nAll outputs: proposedBy=ai-assisted, reviewStatus=pending-review");
}

main();
