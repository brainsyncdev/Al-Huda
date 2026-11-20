# MFD-11.1 — Gap Audit Batch 2

**Generated:** 2026-11-20
**Scope:** Minor Signs of the Hour
**Status:** AI-assisted analysis, pending scholarly review
**HEAD:** bd34760

## Methodology

Per the user-directed workflow:
1. Inspected original topic definition and scope (from `data/taxonomy/topics.json`)
2. Retrieved all candidate passage references (from `synthesis/candidate-index.json`)
3. Read complete Arabic passages in context (from pinned corpus + extraction records)
4. Identified explicit and contextual evidence (grep across 473 extraction files)
5. Distinguished genuine concepts from editorial labels
6. Compared with existing topics to identify overlap
7. Recorded decision and supporting rationale below
8. Unresolved cases flagged for scholarly review

---

## 4. Minor Signs of the Hour (`minor-signs`)

### Topic Definition (Production)
- **Title:** Minor Signs of the Hour
- **Scope:** Moral decay, time acceleration, etc.
- **Description:** Minor signs before Judgment Day
- **Parent:** eschatology-afterlife → signs-of-hour
- **Related:** major-signs, end-times-events
- **Existing production mappings:** 3 (47:18, 54:1, 30:8)
- **Reported gap:** 52 matching verses claimed

### Evidence Found in Extractions
- **Grep matches for specific minor-sign keywords:** 4 across 473 extraction files
- **Candidates mapping to `minor-signs` in candidate-index:** 0
- **Production mappings referencing mapped verses:** 3 exist but have no candidate coverage
- **Keyword search results breakdown:**
  - "approaching" / "near hour": 33 matches — overwhelmingly refer to the Hour itself approaching, not minor signs preceding it
  - Specific hadith-derived minor sign terms (bloodshed, tall buildings, shepherd compete, slave mistress, widespread killing, open adultery, music/wine): **ZERO matches** in Qur'anic extractions
  - "Trust lost" / "knowledge removed": 0 direct matches as minor-sign concepts

### Key Qur'anic Verses Mapped vs. Claimed
| Mapping | Verse | Rationale | Actual Content |
|---|---|---|---|
| map-minor-signs-0657 | 47:18 | "Already have come some of its indications" | General statement that signs of the Hour have arrived; does NOT enumerate specific minor signs |
| map-minor-signs-0658 | 54:1 | "The Hour has come near, and the moon has split" | Moon splitting is classically a MAJOR sign, not minor |
| map-minor-signs-0659 | 30:8 | "Allah created heavens and earth... for a specified term" | Cosmological reflection on finite creation; no minor-sign content |

### Diagnosis
**TAXONOMIC IMPOSITION GAP — not an extraction gap, not a mapping gap.**

The "52 reported matching verses" figure appears to be derived from keyword searches that conflate:
1. Verses about the Hour *approaching* (general eschatological urgency) with
2. Verses about specific *minor signs* (a hadith-derived categorical framework)

The Qur'an does NOT establish "minor signs" as a distinct category. This taxonomy originates entirely from hadith literature (particularly Sahih Bukhari Book of Fitnah and related collections). The three existing production mappings are themselves problematic:
- 47:18 references "indications" generically without enumerating them
- 54:1 describes what classical scholarship categorizes as a MAJOR sign
- 30:8 is a general cosmological verse with no sign-specific content

Zero Qur'anic extraction evidence exists for the specific phenomena listed in the topic scope ("moral decay, time acceleration, etc.") when searched using the standard hadith-derived minor sign vocabulary. The 4 grep matches found are false positives where "trust," "time," or "knowledge" appear in unrelated contexts.

### Recommendation
1. **Reclassify `minor-signs` provenance** from "pending-scholarly-review" to explicitly note "hadith-derived taxonomy imposed on Qur'anic material"
2. **Do NOT create additional Qur'anic mappings** for this topic — the Qur'an does not contain a minor-signs corpus analogous to the hadith tradition
3. **Review existing 3 mappings:**
   - 47:18: Retain but reclassify rationale as "general eschatological indication" rather than "minor sign"
   - 54:1: Reassign to `major-signs` (moon splitting is universally classified as major)
   - 30:8: Consider removing or reassigning to a general "finitude-of-creation" topic
4. **Update gap-analysis.json** to reclassify from "extraction-gap" to "taxonomic-imposition-gap"
5. **Document clearly** that minor signs are a prophetic-hadith framework, not a Qur'anic one, and that users seeking this content should be directed to hadith collections rather than expecting Qur'anic coverage

### Scholarly Review Required
- Whether any Qur'anic verses can legitimately be classified as "minor signs" without imposing hadith categories onto Qur'anic text
- Whether 47:18's "ashrāṭuhā" (its indications) refers to minor signs specifically or to eschatological signs generally
- Whether the topic should exist at all in a Qur'an-focused taxonomy, or whether it should be deprecated/redirected to hadith resources
- Whether the parent dimension `signs-of-hour` should be restructured to distinguish Qur'anic eschatological indicators from hadith-derived sign taxonomies

---

## Summary of Decisions

| Topic | Gap Type | Extraction Evidence | Candidates Mapped | Production Mappings | Action Required |
|---|---|---|---|---|---|
| minor-signs | Taxonomic imposition gap | 0 genuine minor-sign matches; 33 false-positive "approaching" hits | 0 | 3 (problematic) | Reclassify provenance; review/reassign existing mappings; do NOT expand |

## Next Steps

1. **Await scholarly direction** on whether `minor-signs` should remain in Qur'anic taxonomy
2. **Upon approval:** Update gap-analysis.json reclassification
3. **Proceed to remaining extraction gaps** using same audit methodology
4. **Phase D remains gated** — no production changes until human scholarly approval

---

*All outputs carry `proposedBy: "ai-assisted"` and `reviewStatus: "pending-scholarly-review"`.*
*AI will never replace scholars. This analysis makes their examination more rigorous, transparent and traceable.*
