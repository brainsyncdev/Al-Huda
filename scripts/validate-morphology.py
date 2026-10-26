#!/usr/bin/env python3
"""
Morphology data validator — loads QUL SQLite files and validates against pinned datasets.

This script performs the same validation as the TypeScript adapter but uses Python's
built-in sqlite3 module to avoid dependency issues.

Outputs a JSON report with validation results.
"""

import sqlite3
import json
import os
from pathlib import Path
from typing import Dict, List, Tuple, Optional

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
                # Store with surah ID as key, extract verses
                surahs[i] = {"verses": data.get("verses", [])}
    return surahs

def get_word_token(word_data: Dict, surah: int, ayah: int, word_pos: int) -> Optional[str]:
    """Get the Arabic token for a specific word position"""
    key = f"{surah}:{ayah}"
    if key not in word_data:
        return None
    words = word_data[key]
    if word_pos < 1 or word_pos > len(words):
        return None
    return words[word_pos - 1][0]  # First element is Arabic token

def get_canonical_arabic(quran_data: Dict, surah: int, ayah: int) -> Optional[str]:
    """Get the canonical Arabic text for an ayah.

    quran-json chapter shape: {"verses": [{"id": 1, "text": "..."}, ...]}
    """
    if surah not in quran_data:
        return None
    verses = quran_data[surah]["verses"]
    if ayah < 1 or ayah > len(verses):
        return None
    verse = verses[ayah - 1]
    if verse.get("id") != ayah:
        # Defensive: fall back to a scan if the dataset is not 1-indexed.
        for v in verses:
            if v.get("id") == ayah:
                return v.get("text")
        return None
    return verse.get("text")

def validate_word_root(db_path: Path, quran_data: Dict, word_data_cache: Dict) -> Tuple[List[Dict], Dict]:
    """Validate word-root.db against pinned datasets"""
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
        
        # Get word data
        if surah not in word_data_cache:
            word_data_cache[surah] = load_word_data(surah)
        word_data = word_data_cache[surah]
        
        if not word_data:
            issues.append({"location": word_location, "issue": "missing-word-data"})
            continue
        
        token = get_word_token(word_data, surah, ayah, word_pos)
        canonical = get_canonical_arabic(quran_data, surah, ayah)
        
        if not token:
            issues.append({"location": word_location, "issue": "missing-token"})
            continue
        
        if not canonical:
            issues.append({"location": word_location, "issue": "missing-canonical"})
            continue
        
        records.append({
            "ref": {"surah": surah, "ayah": ayah},
            "wordPosition": word_pos,
            "token": token,
            "canonicalArabic": canonical,
            "root": root,
            "sourceId": "qul-morphology-v1"
        })
    
    conn.close()
    return records, {"issues": issues, "count": len(records)}

def validate_ayah_root(db_path: Path, quran_data: Dict) -> Tuple[List[Dict], Dict]:
    """Validate ayah-root.db against pinned datasets"""
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
                "canonicalArabic": canonical,
                "root": root,
                "sourceId": "qul-morphology-v1"
            })
    
    conn.close()
    return records, {"issues": issues, "count": len(records)}

def main():
    print("Loading Quran dataset...")
    quran_data = load_quran_data()
    print(f"Loaded {len(quran_data)} surahs")
    
    word_data_cache = {}
    
    # Validate word-root.db
    print("\nValidating word-root.db...")
    word_root_records, word_root_stats = validate_word_root(
        DATA_DIR / "word-root.db",
        quran_data,
        word_data_cache
    )
    print(f"  Records: {word_root_stats['count']}")
    print(f"  Issues: {len(word_root_stats['issues'])}")
    
    # Validate ayah-root.db
    print("\nValidating ayah-root.db...")
    ayah_root_records, ayah_root_stats = validate_ayah_root(
        DATA_DIR / "ayah-root.db",
        quran_data
    )
    print(f"  Records: {ayah_root_stats['count']}")
    print(f"  Issues: {len(ayah_root_stats['issues'])}")
    
    # Build report
    report = {
        "totalRecords": word_root_stats["count"] + ayah_root_stats["count"],
        "wordRoot": {
            "records": word_root_stats["count"],
            "issues": word_root_stats["issues"][:10]  # First 10 issues
        },
        "ayahRoot": {
            "records": ayah_root_stats["count"],
            "issues": ayah_root_stats["issues"][:10]
        },
        "sampleRecords": {
            "wordRoot": word_root_records[:5],
            "ayahRoot": ayah_root_records[:5]
        }
    }
    
    # Save report
    with open("morphology-validation-report.json", "w", encoding="utf-8") as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    
    print("\n=== VALIDATION COMPLETE ===")
    print(f"Total records: {report['totalRecords']}")
    print(f"Word-root records: {word_root_stats['count']}")
    print(f"Ayah-root records: {ayah_root_stats['count']}")
    print(f"\nReport saved to morphology-validation-report.json")

if __name__ == "__main__":
    main()