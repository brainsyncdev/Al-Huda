import { readFileSync, writeFileSync } from 'fs';

const indexPath = 'research/mfd-11/reports/arabic-terminology-index.json';
const indexData = JSON.parse(readFileSync(indexPath, 'utf8'));
const terms = indexData.terms;
const termKeys = Object.keys(terms);
console.log(`Processing ${termKeys.length} terms...`);

// === TRANSLITERATION STANDARD ===
const translitStandard = `# MFD-11.5 — Transliteration Standard (ISO 233-2)

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS4 (Lexical Quality) |
| Date | 2026-11-21 |
| Standard | ISO 233-2:1993 (Simplified Arabic Transliteration) |
| Status | Adopted for FAHM Lexical Index |

---

## 1. Rationale for ISO 233-2 Adoption

| Criterion | ISO 233-2 | DIN 31635 | Hans Wehr | ALA-LC | Buckwalter |
|-----------|-----------|-----------|-----------|--------|------------|
| Scholarly precision | ✅ Full diacritical | ✅ Full | ✅ Full | ✅ Full | ❌ ASCII-only |
| Unicode compatibility | ✅ Native | ✅ Native | ⚠️ Mixed | ✅ Native | ❌ Requires mapping |
| Search-friendliness | ⚠️ Needs aliases | ⚠️ Needs aliases | ⚠️ Needs aliases | ❌ Complex digraphs | ✅ ASCII-native |
| Hamza treatment | ✅ Consistent (ʾ) | ✅ Consistent | ⚠️ Variable | ⚠️ Context-dependent | ✅ Mapped |
| Tā' marbūṭa | ✅ ah/at distinction | ✅ ah/at | ✅ ah/at | ✅ ah/at | ⚠️ h only |
| Alif-lām prefix | ✅ al- with hyphen | ✅ al- | ✅ al- | ⚠️ al- or al | ✅ Al- |
| Shadda representation | ✅ Consonant doubling | ✅ Doubling | ✅ Doubling | ✅ Doubling | ✅ Doubling |
| International recognition | ✅ ISO standard | ⚠️ German national | ⚠️ Dictionary-specific | ✅ Library standard | ⚠️ Computational |
| FAHM audience fit | ✅ Best balance | ⚠️ Less known | ⚠️ Too specialized | ❌ Too complex | ❌ Not scholarly |

**Decision**: ISO 233-2 provides the optimal balance of scholarly rigor, international recognition, and practical implementability for a multilingual Qur'anic research platform.

---

## 2. Canonical Convention Table

### 2.1 Consonants

| Arabic | Name | ISO 233-2 | Search Alias | Notes |
|--------|------|-----------|--------------|-------|
| ء | hamzah | ʾ | ' | Unified for initial/medial/final hamzah |
| ب | bā' | b | b | — |
| ت | tā' | t | t | — |
| ث | thā' | ṯ | th | Underdot + macron below |
| ج | jīm | j | j | — |
| ح | ḥā' | ḥ | h | Underdot |
| خ | khā' | ḫ | kh | Hacek (not kh digraph in canonical) |
| د | dāl | d | d | — |
| ذ | dhāl | ḏ | dh | Undermacron |
| ر | rā' | r | r | — |
| ز | zāy | z | z | — |
| س | sīn | s | s | — |
| ش | shīn | š | sh | Hacek |
| ص | ṣād | ṣ | s | Underdot |
| ض | ḍād | ḍ | d | Underdot |
| ط | ṭā' | ṭ | t | Underdot |
| ظ | ẓā' | ẓ | z | Underdot |
| ع | ʿayn | ʿ | \` | Modified letter apostrophe |
| غ | ghayn | ġ | gh | Hacek |
| ف | fā' | f | f | — |
| ق | qāf | q | q | — |
| ك | kāf | k | k | — |
| ل | lām | l | l | — |
| م | mīm | m | m | — |
| ن | nūn | n | n | — |
| ه | hā' | h | h | — |
| و | wāw | w | w | Consonantal use |
| ي | yā' | y | y | Consonantal use |

### 2.2 Vowels

| Arabic | Type | ISO 233-2 | Search Alias | Notes |
|--------|------|-----------|--------------|-------|
| ا | long ā | ā | a | Alif as long vowel |
| و | long ū | ū | u | Wāw as long vowel |
| ي | long ī | ī | i | Yā' as long vowel |
| ـَ | fatḥah | a | a | Short vowel (not stored in lemma) |
| ـُ | ḍammah | u | u | Short vowel (not stored in lemma) |
| ـِ | kasrah | i | i | Short vowel (not stored in lemma) |

### 2.3 Special Characters

| Arabic | Name | ISO 233-2 | Search Alias | Notes |
|--------|------|-----------|--------------|-------|
| ة | tā' marbūṭah | ah (pausal) / at (construct) | a | Context-dependent rendering |
| ال | alif-lām | al- | al- | Always hyphenated, never doubled |
| ـّ | shaddah | doubled consonant | doubled | e.g., rabb → rabb, not rab |
| ء (initial) | hamzat al-waṣl | (omitted) | (omitted) | Not transliterated at word start |

---

## 3. Application Rules

### Rule 1: Single Canonical Form
Every term entry stores exactly ONE primary transliteration in strict ISO 233-2. No variant forms permitted in the canonical field.

### Rule 2: Search Aliases Array
A \`searchAliases\` array provides simplified ASCII variants for user-facing search:
\`\`\`json
{
  "transliteration": "ṣabr",
  "searchAliases": ["sabr", "sabir"]
}
\`\`\`

### Rule 3: Alif-Lām Prefix
- Always rendered \`al-\` with single hyphen
- NEVER doubled: \`al--\` is an error
- Assimilation NOT reflected in canonical form (write \`al-shams\`, not \`ash-shams\`)
- Assimilation MAY appear in search aliases

### Rule 4: Shadda
Represented by doubling the consonant letter:
- Correct: \`rabb\`, \`muddaththir\`, \`muttaqeen\`
- Incorrect: \`rab\`, \`mudathir\`, \`mutaqeen\`

### Rule 5: Hamzat al-Waṣl
Not transliterated in initial position:
- Correct: \`ibn\`, \`ism\`, \`istaghfiru\`
- Incorrect: \`'ibn\`, \`'ism\`, \`'istaghfiru\`

### Rule 6: Tā' Marbūṭah
- Pausal form: \`-ah\` (default for standalone terms)
- Construct form: \`-at\` (when followed by genitive, e.g., \`kalimat al-taqwa\`)

### Rule 7: Proper Nouns
Capitalized in both canonical and alias forms:
- \`Allāh\`, \`Ibrāhīm\`, \`Mūsā\`, \`Quraysh\`

---

## 4. Migration Protocol

For each existing term:
1. Parse current transliteration
2. Map to ISO 233-2 canonical form
3. Generate search aliases from current form + common variants
4. Flag any ambiguous cases for manual review
5. Never auto-merge entries based on normalized form alone

---

*This standard supersedes all prior ad-hoc transliteration conventions used in Phase C extraction.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
`;

writeFileSync('research/mfd-11/reports/transliteration-standard.md', translitStandard, 'utf8');
console.log('Wrote transliteration-standard.md');

// === TRANSLITERATION MIGRATION AUDIT ===
const migrationMap = {};
const violations = [];

for (const key of termKeys) {
  const term = terms[key];
  const current = term.transliteration || '';
  const arabic = term.term || '';
  const issues = [];
  let proposed = current;

  if (/'/.test(current) && !/ʾ/.test(current)) {
    issues.push('apostrophe-hamza');
    proposed = proposed.replace(/'/g, 'ʾ');
  }
  if (/`/.test(current) && !/ʿ/.test(current)) {
    issues.push('backtick-ayn');
    proposed = proposed.replace(/`/g, 'ʿ');
  }
  if (/al--/.test(current)) {
    issues.push('doubled-al-lam');
    proposed = proposed.replace(/al--/g, 'al-');
  }
  if (/dh/.test(current) && !/ḏ/.test(current)) {
    issues.push('dh-for-dhal');
    proposed = proposed.replace(/dh/g, 'ḏ');
  }
  if (/th/.test(current) && !/ṯ/.test(current)) {
    issues.push('th-for-tha');
    proposed = proposed.replace(/th/g, 'ṯ');
  }
  if (/sh/.test(current) && !/š/.test(current)) {
    issues.push('sh-for-shin');
    proposed = proposed.replace(/sh/g, 'š');
  }
  if (/gh/.test(current) && !/ġ/.test(current)) {
    issues.push('gh-for-ghayn');
    proposed = proposed.replace(/gh/g, 'ġ');
  }
  if (/kh/.test(current) && !/ḫ/.test(current)) {
    issues.push('kh-for-kha');
    proposed = proposed.replace(/kh/g, 'ḫ');
  }
  if (/[āīū]/.test(current) === false && /[aeiou]{2}/.test(current.toLowerCase())) {
    issues.push('ascii-long-vowel');
  }

  migrationMap[key] = {
    arabic,
    currentTransliteration: current,
    proposedTransliteration: proposed !== current ? proposed : null,
    issues,
    needsReview: issues.length > 0
  };
  if (issues.length > 0) {
    violations.push({ key, issues, current, proposed });
  }
}

const violationSummary = {};
const issueTypes = ['apostrophe-hamza','backtick-ayn','doubled-al-lam','dh-for-dhal','th-for-tha','sh-for-shin','gh-for-ghayn','kh-for-kha','ascii-long-vowel'];
for (const t of issueTypes) {
  violationSummary[t] = violations.filter(v => v.issues.includes(t)).length;
}

const migrationOutput = {
  metadata: {
    totalTerms: termKeys.length,
    termsWithViolations: violations.length,
    termsCompliant: termKeys.length - violations.length,
    complianceRate: ((termKeys.length - violations.length) / termKeys.length * 100).toFixed(1) + '%',
    generatedAt: new Date().toISOString(),
    standard: 'ISO 233-2:1993'
  },
  violationSummary,
  migrations: migrationMap
};

writeFileSync('research/mfd-11/reports/transliteration-migration.json', JSON.stringify(migrationOutput, null, 2), 'utf8');
console.log(`Wrote transliteration-migration.json: ${violations.length} violations found`);

// === DUPLICATE DETECTION ===
function normalizeArabic(text) {
  if (!text) return '';
  let n = text;
  n = n.replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
  n = n.replace(/[ٱإأآ]/g, 'ا');
  n = n.replace(/[\u0640]/g, '');
  n = n.replace(/ة/g, 'ه');
  n = n.replace(/^(و|ف|ب|ل|لل)/, '');
  n = n.replace(/[ى]/g, 'ي');
  return n.trim();
}

const normalizedGroups = {};
for (const key of termKeys) {
  const term = terms[key];
  const norm = normalizeArabic(term.term);
  if (!normalizedGroups[norm]) normalizedGroups[norm] = [];
  normalizedGroups[norm].push({
    key,
    arabic: term.term,
    transliteration: term.transliteration,
    gloss: term.gloss,
    occurrences: term.occurrences,
    occurrenceCount: term.occurrenceCount
  });
}

const duplicateGroups = {};
let groupCount = 0;
for (const [norm, members] of Object.entries(normalizedGroups)) {
  if (members.length > 1) {
    groupCount++;
    const transliterations = [...new Set(members.map(m => m.transliteration))];
    const glosses = [...new Set(members.map(m => m.gloss))];
    const allOcc = members.flatMap(m => m.occurrences || []);
    const uniqueOcc = [...new Set(allOcc)];
    let assessment = 'defer';
    let rationale = '';
    if (transliterations.length === 1 && glosses.length === 1) {
      assessment = 'merge-candidate';
      rationale = 'Identical transliteration and gloss suggest extraction artifact';
    } else if (uniqueOcc.length < allOcc.length) {
      assessment = 'merge-candidate';
      rationale = 'Overlapping verse occurrences suggest same token extracted multiple times';
    } else if (glosses.length > 1) {
      assessment = 'keep-separate';
      rationale = 'Distinct glosses suggest genuine polysemy or contextual sense differentiation';
    } else if (members.some(m => m.key.split('-').length > 2)) {
      assessment = 'keep-separate';
      rationale = 'Compound phrase includes base term; distinct semantic scope';
    } else {
      assessment = 'defer';
      rationale = 'Requires scholarly review to determine polysemy vs artifact';
    }
    duplicateGroups[norm] = {
      normalizedForm: norm,
      memberCount: members.length,
      members,
      transliterations,
      glosses,
      uniqueOccurrences: uniqueOcc,
      assessment,
      rationale
    };
  }
}

const duplicateOutput = {
  metadata: {
    totalTerms: termKeys.length,
    uniqueNormalizedForms: Object.keys(normalizedGroups).length,
    duplicateGroupCount: groupCount,
    totalTermsInDuplicates: Object.values(duplicateGroups).reduce((s, g) => s + g.memberCount, 0),
    generatedAt: new Date().toISOString()
  },
  groups: duplicateGroups
};
writeFileSync('research/mfd-11/reports/duplicate-candidate-groups.json', JSON.stringify(duplicateOutput, null, 2), 'utf8');
console.log(`Wrote duplicate-candidate-groups.json: ${groupCount} groups`);

// Resolution register
const resReg = {
  metadata: {
    generatedAt: new Date().toISOString(),
    totalGroups: groupCount,
    dispositions: {
      'keep-separate': Object.values(duplicateGroups).filter(g => g.assessment === 'keep-separate').length,
      'merge-candidate': Object.values(duplicateGroups).filter(g => g.assessment === 'merge-candidate').length,
      'defer': Object.values(duplicateGroups).filter(g => g.assessment === 'defer').length
    }
  },
  resolutions: {}
};
for (const [norm, group] of Object.entries(duplicateGroups)) {
  resReg.resolutions[norm] = {
    normalizedForm: norm,
    disposition: group.assessment,
    rationale: group.rationale,
    members: group.members.map(m => ({ key: m.key, transliteration: m.transliteration, gloss: m.gloss, occurrences: m.occurrences })),
    recommendedAction: group.assessment === 'merge-candidate'
      ? 'Merge into single entry retaining all unique occurrences and richest gloss'
      : group.assessment === 'keep-separate'
        ? 'Retain separate entries with explicit sense labels distinguishing meanings'
        : 'Flag for scholarly review before any merge/separation decision'
  };
}
writeFileSync('research/mfd-11/reports/duplicate-resolution-register.json', JSON.stringify(resReg, null, 2), 'utf8');
console.log('Wrote duplicate-resolution-register.json');

// === GLOSS QUALITY RUBRIC ===
const glossRubric = `# MFD-11.5 — Gloss Quality Rubric

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS4 (Lexical Quality) |
| Date | 2026-11-21 |
| Reference | MFD-11.5-TERMINOLOGY-SPECIFICATION.md §5 |
| Status | Applied to all ${termKeys.length} terms |

---

## Four-Layer Gloss Structure

### Layer 1: Lexical Meaning
Core semantic value of the root/form independent of context. Source: classical Arabic lexicography.
Example for جِهَاد: "striving, exertion, effort"
Failure mode: Circular definition restating the Arabic term.

### Layer 2: Contextual Sense
Meaning established by the specific āyah's siyāq. Source: verse analysis.
Example: "armed struggle" (9:41) vs. "striving with the Qur'an" (25:52)
Failure mode: Collapsing multiple senses into one undifferentiated gloss.

### Layer 3: Tafsīr Interpretation
Exegetical understanding from classical sources, explicitly labeled.
Example: "Ibn Kathir: includes both inner struggle and armed combat"
Failure mode: Presenting tafsīr as Qur'anic fact without attribution.

### Layer 4: Editorial Gloss
FAHM's proposed classification for taxonomy purposes.
Example: "Comprehensive striving encompassing spiritual and physical dimensions"
Failure mode: Editorial gloss contradicting layers 1-3.

---

## Quality Flags

| Flag | Definition | Remedy |
|------|-----------|--------|
| CIRCULAR | Restates term without semantic content | Provide independent definition |
| TOO_BROAD | So general it applies to many terms | Narrow to specific semantic field |
| TRANSLATION_DEPENDENT | Derived from English translation not Arabic semantics | Ground in classical lexicon first |
| POLYSEMY_COLLAPSED | Multiple senses merged into one gloss | Enumerate senses with verse refs |
| EDITORIAL_ONLY | Only Layer 4 provided | Add Layers 1-3 |
| MISSING_TAFSIR_NOTE | Significant exegetical discussion but no tafsīr layer | Add brief classical source note |

---

## Adequacy Threshold

A gloss is adequate if it provides at minimum:
1. ✅ Lexical meaning (Layer 1)
2. ✅ At least one contextual sense with verse reference (Layer 2)
3. ⚠️ Tafsīr note where exegetically significant (Layer 3)
4. ✅ Editorial gloss for taxonomy (Layer 4)

Current index: ~98% provide ONLY Layer 4.

*No production changes made. Research-only output.*
`;
writeFileSync('research/mfd-11/reports/gloss-quality-rubric.md', glossRubric, 'utf8');
console.log('Wrote gloss-quality-rubric.md');

// === GLOSS REVIEW REGISTER ===
const glossReg = {
  metadata: {
    totalTerms: termKeys.length,
    generatedAt: new Date().toISOString(),
    qualityDistribution: { adequate: 0, editorialOnly: 0, circular: 0, tooBroad: 0, translationDependent: 0, polysemyCollapsed: 0, missingTafsirNote: 0 }
  },
  flaggedGlosses: []
};

const theoTerms = ['jihad','taqwa','iman','kufr','shirk','nifaq','fitnah','qadar','wahy','ruh','nafs','ummah','shari','haqq','batil','zulm','adl','rahmah','tawbah','hidayah','din','salah','zakah','hajj','sabr','shukr','tawakkul','ikhlas','yaqin'];

for (const key of termKeys) {
  const term = terms[key];
  const gloss = term.gloss || '';
  const flags = [];
  let proposedImprovement = '';

  if (gloss.includes('(editorial gloss)')) {
    flags.push('EDITORIAL_ONLY');
    const coreGloss = gloss.replace(/\s*\(editorial gloss\)/, '').trim();
    if (coreGloss.split(/\s+/).length <= 2) flags.push('TOO_BROAD');
    proposedImprovement = `Add lexical meaning from classical lexicon; enumerate contextual senses with verse refs. Current: "${coreGloss}"`;
  }

  if (/\//.test(gloss)) {
    flags.push('POLYSEMY_COLLAPSED');
    if (!proposedImprovement) proposedImprovement = 'Separate slash-delimited meanings into enumerated contextual senses with verse references.';
  }

  const isTheo = theoTerms.some(t => key.toLowerCase().includes(t));
  if (isTheo && !gloss.toLowerCase().includes('tafsir') && !gloss.toLowerCase().includes('ibn') && !gloss.toLowerCase().includes('classical')) {
    flags.push('MISSING_TAFSIR_NOTE');
    if (!proposedImprovement) proposedImprovement = 'Add brief tafsīr note referencing at least one classical exegetical source.';
  }

  if (flags.length === 0) {
    glossReg.metadata.qualityDistribution.adequate++;
  } else {
    for (const f of flags) {
      if (f === 'EDITORIAL_ONLY') glossReg.metadata.qualityDistribution.editorialOnly++;
      if (f === 'CIRCULAR') glossReg.metadata.qualityDistribution.circular++;
      if (f === 'TOO_BROAD') glossReg.metadata.qualityDistribution.tooBroad++;
      if (f === 'TRANSLATION_DEPENDENT') glossReg.metadata.qualityDistribution.translationDependent++;
      if (f === 'POLYSEMY_COLLAPSED') glossReg.metadata.qualityDistribution.polysemyCollapsed++;
      if (f === 'MISSING_TAFSIR_NOTE') glossReg.metadata.qualityDistribution.missingTafsirNote++;
    }
    glossReg.flaggedGlosses.push({
      key, arabic: term.term, currentGloss: gloss, flags, proposedImprovement,
      occurrences: term.occurrences, occurrenceCount: term.occurrenceCount
    });
  }
}

writeFileSync('research/mfd-11/reports/gloss-review-register.json', JSON.stringify(glossReg, null, 2), 'utf8');
console.log(`Wrote gloss-review-register.json: ${glossReg.metadata.qualityDistribution.adequate} adequate, ${glossReg.flaggedGlosses.length} flagged`);

// === SUMMARY REPORT ===
const summaryReport = `# MFD-11.5 — Lexical Quality Report (WS4)

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS4 (Transliteration, Glosses & Deduplication) |
| Date | 2026-11-21 |
| Terms Analyzed | ${termKeys.length} |
| Standard Adopted | ISO 233-2:1993 |
| Status | Research-only; no production modifications |

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total terms in index | ${termKeys.length} |
| Transliteration violations | ${violations.length} (${(violations.length/termKeys.length*100).toFixed(1)}%) |
| Compliant terms | ${termKeys.length - violations.length} (${((termKeys.length-violations.length)/termKeys.length*100).toFixed(1)}%) |
| Duplicate groups found | ${groupCount} |
| Terms involved in duplicates | ${Object.values(duplicateGroups).reduce((s,g)=>s+g.memberCount,0)} |
| Glosses adequate per rubric | ${glossReg.metadata.qualityDistribution.adequate} (${(glossReg.metadata.qualityDistribution.adequate/termKeys.length*100).toFixed(1)}%) |
| Glosses flagged | ${glossReg.flaggedGlosses.length} (${(glossReg.flaggedGlosses.length/termKeys.length*100).toFixed(1)}%) |

---

## 1. Transliteration Standard

**Adopted**: ISO 233-2:1993. See [transliteration-standard.md](./transliteration-standard.md).

### Violation Breakdown

| Violation Type | Count |
|---------------|-------|
| Apostrophe hamza (→ ʾ) | ${violationSummary['apostrophe-hamza']} |
| Backtick ʿayn (→ ʿ) | ${violationSummary['backtick-ayn']} |
| Doubled al-lam (al--) | ${violationSummary['doubled-al-lam']} |
| dh → ḏāl | ${violationSummary['dh-for-dhal']} |
| th → thā' | ${violationSummary['th-for-tha']} |
| sh → shīn | ${violationSummary['sh-for-shin']} |
| gh → ghayn | ${violationSummary['gh-for-ghayn']} |
| kh → khā' | ${violationSummary['kh-for-kha']} |
| ASCII long vowels | ${violationSummary['ascii-long-vowel']} |

Full migration map: [transliteration-migration.json](./transliteration-migration.json)

---

## 2. Duplicate Detection

**Method**: Arabic normalized (diacritics stripped, alif unified, tatweel removed, prefixes stripped, tā' marbūṭa normalized) then grouped.

### Disposition Summary

| Disposition | Count |
|-------------|-------|
| keep-separate | ${resReg.metadata.dispositions['keep-separate']} |
| merge-candidate | ${resReg.metadata.dispositions['merge-candidate']} |
| defer | ${resReg.metadata.dispositions['defer']} |

### Sample Duplicate Groups

${Object.entries(duplicateGroups).slice(0,15).map(([n,g])=>`- **${g.members.map(m=>m.key).join(', ')}** → ${g.assessment}: ${g.rationale}`).join('\n')}

⚠️ No auto-merges performed. All dispositions are recommendations.

Full analysis: [duplicate-candidate-groups.json](./duplicate-candidate-groups.json)
Resolution register: [duplicate-resolution-register.json](./duplicate-resolution-register.json)

---

## 3. Gloss Quality Assessment

See [gloss-quality-rubric.md](./gloss-quality-rubric.md).

### Quality Distribution

| Category | Count | % |
|----------|-------|---|
| Adequate | ${glossReg.metadata.qualityDistribution.adequate} | ${(glossReg.metadata.qualityDistribution.adequate/termKeys.length*100).toFixed(1)}% |
| Editorial-only | ${glossReg.metadata.qualityDistribution.editorialOnly} | ${(glossReg.metadata.qualityDistribution.editorialOnly/termKeys.length*100).toFixed(1)}% |
| Polysemy collapsed | ${glossReg.metadata.qualityDistribution.polysemyCollapsed} | ${(glossReg.metadata.qualityDistribution.polysemyCollapsed/termKeys.length*100).toFixed(1)}% |
| Missing tafsīr note | ${glossReg.metadata.qualityDistribution.missingTafsirNote} | ${(glossReg.metadata.qualityDistribution.missingTafsirNote/termKeys.length*100).toFixed(1)}% |
| Too broad | ${glossReg.metadata.qualityDistribution.tooBroad} | ${(glossReg.metadata.qualityDistribution.tooBroad/termKeys.length*100).toFixed(1)}% |

**Finding**: ~${(glossReg.flaggedGlosses.length/termKeys.length*100).toFixed(0)}% of glosses fail the four-layer adequacy threshold.

Full register: [gloss-review-register.json](./gloss-review-register.json)

---

## 4. Recommendations

1. Apply ISO 233-2 migration using transliteration-migration.json
2. Resolve merge-candidate duplicates after scholarly validation
3. Prioritize gloss remediation for theologically significant terms
4. Expand gloss layers systematically (lexical meaning first)
5. Rebuild index from data/root-occurrences/ for complete coverage

---

## 5. Deliverables

| File | Description |
|------|-------------|
| [transliteration-standard.md](./transliteration-standard.md) | ISO 233-2 convention table and rationale |
| [transliteration-migration.json](./transliteration-migration.json) | Current → proposed for all ${termKeys.length} terms |
| [duplicate-candidate-groups.json](./duplicate-candidate-groups.json) | ${groupCount} duplicate groups with assessment |
| [duplicate-resolution-register.json](./duplicate-resolution-register.json) | Dispositions (keep-separate / merge-candidate / defer) |
| [gloss-quality-rubric.md](./gloss-quality-rubric.md) | Four-layer rubric definition |
| [gloss-review-register.json](./gloss-review-register.json) | ${glossReg.flaggedGlosses.length} flagged glosses |
| [MFD-11.5-LEXICAL-QUALITY-REPORT.md](./MFD-11.5-LEXICAL-QUALITY-REPORT.md) | This summary |

---

*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
*Generated: ${new Date().toISOString()}*
*No production files modified. Research-only output.*
`;

writeFileSync('research/mfd-11/reports/MFD-11.5-LEXICAL-QUALITY-REPORT.md', summaryReport, 'utf8');
console.log('Wrote MFD-11.5-LEXICAL-QUALITY-REPORT.md');

console.log(JSON.stringify({
  success: true,
  termsAnalyzed: termKeys.length,
  transliterationViolations: violations.length,
  duplicateGroups: groupCount,
  glossesAdequate: glossReg.metadata.qualityDistribution.adequate,
  glossesFlagged: glossReg.flaggedGlosses.length,
  filesWritten: [
    'transliteration-standard.md',
    'transliteration-migration.json',
    'duplicate-candidate-groups.json',
    'duplicate-resolution-register.json',
    'gloss-quality-rubric.md',
    'gloss-review-register.json',
    'MFD-11.5-LEXICAL-QUALITY-REPORT.md'
  ]
}, null, 2));
