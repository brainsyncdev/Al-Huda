// Morphology record validators.
//
// Validates morphology records against the canonical Quran dataset. Checks:
//   - Every ayah reference resolves to an existing ayah.
//   - Arabic tokens are non-empty.
//   - Root and lemma, when present, are non-empty.
//   - Duplicate records are detected (same ref + wordPosition + token).
//   - Missing root/lemma fields are counted.
//
// These validators are independently testable — they don't require the actual
// morphology dataset, only the canonical Quran data (quran-json).
//
// Word-position validation against word-data is intentionally NOT done here
// because word-data is loaded on demand via client-side fetch. A separate
// alignment validator (future sprint) will compare word-data tokens against
// morphology tokens once both are available in the same context.

import type {
  MorphologyRecord,
  MorphologyValidationResult,
  MorphologyValidationIssue,
  MorphologyDiscrepancyReport,
} from "./types";
import { getAyah, getSurah } from "@/lib/quran/data";

/**
 * Validate a single morphology record against the canonical dataset.
 */
export function validateMorphologyRecord(
  record: MorphologyRecord
): MorphologyValidationResult {
  const issues: MorphologyValidationIssue[] = [];

  // Check 1: surah must exist
  const surah = getSurah(record.ref.surah);
  if (!surah) {
    issues.push({
      code: "invalid-surah-ref",
      message: `Surah ${record.ref.surah} does not exist in the canonical dataset`,
      severity: "error",
    });
  } else {
    // Check 2: ayah reference must resolve (only if surah is valid)
    const ayah = getAyah(record.ref.surah, record.ref.ayah);
    if (!ayah) {
      issues.push({
        code: "invalid-ayah-ref",
        message: `Ayah ${record.ref.surah}:${record.ref.ayah} does not exist in the canonical dataset`,
        severity: "error",
      });
    }
  }

  // Check 3: token must not be empty
  if (!record.token || record.token.trim() === "") {
    issues.push({
      code: "empty-token",
      message: `Token field is empty at ${record.ref.surah}:${record.ref.ayah}`,
      severity: "error",
    });
  }

  // Check 4: canonicalArabic must not be empty
  if (!record.canonicalArabic || record.canonicalArabic.trim() === "") {
    issues.push({
      code: "empty-canonical-arabic",
      message: `Canonical Arabic field is empty at ${record.ref.surah}:${record.ref.ayah}`,
      severity: "error",
    });
  }

  // Check 5: wordPosition, if present, must be positive
  if (
    record.wordPosition !== undefined &&
    (!Number.isInteger(record.wordPosition) || record.wordPosition < 1)
  ) {
    issues.push({
      code: "invalid-word-position",
      message: `Word position ${record.wordPosition} is not a positive integer at ${record.ref.surah}:${record.ref.ayah}`,
      severity: "error",
    });
  }

  // Check 6: root, if present, must not be empty
  if (record.root !== undefined && record.root.trim() === "") {
    issues.push({
      code: "empty-root",
      message: `Root field is present but empty at ${record.ref.surah}:${record.ref.ayah}`,
      severity: "warning",
    });
  }

  // Check 7: lemma, if present, must not be empty
  if (record.lemma !== undefined && record.lemma.trim() === "") {
    issues.push({
      code: "empty-lemma",
      message: `Lemma field is present but empty at ${record.ref.surah}:${record.ref.ayah}`,
      severity: "warning",
    });
  }

  return {
    valid: issues.filter((i) => i.severity === "error").length === 0,
    issues,
  };
}

/**
 * Validate a batch of morphology records. Returns a discrepancy report
 * summarizing valid/invalid/warning counts and specific issue types.
 */
export function validateMorphologyBatch(
  records: MorphologyRecord[]
): MorphologyDiscrepancyReport {
  const report: MorphologyDiscrepancyReport = {
    totalRecords: records.length,
    validRecords: 0,
    invalidRecords: 0,
    warningRecords: 0,
    missingAyahRefs: 0,
    tokenMismatches: 0,
    duplicates: 0,
    noRoot: 0,
    noLemma: 0,
    sampleIssues: [],
  };

  const seen = new Set<string>();

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const result = validateMorphologyRecord(record);
    const hasErrors = result.issues.some((iss) => iss.severity === "error");
    const hasWarnings = result.issues.some((iss) => iss.severity === "warning");

    if (!hasErrors && !hasWarnings) {
      report.validRecords++;
    } else if (!hasErrors) {
      report.warningRecords++;
    } else {
      report.invalidRecords++;
    }

    for (const issue of result.issues) {
      if (
        issue.code === "invalid-ayah-ref" ||
        issue.code === "invalid-surah-ref"
      ) {
        report.missingAyahRefs++;
      }
      if (issue.code === "token-mismatch") {
        report.tokenMismatches++;
      }

      // Collect sample issues (up to 50)
      if (report.sampleIssues.length < 50) {
        report.sampleIssues.push({ recordIndex: i, issue });
      }
    }

    // Count missing root/lemma
    if (!record.root) {
      report.noRoot++;
    }
    if (!record.lemma) {
      report.noLemma++;
    }

    // Detect duplicates (same ref + wordPosition + token)
    const key = `${record.ref.surah}:${record.ref.ayah}:${record.wordPosition ?? ""}:${record.token}`;
    if (seen.has(key)) {
      report.duplicates++;
    } else {
      seen.add(key);
    }
  }

  return report;
}
