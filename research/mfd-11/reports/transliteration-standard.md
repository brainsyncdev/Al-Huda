# MFD-11.5 — Transliteration Standard (ISO 233-2)

| Field | Value |
|-------|-------|
| Workstream | MFD-11.5 WS4 (Lexical Quality) |
| Date | 2026-11-21 |
| Standard | ISO 233-2:1993 (Simplified Arabic Transliteration) |
| Status | Adopted for FAHM Lexical Index |

---

## 1. Rationale for ISO 233-2 Adoption

| Criterion | ISO 233-2 | DIN 31635 | Hans Wehr | ALA-LC | Buckwalter |
|-----------|-----------|-----------|-----------|--------|------------|
| Scholarly precision | ✅ Full diacritical | ✅ Full | ✅ Full | ✅ Full | ❌ ASCII-only |
| Unicode compatibility | ✅ Native | ✅ Native | ⚠️ Mixed | ✅ Native | ❌ Requires mapping |
| Search-friendliness | ⚠️ Needs aliases | ⚠️ Needs aliases | ⚠️ Needs aliases | ❌ Complex digraphs | ✅ ASCII-native |
| Hamza treatment | ✅ Consistent (ʾ) | ✅ Consistent | ⚠️ Variable | ⚠️ Context-dependent | ✅ Mapped |
| Tā' marbūṭa | ✅ ah/at distinction | ✅ ah/at | ✅ ah/at | ✅ ah/at | ⚠️ h only |
| Alif-lām prefix | ✅ al- with hyphen | ✅ al- | ✅ al- | ⚠️ al- or al | ✅ Al- |
| Shadda representation | ✅ Consonant doubling | ✅ Doubling | ✅ Doubling | ✅ Doubling | ✅ Doubling |
| International recognition | ✅ ISO standard | ⚠️ German national | ⚠️ Dictionary-specific | ✅ Library standard | ⚠️ Computational |
| FAHM audience fit | ✅ Best balance | ⚠️ Less known | ⚠️ Too specialized | ❌ Too complex | ❌ Not scholarly |

**Decision**: ISO 233-2 provides the optimal balance of scholarly rigor, international recognition, and practical implementability for a multilingual Qur'anic research platform.

---

## 2. Canonical Convention Table

### 2.1 Consonants

| Arabic | Name | ISO 233-2 | Search Alias | Notes |
|--------|------|-----------|--------------|-------|
| ء | hamzah | ʾ | ' | Unified for initial/medial/final hamzah |
| ب | bā' | b | b | — |
| ت | tā' | t | t | — |
| ث | thā' | ṯ | th | Underdot + macron below |
| ج | jīm | j | j | — |
| ح | ḥā' | ḥ | h | Underdot |
| خ | khā' | ḫ | kh | Hacek (not kh digraph in canonical) |
| د | dāl | d | d | — |
| ذ | dhāl | ḏ | dh | Undermacron |
| ر | rā' | r | r | — |
| ز | zāy | z | z | — |
| س | sīn | s | s | — |
| ش | shīn | š | sh | Hacek |
| ص | ṣād | ṣ | s | Underdot |
| ض | ḍād | ḍ | d | Underdot |
| ط | ṭā' | ṭ | t | Underdot |
| ظ | ẓā' | ẓ | z | Underdot |
| ع | ʿayn | ʿ | ` | Modified letter apostrophe |
| غ | ghayn | ġ | gh | Hacek |
| ف | fā' | f | f | — |
| ق | qāf | q | q | — |
| ك | kāf | k | k | — |
| ل | lām | l | l | — |
| م | mīm | m | m | — |
| ن | nūn | n | n | — |
| ه | hā' | h | h | — |
| و | wāw | w | w | Consonantal use |
| ي | yā' | y | y | Consonantal use |

### 2.2 Vowels

| Arabic | Type | ISO 233-2 | Search Alias | Notes |
|--------|------|-----------|--------------|-------|
| ا | long ā | ā | a | Alif as long vowel |
| و | long ū | ū | u | Wāw as long vowel |
| ي | long ī | ī | i | Yā' as long vowel |
| ـَ | fatḥah | a | a | Short vowel (not stored in lemma) |
| ـُ | ḍammah | u | u | Short vowel (not stored in lemma) |
| ـِ | kasrah | i | i | Short vowel (not stored in lemma) |

### 2.3 Special Characters

| Arabic | Name | ISO 233-2 | Search Alias | Notes |
|--------|------|-----------|--------------|-------|
| ة | tā' marbūṭah | ah (pausal) / at (construct) | a | Context-dependent rendering |
| ال | alif-lām | al- | al- | Always hyphenated, never doubled |
| ـّ | shaddah | doubled consonant | doubled | e.g., rabb → rabb, not rab |
| ء (initial) | hamzat al-waṣl | (omitted) | (omitted) | Not transliterated at word start |

---

## 3. Application Rules

### Rule 1: Single Canonical Form
Every term entry stores exactly ONE primary transliteration in strict ISO 233-2. No variant forms permitted in the canonical field.

### Rule 2: Search Aliases Array
A `searchAliases` array provides simplified ASCII variants for user-facing search:
```json
{
  "transliteration": "ṣabr",
  "searchAliases": ["sabr", "sabir"]
}
```

### Rule 3: Alif-Lām Prefix
- Always rendered `al-` with single hyphen
- NEVER doubled: `al--` is an error
- Assimilation NOT reflected in canonical form (write `al-shams`, not `ash-shams`)
- Assimilation MAY appear in search aliases

### Rule 4: Shadda
Represented by doubling the consonant letter:
- Correct: `rabb`, `muddaththir`, `muttaqeen`
- Incorrect: `rab`, `mudathir`, `mutaqeen`

### Rule 5: Hamzat al-Waṣl
Not transliterated in initial position:
- Correct: `ibn`, `ism`, `istaghfiru`
- Incorrect: `'ibn`, `'ism`, `'istaghfiru`

### Rule 6: Tā' Marbūṭah
- Pausal form: `-ah` (default for standalone terms)
- Construct form: `-at` (when followed by genitive, e.g., `kalimat al-taqwa`)

### Rule 7: Proper Nouns
Capitalized in both canonical and alias forms:
- `Allāh`, `Ibrāhīm`, `Mūsā`, `Quraysh`

---

## 4. Migration Protocol

For each existing term:
1. Parse current transliteration
2. Map to ISO 233-2 canonical form
3. Generate search aliases from current form + common variants
4. Flag any ambiguous cases for manual review
5. Never auto-merge entries based on normalized form alone

---

*This standard supersedes all prior ad-hoc transliteration conventions used in Phase C extraction.*
*proposedBy: "ai-assisted" | reviewStatus: "pending-scholarly-review"*
