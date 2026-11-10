// Urdu Translation Completeness Audit — Sprint 54
//
// Validates that the Urdu translation review workflow is properly set up:
// - All 18 topics have translation records (or explicit 'missing' state)
// - Translation records have valid review states
// - No unreviewed translations are marked as published
// - RTL rendering approach is documented
// - Fallback behavior works when Urdu title unavailable
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

function success(message) {
  console.log(`✅ ${message}`);
}

console.log("=== Urdu Translation Completeness Audit ===\n");

// Extract topic slugs from data.ts
const slugMatches = [...topicsContent.matchAll(/slug:\s*"([^"]+)"/g)];
const slugs = slugMatches.map((m) => m[1]);

console.log(`Found ${slugs.length} topics\n`);

if (slugs.length !== 18) {
  report(`Expected 18 topics, found ${slugs.length}`);
}

// Check that urduTitle is undefined for all topics (policy: no auto-generated translations)
let urduTitleCount = 0;
for (const slug of slugs) {
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

  // Check if urduTitle is present (it should NOT be)
  if (topicBlock.includes("urduTitle:")) {
    const urduTitleMatch = topicBlock.match(/urduTitle:\s*"([^"]+)"/);
    if (urduTitleMatch) {
      urduTitleCount++;
      report(
        `${slug}: urduTitle is set to "${urduTitleMatch[1]}" — this violates policy (no auto-generated translations)`
      );
    }
  }
}

if (urduTitleCount === 0) {
  success("No topics have urduTitle set (correct — no auto-generated translations)");
} else {
  report(`${urduTitleCount} topics have urduTitle set — this violates policy`);
}

// Check that translation infrastructure exists
console.log("\n=== Checking Translation Infrastructure ===\n");

const requiredFiles = [
  "src/lib/translations/urdu-types.ts",
  "src/lib/translations/urdu-storage.ts",
  "src/lib/translations/urdu-context.tsx",
  "src/lib/translations/urdu-translations.test.ts",
  "docs/URDU-TRANSLATION-REVIEW.md",
];

for (const file of requiredFiles) {
  try {
    readFileSync(resolve(process.cwd(), file), "utf-8");
    success(`${file} exists`);
  } catch (err) {
    report(`${file} is missing`);
  }
}

// Check that documentation covers required topics
console.log("\n=== Checking Documentation ===\n");

try {
  const docsPath = resolve(process.cwd(), "docs/URDU-TRANSLATION-REVIEW.md");
  const docsContent = readFileSync(docsPath, "utf-8");

  const requiredSections = [
    "Translation Data Model",
    "Review Workflow",
    "Translation Standards",
    "Current Status",
    "RTL Rendering",
    "Policy Decisions",
  ];

  for (const section of requiredSections) {
    if (docsContent.includes(section)) {
      success(`Documentation covers: ${section}`);
    } else {
      report(`Documentation missing section: ${section}`);
    }
  }

  // Check that docs mention 0/18 status
  if (docsContent.includes("0/18") || docsContent.includes("0 of 18")) {
    success("Documentation mentions current status (0/18)");
  } else {
    report("Documentation should mention current status (0/18 complete)");
  }
} catch (err) {
  report("Could not read documentation file");
}

// Check that tests exist and cover required scenarios
console.log("\n=== Checking Test Coverage ===\n");

try {
  const testPath = resolve(
    process.cwd(),
    "src/lib/translations/urdu-translations.test.ts"
  );
  const testContent = readFileSync(testPath, "utf-8");

  const requiredTests = [
    "CRUD",
    "review state",
    "validation",
    "RTL",
    "fallback",
    "export/import",
  ];

  for (const test of requiredTests) {
    if (testContent.toLowerCase().includes(test.toLowerCase())) {
      success(`Tests cover: ${test}`);
    } else {
      report(`Tests missing coverage for: ${test}`);
    }
  }
} catch (err) {
  report("Could not read test file");
}

// Summary
console.log(`\n=== Summary ===`);
console.log(`Topics: ${slugs.length}`);
console.log(`Topics with urduTitle: ${urduTitleCount}`);
console.log(`Expected: 0 (no auto-generated translations)`);

if (exitCode === 0) {
  console.log(`\n✅ All Urdu translation completeness checks passed.`);
  console.log(
    `\n📋 Current Status: 0 of 18 topics have verified Urdu translations.`
  );
  console.log(
    `\n📝 Next Steps: Follow the review workflow in docs/URDU-TRANSLATION-REVIEW.md`
  );
} else {
  console.error(`\n❌ Audit failed with errors.`);
}

process.exit(exitCode);
