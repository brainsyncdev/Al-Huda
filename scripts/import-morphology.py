#!/usr/bin/env python3
"""
Morphology import script — loads QUL SQLite files, validates against pinned datasets,
and generates a deterministic JSON index for the TypeScript adapter.

This script performs the actual SQLite import at build time, avoiding runtime database
dependencies in the application. The generated JSON index is read by
src/lib/morphology/adapter.ts.

Data sources:
  - data/word-root.db: 1,642 roots, 50,298 word occurrences
  - data/word-lemma.db: 4,817 lemmas, 72,510 word occurrences
  - data/ayah-root.db: 6,214 ayah-level root assignments

Validation:
  - Every ayah reference must resolve to an existing ayah in quran-json
  - Word positions must align with word-data (public/word-data/{surah}.json)
  - Duplicate locations are detected and reported
  - Missing tokens are flagged but don't block import

Output:
  - data/morphology-index.json: validated MorphologyRecord array
  - data/morphology-import-report.json: import statistics and issues
"""

import sqlite3
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Tuple, Optional, Any
from collections import defaultdict

DATA_DIR = Path("data")
WORD_DATA_DIR = Path("public/word-data")
QURAN_DATA_DIR = Path("node_modules/.pnpm/quran-json@3.1.2/node_modules/quran-json/dist/chapters/en")

def load_word_data(surah: int) -> Optional[Dict[str, List[List[str]]]]:
    """Load word-data for a surah from public/word-data/{surah}.json"""
    file_path = WORD_DATA_DIR / f"{surah}.json"
    if not file_path.exists():
        return None
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_quran_data() -> Dict[int, Dict]:
    """Load all surahs from quran-json dataset"""
    surahs = {}
    for i in range(1, 115):
        file_path = QURAN_DATA_DIR / f"{i}.json"
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                surahs[i] = {"verses": data.get("verses", [])}
    return surahs

_ARABIC_LETTER = re.compile(r"[\u0621-\u064A\u0671-\u06D3]")

def _is_word_token(token: str) -> bool:
    """True when a whitespace token contains at least one Arabic letter.

    Standalone Quranic waqf/pause marks (ۖ ۗ ۘ ۙ ۚ ۛ ۜ ۞ etc.) carry no
    letters and are not words, even though word-data sometimes emits them as
    their own space-separated token.
    """
    return _ARABIC_LETTER.search(token) is not None

_WORD_POSITION_MAP_CACHE: Dict[str, Dict[int, str]] = {}

def build_word_position_map(
    word_data: Dict, surah: int, ayah: int
) -> Dict[int, str]:
    """Map a QUL 1-based word position to the word-data display entry.

    The two sources tokenize differently:

      * QUL morphology counts every Arabic word separately.
      * word-data sometimes merges a multi-word phrase into one entry
        (e.g. "بَعْدَ مَا") and sometimes appends a standalone waqf mark as a
        separate whitespace token (e.g. "عَرَبِيًّا ۚ").

    Counting only whitespace tokens that contain Arabic letters makes the two
    conventions line up without altering either source.
    """
    key = f"{surah}:{ayah}"
    cached = _WORD_POSITION_MAP_CACHE.get(key)
    if cached is not None:
        return cached

    mapping: Dict[int, str] = {}
    words = word_data.get(key)
    if words:
        pos = 0
        for entry in words:
            text = entry[0]
            n = sum(1 for t in text.split() if _is_word_token(t))
            if n == 0:
                continue
            for _ in range(n):
                pos += 1
                mapping[pos] = text

    _WORD_POSITION_MAP_CACHE[key] = mapping
    return mapping

def get_word_token(word_data: Dict, surah: int, ayah: int, word_pos: int) -> Optional[str]:
    """Get the Arabic token for a specific QUL word position."""
    if not word_data:
        return None
    return build_word_position_map(word_data, surah, ayah).get(word_pos)

def get_canonical_arabic(quran_data: Dict, surah: int, ayah: int) -> Optional[str]:
    """Get the canonical Arabic text for an ayah"""
    if surah not in quran_data:
        return None
    verses = quran_data[surah]["verses"]
    if ayah < 1 or ayah > len(verses):
        return None
    verse = verses[ayah - 1]
    if verse.get("id") != ayah:
        for v in verses:
            if v.get("id") == ayah:
                return v.get("text")
        return None
    return verse.get("text")

def import_word_root(db_path: Path, quran_data: Dict, word_data_cache: Dict) -> Tuple[List[Dict], Dict]:
    """Import word-root.db and validate against pinned datasets"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Load roots
    cursor.execute("SELECT id, arabic_trilateral FROM roots")
    roots = {row[0]: row[1].replace(" ", "") for row in cursor.fetchall()}
    
    # Load root_words
    cursor.execute("SELECT root_id, word_location FROM root_words")
    root_words = cursor.fetchall()
    
    records = []
    issues = []
    seen_locations = set()
    
    for root_id, word_location in root_words:
        parts = word_location.split(":")
        if len(parts) != 3:
            issues.append({"location": word_location, "issue": "invalid-format"})
            continue
        
        surah = int(parts[0])
        ayah = int(parts[1])
        word_pos = int(parts[2])
        
        root = roots.get(root_id)
        if not root:
            issues.append({"location": word_location, "issue": "missing-root"})
            continue
        
        # Check for duplicate locations
        loc_key = f"{surah}:{ayah}:{word_pos}"
        if loc_key in seen_locations:
            issues.append({"location": word_location, "issue": "duplicate-location"})
        seen_locations.add(loc_key)
        
        # Get word data
        if surah not in word_data_cache:
            word_data_cache[surah] = load_word_data(surah)
        word_data = word_data_cache[surah]
        
        canonical = get_canonical_arabic(quran_data, surah, ayah)
        if not canonical:
            issues.append({"location": word_location, "issue": "missing-canonical"})
            continue
        
        token = get_word_token(word_data, surah, ayah, word_pos)
        if not token:
            # Token missing — flag but don't block
            issues.append({"location": word_location, "issue": "missing-token", "root": root})
            # Still create record with empty token for ayah-level tracking
            token = ""
        
        # Slim record: omit canonicalArabic (filled at load time from getSurah).
        # This keeps the index ~15MB instead of ~68MB.
        rec = {
            "ref": {"surah": surah, "ayah": ayah},
            "wordPosition": word_pos,
            "token": token,
            "sourceId": "qul-morphology-v1",
            "root": root,
        }
        records.append(rec)
    
    conn.close()
    return records, {"issues": issues, "count": len(records), "duplicates": len([i for i in issues if i["issue"] == "duplicate-location"])}

def import_word_lemma(db_path: Path, existing_records: List[Dict], quran_data: Dict, word_data_cache: Dict) -> Tuple[List[Dict], Dict]:
    """Import word-lemma.db and merge lemma data into existing records"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Load lemmas
    cursor.execute("SELECT id, text FROM lemmas")
    lemmas = {row[0]: row[1] for row in cursor.fetchall()}
    
    # Load lemma_words
    cursor.execute("SELECT lemma_id, word_location FROM lemma_words")
    lemma_words = cursor.fetchall()
    
    # Build location index for existing records
    location_index = {}
    for i, rec in enumerate(existing_records):
        if rec.get("wordPosition"):
            loc_key = f"{rec['ref']['surah']}:{rec['ref']['ayah']}:{rec['wordPosition']}"
            location_index[loc_key] = i
    
    new_records = []
    issues = []
    merged_count = 0
    
    for lemma_id, word_location in lemma_words:
        parts = word_location.split(":")
        if len(parts) != 3:
            issues.append({"location": word_location, "issue": "invalid-format"})
            continue
        
        surah = int(parts[0])
        ayah = int(parts[1])
        word_pos = int(parts[2])
        
        lemma = lemmas.get(lemma_id)
        if not lemma:
            issues.append({"location": word_location, "issue": "missing-lemma"})
            continue
        
        canonical = get_canonical_arabic(quran_data, surah, ayah)
        if not canonical:
            issues.append({"location": word_location, "issue": "missing-canonical"})
            continue
        
        # Get word data
        if surah not in word_data_cache:
            word_data_cache[surah] = load_word_data(surah)
        word_data = word_data_cache[surah]
        
        token = get_word_token(word_data, surah, ayah, word_pos)
        if not token:
            token = ""
        
        # Try to merge with existing record
        loc_key = f"{surah}:{ayah}:{word_pos}"
        if loc_key in location_index:
            idx = location_index[loc_key]
            existing_records[idx]["lemma"] = lemma
            merged_count += 1
        else:
            # Create new record with lemma but no root
            new_records.append({
                "ref": {"surah": surah, "ayah": ayah},
                "wordPosition": word_pos,
                "token": token,
                "sourceId": "qul-morphology-v1",
                "lemma": lemma,
            })
    
    conn.close()
    return new_records, {"issues": issues, "count": len(new_records), "merged": merged_count}

def import_ayah_root(db_path: Path, quran_data: Dict) -> Tuple[List[Dict], Dict]:
    """Import ayah-root.db (ayah-level root assignments)"""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    cursor.execute("SELECT verse_key, text FROM roots")
    ayah_roots = cursor.fetchall()
    
    records = []
    issues = []
    
    for verse_key, roots_text in ayah_roots:
        parts = verse_key.split(":")
        if len(parts) != 2:
            issues.append({"location": verse_key, "issue": "invalid-format"})
            continue
        
        surah = int(parts[0])
        ayah = int(parts[1])
        
        canonical = get_canonical_arabic(quran_data, surah, ayah)
        if not canonical:
            issues.append({"location": verse_key, "issue": "missing-canonical"})
            continue
        
        roots = roots_text.split()
        for root in roots:
            records.append({
                "ref": {"surah": surah, "ayah": ayah},
                "token": "",
                "sourceId": "qul-morphology-v1",
                "root": root,
            })
    
    conn.close()
    return records, {"issues": issues, "count": len(records)}

def main():
    print("Loading Quran dataset...")
    quran_data = load_quran_data()
    print(f"Loaded {len(quran_data)} surahs")
    
    word_data_cache = {}
    all_records = []
    all_issues = []
    
    # Import word-root.db
    print("\nImporting word-root.db...")
    word_root_records, word_root_stats = import_word_root(
        DATA_DIR / "word-root.db",
        quran_data,
        word_data_cache
    )
    print(f"  Records: {word_root_stats['count']}")
    print(f"  Issues: {len(word_root_stats['issues'])}")
    print(f"  Duplicates: {word_root_stats['duplicates']}")
    all_records.extend(word_root_records)
    all_issues.extend(word_root_stats['issues'])
    
    # Import word-lemma.db and merge
    print("\nImporting word-lemma.db...")
    word_lemma_records, word_lemma_stats = import_word_lemma(
        DATA_DIR / "word-lemma.db",
        all_records,
        quran_data,
        word_data_cache
    )
    print(f"  New records: {word_lemma_stats['count']}")
    print(f"  Merged with existing: {word_lemma_stats['merged']}")
    print(f"  Issues: {len(word_lemma_stats['issues'])}")
    all_records.extend(word_lemma_records)
    all_issues.extend(word_lemma_stats['issues'])
    
    # Import ayah-root.db
    print("\nImporting ayah-root.db...")
    ayah_root_records, ayah_root_stats = import_ayah_root(
        DATA_DIR / "ayah-root.db",
        quran_data
    )
    print(f"  Records: {ayah_root_stats['count']}")
    print(f"  Issues: {len(ayah_root_stats['issues'])}")
    all_records.extend(ayah_root_records)
    all_issues.extend(ayah_root_stats['issues'])
    
    # Write morphology index
    print(f"\nWriting morphology index ({len(all_records)} records)...")
    with open(DATA_DIR / "morphology-index.json", "w", encoding="utf-8") as f:
        json.dump(all_records, f, ensure_ascii=False, indent=2)
    
    # Write import report
    report = {
        "totalRecords": len(all_records),
        "wordRoot": {
            "records": word_root_stats["count"],
            "duplicates": word_root_stats["duplicates"],
            "issues": len(word_root_stats["issues"])
        },
        "wordLemma": {
            "newRecords": word_lemma_stats["count"],
            "merged": word_lemma_stats["merged"],
            "issues": len(word_lemma_stats["issues"])
        },
        "ayahRoot": {
            "records": ayah_root_stats["count"],
            "issues": len(ayah_root_stats["issues"])
        },
        "sampleIssues": all_issues[:50]
    }
    
    with open(DATA_DIR / "morphology-import-report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print("\n=== IMPORT COMPLETE ===")
    print(f"Total records: {report['totalRecords']}")
    print(f"Index: data/morphology-index.json")
    print(f"Report: data/morphology-import-report.json")

if __name__ == "__main__":
    main()
