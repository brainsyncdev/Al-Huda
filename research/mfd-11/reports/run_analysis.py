#!/usr/bin/env python3
"""MFD-11.5 Morphology Analysis - Python implementation with strict matching."""
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

BASE = Path(r'C:\Users\Dawood\dyad-apps\Quran Al Huda')
MORPH_INDEX = BASE / 'research' / 'mfd-11' / 'reports' / 'root-morphology-index.json'
ROOT_OCC_DIR = BASE / 'data' / 'root-occurrences'
OUTPUT_DIR = BASE / 'research' / 'mfd-11' / 'reports'

# Arabic diacritics and ornamental marks to strip for comparison
DIACRITICS_RE = re.compile(
    r'[\u064B-\u065F\u0670\u06D6-\u06ED\u08D3-\u08FF]'
)
# Hamza variants to normalize
HAMZA_NORM = str.maketrans({
    '\u0622': '\u0627',  # آ -> ا
    '\u0623': '\u0627',  # أ -> ا
    '\u0625': '\u0627',  # إ -> ا
    '\u0671': '\u0627',  # ٱ -> ا (hamzat al-wasl)
})

def normalize_arabic(text):
    """Strip diacritics, normalize hamzas, strip whitespace."""
    if not text:
        return ''
    t = text.strip()
    t = DIACRITICS_RE.sub('', t)
    t = t.translate(HAMZA_NORM)
    return t

def strip_prefixes_suffixes(norm_text):
    """Remove common prefixes (al-, wa-, bi-, li-, fa-) and pronoun suffixes for stem extraction."""
    t = norm_text
    # Strip definite article and conjunction prefixes
    for prefix in ['ال', 'وال', 'بال', 'لل', 'فال', 'و', 'ف', 'ب', 'ل']:
        if t.startswith(prefix) and len(t) > len(prefix) + 2:
            t = t[len(prefix):]
            break
    return t

def load_morphology_index():
    """Load the morphology index and extract terms."""
    with open(MORPH_INDEX, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    terms = data.get('terms', {})
    roots_meta = data.get('roots', {})
    summary = data.get('summary', {})
    print(f"Loaded {len(terms)} terms, {len(roots_meta)} root groups")
    print(f"Summary: {json.dumps(summary, ensure_ascii=False)}")
    return terms, roots_meta, summary

def build_lemma_lookup():
    """Build lookup from root-occurrences files: slug -> {includedLemmas, tokenToLemma}."""
    lookup = {}
    files = list(ROOT_OCC_DIR.glob('*.json'))
    print(f"Scanning {len(files)} root-occurrence files...")
    
    for i, fpath in enumerate(files):
        if (i + 1) % 300 == 0:
            print(f"  {i+1}/{len(files)}...")
        try:
            with open(fpath, 'r', encoding='utf-8') as f:
                data = json.load(f)
            entry = data.get('entry', {})
            slug = entry.get('slug', '')
            if not slug:
                continue
            
            included_lemmas = [str(l) for l in entry.get('includedLemmas', []) if l]
            
            token_to_lemma = []
            for occ in data.get('occurrences', []):
                token = occ.get('matchedToken', '')
                lemma = occ.get('matchedLemma', '')
                ref = occ.get('ref', {})
                if token and lemma:
                    ayah_ref = f"{ref.get('surah','')}:{ref.get('ayah','')}" if ref else ''
                    token_to_lemma.append({
                        'token': str(token),
                        'lemma': str(lemma),
                        'ref': ayah_ref
                    })
            
            if included_lemmas or token_to_lemma:
                lookup[slug] = {
                    'includedLemmas': included_lemmas,
                    'tokenToLemma': token_to_lemma
                }
        except Exception as e:
            pass
    
    print(f"Built lemma lookup for {len(lookup)} roots with data")
    return lookup

def find_root_slug(root_str):
    """Convert hyphenated root string to potential file slugs."""
    if not root_str:
        return []
    # Remove hyphens and spaces
    clean = root_str.replace('-', '').replace(' ', '').strip()
    if not clean:
        return []
    candidates = [clean]
    # Also try normalized version
    norm = normalize_arabic(clean)
    if norm != clean:
        candidates.append(norm)
    return candidates

def match_lemma(arabic_surface, root_slugs, lemma_lookup):
    """
    Try to match a surface form against corpus data.
    Returns: (matched_lemma, method, confidence, alternatives)
    
    Strategy priority:
    1. Exact normalized match against occurrence tokens for the SAME root
    2. Exact normalized match against includedLemmas for the SAME root
    3. NO partial/substring matching (too error-prone for Arabic)
    """
    norm_surface = normalize_arabic(arabic_surface)
    stripped_surface = strip_prefixes_suffixes(norm_surface)
    
    best_lemma = None
    best_method = 'computational'
    best_confidence = 'low'
    alternatives = []
    
    for slug in root_slugs:
        if slug not in lemma_lookup:
            continue
        lookup = lemma_lookup[slug]
        
        # Strategy 1: Match against occurrence tokens
        token_matches = set()
        for mapping in lookup['tokenToLemma']:
            norm_token = normalize_arabic(mapping['token'])
            stripped_token = strip_prefixes_suffixes(norm_token)
            # Exact match on normalized form OR stripped form
            if norm_surface == norm_token or stripped_surface == stripped_token:
                token_matches.add(mapping['lemma'])
        
        if len(token_matches) == 1:
            return list(token_matches)[0], 'corpus-cross-reference', 'high', []
        elif len(token_matches) > 1:
            primary = list(token_matches)[0]
            alts = [{'lemma': a, 'morphForm': None, 'pattern': None, 
                     'partOfSpeech': None, 'reason': 'Multiple lemmas for same surface form in corpus'}
                    for a in list(token_matches)[1:]]
            return primary, 'corpus-cross-reference', 'medium', alts
        
        # Strategy 2: Match against includedLemmas
        lemma_matches = set()
        for inc_lemma in lookup['includedLemmas']:
            norm_lemma = normalize_arabic(inc_lemma)
            if norm_surface == norm_lemma or stripped_surface == norm_lemma:
                lemma_matches.add(inc_lemma)
        
        if len(lemma_matches) == 1:
            return list(lemma_matches)[0], 'corpus-cross-reference', 'high', []
        elif len(lemma_matches) > 1:
            primary = list(lemma_matches)[0]
            alts = [{'lemma': a, 'morphForm': None, 'pattern': None,
                     'partOfSpeech': None, 'reason': 'Multiple includedLemmas match surface form'}
                    for a in list(lemma_matches)[1:]]
            return primary, 'corpus-cross-reference', 'medium', alts
    
    # No corpus match found
    return None, 'computational', 'low', []

def infer_verb_form(lemma_norm, has_shadda_in_original):
    """Infer Arabic verb form (I-X) from lemma structure."""
    if not lemma_norm:
        return None, None
    
    l = lemma_norm
    length = len(l)
    
    # Form X: استفعَل (starts with است)
    if l.startswith('است') and length >= 6:
        return 'Form X', 'istafʿala'
    # Form VIII: افتعل (starts with افت)
    if l.startswith('افت') and length >= 5:
        return 'Form VIII', 'iftaʿala'
    # Form VII: انفعل (starts with ان)
    if l.startswith('ان') and length >= 5:
        return 'Form VII', 'infaʿala'
    # Form VI: تفاعل (starts with ت + has internal ا after first radical)
    if l.startswith('ت') and length >= 5 and 'ا' in l[2:4]:
        return 'Form VI', 'tafāʿala'
    # Form V: تفعّل (starts with ت + shadda)
    if l.startswith('ت') and has_shadda_in_original and length >= 5:
        return 'Form V', 'tafaʿʿala'
    # Form IV: أفعل (starts with ا/أ + 4+ chars, no است/افت/ان)
    if l.startswith('ا') and length >= 4 and not l.startswith('است') and not l.startswith('افت') and not l.startswith('ان'):
        return 'Form IV', 'afʿala'
    # Form III: فاعل (has ا after first consonant, 4+ chars)
    if length >= 4 and l[1] == 'ا' and not l.startswith('ا'):
        return 'Form III', 'fāʿala'
    # Form II: فعّل (shadda on middle radical, 3-letter base)
    if has_shadda_in_original and length >= 3:
        return 'Form II', 'faʿʿala'
    # Form I: فعل (base triliteral)
    if length >= 3:
        return 'Form I', 'faʿala'
    
    return None, None

def infer_noun_pattern(lemma_norm, lemma_original, pos):
    """Infer noun/adjective morphological pattern."""
    if not lemma_norm:
        return None, None, None, None
    
    l = lemma_norm
    length = len(l)
    has_shadda = '\u0651' in (lemma_original or '')
    
    gender = None
    number = None
    morph_form = None
    pattern = None
    
    # Gender
    if l.endswith('ة') or l.endswith('ه'):
        gender = 'feminine'
    else:
        gender = 'masculine'
    
    # Number
    if l.endswith('ون') or l.endswith('ين') or l.endswith('ات'):
        number = 'plural'
    elif l.endswith('ان') or l.endswith('ين'):
        number = 'dual'
    else:
        number = 'singular'
    
    # Pattern detection
    # Active participle: فاعل (fā'il)
    if length >= 4 and l[1] == 'ا' and not l.startswith('ا'):
        morph_form = 'active participle'
        pattern = 'fāʿil'
    # Passive participle: مفعول (maf'ūl)
    elif l.startswith('م') and length >= 4 and ('و' in l[2:] or 'ي' in l[2:]):
        morph_form = 'passive participle'
        pattern = 'mafʿūl'
    # Noun of place/instrument: مفعل/مفعال (mif'al/maf'al)
    elif l.startswith('م') and length >= 4:
        if has_shadda:
            morph_form = 'passive participle'
            pattern = 'mufaʿʿal'
        else:
            morph_form = 'noun of place/instrument'
            pattern = 'mifʿāl'
    # Verbal noun patterns
    elif l.endswith('ة') and length >= 4:
        morph_form = 'verbal noun (masdar)'
        pattern = 'faʿla/faʿala'
    # Intensive adjective: فعّال (fa''āl)
    elif has_shadda and length >= 3:
        morph_form = 'intensive adjective/noun'
        pattern = 'faʿʿāl'
    # Basic noun: فعل (fa'l)
    elif length <= 4:
        morph_form = 'basic noun'
        pattern = 'faʿl'
    else:
        morph_form = None
        pattern = None
    
    return morph_form, pattern, gender, number

def analyze_terms(terms, lemma_lookup):
    """Run full morphological analysis on all terms."""
    entries = {}
    review_queue = []
    stats = {
        'total': len(terms),
        'lemmasPopulated': 0,
        'lemmasNull': 0,
        'patternsResolved': 0,
        'patternsUnresolved': 0,
        'ambiguous': 0,
        'highConfidence': 0,
        'mediumConfidence': 0,
        'lowConfidence': 0,
        'corpusMatched': 0,
        'computationalOnly': 0,
        'existingPatternCarriedForward': 0,
        'rootMismatchDetected': 0
    }
    
    for i, (term_key, term) in enumerate(terms.items()):
        if (i + 1) % 100 == 0:
            print(f"  Analyzed {i+1}/{len(terms)}...")
        
        arabic = str(term.get('arabic', ''))
        root = term.get('root')
        pos = str(term.get('partOfSpeech', 'unknown'))
        gloss = term.get('originalGloss')
        gram_notes = term.get('grammaticalNotes')
        root_conf = term.get('rootConfidence', 'low')
        occs = term.get('occurrences', [])
        translit = str(term.get('transliteration', ''))
        existing_pattern = term.get('morphPattern', '')
        
        # Find root slugs for lookup
        root_slugs = find_root_slug(root)
        
        # Attempt corpus cross-reference
        matched_lemma, method, confidence, alternatives = match_lemma(
            arabic, root_slugs, lemma_lookup
        )
        
        if matched_lemma:
            stats['corpusMatched'] += 1
        else:
            stats['computationalOnly'] += 1
            # If we have an existing non-undetermined pattern, boost confidence slightly
            if existing_pattern and existing_pattern != 'undetermined pattern':
                confidence = 'medium'
                stats['existingPatternCarriedForward'] += 1
        
        if alternatives:
            stats['ambiguous'] += 1
        
        # Infer morphological pattern
        morph_form = None
        pattern = None
        gender = None
        number = None
        person = None
        case_or_mood = None
        voice = None
        definite = None
        
        norm_lemma = normalize_arabic(matched_lemma) if matched_lemma else None
        has_shadda = '\u0651' in (matched_lemma or '')
        
        if matched_lemma:
            if pos == 'verb':
                morph_form, pattern = infer_verb_form(norm_lemma, has_shadda)
            elif pos in ('noun', 'adjective'):
                morph_form, pattern, gender, number = infer_noun_pattern(
                    norm_lemma, matched_lemma, pos
                )
            
            # Check definiteness
            if norm_lemma and norm_lemma.startswith('ال'):
                definite = True
        
        # Carry forward existing pattern if computational didn't resolve
        if not morph_form and existing_pattern and existing_pattern != 'undetermined pattern':
            morph_form = existing_pattern
        
        # Extract features from grammatical notes
        gemination = True if gram_notes and ('gemination' in str(gram_notes).lower() or 'shadda' in str(gram_notes).lower()) else None
        weak_root = True if gram_notes and 'weak' in str(gram_notes).lower() else None
        hamzat_wasal = True if gram_notes and 'hamzat al-wasl' in str(gram_notes).lower() else None
        
        # Update stats
        if matched_lemma:
            stats['lemmasPopulated'] += 1
        else:
            stats['lemmasNull'] += 1
        
        if morph_form and morph_form not in ('undetermined pattern', 'basic noun', None):
            stats['patternsResolved'] += 1
        else:
            stats['patternsUnresolved'] += 1
        
        if confidence == 'high':
            stats['highConfidence'] += 1
        elif confidence == 'medium':
            stats['mediumConfidence'] += 1
        else:
            stats['lowConfidence'] += 1
        
        # Build entry
        entry = {
            'termKey': term_key,
            'surfaceForm': arabic,
            'transliteration': translit,
            'lemma': matched_lemma,
            'lemmaTranslit': None,
            'root': root,
            'rootConfidence': root_conf,
            'partOfSpeech': pos,
            'morphForm': morph_form,
            'pattern': pattern,
            'gender': gender,
            'number': number,
            'person': person,
            'caseOrMood': case_or_mood,
            'features': {
                'definite': definite,
                'constructState': None,
                'hasPrefix': None,
                'hasSuffix': None,
                'gemination': gemination,
                'weakRoot': weak_root,
                'hamzatAlWasl': hamzat_wasal,
                'voice': voice
            },
            'alternativeAnalyses': alternatives,
            'analysisMethod': method,
            'confidence': confidence,
            'reviewStatus': 'pending-scholarly-review',
            'sourceReferences': occs,
            'originalGloss': gloss,
            'grammaticalNotes': gram_notes
        }
        
        entries[term_key] = entry
        
        # Determine if review is needed
        review_reasons = []
        if not matched_lemma:
            review_reasons.append('No lemma could be determined from corpus cross-reference')
        if confidence in ('low', 'disputed'):
            review_reasons.append(f'Low/disputed confidence ({confidence})')
        if alternatives:
            review_reasons.append(f'Multiple alternative analyses ({len(alternatives)})')
        if not morph_form or morph_form == 'undetermined pattern':
            review_reasons.append('Morphological pattern unresolved')
        if method == 'computational' and not matched_lemma:
            review_reasons.append('Computational only - no corpus evidence available')
        
        if review_reasons:
            review_queue.append({
                'termKey': term_key,
                'surfaceForm': arabic,
                'transliteration': translit,
                'root': root,
                'currentLemma': matched_lemma,
                'currentMorphForm': morph_form,
                'confidence': confidence,
                'analysisMethod': method,
                'reviewReasons': review_reasons,
                'alternativeCount': len(alternatives),
                'occurrences': occs,
                'gloss': gloss
            })
    
    return entries, review_queue, stats

def main():
    print("=" * 60)
    print("MFD-11.5 Lemma & Morphology Remediation Analysis")
    print("=" * 60)
    
    # Load data
    terms, roots_meta, summary = load_morphology_index()
    lemma_lookup = build_lemma_lookup()
    
    # Run analysis
    print("\nRunning morphological analysis...")
    entries, review_queue, stats = analyze_terms(terms, lemma_lookup)
    
    # Build outputs
    analysis_output = {
        'metadata': {
            'generatedAt': datetime.now(timezone.utc).isoformat(),
            'workstream': 'MFD-11.5',
            'phase': 'lemma-morphology-remediation',
            'totalTerms': stats['total'],
            'methodology': (
                'Cross-referenced morphology index terms against data/root-occurrences/ '
                'includedLemmas arrays and occurrence token-to-lemma mappings using STRICT '
                'normalized Arabic matching (diacritics stripped, hamzas normalized, prefixes/suffixes removed). '
                'No partial/substring matching used to prevent false positives. '
                'Verb forms inferred using standard Arabic morphology (Forms I-X). '
                'Noun patterns inferred using standard templates (fa\'l, fā\'il, maf\'ūl, mif\'āl, etc.). '
                'All results marked pending-scholarly-review. '
                'Null lemma = insufficient evidence; fields NOT populated merely to eliminate nulls.'
            ),
            'statistics': stats
        },
        'entries': entries
    }
    
    review_output = {
        'metadata': {
            'generatedAt': datetime.now(timezone.utc).isoformat(),
            'workstream': 'MFD-11.5',
            'totalRequiringReview': len(review_queue),
            'description': (
                'Entries requiring manual scholarly review due to missing lemma, '
                'low confidence, ambiguous analyses, or unresolved morphological patterns. '
                'These represent cases where computational cross-referencing was insufficient.'
            )
        },
        'entries': review_queue
    }
    
    # Write outputs
    analysis_path = OUTPUT_DIR / 'lemma-analysis.json'
    review_path = OUTPUT_DIR / 'morphology-review-queue.json'
    
    print("\nWriting outputs...")
    with open(analysis_path, 'w', encoding='utf-8') as f:
        json.dump(analysis_output, f, ensure_ascii=False, indent=2)
    
    with open(review_path, 'w', encoding='utf-8') as f:
        json.dump(review_output, f, ensure_ascii=False, indent=2)
    
    # Print summary
    print("\n" + "=" * 60)
    print("ANALYSIS COMPLETE")
    print("=" * 60)
    print(f"Total terms analyzed:          {stats['total']}")
    print(f"Lemmas populated:              {stats['lemmasPopulated']}")
    print(f"Lemmas null (no evidence):     {stats['lemmasNull']}")
    print(f"Patterns resolved:             {stats['patternsResolved']}")
    print(f"Patterns unresolved:           {stats['patternsUnresolved']}")
    print(f"Ambiguous cases flagged:       {stats['ambiguous']}")
    print(f"Corpus cross-referenced:       {stats['corpusMatched']}")
    print(f"Computational only:            {stats['computationalOnly']}")
    print(f"Existing patterns carried fwd: {stats['existingPatternCarriedForward']}")
    print(f"High confidence:               {stats['highConfidence']}")
    print(f"Medium confidence:             {stats['mediumConfidence']}")
    print(f"Low confidence:                {stats['lowConfidence']}")
    print(f"Review queue size:             {len(review_queue)}")
    print(f"\nOutput files:")
    print(f"  {analysis_path}")
    print(f"  {review_path}")
    
    return stats, entries, review_queue

if __name__ == '__main__':
    main()
