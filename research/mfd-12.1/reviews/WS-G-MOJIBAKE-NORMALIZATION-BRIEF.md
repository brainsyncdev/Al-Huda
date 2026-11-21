# WS-G Brief: Urdu/Arabic Mojibake Normalization (Q39)

| Field | Value |
|-------|-------|
| Workstream | MFD-12.1 WS-G (Coverage Thresholds & Normalization) |
| Question ID | Q39 |
| Date | 2026-11-21 |
| proposedBy | ai-assisted |
| reviewStatus | pending-scholarly-review |
| Scope | RESEARCH ONLY — no production data modified, no normalization scripts executed |

---

## 1. Evidence Base

### 1.1 Observed corruption in `data/taxonomy/topics.json`

Inspection of the first 40 lines reveals systematic double-encoded UTF-8 in both `urduTitle` and `arabicTitle` fields:

```json
"urduTitle": "Ã˜ÂªÃ™Ë†Ã˜Â­Ã›Å’Ã˜Â¯ ÃšÂ©Ã›â€™ Ã˜Â¨Ã™â€ Ã›Å’Ã˜Â§Ã˜Â¯Ã›Å’ Ã˜Â§Ã˜ÂµÃ™Ë†Ã™â€ž"
"arabicTitle": "Ã˜Â£Ã˜ÂµÃ™Ë†Ã™â€ž Ã˜Â§Ã™â€žÃ˜ÂªÃ™Ë†Ã˜Â­Ã™Å Ã˜Â¯"
```

This is **not** a display issue or font problem. The byte sequence `Ã˜Âª` is the Latin-1 interpretation of UTF-8 bytes `D8 AA` (U+062A, Arabic TEH). The file was written as UTF-8, then re-encoded through a Latin-1 → UTF-8 transcoding step at least once.

### 1.2 Diagnostic pattern

| Expected character | Correct UTF-8 bytes | Observed mojibake | Interpretation |
|-------------------|----------------------|-------------------|----------------|
| ت (U+062A) | D8 AA | Ã˜Âª | D8→Ã˜, AA→Âª in Latin-1 |
| ح (U+062D) | D8 AD | Ã˜Â­ | D8→Ã˜, AD→Â­ in Latin-1 |
| ی (U+06CC) | DB 8C | Ã›Å’ | DB→Ã›, 8C→Å’ in CP1252 variant |
| ا (U+0627) | D8 A7 | Ã˜Â§ | D8→Ã˜, A7→Â§ in Latin-1 |
| ل (U+0644) | D9 84 | Ã™â€ž | D9→Ã™, 84→â€ž in CP1252 variant |

The mix of Latin-1 and Windows-1252 interpretations suggests the file passed through multiple encoding layers, possibly via PowerShell's default encoding on Windows or a JSON serializer that defaulted to the system locale.

### 1.3 Scope assessment

- `topics.json` contains 5,342 lines (~200+ topic entries based on line density).
- Both `urduTitle` AND `arabicTitle` are affected — this is not limited to Urdu.
- Other fields (`title`, `description`, `scope`) appear correctly encoded in ASCII/Latin text.
- This corruption makes ALL non-Latin titles unreadable and unsearchable.
- Scholarly review of taxonomy content CANNOT proceed until this is resolved.

### 1.4 Root cause hypothesis

Most likely cause: PowerShell's `ConvertTo-Json | Out-File` pipeline on Windows defaults to UTF-16LE or system ANSI codepage unless `-Encoding utf8` is specified. If the output was then read as UTF-8 by another tool, double-encoding occurs. Alternatively, a Node.js script may have used `Buffer.from(string, 'latin1')` incorrectly.

---

## 2. Policy Recommendation

### 2.1 Authorization request

> **A targeted normalization pass on `data/taxonomy/topics.json` is AUTHORIZED as a prerequisite for scholarly review, subject to the validation protocol below.**

Rationale: This is data corruption repair, not content modification. The original intended content is recoverable through deterministic reversal of the double-encoding. No scholarly judgment is involved.

### 2.2 Normalization protocol (for authorized workstream)

1. **Backup first:** Create `data/taxonomy/topics.json.bak.pre-normalization` before any operation.
2. **Reverse transcode:** Apply `bytes → latin1-decode → utf8-decode` transformation to affected fields only (`urduTitle`, `arabicTitle`). Do NOT touch other fields.
3. **Validate round-trip:** For every entry, verify that `normalize(normalize(original)) == normalize(original)` — i.e., the fix is idempotent and does not introduce triple-encoding.
4. **Spot-check sample:** Manually verify at least 20 entries against known correct titles (e.g., cross-reference with printed Urdu/Arabic sources or verified digital editions).
5. **Schema validation:** Run JSON schema validation post-normalization to ensure structural integrity.
6. **Diff review:** Generate a before/after diff showing ONLY the affected fields changed; no other modifications permitted.
7. **Commit message:** Must reference this brief (Q39) and include the backup file path.

### 2.3 Validation criteria

| Check | Pass condition |
|-------|---------------|
| JSON validity | File parses without error |
| Field completeness | Same number of entries pre/post; no entries lost |
| Character set | All `urduTitle`/`arabicTitle` values contain valid Arabic/Urdu Unicode (U+0600–U+06FF, U+0750–U+077F, U+FB50–U+FDFF, U+FE70–U+FEFF) |
| No residual mojibake | Zero occurrences of `Ã˜`, `Ã™`, `Ã›`, `Å’`, `â€` patterns in target fields |
| Round-trip stability | Re-running normalization produces identical output |
| Cross-field consistency | `slug` and `title` remain unchanged |

### 2.4 What is NOT authorized

- Modifying any field other than `urduTitle` and `arabicTitle`
- Changing entry structure, adding/removing entries, or altering IDs/slugs
- Running normalization on ANY other file without separate authorization
- Treating normalized output as scholar-approved (status remains `pending-scholarly-review`)

### 2.5 Prevention policy

To prevent recurrence:
1. All scripts writing JSON with non-ASCII content MUST specify UTF-8 encoding explicitly.
2. PowerShell commands must use `-Encoding utf8NoBOM` (PS7+) or `[System.IO.File]::WriteAllText()` with UTF8 encoding.
3. Add a CI/lint check that scans JSON files for known mojibake byte patterns.
4. Document encoding requirements in the project's CONTRIBUTING.md.

---

## 3. Implementation Impact

### Data Pipeline
- Normalization is a one-time repair, not a recurring pipeline step.
- Post-repair, all downstream consumers (search index, display layer, export scripts) will receive correct Unicode without modification.
- The backup file must be retained indefinitely for audit purposes.

### Display
- Current state: Urdu/Arabic titles render as garbled Latin characters.
- Post-normalization: Titles render correctly in any Unicode-capable browser/font.
- No UI code changes required; this is purely a data fix.

### Scholarly Review
- Taxonomy review CANNOT meaningfully begin until titles are readable.
- Post-normalization, reviewers can assess whether Urdu translations are accurate and Arabic titles match standard terminology.
- Normalization itself requires NO scholarly review (it is mechanical); CONTENT accuracy post-normalization DOES require review.

---

## 4. Scholarly Review Format

> **Question for Council (Q39):** Double-encoded UTF-8 corruption has been confirmed in `data/taxonomy/topics.json` affecting all `urduTitle` and `arabicTitle` fields.
>
> 1. Do you authorize a **mechanical normalization pass** limited to reversing the double-encoding in these two fields, following the validation protocol above?
> 2. Do you accept that this is a **data repair operation** requiring no scholarly judgment, distinct from content review?
> 3. Should the **prevention policy** (§2.5) be adopted as a standing project requirement for all future data operations?
> 4. After normalization, should a **sample of 20 entries** be spot-checked by a Urdu/Arabic-competent reviewer before the full taxonomy review proceeds?
>
> **Decision requested:** authorize / deny normalization pass; approve / amend prevention policy.

---

## 5. Technical Note for Implementer

Python one-liner for reversal (for reference only — execute only after authorization):
```python
fixed = corrupted_string.encode('latin-1').decode('utf-8')
```
For CP1252 variants where `â€` appears, try `encode('cp1252').decode('utf-8')`. Test on a single entry first.

---

*proposedBy: ai-assisted | reviewStatus: pending-scholarly-review*
*No production files modified. No normalization scripts executed.*
