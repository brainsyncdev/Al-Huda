# MFD-11.5 — Lexical Quality Report (WS4)

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS4 (Transliteration, Glosses & Deduplication) |
| Date | 2026-11-21 |
| Terms Analyzed | 649 |
| Standard Adopted | ISO 233-2:1993 |
| Status | Research-only; no production modifications |

---

## Executive Summary

| Metric | Value |
|--------|-------|
| Total terms in index | 649 |
| Transliteration violations | 245 (37.8%) |
| Compliant terms | 404 (62.2%) |
| Duplicate groups found | 23 |
| Terms involved in duplicates | 50 |
| Glosses adequate per rubric | 9 (1.4%) |
| Glosses flagged | 640 (98.6%) |

---

## 1. Transliteration Standard

**Adopted**: ISO 233-2:1993. See [transliteration-standard.md](./transliteration-standard.md).

### Violation Breakdown

| Violation Type | Count |
|---------------|-------|
| Apostrophe hamza (→ ʾ) | 89 |
| Backtick ʿayn (→ ʿ) | 0 |
| Doubled al-lam (al--) | 0 |
| dh → ḏāl | 17 |
| th → thā' | 30 |
| sh → shīn | 53 |
| gh → ghayn | 29 |
| kh → khā' | 28 |
| ASCII long vowels | 41 |

Full migration map: [transliteration-migration.json](./transliteration-migration.json)

---

## 2. Duplicate Detection

**Method**: Arabic normalized (diacritics stripped, alif unified, tatweel removed, prefixes stripped, tā' marbūṭa normalized) then grouped.

### Disposition Summary

| Disposition | Count |
|-------------|-------|
| keep-separate | 23 |
| merge-candidate | 0 |
| defer | 0 |

### Sample Duplicate Groups

- **al-bayt-al-ma-mur, rabb-hadha-al-bayt** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **al-haqq, haqq** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **al-qalam, qalam** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **al-ruh, ruh** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **al-yaqin, haqq-al-yaqin, ilm-al-yaqin** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **arsh, dhi-al-arsh, dhu-al-arsh** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **asra, isra-** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **awliya, walayah** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **bil-qist, bil-qisti, qist** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **dhikr, dhikr-allah** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **ghuluww, taghloo** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **haneef, haneefan, hanif** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **hijarah-min-sijjil, sijjeel** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **hut, sahib-al-hut** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation
- **kalimah, kalimat-al-taqwa** → keep-separate: Distinct glosses suggest genuine polysemy or contextual sense differentiation

⚠️ No auto-merges performed. All dispositions are recommendations.

Full analysis: [duplicate-candidate-groups.json](./duplicate-candidate-groups.json)
Resolution register: [duplicate-resolution-register.json](./duplicate-resolution-register.json)

---

## 3. Gloss Quality Assessment

See [gloss-quality-rubric.md](./gloss-quality-rubric.md).

### Quality Distribution

| Category | Count | % |
|----------|-------|---|
| Adequate | 9 | 1.4% |
| Editorial-only | 637 | 98.2% |
| Polysemy collapsed | 283 | 43.6% |
| Missing tafsīr note | 42 | 6.5% |
| Too broad | 420 | 64.7% |

**Finding**: ~99% of glosses fail the four-layer adequacy threshold.

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
| [transliteration-migration.json](./transliteration-migration.json) | Current → proposed for all 649 terms |
| [duplicate-candidate-groups.json](./duplicate-candidate-groups.json) | 23 duplicate groups with assessment |
| [duplicate-resolution-register.json](./duplicate-resolution-register.json) | Dispositions (keep-separate / merge-candidate / defer) |
| [gloss-quality-rubric.md](./gloss-quality-rubric.md) | Four-layer rubric definition |
| [gloss-review-register.json](./gloss-review-register.json) | 640 flagged glosses |
| [MFD-11.5-LEXICAL-QUALITY-REPORT.md](./MFD-11.5-LEXICAL-QUALITY-REPORT.md) | This summary |

---

*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
*Generated: 2026-11-20T19:37:10.802Z*
*No production files modified. Research-only output.*
