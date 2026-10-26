#!/usr/bin/env python3
"""
Missing-lemma audit — verifies every word-level record that lacks a lemma
against the source QUL morphology databases.

WHY THIS EXISTS (Sprint 42):
    The morphology index contains word-level records whose `lemma` field is
    empty. Before deciding whether those are recoverable, an importer bug, or
    genuinely absent from the source, every one must be checked against
    word-lemma.db by exact word_location. This script does that check for the
    full population, not a sample, and writes the evidence per record.

RECOVERY RULES:
    - A lemma may only be recovered from an authentic source record.
    - A lemma must never be inferred from the root, spelling, context, or an AI.
    - A missing lemma must never be replaced with a placeholder.
    - A record with a missing lemma must never be silently deleted.

STATUS VALUES:
    recovered-from-source   word_location exists in word-lemma.db; the importer
                            should have merged it (importer defect)
    absent-from-source      word_location does not exist in word-lemma.db
    source-db-unavailable   the source database could not be opened

Output: data/lemma-recovery-audit.json (deterministic; no timestamps)
"""

import json
import sqlite3
from pathlib import Path
from collections import defaultdict

DATA_DIR = Path("data")
INDEX_PATH = DATA_DIR / "morphology-index.json"
WORD_LEMMA_DB = DATA_DIR / "word-lemma.db"
WORD_ROOT_DB = DATA_DIR / "word-root.db"
OUT_PATH = DATA_DIR / "lemma-recovery-audit.json"

AUDIT_VERSION = "1.0.0"
SOURCE_DATASET = "qul-morphology-v1"


def load_lemma_locations():
    """Return {word_location: lemma_text} from word-lemma.db."""
    if not WORD_LEMMA_DB.exists():
        return None
    conn = sqlite3.connect(WORD_LEMMA_DB)
    try:
        cur = conn.cursor()
        cur.execute("SELECT id, text FROM lemmas")
        lemmas = {row[0]: row[1] for row in cur.fetchall()}
        cur.execute("SELECT lemma_id, word_location FROM lemma_words")
        return {
            loc: lemmas.get(lemma_id)
            for lemma_id, loc in cur.fetchall()
            if lemmas.get(lemma_id)
        }
    finally:
        conn.close()


def load_root_locations():
    """Return the set of word_locations present in word-root.db."""
    if not WORD_ROOT_DB.exists():
        return None
    conn = sqlite3.connect(WORD_ROOT_DB)
    try:
        cur = conn.cursor()
        cur.execute("SELECT word_location FROM root_words")
        return {row[0] for row in cur.fetchall()}
    finally:
        conn.close()


def main():
    with open(INDEX_PATH, encoding="utf-8") as f:
        records = json.load(f)

    lemma_locations = load_lemma_locations()
    root_locations = load_root_locations()

    word_records = [r for r in records if r.get("wordPosition") is not None]
    with_root = [r for r in word_records if r.get("root")]
    missing = [r for r in with_root if not r.get("lemma")]

    recovered = []
    absent = []
    db_unavailable = False

    for r in missing:
        loc = f"{r['ref']['surah']}:{r['ref']['ayah']}:{r['wordPosition']}"
        entry = {
            "root": r["root"],
            "location": loc,
            "token": r.get("token", ""),
            "surah": r["ref"]["surah"],
            "ayah": r["ref"]["ayah"],
            "wordPosition": r["wordPosition"],
            "presentInWordRootDb": (
                loc in root_locations if root_locations is not None else None
            ),
        }
        if lemma_locations is None:
            db_unavailable = True
            entry["status"] = "source-db-unavailable"
        elif loc in lemma_locations:
            entry["status"] = "recovered-from-source"
            entry["sourceLemma"] = lemma_locations[loc]
            recovered.append(entry)
        else:
            entry["status"] = "absent-from-source"
            absent.append(entry)

    by_root = defaultdict(int)
    by_root_recovered = defaultdict(int)
    for e in recovered:
        by_root[e["root"]] += 1
        by_root_recovered[e["root"]] += 1
    for e in absent:
        by_root[e["root"]] += 1

    # Coverage across the whole source, not just the audited roots.
    both = len(set(lemma_locations or {}) & (root_locations or set()))
    only_root = len((root_locations or set()) - set(lemma_locations or {}))
    only_lemma = len(set(lemma_locations or {}) - (root_locations or set()))

    audit = {
        "auditVersion": AUDIT_VERSION,
        "sourceDataset": SOURCE_DATASET,
        "scope": "every word-level record in the index whose root is set and whose lemma is empty",
        "totalIndexRecords": len(records),
        "totalWordLevelRecords": len(word_records),
        "totalWordLevelWithRoot": len(with_root),
        "totalMissingLemmas": len(missing),
        "recoveredCount": len(recovered),
        "absentCount": len(absent),
        "unavailableCount": len(missing) - len(recovered) - len(absent),
        "sourceDbAvailable": not db_unavailable,
        "verificationMethod": (
            "Each missing word_location was looked up by exact string in "
            "word-lemma.db lemma_words joined to lemmas.text. No inference, "
            "root matching, spelling similarity, or context was used."
        ),
        "sourceCoverage": {
            "wordRootDbLocations": len(root_locations) if root_locations is not None else None,
            "wordLemmaDbLocations": len(lemma_locations) if lemma_locations is not None else None,
            "locationsInBoth": both,
            "locationsWithRootButNoLemma": only_root,
            "locationsWithLemmaButNoRoot": only_lemma,
        },
        "byRoot": {
            root: {
                "missing": by_root[root],
                "recovered": by_root_recovered.get(root, 0),
            }
            for root in sorted(by_root, key=lambda r: (-by_root[r], r))
        },
        "recovered": recovered,
        "absent": absent,
    }

    with open(OUT_PATH, "w", encoding="utf-8") as f:
        json.dump(audit, f, ensure_ascii=False, indent=2)
        f.write("\n")

    print(f"Missing-lemma audit written: {OUT_PATH}")
    print(f"  Missing records audited: {len(missing)}")
    print(f"  Recoverable from source: {len(recovered)}")
    print(f"  Genuinely absent:        {len(absent)}")
    print(f"  Source DB available:     {not db_unavailable}")
    if missing:
        print("  Top roots by missing count:")
        for root in sorted(by_root, key=lambda r: -by_root[r])[:10]:
            print(f"    {root}: {by_root[root]}")


if __name__ == "__main__":
    main()