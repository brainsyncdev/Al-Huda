# EXPLORE Content and Editorial Standards

**Document Status:** Draft — Pending Stakeholder Review  
**Date:** November 11, 2026  
**Baseline:** PRD v4.1 / Sprint 54  
**Decision Reference:** STAKEHOLDER-DECISION-2026-11-11.md (D-08)  
**Architecture Reference:** THREE-MODE-ARCHITECTURE.md §3.3  
**Purpose:** Define content, editorial, and terminology standards for the EXPLORE mode

---

## Executive Summary

EXPLORE is Al-Huda's **beginner-first discovery experience** for seekers and curious visitors. It is a pressure-free entry point into the Quran — designed for people who may have no background in Islam, no familiarity with Arabic, and no prior experience with traditional Islamic study methods.

EXPLORE is **not** a stripped-down FAHM. It is a purpose-built experience with its own content, editorial voice, terminology standards, and presentation rules. It shares the same Quran text, translations, and Tafsir as FAHM (D-03), but it presents them through a lens designed for newcomers.

**Core commitments:**
- No conversion pressure, manipulative onboarding, or identity assumptions
- Clear separation between Quranic text, translation, Tafsir, and editorial explanation
- Respectful comparative context where properly sourced
- No AI religious answers (D-10)
- No fabrication of scholarly approvals or sources
- Full preservation of data integrity and provenance rules
- Account-free, local-first (D-09)
- Beginner-first in every editorial decision

**Authorization status:** This is a specification for stakeholder review, not an implementation authorization.

---

## 1. Target Audience Personas

EXPLORE serves four primary personas. Content must be written to address the least-knowledgeable of these readers without condescending to the most knowledgeable.

### Persona 1: The Curious Visitor

**Who:** Someone with no religious background who stumbled onto the site, perhaps via a search for "what does the Quran say about kindness" or "who is Mary in Islam."

**Needs:**
- Zero assumed prior knowledge
- Plain English explanations of every term
- Short, self-contained entries
- No pressure to continue or "learn more about Islam"

**Barriers:**
- Islamic terminology is opaque
- Doesn't know the difference between Quran, Hadith, and Tafsir
- May be wary of proselytizing

**Success looks like:** They read one entry, understand it clearly, and leave with a respectful impression — whether or not they return.

### Persona 2: The Seeker

**Who:** Someone exploring Islam seriously, often comparing it with Christianity, Judaism, secular humanism, or other traditions they were raised in.

**Needs:**
- Honest answers to hard questions
- Acknowledgment of interpretive diversity within Islam
- Respectful comparative context where relevant
- Clear sourcing — they want to know *who* says this and *why*

**Barriers:**
- Has encountered hostile or dishonest presentations of Islam online
- Skeptical of authority claims
- Wants intellectual honesty, not sales pitches

**Success looks like:** They feel the site treats them as an intelligent adult, answers their questions without evasion, and doesn't pretend complexity away.

### Persona 3: The New Muslim

**Who:** Someone who has recently converted (or is in the process) and needs foundational understanding without the embarrassment of "not knowing basic things."

**Needs:**
- Foundational concepts explained without assuming childhood familiarity
- A safe place to ask "obvious" questions
- Guidance on where to go next in their learning journey
- No judgment, no pressure to "perform" Muslim identity

**Barriers:**
- May feel socially pressured to already "know" things
- Existing Muslim communities sometimes assume cultural knowledge
- Overwhelmed by the volume of what there is to learn

**Success looks like:** They find a patient, clear starting point and a path that doesn't require them to pretend they already belong.

### Persona 4: The Academic

**Who:** A student, researcher, or journalist studying Islam from a scholarly or analytical perspective.

**Needs:**
- Accurate attribution and sourcing
- Clear distinction between Quranic text and interpretive traditions
- Access to primary sources (translations, Tafsir references)
- No devotional framing imposed on them

**Barriers:**
- Frustrated by sites that blur the line between scripture and interpretation
- Wants to know what the text *says* versus what Muslims *believe it means*

**Success looks like:** They can use EXPLORE as a reliable starting point for understanding what the Quran contains and how it is traditionally read, with clear pointers to deeper scholarly resources.

---

## 2. Content Principles

These principles are non-negotiable. Every piece of EXPLORE content must satisfy all of them.

### 2.1 Beginner-First

Assume no prior knowledge. Do not assume the reader knows:
- What the Quran is (beyond "a book")
- Who Muhammad ﷺ is
- What "Surah" or "Ayah" means
- What "Allah" refers to
- What Islam's core practices are
- Any Arabic at all

### 2.2 Explain Terms on First Use

Every Islamic or Arabic term must be explained the first time it appears in a piece of content. After first use, the term may be used without re-explanation within the same piece — but a glossary link must remain available.

### 2.3 No Jargon Without Definition

This includes both Islamic jargon (e.g., *Tafsir*, *Asbab al-Nuzul*, *Mutawatir*) and academic jargon (e.g., *exegesis*, *hermeneutics*, *textual criticism*). If a term is necessary, define it.

### 2.4 Respectful Tone Throughout

The reader is a guest. The tone is that of a knowledgeable, patient host — never condescending, never defensive, never triumphalist.

### 2.5 No Conversion Pressure

EXPLORE never:
- Asks "Are you interested in learning more about Islam?" in a leading way
- Uses emotional manipulation or urgency
- Presents Islam as the obvious answer to the reader's life
- Implies that reading EXPLORE is a step toward conversion
- Uses phrases like "discover the truth" or "find your path"

### 2.6 Honest About What the Quran Says and Doesn't Say

EXPLORE does not:
- Claim the Quran addresses topics it does not address
- Stretch interpretations to fit modern questions
- Pretend controversial verses have simple readings
- Hide interpretive diversity behind a single authoritative voice

### 2.7 Clear Labeling of Source Layers

Every piece of content must make visually and textually clear which of the following layers the reader is looking at:

| Layer | What it is | How it must be labeled |
|---|---|---|
| **Quranic text** | The Arabic scripture itself | Clearly marked as Quran; immutable; with surah/ayah reference |
| **Translation** | A human rendering of meaning in another language | Attributed to translator/edition; labeled as *translation*, not *the Quran in English* |
| **Tafsir** | Classical or contemporary scholarly commentary | Attributed to author and work; labeled as *commentary* |
| **Editorial explanation** | EXPLORE's own explanatory writing | Labeled as *editorial*; never presented as scripture or scholarly consensus |

### 2.8 Acknowledge Diversity of Interpretation

Where Muslims themselves disagree about the meaning of a verse or topic, EXPLORE must:
- Name the existence of multiple views
- Avoid presenting one view as "the" Islamic position without qualification
- Point to deeper resources for readers who want the full picture

### 2.9 No Assertion of Religious Authority

EXPLORE never speaks *as* a religious authority. It speaks *about* the Quran and Islamic tradition. Phrases like "Islam says," "Muslims believe," and "scholars interpret" are acceptable. Phrases like "God commands you" or "you must" are not.

---

## 3. Terminology Standards

### 3.1 Glossary System

EXPLORE maintains a shared glossary of Islamic and Quranic terms. The glossary is:
- Stored as structured data with provenance metadata
- Accessible via a glossary tool in the EXPLORE UI
- Linked from every first-use occurrence of a term in content

Each glossary entry contains:
- Term (Arabic script)
- Transliteration (e.g., *ṣabr*)
- Plain-English meaning
- Brief contextual note (1–2 sentences)
- Related terms
- Editorial status (`pending-scholarly-review` until approved)

### 3.2 First-Use Explanation Format

On first use in any content piece, a term must appear in this form:

> **Pattern:** *Arabic term* (transliteration) — English gloss

**Example:**
> The Quran frequently praises *ṣabr* (صبر) — often translated as "patience," though it carries a richer sense of steadfast perseverance through difficulty.

Subsequent uses within the same piece may use the transliteration alone, with a glossary link available.

### 3.3 Arabic Terms with Transliteration and Translation

All Arabic terms must be presented with:
1. **Arabic script** (at least on first use): صبر
2. **Transliteration** using a consistent system (e.g., *ṣabr*): uses diacritics for precision
3. **English gloss**: a plain-language meaning

### 3.4 When to Use Arabic Terms vs. English Equivalents

| Situation | Use |
|---|---|
| Term has no good English equivalent (e.g., *taqwā*, *tawḥīd*) | Arabic term with gloss |
| English equivalent is clear and common (e.g., "prayer," "charity") | English term; Arabic in parentheses on first use if helpful |
| Term is widely known in English (e.g., "Quran," "Muslim," "Mosque") | English form |
| Term is central to the piece's topic | Arabic term throughout, with glossary link |

### 3.5 Examples: Good vs. Bad Terminology Presentation

**❌ Bad (jargon-heavy, unexplained):**
> The *mutashābihāt* verses require careful *ta'wīl* and cannot be read *ʿalā ẓāhirihim* without falling into *taʿṭīl*.

**✅ Good (beginner-friendly):**
> Some Quranic verses have meanings that are not immediately obvious. Scholars have historically disagreed about how literally to read these passages — a discussion that continues today.

**❌ Bad (over-simplified, loses meaning):**
> The Quran talks about patience.

**✅ Good (clear, accurate, contextual):**
> The Quran frequently praises *ṣabr* (صبر) — a quality often translated as "patience," though it carries a richer sense of steadfast perseverance through difficulty.

---

## 4. Content Categories for EXPLORE

EXPLORE content falls into five categories. Each has distinct editorial requirements.

### 4.1 Common Questions

**What:** FAQ-style entries addressing the questions seekers and curious visitors actually ask.

**Examples:**
- "What is the Quran?"
- "Do Muslims worship the same God as Christians?"
- "Why does the Quran mention war?"
- "Who was Mary in the Quran?"

**Editorial requirements:**
- Written in plain, direct language
- Answer the question in the first paragraph
- Provide context and nuance after the direct answer
- Cite specific Quranic passages where relevant
- Acknowledge where sincere disagreement exists
- Status: `pending-scholarly-review` until approved

### 4.2 Topic Introductions

**What:** Beginner-friendly versions of curated topics from the shared foundation. These are *not* copies of FAHM topic pages — they are rewritten for EXPLORE's audience.

**Examples:**
- "Kindness in the Quran" (beginner version of the curated topic)
- "What the Quran says about justice"
- "Stories of prophets"

**Editorial requirements:**
- Derived from shared curated topics but rewritten for newcomers
- No assumption of prior knowledge
- Clear connection to specific Quranic passages
- Attribution preserved from source topic
- Status: `pending-scholarly-review` until approved

### 4.3 Reading Paths

**What:** Guided exploration sequences that take a reader through a topic or theme across multiple entries.

**Examples:**
- "First steps in the Quran" — a 5-entry path introducing the Quran's structure, themes, and most-read passages
- "Understanding mercy" — a path through Quranic passages on compassion
- "Who is Jesus in Islam?" — a path through Quranic references to Jesus and Mary

**Editorial requirements:**
- Each step is self-contained (can be read alone)
- Steps build progressively
- No pressure to complete the path
- Clear indication of length and time commitment
- Status: `pending-scholarly-review` until approved

### 4.4 Contextual Explainers

**What:** Background on the historical, cultural, and linguistic context that helps readers understand the Quran.

**Examples:**
- "7th-century Arabia: the world the Quran emerged in"
- "How the Quran was preserved"
- "What is Tafsir?"
- "Arabic language basics for Quran readers"

**Editorial requirements:**
- Historically accurate and sourced
- Clear distinction between established historical fact and scholarly interpretation
- No devotional framing imposed on non-devotional readers
- Status: `pending-scholarly-review` until approved

### 4.5 Comparative Context

**What:** Respectful comparisons between Quranic teachings and other religious or philosophical traditions — only where properly sourced and genuinely illuminating.

**Examples:**
- "Mary in the Quran and the Bible"
- "Fasting in Islam and other traditions"
- "The Quran's view of earlier scriptures"

**Editorial requirements:**
- **Must** be sourced from credible academic or interfaith references
- **Must not** be proselytizing or triumphalist
- **Must** represent the other tradition accurately and charitably
- **Must** be reviewed for fairness to all traditions mentioned
- **Must not** be included where comparison would be misleading or reductive
- Status: `pending-scholarly-review` until approved — with additional review for fairness

---

## 5. Editorial Standards

### 5.1 Provenance Metadata

Every piece of EXPLORE content must carry:

```yaml
provenance:
  type: explore-content           # or: common-question, topic-intro, reading-path, explainer, comparative
  title: "Kindness in the Quran"
  author: "editorial-team"        # or named curator
  created: "2026-11-11"
  lastReviewed: null              # null until first review
  status: pending-scholarly-review
  sources:                        # explicit list of sources consulted
    - type: quran
      references: ["41:34", "3:134", "4:36"]
    - type: tafsir
      references: ["ibn-kathir:41:34"]
    - type: scholarly
      references: []              # populated after review
  reviewNotes: []                 # populated during review
```

### 5.2 Pending Scholarly Review

All EXPLORE content is marked `pending-scholarly-review` until it has been reviewed by a qualified reviewer. This status must:
- Be visible in internal tooling
- Prevent the content from being presented as "scholarly approved"
- Not be silently overridden by any mode or feature

### 5.3 No Fabrication

EXPLORE must never:
- Fabricate a source, citation, or quotation
- Fabricate a scholarly reviewer or approval
- Attribute a view to a named scholar without evidence
- Present an editorial interpretation as a classical Tafsir position
- Invent a "consensus" where none exists

### 5.4 Clear Distinction Between Source and Commentary

The Quranic text is immutable. Editorial explanation is not scripture. The visual and textual presentation must make this distinction unmissable:

- Quranic text appears in a distinct visual treatment (Arabic script, dedicated block)
- Translations are labeled with translator/edition
- Tafsir is labeled with author and work
- EXPLORE's own explanations are labeled as *editorial*

### 5.5 Attribution Preservation

All translations and Tafsir used in EXPLORE retain their full attribution, exactly as in FAHM. No mode may strip or alter attribution.

### 5.6 Review Workflow

EXPLORE content moves through this workflow:

1. **Draft** — written by editorial team
2. **Internal review** — checked against these content standards
3. **Scholarly review** — reviewed by qualified reviewer (when available)
4. **Approved** — status changes to `reviewed`; provenance metadata updated
5. **Published** — surfaced in EXPLORE UI

Content at any stage before `approved` must not be presented as scholarly-approved.

---

## 6. Content Presentation Rules

### 6.1 Presenting Quranic Text

When EXPLORE presents a Quranic verse:

- Show the Arabic text (Uthmani script, Hafs transmission)
- Show a translation, labeled with translator/edition
- Provide brief context: why this verse is being shown, what topic it relates to
- Cite the surah and ayah number
- Do not add interpretive gloss *inside* the translation

**Example layout:**

```
┌─────────────────────────────────────────────┐
│  Quran · Surah Fussilat 41:34              │
│                                             │
│  [Arabic text]                              │
│                                             │
│  "Good and evil are not equal. Repel evil   │
│   with what is better — and the one who     │
│   was your enemy will become a close        │
│   friend."                                   │
│  — Translation: [translator name]           │
│                                             │
│  Context: This verse is often cited in     │
│  discussions of how to respond to hostility.│
│  [Editorial — see editorial standards §5.4] │
└─────────────────────────────────────────────┘
```

### 6.2 Presenting Tafsir

When EXPLORE presents Tafsir:

- Attribute to the specific work and author
- Indicate the era and scholarly tradition (classical/contemporary, school of thought where relevant)
- Make clear this is *one scholar's reading*, not *the* reading
- Do not present Tafsir as the final word on a verse

### 6.3 Presenting Editorial Explanations

EXPLORE's own explanatory writing must:

- Be visually and textually labeled as *editorial*
- Never be formatted in a way that could be confused with Quranic text or Tafsir
- Use hedging language appropriate to the certainty of the claim ("scholars generally agree," "one common reading is," "the text appears to suggest")
- Not speak in the voice of religious authority

### 6.4 Handling Controversial or Misunderstood Topics

For verses and topics that are commonly contested (e.g., verses on warfare, gender, punishment):

- Acknowledge the controversy directly — do not pretend it away
- Present the range of mainstream scholarly interpretations
- Identify what is agreed upon and what is disputed
- Avoid apologetics that distort the text
- Avoid hostile framings that distort the tradition
- Point readers to deeper resources for the full picture

### 6.5 Presenting Comparative Context

When comparing Quranic teachings with other traditions:

- Source every comparative claim
- Represent the other tradition charitably and accurately
- Avoid language that implies superiority or inferiority
- Make clear whether the comparison is textual, historical, or theological
- Do not use comparison as a covert persuasion tool

---

## 7. Tone and Voice Guidelines

### 7.1 The EXPLORE Voice

EXPLORE speaks like a **knowledgeable, patient, honest friend** — someone who knows the material well, respects the reader's intelligence, and has no agenda beyond helping them understand.

**The voice is:**
- Welcoming but not pushy
- Informative but not preachy
- Honest about complexity
- Respectful of the reader's autonomy
- Confident in the material without being defensive

### 7.2 Examples: Good vs. Bad Tone

**❌ Bad (pushy, conversion-oriented):**
> The Quran's message of mercy will transform your life. Open your heart to its truth.

**✅ Good (welcoming, non-coercive):**
> Mercy is one of the Quran's most frequently emphasized themes. Here are some of the passages where it appears.

**❌ Bad (preachy, authoritative):**
> Muslims believe that the Quran is the literal word of God, and you should too.

**✅ Good (informative, descriptive):**
> Muslims believe the Quran is the literal word of God, revealed to Prophet Muhammad ﷺ. This belief is central to Islamic faith and shapes how Muslims approach the text.

**❌ Bad (defensive, dismissive of questions):**
> Critics often misunderstand this verse, but the true meaning is clear.

**✅ Good (honest, acknowledges complexity):**
> This verse has been read in several different ways over the centuries. Here are the main interpretations and the reasoning behind each.

**❌ Bad (condescending to the reader):**
> Simply put, for those who may not be familiar, God — or Allah, as Muslims call Him — is...

**✅ Good (respectful, direct):**
> Allah (الله) is the Arabic word for God. Muslims use this word whether they speak Arabic or not.

---

## 8. What EXPLORE Is NOT

To prevent scope creep and mission drift, it is important to be explicit about what EXPLORE is not:

### 8.1 Not a Conversion Tool

EXPLORE does not exist to convert anyone. It exists to help people understand the Quran. If a reader leaves EXPLORE with a respectful understanding and no interest in Islam, that is a success — not a failure.

### 8.2 Not a Simplified FAHM

EXPLORE is not FAHM with features removed. It is a different experience for a different audience. FAHM assumes a Muslim reader who wants to go deep; EXPLORE assumes a newcomer who needs orientation.

### 8.3 Not a Platform for Religious Debate

EXPLORE does not host debates, respond to critics point-by-point, or engage in apologetics. It presents the Quran and mainstream Islamic readings of it with honesty and context.

### 8.4 Not a Substitute for Scholarly Study

EXPLORE is a starting point, not a destination. It points readers toward deeper resources — classical Tafsir, scholarly works, qualified teachers — when they are ready.

### 8.5 Not a Source of Religious Rulings

EXPLORE does not issue *fatwas* or religious rulings. It does not tell readers what to do. It helps them understand what the Quran says and how it has been understood.

---

## 9. Relationship to Shared Foundation

### 9.1 Shared Data, Different Presentation

EXPLORE reads from the same shared foundation as FAHM (D-03):

- Same Quran text
- Same translation editions
- Same Tafsir resources
- Same curated topic references
- Same root and morphology data

### 9.2 What EXPLORE May Do Differently

- Present **simplified versions** of curated topics (rewritten, not copied)
- Offer **beginner-friendly translations** as defaults (user may still select others)
- Provide **glossary and contextual help** not present in FAHM
- Build **reading paths** that do not exist in FAHM
- Write **common questions and explainers** specific to EXPLORE's audience

### 9.3 What EXPLORE Must Not Do

- Modify the underlying Quran text, translations, or Tafsir
- Claim scholarly approval that has not been granted
- Duplicate FAHM content verbatim (rewrite for the audience)
- Strip attribution from any source
- Present editorial content as scholarly

### 9.4 Editorial, Not Scholarly

EXPLORE content is editorial. It is not scholarly certification. The `pending-scholarly-review` status applies to EXPLORE content just as it does to FAHM content, and the same provenance and integrity rules apply.

---

## 10. Open Questions

The following questions require stakeholder decisions before implementation:

### Q-2 (from STAKEHOLDER-DECISION-2026-11-11.md): Should EXPLORE Require Onboarding?

**Recommendation:** A minimal welcome screen — not an account, not a questionnaire, not an identity declaration. Something like:

> "Welcome. EXPLORE is a place to read and learn about the Quran at your own pace. No account needed. Start anywhere."

With a single "Begin" or "Browse" option. No leading questions, no pressure.

### What Comparative Traditions Are Appropriate to Reference?

**Open question.** Suggested policy:
- Reference traditions only where the Quran itself references them (earlier scriptures, prophets shared with Judaism and Christianity)
- Reference other traditions only where there is a genuine, sourced comparative question
- Avoid reference to traditions where comparison would be reductive or misleading
- Defer specific list to scholarly review

### How to Handle Topics That Are Commonly Misunderstood?

**Open question.** Suggested policy:
- Name the misunderstanding directly
- Present what the text actually says
- Present the range of mainstream scholarly readings
- Acknowledge where even scholars disagree
- Do not pretend there is a simple answer where there is not

### Who Reviews EXPLORE Content for Beginner-Friendliness?

**Open question.** Suggested policy:
- Scholarly review for accuracy and fairness
- Separate "beginner-friendliness" review by someone representative of the target audience (e.g., a non-Muslim reader, a new Muslim, an educator)
- Both reviews required before content leaves `pending-scholarly-review` status

---

## 11. Authorization Boundary

**This document is a specification, not an implementation authorization.**

The following are **not** authorized by this document:

- ❌ Implementation of EXPLORE mode
- ❌ Creation of EXPLORE content
- ❌ Modification of existing FAHM content
- ❌ Modification of the shared foundation
- ❌ Deployment of any changes
- ❌ Sprint 55 or any subsequent sprint

**What this document does authorize:**

- ✅ Stakeholder review of EXPLORE's content and editorial standards
- ✅ Further specification work based on these standards
- ✅ Use of these standards as the basis for implementation planning — *after* stakeholder approval

Implementation planning may only begin after:
1. This specification is approved by the product owner
2. Open questions (Q-2 and others) are resolved
3. Implementation authorization is explicitly granted in a separate decision

---

## 12. Acceptance Criteria

This specification is ready for stakeholder approval when:

- [ ] EXPLORE's purpose and audience clearly defined
- [ ] Target personas specified with needs and barriers
- [ ] Content principles are explicit and non-negotiable
- [ ] Terminology standards include examples of good and bad practice
- [ ] Content categories are defined with editorial requirements
- [ ] Editorial standards preserve provenance and prevent fabrication
- [ ] Presentation rules distinguish source text from commentary from editorial
- [ ] Tone guidelines include concrete examples
- [ ] Boundaries (what EXPLORE is not) are explicit
- [ ] Relationship to shared foundation is clear
- [ ] Open questions are visible and awaiting decision
- [ ] Authorization boundary is explicit
- [ ] No implementation is authorized

---

## 13. Next Steps

1. **Stakeholder review** of this specification
2. **Resolve open questions** (Q-2 and others identified in §10)
3. **Approve or revise** this specification
4. **Coordinate with related specifications:**
   - THREE-MODE-ARCHITECTURE.md
   - FAHM-FUNCTIONALITY-MAP.md
   - NOOR-CHILD-SAFETY-SPECIFICATION.md
   - MODE-NAVIGATION-SPECIFICATION.md
5. **After all specifications approved:** proceed to implementation planning (separate authorization required)

---

**Document prepared by:** Automated quality review  
**Date:** November 11, 2026  
**Status:** Draft — Pending Stakeholder Review