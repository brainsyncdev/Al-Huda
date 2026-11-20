# MFD-11.1 — Gap Audit Batch 6

**Generated:** 2026-11-20
**Scope:** Mahr Dowry (mahr-dowry)
**Status:** AI-assisted analysis, pending scholarly review
**HEAD:** bd34760

---

## 2. Mahr Dowry (`mahr-dowry`)

### Topic Definition (Production)
- **Title:** Mahr (Dowry)
- **Slug:** mahr-dowry
- **Urdu Title:** مہر
- **Arabic Title:** المهر
- **Description:** Marriage gift from groom to bride
- **Scope:** Obligation, amount, types
- **Parent Domain:** family-relationships
- **Parent Dimension:** marriage-nikah
- **Parent Subdimension:** marriage-ceremony
- **Related Topics:** marriage-contract, nikah-ceremony
- **Search Aliases:** dowry, bridal gift
- **Specialized:** true
- **Provenance:** pending-scholarly-review
- **Existing production mappings:** 4 (map-mahr-dowry-0468 through map-mahr-dowry-0471)
- **Sibling topics under marriage-nikah:** marriage-importance, spouse-selection, polygyny-conditions, interfaith-marriage

### Evidence Found in Extractions
- **Grep matches for mahr/dowry/saduqat/ujur/nihlah/faridah patterns:** 19 across 6 extraction files
- **Extraction files containing evidence:** 002-al-baqarah-p34, 002-al-baqarah-p35, 004-an-nisa-p1, 004-an-nisa-p3, 005-al-maidah-p1, 028-al-qasas-p1
- **Distinct verse keys with explicit mahr legal content:** 4:4, 4:19, 4:20, 4:24, 4:25, 2:236, 2:237, 5:5, 28:27, 60:10, 33:50
- **Candidates mapping to `mahr-dowry`:** 0 (no candidates carry this topic in existingTopicOverlap despite 4 production mappings existing)

**Key extraction records verified:**

| Extraction File | Verse(s) | Content Captured | commandsAndProhibitions? |
|---|---|---|---|
| 004-an-nisa-p1.json | 4:4 | "Giving women their saduqat (bridal gifts) as nihlah (gracious gift)" + "Women may willingly remit part of mahr" | ✅ COMMAND: "give women their bridal gifts graciously (nihlah)" with Arabic excerpt |
| 004-an-nisa-p3.json | 4:19 | "Prohibition: obstructing wives to reclaim mahr" | ✅ Listed as subordinate subject |
| 004-an-nisa-p3.json | 4:20 | "Replacing wife: cannot reclaim anything even qintar" | ✅ Listed as subordinate subject |
| 004-an-nisa-p3.json | 4:24 | "Paying ujur (compensation) as obligation; mutual agreement beyond obligation permitted" | ⚠️ In mainSubject label only; no dedicated command entry for ujur/faridah |
| 004-an-nisa-p3.json | 4:25 | "Permission to marry believing slave women... with equal ujur and chastity requirements" | ⚠️ In mainSubject label only; no dedicated subordinate subject or command |
| 002-al-baqarah-p35.json | 2:236 | "Pre-consummation divorce without mahr: mut'ah scaled to means" + "Mut'ah as haqq upon muhsinin" | ✅ Subordinate subjects present |
| 002-al-baqarah-p35.json | 2:237 | "Pre-consummation divorce with mahr: half owed" + "Waiver by wife or wali permitted" + "Forgiveness closer to taqwa" | ✅ Subordinate subjects present |
| 005-al-maidah-p1.json | 5:5 | "Marriage to chaste believing and People-of-Book women with mahr" | ✅ Subordinate subject present |
| 028-al-qasas-p1.json | 28:27 | "Service-based marriage contract: eight or ten years of labor as mahr equivalent" | ✅ Subordinate subject present |

### Key Qur'anic Passages Identified

| Verse | Arabic Term | Translation Key Phrase | Legal Prescription | Extraction Status |
|---|---|---|---|---|
| 4:4 | صَدُقَٰتِهِنَّ نِحۡلَةٗ (saduqātihinna niḥlah) | "Give women their bridal gifts graciously" | Primary command establishing mahr as obligatory gracious gift | ✅ Fully extracted with command entry |
| 4:4 | طِبۡنَ لَكُمۡ عَن شَيۡءٖ مِّنۡهُ (tibna lakum 'an shay'in minhu) | "If they willingly remit part of it" | Wife's right to waive portion of mahr | ✅ Extracted as subordinate subject |
| 4:19 | تَأۡخُذُواْ مِمَّآ ءَاتَيۡتُمُوهُنَّ شَيۡـًٔا (ta'khudhū mimmā ātaytumūhunna shay'an) | "Do not take back anything of what you gave them" | Prohibition on reclaiming mahr | ✅ Extracted as subordinate subject |
| 4:20 | قِنطَارٗا (qinṭār) | "Even if you gave a qintar" | Absolute prohibition on reclamation even for large amounts | ✅ Extracted as subordinate subject |
| 4:24 | أُجُورَهُنَّ فَرِيضَةٗ (ujūrahumma farīḍah) | "Pay their compensation as an obligation" | Mahr as prescribed duty (farīḍah); post-obligation mutual agreement permitted | ⚠️ In mainSubject narrative only; no dedicated command/subordinate entry |
| 4:25 | أُجُورَهُنَّ بِٱلۡمَعۡرُوفِ (ujūrahumma bil-ma'rūf) | "Pay their compensation according to what is acceptable" | Equal ujur obligation for slave women marriages | ⚠️ In mainSubject narrative only; no dedicated entry |
| 2:236 | مُتِعُوهُنَّ (muti'ūhunna) | "Provide for them [mut'ah]" | Pre-consummation divorce without specified mahr: mut'ah scaled to means | ✅ Extracted with subordinate subjects |
| 2:237 | نِصۡفُ مَا فَرَضۡتُمۡ (niṣfu mā faraḍtum) | "Half of what you appointed" | Pre-consummation divorce with specified mahr: half owed unless waived | ✅ Extracted with subordinate subjects |
| 5:5 | وَءَاتَوۡهُنَّ أُجُورَهُنَّ (wa ātūhunna ujūrahumna) | "And give them their compensation" | Mahr required for marriage to PoB women | ✅ Extracted as subordinate subject |
| 28:27 | (service as mahr) | "Eight or ten years of labor" | Service-based mahr equivalent (Musa's case) | ✅ Extracted as subordinate subject |
| 60:10 | مَآ أَنفَقُواْ (mā anfaqū) | "What they spent [as mahr]" | Reimbursement of mahr for emigrant believing women | ❌ Not found in grep results |
| 33:50 | (Prophet's provision) | Specific prophetic mahr exceptions | Special dispensation for the Prophet | ❌ Not found in grep results |

### Diagnosis

**MAPPING GAP with partial EXTRACTION WEAKNESS — not a genuine extraction gap.**

This is a **genuine Qur'anic legal subject** with explicit textual grounding. Unlike hadith-derived topics, mahr is named directly in Qur'anic legislation using specific legal terminology:

1. **Ṣaduqāt** (4:4) — the primary term for bridal gift
2. **Niḥlah** (4:4) — qualifying it as a gracious, non-transactional gift
3. **Ujūr/Farīḍah** (4:24) — framing it as prescribed compensation/obligation
4. **Farīḍah** (2:237) — referring to the "appointed" mahr amount

**What IS adequately extracted:**
- The core command of 4:4 (saduqat as nihlah) has a proper `commandsAndProhibitions` entry with Arabic excerpt
- The prohibition on reclaiming mahr (4:19-20) is captured in subordinate subjects
- Pre-consummation divorce mahr rules (2:236-237) are well-extracted with multiple subordinate subjects
- Marriage to PoB women with mahr (5:5) is captured
- Service-based mahr (28:27) is captured

**What is WEAKLY extracted:**
- **4:24 (ujur as faridah):** This critical verse defining mahr as a *prescribed obligation* (farīḍah) and permitting post-obligation mutual agreement appears only in the mainSubject narrative label of 004-an-nisa-p3.json. It lacks a dedicated subordinate subject entry and has NO corresponding `commandsAndProhibitions` entry. This is the most legally significant mahr verse after 4:4.
- **4:25 (ujur for slave women):** Similarly buried in the mainSubject narrative without dedicated entries.
- **60:10 and 33:50:** Not found in extraction grep results at all. These are secondary but still textually explicit mahr references.

**Mapping status:**
- 4 production mappings exist (map-mahr-dowry-0468 through 0471) but zero candidates carry `mahr-dowry` in their `existingTopicOverlap`. This suggests the mappings may be orphaned or attached to candidates that were not properly tagged during synthesis.
- The sibling topics under marriage-nikah (marriage-importance, spouse-selection, polygyny-conditions, interfaith-marriage) do NOT overlap with mahr content — mahr is genuinely distinct.

**Conclusion:** The extraction pipeline successfully captured ~70% of mahr-related legal content. The gap is primarily a **mapping gap** (candidates not tagged with `mahr-dowry`) compounded by a **minor extraction weakness** for 4:24-25 (the ujur/faridah verses lack structured entries) and missing coverage of 60:10 and 33:50.

### Recommendation

1. **Create new candidates** explicitly mapped to `mahr-dowry` for the core legal verses:
   - 4:4 (saduqat/nihlah command) — verify existing mapping covers this
   - 4:24 (ujur/faridah obligation + mutual agreement clause)
   - 4:25 (ujur for slave women)
   - 2:236-237 (pre-consummation divorce mahr rules)
   - 5:5 (mahr for PoB marriage)
   - 60:10 (mahr reimbursement for emigrants)
   - 33:50 (prophetic mahr exceptions)

2. **Add supplementary extraction entries** for 4:24 and 4:25:
   - Add subordinate subject: "Paying ujur as faridah (prescribed obligation)" for 4:24
   - Add subordinate subject: "Mutual agreement on mahr after obligation fulfilled" for 4:24
   - Add subordinate subject: "Equal ujur for believing slave women marriages" for 4:25
   - Add COMMAND entry in commandsAndProhibitions for 4:24 (fa-ātūhunna ujūraahunna farīḍah)

3. **Verify and repair existing 4 production mappings** (map-mahr-dowry-0468–0471): determine which verses they cover and whether they are attached to properly tagged candidates

4. **Expand production mappings** from 4 to ~8-10 after scholarly review

5. **Do NOT merge into general marriage topics:** Mahr is a distinct Qur'anic legal category with its own terminology (ṣaduqāt, ujūr, farīḍah, niḥlah). Flattening it into marriage-contract or nikah-ceremony would lose critical legal precision.

6. **Consider adding search aliases:** "saduqat", "ujur", "faridah", "nihlah", "bridal due" to improve discoverability

### Scholarly Review Required

- Whether 4:24's phrase "fama istamta'tum bihi minhunna" (what you have enjoyed of them) refers to consummation-triggered mahr obligation or to mut'ah marriage specifically — classical tafsir differs on this point
- Whether the mutual agreement clause in 4:24 ("lā junāḥa 'alaykum fīmā tarāḍaytum bihi min ba'd al-farīḍah") permits increasing OR decreasing the mahr after initial specification, or only increasing
- Whether 2:236's mut'ah (provision for pre-consummation divorce without specified mahr) is a separate legal category from mahr or a substitute for it
- Whether 33:50's prophetic exceptions constitute binding law for the ummah or are exclusive dispensations
- Whether 60:10's mahr reimbursement ruling applies only to the specific historical context of emigrant women or establishes a general principle
- Whether the topic scope should include cultural dowry practices (which differ from Qur'anic mahr) or remain strictly limited to the Qur'anic legal concept

---

*All outputs carry `proposedBy: "ai-assisted"` and `reviewStatus: "pending-scholarly-review"`.*
*AI will never replace scholars. This analysis makes their examination more rigorous, transparent and traceable.*

---

## 3. Corruption Prohibition (`corruption-prohibition`)

### Topic Definition (Production)
- **Title:** Corruption Prohibition
- **Slug:** corruption-prohibition
- **Urdu Title:** رشوت ستانی کی ممانعت
- **Arabic Title:** تحریم الفساد
- **Description:** Prohibition of corruption
- **Scope:** Bribery, embezzlement, abuse of power
- **Parent Domain:** governance-political-authority
- **Parent Dimension:** accountability
- **Related Topics:** public-accountability, transparency
- **Search Aliases:** corruption, bribery
- **Specialized:** false
- **Provenance:** pending-scholarly-review
- **Existing production mappings:** 7 (map-corruption-prohibition-0616 through map-corruption-prohibition-0622)
- **Sibling topics under accountability:** public-accountability

### Evidence Found in Extractions
- **Grep matches for fasad/corrupt/bribe/rishwah/suht/akl-amwal-batil patterns:** 44 across 20+ extraction files
- **Distinct verse keys with corruption-related content:** 2:11, 2:12, 2:60, 2:188, 2:205, 4:29, 5:32, 5:33, 7:56, 7:85, 11:85, 13:25, 26:152, 27:48, 28:77, 30:41, 47:22, 89:12, 91:10
- **Candidates mapping to `corruption-prohibition`:** 0 (no candidates carry this topic in existingTopicOverlap despite 7 production mappings)
- **Missing-mappings entries:** 2 (map-corruption-prohibition-0620 for 7:85 and map-corruption-prohibition-0622 for 30:41 both flagged as `no-candidate-coverage`)

**Key extraction records verified:**

| Extraction File | Verse(s) | Content Captured | Structured Entry? |
|---|---|---|---|
| 002-al-baqarah-p3.json | 2:11-12 | "Commanded not to corrupt earth; claiming to be reformers" + "Corruption on earth (fasad fil-ard) and its denial" | ✅ Subordinate subjects present |
| 002-al-baqarah-p30.json | 2:188 | "Prohibition: do not consume wealth among yourselves unjustly or bribe authorities to devour others' property knowingly" | ✅ COMMAND entry + subordinate subject "Anti-corruption: prohibition of bribery and unjust wealth acquisition" |
| 002-al-baqarah-p32.json | 2:205 | "Allah does not love fasad (corruption)" + destruction of crops/livestock | ✅ Subordinate subjects present |
| 004-an-nisa-p4.json | 4:29 | "Prohibition: do not consume one another's wealth unjustly; do not kill yourselves" | ✅ Subordinate subjects present |
| 005-al-maidah-p4.json | 5:32-33 | Sanctity of life formula + hirabah penalty for "waging war against Allah and striving to cause corruption" | ✅ Subordinate subjects present |
| 005-al-maidah-p6.json | 5:42 | "Illicit consumption (suht) as systemic corruption among religious leaders" | ✅ Subordinate subject with transliteration |
| 007-al-araf-p2.json | 7:56 | "Prohibition against spreading corruption after earth rectification" | ✅ Subordinate subjects present |
| 007-al-araf-p3.json | 7:85 | Shu'ayb's command: "fulfill measure and scale justly; do not deprive people; do not spread corruption" | ✅ Subordinate subjects present |
| 028-al-qasas-p4.json | 28:77 | "Do not seek corruption in the earth — Allah does not love corruptors" | ✅ Subordinate subjects present |
| 030-ar-rum-p2.json | 30:41 | "Corruption has appeared throughout land and sea by what hands earned" | ✅ Subordinate subject present |
| 047-muhammad-p2.json | 47:22 | "Turning away producing corruption on earth and severed kinship ties" | ✅ Subordinate subjects present |
| 089-al-fajr-p1.json | 89:12 | "Increased therein the corruption" (Aad/Thamud/Firawn narrative) | ✅ In mainSubject label |

### Key Qur'anic Passages Identified

| Verse | Arabic Term | Translation Key Phrase | Conceptual Category | Current Mapping |
|---|---|---|---|---|
| 2:188 | وَلَا تَأْكُلُوا أَمْوَالَكُم بِالْبَاطِلِ وَتُدْلُوا بِهَا إِلَى الْحُكَّامِ | "Do not consume wealth unjustly nor bribe rulers to devour people's wealth" | **(A) Economic injustice / bribery** — concrete legal prohibition | ❌ NOT mapped to corruption-prohibition |
| 4:29 | لَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ إِلَّا أَن تَكُونَ تِجَارَةً عَن تَرَاضٍ | "Do not consume wealth unjustly except trade by mutual consent" | **(A) Economic injustice** — commercial ethics | ❌ NOT mapped to corruption-prohibition |
| 5:42 | سَمَّاعُونَ لِلْكَذِبِ أَكَّالُونَ لِلسُّحْتِ | "Listeners to lies, devourers of suht (illicit gain)" | **(A) Systemic clerical corruption** | ❌ NOT mapped to corruption-prohibition |
| 2:11-12 | وَإِذَا قِيلَ لَهُمْ لَا تُفْسِدُوا فِي الْأَرْضِ قَالُوا إِنَّمَا نَحْنُ مُصْلِحُونَ | "When told 'do not corrupt the earth' they say 'we are reformers'" | **(C) Hypocritical claim of reform** — self-deception | ❌ NOT mapped to corruption-prohibition |
| 2:205 | وَيَسْعَىٰ فِي الْأَرْضِ لِيُفْسِدَ فِيهَا وَيُهْلِكَ الْحَرْثَ وَالنَّسْلَ | "Strives to corrupt the earth and destroy crops and offspring" | **(B) Fasad fi al-ard** — cosmic/ecological destruction | ✅ map-corruption-prohibition-0617 |
| 5:33 | إِنَّمَا جَزَاءُ الَّذِينَ يُحَارِبُونَ اللَّهَ وَرَسُولَهُ وَيَسْعَوْنَ فِي الْأَرْضِ فَسَادًا | "Penalty for those who wage war against Allah and strive for corruption" | **(B) Fasad fi al-ard** — armed rebellion/hirabah | ✅ map-corruption-prohibition-0618 |
| 7:56 | وَلَا تُفْسِدُوا فِي الْأَرْضِ بَعْدَ إِصْلَاحِهَا | "Do not cause corruption on earth after its reformation" | **(B) Fasad fi al-ard** — post-rectification prohibition | ✅ map-corruption-prohibition-0619 AND map-fasad-fil-ard-0678 ⚠️ DUPLICATE |
| 7:85 | وَلَا تَقْعُدُوا بِكُلِّ صِرَاطٍ تُوعِدُونَ وَتَصُدُّونَ عَن سَبِيلِ اللَّهِ | "Do not sit on every path threatening and averting from Allah's way" | **(B) Fasad fi al-ard** — highway robbery/obstruction | ✅ map-corruption-prohibition-0620 AND map-fasad-fil-ard-0679 ⚠️ DUPLICATE |
| 28:77 | وَلَا تَبْغِ الْفَسَادَ فِي الْأَرْضِ إِنَّ اللَّهَ لَا يُحِبُّ الْمُفْسِدِينَ | "Do not desire corruption in the land; Allah does not love corruptors" | **(B) Fasad fi al-ard** — Qarun narrative warning | ✅ map-corruption-prohibition-0621 AND map-fasad-fil-ard-0680 ⚠️ DUPLICATE |
| 30:41 | ظَهَرَ الْفَسَادُ فِي الْبَرِّ وَالْبَحْرِ بِمَا كَسَبَتْ أَيْدِي النَّاسِ | "Corruption has appeared on land and sea by what hands earned" | **(B) Fasad fi al-ard** — environmental/moral consequence | ✅ map-corruption-prohibition-0622 AND map-fasad-fil-ard-0681 ⚠️ DUPLICATE |
| 47:22 | فَهَلْ عَسَيْتُمْ إِن تَوَلَّيْتُمْ أَن تُفْسِدُوا فِي الْأَرْضِ وَتُقَطِّعُوا أَرْحَامَكُم | "Would you cause corruption on earth and sever kinship ties if you turned away" | **(B) Fasad fi al-ard** — apostasy/social breakdown | ✅ map-fasad-fil-ard-0682 only |
| 2:60 | (Musa narrative context) | "Do not commit abuse on earth spreading corruption" | **(B) Fasad fi al-ard** | ✅ map-corruption-prohibition-0616 AND map-fasad-fil-ard-0677 ⚠️ DUPLICATE |

### Diagnosis

**CONCEPTUAL CONFLATION + MAPPING GAP + DUPLICATE MAPPINGS.**

This is the most complex gap in the batch. The topic `corruption-prohibition` conflates **three distinct Qur'anic concepts** under one modern governance category:

#### (A) Economic Injustice / Wrongful Wealth Consumption / Bribery
- **Verses:** 2:188, 4:29, 5:42, 9:34
- **Arabic terms:** *akl al-amwāl bi-l-bāṭil*, *rishwah*, *suḥt*
- **Nature:** Concrete legal prohibitions against specific economic crimes
- **Current status:** Richly extracted (2:188 has full COMMAND entry; 4:29 has subordinate subjects; 5:42 has suht label) but **NONE mapped to `corruption-prohibition`**. These verses are likely unmapped or mapped to a wealth-property topic.
- **Assessment:** This is the concept that best fits the topic scope "Bribery, embezzlement, abuse of power"

#### (B) Fasad fi al-Ard (Corruption in the Land)
- **Verses:** 2:205, 5:33, 7:56, 7:85, 28:77, 30:41, 47:22, 89:12
- **Arabic terms:** *fasād fī al-arḍ*, *yufsidūna fī al-arḍ*, *al-mufsidūn*
- **Nature:** Broad moral-cosmic category covering ecological destruction, armed rebellion, social disorder, and divine punishment narratives
- **Current status:** Already has its OWN dedicated topic `fasad-fil-ard` (parentDimensionId: `fasad-prohibition`) with 6 mappings
- **Critical finding:** **5 of 7 `corruption-prohibition` mappings are DUPLICATES of `fasad-fil-ard` mappings** (2:60, 7:56, 7:85, 28:77, 30:41). Both topics claim the same verses.

#### (C) Hypocritical Claim of Reform
- **Verses:** 2:11-12
- **Arabic terms:** *mufsidūn* contrasted with *muṣliḥūn*
- **Nature:** Psychological/spiritual diagnosis of self-deception, not a legal prohibition
- **Current status:** Extracted but unmapped to either topic

**Root cause:** The topic `corruption-prohibition` was created as a modern anti-corruption governance category (scope: "Bribery, embezzlement, abuse of power") but was populated with *fasad fi al-ard* verses instead of the actual economic-injustice verses. Meanwhile, the genuine *fasad* verses were ALSO mapped to the separate `fasad-fil-ard` topic, creating systematic duplication.

**Evidence summary:**
- 44 grep matches across 20+ extraction files = rich extraction evidence
- 0 candidates carry `corruption-prohibition` in existingTopicOverlap = complete mapping gap
- 5 of 7 production mappings duplicate `fasad-fil-ard` = structural taxonomy error
- Core bribery/economic verses (2:188, 4:29, 5:42) are NOT among the 7 mapped verses = scope mismatch

### Recommendation

1. **Resolve the `corruption-prohibition` vs `fasad-fil-ard` duplication:**
   - Option A (RECOMMENDED): Redefine `corruption-prohibition` to cover ONLY Category A (economic injustice/bribery/suht). Remove the 5 duplicate fasad mappings (0616, 0619, 0620, 0621, 0622). Retain only 0617 (2:205) and 0618 (5:33) if they have economic dimensions, or remove all 7 and remap from scratch.
   - Option B: Merge `corruption-prohibition` into `fasad-fil-ard` and create a NEW topic `bribery-economic-injustice` for Category A verses.
   - Option C: Keep both topics but add explicit scope boundaries and de-duplicate mappings.

2. **Map Category A verses to `corruption-prohibition` (if Option A):**
   - 2:188 (bribery + unjust wealth consumption) — already has COMMAND extraction
   - 4:29 (unjust wealth consumption + mutual consent trade)
   - 5:42 (suht/illicit gain by religious leaders)
   - 9:34 (hoarding/consuming wealth in batil)
   - 4:10 (consuming orphan wealth unjustly)
   - 83:1-3 (defrauding in measure/weight)

3. **Create candidates** with explicit `corruption-prohibition` overlap for Category A verses (currently 0 candidates)

4. **Reclassify 2:11-12 (Category C):** Map to a hypocrisy/self-deception topic rather than corruption-prohibition

5. **Add search aliases:** "suht", "rishwah", "akl amwal batil", "illicit gain", "wrongful consumption" to distinguish from fasad

6. **Update cross-reference:** The existing relationship `rel-cross-corruption-accountability` linking corruption-prohibition to public-accountability is appropriate for Category A but not for fasad

### Scholarly Review Required

- Whether *fasad fi al-ard* and *akl al-amwāl bi-l-bāṭil* should be treated as one unified "corruption" concept or two distinct Qur'anic categories — classical tafsir generally treats them separately
- Whether 2:188's phrase *tudlū bihā ilā al-ḥukkām* (send it to rulers) refers specifically to judicial bribery or more broadly to any corrupt use of political connections
- Whether 5:42's *suḥt* encompasses all illicit income or is restricted to specific types of clerical misappropriation
- Whether the modern governance concept of "anti-corruption" is an appropriate framing for Qur'anic categories, or whether it imposes a secular bureaucratic framework onto theological concepts
- Whether 5:33 (hirabah penalty) belongs under corruption-prohibition, fasad-fil-ard, or a separate criminal-law topic
- Whether the 5 duplicate mappings between corruption-prohibition and fasad-fil-ard represent intentional dual-classification or an error in the original taxonomy construction

---

*All outputs carry `proposedBy: "ai-assisted"` and `reviewStatus: "pending-scholarly-review"`.*
*AI will never replace scholars. This analysis makes their examination more rigorous, transparent and traceable.*
