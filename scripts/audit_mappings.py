#!/usr/bin/env python3
"""
MFD-09 Ayah Mapping Audit Script
Comprehensive audit of all 789 mappings
"""

import json
import os
from collections import defaultdict
from datetime import datetime

def load_json(filepath):
    """Load JSON file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    """Save JSON file"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def save_text(filepath, content):
    """Save text file"""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print("=" * 60)
    print("MFD-09 AYA MAPPING AUDIT")
    print("=" * 60)
    
    # Load data
    print("\n[1/6] Loading data files...")
    mappings = load_json('data/taxonomy/topic-ayah-mappings.json')
    quran = load_json('node_modules/quran-json/dist/quran.json')
    topics = load_json('data/taxonomy/topics.json')
    
    print(f"  Loaded {len(mappings)} mappings")
    print(f"  Loaded {len(quran)} surahs")
    print(f"  Loaded {len(topics)} topics")
    
    # Build lookups
    print("\n[2/6] Building lookup tables...")
    surah_lookup = {}
    for surah in quran:
        surah_lookup[surah['id']] = {
            'name': surah['name'],
            'total_verses': surah['total_verses'],
            'verses': surah['verses']
        }
    
    topic_lookup = {topic['id']: topic for topic in topics}
    
    # Audit tracking
    print("\n[3/6] Auditing each mapping...")
    audit_results = []
    issues = {
        'invalid_surah': [],
        'invalid_ayah': [],
        'duplicates': [],
        'missing_topics': [],
        'weak_rationale': [],
        'generic_rationale': []
    }
    
    # Track expanded ayat
    expanded_ayat_set = set()
    total_expanded_ayat = 0
    
    # Track duplicates by (topicId, surah, ayahStart, ayahEnd)
    seen_mappings = {}
    
    # Track overlaps by (surah, ayah)
    ayah_to_topics = defaultdict(set)
    
    for idx, mapping in enumerate(mappings):
        if (idx + 1) % 100 == 0:
            print(f"  Processed {idx + 1} / {len(mappings)}...")
        
        mapping_id = mapping['id']
        topic_id = mapping['topicId']
        surah_num = mapping['surahNumber']
        ayah_start = mapping['ayahStart']
        ayah_end = mapping['ayahEnd']
        mapping_type = mapping['mappingType']
        rationale = mapping.get('rationale', '')
        source_ids = mapping.get('sourceIds', [])
        provenance = mapping.get('provenance', 'pending-scholarly-review')
        status = mapping.get('status', 'MAPPED')
        
        # Initialize audit record
        audit_record = {
            'mappingId': mapping_id,
            'topicId': topic_id,
            'surahNumber': surah_num,
            'ayahStart': ayah_start,
            'ayahEnd': ayah_end,
            'originalMappingType': mapping_type,
            'recommendedMappingType': mapping_type,
            'auditVerdict': 'ACCEPT_AS_DIRECT',
            'contextualRelevance': '',
            'arabicSemanticRelevance': '',
            'evidenceSourceIds': source_ids,
            'rationale': '',
            'limitations': [],
            'provenance': provenance,
            'reviewStatus': 'pending',
            'reviewRequired': False,
            'reviewNotes': '',
            'issues': []
        }
        
        # 1. Validate surah number
        if surah_num not in surah_lookup:
            audit_record['issues'].append('INVALID_SURAH')
            audit_record['auditVerdict'] = 'REJECT_MAPPING'
            audit_record['rationale'] = f'Surah number {surah_num} does not exist in Quran'
            issues['invalid_surah'].append(mapping_id)
        else:
            surah_info = surah_lookup[surah_num]
            total_verses = surah_info['total_verses']
            
            # 2. Validate ayah range
            if ayah_start < 1 or ayah_start > total_verses:
                audit_record['issues'].append('INVALID_AYAH_START')
                audit_record['auditVerdict'] = 'REJECT_MAPPING'
                audit_record['rationale'] = f'Ayah start {ayah_start} out of range for Surah {surah_num} (1-{total_verses})'
                issues['invalid_ayah'].append(mapping_id)
            
            if ayah_end < ayah_start or ayah_end > total_verses:
                audit_record['issues'].append('INVALID_AYAH_END')
                audit_record['auditVerdict'] = 'REJECT_MAPPING'
                audit_record['rationale'] = f'Ayah end {ayah_end} out of range for Surah {surah_num} (1-{total_verses})'
                issues['invalid_ayah'].append(mapping_id)
            
            # 3. Count expanded ayat
            for a in range(ayah_start, ayah_end + 1):
                key = f"{surah_num}:{a}"
                expanded_ayat_set.add(key)
                total_expanded_ayat += 1
            
            # 4. Track overlaps (same ayah mapped to multiple topics)
            for a in range(ayah_start, ayah_end + 1):
                ayah_key = f"{surah_num}:{a}"
                ayah_to_topics[ayah_key].add(topic_id)
        
        # 5. Check for duplicate mappings (exact same topic+surah+ayah range)
        dup_key = f"{topic_id}|{surah_num}|{ayah_start}|{ayah_end}"
        if dup_key in seen_mappings:
            audit_record['issues'].append('DUPLICATE_MAPPING')
            audit_record['auditVerdict'] = 'REJECT_MAPPING'
            audit_record['rationale'] = f'Duplicate of mapping {seen_mappings[dup_key]}'
            issues['duplicates'].append(mapping_id)
        else:
            seen_mappings[dup_key] = mapping_id
        
        # 6. Validate topic exists
        if topic_id not in topic_lookup:
            audit_record['issues'].append('MISSING_TOPIC')
            audit_record['auditVerdict'] = 'REJECT_MAPPING'
            audit_record['rationale'] = f'Topic "{topic_id}" not found in topics.json'
            issues['missing_topics'].append(mapping_id)
        
        # 7. Analyze rationale quality
        if not rationale or rationale.strip() == '':
            audit_record['issues'].append('EMPTY_RATIONALE')
            if audit_record['auditVerdict'] == 'ACCEPT_AS_DIRECT':
                audit_record['auditVerdict'] = 'NEEDS_STRONGER_EVIDENCE'
            audit_record['rationale'] = 'No rationale provided'
            issues['weak_rationale'].append(mapping_id)
        else:
            # Check for generic/weak rationales
            generic_patterns = [
                r'^Related to',
                r'^About',
                r'^Mentions',
                r'^Discusses',
                r'^Refers to',
                r'^Pertains to',
                r'^Connected to',
                r'^Deals with',
                r'^Concerns'
            ]
            
            is_generic = False
            for pattern in generic_patterns:
                if rationale.strip().startswith(pattern.replace('^', '')):
                    is_generic = True
                    break
            
            if is_generic:
                audit_record['issues'].append('GENERIC_RATIONALE')
                if audit_record['auditVerdict'] == 'ACCEPT_AS_DIRECT':
                    audit_record['auditVerdict'] = 'NEEDS_STRONGER_EVIDENCE'
                audit_record['rationale'] = f'Generic rationale: "{rationale}"'
                issues['generic_rationale'].append(mapping_id)
            else:
                audit_record['rationale'] = rationale
        
        # 8. Assess mapping type appropriateness
        if mapping_type == 'DIRECT_REFERENCE':
            # Check if rationale suggests thematic rather than direct
            thematic_indicators = ['implies', 'suggests', 'can be understood', 'relates to the concept', 'illustrates', 'example of']
            for indicator in thematic_indicators:
                if indicator in rationale.lower():
                    audit_record['recommendedMappingType'] = 'THEMATIC_REFERENCE'
                    if audit_record['auditVerdict'] == 'ACCEPT_AS_DIRECT':
                        audit_record['auditVerdict'] = 'ACCEPT_AS_THEMATIC'
                    break
        
        # 9. Check provenance
        if provenance == 'pending-scholarly-review':
            audit_record['reviewRequired'] = True
            audit_record['reviewStatus'] = 'pending-scholarly-review'
        
        # 10. Set contextual relevance
        if topic_id in topic_lookup:
            topic = topic_lookup[topic_id]
            audit_record['contextualRelevance'] = f"Maps to topic: {topic['title']} - {topic.get('description', '')}"
        
        audit_results.append(audit_record)
    
    print(f"\nAudit complete. Processed {len(audit_results)} mappings.")
    
    # Find overlapping ayat (mapped to 3+ topics)
    print("\n[4/6] Analyzing overlaps...")
    overlapping_ayat = []
    for ayah_key, topics_set in ayah_to_topics.items():
        if len(topics_set) >= 3:
            overlapping_ayat.append({
                'ayatKey': ayah_key,
                'topicCount': len(topics_set),
                'topics': sorted(list(topics_set))
            })
    
    # Summary statistics
    print("\n[5/6] Generating summary statistics...")
    verdict_counts = defaultdict(int)
    for r in audit_results:
        verdict_counts[r['auditVerdict']] += 1
    
    mapping_type_counts = defaultdict(int)
    for m in mappings:
        mapping_type_counts[m['mappingType']] += 1
    
    # Investigate 3-ayat discrepancy
    print("\n[6/6] Investigating ayat count discrepancy...")
    print(f"  MFD-08 reported: 1,889 expanded ayat")
    print(f"  Actual count: {total_expanded_ayat} expanded ayat")
    print(f"  Unique ayat mapped: {len(expanded_ayat_set)}")
    print(f"  Discrepancy: {1889 - total_expanded_ayat} ayat")
    
    # Output summary
    print("\n" + "=" * 60)
    print("AUDIT SUMMARY")
    print("=" * 60)
    print(f"Total mappings: {len(mappings)}")
    print(f"Total expanded ayat: {total_expanded_ayat}")
    print(f"Unique ayat mapped: {len(expanded_ayat_set)}")
    print()
    print("Verdict distribution:")
    for v in sorted(verdict_counts.keys()):
        print(f"  {v}: {verdict_counts[v]}")
    print()
    print("Mapping type distribution:")
    for t in sorted(mapping_type_counts.keys()):
        print(f"  {t}: {mapping_type_counts[t]}")
    print()
    print("Issues found:")
    print(f"  Invalid surah: {len(issues['invalid_surah'])}")
    print(f"  Invalid ayah: {len(issues['invalid_ayah'])}")
    print(f"  Duplicates: {len(issues['duplicates'])}")
    print(f"  Missing topics: {len(issues['missing_topics'])}")
    print(f"  Weak rationale: {len(issues['weak_rationale'])}")
    print(f"  Generic rationale: {len(issues['generic_rationale'])}")
    print(f"  Overlapping ayat (3+ topics): {len(overlapping_ayat)}")
    
    # Save detailed results
    print("\nSaving audit results...")
    output = {
        'auditDate': datetime.now().strftime('%Y-%m-%d'),
        'totalMappings': len(mappings),
        'totalExpandedAyat': total_expanded_ayat,
        'uniqueAyatMapped': len(expanded_ayat_set),
        'verdictDistribution': dict(verdict_counts),
        'mappingTypeDistribution': dict(mapping_type_counts),
        'issues': issues,
        'overlappingAyat': overlapping_ayat,
        'auditResults': audit_results
    }
    
    save_json('data/audit/mfd-09-ayah-mapping-audit.json', output)
    print("  Saved: data/audit/mfd-09-ayah-mapping-audit.json")
    
    # Save overlapping ayat details
    save_json('data/audit/mfd-09-overlapping-ayat.json', overlapping_ayat)
    print("  Saved: data/audit/mfd-09-overlapping-ayat.json")
    
    # Save issue lists
    issue_report = {
        'invalidSurahMappings': issues['invalid_surah'],
        'invalidAyahMappings': issues['invalid_ayah'],
        'duplicateMappings': issues['duplicates'],
        'missingTopicMappings': issues['missing_topics'],
        'weakRationaleMappings': issues['weak_rationale'],
        'genericRationaleMappings': issues['generic_rationale']
    }
    save_json('data/audit/mfd-09-issues.json', issue_report)
    print("  Saved: data/audit/mfd-09-issues.json")
    
    print("\n" + "=" * 60)
    print("AUDIT COMPLETE")
    print("=" * 60)

if __name__ == '__main__':
    main()
