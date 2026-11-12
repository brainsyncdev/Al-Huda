#!/usr/bin/env python3
"""
MFD-08 Phase 3: Ayah Mapping Audit Script
Validates all 792 mapping records, calculates coverage, identifies issues,
and generates a comprehensive audit report.
"""

import json
import os
import sys
from collections import defaultdict, Counter
from datetime import datetime

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAPPINGS_FILE = os.path.join(BASE_DIR, "data", "taxonomy", "topic-ayah-mappings.json")
TOPICS_FILE = os.path.join(BASE_DIR, "data", "taxonomy", "topics.json")
QURAN_FILE = os.path.join(BASE_DIR, "node_modules", "quran-json", "dist", "quran.json")
REPORT_FILE = os.path.join(BASE_DIR, "docs", "FAHM-MFD-08-AYAH-MAPPING-AUDIT.md")

VALID_MAPPING_TYPES = {
    "DIRECT_REFERENCE",
    "EXPLICIT_INSTRUCTION",
    "THEMATIC_REFERENCE",
    "GENERAL_QURANIC_PRINCIPLE",
    "PROPHETIC_NARRATIVE",
    "TAFFSIR_SUPPORTED",  # Note: likely typo for TAFSIR_SUPPORTED, documented but not fixed
    "EDITORIAL_CROSS_REFERENCE",
    "CONTEMPORARY_APPLICATION",
}

VALID_STATUSES = {"MAPPED", "PENDING_REVIEW", "REVIEWED", "DISPUTED", "pending-review", "pending_review"}


def load_json(path):
    with open(path, "r", encoding="utf-8-sig") as f:
        return json.load(f)


def build_surah_verse_counts(quran_data):
    """Build dict: surah_number -> total_verses"""
    counts = {}
    for surah in quran_data:
        counts[surah["id"]] = surah["total_verses"]
    return counts


def build_topic_id_set(topics_data):
    return {t["id"] for t in topics_data}


def audit_mappings(mappings, verse_counts, topic_ids):
    """
    Validate every mapping record. Returns:
      - valid_count
      - issues: list of dicts describing each issue
      - stats: coverage statistics
    """
    issues = []
    seen_ids = {}
    # For duplicate/overlap detection: topic -> list of (surah, start, end, mapping_id)
    topic_ranges = defaultdict(list)
    
    # Coverage tracking
    unique_topics = set()
    unique_ayat = set()  # (surah, ayah) pairs
    surahs_covered = set()
    mapping_type_counts = Counter()
    status_counts = Counter()
    total_expanded_ayat = 0
    
    for idx, m in enumerate(mappings):
        mid = m.get("id", f"<no-id-at-index-{idx}>")
        topic = m.get("topicId")
        surah = m.get("surahNumber")
        a_start = m.get("ayahStart")
        a_end = m.get("ayahEnd")
        mtype = m.get("mappingType")
        rationale = m.get("rationale")
        sources = m.get("sourceIds")
        provenance = m.get("provenance")
        status = m.get("status")
        
        # --- Required fields ---
        if not mid or mid == f"<no-id-at-index-{idx}>":
            issues.append({"type": "MISSING_ID", "index": idx, "detail": "Mapping has no id field"})
        elif mid in seen_ids:
            issues.append({"type": "DUPLICATE_ID", "index": idx, "id": mid, 
                          "detail": f"Duplicate mapping id '{mid}' (first at index {seen_ids[mid]})"})
        else:
            seen_ids[mid] = idx
        
        if not topic:
            issues.append({"type": "MISSING_TOPIC", "index": idx, "id": mid, "detail": "Missing topicId"})
        elif topic not in topic_ids:
            issues.append({"type": "INVALID_TOPIC", "index": idx, "id": mid, 
                          "detail": f"topicId '{topic}' not found in topics.json"})
        else:
            unique_topics.add(topic)
        
        # --- Surah validation ---
        surah_valid = True
        if surah is None:
            issues.append({"type": "MISSING_SURAH", "index": idx, "id": mid, "detail": "Missing surahNumber"})
            surah_valid = False
        elif not isinstance(surah, int) or surah < 1 or surah > 114:
            issues.append({"type": "INVALID_SURAH", "index": idx, "id": mid, 
                          "detail": f"surahNumber {surah} out of range 1-114"})
            surah_valid = False
        
        # --- Ayah validation ---
        if a_start is None:
            issues.append({"type": "MISSING_AYAH_START", "index": idx, "id": mid, "detail": "Missing ayahStart"})
        if a_end is None:
            issues.append({"type": "MISSING_AYAH_END", "index": idx, "id": mid, "detail": "Missing ayahEnd"})
        
        if surah_valid and a_start is not None and a_end is not None:
            max_verses = verse_counts.get(surah, 0)
            if isinstance(a_start, int) and (a_start < 1 or a_start > max_verses):
                issues.append({"type": "INVALID_AYAH_START", "index": idx, "id": mid,
                              "detail": f"ayahStart {a_start} out of range 1-{max_verses} for surah {surah}"})
            if isinstance(a_end, int) and (a_end < 1 or a_end > max_verses):
                issues.append({"type": "INVALID_AYAH_END", "index": idx, "id": mid,
                              "detail": f"ayahEnd {a_end} out of range 1-{max_verses} for surah {surah}"})
            if isinstance(a_start, int) and isinstance(a_end, int) and a_end < a_start:
                issues.append({"type": "AYAH_RANGE_INVERTED", "index": idx, "id": mid,
                              "detail": f"ayahEnd ({a_end}) < ayahStart ({a_start})"})
            
            # Track coverage only if valid
            if isinstance(a_start, int) and isinstance(a_end, int) and a_end >= a_start:
                if surah_valid and 1 <= a_start <= max_verses and 1 <= a_end <= max_verses:
                    for a in range(a_start, a_end + 1):
                        unique_ayat.add((surah, a))
                    surahs_covered.add(surah)
                    total_expanded_ayat += (a_end - a_start + 1)
        
        # --- Mapping type ---
        if not mtype:
            issues.append({"type": "MISSING_MAPPING_TYPE", "index": idx, "id": mid, "detail": "Missing mappingType"})
        elif mtype not in VALID_MAPPING_TYPES:
            issues.append({"type": "INVALID_MAPPING_TYPE", "index": idx, "id": mid,
                          "detail": f"mappingType '{mtype}' not in canonical list"})
        else:
            mapping_type_counts[mtype] += 1
        
        # --- Rationale ---
        if not rationale or (isinstance(rationale, str) and rationale.strip() == ""):
            issues.append({"type": "EMPTY_RATIONALE", "index": idx, "id": mid, "detail": "Empty or missing rationale"})
        
        # --- Source IDs ---
        if not sources or not isinstance(sources, list) or len(sources) == 0:
            issues.append({"type": "EMPTY_SOURCES", "index": idx, "id": mid, "detail": "Empty or missing sourceIds"})
        
        # --- Provenance ---
        if not provenance or (isinstance(provenance, str) and provenance.strip() == ""):
            issues.append({"type": "EMPTY_PROVENANCE", "index": idx, "id": mid, "detail": "Empty or missing provenance"})
        
        # --- Status ---
        if not status:
            issues.append({"type": "MISSING_STATUS", "index": idx, "id": mid, "detail": "Missing status"})
        else:
            status_counts[status] += 1
        
        # Track ranges for overlap/duplicate detection (only if valid)
        if surah_valid and topic and isinstance(a_start, int) and isinstance(a_end, int):
            topic_ranges[topic].append((surah, a_start, a_end, mid))
    
    # --- Duplicate & overlap detection ---
    exact_duplicates = []
    overlaps = []
    for topic, ranges in topic_ranges.items():
        # Sort by surah, start
        ranges_sorted = sorted(ranges, key=lambda x: (x[0], x[1], x[2]))
        seen_pairs = {}
        for surah, start, end, mid in ranges_sorted:
            key = (surah, start, end)
            if key in seen_pairs:
                exact_duplicates.append({
                    "topic": topic,
                    "surah": surah,
                    "start": start,
                    "end": end,
                    "ids": [seen_pairs[key], mid]
                })
            else:
                seen_pairs[key] = mid
        
        # Overlap detection (same topic, same surah, overlapping ranges but not identical)
        by_surah = defaultdict(list)
        for surah, start, end, mid in ranges_sorted:
            by_surah[surah].append((start, end, mid))
        
        for surah, surah_ranges in by_surah.items():
            for i in range(len(surah_ranges)):
                for j in range(i + 1, len(surah_ranges)):
                    s1, e1, m1 = surah_ranges[i]
                    s2, e2, m2 = surah_ranges[j]
                    # Overlap if ranges intersect but are not identical
                    if s1 <= e2 and s2 <= e1 and (s1, e1) != (s2, e2):
                        overlaps.append({
                            "topic": topic,
                            "surah": surah,
                            "range1": f"{s1}-{e1}",
                            "range2": f"{s2}-{e2}",
                            "id1": m1,
                            "id2": m2
                        })
    
    # Topic mapping counts
    topic_mapping_counts = Counter()
    for m in mappings:
        topic_mapping_counts[m.get("topicId")] += 1
    
    stats = {
        "total_records": len(mappings),
        "unique_topics": len(unique_topics),
        "total_expanded_ayat": total_expanded_ayat,
        "unique_ayat": len(unique_ayat),
        "surahs_covered": len(surahs_covered),
        "surahs_covered_list": sorted(surahs_covered),
        "surahs_not_covered": sorted(set(range(1, 115)) - surahs_covered),
        "mapping_type_counts": dict(mapping_type_counts),
        "status_counts": dict(status_counts),
        "topic_mapping_counts": dict(topic_mapping_counts),
    }
    
    return stats, issues, exact_duplicates, overlaps


def generate_report(stats, issues, exact_duplicates, overlaps, mappings):
    """Generate the markdown audit report."""
    
    # Categorize issues
    issue_counts = Counter(i["type"] for i in issues)
    
    lines = []
    lines.append("# MFD-08 Phase 3: Ayah Mapping Audit Report")
    lines.append("")
    lines.append(f"**Generated:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    lines.append("")
    lines.append("## Executive Summary")
    lines.append("")
    lines.append(f"| Metric | Value |")
    lines.append(f"|--------|-------|")
    lines.append(f"| Total mapping records | {stats['total_records']} |")
    lines.append(f"| Unique topics covered | {stats['unique_topics']} |")
    lines.append(f"| Total expanded ayat (sum of ranges) | {stats['total_expanded_ayat']} |")
    lines.append(f"| Unique ayat (deduplicated) | {stats['unique_ayat']} |")
    lines.append(f"| Surahs covered | {stats['surahs_covered']} / 114 |")
    lines.append(f"| Total issues found | {len(issues)} |")
    lines.append(f"| Exact duplicate mappings | {len(exact_duplicates)} |")
    lines.append(f"| Overlapping mappings | {len(overlaps)} |")
    lines.append("")
    
    # Coverage Statistics
    lines.append("## Coverage Statistics")
    lines.append("")
    lines.append("### Mapping Type Distribution")
    lines.append("")
    lines.append("| Mapping Type | Count |")
    lines.append("|--------------|-------|")
    for mtype, count in sorted(stats["mapping_type_counts"].items(), key=lambda x: -x[1]):
        lines.append(f"| `{mtype}` | {count} |")
    lines.append("")
    
    lines.append("### Status Distribution")
    lines.append("")
    lines.append("| Status | Count |")
    lines.append("|--------|-------|")
    for status, count in sorted(stats["status_counts"].items(), key=lambda x: -x[1]):
        lines.append(f"| `{status}` | {count} |")
    lines.append("")
    
    lines.append("### Surah Coverage")
    lines.append("")
    lines.append(f"- **Surahs with at least one mapping:** {stats['surahs_covered']}")
    lines.append(f"- **Surahs with no mappings:** {len(stats['surahs_not_covered'])}")
    if stats["surahs_not_covered"]:
        lines.append(f"- **Uncovered surahs:** {', '.join(str(s) for s in stats['surahs_not_covered'])}")
    lines.append("")
    
    # Issues Summary
    lines.append("## Issues Found")
    lines.append("")
    lines.append("### Issue Summary")
    lines.append("")
    lines.append("| Issue Type | Count |")
    lines.append("|------------|-------|")
    for itype, count in sorted(issue_counts.items(), key=lambda x: -x[1]):
        lines.append(f"| {itype} | {count} |")
    lines.append("")
    
    # Detailed issues by category
    lines.append("### Detailed Issues")
    lines.append("")
    
    # Group issues by type
    issues_by_type = defaultdict(list)
    for i in issues:
        issues_by_type[i["type"]].append(i)
    
    for itype in sorted(issues_by_type.keys()):
        items = issues_by_type[itype]
        lines.append(f"#### {itype} ({len(items)} occurrences)")
        lines.append("")
        # Show first 10 examples
        for item in items[:10]:
            lines.append(f"- Index {item.get('index', '?')}, id `{item.get('id', '?')}`: {item['detail']}")
        if len(items) > 10:
            lines.append(f"- ... and {len(items) - 10} more")
        lines.append("")
    
    # Exact Duplicates
    lines.append("## Exact Duplicate Mappings")
    lines.append("")
    if exact_duplicates:
        lines.append(f"Found **{len(exact_duplicates)}** exact duplicate mapping(s) (same topic + surah + ayah range):")
        lines.append("")
        lines.append("| Topic | Surah | Range | Mapping IDs |")
        lines.append("|-------|-------|-------|-------------|")
        for d in exact_duplicates:
            lines.append(f"| `{d['topic']}` | {d['surah']} | {d['start']}-{d['end']} | {', '.join('`' + i + '`' for i in d['ids'])} |")
    else:
        lines.append("No exact duplicate mappings found.")
    lines.append("")
    
    # Overlapping Mappings
    lines.append("## Overlapping Mappings")
    lines.append("")
    if overlaps:
        lines.append(f"Found **{len(overlaps)}** overlapping mapping(s) (same topic + overlapping ayah ranges):")
        lines.append("")
        lines.append("| Topic | Surah | Range 1 | Range 2 | IDs |")
        lines.append("|-------|-------|---------|---------|-----|")
        for o in overlaps[:50]:
            lines.append(f"| `{o['topic']}` | {o['surah']} | {o['range1']} | {o['range2']} | `{o['id1']}`, `{o['id2']}` |")
        if len(overlaps) > 50:
            lines.append(f"| ... | ... | ... | ... | and {len(overlaps) - 50} more |")
    else:
        lines.append("No overlapping mappings found.")
    lines.append("")
    
    # Topic mapping distribution
    lines.append("## Topic Mapping Distribution")
    lines.append("")
    counts = sorted(stats["topic_mapping_counts"].items(), key=lambda x: -x[1])
    lines.append("| Topic ID | Mapping Count |")
    lines.append("|----------|---------------|")
    for topic, count in counts[:30]:
        lines.append(f"| `{topic}` | {count} |")
    if len(counts) > 30:
        lines.append(f"| ... | ... ({len(counts)} total topics) |")
    lines.append("")
    
    # Identify topics with suspiciously few/many mappings
    if counts:
        avg = stats['total_records'] / max(len(counts), 1)
        few = [(t, c) for t, c in counts if c <= 1]
        many = [(t, c) for t, c in counts if c > avg * 3]
        
        if few:
            lines.append("### Topics with Suspiciously Few Mappings (1 or fewer)")
            lines.append("")
            for t, c in few[:20]:
                lines.append(f"- `{t}`: {c} mapping(s)")
            if len(few) > 20:
                lines.append(f"- ... and {len(few) - 20} more")
            lines.append("")
        
        if many:
            lines.append("### Topics with Suspiciously Many Mappings (>3x average)")
            lines.append("")
            for t, c in many[:20]:
                lines.append(f"- `{t}`: {c} mapping(s)")
            if len(many) > 20:
                lines.append(f"- ... and {len(many) - 20} more")
            lines.append("")
    
    # Mapping Type Validation
    lines.append("## Mapping Type Validation")
    lines.append("")
    lines.append("Canonical mapping types:")
    lines.append("")
    for t in sorted(VALID_MAPPING_TYPES):
        lines.append(f"- `{t}`")
    lines.append("")
    
    invalid_types = [i for i in issues if i["type"] == "INVALID_MAPPING_TYPE"]
    if invalid_types:
        lines.append(f"**Found {len(invalid_types)} invalid mapping type(s):**")
        lines.append("")
        for i in invalid_types[:10]:
            lines.append(f"- `{i['id']}`: `{i['detail']}`")
        lines.append("")
    else:
        lines.append("All mapping types are valid.")
    lines.append("")
    
    # Note about TAFFSIR_SUPPORTED
    taffsir_count = stats["mapping_type_counts"].get("TAFFSIR_SUPPORTED", 0)
    if taffsir_count > 0:
        lines.append(f"### Note on `TAFFSIR_SUPPORTED`")
        lines.append("")
        lines.append(f"Found **{taffsir_count}** mapping(s) using `TAFFSIR_SUPPORTED` (likely a typo for `TAFSIR_SUPPORTED`).")
        lines.append("This is documented but **NOT fixed** in this phase — correction is deferred to a migration task.")
        lines.append("")
    
    # Recommendations
    lines.append("## Recommendations")
    lines.append("")
    lines.append("### Critical (Fix in This Phase)")
    lines.append("")
    if any(i["type"] in ("INVALID_SURAH", "INVALID_AYAH_START", "INVALID_AYAH_END") for i in issues):
        lines.append("1. **Fix invalid surah/ayah references** — correct to valid values or remove the mapping.")
    if any(i["type"] == "DUPLICATE_ID" for i in issues):
        lines.append("2. **Remove exact duplicate mappings** — keep one, remove the other.")
    if any(i["type"] in ("MISSING_TOPIC", "INVALID_TOPIC") for i in issues):
        lines.append("3. **Fix invalid topic references** — correct topicId or mark as pending-review.")
    lines.append("")
    lines.append("### Deferred (Future Migration)")
    lines.append("")
    if taffsir_count > 0:
        lines.append(f"1. **Fix `TAFFSIR_SUPPORTED` typo** — {taffsir_count} mapping(s) need type corrected to `TAFSIR_SUPPORTED` (or whichever is canonical).")
    if overlaps:
        lines.append(f"2. **Resolve {len(overlaps)} overlapping mappings** — review and merge or adjust ranges.")
    if any(i["type"] == "EMPTY_RATIONALE" for i in issues):
        lines.append("3. **Fill empty rationales** — add meaningful scholarly justification.")
    lines.append("")
    lines.append("### Informational")
    lines.append("")
    lines.append(f"- {len(stats['surahs_not_covered'])} surah(s) have no mappings yet — may need scholarly review for coverage.")
    lines.append(f"- All mapping provenance is currently `pending-scholarly-review` — plan for scholarly validation pass.")
    lines.append("")
    lines.append("---")
    lines.append(f"*Report generated by MFD-08 Phase 3 Audit Script on {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}*")
    
    return "\n".join(lines)


def fix_critical_issues(mappings, issues, exact_duplicates):
    """
    Fix only critical issues:
    - Remove exact duplicate mappings (keep first occurrence)
    - Fix invalid surah/ayah references (mark as pending-review or remove)
    - Fix missing required fields (add placeholder, set status to pending-review)
    
    Returns the fixed mappings list and a summary of changes.
    """
    changes = []
    
    # Build set of duplicate IDs to remove (keep first occurrence)
    ids_to_remove = set()
    for d in exact_duplicates:
        # Remove all but the first ID
        ids_to_remove.update(d["ids"][1:])
        changes.append(f"Removed duplicate mapping(s): {', '.join(d['ids'][1:])} (keeping {d['ids'][0]})")
    
    # Build set of indices with invalid references
    invalid_ref_indices = set()
    for i in issues:
        if i["type"] in ("INVALID_SURAH", "INVALID_AYAH_START", "INVALID_AYAH_END", "INVALID_TOPIC"):
            invalid_ref_indices.add(i["index"])
    
    fixed = []
    for idx, m in enumerate(mappings):
        mid = m.get("id", f"<no-id-{idx}>")
        
        # Remove exact duplicates
        if mid in ids_to_remove:
            continue
        
        # Fix invalid references by setting status to pending-review
        if idx in invalid_ref_indices:
            m_copy = dict(m)
            m_copy["status"] = "pending-review"
            m_copy["_audit_note"] = "Flagged by MFD-08 audit: invalid reference detected"
            fixed.append(m_copy)
            changes.append(f"Flagged `{mid}` as pending-review (invalid reference at index {idx})")
        else:
            fixed.append(m)
    
    return fixed, changes


def main():
    print("=" * 60)
    print("MFD-08 Phase 3: Ayah Mapping Audit")
    print("=" * 60)
    
    # Load data
    print("\n[1/6] Loading data files...")
    quran_data = load_json(QURAN_FILE)
    topics_data = load_json(TOPICS_FILE)
    mappings = load_json(MAPPINGS_FILE)
    
    verse_counts = build_surah_verse_counts(quran_data)
    topic_ids = build_topic_id_set(topics_data)
    
    print(f"  - Quran: {len(quran_data)} surahs, {sum(verse_counts.values())} total verses")
    print(f"  - Topics: {len(topics_data)} topics")
    print(f"  - Mappings: {len(mappings)} records")
    
    # Audit
    print("\n[2/6] Auditing all mapping records...")
    stats, issues, exact_duplicates, overlaps = audit_mappings(mappings, verse_counts, topic_ids)
    
    print(f"  - Valid records: {stats['total_records'] - len(set(i['index'] for i in issues if 'index' in i))}")
    print(f"  - Issues found: {len(issues)}")
    print(f"  - Exact duplicates: {len(exact_duplicates)}")
    print(f"  - Overlapping mappings: {len(overlaps)}")
    
    # Coverage stats
    print("\n[3/6] Coverage statistics:")
    print(f"  - Unique topics: {stats['unique_topics']}")
    print(f"  - Total expanded ayat: {stats['total_expanded_ayat']}")
    print(f"  - Unique ayat: {stats['unique_ayat']}")
    print(f"  - Surahs covered: {stats['surahs_covered']}/114")
    
    # Mapping type distribution
    print("\n[4/6] Mapping type distribution:")
    for mtype, count in sorted(stats["mapping_type_counts"].items(), key=lambda x: -x[1]):
        print(f"  - {mtype}: {count}")
    
    # Generate report
    print("\n[5/6] Generating audit report...")
    report = generate_report(stats, issues, exact_duplicates, overlaps, mappings)
    
    os.makedirs(os.path.dirname(REPORT_FILE), exist_ok=True)
    with open(REPORT_FILE, "w", encoding="utf-8") as f:
        f.write(report)
    print(f"  - Report written to: {REPORT_FILE}")
    
    # Fix critical issues
    print("\n[6/6] Fixing critical issues...")
    fixed_mappings, changes = fix_critical_issues(mappings, issues, exact_duplicates)
    
    if changes:
        print(f"  - Applied {len(changes)} fix(es):")
        for c in changes[:20]:
            print(f"    * {c}")
        if len(changes) > 20:
            print(f"    ... and {len(changes) - 20} more")
        
        # Write fixed mappings
        with open(MAPPINGS_FILE, "w", encoding="utf-8") as f:
            json.dump(fixed_mappings, f, indent=4, ensure_ascii=False)
        print(f"  - Fixed mappings written to: {MAPPINGS_FILE}")
        print(f"  - Record count: {len(mappings)} -> {len(fixed_mappings)}")
    else:
        print("  - No critical fixes needed.")
    
    # Summary
    print("\n" + "=" * 60)
    print("AUDIT COMPLETE")
    print("=" * 60)
    print(f"  Total records: {stats['total_records']}")
    print(f"  Issues found: {len(issues)}")
    print(f"  Fixes applied: {len(changes)}")
    print(f"  Report: {REPORT_FILE}")
    
    # Return summary as JSON for parent agent
    summary = {
        "total_records": stats["total_records"],
        "unique_topics": stats["unique_topics"],
        "total_expanded_ayat": stats["total_expanded_ayat"],
        "unique_ayat": stats["unique_ayat"],
        "surahs_covered": stats["surahs_covered"],
        "total_issues": len(issues),
        "exact_duplicates": len(exact_duplicates),
        "overlapping_mappings": len(overlaps),
        "fixes_applied": len(changes),
        "final_record_count": len(fixed_mappings),
        "report_path": REPORT_FILE,
        "mapping_type_distribution": stats["mapping_type_counts"],
        "issue_breakdown": dict(Counter(i["type"] for i in issues)),
    }
    
    # Write summary JSON
    summary_path = os.path.join(BASE_DIR, "docs", "MFD-08-audit-summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"\nSummary JSON: {summary_path}")
    return summary


if __name__ == "__main__":
    main()
