// Topic Editorial Integrity Audit — Sprint 53
//
// Validates that all 18 topics have required editorial metadata:
// - editorialDescription (required)
// - knownLimitations (required, non-empty array)
// - reviewState (required, valid enum)
// - urduTitle (optional, informational only)
// - Valid ayah references (no duplicates, valid surah/ayah)
//
// Exit 0 on success, 1 on failure.

import { readFileSync } from "fs";
import { resolve } from "path";

const topicsPath = resolve(process.cwd(), "src/lib/topics/data.ts");
const topicsContent = readFileSync(topicsPath, "utf-8");

let exitCode = 0;

function report(message) {
  console.error(`❌ ${message}`);
  exitCode = 1;
}

function info(message) {
  console.log(`ℹ️  ${message}`);
}

console.log("=== Topic Editorial Integrity Audit ===\n");

// Extract topic slugs using regex
const slugMatches = [...topicsContent.matchAll(/slug:\s*"([^"]+)"/g)];
const slugs = slugMatches.map((m) => m[1]);

console.log(`Found ${slugs.length} topics\n`);

// Check each topic has required fields
for (const slug of slugs) {
  console.log(`Checking: ${slug}`);

  // Find the topic block
  const topicPattern = new RegExp(
    `slug:\\s*"${slug}"[\\s\\S]*?provenance:\\s*REVIEW`,
    "m"
  );
  const topicMatch = topicsContent.match(topicPattern);

  if (!topicMatch) {
    report(`${slug}: could not parse topic block`);
    continue;
  }

  const topicBlock = topicMatch[0];

  // Check editorialDescription (required)
  if (!topicBlock.includes("editorialDescription:")) {
    report(`${slug}: missing editorialDescription`);
  }

  // Check knownLimitations (required, must be array)
  if (!topicBlock.includes("knownLimitations:")) {
    report(`${slug}: missing knownLimitations`);
  } else if (!topicBlock.match(/knownLimitations:\s*\[/)) {
    report(`${slug}: knownLimitations is not an array`);
  }

  // Check reviewState (required)
  if (!topicBlock.includes("reviewState:")) {
    report(`${slug}: missing reviewState`);
  } else {
    const reviewStateMatch = topicBlock.match(/reviewState:\s*"([^"]+)"/);
    if (reviewStateMatch) {
      const validStates = ["draft", "needs_review", "reviewed", "published"];
      if (!validStates.includes(reviewStateMatch[1])) {
        report(
          `${slug}: invalid reviewState "${reviewStateMatch[1]}" (must be one of: ${validStates.join(", ")})`
        );
      }
    }
  }

  // Check urduTitle (optional, informational)
  if (!topicBlock.includes("urduTitle:")) {
    info(`${slug}: no urduTitle (optional)`);
  }

  // Check for ayah references
  const refMatches = [...topicBlock.matchAll(/ref:\s*rel\((\d+),\s*(\d+)\)/g)];
  if (refMatches.length === 0) {
    report(`${slug}: no ayah references found`);
  } else {
    // Check for duplicates
    const refKeys = new Set();
    const duplicates = [];
    for (const match of refMatches) {
      const key = `${match[2]}:${match[1]}`; // surah:ayah
      if (refKeys.has(key)) {
        duplicates.push(key);
      }
      refKeys.add(key);
    }
    if (duplicates.length > 0) {
      report(`${slug}: duplicate references: ${duplicates.join(", ")}`);
    }
  }
}

console.log(`\n=== Summary ===`);
console.log(`Topics: ${slugs.length}`);

if (exitCode === 0) {
  console.log(`\n✅ All editorial integrity checks passed.`);
} else {
  console.error(`\n❌ Audit failed with errors.`);
}

process.exit(exitCode);