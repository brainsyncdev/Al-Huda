import json, os

with open('research/mfd-12.1/reconciliation/WS-C-PHANTOM-RECONCILIATION-REGISTER.json', encoding='utf-8') as f:
    reg = json.load(f)

entries = reg['entries']
summary = reg['dispositionSummary']
total = reg['totalClassified']

create_entries = [e for e in entries if e['disposition'] == 'CREATE']
deprecate_entries = [e for e in entries if e['disposition'] == 'DEPRECATE']
merge_entries = [e for e in entries if e['disposition'] == 'MERGE']
defer_entries = [e for e in entries if e['disposition'] == 'DEFER']

def categorize_create(pid):
    if any(k in pid for k in ['asma','attributes','divine','tawheed','shirk']): return 'Aqeedah (Theology)'
    if any(k in pid for k in ['jinn','shaytan','angel','jibril','mikael','israfil','azrael','kiraman']): return 'Aqeedah (Unseen)'
    if any(k in pid for k in ['revelation','quran','tafsir','interpretation','asbab']): return 'Quran Sciences'
    if any(k in pid for k in ['hadith','sunnah','prophetic','following']): return 'Hadith & Sunnah'
    if any(k in pid for k in ['prayer','fasting','hajj','umrah','eid','ritual','tahajjud','duha','awwabin','congregation']): return 'Fiqh Ibadah'
    if any(k in pid for k in ['marriage','nikah','walima','spousal','chastity','faskh','iddah','newborn','naming','breastfeeding','child','fair-treatment','righteous','respecting','relatives','siblings']): return 'Fiqh Family'
    if any(k in pid for k in ['trade','business','market','commercial','contract','debt','endowment','charity','economic','islamic-finance','slaughter','dietary','partnership','entrepreneur','honest','weights','fair-pricing','fair-wages','property']): return 'Fiqh Muamalat'
    if any(k in pid for k in ['fiqh','usul','ijma','qiyas','ijtihad','legal','judicial','qisas']): return 'Usul al-Fiqh'
    if any(k in pid for k in ['nafs','tazkiyah','qalb','spiritual','heart','patience','repentance','fear','hope','trust','intention','arrogance','character','habit','accountability','body','emotional','stress','mental']): return 'Tazkiyah & Akhlaq'
    if any(k in pid for k in ['community','social','racial','tribes','justice','friendship','welfare','information','consultation','participatory','transparency','leadership','just-leaders']): return 'Social & Governance'
    if any(k in pid for k in ['animal','camel','cow','sheep','bird','insect','marine','humane']): return 'Creation & Animals'
    if any(k in pid for k in ['ecological','earth','environmental','tree','waste','destruction','stewardship','khalifah']): return 'Environment & Stewardship'
    if any(k in pid for k in ['paradise','hell','eternal','punishment','soul','end-times','dajjal','return-of-isa']): return 'Eschatology'
    if any(k in pid for k in ['jihad','war','treaty','conflict','proportionality']): return 'Fiqh Siyar'
    if any(k in pid for k in ['beauty','art','creative','islamic-art']): return 'Arts & Aesthetics'
    if any(k in pid for k in ['work','dignified','workplace','labor']): return 'Work Ethics'
    if any(k in pid for k in ['pharaoh','exodus','miracles','final-message','rise-and-fall','moral-lessons','true-vs-false','dreams','visions']): return 'Qisas & Narratives'
    if any(k in pid for k in ['promise','oaths','people-of-book','common-ground','respectful','key-terms','quranic-concepts','healing','medicinal']): return 'Miscellaneous'
    return 'Uncategorized'

categories = {}
for e in create_entries:
    cat = categorize_create(e['phantomId'])
    if cat not in categories:
        categories[cat] = []
    categories[cat].append(e)

# === WS-C-PHANTOM-SUMMARY.md ===
lines = []
lines.append('# WS-C Phantom Reference Reconciliation Summary')
lines.append('')
lines.append('**Generated:** 2026-11-21T09:15:00+05:00')
lines.append('**Proposed By:** ai-assisted')
lines.append('**Review Status:** pending-scholarly-review')
lines.append('')
lines.append('## Statistics')
lines.append('')
lines.append('| Metric | Count |')
lines.append('|---|---|')
lines.append('| Total phantom references | {} |'.format(reg['totalPhantomRefs']))
lines.append('| Unique phantom IDs | {} |'.format(reg['uniquePhantomIds']))
lines.append('| Classified entries | {} |'.format(total))
lines.append('')
lines.append('### Disposition Breakdown')
lines.append('')
lines.append('| Disposition | Count | Percentage |')
lines.append('|---|---|---|')
for d in ['CREATE','DEPRECATE','MERGE','DEFER']:
    c = summary[d]
    pct = (c/total*100) if total else 0
    lines.append('| {} | {} | {:.1f}% |'.format(d, c, pct))
lines.append('')
lines.append('## Patterns Observed')
lines.append('')
lines.append('### 1. Subdimension-Topic Confusion (DEPRECATE)')
lines.append('{} phantom IDs are actually subdimension IDs that were erroneously referenced as topics. '.format(summary['DEPRECATE']))
lines.append('This indicates the legacy taxonomy builder confused hierarchical levels.')
lines.append('')
lines.append('### 2. Planned Decomposition Topics (CREATE)')
lines.append('The majority of CREATE candidates represent legitimate planned sub-topics that were designed but never materialized. Key clusters:')
lines.append('')
for cat in sorted(categories.keys()):
    items = categories[cat]
    sample = ', '.join(e['phantomId'] for e in items[:5])
    extra = ' (+{} more)'.format(len(items)-5) if len(items) > 5 else ''
    lines.append('- **{}** ({} topics): {}{}'.format(cat, len(items), sample, extra))
lines.append('')
lines.append('### 3. Fuzzy-Match Merge Candidates (MERGE)')
lines.append('{} phantoms have strong or moderate similarity to existing topics and likely represent duplicate naming rather than new concepts.'.format(summary['MERGE']))
lines.append('')
lines.append('### 4. Modern/Applied Concepts (DEFER)')
lines.append('{} phantoms represent contemporary concepts whose mapping to classical Islamic sciences framework requires scholarly determination. '.format(summary['DEFER']))
lines.append('These include modern psychology, environmental science, and governance concepts.')
lines.append('')
lines.append('## Scholarly Gaps Identified')
lines.append('')
lines.append('The following CREATE candidates represent genuine gaps in the current taxonomy where important Islamic concepts discussed in tafsir and classical literature have no corresponding topic:')
lines.append('')
lines.append('| Phantom ID | Domain | References | Significance |')
lines.append('|---|---|---|---|')
scholarly_gap_details = {
    'asma-ul-husna-benefits': ('Asma ul Husna', 'Spiritual benefits of divine names - core devotional topic'),
    'asma-ul-husna-meanings': ('Asma ul Husna', 'Semantic analysis of divine names - foundational theology'),
    'attributes-of-action': ('Divine Attributes', 'Sifat al-fi\'l - standard theological category missing'),
    'attributes-of-beauty': ('Divine Attributes', 'Sifat al-jamal - standard theological category missing'),
    'attributes-of-essence': ('Divine Attributes', 'Sifat al-dhat - standard theological category missing'),
    'attributes-of-majesty': ('Divine Attributes', 'Sifat al-jalal - standard theological category missing'),
    'divine-justice': ('Divine Attributes', 'Al-Adl - major divine attribute absent from taxonomy'),
    'greater-lesser-jihad': ('Jihad Studies', 'Critical distinction often misunderstood; needs clear treatment'),
    'hidden-shirk': ('Tawheed', 'Shirk khafi/riya - essential for spiritual purification'),
    'jihad-types': ('Jihad Studies', 'Classification of jihad types needed for proper understanding'),
    'jinn-nature': ('Unseen World', 'Fundamental aqeedah topic on unseen creation'),
    'jinn-types': ('Unseen World', 'Categories of jinn discussed in hadith literature'),
    'protection-from-jinn': ('Ruqyah', 'Practical adhkar topic with high user demand'),
    'qisas-retaliation': ('Fiqh Jinayat', 'Major fiqh chapter on criminal law missing'),
    'tazkiyah': ('Spiritual Purification', 'Entire discipline of soul purification absent as standalone topic'),
}
for pid, (domain, sig) in scholarly_gap_details.items():
    entry = next((e for e in entries if e['phantomId'] == pid), None)
    refs = entry['referenceCount'] if entry else 0
    lines.append('| `{}` | {} | {} | {} |'.format(pid, domain, refs, sig))
lines.append('')
lines.append('## Recommendations')
lines.append('')
lines.append('1. **Immediate:** Resolve DEPRECATE candidates by removing erroneous subdimension-as-topic references')
lines.append('2. **Short-term:** Review MERGE candidates and consolidate with existing topics where appropriate')
lines.append('3. **Medium-term:** Create high-priority CREATE candidates (those with 3+ references) first')
lines.append('4. **Scholarly review required:** All DEFER candidates need determination before creation')
lines.append('5. **Taxonomy governance:** Implement referential integrity checks to prevent future phantom references')
lines.append('')

with open('research/mfd-12.1/reconciliation/WS-C-PHANTOM-SUMMARY.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

# === WS-C-CREATE-CANDIDATES.md ===
lines = []
lines.append('# WS-C CREATE Candidates')
lines.append('')
lines.append('**Total:** {} topics recommended for creation'.format(len(create_entries)))
lines.append('**Status:** pending-scholarly-review')
lines.append('')
for cat in sorted(categories.keys()):
    items = categories[cat]
    lines.append('## {} ({})'.format(cat, len(items)))
    lines.append('')
    lines.append('| Phantom ID | Refs | Justification |')
    lines.append('|---|---|---|')
    for e in sorted(items, key=lambda x: x['referenceCount'], reverse=True):
        lines.append('| `{}` | {} | {} |'.format(e['phantomId'], e['referenceCount'], e['evidence']))
    lines.append('')

with open('research/mfd-12.1/reconciliation/WS-C-CREATE-CANDIDATES.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

# === WS-C-DEPRECATE-CANDIDATES.md ===
lines = []
lines.append('# WS-C Deprecate, Merge & Defer Candidates')
lines.append('')
lines.append('**Status:** pending-scholarly-review')
lines.append('')
lines.append('## DEPRECATE Candidates ({})'.format(len(deprecate_entries)))
lines.append('')
lines.append('These phantom IDs are actually subdimension IDs that were erroneously used as topic references.')
lines.append('')
lines.append('| Phantom ID | Source Entities | Evidence |')
lines.append('|---|---|---|')
for e in deprecate_entries:
    sources = ', '.join(s['sourceEntity'] for s in e['sourceEntities'])
    lines.append('| `{}` | {} | {} |'.format(e['phantomId'], sources, e['evidence']))
lines.append('')
lines.append('## MERGE Candidates ({})'.format(len(merge_entries)))
lines.append('')
lines.append('| Phantom ID | Merge Target | Similarity | Evidence |')
lines.append('|---|---|---|---|')
for e in merge_entries:
    target = e.get('mergeTarget', 'N/A') or 'N/A'
    sim = e['similarExistingTopics'][0]['score'] if e['similarExistingTopics'] else 'N/A'
    lines.append('| `{}` | `{}` | {} | {} |'.format(e['phantomId'], target, sim, e['evidence']))
lines.append('')
lines.append('## DEFER Candidates ({})'.format(len(defer_entries)))
lines.append('')
lines.append('| Phantom ID | Scholarly Note |')
lines.append('|---|---|')
for e in defer_entries:
    note = e.get('scholarlyNote', '') or ''
    lines.append('| `{}` | {} |'.format(e['phantomId'], note))
lines.append('')

with open('research/mfd-12.1/reconciliation/WS-C-DEPRECATE-CANDIDATES.md', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('ALL_DELIVERABLES_WRITTEN')
for fn in ['WS-C-PHANTOM-SUMMARY.md', 'WS-C-CREATE-CANDIDATES.md', 'WS-C-DEPRECATE-CANDIDATES.md', 'WS-C-PHANTOM-RECONCILIATION-REGISTER.json']:
    fp = 'research/mfd-12.1/reconciliation/' + fn
    print('{}: {} bytes'.format(fn, os.path.getsize(fp)))
