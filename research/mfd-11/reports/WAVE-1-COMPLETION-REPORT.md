# MFD-11 Wave 1 Completion Report

**Generated:** 2026-11-20T12:30:00+05:00
**HEAD:** `08c3899`
**Status:** All 5 surahs genuinely re-extracted, validated, and pushed.

## 1. Complete Passage Inventory

| Surah | Name | Verses | Passages | Ranges |
|---|---|---|---|---|
| 7 | Al-A'raf | 206 | 6 | 1–30, 31–58, 59–102, 103–141, 142–171, 172–206 |
| 9 | At-Tawbah | 129 | 4 | 1–29, 30–66, 67–95, 96–129 |
| 10 | Yunus | 109 | 4 | 1–20, 21–45, 46–70, 71–109 |
| 11 | Hud | 123 | 4 | 1–24, 25–60, 61–95, 96–123 |
| 12 | Yusuf | 111 | 4 | 1–25, 26–52, 53–86, 87–111 |
| **Total** | | **678** | **22** | |

All passage boundaries are meaningful thematic/narrative units, justified in each record's `notes` field.

## 2. Newly Extracted Topic Candidates

| Surah | Candidate IDs | Count | Batch File |
|---|---|---|---|
| 7 | cand-0317..cand-0376 | 60 | candidates-031.json |
| 9 | cand-0407..cand-0446 | 40 | candidates-033.json |
| 10 | cand-0447..cand-0486 | 40 | candidates-034.json |
| 11 | cand-0487..cand-0526 | 40 | candidates-035.json |
| 12 | cand-0527..cand-0566 | 40 | candidates-036.json |
| **Total** | | **220** | |

All candidates have descriptive labels (zero placeholders), full-verse evidence excerpts, and verified topic overlaps where applicable.

## 3. Existing Topic Overlaps Summary

### Scholarly Layer Topics Referenced
- `quran-revelation-process`, `tawheed-rububiyyah`, `tawheed-uluhiyyah`, `shirk-prohibition`
- `divine-power`, `divine-mercy`, `divine-wrath`, `divine-wisdom`
- `adam-story`, `nuh-story`, `hud-story`, `salih-story`, `musa-story`, `yusuf-story`, `yunus-story`
- `dream-interpretation`, `yusuf-dreams`
- `signs-and-reflection`, `trial-and-test`, `self-accountability`
- `fitrah-nature`, `khalifah-vicegerent`, `human-dignity`
- `predestination-free-will`, `faith-increase-decrease`
- `covenants-ahd`, `evidence-standards`, `justice-oppression`
- `fasad-fil-ard`, `environmental-corruption`
- `resurrection-process`, `jahannam-description`, `day-of-judgment`
- `jinn-creation`, `shaytan-enemy`, `unseen-belief`
- `prophetic-character`, `prophet-vs-messenger`
- `intellect-importance`, `knowledge-ignorance`
- `animals-as-communities`, `wealth-ownership`
- `balance-moderation`, `leadership-qualities`
- `qadr-four-levels`

### Curated Layer Topics Referenced
- `tawheed`, `prayer`, `supplication`, `god-consciousness`, `repentance`
- `patience`, `gratitude`, `trust-in-god`, `mercy-and-forgiveness`
- `giving`, `justice`, `good-character`, `parents-and-family`
- `hardship-and-ease`, `knowledge-and-reflection`, `the-hereafter`
- `remembrance`, `prophets`

All overlaps include explanatory `note` fields distinguishing same-concept from related-not-identical relationships.

## 4. New and Missing Topic Proposals

### Potential New Topics (not in existing taxonomy)
Based on Wave 1 extraction, the following Qur'anic concepts appear frequently but lack dedicated taxonomy entries:

1. **Isti'adha (divine refuge-seeking)** — Explicit in 12:23, implicit throughout temptation narratives
2. **Istidraj (gradual delusion)** — Named concept in 7:37, mechanism of extended respite
3. **Libas al-taqwa (garment of righteousness)** — 7:26, clothing as moral metaphor
4. **Nasihah (sincere counsel)** — Prophetic departing lament formula (7:79, 11:2, etc.)
5. **Raf al-jabal (mountain-raising covenant enforcement)** — 7:171, unique Sinai event
6. **Ahl al-A'raf (people of the heights)** — 7:46-48, intermediate eschatological category
7. **Mithaq al-fitrah (primordial covenant)** — 7:172, foundational theological concept
8. **Ta'wil al-ahadith (dream interpretation)** — 12:6, 12:21, 12:36, distinct from tafsir
9. **Latif (divine subtlety)** — 12:100, key attribute in Yusuf narrative resolution
10. **Conditional faith pattern** — Recurring across 7:134, 10:12, 10:48 — belief correlated with circumstances

These are proposals for scholarly consideration, not assertions.

## 5. Semantic Audit Report

### Validation Results
| Surah | Schema | Corpus | Immutability | Semantic Audit |
|---|---|---|---|---|
| 7 | ✅ PASSED | ✅ 287 excerpts | ✅ PASSED | ✅ 0 findings for our files |
| 9 | ✅ PASSED | ✅ 281 excerpts | ✅ PASSED | ✅ 0 findings |
| 10 | ✅ PASSED | ✅ 164 excerpts | ✅ PASSED | ✅ 0 findings |
| 11 | ✅ PASSED | ✅ 226 excerpts | ✅ PASSED | ✅ 0 findings |
| 12 | ✅ PASSED | ✅ 166 excerpts | ✅ PASSED | ✅ 0 findings |

### Known Cross-Record Findings (from skeleton batches, not Wave 1)
The semantic audit reports E_shared_subordinate findings between Wave 1 files and older skeleton batches (surahs 26, 68). These are expected: identical prophetic phrases ("we have believed in the Lord of the worlds", "Lord of Musa and Harun") appear verbatim in both genuine and skeleton extractions. These will resolve when those surahs undergo genuine re-extraction in future waves.

### C_long_label Note
Surah 7 p5 (7:142-171) has mainSubject.label at 743 chars, exceeding the 700-char soft limit. This passage covers the complex Musa-calf-Sabbath-mountain narrative spanning 30 verses; condensing further would lose essential content. Flagged for scholarly review.

## 6. Unresolved Interpretive Questions Deferred to Scholars

### Surah 7 (Al-A'raf)
1. Identity and fate of Ahl al-A'raf (7:46-48): Are they ultimately saved, punished, or eternally intermediate?
2. Mountain-raising (7:171): Literal physical event or metaphorical covenant pressure?
3. Sabbath transgressors transformed into apes (7:164): Physical transformation or moral degradation metaphor?
4. Scope of "immoralities apparent and hidden" (7:33): Exhaustive list or illustrative examples?

### Surah 9 (At-Tawbah)
5. Which historical treaties referenced in 9:1-4 and relationship to sacred months?
6. Scope of "polytheists" in 9:5: all vs. treaty-breakers only?
7. Whether najas in 9:28 denotes ritual impurity or moral filth?
8. Precise scope of Haram exclusion in 9:28?
9. Whether fi sabeeli Allah in 9:60 means military expenditure or any righteous cause?
10. Identity of the three left behind in 9:118?

### Surah 10 (Yunus)
11. Relationship between divine permission (10:100) and human reasoning requirement?
12. Why Yunus's people alone benefited from timely belief (10:98)?
13. Nature of "word that preceded" preventing immediate punishment (10:19)?

### Surah 11 (Hud)
14. Duration of Fire residence given illa ma shaa Allahu exception (11:107)?
15. Precise referent of "those who were given the Scripture before it" (11:17)?

### Surah 12 (Yusuf)
16. Did Joseph's brothers literally prostrate or was it respectful bowing (12:100)?
17. Nature of Yusuf's "sovereignty" (12:101): Political office or spiritual authority?
18. Relationship between dream interpretation (ta'wil) and Quranic exegesis (tafsir)?

## Commits

| Commit | Description |
|---|---|
| `04a3669` | Surah 11 (Hud) genuine re-extraction |
| `5933571` | Surah 9 (At-Tawbah) genuine re-extraction |
| `936b09b` | Surah 10 (Yunus) genuine re-extraction |
| `0ae0482` | Surah 12 (Yusuf) genuine re-extraction |
| `08c3899` | Surah 7 (Al-A'raf) genuine re-extraction |

## Next Steps

Per user directive: **Do not rerun Pass B/C.** Await completion of genuine extraction across all remaining surahs before synthesis.

Recommended Wave 2 scope: Surahs 13–18 (Ar-Ra'd through Al-Kahf, 543 verses).
