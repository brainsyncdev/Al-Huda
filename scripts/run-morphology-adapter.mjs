// Temporary script to run the morphology adapter and report validation results.
// Uses dynamic import so we can load the TS adapter via tsx.

import { loadMorphologyData } from "../src/lib/morphology/adapter.ts";

console.log("Loading morphology data...");
const report = loadMorphologyData();

console.log("\n=== MORPHOLOGY VALIDATION REPORT ===");
console.log("Total records:", report.totalRecords);
console.log("Valid records:", report.validRecords);
console.log("Invalid records:", report.invalidRecords);
console.log("Warning records:", report.warningRecords);
console.log("\nIssue breakdown:");
console.log("  Missing ayah refs:", report.missingAyahRefs);
console.log("  Token mismatches:", report.tokenMismatches);
console.log("  Duplicates:", report.duplicates);
console.log("  No root:", report.noRoot);
console.log("  No lemma:", report.noLemma);

if (report.sampleIssues.length > 0) {
  console.log("\n=== SAMPLE ISSUES (first 10) ===");
  report.sampleIssues.slice(0, 10).forEach((issue, i) => {
    console.log(`${i + 1}. Record ${issue.recordIndex}: ${issue.issue.code} - ${issue.issue.message}`);
  });
}
