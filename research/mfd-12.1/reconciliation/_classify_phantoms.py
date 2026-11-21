import json, sys, os
from difflib import SequenceMatcher

# Load data
with open('data/taxonomy/topics.json', encoding='utf-8') as f:
    topics = json.load(f)
with open('data/taxonomy/subdimensions.json', encoding='utf-8') as f:
    subdims = json.load(f)
with open('research/mfd-12.1/reconciliation/_phantom_raw_extract.json', encoding='utf-8') as f:
    raw = json.load(f)

existing_ids = set(t['id'] for t in topics)
existing_titles = {t['id']: t.get('title','') for t in topics}
subdim_ids = set(s['id'] for s in subdims)

phantom_ids = raw['uniquePhantomIds']
all_refs = raw['allReferences']

# Build reference count per phantom
ref_counts = {}
source_entities = {}
for r in all_refs:
    pid = r['phantomId']
    ref_counts[pid] = ref_counts.get(pid, 0) + 1
    if pid not in source_entities:
        source_entities[pid] = []
    source_entities[pid].append({'sourceEntity': r['sourceEntity'], 'sourceField': r['sourceField']})

def find_similar(phantom_id, threshold=0.5):
    matches = []
    p_slug = phantom_id.replace('-', ' ')
    for eid in existing_ids:
        e_slug = eid.replace('-', ' ')
        ratio = SequenceMatcher(None, p_slug, e_slug).ratio()
        if ratio >= threshold:
            matches.append((eid, ratio, existing_titles.get(eid, '')))
    for eid in existing_ids:
        if phantom_id in eid or eid in phantom_id:
            if not any(m[0] == eid for m in matches):
                matches.append((eid, 0.85, existing_titles.get(eid, '')))
    matches.sort(key=lambda x: x[1], reverse=True)
    return matches[:3]

# Known CREATE patterns with justification
CREATE_JUSTIFICATIONS = {
    'asma-ul-husna-names': 'Asma ul Husna sub-topic: the names themselves as a distinct study area',
    'asma-ul-husna-meanings': 'Asma ul Husna sub-topic: semantic analysis of divine names',
    'asma-ul-husna-benefits': 'Asma ul Husna sub-topic: spiritual benefits of invoking names',
    'attributes-of-essence': 'Aqeedah: sifat al-dhat (attributes of essence) - standard theological category',
    'attributes-of-action': 'Aqeedah: sifat al-fi\'l (attributes of action) - standard theological category',
    'attributes-of-beauty': 'Aqeedah: sifat al-jamal - standard theological category',
    'attributes-of-majesty': 'Aqeedah: sifat al-jalal - standard theological category',
    'divine-attributes-categories': 'Aqeedah: classification framework for divine attributes',
    'jibril-gabriel': 'Aqeedah: named archangel in Quran (2:97-98, 66:4)',
    'mikael-michael': 'Aqeedah: named archangel in Quran (2:98)',
    'israfil-raphael': 'Aqeedah: angel of the trumpet in hadith tradition',
    'azrael-angel-of-death': 'Aqeedah: malak al-mawt (32:11)',
    'kiraman-katibin': 'Aqeedah: recording angels (50:17-18, 82:10-12)',
    'jinn-nature': 'Aqeedah: creation and nature of jinn (55:15, 72:1-28)',
    'jinn-types': 'Aqeedah: categories of jinn (ifrit, marid, etc.)',
    'shaytan-whispers': 'Aqeedah: waswasah concept (114:4-6, 7:200)',
    'protection-from-jinn': 'Ruqyah: adhkar and verses for protection from jinn',
    'revelation-process': 'Quran sciences: wahy mechanism and stages',
    'gradual-revelation': 'Quran sciences: tanjeem al-Quran (25:32)',
    'revelation-contexts': 'Quran sciences: circumstances surrounding revelation',
    'first-revelation': 'Seerah/Quran sciences: iqra event (96:1-5)',
    'interpretation-principles': 'Tafsir methodology: usul al-tafsir rules',
    'quran-by-quran': 'Tafsir methodology: tafsir al-Quran bil-Quran',
    'asbab-al-nuzul': 'Quran sciences: occasions of revelation - established discipline',
    'hadith-classification': 'Hadith sciences: sahih/hasan/da\'if categorization',
    'hadith-terminology': 'Hadith sciences: mustalah al-hadith vocabulary',
    'following-sunnah': 'Akhlaq/Fiqh: ittiba\' al-rasul concept',
    'prophetic-example': 'Seerah/Akhlaq: uswah hasanah (33:21)',
    'sunnah-practices': 'Fiqh: sunnan mu\'akkadah and ghayr mu\'akkadah',
    'belief-in-scriptures': 'Aqeedah: iman bil-kutub - pillar of faith',
    'prophetic-miracles': 'Seerah: mu\'jizat of Prophet Muhammad SAW',
    'following-prophets': 'Akhlaq: ittiba\' al-anbiya general principle',
    'prophetic-qualities': 'Seerah: shama\'il nabawiyyah',
    'prophetic-mission': 'Seerah: risalah and bi\'thah',
    'pharaoh-story': 'Qisas al-Anbiya: major Quranic narrative (multiple surahs)',
    'exodus-narrative': 'Qisas al-Anbiya: Bani Israil departure from Egypt',
    'miracles-of-isa': 'Qisas al-Anbiya: Quranic miracles of Isa AS (3:49, 5:110)',
    'final-message': 'Seerah: universality and finality of Islam (33:40)',
    'patience-lessons': 'Tazkiyah: durus min qisas al-sabr',
    'repentance-conditions': 'Tazkiyah: shurut al-tawbah',
    'rise-and-fall-civilizations': 'Quran history: sunan ilahiyyah in rise/fall of nations',
    'moral-lessons-from-prophets': 'Tafsir: ibar min qisas al-anbiya',
    'true-vs-false-dreams': 'Islamic psychology: ru\'ya vs hulm distinction',
    'prophetic-visions': 'Seerah: ru\'ya al-anbiya and true dreams',
    'prayer-times': 'Fiqh ibadah: mawaqeet al-salah (4:103)',
    'duha-prayer': 'Fiqh ibadah: salat al-duha (93:1-3)',
    'tahajjud': 'Fiqh ibadah: night vigil prayer (17:79, 73:1-4)',
    'awwabin-prayer': 'Fiqh ibadah: salat al-awwabin after maghrib',
    'prophetic-duas': 'Adhkar: compiled supplications from Sunnah',
    'dua-times': 'Adhkar: awqat al-ijabah (times of acceptance)',
    'dua-conditions': 'Adhkar: shurut qabul al-dua',
    'fasting-rules': 'Fiqh ibadah: ahkam al-siyam (2:183-187)',
    'hajj-significance': 'Fiqh ibadah: hikmah and fada\'il al-hajj',
    'umrah-procedure': 'Fiqh ibadah: manasik al-umrah',
    'ritual-purity': 'Fiqh ibadah: taharah (purification) - foundational fiqh topic',
    'congregation-virtues': 'Fiqh ibadah: fada\'il al-jama\'ah',
    'eid-prayers': 'Fiqh ibadah: salat al-eidayn',
    'poverty-alleviation': 'Fiqh social: zakat/sadaqah impact on poverty',
    'spiritual-diseases': 'Tazkiyah: amrad al-qalb (diseases of the heart)',
    'heart-softening': 'Tazkiyah: riqqat al-qalb',
    'tazkiyah': 'Tazkiyah: purification of the soul - major Islamic science',
    'nafs-purification': 'Tazkiyah: tazkiyat al-nafs (91:9-10)',
    'kufr-al-ni\'mah': 'Akhlaq: ingratitude for blessings (16:112)',
    'trust-in-allah': 'Tazkiyah: detailed treatment of tawakkul',
    'intention-purification': 'Tazkiyah: ikhlas and niyyah refinement',
    'arrogance': 'Akhlaq: kibr/takabbur (31:18)',
    'hidden-shirk': 'Aqeedah: shirk khafi / riya\' (showing off)',
    'character-building': 'Tarbiyah: bina\' al-shakhsiyyah al-islamiyyah',
    'khalifah-stewardship': 'Aqeedah: vicegerency responsibilities (2:30)',
    'right-to-dignity': 'Maqasid: hifz al-karamah (17:70)',
    'fear-hope-balance': 'Tazkiyah: khawf and raja\' balance',
    'habit-formation': 'Tarbiyah: building consistent Islamic habits',
    'time-as-trust': 'Akhlaq: time as amanah (103:1-3)',
    'naming-ceremony': 'Fiqh family: tasmiyah and aqiqah',
    'newborn-rights': 'Fiqh family: huquq al-mawlud',
    'breastfeeding-rights': 'Fiqh family: rada\'ah (2:233)',
    'child-maintenance': 'Fiqh family: nafaqat al-awlad',
    'fair-treatment': 'Fiqh family: adl between children',
    'fair-treatment-children': 'Fiqh family: adl bayn al-awlad (specific to children)',
    'righteous-offspring': 'Fiqh family: dhurriyyah tayyibah (25:74)',
    'orphan-support': 'Fiqh social: kafalat al-yateem (2:220, 93:9)',
    'child-rights': 'Fiqh family: huquq al-tifl comprehensive',
    'respecting-parents': 'Akhlaq: birr al-walidayn (17:23-24)',
    'relatives-rights': 'Fiqh social: huquq al-arham / silat al-rahim',
    'siblings-relationships': 'Fiqh family: relations among siblings',
    'marriage-proposal': 'Fiqh munakahat: khitbah',
    'compatibility': 'Fiqh munakahat: kafa\'ah in marriage',
    'marriage-readiness': 'Fiqh munakahat: istita\'ah for marriage',
    'nikah-ceremony': 'Fiqh munakahat: marriage ceremony proceedings',
    'marriage-contract': 'Fiqh munakahat: aqd al-nikah conditions and pillars',
    'walima-feast': 'Fiqh munakahat: wedding banquet',
    'marriage-witnesses': 'Fiqh munakahat: shuhud al-nikah',
    'spousal-communication': 'Fiqh munakahat: mu\'asharah bil-ma\'ruf (4:19)',
    'chastity-modesty': 'Akhlaq: iffah and haya\' (24:30-31)',
    'faskh-annulment': 'Fiqh munakahat: faskh al-nikah',
    'iddah-waiting': 'Fiqh munakahat: iddah rulings (2:228, 65:4)',
    'moral-education': 'Tarbiyah: ta\'leem al-akhlaq',
    'religious-teaching': 'Tarbiyah: ta\'leem al-deen for children',
    'discipline-methods': 'Tarbiyah: ta\'deeb methods',
    'role-modeling': 'Tarbiyah: qudwah hasanah',
    'trade-principles': 'Fiqh muamalat: usul al-bay\'',
    'entrepreneurship': 'Fiqh muamalat: business initiation in Islam',
    'partnerships': 'Fiqh muamalat: shirkah/mudarabah/musharakah',
    'commercial-transactions': 'Fiqh muamalat: muamalat maliyyah',
    'market-regulation': 'Fiqh muamalat: hisbah in markets',
    'fair-pricing': 'Fiqh muamalat: tas\'eer',
    'commercial-fraud-prohibition': 'Fiqh muamalat: ghash/tadlis prohibition',
    'honest-dealing': 'Fiqh muamalat: sidq in trade',
    'weights-measures': 'Fiqh muamalat: kayl wa mizan (83:1-3)',
    'honesty-business': 'Akhlaq: sidq in commerce',
    'contract-ethics': 'Fiqh muamalat: akhlaq al-uqud',
    'debt-relief': 'Fiqh muamalat: inzar ila maysarah (2:280)',
    'endowments-waqf': 'Fiqh muamalat: awqaf institutions',
    'charity-virtues': 'Fada\'il: virtues of sadaqah',
    'economic-fairness': 'Maqasid: economic justice principles',
    'islamic-finance': 'Fiqh muamalat: modern Islamic finance instruments',
    'slaughter-rules': 'Fiqh: dhaba\'ih halal rules (5:3, 6:118-121)',
    'dietary-restrictions': 'Fiqh: maharramat food prohibitions',
    'quran-as-source': 'Usul fiqh: Quran as primary dalil',
    'sunnah-as-source': 'Usul fiqh: Sunnah as secondary dalil',
    'ijma-consensus': 'Usul fiqh: ijma\' as source of law',
    'qiyas-analogy': 'Usul fiqh: qiyas reasoning method',
    'legal-maxims': 'Usul fiqh: qawaid fiqhiyyah',
    'fiqh-methodology': 'Fiqh: methodological approaches to jurisprudence',
    'usul-al-fiqh': 'Fiqh: foundational legal methodology discipline',
    'legal-schools': 'Fiqh: madhahib fiqhiyyah overview',
    'ijtihad': 'Fiqh: scholarly reasoning process',
    'judicial-independence': 'Fiqh: qada and judiciary ethics',
    'qisas-retaliation': 'Fiqh jinayat: qisas rulings (2:178-179)',
    'camel-creation': 'Tafakkur: Quranic mention (88:17)',
    'cow-creation': 'Tafakkur: cow narrative (Al-Baqarah)',
    'sheep-creation': 'Tafakkur: livestock in Quran',
    'bird-creation': 'Tafakkur: birds in Quran (67:19)',
    'insect-creation': 'Tafakkur: insects in Quran (spider, bee, ant, fly)',
    'marine-creatures': 'Tafakkur: sea life in Quran (16:14)',
    'animal-welfare': 'Fiqh/Akhlaq: rights of animals in Islam',
    'animal-sacrifice': 'Fiqh ibadah: udhiyah/qurbani (22:36-37)',
    'animal-rights': 'Fiqh: huquq al-hayawan',
    'humane-treatment': 'Akhlaq: ihsan to animals',
    'animal-stories': 'Quran narratives: stories involving animals',
    'community-cohesion': 'Fiqh social: tamasuk al-mujtama\'',
    'social-solidarity': 'Fiqh social: takaful ijtima\'i',
    'racial-equality': 'Maqasid: equality regardless of race (49:13)',
    'tribes-peoples': 'Tafsir: shu\'ub wa qaba\'il (49:13)',
    'justice-for-all': 'Maqasid: universal justice (4:135)',
    'friendship-ethics': 'Akhlaq: adab al-sadaqah',
    'community-welfare': 'Fiqh social: maslahah ammah',
    'information-ethics': 'Contemporary fiqh: media/information ethics (49:6)',
    'consultation-mechanism': 'Fiqh siyasi: shura implementation mechanisms',
    'participatory-governance': 'Fiqh siyasi: democratic participation in Islam',
    'transparency': 'Akhlaq/Fiqh: shafafiyyah in governance',
    'consultation-shura': 'Fiqh siyasi: shura principle (42:38)',
    'ecological-balance': 'Contemporary fiqh: mizan bi\'ee (55:7-9)',
    'earth-stewardship': 'Aqeedah: imarah al-ard',
    'environmental-responsibility': 'Contemporary fiqh: mas\'uliyyah bi\'iyyah',
    'destruction-prohibition': 'Fiqh: nahy an al-fasad (2:205)',
    'tree-protection': 'Fiqh environment: himayah al-ashjar',
    'waste-reduction': 'Akhlaq: avoidance of israf (7:31)',
    'soul-departure': 'Aqeedah: sakarat al-mawt',
    'paradise-levels': 'Aqeedah: darajat al-jannah',
    'eternal-bliss': 'Aqeedah: na\'eem mukim',
    'hell-levels': 'Aqeedah: darakat jahannam',
    'punishment-types': 'Aqeedah: anwa\' al-adhab',
    'end-times-events': 'Aqeedah: ashraat al-sa\'ah events',
    'dajjal-antichrist': 'Aqeedah: fitnat al-masih al-dajjal',
    'return-of-isa': 'Aqeedah: nuzul Isa AS before Day of Judgment',
    'respectful-engagement': 'Akhlaq: adab al-hiwar',
    'common-ground': 'Da\'wah: kalimatun sawa\' (3:64)',
    'quranic-concepts': 'Quran studies: mafahim quraniyyah',
    'key-terms': 'Quran studies: mustalahat quraniyyah',
    'healing-prayers': 'Ruqyah: ad\'iyah al-shifa\'',
    'medicinal-substances': 'Prophetic medicine: mawadd tibbiyyah',
    'stress-relief': 'Contemporary application: Islamic stress management',
    'emotional-balance': 'Tazkiyah: tawazun atifi',
    'stewardship-khalifah': 'Aqeedah: khilafah responsibility (duplicate concept with khalifah-stewardship)',
    'just-leaders': 'Fiqh siyasi: imam adil',
    'leadership-ethics': 'Akhlaq: akhlaq al-qiyadah',
    'jihad-types': 'Fiqh: anwa\' al-jihad',
    'greater-lesser-jihad': 'Tazkiyah/Fiqh: jihad akbar vs asghar',
    'war-conduct': 'Fiqh siyar: adab al-qital',
    'treaty-fulfillment': 'Fiqh siyar: wafa\' bil-ahd (5:1)',
    'conflict-prevention': 'Fiqh siyar: dar\' al-mafasid in conflict',
    'beauty-islam': 'Aesthetics: husn/jamal in Islam',
    'divine-beauty': 'Aqeedah: jamal ilahi',
    'creative-expression': 'Fiqh arts: ibda\' fanni boundaries',
    'islamic-art': 'Culture: al-fann al-islami traditions',
    'work-worship': 'Akhlaq: amal as ibadah',
    'dignified-labor': 'Akhlaq: karahah al-amal',
    'fair-wages': 'Fiqh muamalat: ujrah adilah',
    'workplace-ethics': 'Contemporary fiqh: akhlaq makaniyyah',
    'body-as-trust': 'Tazkiyah: jism as amanah',
    'promise-keeping': 'Akhlaq: wafa\' bil-ahd',
    'property-rights': 'Fiqh: huquq al-milkiyyah',
    'accountability': 'Akhlaq/Aqeedah: muhasabah/hisab',
    'proportionality': 'Fiqh siyar: tanasub in response',
    'oaths-ayman': 'Fiqh: ahkam al-ayman (5:89)',
    'people-of-book': 'Aqeedah/Fiqh: ahl al-kitab rulings',
    'divine-justice': 'Aqeedah: al-\'adl divine attribute',
    'divine-will': 'Aqeedah: al-iradah/al-mashi\'ah',
    'mental-wellbeing': 'Contemporary fiqh: psychological health in Islam',
}

# DEFER candidates: concepts needing scholarly determination
DEFER_IDS = {
    'beauty-islam': 'Boundary between Islamic aesthetics and cultural expression requires scholarly determination',
    'divine-beauty': 'Overlap with attributes-of-beauty; needs scholarly clarification on standalone status',
    'creative-expression': 'Permissibility boundaries require scholarly fatwa-based determination',
    'islamic-art': 'Cultural vs religious classification needs scholarly input',
    'islamic-finance': 'Modern financial instruments need scholarly validation for taxonomy placement',
    'mental-wellbeing': 'Modern psychological concept; mapping to classical tazkiyah framework needs scholarly review',
    'stress-relief': 'Applied contemporary concept; may fold into sabr/tawakkul topics',
    'emotional-balance': 'Modern framing of classical concepts; needs scholarly alignment',
    'habit-formation': 'Modern behavioral science framing; may merge with tarbiyah topics',
    'body-as-trust': 'Conceptual overlap with health-related fiqh; needs scholarly scoping',
    'time-as-trust': 'May be subsumed under time-management or accountability topics',
    'information-ethics': 'Modern discipline; mapping to classical adab/sidq framework needs review',
    'workplace-ethics': 'Modern context; may fold into broader business-ethics topic',
    'environmental-responsibility': 'Modern framing of classical stewardship; scope needs scholarly input',
    'ecological-balance': 'Scientific concept mapped to Quranic mizan; needs scholarly validation',
    'earth-stewardship': 'Overlap with khalifah-stewardship; disambiguation needed',
    'tree-protection': 'Specific environmental ruling; may be too granular for standalone topic',
    'waste-reduction': 'May be subsumed under israf prohibition',
    'participatory-governance': 'Modern political concept; mapping to shura needs scholarly review',
    'racial-equality': 'Modern framing; classical equivalent may be human-equality',
    'justice-for-all': 'Broad concept; may overlap with existing justice topics',
    'right-to-dignity': 'Maqasid framing; overlap with human-dignity topic needs resolution',
    'stewardship-khalifah': 'Near-duplicate of khalifah-stewardship; consolidation recommended',
}

def classify_phantom(pid, similar):
    # DEPRECATE: ID is actually a subdimension ID
    if pid in subdim_ids:
        return 'DEPRECATE', f'ID "{pid}" is a subdimension ID, not a topic ID. Source confused subdimension with topic reference.', None

    # DEFER: explicitly deferred concepts
    if pid in DEFER_IDS:
        return 'DEFER', DEFER_IDS[pid], None

    # MERGE: strong fuzzy match
    if similar and similar[0][1] >= 0.75:
        target = similar[0][0]
        return 'MERGE', f'Strong similarity ({similar[0][1]:.2f}) to existing topic "{target}" ({similar[0][2]}).', target

    # CREATE: known justification exists
    if pid in CREATE_JUSTIFICATIONS:
        return 'CREATE', CREATE_JUSTIFICATIONS[pid], None

    # MERGE: moderate match
    if similar and similar[0][1] >= 0.55:
        target = similar[0][0]
        return 'MERGE', f'Moderate similarity ({similar[0][1]:.2f}) to "{target}" ({similar[0][2]}). May be mergeable pending review.', target

    # Default CREATE for unmatched
    return 'CREATE', f'No existing topic match. Concept "{pid}" appears to be a planned but uncreated topic.', None

# Run classification
register = []
counts = {'CREATE': 0, 'DEPRECATE': 0, 'MERGE': 0, 'DEFER': 0}
scholarly_gaps = []

for pid in phantom_ids:
    similar = find_similar(pid)
    disposition, evidence, merge_target = classify_phantom(pid, similar)
    sources = source_entities.get(pid, [])
    ref_count = ref_counts.get(pid, 0)

    entry = {
        'phantomId': pid,
        'sourceEntities': sources,
        'referenceCount': ref_count,
        'disposition': disposition,
        'evidence': evidence,
        'mergeTarget': merge_target,
        'scholarlyNote': evidence if disposition == 'DEFER' else None,
        'similarExistingTopics': [{'id': s[0], 'score': round(s[1], 3), 'title': s[2]} for s in similar],
        'proposedBy': 'ai-assisted',
        'reviewStatus': 'pending-scholarly-review'
    }
    register.append(entry)
    counts[disposition] += 1

    if disposition == 'CREATE' and any(kw in pid for kw in ['nafs', 'tazkiyah', 'qalb', 'divine', 'asma', 'attributes', 'shirk', 'jinn', 'jihad', 'qisas']):
        scholarly_gaps.append(pid)

# Write Register
os.makedirs('research/mfd-12.1/reconciliation', exist_ok=True)
with open('research/mfd-12.1/reconciliation/WS-C-PHANTOM-RECONCILIATION-REGISTER.json', 'w', encoding='utf-8') as f:
    json.dump({
        'schemaVersion': '1.0.0',
        'workstream': 'MFD-12.1',
        'workPackage': 'WS-C \u2014 Phantom Reference Reconciliation',
        'generatedAt': '2026-11-21T09:15:00+05:00',
        'proposedBy': 'ai-assisted',
        'reviewStatus': 'pending-scholarly-review',
        'totalPhantomRefs': 243,
        'uniquePhantomIds': 200,
        'totalClassified': len(register),
        'dispositionSummary': counts,
        'entries': register
    }, f, indent=2, ensure_ascii=False)

print(f'Classification complete: CREATE={counts["CREATE"]}, DEPRECATE={counts["DEPRECATE"]}, MERGE={counts["MERGE"]}, DEFER={counts["DEFER"]}')
print(f'Scholarly gaps identified: {len(scholarly_gaps)}')
print(json.dumps(counts))
print(json.dumps(scholarly_gaps))
print('REGISTER_WRITTEN')
