// MFD-11 semantic audit — READ ONLY.
// The schema validator proves shape, corpus grounding, and key-range coverage.
// It cannot prove that a record's PROSE describes the verses it cites.
// This audit measures mechanical proxies for that gap so defects are visible
// instead of silently committed.
//
// Checks:
//  A. arabicExcerpts must equal the full verbatim verse text for their key.
//     (A partial excerpt is legal, but a mismatched one signals hand-typing.)
//  B. Every candidate evidence excerpt must be the FULL verse for its key,
//     per the generator convention adopted after pilot 2.
//  C. Passage labels longer than 400 chars are flagged: these were produced by
//     pasting whole suggested summaries rather than describing the passage.
//  D. Duplicate subordinate-subject labels within one record.
//  E. Cross-record duplicate subordinate labels (possible content bleed).
//  F. Candidate definition verse-citation vs evidence key agreement.
//     Definitions conventionally open with "In S:A:" — if that cited ayah is
//     not among the candidate's evidence keys, flag it.
//
// Exit code is always 0; this is a report, not a gate.

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const RESEARCH = path.join(ROOT, "research", "mfd-11");
const CORPUS_DIR = path.join(ROOT, "node_modules", "quran-json", "dist", "chapters", "en");

const corpusCache = new Map();
function verseText(surah, ayah) {
  if (!corpusCache.has(surah)) {
    const j = JSON.parse(readFileSync(path.join(CORPUS_DIR, `${surah}.json`), "utf8"));
    const m = new Map();
    for (const v of j.verses) m.set(v.id, v.text);
    corpusCache.set(surah, m);
  }
  return corpusCache.get(surah).get(ayah);
}

function keyParts(key) {
  const [s, a] = key.split(":").map(Number);
  return { s, a };
}

const extDir = path.join(RESEARCH, "extractions");
const candDir = path.join(RESEARCH, "candidates");
const extFiles = readdirSync(extDir).filter(f => f.endsWith(".json")).sort();
const candFiles = readdirSync(candDir).filter(f => f.endsWith(".json")).sort();

const findings = [];
function flag(file, kind, detail) {
  findings.push({ file, kind, detail });
}

const labelIndex = new Map(); // normalized label -> [locations]

let recordsRead = 0;
for (const f of extFiles) {
  const rel = `extractions/${f}`;
  const j = JSON.parse(readFileSync(path.join(extDir, f), "utf8"));
  recordsRead++;
  const surah = j.surah;
  const lo = j.passage.fromAyah;
  const hi = j.passage.toAyah;

  // A: excerpt fidelity
  for (const e of j.arabicExcerpts || []) {
    const { s, a } = keyParts(e.key);
    const full = verseText(s, a);
    if (full === undefined) {
      flag(rel, "A_missing_verse", `${e.key} not in corpus`);
    } else if (e.text !== full) {
      flag(rel, "A_partial_excerpt", `${e.key}: excerpt length ${e.text.length} vs verse ${full.length}`);
    }
  }

  // C: oversized labels
  if ((j.passage.label || "").length > 400) {
    flag(rel, "C_long_label", `passage.label ${j.passage.label.length} chars (range ${surah}:${lo}-${hi})`);
  }
  if ((j.mainSubject?.label || "").length > 700) {
    flag(rel, "C_long_main_subject", `mainSubject.label ${j.mainSubject.label.length} chars`);
  }

  // D + E: subordinate labels
  const seen = new Set();
  for (const sub of j.subordinateSubjects || []) {
    const norm = (sub.label || "").trim().toLowerCase();
    if (seen.has(norm)) flag(rel, "D_dup_subordinate", sub.label);
    seen.add(norm);
    if (!labelIndex.has(norm)) labelIndex.set(norm, []);
    labelIndex.get(norm).push(`${rel} [${(sub.keys || []).join(",")}]`);
  }
}

// E: cross-record duplicates
for (const [norm, locs] of labelIndex) {
  const files = new Set(locs.map(l => l.split(" ")[0]));
  if (files.size > 1) {
    flag("(cross-record)", "E_shared_subordinate", `"${norm.slice(0, 90)}" in ${[...files].join(" | ")}`);
  }
}

let candidatesRead = 0;
for (const f of candFiles) {
  const rel = `candidates/${f}`;
  const j = JSON.parse(readFileSync(path.join(candDir, f), "utf8"));
  for (const c of j.candidates || []) {
    candidatesRead++;
    const evKeys = new Set((c.evidence || []).map(e => e.key));

    // B: evidence excerpt must be full verse
    for (const e of c.evidence || []) {
      const { s, a } = keyParts(e.key);
      const full = verseText(s, a);
      if (full === undefined) {
        flag(rel, "B_missing_verse", `${c.candidateId} ${e.key}`);
      } else if (e.excerpt !== full) {
        flag(rel, "B_partial_evidence", `${c.candidateId} ${e.key}: ${e.excerpt.length} vs ${full.length}`);
      }
    }

    // F: definition citation vs evidence keys
    const m = (c.definition || "").match(/\bIn\s+(\d+):(\d+)(?:\s*[-–]\s*(\d+))?/i);
    if (m) {
      const cited = `${Number(m[1])}:${Number(m[2])}`;
      if (!evKeys.has(cited)) {
        flag(rel, "F_definition_key_mismatch", `${c.candidateId}: definition cites ${cited}, evidence keys [${[...evKeys].join(",")}]`);
      }
    }
  }
}

console.log("MFD-11 SEMANTIC AUDIT (read-only)");
console.log(`  extraction records: ${recordsRead}`);
console.log(`  candidates: ${candidatesRead}`);
console.log(`  findings: ${findings.length}`);
console.log("");

const byKind = new Map();
for (const x of findings) {
  if (!byKind.has(x.kind)) byKind.set(x.kind, []);
  byKind.get(x.kind).push(x);
}
for (const kind of [...byKind.keys()].sort()) {
  const rows = byKind.get(kind);
  console.log(`[${kind}] ${rows.length}`);
  for (const r of rows.slice(0, 40)) console.log(`  ${r.file} :: ${r.detail}`);
  if (rows.length > 40) console.log(`  ... ${rows.length - 40} more`);
  console.log("");
}
if (findings.length === 0) console.log("No mechanical semantic anomalies detected.");
