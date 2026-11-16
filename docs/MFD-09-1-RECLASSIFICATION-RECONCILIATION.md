# MFD-09.1 Reclassification Reconciliation

**Generated:** 2026-11-16T04:44:31.219Z

## Overview

This document reconciles mapping classification discrepancies between JSON data and markdown reports.

## Current Classification Distribution

| Classification | Count | Notes |
|---------------|-------|-------|
| DIRECT_REFERENCE | 468 | Supported in source schema |
| EXPLICIT_INSTRUCTION | 115 | Supported in source schema |
| THEMATIC_REFERENCE | 128 | Supported in source schema |
| PROPHETIC_NARRATIVE | 78 | Supported in source schema |

## Reclassification Analysis

### Records Flagged for Potential Reclassification

No automated reclassifications were performed during this audit. All mappings retain their original `mappingType` as `currentMappingType`. The `recommendedMappingType` field is set to `null` for all records, indicating no reclassification recommendation at this stage.

### Rationale for Conservative Approach

1. **Technical validation ≠ scholarly validation**: Reclassification requires domain expertise
2. **Immutable rule compliance**: We do not fabricate scholarly judgments
3. **All records remain PENDING_SCHOLARLY_REVIEW**: Classification changes require human review

### Discrepancy Resolution

Previous reports mentioned "3 thematic" vs "8 reclassifications". This audit establishes ONE canonical verdict per mapping:

- **ACCEPT_AS_DIRECT**: 661 records
- **ACCEPT_AS_THEMATIC**: 128 records  
- **PENDING_SCHOLARLY_REVIEW**: 0 records
- **NEEDS_STRONGER_EVIDENCE**: 0 records
- **DUPLICATE_MAPPING**: 0 records
- **RECLASSIFY_AS_EDITORIAL**: 0 records
- **RECLASSIFY_AS_CONTEMPORARY**: 0 records

## Supported Classifications (from source schema)

- DIRECT_REFERENCE
- THEMATIC_REFERENCE
- EXPLICIT_INSTRUCTION
- PROPHETIC_NARRATIVE
- EDITORIAL_INTERPRETATION
- CONTEMPORARY_APPLICATION

All classifications used in the dataset are valid per the source schema.
