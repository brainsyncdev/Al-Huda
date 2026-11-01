#!/usr/bin/env python3
"""
Global morphology data-quality audit for Al-Huda.

Scans all roots in the morphology index (word-level records only) and generates
a machine-readable audit report with global totals, per-root coverage stats,
and integrity checks.

Output: data/global-morphology-audit.json

This audit is deterministic: no wall-clock timestamps, stable ordering, and
reproducible from the source data.
"""

import json
import sys
from pathlib import Path
from collections import defaultdict

DATA_DIR = Path(__file__).parent.parent / "data"
INDEX_PATH = DATA_DIR / "morphology-index.json"
OUTPUT_PATH = DATA_DIR / "global-morphology-audit.json"

AUDIT_VERSION = "1.0.0"


def load_index():
    """Load morphology index from JSON."""
    if not INDEX_PATH.exists():
        print(f"ERROR: {INDEX_PATH} not found. Run import-morphology.py first.")
        sys.exit(1)
    
    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def separate_word_and_ayah_level(records):
    """Separate word-level records from ayah-level root markers."""
    word_level = []
    ayah_level = []
    
    for r in records:
        if "wordPosition" in r:
            word_level.append(r)
        else:
            ayah_level.append(r)
    
    return word_level, ayah_level


def check_integrity(word_level):
    """Check for data quality issues: duplicates, invalid locations, malformed roots."""
    issues = {
        "duplicateLocations": [],
        "invalidLocations": [],
        "malformedRoots": [],
    }
    
    seen = {}
    for r in word_level:
        key = f"{r['ref']['surah']}:{r['ref']['ayah']}:{r['wordPosition']}"
        
        # Check duplicates
        if key in seen:
            issues["duplicateLocations"].append(key)
        else:
            seen[key] = r
        
        # Check invalid locations
        surah = r["ref"]["surah"]
        ayah = r["ref"]["ayah"]
        if surah < 1 or surah > 114 or ayah < 1:
            issues["invalidLocations"].append(key)
        
        # Check malformed roots
        root = r.get("root", "")
        if root and (root.strip() == "" or not any('\u0600' <= c <= '\u06FF' for c in root)):
            issues["malformedRoots"].append(key)
    
    return issues


def compute_root_stats(word_level):
    """Compute per-root coverage statistics."""
    root_stats = defaultdict(lambda: {
        "totalWordRecords": 0,
        "recordsWithLemma": 0,
        "missingLemmaCount": 0,
        "uniqueLemmas": set(),
        "surahs": set(),
    })
    
    for r in word_level:
        root = r.get("root")
        if not root:
            continue
        
        stats = root_stats[root]
        stats["totalWordRecords"] += 1
        
        lemma = r.get("lemma")
        if lemma:
            stats["recordsWithLemma"] += 1
            stats["uniqueLemmas"].add(lemma)
        else:
            stats["missingLemmaCount"] += 1
        
        stats["surahs"].add(r["ref"]["surah"])
    
    return root_stats


def compute_surah_distribution(word_level):
    """Compute missing-lemma distribution by surah."""
    surah_missing = defaultdict(int)
    
    for r in word_level:
        if r.get("root") and not r.get("lemma"):
            surah_missing[r["ref"]["surah"]] += 1
    
    return dict(surah_missing)


def build_audit():
    """Build the complete audit report."""
    print("Loading morphology index...")
    records = load_index()
    
    print("Separating word-level and ayah-level records...")
    word_level, ayah_level = separate_word_and_ayah_level(records)
    
    print("Checking integrity...")
    integrity = check_integrity(word_level)
    
    print("Computing root statistics...")
    root_stats = compute_root_stats(word_level)
    
    print("Computing surah distribution...")
    surah_missing = compute_surah_distribution(word_level)
    
    # Global totals
    with_root = sum(1 for r in word_level if r.get("root"))
    without_root = len(word_level) - with_root
    with_lemma = sum(1 for r in word_level if r.get("lemma"))
    without_lemma = len(word_level) - with_lemma
    with_root_and_lemma = sum(1 for r in word_level if r.get("root") and r.get("lemma"))
    with_root_no_lemma = sum(1 for r in word_level if r.get("root") and not r.get("lemma"))
    
    # Per-root breakdown (sorted by root for determinism)
    per_root = {}
    for root in sorted(root_stats.keys()):
        stats = root_stats[root]
        total = stats["totalWordRecords"]
        with_lem = stats["recordsWithLemma"]
        missing = stats["missingLemmaCount"]
        ratio = with_lem / total if total > 0 else 0
        
        per_root[root] = {
            "totalWordRecords": total,
            "recordsWithLemma": with_lem,
            "missingLemmaCount": missing,
            "lemmaCoverageRatio": round(ratio, 4),
            "uniqueLemmaCount": len(stats["uniqueLemmas"]),
            "surahCount": len(stats["surahs"]),
        }
    
    # Reconciliation check: sum of per-root totals must equal global totals
    sum_total = sum(s["totalWordRecords"] for s in per_root.values())
    sum_with_lemma = sum(s["recordsWithLemma"] for s in per_root.values())
    sum_missing = sum(s["missingLemmaCount"] for s in per_root.values())
    
    reconciliation = {
        "perRootTotalMatchesGlobal": sum_total == with_root,
        "perRootWithLemmaMatchesGlobal": sum_with_lemma == with_root_and_lemma,
        "perRootMissingMatchesGlobal": sum_missing == with_root_no_lemma,
    }
    
    # Top roots by missing lemmas
    top_missing_roots = sorted(
        [(root, stats["missingLemmaCount"]) for root, stats in per_root.items() if stats["missingLemmaCount"] > 0],
        key=lambda x: (-x[1], x[0])
    )[:20]
    
    # Top surahs by missing lemmas
    top_missing_surahs = sorted(
        surah_missing.items(),
        key=lambda x: (-x[1], x[0])
    )[:10]
    
    # Integrity summary
    integrity_summary = {
        "duplicateLocations": len(integrity["duplicateLocations"]),
        "invalidLocations": len(integrity["invalidLocations"]),
        "malformedRoots": len(integrity["malformedRoots"]),
        "allChecksPass": all(len(v) == 0 for v in integrity.values()),
    }
    
    audit = {
        "auditVersion": AUDIT_VERSION,
        "sourceDataset": "qul-morphology-v1",
        "globalTotals": {
            "totalRecords": len(records),
            "wordLevelRecords": len(word_level),
            "ayahLevelMarkers": len(ayah_level),
            "wordLevelWithRoot": with_root,
            "wordLevelWithoutRoot": without_root,
            "wordLevelWithLemma": with_lemma,
            "wordLevelWithoutLemma": without_lemma,
            "wordLevelWithRootAndLemma": with_root_and_lemma,
            "wordLevelWithRootNoLemma": with_root_no_lemma,
        },
        "integrityChecks": integrity_summary,
        "reconciliation": reconciliation,
        "perRootCount": len(per_root),
        "topMissingLemmaRoots": [{"root": r, "missing": c} for r, c in top_missing_roots],
        "topMissingLemmaSurahs": [{"surah": s, "missing": c} for s, c in top_missing_surahs],
        "perRoot": per_root,
    }
    
    return audit, reconciliation, integrity_summary


def main():
    audit, reconciliation, integrity_summary = build_audit()
    
    # Write output
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(audit, f, ensure_ascii=False, indent=2)
    
    print(f"\nAudit complete. Output: {OUTPUT_PATH}")
    print(f"\nGlobal totals:")
    print(f"  Total records: {audit['globalTotals']['totalRecords']:,}")
    print(f"  Word-level: {audit['globalTotals']['wordLevelRecords']:,}")
    print(f"  Ayah-level: {audit['globalTotals']['ayahLevelMarkers']:,}")
    print(f"  Word-level with root: {audit['globalTotals']['wordLevelWithRoot']:,}")
    print(f"  Word-level with lemma: {audit['globalTotals']['wordLevelWithLemma']:,}")
    print(f"  Word-level with root, no lemma: {audit['globalTotals']['wordLevelWithRootNoLemma']:,}")
    print(f"\nIntegrity checks:")
    print(f"  Duplicates: {integrity_summary['duplicateLocations']}")
    print(f"  Invalid locations: {integrity_summary['invalidLocations']}")
    print(f"  Malformed roots: {integrity_summary['malformedRoots']}")
    print(f"  All checks pass: {integrity_summary['allChecksPass']}")
    print(f"\nReconciliation:")
    print(f"  Per-root totals match global: {reconciliation['perRootTotalMatchesGlobal']}")
    print(f"  Per-root with-lemma match global: {reconciliation['perRootWithLemmaMatchesGlobal']}")
    print(f"  Per-root missing match global: {reconciliation['perRootMissingMatchesGlobal']}")
    print(f"\nUnique roots: {audit['perRootCount']}")
    
    # Exit nonzero if integrity checks fail or reconciliation fails
    if not integrity_summary["allChecksPass"]:
        print("\nERROR: Integrity checks failed.")
        sys.exit(1)
    
    if not all(reconciliation.values()):
        print("\nERROR: Reconciliation failed.")
        sys.exit(1)
    
    print("\nAudit passed all checks.")


if __name__ == "__main__":
    main()
