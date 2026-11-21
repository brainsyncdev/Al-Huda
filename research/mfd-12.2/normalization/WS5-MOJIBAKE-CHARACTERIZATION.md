# WS5: Mojibake Characterization Report

| Field | Value |
|-------|-------|
| Workstream | MFD-12.2 WS5 (Validated UTF-8/Mojibake Normalization) |
| Date | 2026-11-21 |
| proposedBy | ai-assisted |
| reviewStatus | pending-review |
| Scope | PLANNING ONLY — no production data modified |

---

## 1. Executive Summary

The mojibake in `data/taxonomy/topics.json` is **triple-encoded UTF-8 via Windows-1252**, not double-encoded as initially hypothesized in MFD-12.1 WS-G. This means the original UTF-8 bytes were misinterpreted as CP1252 and re-encoded to UTF-8 **three times**, requiring three successive CP1252→UTF-8 decode passes to recover the correct Arabic/Urdu text.

Additionally, encoding depth is **inconsistent**: some entries are triple-encoded while others are only double-encoded, indicating multiple corruption events or partial fixes in the file's history.

---

## 2. Encoding Pattern Analysis

### 2.1 Confirmed Encoding Chain

```
Original UTF-8 bytes
    → Misread as CP1252 → Re-encoded to UTF-8 (Layer 1 / double-encoded)
    → Misread as CP1252 → Re-encoded to UTF-8 (Layer 2 / triple-encoded)
```

### 2.2 Byte-Level Evidence

For the Urdu title "توحید کے بنیادی اصول" (tawheed-fundamentals):

| Layer | Observed String | Description |
|-------|----------------|-------------|
| L0 (stored) | `ÃƒËœÃ‚ÂªÃƒâ„¢Ã‹â€ ÃƒËœÃ‚Â­...` | Triple-encoded mojibake in file |
| L1 (1st decode) | `Ã˜ÂªÃ™Ë†Ã˜Â­Ã›Å'Ã˜Â¯...` | Double-encoded mojibake (matches WS-G observation) |
| L2 (2nd decode) | `ØªÙˆØ­ÛŒØ¯ Ú©Û' Ø¨Ù†ÛŒØ§Ø¯ÛŒ Ø§ØµÙˆÙ„` | Single-encoded mojibake (valid UTF-8 bytes as Latin-1 chars) |
| L3 (3rd decode) | `توحید کے بنیادی اصول` | ✅ Correct Urdu text |

### 2.3 Why CP1252 and Not Latin-1?

The presence of characters like `â€`, `â€"`, `â€'`, `â€¦`, `Å'`, `ÛŒ` confirms Windows-1252 interpretation:
- Bytes 0x80–0x9F are undefined in ISO-8859-1 but map to specific characters in CP1252
- Example: UTF-8 byte `0x93` → CP1252 `"` (left double quote) → appears as `â€œ` when that CP1252 char is re-encoded to UTF-8
- Pure Latin-1 decode produces replacement characters (``) for these byte values

### 2.4 Mixed Encoding Depth

Testing across 8 sampled entries revealed:

| Entry ID | Encoding Depth | Notes |
|----------|---------------|-------|
| tawheed-fundamentals | Triple (3 passes) | Both urduTitle and arabicTitle |
| asma-ul-husna | Triple (3 passes) | Both fields |
| divine-knowledge | Triple (3 passes) | Both fields |
| shirk-prohibition | Triple (3 passes) | Both fields |
| salih-story | Triple (3 passes) | Both fields |
| reflection-tafakkur | Triple (3 passes) | Both fields |
| major-signs | Triple (3 passes) | Both fields |
| covenants-ahd | **Double (2 passes)** | L2 already produces valid Arabic: `عہد و میثاق` |

This inconsistency suggests the file was processed through encoding-corrupting pipelines at different times, or some entries were added/re-exported separately.

---

## 3. Affected Files and Fields

### 3.1 File-Level Assessment

| File | Total Entries | Affected Fields | Encoding Status |
|------|--------------|-----------------|------------------|
| `data/taxonomy/topics.json` | 184 | `urduTitle`, `arabicTitle` | **TRIPLE-ENCODED** (with mixed depth) |
| `data/taxonomy/dimensions.json` | ~40 | `urduTitle`, `arabicTitle` | ✅ Clean (proper UTF-8 Arabic/Urdu) |
| `data/taxonomy/domains.json` | 20 | `urduTitle`, `arabicTitle` | ✅ Clean (proper UTF-8 Arabic/Urdu) |

### 3.2 Field-Level Impact in topics.json

- **urduTitle**: All 184 entries contain mojibake (mix of triple and double encoded)
- **arabicTitle**: All 184 entries contain mojibake (same pattern)
- **title** (English): ✅ Unaffected — ASCII/Latin text renders correctly
- **description**: ✅ Unaffected
- **slug**, **id**: ✅ Unaffected
- **searchAliases**: ✅ Unaffected (English-only values)
- All other structural fields: ✅ Unaffected

### 3.3 Estimated Record Counts

| Category | Count |
|----------|-------|
| Total topic entries | 184 |
| Entries with mojibake urduTitle | 184 (100%) |
| Entries with mojibake arabicTitle | 184 (100%) |
| Triple-encoded entries (estimated) | ~170+ |
| Double-encoded entries (estimated) | ~10-15 |
| Clean entries | 0 |

---

## 4. Root Cause Hypothesis (Revised)

The triple-encoding pattern indicates **at least two separate corruption events**:

1. **First corruption**: Original UTF-8 JSON was written/read through a PowerShell pipeline without `-Encoding utf8`, causing UTF-8 bytes to be interpreted as CP1252 and re-saved as UTF-8 (producing double-encoding).

2. **Second corruption**: The already-double-encoded file was processed through another CP1252-misinterpreting pipeline (possibly a different script, a git operation with encoding conversion, or an editor auto-save), adding a third layer.

3. **Partial remediation**: Some entries may have been individually re-exported or patched during the double-encoded stage, explaining why a minority show only double-encoding.

### Prevention Reference

PowerShell's `ConvertTo-Json | Out-File` defaults to UTF-16LE on Windows PowerShell 5.x and system ANSI codepage in some configurations. PowerShell 7+ defaults to UTF-8 without BOM. Any script that reads/writes JSON with non-ASCII content must explicitly specify encoding.

---

## 5. Key Diagnostic Patterns for Detection

### Mojibake Signature Regex (for CI/lint checks)

```
Triple-encoded: /[Ãƒ][â€šâ€žâ€¦â€¡â€°â€¹â€¢â€“â€"â„¢]/
Double-encoded: /[Ã˜Ã™Ã›][ÂªÂ­Â§â€žâ€¦]/ (without triple markers)
```

### Valid Arabic/Urdu Unicode Ranges

```
U+0600–U+06FF  Arabic
U+0750–U+077F  Arabic Supplement
U+FB50–U+FDFF  Arabic Presentation Forms-A
U+FE70–U+FEFF  Arabic Presentation Forms-B
```

---

*proposedBy: ai-assisted | reviewStatus: pending-review*
*No production files modified. No normalization scripts executed.*
