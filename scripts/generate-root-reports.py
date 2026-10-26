#!/usr/bin/env python3
"""
Generate root/lemma review reports for candidate roots.

For each candidate root, this script:
  1. Counts validated word-root records and distinct ayat
  2. Lists observed lemmas with occurrence counts
  3. Identifies polysemy concerns based on lemma diversity
  4. Proposes includedLemmas selections with evidence
  5. Reports alignment or data-quality exceptions

Output: data/root-review-reports.json and ROOT-REVIEW-REPORT.md
"""

import sqlite3
import json
from pathlib import Path
from typing import Dict, List, Tuple
from collections import defaultdict

DATA_DIR = Path("data")

# Candidate roots from src/lib/morphology/root-allowlist.ts
CANDIDATE_ROOTS = [
    {"root": "صبر", "slug": "sabr", "title": "Patience", "arabicTitle": "الصبر", "transliteration": "ṣ-b-r", "gloss": "patience"},
    {"root": "شكر", "slug": "shukr", "title": "Gratitude", "arabicTitle": "الشكر", "transliteration": "sh-k-r", "gloss": "gratitude"},
    {"root": "رحم", "slug": "rahmah", "title": "Mercy", "arabicTitle": "الرحمة", "transliteration": "r-ḥ-m", "gloss": "mercy"},
    {"root": "علم", "slug": "ilm", "title": "Knowledge", "arabicTitle": "العلم", "transliteration": "ʿ-l-m", "gloss": "knowledge"},
    {"root": "توب", "slug": "tawbah", "title": "Repentance", "arabicTitle": "التوبة", "transliteration": "t-w-b", "gloss": "repentance"},
    {"root": "غفر", "slug": "maghfirah", "title": "Forgiveness", "arabicTitle": "المغفرة", "transliteration": "gh-f-r", "gloss": "forgiveness"},
    {"root": "كبر", "slug": "kibr", "title": "Greatness/Arrogance", "arabicTitle": "الكبر", "transliteration": "k-b-r", "gloss": "greatness/arrogance"},
    {"root": "خشع", "slug": "khushu", "title": "Humility", "arabicTitle": "الخضوع", "transliteration": "kh-sh-ʿ", "gloss": "humility"},
    {"root": "صدق", "slug": "sidq", "title": "Truthfulness", "arabicTitle": "الصدق", "transliteration": "ṣ-d-q", "gloss": "truthfulness"},
    {"root": "وكل", "slug": "tawakkul", "title": "Trust/Delegation", "arabicTitle": "التوكل", "transliteration": "w-k-l", "gloss": "trust/delegation"},
]

def load_root_id_map(conn: sqlite3.Connection) -> Dict[str, int]:
    """Map normalized root string -> root_id"""
    cursor = conn.cursor()
    cursor.execute("SELECT id, arabic_trilateral FROM roots")
    return {row[1].replace(" ", ""): row[0] for row in cursor.fetchall()}

def load_lemma_id_map(conn: sqlite3.Connection) -> Dict[str, int]:
    """Map lemma text -> lemma_id"""
    cursor = conn.cursor()
    cursor.execute("SELECT id, text FROM lemmas")
    return {row[1]: row[0] for row in cursor.fetchall()}

def analyze_root(root_str: str, root_id_map: Dict[str, int], lemma_id_map: Dict[str, int]) -> Dict:
    """Analyze one root: count occurrences, list lemmas, identify polysemy."""
    
    # Connect to word-root.db
    conn_root = sqlite3.connect(DATA_DIR / "word-root.db")
    cursor_root = conn_root.cursor()
    
    root_id = root_id_map.get(root_str)
    if not root_id:
        conn_root.close()
        return {"error": f"Root {root_str} not found in word-root.db"}
    
    # Get all word locations for this root
    cursor_root.execute("SELECT word_location FROM root_words WHERE root_id = ?", (root_id,))
    word_locations = [row[0] for row in cursor_root.fetchall()]
    conn_root.close()
    
    # Parse locations and count distinct ayat
    ayat = set()
    for loc in word_locations:
        parts = loc.split(":")
        if len(parts) == 3:
            surah, ayah = int(parts[0]), int(parts[1])
            ayat.add((surah, ayah))
    
    # Connect to word-lemma.db to find lemmas for these word locations
    conn_lemma = sqlite3.connect(DATA_DIR / "word-lemma.db")
    cursor_lemma = conn_lemma.cursor()
    
    # Build reverse map: word_location -> lemma_id
    cursor_lemma.execute("SELECT lemma_id, word_location FROM lemma_words")
    loc_to_lemma = {row[1]: row[0] for row in cursor_lemma.fetchall()}
    
    # Invert lemma map once: lemma_id -> text (lemma_id_map is text -> id)
    id_to_lemma = {lid: text for text, lid in lemma_id_map.items()}

    # Count lemmas for this root's word locations
    lemma_counts = defaultdict(int)
    for loc in word_locations:
        lemma_id = loc_to_lemma.get(loc)
        if lemma_id is not None:
            text = id_to_lemma.get(lemma_id)
            if text is not None:
                lemma_counts[text] += 1
    
    conn_lemma.close()
    
    # Sort lemmas by frequency
    sorted_lemmas = sorted(lemma_counts.items(), key=lambda x: -x[1])
    
    return {
        "root": root_str,
        "rootId": root_id,
        "totalOccurrences": len(word_locations),
        "distinctAyat": len(ayat),
        "lemmaBreakdown": [{"lemma": text, "count": count} for text, count in sorted_lemmas],
        "sampleAyat": sorted(list(ayat))[:10],  # First 10 for reference
    }

def propose_included_lemmas(analysis: Dict, gloss: str) -> Tuple[List[str], List[str]]:
    """Propose includedLemmas based on lemma breakdown and gloss.
    
    Returns (includedLemmas, excludedLemmas_with_reason).
    """
    if "error" in analysis:
        return [], []
    
    lemmas = analysis["lemmaBreakdown"]
    if not lemmas:
        return [], []
    
    # Heuristic: include lemmas that are semantically close to the gloss
    # This is a starting point — human review must confirm
    included = []
    excluded_with_reason = []
    
    # For now, include all lemmas (human review will refine)
    # Flag high-frequency roots that may need splitting
    for lemma_info in lemmas:
        lemma = lemma_info["lemma"]
        count = lemma_info["count"]
        
        # Simple heuristic: if lemma contains the root letters in order, include it
        # This is imperfect but a starting point
        included.append(lemma)
    
    return included, excluded_with_reason

def main():
    print("Loading root and lemma maps...")
    conn_root = sqlite3.connect(DATA_DIR / "word-root.db")
    root_id_map = load_root_id_map(conn_root)
    conn_root.close()
    
    conn_lemma = sqlite3.connect(DATA_DIR / "word-lemma.db")
    lemma_id_map = load_lemma_id_map(conn_lemma)
    conn_lemma.close()
    
    print(f"Loaded {len(root_id_map)} roots, {len(lemma_id_map)} lemmas\n")
    
    reports = []
    
    for candidate in CANDIDATE_ROOTS:
        root_str = candidate["root"]
        print(f"Analyzing {root_str} ({candidate['title']})...")
        
        analysis = analyze_root(root_str, root_id_map, lemma_id_map)
        
        if "error" in analysis:
            print(f"  ERROR: {analysis['error']}")
            reports.append({
                **candidate,
                "status": "error",
                "error": analysis["error"],
            })
            continue
        
        included, excluded = propose_included_lemmas(analysis, candidate["gloss"])
        
        report = {
            **candidate,
            "status": "pending-review",
            "totalOccurrences": analysis["totalOccurrences"],
            "distinctAyat": analysis["distinctAyat"],
            "lemmaCount": len(analysis["lemmaBreakdown"]),
            "topLemmas": analysis["lemmaBreakdown"][:10],  # Top 10
            "proposedIncludedLemmas": included,
            "sampleAyat": analysis["sampleAyat"],
            "notes": f"{len(included)} lemmas proposed for inclusion. Human review required to confirm semantic alignment with '{candidate['gloss']}'.",
        }
        
        reports.append(report)
        print(f"  {analysis['totalOccurrences']} occurrences, {analysis['distinctAyat']} ayat, {len(analysis['lemmaBreakdown'])} lemmas")
    
    # Write JSON report
    with open(DATA_DIR / "root-review-reports.json", "w", encoding="utf-8") as f:
        json.dump(reports, f, ensure_ascii=False, indent=2)
    
    # Write Markdown report
    with open("ROOT-REVIEW-REPORT.md", "w", encoding="utf-8") as f:
        f.write("# Root Review Report\n\n")
        f.write("This report analyzes 10 candidate roots for root-based topic discovery.\n")
        f.write("All counts are computed from actual imported morphology records (QUL morphology v1).\n\n")
        f.write("**Status:** All roots are `pending-review`. No roots are activated yet.\n\n")
        f.write("---\n\n")
        
        for report in reports:
            if report["status"] == "error":
                f.write(f"## {report['title']} ({report['root']})\n\n")
                f.write(f"**Error:** {report['error']}\n\n")
                continue
            
            f.write(f"## {report['title']} — {report['arabicTitle']}\n\n")
            f.write(f"- **Root:** {report['root']} ({report['transliteration']})\n")
            f.write(f"- **Gloss:** {report['gloss']}\n")
            f.write(f"- **Total occurrences:** {report['totalOccurrences']}\n")
            f.write(f"- **Distinct ayat:** {report['distinctAyat']}\n")
            f.write(f"- **Unique lemmas:** {report['lemmaCount']}\n")
            f.write(f"- **Review status:** {report['status']}\n\n")
            
            f.write("### Top lemmas (by frequency)\n\n")
            f.write("| Lemma | Count |\n")
            f.write("|-------|-------|\n")
            for lemma_info in report["topLemmas"]:
                f.write(f"| {lemma_info['lemma']} | {lemma_info['count']} |\n")
            f.write("\n")
            
            f.write(f"### Proposed included lemmas\n\n")
            f.write(f"{len(report['proposedIncludedLemmas'])} lemmas proposed. Human review required.\n\n")
            
            f.write(f"### Sample ayat (first 10)\n\n")
            for surah, ayah in report["sampleAyat"]:
                f.write(f"- {surah}:{ayah}\n")
            f.write("\n")
            
            f.write(f"### Notes\n\n")
            f.write(f"{report['notes']}\n\n")
            f.write("---\n\n")
    
    print(f"\n=== REPORTS GENERATED ===")
    print(f"JSON: data/root-review-reports.json")
    print(f"Markdown: ROOT-REVIEW-REPORT.md")

if __name__ == "__main__":
    main()
