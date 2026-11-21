# WS5: Post-Normalization Validation Report Template

| Field | Value |
|-------|-------|
| Workstream | MFD-12.2 WS5 (Validated UTF-8/Mojibake Normalization) |
| Date | YYYY-MM-DD |
| Executed By | [name/tool] |
| proposedBy | ai-assisted |
| reviewStatus | pending-review |

---

## 1. Execution Summary

| Item | Value |
|------|-------|
| Target file | `data/taxonomy/topics.json` |
| Backup created | `data/taxonomy/topics.json.bak.pre-normalization.ws5` |
| Backup SHA-256 | `[hash]` |
| Normalized file SHA-256 | `[hash]` |
| Algorithm used | Adaptive iterative CP1252→UTF-8 (max 3 passes) |
| Script/language | [Python/Node.js/PowerShell] |
| Execution timestamp | [ISO 8601] |
| Duration | [seconds] |

---

## 2. Structural Integrity Checks

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| JSON parse success | Yes | [Yes/No] | ✅/❌ |
| Entry count pre | 184 | [count] | ✅/❌ |
| Entry count post | 184 | [count] | ✅/❌ |
| All urduTitle non-null | Yes | [Yes/No] | ✅/❌ |
| All arabicTitle non-null | Yes | [Yes/No] | ✅/❌ |
| Schema validation | Pass | [Pass/Fail] | ✅/❌ |
| Non-target fields unchanged | Yes | [Yes/No] | ✅/❌ |

---

## 3. Encoding Validation

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| Entries with valid Arabic/Urdu in urduTitle | 184 | [count] | ✅/❌ |
| Entries with valid Arabic/Urdu in arabicTitle | 184 | [count] | ✅/❌ |
| Residual mojibake in urduTitle | 0 | [count] | ✅/❌ |
| Residual mojibake in arabicTitle | 0 | [count] | ✅/❌ |
| Triple-encoded remnants | 0 | [count] | ✅/❌ |
| Double-encoded remnants | 0 | [count] | ✅/❌ |

### Mojibake Signature Scan Results

```
Pattern 'Ãƒ' occurrences: [count]
Pattern 'Ã˜' occurrences: [count]
Pattern 'Ã™' occurrences: [count]
Pattern 'Ã›' occurrences: [count]
Pattern 'â€' occurrences: [count]
Total mojibake signatures: [count]
```

---

## 4. Idempotency Test Results

| Check | Expected | Actual | Status |
|-------|----------|--------|--------|
| normalize(normalize(x)) == normalize(x) for all entries | Yes | [Yes/No] | ✅/❌ |
| Entries failing idempotency | 0 | [count] | ✅/❌ |

List any entries failing idempotency (if any):

```
[entry-id]: L1=[...], L2=[...], mismatch=[details]
```

---

## 5. Spot-Check Results (20 Entries)

### 5.1 Sample Selection

| # | Entry ID | Selection Criteria |
|---|----------|--------------------|
| 1 | tawheed-fundamentals | First entry |
| 2 | asma-ul-husna | First 5 |
| 3 | divine-unity | First 5 |
| 4 | divine-mercy | First 5 |
| 5 | divine-wrath | First 5 |
| 6 | [id] | Middle (entry 90) |
| 7 | [id] | Middle (entry 91) |
| 8 | [id] | Middle (entry 92) |
| 9 | [id] | Middle (entry 93) |
| 10 | [id] | Middle (entry 94) |
| 11 | [id] | End (entry 179) |
| 12 | [id] | End (entry 180) |
| 13 | [id] | End (entry 181) |
| 14 | [id] | End (entry 182) |
| 15 | [id] | End (entry 183) |
| 16 | asma-ul-husna | Known reference |
| 17 | shirk-prohibition | Known reference |
| 18 | salah-prayer | Known reference |
| 19 | zakat-obligatory-charity | Known reference |
| 20 | quran-science | Known reference |

### 5.2 Per-Entry Evaluation

| # | Entry ID | urduTitle Valid | arabicTitle Valid | No Residual Mojibake | Matches Reference | Notes |
|---|----------|-----------------|-------------------|---------------------|-------------------|-------|
| 1 | | ✅/❌ | ✅/❌ | ✅/❌ | N/A | |
| 2 | | ✅/❌ | ✅/❌ | ✅/❌ | ✅/❌ | |
| ... | | | | | | |

### 5.3 Spot-Check Summary

| Metric | Value |
|--------|-------|
| Total sampled | 20 |
| Passed all checks | [count]/20 |
| Failed urduTitle | [count] |
| Failed arabicTitle | [count] |
| Residual mojibake found | [count] |
| Reference mismatches | [count]/5 |

---

## 6. Cross-Corpus Comparison

| Comparison Target | Matches | Mismatches | Status |
|-------------------|---------|------------|--------|
| dimensions.json overlapping titles | [count] | [count] | ✅/❌ |
| domains.json overlapping titles | [count] | [count] | ✅/❌ |
| src/lib/topics/data.ts hardcoded titles | [count] | [count] | ✅/❌ |

List any mismatches:

```
[topic-id].[field]: normalized="[...]" vs reference="[...]"
```

---

## 7. Diff Summary

| Metric | Value |
|--------|-------|
| Fields changed | urduTitle, arabicTitle only |
| Entries with urduTitle changed | [count]/184 |
| Entries with arabicTitle changed | [count]/184 |
| Non-target fields modified | [count] (MUST be 0) |
| Lines added | [count] |
| Lines removed | [count] |

---

## 8. Encoding Depth Distribution

| Depth | Count | Percentage |
|-------|-------|------------|
| Triple-encoded (3 passes needed) | [count] | [%] |
| Double-encoded (2 passes needed) | [count] | [%] |
| Already correct (0 passes) | [count] | [%] |
| Failed to normalize | [count] | [%] |

---

## 9. Overall Verdict

| Criterion | Met? |
|-----------|------|
| All structural checks pass | ✅/❌ |
| Zero residual mojibake | ✅/❌ |
| Idempotency confirmed | ✅/❌ |
| Spot-check ≥18/20 pass | ✅/❌ |
| No non-target fields modified | ✅/❌ |
| Cross-corpus consistency | ✅/❌ |

**VERDICT**: [PASS / FAIL / CONDITIONAL PASS]

If FAIL or CONDITIONAL PASS, specify required remediation:

```
[Describe specific issues and recommended fixes]
```

---

## 10. Sign-Off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Executor | | | |
| Technical Reviewer | | | |
| Scholarly Reviewer (spot-check) | | | |

---

*proposedBy: ai-assisted | reviewStatus: pending-review*  
*Template only — fill in after normalization execution.*
