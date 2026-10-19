#!/usr/bin/env node
// PRD §13 / FR-075 + FR-032 — validate the rights register.
//
// Reads src/lib/quran/sources.ts as text (it is the rights register rendered
// on /sources) and asserts that every record carries the fields PRD §9 and
// FR-075 require of a SourceRecord: licence, version, homepage, and a
// delivery method of "package" or "link". Duplicated ids are rejected.
//
// This is a structural check, not a legal opinion: it can prove the licence
// field is present and recorded verbatim, never that a licence grants the
// rights we claim. That judgement lives in docs/DATA-PROVENANCE.md.
//
// Exits 1 on any issue. Usage: node scripts/validate-source-licenses.mjs [--json]

import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcesFile = path.join(root, "src", "lib", "quran", "sources.ts");
const provenanceFile = path.join(root, "docs", "DATA-PROVENANCE.md");

const issues = [];
const records = [];

if (!existsSync(sourcesFile)) {
  console.error(`Missing rights register: ${sourcesFile}`);
  process.exit(2);
}
if (!existsSync(provenanceFile)) {
  issues.push("docs/DATA-PROVENANCE.md is missing (provenance doc required by AI_RULES)");
}

const text = readFileSync(sourcesFile, "utf-8");

// Records are flat object literals in the SOURCES array; the closing brace of
// one entry sits at the array's indentation, which is what makes this split
// deterministic for this file's shape.
const entryPattern = /\{\n    id: "([^"]+)",[\s\S]*?\n  \}/g;
let match;
while ((match = entryPattern.exec(text)) !== null) {
  const block = match[0];
  const id = match[1];
  records.push({ id, block });
}

if (records.length === 0) {
  issues.push("No source records found in src/lib/quran/sources.ts");
}

const seen = new Set();
for (const { id, block } of records) {
  if (seen.has(id)) issues.push(`duplicate source id "${id}"`);
  seen.add(id);

  for (const field of ["license:", "version:", "homepage:", "method:", "attribution:"]) {
    if (!block.includes(field)) issues.push(`source "${id}" is missing ${field}`);
  }

  const methodMatch = /method: "(package|link)"/.exec(block);
  if (!methodMatch) {
    const raw = /method: "([^"]*)"/.exec(block);
    issues.push(
      `source "${id}" has an unknown delivery method ${raw ? `"${raw[1]}"` : "(unreadable)"}`
    );
  }

  // Link-out sources must say so in their licence wording, so the public page
  // and the AI allowlist (method === "package") both agree they are not ours.
  if (methodMatch?.[1] === "link" && !/link|external|not redistributed/i.test(block)) {
    issues.push(
      `source "${id}" is link-out only but does not state that it is not redistributed`
    );
  }
}

const report = {
  sourcesFile,
  recordCount: records.length,
  issueCount: issues.length,
  issues,
};

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(
    `rights register: ${records.length} source record(s), ${issues.length} issue(s)`
  );
  for (const issue of issues) console.error(`  ✗ ${issue}`);
}

process.exit(issues.length === 0 ? 0 : 1);
