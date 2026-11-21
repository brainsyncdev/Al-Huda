# WS5: Normalization Protocol

| Field | Value |
|-------|-------|
| Workstream | MFD-12.2 WS5 (Validated UTF-8/Mojibake Normalization) |
| Date | 2026-11-21 |
| proposedBy | ai-assisted |
| reviewStatus | pending-review |
| Scope | PLANNING ONLY — no production data modified |
| Supersedes | MFD-12.1 WS-G §2.2 (encoding depth revised from double to triple) |

---

## 1. Overview

This protocol defines the exact mechanical procedure for normalizing `data/taxonomy/topics.json` to recover correct Arabic/Urdu text from triple-encoded (and mixed double-encoded) mojibake. It supersedes the double-encoding assumption in WS-G based on WS5 characterization findings.

**Target file**: `data/taxonomy/topics.json` only  
**Target fields**: `urduTitle` and `arabicTitle` only  
**Algorithm**: Adaptive iterative CP1252→UTF-8 decode (1–3 passes)  

---

## 2. Pre-Normalization Backup

### 2.1 Mandatory Backup

Before ANY transformation:

```powershell
Copy-Item "data\taxonomy\topics.json" "data\taxonomy\topics.json.bak.pre-normalization.ws5"
```

### 2.2 Backup Verification

```powershell
$orig = Get-FileHash "data\taxonomy\topics.json" -Algorithm SHA256
$bak  = Get-FileHash "data\taxonomy\topics.json.bak.pre-normalization.ws5" -Algorithm SHA256
if ($orig.Hash -eq $bak.Hash) { Write-Output "Backup verified" } else { Write-Error "BACKUP MISMATCH" }
```

### 2.3 Retention Policy

The backup file MUST be retained indefinitely for audit and rollback purposes. It must NOT be deleted, overwritten, or gitignored.

---

## 3. Normalization Algorithm

### 3.1 Core Transformation

For each affected field value, apply iterative CP1252→UTF-8 decoding:

```python
def normalize_mojibake(s: str, max_passes: int = 3) -> str:
    """
    Iteratively decode CP1252-misinterpreted UTF-8.
    Stops early when valid Arabic/Urdu Unicode is detected.
    """
    import re
    ARABIC_RE = re.compile(r'[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]')
    
    current = s
    for i in range(max_passes):
        try:
            decoded = current.encode('cp1252').decode('utf-8')
        except (UnicodeDecodeError, UnicodeEncodeError):
            # Cannot decode further; return last valid state
            break
        
        # Check if we've reached valid Arabic/Urdu text
        if ARABIC_RE.search(decoded):
            return decoded
        current = decoded
    
    # If no Arabic detected after all passes, return last decoded form
    return current
```

### 3.2 Node.js Equivalent

```javascript
function normalizeMojibake(str, maxPasses = 3) {
  const arabicRe = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
  let current = str;
  
  for (let i = 0; i < maxPasses; i++) {
    try {
      // Encode as latin1 (byte-transparent), then interpret bytes as UTF-8
      // For CP1252 specifically, use iconv-lite or similar
      const buf = Buffer.from(current, 'latin1');
      const decoded = buf.toString('utf8');
      
      if (arabicRe.test(decoded)) return decoded;
      current = decoded;
    } catch {
      break;
    }
  }
  return current;
}
```

> **Note**: The Node.js `Buffer.from(str, 'latin1')` approach works for Latin-1 but does NOT handle CP1252 bytes 0x80–0x9F correctly. Use `iconv-lite` with `'win1252'` encoding for accurate results, or implement in Python which has native CP1252 support.

### 3.3 Adaptive Depth Handling

The algorithm handles mixed encoding depths automatically:
- **Triple-encoded entries**: Pass 1 produces double-mojibake, Pass 2 produces single-mojibake, Pass 3 produces valid Arabic → stops at Pass 3
- **Double-encoded entries**: Pass 1 produces single-mojibake, Pass 2 produces valid Arabic → stops at Pass 2
- **Already-correct entries**: Pass 1 either throws (non-CP1252 bytes) or produces non-Arabic output → returns original

### 3.4 Edge Cases

| Case | Behavior |
|------|----------|
| Entry already has valid Arabic/Urdu | First decode pass won't match Arabic regex; original preserved |
| Mixed-language content (Arabic + English spaces) | Spaces are ASCII and survive all passes unchanged |
| Null/empty field | Skip normalization entirely |
| Decode failure mid-pass | Catch exception, return last successful state |
| Over-correction risk | Idempotency check (see §4.2) prevents triple-decode of already-correct text |

---

## 4. Validation Protocol

### 4.1 Structural Integrity

Post-normalization checks:

1. **JSON validity**: File must parse without error
2. **Entry count**: Same number of entries pre/post (184)
3. **Field completeness**: Every entry still has `urduTitle` and `arabicTitle` (non-null)
4. **Schema conformance**: All required fields present, types correct

### 4.2 Round-Trip / Idempotency Test

For EVERY normalized entry:

```
normalize(normalize(original)) == normalize(original)
```

If applying the normalization function to an already-normalized value produces a DIFFERENT result, the algorithm is NOT idempotent and must be fixed before proceeding.

From testing: Pass 3 output (`توحید کے بنیادی اصول`) re-encoded through CP1252→UTF-8 produces the same string, confirming the fixed point is stable.

### 4.3 Character Range Validation

Every normalized `urduTitle` and `arabicTitle` MUST contain at least one character in:
- U+0600–U+06FF (Arabic)
- U+0750–U+077F (Arabic Supplement)
- U+FB50–U+FDFF (Arabic Presentation Forms-A)
- U+FE70–U+FEFF (Arabic Presentation Forms-B)

Zero occurrences of mojibake signature patterns allowed:
- No `Ã˜`, `Ã™`, `Ã›`, `Å'`, `â€` sequences
- No `Ãƒ`, `â€š`, `â€ž`, `â€¦` sequences

### 4.4 Spot-Check Methodology (20 Entries)

Sample selection criteria:
1. **First 5 entries** by file order (tawheed-fundamentals, asma-ul-husna, divine-unity, divine-mercy, divine-wrath)
2. **5 entries from middle** (entries 90–94)
3. **5 entries from end** (entries 179–183)
4. **5 known-reference entries** with well-known Arabic terms that can be verified against standard sources:
   - `asma-ul-husna` → أسماء الحسنى
   - `shirk-prohibition` → تحريم الشرك
   - `salah-prayer` → الصلاة
   - `zakat-obligatory-charity` → الزكاة
   - `quran-science` → علوم القرآن

Evaluation criteria per entry:
- [ ] Arabic title matches expected Islamic terminology
- [ ] Urdu title is linguistically plausible Urdu (not garbled)
- [ ] No residual mojibake characters
- [ ] Text direction is RTL-compatible
- [ ] Diacritics (if present) are correctly placed

### 4.5 Cross-Field Consistency

Verify that normalization did NOT alter:
- `id`, `slug`, `title` (English)
- `description`, `scope`
- `parentDomainId`, `parentDimensionId`
- `relatedTopicIds`, `searchAliases`
- `ayahMappings`, `provenance`

Generate a diff showing ONLY `urduTitle` and `arabicTitle` changes.

### 4.6 Comparison with Known-Good Corpus

Cross-reference normalized titles against:
- `data/taxonomy/dimensions.json` urduTitle/arabicTitle (confirmed clean)
- `data/taxonomy/domains.json` urduTitle/arabicTitle (confirmed clean)
- Hardcoded Arabic titles in `src/lib/topics/data.ts` (e.g., "الصبر", "الشكر")

Where topic titles overlap with dimension/domain titles, they should match exactly.

---

## 5. Rollback Procedure

### 5.1 Immediate Rollback

If any validation check fails post-normalization:

```powershell
Copy-Item "data\taxonomy\topics.json.bak.pre-normalization.ws5" "data\taxonomy\topics.json" -Force
```

Then verify hash matches original backup.

### 5.2 Partial Rollback

If only specific entries are corrupted by normalization:
1. Extract affected entries from backup using JSON tooling
2. Replace only those entries in the normalized file
3. Re-run validation on the patched file

### 5.3 Rollback Decision Criteria

Rollback is REQUIRED if ANY of these conditions are true:
- JSON parse failure
- Entry count mismatch
- Any normalized field lacks Arabic/Urdu Unicode characters
- Mojibake signature patterns remain in >0 entries
- Idempotency test fails for any entry
- Spot-check reveals incorrect Arabic/Urdu text in ≥2 of 20 samples

---

## 6. Post-Normalization Prevention

To prevent recurrence (per WS-G §2.5):

1. All scripts writing JSON with non-ASCII MUST specify UTF-8 encoding explicitly
2. PowerShell: use `-Encoding utf8NoBOM` (PS7+) or `[System.IO.File]::WriteAllText()` with UTF8
3. Add CI lint check scanning for mojibake byte patterns in JSON files
4. Document encoding requirements in CONTRIBUTING.md
5. Consider adding a pre-commit hook that validates Arabic/Urdu field encoding

---

## 7. Authorization Reference

This protocol implements the authorization granted in MFD-12.1 WS-G Q39, with the following amendment based on WS5 findings:

> **AMENDMENT**: The encoding depth is TRIPLE (not double). The normalization algorithm MUST use adaptive iterative decoding (1–3 passes) rather than a fixed two-pass approach. All other WS-G protocol requirements remain in effect.

---

*proposedBy: ai-assisted | reviewStatus: pending-review*  
*No production files modified. No normalization scripts executed.*
