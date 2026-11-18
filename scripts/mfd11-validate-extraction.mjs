// MFD-11 extraction validator — RESEARCH-ONLY tooling.
//
// Implements the contracts in research/mfd-11/schemas/*.schema.json plus the
// corpus-grounding checks that JSON Schema alone cannot express:
//   * every cited surah:ayah key must exist in the pinned quran-json corpus
//   * every Arabic excerpt must be a VERBATIM substring of the corpus text
//     for its own key (no normalization, no reconstruction)
//   * divine-name and terminology terms must occur verbatim in a cited verse
//   * extraction verseKeys must exactly cover the declared passage range
//   * every record must be proposedBy "ai-assisted" and
//     reviewStatus "pending-scholarly-review" (no auto-approval)
//   * existingTopicOverlap references must resolve in the named catalog layer
//
// Usage:
//   node scripts/mfd11-validate-extraction.mjs <file.json> [more.json ...]
//
// Accepts: a passage-extraction object, a single topic-candidate object,
// a candidates array, or a { workstream, generatedAt, candidates: [...] } batch.
// Exit 0 = all valid. Exit 1 = any error (each listed).

import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORPUS_DIR = path.join(ROOT, "node_modules", "quran-json", "dist", "chapters", "en");

const inputs = process.argv.slice(2);
if (inputs.length === 0) {
  console.error("usage: node scripts/mfd11-validate-extraction.mjs <file.json> [more.json ...]");
  process.exit(1);
}

// ─── Load the pinned corpus (read-only) ──────────────────────────────────────
const verses = new Map(); // "s:a" -> verbatim Arabic text
const surahVerseCount = new Map();
for (let n = 1; n <= 114; n++) {
  const ch = JSON.parse(readFileSync(path.join(CORPUS_DIR, `${n}.json`), "utf8"));
  surahVerseCount.set(n, ch.verses.length);
  for (const v of ch.verses) verses.set(`${n}:${v.id}`, v.text);
}

// ─── Load production catalogs (read-only) for overlap resolution ─────────────
const scholarlyIds = new Set(
  JSON.parse(readFileSync(path.join(ROOT, "data", "taxonomy", "topics.json"), "utf8")).map((t) => t.id)
);
const curatedSlugs = new Set(
  [...readFileSync(path.join(ROOT, "src", "lib", "topics", "data.ts"), "utf8").matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1])
);

// ─── Constants mirroring the schemas ─────────────────────────────────────────
const KEY_RE = /^([1-9][0-9]{0,2}):([1-9][0-9]{0,2})$/;
const EVIDENCE_CLASSES = new Set(["EXPLICIT_TEXT", "THEMATIC", "CONTEXTUAL"]);
const CMD_KINDS = new Set(["COMMAND", "PROHIBITION", "TAUGHT_SUPPLICATION"]);
const LAYERS = new Set(["curated", "scholarly"]);
const RELATIONSHIPS = new Set(["same-concept", "related-not-identical", "broader", "narrower", "uncertain"]);
const EXT_ID_RE = /^ext-([0-9]{3})-p[0-9]+$/;
const CAND_ID_RE = /^cand-[0-9]{4}$/;

const EXT_FIELDS = new Set(["extractionId","workstream","pass","surah","surahName","passage","verseKeys","arabicExcerpts","mainSubject","subordinateSubjects","commandsAndProhibitions","divineNamesAndAttributes","propheticNarratives","humanConditionsAndSpiritualStates","relationships","socialEconomicCivilisational","terminology","topicCandidateIds","notes","proposedBy","reviewStatus","createdAt"]);
const CAND_FIELDS = new Set(["candidateId","label","arabicLabel","urduLabel","definition","definitionStatus","evidence","existingTopicOverlap","notes","proposedBy","reviewStatus","createdAt"]);
const LINK_FIELDS = new Set(["key","excerpt","evidenceClass","rationale"]);
const SUBJECT_FIELDS = new Set(["label","keys","evidenceClass","notes"]);
const PASSAGE_FIELDS = new Set(["fromAyah","toAyah","label"]);

const errors = [];
const stats = { extractions: 0, candidates: 0, evidenceLinks: 0, excerptsVerified: 0, keysReferenced: new Set() };
const seenExtIds = new Set();
const seenCandIds = new Set();

const err = (where, msg) => errors.push(`${where}: ${msg}`);
const nonEmpty = (x) => typeof x === "string" && x.trim().length > 0;
const validKey = (k) => typeof k === "string" && KEY_RE.test(k) && verses.has(k);

function unknownFields(where, obj, allowed) {
  for (const k of Object.keys(obj)) if (!allowed.has(k)) err(where, `unknown field "${k}" (schema forbids additional properties)`);
}

function checkKeys(where, keys, scope) {
  if (!Array.isArray(keys) || keys.length === 0) { err(where, "keys must be a non-empty array"); return []; }
  const ok = [];
  for (const k of keys) {
    if (!validKey(k)) err(where, `unknown or malformed verse key "${k}"`);
    else if (scope && !scope.has(k)) err(where, `key ${k} is outside the declared passage`);
    else { ok.push(k); stats.keysReferenced.add(k); }
  }
  return ok;
}

function checkVerbatimAgainst(where, text, keys) {
  if (!nonEmpty(text)) { err(where, "excerpt/term must be a non-empty string"); return; }
  const hit = keys.some((k) => verses.has(k) && verses.get(k).includes(text));
  if (!hit) err(where, `NOT a verbatim substring of any cited verse: "${text}"`);
  else stats.excerptsVerified++;
}

function checkProvenance(where, rec) {
  if (rec.workstream !== undefined && rec.workstream !== "MFD-11") err(where, 'workstream must be "MFD-11"');
  if (rec.proposedBy !== "ai-assisted") err(where, 'proposedBy must be "ai-assisted"');
  if (rec.reviewStatus !== "pending-scholarly-review") err(where, 'reviewStatus must be "pending-scholarly-review" — no auto-approval');
  if (!nonEmpty(rec.createdAt) || Number.isNaN(Date.parse(rec.createdAt))) err(where, "createdAt must be an ISO date-time string");
}

function checkSubject(where, s, scope) {
  if (typeof s !== "object" || s === null || Array.isArray(s)) { err(where, "subject must be an object"); return; }
  unknownFields(where, s, SUBJECT_FIELDS);
  if (!nonEmpty(s.label)) err(where, "subject.label is required");
  if (!EVIDENCE_CLASSES.has(s.evidenceClass)) err(where, `invalid evidenceClass "${s.evidenceClass}"`);
  checkKeys(`${where}.keys`, s.keys, scope);
  if (s.notes !== undefined && typeof s.notes !== "string") err(where, "notes must be a string");
}

function checkSubjectArray(where, arr, scope) {
  if (arr === undefined) return;
  if (!Array.isArray(arr)) { err(where, "must be an array"); return; }
  arr.forEach((s, i) => checkSubject(`${where}[${i}]`, s, scope));
}

function checkTermArray(where, arr, scope) {
  if (arr === undefined) return;
  if (!Array.isArray(arr)) { err(where, "must be an array"); return; }
  arr.forEach((t, i) => {
    const w = `${where}[${i}]`;
    if (typeof t !== "object" || t === null) { err(w, "must be an object"); return; }
    for (const k of Object.keys(t)) if (!["term","transliteration","gloss","keys"].includes(k)) err(w, `unknown field "${k}"`);
    if (!nonEmpty(t.term)) { err(w, "term is required"); return; }
    const keys = checkKeys(`${w}.keys`, t.keys, scope);
    checkVerbatimAgainst(`${w}.term`, t.term, keys);
    if (t.transliteration !== undefined && typeof t.transliteration !== "string") err(w, "transliteration must be a string");
    if (t.gloss !== undefined && typeof t.gloss !== "string") err(w, "gloss must be a string");
  });
}

function validateExtraction(rec, where) {
  stats.extractions++;
  unknownFields(where, rec, EXT_FIELDS);
  checkProvenance(where, rec);

  const idm = typeof rec.extractionId === "string" ? rec.extractionId.match(EXT_ID_RE) : null;
  if (!idm) err(where, `extractionId must match ext-NNN-pN (got "${rec.extractionId}")`);
  if (rec.pass !== "A") err(where, 'pass must be "A"');
  if (!Number.isInteger(rec.surah) || rec.surah < 1 || rec.surah > 114) { err(where, "surah must be an integer 1..114"); return; }
  if (idm && idm[1] !== String(rec.surah).padStart(3, "0")) err(where, "extractionId surah prefix does not match surah field");
  if (seenExtIds.has(rec.extractionId)) err(where, `duplicate extractionId ${rec.extractionId}`);
  seenExtIds.add(rec.extractionId);
  if (rec.surahName !== undefined && typeof rec.surahName !== "string") err(where, "surahName must be a string");

  const p = rec.passage;
  if (typeof p !== "object" || p === null) { err(where, "passage is required"); return; }
  unknownFields(`${where}.passage`, p, PASSAGE_FIELDS);
  const max = surahVerseCount.get(rec.surah);
  if (!Number.isInteger(p.fromAyah) || p.fromAyah < 1) { err(where, "passage.fromAyah must be >= 1"); return; }
  if (!Number.isInteger(p.toAyah) || p.toAyah < p.fromAyah || p.toAyah > max) { err(where, `passage.toAyah must be in [fromAyah..${max}]`); return; }
  if (p.label !== undefined && typeof p.label !== "string") err(where, "passage.label must be a string");

  const expected = [];
  for (let a = p.fromAyah; a <= p.toAyah; a++) expected.push(`${rec.surah}:${a}`);
  if (!Array.isArray(rec.verseKeys) || rec.verseKeys.length !== expected.length || rec.verseKeys.some((k, i) => k !== expected[i])) {
    err(where, `verseKeys must exactly cover ${expected[0]}..${expected[expected.length - 1]} in order`);
    return;
  }
  const scope = new Set(expected);
  expected.forEach((k) => stats.keysReferenced.add(k));

  if (rec.arabicExcerpts !== undefined) {
    if (!Array.isArray(rec.arabicExcerpts)) err(where, "arabicExcerpts must be an array");
    else rec.arabicExcerpts.forEach((x, i) => {
      const w = `${where}.arabicExcerpts[${i}]`;
      if (typeof x !== "object" || x === null) { err(w, "must be an object"); return; }
      for (const k of Object.keys(x)) if (!["key","text"].includes(k)) err(w, `unknown field "${k}"`);
      if (!validKey(x.key) || !scope.has(x.key)) { err(w, `key "${x.key}" must be a corpus verse inside the passage`); return; }
      checkVerbatimAgainst(w, x.text, [x.key]);
    });
  }

  checkSubject(`${where}.mainSubject`, rec.mainSubject, scope);
  checkSubjectArray(`${where}.subordinateSubjects`, rec.subordinateSubjects, scope);
  checkSubjectArray(`${where}.propheticNarratives`, rec.propheticNarratives, scope);
  checkSubjectArray(`${where}.humanConditionsAndSpiritualStates`, rec.humanConditionsAndSpiritualStates, scope);
  checkSubjectArray(`${where}.relationships`, rec.relationships, scope);
  checkSubjectArray(`${where}.socialEconomicCivilisational`, rec.socialEconomicCivilisational, scope);

  if (rec.commandsAndProhibitions !== undefined) {
    if (!Array.isArray(rec.commandsAndProhibitions)) err(where, "commandsAndProhibitions must be an array");
    else rec.commandsAndProhibitions.forEach((c, i) => {
      const w = `${where}.commandsAndProhibitions[${i}]`;
      if (typeof c !== "object" || c === null) { err(w, "must be an object"); return; }
      for (const k of Object.keys(c)) if (!["kind","keys","excerpt","description"].includes(k)) err(w, `unknown field "${k}"`);
      if (!CMD_KINDS.has(c.kind)) err(w, `invalid kind "${c.kind}"`);
      const keys = checkKeys(`${w}.keys`, c.keys, scope);
      if (c.excerpt !== undefined) checkVerbatimAgainst(`${w}.excerpt`, c.excerpt, keys);
      if (!nonEmpty(c.description)) err(w, "description is required");
    });
  }

  checkTermArray(`${where}.divineNamesAndAttributes`, rec.divineNamesAndAttributes, scope);
  checkTermArray(`${where}.terminology`, rec.terminology, scope);

  if (rec.topicCandidateIds !== undefined) {
    if (!Array.isArray(rec.topicCandidateIds)) err(where, "topicCandidateIds must be an array");
    else rec.topicCandidateIds.forEach((id, i) => { if (!CAND_ID_RE.test(id)) err(where, `topicCandidateIds[${i}] "${id}" must match cand-NNNN`); });
  }
  if (rec.notes !== undefined && typeof rec.notes !== "string") err(where, "notes must be a string");
}

function validateCandidate(rec, where) {
  stats.candidates++;
  unknownFields(where, rec, CAND_FIELDS);
  checkProvenance(where, rec);
  if (!CAND_ID_RE.test(rec.candidateId ?? "")) err(where, `candidateId must match cand-NNNN (got "${rec.candidateId}")`);
  if (seenCandIds.has(rec.candidateId)) err(where, `duplicate candidateId ${rec.candidateId}`);
  seenCandIds.add(rec.candidateId);
  if (!nonEmpty(rec.label)) err(where, "label is required");
  if (!nonEmpty(rec.definition)) err(where, "definition is required");
  if (rec.definitionStatus !== "editorial-draft") err(where, 'definitionStatus must be "editorial-draft"');
  for (const f of ["arabicLabel","urduLabel","notes"]) if (rec[f] !== undefined && typeof rec[f] !== "string") err(where, `${f} must be a string`);

  if (!Array.isArray(rec.evidence) || rec.evidence.length === 0) { err(where, "evidence must be a non-empty array"); return; }
  rec.evidence.forEach((link, i) => {
    const w = `${where}.evidence[${i}]`;
    stats.evidenceLinks++;
    if (typeof link !== "object" || link === null) { err(w, "must be an object"); return; }
    unknownFields(w, link, LINK_FIELDS);
    if (!validKey(link.key)) { err(w, `unknown or malformed verse key "${link.key}"`); return; }
    stats.keysReferenced.add(link.key);
    checkVerbatimAgainst(w, link.excerpt, [link.key]);
    if (!EVIDENCE_CLASSES.has(link.evidenceClass)) err(w, `invalid evidenceClass "${link.evidenceClass}"`);
    if (!nonEmpty(link.rationale)) err(w, "rationale is required");
  });

  if (rec.existingTopicOverlap !== undefined) {
    if (!Array.isArray(rec.existingTopicOverlap)) err(where, "existingTopicOverlap must be an array");
    else rec.existingTopicOverlap.forEach((o, i) => {
      const w = `${where}.existingTopicOverlap[${i}]`;
      if (typeof o !== "object" || o === null) { err(w, "must be an object"); return; }
      for (const k of Object.keys(o)) if (!["topicId","layer","relationship","note"].includes(k)) err(w, `unknown field "${k}"`);
      if (!LAYERS.has(o.layer)) { err(w, `invalid layer "${o.layer}"`); return; }
      if (!RELATIONSHIPS.has(o.relationship)) err(w, `invalid relationship "${o.relationship}"`);
      const catalog = o.layer === "curated" ? curatedSlugs : scholarlyIds;
      if (!catalog.has(o.topicId)) err(w, `topicId "${o.topicId}" does not exist in the ${o.layer} catalog`);
      if (o.note !== undefined && typeof o.note !== "string") err(w, "note must be a string");
    });
  }
}

// ─── Dispatch per input file ─────────────────────────────────────────────────
for (const rel of inputs) {
  let parsed;
  try { parsed = JSON.parse(readFileSync(path.resolve(ROOT, rel), "utf8")); }
  catch (e) { err(rel, `cannot read/parse JSON: ${e.message}`); continue; }

  if (Array.isArray(parsed)) {
    parsed.forEach((c, i) => validateCandidate(c, `${rel}[${i}]`));
  } else if (parsed && typeof parsed === "object" && parsed.extractionId !== undefined) {
    validateExtraction(parsed, rel);
  } else if (parsed && typeof parsed === "object" && parsed.candidateId !== undefined) {
    validateCandidate(parsed, rel);
  } else if (parsed && typeof parsed === "object" && Array.isArray(parsed.candidates)) {
    if (parsed.workstream !== "MFD-11") err(rel, 'batch workstream must be "MFD-11"');
    if (!nonEmpty(parsed.generatedAt) || Number.isNaN(Date.parse(parsed.generatedAt))) err(rel, "batch generatedAt must be an ISO date-time");
    parsed.candidates.forEach((c, i) => validateCandidate(c, `${rel}.candidates[${i}]`));
  } else {
    err(rel, "unrecognized record shape (expected extractionId, candidateId, or candidates[])");
  }
}

// ─── Report ──────────────────────────────────────────────────────────────────
console.log("MFD-11 extraction validation");
console.log(`  files: ${inputs.length}`);
console.log(`  extractions: ${stats.extractions}, candidates: ${stats.candidates}, evidence links: ${stats.evidenceLinks}`);
console.log(`  distinct verse keys referenced: ${stats.keysReferenced.size}`);
console.log(`  verbatim excerpts/terms verified against pinned corpus: ${stats.excerptsVerified}`);
if (errors.length > 0) {
  console.error(`\nFAILED — ${errors.length} error(s):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("PASSED — all records schema-valid, corpus-grounded, and pending scholarly review.");
